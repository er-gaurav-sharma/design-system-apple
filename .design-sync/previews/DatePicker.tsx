import * as React from "react";
import {
  DatePicker,
  DateRangePicker,
  Field,
  FieldError,
  FieldHelper,
  Label,
} from "@claude-design/dashboard-ui";

/** Closed, in a Field — the shape a form actually uses. */
export const Default = () => (
  <div className="grid max-w-2xl grid-cols-2 gap-5">
    <Field>
      <Label htmlFor="dp-start">Start date</Label>
      <DatePicker id="dp-start" name="start" defaultValue={new Date(2026, 2, 12)} />
      <FieldHelper>Reporting begins on this date.</FieldHelper>
    </Field>
    <Field>
      <Label htmlFor="dp-end">End date</Label>
      <DatePicker id="dp-end" name="end" placeholder="Pick a date" />
    </Field>
  </div>
);

/** Invalid state matches Input and SelectTrigger. */
export const Invalid = () => (
  <Field className="max-w-sm">
    <Label htmlFor="dp-cutoff">Cutoff</Label>
    <DatePicker id="dp-cutoff" aria-invalid />
    <FieldError>Pick a date no earlier than the billing period start.</FieldError>
  </Field>
);

/** The range field, closed and populated. */
export const Range = () => (
  <Field className="max-w-sm">
    <Label htmlFor="dp-range">Date range</Label>
    <DateRangePicker
      id="dp-range"
      name="period"
      defaultValue={{ from: new Date(2026, 2, 9), to: new Date(2026, 2, 20) }}
    />
    <FieldHelper>Submits as period-from and period-to.</FieldHelper>
  </Field>
);

/** Disabled, and the empty placeholder state. */
export const States = () => (
  <div className="grid max-w-2xl grid-cols-2 gap-5">
    <Field>
      <Label htmlFor="dp-empty">Empty</Label>
      <DatePicker id="dp-empty" />
    </Field>
    <Field>
      <Label htmlFor="dp-disabled">Disabled</Label>
      <DatePicker id="dp-disabled" disabled defaultValue={new Date(2026, 2, 12)} />
    </Field>
  </div>
);
