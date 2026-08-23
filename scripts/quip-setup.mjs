#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import {
  ACCOUNT_SERVICE,
  API_VERSION,
  APP_ID,
  APP_NAME,
  CLIENT_ID,
  PublicError,
  WORDPRESS_SERVICE,
  browserOpen,
  compatibility,
  deleteCredential,
  fetchJson,
  formHtml,
  getCredential,
  loopback,
  normalizeSite,
  pkceChallenge,
  randomToken,
  readFormBody,
  redact,
  removeWordPressConnection,
  storeCredential,
  storeWordPressConnection,
  successHtml,
  wordpressConnection,
  wordpressRequest,
} from './lib/client.mjs';

const HELP = `Quip Bot secure setup helper

Commands:
  preflight --site URL
  connect-wordpress --site URL
  connect-account --site URL
  status --site URL
  validate --site URL --file configuration.json
  apply --site URL --file configuration.json --approved-sha SHA256 --operation-id ID
  verify --site URL
  rollback --site URL --rollback-id ID
  provider --site URL --provider ID --model ID
  provider-test --site URL
  go-live --site URL --apply-id ID --configuration-sha SHA256 --operation-id ID --confirm-go-live
  disconnect-license --site URL
  revoke-wordpress --site URL
  self-test-keychain

The helper prints redacted JSON only. Never pass a password, provider key,
Application Password, activation grant, license key, or token as an argument.`;

function parseArguments(argv) {
  const command = argv[0] || '';
  const options = {};
  for (let index = 1; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith('--')) throw new PublicError('invalid_arguments', 'Use named command options only.');
    const key = item.slice(2);
    if (!/^[a-z][a-z0-9-]*$/.test(key) || Object.hasOwn(options, key)) {
      throw new PublicError('invalid_arguments', 'A command option is invalid or duplicated.');
    }
    if (index + 1 < argv.length && !argv[index + 1].startsWith('--')) {
      options[key] = argv[index + 1];
      index += 1;
    } else {
      options[key] = true;
    }
  }
  return { command, options };
}

function required(options, key) {
  const value = options[key];
  if (typeof value !== 'string' || value.length < 1) {
    throw new PublicError('invalid_arguments', `The --${key} option is required.`);
  }
  return value;
}

function writeJson(value) {
  process.stdout.write(`${JSON.stringify(redact(value), null, 2)}\n`);
}

function responseHtml(response, title, message) {
  response.writeHead(200, {
    'Cache-Control': 'no-store, private',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'",
    'Content-Type': 'text/html; charset=utf-8',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  });
  response.end(successHtml(title, message));
}

export async function connectWordPress(siteInput, openBrowser = browserOpen) {
  const details = await compatibility(siteInput);
  const state = randomToken();
  const listener = await loopback(async ({ request, response, requestUrl }) => {
    if (request.method !== 'GET' || requestUrl.searchParams.get('state') !== state) {
      throw new PublicError('invalid_callback', 'The WordPress approval response was invalid.');
    }

    if (requestUrl.searchParams.get('result') === 'reject') {
      throw new PublicError('access_denied', 'WordPress connection was cancelled.');
    }

    const returnedSite = requestUrl.searchParams.get('site_url') || '';
    const username = requestUrl.searchParams.get('user_login') || '';
    const password = requestUrl.searchParams.get('password') || '';
    if (normalizeSite(returnedSite.replace(/\/$/, '')) !== details.site
        || username.length < 1 || username.length > 256
        || password.length < 8 || password.length > 512) {
      throw new PublicError('invalid_callback', 'WordPress returned an invalid approval response.');
    }

    await storeWordPressConnection(details, username, password);
    responseHtml(response, 'WordPress connected', 'The temporary setup credential is stored in your operating-system credential store. You can close this tab.');
    return { terminal: true, value: true };
  });

  const success = new URL(listener.callbackUrl);
  success.searchParams.set('state', state);
  success.searchParams.set('result', 'success');
  const reject = new URL(listener.callbackUrl);
  reject.searchParams.set('state', state);
  reject.searchParams.set('result', 'reject');
  const authorization = new URL(details.authorizationUrl);
  authorization.searchParams.set('app_name', APP_NAME);
  authorization.searchParams.set('app_id', APP_ID);
  authorization.searchParams.set('success_url', success.toString());
  authorization.searchParams.set('reject_url', reject.toString());
  openBrowser(authorization);
  await listener.result;

  const status = await wordpressRequest(details.site, '/status');
  return {
    ok: true,
    connection: 'connected',
    site_url: details.site,
    plugin_version: details.pluginVersion,
    api_version: API_VERSION,
    environment: status.data.environment,
    credential_store: process.platform === 'darwin' ? 'macos-keychain' : 'windows-credential-manager',
    capabilities: details.capabilities,
    status: status.data,
  };
}

function accountOrigin(options, installation) {
  if (options['test-broker'] !== true) return 'https://quip.bot';
  if (process.env.QUIP_SETUP_ALLOW_TEST_BROKER !== '1' || installation.environment !== 'local') {
    throw new PublicError('test_broker_forbidden', 'The local authorization broker is available only to local WordPress installations.');
  }
  return 'http://quip.loc';
}

