/**
 * 存储 v2 —— 深度校验
 *
 * 纯 Node、零依赖，供 build-index.mjs 与数据仓库 CI 共用。
 * 校验分三层：
 *   1. manifest 结构与字段（唯一真源是否自洽）
 *   2. 目录与文件实体（脚本/封面是否存在、size 与 git blob sha 是否一致）
 *   3. 索引投影（是否完整覆盖 manifest、字段是否齐全、体积是否超限）
 *
 * 任何一层出现 error，调用方都必须放弃写入旧索引。
 */

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const ID_RE = /^[a-z0-9]{14}$/;
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const COVER_RE = /^cover\.(webp|png|jpg|gif)$/;
export const SCRIPT_RE = /^(.+)\.js$/;
export const SEMVER_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const STATUSES = ['pending', 'published', 'disuse'];
export const ALLOWED_CATEGORIES = ['实用', '网络', 'AI', '多媒体', '运算', '游戏', '硬件'];
export const CYSO_TAG = 'CYSO';
export const INDEX_SIZE_LIMIT = 900 * 1024;

const LIMITS = {
    name: 60,
    description: 200,
    slug: 40,
    originalAuthor: 60,
    docUrl: 500,
    authorName: 32,
    reason: 500,
};

export function isValidSemver(value) {
    return typeof value === 'string' && SEMVER_RE.test(value);
}

export function isIsoTimestamp(value) {
    return typeof value === 'string' && value.length > 0 && Number.isFinite(Date.parse(value));
}

/** Git blob sha：sha1("blob <size>\0" + content)。用于与 manifest.files[].sha 逐字节比对。 */
export function gitBlobSha1(buffer) {
    const header = Buffer.from(`blob ${buffer.length}\u0000`, 'utf8');
    return createHash('sha1').update(Buffer.concat([header, buffer])).digest('hex');
}

