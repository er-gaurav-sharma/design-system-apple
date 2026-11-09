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
  The map lists the 57 *card-worthy* components (v1.4.0) — one per source file. Sub-parts
  (`CardHeader`, `DialogContent`, `SelectItem`, `DeviceIcon`, `ChartPattern`, …) are
  deliberately NOT pinned: they are all present in the bundle (146 exports on
  `window.DashboardUI` at v1.4.0) and are documented through the composition examples in
  each parent's `.prompt.md`, but they get no card of their own.

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

- **Fixed at the source in v1.3.0 — there is no longer a sync-only workaround.**
  `globals.css` used to pull Inter via a Google Fonts `@import url(...)` placed *below*
  `@import "tailwindcss"`. CSS requires `@import` to precede every other rule and **the
  Tailwind v4 compile drops any that doesn't**, so the compiled CSS referenced Inter while
  shipping no `@font-face` — every design, and every consuming app, silently rendered in a
  system fallback. The sync worked around it by vendoring Inter into `.design-sync/fonts/`
  and wiring `cfg.extraFonts`; the shipped library never got the fix, and downstream apps
  were patching it with a `<link>` tag in their own HTML.
- Now `globals.css` imports `src/styles/fonts/inter.css` **first**, and that file carries a
  real `@font-face` with the woff2 embedded as a **data URI**. The data URI is not
  gratuitous: `shadcn build` inlines registered files as UTF-8 text, so a binary `.woff2`
  cannot travel through the registry at all. Base64 is the only form that reaches BOTH
  install routes (copy `src/`, and `shadcn add theme`). Cost is ~64 KB of text in
  `theme.json`; the alternative is the font not arriving.
- **`src/styles/fonts/inter.css` is generated — never hand-edit it.** Source of truth is
  `.design-sync/fonts/inter-latin.woff2`; regenerate with `npm run font:embed`
  (`scripts/embed-font.mjs`). `cfg.extraFonts` now points at the generated CSS, so there is
  one font declaration in the repo instead of two that could drift.
- Google serves Inter as ONE variable woff2 for all weights — don't be fooled into
  downloading a file per weight, they're byte-identical.
- Quick regression check: `.design-sync/build-css.sh && grep -c @font-face .design-sync/.cache/ds.css`.
  Before the fix that was `0` while `--font-sans` still said `"Inter"`, which is exactly why
  it went unnoticed for three releases.

## Groups

- `.design-sync/docs/<Name>.md` are frontmatter-only **category stubs**, bound via `cfg.docsDir`.
  They exist only to label the DS pane groups. Without them every `src/components/ui/*`
  component lands in a group called `general` (the converter treats `ui/` and `components/` as
  generic directory names).
  Keeping them frontmatter-only is deliberate: a stub with a *body* becomes the whole
  `.prompt.md` and **suppresses the synthesized `## Props` / `## Examples` / `## Related`
  sections**, which are the most useful thing the design agent gets. Don't add prose here.
- Resulting groups at v1.4.0: `primitives` (33), `dashboard` (12), `charts` (5) and
  `security` (7). Charts and Security are split out of `src/components/dashboard/` by their
  stubs alone (`category: Charts`, `category: Security`); the files don't move.
- **Why a Security group.** Those seven carry one product's words (Perimeter Block,
  Correlated, Quiet…), which reads oddly beside generic blocks. They live here rather than in
  the app so a badge looks the same on every screen. Every word and tooltip is a prop with a
  plain default, and device names and icons come from the app, so no organisation, product
  or vendor name is built in.

## The built registry (`public/r/`) is generated

`registry.json` is a build *input* — its `files[].path` entries are repo-relative and
carry no content. `npm run registry:build` (`shadcn build`, v4) inlines each file and
writes the installable `public/r/*.json` that `npx shadcn add <url>` can consume at a
pinned tag. **`public/r/` is committed**, so it goes stale silently: rebuild and commit
it whenever `registry.json` or any registered source file changes. A component added to
`src/` therefore has *four* registration steps, not three — `entry.ts`,
`componentSrcMap`, `registry.json`, then the rebuild.

**`npm run registry:check` (`scripts/check-registry.mjs`) now verifies all four**, plus the
dependency rule below. Run it before pushing; it is the only thing standing between a
half-registered component and a silent downstream absence.

### `registryDependencies` must be URLs, never bare names

