import * as React from "react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface RankListItem {
  /** A stable key; the label is used when it's a string. */
  key?: React.Key;
  label: React.ReactNode;
  /** A short note after the label, such as a device or a country. */
  detail?: React.ReactNode;
  value: number;
  /** Set the label in monospace, for addresses and codes. */
  mono?: boolean;
  /** Extra detail on hover or focus. Rows without one aren't focusable. Needs a TooltipProvider above. */
  tooltip?: React.ReactNode;
}

export interface RankListProps extends React.HTMLAttributes<HTMLOListElement> {
  items: RankListItem[];
  /** How values are written. @default n.toLocaleString() */
  formatValue?: (value: number) => React.ReactNode;
}

/**
 * Numbered rows, each with a bar in proportion to the largest value, for a
 * top-ten list. The number is always shown; the bar is a quick read only.
 */
const RankList = React.forwardRef<HTMLOListElement, RankListProps>(
  ({ items, formatValue = (n) => n.toLocaleString(), className, ...props }, ref) => {
    const max = Math.max(1, ...items.map((i) => i.value));
    return (
      <ol ref={ref} className={cn("flex flex-col gap-2.5", className)} {...props}>
        {items.map((item, i) => {
          const body = (
            <div
              tabIndex={item.tooltip ? 0 : undefined}
              className={cn(
                "group/rank-row rounded-sm",
                item.tooltip && "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
              )}
            >
              <div className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className="min-w-0 truncate">
                  <span className="mr-2 inline-block w-4 text-right tabular-nums text-muted-foreground">{i + 1}</span>
                  <span className={cn("text-foreground", item.mono && "font-mono text-xs")}>{item.label}</span>
                  {item.detail && <span className="text-muted-foreground"> · {item.detail}</span>}
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">{formatValue(item.value)}</span>
              </div>
              <div aria-hidden="true" className="ml-6 mt-1 h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-chart-1 transition-opacity group-hover/rank-row:opacity-80"
                  style={{ width: `${Math.max(1.5, (Math.max(0, item.value) / max) * 100)}%` }}
                />
              </div>
            </div>
          );
          return (
            <li key={item.key ?? (typeof item.label === "string" ? item.label : i)}>
              {item.tooltip ? (
                <Tooltip>
                  <TooltipTrigger asChild>{body}</TooltipTrigger>
                  <TooltipContent className="max-w-xs">{item.tooltip}</TooltipContent>
                </Tooltip>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ol>
    );
  },
);
RankList.displayName = "RankList";

export { RankList };
