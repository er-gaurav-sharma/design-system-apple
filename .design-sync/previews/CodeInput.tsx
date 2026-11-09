import * as React from "react";
import { CodeInput, FieldError, Label } from "@claude-design/dashboard-ui";

/** Six boxes. Type, or paste a whole code into any box. */
export const Default = () => {
  const [code, setCode] = React.useState("");
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="code-default">Code from your authenticator app</Label>
      <CodeInput id="code-default" value={code} onChange={setCode} />
    </div>
  );
};

/** invalid marks every box; pair it with a FieldError. */
export const Invalid = () => {
  const [code, setCode] = React.useState("482913");
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="code-invalid">Code from your authenticator app</Label>
      <CodeInput id="code-invalid" value={code} onChange={setCode} invalid />
      <FieldError>That code didn&rsquo;t match. Try the current one.</FieldError>
    </div>
  );
};

/** disabled while the code is being checked. */
export const Disabled = () => <CodeInput value="4829" onChange={() => {}} disabled aria-label="Code being checked" />;
