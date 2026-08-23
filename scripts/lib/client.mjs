import { createHash, randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { platform } from 'node:os';
import { deleteCredential, getCredential, storeCredential } from './credential-store.mjs';

export { deleteCredential, getCredential, storeCredential };

export const APP_ID = 'c8d4bd65-7694-4c34-b8cd-4d54b44b389e';
export const APP_NAME = 'Quip Bot setup';
export const CLIENT_ID = 'quip-setup';
export const API_VERSION = '1.0';
export const WORDPRESS_SERVICE = 'dev.quipbot.setup.wordpress';
export const ACCOUNT_SERVICE = 'dev.quipbot.setup.account';

const MAX_RESPONSE_BYTES = 1_048_576;
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1', 'quip.loc']);
const SECRET_KEY = /(password|secret|token|activation_grant|license_key|api_key|authorization)/i;

export class PublicError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

export function pkceChallenge(verifier) {
  return createHash('sha256').update(verifier).digest('base64url');
}

export function normalizeSite(value) {
  if (typeof value !== 'string' || value.length > 500) {
    throw new PublicError('invalid_site_url', 'Provide the canonical WordPress site URL.');
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new PublicError('invalid_site_url', 'Provide the canonical WordPress site URL.');
  }

  const local = LOCAL_HOSTS.has(url.hostname.toLowerCase()) || url.hostname.toLowerCase().endsWith('.loc');
  if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:'))
      || url.username || url.password || url.search || url.hash) {
    throw new PublicError('invalid_site_url', 'Use the canonical HTTPS site URL; HTTP is accepted only for local development.');
  }

  const path = url.pathname.replace(/\/{2,}/g, '/').replace(/\/$/, '');
  return `${url.origin}${path}`;
}

function normalizeReturnedSite(value) {
  try {
    return normalizeSite(String(value).replace(/\/$/, ''));
  } catch {
    return '';
  }
}

function safeEndpoint(value, site, expectedPathSuffix) {
  let endpoint;
  try {
    endpoint = new URL(value);
  } catch {
    throw new PublicError('invalid_compatibility', 'The plugin returned an invalid setup endpoint.');
  }
  const siteUrl = new URL(site);
  const sitePath = siteUrl.pathname === '/' ? '' : siteUrl.pathname.replace(/\/$/, '');
  const expectedPath = `${sitePath}${expectedPathSuffix}`.replace(/\/{2,}/g, '/');
  if (endpoint.origin !== siteUrl.origin
      || endpoint.pathname !== expectedPath
      || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) {
    throw new PublicError('invalid_compatibility', 'The plugin returned an unexpected setup endpoint.');
  }
  return endpoint.toString().replace(/\/$/, '');
}

async function readBoundedBody(response) {
  const declaredLength = Number.parseInt(response.headers.get('content-length') || '0', 10);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_RESPONSE_BYTES) {
    throw new PublicError('invalid_response', 'The setup service returned an oversized response.');
  }
  if (!response.body) return '';

  const chunks = [];
  let size = 0;
  for await (const rawChunk of response.body) {
    const chunk = Buffer.from(rawChunk);
    size += chunk.length;
    if (size > MAX_RESPONSE_BYTES) {
      await response.body.cancel().catch(() => {});
      throw new PublicError('invalid_response', 'The setup service returned an oversized response.');
    }
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString('utf8');
}

export function versionAtLeast(actual, minimum) {
  const parse = (value) => {
    const match = String(value).match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
    return match ? match.slice(1).map((part) => Number.parseInt(part || '0', 10)) : [Number.NaN];
  };
  const left = parse(actual);
  const right = parse(minimum);
  if (left.some(Number.isNaN) || right.some(Number.isNaN)) return false;
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const delta = (left[index] || 0) - (right[index] || 0);
    if (delta !== 0) return delta > 0;
  }
  return true;
}

export async function fetchJson(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      redirect: 'error',
      signal: AbortSignal.timeout(options.timeout || 15_000),
      headers: {
        Accept: 'application/json',
        'User-Agent': 'quip-setup/0.3.0',
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new PublicError('connection_failed', 'The requested setup service could not be reached securely.');
  }

  const text = await readBoundedBody(response);

  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new PublicError('invalid_response', 'The setup service returned an invalid response.');
    }
  }
  return { status: response.status, data };
}

