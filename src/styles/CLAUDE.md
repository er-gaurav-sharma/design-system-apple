# Token model

`globals.css` has three layers, and which one a value belongs in is not a style choice:

| Layer | Holds |
|---|---|
| `:root` | The light values. **The only place literal colors exist in this repo.** |
| `.dark` | The *same token names* with dark values. Opt in via `<html class="dark">`. |
| `@theme inline` | The Tailwind v4 bridge — `--color-<name>: var(--<name>)`, turning each token into `bg-*` / `text-*` / `border-*` utilities. |

**`@theme inline` values are literal**, so `.dark` cannot reach them. Anything that must
differ per mode lives in `:root`/`.dark` and is only *referenced* here. That is why
elevation (`--elevation-xs…xl`) is defined in `:root`/`.dark` and merely aliased to
`--shadow-*` in the bridge. Literal-only things — radius, easing, font stacks — sit in the
bridge directly.

## Adding a token = four places

1. a value in `:root`
2. a value in `.dark`
3. an entry in `@theme inline`
4. **a line in the color safelist in `.design-sync/tailwind-entry.css`**

Skip (4) and the utility works in-app but silently produces no rule in the design-time
bundle, where Tailwind never runs — see `.design-sync/CLAUDE.md`.

## Naming

Semantic, never scale-based: `--primary-hover`, `--success-subtle`, `--text-tertiary` —
never `--blue-500`. Interaction states are **separate tokens, not opacity tricks**.

**Renaming a token is breaking.** Prefer changing the value behind an existing name.

Categories: surfaces/text · action (`primary`/`secondary`/`destructive`/`accent`, each with
`-hover`/`-active`/`-foreground`) · boundaries (`border`, `input`, `ring`) · status
(`success`/`warning`/`error`/`info`, each with `-foreground` and `-subtle`) · `--overlay`
(modal scrim) and `--thumb` (Switch knob) · `--chart-1…6` · elevation · density
(`--row-height`, `--cell-pad-*`).

## Rules with a war story behind them

- **`@import "./fonts/inter.css"` must stay the first rule**, above `@import "tailwindcss"`.
  CSS requires `@import` to precede every other rule and Tailwind v4's optimizer *silently
  drops* any that doesn't. This previously shipped a build naming Inter in `--font-sans`
  with no `@font-face` at all, and every consumer rendered in system-ui with nothing to
  indicate it. (`globals.css:12`)
- **`fonts/inter.css` is generated — never hand-edit.** `npm run font:embed`; source of
  truth is `.design-sync/fonts/inter-latin.woff2`. It is a base64 data URI because
  `shadcn build` inlines registered files as UTF-8 text, so a binary `.woff2` cannot travel
  through the registry.
- **Dark values are contrast-derived, not aesthetic** — don't "fix" them back to Apple's
  published hexes. Apple's dark systemBlue `#0A84FF` gives white only 3.65:1, an AA failure
  on every primary button, so `--primary` is deepened to `#0a6bff` while the bright blue is
  kept where contrast isn't text (`--ring`, `--chart-1`, `--info`). (`globals.css:123`)
- Dark is **not an inversion** of light: surfaces get *lighter* with elevation (`--card`
  `#1c1c1e` sits above `--background` `#000`), and shadows are far denser.
- **`--chart-1…6` carry a constraint**: minimum ΔE2000 9.0 across normal vision and three
  dichromacies, and ≥3:1 against `--card`. Don't pick chart colors by eye.
- `@custom-variant dark` is declared for structural divergence only. **No component uses a
  `dark:` utility** — needing one usually means a missing token.

## Known wart

`ui/sonner.tsx` hard-codes `theme="light"` on the Sonner `<Toaster>`. Its classNames are
token-mapped so it still follows `.dark` visually, but the prop is not wired to the class.
