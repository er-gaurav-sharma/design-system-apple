import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The two fills for a series that has to read apart from its neighbours
 * without colour, such as in print or for a colour-blind reader.
 * - "hatch": stripes of the colour at 45° over a lighter tint of it, so the
 *   series keeps its hue.
 * - "lines": thin lines of the colour at 135° on the surface, for a quiet
 *   remainder such as "none", or a limit that takes a total down.
 */
export type ChartTexture = "hatch" | "lines";

export interface ChartPatternProps
  extends Omit<React.SVGProps<SVGPatternElement>, "id" | "color" | "ref"> {
  /** The id a fill refers to, as `url(#id)`. Unique on the page. */
  id: string;
  texture: ChartTexture;
  /** A CSS colour, normally a token such as `var(--chart-1)`. */
  color: string;
  /**
   * The colour under the stripes. Use the surface the chart sits on, so that
   * gridlines don't show through a bar. @default "var(--card)"
   */
  surface?: string;
}

/**
 * One texture as an SVG `<pattern>`. Put it in the `<defs>` of the chart's
 * SVG and fill a mark with `url(#id)`. Give the mark a 1px stroke in the same
 * colour so its edge stays solid.
 */
const ChartPattern = React.forwardRef<SVGPatternElement, ChartPatternProps>(
  ({ id, texture, color, surface = "var(--card)", ...props }, ref) =>
    texture === "hatch" ? (
      <pattern
        ref={ref}
        id={id}
        width={6}
        height={6}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
        {...props}
      >
        <rect width={6} height={6} fill={surface} />
        <rect width={6} height={6} fill={color} fillOpacity={0.5} />
        <rect width={2} height={6} fill={color} />
      </pattern>
    ) : (
      <pattern
        ref={ref}
        id={id}
        width={5}
        height={5}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(135)"
        {...props}
      >
        <rect width={5} height={5} fill={surface} />
        <rect width={1.5} height={5} fill={color} />
      </pattern>
    ),
);
ChartPattern.displayName = "ChartPattern";

/** A unique id that is safe inside `url(#…)`. */
function useSvgId() {
  return React.useId().replace(/[^\w-]/g, "");
}

/**
 * The swatch's shape, to match the mark it stands for: "square" for a bar or
 * an area, "dot" and "ring" for a filled and a hollow point, "line" for a
 * line, and "band" for a shaded span.
 */
export type ChartSwatchShape = "square" | "dot" | "ring" | "line" | "band";

export interface ChartSwatchProps
  extends Omit<React.SVGProps<SVGSVGElement>, "color" | "ref"> {
  /** A CSS colour, normally a token such as `var(--chart-1)`. */
  color: string;
  /** Draw a square swatch with this texture instead of a solid fill. */
  texture?: ChartTexture;
  /** @default "square" */
  shape?: ChartSwatchShape;
}

/** A 12px key for one series. Hidden from screen readers; the label beside it names the series. */
const ChartSwatch = React.forwardRef<SVGSVGElement, ChartSwatchProps>(
  ({ color, texture, shape = "square", className, ...props }, ref) => {
    const id = useSvgId();
    const textured = shape === "square" && texture !== undefined;
    return (
      <svg
        ref={ref}
        width={12}
        height={12}
        viewBox="0 0 12 12"
        aria-hidden="true"
        className={cn("shrink-0", className)}
        {...props}
      >
        {textured && (
          <defs>
            <ChartPattern id={id} texture={texture} color={color} surface="transparent" />
          </defs>
        )}
        {shape === "square" && (
          <rect
            x={0.5}
            y={0.5}
            width={11}
            height={11}
            rx={2}
            fill={textured ? `url(#${id})` : color}
            stroke={textured ? color : "none"}
          />
        )}
        {shape === "dot" && <circle cx={6} cy={6} r={5} fill={color} />}
        {shape === "ring" && <circle cx={6} cy={6} r={4} fill="none" stroke={color} strokeWidth={2} />}
        {shape === "line" && <rect x={0} y={5} width={12} height={2} rx={1} fill={color} />}
        {shape === "band" && <rect width={12} height={12} rx={2} fill={color} fillOpacity={0.15} />}
      </svg>
    );
  },
);
ChartSwatch.displayName = "ChartSwatch";

export interface ChartLegendItem {
  /** A stable key; the label is used when it's a string. */
  key?: React.Key;
  label: React.ReactNode;
  /** A CSS colour, normally a token such as `var(--chart-1)`. */
  color: string;
  texture?: ChartTexture;
  /** @default "square" */
  shape?: ChartSwatchShape;
}

export interface ChartLegendProps extends React.HTMLAttributes<HTMLUListElement> {
  items: ChartLegendItem[];
}

/**
 * A row of swatches with labels that wraps on narrow screens. Give every
 * chart with two or more series one, in the same order as the series. A
 * chart's series list can be passed as `items` as it is.
 */
const ChartLegend = React.forwardRef<HTMLUListElement, ChartLegendProps>(
  ({ items, className, ...props }, ref) => (
    <ul
      ref={ref}
      aria-label="Legend"
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {items.map((item, i) => (
        <li
          key={item.key ?? (typeof item.label === "string" ? item.label : i)}
          className="inline-flex items-center gap-1.5"
        >
          <ChartSwatch color={item.color} texture={item.texture} shape={item.shape} />
          {item.label}
        </li>
      ))}
    </ul>
  ),
);
ChartLegend.displayName = "ChartLegend";

export { ChartLegend, ChartSwatch, ChartPattern };
