import * as React from "react";
import { RadioGroup, RadioGroupItem, Label } from "@claude-design/dashboard-ui";

/** RadioGroupItem only works inside RadioGroup; defaultValue picks the selection. */
export const Default = () => (
  <RadioGroup defaultValue="monthly">
    <div className="flex items-center gap-2.5">
      <RadioGroupItem value="monthly" id="rg-monthly" />
      <Label htmlFor="rg-monthly">Billed monthly</Label>
    </div>
    <div className="flex items-center gap-2.5">
      <RadioGroupItem value="annual" id="rg-annual" />
      <Label htmlFor="rg-annual">Billed annually</Label>
    </div>
  </RadioGroup>
);

/** A disabled option sits alongside selectable ones. */
export const WithDisabledOption = () => (
  <RadioGroup defaultValue="team">
    <div className="flex items-center gap-2.5">
      <RadioGroupItem value="starter" id="rg-starter" />
      <Label htmlFor="rg-starter">Starter</Label>
    </div>
    <div className="flex items-center gap-2.5">
      <RadioGroupItem value="team" id="rg-team" />
      <Label htmlFor="rg-team">Team</Label>
    </div>
    <div className="flex items-center gap-2.5">
      <RadioGroupItem value="enterprise" id="rg-enterprise" disabled />
      <Label htmlFor="rg-enterprise">Enterprise (contact sales)</Label>
    </div>
  </RadioGroup>
);

/** Options with supporting copy — the richer settings pattern. */
export const WithDescriptions = () => (
  <RadioGroup defaultValue="private" className="max-w-md">
    {[
      {
        value: "private",
        title: "Private",
        desc: "Only invited members can open this workspace.",
      },
      {
        value: "org",
        title: "Organization",
        desc: "Anyone with an @acme.com address can join.",
      },
      {
        value: "public",
        title: "Public",
        desc: "Discoverable by anyone with the link.",
      },
    ].map((opt) => (
      <div key={opt.value} className="flex items-start gap-2.5">
        <RadioGroupItem value={opt.value} id={`rg-${opt.value}`} className="mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor={`rg-${opt.value}`}>{opt.title}</Label>
          <p className="text-xs text-text-tertiary">{opt.desc}</p>
        </div>
      </div>
    ))}
  </RadioGroup>
);
