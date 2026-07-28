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
  The map lists the 24 *card-worthy* components — one per source file. Sub-parts
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
- Resulting groups: `primitives` (19) and `dashboard` (5).

## The built registry (`public/r/`) is generated

`registry.json` is a build *input* — its `files[].path` entries are repo-relative and
carry no content. `npm run registry:build` (`shadcn build`, v4) inlines each file and
writes the installable `public/r/*.json` that `npx shadcn add <url>` can consume at a
pinned tag. **`public/r/` is committed**, so it goes stale silently: rebuild and commit
it whenever `registry.json` or any registered source file changes. A component added to
`src/` therefore has *four* registration steps, not three — `entry.ts`,
`componentSrcMap`, `registry.json`, then the rebuild.

## Known component defects (found while authoring previews)

### FIXED — `asChild` on `Button` and `Badge`

Originally both threw `Slot failed to slot onto its children` for *every* `asChild`
usage: each rendered a conditional node before `children`
(`{loading && <Loader2/>}{children}`, `{dot && <span/>}{children}`), and since
`{false}` still occupies a child slot, Radix `Slot` always saw two children.

Fixed in `src/components/ui/{button,badge}.tsx` by wrapping `children` in Radix's
`<Slottable>`, which marks the node `asChild` should merge into — the canonical
shadcn pattern, and it keeps the spinner/dot rendering *inside* the slotted element.
`Slottable` is exported by `@radix-ui/react-slot` (v1.3.0 installed).

Verified in headless chromium: real `<a href>` elements, button/badge classes applied
to the anchor, zero pageerrors, and the combinations `asChild + loading` and
`asChild + dot` both render. The preview cards
(`previews/Button.tsx` → `AsChildLink`, `previews/Badge.tsx` → `AsChildLink`) exist
specifically to keep this from regressing silently — if the bug returns, those cells
fail the render check.

### FIXED — `LoginForm` hard-coded auth-error title

`login-form.tsx` rendered a literal `<AlertTitle>Incorrect email or password</AlertTitle>`
and demoted the `authError` prop to the description. Any other failure — locked account,
expired session, SSO required — was therefore mislabelled as a bad password, and the
common case (`authError="Incorrect email or password"`) rendered the same sentence twice.

Fixed by rendering `authError` verbatim as the headline, matching the prop's own JSDoc
example. Added an optional `authErrorDetail` prop for the supporting line, so the
two-slot Alert layout is still reachable without hard-coding copy.

Covered by two preview cells: `AuthError` (headline only) and `AuthErrorWithDetail`
("Your account is locked" + detail), the latter existing specifically to catch a
re-hard-coded title.

### FIXED — `AppShell` had no breakpoint at all

The sidebar was `collapsed ? "w-16" : "w-[230px]"` with no responsive utility anywhere
in the component, so on a 375px phone the rail permanently ate 230px (or 64px) of the
viewport. `PageHeader`'s `sm:flex-row` was the *only* responsive utility in the library.

Fixed in `src/components/dashboard/app-shell.tsx`: the `<aside>` is now `hidden md:flex`
and below `md` the sidebar renders as a Radix Dialog overlay drawer (`MobileSidebar`),
which supplies the focus trap, Escape, scrim dismissal and scroll lock. `aria-modal` is
set explicitly — Radix 1.1.20 hides the rest of the page with `aria-hidden` on siblings
and never emits it.

Two decisions worth not undoing:

- **Layout is CSS-driven, behaviour is JS-driven.** `useIsMobile()`
  (`useSyncExternalStore` over `matchMedia`) decides only what the header toggle does and
  whether nav items show labels. The rail/drawer split itself is pure CSS, so there is no
  first-paint flash and no hydration mismatch in the layout.
- **One toggle button, not two.** A second `md:hidden` copy would be invisible in a
  browser but would make consumers' existing `getByLabelText("Toggle navigation")`
  queries throw in jsdom, where no CSS applies.

`SidebarSection` / `SidebarNavItem` key their icon-only branch off `collapsed && !isMobile`
so the drawer never renders the desktop rail form. Preview cards render at a desktop
viewport (`overrides.AppShell.viewport` is `1240x780`) and the drawer is `fixed`, so the
mobile state **cannot** be captured as a preview cell — verify it in a real browser.

### FIXED — `LoginForm` hard-coded an email identity

Label, `type`, `autoComplete`, placeholder, the `errors` key and the `onSubmit` payload
were all `email`, so a username-authenticating API had to pass its username through as
"Email" — visibly mislabelled, and browsers autofilled email addresses into it.

Fixed with an opt-in `identifier?: "email" | "username"` (default `"email"`, so the
rendered output for existing call sites is byte-identical — verified by diffing
`renderToStaticMarkup` against the v1.1.0 tag). `onSubmit` emits the active value under
**both** `username` and the legacy `email` key; widening its parameter type is safe
because parameter contravariance keeps old `({ email, password }) => …` callbacks
assignable. Covered by the `UsernameIdentifier` and `CustomIdentifierWording` preview
cells.

### Open

- `--chart-2` (`#aeaeb2`) is 2.21:1 against `--card`, below WCAG 1.4.11's 3:1 for
  graphical objects. Left alone deliberately — changing it is a visual break for
  existing charts — but it is the weakest link in the six-colour series palette.

## Environment

- playwright is not a repo dependency, and the browser build in the container moves — the
  1226-in-`~/.cache/ms-playwright` setup this file used to describe is gone. As of the v1.2.0
  work it is chromium **1194** under `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`, with no
  global playwright package at all. Don't chase a matching playwright version and don't run
  `playwright install`: `npm i --no-save playwright-core` and launch with an explicit path —
  `chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })`.
  That sidesteps the `Executable doesn't exist` version-pin dance entirely.
- React is a peerDependency, so `npm install` alone cannot render anything.
  `npm i --no-save react react-dom esbuild` gets a browser harness building (bundle with
  `--alias:@=<root>/src` to resolve the `@/*` imports); `git checkout -- package-lock.json`
  afterwards keeps the lockfile clean. Diffing a `git worktree add … v1.1.0` build against
  HEAD in the same harness is how the "desktop is pixel-identical" claim was checked.

## Re-sync risks

- **`.design-sync/entry.ts` and `cfg.componentSrcMap` are hand-maintained lists.** A component
  added to `src/` appears in neither automatically and will be silently absent from the sync.
  Check both against `ls src/components/*/` on every re-sync. `registry.json` and the built
  `public/r/` are a third and fourth hand-maintained surface with the same failure mode.
- **Fonts are vendored, i.e. pinned.** `.design-sync/fonts/inter-latin.woff2` is a point-in-time
  copy of Google's Inter v20. It will not track upstream, and if `globals.css` ever changes
  `--font-sans`, the vendored file becomes wrong. Re-check `[FONT_MISSING]` warnings.
- **`dist/types/` is generated and gitignored.** A fresh clone must run `cfg.buildCmd` before
  the converter, or `.d.ts` contracts silently degrade to `[key: string]: unknown` — the build
  still exits 0, so this failure is quiet. Verify a spot-check `.d.ts` has real props.
- The Tailwind compile depends on the exact `tailwindcss` v4 minor in the lockfile; a major
  bump can change which utilities are emitted for the same source.
