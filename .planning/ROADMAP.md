# Roadmap: Portfolio (PORT)

## Overview

Seven-phase path from empty repo to a launchable, Lighthouse-grade personal portfolio. Build dependencies run strictly: design tokens (including contrast guarantees) before any component, typed data schemas before any rendering, accessible layout shell before sections, static home-page sections before the more complex project detail pipeline, SEO layered on once routes exist, and a final accessibility plus performance gate that blocks launch. Every v1 requirement maps to exactly one phase; nothing is deferred into a vague "polish" bucket.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [~] **Phase 1: Foundation, Tokens, Theme** - Next.js 16 scaffold, strict TypeScript, Tailwind v4 @theme tokens with WCAG-AA contrast enforced, Geist fonts, FOUC-free dark mode, Biome, CI
- [ ] **Phase 2: Data Layer and Content Schema** - Typed data modules, Zod schemas that fail the build on missing case-study fields, MDX loader, four placeholder projects greppable by sentinel
- [ ] **Phase 3: Layout Shell and Navigation** - Root layout, sticky nav with accessible mobile menu, footer, ThemeToggle client island
- [ ] **Phase 4: Core Sections (Hero, About, Skills, Contact)** - Home-page sections consuming typed data, resume PDF wired, subtle reduced-motion-respecting entrance animations
- [ ] **Phase 5: Projects Index and Case Study Detail Pages** - Project card grid, statically generated `/projects/[slug]` routes, MDX rendering with custom components, collocated per-project OG images
- [ ] **Phase 6: SEO, Metadata, Sitemap, Social Cards** - Root + per-route metadata, home OG card, sitemap/robots, favicon set, JSON-LD Person schema, deployed-preview OG validation
- [ ] **Phase 7: Accessibility, Performance, Launch Audit** - Semantic HTML + keyboard + alt-text + reduced-motion + responsive audit, custom 404, image optimization, bundle analysis, Lighthouse ≥95 CI gate, broken-link CI gate, pre-launch placeholder sweep, Vercel deploy

## Phase Details

### Phase 1: Foundation, Tokens, Theme
**Goal**: A contributor can clone the repo, run `npm install && npm run dev`, see a blank page rendered in Geist with working dark-mode toggle and no FOUC, and every CI check passes on an empty scaffold.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07, FOUND-08, A11Y-03
**Success Criteria** (what must be TRUE):
  1. `npm run dev` serves a Next.js 16 App Router page in Geist Sans / Geist Mono with no Google Fonts network request and no layout shift
  2. Hard-refresh in dark mode on a throttled 3G profile paints the dark theme on the first frame — zero white flash — and the user's explicit toggle choice persists across page reloads
  3. `npm run lint`, `npm run format`, `tsc --noEmit`, and `npm run build` all succeed locally, and the same commands run green in CI on every push
  4. Design tokens in `globals.css` pass automated contrast checks: `--text-primary` against `--bg` ≥7:1 and `--text-secondary` ≥4.5:1 in both light and dark themes
  5. `git ls-files` shows a clean, starter-template-free repo whose README reflects the actual project name and purpose
**Plans**: 4 plans
Plans:
- [x] 01-01-PLAN.md — Scaffold Next.js 16 in place, install pinned deps (Biome-only, no ESLint), harden tsconfig strict flags, configure biome.json + vitest.config.ts, purge starter assets [FOUND-01, FOUND-06, FOUND-08]
- [x] 01-02-PLAN.md — Write Tailwind v4 `@theme` token layer in globals.css, mirror six contrast-bearing hex values into src/lib/tokens.ts, wire Vitest contrast gate with six WCAG assertions (TDD RED → GREEN) [FOUND-02, FOUND-04, A11Y-03]
- [x] 01-03-PLAN.md — Wire Geist self-hosted via `geist` npm (replacing scaffolded `next/font/google`), implement `next-themes` ThemeProvider with five FOUC-preventing props, ship ThemeToggle client leaf with hydration guard + 44×44 touch target, rewrite layout/page.tsx as RSC proof-of-life with sentinel copy [FOUND-03, FOUND-05]
- [x] 01-04-PLAN.md — Ship four-gate GitHub Actions CI workflow (biome + typecheck + contrast + build) with least-privilege permissions, rewrite README.md to reflect the actual Portfolio project, phase-exit sign-off against all five Success Criteria [FOUND-07, FOUND-08]
**UI hint**: yes

### Phase 2: Data Layer and Content Schema
**Goal**: A future editor can swap every piece of placeholder content by editing files under `/data` and `/content/projects/` only — no JSX file needs to be touched — and the build will refuse to ship if any required case-study field is missing.
**Depends on**: Phase 1
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06, DATA-07, DATA-08, DATA-09
**Success Criteria** (what must be TRUE):
  1. `git grep PLACEHOLDER_` from the repo root lists every file that must be edited before launch and nothing outside `/data` or `/content`
  2. Deleting the `role` field from any project in `/data/projects/index.ts` or any MDX frontmatter causes `npm run build` to fail with a Zod error naming the offending slug and field
  3. In a scratch server component, calling `getAllProjects()` returns four placeholder case studies each with title, tagline, role, problem, outcomes, tech, links, and an MDX body; calling `getProject("unknown-slug")` returns null without throwing
  4. Importing `lib/content` from a client component produces a server-only compile error, guaranteeing filesystem and MDX code never reaches the browser
  5. Every v1 data module (`site`, `about`, `skills`, `socials`, `projects/index`) exports a Zod-validated typed object whose shape matches what the UI phases will later consume