Found in v1.3.0, after it had already broken a consuming app. shadcn resolves a bare-name
`registryDependency` against **ui.shadcn.com**, not against the registry the item came
from — its docs are explicit: *"`button` means the built-in shadcn `button` item, not an
item from the same GitHub repository."* Every item here used bare names, so
`shadcn add login-form` (which depends on `field`) fetched **upstream's** `Field`, which has
no `FieldHelper`, and overwrote this system's. No warning, no version pinning, and the
breakage surfaces later as a missing export in the consumer's build.

Internal dependencies are therefore absolute, tag-pinned URLs into this repo's own
`public/r/`. That embeds a version string in dozens of places, so
`scripts/sync-version.mjs` rewrites them all from `package.json` (`registry:build` runs it
automatically) and `registry:check` fails on a stale pin. **Bump `version` in
`package.json` and touch nothing else.**

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

### FIXED — `asChild` on `SidebarNavItem`

The same defect, missed when `Button` and `Badge` were fixed above.
`app-shell.tsx` put `{icon}{!iconOnly && children}` into `Slot`, so every `asChild`
call site threw `Slot failed to slot onto its children` — with *or* without an
`icon`, since `{undefined}` occupies a child slot just as `{false}` does. No call-site
shape worked, while `conventions.md` and `README.md` both told consumers to use it for
a router `<Link>`.

The naive `<Slottable>{children}</Slottable>` would have traded the crash for something
worse in the collapsed rail: there `children` is the consumer's whole `<a>`, so
`!iconOnly && children` hands `Slot` no element to merge into and the item renders
**nothing at all** — silently, in one viewport state only. So the collapsed branch now
empties the label out of the consumer's element (`cloneElement(child, undefined, null)`)
instead of dropping the element. The `title` derivation was widened the same way — it
reads the label from inside the slotted child — so the icon-only rail keeps its tooltip
and, since `title` is the accname fallback, its accessible name.

Verified with `renderToStaticMarkup` over the four-row matrix (expanded / collapsed ×
`asChild` / plain, plus no-icon and `active`): all six render pre-fix-failing cases pass,
the four `asChild` rows throw on the parent commit, and the two plain rows are
byte-identical to v1.3.0 — existing call sites are untouched. Guarded by
`previews/AppShell.tsx` → `AsChildLinks` and `CollapsedAsChildLinks`, the two states
having distinct failure modes.

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

### FIXED — four hard-coded colours blocked dark mode

`.dark {}` was a commented-out scaffold through v1.2.0. Filling it in needed almost no
component work, because everything styles through semantic utilities — with exactly four
exceptions, which were the only non-token colours in `src/`: `bg-white` on the Switch
thumb, `bg-black/40` on the Dialog and AlertDialog scrims, and `text-white` on the solid
neutral Badge. Each would have stayed light under `.dark`. They are now `--thumb`,
`--overlay` and `text-background`.

The elevation scale needed a second change: `--shadow-xs…xl` live in `@theme inline`, whose
values are literal and which `.dark` cannot reach. They now indirect through
`--elevation-*` in `:root`, which `.dark` overrides with much denser alphas — a 4%-alpha
shadow is invisible against near-black, so without this every raised surface reads as flat.
Light values are unchanged from v1.2.0.

Adding `overlay` and `thumb` also meant a line in the colour safelist
(`tailwind-entry.css`), per the rule above.

### FIXED in v1.4.0 — light-mode contrast, seven token pairs

Auditing every pair the components actually combine (both themes) while adding dark mode
turned up seven light-mode shortfalls, all values unchanged since v1.0.0. They were left
alone until v1.4.0, where each moved just far enough to pass with its hue kept. Dark mode
already passed and did not change.

