# Feature Research

**Domain:** Software engineer personal portfolio website (mixed audience: recruiters, hiring engineers, potential clients)
**Researched:** 2026-04-21
**Confidence:** HIGH (corroborated across multiple 2025/2026 sources and reference portfolios)

## Research Framing

The portfolio serves three overlapping audiences with different scanning behaviors:

1. **Recruiter (mobile, ~30s):** Needs name, current role, one-line value prop, and obvious "see work" path. Bounces if hero is unclear or load is slow (>2s).
2. **Hiring engineer (desktop, clicks into projects):** Wants technical depth — problem → approach → stack → outcome. Judges the site itself as a work sample (Lighthouse, a11y, code quality via GitHub links).
3. **Potential client (non-technical):** Wants legibility and proof of shipping. Recoils from jargon, terminal aesthetics, or anything that reads as "hobby site."

The design direction (minimal, typography-forward, monospace accents, dark-mode toggle) targets the engineer audience without alienating the other two. Most feature decisions below flow from "which audience does this serve, and does it cost credibility with the other two?"

## Feature Landscape

### Table Stakes (Site Looks Unprofessional Without Them)

Missing any of these reads as incomplete or amateur to at least one audience.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Hero with name + role + one-line value prop** | Recruiter's 30s test fails without instant identity signal. "Jane Doe — Software Engineer building [thing]." | LOW | Static text, above-the-fold, no carousel, no scroll-to-reveal |
| **Primary CTA to projects** | Recruiter needs one obvious "see work" path. Carousels and multi-CTAs dilute this. | LOW | Single button or scroll cue to `#projects` / `/projects` |
| **3–4 flagship project cards (index/grid)** | Depth-over-breadth is the 2026 consensus. Cards show title, 1-line summary, stack tags, thumbnail. | LOW | Grid or stacked list; each links to detail page |
| **Per-project case study detail page** | Hiring engineers won't hire from card summaries. They click in for problem → approach → stack → outcome. | MEDIUM | Template per project: hero image, context, role, stack, write-up, screenshots, live/repo links |
| **Live demo link + source repo link per project** | Expected on every project. Missing links = "can't actually verify this exists." | LOW | Explicit buttons; open in new tab; use rel=noopener |
| **About section with short bio** | Every audience wants to know who the person is. 2–4 paragraphs, first-person, friendly-but-professional. | LOW | Placeholder that's structured for easy content swap |
| **Skills / stack section (categorized, static)** | Hiring engineers scan for tech match. Recruiters scan for keywords. Must be present, must be honest. | LOW | Group by category (Languages, Frameworks, Infra, Tools); plain text or monospace tags — NOT bars |
| **Contact section with email + social links** | Every audience needs a way to reach out. Email + GitHub + LinkedIn is the minimum set. | LOW | Use `mailto:` + icon links; GitHub and LinkedIn are mandatory for engineers |
| **Downloadable resume (PDF)** | Recruiters often need a file to paste into ATS. Engineers may want a scan-friendly version. | LOW | Static file in `/public`; link in nav AND in About/Contact |
| **Responsive layout (mobile, tablet, desktop)** | 60%+ of recruiters review on phone. Broken mobile layout = instant bounce. | MEDIUM | Mobile-first CSS; test on real devices, not just devtools |
| **Dark-mode toggle with persisted preference** | Expected by engineer audience in 2026; part of the minimal/technical aesthetic. | MEDIUM | Respect `prefers-color-scheme` on first visit; persist explicit choice in localStorage; no flash-of-wrong-theme |
| **Per-page metadata (title, description)** | SEO for name-Googling; visible in browser tab and search results. | LOW | Next.js Metadata API; distinct title per page |
| **Open Graph + Twitter card per page** | When the URL is shared in Slack / LinkedIn / X, an unstyled link looks unserious. | MEDIUM | 1200×630 OG image; `summary_large_image` for Twitter; absolute URLs; per-project OG where feasible |
| **Sitemap + robots.txt** | Baseline SEO hygiene; Google needs it to index the project detail pages. | LOW | Next.js has built-in `sitemap.ts` and `robots.ts` conventions |
| **Fast load (<2s LCP on 4G mobile)** | Slow portfolio for a software engineer = self-own. Recruiters bounce; engineers judge. | MEDIUM | Image optimization (`next/image`), minimal JS, avoid heavy client components |
| **Accessible markup + keyboard nav** | Engineers notice broken focus states and missing alt text. Also a legal/ethics baseline. | MEDIUM | Semantic HTML, visible focus, alt text on project imagery, adequate contrast in both themes |
| **Lighthouse scores ≥90 across the board** | Portfolio is itself a work sample; low scores contradict the "I ship quality" claim. | MEDIUM | CI-check Lighthouse in preview deploys if possible |
| **Monospace accents for code/tags** | Reinforces technical aesthetic without going full terminal cosplay. | LOW | Inline `<code>` for tech names, monospace for tag chips |
| **Favicon + consistent branding** | Missing favicon reads as "unfinished side project." | LOW | Generate light/dark favicons; `apple-touch-icon` |
| **404 page** | Broken link hitting a default Next.js 404 is fine; hitting a blank page is not. | LOW | Custom `not-found.tsx` with link home |

