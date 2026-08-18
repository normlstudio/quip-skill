# Action: prepare or apply configuration

## Plan-only mode in 0.1.0

Create `quip-setup/configuration-plan.md` from the research and owner answers.
For every field, record:

- proposed value or action;
- source: public URL, owner answer, or Quip default;
- approval state;
- target environment;
- whether it contains personal or regulated information;
- verification method.

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

## Write contract for a later release

When a stable public API and helper exist:

1. Read current state through the published versioned API.
2. Diff the current and proposed values.
3. Show the exact proposed changes without secret fields.
4. Ask for explicit approval immediately before the write.
5. Write a draft or disabled configuration first.
6. Read it back and verify field-level equality.
7. Never enable the public widget in the same step as initial configuration.

Do not use the existing internal admin routes as a substitute for this contract.
