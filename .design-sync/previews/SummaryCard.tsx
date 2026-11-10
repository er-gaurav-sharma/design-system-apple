import * as React from "react";
import { CircleAlert, Clock, Users } from "lucide-react";
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

/** An icon before the label. Color it with a text token class. */
export const WithIcon = () => (
  <div className="grid grid-cols-2 gap-4">
    <SummaryCard
      label="Active users"
      icon={<Users className="text-info" />}
      value="9,431"
    />
    <SummaryCard
      label="Overdue invoices"
      icon={<CircleAlert className="text-error" />}
      value="4"
    />
  </div>
);

/**
 * The link form: `asChild` with an `<a href>` (or a router `<Link>`) as the only
 * child. The whole card opens the link, lifts on hover, takes the focus ring
 * and shows an arrow. Put the link's own label on the child.
 */
export const AsLink = () => (
  <div className="grid grid-cols-2 gap-4">
    <SummaryCard
      asChild
      label="Pending invoices"
      icon={<Clock className="text-warning" />}
      value="18"
    >
      <a href="#pending" aria-label="Show the 18 pending invoices" />
    </SummaryCard>
    <SummaryCard
      asChild
      label="Overdue invoices"
      icon={<CircleAlert className="text-error" />}
      value="4"
      trend="neutral"
      trendLabel="Same as last week"
    >
      <a href="#overdue" aria-label="Show the 4 overdue invoices" />
    </SummaryCard>
  </div>
);
