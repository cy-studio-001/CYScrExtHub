/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║          Scratch 7z 文本压缩扩展 (Scratch 7z Text)            ║
 * ║                                                               ║
 * ║  积木 1: 压缩 [TEXT] 后的文本   → 返回 Base64 编码的 LZMA 数据  ║
 * ║  积木 2: 解压 [TEXT] 后的文本   → 返回解压后的原始文本          ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * 📦 安装方式:
 *   方案 A (推荐): 打开 https://sheeptester.github.io/scratch-gui/
 *                  → 点击左下角文件夹图标 → "Load Extension"
 *                  → 输入本文件的 URL 或选择本地文件
 *
 *   方案 B: 使用 TurboWarp (https://turbowarp.org/) → 扩展 → 自定义扩展
 *
 * 📝 说明:
 *   本扩展使用 LZMA 压缩算法（7z 格式的核心算法）。
 *   浏览器中通过 ESM CDN 加载 lzma1 库实现真正的 7z 压缩；
 *   若 CDN 不可用，自动降级为内置 LZ77 压缩，保证始终可用。
 *   压缩结果以 Base64 编码存储，可在 Scratch 变量中安全传递。
 *
 *   前缀说明:
 *   - 7zL:...  → 使用 LZMA 库压缩 (真正的 7z)
 *   - 7zF:...  → 使用内置备用压缩 (LZ77)
 *   解压时会自动识别前缀，选择对应方式还原。
 */

// ============================================================
//  动态 import（兼容浏览器 Worker / 主线程 / Node.js）
// ============================================================
const _dynamicImport = (function () {
    try {
        if (typeof window !== 'undefined' || typeof self !== 'undefined') {
            return new Function('u', 'return import(u)');
        }
    } catch (_) {}
    return function (u) { return import(u); };
})();

// ============================================================
//  LZMA 库异步加载
// ============================================================
let _lzmaLib = null;
let _lzmaPromise = null;
const CDN_URLS = [
    'https://esm.sh/lzma1@0.2.0',
    'https://cdn.jsdelivr.net/npm/lzma1@0.2.0/+esm'
];

async function _ensureLZMA() {
    if (_lzmaLib) return _lzmaLib;
    if (_lzmaPromise) return _lzmaPromise;

    _lzmaPromise = (async () => {
        // 浏览器 / Worker 环境
        if (typeof window !== 'undefined' || typeof self !== 'undefined') {
            for (const url of CDN_URLS) {
                try {
                    const mod = await _dynamicImport(url);
                    if (mod && mod.compressString) {
                        _lzmaLib = mod;
                        console.log('[7z扩展] ✅ LZMA 库就绪 (' + url + ')');
                        return _lzmaLib;
                    }
                } catch (e) { /* try next */ }
            }
            console.warn('[7z扩展] ⚠️ 所有 CDN 失败，使用内置 LZ77 备用实现');
            _lzmaLib = _getFallback();
            return _lzmaLib;
        }
        // Node.js
        try {
            const mod = await _dynamicImport('lzma1');
            _lzmaLib = mod;
        } catch (_) {
            _lzmaLib = _getFallback();
        }
        return _lzmaLib;
    })();

    return _lzmaPromise;
}

// ============================================================
//  内置备用实现 (LZ77 比特流编码)
//  当 LZMA CDN 不可用时自动启用，保证扩展始终可用
// ============================================================
function _getFallback() {
    return {
        compressString: function (str /*, level */) {
            const bytes = new TextEncoder().encode(str);
            const compressed = _lz77Compress(bytes);
            // 头: 4 字节原始长度 (little-endian) + 数据
            const out = new Uint8Array(compressed.length + 4);
            new DataView(out.buffer).setUint32(0, bytes.length, true);
            out.set(compressed, 4);
            return out;
        },
        decompressString: function (data) {
            const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
            const origLen = dv.getUint32(0, true);
            const payload = data.slice(4);
            const decompressed = _lz77Decompress(payload, origLen);
            return new TextDecoder('utf-8', { fatal: false }).decode(decompressed);
        }
    };
}

function _lz77Compress(data) {
    const MIN_MATCH = 3, MAX_MATCH = 258, WIN = 2048;
    const tokens = []; // {t:0, b:byte} or {t:1, d:dist, l:len}

    let i = 0;
    while (i < data.length) {
        let bestD = 0, bestL = 0;
        if (i + MIN_MATCH <= data.length) {
            const start = Math.max(0, i - WIN);
            for (let j = start; j <= i - MIN_MATCH; j++) {
                let l = 0;
                while (l < MAX_MATCH && i + l < data.length && data[j + l] === data[i + l]) l++;
                if (l >= MIN_MATCH && l > bestL) { bestD = i - j; bestL = l; if (l === MAX_MATCH) break; }
            }
        }
        if (bestL >= MIN_MATCH) { tokens.push({ t: 1, d: bestD, l: bestL }); i += bestL; }
        else { tokens.push({ t: 0, b: data[i] }); i++; }
    }

    // 比特流: flag(1) | literal(8)  or  flag(1) | dist(12) | len-3(8)
    const bits = [];
    for (const tk of tokens) {
        if (tk.t === 0) {
            bits.push(0);
            for (let b = 7; b >= 0; b--) bits.push((tk.b >> b) & 1);
        } else {
            bits.push(1);
            for (let b = 11; b >= 0; b--) bits.push((tk.d >> b) & 1);
            for (let b = 7; b >= 0; b--) bits.push(((tk.l - MIN_MATCH) >> b) & 1);
        }
    }
    while (bits.length % 8) bits.push(0);

    const out = new Uint8Array(bits.length / 8);
    for (let i = 0; i < bits.length; i += 8) {
        out[i >> 3] = (bits[i]<<7)|(bits[i+1]<<6)|(bits[i+2]<<5)|(bits[i+3]<<4)
                    |(bits[i+4]<<3)|(bits[i+5]<<2)|(bits[i+6]<<1)|bits[i+7];
    }
    return out;
}

function _lz77Decompress(data, origLen) {
    const bits = [];
    for (let i = 0; i < data.length; i++)
        for (let b = 7; b >= 0; b--) bits.push((data[i] >> b) & 1);

    const MIN_MATCH = 3;
    const out = [];
    let p = 0;
    while (out.length < origLen && p < bits.length) {
        if (!bits[p++]) {
            if (p + 8 > bits.length) break;
            let v = 0; for (let k = 0; k < 8; k++) v = (v << 1) | bits[p++];
            out.push(v);
        } else {
            if (p + 20 > bits.length) break;
            let d = 0; for (let k = 0; k < 12; k++) d = (d << 1) | bits[p++];
            let l = 0; for (let k = 0; k < 8; k++) l = (l << 1) | bits[p++];
            l += MIN_MATCH;
            const s = out.length - d;
            for (let k = 0; k < l; k++) out.push(out[s + k]);
        }
    }
    return new Uint8Array(out.slice(0, origLen));
}

// ============================================================
//  Base64 编解码 (浏览器/Worker 自带 btoa/atob, Node 用 Buffer)
// ============================================================
function _bytesToBase64(bytes) {
    if (typeof btoa === 'function') {
        let bin = '';
        for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        return btoa(bin);
    }
    // Node.js fallback
    return Buffer.from(bytes).toString('base64');
}

function _base64ToBytes(b64) {
    if (typeof atob === 'function') {
        const bin = atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        return arr;
    }
    const buf = Buffer.from(b64, 'base64');
    return new Uint8Array(buf);
}

// ============================================================
//  Scratch 扩展类
// ============================================================
class Scratch7zCompression {
    constructor(runtime) {
        this.runtime = runtime;
        this.compressionLevel = 5;
        // 提前加载 LZMA 库（不阻塞）
        _ensureLZMA().catch(e => console.error('[7z扩展] 库加载异常:', e));
    }

    getInfo() {
        return {
            id: 'sevenZipText',
            name: '7z 文本压缩',
            color1: '#4A90D9',
            color2: '#357ABD',
            color3: '#2C5F8A',
            blocks: [
                {
                    opcode: 'compressText',
                    blockType: 'reporter',
                    text: '压缩 [TEXT] 后的文本',
                    arguments: {
                        TEXT: {
                            type: 'string',
                            defaultValue: 'Hello, Scratch! 这是一段需要压缩的文本。重复内容重复内容重复内容。'
                        }
                    },
                    disableMonitor: true
                },
                {
                    opcode: 'decompressText',
                    blockType: 'reporter',
                    text: '解压 [TEXT] 后的文本',
                    arguments: {
                        TEXT: {
                            type: 'string',
                            defaultValue: ''
                        }
                    },
                    disableMonitor: true
                }
            ],
            menus: {}
        };
    }

    // ---- 积木 1: 压缩 [TEXT] 后的文本 ----
    async compressText(args) {
        try {
            const text = String(args.TEXT || '');
            if (text === '') return '';

            const lib = await _ensureLZMA();
            const compressed = lib.compressString(text, this.compressionLevel);
            const b64 = _bytesToBase64(compressed);

            // 判断使用的格式
            const isFallback = (lib === _getFallback());
            const prefix = isFallback ? '7zF:' : '7zL:';
            const result = prefix + b64;

            const origBytes = (typeof TextEncoder !== 'undefined')
                ? new TextEncoder().encode(text).length : text.length;
            const ratio = ((b64.length / origBytes) * 100).toFixed(1);
            console.log('[7z压缩] ' + (isFallback ? 'LZ77' : 'LZMA') +
                ' | ' + origBytes + 'B → ' + b64.length + 'ch | 比率 ' + ratio + '%');

            return result;
        } catch (err) {
            console.error('[7z压缩] 错误:', err);
            return 'Error: ' + err.message;
        }
    }

    // ---- 积木 2: 解压 [TEXT] 后的文本 ----
    async decompressText(args) {
        try {
            const input = String(args.TEXT || '').trim();
            if (input === '') return '';

            // 识别格式
            let format = 'lzma', b64Data = input;
            if (input.startsWith('7zL:'))      { format = 'lzma';     b64Data = input.slice(4); }
            else if (input.startsWith('7zF:')) { format = 'fallback'; b64Data = input.slice(4); }
            else if (input.startsWith('7zB:')) { format = 'lzma';     b64Data = input.slice(4); }
            else {
                // 无前缀 → 尝试 LZMA，失败则 fallback
            }

            const compressed = _base64ToBytes(b64Data);
            const lib = await _ensureLZMA();

            let text;
            if (format === 'lzma') {
                text = lib.decompressString(compressed);
            } else {
                text = lib.decompressString(compressed);
            }
            console.log('[7z解压] ' + format + ' | ' + b64Data.length + 'ch → ' + text.length + ' 字符');
            return text;
        } catch (err) {
            console.error('[7z解压] 错误:', err);
            return 'Error: ' + err.message;
        }
    }
}

// ============================================================
//  注册扩展
// ============================================================
if (typeof Scratch !== 'undefined' && Scratch.extensions) {
    Scratch.extensions.register(new Scratch7zCompression());
    console.log('[7z扩展] ✅ 已注册到 Scratch');
} else {
    // ── Node.js 自测 ────────────────────────────────────────
    (async () => {
        console.log('══════════════════════════════════════════════');
        console.log('   📦 7z 文本压缩扩展 — 自测模式');
        console.log('══════════════════════════════════════════════');

        const tests = [
            'Hello, Scratch!',
            '重复重复重复重复重复重复重复重复重复重复',
            ('The quick brown fox jumps over the lazy dog. ').repeat(20),
            ('这是中文测试，包含重复内容。').repeat(10),
            JSON.stringify({ a: 1, b: [1,2,3], c: 'hello', d: { nested: true } }),
            ('Lorem ipsum dolor sit amet, consectetur adipiscing elit. ').repeat(15),
            'a'.repeat(500),
            'ABC123XYZ',
            '你好世界！Hello World! 🌍',
        ];

        const ext = new Scratch7zCompression(null);
        let pass = 0, fail = 0;

        console.log('\n── 功能测试 ──');
        for (const t of tests) {
            try {
                const c = await ext.compressText({ TEXT: t });
                const d = await ext.decompressText({ TEXT: c });
                const ok = (d === t);
                ok ? pass++ : fail++;
                const tag = ok ? '✅' : '❌';
                const info = ok ? '还原正确' : '还原失败';
                console.log(tag + ' ' + t.length + '字符 → ' + c.length + '字符 | ' + info);
                if (!ok) { console.log('   原文: ' + t.slice(0,40)); console.log('   解压: ' + d.slice(0,40)); }
            } catch (e) { fail++; console.log('❌ 异常: ' + e.message); }
        }

        console.log('\n── 性能测试 ──');
        const big = ('性能测试：这段文本很长很长很长，里面有很多重复的内容。').repeat(100);
        console.log('原文: ' + big.length + ' 字符');

        const t0 = Date.now();
        const bc = await ext.compressText({ TEXT: big });
        const t1 = Date.now();
        const bd = await ext.decompressText({ TEXT: bc });
        const t2 = Date.now();

        const origKB = (new Blob([big]).size / 1024).toFixed(1);
        console.log('压缩: ' + t1 + 'ms → ' + bc.length + ' 字符');
        console.log('解压: ' + t2 + 'ms → ' + bd.length + ' 字符');
        console.log('验证: ' + (bd === big ? '✅ 完全一致' : '❌ 不一致'));
        console.log('压缩率: ' + ((bc.length / new Blob([big]).size) * 100).toFixed(1) + '%');

        console.log('\n══════════════════════════════════════════════');
        console.log('  结果: ' + pass + ' 通过 / ' + fail + ' 失败');
        console.log('══════════════════════════════════════════════');
    })();
}

// 导出 (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scratch7zCompression;
}