import * as React from "react";
import { Label, Input, Checkbox, Field } from "@claude-design/dashboard-ui";

/** Label on its own — 13px, medium weight, foreground token. */
export const Default = () => <Label htmlFor="api-key">API key</Label>;

/** htmlFor ties the label to its control, so clicking the text focuses it. */
export const WithControl = () => (
  <Field className="max-w-sm">
    <Label htmlFor="api-key-input">API key</Label>
    <Input id="api-key-input" defaultValue="sk_live_8f2c…" />
  </Field>
);

/**
 * The `peer-disabled:` styling: a Label placed after a disabled peer control
 * dims to 60% automatically — no extra prop needed.
 */
export const NextToDisabledControl = () => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2.5">
      <Checkbox id="enabled-opt" defaultChecked />
      <Label htmlFor="enabled-opt">Email me weekly digests</Label>
    </div>
    <div className="flex items-center gap-2.5">
      <Checkbox id="disabled-opt" disabled />
      <Label htmlFor="disabled-opt">SMS alerts (requires a verified number)</Label>
    </div>
  </div>
);
