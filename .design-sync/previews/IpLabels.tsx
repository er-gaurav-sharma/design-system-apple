import * as React from "react";
import { IpLabels, TooltipProvider } from "@claude-design/dashboard-ui";

/** Badges for a page header. Source not verified explains itself on hover or focus. */
export const Badges = () => (
  <TooltipProvider>
    <IpLabels labels={["outbound", "private", "unverified"]} />
  </TooltipProvider>
);

/** The small line under an address in a table row. */
export const Inline = () => (
  <div className="flex flex-col gap-1 text-[13px]">
    <span className="font-mono">198.51.100.7</span>
    <IpLabels variant="inline" labels={["outbound", "private"]} />
  </div>
);

/** The app names the ban list and says when the address was added. */
export const CustomWords = () => (
  <TooltipProvider>
    <IpLabels
      labels={["banned"]}
      text={{ banned: "On the firewall's ban list" }}
      tooltips={{ banned: "Added 2026-01-14 by the nightly import" }}
    />
  </TooltipProvider>
);
