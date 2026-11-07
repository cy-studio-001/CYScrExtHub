/*
 * Vector 的 Unicode 转换扩展
 *
 *   编号输入格式（三个积木都认，宽容解析）：
 *   十六进制 0x41 / U+41 / u+1F600 / #1F600 / 裸写 D83D（均按十六进制）
 *
 *   -本扩展不访问 Scratch 内部，沙盒与非沙盒都能正常运行，无需勾 "Run extension without sandbox"
 */
(function (Scratch) {
  'use strict';
 
  const Cast = Scratch.Cast;
 
  const MAX_CODE_UNIT = 0xFFFF;                   // 单个 UTF-16 码元的上限
  const HIGH_START = 0xD800, HIGH_END = 0xDBFF;   // 高位代理项区间
  const LOW_START  = 0xDC00, LOW_END  = 0xDFFF;   // 低位代理项区间
 
  /*
   * 过滤空输入域未和定义变量
   */
  function toText (value) {
    if (value === null || value === undefined) return false;
    return Cast.toString(value);
  }
 
  /**
   * 解析成整数编号。
   * 返回有限10进制整数，或 NaN（表示"不合法"）。
   */
  function parseCodeNumber (input) {
    let s = toText(input).trim();
    if (!s) return NaN;
 
    // 去掉分隔符和空白
    s = s.replace(/[\s_,]/g, '');
 
    // 剥掉常见前缀，带前缀的一律按十六进制
    let isHex = false;
    const prefix = s.match(/^(?:\\?u\+|0x|#)/i);
    if (prefix) {
      s = s.slice(prefix[0].length);
      isHex = true;
    }
    if (isHex) return parseInt(s, 16);
    //没有前缀
    if (/[0-9a-fA-F]/.test(s)) return parseInt(s, 16);
    return NaN;
  }
 
  //将10进制转为16进制，并输出对应字符
  function formatCode (n) {
    return 'U+' + n.toString(16).toUpperCase().padStart(4, '0');
  }
 
  class UnicodeExtension {
    getInfo () {
      return {
        id: 'unicodequery',          
        name: 'Unicode 查询',
        color1: '#7C6CE6',
        color2: '#6657CC',
        color3: '#5447A8',
        blocks: [
          {
            opcode: 'charToCode',    
            blockType: Scratch.BlockType.REPORTER,
            text: '字符 [TEXT] 的 Unicode 编码',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '😀'
              }
            }
          },
          {
            opcode: 'codeUnitToChar',
            blockType: Scratch.BlockType.REPORTER,
            text: '码元编号 [CODE] 对应的字符',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0x4E2D'
              }
            }
          },
          {
            opcode: 'surrogatePairToChar',
            blockType: Scratch.BlockType.REPORTER,
            text: '高位码元 [HIGH] 低位码元 [LOW] 对应的字符',
            arguments: {
              HIGH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0xD83D'
              },
              LOW: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0xDE00'
              }
            }
          }
        ]
      };
    }
 
 
    charToCode (args) {
      const text = toText(args.TEXT);
      if (!text) return '空输入';
 
      const parts = [];
      for (const ch of text) {
        const cp = ch.codePointAt(0);
        if (typeof cp !== 'number') continue;         
        parts.push(formatCode(cp));
        if (ch.length === 2) {
          parts.push('(' + formatCode(ch.charCodeAt(0)) + ' ' + formatCode(ch.charCodeAt(1)) + ')');
        }
      }
      return parts.join(' ');
    }
 
    codeUnitToChar (args) {
      const n = parseCodeNumber(args.CODE);
      if (!Number.isFinite(n)) return '不合法😋';
      if (n < 0 || n > MAX_CODE_UNIT) return '不合法😋';  
      return String.fromCharCode(n);
    }
 
    surrogatePairToChar (args) {
      const high = parseCodeNumber(args.HIGH);
      const low = parseCodeNumber(args.LOW);
      if (!Number.isFinite(high) || !Number.isFinite(low)) return '不合法😋';
      if (high < HIGH_START || high > HIGH_END) return '高位不合法😋';
      if (low < LOW_START || low > LOW_END) return '低位不合法😋';
      return String.fromCharCode(high, low);
    }
  }
 
  Scratch.extensions.register(new UnicodeExtension());
})(Scratch);
// V1.0.0 
// by Vector 9/30
// QQ交流群:759378319