(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) throw new Error("积木换肤器：需要开启无沙盒！");

  class BlockSkin {
    getInfo() {
      return {
        id: 'blockskinv1',
        name: '积木换肤器',
        color1: '#00ddaa',
        color2: '#00aa88',
        color3: '#007766',
        blocks: [
          {
            opcode: 'setBlockCSS',
            blockType: Scratch.BlockType.COMMAND,
            text: '自定义CSS [CSS]',
            blockIconURI: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64' fill='white'%3E%3Cpath d='M24 40L12 28l12-12-4-4-16 16 16 16 4-4zm16 0l12-12-12-12 4-4 16 16-16 16-4-4z'/%3E%3C/svg%3E",
            arguments: {
              CSS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: `.blocklyPath {rx:8;}`
              }
            }
          },
          {
            opcode: 'loadBlockPreset',
            blockType: Scratch.BlockType.COMMAND,
            text: '积木预设样式 [BLOCK_PRESET]',
            blockIconURI: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64' fill='white'%3E%3Cpath d='M52 8H12c-2.2 0-4 1.8-4 4v40c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4zm-8 36H20v-4h24v4zm0-12H20v-4h24v4zm0-12H20v-4h24v4z'/%3E%3C/svg%3E",
            arguments: {
              BLOCK_PRESET: {
                type: Scratch.ArgumentType.DROPDOWN,
                menu: 'blockPresetList',
                defaultValue: 'round'
              }
            }
          },
          {
            opcode: 'loadEditorPreset',
            blockType: Scratch.BlockType.COMMAND,
            text: '编辑器预设 [EDITOR_PRESET]',
            blockIconURI: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64' fill='white'%3E%3Cpath d='M10 18h44v28H10zM16 24v16h32V24z M44 28l-6 6 m0 -6 l6 6'/%3E%3C/svg%3E",
            arguments: {
              EDITOR_PRESET: {
                type: Scratch.ArgumentType.DROPDOWN,
                menu: 'editorPresetList',
                defaultValue: 'editor_dark'
              }
            }
          },
          {
            opcode: 'setGlobalTheme',
            blockType: Scratch.BlockType.COMMAND,
            text: 'TurboWarp全局主题 [THEME_SEL]',
            blockIconURI: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64' fill='white'%3E%3Cpath d='M8 12h48v40H8V12zm8 8v24h32V20H16z'/%3E%3C/svg%3E",
            arguments: {
              THEME_SEL: {
                type: Scratch.ArgumentType.DROPDOWN,
                menu: 'globalThemeMenu',
                defaultValue: 'theme_default'
              }
            }
          },
          {
            opcode: 'setFontSelect',
            blockType: Scratch.BlockType.COMMAND,
            text: '积木字体 [FONT_SEL]',
            blockIconURI: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64' fill='white'%3E%3Cpath d='M20 12v40h8V28h8v24h8V12h-8v12h-8V12z'/%3E%3C/svg%3E",
            arguments: {
              FONT_SEL: {
                type: Scratch.ArgumentType.DROPDOWN,
                menu: 'fontSelectMenu',
                defaultValue: 'default'
              }
            }
          },
          {
            opcode: 'setTextStyle',
            blockType: Scratch.BlockType.COMMAND,
            text: '积木文字 大小[S] 粗体[B]',
            blockIconURI: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64' fill='white'%3E%3Cpath d='M12 12v8h16v24h8V20h16v-8H12z'/%3E%3C/svg%3E",
            arguments: {
              S: {type:Scratch.ArgumentType.NUMBER,defaultValue:14},
              B: {
                type: Scratch.ArgumentType.DROPDOWN,
                menu: 'boolMenu',
                defaultValue: 'false'
              }
            }
          },
          {
            opcode: 'resetBlock',
            blockType: Scratch.BlockType.COMMAND,
            text: '仅重置积木样式',
          },
          {
            opcode: 'resetEditor',
            blockType: Scratch.BlockType.COMMAND,
            text: '仅重置编辑器样式',
          },
          {
            opcode: 'resetGlobal',
            blockType: Scratch.BlockType.COMMAND,
            text: '仅重置全局主题',
          },
          {
            opcode: 'resetAll',
            blockType: Scratch.BlockType.COMMAND,
            text: '恢复全部默认样式',
            blockIconURI: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64' fill='white'%3E%3Cpath d='M47 17c-3.8-3.8-9-6-15-6-11 0-20 9-20 20s9 20 20 20c9.3 0 17.1-6.5 19.3-15h-6.1c-1.6 4.7-6 8-11.2 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.3 0 6.3 1.4 8.4 3.6L37 31h15V16l-5 1z'/%3E%3C/svg%3E"
          }
        ],
        menus: {
          blockPresetList: {
            items: [
              {text:"【积木】大圆圆角积木",value:"round"},
              {text:"【积木】直角方块积木",value:"square"},
              {text:"【积木】紫色发光积木",value:"glow"},
              {text:"【积木】缩小细线积木",value:"thin"},
              {text:"【积木】霓虹蓝发光",value:"blueglow"},
              {text:"【积木】圆角金色描边",value:"gold"},
              {text:"【积木】粗黑硬核方块",value:"blackhard"},
              {text:"【积木】红色轮廓大字",value:"redbold"},
              {text:"【积木】软萌大圆角",value:"softround"},
              {text:"【积木】半透明淡积木",value:"translucent"},
              {text:"【积木】双层白边框",value:"doublewhite"},
              {text:"【积木】Windows XP",value:"winxp"},
              {text:"【积木】Windows 2000",value:"win2000"}
            ]
          },
          editorPresetList: {
            items: [
              {text:"【编辑器】暗黑模式",value:"editor_dark"},
              {text:"【编辑器】淡蓝清新",value:"editor_lightblue"},
              {text:"【编辑器】淡紫梦幻",value:"editor_lavender"},
              {text:"【编辑器】木纹底色",value:"editor_wood"},
              {text:"【编辑器】粉红甜系",value:"editor_pink"},
              {text:"【编辑器】复古积木预设",value:"retro_block"}
            ]
          },
          globalThemeMenu: {
            items: [
              {text:"默认原版", value:"theme_default"},
              {text:"Windows XP Luna 完整版", value:"theme_xp"},
              {text:"Windows 2000 专业灰【冷调】", value:"theme_win2k"},
              {text:"Win98 茶色复古【暖调】", value:"theme_win98tea"},
              {text:"深邃暗黑全局", value:"theme_dark"},
              {text:"晴空浅蓝全局", value:"theme_lightblue"}
            ]
          },
          fontSelectMenu: {
            items: [
              {text:"默认字体", value:"default"},
              {text:"黑体", value:"bold"},
              {text:"Comic Sans手写", value:"comic"},
              {text:"Consolas等宽代码", value:"consolas"},
              {text:"Tahoma复古Win", value:"tahoma"},
              {text:"乱码符号", value:"garble"}
            ]
          },
          boolMenu: {
            items: [
              {text:"开启",value:"true"},
              {text:"关闭",value:"false"}
            ]
          }
        }
      }
    }

    constructor() {
      // 状态缓存：分开保存，自动合并
      this.cache = {
        presetCSS: "",
        fontCSS: "",
        textCSS: ""
      };

      this.GARBLE_CSS = `.blocklyText { visibility:hidden; position:relative; } .blocklyText::after { content:"⍟⊛☠⌬⋈"; visibility:visible; position:absolute; left:0; top:0; }`;
      this.fontMap = {
        default: "",
        bold: `.blocklyText { font-family:"Microsoft YaHei",sans-serif !important; }`,
        comic: `.blocklyText { font-family:"Comic Sans MS",cursive !important; }`,
        consolas: `.blocklyText { font-family:"Consolas",monospace !important; }`,
        tahoma: `.blocklyText { font-family:"Tahoma",sans-serif !important; }`,
        garble: this.GARBLE_CSS
      };
      this.presets = {
        round: `.blocklyPath { rx:14; ry:14; stroke-width:3 !important; }`,
        square: `.blocklyPath { rx:0; ry:0; stroke-width:2 !important; }`,
        glow: `.blocklyPath { rx:8; ry:8; stroke-width:2 !important; filter:url(#purpleGlow) !important; }`,
        thin: `.blocklyPath { rx:6; ry:6; stroke-width:1 !important; } .blocklyBlock { transform: scale(0.85) !important; transform-origin: 0 0; }`,
        blueglow: `.blocklyPath { rx:12; ry:12; stroke-width:3 !important; filter:url(#purpleGlow) !important; } .blocklyText { fill:#ffffff; font-weight:bold; }`,
        gold: `.blocklyPath { rx:16; ry:16; stroke:#ffd700 !important; stroke-width:4 !important; }`,
        blackhard: `.blocklyPath { rx:0; ry:0; stroke:#111111 !important; stroke-width:5 !important; }`,
        redbold: `.blocklyPath { rx:10; ry:10; stroke:#ff2222 !important; stroke-width:3 !important; }`,
        softround: `.blocklyPath { rx:20; ry:20; stroke-width:2 !important; }`,
        translucent: `.blocklyPath { rx:10; ry:10; opacity:0.75; stroke-width:2; }`,
        doublewhite: `.blocklyPath { rx:12; ry:12; stroke:#ffffff !important; stroke-width:4 !important; }`,
        winxp: `
          .blocklyPath {
            rx: 14;
            ry: 14;
            stroke: #003399 !important;
            stroke-width: 3 !important;
            fill:#3485e8 !important;
            fill: url(#xpLuna) !important;
          }
          .blocklyText {
            fill: #ffffff !important;
            font-weight:bold;
          }
          .blocklySelected > .blocklyPath {
            stroke:#ffdd00 !important;
            filter: drop-shadow(0 0 5px #ffdd00);
          }
        `,
        win2000: `
          .blocklyPath {
            rx: 0;
            ry: 0;
            stroke: #000000 !important;
            stroke-width: 2px !important;
            fill:#c0bcb4 !important;
            fill: url(#win2kGrad) !important;
          }
          .blocklyText {
            fill: #000080 !important;
          }
          .blocklySelected > .blocklyPath {
            stroke:#000080 !important;
            stroke-width:3px !important;
          }
        `,
        editor_dark: `
          .blocklyWorkspace { background:#222222 !important; }
          .blocklyFlyoutBackground { fill:#333333 !important; }
          .blocklyToolboxDiv { background:#2b2b2b !important; color:#eee !important; }
          .blocklyScrollbarHandle { fill:#555 !important; }
        `,
        editor_lightblue: `
          .blocklyWorkspace { background:#e8f4fc !important; }
          .blocklyFlyoutBackground { fill:#d8ecf8 !important; }
          .blocklyToolboxDiv { background:#c9e6f7 !important; color:#222 !important; }
        `,
        editor_lavender: `
          .blocklyWorkspace { background:#f0ebf8 !important; }
          .blocklyFlyoutBackground { fill:#e5dcf2 !important; }
          .blocklyToolboxDiv { background:#d9cbec !important; color:#222 !important; }
        `,
        editor_wood: `
          .blocklyWorkspace { background:#d9b99b !important; }
          .blocklyFlyoutBackground { fill:#ccaa88 !important; }
          .blocklyToolboxDiv { background:#b89470 !important; color:#111 !important; }
        `,
        editor_pink: `
          .blocklyWorkspace { background:#ffeef6 !important; }
          .blocklyFlyoutBackground { fill:#ffddea !important; }
          .blocklyToolboxDiv { background:#ffc9dd !important; color:#222 !important; }
        `,
        retro_block: `
          .blocklyWorkspace { background:#c0c0c0 !important; }
          .blocklyFlyoutBackground { fill:#aaaaaa !important; }
          .blocklyToolboxDiv { background:#999999 !important; color:#000000 !important; }
          .blocklyPath { rx:0; ry:0; stroke:#222222 !important; stroke-width:2 !important; }
          .blocklyText { fill:#000000 !important; }
        `
      };
      this.themeMap = {
        theme_default: "",
        theme_xp: `
          * { font-family: Tahoma, "Microsoft YaHei", sans-serif !important; }
          .tw-header, header, .MuiAppBar-root, .toolbar, .react-tabs__tab-list {
            background: linear-gradient(180deg, #0a246a 0%, #1f49a8 45%, #3c7fe8 100%) !important;
            border-bottom: 2px solid #001f5b !important;
            box-shadow: 0 4px 14px #10358077 !important;
          }
          .react-tabs__tab {
            color: #ffffff !important;
            background: linear-gradient(180deg, #3c7fe8, #1f49a8) !important;
            border: 1px solid #001f5b !important;
            border-bottom: none !important;
          }
          .react-tabs__tab--selected {
            background: linear-gradient(180deg, #ffffff, #dfe9ff) !important;
            color: #001f5b !important;
          }
          .scratch-edu-editor, .tw-editor {
            background: linear-gradient(135deg, #f7f3e9 0%, #ece4d2 100%) !important;
          }
          .stage-wrapper {
            background: #f7f3e9 !important;
            border: 3px solid #003399 !important;
            box-shadow: 0 0 0 1px #ffffff inset, 0 6px 18px #00339955;
          }
          .sprite-selector, .sprite-selector-item, .costume-selector {
            background: linear-gradient(180deg, #ffffff, #eaf1ff) !important;
            border: 2px solid #003399 !important;
          }
          .blocklyToolboxDiv {
            background: linear-gradient(180deg, #cfe0ff 0%, #9abff0 100%) !important;
            border-right: 3px solid #003399 !important;
            color: #001f5b !important;
          }
          .blocklyWorkspace { background: #fbfaf4 !important; }
          .blocklyFlyoutBackground { fill: #eaf1ff !important; }
          button, input, select, .MuiButton-root, .addon-button, .tw-button {
            border: 1px solid #003399 !important;
            border-radius: 18px !important;
            background: linear-gradient(180deg, #ffffff, #dfe9ff) !important;
            color: #001f5b !important;
            box-shadow: 0 0 0 1px #ffffff inset, 0 2px 6px #00339944;
          }
          button:hover { background: linear-gradient(180deg, #ffffff, #c9dcff) !important; }
          ::-webkit-scrollbar { width: 14px; height: 14px; }
          ::-webkit-scrollbar-track { background: #dfe9ff !important; }
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #6fa8ff, #1f49a8) !important;
            border: 1px solid #003399 !important;
            border-radius: 8px;
          }
          .MuiPaper-root, .dropdown-menu, .popover {
            background: #ffffff !important;
            border: 2px solid #003399 !important;
            box-shadow: 0 6px 18px #00339955;
          }
        `,
        theme_win2k: `
          * { font-family: "MS Sans Serif", Tahoma, sans-serif !important; color: #000080 !important; }
          .tw-header, header, .MuiAppBar-root, .toolbar, .react-tabs__tab-list {
            background: #b0b8c4 !important;
            border-bottom: 2px solid #505864 !important;
          }
          .react-tabs__tab {
            color: #000080 !important;
            background: #d4d0c8 !important;
            border: 1px solid #555555 !important;
            border-bottom: none !important;
            border-radius: 2px 2px 0 0;
          }
          .react-tabs__tab--selected {
            background: #ffffff !important;
          }
          .scratch-edu-editor, .tw-editor {
            background: #d4d0c8 !important;
          }
          .stage-wrapper {
            background: #d4d0c8 !important;
            border: 2px solid #000000 !important;
          }
          .sprite-selector, .sprite-selector-item, .costume-selector {
            background: #d4d0c8 !important;
            border: 2px solid #000000 !important;
          }
          .blocklyToolboxDiv {
            background: #c0c0c0 !important;
            border-right: 2px solid #444444 !important;
            color: #000080 !important;
          }
          .blocklyWorkspace { background: #d4d0c8 !important; }
          .blocklyFlyoutBackground { fill: #c0c0c0 !important; }
          button, input, select, .MuiButton-root, .addon-button, .tw-button {
            border: 2px outset #ffffff !important;
            background: #d4d0c8 !important;
            color: #000080 !important;
            border-radius: 0 !important;
          }
          button:active { border-style: inset !important; }
          ::-webkit-scrollbar { width:14px;height:14px; }
          ::-webkit-scrollbar-track { background: #c0c0c0 !important; }
          ::-webkit-scrollbar-thumb {
            background: #b4b4b4 !important;
            border:1px solid #333 !important;
          }
          .MuiPaper-root, .dropdown-menu, .popover {
            background: #d4d0c8 !important;
            border: 2px solid #000000 !important;
          }
        `,
        theme_win98tea: `
          * { font-family: "MS Sans Serif", Tahoma, sans-serif !important; color: #111111 !important; }
          .tw-header, header, .MuiAppBar-root, .toolbar, .react-tabs__tab-list {
            background: linear-gradient(180deg, #b89b7c 0%, #705a44 100%) !important;
            border-bottom: 3px inset #4b3b2b !important;
            box-shadow: 0 4px 10px #5c4b3966 !important;
          }
          .react-tabs__tab {
            color: #111 !important;
            background: linear-gradient(180deg, #e2d2c0, #b9a48d) !important;
            border: 2px outset #f3e9dd !important;
            border-bottom: none !important;
          }
          .react-tabs__tab--selected {
            background: #efe8df !important;
          }
          .scratch-edu-editor, .tw-editor {
            background: #ddcdbb !important;
          }
          .stage-wrapper {
            background: #ddcdbb !important;
            border: 4px outset #f0e7dc !important;
            box-shadow: inset 0 0 8px #8c786044;
          }
          .sprite-selector, .sprite-selector-item, .costume-selector {
            background: #d4c2ad !important;
            border: 3px inset #6b5844 !important;
          }
          .blocklyToolboxDiv {
            background: linear-gradient(180deg, #cbb8a3, #947e66) !important;
            border-right: 4px outset #e4d9cc !important;
            color: #111 !important;
          }
          .blocklyWorkspace { background: #f3ede4 !important; }
          .blocklyFlyoutBackground { fill: #e8ddcf !important; }
          button, input, select, .MuiButton-root, .addon-button, .tw-button {
            border: 2px outset #f0e7dc !important;
            background: linear-gradient(180deg, #ddcdbb, #b49e84) !important;
            color: #111 !important;
            border-radius:0;
          }
          button:active { border-style:inset !important; }
          ::-webkit-scrollbar { width:14px;height:14px; }
          ::-webkit-scrollbar-track { background: #cbb8a3 !important; }
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg,#d6c8b8,#907c68) !important;
            border:2px outset #fff !important;
          }
          .MuiPaper-root, .dropdown-menu, .popover {
            background: #e2d7c9 !important;
            border: 3px outset #efe8df !important;
          }
        `,
        theme_dark: `
          * { color: #dddddd !important; }
          .tw-header, header, .MuiAppBar-root, .toolbar, .react-tabs__tab-list {
            background: linear-gradient(180deg, #2a2f38 0%, #15181d 100%) !important;
            border-bottom: 2px solid #000000 !important;
          }
          .react-tabs__tab {
            color: #cccccc !important;
            background: #2b2f36 !important;
            border: 1px solid #111111 !important;
          }
          .react-tabs__tab--selected {
            background: #3a3f47 !important;
            color: #ffffff !important;
          }
          .scratch-edu-editor, .tw-editor { background: #121418 !important; }
          .stage-wrapper { background: #1a1d22 !important; border: 2px solid #333942 !important; }
          .sprite-selector, .sprite-selector-item, .costume-selector { background: #1a1d22 !important; border: 2px solid #333942 !important; }
          .blocklyToolboxDiv { background: #1e2127 !important; border-right: 2px solid #000000 !important; color: #dddddd !important; }
          .blocklyWorkspace { background: #121418 !important; }
          .blocklyFlyoutBackground { fill: #1e2127 !important; }
          button, input, select, .MuiButton-root, .addon-button, .tw-button {
            background: linear-gradient(180deg, #3a3f47, #1c1f24) !important;
            border: 1px solid #000000 !important;
            color: #ffffff !important;
          }
          ::-webkit-scrollbar { width: 14px; height: 14px; }
          ::-webkit-scrollbar-track { background: #1a1d22 !important; }
          ::-webkit-scrollbar-thumb { background: #3a3f47 !important; border: 1px solid #000000 !important; }
          .MuiPaper-root, .dropdown-menu, .popover { background: #1a1d22 !important; border: 2px solid #333942 !important; }
        `,
        theme_lightblue: `
          * { color: #111111 !important; }
          .tw-header, header, .MuiAppBar-root, .toolbar, .react-tabs__tab-list {
            background: linear-gradient(180deg, #9fd2f5 0%, #4fa8e6 100%) !important;
            border-bottom: 2px solid #1f6fbf !important;
          }
          .react-tabs__tab {
            color: #111 !important;
            background: #d7ecfa !important;
            border: 1px solid #1f6fbf !important;
          }
          .react-tabs__tab--selected {
            background: #ffffff !important;
          }
          .scratch-edu-editor, .tw-editor { background: linear-gradient(135deg, #eaf6ff, #c9e7f7) !important; }
          .stage-wrapper { background: #ffffff !important; border: 2px solid #4fa8e6 !important; }
          .sprite-selector, .sprite-selector-item, .costume-selector { background: #f2fbff !important; border: 2px solid #4fa8e6 !important; }
          .blocklyToolboxDiv { background: linear-gradient(180deg, #d7ecfa, #a9d4f3) !important; border-right: 2px solid #1f6fbf !important; color: #111 !important; }
          .blocklyWorkspace { background: #ffffff !important; }
          .blocklyFlyoutBackground { fill: #eaf6ff !important; }
          button, input, select, .MuiButton-root, .addon-button, .tw-button {
            background: linear-gradient(180deg, #ffffff, #c9e7f7) !important;
            border: 1px solid #1f6fbf !important;
            color: #111 !important;
          }
          ::-webkit-scrollbar { width: 14px; height: 14px; }
          ::-webkit-scrollbar-track { background: #eaf6ff !important; }
          ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #9fd2f5, #4fa8e6) !important; border: 1px solid #1f6fbf !important; }
          .MuiPaper-root, .dropdown-menu, .popover { background: #ffffff !important; border: 2px solid #4fa8e6 !important; }
        `
      };
    }

    injectGlowFilter(){
      const svg = document.querySelector(".blocklySvg");
      if(!svg) return;
      if(svg.querySelector("#purpleGlow")) return;
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      defs.innerHTML = `
        <filter id="purpleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feFlood flood-color="#bb44ff" flood-opacity="0.8"/>
          <feComposite in2="blur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="xpLuna" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#73b8ff"/>
          <stop offset="45%" stop-color="#3485e8"/>
          <stop offset="100%" stop-color="#1959b9"/>
        </linearGradient>
        <linearGradient id="win2kGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#d4d0c8"/>
          <stop offset="100%" stop-color="#c0bcb4"/>
        </linearGradient>
      `;
      svg.prepend(defs);
    }

    // 合并全部积木相关CSS，统一渲染
    _mergeAndApplyBlockStyle(){
      const combined = this.cache.presetCSS + this.cache.fontCSS + this.cache.textCSS;
      const wrapCss = `
        * { transition: all 0.22s ease !important; }
        .blocklySvg .blocklyPath { transition: all 0.25s ease; }
        ${combined}
      `;
      let el = document.getElementById("blockskin-block");
      if(!el){
        el = document.createElement('style');
        el.id = "blockskin-block";
        document.head.appendChild(el);
      }
      el.textContent = wrapCss;
    }
    _removeStyle(id){
      const el = document.getElementById(id);
      if(el) el.remove();
    }

    setBlockCSS(args) {
      const css = Scratch.Cast.toString(args.CSS);
      let el = document.getElementById("blockskin-block");
      if(!el){
        el = document.createElement('style');
        el.id = "blockskin-block";
        document.head.appendChild(el);
      }
      el.textContent = css;
      // 清空缓存，自定义CSS模式独占
      this.cache.presetCSS = "";
      this.cache.fontCSS = "";
      this.cache.textCSS = "";
    }
    loadBlockPreset(args) {
      this.injectGlowFilter();
      const key = Scratch.Cast.toString(args.BLOCK_PRESET);
      if (!this.presets.hasOwnProperty(key)) return;
      this.cache.presetCSS = this.presets[key];
      this._mergeAndApplyBlockStyle();
    }
    loadEditorPreset(args) {
      this.injectGlowFilter();
      const key = Scratch.Cast.toString(args.EDITOR_PRESET);
      if (!this.presets.hasOwnProperty(key)) return;
      this._setStyle("blockskin-editor", this.presets[key]);
    }
    setGlobalTheme(args) {
      const sel = Scratch.Cast.toString(args.THEME_SEL);
      this._setStyle("blockskin-global", this.themeMap[sel]);
    }
    setFontSelect(args) {
      const sel = Scratch.Cast.toString(args.FONT_SEL);
      this.cache.fontCSS = this.fontMap[sel];
      this._mergeAndApplyBlockStyle();
    }
    setTextStyle(args) {
      const size = Scratch.Cast.toNumber(args.S);
      const bold = args.B === "true";
      const weight = bold ? "bold" : "normal";
      this.cache.textCSS = `.blocklyText { font-size:${size}px; font-weight:${weight} !important; }`;
      this._mergeAndApplyBlockStyle();
    }

    _setStyle(id, cssText){
      let el = document.getElementById(id);
      if(!el){
        el = document.createElement('style');
        el.id = id;
        document.head.appendChild(el);
      }
      const wrapCss = `
        * { transition: all 0.22s ease !important; }
        .react-tabs__tab-list, .tw-header, .MuiAppBar-root { transition: all 0.25s ease; }
        ${cssText}
      `;
      el.textContent = wrapCss;
    }

    resetAll() {
      this._removeStyle("blockskin-block");
      this._removeStyle("blockskin-editor");
      this._removeStyle("blockskin-global");
      // 重置缓存
      this.cache.presetCSS = "";
      this.cache.fontCSS = "";
      this.cache.textCSS = "";
    }
    resetBlock(){
      this._removeStyle("blockskin-block");
      this.cache.presetCSS = "";
      this.cache.fontCSS = "";
      this.cache.textCSS = "";
    }
    resetEditor(){ this._removeStyle("blockskin-editor"); }
    resetGlobal(){ this._removeStyle("blockskin-global"); }
  }
  Scratch.extensions.register(new BlockSkin());
})(Scratch);