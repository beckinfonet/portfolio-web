# Project Research Summary

**Project:** Portfolio (Next.js personal portfolio website for a software engineer)
**Domain:** Personal portfolio / developer marketing site
**Researched:** 2026-04-21
**Confidence:** HIGH

## Executive Summary

This is a public-presence portfolio for a software engineer serving three overlapping audiences: recruiters who skim on mobile in ~30 seconds, hiring engineers who click into project detail pages and judge the site as a work sample, and potential clients who need to quickly believe the engineer can ship. Research is unanimous that the correct approach is a multi-page Next.js SSG site (not a Vite SPA) with a single-page scrolling home, real per-project URLs for SEO and social sharing, a typed data layer in `/data` for clean content-swap later, and a minimal typography-forward aesthetic that signals craft without sacrificing legibility for non-technical visitors. Three to four deeply written case studies beat a large shallow gallery every time.

The recommended stack is Next.js 16 + React 19 + TypeScript (strict) + Tailwind CSS v4, deployed on Vercel or Netlify. Supporting libraries are purpose-matched and minimal: `next-themes` for FOUC-free dark mode, Content Collections + Zod for typed MDX case studies, Geist font via `next/font`, `lucide-react` for icons, and `motion/react` for subtle entrance animations only. Biome replaces ESLint + Prettier; Vitest and Playwright handle testing.

The two highest-risk failure modes are: (1) thin case studies that describe projects without explaining decisions, role, or outcome — the single most common reason engineer portfolios fail to convert hiring engineers; and (2) content scattered across JSX instead of a central data layer, which makes the "placeholder now, real content later" requirement a painful scavenger hunt. Both must be addressed in the earliest phases, before any UI work begins.

## Key Findings

### Recommended Stack

All versions verified live via `npm view` on 2026-04-21. See [`STACK.md`](./STACK.md) for the full prescription.

**Core technologies:**
- **Next.js 16.2.4 (App Router, SSG)** — pre-committed; `generateStaticParams`/`generateMetadata`/`opengraph-image.tsx` handle the entire SEO + OG pipeline without extra tooling
- **React 19.2.5** — pairs with Next 16; RSC default keeps JS bundle minimal
- **TypeScript 5.9.2 (strict)** — public repo judged by engineers; typed `/data` schema catches content drift at build time
- **Tailwind CSS 4.2.3** — CSS-first `@theme` config, ~70% smaller output than v3, enforces visual restraint
- **`next-themes` 0.4.6** — the only library that correctly prevents FOUC via a blocking inline script before paint
- **`@content-collections/*` 0.15.0** — actively maintained Zod-based MDX successor; Contentlayer is dead
- **`geist` 1.7.0 via `next/font`** — Geist Sans + Geist Mono, self-hosted, no Google Fonts request
- **`motion/react` 12.38.0** — renamed from `framer-motion`; subtle entrance animations only
- **`zod` 4.3.6** — validates project data schema at build time; same schema usable on contact form later
- **`lucide-react` 1.8.0** — per-icon tree-shaking; avoid `react-icons` (bundle bloat)
- **Biome 2.4.12** — replaces ESLint + Prettier; caveat: no `jsx-a11y` parity (covered by `@axe-core/playwright`)
- **Vitest 4.1.4 + RTL 16.3.2** — ESM-native with first-party Next.js docs
- **Playwright 1.59.1 + `@axe-core/playwright`** — E2E including real Safari (iOS recruiters); a11y assertions per page

**What NOT to use:** `framer-motion` (old name), `contentlayer`, `react-icons`, Google Fonts `<link>`, `styled-components`/`emotion` (RSC-incompatible), any global state library, Chakra/MUI/Mantine (fight the minimal aesthetic).

### Expected Features

See [`FEATURES.md`](./FEATURES.md) for the full landscape.

