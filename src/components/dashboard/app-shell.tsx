import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Menu, ChevronDown, User, Settings, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* -------------------------------------------------------------------------- */
/*  Context                                                                    */
/* -------------------------------------------------------------------------- */

interface ShellContextValue {
  collapsed: boolean;
  toggle: () => void;
}
const ShellContext = React.createContext<ShellContextValue | null>(null);

function useShell() {
  const ctx = React.useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within <AppShell>");
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  AppShell                                                                   */
/* -------------------------------------------------------------------------- */

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  brand?: React.ReactNode;
  sidebar?: React.ReactNode;
  userMenu?: React.ReactNode;
  defaultCollapsed?: boolean;
  /** Controlled collapse. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  (
    {
      className,
      brand,
      sidebar,
      userMenu,
      defaultCollapsed = false,
      collapsed: collapsedProp,
      onCollapsedChange,
      children,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState(defaultCollapsed);
    const collapsed = collapsedProp ?? internal;
    const toggle = React.useCallback(() => {
      const next = !collapsed;
      onCollapsedChange?.(next);
      if (collapsedProp === undefined) setInternal(next);
    }, [collapsed, collapsedProp, onCollapsedChange]);

    return (
      <ShellContext.Provider value={{ collapsed, toggle }}>
        <div
          ref={ref}
          className={cn("flex h-screen min-h-0 flex-col bg-background", className)}
          {...props}
        >
          <header className="flex h-14 flex-none items-center justify-between border-b border-border bg-card px-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggle}
                aria-label="Toggle navigation"
                aria-expanded={!collapsed}
                className="inline-flex rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
              >
                <Menu className="size-5" />
              </button>
              {brand}
            </div>
            {userMenu}
          </header>

          <div className="flex min-h-0 flex-1">
            <aside
              className={cn(
                "flex flex-none flex-col gap-0.5 border-r border-border bg-card p-3 transition-[width] duration-200 ease-standard",
                collapsed ? "w-16 items-center" : "w-[230px]",
              )}
            >
              {sidebar}
            </aside>
            <main className="min-w-0 flex-1 overflow-auto bg-muted p-6">{children}</main>
          </div>
        </div>
      </ShellContext.Provider>
    );
  },
);
AppShell.displayName = "AppShell";

/* -------------------------------------------------------------------------- */
/*  Brand                                                                      */
/* -------------------------------------------------------------------------- */

function AppShellBrand({
  logo,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { logo?: React.ReactNode }) {
  return (
    <div className={cn("flex items-center gap-2.5 font-semibold", className)} {...props}>
      {logo}
      <span>{children}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sidebar nav                                                                */
/* -------------------------------------------------------------------------- */

const SidebarNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} className={cn("flex w-full flex-col gap-0.5", className)} {...props} />
  ),
);
SidebarNav.displayName = "SidebarNav";

function SidebarSection({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useShell();
  if (collapsed) return <div className="h-3" aria-hidden="true" />;
  return (
    <div
      className={cn(
        "px-3 pb-1.5 pt-3.5 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SidebarNavItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  active?: boolean;
  /** Render as the child (e.g. a router <Link>) instead of a <button>. */
  asChild?: boolean;
}

const SidebarNavItem = React.forwardRef<HTMLButtonElement, SidebarNavItemProps>(
  ({ className, icon, active, asChild = false, children, ...props }, ref) => {
    const { collapsed } = useShell();
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-active={active || undefined}
        aria-current={active ? "page" : undefined}
        title={collapsed && typeof children === "string" ? children : undefined}
        className={cn(
          "flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-md px-3 py-2.5 text-[13px] font-medium text-muted-foreground transition-colors ease-standard",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
          "data-[active]:bg-accent data-[active]:text-primary",
          "[&>svg]:size-[18px] [&>svg]:shrink-0",
          collapsed && "w-10 justify-center px-0",
          className,
        )}
        {...props}
      >
        {icon}
        {!collapsed && children}
      </Comp>
    );
  },
);
SidebarNavItem.displayName = "SidebarNavItem";

/* -------------------------------------------------------------------------- */
/*  User menu                                                                  */
/* -------------------------------------------------------------------------- */

export interface UserMenuProps {
  name: string;
  email?: string;
  /** Initials or an <img>. Defaults to the first letters of `name`. */
  avatar?: React.ReactNode;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  /** Extra items inserted before the Log out entry. */
  children?: React.ReactNode;
}

function UserMenu({
  name,
  email,
  avatar,
  onProfile,
  onSettings,
  onLogout,
  children,
}: UserMenuProps) {
  const initials =
    typeof avatar === "undefined"
      ? name
          .split(" ")
          .map((p) => p[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30">
        <span className="flex size-7 flex-none items-center justify-center overflow-hidden rounded-full bg-accent text-xs font-semibold text-primary">
          {avatar ?? initials}
        </span>
        <span className="text-[13px] font-medium">{name}</span>
        <ChevronDown className="size-[15px] text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5 font-normal">
          <span className="text-[13px] font-semibold">{name}</span>
          {email && <span className="text-xs text-text-tertiary">{email}</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {onProfile && (
          <DropdownMenuItem onSelect={onProfile}>
            <User />
            Profile
          </DropdownMenuItem>
        )}
        {onSettings && (
          <DropdownMenuItem onSelect={onSettings}>
            <Settings />
            Settings
          </DropdownMenuItem>
        )}
        {children}
        {(onProfile || onSettings || children) && <DropdownMenuSeparator />}
        <DropdownMenuItem variant="destructive" onSelect={onLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export {
  AppShell,
  AppShellBrand,
  SidebarNav,
  SidebarSection,
  SidebarNavItem,
  UserMenu,
  useShell,
};
