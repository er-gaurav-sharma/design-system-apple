import * as React from "react";
import { RecommendationBadge } from "@claude-design/dashboard-ui";

/** The four recommendations, strongest first. Each has its own icon. */
export const All = () => (
  <div className="flex flex-wrap items-center gap-2">
    <RecommendationBadge recommendation="perimeter-block" />
    <RecommendationBadge recommendation="challenge" />
    <RecommendationBadge recommendation="allow" />
    <RecommendationBadge recommendation="none" />
  </div>
);

/** No recommendation because something already stops the address: the app names what, through label. */
export const AlreadyBlocked = () => (
  <div className="flex flex-wrap items-center gap-2">
    <RecommendationBadge recommendation="none" label="Blocked by policy 7" />
    <RecommendationBadge recommendation="none" label="On the firewall's ban list" />
  </div>
);
