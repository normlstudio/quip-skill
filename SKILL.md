---
name: quip-setup
description: >
  Research, connect, configure, verify, and safely launch Quip Bot on a
  WordPress site. Uses human-operated browser consent, a local helper, the
  operating-system credential store, and the versioned Quip Bot setup API so
  WordPress passwords, Application Passwords, provider keys, and Pro activation
  tokens never enter the AI conversation. Use for a new setup, a resumed setup,
  a configuration review, a Pro website connection, or a launch-readiness check.
metadata:
  version: "0.3.0"
  author: "Norml Studio"
---

# Quip Bot setup

Take a site owner from public research to a reviewed Quip Bot configuration.
Keep credentials outside the AI transcript, keep the public widget off during
setup, and make configuration approval and go-live two separate decisions.

## When to use

- "Set up Quip Bot on my WordPress site."
- "Research my site before configuring Quip Bot."
- "Help me plan the Quip Bot knowledge base."
- "Connect my WordPress site securely."
- "Connect this site to my Quip Bot Pro account."
- "Apply this approved Quip Bot configuration."
- "Review whether Quip Bot is ready to go live."
- "Resume my Quip Bot setup."

## Do not use

- For general WordPress administration outside the Quip Bot setup namespace.
- To obtain, reveal, rotate, or paste any credential into the conversation.
- To enable a paid capability the account does not own.
- To bypass WordPress capabilities, browser consent, configuration approval, or
  the separate go-live decision.
- To write through SSH, direct database access, XML-RPC, browser automation, or
  undocumented plugin routes.

## Current release state

Version 0.3.0 contains both paths:

- **Secure assisted setup:** available on macOS and Windows when the site runs
  Quip Bot 3.12.0 or newer with setup API 1.0. The helper is included in this
  skill and uses macOS Keychain or Windows Credential Manager.
- **Guided fallback:** available when the helper, operating system, plugin
  version, or public API is incompatible. The human operates wp-admin while the
  agent supplies the reviewed plan.

The secure path was locally verified end to end. Do not claim it is available
on a public site until that site actually reports plugin 3.12.0+ and API 1.0.
Linux remains guided-only until an approved native credential backend exists.

Quip Bot core is free forever. It requires no quip.bot account or license. The
site owner supplies and pays their AI provider directly. Quip Bot Pro is a
separate $200/year entitlement and does not include provider usage.

## Required inputs

- Canonical WordPress site URL.
- Confirmation that the user owns or may manage the site.
- A writable local workspace for non-secret artifacts.
- Target environment: staging or production.
- A restorable backup or reset checkpoint before any production write.

Collected during setup:

- Business purpose, audiences, questions, exclusions, and escalation rules.
- Public or deliberately owner-supplied knowledge sources.
- Provider and model choice, never the provider key.
- Consent, disclosure, contact, privacy, appearance, and launch decisions.
- Whether the owner wants only the free core or also has a Pro entitlement.

## Output folder

Create or reuse `quip-setup/` in the approved working directory:

```text
quip-setup/
├── preflight.md
├── research.md
├── owner-answers.md
├── connection.md
├── configuration-plan.md
├── configuration.json
└── verification.md
```

Markdown files carry research, decisions, provenance, and evidence.
`configuration.json` is the closed, machine-readable projection of only the
approved Quip Bot fields. The JSON is what the helper validates and applies;
the Markdown files are never uploaded wholesale to WordPress.

Never place a password, Application Password, provider key, authorization code,
activation grant, access token, license key, cookie, reset link, or secret URL
in any artifact.

## Installation

If the skill is not installed, ask the human to run:

```bash
npx skills add Norml-Studio/quip-skill -g
```

The open `skills` installer requires Node.js 22.20 or newer. Do not install or
replace the user's runtime without approval.

Start a new agent turn with only the public site URL:

```text
Use quip-setup to set up Quip Bot on https://example.com
```

## Helper contract

Resolve `scripts/quip-setup.mjs` relative to this `SKILL.md`; do not copy it to
the project. Run it as a child process and trust only its redacted JSON output.
Never add secret arguments or enable the QA-only local broker flag.

The helper supports:

```text
preflight, connect-wordpress, connect-account, status, validate, apply, verify,
rollback, provider, provider-test, go-live, disconnect-license,
revoke-wordpress, self-test-keychain
```

Read `contracts/current-api-contract.md` for exact commands and schemas.

## Workflow

### 0. Preflight and installation

Read `actions/preflight.md` and `contracts/installation-and-rollback.md`.

Confirm authority, origin, workspace, environment, installation, recovery, and
visibility. Run the helper's `preflight` command when automated setup is
requested. Secure setup requires Quip Bot 3.12.0+, WordPress 6.2+, PHP 7.4+,
setup API 1.0, and macOS or Windows.

If the plugin is absent, the human installs only a verified official package.
Never invent a package URL. On production, no write occurs without a confirmed
restorable backup. Keep public visibility off.

Write `quip-setup/preflight.md`.

### 1. Research

Read `actions/research.md` and `templates/research.md`.

Research public pages only. Build a cited picture of the business, audience,
services, common questions, contact paths, policies, and gaps. Write
`quip-setup/research.md` before asking the owner to repeat published facts.

### 2. Owner questions

Read `actions/questions.md` and `templates/owner-answers.md`.

Ask only for decisions or private operating context that research cannot
answer. Work in short batches. Mark unanswered items `unresolved`; never guess.

