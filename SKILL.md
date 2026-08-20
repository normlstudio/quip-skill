---
name: quip-setup
description: >
  Install or set up QuipBot on a WordPress site through a safe six-stage
  workflow: preflight, research, owner questions, connect, configure, and
  verify. Supports the guided WordPress-admin path available today and a future
  API-driven path. Use when a site owner asks to install, plan, configure,
  review, or launch QuipBot without exposing WordPress passwords or AI-provider
  keys to the agent.
metadata:
  version: "0.2.0"
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

Version 0.2.0 is a public alpha with a complete guided setup path.

- Research, owner questions, configuration planning, human-operated WordPress
  setup, and manual/public verification are available now.
- The human performs every wp-admin action. The agent supplies a reviewed plan
  and never controls, reads, or screenshots the authenticated browser.
- Direct agent writes remain paused until QuipBot publishes its stable public
  setup API and the OS-native credential helper is released.
- Do not automate against the plugin's current internal `iqb/v1/admin` routes.
- The free QuipBot core is free forever and requires no Quip account or license.
  The site owner connects and pays a supported AI provider directly.
- Quip Pro and provider inference are separate purchases. Never imply that the
  $200/year Pro license includes AI usage.

If the user asks for direct automated writes, use the guided path instead and
state the missing API/helper contract plainly. Never improvise an unsafe path.

## Inputs

Required:

- Canonical public WordPress site URL.
- Confirmation that the user owns or is authorized to manage the site.
- A writable local folder for the setup artifacts.
- The target environment: staging or production.

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
├── preflight.md
├── research.md
├── owner-answers.md
├── configuration-plan.md
└── verification.md
```

Never write a credential, token, reset link, Application Password, or provider
key into these files.

## Start from the QuipBot onboarding page

The plugin's Setup page may link to this public repository. If the skill is not
installed, ask the human to run this in their own terminal:

```bash
npx skills add Norml-Studio/quip-skill -g
```

The current open `skills` installer requires Node.js 22.20 or newer. If the
command reports an engine-version error, stop and ask the human to update Node
through their normal developer-tooling process; do not install or replace their
runtime without approval.

Then ask them to start a new agent turn with:

```text
Use quip-setup to set up QuipBot on https://example.com
```

Do not put a WordPress password, provider key, Application Password, or secret
URL into that command or the conversation.

## Workflow

### 0. Preflight and installation

Read `actions/preflight.md` and `references/installation-and-rollback.md`.

Before researching or changing WordPress, explicitly confirm management
authority, canonical origin, artifact folder, target environment, backup state,
and whether QuipBot is installed and active. Record the installed version and
compatibility status. Version 0.2.0 of this guide is verified against QuipBot
3.10.0; stop on an older version or an incompatible WordPress/PHP runtime.

If QuipBot is absent, the human may install it only from a verified official
distribution. Do not guess a package URL, use an arbitrary mirror, or claim a
WordPress.org listing exists. If no official package is available to the owner,
record `installation: blocked-official-package` and stop before configuration.

On production, require a human-confirmed restorable backup before any change.
Keep the public widget off. Record the rollback and immediate-disable path.

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

Read `actions/connect.md`, `references/security-model.md`, and
`references/admin-guided-path.md`.

Default to `connection: guided-manual`. The human opens QuipBot in wp-admin and
performs the approved steps while the agent remains outside the authenticated
browser. The provider key stays write-only in QuipBot Settings.

The future automated connection uses WordPress core's Application Password
consent screen plus an OS-native helper. Until both the helper and public API
exist, record `automation: blocked-public-helper-and-api` without blocking the
guided workflow.

### 4. Configure

Read `actions/configure.md`, `references/current-api-contract.md`,
`references/admin-guided-path.md`, `references/configuration-fields.md`, and
`templates/configuration-plan.md`.

Map the approved research and owner answers to QuipBot settings, knowledge,
consent, handoff, provider choice, appearance, and launch gates. Provider keys
remain write-only in WordPress admin and are entered by the human.

Show the reviewed plan and ask for explicit approval. In guided mode, direct the
human through the exact QuipBot screens and ask them to confirm only non-secret
status. Never ask them to paste a provider key or authenticated screenshot.

A later skill version may write directly only through the published Quip setup
API, after showing the exact proposed changes and receiving explicit approval.

### 5. Verify

Read `actions/verify.md` and `qa/verification-checklist.md`.

Verify the plan and the human-confirmed guided setup now. Cover provider test
status without the key, knowledge, consent, test-chat behavior, escalation,
privacy, and the preview widget. Keep the bot off until the user explicitly
approves go-live. Treat every checklist row marked `blocking` as a release gate.
If a post-launch check fails, first turn visibility off, then use the recorded
rollback path. Direct automated verification remains blocked until the public
API/helper ship.

Write the result to `quip-setup/verification.md` with `pass`, `fail`, `blocked`,
or `not-applicable` for every check.

## Security contract

- Never ask for a WordPress password, Application Password, provider key, Quip
  token, license key, payment key, or reset link in chat.
- Never print, log, screenshot, or save secret-bearing URLs or response bodies.
- Open a system browser only for human login and consent; never automate it.
- In guided mode, the human uses the existing authenticated wp-admin session and
  enters provider secrets directly into QuipBot's write-only field.
- In automated mode, store secrets only through the released OS-native helper.
- Use WordPress capabilities and the published Quip setup API; never SSH or SQL.
- Treat provider keys as write-only. Automation may inspect `has_key`, provider,
  model, and test status only.
- Require explicit approval immediately before any production write or go-live.
- Abort on an unexpected hostname, redirect, TLS error, capability failure, or
  API-version mismatch.
- Never install a plugin package from an unverified mirror, attachment, or URL
  invented by the agent.
- On production, do not change QuipBot until the human confirms a restorable
  backup; failed post-launch behavior returns visibility to off first.

## Outputs

- A cited public-site research artifact.
- An owner-answer record that separates decisions from assumptions.
- A field-by-field configuration plan with source and approval state.
- A verification report that exposes every blocker.
- An installation, environment, backup, and rollback preflight record.
- No credentials and no hidden production side effects.

## Related material

- `references/security-model.md` — credential and consent boundaries.
- `references/admin-guided-path.md` — current human-operated wp-admin sequence.
- `references/installation-and-rollback.md` — cold-start, compatibility, backup,
  and recovery gates.
- `references/configuration-fields.md` — field-level map for QuipBot 3.10.0.
- `references/current-api-contract.md` — what is stable, internal, or blocked.
- `qa/verification-checklist.md` — release gate for a configured installation.
