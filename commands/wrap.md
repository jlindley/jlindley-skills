---
description: Wrap up session with grade, doc archiving, backlog mining, and issue detection
---

Complete end-of-session cleanup and analysis to ensure no work is lost and documentation is organized.

## Process

### 1. Session Grade (5 minutes)

Run the same analysis as `/grade`:
- Review conversation history
- Grade 3-10 key factors
- Provide session-specific and meta insights
- Narrative summary

### 2. Document Mining & Archiving (10-15 minutes)

**Identify recent documentation:**
- Look for new files in `docs/plans/` created/modified this session
- Execution reports (*-execution-report.md)
- Execution logs (*-execution-log.md)
- Implementation plans (*-implementation.md, *.md with detailed task lists)
- Design documents (*-design.md)

**Archive strategy:**
- **Design docs** → Move to `docs/architecture/history/` (preserve rationale)
- **Execution artifacts** → Delete (logs, reports, implementation plans - git history preserves)
- **Partial/abandoned plans** → Delete (git history preserves)

**Before archiving/deleting, mine for value:**
- Extract "Future Enhancements" sections
- Note "Recommendations" or "TODO" items
- Identify deferred features (skipped tests, NotImplementedError guards)
- Check for unresolved issues mentioned in reviews

### 3. Backlog Item Suggestions (5-10 minutes)

**Mine the current session only** for potential backlog items:
- TODOs or deferred work mentioned in conversation
- Features discussed but not implemented
- Issues discovered but not fixed
- Future enhancements noted in docs created this session
- Code comments like "TODO:", "FIXME:", "NotImplementedError"

**DO NOT load existing backlog items** - that's a rabbit hole. Only look at this session's work.

**If items found**, present **one at a time** for user decision:

```
## Potential Item X of Y: [Title]

**Source:** [Current session context or filename:line if from new code]
**Context:** [Why this was deferred/recommended]
**Evidence:** [Data supporting this, e.g., "mentioned in conversation", "TODO comment in new code"]

**Proposed Priority:** [High/Medium/Low with rationale]

**Action needed:** Add to backlog / Modify / Discard?
```

**If no items found**, simply state: "No new backlog items identified from this session."

For each "Add to backlog":
- Use `backlog-management` skill to create properly formatted issues
- Include source reference in "Related" section

### 4. Unaddressed Issues Scan (3-5 minutes)

**Scan conversation for lost context:**
- User questions that got buried in backscroll
- Errors/warnings that were never resolved
- "TODO: come back to this" comments
- Tool rejections or failed operations
- Test failures mentioned but not fixed
- Decisions deferred for "later"

**Format warnings:**
```
⚠️ **Unaddressed Issue:** [Brief description]
**Location:** [Message/file where mentioned]
**Impact:** [Why this matters]
**Suggested action:** [What to do about it]
```

### 5. Summary Report

```
# Session Wrap-Up

## Grade Summary
[Brief summary from grading section]

## Documentation Actions
- Archived: X design docs → docs/architecture/history/
- Deleted: Y execution artifacts
- Preserved in git history: [list if significant]

## Backlog Items Created
- B7: [Title] (Priority)
- B8: [Title] (Priority)
- [Total: X items]

## Backlog Items Discarded
- [Title]: [Reason]
- [Total: Y items]

## Unaddressed Issues
[List warnings, or "None detected"]

## Next Session Recommendations
1. [Based on grade insights and unaddressed issues]
2. [...]
```

## Usage

```bash
# End of any work session
/wrap

# Wrap with specific focus
/wrap --focus=backlog  # Emphasize backlog mining
/wrap --focus=issues   # Emphasize unaddressed issue detection
```

## Important Guidelines

- **Be thorough but efficient** - Don't get bogged down, user wants to wrap up
- **Respect user judgment** - Quick discard decisions are fine
- **Preserve context** - Link everything back to sources
- **Don't lose work** - The main goal is ensuring nothing important gets forgotten
- **Be honest in warnings** - If something was left hanging, say so clearly

## Related Tools & Skills

- **Skill:** `backlog-management` - For creating properly formatted backlog items
- **Command:** `/grade` - Session grading component (already integrated)
- **Command:** `/doc-cleanup` - For more thorough doc cleanup (reference if needed)
