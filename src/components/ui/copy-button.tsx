import * as React from "react";
import { Check, CircleAlert, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** Copies with the async clipboard, falling back to a hidden selection. */
async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Some views refuse the async clipboard; try the older selection copy.
    const active = document.activeElement as HTMLElement | null;
    const area = document.createElement("textarea");
    try {
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      area.remove();
      active?.focus();
    }
  }
}

export interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "children"> {
  /** The text to copy. */
  value: string;
  /** What the button copies, such as "Copy the address". The accessible name and tooltip. @default "Copy" */
  label?: string;
  /** Show `label` as text beside the icon instead of in a tooltip. */
  showText?: boolean;
  /** Called after a successful copy. */
  onCopied?: () => void;
  /** Called when the browser blocks copying, for example to show a toast. */
  onCopyError?: () => void;
}

const BLOCKED = "Copying is blocked here. Select the text and copy it by hand.";

/**
 * A small button that copies `value` and confirms with "Copied". When the
 * browser blocks copying, the icon turns to an alert and the tooltip and the
 * screen reader say to copy by hand. Needs a TooltipProvider above it.
 */
const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    { value, label = "Copy", showText = false, onCopied, onCopyError, onClick, className, ...props },
    ref,
  ) => {
    const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle");
    const timer = React.useRef<number | undefined>(undefined);
    React.useEffect(() => () => window.clearTimeout(timer.current), []);

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      window.clearTimeout(timer.current);
      if (await copyText(value)) {
        setState("copied");
        onCopied?.();
        timer.current = window.setTimeout(() => setState("idle"), 1500);
      } else {
        // Stays until the next try, so hovering later still explains it.
        setState("failed");
        onCopyError?.();
      }
    };

    const Icon = state === "copied" ? Check : state === "failed" ? CircleAlert : Copy;
    const text = state === "copied" ? "Copied" : state === "failed" ? "Copy blocked" : label;
    const button = (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        aria-label={showText ? undefined : label}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm text-muted-foreground transition-colors ease-standard",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
          "disabled:pointer-events-none disabled:opacity-40",
          showText ? "h-8 px-2.5 text-[13px] font-medium" : "size-8",
          className,
        )}
        {...props}
      >
        <Icon
          aria-hidden="true"
          className={cn(
            "size-4",
            state === "copied" && "text-success",
            state === "failed" && "text-error",
          )}
        />
        {showText && text}
        <span className="sr-only" aria-live="polite">
          {state === "copied" ? "Copied" : state === "failed" ? BLOCKED : ""}
        </span>
      </button>
    );
    // Always inside the Tooltip, even when there is nothing to say, so the
    // button isn't remounted (and doesn't lose focus) when the state changes.
    const tip = state === "failed" ? BLOCKED : showText ? null : text;
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        {tip && <TooltipContent>{tip}</TooltipContent>}
      </Tooltip>
    );
  },
);
CopyButton.displayName = "CopyButton";

export { CopyButton };
