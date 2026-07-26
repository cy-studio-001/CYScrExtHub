/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║          Scratch tar.xz 文本压缩扩展                         ║
 * ║          (Scratch tar.xz Text Compression)                    ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║                                                              ║
 * ║  积木 1: 压缩 [TEXT] 后的文本                                 ║
 * ║     → 返回 Base64 编码的 .tar.xz 压缩数据                     ║
 * ║                                                              ║
 * ║  积木 2: 解压 [TEXT] 后的文本                                 ║
 * ║     → 返回解压还原的原始文本                                   ║
 * ║                                                              ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │ 安装方式                                                      │
 * ├──────────────────────────────────────────────────────────────┤
 * │  A) TurboWarp (推荐)                                         │
 * │     https://turbowarp.org/ → ⚙️ → 扩展 → 自定义扩展           │
 * │     → 粘贴本文件全部内容 → 加载                               │
 * │                                                              │
 * │  B) SheepTester Scratch                                      │
 * │     https://sheeptester.github.io/scratch-gui/               │
 * │     → 左下角 📁 → Load Extension → 选择本文件                 │
 * └──────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │ 工作原理                                                      │
 * ├──────────────────────────────────────────────────────────────┤
 * │  压缩: 文本 → UTF-8 字节 → TAR 打包 → LZMA 压缩 → Base64    │
 * │  解压: Base64 → LZMA 解压 → TAR 解包 → UTF-8 文本           │
 * │                                                              │
 * │  浏览器中通过 ESM CDN 加载 lzma1 库实现真正的 LZMA 压缩。     │
 * │  CDN 不可用时自动降级为内置 LZ77 压缩，保证始终可用。         │
 * └──────────────────────────────────────────────────────────────┘
 */

// ══════════════════════════════════════════════════════════════
//  动态 import (浏览器/Worker/Node.js 通用)
// ══════════════════════════════════════════════════════════════
const __dynImport = (function () {
    try {
        if (typeof window !== 'undefined' || typeof self !== 'undefined') {
            return new Function('u', 'return import(u)');
        }
    } catch (_) {}
    return function (u) { return import(u); };
})();

// ══════════════════════════════════════════════════════════════
//  LZMA 库异步加载
// ══════════════════════════════════════════════════════════════
let _lzma = null;
let _lzmaP = null;
const _CDNS = [
    'https://esm.sh/lzma1@0.3.0',
    'https://cdn.jsdelivr.net/npm/lzma1@0.3.0/+esm'
];

async function _ensureLZMA() {
    if (_lzma) return _lzma;
    if (_lzmaP) return _lzmaP;
    _lzmaP = (async () => {
        if (typeof window !== 'undefined' || typeof self !== 'undefined') {
            for (const u of _CDNS) {
                try {
                    const m = await __dynImport(u);
                    if (m && m.compress) { _lzma = m; console.log('[tar.xz] ✅ LZMA 就绪 (' + u + ')'); return _lzma; }
                } catch (e) {}
            }
            console.warn('[tar.xz] ⚠️ CDN 不可用，使用内置 LZ77');
            _lzma = _fallback(); return _lzma;
        }
        try { _lzma = await __dynImport('lzma1'); }
        catch (_) { _lzma = _fallback(); }
        return _lzma;
    })();
    return _lzmaP;
}

// ══════════════════════════════════════════════════════════════
//  内置备用 LZ77 压缩/解压 (保证离线可用)
// ══════════════════════════════════════════════════════════════
function _fallback() {
    return {
        compress: function (bytes) {
            const bits = _lz77Enc(bytes);
            const header = new Uint8Array(4);
            header[0]=bytes.length&0xFF; header[1]=(bytes.length>>8)&0xFF;
            header[2]=(bytes.length>>16)&0xFF; header[3]=(bytes.length>>24)&0xFF;
            const out = new Uint8Array(4 + Math.ceil(bits.length/8));
            out.set(header, 0);
            for (let i = 0; i < bits.length; i += 8) {
                let v = 0;
                for (let b = 0; b < 8 && i+b < bits.length; b++) v = (v<<1)|bits[i+b];
                out[4+(i/8)|0] = v;
            }
            return out;
        },
        decompress: function (data) {
            const len = data[0]|(data[1]<<8)|(data[2]<<16)|(data[3]<<24);
            const bits = [];
            for (let i = 4; i < data.length; i++)
                for (let b = 7; b >= 0; b--) bits.push((data[i]>>b)&1);
            return _lz77Dec(bits, len);
        }
    };
}

