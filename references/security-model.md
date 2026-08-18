# Security model

## Trust boundaries

| Data | Human entry point | Agent may observe |
|---|---|---|
| WordPress account password | WordPress login page | No |
| WordPress Application Password | Local callback helper | Status only |
| AI-provider key | Write-only QuipBot settings UI | `has_key` and test status |
| Quip account credential | Quip login/consent page | Authorization status only |
| Quip scoped token | OS credential helper | Scope and expiry only |
| License key | Quip entitlement flow | Masked status only |

## Storage

- macOS: Keychain generic password item created by the released helper.
- Windows: Credential Manager item created by the released helper.
- Linux: unsupported until a documented OS-native backend is approved.
- Project artifacts: non-secret configuration and evidence only.

## Browser boundary

The skill may open the user's default browser for a documented login or consent
URL. It must not click, type, read the DOM, capture screenshots, attach to an
existing session, or extract cookies. The human completes the flow.

## WordPress boundary

- Core Application Password consent, not the normal password.
- Least WordPress capability compatible with the published Quip setup API.
- HTTPS only outside loopback development.
- Exact-origin validation before authorization and every API call.
- No XML-RPC, SSH, database, filesystem, or generic administrator automation.

## Logging and artifacts

- Remove query strings from authorization URLs before recording them.
- Record HTTP status and public error code, not response bodies that may contain
  credentials.
- Redact emails unless they are necessary for the approved configuration.
- Never include raw headers, cookies, reset links, secrets, or tokens.
