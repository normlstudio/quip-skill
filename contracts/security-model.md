# Security model

## Trust boundaries

| Data | Human entry point | Agent may observe |
|---|---|---|
| WordPress password | WordPress login page | No |
| WordPress Application Password | Loopback helper → OS store | Status only |
| Provider key | Loopback local form → WordPress | Configured/test status only |
| quip.bot login | quip.bot account page | Authorization status only |
| Authorization code/token/grant | Helper + OS store + server exchange | No |
| Pro activation token | Encrypted WordPress option | Redacted license status only |
| Manual legacy license key | Human account/WordPress surfaces | Never in assisted setup |

## Browser boundary

The helper may open the default browser for WordPress or quip.bot login and
consent. The agent must not click, type, read the DOM, capture a screenshot,
attach to a browser session, inspect history, or extract cookies.

Callbacks bind only to `127.0.0.1` on an ephemeral port with an unguessable
path. They validate the exact Host header, state, method, site, and expected
fields; set CSP, no-store, no-referrer, nosniff, and frame-deny headers; remove
credential-bearing query data from history; and expire after ten minutes.

## WordPress credential boundary

- WordPress core creates the Application Password after human consent.
- The helper validates the exact canonical site before storage.
- macOS uses a non-synchronizing, device-only Keychain item available only while
  unlocked. Windows uses a local-machine Credential Manager generic credential.
- The plugin rejects that application ID outside `/wp-json/iqb/v1/setup/*`.
- The helper refuses caller overrides of Authorization, Host, or Content-Length.
- `revoke-wordpress` deletes the remote Application Password and local item.

## Pro entitlement boundary

- The free core never requires quip.bot authorization.
- The broker origin is fixed to `https://quip.bot`; no caller-supplied broker is
  accepted. The local broker exists only behind an explicit repository QA flag
  on a WordPress installation reporting `local`.
- Authorization uses an external browser, exact loopback redirect, state,
  PKCE S256, short expiry, single-use code, least scopes, and no refresh token.
- The access token is hashed by quip.bot and stored locally only until one
  activation grant is issued, then revoked and deleted.
- The activation grant is hashed, single-use, short-lived, and bound to site,
  installation, environment, and plugin version.
- The WordPress plugin exchanges the grant server to server. Its activation
  token is opaque, encrypted with authenticated encryption, site-bound, and
  never returned through the agent-facing API.
- One production plus three non-production connections are allowed by default.
  Each is visible and individually disconnectable in the account.

## Configuration boundary

- API 1.0 uses a closed schema and rejects unknown fields.
- Validation is read-only and returns a deterministic SHA-256.
- Apply requires the unchanged approved SHA and a 16–128 character idempotency
  ID. WordPress snapshots only setup-owned options before applying.
- Initial apply preserves visibility. Go-live is a separate command, approval,
  fingerprint, idempotency ID, and verification gate.
- Provider keys are write-only and are not returned by status, apply, audit, or
  verification responses.

## Network and storage controls

- HTTPS only outside recognized local development.
- Exact origin and endpoint path; redirects refused.
- Broker URL is fixed in the plugin; TLS verification stays enabled.
- Request and response bodies are bounded.
- Authorization codes, access tokens, grants, activation tokens, and license
  keys are hashed or encrypted at rest according to their use.
- Public compatibility exposes no persistent installation ID.
- Account/authorization pages are noindex, nofollow, no-store, and no-referrer.

## Logging and artifacts

- Never record query strings from authorization callbacks.
- Record only public error codes and redacted JSON.
- Never include raw headers, cookies, reset links, credentials, secret-bearing
  URLs, or real visitor personal data.
- `preflight.md`, `research.md`, `owner-answers.md`, `connection.md`,
  `configuration-plan.md`, `configuration.json`, and `verification.md` are all
  non-secret artifacts.
