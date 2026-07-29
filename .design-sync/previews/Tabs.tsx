import * as React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
  Card,
  CardContent,
} from "@claude-design/dashboard-ui";
import { Activity, Settings, Users } from "lucide-react";

/** The default: page-level sections, underlined. */
export const Default = () => (
  <Tabs defaultValue="overview" className="w-full max-w-2xl">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="members">Members</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <p className="text-sm text-muted-foreground">
        12,480 active users across 4 regions this month.
      </p>
    </TabsContent>
    <TabsContent value="members">
      <p className="text-sm text-muted-foreground">38 members, 4 pending invitations.</p>
    </TabsContent>
    <TabsContent value="settings">
      <p className="text-sm text-muted-foreground">Workspace defaults and data residency.</p>
    </TabsContent>
  </Tabs>
);

/** Segmented, for switching what one panel shows. */
export const Segmented = () => (
  <Tabs defaultValue="7d" className="w-full max-w-md">
    <TabsList variant="segmented" className="w-full">
      <TabsTrigger value="24h">24 hours</TabsTrigger>
      <TabsTrigger value="7d">7 days</TabsTrigger>
      <TabsTrigger value="30d">30 days</TabsTrigger>
    </TabsList>
    <TabsContent value="24h">
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">1,204 requests</CardContent>
      </Card>
    </TabsContent>
    <TabsContent value="7d">
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">9,871 requests</CardContent>
      </Card>
    </TabsContent>
    <TabsContent value="30d">
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">42,388 requests</CardContent>
      </Card>
    </TabsContent>
  </Tabs>
);

/** Triggers take icons and trailing counts, and can be disabled. */
export const WithIconsAndCounts = () => (
  <Tabs defaultValue="activity" className="w-full max-w-2xl">
    <TabsList>
      <TabsTrigger value="activity">
        <Activity /> Activity
      </TabsTrigger>
      <TabsTrigger value="people">
        <Users /> People <Badge>38</Badge>
      </TabsTrigger>
      <TabsTrigger value="config" disabled>
        <Settings /> Configuration
      </TabsTrigger>
    </TabsList>
    <TabsContent value="activity">
      <p className="text-sm text-muted-foreground">Last deploy 4 minutes ago.</p>
    </TabsContent>
    <TabsContent value="people">
      <p className="text-sm text-muted-foreground">38 members.</p>
    </TabsContent>
  </Tabs>
);
