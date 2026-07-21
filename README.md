# Claude Design — Dashboard UI (shadcn/ui)

Apple-inspired, drop-in shadcn/ui component library for internal dashboards.
Generated from the canonical **Claude Design** project (the single source of
truth). Light mode; token structure is dark-ready.

- **Tailwind:** v4 (CSS-first `@theme`, no `tailwind.config`)
- **Typeface:** Inter · **Accent:** Apple blue (`#0071E3`)
- **Icons:** Lucide · **Primitives:** Radix UI

## Install into an existing app

This is a **drop-in library** — copy `src/` into your app (or point your
`@/*` alias at it) and install the peer packages:

```bash
npm i @radix-ui/react-alert-dialog @radix-ui/react-checkbox \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label \
  @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-slot \
  @radix-ui/react-switch class-variance-authority clsx tailwind-merge \
  lucide-react sonner
npm i -D tailwindcss@4 tw-animate-css
```

Then:

1. Import the tokens once, at your app entry: `import "@/styles/globals.css";`
   (it `@import`s Tailwind, Inter, and `tw-animate-css`).
2. Ensure `@/*` resolves to `./src/*` (see `tsconfig.json` `paths`).
3. Mount `<Toaster />` (from `@/components/ui/sonner`) near your root for toasts.

The `components.json` lets `npx shadcn@latest add <name>` drop new components in
using the same aliases and token conventions.

## Structure

```
src/
  styles/globals.css        Design tokens → Tailwind v4 @theme bridge
  lib/utils.ts              cn() helper
  components/ui/            Primitives (shadcn new-york style)
    button  input  textarea  label  field
    select  checkbox  radio-group  switch
    badge  alert  sonner (Toaster + toast)
    dropdown-menu  dialog  alert-dialog
    table  skeleton  card
  components/dashboard/     Composed patterns
    page-header  summary-card  chart-container
    app-shell    login-form
```

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
| `bg-chart-1…chart-4` | chart series colors |

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

`SidebarNavItem` and `Button` take `asChild` to compose with a router `<Link>`.

## Source of truth & re-syncing

This library is generated from the Claude Design project. Change **tokens**
there and re-sync `globals.css`; prefer changing values behind existing token
names over renaming (renames are breaking). Add dark mode by filling in a
`.dark {}` block in `globals.css` using the same names — no component changes.
