import * as React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";
import { ChartPattern, ChartSwatch, type ChartTexture } from "@/components/dashboard/chart-legend";

export interface StackedBarSeries<T extends object = Record<string, unknown>> {
  /** The field of each row that holds this series' count. */
  key: keyof T & string;
  label: string;
  /** A CSS colour: a --chart-* token, or a status token when the series is a status. */
  color: string;
  /** Draw this series with a texture, so it reads apart without colour. */
  texture?: ChartTexture;
}

export interface StackedBarChartProps<T extends object = Record<string, unknown>>
  extends React.HTMLAttributes<HTMLDivElement> {
  /** One row per bar, in order along the axis. */
  data: readonly T[];
  /** Stacked from the bottom up, in this order. Pass the same list to a ChartLegend. */
  series: StackedBarSeries<T>[];
  /** The short text under a bar, such as "14:00". Labels that would collide are skipped evenly. */
  xLabel: (row: T) => string;
  /** The tooltip's first line, such as the bar's full time span. @default xLabel */
  tooltipTitle?: (row: T) => React.ReactNode;
  /** The tooltip's total line. @default `${total} in total` */
  formatTotal?: (total: number) => React.ReactNode;
  /** How counts are written. @default n.toLocaleString() */
  formatValue?: (value: number) => string;
}

const tick = { fill: "var(--text-tertiary)", fontSize: 11 };

/** A whole step of 1, 2 or 5 times a power of ten that gives about five ticks. */
function niceStep(peak: number) {
  const raw = peak / 5;
  const power = 10 ** Math.floor(Math.log10(raw));
  const m = raw / power;
  return Math.max(1, Math.round((m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * power));
}

function StackedBarChartInner<T extends object>(
  {
    data,
    series,
    xLabel,
    tooltipTitle = xLabel,
    formatTotal,
    formatValue = (n) => n.toLocaleString(),
    className,
    ...props
  }: StackedBarChartProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const uid = React.useId().replace(/[^\w-]/g, "");
  const valueOf = (row: T, key: keyof T) => Number(row[key]) || 0;
  const rows = React.useMemo(() => data.map((row, i) => ({ ...row, __i: i })), [data]);
  const peak = Math.max(1, ...data.map((row) => series.reduce((sum, s) => sum + valueOf(row, s.key), 0)));
  const total = formatTotal ?? ((n: number) => `${formatValue(n)} in total`);
  const step = niceStep(peak);
  const top = Math.ceil(peak / step) * step;
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);

  return (
    <div ref={ref} className={cn("h-full w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="18%">
          <defs>
            {series.map(
              (s, i) =>
                s.texture && (
                  <ChartPattern key={s.key} id={`${uid}-${i}`} texture={s.texture} color={s.color} />
                ),
            )}
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="__i"
            tickFormatter={(i: number) => (data[i] ? xLabel(data[i]) : "")}
            interval="equidistantPreserveStart"
            tick={tick}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, top]}
            ticks={ticks}
            tickFormatter={(v: number) => formatValue(v)}
            tick={tick}
            width={Math.max(32, formatValue(top).length * 7 + 10)}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.6 }}
            isAnimationActive={false}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = data[(payload[0].payload as { __i: number }).__i];
              if (!row) return null;
              const sum = series.reduce((n, s) => n + valueOf(row, s.key), 0);
              return (
                <div className="max-w-xs rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
                  <p className="tabular-nums text-muted-foreground">{tooltipTitle(row)}</p>
                  <p className="mt-0.5 font-semibold tabular-nums">{total(sum)}</p>
                  <ul className="mt-1 space-y-0.5">
                    {series.map((s) => (
                      <li key={s.key} className="flex items-center justify-between gap-4 tabular-nums">
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <ChartSwatch color={s.color} texture={s.texture} />
                          {s.label}
                        </span>
                        <span>{formatValue(valueOf(row, s.key))}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }}
          />
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stackId="stack"
              fill={s.texture ? `url(#${uid}-${i})` : s.color}
              stroke={s.texture ? s.color : "var(--card)"}
              strokeWidth={1}
              maxBarSize={28}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Bars per time bucket, split into stacked series, with a tooltip per bar
 * that lists every series and the total. A series can be textured so it
 * reads apart without colour. Fills the height of its parent, such as a
 * ChartContainer's area. Pair it with a ChartLegend, and with a table view
 * for screen readers.
 */
const StackedBarChart = React.forwardRef(StackedBarChartInner) as (<T extends object>(
  props: StackedBarChartProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null) & { displayName?: string };
StackedBarChart.displayName = "StackedBarChart";

export { StackedBarChart };
