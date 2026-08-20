# Action: preflight and install QuipBot

Complete this gate before public research or any WordPress configuration.

## Opening questions

Ask for and record these four items first:

1. The canonical public WordPress URL.
2. An explicit statement that the user owns the site or is authorized to manage
   it and approve the intended changes.
3. A writable local working directory. Create or reuse `quip-setup/` there.
4. Whether the target is staging or production. If both exist, configure and
   verify staging first.

Do not treat possession of an administrator login as proof of authority. Do not
pick an artifact directory without the user's confirmation unless the current
project directory is clearly the requested workspace; state the chosen path.

## Installation inventory

Ask the human to open **WordPress → Plugins → Installed Plugins** and report
only:

- whether **QuipBot** is installed;
- whether it is active;
- its displayed version;
- the WordPress and PHP versions from **Tools → Site Health → Info**.

Version 0.2.0 of this skill is verified against QuipBot 3.10.0. The documented
runtime floor is WordPress 6.2 and PHP 7.4.

- QuipBot older than 3.10.0: `compatibility: blocked-plugin-upgrade`.
- WordPress older than 6.2 or PHP older than 7.4:
  `compatibility: blocked-runtime`.
- A newer QuipBot whose labels materially differ from the field map: stop the
  affected section and record `compatibility: blocked-guide-drift`.

Never request an authenticated screenshot.

## Human installation path

If QuipBot is absent, follow `references/installation-and-rollback.md`. The
human installs and activates the plugin from a verified official distribution.
The agent does not upload the ZIP, operate wp-admin, or invent a download URL.

If QuipBot is installed but inactive, the human activates the already-verified
installation from **Installed Plugins**. Record `installation: inactive` until
activation succeeds; do not continue to research/configuration while inactive.

After activation, the human confirms that the **QuipBot** menu and **Setup** page
open. Record status, not authenticated page contents.

## Change-safety checkpoint

- Staging: record how the environment can be reset or restored.
- Production: require confirmation of a restorable site backup made before this
  setup. Record backup type, operator, and timestamp, never a download link or
  credential.
- Record the immediate-disable action: turn
  **Settings → Visibility → Make the bot live for visitors** off. If the admin
  UI itself is unavailable, the human may deactivate QuipBot from Installed
  Plugins.

Write `quip-setup/preflight.md` from `templates/preflight.md`, using these
status values:

```yaml
authority: confirmed | unresolved | blocked
artifact_folder: /absolute/non-secret/path/quip-setup
environment: staging | production | unresolved
canonical_origin: https://example.com
installation: active | inactive | absent | blocked-official-package | unresolved
plugin_version: 3.10.0 | unknown
wordpress_version: value | unknown
php_version: value | unknown
compatibility: passed | unresolved | blocked-plugin-upgrade | blocked-runtime | blocked-guide-drift
backup_or_reset: confirmed | unresolved | blocked
rollback: confirmed | unresolved | blocked
visibility: off | on | unknown
```

Do not continue unless authority, artifact folder, environment, active
installation, compatibility, backup/reset path, rollback, and off visibility
are explicit and passed/confirmed. Visibility `unknown` is allowed only before
the plugin is installed; confirm it is off immediately after activation.
