# dist/lobehub-skills

机器生成的 LobeHub 可导入 skill，请勿手改；每次同步上游会全量重写。

## 推荐：一次导入（合集入口）

本目录根的 `SKILL.md`（`superpowers-zh-bundle`）是 20 合一入口：内含全部子技能的
路由表 + 使用协议。只导入这一个，激活后按表格加载对应子文件夹的 SKILL.md；
若导入时子目录未被捆绑，表格同时提供 raw 直链兜底。

```
https://github.com/m0eak/superpowers-zh/blob/main/dist/lobehub-skills/SKILL.md
```

## 可选：逐个导入（路由更精准）

单个 skill 导入 URL 形如：

```
https://github.com/m0eak/superpowers-zh/blob/main/dist/lobehub-skills/<name>/SKILL.md
```

生成时间：2026-09-30  来源：superpowers-zh@6076075  共 21 个。

| skill | version | 资源 |
|---|---|---|
| brainstorming | 1.0.0+lobe.2026-09-30 | scripts/frame-template.html, scripts/helper.js, scripts/server.cjs, scripts/start-server.sh, scripts/stop-server.sh, spec-document-reviewer-prompt.md, visual-companion.md |
| chinese-code-review | 1.0.0+lobe.2026-09-30 | — |
| chinese-commit-conventions | 1.0.0+lobe.2026-09-30 | — |
| chinese-documentation | 1.0.0+lobe.2026-09-30 | — |
| chinese-git-workflow | 1.0.0+lobe.2026-09-30 | — |
| diagnosing-superpowers | 1.0.0+lobe.2026-09-30 | prompts/analyst-common.md, prompts/cost-and-time.md, prompts/plan-adherence.md, prompts/quality-evidence.md, prompts/repeated-work.md, prompts/request-conflicts.md, prompts/scrub-audit.md, prompts/scrub.md, prompts/similar-session.md, prompts/skill-timeline.md, prompts/stumbles.md, references/context-safety.md, references/github-issues.md, references/redaction-policy.md, references/session-discovery.md, templates/bundle-README.md, templates/case.md, templates/issue.md, templates/report.md |
| dispatching-parallel-agents | 1.0.0+lobe.2026-09-30 | — |
| executing-plans | 1.0.0+lobe.2026-09-30 | scripts/task-done, scripts/task-start |
| finishing-a-development-branch | 1.0.0+lobe.2026-09-30 | — |
| mcp-builder | 1.0.0+lobe.2026-09-30 | — |
| receiving-code-review | 1.0.0+lobe.2026-09-30 | — |
| requesting-code-review | 1.0.0+lobe.2026-09-30 | code-reviewer.md |
| subagent-driven-development | 1.0.0+lobe.2026-09-30 | implementer-prompt.md, re-review-prompt.md, scripts/review-package, scripts/sdd-workspace, scripts/task-brief, task-reviewer-prompt.md |
| systematic-debugging | 1.0.0+lobe.2026-09-30 | CREATION-LOG.md, condition-based-waiting-example.ts, condition-based-waiting.md, defense-in-depth.md, find-polluter.sh, root-cause-tracing.md, test-academic.md, test-pressure-1.md, test-pressure-2.md, test-pressure-3.md |
| test-driven-development | 1.0.0+lobe.2026-09-30 | writing-good-tests.md |
| using-git-worktrees | 1.0.0+lobe.2026-09-30 | — |
| using-superpowers | 1.0.0+lobe.2026-09-30 | references/antigravity-tools.md, references/claude-code-tools.md, references/codex-tools.md, references/copilot-tools.md, references/gemini-tools.md, references/hermes-tools.md, references/muse-tools.md, references/pi-tools.md, references/qoder-tools.md |
| verification-before-completion | 1.0.0+lobe.2026-09-30 | — |
| workflow-runner | 1.0.0+lobe.2026-09-30 | — |
| writing-plans | 1.0.0+lobe.2026-09-30 | — |
| writing-skills | 1.0.0+lobe.2026-09-30 | anthropic-best-practices.md, examples/CLAUDE_MD_TESTING.md, graphviz-conventions.dot, persuasion-principles.md, render-graphs.js, testing-skills-with-subagents.md |
