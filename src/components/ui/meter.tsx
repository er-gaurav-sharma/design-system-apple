import * as React from "react";

import { cn } from "@/lib/utils";

export type MeterTone = "neutral" | "info" | "success" | "warning" | "error";

const toneFill: Record<MeterTone, string> = {
  neutral: "bg-muted-foreground",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

export interface MeterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The value to show, from 0 to `max`. Drawing clamps it to that range. */
  value: number;
  /** @default 10 */
  max?: number;
  /**
   * Band edges in ascending order. Each draws a mark on the track, and a value
   * at or above an edge is in the next band. @default [4, 7]
   */
  marks?: number[];
  /**
   * The fill of each band from the lowest, one more than `marks`.
   * @default ["neutral", "warning", "error"]
   */
  tones?: MeterTone[];
  /** "sm" is a 40px bar for a table cell; "md" fills its container. @default "sm" */
  size?: "sm" | "md";
  /** The accessible name, such as "Score". Or pass `aria-labelledby`. */
  label?: string;
  /** What a screen reader says for the value. @default "{value} of {max}" */
  valueText?: string;
}

/**
 * A bar from 0 to `max`, filled in the colour of the band the value falls in,
 * with a mark at each band edge. Show the number beside it as well: the bar
 * is a quick read, not the value itself.
 */
const Meter = React.forwardRef<HTMLDivElement, MeterProps>(
  (
    {
      value,
      max = 10,
      marks = [4, 7],
      tones = ["neutral", "warning", "error"],
      size = "sm",
      label,
      valueText,
      className,
      ...props
    },
    ref,
  ) => {
    const clamped = Math.max(0, Math.min(max, value));
    const pct = max > 0 ? (clamped / max) * 100 : 0;
    const band = marks.filter((m) => clamped >= m).length;
    const tone = tones[Math.min(band, tones.length - 1)] ?? "neutral";
    return (
      <div
        ref={ref}
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-valuetext={valueText ?? `${value} of ${max}`}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full bg-border",
          size === "sm" ? "h-1.5 w-10" : "h-2 w-full",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-standard motion-reduce:transition-none",
            toneFill[tone],
          )}
          style={{ width: `${pct}%` }}
        />
        {marks.map((m) => (
          <span
            key={m}
            aria-hidden="true"
            className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-card"
            style={{ left: `${(m / max) * 100}%` }}
          />
        ))}
      </div>
    );
  },
);
Meter.displayName = "Meter";

export { Meter };
