---
name: autonomous-execution
description: Use when executing implementation plans autonomously over multiple hours without human intervention, when you need to work overnight or during extended periods - executes plans to completion with creative decision-making, context preservation, state management for resume capability, and comprehensive reporting
tested_models:
  - claude-sonnet-4-5-20250929
---

# Autonomous Execution

## Overview

Execute implementation plans to completion without human intervention, making creative decisions to maintain forward progress while respecting design intent.

**Core principle:** Trust the design (WHY), adapt the plan (HOW), preserve context through subagents, maintain state for resume capability.

**Announce at start:** "I'm using the autonomous-execution skill to implement this plan."

## When to Use

**Use when:**
- Executing plan over multiple hours (overnight, extended sessions)
- Need autonomous creative decision-making when blocked
- Want resume capability after interruption or compaction
- Need context-efficient execution for long-running work

**Don't use when:**
- Plan needs human review checkpoints (use executing-plans)
- Quick execution in current session (use subagent-driven-development directly)
- Plan needs major revision (use brainstorming first)

## Prerequisites

**REQUIRED:**
- Dedicated worktree (use using-git-worktrees skill)
- Design document (the WHY - describes desired outcome and value)
- Implementation plan (the HOW - detailed tasks from writing-plans)

## Quick Reference: Execution Checklist

```
☐ Pre-execution setup
  ☐ Verify dedicated worktree (not main branch)
  ☐ Read design doc, understand WHY
  ☐ Read implementation plan
  ☐ Create state file (.autonomous-execution-state.json)
  ☐ Create execution log (docs/plans/YYYY-MM-DD-feature-execution-log.md)
  ☐ Create TodoWrite with all tasks

☐ For each task (main loop)
  ☐ Check time budget (stop if > 6 hours)
  ☐ Review task against design doc
  ☐ Adapt plan if needed (update plan file)
  ☐ Dispatch subagent for implementation
  ☐ Request code review (dispatch code-reviewer)
  ☐ If Critical/Important issues, dispatch subagent for fixes
  ☐ Handle blockers if any
  ☐ Update execution log
  ☐ Update state file
  ☐ Mark task complete in TodoWrite
  ☐ Ensure work is committed

☐ Completion
  ☐ Write final report (narrative + task matrix)
  ☐ Commit execution log + report
  ☐ Delete state file
```

## The Process

### Setup Phase

**1. Verify worktree isolation**

```bash
# Check you're in a dedicated worktree
git branch --show-current
# Must NOT be "main" or "master"
```

If in main branch: ERROR - "autonomous-execution requires isolated worktree"

**2. Read and understand design document (WHY)**

Read the design document thoroughly. Summarize understanding in execution log:
- What are we building?
- Why does it matter?
- What value does it provide?
- What are the key constraints?

Proceed autonomously with this understanding.

**3. Load implementation plan (HOW)**

Read implementation plan and extract all tasks. Create TodoWrite with all tasks.

If plan header says "REQUIRED SUB-SKILL: Use superpowers:executing-plans", update it to say "Using autonomous-execution skill for autonomous execution" to avoid confusion.

**4. Create state file**

Create `.autonomous-execution-state.json`:

```json
{
  "skill": "autonomous-execution",
  "started_at": "2025-11-01T10:00:00Z",
  "design_doc": "docs/plans/YYYY-MM-DD-feature-design.md",
  "implementation_plan": "docs/plans/YYYY-MM-DD-feature-implementation.md",
  "execution_log": "docs/plans/YYYY-MM-DD-feature-execution-log.md",
  "current_task_number": 1,
  "total_tasks": 12,
  "time_budget_hours": 6,
  "status": "in_progress"
}
```

See reference/state-file-format.md for full schema.

**5. Create execution log**

Create `docs/plans/YYYY-MM-DD-feature-execution-log.md`:

```markdown
# Execution Log: [Feature Name]

**Started:** [timestamp]
**Design Doc:** [path]
**Implementation Plan:** [path]
**Time Budget:** 6 hours

## Task 1: [Name] - [STATUS]
[Will be filled during execution]
```

See reference/execution-log-format.md for detailed structure.

**6. Announce start**

"I'm using the autonomous-execution skill to implement this plan. Time budget: 6 hours. Working autonomously with creative decision-making."

### Main Execution Loop

For each task, repeat this cycle:

**1. Pre-task checks**

Check elapsed time since start. If > 6 hours:
- Stop before starting new task
- Write wrap-up report
- Exit gracefully

**2. Review task against design**

- Does this task still make sense given prior work?
- Does it conflict with design doc (WHY)?
- Do we need to adapt the task based on what we learned?

