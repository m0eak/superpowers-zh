---
name: "superpowers-zh-bundle"
description: "superpowers-zh 20 个编程方法论 skill 的合集入口（导入这一个即覆盖全部）：头脑风暴、编写/执行计划、TDD、系统化调试、请求/接收代码审查、完成前验证、并行派遣、子 agent 开发、git worktree、分支收尾、MCP 服务器构建、YAML 工作流，以及中文代码审查话术、中文 commit 规范、中文文档排版、国内 Git 平台（Gitee/Coding/极狐/CNB）工作流。激活后按正文表格定位子技能文件并严格遵循。关键词：头脑风暴、brainstorming、实现计划、TDD、测试驱动、调试、debug、根因分析、代码审查、code review、PR 审查、commit 规范、提交信息、中文排版、文档规范、Gitee、worktree、分支合并、MCP、YAML 工作流、完成前验证、证据先行、子 agent、并行任务、superpowers、方法论。"
version: "1.0.0+lobe.2026-09-10"
license: "MIT"
---

<!-- 自动生成，勿手改。由 tools/lobehub-adapter/generate.mjs 于 2026-09-10 从 superpowers-zh@8d1b39d 生成。 -->

# Superpowers 方法论合集（20 合一入口）

本文件是 `dist/lobehub-skills/` 的合集入口：导入这一个 skill，即可获得全部 20 个编程方法论子技能的目录与使用协议。每个子技能的完整正文在其同名文件夹的 `SKILL.md`（含 scripts/、参考文档等捆绑资源）。

## 使用协议

1. 判断当前任务命中下表哪一行（可同时多行）。
2. 加载对应行的「文件」：优先将其作为本技能的捆绑引用文件读取（技能目录内直接读，或平台提供的引用文件机制）。
3. 若导入时平台没有把子目录文件一并打包（只有本 SKILL.md），改用该行「直链」列的 raw URL 在线获取正文（curl/网页抓取均可），再继续。
4. 严格按子技能正文的步骤、检查清单与铁律执行；多行命中时先流程类（头脑风暴 → 编写计划 → 执行计划），后质量类（TDD、调试、审查、完成前验证）。
5. `using-superpowers` 仅作背景约定参考，不要把它当工作流加载。

## 子技能目录

| 子技能 | 何时用 | 文件 | 直链 |
|---|---|---|---|
| `brainstorming` | 在任何创造性工作（新功能、新组件、改行为、写代码）之前先做需求与设计探索，明确用户意图和边界，再动手实现 | `brainstorming/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/brainstorming/SKILL.md) |
| `chinese-code-review` | 中文代码审查话术与规范——分级标注（必须修复/建议修改/仅供参考）、中英混排注释、国内团队反模式应对 | `chinese-code-review/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/chinese-code-review/SKILL.md) |
| `chinese-commit-conventions` | 中文 commit message 与 changelog 规范——Conventional Commits 中文适配、commitlint/husky/commitizen 中文模板、conventional-changelog 配置 | `chinese-commit-conventions/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/chinese-commit-conventions/SKILL.md) |
| `chinese-documentation` | 中文技术文档排版规范——中英文之间空格、全半角标点、术语保留英文、链接格式、中文文案排版指北 | `chinese-documentation/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/chinese-documentation/SKILL.md) |
| `chinese-git-workflow` | 国内 Git 平台工作流配置——Gitee、Coding.net、极狐 GitLab、CNB 的 SSH/HTTPS/凭据/CI 接入差异与镜像同步 | `chinese-git-workflow/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/chinese-git-workflow/SKILL.md) |
| `dispatching-parallel-agents` | 面对两个及以上相互独立、无共享状态、无先后依赖的任务时，派遣并行 agent 并发执行 | `dispatching-parallel-agents/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/dispatching-parallel-agents/SKILL.md) |
| `executing-plans` | 按一份已写好的实现计划逐步执行，在审查检查点停下核对，每步验证后再继续 | `executing-plans/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/executing-plans/SKILL.md) |
| `finishing-a-development-branch` | 实现完成、测试通过后决定如何集成这份改动：合并 / 提 PR / 保留 / 丢弃四选一 | `finishing-a-development-branch/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/finishing-a-development-branch/SKILL.md) |
| `mcp-builder` | 构建生产级 MCP 服务器或 MCP 工具——工具设计、输入校验、错误处理、传输层选择与测试 | `mcp-builder/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/mcp-builder/SKILL.md) |
| `receiving-code-review` | 收到代码审查反馈后、实施修改前，以技术严谨性判断并验证每条建议，而非敷衍附和或盲目照改 | `receiving-code-review/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/receiving-code-review/SKILL.md) |
| `requesting-code-review` | 完成任务、实现重要功能或合并前，主动派遣审查 agent 检查代码质量、安全与正确性 | `requesting-code-review/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/requesting-code-review/SKILL.md) |
| `subagent-driven-development` | 在当前会话中以子 agent 为单位驱动实现计划：每个任务一个 agent，配两轮审查 | `subagent-driven-development/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/subagent-driven-development/SKILL.md) |
| `systematic-debugging` | 遇到任何 bug、测试失败或异常行为时，先按四阶段（定位→分析→假设→修复）系统化调试，再提修复方案，而非猜测乱改 | `systematic-debugging/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/systematic-debugging/SKILL.md) |
| `test-driven-development` | 实现任何功能或修 bug 时严格遵循 TDD：先写失败测试（红），再写实现（绿），最后重构 | `test-driven-development/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/test-driven-development/SKILL.md) |
| `using-git-worktrees` | 需要与当前工作区隔离地做功能开发，或在执行实现计划前确保有独立工作区时，用 git worktree（或平台原生隔离）建立隔离环境 | `using-git-worktrees/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/using-git-worktrees/SKILL.md) |
| `using-superpowers` | superpowers 技能集的使用总则：如何按优先级选用合适的编程方法论 skill | `using-superpowers/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/using-superpowers/SKILL.md) |
| `verification-before-completion` | 在宣称『完成/已修复/测试通过』之前，必须先运行验证命令并确认输出，证据先于结论 | `verification-before-completion/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/verification-before-completion/SKILL.md) |
| `workflow-runner` | 直接运行 agency-orchestrator 的多角色 YAML 工作流（无需 API key），按 YAML 编排依次执行 | `workflow-runner/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/workflow-runner/SKILL.md) |
| `writing-plans` | 拿到规格或需求后、动手写代码前，把它拆成可执行的实现计划（范围检查、文件结构、任务粒度） | `writing-plans/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/writing-plans/SKILL.md) |
| `writing-skills` | 创建、编辑或部署前验证一个 skill 时使用——用类 TDD 方法打磨技能定义与触发描述 | `writing-skills/SKILL.md` | [获取](https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills/writing-skills/SKILL.md) |

## 版本

上游 superpowers-zh@8d1b39d，生成于 2026-09-10。子技能各自的版本与 contentHash 见 `../manifest.json`。