export async function compatibility(siteInput) {
  const site = normalizeSite(siteInput);
  const endpoint = `${site}/wp-json/iqb/v1/setup/compatibility`;
  const { status, data } = await fetchJson(endpoint);

  if (status !== 200
      || data.api_version !== API_VERSION
      || !Array.isArray(data.schema_versions)
      || !data.schema_versions.includes(API_VERSION)
      || data.plugin !== 'Quip Bot'
      || !versionAtLeast(data.plugin_version, '3.12.0')
      || normalizeReturnedSite(data.site_url) !== site
      || data.application?.id !== APP_ID) {
    throw new PublicError('incompatible_plugin', 'Quip Bot 3.12.0 or newer with setup API 1.0 is required.');
  }

  return {
    site,
    pluginVersion: data.plugin_version,
    restBase: safeEndpoint(data.rest_url, site, '/wp-json/iqb/v1/setup'),
    authorizationUrl: safeEndpoint(data.authorization_url, site, '/wp-admin/authorize-application.php'),
    capabilities: data.capabilities,
  };
}

function validateConnectionRecord(record, expected) {
  if (!record || record.site !== expected.site
      || record.appId !== APP_ID || typeof record.username !== 'string'
      || record.username.length < 1 || record.username.length > 60
      || typeof record.password !== 'string'
      || record.password.length < 8 || record.password.length > 128) {
    throw new PublicError('wordpress_not_connected', 'Connect WordPress through its approval screen first.');
  }
  return record;
}

export async function storeWordPressConnection(details, username, password) {
  const record = JSON.stringify({
    site: details.site,
    appId: APP_ID,
    username,
    password,
  });
  await storeCredential(WORDPRESS_SERVICE, details.site, record);
}

export async function wordpressConnection(details) {
  let raw;
  try {
    raw = await getCredential(WORDPRESS_SERVICE, details.site);
  } catch {
    throw new PublicError('wordpress_not_connected', 'Connect WordPress through its approval screen first.');
  }
  let record;
  try {
    record = JSON.parse(raw);
  } catch {
    throw new PublicError('wordpress_not_connected', 'Reconnect WordPress through its approval screen.');
  }
  return validateConnectionRecord(record, details);
}

export async function wordpressRequest(siteInput, route, options = {}) {
  if (!/^\/[a-z0-9/-]+$/.test(route)) {
    throw new PublicError('invalid_route', 'The requested setup operation is not allowed.');
  }
  const details = await compatibility(siteInput);
  const connection = await wordpressConnection(details);
  const authorization = Buffer.from(`${connection.username}:${connection.password}`, 'utf8').toString('base64');
  const extraHeaders = options.headers || {};
  if (Object.keys(extraHeaders).some((name) => ['authorization', 'host', 'content-length'].includes(name.toLowerCase()))) {
    throw new PublicError('invalid_headers', 'A protected request header cannot be overridden.');
  }
  const { status, data } = await fetchJson(`${details.restBase}${route}`, {
    method: options.method || 'GET',
    headers: {
      ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...extraHeaders,
      Authorization: `Basic ${authorization}`,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    timeout: options.timeout || 30_000,
  });

  if (status < 200 || status >= 300) {
    const code = typeof data?.code === 'string' ? data.code : 'wordpress_operation_failed';
    throw new PublicError(code, 'WordPress rejected the setup operation.');
  }
  return { details, data };
}

export async function removeWordPressConnection(siteInput, revokeRemote = true) {
  const site = normalizeSite(siteInput);
  try {
    if (revokeRemote) {
      await wordpressRequest(site, '/connection', { method: 'DELETE' });
    }
  } finally {
    await deleteCredential(WORDPRESS_SERVICE, site);
  }
}

export function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (!value || typeof value !== 'object') return value;
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    if (SECRET_KEY.test(key)) continue;
    result[key] = redact(item);
  }
  return result;
}

