# Generated files

**Never hand-edit anything in this table.** Each is reproduced from a source of truth; an
edit is silently reverted the next time its command runs.

| Path | Git | Regenerate with |
|---|---|---|
| `public/r/*.json` | **committed** | `npm run registry:build` |
| `src/styles/fonts/inter.css` | **committed** | `npm run font:embed` |
| `ds-bundle/**`, `dist/**`, `.design-sync/.cache/` | gitignored | the re-sync — see `.claude/rules/design-sync.md` |

The first two being *committed* is the trap: they look like ordinary source files in a diff,
and a plausible-looking hand edit to `public/r/` will survive review and then vanish at the
next `registry:build`.

These paths are blocked from reads in `.claude/settings.json` (`permissions.deny`) precisely
so they are not treated as source. The commands above are how you change them.

## `src/styles/fonts/inter.css`

Source of truth is `.design-sync/fonts/inter-latin.woff2`, pinned in the repo. `npm run
font:embed` converts it into a base64 data URI inside a generated CSS file. It is base64
rather than a linked `.woff2` for a non-obvious reason — see
[decisions.md](decisions.md#why-the-font-is-a-base64-data-uri).

## `public/r/*.json`

Compiled from `registry.json` by `shadcn build`, with every pinned version URL rewritten by
`version:sync` first. Regenerating and committing these is step 2–3 of
[release-process.md](release-process.md).
