import * as React from "react";
import { CircleCheck, CircleDot, CircleSlash, Eye, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** Where a person's review of an item stands. */
export type ReviewStatus = "new" | "reviewing" | "handled" | "dismissed";

/** The default word and one-line hint for each status, for use in running text such as a dialog. */
export const reviewStatusText: Record<ReviewStatus, { label: string; hint: string }> = {
  new: { label: "New", hint: "Nobody has looked at it yet" },
  reviewing: { label: "Reviewing", hint: "Someone is looking at it" },
  handled: { label: "Handled", hint: "Dealt with outside the dashboard" },
  dismissed: { label: "Dismissed", hint: "A false positive" },
};

const statusIcon: Record<ReviewStatus, LucideIcon> = {
  new: CircleDot,
  reviewing: Eye,
  handled: CircleCheck,
  dismissed: CircleSlash,
};

export interface ReviewStatusLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: ReviewStatus;
  /** Replaces the default word. */
  label?: React.ReactNode;
  /** Show the one-line hint under the word, such as in a list of statuses to pick from. */
  showHint?: boolean;
  /** Replaces the default hint. */
  hint?: React.ReactNode;
}

/**
 * New, Reviewing, Handled or Dismissed, each with its own icon. New is set in
 * full-strength text so unreviewed items stand out in a list; the others are
 * quieter.
 */
const ReviewStatusLabel = React.forwardRef<HTMLSpanElement, ReviewStatusLabelProps>(
  ({ status, label, showHint = false, hint, className, ...props }, ref) => {
    const Icon = statusIcon[status];
    const text = reviewStatusText[status];
    const word = label ?? text.label;
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex gap-1.5",
          showHint ? "items-start" : "items-center whitespace-nowrap",
          status === "new" ? "font-medium text-foreground" : "text-muted-foreground",
          className,
        )}
        {...props}
      >
        <Icon
          className={cn("size-4 shrink-0 text-muted-foreground", showHint && "mt-px")}
          aria-hidden="true"
        />
        {showHint ? (
          <span className="flex min-w-0 flex-col gap-0.5">
            <span>{word}</span>
            <span className="text-xs font-normal text-muted-foreground">{hint ?? text.hint}</span>
          </span>
        ) : (
          word
        )}
      </span>
    );
  },
);
ReviewStatusLabel.displayName = "ReviewStatusLabel";

export { ReviewStatusLabel };
