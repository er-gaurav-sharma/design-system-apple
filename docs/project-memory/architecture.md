# Architecture

`src/` is the single source of truth. It feeds **two unrelated distribution channels**.

```
                        src/**  ← the only place you edit
                          │
      ┌───────────────────┴────────────────────┐
      │                                        │
  registry.json                        .design-sync/   (contract, committed)
      │ shadcn build                           │ .ds-sync/   (machine, gitignored)
      ▼                                        ▼ ds-bundle/  (payload, gitignored)
  public/r/*.json  (generated, COMMITTED)   Claude Design project
      │                                        │  via the `claude-design` MCP server
      ▼                                        ▼  (.mcp.json + projectId in
  npx shadcn add <tag-pinned raw URL>       design agent builds screens   config.json)
```

The two channels share nothing but `src/`. **A change to a component must be pushed down
both, or one side silently ships stale code.** Neither channel notices the other going out
of date, and neither failure breaks a build.

- **Channel 1 — the shadcn registry.** `registry.json` is compiled by `shadcn build` into
  `public/r/*.json`, which is committed. Consumers install with
  `npx shadcn add <tag-pinned raw URL>`. See
  [release-process.md](release-process.md) for how the pinned tag works.
- **Channel 2 — the Claude Design sync.** `.design-sync/` (committed contract) is consumed by
  `.ds-sync/` (gitignored machine) to produce `ds-bundle/` (gitignored payload), which is
  uploaded to a Claude Design project through the `claude-design` MCP server. The wiring is
  `.mcp.json` plus `projectId` in `.design-sync/config.json`. The design agent then builds
  screens against the real components. Full contract: `.claude/rules/design-sync.md`.

The guard that keeps both channels honest is `npm run registry:check`.

## AppShell runtime architecture

`app-shell.tsx` is the only file in the library with real runtime behaviour.

`src/components/dashboard/app-shell.tsx` is the one file with non-trivial runtime behaviour.
Everything else in `src/components/**` is presentational. It uses:

- a **`ShellContext` + `useShell()` guard hook** — `useShell()` throws outside the provider
  rather than returning `undefined`, so misuse fails loudly at the call site;
- a **`useSyncExternalStore`-based `useIsMobile()`** — subscribes to the media query rather
  than polling or reading `window` during render, so it is concurrent-safe;
- **Radix `Dialog` reused as the mobile drawer**, deliberately, to inherit its focus trap,
  Escape handling, and scroll lock instead of reimplementing them.

The load-bearing constraint is the comment at `app-shell.tsx:54`: **`useIsMobile()` is for
behaviour only, never layout.** Layout is expressed with `hidden md:flex` / `md:hidden` so it
survives SSR and first paint — a JS-derived boolean is `false` on the server and would flash
the wrong shell. That rule is restated in `.claude/rules/components.md` because it is the one
an author is most likely to violate.
