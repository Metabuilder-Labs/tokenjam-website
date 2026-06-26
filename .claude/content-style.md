# Content style: write like a person, not an AI

Apply this to all written content for the site: marketing copy, docs, blog posts, product pages, changelogs. LLM defaults produce identifiable rhythm patterns. Strip them at the drafting stage so a reviewer never has to.

The top three tells are em-dashes, contrast pairs, and tricolons. Watch those hardest.

## 1. Em-dash budget: 3 per piece, maximum

The single biggest tell. Em-dashes are for emphatic interruption or strong contrast, not everyday asides. Before using one, try a comma, period, colon, or parenthesis. It almost always works.

- Default: `An agent acts independently—planning and executing steps—without waiting for permission.`
- Better: `An agent acts independently. It plans and executes steps without waiting for permission.`

## 2. Cut "X but Y" and "not just X, it's Y" contrast pairs

The second-biggest tell. Real writers use the contrast-pair rhythm occasionally. LLMs use it as a default cadence. Count them in your draft. More than two, cut some. Splitting one into two sentences is the usual fix.

- Default: `Workflows are predictable but inflexible. Agents are flexible but less predictable.`
- Better: `Workflows follow a fixed path. Agents adapt, which means they handle ambiguity well and cost more per call.`

## 3. Vary tricolons (three-item parallel lists)

"A, B, and C" is the default rhythm. Mix in two-item lists, four- and five-item lists, and plain prose. If every paragraph has a parallel triple, the cadence is engineered, not thought-driven.

- Default: `Agents need a reasoning engine, an action layer, and a state manager.`
- Better: `Agents need a reasoning engine and an action layer. State management matters too, and it's the part most teams underestimate.`

## 4. Strip filler qualifiers

These add nothing: *typically, generally, in practice, often, most modern, it's worth noting that, it's important to remember, one could argue, increasingly.* If a claim needs qualifying, give a specific exception. If it's true, state it.

- Default: `Most modern agents typically follow a pattern called ReAct.`
- Better: `Most agents built since 2023 follow a pattern called ReAct.`

## 5. No section-transition summaries

Don't recap the previous section before starting the next. Trust the reader. Just begin the next heading.

- Cut: `Now that we've covered the core components, let's look at how they fit together.`

## 6. No "let me explain" / "to put it simply" / "in other words"

These precede a restatement of something you already said. Cut them and cut the restatement.

## 7. Vary sentence length aggressively

LLMs default to medium-length sentences in similar shapes. Real writing has rhythm. A short punchy sentence. Then a longer one with multiple clauses that builds to a point. Then short again. Five similar-length sentences in a row is a tell. Break it on purpose.

## 8. Cut adjective stacks

"Powerful, flexible, and comprehensive" is LLM prose. Good technical writing is verb-driven and noun-driven. Use one adjective when you need one. Cut the pairs and triples.

## 9. FAQ questions should feel real

Generic questions are fine for one or two. Include one or two that sound like what a frustrated developer actually types.

- Real: *"Is it normal for my Claude Code session to cost $40?"* / *"How do I stop my agent from rewriting my system prompt every iteration?"*
- Generic: *"What are the benefits of using AI agents?"* / *"What should I consider when choosing a framework?"*

---

**How to use this:** self-edit every draft against these nine before submitting. If you want agents to load it automatically, reference this file from the repo's `CLAUDE.md` and `AGENTS.md` (dropping the file in alone won't get it read).