**Plans**: TBD
**UI hint**: no

### Phase 3: Layout Shell and Navigation
**Goal**: A visitor loads any route and sees a consistent sticky header with working nav and theme toggle plus a footer, all accessible by keyboard and screen reader, with the mobile hamburger meeting accessibility primitives.
**Depends on**: Phase 1, Phase 2
**Requirements**: SHELL-01, SHELL-02, SHELL-03, SHELL-04, SHELL-05
**Success Criteria** (what must be TRUE):
  1. On desktop, the nav stays pinned to the top on scroll and shows name/logo, anchor links (About, Skills, Projects, Contact), Resume link, and the dark-mode toggle
  2. On a 375px-wide viewport, the hamburger button opens a menu that traps focus inside, closes on Escape, returns focus to the button, and is fully operable with keyboard only — verified against an accessibility primitive (Radix or Headless UI), not hand-rolled
  3. The ThemeToggle is the only client component in the shell subtree — view-source on the root layout route shows the nav and footer markup in the initial HTML
  4. The footer renders socials (consumed from `/data/socials.ts`), copyright with the site name from `/data/site.ts`, a "View source" link to the repo, and a "Built with Next.js" credit
  5. Anchor clicks (e.g. `#projects`) scroll the target section into view below the sticky header — no section is hidden under the nav
**Plans**: TBD
**UI hint**: yes

### Phase 4: Core Sections (Hero, About, Skills, Contact)
**Goal**: A recruiter on mobile lands on the home page and, within ten seconds, can read the engineer's name, role, and value prop; can find the resume PDF in two places; can see categorized skills without proficiency bars; and can email or click through to socials without scrolling past a single gate.
**Depends on**: Phase 1, Phase 2, Phase 3
**Requirements**: SECT-01, SECT-02, SECT-03, SECT-04, SECT-05, SECT-06, SECT-07
**Success Criteria** (what must be TRUE):
  1. On a fresh load at 375px width, the hero shows name + role + one-line value prop + a single primary CTA above the fold — static, no animation gate, no typewriter
  2. The Skills section displays grouped tags in monospace with zero proficiency bars, percentages, or "beginner/intermediate/expert" labels anywhere on the page
  3. Clicking the Resume link in both the nav and the Contact section opens `public/resume.pdf` in a new tab and returns HTTP 200
  4. The Contact section renders the email address as visible copyable text next to a working `mailto:` link, and the GitHub and LinkedIn links open in new tabs with `rel="noopener noreferrer"`
  5. With `prefers-reduced-motion: reduce` set in the OS, no section reveal animation plays on the home page; with motion allowed, every per-element animation completes in under 300ms
  6. `app/page.tsx` contains no business logic — it is a server component that imports typed data and composes section components only
**Plans**: TBD
**UI hint**: yes

### Phase 5: Projects Index and Case Study Detail Pages
**Goal**: A hiring engineer clicks any project card, lands on a deep-link URL like `/projects/flagship-one`, and reads a complete case study (problem, role, decisions, outcomes, tech, live/repo links, rich MDX body with screenshots) — every project page has its own shareable, indexable HTML with no client-rendering gate on core content.
**Depends on**: Phase 1, Phase 2, Phase 3, Phase 4
**Requirements**: PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05, PROJ-06, PROJ-07
**Success Criteria** (what must be TRUE):
  1. Running `npm run build` pre-renders one static HTML file per project via `generateStaticParams` — the build output lists every project slug, and hitting a slug that does not exist returns the custom 404 page
  2. View-source on any `/projects/[slug]` URL shows the project title, role, tech stack, and first paragraph of prose in the initial HTML — with JavaScript disabled, the page still reads as a complete case study
  3. Each project detail page renders all required fields in a consistent order (title, role, problem, key decisions, quantified outcomes where possible, tech stack, demo link, repo link, MDX body) — a missing required field would have failed the Phase 2 build gate
  4. The `<Screenshot>`, `<CodeBlock>`, and `<Callout>` MDX components render inside the four placeholder case-study bodies, and all images use `next/image` with explicit `sizes`
  5. Fetching `/projects/[slug]/opengraph-image` for any project returns a 1200×630 PNG whose rendered text includes that project's title and role — no two projects share the same OG image
  6. The home-page Projects section renders a card grid generated from `getAllProjects()`; each card shows title, tagline, tech pills, and links to the correct detail page
**Plans**: TBD
**UI hint**: yes

