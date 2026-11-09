import * as React from "react";
import { StepList, TooltipProvider } from "@claude-design/dashboard-ui";

const steps = [
  { id: "fetch", label: "Fetch records", state: "done" as const, detail: "1,204 records · 09:12:04 · 820 ms" },
  { id: "enrich", label: "Look up owners", state: "done" as const, detail: "All matched · 09:12:05 · 1.4 s" },
  { id: "score", label: "Score", state: "running" as const, note: "running since 09:12:06" },
  { id: "notify", label: "Notify", state: "queued" as const },
];

const failed = [
  steps[0],
  { id: "enrich", label: "Look up owners", state: "failed" as const, detail: "The directory timed out. Attempt 2, next retry at 09:17." },
  { id: "score", label: "Score", state: "queued" as const },
];

/** The full list: what each step found, or why it failed and when it retries. */
export const Full = () => (
  <div className="grid gap-8 md:grid-cols-2">
    <StepList steps={steps} />
    <StepList steps={failed} />
  </div>
);

/** compact: a row of icons for a table cell. Hover or focus one for its detail. */
export const Compact = () => (
  <TooltipProvider>
    <div className="flex flex-col gap-3">
      <StepList variant="compact" steps={steps} aria-label="Job steps" />
      <StepList variant="compact" steps={failed} aria-label="Job steps" />
    </div>
  </TooltipProvider>
);
