import * as React from "react";
import { Inbox, SearchX } from "lucide-react";
import { Button, Card, EmptyState } from "@claude-design/dashboard-ui";

/** An empty list, inside the card that would hold it. */
export const Default = () => (
  <Card>
    <EmptyState
      icon={<Inbox />}
      title="No alerts yet"
      description="Alerts appear here as soon as a connected source reports one."
    />
  </Card>
);

/** With an action, for a search or filter that matches nothing. */
export const WithAction = () => (
  <Card>
    <EmptyState
      icon={<SearchX />}
      title="Nothing matches these filters"
      description="Try a wider date range or fewer filters."
      action={<Button variant="secondary" size="sm">Clear filters</Button>}
    />
  </Card>
);
