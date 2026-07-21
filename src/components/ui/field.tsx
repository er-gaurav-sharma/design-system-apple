import * as React from "react";
import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

/** Vertical field wrapper: <Field><Label/><Input/><FieldError/></Field>. */
const Field = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props} />
  ),
);
Field.displayName = "Field";

const FieldHelper = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-xs text-text-tertiary", className)} {...props} />
));
FieldHelper.displayName = "FieldHelper";

const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("flex items-center gap-1.5 text-xs text-error", className)}
    {...props}
  >
    <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
    {children}
  </p>
));
FieldError.displayName = "FieldError";

export { Field, FieldHelper, FieldError };
