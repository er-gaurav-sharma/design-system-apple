import * as React from "react";
import { SecretField } from "@claude-design/dashboard-ui";

/** Nothing saved yet: a password input and Save. */
export const Empty = () => {
  const [saved, setSaved] = React.useState<{ on: string; by: string } | null>(null);
  return (
    <SecretField
      id="secret-empty"
      label="API key"
      className="max-w-md"
      saved={saved}
      onSave={() => setSaved({ on: "2024-05-15", by: "Alex Morgan" })}
    />
  );
};

/** Saved: who saved it and when, never the value. Replace opens the input again, with Cancel. */
export const Saved = () => {
  const [saved, setSaved] = React.useState({ on: "2024-05-13", by: "Alex Morgan" });
  return (
    <SecretField
      id="secret-saved"
      label="Password"
      className="max-w-md"
      saved={saved}
      onSave={() => setSaved({ on: "2024-05-15", by: "Sam Lee" })}
    />
  );
};
