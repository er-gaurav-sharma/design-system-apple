import * as React from "react";
import {
  ChartContainer,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@claude-design/dashboard-ui";

/**
 * A minimal inline chart. The container is chart-library agnostic — it gives you
 * a titled card and a sized area; mount Recharts/visx/etc. as children and color
 * series with the --chart-1..6 tokens.
 */
const Sparkline = () => (
  <svg viewBox="0 0 320 200" preserveAspectRatio="none" className="h-full w-full">
    {[40, 80, 120, 160].map((y) => (
      <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="var(--border)" strokeWidth="1" />
    ))}
    <polyline
      fill="none"
      stroke="var(--chart-1, var(--primary))"
      strokeWidth="2.5"
      points="0,170 40,150 80,158 120,120 160,104 200,112 240,70 280,56 320,28"
    />
    <polyline
      fill="none"
      stroke="var(--chart-2, var(--muted-foreground))"
      strokeWidth="2.5"
      strokeDasharray="4 4"
      points="0,182 40,176 80,168 120,160 160,150 200,146 240,132 280,124 320,110"
    />
  </svg>
);

const SERIES = [
  { token: "var(--chart-1)", label: "ip", points: "0,168 53,150 106,156 160,118 213,106 266,72 320,34" },
  { token: "var(--chart-2)", label: "domain", points: "0,178 53,170 106,164 160,152 213,146 266,130 320,116" },
  { token: "var(--chart-3)", label: "md5", points: "0,186 53,172 106,178 160,158 213,164 266,140 320,132" },
  { token: "var(--chart-4)", label: "sha1", points: "0,150 53,158 106,138 160,142 213,120 266,124 320,98" },
  { token: "var(--chart-5)", label: "sha256", points: "0,192 53,182 106,186 160,170 213,176 266,158 320,150" },
  { token: "var(--chart-6)", label: "sha512", points: "0,130 53,124 106,110 160,114 213,92 266,86 320,64" },
];

/**
 * Six categorical series, one per --chart-* token. The tokens are picked to stay
 * separable under the common colour-vision deficiencies, so hue alone can carry
 * the category.
 */
const MultiSeries = () => (
  <div className="flex h-full w-full flex-col gap-3">
    <svg viewBox="0 0 320 200" preserveAspectRatio="none" className="min-h-0 w-full flex-1">
      {[40, 80, 120, 160].map((y) => (
        <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="var(--border)" strokeWidth="1" />
      ))}
      {SERIES.map((series) => (
        <polyline
          key={series.label}
          fill="none"
          stroke={series.token}
          strokeWidth="2.5"
          points={series.points}
        />
      ))}
    </svg>
    <div className="flex flex-none flex-wrap items-center gap-x-4 gap-y-1.5">
      {SERIES.map((series) => (
        <span
          key={series.label}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: series.token }}
            aria-hidden="true"
          />
          {series.label}
        </span>
      ))}
    </div>
  </div>
);

/** The ready state: title, "data as of" stamp, and a chart in the area. */
export const Default = () => (
  <ChartContainer title="Monthly recurring revenue" asOf="15 May 2024, 09:00 UTC">
    <Sparkline />
  </ChartContainer>
);

/** The toolbar slot holds range selectors or other controls. */
export const WithToolbar = () => (
  <ChartContainer
    title="API requests"
    asOf="15 May 2024, 09:00 UTC"
    toolbar={
      <Select defaultValue="30d">
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="90d">Last 90 days</SelectItem>
        </SelectContent>
      </Select>
    }
  >
    <Sparkline />
  </ChartContainer>
);

/** Six series, one per chart token — the full categorical range. */
export const SixSeries = () => (
  <ChartContainer title="Indicators by type" asOf="15 May 2024, 09:00 UTC">
    <MultiSeries />
  </ChartContainer>
);

/** `loading` fills the chart area with a Skeleton of the same height. */
export const Loading = () => (
  <ChartContainer title="Retention cohort" asOf="15 May 2024, 09:00 UTC" state="loading" />
);

/** `empty` explains the gap and suggests a next step. */
export const Empty = () => (
  <ChartContainer
    title="Refund volume"
    state="empty"
    emptyLabel="No refunds in this range"
  />
);

/** `error` renders a Retry button when `onRetry` is supplied. */
export const ErrorState = () => (
  <ChartContainer title="Error rate" state="error" onRetry={() => {}} />
);
