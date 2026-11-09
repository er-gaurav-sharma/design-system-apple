import * as React from "react";

import { cn } from "@/lib/utils";

export interface CodeInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue" | "id"> {
  /** The digits so far. A space marks an empty box before a filled one. */
  value: string;
  onChange: (value: string) => void;
  /** Called once every box holds a digit. */
  onComplete?: (value: string) => void;
  /** @default 6 */
  length?: number;
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  /** The id of the first box, so a `<Label htmlFor>` focuses it. */
  id?: string;
}

/**
 * One box per digit for an authenticator or emailed code. Typing moves to the
 * next box, Backspace in an empty box goes back, and pasting or autofilling a
 * whole code fills every box. Name the group with `aria-label` or
 * `aria-labelledby`; the default is "6-digit code".
 */
const CodeInput = React.forwardRef<HTMLDivElement, CodeInputProps>(
  (
    {
      value,
      onChange,
      onComplete,
      length = 6,
      invalid,
      disabled,
      autoFocus,
      id,
      className,
      ...props
    },
    ref,
  ) => {
    const boxes = React.useRef<(HTMLInputElement | null)[]>([]);
    const digits = Array.from({ length }, (_, i) => (/\d/.test(value[i] ?? "") ? value[i] : ""));

    React.useEffect(() => {
      if (autoFocus) boxes.current[0]?.focus();
    }, [autoFocus]);

    const focusBox = (i: number) => boxes.current[Math.max(0, Math.min(length - 1, i))]?.focus();

    const emit = (next: string[]) => {
      const text = next.map((d) => d || " ").join("").trimEnd();
      onChange(text);
      if (next.every((d) => d)) onComplete?.(text);
    };

    /** Writes `ds` from box `start` on, or the whole code from box 0. */
    const fill = (start: number, ds: string) => {
      const from = ds.length >= length ? 0 : start;
      const next = [...digits];
      for (let k = 0; k < ds.length && from + k < length; k++) next[from + k] = ds[k];
      emit(next);
      focusBox(from + ds.length);
    };

    return (
      <div
        ref={ref}
        role="group"
        aria-label={props["aria-labelledby"] ? undefined : `${length}-digit code`}
        className={cn("flex gap-2", className)}
        {...props}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            id={i === 0 ? id : undefined}
            ref={(el) => {
              boxes.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={invalid || undefined}
            disabled={disabled}
            value={digit}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => {
              const ds = e.currentTarget.value.replace(/\D/g, "");
              if (ds.length >= length) return fill(0, ds.slice(0, length));
              // A typed digit replaces the box's digit; anything else clears it.
              const d = ds.slice(-1);
              const next = [...digits];
              next[i] = d;
              emit(next);
              if (d && i < length - 1) focusBox(i + 1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digit && i > 0) {
                e.preventDefault();
                const next = [...digits];
                next[i - 1] = "";
                emit(next);
                focusBox(i - 1);
              } else if (e.key === "ArrowLeft" && i > 0) {
                e.preventDefault();
                focusBox(i - 1);
              } else if (e.key === "ArrowRight" && i < length - 1) {
                e.preventDefault();
                focusBox(i + 1);
              }
            }}
            onPaste={(e) => {
              const ds = e.clipboardData.getData("text").replace(/\D/g, "");
              if (!ds) return;
              e.preventDefault();
              fill(i, ds.slice(0, length));
            }}
            className={cn(
              "h-12 w-11 min-w-0 rounded-md border border-input bg-background text-center font-mono text-xl tabular-nums text-foreground transition-[color,box-shadow,border-color] ease-standard",
              "hover:border-text-tertiary",
              "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
              "disabled:cursor-not-allowed disabled:bg-muted disabled:text-text-tertiary",
              "aria-[invalid=true]:border-error aria-[invalid=true]:focus-visible:ring-error/20",
            )}
          />
        ))}
      </div>
    );
  },
);
CodeInput.displayName = "CodeInput";

export { CodeInput };
