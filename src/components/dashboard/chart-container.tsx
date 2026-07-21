import * as React from "react";
import { LineChart, CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export interface ChartContainerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  /** Rendered as the "Data as of ..." indicator. Pass a preformatted string. */
  asOf?: React.ReactNode;
  /** Right-aligned controls (e.g. a range selector). */
  toolbar?: React.ReactNode;
  state?: "ready" | "loading" | "empty" | "error";
  emptyLabel?: React.ReactNode;
  onRetry?: () => void;
  /**
   * Height of the chart area. The chart itself is swappable — mount any chart
   * library as children. Use the --chart-1..4 tokens for series colors,
   * --border for gridlines, and --text-tertiary for axis text.
   */
  areaClassName?: string;
}

/** Titled wrapper with a "data as of" timestamp and a generic, swappable chart area. */
const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  (
    {
      className,
      title,
      asOf,
      toolbar,
      state = "ready",
      emptyLabel = "No data for this range",
      onRetry,
      areaClassName,
      children,
      ...props
    },
    ref,
  ) => (
    <Card ref={ref} className={cn("p-5", className)} {...props}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.005em]">{title}</h3>
          {asOf && (
            <p className="mt-1 font-mono text-xs text-text-tertiary">Data as of {asOf}</p>
          )}
        </div>
        {toolbar}
      </div>

      {state === "loading" ? (
        <Skeleton className={cn("h-[200px] w-full", areaClassName)} />
      ) : state === "empty" ? (
        <ChartState
          className={areaClassName}
          icon={<LineChart className="size-6 text-text-tertiary" />}
          title={emptyLabel}
          sub="Pick a different time window."
        />
      ) : state === "error" ? (
        <ChartState
          className={areaClassName}
          icon={<CircleAlert className="size-6 text-error" />}
          title="Failed to load chart"
          action={
            onRetry && (
              <Button variant="secondary" size="sm" className="mt-1.5" onClick={onRetry}>
                Retry
              </Button>
            )
          }
        />
      ) : (
        <div className={cn("h-[200px] w-full", areaClassName)}>{children}</div>
      )}
    </Card>
  ),
);
ChartContainer.displayName = "ChartContainer";

function ChartState({
  icon,
  title,
  sub,
  action,
  className,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-[200px] flex-col items-center justify-center gap-2 text-center",
        className,
      )}
    >
      {icon}
      <p className="text-sm font-semibold">{title}</p>
      {sub && <p className="max-w-[220px] text-xs text-text-tertiary">{sub}</p>}
      {action}
    </div>
  );
}

export { ChartContainer };
