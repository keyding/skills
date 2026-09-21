# shadcn 的 Skills

[全部 Skill 指南](README_zh-CN.md) · [English](shadcn.md)

## `improve`

**Skill 介绍：** 以高级顾问视角审查代码库，找出高价值改进项，并为其他 Agent 编写带优先级、可独立执行的实施计划。它对源代码保持只读，主要产物是计划而不是代码修改。

**具体使用场景与方法：** 当你希望审计代码库中的 Bug、安全、性能、测试覆盖率、架构、依赖、开发体验、文档、迁移或产品方向，但暂时不直接修改实现时使用。调用 `/improve` 执行标准完整审计；追加 `quick` 或 `deep` 可调整覆盖深度，也可以指定分类，例如 `/improve security`。

常用变体：

- `/improve branch` — 只审查当前分支的改动。
- `/improve next` — 调研有仓库证据支持的产品和路线图机会。
- `/improve plan <描述>` — 跳过广泛审计，直接编写一个实施计划。
- `/improve review-plan <文件>` — 审查并收紧已有计划。
- `/improve execute <计划>` — 将计划交给隔离的执行 Agent，并审查执行结果。
- `/improve reconcile` — 根据当前代码刷新计划状态和漂移情况。
- 只有需要同时把选中计划发布为 GitHub Issue 时才添加 `--issues`。

该 Skill 默认将计划写入 `plans/`；如果该目录已有其他用途，则写入 `advisor-plans/`。目标是审计、规划和排序时使用它；如果希望当前 Agent 直接修改源代码，应改用实施类 Skill。
