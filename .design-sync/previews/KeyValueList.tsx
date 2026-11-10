import * as React from "react";
import { KeyValueList } from "@claude-design/dashboard-ui";

/** Connection details in a card. */
export const Default = () => (
  <KeyValueList
    className="max-w-lg"
    items={[
      { label: "Address", value: "192.0.2.10" },
      { label: "Port", value: "6514" },
      { label: "Protocol", value: "Syslog over TLS" },
      { label: "Last event", value: "2 min ago" },
    ]}
  />
);

/** mono for raw fields, such as the parsed keys of a log line. Long values wrap. */
export const Mono = () => (
  <KeyValueList
    mono
    className="max-w-lg"
    items={[
      { label: "srcip", value: "203.0.113.45" },
      { label: "dstport", value: "443" },
      { label: "action", value: "deny" },
      { label: "msg", value: "Request blocked by rule Block-inbound-web after repeated failed handshakes from the same source" },
    ]}
  />
);
