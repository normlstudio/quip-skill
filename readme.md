# quip-setup

> Safely install, research, plan, connect, configure, and verify QuipBot on
> WordPress without exposing site passwords or AI-provider keys to the agent.

## The problem

A useful WordPress chatbot needs more than an API key. It needs grounded
business knowledge, approved wording, consent, escalation rules, and a testable
launch decision.

Ordinary chat-based setup also creates a security trap: people paste WordPress
passwords, Application Passwords, provider keys, or reset links into the AI
conversation. `quip-setup` separates human authorization from agent work and
stores only non-secret setup artifacts.

## Install

Install the public skill for your local agent:

```bash
npx skills add Norml-Studio/quip-skill -g
```

The current open `skills` installer requires Node.js 22.20 or newer. If it
reports an engine-version error, update Node through your normal developer
tooling before retrying.

The installer supports Codex, Claude Code, Cursor, and other agents in the open
skills ecosystem. Then start a new agent turn with:

```text
Use quip-setup to set up QuipBot on https://example.com
```

Use only the public site URL. Never place a WordPress password, provider key,
Application Password, or secret URL in the command or conversation.

## How to use it

| When you want to… | Say something like… |
|---|---|
| Start a complete setup | *"Set up QuipBot on my WordPress site."* |
| Research before configuring | *"Research my site before configuring QuipBot."* |
| Plan the bot's knowledge | *"Help me plan the QuipBot knowledge base."* |
| Prepare the safe connection | *"Connect this WordPress site to the Quip setup flow."* |
| Review launch readiness | *"Review whether QuipBot is ready to go live."* |
| Continue existing work | *"Resume my QuipBot setup."* |

## A typical run

1. It confirms authority, environment, official installation, compatibility,
   backup/reset, rollback, and public visibility in `quip-setup/preflight.md`.
2. The skill reads public pages and writes cited findings to
   `quip-setup/research.md`.
3. It asks only for owner decisions the site cannot answer and records them in
   `quip-setup/owner-answers.md`.
4. It creates a field-by-field plan in `quip-setup/configuration-plan.md`.
5. After approval, it guides the human through QuipBot's WordPress admin while
   staying outside the authenticated browser.
6. It records passed, failed, and blocked checks in `verification.md`, then asks
   separately before the human enables the public widget.

> **Public alpha:** version 0.2.0 completes the human-guided setup and
> verification path available today. Direct agent writes remain blocked until
> QuipBot publishes its stable setup API and OS-native credential helper.

---

## Details

### What the skill does

The workflow has six visible stages:

1. **Preflight** — checks authority, official installation, versions,
   environment, backup/reset, rollback, and visibility.
2. **Research** — reads public site pages and cites every business fact.
3. **Owner questions** — collects operating decisions, boundaries, and wording.
4. **Connect** — defines WordPress Application Password consent through the
   system browser and an OS-native credential helper.
5. **Configure** — maps approved inputs to provider, knowledge, consent,
   handoff, lead, appearance, language, and launch settings.
6. **Verify** — checks authority, data, behavior, privacy, and launch gates.

Version 0.2.0 runs all six stages through a human-operated wp-admin path. It
never pretends that a blocked direct connection or API exists.

### Inputs

Required:

- canonical public WordPress site URL;
- confirmation that the user may manage the site;
- a writable local folder for non-secret artifacts;
- staging or production target.

Collected during setup:

- business purpose and visitor outcomes;
- approved public and private knowledge sources;
- must-answer and must-not-answer topics;
- handoff and lead-routing rules;
- tone, disclosure, consent, and launch authority;
- provider and model choice, excluding the provider key;
- one free-core site language.

Optional inputs include a staging URL, existing support or policy documents,
and prior setup artifacts.

### Outputs

The skill creates or reuses this folder:

```text
quip-setup/
├── preflight.md
├── research.md
├── owner-answers.md
├── configuration-plan.md
└── verification.md
```

- `preflight.md` records installation, compatibility, environment, recovery,
  and visibility gates.
- `research.md` separates sourced facts, inferences, and unknowns.
- `owner-answers.md` records approvals and unresolved decisions.
- `configuration-plan.md` maps every proposed field to its source and test.
- `verification.md` exposes each pass, failure, and blocker.

None of these files may contain a password, Application Password, provider key,
Quip token, license key, payment key, reset link, cookie, or secret-bearing URL.

### Research behavior

The research stage checks the canonical HTTPS origin, `robots.txt`, and the XML
sitemap when available. It reads the most relevant public business, product,
service, contact, FAQ, policy, and support pages.

It does not log in, submit forms, scrape visitor information, or bypass a site
that blocks automated reading. It never turns marketing claims into guarantees
or legal advice.

When public reading is unavailable, the skill may use a local file, pasted
excerpt, or URL deliberately supplied by the owner. It labels that material
`owner-supplied`, records its title/date and public/private status, and never
misrepresents it as independently public-verified.

### Installation and recovery

The cold-start preflight works whether QuipBot is already active or absent. The
human reports the plugin, WordPress, and PHP versions from wp-admin. This guide
is verified against QuipBot 3.10.0 and uses WordPress 6.2 and PHP 7.4 as runtime
floors.

If the plugin is absent, the human installs only from a verified official
WordPress directory result, official QuipBot product download, or the owner's
existing QuipBot/Norml delivery channel. The skill never invents a package URL
or substitutes an unofficial mirror. No verified package means the honest
result is `installation: blocked-official-package`.

