---
description: Setup worktree(s) and generate autonomous execution prompt for backlog item
---

You are helping Jim prepare to work on a backlog item in isolation.

**Usage:**
- `/prep-for <issue-id>` (e.g., `/prep-for b3`, `/prep-for B18`) - Single worktree
- `/prep-for <issue-id> <variants>` (e.g., `/prep-for b7 3`) - Multiple variant worktrees

## Step 1: Parse Arguments

Extract the issue identifier and optional variant count from the command:
- `b3`, `B3`, `3` → normalize to `B3`
- Case insensitive, optional B prefix
- Optional second argument: number of variants (1-5)
  - If omitted: create single worktree (no variant suffix)
  - If provided: create N worktrees with `-1`, `-2`, etc. suffixes

**Validation:**
- Variants must be 1-5 (prevent resource exhaustion)
- If variants > 1, warn about disk usage (each variant = 2 databases + data copies)

## Step 2: Locate Backlog Item

Search for the backlog item file in `docs/backlog/`:
- Pattern: `B<number>-*.md` (e.g., `B3-download-state-machine.md`)
- Read the file to extract:
  - Full title (from `# B3: Title` line)
  - Status
  - Priority
  - Any warnings (e.g., "DESIGN WORK REQUIRED")

If not found, error: "Issue B<number> not found in docs/backlog/"

## Step 3: Collect Baseline Metrics (Once)

**IMPORTANT: Collect baseline from main repo BEFORE creating worktrees.**

Run tests in current directory to establish baseline:
```bash
pytest -q 2>&1
```

Extract from output:
- Passed count
- Skipped count
- Failed count (should be 0)
- Total test count

If tests fail, include warning in all prompts about starting from non-green baseline.

## Step 4: Setup Worktree(s)

**Look for project-specific worktree setup instructions:**

1. Check `CLAUDE.md` for worktree setup instructions
2. Check `README.md` for worktree setup instructions
3. Otherwise, use default approach

**Derive slug from backlog filename:**
- `B3-download-state-machine.md` → `b3-download-state-machine`

**Naming patterns:**

**Single worktree (no variant count specified):**
- Worktree path: `.worktrees/b<number>-<slug>`
- Branch name: `feature/b<number>-<slug>`
- Example: `.worktrees/b7-media-group-support` with branch `feature/b7-media-group-support`

**Multiple variants (variant count specified):**
- Worktree path: `.worktrees/b<number>-<slug>-<N>`
- Branch name: `feature/b<number>-<slug>-<N>`
- Example with 3 variants:
  - `.worktrees/b7-media-group-support-1` with branch `feature/b7-media-group-support-1`
  - `.worktrees/b7-media-group-support-2` with branch `feature/b7-media-group-support-2`
  - `.worktrees/b7-media-group-support-3` with branch `feature/b7-media-group-support-3`

**Default approach (if no project-specific instructions):**
```bash
# Single worktree
git worktree add .worktrees/b<number>-<slug> -b feature/b<number>-<slug>

# Multiple variants (loop)
git worktree add .worktrees/b<number>-<slug>-<N> -b feature/b<number>-<slug>-<N>
```

**Project-specific approach:**
- Call project's setup script with appropriate path/branch name
- Example: `./scripts/setup-worktree.sh feature/b7-media-group-support-1 .worktrees/b7-media-group-support-1`

**After worktree creation:**
- Record all worktree paths for summary

## Step 5: Generate Autonomous Execution Prompts

Generate one prompt per worktree created.

**For single worktree:**
```markdown
---

I'm in the `<worktree-name>` worktree to implement **B<number>: <title>**.

Use the `autonomous-execution` skill to implement this backlog item.

**Backlog item:** `./docs/backlog/<backlog-filename>`

This is a single backlog item (not a full implementation plan), so follow the **Backlog Item Workflow** from the `autonomous-execution` skill.

**Current baseline:** <passed> passed, <skipped> skipped, <failed> failed (total: <total> tests).

<if any warnings from backlog item, add:>
**Special considerations:**
<warnings here>

**Time budget:** <suggest based on priority/complexity>

Work autonomously to completion in this worktree.

---
```

**For multiple variants:**
```markdown
---

I'm in the `<worktree-name>` worktree to implement **B<number>: <title>**.

**This is variant <N> of <M>.**

Use the `autonomous-execution` skill to implement this backlog item.

**Backlog item:** `./docs/backlog/<backlog-filename>`

This is a single backlog item (not a full implementation plan), so follow the **Backlog Item Workflow** from the `autonomous-execution` skill.

**Current baseline:** <passed> passed, <skipped> skipped, <failed> failed (total: <total> tests).

<if any warnings from backlog item, add:>
**Special considerations:**
<warnings here>

**Time budget:** <suggest based on priority/complexity>

Work autonomously to completion in this worktree.

---
```

**Time budget suggestions:**
- Low priority, simple refactor: 1-2 hours
- Medium priority, feature work: 2-4 hours
- High priority or "DESIGN WORK REQUIRED": 4-6 hours

## Step 6: Summary Output

**For single worktree:**
```
✓ Worktree setup complete: <worktree-path>
✓ Baseline recorded: <test-summary>

Copy the prompt below into a new Claude Code session in this worktree:
```

Then display the generated prompt in a code block.

**For multiple variants:**
```
✓ Created <M> variant worktrees for B<number>:
  - <worktree-path-1>
  - <worktree-path-2>
  - ...
✓ Baseline recorded: <test-summary>

⚠️  Resource usage: ~<estimate> GB disk space (<M> variants × 2 databases each)

Cleanup when done:
  # Drop databases
  <list psql DROP DATABASE commands for all variants>

  # Remove worktrees
  <list git worktree remove commands for all variants>

---

Copy each prompt below into a separate Claude Code session in the corresponding worktree:
```

Then display all generated prompts, one per variant, separated clearly with headers like:

```
### Variant 1: <worktree-path-1>

<prompt-1>

### Variant 2: <worktree-path-2>

<prompt-2>

...
```

## Error Handling

**If backlog item not found:**
- List available backlog items
- Suggest correct issue ID

**If variant count invalid:**
- Error: "Variant count must be 1-5. Requested: <N>"
- Explanation: "Each variant requires 2 databases + data copies. Use lower count to avoid resource exhaustion."

**If any worktree already exists:**
- Error: "Worktree already exists at <path>. Remove it first or use a different issue."
- For variants: Check ALL variant paths before creating any
- Don't create partial sets - either all succeed or none

**If tests fail in baseline:**
- Include warning in all prompts: "⚠️ Starting from non-green baseline. Fix existing failures before implementing B<number>."

**If not in a git repo:**
- Error: "Not in a git repository. Run this command from a project root."

## Notes

- This command works across any project with a `docs/backlog/` directory
- Project-specific setup (databases, config) is handled per project's CLAUDE.md or README.md
- The generated prompts are optimized for autonomous-execution skill usage
- Baseline metrics help verify no regressions during autonomous work
- No files are written - prompts are displayed for copy/paste only
- Variants are completely isolated - separate worktrees, branches, and databases
- Jim will provide specific approach guidance to each variant as needed
