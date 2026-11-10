import * as React from "react";
import { ChartContainer, ChartLegend, StackedBarChart, type StackedBarSeries } from "@claude-design/dashboard-ui";

interface Bucket {
  t: number;
  blocked: number;
  review: number;
  allowed: number;
  unscored: number;
}

const HOUR = 3_600_000;
const START = Date.UTC(2026, 0, 14, 12);

/** Fixed sample counts, so the preview draws the same every time. */
const hourly: Bucket[] = [
  [1, 3, 6, 2], [0, 2, 5, 1], [2, 4, 7, 2], [1, 1, 4, 3], [0, 2, 3, 1], [1, 2, 2, 0],
  [0, 1, 2, 1], [0, 0, 1, 1], [1, 1, 2, 0], [0, 2, 3, 1], [2, 3, 5, 2], [3, 5, 8, 2],
  [4, 6, 9, 3], [2, 4, 8, 2], [3, 5, 6, 1], [5, 7, 9, 3], [4, 6, 7, 2], [2, 3, 6, 2],
  [1, 4, 5, 1], [3, 2, 6, 2], [2, 3, 4, 1], [1, 2, 3, 0], [0, 1, 3, 1], [1, 2, 2, 1],
].map(([blocked, review, allowed, unscored], i) => ({ t: START + i * HOUR, blocked, review, allowed, unscored }));

const series: StackedBarSeries<Bucket>[] = [
  { key: "blocked", label: "Blocked", color: "var(--error)" },
  { key: "review", label: "Held for review", color: "var(--warning)", texture: "hatch" },
  { key: "allowed", label: "Allowed", color: "var(--chart-2)" },
  { key: "unscored", label: "Not scored", color: "var(--text-tertiary)", texture: "lines" },
];

const hm = (t: number) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(t);

/**
 * 24 hourly bars, stacked by outcome, with the legend above. Two series are
 * textured so they read apart without colour. Axis labels thin out evenly on
 * a narrow screen.
 */
export const ByHour = () => (
  <ChartContainer title="Requests by outcome" asOf="2026-01-15 12:00 UTC" areaClassName="flex h-[300px] flex-col">
    <ChartLegend className="-mt-2 mb-3" items={series} />
    <div className="min-h-0 flex-1">
      <StackedBarChart
        data={hourly}
        series={series}
        xLabel={(b) => hm(b.t)}
        tooltipTitle={(b) => `${hm(b.t)} to ${hm(b.t + HOUR)} UTC`}
        formatTotal={(n) => `${n} requests`}
      />
    </div>
  </ChartContainer>
);

const daily: Bucket[] = Array.from({ length: 30 }, (_, i) => ({
  t: Date.UTC(2025, 11, 17 + i),
  blocked: (i * 7) % 5,
  review: 3 + ((i * 3) % 6),
  allowed: 8 + ((i * 5) % 9),
  unscored: (i * 2) % 3,
}));

/** 30 daily bars: the axis skips labels evenly so none collide. */
export const ByDay = () => (
  <ChartContainer title="Requests per day" areaClassName="h-[220px]">
    <StackedBarChart
      data={daily}
      series={series}
      xLabel={(b) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short" }).format(b.t)}
    />
  </ChartContainer>
);
