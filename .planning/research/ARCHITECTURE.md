# Architecture Research

**Domain:** Next.js personal portfolio site (software engineer, 3–4 flagship case studies)
**Researched:** 2026-04-21
**Confidence:** HIGH (App Router patterns, data layer, server/client split are Context7-verifiable and confirmed across multiple 2025/2026 sources. Content-collections library choice is MEDIUM — a clear front-runner exists but alternatives are viable.)

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                   BUILD TIME  (next build)                           │
├──────────────────────────────────────────────────────────────────────┤
│  /content/projects/*.mdx ──┐                                         │
│  /data/site.ts ────────────┤                                         │
│  /data/skills.ts ──────────┼──► Content Loader ──► Typed Data        │
│  /data/socials.ts ─────────┤     (Zod validation)   (TS objects)     │
│  /data/projects/meta.ts ───┘                                         │
│                                          │                           │
│                                          ▼                           │
│                              generateStaticParams                    │
│                              generateMetadata                        │
│                                          │                           │
│                                          ▼                           │
│                              Static HTML + OG PNGs                   │
├──────────────────────────────────────────────────────────────────────┤
│                   REQUEST TIME  (browser)                            │
├──────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐         │
│  │  RootLayout (RSC)                                       │         │
│  │   ├── ThemeProvider (Client — next-themes)              │         │
│  │   │    └── Nav (Client — scroll/toggle state)           │         │
│  │   ├── <main>  page.tsx (RSC — reads /data)              │         │
│  │   │    ├── Hero         (RSC)                           │         │
│  │   │    ├── About        (RSC)                           │         │
│  │   │    ├── Skills       (RSC)                           │         │
│  │   │    ├── Projects     (RSC — map over meta.ts)        │         │
│  │   │    └── Contact      (RSC)                           │         │
│  │   └── Footer (RSC)                                      │         │
│  └─────────────────────────────────────────────────────────┘         │
│                                                                      │
│  /projects/[slug]/page.tsx (RSC)                                     │
│   └── MDX body rendered via @next/mdx + custom components            │
├──────────────────────────────────────────────────────────────────────┤
│                   STATIC ASSETS                                      │
│  /public/                                                            │
│   ├── resume.pdf                                                     │
│   ├── images/projects/*.{png,jpg,webp}                               │
│   └── favicon.svg, icon.png, apple-icon.png                          │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `app/layout.tsx` | Root HTML shell, font loading, theme provider mount, global metadata defaults | RSC wrapping a single `<ThemeProvider>` client component |
| `app/page.tsx` | Home — composes Hero, About, Skills, Projects list, Contact sections | RSC that imports typed data from `/data` and renders section components |
| `app/projects/[slug]/page.tsx` | Dynamic case-study page per project | RSC + `generateStaticParams` + `generateMetadata`; imports MDX body |
| `app/opengraph-image.tsx` + route-level `opengraph-image.tsx` | Dynamic social cards | `ImageResponse` from `next/og` |
| `components/ui/*` | Primitive, reusable UI (Button, Card, Badge, Tag, ThemeToggle) | Mostly RSC; `ThemeToggle` is `"use client"` |
| `components/sections/*` | Page-level composition blocks (Hero, About, Skills, ProjectCard, ContactLinks) | RSC; receive typed data as props |
| `components/layout/*` | Nav, Footer, Container | Nav is `"use client"` (mobile menu, active-section scroll); Footer is RSC |
| `components/mdx/*` | Custom MDX renderers (CodeBlock, Image, Callout) | RSC; passed to MDXRemote/MDX compiler |
| `lib/content.ts` | Loads + validates `/data` and MDX frontmatter; single source of truth for "get all projects" / "get project by slug" | Server-only module (`import "server-only"`) with Zod schemas |
| `lib/theme.ts` | Shared theme helpers (if any) + token constants | Pure TS (works on server + client) |
| `data/*` | **The single place placeholder content lives.** Hero text, about bio, skill groups, project metadata, socials | Typed TS objects (default export or named exports) |
| `content/projects/*.mdx` | Long-form project case-study body | MDX files with Zod-validated frontmatter |

## Recommended Project Structure

```
portfolio/
├── app/                              # Next.js App Router (RSC by default)
│   ├── layout.tsx                    # Root layout: <html>, fonts, ThemeProvider
│   ├── page.tsx                      # Home — single-page scroll composition
│   ├── not-found.tsx                 # 404 page
│   ├── robots.ts                     # Static robots.txt
│   ├── sitemap.ts                    # Static sitemap generation
│   ├── opengraph-image.tsx           # Default OG card (home)
│   ├── icon.tsx / favicon.ico        # Site icons
│   └── projects/
│       └── [slug]/
│           ├── page.tsx              # Case-study page (RSC)
│           └── opengraph-image.tsx   # Per-project OG card (dynamic)
│
├── components/
│   ├── ui/                           # Primitives (Button, Card, Badge, Tag)
│   ├── sections/                     # Page sections (Hero, About, Skills,
│   │                                 #   ProjectCard, ProjectsList, Contact)
│   ├── layout/                       # Nav, Footer, Container, ThemeToggle
│   │   ├── nav.tsx                   # "use client" — mobile menu state
│   │   ├── theme-toggle.tsx          # "use client" — useTheme() from next-themes
│   │   └── footer.tsx                # RSC
│   ├── mdx/                          # Custom MDX component overrides
│   └── providers/
│       └── theme-provider.tsx        # "use client" wrapping next-themes
│
├── content/
│   └── projects/
│       ├── project-one.mdx           # Case-study long-form body
│       ├── project-two.mdx
│       ├── project-three.mdx
│       └── project-four.mdx
│
├── data/                             # ← THE SINGLE CONTENT SWAP POINT
│   ├── site.ts                       # Site-level: name, title, tagline, email
│   ├── hero.ts                       # Hero copy: headline, subhead, CTAs
│   ├── about.ts                      # Bio paragraphs, location, availability
│   ├── skills.ts                     # Skill groups: [{category, items[]}]
│   ├── socials.ts                    # GitHub/LinkedIn/email/etc. links
│   ├── resume.ts                     # Resume file path + download label
│   └── projects/
│       ├── index.ts                  # Exports ordered list of project meta
│       └── schema.ts                 # Zod schema for project metadata
│
├── lib/
│   ├── content.ts                    # MDX loader (getAllProjects, getProject)
│   ├── metadata.ts                   # buildMetadata() helper for pages
│   ├── cn.ts                         # Tailwind class merge helper
│   └── fonts.ts                      # next/font declarations
│
├── styles/
│   └── globals.css                   # Tailwind v4 @import + @theme tokens
│
├── public/
│   ├── resume.pdf                    # Downloadable resume (placeholder)
│   ├── images/
│   │   ├── projects/                 # Case-study screenshots
│   │   └── avatar.jpg                # Profile image
│   └── og/                           # Static OG fallback images (optional)
│
├── next.config.mjs                   # MDX plugin config
├── tsconfig.json                     # Path aliases (@/components, @/data, @/lib)
└── package.json
```

### Structure Rationale

- **`app/` stays thin.** Routes compose section components; they don't contain business logic or content. A page file should be ~30 lines: import data, render sections.
- **`components/` split into `ui/` / `sections/` / `layout/` / `mdx/`.** Atomic Design is overkill for a 4-project portfolio; feature-first is overkill because there's effectively one feature. The ui/sections/layout split maps directly to how visitors experience the page.
- **`content/projects/*.mdx` is intentionally separate from `data/`.** MDX files hold prose and rich formatting; `data/projects/index.ts` holds structured metadata (title, summary, tech, dates, links). This lets the projects list on the home page render without compiling MDX, and keeps the swap surface minimal when updating the card grid.
- **`data/` is flat and typed.** Every placeholder string lives here. Each file is a narrow, single-purpose module so the "swap real content" moment is `git grep TODO data/` → open 6 files → done.
- **`lib/` is server-side by default.** `lib/content.ts` should include `import "server-only"` to guarantee MDX/filesystem code never ships to the browser.
- **`public/` images are colocated by purpose.** `public/images/projects/{slug}/*` makes it obvious which screenshots belong to which case study and simplifies cleanup when projects change.

## Architectural Patterns

### Pattern 1: Typed Data Modules (the "swap point")

**What:** Every placeholder piece of content is a named export from a small, typed TS file in `/data`. Pages/components import these exports; they never hard-code copy.

**When to use:** Always. This is the entire content-swap story.

**Trade-offs:**
- Pro: One-file-per-topic edit to go live. `git diff data/` shows every real-content change in one place.
- Pro: TypeScript catches drift — rename a field, the compiler lists every call site.
- Pro: Optional Zod validation catches runtime shape errors.
- Con: Very long prose (case-study bodies) doesn't fit well in TS — that's why MDX exists for project bodies.

**Example:**
```typescript
// data/site.ts
export const site = {
  name: "PLACEHOLDER_NAME",           // ← swap to real name
  title: "Software Engineer",
  tagline: "Building thoughtful web software.",
  email: "placeholder@example.com",
  url: "https://example.com",
} as const;

// data/projects/index.ts
import type { ProjectMeta } from "./schema";
export const projects: ProjectMeta[] = [
  {
    slug: "project-one",
    title: "Placeholder Project One",
    summary: "One-sentence hook about the project.",
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    year: 2025,
    repo: "https://github.com/placeholder/project-one",
    demo: "https://placeholder.example.com",
    cover: "/images/projects/project-one/cover.png",
    featured: true,
  },
  // ... 3 more
];

// app/page.tsx (RSC — imports data, composes sections)
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { Hero, Projects } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Hero name={site.name} tagline={site.tagline} />
      <Projects items={projects} />
    </>
  );
}
```

### Pattern 2: MDX for Case-Study Bodies, TS for Metadata

**What:** Each project has a row in `data/projects/index.ts` (structured fields) and a matching `content/projects/{slug}.mdx` file (prose body). The `[slug]` route joins them: metadata from TS drives the header/hero; MDX renders the body.

**When to use:** When content has both structured fields (title, tech list, links) and free-form prose (narrative, screenshots, code blocks). This is the standard pattern for portfolio case studies.

**Trade-offs:**
- Pro: Structured fields stay query-friendly (filter, sort, featured flag).
- Pro: MDX body gets full React component access (custom `<Screenshot>`, `<CodeBlock>`).
- Pro: Adding a project = add one row + one file. No database, no CMS.
- Con: Two files per project (acceptable at 4 projects; starts hurting at 50+).
- Con: Must keep `slug` in sync between TS row and MDX filename (Zod validation at load time catches drift).

**Example:**
```typescript
// lib/content.ts
import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { projects } from "@/data/projects";
import { projectSchema } from "@/data/projects/schema";

export async function getAllProjects() {
  return projects.map((p) => projectSchema.parse(p));
}

export async function getProject(slug: string) {
  const meta = projects.find((p) => p.slug === slug);
  if (!meta) return null;
  const mdxPath = path.join(process.cwd(), "content/projects", `${slug}.mdx`);
  const source = await fs.readFile(mdxPath, "utf8");
  return { meta: projectSchema.parse(meta), source };
}

// app/projects/[slug]/page.tsx
export async function generateStaticParams() {
  const all = await getAllProjects();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: `${project.meta.title} — ${site.name}`,
    description: project.meta.summary,
    openGraph: { images: [`/projects/${slug}/opengraph-image`] },
  };
}
```

### Pattern 3: Server-First, Client-Islands

**What:** Everything is a Server Component by default. `"use client"` is added only for the smallest possible leaves: theme toggle, nav mobile menu, anything using `onClick`/`useState`/browser APIs.

**When to use:** Always on App Router. This is the 2026 standard.

**Trade-offs:**
- Pro: Minimal JS shipped to browser — ideal for Lighthouse scores, which portfolios are judged on.
- Pro: Data imports (`/data/*.ts`, MDX compile) happen server-side; nothing about content hits the client bundle.
- Pro: Keeps secrets (none here, but future-proof) off the client.
- Con: Requires discipline — a parent with `"use client"` turns its whole subtree into client code. Put the directive at the leaf.

**Example:**
```typescript
// components/layout/theme-toggle.tsx
"use client";
import { useTheme } from "next-themes";
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>toggle</button>;
}

// components/layout/nav.tsx — keep RSC parts as RSC; only the menu toggle is client
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";  // "use client" internally
export function Nav() {            // RSC
  return (
    <nav>
      <a href="/">Home</a>
      <a href="#projects">Projects</a>
      <ThemeToggle />
      <MobileMenu />
    </nav>
  );
}
```

### Pattern 4: Hybrid Routing — Single-Page Home + Multi-Page Case Studies

**What:** Home (`/`) is a single-page scroll with anchor links (`#about`, `#skills`, `#projects`, `#contact`). Each project is a real route (`/projects/{slug}`) statically generated.

**When to use:** Portfolios with 3–4 case studies. Single-page scroll gives the 30-second skim experience recruiters want; real routes for projects give engineers deep-dive URLs that are shareable, indexable, and OG-embeddable.

**Trade-offs:**
- Pro: Best of both — one-scroll pitch + deep-link per project.
- Pro: Each project page gets its own `<title>`, meta description, OG image → optimal SEO/social preview.
- Pro: Anchor nav works without JS; App Router's `<Link href="#id">` handles smooth scroll.
- Con: Anchor-scroll with a sticky nav needs `scroll-padding-top` in CSS to avoid sections hiding under the header.
- Con: "Active section" highlighting in nav requires client-side `IntersectionObserver` — one small client island.

### Pattern 5: Design Tokens via CSS Variables + Tailwind v4 `@theme`

**What:** Define tokens once in `globals.css` using Tailwind v4's `@theme` directive. Dark mode flips a `.dark` class on `<html>` (managed by `next-themes`), overriding the same variables.

**When to use:** Any Tailwind v4 + Next.js project in 2025/2026. This is now the canonical setup.

**Trade-offs:**
- Pro: Tailwind v4 reads CSS variables directly — `bg-background` just works.
- Pro: One place to change the palette. Swap-ready like `/data`.
- Pro: `next-themes` handles SSR-safe flash prevention via `suppressHydrationWarning`.
- Con: Tailwind v4 is a break from v3 (`tailwind.config.ts` gone); older tutorials mislead.

**Example:**
```css
/* styles/globals.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains-mono);
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(0 0% 9%);
  --color-muted: hsl(0 0% 45%);
  --color-accent: hsl(210 100% 50%);
}

.dark {
  --color-background: hsl(0 0% 7%);
  --color-foreground: hsl(0 0% 96%);
  --color-muted: hsl(0 0% 65%);
  --color-accent: hsl(210 100% 65%);
}

html { scroll-behavior: smooth; scroll-padding-top: 4rem; }
```

### Pattern 6: Metadata API with Per-Route Config + Dynamic OG

**What:** Root `layout.tsx` exports a base `metadata` object (site name, default OG). Each route exports its own `metadata` or `generateMetadata`. Dynamic OG images use `opengraph-image.tsx` colocated next to `page.tsx`.

**When to use:** Always. This is the App Router standard and replaces the old `next/head` approach entirely.

**Example:**
```typescript
// app/layout.tsx
import { site } from "@/data/site";
export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s — ${site.name}` },
  description: site.tagline,
  openGraph: { type: "website", siteName: site.name },
};

// app/projects/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OG({ params }) {
  const project = await getProject(params.slug);
  return new ImageResponse(
    <div style={{ /* flex layout with project.meta.title */ }}>
      {project.meta.title}
    </div>,
    size
  );
}
```

## Data Flow

### Request Flow (build + render)

```
Build time:
  data/*.ts  ─┐
              ├─► lib/content.ts (Zod validate)  ─► generateStaticParams
  content/*.mdx ┘                                ─► generateMetadata
                                                 ─► Static HTML per route
                                                 ─► Static OG PNG per route

Request time (browser GETs /):
  CDN  ─►  static HTML  ─►  hydrate ThemeProvider + Nav + ThemeToggle
                                    (client islands only)

Request time (browser GETs /projects/project-one):
  CDN  ─►  static HTML (prerendered MDX)  ─►  hydrate same client islands
```

### State Management

Deliberately minimal — no global store needed.

```
next-themes (localStorage + <html class="dark">)
    ↓ (useTheme hook, client only)
ThemeToggle component

React useState (local, per-island)
    ↓
Nav mobile menu open/closed
```

No Redux. No Zustand. No Context beyond `ThemeProvider`. A portfolio doesn't need it; adding it signals poor taste to the engineer audience reviewing the code.

### Key Data Flows

1. **Home page render:** `app/page.tsx` (RSC) imports `site`, `hero`, `about`, `skills`, `projects`, `socials` from `/data`. Passes them as props into section components. All flat, all sync, all compiled away at build time. Zero runtime data fetching.

2. **Project detail page render:** `app/projects/[slug]/page.tsx` calls `getProject(slug)` in `lib/content.ts`, which reads `data/projects/index.ts` for metadata and `content/projects/{slug}.mdx` from disk. Zod validates both. Body renders via MDX compiler. `generateStaticParams` pre-builds one HTML file per project.

3. **Placeholder-to-real content swap (THE critical flow):**
   ```
   Engineer has real content ready.
   Step 1: Open data/site.ts        → replace name, email, URL
   Step 2: Open data/hero.ts        → replace headline, subhead
   Step 3: Open data/about.ts       → replace bio paragraphs
   Step 4: Open data/skills.ts      → replace skill groups
   Step 5: Open data/socials.ts     → replace social URLs
   Step 6: Open data/projects/index.ts → replace 4 project rows
   Step 7: Edit content/projects/*.mdx → replace 4 case-study bodies
   Step 8: Drop real resume.pdf in  /public/
   Step 9: Drop real screenshots in /public/images/projects/{slug}/
   Step 10: git commit; push; deploy.
   ```
   **No JSX edits. No component edits. No scavenger hunt.** `git grep -l "PLACEHOLDER" data/ content/` lists every file needing attention.

4. **Dark mode toggle flow:**
   ```
   User clicks ThemeToggle ("use client")
     → useTheme().setTheme("dark")
     → next-themes writes localStorage + sets class="dark" on <html>
     → CSS variables under .dark take effect
     → All Tailwind utilities re-resolve (no re-render needed)
   ```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 4 projects (now) | Current architecture is ideal. Flat TS data + MDX bodies. |
| 10–20 projects | Still fine. Consider a content-collections library (e.g., `@content-collections/core` or `velite`) to auto-generate the typed project list from MDX frontmatter — eliminates the `data/projects/index.ts` ↔ `content/projects/*.mdx` sync step. |
| 50+ projects / adding blog | Adopt `velite` or `content-collections` fully. Add pagination. Consider moving blog to a `(blog)` route group with its own layout. |
| 200+ content items / multi-author / scheduled publishing | Real CMS territory (Sanity, Contentful, Contentlayer-successor). Out of scope for this project. |

### Scaling Priorities

1. **First bottleneck:** Keeping `data/projects/index.ts` in sync with `content/projects/*.mdx` when project count grows. Mitigation: introduce content-collections to derive the list from frontmatter.
2. **Second bottleneck:** Image weight. Mitigation: `next/image` with proper `sizes` attribute; export originals at 2400px wide and let Next optimize.
3. **Third bottleneck:** Nothing for a long time — this is a static site on a CDN.

## Anti-Patterns

### Anti-Pattern 1: Hard-coding content in JSX

**What people do:** Write the engineer's name, bio, and project copy directly inside component JSX. "I'll extract it later."

**Why it's wrong:** Violates the single-file-swap requirement from PROJECT.md. When real content arrives, "later" means reading every component to find strings. Scavenger hunt.

**Do this instead:** All copy lives in `/data/*.ts`. Components accept it as props or import named exports. Placeholder strings should be visibly placeholder (`PLACEHOLDER_NAME`, `TODO_BIO`) so they're greppable.

### Anti-Pattern 2: `"use client"` at the root

**What people do:** Mark `app/layout.tsx` or a top-level section component `"use client"` because "it's easier" or "I hit a React hook error."

**Why it's wrong:** Cascades client-ness down the tree. Kills RSC benefits. Bloats the bundle. Makes data imports leak to the client.

**Do this instead:** Keep `"use client"` at the leaves (ThemeToggle, MobileMenu). Wrap only what needs interactivity. The `ThemeProvider` can be a thin client component mounted inside an RSC layout.

### Anti-Pattern 3: Client-side data fetching on a static site

**What people do:** `useEffect(() => fetch("/api/projects"))` in a component to load project data.

**Why it's wrong:** The data is static, known at build time, and in the repo. Client fetching adds loading states, flicker, and dependencies for zero benefit.

**Do this instead:** Import from `/data` or `lib/content.ts` in an RSC. Data is embedded in the HTML at build time.

### Anti-Pattern 4: Over-componentizing primitives

**What people do:** Install shadcn/ui and pull in 20 components for a site that uses 3.

**Why it's wrong:** Inflates the repo, muddies which components are actually used, and shadcn's Radix dependency adds weight.

**Do this instead:** If using shadcn, copy only the components actually rendered (Button, maybe Card). Plain JSX + Tailwind is often enough for a portfolio — it's a static marketing site, not an app.

### Anti-Pattern 5: Mixing MDX compilation strategies

**What people do:** Install `next-mdx-remote` + `@next/mdx` + `contentlayer` "just in case."

**Why it's wrong:** Each ships its own MDX runtime; competing pipelines cause build slowness and confusion. `next-mdx-remote` is poorly maintained as of 2025.

**Do this instead:** Pick one. Recommendation: **`@next/mdx`** for simplicity (imports `.mdx` as components; no runtime shipped when used in RSC). If project count grows beyond ~20, adopt `content-collections` or `velite` — but not both.

### Anti-Pattern 6: Flash of wrong theme on load (FOUC)

**What people do:** Implement dark mode with a `useEffect` that reads `localStorage` and flips the class after mount.

**Why it's wrong:** Light-themed HTML flashes before the effect runs. Looks broken.

**Do this instead:** Use `next-themes` — it injects a blocking inline script that sets the class before hydration. Add `suppressHydrationWarning` to `<html>` in `layout.tsx`.

### Anti-Pattern 7: Ignoring `scroll-padding-top` with a sticky nav

**What people do:** Build anchor-based section nav with `position: sticky` header, then clicking `#about` scrolls the About heading directly under the header, where it's invisible.

**Why it's wrong:** Hidden content. Looks like navigation is broken.

**Do this instead:** Set `html { scroll-padding-top: 4rem; }` (or match nav height) in `globals.css`. Optionally `scroll-behavior: smooth;`.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Vercel / Netlify | `git push` → build → deploy | Vercel is the default; Netlify Runtime v5 handles Next.js well in 2025. Either works. |
| GitHub / LinkedIn / email | Static links in `data/socials.ts` | No API integration needed. |
| Resume PDF | Static file in `public/resume.pdf` | Link directly from `data/resume.ts`. |
| Analytics (deferred) | Vercel Analytics or Plausible, drop-in later | Out of scope per PROJECT.md. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `data/` → `app/` components | Direct TS import | Server-side; compiled away at build. |
| `content/` MDX → `app/projects/[slug]/` | Via `lib/content.ts` (filesystem read + Zod parse) | Marked `import "server-only"`. |
| `ThemeProvider` → `ThemeToggle` | React Context (via `next-themes`) | Only client boundary; single island. |
| `app/` → `public/` assets | Direct URL strings (`/images/...`, `/resume.pdf`) | `next/image` handles optimization. |

## Build Order Implications (for the roadmap)

The architecture has a natural dependency graph. Violating it causes rework:

1. **Tokens & theme first.** `globals.css` with `@theme` + `next-themes` wrapper must exist before any component, because components will use token-driven utilities (`bg-background`, `text-foreground`). Building components first and retrofitting tokens means rewriting every component.
2. **Data model second.** Schemas (`data/projects/schema.ts`) and placeholder data files (`data/*.ts`) come before section components — components should be written against real typed data shapes, not anonymous props.
3. **Layout shell third.** `app/layout.tsx` + Nav + Footer + ThemeToggle is the skeleton everything mounts into.
4. **Section components fourth.** Hero, About, Skills, Projects list, Contact — each takes typed data as props. Build once, reuse if the page structure ever changes.
5. **Home page composition fifth.** Wire sections together in `app/page.tsx`.
6. **Project detail route last.** `[slug]/page.tsx`, MDX loader, `generateStaticParams`, per-project OG images. This requires `lib/content.ts` + at least one real MDX file, which requires the data schema from step 2.
7. **Metadata, sitemap, robots, static OG.** Can be layered on after content renders correctly.
8. **Deployment verification last.** Vercel/Netlify deploy preview, Lighthouse pass.

Short version: **theme → data → shell → sections → home → project pages → SEO → deploy**.

## Sources

- [Next.js Docs — Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) — HIGH
- [Next.js Docs — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — HIGH
- [Next.js Docs — Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — HIGH
- [Next.js Docs — generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — HIGH
- [Next.js Docs — Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) — HIGH
- [Next.js Docs — MDX Guide (App Router)](https://nextjs.org/docs/app/guides/mdx) — HIGH
- [Next.js Docs — Image Optimization](https://nextjs.org/docs/app/getting-started/images) — HIGH
- [Tailwind CSS — Dark Mode](https://tailwindcss.com/docs/dark-mode) — HIGH
- [shadcn/ui — Tailwind v4 setup](https://ui.shadcn.com/docs/tailwind-v4) — HIGH
- [Vercel — OG Image Generation](https://vercel.com/docs/og-image-generation) — HIGH
- [Next.js Architecture in 2026 — Server-First, Client-Islands](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router) — MEDIUM
- [Best Practices for Organizing Your Next.js 15 (2025)](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji) — MEDIUM
- [Dynamic Metadata Done Right — Vercel Academy](https://vercel.com/academy/nextjs-foundations/dynamic-metadata-done-right) — HIGH
- [Theme colors with Tailwind CSS v4 and next-themes](https://medium.com/@kevstrosky/theme-colors-with-tailwind-css-v4-0-and-next-themes-dark-light-custom-mode-36dca1e20419) — MEDIUM
- [Building a blog with Next.js App Router and MDX — Alex Chan](https://www.alexchantastic.com/building-a-blog-with-next-and-mdx) — MEDIUM
- [Content-collections + MDX (supastarter)](https://supastarter.dev/dev-tips/2025-08-26-content-collections) — MEDIUM

---
*Architecture research for: Next.js personal portfolio site*
*Researched: 2026-04-21*
