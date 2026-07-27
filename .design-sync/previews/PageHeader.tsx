import * as React from "react";
import { PageHeader, Button, Badge } from "@claude-design/dashboard-ui";
import { Plus, Download } from "lucide-react";

/** Title, description, and a right-aligned actions slot. */
export const Default = () => (
  <PageHeader
    title="Revenue"
    description="Recurring revenue across every plan and region."
    actions={
      <>
        <Button variant="secondary">
          <Download />
          Export
        </Button>
        <Button>
          <Plus />
          New report
        </Button>
      </>
    }
  />
);

/** Title only — for pages that need no framing copy. */
export const TitleOnly = () => <PageHeader title="Audit log" />;

/** Title + description, no actions. */
export const WithDescription = () => (
  <PageHeader
    title="Members"
    description="312 of 400 seats in use across 14 teams."
  />
);

/** The actions slot takes any node, not just buttons. */
export const WithStatusAction = () => (
  <PageHeader
    title="Data warehouse sync"
    description="Mirrors production into the analytics warehouse every 15 minutes."
    actions={
      <>
        <Badge dot variant="warning">
          Degraded
        </Badge>
        <Button variant="secondary">View logs</Button>
      </>
    }
  />
);
