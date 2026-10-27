---
title: "Millstream — Monolithic Lab"
description: "Millstream, a pipeline platform by Monolithic Lab for work that mixes code, LLM agents and human review, durable, observable and able to learn from production."
lang: "en"
hero:
  compact: true
  label: "Platform"
  headline: "Millstream"
  subheadline: "Durable pipelines for work that mixes code, LLM agents and human decisions."
---

Millstream runs the work teams build around LLMs as a declarative graph of steps over persisted streams of items. A
crawler streams records, an agent scores each one, a filter keeps the good ones, an analyst approves and a report goes
out. Every item is stored, every agent call is costed, and the pipeline proposes its own improvements from what happens
in production. One Go binary runs it on a laptop, and the same pipeline runs on a server with a standby engine and
remote nodes.

```yaml
steps:
  score:
    action: lab/score-listing@2      # an agent action
    in: listings.unique
    out: listings.scored
  keep-good:
    action: filter
    in: listings.scored
    out: listings.shortlist
    config: { expr: "item.score >= vars.min_score" }
```

## What it does

- **Pipelines as one YAML file.** Steps read and write streams and never call each other, so adding a crawler or
  inserting a step means pointing it at a stream. Actions are written in any language, as a process or a container.
- **Agents with bounds.** Agent steps run on Anthropic or any OpenAI-compatible model. Each answer is validated
  against a schema, each call has a turn and cost limit, and each pipeline a daily budget.
- **People in the loop.** Review steps send items to an inbox in the web UI, where reviewers approve, reject or
  correct them, with reasons that become evidence for improving the step.
- **Durable by design.** Every item is persisted with its lineage, delivery is at least once with deterministic item
  ids, and work survives a crash or a failover to the standby engine.
- **Observable by default.** Metrics, lineage, agent cost and transcripts for every pipeline, a live view in the
  browser and a Prometheus endpoint, with no instrumentation to write.
- **The cheapest step that works.** Each step runs a rule, code, an agent or a person. As evidence accumulates,
  Millstream proposes moving a step down that list, such as code replacing an agent, backtested on past items, with
  the agent kept as its fallback.
- **From a laptop to a server.** SQLite on a laptop, Postgres and object storage on a server, Docker Compose or
  systemd, and remote nodes that join with one command.

## Status

Millstream is a proof of concept, not yet released. The five milestones of its first version are built: the core
engine, agents with budgets and evals, review and the web UI, server deployment with failover, and insights with
self-improvement.

## Licence

The core, the web UI included, will be open source under Apache-2.0. A commercial edition adds single sign-on, roles,
audit export, connectors and support. [Pricing](https://millstream.dev/pricing)

## Links

- [millstream.dev](https://millstream.dev), the product site and documentation
- [Getting started](https://millstream.dev/docs/getting-started)
- [Support](/apps/millstream/support/)
- [Privacy policy](/apps/millstream/privacy/)
