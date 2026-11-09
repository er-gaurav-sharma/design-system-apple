# `@claude-design/dashboard-ui`

An Apple-inspired **shadcn/ui component registry** — not an application. `private: true`,
no JS build. Consumers install by copy-in; **`src/` is the only place you edit.**

**Stack** — React 18/19 peer · Tailwind **v4 CSS-first** (tokens in `src/styles/globals.css`,
no `tailwind.config`) · Radix · Lucide · shadcn `new-york`, `rsc: false`,
`cssVariables: true` · `@/*` → `./src/*`.

## Rules that apply in every session

- **Never hard-code color.** No hex, `rgb()`, or Tailwind palette class in
  `src/components/**` — there are currently zero. Add a token instead.
- **Never hand-edit generated files**, and don't read them as source — table in
  [generated-files.md](docs/project-memory/generated-files.md). `.claude/settings.json`
  blocks those reads on your own computer; Claude project threads don't load its permissions.
- **`src/` feeds two independent channels** (shadcn registry + Claude Design sync), so adding
  or renaming a component takes **four separate hand edits**. Miss one and the build stays
  green while it ships stale. `npm run registry:check` is the only guard — run before push.

## Commands

```bash
npm run typecheck        # tsc --noEmit — the only correctness gate on src/
npm run registry:check   # four-surface + pinned-URL + staleness guard. Run before push.
npm run registry:build   # version:sync + shadcn build → public/r/
npm run version:sync     # rewrite every pinned vX.Y.Z URL to match package.json
npm run font:embed       # .design-sync/fonts/inter-latin.woff2 → src/styles/fonts/inter.css
```

## Read before you change

The four rules in `.claude/rules/` are path-scoped. Claude Code on your own computer loads one
when it reads a matching file; Claude project threads don't load them. So open the rule
yourself first:

| What you change | Read first |
|---|---|
| `src/components/**` | `.claude/rules/components.md`, then `.claude/rules/registry.md` |
| `src/styles/**` | `.claude/rules/tokens.md` |
| `registry.json`, `scripts/**` | `.claude/rules/registry.md` |
| `.design-sync/**`, `.mcp.json` | `.claude/rules/design-sync.md`, plus `registry.md` for `config.json` or `entry.ts` |

## Where to look

Reference docs, read on demand: [architecture](docs/project-memory/architecture.md) ·
[release process](docs/project-memory/release-process.md) ·
[decisions](docs/project-memory/decisions.md) · [known issues](docs/project-memory/known-issues.md) ·
[generated files](docs/project-memory/generated-files.md) · `README.md` (consumer install) ·
`.design-sync/NOTES.md` (engineering log).
