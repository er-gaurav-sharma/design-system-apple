import * as React from "react";
import { Button, SectionHeader, Switch, Label } from "@claude-design/dashboard-ui";

/** A heading with a link-style action on the right. */
export const WithAction = () => (
  <SectionHeader title="Recent activity" action={<Button variant="secondary" size="sm">View all</Button>} />
);

/** A control on the right; level sets the heading element to fit the page outline. */
export const WithControl = () => (
  <SectionHeader
    level={3}
    title="Notifications"
    action={
      <div className="flex items-center gap-2">
        <Switch id="sh-email" defaultChecked />
        <Label htmlFor="sh-email">Email</Label>
      </div>
    }
  />
);

/** Heading only. */
export const Plain = () => <SectionHeader title="Connection details" />;
