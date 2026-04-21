---
phase: 1
slug: foundation-tokens-theme
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-21
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Source: `.planning/phases/01-foundation-tokens-theme/01-RESEARCH.md` §Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.x (added this phase solely for the contrast test) |
| **Config file** | `vitest.config.ts` — Wave 0 creates |
| **Quick run command** | `npm test` (single run, exits) |
| **Watch command** | `npm run test:watch` (local dev only — never in CI or task sampling) |
| **Full suite command** | `npm test` (Phase 1 suite = the contrast file; it IS the full suite) |
| **Static gates (also Phase 1)** | `npm run lint` (Biome), `npm run typecheck` (`tsc --noEmit`), `npm run build` (`next build`) |
| **Estimated runtime** | Contrast test ≈ 100 ms · lint ≈ 1 s · typecheck ≈ 3 s · build ≈ 30 s · total CI ≈ 45 s |

---

## Sampling Rate

- **After every task commit:** `npm run check && npm run typecheck && npm test` — ≈5–10 s feedback
- **After every plan wave:** Full CI workflow — `biome ci`, `tsc --noEmit`, `vitest run`, `next build` — ≈60–90 s
- **Before `/gsd-verify-work`:** Full suite green in CI on latest commit + manual FOUC verification (screenshot) + manual FOUND-03 network verification + README review
- **Max feedback latency:** 10 s (task-level)

No watch-mode flags in sampling commands. `test:watch` is reserved for interactive local iteration only.

---

## Per-Task Verification Map

Task IDs here are placeholders pending planner wave/plan assignment (Task #6). Once `gsd-planner` writes PLAN.md files, the verifier will update the Task ID / Plan / Wave columns to match.

| Req ID | Behavior | Test Type | Automated Command | File Exists | Threat Ref | Status |
|--------|----------|-----------|-------------------|-------------|------------|--------|
| FOUND-01 | TS strict compiles (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`) | Static gate | `npm run typecheck` | ❌ W0 (`tsconfig.json` + script) | — | ⬜ pending |
| FOUND-02 | Tailwind v4 `@theme` tokens parse and emit utilities | Build integration | `npm run build` (fails on invalid CSS) | ✅ (scaffold creates `globals.css`; build is verification) | — | ⬜ pending |
| FOUND-03 | Geist woff2 loads locally, zero Google Fonts network requests | Manual + build artifact grep | **Manual:** DevTools Network on `npm run dev`, filter `fonts.gstatic`, expect 0. **Grep:** `git grep -n "fonts.gstatic\|fonts.googleapis" src` expected empty | Manual evidence in phase record | — | ⬜ pending |
| FOUND-04 | Type-scale utilities resolve (`text-display`, `text-body`, …) | Build integration | `npm run build` — generated CSS must include rules for each `--text-*` token | Indirect (build success implies) | — | ⬜ pending |
| FOUND-05 | Hard-refresh in dark on throttled 3G paints dark on first frame | Manual (Chrome DevTools) | **Protocol:** incognito → DevTools Network "Slow 3G" → set dark → hard-refresh (Cmd+Shift+R) → Performance timeline → first paint frame MUST be dark | Manual evidence (screenshot) in phase record | — | ⬜ pending |
| FOUND-06 | `biome lint` + `biome format` pass on empty project | Static gate | `npm run lint && npm run format -- --write=false` (or `biome ci`) | ❌ W0 (`biome.json` + scripts) | — | ⬜ pending |
| FOUND-07 | CI runs lint + typecheck + build + contrast on every push | CI integration | Push to branch → GitHub Actions shows 4 green steps | ❌ W0 (`.github/workflows/ci.yml`) | — | ⬜ pending |
| FOUND-08 | Clean repo — no starter assets, README reflects project | Grep + dir listing + review | `git ls-files \| grep -E 'next\.svg\|vercel\.svg\|file\.svg\|globe\.svg\|window\.svg\|page\.module\.css\|favicon\.ico'` MUST be empty; manual README review | Manual review | — | ⬜ pending |
| A11Y-03 | `--text-primary` ≥7:1 and `--text-secondary` ≥4.5:1 in BOTH themes | Unit (Vitest) | `npm test` runs `tests/tokens.contrast.test.ts` — 6 assertions (primary + secondary + accent, × 2 themes) | ❌ W0 (`tests/tokens.contrast.test.ts` + `src/lib/tokens.ts` + `vitest.config.ts`) | — | ⬜ pending |

*Status legend: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Files that MUST exist before implementation work can produce greens:

- [ ] `tsconfig.json` — strict + `noUncheckedIndexedAccess` + `verbatimModuleSyntax` + App Router + `@/*` alias (FOUND-01)
- [ ] `biome.json` — Biome 2.x config; formatter + linter rules suited to Next.js + Tailwind v4 (FOUND-06)
- [ ] `package.json` scripts — `dev`, `build`, `start`, `lint`, `format`, `check`, `typecheck`, `test`, `test:watch`, `ci:biome`
- [ ] `.github/workflows/ci.yml` — Node 22 LTS, npm cache, 4-step workflow: biome ci → typecheck → test → build (FOUND-07)
- [ ] `vitest.config.ts` — minimal config, resolves `@/*` alias, Node environment
- [ ] `src/lib/tokens.ts` — hex values matching `globals.css` (or the regex-parsed source-of-truth path — see Research Open Question 1) (A11Y-03 source)
- [ ] `tests/tokens.contrast.test.ts` — 6 WCAG assertions via `wcag-contrast.hex()` (A11Y-03)
- [ ] Dev-deps install: `npm install -D vitest @biomejs/biome wcag-contrast @types/wcag-contrast`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Evidence Required |
|----------|-------------|------------|-------------------|
| No Google Fonts network request on `npm run dev` | FOUND-03 | Network-observation behavior — cannot be asserted statically without a full headless-browser harness; Phase 7 Playwright is the right place, not Phase 1 | DevTools Network screenshot filtered on `fonts.gstatic` with zero requests |
| Dark-mode first-frame paint on throttled 3G | FOUND-05 | Paint-timing behavior on a slow network — reliable automated testing would require Playwright + throttled trace; FOUC is the kind of regression Phase 7's E2E catches, but this phase must prove it works once | Performance timeline screenshot showing first paint frame in dark |
| README reflects actual project | FOUND-08 | Prose quality is a judgment call | Human review — recorded in phase completion notes |

---

## Validation Sign-Off

- [ ] All requirements have an `<automated>` verify path OR a Wave 0 dependency OR a documented manual protocol (see Manual-Only Verifications)
- [ ] Sampling continuity — no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all ❌ MISSING references (tsconfig, biome.json, scripts, CI workflow, vitest config, tokens.ts, contrast test, dev-deps install)
- [ ] No watch-mode flags in CI or task-sampling commands
- [ ] Feedback latency < 10 s at task level, < 90 s at wave level
- [ ] `nyquist_compliant: true` set in frontmatter once planner has wired Task IDs to this map

**Approval:** pending
