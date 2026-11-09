import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Checkbox built on Radix Checkbox. `checked="indeterminate"` (or
 * `defaultChecked="indeterminate"`) is the "some selected" state of a parent,
 * such as a header checkbox over partly selected rows: a dash on a filled box,
 * so it never reads as unchecked or as all selected.
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer size-5 shrink-0 rounded-[6px] border-[1.5px] border-input bg-background transition-colors ease-standard",
      "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
      "disabled:cursor-not-allowed disabled:opacity-40",
      "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
      className,
    )}
    {...props}
  >
    {/* The indicator carries the same data-state as the root. Switching icons on
        it, rather than on the `checked` prop, keeps uncontrolled use working.
        The group is named so an ancestor's own `group` can't reach in. */}
    <CheckboxPrimitive.Indicator className="group/indicator flex items-center justify-center text-current">
      <Check
        className="size-3.5 group-data-[state=indeterminate]/indicator:hidden"
        strokeWidth={3}
      />
      <Minus
        className="hidden size-3.5 group-data-[state=indeterminate]/indicator:block"
        strokeWidth={3}
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
