(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("此扩展必须开启【不使用沙盒运行扩展】");
  }

  class StringTools {
    getInfo() {
      return {
        id: "stringtoolsext",
        name: "字符串工具箱",
        color1: "#e74c3c",
        color2: "#c0392b",
        color3: "#922b21",
        blocks: [
          {
            opcode: "trimChars",
            blockType: Scratch.BlockType.REPORTER,
            text: "文本 [TXT] 去除首尾字符 [CH]",
            arguments: {
              TXT: {type: Scratch.ArgumentType.STRING, defaultValue:"--hello--"},
              CH: {type: Scratch.ArgumentType.STRING, defaultValue:"-"}
            }
          },
          {
            opcode: "strDeleteIndex",
            blockType: Scratch.BlockType.REPORTER,
            text: "字符串 [STR] 删除第 [IDX] 个字符",
            arguments: {
              STR: {type: Scratch.ArgumentType.STRING, defaultValue:"hello"},
              IDX: {type: Scratch.ArgumentType.NUMBER, defaultValue:2}
            }
          },
          {
            opcode: "replaceNth",
            blockType: Scratch.BlockType.REPORTER,
            text: "文本 [SRC] 第 [N] 次把 [old] 替换成 [new]",
            arguments: {
              SRC: {type: Scratch.ArgumentType.STRING, defaultValue:"a b a b a"},
              N: {type: Scratch.ArgumentType.NUMBER, defaultValue:2},
              old: {type: Scratch.ArgumentType.STRING, defaultValue:"a"},
              new: {type: Scratch.ArgumentType.STRING, defaultValue:"x"}
            }
          },
          "---",
          {
            opcode: "subStringMid",
            blockType: Scratch.BlockType.REPORTER,
            text: "文本 [S] 从第 [START] 位取 [LEN] 个字符",
            arguments: {
              S: {type: Scratch.ArgumentType.STRING, defaultValue:"abcdefgh"},
              START: {type: Scratch.ArgumentType.NUMBER, defaultValue:2},
              LEN: {type: Scratch.ArgumentType.NUMBER, defaultValue:3}
            }
          },
          {
            opcode: "repeatChar",
            blockType: Scratch.BlockType.REPORTER,
            text: "重复文本 [TEXT] 共 [TIMES] 次",
            arguments: {
              TEXT: {type: Scratch.ArgumentType.STRING, defaultValue:"*"},
              TIMES: {type: Scratch.ArgumentType.NUMBER, defaultValue:5}
            }
          },
          {
            opcode: "reverseStr",
            blockType: Scratch.BlockType.REPORTER,
            text: "反转字符串 [S]",
            arguments: {
              S: {type: Scratch.ArgumentType.STRING, defaultValue:"12345"}
            }
          },
          {
            opcode: "countOccur",
            blockType: Scratch.BlockType.REPORTER,
            text: "文本 [S] 中 [SUB] 出现次数",
            arguments: {
              S: {type: Scratch.ArgumentType.STRING, defaultValue:"ababa"},
              SUB: {type: Scratch.ArgumentType.STRING, defaultValue:"a"}
            }
          },
          {
            opcode: "insertStr",
            blockType: Scratch.BlockType.REPORTER,
            text: "在文本 [S] 第 [POS] 位插入 [INS]",
            arguments: {
              S: {type: Scratch.ArgumentType.STRING, defaultValue:"abcd"},
              POS: {type: Scratch.ArgumentType.NUMBER, defaultValue:3},
              INS: {type: Scratch.ArgumentType.STRING, defaultValue:"XYZ"}
            }
          },
          "---",
          {
            opcode: "startsWithStr",
            blockType: Scratch.BlockType.REPORTER,
            text: "文本 [S] 是否以 [PREFIX] 开头",
            arguments: {
              S: {type: Scratch.ArgumentType.STRING, defaultValue:"helloworld"},
              PREFIX: {type: Scratch.ArgumentType.STRING, defaultValue:"hello"}
            }
          },
          {
            opcode: "endsWithStr",
            blockType: Scratch.BlockType.REPORTER,
            text: "文本 [S] 是否以 [SUFFIX] 结尾",
            arguments: {
              S: {type: Scratch.ArgumentType.STRING, defaultValue:"helloworld"},
              SUFFIX: {type: Scratch.ArgumentType.STRING, defaultValue:"world"}
            }
          },
          {
            opcode: "toUpper",
            blockType: Scratch.BlockType.REPORTER,
            text: "转大写 [S]",
            arguments: {
              S: {type: Scratch.ArgumentType.STRING, defaultValue:"Hello"}
            }
          },
          {
            opcode: "toLower",
            blockType: Scratch.BlockType.REPORTER,
            text: "转小写 [S]",
            arguments: {
              S: {type: Scratch.ArgumentType.STRING, defaultValue:"Hello"}
            }
          }
        ]
      }
    }

    trimChars(args) {
      let str = Scratch.Cast.toString(args.TXT);
      const ch = Scratch.Cast.toString(args.CH);
      if (ch.length !== 1) return str;
      while (str.startsWith(ch)) str = str.slice(1);
      while (str.endsWith(ch)) str = str.slice(0, -1);
      return str;
    }

    strDeleteIndex(args) {
      const s = Scratch.Cast.toString(args.STR);
      let i = Math.round(Number(args.IDX)) - 1;
      if(i < 0 || i >= s.length) return s;
      return s.slice(0,i) + s.slice(i+1);
    }

    replaceNth(args) {
      let src = Scratch.Cast.toString(args.SRC);
      const n = Math.round(Number(args.N));
      const oldStr = Scratch.Cast.toString(args.old);
      const newStr = Scratch.Cast.toString(args.new);
      let count = 0;
      let pos = -1;
      for(let i = 0; i < src.length; i++){
        pos = src.indexOf(oldStr, pos + 1);
        if(pos === -1) break;
        count++;
        if(count === n){
          src = src.slice(0,pos) + newStr + src.slice(pos + oldStr.length);
          break;
        }
      }
      return src;
    }

    subStringMid(args) {
      const s = Scratch.Cast.toString(args.S);
      const start = Math.round(Number(args.START)) - 1;
      const len = Math.round(Number(args.LEN));
      return s.substr(start, len);
    }

    repeatChar(args) {
      const t = Scratch.Cast.toString(args.TEXT);
      const times = Math.max(0, Math.round(Number(args.TIMES)));
      return t.repeat(times);
    }

    reverseStr(args) {
      return Scratch.Cast.toString(args.S).split('').reverse().join('');
    }

    countOccur(args) {
      const s = Scratch.Cast.toString(args.S);
      const sub = Scratch.Cast.toString(args.SUB);
      if(sub === "") return 0;
      let count = 0;
      let idx = s.indexOf(sub);
      while(idx !== -1){
        count++;
        idx = s.indexOf(sub, idx + sub.length);
      }
      return count;
    }

    insertStr(args) {
      const s = Scratch.Cast.toString(args.S);
      const pos = Math.round(Number(args.POS)) - 1;
      const ins = Scratch.Cast.toString(args.INS);
      if(pos <= 0) return ins + s;
      if(pos >= s.length) return s + ins;
      return s.slice(0, pos) + ins + s.slice(pos);
    }

    startsWithStr(args) {
      const s = Scratch.Cast.toString(args.S);
      const pre = Scratch.Cast.toString(args.PREFIX);
      return s.startsWith(pre) ? "true" : "false";
    }

    endsWithStr(args) {
      const s = Scratch.Cast.toString(args.S);
      const suf = Scratch.Cast.toString(args.SUFFIX);
      return s.endsWith(suf) ? "true" : "false";
    }

    toUpper(args) {
      return Scratch.Cast.toString(args.S).toUpperCase();
    }

    toLower(args) {
      return Scratch.Cast.toString(args.S).toLowerCase();
    }
  }
  Scratch.extensions.register(new StringTools());
})(Scratch);