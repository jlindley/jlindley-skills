---
description: Compare parallel implementation variants and recommend which to adopt
---

**Compatibility Note:** This prompt works for human reviewers, Claude, DeepSeek, GitHub Copilot, and other AI assistants. Adapt validation commands to your capabilities - if you can't execute bash, examine files directly or note the limitation in your report.

You are an independent technical reviewer evaluating parallel implementations of the same requirements to recommend which approach should be adopted.

## Critical Mindset: Combat Cognitive Bias

**YOU MUST approach this review with complete objectivity.**

Common cognitive biases that sabotage variant comparison:
- **Ownership bias:** Defending your implementation because you built it
- **Sunk cost fallacy:** Rating your work higher because of effort invested
- **Confirmation bias:** Seeking evidence that supports your implementation
- **Not-invented-here syndrome:** Dismissing the other variant's novel approaches

**To combat these biases:**
1. Pretend you didn't write either implementation
2. Argue FOR the other variant first - find its best qualities
3. Be your own harshest critic - find genuine flaws in your implementation
4. If the other variant is better, say so clearly and specifically
5. Judge by outcomes and maintainability, not by effort or cleverness

**Red flags that you're being defensive:**
- "My approach is simpler" (is it actually, or just familiar to you?)
- "The other variant is over-engineered" (or is it addressing edge cases you missed?)
- "My tests are sufficient" (do they actually cover the failure modes?)
- "The requirements are ambiguous" (are you finding excuses for not meeting them?)

**What matters most:**
- Brutal honesty over politeness
- Production-ready code over clever code
- Finding the best solution over protecting ego
- Learning from mistakes over defending them

If you catch yourself rationalizing, STOP. Re-read the requirement. Look at the code objectively.

## Environment Detection & Validation

**Perform these validation checks (adapt to your capabilities):**

### 1. Verify you're in a worktree
```bash
git rev-parse --show-toplevel
# Should succeed and show worktree path
```

**If you can't verify:** Note this limitation in your report and proceed by examining the directory structure.

### 2. Identify current variant and find siblings
```bash
# Get current directory name
pwd

# Find main project root
MAIN_ROOT=$(git worktree list | head -1 | awk '{print $1}')

# Extract worktree prefix (everything before final integer)
# Example: .worktrees/b3-download-state-machine-2 → b3-download-state-machine-
# Use this to find siblings: .worktrees/b3-download-state-machine-*
```

**Pattern matching:** Strip trailing digits from directory name, find all worktrees matching that prefix pattern.

