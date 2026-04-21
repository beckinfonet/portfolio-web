# Pitfalls Research

**Domain:** Software engineer personal portfolio website (Next.js, minimal/typography-forward, mixed audience — recruiters, hiring engineers, potential clients)
**Researched:** 2026-04-21
**Confidence:** HIGH — pitfalls are well-documented across the ecosystem (Next.js docs, WCAG, WebAIM, established portfolio-review literature); prevention patterns are standardized.

---

## Critical Pitfalls

These are the mistakes that most visibly tank a portfolio's credibility or cause rewrites. Each has a clear prevention path.

### Pitfall 1: Aesthetic clichés that signal "I copied a template"

**What goes wrong:**
The portfolio leans on tired tropes that immediately mark it as derivative: proficiency/skill bars (e.g. "JavaScript: 90%, CSS: 75%"), a wall of technology logos with no context, marquee-scrolling lists of frameworks, "Hello, I'm a full-stack ninja / rockstar / guru" hero copy, endless auto-playing parallax animations, a typewriter effect on the hero that delays content, and a "download my CV" button that scrolls somewhere other than delivering a PDF.

**Why it happens:**
These patterns are over-represented in tutorials, free templates, and inspiration galleries, so engineers copy them without questioning whether they communicate anything. Skill bars in particular feel "designerly" but are subjective, unreadable by ATS systems, and universally mocked by hiring engineers — they're susceptible to Dunning-Kruger and convey nothing a reader can act on.

**How to avoid:**
Write an anti-feature list before any design work begins and treat it as binding. Specifically ban: skill percentage bars, gradient-hover cards that look like every bootcamp portfolio, "ninja/rockstar/guru/wizard" copy, hero typewriter effects that block content, auto-playing carousels, and logo walls without captions. Replace skill bars with grouped plain-text lists (e.g. "TypeScript, Go, Rust — daily") or with "years of use + representative projects" framing. The hero should state a plain identity: name, one-line role, and what the visitor should do next.

**Warning signs:**
- A reviewer looks at the site and describes it as "fine" or "clean" instead of remembering anything specific.
- The About copy is interchangeable with 100 other portfolios if you swap the name.
- Self-description leans on adjectives ("passionate", "creative", "driven") instead of artifacts.

**Phase to address:**
Design system / landing-page phase — the anti-feature list must exist before the hero is built. Reinforce in About/Skills phase (replaces proficiency bars with prose grouping).

---

### Pitfall 2: Thin case studies that just link to a repo

**What goes wrong:**
The "project detail page" is a card with a screenshot, a paragraph of marketing copy, a tech-stack list, and a link to the GitHub repo — no explanation of the problem, the decisions made, the engineer's specific role, or the outcome. Hiring engineers skim it in 10 seconds, learn nothing, and leave. For team projects it's worse: there's no indication whether the engineer built the whole thing solo or contributed a single feature.

**Why it happens:**
Writing case studies is hard and time-consuming. Developers default to what feels like evidence (a repo link, a tech list) because they assume the reader will dig in. Readers don't dig in — they skim. Team-project authorship is often left ambiguous because being specific ("I owned the auth module; a teammate built the dashboard") feels modest, but vagueness reads as dishonest.

**How to avoid:**
Every project detail page follows a fixed template with required fields:
1. **Problem / context** — one paragraph of what and why.
2. **Role** — explicit: "Solo", or "Team of N — I owned X, Y" with a named scope.
3. **Key decisions** — 2–4 bullets with rationale (e.g. "Chose SQLite over Postgres because...").
4. **What I'd do differently** — shows reflection; recruiters love this, engineers trust it.
5. **Outcome** — shipped? users? learnings? (Acceptable to say "learning project, not deployed" — honesty beats puffery.)
6. **Links** — live demo (if any), repo, screenshots/video.

Enforce the schema in TypeScript so a missing `role` field is a build error, not a silent omission.

**Warning signs:**
- A project page reads like a README.
- No paragraph in the case study contains the word "I" or "we" making a decision.
- You can't tell from the page whether the engineer built 10% or 100% of the project.
- Outcome section is empty or replaced with "Currently working on it!"

**Phase to address:**
Content schema phase (define required fields and enforce via TypeScript) and project case-study phase (fill the template for 3–4 projects). Must not be deferred to "post-launch polish" — thin case studies are the single most common reason engineer portfolios fail to convert.

---

### Pitfall 3: Dark-mode flash (FOUC) on initial load

**What goes wrong:**
Visitor with dark-mode preference lands on the site, sees a flash of white, then the page re-paints to dark. Reads as amateur craft on a site whose audience is judging craft. In the worst case, the flash is long enough (>300ms) that the visitor's eyes hurt on the bright frame.

**Why it happens:**
With Next.js SSR/SSG, the server doesn't know the client's theme preference (localStorage and `prefers-color-scheme` are client-only). The initial HTML ships with default (usually light) styles; the theme toggle only applies after React hydrates. Standard `useState`-based theme implementations will always flash because they can't run before paint.

**How to avoid:**
Use `next-themes` (specifically designed for this problem — injects a blocking `<script>` in `<head>` that reads localStorage and sets a class on `<html>` before paint) OR hand-roll the equivalent: an inline `<script>` in the root layout that runs synchronously in `<head>` before any content renders, reads the theme, and sets `document.documentElement.classList`. Theme styling must use CSS variables keyed off the root class, not styled-components theme props (those only resolve after render).

