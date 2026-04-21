// tests/tokens.contrast.test.ts
// A11Y-03 + D-06 gate: six WCAG ratios must hold in both themes.
// A failure here MUST be fixed by updating the hex values in globals.css
// and src/lib/tokens.ts together — never by weakening the threshold.
// (Sync discipline: comment-enforced manual sync between globals.css and tokens.ts
//  per RESEARCH §Pitfall 6 Option 3. Both files MUST change in the same commit.)
import { describe, expect, test } from "vitest";
import { hex } from "wcag-contrast";
import { tokens } from "@/lib/tokens";

describe("WCAG contrast (A11Y-03, D-06)", () => {
  for (const mode of ["light", "dark"] as const) {
    const t = tokens[mode];

    test(`${mode}: text-primary vs background >= 7:1 (AAA body)`, () => {
      expect(hex(t.textPrimary, t.background)).toBeGreaterThanOrEqual(7);
    });

    test(`${mode}: text-secondary vs background >= 4.5:1 (AA meta)`, () => {
      expect(hex(t.textSecondary, t.background)).toBeGreaterThanOrEqual(4.5);
    });

    test(`${mode}: accent vs background >= 3:1 (AA interactive)`, () => {
      expect(hex(t.accent, t.background)).toBeGreaterThanOrEqual(3);
    });
  }
});
