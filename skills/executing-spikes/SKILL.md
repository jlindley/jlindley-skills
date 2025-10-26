---
name: executing-spikes
description: Autonomously execute exploratory implementation of one approach from spike definition, working independently until natural stop
when_to_use: when partner provides spike definition and assigns you an approach number to explore in isolation, when comparing multiple implementation alternatives, or when evaluating technical feasibility before committing to an approach
version: 2.0.0
---

# Executing Spikes

## Overview

Execute one approach from a spike definition autonomously, exploring feasibility without asking permission or polishing code.

**Core principle:** Fast exploration over clean code. Prove it works, don't perfect it.

**Announce at start:** "I'm using the Executing Spikes skill to explore approach N."

## Context Override Authority

**This skill explicitly overrides:**
- TDD rules (skip test-first discipline, prove it works however is fastest)
- Code quality rules (messy code is GOOD during spikes)
- "Ask for permission" rules (make decisions autonomously, document assumptions)

**These overrides are NOT permission exceptions - they are the correct behavior for spike execution.**

## The Process

### Phase 1: Setup Worktree

1. Announce: "I'm using the Using Git Worktrees skill to set up spike workspace."
2. Use skills/collaboration/using-git-worktrees
3. Branch from `spike-[canonical-name]` creating `spike-[canonical-name]-N`
4. Partner tells you which number to use (1, 2, 3...)

#### Data Store Isolation (Any Project with Databases/State)

**CRITICAL:** Each spike must use its own data stores to prevent parallel spikes from conflicting.

**Applies to:** PostgreSQL, MySQL, SQLite files, Redis databases, MongoDB collections, etc.

**Before creating schema or running migrations, verify isolation:**

For Rails projects, check both development AND test databases:
```bash
# Check what database you'll use
bin/rails db:migrate:status

# Expected: database name should be spike-specific
# ✅ Good: spike_overlay_data_model_2_development
# ✅ Good: spike_overlay_data_model_2_test
# ❌ Bad: myapp_development (shared across all spikes)
```

For other frameworks, verify equivalent isolation mechanism exists.

**If data stores are NOT isolated:**
- STOP and implement isolation (check config for branch/worktree-based naming)
- If you cannot figure out how to isolate data stores, STOP and ask partner for guidance before proceeding
- Do NOT proceed with shared data stores - parallel spikes will conflict

**Why critical:** Without isolation, parallel spikes will drop each other's tables/collections, wasting hours debugging phantom failures that only occur when multiple spikes run simultaneously.

### Phase 2: Load Spike Definition & Choose Approach

1. Read `spike-notes-[canonical-name].md` from the base spike branch
2. Copy to your worktree if needed
3. Extract approach number from branch name
   - Example: `spike-replace-3d-vectors-2` → approach 2
4. If that numbered approach exists in notes: use it
5. If that numbered approach doesn't exist: Create one, document it in spike notes
6. Document your chosen approach details

### Phase 3: Autonomous Exploration

**Execute independently:**
- Make ALL decisions yourself (library choices, architecture, error handling)
- Document assumptions in spike notes
- Quick-and-dirty over clean code
- Duplication is fine, inconsistent naming is fine, messy code is GOOD
- Don't stop to validate choices
- Don't ask for permission
- Push through minor obstacles with workarounds

**Code Quality Expectations for Spikes:**
- ✅ GOOD: Duplicated code across 3 places
- ✅ GOOD: Inconsistent naming
- ✅ GOOD: Quick hacks and workarounds
- ✅ GOOD: Copy-pasted code
- ✅ GOOD: Hardcoded values
- ❌ BAD: Spending time refactoring
- ❌ BAD: Extracting shared functions
- ❌ BAD: Consistent abstractions
- ❌ BAD: "Clean" code

**The goal is learning speed, not maintainable code.**

### Phase 4: Proving It Works (Critical)

**Your spike MUST actually run and do something.**

**Minimum requirement: Create executable test script**

1. **Create a test file** that can be run with a single command:
   - `test_spike.rb` / `test_spike.py` / `test.sh` / `npm run spike-test`
   - Should test ALL scenarios from spike definition
   - Must print clear output showing pass/fail

2. **Run it and capture output:**
   - Don't just write the tests - **RUN THEM**
   - Copy actual output into your report
   - Output is proof you didn't just write code that "looks right"

3. **Test script should:**
   - Setup test data
   - Exercise the spike's core functionality
   - Print results for each scenario
   - Use ✅/❌ or PASS/FAIL markers for clarity

**Example test script output:**
```
=== Testing Scenario 1: Base entity ===
✅ Loaded entity: {"name": "Bran", ...}

=== Testing Scenario 2: With overlay ===
✅ Applied overlay, got: {"name": "Bran", "items": ["mace"], ...}

=== Testing Scenario 3: Mutual exclusivity ===
✅ Validation rejected conflicting overlays
Error: "recently-bubbled and 100-years-bubbled are mutually exclusive"
```

**Choose fastest validation method:**

