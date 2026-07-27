import * as React from "react";
import { Toaster, toast } from "@claude-design/dashboard-ui";

/**
 * Mount <Toaster /> once near the app root, then call `toast.success(...)`,
 * `toast.error(...)`, `toast.warning(...)`, `toast.info(...)` from anywhere.
 * This card fires the toasts on mount so the styled result is visible — real
 * apps call `toast()` from an event handler, not an effect.
 */
export const Toasts = () => {
  React.useEffect(() => {
    toast.success("Invite sent", {
      description: "dana@acme.com will receive an email shortly.",
    });
    toast.error("Export failed", {
      description: "The reporting API timed out.",
    });
    toast.info("Release 2024.5 is live", {
      description: "Saved views now sync across devices.",
    });
  }, []);

  // `expand` is set so all three stay unstacked in this static card; by default
  // sonner collapses them behind the newest until hover.
  return (
    <div className="h-[380px]">
      <Toaster position="bottom-right" expand visibleToasts={3} />
    </div>
  );
};
