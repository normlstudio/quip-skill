# Action: verify setup

## Plan verification

1. Ensure every required configuration section has a value, an explicit
   decision, or a visible blocker.
2. Confirm every business fact is sourced.
3. Confirm provider choice is recorded without a key.
4. Confirm consent, handoff, and prohibited-claim decisions are explicit.
5. Confirm the free-core language scope is represented accurately.
6. Confirm automated writes remain blocked rather than simulated.
7. Write `quip-setup/verification.md` from the QA checklist.

Verification has two pre-launch gates:

1. **Readiness gate:** every blocking row except L04 must be `pass` or a
   justified `not-applicable` before requesting go-live approval.
2. **Authorization gate:** request the decision separately. L04 must become
   `pass` before the human enables visibility.

`fail` or `blocked` keeps visibility off. Conditional items become blocking
when the corresponding feature or promise is enabled.

## Guided runtime verification in 0.2.0

- The human confirms the selected provider/model and a successful **Test
  connection** result without exposing the key.
- The human confirms the reviewed preset or site-analysis draft was applied.
- The human opens the plugin preview link while public visibility remains off.
- Run the supported-question, refusal, consent, fallback, and handoff checks in
  `qa/verification-checklist.md`. Record evidence without visitor personal data.
- Test mobile and desktop rendering through human observation or a public,
  non-authenticated preview that the owner explicitly supplied.
- Ask for separate go-live approval only after the readiness gate passes; record
  L04 as passed before the human enables visibility.
- After approval and human activation, verify one real public session.

If the post-launch session fails, instruct the human to turn visibility off
first, confirm the widget is absent anonymously, and follow
`references/installation-and-rollback.md`. Do not troubleshoot while the failed
configuration remains public.

Mark anything that cannot be observed or confirmed `blocked`; never upgrade a
human instruction into a passed check.

## Direct runtime verification after the public API ships

- Connection identity and capabilities are correct.
- Provider status reports a tested key without returning the key.
- Knowledge and settings match the approved artifacts.
- Test chat answers supported questions and refuses unsupported claims.
- Consent appears before visitor content is sent to the provider.
- Human handoff and lead routing reach the intended destination.
- Error and offline states are understandable.
- Public widget remains off until the user explicitly approves go-live.
- After go-live, verify one real public session without recording secrets or
  visitor personal data.
