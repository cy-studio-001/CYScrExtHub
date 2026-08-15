// ============================================================
//  CYSOCore 全能工具包 (CYSOCore Power Toolkit)
//  版本: 1.0.0
//  说明: 官方权限使用工具 - 包含所有 CYSOCore API 功能
//  适用: CYSOEditor 桌面版 (Electron)
//  更新: 修复快捷键多实例触发错误，优化代码逻辑
// ============================================================

class CYSOCorePowerToolkit {
    // ============================================================
    // 构造函数
    // ============================================================
    constructor() {
        this.isDesktop = typeof EditorPreload !== 'undefined';
        this.windowCache = {};
        this._shortcutPending = {};           // 待触发的快捷键事件
        this._shortcutEvents = {};            // 已注册的快捷键映射
        this._shortcutListenerSetup = false;
        this._shortcutHandler = null;
        this.monitorInterval = null;
        this.monitorWindowId = 'power-toolkit-monitor';

        // 原点模式：'top-left' 或 'center'
        this.originMode = 'top-left';

        // 屏幕尺寸（缓存，在桌面版环境中获取）
        this.screenWidth = 0;
        this.screenHeight = 0;

        if (this.isDesktop) {
            try {
                this.screenWidth = window.screen.width;
                this.screenHeight = window.screen.height;
                console.log(`🖥️ 屏幕尺寸: ${this.screenWidth}x${this.screenHeight}`);
            } catch (e) {
                console.warn('⚠️ 无法获取屏幕尺寸，使用默认值 1920x1080');
                this.screenWidth = 1920;
                this.screenHeight = 1080;
            }
            console.log('🛠️ CYSOCore 全能工具包已加载 (桌面版)');
            this._setupShortcutListener();
        } else {
            console.warn('⚠️ 当前不在桌面版环境中，部分功能将不可用');
        }
    }

