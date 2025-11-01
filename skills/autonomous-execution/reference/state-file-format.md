# State File Format

The `.autonomous-execution-state.json` file tracks execution state for resume capability.

## Full Schema

```json
{
  "skill": "autonomous-execution",
  "started_at": "2025-11-01T10:00:00Z",
  "design_doc": "docs/plans/YYYY-MM-DD-feature-design.md",
  "implementation_plan": "docs/plans/YYYY-MM-DD-feature-implementation.md",
  "execution_log": "docs/plans/YYYY-MM-DD-feature-execution-log.md",
  "current_task_number": 5,
  "total_tasks": 12,
  "time_budget_hours": 6,
  "status": "in_progress",
  "instruction_on_resume": "You are in the middle of autonomous execution. Re-read autonomous-execution skill and resume from current_task_number. DO NOT ask user for guidance - continue autonomously."
}
```

## Fields

- `skill`: Always "autonomous-execution"
- `started_at`: ISO 8601 timestamp of execution start
- `design_doc`: Path to design document
- `implementation_plan`: Path to implementation plan (may be updated during execution)
- `execution_log`: Path to execution log
- `current_task_number`: Next task to execute (1-indexed)
- `total_tasks`: Total number of tasks in plan
- `time_budget_hours`: Maximum execution time (default: 6)
- `status`: "in_progress" or "completed" or "timeout"
- `instruction_on_resume`: Reminder for resuming agent

## Usage

**Creating:** At start of execution

**Updating:** After each task completion (increment `current_task_number`)

**Reading:** On resume after interruption/compaction

**Deleting:** After final report written
