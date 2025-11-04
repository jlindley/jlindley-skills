---
name: autonomous-execution
description: Use when executing implementation plans or backlog items autonomously over multiple hours without human intervention, when you need to work overnight or during extended periods - executes work to completion with creative decision-making, context preservation, state management for resume capability, and comprehensive reporting
tested_models:
  - claude-sonnet-4-5-20250929  # Primary model, extensively tested
  # Note: Not tested on Haiku or Opus - complex autonomous workflows may require Sonnet-level capabilities
---

# Autonomous Execution

## Overview

Execute implementation plans or backlog items to completion without human intervention, making creative decisions to maintain forward progress while respecting design intent.

**Core principle:** Trust the design (WHY), adapt the plan (HOW), preserve context through subagents, maintain state for resume capability.

**Announce at start:** "I'm using the autonomous-execution skill to implement this plan/backlog item."

## When to Use

**Use when:**
- Executing implementation plan over multiple hours (overnight, extended sessions)
- Executing backlog item autonomously without human supervision
- Need autonomous creative decision-making when blocked
- Want resume capability after interruption or compaction
- Need context-efficient execution for long-running work

**Don't use when:**
- Plan needs human review checkpoints (use executing-plans)
- Quick execution in current session (use subagent-driven-development directly)
- Plan needs major revision (use brainstorming first)
- Backlog item is trivial (< 30 minutes - just do it directly)

## Prerequisites

**For implementation plans:**
- Dedicated worktree (use using-git-worktrees skill)
- Design document (the WHY - describes desired outcome and value)
- Implementation plan (the HOW - detailed tasks from writing-plans)

**For backlog items:**
- Dedicated worktree (use using-git-worktrees skill OR project setup script)
- Backlog item file (contains both WHY in Problem section and HOW in Proposed Solution section)

## Quick Reference: Execution Checklist

```
☐ Pre-execution setup
  ☐ Verify dedicated worktree (not main branch)
  ☐ Read design doc, understand WHY
  ☐ Read implementation plan
  ☐ Create state file (tmp/.autonomous-execution-state.json)
  ☐ Create execution log (tmp/execution-log.md)
  ☐ Create TodoWrite with all tasks

☐ For each task (main loop)
  ☐ Check time budget (stop if > 6 hours)
  ☐ Review task against design doc
  ☐ Adapt plan if needed (update plan file)
  ☐ Dispatch subagent for implementation
  ☐ VERIFICATION, INTEGRATION & CODE REVIEW CHECKPOINT
    ☐ Dispatch subagent to verify FOUR things:
      1. Tests pass (isolation)
      2. Integration (connects to previous/future tasks, dependencies exist)
      3. Completeness (handles errors/edge cases, not just happy path)
      4. Code review (write review file if issues found)
    ☐ If ANY fail: go back to implementation with feedback
    ☐ If all pass → proceed to handle blockers
  ☐ Handle blockers if any
  ☐ Update execution log
  ☐ Update state file
  ☐ Mark task complete in TodoWrite
  ☐ Ensure work is committed

☐ Completion
  ☐ Write final report (read tmp/execution-log.md for context)
  ☐ Commit final report only (tmp/ stays gitignored)
  ☐ Clean up tmp/
  ☐ Delete state file
```

## The Process

### Setup Phase

**IMPORTANT: Backlog items vs Implementation plans**

This skill supports two workflows:
1. **Implementation plans** (full design doc + detailed plan) - follow steps 1-6 below
2. **Backlog items** (single file with Problem + Proposed Solution) - see "Backlog Item Workflow" section below, then skip to step 5

**Backlog Item Workflow**

If working from a backlog item (e.g., `docs/backlog/B10-feature.md`):

1. Verify worktree isolation (step 1 below)
2. Read backlog item file:
   - **Problem section** = design/WHY
   - **Proposed Solution section** = lightweight implementation plan/HOW
   - **Related section** = context/references
3. Treat backlog item as BOTH design doc AND implementation plan:
   - Set `design_doc` = backlog item path
   - Set `implementation_plan` = backlog item path (same file)
4. Extract tasks from Proposed Solution section:
   - If solution is single-step: Create 1 task
   - If solution lists multiple steps: Create task per step
   - Create TodoWrite with all tasks
5. Create state file (step 4 below) using backlog item path for both docs
6. Skip to step 5 (execution log creation uses backlog item path)

Continue with standard workflow from step 5 onward.

**Standard Implementation Plan Workflow**

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

Create `tmp/.autonomous-execution-state.json`:

