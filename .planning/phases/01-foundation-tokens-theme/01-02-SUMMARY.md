---
phase: 01-foundation-tokens-theme
plan: 02
subsystem: ui
tags: [tailwind-v4, theme, tokens, wcag-contrast, vitest, tdd, a11y, geist]

# Dependency graph
requires:
  - phase: 01-foundation-tokens-theme/01
    provides: vitest config with @/* alias, biome tailwindDirectives parser, wcag-contrast@3.0.0 installed, scaffolded src/app/globals.css ready to overwrite
provides:
  - Tailwind v4 @theme token block in src/app/globals.css — single source of truth for all visual primitives (colors light+dark, fonts, type scale, weights, radii)
  - .dark override block declared AFTER @theme (correct cascade order per PITFALLS §3)
  - Global prefers-reduced-motion reset that binds all downstream phases (UI-SPEC Motion Contract)
  - :focus-visible default (2px accent outline + 2px offset) that every interactive element inherits
  - src/lib/tokens.ts — TS mirror of the six contrast-bearing hex values, `as const`
  - tests/tokens.contrast.test.ts — Vitest gate asserting six WCAG ratios (~120ms)
  - Tailwind v4 utilities auto-generated from tokens: bg-background, text-text-primary, text-text-secondary, bg-accent, text-caption, text-body, text-display, text-mono-sm, font-sans, font-mono
affects: [01-03-layout-and-theme-machinery, 01-04-ci-and-readme, 03-shell-nav-footer, 04-hero-sections, 05-projects, 07-launch-audit]

# Tech tracking
tech-stack:
  added: []  # All deps already installed in Plan 01
  patterns:
    - "SP-4: WCAG-AA contrast enforced at the token layer (three thresholds × two themes = six assertions)"
    - "SP-5: Typography tokenized via Tailwind v4 @theme (major-third 1.25 ratio × 10 type tokens + 3 weight tokens)"
    - "Two-source-of-truth with comment-enforced manual sync: globals.css ↔ src/lib/tokens.ts (RESEARCH §Pitfall 6 Option 3)"
    - "Cascade discipline: .dark override declared AFTER @theme (PITFALLS §3)"
    - "Global reduced-motion reset in globals.css binds every phase by default"
    - "TDD at the plan level: RED commit (failing test on missing @/lib/tokens) precedes GREEN commit (token implementation)"

key-files:
  created:
    - src/lib/tokens.ts
    - tests/tokens.contrast.test.ts
  modified:
    - src/app/globals.css (overwritten — scaffold `@theme inline` + `:root` block replaced with full token contract)
    - next-env.d.ts (Next.js auto-regenerated on first build after CSS edit — routes.d.ts path shifted)

key-decisions:
  - "Adopted UI-SPEC's comment-enforced manual sync (RESEARCH §Pitfall 6 Option 3) over regex-parse (Option 2) because the token set is small (six hex values), changes are rare, and comments in both files pointing at each other + the contrast test make drift conspicuous"
  - "Kept the `!important` declarations in the prefers-reduced-motion reset despite Biome warnings — the reset is binding per UI-SPEC and must beat any future component-level animation CSS (intentional reversal of the cascade)"
  - "Accepted Biome's auto-formatting: normalized comment spacing in globals.css, split the universal selector across multiple lines in the reduced-motion block, and reordered imports in the test file. No semantic change; Biome is the source of truth for formatting per D-04"
  - "Committed Next.js's regeneration of next-env.d.ts alongside the GREEN commit (first build after CSS edit shifted routes.d.ts path). Next owns this file; committing keeps typecheck reproducible on a fresh clone"

patterns-established:
  - "Token-first contract: every visual primitive downstream of Phase 1 resolves to a --color-*, --text-*, --font-*, or --radius-* token declared here — no hex/rem/px literals in component JSX"
  - "Contrast-gate-as-test: six WCAG ratios assert in ~120ms via Vitest; a regression is caught before commit, never weakened (UI-SPEC binding)"
  - "globals.css five-block structure (import → custom-variant → @theme → .dark → reset/focus) is the analog for any future CSS token addition"

requirements-completed: [FOUND-02, FOUND-04, A11Y-03]

# Metrics
duration: 5min
completed: 2026-04-21
---

# Phase 1 Plan 2: Tokens + Contrast Gate Summary

**Tailwind v4 `@theme` token contract shipped in `globals.css` with six pre-verified WCAG-AAA/AA contrast pairings (light + dark × text-primary / text-secondary / accent), mirrored into `src/lib/tokens.ts`, and gated by a Vitest suite that runs in ~120ms.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-21T19:23:08Z
- **Completed:** 2026-04-21T19:28:14Z
- **Tasks:** 2 (RED + GREEN TDD cycle)
- **Files modified:** 4 (1 created test, 1 created lib, 1 rewritten CSS, 1 Next-regenerated typedef)

## Accomplishments

- `src/app/globals.css` fully implements UI-SPEC §"globals.css @theme skeleton" — six ordered blocks: Tailwind v4 import, class-based `@custom-variant dark`, the `@theme { }` block with 22+ tokens (2 fonts + 6 light colors + 10 type-scale + 3 weights + 3 radii), the `.dark { }` override declared AFTER `@theme`, the global `prefers-reduced-motion` reset, and the `:focus-visible` default
- `src/lib/tokens.ts` exports `{ light, dark }` with the four contrast-bearing hex values per theme, typed as `as const` so every hex narrows to a string-literal type for downstream consumers
- `tests/tokens.contrast.test.ts` gates the A11Y-03 + D-06 contract with three literal `toBeGreaterThanOrEqual` calls iterated over `["light", "dark"]` → six runtime assertions, all green in ~120ms
- All four verification gates exit 0: `npm test` (6/6), `npm run typecheck`, `npm run check` (Biome, 4 intentional `!important` warnings documented), `npm run build` (Next.js 16 + Turbopack, 1.7s compile)
- TDD discipline enforced: RED commit (3d7cc5b — `test(01-02): add failing WCAG contrast gate for token layer`) precedes GREEN commit (0a620e6 — `feat(01-02): implement token layer — globals.css @theme + src/lib/tokens.ts`)

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing contrast test (RED)** — `3d7cc5b` (test)
2. **Task 2: Implement globals.css @theme + src/lib/tokens.ts (GREEN)** — `0a620e6` (feat)

**Plan metadata:** _pending final docs commit with STATE.md + ROADMAP.md + REQUIREMENTS.md updates_

No REFACTOR commit — the GREEN implementation matched UI-SPEC line-for-line; nothing to clean up.

## Files Created/Modified

### Created

- `tests/tokens.contrast.test.ts` — Six WCAG assertions (text-primary≥7, text-secondary≥4.5, accent≥3 × light+dark). Imports `hex` from `wcag-contrast` and `tokens` from `@/lib/tokens`. 27 lines.
- `src/lib/tokens.ts` — `export const tokens = { light: {...}, dark: {...} } as const`. Four keys per theme: `background`, `textPrimary`, `textSecondary`, `accent`. 20 lines.

### Modified (overwritten)

- `src/app/globals.css` — Replaced the `create-next-app` scaffold (`:root`, `@theme inline`, `@media (prefers-color-scheme: dark)`, `body` rule) with the Phase 1 token contract. 83 lines.

### Modified (Next.js-managed regeneration)

- `next-env.d.ts` — Next.js regenerated on first `next build` after the CSS rewrite; the `import "./.next/dev/types/routes.d.ts"` line became `import "./.next/types/routes.d.ts"` because the production build emits to a different path than dev. Next owns this file; committed so typecheck resolves on a clean clone.

## Six Pre-Verified Contrast Pairings (memorize — binding for every downstream phase)

| Theme | Role | FG hex | BG hex | Ratio | Threshold | Status |
|-------|------|--------|--------|-------|-----------|--------|
| light | text-primary (AAA body) | `#0a0a0a` | `#ffffff` | ~20.4:1 | ≥ 7 | pass |
| light | text-secondary (AA meta) | `#525252` | `#ffffff` | ~7.6:1 | ≥ 4.5 | pass |
| light | accent (AA interactive) | `#0057ff` | `#ffffff` | ~5.6:1 | ≥ 3 | pass |
| dark | text-primary (AAA body) | `#fafafa` | `#0a0a0a` | ~18.6:1 | ≥ 7 | pass |
| dark | text-secondary (AA meta) | `#a3a3a3` | `#0a0a0a` | ~8.3:1 | ≥ 4.5 | pass |
| dark | accent (AA interactive) | `#4d8bff` | `#0a0a0a` | ~5.4:1 | ≥ 3 | pass |

Dark bg is `#0a0a0a`, never `#000` (PITFALLS §4). Dark accent is desaturated from `#0057ff` to `#4d8bff` to avoid vibration on the dark canvas.

## Decisions Made

See frontmatter `key-decisions` — four material decisions made during execution, all within plan discretion:

1. **Sync strategy.** Adopted UI-SPEC's comment-enforced manual sync (Option 3) over regex-parse from `globals.css` (Option 2). Option 3 is simpler (zero extra code in the test) and the two-file drift risk is mitigated by conspicuous comments in both files pointing at each other.
2. **`!important` in the reduced-motion reset.** Biome emits 4 warnings on the `!important` lines (`× This style reverses the cascade logic`). Kept them — the reset is binding per UI-SPEC and must win over any future component animation CSS. A unsafe auto-fix that removed them would regress the motion contract.
3. **Biome auto-formatting.** Accepted `biome check --write` reformatting both files: inline comments got a single space, the universal selector was split across three lines, and the test file's import order was normalized. No semantic change; Biome is the format source of truth.
4. **Committing `next-env.d.ts`.** Next.js auto-edited this file on the first build after the CSS rewrite. Same pattern as Plan 01-01 (which committed Next's mandatory `tsconfig.json` changes): Next owns this file, tooling will regenerate it on every fresh environment, committing keeps `tsc --noEmit` deterministic.

## Deviations from Plan

None — the plan was executed exactly as written. Biome's auto-formatting is not a deviation (D-08 explicitly ceded format decisions to Biome), and committing `next-env.d.ts` alongside the GREEN commit is consistent with Plan 01-01's precedent for Next-managed files.

## Issues Encountered

None. The RED→GREEN transition worked first try:

- Task 1's test ran and failed with the exact expected error (`Cannot find package '@/lib/tokens'`) — this is the canonical RED state
- Task 2's implementation produced all six assertions green in 142ms on the first run
- `npm run typecheck` and `npm run build` each passed without edits after the implementation
- `npm run check` passed with 4 intentional warnings (documented above)

## User Setup Required

None. No external services, no env vars, no secrets. Phase 1 token layer is pure static data.

## Carry-Over for Plan 03

Plan 03 rewrites `src/app/layout.tsx` and `src/app/page.tsx`. Everything the layout needs from this plan is in place:

- Tailwind v4 utilities generated from the `@theme` tokens resolve at build time: `bg-background`, `text-text-primary`, `text-text-secondary`, `bg-accent`, `text-caption`, `text-body`, `text-display`, `text-mono-sm`, `font-sans`, `font-mono`, plus the corresponding `ring-accent`, `border-border`, etc.
- `@custom-variant dark (&:where(.dark, .dark *))` is wired, so Plan 03's `ThemeProvider attribute="class"` will paint the dark overrides on `<html class="dark">` with no extra config
- `:focus-visible` default is global, so the Plan 03 ThemeToggle gets the 2px accent outline for free — no per-component focus rule needed
- The `prefers-reduced-motion: reduce` reset is global, so Plan 03 (and every later phase) gets reduced-motion compliance by default

Plan 03 carries over the dangling `<Image src="/next.svg" />` references in `src/app/page.tsx` from Plan 01-01 — those will be erased in the full page.tsx rewrite.

## Next Phase Readiness

Plan 03 (layout shell + Geist font variables + `next-themes` wiring + proof-of-life `page.tsx` + `ThemeToggle` leaf) is unblocked:

- Font CSS vars (`--font-sans`, `--font-mono`) alias to Geist via `@theme` — Plan 03's `<html className={`${GeistSans.variable} ${GeistMono.variable}`}>` completes the loop
- Six-pairing contrast contract is CI-gated, so any token tweak Plan 03 or beyond might propose is auto-caught
- `next-themes@0.4.6` is installed (Plan 01-01) and the `.dark` class cascade is ready

Plan 04 (CI + README) is also unblocked:

- `npm test` is a verified green command — Plan 04 simply references it from the GitHub Actions YAML
- The test runs in ~120ms so adding it to CI doesn't meaningfully affect workflow duration

## TDD Gate Compliance

Plan type is `execute` but both tasks have `tdd="true"`, producing a plan-level RED→GREEN cycle:

- RED commit: `3d7cc5b` (`test(01-02): ...`) — git log verified ✓
- GREEN commit: `0a620e6` (`feat(01-02): ...`) — git log verified ✓
- REFACTOR: not needed (GREEN matched UI-SPEC exactly)

Gate sequence respected.

## Threat Flags

None. This plan ships pure static data (CSS tokens + TS hex constants + Vitest unit test) with no runtime logic, no network surface, no auth, no schema. All four threats in the plan's `<threat_model>` (T-01-05 information-disclosure / T-01-06 sync-drift / T-01-07 cascade-order regression / T-01-08 EoP) are fully mitigated by the contrast gate + comment discipline + automated cascade-order check + the nature of the change (no runtime code).

---

## Self-Check: PASSED

**Commits verified in git log:**

- `3d7cc5b` — `test(01-02): add failing WCAG contrast gate for token layer` (FOUND)
- `0a620e6` — `feat(01-02): implement token layer — globals.css @theme + src/lib/tokens.ts` (FOUND)

**Files verified:**

- `tests/tokens.contrast.test.ts` (FOUND — 27 lines, 3 `test()` calls, imports from `vitest`/`wcag-contrast`/`@/lib/tokens`)
- `src/lib/tokens.ts` (FOUND — 20 lines, `export const tokens` with `as const`, 8 hex values across 2 themes)
- `src/app/globals.css` (FOUND — contains `@import "tailwindcss"`, `@custom-variant dark`, `@theme`, `.dark {`, `prefers-reduced-motion`, `:focus-visible`; cascade order verified via `awk` — `.dark` line > `@theme` line)
- `next-env.d.ts` (FOUND — Next-regenerated, tracked)

**Verification gates confirmed:**

- `npm test` → 6/6 pass in ~120ms ✓
- `npm run typecheck` → exit 0 ✓
- `npm run check` → exit 0 (4 intentional `!important` warnings) ✓
- `npm run build` → exit 0 (Next.js 16 + Turbopack) ✓

**Key links per PLAN frontmatter all verifiable:**

- `from: src/app/globals.css → @theme token block via Tailwind v4 CSS-first config` ✓ (grep `@theme {` finds block)
- `from: src/lib/tokens.ts → tests/tokens.contrast.test.ts via @/lib/tokens import` ✓ (test imports resolved)
- `from: tests/tokens.contrast.test.ts → wcag-contrast hex()` ✓ (grep `hex(` finds three calls)
- `from: .dark override block → @theme block (cascade order)` ✓ (awk line-number check)

---

*Phase: 01-foundation-tokens-theme*
*Plan: 02 of 04*
*Completed: 2026-04-21*