Staging is preferred when available. Production changes require a
human-confirmed restorable backup. The recorded immediate-disable path is to
turn visibility off; if wp-admin's QuipBot UI is unavailable, the human may
deactivate the plugin. Failed public behavior is disabled before troubleshooting.

### Owner-question behavior

Questions arrive in short batches and cover:

- visitor outcome and audience;
- authoritative knowledge and exclusions;
- escalation, contact, and lead fields;
- voice, terminology, and prohibited wording;
- disclosure, consent, and legal-review status;
- provider and model choice;
- free-core site language;
- production-write and go-live approvers.

The skill marks an unanswered decision `unresolved`; it does not manufacture an
answer.

### Connection model

The available connection is `guided-manual`: the human uses their existing
authenticated wp-admin session while the agent stays outside the browser. The
human enters the provider key in QuipBot's write-only field and reports only
non-secret state such as the chosen provider/model and whether the test passed.

The future direct connection uses WordPress core's Application Password consent
screen in the system browser. A local helper captures the generated credential
and stores it directly in macOS Keychain or Windows Credential Manager.

The agent never controls the browser, reads the authenticated page, collects the
normal WordPress password, or receives the generated Application Password.

Because the helper and public API are not included in version 0.2.0, the skill
records:

```yaml
connection: guided-manual
automation: blocked-public-helper-and-api
```

It does not fall back to browser automation, SSH, XML-RPC, direct database
access, or a credential pasted into chat.

### Configuration model

The current QuipBot plugin has internal admin routes, but they are not a stable
public automation contract. Version 0.2.0 does not call them.

After the plan is approved, the skill guides the human through **Settings → AI
providers**, **Setup**, **Knowledge base**, **Templates**, and the operational
Settings sections. The human keeps visibility off until verification passes.
The QuipBot 3.10.0 field map requires a separate plan row for every control,
including current state, source, approval, environment, data classification,
verification, and rollback.

The required future public API must provide version negotiation, least-privilege
setup access, status, draft configuration, write-only provider-key status,
knowledge, consent, handoff, preview, validation, rollback, and separate
activation/go-live operations.

After that API and the helper ship, a write-capable release must:

1. read current state;
2. show a redacted field-level diff;
3. request explicit approval immediately before writing;
4. write a disabled or draft configuration;
5. read it back and verify equality;
6. test behavior;
7. request separate go-live approval.

### Provider keys and Quip accounts

The human enters the provider key in QuipBot's write-only WordPress settings.
Automation may later inspect provider, model, `has_key`, and test status, but
never the key.

The free QuipBot core does not require a Quip account or paid license. A future
Quip device-authorization flow belongs only to a premium entitlement or managed
service that genuinely needs an account.

### Language and paid-feature boundary

The free setup records one WordPress site language. It does not promise true
multi-language operation; that capability is assigned to the future paid layer.

The skill never enables a paid capability the account does not own and never
uses a license to disable functionality already included in the free core.

### Verification

Plan verification checks that every configuration area has a value, an explicit
decision, or a visible blocker. Guided verification then confirms the human's
non-secret provider-test result, reviewed knowledge, consent, handoff, preview
behavior, and separate go-live approval. It also confirms the provider key is
absent and direct agent writes were not simulated. The checklist labels
blocking, conditional, and post-launch gates and defines concrete supported,
unknown, refusal, unrelated-request, consent, disclosure, handoff, fallback,
and responsive tests.

Runtime verification will become available after the public API/helper ship. It
must test provider status, knowledge, grounded answers, refusals, consent,
handoff, offline behavior, mobile/desktop appearance, and a separately approved
go-live.

### Where things live

- `SKILL.md` — executable workflow and guardrails.
- `actions/` — one file for each stage.
- `references/security-model.md` — trust and credential boundaries.
- `references/admin-guided-path.md` — current human-operated wp-admin sequence.
- `references/installation-and-rollback.md` — official package, version,
  environment, backup, and recovery contract.
- `references/configuration-fields.md` — field-level QuipBot 3.10.0 map.
- `references/current-api-contract.md` — public API gate.
- `templates/` — the setup artifact formats.
- `qa/verification-checklist.md` — plan and runtime release gate.

### When something breaks

- **Site redirects to an unexpected host:** stop and ask the user to confirm the
  canonical site; never authorize the redirect target automatically.
- **QuipBot is absent:** install only from a verified official distribution; if
  none is available, record `blocked-official-package`.
- **Version/runtime is below the documented floor:** stop before configuration
  and record the exact compatibility blocker.
- **Public pages block research:** list the documents needed from the owner; do
  not bypass the control; label any deliberately supplied fallback material
  `owner-supplied`.
- **User offers a password or key in chat:** ask them not to send it and use the
  approved human entry surface instead.
- **Connection helper is missing:** use the guided human-operated path and keep
  direct automation `blocked-public-helper-and-api`.
- **Public API version is missing or unknown:** make no WordPress write and
  record `blocked-stable-contract`.
- **A production write is ready:** show the redacted diff and obtain explicit
  approval immediately before the change.
- **A public test fails:** turn visibility off first, confirm the widget is
  absent, then follow the recorded rollback path.

---

_Covers SKILL.md v0.2.0 | Last changelog entry: v0.2.0 | Generated: 2026-08-20._
