# Action: connect WordPress safely

## Guided flow available now

1. Validate the canonical WordPress origin and HTTPS.
2. Confirm the user is already signed in to an authorized WordPress account in
   their own browser.
3. Record `connection: guided-manual` and
   `automation: blocked-public-helper-and-api` in the configuration plan.
4. Follow `contracts/admin-guided-path.md` after the plan is approved.
5. The human performs every authenticated action and reports only non-secret
   state such as provider name, model, test passed/failed, and saved/not saved.

Do not ask to see the browser, inspect the DOM, take over the session, receive a
screenshot of authenticated wp-admin, or collect a credential in chat.

## Future automated flow

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

## Version 0.2.1 automation boundary

The public callback/helper is not shipped yet. Do not ask the user to paste the
generated Application Password into the terminal or chat. Do not fall back to a
normal WordPress password, browser automation, SSH, or database access.

Set the automated-connection status to:

```yaml
automation: blocked-public-helper-and-api
```

Continue through the guided human-operated path. The missing helper blocks only
direct agent writes, not the setup itself.

## Future Quip Bot authorization

The free core requires no quip.bot account. A future device-authorization flow may
be added only for paid entitlements or managed services. It must use a browser
consent step and return a scoped token to the OS credential store without
exposing it to the agent.
