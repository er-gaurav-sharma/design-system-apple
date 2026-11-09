import * as React from "react";
import { Link2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface CorrelationBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "Correlated" */
  label?: React.ReactNode;
  /**
   * What correlated means, on hover or keyboard focus. Pass null for no
   * tooltip, such as in a table that explains it once in a header.
   * Needs a TooltipProvider above.
   * @default "Two different devices flagged it within 1 h (score ×1.5)"
   */
  tooltip?: React.ReactNode;
}

/**
 * A blue "Correlated" badge for an address that more than one source
 * flagged, with the rule that counts as correlated in a tooltip. With a
 * tooltip the badge takes keyboard focus, so the explanation is reachable.
 */
const CorrelationBadge = React.forwardRef<HTMLSpanElement, CorrelationBadgeProps>(
  (
    {
      label = "Correlated",
      tooltip = "Two different devices flagged it within 1 h (score ×1.5)",
      className,
      ...props
    },
    ref,
  ) => {
    const hasTooltip = tooltip !== null && tooltip !== undefined && tooltip !== false;
    const badge = (
      <span
        ref={ref}
        tabIndex={hasTooltip ? 0 : undefined}
        className={cn(
          badgeVariants({ variant: "info" }),
          "whitespace-nowrap",
          hasTooltip && "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
          className,
        )}
        {...props}
      >
        <Link2 className="size-3.5 shrink-0" aria-hidden="true" />
        {label}
      </span>
    );
    if (!hasTooltip) return badge;
    return (
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  },
);
CorrelationBadge.displayName = "CorrelationBadge";

export { CorrelationBadge };
