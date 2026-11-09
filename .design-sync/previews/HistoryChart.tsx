import * as React from "react";
import { ChartContainer, HistoryChart } from "@claude-design/dashboard-ui";

const MIN = 60_000;
const NOW = Date.UTC(2026, 0, 15, 12, 0);
const band = (v: number) => (v >= 7 ? "Act" : v >= 4 ? "Review" : "Watch");
const one = (n: number) => n.toFixed(1);

const changes = [
  { t: NOW - 20 * 60 * MIN, value: 2.1, reason: "Opened: one detection from the firewall." },
  { t: NOW - 16 * 60 * MIN, value: 4.6, reason: "Three more detections from the firewall." },
  { t: NOW - 9 * 60 * MIN, value: 3.8, reason: "Older detections count for less." },
  { t: NOW - 3 * 60 * MIN, value: 8.2, reason: "The router flagged it too, so the score is scaled." },
  { t: NOW - 70 * MIN, value: 7.4, reason: "Older detections count for less." },
].map((p) => ({ ...p, label: band(p.value) }));

/**
 * A score over the last day as a stepped line, with the bands as dashed
 * lines. The line carries the last value to now. Hover a dot for the reason.
 */
export const ScoreOverTime = () => (
  <ChartContainer title="Score over the last 24 hours" asOf="2026-01-15 12:00 UTC" areaClassName="h-[240px]">
    <HistoryChart
      points={changes}
      start={NOW - 24 * 60 * MIN}
      end={NOW}
      endLabel="Now"
      yDomain={[0, 10]}
      yTicks={[0, 2, 4, 6, 8, 10]}
      thresholds={[
        { value: 4, label: "Review 4.0" },
        { value: 7, label: "Act 7.0" },
      ]}
      formatValue={one}
      timeZone="UTC"
      timeZoneLabel="UTC"
    />
  </ChartContainer>
);

/** A count with no thresholds: the value axis picks round steps on its own. */
export const Count = () => (
  <ChartContainer title="Open items" areaClassName="h-[200px]">
    <HistoryChart
      points={[
        { t: NOW - 6 * 60 * MIN, value: 12, reason: "Morning import." },
        { t: NOW - 4 * 60 * MIN, value: 31, reason: "A batch of 19 arrived." },
        { t: NOW - 150 * MIN, value: 24, reason: "7 closed." },
        { t: NOW - 40 * MIN, value: 9, reason: "15 closed." },
      ]}
      end={NOW}
      endLabel="Now"
      timeZone="UTC"
    />
  </ChartContainer>
);
