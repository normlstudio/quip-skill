# Action: prepare, validate, and apply configuration

## Prepare the reviewed plan

Create `quip-setup/configuration-plan.md` from research and owner answers. For
every field record current non-secret state, proposed value, source, approval,
environment, data classification, verification, and rollback.

Use `contracts/configuration-fields.md`. Cover provider/model, business facts,
knowledge areas and Q&A, templates, consent, disclosure, handoff, lead routing,
privacy, notifications, fallback wording, appearance, language, and visibility.

## Compile the machine artifact

Create `quip-setup/configuration.json` from `templates/configuration.json`.

- Use schema version `1.0`.
- Include only the sections and fields that the owner approved.
- Omit unresolved fields; do not invent defaults.
- Never include a provider key, WordPress credential, license key, token,
  personal visitor record, or arbitrary WordPress option.
- Markdown research is evidence. Convert approved facts into the specific JSON
  fields; never upload a Markdown file as an opaque blob.

## Validate without writing

Run:

```bash
node /resolved/skill/path/scripts/quip-setup.mjs validate \
  --site https://example.com \
  --file /approved/workspace/quip-setup/configuration.json
```

Validation is read-only. It rejects unknown schema keys and invalid values and
returns a summary, warnings, errors, and `configuration_sha256`.

Show the owner:

- exact proposed non-secret values or a clear field-level diff;
- target site and environment;
- validation warnings;
- configuration SHA-256;
- rollback path;
- confirmation that visibility remains unchanged.

## Provider key

If the approved provider has no key, run the helper's `provider` command with
only provider and model identifiers. The human enters the key in the local
loopback password form. The key is sent write-only to WordPress and never
printed or stored in setup artifacts.

Run `provider-test` and record only pass/fail plus provider/model.

## Explicit write approval

Ask immediately before apply:

> Do you approve applying configuration SHA-256 `{sha}` to `{site}` while
> keeping the public Quip Bot widget off?

Only an explicit yes authorizes `apply`. Generate a new non-secret operation ID
and run `apply` with the unchanged file and approved SHA.

The helper revalidates the file. The plugin snapshots setup-owned options,
applies only the closed schema, records a redacted audit event, and returns
`apply_id` and `rollback_id`. Reusing the same operation ID with the same SHA is
idempotent; reusing it for different content is rejected.

Never combine initial apply with go-live.

## Read back and rollback

Run `status` and `verify`. Compare the returned non-secret state with the plan.
If anything differs or the owner withdraws approval, run `rollback` with the
returned rollback ID. Record the result in the plan and verification report.

## Guided fallback

When secure assisted setup is unavailable, use
`contracts/admin-guided-path.md`. The human performs every authenticated save
and reports only non-secret status. Never call internal `iqb/v1/admin` routes.
