import * as React from "react";
import { DayPicker, type DayButton as DayButtonType } from "react-day-picker";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/** Shared by the two month-navigation buttons. */
const navButton = cn(
  "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors ease-standard",
  "hover:bg-muted hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
  "disabled:pointer-events-none disabled:opacity-40",
);

/**
 * Republishes react-day-picker's day modifiers as data attributes on the button
 * itself, **made mutually exclusive**.
 *
 * Both halves matter. react-day-picker puts modifier classes on the day's
 * `<td>`, so styling the button through them means two equal-specificity rules
 * (`.selected>button`, `.range_middle>button`) racing on emission order — and
 * in range mode every day between the ends is marked `selected` *as well as*
 * `range_middle`, so that race is the common case, not an edge case. It lost
 * once already: middle days rendered white-on-`--accent`, 1.14:1, unreadable.
 *
 * Collapsing the state to one attribute per day removes the conflict at the
 * source rather than out-specifying it, so no rule can ever shadow another.
 *
 * The `focused` effect is react-day-picker's own DayButton behaviour, kept
 * verbatim — it is what makes keyboard navigation move focus with the cursor.
 */
function DayButton({
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButtonType>) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const inRange = modifiers.range_start || modifiers.range_end || modifiers.range_middle;

  return (
    <button
      ref={ref}
      data-selected-single={(modifiers.selected && !inRange) || undefined}
      data-range-start={modifiers.range_start || undefined}
      data-range-end={modifiers.range_end || undefined}
      data-range-middle={modifiers.range_middle || undefined}
      // Selection is already the strongest emphasis a day can carry, so the
      // today accent stands down rather than fighting it for the text color.
      data-today={(modifiers.today && !modifiers.selected) || undefined}
      data-outside={(modifiers.outside && !modifiers.selected) || undefined}
      {...props}
    />
  );
}

/**
 * Month grid for single, multiple and range selection.
 *
 * react-day-picker's own stylesheet is deliberately NOT imported — every
 * surface below is styled from the design tokens instead, so the calendar
 * follows `.dark` and the accent color like everything else. Importing
 * `react-day-picker/style.css` on top of this would double-style it.
 *
 * Note where the state lives: react-day-picker applies every modifier class
 * (`selected`, `range_start`, `today`, `outside`, …) to the day's `<td>`, never
 * to the button inside it. Modifier styling therefore reaches the button
 * through `[&>button]:`, which also outranks the flat `day_button` class no
 * matter what order Tailwind emits the two rules in.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: "w-fit",
        // `relative` anchors the nav, which react-day-picker renders as a child
        // of Months rather than of the caption it visually sits in.
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex flex-col gap-4",
        month_caption: "flex h-9 items-center justify-center px-9",
        caption_label: "text-sm font-medium",
        nav: "absolute inset-x-0 top-0 flex h-9 items-center justify-between",
        button_previous: navButton,
        button_next: navButton,
        dropdowns: "flex items-center gap-2",
        dropdown_root: "relative",
        dropdown: "absolute inset-0 size-full cursor-pointer opacity-0",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-xs font-medium text-text-tertiary",
        week: "mt-1 flex w-full",
        week_number: "flex w-9 items-center justify-center text-xs text-text-tertiary",
        week_number_header: "w-9",

        // The cell carries only the range tint, which has to run edge to edge.
        // Everything about the day itself is on the button, keyed off the
        // mutually exclusive data attributes DayButton sets above.
        day: "relative size-9 p-0 text-center text-sm",
        range_start: "rounded-l-md bg-accent",
        range_end: "rounded-r-md bg-accent",
        range_middle: "bg-accent",
        hidden: "invisible",

        day_button: cn(
          "inline-flex size-9 items-center justify-center rounded-md font-normal transition-colors ease-standard",
          "hover:bg-muted",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
          "disabled:pointer-events-none disabled:opacity-40",
          "data-[today=true]:font-semibold data-[today=true]:text-accent-foreground",
          // Tertiary text passes only on card or popover, so a hovered outside
          // day (on --muted) switches to muted-foreground.
          "data-[outside=true]:text-text-tertiary data-[outside=true]:hover:text-muted-foreground",
          "data-[selected-single=true]:bg-primary data-[selected-single=true]:font-medium data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:hover:bg-primary-hover",
          "data-[range-start=true]:bg-primary data-[range-start=true]:font-medium data-[range-start=true]:text-primary-foreground data-[range-start=true]:hover:bg-primary-hover",
          "data-[range-end=true]:bg-primary data-[range-end=true]:font-medium data-[range-end=true]:text-primary-foreground data-[range-end=true]:hover:bg-primary-hover",
          // Deliberately `text-foreground`, not `text-accent-foreground`: the
          // cell tint already says "in range", and accent text on the accent
          // tint is 4.56:1, only just over AA for text this small.
          "data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-foreground data-[range-middle=true]:hover:bg-transparent",
        ),
        ...classNames,
      }}
      components={{
        DayButton,
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
          const Icon =
            orientation === "left"
              ? ChevronLeft
              : orientation === "right"
                ? ChevronRight
                : orientation === "up"
                  ? ChevronUp
                  : ChevronDown;
          return <Icon className={cn("size-4", chevronClassName)} {...chevronProps} />;
        },
        ...components,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
