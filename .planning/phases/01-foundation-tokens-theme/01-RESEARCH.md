# Phase 1: Foundation, Tokens, Theme - Research

**Researched:** 2026-04-21
**Domain:** Next.js 16 scaffold + Tailwind v4 `@theme` tokens + Geist via `next/font` + `next-themes` FOUC-free dark mode + TypeScript 5 strict + Biome 2.x + GitHub Actions CI + automated WCAG contrast gate
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Typography pairing (@theme font tokens)**

- **D-01:** Font family is **Geist Sans + Geist Mono**, loaded via the `geist` npm package through `next/font/local`. Single family covers body + mono with matching metrics. Self-hosted — zero network font requests. No Google Fonts `<link>` tags anywhere. Expose as CSS variables `--font-sans` and `--font-mono` via Tailwind v4 `@theme` so `font-sans` / `font-mono` utilities Just Work.
- **D-02:** Monospace scope is **code, tags, plus meta accents** — mono applies to code blocks, skill tags, kbd shortcuts, and meta accents (project dates, numerics, role/scope labels, timestamps). Prose and headings stay sans. Matches PROJECT.md's "monospace accents for code/tags" brief. Keep it restrained — do not let mono bleed into section headings or long-form prose.
- **D-03:** Display headings (hero name, h1, h2) use **the same Geist Sans at heavier weight (700–800)** — no separate display family, no mono-display hero, no tracked-in 900. Unified type system reinforces the minimal/typography-forward aesthetic. Type scale tokens (display, h1–h4, body, caption, mono-sm/base) all derive from the same single sans family.

**Locked by research / CLAUDE.md**

- **D-04:** Stack is Next.js 16 App Router + React 19 + TypeScript 5 strict (with `noUncheckedIndexedAccess` + `verbatimModuleSyntax`) + Tailwind CSS v4 CSS-first `@theme` + `next-themes` + Biome + Vitest + Playwright + `@axe-core/playwright`. Pinned versions live in `.planning/research/STACK.md`.
- **D-05:** FOUC prevention is mandatory and structural. `next-themes` `ThemeProvider` sits at the root of `app/layout.tsx`; `suppressHydrationWarning` on `<html>` is required; system preference is default with explicit toggle override persisted. Hard-refresh in dark mode on throttled 3G must paint dark on the first frame.
- **D-06:** Contrast thresholds are encoded as design tokens and automatically verified: `--text-primary` ≥ 7:1 against `--bg` and `--text-secondary` ≥ 4.5:1 in **both** light and dark themes. This is a CI gate — planner builds contrast checking into the CI workflow as part of this phase (FOUND-07 + A11Y-03).
- **D-07:** CI runs on every push: `biome check`, `tsc --noEmit`, `next build`. GitHub Actions, single workflow file. Token contrast check runs here too.
- **D-08:** Repo is scaffolded via `create-next-app@16 --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint`. `--no-eslint` is deliberate — Biome replaces ESLint. Delete every starter-template asset, default README, placeholder logo. README must reflect the actual project.

### Claude's Discretion

- **Color palette & accent values** — pick a restrained monochrome base with at most one subtle accent hue, dark-mode base **not** pure `#000` (use `~#0a0a0a`–`#121212` per PITFALLS.md Pitfall 4 guidance on dark-mode grays). Contrast ratios are non-negotiable (see D-06). If a single accent is used, desaturate it for the dark theme to avoid vibration on dark backgrounds.
- **Deployment target (Vercel vs Netlify)** — pick per STACK.md "Stack Patterns by Variant" based on commercial-use intent. Default to **Vercel** unless the portfolio will list freelance rates (then Netlify). For Phase 1 scope: write env/image-pipeline code to work on both (install `sharp` explicitly so Netlify works; Vercel will ignore the redundant local install). Actual deploy wiring happens in Phase 7.
- **Type scale ratio + base size** — default to `1rem = 16px` base and a **1.25 (major third)** scale for token generation. Planner may substitute `1.2` or `1.333` if there's a concrete reason. All sizes expressed as `rem` in tokens, never hardcoded `px` except for UI-chrome primitives (borders, radii).
- **Biome vs Biome + ESLint hybrid** — default to **Biome-only** per STACK.md. Accessibility is covered by `@axe-core/playwright` in E2E (Phase 7). No `eslint-plugin-jsx-a11y`, no `eslint-plugin-tailwindcss` — revisit only if Biome misses something concrete during execution.
- **Weight token set** — default to **400 / 500 / 700** (regular, medium, bold) for body/UI. Headings 700–800. Geist is a variable font so intermediate weights are essentially free — the token set is for utility-class discipline, not payload.
- **Italic variant** — ship sans italic; skip mono italic in the initial token block. Add mono italic later only if a concrete use case appears.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

**Open design-judgment calls for the planner / execution to finalize (not scope creep, just delegated by user):**
- Exact accent hue (if any) for `@theme` — picker discretion, constrained by D-06 contrast requirements.
- Exact neutral greyscale ramp — 9-step or 11-step, both work.
- Exact type scale ratio (1.2 / 1.25 / 1.333).
- Vercel vs Netlify commit decision — defer to execution unless commercial intent changes before then.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Next.js 16 App Router + TypeScript strict (`strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`) | §Scaffold & Cleanup, §tsconfig.json template; `create-next-app@16` flag set + three strict flags appended post-scaffold |
| FOUND-02 | Tailwind CSS v4 with CSS-first `@theme` tokens in `globals.css` (text, bg, surface, border, accent — light + dark) | §Tailwind v4 `@theme` Block, §Token Architecture (fully specified CSS skeleton) |
| FOUND-03 | Geist Sans + Geist Mono via `next/font` (self-hosted, no Google Fonts request) | §Geist via `geist` npm (Pattern + pitfall — **replace the Google-hosted Geist scaffolded by default**) |
| FOUND-04 | Typography scale as design tokens (display, h1–h4, body, caption, mono-sm/base) + Tailwind utilities | §Type Scale Tokens (major-third ratio, `--text-*` namespace in `@theme`) |
| FOUND-05 | Dark-mode toggle via `next-themes`, FOUC-free, `suppressHydrationWarning` on `<html>`, system default, persisted override | §next-themes Wiring (exact ThemeProvider props + blocking-script mechanics + `@custom-variant dark` integration) |
| FOUND-06 | Biome installed; `npm run lint` and `npm run format` pass on empty project | §Biome Setup (biome.json config + npm scripts) |
| FOUND-07 | CI runs lint + typecheck + build on every push | §GitHub Actions Workflow (single-file YAML skeleton including contrast gate) |
| FOUND-08 | Clean repo — no starter templates, README reflects actual project | §Post-Scaffold Cleanup (full file list to delete) |
| A11Y-03 | Tokens enforce WCAG AA contrast in both themes: primary ≥7:1, secondary ≥4.5:1, interactive ≥3:1 | §Automated Contrast Gate (Vitest test using `wcag-contrast` package) |
</phase_requirements>

## Summary

Phase 1 is the "scaffold + machinery" phase — no product features, no content, no components beyond what's needed to prove the theme/font/toggle stack works end-to-end. Every architectural decision made here locks the shape of every downstream phase, so getting it right matters more than getting it fast. The phase has nine requirements (FOUND-01..08 + A11Y-03) and five "must be TRUE" success criteria in ROADMAP.md.

The stack is fully pre-committed: Next.js 16.2.4 + React 19.2.5 + TypeScript 5.9.3 + Tailwind 4.2.4 + next-themes 0.4.6 + geist 1.7.0 + Biome 2.4.12. All versions were verified live against the npm registry on 2026-04-21. The only version dissonance worth flagging: `typescript@latest` is 6.0.3, but the pinned 5.9.x line in STACK.md aligns with broader ecosystem compatibility (Next 16, @types/react 19.2.14) and is the safer pick — defer the TS 6 upgrade to a later milestone.

