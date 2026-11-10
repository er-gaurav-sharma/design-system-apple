import * as React from "react";
import { SignalHigh, SignalLow, SignalMedium, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ConfidenceLevel = "high" | "medium" | "low";

const confidenceConfig: Record<ConfidenceLevel, { label: string; icon: LucideIcon }> = {
  high: { label: "High", icon: SignalHigh },
  medium: { label: "Medium", icon: SignalMedium },
  low: { label: "Low", icon: SignalLow },
};

export interface ConfidenceIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: ConfidenceLevel;
  /** Replaces the default word: "High", "Medium" or "Low". */
  label?: React.ReactNode;
}

/**
 * How sure the score is: High, Medium or Low beside a signal-strength icon
 * with three, two or one bars. Text size follows the parent.
 */
const ConfidenceIndicator = React.forwardRef<HTMLSpanElement, ConfidenceIndicatorProps>(
  ({ level, label, className, ...props }, ref) => {
    const { icon: Icon, label: word } = confidenceConfig[level];
    return (
      <span
        ref={ref}
        className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-muted-foreground", className)}
        {...props}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className="text-foreground">{label ?? word}</span>
      </span>
    );
  },
);
ConfidenceIndicator.displayName = "ConfidenceIndicator";

export { ConfidenceIndicator };
