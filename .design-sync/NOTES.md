# design-sync notes — @claude-design/dashboard-ui

Repo-specific gotchas for future syncs. Read this before re-running the sync.

## Build shape

- **No `dist/` and no `build` script.** The repo is a shadcn-style *drop-in* library
  (consumers copy `src/`), so nothing is compiled by default. `cfg.buildCmd` therefore
  does two things the converter needs:
  1. `tsc --declaration --emitDeclarationOnly --outDir dist/types` — emits the real
     `.d.ts` tree. **This matters a lot**: without it the extractor finds no types and
     every emitted `<Name>Props` degrades to `[key: string]: unknown`, which is a
     useless contract for the design agent. `findTypesRoot` auto-discovers `dist/types`,
     so no `package.json` change is required.
  2. `.design-sync/build-css.sh` — compiles the Tailwind v4 source (see below).
- **`.design-sync/entry.ts` is the bundle entry** (passed as `--entry`). The package ships
  no barrel of its own, and `node_modules/@claude-design/dashboard-ui` doesn't exist
  (npm won't self-install), which makes the converter's package-dir lookup fail outright.
  **Adding a component to `src/components/**` means adding its `export *` line to this file**,
  or it will be missing from `window.DashboardUI`.
- **Component discovery is fully pinned** via `cfg.componentSrcMap`. Discovery normally
  reads PascalCase exports out of a shipped `.d.ts` tree; there is none at the package root,
  so without the pins the build reports `[ZERO_MATCH] tokens-only DS` and emits 0 components.
  The map lists the 23 *card-worthy* components — one per source file. Sub-parts
  (`CardHeader`, `DialogContent`, `SelectItem`, …) are deliberately NOT pinned: they are all
  present in the bundle (94 exports on `window.DashboardUI`) and are documented through the
  composition examples in each parent's `.prompt.md`, but they get no card of their own.

## CSS / Tailwind v4

- `src/styles/globals.css` is Tailwind **source**, not a stylesheet — it starts with
  `@import "tailwindcss"`. Pointing `cfg.cssEntry` at it directly would ship an unresolvable
  import. `.design-sync/tailwind-entry.css` + `build-css.sh` compile it to
  `.design-sync/.cache/ds.css`, which is what `cfg.cssEntry` points at.
- **Re-run `build-css.sh` before every `package-build.mjs` run.** The Tailwind scan includes
  `.design-sync/previews/**/*.tsx`, so utility classes used only in preview layout glue are
  purged unless the CSS is recompiled after previews change. Symptom: cards render with
  correct components but broken spacing/grid.

### The safelist is load-bearing — do not "optimize" it away

`.design-sync/tailwind-entry.css` carries a large `@source inline(...)` safelist that
inflates the shipped CSS from ~48 KB to ~1 MB. That is deliberate and it is the single
most important correctness decision in this sync.

**Why:** Tailwind does NOT run when the Claude Design agent builds a screen. Designs
consume `styles.css` exactly as compiled here. A purely content-scanned build emits only
the classes *this repo* happens to use, so the agent writing perfectly ordinary
`grid-cols-4 gap-8 text-3xl mt-8` would get **no rules at all** and the layout would
silently collapse — with nothing downstream to catch it. Verified before the fix: 22 of
28 common layout/typography utilities were absent from the compiled CSS.

Consequences to keep in mind:
- **Arbitrary values can never work** (`p-[13px]`, `text-[#ff0000]`) — they can't be
  safelisted, since the set is infinite. `conventions.md` tells the design agent to stay
  on the scale and use `style={{…}}` for one-offs. Keep that guidance in sync.
- If a utility family is reported missing in a design, add it to the safelist and
  rebuild — don't tell the user to use arbitrary values.
- The safelist enumerates the DS's own token names for color utilities. **Adding a token
  to `globals.css` means adding it to the color safelist line too**, or the agent can
  name the token but not use it.

## Fonts

- `globals.css` pulls Inter via a Google Fonts `@import url(...)`. **The Tailwind v4 compile
  drops that remote import**, so the compiled CSS referenced Inter while shipping no
  `@font-face` — every design would have silently rendered in a system fallback.
  Fixed by vendoring Inter (latin subset, variable weight axis) into `.design-sync/fonts/`
  and wiring it through `cfg.extraFonts`. Google serves Inter as ONE variable woff2 for all
  weights — don't be fooled into downloading a file per weight, they're byte-identical.

## Groups

- `.design-sync/docs/<Name>.md` are frontmatter-only **category stubs**, bound via `cfg.docsDir`.
  They exist only to label the DS pane groups. Without them every `src/components/ui/*`
  component lands in a group called `general` (the converter treats `ui/` and `components/` as
  generic directory names).
  Keeping them frontmatter-only is deliberate: a stub with a *body* becomes the whole
  `.prompt.md` and **suppresses the synthesized `## Props` / `## Examples` / `## Related`
  sections**, which are the most useful thing the design agent gets. Don't add prose here.
- Resulting groups: `primitives` (18) and `dashboard` (5).

## Known component defects (found while authoring previews)

- **`Button` `asChild` is broken.** Button renders `{loading && <Loader2/>}{children}`, which
  hands Radix `Slot` two children, so *any* `asChild` usage throws
  `Slot failed to slot onto its children`. `asChild?: boolean` is nevertheless part of the
  public `ButtonProps`, so the design agent will reach for it and crash.
  `.design-sync/previews/Button.tsx` deliberately has no `asChild` cell.
  Upstream fix would be to render the spinner only when `!asChild`, or to wrap `children`
  in Radix's `<Slottable>`. Re-add the preview cell once fixed.
- **`Badge` `asChild` is broken the same way** — it renders `{dot && <span/>}{children}`.
  Same root cause, same fix. `.design-sync/previews/Badge.tsx` has no `asChild` cell.
- **`LoginForm` hard-codes its auth-error title.** Line ~72 renders a literal
  `<AlertTitle>Incorrect email or password</AlertTitle>` and only pipes the `authError`
  prop into `AlertDescription`. So `authError="Your account is locked"` still shows the
  title "Incorrect email or password" — actively misleading. The prop's own JSDoc says it
  is the top-level auth error, so the title should come from it (or be a separate prop).
  The preview passes description-shaped copy so the card is coherent; the defect stands.

## Environment

- playwright is not a repo dependency. The container has a global
  `/usr/lib/node_modules/@playwright/cli/node_modules/{playwright,playwright-core}` pinning
  chromium build **1226**, which matches `~/.cache/ms-playwright/chromium-1226`. Symlink both
  into `.ds-sync/node_modules/` rather than installing a fresh playwright (a version mismatch
  fails with `Executable doesn't exist`). The *headless shell* (`chromium_headless_shell-1226`)
  is a separate download — `node .ds-sync/node_modules/playwright-core/cli.js install
  chromium-headless-shell` — and is what `chromium.launch()` actually uses.

## Re-sync risks

- **`.design-sync/entry.ts` and `cfg.componentSrcMap` are hand-maintained lists.** A component
  added to `src/` appears in neither automatically and will be silently absent from the sync.
  Check both against `ls src/components/*/` on every re-sync.
- **Fonts are vendored, i.e. pinned.** `.design-sync/fonts/inter-latin.woff2` is a point-in-time
  copy of Google's Inter v20. It will not track upstream, and if `globals.css` ever changes
  `--font-sans`, the vendored file becomes wrong. Re-check `[FONT_MISSING]` warnings.
- **`dist/types/` is generated and gitignored.** A fresh clone must run `cfg.buildCmd` before
  the converter, or `.d.ts` contracts silently degrade to `[key: string]: unknown` — the build
  still exits 0, so this failure is quiet. Verify a spot-check `.d.ts` has real props.
- The Tailwind compile depends on the exact `tailwindcss` v4 minor in the lockfile; a major
  bump can change which utilities are emitted for the same source.
