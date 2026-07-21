import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Info, CircleCheck, TriangleAlert, CircleX } from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative flex w-full items-start gap-3 rounded-md p-4 text-sm",
  {
    variants: {
      variant: {
        info: "bg-info-subtle [&>svg]:text-info",
        success: "bg-success-subtle [&>svg]:text-success",
        warning: "bg-warning-subtle [&>svg]:text-warning",
        error: "bg-error-subtle [&>svg]:text-error",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

const iconFor = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleX,
} as const;

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Hide the default leading status icon. */
  hideIcon?: boolean;
}

/**
 * Persistent, contextual message. Pair with AlertTitle / AlertDescription.
 * (For transient notifications use the Toaster / `toast` instead.)
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", hideIcon = false, children, ...props }, ref) => {
    const Icon = iconFor[variant ?? "info"];
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {!hideIcon && <Icon className="mt-0.5 size-[18px] shrink-0" aria-hidden="true" />}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    );
  },
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-semibold leading-snug text-foreground", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mt-0.5 text-sm leading-relaxed text-muted-foreground", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
