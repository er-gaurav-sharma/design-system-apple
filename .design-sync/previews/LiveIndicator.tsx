import * as React from "react";
import { LiveIndicator } from "@claude-design/dashboard-ui";

/** The three states. Offline shows when data last arrived. */
export const States = () => (
  <div className="flex flex-col items-start gap-3">
    <LiveIndicator state="live" />
    <LiveIndicator state="reconnecting" />
    <LiveIndicator state="offline" lastUpdate="14:32" />
  </div>
);
