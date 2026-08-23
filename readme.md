# quip-setup

> Research, connect, configure, verify, and launch Quip Bot on WordPress without
> putting WordPress, provider, or Pro credentials into the AI conversation.

## The problem

A useful WordPress assistant needs grounded business knowledge, approved
wording, consent, escalation rules, and a testable launch decision. It cannot be
configured safely from an API key alone.

Chat-based setup also tempts people to paste WordPress passwords, Application
Passwords, provider keys, or license keys into a transcript. `quip-setup` keeps
human authorization in the browser, credentials in the operating-system store,
and only non-secret plans and evidence in the project.

## How to use it

| When you want to… | Say something like… |
|---|---|
| Start a complete setup | *"Set up Quip Bot on my WordPress site."* |
| Research first | *"Research my site before configuring Quip Bot."* |
| Plan the knowledge base | *"Help me plan the Quip Bot knowledge base."* |
| Connect WordPress | *"Connect my WordPress site securely."* |
| Connect Pro | *"Connect this site to my Quip Bot Pro account."* |
| Apply an approved plan | *"Apply this approved Quip Bot configuration."* |
| Review launch readiness | *"Review whether Quip Bot is ready to go live."* |
| Resume | *"Resume my Quip Bot setup."* |

## A typical run

1. The skill records authority, environment, installation, backup, rollback,
   compatibility, and visibility in `quip-setup/preflight.md`.
2. It researches public pages, asks only unresolved owner questions, and writes
   cited research plus decisions.
3. A helper opens WordPress for human approval and stores the generated setup
   credential in macOS Keychain or Windows Credential Manager.
4. The skill creates `configuration-plan.md` and `configuration.json`, validates
   them, shows the exact SHA-256, and applies only after explicit approval.
5. It verifies while the widget stays off, rolls back if needed, then asks
   separately before go-live and revokes the temporary WordPress connection.

> **Free core versus Pro:** Quip Bot core is free forever and needs no quip.bot
> account. Pro is a separate $200/year entitlement. Provider usage is billed by
> the provider and is not included in Pro.

---

## Details

### Install

Install the public skill for a local AI agent:

```bash
npx skills add Norml-Studio/quip-skill -g
```

The open `skills` installer requires Node.js 22.20 or newer. Update Node through
the normal developer-tooling process if the installer reports an engine error.

Then begin with only the public site URL:

```text
Use quip-setup to set up Quip Bot on https://example.com
```

Never place a WordPress password, provider key, Application Password, license
key, token, reset link, or secret URL in that command or conversation.

### Supported setup paths

Version 0.3.0 has two paths.

**Secure assisted setup** requires:

- macOS or Windows;
- Quip Bot 3.12.0 or newer;
- setup API and schema 1.0;
- WordPress 6.2 or newer;
- PHP 7.4 or newer;
- HTTPS, except for recognized local development hostnames.

The included helper opens consent pages, stores credentials natively, talks only
to the public setup API, and prints redacted JSON.

**Guided fallback** is used on Linux or when the plugin, API, or credential store
is incompatible. The human operates wp-admin while the agent supplies the plan
and records non-secret confirmations. It never falls back to browser automation,
SSH, XML-RPC, database access, or a pasted credential.

The assisted path was verified locally end to end. A public site must report
3.12.0+ and API 1.0 before the skill treats automation as available.

### Inputs and outputs

Required inputs:

- canonical WordPress URL;
- confirmation that the user may manage the site;
- approved local workspace;
- target environment;
- backup or reset checkpoint before a production write.

The workflow also collects business purpose, audiences, knowledge sources,
boundaries, provider/model choice, consent, privacy, contact, appearance, and
launch decisions. It never collects the provider key.

The output folder is:

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

- `preflight.md` records authority, versions, recovery, and visibility.
- `research.md` separates cited facts, owner-supplied material, and unknowns.
- `owner-answers.md` records decisions without manufacturing missing answers.
- `connection.md` records redacted WordPress and optional Pro status.
- `configuration-plan.md` maps each field to its source, approval, test, and
  rollback.
- `configuration.json` contains only the closed API 1.0 field projection.
- `verification.md` exposes every pass, failure, blocker, and launch decision.

Markdown research is not uploaded wholesale. Approved facts are mapped into
specific configuration fields before `configuration.json` is validated.

### Research and owner questions

The skill checks the canonical origin, `robots.txt`, and XML sitemap when
available. It reads relevant public business, product, service, contact, FAQ,
policy, and support pages. It does not log in, submit forms, scrape visitor
information, or bypass blocks.

When public reading is unavailable, the owner may deliberately supply a local
file, pasted excerpt, or URL. The skill labels it `owner-supplied` and records
title, date, visibility, and the exact facts used.

Questions arrive in short batches and cover outcome, audience, knowledge,
exclusions, escalation, leads, tone, consent, privacy, provider/model, language,
production-write authority, and go-live authority. Unanswered decisions remain
`unresolved`.

### WordPress browser connection

The helper calls the public compatibility endpoint first. That response contains
versions, canonical URLs, application identity, and capabilities, but no
persistent installation ID or configured business data.

`connect-wordpress` then:

1. binds an unguessable callback to `127.0.0.1`;
2. opens WordPress core's Application Password approval page;
3. waits while the human logs in and approves **Quip Bot setup**;
4. validates callback state and the exact site;
5. stores the credential in Keychain or Credential Manager;
6. reads redacted setup status.

