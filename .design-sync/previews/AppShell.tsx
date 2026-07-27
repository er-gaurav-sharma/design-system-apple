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
