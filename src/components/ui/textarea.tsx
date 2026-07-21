import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[88px] w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground transition-[color,box-shadow,border-color] ease-standard",
        "placeholder:text-text-tertiary",
        "hover:border-text-tertiary",
        "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:text-text-tertiary",
        "aria-[invalid=true]:border-error aria-[invalid=true]:focus-visible:ring-error/20",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
