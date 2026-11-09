# Dashboard UI — how to build with this design system

Apple-inspired component library for internal dashboards. React + Radix primitives,
styled with **Tailwind v4** utilities that resolve to design tokens. Light and dark —
same token names in both, so nothing you write needs a `dark:` variant.

## Setup — there is no provider

**Do not wrap anything in a provider.** This system has no ThemeProvider, no context
root: tokens are plain CSS custom properties on `:root`, so a component is styled the
moment `styles.css` is loaded. Dark mode is a `dark` class on a root element, not a
provider. The globals you may need: `<Toaster />` (once, near the root) if you call
`toast()`, and `<TooltipProvider>` if you use `Tooltip` — or `CopyButton`, `RelativeTime`,
the compact `StepList`, or `RankList`, `CorrelationBadge` and `IpLabels` with tooltips,
which all use it.

```jsx
<>
  <AppShell brand={<AppShellBrand>Acme</AppShellBrand>} sidebar={<SidebarNav>…</SidebarNav>}>
    …page content…
  </AppShell>
  <Toaster />
</>
```

One real exception: `SidebarNav`, `SidebarSection`, `SidebarNavItem` and `useShell`
read collapse state from `AppShell`'s own context. They throw outside it — always pass
them through `AppShell`'s `sidebar` prop.

## Styling idiom — Tailwind utilities bound to tokens

Style with **utility classes**, never raw hex and never inline colors. Every color
utility below is a token; `globals.css` maps them through Tailwind v4's `@theme`.
Components take `className`, which is merged with `tailwind-merge`, so passing
`className="…"` reliably overrides a component's own utilities.

| Family | Real utilities |
|---|---|
| Surfaces | `bg-background` `bg-card` `bg-popover` `bg-muted` `bg-secondary` `bg-accent` |
| Text | `text-foreground` `text-muted-foreground` `text-text-tertiary` `text-card-foreground` `text-primary` `text-accent-foreground` |
| Accent | `bg-primary` `text-primary-foreground` `bg-primary-hover` `bg-primary-active` |
| Semantic | `text-success` `text-warning` `text-error` `text-info` + `bg-*-subtle` and `bg-*` / `text-*-foreground` for solid fills |
| Destructive | `bg-destructive` `text-destructive-foreground` `bg-destructive-hover` |
| Lines | `border-border` `border-input` `ring-ring` (focus rings are `focus-visible:ring-[3px] ring-ring/30`) |
| Charts | `text-chart-1` … `text-chart-6`, or `var(--chart-1)`…`var(--chart-6)` inside SVG |
| QR code | `bg-qr-paper` `fill-qr-ink` — the same light paper and dark ink in both themes |
| Radius | `rounded-sm` (6px) `rounded-md` (10px) `rounded-lg` (14px) `rounded-xl` (20px) |
| Elevation | `shadow-xs` `shadow-sm` `shadow-md` `shadow-lg` `shadow-xl` |
| Type | `font-sans` (Inter) `font-mono`; sizes via normal Tailwind (`text-sm`, `text-xl`, …) |
| Easing | `ease-standard` `ease-out` `ease-spring` |

Spacing, flex/grid and sizing are stock Tailwind (`gap-4`, `p-6`, `grid-cols-3`) —
there is no custom spacing scale. Responsive (`sm: md: lg: xl:`) and state
(`hover: focus-visible: disabled:`) prefixes work on these.

**Responsiveness is yours to write, with two exceptions.** `AppShell` handles it
itself — inline sidebar rail from `md` up, overlay drawer below it — and
`PageHeader` stacks its actions below `sm`. Everything else renders the same at
every width, so put `sm:` / `md:` / `lg:` prefixes on your own layout grid
(`grid-cols-1 md:grid-cols-3`) rather than assuming a component reflows.

**Avoid arbitrary values.** The stylesheet is compiled ahead of time — Tailwind is
not running when your design renders — so a bracket class like `p-[13px]`,
`text-[#ff0000]` or `w-[347px]` produces **no rule at all** and is silently ignored.
Stay on the scale above; when you genuinely need a one-off, use `style={{…}}`
(ideally referencing a token: `style={{ color: "var(--primary)" }}`).

## Composition rules that matter

