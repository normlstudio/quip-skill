# QuipBot configuration plan

## Status

- Environment:
- Installation: `active | inactive | absent | blocked-official-package | unresolved`
- Plugin version:
- Compatibility: `passed | blocked-plugin-upgrade | blocked-runtime | blocked-guide-drift`
- Backup/reset checkpoint: `confirmed | unresolved | blocked`
- Rollback owner/action:
- Connection: `guided-manual`
- Automation: `blocked-public-helper-and-api`
- Public API: `blocked-stable-contract`
- Provider test: `pending`
- Configuration: `planned`
- Proposed by:
- Approved by:
- Go-live: `off`

## Current non-secret baseline

- Visibility:
- Active provider/model:
- Provider key saved: `yes | no | unknown` (never record the key)
- Enabled site language:
- Populated configuration areas:

## Field-level proposed configuration

Add one row for every applicable field in
`references/configuration-fields.md`. Do not combine multiple controls into one
row.

| Screen / field | Current non-secret state | Proposed value/action | Source | Approval | Environment | Personal/regulated data | Verification | Rollback |
|---|---|---|---|---|---|---|---|---|
| AI providers / Active provider | | | Owner answer | Pending | | No | Human confirmation | Restore prior selection |
| AI providers / Model | | | Owner answer | Pending | | No | Provider test | Restore prior model |
| AI providers / Provider key | Saved/not saved only | Human enters directly | Owner action | Pending | | Secret — never record | Test passed status | Human restores/clears key |
| Knowledge base / Business facts | | | Research + owner | Pending | | Review | Supported-question tests | Restore baseline/backup |
| Knowledge base / FAQ bank | | | Research + owner | Pending | | Review | Supported-question tests | Restore baseline/backup |
| Knowledge base / Hard rules | | | Owner answer + safety floor | Pending | | No | Refusal tests | Restore baseline/backup |
| Settings / Consent notice | | | Owner/legal answer | Pending | | Legal decision | Consent gate test | Restore baseline |
| Settings / Short disclaimer | | | Owner/legal answer | Pending | | Legal decision | Answer disclosure test | Restore baseline |
| Settings / Visibility | Off | Keep off until approval | Launch gate | Pending | | No | Anonymous public check | Turn off immediately |

## Provider-key action

The human enters the key directly in the write-only QuipBot settings UI. The
agent may later confirm only provider, model, `has_key`, and test status.

## Guided apply sequence

1. Approve this non-secret plan.
2. Human connects and tests the provider in QuipBot Settings.
3. Human applies a reviewed preset or site-analysis draft.
4. Human reviews Knowledge base, Templates, legal text, contacts, notifications,
   retention, appearance, and language.
5. Human keeps visibility off and runs the preview verification.
6. Receive separate go-live approval.
7. Human enables visibility and verifies one public session.

## Future automated write sequence

1. Connect through the released helper.
2. Read current setup state.
3. Show a redacted field-level diff.
4. Receive explicit production-write approval.
5. Write disabled/draft configuration.
6. Read back and verify.
7. Run test chat and handoff checks.
8. Receive separate go-live approval.
9. Enable the public widget and verify one public session.

## Blockers

- Installation/compatibility:
- Backup/reset or rollback:
- Direct automation: public OS-native connection helper.
- Direct automation: stable public Quip setup API.
-
