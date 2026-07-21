import * as React from "react";
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
  /** Data state. Defaults to "ready". */
  state?: "ready" | "loading" | "empty" | "error";
  emptyLabel?: React.ReactNode;
  onRetry?: () => void;
}

const trendConfig: Record<Trend, { icon: typeof ArrowUpRight; className: string }> = {
  up: { icon: ArrowUpRight, className: "text-success" },
  down: { icon: ArrowDownRight, className: "text-error" },
  neutral: { icon: Minus, className: "text-text-tertiary" },
};

/** Metric + label + optional trend indicator, with loading / empty / error states. */
const SummaryCard = React.forwardRef<HTMLDivElement, SummaryCardProps>(
  (
    {
      className,
      label,
      value,
      trend,
      trendLabel,
      state = "ready",
      emptyLabel = "No data yet",
      onRetry,
      ...props
    },
    ref,
  ) => {
    const Trend = trend ? trendConfig[trend] : null;
    return (
      <Card ref={ref} className={cn("p-5", className)} {...props}>
        {state === "loading" ? (
          <>
            <Skeleton className="mb-3.5 h-3.5 w-3/5" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="mt-3.5 h-3 w-2/3" />
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{label}</p>
            {state === "empty" ? (
              <p className="mt-2 text-sm text-text-tertiary">— {emptyLabel}</p>
            ) : state === "error" ? (
              <div className="mt-2">
                <p className="text-sm text-error">Couldn&rsquo;t load</p>
                {onRetry && (
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
      </Card>
    );
  },
);
SummaryCard.displayName = "SummaryCard";

export { SummaryCard };
