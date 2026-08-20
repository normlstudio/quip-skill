# Changelog

## 0.2.0 — 2026-08-20

- Added the working human-guided wp-admin path so the skill can complete setup
  before the public automation API and credential helper ship.
- Added verified installation instructions using the open `npx skills` CLI.
- Mapped the current QuipBot admin sequence across provider testing, Setup,
  Knowledge base, Templates, privacy, preview, and separate go-live approval.
- Kept authenticated browser control and secret handling human-owned while
  distinguishing guided setup from blocked direct automation.
- Reconciled the free-forever core, direct provider billing, and separate Quip
  Pro license boundary from the Aug 19 product meeting.
- Closed the independent cold-start forward-test gaps: explicit opening gate,
  official-package installation path, version/runtime checks, staging vs.
  production decision, backup and rollback, a field-level 3.10.0 map, classified
  verification gates, and owner-supplied research provenance.
- Split readiness from go-live authorization, added the inactive-plugin route,
  normalized unresolved preflight states, expanded owner privacy/operations
  decisions, and made error/offline verification preserve write-only keys.

## 0.1.0 — 2026-08-17

- Added the five-stage Research → Questions → Connect → Configure → Verify
  workflow from the Quip product discussion.
- Added public-site research, owner-answer, configuration-plan, and verification
  artifacts.
- Locked the security model: browser consent is human-operated, provider keys
  remain write-only in WordPress, and credentials never enter the AI transcript.
- Marked WordPress writes honestly blocked until the stable public Quip setup API
  and OS-native connection helper are released.
- Kept the free QuipBot setup independent from a Quip account or paid license.
