import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-[26px] w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-input transition-colors duration-200 ease-standard",
      "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
      "disabled:cursor-not-allowed disabled:opacity-40",
      "data-[state=checked]:bg-primary",
      className,
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block size-[18px] rounded-full bg-thumb shadow-sm ring-0 transition-transform duration-200 ease-standard",
        "translate-x-0 data-[state=checked]:translate-x-[18px]",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