### Differentiators (Competitive Advantage / Signals Technical Taste)

These set the portfolio apart for the hiring-engineer audience without hurting recruiter/client readability.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Case studies with problem → approach → tradeoffs → outcome narrative** | Distinguishes "I worked on this" from "I thought about this." Hiring engineers care more about the "why" than the "what." | MEDIUM | Structured template: Context, Role, Stack, Problem, Approach, Tradeoffs, Outcome/Metrics, What I'd Do Differently |
| **Quantified outcomes where honest ("cut p95 latency from 800ms → 120ms")** | Numbers separate real case studies from brochure copy. | LOW (per study) | Only where the engineer has real metrics; fabricated numbers are worse than none |
| **Typography-forward layout with restrained color palette** | Restraint signals taste; recognizable as "engineer who cares" aesthetic (Brittany Chiang archetype). | LOW | Good font pairing (display + mono), one accent color, generous whitespace |
| **Subtle micro-interactions (hover state changes, link underline animations)** | Polish signal without crossing into "flashy." | LOW | Keep under 300ms, easing curves, no bouncing |
| **Theme-aware OG images (or at least one well-designed one)** | Shared links look intentional instead of random crop. | MEDIUM | Static 1200×630 per project is enough; dynamic `@vercel/og` is nice-to-have |
| **GitHub-link-per-project with clean READMEs** | Engineer will click through; a sparse README torpedoes the case study. | LOW (site-side) | Not implemented in site, but should be accounted for in content pipeline |
| **"View source of this site" link to the portfolio's own repo** | Engineer audience appreciates meta-signal; lets them verify the claim of "I build clean things." | LOW | Small footer link; only add if the repo will actually stay clean |
| **Smooth, no-flash dark-mode toggle (with system-preference default)** | Most portfolios flicker on first paint. Doing this correctly signals attention to detail. | MEDIUM | Inline script before hydration, `color-scheme` CSS, smooth transitions |
| **Structured data (JSON-LD `Person` schema)** | Improves Google knowledge-panel behavior when someone searches the engineer's name. | LOW | Small `<script type="application/ld+json">` in root layout |
| **Reading-friendly case study typography (measure, line-height, hierarchy)** | Case studies are the thing that converts "scan" → "interested." If they're unreadable, nothing else matters. | LOW | Max measure ~65ch, body ~16–18px, clear h2/h3 hierarchy |
| **Content lives in typed data files / MDX** | Not user-visible, but enables fast content iteration later (PROJECT.md constraint). | MEDIUM | `/data/projects.ts` with typed schema; MDX for long-form case study bodies |
| **Keyboard-accessible command-palette-style nav (cmd-k)** | Signals engineer-aesthetic without going full terminal. Optional, but memorable. | HIGH | Only if it adds value; easy to skip in v1 |

