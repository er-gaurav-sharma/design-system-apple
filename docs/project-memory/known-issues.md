# Known issues and technical debt

Open at the time of writing. None of these are guarded by a check, so they will not surface
on their own.

## Open: light-mode contrast audit

The light palette has **not** been through the same contrast derivation the dark palette
received (see [decisions.md](decisions.md#dark-values-are-contrast-derived-not-aesthetic)).
Dark values were deepened to clear AA; the light values are still Apple's published hexes,
unaudited. Treat any light-mode contrast complaint as expected rather than surprising. The
running detail is in `.design-sync/NOTES.md`.

## `ui/sonner.tsx` hard-codes `theme="light"`

The Sonner `<Toaster>` is passed `theme="light"` unconditionally. Its `classNames` are
token-mapped, so it still *follows* `.dark` visually and nobody has noticed — but the prop is
not wired to the class. Any Sonner behaviour that keys off the `theme` prop rather than the
resolved classNames will be wrong in dark mode.

## The bundle on disk is disposable and often stale

`ds-bundle/` is wiped and rewritten every re-sync, and is routinely stale relative to
`package.json`. A `_ds_needs_recompile` marker means exactly that — the bundle predates the
current source. Don't reason about the sync from what is currently on disk; re-run it.

## Re-sync risk watch-list

`.design-sync/NOTES.md` carries the maintained watch-list of things that break a re-sync,
alongside the engineering log: build shape, the CSS safelist rationale, the font data-URI
story, registry pitfalls, and the list of already-fixed component defects. **Read it before
changing anything in the sync path** — it is the one document here that is updated per
incident rather than per release.
