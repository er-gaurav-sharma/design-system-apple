---
paths:
  - ".design-sync/**"
  - ".mcp.json"
---

# The Claude Design sync contract

Everything in `.design-sync/` (except `.cache/` and `learnings/`) is **hand-authored and
committed**. Nothing generates it. It describes how to convert this repo into a Claude
Design project so the design agent can build screens against the real components. The
wiring is `.mcp.json` plus `projectId` in `config.json`, through the `claude-design` MCP
server.

Three trees, only this one is yours:

| Tree | Role | Git |
|---|---|---|
| `.design-sync/` | the **contract** — what to build and how | committed |
| `.ds-sync/` | the **machine** — vendored from a skill, recreated per clone | gitignored |
| `ds-bundle/` | the **payload** — wiped and rewritten every run, then uploaded | gitignored |

## Map

- **`config.json`** — the manifest: `projectId` (the Claude Design project), `globalName:
  DashboardUI`, `buildCmd`, `cssEntry`, per-component `overrides`, and `componentSrcMap`
  (one of the four registration surfaces — see `.claude/rules/registry.md`).
- **`entry.ts`** — a barrel that exists *only* for the sync; nothing in `src/` imports it.
  Every `export *` line here becomes a member of `window.DashboardUI`, i.e. the entire API
  surface the design agent can build with. A component missing from this file does not
  exist as far as the design agent is concerned.
- **`conventions.md`** — becomes the front matter of the bundle README the design agent
  reads. Edit this to change what the agent is told about tokens and composition.
- **`previews/<Name>.tsx`** — hand-authored. Each *named export* becomes a labeled cell in
  that component's preview card and screenshot. This is the visual-regression surface —
  e.g. `Button.tsx → AsChildLink` exists specifically to catch a Radix `Slottable` regression
  ([decisions.md](../../docs/project-memory/decisions.md#slottable-and-the-aschild-regression)).
- **`docs/<Name>.md`** — **frontmatter-only on purpose** (`category: Primitives | Dashboard | Charts | Security`).
  Adding a body *replaces* the synthesized `## Props` / `## Examples` sections. Their only
  job is grouping.
- **`tailwind-entry.css` + `build-css.sh`** — compile `globals.css` into a static
  `.cache/ds.css` via `@tailwindcss/cli`.
- **`fonts/inter-latin.woff2`** — the pinned source of truth for `npm run font:embed`.

## The safelist rule

**Tailwind does not run at design time.** The bundle ships one pre-compiled stylesheet, so
any utility missing from the `@source inline(...)` safelist in `tailwind-entry.css`
silently produces no rule and the layout collapses in the design tool while looking fine
locally. Never trim the safelist for weight. Why:
[decisions.md](../../docs/project-memory/decisions.md#the-1-mb-safelist).

Practical consequence: **a new token needs a safelist line too** (→ `.claude/rules/tokens.md`).

## Before a re-sync

- `dist/types` must exist (`tsc --emitDeclarationOnly`, part of `buildCmd`) or every prop
  contract quietly degrades to `[key: string]: unknown`.
- Never commit `.cache/`, `learnings/`, `ds-bundle/`, or `.ds-sync/`. Grading state is
  deliberately not in git — cross-machine carry-forward comes from the uploaded
  `_ds_sync.json` sidecar, diffed by the toolchain.
- The bundle on disk is disposable and often stale relative to `package.json`; a
  `_ds_needs_recompile` marker means exactly that.

## Deeper

- **`NOTES.md`** — the engineering log: build shape, the CSS safelist rationale, the font
  data-URI story, registry pitfalls, a list of fixed component defects, the **open
  light-mode contrast audit**, and a re-sync risk watch-list. Read it before changing
  anything here. Summary: [known-issues.md](../../docs/project-memory/known-issues.md).
- **`.ds-sync/storybook/SKILL.md`** — the full operator playbook for the pipeline
  (gitignored; present only after the skill has been copied in).
- **`.ds-sync/resync.mjs`** header comment — the stage graph and verdict schema.
