import * as React from "react";
import { Meter } from "@claude-design/dashboard-ui";

/** The three default bands: below 4, 4 to 7, and 7 and over, with the number beside it. */
export const Bands = () => (
  <div className="flex flex-col gap-3">
    {[2.1, 5.4, 8.7].map((v) => (
      <div key={v} className="flex items-center gap-3">
        <span className="w-8 text-right text-[13px] font-medium tabular-nums">{v.toFixed(1)}</span>
        <Meter value={v} label="Risk score" valueText={`${v.toFixed(1)} of 10.0`} />
      </div>
    ))}
  </div>
);

/** size="md" fills its container, for a detail page. */
export const Medium = () => (
  <div className="flex max-w-xs flex-col gap-2">
    <div className="flex items-baseline justify-between text-[13px]">
      <span className="text-muted-foreground">Risk score</span>
      <span className="font-semibold tabular-nums">6.3</span>
    </div>
    <Meter value={6.3} size="md" label="Risk score" />
  </div>
);

/** Bands, colours and max are props: here a 0 to 100 disk meter that turns amber at 80 and red at 95. */
export const CustomBands = () => (
  <div className="flex max-w-xs flex-col gap-3">
    {[42, 86, 97].map((v) => (
      <div key={v} className="flex items-center gap-3">
        <Meter
          value={v}
          max={100}
          marks={[80, 95]}
          tones={["success", "warning", "error"]}
          size="md"
          label="Disk used"
          valueText={`${v}%`}
        />
        <span className="w-10 text-right text-[13px] tabular-nums">{v}%</span>
      </div>
    ))}
  </div>
);
