# Skills

A personal Agent Skills collection containing original skills and community skills used in daily work. Install it with the [Skills CLI](https://github.com/vercel-labs/skills) in Codex, Claude Code, and other tools that support Agent Skills.

## Repository Layout

```text
skills/
├── mattpocock/       # From mattpocock/skills
├── emilkowalski/     # From emilkowalski/skills
├── shadcn/           # From shadcn/improve
├── coreyhaines31/    # From coreyhaines31/marketingskills
└── caven/            # Original skills maintained here
```

Each skill has its own directory. Community skills keep their upstream names unless a collision requires an author prefix. The two upstream `prototype` skills are published here as:

- `matt-prototype`
- `emil-prototype`

## Installation

Run this command from a target project's root and select the skills and agents you want:

```bash
npx skills@latest add keyding/skills
```

Add `-g` for a global installation:

```bash
npx skills@latest add keyding/skills -g
```

List the available skills:

```bash
npx skills@latest add keyding/skills --list
```

Install every skill globally for Claude Code and Codex:

```bash
npx skills@latest add keyding/skills --skill '*' -a claude-code codex -g -y
```

## Usage

See the [Skill Usage Guide](USAGE.md) for a complete skill index, detailed introductions, usage scenarios, and invocation examples. Every skill can be invoked directly; some may also be selected automatically by an agent.

## Maintenance

`skills-sources.json` is the source of truth for upstream repositories, author directories, collision renames, and exact reference replacements. The sync script downloads each upstream into an isolated temporary workspace so duplicate names cannot overwrite one another. `skills-sources.lock.json` records the last synchronized upstream commits.

Update every registered upstream:

```bash
npm run sync
```

Update one upstream:

```bash
npm run sync -- mattpocock/skills
```

Add another upstream:

```bash
npm run add -- owner/repository
```

When a new collision is found, the script asks for a local name and records it. In a non-interactive environment, provide the mapping directly:

```bash
npm run add -- owner/repository \
  --rename prototype=owner-prototype
```

Commit existing work before syncing. By default, the script refuses to replace an author directory with uncommitted changes. Run `npm run check` to download and validate without publishing. Use `npm run sync -- --force` to explicitly replace locally modified third-party directories. Review the Git diff after synchronization, then commit the update.

Repository maintainers can invoke the repository-local `/maintain-skills-collection` Skill after adding or updating a source. It audits the source, licensing, bilingual catalog, indexes, and installation without being published as part of this collection.

Create original skills directly under `skills/caven/<skill-name>/`. Put long-lived third-party customizations in `skills/caven/` as separately named derivative skills with their source recorded.

## License

Original content in this repository is licensed under the [MIT License](LICENSE). Third-party skills retain their respective licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and `LICENSES/`.

## Acknowledgments

- [mattpocock/skills](https://github.com/mattpocock/skills)
- [emilkowalski/skills](https://github.com/emilkowalski/skills)
- [shadcn/improve](https://github.com/shadcn/improve)
- [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills)
- [vercel-labs/skills](https://github.com/vercel-labs/skills)
