---
description: Full session of documentation cleanup, archiving, and backlog mining
---

Comprehensive documentation reorganization focused on maintaining clarity and extracting value before deletion.

## Overview

Similar to what we did in the session where we cleaned up `docs/plans/`:
1. Propose cleanup strategy
2. Mine execution reports for backlog items (iterative 1-by-1 review)
3. Archive valuable design docs
4. Delete redundant execution artifacts
5. Commit changes

This is a **dedicated session** for doc cleanup, not a quick end-of-session task (use `/wrap` for that).

## Process

### Phase 1: Discovery & Strategy (5-10 minutes)

**Scan documentation directories:**
```bash
# Common locations
docs/plans/
docs/architecture/
docs/reviews/
docs/design/
[project-specific locations]
```

**Categorize files:**
- Design documents (architectural decisions, "why" rationale)
- Execution reports (summaries of completed work)
- Execution logs (detailed task-by-task progress)
- Implementation plans (detailed task breakdowns)
- Review documents (code review findings)
- Partial/abandoned plans
- Other documentation

**Propose strategy:**
```
## Cleanup Strategy

### KEEP (Archive to docs/architecture/history/)
- [List design docs with rationale]
- Total: X files

### DELETE (Redundant - value in git history)
- [List execution artifacts]
- Total: Y files

### REVIEW FOR BACKLOG
- [List files to mine]
- Estimated items: Z

**Proceed with this strategy?**
```

### Phase 2: Backlog Mining (15-30 minutes)

**For each file marked for review:**

1. Read the file
2. Extract potential backlog items from:
   - "Future Enhancements" sections
   - "Recommendations" sections
   - "TODO" comments
   - Deferred features (skipped tests, NotImplementedError)
   - "Long-term" suggestions

3. **Present items ONE AT A TIME:**
```
## Item X of Y: [Title]

**Source:** [filename:section]
**Context:** [Why mentioned, any supporting data]
**Current state:** [Already implemented? Duplicate? Still relevant?]

**Proposed backlog item:**
- Priority: [High/Medium/Low with rationale]
- Problem: [2-3 sentences]
- Related: [Links to source]

**Decision:** Add / Modify / Discard / Already exists as BX?
```

4. For "Add" decisions:
   - Use `backlog-management` skill for creation
   - Generate B-number with `issue --new-id`
   - Check for duplicates with `issue --list`
   - Proper formatting with Problem/Solution/Priority

5. Track decisions:
   - Items added: [B-numbers]
   - Items discarded: [reasons]
   - Duplicates found: [existing B-numbers]

### Phase 3: Archive & Delete (5-10 minutes)

**Archive design docs:**
```bash
mkdir -p docs/architecture/history
git mv [design-doc] docs/architecture/history/
```

**Delete execution artifacts:**
```bash
rm [execution-reports]
rm [execution-logs]
rm [implementation-plans]
```

**Create archive README if needed:**
`docs/architecture/history/CLAUDE.md` explaining:
- Purpose of archived docs
- Warning that designs may be outdated
- When to reference them

**Verify cleanup:**
```bash
ls docs/plans/  # Should be empty or minimal
ls docs/architecture/history/  # Should have design docs
```

### Phase 4: Commit (2-5 minutes)

**Stage only doc changes:**
```bash
git add docs/architecture/
git add docs/backlog/
git add -u docs/plans/
# DO NOT stage other working changes
```

**Commit with summary:**
```
docs: Clean up [directory] and archive design docs

- Archive X design documents to docs/architecture/history/
- Delete Y execution artifacts (logs, reports, plans)
- Create BZ, BZ+1, BZ+2 backlog items from mining
- [Any other relevant notes]
```

### Phase 5: Summary Report

```
# Documentation Reorganization Complete

## Archives Created
- Moved to docs/architecture/history/:
  - [filename]: [Why preserved]
  - Total: X files

## Files Deleted
- Execution artifacts: Y files (Z KB saved)
- Redundant with git history

## Backlog Items Created
- B7: [Title] (Priority) - [Source]
- B8: [Title] (Priority) - [Source]
- Total: N items

## Backlog Items Discarded
- [Title]: [Reason]
- Total: M items

## Repository State
- docs/plans/: [Empty / X files remaining]
- docs/architecture/history/: X design docs preserved
- Git: Clean commit, all changes staged

## Recommendations
1. [Any follow-up actions]
2. [Suggested cleanup for other directories]
```

## Usage

```bash
# Interactive full cleanup
/doc-reorg

# Focus on specific directory
/doc-reorg docs/plans/

# Quick mode (minimal interaction)
/doc-reorg --quick  # Auto-discard "nice to have" items
```

## Important Guidelines

- **Propose strategy first** - Don't start deleting without approval
- **Mine before delete** - Always extract value from execution reports
- **Iterative review** - Present backlog items one-by-one for decision
- **Respect user time** - Quick discard decisions are fine, don't belabor
- **Commit only docs** - Ignore other working changes in repo
- **Preserve git history** - Deleted files are still accessible in history
- **Create archive README** - Help future readers understand archived docs

## Related Tools & Skills

- **Skill:** `backlog-management` - For creating properly formatted backlog items
- **Command:** `issue --new-id` - Generate next B-number for new items
- **Command:** `issue --list` - Check existing backlog for duplicates
- **Command:** `issue B6` - Display existing issues during duplicate checking
- **Command:** `/wrap` - For lighter end-of-session cleanup (reference if user wants quick version)

## Example Session Flow

1. User: `/doc-reorg`
2. Scan docs/plans/, propose strategy
3. User: "Looks good"
4. Mine 3 execution reports, present 8 potential items
5. User decisions: Add 2, discard 6
6. Archive 5 design docs, delete 10 execution artifacts
7. Create .gitkeep, archive README
8. Commit changes
9. Summary report
10. Done in ~20-30 minutes
