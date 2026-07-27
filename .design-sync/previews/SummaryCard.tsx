import * as React from "react";
import { SummaryCard } from "@claude-design/dashboard-ui";

/** The canonical KPI tile: label, metric, and a trend chip. */
export const Default = () => (
  <div className="grid grid-cols-2 gap-4">
    <SummaryCard
      label="Monthly recurring revenue"
      value="$48,290"
      trend="up"
      trendLabel="12.4% vs last month"
    />
    <SummaryCard
      label="Active workspaces"
      value="1,284"
      trend="up"
      trendLabel="86 added this month"
    />
  </div>
);

/** The trend axis. Direction drives both the glyph and the semantic color. */
export const Trends = () => (
  <div className="grid grid-cols-3 gap-4">
    <SummaryCard
      label="Weekly active users"
      value="9,431"
      trend="up"
      trendLabel="8.1% week over week"
    />
    <SummaryCard
      label="Churned accounts"
      value="37"
      trend="down"
      trendLabel="4.2% vs last week"
    />
    <SummaryCard
      label="Median session"
      value="6m 12s"
      trend="neutral"
      trendLabel="Unchanged"
    />
  </div>
);

/** Without a trend the card is just label + metric — fine for absolute counts. */
export const WithoutTrend = () => (
  <div className="grid grid-cols-2 gap-4">
    <SummaryCard label="Seats in use" value="312 / 400" />
    <SummaryCard label="Storage" value="1.8 TB" />
  </div>
);

/** Every non-ready data state. `error` renders a Retry button when onRetry is passed. */
export const DataStates = () => (
  <div className="grid grid-cols-3 gap-4">
    <SummaryCard label="Support tickets" state="loading" />
    <SummaryCard
      label="Refund requests"
      state="empty"
      emptyLabel="No requests this month"
    />
    <SummaryCard
      label="API error rate"
      state="error"
      onRetry={() => {}}
    />
  </div>
);
