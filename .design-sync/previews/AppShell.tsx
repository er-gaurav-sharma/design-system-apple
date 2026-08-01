import * as React from "react";
import {
  AppShell,
  AppShellBrand,
  SidebarNav,
  SidebarSection,
  SidebarNavItem,
  UserMenu,
  PageHeader,
  SummaryCard,
  Button,
} from "@claude-design/dashboard-ui";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  FileText,
  Plus,
} from "lucide-react";

/**
 * The full dashboard layout. SidebarSection and SidebarNavItem read collapse
 * state from AppShell's context via useShell(), so they only work inside
 * <AppShell> — pass them through its `sidebar` prop.
 *
 * The sidebar is an inline rail from `md` up (the header toggle collapses it to
 * icons) and an overlay drawer below it, opened by the same toggle. These cards
 * render at a desktop viewport, so they always show the rail.
 */
const Nav = () => (
  <SidebarNav>
    <SidebarNavItem icon={<LayoutDashboard />} active>
      Overview
    </SidebarNavItem>
    <SidebarNavItem icon={<BarChart3 />}>Reports</SidebarNavItem>
    <SidebarNavItem icon={<FileText />}>Invoices</SidebarNavItem>
    <SidebarSection>Workspace</SidebarSection>
    <SidebarNavItem icon={<Users />}>Members</SidebarNavItem>
    <SidebarNavItem icon={<CreditCard />}>Billing</SidebarNavItem>
    <SidebarNavItem icon={<Settings />}>Settings</SidebarNavItem>
  </SidebarNav>
);

const Logo = () => (
  <span className="flex size-6 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
    A
  </span>
);

/** Expanded sidebar — the default. */
export const Default = () => (
  <AppShell
    brand={<AppShellBrand logo={<Logo />}>Acme Analytics</AppShellBrand>}
    sidebar={<Nav />}
    userMenu={<UserMenu name="Dana Whitfield" email="dana@acme.com" />}
  >
    <PageHeader
      title="Overview"
      description="Revenue and usage across every workspace."
      actions={
        <Button>
          <Plus />
          New report
        </Button>
      }
    />
    <div className="grid grid-cols-3 gap-4">
      <SummaryCard
        label="Monthly recurring revenue"
        value="$48,290"
        trend="up"
        trendLabel="12.4% vs last month"
      />
      <SummaryCard
        label="Active workspaces"
        value="1,284"
        trend="up"
        trendLabel="86 this month"
      />
      <SummaryCard
        label="Churned accounts"
        value="37"
        trend="down"
        trendLabel="4.2% vs last week"
      />
    </div>
  </AppShell>
);

/** Nav items as real anchors via `asChild` — how a router <Link> composes. */
const LinkNav = () => (
  <SidebarNav>
    <SidebarNavItem icon={<LayoutDashboard />} asChild active>
      <a href="#overview">Overview</a>
    </SidebarNavItem>
    <SidebarNavItem icon={<BarChart3 />} asChild>
      <a href="#reports">Reports</a>
    </SidebarNavItem>
    <SidebarNavItem icon={<FileText />} asChild>
      <a href="#invoices">Invoices</a>
    </SidebarNavItem>
    <SidebarSection>Workspace</SidebarSection>
    <SidebarNavItem icon={<Users />} asChild>
      <a href="#members">Members</a>
    </SidebarNavItem>
    <SidebarNavItem icon={<Settings />} asChild>
      <a href="#settings">Settings</a>
    </SidebarNavItem>
  </SidebarNav>
);

/**
 * `asChild` on every nav item. This cell exists to catch a Radix `Slottable`
 * regression the way `previews/Button.tsx → AsChildLink` does: without it,
 * `SidebarNavItem` throws "Slot failed to slot onto its children".
 */
export const AsChildLinks = () => (
  <AppShell
    brand={<AppShellBrand logo={<Logo />}>Acme Analytics</AppShellBrand>}
    sidebar={<LinkNav />}
    userMenu={<UserMenu name="Dana Whitfield" email="dana@acme.com" />}
  >
    <PageHeader title="Overview" description="Every nav item is an <a href>." />
  </AppShell>
);

/**
 * The same links in the collapsed rail. The second half of the same defect: the
 * label lives inside the anchor here, so dropping it rather than emptying it out
 * would leave Slot nothing to merge into and the whole item would vanish.
 */
export const CollapsedAsChildLinks = () => (
  <AppShell
    defaultCollapsed
    brand={<AppShellBrand logo={<Logo />}>Acme Analytics</AppShellBrand>}
    sidebar={<LinkNav />}
    userMenu={<UserMenu name="Dana Whitfield" email="dana@acme.com" />}
  >
    <PageHeader title="Overview" description="Icon-only rail, labels moved to title." />
  </AppShell>
);
