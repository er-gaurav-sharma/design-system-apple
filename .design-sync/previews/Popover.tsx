import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Field,
  FieldHelper,
  Label,
  Input,
  Switch,
} from "@claude-design/dashboard-ui";
import { SlidersHorizontal } from "lucide-react";

/** A short form in a panel — the common dashboard use. */
export const Default = () => (
  <Popover open>
    <PopoverTrigger asChild>
      <Button variant="secondary">
        <SlidersHorizontal /> Filters
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium">Refine results</p>
        <Field>
          <Label htmlFor="pop-min">Minimum spend</Label>
          <Input id="pop-min" defaultValue="1000" />
          <FieldHelper>In your billing currency.</FieldHelper>
        </Field>
        <div className="flex items-center justify-between">
          <Label htmlFor="pop-archived">Include archived</Label>
          <Switch id="pop-archived" />
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

/** Sides and alignment come from Radix; width is a class on the content. */
export const Placement = () => (
  <Popover open>
    <PopoverTrigger asChild>
      <Button variant="secondary">Details</Button>
    </PopoverTrigger>
    <PopoverContent side="right" align="start" className="w-56">
      <p className="text-sm text-muted-foreground">
        Anchored to the right of the trigger, aligned to its top edge.
      </p>
    </PopoverContent>
  </Popover>
);
