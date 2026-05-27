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

export interface ProductData {
  slug: 'downsize' | 'trim' | 'cache' | 'script';
  name: string;
  shortBlurb: string;     // matches the homepage card blurb
  heroClaim: string;      // h1 claim
  /** Vibrant brand accent used across the product page (hero name, confidence-tier chip, etc.) */
  accent: string;         // hex
  accentRgb: string;      // "R, G, B" — for rgba() variants
  problem: string[];      // paragraphs
  mechanism: string[];    // paragraphs
  privacyNote?: string;   // Trim only
  confidence: ConfidenceLevel[];
  exampleOutput: TerminalLine[];
  exampleCaption: string; // small label above the terminal
  usage: UsageEntry[];
  research: Citation[];
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
      { t: '$ pip install "tokenjam[mcp]"',                                                    c: 'cmd'    },
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
];

export function getProduct(slug: string): ProductData | undefined {
  return products.find((p) => p.slug === slug);
}