The plugin denies that Application Password outside
`/wp-json/iqb/v1/setup/*`. The agent never sees the normal WordPress password or
generated Application Password.

At completion, `revoke-wordpress` revokes the remote credential and deletes the
native local item.

### Optional Quip Bot Pro connection

Free core setup skips account authorization entirely.

For Pro, `connect-account` opens only `https://quip.bot/account/`. The consent
screen shows the exact site, detected environment, and two permissions:
entitlement read and one activation grant.

The flow uses an exact loopback redirect, opaque state, PKCE S256, a two-minute
single-use code, a fifteen-minute token with no refresh token, and a five-minute
single-use activation grant. The token is deleted after the grant is issued.

The WordPress plugin exchanges the grant server to server and stores an opaque
activation token encrypted at rest. The token is bound to the site URL and an
installation ID that changes when a cloned database moves to another URL.

The default entitlement allows:

- one production website;
- three active non-production connections across staging, development, and
  recognized local copies.

Every connection appears in the account and can be disconnected separately.
This makes a copied key or database insufficient to activate a different site.

### Provider-key entry

The provider/model choice is non-secret. The key is not.

For assisted setup, `provider` opens a loopback-only password form. The human
enters the key there; it goes directly to the fixed WordPress setup endpoint and
is never printed or written to an artifact. `provider-test` returns only the
provider, model, configured status, and test result.

In guided fallback, the human enters the key in Quip Bot's write-only WordPress
settings. The agent records only saved/not-saved and pass/fail.

### Configuration approval and apply

The API 1.0 envelope has five supported sections: provider, settings, knowledge,
templates, and appearance. Every object is closed; unknown fields and invalid
values fail validation.

`validate` performs no writes. It returns a section summary, errors, warnings,
and deterministic `configuration_sha256`.

Before apply, the skill shows the exact non-secret proposal, site, environment,
warnings, SHA-256, and rollback path. It asks for an explicit write approval.
The helper then revalidates the unchanged file and sends:

- the approved SHA-256;
- a fresh idempotency operation ID;
- approval for this artifact only.

WordPress snapshots setup-owned options, applies only the schema, records a
redacted audit event, and returns apply and rollback IDs. Replaying the same
operation and SHA returns the same result. Reusing an ID for different content
is rejected. Initial apply never enables the public widget.

### Verification, rollback, and go-live

`verify` checks provider selection/configuration/test, business knowledge,
consent, handoff, approved apply, and visibility. The full checklist also tests
supported, unknown, prohibited, and unrelated questions with fictional data,
plus disclosure, handoff, error states, mobile, and desktop behavior.

If the applied configuration is wrong, `rollback` restores the captured values
before the next attempt.

Go-live is a second decision. After all readiness blockers pass, the owner must
approve the exact apply ID and SHA separately. The `go-live` command rechecks
readiness, requires its own operation ID and confirmation flag, then changes
visibility. One anonymous public session is tested immediately. A failure turns
visibility off before troubleshooting.

### Security properties

- human-operated external-browser login and consent;
- loopback-only callbacks with state, exact Host, CSP, no-store, no-referrer,
  frame denial, and timeout;
- HTTPS and exact-origin/path validation with redirects refused;
- Keychain or Credential Manager storage, never project files;
- WordPress credential limited to the setup namespace;
- PKCE, single-use codes/grants, short expiry, and least scopes for Pro;
- hashed server tokens and encrypted site activation tokens;
- write-only provider keys;
- bounded request/response bodies and protected request headers;
- closed schema, approved fingerprint, idempotency, snapshot, rollback, and
  separate go-live;
- redacted output and no credential-bearing artifact.

### Where things live

- `SKILL.md` — executable workflow and guardrails.
- `scripts/quip-setup.mjs` — redacting helper command surface.
- `scripts/lib/` — endpoint, callback, and credential-store clients.
- `scripts/native/` — macOS Keychain and Windows Credential Manager adapters.
- `actions/` — stage instructions.
- `contracts/current-api-contract.md` — exact API/helper contract.
- `contracts/security-model.md` — trust boundaries.
- `contracts/admin-guided-path.md` — fallback path.
- `contracts/configuration-fields.md` — Quip Bot 3.12.0 field map.
- `templates/` — artifact templates.
- `qa/verification-checklist.md` — release gate.

### When something breaks

- **Unexpected host, path, redirect, or TLS error:** stop; do not authorize or
  retry against the new target automatically.
- **Plugin/API below the assisted floor:** use guided fallback or upgrade through
  the owner's trusted process.
- **Linux or native-store self-test failure:** use guided fallback; never store a
  credential in a project file.
- **Browser approval times out or is denied:** close the helper and restart only
  when the owner asks.
- **Configuration SHA changes:** validate again and request new approval.
- **Apply or verification is wrong:** keep visibility off and use the returned
  rollback ID.
- **Pro connection limit is reached:** disconnect the old site in the account;
  never reuse another site's activation.
- **A secret appears in chat:** stop using it, remove it from downstream
  artifacts, and rotate it at its issuing service.
- **A public test fails:** turn visibility off first, then roll back or restore.

---

_Covers SKILL.md v0.3.0 | Last changelog entry: v0.3.0 | Generated: 2026-08-23._
