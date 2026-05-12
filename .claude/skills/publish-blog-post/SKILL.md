---
name: publish-blog-post
description: |
  Publish a new blog post to the tokenjam.dev Astro site. Use when the user asks
  to "write a blog post," "publish post #N," "draft a new blog entry," or
  provides a body of post content with frontmatter. Covers the full pipeline:
  filename + slug conventions, frontmatter requirements, author registry,
  MDX components (TLDR, FAQBlock, Callout, DefinitionBox, ComparisonTable),
  cover-image optimization, em-dash style rules, local verification, and
  commit/push.
---

# Publish a blog post on tokenjam.dev

This site is Astro + MDX. Blog posts live under `src/content/blog/` and are
rendered by `src/layouts/BlogLayout.astro`. Pages are static, built via
`pnpm build` and previewed via `pnpm preview --port 4321`. The author registry
is `src/lib/authors.ts`. The content schema is `src/content.config.ts`.

The previous three posts on this site were produced by following the workflow
below. Do not skip steps — each one was added in response to a specific bug or
style preference, not as ceremony.

---

## 1. Gather inputs

Ask the user for (or extract from their message):

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Full post title with proper capitalization. Will render as the article H1. |
| `description` | yes | One-sentence summary. Used for `<meta name="description">`, OG/Twitter cards, and the byline lede. Keep it distinct from the first body paragraph. |
| `author` | yes | Must be the **slug** of a registered author (e.g., `anil-murty`, `ansh-saxena`). **Not** the display name. If the user supplies an empty string or a display name, map to the slug — don't pass it through. |
| `publishDate` | yes | ISO date `YYYY-MM-DD`. Posts with `publishDate > today` are hidden from the build. |
| `tags` | yes | Array of lowercase tag strings, e.g. `["agents", "observability"]`. |
| `pillar` | yes | Must match one of the enum values in `src/content.config.ts`. As of writing: `foundational`, `observability`, `evaluation`, `environments`, `gateways`, `memory`, `guardrails`, `hitl`, `control-plane`, `optimization`, `comparison`, `thesis`. |
| `image` | **yes** | Path under `/blog/...`. Ask the user for a source image if they don't supply one; do not publish without one. See Section 6 for optimization. (BlogLayout will technically fall back to `/og-image.png`, but that fallback is not acceptable for normal posts.) |
| `canonicalUrl` | optional | Override the canonical URL if the post is syndicated. |
| `lastUpdated` | optional | ISO date. Adds an "Updated …" line to the byline. |
| `draft` | optional, default `false` | When `true`, post is excluded from the build regardless of `publishDate`. |

If the user supplies content that names a future date but they're in
interactive review mode, **ask once** whether to keep it scheduled or set
`publishDate` to today so they can preview. Default behavior in prior posts
was "set to today for preview, switch back before merging."

---

## 2. Filename + slug

Convention: `src/content/blog/YYYY-MM-DD-<slug>.mdx`.

- `YYYY-MM-DD` is the **same** as `publishDate` in frontmatter.
- `<slug>` is kebab-case, lowercase, no stop-words. Match the post's topic, not the title verbatim. Examples that shipped: `agents-101`, `agent-observability`, `opentelemetry-for-ai-agents`.
- The URL becomes `/blog/<filename-without-extension>`.

If the user later changes `publishDate`, rename the file to keep them in sync
(e.g., `git mv` if tracked, plain `mv` if not yet committed).

---

## 3. Author registry

Authors are defined in `src/lib/authors.ts`. The frontmatter `author` field must
be a key in that object.

Current schema per author:

```ts
{
  slug: 'anil-murty',                              // matches the key
  name: 'Anil Murty',                              // display
  role: 'Founder, Metabuilder Labs',
  bio: '...',                                      // ~1–2 sentences
  link: 'https://www.linkedin.com/in/anilmurty/',  // external profile
}
```

**Adding a new author:**

