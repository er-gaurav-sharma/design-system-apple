import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

export interface HistoryPoint {
  /** When the value changed, in milliseconds since the epoch. */
  t: number;
  value: number;
  /** A short word after the value in the tooltip, such as the band the value falls in. */
  label?: React.ReactNode;
  /** Why it changed, on the tooltip's last line. */
  reason?: React.ReactNode;
}

export interface HistoryChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Each change, oldest first. */
  points: HistoryPoint[];
  /** Where the time axis starts. @default the first point */
  start?: number;
  /** Where the time axis ends, usually now. The line holds its last value up to here. @default the last point */
  end?: number;
  /** The tooltip's last line at `end`, such as "Now". */
  endLabel?: React.ReactNode;
  /** The value axis. @default from 0 to a round number above the highest value */
  yDomain?: [number, number];
  /** The values to mark on the value axis. @default about six round values */
  yTicks?: number[];
  /** Dashed lines across the chart at these values, labelled on the right. */
  thresholds?: { value: number; label: string }[];
  /** How values are written. @default n.toLocaleString() */
  formatValue?: (value: number) => string;
  /** The IANA time zone for the axis and tooltip, such as "Asia/Kolkata". Default: the viewer's. */
  timeZone?: string;
  /** The short zone name after a tooltip's time, such as "IST". Default: the zone's offset, like "GMT+5:30". */
  timeZoneLabel?: string;
  /** The line's colour. @default "var(--chart-1)" */
  color?: string;
}

const tick = { fill: "var(--text-tertiary)", fontSize: 11 };

/* ---- Time in a zone. HistoryChart and EventLaneChart carry the same helpers,
   so either file can be copied in on its own. ---- */

const MIN = 60_000;
const DAY = 1440 * MIN;
const TICK_STEPS = [5, 10, 15, 30, 60, 120, 180, 360, 720, 1440, 2880, 10080].map((m) => m * MIN);

/** Milliseconds to add to a moment to get the wall-clock time in the zone. */
function zoneOffset(t: number, timeZone?: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(new Date(t));
  const n = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const wall = Date.UTC(n("year"), n("month") - 1, n("day"), n("hour"), n("minute"), n("second"));
  return wall - Math.floor(t / 1000) * 1000;
}

/** Round times in the zone, every 10 min, hour, 3 h and so on, at most about nine across the range. */
function timeTicks(start: number, end: number, timeZone?: string) {
  const step = TICK_STEPS.find((s) => (end - start) / s <= 9) ?? Math.ceil((end - start) / 9 / DAY) * DAY;
  const offset = zoneOffset(start, timeZone);
  const ticks: number[] = [];
  for (let t = Math.ceil((start + offset) / step) * step - offset; t <= end; t += step) ticks.push(t);
  return { ticks, step };
}

/** "14:00" within a day, "9 Nov" for day ticks. */
function tickText(t: number, step: number, timeZone?: string) {
  return new Intl.DateTimeFormat(
    "en-GB",
    step >= DAY
      ? { timeZone, day: "numeric", month: "short" }
      : { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" },
  ).format(new Date(t));
}

/** "2026-11-09 14:53:02 IST", 24-hour, in the zone. */
function fullTime(t: number, timeZone?: string, label?: string) {
  const date = new Date(t);
  const text = new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);
  const zone =
    label ??
    new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "short" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value;
  return zone ? `${text} ${zone}` : text;
}

/* ---- */

/** A step of 1, 2, 2.5 or 5 times a power of ten that gives about five ticks. */
function niceStep(span: number) {
  const raw = span / 5;
  const power = 10 ** Math.floor(Math.log10(raw));
  const m = raw / power;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * power;
}

interface Row extends HistoryPoint {
  /** The carried-on point at `end`, drawn without a dot. */
  carried?: boolean;
}

/**
 * A value over time as a stepped line: it holds each value until the next
 * change. Each change has a dot, and its tooltip gives the time, the value
 * and why it changed. Threshold lines mark the bands. Fills the height of
 * its parent, such as a ChartContainer's area. Pair it with a list of the
 * changes for screen readers.
 */
