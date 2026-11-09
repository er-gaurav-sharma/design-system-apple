import * as React from "react";
import { ChartContainer, ChartLegend, EventLaneChart } from "@claude-design/dashboard-ui";

const MIN = 60_000;
const NOW = Date.UTC(2026, 0, 15, 12, 0);

const lanes = [
  { id: "fw", label: "Firewall" },
  { id: "lb", label: "Load balancer" },
  { id: "rt", label: "Router" },
];

const events = [
  { id: "e1", lane: "fw", t: NOW - 330 * MIN, label: "Port scan", detail: "12 events" },
  { id: "e2", lane: "fw", t: NOW - 250 * MIN, label: "Port scan", detail: "4 events", hollow: true },
  { id: "e3", lane: "lb", t: NOW - 200 * MIN, label: "Malformed request", detail: "1 event" },
  { id: "e4", lane: "fw", t: NOW - 95 * MIN, label: "Connection denied", detail: "30 events", hollow: true },
  { id: "e5", lane: "rt", t: NOW - 48 * MIN, label: "Unusual route", detail: "2 events" },
  { id: "e6", lane: "fw", t: NOW - 22 * MIN, label: "Port scan", detail: "8 events" },
  { id: "e7", lane: "lb", t: NOW - 9 * MIN, label: "Failed sign-in", detail: "5 events" },
];

/**
 * Six hours of events, one lane per source. Rings were stopped at the source;
 * the shaded span is the last hour. Click a dot to select it.
 */
export const Default = () => {
  const [selected, setSelected] = React.useState<string | null>("e5");
  return (
    <div className="flex flex-col gap-3">
      <ChartContainer title="Events by source" asOf="2026-01-15 12:00 UTC" areaClassName="h-[156px]">
        <EventLaneChart
          lanes={lanes}
          events={events}
          start={NOW - 6 * 60 * MIN}
          end={NOW}
          highlight={{ start: NOW - 60 * MIN, end: NOW, label: "Last hour" }}
          selectedId={selected}
          onSelect={setSelected}
          selectHint="Click to show it below"
          timeZone="UTC"
          timeZoneLabel="UTC"
        />
      </ChartContainer>
      <ChartLegend
        className="px-1"
        items={[
          { label: "Seen", color: "var(--chart-1)", shape: "dot" },
          { label: "Stopped at the source", color: "var(--chart-1)", shape: "ring" },
          { label: "Last hour", color: "var(--muted-foreground)", shape: "band" },
        ]}
      />
      <p className="px-1 text-xs text-muted-foreground">
        Selected: {events.find((e) => e.id === selected)?.label ?? "none"}
      </p>
    </div>
  );
};

/** A quiet lane stays in place, so a source that saw nothing reads as empty, not missing. */
export const QuietLane = () => (
  <ChartContainer title="Events in the last hour" areaClassName="h-[156px]">
    <EventLaneChart
      lanes={lanes}
      events={events}
      start={NOW - 60 * MIN}
      end={NOW}
      timeZone="UTC"
    />
  </ChartContainer>
);
