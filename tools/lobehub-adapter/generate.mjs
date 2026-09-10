#!/usr/bin/env node
// superpowers-zh → LobeHub skill 适配层生成器
// 作用：读上游 skills/<name>/SKILL.md，套用 overrides.json 的 description 覆写
//       与正文正则替换，连同捆绑资源一起输出到 dist/lobehub-skills/。
// 原则：绝不改动 skills/ 本体（保证每日 merge upstream 永远干净）；dist 全量重写。
// 用法：node tools/lobehub-adapter/generate.mjs

import { readFileSync, writeFileSync, readdirSync, statSync, rmSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const SRC = join(REPO, "skills");
const OUT = join(REPO, "dist", "lobehub-skills");

const overrides = JSON.parse(readFileSync(join(HERE, "overrides.json"), "utf-8")).skills || {};

function ensureDir(d) { if (!existsSync(d)) mkdirSync(d, { recursive: true }); }

function walk(dir, base = dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, base, acc);
    else acc.push(relative(base, full).split(sep).join("/"));
  }
  return acc;
}

// 解析 frontmatter：返回 { fields:{k:v}, raw, body }（仅支持单层缩进的简单 YAML）
function parseFrontmatter(txt) {
  const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fields: {}, body: txt };
  const fm = m[1];
  const body = txt.slice(m[0].length);
  const fields = {};
  // 只提取顶层 key: value（含引号），多行 description 折叠成一行
  const lines = fm.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const km = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!km) continue;
    const key = km[1];
    let val = km[2];
    // 处理块标量 | 或 > （简单：把后续缩进行拼上）
    if (val === "|" || val === ">" || /^\|[+-]?$/.test(val) || /^>[+-]?$/.test(val)) {
      const block = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) { block.push(lines[++i].trim()); }
      val = block.join(" ");
    } else {
      val = val.trim();
      if ((val.startsWith('"') && val.endsWith('"') && val.length > 1) || (val.startsWith("'") && val.endsWith("'") && val.length > 1)) {
        val = val.slice(1, -1).replace(/"/g, "'");
      }
    }
    fields[key] = val;
  }
  return { fields, body };
}

function yamlQuote(s) {
  // 双引号包裹，转义内部双引号与反斜杠，保证安全
  return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, " ") + '"';
}

function upCommit() {
  try { return execSync(`git -C ${JSON.stringify(REPO)} rev-parse --short HEAD`, { encoding: "utf-8" }).trim(); }
  catch { return "unknown"; }
}

