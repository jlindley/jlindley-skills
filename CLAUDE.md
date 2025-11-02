# jlindley-skills Repository

This repository contains Jim's personal skills for Claude Code.

## Testing Skills

**IMPORTANT:** Never commit test files to this repository's git history.

### Testing Location

Use the `tmp/` directory (gitignored) for all test projects:

```bash
# Create throwaway git repo for testing
mkdir -p tmp/test-project-name
cd tmp/test-project-name
git init
# ... test your skill ...
# When done, delete: rm -rf tmp/test-project-name
```

### Why?

Skills often need real git repositories to test properly (commits, branches, diffs, etc.). But test files pollute the skills repo history and make it harder to track actual skill changes.

### Testing Workflow

1. **Create test project:** `mkdir -p tmp/my-test && cd tmp/my-test && git init`
2. **Test your skill:** Run full cycles, create commits, etc.
3. **Clean up:** `cd ../.. && rm -rf tmp/my-test`

The `tmp/` directory is gitignored, so test projects won't accidentally get committed.

## Skill Development

Follow the writing-skills skill for creating and testing skills. Remember to use TDD approach:
- RED: Test without skill (baseline)
- GREEN: Write skill to address baseline failures
- REFACTOR: Close loopholes and re-test
