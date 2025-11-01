# Final Report Template

The final report provides comprehensive summary of autonomous execution.

## File Location

`docs/plans/YYYY-MM-DD-feature-execution-report.md`

## Template

```markdown
# Autonomous Execution Report: [Feature Name]

**Executed:** [start time] to [end time] ([duration])
**Status:** [Completed/Timeout/Blocked]
**Design Doc:** [path]
**Implementation Plan:** [path]
**Execution Log:** [path]

## Executive Summary

[2-3 paragraphs narrative describing:
- What was built
- Overall success vs original plan
- Key creative decisions made
- Major deviations and why
- Final state of the work]

## Key Creative Decisions

1. **[Decision Title]**
   - **Original plan:** [what plan said]
   - **Decision:** [what was done instead]
   - **Reasoning:** [why this was necessary]
   - **Impact:** [which tasks were affected]

2. **[Decision Title]**
   ...

## Issues & Fixes

**Fixed during execution:**
- Critical: X fixed
- Important: X fixed
- Minor: X fixed

**Documented for later:**
- Minor: X documented (see execution log)

## Recommendations

**Next steps:**
- [Tasks that need finishing]
- [Technical debt to address]
- [Follow-up work needed]

## Detailed Execution Log

See: [execution log path]

---

## Task Completion Matrix

| # | Task                                     | Status | Plan vs Actual | Notes |
|---|------------------------------------------|--------|----------------|-------|
| 1 | Hook installation                        | ✅     | As planned     | No issues |
| 2 | Verification function                    | ⚠️     | Adapted        | Redis→memory cache |
| 3 | Repair modes                             | ✅     | As planned     | Fixed 2 Critical |
| 4 | Integration tests                        | ❌     | Blocked        | Missing API creds |
| 5 | Documentation                            | ⏭️     | Skipped        | Time limit |
| 6 | Very long task name that needs trunca... | ✅     | As planned     | Truncated to fit |

**Legend:** ✅ Completed as planned | ⚠️ Completed with changes | ❌ Blocked/Failed | ⏭️ Not attempted
```

**IMPORTANT:** Report ENDS after legend line. Do not add anything else. The matrix IS the summary.

## Key Design Decisions

**Matrix Position:**
- Absolutely LAST thing in the report
- First thing user sees when scrolling up from bottom of file
- Matrix itself shows all status information visually

**Matrix Formatting:**
- Task name: Max 40 characters (truncate with `...` if longer)
- Keep first 3 columns aligned (Task #, Task name, Status)
- Notes column can overflow - right border can break
- Fixed-width columns prevent misalignment

## Purpose

1. **Immediate status** - Matrix visible first when scrolling up from bottom
2. **Comprehensive context** - Narrative explains what happened
3. **Decision rationale** - Documents why plan was adapted
4. **Actionable next steps** - Clear recommendations
5. **Audit trail** - Full record of execution
