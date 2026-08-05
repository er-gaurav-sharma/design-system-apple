# Release process

**The git tag in the pinned URLs *is* the versioning mechanism.** There is no npm publish —
`package.json` is `private: true`. A consumer's install URL points at a raw file at a tag, so
a release is complete only when the tag exists and the pinned URLs inside the committed
`public/r/*.json` match it.

## Order — do not reorder

1. Bump `version` in `package.json` **and nothing else**. Do not hand-edit any pinned URL;
   step 2 rewrites them all.
2. `npm run registry:build` — runs `version:sync` for you, then `shadcn build` → `public/r/`.
3. Commit `public/r/` (it is generated but committed).
4. `npm run registry:check`.
5. Push.
6. Tag `vX.Y.Z`.

Skipping step 6, or tagging a different string than the one in `package.json`, produces
install URLs that 404 for every consumer while everything looks correct locally.

## The commands behind it

| Command | What it does |
|---|---|
| `npm run typecheck` | `tsc --noEmit` — the only correctness gate on `src/`. There is no JS build. |
| `npm run registry:check` | Four-surface + pinned-URL + staleness guard. Run before every push. |
| `npm run registry:build` | `version:sync` + `shadcn build` → `public/r/` |
| `npm run version:sync` | Rewrites every pinned `vX.Y.Z` URL to match `package.json` |
| `npm run font:embed` | `.design-sync/fonts/inter-latin.woff2` → `src/styles/fonts/inter.css` |

`version:sync` is why step 1 says *and nothing else*: it is the tool's job to propagate the
version, and a hand-edited URL it does not recognise will be silently overwritten or missed.

See also [generated-files.md](generated-files.md) for what each build step writes.
