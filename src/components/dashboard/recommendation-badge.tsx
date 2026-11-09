import * as React from "react";
import { Ban, CircleCheck, ShieldX, TriangleAlert, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";

/** What the dashboard recommends doing about an address, strongest first. */
export type Recommendation = "perimeter-block" | "challenge" | "allow" | "none";

/** The default word for each recommendation, for use in running text. */
export const recommendationLabels: Record<Recommendation, string> = {
  "perimeter-block": "Perimeter Block",
  challenge: "Challenge",
  allow: "Allow",
  none: "No recommendation",
};

const recommendationConfig: Record<
  Recommendation,
  { icon: LucideIcon; variant: "error" | "warning" | "neutral" }
> = {
  "perimeter-block": { icon: ShieldX, variant: "error" },
  challenge: { icon: TriangleAlert, variant: "warning" },
  allow: { icon: CircleCheck, variant: "neutral" },
  none: { icon: Ban, variant: "neutral" },
};

export interface RecommendationBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  recommendation: Recommendation;
  /**
   * Replaces the default word. For "none", use it to say what already stops
   * the address, such as "Blocked by policy 7" or a device's ban list; the
   * badge keeps its "blocked" icon.
   */
  label?: React.ReactNode;
}

/**
 * Perimeter Block in red, Challenge in amber, and Allow or no recommendation
 * in grey, each with its own icon so the colour is never the only cue.
 */
const RecommendationBadge = React.forwardRef<HTMLSpanElement, RecommendationBadgeProps>(
  ({ recommendation, label, className, ...props }, ref) => {
    const { icon: Icon, variant } = recommendationConfig[recommendation];
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), "whitespace-nowrap", className)}
        {...props}
      >
        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
        {label ?? recommendationLabels[recommendation]}
      </span>
    );
  },
);
RecommendationBadge.displayName = "RecommendationBadge";

export { RecommendationBadge };
