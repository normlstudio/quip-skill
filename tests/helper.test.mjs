import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PublicError,
  normalizeSite,
  pkceChallenge,
  redact,
  versionAtLeast,
} from '../scripts/lib/client.mjs';

test('normalizes canonical HTTPS and local WordPress URLs', () => {
  assert.equal(normalizeSite('https://Example.com/wordpress/'), 'https://example.com/wordpress');
  assert.equal(normalizeSite('http://quip.loc/'), 'http://quip.loc');
  assert.throws(() => normalizeSite('http://example.com'), PublicError);
  assert.throws(() => normalizeSite('https://example.com/?token=secret'), PublicError);
  assert.throws(() => normalizeSite('https://user:pass@example.com'), PublicError);
});

test('compares the full semantic version core', () => {
  assert.equal(versionAtLeast('3.12.0', '3.12.0'), true);
  assert.equal(versionAtLeast('3.12.1', '3.12.0'), true);
  assert.equal(versionAtLeast('4.0.0-beta.1', '3.12.0'), true);
  assert.equal(versionAtLeast('3.11.9', '3.12.0'), false);
  assert.equal(versionAtLeast('invalid', '3.12.0'), false);
});

test('produces the RFC 7636 S256 PKCE challenge', () => {
  const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
  assert.equal(pkceChallenge(verifier), 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
});

test('redacts every credential-bearing field recursively', () => {
  const output = redact({
    ok: true,
    activation_token: 'secret',
    nested: { password: 'secret', status: 'active' },
    list: [{ license_key: 'secret', connected: true }],
  });
  assert.deepEqual(output, {
    ok: true,
    nested: { status: 'active' },
    list: [{ connected: true }],
  });
  assert.equal(JSON.stringify(output).includes('secret'), false);
});
