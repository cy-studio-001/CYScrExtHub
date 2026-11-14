#!/usr/bin/env node
/**
 * 仓库一致性检查（在 GitHub Actions 内运行）。
 *
 * 扫描 extensions/<id>/ 下的 manifest 与文件，输出 _reports/consistency.json。
 * 只读仓库，不修改任何扩展数据。
 *
 * 用法：node scripts/migrate-v2/consistency-report.mjs --root . --request-id <id>
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
function arg(name, fallback) {
    const index = args.indexOf(name);
    return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const ROOT = path.resolve(arg('--root', '.'));
const REQUEST_ID = arg('--request-id', 'manual');
const APPLY = args.includes('--apply');
const BACKUP_TAG = process.env.BACKUP_TAG || '';
const REPORT_PATH = path.join(ROOT, '_reports', 'consistency.json');
const STAGING_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function gitBlobSha1(buffer) {
    const header = Buffer.from(`blob ${buffer.length}\0`, 'utf8');
    return crypto.createHash('sha1').update(header).update(buffer).digest('hex');
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function checkManifest(manifest) {
    const errors = [];
    if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
        return ['manifest 必须是对象'];
    }
    if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
        errors.push('files 不能为空');
        return errors;
    }
    const names = new Set();
    for (const file of manifest.files) {
        if (!file || typeof file !== 'object') { errors.push('files[] 元素非法'); continue; }
        if (typeof file.name !== 'string' || !file.name.endsWith('.js')) errors.push('files[].name 必须以 .js 结尾');
        if (names.has(file.name)) errors.push(`files[] 重复版本: ${file.name}`);
        names.add(file.name);
        if (typeof file.version !== 'string' || file.name !== `${file.version}.js`) {
            errors.push(`files[].name 与 version 不一致: ${file.name}`);
        }
        if (!Number.isInteger(file.size) || file.size < 0) errors.push('files[].size 非法');
        if (typeof file.sha !== 'string' || !/^[0-9a-f]{40}$/.test(file.sha)) errors.push('files[].sha 非法');
    }
    if (typeof manifest.current !== 'string' || !names.has(manifest.current)) {
        errors.push('current 未指向 files[] 中的文件');
    }
    return errors;
}

const report = {
    request_id: REQUEST_ID,
    generated_at: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || '',
    counts: {
        extensions: 0,
        manifests: 0,
        missing_manifests: 0,
        invalid_manifests: 0,
        missing_files: 0,
        orphan_files: 0,
        size_mismatch: 0,
        sha_mismatch: 0,
        stale_staging: 0,
    },
    missing_manifests: [],
    invalid_manifests: [],
    missing_files: [],
    orphan_files: [],
    size_mismatch: [],
    sha_mismatch: [],
    stale_staging_files: [],
};

const extensionsDir = path.join(ROOT, 'extensions');
const dirs = fs.existsSync(extensionsDir)
    ? fs.readdirSync(extensionsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
    : [];

report.counts.extensions = dirs.length;

for (const id of dirs.sort()) {
    const dir = path.join(extensionsDir, id);
    const files = fs.readdirSync(dir).filter((name) => fs.statSync(path.join(dir, name)).isFile());
    const manifestFile = path.join(dir, 'manifest.json');

    if (!fs.existsSync(manifestFile)) {
        report.missing_manifests.push(id);
        for (const name of files) report.orphan_files.push({ id, path: `extensions/${id}/${name}` });
        continue;
    }

    let manifest;
    try {
        manifest = readJson(manifestFile);
    } catch (error) {
        report.invalid_manifests.push({ id, error: `manifest 不是有效 JSON: ${error.message}` });
        continue;
    }

    const errors = checkManifest(manifest);
    if (errors.length > 0) {
        report.invalid_manifests.push({ id, error: errors.join('; ') });
        continue;
    }
    report.counts.manifests += 1;

    const expected = new Set(['manifest.json']);
    if (typeof manifest.cover === 'string') expected.add(manifest.cover);

    for (const file of manifest.files) {
        expected.add(file.name);
        const full = path.join(dir, file.name);
        const rel = `extensions/${id}/${file.name}`;

        if (!fs.existsSync(full)) {
            report.missing_files.push({ id, path: rel });
            continue;
        }

        const buffer = fs.readFileSync(full);
        if (buffer.length !== file.size) {
            report.size_mismatch.push({ id, path: rel, expected: file.size, actual: buffer.length });
        }
        const sha = gitBlobSha1(buffer);
        if (sha !== file.sha) {
            report.sha_mismatch.push({ id, path: rel, expected: file.sha, actual: sha });
        }
    }

    for (const name of files) {
        if (!expected.has(name)) report.orphan_files.push({ id, path: `extensions/${id}/${name}` });
    }
}

const stagingDir = path.join(ROOT, '_staging', 'covers');
if (fs.existsSync(stagingDir)) {
    const now = Date.now();
    for (const name of fs.readdirSync(stagingDir)) {
        const full = path.join(stagingDir, name);
        const stat = fs.statSync(full);
        if (stat.isFile() && now - stat.mtimeMs > STAGING_MAX_AGE_MS) {
            report.stale_staging_files.push(`_staging/covers/${name}`);
        }
    }
}

report.counts.missing_manifests = report.missing_manifests.length;
report.counts.invalid_manifests = report.invalid_manifests.length;
report.counts.missing_files = report.missing_files.length;
report.counts.orphan_files = report.orphan_files.length;
report.counts.size_mismatch = report.size_mismatch.length;
report.counts.sha_mismatch = report.sha_mismatch.length;
report.counts.stale_staging = report.stale_staging_files.length;

// 管理后台沿用这些字段名，避免前端再做一次映射
report.orphan_files_found = report.orphan_files.length;
report.missing_files_found = report.missing_files.length;
report.applied = false;
report.deleted_files = [];
report.backup_tag = BACKUP_TAG;

if (APPLY) {
    const removable = [
        ...report.orphan_files.map((item) => item.path),
        ...report.stale_staging_files,
    ].filter((rel) => (rel.startsWith('extensions/') || rel.startsWith('_staging/')));
    // manifest 永远不参与删除
    const safe = removable.filter((rel) => !rel.endsWith('/manifest.json'));

    for (const rel of safe) {
        const full = path.resolve(ROOT, rel);
        const relative = path.relative(ROOT, full);
        if (relative.startsWith('..') || path.isAbsolute(relative)) continue;
        try {
            fs.rmSync(full, { force: true });
            report.deleted_files.push(rel);
        } catch (error) {
            console.error(`[consistency] 删除失败 ${rel}: ${error.message}`);
        }
    }

    report.applied = true;
    console.log(`[consistency] 已删除 ${report.deleted_files.length} 个文件`);
    if (BACKUP_TAG) console.log(`[consistency] 备份标签 ${BACKUP_TAG}`);
}

fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');

console.log(`[consistency] 扩展目录 ${report.counts.extensions}，manifest ${report.counts.manifests}`);
console.log(`[consistency] 缺失 manifest ${report.counts.missing_manifests}，损坏 ${report.counts.invalid_manifests}`);
console.log(`[consistency] 缺失文件 ${report.counts.missing_files}，孤儿文件 ${report.counts.orphan_files}`);
console.log(`[consistency] size 不符 ${report.counts.size_mismatch}，sha 不符 ${report.counts.sha_mismatch}`);
console.log(`[consistency] 过期暂存 ${report.counts.stale_staging}`);