**Must have (table stakes):**
- Hero: name + role + one-line value prop + primary CTA (static, no animation gate)
- 3–4 flagship project cards → per-project case study detail pages
- Project case study: problem → role → key decisions → outcome → links
- About section: bio, location/availability line, structured for content swap
- Skills: categorized plain-text list with monospace tags — **no proficiency bars**
- Contact: email + GitHub + LinkedIn, `mailto:` link, visible email address
- Resume PDF linked in nav AND Contact section
- Dark-mode toggle: system-preference default, persisted override, no FOUC
- Responsive layout, mobile-first, tested on real devices
- Per-page metadata + static OG/Twitter cards
- Sitemap + robots.txt
- Typed project data schema in `/data`
- Accessibility baseline: semantic HTML, focus states, alt text, WCAG contrast both themes
- Lighthouse ≥90 on mobile
- 404 page + favicon

**Should have (differentiators):**
- Case studies with quantified outcomes ("cut p95 latency from 800ms → 120ms")
- "View source" footer link (meta-signal — only if repo stays clean)
- JSON-LD `Person` schema (Google knowledge panel)
- Subtle micro-interactions under 300ms, `prefers-reduced-motion` respected

**Defer (v2+):**
- Blog / writing section
- Analytics
- Contact form backend (Resend + Server Actions)
- Dynamic per-project OG generation
- Command palette
- CMS

**Anti-features (must not build):** skill proficiency bars, typewriter hero, tech-stack logo marquees, SPA with hash-only routing, scroll-jacking, empty blog.

### Architecture Approach

Hybrid routing: single-page scrolling home (`/`) composed of RSC sections + real per-project routes (`/projects/[slug]`) statically generated via `generateStaticParams`. Everything defaults to RSC; `"use client"` only at leaves (ThemeToggle, MobileMenu). All content in `/data/*.ts` (structured fields) + `/content/projects/*.mdx` (prose bodies). Design tokens in `globals.css` via Tailwind v4 `@theme`; dark mode via `.dark` class managed by `next-themes`. See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for detail.

**Major components:**
1. `/data/*.ts` — single source of truth; every placeholder is greppable; Zod validates at build time
2. `/content/projects/*.mdx` — case-study prose bodies paired with metadata in `/data/projects/index.ts`
3. `app/layout.tsx` + `ThemeProvider` — RSC root wrapping a single `"use client"` island; font loading; global metadata
4. `app/page.tsx` — RSC composition of section components (~30 lines; no business logic)
5. `app/projects/[slug]/page.tsx` — RSC with `generateStaticParams`, `generateMetadata`, collocated `opengraph-image.tsx`
6. `components/{ui,sections,layout,mdx}/` — atomic primitives, page sections, Nav/Footer/ThemeToggle, MDX renderers
7. `lib/content.ts` — `import "server-only"` module; `getAllProjects()` / `getProject(slug)` joining metadata + MDX

**Build order (mandatory):** tokens + theme → data schemas → layout shell → section components → home composition → project detail routes → metadata/SEO layer → deployment verification.

**State management:** none beyond `next-themes` + `useState` in Nav mobile menu. No Redux, no Zustand, no Context beyond ThemeProvider.

### Critical Pitfalls

Top 5 from [`PITFALLS.md`](./PITFALLS.md):

1. **Thin case studies** — every project page must enforce a Zod schema with required fields (`role`, `problem`, `decisions`, `outcome`, `retrospective`). Missing `role` must be a build error. This is the #1 conversion failure for engineer portfolios.
2. **Content scattered across JSX** — all copy in `/data`; greppable placeholder sentinels (`PLACEHOLDER_NAME`, `__TODO__`); dev-only banner on pages with unswapped content; pre-commit CI grep.
3. **Dark-mode FOUC** — `useEffect`-based toggles always flash. `next-themes` injects a blocking inline script before paint. `suppressHydrationWarning` on `<html>`. Verify via hard-refresh on throttled 3G.
4. **Low-contrast "elegant" palette failing WCAG** — 83.6% of sites have contrast violations (WebAIM 2024). Define `--text-primary` ≥7:1 and `--text-secondary` ≥4.5:1 as tokens. `@axe-core/playwright` in CI gates regressions.
5. **Client-rendered content on a static site** — `view-source` on every project page must show title, description, and tech stack in initial HTML. Avoid page-level `"use client"`. Lighthouse SEO = 100 is the gate.

