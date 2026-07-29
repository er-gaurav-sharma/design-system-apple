import * as React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Button,
} from "@claude-design/dashboard-ui";
import { CircleHelp, Copy, Trash2 } from "lucide-react";

/** Every Tooltip needs a TooltipProvider above it. */
export const Default = () => (
  <TooltipProvider>
    <Tooltip open>
      <TooltipTrigger asChild>
        <Button variant="secondary">Retry sync</Button>
      </TooltipTrigger>
      <TooltipContent>Re-runs the last failed batch</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

/** Naming an icon-only control — the case that actually needs a tooltip. */
export const OnIconButton = () => (
  <TooltipProvider>
    <div className="flex items-center gap-2">
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="icon" aria-label="Copy ID">
            <Copy />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Copy ID</TooltipContent>
      </Tooltip>
      <Button variant="secondary" size="icon" aria-label="Delete">
        <Trash2 />
      </Button>
    </div>
  </TooltipProvider>
);

/** Long copy wraps at max-w-xs; the arrow can be turned off. */
export const LongCopy = () => (
  <TooltipProvider>
    <Tooltip open>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          Retention <CircleHelp className="size-3.5" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="right" showArrow={false}>
        Share of users active in the 28 days after signup. Excludes accounts deleted
        inside the window.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
