import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import {
  WORDPRESS_SERVICE,
  compatibility,
  getCredential,
  wordpressConnection,
  wordpressRequest,
} from '../scripts/lib/client.mjs';
import { connectAccount, connectWordPress } from '../scripts/quip-setup.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const execFileAsync = promisify(execFile);
const helper = fileURLToPath(new URL('../scripts/quip-setup.mjs', import.meta.url));

const site = process.env.QUIP_E2E_SITE;
const adminUser = process.env.QUIP_E2E_ADMIN_USER;
const customerEmail = process.env.QUIP_E2E_CUSTOMER_EMAIL;
const adminPassword = (await readFile(process.env.QUIP_E2E_ADMIN_PASSWORD_FILE, 'utf8')).trim();
const customerPassword = (await readFile(process.env.QUIP_E2E_CUSTOMER_PASSWORD_FILE, 'utf8')).trim();

process.env.QUIP_SETUP_ALLOW_TEST_BROKER = '1';

if (!site || !adminUser || !customerEmail || !adminPassword || !customerPassword) {
  throw new Error('local-e2e-fixture-missing');
}

async function withBrowser(callback) {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await callback(page);
  } finally {
    await browser.close();
  }
}

async function approveWordPress(url) {
  await withBrowser(async (page) => {
    await page.goto(String(url), { waitUntil: 'domcontentloaded' });
    if (await page.locator('#user_login').count()) {
      await page.locator('#user_login').fill(adminUser);
      await page.locator('#user_pass').fill(adminPassword);
      await Promise.all([
        page.waitForLoadState('domcontentloaded'),
        page.locator('#wp-submit').click(),
      ]);
    }
    await page.locator('#approve').waitFor({ state: 'visible' });
    await page.locator('#approve').click();
    await page.getByRole('heading', { name: 'WordPress connected' }).waitFor({ state: 'visible' });
  });
}

async function approveAccount(url) {
  await withBrowser(async (page) => {
    await page.goto(String(url), { waitUntil: 'domcontentloaded' });
    await page.locator('#account-email').fill(customerEmail);
    await page.locator('#account-password').fill(customerPassword);
    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      page.getByRole('button', { name: 'Sign in and review' }).click(),
    ]);
    await page.getByRole('heading', { name: 'Allow setup for this website?' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Allow and return to setup' }).click();
    await page.getByRole('heading', { name: 'Quip Bot approved' }).waitFor({ state: 'visible' });
  });
}

async function runHelper(arguments_) {
  const { stdout } = await execFileAsync(process.execPath, [helper, ...arguments_], {
    env: process.env,
    maxBuffer: 2 * 1024 * 1024,
  });
  return JSON.parse(stdout);
}

let wordpressBrowser;
const wordpress = await connectWordPress(site, (url) => {
  wordpressBrowser = approveWordPress(url);
});
await wordpressBrowser;
assert.equal(wordpress.connection, 'connected');

const details = await compatibility(site);
const connection = await wordpressConnection(details);
const basic = Buffer.from(`${connection.username}:${connection.password}`, 'utf8').toString('base64');
const blocked = await fetch(`${details.site}/wp-json/wp/v2/users/me`, {
  headers: { Authorization: `Basic ${basic}` },
  redirect: 'error',
});
const blockedBody = await blocked.json();
assert.equal(blocked.status, 401);
assert.ok(['iqb_setup_scope_denied', 'rest_not_logged_in'].includes(blockedBody.code));

const status = await wordpressRequest(site, '/status');
assert.equal(status.data.api_version, '1.0');
assert.equal(status.data.live, false);

