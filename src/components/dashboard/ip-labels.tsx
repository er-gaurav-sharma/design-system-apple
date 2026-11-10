import * as React from "react";
import { ArrowUpRight, Ban, ShieldQuestion, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** Facts about an address worth showing beside it. */
export type IpLabel = "outbound" | "private" | "unverified" | "banned";

const ipLabelConfig: Record<IpLabel, { text: string; icon?: LucideIcon; tooltip?: string }> = {
  outbound: { text: "Outbound", icon: ArrowUpRight },
  private: { text: "Private" },
  unverified: {
    text: "Source not verified",
    icon: ShieldQuestion,
    tooltip: "Its only clear signals are honeypot hits or UDP, which can't prove where they came from",
  },
  banned: { text: "Banned", icon: Ban },
};

export interface IpLabelsProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Which labels to show, in this order. Nothing renders when it's empty. */
  labels: IpLabel[];
  /**
   * "badge" for a page header; "inline", small grey text for the line under
   * an address in a table row. @default "badge"
   */
  variant?: "badge" | "inline";
  /** Replaces a label's word, such as naming the list that bans the address. */
  text?: Partial<Record<IpLabel, React.ReactNode>>;
  /**
   * Hover and focus text for a label; a label with one takes keyboard focus.
   * Only "unverified" has a default. Pass null to drop it. Needs a
   * TooltipProvider above.
   */
  tooltips?: Partial<Record<IpLabel, React.ReactNode>>;
}

const focusRing = "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30";

/**
 * Outbound, Private, Source not verified and Banned, as grey badges or as a
 * small line of text. The app chooses which apply; words and tooltips are
 * props, so no product or vendor name is built in.
 */
const IpLabels = React.forwardRef<HTMLSpanElement, IpLabelsProps>(
  ({ labels, variant = "badge", text, tooltips, className, ...props }, ref) => {
    if (!labels.length) return null;
    const inline = variant === "inline";
    return (
      <span
        ref={ref}
        className={cn(
          inline
            ? "inline-flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] leading-[13px] text-muted-foreground"
            : "inline-flex flex-wrap items-center gap-1.5",
          className,
        )}
        {...props}
      >
        {labels.map((key) => {
          const c = ipLabelConfig[key];
          const tip = tooltips && key in tooltips ? tooltips[key] : c.tooltip;
          const hasTip = tip !== null && tip !== undefined && tip !== false;
          const item = (
            <span
              key={key}
              tabIndex={hasTip ? 0 : undefined}
              className={cn(
                inline
                  ? "inline-flex items-center gap-1 whitespace-nowrap rounded-sm"
                  : cn(badgeVariants({ variant: "neutral" }), "whitespace-nowrap px-2"),
                hasTip && focusRing,
              )}
            >
              {c.icon && <c.icon className={inline ? "size-3 shrink-0" : "size-3.5 shrink-0"} aria-hidden="true" />}
              {text?.[key] ?? c.text}
            </span>
          );
          if (!hasTip) return item;
          return (
            <Tooltip key={key}>
              <TooltipTrigger asChild>{item}</TooltipTrigger>
              <TooltipContent>{tip}</TooltipContent>
            </Tooltip>
          );
        })}
      </span>
    );
  },
);
IpLabels.displayName = "IpLabels";

export { IpLabels };
