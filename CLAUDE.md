# @claude-design/dashboard-ui

An Apple-inspired **shadcn/ui component registry** — not an application. `private: true`,
no JS build (`tsc --noEmit` only). Consumers install components by copy-in.

- Tailwind **v4, CSS-first** — no `tailwind.config`; tokens live in `src/styles/globals.css`
- React 18/19 peer dep · Radix primitives · Lucide icons · `@/*` → `./src/*`
- shadcn style `new-york`, `rsc: false`, `cssVariables: true` (`components.json`)

## Architecture

One source of truth (`src/`) feeds two unrelated distribution channels:

```
                        src/**  ← the only place you edit
                          │
      ┌───────────────────┴────────────────────┐
      │                                        │
  registry.json                        .design-sync/   (contract, committed)
      │ shadcn build                           │ .ds-sync/   (machine, gitignored)
      ▼                                        ▼ ds-bundle/  (payload, gitignored)
  public/r/*.json  (generated, COMMITTED)   Claude Design project
      │                                        │  via the `claude-design` MCP server
      ▼                                        ▼  (.mcp.json + projectId in
  npx shadcn add <tag-pinned raw URL>       design agent builds screens   config.json)
```

The two channels share nothing but `src/`. A change to a component must be pushed down
**both**, or one side silently ships stale code.

## The four-surface rule — the sharpest gotcha here

Adding or renaming a component in `src/components/**` requires **four separate hand
edits**. Miss one and the build stays green while the failure surfaces later, silently:

1. `export * from "../src/components/…"` in `.design-sync/entry.ts` — defines `window.DashboardUI`
2. an entry in `componentSrcMap` in `.design-sync/config.json`
3. an item in `registry.json` (with tag-pinned `registryDependencies`)
4. a rebuilt `public/r/` — `npm run registry:build`

`npm run registry:check` is the **only** guard on all four. Run it before you push.
See `scripts/check-registry.mjs` for the invariants stated formally.

## Non-negotiables

- **Never hard-code color.** No hex, `rgb()`, or Tailwind palette class (`bg-gray-500`)
  anywhere in `src/components/**` — there are currently zero. Add a token instead.
- **`registryDependencies` must be tag-pinned absolute URLs**, never bare names. shadcn
  resolves a bare name against **ui.shadcn.com**, not this registry. This already shipped a
  bug: `login-form` depending on `"field"` made `shadcn add` fetch upstream's `Field`
  (which has no `FieldHelper`) and overwrite this system's, breaking consumers at install
  time. Bare names are acceptable only for genuine upstream shadcn items.
- **Generated files are never hand-edited** (below).
- **Renaming a token is breaking** — change the value behind an existing name instead.

## Generated — do not edit

| Path | Regenerate with |
|---|---|
| `public/r/*.json` (committed) | `npm run registry:build` |
| `src/styles/fonts/inter.css` (committed) | `npm run font:embed` |
| `ds-bundle/**`, `dist/**`, `.design-sync/.cache/` (gitignored) | the re-sync — see `.design-sync/CLAUDE.md` |

These are blocked from reads in `.claude/settings.json`; the commands above are how you
change them.

## Commands

```bash
npm run typecheck        # tsc --noEmit — the only correctness gate on src/
npm run registry:check   # four-surface + pinned-URL + staleness guard. Run before push.
npm run registry:build   # version:sync + shadcn build → public/r/
npm run version:sync     # rewrite every pinned vX.Y.Z URL to match package.json
npm run font:embed       # .design-sync/fonts/inter-latin.woff2 → src/styles/fonts/inter.css
```

**Release order:** bump `version` in `package.json` **and nothing else** →
`npm run registry:build` (runs `version:sync` for you) → commit `public/r/` →
`npm run registry:check` → push → tag `vX.Y.Z`. The tag in the pinned URLs *is* the
versioning mechanism.

## Where to look next

Local conventions load automatically as you work in these directories:

- **`src/components/CLAUDE.md`** — component authoring rules (forwardRef, `cn()`, cva, z-index)
- **`src/styles/CLAUDE.md`** — the token model and how to add one
- **`.design-sync/CLAUDE.md`** — the Claude Design sync contract

Deeper prior art, not duplicated above:

- **`README.md`** — consumer install, dark mode, dates, responsive `AppShell`, usage sketch
- **`.design-sync/NOTES.md`** — engineering log: fixed defects, open light-mode contrast
  audit, re-sync risks. Read before changing anything in the sync path.
- **`.ds-sync/storybook/SKILL.md`** — the full sync playbook (gitignored; present only
  after the skill has been copied in)

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
