# `@claude-design/dashboard-ui`

An Apple-inspired **shadcn/ui component registry** — not an application. `private: true`,
no JS build. Consumers install by copy-in; **`src/` is the only place you edit.**

**Stack** — React 18/19 peer · Tailwind **v4 CSS-first** (tokens in `src/styles/globals.css`,
no `tailwind.config`) · Radix · Lucide · shadcn `new-york`, `rsc: false`,
`cssVariables: true` · `@/*` → `./src/*`.

## Rules that apply in every session

- **Never hard-code color.** No hex, `rgb()`, or Tailwind palette class in
  `src/components/**` — there are currently zero. Add a token instead.
- **Never hand-edit generated files** — table in
  [generated-files.md](docs/project-memory/generated-files.md).
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

## Where to look

Path-scoped rules auto-load from `.claude/rules/` when you touch matching files —
`components.md`, `tokens.md`, `registry.md`, `design-sync.md`.

Reference docs, read on demand: [architecture](docs/project-memory/architecture.md) ·
[release process](docs/project-memory/release-process.md) ·
[decisions](docs/project-memory/decisions.md) · [known issues](docs/project-memory/known-issues.md) ·
[generated files](docs/project-memory/generated-files.md) · `README.md` (consumer install) ·
`.design-sync/NOTES.md` (engineering log).
