import * as React from "react";
import { Alert, AlertTitle, AlertDescription } from "@claude-design/dashboard-ui";

/** The four semantic variants. Each picks its own glyph and subtle surface. */
export const Variants = () => (
  <div className="flex max-w-xl flex-col gap-3">
    <Alert variant="info">
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>
        Reporting will be read-only on Sunday 02:00–04:00 UTC.
      </AlertDescription>
    </Alert>
    <Alert variant="success">
      <AlertTitle>Workspace verified</AlertTitle>
      <AlertDescription>
        Your domain acme.com is confirmed — SSO is now available.
      </AlertDescription>
    </Alert>
    <Alert variant="warning">
      <AlertTitle>Approaching seat limit</AlertTitle>
      <AlertDescription>
        You are using 312 of 400 seats. Add seats before inviting more members.
      </AlertDescription>
    </Alert>
    <Alert variant="error">
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        We couldn&rsquo;t charge the card ending 4242. Update it to avoid interruption.
      </AlertDescription>
    </Alert>
  </div>
);

/** Title only — fine for short, self-evident messages. */
export const TitleOnly = () => (
  <div className="flex max-w-xl flex-col gap-3">
    <Alert variant="success">
      <AlertTitle>Settings saved.</AlertTitle>
    </Alert>
    <Alert variant="error">
      <AlertTitle>Could not connect to the data warehouse.</AlertTitle>
    </Alert>
  </div>
);

/** hideIcon drops the leading glyph and lets the text run full width. */
export const WithoutIcon = () => (
  <Alert variant="info" hideIcon className="max-w-xl">
    <AlertTitle>Release 2024.5 is live</AlertTitle>
    <AlertDescription>
      Saved views now sync across devices, and CSV export supports scheduled delivery.
    </AlertDescription>
  </Alert>
);
