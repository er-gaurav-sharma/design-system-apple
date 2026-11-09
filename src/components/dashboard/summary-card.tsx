import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Trend = "up" | "down" | "neutral";

export interface SummaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value?: React.ReactNode;
  trend?: Trend;
  trendLabel?: React.ReactNode;
  /**
   * A small icon before the label, such as a lucide icon. It is sized to the
   * label; give it a color with a text token class (`text-error`).
   */
  icon?: React.ReactNode;
  /**
   * The link form. Render the card as its only child, an `<a href>` or a router
   * `<Link>`, which takes the card's classes, ref and props. The whole card
   * then opens that link, with a hover lift, the focus ring and an arrow.
   * Use it for a tile that opens a list filtered to what it counts.
   */
  asChild?: boolean;
  /** Data state. Defaults to "ready". */
  state?: "ready" | "loading" | "empty" | "error";
  emptyLabel?: React.ReactNode;
  /**
   * Shows a Retry button in the error state. Not shown in the link form,
   * because a button can't sit inside a link.
   */
  onRetry?: () => void;
}

const trendConfig: Record<Trend, { icon: typeof ArrowUpRight; className: string }> = {
  up: { icon: ArrowUpRight, className: "text-success" },
  down: { icon: ArrowDownRight, className: "text-error" },
  neutral: { icon: Minus, className: "text-text-tertiary" },
};

/**
 * Metric + label + optional icon and trend indicator, with loading / empty /
 * error states. `asChild` turns the whole card into a link.
 */
const SummaryCard = React.forwardRef<HTMLDivElement, SummaryCardProps>(
  (
    {
      className,
      label,
      value,
      trend,
      trendLabel,
      icon,
      asChild = false,
      state = "ready",
      emptyLabel = "No data yet",
      onRetry,
      children,
      ...props
    },
    ref,
  ) => {
    const Trend = trend ? trendConfig[trend] : null;
    // Slot renders the consumer's element in place of Card, so the link form
    // repeats Card's surface classes itself.
    const Comp = asChild ? Slot : Card;

    const labelText = icon ? (
      <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
        <span className="mt-0.5 flex shrink-0 [&>svg]:size-4">{icon}</span>
        <span className="min-w-0">{label}</span>
      </p>
    ) : (
      <p className="text-sm text-muted-foreground">{label}</p>
    );

    return (
      <Comp
        ref={ref}
        className={cn(
          "p-5",
          asChild && [
            "group/summary-card block rounded-lg bg-card text-left text-card-foreground shadow-sm",
            "transition-shadow ease-standard hover:shadow-md",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
          ],
          className,
        )}
        {...props}
      >
        {state === "loading" ? (
          <>
            <Skeleton className="mb-3.5 h-3.5 w-3/5" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="mt-3.5 h-3 w-2/3" />
          </>
        ) : (
          <>
            {asChild ? (
              <div className="flex items-start justify-between gap-2">
                {labelText}
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-text-tertiary transition-colors ease-standard group-hover/summary-card:text-primary group-focus-visible/summary-card:text-primary"
                />
              </div>
            ) : (
              labelText
            )}
            {state === "empty" ? (
              <p className="mt-2 text-sm text-text-tertiary">— {emptyLabel}</p>
            ) : state === "error" ? (
              <div className="mt-2">
                <p className="text-sm text-error">Couldn&rsquo;t load</p>
                {onRetry && !asChild && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={onRetry}
                  >
                    Retry
                  </Button>
                )}
              </div>
            ) : (
              <>
                <p className="mt-3 text-[32px] font-semibold leading-none tracking-[-0.01em]">
                  {value}
                </p>
                {Trend && (
                  <span
                    className={cn(
                      "mt-3 inline-flex items-center gap-1 text-xs font-medium",
                      Trend.className,
                    )}
                  >
                    <Trend.icon className="size-3.5" />
                    {trendLabel}
                  </span>
                )}
              </>
            )}
          </>
        )}
        {/* Slottable marks the consumer's element that asChild merges into — see
            ui/button.tsx. Outside the link form there is no child to render. */}
        <Slottable>{asChild ? children : null}</Slottable>
      </Comp>
    );
  },
);
SummaryCard.displayName = "SummaryCard";

export { SummaryCard };
