import * as React from "react";
import { Calendar } from "@claude-design/dashboard-ui";

/** Fixed dates keep the preview deterministic across renders. */
const MARCH = new Date(2026, 2, 1);

/** Single-date selection. */
export const Default = () => (
  <Calendar
    mode="single"
    defaultMonth={MARCH}
    selected={new Date(2026, 2, 12)}
    className="rounded-md border border-border bg-card"
  />
);

/** Range selection — the tint runs edge to edge between the two ends. */
export const Range = () => (
  <Calendar
    mode="range"
    defaultMonth={MARCH}
    selected={{ from: new Date(2026, 2, 9), to: new Date(2026, 2, 20) }}
    className="rounded-md border border-border bg-card"
  />
);

/** Two months side by side, with weekends unselectable. */
export const TwoMonthsWithDisabledDays = () => (
  <Calendar
    mode="range"
    numberOfMonths={2}
    defaultMonth={MARCH}
    selected={{ from: new Date(2026, 2, 16), to: new Date(2026, 3, 3) }}
    disabled={{ dayOfWeek: [0, 6] }}
    className="rounded-md border border-border bg-card"
  />
);