const artifactDirectory = await mkdtemp(join(tmpdir(), 'quip-setup-e2e-'));
const artifact = join(artifactDirectory, 'configuration.json');
let rollbackId = '';
try {
  await writeFile(artifact, `${JSON.stringify({
    schema_version: '1.0',
    configuration: {
      settings: {
        consent: 'I understand this is an AI assistant.',
        lead_email: 'quip-setup-e2e@example.test',
        languages: ['en'],
        default_language: 'en',
      },
      knowledge: {
        fields: {
          business: 'Temporary Quip Bot secure setup end-to-end fixture.',
        },
      },
      appearance: {
        accent: '#14161A',
        header_text: 'light',
        position: 'right',
        offset_side: 20,
        offset_bottom: 20,
        launcher_size: 48,
      },
    },
  }, null, 2)}\n`, { mode: 0o600 });

  const validation = await runHelper(['validate', '--site', site, '--file', artifact]);
  assert.equal(validation.valid, true);
  assert.match(validation.configuration_sha256, /^[a-f0-9]{64}$/);

  const operationId = `secure-setup-e2e-${Date.now()}`;
  const applied = await runHelper([
    'apply', '--site', site, '--file', artifact,
    '--approved-sha', validation.configuration_sha256,
    '--operation-id', operationId,
  ]);
  rollbackId = applied.rollback_id;
  assert.equal(applied.ok, true);
  assert.equal(applied.setup.live, false);
  assert.deepEqual(applied.sections, ['settings', 'knowledge', 'appearance']);

  const repeated = await runHelper([
    'apply', '--site', site, '--file', artifact,
    '--approved-sha', validation.configuration_sha256,
    '--operation-id', operationId,
  ]);
  assert.equal(repeated.apply_id, applied.apply_id);
  assert.equal(repeated.rollback_id, applied.rollback_id);

  const verified = await runHelper(['verify', '--site', site]);
  assert.equal(verified.live, false);
  assert.equal(verified.checks.find((check) => check.id === 'approved_apply')?.status, 'pass');
  assert.equal(verified.checks.find((check) => check.id === 'business_knowledge')?.status, 'pass');

  const rolledBack = await runHelper(['rollback', '--site', site, '--rollback-id', rollbackId]);
  rollbackId = '';
  assert.equal(rolledBack.rolled_back, true);
  assert.equal(rolledBack.setup.live, status.data.live);
  assert.deepEqual(rolledBack.setup.last_apply, status.data.last_apply);
  assert.deepEqual(rolledBack.setup.knowledge, status.data.knowledge);
} finally {
  if (rollbackId) {
    await runHelper(['rollback', '--site', site, '--rollback-id', rollbackId]).catch(() => {});
  }
  await rm(artifactDirectory, { recursive: true, force: true });
}

let accountBrowser;
const account = await connectAccount(site, { 'test-broker': true }, (url) => {
  accountBrowser = approveAccount(url);
});
await accountBrowser;
assert.equal(account.account_authorization, 'completed');
assert.equal(account.license.connected, true);
assert.equal(account.license.plan, 'pro');

const validated = await wordpressRequest(site, '/license/validate', { method: 'POST' });
assert.equal(validated.data.ok, true);
assert.equal(validated.data.license.connected, true);

const disconnected = await wordpressRequest(site, '/license', { method: 'DELETE' });
assert.equal(disconnected.data.ok, true);
assert.equal(disconnected.data.license.connected, false);

await wordpressRequest(site, '/connection', { method: 'DELETE' });
await import('../scripts/lib/credential-store.mjs').then(({ deleteCredential }) => deleteCredential(WORDPRESS_SERVICE, details.site));
await assert.rejects(() => getCredential(WORDPRESS_SERVICE, details.site));

process.stdout.write(`${JSON.stringify({
  ok: true,
  checks: {
    wordpress_browser_consent: 'pass',
    os_credential_store: 'pass',
    setup_namespace_scope: 'pass',
    configuration_validation: 'pass',
    explicit_artifact_approval: 'pass',
    idempotent_apply: 'pass',
    verify_before_live: 'pass',
    rollback_restores_baseline: 'pass',
    quip_bot_pkce_consent: 'pass',
    one_time_site_bound_activation: 'pass',
    activation_validation: 'pass',
    activation_disconnect: 'pass',
    wordpress_self_revoke: 'pass',
  },
})}\n`);
