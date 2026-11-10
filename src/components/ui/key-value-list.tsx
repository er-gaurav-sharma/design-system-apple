import * as React from "react";

import { cn } from "@/lib/utils";

export interface KeyValueItem {
  label: React.ReactNode;
  value: React.ReactNode;
  /** A stable key when labels repeat or aren't strings. */
  key?: React.Key;
}

export interface KeyValueListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: KeyValueItem[];
  /** Set both columns in monospace, for raw fields such as parsed log keys. */
  mono?: boolean;
}

/**
 * Label and value pairs in two aligned columns, such as connection details or
 * the fields of a log line. A `<dl>`, so each label stays tied to its value
 * for screen readers. Long values wrap inside their column.
 */
const KeyValueList = React.forwardRef<HTMLDListElement, KeyValueListProps>(
  ({ items, mono = false, className, ...props }, ref) => (
    <dl
      ref={ref}
      className={cn("grid grid-cols-[minmax(120px,max-content)_minmax(0,1fr)] gap-x-6 text-[13px]", className)}
      {...props}
    >
      {items.map((item, i) => (
        <React.Fragment key={item.key ?? (typeof item.label === "string" ? `${item.label}-${i}` : i)}>
          <dt
            className={cn(
              "border-b border-border py-2 text-muted-foreground",
              mono && "font-mono text-xs leading-5",
            )}
          >
            {item.label}
          </dt>
          <dd
            className={cn(
              "min-w-0 break-words border-b border-border py-2 text-foreground",
              mono && "font-mono text-xs leading-5",
            )}
          >
            {item.value}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  ),
);
KeyValueList.displayName = "KeyValueList";

export { KeyValueList };
