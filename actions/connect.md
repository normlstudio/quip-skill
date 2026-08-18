# Action: connect WordPress safely

## Intended flow

1. Validate the canonical WordPress origin and HTTPS.
2. Start the released local callback helper on a loopback-only address.
3. Open WordPress core's Application Password authorization screen in the
   system browser.
4. The human signs in and approves or rejects access.
5. The callback helper stores the generated credential directly in macOS
   Keychain or Windows Credential Manager.
6. Make a non-destructive identity and capability request.
7. Record only connection status, site origin, user display name, and granted
   capabilities.

## Version 0.1.0 boundary

The public callback/helper is not shipped yet. Do not ask the user to paste the
generated Application Password into the terminal or chat. Do not fall back to a
normal WordPress password, browser automation, SSH, or database access.

Set the configuration-plan connection status to:

```yaml
connection: blocked-public-helper
```

Then continue preparing the no-write configuration plan.

## Future Quip authorization

The free core requires no Quip account. A future device-authorization flow may
be added only for paid entitlements or managed services. It must use a browser
consent step and return a scoped token to the OS credential store without
exposing it to the agent.