export async function connectAccount(siteInput, options = {}, openBrowser = browserOpen) {
  const details = await compatibility(siteInput);
  await wordpressConnection(details);
  const installation = (await wordpressRequest(details.site, '/status')).data;
  if (!installation || !/^[a-f0-9-]{36}$/.test(installation.instance_id || '')) {
    throw new PublicError('invalid_compatibility', 'WordPress returned an invalid installation identity.');
  }
  const origin = accountOrigin(options, installation);
  const state = randomToken();
  const verifier = randomToken(48);
  const listener = await loopback(async ({ request, response, requestUrl }) => {
    if (request.method !== 'GET' || requestUrl.searchParams.get('state') !== state) {
      throw new PublicError('invalid_callback', 'The Quip Bot approval response was invalid.');
    }
    const error = requestUrl.searchParams.get('error');
    if (error) {
      throw new PublicError(error === 'access_denied' ? 'access_denied' : 'authorization_failed', 'Quip Bot authorization was not completed.');
    }
    const code = requestUrl.searchParams.get('code') || '';
    if (!/^[A-Za-z0-9_-]{40,100}$/.test(code)) {
      throw new PublicError('invalid_callback', 'Quip Bot returned an invalid authorization response.');
    }
    responseHtml(response, 'Quip Bot approved', 'Authorization is complete. Return to your setup terminal while the website connection finishes.');
    return { terminal: true, value: code };
  });

  const redirectUri = listener.callbackUrl;
  const authorization = new URL('/account/', origin);
  authorization.searchParams.set('authorize', '1');
  authorization.searchParams.set('client_id', CLIENT_ID);
  authorization.searchParams.set('redirect_uri', redirectUri);
  authorization.searchParams.set('state', state);
  authorization.searchParams.set('code_challenge', pkceChallenge(verifier));
  authorization.searchParams.set('code_challenge_method', 'S256');
  authorization.searchParams.set('scope', 'entitlement:read activation:issue');
  authorization.searchParams.set('site_url', details.site);
  authorization.searchParams.set('instance_id', installation.instance_id);
  authorization.searchParams.set('plugin_version', details.pluginVersion);
  openBrowser(authorization);
  const code = await listener.result;

  const tokenResponse = await fetchJson(`${origin}/wp-json/quip/v1/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }),
  });
  const accessToken = tokenResponse.data?.access_token;
  if (tokenResponse.status !== 200 || typeof accessToken !== 'string' || !/^[A-Za-z0-9_-]{60,120}$/.test(accessToken)) {
    throw new PublicError('token_exchange_failed', 'The Quip Bot authorization could not be completed.');
  }

  await storeCredential(ACCOUNT_SERVICE, details.site, accessToken);
  try {
    const storedToken = await getCredential(ACCOUNT_SERVICE, details.site);
    const grantResponse = await fetchJson(`${origin}/wp-json/quip/v1/setup/activation-grants`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${storedToken}`, 'Content-Type': 'application/json' },
      body: '{}',
    });
    const grant = grantResponse.data?.activation_grant;
    if (grantResponse.status !== 200 || typeof grant !== 'string' || !/^[A-Za-z0-9_-]{60,120}$/.test(grant)) {
      throw new PublicError('activation_grant_failed', 'A site activation grant could not be issued.');
    }

    const activation = await wordpressRequest(details.site, '/license/activate', {
      method: 'POST',
      body: { activation_grant: grant },
    });
    return {
      ok: true,
      account_authorization: 'completed',
      site_url: details.site,
      license: activation.data.license,
    };
  } finally {
    await deleteCredential(ACCOUNT_SERVICE, details.site);
  }
}

async function readEnvelope(file) {
  let text;
  try {
    text = await readFile(file, 'utf8');
  } catch {
    throw new PublicError('configuration_unreadable', 'The configuration JSON file could not be read.');
  }
  if (Buffer.byteLength(text) > 524_288) {
    throw new PublicError('configuration_too_large', 'The configuration JSON file is too large.');
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new PublicError('configuration_invalid', 'The configuration file must contain valid JSON.');
  }
}

export async function providerForm(site, provider, model, openBrowser = browserOpen) {
  if (!/^[a-z0-9_-]{2,40}$/.test(provider) || model.length < 1 || model.length > 200) {
    throw new PublicError('invalid_provider', 'Choose a supported provider and model.');
  }
  const state = randomToken();
  const listener = await loopback(async ({ request, response, requestUrl, headers }) => {
    if (requestUrl.searchParams.get('state') !== state) {
      throw new PublicError('invalid_callback', 'The local provider form is invalid.');
    }
    if (request.method === 'GET') {
      response.writeHead(200, headers);
      response.end(formHtml(provider, model, state));
      return { terminal: false };
    }
    if (request.method !== 'POST') throw new PublicError('invalid_callback', 'The local provider form is invalid.');
    const fields = await readFormBody(request);
    const key = fields.get('key') || '';
    if (fields.get('state') !== state || key.length < 1 || key.length > 8192) {
      throw new PublicError('invalid_provider_key', 'The provider key was not accepted.');
    }
    const saved = await wordpressRequest(site, '/provider', {
      method: 'PUT',
      body: { provider, model, key },
    });
    responseHtml(response, 'Provider connected', 'The key was saved write-only in WordPress and was not printed. You can close this tab.');
    return { terminal: true, value: saved.data };
  });
  const formUrl = new URL(listener.callbackUrl);
  formUrl.searchParams.set('state', state);
  openBrowser(formUrl);
  return listener.result;
}

