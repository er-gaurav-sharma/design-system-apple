import * as React from "react";
import { CopyButton, TooltipProvider } from "@claude-design/dashboard-ui";

/** Icon only, beside the value it copies. The label is the tooltip and the accessible name. */
export const IconOnly = () => (
  <TooltipProvider>
    <div className="flex items-center gap-1">
      <code className="font-mono text-[13px]">198.51.100.24</code>
      <CopyButton value="198.51.100.24" label="Copy the address" />
    </div>
  </TooltipProvider>
);

/** With text, for a toolbar. "Copied" replaces the label for a moment after a copy. */
export const WithText = () => (
  <TooltipProvider>
    <CopyButton value="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExampleKeyOnly" label="Copy public key" showText />
  </TooltipProvider>
);
