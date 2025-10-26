# Spike Report Template

When you hit a natural stop, create a report using this standardized structure.

**File name:** `SPIKE_FINDINGS_APPROACH_N.md` (or similar consistent naming)

## Required Sections

### 1. Implementation Summary
- **Status:** Working / Blocked / Partial / Needs-Redesign
- **Time spent:** ~X hours with breakdown:
  - Setup & models: Xm
  - Core logic: Xm
  - Testing: Xm
  - Documentation: Xm
- **One-sentence summary:** Core concept of this approach

### 2. What Worked
- List features that work **with evidence**
- Format: "✅ Feature X - ran Y, got Z result"
- Include actual test output, not paraphrases

### 3. What Didn't Work
Split into three categories:

**Dealbreakers** (fundamental issues that might kill this approach):
- Combinatorial explosion, architectural flaws, etc.

**Annoyances** (pain points that are workable):
- Code duplication, verbose authoring, etc.

**Tricky Bits** (subtle issues that could bite later):
- Merge semantics, edge cases, non-obvious behavior

If none in a category, write "None identified" (but be skeptical).

### 4. Test Results
- List ALL test scenarios from spike definition
- Map each to your results:
  ```
  ✅ Test scenario 1 → [what happened + evidence]
  ✅ Test scenario 2 → [what happened + evidence]
  ❌ Test scenario 3 → [why it failed]
  ```

### 5. Schema/Architecture Design
- Models/tables/components created
- Key fields and their purpose
- Resolution flow (pseudocode acceptable)
- Rationale for major design choices

### 6. Interface/Usage Design
How will users/developers interact with this system?

**Include as applicable:**
- File formats for content authoring (TOML, YAML, JSON examples)
- API design (endpoints, request/response examples)
- CLI command structure
- Configuration format
- Query language/patterns
- Import/export workflows
- UI interaction patterns

**For each interface:**
- Minimum one complete example showing all features
- Rationale for design choices
- Pros/cons
- What the consuming code needs to handle

**Example (file format spike):**
```toml
# Concrete TOML example here
[entity]
name = "Example"
# ...
```
Why TOML over YAML: [rationale]
Importer needs to: [handle X, validate Y]

**Example (API spike):**
```
POST /api/entities
{ "name": "Example", ... }
→ 201 Created
```
Why REST over GraphQL: [rationale]
Client needs to: [handle X, validate Y]

If spike doesn't involve external interfaces, write "Not applicable - internal implementation only."

### 7. Key Decisions Made
Document choices made during implementation:
- What you chose
- What you rejected
- Why you chose A over B

Example: "Separate fragment entities - easier to model than inline JSON, harder to merge"

### 8. Evaluation Against Criteria

**If spike definition provides weighted criteria:**

Use the exact weights specified. Common format: "40% Flexibility, 40% Developer Experience, 20% Performance"

**Scoring rubric (0-10 scale):**
- **0-3:** Major problems, blockers, missing functionality
  - Example: "Can't handle required use case", "Fundamentally doesn't scale"
- **4-6:** Works but has significant tradeoffs
  - Example: "Works but requires manual workarounds", "Solves problem but creates new problems"
- **7-8:** Works well with minor issues
  - Example: "Handles all cases with small caveats", "Performance adequate with known optimizations"
- **9-10:** Excellent, exceeds requirements
  - Example: "Elegant solution with no significant downsides", "Better than expected"

**Be honest about tradeoffs.** A "6" with clear explanation is more valuable than a generous "8".

**Show your work:**
```
Criterion 1 (weight%): score/10 → weighted_value
Criterion 2 (weight%): score/10 → weighted_value
Criterion 3 (weight%): score/10 → weighted_value
---
Weighted Overall: total/10
```

**Example:**
```
Flexibility (40%): 7/10 → 2.8
  Justification: Handles all current requirements. Combinatorial explosion
  is manageable with <5 overlays but would be painful with 10+.

Developer Experience (40%): 6/10 → 2.4
  Justification: Simple mental model but content authors must duplicate
  base fields across variants. Authoring burden increases with complexity.

Performance (20%): 7/10 → 1.4
  Justification: Not pathological. Needs caching for 1000+ entities but
  fine for personal use + alpha testers.
---
Weighted Overall: 6.6/10
```

**If no weighted criteria provided:**
- Score what makes sense for the spike
- Document your scoring rationale
- Be consistent across dimensions

### 9. Performance Assessment
- Query patterns (show example queries)
- Scalability concerns
- Caching needs
- Assessment: reasonable / needs optimization / pathological

### 10. If Chosen: Next Steps
Specific actionable items to productionize this approach.

### 11. If NOT Chosen: Red Flags
When would this approach be the wrong choice?
- "Avoid if you need X"
- "Don't choose if Y constraint exists"

### 12. Code Quality Assessment
Rate 1-10 with explanation:
- What's missing for production
- What's hacky/temporary
- What would need refactoring

Acknowledge this is spike code - rough is expected.

---

## What NOT to Include

**Do NOT include in spike report:**
- ❌ Comparisons to other spike approaches (you don't know what they did yet)
- ❌ "This is better than Approach X"
- ❌ "We should do a different spike instead"

**Why:** Spikes run in parallel isolation. Comparison happens AFTER all spikes complete.

**✅ DO include:**
- Objective criteria: "This works best when X, avoid when Y"
- Self-critique: "Fatal flaw is Z"
- Gut feeling: "My confidence this is viable: High/Medium/Low"

---

## Proof of Work Requirements

Your report must include:
1. **Executable test script** (test_spike.rb, test.sh, etc.)
   - Runs with single command
   - Prints output showing success/failure
2. **Actual test output** copied into report
   - Not paraphrased
   - Shows you ran the code
3. **Evidence for every claim**
   - "It works" → show output
   - "It's fast" → show timing
   - "It handles X" → show test case

---

## Git Workflow

When your spike is complete and report is written:

1. **Commit your work:**
   ```bash
   git add -A
   git commit -m "Spike: Approach N - [Name] ([Status])

   [Brief summary of what you implemented]

   [Key findings in 2-3 bullet points]

   See SPIKE_FINDINGS_APPROACH_N.md for full analysis.

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

2. **Do NOT push to remote** unless partner explicitly requests it
   - Spikes are local exploration
   - Partner will review before deciding what to push

3. **Verify commit:**
   ```bash
   git log -1 --stat
   # Should show your spike code + report
   ```

**Why commit:**
- Preserves your work in git history
- Makes it easy to compare spike branches later
- Partner can checkout your spike worktree and see exactly what you did
- Can cherry-pick pieces if this approach wins

**What gets committed:**
- All code (models, migrations, test scripts, etc.)
- The spike report (SPIKE_FINDINGS_APPROACH_N.md)
- Updated spike notes if you modified them
- Database schema files (schema.rb, migrations)

**What NOT to commit:**
- Database files themselves (.sqlite3, etc.)
- Build artifacts
- Temporary files
- Standard gitignore applies
