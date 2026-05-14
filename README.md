# TokenJam

The website for **TokenJam** — open-source token economics for AI agents. Observability, cost optimization, and behavioral control for autonomous agents, running locally on your machine. Works with Claude Code, Codex, OpenAI Agents SDK, LangChain, CrewAI, and any OTel-native agent.

Live at [tokenjam.dev](https://tokenjam.dev). The OSS tool itself lives at [github.com/metabuilder-labs/tokenjam](https://github.com/metabuilder-labs/tokenjam).

## What is TokenJam?

TokenJam is a CLI-based observability tool for developers building agentic AI systems. It gives you full visibility into what your agents do — tool calls, token costs, behavioral drift, and sensitive actions — without requiring a SaaS account or cloud dependency.

**Key features:**
- OTel GenAI Semantic Conventions compliance (exportable to Grafana, Jaeger, Datadog)
- Real-time USD cost tracking per agent, per model, per task
- Sensitive action alerts (email sends, file writes, form submissions)
- Local behavioral drift detection
- Output schema validation
- Full-featured CLI + local REST API

**Works with:** OpenClaw, LangChain, LangGraph, CrewAI, AutoGen, OpenAI Assistants, Anthropic Claude, and custom agents.

## Status

TokenJam is in active development. This repo currently hosts the landing page at [tokenjam.dev](https://tokenjam.dev). The CLI tool is coming soon.

## License

MIT / Apache 2.0
