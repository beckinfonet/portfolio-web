# Phase 1: Foundation, Tokens, Theme - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-21
**Phase:** 01-foundation-tokens-theme
**Areas discussed:** Typography pairing

---

## Gray Area Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Typography pairing | Font family locked into @theme tokens. Geist vs Inter+JetBrains Mono vs IBM Plex. STATE.md flagged. | ✓ |
| Color palette & accent | @theme values (monochrome vs accent), dark-mode base. STATE.md flagged. | |
| Deployment target | Vercel vs Netlify (affects sharp + env decisions). STATE.md flagged. | |
| Type scale & base size | Base font-size + scale ratio for type tokens. | |

**Note:** The three unselected areas were explicitly deferred to Claude's discretion, with research-backed defaults applied (see CONTEXT.md `<decisions>` → Claude's Discretion).

---

## Typography pairing

### Q1: Which font family pairing should ship in the @theme tokens?

| Option | Description | Selected |
|--------|-------------|----------|
| Geist Sans + Geist Mono (Recommended) | One family, Sans + Mono paired. Self-hosted via `geist` npm package. Vercel-designed for UI-dense technical content; matching metrics prevent the 'two unrelated fonts' feel. Variable font covers 100–900. | ✓ |
| Inter + JetBrains Mono | Neutral 2020s sans + higher-character mono at small sizes. Loaded via `next/font/google` (build-time self-host). Less 'Vercel-branded' feel. | |
| IBM Plex Sans + IBM Plex Mono | More industrial/engineered feel. 8 weights. Good for 'less default-SaaS' look. | |

**User's choice:** Geist Sans + Geist Mono (recommended default)
**Notes:** No freeform input; user accepted the recommendation as-is.

---

### Q2: How broadly should monospace be used?

| Option | Description | Selected |
|--------|-------------|----------|
| Code, tags, + accents (Recommended) | Mono for code, skill tags, kbd, plus meta accents (dates, numerics, role/scope labels, timestamps). Matches PROJECT.md brief. | ✓ |
| Code & tags only — stricter | Mono strictly for code and skill tags. Prose and meta stay sans. Quietest version. | |
| Also on section headings / meta | Mono for code, tags, meta, AND section headings / major numerics. Strong engineered look; risks feeling affected. | |

**User's choice:** Code, tags, + accents (recommended default)
**Notes:** No freeform input; user accepted the recommendation as-is.

---

### Q3: How should display headings (hero name, section h1/h2) be treated?

| Option | Description | Selected |
|--------|-------------|----------|
| Same sans, heavier weight (Recommended) | Headings use the chosen sans family at 700–800 weight. Unified type system. | ✓ |
| Same sans at 900 + tight tracking | Heaviest variable-font weight with tracked-in letter-spacing for a more display-y hero. | |
| Mono for hero name, sans for body | Hero and major display use mono; body/prose stays sans. Very technical/editorial. | |

**User's choice:** Same sans, heavier weight (recommended default)
**Notes:** No freeform input; user accepted the recommendation as-is.

---

## Wrap-up

### Q4: Typography captured. What next?

| Option | Description | Selected |
|--------|-------------|----------|
| More typography questions | Drill deeper on typography — weights, italic, line-height. | |
| Discuss Color palette & accent | STATE.md flagged — @theme values need concrete hues before tokens ship. | |
| Discuss Deployment target | STATE.md flagged — Vercel vs Netlify shapes sharp + env decisions. | |
| I'm ready for CONTEXT.md | Capture typography decisions; let planner/researcher use defaults for the rest. | ✓ |

**User's choice:** I'm ready for CONTEXT.md
**Notes:** User explicitly delegated palette, deployment target, and type scale to Claude's discretion. STACK.md + PITFALLS.md research-backed defaults apply — recorded in CONTEXT.md `<decisions>` → Claude's Discretion.

---

## Claude's Discretion

Explicit delegations from this discussion:
- Color palette values (monochrome character, accent hue choice, dark-mode base)
- Deployment target (Vercel vs Netlify) — default Vercel unless commercial-use intent changes
- Type scale ratio + base font-size (default 16px / 1.25)
- Biome-only vs Biome + ESLint hybrid — default Biome-only
- Weight token set — default 400 / 500 / 700
- Italic variant scope — default sans italic only, skip mono italic v1

## Deferred Ideas

None — discussion stayed within phase scope.
