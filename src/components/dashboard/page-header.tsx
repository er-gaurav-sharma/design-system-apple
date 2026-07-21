import * as React from "react";

import { cn } from "@/lib/utils";

export interface PageHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional action buttons rendered on the right. */
  actions?: React.ReactNode;
}

/** Page title + optional description + optional action buttons. */
const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, actions, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-4 pb-6 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        <h1 className="text-[32px] font-semibold leading-tight tracking-[-0.015em]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-base text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-none items-center gap-3">{actions}</div>}
    </div>
  ),
);
PageHeader.displayName = "PageHeader";

export { PageHeader };
