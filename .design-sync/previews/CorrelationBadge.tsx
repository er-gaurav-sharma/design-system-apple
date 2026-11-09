import * as React from "react";
import { CorrelationBadge, TooltipProvider } from "@claude-design/dashboard-ui";

/** Hover or tab to the badge for the rule. */
export const Default = () => (
  <TooltipProvider>
    <CorrelationBadge />
  </TooltipProvider>
);

/** The rule's wording is a prop, so a scoring change needs no library release. */
export const CustomRule = () => (
  <TooltipProvider>
    <CorrelationBadge tooltip="Two different sources flagged it within 30 min (score ×2)" />
  </TooltipProvider>
);

/** tooltip={null}: a plain badge that takes no focus, for a table that explains it once. */
export const NoTooltip = () => <CorrelationBadge tooltip={null} />;
