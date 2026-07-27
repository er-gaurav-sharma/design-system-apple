import * as React from "react";
import { Skeleton, Card } from "@claude-design/dashboard-ui";

/** Skeleton carries no size of its own — shape it with width/height utilities. */
export const Shapes = () => (
  <div className="flex max-w-sm flex-col gap-3">
    <Skeleton className="h-3.5 w-3/5" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="size-12 rounded-full" />
    <Skeleton className="h-24 w-full rounded-lg" />
  </div>
);

/** A loading text block — vary the widths so it reads as prose, not bars. */
export const TextBlock = () => (
  <div className="flex max-w-md flex-col gap-2.5">
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-4/5" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);

/** The loading counterpart of a real KPI card — mirror the final layout. */
export const CardPlaceholder = () => (
  <div className="grid grid-cols-2 gap-4">
    {[0, 1].map((i) => (
      <Card key={i} className="p-5">
        <Skeleton className="mb-3.5 h-3.5 w-3/5" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="mt-3.5 h-3 w-2/3" />
      </Card>
    ))}
  </div>
);

/** Table rows while data loads. */
export const TableRows = () => (
  <div className="flex max-w-lg flex-col gap-3">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-3.5 flex-1" />
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-20" />
      </div>
    ))}
  </div>
);
