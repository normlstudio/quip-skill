# Action: preflight and install Quip Bot

Complete this gate before public research or any WordPress configuration.

## Opening questions

Ask for and record:

1. Canonical public WordPress URL.
2. Explicit confirmation that the user owns the site or may manage it.
3. The local workspace. Create or reuse `quip-setup/` there.
4. Staging or production. If both exist, configure and verify staging first.
5. Free core only, or an existing Quip Bot Pro entitlement.

Do not treat possession of a login as proof of authority. Never request an
authenticated screenshot.

## Automated compatibility check

Run the helper's non-destructive command:

```bash
node /resolved/skill/path/scripts/quip-setup.mjs preflight --site https://example.com
```

Accept secure assisted setup only when all of these are true:

- exact canonical site URL returned;
- plugin name is `Quip Bot`;
- plugin version is 3.12.0 or newer;
- setup API and schema version are `1.0`;
- WordPress reports the expected fixed setup endpoints and application ID;
- operating system is macOS or Windows;
- HTTPS is used, except for a recognized local development hostname.

The public compatibility response contains no persistent installation ID or
credential. WordPress returns the installation ID only after browser approval.

If secure assisted setup is unavailable, record why and use the guided path.

## Human inventory fallback

Ask the human to report only:

- whether Quip Bot is installed and active;
- displayed plugin version;
- WordPress and PHP versions from Site Health;
- whether **Quip Bot → Setup** opens;
- whether public visibility is off.

Use these status values:

- older than Quip Bot 3.12.0 for automation:
  `compatibility: guided-plugin-upgrade-required`;
- WordPress older than 6.2 or PHP older than 7.4:
  `compatibility: blocked-runtime`;
- labels materially differ from the field map:
  `compatibility: blocked-guide-drift`;
- Linux or unavailable native credential store:
  `connection: guided-manual`.

## Installation

If Quip Bot is absent, follow `contracts/installation-and-rollback.md`. The
human installs only a verified official distribution. The agent never invents
a package URL, uploads an arbitrary ZIP, or operates wp-admin.

If installed but inactive, the human activates the trusted copy. Do not
continue to configuration while inactive.

## Change-safety checkpoint

- Staging/local: record how the environment can be reset or restored.
- Production: require a restorable backup made before this setup. Record type,
  operator, and timestamp, never a link or credential.
- Record the immediate-disable action: turn public visibility off. If the Quip
  Bot admin UI is unavailable, deactivate the plugin.

Write `quip-setup/preflight.md` from `templates/preflight.md`. Do not continue
unless authority, workspace, environment, active installation, compatibility,
recovery, rollback, and off visibility are explicit.
