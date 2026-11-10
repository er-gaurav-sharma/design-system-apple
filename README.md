# Claude Design — Dashboard UI (shadcn/ui)

Apple-inspired, drop-in shadcn/ui component library for internal dashboards.
Generated from the canonical **Claude Design** project (the single source of
truth). Light and dark.

- **Tailwind:** v4 (CSS-first `@theme`, no `tailwind.config`)
- **Typeface:** Inter, self-hosted · **Accent:** Apple blue (`#0071E3`)
- **Icons:** Lucide · **Primitives:** Radix UI

## Install into an existing app

This is a **drop-in library** — copy `src/` into your app (or point your
`@/*` alias at it) and install the peer packages:

```bash
npm i @radix-ui/react-alert-dialog @radix-ui/react-checkbox \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label \
  @radix-ui/react-popover @radix-ui/react-radio-group @radix-ui/react-select \
  @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs \
  @radix-ui/react-tooltip class-variance-authority clsx tailwind-merge \
  date-fns lucide-react qrcode react-day-picker recharts sonner
npm i -D @types/qrcode tailwindcss@4 tw-animate-css
```

`recharts` is only for the four Recharts charts and `qrcode` only for `QrCode`;
installing per component (below) pulls each in only where it's used.

Then:

1. Import the tokens once, at your app entry: `import "@/styles/globals.css";`
   (it `@import`s Inter, Tailwind, and `tw-animate-css`).
2. Ensure `@/*` resolves to `./src/*` (see `tsconfig.json` `paths`).
3. Mount `<Toaster />` (from `@/components/ui/sonner`) near your root for toasts.
4. Wrap the app in `<TooltipProvider>` (from `@/components/ui/tooltip`) if you
   use tooltips anywhere. `CopyButton`, `RelativeTime`, the compact `StepList`, and
   `RankList`, `CorrelationBadge` and `IpLabels` with tooltips all need it.

The `components.json` lets `npx shadcn@latest add <name>` drop new components in
using the same aliases and token conventions.

### Or install per component, at a pinned tag

`registry.json` is a *build input*; the installable artifacts are the built
`public/r/*.json` files, which are committed. Point `shadcn add` at one at the tag
you want:

```bash
# tokens first — every component styles through them
npx shadcn@latest add https://raw.githubusercontent.com/er-gaurav-sharma/design-system-apple/v1.4.0/public/r/theme.json
npx shadcn@latest add https://raw.githubusercontent.com/er-gaurav-sharma/design-system-apple/v1.4.0/public/r/pagination.json
```

Each item pulls its own `registryDependencies`, so you get the transitive set.
Pinning the tag in the URL is how you pin the version.

Those dependencies are absolute URLs back into this registry, at the same tag —
not bare names. That is deliberate and it matters: shadcn resolves a bare name
against **ui.shadcn.com**, not against the registry the item came from. When
`login-form` depended on `"field"`, `shadcn add login-form` fetched upstream's
`Field` — which has no `FieldHelper` — and overwrote this system's. Anything
already built on `FieldHelper` broke, silently, at install time.

**Maintainers:**

- `public/r/` is generated — run `npm run registry:build` and commit the result
  whenever `registry.json` or any registered source file changes, or consumers
  install stale code.
- `npm run registry:check` verifies all of that: no bare-name dependencies, no
  pins left on an old tag, no component registered on some surfaces but not
  others, no stale `public/r/`. Run it before you push.
- Bump `version` in `package.json` and nothing else — `npm run version:sync`
  (which `registry:build` runs for you) rewrites every pinned URL here and in
  `registry.json` to match.

## Structure

```
src/
  styles/globals.css        Design tokens → Tailwind v4 @theme bridge
  styles/fonts/inter.css    Self-hosted Inter (generated — see Typeface)
  lib/utils.ts              cn() helper
  components/ui/            Primitives (shadcn new-york style), 33
    button  input  textarea  label  field
    select  checkbox  radio-group  switch
    badge  alert  sonner (Toaster + toast)
    dropdown-menu  dialog  alert-dialog
    tabs  tooltip  popover
    calendar  date-picker (DatePicker + DateRangePicker)
    table  pagination  skeleton  card
    meter  copy-button  code-block  key-value-list  live-indicator
    secret-field  code-input  qr-code  relative-time
  components/dashboard/     Composed patterns, 24
    page-header  summary-card  chart-container
    app-shell    login-form
    empty-state  section-header  stat  filter-menu
    checkbox-tree  step-list  rank-list
    Charts:   chart-legend  waterfall-chart  stacked-bar-chart
              history-chart  event-lane-chart
    Security: recommendation-badge  confidence-indicator  correlation-badge
              review-status-label  device-list (DeviceIcon + DeviceList)
              ip-labels  health-label
scripts/                    Registry + font maintenance
public/r/                   Built shadcn registry (generated)
```

