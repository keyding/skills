# shadcn's skills

[All skill guides](README.md) · [中文版](shadcn.zh-CN.md)

## `improve`

**Skill overview:** Surveys a codebase as a senior advisor, identifies high-value improvements, and writes prioritized, self-contained implementation plans for other agents to execute. It remains read-only on source code; its primary product is the plan.

**When and how to use:** Use it when you want to audit a codebase for bugs, security, performance, test coverage, architecture, dependencies, developer experience, documentation, migrations, or product direction without immediately changing implementation. Invoke `/improve` for the standard full audit, add `quick` or `deep` to change coverage, or name a category such as `/improve security`.

Useful variants:

- `/improve branch` — audit changes on the current branch.
- `/improve next` — investigate grounded product and roadmap opportunities.
- `/improve plan <description>` — skip the broad audit and write one implementation plan.
- `/improve review-plan <file>` — tighten an existing plan.
- `/improve execute <plan>` — send a plan to an isolated executor and review the result.
- `/improve reconcile` — refresh plan status and drift against the current codebase.
- Add `--issues` only when you also want selected plans published as GitHub issues.

The skill writes plans under `plans/`, or `advisor-plans/` when `plans/` already has another purpose. Use it when planning and prioritization are the goal; use an implementation skill when you want the current agent to edit source code directly.
