import * as React from "react";
import { Badge, Card, Meter, Stat } from "@claude-design/dashboard-ui";

/** A row of figures inside one card. */
export const Row = () => (
  <Card className="grid grid-cols-2 gap-6 p-5 md:grid-cols-4">
    <Stat label="Requests" value="18,204" caption="Last 24 hours." />
    <Stat label="Error rate" value="0.4%" caption="Up from 0.2% yesterday." />
    <Stat
      label="Risk score"
      value={
        <>
          6.3<span className="text-sm font-normal text-muted-foreground"> / 10</span>
        </>
      }
    >
      <Meter value={6.3} size="md" className="max-w-[160px]" label="Risk score" />
    </Stat>
    <Stat label="Status" caption="Since 09:12.">
      <Badge variant="warning">Degraded</Badge>
    </Stat>
  </Card>
);
