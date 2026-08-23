# Quip Bot configuration plan

## Status

- Environment:
- Installation:
- Plugin version:
- Compatibility: `assisted | guided | blocked`
- Backup/reset checkpoint:
- Rollback owner/action:
- Connection: `assisted | guided-manual`
- WordPress authorization: `connected | not-required-guided | revoked`
- Plan: `free-core | pro`
- Pro activation: `not-required | connected | blocked | disconnected`
- Provider test: `pending | passed | failed`
- Configuration: `planned | validated | approved | applied | verified | rolled-back`
- Configuration SHA-256:
- Apply ID:
- Rollback ID:
- Proposed by:
- Approved by:
- Go-live: `off | approved | live`

## Current non-secret baseline

- Visibility:
- Active provider/model:
- Provider key saved: `yes | no | unknown` (never record the key)
- Enabled site language:
- Knowledge field count:
- Knowledge area count:
- Question count:
- Last applied configuration:

## Field-level proposed configuration

Add one row for every applicable field in
`contracts/configuration-fields.md`. Do not combine controls.

| Field | Current non-secret state | Proposed value/action | Source | Approval | Environment | Data classification | Verification | Rollback |
|---|---|---|---|---|---|---|---|---|
| Provider / ID | | | Owner answer | Pending | | No | Read-back | Snapshot |
| Provider / model | | | Owner answer | Pending | | No | Provider test | Snapshot |
| Provider / key | Saved/not saved only | Human enters in secure local form | Owner action | Pending | | Secret — never record | Configured + test status | Human clear/restore |
| Knowledge / business facts | | | Research + owner | Pending | | Review | Supported-question tests | Snapshot |
| Knowledge / Q&A bank | | | Research + owner | Pending | | Review | Supported-question tests | Snapshot |
| Settings / consent | | | Owner/legal answer | Pending | | Legal decision | Consent gate | Snapshot |
| Settings / disclaimer | | | Owner/legal answer | Pending | | Legal decision | Answer disclosure | Snapshot |
| Visibility | Off | Keep off until separate approval | Launch gate | Pending | | No | Anonymous check | Turn off |

## Validation and approval

- Validation status:
- Sections:
- Warnings:
- Errors:
- Configuration SHA-256:
- Exact proposal shown to owner:
- Apply approval statement and timestamp:
- Go-live approval statement and timestamp:

## Blockers

-
