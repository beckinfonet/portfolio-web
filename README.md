# Portfolio

Personal portfolio website built with Next.js App Router (SSG) — a minimal, typography-forward site that showcases 3-4 flagship projects as case studies alongside an About section, skills overview, downloadable resume, and contact links.

Audience: recruiters (30-second skim, often mobile), hiring engineers (clicking into project depth), and potential clients evaluating "can this person ship?". Design serves all three without favoring one.

## Status

Active v1 build. Real name, bio, and project content are placeholder sentinels (`PLACEHOLDER_*` / `__TODO__`) that swap in during the Phase 2 data-layer + Phase 4 sections + Phase 7 launch. A single `git grep PLACEHOLDER_` lists every file needing edits before launch.

See `.planning/ROADMAP.md` for the seven-phase build plan and `.planning/STATE.md` for current progress.

## Run locally

Requires Node 22 LTS (minimum 20.9). Use [nvm](https://github.com/nvm-sh/nvm) or equivalent if your system Node is older.

```bash
npm install        # install pinned dependencies
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (next build)
npm run typecheck  # tsc --noEmit (strict — FOUND-01)
npm run check      # Biome format + lint + organize-imports (writes fixes)
npm run ci:biome   # Biome CI mode (no writes; matches CI gate)
npm test           # Vitest contrast gate (six WCAG assertions — A11Y-03)
```

## Tech stack

Next.js 16 (App Router, RSC default, SSG), React 19, TypeScript 5 strict, Tailwind CSS v4 (CSS-first `@theme` tokens), Geist Sans + Mono self-hosted, `next-themes` (FOUC-free), Biome (lint + format), Vitest (contrast gate). Pinned versions live in [`.planning/research/STACK.md`](./.planning/research/STACK.md) — the single source of truth for what's installed.

## Conventions and architecture

- Project guidelines and anti-features (no proficiency bars, no typewriter hero, no ESLint, RSC by default, `PLACEHOLDER_*` sentinel discipline): [`CLAUDE.md`](./CLAUDE.md)
- Core value, constraints, and key decisions: [`.planning/PROJECT.md`](./.planning/PROJECT.md)
- Full v1 requirements: [`.planning/REQUIREMENTS.md`](./.planning/REQUIREMENTS.md)
- Architecture rules (build order, server/client boundaries, data flow): [`.planning/research/ARCHITECTURE.md`](./.planning/research/ARCHITECTURE.md)
- Common pitfalls to avoid (dark-mode FOUC, low-contrast palettes, page-level `"use client"`): [`.planning/research/PITFALLS.md`](./.planning/research/PITFALLS.md)

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs four gates on every push and pull request:

1. `npm run ci:biome` — format + lint + import-sort
2. `npm run typecheck` — TypeScript strict compile
3. `npm test` — WCAG contrast assertions on design tokens
4. `npm run build` — `next build`

CI is green ≠ ready to ship. Phase 7 adds Lighthouse ≥95 + broken-link gates + launch-checklist automation before deployment.

## License

Not licensed for redistribution while content is placeholder. License to be finalized before public launch (Phase 7).
