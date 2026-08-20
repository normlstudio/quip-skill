# Guided QuipBot admin path

Use this path while the public setup API and credential helper are unavailable.
The human remains in control of the authenticated WordPress browser. The agent
prepares the plan, explains each step, and records non-secret confirmations.

## Before entering wp-admin

1. Complete `preflight.md`: canonical origin, authority, installation/version,
   environment, backup/reset path, rollback, and visibility off.
2. Record the current non-secret baseline from
   `references/installation-and-rollback.md`.
3. Complete `research.md`, `owner-answers.md`, and the field-level rows in
   `configuration-plan.md`.
4. Keep QuipBot in preview mode until verification passes.
5. Ask for explicit approval of the plan before the human changes WordPress.

## Human-operated sequence

### 1. Connect the AI provider

Open **QuipBot → Settings → AI providers**.

- Choose Anthropic, OpenAI, Gemini, or OpenRouter.
- Choose a listed model or enter a provider-supported custom model ID.
- The human pastes the provider key into the password field.
- Click **Test connection**, then **Save settings**.
- Record only provider, model, and whether the test passed. Never ask for the
  key, its prefix/suffix, an authenticated screenshot, or a copied response.

The site owner pays the provider directly. QuipBot core is free forever. A
future Quip Pro license does not include provider inference.

### 2. Give the assistant starting knowledge

Open **QuipBot → Setup**.

- For a no-cost starting point, apply the closest industry preset and review
  every generated topic afterward.
- For site-specific generation, use **Analyze my site** only after the provider
  test passes. Review the collected pages and generated draft before applying.
- Never treat generated facts, consent text, or regulated guidance as approved
  merely because the plugin created them.

### 3. Review knowledge and behavior

Open **QuipBot → Knowledge base**.

- Compare business facts and Q&A entries with `research.md` and owner answers.
- Keep hard rules and prohibited claims explicit.
- Remove unsupported facts and add missing escalation boundaries.

Open **QuipBot → Templates** and review visitor-facing prompts and fallbacks.

### 4. Review operations and privacy

Open **QuipBot → Settings** and review these sections:

- **Legal texts** — consent and short disclosure.
- **Contacts** — lead destination and contact routes.
- **Notifications** — digest behavior and recipient.
- **Anonymous conversations** — retention and browser-memory choice.
- **Human takeover** — return-to-assistant behavior.
- **Widget appearance** and **Languages** — approved identity and language scope.

Use `references/configuration-fields.md` to record every field separately,
including its environment, data classification, verification, and rollback.

Do not enable paid-only behavior without a valid entitlement. Do not promise a
public setup API, managed inference, or WordPress.org availability before each
is actually released.

### 5. Preview, verify, and go live separately

Keep **Settings → Visibility → Make the bot live for visitors** off. Use the
plugin's preview link to run the verification checklist.

After every readiness-blocking check except L04 passes, ask separately:

> The reviewed setup passes the guided verification. Do you approve making
> QuipBot live for visitors on this site now?

Record the explicit yes as L04 passed. Only then should the human enable
visibility and save. Verify one public conversation without putting visitor
personal data in the setup artifacts.

## Status values

Record these in `configuration-plan.md`:

```yaml
connection: guided-manual
automation: blocked-public-helper-and-api
provider_test: pending | passed | failed
configuration: planned | human-applied | verified
go_live: off | approved | live
```

Never use `passed` or `verified` based only on an instruction being shown. The
human must confirm the result or the public behavior must be independently
observable without authentication.
