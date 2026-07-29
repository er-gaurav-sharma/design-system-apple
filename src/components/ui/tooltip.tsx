import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

/**
 * Wrap the app (or a subtree) once. Radix requires a provider above every
 * Tooltip, and hoisting it is what makes the shared open/close delay work
 * across neighbouring tooltips instead of each one waiting out its own.
 */
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipPortal = TooltipPrimitive.Portal;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    /** Render the little pointer at the trigger. @default true */
    showArrow?: boolean;
  }
>(({ className, sideOffset = 6, showArrow = true, children, ...props }, ref) => (
  <TooltipPortal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        // Above Dialog (z-[1300]) on purpose: a tooltip on a control inside a
        // modal has to win, and it never traps interaction anyway.
        "z-[1400] max-w-xs rounded-sm bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md",
        "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
        className,
      )}
      {...props}
    >
      {children}
      {showArrow && <TooltipPrimitive.Arrow className="fill-foreground" width={11} height={5} />}
    </TooltipPrimitive.Content>
  </TooltipPortal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipPortal };
