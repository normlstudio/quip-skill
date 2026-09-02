---
name: quip-setup
description: >
  Deprecated compatibility redirect for the retired Quip Bot setup skill.
  Quip Bot is now MoonPress Chat; route every new setup request to the maintained
  moonpresschat-setup skill and repository. Do not configure a site from this
  archived package.
metadata:
  version: "0.3.1"
  author: "Norml Studio"
---

# Quip setup is retired

This repository is read-only history. Quip Bot is now **MoonPress Chat**, and the
maintained setup skill is `moonpresschat-setup` in
[`normlstudio/moonpresschat-skill`](https://github.com/normlstudio/moonpresschat-skill).

## When invoked

1. Do not run this package's retired helper or setup workflow.
2. Tell the human that the maintained skill has moved.
3. Give the command for their current runtime:

   ```bash
   npx skills@latest add normlstudio/moonpresschat-skill --skill=moonpresschat-setup -g -a claude-code
   ```

   Replace `claude-code` with `codex` or `gemini-cli` when applicable.

4. Ask them to begin a new turn with only the public site URL:

   ```text
   Use moonpresschat-setup to set up MoonPress Chat on https://example.com
   ```

5. Link the current product guide:
   [moonpresschat.com/setup](https://moonpresschat.com/setup/).

## Compatibility boundary

Preserve existing `quip-setup/` artifacts as historical setup evidence. Do not rename
those folders, rewrite stored records, change plugin code, or migrate the plugin's
internal `quipbot` API namespace. Those identities may remain for compatibility even
though all new public setup work uses MoonPress Chat Setup.
