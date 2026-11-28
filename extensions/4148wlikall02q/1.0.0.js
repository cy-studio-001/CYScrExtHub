(function(Scratch) {
  'use strict';
  if (!Scratch.extensions) window.Scratch.extensions = {};

  class HMTool {
    constructor() {
      this.lineWordNum = 15;
      this.docTitle = '无标题文档';
      this.winDom = null;
      this.txtWinDom = null;
      this.isDragWin = false;
      this.winStartX = 0;
      this.winStartY = 0;
      this.fontFamily = '微软雅黑';
      this.fontSize = 16;
      this.fontColor = '#000000';
      this.winMinStatus = false;
      this.winMaxStatus = false;
      this.winOldW = 450;
      this.winOldH = 350;
      this.winOldL = 100;
      this.winOldT = 80;
      this.isResizing = false;
      this.resizeDir = '';
      this.resizeStartX = 0;
      this.resizeStartY = 0;
      this.resizeStartW = 0;
      this.resizeStartH = 0;
      this.sharedText = '';
      this.darkMode = true;
      this.glassOpacity = 0.85;
      this.glassBlur = 12;
    }

    getStageRect() {
      const selectors = [
        '.stage_stage_1fD7V canvas',
        '.stage canvas',
        'canvas[class*="stage"]',
        'canvas'
      ];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 100 && rect.height > 100) {
            return rect;
          }
        }
      }
      return {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    }

    getInfo() {
      return {
        id: 'HMToolExt',
        name: 'HM tool',
        color1: '#1F2937',
        color2: '#374151',
        color3: '#60A5FA',
        blocks: [
          {
            opcode: 'setLineCount',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置每行字数 [num]',
            arguments: { num: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 } }
          },
          '---',
          {
            opcode: 'openMainWindow',
            blockType: Scratch.BlockType.COMMAND,
            text: '打开文档编辑窗口'
          },
          {
            opcode: 'openTxtViewer',
            blockType: Scratch.BlockType.COMMAND,
            text: '打开TXT同步查看窗口'
          },
          {
            opcode: 'openFilePicker',
            blockType: Scratch.BlockType.COMMAND,
            text: '打开文件管理器并导入编辑'
          },
          '---',
          {
            opcode: 'setGlassEffect',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置毛玻璃 透明度[o] 模糊强度[b]',
            arguments: {
              o: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.85 },
              b: { type: Scratch.ArgumentType.NUMBER, defaultValue: 12 }
            }
          },
          '---',
          {
            opcode: 'closeAllWindow',
            blockType: Scratch.BlockType.COMMAND,
            text: '关闭所有文档窗口'
          },
          {
            opcode: 'setDocTitle',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置文档标题为 [title]',
            arguments: { title: { type: Scratch.ArgumentType.STRING, defaultValue: '我的文档' } }
          },
          {
            opcode: 'getAllText',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取全部文档内容'
          },
          {
            opcode: 'setAllText',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置文档内容为 [txt]',
            arguments: { txt: { type: Scratch.ArgumentType.STRING, defaultValue: '' } }
          },
          {
            opcode: 'exportDocNow',
            blockType: Scratch.BlockType.COMMAND,
            text: '立刻导出为DOCX文件'
          }
        ]
      };
    }

    applyStyleToSelection(styleObj) {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
      const range = sel.getRangeAt(0);
      const content = range.extractContents();
      const span = document.createElement('span');
      Object.assign(span.style, styleObj);
      span.appendChild(content);
      range.insertNode(span);
      sel.removeAllRanges();
    }

    syncAllText() {
      if (this.winDom) {
        const ed = this.winDom.querySelector('.editor');
        this.sharedText = ed.innerText;
      }
      if (this.txtWinDom) {
        const txtarea = this.txtWinDom.querySelector('textarea');
        txtarea.value = this.sharedText;
      }
    }

    setGlassEffect(args) {
      const o = parseFloat(args.o);
      const b = parseFloat(args.b);
      if (!isNaN(o)) this.glassOpacity = Math.max(0.1, Math.min(1, o));
      if (!isNaN(b)) this.glassBlur = Math.max(0, Math.min(50, b));
      this.refreshAllGlass();
    }

    refreshAllGlass() {
      [this.winDom, this.txtWinDom].forEach(w => {
        if (!w) return;
        w.style.background = `rgba(30,30,30,${this.glassOpacity})`;
        w.style.backdropFilter = `blur(${this.glassBlur}px)`;
        w.style.webkitBackdropFilter = `blur(${this.glassBlur}px)`;
      });
    }

    renderDarkWinStyle(winDom) {
      const wrap = winDom;
      const titleBar = wrap.querySelector('.title-bar');
      const toolBar = wrap.querySelector('.tool-bar');
      const editor = wrap.querySelector('.editor');
      const btnList = toolBar?.querySelectorAll('button');
      const inputTitle = toolBar?.querySelector('input');
      const selects = toolBar?.querySelectorAll('select');
      const titleText = titleBar.querySelector('.title-text');
      const colorInput = toolBar?.querySelector('input[type="color"]');

      titleBar.style.background = 'rgba(40,40,40,0.7)';
      toolBar.style.background = 'rgba(45,45,45,0.6)';
      editor.style.background = 'rgba(25,25,25,0.5)';
      editor.style.color = '#fff';

      if (inputTitle) {
        inputTitle.style.background = 'rgba(50,50,50,0.8)';
        inputTitle.style.color = '#fff';
      }

      if (selects) selects.forEach(s => {
        s.style.background = 'rgba(50,50,50,0.8)';
        s.style.color = '#fff';
      });

      if (btnList) btnList.forEach(b => {
        b.style.background = 'rgba(60,60,60,0.8)';
        b.style.color = '#fff';
      });

      titleText.style.color = '#fff';
      if (colorInput) colorInput.style.background = '#3C3C3C';
    }

    renderDarkTxtWinStyle(winDom) {
      const w = winDom;
      const tb = w.querySelector('.title-bar');
      const ta = w.querySelector('textarea');
      const tt = tb.querySelector('.title-text');

      tb.style.background = 'rgba(40,40,40,0.7)';
      ta.style.background = 'rgba(25,25,25,0.5)';
      ta.style.color = '#fff';
      tt.style.color = '#fff';
    }

    openMainWindow() {
      if (this.winDom) return;
      let wrap = document.createElement('div');
      wrap.className = 'hm-win';
      const winW = 450;
      const winH = 350;

      const rect = this.getStageRect();
      const left = rect.left + rect.width / 2 - winW / 2;
      const top = rect.top + rect.height / 2 - winH / 2;

      wrap.style.cssText = `
        position:fixed;top:${top}px;left:${left}px;width:${winW}px;height:${winH}px;
        border-radius:12px;z-index:9999;overflow:hidden;
        box-shadow:0 8px 32px rgba(0,0,0,0.15);border:1px solid rgba(255,255,255,0.2);
        min-width:300px;min-height:200px;
      `;
      let titleBar = document.createElement('div');
      titleBar.className = 'title-bar';
      titleBar.style.cssText = `
        width:100%;height:36px;background:rgba(40,40,40,0.7);
        backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
        display:flex;align-items:center;padding:0 12px;cursor:move;
        user-select:none;border-bottom:1px solid rgba(0,0,0,0.08);
      `;
      let btnBox = document.createElement('div');
      btnBox.style.cssText = `display:flex;gap:8px;margin-right:12px;pointer-events:auto;`;

      let btnClose = document.createElement('div');
      btnClose.style.cssText = `width:14px;height:14px;border-radius:50%;background:#FF5F57;cursor:pointer;pointer-events:auto;`;
      btnClose.onclick = () => { wrap.remove(); this.winDom = null; };

      let btnMax = document.createElement('div');
      btnMax.style.cssText = `width:14px;height:14px;border-radius:50%;background:#FFBD2E;cursor:pointer;pointer-events:auto;`;
      btnMax.onclick = () => {
        if (!this.winMaxStatus) {
          this.winOldW = wrap.offsetWidth;
          this.winOldH = wrap.offsetHeight;
          this.winOldL = wrap.offsetLeft;
          this.winOldT = wrap.offsetTop;
          wrap.style.left = '0';
          wrap.style.top = '0';
          wrap.style.width = '100vw';
          wrap.style.height = '100vh';
          this.winMaxStatus = true;
        } else {
          wrap.style.left = this.winOldL + 'px';
          wrap.style.top = this.winOldT + 'px';
          wrap.style.width = this.winOldW + 'px';
          wrap.style.height = this.winOldH + 'px';
          this.winMaxStatus = false;
        }
      };

      let btnMin = document.createElement('div');
      btnMin.style.cssText = `width:14px;height:14px;border-radius:50%;background:#28C840;cursor:pointer;pointer-events:auto;`;
      btnMin.onclick = () => {
        if (!this.winMinStatus) {
          this.winOldH = wrap.offsetHeight;
          wrap.style.height = '36px';
          this.winMinStatus = true;
        } else {
          wrap.style.height = this.winOldH + 'px';
          this.winMinStatus = false;
        }
      };

      btnBox.appendChild(btnClose);
      btnBox.appendChild(btnMax);
      btnBox.appendChild(btnMin);
      let titleText = document.createElement('div');
      titleText.className = 'title-text';
      titleText.innerText = this.docTitle;
      titleText.style.cssText = `flex:1;text-align:center;font-size:13px;color:#fff;`;
      titleBar.appendChild(btnBox);
      titleBar.appendChild(titleText);

      let toolBar = document.createElement('div');
      toolBar.className = 'tool-bar';
      toolBar.style.cssText = `
        width:100%;height:32px;background:rgba(45,45,45,0.6);
        backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
        display:flex;align-items:center;gap:8px;padding:0 12px;
        box-sizing:border-box;border-bottom:1px solid rgba(0,0,0,0.06);
        overflow:hidden;
      `;

      let btnImport = document.createElement('button');
      btnImport.innerText = '导入文件';
      btnImport.style.cssText = `border:none;background:rgba(60,60,60,0.8);border-radius:4px;padding:2px 8px;font-size:12px;cursor:pointer;white-space:nowrap;color:#fff;`;
      btnImport.onclick = () => { this.openFilePicker(); };

      let btnExport = document.createElement('button');
      btnExport.innerText = '导出DOCX';
      btnExport.style.cssText = `border:none;background:rgba(60,60,60,0.8);border-radius:4px;padding:2px 8px;font-size:12px;cursor:pointer;white-space:nowrap;color:#fff;`;
      btnExport.onclick = () => {
        this.syncAllText();
        const blob = new Blob([this.sharedText], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.docTitle + '.docx';
        a.click();
        URL.revokeObjectURL(url);
      };

      let inputTitle = document.createElement('input');
      inputTitle.placeholder = '标题';
      inputTitle.style.cssText = `width:100px;height:20px;border:1px solid #444;border-radius:4px;padding:0 6px;font-size:12px;outline:none;box-sizing:border-box;background:rgba(50,50,50,0.8);color:#fff;`;
      inputTitle.value = this.docTitle;
      inputTitle.oninput = () => { this.docTitle = inputTitle.value; titleText.innerText = this.docTitle; };

      let selectFont = document.createElement('select');
      selectFont.style.cssText = `border:1px solid #444;border-radius:4px;padding:1px 4px;font-size:12px;outline:none;white-space:nowrap;background:rgba(50,50,50,0.8);color:#fff;`;
      selectFont.innerHTML = `<option>微软雅黑</option><option>宋体</option><option>黑体</option><option>Arial</option><option>Times New Roman</option>`;
      selectFont.onchange = () => { this.applyStyleToSelection({ fontFamily: selectFont.value }); };

      let fontSizeSel = document.createElement('select');
      fontSizeSel.style.cssText = `border:1px solid #444;border-radius:4px;padding:1px 4px;font-size:12px;outline:none;white-space:nowrap;background:rgba(50,50,50,0.8);color:#fff;`;
      fontSizeSel.innerHTML = `<option>12</option><option selected>16</option><option>18</option><option>20</option><option>24</option><option>28</option>`;
      fontSizeSel.onchange = () => { this.applyStyleToSelection({ fontSize: fontSizeSel.value + 'px' }); };

      let colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.value = '#000000';
      colorInput.style.cssText = `width:24px;height:20px;border:1px solid #444;border-radius:4px;padding:0;margin:0;cursor:pointer;background:#3C3C3C;`;
      colorInput.onchange = () => { this.applyStyleToSelection({ color: colorInput.value }); };

      toolBar.appendChild(btnImport);
      toolBar.appendChild(btnExport);
      toolBar.appendChild(inputTitle);
      toolBar.appendChild(selectFont);
      toolBar.appendChild(fontSizeSel);
      toolBar.appendChild(colorInput);

      let editor = document.createElement('div');
      editor.className = 'editor';
      editor.contentEditable = true;
      editor.style.cssText = `
        width:100%;height:calc(100% - 68px);border:none;outline:none;
        padding:15px;font-family:微软雅黑;font-size:16px;
        box-sizing:border-box;background:rgba(25,25,25,0.5);color:#fff;
        overflow:auto;white-space:pre-wrap;
      `;
      editor.innerText = this.sharedText;
      editor.oninput = () => { this.syncAllText(); };

      // ===== 修改：只保留右下角缩放 =====
      const corners = ['bottom-right'];
      corners.forEach(dir => {
        const corner = document.createElement('div');
        corner.style.cssText = `
          position:absolute;width:16px;height:16px;z-index:10;
          cursor:${dir.includes('top') ? 'n' : 's'}${dir.includes('left') ? 'w' : 'e'}-resize;
          ${dir.includes('top') ? 'top:0' : 'bottom:0'};${dir.includes('left') ? 'left:0' : 'right:0'};
        `;
        corner.onmousedown = (e) => {
          e.preventDefault();
          this.isResizing = true;
          this.resizeDir = dir;
          this.resizeStartX = e.clientX;
          this.resizeStartY = e.clientY;
          this.resizeStartW = wrap.offsetWidth;
          this.resizeStartH = wrap.offsetHeight;
        };
        wrap.appendChild(corner);
      });

      wrap.appendChild(titleBar);
      wrap.appendChild(toolBar);
      wrap.appendChild(editor);
      document.body.appendChild(wrap);
      this.winDom = wrap;

      titleBar.onmousedown = (e) => {
        e.preventDefault();
        this.isDragWin = true;
        this.winStartX = e.clientX - wrap.getBoundingClientRect().left;
        this.winStartY = e.clientY - wrap.getBoundingClientRect().top;
      };

      document.onmousemove = (e) => {
        if (this.isDragWin && !this.winMaxStatus) {
          const x = e.clientX - this.winStartX;
          const y = e.clientY - this.winStartY;
          wrap.style.left = x + 'px';
          wrap.style.top = y + 'px';
        }
        if (this.isResizing && !this.winMaxStatus) {
          const dx = e.clientX - this.resizeStartX;
          const dy = e.clientY - this.resizeStartY;
          let nw = this.resizeStartW;
          let nh = this.resizeStartH;
          let nl = parseInt(wrap.style.left) || 0;
          let nt = parseInt(wrap.style.top) || 0;

          if (this.resizeDir.includes('right')) nw = Math.max(300, this.resizeStartW + dx);
          if (this.resizeDir.includes('left')) {
            nw = Math.max(300, this.resizeStartW - dx);
            nl += dx;
          }
          if (this.resizeDir.includes('bottom')) nh = Math.max(200, this.resizeStartH + dy);
          if (this.resizeDir.includes('top')) {
            nh = Math.max(200, this.resizeStartH - dy);
            nt += dy;
          }

          wrap.style.width = nw + 'px';
          wrap.style.height = nh + 'px';
          wrap.style.left = nl + 'px';
          wrap.style.top = nt + 'px';
        }
      };

      document.onmouseup = () => {
        this.isDragWin = false;
        this.isResizing = false;
      };
      this.refreshAllGlass();
    }

    openTxtViewer() {
      if (this.txtWinDom) return;
      const winW = 450;
      const winH = 350;

      const rect = this.getStageRect();
      const left = rect.left + rect.width / 2 + 30;
      const top = rect.top + rect.height / 2 - winH / 2;

      let wrap = document.createElement('div');
      wrap.style.cssText = `
        position:fixed;top:${top}px;left:${left}px;width:${winW}px;height:${winH}px;
        border-radius:12px;z-index:9999;overflow:hidden;
        box-shadow:0 8px 32px rgba(0,0,0,0.15);border:1px solid rgba(255,255,255,0.2);
        min-width:300px;min-height:200px;
      `;
      let titleBar = document.createElement('div');
      titleBar.className = 'title-bar';
      titleBar.style.cssText = `
        width:100%;height:36px;background:rgba(40,40,40,0.7);
        backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
        display:flex;align-items:center;padding:0 12px;cursor:move;
        user-select:none;border-bottom:1px solid rgba(0,0,0,0.08);
      `;
      let btnBox = document.createElement('div');
      btnBox.style.cssText = `display:flex;gap:8px;margin-right:12px;pointer-events:auto;`;

      let btnClose = document.createElement('div');
      btnClose.style.cssText = `width:14px;height:14px;border-radius:50%;background:#FF5F57;cursor:pointer;pointer-events:auto;`;
      btnClose.onclick = () => { wrap.remove(); this.txtWinDom = null; };

      let btnMax = document.createElement('div');
      btnMax.style.cssText = `width:14px;height:14px;border-radius:50%;background:#FFBD2E;cursor:pointer;pointer-events:auto;`;
      btnMax.onclick = () => {
        if (!this.winMaxStatus) {
          this.winOldW = wrap.offsetWidth;
          this.winOldH = wrap.offsetHeight;
          this.winOldL = wrap.offsetLeft;
          this.winOldT = wrap.offsetTop;
          wrap.style.left = '0';
          wrap.style.top = '0';
          wrap.style.width = '100vw';
          wrap.style.height = '100vh';
          this.winMaxStatus = true;
        } else {
          wrap.style.left = this.winOldL + 'px';
          wrap.style.top = this.winOldT + 'px';
          wrap.style.width = this.winOldW + 'px';
          wrap.style.height = this.winOldH + 'px';
          this.winMaxStatus = false;
        }
      };

      let btnMin = document.createElement('div');
      btnMin.style.cssText = `width:14px;height:14px;border-radius:50%;background:#28C840;cursor:pointer;pointer-events:auto;`;
      btnMin.onclick = () => {
        if (!this.winMinStatus) {
          this.winOldH = wrap.offsetHeight;
          wrap.style.height = '36px';
          this.winMinStatus = true;
        } else {
          wrap.style.height = this.winOldH + 'px';
          this.winMinStatus = false;
        }
      };

      btnBox.appendChild(btnClose);
      btnBox.appendChild(btnMax);
      btnBox.appendChild(btnMin);
      let titleText = document.createElement('div');
      titleText.className = 'title-text';
      titleText.innerText = 'TXT 同步文本窗口';
      titleText.style.cssText = `flex:1;text-align:center;font-size:13px;color:#fff;`;
      titleBar.appendChild(btnBox);
      titleBar.appendChild(titleText);
      let textarea = document.createElement('textarea');
      textarea.style.cssText = `
        width:100%;height:calc(100% - 36px);border:none;outline:none;
        padding:15px;font-family:Consolas,微软雅黑;font-size:14px;
        box-sizing:border-box;resize:none;background:rgba(25,25,25,0.5);color:#fff;
        border:none;outline:none;
      `;
      textarea.value = this.sharedText;
      textarea.oninput = () => {
        this.sharedText = textarea.value;
        if (this.winDom) {
          const ed = this.winDom.querySelector('.editor');
          ed.innerText = this.sharedText;
        }
      };

      // ===== 修改：只保留右下角缩放 =====
      const corners = ['bottom-right'];
      corners.forEach(dir => {
        const c = document.createElement('div');
        c.style.cssText = `position:absolute;width:16px;height:16px;z-index:10;
        cursor:${dir.includes('top')?'n':'s'}${dir.includes('left')?'w':'e'}-resize;
        ${dir.includes('top')?'top:0':'bottom:0'};${dir.includes('left')?'left:0':'right:0'};`;
        c.onmousedown = (e) => {
          e.preventDefault();
          this.isResizing = true;
          this.resizeDir = dir;
          this.resizeStartX = e.clientX;
          this.resizeStartY = e.clientY;
          this.resizeStartW = wrap.offsetWidth;
          this.resizeStartH = wrap.offsetHeight;
        };
        wrap.appendChild(c);
      });

      wrap.appendChild(titleBar);
      wrap.appendChild(textarea);
      document.body.appendChild(wrap);
      this.txtWinDom = wrap;

      titleBar.onmousedown = (e) => {
        e.preventDefault();
        this.isDragWin = true;
        this.winStartX = e.clientX - wrap.getBoundingClientRect().left;
        this.winStartY = e.clientY - wrap.getBoundingClientRect().top;
      };

      document.onmousemove = (e) => {
        if (this.isDragWin && !this.winMaxStatus) {
          wrap.style.left = (e.clientX - this.winStartX) + 'px';
          wrap.style.top = (e.clientY - this.winStartY) + 'px';
        }
        if (this.isResizing && !this.winMaxStatus) {
          const dx = e.clientX - this.resizeStartX;
          const dy = e.clientY - this.resizeStartY;
          let nw = this.resizeStartW;
          let nh = this.resizeStartH;
          let nl = parseInt(wrap.style.left) || 0;
          let nt = parseInt(wrap.style.top) || 0;

          if (this.resizeDir.includes('right')) nw = Math.max(300, this.resizeStartW + dx);
          if (this.resizeDir.includes('left')) {
            nw = Math.max(300, this.resizeStartW - dx);
            nl += dx;
          }
          if (this.resizeDir.includes('bottom')) nh = Math.max(200, this.resizeStartH + dy);
          if (this.resizeDir.includes('top')) {
            nh = Math.max(200, this.resizeStartH - dy);
            nt += dy;
          }

          wrap.style.width = nw + 'px';
          wrap.style.height = nh + 'px';
          wrap.style.left = nl + 'px';
          wrap.style.top = nt + 'px';
        }
      };

      document.onmouseup = () => {
        this.isDragWin = false;
        this.isResizing = false;
      };
      this.refreshAllGlass();
    }

    openFilePicker() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.docx,.doc,.txt,.js,.css,.html,.md';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          this.sharedText = ev.target.result;
          if (!this.winDom) this.openMainWindow();
          setTimeout(() => {
            const ed = this.winDom.querySelector('.editor');
            ed.innerText = this.sharedText;
            if (this.txtWinDom) {
              const ta = this.txtWinDom.querySelector('textarea');
              ta.value = this.sharedText;
            }
          }, 100);
        };
        reader.readAsText(file);
      };
      input.click();
    }

    exportDocNow() {
      this.syncAllText();
      const blob = new Blob([this.sharedText], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.docTitle + '.docx';
      a.click();
      URL.revokeObjectURL(url);
    }

    closeAllWindow() {
      if (this.winDom) { this.winDom.remove(); this.winDom = null; }
      if (this.txtWinDom) { this.txtWinDom.remove(); this.txtWinDom = null; }
    }

    setDocTitle(args) {
      this.docTitle = args.title;
      if (this.winDom) {
        const t = this.winDom.querySelector('.title-text');
        if (t) t.innerText = this.docTitle;
      }
    }

    getAllText() {
      return this.sharedText;
    }

    setAllText(args) {
      this.sharedText = args.txt;
      if (this.winDom) {
        const ed = this.winDom.querySelector('.editor');
        ed.innerText = this.sharedText;
      }
      if (this.txtWinDom) {
        const ta = this.txtWinDom.querySelector('textarea');
        ta.value = this.sharedText;
      }
    }

    setLineCount(args) {
      this.lineWordNum = Number(args.num) || 15;
    }
  }

  Scratch.extensions.register(new HMTool());
})(Scratch);