# jlindley-skills

Personal Claude skills packaged for reuse, mirroring the structure used by the
official Superpowers marketplace.

## Layout

```
skills/
  <skill-name>/
    SKILL.md
```

- Each skill lives in its own directory with a single `SKILL.md` file that
  contains the frontmatter and operating procedure.
- Skills use a flat structure (no category subdirectories) to match Claude Code's
  plugin skill discovery requirements.

## Installation

1. Clone or update this repo.
2. Point Claude at `skills/` (for example by symlinking
   `~/.claude/skills -> ~/Code/jlindley-skills/skills`).
3. Reload Claude Code so it picks up the updated skills.

## Source of Truth

The files in this repository replace the copies previously tracked by chezmoi
under `~/.local/share/chezmoi/dot_claude/skills/`. Future skill authoring
should happen here first, with optional publishing back to chezmoi or other
locations if needed.