| Pair | Before | After | Needs | New light value |
|---|---|---|---|---|
| `--input` on `--background` | 1.51:1 | 3.06:1 | 3:1 (1.4.11) | `--input` `#939398` (also the Switch's off track) |
| `--chart-2` on `--card` | 2.21:1 | 3.06:1 | 3:1 (1.4.11) | `--chart-2` `#939398` |
| `--text-tertiary` on `--background` | 3.62:1 | 4.58:1 | 4.5:1 | `--text-tertiary` `#75757a` |
| `--success` on `--success-subtle` | 3.95:1 | 4.59:1 | 4.5:1 | `--success` `#137f33` |
| `--accent-foreground` on `--accent` | 4.12:1 | 4.56:1 | 4.5:1 | `--accent-foreground` `#0069db` |
| `--info` on `--info-subtle` | 4.12:1 | 4.56:1 | 4.5:1 | `--info` `#0069db` |
| `--success-foreground` on `--success` | 4.40:1 | 5.11:1 | 4.5:1 | (from the `--success` change) |

`--chart-2` moved, so the colour-vision check was rerun (Machado 2009 simulation, ΔE2000):
its nearest neighbour under any of the three dichromacies stays at 10.2 or more. The same
rerun puts the unchanged `--chart-3` / `--chart-4` pair at 8.94 under deuteranopia, a little
under the 9.0 that `decisions.md` quotes; that pair predates this release and was not
touched.

**A rule that came out of the audit: `--text-tertiary` text only on `--background`,
`--card` or `--popover`.** On `--muted` it is 4.21:1 in light and 4.27:1 in dark, so text on
a muted surface (a table's header row, a hovered row) uses `text-muted-foreground`
(4.66:1) instead. It is in `.claude/rules/components.md`.

### Open — four more findings from the v1.4.0 render audit

The v1.4.0 audit renders every preview in both themes and measures each text node and icon
against its real background, which the token-pair audit above can't see. It found four
failures outside the seven pairs:

| Where | Pair | Ratio |
|---|---|---|
| `AppShell` active nav item and avatar initials | `text-primary` on `bg-accent` | 4.12 light, 3.37 dark |
| `LoginForm` "Forgot?" link, `Calendar` today | `text-primary` on `--card`, dark | 3.69 |
| `Alert` description on error and info | `text-muted-foreground` on `--error-subtle` / `--info-subtle`, light | 4.32 / 4.45 |
| `Calendar` days outside the month | `opacity-60` on the day text | 2.26 light, 2.71 dark |

Two more are exempt and stay: the unsorted `TableSortButton` icon at `opacity-40` (a hint
beside a text label) and the label of a disabled control (WCAG exempts inactive UI).

Three dark values were *chosen* against this audit rather than copied from Apple, which is
worth knowing before anyone "corrects" them back:

- `--primary` is `#0a6bff`, not Apple's dark systemBlue `#0A84FF`. White on `#0A84FF` is
  3.65:1 — an AA failure on every primary button. `--ring`, `--chart-1` and `--info` keep
  the bright blue, since none of them carries text.
- `--primary-hover` / `--primary-active` darken, matching light mode. Brightening from
  `#0a6bff` drops back under 4.5:1.
- `--input` is systemGray2 `#636366`, not systemGray3 `#48484a`, which manages only 2.3:1
  against black.

Re-run the audit after any token change — it reads the compiled CSS, so it measures what
actually ships.

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
  `registry.json` and the built `public/r/` are a third and fourth hand-maintained surface
  with the same failure mode. `npm run registry:check` now checks all four against
  `src/components/*/` — run it instead of eyeballing an `ls`.
- **v1.4.0 added 28 components** — nine primitives, seven generic blocks, five charts and
  seven security components — and two runtime dependencies. `recharts` (^2.15.4) is listed in
  the registry only on the four charts that use it, and `qrcode` (^1.5.4) only on `QrCode`.
  The previews were checked on React 19.2 with the `react-is` 18.3.1 that recharts brings,
  and on React 18.3 in the mockups, with no override needed. The sync bundle now carries
  Recharts: a minified esbuild bundle of `entry.ts` (React external) is about 908 KB with it
  and 476 KB without it.
- **v1.3.0 added five components** — `Tabs`, `Tooltip`, `Popover`, `Calendar`, `DatePicker`
  (which exports both `DatePicker` and `DateRangePicker`). `Calendar` and `DatePicker` bring
  the first non-Radix runtime dependencies, `react-day-picker` and `date-fns`.
  `react-day-picker/style.css` is deliberately **not** imported: the grid is styled purely
  from tokens so it follows `.dark`, and importing their stylesheet would double-style it.
  Note where day state lives — react-day-picker puts every modifier class (`selected`,
  `range_start`, `today`, …) on the day's `<td>`, never on the button inside it, so modifier
  styling reaches the button via `[&>button]:`.
- **Fonts are vendored, i.e. pinned.** `.design-sync/fonts/inter-latin.woff2` is a point-in-time
  copy of Google's Inter v20. It will not track upstream, and if `globals.css` ever changes
  `--font-sans`, the vendored file becomes wrong. Re-check `[FONT_MISSING]` warnings, and
  re-run `npm run font:embed` after replacing the woff2.
- **`dist/types/` is generated and gitignored.** A fresh clone must run `cfg.buildCmd` before
  the converter, or `.d.ts` contracts silently degrade to `[key: string]: unknown` — the build
  still exits 0, so this failure is quiet. Verify a spot-check `.d.ts` has real props.
- The Tailwind compile depends on the exact `tailwindcss` v4 minor in the lockfile; a major
  bump can change which utilities are emitted for the same source.
