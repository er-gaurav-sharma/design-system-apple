#!/usr/bin/env bash
# Compile the DS's Tailwind v4 source into the static stylesheet design-sync ships.
# Run from the repo root, before every package-build.mjs run (authored previews
# feed the utility scan, so the CSS changes as previews are written).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .design-sync/.cache
npx @tailwindcss/cli \
  -i .design-sync/tailwind-entry.css \
  -o .design-sync/.cache/ds.css \
  --minify
echo "wrote .design-sync/.cache/ds.css ($(wc -c < .design-sync/.cache/ds.css) bytes)"