    // ============================================================
    // getInfo()
    // ============================================================
    getInfo() {
        return {
            id: 'cysocorePowerToolkit',
            name: '🛠️ CYSOCore 全能工具包',
            color1: '#6A1B9A',
            color2: '#8E24AA',
            color3: '#AB47BC',

            permissions: [
                'file-read',
                'file-write',
                'file-delete',
                'file-metadata',
                'system-command',
                'global-shortcut',
                'draw-window',
                'screen-capture',
                'advanced-window',
                'hardware-status'
            ],

            blocks: [
                // ==========================================================
                // 1. 文件操作组
                // ==========================================================
                {
                    opcode: 'readFile',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[📄] 读取文件 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\notes.txt'
                        }
                    }
                },
                {
                    opcode: 'writeFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[📄] 写入文件 [PATH] 内容 [CONTENT]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\output.txt'
                        },
                        CONTENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Hello CYSOCore!'
                        }
                    }
                },
                {
                    opcode: 'deleteFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[📄] 删除文件 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\temp.txt'
                        }
                    }
                },
                {
                    opcode: 'fileExists',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '[📄] 文件存在? [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\config.json'
                        }
                    }
                },
                {
                    opcode: 'getFileInfo',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[📄] 文件 [INFO] [PATH]',
                    arguments: {
                        INFO: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'fileInfoTypes',
                            defaultValue: 'size'
                        },
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\notes.txt'
                        }
                    }
                },
                {
                    opcode: 'createFolder',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[📁] 创建文件夹 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\新建文件夹'
                        }
                    }
                },
                {
                    opcode: 'listFolder',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[📁] 列出文件夹 [PATH] (JSON)',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%'
                        }
                    }
                },

                null, // 分割线

                // ==========================================================
                // 2. 系统信息组
                // ==========================================================
                {
                    opcode: 'getSystemPath',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[📍] 获取系统路径 [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'systemPaths',
                            defaultValue: 'desktop'
                        }
                    }
                },
                {
                    opcode: 'getHardwareInfo',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[💻] 硬件 [TYPE] 驱动器 [DRIVE]',
                    arguments: {
                        TYPE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'hardwareTypes',
                            defaultValue: 'cpu-usage'
                        },
                        DRIVE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'C:'
                        }
                    }
                },

                null, // 分割线

                // ==========================================================
                // 3. 系统交互组
                // ==========================================================
                {
                    opcode: 'executeCommand',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[⚡] 执行命令 [CMD]',
                    arguments: {
                        CMD: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'echo Hello'
                        }
                    }
                },
                {
                    opcode: 'showNotification',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[🔔] 显示通知 [TITLE] 内容 [BODY]',
                    arguments: {
                        TITLE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'CYSOCore 通知'
                        },
                        BODY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '这是一条系统通知'
                        }
                    }
                },

                null, // 分割线

                // ==========================================================
                // 4. 全局快捷键组
                // ==========================================================
                {
                    opcode: 'registerShortcut',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[⌨️] 注册快捷键 [KEY] 事件名 [EVENT]',
                    arguments: {
                        KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Ctrl+Shift+P'
                        },
                        EVENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'my-event'
                        }
                    }
                },
                {
                    opcode: 'unregisterShortcut',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[⌨️] 注销快捷键 [KEY]',
                    arguments: {
                        KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Ctrl+Shift+P'
                        }
                    }
                },
                {
                    opcode: 'shortcutTriggered',
                    blockType: Scratch.BlockType.HAT,
                    isEdgeActivated: false,
                    shouldRestartExistingThreads: true,
                    text: '[⌨️] 当快捷键 [EVENT] 触发',
                    arguments: {
                        EVENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'my-event'
                        }
                    }
                },

                null, // 分割线

                // ==========================================================
                // 5. 窗口组
                // ==========================================================
                {
                    opcode: 'setWindowOrigin',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[🪟] 窗口原点模式 [MODE]',
                    arguments: {
                        MODE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'originModes',
                            defaultValue: 'top-left'
                        }
                    }
                },
                {
                    opcode: 'createOverlay',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[🪟] 创建覆盖窗口 [ID] 位置 [X] [Y] 大小 [W]x[H]',
                    arguments: {
                        ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'my-overlay'
                        },
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        W: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 300
                        },
                        H: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 200
                        }
                    }
                },
                {
                    opcode: 'setOverlayProperties',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[🪟] 设置覆盖窗口 [ID] 位置 [X] [Y] 大小 [W]x[H]',
                    arguments: {
                        ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'my-overlay'
                        },
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        W: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 300
                        },
                        H: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 200
                        }
                    }
                },
                {
                    opcode: 'setOverlayContent',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[🪟] 设置覆盖窗口 [ID] 内容 [HTML]',
                    arguments: {
                        ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'my-overlay'
                        },
                        HTML: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '<h1>Hello</h1>'
                        }
                    }
                },
                {
                    opcode: 'closeOverlay',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[🪟] 关闭覆盖窗口 [ID]',
                    arguments: {
                        ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'my-overlay'
                        }
                    }
                },
                {
                    opcode: 'createAdvancedWindow',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[🪟] 创建高级窗口 [ID] 位置 [X] [Y] 大小 [W]x[H] 置顶? [TOP]',
                    arguments: {
                        ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'my-advanced'
                        },
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        W: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 500
                        },
                        H: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 400
                        },
                        TOP: {
                            type: Scratch.ArgumentType.BOOLEAN,
                            defaultValue: false
                        }
                    }
                },
                {
                    opcode: 'setAdvancedWindowUrl',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[🪟] 设置高级窗口 [ID] URL [URL]',
                    arguments: {
                        ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'my-advanced'
                        },
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://example.com'
                        }
                    }
                },
                {
                    opcode: 'closeAdvancedWindow',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[🪟] 关闭高级窗口 [ID]',
                    arguments: {
                        ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'my-advanced'
                        }
                    }
                },
                {
                    opcode: 'setWindowTopmost',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '[🪟] 窗口 [ID] 置顶 [TOP]',
                    arguments: {
                        ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'my-advanced'
                        },
                        TOP: {
                            type: Scratch.ArgumentType.BOOLEAN,
                            defaultValue: true
                        }
                    }
                },

                null, // 分割线

                // ==========================================================
                // 6. 屏幕捕获与权限
                // ==========================================================
                {
                    opcode: 'captureScreen',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[📷] 截取全屏'
                },
                {
                    opcode: 'captureRegion',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[📷] 截取区域 [X] [Y] [W]x[H]',
                    arguments: {
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        W: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 800
                        },
                        H: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 600
                        }
                    }
                },
                {
                    opcode: 'isCoreEnabled',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '[🔐] CYSOCore 已启用?'
                }
            ],

            // ----- 菜单定义 -----
            menus: {
                systemPaths: {
                    acceptReporters: true,
                    items: [
                        { text: '📂 桌面', value: 'desktop' },
                        { text: '📄 文档', value: 'documents' },
                        { text: '⬇️ 下载', value: 'downloads' },
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
                        { text: '💿 磁盘使用率', value: 'disk-usage' }
                    ]
                },
                originModes: {
                    acceptReporters: false,
                    items: [
                        { text: '↖️ 左上角', value: 'top-left' },
                        { text: '🎯 屏幕中心', value: 'center' }
                    ]
                }
            }
        };
    }

    // ============================================================
    // 工具方法
    // ============================================================

    _checkDesktop() {
        if (!this.isDesktop) {
            return '❌ 此功能需要 CYSOEditor 桌面版';
        }
        return null;
    }

    async _safeCall(method, ...args) {
        const error = this._checkDesktop();
        if (error) return { success: false, error };
        try {
            return await method(...args);
        } catch (e) {
            console.error('❌ API 调用异常:', e);
            return { success: false, error: `异常: ${e.message}` };
        }
    }

    _transformPosition(x, y) {
        if (this.originMode === 'center') {
            const cx = this.screenWidth / 2;
            const cy = this.screenHeight / 2;
            return { x: cx + x, y: cy + y };
        }
        return { x, y };
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
        try {
            const date = new Date(isoString);
            return date.toLocaleString('zh-CN');
        } catch {
            return isoString;
        }
    }

    _safeGet(result, path, fallback = '') {
        if (!result || !result.success) return fallback;
        let current = result;
        for (const key of path.split('.')) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return fallback;
            }
        }
        return current !== undefined ? current : fallback;
    }

    // ============================================================
    // 1. 文件操作
    // ============================================================

    async readFile(args) {
        const error = this._checkDesktop();
        if (error) return error;
        const result = await this._safeCall(EditorPreload.readFile, args.PATH);
        if (result.success) {
            let content = result.content || '';
            if (content.length > 10000) {
                content = content.substring(0, 10000) + '\n... (内容过长，已截断)';
            }
            return content;
        }
        return `❌ ${result.error || '读取失败'}`;
    }

    async writeFile(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }
        const result = await this._safeCall(EditorPreload.writeFile, args.PATH, args.CONTENT);
        if (result.success) {
            console.log(`✅ 文件已写入: ${args.PATH}`);
        } else {
            console.error(`❌ 写入失败: ${result.error}`);
        }
    }

    async deleteFile(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }
        const result = await this._safeCall(EditorPreload.deleteFile, args.PATH);
        if (result.success) {
            console.log(`🗑️ 文件已删除: ${args.PATH}`);
        } else {
            console.error(`❌ 删除失败: ${result.error}`);
        }
    }

    async fileExists(args) {
        const error = this._checkDesktop();
        if (error) return false;
        const result = await this._safeCall(EditorPreload.fileExists, args.PATH);
        return result.success && result.exists === true;
    }

    async getFileInfo(args) {
        const error = this._checkDesktop();
        if (error) return error;
        const infoType = args.INFO || 'size';
        const result = await this._safeCall(EditorPreload.getFileStats, args.PATH);
        if (!result.success || !result.stats) {
            return `❌ ${result.error || '获取失败'}`;
        }
        if (infoType === 'size') {
            return this._formatSize(result.stats.size);
        } else if (infoType === 'modified') {
            return this._formatTime(result.stats.modified);
        }
        return `❌ 未知类型: ${infoType}`;
    }

    async createFolder(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }
        const result = await this._safeCall(EditorPreload.createFolder, args.PATH);
        if (result.success) {
            console.log(`📁 文件夹已创建: ${args.PATH}`);
        } else {
            console.error(`❌ 创建文件夹失败: ${result.error}`);
        }
    }

    async listFolder(args) {
        const error = this._checkDesktop();
        if (error) return error;
        const result = await this._safeCall(EditorPreload.readLocalFolder, args.PATH);
        if (!result.success) {
            return JSON.stringify({ error: result.error || '读取失败' });
        }
        const files = result.files || [];
        const data = {
            path: args.PATH,
            count: files.length,
            files: files.map(file => ({
                name: file.name || '',
                path: file.path || '',
                isDirectory: file.isDirectory === true,
                size: file.size || 0,
                mtime: file.mtime || null
            }))
        };
        return JSON.stringify(data, null, 2);
    }

    // ============================================================
    // 2. 系统路径
    // ============================================================

    async getSystemPath(args) {
        const error = this._checkDesktop();
        if (error) return error;
        const result = await this._safeCall(EditorPreload.getPath, args.NAME);
        if (result.success) {
            return result.path || '';
        }
        return `❌ ${result.error || '获取失败'}`;
    }

    // ============================================================
    // 3. 硬件状态
    // ============================================================

    async getHardwareInfo(args) {
        const error = this._checkDesktop();
        if (error) return error;
        const type = args.TYPE || 'cpu-usage';
        const drive = (args.DRIVE || 'C:').toUpperCase();
        try {
            let result;
            switch (type) {
                case 'cpu-usage':
                case 'cpu-model': {
                    result = await this._safeCall(EditorPreload.getHardwareStatus, 'cpu');
                    if (!result.success) return `❌ ${result.error}`;
                    if (type === 'cpu-usage') return this._safeGet(result, 'data.usage', 0);
                    return this._safeGet(result, 'data.model', '未知 CPU');
                }
                case 'memory-usage':
                case 'memory-total':
                case 'memory-free': {
                    result = await this._safeCall(EditorPreload.getHardwareStatus, 'memory');
                    if (!result.success) return `❌ ${result.error}`;
                    const total = this._safeGet(result, 'data.total', 0);
                    const free = this._safeGet(result, 'data.free', 0);
                    const usage = this._safeGet(result, 'data.usage', 0);
                    if (type === 'memory-usage') return usage;
                    if (type === 'memory-total') {
                        return total > 0 ? (total / 1073741824).toFixed(1) : '0';
                    }
                    if (type === 'memory-free') {
                        return free > 0 ? (free / 1073741824).toFixed(1) : '0';
                    }
                    return '未知';
                }
                case 'disk-usage': {
                    result = await this._safeCall(EditorPreload.getHardwareStatus, 'disk');
                    if (!result.success) return `❌ ${result.error}`;
                    const disks = result.data?.disks || [];
                    const disk = disks.find(d => (d.drive || '').toUpperCase() === drive);
                    if (!disk) return `❌ 未找到 ${drive} 盘`;
                    const total = disk.total || 0;
                    const used = disk.used || 0;
                    const usage = disk.usage || 0;
                    if (total === 0) return '无法获取磁盘信息';
                    return `${drive} 已用 ${usage}% (${this._formatSize(used)} / ${this._formatSize(total)})`;
                }
                default:
                    return `❌ 未知硬件类型: ${type}`;
            }
        } catch (e) {
            return `❌ 异常: ${e.message}`;
        }
    }

    // ============================================================
    // 4. 系统命令
    // ============================================================

    async executeCommand(args) {
        const error = this._checkDesktop();
        if (error) return error;
        console.warn('⚠️ 执行系统命令，请确保命令安全:', args.CMD);
        const result = await this._safeCall(EditorPreload.executeCommand, args.CMD, { timeout: 15000 });
        if (result.success) {
            let output = result.stdout || result.stderr || '(无输出)';
            if (output.length > 5000) {
                output = output.substring(0, 5000) + '\n... (输出过长，已截断)';
            }
            return output;
        }
        return `❌ ${result.error || '执行失败'}`;
    }

    // ============================================================
    // 5. 通知
    // ============================================================

    async showNotification(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }
        await this._safeCall(EditorPreload.showNotification, {
            title: args.TITLE || 'CYSOCore 通知',
            body: args.BODY || '',
            silent: false
        });
    }

    // ============================================================
    // 6. 全局快捷键 (修复版)
    // ============================================================

    /**
     * 注册全局快捷键
     * @param {Object} args - { KEY: 'Ctrl+Shift+P', EVENT: 'my-event' }
     */
    async registerShortcut(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }

        const key = args.KEY || 'Ctrl+Shift+P';
        const eventName = args.EVENT || 'my-event';

        // 检查是否已注册相同的快捷键
        if (this._shortcutEvents && this._shortcutEvents[key]) {
            console.warn(`⚠️ 快捷键 ${key} 已注册为事件 "${this._shortcutEvents[key]}"，将覆盖`);
        }

        const result = await this._safeCall(EditorPreload.registerGlobalShortcut, key, eventName);
        if (result.success) {
            console.log(`⌨️ 快捷键已注册: ${key} → ${eventName}`);
            if (!this._shortcutEvents) this._shortcutEvents = {};
            this._shortcutEvents[key] = eventName;
        } else {
            console.error(`❌ 注册快捷键失败: ${result.error}`);
        }
    }

    /**
     * 注销全局快捷键
     */
    async unregisterShortcut(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }

        const key = args.KEY || 'Ctrl+Shift+P';
        const result = await this._safeCall(EditorPreload.unregisterGlobalShortcut, key);
        if (result.success) {
            console.log(`⌨️ 快捷键已注销: ${key}`);
            if (this._shortcutEvents) {
                delete this._shortcutEvents[key];
            }
        } else {
            console.error(`❌ 注销快捷键失败: ${result.error}`);
        }
    }

    /**
     * 帽子积木：当快捷键触发时执行
     * 
     * 【修复说明】
     * 原问题：多个快捷键时，触发第二个会错误地触发第一个。
     * 原因：旧版 shortcutTriggered 中存在 fallback 逻辑，会匹配任意待触发事件。
     * 修复：移除 fallback 逻辑，仅精确匹配当前帽子积木的 EVENT 参数。
     * 
     * 现在每个帽子积木实例只响应其 EVENT 参数对应的事件。
     */
    shortcutTriggered(args) {
        // 从参数中获取当前帽子积木的 EVENT 值（由 Scratch 框架传入）
        const event = String((args && args.EVENT) || '').toUpperCase();

        // 精确匹配：只有 pending 状态中对应的 event 为 true 时才触发
        if (event && this._shortcutPending[event] === true) {
            // 消费该事件，避免重复触发
            this._shortcutPending[event] = false;
            console.log(`⌨️ ✅ 执行帽子积木: EVENT="${event}"`);
            return true;
        }

        // 不匹配，不触发
        return false;
    }

    // ============================================================
    // 7. 窗口原点
    // ============================================================

    setWindowOrigin(args) {
        const mode = args.MODE || 'top-left';
        if (mode === 'center' || mode === 'top-left') {
            this.originMode = mode;
            console.log(`🪟 窗口原点模式已切换为: ${mode === 'center' ? '屏幕中心' : '左上角'}`);
        } else {
            console.warn(`⚠️ 未知原点模式: ${mode}，保持当前模式`);
        }
    }

    // ============================================================
    // 8. 覆盖窗口
    // ============================================================

    async createOverlay(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }
        const id = args.ID || 'my-overlay';
        let x = Number(args.X) || 0;
        let y = Number(args.Y) || 0;
        const w = Number(args.W) || 300;
        const h = Number(args.H) || 200;
        const pos = this._transformPosition(x, y);
        const result = await this._safeCall(EditorPreload.createOverlayWindow, id, pos.x, pos.y, w, h);
        if (result.success) {
            console.log(`🪟 覆盖窗口已创建: ${id} (原点模式: ${this.originMode})`);
            this.windowCache[id] = { type: 'overlay', x: pos.x, y: pos.y, w, h };
        } else {
            console.error(`❌ 创建覆盖窗口失败: ${result.error}`);
        }
    }

    async setOverlayProperties(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }
        const id = args.ID || 'my-overlay';
        let x = Number(args.X) || 0;
        let y = Number(args.Y) || 0;
        const w = Number(args.W) || 300;
        const h = Number(args.H) || 200;
        const pos = this._transformPosition(x, y);
        if (this.windowCache[id] && this.windowCache[id].type === 'overlay') {
            await this._safeCall(EditorPreload.closeOverlayWindow, id);
            delete this.windowCache[id];
        }
        const result = await this._safeCall(EditorPreload.createOverlayWindow, id, pos.x, pos.y, w, h);
        if (result.success) {
            console.log(`🪟 覆盖窗口已更新: ${id} (位置 ${pos.x},${pos.y} 大小 ${w}x${h})`);
            this.windowCache[id] = { type: 'overlay', x: pos.x, y: pos.y, w, h };
        } else {
            console.error(`❌ 更新覆盖窗口失败: ${result.error}`);
        }
    }

    async setOverlayContent(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }
        const id = args.ID || 'my-overlay';
        const html = args.HTML || '<h1>Hello</h1>';
        const result = await this._safeCall(EditorPreload.setOverlayContent, id, html);
        if (result.success) {
            console.log(`🪟 覆盖窗口内容已更新: ${id}`);
        } else {
            console.error(`❌ 设置覆盖窗口内容失败: ${result.error}`);
        }
    }

    async closeOverlay(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }
        const id = args.ID || 'my-overlay';
        const result = await this._safeCall(EditorPreload.closeOverlayWindow, id);
        if (result.success) {
            console.log(`🪟 覆盖窗口已关闭: ${id}`);
            delete this.windowCache[id];
        } else {
            console.error(`❌ 关闭覆盖窗口失败: ${result.error}`);
        }
    }

    // ============================================================
    // 9. 高级窗口
    // ============================================================

    async createAdvancedWindow(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }
        const id = args.ID || 'my-advanced';
        let x = Number(args.X) || 0;
        let y = Number(args.Y) || 0;
        const w = Number(args.W) || 500;
        const h = Number(args.H) || 400;
        const top = args.TOP === true || args.TOP === 'true';
        const pos = this._transformPosition(x, y);
        const result = await this._safeCall(EditorPreload.createAdvancedWindow, id, {
            x: pos.x,
            y: pos.y,
            width: w,
            height: h,
            alwaysOnTop: top,
            frameless: false,
            transparent: false
        });
        if (result.success) {
            console.log(`🪟 高级窗口已创建: ${id} (原点模式: ${this.originMode})`);
            this.windowCache[id] = { type: 'advanced', x: pos.x, y: pos.y, w, h, top };
        } else {
            console.error(`❌ 创建高级窗口失败: ${result.error}`);
        }
    }

    async setAdvancedWindowUrl(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }
        const id = args.ID || 'my-advanced';
        const url = args.URL || 'https://example.com';
        if (this.windowCache[id] && this.windowCache[id].type === 'advanced') {
            await this._safeCall(EditorPreload.closeAdvancedWindow, id);
            delete this.windowCache[id];
        }
        const cache = this.windowCache[id] || { x: 0, y: 0, w: 500, h: 400, top: false };
        const pos = this._transformPosition(cache.x, cache.y);
        const result = await this._safeCall(EditorPreload.createAdvancedWindow, id, {
            x: pos.x,
            y: pos.y,
            width: cache.w,
            height: cache.h,
            alwaysOnTop: cache.top || false,
            frameless: false,
            transparent: false,
            url: url
        });
        if (result.success) {
            console.log(`🪟 高级窗口 URL 已更新: ${id} → ${url}`);
            this.windowCache[id] = { type: 'advanced', x: pos.x, y: pos.y, w: cache.w, h: cache.h, top: cache.top };
        } else {
            console.error(`❌ 更新高级窗口 URL 失败: ${result.error}`);
        }
    }

    async closeAdvancedWindow(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }
        const id = args.ID || 'my-advanced';
        const result = await this._safeCall(EditorPreload.closeAdvancedWindow, id);
        if (result.success) {
            console.log(`🪟 高级窗口已关闭: ${id}`);
            delete this.windowCache[id];
        } else {
            console.error(`❌ 关闭高级窗口失败: ${result.error}`);
        }
    }

    async setWindowTopmost(args) {
        const error = this._checkDesktop();
        if (error) { console.error(error); return; }
        const id = args.ID || 'my-advanced';
        const top = args.TOP === true || args.TOP === 'true';
        const result = await this._safeCall(EditorPreload.setWindowProperty, id, 'alwaysOnTop', top);
        if (result.success) {
            console.log(`🪟 窗口 ${id} 置顶已设置为: ${top}`);
            if (this.windowCache[id]) {
                this.windowCache[id].top = top;
            }
        } else {
            console.error(`❌ 设置窗口属性失败: ${result.error}`);
        }
    }

    // ============================================================
    // 10. 屏幕捕获
    // ============================================================

    async captureScreen() {
        const error = this._checkDesktop();
        if (error) return error;
        const result = await this._safeCall(EditorPreload.captureScreen, 'screen');
        if (result.success && result.dataUrl) {
            return result.dataUrl;
        }
        return `❌ ${result.error || '截屏失败'}`;
    }

    async captureRegion(args) {
        const error = this._checkDesktop();
        if (error) return error;
        let x = Number(args.X) || 0;
        let y = Number(args.Y) || 0;
        const w = Number(args.W) || 800;
        const h = Number(args.H) || 600;
        const pos = this._transformPosition(x, y);
        const result = await this._safeCall(EditorPreload.captureRegion, pos.x, pos.y, w, h);
        if (result.success && result.dataUrl) {
            return result.dataUrl;
        }
        return `❌ ${result.error || '截屏失败'}`;
    }

    // ============================================================
    // 11. 权限
    // ============================================================

    async isCoreEnabled() {
        const error = this._checkDesktop();
        if (error) return false;
        try {
            return await EditorPreload.getCYSOCoreEnabled() === true;
        } catch (e) {
            console.error(`❌ 获取 CYSOCore 状态失败: ${e.message}`);
            return false;
        }
    }

    // ============================================================
    // 生命周期
    // ============================================================

    onEnable() {
        console.log('🛠️ CYSOCore 全能工具包已启用');
        if (this.isDesktop) {
            this._setupShortcutListener();
        }
    }

    onDisable() {
        console.log('🛠️ CYSOCore 全能工具包已禁用');
        if (this.isDesktop) {
            this._cleanupShortcutListener();
        }
        this._cleanupWindows();
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
    }

    // ============================================================
    // 内部辅助
    // ============================================================

    /**
     * 设置快捷键事件监听（内部使用）
     * 监听 EditorPreload 的快捷键触发事件，然后触发对应的帽子积木
     */
    _setupShortcutListener() {
        if (this._shortcutListenerSetup) return;

        // 核心处理器：当快捷键被触发时，设置 pending 状态并启动帽子积木
        const handler = (data) => {
            // 兼容两种事件格式：DOM 事件（detail）和直接回调（{ key, eventName }）
            const detail = data && data.detail ? data.detail : (data || {});
            const eventName = detail.eventName || '';
            const key = detail.key || '';

            if (!eventName) {
                console.warn('⌨️ 快捷键触发但缺少 eventName:', data);
                return;
            }

            console.log(`⌨️ 快捷键触发: ${key} → ${eventName}`);

            // 设置 pending 状态（转为大写以便不区分大小写匹配）
            const eventKey = String(eventName).toUpperCase();
            this._shortcutPending[eventKey] = true;

            // 通过 Scratch VM 启动匹配的帽子积木
            if (window.Scratch && window.Scratch.vm) {
                try {
                    this._triggerHatBlock(eventKey);
                } catch (e) {
                    console.error('❌ 触发快捷键帽子积木异常:', e);
                    // 异常时清除 pending 状态，避免残留
                    this._shortcutPending[eventKey] = false;
                }
            } else {
                console.warn('⚠️ Scratch.vm 尚未就绪，无法触发帽子积木');
                // VM 未就绪时延迟重试一次
                setTimeout(() => {
                    if (window.Scratch && window.Scratch.vm) {
                        this._triggerHatBlock(eventKey);
                    } else {
                        console.warn('⚠️ Scratch.vm 仍然不可用，放弃触发');
                        this._shortcutPending[eventKey] = false;
                    }
                }, 100);
            }
        };

        // 优先使用 EditorPreload.onShortcutTriggered（IPC 方式，最可靠）
        if (typeof EditorPreload !== 'undefined' && typeof EditorPreload.onShortcutTriggered === 'function') {
            EditorPreload.onShortcutTriggered(handler);
            this._shortcutListenerSetup = true;
            console.log('⌨️ 快捷键监听已启动 (onShortcutTriggered)');
        } else {
            // 降级方案：监听 DOM 事件（由 preload 派发）
            const domHandler = (event) => {
                // 从 DOM 事件中提取 detail
                const detail = event.detail || {};
                handler(detail);
            };
            window.addEventListener('global-shortcut-triggered', domHandler);
            this._shortcutHandler = domHandler;
            this._shortcutListenerSetup = true;
            console.log('⌨️ 快捷键监听已启动 (window 事件)');
        }
    }

    /**
     * 触发匹配的帽子积木（内部使用）
     * 通过 Scratch VM 的 startHats 方法启动所有匹配的帽子积木实例
     * 每个帽子积木实例的 shortcutTriggered 方法会检查 event 是否匹配
     */
    _triggerHatBlock(eventName) {
        try {
            const vm = window.Scratch?.vm || (typeof Scratch !== 'undefined' && Scratch.vm);
            if (!vm || !vm.runtime) {
                console.warn('⚠️ 找不到 Scratch.vm，无法触发帽子积木');
                return;
            }

            const runtime = vm.runtime;
            // 查找所有注册的帽子积木，找到 opcode 为 'shortcutTriggered' 的
            const hats = runtime._hats || {};
            // 精确匹配：查找以 _shortcutTriggered 结尾的 key（Scratch 会为每个扩展生成唯一 key）
            const hatKey = Object.keys(hats).find(k => k.endsWith('_shortcutTriggered'));

            if (!hatKey) {
                console.warn('⚠️ 未找到快捷键帽子积木 (shortcutTriggered)');
                return;
            }

            // 启动所有匹配的帽子积木
            // 注意：startHats 会为每个匹配的帽子积木实例创建一个线程
            // 每个线程都会调用 shortcutTriggered 方法，由该方法决定是否真正执行
            const threads = runtime.startHats(hatKey, {});
            console.log(`⌨️ 已启动快捷键帽子线程: ${(threads && threads.length) || 0} (key=${hatKey})`);

            // 如果没有线程被启动，说明没有匹配的帽子积木实例，清除 pending 状态
            if (!threads || threads.length === 0) {
                console.warn(`⌨️ 没有找到匹配事件 "${eventName}" 的帽子积木`);
                this._shortcutPending[eventName] = false;
            }

            // 注意：pending 状态会在 shortcutTriggered 方法中被消费
            // 如果因为某些原因没有被消费，可能会残留，但下次触发时会覆盖

        } catch (e) {
            console.error('❌ 触发快捷键帽子积木异常:', e);
            // 发生异常时清除 pending 状态，防止阻塞后续触发
            this._shortcutPending[eventName] = false;
        }
    }

    _cleanupShortcutListener() {
        if (this._shortcutHandler) {
            window.removeEventListener('global-shortcut-triggered', this._shortcutHandler);
            this._shortcutHandler = null;
        }
        // 清理 pending 状态
        this._shortcutPending = {};
        this._shortcutListenerSetup = false;
        console.log('⌨️ 快捷键监听已清理');
    }

    async _cleanupWindows() {
        const ids = Object.keys(this.windowCache);
        for (const id of ids) {
            try {
                const info = this.windowCache[id];
                if (info.type === 'overlay') {
                    await EditorPreload.closeOverlayWindow(id);
                } else if (info.type === 'advanced') {
                    await EditorPreload.closeAdvancedWindow(id);
                }
                console.log(`🧹 已清理窗口: ${id}`);
            } catch (e) {
                // 忽略清理时的错误
            }
        }
        this.windowCache = {};
    }
}

// ============================================================
// 注册扩展
// ============================================================
if (typeof Scratch !== 'undefined' && Scratch.extensions) {
    const existing = Scratch.extensions._extensions?.get?.('cysocorePowerToolkit');
    if (!existing) {
        Scratch.extensions.register(new CYSOCorePowerToolkit());
        console.log('✅ CYSOCore 全能工具包已注册 (v1.0.0)');
    } else {
        console.log('ℹ️ CYSOCore 全能工具包已存在，跳过注册');
    }
} else {
    console.warn('⚠️ Scratch 扩展环境未找到，请确保在 CYSOEditor 中加载此文件');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CYSOCorePowerToolkit;
}