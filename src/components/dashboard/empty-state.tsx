import * as React from "react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** A lucide icon, drawn in a tinted circle. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** One line on why it's empty or what to do. */
  description?: React.ReactNode;
  /** A Button or link, such as "Clear filters". */
  action?: React.ReactNode;
}

/**
 * The centred message for an empty list, a search with no results or an item
 * that doesn't exist: icon, title, one line, and an optional action.
 */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 py-14 text-center",
        className,
      )}
      {...props}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="mb-1 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground [&>svg]:size-5"
        >
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && (
        <p className="max-w-sm text-[13px] leading-relaxed text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  ),
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
