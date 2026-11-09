import * as React from "react";
import { QrCode } from "@claude-design/dashboard-ui";

const uri = "otpauth://totp/Example%20Console:alex.morgan?secret=JBSWY3DPEHPK3PXP&issuer=Example%20Console";

/** Dark on light in both themes, so every authenticator app can read it. */
export const Default = () => (
  <QrCode value={uri} label="QR code to add Example Console for alex.morgan to an authenticator app" />
);

/** size sets the width and height in pixels. */
export const Small = () => <QrCode value={uri} size={120} label="QR code for an authenticator app" />;
