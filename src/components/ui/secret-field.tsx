import * as React from "react";
import { KeyRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface SecretFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  /** The id of the input. */
  id: string;
  /** The field's name, such as "API key". */
  label: string;
  /**
   * Set once a value is stored: when and by whom, already formatted for
   * display. The field then shows this instead of an input. Never pass the
   * stored value itself; this component has nowhere to show it.
   */
  saved?: { on: React.ReactNode; by: React.ReactNode } | null;
  /**
   * Store the typed value. Return a promise to show the Save button as busy;
   * if it rejects, the typed value is kept so it can be tried again.
   */
  onSave: (value: string) => void | Promise<unknown>;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * A write-only credential field. It holds what is typed only until Save, and
 * never receives a stored value, so it can't show one. Once saved it says
 * "Saved {on} by {by} · never shown again" with a Replace button.
 */
const SecretField = React.forwardRef<HTMLDivElement, SecretFieldProps>(
  ({ id, label, saved, onSave, placeholder, disabled, className, ...props }, ref) => {
    const [replacing, setReplacing] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [busy, setBusy] = React.useState(false);
    const labelId = `${id}-label`;
    const statusId = `${id}-status`;
    const editing = !saved || replacing;

    const save = async () => {
      if (!value || busy) return;
      setBusy(true);
      try {
        await onSave(value);
        setValue("");
        setReplacing(false);
      } catch {
        // Keep the typed value; the caller reports the error.
      } finally {
        setBusy(false);
      }
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props}>
        {editing ? (
          <>
            <Label id={labelId} htmlFor={id}>
              {label}
            </Label>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                id={id}
                type="password"
                autoComplete="new-password"
                spellCheck={false}
                className="min-w-0 flex-1 basis-56"
                placeholder={placeholder ?? (saved ? "Paste the new value" : "Paste the value")}
                value={value}
                disabled={disabled || busy}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  // Save on Enter without submitting a form this sits in.
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void save();
                  }
                }}
              />
              <Button size="sm" className="h-11" disabled={!value || disabled} loading={busy} onClick={() => void save()}>
                Save
              </Button>
              {saved && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-11"
                  disabled={busy}
                  onClick={() => {
                    setValue("");
                    setReplacing(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Not a <label for>: pointed at the Replace button it would
                rename the button to the field's name. */}
            <span id={labelId} className="text-[13px] font-medium leading-none text-foreground">
              {label}
            </span>
            <div
              role="group"
              aria-labelledby={labelId}
              className="flex min-h-11 flex-wrap items-center justify-between gap-3 rounded-md bg-muted px-3.5 py-2"
            >
              <span id={statusId} className="inline-flex min-w-0 items-center gap-2 text-[13px] text-foreground">
                <KeyRound className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="min-w-0">
                  Saved {saved?.on} by {saved?.by}
                  <span className="text-muted-foreground"> · never shown again</span>
                </span>
              </span>
              <Button
                variant="secondary"
                size="sm"
                className="h-8"
                disabled={disabled}
                aria-describedby={statusId}
                onClick={() => setReplacing(true)}
              >
                Replace
              </Button>
            </div>
          </>
        )}
      </div>
    );
  },
);
SecretField.displayName = "SecretField";

export { SecretField };
