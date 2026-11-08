(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('CYSO CORE+ 扩展需要在非沙盒模式下运行');
  }

  const ArgumentType = Scratch.ArgumentType;
  const BlockType = Scratch.BlockType;
  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const extensionId = 'cysocorePowerToolkit';

  class CYSOCorePowerToolkit {
    constructor() {
      this._extensionId = extensionId;
      this._isDesktop = typeof EditorPreload !== 'undefined';
      this._windowCache = {};
      this._shortcutPending = {};
      this._shortcutEvents = {};       // { key: eventName }
      this._shortcutListenerSetup = false;
      this._shortcutHandler = null;
      this._screenWidth = 0;
      this._screenHeight = 0;

      if (this._isDesktop) {
        try {
          this._screenWidth = window.screen.width;
          this._screenHeight = window.screen.height;
        } catch (_) {
          this._screenWidth = 1920;
          this._screenHeight = 1080;
        }
        this._setupShortcutListener();
      }
    }

    // ---------- 工具方法 ----------
    _checkDesktop() {
      if (!this._isDesktop) return '❌ 此功能需要 CYSOEditor 桌面版';
      return null;
    }

    async _safeCall(method, ...args) {
      const err = this._checkDesktop();
      if (err) return { success: false, error: err };
      try {
        return await method(...args);
      } catch (e) {
        return { success: false, error: '异常: ' + e.message };
      }
    }

    _formatSize(bytes) {
      if (bytes === undefined || bytes === null) return '0 B';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
      return (bytes / 1073741824).toFixed(2) + ' GB';
    }

    _formatTime(isoString) {
      if (!isoString) return '未知';
      try { const d = new Date(isoString); return d.toLocaleString('zh-CN'); } catch (_) { return isoString; }
    }

    _safeGet(result, path, fallback = '') {
      if (!result || !result.success) return fallback;
      let current = result;
      const parts = path.split('.');
      for (let i = 0; i < parts.length; i++) {
        const key = parts[i];
        if (current && typeof current === 'object' && key in current) current = current[key];
        else return fallback;
      }
      return current !== undefined ? current : fallback;
    }

    getInfo() {
      return {
        id: this._extensionId,
        name: 'CYSO CORE+',
        color1: '#3a7aaa',
        color2: '#4f8ec2',
        color3: '#6aa5d5',
        iconURI: 'https://cysoeditor.pages.dev/logo.png',
        docsURI: 'https://cyscrexthub.cc.cd',
        permissions: [
          'file-read', 'file-write', 'file-delete', 'file-metadata',
          'system-command', 'global-shortcut', 'draw-window',
          'screen-capture', 'advanced-window', 'hardware-status'
        ],
        blocks: [
          // ---- 文件操作 ----
          {
            blockType: BlockType.LABEL,
            text: '📁 文件操作'
          },
          {
            opcode: 'readFile',
            blockType: BlockType.REPORTER,
            text: '读取文件 [PATH]',
            arguments: {
              PATH: { type: ArgumentType.STRING, defaultValue: '%DESKTOP%\\notes.txt' }
            }
          },
          {
            opcode: 'writeFile',
            blockType: BlockType.COMMAND,
            text: '写入文件 [PATH] 内容 [CONTENT]',
            arguments: {
              PATH: { type: ArgumentType.STRING, defaultValue: '%DESKTOP%\\output.txt' },
              CONTENT: { type: ArgumentType.STRING, defaultValue: 'Hello CYSOCore!' }
            }
          },
          {
            opcode: 'deleteFile',
            blockType: BlockType.COMMAND,
            text: '删除文件 [PATH]',
            arguments: {
              PATH: { type: ArgumentType.STRING, defaultValue: '%DESKTOP%\\temp.txt' }
            }
          },
          {
            opcode: 'fileExists',
            blockType: BlockType.BOOLEAN,
            text: '文件存在? [PATH]',
            arguments: {
              PATH: { type: ArgumentType.STRING, defaultValue: '%DESKTOP%\\config.json' }
            }
          },
          {
            opcode: 'getFileInfo',
            blockType: BlockType.REPORTER,
            text: '文件 [INFO] [PATH]',
            arguments: {
              INFO: { type: ArgumentType.STRING, menu: 'fileInfoTypes', defaultValue: 'size' },
              PATH: { type: ArgumentType.STRING, defaultValue: '%DESKTOP%\\notes.txt' }
            }
          },
          {
            opcode: 'createFolder',
            blockType: BlockType.COMMAND,
            text: '创建文件夹 [PATH]',
            arguments: {
              PATH: { type: ArgumentType.STRING, defaultValue: '%DESKTOP%\\新建文件夹' }
            }
          },
          {
            opcode: 'listFolder',
            blockType: BlockType.REPORTER,
            text: '列出文件夹 [PATH] (JSON)',
            arguments: {
              PATH: { type: ArgumentType.STRING, defaultValue: '%DESKTOP%' }
            }
          },
          "---",
          // ---- 系统信息 ----
          {
            blockType: BlockType.LABEL,
            text: '💻 系统信息'
          },
          {
            opcode: 'getSystemPath',
            blockType: BlockType.REPORTER,
            text: '获取系统路径 [NAME]',
            arguments: {
              NAME: { type: ArgumentType.STRING, menu: 'systemPaths', defaultValue: 'desktop' }
            }
          },
          {
            opcode: 'getHardwareInfo',
            blockType: BlockType.REPORTER,
            text: '硬件 [TYPE] 驱动器 [DRIVE]',
            arguments: {
              TYPE: { type: ArgumentType.STRING, menu: 'hardwareTypes', defaultValue: 'cpu-usage' },
              DRIVE: { type: ArgumentType.STRING, defaultValue: 'C:' }
            }
          },
          "---",
          // ---- 系统交互 ----
          {
            blockType: BlockType.LABEL,
            text: '⚡ 系统交互'
          },
          {
            opcode: 'executeCommand',
            blockType: BlockType.REPORTER,
            text: '执行命令 [CMD]',
            arguments: {
              CMD: { type: ArgumentType.STRING, defaultValue: 'echo Hello' }
            }
          },
          {
            opcode: 'showNotification',
            blockType: BlockType.COMMAND,
            text: '显示通知 [TITLE] 内容 [BODY]',
            arguments: {
              TITLE: { type: ArgumentType.STRING, defaultValue: 'CYSOCore 通知' },
              BODY: { type: ArgumentType.STRING, defaultValue: '这是一条系统通知' }
            }
          },
          "---",
          // ---- 全局快捷键 ----
          {
            blockType: BlockType.LABEL,
            text: '⌨️ 全局快捷键'
          },
          {
            opcode: 'registerShortcut',
            blockType: BlockType.COMMAND,
            text: '注册快捷键 [KEY] 事件名 [EVENT]',
            arguments: {
              KEY: { type: ArgumentType.STRING, defaultValue: 'Ctrl+Shift+P' },
              EVENT: { type: ArgumentType.STRING, defaultValue: 'my-event' }
            }
          },
          {
            opcode: 'unregisterShortcut',
            blockType: BlockType.COMMAND,
            text: '注销快捷键 [KEY]',
            arguments: {
              KEY: { type: ArgumentType.STRING, defaultValue: 'Ctrl+Shift+P' }
            }
          },
          {
            opcode: 'shortcutTriggered',
            blockType: BlockType.HAT,
            isEdgeActivated: false,
            shouldRestartExistingThreads: true,
            text: '当快捷键 [EVENT] 触发',
            arguments: {
              EVENT: { type: ArgumentType.STRING, defaultValue: 'my-event' }
            }
          },
          {
            opcode: 'getShortcutEventList',
            blockType: BlockType.REPORTER,
            text: '获取所有已注册快捷键 (JSON)'
          },
          {
            opcode: 'isShortcutEventRegistered',
            blockType: BlockType.BOOLEAN,
            text: '快捷键事件 [EVENT] 已注册?',
            arguments: {
              EVENT: { type: ArgumentType.STRING, defaultValue: 'my-event' }
            }
          },
          "---",
          // ---- 窗口操作 ----
          {
            blockType: BlockType.LABEL,
            text: '🪟 窗口操作'
          },
          {
            opcode: 'createOverlay',
            blockType: BlockType.COMMAND,
            text: '创建覆盖窗口 [ID] 位置 [X] [Y] 大小 [W]x[H]',
            arguments: {
              ID: { type: ArgumentType.STRING, defaultValue: 'my-overlay' },
              X: { type: ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: ArgumentType.NUMBER, defaultValue: 0 },
              W: { type: ArgumentType.NUMBER, defaultValue: 300 },
              H: { type: ArgumentType.NUMBER, defaultValue: 200 }
            }
          },
          {
            opcode: 'setOverlayProperties',
            blockType: BlockType.COMMAND,
            text: '设置覆盖窗口 [ID] 位置 [X] [Y] 大小 [W]x[H]',
            arguments: {
              ID: { type: ArgumentType.STRING, defaultValue: 'my-overlay' },
              X: { type: ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: ArgumentType.NUMBER, defaultValue: 0 },
              W: { type: ArgumentType.NUMBER, defaultValue: 300 },
              H: { type: ArgumentType.NUMBER, defaultValue: 200 }
            }
          },
          {
            opcode: 'setOverlayContent',
            blockType: BlockType.COMMAND,
            text: '设置覆盖窗口 [ID] 内容 [HTML]',
            arguments: {
              ID: { type: ArgumentType.STRING, defaultValue: 'my-overlay' },
              HTML: { type: ArgumentType.STRING, defaultValue: '<h1>Hello</h1>' }
            }
          },
          {
            opcode: 'closeOverlay',
            blockType: BlockType.COMMAND,
            text: '关闭覆盖窗口 [ID]',
            arguments: {
              ID: { type: ArgumentType.STRING, defaultValue: 'my-overlay' }
            }
          },
          {
            opcode: 'getOverlayIdList',
            blockType: BlockType.REPORTER,
            text: '获取所有覆盖窗口 ID (JSON)'
          },
          {
            opcode: 'isOverlayExist',
            blockType: BlockType.BOOLEAN,
            text: '覆盖窗口 [ID] 存在?',
            arguments: {
              ID: { type: ArgumentType.STRING, defaultValue: 'my-overlay' }
            }
          },
          {
            blockType: BlockType.LABEL,
            text: '🪟 高级窗口'
          },
          {
            opcode: 'createAdvancedWindow',
            blockType: BlockType.COMMAND,
            text: '创建高级窗口 [ID] 位置 [X] [Y] 大小 [W]x[H] 置顶? [TOP]',
            arguments: {
              ID: { type: ArgumentType.STRING, defaultValue: 'my-advanced' },
              X: { type: ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: ArgumentType.NUMBER, defaultValue: 0 },
              W: { type: ArgumentType.NUMBER, defaultValue: 500 },
              H: { type: ArgumentType.NUMBER, defaultValue: 400 },
              TOP: { type: ArgumentType.BOOLEAN, defaultValue: false }
            }
          },
          {
            opcode: 'setAdvancedWindowUrl',
            blockType: BlockType.COMMAND,
            text: '设置高级窗口 [ID] URL [URL]',
            arguments: {
              ID: { type: ArgumentType.STRING, defaultValue: 'my-advanced' },
              URL: { type: ArgumentType.STRING, defaultValue: 'https://example.com' }
            }
          },
          {
            opcode: 'closeAdvancedWindow',
            blockType: BlockType.COMMAND,
            text: '关闭高级窗口 [ID]',
            arguments: {
              ID: { type: ArgumentType.STRING, defaultValue: 'my-advanced' }
            }
          },
          {
            opcode: 'setWindowTopmost',
            blockType: BlockType.COMMAND,
            text: '窗口 [ID] 置顶 [TOP]',
            arguments: {
              ID: { type: ArgumentType.STRING, defaultValue: 'my-advanced' },
              TOP: { type: ArgumentType.BOOLEAN, defaultValue: true }
            }
          },
          {
            opcode: 'getAdvancedWindowIdList',
            blockType: BlockType.REPORTER,
            text: '获取所有高级窗口 ID (JSON)'
          },
          {
            opcode: 'isAdvancedWindowExist',
            blockType: BlockType.BOOLEAN,
            text: '高级窗口 [ID] 存在?',
            arguments: {
              ID: { type: ArgumentType.STRING, defaultValue: 'my-advanced' }
            }
          },
          "---",
          // ---- 屏幕捕获 ----
          {
            blockType: BlockType.LABEL,
            text: '📷 屏幕捕获'
          },
          {
            opcode: 'captureScreen',
            blockType: BlockType.REPORTER,
            text: '截取全屏'
          },
          {
            opcode: 'captureRegion',
            blockType: BlockType.REPORTER,
            text: '截取区域 [X] [Y] [W]x[H]',
            arguments: {
              X: { type: ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: ArgumentType.NUMBER, defaultValue: 0 },
              W: { type: ArgumentType.NUMBER, defaultValue: 800 },
              H: { type: ArgumentType.NUMBER, defaultValue: 600 }
            }
          },
          "---",
          // ---- 权限管理 ----
          {
            blockType: BlockType.LABEL,
            text: '🔐 权限管理'
          },
          {
            opcode: 'isCoreEnabled',
            blockType: BlockType.BOOLEAN,
            text: 'CYSOCore 已启用?'
          },
          {
            opcode: 'getPermissionStatus',
            blockType: BlockType.REPORTER,
            text: '权限 [PERM] 状态',
            arguments: {
              PERM: { type: ArgumentType.STRING, defaultValue: 'file-read' }
            }
          }
        ],
        menus: {
          systemPaths: {
            acceptReporters: true,
            items: [
              { text: '📂 桌面', value: 'desktop' },
              { text: '📄 文档', value: 'documents' },
              { text: '⬇️ 下载', value: 'downloads' },
              { text: '🎵 音乐', value: 'music' },
              { text: '🖼️ 图片', value: 'pictures' },
              { text: '🎬 视频', value: 'videos' },
              { text: '📦 AppData', value: 'appData' },
              { text: '📁 用户数据', value: 'userData' },
              { text: '📂 临时目录', value: 'temp' },
              { text: '💾 缓存', value: 'cache' },
              { text: '📄 日志', value: 'logs' },
              { text: '⚙️ 程序目录', value: 'exe' },
              { text: '🏠 用户主目录', value: 'home' }
            ]
          },
          fileInfoTypes: {
            acceptReporters: true,
            items: [
              { text: '📏 大小', value: 'size' },
              { text: '🕐 修改时间', value: 'modified' }
            ]
          },
          hardwareTypes: {
            acceptReporters: true,
            items: [
              { text: '💻 CPU 使用率', value: 'cpu-usage' },
              { text: '💻 CPU 型号', value: 'cpu-model' },
              { text: '💾 内存使用率', value: 'memory-usage' },
              { text: '💾 总内存', value: 'memory-total' },
              { text: '💾 可用内存', value: 'memory-free' },
              { text: '💿 磁盘使用率', value: 'disk-usage' },
              { text: '🌐 网络接口', value: 'network-interfaces' }
            ]
          }
        }
      };
    }

    // ========== 文件操作（无截断） ==========
    async readFile(args) {
      const result = await this._safeCall(EditorPreload.readFile, args.PATH);
      if (result.success) return result.content || '';
      return '❌ ' + (result.error || '读取失败');
    }

    async writeFile(args) {
      await this._safeCall(EditorPreload.writeFile, args.PATH, args.CONTENT);
    }

    async deleteFile(args) {
      await this._safeCall(EditorPreload.deleteFile, args.PATH);
    }

    async fileExists(args) {
      const result = await this._safeCall(EditorPreload.fileExists, args.PATH);
      return result.success && result.exists === true;
    }

    async getFileInfo(args) {
      const type = args.INFO || 'size';
      const result = await this._safeCall(EditorPreload.getFileStats, args.PATH);
      if (!result.success || !result.stats) return '❌ ' + (result.error || '获取失败');
      if (type === 'size') return this._formatSize(result.stats.size);
      if (type === 'modified') return this._formatTime(result.stats.modified);
      return '❌ 未知类型: ' + type;
    }

    async createFolder(args) {
      await this._safeCall(EditorPreload.createFolder, args.PATH);
    }

    async listFolder(args) {
      const result = await this._safeCall(EditorPreload.readLocalFolder, args.PATH);
      if (!result.success) return JSON.stringify({ error: result.error || '读取失败' });
      const files = result.files || [];
      const data = {
        path: args.PATH,
        count: files.length,
        files: files.map(f => ({
          name: f.name || '',
          path: f.path || '',
          isDirectory: f.isDirectory === true,
          size: f.size || 0,
          mtime: f.mtime || null
        }))
      };
      return JSON.stringify(data, null, 2);
    }

    // ========== 系统信息 ==========
    async getSystemPath(args) {
      const result = await this._safeCall(EditorPreload.getPath, args.NAME);
      if (result.success) return result.path || '';
      return '❌ ' + (result.error || '获取失败');
    }

    async getHardwareInfo(args) {
      const type = args.TYPE || 'cpu-usage';
      const drive = (args.DRIVE || 'C:').toUpperCase();
      try {
        let result;
        switch (type) {
          case 'cpu-usage':
          case 'cpu-model':
            result = await this._safeCall(EditorPreload.getHardwareStatus, 'cpu');
            if (!result.success) return '❌ ' + result.error;
            if (type === 'cpu-usage') return this._safeGet(result, 'data.usage', 0);
            return this._safeGet(result, 'data.model', '未知 CPU');
          case 'memory-usage':
          case 'memory-total':
          case 'memory-free':
            result = await this._safeCall(EditorPreload.getHardwareStatus, 'memory');
            if (!result.success) return '❌ ' + result.error;
            const total = this._safeGet(result, 'data.total', 0);
            const free = this._safeGet(result, 'data.free', 0);
            const usage = this._safeGet(result, 'data.usage', 0);
            if (type === 'memory-usage') return usage;
            if (type === 'memory-total') return total > 0 ? (total / 1073741824).toFixed(1) : '0';
            if (type === 'memory-free') return free > 0 ? (free / 1073741824).toFixed(1) : '0';
            return '未知';
          case 'disk-usage':
            result = await this._safeCall(EditorPreload.getHardwareStatus, 'disk');
            if (!result.success) return '❌ ' + result.error;
            const disks = result.data?.disks || [];
            const disk = disks.find(d => (d.drive || '').toUpperCase() === drive);
            if (!disk) return '❌ 未找到 ' + drive + ' 盘';
            const total2 = disk.total || 0, used = disk.used || 0, usage2 = disk.usage || 0;
            if (total2 === 0) return '无法获取磁盘信息';
            return drive + ' 已用 ' + usage2 + '% (' + this._formatSize(used) + ' / ' + this._formatSize(total2) + ')';
          case 'network-interfaces':
            result = await this._safeCall(EditorPreload.getHardwareStatus, 'network');
            if (!result.success) return '❌ ' + result.error;
            const interfaces = result.data?.interfaces || [];
            return interfaces.join(', ') || '(无网络接口)';
          default:
            return '❌ 未知硬件类型: ' + type;
        }
      } catch (e) {
        return '❌ 异常: ' + e.message;
      }
    }

    // ========== 系统交互 ==========
    async executeCommand(args) {
      const result = await this._safeCall(EditorPreload.executeCommand, args.CMD, { timeout: 15000 });
      if (result.success) {
        const output = result.stdout || result.stderr || '(无输出)';
        return output; // 完整输出，无截断
      }
      return '❌ ' + (result.error || '执行失败');
    }

    async showNotification(args) {
      await this._safeCall(EditorPreload.showNotification, {
        title: args.TITLE || 'CYSOCore 通知',
        body: args.BODY || '',
        silent: false
      });
    }

    // ========== 全局快捷键 ==========
    async registerShortcut(args) {
      const key = args.KEY || 'Ctrl+Shift+P';
      const eventName = args.EVENT || 'my-event';
      const result = await this._safeCall(EditorPreload.registerGlobalShortcut, key, eventName);
      if (result.success) this._shortcutEvents[key] = eventName;
    }

    async unregisterShortcut(args) {
      const key = args.KEY || 'Ctrl+Shift+P';
      const result = await this._safeCall(EditorPreload.unregisterGlobalShortcut, key);
      if (result.success) delete this._shortcutEvents[key];
    }

    shortcutTriggered(args) {
      const event = String((args && args.EVENT) || '').toUpperCase();
      if (event && this._shortcutPending[event] === true) {
        this._shortcutPending[event] = false;
        return true;
      }
      return false;
    }

    // ----- 快捷键查询：返回 { 事件名: 快捷键 } -----
    getShortcutEventList() {
      // 将 { key: event } 转换为 { event: key }
      const inverted = {};
      for (const [key, event] of Object.entries(this._shortcutEvents)) {
        inverted[event] = key;
      }
      return JSON.stringify(inverted);
    }

    isShortcutEventRegistered(args) {
      const event = args.EVENT || '';
      return Object.values(this._shortcutEvents).includes(event);
    }

    // ========== 覆盖窗口 ==========
    async createOverlay(args) {
      const id = args.ID || 'my-overlay';
      const x = Number(args.X) || 0, y = Number(args.Y) || 0, w = Number(args.W) || 300, h = Number(args.H) || 200;
      const result = await this._safeCall(EditorPreload.createOverlayWindow, id, x, y, w, h);
      if (result.success) this._windowCache[id] = { type: 'overlay', x, y, w, h };
    }

    async setOverlayProperties(args) {
      const id = args.ID || 'my-overlay';
      const x = Number(args.X) || 0, y = Number(args.Y) || 0, w = Number(args.W) || 300, h = Number(args.H) || 200;
      if (this._windowCache[id] && this._windowCache[id].type === 'overlay') {
        await this._safeCall(EditorPreload.closeOverlayWindow, id);
        delete this._windowCache[id];
      }
      const result = await this._safeCall(EditorPreload.createOverlayWindow, id, x, y, w, h);
      if (result.success) this._windowCache[id] = { type: 'overlay', x, y, w, h };
    }

    async setOverlayContent(args) {
      const id = args.ID || 'my-overlay';
      const html = args.HTML || '<h1>Hello</h1>';
      await this._safeCall(EditorPreload.setOverlayContent, id, html);
    }

    async closeOverlay(args) {
      const id = args.ID || 'my-overlay';
      const result = await this._safeCall(EditorPreload.closeOverlayWindow, id);
      if (result.success) delete this._windowCache[id];
    }

    // ----- 覆盖窗口查询 -----
    getOverlayIdList() {
      const ids = Object.keys(this._windowCache).filter(id => this._windowCache[id].type === 'overlay');
      return JSON.stringify(ids);
    }

    isOverlayExist(args) {
      const id = args.ID || '';
      return !!(this._windowCache[id] && this._windowCache[id].type === 'overlay');
    }

    // ========== 高级窗口 ==========
    async createAdvancedWindow(args) {
      const id = args.ID || 'my-advanced';
      const x = Number(args.X) || 0, y = Number(args.Y) || 0, w = Number(args.W) || 500, h = Number(args.H) || 400;
      const top = args.TOP === true || args.TOP === 'true';
      const result = await this._safeCall(EditorPreload.createAdvancedWindow, id, {
        x, y, width: w, height: h,
        alwaysOnTop: top,
        frameless: false,
        transparent: false
      });
      if (result.success) this._windowCache[id] = { type: 'advanced', x, y, w, h, top };
    }

    async setAdvancedWindowUrl(args) {
      const id = args.ID || 'my-advanced';
      const url = args.URL || 'https://example.com';
      if (this._windowCache[id] && this._windowCache[id].type === 'advanced') {
        await this._safeCall(EditorPreload.closeAdvancedWindow, id);
        delete this._windowCache[id];
      }
      const cache = this._windowCache[id] || { x: 0, y: 0, w: 500, h: 400, top: false };
      const result = await this._safeCall(EditorPreload.createAdvancedWindow, id, {
        x: cache.x, y: cache.y,
        width: cache.w, height: cache.h,
        alwaysOnTop: cache.top || false,
        frameless: false,
        transparent: false,
        url: url
      });
      if (result.success) this._windowCache[id] = { type: 'advanced', x: cache.x, y: cache.y, w: cache.w, h: cache.h, top: cache.top };
    }

    async closeAdvancedWindow(args) {
      const id = args.ID || 'my-advanced';
      const result = await this._safeCall(EditorPreload.closeAdvancedWindow, id);
      if (result.success) delete this._windowCache[id];
    }

    async setWindowTopmost(args) {
      const id = args.ID || 'my-advanced';
      const top = args.TOP === true || args.TOP === 'true';
      const result = await this._safeCall(EditorPreload.setWindowProperty, id, 'alwaysOnTop', top);
      if (result.success && this._windowCache[id]) this._windowCache[id].top = top;
    }

    // ----- 高级窗口查询 -----
    getAdvancedWindowIdList() {
      const ids = Object.keys(this._windowCache).filter(id => this._windowCache[id].type === 'advanced');
      return JSON.stringify(ids);
    }

    isAdvancedWindowExist(args) {
      const id = args.ID || '';
      return !!(this._windowCache[id] && this._windowCache[id].type === 'advanced');
    }

    // ========== 屏幕捕获 ==========
    async captureScreen() {
      const result = await this._safeCall(EditorPreload.captureScreen, 'screen');
      if (result.success && result.dataUrl) return result.dataUrl;
      return '❌ ' + (result.error || '截屏失败');
    }

    async captureRegion(args) {
      const x = Number(args.X) || 0, y = Number(args.Y) || 0, w = Number(args.W) || 800, h = Number(args.H) || 600;
      const result = await this._safeCall(EditorPreload.captureRegion, x, y, w, h);
      if (result.success && result.dataUrl) return result.dataUrl;
      return '❌ ' + (result.error || '截屏失败');
    }

    // ========== 权限 ==========
    async isCoreEnabled() {
      if (!this._isDesktop) return false;
      try { return await EditorPreload.getCYSOCoreEnabled() === true; } catch (_) { return false; }
    }

    async getPermissionStatus(args) {
      const perm = args.PERM || 'file-read';
      try {
        const status = await EditorPreload.checkPermission(this._extensionId, perm);
        if (status && status.action) return status.action;
        return '未知';
      } catch (e) {
        return '❌ ' + e.message;
      }
    }

    // ========== 生命周期 ==========
    onEnable() {
      if (this._isDesktop) this._setupShortcutListener();
    }

    onDisable() {
      this._cleanupShortcutListener();
      if (this._isDesktop) this._unregisterAllShortcuts();
      this._cleanupWindows();
    }

    // ========== 内部辅助 ==========
    _setupShortcutListener() {
      if (this._shortcutListenerSetup) return;
      const handler = (data) => {
        const detail = data && data.detail ? data.detail : (data || {});
        const eventName = detail.eventName || '';
        if (!eventName) return;
        const eventKey = String(eventName).toUpperCase();
        this._shortcutPending[eventKey] = true;
        if (window.Scratch && window.Scratch.vm) {
          try { this._triggerHatBlock(eventKey); } catch (_) { this._shortcutPending[eventKey] = false; }
        } else {
          setTimeout(() => {
            if (window.Scratch && window.Scratch.vm) this._triggerHatBlock(eventKey);
            else this._shortcutPending[eventKey] = false;
          }, 100);
        }
      };
      if (typeof EditorPreload !== 'undefined' && typeof EditorPreload.onShortcutTriggered === 'function') {
        EditorPreload.onShortcutTriggered(handler);
        this._shortcutListenerSetup = true;
      } else {
        const domHandler = (event) => handler(event.detail || {});
        window.addEventListener('global-shortcut-triggered', domHandler);
        this._shortcutHandler = domHandler;
        this._shortcutListenerSetup = true;
      }
    }

    _triggerHatBlock(eventName) {
      try {
        const vm = window.Scratch?.vm || (typeof Scratch !== 'undefined' && Scratch.vm);
        if (!vm || !vm.runtime) return;
        const runtime = vm.runtime;
        const hats = runtime._hats || {};
        const hatKey = Object.keys(hats).find(k => k.endsWith('_shortcutTriggered'));
        if (!hatKey) return;
        const threads = runtime.startHats(hatKey, {});
        if (!threads || threads.length === 0) this._shortcutPending[eventName] = false;
      } catch (_) { this._shortcutPending[eventName] = false; }
    }

    _cleanupShortcutListener() {
      if (this._shortcutHandler) {
        window.removeEventListener('global-shortcut-triggered', this._shortcutHandler);
        this._shortcutHandler = null;
      }
      this._shortcutPending = {};
      this._shortcutListenerSetup = false;
    }

    async _unregisterAllShortcuts() {
      if (!this._isDesktop) return;
      const keys = Object.keys(this._shortcutEvents);
      for (let i = 0; i < keys.length; i++) {
        try { await EditorPreload.unregisterGlobalShortcut(keys[i]); } catch (_) {}
      }
      this._shortcutEvents = {};
    }

    async _cleanupWindows() {
      const ids = Object.keys(this._windowCache);
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        try {
          const info = this._windowCache[id];
          if (info.type === 'overlay') await EditorPreload.closeOverlayWindow(id);
          else if (info.type === 'advanced') await EditorPreload.closeAdvancedWindow(id);
        } catch (_) {}
      }
      this._windowCache = {};
    }
  }

  Scratch.extensions.register(new CYSOCorePowerToolkit());
})(Scratch);