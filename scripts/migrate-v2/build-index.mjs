#!/usr/bin/env node
/**
 * 索引重建 + 深度校验（数据仓库 CI 与本地工具共用）
 *
 * 用法：
 *   node scripts/migrate-v2/build-index.mjs --root <仓库根> [--dry-run]
 *
 * 流程：
 *   1. 遍历 extensions/<id>/manifest.json
 *   2. 深度校验 manifest 与目录实体（存在性、size、git blob sha、白名单）
 *   3. 在内存中生成三份投影
 *   4. 深度校验投影（覆盖性、字段、hidden 保留、计数）
 *   5. 写入临时文件 → 重新读取复核 → 原子替换 index/*.json
 *
 * 任何一步校验失败都不会改动旧索引：宁可构建失败，也不发布半成品。
 * 只读 manifest，只写 index/ —— 不触碰任何扩展文件。
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildIndexes } from './lib/projection.mjs';
import {
    INDEX_SIZE_LIMIT,
    readManifests,
    validateIndexes,
    validateStorage,
} from './lib/validate.mjs';

const KINDS = ['public', 'review', 'disuse'];

function parseArgs(argv) {
    const out = { root: '.', dryRun: false, report: '' };
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === '--root') out.root = argv[++i];
        else if (argv[i] === '--dry-run') out.dryRun = true;
        else if (argv[i] === '--report') out.report = argv[++i];
    }
    return out;
}

function printErrors(title, errors) {
    console.error(`[index] ${title}（${errors.length} 项）：`);
    for (const error of errors.slice(0, 30)) {
        console.error(`  x [${error.type}] ${error.path}  ${error.message}`);
    }
    if (errors.length > 30) console.error(`  ... 其余 ${errors.length - 30} 项已省略`);
}

function printWarnings(warnings) {
    if (warnings.length === 0) return;
    console.warn(`[index] 警告 ${warnings.length} 项（不阻断）：`);
    for (const warning of warnings.slice(0, 10)) {
        console.warn(`  ! [${warning.type}] ${warning.path}  ${warning.message}`);
    }
}

function serialize(doc) {
    return JSON.stringify(doc) + '\n';
}

function readIndexIfExists(path) {
    if (!existsSync(path)) return null;
    try {
        return readFileSync(path, 'utf8');
    } catch {
        return null;
    }
}

/** 写入临时目录并重新读取复核，确保落盘内容与内存一致。 */
function writeAndVerifyTemp(tempDir, indexes) {
    mkdirSync(tempDir, { recursive: true });
    const written = new Map();

    for (const kind of KINDS) {
        const body = serialize(indexes[kind]);
        const file = join(tempDir, `${kind}.json`);
        writeFileSync(file, body, 'utf8');

        const size = statSync(file).size;
        if (size > INDEX_SIZE_LIMIT) {
            throw new Error(`index/${kind}.json 体积 ${(size / 1024).toFixed(1)}KB 超过 900KB 阈值`);
        }

        const reread = readFileSync(file, 'utf8');
        if (reread !== body) {
            throw new Error(`index/${kind}.json 落盘内容与内存不一致`);
        }
        const parsed = JSON.parse(reread);
        if (!Array.isArray(parsed.items) || parsed.count !== parsed.items.length) {
            throw new Error(`index/${kind}.json 回读校验失败：count 与 items 不一致`);
        }

        written.set(kind, { file, body, size });
    }

    return written;
}

/** 原子替换：校验全部通过后才覆盖旧索引。 */
function replaceIndexes(indexDir, written) {
    for (const kind of KINDS) {
        const target = join(indexDir, `${kind}.json`);
        const temp = written.get(kind).file;
        renameSync(temp, target);
    }
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    const root = resolve(args.root);
    const indexDir = join(root, 'index');

    const read = readManifests(root);
    if (!read.exists) {
        console.log('[index] extensions/ 不存在，无需生成（这是新仓库的初始状态）');
        return;
    }
    if (read.errors.length > 0) {
        printErrors('读取 extensions/ 失败', read.errors);
        process.exit(1);
    }

    const storage = validateStorage(root, read.manifests, []);
    if (storage.errors.length > 0) {
        printErrors('存储结构校验未通过，旧索引保持不变', storage.errors);
        printWarnings(storage.warnings);
        process.exit(1);
    }
    printWarnings(storage.warnings);

    const commit = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : '';
    const manifests = read.manifests.map((entry) => entry.manifest);
    const indexes = buildIndexes(manifests, commit);

    const indexCheck = validateIndexes(indexes, read.manifests);
    if (indexCheck.errors.length > 0) {
        printErrors('索引投影校验未通过，旧索引保持不变', indexCheck.errors);
        printWarnings(indexCheck.warnings);
        process.exit(1);
    }
    printWarnings(indexCheck.warnings);

    const summary = {
        manifests: storage.stats.manifests,
        scripts: storage.stats.scripts,
        covers: storage.stats.covers,
        public: indexes.public.count,
        review: indexes.review.count,
        disuse: indexes.disuse.count,
    };

    if (args.dryRun) {
        console.log('[index] dry-run: manifest=%d 脚本=%d 封面=%d public=%d review=%d disuse=%d',
            summary.manifests, summary.scripts, summary.covers,
            summary.public, summary.review, summary.disuse);
        console.log('[index] 深度校验通过，未写入任何文件');
        return;
    }

    const before = new Map(
        KINDS.map((kind) => [kind, readIndexIfExists(join(indexDir, `${kind}.json`))]),
    );

    // 清理上次被取消/超时所遗留的临时目录，避免它们被后续 git add 误提交。
    if (existsSync(indexDir)) {
        for (const name of readdirSync(indexDir)) {
            if (!name.startsWith('.build-')) continue;
            try {
                rmSync(join(indexDir, name), { recursive: true, force: true });
            } catch (error) {
                console.warn(`[index] 清理旧临时目录失败（忽略）: ${name}`, error.message);
            }
        }
    }

    const tempDir = join(indexDir, `.build-${process.pid}-${Date.now()}`);
    let written;
    try {
        written = writeAndVerifyTemp(tempDir, indexes);
        mkdirSync(indexDir, { recursive: true });
    } catch (error) {
        rmSync(tempDir, { recursive: true, force: true });
        console.error('[index] 暂存写入失败，旧索引保持不变:', error.message);
        process.exit(1);
    }

    try {
        replaceIndexes(indexDir, written);
    } catch (error) {
        rmSync(tempDir, { recursive: true, force: true });
        console.error('[index] 替换索引失败:', error.message);
        process.exit(1);
    }

    rmSync(tempDir, { recursive: true, force: true });

    const changed = [];
    for (const kind of KINDS) {
        const after = serialize(indexes[kind]);
        if (before.get(kind) !== after) changed.push(`index/${kind}.json`);
    }

    console.log('[index] manifest=%d 脚本=%d 封面=%d public=%d review=%d disuse=%d',
        summary.manifests, summary.scripts, summary.covers,
        summary.public, summary.review, summary.disuse);
    console.log('[index] 深度校验通过，索引已更新%s',
        changed.length > 0 ? `：${changed.join(', ')}` : '（内容无变化）');

    if (args.report) {
        const report = {
            ok: true,
            generated_at: new Date().toISOString(),
            commit,
            summary,
            index_sizes: Object.fromEntries(
                KINDS.map((kind) => [kind, statSync(join(indexDir, `${kind}.json`)).size]),
            ),
            warnings: storage.warnings.concat(indexCheck.warnings),
        };
        writeFileSync(resolve(args.report), JSON.stringify(report, null, 2) + '\n', 'utf8');
    }
}

main();
