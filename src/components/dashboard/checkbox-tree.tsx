import * as React from "react";
import { ChevronRight, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CheckboxTreeItem {
  id: string;
  /** Plain text, so search can match it. */
  label: string;
  /** A short note after the label. Search matches it when it is a string. */
  hint?: React.ReactNode;
  /** Shown after the hint, such as a "New" Badge. */
  badge?: React.ReactNode;
  /** Right-hand column, such as a count. A function gets whether the item is ticked. */
  meta?: React.ReactNode | ((checked: boolean) => React.ReactNode);
  /** Set the label in monospace, for codes and identifiers. */
  mono?: boolean;
}

export interface CheckboxTreeGroup extends Omit<CheckboxTreeItem, "badge" | "mono"> {
  items: CheckboxTreeItem[];
}

export interface CheckboxTreeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  groups: CheckboxTreeGroup[];
  /** The ids of the ticked items. A group's own state follows from its items. */
  checked: string[];
  onCheckedChange: (checked: string[]) => void;
  /** Show a search box that filters items by label and hint. */
  searchable?: boolean;
  /** @default "Search" */
  searchPlaceholder?: string;
  /** Headings for the label and meta columns. The header row shows when either is set. */
  labelHeading?: React.ReactNode;
  metaHeading?: React.ReactNode;
  /** What a group says when some of its items are unticked. @default "{checked} of {total} selected" */
  groupSummary?: (checked: number, total: number) => React.ReactNode;
  /** The accessible name of the whole tree, such as "Which events count". */
  label?: string;
}

const row = "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_104px]";

/**
 * Two levels of checkboxes: groups and their items. A group's checkbox ticks
 * or clears all its items and shows a dash when only some are ticked. Groups
 * expand and collapse; a search narrows the items and opens every group.
 */
const CheckboxTree = React.forwardRef<HTMLDivElement, CheckboxTreeProps>(
  (
    {
      groups,
      checked,
      onCheckedChange,
      searchable = false,
      searchPlaceholder = "Search",
      labelHeading,
      metaHeading,
      groupSummary = (c, t) => `${c} of ${t} selected`,
      label,
      className,
      ...props
    },
    ref,
  ) => {
    const baseId = React.useId();
    const [query, setQuery] = React.useState("");
    const [collapsed, setCollapsed] = React.useState<string[]>([]);
    const q = query.trim().toLowerCase();
    const hit = (x: { label: string; hint?: React.ReactNode }) =>
      !q ||
      x.label.toLowerCase().includes(q) ||
      (typeof x.hint === "string" && x.hint.toLowerCase().includes(q));
    const visible = groups
      .map((g) => ({ g, items: hit(g) ? g.items : g.items.filter(hit) }))
      .filter((x) => x.items.length > 0);
    const on = new Set(checked);
    const metaOf = (m: CheckboxTreeItem["meta"], c: boolean) => (typeof m === "function" ? m(c) : m);

    const setItem = (id: string, value: boolean) =>
      onCheckedChange(value ? [...checked.filter((x) => x !== id), id] : checked.filter((x) => x !== id));
    const setGroup = (g: CheckboxTreeGroup, value: boolean) => {
      const ids = g.items.map((i) => i.id);
      onCheckedChange(
        value ? Array.from(new Set([...checked, ...ids])) : checked.filter((x) => !ids.includes(x)),
      );
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props}>
        {searchable && (
          <div className="relative max-w-sm">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              aria-label={label ? `Search ${label.toLowerCase()}` : searchPlaceholder}
              placeholder={searchPlaceholder}
              className="h-9 pl-9 text-[13px]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}
        <div role="group" aria-label={label} className="overflow-hidden rounded-md border border-border">
          {(labelHeading || metaHeading) && (
            <div
              className={cn(
                row,
                "border-b border-border bg-muted px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground",
              )}
            >
              <span>{labelHeading}</span>
              <span className="text-right">{metaHeading}</span>
            </div>
          )}
          {visible.length === 0 && (
            <p className="px-3 py-6 text-center text-[13px] text-muted-foreground">
              Nothing matches &ldquo;{query.trim()}&rdquo;.
            </p>
          )}
          <ul>
            {visible.map(({ g, items }) => {
              const ids = g.items.map((i) => i.id);
              const count = ids.filter((id) => on.has(id)).length;
              const state = count === ids.length ? true : count === 0 ? false : "indeterminate";
              const open = q ? true : !collapsed.includes(g.id);
              const groupBox = `${baseId}-${g.id}`;
              const listId = `${groupBox}-items`;
              return (
                <li key={g.id} className="border-b border-border last:border-0">
                  <div className={cn(row, "px-3 py-2")}>
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={listId}
                        aria-label={`${open ? "Collapse" : "Expand"} ${g.label}`}
                        disabled={!!q}
                        className="flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none"
                        onClick={() =>
                          setCollapsed((c) => (c.includes(g.id) ? c.filter((x) => x !== g.id) : [...c, g.id]))
                        }
                      >
                        <ChevronRight
                          aria-hidden="true"
                          className={cn("size-4 transition-transform ease-standard", open && "rotate-90")}
                        />
                      </button>
                      <Checkbox
                        id={groupBox}
                        checked={state}
                        onCheckedChange={() => setGroup(g, state !== true)}
                      />
                      <Label htmlFor={groupBox} className="min-w-0 truncate font-semibold">
                        {g.label}
                      </Label>
                      {g.hint && <span className="text-xs text-muted-foreground">{g.hint}</span>}
                      {state !== true && (
                        <span className="text-xs text-muted-foreground">{groupSummary(count, ids.length)}</span>
                      )}
                    </div>
                    <span className="text-right text-[13px] tabular-nums text-muted-foreground">
                      {metaOf(g.meta, state !== false)}
                    </span>
                  </div>
                  {open && (
                    <ul id={listId} aria-label={g.label}>
                      {items.map((item) => {
                        const isOn = on.has(item.id);
                        const box = `${baseId}-${item.id}`;
                        return (
                          <li key={item.id} className={cn(row, "py-1.5 pl-[68px] pr-3 hover:bg-muted")}>
                            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                              <Checkbox
                                id={box}
                                checked={isOn}
                                onCheckedChange={(v) => setItem(item.id, v === true)}
                              />
                              <Label
                                htmlFor={box}
                                className={cn(
                                  "min-w-0 break-words font-normal",
                                  item.mono && "font-mono text-xs",
                                  !isOn && "text-muted-foreground",
                                )}
                              >
                                {item.label}
                              </Label>
                              {item.hint && <span className="text-xs text-muted-foreground">{item.hint}</span>}
                              {item.badge}
                            </div>
                            <span
                              className={cn(
                                "text-right text-[13px] tabular-nums",
                                isOn ? "text-foreground" : "text-muted-foreground",
                              )}
                            >
                              {metaOf(item.meta, isOn)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  },
);
CheckboxTree.displayName = "CheckboxTree";

export { CheckboxTree };
