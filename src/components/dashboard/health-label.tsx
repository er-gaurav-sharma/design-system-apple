import * as React from "react";
import { CircleCheck, CircleOff, CircleX, ClockAlert, PlugZap, Unplug, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A source's connection.
 * - "ok": reading or connected.
 * - "error": the last read failed.
 * - "disconnected": not connected.
 * - "off": turned off on purpose.
 * - "quiet": connected, but nothing has arrived within the source's expected
 *   interval, so a silent source isn't mistaken for a calm day.
 */
export type HealthState = "ok" | "error" | "disconnected" | "off" | "quiet";

const healthConfig: Record<Exclude<HealthState, "ok">, { label: string; icon: LucideIcon; tone: string }> = {
  error: { label: "Last read failed", icon: CircleX, tone: "text-error" },
  disconnected: { label: "Not connected", icon: Unplug, tone: "text-error" },
  off: { label: "Off", icon: CircleOff, tone: "text-text-tertiary" },
  quiet: { label: "Quiet", icon: ClockAlert, tone: "text-warning" },
};

export interface HealthLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  state: HealthState;
  /**
   * How the source's data arrives, which sets the healthy word: "pull" when
   * the app reads from it on a schedule ("Reading"), "push" when it sends to
   * the app ("Connected"). @default "pull"
   */
  intake?: "pull" | "push";
  /** Replaces the default word. */
  label?: React.ReactNode;
}

/**
 * A source's connection as a coloured icon and a word, so the state never
 * rests on colour alone: Reading or Connected, Last read failed, Not
 * connected, Off, or Quiet.
 */
const HealthLabel = React.forwardRef<HTMLSpanElement, HealthLabelProps>(
  ({ state, intake = "pull", label, className, ...props }, ref) => {
    const c =
      state === "ok"
        ? intake === "push"
          ? { label: "Connected", icon: PlugZap, tone: "text-success" }
          : { label: "Reading", icon: CircleCheck, tone: "text-success" }
        : healthConfig[state];
    return (
      <span
        ref={ref}
        className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-[13px]", className)}
        {...props}
      >
        <c.icon className={cn("size-4 shrink-0", c.tone)} aria-hidden="true" />
        {label ?? c.label}
      </span>
    );
  },
);
HealthLabel.displayName = "HealthLabel";

export { HealthLabel };
