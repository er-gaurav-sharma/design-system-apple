import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

type TabsVariant = "underline" | "segmented";

/** The list picks the variant; triggers read it so both stay in step. */
const TabsVariantContext = React.createContext<TabsVariant>("underline");

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    /**
     * `underline` for page-level sections, `segmented` for switching the
     * contents of a single panel (Apple's segmented control).
     * @default "underline"
     */
    variant?: TabsVariant;
  }
>(({ className, variant = "underline", ...props }, ref) => (
  <TabsVariantContext.Provider value={variant}>
    <TabsPrimitive.List
      ref={ref}
      data-variant={variant}
      className={cn(
        "inline-flex items-center",
        variant === "underline" && "w-full gap-6 border-b border-border",
        variant === "segmented" && "gap-1 rounded-md bg-muted p-1",
        className,
      )}
      {...props}
    />
  </TabsVariantContext.Provider>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const variant = React.useContext(TabsVariantContext);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors ease-standard",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
        "disabled:pointer-events-none disabled:opacity-40",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        variant === "underline" && [
          // -1px pulls the active border over the list's own bottom border
          // instead of stacking a second line under it.
          "-mb-px h-11 rounded-sm border-b-2 border-transparent px-1",
          "hover:text-foreground",
          "data-[state=active]:border-primary data-[state=active]:text-foreground",
        ],
        variant === "segmented" && [
          "h-8 flex-1 rounded-sm px-3",
          "hover:text-foreground",
          "data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs",
        ],
        className,
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
