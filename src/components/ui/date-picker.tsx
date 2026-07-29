import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type { DateRange };

/** Matches SelectTrigger, so a date field sits in a <Field> like any control. */
const triggerClassName = cn(
  "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm transition-[color,box-shadow,border-color] ease-standard",
  "hover:border-text-tertiary",
  "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
  "disabled:cursor-not-allowed disabled:bg-muted disabled:text-text-tertiary",
  "aria-[invalid=true]:border-error",
);

/** ISO date, i.e. what an <input type="date"> would have submitted. */
const toISODate = (date: Date) => format(date, "yyyy-MM-dd");

interface DatePickerBaseProps {
  id?: string;
  /** Emits a hidden input carrying the ISO date, so FormData picks it up. */
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Marks the trigger invalid, matching Input/SelectTrigger. */
  "aria-invalid"?: boolean;
  className?: string;
  /** How the selected date reads in the trigger. date-fns tokens. @default "d MMM yyyy" */
  displayFormat?: string;
}

/**
 * Controlled when `value` is passed, uncontrolled otherwise — the same shape
 * Radix uses, so either style works without a wrapper.
 */
function useDateState<T>(value: T | undefined, defaultValue: T | undefined, onChange?: (next: T) => void) {
  const [uncontrolled, setUncontrolled] = React.useState<T | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolled;
  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [current, set] as const;
}

export interface DatePickerProps extends DatePickerBaseProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  /** Days the user cannot pick. Passed straight to react-day-picker. */
  disabledDates?: React.ComponentProps<typeof Calendar>["disabled"];
}

/**
 * Single-date field: a form-styled trigger that opens a Calendar in a Popover.
 * A drop-in replacement for `<Input type="date">` that renders the same in
 * every browser and follows the design tokens.
 */
const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      id,
      name,
      value,
      defaultValue,
      onValueChange,
      placeholder = "Pick a date",
      disabled = false,
      disabledDates,
      displayFormat = "d MMM yyyy",
      className,
      "aria-invalid": ariaInvalid,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = useDateState<Date | undefined>(value, defaultValue, onValueChange);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          ref={ref}
          id={id}
          type="button"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(triggerClassName, !date && "text-text-tertiary", className)}
        >
          <span className="truncate">{date ? format(date, displayFormat) : placeholder}</span>
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </PopoverTrigger>
        {name && <input type="hidden" name={name} value={date ? toISODate(date) : ""} />}
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            autoFocus
            defaultMonth={date}
            selected={date}
            disabled={disabledDates}
            onSelect={(next) => {
              setDate(next);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  },
);
DatePicker.displayName = "DatePicker";

export interface DateRangePickerProps extends DatePickerBaseProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  disabledDates?: React.ComponentProps<typeof Calendar>["disabled"];
  /** Months shown side by side. @default 2 */
  numberOfMonths?: number;
}

/**
 * Two-date field for "between these dates" filters. Emits `<name>-from` and
 * `<name>-to` hidden inputs when `name` is set, so a range submits as two ISO
 * dates — the shape most list endpoints already take.
 */
const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      id,
      name,
      value,
      defaultValue,
      onValueChange,
      placeholder = "Pick a date range",
      disabled = false,
      disabledDates,
      displayFormat = "d MMM yyyy",
      numberOfMonths = 2,
      className,
      "aria-invalid": ariaInvalid,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [range, setRange] = useDateState<DateRange | undefined>(value, defaultValue, onValueChange);

    const label = range?.from
      ? range.to
        ? `${format(range.from, displayFormat)} – ${format(range.to, displayFormat)}`
        : format(range.from, displayFormat)
      : placeholder;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          ref={ref}
          id={id}
          type="button"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(triggerClassName, !range?.from && "text-text-tertiary", className)}
        >
          <span className="truncate">{label}</span>
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </PopoverTrigger>
        {name && (
          <>
            <input
              type="hidden"
              name={`${name}-from`}
              value={range?.from ? toISODate(range.from) : ""}
            />
            <input type="hidden" name={`${name}-to`} value={range?.to ? toISODate(range.to) : ""} />
          </>
        )}
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            autoFocus
            defaultMonth={range?.from}
            selected={range}
            disabled={disabledDates}
            numberOfMonths={numberOfMonths}
            onSelect={setRange}
          />
        </PopoverContent>
      </Popover>
    );
  },
);
DateRangePicker.displayName = "DateRangePicker";

export { DatePicker, DateRangePicker };
