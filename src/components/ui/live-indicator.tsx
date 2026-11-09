import * as React from "react";
import { Loader2, WifiOff } from "lucide-react";

import { cn } from "@/lib/utils";

export type LiveState = "live" | "reconnecting" | "offline";

export interface LiveIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  state: LiveState;
  /** When the data last updated, such as "14:32". Shown when offline. */
  lastUpdate?: React.ReactNode;
  /** Replaces the default words ("Live", "Reconnecting…", "Offline"). */
  label?: React.ReactNode;
}

const stateConfig: Record<LiveState, { text: string; className: string }> = {
  live: { text: "Live", className: "text-foreground" },
  reconnecting: { text: "Reconnecting…", className: "text-warning" },
  offline: { text: "Offline", className: "text-error" },
};

/**
 * Whether a live view is receiving updates: a pulsing dot for Live, a spinner
 * for Reconnecting and an icon with the last update time for Offline. It is a
 * polite live region, so a change of state is announced. The pulse and the
 * spinner stop when the system asks for reduced motion.
 */
const LiveIndicator = React.forwardRef<HTMLSpanElement, LiveIndicatorProps>(
  ({ state, lastUpdate, label, className, ...props }, ref) => {
    const config = stateConfig[state];
    return (
      <span
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium",
          className,
        )}
        {...props}
      >
        {state === "live" && (
          <span className="relative flex size-2.5" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2.5 rounded-full bg-success" />
          </span>
        )}
        {state === "reconnecting" && (
          <Loader2
            className="size-3.5 animate-spin text-warning motion-reduce:animate-none"
            aria-hidden="true"
          />
        )}
        {state === "offline" && <WifiOff className="size-3.5 text-error" aria-hidden="true" />}
        <span className={config.className}>
          {label ?? config.text}
          {state === "offline" && lastUpdate ? <> · last update {lastUpdate}</> : null}
        </span>
      </span>
    );
  },
);
LiveIndicator.displayName = "LiveIndicator";

export { LiveIndicator };
