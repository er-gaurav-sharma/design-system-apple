import * as React from "react";
import { RankList, TooltipProvider } from "@claude-design/dashboard-ui";

/** A top-five list. Bars are in proportion to the largest value. */
export const Default = () => (
  <RankList
    className="max-w-md"
    items={[
      { label: "Failed sign-in", detail: "Identity provider", value: 1420 },
      { label: "Port scan", detail: "Firewall", value: 984 },
      { label: "Connection denied", detail: "Firewall", value: 611 },
      { label: "Malformed request", detail: "Load balancer", value: 203 },
      { label: "Certificate expired", detail: "VPN gateway", value: 12 },
    ]}
  />
);

/** mono for addresses, and a tooltip for detail that doesn't fit the row. */
export const WithTooltips = () => (
  <TooltipProvider>
    <RankList
      className="max-w-md"
      items={[
        { label: "203.0.113.45", mono: true, detail: "3 sources", value: 2210, tooltip: "First seen 2024-05-14 22:10" },
        { label: "198.51.100.7", mono: true, detail: "1 source", value: 830, tooltip: "First seen 2024-05-15 03:41" },
        { label: "192.0.2.200", mono: true, detail: "2 sources", value: 412, tooltip: "First seen 2024-05-15 08:02" },
      ]}
    />
  </TooltipProvider>
);