If task needs adaptation:
- Update the task in the implementation plan file
- Document reasoning in execution log
- The updated plan is now the source of truth
- **Do NOT ask for permission** - make the decision autonomously

**When design conflicts with plan:**
- Design (WHY) ALWAYS takes precedence
- Adapt the plan autonomously
- Document the decision in execution log
- Continue forward without asking

**3. Dispatch subagent for implementation**

Use Task tool with general-purpose agent:

```
description: "Implement Task N: [task name]"

prompt: |
  You are implementing Task N from [implementation-plan-path].

  Read that task carefully. Your job is to:
  1. Implement exactly what the task specifies
  2. Follow TDD as specified in the task
  3. Commit your work
  4. Report back

  Context documents (read both for full context):
  - Design doc (WHY): [design-doc-path] - Read the full design doc to understand intent and constraints
  - Execution log (prior decisions): [execution-log-path] - See what decisions were made in earlier tasks

  Work autonomously. If you encounter problems, use your judgment to resolve them.

  When you make creative decisions, note them in your report (main agent will document in execution log).

  Report back concisely:
  - What you implemented (1-2 sentences)
  - Test results (pass/fail counts)
  - Files changed (list)
  - Any blockers encountered
  - Creative decisions made (if any)
```

**4. Request code review**

Get git SHAs and derive review filename from plan:

```bash
BASE_SHA=$(git log --oneline -10 | grep "Task $((N-1))" | head -1 | awk '{print $1}')
# If Task 1, use: BASE_SHA=$(git rev-parse HEAD~1)
HEAD_SHA=$(git rev-parse HEAD)

# Derive from plan filename: docs/plans/YYYY-MM-DD-feature-implementation.md
# → docs/reviews/YYYY-MM-DD-feature-task-N-review.md
PLAN_PREFIX=$(basename [implementation-plan-path] -implementation.md)
REVIEW_FILE="docs/reviews/${PLAN_PREFIX}-task-N-review.md"
```

Dispatch code-reviewer subagent:

```
description: "Review Task N: [task name]"
subagent_type: superpowers:code-reviewer

prompt: |
  Review the implementation of Task N from [implementation-plan-path].

  What was implemented: [summary from implementation subagent]
  Requirements: Task N in [implementation-plan-path]
  Base SHA: [BASE_SHA]
  Head SHA: [HEAD_SHA]

  Review the changes and:
  1. Write detailed review to [REVIEW_FILE] with:
     - Strengths
     - Critical issues (bugs, security, correctness)
     - Important issues (architecture, maintainability)
     - Minor issues (style, naming, comments)
     - Assessment
  2. Report back with ONLY counts (not details)

  Report back:
  - Review file: [REVIEW_FILE]
  - Critical: [count]
  - Important: [count]
  - Minor: [count]
```

**5. Handle code review feedback**

Code-reviewer returns issue counts only (detailed review written to file).

**If Critical or Important > 0:**

Dispatch subagent for fixes:

```
description: "Fix issues from Task N review"

prompt: |
  Read the code review at [REVIEW_FILE].

  Your job is to:
  1. Fix ALL Critical issues
  2. Fix ALL Important issues
  3. Use judgment on Minor issues (fix if easy, else document decision in review file)
  4. Commit your fixes
  5. Append to execution log at [execution-log-path]:

     ```markdown
     ### Code Review Fixes
     **Review:** [REVIEW_FILE]
     **Critical:** [count] fixed ([brief categories, e.g., "null pointer, race condition"])
     **Important:** [count] fixed ([brief categories, e.g., "error handling, type safety"])
     **Minor:** [fixed count] fixed, [accepted count] accepted
     **Key changes:** [1-2 sentence summary of main fixes]
     ```

  6. Report back

  Report back concisely:
  - Critical issues fixed: [count]
  - Important issues fixed: [count]
  - Minor issues: [fixed count / accepted count]
  - Any issues you couldn't fix (should be none)
```

**If all counts are 0:**

Skip to step 6 (no fixes needed).

**6. Handle blockers (if any)**

If implementation subagent reported blockers:

**Test failures:**
- Try alternative implementation approach
- Try workaround or simplified version
- If truly stuck: document in log, assess if other tasks can continue
- Some tasks may not block others - keep going if possible

**Missing dependencies:**
- Try alternative approach
- Find workaround
- Document creative solution in execution log

**Plan conflicts with design:**
- Design (WHY) takes precedence
- Adapt the plan
- Document reasoning

**7. Update execution log**

Append task summary to execution log (see reference/execution-log-format.md):

```markdown
## Task N: [Name] - [✅/⚠️/❌]
**Started:** [time] | **Completed:** [time]
**Status:** [Completed as planned / Adapted / Blocked]
**Files changed:** [list from implementation subagent]
**Tests:** [pass/fail counts from implementation subagent]
**Key decisions:** [if any]
**Plan deviations:** [if any]
```

