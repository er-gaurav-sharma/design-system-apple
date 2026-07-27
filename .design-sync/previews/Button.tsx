import * as React from "react";
import { Button } from "@claude-design/dashboard-ui";
import { Plus, Download, Trash2 } from "lucide-react";

/** The three intents. `primary` is the default — one per view, for the main action. */
export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>Save changes</Button>
    <Button variant="secondary">Cancel</Button>
    <Button variant="destructive">Delete project</Button>
  </div>
);

/** Sizes. `icon` is square — use it only with a single glyph and an aria-label. */
export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button size="default">Default</Button>
    <Button size="sm">Small</Button>
    <Button size="icon" aria-label="Add item">
      <Plus />
    </Button>
  </div>
);

/** Icons are auto-sized to 16px and gap-spaced by the button itself. */
export const WithIcons = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>
      <Plus />
      New report
    </Button>
    <Button variant="secondary">
      <Download />
      Export CSV
    </Button>
    <Button variant="destructive">
      <Trash2 />
      Delete
    </Button>
  </div>
);

/** `loading` shows a spinner and blocks interaction; `disabled` drops to 40% opacity. */
export const States = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button loading>Saving…</Button>
    <Button variant="secondary" loading>
      Refreshing
    </Button>
    <Button disabled>Disabled</Button>
    <Button variant="secondary" disabled>
      Disabled
    </Button>
  </div>
);

/** `asChild` hands the button's styling to the child element — here a real link. */
export const AsChildLink = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button asChild>
      <a href="#billing">Go to billing</a>
    </Button>
    <Button asChild variant="secondary">
      <a href="#docs">Read the docs</a>
    </Button>
    <Button asChild variant="destructive" loading>
      <a href="#delete">Deleting…</a>
    </Button>
  </div>
);
