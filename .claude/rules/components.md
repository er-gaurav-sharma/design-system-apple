---
paths:
  - "src/components/**"
---

# Component conventions

Two layers, one direction. **`dashboard/` may import `ui/`; `ui/` must never import
`dashboard/`.**

- **`ui/`** (33 items, `registry:ui`) — primitives. Wrap Radix or a native element. Own no
  layout and no data fetching.
- **`dashboard/`** (24 items, `registry:block`) — opinionated compositions of `ui/`. They own
  layout, callbacks (`onSubmit`, `onCollapsedChange`), and data-state machines:
  `state?: "ready" | "loading" | "empty" | "error"` plus `onRetry`. Its docs stubs split it
  into three groups in the design tool: **Dashboard** (12), **Charts** (5) and **Security**
  (7). A `dashboard/` file may import another `dashboard/` file — the charts import
  `chart-legend` for its textures — and then lists it as a tag-pinned registry dependency.
- **Charts** draw with Recharts (only the four that need it; `chart-legend` is plain SVG),
  fill their parent's height, and take colours only from `--chart-*` and status tokens. They
  get their loading / empty / error states from the `ChartContainer` around them.
- **Security components** carry the dashboard's words, but every word and tooltip is a prop
  with a plain default, and none names an organisation, product or vendor. Device names and
  icons always come from the app.
- **`--text-tertiary` text sits only on `background`, `card` or `popover`.** On `muted` it is
  4.21:1, under AA; use `text-muted-foreground` there (table header rows, hover rows).

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
  `.claude/rules/tokens.md`.
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

Pick from the ladder; don't introduce a local value. Tooltip sits above dialog on purpose —
Why: [decisions.md](../../docs/project-memory/decisions.md#tooltip-outranks-dialog).

## `asChild`

Composition uses Radix `Slot`. When a component renders siblings alongside `children`,
**`<Slottable>` is mandatory** — without it `Slot` throws for *every* `asChild` usage,
including when the sibling is falsy, because `{false}` still occupies a child slot.
See `ui/button.tsx:57`, and
[decisions.md](../../docs/project-memory/decisions.md#slottable-and-the-aschild-regression)
for the preview that guards against regressing it.

## Style

Import order is uniform: `import * as React` → Radix / third-party → lucide icons →
`cn` from `@/lib/utils` → internal `@/components/ui/*`. JSDoc every exported component and
every non-obvious prop. Prefer plain lookup maps over cva for variant-ish behaviour in
`dashboard/` (see `trendConfig` in `dashboard/summary-card.tsx`).

## `dashboard/app-shell.tsx`

The only file here with real runtime architecture (`ShellContext` + `useShell()`,
`useSyncExternalStore`-based `useIsMobile()`, Radix `Dialog` reused as the mobile drawer).
Full write-up: [architecture.md](../../docs/project-memory/architecture.md#appshell-runtime-architecture).

The rule to hold in mind while editing it, per the comment at `app-shell.tsx:54`:
**`useIsMobile()` is for behaviour only, never layout.** Layout uses `hidden md:flex` /
`md:hidden` so it survives SSR and first paint.

> A new component file is not done until all **four registration surfaces** are updated.
> See `.claude/rules/registry.md`, then run `npm run registry:check`.