Note: Fix subagent already wrote "Code Review Fixes" section to execution log (if there were issues to fix).

**8. Update state file**

Update `current_task_number` in state file. Increment.

**9. Mark complete and commit**

- Mark task completed in TodoWrite
- Ensure work is committed
- Continue to next task

### Completion Phase

When all tasks complete OR time budget reached:

**1. Write final report**

Create `docs/plans/YYYY-MM-DD-feature-execution-report.md`

See reference/final-report-template.md for full structure.

**Key sections:**
- Executive summary (narrative)
- Key creative decisions
- Issues fixed/documented
- Recommendations
- **Task Completion Matrix** (at end for quick scanning)

**2. Commit and cleanup**

```bash
git add docs/plans/*execution-report.md docs/plans/*execution-log.md
git commit -m "docs: autonomous execution report for [feature]"

# Clean up state file
rm .autonomous-execution-state.json
```

## Resume Capability

**If you are reading this skill and find `.autonomous-execution-state.json`:**

1. You are resuming autonomous execution (after interruption or compaction)
2. Read state file to understand where you are
3. Read execution log to understand what's been completed
4. Read current implementation plan (may have been adapted)
5. Continue from `current_task_number`
6. DO NOT restart from task 1
7. DO NOT re-read design doc (summarize from execution log if needed)

**Compaction resilience:**

If compaction happens mid-execution, the next task iteration will:
- Check state file exists
- Realize "I'm in autonomous-execution mode"
- Resume from current task
- Continue normally

## Context Preservation Strategy

**Main agent (autonomous-execution) should ONLY:**
- Hold design document understanding (initial read, summarize in execution log)
- Hold current implementation plan (file path, updated as needed)
- Hold execution log file path (append summaries, don't hold full content)
- Manage TodoWrite
- Track time

**Main agent should NEVER:**
- Read code files directly
- Run tests directly
- Debug issues directly
- All implementation work = subagent territory

**Subagents get fresh context each time:**
- Can read full design doc (no context cost to main agent)
- Can read full execution log (for prior task context)
- Can read implementation plan (for their specific task)
- Can read/write code files freely
- Should read deeply to understand WHY and make informed decisions

**Why:** Multi-hour execution needs aggressive context preservation FOR THE MAIN AGENT. Subagents have fresh context, so let them read everything they need.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I can just execute the plan directly" | Multi-hour execution needs infrastructure (state, logs, time tracking) |
| "Reading design doc is optional" | Design (WHY) is source of truth. Plan (HOW) adapts to WHY. |
| "I can track everything in memory" | Long sessions need persistent state for resume and cross-subagent context |
| "I'll run forever until done" | Time budgets prevent runaway resource consumption |
| "Reading code directly is fine" | Main agent reading code burns context. Subagents preserve main agent context. |
| "The plan is sacred" | Plans adapt. Design intent is sacred. |
| "This design conflict needs user confirmation" | Make autonomous decisions. Document in execution log. Continue forward. |
| "More information in report is better" | Matrix IS the summary. Nothing after legend line. |
| "Table formatting doesn't matter" | Misaligned columns make matrix hard to scan. Use fixed-width task names. |
| "Final report can be any format" | Users need task matrix at end for quick scanning when returning |
| "State file is overhead" | State file enables resume after interruption/compaction |
| "I'll create execution log later" | Execution log provides cross-subagent context during execution |

## Red Flags

**If you catch yourself:**
- Skipping design doc read
- Executing tasks directly without subagents
- Not creating state file or execution log
- Reading code files in main agent
- Following plan blindly when it conflicts with design
- **Asking for permission when design conflicts with plan**
- Running without time awareness
- Writing narrative-only final report
- **Adding content after task completion matrix**
- Using variable-width table columns (causes misalignment)

**STOP. Re-read this skill. Follow the process.**

## Integration

**Related skills:**
- **using-git-worktrees** - REQUIRED: Create isolated workspace before starting
- **writing-plans** - Creates the implementation plan this skill executes
- **requesting-code-review** - Implementation subagents use this
- **receiving-code-review** - Implementation subagents use this
- **systematic-debugging** - Fix subagents use this when stuck

**Workflow:**
```
brainstorming → writing-plans → autonomous-execution
                                       ↓
                                 (dispatches subagents following
                                  subagent-driven-development pattern)
```

## Remember

- Design (WHY) is source of truth
- Plan (HOW) adapts to design
- Subagents do all heavy lifting
- State file enables resume
- Execution log provides cross-task context
- Time budget prevents runaway execution
- Task matrix at end of report for quick scanning
- Creative decisions to maintain progress
- Commit frequently for safety
