import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import { ChartPattern } from "@/components/dashboard/chart-legend";

export interface WaterfallStep {
  /** The row's name on the axis. Keep labels unique; each names its row. */
  label: string;
  /** How much the step changes the running total, or the total itself for a "total" step. */
  value: number;
  /**
   * How the step is drawn.
   * - "add" (the default): a solid bar. A negative value takes away.
   * - "multiply": hatched, for a step that scales the running total, such
   *   as ×1.5. Its value is the amount the scaling adds.
   * - "cap": thin grey lines, for a limit that takes the total down.
   * - "total": a solid bar from zero, with its label and value in bold.
   *   The running total carries on from it.
   */
  kind?: "add" | "multiply" | "cap" | "total";
  /** A line of explanation in the tooltip. */
  detail?: React.ReactNode;
}

export interface WaterfallChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Top to bottom. */
  steps: WaterfallStep[];
  /** Dashed lines across the chart at these values, labelled at the top. */
  thresholds?: { value: number; label: string }[];
  /** The axis runs to at least this value, and further when a step goes past it. */
  axisMax?: number;
  /** How values are written. @default n.toLocaleString() */
  formatValue?: (value: number) => string;
  /** The bars' colour. @default "var(--chart-1)" */
  color?: string;
  /** The width of the label column, in pixels. @default 140 */
  labelWidth?: number;
}

interface Row extends WaterfallStep {
  range: [number, number];
  shown: string;
}

const tick = { fill: "var(--text-tertiary)", fontSize: 11 };

/** A step of 1, 2, 2.5 or 5 times a power of ten that gives at most about eight ticks. */
function niceStep(span: number) {
  const raw = span / 8;
  const power = 10 ** Math.floor(Math.log10(raw));
  const m = raw / power;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * power;
}

/**
 * Horizontal steps that add up to a total, such as how a score was built: each
 * bar starts where the last one ended. Scaling steps are hatched and caps are
 * lined, so neither relies on colour. The change is written beside each bar,
 * and the tooltip adds the step's detail. Fills the height of its parent, such
 * as a ChartContainer's area; allow about 40px a step. Pair it with a table of
 * the same steps for screen readers.
 */
