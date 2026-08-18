# Action: verify setup

## Plan verification in 0.1.0

1. Ensure every required configuration section has a value, an explicit
   decision, or a visible blocker.
2. Confirm every business fact is sourced.
3. Confirm provider choice is recorded without a key.
4. Confirm consent, handoff, and prohibited-claim decisions are explicit.
5. Confirm the free-core language scope is represented accurately.
6. Confirm connection and WordPress writes remain blocked rather than simulated.
7. Write `quip-setup/verification.md` from the QA checklist.

## Runtime verification after the public API ships

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
