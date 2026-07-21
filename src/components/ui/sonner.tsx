import type * as React from "react";
import { Toaster as SonnerToaster, toast } from "sonner";

/**
 * Transient notifications (success / error / warning / info). Mount <Toaster />
 * once near the app root, then call `toast.success(...)`, `toast.error(...)`, etc.
 * Styled to the design system via token-mapped classes; no next-themes required.
 */
function Toaster(props: React.ComponentProps<typeof SonnerToaster>) {
  return (
    <SonnerToaster
      theme="light"
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast !rounded-md !border-0 !bg-card !text-card-foreground !shadow-lg",
          title: "!text-sm !font-semibold",
          description: "!text-xs !text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground !rounded-md",
          cancelButton: "!bg-muted !text-muted-foreground !rounded-md",
          success: "[&_[data-icon]]:!text-success",
          error: "[&_[data-icon]]:!text-error",
          warning: "[&_[data-icon]]:!text-warning",
          info: "[&_[data-icon]]:!text-info",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
