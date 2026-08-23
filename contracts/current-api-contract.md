# Quip Bot setup API 1.0 contract

## Compatibility

Secure assisted setup requires Quip Bot 3.12.0 or newer.

Public, non-secret discovery:

```text
GET /wp-json/iqb/v1/setup/compatibility
```

It returns API/schema versions, plugin/version, canonical site URL, exact REST
and WordPress authorization URLs, fixed application identity, and capabilities.
It does not return an installation ID, credential, or configured business data.

Every other WordPress setup route requires an administrator-approved WordPress
Application Password and is limited to `/wp-json/iqb/v1/setup/*`.

## Helper commands

Resolve `scripts/quip-setup.mjs` relative to `SKILL.md`.

```bash
node scripts/quip-setup.mjs preflight --site URL
node scripts/quip-setup.mjs self-test-keychain
node scripts/quip-setup.mjs connect-wordpress --site URL
node scripts/quip-setup.mjs connect-account --site URL
node scripts/quip-setup.mjs status --site URL
node scripts/quip-setup.mjs validate --site URL --file configuration.json
node scripts/quip-setup.mjs apply --site URL --file configuration.json \
  --approved-sha SHA256 --operation-id ID
node scripts/quip-setup.mjs provider --site URL --provider ID --model ID
node scripts/quip-setup.mjs provider-test --site URL
node scripts/quip-setup.mjs verify --site URL
node scripts/quip-setup.mjs rollback --site URL --rollback-id ID
node scripts/quip-setup.mjs go-live --site URL --apply-id ID \
  --configuration-sha SHA256 --operation-id ID --confirm-go-live
node scripts/quip-setup.mjs disconnect-license --site URL
node scripts/quip-setup.mjs revoke-wordpress --site URL
```

The helper accepts no secret command-line option and prints redacted JSON only.

## Authenticated WordPress routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/status` | Redacted current state and installation identity |
| POST | `/validate` | Closed-schema validation; no writes |
| POST | `/apply` | Approved, fingerprinted, idempotent apply + snapshot |
| POST | `/verify` | Readiness checks; never changes visibility |
| POST | `/rollback` | Restore the single current snapshot |
| PUT | `/provider` | Write-only provider key and model selection |
| POST | `/provider/test` | Store and return non-secret test status |
| POST | `/go-live` | Separate verified visibility operation |
| POST | `/license/activate` | Exchange one activation grant server to server |
| POST | `/license/validate` | Validate the encrypted site activation |
| DELETE | `/license` | Disconnect that Pro activation |
| DELETE | `/connection` | Self-revoke the current Application Password |

All responses use `Cache-Control: no-store, private`. Requests and responses are
size-limited. Unknown routes, fields, schema versions, and protected-header
overrides fail closed.

## Configuration envelope

```json
{
  "schema_version": "1.0",
  "configuration": {
    "provider": {},
    "settings": {},
    "knowledge": {},
    "templates": {},
    "appearance": {}
  }
}
```

Every object is closed. Omit an unchanged section. See
`templates/configuration.json` for the supported shape and
`contracts/configuration-fields.md` for meaning and constraints.

Validation returns `configuration_sha256`. Apply requires:

```json
{
  "approval": {
    "confirmed": true,
    "artifact_sha256": "the validated SHA-256"
  }
}
```

The helper adds approval only after independently revalidating the unchanged
file. Apply also requires `X-Quip-Setup-Idempotency-Key`.

## Pro browser authorization

The helper opens the fixed quip.bot account authorization endpoint with:

- client ID `quip-setup`;
- exact loopback redirect URI;
- PKCE S256 challenge;
- opaque state;
- exact site URL, authenticated installation ID, and plugin version;
- scopes `entitlement:read activation:issue`.

The authorization code lasts two minutes and is single-use. The access token
lasts fifteen minutes but is revoked when it issues one five-minute activation
grant. The grant is bound to site URL, installation ID, environment, and plugin
version. The WordPress plugin exchanges it and never returns the resulting
activation token through the setup API.

## Internal routes remain forbidden

The plugin's `iqb/v1/admin` routes serve the bundled admin application. They are
not part of this contract and the skill must never call them.
