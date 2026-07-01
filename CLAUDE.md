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

## Shared conventions (hygiene)

> **Shared across all TokenJam repos. Canonical source: `tokenjam/CLAUDE.md`.
> If you change this section, propagate it to the other repos (bench, engine,
> website, ai, cloud). Repo-specific rules live elsewhere in this file.**

### Concurrent agents — one worktree per task
When more than one agent edits this repo in parallel, each agent MUST work in its
own git worktree. A single working dir shares one `HEAD`, so two `git commit`s
from different agents land on whichever branch was checked out last, leaking
commits into the wrong PR. Before starting:
```bash
git worktree add -b <type>/<task> ../<repo>-<task> main
cd ../<repo>-<task>
```
Prune when the PR merges: `git worktree remove ../<repo>-<task>`. Symptom of a
missed worktree: `git log` shows a commit on a branch you didn't intend. Don't
force-push to fix it — rebase the stray commit off your branch first.

### Branch + PR naming
- Branches are slash-separated, kebab-case, type-prefixed: `fix/<area>`,
  `feat/<area>`, `docs/<area>`, `chore/<area>`, `release/<X.Y.Z>`.
- PR titles lead with the verb/type and reference issues by number when
  applicable: `Fix #N: …`, `[feature] … (#N)`, `docs: …`, `Bump version to X.Y.Z`.
- Use `Closes #N` in the PR body (one per line — not `Closes #1, #2`; GitHub
  only catches the first) so issues auto-close on merge.

### Commit messages
- Subject (≤72 chars): one-line summary, active voice, reference issues with `#N`.
- Body (after a blank line): explain *why*, not *what* (the diff shows what).
- Trailers (after another blank line, at the end): always
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>` (or the
  appropriate model identifier). When fixing an externally-reported bug, also
  credit the reporter: `Co-Authored-By: <handle> <noreply@github.com>`.
- Use a HEREDOC for multi-line messages to preserve formatting.

### PR body structure
A framing sentence, then `## Summary` (high-level bullets), per-issue/feature
detail, `## Tests / Verification` (what you ran + results), and
`## What's NOT in this PR` when scope was deliberately limited (load-bearing —
it tells the reviewer what you chose to defer).

### Self-review checklist (before requesting review)
1. Tests/build pass locally.
2. Lint clean for files you touched.
3. CI green on the branch (at least the fast jobs).
4. Acceptance criteria from the issue met, one by one.
5. No accidental files in the diff (local config, test data, debug artifacts).
6. PR body explains the WHY (symptom + root cause + fix).
7. Honesty preserved (below) — no user-facing claim silently strengthened.

### Scope discipline
Do what the brief/issue says, no more. Notice an adjacent issue? File it
separately rather than expanding the PR. Exception: a change functionally
required to make the primary fix work (note it under "What's also in this PR").
When unsure about scope, ask before expanding.

### Worker vs master
Worker agents open PRs and request review; they do NOT merge their own PRs, file
follow-up issues unprompted, or bump versions. The master + the human handle
merges, follow-ups, and releases.

### Honesty discipline (the brand)
Never overclaim. Use "candidate," "measured," "estimated," "looks like,"
"review before…" — never "safe," "certified," "guaranteed," "saves you,"
"quality preserved." No fabricated customer logos, testimonials, or compliance
badges we don't hold. Forward-looking work is labeled as such (early-access /
design-partner / roadmap), never as shipped/GA. If you touch a user-facing
claim, verify it matches existing caveat language; never silently strengthen it.

### Writing style (all prose: PRs, issues, docs, marketing, comments)
Write like a person, not an LLM. Full rules in `.claude/content-style.md` (read
it before drafting site copy). Top tells to strip: em-dashes (≤3 per piece),
"X but Y" / "not just X" contrast-pair cadence (≤2), and default tricolons
("A, B, and C" — vary the list lengths).

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
