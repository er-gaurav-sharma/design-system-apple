# Decisions and war stories

Why the non-obvious rules exist. Each heading is linked from the rule it justifies in
`.claude/rules/`. Every entry here is a decision already paid for — several were paid for by
shipping a bug.

## Bare names resolve against upstream

**Rule it backs:** `registryDependencies` must be tag-pinned absolute URLs, never bare names
(`.claude/rules/registry.md`).

shadcn resolves a bare dependency name against **ui.shadcn.com**, not against this registry.
This already shipped a bug: `login-form` declared a dependency on `"field"`, so `shadcn add`
fetched **upstream's** `Field` — which has no `FieldHelper` — and overwrote this system's
`Field` on the consumer's disk. The break happened at *install* time, in the consumer's
repo, with nothing wrong in this one.

Bare names are acceptable only for genuine upstream shadcn items, where fetching upstream is
the intent.

## The font `@import` that vanished

**Rule it backs:** `@import "./fonts/inter.css"` must stay the first rule in `globals.css`,
above `@import "tailwindcss"` (`.claude/rules/tokens.md`, `globals.css:12`).

CSS requires `@import` to precede every other rule, and Tailwind v4's optimizer **silently
drops** any `@import` that doesn't. This shipped a build that named Inter in `--font-sans`
with no `@font-face` anywhere in the output. Every consumer rendered in system-ui, and
nothing — not the build, not the types, not a visual diff of the token values — indicated
anything was wrong.

## Why the font is a base64 data URI

**Rule it backs:** `src/styles/fonts/inter.css` is generated; never hand-edit
(`.claude/rules/tokens.md`, [generated-files.md](generated-files.md)).

`shadcn build` inlines every registered file as **UTF-8 text**. A binary `.woff2` cannot
survive that trip through the registry, so the font is embedded as a base64 data URI inside a
generated CSS file instead. `npm run font:embed` performs the conversion from the pinned
`.design-sync/fonts/inter-latin.woff2`.

## Dark values are contrast-derived, not aesthetic

**Rule it backs:** don't "fix" dark tokens back to Apple's published hexes
(`.claude/rules/tokens.md`, `globals.css:123`).

Apple's dark systemBlue `#0A84FF` gives white only **3.65:1** — an AA failure on every
primary button. So `--primary` is deepened to `#0a6bff`, while the bright blue is kept
exactly where contrast isn't text: `--ring`, `--chart-1`, `--info`.

Dark is also **not an inversion** of light. Surfaces get *lighter* with elevation — `--card`
`#1c1c1e` sits above `--background` `#000` — and shadows are far denser than their light
counterparts. Reasoning from "invert the light palette" produces wrong values in both
directions.

## Chart colors are derived, not picked

**Rule it backs:** don't choose `--chart-1…6` by eye (`.claude/rules/tokens.md`).

The six chart colors satisfy a minimum **ΔE2000 of 9.0** pairwise across normal vision and
three dichromacies (protanopia, deuteranopia, tritanopia), and **≥3:1** against `--card`.
A visually pleasing replacement will almost always violate one of those without looking any
different to the person choosing it.

## The ~1 MB safelist

**Rule it backs:** every utility must appear in the `@source inline(...)` safelist in
`.design-sync/tailwind-entry.css` (`.claude/rules/design-sync.md`).

**Tailwind does not run at design time.** The bundle ships one pre-compiled stylesheet, so a
utility missing from the safelist produces no rule at all — the layout collapses in the
design tool while looking perfect locally. Erring toward over-inclusion is why the compiled
CSS is roughly 1 MB, and accepting that size is **the single most important correctness
decision in the sync**. Do not trim the safelist for weight.

Practical consequence: adding a token means adding a safelist line too.

## Tooltip outranks dialog

**Rule it backs:** the z-index ladder (`.claude/rules/components.md`; rationale in
`ui/popover.tsx:23` and `ui/tooltip.tsx:28`).

Tooltip content sits at `z-[1400]`, above dialog content at `z-[1300]`, which looks inverted
until you consider the case that forces it: a tooltip attached to a control **inside** a
modal has to win, or it renders behind the thing it describes. The ladder is fixed and
global — pick from it rather than introducing a local value.

## `Slottable` and the `asChild` regression

**Rule it backs:** `<Slottable>` is mandatory when a component renders siblings alongside
`children` (`.claude/rules/components.md`, `ui/button.tsx:57`).

Radix `Slot` throws when it receives more than one child. Without `<Slottable>`, that happens
for *every* `asChild` usage of a component that renders siblings — **including when the
sibling is falsy**, because `{false}` still occupies a child slot. So the bug does not appear
until someone uses `asChild` on the one variant that has an icon, which is easy to miss in
review.

The guard against regressing it lives in the sync: `.design-sync/previews/Button.tsx` exports
a named preview called `AsChildLink` for exactly this reason. Each named export becomes a
labeled cell in the preview card and screenshot, so a reintroduced `Slot` throw shows up as a
visual diff. Don't delete that export.

## Recharts for the charts, and only in the charts

**Rule it backs:** charts draw with Recharts; `chart-legend` is plain SVG
(`.claude/rules/components.md`).

v1.4.0's four data charts (waterfall, stacked bars, stepped history, event lanes) need axes,
tooltips, reference lines and range bars that are a lot of code to hand-roll and test. The
mockups were built and tested on Recharts 2.15.4, so the shipped components use the same.
It is listed as a dependency only on those four registry items, so an app that installs
anything else never pulls it in, and `ChartContainer` stays library-agnostic.

## Textures as well as colours

**Rule it backs:** a series can be textured (`hatch` or `lines`); `ChartLegend` exports both
as SVG patterns.

A stacked chart with four series leans on hue to tell them apart, which fails in print and
for some colour-blind readers. Two textures give a second cue: `hatch` keeps the series' hue
with stripes over a tint, and `lines` reads as a quiet remainder. They are fixed in one file
so every chart and legend draws them the same.

## Security components live here, with their words as props

**Rule it backs:** security components carry no organisation, product or vendor names
(`.claude/rules/components.md`).

Badges such as a recommendation or a source's health appear on many screens of the app that
uses them, and drift when each screen styles its own. Keeping them here gives one look per
state. The repository is public and other apps may use it, so the words are props with
plain defaults, device names and icons come from the app, and a scoring change needs no
library release.

## The QR tokens don't change in dark mode

**Rule it backs:** `--qr-paper` and `--qr-ink` have the same values in `:root` and `.dark`
(the comment above them in `globals.css`).

Some authenticator apps can't read a light-on-dark QR code, so `QrCode` always draws dark
modules on a light square, with its own quiet zone. They are tokens rather than literal
colours so the no-hex rule holds and the intent is named.
