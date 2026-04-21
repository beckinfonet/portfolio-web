# Portfolio

## What This Is

A personal portfolio website for a software engineer — a public-facing presence that showcases 3–4 flagship projects as case studies alongside an About section, skills overview, downloadable resume, and contact links. Built with Next.js for SEO reach (people will Google the engineer's name), deployed on Vercel or Netlify.

## Core Value

A mixed-audience visitor — recruiter, hiring engineer, or potential client — lands on the site, grasps who this engineer is within seconds, and can click through to meaningful depth on at least one project.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Next.js project scaffolded and deployable to Vercel/Netlify
- [ ] Landing / hero section that reads the engineer's identity in under 10 seconds
- [ ] About section with bio (placeholder content, structured for easy swap)
- [ ] Skills / stack section (explicit technologies grouped by category)
- [ ] Projects section listing 3–4 flagship case studies (cards → detail pages)
- [ ] Project detail template supporting write-up, screenshots/media, live demo and repo links
- [ ] Downloadable resume (PDF) — link in nav and About/Contact
- [ ] Contact / socials section (email, GitHub, LinkedIn, etc.)
- [ ] Dark-mode toggle with persisted preference
- [ ] Minimal / typography-forward design with monospace accents for code/tags
- [ ] Responsive across mobile, tablet, desktop (recruiters often skim on mobile)
- [ ] SEO basics — per-page metadata, Open Graph / Twitter social cards, sitemap
- [ ] Placeholder content wired through a single data source so real content can swap in cleanly later

### Out of Scope

- Blog / writing section — not needed for v1; reduces scope and avoids empty-blog syndrome. Could be added later.
- CMS integration (Contentful, Sanity, etc.) — flat data files are sufficient for 3–4 projects; adds complexity without payoff at this scale.
- Authentication / admin panel — static site, no accounts or logins needed.
- Analytics / form backends — defer until post-launch if/when needed.
- Heavy animation / interactive 3D experiences — aesthetic is minimal; animation should be subtle, not a showcase in itself.
- Internationalization — single-language (English) for v1.
- Custom CMS or markdown blog pipeline — not needed without a blog section.

## Context

- **Audience mix:** Recruiters (30-second skim, often on mobile), hiring engineers (will click into projects and judge technical depth), potential clients (non-technical buyers evaluating "can this person ship?"). Design must serve all three without picking one.
- **Not urgent:** Goal is public presence, not a time-boxed job search. Favors quality and polish over rapid shipping.
- **Content not ready:** The engineer's real name, bio, and project details will be swapped in later. Structure the site so content lives in a single, obvious place (data files) — not scattered across JSX.
- **Name unknown at init:** All personal content placeholders. Domain / site title can be set once the name is chosen.

## Constraints

- **Tech stack:** React via Next.js — chosen over plain Vite SPA because portfolios benefit materially from SSG/SSR for SEO, social preview cards, and image optimization.
- **Deployment:** Vercel or Netlify — modern static host with CI on push; aligns with Next.js defaults.
- **Aesthetic:** Minimal / typography-forward with subtle technical accents (monospace for code/tags, dark-mode toggle). Nothing bold, playful, or visually noisy — visual restraint is the brand.
- **Performance:** Lighthouse scores matter — portfolios are judged partly on craft. Images must be optimized; JS payload should be small.
- **Accessibility:** Semantic HTML, keyboard navigation, reasonable contrast — table stakes for a site that wants to signal quality.
- **Content pipeline:** Placeholder content must live in one structured place (e.g., `/data` or MDX files) so swapping real content later is a single-file edit, not a scavenger hunt.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js over Vite + React SPA | SEO, social preview cards, and image optimization matter for a portfolio where people Google the engineer's name | — Pending |
| Minimal / typography-forward aesthetic with technical accents | Serves the mixed audience: polished for recruiters/clients, signals technical taste for engineers; bold/creative risks looking unserious to clients, pure terminal alienates non-devs | — Pending |
| 3–4 flagship case studies over large gallery | Depth over breadth — a presence portfolio benefits more from a few polished stories than a browsable grid | — Pending |
| Placeholder content baked in, structured for later swap | Engineer's real details come later; structure must make swapping trivial | — Pending |
| No blog in v1 | Avoids empty-blog syndrome and keeps scope tight; can be added later if the engineer commits to writing | — Pending |
| Vercel / Netlify deployment | Zero-config CI on push, native Next.js support, free tier covers a portfolio | — Pending |
| Dark-mode toggle with persisted preference | Part of the minimal + technical aesthetic; expected by the engineer audience | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-21 after initialization*
