# Phase 2: Data Layer and Content Schema — Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Ship the typed data layer and content-validation contract that every later phase consumes:

- `/data/site.ts` — site-wide config
- `/data/about.ts` — bio
- `/data/skills.ts` — categorized skills
- `/data/socials.ts` — email + social links
- `/data/projects/index.ts` — project metadata array with Zod schema
- `/content/projects/*.mdx` — four placeholder case-study prose bodies, frontmatter-validated
- `lib/content.ts` — server-only data access exposing `getAllProjects()` and `getProject(slug)`

**In scope:** Schemas, Zod validation, content-collections MDX loader config, placeholder content with `PLACEHOLDER_*` sentinels, server-only boundary enforcement, build-fail on missing required case-study fields.

**Out of scope (other phases):**
- MDX rendering components `<Screenshot>`, `<CodeBlock>`, `<Callout>` — Phase 5
- Project card UI / index grid — Phase 5
- Per-project `opengraph-image.tsx` — Phase 5/6
- Site-wide `generateMetadata` / JSON-LD — Phase 6
- Resume PDF file in `public/` — Phase 4

</domain>

<decisions>
## Implementation Decisions

### D-01: Case-study schema completeness — Pragmatic (cover + status)
Beyond the roadmap-required fields (`title`, `tagline`, `role`, `problem`, `outcomes`, `tech[]`, `links`, `date`), each project case study includes:
- `cover: string` — image path for project cards rendered in Phase 5 (cards without cover art look underbuilt for a portfolio)
- `status: "live" | "archived" | "wip"` — lets archived/retired projects stay in data without cluttering the live index

**Deferred fields** (add in later phases if needed, Zod makes addition trivial):
- `featured: boolean` — deferred to Phase 5 when projects index decides ordering
- `ogAccent: string` — deferred to Phase 5/6 when per-project OG cards are built

### D-02: `links` shape — Fixed optional `{ demo?, repo?, caseStudy? }`
Each project's `links` field is a typed optional object:
```ts
links: {
  demo?: string,      // live deployment URL
  repo?: string,      // public GitHub/GitLab URL
  caseStudy?: string  // external write-up URL (e.g. Medium, company blog)
}
```

All three are optional — internal work lacks a public repo, some projects lack a live demo, most lack external case studies. Fixed keys let Phase 5 cards render specific icons per link type without string-matching labels at runtime.

**Rejected:** open-ended `{ label, url }[]` array — pushes UI complexity downstream with no benefit at 3–4 projects.

### D-03: Skills categorization — By layer
`/data/skills.ts` schema: `Array<{ category: string, tags: string[] }>`. Category names are free strings (swappable at content-swap time), but the **default category set** for placeholder content is:

- **Languages** — e.g. TypeScript, Python, Go
- **Frameworks** — e.g. Next.js, React, FastAPI
- **Tools** — e.g. Biome, Vitest, Playwright
- **Infra** — e.g. Vercel, Docker, Postgres

Classic engineer taxonomy, most skimmable for 30-second recruiter scan, no proficiency-adjacent signaling. Explicitly rejected the "Core / Recent / Exploring" scheme — reads as soft expertise labeling (forbidden by project principles).

### D-04: Placeholder-project texture — Polished exemplar + 3 skeletons
DATA-08 requires four placeholder projects, each with every required field. Of the four:

- **One polished exemplar** — richer `PLACEHOLDER_*` prose in the MDX body demonstrating the target quality bar (paragraph-length problem statement, bulleted outcomes with measurable framing, real-looking decision list). Purpose: remind the future content-editor (you) what "complete" looks like when swapping real content.
- **Three skeletons** — minimal `PLACEHOLDER_*` stubs: single-sentence problem, three bullet outcomes, short MDX body. Purpose: prove the Zod schema validates sparse content and the loader handles variable-length bodies.

