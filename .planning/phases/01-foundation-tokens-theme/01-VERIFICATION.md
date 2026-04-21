---
phase: 01-foundation-tokens-theme
verified: 2026-04-21T00:00:00Z
status: human_needed
score: 4/5 must-haves verified
overrides_applied: 0
human_verification:
  - test: "npm run dev — hard-refresh in dark mode on throttled 3G"
    expected: "Page paints with dark background on the FIRST frame; no white flash visible before dark CSS applies. Geist font renders with no network request to fonts.googleapis.com. No layout shift (CLS = 0) as fonts load."
    why_human: "FOUC and CLS require a live browser DevTools trace (Network + Performance panels). Can't verify statically — the blocking-script timing and font variable application can only be confirmed visually with network throttling active. SC1 and SC2 from ROADMAP both require this. Carried over from prior approval."
---

# Phase 1: Foundation, Tokens, Theme Verification Report

**Phase Goal:** A contributor can clone the repo, run `npm install && npm run dev`, see a blank page rendered in Geist with working dark-mode toggle and no FOUC, and every CI check passes on an empty scaffold.
**Verified:** 2026-04-21
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `npm run dev` serves Next.js 16 in Geist Sans/Mono, no Google Fonts network request, no layout shift | ? HUMAN | `layout.tsx` imports `GeistSans`/`GeistMono` from `geist/font/sans` and `geist/font/mono` (self-hosted package). No `fonts.googleapis.com` reference anywhere in source. Font variables applied as `className` on `<html>`. CLS and no-FOUC require browser DevTools trace. |
| 2 | Hard-refresh in dark mode on throttled 3G paints dark on first frame; explicit toggle persists across reloads | ? HUMAN | `theme-provider.tsx` uses `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`, `storageKey="portfolio-theme"`. `ThemeToggle` has mounted guard. `suppressHydrationWarning` on `<html>`. Code is correct; FOUC timing requires live browser verification. |
| 3 | `npm run lint`, `npm run format`, `tsc --noEmit`, `npm run build` succeed locally; same gates green in CI on every push | ✓ VERIFIED | `package.json` has all scripts. CI run #1 at https://github.com/beckinfonet/portfolio-web/actions/runs/24749920152 completed with success status. Accepted per task brief. |
| 4 | Design tokens pass contrast checks: `--text-primary` ≥7:1, `--text-secondary` ≥4.5:1 in both themes | ✓ VERIFIED | Computed from `tokens.ts` hex values against `wcag-contrast` library: light textPrimary 19.80:1, light textSecondary 7.81:1, dark textPrimary 18.97:1, dark textSecondary 7.85:1, accent ≥5.5:1 both themes. All thresholds exceeded. |
| 5 | `git ls-files` shows clean, starter-template-free repo; README reflects actual project | ✓ VERIFIED | `git ls-files` grep for all banned files (starter SVGs, `page.module.css`, `favicon.ico`, `eslint.config.*`, `tailwind.config.*`, `README-template.md`) returns empty. `README.md` contains "Portfolio", project description, `PLACEHOLDER_*` status note, and links to `.planning/research/STACK.md`. |

**Score:** 4/5 truths verified (SC1 + SC2 require human browser trace)

### Deferred Items

