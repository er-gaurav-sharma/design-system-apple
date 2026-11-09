import * as React from "react";
import { ReviewStatusLabel } from "@claude-design/dashboard-ui";

/** The four statuses in a list. New is in full-strength text so it stands out. */
export const All = () => (
  <div className="flex flex-wrap items-center gap-5 text-[13px]">
    <ReviewStatusLabel status="new" />
    <ReviewStatusLabel status="reviewing" />
    <ReviewStatusLabel status="handled" />
    <ReviewStatusLabel status="dismissed" />
  </div>
);

/** With the one-line hint, as in a list of statuses to choose from. */
export const WithHints = () => (
  <div className="flex max-w-xs flex-col gap-3 text-[13px]">
    <ReviewStatusLabel status="new" showHint />
    <ReviewStatusLabel status="reviewing" showHint />
    <ReviewStatusLabel status="handled" showHint />
    <ReviewStatusLabel status="dismissed" showHint />
  </div>
);
