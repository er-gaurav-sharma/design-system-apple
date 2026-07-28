import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Page slots rendered between the prev/next controls, ellipses included. */
const PAGE_SLOTS = 7;

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * First page, last page, the current page and one sibling either side — padded
 * at the edges so the control keeps a constant width as you page through.
 */
function getPageItems(page: number, pageCount: number): (number | "ellipsis")[] {
  if (pageCount <= PAGE_SLOTS) return range(1, pageCount);
  const leftEllipsis = page - 1 > 3;
  const rightEllipsis = page + 1 < pageCount - 2;
  if (!leftEllipsis && rightEllipsis) return [...range(1, 5), "ellipsis", pageCount];
  if (leftEllipsis && !rightEllipsis)
    return [1, "ellipsis", ...range(pageCount - 4, pageCount)];
  return [1, "ellipsis", ...range(page - 1, page + 1), "ellipsis", pageCount];
}

export interface PaginationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Current page, 1-based. */
  page: number;
  pageSize: number;
  /** Total rows across every page — e.g. `total` from a list endpoint. */
  total: number;
  onPageChange: (page: number) => void;
  /** Omit to hide the rows-per-page control. */
  onPageSizeChange?: (size: number) => void;
  /** @default [10, 25, 50, 100] */
  pageSizeOptions?: number[];
  disabled?: boolean;
}

/**
 * Page navigation for list endpoints that return `{ page, pageSize, total }`.
 * Renders prev/next, a truncated page list, an optional rows-per-page select
 * and a live range readout. Below `sm` the number list collapses to a
 * "Page 3 of 128" readout so the controls still fit a phone.
 */
const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      page,
      pageSize,
      total,
      onPageChange,
      onPageSizeChange,
      pageSizeOptions = [10, 25, 50, 100],
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const sizeId = React.useId();
    const safeSize = pageSize > 0 ? Math.trunc(pageSize) : 1;
    const safeTotal = total > 0 ? Math.trunc(total) : 0;
    const pageCount = Math.max(1, Math.ceil(safeTotal / safeSize));
    const current = Math.min(Math.max(1, Math.trunc(page) || 1), pageCount);

    const first = safeTotal === 0 ? 0 : (current - 1) * safeSize + 1;
    const last = Math.min(current * safeSize, safeTotal);
    const rangeLabel =
      safeTotal === 0
        ? "No results"
        : `${first.toLocaleString()}–${last.toLocaleString()} of ${safeTotal.toLocaleString()}`;

    const goTo = (next: number) => {
      const clamped = Math.min(Math.max(1, next), pageCount);
      if (clamped !== current) onPageChange(clamped);
    };

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
          className,
        )}
        {...props}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {onPageSizeChange && (
            <div className="flex items-center gap-2">
              <Label htmlFor={sizeId} className="text-muted-foreground">
                Rows per page
              </Label>
              <Select
                value={String(safeSize)}
                onValueChange={(value) => onPageSizeChange(Number(value))}
                disabled={disabled}
              >
                <SelectTrigger id={sizeId} className="h-9 w-[78px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <p
            aria-live="polite"
            className="text-[13px] tabular-nums text-muted-foreground"
          >
            {rangeLabel}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            className="w-9 px-0"
            aria-label="Previous page"
            disabled={disabled || current <= 1}
            onClick={() => goTo(current - 1)}
          >
            <ChevronLeft />
          </Button>

          <span className="px-2 text-[13px] tabular-nums text-muted-foreground sm:hidden">
            Page {current.toLocaleString()} of {pageCount.toLocaleString()}
          </span>

          <ul className="hidden items-center gap-1 sm:flex">
            {getPageItems(current, pageCount).map((item, index) =>
              item === "ellipsis" ? (
                <li
                  key={`ellipsis-${index}`}
                  aria-hidden="true"
                  className="flex size-9 items-center justify-center text-text-tertiary"
                >
                  <MoreHorizontal className="size-4" />
                </li>
              ) : (
                <li key={item}>
                  <Button
                    variant={item === current ? "primary" : "secondary"}
                    size="sm"
                    className="w-9 px-0 tabular-nums"
                    aria-label={`Go to page ${item}`}
                    aria-current={item === current ? "page" : undefined}
                    disabled={disabled}
                    onClick={() => goTo(item)}
                  >
                    {item}
                  </Button>
                </li>
              ),
            )}
          </ul>

          <Button
            variant="secondary"
            size="sm"
            className="w-9 px-0"
            aria-label="Next page"
            disabled={disabled || current >= pageCount}
            onClick={() => goTo(current + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </nav>
    );
  },
);
Pagination.displayName = "Pagination";

export { Pagination };