### D-05: Site config scope — Minimal
`/data/site.ts` exports exactly the five DATA-01-required fields:
```ts
{ name: string, title: string, description: string, url: string, author: string }
```

**Rationale:** `/data/socials.ts` (DATA-04) owns social handles including any Twitter/X handle needed for OG cards in Phase 6. Phase 6 can compose site-wide metadata from `site.url` + collocated OG images without needing `keywords`, `locale`, or `defaultOgImage` in site config now. Tight site config = fewer things to update at content swap.

### Claude's Discretion (locked during this discussion)

- **D-06: Sentinel convention** — `PLACEHOLDER_*` for values that will be swapped for real content (e.g., `PLACEHOLDER_NAME`, `PLACEHOLDER_PROBLEM`). `__TODO__` is reserved for "this field needs a real decision later" markers distinct from "this value needs a real swap". Phase 2 uses `PLACEHOLDER_*` throughout.
- **D-07: MDX toolchain** — `@content-collections/core` + `@content-collections/mdx` + `@content-collections/next` for Next.js build integration (watches + auto-regenerates types on content change). Pinned per STACK.md.
- **D-08: Build-fail behavior** — Zod validation runs inside the content-collections build pipeline; missing required field on any project causes `npm run build` to fail with a named error naming the offending slug and field (satisfies Phase 2 Success Criterion 2).
- **D-09: `getProject(slug)` unknown-slug behavior** — Returns `null`, never throws. Callers handle the null case (satisfies Phase 2 Success Criterion 3).
- **D-10: Server-only boundary** — `lib/content.ts` opens with `import "server-only"`. Importing it from a client component (`"use client"` file) produces a compile-time error (satisfies Phase 2 Success Criterion 4).
- **D-11: Four placeholder project slugs** — Neutral filler names swappable by renaming:
  - `flagship-dashboard` — the polished exemplar
  - `realtime-pipeline` — skeleton
  - `developer-tooling` — skeleton
  - `open-source-library` — skeleton
- **D-12: Zod runtime import** — `zod` is already a project dependency (pinned in STACK.md). Schemas live alongside their data files (`/data/*.ts`) and alongside the MDX schema in `content-collections.ts`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level source of truth
- `CLAUDE.md` — project conventions (data in `/data/*.ts` + `/content/projects/*.mdx`, never in JSX; `lib/content.ts` is `import "server-only"`; Zod schemas enforce required case-study fields; forbidden copy list)
- `.planning/PROJECT.md` — core value, content-pipeline constraint, 3–4 flagship projects, aesthetic
- `.planning/REQUIREMENTS.md` §Data Layer — DATA-01 through DATA-09 acceptance criteria
- `.planning/ROADMAP.md` §Phase 2 — goal + five Success Criteria

### Phase 1 carry-forwards
- `.planning/phases/01-foundation-tokens-theme/01-CONTEXT.md` — Phase 1 decisions (sentinel convention was established via `PLACEHOLDER_SITE_TITLE`, `PLACEHOLDER_NAME`, `PLACEHOLDER_TAGLINE` in `src/app/layout.tsx` + `src/app/page.tsx`)
- `.planning/phases/01-foundation-tokens-theme/01-04-SUMMARY.md` — four npm scripts and CI gates that Phase 2 must not break

### Stack & architecture
- `.planning/research/STACK.md` — pinned versions for `zod`, `@content-collections/core`, `@content-collections/mdx`, `@content-collections/next`
- `.planning/research/ARCHITECTURE.md` — RSC-first boundaries, `server-only` conventions, content flow from data/MDX → `lib/content.ts` → RSC pages
- `.planning/research/PITFALLS.md` — known traps around MDX + Next.js 16 + content-collections

