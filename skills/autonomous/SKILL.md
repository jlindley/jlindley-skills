---
description: Resume or start autonomous execution of implementation plans
---

Check if the file `.autonomous-execution-state.json` exists in the current working directory.

**If the file exists:**
- Read the `.autonomous-execution-state.json` file to understand the current state
- Use the Skill tool to load the `jlindley-skills:autonomous-execution` skill
- Resume execution from where we left off based on the state file

**If the file does NOT exist:**
- Use the Skill tool to load the `jlindley-skills:autonomous-execution` skill
- Ask me which implementation plan we're going to execute
- Begin autonomous execution once I provide the plan

Remember: This skill is designed for extended autonomous work sessions. Follow the skill's guidance for state management, context preservation, and comprehensive reporting.
