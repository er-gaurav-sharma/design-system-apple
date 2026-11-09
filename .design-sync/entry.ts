/**
 * design-sync bundle entry for @claude-design/dashboard-ui.
 *
 * The repo is a shadcn-style drop-in library: consumers copy `src/` and import
 * per-module (`@/components/ui/button`), so it ships no barrel of its own. The
 * design-sync bundle needs one — every export here becomes a member of
 * `window.DashboardUI`, which is the entire API surface the Claude Design agent
 * can build with. Adding a component to `src/components/**` therefore means
 * adding its `export *` line here.
 *
 * This file is a sync input, not application source: nothing in `src/` imports
 * it, and it is only ever consumed by `.ds-sync/package-build.mjs`.
 */

// ── Primitives (src/components/ui) ──────────────────────────────────────────
export * from "../src/components/ui/alert";
export * from "../src/components/ui/alert-dialog";
export * from "../src/components/ui/badge";
export * from "../src/components/ui/button";
export * from "../src/components/ui/calendar";
export * from "../src/components/ui/card";
export * from "../src/components/ui/checkbox";
export * from "../src/components/ui/code-block";
export * from "../src/components/ui/code-input";
export * from "../src/components/ui/copy-button";
export * from "../src/components/ui/date-picker";
export * from "../src/components/ui/dialog";
export * from "../src/components/ui/dropdown-menu";
export * from "../src/components/ui/field";
export * from "../src/components/ui/input";
export * from "../src/components/ui/key-value-list";
export * from "../src/components/ui/label";
export * from "../src/components/ui/live-indicator";
export * from "../src/components/ui/meter";
export * from "../src/components/ui/pagination";
export * from "../src/components/ui/popover";
export * from "../src/components/ui/qr-code";
export * from "../src/components/ui/radio-group";
export * from "../src/components/ui/relative-time";
export * from "../src/components/ui/secret-field";
export * from "../src/components/ui/select";
export * from "../src/components/ui/skeleton";
export * from "../src/components/ui/sonner";
export * from "../src/components/ui/switch";
export * from "../src/components/ui/table";
export * from "../src/components/ui/tabs";
export * from "../src/components/ui/textarea";
export * from "../src/components/ui/tooltip";

// ── Composed dashboard patterns (src/components/dashboard) ──────────────────
export * from "../src/components/dashboard/app-shell";
export * from "../src/components/dashboard/chart-container";
export * from "../src/components/dashboard/checkbox-tree";
export * from "../src/components/dashboard/empty-state";
export * from "../src/components/dashboard/filter-menu";
export * from "../src/components/dashboard/login-form";
export * from "../src/components/dashboard/page-header";
export * from "../src/components/dashboard/rank-list";
export * from "../src/components/dashboard/section-header";
export * from "../src/components/dashboard/stat";
export * from "../src/components/dashboard/step-list";
export * from "../src/components/dashboard/summary-card";

// ── Utilities ───────────────────────────────────────────────────────────────
export { cn } from "../src/lib/utils";