function _lz77Enc(data) {
    const MIN = 3, MAX = 258, WIN = 2048, bits = [];
    let i = 0;
    while (i < data.length) {
        let bd = 0, bl = 0;
        if (i + MIN <= data.length) {
            const s = Math.max(0, i - WIN);
            for (let j = s; j <= i - MIN; j++) {
                let l = 0;
                while (l < MAX && i+l < data.length && data[j+l] === data[i+l]) l++;
                if (l >= MIN && l > bl) { bd = i-j; bl = l; if (l===MAX) break; }
            }
        }
        if (bl >= MIN) {
            bits.push(1);
            for (let b = 11; b >= 0; b--) bits.push((bd>>b)&1);
            for (let b = 7; b >= 0; b--) bits.push(((bl-MIN)>>b)&1);
            i += bl;
        } else {
            bits.push(0);
            for (let b = 7; b >= 0; b--) bits.push((data[i]>>b)&1);
            i++;
        }
    }
    return bits;
}

function _lz77Dec(bits, len) {
    const out = []; let p = 0;
    while (out.length < len && p < bits.length) {
        if (!bits[p++]) {
            if (p+8 > bits.length) break;
            let v=0; for(let k=0;k<8;k++) v=(v<<1)|bits[p++];
            out.push(v);
        } else {
            if (p+20 > bits.length) break;
            let d=0; for(let k=0;k<12;k++) d=(d<<1)|bits[p++];
            let l=0; for(let k=0;k<8;k++) l=(l<<1)|bits[p++]; l+=3;
            const s = out.length-d;
            for (let k=0;k<l;k++) out.push(out[s+k]);
        }
    }
    return new Uint8Array(out.slice(0, len));
}

// ══════════════════════════════════════════════════════════════
//  Base64 编解码 (Uint8Array ↔ Base64 字符串)
// ══════════════════════════════════════════════════════════════
function _b64Enc(bytes) {
    if (typeof btoa === 'function') {
        const CHUNK = 0x8000;
        let s = '';
        for (let i = 0; i < bytes.length; i += CHUNK) {
            let chunk = '';
            const end = Math.min(i + CHUNK, bytes.length);
            for (let j = i; j < end; j++) chunk += String.fromCharCode(bytes[j]);
            s += btoa(chunk);
        }
        return s;
    }
    return Buffer.from(bytes).toString('base64');
}

function _b64Dec(b64) {
    if (typeof atob === 'function') {
        const CHUNK = 0x8000;
        const out = [];
        for (let i = 0; i < b64.length; i += CHUNK) {
            const chunk = atob(b64.substring(i, Math.min(i+CHUNK, b64.length)));
            for (let j = 0; j < chunk.length; j++) out.push(chunk.charCodeAt(j));
        }
        return new Uint8Array(out);
    }
    return new Uint8Array(Buffer.from(b64, 'base64'));
}

// ══════════════════════════════════════════════════════════════
//  TAR 格式封装 / 解析  (POSIX ustar)
// ══════════════════════════════════════════════════════════════
const TAR_BLK = 512;

function _tarPack(text) {
    const content = new TextEncoder().encode(text);
    const size = content.length;
    const padSize = Math.ceil(size / TAR_BLK) * TAR_BLK;
    const total = TAR_BLK + padSize + TAR_BLK * 2;
    const out = new Uint8Array(total);

    // TAR Header (512 bytes)
    const hdr = out.subarray(0, TAR_BLK);

    // name (offset 0, 100 bytes)
    const name = 'data.txt';
    for (let i = 0; i < name.length; i++) hdr[i] = name.charCodeAt(i);

    // mode (offset 100, 8 bytes) "0000644\0"
    const mode = '0000644\0';
    for (let i = 0; i < mode.length; i++) hdr[100+i] = mode.charCodeAt(i);

    // size (offset 124, 12 bytes) octal + null
    const szOct = size.toString(8).padStart(11, '0');
    for (let i = 0; i < 11; i++) hdr[124+i] = szOct.charCodeAt(i);
    hdr[135] = 0;

    // typeflag (offset 156) '0' = regular file
    hdr[156] = 0x30;

    // ustar magic (offset 257) "ustar\0"
    hdr[257]=0x75; hdr[258]=0x73; hdr[259]=0x74; hdr[260]=0x61; hdr[261]=0x72; hdr[262]=0x00;
    // ustar version "00"
    hdr[263]=0x30; hdr[264]=0x30;

    // Checksum (offset 148)
    let ck = 0;
    for (let i = 0; i < TAR_BLK; i++) ck += (i>=148 && i<156) ? 0x20 : hdr[i];
    const ckOct = ck.toString(8).padStart(6, '0');
    for (let i = 0; i < 6; i++) hdr[148+i] = ckOct.charCodeAt(i);
    hdr[154] = 0;
    hdr[155] = 0x20;

    // Content
    out.set(content, TAR_BLK);
    // Trailer = zeros (already initialized)

    return out;
}

