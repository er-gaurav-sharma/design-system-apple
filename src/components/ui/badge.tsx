import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium leading-normal",
  {
    variants: {
      variant: {
        neutral: "",
        success: "",
        warning: "",
        error: "",
        info: "",
      },
      appearance: {
        subtle: "",
        solid: "",
      },
    },
    compoundVariants: [
      { variant: "neutral", appearance: "subtle", className: "bg-muted text-secondary-foreground" },
      { variant: "success", appearance: "subtle", className: "bg-success-subtle text-success" },
      { variant: "warning", appearance: "subtle", className: "bg-warning-subtle text-warning" },
      { variant: "error", appearance: "subtle", className: "bg-error-subtle text-error" },
      { variant: "info", appearance: "subtle", className: "bg-info-subtle text-info" },
      { variant: "neutral", appearance: "solid", className: "bg-muted-foreground text-white" },
      { variant: "success", appearance: "solid", className: "bg-success text-success-foreground" },
      { variant: "warning", appearance: "solid", className: "bg-warning text-warning-foreground" },
      { variant: "error", appearance: "solid", className: "bg-error text-error-foreground" },
      { variant: "info", appearance: "solid", className: "bg-info text-info-foreground" },
    ],
    defaultVariants: {
      variant: "neutral",
      appearance: "subtle",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  /** Show the leading status dot (subtle appearance only). */
  dot?: boolean;
}

function Badge({
  className,
  variant,
  appearance,
  asChild = false,
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp className={cn(badgeVariants({ variant, appearance }), className)} {...props}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
      {/* Slottable marks which child asChild should merge into — see Button. */}
      <Slottable>{children}</Slottable>
    </Comp>
  );
}

export { Badge, badgeVariants };
