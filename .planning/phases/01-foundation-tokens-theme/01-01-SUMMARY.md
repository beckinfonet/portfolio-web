---
phase: 01-foundation-tokens-theme
plan: 01
subsystem: infra
tags: [nextjs-16, react-19, typescript-5, tailwind-v4, biome, vitest, geist, next-themes, pnpm-free, npm, scaffold]

# Dependency graph
requires: []
provides:
  - Next.js 16.2.4 App Router scaffold at repo root
  - Pinned dependency manifest + lockfile (package.json, package-lock.json)
  - TypeScript 5.9.3 with strict + noUncheckedIndexedAccess + verbatimModuleSyntax + @/* path alias
  - Biome 2.4.12 lint/format config scoped to src/** + tests/** with tailwindDirectives enabled
  - Vitest 4.1.4 config resolving @/* alias (ready for Plan 02 contrast test)
  - Clean, starter-template-free tracked tree
  - npm scripts dev/build/start/typecheck/lint/format/check/ci:biome/test/test:watch
affects: [01-02-tokens-and-globalscss, 01-03-layout-and-theme-machinery, 01-04-ci-and-readme, 02-data-layer, 07-launch-audit]

# Tech tracking
tech-stack:
  added:
    - next@16.2.4
    - react@19.2.5
    - react-dom@19.2.5
    - geist@1.7.0
    - next-themes@0.4.6
    - typescript@5.9.3
    - "@types/react@19.2.14"
    - "@types/react-dom@19.2.3 (downgraded from 19.2.14 — see Deviations)"
    - "@types/node@25.6.0"
    - tailwindcss@4.2.4
    - "@tailwindcss/postcss@4.2.4"
    - "@biomejs/biome@2.4.12"
    - vitest@4.1.4
    - wcag-contrast@3.0.0
    - "@types/wcag-contrast@latest"
  patterns:
    - "SP-1: RSC-by-default, no page-level `use client` (CLAUDE.md hard rule)"
    - "Biome-only linting (no ESLint) per D-08"
    - "Exact semver pins + committed lockfile (supply-chain mitigation T-01-01)"
    - "Tailwind v4 CSS-first — no tailwind.config.{js,ts}"

key-files:
  created:
    - package.json
    - package-lock.json
    - tsconfig.json
    - biome.json
    - vitest.config.ts
    - next.config.ts
    - postcss.config.mjs
    - next-env.d.ts
    - .gitignore
    - .env.example
    - README-template.md
    - src/app/layout.tsx (scaffolded — rewritten in Plan 03)
    - src/app/page.tsx (scaffolded — rewritten in Plan 03)
    - src/app/globals.css (scaffolded — rewritten in Plan 02)
  modified:
    - .gitignore (un-ignore .env.example and next-env.d.ts so they commit)
    - tsconfig.json (three strict flags + @/* alias; Next build added noEmit/module/jsx:"react-jsx")
    - biome.json (added css.parser.tailwindDirectives: true)
  deleted:
    - src/app/favicon.ico
    - public/file.svg
    - public/globe.svg
    - public/next.svg
    - public/vercel.svg
    - public/window.svg

key-decisions:
  - "Pinned @types/react-dom to 19.2.3 because 19.2.14 does not exist on npm (highest on the 19.2 line)"
  - "Honored Next.js 16's mandatory tsconfig changes (noEmit, module: esnext, jsx: react-jsx) rather than fighting the tooling"
  - "Enabled Biome css.parser.tailwindDirectives so Tailwind v4 @theme/@custom-variant syntax parses (required for Plan 02)"
  - "Un-ignored .env.example and next-env.d.ts in .gitignore (templates + Next-managed type decl must be committed)"
  - "Kept scaffolded page.tsx SVG references (lines 9, 46) intact — Plan 03 owns page.tsx rewrite"

patterns-established:
  - "Exact-pin dependency strategy: every version is an exact semver (no ^, no ~), lockfile committed"
  - "Biome replaces ESLint (single toolchain for lint + format + import-organize)"
  - "src/ path alias @/* wired in both tsc and vitest configs — any future module resolves identically at typecheck, test, and build time"
  - "Config-overwrite pattern: scaffold creates defaults, phase-1 overwrites with authoritative shape"

requirements-completed: [FOUND-01, FOUND-06, FOUND-08]

# Metrics
duration: 12min
completed: 2026-04-21
---

# Phase 1 Plan 1: Scaffold + Pinned Deps + Strict Config Summary

**Next.js 16 App Router scaffold in place with pinned deps, strict TypeScript (noUncheckedIndexedAccess + verbatimModuleSyntax), Biome 2.4.12 replacing ESLint, Vitest wired for the Plan 02 contrast gate, and a clean starter-template-free tree.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-21T19:05:21Z
- **Completed:** 2026-04-21T19:17:14Z
- **Tasks:** 3 planned tasks + 1 follow-up fix commit
- **Files tracked:** 35 total after cleanup

## Accomplishments

- `create-next-app@16.2.4` scaffold merged into repo root alongside pre-existing `.git/`, `.planning/`, `CLAUDE.md`
- `package.json` overwritten with the RESEARCH.md §Standard Stack pin list (13 prod + dev deps) and the 10-script block (`dev`, `build`, `start`, `typecheck`, `lint`, `format`, `check`, `ci:biome`, `test`, `test:watch`)
- `npm install` produced a clean `package-lock.json`; `npm ls` verifies every pinned version resolved (zero ESLint, zero forbidden deps)
- `tsconfig.json` rewritten with all three D-04 strict flags (`strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`) and `@/* -> ./src/*` alias
- `biome.json` written with the locked 2.4.12 shape (double-quote + semicolons + trailing-commas-all + `a11y: warn` + `noExplicitAny: error`) scoped to `src/**` + `tests/**`; `css.parser.tailwindDirectives` enabled so Tailwind v4 parses
- `vitest.config.ts` resolves `@/*` to `./src/*` (ready to run Plan 02's contrast test without further config)
- Eight starter assets removed: `src/app/favicon.ico` + five `public/*.svg` + verified absence of any `eslint.config.*`, `.eslintrc.*`, or `tailwind.config.*`
- All four verification gates green: `npm run check`, `npm run typecheck`, `npm run lint`, `npm run format`, `npm run build` all exit 0
- `npm run dev` smoke-tested: Next 16 dev server comes up on :3000 and serves HTTP 200 on `/`

## Task Commits

Each task was committed atomically on the `master` branch:

1. **Task 1: Scaffold Next.js 16 and install pinned deps** — `5eee48c` (feat)
2. **Task 2: Harden tsconfig, write biome.json, write vitest.config.ts** — `fd9febb` (chore)
3. **Task 2 follow-up: Enable Biome tailwindDirectives + honor Next tsconfig mandates** — `25b3456` (fix)
4. **Task 3: Remove create-next-app starter assets (FOUND-08)** — `2c7a909` (chore)

Final metadata commit will include this SUMMARY.md, STATE.md, ROADMAP.md, REQUIREMENTS.md.

## Files Created/Modified

### Created

- `package.json` — portfolio name, 13 exact-pinned deps, 10 npm scripts
- `package-lock.json` — lockfile for reproducible installs (supply-chain mitigation T-01-01)
- `tsconfig.json` — strict TS with three D-04 flags + `@/*` alias (Next 16 added `noEmit`, `module: esnext`, `jsx: "react-jsx"` on first build)
- `biome.json` — Biome 2.4.12 config, Tailwind v4 directive parsing enabled
- `vitest.config.ts` — `@/*` alias for Plan 02's contrast test
- `next.config.ts` — scaffold default (minimal; feature flags added per phase)
- `postcss.config.mjs` — `{ plugins: ["@tailwindcss/postcss"] }` scaffold default
- `next-env.d.ts` — Next-managed; committed per RESEARCH.md
- `.gitignore` — scaffold default with two negations (`.env.example`, `next-env.d.ts`)
- `.env.example` — empty (no env vars needed in Phase 1)
- `README-template.md` — scaffold README kept under a `-template` suffix; Plan 04 rewrites
- `src/app/layout.tsx` — scaffolded; Plan 03 rewrites (adds ThemeProvider, Geist vars, metadata)
- `src/app/page.tsx` — scaffolded; Plan 03 rewrites (replaces Tailwind Welcome page with proof-of-life sentinels)
- `src/app/globals.css` — scaffolded; Plan 02 rewrites (full `@theme` block + tokens)

### Modified after scaffold

- `.gitignore` — un-ignored `.env.example` and `next-env.d.ts` so both can be tracked
- `src/app/layout.tsx` — Biome `--write` normalized the single-line JSX attribute wrap (no semantic change)

### Deleted

- `src/app/favicon.ico`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`

## Decisions Made

- **`@types/react-dom` pin:** Dropped to `19.2.3` (highest existing on the 19.2 line) because `19.2.14` — the version listed in RESEARCH.md's pin table — does not exist on npm. Every other pin matched exactly.
- **Next.js 16 mandatory tsconfig changes:** Accepted without fighting. The `next build` invocation automatically set `noEmit: true`, `module: "esnext"`, and flipped `jsx` from `"preserve"` to `"react-jsx"` (React 19 automatic runtime). The three strict flags (which are the D-04 contract) remain intact, as does the `@/*` alias. Fighting Next here would only lose; the plan's acceptance criteria never required `jsx: "preserve"` specifically.
- **Biome tailwindDirectives:** Enabled in `biome.json` under `css.parser`. Without this, Biome 2.4.12 rejects `@theme`/`@custom-variant` syntax during `biome check`, which would block the CI gate the moment Plan 02 starts editing `globals.css`. Adding the flag now is strictly Rule 2 (missing-critical-config) territory.
- **`.gitignore` negations:** The scaffold default ignores `.env*` and `next-env.d.ts`. Both are wrong for this project: `.env.example` is a committed template, and `next-env.d.ts` is Next-managed and must be committed. Two one-line adjustments.
- **Scaffold `page.tsx`/`layout.tsx` content:** Left as-is (including `<Image src="/next.svg" />` references to now-deleted SVGs). Plan 03 explicitly owns the rewrite. The dangling references are captured in the Task 3 commit message so Plan 03 can zero-in.
- **`README-template.md` naming:** Plan calls for `README-template.md` as a Plan-04 deliverable. The scaffold `README.md` was renamed to that name so `git grep "next.js"` picks it up for Plan 04 but no path collision occurs.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocker] `@types/react-dom@19.2.14` does not exist on npm**

- **Found during:** Task 1 (`npm install` failed with `ETARGET`)
- **Issue:** RESEARCH.md's Standard Stack table lists `@types/react-dom: 19.2.14`, but `npm view @types/react-dom versions` shows the 19.2 line tops out at `19.2.3`. The pin was a lookup error in research.
- **Fix:** Pinned `@types/react-dom` to `19.2.3` (highest available on the same minor line, matching the ecosystem convention that `@types/react` and `@types/react-dom` drift on patch numbers)
- **Files modified:** `package.json`
- **Verification:** `npm install` succeeded; `npm ls react-dom @types/react-dom` shows both present, no duplicates
- **Committed in:** `5eee48c` (part of Task 1)

**2. [Rule 2 - Missing critical functionality] `.gitignore` excluded `.env.example` and `next-env.d.ts`**

- **Found during:** Task 1 (`git status` showed neither file as tracked)
- **Issue:** `create-next-app@16.2.4` ships a `.gitignore` with two entries that conflict with this plan's `files_modified` list: `.env*` (over-broad — blocks `.env.example` which is a committed template) and `next-env.d.ts` (wrong — Next-managed type declaration must be tracked for typecheck to work on a fresh clone). Both files are explicitly named in the plan's `files_modified` array.
- **Fix:** Added `!.env.example` negation after `.env*`; removed the `next-env.d.ts` line entirely.
- **Files modified:** `.gitignore`
- **Verification:** `git status --short` shows `.env.example` and `next-env.d.ts` as tracked-untracked after the edit, both committed in `5eee48c`.
- **Committed in:** `5eee48c` (part of Task 1)

**3. [Rule 2 - Missing critical config] Biome 2.4.12 disables Tailwind v4 directive parsing by default**

- **Found during:** Final verification gate (`npm run check` failed after Task 3)
- **Issue:** Biome parses `src/app/globals.css` but errors on `@theme inline { ... }` (the default Tailwind v4 scaffold output) with `× Tailwind-specific syntax is disabled. i Enable tailwindDirectives in the css parser options`. This blocks every CI run that includes `npm run check`/`ci:biome`, which is the whole point of installing Biome.
- **Fix:** Added `css: { parser: { tailwindDirectives: true } }` to `biome.json`. Verified against the `@biomejs/biome@2.4.12` configuration schema at `node_modules/@biomejs/biome/configuration_schema.json` (CssParserConfiguration.tailwindDirectives).
- **Files modified:** `biome.json`
- **Verification:** `npm run check` now exits 0 on all four tracked `src/` files
- **Committed in:** `25b3456` (Task 2 follow-up)

**4. [Rule 1 - Bug / tooling reality] Next.js 16 auto-modifies `tsconfig.json` on first build**

- **Found during:** Final verification gate (`npm run build`)
- **Issue:** `next build` prints `We detected TypeScript in your project and reconfigured your tsconfig.json` and writes three changes: `noEmit: true`, `module: "esnext"`, and flips `jsx` from `"preserve"` to `"react-jsx"`. Reverting would break the next build run.
- **Fix:** Accepted the modifications. Verified that the three D-04 strict flags (`strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`) and the `@/*` alias are still present.
- **Files modified:** `tsconfig.json`
- **Verification:** `npm run typecheck` and `npm run build` both green; grep confirms strict flags intact
- **Committed in:** `25b3456` (Task 2 follow-up)

---

**Total deviations:** 4 auto-fixed (1 Rule 3 blocker, 2 Rule 2 missing-critical-config, 1 Rule 1 tooling reality)
**Impact on plan:** All deviations were correctness/tooling issues surfaced by actually running the commands. None changed the intent of the plan. The strict flags, pins, and clean-tree discipline are fully preserved.

## Issues Encountered

None beyond the deviations above.

## User Setup Required

None — no external services, no secrets, no env vars in Phase 1.

## Carry-Over for Plan 03

`src/app/page.tsx` retains scaffold references to deleted SVGs:

- Line 9: `<Image src="/next.svg" ... />`
- Line 46: `<Image src="/vercel.svg" ... />`

These references will break at runtime (404 on the SVGs) if `npm run dev` is left running against this scaffolded page — the dev server smoke test during plan verification returned HTTP 200 for `/` because the initial HTML loads successfully; the SVGs would only 404 when the browser fetches them. Plan 03 (`src/app/layout.tsx` / `src/app/page.tsx` rewrite) must erase these references.

Flagged in the Task 3 commit message and in this SUMMARY's `key-decisions` list.

## Next Phase Readiness

Plan 02 (tokens + `globals.css` rewrite) is unblocked:

- `vitest.config.ts` resolves `@/*` so `tests/tokens.contrast.test.ts` can import from `@/lib/tokens` on day 1
- `biome.json` already parses Tailwind v4 directives so `globals.css` edits won't fail lint
- `wcag-contrast@3.0.0` + `@types/wcag-contrast` are installed and ready
- `src/lib/tokens.ts` target path is free; no conflicts

Plan 03 (layout + theme machinery) is unblocked:

- `next-themes@0.4.6` and `geist@1.7.0` are installed
- `src/app/layout.tsx` and `src/app/page.tsx` are the scaffolded versions, ready for rewrite
- No `"use client"` directive exists anywhere — RSC-default is clean

Plan 04 (CI + README) is unblocked:

- `npm run ci:biome` (and the rest of the script set) are defined in `package.json` and verified
- `README-template.md` exists with scaffold content; Plan 04 will rename to `README.md` and rewrite

## TDD Gate Compliance

Not applicable — plan type is `execute`, not `tdd`. No `tdd="true"` tasks.

---

## Self-Check: PASSED

**Commits verified:**

- `5eee48c` — Task 1 scaffold + deps (FOUND in git log)
- `fd9febb` — Task 2 config hardening (FOUND in git log)
- `25b3456` — Task 2 follow-up fixes (FOUND in git log)
- `2c7a909` — Task 3 cleanup (FOUND in git log)

**Files verified:**

- package.json (FOUND)
- package-lock.json (FOUND)
- tsconfig.json (FOUND, strict flags intact)
- biome.json (FOUND, tailwindDirectives enabled)
- vitest.config.ts (FOUND, @/* alias present)
- next.config.ts (FOUND)
- postcss.config.mjs (FOUND)
- next-env.d.ts (FOUND, tracked)
- .env.example (FOUND, tracked, empty)
- .gitignore (FOUND, with negations)
- README-template.md (FOUND)
- src/app/layout.tsx (FOUND, scaffolded)
- src/app/page.tsx (FOUND, scaffolded — carry-over flag for Plan 03)
- src/app/globals.css (FOUND, scaffolded)

**Files verified absent (starter cleanup):**

- src/app/favicon.ico (MISSING as expected)
- src/app/page.module.css (MISSING as expected)
- public/*.svg (MISSING as expected)
- eslint.config.* (MISSING as expected)
- tailwind.config.* (MISSING as expected)

---

*Phase: 01-foundation-tokens-theme*
*Plan: 01 of 04*
*Completed: 2026-04-21*
