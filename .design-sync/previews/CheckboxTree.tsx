import * as React from "react";
import { Badge, CheckboxTree } from "@claude-design/dashboard-ui";

const groups = [
  {
    id: "auth",
    label: "Sign-in",
    meta: "1,204",
    items: [
      { id: "auth-ok", label: "Successful sign-in", meta: "1,050" },
      { id: "auth-fail", label: "Failed sign-in", meta: "142" },
      { id: "auth-lock", label: "Account locked", hint: "after 5 failures", meta: "12" },
    ],
  },
  {
    id: "net",
    label: "Network",
    meta: "38,911",
    items: [
      { id: "net-deny", label: "Connection denied", meta: "30,422" },
      { id: "net-scan", label: "Port scan", meta: "8,480" },
      { id: "net-new", label: "UNKNOWN_PROTO", mono: true, badge: <Badge variant="info">New</Badge>, meta: "9" },
    ],
  },
];

/** Some items unticked: their group shows a dash and says how many are selected. */
export const Default = () => {
  const [checked, setChecked] = React.useState(["auth-ok", "auth-fail", "net-deny", "net-scan", "net-new"]);
  return (
    <CheckboxTree
      label="Events to count"
      groups={groups}
      checked={checked}
      onCheckedChange={setChecked}
      labelHeading="Category and type"
      metaHeading="Last 7 days"
    />
  );
};

/** searchable adds a box that narrows the items and opens every group. */
export const Searchable = () => {
  const [checked, setChecked] = React.useState(groups.flatMap((g) => g.items.map((i) => i.id)));
  return (
    <CheckboxTree
      label="Events to count"
      groups={groups}
      checked={checked}
      onCheckedChange={setChecked}
      searchable
      searchPlaceholder="Search types"
    />
  );
};
