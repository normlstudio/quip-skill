# Action: connect WordPress and optional Quip Bot Pro

## Secure assisted WordPress connection

1. Run the helper's `self-test-keychain` command.
2. Run `connect-wordpress --site <canonical-url>`.
3. The helper starts a loopback callback on `127.0.0.1` and opens WordPress
   core's Application Password approval screen in the default browser.
4. The human logs in to WordPress and approves or rejects **Quip Bot setup**.
5. The helper validates state and the exact returned site, then stores the
   generated credential in macOS Keychain or Windows Credential Manager.
6. The helper calls only `/wp-json/iqb/v1/setup/status` and reports redacted
   identity, environment, versions, capabilities, and state.
7. Write those non-secret facts to `quip-setup/connection.md`.

The Application Password is also enforced server-side: attempts to use it
outside `/wp-json/iqb/v1/setup/*` fail. Never ask the human to paste the normal
password or generated Application Password into chat or the terminal.

Do not inspect, automate, screenshot, or attach to the browser. The human owns
all login and consent interaction.

## Optional Pro connection

Skip this section for the free core.

1. Confirm WordPress is already connected.
2. Run `connect-account --site <canonical-url>`.
3. The helper opens the fixed `https://quip.bot/account/` authorization page.
4. The human signs in and reviews the exact site, detected environment, and two
   scopes: entitlement read and one activation grant.
5. On approval, quip.bot returns a two-minute single-use authorization code to
   loopback. The helper exchanges it with PKCE S256.
6. The resulting token is stored in the OS credential store only long enough
   to request one five-minute activation grant.
7. The helper sends the grant to the connected WordPress setup endpoint. The
   plugin exchanges it server to server and stores an encrypted, site-bound
   activation token.
8. The helper deletes the short-lived quip.bot token in a `finally` path and
   reports only redacted entitlement status.

No raw license key is required in the assisted flow. Free core setup must not
be blocked by account login.

## Connection limits

- One production website per default Pro entitlement.
- Up to three active non-production connections across staging, development,
  and recognized local copies.
- Every URL receives its own installation ID and activation token.
- A database cloned to another URL mints a new installation ID.
- The owner may disconnect each copy from quip.bot or from WordPress.

## Guided fallback

Use `contracts/admin-guided-path.md` when the plugin/API is incompatible, the
native credential store is unavailable, or the operating system is unsupported.
Record:

```yaml
connection: guided-manual
automation: unavailable
reason: exact non-secret reason
```

Do not fall back to browser automation, a pasted credential, SSH, SQL, XML-RPC,
or the plugin's internal admin routes.

## Cleanup

At successful completion, abandonment, or a security error, run
`revoke-wordpress --site <canonical-url>`. It revokes the remote Application
Password and deletes the OS credential.

`disconnect-license` is separate and must run only when the owner explicitly
wants to disconnect that Pro activation.