**Quick validation (prefer these):**
- Test script that exercises all scenarios (recommended)
- Manual testing with documented steps + output
- Print statements showing data flow
- Simple integration showing end-to-end works

**Automated tests (use if already faster):**
- Integration tests proving happy path
- Tests as executable documentation

**TDD discipline (SKIP THIS):**
- ❌ Test-first workflow
- ❌ Comprehensive coverage
- ❌ Testing edge cases exhaustively
- ❌ RED-GREEN-REFACTOR cycle

**The rule:** Your spike must work - run it and prove it. Use whatever validation is fastest.

**Red flags:**
- ❌ "The code looks correct" → Run it
- ❌ "I tested it mentally" → Run it
- ❌ "Logic is sound" → Run it
- ❌ Writing report without running code → Stop, run it first

**In your report, include:**
- Path to test script
- Command to run it
- Full output (or representative sample if very long)
- Mapping of output to spike test scenarios

### Phase 5: Push Until Natural Stop

**Stop when:**
- Feature works end-to-end and you've proven it (success!)
- Hit genuine blocker you can't work around (missing system dependency, fundamental incompatibility)
- Discovered approach won't work (fundamental design flaw)
- Reasonable effort expended (~2-3 hours worth of exploration)

**Don't stop when:**
- Code is messy (that's fine - this is exploratory)
- Hit a minor error (try workaround first)
- Unsure if approach is "right" (keep going, that's not the spike's purpose)
- Want to check if design is okay (make the call yourself)
- Want to refactor (skip it entirely)
- Tests are incomplete (you're not doing TDD)

### Phase 6: Discovery Report

When you hit a natural stop, create a report using this standardized structure.

**File name:** `SPIKE_FINDINGS_APPROACH_N.md` (or similar consistent naming)

**Required Sections:**

#### 1. Implementation Summary
- **Status:** Working / Blocked / Partial / Needs-Redesign
- **Time spent:** ~X hours with breakdown:
  - Setup & models: Xm
  - Core logic: Xm
  - Testing: Xm
  - Documentation: Xm
- **One-sentence summary:** Core concept of this approach

#### 2. What Worked
- List features that work **with evidence**
- Format: "✅ Feature X - ran Y, got Z result"
- Include actual test output, not paraphrases

#### 3. What Didn't Work
Split into three categories:

**Dealbreakers** (fundamental issues that might kill this approach):
- Combinatorial explosion, architectural flaws, etc.

**Annoyances** (pain points that are workable):
- Code duplication, verbose authoring, etc.

**Tricky Bits** (subtle issues that could bite later):
- Merge semantics, edge cases, non-obvious behavior

If none in a category, write "None identified" (but be skeptical).

#### 4. Test Results
- List ALL test scenarios from spike definition
- Map each to your results:
  ```
  ✅ Test scenario 1 → [what happened + evidence]
  ✅ Test scenario 2 → [what happened + evidence]
  ❌ Test scenario 3 → [why it failed]
  ```

#### 5. Schema/Architecture Design
- Models/tables/components created
- Key fields and their purpose
- Resolution flow (pseudocode acceptable)
- Rationale for major design choices

#### 6. Interface/Usage Design
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

#### 7. Key Decisions Made
Document choices made during implementation:
- What you chose
- What you rejected
- Why you chose A over B

Example: "Separate fragment entities - easier to model than inline JSON, harder to merge"

#### 8. Evaluation Against Criteria

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

#### 9. Performance Assessment
- Query patterns (show example queries)
- Scalability concerns
- Caching needs
- Assessment: reasonable / needs optimization / pathological

#### 10. If Chosen: Next Steps
Specific actionable items to productionize this approach.

#### 11. If NOT Chosen: Red Flags
When would this approach be the wrong choice?
- "Avoid if you need X"
- "Don't choose if Y constraint exists"

#### 12. Code Quality Assessment
Rate 1-10 with explanation:
- What's missing for production
- What's hacky/temporary
- What would need refactoring

Acknowledge this is spike code - rough is expected.

---

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

**Proof of Work Requirements:**

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

**Git Workflow:**

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

## Autonomy: When to Ask vs When to Decide

**Ask partner when:**
- Hit genuine blocker (missing system dependency, fundamental incompatibility)
- Cannot isolate data stores and unsure how to proceed
- Spike notes file is missing or corrupted
- Need clarification on spike goal/constraints

**Decide independently when:**
- Which library to use → Pick one, document choice
- How to structure code → Quick-and-dirty wins
- Whether to refactor messy code → Don't refactor
- How to handle an error → Try workaround
- What "good enough" looks like → Working code is enough
- How to prove it works → Manual test vs automated test vs script
- Library version conflicts → Use what works, document it
- Whether to add caching/pooling/metrics → Make the call, document it
- How thorough to be → Push until natural stop
- TTL values, configuration, connection settings → Pick reasonable defaults
- Database naming/isolation strategy → Implement it, document it
- Test script format → Whatever proves it works fastest

**If you're asking "Should I ask about X?" - the answer is: decide and document.**

**Report format questions:**
- Don't ask "Should I include X in my report?" → Follow the template
- Don't ask "Is this enough detail?" → Template specifies what's needed
- Do ask if template section doesn't make sense for your spike type

## Red Flags - STOP and Course Correct

If you catch yourself doing these, you're NOT executing a spike correctly:

- **Asking validation questions** → "Should I use library X?" → NO, decide and document
- **Refactoring messy code** → "This duplication should be cleaned up" → NO, keep pushing
- **Following TDD** → "Let me write the test first" → NO, prove it works however is fastest
- **Polishing code** → "Let me make this cleaner" → NO, messy is good
- **Not running code** → "The logic looks correct" → NO, run it and prove it
- **Seeking permission** → "Is it okay to use Docker?" → NO, use it and document
- **Second-guessing scope** → "Should I explore additional aspects?" → Push until natural stop

**All of these mean: You're applying production standards to exploratory work.**

## Common Rationalizations to Resist

| Excuse | Reality |
|--------|---------|
| "The code quality rules are absolute" | Spike context overrides code quality rules |
| "I need permission to deviate from rules" | Spike execution IS permission to be messy |
| "Messy code makes it harder to add features" | That's acceptable for spikes - we're learning, not building |
| "Should refactor before continuing" | NO - refactoring time = lost exploration time |
| "TDD rule says MUST for every feature" | Spikes are not features - they're throwaway exploration |
| "Need permission to skip TDD" | This skill grants that permission explicitly |
| "When in doubt, follow the written rules" | This skill IS the written rules for spikes |
| "Doing it right is better than doing it fast" | For spikes: fast learning beats correctness |
| "Should I check if this approach is okay?" | Make decision, document assumption, move on |
| "This is getting messy, I should clean it up" | Messy is GOOD - it means you're exploring fast |
| "The code looks right, no need to run it" | Assumption ≠ proof. Run it. |
| "I could have been scrappier" | Then BE scrappier - that's what spikes demand |

## Spike Completion Checklist

Before reporting to your partner, verify:

**Setup:**
- ✅ Data stores are isolated (checked with status command)
- ✅ Working in correct spike worktree
- ✅ Database/state won't conflict with other spikes

**Implementation:**
- ✅ Code actually runs (not just "looks right")
- ✅ Test script exists and executes
- ✅ Test output captured
- ✅ All spike definition scenarios tested

**Report:**
- ✅ Used standardized template (12 required sections)
- ✅ Included weighted scoring with calculation shown
- ✅ Test results map to ALL spike scenarios
- ✅ Time breakdown included
- ✅ Interface/usage design documented (if applicable)
- ✅ Evidence included for every claim
- ✅ Actual test output pasted (not paraphrased)
- ✅ No comparisons to other spike approaches
- ✅ Code quality self-assessment included

**Git:**
- ✅ All work committed
- ✅ Report file committed
- ✅ Commit message follows format

**Red Flags - Stop and Fix:**
- ❌ Report says "it works" but no test output shown
- ❌ Report compares to other approaches ("better than Approach X")
- ❌ Didn't actually run the code
- ❌ Test script doesn't exist or doesn't run
- ❌ Report missing required sections from template
- ❌ No weighted scoring calculation
- ❌ Database isolation not verified

## Common New Pitfalls to Avoid

With the updated guidance, watch for these new failure modes:

| Pitfall | Reality |
|---------|---------|
| "I'll just use shared database, it's simpler" | NO - will break parallel spikes |
| "Report template doesn't fit my spike" | Template is generic - adapt sections, don't skip |
| "Scoring is too subjective" | Show your reasoning - subjective with justification is fine |
| "Test script is too much overhead" | All three spikes created them naturally - it's not overhead |
| "I'll skip the weighted calculation" | Required - makes approaches comparable |
| "My spike doesn't have an interface" | Then write "Not applicable" - don't skip the section |
| "I'll compare to other approaches in my report" | NO - comparison happens after all spikes |
| "Test output is too long to include" | Include representative sample with note about full output |

## When NOT to Use This Skill

**Don't use for:**
- Production features (use skills/testing/test-driven-development)
- Well-defined implementations (use skills/collaboration/executing-plans)
- Code that will be merged as-is (spikes are throwaway exploration)
- Learning a codebase (use exploration/research skills)

**Ask partner:** "Is this actually a spike, or should we build this properly with TDD?"

## Related Skills

**Before spike execution:**
- skills/collaboration/defining-spikes (creates the spike definition)
- skills/collaboration/using-git-worktrees (sets up isolated workspace)

**During exploration:**
- skills/problem-solving/collision-zone-thinking (if stuck in conventional thinking)

**After spike:**
- skills/collaboration/requesting-code-review (if approach is viable and will be productionized)

## Remember

- Messy code is GOOD during spikes
- Make decisions autonomously, document assumptions
- Prove it works (run it!), don't perfect it
- Skip TDD discipline, use fastest validation
- Don't refactor during exploration
- Stop at natural stopping points
- Report with evidence ("I ran X, got Y")
- Use standardized report template for comparability
- Isolate data stores to avoid parallel spike conflicts