async function run(command, options) {
  if (command === 'help' || command === '--help' || command === '-h' || command === '') {
    process.stdout.write(`${HELP}\n`);
    return null;
  }
  if (command === 'self-test-keychain') {
    const service = `dev.quipbot.setup.self-test.${randomToken(8)}`;
    const account = 'temporary-self-test';
    const secret = randomToken();
    try {
      await storeCredential(service, account, secret);
      if ((await getCredential(service, account)) !== secret) throw new Error('mismatch');
      return { ok: true, credential_store: process.platform === 'darwin' ? 'macos-keychain' : 'windows-credential-manager' };
    } finally {
      await deleteCredential(service, account);
    }
  }

  const site = required(options, 'site');
  if (command === 'preflight') {
    const details = await compatibility(site);
    return { ok: true, ...details };
  }
  if (command === 'connect-wordpress') return connectWordPress(site);
  if (command === 'connect-account') return connectAccount(site, options);
  if (command === 'status') return (await wordpressRequest(site, '/status')).data;
  if (command === 'verify') return (await wordpressRequest(site, '/verify', { method: 'POST' })).data;
  if (command === 'provider-test') return (await wordpressRequest(site, '/provider/test', { method: 'POST' })).data;
  if (command === 'disconnect-license') return (await wordpressRequest(site, '/license', { method: 'DELETE' })).data;
  if (command === 'revoke-wordpress') {
    await removeWordPressConnection(site, true);
    return { ok: true, connection: 'revoked', site_url: normalizeSite(site) };
  }
  if (command === 'provider') {
    return providerForm(site, required(options, 'provider'), required(options, 'model'));
  }
  if (command === 'validate') {
    const envelope = await readEnvelope(required(options, 'file'));
    return (await wordpressRequest(site, '/validate', { method: 'POST', body: envelope })).data;
  }
  if (command === 'apply') {
    const envelope = await readEnvelope(required(options, 'file'));
    const approvedSha = required(options, 'approved-sha');
    const operationId = required(options, 'operation-id');
    if (!/^[a-f0-9]{64}$/.test(approvedSha) || !/^[A-Za-z0-9._~-]{16,128}$/.test(operationId)) {
      throw new PublicError('invalid_approval', 'The approved fingerprint or operation ID is invalid.');
    }
    const proposal = { schema_version: envelope.schema_version, configuration: envelope.configuration };
    const validation = (await wordpressRequest(site, '/validate', { method: 'POST', body: proposal })).data;
    if (!validation.valid || validation.configuration_sha256 !== approvedSha) {
      throw new PublicError('artifact_mismatch', 'The approved configuration fingerprint no longer matches the file.');
    }
    proposal.approval = { confirmed: true, artifact_sha256: approvedSha };
    return (await wordpressRequest(site, '/apply', {
      method: 'POST',
      headers: { 'X-Quip-Setup-Idempotency-Key': operationId },
      body: proposal,
    })).data;
  }
  if (command === 'rollback') {
    return (await wordpressRequest(site, '/rollback', {
      method: 'POST',
      body: { rollback_id: required(options, 'rollback-id') },
    })).data;
  }
  if (command === 'go-live') {
    if (options['confirm-go-live'] !== true) {
      throw new PublicError('go_live_confirmation_required', 'Go-live requires the separate --confirm-go-live flag after owner approval.');
    }
    const configurationSha = required(options, 'configuration-sha');
    const operationId = required(options, 'operation-id');
    if (!/^[a-f0-9]{64}$/.test(configurationSha) || !/^[A-Za-z0-9._~-]{16,128}$/.test(operationId)) {
      throw new PublicError('invalid_approval', 'The approved fingerprint or operation ID is invalid.');
    }
    return (await wordpressRequest(site, '/go-live', {
      method: 'POST',
      headers: { 'X-Quip-Setup-Idempotency-Key': operationId },
      body: {
        approval: { confirmed: true },
        apply_id: required(options, 'apply-id'),
        configuration_sha256: configurationSha,
      },
    })).data;
  }

  throw new PublicError('unknown_command', 'Use --help to list supported setup commands.');
}

export async function main(argv = process.argv.slice(2)) {
  const { command, options } = parseArguments(argv);
  const result = await run(command, options);
  if (result !== null) writeJson({ ok: result.ok ?? true, ...result });
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((error) => {
    const publicError = error instanceof PublicError
      ? error
      : new PublicError('setup_failed', 'The secure setup helper could not complete this operation.');
    process.stderr.write(`${JSON.stringify({ ok: false, code: publicError.code, message: publicError.message })}\n`);
    process.exitCode = 1;
  });
}