## Implications for Roadmap

Suggested structure: **7 phases** (aligns with Fine granularity).

### Phase 1: Foundation — Scaffold, Tokens, Dark Mode
**Rationale:** Tokens and theme architecture must exist before any component — retrofitting tokens means rewriting every component. FOUC prevention must be baked in from the start.
**Delivers:** Next.js 16 scaffold, TypeScript strict, Tailwind v4 with `@theme` tokens, Geist font, `next-themes` ThemeProvider, Biome, basic CI.
**Addresses:** foundation + dark-mode table stakes
**Avoids:** FOUC pitfall, low-contrast pitfall
**Research flag:** Standard patterns — no deeper research.

### Phase 2: Content Schema and Data Layer
**Rationale:** Data schemas before any rendering. The keystone phase — the single-content-swap-point promise breaks if components are built without typed contracts.
**Delivers:** `/data/*.ts` for site config, about, skills, socials, projects metadata; Zod schemas with required fields enforced as build errors; `/content/projects/*.mdx` scaffolding + MDX loader in `lib/content.ts`; placeholder sentinel convention; dev banner on pages with unswapped content.
**Addresses:** content pipeline constraint from PROJECT.md
**Avoids:** scattered-content pitfall, thin-case-study pitfall, lorem-to-production pitfall
**Research flag:** Standard patterns.

### Phase 3: Layout Shell and Navigation
**Rationale:** Shell must exist before sections so sections have somewhere to live.
**Delivers:** Root layout, Nav (desktop + accessible mobile menu via Radix primitive), Footer, ThemeToggle client island, global metadata defaults, anchor-scroll behavior.
**Uses:** Radix NavigationMenu (accessible hamburger), `next-themes` ThemeToggle.
**Avoids:** mobile nav keyboard/focus failures pitfall
**Research flag:** Standard patterns.

### Phase 4: Core Sections — Hero, About, Skills, Contact
**Rationale:** Static RSC sections composing typed data. Simpler than project detail pages; unblocks a "presentable home page" milestone before the deeper project pipeline.
**Delivers:** Hero (name + role + value prop + CTA), About section, Skills section (categorized, monospace tags, no bars), Contact section (mailto + socials), Resume PDF link in nav and Contact, composed into `app/page.tsx`.
**Addresses:** table-stakes content features
**Avoids:** anti-feature clichés (proficiency bars, typewriter hero, ninja copy)
**Research flag:** design review against anti-feature list required before ship.

### Phase 5: Projects Index and Case Study Detail Pages
**Rationale:** Highest-complexity phase — MDX compilation, dynamic routes, per-route metadata, collocated OG images. Depends on all prior phases.
**Delivers:** Projects index section on home, `app/projects/[slug]/page.tsx` with `generateStaticParams` and `generateMetadata`, MDX component overrides (Screenshot, CodeBlock, Callout), collocated `opengraph-image.tsx` per project, Zod-enforced required case-study fields.
**Implements:** Architecture components 1–2, 5, 6 (mdx), 7
**Avoids:** thin-case-study pitfall, client-rendered-content pitfall
**Research flag:** Content Collections + `@next/mdx` patterns well-documented.

### Phase 6: SEO, Metadata, and OG Images
**Rationale:** Must be complete before any URL is shared. Failures here are invisible locally but catastrophic on LinkedIn/Twitter.
**Delivers:** Root `metadata`, per-route `generateMetadata`, `opengraph-image.tsx` per route, `sitemap.ts`, `robots.ts`, favicon set, JSON-LD Person schema on home, Twitter/OG card validation.
**Avoids:** missing-OG pitfall, duplicate-title pitfall
**Research flag:** Standard patterns.

