---
description: Surface all unresolved items from the current session - dropped threads, deferred decisions, unresolved errors, agent quality failures, and incomplete work
model: claude-opus-4-6
---

Focused loose ends scan — the same analysis as wrap's Step 3, without grading or insights. Use when you want to check what's unresolved without a full session wrap.

## Process

### 1. Scan for Open Items

**Scan the full conversation thoroughly for:**
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
- Stale task list items still marked pending/in-progress
- Agents that returned empty, thin, or off-scope output (quality failures, not just errors)
- Multi-step skill chains where intermediate output was lost, ignored, or silently degraded
- Agent outputs that overlapped heavily despite scope exclusions

### 2. Format Output

List ALL items found (up to ~7), ordered by risk. For each:

```
[Risk Level - Category] Description - What happens if ignored
```

**Risk levels:** High, Medium, Low

**Categories:** Bug, Testing, Decision, Cleanup, Error, Confusion, Deferred, Content, Agent

Be specific — include which file, which error, which decision. Don't summarize; enumerate.

**Examples:**
- `[High Risk - Testing] Never ran tests after refactoring 5 auth functions - Could have broken login`
- `[High Risk - Decision] User asked "should we handle null values?" - We assumed yes but never confirmed`
- `[Medium Risk - Agent] Creative Expansion agent ignored source material, planned from script only - Output won't match production-visuals expectations`
- `[Low Risk - Cleanup] Generated debug files in tmp/ during investigation - Left behind, may confuse later`

If nothing is found, say so.

### 3. Present Selections for Follow-Up

Use `AskUserQuestion` with `multiSelect: true` to let the user pick which items to address.

**Option labels must clearly indicate what happens when selected:**
- `"Fix: [what]"` or `"Clean: [what]"` or `"Delete: [what]"` → Will execute immediately
- `"Discuss: [topic]"` → Will pause for drill-down conversation

### 4. Handle Selected Items

**Action items (Fix:/Delete:/Clean:) → Execute immediately, no pause:**
```
✓ Deleted stale tmp/ reports (3 files removed)
✓ Fixed checked box — converted to "Model script" reference
```

**Discuss items → Pause for drill-down:**
```
## Discussing: [Item description]

**Context:** [When/why it came up in session]
**Risk if ignored:** [What happens if we forget this]
**Options I see:** [2-3 ways to handle this]

[Pause for user input on how to proceed]
```

If user decides to create backlog item:
- Use `backlog-management` skill to create properly formatted issue
- Include session context in "Related" section

## Usage

```bash
/open-items
```

## Important Guidelines

- **Enumerate, don't summarize** — every dropped thread gets its own line
- **Be specific** — which file, which error, which decision
- **Include the risk** — what happens if this stays loose
- **Don't pad** — if only 2 items exist, list 2. If none, say so.
