# jlindley-skills

Claude Code plugin containing personal skills for session management, spike
exploration, and autonomous execution.

## Layout

```
.claude-plugin/
  plugin.json
skills/
  <skill-name>/
    SKILL.md
```

Each skill lives in its own directory with a `SKILL.md` file containing
frontmatter and operating procedure.

## Installation

Install via the [jlindley-marketplace](https://github.com/jlindley/jlindley-marketplace):

```bash
/plugin marketplace add ~/Code/jlindley-marketplace
/plugin install jlindley-skills@jlindley-marketplace
```
