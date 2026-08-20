# Installation, environment, and rollback

This is the cold-start safety contract for the human-guided release.

## Verified distribution only

An acceptable QuipBot package comes from one of these surfaces:

1. The WordPress **Plugins → Add New** directory result whose slug, publisher,
   and details identify the official QuipBot release.
2. A download surface on the official QuipBot product domain.
3. A release ZIP supplied directly through the owner's existing QuipBot/Norml
   delivery channel.

The agent must verify the hostname and product identity from public information
available at the time. Never substitute a third-party mirror, search-result
attachment, unofficial fork, or guessed GitHub URL. As of this skill release,
WordPress.org availability is not assumed.

If the owner has no verified package, stop with:

```yaml
installation: blocked-official-package
```

This is a complete and safe outcome; a missing distribution is not permission
to improvise.

## Human installation sequence

1. Human confirms a backup/reset checkpoint appropriate to the environment.
2. Human opens **Plugins → Add New**.
3. Human either installs the verified directory listing or uses **Upload
   Plugin** with the verified ZIP.
4. Human activates **QuipBot**.
5. Human reports the installed version and whether **QuipBot → Setup** opens.
6. Human confirms public visibility is off.

The v0.2.0 guide is verified against QuipBot 3.10.0, WordPress 6.2+, and PHP
7.4+. Treat these as compatibility floors, not a claim that every unrelated
plugin/theme combination is compatible.

If QuipBot is already installed but inactive, begin at activation step 4 after
confirming that the installed copy came from the owner's trusted installation.

## Environment decision

- Prefer staging when it represents production closely enough to test the
  provider, knowledge, consent, handoff, and widget.
- Production-direct setup is allowed only after explicit environment choice,
  a restorable backup, and approval of the non-secret plan.
- Never copy a production provider key into setup artifacts. The human enters a
  key separately in each environment.

## Baseline before change

Record the existing non-secret state in `configuration-plan.md`: installed
version, visibility, active provider/model, whether a key exists, enabled site
language, and which configuration areas are already populated. Do not ask for
raw keys, conversation data, or authenticated screenshots.

## Rollback and immediate disable

Use this order after any failed public behavior, privacy concern, or unexpected
output:

1. Human turns **Settings → Visibility → Make the bot live for visitors** off
   and saves.
2. Confirm the widget is absent for an anonymous visitor.
3. Restore the recorded pre-change non-secret values or restore the confirmed
   backup/reset checkpoint.
4. If QuipBot admin cannot be used, the human deactivates QuipBot from Installed
   Plugins, then confirms the widget is absent.
5. Record the failed check and rollback evidence. Do not retry go-live without
   a new verification pass and new approval.

Never delete conversations, leads, or plugin data as an improvised rollback.