### Phase 6: SEO, Metadata, Sitemap, Social Cards
**Goal**: Every URL on the site produces a correct, unique, platform-validated preview when shared on LinkedIn, X, Slack, or iMessage, and search engines receive a valid sitemap, robots directive, and JSON-LD author identity from the home page.
**Depends on**: Phase 1, Phase 2, Phase 3, Phase 4, Phase 5
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08
**Success Criteria** (what must be TRUE):
  1. View-source on `/` and on each `/projects/[slug]` route shows unique `<title>`, meta description, canonical URL, and `og:image` tags — no two routes share the same title or OG image
  2. `/sitemap.xml` lists the home page and every project detail URL with correct canonical hosts; `/robots.txt` returns a valid, indexable directive
  3. Pasting the deployed preview URL for the home page and for one project page into LinkedIn Post Inspector and the Twitter Card Validator renders the expected image, title, and description in each tool — confirmed by screenshot
  4. The home page embeds a JSON-LD `Person` schema whose `name`, `url`, `image`, and `sameAs` values read from `/data/site.ts` and `/data/socials.ts`
  5. The favicon set (`favicon.ico`, `apple-icon`, `icon`) appears correctly in a Chrome tab, a Safari tab, and as an iOS home-screen bookmark
**Plans**: TBD
**UI hint**: yes

### Phase 7: Accessibility, Performance, Launch Audit
**Goal**: The site passes an automated accessibility plus performance gate in CI, survives a manual pre-launch checklist with no placeholders leaking to production, deploys cleanly to Vercel via GitHub integration, and is ready to announce publicly.
**Depends on**: Phase 1, Phase 2, Phase 3, Phase 4, Phase 5, Phase 6
**Requirements**: A11Y-01, A11Y-02, A11Y-04, A11Y-05, A11Y-06, A11Y-07, PERF-01, PERF-02, PERF-03, PERF-04, PERF-05, PERF-06
**Success Criteria** (what must be TRUE):
  1. A Lighthouse mobile audit on the deployed preview URL scores ≥95 on Performance, Accessibility, SEO, and Best Practices simultaneously — and the same audit runs as a CI job that fails the pipeline when any category drops below 95
  2. A broken-link checker runs in CI against the built site and fails the pipeline on any internal or external 4xx/5xx; the resume PDF link, all demo links, and every social URL return 200
  3. A tab-through of the entire site using only the keyboard reaches every interactive element in a logical order with a visible focus ring, encounters zero keyboard traps, and can open and close the mobile menu without a mouse
  4. At 375px width, no page produces horizontal scroll, every touch target measures ≥44×44 CSS pixels, and every image has a descriptive `alt` attribute (or `alt=""` if purely decorative)
  5. With `prefers-reduced-motion: reduce` set, every section reveal, theme toggle transition, and project-page transition is reduced or disabled; a custom `/not-found` page renders with a working "back home" link
  6. `grep -rE "PLACEHOLDER_|__TODO__|Lorem ipsum" data/ content/ public/` on the production build output returns zero matches, and the bundle analyzer report shows no `react-icons`, `styled-components`, `emotion`, or global-state library and every route's client JS stays under 100KB
  7. A push to the `main` branch deploys to production on Vercel via GitHub integration; every non-main push produces a preview URL; the production custom domain (when available) serves the site over HTTPS with a valid certificate
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation, Tokens, Theme | 4/4 | Executing (awaiting phase-exit verification) | - |
| 2. Data Layer and Content Schema | 0/TBD | Not started | - |
| 3. Layout Shell and Navigation | 0/TBD | Not started | - |
| 4. Core Sections (Hero, About, Skills, Contact) | 0/TBD | Not started | - |
| 5. Projects Index and Case Study Detail Pages | 0/TBD | Not started | - |
| 6. SEO, Metadata, Sitemap, Social Cards | 0/TBD | Not started | - |
| 7. Accessibility, Performance, Launch Audit | 0/TBD | Not started | - |

## Coverage

- v1 requirements: 48 total
- Mapped to phases: 48
- Unmapped: 0

| Phase | Requirement Count |
|-------|-------------------|
| 1 | 9 (FOUND-01..08 + A11Y-03) |
| 2 | 9 (DATA-01..09) |
| 3 | 5 (SHELL-01..05) |
| 4 | 7 (SECT-01..07) |
| 5 | 7 (PROJ-01..07) |
| 6 | 8 (SEO-01..08) |
| 7 | 12 (A11Y-01, 02, 04, 05, 06, 07 + PERF-01..06) |
| **Total** | **48** |

---
*Roadmap created: 2026-04-21*
*Phase 1 planned: 2026-04-21 (4 plans, 3 waves)*
*Granularity: fine (7 phases)*
*Last updated: 2026-04-21 — Plan 01-04 complete (GitHub Actions CI four-gate workflow + README rewrite; FOUND-07 + FOUND-08 closed; Task 3 approved-as-is partial — CI live-verify deferred until first push to remote). All 4/4 Phase 1 plans complete; orchestrator phase-verification pass runs next.*
