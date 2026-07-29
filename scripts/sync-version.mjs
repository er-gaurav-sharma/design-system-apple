#!/usr/bin/env node
/**
 * Rewrites every version-pinned registry URL to match package.json.
 *
 * Items in this registry depend on each other by absolute, tag-pinned URL —
 * see scripts/check-registry.mjs for why bare names are unsafe. The cost of
 * that is a version string embedded in dozens of places, which drifts the
 * moment someone bumps the package (README.md was still advertising v1.2.0
 * install commands one release after the fact). This makes the bump the only
 * manual step. Runs automatically as part of `npm run registry:build`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { version } = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));

/** Any pinned raw-content URL into this repo, whatever tag it currently names. */
const PINNED = /(raw\.githubusercontent\.com\/er-gaurav-sharma\/design-system-apple\/)v\d+\.\d+\.\d+(\/)/g;
const TARGETS = ["registry.json", "README.md"];

let changed = 0;
for (const file of TARGETS) {
  const path = resolve(root, file);
  const before = readFileSync(path, "utf8");
  const after = before.replace(PINNED, `$1v${version}$2`);
  if (before !== after) {
    writeFileSync(path, after);
    changed += 1;
    console.log(`  updated ${file}`);
  }
}

console.log(
  changed
    ? `pinned registry URLs → v${version} (${changed} file${changed === 1 ? "" : "s"})`
    : `pinned registry URLs already at v${version}`,
);
