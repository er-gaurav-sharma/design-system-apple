---
paths:
  - "src/styles/**"
---

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
bundle, where Tailwind never runs — see `.claude/rules/design-sync.md`.

## Naming

Semantic, never scale-based: `--primary-hover`, `--success-subtle`, `--text-tertiary` —
never `--blue-500`. Interaction states are **separate tokens, not opacity tricks**.

**Renaming a token is breaking.** Prefer changing the value behind an existing name.

Categories: surfaces/text · action (`primary`/`secondary`/`destructive`/`accent`, each with
`-hover`/`-active`/`-foreground`) · boundaries (`border`, `input`, `ring`) · status
(`success`/`warning`/`error`/`info`, each with `-foreground` and `-subtle`) · `--overlay`
(modal scrim) and `--thumb` (Switch knob) · `--chart-1…6` · elevation · density
(`--row-height`, `--cell-pad-*`).

## Rules with a story behind them

Each of these has cost something already. Follow the rule; the `Why:` link has the incident.

- **`@import "./fonts/inter.css"` must stay the first rule**, above `@import "tailwindcss"`.
  (`globals.css:12`) Why:
  [decisions.md](../../docs/project-memory/decisions.md#the-font-import-that-vanished)
- **`fonts/inter.css` is generated — never hand-edit.** `npm run font:embed`; source of
  truth is `.design-sync/fonts/inter-latin.woff2`. Why it is a base64 data URI:
  [decisions.md](../../docs/project-memory/decisions.md#why-the-font-is-a-base64-data-uri)
- **Dark values are contrast-derived, not aesthetic** — don't "fix" them back to Apple's
  published hexes, and don't derive them by inverting light. (`globals.css:123`) Why:
  [decisions.md](../../docs/project-memory/decisions.md#dark-values-are-contrast-derived-not-aesthetic)
- **Don't pick `--chart-1…6` by eye** — they satisfy a ΔE2000 and contrast constraint that a
  nicer-looking swap will silently break. Why:
  [decisions.md](../../docs/project-memory/decisions.md#chart-colors-are-derived-not-picked)
- `@custom-variant dark` is declared for structural divergence only. **No component uses a
  `dark:` utility** — needing one usually means a missing token.

Open debt affecting this file (light-mode contrast audit, the `sonner` theme wart):
[known-issues.md](../../docs/project-memory/known-issues.md).
