import * as React from "react";
import { HealthLabel } from "@claude-design/dashboard-ui";

/** Every state. A healthy source reads "Reading" when the app pulls from it and "Connected" when it pushes. */
export const States = () => (
  <div className="grid max-w-md grid-cols-2 gap-x-8 gap-y-3">
    <HealthLabel state="ok" />
    <HealthLabel state="ok" intake="push" />
    <HealthLabel state="quiet" />
    <HealthLabel state="error" />
    <HealthLabel state="disconnected" />
    <HealthLabel state="off" />
  </div>
);

/** The word is a prop, for example to say how long a quiet source has been silent. */
export const CustomWord = () => <HealthLabel state="quiet" label="Quiet, nothing for 2 h" />;
