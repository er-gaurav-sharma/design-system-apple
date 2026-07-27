import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "@claude-design/dashboard-ui";

/** The full part set: header (title + description), content, footer. */
export const Default = () => (
  <Card className="max-w-md">
    <CardHeader>
      <CardTitle>Billing</CardTitle>
      <CardDescription>Manage your plan and payment method.</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        You are on the Team plan, billed annually. Your next invoice of $1,240.00
        is due on 1 June 2024.
      </p>
    </CardContent>
    <CardFooter className="gap-3">
      <Button>Change plan</Button>
      <Button variant="secondary">View invoices</Button>
    </CardFooter>
  </Card>
);

/** Header + content only — the most common shape in a dashboard grid. */
export const HeaderAndContent = () => (
  <Card className="max-w-md">
    <CardHeader>
      <CardTitle>Data residency</CardTitle>
      <CardDescription>Where this workspace stores its data.</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-foreground">EU West (Ireland)</p>
    </CardContent>
  </Card>
);

/** Card is just a raised surface — content can be laid out freely inside it. */
export const BareSurface = () => (
  <Card className="max-w-md p-6">
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Current usage</p>
        <p className="text-[28px] font-semibold leading-none">1.8 TB</p>
      </div>
      <Badge dot variant="success">Within limit</Badge>
    </div>
  </Card>
);

/** Cards tile into a responsive grid. */
export const InAGrid = () => (
  <div className="grid grid-cols-2 gap-4">
    {[
      { title: "API requests", value: "4.2M", desc: "Last 30 days" },
      { title: "Avg. latency", value: "128ms", desc: "p95 across regions" },
      { title: "Error rate", value: "0.04%", desc: "5xx responses" },
      { title: "Uptime", value: "99.98%", desc: "Rolling 90 days" },
    ].map((c) => (
      <Card key={c.title} className="p-5">
        <p className="text-sm text-muted-foreground">{c.title}</p>
        <p className="mt-2 text-2xl font-semibold leading-none">{c.value}</p>
        <p className="mt-2 text-xs text-text-tertiary">{c.desc}</p>
      </Card>
    ))}
  </div>
);
