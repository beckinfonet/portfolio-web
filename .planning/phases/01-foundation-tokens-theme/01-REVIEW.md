---
phase: 01-foundation-tokens-theme
reviewed: 2026-04-21T00:00:00Z
depth: standard
files_reviewed: 11
files_reviewed_list:
  - src/lib/tokens.ts
  - src/app/globals.css
  - src/providers/theme-provider.tsx
  - src/components/theme-toggle.tsx
  - src/app/layout.tsx
  - src/app/page.tsx
  - tests/tokens.contrast.test.ts
  - .github/workflows/ci.yml
  - biome.json
  - tsconfig.json
  - vitest.config.ts
findings:
  critical: 0
  warning: 2
  info: 3
  total: 5
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-04-21
**Depth:** standard
**Files Reviewed:** 11
**Status:** issues_found

## Summary

Phase 1 lands a solid foundation. The RSC/client boundary is correctly enforced, FOUC prevention is structurally sound, contrast tokens are gated in CI, and strict TypeScript is fully configured. No critical bugs or security issues were found.

Two warnings and three info items follow.

---

## Warnings

### WR-01: Emoji characters used as icon glyphs in ThemeToggle

**File:** `src/components/theme-toggle.tsx:27`
**Issue:** `"☀"` and `"☾"` are Unicode emoji/symbol characters rendered as text content inside the button. Browser and OS emoji rendering is inconsistent — the sun may render as a colored emoji on some platforms, breaking the minimal monochrome aesthetic. More critically, these characters have no guaranteed baseline alignment and will look wrong at unusual font-size or system font scales. They are also not wrapped in an `aria-hidden` span, meaning screen readers may read the emoji name ("white sun with rays") in addition to the `aria-label`.
**Fix:** Replace with a `lucide-react` icon pair (`Sun` / `Moon`), which is already in the stack. Wrap the icon in `aria-hidden="true"` since the button's `aria-label` already conveys the action:

```tsx
import { Moon, Sun } from "lucide-react";

{resolvedTheme === "dark" ? (
  <Sun size={18} aria-hidden="true" />
) : (
  <Moon size={18} aria-hidden="true" />
)}
```

### WR-02: `@types/wcag-contrast` pinned to `latest` in package.json

**File:** `package.json:34`
**Issue:** `"@types/wcag-contrast": "latest"` uses a floating version specifier. All other dev dependencies are pinned to exact versions. `latest` resolves at install time; a breaking type change in a future `@types/wcag-contrast` release will silently alter the lock file on fresh `npm ci` runs and could break the `typecheck` gate without any code change.
**Fix:** Replace `"latest"` with the concrete version that was installed (check `package-lock.json`) and pin it like all other deps. E.g.:

```json
"@types/wcag-contrast": "3.0.0"
```

---

## Info

### IN-01: Manual sync between `tokens.ts` and `globals.css` is a latent drift risk

**File:** `src/lib/tokens.ts:3-6` / `src/app/globals.css:3-7`
**Issue:** Both files document the sync requirement in comments, but there is no automated enforcement. A reviewer can miss one file in a PR and the contrast gate passes (it reads `tokens.ts`) while the shipped CSS regresses. This is RESEARCH §Pitfall 6 "Option 3" — the comments acknowledge the risk but do not close it.
**Fix:** Not a blocker for Phase 1, but Phase 2 or 3 should introduce a small Vitest snapshot or Node script that parses the six hex values out of `globals.css` and asserts they match `tokens.ts`. This closes the drift window completely without adding a build-time dependency.

### IN-02: `npm test` in CI runs all Vitest tests, not just the contrast gate

**File:** `.github/workflows/ci.yml:46`
**Issue:** The CI step is labelled "Contrast gate (A11Y-03, D-06)" but runs `npm test` (`vitest run`), which will execute every test in `tests/**/*.test.ts`. As test suites grow in later phases (unit tests for content helpers, etc.), a failure in a non-contrast test will block on the step labelled "Contrast gate", making failures misleading. This is a labelling and scoping issue, not a blocking bug for Phase 1.
**Fix:** Either rename the CI step to "Unit tests" to reflect the broader scope, or add a dedicated `npm run test:contrast` script (`vitest run tests/tokens.contrast.test.ts`) and reserve `npm test` for the full suite.

### IN-03: `text-color-*` Tailwind utilities require `--color-` prefix but page uses bare `text-text-primary`

**File:** `src/app/page.tsx:9,14,17`
**Issue:** The page uses utility classes like `text-text-primary`, `text-text-secondary`, and `bg-background`. In Tailwind v4, the CSS variable `--color-text-primary` maps to the utility `text-text-primary` (stripping the `--color-` prefix and converting `-` to utility segments). This is correct per Tailwind v4 convention and will work. Flagging as info because it looks unusual to readers familiar with v3 naming conventions, and a future contributor may incorrectly "fix" it to `text-[--color-text-primary]` or a custom class. A brief inline comment on the first usage in `page.tsx` would prevent confusion.
**Fix:** Add a single comment near the first utility use:

```tsx
{/* Tailwind v4: --color-text-primary → text-text-primary utility */}
```

---

_Reviewed: 2026-04-21_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
