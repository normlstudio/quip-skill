# Current Quip Bot API contract

## Stable public setup surface

None is released as of 2026-08-20. Direct agent writes are blocked. Version
0.2.1 uses the human-operated admin path instead.

## Existing internal surface

Quip Bot currently has authenticated internal admin routes under `iqb/v1/admin`
for settings, providers, presets, analysis, conversations, and leads. They were
built for the bundled WordPress admin application, not promised as a public
automation contract.

The skill may use the route inventory only to shape the future contract. It must
not call these routes in v0.2.1.

## Supported path today

The human may use the bundled Quip Bot admin application to apply an approved
plan. The agent stays outside the authenticated browser and records only
non-secret confirmations. This is a guided workflow, not an API connection.

See `contracts/admin-guided-path.md` for the exact sequence.

Installation and activation are also human-operated. They follow
`contracts/installation-and-rollback.md`; package acquisition is not part of
the internal admin REST surface.

## Required public contract before writes

The plugin owner must publish:

- explicit version and compatibility negotiation;
- least-privilege setup capability;
- read-only status endpoint;
- draft settings and knowledge endpoints;
- consent, handoff, appearance, and launch-gate fields;
- write-only provider-key status and test operation;
- preview/test-chat operation excluded from customer reporting;
- validation errors with stable machine-readable codes;
- idempotency and rollback behavior;
- redacted audit events;
- activation and go-live as separate explicit operations.

The published schema becomes the source of truth. The skill must fail closed on
unknown fields or versions.