## Typeface

The system ships Inter itself — you need **no `<link>` tag and no request to
Google Fonts**. `globals.css` imports `styles/fonts/inter.css`, which carries a
real `@font-face` with the latin subset (variable, 100–900) embedded as a data
URI, so the typeface survives both install routes: copying `src/`, and
`shadcn add theme`.

Two details worth knowing before changing it:

- **The `@import` must stay first.** CSS requires `@import` to precede every
  other rule and Tailwind v4's optimizer silently drops any that doesn't. Before
  v1.3.0 the font came from an `@import url(...)` to Google Fonts sitting *below*
  `@import "tailwindcss"` — so the compiled CSS named Inter in `--font-sans` while
  shipping no `@font-face`, and every consumer rendered in `system-ui` with
  nothing to indicate it.
- **`inter.css` is generated.** `shadcn build` inlines registered files as UTF-8
  text, so a binary `.woff2` cannot travel through the registry — hence the data
  URI. The source of truth is `.design-sync/fonts/inter-latin.woff2`; regenerate
  with `npm run font:embed`, never edit the CSS by hand.

## Dark mode

Put `dark` on a root element — `<html class="dark">` — and every component
follows. Nothing else to configure and no per-component opt-in: `.dark` in
`globals.css` restates the same token names with dark values, so components,
which only ever reference semantic utilities, need no changes.

Values follow Apple's dark system palette rather than inverting the light ramp,
which has two visible consequences: surfaces get *lighter* with elevation
(`--card` sits above `--background`), and the accent shifts to `#0A84FF`,
because `#0071E3` on near-black falls below 4.5:1.

If you add a token, add it to **both** blocks. The `dark:` variant is wired up
(`@custom-variant dark`) for the rare case a component needs to diverge
structurally rather than just by token value.

## Token model — never hard-code color

`globals.css` maps design tokens to Tailwind utilities. Style through those,
never raw hex:

| Utility | Token |
|---|---|
| `bg-background` `text-foreground` | page surface / primary text |
| `bg-card` `shadow-sm…shadow-xl` | raised surfaces + elevation |
| `bg-primary` `hover:bg-primary-hover` | accent action |
| `text-muted-foreground` `text-text-tertiary` | secondary / tertiary text |
| `bg-success/-subtle` `text-error` … | semantic status (success/warning/error/info) |
| `border-border` `border-input` | dividers / field boundaries |
| `rounded-sm…rounded-xl` | radius scale |
| `ring-ring/30` | focus ring |
| `bg-overlay` | scrim behind modal surfaces |
| `bg-thumb` | knob of a `Switch` |
| `bg-chart-1…chart-6` | chart series colors (six categorical hues) |
| `bg-qr-paper` `fill-qr-ink` | a QR code's light and dark modules, the same in both themes |
| `animate-highlight-new` `animate-highlight-target` | a short fade on a new row, or on the item a link jumped to; off under reduced motion |

Focus states use `focus-visible:ring-[3px] focus-visible:ring-ring/30`; every
interactive component ships default / hover / focus / active / disabled, and
data components (`SummaryCard`, `ChartContainer`, `Table`) support
loading / empty / error.

## Usage sketch

```tsx
import { AppShell, AppShellBrand, SidebarNav, SidebarNavItem, UserMenu }
  from "@/components/dashboard/app-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users } from "lucide-react";

<AppShell
  brand={<AppShellBrand logo={<Logo />}>Acme Internal</AppShellBrand>}
  userMenu={<UserMenu name="Jamie Doe" email="user@example.com"
              onProfile={() => {}} onSettings={() => {}} onLogout={logout} />}
  sidebar={
    <SidebarNav>
      <SidebarNavItem icon={<LayoutDashboard />} active>Dashboard</SidebarNavItem>
      <SidebarNavItem icon={<Users />}>Users</SidebarNavItem>
    </SidebarNav>
  }
>
  <PageHeader title="Dashboard" actions={<Button>New report</Button>} />
  <SummaryCard label="Active users" value="12,480" trend="up" trendLabel="12.5%" />
</AppShell>
```