const WaterfallChart = React.forwardRef<HTMLDivElement, WaterfallChartProps>(
  (
    {
      steps,
      thresholds = [],
      axisMax = 0,
      formatValue = (n) => n.toLocaleString(),
      color = "var(--chart-1)",
      labelWidth = 140,
      className,
      ...props
    },
    ref,
  ) => {
    const uid = React.useId().replace(/[^\w-]/g, "");
    const rows = React.useMemo<Row[]>(() => {
      let run = 0;
      return steps.map((s) => {
        if (s.kind === "total") {
          run = s.value;
          return { ...s, range: [Math.min(0, s.value), Math.max(0, s.value)], shown: formatValue(s.value) };
        }
        const start = run;
        run += s.value;
        return {
          ...s,
          range: [Math.min(start, run), Math.max(start, run)],
          shown: s.value < 0 ? `\u2212${formatValue(-s.value)}` : `+${formatValue(s.value)}`,
        };
      });
    }, [steps, formatValue]);

    const lo = Math.min(0, ...rows.map((r) => r.range[0]));
    const hi = Math.max(axisMax, ...rows.map((r) => r.range[1]), ...thresholds.map((t) => t.value));
    const step = niceStep(hi - lo || 1);
    const min = Math.floor(lo / step) * step;
    const max = Math.ceil(hi / step) * step;
    const ticks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) =>
      Number((min + i * step).toFixed(10)),
    );
    const sortedThresholds = [...thresholds].sort((a, b) => a.value - b.value);
    const isTotal = (label: string) => rows.find((r) => r.label === label)?.kind === "total";

    return (
      <div ref={ref} className={cn("h-full w-full", className)} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: thresholds.length ? 22 : 8, right: 44, bottom: 4, left: 4 }}
            barCategoryGap={10}
          >
            <defs>
              <ChartPattern id={`${uid}-multiply`} texture="hatch" color={color} />
              <ChartPattern id={`${uid}-cap`} texture="lines" color="var(--text-tertiary)" />
            </defs>
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis
              type="number"
              domain={[min, max]}
              ticks={ticks}
              tickFormatter={(v: number) => formatValue(v)}
              interval="equidistantPreserveStart"
              tick={tick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={labelWidth}
              axisLine={false}
              tickLine={false}
              tick={(p: { x: number; y: number; payload: { value: string } }) => {
                const total = isTotal(p.payload.value);
                return (
                  <text
                    x={p.x - 6}
                    y={p.y}
                    dy={4}
                    textAnchor="end"
                    fontSize={12.5}
                    fontWeight={total ? 600 : 400}
                    fill={total ? "var(--foreground)" : "var(--muted-foreground)"}
                  >
                    {p.payload.value}
                  </text>
                );
              }}
            />
            {sortedThresholds.map((t, i, all) => {
              // Two or more labels splay outwards from their lines, so close
              // thresholds on a narrow chart don't print over each other.
              const anchor =
                all.length === 1 ? "middle" : i === 0 ? "end" : i === all.length - 1 ? "start" : "middle";
              return (
                <ReferenceLine
                  key={t.label}
                  x={t.value}
                  stroke="var(--text-tertiary)"
                  strokeDasharray="3 3"
                  label={(p: { viewBox?: { x?: number; y?: number } }) => (
                    <text
                      x={(p.viewBox?.x ?? 0) + (anchor === "end" ? 4 : anchor === "start" ? -4 : 0)}
                      y={(p.viewBox?.y ?? 0) - 7}
                      textAnchor={anchor}
                      fontSize={11}
                      fill="var(--text-tertiary)"
                    >
                      {t.label}
                    </text>
                  )}
                />
              );
            })}
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.6 }}
              isAnimationActive={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload as Row;
                const change =
                  row.kind === "total"
                    ? row.shown
                    : row.value < 0
                      ? `takes off ${formatValue(-row.value)}`
                      : `adds ${formatValue(row.value)}`;
                return (
                  <div className="max-w-xs rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
                    <p className="font-semibold">
                      {row.label} <span className="tabular-nums text-muted-foreground">{change}</span>
                    </p>
                    {row.detail && <p className="mt-0.5 text-muted-foreground">{row.detail}</p>}
                  </div>
                );
              }}
            />
            <Bar dataKey="range" barSize={16} radius={3} isAnimationActive={false}>
              {rows.map((r) => (
                <Cell
                  key={r.label}
                  fill={
                    r.kind === "multiply"
                      ? `url(#${uid}-multiply)`
                      : r.kind === "cap"
                        ? `url(#${uid}-cap)`
                        : color
                  }
                  stroke={r.kind === "multiply" ? color : r.kind === "cap" ? "var(--text-tertiary)" : undefined}
                  strokeWidth={r.kind === "multiply" || r.kind === "cap" ? 1 : 0}
                />
              ))}
              <LabelList
                dataKey="shown"
                content={(p: {
                  x?: number | string;
                  y?: number | string;
                  width?: number | string;
                  height?: number | string;
                  value?: number | string;
                  index?: number;
                }) => {
                  const total = rows[p.index ?? 0]?.kind === "total";
                  return (
                    <text
                      x={Number(p.x) + Number(p.width) + 6}
                      y={Number(p.y) + Number(p.height) / 2 + 4}
                      fontSize={12}
                      fontWeight={total ? 600 : 500}
                      fill={total ? "var(--foreground)" : "var(--muted-foreground)"}
                      className="tabular-nums"
                    >
                      {p.value}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  },
);
WaterfallChart.displayName = "WaterfallChart";

export { WaterfallChart };
