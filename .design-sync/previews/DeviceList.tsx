import * as React from "react";
import { BrickWall, Network, Router } from "lucide-react";
import { DeviceIcon, DeviceList } from "@claude-design/dashboard-ui";

/** The devices that flagged an address. The app supplies each name and icon. */
export const Default = () => (
  <DeviceList
    className="text-[13px]"
    devices={[
      { id: "fw", label: "Firewall", icon: BrickWall },
      { id: "lb", label: "Load balancer", icon: Network },
      { id: "rt", label: "Edge router", icon: Router },
    ]}
  />
);

/** In a narrow cell the row wraps between devices, never inside a name. */
export const Narrow = () => (
  <DeviceList
    className="max-w-[180px] text-[13px]"
    devices={[
      { id: "fw", label: "Firewall", icon: BrickWall },
      { id: "lb", label: "Load balancer", icon: Network },
      { id: "fs", label: "File servers" },
    ]}
  />
);

/** DeviceIcon alone, beside an event. A device with no icon gets a generic server. */
export const Icons = () => (
  <div className="flex items-center gap-4">
    <DeviceIcon icon={BrickWall} />
    <DeviceIcon icon={Router} />
    <DeviceIcon />
  </div>
);
