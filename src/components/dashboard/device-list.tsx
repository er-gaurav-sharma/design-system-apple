import * as React from "react";
import { Server, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface DeviceIconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  /**
   * The device type's icon from lucide-react, supplied by the app with the
   * device. The library has no built-in list of devices. @default Server
   */
  icon?: LucideIcon;
}

/** A device type's icon at 16px in muted grey, hidden from screen readers; the name beside it carries the meaning. */
const DeviceIcon = React.forwardRef<SVGSVGElement, DeviceIconProps>(
  ({ icon: Icon = Server, className, ...props }, ref) => (
    <Icon
      ref={ref}
      aria-hidden="true"
      className={cn("size-4 shrink-0 text-muted-foreground", className)}
      {...props}
    />
  ),
);
DeviceIcon.displayName = "DeviceIcon";

export interface DeviceListItem {
  id: string;
  /** The device's name, such as "Edge router". */
  label: React.ReactNode;
  /** @default Server */
  icon?: LucideIcon;
}

export interface DeviceListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** In the order to show them. The app builds this list; nothing is built in. */
  devices: DeviceListItem[];
}

/**
 * The devices that flagged something, each as an icon and a name, in a row
 * that wraps between devices but never inside a name.
 */
const DeviceList = React.forwardRef<HTMLUListElement, DeviceListProps>(
  ({ devices, className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("inline-flex flex-wrap items-center gap-x-3 gap-y-1", className)}
      {...props}
    >
      {devices.map((d) => (
        <li key={d.id} className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <DeviceIcon icon={d.icon} />
          {d.label}
        </li>
      ))}
    </ul>
  ),
);
DeviceList.displayName = "DeviceList";

export { DeviceIcon, DeviceList };
