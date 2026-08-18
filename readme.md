# quip-setup

> Research, plan, connect, configure, and verify QuipBot on WordPress without
> exposing site passwords or AI-provider keys to the agent.

## The problem

A useful WordPress chatbot needs more than an API key. It needs grounded
business knowledge, approved wording, consent, escalation rules, and a testable
launch decision.

Ordinary chat-based setup also creates a security trap: people paste WordPress
passwords, Application Passwords, provider keys, or reset links into the AI
conversation. `quip-setup` separates human authorization from agent work and
stores only non-secret setup artifacts.

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

1. The skill reads public pages and writes cited findings to
   `quip-setup/research.md`.
2. It asks only for owner decisions the site cannot answer and records them in
   `quip-setup/owner-answers.md`.
3. It checks the connection boundary without asking for a credential in chat.
4. It creates a field-by-field no-write plan in
   `quip-setup/configuration-plan.md`.
5. It records passed, failed, and blocked checks in
   `quip-setup/verification.md`.

> **Public alpha:** version 0.1.0 completes research, questions, planning, and
> manual verification. WordPress writes remain blocked until QuipBot publishes
> its stable setup API and the OS-native credential helper ships.

---

## Details

### What the skill does

The workflow has five visible stages:

1. **Research** — reads public site pages and cites every business fact.
2. **Owner questions** — collects operating decisions, boundaries, and wording.
3. **Connect** — defines WordPress Application Password consent through the
   system browser and an OS-native credential helper.
4. **Configure** — maps approved inputs to provider, knowledge, consent,
   handoff, lead, appearance, language, and launch settings.
5. **Verify** — checks authority, data, behavior, privacy, and launch gates.

Version 0.1.0 runs stages one and two, prepares stages three and four without
writing, and verifies the plan. It never pretends that a blocked connection or
API exists.

### Inputs

Required:

- canonical public WordPress site URL;
- confirmation that the user may manage the site;
- a writable local folder for non-secret artifacts.

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
├── research.md
├── owner-answers.md
├── configuration-plan.md
└── verification.md
```

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

The intended connection uses WordPress core's Application Password consent
screen in the system browser. The human signs in and approves access. A local
helper captures the generated credential and stores it directly in macOS
Keychain or Windows Credential Manager.

The agent does not control the browser, read the page, collect the normal
WordPress password, or receive the generated Application Password.

The helper is not included in version 0.1.0. The skill therefore records:

```yaml
connection: blocked-public-helper
```

It does not fall back to browser automation, SSH, XML-RPC, direct database
access, or a credential pasted into chat.

### Configuration model

The current QuipBot plugin has internal admin routes, but they are not a stable
public automation contract. Version 0.1.0 does not call them.

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
decision, or a visible blocker. It also confirms that facts are sourced, the
provider key is absent, consent and handoff are decided, and WordPress writes
were not simulated.

Runtime verification will become available after the public API/helper ship. It
must test provider status, knowledge, grounded answers, refusals, consent,
handoff, offline behavior, mobile/desktop appearance, and a separately approved
go-live.

### Where things live

- `SKILL.md` — executable workflow and guardrails.
- `actions/` — one file for each stage.
- `references/security-model.md` — trust and credential boundaries.
- `references/current-api-contract.md` — public API gate.
- `templates/` — the three setup artifact formats.
- `qa/verification-checklist.md` — plan and runtime release gate.

### When something breaks

- **Site redirects to an unexpected host:** stop and ask the user to confirm the
  canonical site; never authorize the redirect target automatically.
- **Public pages block research:** list the documents needed from the owner; do
  not bypass the control.
- **User offers a password or key in chat:** ask them not to send it and use the
  approved human entry surface instead.
- **Connection helper is missing:** keep `blocked-public-helper` and complete the
  plan-only path.
- **Public API version is missing or unknown:** make no WordPress write and
  record `blocked-stable-contract`.
- **A production write is ready:** show the redacted diff and obtain explicit
  approval immediately before the change.

---

_Covers SKILL.md v0.1.0 | Last changelog entry: v0.1.0 | Generated: 2026-08-17._