### Anti-Features (Deliberately NOT Built — Hurts Credibility)

These either look dated, signal poor judgment, or actively conflict with the mixed audience. Calling them out so nobody adds them "for fun."

| Anti-Feature | Why Requested | Why Problematic | Alternative |
|--------------|---------------|-----------------|-------------|
| **Skill proficiency bars ("CSS 80%", "React 95%")** | Feels quantifiable; easy to add. | Meaningless scale, Dunning-Kruger bait, engineers actively dislike them, points out weaknesses not strengths. Universally flagged as dated in 2025/2026 writeups. | Categorized plain-text skill list with honest groupings ("Daily", "Comfortable", "Familiar") — or just a flat list with no rating. |
| **"Hello World!" typewriter intro / terminal cosplay hero** | Feels on-brand for developers. | Adds load delay before identity is visible (fails the 30s recruiter test), reads as "bootcamp graduate aesthetic," alienates non-technical clients. | Static hero with name + role + one-line value prop, no animation gate. |
| **Autoplay tech-stack logo marquee / infinite scroll of logos** | Visually busy, "shows lots of stuff." | Animated, low-information, visually noisy. Contradicts minimal brand. Accessibility issue (motion). | Static categorized list in monospace type. |
| **Heavy hero animations (3D scenes, particle backgrounds, WebGL shaders)** | Impressive in isolation. | Slow LCP, drains battery, reads as "look at me" to clients, conflicts with "visual restraint is the brand" constraint. | Subtle static geometry or nothing. |
| **Scroll-jacking / parallax scroll hijack on homepage** | Feels premium in some design portfolios. | Breaks keyboard nav, hurts a11y, confuses mobile, kills skimmability. | Standard scroll; light parallax on images at most. |
| **Auto-playing background music / video with sound** | N/A — no defensible reason. | Universally hated; instant close-tab. | Silent autoplay for muted ambient video only if it earns its weight — default is no video. |
| **"Download my CV" button that opens a modal asking for email** | Lead-capture instinct. | Actively hostile UX for a personal site; recruiters want the PDF, not a sales funnel. | Direct PDF link; open in new tab. |
| **Contact form with captcha + honeypot + backend** | "Portfolios need contact forms." | Spam magnet, requires a backend, fails silently, PROJECT.md already scopes out form backends. | `mailto:` link + explicit email shown; socials for alternative contact. |
| **Blog section with two posts from 2022** | Feels authoritative to have writing. | Stale blog ("empty-blog syndrome") signals abandoned site. PROJECT.md explicitly scopes this out for v1. | No blog until the engineer commits to writing; add later if/when real cadence exists. |
| **Testimonial section with generic "great to work with" quotes** | Social proof. | Without named sources + photos, reads as fabricated. Named testimonials require real relationships and permissions. | Omit entirely in v1, or link LinkedIn recommendations externally. |
| **Countdown timers ("available for hire in 3 days!")** | Urgency tactic. | Marketing-sleazy; wrong register for engineering portfolio. | Static "available for new roles" / "not looking right now" badge in About if desired. |
| **Flashy loading screens / preloaders** | Hides slow load behind "loading…" | Adds perceived load time rather than fixing real load time. | Fix the actual performance; let the page render progressively. |
| **GitHub contribution graph embed as a feature** | "Shows I code a lot." | Noisy widget, often misleading (doesn't reflect private/paid work), ages poorly if momentum drops. | Link to GitHub profile; let the visitor go there. |
| **"Years of experience" counter that auto-increments** | Clever-feeling. | Stops being clever after year one. Reads as novelty. | Static "since YYYY" string in bio. |
| **Full-page custom cursor** | "Designer portfolio" flex. | Breaks native affordances, annoying on click-heavy sites, poor on trackpads, accessibility regression. | Default cursor. |
| **Every section with a distinct animation-on-scroll entrance** | Makes page feel "alive." | Cumulative motion fatigue, LCP/INP impact, reads as over-designed. Motion-sensitivity a11y issue. | At most one subtle fade-in; respect `prefers-reduced-motion`. |
| **"Tech stack" sub-logo list using official brand SVGs with rainbow colors** | Visually scannable. | Color chaos contradicts minimal palette; legal-gray-area trademarks; looks like a sticker-covered laptop. | Monospace text tags in single color. |
| **SPA with no per-page URLs (hash-only navigation)** | Easy to build. | Breaks deep-linking to case studies, hurts SEO for per-project pages, breaks OG cards for sharing a specific project. | Multi-page (Next.js routes) with real URLs per project. |
| **Multiple social icons including Facebook, Instagram, TikTok** | "Be everywhere." | Dilutes focus; recruiters want GitHub + LinkedIn + email. Irrelevant socials signal attention splitting. | GitHub, LinkedIn, email, personal X/Bluesky if actively used. Omit anything stale. |
| **Splash "Enter site" gate before content** | Designer-portfolio convention. | Adds a click before any information. Fails 30s test. | Land directly on content. |

## Feature Dependencies

```
Hero (name + role + CTA)
    └──requires──> placeholder content schema (data files)

Project detail pages
    └──requires──> project data schema
                       └──requires──> MDX or structured content pipeline
    └──requires──> per-project OG image pipeline (enhances shareability)

Dark-mode toggle
    └──requires──> CSS custom properties architecture
    └──requires──> no-flash hydration strategy
    └──enhances──> entire visual system (every color decision must work in both themes)

Open Graph / Twitter cards
    └──requires──> per-page metadata API usage
    └──requires──> static OG image per page OR @vercel/og dynamic generation

Sitemap
    └──requires──> known set of routes (trivial for static site)

Resume PDF
    └──requires──> a resume exists (content dependency, not code)

Contact section
    └──enhances──> About section (often visually adjacent or co-located)

Skills section
    └──conflicts──> proficiency bars (skills list loses credibility if bars are added)

Case study narrative
    └──conflicts──> empty "Coming Soon" project cards (better to show 3 real than 5 with gaps)

Subtle micro-interactions
    └──conflicts──> heavy scroll animations (additive motion budget — pick one register)
```

### Dependency Notes

- **Content schema is upstream of everything user-visible:** Because PROJECT.md explicitly requires real content to swap in later via a single data source, the shape of `projects.ts` / MDX files should be designed before project detail pages are built. Otherwise the "easy swap later" promise breaks.
- **Dark-mode touches every styling decision:** It can't be retrofitted cleanly; it has to be the foundation of the CSS token system. Picking CSS custom properties + a `[data-theme]` attribute on `<html>` is the standard 2026 approach.
- **OG images depend on per-page metadata:** Next.js App Router makes this trivial with the `generateMetadata` function per route, but each project page needs its own metadata export, which means the project data schema must include OG-image-relevant fields.
- **Skills list and proficiency bars are mutually exclusive:** Adding bars undermines the list's credibility. Pick one approach — list wins.
- **Case study depth and project count trade off:** Four well-written case studies beat eight shallow ones. The dependency is on content quality, not code.

## MVP Definition

### Launch With (v1)

Everything in Table Stakes, plus the Differentiators that flow naturally from the aesthetic constraint and don't balloon scope.

- [ ] **Hero** — name + role + one-line value prop + primary CTA (essential for 30s recruiter test)
- [ ] **Projects index** — 3–4 cards linking to detail pages (depth-over-breadth MVP)
- [ ] **Project detail pages** — per-project case study with problem/approach/stack/outcome narrative (what converts engineer audience)
- [ ] **About** — short bio, friendly tone, placeholder-structured (serves all three audiences)
- [ ] **Skills** — categorized static list, monospace tags, no bars (table stakes; bars would be a self-inflicted wound)
- [ ] **Contact** — email + GitHub + LinkedIn, `mailto:` link, visible email address (the reach-out path)
- [ ] **Resume PDF** — static file, linked in nav AND About/Contact (recruiter-essential)
- [ ] **Dark-mode toggle** — system default, persisted override, no FOUC (expected by engineer audience; brand alignment)
- [ ] **Responsive layout** — mobile-first, tested on real devices (60% of recruiters on mobile)
- [ ] **Per-page metadata + OG/Twitter cards** — static OG image v1 (shareability baseline)
- [ ] **Sitemap + robots.txt** — Next.js conventions (SEO baseline for name searches)
- [ ] **Typed project data schema in `/data`** — single source of truth (PROJECT.md requirement)
- [ ] **Minimal typography-forward styling with monospace accents** — brand direction from PROJECT.md
- [ ] **Accessibility baseline** — semantic HTML, focus states, alt text, color contrast in both themes
- [ ] **Lighthouse ≥90 on mobile** — portfolio as work sample
- [ ] **404 page + favicon** — polish baseline

### Add After Validation (v1.x)

Features to consider once the core site is live and the real engineer name/content has been swapped in.

- [ ] **Dynamic OG image generation per project (`@vercel/og`)** — trigger: adding a 5th project or if static OG becomes tedious to maintain
- [ ] **JSON-LD `Person` schema** — trigger: confirming name-Googling is the primary traffic source
- [ ] **"Source of this site" footer link** — trigger: portfolio repo has been cleaned up and is link-worthy
- [ ] **Dynamic "last updated" timestamp per project** — trigger: engineer is iterating on case studies
- [ ] **Prefers-reduced-motion variants for any micro-interactions** — should honestly be v1, but flagged here as a polish pass
- [ ] **RSS/Atom feed** — trigger: a blog actually gets added (not v1)

### Future Consideration (v2+)

Deferred until validated demand or explicit user ask.

- [ ] **Blog / writing section** — defer until engineer commits to a writing cadence; avoids empty-blog syndrome per PROJECT.md
- [ ] **Command palette (cmd-k navigation)** — defer; cute but not load-bearing
- [ ] **Analytics / event tracking** — PROJECT.md scopes out; add only when there's a specific question to answer (e.g., "which project gets clicked most?")
- [ ] **Contact form with backend** — PROJECT.md scopes out form backends; `mailto:` is sufficient until proven otherwise
- [ ] **CMS (Sanity, Contentful, etc.)** — PROJECT.md scopes out; revisit only if project count exceeds ~8 or non-engineer editor needed
- [ ] **Internationalization** — PROJECT.md scopes out for v1
- [ ] **Testimonials / recommendations** — only with real named sources + permission
- [ ] **"Now" page (what I'm working on)** — nice personal touch; defer until there's actually something to say

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero with name + role + CTA | HIGH | LOW | P1 |
| Projects index (3–4 cards) | HIGH | LOW | P1 |
| Project detail pages with case study narrative | HIGH | MEDIUM | P1 |
| About section | HIGH | LOW | P1 |
| Skills (static, categorized, no bars) | HIGH | LOW | P1 |
| Contact + socials | HIGH | LOW | P1 |
| Resume PDF (nav + About) | HIGH | LOW | P1 |
| Dark-mode toggle (no-flash) | HIGH | MEDIUM | P1 |
| Responsive layout | HIGH | MEDIUM | P1 |
| Per-page metadata | HIGH | LOW | P1 |
| OG/Twitter cards (static image) | MEDIUM | MEDIUM | P1 |
| Sitemap + robots.txt | MEDIUM | LOW | P1 |
| Typed data schema / MDX | MEDIUM | MEDIUM | P1 |
| Accessibility baseline | HIGH | MEDIUM | P1 |
| Lighthouse ≥90 | HIGH | MEDIUM | P1 |
| 404 page + favicon | MEDIUM | LOW | P1 |
| Monospace accents + typography | MEDIUM | LOW | P1 |
| Subtle micro-interactions | LOW | LOW | P2 |
| Dynamic OG generation per project | MEDIUM | MEDIUM | P2 |
| JSON-LD Person schema | LOW | LOW | P2 |
| "View source" footer link | LOW | LOW | P2 |
| Command palette (cmd-k) | LOW | HIGH | P3 |
| Blog | — | HIGH | P3 (out of scope v1) |
| Analytics | LOW | MEDIUM | P3 (out of scope v1) |
| Contact form backend | LOW | MEDIUM | P3 (out of scope v1) |

**Priority key:**
- **P1:** Must have for launch — site is not credible without this
- **P2:** Should have, add when core is stable
- **P3:** Nice to have, future consideration or scoped out of v1

## Competitor Feature Analysis

Representative portfolio archetypes. "Competitor" is loose — these are reference points, not literal competitors.

| Feature | Brittany Chiang (v4/current) | Lee Robinson (leerob.io) | Josh W. Comeau (joshwcomeau.com) | Our Approach |
|---------|------------------------------|--------------------------|----------------------------------|--------------|
| Hero | Text-forward, name + multi-line pitch, subtle motion | Minimal text + photo, immediate value prop | Playful illustration + warm voice | Static name + role + one-line value prop + CTA. No motion gate. |
| Navigation | Side/top nav with smooth-scroll anchors | Multi-page with clean top nav | Multi-page, with blog as primary | Top nav; multi-page with per-project URLs (SEO + shareability) |
| Project presentation | Structured case studies with stack tags + links | Project index with short summaries | Projects embedded alongside writing | Card grid → dedicated detail pages with full case study |
| Skills | Grouped tech list, monospace | Inline mentions, no explicit section | No explicit skills section | Categorized static list with monospace tags |
| Resume | Linked as "Resume" in nav | Present, understated | Not featured | Linked in nav AND About/Contact (downloadable PDF) |
| Dark mode | Dark-by-default | System-aware toggle | Warm palette both modes, toggle | System default, manual override, persisted, no FOUC |
| Animations | Subtle hover + reveal on scroll | Restrained, mostly static | Generous but purposeful (Framer Motion) | Subtle only; respect `prefers-reduced-motion` |
| Blog | None prominent | Primary feature | Primary feature | Out of scope for v1 |
| Contact | Section with email link + socials | Footer links | Scattered throughout | Dedicated Contact section + socials + email |
| OG cards | Per-page static | Per-page dynamic (Satori) | Per-page dynamic | Static per page in v1; dynamic as v1.x upgrade |

**Takeaway:** The Brittany Chiang archetype is the closest reference for this project — typography-forward, restrained palette, structured case studies, dark-mode-first aesthetic, engineer-audience-optimized. It explicitly avoids the anti-features above and earned its reputation partly by doing so.

## Confidence Notes

- **HIGH confidence** on table-stakes list and anti-feature list — these are consistently flagged across 2025/2026 sources, and the anti-features specifically (proficiency bars, typewriter heros, stale blogs, contact-form funnels) appear repeatedly as "what makes a developer portfolio look dated."
- **HIGH confidence** on hero / case study / skills patterns — multiple sources agree, and the Brittany Chiang reference validates the pattern in practice.
- **MEDIUM confidence** on micro-interaction recommendations — these are taste calls; the "subtle only, respect reduced-motion" rule is defensible but not hard consensus.
- **MEDIUM confidence** on command-palette and dynamic OG generation being differentiators — they're genuinely cool but not clearly load-bearing; scoped as P2/v1.x.

## Sources

**Portfolio archetypes (reference examples):**
- [Brittany Chiang](https://brittanychiang.com/)
- [Brittany Chiang v4](https://v4.brittanychiang.com/)
- [GitHub - bchiang7/v4 (source)](https://github.com/bchiang7/v4)
- [emmabostian/developer-portfolios (curated list)](https://github.com/emmabostian/developer-portfolios)

**Best-practices / ecosystem:**
- [Software Engineer Portfolios: 15+ Well-Designed Examples (2026) - SiteBuilderReport](https://www.sitebuilderreport.com/inspiration/software-engineer-portfolios)
- [21 Best Developer Portfolio Websites — Real Examples (2026) - Colorlib](https://colorlib.com/wp/developer-portfolios/)
- [17 Inspiring Web Developer Portfolio Examples for 2026 - Templyo](https://templyo.io/blog/17-best-web-developer-portfolio-examples-for-2024)
- [How to Build a Frontend Developer Portfolio in 2025 - DEV Community](https://dev.to/siddheshcodes/frontend-developer-portfolio-tips-for-2025-build-a-stunning-site-that-gets-you-hired-3hga)
- [A Software Engineer's One-Page Portfolio - Chuck Groom (Medium)](https://cgroom.medium.com/a-software-engineers-one-page-portfolio-4f85ab8a20d1)
- [How to Level Up Your Developer Portfolio - freeCodeCamp](https://www.freecodecamp.org/news/level-up-developer-portfolio/)

**Skills section / proficiency bars:**
- [Do not put skill bars on your resume! - DEV Community](https://dev.to/tim012432/do-not-put-skill-bars-on-your-resume-lh6)
- [Skill section or not? - DEV Community](https://dev.to/vulcanwm/skill-section-or-not-1gj)
- [Webflow Developer Portfolio Review: 7 Key Things to Look For - Contra](https://contra.com/p/U7UEbM66-webflow-developer-portfolio-review-7-key-things-to-look-for-and-red-flags)

**Hero / 30-second recruiter test:**
- [Hero Section Design: Best Practices & Examples for 2026 - Perfect Afternoon](https://www.perfectafternoon.com/2025/hero-section-design/)
- [Portfolio Link Section That Impresses Recruiters in Seconds - Resumly](https://www.resumly.ai/blog/portfolio-link-section-that-impresses-recruiters-in-seconds)

**Dark mode UX:**
- [Best Practices for Dark Mode in Web Design 2026 - NateBal](https://natebal.com/best-practices-for-dark-mode/)
- [Dark Mode Done Right: Best Practices for 2026 - Medium](https://medium.com/@social_7132/dark-mode-done-right-best-practices-for-2026-c223a4b92417)
- [The Complete Guide to the Dark Mode Toggle - Ryan Feigenbaum](https://ryanfeigenbaum.com/dark-mode/)

**Open Graph / metadata:**
- [Metadata Files: opengraph-image and twitter-image - Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Getting Started: Metadata and OG images - Next.js](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Generate Dynamic Open Graph and Twitter Images in Next.js - Cruip](https://cruip.com/generate-dynamic-open-graph-and-twitter-images-in-next-js/)

**Case study format / hiring engineer perspective:**
- [The Complete Software Engineer Portfolio Guide + 24 Examples - CareerFoundry](https://careerfoundry.com/en/blog/web-development/software-engineer-portfolio/)
- [How to Build a Software Engineer Portfolio That'll Land Interviews - Arc.dev](https://arc.dev/developer-blog/software-engineer-portfolio/)
- [How To Build a Software Developer Portfolio - Codecademy](https://www.codecademy.com/resources/blog/software-developer-portfolio-tips)

**Single vs multi-page / SEO:**
- [Single Page vs. Multi-Page Web Design - UXPin](https://www.uxpin.com/studio/blog/single-page-vs-multi-page-ui-design-pros-cons/)
- [SEO Benefits of Multi-Page Websites vs Single-Page Sites - Me-Page](https://me-page.com/blog/seo-and-promotion/seo-benefits-of-multi-page-websites-vs-single-page-sites)

---
*Feature research for: software engineer personal portfolio website*
*Researched: 2026-04-21*
