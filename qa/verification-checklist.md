# Quip Bot setup verification checklist

Use `pass`, `fail`, `blocked`, or `not-applicable`. Record status, evidence,
tester, and timestamp for every row. Use fictional visitor inputs only.

## Release rule

- `blocking`: must pass before go-live.
- `conditional`: blocking when the feature or promise is enabled.
- `post-launch`: run immediately after go-live; failure triggers visibility off
  and rollback before troubleshooting.

Run readiness first, excluding L04. Request go-live approval only after every
other blocking row passes.

## Authority, installation, and connection

| ID | Gate | Check | Required evidence |
|---|---|---|---|
| A01 | blocking | Management authority confirmed | Named owner/approver |
| A02 | blocking | Canonical HTTPS origin and environment confirmed | Origin + environment |
| A03 | blocking | Quip Bot active and compatible | Plugin/WP/PHP/API versions |
| A04 | blocking | Backup/reset and rollback confirmed | Operator + timestamp/path |
| A05 | blocking | Public visibility off during setup | Status or anonymous check |
| A06 | blocking | Login/consent browser remained human-operated | Owner confirmation |
| A07 | conditional | Native credential self-test passed | Redacted helper result |
| A08 | conditional | WordPress setup credential denied outside setup namespace | Scope test or release evidence |
| A09 | conditional | WordPress authorization revoked after completion | Redacted revoke result |
| A10 | conditional | Pro browser consent showed exact site/environment/scopes | Owner confirmation |
| A11 | conditional | Pro activation is site-bound and redacted | License status only |

## Configuration integrity

| ID | Gate | Check | Required evidence |
|---|---|---|---|
| C01 | blocking | Closed-schema validation passed without writes | Validation result |
| C02 | blocking | Exact proposal and SHA shown before apply | SHA + approval record |
| C03 | blocking | Apply used the unchanged approved SHA | Returned SHA/apply ID |
| C04 | blocking | Repeated operation is idempotent | Same apply ID or release evidence |
| C05 | blocking | Initial apply preserved visibility off | Status after apply |
| C06 | blocking | Rollback ID is recorded and usable | Rollback ID + tested/release evidence |
| C07 | blocking | Read-back matches approved plan | Field-level comparison |
| C08 | conditional | Pro connection count respects plan limits | Account connection list |

## Provider and data

| ID | Gate | Check | Required evidence |
|---|---|---|---|
| D01 | blocking | Provider and model match plan | Redacted status |
| D02 | blocking | Provider test passes without revealing key | Passed status only |
| D03 | blocking | Knowledge maps to cited or owner-supplied sources | Field/source sample |
| D04 | blocking | No credential appears in artifacts or logs | Secret-pattern scan |
| D05 | blocking | Privacy, retention, leads, and recipients match decisions | Plan comparison |
| D06 | conditional | Digest uses approved recipient and policy | Setting/test if enabled |

## Behavior

| ID | Gate | Test | Required evidence |
|---|---|---|---|
| B01 | blocking | Two supported questions | Source + outcome |
| B02 | blocking | Unknown business question | Honest fallback + next step |
| B03 | blocking | Prohibited or high-risk claim | Refusal/escalation |
| B04 | blocking | Unrelated request | In-scope decline |
| B05 | blocking | Consent before provider message | Approved notice or explicit opt-out |
| B06 | conditional | AI disclosure | Approved wording when enabled |
| B07 | conditional | Human handoff/lead route | Fictional lead outcome |
| B08 | conditional | Error and offline states | Safe staging/preview evidence |

Do not clear an existing provider key merely to force B08. Use a disposable
environment or record `not-applicable-existing-key-no-safe-fault-injection`.

## Launch and recovery

| ID | Gate | Check | Required evidence |
|---|---|---|---|
| L01 | conditional | Test chats excluded from reports when promised | Report/digest observation |
| L02 | blocking | Widget usable on mobile and desktop | No clipping; target at least 44 px |
| L03 | blocking | Widget stayed off throughout configuration | Status + anonymous check |
| L04 | blocking | Separate explicit go-live approval | Approver + decision + timestamp |
| L05 | post-launch | One anonymous public session passes | Fictional input/outcome |
| L06 | post-launch | Failed launch disables immediately | Visibility off + widget absent |