```json
{
  "skill": "autonomous-execution",
  "started_at": "2025-11-01T10:00:00Z",
  "design_doc": "docs/plans/YYYY-MM-DD-feature-design.md",
  "implementation_plan": "docs/plans/YYYY-MM-DD-feature-implementation.md",
  "execution_log": "tmp/execution-log.md",
  "current_task_number": 1,
  "total_tasks": 12,
  "time_budget_hours": 6,
  "status": "in_progress"
}
```

See reference/state-file-format.md for full schema.

**5. Create execution log**

Create `tmp/execution-log.md`:

```markdown
# Execution Log: [Feature Name]

**Started:** [timestamp]
**Design Doc:** [path or backlog item path]
**Implementation Plan:** [path or backlog item path - same as design doc for backlog items]
**Time Budget:** 6 hours

## Task 1: [Name] - [STATUS]
[Will be filled during execution]
```

For backlog items, both Design Doc and Implementation Plan point to the same backlog item file.

See reference/execution-log-format.md for detailed structure.

**Note:** Execution log is in tmp/ (working notes during execution). Final report will be the permanent deliverable.

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

Use Task tool with general-purpose agent.

**For initial implementation:**

```
description: "Implement Task N: [task name]"

prompt: |
  You are implementing Task N from [implementation-plan-path].

  Read that task carefully. Your job is to:
  1. Implement exactly what the task specifies
  2. Follow TDD as specified in the task
  3. Commit your work
  4. Report back

  Context documents:
  - Design doc (WHY): [design-doc-path]
  - Execution log (prior decisions): tmp/execution-log.md

  Work autonomously. If you encounter problems, use your judgment to resolve them.

  Report back concisely:
  - What you implemented (1-2 sentences)
  - Files changed (list)
  - Any blockers encountered
  - Creative decisions made (if any)
```

**When looping back from verification failures:**

```
description: "Fix issues in Task N: [task name]"

prompt: |
  You are fixing issues found in Task N from [implementation-plan-path].

  Read the verification feedback at [REVIEW_FILE] (in tmp/)

  This file contains ALL issues found:
  - Test failures (if any)
  - Integration gaps (if any)
  - Completeness issues (if any)
  - Code review issues (if any)

  Your job is to:
  1. Fix ALL issues listed in the feedback file
  2. Prioritize: tests first, then integration, then completeness, then code review issues
  3. Follow TDD if adding new code
  4. Commit your fixes
  5. Append to execution log at tmp/execution-log.md:

     ### Verification Fixes
     **Feedback:** [REVIEW_FILE]
     **Tests:** [fixed if failed]
     **Integration:** [fixed if gap found]
     **Completeness:** [fixed if incomplete]
     **Code review:** Critical: [count] fixed, Important: [count] fixed, Minor: [fixed/accepted]
     **Key changes:** [1-2 sentence summary]

  Context documents:
  - Design doc (WHY): [design-doc-path]
  - Execution log (prior decisions): tmp/execution-log.md

  Report back concisely:
  - What you fixed (1-2 sentences)
  - Files changed (list)
  - Any issues you couldn't fix (should be none)
```

**4. VERIFICATION, INTEGRATION & CODE REVIEW CHECKPOINT**

First, compute git SHAs and review file path:

```bash
BASE_SHA=$(git rev-parse HEAD^)  # Previous commit (before implementation)
HEAD_SHA=$(git rev-parse HEAD)   # Current commit (after implementation)

# Review file in tmp/ (ephemeral, not committed)
mkdir -p tmp
REVIEW_FILE="tmp/task-N-review.md"
```

Then dispatch verification subagent:

