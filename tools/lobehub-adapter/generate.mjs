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
    manifest.push({ name, version: newVersion, contentHash: hash, resources: walk(srcDir).filter((f) => f !== "SKILL.md") });
  }

  const readme = [
    "# dist/lobehub-skills",
    "",
    "机器生成的 LobeHub 可导入 skill，请勿手改；每次同步上游会全量重写。",
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
