// Content for the four /products/{slug} pages.
// Sourced from the optimization-strategy doc; verbatim example outputs are intentional
// (these match the homepage four-product cards). Edit prose freely; touch outputs carefully.

export type TerminalClass =
  | 'cmd'
  | 'dim'
  | 'val'
  | 'label'
  | 'success'
  | 'warn'
  | 'blank';

export interface TerminalLine {
  t: string;
  c: TerminalClass;
}

export interface ConfidenceLevel {
  level: 1 | 2 | 3;
  name: string;       // "Structural" / "Replay-validated" / "User-validated"
  tier: 'OSS' | 'Pro';
  body: string;
}

export interface UsageEntry {
  label: string;   // "CLI" / "MCP" / "Export" / "Report"
  detail: string;  // the command or tool name
  note?: string;
}

export interface Citation {
  paper: string;
  attribution: string;  // authors / venue / year
  contribution: string; // one-line on what we use from it
  url?: string;
}

export interface ContrastPair {
  vs: string;             // short headline, e.g. "Reuse is not Cache."
  body: string;           // 1-2 sentences explaining the distinction
}

export interface ProductData {
  slug: 'downsize' | 'trim' | 'cache' | 'script' | 'reuse' | 'lens';
  name: string;
  shortBlurb: string;     // matches the homepage card blurb
  heroClaim: string;      // h1 claim
  /** Vibrant brand accent used across the product page (hero name, confidence-tier chip, etc.) */
  accent: string;         // hex
  accentRgb: string;      // "R, G, B" — for rgba() variants
  /** Homepage card preview frame. Defaults to 'terminal' (CLI mock). Lens
   *  uses 'browser' because it's a UI surface, not a CLI. */
  cardVariant?: 'terminal' | 'browser';
  /** Analyzer-only narrative fields. Lens populates only the headline-level
   *  fields and is rendered by a dedicated /products/lens page; the
   *  dynamic [slug] route filters it out via getStaticPaths. */
  problem?: string[];     // paragraphs
  contrasts?: ContrastPair[];
  mechanism?: string[];   // paragraphs
  privacyNote?: string;
  confidence?: ConfidenceLevel[];
  exampleOutput?: TerminalLine[];
  exampleCaption?: string;
  usage?: UsageEntry[];
  research?: Citation[];
}

