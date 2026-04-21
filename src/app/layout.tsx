// RSC root layout. NO "use client" — page-level / layout-level client
// directives are forbidden (CLAUDE.md, PITFALLS §12). ThemeProvider is itself
// "use client" — that's the composition pattern: RSC renders ThemeProvider as
// a child.
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

export const metadata = {
  title: "PLACEHOLDER_SITE_TITLE",
  description: "PLACEHOLDER_SITE_DESCRIPTION",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning is REQUIRED — next-themes' blocking script
    // mutates <html> before hydration (sets class="dark" if dark is active).
    // Without the prop, React would warn on every page load. ONE LEVEL DEEP
    // ONLY (per next-themes docs + UI-SPEC §"Screen reader considerations").
    // Descendants still warn on real mismatches.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