function _tarUnpack(tarData) {
    if (tarData.length < TAR_BLK) return '';
    let szStr = '';
    for (let i = 124; i < 135; i++) {
        const c = tarData[i];
        if (c >= 0x30 && c <= 0x37) szStr += String.fromCharCode(c);
        else break;
    }
    const size = parseInt(szStr, 8) || 0;
    if (size <= 0 || size > tarData.length) return '';
    return new TextDecoder('utf-8', {fatal:false}).decode(tarData.subarray(TAR_BLK, TAR_BLK + size));
}

// ══════════════════════════════════════════════════════════════
//  .xz 容器格式
//  Byte 0-1:   Magic "xz" (0x78 0x7A)
//  Byte 2:     Alg flag (0x4C=LZMA, 0x46=Fallback)
//  Byte 3:     Version (0x01)
//  Byte 4-7:   Original size (Uint32 LE)
//  Byte 8+:    Compressed payload
// ══════════════════════════════════════════════════════════════
function _xzPack(tarBytes) {
    const lib = _lzma;
    let payload, isReal = false;

    if (lib && lib.compress) {
        // 真正的 LZMA 压缩 (输入 Uint8Array → 输出 Uint8Array)
        payload = lib.compress(tarBytes, 6);
        isReal = true;
    } else if (lib && lib.compressString) {
        // 字符串接口
        let s = '';
        for (let i = 0; i < tarBytes.length; i++) s += String.fromCharCode(tarBytes[i]);
        payload = lib.compressString(s, 6);
        isReal = true;
    } else {
        payload = _lz77Enc(tarBytes);
    }

    let out;
    if (isReal && payload instanceof Uint8Array) {
        out = new Uint8Array(8 + payload.length);
        out[0]=0x78; out[1]=0x7A; out[2]=0x4C; out[3]=0x01;
        out[4]=tarBytes.length&0xFF; out[5]=(tarBytes.length>>8)&0xFF;
        out[6]=(tarBytes.length>>16)&0xFF; out[7]=(tarBytes.length>>24)&0xFF;
        out.set(payload, 8);
        return { data: out, real: true };
    } else {
        // Fallback bit-array path
        const bits = payload;
        const bc = Math.ceil(bits.length/8);
        out = new Uint8Array(8 + bc);
        out[0]=0x78; out[1]=0x7A; out[2]=0x46; out[3]=0x01;
        out[4]=tarBytes.length&0xFF; out[5]=(tarBytes.length>>8)&0xFF;
        out[6]=(tarBytes.length>>16)&0xFF; out[7]=(tarBytes.length>>24)&0xFF;
        for (let i=0;i<bits.length;i+=8){
            let v=0; for(let b=0;b<8&&i+b<bits.length;b++) v=(v<<1)|bits[i+b];
            out[8+(i/8)|0]=v;
        }
        return { data: out, real: false };
    }
}

function _xzUnpack(xzData) {
    if (xzData.length < 8) throw new Error('数据太短');
    if (xzData[0] !== 0x78 || xzData[1] !== 0x7A) throw new Error('无效 xz 文件头');

    const isFb = (xzData[2] === 0x46);
    const origSize = xzData[4]|(xzData[5]<<8)|(xzData[6]<<16)|(xzData[7]<<24);
    const payload = xzData.subarray(8);

    if (isFb) {
        const bits = [];
        for (let i = 0; i < payload.length; i++)
            for (let b = 7; b >= 0; b--) bits.push((payload[i]>>b)&1);
        return _lz77Dec(bits, origSize);
    } else {
        const lib = _lzma;
        if (lib && lib.decompress) {
            // 解压返回 Uint8Array
            return lib.decompress(payload);
        }
        if (lib && lib.decompressString) {
            let s = '';
            for (let i = 0; i < payload.length; i++) s += String.fromCharCode(payload[i]);
            const r = lib.decompressString(s);
            if (typeof r === 'string') return new TextEncoder().encode(r);
            return r;
        }
        // 终极降级
        const bits = [];
        for (let i = 0; i < payload.length; i++)
            for (let b = 7; b >= 0; b--) bits.push((payload[i]>>b)&1);
        return _lz77Dec(bits, origSize);
    }
}

