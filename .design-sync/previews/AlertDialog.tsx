import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@claude-design/dashboard-ui";

/**
 * A destructive confirmation. AlertDialogAction takes `variant="destructive"`
 * for irreversible actions; AlertDialogCancel is always the secondary button.
 * Unlike Dialog there is no close affordance — the user must pick an option.
 */
export const Destructive = () => (
  <AlertDialog defaultOpen>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete this workspace?</AlertDialogTitle>
        <AlertDialogDescription>
          This permanently removes 1,284 dashboards and all saved views. This
          action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant="destructive">
          Delete workspace
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