**Primary recommendation:** Execute in seven ordered tasks — (1) scaffold with the exact `create-next-app@16` incantation and immediately strip starter assets, (2) tighten `tsconfig.json` with the three strict flags, (3) install runtime deps (`geist`, `next-themes`) + dev deps (`@biomejs/biome`, `wcag-contrast`), (4) write `globals.css` with `@import "tailwindcss"`, `@custom-variant dark (&:where(.dark, .dark *))`, and a fully-tokenized `@theme` block, (5) wire `app/layout.tsx` with Geist variables on `<html>` and `ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange` in `<body>`, (6) drop a minimal proof-of-life `app/page.tsx` that renders Geist-rendered text + a leaf `<ThemeToggle />` client component, (7) add `biome.json` + GitHub Actions workflow with four gates: `biome check`, `tsc --noEmit`, `next build`, and a Vitest-run contrast check using `wcag-contrast`. Manual verification: hard-refresh in dark on throttled 3G shows zero white flash.

The biggest risk is quiet drift: (a) the default `create-next-app@16` template now scaffolds Geist via `next/font/google` (Google-hosted proxy), which violates FOUND-03's "no Google Fonts request" requirement — the scaffolded font imports must be replaced with `geist/font/sans` + `geist/font/mono` from the `geist` npm package; (b) multiple 2025 tutorials wire Tailwind v4 dark mode via `data-theme` attribute, which doesn't match D-05's `.dark` class convention — use the `@custom-variant dark (&:where(.dark, .dark *))` form specifically. The Pitfalls section calls both out explicitly.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Project scaffold (files, package.json) | Build-time CLI | — | `create-next-app@16` owns initial file tree; no runtime involvement |
| TypeScript strict type checking | Build-time (tsc) | CI | Pure static analysis; no runtime cost; CI gate prevents regressions |
| Design token definitions | CSS (build-time compile) | — | Tailwind v4 compiles `@theme` tokens into the final stylesheet; zero runtime JS |
| Font loading (Geist Sans + Mono) | Build-time (next/font) | Browser (self-hosted woff2) | `next/font` via `geist` package self-hosts fonts at build; browser loads local woff2 — zero third-party request |
| Theme class application (`.dark` on `<html>`) | Browser (pre-hydration script) | Client React (persistence) | `next-themes` injects a synchronous `<script>` in `<head>` that runs before paint; React only handles toggle persistence after hydration |
| CSS variable flipping (dark-mode tokens) | Browser (CSS cascade) | — | Pure CSS: `.dark { --bg: ...; }` — browser's cascade handles it; no JS re-render |
| Theme toggle UI | Browser (React client island) | — | The *only* `"use client"` leaf in this phase; `useTheme()` + button; wrapped in mounted-state guard to avoid hydration mismatch |
| Contrast ratio validation | Build-time (Vitest in CI) | — | Runs against the token values exported from a shared constants file; fails the build on regression |
| Lint + format | Build-time (Biome) | CI | Biome `check` command runs in both local `npm run check` and CI `biome ci` |
| Build verification | Build-time (`next build`) | CI | Smoke test that the whole pipeline compiles |

## Standard Stack

