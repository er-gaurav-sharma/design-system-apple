import * as React from "react";
import { ChartLegend, ChartPattern } from "@claude-design/dashboard-ui";

/** Plain and textured series. A textured swatch keeps a solid edge in its colour. */
export const Series = () => (
  <ChartLegend
    items={[
      { label: "Blocked", color: "var(--error)" },
      { label: "Held for review", color: "var(--warning)", texture: "hatch" },
      { label: "Allowed", color: "var(--chart-2)" },
      { label: "Not scored", color: "var(--text-tertiary)", texture: "lines" },
    ]}
  />
);

/** Shapes to match the mark: a dot and a ring for points, a line, and a band for a shaded span. */
export const Shapes = () => (
  <ChartLegend
    items={[
      { label: "Seen", color: "var(--chart-1)", shape: "dot" },
      { label: "Stopped", color: "var(--chart-1)", shape: "ring" },
      { label: "Trend", color: "var(--chart-5)", shape: "line" },
      { label: "Related-events window", color: "var(--muted-foreground)", shape: "band" },
    ]}
  />
);

/** The two textures as fills for any SVG: put ChartPattern in <defs> and fill with url(#id). */
export const Textures = () => (
  <svg width="232" height="48" role="img" aria-label="The hatch and lines textures">
    <defs>
      <ChartPattern id="preview-hatch" texture="hatch" color="var(--chart-1)" />
      <ChartPattern id="preview-lines" texture="lines" color="var(--text-tertiary)" />
    </defs>
    <rect x="0.5" y="0.5" width="108" height="47" rx="4" fill="url(#preview-hatch)" stroke="var(--chart-1)" />
    <rect x="122.5" y="0.5" width="108" height="47" rx="4" fill="url(#preview-lines)" stroke="var(--text-tertiary)" />
  </svg>
);
