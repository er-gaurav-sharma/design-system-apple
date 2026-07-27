import * as React from "react";
import { Textarea, Label, Field, FieldHelper, FieldError } from "@claude-design/dashboard-ui";

/** Min-height is 88px and the control is vertically resizable. */
export const Default = () => (
  <div className="max-w-md">
    <Textarea placeholder="Add a note for your teammates…" />
  </div>
);

/** Matches Input's field conventions inside a Field wrapper. */
export const WithLabel = () => (
  <Field className="max-w-md">
    <Label htmlFor="incident-summary">Incident summary</Label>
    <Textarea
      id="incident-summary"
      defaultValue={
        "Elevated 5xx rate on the reporting API between 14:02 and 14:19 UTC. " +
        "Traced to a slow migration holding a table lock; rolled back."
      }
    />
    <FieldHelper>Included verbatim in the customer-facing postmortem.</FieldHelper>
  </Field>
);

/** Error state mirrors Input — aria-invalid plus FieldError. */
export const Invalid = () => (
  <Field className="max-w-md">
    <Label htmlFor="justification">Justification</Label>
    <Textarea id="justification" defaultValue="" aria-invalid />
    <FieldError>A justification is required for elevated access.</FieldError>
  </Field>
);

/** Disabled textareas use the same muted surface as Input. */
export const Disabled = () => (
  <Field className="max-w-md">
    <Label htmlFor="audit-note">Audit note</Label>
    <Textarea id="audit-note" defaultValue="Locked after the review window closed." disabled />
  </Field>
);
