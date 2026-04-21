# Phase 1: Foundation, Tokens, Theme - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Stand up the Next.js 16 scaffold, strict TypeScript config, Tailwind v4 `@theme` design tokens (with WCAG-AA contrast enforced at the token layer), Geist fonts via `next/font`, FOUC-free dark mode via `next-themes`, Biome lint/format, and CI that runs lint + typecheck + build on every push. No UI components, no content, no pages beyond a minimal landing that proves the theme/font/toggle machinery works end-to-end.

A contributor must be able to clone, `npm install && npm run dev`, see Geist-rendered text with a working dark-mode toggle and no flash on hard-refresh, and every CI check must pass on an empty scaffold.

</domain>

<decisions>
## Implementation Decisions

### Typography pairing (@theme font tokens)
- **D-01:** Font family is **Geist Sans + Geist Mono**, loaded via the `geist` npm package through `next/font/local`. Single family covers body + mono with matching metrics. Self-hosted — zero network font requests. No Google Fonts `<link>` tags anywhere. Expose as CSS variables `--font-sans` and `--font-mono` via Tailwind v4 `@theme` so `font-sans` / `font-mono` utilities Just Work.
- **D-02:** Monospace scope is **code, tags, plus meta accents** — mono applies to code blocks, skill tags, kbd shortcuts, and meta accents (project dates, numerics, role/scope labels, timestamps). Prose and headings stay sans. Matches PROJECT.md's "monospace accents for code/tags" brief. Keep it restrained — do not let mono bleed into section headings or long-form prose.
- **D-03:** Display headings (hero name, h1, h2) use **the same Geist Sans at heavier weight (700–800)** — no separate display family, no mono-display hero, no tracked-in 900. Unified type system reinforces the minimal/typography-forward aesthetic. Type scale tokens (display, h1–h4, body, caption, mono-sm/base) all derive from the same single sans family.

### Claude's Discretion
The following decisions were listed as gray areas but the user explicitly deferred to standard research-backed defaults. Researcher and planner have discretion here, grounded in `.planning/research/STACK.md` and `.planning/research/PITFALLS.md`:

- **Color palette & accent values** — pick a restrained monochrome base with at most one subtle accent hue, dark-mode base **not** pure `#000` (use `~#0a0a0a`–`#121212` per PITFALLS.md Pitfall 4 guidance on dark-mode grays). Contrast ratios are non-negotiable (see D-05). If a single accent is used, desaturate it for the dark theme to avoid vibration on dark backgrounds.
- **Deployment target (Vercel vs Netlify)** — pick per STACK.md "Stack Patterns by Variant" based on commercial-use intent. Default to **Vercel** unless the portfolio will list freelance rates (then Netlify). For Phase 1 scope: write env/image-pipeline code to work on both (install `sharp` explicitly so Netlify works; Vercel will ignore the redundant local install). Actual deploy wiring happens in Phase 7.
- **Type scale ratio + base size** — default to `1rem = 16px` base and a **1.25 (major third)** scale for token generation. Planner may substitute `1.2` or `1.333` if there's a concrete reason. All sizes expressed as `rem` in tokens, never hardcoded `px` except for UI-chrome primitives (borders, radii).
- **Biome vs Biome + ESLint hybrid** — default to **Biome-only** per STACK.md. Accessibility is covered by `@axe-core/playwright` in E2E (Phase 7). No `eslint-plugin-jsx-a11y`, no `eslint-plugin-tailwindcss` — revisit only if Biome misses something concrete during execution.
- **Weight token set** — default to **400 / 500 / 700** (regular, medium, bold) for body/UI. Headings 700–800. Geist is a variable font so intermediate weights are essentially free — the token set is for utility-class discipline, not payload.
- **Italic variant** — ship sans italic; skip mono italic in the initial token block. Add mono italic later only if a concrete use case appears.