const HistoryChart = React.forwardRef<HTMLDivElement, HistoryChartProps>(
  (
    {
      points,
      start,
      end,
      endLabel,
      yDomain,
      yTicks,
      thresholds = [],
      formatValue = (n) => n.toLocaleString(),
      timeZone,
      timeZoneLabel,
      color = "var(--chart-1)",
      className,
      ...props
    },
    ref,
  ) => {
    const first = points[0]?.t ?? Date.now();
    const from = start ?? first;
    const to = Math.max(end ?? points[points.length - 1]?.t ?? first, from + MIN);
    // Changes before the axis starts are left out, but the value they left
    // in force is drawn from the start, without a dot.
    const earlier = points.filter((p) => p.t < from);
    const before = earlier[earlier.length - 1];
    const inside = points.filter((p) => p.t >= from && p.t <= to);
    const rows: Row[] = [
      ...(before ? [{ ...before, t: from, reason: undefined, carried: true }] : []),
      ...inside,
    ];
    const held = inside.length ? inside[inside.length - 1] : before;
    if (held && (!inside.length || to > held.t)) rows.push({ ...held, t: to, reason: endLabel, carried: true });

    const high = Math.max(0, ...rows.map((p) => p.value), ...thresholds.map((t) => t.value));
    const step = niceStep(high || 1);
    const domain = yDomain ?? [0, Math.ceil(high / step) * step || step];
    const ticks =
      yTicks ??
      Array.from({ length: Math.round((domain[1] - domain[0]) / step) + 1 }, (_, i) =>
        Number((domain[0] + i * step).toFixed(10)),
      );
    const time = timeTicks(from, to, timeZone);
    // Room on the right for the longest threshold label, at about 6px a character.
    const right = thresholds.length ? Math.max(...thresholds.map((t) => t.label.length)) * 6 + 12 : 16;

    return (
      <div ref={ref} className={cn("h-full w-full", className)} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 12, right, bottom: 4, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              type="number"
              dataKey="t"
              domain={[from, to]}
              ticks={time.ticks}
              tickFormatter={(t: number) => tickText(t, time.step, timeZone)}
              interval="equidistantPreserveStart"
              tick={tick}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              domain={domain}
              ticks={ticks}
              tickFormatter={(v: number) => formatValue(v)}
              tick={tick}
              width={Math.max(32, formatValue(domain[1]).length * 7 + 10)}
              axisLine={false}
              tickLine={false}
            />
            {thresholds.map((t) => (
              <ReferenceLine
                key={t.label}
                y={t.value}
                stroke="var(--text-tertiary)"
                strokeDasharray="3 3"
                label={{ value: t.label, position: "right", fill: "var(--text-tertiary)", fontSize: 11 }}
              />
            ))}
            <Tooltip
              cursor={{ stroke: "var(--text-tertiary)", strokeWidth: 1 }}
              isAnimationActive={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as Row;
                return (
                  <div className="max-w-xs rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
                    <p className="tabular-nums text-muted-foreground">{fullTime(p.t, timeZone, timeZoneLabel)}</p>
                    <p className="mt-0.5 font-semibold tabular-nums">
                      {formatValue(p.value)}
                      {p.label && <> · {p.label}</>}
                    </p>
                    {p.reason && <p className="mt-0.5 text-muted-foreground">{p.reason}</p>}
                  </div>
                );
              }}
            />
            <Line
              type="stepAfter"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              isAnimationActive={false}
              dot={(p: { cx?: number; cy?: number; index?: number }) =>
                p.index === undefined || rows[p.index]?.carried ? (
                  <g key={`dot-${p.index}`} />
                ) : (
                  <circle
                    key={`dot-${p.index}`}
                    cx={p.cx}
                    cy={p.cy}
                    r={4}
                    fill={color}
                    stroke="var(--card)"
                    strokeWidth={2}
                  />
                )
              }
              activeDot={{ r: 5, fill: color, stroke: "var(--card)", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  },
);
HistoryChart.displayName = "HistoryChart";

export { HistoryChart };
