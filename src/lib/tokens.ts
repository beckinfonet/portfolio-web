// src/lib/tokens.ts
// Single source of truth for the SIX contrast-bearing hex values.
// Kept in sync with src/app/globals.css manually (RESEARCH §Pitfall 6 Option 3).
// Sync discipline: if this file drifts from globals.css, the contrast test
// may pass while the shipped CSS regresses. When changing a token hex,
// update BOTH files in the same commit — and the contrast gate must stay green.
export const tokens = {
  light: {
    background: "#ffffff",
    textPrimary: "#0a0a0a",
    textSecondary: "#525252",
    accent: "#0057ff",
  },
  dark: {
    background: "#0a0a0a",
    textPrimary: "#fafafa",
    textSecondary: "#a3a3a3",
    accent: "#4d8bff",
  },
} as const;
