import * as React from "react";
import { CircleCheck, CircleDashed, CircleX, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type StepState = "queued" | "running" | "done" | "failed";

export interface Step {
  id: string;
  label: React.ReactNode;
  state: StepState;
  /** Inline after the label, such as "running since 14:32". Defaults to "queued" or "running" for those states. */
  note?: React.ReactNode;
  /** A second line: the result of a finished step, or the error and next retry of a failed one. */
  detail?: React.ReactNode;
}

export interface StepListProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: Step[];
  /**
   * "full" lists each step with its detail. "compact" is a row of icons for a
   * table cell, each with a tooltip; it needs a TooltipProvider above it.
   * @default "full"
   */
  variant?: "full" | "compact";
}

const stateConfig: Record<StepState, { icon: typeof CircleCheck; className: string; word: string }> = {
  queued: { icon: CircleDashed, className: "text-muted-foreground", word: "queued" },
  running: { icon: Loader2, className: "animate-spin text-info motion-reduce:animate-none", word: "running" },
  done: { icon: CircleCheck, className: "text-success", word: "done" },
  failed: { icon: CircleX, className: "text-error", word: "failed" },
};

/**
 * Steps of a job that are queued, running, done or failed. Every state has
 * its own icon and word, so none relies on colour alone. The spinner stops
 * when the system asks for reduced motion.
 */
const StepList = React.forwardRef<HTMLOListElement, StepListProps>(
  ({ steps, variant = "full", className, ...props }, ref) => {
    if (variant === "compact") {
      return (
        <ol ref={ref} className={cn("inline-flex items-center gap-1", className)} {...props}>
          {steps.map((s) => {
            const C = stateConfig[s.state];
            return (
              <li key={s.id} className="flex">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      tabIndex={0}
                      className="flex rounded-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
                    >
                      <C.icon aria-hidden="true" className={cn("size-4", C.className)} />
                      <span className="sr-only">
                        {s.label}: {C.word}
                      </span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {s.label}: {s.detail ?? C.word}
                  </TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </ol>
      );
    }
    return (
      <ol ref={ref} className={cn("flex flex-col", className)} {...props}>
        {steps.map((s, i) => {
          const C = stateConfig[s.state];
          const note = s.note ?? (s.state === "queued" || s.state === "running" ? C.word : null);
          return (
            <li key={s.id} className="relative grid grid-cols-[22px_minmax(0,1fr)] gap-3 pb-3 last:pb-0">
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="absolute left-[10px] top-6 h-[calc(100%-20px)] w-px bg-border" />
              )}
              <C.icon aria-hidden="true" className={cn("mt-0.5 size-[18px]", C.className)} />
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-foreground">
                  {s.label}
                  {note ? (
                    <span className={cn("font-normal", s.state === "running" ? "text-info" : "text-muted-foreground")}>
                      {" "}
                      · {note}
                    </span>
                  ) : (
                    <span className="sr-only">: {C.word}</span>
                  )}
                </p>
                {s.detail && (
                  <p className={cn("text-xs", s.state === "failed" ? "text-error" : "text-muted-foreground")}>
                    {s.detail}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  },
);
StepList.displayName = "StepList";

export { StepList };
