// Phase 1 proof-of-life. RSC. Replaced by Phase 3 layout shell + Phase 4 sections.
// NO "use client" — page-level client directive is a hard reject (CLAUDE.md).
// Imports ThemeToggle (which is "use client") — RSC composing with a client leaf
// is the canonical pattern.
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-text-primary font-sans px-6 md:px-16 py-12">
      <header className="flex items-center justify-between mb-12">
        <span className="font-mono text-mono-sm text-text-secondary">PLACEHOLDER_SITE_TITLE</span>
        <ThemeToggle />
      </header>
      <h1 className="text-display font-extrabold tracking-tight text-text-primary">
        PLACEHOLDER_NAME
      </h1>
      <p className="mt-4 text-body text-text-secondary max-w-prose">PLACEHOLDER_TAGLINE</p>
    </main>
  );
}
