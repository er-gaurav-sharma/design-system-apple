import * as React from "react";
import QRCode from "qrcode";

import { cn } from "@/lib/utils";

export interface QrCodeProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "children" | "viewBox"> {
  /** The text to encode, such as an otpauth:// link. */
  value: string;
  /** What the code is for. It is the image's accessible name. */
  label: string;
  /** Width and height in pixels. @default 176 */
  size?: number;
  /** How much damage the code survives, from L (7%) to H (30%). @default "M" */
  errorCorrection?: "L" | "M" | "Q" | "H";
}

/** The four-module margin the QR standard asks for around the code. */
const QUIET = 4;

/**
 * Draws `value` as a QR code in SVG. It is always dark on light, in both
 * themes (the --qr-ink and --qr-paper tokens), because some authenticator apps
 * can't read an inverted code. The qrcode package does the encoding.
 */
const QrCode = React.forwardRef<SVGSVGElement, QrCodeProps>(
  ({ value, label, size = 176, errorCorrection = "M", className, ...props }, ref) => {
    const path = React.useMemo(() => {
      try {
        const { modules } = QRCode.create(value, { errorCorrectionLevel: errorCorrection });
        const n = modules.size;
        let d = "";
        for (let y = 0; y < n; y++)
          for (let x = 0; x < n; x++) if (modules.get(x, y)) d += `M${x + QUIET} ${y + QUIET}h1v1h-1z`;
        return { d, span: n + QUIET * 2 };
      } catch {
        // Too long for a QR code, or empty.
        return null;
      }
    }, [value, errorCorrection]);

    return (
      <svg
        ref={ref}
        role="img"
        aria-label={path ? label : `${label} (can't be drawn)`}
        width={size}
        height={size}
        viewBox={path ? `0 0 ${path.span} ${path.span}` : "0 0 100 100"}
        shapeRendering="crispEdges"
        className={cn("shrink-0 rounded-md", className)}
        {...props}
      >
        <rect width="100%" height="100%" fill="var(--qr-paper)" />
        {path ? (
          <path d={path.d} fill="var(--qr-ink)" />
        ) : (
          <text x="50" y="52" textAnchor="middle" fontSize="8" fill="var(--qr-ink)">
            Can&rsquo;t draw this code
          </text>
        )}
      </svg>
    );
  },
);
QrCode.displayName = "QrCode";

export { QrCode };