### 3. Connect WordPress

Read `actions/connect.md` and `contracts/security-model.md`.

For secure assisted setup, run `connect-wordpress`. The helper opens WordPress
core's Application Password approval page in the system browser. The human logs
in and approves. Do not control, inspect, screenshot, or read the browser.

The callback stores the generated setup credential directly in macOS Keychain
or Windows Credential Manager. The credential is limited by the plugin to
`/wp-json/iqb/v1/setup/*`; it cannot be used for general WordPress REST access.
Record only redacted connection status in `connection.md`.

If the automated path is unavailable, use
`contracts/admin-guided-path.md` and record `connection: guided-manual`.

### 4. Connect optional Pro entitlement

Skip this step for the free core.

When the owner has Pro, run `connect-account`. The helper opens the fixed
`https://quip.bot/account/` consent page with PKCE. The human signs in and sees
the exact site, environment, and requested permissions before approving.

The short-lived account token is stored only long enough to issue one
site-bound activation grant, then deleted from the OS credential store. The
WordPress plugin exchanges the grant server to server and stores only an
encrypted activation token bound to that site URL and installation ID.

One entitlement permits one production website plus up to three paired staging,
development, or recognized local copies. Every copy has its own activation and
can be disconnected from the account or from WordPress. A cloned database on a
different URL receives a new installation ID.

### 5. Prepare and validate configuration

Read `actions/configure.md`, `contracts/configuration-fields.md`, and
`templates/configuration-plan.md`.

Map the approved research and answers into `configuration-plan.md`, then compile
only supported fields into `configuration.json` using
`templates/configuration.json`. Provider keys never enter either file.

Run `validate`. It performs no writes and returns a summary, warnings, errors,
and `configuration_sha256`. Fail closed on an unknown field, unsupported schema,
invalid value, unexpected hostname, redirect, TLS error, or version mismatch.

Show the owner the exact non-secret proposed values and the returned SHA-256.
Do not treat planning approval as write approval.

### 6. Enter the provider key safely

When a key is required, run `provider` with only the approved provider and model
identifiers. The helper opens a loopback-only local password form. The human
enters the key there; it goes directly to the fixed Quip Bot setup endpoint and
is never printed, stored in an artifact, or added to the AI conversation.

Run `provider-test` and record only provider, model, and pass/fail status.

### 7. Apply after explicit approval

Immediately before a write, ask the owner to approve the exact
`configuration.json` fingerprint. After an explicit yes, run `apply` with:

- the unchanged configuration file;
- the approved `configuration_sha256`;
- a new non-secret idempotency operation ID.

The helper revalidates the file and refuses a changed fingerprint. WordPress
takes a snapshot, applies the supported fields idempotently, records a redacted
audit event, and preserves the previous visibility state. Initial setup never
turns the public widget on.

### 8. Verify, roll back, and go live separately

Read `actions/verify.md` and `qa/verification-checklist.md`.

Run `verify`, compare read-back state with the approved artifacts, and complete
the behavior checklist using fictional inputs. If apply or verification is
wrong, run `rollback` with the returned rollback ID before another attempt.

Only after every readiness blocker passes, ask separately for go-live approval.
Run `go-live` only with the approved apply ID, configuration SHA, a new operation
ID, and the explicit confirmation flag. Verify one anonymous public session.

At completion or on abandonment, run `revoke-wordpress`. This revokes the remote
Application Password and deletes its local OS credential. Pro activation
remains connected until the owner explicitly runs `disconnect-license` or uses
the connected-websites screen on quip.bot.

## Security contract

- Human login and consent happen only in the system browser; the agent never
  operates or reads the authenticated browser.
- Only HTTPS is accepted outside recognized local development sites.
- Redirects are refused. WordPress and API endpoints must match the exact
  canonical origin and path.
- Browser callbacks bind to `127.0.0.1`, use an unguessable path and state, set
  no-store/no-referrer/CSP headers, and expire after ten minutes.
- Quip Bot account authorization uses a short-lived single-use code, PKCE S256,
  a short-lived single-purpose token, and a one-time activation grant.
- WordPress credentials stay in Keychain or Credential Manager and are scoped
  to the setup namespace by the plugin.
- Provider keys are write-only. The helper may report only configured and test
  status.
- Activation tokens are opaque, encrypted at rest in WordPress, and bound to
  the exact site URL and installation ID.
- API bodies and responses are size-limited; outputs and errors are redacted.
- Configuration uses a closed schema, validation fingerprint, explicit
  approval, idempotency, snapshot, rollback, and separate go-live operation.
- Never record credentials in shell history, process arguments, logs,
  screenshots, Markdown, JSON artifacts, or chat.

## Related material

- `actions/preflight.md` — compatibility and safety opening gate.
- `actions/connect.md` — browser consent and credential lifecycle.
- `actions/configure.md` — plan, validate, approve, apply, and rollback.
- `actions/verify.md` — readiness and separate go-live gates.
- `contracts/current-api-contract.md` — exact helper/API commands and schema.
- `contracts/security-model.md` — trust boundaries and threat controls.
- `contracts/admin-guided-path.md` — fallback when secure automation is absent.
- `contracts/installation-and-rollback.md` — installation and recovery.
- `contracts/configuration-fields.md` — Quip Bot 3.12.0 field map.
- `qa/verification-checklist.md` — release gate.
