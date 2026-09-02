# This skill moved to MoonPress Chat Setup

`quip-setup` and this repository are retired. Quip Bot is now **MoonPress Chat**, and
the maintained public skill is **MoonPress Chat Setup**.

## Install the maintained skill

Claude Code:

```bash
npx skills@latest add normlstudio/moonpresschat-skill --skill=moonpresschat-setup -g -a claude-code
```

Codex:

```bash
npx skills@latest add normlstudio/moonpresschat-skill --skill=moonpresschat-setup -g -a codex
```

Gemini CLI:

```bash
npx skills@latest add normlstudio/moonpresschat-skill --skill=moonpresschat-setup -g -a gemini-cli
```

Then begin a new turn with only the public site URL:

```text
Use moonpresschat-setup to set up MoonPress Chat on https://example.com
```

## Current sources

- Product setup guide: [moonpresschat.com/setup](https://moonpresschat.com/setup/)
- Public skill repository: [normlstudio/moonpresschat-skill](https://github.com/normlstudio/moonpresschat-skill)
- Norml guide and ZIP: [MoonPress Chat Setup](https://norml.studio/skills/moonpress-chat-setup)

## Compatibility note

This repository remains available as read-only history. Existing `quip-setup/`
artifacts and the plugin's internal `quipbot` API namespace are compatibility-sensitive;
do not rename or migrate them automatically. Use the maintained skill for new setup work.