// ══════════════════════════════════════════════════════════════
//  Scratch 扩展类
// ══════════════════════════════════════════════════════════════
class ScratchTarXz {
    constructor(runtime) {
        this.runtime = runtime;
        this.level = 6;
        _ensureLZMA().catch(e => console.error('[tar.xz] 库加载异常:', e));
    }

    getInfo() {
        return {
            id: 'tarXzText',
            name: 'tar.xz 文本压缩',
            color1: '#8B5CF6',
            color2: '#7C3AED',
            color3: '#5B21B6',
            blocks: [
                {
                    opcode: 'compressText',
                    blockType: 'reporter',
                    text: '压缩 [TEXT] 后的文本',
                    arguments: {
                        TEXT: {
                            type: 'string',
                            defaultValue: 'Hello, Scratch! 这段文本将被打包为 TAR 再用 LZMA 压缩为 xz 格式。'
                        }
                    },
                    disableMonitor: true
                },
                {
                    opcode: 'decompressText',
                    blockType: 'reporter',
                    text: '解压 [TEXT] 后的文本',
                    arguments: {
                        TEXT: { type: 'string', defaultValue: '' }
                    },
                    disableMonitor: true
                }
            ],
            menus: {}
        };
    }

    // ── 积木 1: 压缩 ──
    async compressText(args) {
        try {
            const text = String(args.TEXT || '');
            if (text === '') return '';

            const lib = await _ensureLZMA();
            const isFb = (lib === _fallback());

            // 1. TAR 打包
            const tarData = _tarPack(text);

            // 2. LZMA/xz 压缩
            const packed = _xzPack(tarData);

            // 3. Base64 编码
            const b64 = _b64Enc(packed.data);

            // 4. 加前缀
            const prefix = packed.real ? 'xzL:' : 'xzF:';
            const result = prefix + b64;

            const origB = new TextEncoder().encode(text).length;
            console.log('[tar.xz压缩] ' + text.length + '字符/' + origB + 'B → TAR ' + tarData.length + 'B → xz ' + packed.data.length + 'B → ' + b64.length + 'ch (' + (isFb?'LZ77':'LZMA') + ')');

            return result;
        } catch (err) {
            console.error('[tar.xz压缩]', err);
            return 'Error: ' + err.message;
        }
    }

    // ── 积木 2: 解压 ──
    async decompressText(args) {
        try {
            const input = String(args.TEXT || '').trim();
            if (input === '') return '';

            // 去掉前缀
            let b64 = input;
            if (input.startsWith('xzL:') || input.startsWith('xzF:') || input.startsWith('xzB:')) {
                b64 = input.substring(4);
            }

            // Base64 → Uint8Array
            const xzData = _b64Dec(b64);

            // xz 解压 → TAR 数据
            const tarData = _xzUnpack(xzData);

            // TAR 解包 → 文本
            const text = _tarUnpack(tarData);

            console.log('[tar.xz解压] ' + b64.length + 'ch → TAR ' + tarData.length + 'B → ' + text.length + '字符');
            return text;
        } catch (err) {
            console.error('[tar.xz解压]', err);
            return 'Error: ' + err.message;
        }
    }
}