function pushError(errors, type, path, message) {
    errors.push({ type, path, message });
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * 读取 extensions/ 下全部 manifest。
 * 只做 JSON 解析与目录形态检查，字段级校验交给 validateStorage。
 */
export function readManifests(root) {
    const extDir = join(root, 'extensions');
    const manifests = [];
    const dirNames = [];
    const errors = [];

    if (!existsSync(extDir)) {
        return { exists: false, manifests, dirNames, errors };
    }

    for (const name of readdirSync(extDir)) {
        const dir = join(extDir, name);
        let stat;
        try {
            stat = statSync(dir);
        } catch (error) {
            pushError(errors, 'unreadable_entry', name, `无法读取目录信息: ${error.message}`);
            continue;
        }
        if (!stat.isDirectory()) {
            pushError(errors, 'illegal_entry', name, 'extensions/ 下出现非目录条目');
            continue;
        }
        dirNames.push(name);

        if (!ID_RE.test(name)) {
            pushError(errors, 'illegal_entry', name, '目录名不是 14 位 base36 id');
        }

        const manifestPath = join(dir, 'manifest.json');
        if (!existsSync(manifestPath)) {
            pushError(errors, 'no_manifest', name, '目录内缺少 manifest.json');
            continue;
        }

        try {
            manifests.push({ dirName: name, manifest: JSON.parse(readFileSync(manifestPath, 'utf8')) });
        } catch (error) {
            pushError(errors, 'bad_manifest', name, `JSON 解析失败: ${error.message}`);
        }
    }

    return { exists: true, manifests, dirNames, errors };
}

function validateManifest(entry, errors, warnings) {
    const { dirName, manifest: m } = entry;
    const where = dirName;

    if (!isPlainObject(m)) {
        pushError(errors, 'bad_manifest', where, 'manifest 必须是对象');
        return;
    }

    if (m.schema !== 1) {
        pushError(errors, 'schema', where, `schema 必须为 1，实际 ${JSON.stringify(m.schema)}`);
    }
    if (!ID_RE.test(String(m.id ?? ''))) {
        pushError(errors, 'bad_id', where, `id 格式不合法: ${JSON.stringify(m.id)}`);
    } else if (m.id !== dirName) {
        pushError(errors, 'id_mismatch', where, `manifest.id=${m.id} 与目录名不一致`);
    }

    if (typeof m.slug !== 'string' || !SLUG_RE.test(m.slug) || m.slug.length < 2 || m.slug.length > LIMITS.slug) {
        pushError(errors, 'bad_slug', where, `slug 不合规: ${JSON.stringify(m.slug)}`);
    }

    if (typeof m.name !== 'string' || !m.name.trim()) {
        pushError(errors, 'bad_name', where, 'name 不能为空');
    } else if (m.name.length > LIMITS.name) {
        pushError(errors, 'bad_name', where, `name 超过 ${LIMITS.name} 字符`);
    }

    if (typeof m.description !== 'string' || !m.description.trim()) {
        pushError(errors, 'bad_description', where, 'description 不能为空');
    } else if (m.description.length > LIMITS.description) {
        pushError(errors, 'bad_description', where, `description 超过 ${LIMITS.description} 字符`);
    }

    if (!STATUSES.includes(m.status)) {
        pushError(errors, 'bad_status', where, `status 取值不合法: ${JSON.stringify(m.status)}`);
    }
    if (typeof m.hidden !== 'boolean') {
        pushError(errors, 'bad_hidden', where, 'hidden 必须为布尔值');
    }

    if (!Array.isArray(m.category) || m.category.length === 0) {
        pushError(errors, 'bad_category', where, 'category 必须为非空数组');
    } else {
        for (const value of m.category) {
            if (typeof value !== 'string' || !value.trim()) {
                pushError(errors, 'bad_category', where, 'category 元素必须是非空字符串');
                break;
            }
            if (value !== CYSO_TAG && !ALLOWED_CATEGORIES.includes(value)) {
                warnings.push({ type: 'unknown_category', path: where, message: `未知分类: ${value}` });
            }
        }
    }

    if (typeof m.is_cyso !== 'boolean') {
        pushError(errors, 'bad_is_cyso', where, 'is_cyso 必须为布尔值');
    }
    if (typeof m.is_repost !== 'boolean') {
        pushError(errors, 'bad_is_repost', where, 'is_repost 必须为布尔值');
    }

    if (typeof m.original_author !== 'string') {
        pushError(errors, 'bad_original_author', where, 'original_author 必须为字符串');
    } else if (m.original_author.length > LIMITS.originalAuthor) {
        pushError(errors, 'bad_original_author', where, `original_author 超过 ${LIMITS.originalAuthor} 字符`);
    }

    if (typeof m.doc_url !== 'string') {
        pushError(errors, 'bad_doc_url', where, 'doc_url 必须为字符串');
    } else {
        if (m.doc_url.length > LIMITS.docUrl) {
            pushError(errors, 'bad_doc_url', where, `doc_url 超过 ${LIMITS.docUrl} 字符`);
        }
        if (m.doc_url && !/^https?:\/\//i.test(m.doc_url)) {
            pushError(errors, 'bad_doc_url', where, 'doc_url 必须以 http:// 或 https:// 开头');
        }
    }

    if (!Number.isInteger(m.author_id) || m.author_id < 0) {
        pushError(errors, 'bad_author_id', where, 'author_id 必须为非负整数');
    }
    if (typeof m.author_name_snapshot !== 'string') {
        pushError(errors, 'bad_author_name', where, 'author_name_snapshot 必须为字符串');
    } else if (m.author_name_snapshot.length > LIMITS.authorName) {
        pushError(errors, 'bad_author_name', where, `author_name_snapshot 超过 ${LIMITS.authorName} 字符`);
    }

    if (!isValidSemver(m.version)) {
        pushError(errors, 'bad_version', where, `version 不是合法 semver: ${JSON.stringify(m.version)}`);
    }

    const fileNames = new Set();
    if (!Array.isArray(m.files) || m.files.length === 0) {
        pushError(errors, 'bad_files', where, 'files 必须为非空数组');
    } else {
        for (const file of m.files) {
            if (!isPlainObject(file)) {
                pushError(errors, 'bad_files', where, 'files[] 元素必须是对象');
                continue;
            }
            const name = String(file.name ?? '');
            if (fileNames.has(name)) {
                pushError(errors, 'dup_file', where, `files[] 存在重复版本: ${name}`);
            }
            fileNames.add(name);

            const match = SCRIPT_RE.exec(name);
            if (!match || !isValidSemver(match[1])) {
                pushError(errors, 'bad_filename', `${where}/${name}`, '文件名必须是 <semver>.js');
            }
            if (!isValidSemver(file.version)) {
                pushError(errors, 'bad_file_version', `${where}/${name}`, `files[].version 不是合法 semver: ${JSON.stringify(file.version)}`);
            } else if (name !== `${file.version}.js`) {
                pushError(errors, 'filename_version_mismatch', `${where}/${name}`, `文件名与 version=${file.version} 不一致`);
            }
            if (!Number.isInteger(file.size) || file.size < 0) {
                pushError(errors, 'bad_file_size', `${where}/${name}`, 'files[].size 必须为非负整数');
            }
            if (typeof file.sha !== 'string' || !/^[0-9a-f]{40}$/.test(file.sha)) {
                pushError(errors, 'bad_file_sha', `${where}/${name}`, 'files[].sha 必须是 40 位十六进制');
            }
            if (!isIsoTimestamp(file.at)) {
                pushError(errors, 'bad_file_at', `${where}/${name}`, 'files[].at 必须是 ISO 时间');
            }
        }
    }

    if (typeof m.current !== 'string' || !fileNames.has(m.current)) {
        pushError(errors, 'bad_current', where, `current=${JSON.stringify(m.current)} 不在 files[] 内`);
    } else if (fileNames.size > 0) {
        const currentVersion = SCRIPT_RE.exec(m.current)?.[1];
        if (currentVersion !== m.version) {
            pushError(errors, 'current_version_mismatch', where, `current=${m.current} 但 version=${m.version}`);
        }
    }

    if (m.cover !== undefined) {
        if (typeof m.cover !== 'string' || !COVER_RE.test(m.cover)) {
            pushError(errors, 'bad_cover', where, `cover 命名不合规: ${JSON.stringify(m.cover)}`);
        }
    }

    if (!isIsoTimestamp(m.created_at)) {
        pushError(errors, 'bad_created_at', where, 'created_at 必须是 ISO 时间');
    }
    if (!isIsoTimestamp(m.updated_at)) {
        pushError(errors, 'bad_updated_at', where, 'updated_at 必须是 ISO 时间');
    }

    if (m.status === 'published' && !isIsoTimestamp(m.published_at)) {
        pushError(errors, 'bad_published_at', where, 'published 状态必须提供 published_at');
    }
    if (m.status === 'pending') {
        if (!isPlainObject(m.review) || !isIsoTimestamp(m.review.submitted_at)) {
            pushError(errors, 'bad_review', where, 'pending 状态必须提供 review.submitted_at');
        }
    }
    if (m.status === 'disuse') {
        if (!isPlainObject(m.disuse) || !isIsoTimestamp(m.disuse.at) || typeof m.disuse.reason !== 'string') {
            pushError(errors, 'bad_disuse', where, 'disuse 状态必须提供 disuse.at 与 disuse.reason');
        }
    }
}

/**
 * 校验目录与文件实体：
 * - 每个被引用的脚本存在、size 与 git blob sha 一致
 * - 封面存在
 * - 目录内只允许白名单文件
 * - slug 全局唯一
 */
export function validateStorage(root, entries, extraErrors = []) {
    const errors = [...extraErrors];
    const warnings = [];
    const stats = { manifests: 0, scripts: 0, covers: 0, bytes: 0 };

    const slugs = new Map();

    for (const entry of entries) {
        validateManifest(entry, errors, warnings);

        const { dirName, manifest: m } = entry;
        if (!isPlainObject(m)) continue;
        stats.manifests += 1;

        if (typeof m.slug === 'string' && m.slug) {
            const previous = slugs.get(m.slug);
            if (previous) {
                pushError(errors, 'dup_slug', dirName, `slug=${m.slug} 与 ${previous} 重复`);
            } else {
                slugs.set(m.slug, dirName);
            }
        }

        const dir = join(root, 'extensions', dirName);

        if (Array.isArray(m.files)) {
            for (const file of m.files) {
                if (!isPlainObject(file) || typeof file.name !== 'string') continue;
                const abs = join(dir, file.name);
                if (!existsSync(abs)) {
                    pushError(errors, 'missing_file', `${dirName}/${file.name}`, 'manifest 引用的文件不存在');
                    continue;
                }
                const buffer = readFileSync(abs);
                stats.scripts += 1;
                stats.bytes += buffer.length;
                if (Number.isInteger(file.size) && buffer.length !== file.size) {
                    pushError(errors, 'size_mismatch', `${dirName}/${file.name}`, `声明 ${file.size}，实际 ${buffer.length}`);
                }
                if (typeof file.sha === 'string') {
                    const actual = gitBlobSha1(buffer);
                    if (actual !== file.sha) {
                        pushError(errors, 'sha_mismatch', `${dirName}/${file.name}`, `声明 ${file.sha}，实际 ${actual}`);
                    }
                }
            }
        }

        if (typeof m.cover === 'string' && COVER_RE.test(m.cover)) {
            const abs = join(dir, m.cover);
            if (!existsSync(abs)) {
                pushError(errors, 'missing_cover', `${dirName}/${m.cover}`, 'manifest 引用的封面不存在');
            } else {
                stats.covers += 1;
            }
        }

        if (existsSync(dir)) {
            for (const name of readdirSync(dir)) {
                if (name === 'manifest.json') continue;
                const script = SCRIPT_RE.exec(name);
                if (script && isValidSemver(script[1])) continue;
                if (COVER_RE.test(name)) continue;
                pushError(errors, 'unknown_file', `${dirName}/${name}`, '目录内出现白名单之外的文件');
            }
        }
    }

    return { errors, warnings, stats };
}

function requireStringField(item, field, errors, path) {
    if (typeof item[field] !== 'string' || !item[field]) {
        pushError(errors, 'index_field', path, `缺少字符串字段 ${field}`);
    }
}

/**
 * 校验索引投影：必须完整覆盖 manifest、不重不漏、字段齐全。
 * 特别检查 public 投影必须保留 hidden 记录（否则作者无法管理已隐藏扩展）。
 */
export function validateIndexes(indexes, entries) {
    const errors = [];
    const warnings = [];
    const byId = new Map(entries.map((entry) => [entry.manifest?.id, entry.manifest]));

    const expected = {
        public: entries.filter((entry) => entry.manifest?.status === 'published'),
        review: entries.filter((entry) => entry.manifest?.status === 'pending'),
        disuse: entries.filter((entry) => entry.manifest?.status === 'disuse'),
    };

    for (const kind of ['public', 'review', 'disuse']) {
        const doc = indexes[kind];
        if (!isPlainObject(doc)) {
            pushError(errors, 'index_doc', `index/${kind}.json`, '索引不是对象');
            continue;
        }
        if (!isIsoTimestamp(doc.generated_at)) {
            pushError(errors, 'index_meta', `index/${kind}.json`, 'generated_at 不是 ISO 时间');
        }
        if (typeof doc.commit !== 'string') {
            pushError(errors, 'index_meta', `index/${kind}.json`, 'commit 必须是字符串');
        }
        if (!Array.isArray(doc.items)) {
            pushError(errors, 'index_doc', `index/${kind}.json`, 'items 必须是数组');
            continue;
        }
        if (!Number.isInteger(doc.count) || doc.count !== doc.items.length) {
            pushError(errors, 'index_count', `index/${kind}.json`, `count=${doc.count} 与 items=${doc.items.length} 不一致`);
        }

        const seen = new Set();
        for (const item of doc.items) {
            if (!isPlainObject(item)) {
                pushError(errors, 'index_item', `index/${kind}.json`, 'items[] 元素必须是对象');
                continue;
            }
            requireStringField(item, 'id', errors, `index/${kind}.json`);
            requireStringField(item, 'slug', errors, `index/${kind}.json`);
            requireStringField(item, 'name', errors, `index/${kind}.json`);
            requireStringField(item, 'description', errors, `index/${kind}.json`);
            requireStringField(item, 'version', errors, `index/${kind}.json`);
            requireStringField(item, 'author_name', errors, `index/${kind}.json`);
            requireStringField(item, 'updated_at', errors, `index/${kind}.json`);

            if (typeof item.cover !== 'string') {
                pushError(errors, 'index_item', `index/${kind}.json`, '缺少字符串字段 cover');
            }
            if (!Array.isArray(item.category)) {
                pushError(errors, 'index_item', `index/${kind}.json`, '缺少数组字段 category');
            }
            if (!Number.isInteger(item.author_id)) {
                pushError(errors, 'index_item', `index/${kind}.json`, 'author_id 必须为整数');
            }
            if (!isIsoTimestamp(item.updated_at)) {
                pushError(errors, 'index_item', `index/${kind}.json`, 'updated_at 不是 ISO 时间');
            }

            if (seen.has(item.id)) {
                pushError(errors, 'index_dup', `index/${kind}.json`, `重复记录 id=${item.id}`);
            }
            seen.add(item.id);

            const manifest = byId.get(item.id);
            if (!manifest) {
                pushError(errors, 'index_orphan', `index/${kind}.json`, `记录 ${item.id} 没有对应 manifest`);
                continue;
            }
            if (manifest.version !== item.version) {
                pushError(errors, 'index_version', `index/${kind}.json`, `${item.id} 版本 ${item.version} 与 manifest ${manifest.version} 不一致`);
            }
            if (manifest.slug !== item.slug) {
                pushError(errors, 'index_slug', `index/${kind}.json`, `${item.id} slug 与 manifest 不一致`);
            }

            if (kind === 'public' && typeof item.hidden !== 'boolean') {
                pushError(errors, 'index_hidden', `index/${kind}.json`, `${item.id} 缺少 hidden 布尔标记`);
            }
            if (kind === 'review') {
                if (!isPlainObject(item.review) || !isIsoTimestamp(item.review.submitted_at)) {
                    pushError(errors, 'index_review', `index/${kind}.json`, `${item.id} 缺少 review.submitted_at`);
                }
            }
            if (kind === 'disuse') {
                if (!isPlainObject(item.disuse) || !isIsoTimestamp(item.disuse.at) || typeof item.disuse.reason !== 'string') {
                    pushError(errors, 'index_disuse', `index/${kind}.json`, `${item.id} 缺少 disuse.at/reason`);
                }
            }
        }

        for (const entry of expected[kind]) {
            if (!seen.has(entry.manifest.id)) {
                pushError(errors, 'index_missing', `index/${kind}.json`, `遗漏 manifest ${entry.manifest.id}（status=${entry.manifest.status}）`);
            }
        }
        for (const id of seen) {
            const manifest = byId.get(id);
            if (manifest && manifest.status !== entryStatus(kind)) {
                pushError(errors, 'index_status', `index/${kind}.json`, `${id} 出现在 ${kind}，但 manifest.status=${manifest.status}`);
            }
        }

        const hiddenCount = kind === 'public'
            ? doc.items.filter((item) => isPlainObject(item) && item.hidden === true).length
            : 0;
        if (kind === 'public') {
            const expectedHidden = expected.public.filter((entry) => entry.manifest.hidden === true).length;
            if (hiddenCount !== expectedHidden) {
                pushError(errors, 'index_hidden', 'index/public.json', `hidden 记录 ${hiddenCount} 条，manifest 中为 ${expectedHidden} 条`);
            }
        }
    }

    // 每个 manifest 必须恰好出现在一份索引里
    const placed = new Map();
    for (const kind of ['public', 'review', 'disuse']) {
        for (const item of (indexes[kind]?.items ?? [])) {
            if (!isPlainObject(item) || typeof item.id !== 'string') continue;
            placed.set(item.id, (placed.get(item.id) || []).concat(kind));
        }
    }
    for (const entry of entries) {
        const id = entry.manifest?.id;
        if (!id) continue;
        const kinds = placed.get(id) || [];
        if (kinds.length === 0) {
            pushError(errors, 'index_unplaced', id, 'manifest 未出现在任何索引');
        } else if (kinds.length > 1) {
            pushError(errors, 'index_multi', id, `manifest 同时出现在 ${kinds.join('/')}`);
        }
    }

    return { errors, warnings };
}

function entryStatus(kind) {
    return kind === 'public' ? 'published' : kind === 'review' ? 'pending' : 'disuse';
}
