import * as React from "react";
import { Pagination } from "@claude-design/dashboard-ui";

/**
 * The full control: rows-per-page, a live range readout, and a truncated page
 * list. `page` is 1-based; `total` is the row count across every page, so the
 * `{ page, page_size, total }` shape most list endpoints return maps straight
 * onto the props.
 */
export const Default = () => {
  const [page, setPage] = React.useState(2);
  const [pageSize, setPageSize] = React.useState(50);
  return (
    <div className="w-full max-w-3xl">
      <Pagination
        page={page}
        pageSize={pageSize}
        total={12847}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
};

/** Deep in a long range: ellipses on both sides, first and last always reachable. */
export const Truncated = () => {
  const [page, setPage] = React.useState(128);
  return (
    <div className="w-full max-w-3xl">
      <Pagination page={page} pageSize={50} total={12847} onPageChange={setPage} />
    </div>
  );
};

/** At the bounds, prev/next are disabled rather than hidden, so nothing shifts. */
export const FirstPage = () => (
  <div className="w-full max-w-3xl">
    <Pagination page={1} pageSize={25} total={12847} onPageChange={() => {}} />
  </div>
);

/** Short ranges skip the ellipses entirely. */
export const FewPages = () => {
  const [page, setPage] = React.useState(2);
  return (
    <div className="w-full max-w-3xl">
      <Pagination page={page} pageSize={10} total={42} onPageChange={setPage} />
    </div>
  );
};

/** `disabled` freezes every control — pair it with a loading table. */
export const Disabled = () => (
  <div className="w-full max-w-3xl">
    <Pagination
      page={4}
      pageSize={25}
      total={12847}
      onPageChange={() => {}}
      onPageSizeChange={() => {}}
      disabled
    />
  </div>
);
