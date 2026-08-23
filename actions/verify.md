# Action: verify setup and control go-live

## Readiness gate

1. Run the helper's `verify` command for assisted setup, or collect the guided
   non-secret confirmations.
2. Confirm the applied SHA and sections match the approved artifacts.
3. Confirm provider/model and provider-test status without exposing the key.
4. Confirm sourced business knowledge, consent, handoff, privacy, language,
   appearance, and prohibited claims.
5. Complete `qa/verification-checklist.md` with fictional inputs only.
6. Write `quip-setup/verification.md` with `pass`, `fail`, `blocked`, or
   `not-applicable`, plus evidence, tester, and timestamp.

Every readiness-blocking row except L04 must pass before asking for go-live.
`fail` or `blocked` keeps visibility off. Conditional rows become blocking when
the related feature or promise is enabled.

## Behavior checks

- Two supported questions map to approved sources.
- An unknown business question gets an honest fallback.
- A prohibited/high-risk claim is refused or escalated.
- An unrelated request is declined without answering it.
- Consent appears before the first external message when enabled.
- Disclosure, handoff, lead route, error/offline wording, and notifications
  match the approved decisions.
- Mobile and desktop previews do not clip or overlap.

Never use real visitor personal information in a test.

## Rollback on failure

If an assisted apply is wrong, run `rollback` before editing the next proposal.
If public behavior is already wrong, turn visibility off first, confirm the
widget is absent anonymously, then roll back or restore the recorded backup.

Do not troubleshoot a failed configuration while it remains public.

## Separate authorization gate

After readiness passes, ask:

> The reviewed configuration passes the readiness gate. Do you approve making
> Quip Bot live for visitors on `{site}` now?

Record the approver, exact decision, and timestamp as L04. Only an explicit yes
authorizes the helper's `go-live` command with the approved apply ID,
configuration SHA, a new operation ID, and `--confirm-go-live`.

The API re-runs blocking verification and refuses go-live if it is not ready.
After success, verify one anonymous public session. A failure triggers immediate
visibility-off and rollback.

## Credential cleanup

After completion or abandonment, run `revoke-wordpress`. Confirm connection
status is revoked without printing credential material. Do not disconnect the
Pro activation unless the owner explicitly asks.
