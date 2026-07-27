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
 * series with the --chart-1..4 tokens.
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
