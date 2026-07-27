import * as React from "react";
import { Switch, Label } from "@claude-design/dashboard-ui";

/** Off, on, and both disabled variants. The thumb slides 18px when checked. */
export const States = () => (
  <div className="flex items-center gap-6">
    <Switch aria-label="Off" />
    <Switch defaultChecked aria-label="On" />
    <Switch disabled aria-label="Disabled off" />
    <Switch defaultChecked disabled aria-label="Disabled on" />
  </div>
);

/** Label to the left, control to the right — the usual settings-row layout. */
export const WithLabel = () => (
  <div className="flex max-w-sm items-center justify-between gap-6">
    <Label htmlFor="sw-2fa">Require two-factor authentication</Label>
    <Switch id="sw-2fa" defaultChecked />
  </div>
);

/** A settings panel: label + description on the left, Switch on the right. */
export const SettingsRows = () => (
  <div className="flex max-w-lg flex-col divide-y divide-border">
    {[
      {
        id: "sw-digest",
        title: "Weekly digest",
        desc: "A Monday summary of workspace activity.",
        on: true,
      },
      {
        id: "sw-anomaly",
        title: "Anomaly detection",
        desc: "Alert when metrics deviate from their baseline.",
        on: true,
      },
      {
        id: "sw-beta",
        title: "Beta features",
        desc: "Opt this workspace into pre-release functionality.",
        on: false,
      },
    ].map((row) => (
      <div key={row.id} className="flex items-center justify-between gap-6 py-3.5">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor={row.id}>{row.title}</Label>
          <p className="text-xs text-text-tertiary">{row.desc}</p>
        </div>
        <Switch id={row.id} defaultChecked={row.on} />
      </div>
    ))}
  </div>
);
