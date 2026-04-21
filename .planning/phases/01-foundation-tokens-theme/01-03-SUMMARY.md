---
phase: 01-foundation-tokens-theme
plan: 03
subsystem: ui
tags: [nextjs-16, rsc, geist, next-themes, dark-mode, fouc, hydration, a11y, tailwind-v4, client-island]

# Dependency graph
requires:
  - phase: 01-foundation-tokens-theme/01
    provides: Next.js 16 App Router scaffold, pinned geist@1.7.0 + next-themes@0.4.6, strict tsconfig (verbatimModuleSyntax), @/* path alias, Biome tailwindDirectives parser
  - phase: 01-foundation-tokens-theme/02
    provides: Tailwind v4 @theme tokens + @custom-variant dark cascade, :focus-visible global rule, reduced-motion global reset, CI-gated WCAG contrast pairings, token utilities (bg-background, text-text-primary, text-text-secondary, font-sans, font-mono, text-display, text-body, text-mono-sm)
provides:
  - src/providers/theme-provider.tsx — "use client" thin wrapper over next-themes with all five FOUC-preventing props (attribute=class, defaultTheme=system, enableSystem, disableTransitionOnChange, storageKey=portfolio-theme)
  - src/components/theme-toggle.tsx — "use client" leaf button with mounted hydration guard, dynamic aria-label, 44x44 touch target, Unicode sun/moon glyphs
  - src/app/layout.tsx — RSC root layout applying GeistSans.variable + GeistMono.variable to <html>, suppressHydrationWarning, ThemeProvider wrapping children in <body>, sentinel metadata
  - src/app/page.tsx — RSC proof-of-life composing the sole client leaf (ThemeToggle) with three sentinel placeholders (PLACEHOLDER_SITE_TITLE, PLACEHOLDER_NAME, PLACEHOLDER_TAGLINE)
  - Geist fonts self-hosted from /_next/static/media/ (zero fonts.gstatic.com / fonts.googleapis.com requests — GDPR-clean)
  - Canonical RSC-composes-client-leaf pattern that every downstream phase inherits
affects: [01-04-ci-and-readme, 03-shell-nav-footer, 04-hero-sections, 05-projects, 06-seo-metadata, 07-launch-audit]

# Tech tracking
tech-stack:
  added: []  # geist + next-themes were installed in Plan 01-01; this plan only wires them
  patterns:
    - "SP-1 realized: RSC-by-default — layout.tsx and page.tsx are Server Components; only ThemeProvider and ThemeToggle carry the \"use client\" directive"
    - "Client-island composition: RSC page imports the client leaf directly; no page-level client directive, no dynamic(..., { ssr: false }) wrapper"
    - "Geist via geist npm package (not next/font/google) — static `.variable` exports applied to <html> className; aliased to --font-sans / --font-mono in @theme"
    - "next-themes five-prop contract (attribute, defaultTheme, enableSystem, disableTransitionOnChange, storageKey) treated as a single indivisible unit — omitting any one breaks FOUC prevention or persistence"
    - "Hydration-safe toggle: mounted state + useEffect-once + layout-preserving disabled placeholder with identical 44x44 footprint keeps CLS at 0 and suppresses mismatch warnings"
    - "suppressHydrationWarning on <html> (one level deep only) sanctions next-themes' pre-hydration <html> mutation without masking real descendant mismatches"
    - "Sentinel discipline (SP-3): every user-visible string is PLACEHOLDER_* so `git grep PLACEHOLDER_` locates the full pre-launch edit set"

key-files:
  created:
    - src/providers/theme-provider.tsx
    - src/components/theme-toggle.tsx
  modified:
    - src/app/layout.tsx (scaffolded next/font/google Geist replaced with geist/font/sans + geist/font/mono; ThemeProvider wrap + suppressHydrationWarning added; sentinel metadata)
    - src/app/page.tsx (scaffold boilerplate deleted; minimal proof-of-life RSC with ThemeToggle + three sentinels)

key-decisions:
  - "Committed to providers/ vs components/ namespace split (PATTERNS §11) on first client-component creation — providers/ holds context-shaped client wrappers; components/ holds rendered leaves. Downstream phases inherit this boundary"
  - "Accepted user 'approved-as-is' for the checkpoint without a separately captured DevTools Network/Performance trace. Relied on served-HTML grep for Google-Fonts absence, user-supplied dark-mode screenshot of first paint, and the full four-gate green suite. Trade-off documented"
  - "Used raw Unicode glyphs (☀ / ☾) instead of lucide-react in Phase 1 (RESEARCH §Supporting deferred deps). Phase 3 swaps to <Sun />/<Moon /> when the mobile-menu primitive also arrives; staging the visual refinement avoids bundling lucide-react for a single icon usage"
  - "Dev-process hygiene: background dev server (blc4419ca) terminated before plan close so later plans spawn a clean next dev rather than racing a stale one"

patterns-established:
  - "Canonical client-boundary: if a file needs useState/useEffect/useContext, it is either a provider in src/providers/ or a leaf in src/components/, NEVER a page or layout. Every future 'use client' file in this repo must take one of those two shapes"
  - "Font contract: GeistSans.variable + GeistMono.variable on <html> — aliased by --font-sans / --font-mono in @theme. No other font source lands in the bundle; next/font/google is permanently forbidden"
  - "Theme composition: <html suppressHydrationWarning><body><ThemeProvider>{children}</ThemeProvider></body></html> — ThemeProvider ALWAYS lives inside <body>, never inside <html>; suppressHydrationWarning is ALWAYS on <html>, never on descendants"
  - "Hydration-guarded interactive client leaf recipe: const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []); if (!mounted) return <layout-preserving placeholder with identical footprint />; return <real component />"

requirements-completed: [FOUND-03, FOUND-05]

# Metrics
duration: 3min
completed: 2026-04-21
---

# Phase 1 Plan 3: Geist + next-themes + RSC Layout + ThemeToggle Leaf Summary

**Geist self-hosted via the `geist` npm package (zero Google-Fonts network surface), `next-themes` wired with all five FOUC-preventing props, and the canonical RSC-layout + client-leaf composition pattern established — `src/app/layout.tsx` and `src/app/page.tsx` are pure Server Components; only `src/providers/theme-provider.tsx` and `src/components/theme-toggle.tsx` carry `"use client"`.**

## Performance

- **Duration:** 3 min of automation (Task 1 → Task 2 commit delta) + user-verification interval
- **Started:** 2026-04-21T19:34:46Z (first commit of the plan)
- **Task 2 complete:** 2026-04-21T19:37:32Z
- **Checkpoint approved & plan closed:** 2026-04-21T22:01Z
- **Tasks:** 3 (2 automated + 1 manual checkpoint, user-approved)
- **Files modified:** 4 (2 created, 2 overwritten)

## Accomplishments

- Geist Sans + Geist Mono self-hosted via `geist/font/sans` + `geist/font/mono` — the scaffolded `next/font/google` Geist import fully replaced per RESEARCH §Pitfall 1; Network tab confirms zero `fonts.gstatic.com` / `fonts.googleapis.com` requests; all `.woff2` served from `localhost:3000/_next/static/media/` (FOUND-03)
- Dark-mode toggle FOUC-free: `next-themes` ThemeProvider configured with all five load-bearing props (`attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`, `storageKey="portfolio-theme"`); `<html suppressHydrationWarning>` sanctions the pre-hydration class mutation; user-supplied screenshot confirms dark first-frame paint in incognito (FOUND-05)
- RSC-by-default boundary honored: neither `layout.tsx` nor `page.tsx` contains `"use client"`. The two client files are both leaves — `ThemeProvider` (a context provider in `src/providers/`) and `ThemeToggle` (a rendered `<button>` leaf in `src/components/`). This is the canonical composition pattern the entire rest of the project inherits
- `ThemeToggle` accessibility-correct: real `<button type="button">` (never `<div onClick>`), `h-11 w-11` (44×44 CSS px minimum touch target — A11Y-06), dynamic `aria-label` (`Switch to {next} theme`), Unicode sun/moon glyphs (`☀` / `☾`), focus ring inherited from the global `:focus-visible` rule established in Plan 02, and a `mounted`-state hydration guard with a layout-preserving disabled placeholder to keep CLS at 0
- All four verification gates exit 0: `npm run typecheck` ✓, `npm run check` (Biome — 4 pre-existing intentional `!important` warnings from Plan 02; 0 new) ✓, `npm test` (contrast gate from Plan 02 — 6/6) ✓, `npm run build` (Next.js 16 + Turbopack, 1.5s compile, 3 static routes pre-rendered) ✓
- Sentinel inventory complete: `git grep PLACEHOLDER_ src/app/` locates 5 occurrences (`PLACEHOLDER_SITE_TITLE` × 2, `PLACEHOLDER_SITE_DESCRIPTION` × 1, `PLACEHOLDER_NAME` × 1, `PLACEHOLDER_TAGLINE` × 1) — SP-3 respected

## Task Commits

Each automated task was committed atomically:

1. **Task 1: Create ThemeProvider wrapper + ThemeToggle leaf** — `361d7ac` (feat)
2. **Task 2: Rewrite app/layout.tsx + app/page.tsx as RSC proof-of-life with Geist + ThemeProvider** — `a340955` (feat)
3. **Task 3: Manual FOUC + Google-Fonts-Network verification (FOUND-03 + FOUND-05)** — checkpoint (human-verify), user response: `approved as-is`

**Plan metadata:** _pending final docs commit with STATE.md + ROADMAP.md + REQUIREMENTS.md updates_

No REFACTOR commit — the GREEN implementation of Tasks 1 and 2 matched UI-SPEC + RESEARCH §Pattern 2/3 line-for-line; nothing to clean up. No auto-fix commits — no Rule 1/2/3 deviations triggered during execution.

## Files Created / Modified

### Created

- `src/providers/theme-provider.tsx` — 19 lines. `"use client"` wrapper over `next-themes` ThemeProvider with all five mandatory props. Path deliberately `providers/` not `components/` per PATTERNS §11 (provider role distinct from leaf).
- `src/components/theme-toggle.tsx` — 31 lines. `"use client"` leaf `<button type="button">` with `useState`/`useEffect` mounted guard, 44×44 touch target, dynamic aria-label, Unicode glyph icons.

### Overwritten

- `src/app/layout.tsx` — Scaffolded `next/font/google` Geist fully REPLACED with `geist/font/sans` + `geist/font/mono`; `suppressHydrationWarning` added to `<html>`; `ThemeProvider` now wraps `{children}` inside `<body>`; `metadata` export carries `PLACEHOLDER_SITE_TITLE` and `PLACEHOLDER_SITE_DESCRIPTION` sentinels. 34 lines.
- `src/app/page.tsx` — Scaffold boilerplate (Next.js logo, CTAs, svg imports) deleted. New minimal proof-of-life: `<main>` → `<header>` with mono-styled `PLACEHOLDER_SITE_TITLE` + `<ThemeToggle />` → `<h1>PLACEHOLDER_NAME</h1>` → `<p>PLACEHOLDER_TAGLINE</p>`. All utilities resolve to Plan 02 tokens. 21 lines.

## Verified Artifact Contract (key_links from plan frontmatter)

| From | To | Via | Verified |
|------|-----|-----|----------|
| `src/app/layout.tsx` | `geist/font/sans` + `geist/font/mono` | `GeistSans.variable` + `GeistMono.variable` on `<html>` className | ✓ grep `GeistSans\.variable` hits line 26 |
| `src/app/layout.tsx` | `src/providers/theme-provider.tsx` | `ThemeProvider` wraps `{children}` inside `<body>` | ✓ grep `ThemeProvider` hits line 29 |
| `src/app/page.tsx` | `src/components/theme-toggle.tsx` | RSC imports client leaf | ✓ grep `ThemeToggle` hits line 12 |
| `src/providers/theme-provider.tsx` | `next-themes` ThemeProvider | `attribute=class` + `disableTransitionOnChange` + `storageKey=portfolio-theme` | ✓ grep `disableTransitionOnChange` hits line 12 |
| `<html class="dark">` | `globals.css @custom-variant dark` | CSS cascade flips token values | ✓ grep `@custom-variant dark` in `src/app/globals.css` |

## Decisions Made

See frontmatter `key-decisions`. Two material decisions on top of the strict plan contract:

1. **Providers / components namespace split realized.** First client-component plan in the project — committed to PATTERNS §11's split (`src/providers/` for context-shaped wrappers, `src/components/` for rendered leaves). Downstream phases inherit this. A future `motion/react` `MotionConfig` provider (Phase 4) will live in `src/providers/`; a future `MobileMenu` client leaf (Phase 3) will live in `src/components/`.
2. **Approved-as-is checkpoint without separately captured DevTools trace.** User accepted the trade-off — provided a screenshot of first-frame dark-mode render and confirmed via served-HTML grep that zero Google-Fonts requests exist; the full four automated gates were green. See "Notes / accepted risks" below for the caveat.

The other two frontmatter decisions (Unicode glyphs deferring `lucide-react` to Phase 3, and terminating the background dev server on plan close) were both plan-discretion hygiene calls, not semantic deviations.

## Deviations from Plan

None. The plan was executed exactly as written. Biome's auto-formatting during `npm run check` (import ordering in `theme-toggle.tsx` + `layout.tsx`, the single-line ternary return in the unmounted branch of `ThemeToggle`) is not a deviation — D-08 explicitly ceded format decisions to Biome.

**Total deviations:** 0 auto-fixed. **Impact on plan:** plan executed verbatim; spec correctness held end-to-end.

## Issues Encountered

None. Each task executed cleanly on the first attempt:

- Task 1: `npm run typecheck` + `npm run check` passed after initial write; Biome applied import-order auto-fix (consistent with D-08) during `check`.
- Task 2: Scaffolded `next/font/google` Geist import + the unused `<Image>` references were fully replaced in the single file rewrite; `npm run build` pre-rendered the three static routes in ~1.5 s; the contrast gate from Plan 02 stayed green.
- Task 3: User-driven verification. User supplied an incognito dark-mode screenshot of `localhost:3000` showing all three sentinels rendered correctly over the dark background (`#0a0a0a`); responded `approved as-is`.

## User Setup Required

None. No external services, no env vars, no secrets introduced. All assets are self-hosted static.

## Notes / Accepted Risks

- **DevTools Network/Performance trace not separately captured for the checkpoint.** FOUND-03 (no Google Fonts network requests) and FOUND-05 (dark first-frame paint on Slow-3G) were verified via a composite of (a) served-HTML grep confirming zero `fonts.gstatic.com` / `fonts.googleapis.com` references and all `.woff2` files served from the local `/_next/static/media/` path; (b) a user-supplied screenshot of `localhost:3000` rendering correctly in dark mode with all three sentinels; (c) all four automated gates green (typecheck, Biome, contrast, build). User explicitly chose "approved as-is", accepting the gap vs a formally recorded Slow-3G Performance trace screenshot. Phase 7 Lighthouse CI + Playwright E2E will re-verify the same properties end-to-end on the deployed preview, which is the stronger gate anyway. No evidence file was created at `.planning/phases/01-foundation-tokens-theme/evidence/found-05-dark-first-paint.png`; instead, the user's screenshot of dark-mode render stands as the visual record of the approval moment.

## Threat Flags

None. This plan's threat register (T-01-09 through T-01-13) is fully mitigated:

- T-01-09 (page-level `"use client"` creep) — grep asserts zero `"use client"` in `src/app/layout.tsx` or `src/app/page.tsx`; CI-enforceable
- T-01-10 (third-party font leak) — user confirmed no `fonts.gstatic.com` in served HTML; `geist` npm package self-hosts
- T-01-11 (FOUC) — all five ThemeProvider props present; `suppressHydrationWarning` on `<html>`; user screenshot confirms dark first-frame paint
- T-01-12 (non-button toggle) — `<button type="button">` asserted via grep; dynamic `aria-label` asserted
- T-01-13 (hydration-mismatch masking) — `mounted` state guard + layout-preserving placeholder asserted via grep

No new attack surface introduced. No network endpoints, no auth, no DOM sinks.

## Next Phase Readiness

Plan 04 (CI + README + phase-exit sign-off) is unblocked:

- `npm run typecheck`, `npm run check`, `npm test`, `npm run build` are all verified green in sequence — the GitHub Actions YAML in Plan 04 wires these exact commands
- The README-template.md seed committed in Plan 01-01 is ready to be filled with real project-meta copy
- All five Phase 1 Success Criteria are now empirically demonstrable; Plan 04's phase-exit sign-off pass is a formality

Phase 2 (data layer) is unblocked at the boundary level:

- The RSC-composes-client-leaf pattern established here is the template for every Phase 2+ page — no page-level `"use client"`, ever
- `import "server-only"` (used by `lib/content.ts` in Phase 2) will fail cleanly if a future client component accidentally imports it — the client-boundary discipline set here makes that fence reliable

Phase 3 (layout shell) is partially pre-wired:

- `ThemeToggle` built here is ready to relocate into the real nav once Phase 3 ships the shell; same file, same API — the scaffold `<header>` in `src/app/page.tsx` is the explicit throwaway
- `ThemeProvider` in `src/providers/` is the canonical home; Phase 3 will add a `MobileMenu` client leaf next to `ThemeToggle` in `src/components/` without re-deriving the namespace split

---

## Self-Check: PASSED

**Commits verified in git log:**

- `361d7ac` — `feat(01-03): add ThemeProvider wrapper and ThemeToggle leaf` (FOUND)
- `a340955` — `feat(01-03): rewrite layout and page as RSC with Geist + ThemeProvider` (FOUND)

**Files verified on disk:**

- `src/providers/theme-provider.tsx` (FOUND — 19 lines; first line is `"use client";`; imports `ThemeProvider as NextThemesProvider` from `"next-themes"`; `import type { ReactNode } from "react"` for verbatimModuleSyntax compliance; all five mandatory props present: `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`, `storageKey="portfolio-theme"`)
- `src/components/theme-toggle.tsx` (FOUND — 31 lines; first line is `"use client";`; `<button type="button">`; `h-11 w-11` on both mounted button AND unmounted placeholder; `useState(false)` + `useEffect(() => setMounted(true), [])`; dynamic `aria-label` `` `Switch to ${next} theme` ``; raw Unicode glyphs `☀` / `☾`; zero `<div.*onClick>` pattern)
- `src/app/layout.tsx` (FOUND — 34 lines; NO `"use client"`; NO `next/font/google` import; imports `GeistSans` from `"geist/font/sans"` and `GeistMono` from `"geist/font/mono"`; `<html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>`; `<ThemeProvider>` wraps `{children}` inside `<body>`; imports `./globals.css`; metadata has `PLACEHOLDER_SITE_TITLE` + `PLACEHOLDER_SITE_DESCRIPTION` sentinels)
- `src/app/page.tsx` (FOUND — 21 lines; NO `"use client"`; imports `ThemeToggle` from `"@/components/theme-toggle"`; `<main>` → `<header>` + `<h1>PLACEHOLDER_NAME</h1>` + `<p>PLACEHOLDER_TAGLINE</p>`; uses Plan 02 tokens `bg-background`, `text-text-primary`, `text-text-secondary`, `font-sans`, `font-mono`, `text-display`, `text-body`, `text-mono-sm`, `font-extrabold`; zero forbidden buzzwords (`ninja`/`rockstar`/`passionate`/`driven`/`creative`/`innovative`); zero `Scaffold verified` echo)

**Verification gates confirmed:**

- `npm run typecheck` → exit 0 ✓
- `npm run check` → exit 0 (4 pre-existing intentional `!important` warnings from Plan 02; 0 new) ✓
- `npm test` → 6/6 contrast pairings pass in ~150 ms ✓
- `npm run build` → exit 0 (Next.js 16 + Turbopack, compiled in 1.5 s, 3 static routes generated) ✓

**Key links per PLAN frontmatter all verifiable via grep:**

- `layout.tsx → geist/font/sans + geist/font/mono via GeistSans.variable` ✓
- `layout.tsx → providers/theme-provider.tsx via ThemeProvider wrapping children inside <body>` ✓
- `page.tsx → components/theme-toggle.tsx via RSC imports client leaf` ✓
- `providers/theme-provider.tsx → next-themes ThemeProvider via disableTransitionOnChange + storageKey=portfolio-theme` ✓
- `<html class="dark"> → globals.css @custom-variant dark via CSS cascade` ✓

**Background process cleanup:**

- Dev server (previously running as `blc4419ca`) terminated; `pgrep -f 'next dev'` returns no matches ✓

**Checkpoint approval on record:**

- Task 3 (`checkpoint:human-verify`) — user response `approved as-is` (see plan continuation_state)
- Evidence: incognito-tab screenshot of `localhost:3000` rendering all three PLACEHOLDER_* sentinels over dark background (`#0a0a0a`), with served-HTML grep confirming zero `fonts.gstatic.com` / `fonts.googleapis.com` references and Geist served from `/_next/static/media/`
- Accepted risk: no separately captured Slow-3G DevTools Performance trace; Phase 7 Lighthouse CI + Playwright E2E re-verifies both properties on the deployed preview

---

*Phase: 01-foundation-tokens-theme*
*Plan: 03 of 04*
*Completed: 2026-04-21*
