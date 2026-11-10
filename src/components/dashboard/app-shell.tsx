import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { Menu, ChevronDown, User, Settings, LogOut, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { DialogOverlay } from "@/components/ui/dialog";
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
  /** Desktop rail collapse state. Unaffected by the mobile drawer. */
  collapsed: boolean;
  /** Collapses the desktop rail, or opens/closes the drawer on mobile. */
  toggle: () => void;
  /** True below the `md` breakpoint, where the sidebar is an overlay drawer. */
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}
const ShellContext = React.createContext<ShellContextValue | null>(null);

function useShell() {
  const ctx = React.useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within <AppShell>");
  return ctx;
}

/** Matches Tailwind's `md` breakpoint: true below 768px. */
const MOBILE_QUERY = "(max-width: 767.98px)";

/** jsdom ships no matchMedia, so every accessor has to tolerate its absence. */
function hasMatchMedia() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function";
}

function subscribeToMobile(onChange: () => void) {
  if (!hasMatchMedia()) return () => {};
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * Viewport check for *behaviour* only — never for layout. The sidebar/drawer
 * split is done with `hidden md:flex` / `md:hidden` so it survives the first
 * paint, SSR and a JS-less render; this hook only decides what the header
 * toggle does and whether nav items render their labels.
 */
function useIsMobile() {
  return React.useSyncExternalStore(
    subscribeToMobile,
    () => (hasMatchMedia() ? window.matchMedia(MOBILE_QUERY).matches : false),
    () => false,
  );
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
  /** Controlled mobile drawer state. Uncontrolled, it starts closed. */
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
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
      mobileOpen: mobileOpenProp,
      onMobileOpenChange,
      children,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState(defaultCollapsed);
    const collapsed = collapsedProp ?? internal;

    const isMobile = useIsMobile();
    const drawerId = React.useId();
    const toggleRef = React.useRef<HTMLButtonElement>(null);
    const [internalMobileOpen, setInternalMobileOpen] = React.useState(false);
    const mobileOpen = mobileOpenProp ?? internalMobileOpen;
    const setMobileOpen = React.useCallback(
      (open: boolean) => {
        onMobileOpenChange?.(open);
        if (mobileOpenProp === undefined) setInternalMobileOpen(open);
      },
      [mobileOpenProp, onMobileOpenChange],
    );

    // Growing past `md` hands the sidebar back to the inline rail; a drawer left
    // open would otherwise still be covering the page.
    React.useEffect(() => {
      if (!isMobile && mobileOpen) setMobileOpen(false);
    }, [isMobile, mobileOpen, setMobileOpen]);

    const toggle = React.useCallback(() => {
      if (isMobile) {
        setMobileOpen(!mobileOpen);
        return;
      }
      const next = !collapsed;
      onCollapsedChange?.(next);
      if (collapsedProp === undefined) setInternal(next);
    }, [
      isMobile,
      mobileOpen,
      setMobileOpen,
      collapsed,
      collapsedProp,
      onCollapsedChange,
    ]);

    return (
      <ShellContext.Provider
        value={{ collapsed, toggle, isMobile, mobileOpen, setMobileOpen }}
      >
        <div
          ref={ref}
          className={cn("flex h-screen min-h-0 flex-col bg-background", className)}
          {...props}
        >
          <header className="flex h-14 flex-none items-center justify-between gap-2 border-b border-border bg-card px-4">
            <div className="flex min-w-0 items-center gap-3">
              {/* One button, two behaviours. A second `md:hidden` copy would be
                  invisible in a browser but would break consumers' existing
                  getByLabelText("Toggle navigation") queries, where no CSS runs. */}
              <button
                ref={toggleRef}
                type="button"
                onClick={toggle}
                aria-label="Toggle navigation"
                aria-expanded={isMobile ? mobileOpen : !collapsed}
                aria-haspopup={isMobile ? "dialog" : undefined}
                aria-controls={isMobile ? drawerId : undefined}
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
                "hidden flex-none flex-col gap-0.5 border-r border-border bg-card p-3 transition-[width] duration-200 ease-standard md:flex",
                collapsed ? "w-16 items-center" : "w-[230px]",
              )}
            >
              {sidebar}
            </aside>
            <main className="min-w-0 flex-1 overflow-auto bg-muted p-4 md:p-6">
              {children}
            </main>
          </div>

          <MobileSidebar
            id={drawerId}
            open={mobileOpen}
            onOpenChange={setMobileOpen}
            brand={brand}
            returnFocusTo={toggleRef}
          >
            {sidebar}
          </MobileSidebar>
        </div>
      </ShellContext.Provider>
    );
  },
);
AppShell.displayName = "AppShell";

