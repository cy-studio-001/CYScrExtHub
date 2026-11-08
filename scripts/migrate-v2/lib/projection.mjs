/**
 * 存储 v2 —— 索引投影生成（§6）
 *
 * 三份投影全部由 manifest 汇总得到，运行时不写（不变量 I3）。
 * transform.mjs 与 build-index.mjs 共用本文件，保证两条路径产出一致。
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** 单文件体积上限：超过则构建失败，不允许静默产出（§6.4）。 */
export const INDEX_SIZE_LIMIT = 900 * 1024;

const PUBLIC_DESC_LIMIT = 120;

function pickPublic(m) {
    return {
        id: m.id,
        slug: m.slug,
        name: m.name,
        description: truncate(m.description, PUBLIC_DESC_LIMIT),
        version: m.version,
        category: m.category,
        is_cyso: m.is_cyso,
        author_id: m.author_id,
        author_name: m.author_name_snapshot,
        cover: m.cover || '',
        hidden: m.hidden === true,
        created_at: m.created_at,
        published_at: m.published_at || m.updated_at,
        updated_at: m.updated_at,
        doc_url: m.doc_url || undefined,
    };
}

function pickReview(m) {
    return {
        id: m.id,
        slug: m.slug,
        name: m.name,
        description: m.description,
        version: m.version,
        category: m.category,
        is_cyso: m.is_cyso,
        is_repost: m.is_repost,
        original_author: m.original_author || undefined,
        author_id: m.author_id,
        author_name: m.author_name_snapshot,
        cover: m.cover || '',
        created_at: m.created_at,
        updated_at: m.updated_at,
        doc_url: m.doc_url || undefined,
        review: m.review || null,
    };
}

function pickDisuse(m) {
    return {
        id: m.id,
        slug: m.slug,
        name: m.name,
        description: m.description,
        version: m.version,
        category: m.category,
        is_cyso: m.is_cyso,
        is_repost: m.is_repost,
        original_author: m.original_author || undefined,
        author_id: m.author_id,
        author_name: m.author_name_snapshot,
        cover: m.cover || '',
        created_at: m.created_at,
        updated_at: m.updated_at,
        doc_url: m.doc_url || undefined,
        disuse: m.disuse || null,
    };
}

function truncate(text, max) {
    const s = String(text || '');
    return s.length > max ? s.slice(0, max) : s;
}

function ts(v) {
    const t = Date.parse(v || '');
    return Number.isFinite(t) ? t : 0;
}

/**
 * @param {any[]} manifests 全部 manifest
 * @param {string} commit 迁移/构建对应的 commit sha，便于排查
 */
export function buildIndexes(manifests, commit = '') {
    const publicItems = manifests
        .filter((m) => m.status === 'published')
        .sort((a, b) => ts(b.published_at || b.updated_at) - ts(a.published_at || a.updated_at))
        .map(pickPublic);

    // 审核队列按提交时间正序：先来先审
    const reviewItems = manifests
        .filter((m) => m.status === 'pending')
        .sort((a, b) => ts(a.created_at) - ts(b.created_at))
        .map(pickReview);

    const disuseItems = manifests
        .filter((m) => m.status === 'disuse')
        .sort((a, b) => ts(b.disuse?.at || b.updated_at) - ts(a.disuse?.at || a.updated_at))
        .map(pickDisuse);

    const meta = { generated_at: new Date().toISOString(), commit };
    return {
        public: { ...meta, count: publicItems.length, items: publicItems },
        review: { ...meta, count: reviewItems.length, items: reviewItems },
        disuse: { ...meta, count: disuseItems.length, items: disuseItems },
    };
}

/**
 * 写出三份投影，并做体积校验。
 * @returns {{ written: string[], oversized: string[] }}
 */
export function writeIndexes(rootDir, manifests, commit = '') {
    const indexes = buildIndexes(manifests, commit);
    const dir = join(rootDir, 'index');
    mkdirSync(dir, { recursive: true });

    const written = [];
    const oversized = [];

    for (const [name, data] of Object.entries(indexes)) {
        // 索引是机器读取的投影，缩进会白白吃掉 1MB 上限的余量
        const body = JSON.stringify(data) + '\n';
        const file = join(dir, `${name}.json`);
        writeFileSync(file, body, 'utf8');
        written.push(file);
        if (Buffer.byteLength(body, 'utf8') > INDEX_SIZE_LIMIT) oversized.push(file);
    }

    return { written, oversized, indexes };
}
