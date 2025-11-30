---
description: Wrap up session with grade, doc archiving, backlog mining, and issue detection
---

Complete end-of-session cleanup and analysis focusing on insights and loose ends.

## Process

### 1. Session Grade & Generate Insights (5-7 minutes)

**Grade the session:**
- Review conversation history
- Assign overall grade (A-F) with 1-sentence rationale
- Focus on what happened, not detailed rubrics

**Generate up to 3 session-specific insights:**
- Patterns from this specific session
- What went well/poorly in execution
- Process observations about the work itself

**Generate up to 3 meta insights:**
- Broader learnings that apply beyond this session
- Principles to remember for future work
- Skills/patterns worth repeating
- **CRITICAL ANALYSIS REQUIRED:** How did tools/skills/agents/workflows interact? What worked well or poorly in the orchestration? What could be improved about how we use the available capabilities? Any gaps in tooling/skills/workflow?

(Generate fewer if quality isn't there - don't force it)

### 2. Scan for Loose Ends (5 minutes)

**Scan conversation for dropped threads:**
- Unanswered user questions buried in backscroll
- Errors/warnings mentioned but not resolved
- "TODO: come back to this" or "let's defer X"
- Test failures mentioned but not fixed
- Decisions deferred for "later"
- Features discussed but not implemented
- Tool rejections or failed operations

**Generate list of loose ends** (up to ~5, prioritize by risk/importance)

### 3. Present Selections for Follow-Up (1 interaction)

Use `AskUserQuestion` tool with `multiSelect: true` for up to THREE separate questions (one per category). The tool allows up to 4 questions, each with up to 4 options.

**Tool constraints:**
- Maximum 4 questions per AskUserQuestion call
- Maximum 4 options per question
- If a category has more than 4 items, prioritize the top 4 by importance/risk

**CRITICAL: Option labels must clearly indicate what happens when selected:**

- **Discuss items** (insights, complex loose ends) → Will pause for drill-down conversation
  - Label format: `"Discuss: [topic]"` or `"Explore: [topic]"`

- **Action items** (simple fixes, cleanup) → Will just execute and move on
  - Label format: `"Fix: [what]"` or `"Clean: [what]"` or `"Delete: [what]"`

The user should never be surprised by whether an item will pause for input or just execute.

**Structure as 2-3 multi-select questions:**

```
Question 1 - Insights (multiSelect: true):
[ ] Discuss: Panel workflow effectiveness
[ ] Discuss: Voice consistency patterns
[ ] Explore: Worksheet as escape hatch for density

Question 2 - Loose Ends (multiSelect: true):
[ ] Delete: stale tmp/ reports from earlier session
[ ] Fix: checked box in active TODO list
[ ] Discuss: unaddressed modified scripts (complex decision)
```

User checks items across all questions, submits once.

### 4. Iterate Through Selected Items (1-by-1)

For each checked item in order, handle based on its prefix:

---

**Action items (Fix:/Delete:/Clean:) → Execute immediately, no pause:**

Just do the thing and report briefly:
```
✓ Deleted stale tmp/ reports (3 files removed)
✓ Fixed checked box — converted to "Model script" reference
```

Move on to next item without asking for input.

---

**Discuss items (Discuss:/Explore:) → Pause for drill-down:**

**For insights:**
```
## Discussing: [Insight text]

**Why this matters:** [Elaboration on the insight]
**How to apply:** [Concrete suggestions for future sessions]
**Related patterns:** [Connections to other practices/skills]

[Pause for user response — they may want to explore further, challenge the insight, or move on]

**When ready to move on, options:**
- Add note to project CLAUDE.md
- Create new skill or update existing skill
- Update existing documentation
- Continue (no capture needed)
```

**For complex loose ends:**
```
## Discussing: [Loose end description]

**Context:** [When/why it came up in session]
**Risk if ignored:** [What happens if we forget this]
**Options I see:** [2-3 ways to handle this]

[Pause for user input on how to proceed]
```

If user decides to create backlog item:
- Use `backlog-management` skill to create properly formatted issue
- Include session context in "Related" section

### 5. Quick Document Mining (if applicable)

**Check for new documentation artifacts this session:**
- New files in `docs/plans/`
- Execution reports, logs, implementation plans
- Design documents

**If found and not already handled:**
- Ask: "Want to run `/doc-cleanup` for these files?"
- If no: Note in summary that docs exist for later cleanup

### 6. Dense Summary

```
# Session Wrap

**Grade:** [A-F] - [1 sentence rationale]

**Key Insights:**
- [List session insights generated]
- [List meta insights generated]

**Loose Ends:** [Count] ([X addressed, Y deferred])

**Actions Taken:**
- [Backlog items created with B-numbers]
- [Documentation updates made]
- [Skills created/updated]

**Next:** [Top 1-2 concrete actions based on remaining loose ends or insights]
```

## Usage

```bash
# Standard end-of-session wrap
/wrap

# Quick wrap (skip follow-up prompts, just show grade + loose ends)
/wrap --quick
```

## Important Guidelines

- **Focus on value** - Insights and loose ends are what matter
- **Quality over quantity** - Don't force 3 insights if only 1-2 are meaningful
- **Critical thinking on tooling** - Meta insights MUST include analysis of how tools/skills/workflows worked together
- **Respect user time** - Checkbox selection is efficient, iterate only on what they selected
- **Don't lose work** - Main goal is ensuring nothing important gets forgotten
- **Be honest** - If something was left hanging, say so clearly

## Related Tools & Skills

- **Skill:** `backlog-management` - For creating properly formatted backlog items
- **Command:** `/grade` - Standalone grading (subset of what /wrap does)
- **Command:** `/doc-cleanup` - Dedicated doc cleanup (referenced if artifacts found)
