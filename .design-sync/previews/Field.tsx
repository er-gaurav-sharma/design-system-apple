import * as React from "react";
import {
  Field,
  FieldHelper,
  FieldError,
  Label,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@claude-design/dashboard-ui";

/** The canonical stack: Label, control, helper text. */
export const Default = () => (
  <Field className="max-w-sm">
    <Label htmlFor="f-name">Display name</Label>
    <Input id="f-name" defaultValue="Acme Analytics" />
    <FieldHelper>Appears in the workspace switcher.</FieldHelper>
  </Field>
);

/** FieldError replaces the helper and carries its own alert glyph. */
export const WithError = () => (
  <Field className="max-w-sm">
    <Label htmlFor="f-slug">Workspace URL</Label>
    <Input id="f-slug" defaultValue="acme analytics" aria-invalid />
    <FieldError>Only lowercase letters, numbers and dashes.</FieldError>
  </Field>
);

/** Field is control-agnostic — it wraps any form control the same way. */
export const AcrossControls = () => (
  <div className="grid max-w-2xl grid-cols-2 gap-5">
    <Field>
      <Label htmlFor="f-region">Region</Label>
      <Select defaultValue="us-east-1">
        <SelectTrigger id="f-region">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
          <SelectItem value="eu-west-1">EU West (Ireland)</SelectItem>
        </SelectContent>
      </Select>
      <FieldHelper>Data residency for this workspace.</FieldHelper>
    </Field>
    <Field>
      <Label htmlFor="f-desc">Description</Label>
      <Textarea id="f-desc" defaultValue="Revenue and retention reporting." />
    </Field>
  </div>
);

/** Fields stack into a form with consistent rhythm. */
export const InAForm = () => (
  <form className="flex max-w-sm flex-col gap-5">
    <Field>
      <Label htmlFor="f-first">First name</Label>
      <Input id="f-first" defaultValue="Dana" />
    </Field>
    <Field>
      <Label htmlFor="f-email">Work email</Label>
      <Input id="f-email" type="email" defaultValue="dana@acme.com" />
      <FieldHelper>We only use this for security notifications.</FieldHelper>
    </Field>
  </form>
);
