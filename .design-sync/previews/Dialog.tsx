import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Button,
  Field,
  Label,
  Input,
  FieldHelper,
} from "@claude-design/dashboard-ui";

/**
 * The open dialog: header (title + description), a form body, and a right-aligned
 * footer. `defaultOpen` renders the portal statically for this card — in real
 * usage wrap a `DialogTrigger` instead and let it control the open state.
 */
export const Open = () => (
  <Dialog defaultOpen>
    {/* onOpenAutoFocus is prevented only so this static card doesn't render with
        the first input focused and its text selected. Don't copy that into real
        usage — the autofocus is correct behavior for an interactive dialog. */}
    <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle>Invite teammates</DialogTitle>
        <DialogDescription>
          They&rsquo;ll get access to every dashboard in this workspace.
        </DialogDescription>
      </DialogHeader>
      <Field>
        <Label htmlFor="dlg-emails">Email addresses</Label>
        <Input id="dlg-emails" defaultValue="dana@acme.com, sam@acme.com" />
        <FieldHelper>Separate multiple addresses with commas.</FieldHelper>
      </Field>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <Button>Send invites</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
