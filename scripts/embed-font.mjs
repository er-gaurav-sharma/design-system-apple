#!/usr/bin/env node
/**
 * Generates src/styles/fonts/inter.css from the vendored woff2.
 *
 * The design system has to ship its own @font-face: globals.css names "Inter"
 * in --font-sans, so without a face every consumer silently renders in
 * system-ui. The font therefore has to survive BOTH install paths —
 * copying src/ wholesale, and `shadcn add theme`. `shadcn build` inlines each
 * registered file's content into JSON as UTF-8 text, which a binary .woff2
 * cannot survive, so the face is emitted with the font embedded as a data URI.
 * That is text, so it travels through the registry intact.
 *
 * The .woff2 stays checked in as the source of truth (provenance + license +
 * regenerability); this script is the only thing that should ever write
 * src/styles/fonts/inter.css. Run: npm run font:embed
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = resolve(root, ".design-sync/fonts/inter-latin.woff2");
const OUTPUT = resolve(root, "src/styles/fonts/inter.css");

/** Latin subset, matching the woff2 that Google serves for the latin range. */
const UNICODE_RANGE = [
  "U+0000-00FF",
  "U+0131",
  "U+0152-0153",
  "U+02BB-02BC",
  "U+02C6",
  "U+02DA",
  "U+02DC",
  "U+0304",
  "U+0308",
  "U+0329",
  "U+2000-206F",
  "U+20AC",
  "U+2122",
  "U+2191",
  "U+2193",
  "U+2212",
  "U+2215",
  "U+FEFF",
  "U+FFFD",
].join(", ");

const woff2 = readFileSync(SOURCE);
const base64 = woff2.toString("base64");

const css = `/* Inter — latin subset, variable weight axis (100–900).
   GENERATED FILE — do not edit by hand. Regenerate with \`npm run font:embed\`;
   the source of truth is .design-sync/fonts/inter-latin.woff2.

   The font is embedded as a data URI rather than referenced as a sibling file
   because \`shadcn build\` inlines registered files as UTF-8 text — a binary
   .woff2 cannot travel through the registry, but this can. That makes the
   typeface arrive intact whether a consumer copies src/ or runs
   \`shadcn add theme\`, with no <link> tag and no request to a remote host.

   Vendored from Google Fonts (fonts.gstatic.com/s/inter/v20).
   Inter is licensed under the SIL Open Font License 1.1. */
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url("data:font/woff2;base64,${base64}") format("woff2");
  unicode-range: ${UNICODE_RANGE};
}
`;

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, css);

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log(
  `wrote src/styles/fonts/inter.css (${kb(Buffer.byteLength(css))}, from ${kb(woff2.length)} of woff2)`,
);
