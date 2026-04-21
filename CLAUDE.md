# CLAUDE.md

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Portfolio** — a personal portfolio website for a software engineer serving a mixed audience (recruiters, hiring engineers, potential clients). Built with Next.js SSG so content renders server-side for SEO and social preview cards.

**Core Value:** A mixed-audience visitor lands on the site, grasps who this engineer is within seconds, and can click through to meaningful depth on at least one project.

**Content state:** Placeholder content throughout — real name, bio, and project details will swap in later. All user-visible copy lives in `/data/*.ts` + `/content/projects/*.mdx` and is greppable via `git grep PLACEHOLDER_`. Never hard-code copy in JSX.

See `.planning/PROJECT.md` for constraints, decisions, and evolution log.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

- **Framework:** Next.js 16 (App Router, SSG, React Server Components default)
- **Runtime:** React 19, TypeScript 5 (strict — `noUncheckedIndexedAccess`, `verbatimModuleSyntax`)
- **Styling:** Tailwind CSS v4 with CSS-first `@theme` tokens in `globals.css`
- **Fonts:** Geist Sans + Geist Mono via `next/font` (self-hosted)
- **Theming:** `next-themes` with blocking inline script (FOUC-free)
- **Content:** `@content-collections/*` (Zod-validated MDX); flat `/data/*.ts` for structured fields
- **Icons:** `lucide-react` (tree-shakable)
- **Animation:** `motion/react` (subtle entrance only; respects `prefers-reduced-motion`)
- **Validation:** `zod`
- **Lint/format:** Biome
- **Test:** Vitest + `@testing-library/react` (unit), Playwright + `@axe-core/playwright` (E2E + a11y)
- **Deployment:** Vercel

**Do not use:** `framer-motion` (old name of motion), `contentlayer` (dead), `react-icons` (bundle bloat), `styled-components`/`emotion` (RSC-incompatible), Chakra/MUI/Mantine (fight the minimal aesthetic), any global state library.

See `.planning/research/STACK.md` for versions and rationale.
<!-- GSD:stack-end -->

<!-- GSD:architecture-start source:research/ARCHITECTURE.md -->
## Architecture

- **Routing:** Hybrid. `/` is a single-page scrolling home composed of RSC section components; `/projects/[slug]` are real per-project routes statically generated via `generateStaticParams`.
- **Content source of truth:** `/data/*.ts` (typed + Zod-validated) for structured fields; `/content/projects/*.mdx` for case-study prose bodies. Never in JSX.
- **Data access:** `lib/content.ts` (`import "server-only"`) exposes `getAllProjects()` / `getProject(slug)`. Client components must not import it.
- **Client boundary:** Default to RSC. `"use client"` only at true leaves (ThemeToggle, MobileMenu). Page-level `"use client"` is forbidden — it breaks SEO and SSG.
- **Theme:** CSS variables in `globals.css` via Tailwind `@theme`, flipped by `.dark` class on `<html>`, managed by `next-themes`. `suppressHydrationWarning` on `<html>` is required.
- **Metadata:** Next.js metadata API, per-route `generateMetadata`, collocated `opengraph-image.tsx` per route.
- **Build order (non-negotiable):** tokens + theme → data schemas → layout shell → section components → home composition → project detail routes → metadata/SEO → audit/launch.

See `.planning/research/ARCHITECTURE.md` for component boundaries and data flow.
<!-- GSD:architecture-end -->

<!-- GSD:conventions-start source:PROJECT.md + research/PITFALLS.md -->
## Conventions

- **No proficiency bars, percentages, or "beginner/intermediate/expert" labels** anywhere — research-flagged anti-feature.
- **No "ninja / rockstar / passionate / driven" copy** — even in placeholder content.
- **No typewriter hero, splash-gate, or tech-logo marquee** — fails the 30-second recruiter scan.
- **Placeholder sentinels:** all unswapped content uses `PLACEHOLDER_*` or `__TODO__` so a single `git grep` locates every edit needed before launch.
- **Zod schemas enforce required case-study fields** (`role`, `problem`, `outcomes`). Missing a field must fail the build.
- **Accessibility:** WCAG AA contrast both themes (`--text-primary` ≥7:1, `--text-secondary` ≥4.5:1). Animations respect `prefers-reduced-motion`. Semantic HTML, visible focus, keyboard-navigable mobile menu via Radix/Headless UI primitive — never a hand-rolled hamburger.
- **Lighthouse ≥95 all-categories on mobile is a CI gate** (Perf, A11y, SEO, Best Practices). Broken-link check is a CI gate.
<!-- GSD:conventions-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` — do not edit manually.
<!-- GSD:profile-end -->
