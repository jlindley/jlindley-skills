---
description: Quick session quality check - single honest grade driven by what would have been better, plus actionable insights
model: claude-opus-4-6
---

Standalone grading — a subset of what `/wrap` does, without the interactive follow-up, document mining, or loose ends scan.

## Process

1. **Review the conversation history** from session start to now
2. **Answer: What would have made this session significantly better?** What was the most wasteful thing that happened — wrong approaches, unnecessary back-and-forth, missed opportunities to ask a question that would have saved 20 minutes, redundant work, agents dispatched that didn't earn their tokens? If nothing was wasteful, what kept this session from being exceptional?
3. **Assign a single grade (A-F)** that follows from that answer
4. **Generate insights** (session-specific and meta)

## Grading

- The answer to "what would have been better" IS the grade justification
- Don't default to high grades — use the full A-F range
- B is good. C is acceptable. A means genuinely excellent with minimal wasted motion — almost nothing would have improved it
- If you can name 2+ things that would have meaningfully improved the session, it's not an A

## Output Format

```
# Session Grade

**What would have been better:** [1-3 concrete things that would have improved the session]

**Grade: [A-F]**

## Session Insights (up to 3)
- [Patterns from this specific session, what went well/poorly, process observations]

## Meta Insights (up to 3)
- [Broader learnings beyond this session — tooling, skills, collaboration patterns]
- For sessions involving multi-agent skills or parallel dispatch: Did agents stay in their lanes? Did information flow correctly between phases? Were model assignments appropriate?
```

## Important Guidelines

- **Be honest** — grade critically; reference actual events, not generic observations
- **Bias toward problems** — ~2/3 negative insights, ~1/3 positive
- **Don't force insights** — fewer high-quality beats more filler
- **Always include meta layer** — how did tools/skills/workflows interact?
- **Focus suggestions** — high-impact, pragmatic changes over generic advice
