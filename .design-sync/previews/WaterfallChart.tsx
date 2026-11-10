import * as React from "react";
import { ChartContainer, ChartLegend, WaterfallChart } from "@claude-design/dashboard-ui";

const one = (n: number) => n.toFixed(1);

/**
 * A score built in steps: two that add, a hatched step that scales the total,
 * a lined cap that takes it back to the limit, and the total. Dashed lines
 * mark the bands. The legend names the three kinds of step.
 */
export const ScoreBreakdown = () => (
  <ChartContainer
    title="How the score was built"
    asOf="2026-01-15 12:00 UTC"
    areaClassName="h-[230px]"
    toolbar={
      <ChartLegend
        className="justify-end pt-1"
        items={[
          { label: "Adds", color: "var(--chart-1)" },
          { label: "Two sources", color: "var(--chart-1)", texture: "hatch" },
          { label: "Cap", color: "var(--text-tertiary)", texture: "lines" },
        ]}
      />
    }
  >
    <WaterfallChart
      formatValue={one}
      axisMax={10}
      thresholds={[
        { value: 4, label: "Review 4.0" },
        { value: 7, label: "Act 7.0" },
      ]}
      steps={[
        { label: "Own signals", value: 5.6, detail: "Three detections in the last hour, capped at 8.0." },
        { label: "Reputation", value: 1.8, detail: "Listed by two of four reputation feeds." },
        { label: "Two sources ×1.5", value: 3.7, kind: "multiply", detail: "Two sources flagged it within an hour." },
        { label: "Cap at 10.0", value: -1.1, kind: "cap", detail: "Scores stop at 10.0." },
        { label: "Score", value: 10, kind: "total", detail: "Above Act 7.0." },
      ]}
    />
  </ChartContainer>
);

/** Plain adds and takes, no thresholds. Values use the default number format. */
export const Simple = () => (
  <ChartContainer title="Monthly budget" areaClassName="h-[200px]">
    <WaterfallChart
      steps={[
        { label: "Opening balance", value: 1200, kind: "total" },
        { label: "Licences", value: -420, detail: "Annual renewals due this month." },
        { label: "Hosting", value: -310 },
        { label: "Refund", value: 140, detail: "Unused seats from last quarter." },
        { label: "Closing balance", value: 610, kind: "total" },
      ]}
    />
  </ChartContainer>
);
