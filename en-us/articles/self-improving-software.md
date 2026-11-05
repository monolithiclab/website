---
title: "Self-Improving Software: What a CEO Has to Decide First — Monolithic Lab"
description: "AI agents can read errors and tickets and propose a fix. Saying what “better” means, proving each change, and keeping someone accountable remain leadership decisions."
lang: "en"
alternate: "/articles/logiciel-qui-s-ameliore/"
hero:
  compact: true
  label: "Article"
  headline: "Self-improving software: what a CEO has to decide first"
  subheadline: "Agents can already read errors and tickets and propose a fix. Someone still has to tell them what to improve, and check that they did."
cta_band:
  text: "Want to hand part of this work to agents without losing control? Describe your situation."
  button_text: "Get in touch"
  button_url: "/en-us/contact/"
---

## The idea

AI agents write a growing share of the code, while feedback from production is often still handled by hand. Errors sit in one tool, usage analytics in a second, support tickets in a third. Someone pulls it all together, writes a request, and prioritizes it for next week.

That work can now go to agents: they read the signals, group what belongs to the same problem, and propose the fix.

## Why this concerns leadership

The idea goes beyond technology. When fixing gets cheaper, the question becomes: what should be fixed, and in the name of what?

Examples abound. Answering support faster can lower the quality of the answers. Following up with prospects more often can raise sales and wear out customers. These trade-offs already existed, often implicitly, settled case by case in a meeting. For a machine to take them into account, they have to be written down.

## Four decisions to make before automating

**1. Write down what “better” means.** A few numeric goals, and above all the limits no improvement may cross: a minimum margin, a response time, an acceptable error rate. A goal on its own ends up being met at the expense of whatever isn’t measured.

**2. Require proof before each change.** Opening a pull request is only the beginning. The hardest part comes next. A change has to be replayed on past cases, tested on data the agent has never seen, and judged by criteria it can’t modify. Without that, the agent mostly learns to pass its own exam.

**3. Name someone accountable.** In a small or mid-sized company, someone answers to a customer for a mistake. So autonomy can be earned in stages: a person approves every change, then some categories go automatic with sampled checks, and return to approval if results drop.

**4. Decide what agents can read and write.** A customer ticket contains personal data, and the GDPR applies. It also contains text written by anyone, which can slip in instructions aimed at the agent. An agent that reads every ticket and writes directly to the code combines those risks. So mask what needs masking, limit how long data is kept, and separate reading signals from the right to publish.

## Where a small or mid-sized company can start

There’s no need to aim at all of the company’s software. It’s better to start where feedback already exists:

1. **Find the carrying.** Where do your teams copy information from one tool to another so that someone can decide? That’s the simplest work to remove.
2. **Pick a process a person already reviews.** Lead qualification, document sorting, support replies. Each human correction shows what was expected, and becomes data to learn from.
3. **Measure before automating.** The cost per case and the share of cases a person corrects give you a starting point. Without them, nobody can tell whether the system is improving.
4. **Have changes proposed, and keep the approval.** The agent prepares the change and its proof, and a person accepts or rejects it in minutes.
5. **Check after release.** Did the promised gain happen? That measurement decides which categories of change you can delegate next.

## The example of Millstream

Monolithic Lab develops [Millstream](/apps/millstream/), a pipeline platform that mixes code, AI agents and human decisions, still pre-release. Its production analyses are computed by rules, with no AI. An agent drafts proposals, the engine validates them on history, and a person accepts them.

In its test scenario, on synthetic data that follows a rule, the proposed code replaced the agent on 260 of 270 cases, and the next day’s agent cost fell to 5.2% of the starting cost, sampled checks included. That figure shows the loop working end to end. On a real process, the result depends on its data. [The technical detail](https://millstream.dev/blog/self-improving-pipelines) is on the Millstream site.

## How this connects to the CTO role

These four decisions belong to leadership, and someone has to make them workable: turn goals into measures, set the rules of proof, define access, and say what gets delegated and when. In a small or mid-sized company, that work falls to the technology lead.

That is Monolithic Lab’s approach, as a [fractional CTO](/en-us/fractional-cto/) or an [interim CTO](/en-us/interim-cto/), as part of the company’s transformation.

[AI transformation in detail](/en-us/ai-transformation/)

## Source

Boris Tane, [“Self-improving software is inevitable”](https://boristane.com/blog/self-improving-software-is-inevitable/), October 2026.