### Phase 7: Performance, Accessibility, and Pre-Launch Audit
**Rationale:** Gates launch. Catches invisible "looks done but isn't" issues that consistently appear on portfolio launches.
**Delivers:** Lighthouse ≥95 all-categories CI gate, `axe` 0 violations CI gate, broken-link CI job, image optimization pass, Vercel/Netlify deploy, custom-domain/HTTPS if applicable, placeholder sentinel grep, full launch checklist.
**Avoids:** all launch-pitfall categories (domain, OG, demos, resume, placeholders, Lighthouse, a11y)
**Research flag:** Checklist execution — no research needed.

### Phase Ordering Rationale

- **Tokens before components** — retrofit cost is full rewrite of every component
- **Data schema before any rendering** — typed contracts are prerequisite to the content-swap promise
- **Shell before sections** — sections need a home; nav must be accessible from phase 3 onward
- **Simple sections (4) before project pages (5)** — sections unblock a presentable home quickly; project pipeline is the complex piece
- **SEO after UI complete** — per-route metadata needs the routes to exist
- **Audit last** — only makes sense when everything else is done; it's the gate, not a step

### Research Flags

All 7 phases use standard, well-documented patterns — no `/gsd-research-phase` calls needed.

Design-judgment calls (not technical research) to resolve:
- **Pre-Phase 1:** Final color palette + typography scale (Geist is default; engineer may prefer Inter + JetBrains Mono or IBM Plex). Lock before tokens are written.
- **Pre-Phase 1:** Vercel vs Netlify. If portfolio lists freelance rates, Netlify Hobby is legally safer (Vercel Hobby forbids commercial use). Otherwise Vercel.
- **Pre-Phase 4:** Hero copy tone and About bio direction. Anti-feature list (no "passionate / ninja / rockstar") reviewed before shipping.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified live on npm registry 2026-04-21; official Next.js, Tailwind, Vercel docs confirm every recommendation |
| Features | HIGH | Table-stakes and anti-feature lists corroborated across multiple 2025/2026 sources; Brittany Chiang reference validates pattern in practice |
| Architecture | HIGH | App Router patterns, RSC default, `generateStaticParams`/`generateMetadata` are official Next.js docs; build-order dependency graph verified against actual Next.js behavior |
| Pitfalls | HIGH | FOUC prevention, WCAG contrast, OG metadata issues documented in official sources; thin-case-study pitfall supported by multiple portfolio-review aggregates |

**Overall confidence:** HIGH

### Gaps to Address

- **Exact color palette and typography scale** — design decision engineer must make before Phase 1 locks tokens. Default: Geist + restrained monochrome with one accent.
- **Vercel vs Netlify** — commercial-use intent is the deciding factor; clarify before scaffolding. Default: Vercel unless freelance rates listed.
- **Contact form scope for v1** — PROJECT.md and research both recommend `mailto:`-only. Resend + Server Action pattern is documented in STACK.md if the engineer later changes scope.
- **Micro-interaction budget** — "subtle only, respect `prefers-reduced-motion`" is the rule. Exact animation set locked in Phase 1 to prevent cumulative creep.

## Sources

Detailed source lists appear in each dimension's file.

### Primary (HIGH confidence)
- Next.js official docs (App Router, metadata, MDX, generateStaticParams, OG)
- Tailwind CSS v4 docs (`@theme`, dark mode)
- `next-themes`, Content Collections, Geist, Motion official docs
- WCAG / WebAIM 2024 contrast study
- npm registry (live version verification)

### Secondary (MEDIUM confidence)
- Josh W. Comeau — "Building an Effective Dev Portfolio"
- Kieran Roberts — "Developer portfolio do's and don'ts"
- Toptal — portfolio case study writing
- Brittany Chiang's portfolio (archetype reference)
- 2025/2026 Next.js portfolio architecture aggregates

---
*Research completed: 2026-04-21*
*Ready for roadmap: yes*