`SidebarNavItem` and `Button` take `asChild` to compose with a router `<Link>` —
`<SidebarNavItem icon={<Users />} asChild><a href="/users">Users</a></SidebarNavItem>`
renders one anchor with the icon inside it. Collapsed, the rail keeps the icon and
moves the label to `title`, so give the item a plain string label.

### Responsive behaviour

`AppShell` is the only layout component with a breakpoint, and it needs no
configuration: from `md` up the sidebar is the inline rail the header toggle
collapses to icons, and below `md` it becomes an overlay drawer the same toggle
opens. The drawer closes on scrim click, Escape and nav-item selection, traps
focus while open, and always renders full labels — the icon-only form is
desktop-only. `useShell()` exposes `{ collapsed, toggle, isMobile, mobileOpen,
setMobileOpen }` if you need to drive it yourself (e.g. closing it on a router
back-navigation, or via the controlled `mobileOpen` / `onMobileOpenChange` props).

### Dates

`DatePicker` and `DateRangePicker` (`@/components/ui/date-picker`) are the
supported route for date input — a form-styled trigger opening a `Calendar` in a
`Popover`. They render identically in every browser, unlike `<Input type="date">`,
and drop into a `Field` like any other control:

```tsx
<Field>
  <Label htmlFor="period">Period</Label>
  <DateRangePicker id="period" name="period" value={range} onValueChange={setRange} />
  <FieldHelper>Submits as period-from and period-to.</FieldHelper>
</Field>
```

Both are controlled when you pass `value` and uncontrolled otherwise. Setting
`name` emits hidden inputs carrying ISO dates (`name` for a single date;
`name-from` / `name-to` for a range), so plain `FormData` submission works.
`Calendar` is also usable directly for an always-visible month grid.

Note that `Calendar` does **not** import `react-day-picker/style.css` — it is
styled entirely from the tokens, so it follows `.dark` and the accent color.
Importing that stylesheet on top of it will double-style the grid.

### Charts

`WaterfallChart`, `StackedBarChart`, `HistoryChart` and `EventLaneChart` are drawn
with Recharts and fill their parent's height, so mount them inside `ChartContainer`
and size its `areaClassName` (`h-[240px]`); its loading, empty and error states then
cover the chart too. Colours come only from `--chart-*` and the status tokens, so
dark mode needs no second palette. A series can be textured as well as coloured
(`texture: "hatch" | "lines"`), so it reads apart in print and for colour-blind
readers; `ChartLegend` draws the matching swatches and exports the two textures as
SVG patterns for your own charts. Time axes put ticks on round times in the
`timeZone` you pass. Pair a chart with a table or list of the same data for screen
readers.

### Security components

`RecommendationBadge`, `ConfidenceIndicator`, `CorrelationBadge`,
`ReviewStatusLabel`, `DeviceIcon` / `DeviceList`, `IpLabels` and `HealthLabel` carry
a security dashboard's words, so every badge looks the same wherever it appears.
Every word and tooltip is a prop with a plain default, and none names a product or
vendor: `DeviceList` takes each device's name and icon from the app, and
`RecommendationBadge` takes `label="Blocked by policy 7"` when something already
blocks an address.

### Username-based auth

`LoginForm` collects an email by default. For APIs that authenticate on a plain
username, pass `identifier="username"` — the label, `type`, `autoComplete` and
field `name`/`id` all follow, and `identifierLabel` / `identifierPlaceholder`
override the wording. `onSubmit` always emits the value under both `username` and
the legacy `email` key, so existing handlers keep working in either mode.

## Source of truth & re-syncing

This library is generated from the Claude Design project. Change **tokens**
there and re-sync `globals.css`; prefer changing values behind existing token
names over renaming (renames are breaking). A new token needs a value in both
`:root` and `.dark`, an entry in the `@theme inline` bridge, and a line in the
colour safelist in `.design-sync/tailwind-entry.css` — the design agent can name
a token it can't otherwise use.
