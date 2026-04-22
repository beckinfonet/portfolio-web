# Phase 2: Data Layer and Content Schema — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `02-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-04-21
**Phase:** 02-data-layer-and-content-schema
**Areas discussed:** Case-study schema, links shape, skills categorization, placeholder-project texture, site config scope
**Mode:** Single-pass batch — user requested "all" gray areas discussed; Claude presented recommended stance per area with rationale; user replied "approved" locking all five.

---

## A. Case-study schema completeness

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal | Just the roadmap-required fields: title, tagline, role, problem, outcomes, tech[], links, date | |
| Pragmatic | + `cover` (image path) + `status` ("live" / "archived" / "wip") | ✓ |
| Forward-looking | + `cover` + `status` + `featured` flag + `ogAccent` color (preempts Phase 5/6) | |

**User's choice:** Pragmatic
**Notes:** Cards without cover art look underbuilt for a portfolio (Phase 5 concern). Status lets archived/WIP projects stay in data without cluttering the live index. `featured` and `ogAccent` deferred — Zod makes addition trivial.

---

## B. `links` shape on projects

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed optional | `{ demo?: string, repo?: string, caseStudy?: string }` — typed keys, all optional | ✓ |
| Open-ended array | `{ label: string, url: string }[]` — maximum flexibility, UI branches on label | |
| Minimal required | `{ demo: string, repo: string }` — both always present | |

**User's choice:** Fixed optional
**Notes:** Internal projects lack public repos; some projects lack live demos. Fixed keys let Phase 5 cards render typed icons per link without string-matching. Open-ended array pushes UI complexity downstream for no benefit at 3–4 projects.

---

## C. Skills categorization scheme

| Option | Description | Selected |
|--------|-------------|----------|
| By layer | Languages / Frameworks / Tools / Infra — classic engineer taxonomy | ✓ |
| By currency | Core / Recent / Exploring — signals trajectory | |
| Freeform | Schema enforces `{ category: string, tags: string[] }[]`; no default categories | |

**User's choice:** By layer
**Notes:** Most skimmable for 30-second recruiter scan. Rejected "Core / Recent / Exploring" — reads as soft proficiency labeling (flirts with forbidden expertise-label territory per CLAUDE.md). Schema still free-string on category so content swap can adjust.

---

## D. Placeholder-project texture

| Option | Description | Selected |
|--------|-------------|----------|
| Uniform stubs | All four identical `PLACEHOLDER_*` stubs | |
| Polished exemplar + 3 skeletons | One project with richer placeholder prose (target quality bar) + three minimal stubs | ✓ |
| Four differentiated | Four distinct placeholder projects with varied tech/role to demo Phase 5 rendering variety | |

**User's choice:** Polished exemplar + 3 skeletons
**Notes:** DATA-08 requires all four to have every required field. Exemplar's richer prose (paragraph-length problem, quantified outcomes, decision list) reminds the future content-editor what "complete" looks like at swap time. Skeletons prove the Zod schema validates sparse content.

---

## E. Site config scope

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal | Just DATA-01's 5 fields: name, title, description, url, author | ✓ |
| + social handles | + twitter / x handle for OG cards | |
| + SEO-forward | + keywords, default OG image path, locale | |

**User's choice:** Minimal
**Notes:** `/data/socials.ts` (DATA-04) already owns social handles including Twitter/X if needed. Phase 6 can compose per-route metadata from `site.url` + collocated `opengraph-image.tsx` without Site config changes. Tight site config = less to update at content swap.

---

## Claude's Discretion (locked by defaults during discussion)

- Sentinel convention — `PLACEHOLDER_*` for swap values, `__TODO__` reserved for decision markers
- MDX toolchain — `@content-collections/core` + `@content-collections/mdx` + `@content-collections/next` (per STACK.md)
- Build-fail behavior — Zod validation runs inside content-collections build; missing required field names the offending slug + field in the error
- `getProject(slug)` unknown-slug — returns `null`, never throws
- Server-only boundary — `lib/content.ts` opens with `import "server-only"`; client import is compile-time error
- Four placeholder slugs — `flagship-dashboard` (exemplar), `realtime-pipeline`, `developer-tooling`, `open-source-library`

## Deferred Ideas

- `featured: boolean` on projects (Phase 5)
- `ogAccent: string` per-project (Phase 5/6)
- Site config keywords / locale / default OG path (Phase 6 if needed, likely not)
- MDX custom components `<Screenshot>`, `<CodeBlock>`, `<Callout>` (Phase 5)
- Projects index rendering / card grid UI (Phase 5)
- Resume PDF wiring (Phase 4)
