# Skills

个人维护的 Agent Skills 集合，收录原创技能和日常使用的社区技能，可通过 [Skills CLI](https://github.com/vercel-labs/skills) 安装到 Codex、Claude Code 等支持 Agent Skills 的工具。

## 目录结构

```text
skills/
├── mattpocock/       # 来自 mattpocock/skills
├── emilkowalski/     # 来自 emilkowalski/skills
├── shadcn/           # 来自 shadcn/improve
└── caven/            # 本仓库原创技能
```

每个 Skill 都有独立目录。社区 Skill 默认保留上游名称；发生重名时使用作者前缀。本仓库当前将两个上游的 `prototype` 发布为：

- `matt-prototype`
- `emil-prototype`

## 安装

在目标项目根目录执行，根据提示选择需要的 Skill 和 Agent：

```bash
npx skills@latest add keyding/skills
```

全局安装时添加 `-g`：

```bash
npx skills@latest add keyding/skills -g
```

查看可安装的 Skill：

```bash
npx skills@latest add keyding/skills --list
```

将全部 Skill 全局安装到 Claude Code 和 Codex：

```bash
npx skills@latest add keyding/skills --skill '*' -a claude-code codex -g -y
```

## 使用方法

请参阅 [Skills 使用指南](USAGE_zh-CN.md)，通过完整索引查看每个 Skill 的介绍、适用场景和调用方式。所有 Skill 都可以由人直接调用，其中部分也可能由 Agent 自动选择。

## 维护

上游来源、作者目录、重名改名和精确引用替换统一登记在 `skills-sources.json`。同步脚本会为每个上游创建隔离的临时工作区，避免同名 Skill 在下载阶段互相覆盖；`skills-sources.lock.json` 记录最近同步的上游 commit。

更新全部已登记上游：

```bash
npm run sync
```

只更新一个上游：

```bash
npm run sync -- mattpocock/skills
```

新增上游：

```bash
npm run add -- owner/repository
```

脚本发现新重名时会询问本地名称并写入来源清单。非交互环境可直接指定：

```bash
npm run add -- owner/repository \
  --rename prototype=owner-prototype
```

同步前应先提交现有修改；脚本默认拒绝覆盖有未提交修改的作者目录。运行 `npm run check` 可只下载和验证；需要明确替换有本地修改的第三方目录时，运行 `npm run sync -- --force`。同步完成后审查 Git diff，再提交发布。

原创 Skill 直接创建在 `skills/caven/<skill-name>/`。长期定制第三方 Skill 时，将其作为派生 Skill 放入 `skills/caven/`，使用新的唯一名称并记录来源。

## 许可证

本仓库原创内容采用 [MIT License](LICENSE)。第三方 Skill 沿用各自的许可证，详情见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) 和 `LICENSES/`。

## 致谢

- [mattpocock/skills](https://github.com/mattpocock/skills)
- [emilkowalski/skills](https://github.com/emilkowalski/skills)
- [shadcn/improve](https://github.com/shadcn/improve)
- [vercel-labs/skills](https://github.com/vercel-labs/skills)