1. Append a new entry to the `authors` object in `src/lib/authors.ts`.
2. The slug should be `firstname-lastname`, lowercase.
3. Set `link` to the URL the user wants their name to point to (LinkedIn for
   business-facing, GitHub for engineering-facing — match what's been used).
4. Avatar images are **not** used anywhere on the site — do not add `avatar`
   fields. The author registry has no `avatar` field by design (cleaned up in
   commit `d800bd2`).
5. To fetch a GitHub avatar — historical context only — use
   `https://github.com/<handle>.png?size=400`. Public GitHub profile pictures
   are unauthenticated and can be downloaded directly with `curl`. **However**,
   avatars are no longer rendered, so don't bother unless asked.

**Where the author appears today:**

- Byline at the top of every post: `<Name>` (linked to `/blog/authors/<slug>`).
- Author archive page at `/blog/authors/<slug>` lists all posts by that author.
- An author-bio block at the **bottom** of every post was deliberately removed
  (commit before `Author bio removal`). Do not add it back unless the user asks.

---

## 4. Frontmatter template

Use this exact shape. Required keys, in this order:

```yaml
---
title: "What is X?"
description: "One-sentence summary. Used for OG, Twitter, and meta description."
author: "anil-murty"
publishDate: 2026-05-10
tags: ["topic", "another-topic"]
pillar: "observability"
image: "/blog/x.jpg"
---
```

**Common pitfalls:**

- `author: ""` does **not** trigger the schema default. Always pass an explicit
  slug.
- `image:` is a public-URL path, not a filesystem path. `/blog/x.jpg`, **not**
  `public/blog/x.jpg`.
- Quote the title and description (they often contain colons/commas that
  break YAML if unquoted).
- `publishDate` is unquoted ISO date, e.g. `2026-05-10`.

---

## 5. MDX body conventions

After the closing `---`, the body. Rules learned across three posts:

### Top of file: imports

If the post uses any AEO components, import them at the very top of the body:

```mdx
import TLDR from '@/components/TLDR.astro';
import FAQBlock from '@/components/FAQBlock.astro';
import Callout from '@/components/Callout.astro';
import DefinitionBox from '@/components/DefinitionBox.astro';
import ComparisonTable from '@/components/ComparisonTable.astro';
```

Only import what you use. Astro will not fail on unused imports, but they're noise.

### Don't repeat the title

`BlogLayout` already renders the title as `<h1>`. Do **not** start the body
with `# Title` or `## What is X?` (when X matches the title). The first content
should be the `<TLDR>` block, then a lead paragraph.

### Don't echo the description

The body's first paragraph should **not** be a near-verbatim restatement of the
`description` frontmatter field. Earlier draft of the agent-observability post
had this duplication and the user flagged it on visual review. Lead with new
material — usually a one-paragraph definition that goes deeper than the meta
description.

### TLDR

Use the `<TLDR>` component at the top of every long-form post. Bulleted list
inside:

```mdx
<TLDR>
- First bullet.
- Second bullet, with `code` if needed.
- Third bullet.
</TLDR>
```

### Section headers

- H2 (`##`) for top-level sections.
- H3 (`###`) for sub-sections inside an H2.
- Never use H1 in the body (reserved for the post title via layout).

### Lists for definitions

After a `### Subsection` describing a list of components/features, prefer a
markdown list with bolded labels and colons. Example:

```mdx
- **The LLM (reasoning engine):** decides what action to take.
- **Tools (action layer):** functions the agent can call.
```

The colon-after-bold is the established style for definition lists in both
blog and docs.

### Tables

Plain markdown tables work and are styled in `.prose` (see
`src/styles/global.css`). For comparison tables across tools/products, prefer
the `<ComparisonTable>` component:

```mdx
<ComparisonTable
  tools={['TokenJam', 'LangSmith', 'Langfuse']}
  rows={[
    { feature: 'Signup required', values: [false, true, true] },
    { feature: 'Local-first', values: [true, false, 'self-host only'] },
  ]}
/>
```

`true` → `✓`, `false` → `—`, strings render as-is.

### FAQ

Every long-form post should have a "Common questions" section using
`<FAQBlock>`. It also emits FAQPage JSON-LD, which Google and AI tools index.

```mdx
## Common questions

<FAQBlock items={[
  {
    question: "Question one?",
    answer: "Plain-text answer. No markdown rendering, no inline code styling."
  },
  {
    question: "Another?",
    answer: "..."
  }
]} />
```

**Important constraints on FAQ answers:**

- Answers render as plain text inside a `<dd>`. Markdown inside the answer
  string is **not** processed. No `**bold**`, no `[links](...)`, no `code`.
- If an answer naturally has structure (numbered list, code), flatten it into
  prose for the FAQ entry, OR move it out of the FAQ block and write it as
  regular MDX. The OpenTelemetry post took the prose-flattening route for its
  "How do I set up telemetry export" question — that answer had a numbered
  list in the source draft.
- Use single quotes inside the double-quoted JS strings to avoid escaping
  (`"... 'book me a flight' ..."`). Plain apostrophes are fine.

### CopyForAI

`BlogLayout` renders the "Copy for AI" button automatically at the top of
every post — do not add it manually in the MDX.

### Cross-references

When linking to other posts on the site, use the full slug path:

```mdx
[Agents 101](/blog/2026-05-08-agents-101)
[What is agent observability?](/blog/2026-05-09-agent-observability)
```

The slug after `/blog/` is the **filename without `.mdx`**, not the title.

If you want to reference a post that doesn't exist yet, write it as plain
text with `(forthcoming)`, not as a dead link:

```mdx
- What is agent token economics (forthcoming). One-line description.
```

### Em-dashes — site-wide style

The user's standing rule: **no em-dashes (`—`) anywhere in blog or docs
content**. Convert based on context:

| Source pattern | Replace with |
| --- | --- |
| `- **Label** — definition` (list item) | `- **Label:** definition` |
| Mid-sentence parenthetical aside with paired em-dashes (`X — clause — Y`) | Parens (`X (clause) Y`) |
| Two independent clauses joined by em-dash | Period or semicolon |
| Aside list (`tools — A, B, C`) | Colon (`tools: A, B, C`) |
| Filler/short interjection | Comma |
| Bare `—` in a table cell ("no value") | `none` |

Run a final grep after writing:

```bash
grep -rn '—' src/content/blog/<filename>.mdx
```

Should return nothing.

---

## 6. Cover image

**Required.** Every published post on this site has a cover image, and the
user expects every new post to ship with one. If the user hasn't supplied
an image in their initial message, **ask for one before publishing** —
don't proceed and don't fall back to `/og-image.png` silently. The user
typically drops the source in `~/Downloads/`, `~/Desktop/`, or a Google
Drive folder; ask where they've put it.

Without a cover image, social previews fall back to `/og-image.png` and
no inline cover renders on the post page — both of which break the
established look across the existing posts.

### Where to put it

Save to `public/blog/<image-slug>.jpg`. Image-slug usually matches the post's
slug, e.g.:

- `public/blog/agents-101.jpg`
- `public/blog/agent-observability.jpg`
- `public/blog/opentelemetry-for-ai-agents.jpg`

### Optimization workflow

Source images are typically large PNGs (3–5 MB) the user drops in `~/Downloads/`
or `~/Desktop/`. Optimize before checking in. The established pipeline uses
Python + Pillow:

```python
from PIL import Image
import os

src = "/Users/anilmurty/Downloads/source.png"
dst = "/Users/anilmurty/tokenjam-website/public/blog/<slug>.jpg"

im = Image.open(src).convert("RGB")
print(f"Source: {im.size}")

# Resize to max 1600 wide, preserving aspect ratio. Don't upscale.
target_w = 1600
if im.size[0] > target_w:
    ratio = target_w / im.size[0]
    target_h = int(im.size[1] * ratio)
    im = im.resize((target_w, target_h), Image.LANCZOS)

im.save(dst, "JPEG", quality=85, optimize=True)
print(f"Output: {im.size}, {os.path.getsize(dst)/1024:.0f} KB")
```

**Tuning notes:**

- Quality 85 is the sweet spot. Higher than 90 stops compressing meaningfully;
  lower than 80 starts visibly degrading text in diagrams.
- 1600 wide hits OG-preview sweet spots (X.com wants ≥1200×630; LinkedIn
  prefers 1200×627 / 1.91:1). 1600 gives headroom for high-DPI displays.
- Do **not** upscale if the source is smaller than 1600 wide. Save at native
  resolution. The OpenTelemetry post image was 1101×719 native — kept as-is.

### Cropping (advanced)

If the source has embedded text you want to remove (e.g., a title that
duplicates the post title), crop in Pillow:

```python
im = Image.open(src)
w, h = im.size
# Crop off the top ~12% where a title block typically sits.
top_crop = int(h * 0.12)
cropped = im.crop((0, top_crop, w, h))
```

Tune the percentage to the specific image. Visual review afterwards. This was
attempted once (agent-observability v1) and the user opted to instead supply
a pre-cropped source. Prefer asking for a clean source over cropping when
the result might be off.

### After saving

Reference it in the frontmatter as `image: "/blog/<slug>.jpg"` and verify
the file is present in `public/blog/` before building.

Delete the original source from `~/Downloads/` or wherever it came from after
verification. The user has explicitly asked for this cleanup before.

### Sizes from prior posts (reference)

- `agents-101.jpg` — 1600×1123, **503 KB** (from 3.4 MB PNG)
- `agent-observability.jpg` — 1600×1136, **306 KB** (from 3.5 MB PNG)
- `opentelemetry-for-ai-agents.jpg` — 1101×719 native, **141 KB** (from 1.3 MB PNG)

---

## 7. Build + local verify

After writing the file:

```bash
pnpm build
```

A successful build looks like:

```
[content] Synced content
[build] X page(s) built in Ys
```

If it fails:

- `LegacyContentConfigError` → you're on Astro 6+, content collections must
  use the new content layer (already configured). Don't recreate
  `src/content/config.ts` — use `src/content.config.ts`.
- `MDX parse error` → almost always a frontmatter quote or component prop
  issue. Check that strings in `<FAQBlock items={[...]} />` don't contain
  unescaped backticks or double quotes.
- Future-dated post not appearing → check `publishDate` is `<= today`. If
  scheduled, this is correct behavior.

Then preview:

```bash
pnpm preview --port 4321
```

Walk the verification checklist:

- `http://localhost:4321/blog` — new post appears at the top (newest first).
- `http://localhost:4321/blog/<slug>` — full post renders. Cover image loads
  if `image:` is set.
- `http://localhost:4321/blog/<slug>.md` — `Content-Type: text/markdown`,
  body is the raw MDX body with frontmatter stripped. The "Copy for AI"
  button on the rendered page fetches this URL.
- View source on the rendered HTML: `<title>`, `<meta name="description">`,
  `og:image`, `og:title`, `twitter:image` all reflect the new post.
- `application/ld+json` script in the head contains `"@type":"BlogPosting"`
  with `headline`, `datePublished`, and `image`.
- If using `<FAQBlock>`, second `application/ld+json` contains
  `"@type":"FAQPage"`.

For URL-canonicalization issues (e.g., trailing slash behavior on Vercel), see
`.claude/astro-site-setup.md` — the spec captures the Vercel `cleanUrls` +
Astro `trailingSlash: 'never'` interaction.

---

## 8. Background-process gotchas

When you start `pnpm preview` in the background, killing the previous preview
will surface as a "command failed with exit code 144" notification. **This is
expected** — it's just the prior process being killed. Don't restart, don't
investigate, just confirm the new preview is up:

```bash
curl -sI http://localhost:4321/ | head -1   # → HTTP/1.1 200 OK
```

The standard restart pattern used in this repo:

```bash
pkill -f "astro preview" 2>/dev/null
sleep 1
pnpm preview --port 4321 &
```

---

## 9. Commit + push

The user has been merging directly to `main` for this site (no PR ceremony).
Match that workflow unless they say otherwise.

```bash
git add src/content/blog/<file>.mdx public/blog/<image>.jpg src/lib/authors.ts
git commit -m "$(cat <<'EOF'
Add blog post: <Title>

<Optional 1–2 sentence summary of what the post covers.>

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git push origin main
```

**Only stage what you changed.** Don't `git add -A`; the user has had stale
preview artifacts and stray Downloads files get accidentally swept in
otherwise.

If you also added a new author to `src/lib/authors.ts`, include it in the
same commit. Mention the new author in the commit message.

---

## 10. Site-wide style rules (recap)

Pulled from the running pattern across all three published posts and the
docs site:

- **No em-dashes** anywhere in published content. See Section 5.
- **Microsoft / Hugging Face / Anthropic / OpenAI / Cognition** parentheticals
  next to product names are **not bolded**: `**Product**` (Company), not
  `**Product (Company)**`. This was a user correction during agents-101.
- **External links** that aren't required (e.g., a site doesn't have a stable
  URL you're confident about) — leave them as plain text with the product
  name, not a guessed URL. Better to ship without a link than with a broken
  one.
- **"See also" cross-references** at the end of a post are fine, but never
  link to posts that don't exist. Mark forthcoming posts as plain text.
- **Description vs. lead paragraph** — must not duplicate. If the description
  and your opening sentence are saying the same thing, rewrite the opening
  to go deeper.

---

## 11. Verification checklist (do not skip)

Before declaring a post complete:

- [ ] `pnpm build` succeeds, post count matches expectation (+1 over previous).
- [ ] `/blog` lists the new post at the top.
- [ ] `/blog/<slug>` renders end-to-end without missing components or broken layout.
- [ ] `/blog/<slug>.md` returns `text/markdown`.
- [ ] `image:` is set (required for every post — see Section 6), file exists at the right path, OG meta tag points to absolute URL, image is optimized (≤500 KB, ≤1600 wide).
- [ ] No em-dashes (`grep '—' src/content/blog/<file>.mdx` returns nothing).
- [ ] Frontmatter `author` matches a real slug in `src/lib/authors.ts`.
- [ ] `publishDate` matches the date in the filename.
- [ ] Tags are lowercase, no spaces.
- [ ] `pillar` is one of the allowed enum values.
- [ ] FAQ component (if used) emits FAQPage JSON-LD (visible in HTML source).
- [ ] BlogPosting JSON-LD has the expected `image` field.

When all green, commit + push. The user will tell you to deploy or merge if
you're working on a branch.
