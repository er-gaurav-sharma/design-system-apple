import * as React from "react";
import { Checkbox, Label } from "@claude-design/dashboard-ui";

/** Every static state of the control, side by side. */
export const States = () => (
  <div className="flex items-center gap-6">
    <Checkbox aria-label="Unchecked" />
    <Checkbox defaultChecked aria-label="Checked" />
    <Checkbox defaultChecked="indeterminate" aria-label="Some selected" />
    <Checkbox disabled aria-label="Disabled" />
    <Checkbox defaultChecked disabled aria-label="Checked and disabled" />
  </div>
);

/** Pair with a Label via matching id/htmlFor so the text is clickable. */
export const WithLabel = () => (
  <div className="flex items-center gap-2.5">
    <Checkbox id="cb-terms" defaultChecked />
    <Label htmlFor="cb-terms">Send me product release notes</Label>
  </div>
);

/** A realistic settings group — the common dashboard usage. */
export const CheckboxGroup = () => (
  <fieldset className="flex flex-col gap-3">
    <legend className="mb-1 text-[13px] font-medium text-foreground">
      Email notifications
    </legend>
    <div className="flex items-center gap-2.5">
      <Checkbox id="cb-billing" defaultChecked />
      <Label htmlFor="cb-billing">Billing and invoices</Label>
    </div>
    <div className="flex items-center gap-2.5">
      <Checkbox id="cb-security" defaultChecked />
      <Label htmlFor="cb-security">Security alerts</Label>
    </div>
    <div className="flex items-center gap-2.5">
      <Checkbox id="cb-marketing" />
      <Label htmlFor="cb-marketing">Product marketing</Label>
    </div>
    <div className="flex items-center gap-2.5">
      <Checkbox id="cb-sms" disabled />
      <Label htmlFor="cb-sms">SMS alerts (requires a verified number)</Label>
    </div>
  </fieldset>
);

const channels = [
  { id: "email", label: "Email" },
  { id: "push", label: "Push notifications" },
  { id: "sms", label: "SMS" },
];

/**
 * A parent over its children. With only some children ticked the parent is
 * "indeterminate": a dash on a filled box. Clicking it selects all.
 */
export const SomeSelected = () => {
  const [on, setOn] = React.useState<string[]>(["email"]);
  const all = on.length === channels.length;
  const parent = all ? true : on.length ? "indeterminate" : false;
  return (
    <fieldset className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <Checkbox
          id="cb-channels-all"
          checked={parent}
          onCheckedChange={() => setOn(all ? [] : channels.map((c) => c.id))}
        />
        <Label htmlFor="cb-channels-all">All channels</Label>
      </div>
      {channels.map((c) => (
        <div key={c.id} className="ml-7 flex items-center gap-2.5">
          <Checkbox
            id={`cb-channel-${c.id}`}
            checked={on.includes(c.id)}
            onCheckedChange={(v) =>
              setOn((prev) => (v === true ? [...prev, c.id] : prev.filter((x) => x !== c.id)))
            }
          />
          <Label htmlFor={`cb-channel-${c.id}`}>{c.label}</Label>
        </div>
      ))}
    </fieldset>
  );
};