export function browserOpen(url) {
  const target = String(url);
  let command;
  let args;
  if (platform() === 'darwin') {
    command = '/usr/bin/open';
    args = [target];
  } else if (platform() === 'win32') {
    command = 'rundll32.exe';
    args = ['url.dll,FileProtocolHandler', target];
  } else {
    throw new PublicError('unsupported_platform', 'Automated credential storage currently supports macOS and Windows.');
  }
  const child = spawn(command, args, { detached: true, stdio: 'ignore', windowsHide: true });
  child.unref();
}

function htmlPage(title, message, close = true) {
  const closeScript = close ? '<script>history.replaceState(null,"",location.pathname);setTimeout(()=>window.close(),900)</script>' : '';
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><style>body{font:16px/1.5 system-ui,sans-serif;max-width:40rem;margin:12vh auto;padding:0 24px;color:#17191d}h1{font-size:2rem;letter-spacing:-.03em}p{color:#59616d}</style></head><body><h1>${title}</h1><p>${message}</p>${closeScript}</body></html>`;
}

export async function loopback(handler, timeout = 10 * 60_000) {
  const path = `/${randomToken(24)}`;
  let settled = false;
  let resolveResult;
  let rejectResult;
  let expectedHost = '';
  const result = new Promise((resolve, reject) => {
    resolveResult = resolve;
    rejectResult = reject;
  });

  const server = createServer(async (request, response) => {
    const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
    const headers = {
      'Cache-Control': 'no-store, private',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'",
      'Content-Type': 'text/html; charset=utf-8',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    };

    if (request.headers.host !== expectedHost || requestUrl.pathname !== path || settled) {
      response.writeHead(404, headers);
      response.end(htmlPage('Not found', 'This setup callback is not available.', false));
      return;
    }

    try {
      const outcome = await handler({ request, response, requestUrl, headers, path });
      if (outcome?.terminal) {
        settled = true;
        resolveResult(outcome.value);
        setTimeout(() => server.close(), 100);
      }
    } catch (error) {
      settled = true;
      response.writeHead(400, headers);
      response.end(htmlPage('Setup could not continue', 'Return to your terminal and start this connection again.'));
      rejectResult(error instanceof PublicError ? error : new PublicError('callback_failed', 'The browser approval could not be completed.'));
      setTimeout(() => server.close(), 100);
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  expectedHost = `127.0.0.1:${address.port}`;
  const callbackUrl = `http://127.0.0.1:${address.port}${path}`;
  const timer = setTimeout(() => {
    if (!settled) {
      settled = true;
      server.close();
      rejectResult(new PublicError('authorization_timeout', 'The browser approval timed out. Start the connection again.'));
    }
  }, timeout);
  timer.unref();
  result.then(() => clearTimeout(timer), () => clearTimeout(timer));

  return { callbackUrl, result, close: () => server.close() };
}

export function successHtml(title, message) {
  return htmlPage(title, message);
}

export function formHtml(provider, model, state) {
  const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Connect ${escape(provider)}</title><style>body{font:16px/1.5 system-ui,sans-serif;max-width:34rem;margin:10vh auto;padding:0 24px;color:#17191d}h1{font-size:2rem;letter-spacing:-.03em}p{color:#59616d}label{display:block;font-weight:650;margin:28px 0 8px}input{box-sizing:border-box;width:100%;min-height:48px;padding:10px;border:1px solid #bbc2cc;border-radius:4px;font:inherit}button{min-height:48px;margin-top:18px;padding:0 20px;border:0;border-radius:4px;background:#17191d;color:#fff;font:650 15px system-ui}</style></head><body><h1>Connect ${escape(provider)}</h1><p>The key goes directly from this local form to Quip Bot on your WordPress site. It is never printed or added to the AI conversation.</p><p>Model: <strong>${escape(model)}</strong></p><form method="post" autocomplete="off"><input type="hidden" name="state" value="${escape(state)}"><label for="provider-key">Provider API key</label><input id="provider-key" name="key" type="password" required autofocus spellcheck="false" autocomplete="off"><button type="submit">Save securely</button></form></body></html>`;
}

export async function readFormBody(request, maximum = 16_384) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maximum) throw new PublicError('request_too_large', 'The local form submission is too large.');
    chunks.push(chunk);
  }
  return new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
}