- **`asChild` works everywhere** — on `Button` and `Badge` (which merge into the child
  via Radix `Slottable`), on Radix-owned parts (`DialogClose`, `DropdownMenuTrigger`),
  and on `SidebarNavItem`. Use it to render a link that looks like a button rather than
  restyling an `<a>` by hand:
  `<Button asChild><a href="/billing">Go to billing</a></Button>`. It composes with the
  other props too — `<Button asChild loading>` keeps the spinner inside the anchor, and
  `<SidebarNavItem asChild icon={…}><a href="/reports">Reports</a></SidebarNavItem>` puts
  the icon inside the anchor. In the collapsed rail that item keeps the icon alone and
  moves its label to `title`, so pass a plain string label rather than markup.
- **Compound parts are separate exports, not dotted**: `Card` + `CardHeader`
  `CardTitle` `CardDescription` `CardContent` `CardFooter`; `Table` + `TableHeader`
  `TableBody` `TableRow` `TableHead` `TableCell` `TableFooter` `TableCaption`
  `TableSortButton`; likewise for `Dialog*`, `AlertDialog*`, `DropdownMenu*`, `Select*`.
- **Forms**: wrap each control in `Field` with a `Label` (`htmlFor` ↔ `id`), then
  `FieldHelper` or `FieldError`. Mark invalid controls with `aria-invalid` — that, not
  a prop, is what turns the border red.
- **Data states**: `SummaryCard` and `ChartContainer` both take
  `state="ready" | "loading" | "empty" | "error"` — use it instead of hand-rolling
  skeletons. `ChartContainer` is chart-library agnostic: mount any chart as children
  and color series with the `--chart-*` tokens. There are six, picked to stay
  separable under the common colour-vision deficiencies, so hue alone can carry a
  category.
- **Paged lists**: `Pagination` takes `page` / `pageSize` / `total` +
  `onPageChange`, so an API returning `{ items, page, page_size, total }` maps
  straight onto it. Add `onPageSizeChange` for the rows-per-page select. Don't
  hand-assemble page controls from `Button` + `Select`.
- Persistent messages are `Alert`; transient ones are `toast()` + `<Toaster />`.
- **Charts go inside `ChartContainer`.** `WaterfallChart`, `StackedBarChart`,
  `HistoryChart` and `EventLaneChart` fill the container's area, so give it a height
  (`areaClassName="h-56"`); its `state` then covers the chart too. Put a `ChartLegend`
  beside any chart with two or more series, passing the same series list. A series can be
  `texture: "hatch"` or `"lines"` as well as a colour, so it reads apart without colour.
  Thresholds, lanes, time zones and every word are props — never redraw a chart by hand.
- **`CodeBlock` is text only.** It takes a `text` string and never renders HTML, so raw
  log lines are safe to show. Mask secrets before the text reaches it.
- **`SecretField` never shows a saved value.** Once a secret is saved it shows who saved
  it and when, with a Replace button — not the value, not even masked.
- **`QrCode` stays dark on light** in both themes, because some authenticator apps can't
  read a light-on-dark code.
- **Security components** (`RecommendationBadge`, `ConfidenceIndicator`,
  `CorrelationBadge`, `ReviewStatusLabel`, `DeviceIcon` / `DeviceList`, `IpLabels`,
  `HealthLabel`) keep one look for each state wherever it appears. Use them rather than a
  plain `Badge` with your own colours. Their words are props; device names and icons
  always come from the data.

## Where the truth is

Read these before styling — they beat any summary:

- `_ds/<folder>/styles.css` and its `@import` closure (the compiled tokens + component CSS).
- `components/<group>/<Name>/<Name>.prompt.md` — props and worked examples per component.
- `components/<group>/<Name>/<Name>.d.ts` — the exact prop contract.

Groups: **primitives** (33 controls), **dashboard** (12 composed patterns, such as
`AppShell`, `PageHeader`, `SummaryCard`, `ChartContainer`, `EmptyState`, `FilterMenu`),
**charts** (5) and **security** (7).

## Idiomatic example

Library components for the controls; utilities for your own layout glue:

```jsx
<div className="bg-background p-6">
  <PageHeader
    title="Revenue"
    description="Recurring revenue across every plan."
    actions={<Button>New report</Button>}
  />
  <div className="grid grid-cols-3 gap-4">
    <SummaryCard label="MRR" value="$48,290" trend="up" trendLabel="12.4% vs last month" />
    <SummaryCard label="Active workspaces" value="1,284" trend="up" trendLabel="86 added" />
    <SummaryCard label="Churn" value="37" trend="down" trendLabel="4.2% vs last week" />
  </div>
  <Card className="mt-4 p-5">
    <p className="text-sm text-muted-foreground">Latest invoices</p>
    <Badge dot variant="success">All settled</Badge>
  </Card>
</div>
```