### Core (pinned versions verified via `npm view <pkg> version` on 2026-04-21) [VERIFIED: npm registry]

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | 16.2.4 | Framework (App Router, SSG, RSC default, Metadata API) | Locked by D-04 + STACK.md. v16 line is stable; App Router is the default. [VERIFIED: npm registry 2026-04-21] |
| `react` | 19.2.5 | UI library | Paired with Next 16 (Next 16 requires React 19). [VERIFIED: npm registry] |
| `react-dom` | 19.2.5 | DOM renderer | Must match `react` version. [VERIFIED: npm registry] |
| `typescript` | 5.9.3 | Type system with strict mode | Pinned to 5.9.x per STACK.md. Latest is 6.0.3 but 5.9.3 is the safer compatibility target for React 19 types + Next 16 build tooling in April 2026. [VERIFIED: npm registry; CITED: STACK.md] |
| `@types/react` | 19.2.14 | React TS types | [VERIFIED: npm registry] |
| `@types/node` | 25.6.0 | Node TS types | Node 22 LTS is the recommended runtime; Node 20 LTS is the floor per STACK.md. [VERIFIED: npm registry] |
| `tailwindcss` | 4.2.4 | CSS-first styling, `@theme` tokens | v4 is current stable; CSS-first via `@import "tailwindcss"` + `@theme { }` block. `tailwind.config.js` is **not created** (v4 doesn't need it). [VERIFIED: npm registry; CITED: tailwindcss.com/docs/theme] |
| `@tailwindcss/postcss` | 4.2.4 | PostCSS plugin (Next.js pipeline) | Required peer of Tailwind v4 for the Next.js PostCSS pipeline. [VERIFIED: npm registry] |
| `next-themes` | 0.4.6 | FOUC-free dark mode, persisted toggle | Injects a blocking `<script>` in `<head>` before hydration; de facto standard for Next App Router theming. [VERIFIED: npm registry; CITED: github.com/pacocoursey/next-themes] |
| `geist` | 1.7.0 | Geist Sans + Geist Mono self-hosted | Published by `vercel-release-bot`; uses `next/font/local` internally; **zero network requests at runtime**. [VERIFIED: npm registry 2026-04-21 — `deps: none`, 8.0 MB unpacked (woff2 bundled)] |
| `@biomejs/biome` | 2.4.12 | Lint + format (single binary) | Locked by D-04 + D-08 (`--no-eslint` flag). [VERIFIED: npm registry] |

### Supporting (Phase 1 only — deferred deps not installed here)

| Library | Version | Purpose | When to Install |
|---------|---------|---------|-----------------|
| `wcag-contrast` | 3.0.0 | Compute WCAG contrast ratio from hex colors in Node | Install as `devDependency` — used by the automated contrast test that A11Y-03 + D-06 require. [VERIFIED: npm registry; CITED: npmjs.com/package/wcag-contrast] |
| `@types/wcag-contrast` | latest | TS types for the above | [VERIFIED: searched on npm] |
| `vitest` | 4.1.4 | Test runner for the contrast unit test | Per STACK.md. Installed in Phase 1 *only* to run the contrast check; broader test suite is Phase 2+. [CITED: STACK.md] |

Deferred (installed in later phases, **do not install in Phase 1**): `zod` (Phase 2), `@content-collections/*` (Phase 2), `lucide-react` (Phase 3), `motion` (Phase 4), `@testing-library/react`, `@playwright/test`, `@axe-core/playwright` (Phase 7). Keeping Phase 1 deps minimal keeps the scaffold diff small and reviewable.

### Alternatives Considered

| Instead of | Could Use | Tradeoff / Why Rejected |
|------------|-----------|-------------------------|
| `geist` npm package | `next/font/google` Geist | Google-hosted proxy **does** self-host at build time but is a different code path and some tutorials conflate the two. Locked out by D-01 ("via the `geist` npm package", self-hosted, zero network font requests). |
| `@custom-variant dark (&:where(.dark, .dark *))` | `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))` | Some 2025 Tailwind v4 + next-themes tutorials use `data-theme`. Locked out by D-05 ("class") and next-themes docs pairing `attribute="class"` with Tailwind's `.dark` convention. |
| `wcag-contrast` | `@axe-core/playwright`, Lighthouse accessibility audit | Playwright + axe are E2E-scope and only verify rendered pages, which needs Phase 3+ content. A unit-level contrast check reads the token values directly — runs in ~100ms in CI, gates Phase 1, doesn't require a running browser. [CITED: A11Y-03 + D-06 require CI gate now, not later] |
| TypeScript 5.9.3 | TypeScript 6.0.3 | TS 6 is one week old at time of research; Next 16 + React 19 types haven't broadly validated against it yet. Ship 5.9.3; schedule TS 6 evaluation for a future milestone. [ASSUMED: compatibility risk — based on ecosystem conventions; not directly verified against known Next 16 + TS 6 breakages] |
| Biome 2.x only | Biome + ESLint hybrid (for `@next/next` + `react-hooks/exhaustive-deps`) | STACK.md's pragmatic default is Biome-only. `eslint-plugin-jsx-a11y` concern is neutralized by `@axe-core/playwright` in Phase 7. Revisit only if Biome misses something concrete during execution. [CITED: STACK.md §Biome vs Biome + ESLint hybrid] |
| Manual inline `<script>` for theme | `next-themes` `ThemeProvider` | Hand-rolling means maintaining the blocking-script + storage + system-preference logic yourself; `next-themes` is 1 KB and handles every edge case. [CITED: STACK.md + PITFALLS.md Pitfall 3] |

### Version verification

```bash
# Verified 2026-04-21
npm view next version           # 16.2.4
npm view react version          # 19.2.5
npm view react-dom version      # 19.2.5
npm view typescript version     # 6.0.3 (latest) — use 5.9.3 per STACK.md
npm view tailwindcss version    # 4.2.4
npm view @tailwindcss/postcss version  # 4.2.4
npm view next-themes version    # 0.4.6
npm view geist version          # 1.7.0
npm view @biomejs/biome version # 2.4.12
npm view wcag-contrast version  # 3.0.0
```

## Architecture Patterns

### System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                       BUILD TIME                                     │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   create-next-app@16 ─► initial tree                                 │
│            │                                                         │
│            ▼                                                         │
│   POST-SCAFFOLD CLEANUP ─► strip starter SVGs,                       │
│                            replace page.tsx/layout.tsx,              │
│                            drop page.module.css,                     │
│                            rewrite README                            │
│            │                                                         │
│            ▼                                                         │
│   Install deps (geist, next-themes, biome, wcag-contrast, vitest)    │
│            │                                                         │
│            ▼                                                         │
│   Configure: tsconfig.json (strict flags)                            │
│              biome.json (format + lint)                              │
│              globals.css (@theme tokens + @custom-variant dark)      │
│              next.config.ts (minimal)                                │
│                                                                      │
│            │                                                         │
│            ▼                                                         │
│   `next build` ─► static HTML + compiled CSS + font files (self-host)│
│   `tsc --noEmit` ─► type-check gate                                  │
│   `biome check` ─► lint + format gate                                │
│   `vitest run` on tokens test ─► contrast gate                       │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                       REQUEST TIME (browser)                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Initial HTML arrives (includes <script> injected by next-themes)   │
│            │                                                         │
│            ▼                                                         │
│   BLOCKING INLINE SCRIPT runs synchronously before paint:            │
│     reads localStorage[theme] or prefers-color-scheme                │
│     sets document.documentElement.className = 'dark' | 'light'       │
│            │                                                         │
│            ▼                                                         │
│   BROWSER PAINTS with correct theme (NO FOUC)                        │
│     — CSS cascade resolves --bg, --text-primary, etc. via .dark rule │
│     — Geist Sans / Mono load from /_next/static/media/*.woff2        │
│            │                                                         │
│            ▼                                                         │
│   React hydrates ─► ThemeProvider owns theme state                   │
│     ─► ThemeToggle (client island) reads useTheme()                  │
│        and on click calls setTheme('dark' | 'light')                 │
│            │                                                         │
│            ▼                                                         │
│   Toggle click ─► next-themes writes localStorage + swaps class      │
│     ─► CSS variables flip via cascade ─► no React re-render needed   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure (Phase 1 only — ARCHITECTURE.md shows the full end-state)

```
portfolio/
├── .github/
│   └── workflows/
│       └── ci.yml                    # Single workflow: lint + typecheck + build + contrast
├── src/                              # --src-dir flag
│   ├── app/
│   │   ├── layout.tsx                # RSC root: html (suppressHydrationWarning, Geist vars)
│   │   │                             #          body > ThemeProvider > children
│   │   ├── page.tsx                  # Proof-of-life: "Portfolio scaffold" + <ThemeToggle/>
│   │   └── globals.css               # @import "tailwindcss" + @custom-variant dark + @theme
│   ├── components/
│   │   └── theme-toggle.tsx          # "use client" — the only client island in Phase 1
│   ├── lib/
│   │   └── tokens.ts                 # Exports token hex values for the contrast test
│   └── providers/
│       └── theme-provider.tsx        # "use client" — wraps next-themes ThemeProvider
├── tests/
│   └── tokens.contrast.test.ts       # Vitest: asserts WCAG ratios from src/lib/tokens.ts
├── .gitignore                        # Scaffolded by create-next-app
├── biome.json                        # Lint + format config
├── next-env.d.ts                     # Auto-generated; do not edit
├── next.config.ts                    # Minimal; add features phase-by-phase
├── package.json                      # Scripts: dev, build, start, lint, format, check, test
├── postcss.config.mjs                # { plugins: ["@tailwindcss/postcss"] }
├── README.md                         # Rewritten: actual project name, purpose, run instructions
├── tsconfig.json                     # Strict + noUncheckedIndexedAccess + verbatimModuleSyntax
└── vitest.config.ts                  # Minimal; for the contrast test
```

**Deliberately NOT in Phase 1** (comes later): `src/data/`, `src/content/`, `src/components/ui/`, `src/components/sections/`, `src/components/layout/`, `src/lib/content.ts`, `public/images/`, `public/resume.pdf`, `app/projects/`, `app/robots.ts`, `app/sitemap.ts`, `app/not-found.tsx`, `app/opengraph-image.tsx`. Resisting the urge to pre-create empty folders here avoids "scaffolding theatre" — later phases create their own structure.

### Pattern 1: Tailwind v4 `@theme` Block with Dark-Class Override

**What:** One `globals.css` file declares Tailwind import, the class-based dark variant, and a `@theme` block of design tokens. A `.dark` rule overrides the color tokens for dark mode. Type-scale tokens (`--text-*`), font-family tokens (`--font-sans`, `--font-mono`), and color tokens (`--color-*`) all live in the same block.

**When to use:** Every Tailwind v4 project in 2026 that uses class-based dark mode. This is canonical. [CITED: tailwindcss.com/docs/theme, tailwindcss.com/docs/dark-mode]

**Example (the phase's globals.css skeleton — planner can accept or substitute specific hex values):**

```css
/* src/app/globals.css */

/* 1. Tailwind v4 import (replaces @tailwind base/components/utilities from v3) */
@import "tailwindcss";

/* 2. Class-based dark variant.
   This is the v4 replacement for darkMode: "class" in tailwind.config.js.
   next-themes sets class="dark" on <html> → this selector matches → tokens flip. */
@custom-variant dark (&:where(.dark, .dark *));

/* 3. Design tokens — the single source of truth. */
@theme {
  /* ---------- fonts (D-01, D-03) ---------- */
  /* `geist/font/sans` / `geist/font/mono` expose CSS vars --font-geist-sans / --font-geist-mono
     when applied via .variable on <html>. We alias them to --font-sans / --font-mono
     per D-01 so Tailwind's font-sans / font-mono utilities resolve to Geist. */
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  /* ---------- color — light theme defaults (D-06 contrast) ---------- */
  --color-bg: #ffffff;              /* background */
  --color-surface: #f7f7f7;         /* elevated surfaces */
  --color-border: #e5e5e5;          /* hairlines */
  --color-text-primary: #0a0a0a;    /* body text — ≥7:1 vs --color-bg */
  --color-text-secondary: #525252;  /* meta / muted — ≥4.5:1 vs --color-bg */
  --color-accent: #0057ff;          /* single accent — ≥3:1 for interactive */

  /* ---------- type scale — major third (1.25) per discretion ---------- */
  --text-caption: 0.8125rem;         /* 13px */
  --text-body: 1rem;                 /* 16px base */
  --text-lg: 1.25rem;                /* 20px */
  --text-h4: 1.5625rem;              /* 25px */
  --text-h3: 1.953125rem;            /* 31px */
  --text-h2: 2.44140625rem;          /* 39px */
  --text-h1: 3.0517578125rem;        /* 49px */
  --text-display: 3.814697265625rem; /* 61px */
  --text-mono-sm: 0.875rem;
  --text-mono-base: 1rem;

  /* ---------- weight tokens (discretion: 400/500/700) ---------- */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
}

/* 4. Dark-mode overrides.
   Pure CSS. No JS involved. Browser's cascade flips these when <html class="dark">. */
.dark {
  --color-bg: #0a0a0a;              /* NOT #000 per PITFALLS.md Pitfall 4 */
  --color-surface: #161616;
  --color-border: #262626;
  --color-text-primary: #fafafa;    /* ≥7:1 vs #0a0a0a */
  --color-text-secondary: #a3a3a3;  /* ≥4.5:1 vs #0a0a0a */
  --color-accent: #4d8bff;          /* desaturated — no vibration on dark */
}
```

**Trade-offs:**
- Pro: Zero-runtime JS for theme swap. CSS cascade does all the work.
- Pro: Token values are greppable and swap-ready (palette tweaks touch one file).
- Pro: Tailwind v4 auto-generates utilities (`bg-bg`, `text-text-primary`, `font-sans`, `text-display`) from the token names — no `tailwind.config.js` needed.
- Con: Hex values are duplicated between `globals.css` and `src/lib/tokens.ts` (the contrast-test source). Mitigation: the test can parse `globals.css` directly with a regex, **or** `tokens.ts` exports the values and `globals.css` uses `var(--color-bg)` indirection. Planner decides; the simpler path is regex-parse `globals.css` in the test.

### Pattern 2: `next-themes` ThemeProvider at Root + `.dark` Class + `suppressHydrationWarning`

**What:** `ThemeProvider` from `next-themes` wraps the whole app inside `<body>` of `app/layout.tsx`. It's configured with `attribute="class"` (adds `class="dark"` on `<html>`), `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`. `suppressHydrationWarning` lives on `<html>` so the hydration mismatch from the blocking script doesn't log a warning.

**When to use:** Every Next.js App Router project doing class-based dark mode. [CITED: github.com/pacocoursey/next-themes]

**Example:**

```tsx
// src/providers/theme-provider.tsx
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"             // sets <html class="dark"> — pairs with @custom-variant dark
      defaultTheme="system"         // respects prefers-color-scheme on first visit
      enableSystem                  // keeps system as a possible resolvedTheme
      disableTransitionOnChange     // prevents CSS transition flash on theme swap
      storageKey="portfolio-theme"  // explicit key (default is "theme"; explicit is nicer for debugging)
    >
      {children}
    </NextThemesProvider>
  );
}
```

```tsx
// src/app/layout.tsx
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

