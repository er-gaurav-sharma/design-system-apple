import * as React from "react";
import { FilterMenu } from "@claude-design/dashboard-ui";

const sources = [
  { value: "firewall", label: "Firewall" },
  { value: "load-balancer", label: "Load balancer" },
  { value: "router", label: "Router" },
  { value: "vpn", label: "VPN gateway" },
];

/** Everything selected: no filter, so the button stays plain. */
export const All = () => {
  const [value, setValue] = React.useState(sources.map((s) => s.value));
  return <FilterMenu label="Source" options={sources} value={value} onChange={setValue} />;
};

/** Filtering: the button is tinted and names what is chosen. */
export const Filtered = () => {
  const [one, setOne] = React.useState(["router"]);
  const [two, setTwo] = React.useState(["firewall", "vpn"]);
  return (
    <div className="flex flex-wrap gap-2">
      <FilterMenu label="Source" options={sources} value={one} onChange={setOne} />
      <FilterMenu label="Source" options={sources} value={two} onChange={setTwo} />
    </div>
  );
};
