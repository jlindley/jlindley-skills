---
description: Critical end-of-session analysis - grade honestly by identifying what would have made the session better, surface problem-focused project/workflow insights, and identify dropped threads
allowed-tools: Read, Grep, Glob
model: claude-opus-4-6
---

Complete end-of-session cleanup and analysis focusing on insights and loose ends.

## Process

### 1. Session Summary

**Present a high-level summary of what happened in the session:**

```
# Session Summary

**What was accomplished:**
- [Up to 7 bullet points of what was delivered: features added, bugs fixed, files modified, decisions made]
- [Focus on WHAT was delivered, not how]

**Key artifacts:**
- [Commits made, if any]
- [Files created/modified]
- [Documentation or tooling updates]

**Session type:** [e.g., "Feature implementation", "Bug investigation", "Refactoring", "Planning", "Configuration"]
```

This summary provides context for the grades that follow.

### 2. Session Grade & Generate Insights

**Grade the session:**
- Review conversation history
- First, answer: **What would have made this session significantly better?** What was the most wasteful thing that happened — wrong approaches, unnecessary back-and-forth, missed opportunities to ask a question that would have saved 20 minutes, redundant work, agents dispatched that didn't earn their tokens? If nothing was wasteful, what kept this session from being exceptional?
- Then assign a single grade (A-F) that follows from that answer
- **BE CRITICAL AND HONEST:**
  - The answer to "what would have been better" IS the grade justification
  - Don't default to high grades - use the full A-F range
  - B is good. C is acceptable. A means genuinely excellent with minimal wasted motion — almost nothing would have improved it
  - If you can name 2+ things that would have meaningfully improved the session, it's not an A

**Insight Generation Principles (applies to both Project and Workflow insights):**
- Bias toward problems: ~2/3rds negative examples (problems/gaps), ~1/3rd positive
- If everything looks good, you're missing something - surface friction, confusion, overlooked problems
- Generate fewer if quality isn't there - don't force it

**Making Insights Actionable:**
- Be selective: Not every insight needs an action - many are just observations
- Three action types:
  1. **Just an observation:** State it, that's it
  2. **Document to persist:** Add to CLAUDE.md or project docs (only if systemic and worth maintenance cost)
  3. **Immediate action:** Something that needs closure this session (test something, audit files, etc.)
- Only suggest documenting if it's recurring, high-value, and genuinely helps future sessions
- Don't say "noted for next time" - either document it or it's gone (Claude doesn't automatically remember)

**Generate up to 3 Project Insights:**
- First, identify ALL potential insights about THIS specific project, domain, codebase, or problem space
- Then, select and report the top 3 most valuable insights (prioritize what's most important to understand)
- **Test:** Would this insight only matter to someone working on THIS project?

**Example Project Insights (mostly problems):**
- We fixed the endpoint but never understood WHY the original validation logic was written that way. **Action:** Add comment in code explaining the risk, investigate in next session.
- "User" means different things in auth vs database models - we used the wrong one. **Action:** Document in CLAUDE.md: "User entity: auth layer uses UserAccount, database uses UserProfile."
- The test suite passes but the feature doesn't work in staging - tests mock too much. Could be systemic mocking strategy issue.
- Fixed the query but never figured out why COUNT(*) was taking 40 seconds on a 1000-row table. Should have investigated.
- Database has 200+ tables but only 12 are actively used - this explained slow queries

**Generate up to 3 Workflow Insights:**
- First, identify ALL potential insights about Claude-user collaboration, tooling effectiveness, and tool orchestration
- Then, select and report the top 3 most valuable insights (prioritize what would help improve future sessions)
- **Test:** Would this insight apply to other projects or sessions?
- **CRITICAL ANALYSIS REQUIRED:** For sessions involving multi-agent skills or parallel dispatch: Did agents stay in their lanes (scope exclusions honored)? Did information flow correctly between phases (was context lost between waves)? Did the coordinator make good use of agent output or did it bottleneck/flatten? Were model assignments appropriate for the judgment required? For simpler sessions: How did tools/skills/workflows interact? Any gaps in tooling or capability?

**Example Workflow Insights (mostly problems):**
- Used Grep 6 times for variations of the same search - should have used Explore agent. **Action:** Check CLAUDE.md mentions when to use Explore vs. direct Grep.
- User said "fix the bug" but we implemented a different bug - spent 10 minutes on wrong issue. Should have clarified upfront.
- Started implementation without reading existing similar code - rewrote existing pattern. Need to search before implementing.
- Spent 20 minutes implementing a feature that a library already provides. **Action:** Add to CLAUDE.md: "Search for existing libraries before custom implementation."
- User providing a reference implementation upfront eliminated 4 clarification rounds

### 3. Scan for Loose Ends

**Scan conversation thoroughly for dropped threads:**
- Unanswered user questions buried in backscroll
- Errors/warnings mentioned but not resolved
- "TODO: come back to this" or "let's defer X"
- Test failures mentioned but not fixed
- Decisions deferred for "later"
- Features discussed but not implemented
- Tool rejections or failed operations
- Confusion or uncertainty expressed but never clarified
- Edge cases mentioned but not handled
- Follow-up validation that was intended but never happened
- Agents that returned empty, thin, or off-scope output (quality failures, not just errors)
- Multi-step skill chains where intermediate output was lost, ignored, or silently degraded
- Agent outputs that overlapped heavily despite scope exclusions

**Generate list of loose ends (up to ~7):**
- **Prioritize ruthlessly by risk/importance** - What could break? What will cause confusion later?
- **Be specific with context** - Don't just say "error not fixed", say which error, where, and why it matters
- **Include the risk** - What happens if this stays loose?
- **Format:** `[Risk Level - Category] Brief description - Risk if ignored`

**Example loose end reports:**

- `[High Risk - Testing] Never ran tests after refactoring 5 auth functions - Could have broken login`
- `[High Risk - Error] Database connection timeout in staging still occurring - User reported it, we moved on`
- `[High Risk - Decision] User asked "should we handle null values?" - We assumed yes but never confirmed`
- `[Medium Risk - Confusion] Both user and Claude uncertain about cache invalidation - Never tested the behavior`
- `[Low Risk - Cleanup] Generated debug files in tmp/ during investigation - Left behind, may confuse later`

### 4. Present Selections for Follow-Up (1 interaction)

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

### 5. Iterate Through Selected Items (1-by-1)

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

### 6. Quick Document Mining (if applicable)

**Check for new documentation artifacts this session:**
- New files in `docs/plans/`
- Execution reports, logs, implementation plans
- Design documents

**If found and not already handled:**
- Ask: "Want to run `/doc-cleanup` for these files?"
- If no: Note in summary that docs exist for later cleanup

### 7. Dense Summary

```
# Session Wrap

**Grade:** [A-F] - [What would have made it better]

**Key Insights:**
- [List project insights generated]
- [List workflow insights generated]

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
- **Quality over quantity** - Don't force 3 insights if only 1-2 are meaningful, or even 0 when called for
- **Critical thinking on tooling** - Workflow Insights MUST include analysis of how tools/skills/workflows worked together
- **Respect user time** - Checkbox selection is efficient, iterate only on what they selected
- **Don't lose work** - Main goal is ensuring nothing important gets forgotten
- **Be honest** - If something was left hanging, say so clearly
- **Have a high bar** - Listing a bunch of feel-good wins isn't the point

## Related Tools & Skills

- **Skill:** `backlog-management` - For creating properly formatted backlog items
- **Command:** `/grade` - Standalone grading (subset of what /wrap does)
- **Command:** `/doc-cleanup` - Dedicated doc cleanup (referenced if artifacts found)