// ══════════════════════════════════════════════════════════════
//  注册扩展
// ══════════════════════════════════════════════════════════════
if (typeof Scratch !== 'undefined' && Scratch.extensions) {
    Scratch.extensions.register(new ScratchTarXz());
    console.log('[tar.xz] ✅ 已注册到 Scratch');
} else {
    // ── Node.js 自测 ────────────────────────────────────────
    (async () => {
        console.log('════════════════════════════════════════════════════');
        console.log('   📦 tar.xz 文本压缩扩展 — 自测模式');
        console.log('════════════════════════════════════════════════════');

        // TAR 验证
        console.log('\n── TAR 格式验证 ──');
        const tarTest = _tarPack('Hello TAR!');
        const tarExt = _tarUnpack(tarTest);
        console.log('TAR 封装: ' + tarTest.length + 'B | 解析: "' + tarExt + '" | ' + (tarExt==='Hello TAR!'?'✅':'❌'));

        // xz 验证
        console.log('\n── xz 压缩验证 ──');
        const xzPack = _xzPack(tarTest);
        console.log('TAR ' + tarTest.length + 'B → xz ' + xzPack.data.length + 'B (' + (xzPack.real?'LZMA':'LZ77') + ')');
        const xzUnpack = _xzUnpack(xzPack.data);
        const xzText = _tarUnpack(xzUnpack);
        console.log('解压还原: "' + xzText + '" | ' + (xzText==='Hello TAR!'?'✅':'❌'));

        const tests = [
            'Hello, Scratch!',
            '重复重复重复重复重复',
            ('The quick brown fox jumps over the lazy dog. ').repeat(10),
            ('中文测试：tar.xz 压缩效果验证，包含更多内容。').repeat(8),
            'a'.repeat(300),
            JSON.stringify({format:'tar.xz', tool:'Scratch', nested:{a:[1,2,3]}}),
            ('性能对比测试文本，包含各种字符！@#$%^&*()_+').repeat(5),
            '短',
        ];

        const ext = new ScratchTarXz(null);
        let pass = 0, fail = 0;

        console.log('\n── 端到端测试 ──');
        for (const t of tests) {
            try {
                const c = await ext.compressText({TEXT: t});
                const d = await ext.decompressText({TEXT: c});
                const ok = (d === t);
                ok ? pass++ : fail++;
                const tag = ok ? '✅' : '❌';
                const origB = new TextEncoder().encode(t).length;
                const ratio = ((c.length / origB) * 100).toFixed(0);
                console.log(tag + ' ' + t.length + '字符/' + origB + 'B → ' + c.length + 'ch (' + ratio + '%)');
                if (!ok) { console.log('   原文: ' + t.slice(0,40)); console.log('   解压: ' + d.slice(0,40)); }
            } catch (e) {
                fail++; console.log('❌ 异常: ' + e.message);
            }
        }

        console.log('\n── 性能测试 (长文本) ──');
        const big = ('tar.xz 长文本性能测试，包含大量重复内容用于压缩。').repeat(100);
        console.log('原文: ' + big.length + '字符');

        const t0 = Date.now();
        const bc = await ext.compressText({TEXT: big});
        const t1 = Date.now();
        const bd = await ext.decompressText({TEXT: bc});
        const t2 = Date.now();

        const origSize = new TextEncoder().encode(big).length;
        console.log('压缩: ' + (t1-t0) + 'ms | ' + bc.length + 'ch');
        console.log('解压: ' + (t2-t1) + 'ms | ' + bd.length + '字符');
        console.log('验证: ' + (bd===big?'✅ 完全一致':'❌ 不一致'));
        console.log('压缩率: ' + ((bc.length/origSize)*100).toFixed(1) + '%');

        // 与 7z 对比
        console.log('\n── vs 7z 扩展对比 ──');
        const cmp = ('同一段文本，7z vs tar.xz，哪个压缩更好？').repeat(30);
        const cmpSize = new TextEncoder().encode(cmp).length;
        console.log('原文: ' + cmp.length + '字符 / ' + cmpSize + 'B');

        // 7z
        const sevenZip = await import('/usr/local/lib/node_modules/lzma1/lib/index.js');
        const cmpBytes = new TextEncoder().encode(cmp);
        const c7 = sevenZip.compress(cmpBytes, 6);
        const c7b64 = _b64Enc(c7);
        const d7 = sevenZip.decompress(c7);
        const d7text = new TextDecoder().decode(d7);
        console.log('7z:  ' + c7b64.length + 'ch (' + ((c7b64.length/cmpSize)*100).toFixed(1) + '%) | 还原: ' + (d7text===cmp?'✅':'❌'));

        // tar.xz
        const cTxz = await ext.compressText({TEXT: cmp});
        const dTxz = await ext.decompressText({TEXT: cTxz});
        console.log('xz:  ' + cTxz.length + 'ch (' + ((cTxz.length/cmpSize)*100).toFixed(1) + '%) | 还原: ' + (dTxz===cmp?'✅':'❌'));

        console.log('\n════════════════════════════════════════════════════');
        console.log('  结果: ' + pass + ' 通过 / ' + fail + ' 失败');
        console.log('════════════════════════════════════════════════════');
    })();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScratchTarXz;
}