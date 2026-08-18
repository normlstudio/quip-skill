# QuipBot configuration plan

## Status

- Environment:
- Connection: `blocked-public-helper`
- Public API: `blocked-stable-contract`
- Proposed by:
- Approved by:
- Go-live: `off`

## Proposed configuration

| Area | Proposed value/action | Source | Approval | Verification |
|---|---|---|---|---|
| Provider/model | | Owner answer | Pending | Provider status only |
| Knowledge | | Research + owner | Pending | Read-back after API ships |
| Consent/disclosure | | Owner answer | Pending | Test-chat gate |
| Handoff | | Owner answer | Pending | Test destination |
| Lead capture | | Owner answer | Pending | Test destination |
| Boundaries | | Owner answer | Pending | Refusal tests |
| Error/offline text | | Owner answer/default | Pending | Offline test |
| Widget appearance | | Owner answer/default | Pending | Preview |
| Site language | | Owner answer | Pending | Public test |

## Provider-key action

The human enters the key directly in the write-only QuipBot settings UI. The
agent may later confirm only provider, model, `has_key`, and test status.

## Proposed write sequence

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

- Public OS-native connection helper.
- Stable public Quip setup API.
-
