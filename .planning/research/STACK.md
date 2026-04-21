# Stack Research

**Domain:** Personal portfolio website (software engineer) — Next.js + React + Vercel/Netlify (pre-committed)
**Researched:** 2026-04-21
**Overall confidence:** HIGH

This research is prescriptive. Each recommendation is tied back to the PROJECT.md constraints:
minimal / typography-forward aesthetic, mixed audience (recruiter / hiring engineer / non-technical
client), SEO reach, Lighthouse-grade performance, placeholder content that swaps cleanly later,
and subtle (not showcase) animation. Out-of-scope per PROJECT.md and explicitly *not* researched
here: CMS integration, blog pipeline, analytics backend, auth, i18n, heavy animation/3D.

All npm versions below were verified live via `npm view <pkg> version` on 2026-04-21 — they are
the actual `latest` tags, not training-data guesses.

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.2.4 | Framework (App Router, SSG/ISR, Image, Metadata API, OG) | Pre-committed in PROJECT.md. v15→v16 line is stable; App Router is the default and the whole SEO/OG/image-optimization story is built around it. The 3–4 case-study pages are a textbook SSG use case. |
| React | 19.2.5 | UI library | Pairs with Next 16; Server Components + `useActionState` are the current contact-form idiom. No reason to pin to React 18 for a greenfield build. |
| TypeScript | 5.9.2 (strict) | Type safety | **Recommended over plain JS.** For a portfolio judged partly on craft, TS is the default signal — hiring engineers will look at the repo. The data-driven structure (projects in `/data`) benefits massively from typed schemas so content edits don't silently break the UI. Cost is ~zero with `create-next-app`. |
| Tailwind CSS | 4.2.3 | Styling | Typography-forward sites live and die on consistent spacing/scale. Tailwind v4 is CSS-first (`@theme` in CSS, no `tailwind.config.js`), ~70% smaller output than v3, and is what every current Next.js starter (and shadcn/ui) ships with. Utility-first keeps the design restrained by making "one-off flourish" inconvenient. |
| Node.js | 20 LTS or 22 LTS | Runtime | Next 16 requires ≥ 20.9. Vercel defaults to 22; Netlify supports both. Use whichever your local `nvm` prefers. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next-themes` | 0.4.6 | Dark-mode toggle with persisted preference, no FOUC | **Required.** PROJECT.md explicitly calls for persisted dark-mode toggle. `next-themes` injects a pre-hydration script so the theme is correct on first paint — solves the flash problem cleanly in the App Router. Ships in ~1 KB. |
| `@content-collections/core` + `@content-collections/next` + `@content-collections/mdx` | 0.15.0 / 0.2.11 / 0.2.2 | Type-safe MDX for case studies | Project needs MDX for project write-ups (screenshots + prose + code). Contentlayer is functionally abandoned post-Netlify acquisition and breaks on Next 15+. Content Collections is the actively maintained successor, Zod-based schemas, works with App Router + RSC, and gives you typed imports for every project. |
| `geist` | 1.7.0 | Primary font (Geist Sans + Geist Mono) | Self-hosted via npm package — no Google Fonts request, no CLS, loads via `next/font`. Geist is designed by Vercel specifically for UI-dense technical content, and the paired mono is exactly the "monospace accent for code/tags" the aesthetic calls for. One family gives you both body and mono → fewer weights to ship. |
| `lucide-react` | 1.8.0 | Icon set | Feather-Icons fork, 1,500+ icons, per-icon tree-shaking. Single-stroke geometric style is the right visual register for a minimal/typography-forward aesthetic. This is the icon set shadcn/ui standardized on, and it's the default in most 2026 Next starters. |
| `motion` | 12.38.0 | Subtle animation (fade/slide/stagger) | **Use `motion/react`, not the old `framer-motion` package.** In mid-2025 Framer Motion became its own project and renamed the npm package to `motion`. For a *subtle* animation brief (hero fade-in, reveal-on-scroll, theme toggle crossfade) this is more than enough and is what most Next.js portfolios standardize on. See "Alternatives Considered" for Motion One — it's lighter but overkill of a downgrade for the few React animation primitives we need. |
| `zod` | 4.3.6 | Schema validation (project data + contact form) | Pairs with Content Collections (same schemas) and React Hook Form (`zodResolver`). Single source of truth for shape of project data and form payloads. v4 is current stable. |
| `react-hook-form` | 7.73.1 | Contact form state | Ergonomic, uncontrolled-by-default (fewer re-renders), tiny. Works with Server Actions via `action={...}` + `useActionState`. |
| `@hookform/resolvers` | 5.2.2 | Bridges Zod schemas to RHF | Same schema validates on client (fast feedback) and in the Server Action (trust boundary). |
| `resend` | 6.12.2 | Send the contact email from a Server Action | React-first email API. Write the email body as a React component (`@react-email/components`), deliverability is better than `nodemailer` over a generic SMTP, free tier (3k/mo, 100/day) is more than a portfolio will ever need. See "Stack Patterns by Variant" for the static `mailto:` alternative. |
| `sharp` | 0.34.5 | Image optimization engine for `next/image` | Auto-installed on Vercel. **On Netlify, install explicitly.** Without it, Next falls back to slow WASM. Required for the AVIF/WebP pipeline that hits the Lighthouse scores PROJECT.md calls out. |
| `@vercel/og` | (bundled in Next) | Dynamic OG images for social cards | Use the file-convention route: `app/opengraph-image.tsx` + per-project `app/projects/[slug]/opengraph-image.tsx`. No extra install — Next ships `ImageResponse` from `next/og`. Matches the "per-page metadata, OG / Twitter cards" requirement. |
| `react-wrap-balancer` | optional | Visually balance headline wrapping | Typography-forward sites want headlines that don't end with a widowed single word. 1 KB. Skip if the design works without it. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Biome 2.4.12 | Lint + format (ESLint + Prettier replacement) | **Recommended over ESLint + Prettier for this project.** Single binary, single config (`biome.json`), ~10–25× faster, written in Rust. v2 closed most of the type-aware-rules gap. For a greenfield portfolio with no plugin ecosystem dependency, Biome is the better DX. Caveat below. |
| `eslint-config-next` (fallback) | Next.js–specific lint rules | If you want `@next/next` rules (`no-html-link-for-pages`, `no-img-element`) and the React Hooks exhaustive-deps rule out of the box — Biome doesn't have plugin parity here. Hybrid setup: Biome for format + base lint, ESLint only for `next` + `react-hooks` rules. Pragmatic default for this project is Biome-only; add ESLint back only if you hit something Biome misses. |
| Vitest 4.1.4 + `@testing-library/react` 16.3.2 + `jsdom` | Unit / component tests | **Use Vitest, not Jest.** ESM-native, no ts-jest dance, ~10× faster, API-compatible with Jest. Next.js has first-party docs for the Vitest + RTL combo. Known limitation: async Server Components aren't testable in Vitest yet — cover those with Playwright instead. |
| Playwright 1.59.1 | E2E smoke tests (nav, dark-mode toggle, contact form, resume download) | A portfolio needs maybe 5 E2E tests total. Playwright covers all three engines (WebKit = real iOS Safari, which recruiters-on-mobile will use). Next.js has first-party Playwright docs. |
| `@axe-core/playwright` | Accessibility assertions in E2E | PROJECT.md calls out a11y as table stakes. One Playwright assertion per page catches regressions essentially for free. |
| `@next/bundle-analyzer` | Keep JS payload small | PROJECT.md: "JS payload should be small." Wire it into `next.config.ts` behind `ANALYZE=true`. Catch the day someone accidentally imports `react-icons` (which would pull in 30 MB). |
| Husky 9.x + lint-staged 15.x | Pre-commit gate (biome check, tsc --noEmit) | Optional but cheap; keeps the repo honest while placeholder content is still churning. |
| GitHub Actions | CI: typecheck, Biome, Vitest, build, Playwright | Vercel and Netlify both run their own build on push — use GHA only for the stuff the platform doesn't (tests, typecheck). Keep it one workflow file. |

## Installation

```bash
# Scaffold (TypeScript, Tailwind v4, ESLint flag off — we're using Biome)
npx create-next-app@16 portfolio \
  --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint

cd portfolio

# Core runtime deps
npm install next-themes geist lucide-react motion zod react-hook-form @hookform/resolvers \
            resend react-wrap-balancer

# MDX / content
npm install @content-collections/core @content-collections/next @content-collections/mdx

# Image optimization (on Netlify; Vercel installs automatically)
npm install sharp

# Dev deps
npm install -D @biomejs/biome \
               vitest @vitejs/plugin-react jsdom \
               @testing-library/react @testing-library/jest-dom @testing-library/user-event \
               @playwright/test @axe-core/playwright \
               @next/bundle-analyzer \
               husky lint-staged

# Initialize Biome
npx biome init

# Install Playwright browsers (one-time, ~300 MB)
npx playwright install --with-deps
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Tailwind CSS v4 | CSS Modules + hand-rolled design tokens | If the engineer objects to utility classes in JSX. Works fine for a site this size and arguably matches the "typography-forward, nothing bold" spirit. Downside: more hand-written CSS, slower to iterate on spacing. |
| Tailwind CSS v4 | Panda CSS, Vanilla Extract | Both are well-engineered zero-runtime CSS-in-JS. Not worth the learning curve for a 5-page portfolio; pick only if you already know them. |
| Content Collections | Native `@next/mdx` | Simpler — no build step, no schema. Use if you have ≤ 2 projects and don't care about typed frontmatter. With 3–4 case studies and the "placeholder → real content swap" requirement, Content Collections' Zod schemas earn their keep. |
| Content Collections | Fumadocs MDX | If the portfolio grows into a doc-style site with ToCs, search, versioned content. Overkill for v1. |
| `motion/react` | Motion One (`motion` package's WAAPI core, `animate()`) | Lighter (~4 KB) but you lose React-idiomatic `<motion.div>`, `AnimatePresence`, layout animations. For a portfolio that might later want a shared-layout transition on the project card → detail page, the React bindings are worth the ~15 KB cost. |
| `motion/react` | CSS `@keyframes` + `view-transition-name` | The absolute lightest option. Works for hero fade-in and route transitions via the View Transitions API. Choose this if you want to ship zero animation JS and are comfortable handling reduced-motion yourself. Valid minimalist choice. |
| Resend + Server Action | Static `mailto:` link | Zero backend, zero failure surface. Fine if the engineer is OK with visitors using their own mail client. Downside: recruiters on corporate laptops with no `mail://` handler get a broken experience. |
| Resend + Server Action | Formspree / Forminit / Netlify Forms | No code. Formspree and Forminit both have free tiers. Netlify Forms is literally a `data-netlify` attribute on Netlify deploys. Use if you want to skip Server Actions entirely. Downside: third-party branding in emails, no control over validation/UX, spam story is weaker. |
| Vercel (deploy) | Netlify | Netlify's free tier allows commercial use (Vercel's doesn't — see PITFALLS.md). If this portfolio is framed as freelance marketing that lists a rate card, Netlify Hobby is the legally cleaner choice. Otherwise Vercel wins on Next-native integration and 20× more build minutes. |
| Vercel (deploy) | Cloudflare Pages | Global edge network, very generous free tier, but Next.js support requires the `@cloudflare/next-on-pages` adapter and some Next features (ISR, Image Optimization) have rough edges. Pick only if you're already a Cloudflare shop. |
| Biome | ESLint 9 (flat config) + Prettier 3 | More mature plugin ecosystem, `eslint-plugin-tailwindcss` enforces class order. Slower. Choose if you want `eslint-plugin-jsx-a11y` enforcement or Tailwind class sorting — both of which Biome v2 doesn't cover yet. |
| Vitest | Jest 30 | Stable, battle-tested, every article on the internet uses it. Choose only if you have existing Jest muscle memory. |
| Playwright | Cypress 15 | Better DX for debugging a single test interactively. Single-browser (Chromium), no real-Safari story. Not the right pick for a portfolio that needs to look right on iOS. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `styled-components`, `emotion`, `stitches` | Runtime CSS-in-JS is slow in React 19 (`useInsertionEffect` pushback), incompatible with Server Components by default, and adds client JS the portfolio doesn't need. Stitches is unmaintained. | Tailwind v4 or CSS Modules |
| `framer-motion` (old package name) | Renamed to `motion` mid-2025. The old package still resolves but won't get React 19 / Next 16 compatibility fixes. | `motion` (import from `motion/react`) |
| Contentlayer / `next-contentlayer` | Functionally unmaintained since Stackbit's Netlify acquisition. Does not install cleanly on Next 15+. | `@content-collections/*` |
| `react-icons` | Imports every icon as a module; tree-shaking is shape-dependent and most bundlers only partially optimize it. Routinely adds hundreds of KB to bundles. | `lucide-react` (single-component-per-icon, shakes perfectly) |
| Google Fonts `<link>` tags | Third-party request, privacy-hostile (GDPR issue flagged by German courts 2022+), and blocks LCP. | `next/font` with the self-hosted `geist` package or `next/font/google` (which proxies and self-hosts Google's fonts at build time) |
| Nodemailer + raw SMTP | Deliverability is poor from serverless origins (shared IPs, no DKIM). Vercel's serverless functions also can't keep TCP connections open cleanly. | Resend (or Postmark / SendGrid) |
| Redux / Zustand / any client store | Nothing on a portfolio needs global state. Theme is handled by `next-themes` (context), forms by React Hook Form (local). | Plain React state + URL params |
| Chakra UI, MUI, Mantine, Ant Design | Full component kits with their own design language fight the "minimal / typography-forward" aesthetic and ship large runtimes. | Tailwind + hand-composed components (or shadcn/ui copy-paste primitives if you want button/dialog templates) |
| Storybook | Useful for design-system work. For a 5-page portfolio with ~15 components, it's overhead you maintain instead of the site itself. | Skip; rely on the live site during dev |
| `gatsby-*` anything | Gatsby is effectively in maintenance. | Next.js (already chosen) |
| `<img>` tags for project screenshots | No lazy loading, no AVIF/WebP, no CLS prevention, no responsive `srcset`. Direct hit on Lighthouse. | `next/image` with `sharp` |

## Stack Patterns by Variant

**If the engineer chooses Vercel deployment (default):**
- `sharp` installs automatically — don't add to `package.json` (it just bloats node_modules locally).
- Use `@vercel/og` via `next/og` for social cards. No setup.
- Contact form Server Action uses a Vercel Function. Put `RESEND_API_KEY` in project env vars.
- Hobby plan — **do not run commercial / paid work** on this. Vercel's ToS restricts Hobby to non-commercial. If this portfolio will list a rate card or advertise freelance services, either pay for Pro (~$20/mo) or deploy on Netlify.

**If the engineer chooses Netlify deployment:**
- `npm install sharp` explicitly (Netlify doesn't auto-install it the way Vercel does).
- `@vercel/og` still works via `next/og` — it's not actually Vercel-specific at runtime, the module is bundled with Next.js.
- Contact form: either Server Action → Resend (as designed) *or* swap to Netlify Forms (`<form data-netlify="true">`) if you want zero backend.
- Free tier allows commercial use — safe for a portfolio that advertises freelance.

**If the engineer wants zero backend (no Server Action):**
- Replace Resend + Server Action with: `mailto:` link in the header/footer, plus socials (GitHub, LinkedIn, X) in the contact section.
- Skip `resend`, `react-hook-form`, `@hookform/resolvers`, and the contact-form Zod schema.
- Trade-off: less polished, but genuinely bulletproof. Recruiters on corporate machines without a mail client configured will be frustrated — LinkedIn link mitigates this.

**If the engineer wants the absolute minimum animation:**
- Drop `motion` entirely.
- Use Tailwind's built-in `animate-in` utilities (via `tailwindcss-animate` plugin or v4's native animation utilities) for the 2–3 entrance animations needed.
- Use CSS `view-transition-name` + `@starting-style` for route transitions.
- Saves ~15 KB and one dependency. Valid minimalist choice.

**If content grows to ≥ 8 case studies:**
- Current Content Collections setup still scales fine — schemas + RSC are linear in page count.
- At that point, consider an explicit tags/filter UI on a `/projects` index page. But this is a v2 concern, not now.

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| next@16.2 | react@19.x, react-dom@19.x | Next 16 requires React 19. Don't downgrade React. |
| next@16.2 | Node ≥ 20.9 | Prefer Node 22 LTS locally and on CI. |
| tailwindcss@4 | `@tailwindcss/postcss` (separate package), `@tailwindcss/vite` | v4 config is now CSS-first via `@theme`. `tailwind.config.js` is not needed (but `@config` directive still works if you need JS plugins). |
| `motion@12` | react@18 and react@19 | Use import `motion/react`. The old `framer-motion` package is deprecated — do not mix both. |
| `@content-collections/next@0.2` | next@14, 15, 16 | Add the `withContentCollections` wrapper to `next.config.ts`. |
| `next-themes@0.4` | next App Router, react@19 | Set `<ThemeProvider attribute="class">` to work with Tailwind v4's `dark:` variant. Use `suppressHydrationWarning` on `<html>`. |
| `geist@1.7` | `next/font/local` pipeline | Import as `import { GeistSans } from 'geist/font/sans'` — the npm package handles self-hosting and CSS variables for you. |
| `vitest@4` | next@16 via `next/jest` → **not yet**. Use `@vitejs/plugin-react` + a tsconfig paths plugin | Next.js docs recommend the plain Vitest+RTL setup for the App Router. Don't try to wire `next/jest`. |
| `resend@6` | Node ≥ 20 | Works in both Vercel and Netlify Serverless Functions. Call from a Server Action for CSRF-free submission. |
| `sharp@0.34` | Node ≥ 18.17 | On macOS Apple Silicon, `npm install` pulls the correct prebuilt binary automatically. On Netlify CI, install runs on Linux x64 — also fine. |
| `biome@2.4` | Node ≥ 18 | Install via npm; don't install the optional native binaries separately. |

## Typography Specifics (minimal / typography-forward aesthetic)

Because PROJECT.md calls out typography so heavily, locking this in now:

- **Body + headings:** Geist Sans (via `geist/font/sans`). One variable font, covers 100–900. Pairs with Inter-family expectations but is more modern.
- **Monospace accents (code snippets, tags, skill chips, keyboard shortcuts, dates):** Geist Mono (via `geist/font/mono`). Same family, same metrics — prevents the "two unrelated fonts" feel that hurts minimal layouts.
- **Alternative pairing if Geist feels too Vercel-branded:** Inter (body) + JetBrains Mono (accents), both via `next/font/google`. JetBrains Mono has more character at small sizes than Geist Mono; Inter is the default neutral sans of the 2020s.
- **Alternative with more personality:** IBM Plex Sans + IBM Plex Mono — slightly more industrial/engineered feel, 8 weights, works if the engineer wants the site to feel less "default SaaS."
- **Set up as CSS variables:** `--font-sans`, `--font-mono`. Expose via Tailwind v4 `@theme` so `font-mono` and `font-sans` classes Just Work.

Confidence on typography: HIGH for Geist as default, MEDIUM on the alternatives (design preference question, not a technical one — flag for the engineer to override at real-content-swap time).

## TypeScript vs Plain JS — Recommendation

**Use TypeScript, strict mode.** Non-negotiable for this project because:

1. The repo will be public. Hiring engineers will open it. Plain JS in 2026 reads as careless on a developer's own portfolio.
2. The "placeholder content → real content" swap is the entire content strategy. Typed schemas (Content Collections + Zod) catch the moment a real project entry is missing `liveUrl` *at build time*, not at 11 PM on launch night.
3. The Server Action contact form needs identical validation shapes on client and server. Zod + TS is the path of least resistance for that.
4. `create-next-app --typescript` costs you zero extra config.

Strict settings to turn on in `tsconfig.json`:
- `"strict": true`
- `"noUncheckedIndexedAccess": true` (catches `projects[0]` being possibly undefined)
- `"verbatimModuleSyntax": true`

Confidence: HIGH.

## Confidence Per Recommendation

| Recommendation | Confidence | Reason |
|----------------|------------|--------|
| Next.js 16 + React 19 + TS strict | HIGH | Pre-committed, versions verified on npm registry 2026-04-21 |
| Tailwind CSS v4 | HIGH | Current stable; every mainstream Next starter has migrated |
| Content Collections over Contentlayer | HIGH | Contentlayer's maintenance status is public record; CC is actively released (v0.15 shipped recently) |
| `motion` over `framer-motion` (old name) | HIGH | Rename is documented on motion.dev; old package name still installable but not the future |
| Geist as default font | MEDIUM | Best technical fit for the aesthetic, but font choice is a design-preference call the engineer should confirm |
| Biome over ESLint + Prettier | MEDIUM | Biome v2 is solid, but lacks `eslint-plugin-jsx-a11y` equivalent and `eslint-plugin-tailwindcss`. Fallback to ESLint is documented above. |
| Vitest over Jest | HIGH | Next.js first-party docs recommend this combo |
| Playwright for E2E | HIGH | De-facto standard; only option with real Safari for iOS recruiters |
| Resend for contact mail | MEDIUM | Depends on whether engineer wants backend at all; `mailto:` fallback documented |
| Vercel vs Netlify | MEDIUM | Technical tie; the commercial-use clause is the real decider, and that depends on engineer's intent |
| `lucide-react` for icons | HIGH | Bundle-size analysis shows clear win over `react-icons` |
| `next-themes` for dark mode | HIGH | ~2,400 downstream projects; handles FOUC correctly; shadcn recommends it |

## Sources

**Official documentation (HIGH confidence):**
- [Next.js — Getting Started: Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — `ImageResponse`, file-based metadata
- [Next.js — Metadata Files: sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — App Router sitemap convention
- [Next.js — Metadata Files: robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — robots convention
- [Next.js — Testing: Vitest](https://nextjs.org/docs/app/guides/testing/vitest) — first-party Vitest setup
- [Next.js — Testing: Playwright](https://nextjs.org/docs/pages/guides/testing/playwright) — first-party Playwright setup
- [Next.js — Guides: Forms](https://nextjs.org/docs/app/guides/forms) — Server Actions form pattern
- [Next.js — Image Optimization (discussion #66303)](https://github.com/vercel/next.js/discussions/66303) — `sharp` recommendation for production
- [Tailwind CSS v4.0 release post](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, performance numbers
- [Vercel — Image Optimization](https://vercel.com/docs/image-optimization) — Vercel-specific image pipeline
- [Vercel — Open Graph (OG) Image Generation](https://vercel.com/docs/og-image-generation) — `@vercel/og` internals
- [Vercel vs Netlify comparison (Vercel KB)](https://vercel.com/kb/guide/vercel-vs-netlify) — Vercel's own comparison
- [Netlify vs Vercel 2025 (Netlify)](https://www.netlify.com/guides/netlify-vs-vercel/) — Netlify's comparison
- [Resend — Send emails with Next.js](https://resend.com/docs/send-with-nextjs) — Server Action pattern
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) — FOUC-free theme-switching
- [shadcn/ui — Dark Mode (Next.js)](https://ui.shadcn.com/docs/dark-mode/next) — theme provider pattern
- [Motion docs — React](https://motion.dev/docs/react) — post-rename API, import `motion/react`
- [Motion Magazine — Should I use Framer Motion or Motion One?](https://motion.dev/magazine/should-i-use-framer-motion-or-motion-one) — official guidance on which flavor to pick
- [Lucide — React installation](https://lucide.dev/guide/packages/lucide-react) — tree-shakable icon components
- [Biome — Migrate from ESLint and Prettier](https://biomejs.dev/guides/migrate-eslint-prettier/) — official migration
- [Content Collections (Dub blog migration writeup)](https://dub.co/blog/content-collections) — real-world migration from Contentlayer

**npm registry (HIGH confidence — live-queried 2026-04-21):**
- `npm view <pkg> version` for every pinned version above. All numbers in tables are actual `latest` tags as of research date.

**Community / comparison content (MEDIUM confidence — verified against official docs above):**
- [LogRocket — Best React animation libraries for 2026](https://blog.logrocket.com/best-react-animation-libraries/)
- [DEV — Vitest vs Jest for Next.js in 2026](https://dev.to/whoffagents/vitest-vs-jest-for-nextjs-in-2026-setup-speed-and-when-to-switch-224a)
- [PkgPulse — Biome vs ESLint + Prettier 2026](https://www.pkgpulse.com/blog/biome-vs-eslint-prettier-linting-2026)
- [TemperStack — Vercel vs Netlify (April 2026)](https://www.temperstack.com/versus/vercel-vs-netlify/) — commercial-use clause discussion
- [Medium — Codetodeploy — Bundle cost of react-icons vs lucide (2026 Turbopack benchmark)](https://medium.com/codetodeploy/the-hidden-bundle-cost-of-react-icons-why-lucide-wins-in-2026-1ddb74c1a86c)

---
*Stack research for: personal portfolio website, Next.js + React + Vercel/Netlify*
*Researched: 2026-04-21*