### Locked by research / CLAUDE.md (not re-decided here)
- **D-04:** Stack is Next.js 16 App Router + React 19 + TypeScript 5 strict (with `noUncheckedIndexedAccess` + `verbatimModuleSyntax`) + Tailwind CSS v4 CSS-first `@theme` + `next-themes` + Biome + Vitest + Playwright + `@axe-core/playwright`. Pinned versions live in `.planning/research/STACK.md`.
- **D-05:** FOUC prevention is mandatory and structural. `next-themes` `ThemeProvider` sits at the root of `app/layout.tsx`; `suppressHydrationWarning` on `<html>` is required; system preference is default with explicit toggle override persisted. Hard-refresh in dark mode on throttled 3G must paint dark on the first frame.
- **D-06:** Contrast thresholds are encoded as design tokens and automatically verified: `--text-primary` ≥ 7:1 against `--bg` and `--text-secondary` ≥ 4.5:1 in **both** light and dark themes. This is a CI gate — planner builds contrast checking into the CI workflow as part of this phase (FOUND-07 + A11Y-03).
- **D-07:** CI runs on every push: `biome check`, `tsc --noEmit`, `next build`. GitHub Actions, single workflow file. Token contrast check runs here too.
- **D-08:** Repo is scaffolded via `create-next-app@16 --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint`. `--no-eslint` is deliberate — Biome replaces ESLint. Delete every starter-template asset, default README, placeholder logo. README must reflect the actual project.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level source of truth
- `CLAUDE.md` — Project conventions, anti-features (no proficiency bars, no "ninja/rockstar" copy, no typewriter hero), stack, architecture rules, build order, placeholder sentinel conventions. **Start here.**
- `.planning/PROJECT.md` — Core value, constraints, key decisions, evolution log.
- `.planning/REQUIREMENTS.md` §Foundation (FOUND-01..08) + §Accessibility & Quality (A11Y-03) — the nine acceptance criteria for this phase.
- `.planning/ROADMAP.md` §Phase 1 — phase goal + 5 success criteria (must-be-TRUE statements).

### Stack & versions
- `.planning/research/STACK.md` — Pinned versions (Next.js 16.2.4, React 19.2.5, TS 5.9.2, Tailwind 4.2.3, next-themes 0.4.6, geist 1.7.0, Biome 2.4.12, etc.), install command, §"Typography Specifics" for Geist setup, §"TypeScript vs Plain JS" for `tsconfig.json` strict settings.

### Architecture rules
- `.planning/research/ARCHITECTURE.md` — Build order (tokens + theme → data → shell → sections → project routes → SEO → audit), RSC-by-default pattern, `ThemeProvider` placement at root layout, server/client boundary rules.

### Pitfalls to prevent structurally in this phase
- `.planning/research/PITFALLS.md` §Pitfall 3 (Dark-mode FOUC) — `next-themes` blocking inline script + `suppressHydrationWarning`; verify via hard-refresh on throttled 3G.
- `.planning/research/PITFALLS.md` §Pitfall 4 (Low-contrast design) — token-layer contrast ratios; axe contrast check in CI; avoid pure `#000` in dark mode.
- `.planning/research/PITFALLS.md` §Pitfall 12 (Client-rendered content) — establish RSC-default patterns now; `"use client"` only at true leaves (ThemeToggle will be the only one in this phase).

### Research summary (context)
- `.planning/research/SUMMARY.md` §"Phase 1: Foundation" — phase rationale and what it delivers vs what it avoids.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **None** — this is a greenfield repo. At phase start the tree contains only `.git/`, `.planning/`, and `CLAUDE.md`. No `package.json`, no `app/`, no `node_modules`. Phase 1 is the point where every reusable asset is created for the first time.

### Established Patterns
- **None in code** — all patterns this phase establishes come from external sources (CLAUDE.md rules, STACK.md install command, ARCHITECTURE.md build order). Every pattern the phase lays down becomes load-bearing for later phases: tokens, `@theme` structure, theme class application, font loading, CI workflow shape, tsconfig strictness.

### Integration Points
- This phase **is** the integration surface. Later phases attach to what Phase 1 creates:
  - `globals.css` `@theme` block → consumed by every component's utility classes in Phases 3–7.
  - `app/layout.tsx` shell → Phase 3 adds Nav/Footer as children; Phases 4–5 add routes as siblings.
  - `lib/theme.ts` (if created) → referenced by ThemeToggle in Phase 3.
  - Font CSS variables (`--font-sans`, `--font-mono`) → used by every typography rule downstream.
  - CI workflow → Phase 2 adds data-schema validation, Phase 7 adds Lighthouse + broken-link gates.

</code_context>

<specifics>
## Specific Ideas

- "Typography-forward" per PROJECT.md means the type system does the visual work — restraint is the brand. No visual flourishes compete with the type.
- Geist is a safe default *because* it's Vercel-designed for UI-dense technical content — the aesthetic matches the mixed-audience brief (polished for recruiters/clients, signals taste to engineers) without being loud.
- Monospace is a **signal**, not a workhorse — use it for tags, code, and meta accents. Do not let it bleed into prose or major headings.
- Dark-mode base avoids pure black (`#000`) per PITFALLS.md — a very dark grey (`#0a0a0a` to `#121212`) reduces eye strain and lets subtle accents breathe.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

**Open design-judgment calls for the planner / execution to finalize (not scope creep, just delegated by user):**
- Exact accent hue (if any) for `@theme` — picker discretion, constrained by D-06 contrast requirements.
- Exact neutral greyscale ramp — 9-step or 11-step, both work.
- Exact type scale ratio (1.2 / 1.25 / 1.333).
- Vercel vs Netlify commit decision — defer to execution unless commercial intent changes before then.

</deferred>

---

*Phase: 01-foundation-tokens-theme*
*Context gathered: 2026-04-21*
