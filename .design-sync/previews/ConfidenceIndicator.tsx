import * as React from "react";
import { ConfidenceIndicator } from "@claude-design/dashboard-ui";

/** Three, two and one signal bars, each with its word. */
export const Levels = () => (
  <div className="flex flex-wrap items-center gap-6 text-[13px]">
    <ConfidenceIndicator level="high" />
    <ConfidenceIndicator level="medium" />
    <ConfidenceIndicator level="low" />
  </div>
);

/** Text size follows the parent, here for a figure in a page header. */
export const Larger = () => <ConfidenceIndicator level="medium" className="text-[15px] font-medium" />;
