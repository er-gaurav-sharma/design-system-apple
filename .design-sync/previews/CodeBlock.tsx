import * as React from "react";
import { CodeBlock } from "@claude-design/dashboard-ui";

const log = `2024-05-15 09:12:44 deny src=203.0.113.45:51544 dst=192.0.2.10:443 proto=tcp rule="Block inbound" bytes=0
2024-05-15 09:12:45 deny src=203.0.113.45:51546 dst=192.0.2.10:443 proto=tcp rule="Block inbound" bytes=0
2024-05-15 09:12:47 allow src=198.51.100.7:40122 dst=192.0.2.10:443 proto=tcp rule="Web" bytes=5120`;

/** Wrapped by default, so a long line never widens the page. */
export const Wrapped = () => <CodeBlock text={log} />;

/** wrap={false} keeps each line whole and scrolls sideways; maxHeight scrolls down. */
export const ScrollingWithHeightLimit = () => (
  <CodeBlock text={`${log}\n${log}\n${log}`} wrap={false} maxHeight={120} />
);

/** Markup in the text shows as text. It is never parsed as HTML. */
export const MarkupStaysText = () => (
  <CodeBlock text={'GET /search?q=<script>alert(1)</script> 400\nUser-Agent: <img src=x onerror=alert(1)>'} />
);