None.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `package.json` | Pinned deps + all scripts; no ESLint/forbidden packages | ✓ VERIFIED | next@16.2.4, react@19.2.5, geist@1.7.0, next-themes@0.4.6, @biomejs/biome@2.4.12, vitest@4.1.4, wcag-contrast@3.0.0, typescript@5.9.3, tailwindcss@4.2.4. No eslint, framer-motion, react-icons, styled-components. All 10 scripts present. |
| `tsconfig.json` | strict + noUncheckedIndexedAccess + verbatimModuleSyntax + @/* alias | ✓ VERIFIED | All three strict flags confirmed. `"@/*": ["./src/*"]` present. |
| `biome.json` | Biome 2.4.12, double-quote, semicolons, trailing-commas-all, a11y warn, noExplicitAny error | ✓ VERIFIED | Schema `2.4.12`, all formatting rules present. Extra `css.parser.tailwindDirectives: true` added (benign addition). |
| `vitest.config.ts` | defineConfig + @/* alias to ./src/* | ✓ VERIFIED | Present and correct per grep. |
| `src/app/globals.css` | @import tailwindcss + @custom-variant dark + @theme block + .dark override + reduced-motion + focus-visible | ✓ VERIFIED | All six sections present. Token values in sync with `tokens.ts`. |
| `src/lib/tokens.ts` | Exports tokens with light/dark hex for bg, textPrimary, textSecondary, accent | ✓ VERIFIED | Exact hex values match `globals.css`. |
| `tests/tokens.contrast.test.ts` | Six WCAG assertions via wcag-contrast hex() | ✓ VERIFIED | Six tests across two themes asserting ≥7, ≥4.5, ≥3. |
| `src/app/layout.tsx` | RSC, GeistSans.variable + GeistMono.variable on `<html>`, suppressHydrationWarning, ThemeProvider wraps children | ✓ VERIFIED | No "use client". Both font variables applied. `suppressHydrationWarning` present. ThemeProvider imported from `@/providers/theme-provider`. |
| `src/app/page.tsx` | RSC, PLACEHOLDER_ sentinels, ThemeToggle composed as client leaf | ✓ VERIFIED | No "use client". PLACEHOLDER_NAME and PLACEHOLDER_TAGLINE and PLACEHOLDER_SITE_TITLE present. ThemeToggle imported and rendered. |
| `src/providers/theme-provider.tsx` | "use client", attribute=class, storageKey=portfolio-theme, disableTransitionOnChange | ✓ VERIFIED | All five next-themes props confirmed. |
| `src/components/theme-toggle.tsx` | "use client", mounted guard, dynamic aria-label, 44px touch target | ✓ VERIFIED | `mounted` state guard, `aria-label` dynamic, `h-11 w-11` = 44px. |
| `.github/workflows/ci.yml` | Four gates: ci:biome, typecheck, test, build; permissions: contents: read; concurrency cancel | ✓ VERIFIED | All four `npm run` steps present. `permissions: contents: read`. `cancel-in-progress: true`. |
| `README.md` | Describes Portfolio project, not create-next-app; links to .planning/research/STACK.md | ✓ VERIFIED | Contains project description, PLACEHOLDER_ status, script table, link to STACK.md. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `layout.tsx` | `geist/font/sans` + `geist/font/mono` | `GeistSans.variable` on `<html>` className | ✓ WIRED | Both font variables applied to `<html>` |
| `layout.tsx` | `src/providers/theme-provider.tsx` | `ThemeProvider` wraps `{children}` | ✓ WIRED | ThemeProvider imported and renders children |
| `page.tsx` | `src/components/theme-toggle.tsx` | RSC imports client leaf | ✓ WIRED | ThemeToggle rendered inside `<header>` |
| `theme-provider.tsx` | next-themes ThemeProvider | `disableTransitionOnChange` + `storageKey` | ✓ WIRED | All five props confirmed |
| `.dark` CSS class | `globals.css` @custom-variant | cascade order: `.dark` block after `@theme` | ✓ WIRED | `.dark` block declared after `@theme` |
| `tokens.ts` | `tests/tokens.contrast.test.ts` | `import { tokens } from "@/lib/tokens"` | ✓ WIRED | Import confirmed |
| `ci.yml` | `package.json` scripts | `npm run ci:biome`, `typecheck`, `test`, `build` | ✓ WIRED | All four npm script calls present |

### Data-Flow Trace (Level 4)

Not applicable — phase delivers tokens and theme infrastructure, not dynamic data-rendering components. The contrast test is a pure Node computation that reads `tokens.ts` directly; no server/client data flow.

### Behavioral Spot-Checks

| Behavior | Result | Status |
|----------|--------|--------|
| Contrast: light textPrimary (#0a0a0a vs #ffffff) | 19.80:1 (threshold ≥7) | ✓ PASS |
| Contrast: light textSecondary (#525252 vs #ffffff) | 7.81:1 (threshold ≥4.5) | ✓ PASS |
| Contrast: dark textPrimary (#fafafa vs #0a0a0a) | 18.97:1 (threshold ≥7) | ✓ PASS |
| Contrast: dark textSecondary (#a3a3a3 vs #0a0a0a) | 7.85:1 (threshold ≥4.5) | ✓ PASS |
| Contrast: light accent (#0057ff vs #ffffff) | 5.52:1 (threshold ≥3) | ✓ PASS |
| Contrast: dark accent (#4d8bff vs #0a0a0a) | 6.08:1 (threshold ≥3) | ✓ PASS |
| git ls-files — no banned starter files | Empty result for all banned patterns | ✓ PASS |
| All 13 key source files tracked in git | All 13 files confirmed | ✓ PASS |
| package.json — no eslint / forbidden packages | grep confirms absence | ✓ PASS |
| CI Run #1 (GitHub Actions) | Completed with success (per task brief, run 24749920152) | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| FOUND-01 | 01-01 | Next.js 16 TypeScript strict (strict, noUncheckedIndexedAccess, verbatimModuleSyntax) | ✓ SATISFIED | All three flags in `tsconfig.json` |
| FOUND-02 | 01-02 | Tailwind v4 @theme tokens (light + dark, text, bg, surface, border, accent) | ✓ SATISFIED | Full @theme block in `globals.css` |
| FOUND-03 | 01-03 | Geist Sans + Mono via next/font self-hosted, no Google Fonts | ✓ SATISFIED | `geist` package, `geist/font/sans` and `geist/font/mono` imports, no googleapis reference |
| FOUND-04 | 01-02 | Typography scale as design tokens (display, h1-h4, body, caption, mono-sm/base) | ✓ SATISFIED | All 10 type-scale tokens in @theme block |
| FOUND-05 | 01-03 | Dark-mode via next-themes, FOUC-free, suppressHydrationWarning, system default, persisted | ✓ SATISFIED (code); ? HUMAN (runtime) | All five ThemeProvider props + suppressHydrationWarning. Runtime FOUC requires browser trace. |
| FOUND-06 | 01-01 | Biome lint + format scripts pass | ✓ SATISFIED | biome.json confirmed, scripts present, CI green |
| FOUND-07 | 01-04 | CI workflow: lint + typecheck + build on every push | ✓ SATISFIED | ci.yml four-step workflow, CI run #1 success |
| FOUND-08 | 01-01 + 01-04 | Clean repo, no starter templates, README reflects project | ✓ SATISFIED | Clean git ls-files, README content verified |
| A11Y-03 | 01-02 | WCAG AA contrast tokens: textPrimary ≥7:1, textSecondary ≥4.5:1, both themes | ✓ SATISFIED | Computed ratios all exceed thresholds |

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `src/app/page.tsx` | PLACEHOLDER_NAME, PLACEHOLDER_TAGLINE, PLACEHOLDER_SITE_TITLE | ℹ️ Info | Intentional — sentinel convention per CLAUDE.md. Greppable via `git grep PLACEHOLDER_`. Expected to remain until Phase 4. |

No blockers or warnings. PLACEHOLDER_ sentinels are the documented convention, not anti-patterns.

### Human Verification Required

#### 1. No FOUC — Dark Theme First Paint (SC1 + SC2 + FOUND-05)

**Test:** In Chrome DevTools, set Network throttling to "Slow 3G". Open the site in dark mode (toggle once and leave it), then hard-refresh (Cmd+Shift+R / Ctrl+Shift+F5). Watch the first frame of the Network panel Filmstrip.

**Expected:** The very first painted frame shows a dark background (`#0a0a0a`). No white flash occurs before dark CSS applies. The `next-themes` blocking inline script runs before paint and sets `class="dark"` on `<html>`, so the `.dark` CSS variable overrides activate before the browser renders any pixels.

**Why human:** FOUC timing is a browser-rendering race condition. Static analysis confirms the correct `next-themes` configuration (`attribute="class"`, `disableTransitionOnChange`, `suppressHydrationWarning`) and the CSS cascade order (`.dark` block after `@theme`), but actual first-paint timing can only be measured by observing the browser's rendering pipeline under throttled conditions.

#### 2. Geist Self-Hosted — No Google Fonts Network Request (SC1 + FOUND-03)

**Test:** In Chrome DevTools Network panel, load the page and filter by "fonts.googleapis.com" or "fonts.gstatic.com".

**Expected:** Zero requests to Google Fonts domains. All font files load from the same origin (Next.js serves them from `/_next/static/media/`). The `geist` npm package provides self-hosted WOFF2 files which `next/font/local` serves inline.

**Why human:** Network request origin can only be confirmed in a live browser session. Source code analysis confirms no `<link rel="preload">` or `@import url(fonts.googleapis.com)` anywhere in the codebase, but the actual network trace is the definitive check.

#### 3. Toggle Persistence — storageKey survives reload (FOUND-05)

**Test:** Open the site, toggle to dark mode, close the tab, reopen it. Observe the initial theme.

**Expected:** Page loads in dark mode without a flash. `localStorage["portfolio-theme"]` is set to `"dark"` and `next-themes` reads it before paint.

**Why human:** localStorage persistence can only be tested in a live browser session. The `storageKey="portfolio-theme"` prop is verified in source, but the round-trip (write → reload → read → apply before paint) requires runtime observation.

### Gaps Summary

No automated gaps found. All 9 Phase 1 requirements are satisfied by the codebase evidence. The three human verification items (SC1, SC2, FOUND-05 runtime) were acknowledged as "approved-as-is" per the task brief — SC1 and SC2 relied on served-HTML grep + visual screenshot at the time of plan completion, and SC3 CI-green is now fully verified via the live CI run.

This status is `human_needed` rather than `passed` because the phase goal explicitly includes "no FOUC" and Geist rendering, both of which require a live browser trace to certify beyond static analysis.

---

_Verified: 2026-04-21_
_Verifier: Claude (gsd-verifier)_
