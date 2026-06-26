# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Content style (read before writing any copy)

All written content for the site — marketing copy, docs, blog posts, product pages, changelogs — must follow `.claude/content-style.md`. Read that file before drafting or editing site copy and self-edit against its nine rules. The top three tells to watch hardest: em-dashes (3 per piece max), "X but Y" contrast pairs, and tricolons (A, B, and C lists).

## Project overview

TokenJam is an open-source, OTel-native observability tool for autonomous AI agents, by Metabuilder Labs. This repo is the **website** for [tokenjam.dev](https://tokenjam.dev). The CLI command is `tj`.

The site is **hybrid**:

- **Landing page:** plain static HTML (`public/index.html`, ~2000 lines, all CSS/JS inline). Served as-is at `/`. **Do not modify** without explicit instruction.
- **Blog and docs:** Astro + MDX, generated at build time from `src/content/`. Routes under `/blog/*` and `/docs/*`.
- **Legacy API:** `api/waitlist.js` — Vercel serverless function (Resend audience signup). No UI currently calls it; kept for possible future reuse. Don't delete it.

## Architecture

- **Astro** (static output) for routed pages. `output: 'static'`, `build.format: 'directory'`, `trailingSlash: 'never'` — matches Vercel `cleanUrls: true`.
- **Content collections** under `src/content/blog/` and `src/content/docs/`, schemas in `src/content.config.ts`.
- **Vercel** hosts everything. `api/*.js` are detected as serverless functions independently of the Astro build.

## Development

```
pnpm install
pnpm dev          # Astro dev server on :4321
pnpm build        # writes dist/
pnpm preview      # serves dist/ locally
```

For the legacy API function, `vercel dev` (Vercel CLI) is needed; it requires `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` in `.env.local`.

## Key files

- `public/index.html` — the landing page. **Do not modify.**
- `public/favicon*.png|svg`, `public/og-image.png`, `public/github-social.png`, `public/icon.svg` — static assets, served at `/<filename>`.
- `api/waitlist.js` — legacy Resend signup endpoint.
- `src/content.config.ts` — Astro content collection schemas (blog, docs).
- `src/content/blog/*.mdx` — blog posts. Filename is the slug; `publishDate` controls scheduled publishing.
- `src/content/docs/*.mdx` — docs pages (currently just `index.mdx`).
- `src/lib/blog.ts` — published-post filtering, reading time, related posts.
- `src/lib/authors.ts` — author registry.
- `src/lib/schema.ts` — JSON-LD helpers.
- `src/styles/global.css` — design tokens + nav/footer/blog/prose styles.
- `src/layouts/{BaseLayout,BlogLayout,DocsLayout}.astro` — page shells.
- `src/components/` — `Nav`, `Footer`, `Logo`, `CopyForAI`, `Schema`, `TLDR`, `Callout`, `DefinitionBox`, `ComparisonTable`, `FAQBlock`.
- `src/pages/` — routes.
- `vercel.json` — `framework: astro`, `cleanUrls`, rewrites for `/api/waitlist` and `/sitemap.xml → /sitemap-index.xml`.
- `.claude/astro-site-setup.md` — original setup spec, kept for reference.

## Adding a blog post

Create `src/content/blog/YYYY-MM-DD-slug.mdx`:

```yaml
---
title: "Post title"
description: "One-line description for OG/Twitter and the index card."
author: "anil"
publishDate: 2026-05-12
tags: ["agents", "observability"]
pillar: "foundational"
---
```

The post appears at `/blog/<filename-without-extension>` once `publishDate <= now` at build time. Future-dated posts are excluded from the build until that date passes — so scheduled publishing requires a rebuild after the date arrives. Set up a Vercel cron to redeploy daily if you want this fully automated; otherwise redeploy manually.

To use AEO components (`TLDR`, `Callout`, `FAQBlock`, etc.), import them at the top of the `.mdx`:

```mdx
import TLDR from '@/components/TLDR.astro';
import FAQBlock from '@/components/FAQBlock.astro';
```

## AEO infrastructure

- `/llms.txt` and `/llms-full.txt` — auto-generated indexes/dumps for AI consumers.
- `/sitemap-index.xml` and `/sitemap.xml` (rewrite) — auto-generated.
- `/robots.txt` — auto-generated, allows GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, Bingbot, CCBot, etc.
- Every blog post and doc page also serves at `<path>.md` for clean markdown access (CopyForAI button uses this).
- BlogPosting / Person / Organization / BreadcrumbList / FAQPage JSON-LD as appropriate.

## Design system

- **Fonts:** Geist (sans), Geist Mono (mono) — Google Fonts. Preconnect + stylesheet linked in BaseLayout.
- **Colors:** Vercel-style monochrome with CSS custom properties (`--navy`, `--blue`, `--white`, `--green`, `--amber`, `--red`, plus `--accent-rgb` etc.). Light theme overrides under `[data-theme="light"]`.
- **Theme system:** `system | light | dark`, stored in `localStorage` under `tj-theme`, applied pre-paint via `data-theme-pref` and `data-theme` attributes on `<html>`.

### Token duplication (gotcha)

Design tokens are defined in **two places**: inline `<style>` in `public/index.html` AND `src/styles/global.css`. They must stay in sync — change one, change the other. The duplication is intentional for v1 (avoiding a shared CSS file keeps the landing page risk-free), but is a maintenance gotcha. If you're editing a token, grep for it in both files.

### Theme-init script (gotcha)

The pre-paint theme-init script in `BaseLayout.astro` (head) and `public/index.html` (head) **must be inline, synchronous, with no `defer` / `async` / `type="module"`**. Otherwise blog/docs pages will FOUC on hard reload. If you change it, change both copies.

## URL conventions

- Canonical URLs are no-trailing-slash (`/blog/foo`, not `/blog/foo/`). `astro.config.mjs` has `trailingSlash: 'never'`; Vercel `cleanUrls: true` 308-redirects `/foo/` → `/foo`.
- Internal links should be written without trailing slashes.

## Hero terminal (landing page only)

The interactive terminal demo in `public/index.html` has tab labels in **three** places that must stay in sync (only relevant if editing the landing page):

1. HTML `<button>` elements (e.g., `<button class="step-tab" ...>onboard</button>`)
2. The `steps` array `label` property in the `<script>` block
3. The `tabNames` array in the `<script>` block

## Scope notes

- Docs are a placeholder. Real technical docs live in the OSS repo's README. When TokenJam's docs grow beyond ~10 pages, add MDX files to `src/content/docs/` and consider migrating to a dedicated docs framework (Fumadocs is one option).
- Dynamic per-post OG images are deferred (would require `output: 'hybrid'` + a serverless function). All blog posts currently use the static `/og-image.png` fallback.
- Newsletter signup, comments, multi-author, and AI-bot analytics are deferred — see `.claude/astro-site-setup.md` "Out of scope".
