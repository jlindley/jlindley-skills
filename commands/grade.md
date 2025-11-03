---
description: Analyze current session quality with grades and actionable insights
---

Perform a holistic analysis of the current session from start to this point.

## Analysis Process

1. **Review the conversation history** from session start to now
2. **Identify 3-10 factors** that were most relevant and impactful to this session
   - Auto-detect based on session type (dev work, research, brainstorming, debugging, etc.)
   - Include both Claude's performance AND external factors (instruction quality, codebase state, documentation, etc.)
   - Focus on factors that actually dominated or impacted the session
3. **Grade each factor** using traditional academic scale (A+, A, A-, B+, B, B-, C+, C, C-, D, F)
   - A range: Excellent - met or exceeded best practices
   - B range: Good - solid work with minor areas for improvement
   - C range: Acceptable - got the job done but with notable issues
   - D range: Poor - significant problems that hindered progress
   - F: Failed - critical failures or complete misses
4. **Write 1-2 sentence explanations** for each grade with specifics about what happened and how it impacted the session
5. **Generate actionable suggestions in two categories:**
   - **Session-specific insights (3-5)** - Tactical next steps for current work, process improvements for this session
   - **Meta insights (1-3)** - Systemic observations about how we're working together, the tooling, skills ecosystem, recurring patterns, automation opportunities, skill conflicts/gaps, architectural debt worth addressing long-term
6. **Write a narrative summary** (2-3 sentences) of overall session quality and key themes

## Output Format

```
# Session Analysis

[2-3 sentence narrative summary of overall session quality and key themes]

## Factor Grades
[Ordered by importance/impact, not alphabetically or by grade]

**[Factor name]: [Grade]**
[1-2 sentence explanation with specifics]

**[Factor name]: [Grade]**
[1-2 sentence explanation with specifics]

[Continue for all 3-10 factors]

## Session-Specific Insights

1. [Tactical next step or process improvement for this work]
2. [...]
3. [...]

[3-5 insights total]

## Meta Insights

1. [Systemic observation about tooling, skills, patterns, or ecosystem]
2. [...]

[1-3 insights total]
```

## Important Guidelines

- **Be honest** - Grade critically and fairly, including external factors
- **Be specific** - Reference actual events from the session, not generic observations
- **Order by impact** - Most session-defining factors first
- **Always include meta insights** - Don't skip the meta layer; look for patterns, skill conflicts, missing tools, ecosystem improvements
- **Focus suggestions** - High-impact, pragmatic changes over generic advice
- **Handle edge cases**:
  - Very short sessions: Note limited data, still provide analysis
  - Sessions with failures: Grade honestly, focus suggestions on recovery
  - Multi-topic sessions: Identify dominant thread or grade each major thread

## Example Factors by Session Type

**Dev work:**
- Code quality, test coverage, instruction clarity, tool usage, skill adherence, problem-solving creativity, codebase architecture/debt

**Research/exploration:**
- Search strategy, context gathering, question quality, information synthesis, documentation quality

**Cross-cutting (any session):**
- Communication clarity, TodoWrite usage, efficiency, skill ecosystem issues, workflow automation opportunities
