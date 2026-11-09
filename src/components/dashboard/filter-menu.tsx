import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FilterMenuOption {
  value: string;
  label: React.ReactNode;
}

export interface FilterMenuProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange" | "children"> {
  /** What the filter is on, such as "Device". The button reads "Device: All". */
  label: string;
  options: FilterMenuOption[];
  /** The selected option values. All of them means no filter. */
  value: string[];
  onChange: (value: string[]) => void;
}

// Select all and Clear as two small secondary buttons side by side.
const bulkItem =
  "h-8 flex-1 justify-center rounded-md bg-secondary px-2 py-0 text-xs font-medium text-secondary-foreground shadow-[inset_0_0_0_1px_var(--border)] focus:bg-secondary-hover";

/**
 * A "Device: All" button that opens a checklist of options with Select all and
 * Clear. The button shows All, None, the one option chosen, or "3 selected",
 * and is tinted while it filters anything out. The menu stays open while
 * options are ticked.
 */
const FilterMenu = React.forwardRef<HTMLButtonElement, FilterMenuProps>(
  ({ label, options, value, onChange, className, ...props }, ref) => {
    const chosen = options.filter((o) => value.includes(o.value));
    const isAll = chosen.length === options.length;
    const summary = isAll
      ? "All"
      : chosen.length === 0
        ? "None"
        : chosen.length === 1
          ? chosen[0].label
          : `${chosen.length} selected`;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            variant="secondary"
            size="sm"
            className={cn(
              "gap-1.5 px-3",
              !isAll && "bg-accent text-accent-foreground hover:bg-accent active:bg-accent",
              className,
            )}
            {...props}
          >
            <span className={isAll ? "text-muted-foreground" : undefined}>{label}:</span>
            <span className="max-w-[140px] truncate">{summary}</span>
            <ChevronDown aria-hidden="true" className={isAll ? "text-muted-foreground" : undefined} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[14rem]">
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          {options.map((o) => (
            <DropdownMenuCheckboxItem
              key={o.value}
              checked={value.includes(o.value)}
              // Keep the menu open so several options can be ticked in a row.
              onSelect={(e) => e.preventDefault()}
              onCheckedChange={(on) =>
                onChange(
                  // Keep the options' own order, whatever order they were ticked in.
                  options
                    .map((x) => x.value)
                    .filter((v) => (v === o.value ? on === true : value.includes(v))),
                )
              }
            >
              {o.label}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          {/* Menu items, not plain buttons: a Radix menu keeps Tab from leaving
              it, so only items are reachable from the keyboard. */}
          <div className="flex gap-1 px-1 pb-0.5">
            <DropdownMenuItem
              className={bulkItem}
              onSelect={(e) => {
                e.preventDefault();
                onChange(options.map((o) => o.value));
              }}
            >
              Select all
            </DropdownMenuItem>
            <DropdownMenuItem
              className={bulkItem}
              onSelect={(e) => {
                e.preventDefault();
                onChange([]);
              }}
            >
              Clear
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);
FilterMenu.displayName = "FilterMenu";

export { FilterMenu };
