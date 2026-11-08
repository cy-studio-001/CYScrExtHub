// Name: 灵动弹窗
// ID: lingdongpopup
// Description: 为舞台添加灵动岛风格的弹窗通知：通知横幅、灵动岛、进度弹窗、询问对话框，带弹性动画。
// Version: 1.4
// License: MIT
//
// ============ 更新日志 ============
// [1.4] 2026-07-30
//   - 询问对话框改为单个返回值积木：原「弹出询问...并等待」+「询问结果」两个积木
//     合并为一个异步报告积木，点击按钮后直接返回按钮文本，省一个积木。
//   - 进度弹窗增强：新增「将进度弹窗 [ID] 增加 [N] %」命令积木和
//     「进度弹窗 [ID] 的进度」报告积木，可实时读取并增量更新进度。
// [1.3] 2026-07-29
//   - 灵动岛消失补位动画：参考 v1.0 弹窗做法，移除时占位高度与间距平滑收缩为 0，
//     下方灵动岛丝滑滑动补位，不再"瞬移"（堆叠容器 gap 改为每个岛的 margin-bottom）。
//   - 新增「灵动岛点击展开详情」：弹出灵动岛积木新增 [详情] 参数，点击灵动岛可在
//     岛内手风琴式展开/收起详情文字；无详情时点击仍只触发"当弹窗被点击"事件。
// [1.2] 2026-07-29
//   - 进度弹窗彻底支持同时多个：每次"显示进度弹窗"都会【新增】一个弹窗，
//     即使 ID 相同也会叠加显示；"设置进度""关闭进度弹窗"会对同一 ID 下的
//     全部弹窗批量生效。ID 留空时自动生成唯一 ID，可用「最近进度弹窗 ID」取回。
//   - 灵动岛支持同时多个：改为独立的竖向堆叠容器，多个灵动岛依次排列、互不重叠。
// [1.1] 2026-07-29
//   - 进度弹窗支持不同 ID 同时显示（ID 留空自动生成唯一 ID，新增「最近进度弹窗 ID」积木）。
// [1.0] 2026-07-29
//   - 优化多弹窗补位动画：当上方弹窗消失时，下方弹窗不再生硬"瞬移"补位，
//     而是通过占位高度平滑收缩，丝滑地滑动上去补上空位。
// [0.9] 2026-07-29
//   - 首个版本：通知横幅、灵动岛、进度弹窗、询问对话框、
//     位置/主题/强调色设置、弹窗点击事件。
// =================================
//
// 使用方法：在 TurboWarp 中选择「自定义扩展」，加载本文件，
// 并勾选「不使用沙盒运行扩展 (Run without sandbox)」。