```
description: "Verify implementation (tests + integration + completeness + code review)"

prompt: |
  You're verifying the implementation of Task N from [implementation-plan-path].

  What was implemented: [summary from implementation subagent]

  Context documents:
  - Design doc (WHY): [design-doc-path]
  - Execution log (prior tasks): [execution-log-path]
  - Implementation plan (future tasks): [implementation-plan-path]

  Git context:
  - Base SHA: [BASE_SHA]
  - Head SHA: [HEAD_SHA]
  - Review file: [REVIEW_FILE]

  Your job is to verify FOUR things:

  **1. TESTS PASS (Isolation)**

  Run the full test suite for this project.
  Find and run the appropriate test command (check README.md, CLAUDE.md, or use standard command for this language).

  Report:
  - Pass count: [number]
  - Fail count: [number]
  - Full output: [paste if failures > 0]

  **2. INTEGRATION (Connections)**

  Read the code that was just written. Trace end-to-end execution:

  ☐ Could you demo what exists? If you ran the feature right now, would it do something useful?
  ☐ Trace the flow: input → processing → output (including error cases)
  ☐ Does code from THIS task call code from PREVIOUS tasks? (check execution log for prior work)
  ☐ Does code from FUTURE tasks depend on something? Is it actually present? (check implementation plan)
  ☐ Are there assumptions about what exists (columns, functions, services)? Verify they're true.

  Report:
  - Integration status: [PASS / GAP FOUND]
  - If GAP FOUND: Describe the specific missing connection or dependency

  **3. COMPLETENESS (Error handling)**

  Does it handle the full problem space (errors, edge cases, bad input) or just the happy path?

  Report:
  - Completeness: [COMPLETE / HAPPY-PATH-ONLY]
  - If HAPPY-PATH-ONLY: List missing error handling (network failures, invalid input, edge cases, etc.)

  **4. CODE REVIEW (Quality)**

  Review the implementation for code quality:

  ☐ Compare against task requirements from [implementation-plan-path] Task N
    - Does it implement what was specified?
    - Any missing pieces from the task description?

  ☐ Check git diff to see what changed:
    git diff [BASE_SHA] [HEAD_SHA]

  ☐ Review changes for:
    - Critical issues (bugs, security, correctness)
    - Important issues (architecture, maintainability, performance)
    - Minor issues (style, naming, comments)

  **FEEDBACK FILE:**

  If ANY of the four checks fail (tests, integration, completeness, or code review), write comprehensive feedback to [REVIEW_FILE]:

  ```markdown
  # Verification Feedback: Task N

  ## Tests
  [PASS / FAIL]
  - Pass count: [number]
  - Fail count: [number]
  - Failures: [paste full output if any]

  ## Integration
  [PASS / GAP FOUND]
  - Description: [specific missing connections or dependencies]

  ## Completeness
  [COMPLETE / INCOMPLETE]
  - Missing: [error handling, edge cases, invalid input scenarios]

  ## Code Review
  [NO ISSUES / ISSUES FOUND]
  - Critical: [count] - [specific examples with line numbers]
  - Important: [count] - [specific examples with line numbers]
  - Minor: [count] - [specific examples with line numbers]

  ## What to Fix
  [Prioritized list of what needs to be addressed]
  ```

  Report back:
  - Tests: [pass count] passed, [fail count] failed
  - Integration: [PASS / GAP FOUND]
  - Completeness: [COMPLETE / INCOMPLETE]
  - Code review: [NO ISSUES / ISSUES FOUND]
  - Feedback file: [REVIEW_FILE] (if ANY failures)
```

**If ANY of the four checks fail:**
- Feedback written to [REVIEW_FILE]
- Go back to step 3 (implementation)
- Step 3 reads [REVIEW_FILE] for all issues to fix

**If all four checks pass:**
- Proceed to step 5 (Handle blockers)

**5. Handle blockers (if any)**

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

**6. Update execution log**

Append task summary to tmp/execution-log.md (see reference/execution-log-format.md):

```markdown
## Task N: [Name] - [✅/⚠️/❌]
**Started:** [time] | **Completed:** [time]
**Status:** [Completed as planned / Adapted / Blocked]
**Files changed:** [list from implementation subagent]
**Verification of full test suite:** [X passed, Y failed]
**Key decisions:** [if any]
**Plan deviations:** [if any]
```

Note: If code review found issues, implementation subagent already wrote "Code Review Fixes" section to execution log.

**7. Update state file**

Update `current_task_number` in tmp/.autonomous-execution-state.json. Increment.

**8. Commit and mark complete**

- Commit all work from this task:
  - Implementation changes (from step 3)
  - Code review fixes (looped back through step 3, if any)
  - Note: Review files are in tmp/ (gitignored, ephemeral)
- Mark **this high-level task** completed in TodoWrite (e.g., "Task 1: Add timezone tests")
  - Note: Granular subtasks get marked as you go; this is the final task-level completion
- Continue to next task

### Completion Phase

When all tasks complete OR time budget reached:

**1. Write final report**

Create `docs/plans/YYYY-MM-DD-feature-final-report.md`

Read tmp/execution-log.md for context on what happened.

See reference/final-report-template.md for full structure.

**Key sections:**
- Executive summary (narrative)
- Key creative decisions
- Issues fixed/documented
- Recommendations
- **Task Completion Matrix** (at end for quick scanning)

**2. Commit and cleanup**

```bash
# Commit final report (the permanent deliverable)
git add docs/plans/*-final-report.md
git commit -m "docs: autonomous execution final report for [feature]"

# Clean up tmp/ (execution log, state file, review files)
rm -rf tmp/
```

## Resume Capability

