import * as React from "react";
import {
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

export interface EventLane {
  id: string;
  /** The lane's name on the left, such as a source's name. */
  label: string;
}

export interface LaneEvent {
  id: string;
  /** The id of the lane it sits in. */
  lane: string;
  /** When it happened, in milliseconds since the epoch. */
  t: number;
  /** Draw it as a ring instead of a dot, for a second kind of event, such as one that was stopped. */
  hollow?: boolean;
  /** The tooltip's first line. */
  label: React.ReactNode;
  /** More tooltip lines under the label. The time is added after them. */
  detail?: React.ReactNode;
}

export interface EventLaneChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Top to bottom. Every lane is drawn, even one with no events in range. */
  lanes: EventLane[];
  events: LaneEvent[];
  /** Where the time axis starts. Events before it are left out. */
  start: number;
  /** Where the time axis ends, usually now. Events after it are left out. */
  end: number;
  /** A shaded span with a label above its right end, such as the window in which events count as related. */
  highlight?: { start: number; end: number; label?: string };
  /** The event drawn with a ring around it. */
  selectedId?: string | null;
  /**
   * Called with an event's id when it is clicked. Clicking is mouse and touch
   * only, so keep a list of the same events, where the keyboard can reach
   * each one, next to the chart.
   */
  onSelect?: (id: string) => void;
  /** The tooltip's last line when events can be clicked. @default "Click for details" */
  selectHint?: React.ReactNode;
  /** The IANA time zone for the axis and tooltip, such as "Asia/Kolkata". Default: the viewer's. */
  timeZone?: string;
  /** The short zone name after a tooltip's time, such as "IST". Default: the zone's offset, like "GMT+5:30". */
  timeZoneLabel?: string;
  /** The width of the lane name column, in pixels. @default 96 */
  laneWidth?: number;
  /** The dots' colour. @default "var(--chart-1)" */
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

interface Point extends LaneEvent {
  x: number;
  y: number;
}

/**
 * Events over time as dots, one lane per source, so it shows at a glance
 * which sources saw something and when. A ring marks a second kind of event,
 * a shaded span can mark a window, and clicking a dot selects that event.
 * Fills the height of its parent, such as a ChartContainer's area; allow
 * about 40px a lane.
 */
const EventLaneChart = React.forwardRef<HTMLDivElement, EventLaneChartProps>(
  (
    {
      lanes,
      events,
      start,
      end,
      highlight,
      selectedId,
      onSelect,
      selectHint = "Click for details",
      timeZone,
      timeZoneLabel,
      laneWidth = 96,
      color = "var(--chart-1)",
      className,
      ...props
    },
    ref,
  ) => {
    const laneIndex = new Map(lanes.map((l, i) => [l.id, i]));
    const data: Point[] = events
      .filter((e) => e.t >= start && e.t <= end && laneIndex.has(e.lane))
      .map((e) => ({ ...e, x: e.t, y: laneIndex.get(e.lane)! }));
    const time = timeTicks(start, end, timeZone);
    const shaded = highlight && {
      x1: Math.max(highlight.start, start),
      x2: Math.min(highlight.end, end),
      label: highlight.label,
    };

    return (
      <div ref={ref} className={cn("h-full w-full", className)} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: shaded?.label ? 18 : 8, right: 16, bottom: 4, left: 4 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            {shaded && shaded.x2 > shaded.x1 && (
              <ReferenceArea
                x1={shaded.x1}
                x2={shaded.x2}
                fill="var(--muted-foreground)"
                fillOpacity={0.12}
                ifOverflow="hidden"
                label={
                  shaded.label
                    ? {
                        value: shaded.label,
                        position: "insideTopRight",
                        fill: "var(--muted-foreground)",
                        fontSize: 11,
                        dy: -16,
                      }
                    : undefined
                }
              />
            )}
            <XAxis
              type="number"
              dataKey="x"
              domain={[start, end]}
              ticks={time.ticks}
              tickFormatter={(t: number) => tickText(t, time.step, timeZone)}
              interval="equidistantPreserveStart"
              tick={tick}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              padding={{ left: 10, right: 14 }}
              allowDataOverflow
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[-0.6, lanes.length - 0.4]}
              ticks={lanes.map((_, i) => i)}
              reversed
              width={laneWidth}
              // A plain label on one line: the axis's own text would wrap a long name.
              tick={(p: { x: number; y: number; payload: { value: number } }) => (
                <text x={p.x - 6} y={p.y} dy={4} textAnchor="end" fontSize={12} fill="var(--muted-foreground)">
                  {lanes[p.payload.value]?.label ?? ""}
                </text>
              )}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={false}
              isAnimationActive={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const e = payload[0].payload as Point;
                return (
                  <div className="max-w-xs rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
                    <p className="font-semibold">{e.label}</p>
                    {e.detail && <div className="mt-0.5 text-muted-foreground">{e.detail}</div>}
                    <p className="mt-0.5 tabular-nums text-muted-foreground">
                      {fullTime(e.t, timeZone, timeZoneLabel)}
                    </p>
                    {onSelect && <p className="mt-1 text-text-tertiary">{selectHint}</p>}
                  </div>
                );
              }}
            />
            <Scatter
              data={data}
              isAnimationActive={false}
              onClick={(d: { payload?: Point; id?: string }) => {
                const id = d.payload?.id ?? d.id;
                if (id !== undefined) onSelect?.(id);
              }}
              shape={(p: { cx?: number; cy?: number; payload?: Point }) => {
                const e = p.payload;
                if (!e) return <g />;
                return (
                  <g style={onSelect ? { cursor: "pointer" } : undefined}>
                    {/* A hit target larger than the mark. */}
                    <circle cx={p.cx} cy={p.cy} r={12} fill="transparent" />
                    {e.id === selectedId && (
                      <circle cx={p.cx} cy={p.cy} r={10} fill="none" stroke="var(--foreground)" strokeWidth={1.5} />
                    )}
                    <circle
                      cx={p.cx}
                      cy={p.cy}
                      r={e.hollow ? 5 : 6}
                      fill={e.hollow ? "var(--card)" : color}
                      stroke={e.hollow ? color : "var(--card)"}
                      strokeWidth={2}
                    />
                  </g>
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  },
);
EventLaneChart.displayName = "EventLaneChart";

export { EventLaneChart };
