import * as React from "react";
import { RelativeTime, TooltipProvider } from "@claude-design/dashboard-ui";

const now = Date.parse("2024-05-15T09:30:00Z");

/** Hover or focus one for the full date and time. `now` fixes the clock for this preview. */
export const Default = () => (
  <TooltipProvider>
    <ul className="flex flex-col gap-2 text-[13px]">
      <li>Last event <RelativeTime value={now - 20_000} now={now} /></li>
      <li>Last read <RelativeTime value={now - 12 * 60_000} now={now} /></li>
      <li>Registered <RelativeTime value={now - 3 * 3600_000} now={now} /></li>
      <li>Created <RelativeTime value={now - 9 * 86400_000} now={now} /></li>
    </ul>
  </TooltipProvider>
);

/** The full time is shown in the zone you pass, with the label you give it. */
export const InATimeZone = () => (
  <TooltipProvider>
    <p className="text-[13px]">
      Last sign-in{" "}
      <RelativeTime value={now - 45 * 60_000} now={now} timeZone="Asia/Tokyo" timeZoneLabel="JST" />
    </p>
  </TooltipProvider>
);
