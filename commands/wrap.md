---
description: Critical end-of-session analysis - grade honestly (A-F on communication, execution, standards), surface problem-focused project/workflow insights, and identify dropped threads
allowed-tools: Read, Grep, Glob
model: claude-opus-4-5-20251101
---

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

**Grade the session (3 dimensions):**
- Review conversation history
- Assign three separate grades (A-F) with brief rationale for each:
  1. **Communication/Collaboration Quality:** Clarity of exchanges, responsiveness to feedback, alignment on goals
  2. **Execution Quality:** Simplicity, directness, effectiveness, efficiency of implementation
  3. **Adherence to Standards:** Following CLAUDE.md, test requirements, commit patterns, coding standards
- **BE CRITICAL AND HONEST:**
  - Focus on what happened, not detailed rubrics
  - Don't default to high grades - use the full A-F range
  - Grade on what was delivered, not effort or difficulty
  - Look for missed opportunities: What should have been done proactively but wasn't?
  - Consider what slowed things down or created unnecessary work
  - If you were reactive instead of proactive, that should lower the grade
  - B is good, C is acceptable, A means genuinely excellent with minimal wasted motion

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

## Usage

```bash
/wrap
```

## Important Guidelines

- **Focus on value** - Insights and loose ends are what matter
- **Quality over quantity** - Don't force 3 insights if only 1-2 are meaningful, or even 0 when called for
- **Critical thinking on tooling** - Workflow Insights MUST include analysis of how tools/skills/workflows worked together
- **Be honest** - If something was left hanging, say so clearly
- **Have a high bar** - Listing a bunch of feel-good wins isn't the point
