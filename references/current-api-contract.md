# Current QuipBot API contract

## Stable public setup surface

None is released as of 2026-08-17. Automated WordPress writes are blocked.

## Existing internal surface

QuipBot currently has authenticated internal admin routes under `iqb/v1/admin`
for settings, providers, presets, analysis, conversations, and leads. They were
built for the bundled WordPress admin application, not promised as a public
automation contract.

The skill may use the route inventory only to shape the future contract. It must
not call these routes in v0.1.0.

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
