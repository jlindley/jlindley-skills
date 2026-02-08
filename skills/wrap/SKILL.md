---
description: Critical end-of-session analysis - surface problem-focused insights on the project, workflow, and human-AI partnership, and identify dropped threads
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

This summary provides context for the insights that follow.

### 2. Generate Insights

**Start by answering: What would have made this session significantly better?** What was the most wasteful thing that happened — wrong approaches, unnecessary back-and-forth, missed opportunities to ask a question that would have saved 20 minutes, redundant work, agents dispatched that didn't earn their tokens? Name at least one thing Claude specifically should have done differently before attributing waste to external factors. This answer drives the insights below.

**Insight Generation Principles (applies to all insight categories):**
- Bias toward problems: ~2/3rds negative examples (problems/gaps), ~1/3rd positive
- If everything looks good, you're missing something - surface friction, confusion, overlooked problems
- Generate fewer if quality isn't there - don't force it

**Making Insights Actionable:**
- Be selective: Not every insight needs an action - many are just observations
- Three action types:
  1. **Just an observation:** State it, that's it
  2. **Persist it:** Write it down somewhere specific (see below)
  3. **Immediate action:** Something that needs closure this session (test something, audit files, etc.)
- Don't say "noted for next time" - either write it down or it's gone (Claude doesn't automatically remember)
- Only suggest persisting if it's a concrete, repeatable pattern — not situational advice

**Where to persist (be specific when suggesting):**
- **Project CLAUDE.md** — Instructions that should govern Claude's behavior on this project. Conventions, entity definitions, architectural rules, "always/never" guidance. _Example: "User entity: auth layer uses UserAccount, database uses UserProfile."_
- **User-level ~/CLAUDE.md** — Cross-project patterns about how to work effectively with this user. Collaboration preferences, workflow patterns, tool usage lessons. _Example: "Jim prefers front-loading constraints over iterative clarification."_
- **Skill file** — When a skill's instructions are wrong, incomplete, or conflict with another skill. Fix the source, don't work around it in CLAUDE.md.
- **Project docs** — When the project's own documentation is stale or missing context that caused confusion this session.

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
- **INSTRUCTION SYSTEM AUDIT:** Use Glob and Read to check the actual instruction files — don't audit from memory. Read the project CLAUDE.md, ~/CLAUDE.md, and any skill files that were active this session. Look for conflicts, overlaps, or gaps in the instruction stack — skills, CLAUDE.md, project docs, and system-level guidance all pile up to produce behavior. When they contradict or interact in unintended ways, the result is Claude doing something subtly wrong that nobody explicitly designed. These are the highest-value workflow insights:
  - Two skills that fire on overlapping triggers and give conflicting guidance
  - CLAUDE.md rules that contradict a skill's instructions
  - Project docs that describe patterns CLAUDE.md doesn't know about, when the gap caused confusion this session
  - A skill that assumes a convention the project doesn't follow
  - Instructions that were correct once but are now stale
  - Gaps: behavior that surprised the user because no instruction covers it
- For multi-agent sessions specifically: Did agents stay in their lanes? Did information flow between phases? Were model assignments appropriate?

**Example Workflow Insights (mostly problems):**
- The `writing-skills` skill says to use TDD, but CLAUDE.md says "never commit test files" — these interact poorly when testing skills that need git repos. **Action:** Add guidance to CLAUDE.md clarifying the tmp/ testing workflow.
- The `autonomous-execution` skill and `executing-plans` skill both trigger on "execute this plan" — unclear which takes precedence. Should have explicit disambiguation.
- Started implementation without reading existing similar code - rewrote existing pattern. Need to search before implementing.
- Spent 20 minutes implementing a feature that a library already provides. **Action:** Add to CLAUDE.md: "Search for existing libraries before custom implementation."
- User providing a reference implementation upfront eliminated 4 clarification rounds

**Generate up to 3 Partnership Insights:**
- Evaluate the human side of the collaboration — not to assign blame, but because human habits are the highest-leverage improvement vector
- **Test:** Does this insight help the user get more out of Claude across any project?
- **Ground in observable events** — cite specific countable moments from the session (N clarification rounds, N corrections, N turns before first action), not subjective assessments like "delegation could have been clearer"
- Focus areas:
  - **Context-setting:** Did the session start with enough upfront context (files, constraints, success criteria), or did Claude spend early turns inferring intent?
  - **Delegation clarity:** Were instructions specific enough to act on, or vague enough that Claude had to guess?
  - **Intervention timing:** Did the user course-correct early when things went off-track, or let Claude run in the wrong direction?
  - **Navigation vs driving:** Did the user stay strategic (intent, architecture, acceptance criteria) or drop into implementation details Claude could have handled?
  - **Challenge & verification:** Did the user critically evaluate Claude's outputs, or accept them wholesale? Zero pushback across a complex session is a smell, not a success.

**Example Partnership Insights:**
- 4 clarification rounds before first action. Front-loading the error message, file, and expected behavior would have saved ~10 minutes. **Action:** Add to ~/CLAUDE.md: "Start task descriptions with: error/goal, relevant files, constraints."
- User let Claude refactor 3 files before mentioning the existing utility that already handled the case. Sharing known constraints upfront prevents wasted motion.
- User accepted all 5 code suggestions without review in a session touching auth logic. At least spot-checking security-sensitive changes catches errors Claude won't flag on its own.

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

**Compaction check:**
After listing loose ends, check whether the session has been autocompacted. To find the current session's JSONL log: derive the project directory name by replacing `/` with `-` in the CWD path (e.g., `/Users/jlindley/Code/foo` → `-Users-jlindley-Code-foo`), then find the most recently modified `.jsonl` in `~/.claude/projects/<that-dir>/`. Count its `user` and `assistant` type entries and compare to the number of conversation turns visible in context. If the JSONL has significantly more entries, compaction occurred and early conversation content is only in the log file, not in context.

Report: `**Session compacted:** Yes/No. [If yes: "~N turns compacted away. Full transcript available in session JSONL if deeper review needed."]`

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
[ ] Discuss: Context-setting pattern (partnership)
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

**When ready to move on, offer to persist if applicable:**
- Draft the exact line/paragraph to add and name the specific file
- Only show destinations relevant to this insight (don't offer "Update skill file" if no skills were involved)
- Make it a single confirmation: "Add this to [file]? y/n"
- If no persist action fits, just move on
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

**What would have been better:** [1-2 sentence answer]

**Key Insights:**
- [List project insights generated]
- [List workflow insights generated]
- [List partnership insights generated]

**Loose Ends:** [Count] ([X addressed, Y deferred])

**Actions Taken:**
- [Backlog items created with B-numbers]
- [Documentation updates made]
- [Skills created/updated]

**Next:** [Top 1-2 concrete actions based on remaining loose ends or insights]
```

## Usage

```bash
/wrap
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
- **Command:** `/grade` - Standalone session quality check (subset of what /wrap does)
- **Command:** `/doc-cleanup` - Dedicated doc cleanup (referenced if artifacts found)
