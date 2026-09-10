# lobehub-adapter

把上游 `skills/`（superpowers-zh，面向 Claude Code/OpenClaw 等 CLI 的 plugin）转译成
**LobeHub 可直接导入**的 skill，输出到 `dist/lobehub-skills/`。

## 为什么需要它

LobeHub 的 skill 路由靠 `SKILL.md` 里 `description` 的关键词匹配，没有斜杠命令、
没有 SessionStart hook。上游 4 个 `chinese-*` skill 的 description 写着
「仅在用户显式 /chinese-xxx 时调用，不要自动触发」，直接导入会永不触发；
且部分 skill 引用 `Skill 工具` 等 LobeHub 不存在的机制。

## 做了什么

对每个 skill：
1. 用 `overrides.json` 里的 `description` 覆写（改成带关键词的自描述）；
2. 按 `replaceInBody` 正则做最小正文改写（仅 using-superpowers 用到）；
3. 复制全部捆绑资源（scripts/、*.md 等），保留可加载性；
4. 打版本戳 `<上游版本>+lobe.<日期>`，头部加「自动生成勿手改」注释；
5. 汇总 `dist/manifest.json`（含每个 skill 的 contentHash，供差异比对）。

## 不变量

- **绝不修改 `skills/` 本体** → 保证每日 `merge upstream/main` 永远干净。
- `dist/` 每次全量重写，可安全 `git rm -r` 后重建。

## 本地运行

```bash
node tools/lobehub-adapter/generate.mjs
```

无需任何 npm 依赖（仅 Node 内置模块）。

## 导入 LobeHub

单个 skill 的导入 URL：

```
https://github.com/m0eak/superpowers-zh/blob/main/dist/lobehub-skills/<name>/SKILL.md
```

在 LobeHub 里用 `importSkill`（type=url）逐个导入；哪些变了看
`dist/manifest.json` 的 `contentHash` 或各 `SKILL.md` 的 `version` 日期戳。
