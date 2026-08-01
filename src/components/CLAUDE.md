# Component conventions

Two layers, one direction. **`dashboard/` may import `ui/`; `ui/` must never import
`dashboard/`.**

- **`ui/`** (24 items, `registry:ui`) — primitives. Wrap Radix or a native element. Own no
  layout and no data fetching.
- **`dashboard/`** (5 items, `registry:block`) — opinionated compositions of `ui/`. They own
  layout, callbacks (`onSubmit`, `onCollapsedChange`), and data-state machines:
  `state?: "ready" | "loading" | "empty" | "error"` plus `onRetry`.

## Rules

- **`React.forwardRef` is the default**, including every part of a compound component.
  Only `badge`, `calendar`, `skeleton`, `sonner` opt out (no ref target worth exposing).
- **Always set `displayName`** — a plain string for native wrappers (`Table.displayName =
  "Table"`), or the primitive's for Radix wrappers (`SelectTrigger.displayName =
  SelectPrimitive.Trigger.displayName`). Identity comes from `displayName` here, so this
  is load-bearing, not cosmetic.
- **`cn()` wraps every `className`** (`src/lib/utils.ts` — `twMerge(clsx(...))`), with the
  incoming `className` **last** so callers can always override.
- **Reach for `cva` only when there is a real orthogonal variant matrix.** Only
  `button.tsx`, `badge.tsx`, `alert.tsx` qualify today. Everything else composes grouped
  `cn()` strings, one per concern — base / data-state / hover / focus-visible / disabled /
  aria-invalid. See `ui/select.tsx:17`. Export `xVariants` alongside the component.
- **No `data-slot` attributes.** This library declines that newer shadcn convention; don't
  introduce it ad hoc.
- **No `"use client"`** — `rsc: false`.
- **Semantic tokens only.** No hex, `rgb()`, or Tailwind palette class. The one sanctioned
  escape hatch is `var()` inside an arbitrary value, e.g.
  `shadow-[inset_0_0_0_1px_var(--border)]`. Adding a color means adding a token →
  `src/styles/CLAUDE.md`.
- **No `dark:` utilities.** Dark mode is handled entirely by token values; there are
  currently zero `dark:` usages and adding one usually means a missing token.
- **Fixed focus recipe**, repeated verbatim everywhere including ad-hoc buttons:
  `focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30`
- **State coverage contract**: every interactive component ships default / hover / focus /
  active / disabled. Data components (`SummaryCard`, `ChartContainer`, `Table`) additionally
  ship loading / empty / error.

## z-index ladder — not ad hoc

| Layer | Value |
|---|---|
| popover · dropdown · select content | `z-[1000]` |
| dialog · alert-dialog overlays | `z-[1200]` |
| dialog content · app-shell drawer | `z-[1300]` |
| tooltip content | `z-[1400]` |

Tooltip sits above dialog on purpose — a tooltip on a control inside a modal has to win.
Rationale in `ui/popover.tsx:23` and `ui/tooltip.tsx:28`.

## `asChild`

Composition uses Radix `Slot`. When a component renders siblings alongside `children`,
**`<Slottable>` is mandatory** — without it `Slot` throws for *every* `asChild` usage,
including when the sibling is falsy, because `{false}` still occupies a child slot.
See `ui/button.tsx:57`.

## Style

Import order is uniform: `import * as React` → Radix / third-party → lucide icons →
`cn` from `@/lib/utils` → internal `@/components/ui/*`. JSDoc every exported component and
every non-obvious prop. Prefer plain lookup maps over cva for variant-ish behaviour in
`dashboard/` (see `trendConfig` in `dashboard/summary-card.tsx`).

`dashboard/app-shell.tsx` is the only file with real runtime architecture — a `ShellContext`
+ `useShell()` guard hook, `useSyncExternalStore`-based `useIsMobile()`, and Radix `Dialog`
reused as the mobile drawer to inherit focus trap / Escape / scroll lock. Note the comment
at `app-shell.tsx:54`: `useIsMobile()` is for **behaviour only, never layout** — layout uses
`hidden md:flex` / `md:hidden` so it survives SSR and first paint.

> A new component file is not done until all **four registration surfaces** are updated.
> See the root `CLAUDE.md`, then run `npm run registry:check`.
