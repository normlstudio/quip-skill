# QuipBot setup verification checklist

Use `pass`, `fail`, `blocked`, or `not-applicable` for each item. For each row,
record `status`, `evidence`, `tested_by`, and `tested_at`. A blocking row may be
`not-applicable` only when the reason is explicit and the corresponding feature
is not enabled or promised.

## Release rule

- `blocking`: must pass before go-live.
- `conditional`: becomes blocking when the feature is enabled or promised.
- `post-launch`: run immediately after go-live; failure triggers visibility off
  and rollback before troubleshooting.

Run the pre-launch gate in two phases: all readiness-blocking rows except L04,
then request approval and pass L04. Visibility may be enabled only after both
phases pass.

## Authority, installation, and connection

| ID | Gate | Check | Required evidence |
|---|---|---|---|
| A01 | blocking | Site ownership/management authority confirmed | Named owner/approver confirmation |
| A02 | blocking | Canonical HTTPS origin and target environment confirmed | Origin + staging/production |
| A03 | blocking | QuipBot active and compatible | Plugin/WP/PHP versions + Setup opens |
| A04 | blocking | Backup/reset and rollback paths confirmed | Human confirmation + operator/timestamp |
| A05 | blocking | Public visibility is off during setup | Human confirmation or anonymous observation |
| A06 | blocking | Guided wp-admin remained human-operated; no authenticated screenshot or secret shared | Artifact/transcript review |
| A07 | conditional | Automated credential stayed outside transcript; least capability and public API version supported | Only after automation exists |

## Provider and data

| ID | Gate | Check | Required evidence |
|---|---|---|---|
| D01 | blocking | Provider and model match approved plan | Human-confirmed provider/model |
| D02 | blocking | Provider test passes without revealing key | Passed status only |
| D03 | blocking | Knowledge facts map to cited or owner-supplied sources | Field-to-source sample + unresolved list empty |
| D04 | blocking | No credential appears in artifacts or logs | Secret-pattern scan + human confirmation |
| D05 | blocking | Retention, browser memory, lead fields, and recipients match privacy decision | Field-level plan comparison |
| D06 | conditional | Daily transcript notification matches approved recipient and policy | Human-confirmed test/setting if enabled |

## Behavior test matrix

Use prepared fictional inputs only; never use real visitor personal data.

| ID | Gate | Test | Minimum evidence |
|---|---|---|---|
| B01 | blocking | Two common supported questions | Expected source + answer outcome for each |
| B02 | blocking | One unknown-business question | Honest unknown + approved next step |
| B03 | blocking | One prohibited/high-risk claim | Refusal or human escalation, no partial fulfillment |
| B04 | blocking | One unrelated request | In-scope decline without answering it |
| B05 | blocking | Consent before first external message | Exact approved notice observed; `not-applicable` only with an explicit recorded owner/legal decision to disable the consent gate |
| B06 | conditional | AI disclosure/disclaimer | Approved wording observed when enabled/promised |
| B07 | conditional | Human handoff/lead route | Fictional lead reaches approved destination if enabled |
| B08 | conditional | Service error and assistant-offline states | Service error: human uses browser offline mode in preview, without changing WordPress; assistant-offline: test before the first key is saved or on a disposable staging copy. For an existing write-only key with no disposable copy, inspect the configured copy and record `not-applicable-existing-key-no-safe-fault-injection`; never clear or overwrite the key merely to force this state. |

## Launch and recovery

| ID | Gate | Check | Required evidence |
|---|---|---|---|
| L01 | conditional | Test conversations excluded from reporting where promised | Report/digest observation if promised |
| L02 | blocking | Widget usable on mobile and desktop | No clipping; launcher target at least 44px |
| L03 | blocking | Public widget stayed off during configuration | Human confirmation or anonymous check |
| L04 | blocking | Explicit go-live approval recorded separately | Exact approver + decision + timestamp |
| L05 | post-launch | One anonymous public session passes | Fictional input/outcome, no personal data stored |
| L06 | post-launch | Failed launch can be disabled immediately | If L05 fails: visibility off + widget absent |
