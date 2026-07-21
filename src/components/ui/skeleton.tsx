import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The shared loading primitive. Shimmer animation respects reduced-motion
 * (motion-reduce:animate-none). Compose with width/height/rounded utilities.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-sm bg-muted motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
