# Known issues and technical debt

Open at the time of writing. None of these are guarded by a check, so they will not surface
on their own.

## Open: four contrast failures found by the v1.4.0 render audit

v1.4.0 fixed the seven light-mode token pairs that failed the original audit (details and
before/after ratios in `.design-sync/NOTES.md`). A second audit that renders every preview in
both themes found four more, all in components that predate v1.4.0:

- `AppShell`'s active nav item and avatar initials: `text-primary` on `bg-accent`, 4.12:1
  light and 3.37:1 dark.
- `LoginForm`'s "Forgot?" link and `Calendar`'s today: `text-primary` on `--card` in dark,
  3.69:1.
- `Alert` descriptions on the error and info variants: `text-muted-foreground` on the subtle
  fills in light, 4.32:1 and 4.45:1.
- `Calendar` days outside the month, faded with `opacity-60`: 2.26:1 light, 2.71:1 dark.

Rerun the render audit after any token or component colour change; a token-pair check alone
misses text that sits on a tinted surface.

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