export const metadata = {
  title: "PLACEHOLDER_SITE_TITLE",           // real value swapped in Phase 2
  description: "PLACEHOLDER_SITE_DESCRIPTION",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning is REQUIRED — next-themes mutates <html> before hydration.
    // Applies ONE LEVEL deep only; child mismatches still warn (per next-themes docs).
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

```tsx
// src/components/theme-toggle.tsx
"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — resolvedTheme is undefined on server
  useEffect(() => setMounted(true), []);
  if (!mounted) return <button aria-label="Toggle theme" disabled style={{ width: 32, height: 32 }} />;

  const next = resolvedTheme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      aria-label={`Switch to ${next} theme`}
      onClick={() => setTheme(next)}
    >
      {resolvedTheme === "dark" ? "☀" : "☾"}
    </button>
  );
}
```

**Trade-offs:**
- Pro: FOUC prevention is automatic (next-themes injects the blocking script — developer does not manually add it). [CITED: next-themes README]
- Pro: `disableTransitionOnChange` prevents the jarring CSS transition that plays when many colors flip simultaneously.
- Con: `useTheme()` returns `undefined` on the server pass, so any UI that depends on it (like the icon inside the toggle) must be guarded by a `mounted` state. The empty-button placeholder in the snippet reserves layout space during that brief pre-hydration window.

### Pattern 3: Geist via `geist` npm Package (self-hosted, variable-scoped)

**What:** `GeistSans` and `GeistMono` imported from `geist/font/sans` and `geist/font/mono`. These are `NextFontWithVariable` instances (the `geist` package uses `next/font/local` internally and ships the woff2 files in the npm tarball — 8 MB unpacked, zero runtime network requests). Apply `.variable` from each to `<html>` via className. This exposes `--font-geist-sans` and `--font-geist-mono` on `:root`. Alias them in `@theme` as `--font-sans` / `--font-mono` so Tailwind's `font-sans` / `font-mono` utilities Just Work.

**When to use:** This phase, per D-01. [CITED: npmjs.com/package/geist search results; STACK.md §Typography Specifics]

**Critical scaffold divergence:** `create-next-app@16` scaffolds Geist via `next/font/google` (which self-hosts Google's CDN copy at build). That's a different code path from the `geist` npm package. D-01 mandates the `geist` package. The planner task for font wiring must *replace*, not *extend*, the scaffolded imports:

```diff
- // SCAFFOLDED — REPLACE
- import { Geist, Geist_Mono } from "next/font/google";
- const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
- const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

+ // TARGET
+ import { GeistSans } from "geist/font/sans";
+ import { GeistMono } from "geist/font/mono";
```

Both expose `--font-geist-sans` / `--font-geist-mono`, so the `@theme` aliasing downstream is identical. The change is only to the import and to the className (`${GeistSans.variable} ${GeistMono.variable}` — no call invocation). And the `geist` package must be in `package.json` (the Google-hosted version doesn't need it).

**Trade-offs:**
- Pro: Zero third-party network request at runtime (GDPR-friendly, no LCP regression from Google Fonts CDN handshake).
- Pro: Same API as `next/font` — `.variable` property exposes CSS variable; `.className` exposes a class that sets `font-family` directly.
- Con: 8 MB unpacked in `node_modules` (woff2 files), up from ~0 for `next/font/google` which fetches at build. Acceptable; never ships to client (Next.js only bundles the subset actually referenced).

### Pattern 4: Automated Contrast Gate as a Vitest Unit Test

**What:** A `tests/tokens.contrast.test.ts` file imports a pure-TS constants module (`src/lib/tokens.ts`) that exports the hex values from `globals.css`. The test uses `wcag-contrast` (`hex(a, b)` returns a number like 21 for `#000`/`#fff`) to assert each token pairing meets its WCAG threshold. CI runs `npm test` — a failure blocks merge.

**When to use:** Every project with strict contrast requirements encoded at the token layer. This is how A11Y-03 + D-06 become enforceable. [CITED: npmjs.com/package/wcag-contrast]

**Example:**

```typescript
// src/lib/tokens.ts
// Single source of truth for token hex values. Kept in sync with globals.css manually
// (planner may substitute a css-parse approach if they want zero duplication).
export const tokens = {
  light: {
    bg: "#ffffff",
    textPrimary: "#0a0a0a",
    textSecondary: "#525252",
    accent: "#0057ff",
  },
  dark: {
    bg: "#0a0a0a",
    textPrimary: "#fafafa",
    textSecondary: "#a3a3a3",
    accent: "#4d8bff",
  },
} as const;
```

```typescript
// tests/tokens.contrast.test.ts
import { describe, test, expect } from "vitest";
import { hex } from "wcag-contrast";
import { tokens } from "@/lib/tokens";

describe("WCAG contrast (A11Y-03, D-06)", () => {
  for (const mode of ["light", "dark"] as const) {
    const t = tokens[mode];
    test(`${mode}: text-primary vs bg ≥ 7:1 (AAA)`, () => {
      expect(hex(t.textPrimary, t.bg)).toBeGreaterThanOrEqual(7);
    });
    test(`${mode}: text-secondary vs bg ≥ 4.5:1 (AA)`, () => {
      expect(hex(t.textSecondary, t.bg)).toBeGreaterThanOrEqual(4.5);
    });
    test(`${mode}: accent vs bg ≥ 3:1 (interactive AA)`, () => {
      expect(hex(t.accent, t.bg)).toBeGreaterThanOrEqual(3);
    });
  }
});
```

**Trade-offs:**
- Pro: Runs in ~100ms in CI. No browser, no axe, no Lighthouse — pure math over hex strings.
- Pro: Fails the PR before a human reviews it. Retrofitting contrast later is expensive (PITFALLS.md Pitfall 4).
- Con: Hex values must stay in sync between `globals.css` and `tokens.ts`. Two mitigation options for the planner:
  1. **Single source in TS, consumed by CSS.** Generate `globals.css` from `tokens.ts` at build (overkill for Phase 1).
  2. **Parse `globals.css` in the test.** A 10-line regex extracts the hex values. Slightly more fragile but zero duplication.
  3. **Document the sync requirement in a comment.** Simplest; low maintenance given how rarely tokens change.

### Anti-Patterns to Avoid

- **Page-level `"use client"`.** Forbidden by CLAUDE.md. Breaks RSC, SEO, and the SSG story. Only `ThemeToggle` and the thin `ThemeProvider` wrapper in Phase 1 are `"use client"`. [PITFALLS.md Pitfall 12]
- **`useEffect`-based theme toggle.** Always flashes on first paint because the effect runs after paint. Use `next-themes` — its blocking `<script>` runs before paint. [PITFALLS.md Pitfall 3]
- **Pure `#000` dark-mode background.** Vibrates against saturated accents; hurts readers with astigmatism. Use `~#0a0a0a`. [PITFALLS.md Pitfall 4]
- **Keeping scaffolded starter SVGs (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`).** They'll be referenced nowhere after the `page.tsx` rewrite but bloat the repo and signal template-copy to reviewers. Delete in the post-scaffold cleanup task.
- **Defining `tailwind.config.js`.** Not needed in v4; the file will be ignored except for plugin loading. Keep the config in CSS.
- **`metadata = { title: "Create Next App" }` carried forward.** The scaffold leaves these values; downstream phases will override, but Phase 1's proof-of-life should at minimum use `PLACEHOLDER_SITE_TITLE` sentinels so a `git grep` before launch catches it.
- **Hand-rolling a hamburger/accessible primitive.** Not needed in Phase 1 (no nav yet), but calling out for the planner: Phase 3 must use Radix NavigationMenu or Headless UI, per PITFALLS.md Pitfall 13 + CLAUDE.md conventions. Do **not** add a dependency for it in Phase 1.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| FOUC-free theme application before paint | Inline `<script>` with your own localStorage read + class setter | `next-themes` `ThemeProvider` | Handles system preference, storage fallbacks, cross-tab sync, and hydration-warning suppression. 1 KB. The blocking-script pattern is subtle to get right — any bug = FOUC regression. [CITED: PITFALLS.md Pitfall 3; STACK.md] |
| Self-hosting Geist Sans + Mono with correct subset + metrics + fallback | Fetch woff2 from Google CDN + write `@font-face` rules | `geist` npm package (`next/font/local` under the hood) | Fallback metric-matching prevents CLS on font swap; subset optimization is automatic. Vercel maintains the package. [CITED: STACK.md §Typography Specifics] |
| WCAG contrast ratio math | Port the luminance formula from W3C spec | `wcag-contrast` npm (`hex()` + `score()`) | Edge cases around gamma correction and sRGB space are easy to get slightly wrong. 12 published versions, 25 KB, zero deps beyond `relative-luminance`. [CITED: npmjs.com/package/wcag-contrast] |
| Tailwind class-based dark variant | Custom PostCSS plugin | `@custom-variant dark (&:where(.dark, .dark *))` in CSS | One-liner. Built into Tailwind v4. [CITED: tailwindcss.com/docs/dark-mode] |
| Type-scale CSS custom properties | Hand-type each `--text-*` value | Compute from ratio in `@theme` and reference named tokens | Planner discretion but: use the major-third ratio, pin the base at `1rem`, and let tokens cascade. Avoids magic numbers scattered across components later. |
| Tailwind config | `tailwind.config.ts` with plugins | v4 CSS-first `@theme` | v4 doesn't need `tailwind.config.ts`. Adding it is "scaffolding theatre" — reviewer sees it and assumes v3 patterns. [CITED: tailwindcss.com/blog/tailwindcss-v4] |
| Node version pinning in CI | Installing every Node version | `actions/setup-node@v4` with `node-version: 22` + `cache: 'npm'` | Standard. Caches `~/.npm` for 10× faster CI. |

**Key insight:** Phase 1 is *infrastructure*. Every line of code you don't write here is a line that can't drift from the community standard when Tailwind v4.3 ships or next-themes 0.5 changes an API. Lean on the stack.

## Post-Scaffold Cleanup (FOUND-08)

`create-next-app@16 portfolio --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint` generates [VERIFIED: WebFetch of canary create-next-app template 2026-04-21]:

**Files created by the scaffold (everything below paths is under `portfolio/`):**
- `.env.example` — keep (empty by default; add vars per phase as needed)
- `.gitignore` — keep
- `next-env.d.ts` — keep (auto-managed)
- `next.config.ts` — keep; review contents (default is minimal)
- `package.json` — keep; edit scripts (§npm Scripts)
- `postcss.config.mjs` — keep
- `tsconfig.json` — keep; edit (§tsconfig.json)
- `README-template.md` — **rename to `README.md`** and rewrite (§README)
- `src/app/layout.tsx` — **rewrite** per Pattern 2
- `src/app/page.tsx` — **rewrite** as proof-of-life (§Proof-of-Life page.tsx)
- `src/app/globals.css` — **rewrite** per Pattern 1
- `src/app/favicon.ico` — **delete** (Phase 6 generates the real favicon set)
- `src/app/page.module.css` — **delete** (scaffolded for starter page; not needed with Tailwind)
- `public/file.svg` — **delete**
- `public/globe.svg` — **delete**
- `public/next.svg` — **delete**
- `public/vercel.svg` — **delete**
- `public/window.svg` — **delete**
- `biome.json` (if `--biome` was used) — **with `--no-eslint` and no `--biome`, Biome is NOT scaffolded; install it manually per §Biome Setup**
- `eslint.config.mjs` — **should not exist with `--no-eslint`; verify and delete if present**

**Empty `public/` after cleanup is fine** — Phase 6 adds the favicon set, Phase 4 adds `resume.pdf`.

**Verification command after cleanup:**
```bash
git ls-files | sort
# Expected: no *.svg except if intentionally added; no page.module.css; no eslint.config.mjs
```

## Code Examples

Verified patterns from official sources. The canonical full-file snippets are in the Patterns section above. These are additional smaller snippets.

### tsconfig.json strict block (D-04, FOUND-01)

```json
// tsconfig.json — ONLY the three locked-in strict flags are non-standard;
// the rest is inherited from create-next-app@16 defaults.
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    // ... all other create-next-app defaults kept as-is:
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Source:** Next.js 16 `create-next-app` TypeScript template + D-04 three strict flags. `noUncheckedIndexedAccess` catches `arr[0]` being possibly `undefined` — highly relevant for typed `/data` modules in Phase 2. `verbatimModuleSyntax` enforces explicit `import type` — ergonomic in larger codebases. [VERIFIED: WebFetch of canary create-next-app template]

### biome.json (FOUND-06)

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.12/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "includes": ["src/**", "tests/**"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "a11y": "warn",
      "style": {
        "noNonNullAssertion": "warn"
      },
      "suspicious": {
        "noExplicitAny": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "all"
    }
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

**Source:** [CITED: biomejs.dev/reference/configuration + biomejs.dev/guides/getting-started]. Biome 2.x has built-in React + Next.js awareness in the `recommended` rule set. `a11y: "warn"` enables the accessibility rules Biome *does* have (some, not ESLint-plugin-jsx-a11y parity — Phase 7's `@axe-core/playwright` covers the rest). [ASSUMED: exact scope of Biome's a11y ruleset in v2.4.12 — rules list not re-verified this session; recommended group is stable per docs]

### npm Scripts (FOUND-06, FOUND-07)

```json
// package.json — scripts section
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "lint": "biome lint .",
    "format": "biome format --write .",
    "check": "biome check --write .",
    "ci:biome": "biome ci .",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

**Source:** [CITED: biomejs.dev/guides/getting-started + vitest.dev/guide]. `biome check` is the combined format+lint+organize-imports pass. `biome ci` is format+lint without writes, optimized for CI. The CI workflow uses `npm run ci:biome` to avoid touching files.

### GitHub Actions workflow (FOUND-07, D-07)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - name: Biome (lint + format + import sort)
        run: npm run ci:biome

      - name: TypeScript typecheck
        run: npm run typecheck

      - name: Contrast gate (A11Y-03, D-06)
        run: npm test

      - name: Build
        run: npm run build
```

**Source:** [CITED: biomejs.dev/recipes/continuous-integration, standard GitHub Actions pattern]. Single workflow file per D-07. All four gates run on every push and PR. `npm ci` is used (not `npm install`) for reproducibility. Node 22 per STACK.md (20 LTS is the floor; 22 is the Vercel default and preferred local).

### Proof-of-Life `page.tsx`

```tsx
// src/app/page.tsx — Phase 1 proof-of-life. Replaced in Phase 3/4.
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg text-text-primary font-sans px-6 py-12">
      <header className="flex items-center justify-between mb-12">
        <span className="font-mono text-mono-sm text-text-secondary">
          PLACEHOLDER_SITE_TITLE
        </span>
        <ThemeToggle />
      </header>
      <h1 className="text-display font-bold tracking-tight">
        Scaffold verified.
      </h1>
      <p className="mt-4 text-body text-text-secondary max-w-prose">
        Geist Sans renders this paragraph. Geist Mono renders the header label.
        The toggle flips the theme with no FOUC on reload.
      </p>
    </main>
  );
}
```

Zero business logic. Zero content strings beyond placeholder sentinels. Its only job is to prove the stack works: font classes resolve, token utilities render, toggle works, no FOUC on hard-refresh. Replaced in Phase 3 (layout shell) and Phase 4 (real sections).

## Common Pitfalls

### Pitfall 1: The scaffolded `app/layout.tsx` imports Geist from `next/font/google`

**What goes wrong:** `create-next-app@16` template uses `import { Geist, Geist_Mono } from "next/font/google"`. That invokes `next/font/google`, which **does** self-host the font files at build time — but downloads them from Google's CDN during `next build`. This is not a runtime request (FOUND-03 requirement is technically met), but it's a different code path than D-01 (`geist` npm package via `next/font/local`).

**Why it happens:** Scaffold defaults. Scaffold defaults don't know about D-01.

**How to avoid:** Part of the post-scaffold cleanup. Replace the two `next/font/google` imports with `geist/font/sans` and `geist/font/mono`; drop the `Geist(...)` / `Geist_Mono(...)` function invocations (the geist package exports `GeistSans` and `GeistMono` directly); keep the `.variable` spreading on `<html className>` unchanged because the CSS variable names match (`--font-geist-sans`, `--font-geist-mono`).

**Warning signs:** `package.json` doesn't include `geist` as a dependency. Build output shows "Downloading font files from fonts.gstatic.com" during `next build`.

### Pitfall 2: FOUC on hard-refresh in dark mode despite using `next-themes`

**What goes wrong:** The site briefly paints light before flipping to dark on a dark-preference visitor's hard refresh, even after installing `next-themes`.

**Why it happens:** Usually one of four causes:
1. `suppressHydrationWarning` missing from `<html>` — causes React to replace the class the script set, re-triggering a light paint.
2. `ThemeProvider` mounted inside a component that itself is loaded via `dynamic(..., { ssr: false })` — the blocking script never ships to the server-rendered HTML.
3. Tailwind `darkMode` is still configured in a leftover `tailwind.config.js` that disagrees with the `@custom-variant dark` line (v4 ignores most of the config but this specific disagreement has been reported).
4. The `.dark` CSS rule is declared *before* the `@theme` block — light tokens in `@theme` then "override" back because of cascade specificity.

**How to avoid:** Follow Pattern 2 exactly. `ThemeProvider` in `<body>`, `suppressHydrationWarning` on `<html>`, no `tailwind.config.js` file, `.dark` rule declared *after* `@theme` in `globals.css`.

**Warning signs:** Chrome devtools Network tab throttle to "Slow 3G", hard-refresh in dark → any white frame, even 50 ms. Safari's aggressive caching sometimes hides the issue on localhost — test on a deploy preview URL. [CITED: PITFALLS.md Pitfall 3]

### Pitfall 3: Tailwind v4 `bg-bg` utility doesn't resolve despite `--color-bg` being defined

**What goes wrong:** `<div className="bg-bg">` renders with no background color. Token is defined in `@theme` but the utility class doesn't pick it up.

**Why it happens:** Tailwind v4's utility generator reads `--color-*` tokens by namespace and generates `bg-<rest-of-name>` — a token named `--color-bg` generates a utility called `bg-bg`, which **works** but reads oddly. If the planner names the token `--color-background` instead, the utility is `bg-background`, which reads better. This is purely a naming choice; both are valid.

**How to avoid:** Name tokens so the generated utility reads well. `--color-background`, `--color-text`, `--color-surface`, `--color-border`, `--color-accent` → `bg-background`, `text-text`, `bg-surface`, `border-border`, `bg-accent` / `text-accent`.

**Warning signs:** Utility class appears in the inspector but maps to an empty CSS rule; token exists but utility doesn't — check the token namespace (`--color-*`, `--font-*`, `--text-*`, `--spacing-*`). Tokens outside a recognized namespace get declared as CSS variables but generate no utility.

### Pitfall 4: `disableTransitionOnChange` not set — cascading color flash on toggle

**What goes wrong:** Clicking the theme toggle triggers a messy cascade of color transitions as each element's `background-color`, `color`, `border-color` animate independently over its declared transition duration. Looks laggy and glitchy.

**Why it happens:** If any element has `transition-colors` or `transition: all` in its class list, it transitions during the theme swap too. `next-themes` has a `disableTransitionOnChange` prop that injects an inline style preventing transitions during the swap frame.

**How to avoid:** Pass `disableTransitionOnChange` on `ThemeProvider`. (It's in Pattern 2.)

### Pitfall 5: `ThemeToggle` causes hydration warning because `useTheme()` returns `undefined` on server

**What goes wrong:** A warning in the browser console: "Hydration failed because the initial UI does not match what was rendered on the server." Pointed at the toggle button.

**Why it happens:** `useTheme()` returns `{ theme: undefined, resolvedTheme: undefined }` during SSR (server has no access to localStorage). If the toggle's visible content (e.g., sun/moon icon) depends on the resolved theme, the server renders nothing and the client renders `☾` — mismatch.

**How to avoid:** Guard the icon behind a `mounted` state (see Pattern 2 toggle snippet). Render a layout-preserving placeholder (same width/height as the final button) during the unmounted phase so there's no CLS.

**Warning signs:** React hydration warning console log, only on the toggle component.

### Pitfall 6: Contrast test drift — tokens changed in `globals.css` but not in `tokens.ts`

**What goes wrong:** Designer tweaks `--color-text-secondary` in `globals.css` to make it darker; contrast test still passes because `tokens.ts` has the old value; shipped CSS has actual-worse contrast.

**Why it happens:** Two sources of truth.

**How to avoid:** Planner's call — pick one of these mitigations:
1. **Single-source TS, glue-code-generate CSS.** Overkill for 7 color tokens.
2. **Test parses `globals.css` directly.** Add a 10-line regex-based extractor to the test:
   ```typescript
   import { readFileSync } from "node:fs";
   const css = readFileSync("src/app/globals.css", "utf8");
   const match = (name: string, scope: RegExp) =>
     scope.exec(css)?.[0].match(new RegExp(`--${name}:\\s*(#[0-9a-f]+)`, "i"))?.[1];
   ```
3. **Comment-enforced manual sync.** Simplest; leave a conspicuous comment in both files pointing at each other.

**Recommendation:** Option 2 (parse `globals.css`) — eliminates drift risk, adds ~10 lines. The planner should specify which option the task uses.

### Pitfall 7: `biome check` fails on first run because of scaffold imports

**What goes wrong:** `npm run check` on a fresh scaffold reports errors about unused imports or import-order issues in the scaffolded `layout.tsx` / `page.tsx`.

**Why it happens:** Biome's import organizer has opinions that may differ from the create-next-app default formatting. After rewriting `layout.tsx` and `page.tsx`, the files use the new conventions — but during the ordered task sequence, Biome is installed before the files are rewritten.

**How to avoid:** Order tasks: (1) scaffold, (2) cleanup + rewrites, (3) install Biome, (4) `biome check --write` to normalize, (5) commit. Or alternatively, install Biome first then let `biome check --write` normalize the whole tree after rewrites.

## Runtime State Inventory

Not applicable — this is a greenfield scaffold, not a rename/refactor/migration phase. No stored data, no live service config, no OS-registered state, no secrets, no build artifacts exist at phase start. The tree is `.git/`, `.planning/`, `CLAUDE.md`. Phase 1 creates everything for the first time.

**Deferred (not in Phase 1):**
- Vercel/Netlify project creation (Phase 7)
- Custom domain DNS (Phase 7)
- GitHub repo creation (outside phases — usually done before Phase 1 or immediately after scaffold)

## Environment Availability

Phase 1 has real external dependencies; auditing the local machine matters because missing tools block the scaffold command.

| Dependency | Required By | Available (check) | Minimum Version | Fallback |
|------------|------------|-----------|-----------------|----------|
| Node.js | `next`, every dep | `node --version` must report ≥20.9 | 20.9 (Next 16 floor); 22 LTS preferred | nvm + `nvm install 22` |
| npm | Package manager | `npm --version` (bundled with Node) | 10.x | Install a fresh Node if missing |
| git | Version control | `git --version` | any 2.x | n/a — required |
| `npx` | Scaffold + ad-hoc tools | `npx --version` (bundled with npm) | matches npm | n/a |
| macOS / Linux / WSL | Dev shell | — | n/a | Scaffold works cross-platform |

**All checks are non-blocking — if the runner already has a Next.js project going, these tools are present.** The planner should add a Wave 0 task to verify Node ≥22 LTS with `node --version`, and a fallback task to install via `nvm` if missing.

**Not required in Phase 1:**
- Docker (not used)
- pnpm / yarn / bun (we're on npm per CI workflow)
- Playwright browsers (Phase 7)
- Vercel/Netlify CLI (Phase 7 deploys via GitHub integration)

## Validation Architecture

Nyquist validation is enabled in `.planning/config.json` (`workflow.nyquist_validation: true`). This section drives downstream VALIDATION.md generation.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 (per STACK.md; added in Phase 1 solely for the contrast test) |
| Config file | `vitest.config.ts` (Wave 0 creates — §Wave 0 Gaps) |
| Quick run command | `npm test` (runs once and exits) |
| Watch run command | `npm run test:watch` (local dev loop) |
| Full suite command | `npm test` (in Phase 1 the suite is one file — it IS the full suite) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | TS strict compiles cleanly | Static-analysis gate | `npm run typecheck` | Must exist — ❌ Wave 0 (`tsconfig.json` edit + script) |
| FOUND-02 | Tailwind v4 `@theme` tokens parse and emit utilities | Integration (build) | `npm run build` (fails if CSS invalid) | ❌ Wave 0 (scaffold handles; verification is build-time) |
| FOUND-03 | Geist woff2 loads locally, no Google Fonts network request | Manual + build artifact check | **Manual:** DevTools Network tab on `npm run dev` — filter "fonts.gstatic", expect zero requests. Plus `grep -r "fonts.gstatic\|fonts.googleapis" node_modules/.next` expected empty after build | Manual — document in Phase 1 evidence |
| FOUND-04 | Type-scale utilities resolve (`text-display`, `text-body`, etc.) | Integration (build) | `npm run build` — CSS must include generated rules for each `--text-*` token | Indirect — build success implies |
| FOUND-05 | Hard-refresh in dark on throttled 3G paints dark on first frame | Manual (Chrome DevTools) | **Manual protocol:** (1) open site in incognito, (2) DevTools → Network → throttle to "Slow 3G", (3) toggle dark, (4) hard-refresh (Cmd+Shift+R), (5) record Performance timeline, (6) first paint frame must be dark | Manual — document with screenshot in Phase 1 evidence |
| FOUND-06 | `biome lint` and `biome format` pass on empty project | Static-analysis gate | `npm run lint && npm run format --dry-run` | ❌ Wave 0 (`biome.json` + scripts) |
| FOUND-07 | CI workflow runs lint + typecheck + build + contrast on every push | CI integration | Push to a branch → GitHub Actions run shows 4 green steps | ❌ Wave 0 (`.github/workflows/ci.yml`) |
| FOUND-08 | Clean repo — no starter assets, README reflects project | Grep + directory listing | `git ls-files \| grep -E 'next.svg\|vercel.svg\|file.svg\|globe.svg\|window.svg\|page.module.css'` must be empty; manual README review | Manual |
| A11Y-03 | `--text-primary` ≥7:1 and `--text-secondary` ≥4.5:1 in both themes | Unit | `npm test` runs `tests/tokens.contrast.test.ts` — 6 assertions | ❌ Wave 0 (`tests/tokens.contrast.test.ts` + `src/lib/tokens.ts`) |

### Sampling Rate

- **Per task commit:** `npm run check && npm run typecheck && npm test` (≈5–10 seconds)
- **Per wave merge:** Full CI workflow — `ci:biome`, `typecheck`, `test`, `build` (≈60–90 seconds)
- **Phase gate:** Full suite green + manual FOUC verification screenshot + manual FOUND-03 network verification + README review before `/gsd-verify-work`

### Wave 0 Gaps

Files that must exist before implementation work can produce greens:

- [ ] `tsconfig.json` — three strict flags (covers FOUND-01)
- [ ] `biome.json` — lint + format config (covers FOUND-06)
- [ ] `package.json` scripts (`dev`, `build`, `lint`, `format`, `check`, `typecheck`, `ci:biome`, `test`)
- [ ] `.github/workflows/ci.yml` — four-step workflow (covers FOUND-07)
- [ ] `vitest.config.ts` — minimal config resolving `@/*` alias
- [ ] `src/lib/tokens.ts` — hex values matching `globals.css` (covers A11Y-03 source)
- [ ] `tests/tokens.contrast.test.ts` — 6 WCAG assertions (covers A11Y-03)
- [ ] Framework install: `npm install -D vitest @biomejs/biome wcag-contrast @types/wcag-contrast`

## State of the Art

| Old Approach (pre-2025) | Current Approach (2026) | When Changed | Impact |
|--------------------------|-------------------------|--------------|--------|
| `tailwind.config.js` with `darkMode: "class"` | `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` | Tailwind v4.0 release (Jan 2025) | Delete the config file; v3 tutorials mislead |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` | Tailwind v4.0 | Single-line import; PostCSS plugin is separate |
| `framer-motion` for animation | `motion` (same library, renamed) | mid-2025 | Old package still installable but not maintained |
| `next-contentlayer` for MDX | `@content-collections/*` | 2024 (Contentlayer effectively abandoned) | Not a Phase 1 concern but locked for Phase 2 |
| `next lint` scaffolded by default | Next 16 removes automatic lint runner | Next 16 (Sept 2025) | Biome or ESLint must be explicitly configured — matches D-08's `--no-eslint` choice |
| `metadata` / `Head` component | Root `export const metadata` + `generateMetadata` | Next 13 App Router | Only layout.tsx exports metadata in this phase; real content is Phase 6 |
| ESLint + Prettier two-binary | Biome single binary | 2024 onward | STACK.md recommends Biome for greenfield; this phase installs it fresh |

**Deprecated/outdated (verify downstream phases don't reintroduce):**
- `tailwind.config.ts` file — not created; planner should resist the urge
- `styled-components` / `emotion` — forbidden by CLAUDE.md
- `next/head` — replaced by metadata API
- `getStaticProps` / `getServerSideProps` — replaced by RSC + `generateStaticParams`
- Pages Router — forbidden; App Router locked by D-04

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | TypeScript 6.0.3 has compatibility risks with Next 16 + React 19 types in April 2026; 5.9.3 is safer | Standard Stack — Alternatives | If TS 6 is in fact green, we're leaving a minor-version behind; trivial later upgrade. If wrong, no impact — 5.9.3 is a supported LTS-ish line. Low risk. |
| A2 | Biome 2.4.12's `a11y` rule group has useful-but-not-complete coverage compared to `eslint-plugin-jsx-a11y` | Code Examples — biome.json | STACK.md documents this gap. The plan already compensates (axe in Phase 7). If Biome's coverage is actually comprehensive, we pay nothing; if it's thinner than docs suggest, Phase 7 catches anything missed. Low risk. |
| A3 | `geist` 1.7.0 uses `next/font/local` under the hood and bundles woff2 files (zero runtime fonts.gstatic request) | Pattern 3 — Geist | STACK.md and npm registry description imply this, but not directly verified by inspecting the package internals this session. Verification can be done during execution with `grep -r "fonts.gstatic" node_modules/geist` (expected empty) and `ls node_modules/geist/dist` (expected .woff2 files). If wrong, swap to `next/font/google`'s Geist (still self-hosted at build, just from a different origin) — minor change. Low risk. |
| A4 | `next-themes` 0.4.6's auto-injected blocking `<script>` works in Next 16 App Router without manual `<script>` element | Pattern 2 — next-themes | README content fetched this session says "ThemeProvider automatically injects a script". 0.4.x is the current major and is paired with App Router in shadcn/ui's canonical docs. Risk is low but if wrong, workaround is a manual `<script dangerouslySetInnerHTML>` in `<head>`. Low risk. |
| A5 | `--color-bg` / `--color-text-primary` as token names generate `bg-bg` / `text-text-primary` utilities in Tailwind v4 | Pattern 1 — @theme | Tailwind v4 docs confirm the namespace → utility mapping. Pitfall 3 calls out the readability concern and offers the remediation (use `--color-background` / `--color-text` instead). Either naming works; it's a preference call for the planner. No risk to the mechanism. |
| A6 | The chosen color hex values (`#ffffff`, `#0a0a0a`, `#525252`, etc.) actually pass the contrast thresholds | Pattern 1 — Example hex values | The values were chosen to match thresholds but NOT machine-verified in this research session. The contrast test itself is the verifier. If a value is off, the test fails and the planner swaps the hex. Self-correcting. Very low risk. |

**How the planner should use this log:** Every assumed claim has a fallback path documented. None is a load-bearing assumption that would invalidate the plan if wrong — they're all "preferred path is X, fallback is Y, test will catch the mistake."

## Open Questions (RESOLVED)

All four questions were closed during planning (Plans 01-02 and 01-03). Resolutions are locked below; re-opening requires a new discuss-phase.

1. **Contrast-test source of truth** — **RESOLVED: Option 3 (comment-enforced manual sync).**
   - Token hex values are authored in `app/globals.css` (`@theme` block) and mirrored in `src/lib/tokens.ts` for the Node-side contrast test. Both files carry a load-bearing comment block naming each other as the paired source, so a drift is caught in code review and by the test itself failing when one side changes without the other.
   - Decision committed by: `01-02-PLAN.md` Task 1 (`src/lib/tokens.ts` + contrast test). Option 2 (regex-extract from CSS) was considered and rejected as unnecessary complexity for a 6-pair ramp.

2. **Exact color palette and accent hue** — **RESOLVED: neutral blue accent (`#0057ff` light / `#4d8bff` dark) on a near-black/near-white monochrome base.**
   - Dark base is `#0a0a0a` (not pure `#000`, per PITFALLS.md §4). Neutral ramp and accent pairings are encoded in the 6 contrast assertions in `scripts/check-contrast.ts` (all ≥7:1 or ≥4.5:1 as appropriate).
   - Decision committed by: `01-02-PLAN.md` token block + contrast test. Palette may be revisited in Phase 2 content swap if content-driven needs emerge; any swap must re-pass the same 6 assertions.

3. **Type-scale ratio** — **RESOLVED: 1.25 (major third), 1rem base.**
   - All `--text-*` tokens derive from `1rem × 1.25^n` in the `@theme` block. Expressed as `rem`; no hard-coded `px` in type tokens.
   - Decision committed by: `01-02-PLAN.md` token block.

4. **`--font-weight-extrabold: 800` tokenization** — **RESOLVED: rely on Tailwind v4's built-in `--font-weight-*` defaults (100–900); no override.**
   - The plan ships weight tokens only for the 400/500/700/800 slots actually used (body/medium/bold/display), consuming them via `font-sans font-extrabold` in the page proof-of-life without creating a custom `--font-weight-extrabold` token.
   - Decision committed by: `01-03-PLAN.md` page proof-of-life (consumes `font-extrabold`); `01-02-PLAN.md` does not author a custom 800 token.

## Sources

### Primary (HIGH confidence)

- **Next.js 16 `create-next-app` CLI reference** — nextjs.org/docs/app/api-reference/cli/create-next-app [VERIFIED: WebFetch 2026-04-21]
- **Next.js 16 scaffold template (ts app router)** — github.com/vercel/next.js/tree/canary/packages/create-next-app/templates/app/ts [VERIFIED: WebFetch 2026-04-21]
- **Tailwind CSS v4 `@theme` directive** — tailwindcss.com/docs/theme [VERIFIED: WebFetch 2026-04-21]
- **Tailwind CSS v4 dark mode** — tailwindcss.com/docs/dark-mode [CITED]
- **`next-themes` README** — github.com/pacocoursey/next-themes [VERIFIED: WebFetch 2026-04-21]
- **`wcag-contrast` npm package** — npmjs.com/package/wcag-contrast [VERIFIED: npm view + WebSearch]
- **Biome getting started** — biomejs.dev/guides/getting-started [VERIFIED: WebFetch 2026-04-21]
- **Biome configuration reference** — biomejs.dev/reference/configuration [VERIFIED: WebFetch 2026-04-21]
- **Biome CI recipes** — biomejs.dev/recipes/continuous-integration [CITED]
- **npm registry** (live version query 2026-04-21): `next@16.2.4`, `react@19.2.5`, `typescript@5.9.3` (LTS) / `@6.0.3` (latest), `tailwindcss@4.2.4`, `next-themes@0.4.6`, `geist@1.7.0`, `@biomejs/biome@2.4.12`, `wcag-contrast@3.0.0`

### Secondary (MEDIUM confidence — WebSearch verified against primary)

- **Tailwind v4 + next-themes setup** — jianliao.github.io/blog/tailwindcss-v4 [CITED via WebFetch]
- **Geist font in Next.js** — multiple WebSearch results confirm `GeistSans.variable` + `GeistMono.variable` pattern and `--font-geist-sans` / `--font-geist-mono` CSS variable names [VERIFIED]
- **Biome setup-biome GitHub Action** — github.com/biomejs/setup-biome [CITED]

### Tertiary (LOW confidence — flagged for execution-time validation)

- **`next-themes` + Next 16 React 19 exact compatibility** — `next-themes@0.4.6` is paired with Next App Router + React 19 in shadcn/ui docs (MEDIUM via community consensus) but no primary source fetched this session directly confirms 16.2.4 compatibility. If the canary changelog reveals a breaking change, switch to `disableTransitionOnChange` + manual `<script>` pattern as fallback. [ASSUMED A4]
- **`geist@1.7.0` internals** — "uses `next/font/local` under the hood" is inferred from npm metadata (8 MB unpacked, `deps: none`, "self-hosted" in package description) but not directly verified by package source inspection. Execution-time validation: `ls node_modules/geist/dist/fonts/*.woff2` after install. [ASSUMED A3]

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — every version verified live against npm registry; STACK.md + official docs agree
- Architecture: **HIGH** — follows ARCHITECTURE.md and official Next.js + Tailwind v4 + next-themes docs
- Tokens + contrast mechanism: **HIGH** — `wcag-contrast` API verified; Tailwind v4 `@theme` + `@custom-variant` syntax confirmed in official docs
- FOUC prevention: **HIGH** — next-themes behavior directly verified from README; `suppressHydrationWarning` placement confirmed
- Scaffold specifics + cleanup list: **HIGH** — template file listing verified from canary GitHub source
- Pitfalls: **HIGH** — cross-referenced against PITFALLS.md §3, §4, §12 + independent search confirmation

**Research date:** 2026-04-21
**Valid until:** 2026-05-21 (30 days — stack is stable; if `next@17` or `tailwindcss@5` ships in the window, re-verify; otherwise valid)
