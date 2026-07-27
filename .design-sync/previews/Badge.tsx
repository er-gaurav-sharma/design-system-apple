import * as React from "react";
import { Badge } from "@claude-design/dashboard-ui";

/** The semantic axis, in the default `subtle` appearance. */
export const Variants = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge>Draft</Badge>
    <Badge variant="success">Paid</Badge>
    <Badge variant="warning">Pending</Badge>
    <Badge variant="error">Overdue</Badge>
    <Badge variant="info">Beta</Badge>
  </div>
);

/** `solid` inverts to a filled chip — use it sparingly, for emphasis. */
export const Appearance = () => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-wrap items-center gap-2">
      <Badge appearance="subtle">Neutral</Badge>
      <Badge appearance="subtle" variant="success">Success</Badge>
      <Badge appearance="subtle" variant="warning">Warning</Badge>
      <Badge appearance="subtle" variant="error">Error</Badge>
      <Badge appearance="subtle" variant="info">Info</Badge>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Badge appearance="solid">Neutral</Badge>
      <Badge appearance="solid" variant="success">Success</Badge>
      <Badge appearance="solid" variant="warning">Warning</Badge>
      <Badge appearance="solid" variant="error">Error</Badge>
      <Badge appearance="solid" variant="info">Info</Badge>
    </div>
  </div>
);

/** `dot` adds a leading status dot in the current color (subtle appearance). */
export const WithDot = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge dot variant="success">Operational</Badge>
    <Badge dot variant="warning">Degraded</Badge>
    <Badge dot variant="error">Outage</Badge>
    <Badge dot>Unknown</Badge>
  </div>
);

/** `asChild` turns the badge into whatever element you pass — here a link. */
export const AsChildLink = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge asChild variant="info">
      <a href="#changelog">What&rsquo;s new</a>
    </Badge>
    <Badge asChild dot variant="success">
      <a href="#status">All systems operational</a>
    </Badge>
  </div>
);

/** In context: status chips reading down a list of services. */
export const InContext = () => (
  <div className="flex max-w-sm flex-col divide-y divide-border">
    {[
      { name: "Reporting API", status: "Operational", variant: "success" },
      { name: "Data warehouse sync", status: "Degraded", variant: "warning" },
      { name: "Scheduled exports", status: "Outage", variant: "error" },
    ].map((s) => (
      <div key={s.name} className="flex items-center justify-between gap-4 py-2.5">
        <span className="text-sm text-foreground">{s.name}</span>
        <Badge dot variant={s.variant as "success" | "warning" | "error"}>
          {s.status}
        </Badge>
      </div>
    ))}
  </div>
);