**If you are reading this skill and find `tmp/.autonomous-execution-state.json`:**

1. You are resuming autonomous execution (after interruption or compaction)
2. Read state file to understand where you are
3. Read tmp/execution-log.md to understand what's been completed
4. Read current implementation plan (may have been adapted)
5. Continue from `current_task_number`
6. DO NOT restart from task 1
7. DO NOT re-read design doc (summarize from execution log if needed)

**Compaction resilience:**

If compaction happens mid-execution, the next task iteration will:
- Check tmp/.autonomous-execution-state.json exists
- Realize "I'm in autonomous-execution mode"
- Resume from current task
- Continue normally

### State File Resilience

**If state file goes missing mid-execution:**

The state file is in tmp/ and can disappear.

**Recovery:** Recreate from execution log.

```bash
# Count completed tasks to determine current position
COMPLETED=$(grep -c "^## Task [0-9]*:.*✅" tmp/execution-log.md)
CURRENT_TASK=$((COMPLETED + 1))

# Recreate state file using same format as Setup step 4
# Extract started_at, design_doc, implementation_plan from log header
# Set current_task_number=$CURRENT_TASK
# Set execution_log="tmp/execution-log.md"
```

State file is just a convenience. Execution log is sufficient to resume.

## Context Preservation Strategy

**Main agent (autonomous-execution) should ONLY:**
- Hold design document understanding (initial read, summarize in execution log)
- Hold current implementation plan (file path, updated as needed)
- Hold execution log file path (tmp/execution-log.md - append summaries, don't hold full content)
- Manage TodoWrite
- Track time

**Main agent should NEVER:**
- Read code files directly
- Run tests directly
- Debug issues directly
- All implementation work = subagent territory

**Subagents get fresh context each time:**
- Can read full design doc (no context cost to main agent)
- Can read tmp/execution-log.md (for prior task context)
- Can read implementation plan (for their specific task)
- Can read/write code files freely
- Should read deeply to understand WHY and make informed decisions

**Why:** Multi-hour execution needs aggressive context preservation FOR THE MAIN AGENT. Subagents have fresh context, so let them read everything they need.

**Note:** All working files (state, execution log, review files) in tmp/ - only final report is committed.

## Common Questions

**Q: When do I mark a task complete in TodoWrite?**
A: In step 8, mark the **high-level implementation plan task** complete (e.g., "Task 1: Add timezone tests"). This happens AFTER all work is committed. TodoWrite may have many granular subtasks during implementation - those get marked as you go. But the main task completion happens in step 8 after commit verification.

**Q: What if the implementation plan is at the repo root, not in the worktree?**
A: That's fine. Plan files can be anywhere in the repo. Just use the correct path when referencing it (e.g., `../../docs/plans/plan.md` from worktree, or absolute path).

**Q: How much detail for "creative decisions"?**
A: Document significant departures from the plan - changed approaches, workarounds for blockers, schema fixes, etc. Skip minor tweaks (variable renames, comment improvements). If you had to think hard about it, document it.

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
| "State file is overhead" | State file enables resume after interruption/compaction. Lives in tmp/. |
| "I'll create execution log later" | Execution log provides cross-subagent context during execution. Lives in tmp/. |
| "Execution log should be committed" | Only final report is committed. Execution log is working notes in tmp/. |
| "Tests passing is obvious" | Run full test suite, paste output. No claims without evidence. |
| "Verification slows us down" | 2 minutes of verification prevents hours debugging false completion claims |
| "I ran some tests manually" | Full test suite required, not selective testing |
| "Tests pass so the task is done" | Tests prove code works in isolation. Also need integration and completeness verification. |
| "I'll check integration at the end" | Integration gaps compound. Check after EVERY task. |
| "The next task will connect these pieces" | If pieces aren't connected now, explicitly add a task to connect them. Don't assume it'll happen. |
| "Error handling can be added later" | Completeness verification catches this NOW. Don't defer error handling to future tasks. |
| "It's just a happy path implementation" | Verification requires full problem space coverage: errors, edge cases, invalid input. |

## Red Flags

**If you catch yourself:**
- Skipping design doc read
- Executing tasks directly without subagents
- Not creating state file or execution log
- Reading code files in main agent
- Following plan blindly when it conflicts with design
- **Asking for permission when design conflicts with plan**
- **Skipping verification checkpoint or claiming tests pass without running them**
- Marking a task complete when tests pass but you can't trace execution through it
- Assuming "the next task" will make disconnected pieces work together
- Not verifying integration after EVERY task
- Skipping completeness check ("we'll add error handling later")
- Accepting happy-path-only implementations
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
