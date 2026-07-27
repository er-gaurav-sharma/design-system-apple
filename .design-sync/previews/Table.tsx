import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableSortButton,
  Badge,
} from "@claude-design/dashboard-ui";

const invoices = [
  { id: "INV-2043", customer: "Northwind Traders", plan: "Enterprise", amount: "$4,800.00", status: "Paid" },
  { id: "INV-2042", customer: "Contoso Ltd.", plan: "Team", amount: "$1,240.00", status: "Paid" },
  { id: "INV-2041", customer: "Fabrikam Inc.", plan: "Team", amount: "$1,240.00", status: "Pending" },
  { id: "INV-2040", customer: "Adventure Works", plan: "Starter", amount: "$320.00", status: "Overdue" },
];

const statusVariant = {
  Paid: "success",
  Pending: "warning",
  Overdue: "error",
} as const;

/** The canonical composition: header, body, and a caption describing the set. */
export const Default = () => (
  <Table>
    <TableCaption>Invoices issued in the last 30 days.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Plan</TableHead>
        <TableHead className="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {invoices.map((row) => (
        <TableRow key={row.id}>
          <TableCell className="font-medium">{row.id}</TableCell>
          <TableCell>{row.customer}</TableCell>
          <TableCell>{row.plan}</TableCell>
          <TableCell className="text-right tabular-nums">{row.amount}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

/**
 * TableSortButton inside a TableHead. `sorted` is "asc" | "desc" | false — the
 * unsorted columns keep a dimmed affordance so the whole row reads as sortable.
 */
export const SortableHeaders = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>
          <TableSortButton>Invoice</TableSortButton>
        </TableHead>
        <TableHead>
          <TableSortButton sorted="asc">Customer</TableSortButton>
        </TableHead>
        <TableHead>
          <TableSortButton sorted="desc">Plan</TableSortButton>
        </TableHead>
        <TableHead className="text-right">
          <TableSortButton>Amount</TableSortButton>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {invoices.slice(0, 3).map((row) => (
        <TableRow key={row.id}>
          <TableCell className="font-medium">{row.id}</TableCell>
          <TableCell>{row.customer}</TableCell>
          <TableCell>{row.plan}</TableCell>
          <TableCell className="text-right tabular-nums">{row.amount}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

/** Status cells carry a Badge; a TableFooter totals the column. */
export const WithStatusAndFooter = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {invoices.map((row) => (
        <TableRow key={row.id}>
          <TableCell className="font-medium">{row.id}</TableCell>
          <TableCell>{row.customer}</TableCell>
          <TableCell>
            <Badge variant={statusVariant[row.status as keyof typeof statusVariant]}>
              {row.status}
            </Badge>
          </TableCell>
          <TableCell className="text-right tabular-nums">{row.amount}</TableCell>
        </TableRow>
      ))}
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colSpan={3}>Total outstanding</TableCell>
        <TableCell className="text-right tabular-nums">$1,560.00</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
);

/** Row selection uses data-state="selected" on TableRow. */
export const SelectedRow = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead className="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {invoices.slice(0, 3).map((row, i) => (
        <TableRow key={row.id} data-state={i === 1 ? "selected" : undefined}>
          <TableCell className="font-medium">{row.id}</TableCell>
          <TableCell>{row.customer}</TableCell>
          <TableCell className="text-right tabular-nums">{row.amount}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
