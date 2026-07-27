import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  Label,
  Field,
} from "@claude-design/dashboard-ui";

/**
 * The open menu — grouped items, a separator, and the check indicator on the
 * selected row. `defaultOpen` is what makes the portal content render statically;
 * in real usage you omit it and the trigger opens the menu.
 */
export const Open = () => (
  <div className="w-[280px] pb-[260px]">
    <Field>
      <Label htmlFor="sel-region">Region</Label>
      <Select defaultValue="us-east-1" defaultOpen>
        <SelectTrigger id="sel-region">
          <SelectValue placeholder="Choose a region" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Americas</SelectLabel>
            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
            <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="eu-west-1">EU West (Ireland)</SelectItem>
            <SelectItem value="eu-central-1">EU Central (Frankfurt)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  </div>
);