(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('「灵动弹窗」扩展需要在非沙盒模式下运行，请勾选"不使用沙盒运行扩展"');
  }

  const runtime = Scratch.vm ? Scratch.vm.runtime : null;

  /* ---------------- 工具函数 ---------------- */
  const toStr = (v) => (v === undefined || v === null) ? '' : String(v);
  const toNum = (v) => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------------- 全局状态 ---------------- */
  const state = {
    position: '右上角',
    theme: '深色',
    accent: '#0a84ff'
  };
  const namedPopups = new Map(); // ID -> Array<{el, fill, percentEl, iconEl, titleEl}>
  let lastClicked = '';
  let lastChoice = '';
  let lastProgressId = '';
  let autoIdCounter = 0;
  let overlay = null;
  let resizeObserver = null;

  const TYPE_ICONS = {
    '信息': 'ℹ️',
    '成功': '✅',
    '警告': '⚠️',
    '错误': '❌'
  };

  const POSITION_CLASS = {
    '顶部中间': 'ldp-pos-top-center',
    '左上角': 'ldp-pos-top-left',
    '右上角': 'ldp-pos-top-right',
    '左下角': 'ldp-pos-bottom-left',
    '右下角': 'ldp-pos-bottom-right',
    '底部中间': 'ldp-pos-bottom-center'
  };

  const THEME_CLASS = {
    '深色': 'ldp-dark',
    '浅色': 'ldp-light',
    '毛玻璃': 'ldp-glass'
  };

  /* ---------------- 样式注入 ---------------- */
  const CSS = `
.ldp-overlay{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:9999;
  font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","HarmonyOS Sans SC","Microsoft YaHei",sans-serif;
  --ldp-accent:#0a84ff;}
.ldp-region{position:absolute;display:flex;flex-direction:column;pointer-events:none;max-width:92%;}
/* 用 margin 代替 gap 控制间距：收缩补位时 margin 可以一起平滑归零，不会残留缝隙 */
.ldp-pos-top-center .ldp-popup,.ldp-pos-top-left .ldp-popup,.ldp-pos-top-right .ldp-popup{margin-bottom:.6em;}
.ldp-pos-bottom-center .ldp-popup,.ldp-pos-bottom-left .ldp-popup,.ldp-pos-bottom-right .ldp-popup{margin-top:.6em;}
.ldp-pos-top-center{top:.8em;left:50%;transform:translateX(-50%);align-items:center;}
.ldp-pos-top-left{top:.8em;left:.8em;align-items:flex-start;}
.ldp-pos-top-right{top:.8em;right:.8em;align-items:flex-end;}
.ldp-pos-bottom-left{bottom:.8em;left:.8em;align-items:flex-start;flex-direction:column-reverse;}
.ldp-pos-bottom-right{bottom:.8em;right:.8em;align-items:flex-end;flex-direction:column-reverse;}
.ldp-pos-bottom-center{bottom:.8em;left:50%;transform:translateX(-50%);align-items:center;flex-direction:column-reverse;}
.ldp-popup{pointer-events:auto;display:flex;align-items:center;gap:.65em;padding:.65em 1em;
  box-sizing:border-box;
  border-radius:1.15em;box-shadow:0 .5em 1.6em rgba(0,0,0,.28);cursor:pointer;max-width:24em;
  transform:translateY(-1.2em) scale(.75);opacity:0;user-select:none;
  transition:transform .5s cubic-bezier(.34,1.56,.64,1),opacity .32s ease;}
.ldp-popup.ldp-from-bottom{transform:translateY(1.2em) scale(.75);}
.ldp-popup.ldp-show{transform:translateY(0) scale(1);opacity:1;}
.ldp-popup.ldp-hide{transform:translateY(-.6em) scale(.82);opacity:0;
  transition:transform .3s ease,opacity .25s ease;}
.ldp-popup.ldp-from-bottom.ldp-hide{transform:translateY(.6em) scale(.82);}
/* 补位收缩：淡出后占位高度平滑归零，让相邻弹窗丝滑滑动补位 */
.ldp-popup.ldp-collapse{height:0 !important;min-height:0 !important;
  padding-top:0 !important;padding-bottom:0 !important;
  margin-top:0 !important;margin-bottom:0 !important;
  overflow:hidden;box-shadow:none;pointer-events:none;
  transition:height .38s cubic-bezier(.4,0,.2,1),padding .38s cubic-bezier(.4,0,.2,1),
    margin .38s cubic-bezier(.4,0,.2,1);}
.ldp-dark{background:rgba(28,28,30,.92);color:#fff;}
.ldp-light{background:rgba(255,255,255,.96);color:#1c1c1e;box-shadow:0 .5em 1.6em rgba(0,0,0,.16);}
.ldp-glass{background:rgba(255,255,255,.42);backdrop-filter:blur(14px) saturate(1.6);
  -webkit-backdrop-filter:blur(14px) saturate(1.6);color:#111;
  border:1px solid rgba(255,255,255,.45);}
.ldp-icon{font-size:1.5em;line-height:1;flex:none;}
.ldp-text{display:flex;flex-direction:column;min-width:0;}
.ldp-title{font-weight:700;font-size:1em;line-height:1.35;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis;}
.ldp-body{font-size:.85em;opacity:.72;line-height:1.35;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis;}
.ldp-bar{height:.4em;border-radius:.25em;background:rgba(127,127,127,.3);
  overflow:hidden;width:13em;margin-top:.4em;}
.ldp-bar-fill{height:100%;width:0%;border-radius:inherit;background:var(--ldp-accent);
  transition:width .35s cubic-bezier(.25,.8,.35,1);}
.ldp-percent{font-size:.8em;opacity:.72;margin-top:.15em;}
.ldp-island-stack{position:absolute;top:.8em;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;pointer-events:none;z-index:9999;}
.ldp-island{position:relative;background:#000;color:#fff;border-radius:2.2em;
  display:flex;align-items:center;justify-content:center;overflow:hidden;pointer-events:auto;
  box-shadow:0 .6em 2em rgba(0,0,0,.4);white-space:nowrap;cursor:pointer;user-select:none;
  margin-bottom:.6em;transform:scale(.3);opacity:0;
  transition:width .6s cubic-bezier(.3,1.35,.55,1),height .6s cubic-bezier(.3,1.35,.55,1),
    transform .5s cubic-bezier(.34,1.56,.64,1),opacity .3s ease;}
.ldp-island.ldp-island-show{transform:scale(1);opacity:1;}
/* 补位收缩：占位高度与间距平滑归零，下方灵动岛丝滑滑动补位 */
.ldp-island.ldp-island-collapse{height:0 !important;min-height:0 !important;
  margin-bottom:0 !important;padding-top:0 !important;padding-bottom:0 !important;
  opacity:0;overflow:hidden;pointer-events:none;
  transition:height .38s cubic-bezier(.4,0,.2,1),margin .38s cubic-bezier(.4,0,.2,1);}
.ldp-island-content{display:flex;align-items:center;gap:.6em;padding:.62em 1.15em;
  opacity:0;transition:opacity .35s ease .18s;}
.ldp-island-content.ldp-content-show{opacity:1;}
.ldp-island-detail{max-height:0;opacity:0;overflow:hidden;text-align:center;
  white-space:normal;word-break:break-word;line-height:1.45;font-size:.82em;
  transition:max-height .35s ease,opacity .25s ease;}
.ldp-island-detail.ldp-detail-show{opacity:.82;margin-top:.35em;}
.ldp-mask{position:absolute;inset:0;background:rgba(0,0,0,.38);display:flex;align-items:center;
  justify-content:center;pointer-events:auto;opacity:0;transition:opacity .28s ease;}
.ldp-mask.ldp-mask-show{opacity:1;}
.ldp-dialog{border-radius:1.25em;padding:1.25em 1.5em 1.15em;min-width:14em;max-width:82%;
  text-align:center;transform:scale(.75) translateY(1em);
  transition:transform .45s cubic-bezier(.34,1.56,.64,1);
  box-shadow:0 1em 3em rgba(0,0,0,.35);}
.ldp-mask-show .ldp-dialog{transform:scale(1) translateY(0);}
.ldp-dialog .ldp-d-icon{font-size:2.1em;line-height:1;margin-bottom:.25em;}
.ldp-dialog .ldp-d-title{font-weight:700;font-size:1.1em;margin-bottom:.3em;}
.ldp-dialog .ldp-d-body{font-size:.9em;opacity:.75;line-height:1.5;white-space:pre-wrap;}
.ldp-btns{display:flex;gap:.7em;margin-top:1.05em;justify-content:center;}
.ldp-btn{border:none;border-radius:2em;padding:.5em 1.4em;font-size:.95em;cursor:pointer;
  font-family:inherit;font-weight:600;transition:transform .15s ease,filter .15s ease;}
.ldp-btn:hover{filter:brightness(1.1);transform:scale(1.05);}
.ldp-btn:active{transform:scale(.95);}
.ldp-btn-primary{background:var(--ldp-accent);color:#fff;}
.ldp-btn-secondary{background:rgba(127,127,127,.22);color:inherit;}
`;

  function injectStyle() {
    if (document.getElementById('ldp-style')) return;
    const el = document.createElement('style');
    el.id = 'ldp-style';
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  /* ---------------- 覆盖层管理 ---------------- */
  function getStageParent() {
    const canvas = Scratch.renderer && Scratch.renderer.canvas;
    if (!canvas || !canvas.parentElement) return null;
    return canvas.parentElement;
  }

  function updateScale() {
    if (!overlay) return;
    const canvas = Scratch.renderer && Scratch.renderer.canvas;
    const w = canvas ? canvas.clientWidth || canvas.getBoundingClientRect().width : 480;
    const scale = Math.min(2.5, Math.max(0.55, w / 480));
    overlay.style.fontSize = (14 * scale).toFixed(2) + 'px';
  }

  function ensureOverlay() {
    injectStyle();
    const parent = getStageParent();
    if (!parent) return null;
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'ldp-overlay';
      // 创建 6 个位置容器
      for (const cls of Object.values(POSITION_CLASS)) {
        const region = document.createElement('div');
        region.className = 'ldp-region ' + cls;
        overlay.appendChild(region);
      }
      // 灵动岛堆叠容器（多个灵动岛依次竖向排列，互不重叠）
      if (!overlay.querySelector('.ldp-island-stack')) {
        const islandStack = document.createElement('div');
        islandStack.className = 'ldp-island-stack';
        overlay.appendChild(islandStack);
      }
    }
    if (overlay.parentElement !== parent) {
      const cs = getComputedStyle(parent);
      if (cs.position === 'static') parent.style.position = 'relative';
      parent.appendChild(overlay);
      const canvas = Scratch.renderer.canvas;
      if (resizeObserver) resizeObserver.disconnect();
      if (typeof ResizeObserver !== 'undefined' && canvas) {
        resizeObserver = new ResizeObserver(updateScale);
        resizeObserver.observe(canvas);
      }
    }
    overlay.style.setProperty('--ldp-accent', state.accent);
    updateScale();
    return overlay;
  }

  function getRegion(position) {
    const ov = ensureOverlay();
    if (!ov) return null;
    const cls = POSITION_CLASS[position] || POSITION_CLASS['右上角'];
    return ov.querySelector('.' + cls);
  }

  function themeClass() {
    return THEME_CLASS[state.theme] || 'ldp-dark';
  }

  function fireClicked(title) {
    lastClicked = title;
    if (runtime && runtime.startHats) {
      runtime.startHats('lingdongpopup_whenClicked');
    }
  }

  /* ---------------- 弹窗构建 ---------------- */
  function buildPopup({ icon, title, body, withProgress }) {
    const el = document.createElement('div');
    el.className = 'ldp-popup ' + themeClass();
    if ((state.position || '').includes('下') || (state.position || '').includes('底')) {
      el.classList.add('ldp-from-bottom');
    }
    let iconEl = null;
    if (icon) {
      iconEl = document.createElement('div');
      iconEl.className = 'ldp-icon';
      iconEl.textContent = icon;
      el.appendChild(iconEl);
    }
    const text = document.createElement('div');
    text.className = 'ldp-text';
    let titleEl = null;
    if (title) {
      titleEl = document.createElement('div');
      titleEl.className = 'ldp-title';
      titleEl.textContent = title;
      text.appendChild(titleEl);
    }
    if (body) {
      const b = document.createElement('div');
      b.className = 'ldp-body';
      b.textContent = body;
      text.appendChild(b);
    }
    let fill = null;
    let percentEl = null;
    if (withProgress) {
      const bar = document.createElement('div');
      bar.className = 'ldp-bar';
      fill = document.createElement('div');
      fill.className = 'ldp-bar-fill';
      bar.appendChild(fill);
      text.appendChild(bar);
      percentEl = document.createElement('div');
      percentEl.className = 'ldp-percent';
      percentEl.textContent = '0%';
      text.appendChild(percentEl);
    }
    el.appendChild(text);
    return { el, fill, percentEl, iconEl, titleEl };
  }

  function removePopup(el) {
    if (!el || el.dataset.ldpRemoving) return;
    el.dataset.ldpRemoving = '1';
    // 先固定当前高度（height:auto 无法参与过渡动画）
    el.style.height = el.offsetHeight + 'px';
    void el.offsetWidth;
    // 第一阶段：淡出 + 缩小
    el.classList.remove('ldp-show');
    el.classList.add('ldp-hide');
    // 第二阶段：占位高度平滑收缩为 0，下方弹窗随之丝滑上移补位
    setTimeout(() => {
      el.classList.add('ldp-collapse');
      setTimeout(() => el.remove(), 420);
    }, 230);
  }

  function closeAllPopups() {
    if (!overlay) return;
    overlay.querySelectorAll('.ldp-popup').forEach(removePopup);
    overlay.querySelectorAll('.ldp-island').forEach((el) => {
      el.classList.add('ldp-island-hide');
      setTimeout(() => el.remove(), 400);
    });
    overlay.querySelectorAll('.ldp-mask').forEach((el) => {
      el.classList.remove('ldp-mask-show');
      setTimeout(() => el.remove(), 300);
    });
    namedPopups.clear();
  }

  if (runtime && runtime.on) {
    runtime.on('PROJECT_STOP_ALL', closeAllPopups);
  }

  /* ---------------- 扩展类 ---------------- */
  class LingDongPopup {
    getInfo() {
      return {
        id: 'lingdongpopup',
        name: '灵动弹窗',
        color1: '#5b7cfa',
        color2: '#4a63d8',
        color3: '#3a4fb5',
        blocks: [
          {
            opcode: 'notify',
            blockType: Scratch.BlockType.COMMAND,
            text: '弹出通知 标题 [TITLE] 内容 [BODY] 类型 [TYPE] 持续 [DURATION] 秒',
            arguments: {
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: '你好！' },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: '这是一条灵动通知' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'TYPE_MENU' },
              DURATION: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
            }
          },
          {
            opcode: 'notifyCustom',
            blockType: Scratch.BlockType.COMMAND,
            text: '弹出通知 图标 [ICON] 标题 [TITLE] 内容 [BODY] 持续 [DURATION] 秒',
            arguments: {
              ICON: { type: Scratch.ArgumentType.STRING, defaultValue: '🎮' },
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: '成就达成' },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: '你解锁了新关卡！' },
              DURATION: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
            }
          },
          '---',
          {
            opcode: 'island',
            blockType: Scratch.BlockType.COMMAND,
            text: '弹出灵动岛 图标 [ICON] 标题 [TITLE] 内容 [BODY] 详情 [DETAIL] 持续 [DURATION] 秒',
            arguments: {
              ICON: { type: Scratch.ArgumentType.STRING, defaultValue: '🎵' },
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: '正在播放' },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: '灵动之歌' },
              DETAIL: { type: Scratch.ArgumentType.STRING, defaultValue: '' },
              DURATION: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
            }
          },
          '---',
          {
            opcode: 'showProgress',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示进度弹窗 ID [ID] 图标 [ICON] 标题 [TITLE]',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '下载' },
              ICON: { type: Scratch.ArgumentType.STRING, defaultValue: '📦' },
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: '正在加载…' }
            }
          },
          {
            opcode: 'setProgress',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置进度弹窗 [ID] 的进度为 [PERCENT] %',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '下载' },
              PERCENT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }
            }
          },
          {
            opcode: 'addProgress',
            blockType: Scratch.BlockType.COMMAND,
            text: '将进度弹窗 [ID] 的进度增加 [AMOUNT] %',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '下载' },
              AMOUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'closeById',
            blockType: Scratch.BlockType.COMMAND,
            text: '关闭进度弹窗 [ID]',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '下载' }
            }
          },
          {
            opcode: 'getProgressId',
            blockType: Scratch.BlockType.REPORTER,
            text: '最近进度弹窗 ID'
          },
          {
            opcode: 'getProgress',
            blockType: Scratch.BlockType.REPORTER,
            text: '进度弹窗 [ID] 的进度',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '下载' }
            }
          },
          '---',
          {
            opcode: 'ask',
            blockType: Scratch.BlockType.REPORTER,
            text: '询问 图标 [ICON] 标题 [TITLE] 内容 [BODY] 按钮 [OK] 和 [CANCEL]',
            arguments: {
              ICON: { type: Scratch.ArgumentType.STRING, defaultValue: '❓' },
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: '确认操作' },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: '确定要重新开始游戏吗？' },
              OK: { type: Scratch.ArgumentType.STRING, defaultValue: '确定' },
              CANCEL: { type: Scratch.ArgumentType.STRING, defaultValue: '取消' }
            }
          },
          '---',
          {
            opcode: 'setPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置弹窗位置为 [POSITION]',
            arguments: {
              POSITION: { type: Scratch.ArgumentType.STRING, menu: 'POSITION_MENU' }
            }
          },
          {
            opcode: 'setTheme',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置弹窗主题为 [THEME]',
            arguments: {
              THEME: { type: Scratch.ArgumentType.STRING, menu: 'THEME_MENU' }
            }
          },
          {
            opcode: 'setAccent',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置强调色为 [COLOR]',
            arguments: {
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#0a84ff' }
            }
          },
          {
            opcode: 'closeAll',
            blockType: Scratch.BlockType.COMMAND,
            text: '关闭所有弹窗'
          },
          '---',
          {
            opcode: 'whenClicked',
            blockType: Scratch.BlockType.EVENT,
            isEdgeActivated: false,
            text: '当弹窗被点击'
          },
          {
            opcode: 'getLastClicked',
            blockType: Scratch.BlockType.REPORTER,
            text: '最后点击的弹窗标题'
          },
          {
            opcode: 'getCount',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前弹窗数量'
          }
        ],
        menus: {
          TYPE_MENU: {
            acceptReporters: true,
            items: ['信息', '成功', '警告', '错误']
          },
          POSITION_MENU: {
            acceptReporters: true,
            items: ['顶部中间', '左上角', '右上角', '左下角', '右下角', '底部中间']
          },
          THEME_MENU: {
            acceptReporters: true,
            items: ['深色', '浅色', '毛玻璃']
          }
        }
      };
    }

    /* ---------- 通知 ---------- */
    _spawnNotify(icon, title, body, duration) {
      const region = getRegion(state.position);
      if (!region) return;
      const { el } = buildPopup({ icon, title, body });
      el.addEventListener('click', () => {
        fireClicked(title);
        removePopup(el);
      });
      region.appendChild(el);
      // 强制回流后播放入场动画
      void el.offsetWidth;
      el.classList.add('ldp-show');
      const d = toNum(duration);
      if (d > 0) {
        setTimeout(() => removePopup(el), d * 1000);
      }
    }

    notify(args) {
      const type = toStr(args.TYPE) || '信息';
      const icon = TYPE_ICONS[type] || TYPE_ICONS['信息'];
      this._spawnNotify(icon, toStr(args.TITLE), toStr(args.BODY), args.DURATION);
    }

    notifyCustom(args) {
      this._spawnNotify(toStr(args.ICON), toStr(args.TITLE), toStr(args.BODY), args.DURATION);
    }

    /* ---------- 灵动岛 ---------- */
    async island(args) {
      const ov = ensureOverlay();
      if (!ov) return;
      const icon = toStr(args.ICON);
      const title = toStr(args.TITLE);
      const body = toStr(args.BODY);
      const detailTxt = toStr(args.DETAIL);
      const duration = Math.max(0.5, toNum(args.DURATION));

      const el = document.createElement('div');
      el.className = 'ldp-island';
      const content = document.createElement('div');
      content.className = 'ldp-island-content';
      if (icon) {
        const i = document.createElement('div');
        i.className = 'ldp-icon';
        i.textContent = icon;
        content.appendChild(i);
      }
      const text = document.createElement('div');
      text.className = 'ldp-text';
      if (title) {
        const t = document.createElement('div');
        t.className = 'ldp-title';
        t.textContent = title;
        text.appendChild(t);
      }
      if (body) {
        const b = document.createElement('div');
        b.className = 'ldp-body';
        b.textContent = body;
        text.appendChild(b);
      }
      // 详情：点击灵动岛时在岛内手风琴展开/收起
      let detailEl = null;
      if (detailTxt) {
        const d = document.createElement('div');
        d.className = 'ldp-island-detail';
        d.textContent = detailTxt;
        text.appendChild(d);
        detailEl = d;
        el.title = '点击展开 / 收起详情';
      }
      content.appendChild(text);
      el.appendChild(content);

      // 先隐藏并脱离文档流测量展开后的目标尺寸（避免影响已显示的灵动岛布局）
      const stack = ov.querySelector('.ldp-island-stack');
      if (!stack) return;
      el.style.visibility = 'hidden';
      el.style.position = 'absolute';
      el.style.width = 'auto';
      el.style.height = 'auto';
      stack.appendChild(el);
      const targetW = el.offsetWidth;
      const targetH = el.offsetHeight;
      el.style.position = '';

      // 初始为小胶囊
      const pill = Math.round(targetH * 0.62);
      el.style.width = pill * 2.2 + 'px';
      el.style.height = pill + 'px';
      el.style.visibility = '';
      void el.offsetWidth;

      // 点击：触发"当弹窗被点击"事件；有详情时手风琴展开/收起
      let expanded = false;
      let closing = false;
      el.addEventListener('click', () => {
        fireClicked(title);
        if (!detailEl || closing) return;
        expanded = !expanded;
        if (expanded) {
          detailEl.style.maxHeight = detailEl.scrollHeight + 'px';
          detailEl.classList.add('ldp-detail-show');
          el.style.height = (el.offsetHeight + detailEl.scrollHeight) + 'px';
        } else {
          detailEl.classList.remove('ldp-detail-show');
          detailEl.style.maxHeight = '0px';
          el.style.height = targetH + 'px';
        }
      });

      // 第一阶段：小胶囊弹出
      el.classList.add('ldp-island-show');
      await sleep(420);

      // 第二阶段：弹性展开显示内容
      el.style.width = targetW + 'px';
      el.style.height = targetH + 'px';
      content.classList.add('ldp-content-show');
      await sleep(600);

      // 停留
      await sleep(duration * 1000);

      // 第三阶段：收缩为胶囊（若详情已展开先收起）
      if (detailEl && expanded) {
        detailEl.classList.remove('ldp-detail-show');
        detailEl.style.maxHeight = '0px';
      }
      content.classList.remove('ldp-content-show');
      el.style.width = pill * 2.2 + 'px';
      el.style.height = pill + 'px';
      await sleep(500);

      // 第四阶段：占位高度与间距平滑收缩为 0，下方灵动岛丝滑滑动补位
      closing = true;
      el.style.height = el.offsetHeight + 'px';
      void el.offsetWidth;
      el.classList.add('ldp-island-collapse');
      await sleep(420);
      el.remove();
    }

    /* ---------- 进度弹窗 ---------- */
    showProgress(args) {
      let id = toStr(args.ID);
      if (!id) {
        // ID 留空时自动生成唯一 ID，避免多个脚本并行时互相覆盖
        id = 'ldp_auto_' + (++autoIdCounter);
      }
      const region = getRegion(state.position);
      if (!region) return;
      const built = buildPopup({
        icon: toStr(args.ICON),
        title: toStr(args.TITLE),
        body: '',
        withProgress: true
      });
      built.el.style.cursor = 'default';
      region.appendChild(built.el);
      void built.el.offsetWidth;
      built.el.classList.add('ldp-show');
      // 同一 ID 可对应多个弹窗，例如同时下载多个文件都用 ID「下载」，
      // 它们会各自独立显示、叠加排列；setProgress / closeById 对同 ID 批量生效
      built.percent = 0;
      if (!namedPopups.has(id)) namedPopups.set(id, []);
      namedPopups.get(id).push(built);
      lastProgressId = id;
    }

    setProgress(args) {
      const arr = namedPopups.get(toStr(args.ID));
      if (!arr || !arr.length) return;
      const p = Math.min(100, Math.max(0, toNum(args.PERCENT)));
      for (const item of arr) {
        if (!item || !item.fill) continue;
        item.percent = p;
        item.fill.style.width = p + '%';
        if (item.percentEl) item.percentEl.textContent = Math.round(p) + '%';
      }
    }

    addProgress(args) {
      const arr = namedPopups.get(toStr(args.ID));
      if (!arr || !arr.length) return;
      const delta = toNum(args.AMOUNT);
      for (const item of arr) {
        if (!item || !item.fill) continue;
        const p = Math.min(100, Math.max(0, item.percent + delta));
        item.percent = p;
        item.fill.style.width = p + '%';
        if (item.percentEl) item.percentEl.textContent = Math.round(p) + '%';
      }
    }

    closeById(args) {
      const id = toStr(args.ID);
      const arr = namedPopups.get(id);
      if (arr && arr.length) {
        for (const item of arr) removePopup(item.el);
        namedPopups.delete(id);
      }
    }

    getProgressId() {
      return lastProgressId;
    }

    getProgress(args) {
      const arr = namedPopups.get(toStr(args.ID));
      if (!arr || !arr.length) return 0;
      // 同一 ID 下可能有多个弹窗，返回最新（最后添加）那个的进度
      for (let i = arr.length - 1; i >= 0; i--) {
        const item = arr[i];
        if (item && item.fill) return Math.round(item.percent || 0);
      }
      return 0;
    }

    /* ---------- 询问对话框（异步返回值积木） ---------- */
    ask(args) {
      const ov = ensureOverlay();
      if (!ov) return Promise.resolve('');
      return new Promise((resolve) => {
        const mask = document.createElement('div');
        mask.className = 'ldp-mask';
        const dialog = document.createElement('div');
        dialog.className = 'ldp-dialog ' + themeClass();

        const icon = toStr(args.ICON);
        if (icon) {
          const i = document.createElement('div');
          i.className = 'ldp-d-icon';
          i.textContent = icon;
          dialog.appendChild(i);
        }
        const t = document.createElement('div');
        t.className = 'ldp-d-title';
        t.textContent = toStr(args.TITLE);
        dialog.appendChild(t);
        const body = toStr(args.BODY);
        if (body) {
          const b = document.createElement('div');
          b.className = 'ldp-d-body';
          b.textContent = body;
          dialog.appendChild(b);
        }
        const btns = document.createElement('div');
        btns.className = 'ldp-btns';

        const close = (choice) => {
          lastChoice = choice;
          mask.classList.remove('ldp-mask-show');
          setTimeout(() => {
            mask.remove();
            resolve(choice);
          }, 280);
        };

        const okText = toStr(args.OK) || '确定';
        const cancelText = toStr(args.CANCEL);
        if (cancelText) {
          const cancelBtn = document.createElement('button');
          cancelBtn.className = 'ldp-btn ldp-btn-secondary';
          cancelBtn.textContent = cancelText;
          cancelBtn.addEventListener('click', () => close(cancelText));
          btns.appendChild(cancelBtn);
        }
        const okBtn = document.createElement('button');
        okBtn.className = 'ldp-btn ldp-btn-primary';
        okBtn.textContent = okText;
        okBtn.addEventListener('click', () => close(okText));
        btns.appendChild(okBtn);

        dialog.appendChild(btns);
        mask.appendChild(dialog);
        ov.appendChild(mask);
        void mask.offsetWidth;
        mask.classList.add('ldp-mask-show');
      });
    }

    /* ---------- 设置 ---------- */
    setPosition(args) {
      const p = toStr(args.POSITION);
      if (POSITION_CLASS[p]) state.position = p;
    }

    setTheme(args) {
      const t = toStr(args.THEME);
      if (THEME_CLASS[t]) state.theme = t;
    }

    setAccent(args) {
      state.accent = toStr(args.COLOR) || '#0a84ff';
      if (overlay) overlay.style.setProperty('--ldp-accent', state.accent);
    }

    closeAll() {
      closeAllPopups();
    }

    /* ---------- 查询 ---------- */
    getLastClicked() {
      return lastClicked;
    }

    getCount() {
      if (!overlay) return 0;
      return overlay.querySelectorAll(
        '.ldp-popup:not([data-ldp-removing]), .ldp-island, .ldp-mask'
      ).length;
    }
  }

  Scratch.extensions.register(new LingDongPopup());
})(Scratch);
