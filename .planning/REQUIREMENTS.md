# Requirements: Portfolio

**Defined:** 2026-04-21
**Core Value:** A mixed-audience visitor — recruiter, hiring engineer, or potential client — lands on the site, grasps who this engineer is within seconds, and can click through to meaningful depth on at least one project.

## v1 Requirements

Requirements for initial release. Each maps to exactly one roadmap phase.

### Foundation

Scaffold, tooling, tokens, theme architecture.

- [x] **FOUND-01**: Next.js 16 App Router project scaffolded with TypeScript strict (`strict: true`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`)
- [x] **FOUND-02**: Tailwind CSS v4 installed with CSS-first `@theme` design tokens in `globals.css` (light + dark values for text, background, surface, border, accent)
- [ ] **FOUND-03**: Geist Sans + Geist Mono loaded via `next/font` (self-hosted, no Google Fonts request)
- [x] **FOUND-04**: Typography scale defined as design tokens (display, h1–h4, body, caption, mono-sm/base) and applied via Tailwind utilities
- [ ] **FOUND-05**: Dark-mode toggle implemented via `next-themes`, FOUC-free (blocking inline script before paint), `suppressHydrationWarning` on `<html>`, system preference as default, explicit override persisted
- [x] **FOUND-06**: Biome installed for lint + format; `npm run lint` and `npm run format` scripts pass on empty project
- [ ] **FOUND-07**: CI workflow runs lint + type-check + build on every push
- [x] **FOUND-08**: Repository is a clean Next.js project — no unused starter templates, README reflects actual project

### Data Layer

Typed content source-of-truth; placeholder-to-real swap is a single-file edit per concern.

- [ ] **DATA-01**: `/data/site.ts` exports site-wide config (name, title, description, url, author) as a Zod-validated object
- [ ] **DATA-02**: `/data/about.ts` exports bio content (headline, paragraphs, location, availability) as a Zod-validated object
- [ ] **DATA-03**: `/data/skills.ts` exports categorized skills list (category name + string array of tags) with Zod validation
- [ ] **DATA-04**: `/data/socials.ts` exports socials (email, github, linkedin, optional resume URL) with Zod validation
- [ ] **DATA-05**: `/data/projects/index.ts` exports typed project metadata array (slug, title, tagline, role, tech[], links, date) with Zod schema that makes `role`, `problem`, `outcomes` required — a missing field fails the build
- [ ] **DATA-06**: `/content/projects/*.mdx` holds long-form case-study prose; frontmatter validated against the same Zod schema
- [ ] **DATA-07**: `lib/content.ts` (`import "server-only"`) exposes `getAllProjects()` and `getProject(slug)` joining metadata + MDX
- [ ] **DATA-08**: Four placeholder project case studies created, each with all required fields filled with identifiable sentinel values (`PLACEHOLDER_*`, `__TODO__`) so they're greppable
- [ ] **DATA-09**: Site-wide placeholder content uses the same sentinel convention — a single `git grep PLACEHOLDER_` lists every file needing edits before launch

### Shell & Navigation

Root layout, navigation, footer, theme toggle.

- [ ] **SHELL-01**: Root `app/layout.tsx` applies fonts, theme provider, default metadata, and wraps children
- [ ] **SHELL-02**: Nav displays name/logo + section anchor links (About, Skills, Projects, Contact) + Resume link + dark-mode toggle; sticky at top
- [ ] **SHELL-03**: Mobile nav menu built on an accessible primitive (Radix NavigationMenu or Headless UI) — focus trap, keyboard navigation, escape-to-close, no custom hamburger a11y
- [ ] **SHELL-04**: Footer displays socials, copyright, "View source" link to repo, "Built with Next.js" credit
- [ ] **SHELL-05**: ThemeToggle is a client-component leaf; rest of shell stays server-rendered

### Sections

Home page content sections — Hero, About, Skills, Contact.

- [ ] **SECT-01**: Hero section displays name, role, one-line value prop, and a single primary CTA — all static, no animation gate, readable in under 10 seconds on mobile
- [ ] **SECT-02**: About section displays bio paragraphs + location/availability line, consuming `/data/about.ts`
- [ ] **SECT-03**: Skills section displays categorized tags using monospace typography; **no proficiency bars, percentages, or "beginner/intermediate/expert" labels**
- [ ] **SECT-04**: Contact section displays visible email address (not behind a click), `mailto:` link, GitHub and LinkedIn links as icons with text labels
- [ ] **SECT-05**: Resume PDF link appears in Nav AND in Contact section; opens in new tab; file lives in `public/resume.pdf`
- [ ] **SECT-06**: Home page `app/page.tsx` composes sections as RSC — no business logic, only layout
- [ ] **SECT-07**: Subtle entrance animations via `motion/react` on section reveal; respects `prefers-reduced-motion`; total animation budget under 300ms per element

### Projects

Projects index and case study detail pages.

- [ ] **PROJ-01**: Projects index on home page renders a card grid from `getAllProjects()` — each card shows title, tagline, tech pills, and links to detail page
- [ ] **PROJ-02**: `app/projects/[slug]/page.tsx` is a RSC that uses `generateStaticParams` to pre-render every project at build time
- [ ] **PROJ-03**: Project detail page renders: title, role, problem, key decisions, outcomes (quantified where possible), tech stack, live demo link, repo link, MDX body
- [ ] **PROJ-04**: MDX components `<Screenshot>`, `<CodeBlock>`, `<Callout>` available in project MDX files; images use `next/image`
- [ ] **PROJ-05**: Each project has a collocated `opengraph-image.tsx` that generates a per-project OG card (title + role + accent)
- [ ] **PROJ-06**: Per-project `generateMetadata` returns title, description, canonical URL, and references the collocated OG image
- [ ] **PROJ-07**: View-source on any `/projects/[slug]` page shows title, description, and tech stack in initial HTML (no page-level `"use client"`)

### SEO

Metadata, social cards, sitemap, structured data.

- [ ] **SEO-01**: Root metadata exports default title template, description, `metadataBase`, and site-wide OG image
- [ ] **SEO-02**: Home page defines per-route `generateMetadata` (title, description, canonical)
- [ ] **SEO-03**: Static `opengraph-image.tsx` at root generates site-wide OG card (name + tagline)
- [ ] **SEO-04**: `app/sitemap.ts` generates a sitemap covering home + every project detail page
- [ ] **SEO-05**: `app/robots.ts` returns a valid `robots.txt`
- [ ] **SEO-06**: Full favicon set — `favicon.ico`, `apple-icon.png`, `icon.png` (light + dark where supported)
- [ ] **SEO-07**: JSON-LD `Person` schema embedded on home page (name, url, sameAs socials, image)
- [ ] **SEO-08**: OG + Twitter cards verified via LinkedIn Post Inspector and Twitter Card Validator on deployed preview

### Accessibility & Quality

Baseline accessibility is table-stakes for a craft-signaling portfolio.

- [ ] **A11Y-01**: Every page uses semantic HTML — `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, heading levels in order
- [ ] **A11Y-02**: Full keyboard navigation works — tab order is logical, visible focus ring on every interactive element, no keyboard traps
- [x] **A11Y-03**: Design tokens enforce WCAG AA contrast in both themes: `--text-primary` ≥7:1, `--text-secondary` ≥4.5:1, interactive elements ≥3:1
- [ ] **A11Y-04**: All images have descriptive `alt` text; decorative images use `alt=""`
- [ ] **A11Y-05**: Animations respect `prefers-reduced-motion: reduce` — reduced/disabled when set
- [ ] **A11Y-06**: Responsive at 375px mobile width through desktop — no horizontal scroll, touch targets ≥44×44px
- [ ] **A11Y-07**: `app/not-found.tsx` custom 404 page with link back home

### Performance & Launch

CI gates and pre-launch audit.

- [ ] **PERF-01**: Lighthouse mobile scores ≥95 on all four categories (Performance, Accessibility, SEO, Best Practices) on deployed preview — **CI-gated**
- [ ] **PERF-02**: Broken-link check runs in CI (internal + external); CI fails on broken links — **CI-gated**
- [ ] **PERF-03**: All images served via `next/image` with appropriate `sizes`; hero/above-fold images use `priority`
- [ ] **PERF-04**: Production bundle analyzed — no unexpected dependencies (react-icons, styled-components, global state libs); client JS per route < 100KB
- [ ] **PERF-05**: Site deploys to Vercel via GitHub integration; every push previews, main deploys to production
- [ ] **PERF-06**: Pre-launch checklist run and passes: no `PLACEHOLDER_`/`__TODO__` sentinels in production content, resume PDF 404s checked, all demo links work, OG cards preview correctly on LinkedIn and X, favicon visible in browser tabs

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Writing

- **BLOG-01**: MDX blog/writing section with list + detail pages
- **BLOG-02**: RSS feed
- **BLOG-03**: Reading-time estimate per post

### Analytics & Engagement

- **ANLY-01**: Privacy-respecting analytics (Plausible, Fathom, or Vercel Analytics)
- **ANLY-02**: Contact form with Resend + Server Action backend (currently `mailto:`-only)
- **ANLY-03**: Command palette (⌘K) for keyboard-driven navigation

### Polish

- **POLI-01**: Dynamic per-project OG image text rendering from frontmatter
- **POLI-02**: View transitions on route navigation
- **POLI-03**: Scroll-linked progress indicator on project detail pages

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Blog / writing section | Reduces scope; avoids empty-blog syndrome; adding without committed writing is worse than not having it |
| CMS integration (Contentful, Sanity) | Flat TS data + MDX is sufficient for 3–4 projects; CMS adds maintenance burden without payoff |
| Authentication / admin panel | Static site — no accounts, no login flows |
| Contact form backend in v1 | `mailto:` is better UX than silent-delivery-failure-prone forms; backend can slot in at v2 as ANLY-02 |
| Analytics in v1 | No traffic yet; premature; v2 item |
| Internationalization | Single-language (English) for v1 |
| Heavy animation / 3D / scroll-jacking | Aesthetic is minimal/typography-forward; animation is subtle-only |
| Proficiency bars / percentage skills | Research-flagged anti-feature — actively harms credibility with hiring engineers |
| Typewriter hero / splash-gate intros | Research-flagged anti-feature — fails the 30-second recruiter scan |
| Tech-stack logo auto-marquee | Research-flagged anti-feature — signals dated |
| Mobile app / native companion | Web-only |

## Traceability

Which phases cover which requirements. Populated by roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete (01-01, 2026-04-21) |
| FOUND-02 | Phase 1 | Complete (01-02, 2026-04-21) |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Complete (01-02, 2026-04-21) |
| FOUND-05 | Phase 1 | Pending |
| FOUND-06 | Phase 1 | Complete (01-01, 2026-04-21) |
| FOUND-07 | Phase 1 | Pending |
| FOUND-08 | Phase 1 | Complete (01-01, 2026-04-21) |
| A11Y-03 | Phase 1 | Complete (01-02, 2026-04-21) |
| DATA-01 | Phase 2 | Pending |
| DATA-02 | Phase 2 | Pending |
| DATA-03 | Phase 2 | Pending |
| DATA-04 | Phase 2 | Pending |
| DATA-05 | Phase 2 | Pending |
| DATA-06 | Phase 2 | Pending |
| DATA-07 | Phase 2 | Pending |
| DATA-08 | Phase 2 | Pending |
| DATA-09 | Phase 2 | Pending |
| SHELL-01 | Phase 3 | Pending |
| SHELL-02 | Phase 3 | Pending |
| SHELL-03 | Phase 3 | Pending |
| SHELL-04 | Phase 3 | Pending |
| SHELL-05 | Phase 3 | Pending |
| SECT-01 | Phase 4 | Pending |
| SECT-02 | Phase 4 | Pending |
| SECT-03 | Phase 4 | Pending |
| SECT-04 | Phase 4 | Pending |
| SECT-05 | Phase 4 | Pending |
| SECT-06 | Phase 4 | Pending |
| SECT-07 | Phase 4 | Pending |
| PROJ-01 | Phase 5 | Pending |
| PROJ-02 | Phase 5 | Pending |
| PROJ-03 | Phase 5 | Pending |
| PROJ-04 | Phase 5 | Pending |
| PROJ-05 | Phase 5 | Pending |
| PROJ-06 | Phase 5 | Pending |
| PROJ-07 | Phase 5 | Pending |
| SEO-01 | Phase 6 | Pending |
| SEO-02 | Phase 6 | Pending |
| SEO-03 | Phase 6 | Pending |
| SEO-04 | Phase 6 | Pending |
| SEO-05 | Phase 6 | Pending |
| SEO-06 | Phase 6 | Pending |
| SEO-07 | Phase 6 | Pending |
| SEO-08 | Phase 6 | Pending |
| A11Y-01 | Phase 7 | Pending |
| A11Y-02 | Phase 7 | Pending |
| A11Y-04 | Phase 7 | Pending |
| A11Y-05 | Phase 7 | Pending |
| A11Y-06 | Phase 7 | Pending |
| A11Y-07 | Phase 7 | Pending |
| PERF-01 | Phase 7 | Pending |
| PERF-02 | Phase 7 | Pending |
| PERF-03 | Phase 7 | Pending |
| PERF-04 | Phase 7 | Pending |
| PERF-05 | Phase 7 | Pending |
| PERF-06 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 48 total
- Mapped to phases: 48
- Unmapped: 0

**Phase distribution:**
- Phase 1 (Foundation, Tokens, Theme): 9 requirements
- Phase 2 (Data Layer and Content Schema): 9 requirements
- Phase 3 (Layout Shell and Navigation): 5 requirements
- Phase 4 (Core Sections): 7 requirements
- Phase 5 (Projects Index and Case Study Detail Pages): 7 requirements
- Phase 6 (SEO, Metadata, Sitemap, Social Cards): 8 requirements
- Phase 7 (Accessibility, Performance, Launch Audit): 12 requirements
- **Total: 48**

---
*Requirements defined: 2026-04-21*
*Last updated: 2026-04-21 after Plan 01-02 complete (FOUND-02, FOUND-04, A11Y-03 checked off — token layer + contrast gate shipped)*
