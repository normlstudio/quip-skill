# Action: prepare or apply configuration

## Prepare the reviewed plan

Create `quip-setup/configuration-plan.md` from the research and owner answers.
For every field, record:

- proposed value or action;
- source: public URL, owner answer, or Quip default;
- approval state;
- target environment;
- whether it contains personal or regulated information;
- verification method.
- current non-secret value/status and rollback action.

Cover at least:

- provider and model choice, excluding the key;
- knowledge/business facts and FAQ topics;
- consent and AI disclosure;
- human handoff and contact routes;
- lead-capture behavior;
- operating boundaries and prohibited claims;
- error/offline wording;
- widget identity and appearance;
- one site language for the free core;
- launch-gate status.

Use `references/configuration-fields.md`; do not collapse the plan to one broad
row per screen.

## Guided apply mode in 0.2.0

1. Show the complete non-secret plan and ask for explicit approval.
2. After approval, read `references/admin-guided-path.md` and give one short
   wp-admin step at a time.
3. The human performs every authenticated click, paste, save, and provider test.
4. Ask only for non-secret results. Never ask for a key, authenticated
   screenshot, copied headers, cookie, or response body.
5. Update the plan to `configuration: human-applied` only after the human
   confirms the relevant save succeeded.
6. Keep visibility off and hand off to `actions/verify.md`.

If the human cannot access a named screen or label, record the exact mismatch
and stop that section. Do not improvise with internal routes, SSH, or SQL.

## Direct-write contract for a later release

When a stable public API and helper exist:

1. Read current state through the published versioned API.
2. Diff the current and proposed values.
3. Show the exact proposed changes without secret fields.
4. Ask for explicit approval immediately before the write.
5. Write a draft or disabled configuration first.
6. Read it back and verify field-level equality.
7. Never enable the public widget in the same step as initial configuration.

Do not use the existing internal admin routes as a substitute for this contract.
