import * as React from "react";
import { Input, Label, Field, FieldHelper, FieldError } from "@claude-design/dashboard-ui";

/** Bare inputs. Placeholder text uses the tertiary text token. */
export const Default = () => (
  <div className="flex max-w-sm flex-col gap-3">
    <Input placeholder="Search invoices…" />
    <Input defaultValue="acme-production" />
  </div>
);

/** The idiomatic form unit: Field wraps Label + Input (+ helper or error). */
export const WithLabel = () => (
  <Field className="max-w-sm">
    <Label htmlFor="workspace">Workspace name</Label>
    <Input id="workspace" defaultValue="Acme Analytics" />
    <FieldHelper>Shown to everyone in your organization.</FieldHelper>
  </Field>
);

/** aria-invalid drives the error border; pair it with FieldError. */
export const Invalid = () => (
  <Field className="max-w-sm">
    <Label htmlFor="email">Work email</Label>
    <Input id="email" type="email" defaultValue="not-an-email" aria-invalid />
    <FieldError>Enter a valid email address.</FieldError>
  </Field>
);

/** Disabled inputs drop to the muted surface. */
export const Disabled = () => (
  <Field className="max-w-sm">
    <Label htmlFor="plan-id">Plan ID</Label>
    <Input id="plan-id" defaultValue="ent-2024-annual" disabled />
    <FieldHelper>Managed by billing — contact support to change.</FieldHelper>
  </Field>
);

/** Common input types render with the same field styling. */
export const Types = () => (
  <div className="grid max-w-lg grid-cols-2 gap-3">
    <Input type="email" placeholder="you@company.com" />
    <Input type="password" defaultValue="hunter2hunter2" />
    <Input type="date" defaultValue="2024-05-15" />
    <Input type="number" defaultValue={42} />
  </div>
);
