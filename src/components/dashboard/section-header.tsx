import * as React from "react";

import { cn } from "@/lib/utils";

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  /** The heading level, to fit the page outline. @default 2 */
  level?: 2 | 3 | 4;
  /** A link or control on the right, such as "View all" or a toggle. */
  action?: React.ReactNode;
}

/** A section heading with an optional link or control on the right. */
const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ title, level = 2, action, className, ...props }, ref) => {
    const Heading = `h${level}` as "h2" | "h3" | "h4";
    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap items-center justify-between gap-x-3 gap-y-2", className)}
        {...props}
      >
        <Heading className="text-[15px] font-semibold tracking-[-0.005em] text-foreground">
          {title}
        </Heading>
        {action}
      </div>
    );
  },
);
SectionHeader.displayName = "SectionHeader";

export { SectionHeader };