/* -------------------------------------------------------------------------- */
/*  Mobile drawer                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Below `md` the sidebar is an overlay drawer instead of an inline rail. Radix
 * Dialog supplies the focus trap, Escape handling, scrim dismissal, aria-modal
 * and scroll lock; `md:hidden` keeps it out of the way on desktop, where it is
 * never opened anyway.
 */
function MobileSidebar({
  id,
  open,
  onOpenChange,
  brand,
  returnFocusTo,
  children,
}: {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: React.ReactNode;
  returnFocusTo: React.RefObject<HTMLButtonElement | null>;
  children?: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogOverlay className="md:hidden" />
        <DialogPrimitive.Content
          id={id}
          // Radix hides the rest of the page with aria-hidden rather than
          // announcing modality; both are true here, and screen readers that
          // key off aria-modal need it stated.
          aria-modal="true"
          aria-describedby={undefined}
          // Radix restores focus to whatever was focused before opening; pinning
          // it to the toggle keeps that true even when the drawer is opened from
          // a nav item or a click that never focused the button.
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocusTo.current?.focus();
          }}
          className={cn(
            "fixed inset-y-0 left-0 z-[1300] flex w-[280px] max-w-[85vw] flex-col gap-0.5 border-r border-border bg-card p-3 shadow-xl md:hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          )}
        >
          <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
          <div className="mb-1 flex h-8 items-center justify-between gap-2 px-1">
            {brand}
            <DialogPrimitive.Close className="ml-auto inline-flex rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30">
              <X className="size-5" />
              <span className="sr-only">Close navigation</span>
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

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
    <div className={cn("flex min-w-0 items-center gap-2.5 font-semibold", className)} {...props}>
      {logo}
      {/* The header is a fixed h-14, so a long brand has to truncate rather
          than wrap out of it on a narrow viewport. */}
      <span className="truncate">{children}</span>
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
  const { collapsed, isMobile } = useShell();
  // The icon-only form is a desktop rail affordance; the drawer is always full width.
  if (collapsed && !isMobile) return <div className="h-3" aria-hidden="true" />;
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
  ({ className, icon, active, asChild = false, onClick, children, ...props }, ref) => {
    const { collapsed, isMobile, setMobileOpen } = useShell();
    const iconOnly = collapsed && !isMobile;
    const Comp = asChild ? Slot : "button";
    // Under asChild `children` is the consumer's own element, so the label sits
    // one level deeper than it does on the plain <button>.
    const slotted =
      asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
        ? children
        : null;
    const label = slotted ? slotted.props.children : children;
    // The collapsed rail renders the icon alone. Without asChild that just means
    // dropping the label; with it the label has to be emptied out of the
    // consumer's element instead, because dropping the element would leave Slot
    // with nothing to merge into and the item would silently render nothing.
    let content = children;
    if (iconOnly) {
      if (!asChild) content = null;
      else if (slotted) content = React.cloneElement(slotted, undefined, null);
    }
    // Selecting a destination dismisses the drawer. Radix Slot merges handlers,
    // so this still runs when the item is a router <Link> via asChild.
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      setMobileOpen(false);
    };
    return (
      <Comp
        ref={ref}
        data-active={active || undefined}
        aria-current={active ? "page" : undefined}
        title={iconOnly && typeof label === "string" ? label : undefined}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-md px-3 py-2.5 text-[13px] font-medium text-muted-foreground transition-colors ease-standard",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
          "data-[active]:bg-accent data-[active]:text-accent-foreground",
          "[&>svg]:size-[18px] [&>svg]:shrink-0",
          iconOnly && "w-10 justify-center px-0",
          className,
        )}
        {...props}
      >
        {icon}
        {/* Slottable marks which child asChild should merge into — see
            ui/button.tsx. Without it the icon and the label are two nodes and
            Slot throws for every asChild usage, including when no `icon` is
            passed, since `{undefined}` still occupies a child slot. */}
        <Slottable>{content}</Slottable>
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
      <DropdownMenuTrigger className="flex flex-none items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30">
        <span className="flex size-7 flex-none items-center justify-center overflow-hidden rounded-full bg-accent text-xs font-semibold text-accent-foreground">
          {avatar ?? initials}
        </span>
        {/* Avatar-only below sm: the name would otherwise crowd the brand out
            of a phone-width header. The menu still carries it in full. */}
        <span className="hidden text-[13px] font-medium sm:inline">{name}</span>
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