Set `suppressHydrationWarning` on the `<html>` element to silence the expected mismatch on the class attribute. Test in both Chrome and Safari (Safari's caching differs) and with network throttling — the flash only appears on slow connections in some setups.

**Warning signs:**
- Hard-refresh in dark mode shows any white frame, even for 50ms.
- Theme flickers when navigating between pages.
- Lighthouse reports hydration warnings.

**Phase to address:**
Dark-mode / theming phase — build it correctly the first time. Retrofitting is painful because it touches the root layout, CSS variable architecture, and every component.

---

### Pitfall 4: Low-contrast "looks cool" design that fails WCAG

**What goes wrong:**
The minimal aesthetic gets pushed too far: light gray text on white, dark gray text on black, or a trendy "muted" palette where body text hits 3:1 contrast instead of the 4.5:1 WCAG minimum. The site looks refined in screenshots but is unreadable for visitors with any visual impairment — and WebAIM's 2024 Million analysis showed contrast is the #1 accessibility failure on the web, present on 83.6% of sites. For a portfolio signaling craft, this is self-inflicted.

**Why it happens:**
"Low contrast = elegant" is a dominant aesthetic meme in 2024–2026 design culture. Designers eyeball contrast on a high-end display in a dim room — which is exactly the conditions where low contrast is least visible as a problem. Dark-mode "just invert the colors" naively fails because saturated colors vibrate on dark backgrounds and light-mode grays become unreadable when inverted.

**How to avoid:**
Define the palette with contrast ratios encoded as design tokens — e.g. `--text-primary` must be ≥ 7:1 against `--bg` (AAA), `--text-secondary` ≥ 4.5:1 (AA). Run an automated check (e.g. `axe`, Pa11y, or Lighthouse accessibility audit) in CI so contrast regressions fail the build. Use dark-mode-specific grays (e.g. `#121212` base, not `#000`) and desaturate accent colors for dark mode. Never rely on color alone for state — underline links, outline focus rings visibly.

**Warning signs:**
- Designer says "it looks more elegant with lighter text" — push back.
- Lighthouse accessibility score < 100.
- Any axe or Pa11y violation on contrast.
- Body copy becomes hard to read when you squint or step back from the monitor.

**Phase to address:**
Design system / tokens phase — bake contrast thresholds into the token layer. Accessibility audit gate before launch.

---

### Pitfall 5: Hero video or unoptimized images that tank LCP

**What goes wrong:**
The landing page has a 4MB autoplay hero video, a 3MB unoptimized PNG of a laptop mockup, or a high-res photo served at full resolution on mobile. Lighthouse LCP scores drop to 4–8 seconds; Core Web Vitals fail; the site feels slow on the exact mobile networks where recruiters are most likely to skim it. Ironic for a site that's supposed to signal technical craft.

**Why it happens:**
Next.js ships with `next/image`, but developers use raw `<img>` tags during early prototyping and forget to migrate. Image sources are exported at design resolution (2400px-wide PNG for a 400px slot). Hero videos are added for "visual interest" without measuring their weight. Lazy-loading gets applied to the LCP image, which paradoxically delays it.

**How to avoid:**
- Use `next/image` for every raster image — non-negotiable. Always provide `width` and `height` (prevents CLS) and appropriate `sizes`.
- Mark the LCP image with `priority` (preloads it, skips lazy-loading).
- Use AVIF/WebP formats (Next.js Image does this automatically).
- No hero videos unless the video *is* the content. If you need motion, use CSS transitions or a small SVG animation — not video.
- Run Lighthouse in CI (or at least as a pre-launch gate) with a minimum score threshold (e.g. 95 for performance on a portfolio site — anything less is embarrassing for this domain).

**Warning signs:**
- Any image in the repo > 500KB.
- Lighthouse LCP > 2.5s on simulated mobile.
- Hero section uses `<video autoplay>`.
- `<img>` tags in source (should be `<Image>` from `next/image`).

**Phase to address:**
Landing / hero phase sets the performance budget. Media pipeline phase (handling project screenshots) enforces it. Pre-launch Lighthouse audit verifies.

---

### Pitfall 6: Missing Open Graph / Twitter cards (blank link previews)

**What goes wrong:**
Someone shares the portfolio URL in Slack, LinkedIn, Twitter, or in an email — the preview is a blank tile with just the URL and no image, or pulls the Next.js default favicon and the first paragraph of text. For a site whose entire job is public presence, this is a wasted first impression at the exact moment the engineer most needs to make one (a recruiter sharing the link with a hiring manager).

**Why it happens:**
`generateMetadata` / `metadata` exports are easy to overlook during scaffolding; `opengraph-image.tsx` and `twitter-image.tsx` conventions are newer App Router features that many tutorials don't cover; developers assume "it'll work" without testing with a real OG validator.

**How to avoid:**
- Set root-level `metadata` in `app/layout.tsx` with `openGraph` and `twitter` blocks, including a default OG image.
- Use Next.js's `opengraph-image.tsx` / `twitter-image.tsx` file conventions (or the `ImageResponse` helper) to generate per-page OG images dynamically — especially for project detail pages where each should have its own preview.
- Test before launch using the LinkedIn Post Inspector, Twitter Card Validator, and Facebook Sharing Debugger (LinkedIn's in particular caches aggressively — test early).
- Every project detail page overrides metadata with its own title, description, and OG image. A dynamic `generateMetadata` function enforces this.

**Warning signs:**
- Pasting the URL into Slack/LinkedIn/iMessage shows a preview without an image.
- Project detail pages all share the same OG preview.
- `viewMetadata` / `generateMetadata` exports are missing from dynamic route files.

**Phase to address:**
SEO / metadata phase — must include OG/Twitter verification via real-world link-share test, not just "it's in the HTML."

---

### Pitfall 7: Dead live-demo links and outdated resume PDF

**What goes wrong:**
Case study says "View Live Demo" — link returns 404, redirects to a domain-squatter, or shows Heroku's "this app is sleeping" page (on a plan that's been deprecated for 2 years). Resume PDF is `/resume.pdf` but the file in public/ is from last year, or the filename was changed and the link now 404s. Studies show ~40% of users abandon sites after encountering broken links.

**Why it happens:**
Demos were deployed on free tiers (Heroku free tier, Glitch) that shut down or moved their dormancy behavior. Domain registrations lapsed. The engineer updated their resume locally but forgot to swap the PDF in the repo. Link-rot on a portfolio is invisible to the owner — they don't click their own links weekly.

**How to avoid:**
- Audit every external link before launch and at least quarterly after. Use a broken-link checker (Lychee, linkinator, or a scheduled GitHub Action) as part of CI so new broken links fail the build.
- Prefer demos on Vercel/Netlify (same platform as the portfolio — no separate free-tier to lapse) over Heroku/Glitch/custom VPS.
- If a project has no live demo, say so explicitly ("No live demo — code only, see repo") rather than omitting the field. Empty/broken is worse than honest absence.
- Resume PDF should be generated from a canonical source (e.g. a data file or Typst/LaTeX template in the same repo) and versioned. Filename stays stable (`resume.pdf`), but add a build-time check that the file exists and a "last updated" date displayed next to the download link.

**Warning signs:**
- Any link on the site that was last tested > 30 days ago.
- Resume PDF doesn't have a "last updated" date visible.
- Demo links point to `*.herokuapp.com` or other deprecated free-tier hosts.

**Phase to address:**
Pre-launch checklist phase (link audit) and post-launch maintenance phase (scheduled broken-link CI job).

---

### Pitfall 8: Content scattered across JSX — swapping a project is a scavenger hunt

**What goes wrong:**
Project titles, descriptions, tech stacks, and links are hardcoded in the JSX of `HomePage.tsx`, `ProjectsSection.tsx`, `ProjectCard.tsx`, and `ProjectDetailPage.tsx` — each with slightly different shape. When the engineer wants to swap a placeholder project for a real one, it's 4–6 file edits, and the shapes drift (one card shows tech, another doesn't, one has a "year" field that others don't). A missing field on a card silently renders as `undefined` or an empty string, breaking layout without warning.

**Why it happens:**
JSX-first instincts: developers wire content where it's rendered because it's what the current page needs. Without a content layer, there's no gravity pulling data into a central shape. The engineer's real content isn't ready yet (per PROJECT.md), so placeholder content feels disposable — but it shapes the data layer forever.

**How to avoid:**
Single source of truth under `/content` or `/data` — either typed TS/JS objects (`projects.ts`) or MDX files with frontmatter. Define a Zod schema (or strict TypeScript interface) for `Project`, `SkillGroup`, `BioSection`, etc. Parse/validate at build time so a missing field fails the build, not production rendering. All components import from the data layer — no project content in JSX files.

Prefer a minimal approach for this scale (3–4 projects): TypeScript data files + Zod validation. Avoid a CMS (per PROJECT.md out-of-scope), avoid MDX unless rich inline markup is actually needed (adds a toolchain; TS strings with markdown rendered via `react-markdown` is often sufficient).

**Warning signs:**
- Grepping for a placeholder project title returns hits in multiple component files.
- Different project cards have different visible fields because the data shape drifted.
- Runtime errors like "Cannot read property 'title' of undefined" on a route.
- "What fields does a project have?" can't be answered from a single file.

**Phase to address:**
Content schema phase — must come before any project rendering. This is the keystone for the "swap real content later" requirement in PROJECT.md.

---

### Pitfall 9: Placeholder "Lorem ipsum" surviving to production

**What goes wrong:**
The engineer launches, shares the URL, and a reviewer screenshots the About section that still says "Lorem ipsum dolor sit amet…" or a project description that's `<TODO: write this>`. Credibility evaporates instantly.

**Why it happens:**
Placeholders are meant to be swapped "later" but there's no mechanism flagging them — they blend into the finished-looking layout. The engineer stops seeing them after the 50th time they've loaded the page during development (banner blindness).

**How to avoid:**
- Placeholder content is marked with a sentinel in the data: e.g. `placeholder: true` flag on each object, or a naming convention like `__PLACEHOLDER__` prefix, or content wrapped in a recognizable token.
- A dev-only banner renders at the top of any page containing placeholder content — impossible to miss.
- CI (or a pre-commit hook, or a pre-launch check) greps for lorem-ipsum phrases, "TODO", "TBD", and the sentinel tokens — fails if any found outside explicitly allowed paths.
- Placeholder images use a distinct visual (e.g. the word "PLACEHOLDER" watermarked) instead of stock photos that look real.

**Warning signs:**
- "I'll fix the bio later" still said 2 weeks after launch.
- Reviewers don't notice placeholder text because it's grammatically plausible English.
- No grep target or lint rule exists for placeholder detection.

**Phase to address:**
Content schema phase (sentinel design) and pre-launch checklist phase (grep check). The dev banner should ship with the content layer from day one.

---

### Pitfall 10: Custom domain not wired — site lives at vercel.app

**What goes wrong:**
Engineer tells people "check out my portfolio" and hands out `my-portfolio-git-main-username.vercel.app`. Reads as unfinished. Even worse: engineer buys the domain but never configures the DNS or the Next.js site, so `yourname.dev` shows the registrar's parking page while the working site is at the Vercel URL.

**Why it happens:**
Custom domain is a "polish" task that gets deferred. DNS configuration feels fiddly. Nameserver propagation has a psychological cost (you make the change, nothing happens, you assume it didn't work). SSL cert issuance can silently fail and the engineer doesn't notice because their browser still has a cached cert from a previous host.

**How to avoid:**
- Treat custom domain as a launch-blocker, not polish. Add it to the pre-launch checklist with explicit verification steps.
- Buy the domain early (first week of project) so propagation isn't a last-minute blocker.
- Verify: typing the custom domain into an incognito window loads the site over HTTPS with a valid cert; `www` redirects to apex (or vice versa) consistently; no "this connection is not private" warnings.
- Check the OG metadata uses the custom domain, not the Vercel preview URL (common footgun with env-based URL config).

**Warning signs:**
- Shareable URL is `*.vercel.app` or `*.netlify.app`.
- `www` vs. non-www inconsistency (one redirects, the other doesn't).
- SSL warning in any browser.
- OG preview shows vercel.app as the domain.

**Phase to address:**
Pre-launch / deployment hardening phase — domain is a required check item before announcing.

---

### Pitfall 11: Contact form that throws emails into the void

**What goes wrong:**
Portfolio has a "Contact Me" form. Visitor fills it out, sees "Thanks for your message!", walks away. Their message is never delivered — no backend was ever wired, or the third-party service (Formspree free tier) silently dropped after hitting a rate limit, or SendGrid marked the outbound mail as spam. The engineer learns about it when a recruiter mentions "I sent you a message last month…" months later.

**Why it happens:**
Contact forms look simple but require a real backend or third-party service. On a static Next.js deploy (the plan here), there's no server — which means Formspree/Web3Forms/EmailJS OR a Vercel Serverless Function. Developers wire the form UI first and plug in the backend "later" — which sometimes never happens. Silent failures are particularly bad because the UI affordance ("Message sent!") can exist without any actual delivery.

**How to avoid:**
Given PROJECT.md out-of-scope ("Analytics / form backends — defer until post-launch if/when needed"), **do not ship a form in v1**. Replace with a prominent plain email link (`mailto:`) plus GitHub/LinkedIn links. This is actually *better* for the target audience (recruiters/engineers already live in email and LinkedIn; nobody uses a web form to reach out to an engineer about a job). If a form is added later:
- End-to-end test by submitting the form to production and confirming receipt in the inbox — make this a release gate.
- Show a real error state (not just success) on delivery failure.
- Use a service with a dashboard (Formspree, Resend, Plunk) so submissions are visible even if email delivery fails.
- Add a fallback `mailto:` link below the form for when the form fails.

**Warning signs:**
- Form exists but no one has sent a test message recently.
- "Success" message shows regardless of actual delivery.
- No admin UI / dashboard to view submissions.
- Email service account not monitored.

**Phase to address:**
Contact section phase — decision: mailto-only for v1 (aligns with PROJECT.md scope). If form added post-launch, dedicated phase with explicit delivery verification.

---

### Pitfall 12: Client-rendered content on a portfolio that should be static

**What goes wrong:**
Engineer adds a "featured project" component that fetches data on the client (`useEffect` + fetch) or gates content behind `useState` for no reason. Result: Googlebot gets an empty HTML shell; project pages don't show up in search for "[Engineer Name] [project name]"; OG crawlers see nothing. Next.js's SEO advantages are discarded.

**Why it happens:**
React muscle memory from SPA work. Developers reach for `useState`/`useEffect` to render dynamic-looking things that are actually static. Animation libraries are configured as client components, pulling the component tree into client-only rendering.

**How to avoid:**
- Default all components to Server Components (App Router default in Next.js). Opt into `"use client"` only for interactivity (theme toggle, form inputs, interactive motion) — never for content that could be static.
- Project content, case studies, bio, skills all render on the server at build time (SSG). Use `generateStaticParams` for dynamic project routes.
- Verify by `view-source:` on each key page — the project title, description, and tech stack should be in the initial HTML, not injected by JS. Also test with JS disabled (should still render the core content).

**Warning signs:**
- `"use client"` at the top of a page component that has no interactivity.
- `view-source` on a project page shows an empty `<body>` or a loading spinner.
- Lighthouse SEO score < 100.
- Page content doesn't appear in site: searches after a few weeks.

**Phase to address:**
Next.js scaffolding phase (establish server-component-default patterns) and SEO audit phase (verify via view-source).

---

### Pitfall 13: Mobile nav / hamburger with keyboard and focus failures

**What goes wrong:**
Recruiters skim on mobile — hamburger opens, but Escape doesn't close it; focus doesn't trap inside when it's a full-screen overlay; focus doesn't return to the hamburger button on close; Tab navigates to elements hidden behind the overlay; the hamburger button is a `<div>` instead of a `<button>` so it's unreachable by keyboard. Signals "didn't think about accessibility" — a bad look for a craft portfolio.

**Why it happens:**
Hamburger menus are often stitched together from Tailwind UI examples or CodePen snippets that handle visuals but not focus management. The happy path (mouse click) works; keyboard and screen-reader paths are never tested.

**How to avoid:**
- The hamburger is a real `<button>` with `aria-expanded`, `aria-controls`, and a stable `aria-label` (don't swap "Open menu" / "Close menu" — screen readers re-announce on change; use aria-expanded instead).
- When opened as a full-screen overlay: trap focus inside, Escape closes, return focus to the hamburger on close, set `aria-hidden` on background content, prevent body scroll.
- Use an accessible, well-tested primitive (Radix UI's NavigationMenu or Dialog, Headless UI's Dialog) rather than hand-rolling focus-trap logic. Focus bugs are subtle and easy to miss.
- Test with keyboard only (no mouse) and with VoiceOver/NVDA before launch. Run axe-core in CI.

**Warning signs:**
- Hamburger icon is a `<div>` or `<span>` with an onClick.
- Tabbing through the page with the menu open reaches elements behind the menu.
- Escape doesn't close the menu.
- No `aria-expanded` / `aria-controls` / `aria-label` on the button.

**Phase to address:**
Navigation phase — build the mobile nav with a tested primitive from the start. Accessibility audit phase verifies.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding project data in JSX instead of a data layer | Saves 30 min of schema design | Every content swap touches 4+ files; shapes drift; breaks the "placeholder now, real later" plan in PROJECT.md | Never — data layer is load-bearing for this project |
| Using `<img>` instead of `next/image` | Skip the `width`/`height` ergonomics | CLS, slow LCP, manual responsive-image work later | Only for tiny decorative SVGs that don't affect layout |
| Rolling your own theme toggle instead of `next-themes` | ~50 fewer lines of dependency | FOUC, hydration warnings, CSS var plumbing bugs | Only if you genuinely need a toggle model `next-themes` doesn't support (rare) |
| Skipping per-page metadata because "root layout has it" | Faster to ship first pages | Every project page has the same OG preview; duplicate titles hurt SEO | Never for a portfolio — per-page metadata is table stakes |
| Client-rendering project content to ship a snappy-looking card animation | Visual polish now | SEO damage, OG preview damage, defeats Next.js choice from PROJECT.md | Only for genuinely dynamic widgets (e.g. a live GitHub-stars counter), never for core content |
| Placeholder content without a sentinel / dev banner | Saves the banner work | Lorem ipsum ships to production | Never — banner is ~10 lines of code |
| Shipping without a Lighthouse / axe CI check | Faster CI runs | Regressions land silently; manual audits get skipped | Only while truly pre-alpha; add gates before sharing the URL |
| Contact form with a stub backend "to wire up later" | UI looks complete | Silent message loss; discovered months later | Never — if you can't wire delivery, use mailto instead |
| Storing project images at source resolution | Skip the export step | 3MB hero images; tanked Lighthouse | Never — Next.js Image + optimized source is trivial |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Vercel / Netlify deployment | Relying on `*.vercel.app` / `*.netlify.app` as the "real" URL | Buy and wire custom domain in first week; set `NEXT_PUBLIC_SITE_URL` to the real domain for OG URLs |
| Next.js `metadata` API | Forgetting per-route `generateMetadata` for dynamic project pages — all pages share the root OG image | Every dynamic route exports `generateMetadata` with project-specific title, description, and OG image |
| `next/image` | Using it without `sizes` for responsive layouts — browser downloads the largest variant on every screen | Always set `sizes` for images that change size across breakpoints |
| `next/font` | Mixing `next/font` with a `<link>` tag to Google Fonts in `<head>` — two font loads, CLS guaranteed | Use `next/font` exclusively; remove all direct Google Fonts links; serve locally |
| `next-themes` | Placing `<ThemeProvider>` deeper in the tree instead of root layout — flash returns | Wrap at `app/layout.tsx` root; use `suppressHydrationWarning` on `<html>` |
| Formspree / Web3Forms (if form added) | Not verifying delivery end-to-end — submissions silently dropped | Submit a test from prod before launch; monitor service dashboard |
| GitHub / LinkedIn external links | `target="_blank"` without `rel="noopener noreferrer"` — security and performance hit | Always pair `target="_blank"` with `rel="noopener noreferrer"` |
| Resume PDF in `/public` | Filename changes breaking bookmarks and link shares | Stable filename (`resume.pdf`); if you need versioning, use content hash in a query string, not the filename |
| OG image generation (`opengraph-image.tsx`) | Using custom fonts that fail to load in Edge runtime — falls back to system font | Embed font files in `fetch` + `ArrayBuffer` pattern; test generated images in Edge runtime |
| Vercel Analytics / Plausible | Wiring analytics before launch and tracking localhost traffic | Add analytics post-launch if/when useful (per PROJECT.md out-of-scope); otherwise skip entirely |

---

## Performance Traps

Portfolios don't scale to millions, but Lighthouse scores are part of the signal. Thresholds here are "when does the score drop visibly."

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Hero video or large hero image without `priority` | LCP > 2.5s on mobile; Lighthouse < 90 | `next/image` with `priority` on the LCP element; no hero videos | Breaks immediately on first deploy; always visible on mobile networks |
| Font loading without `next/font` | FOUT flash on every navigation; CLS > 0.1 | Use `next/font` with `display: "swap"` and preconnect | Breaks on every cold load, worst on slow networks |
| Third-party scripts loaded eagerly (analytics, chat widgets) | TBT > 300ms; low interactivity score | Defer all third-party scripts with `next/script` `strategy="afterInteractive"` or `"lazyOnload"`; skip analytics entirely in v1 | Breaks as soon as any third-party script is added |
| Unoptimized project screenshots at full resolution | LCP spikes on project pages; huge bundle download | Run screenshots through `next/image` pipeline or pre-compress (ImageOptim, squoosh); target < 200KB per image at display size | Breaks on any deploy with raw PNG/JPG in `/public` |
| Client-rendered lists / cards with framer-motion everywhere | TTI increases with each project added; bundle bloats | Prefer CSS animations and server-rendered content; confine Framer Motion to specific interactive elements (if used at all) | Breaks around 4–6 animated cards; worse on low-end mobile |
| Missing `width`/`height` on images | CLS > 0.1, especially on slow connections | Always specify explicit dimensions; `next/image` requires them | Breaks on every image without dimensions, even one |
| Inline base64 images in CSS or JSX | Large HTML/CSS bundle; blocks initial render | Serve images as files referenced by URL; `next/image` handles optimization | Breaks whenever any image is inlined |

**Expected scale:** A presence portfolio sees tens to low-hundreds of daily visits at peak (e.g., after a LinkedIn post, a conference talk, or during an active job search). Performance budget should target mobile 4G as the worst case. Over-engineering for scale is itself a pitfall — don't add caching layers or CDN configuration that isn't already free via Vercel/Netlify.

---

## Security Mistakes

For a static portfolio, security surface is small — but non-zero.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposed email address harvested by scraper spam bots | Inbox flooded with spam | Use `mailto:` but also consider ROT13 encoding via JS hydration, or a contact via LinkedIn-only link; or obfuscate with a custom address like `hello+portfolio@` that can be rotated |
| Hardcoded API keys (e.g., analytics token with write scope, form-backend secret) in client bundle | Key abuse, quota theft | All secrets in `.env.local` / Vercel env vars; never in `NEXT_PUBLIC_*` unless safe to expose; check `git grep` for common secret patterns before first push |
| `target="_blank"` without `rel="noopener noreferrer"` | Tab-nabbing from malicious external sites | Lint rule: `react/jsx-no-target-blank` enforces this; enable in ESLint config |
| Contact form without rate limiting / spam protection | Inbox flooded; service quota exceeded | If a form ships later: use Formspree's built-in hCaptcha or Turnstile; rate-limit server-side |
| No CSP / security headers | XSS amplification if a vulnerability is found | Set `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy` via Next.js `headers()` config; Vercel has a template |
| Uploading `.env` or credentials files to the repo | Credential leak (esp. if repo ever made public) | `.gitignore` from scaffolding; pre-commit hook (e.g. `gitleaks`) to block; audit before first push |
| Resume PDF metadata containing revision history / author comments | Leaks personal info or draft comments | Export to PDF fresh before upload; strip metadata with `exiftool -all= resume.pdf` |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Over-designed landing page that buries the name, role, and projects below fancy hero animations | 30-second recruiter skim doesn't reach projects — wasted visit | Name + role + 1-line positioning + "Projects" link visible in the first viewport without scroll on a laptop |
| Dark-mode-only site (no light toggle) | Daytime visitors on bright displays get blinded; accessibility concern for users with astigmatism (light text on dark is harder to read) | Light mode is the default; dark toggle respects `prefers-color-scheme` then user override; persist preference |
| Vague bio full of buzzwords ("passionate", "problem-solver", "innovative") with no artifacts | Reader learns nothing specific; indistinguishable from 10,000 other portfolios | Concrete: "Backend engineer, 5 years. Mostly Go and Postgres. Currently at [Company] on [system type]. Earlier at [Company]." |
| No indication of availability or location ("Are they available? Where are they? Remote-OK?") | Recruiter skips because they can't tell if it's worth contacting | One-line status in hero or About: "Based in Berlin, open to remote EU/US roles." Update or remove when stale. |
| Hiding contact behind a long scroll or a modal | Recruiter bails before finding it | Contact links in header/footer on every page; email as plain text (copyable) |
| Project cards that don't indicate scale or recency | Reader assumes all projects are equal weight; old projects dilute impression | Year / timeframe visible on each card; sort by recency or by "flagship" marker |
| Dense walls of text in case studies with no visual hierarchy | Skimmers (most readers) bounce | Headings every 2–3 paragraphs; pull quotes for key decisions; images to break text |
| Clickable project cards but cards don't look clickable | Users don't discover the detail pages | Visible hover affordance (cursor, underline, subtle shadow); entire card is the link; Enter/Space triggers navigation |
| Monospace everywhere (entire body in JetBrains Mono) | Reads as affected; hard on long-form reading | Monospace for code, tags, technical accents only (per PROJECT.md aesthetic); proportional sans for body/prose |
| Auto-playing sound or video | Instant close in a shared/work environment | Never auto-play audio; if video is essential, require click-to-play |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces. Run through before announcing the site.

- [ ] **Custom domain:** URL in the browser is `yourname.tld`, not `*.vercel.app`. Works with and without `www`. HTTPS cert valid. No mixed-content warnings.
- [ ] **OG / Twitter cards:** Paste URL into LinkedIn Post Inspector, Twitter Card Validator, and a Slack DM — preview shows the right image, title, description. Check both the home page and one project page (they should differ).
- [ ] **Resume PDF:** Link in nav resolves (no 404). File is current version. Filename is stable. "Last updated: [date]" shown somewhere near the link. Metadata stripped.
- [ ] **Live demos:** Every "View Demo" link loads successfully on mobile and desktop. No sleeping dynos. HTTPS everywhere.
- [ ] **GitHub / LinkedIn / social links:** Every linked account is real, current, and has at least some content (no abandoned profiles with 0 contributions).
- [ ] **Contact email:** Send a test email to the published address. Verify it doesn't bounce and lands in the inbox (not spam).
- [ ] **Placeholder sweep:** `grep -ri "lorem\|ipsum\|TODO\|TBD\|PLACEHOLDER\|__PLACEHOLDER__"` over the `/content` and `/data` directories returns zero hits outside explicitly allowed files.
- [ ] **Per-page metadata:** View-source on home, about, each project — every page has unique `<title>`, `<meta description>`, and OG tags.
- [ ] **Dark mode flash:** Hard-refresh in dark mode on a throttled 3G simulation — no white flash.
- [ ] **Mobile:** Real device test (not just Chrome devtools) on both iOS and Android. Hamburger opens and closes. Scroll works. Tap targets ≥ 44px.
- [ ] **Keyboard:** Tab through entire site using only keyboard. Focus rings visible on every interactive element. Mobile nav can be opened/closed/navigated with keyboard alone.
- [ ] **Lighthouse:** All categories ≥ 95 on the public URL (not localhost). Run in an incognito window so extensions don't pollute.
- [ ] **Accessibility audit:** axe DevTools or Lighthouse a11y reports 0 violations. Contrast ratios ≥ 4.5:1 for all body text.
- [ ] **robots.txt and sitemap.xml:** Both resolve at the expected URLs. Sitemap lists every project page. robots.txt allows indexing.
- [ ] **404 page:** Hitting a random URL shows a usable 404 with a link back home — not Next.js's default.
- [ ] **Broken links:** Run a broken-link checker (lychee or linkinator) over the deployed site — zero broken links.
- [ ] **No console errors / warnings:** Open the deployed site in DevTools, click through every page, no red errors or hydration warnings in the console.
- [ ] **Analytics not leaking dev data:** If analytics is added, verify localhost is excluded.

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Thin case studies (Pitfall 2) | MEDIUM | Block out 2–4 hours per project; use the template; prioritize the flagship project first; can ship incrementally (update one project at a time). |
| Dark mode flash (Pitfall 3) | LOW–MEDIUM | Install `next-themes`, migrate theme state; usually 2–4 hours; test in throttled network. |
| Low-contrast palette (Pitfall 4) | LOW | Adjust design tokens; run axe to verify; re-deploy. 1–2 hours if tokens are centralized; longer if contrast is hardcoded across components. |
| Unoptimized images (Pitfall 5) | LOW | Replace `<img>` with `next/image`; re-export hero/screenshots at appropriate resolutions. Usually 1 afternoon. |
| Missing OG cards (Pitfall 6) | LOW | Add root `metadata` and per-page `generateMetadata`; add `opengraph-image.tsx`. Requires cache-bust on LinkedIn (use Post Inspector's "Inspect" to force refresh). |
| Dead links / outdated resume (Pitfall 7) | LOW | Run lychee, replace broken URLs, re-upload resume. Add scheduled CI job to prevent recurrence. |
| Scattered content (Pitfall 8) | HIGH | Migration is painful late — touches every page and card component. If caught early, 2–4 hours; if caught post-launch with real content, full day+. This is why it's a keystone phase. |
| Lorem ipsum in production (Pitfall 9) | LOW (if caught fast) / HIGH (reputation) | Swap content immediately; reputation damage is one-way for anyone who visited during the window. Add banner + grep check to prevent recurrence. |
| Custom domain not wired (Pitfall 10) | LOW | Configure DNS (~5 min), wait for propagation (~1 hour typical, up to 48 hours), verify SSL, update OG env vars. |
| Contact form silently dropping (Pitfall 11) | MEDIUM — message loss | Switch to mailto or verified service; send apology / re-reach to anyone you suspect tried to contact. |
| Client-rendered content (Pitfall 12) | MEDIUM | Remove `"use client"` directives, refactor hooks-based rendering to server-rendered props. Usually per-component work. |
| Mobile nav accessibility failures (Pitfall 13) | LOW–MEDIUM | Rebuild with Radix Dialog/NavigationMenu primitive; usually 2–3 hours. Full replacement is lower-risk than incremental patches. |

---

## Pitfall-to-Phase Mapping

Assumes a roadmap structured roughly: **Scaffold → Design System → Content Schema → Landing / Hero → Navigation → About / Skills → Projects (List + Detail) → Theming (Dark Mode) → SEO / Metadata → Pre-Launch Audit → Launch.**

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1. Aesthetic clichés | Design system phase (anti-feature list signed off before hero built) | Design review against anti-feature list; peer review by a non-developer |
| 2. Thin case studies | Content schema phase (required fields in Zod) + projects phase (template applied) | TypeScript build fails if `role` or `decisions` fields missing; 3–4 real case studies drafted using the template |
| 3. Dark-mode FOUC | Theming / dark-mode phase | Hard-refresh test in dark mode on throttled network shows no flash |
| 4. Low-contrast design | Design system / tokens phase | axe contrast check in CI; Lighthouse a11y = 100 |
| 5. Hero / image performance | Landing phase (sets performance budget) + media pipeline phase | Lighthouse performance ≥ 95 in CI; no `<img>` tags in source grep |
| 6. Missing OG / Twitter cards | SEO / metadata phase | LinkedIn Post Inspector + Twitter Validator pass for home and one project page |
| 7. Dead demo / resume links | Pre-launch checklist phase (audit) + post-launch maintenance (scheduled CI) | lychee / linkinator CI job runs green; resume "last updated" date visible |
| 8. Scattered content in JSX | Content schema phase (comes before any project rendering) | All project content imported from `/content` or `/data`; grep for project titles finds hits only in data files |
| 9. Lorem ipsum in production | Content schema phase (sentinel design) + pre-launch (grep check) | CI grep for placeholder tokens returns empty; dev banner visible during development |
| 10. Custom domain not wired | Pre-launch / deployment hardening phase | Incognito window on custom domain loads with HTTPS; OG previews show custom domain |
| 11. Contact form throwing emails into void | Contact section phase (decision: mailto-only in v1) | Clicking email link opens mail client with correct address; no contact form in v1 |
| 12. Client-rendered content | Next.js scaffolding phase (server-component-default patterns) + SEO audit phase | `view-source` on project pages shows content in HTML; Lighthouse SEO = 100 |
| 13. Mobile nav / keyboard failures | Navigation phase (use Radix/Headless UI primitive) + accessibility audit phase | Keyboard-only nav-through works; VoiceOver reads menu state; axe violations = 0 |

---

## Scope-Creep Anti-Patterns (Domain-Specific)

These aren't technical pitfalls — they're planning traps that derail portfolio projects specifically.

| Anti-Pattern | Why It Happens | Mitigation |
|--------------|----------------|------------|
| Adding a blog to v1 | "A blog is good for SEO and signaling" — true in the abstract, but an empty blog screams abandonment | PROJECT.md already excludes blog. Hold the line. If the engineer actually wants to write, they can ship the portfolio first and add a blog in v2 once they have 2–3 drafts ready |
| Adding analytics before there's traffic | "I want to see who's visiting" — but there are no visitors yet to learn from | Defer (already in PROJECT.md out-of-scope). Add post-launch when there's ≥ 100 sessions/week, or skip entirely — portfolio analytics rarely drive decisions |
| Awwwards-style hero animations (WebGL, GSAP, ScrollTrigger) | "Competitors have cool animations" — but they're designers whose entire brand is visual craft; an engineer portfolio has different signals | PROJECT.md aesthetic is minimal — subtle transitions only. Ban ScrollTrigger-style full-page animations. The tradeoff is real: animation-heavy portfolios score worse on Lighthouse and often fail the 30-second recruiter skim |
| CMS migration mid-project | "Markdown files don't scale" — but 3–4 projects don't need scale | PROJECT.md excludes CMS. Flat TS/MDX data is the correct choice at this size. Revisit only if project count grows past 10 |
| Custom CMS / authoring pipeline | Engineer wants to build the fun thing (CMS) instead of the boring thing (case studies) | Explicit rule: no custom tooling until the content ships first. Build the CMS in v3 if still wanted |
| Rewriting the design system halfway through | Initial design feels "not distinctive enough" after partial build | Lock the design system by end of its phase; changes after that require explicit scope re-open. Minimal aesthetic means restraint is the brand — "not distinctive enough" is often "not loud enough", which is the point |
| Chasing Lighthouse 100 / 100 / 100 / 100 at the expense of content | Perfection-gaming on the numbers while case studies stay thin | Thresholds: ≥ 95 on all categories is sufficient. Do not spend a day chasing the last 5 points; spend it writing case studies |
| Over-polishing placeholder content | Beautifying lorem ipsum or placeholder projects | Structural work only on placeholders; wait for real content before polishing prose/imagery |

---

## Sources

- [Developer portfolio do's & don'ts — Kieran Roberts](https://blog.kieranroberts.dev/developer-portfolio-dos-and-donts) — community-sourced portfolio review patterns
- [Building an Effective Dev Portfolio — Josh W. Comeau](https://www.joshwcomeau.com/effective-portfolio/) — respected engineer's guide to portfolio strategy
- [What I learned after reviewing over 40 developer portfolios — DEV](https://dev.to/kethmars/what-i-learned-after-reviewing-over-40-developer-portfolios-9-tips-for-a-better-portfolio-4me7) — aggregated portfolio review findings
- [Do not put skill bars on your resume — DEV](https://dev.to/tim012432/do-not-put-skill-bars-on-your-resume-lh6) — explicit case against proficiency bars
- [Software Engineer Portfolio Guide — 8seneca](https://www.8seneca.com/en/blog/technology/software-engineer-portfolio-guide-what-to-include-and-what-to-avoid) — portfolio mistakes overview
- [Fixing Dark Mode Flickering (FOUC) in React and Next.js — Not A Number](https://notanumber.in/blog/fixing-react-dark-mode-flickering) — canonical FOUC prevention guide
- [Next.js Dark Mode Implementation: Complete next-themes Guide](https://eastondev.com/blog/en/posts/dev/20251220-nextjs-dark-mode-guide/) — 2025 guide to `next-themes` patterns
- [Understanding & Fixing FOUC in Next.js App Router — DEV](https://dev.to/amritapadhy/understanding-fixing-fouc-in-nextjs-app-router-2025-guide-ojk) — App Router FOUC specifics
- [Offering a Dark Mode Doesn't Satisfy WCAG Color Contrast Requirements — BOIA](https://www.boia.org/blog/offering-a-dark-mode-doesnt-satisfy-wcag-color-contrast-requirements) — contrast requirements apply in both modes
- [Designing Accessible Dark Mode — Ebunoluwa Ige / Medium](https://medium.com/@design.ebuniged/designing-accessible-dark-mode-a-wcag-compliant-interface-redesign-0e0225833aa4) — dark mode accessibility patterns
- [WCAG Color Contrast Guide — StudioLimb](https://www.studiolimb.com/guides/wcag-color-contrast-guide.html) — 2026 WCAG contrast reference
- [Optimizing Web Vitals using Lighthouse — web.dev](https://web.dev/articles/optimize-vitals-lighthouse) — official Core Web Vitals guidance
- [Largest Contentful Paint (LCP) Guide — Unlighthouse](https://unlighthouse.dev/learn-lighthouse/lcp) — LCP optimization, priority preload patterns
- [Core Web Vitals: How Image Optimization Impacts Lighthouse — DEV](https://dev.to/hardik_b2d8f0bca/core-web-vitals-how-image-optimization-impacts-your-lighthouse-score-3407) — image-specific performance impact
- [Custom fonts without compromise using Next.js and `next/font` — Vercel](https://vercel.com/blog/nextjs-next-font) — official next/font guidance
- [Fonts in Next.js (2026): `next/font` patterns, performance, and production pitfalls](https://thelinuxcode.com/fonts-in-nextjs-2026-nextfont-patterns-performance-and-production-pitfalls/) — current font pitfalls
- [Next.js SEO: Complete Implementation Guide for 2026 — Adeel Imran](https://adeelhere.com/blog/2025-12-09-complete-nextjs-seo-guide-from-zero-to-hero) — current SEO implementation patterns
- [Getting Started: Metadata and OG images — Next.js docs](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — official metadata API
- [Functions: generateMetadata — Next.js docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — per-page metadata
- [Metadata Files: robots.txt — Next.js docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — robots/sitemap conventions
- [The Complete Next.js SEO Guide — Strapi](https://strapi.io/blog/nextjs-seo) — common SEO mistakes list
- [Hamburger menu accessibility guidelines — accede-web](https://www.accede-web.com/en/guidelines/rich-interface-components/burger-menu/) — a11y reference for mobile nav
- [Mastering Accessible Modals with ARIA and Keyboard Navigation — The A11Y Collective](https://www.a11y-collective.com/blog/modal-accessibility/) — focus trap patterns
- [Focus Management in Accessibility Testing — Medium](https://medium.com/@psnavya90/focus-management-in-accessibility-testing-f3ad6a111ac9) — focus-return patterns
- [Portfolio case study writing — Toptal](https://www.toptal.com/designers/ui/case-study-portfolio) — role and contribution framing in case studies
- [How to write project case studies — DESK Magazine](https://vanschneider.com/blog/portfolio-tips/write-project-case-studies-portfolio/) — case study structure
- [Website Launch Checklist — Steph Corrigan Design](https://stephcorrigan.com/website-launch-checklist/) — pre-launch checklist structure
- [Why Your Contact Page is the Most Important Part of Your Portfolio — Shopify](https://www.shopify.com/partners/blog/why-your-contact-page-is-the-most-important-part-of-your-portfolio-website) — contact form pitfalls
- [WebAIM Million: 2024 accessibility analysis](https://webaim.org/projects/million/) — contrast is the #1 accessibility failure (83.6% of sites)

---
*Pitfalls research for: software engineer personal portfolio website*
*Researched: 2026-04-21*
