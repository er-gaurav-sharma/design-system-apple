import * as React from "react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface RelativeTimeProps
  extends Omit<React.TimeHTMLAttributes<HTMLTimeElement>, "children" | "dateTime"> {
  /** The moment: a Date, milliseconds since the epoch, or an ISO string. */
  value: Date | number | string;
  /** The IANA time zone for the full date and time, such as "Asia/Kolkata". Default: the viewer's. */
  timeZone?: string;
  /** The short zone name after the full time, such as "IST". Default: the zone's offset, like "GMT+5:30". */
  timeZoneLabel?: string;
  /** The current time, for a fixed clock. Without it the text refreshes every 30 seconds. */
  now?: number;
}

/** "just now", "12 min ago", "3 h ago", "2 days ago", or "in 5 min" ahead. */
function relative(diffMs: number) {
  const ahead = diffMs < 0;
  const min = Math.abs(diffMs) / 60_000;
  let text: string;
  if (min < 1) return "just now";
  if (min < 60) text = `${Math.round(min)} min`;
  else if (min < 24 * 60) text = `${Math.floor(min / 60)} h`;
  else {
    const d = Math.floor(min / (24 * 60));
    text = d === 1 ? "1 day" : `${d} days`;
  }
  return ahead ? `in ${text}` : `${text} ago`;
}

/** 2026-11-09 14:53:02, 24-hour, in the given zone. */
function full(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function zoneName(date: Date, timeZone?: string) {
  return (
    new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "short" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value ?? ""
  );
}

/**
 * How long ago something happened, such as "12 min ago", with the full date
 * and time in a tooltip on hover or keyboard focus. Renders a `<time>` with
 * the exact moment in `dateTime`. Needs a TooltipProvider above it.
 */
const RelativeTime = React.forwardRef<HTMLTimeElement, RelativeTimeProps>(
  ({ value, timeZone, timeZoneLabel, now, className, ...props }, ref) => {
    const [tick, setTick] = React.useState(() => Date.now());
    React.useEffect(() => {
      if (now !== undefined) return;
      const timer = window.setInterval(() => setTick(Date.now()), 30_000);
      return () => window.clearInterval(timer);
    }, [now]);

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    const label = timeZoneLabel ?? zoneName(date, timeZone);
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <time
            ref={ref}
            dateTime={date.toISOString()}
            tabIndex={0}
            className={cn(
              "whitespace-nowrap tabular-nums underline decoration-border decoration-dotted underline-offset-4",
              "rounded-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
              className,
            )}
            {...props}
          >
            {relative((now ?? tick) - date.getTime())}
          </time>
        </TooltipTrigger>
        <TooltipContent>
          {full(date, timeZone)}
          {label && ` ${label}`}
        </TooltipContent>
      </Tooltip>
    );
  },
);
RelativeTime.displayName = "RelativeTime";

export { RelativeTime };
