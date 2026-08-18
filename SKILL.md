---
name: quip-setup
version: 0.1.0
scope: project
description: >
  Set up QuipBot on a WordPress site through a safe five-stage workflow:
  research, owner questions, connect, configure, and verify. Use when a site
  owner asks to install, plan, configure, review, or launch QuipBot without
  exposing WordPress passwords or AI-provider keys to the agent.
metadata:
  version: "0.1.0"
  author: "Norml Studio"
---

# Quip setup

Guide a WordPress site owner from public-site research to a reviewed QuipBot
configuration. Keep human credentials out of the AI conversation and make every
production change explicit and reviewable.

## When to use

- "Set up QuipBot on my WordPress site."
- "Research my site before configuring QuipBot."
- "Help me plan the QuipBot knowledge base."
- "Connect this WordPress site to the Quip setup flow."
- "Review whether QuipBot is ready to go live."
- "Resume my QuipBot setup."

## Do not use

- For general WordPress administration outside QuipBot.
- To obtain, rotate, or expose an AI-provider secret.
- To enable paid Quip capabilities that the account does not own.
- To bypass WordPress capabilities, nonces, consent, or a human approval step.
- To write through SSH, direct database access, or undocumented plugin internals.

## Current release state

Version 0.1.0 is a public alpha.

- Research, owner questions, artifact generation, and manual verification are
  available now.
- WordPress connection and automated configuration are specification-complete
  but intentionally paused until QuipBot publishes its stable public setup API
  and the OS-native credential helper is released.
- Do not automate against the plugin's current internal `iqb/v1/admin` routes.
- The free QuipBot core does not require a Quip account or license.
- Quip account authorization is reserved for a future paid add-on or managed
  service that genuinely needs it.

If the user asks for a blocked write, complete the research and configuration
plan, then state the missing contract plainly. Never improvise an unsafe path.

## Inputs

Required:

- Canonical public WordPress site URL.
- Confirmation that the user owns or is authorized to manage the site.
- A writable local folder for the setup artifacts.

Collected during the workflow:

- Business purpose, audiences, questions, exclusions, and escalation rules.
- Public source pages to include or exclude.
- Provider and model choice, but never the provider key itself.
- Consent, disclosure, contact, tone, and go-live decisions.

Optional:

- Staging URL.
- Existing FAQ, policy, handoff, or support documentation.
- Prior QuipBot setup artifacts to resume.

## Output folder

Create or reuse `quip-setup/` in the user's chosen working directory:

```text
quip-setup/
├── research.md
├── owner-answers.md
├── configuration-plan.md
└── verification.md
```

Never write a credential, token, reset link, Application Password, or provider
key into these files.

## Workflow

### 1. Research

Read `actions/research.md` and `templates/research.md`.

Research only public pages. Build a cited picture of the business, audience,
services, recurring questions, contact paths, policies, and important gaps.
Write `quip-setup/research.md` before asking the owner to repeat facts already
published on the site.

### 2. Owner questions

Read `actions/questions.md` and `templates/owner-answers.md`.

Ask only for decisions or private operating context that public research cannot
answer. Work in short batches. Record explicit answers and mark unresolved
items; do not fill gaps with guesses.

### 3. Connect

Read `actions/connect.md` and `references/security-model.md`.

The intended WordPress connection uses the core Application Password consent
screen in the user's system browser. The agent never controls that browser and
never asks for the WordPress account password or generated Application Password
in chat. The helper stores the credential directly in macOS Keychain or Windows
Credential Manager.

In v0.1.0, stop before opening or completing authorization because the public
helper is not shipped. Record `connection: blocked-public-helper` in
`configuration-plan.md` and continue with the plan-only stages.

### 4. Configure

Read `actions/configure.md`, `references/current-api-contract.md`, and
`templates/configuration-plan.md`.

Map the approved research and owner answers to QuipBot settings, knowledge,
consent, handoff, provider choice, appearance, and launch gates. Provider keys
remain write-only in WordPress admin and are entered by the human.

In v0.1.0, produce `configuration-plan.md` but make no WordPress writes. A later
skill version may write only through the published Quip setup API, after showing
the exact proposed changes and receiving explicit approval.

### 5. Verify

Read `actions/verify.md` and `qa/verification-checklist.md`.

Verify the configuration plan for completeness now. After the public API/helper
ship, verification must also cover provider connection, knowledge, consent,
test-chat behavior, escalation, privacy, and the public widget. Keep the bot off
until the user explicitly approves go-live.

Write the result to `quip-setup/verification.md` with `pass`, `fail`, `blocked`,
or `not-applicable` for every check.

## Security contract

- Never ask for a WordPress password, Application Password, provider key, Quip
  token, license key, payment key, or reset link in chat.
- Never print, log, screenshot, or save secret-bearing URLs or response bodies.
- Open a system browser only for human login and consent; never automate it.
- Store secrets only through the released OS-native helper.
- Use WordPress capabilities and the published Quip setup API; never SSH or SQL.
- Treat provider keys as write-only. Automation may inspect `has_key`, provider,
  model, and test status only.
- Require explicit approval immediately before any production write or go-live.
- Abort on an unexpected hostname, redirect, TLS error, capability failure, or
  API-version mismatch.

## Outputs

- A cited public-site research artifact.
- An owner-answer record that separates decisions from assumptions.
- A field-by-field configuration plan with source and approval state.
- A verification report that exposes every blocker.
- No credentials and no hidden production side effects.

## Related material

- `references/security-model.md` — credential and consent boundaries.
- `references/current-api-contract.md` — what is stable, internal, or blocked.
- `qa/verification-checklist.md` — release gate for a configured installation.
