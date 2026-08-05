---
paths:
  - "registry.json"
  - "public/r/**"
  - "scripts/**"
  - "src/components/**"
  - ".design-sync/config.json"
  - ".design-sync/entry.ts"
---

# The registry — and the four-surface rule

## The four-surface rule — the sharpest gotcha in this repo

Adding or renaming a component in `src/components/**` requires **four separate hand edits**.
Miss one and the build stays green while the failure surfaces later, silently:

1. `export * from "../src/components/…"` in `.design-sync/entry.ts` — defines `window.DashboardUI`
2. an entry in `componentSrcMap` in `.design-sync/config.json`
3. an item in `registry.json` (with tag-pinned `registryDependencies`)
4. a rebuilt `public/r/` — `npm run registry:build`

Surfaces 1–2 belong to the Claude Design sync channel and 3–4 to the shadcn registry
channel; the two share nothing but `src/`, which is why neither notices the other going
stale. See [architecture.md](../../docs/project-memory/architecture.md).

`npm run registry:check` is the **only** guard on all four. Run it before you push.
See `scripts/check-registry.mjs` for the invariants stated formally.

## `registryDependencies` must be tag-pinned absolute URLs

Never bare names. A bare name resolves against **ui.shadcn.com**, not against this registry,
and silently overwrites this system's component on the consumer's disk at install time.
Why (this already shipped a bug):
[decisions.md](../../docs/project-memory/decisions.md#bare-names-resolve-against-upstream).

Bare names are acceptable **only** for genuine upstream shadcn items.

`npm run version:sync` rewrites every pinned `vX.Y.Z` URL to match `package.json` — so bump
the version in `package.json` and let the tool propagate it. Full sequence:
[release-process.md](../../docs/project-memory/release-process.md).

## `public/r/*.json` is generated but committed

Compiled from `registry.json` by `shadcn build`. Never hand-edit it — a plausible-looking
edit survives review and then vanishes at the next `registry:build`. See
[generated-files.md](../../docs/project-memory/generated-files.md).