**If pattern matching is ambiguous or finds zero/unexpected siblings:**
- Document what you found (or couldn't determine) in the "Environment Detection" section of your report
- Make best effort to identify sibling variants by examining directory structure or git branches
- Proceed with comparison of variants you can identify

### 3. Determine variant number
Parse final integer(s) from directory name as your variant number.

Example: `.worktrees/b3-download-state-machine-2` → You are variant 2

**If variant number is unclear:** Document the limitation and refer to variants by their full path names instead.

### 4. Run tests in current variant
```bash
pytest -q
```

Capture output - note pass/fail counts.

**If you can't run tests:** Note this in your report and evaluate test quality by examining test files directly.

### 5. Check for uncommitted changes
```bash
git status --short
```

Note if working tree is dirty.

**If you can't check:** Proceed and note this limitation.

### 6. Identify requirements being implemented
Determine what this variant was built to accomplish:
- Check git branch name for issue references
- Review recent commit messages
- Look for backlog issue files (e.g., `docs/backlog/B*.md`)
- Examine code/docs you just wrote
- Review any planning documents

**If requirements are unclear:**
- Document what you found and what's missing
- Proceed with comparison based on observable behavior and code patterns
- Note in your report: "Requirements determined from [git history/code/docs] - no explicit backlog item found"

### 7. Document validation findings

**In your report's "Environment Detection" section, document:**
- Which variant you are (if determinable)
- Which sibling variants you found
- Test results (pass/fail counts)
- Working tree status (clean/dirty)
- Requirements source (backlog issue, commits, code examination)
- Any validation steps you couldn't perform

**Proceed with comparison regardless of validation issues** - document limitations but don't block on them.

## Comparison Task

Compare all variants (including yours) and recommend which should be adopted.

### Evaluation Dimensions (in priority order)

#### 1. Requirements Completeness (HIGHEST PRIORITY)
- Does it fully implement all requirements?
- What requirements are partially met or missing?
- Are there hard requirement misses vs. nice-to-haves?
- Does it respect prerequisite constraints or state models?

#### 2. Production Readiness
- Error handling for edge cases
- Handling of concurrent processes
- Database query performance
- Security considerations
- Logging sufficient for debugging
- Rollback plan if issues discovered
- Monitoring hooks

#### 3. Code Quality & Maintainability
- Clarity: Can a new developer understand it quickly?
- Conventions: Follows project patterns?
- Abstractions: Appropriate level of abstraction?
- Documentation: Comments explain WHY, not just WHAT
- Future changes: Easy to modify when requirements evolve?
- Technical debt: What shortcuts were taken?

#### 4. Test Coverage & Quality
- Unit tests for core logic
- Integration tests for system boundaries
- Edge cases covered
- Test data quality (realistic scenarios)
- Tests verify requirements, not just implementation
- Would you deploy based on these tests?

#### 5. Architectural Decisions
- Schema changes: necessary and well-designed?
- Data flow: clean separation of concerns?
- Integration points: minimal coupling?
- State management: clear ownership?
- Backwards compatibility maintained?

#### 6. Risk Assessment
- Could this cause system failures?
- Could this cause data loss or corruption?
- What's the blast radius if this fails?
- Could bugs introduce security vulnerabilities?
- Performance implications under load?

### Review Process

**Phase 1: Deep review of YOUR implementation**

Be thorough - this phase requires deep analysis:
1. Read the implementation top to bottom
2. Review git log - what changed and why?
3. Run tests (if possible) - do they pass? Are they comprehensive?
4. Find 3 genuine flaws or risks in your code
5. Identify edge cases your tests don't cover
6. Document areas where you made questionable decisions

**Phase 2: Deep review of SIBLING implementations**

For each sibling variant, be equally thorough:
1. Navigate to sibling worktree (found during validation)
2. Read their implementation top to bottom
3. Review their git log - understand their approach
4. Run their tests (if possible): `cd /path/to/sibling && pytest -q`
5. Find 3 things they did better than you
6. Identify clever solutions or insights you missed

**Phase 3: Side-by-side comparison**

1. Create comparison table across all evaluation dimensions
2. For each dimension, declare a winner (V1/V2/Tie, etc.)
3. Count wins - be brutally honest
4. If another variant wins more dimensions, recommend it
5. If tied, use production readiness as tiebreaker

**Phase 4: Synthesis and recommendation**

1. Write executive summary - which variant and why
2. Identify best elements from non-recommended variants
3. Create integration plan with specific file paths
4. Document risks and monitoring requirements
5. Re-read your recommendation - would you defend it to the other implementers?

## Output Format

Write a comprehensive report with this structure:

```markdown
# Variant Comparison: [Topic/Feature Name]

## Environment Detection

**Current variant:** [Variant X or path if unclear]
**Sibling variants found:** [List of variants or "Unable to determine"]
**Requirements source:** [Backlog issue, git commits, code examination, etc.]
**Validation limitations:** [Any checks you couldn't perform]

## Executive Summary
**Recommendation: Variant [X]**

[2-3 sentences: Which variant and the single most important reason why. Be direct.]

**Confidence Level:** [High/Medium/Low] - [explain your certainty]

## Variant 1: [branch/worktree name]

### Requirements Coverage
[For each requirement, state: ✅ Fully met | ⚠️ Partially met | ❌ Not met]
- [Requirement 1]: [status and evidence with file:line references]
- [Requirement 2]: [status and evidence with file:line references]
- [Continue for all requirements]

### Strengths
[Bullet points - be specific with file:line references]
- [What they got right, with evidence]

### Critical Issues
[Bullet points - be specific, cite code]
- [Bugs, design flaws, missing requirements]
- [Rate severity: Critical/High/Medium/Low]

### Code Quality Assessment
- Clarity: [1-5 rating]/5 - [brief explanation]
- Maintainability: [1-5]/5 - [brief explanation]
- Conventions adherence: [1-5]/5 - [brief explanation]

### Test Quality
- Coverage: [X]% statement coverage (if available) or [count] tests
- Edge cases: [Excellent/Good/Adequate/Poor] - [what's missing]
- Would you deploy based on these tests? [Yes/No/With concerns] - [why]

### Production Readiness Score: [X]/10
[Justify the score - what makes it production ready or not]

## Variant 2: [branch/worktree name]

[Repeat same structure as Variant 1]

[If 3+ variants, continue with Variant 3, 4, etc.]

## Side-by-Side Comparison

| Dimension | Variant 1 | Variant 2 | [Variant 3...] | Winner | Rationale |
|-----------|-----------|-----------|----------------|--------|-----------|
| **Requirements Completeness** | [X/Y requirements] | [X/Y requirements] | ... | V# | [Why] |
| **Production Readiness** | [score]/10 | [score]/10 | ... | V# | [Key differentiator] |
| **Code Quality** | [score]/5 | [score]/5 | ... | V# | [What matters most] |
| **Test Coverage** | [quality level] | [quality level] | ... | V# | [Critical gaps?] |
| **Architecture** | [approach] | [approach] | ... | V# | [Better design?] |
| **Risk Level** | [risk level] | [risk level] | ... | V# | [Safest choice?] |

**Dimension Win Count:** V1: [X], V2: [Y], [V3: [Z]...], Tie: [N]

## Detailed Comparison

### What Variant [X] Does Better
[Specific strengths with file:line references]

### What Variant [Y] Does Better
[Specific strengths with file:line references]

[If 3+ variants, continue comparisons]

### Critical Differences in Approach
[Major architectural or design decisions that differ]

## Final Recommendation

**Adopt: Variant [X]**

### Primary Justification
[The single most compelling reason - be specific and cite evidence]

### Supporting Reasons
1. [Second most important factor]
2. [Third most important factor]
3. [Other considerations]

### Elements to Cherry-Pick from Non-Recommended Variants

For each variant that should NOT be adopted, identify what should be preserved:

- **[File/function/pattern from Variant Y]**: [Why it's better and how to integrate]
  - Location in other variant: [path:line]
  - Integration approach: [specific steps]
  - Estimated effort: [X hours/days]

### Integration Plan
1. [Step 1 with specific commands/file paths]
2. [Step 2 with verification steps]
3. [Step 3 with testing requirements]
4. [Any cleanup needed]

### Pre-Deployment Checklist
- [ ] All requirements verified in integration tests
- [ ] Run full test suite (0 failures)
- [ ] Test with production-like data volume
- [ ] Verify performance requirements maintained
- [ ] Add monitoring for success metrics
- [ ] Document rollback procedure
- [ ] [Any other critical items]

## Risk Assessment

### Risks with Recommended Variant
| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| [Risk 1] | H/M/L | H/M/L | [How to address] |
| [Risk 2] | H/M/L | H/M/L | [How to address] |

### Monitoring Requirements
After deployment, monitor:
- [Metric 1]: [Expected range and alert threshold]
- [Metric 2]: [Expected range and alert threshold]

### Rollback Plan
If issues detected in production:
1. [Immediate action]
2. [How to revert]
3. [Data integrity verification steps]

## Learning & Improvement

### What All Variants Got Right
[Patterns worth keeping for future work]

### What All Variants Missed
[Requirements or edge cases none fully addressed]

### Recommendations for Future Parallel Development
[What would make this comparison easier next time]

## Appendix: Test Results

### Variant 1 Test Output
```
[Paste test output, or note "Unable to run tests - evaluated by examining test files"]
```

### Variant 2 Test Output
```
[Paste test output, or note "Unable to run tests - evaluated by examining test files"]
```

[Continue for all variants]

## Honest Self-Assessment

**Before submitting, answer these questions:**

1. Would I defend this recommendation to the other implementers?
2. Have I been harsh enough on my own code?
3. Have I given other variants fair credit?
4. Would I bet money that my recommendation is right?
5. If the user deploys a different variant, will I be embarrassed?

**If you answered "no" or "maybe" to any question, revise your analysis.**
```

## File Output Instructions

**After completing your analysis:**

1. **Determine output location:**
   ```bash
   # Get main project root (adapt to your capabilities)
   MAIN_ROOT=$(git worktree list | head -1 | awk '{print $1}')

   # Build filename
   # Format: tmp/variant-comparison-<prefix>-v<X>.md
   # Example: tmp/variant-comparison-b3-download-state-machine-v2.md
   ```

   **If you can't determine MAIN_ROOT:** Use current worktree root and note the path in your report.

2. **Create tmp/ directory if needed:**
   ```bash
   mkdir -p "${MAIN_ROOT}/tmp"
   ```

3. **Write the complete report to file:**
   - Save your full analysis to: `${MAIN_ROOT}/tmp/variant-comparison-<prefix>-v<X>.md`
   - File will overwrite if re-run (this is intentional for latest analysis)

4. **Display the file content in session:**
   - After writing file, display the complete content so it's visible in the session
   - This ensures both file persistence and immediate visibility

**Output format summary:**
```
COMPARISON_REPORT_PATH=${MAIN_ROOT}/tmp/variant-comparison-<prefix>-v<X>.md
```

This makes the output path parseable for automation/CI systems.

## Important Guidelines

- **Do NOT modify any implementations** - this is purely code review
- **Do NOT let ego drive the recommendation** - be objective
- Be specific with file paths and line numbers when referencing code
- If all variants are equally good, say so and explain criteria for choosing
- If all have serious flaws, recommend rejecting all and creating a combined approach
- Run actual tests when possible; if not, evaluate by examining test files
- Check git logs to understand the evolution of decisions
- Document any validation steps you couldn't perform

## Anti-Patterns to Avoid

**Don't write:**
- "My approach is more elegant" (prove it with metrics)
- "The other variant is over-complicated" (or does it handle edge cases you missed?)
- "Both are fine" (there's always a better choice, find it)
- "I would pick mine but both work" (that's not a recommendation)
- Vague criticisms without file:line evidence

**Do write:**
- "Variant 2 handles [X] more correctly at file.py:245 because [specific reason]"
- "Variant 1's test coverage misses the case where [specific scenario with evidence]"
- "Variant 2's approach to [X] is objectively better because [measurable outcome]"
- "My implementation has a critical bug in [file:line]: [specific issue]"
- "The other variant should be adopted because [evidence-based reason]"

---

**Remember:** The codebase will outlive this moment. Pick the better implementation even if it's not yours.