export const products: ProductData[] = [
  // ── DOWNSIZE ─────────────────────────────────────────────
  {
    slug: 'downsize',
    name: 'Downsize',
    shortBlurb: 'Find tasks where a cheaper model would suffice.',
    heroClaim: 'Pay Opus prices for Opus work, not for everything else.',
    accent: '#3B82F6',
    accentRgb: '59, 130, 246',
    problem: [
      "Coding agents default to premium models on every call. Most calls don't need it. A \"fix this typo\" task gets routed to Claude Opus 4 the same way a \"refactor the entire authentication module\" task does.",
      "The structural shape of those two requests is wildly different. The first one runs fine on Haiku for a fraction of the price. Downsize finds the calls that look like the cheap kind, computes what they would have cost on a smaller model, and shows you the difference — grounded in your own session history, not a vendor benchmark.",
    ],
    mechanism: [
      'Walk every LLM call in your captured trace history. Classify each session by structural shape: input token count, output token count, tool-call count, single-turn vs multi-turn.',
      'Sessions matching a known small-task pattern get flagged as candidates for a cheaper model. Compute what those sessions would have cost on the target model and report the difference. The recommendation is a structural heuristic, not a quality claim — so you decide whether to apply it.',
    ],
    confidence: [
      {
        level: 1, name: 'Structural', tier: 'OSS',
        body: 'Ships today. Flags candidates by structural heuristic — token counts, tool-call shape, turn count. Conservative thresholds keep false positives low.',
      },
      {
        level: 2, name: 'Replay-validated', tier: 'Pro',
        body: 'Samples flagged sessions and replays them through the cheaper model. Compares tool-call sequences for AST-equivalence. Now the recommendation is backed by evidence from your own data, not a guess.',
      },
      {
        level: 3, name: 'User-validated', tier: 'Pro',
        body: "Tracks which recommendations you actually applied and didn't roll back. Promotes structural candidates to high-confidence rules over time, scoped to your codebase.",
      },
    ],
    exampleCaption: 'tj optimize',
    exampleOutput: [
      { t: '$ pipx install tokenjam',                                                    c: 'cmd'    },
      { t: '$ tj onboard --claude-code',                                                      c: 'cmd'    },
      { t: '  → Detects Claude Code installation',                                            c: 'dim'    },
      { t: '  → Reads ~/.claude/projects/<project>/<session>.jsonl files (last 30d)',         c: 'dim'    },
      { t: '  → Ingests ~9,800 spans across ~247 sessions into the local DuckDB',             c: 'dim'    },
      { t: '  Done. 4M tokens analyzed, $4,287 implied API value, 23 days of history.',       c: 'success'},
      { t: '',                                                                                c: 'blank'  },
      { t: '$ tj optimize',                                                                   c: 'cmd'    },
      { t: '',                                                                                c: 'blank'  },
      { t: 'Analyzing 247 sessions, 9.8K spans, 4.0M tokens (last 30d, claude-code, api)…',   c: 'dim'    },
      { t: '',                                                                                c: 'blank'  },
      { t: '  ① Model downgrade: 47% of sessions look Haiku-eligible',                        c: 'label'  },
      { t: '     • 116 of 247 sessions match structural heuristics:',                         c: 'val'    },
      { t: '       short input (<4K tokens), short output (<800 tokens), ≤2 tool calls',      c: 'val'    },
      { t: '     • Currently running on: claude-opus-4-7, claude-sonnet-4-7',                 c: 'val'    },
      { t: '     • Suggested target: claude-haiku-4-5',                                       c: 'val'    },
      { t: '     • At current usage: $1,886 actual → $254 estimated (-86% on flagged)',       c: 'success'},
      { t: '     • Estimated monthly savings: $1,632 (-38% total)',                           c: 'success'},
      { t: '',                                                                                c: 'blank'  },
      { t: '     ⚠ Structural heuristic only. Run `tj optimize --validate` to replay-test',   c: 'warn'   },
      { t: '       on your actual sessions before applying.',                                 c: 'warn'   },
    ],
    usage: [
      { label: 'CLI',    detail: 'tj optimize --finding model-downgrade' },
      { label: 'MCP',    detail: 'should_downgrade_for_task', note: 'query from inside any MCP-capable agent' },
      { label: 'Export', detail: 'tj optimize export-config --target claude-code-settings', note: 'drops into your Claude Code settings.json' },
    ],
    research: [
      {
        paper: 'FrugalGPT',
        attribution: 'Chen, Zaharia, Zou — Stanford 2023',
        contribution: 'Introduced the cascade-confidence framework that grounds the validation work.',
      },
      {
        paper: 'RouteLLM',
        attribution: 'LMSys — ICLR 2025',
        contribution: 'Matrix-factorization router with transfer properties. Our primary routing engine; MIT-licensed.',
      },
      {
        paper: 'BFCL — Berkeley Function-Calling Leaderboard',
        attribution: 'Patil et al. — ICML 2025',
        contribution: 'AST-based evaluation of tool-call structure without execution. Makes replay validation cheap for coding agents.',
      },
    ],
  },

  // ── TRIM ─────────────────────────────────────────────────
  {
    slug: 'trim',
    name: 'Trim',
    shortBlurb: 'Identify token waste in your system prompts.',
    heroClaim: "Your system prompt grew over six months. Half of it isn't doing work.",
    accent: '#22C55E',
    accentRgb: '34, 197, 94',
    problem: [
      "Prompts accumulate. Every new edge case adds an instruction. Every project picks up a CLAUDE.md that gets longer. Tool schemas repeat across calls.",
      "The actual signal in a 4,000-token system prompt might be 800 tokens of real instructions and 3,200 tokens of historical scar tissue. You pay for the whole thing on every call. Trim runs significance analysis on your captured prompts and shows you which sections carry the load and which are dead weight.",
    ],
    mechanism: [
      "Trim runs LLMLingua-2's token-classification model — BERT-class, MIT-licensed, runs locally on CPU — over your captured prompts. Each token gets a score reflecting its contribution to model outputs.",
      'Sections of consistently low-significance tokens get flagged as bloat candidates. The output is a highlighted view of your prompt with high-significance regions in bold and low-significance regions dimmed. You decide what to remove; Trim never edits your prompts at runtime.',
    ],
    privacyNote: "Trim needs your prompt content, which TokenJam doesn't capture by default. To enable it, set alerts.include_captured_content: true in your config. Captured content stays on your local machine — it never leaves, except during opt-in replay validation against alternative models you've configured.",
    confidence: [
      {
        level: 1, name: 'Structural', tier: 'OSS',
        body: 'Token significance is mathematical, not a quality judgment. We recommend; you trim by hand. We never auto-compress prompts at runtime.',
      },
    ],
    exampleCaption: 'tj optimize --include-bloat',
    exampleOutput: [
      { t: 'Prompt bloat detected in claude-code-myproj:',                                    c: 'label'  },
      { t: '  • Your CLAUDE.md is 4,213 tokens (up 38% in 30 days)',                          c: 'val'    },
      { t: '  • Section "Coding conventions > Error handling" appears identically',           c: 'val'    },
      { t: '    in 91 of 247 sessions (1,108 tokens × 91 = ~100K repeated tokens)',           c: 'val'    },
      { t: '  • Significance analysis suggests ~340 of those 1,108 tokens carry',             c: 'val'    },
      { t: '    the signal; the rest could be trimmed',                                       c: 'val'    },
      { t: '  • Estimated cost: ~$8.50/mo at current usage on Sonnet',                        c: 'success'},
      { t: '',                                                                                c: 'blank'  },
      { t: '  Detail: open `tj report --bloat claude-code-myproj` to see the',                c: 'dim'    },
      { t: '  highlighted prompt with high-significance tokens bold,',                        c: 'dim'    },
      { t: '  low-significance dimmed.',                                                      c: 'dim'    },
    ],
    usage: [
      { label: 'CLI',    detail: 'tj optimize --include-bloat' },
      { label: 'Report', detail: 'tj report --bloat <agent_id>', note: 'opens a local HTML file with the highlighted prompt' },
      { label: 'MCP',    detail: 'surfaces in get_optimize_report when content capture is enabled' },
    ],
    research: [
      {
        paper: 'LLMLingua-2',
        attribution: 'Microsoft Research — ACL 2024',
        contribution: 'Token classification via GPT-4 distillation. 3–6× faster than LLMLingua-1. We use the same scoring mechanism for detection only — leaving the editing decision with you.',
      },
    ],
  },

  // ── CACHE ────────────────────────────────────────────────
  {
    slug: 'cache',
    name: 'Cache',
    shortBlurb: 'Detect cacheable prompt prefixes. Save 30–60% with provider-native caching.',
    heroClaim: 'Cut 30–60% of your bill with caching the provider already supports.',
    accent: '#F59E0B',
    accentRgb: '245, 158, 11',
    problem: [
      "Anthropic, OpenAI, and Google all offer prompt caching. The cached portion of a prompt is billed at roughly 10% of the normal input rate. For a Claude Code user, the system prompt plus tool schemas plus CLAUDE.md is 2–4K tokens that are identical across every call in a session.",
      "Without explicit cache_control markers, you pay full price for that prefix on every call. Cache walks your prompt history, finds the stable prefixes, and tells you exactly where to place the cache_control markers — with the exact savings calculation per provider.",
    ],
    mechanism: [
      'Walk every prompt in the window. Compute prefix hashes at common breakpoint positions (after the system message, after tool schemas, after project context). Identify identical prefixes across calls within each provider\'s cache TTL window.',
      "For each identified prefix, compute how many calls share it, how many tokens it represents, and what you'd save by placing a cache_control marker there. Output the specific config snippet that does it. For workloads with semantic-but-not-identical similarity (FAQ-style bots, repeated query patterns), Cache also detects clusters using GPTCache's cosine-similarity approach.",
    ],
    confidence: [
      {
        level: 1, name: 'Structural', tier: 'OSS',
        body: "The math is deterministic. The provider's cached-read pricing is published; the savings calculation is arithmetic. High confidence by default.",
      },
    ],
    exampleCaption: 'tj optimize --finding cache-opportunity',
    exampleOutput: [
      { t: 'Cache opportunities in last 30d:',                                                c: 'label'  },
      { t: '  • Identical 2,400-token prefix detected across 94% of your calls',              c: 'val'    },
      { t: '    (your CLAUDE.md + tools + system prompt)',                                    c: 'val'    },
      { t: "  → You're already using prompt caching for 11% of cacheable opportunities.",     c: 'dim'    },
      { t: '  → Increasing cache_control breakpoints could save ~$42/mo (90% reduction',      c: 'success'},
      { t: '     on the 89% of calls currently paying full price).',                          c: 'success'},
      { t: '  → See `tj report --cache claude-code-myproj` for the specific config.',         c: 'dim'    },
      { t: '',                                                                                c: 'blank'  },
      { t: '  • Semantic similarity ≥0.95 detected on 47 instances of "format SQL query"',    c: 'val'    },
      { t: '    style requests in last 30d.',                                                 c: 'val'    },
      { t: '  → Candidate for opportunistic local semantic cache (TokenJam Pro).',            c: 'dim'    },
      { t: '  → Estimated savings: $8/mo at TTL ≥ 1 day.',                                    c: 'success'},
    ],
    usage: [
      { label: 'CLI',    detail: 'tj optimize --finding cache-opportunity' },
      { label: 'MCP',    detail: 'find_cache_opportunity' },
      { label: 'Export', detail: 'cache_control snippets', note: 'drop into your existing prompt-building code or Claude Code settings' },
    ],
    research: [
      {
        paper: 'GPTCache',
        attribution: 'Zilliz — 2023',
        contribution: 'Semantic-similarity threshold for opportunistic local caching (cosine ≥ 0.8 default).',
      },
      {
        paper: 'Provider-native caching docs',
        attribution: 'Anthropic, OpenAI, Google',
        contribution: 'Cached-read pricing (~10% of normal input rate) and cache_control placement rules.',
      },
    ],
  },

  // ── SCRIPT ───────────────────────────────────────────────
  {
    slug: 'script',
    name: 'Script',
    shortBlurb: 'Surface recurring agent sessions that should have been simple (deterministic) scripts.',
    heroClaim: "Some of your agent tasks don't need an agent. Replacing them with scripts is 100% cost recovery on those tasks.",
    accent: '#EF4444',
    accentRgb: '239, 68, 68',
    problem: [
      "A user types \"deploy staging\" into Claude Code. The agent thinks for a few seconds, runs git pull, npm install, reads .env.staging, runs npm run build, runs pm2 restart staging-app. Same five commands, same order, every single time.",
      "The agent's reasoning didn't change anything; the user just paid Opus pricing to have it figure out a 5-line shell script. Multiply that across hundreds of deterministic tasks and you have meaningful, recoverable cost. Script finds those tight clusters — and only the tight ones, where the reasoning genuinely added nothing.",
    ],
    mechanism: [
      'Cluster sessions by tool-call signature: the ordered list of tools called, with which arguments are fixed vs variable. Inside each cluster, measure three kinds of variation — argument variation, branch variation (did the agent ever skip or add a step?), outcome variation (did the user accept the result every time?).',
      "Surface clusters where >90% of instances follow identical patterns, where the agent's reasoning contributed no observed variation. The output names the cluster, shows the example sequence, counts instances, and projects the savings from replacing it with a script you write.",
    ],
    confidence: [
      {
        level: 1, name: 'Structural', tier: 'OSS',
        body: 'Conservative thresholds in v1 to minimize false positives — only flag clusters with 100% argument-pattern stability, 20+ instances, and zero observed branching. Surfaces fewer findings, but the findings are reliable.',
      },
    ],
    exampleCaption: 'tj optimize --finding workflow-restructure',
    exampleOutput: [
      { t: 'Deterministic workflow candidates (high confidence only):',                       c: 'label'  },
      { t: '  • 23 sessions in last 30d executed identical 5-step sequence:',                 c: 'val'    },
      { t: '    git pull → npm install → cat .env.staging → npm run build → pm2 restart',     c: 'val'    },
      { t: '',                                                                                c: 'blank'  },
      { t: '    Zero argument variation. Zero observed branching.',                           c: 'dim'    },
      { t: '    Estimated current cost: ~$87/mo (23 sessions × ~$3.80 average)',              c: 'val'    },
      { t: '',                                                                                c: 'blank'  },
      { t: '  → This looks like a deployment script, not an agent task.',                     c: 'dim'    },
      { t: '    Suggested: replace with `scripts/deploy-staging.sh`.',                        c: 'dim'    },
      { t: '    Estimated savings: $87/mo, plus ~30s latency per execution.',                 c: 'success'},
    ],
    usage: [
      { label: 'CLI', detail: 'tj optimize --finding workflow-restructure', note: 'output names candidate sessions; you write the script' },
      { label: 'MCP', detail: 'surfaces in get_optimize_report' },
    ],
    research: [
      {
        paper: 'Efficient Agents',
        attribution: '2025',
        contribution: 'Demonstrates 96.7% of OWL framework performance at 28.4% lower cost via principled component selection. The empirical basis for selective de-agent-ification.',
      },
      {
        paper: 'Agentic Plan Caching',
        attribution: '2025',
        contribution: '46.62% cost reduction at 96.67% accuracy retention by extracting reusable program templates from trajectories. The "agent" v2 of this idea; Script is the conservative v1.',
      },
    ],
  },

  // ── REUSE ────────────────────────────────────────────────
  {
    slug: 'reuse',
    name: 'Reuse',
    shortBlurb: 'Find planning your agent keeps redoing and pays for every time.',
    heroClaim: 'Stop paying to re-plan work your agent already figured out.',
    accent: '#8B5CF6',
    accentRgb: '139, 92, 246',
    problem: [
      'Most agent work has a shape. "Cut a patch release" runs the same five steps every time; only the version number changes. The first time, the agent earns its keep by reasoning out the plan. Every time after that, you pay full price to regenerate a plan that did not change.',
      'Across a month of real traffic, that repetition adds up. The published research on agent plan caching puts the planning stage at roughly half of total agent cost on repetitive workloads, recoverable at around 50% with no loss in task success. Reuse is how you find that money in your own traces.',
    ],
    contrasts: [
      {
        vs: 'Reuse is not Cache.',
        body: 'Cache finds prompt prefixes the provider can serve cheaper; the call still happens, you just pay less for the input. Reuse finds whole plans you can skip regenerating; the planning call does not happen at all.',
      },
      {
        vs: 'Reuse is not Script.',
        body: 'Script finds work the agent should not be doing: fixed sequences with no decisions, better off as a shell script. Reuse finds work the agent should be doing but keeps re-planning from scratch: same skeleton, different details each time. Script removes the agent. Reuse keeps it and stops it from re-planning.',
      },
    ],
    mechanism: [
      'Cluster by plan shape. Reuse groups your completed sessions by the structure of the work (the tool sequence and the plan skeleton), using the same machinery Script uses to find deterministic clusters.',
      'Find the repeats. Within each cluster it isolates the planning portion and measures what stays the same across runs versus what varies. A stable skeleton with changing parameters is a reuse candidate.',
      'Quantify and export. It prices what you spent regenerating each repeated plan and shows the recoverable figure, then exports the skeletons as templates you can review and reuse however you like.',
    ],
    confidence: [
      {
        level: 1, name: 'Structural', tier: 'OSS',
        body: 'Ships today. Clusters your sessions by plan shape, isolates the planning portion, and quantifies what you spent regenerating each repeated skeleton. Exports the templates via `tj report --reuse` so you can review and reuse them by hand.',
      },
      {
        level: 2, name: 'Replay-validated', tier: 'Pro',
        body: 'Samples a flagged cluster and replays the planning step through a lightweight adapter to confirm the cached skeleton still produces an equivalent tool-call sequence. Recoverable estimates now carry evidence from your own data, not just a clustering heuristic.',
      },
      {
        level: 3, name: 'User-validated', tier: 'Pro',
        body: 'Tracks which served plans you accepted versus let regenerate. Promotes high-confidence repeats to default-served, with full audit log and instant kill switch. Powers "Reuse Live": a local plan cache that recognizes a repeated task and serves the adapted plan automatically, scoped to your codebase.',
      },
    ],
    exampleCaption: 'tj optimize — reuse',
    exampleOutput: [
      { t: 'Repeated planning detected (last 30d):',                                              c: 'label'  },
      { t: '',                                                                                    c: 'blank'  },
      { t: '  • Cluster "patch-release": 31 sessions share one plan skeleton',                    c: 'val'    },
      { t: '    (read changelog → bump version → run tests → tag → push)',                        c: 'val'    },
      { t: '  • Planning portion: ~2,100 tokens/session on claude-opus-4-7',                      c: 'val'    },
      { t: '  • The skeleton is identical across all 31 runs; only the version',                  c: 'val'    },
      { t: '    string and date change.',                                                         c: 'val'    },
      { t: '  • You paid to generate this plan 31 times.',                                        c: 'val'    },
      { t: '  • Estimated recoverable: ~$54/mo if served from a plan cache',                      c: 'success'},
      { t: '    (or ~$61/mo if converted to a slash command)',                                    c: 'success'},
      { t: '',                                                                                    c: 'blank'  },
      { t: '     ⚠ Structural analysis only. A matching skeleton does not guarantee',             c: 'warn'   },
      { t: '       the plans were interchangeable. Review the exported templates',                c: 'warn'   },
      { t: '       in `tj report --reuse` before reusing them.',                                  c: 'warn'   },
    ],
    usage: [
      { label: 'CLI',    detail: 'tj optimize reuse' },
      { label: 'Report', detail: 'tj report --reuse', note: 'exports each skeleton as a reviewable template' },
      { label: 'MCP',    detail: 'find_reuse_candidates', note: 'query from inside any MCP-capable agent' },
    ],
    research: [
      {
        paper: 'Agentic Plan Caching',
        attribution: 'NeurIPS 2025',
        contribution: 'Extracting reusable plan templates from completed agent runs and adapting them with a small model recovers roughly half of agent cost while holding task success near baseline. Reuse brings that finding to your own traces.',
      },
    ],
  },

  // ── LENS ─────────────────────────────────────────────────
  // Lens is the local web UI surface (the `tj serve` dashboard) that brings
  // every analyzer's findings into one screen. It isn't a sixth analyzer; it
  // sits alongside them as the visualization layer. cardVariant: 'browser'
  // tells the homepage to use a browser-chrome card preview, and the dynamic
  // [slug] route filters this entry out (the dedicated lens.astro handles it).
  {
    slug: 'lens',
    name: 'Lens',
    cardVariant: 'browser',
    shortBlurb: "See your spend, your recoverable waste, and your alerts at a glance, in a local browser dashboard.",
    heroClaim: "The local dashboard for every analyzer's findings.",
    accent: '#06B6D4',
    accentRgb: '6, 182, 212',
  },
];

export function getProduct(slug: string): ProductData | undefined {
  return products.find((p) => p.slug === slug);
}

/**
 * Inline SVG content for each analyzer's icon. Used across the site:
 *   - Nav products dropdown
 *   - Hero diagram right column (homepage)
 *   - "Five analyzers" cards grid (homepage)
 *   - /products/[slug] page headers
 *   - /observe "powers the analyzers" bridge cards
 *
 * Each icon is rendered with `currentColor` so callers can theme via CSS,
 * and metaphors the action:
 *   downsize  shrink corners (arrows pulling inward)
 *   trim      scissors
 *   cache     stacked database cylinder
 *   script    terminal prompt (>_)
 */
// Intrinsic width/height ensure iOS Safari renders these when injected via
// set:html (CSS-only sizing on injected SVG is unreliable there). CSS in
// callers can still override.
export const productIcons: Record<ProductData['slug'], string> = {
  downsize: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="M14 10l7-7"/><path d="M3 21l7-7"/></svg>`,
  trim:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
  cache:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>`,
  script:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  reuse:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  lens:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16" y2="16"/></svg>`,
};
