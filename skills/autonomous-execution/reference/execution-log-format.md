# Execution Log Format

The execution log provides human-readable progress tracking and cross-subagent context sharing.

## File Location

`docs/plans/YYYY-MM-DD-feature-execution-log.md`

## Structure

```markdown
# Execution Log: [Feature Name]

**Started:** [timestamp]
**Design Doc:** [path]
**Implementation Plan:** [path]
**Time Budget:** 6 hours

## Task 1: [Name] - ✅ COMPLETED
**Started:** [time] | **Completed:** [time]
**Status:** Completed as planned
**Files changed:** src/foo.py, tests/test_foo.py
**Key decisions:** None
**Plan deviations:** None

## Task 2: [Name] - ⚠️ COMPLETED WITH CHANGES
**Started:** [time] | **Completed:** [time]
**Status:** Adapted approach mid-task
**Files changed:** src/bar.py, tests/test_bar.py, config/settings.py
**Key decisions:**
- Switched from Redis to in-memory cache (Redis unavailable)
- Added cache invalidation hook
**Plan deviations:** Task 2 updated in plan file (Redis → in-memory)
**Issues fixed:** 2 Critical, 1 Important
**Issues documented:** 1 Minor (magic number in cache size)

## Task 3: [Name] - ❌ BLOCKED
**Started:** [time] | **Stopped:** [time]
**Status:** Blocked on external dependency
**Attempted:** [brief description]
**Blocker:** External API requires credentials not available in test environment
**Next steps:** Continuing with Task 4, will revisit if credentials become available
```

## Status Indicators

- ✅ **COMPLETED** - Task completed as planned
- ⚠️ **COMPLETED WITH CHANGES** - Task completed but required adaptation
- ❌ **BLOCKED** - Task could not be completed
- ⏭️ **SKIPPED** - Task not attempted (time limit or dependency)

## Purpose

1. **Cross-subagent context** - Later subagents read this to understand prior decisions
2. **Resume capability** - Shows what's been done if execution interrupted
3. **Audit trail** - Documents why plan was adapted
4. **Progress visibility** - Human can check progress during execution

## Update Frequency

After each task completion, append summary (3-5 lines per task).