function main() {
  const stamp = new Date().toISOString().slice(0, 10);
  const commit = upCommit();
  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);

  const names = existsSync(SRC)
    ? readdirSync(SRC).filter((d) => statSync(join(SRC, d)).isDirectory() && existsSync(join(SRC, d, "SKILL.md")))
    : [];

  const manifest = [];

  for (const name of names) {
    const srcDir = join(SRC, name);
    const { fields, body } = parseFrontmatter(readFileSync(join(srcDir, "SKILL.md"), "utf-8"));
    const ov = overrides[name] || {};

    const desc = ov.description || fields.description || name;

    let out = body;
    if (Array.isArray(ov.replaceInBody)) {
      for (const r of ov.replaceInBody) {
        out = out.replace(new RegExp(r.pattern, "g"), r.replacement);
      }
    }

    const outDir = join(OUT, name);
    ensureDir(outDir);

    // 复制捆绑资源（除 SKILL.md 外的所有文件）
    for (const rel of walk(srcDir)) {
      if (rel === "SKILL.md") continue;
      const dest = join(outDir, rel);
      ensureDir(dirname(dest));
      copyFileSync(join(srcDir, rel), dest);
    }

    const srcVersion = fields.version || "0.0.0";
    const newVersion = `${srcVersion}+lobe.${stamp}`;

    const front = [
      "---",
      `name: ${yamlQuote(fields.name || name)}`,
      `description: ${yamlQuote(desc)}`,
      `version: ${yamlQuote(newVersion)}`,
      fields.license ? `license: ${yamlQuote(fields.license)}` : null,
      "---",
      "",
      `<!-- 自动生成，勿手改。由 tools/lobehub-adapter/generate.mjs 于 ${stamp} 从 superpowers-zh@${commit} 生成。`,
      `     要改内容请改上游 skills/ 或 overrides.json 后重新生成。 -->`,
      "",
    ].filter(Boolean).join("\n");

    const final = front + out;
    writeFileSync(join(outDir, "SKILL.md"), final, "utf-8");

    const hash = createHash("sha256").update(final).digest("hex").slice(0, 12);
    manifest.push({ name, version: newVersion, contentHash: hash, summary: desc, resources: walk(srcDir).filter((f) => f !== "SKILL.md") });
  }

  // —— 20 合一 bundle 入口：dist/lobehub-skills/SKILL.md ——
  // LobeHub「导入一个」的唯一可行形态：合集 SKILL.md 自带路由表+使用协议，
  // 子技能正文作为同目录引用文件按需加载；raw 直链兜底（平台未捆绑子目录时）。
  const bundleDesc = "superpowers-zh 20 个编程方法论 skill 的合集入口（导入这一个即覆盖全部）：头脑风暴、编写/执行计划、TDD、系统化调试、请求/接收代码审查、完成前验证、并行派遣、子 agent 开发、git worktree、分支收尾、MCP 服务器构建、YAML 工作流，以及中文代码审查话术、中文 commit 规范、中文文档排版、国内 Git 平台（Gitee/Coding/极狐/CNB）工作流。激活后按正文表格定位子技能文件并严格遵循。关键词：头脑风暴、brainstorming、实现计划、TDD、测试驱动、调试、debug、根因分析、代码审查、code review、PR 审查、commit 规范、提交信息、中文排版、文档规范、Gitee、worktree、分支合并、MCP、YAML 工作流、完成前验证、证据先行、子 agent、并行任务、superpowers、方法论。";
  const RAW = "https://raw.githubusercontent.com/m0eak/superpowers-zh/main/dist/lobehub-skills";
  const bundleRows = manifest.map((m) => {
    const purpose = String(m.summary).split("。关键词")[0];
    return `| \`${m.name}\` | ${purpose} | \`${m.name}/SKILL.md\` | [获取](${RAW}/${m.name}/SKILL.md) |`;
  }).join("\n");

  const bundleMd = [
    "---",
    'name: "superpowers-zh-bundle"',
    `description: ${yamlQuote(bundleDesc)}`,
    `version: ${yamlQuote("1.0.0+lobe." + stamp)}`,
    'license: "MIT"',
    "---",
    "",
    `<!-- 自动生成，勿手改。由 tools/lobehub-adapter/generate.mjs 于 ${stamp} 从 superpowers-zh@${commit} 生成。 -->`,
    "",
    "# Superpowers 方法论合集（20 合一入口）",
    "",
    "本文件是 `dist/lobehub-skills/` 的合集入口：导入这一个 skill，即可获得全部 20 个编程方法论子技能的目录与使用协议。每个子技能的完整正文在其同名文件夹的 `SKILL.md`（含 scripts/、参考文档等捆绑资源）。",
    "",
    "## 使用协议",
    "",
    "1. 判断当前任务命中下表哪一行（可同时多行）。",
    "2. 加载对应行的「文件」：优先将其作为本技能的捆绑引用文件读取（技能目录内直接读，或平台提供的引用文件机制）。",
    "3. 若导入时平台没有把子目录文件一并打包（只有本 SKILL.md），改用该行「直链」列的 raw URL 在线获取正文（curl/网页抓取均可），再继续。",
    "4. 严格按子技能正文的步骤、检查清单与铁律执行；多行命中时先流程类（头脑风暴 → 编写计划 → 执行计划），后质量类（TDD、调试、审查、完成前验证）。",
    "5. `using-superpowers` 仅作背景约定参考，不要把它当工作流加载。",
    "",
    "## 子技能目录",
    "",
    "| 子技能 | 何时用 | 文件 | 直链 |",
    "|---|---|---|---|",
    bundleRows,
    "",
    "## 版本",
    "",
    `上游 superpowers-zh@${commit}，生成于 ${stamp}。子技能各自的版本与 contentHash 见 \`../manifest.json\`。`,
    "",
  ].join("\n");
  writeFileSync(join(OUT, "SKILL.md"), bundleMd, "utf-8");

  const readme = [
    "# dist/lobehub-skills",
    "",
    "机器生成的 LobeHub 可导入 skill，请勿手改；每次同步上游会全量重写。",
    "",
    "## 推荐：一次导入（合集入口）",
    "",
    "本目录根的 `SKILL.md`（`superpowers-zh-bundle`）是 20 合一入口：内含全部子技能的",
    "路由表 + 使用协议。只导入这一个，激活后按表格加载对应子文件夹的 SKILL.md；",
    "若导入时子目录未被捆绑，表格同时提供 raw 直链兜底。",
    "",
    "```",
    "https://github.com/m0eak/superpowers-zh/blob/main/dist/lobehub-skills/SKILL.md",
    "```",
    "",
    "## 可选：逐个导入（路由更精准）",
    "",
    "单个 skill 导入 URL 形如：",
    "",
    "```",
    "https://github.com/m0eak/superpowers-zh/blob/main/dist/lobehub-skills/<name>/SKILL.md",
    "```",
    "",
    `生成时间：${stamp}  来源：superpowers-zh@${commit}  共 ${manifest.length} 个。`,
    "",
    "| skill | version | 资源 |",
    "|---|---|---|",
    ...manifest.map((m) => `| ${m.name} | ${m.version} | ${m.resources.length ? m.resources.join(", ") : "—"} |`),
    "",
  ].join("\n");
  writeFileSync(join(OUT, "README.md"), readme, "utf-8");
  writeFileSync(join(REPO, "dist", "manifest.json"), JSON.stringify({ generatedAt: stamp, upstreamCommit: commit, count: manifest.length, skills: manifest }, null, 2) + "\n", "utf-8");

  console.log(`✓ 生成 ${manifest.length} 个 skill → dist/lobehub-skills/  (upstream ${commit}, ${stamp})`);
}

main();
