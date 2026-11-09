import * as React from "react";

import { cn } from "@/lib/utils";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A short label, shown small and upper-case above the value. */
  label: React.ReactNode;
  /** A number or short text, shown large. Leave it out to show only `children`. */
  value?: React.ReactNode;
  /** A line under the value: what it means, or where it came from. */
  caption?: React.ReactNode;
}

/**
 * A small label, a value and a caption, with no card around it, for a row of
 * figures inside a card. `children` go between the value and the caption, for
 * a Meter or a Badge in place of, or as well as, a number.
 */
const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  ({ label, value, caption, children, className, ...props }, ref) => (
    <div ref={ref} className={cn("min-w-0", className)} {...props}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {value !== undefined && (
        <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.01em] tabular-nums text-foreground">
          {value}
        </p>
      )}
      {children !== undefined && <div className={value !== undefined ? "mt-3" : "mt-2"}>{children}</div>}
      {caption && <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{caption}</p>}
    </div>
  ),
);
Stat.displayName = "Stat";

export { Stat };