### Existing code the data layer must coexist with
- `src/app/layout.tsx` — RSC root; `site.ts` will be consumed here for default metadata eventually
- `src/app/page.tsx` — sentinel-only placeholder; Phase 3/4 will make it consume `site.ts` + `about.ts`
- `src/lib/tokens.ts` — illustrative precedent for a TS-typed data module (different purpose, same pattern)
- `tsconfig.json` — `@/*` path alias; data imports use `@/data/site` etc.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Path alias `@/*`** (configured in `tsconfig.json` + `vitest.config.ts`) — `/data/*.ts` and `/lib/content.ts` are imported as `@/data/site`, `@/lib/content` from RSC files
- **Zod already installed** (pinned in package.json via STACK.md) — ready to use for schemas
- **Vitest installed** — data-layer schemas can be unit-tested without extra setup (e.g., "Zod rejects a project missing `role`")

### Established Patterns
- **`import "server-only"` boundary** — precedent is `lib/content.ts` design in CLAUDE.md; Phase 2 is the first file to actually use the directive
- **TS-typed config modules** — `src/lib/tokens.ts` (Phase 1) is the closest analog: `as const` typed export, small focused file. `/data/*.ts` follows the same shape but with Zod parsing at module load.
- **Placeholder sentinels** — Phase 1 established `PLACEHOLDER_SITE_TITLE` / `PLACEHOLDER_NAME` / `PLACEHOLDER_TAGLINE` in `src/app/layout.tsx:12-13` + `src/app/page.tsx:11,15,17`. Phase 2 extends the convention into data files.

### Integration Points
- `src/app/layout.tsx:12` — `metadata.title` will eventually read from `@/data/site` (not this phase — Phase 3/4/6 swap)
- `src/app/page.tsx` — sentinel-only placeholder today; eventually composes Hero/About/Skills/Contact from `/data/*` (Phase 4)
- `content-collections.ts` — new file at repo root; tells the `@content-collections/next` plugin where to find `.mdx` files and which Zod schema to validate them against
- `next.config.ts` — Phase 2 wraps existing config with `@content-collections/next`'s `withContentCollections()`

</code_context>

<specifics>
## Specific Ideas

- **Polished exemplar project slug:** `flagship-dashboard` (the one with richer MDX prose demonstrating target quality bar)
- **Skeleton project slugs:** `realtime-pipeline`, `developer-tooling`, `open-source-library` (minimal `PLACEHOLDER_*` stubs)
- **Default skills categories:** `Languages`, `Frameworks`, `Tools`, `Infra` (order matters — read top-to-bottom)
- **Status enum for projects:** `"live" | "archived" | "wip"` (three values, extensible later if needed)
- **Sentinel usage:** `PLACEHOLDER_PROJECT_TITLE`, `PLACEHOLDER_PROJECT_PROBLEM`, `PLACEHOLDER_PROJECT_OUTCOMES`, etc. — one sentinel per swappable content field so `git grep PLACEHOLDER_` enumerates the full edit surface (DATA-09)

</specifics>

<deferred>
## Deferred Ideas

Ideas raised or considered but explicitly pushed to later phases:

- **`featured: boolean` on projects** — for ordering the projects index. Add in Phase 5 when card-grid layout is decided.
- **`ogAccent: string` on projects** — per-project OG card accent color. Add in Phase 5/6 when `opengraph-image.tsx` routing is built.
- **Keywords, locale, default OG image path on site config** — Phase 6 can add these to site.ts if needed, but probably composes per-route metadata instead.
- **MDX custom components** (`<Screenshot>`, `<CodeBlock>`, `<Callout>`) — Phase 5 builds these; Phase 2 only parses raw MDX bodies.
- **Project detail pages at `/projects/[slug]`** — Phase 5 owns routing; Phase 2 only exposes `getAllProjects()` / `getProject(slug)`.
- **Resume PDF in `public/resume.pdf`** — Phase 4 wires this (DATA layer exposes the URL via socials or site config if added later, but v1 just hard-codes the path).

</deferred>

---

*Phase: 02-data-layer-and-content-schema*
*Context gathered: 2026-04-21*
