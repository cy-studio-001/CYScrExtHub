// ============================================================
// CYSOCore 全能API调用器扩展 - API Demo Extension
// 版本: 3.0.0
// 描述: 展示所有 EditorPreload API 的调用方法
// 权限: 所有权限（用于演示）
// ============================================================

class APIDemoExtension {
    constructor() {
        this.isDesktop = typeof EditorPreload !== 'undefined';
        this.isDesktop = typeof EditorPreload !== 'undefined';
        this.apiResults = {};
        this.testFile = '%DESKTOP%\\api_test.txt';
        this.overlayId = 'api-demo-overlay';
        this.advancedWindowId = 'api-demo-advanced';
        this.shortcuts = [];
        this.monitorInterval = null;
        this.history = [];
        
        // 初始化时检查环境
        if (this.isDesktop) {
            console.log('✅ CYSOCore API 环境检测通过');
            console.log('📋 可用 API 列表:');
            this.listAllAPIs();
        } else {
            console.warn('⚠️ 未检测到 CYSOCore，请在桌面版中运行');
        }
    }

    // ============================================================
    // getInfo() - 扩展元信息
    // ============================================================
    getInfo() {
        return {
            id: 'apiDemo',
            name: '🔧 API 全能调用器',
            color1: '#00BCD4',
            color2: '#0097A7',
            color3: '#006064',

            // 声明所有权限（用于演示）
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
                'hardware-status',
                'network-fetch',
                'network-open-url'
            ],

            blocks: [
                // ==========================================
                // 1. 文件操作 API
                // ==========================================
                {
                    opcode: 'apiReadFile',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '📖 读取文件 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\test.txt'
                        }
                    }
                },
                {
                    opcode: 'apiWriteFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '✏️ 写入文件 [PATH] 内容 [CONTENT]',
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
                    opcode: 'apiDeleteFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🗑️ 删除文件 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\temp.txt'
                        }
                    }
                },
                {
                    opcode: 'apiFileExists',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '📁 文件存在? [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\test.txt'
                        }
                    }
                },
                {
                    opcode: 'apiFileStats',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '📊 文件信息 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\test.txt'
                        }
                    }
                },

                // ==========================================
                // 2. 文件夹操作 API
                // ==========================================
                {
                    opcode: 'apiCreateFolder',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📂 创建文件夹 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\new_folder'
                        }
                    }
                },
                {
                    opcode: 'apiListFolder',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '📂 列出文件夹 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%'
                        }
                    }
                },

                // ==========================================
                // 3. 系统路径 API
                // ==========================================
                {
                    opcode: 'apiGetPath',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '📌 获取路径 [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'systemPaths',
                            defaultValue: 'desktop'
                        }
                    }
                },

                // ==========================================
                // 4. 命令执行 API
                // ==========================================
                {
                    opcode: 'apiExecuteCommand',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '⚡ 执行命令 [COMMAND]',
                    arguments: {
                        COMMAND: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'echo Hello World'
                        }
                    }
                },

                // ==========================================
                // 5. 通知 API
                // ==========================================
                {
                    opcode: 'apiShowNotification',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🔔 通知 [TITLE] - [BODY]',
                    arguments: {
                        TITLE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'API 演示'
                        },
                        BODY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '这是来自 API 的通知！'
                        }
                    }
                },

                // ==========================================
                // 6. 全局快捷键 API
                // ==========================================
                {
                    opcode: 'apiRegisterShortcut',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '⌨️ 注册快捷键 [KEY] 事件 [EVENT]',
                    arguments: {
                        KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Ctrl+Shift+D'
                        },
                        EVENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'demo-event'
                        }
                    }
                },
                {
                    opcode: 'apiUnregisterShortcut',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '⌨️ 注销快捷键 [KEY]',
                    arguments: {
                        KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Ctrl+Shift+D'
                        }
                    }
                },

                // ==========================================
                // 7. 覆盖窗口 API
                // ==========================================
                {
                    opcode: 'apiShowOverlay',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🖼️ 显示覆盖窗口'
                },
                {
                    opcode: 'apiHideOverlay',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🖼️ 隐藏覆盖窗口'
                },
                {
                    opcode: 'apiUpdateOverlay',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🖼️ 更新覆盖窗口'
                },

                // ==========================================
                // 8. 屏幕捕获 API
                // ==========================================
                {
                    opcode: 'apiCaptureScreen',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📷 截取屏幕'
                },
                {
                    opcode: 'apiCaptureRegion',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📷 截取区域 [X] [Y] [W] [H]',
                    arguments: {
                        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                        W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 800 },
                        H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 600 }
                    }
                },

                // ==========================================
                // 9. 高级窗口 API
                // ==========================================
                {
                    opcode: 'apiShowAdvancedWindow',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🪟 显示高级窗口'
                },
                {
                    opcode: 'apiHideAdvancedWindow',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🪟 隐藏高级窗口'
                },

                // ==========================================
                // 10. 硬件状态 API
                // ==========================================
                {
                    opcode: 'apiGetCPU',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '💻 CPU 信息'
                },
                {
                    opcode: 'apiGetMemory',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '💾 内存信息'
                },
                {
                    opcode: 'apiGetBattery',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '🔋 电池信息'
                },
                {
                    opcode: 'apiGetDisk',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '💿 磁盘信息'
                },

                // ==========================================
                // 11. 网络 API
                // ==========================================
                {
                    opcode: 'apiNetworkFetch',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '🌐 网络请求 [URL]',
                    arguments: {
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://api.github.com'
                        }
                    }
                },
                {
                    opcode: 'apiOpenUrl',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🌐 打开链接 [URL]',
                    arguments: {
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://github.com'
                        }
                    }
                },

                // ==========================================
                // 12. 权限管理 API
                // ==========================================
                {
                    opcode: 'apiGetPermissions',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '🔑 查看所有权限'
                },
                {
                    opcode: 'apiCheckPermission',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '🔑 检查权限 [PERMISSION]',
                    arguments: {
                        PERMISSION: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'permissions',
                            defaultValue: 'file-read'
                        }
                    }
                },

                // ==========================================
                // 13. 综合测试
                // ==========================================
                {
                    opcode: 'apiRunAllTests',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🧪 运行所有 API 测试'
                },
                {
                    opcode: 'apiGetHistory',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '📜 查看 API 调用历史'
                },
                {
                    opcode: 'apiClearHistory',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🗑️ 清空 API 历史'
                },
                {
                    opcode: 'apiGetSystemInfo',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '💻 获取完整系统信息'
                }
            ],

            menus: {
                systemPaths: {
                    acceptReporters: true,
                    items: [
                        { text: '📁 桌面 (desktop)', value: 'desktop' },
                        { text: '📁 文档 (documents)', value: 'documents' },
                        { text: '📁 下载 (downloads)', value: 'downloads' },
                        { text: '📁 用户目录 (home)', value: 'home' }
                    ]
                },
                permissions: {
                    acceptReporters: true,
                    items: [
                        { text: 'file-read', value: 'file-read' },
                        { text: 'file-write', value: 'file-write' },
                        { text: 'file-delete', value: 'file-delete' },
                        { text: 'file-metadata', value: 'file-metadata' },
                        { text: 'system-command', value: 'system-command' },
                        { text: 'global-shortcut', value: 'global-shortcut' },
                        { text: 'draw-window', value: 'draw-window' },
                        { text: 'screen-capture', value: 'screen-capture' },
                        { text: 'advanced-window', value: 'advanced-window' },
                        { text: 'hardware-status', value: 'hardware-status' }
                    ]
                }
            }
        };
    }

    // ============================================================
    // 工具方法
    // ============================================================

    // 记录 API 调用历史
    logAPI(apiName, params, result) {
        this.history.push({
            time: new Date().toISOString(),
            api: apiName,
            params: params,
            result: result
        });
        // 限制历史长度
        if (this.history.length > 100) {
            this.history = this.history.slice(-100);
        }
        console.log(`[API] ${apiName}`, params, '=>', result);
    }

    // 格式化结果
    formatResult(result) {
        if (typeof result === 'string') return result;
        if (typeof result === 'object') {
            try {
                return JSON.stringify(result, null, 2);
            } catch (e) {
                return String(result);
            }
        }
        return String(result);
    }

    // 显示通知
    async notify(title, body) {
        if (!this.isDesktop) return;
        try {
            await EditorPreload.showNotification({
                title: title || 'API Demo',
                body: body || '操作完成',
                silent: false
            });
        } catch (e) {
            console.error('通知失败:', e);
        }
    }

    // 显示测试结果
    showResult(title, result, isSuccess = true) {
        const icon = isSuccess ? '✅' : '❌';
        console.log(`${icon} ${title}:`, result);
        return `${icon} ${title}\n${this.formatResult(result)}`;
    }

    // 睡眠
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 列出所有 API
    listAllAPIs() {
        if (!this.isDesktop) return;
        
        const apis = Object.keys(EditorPreload).filter(key => 
            typeof EditorPreload[key] === 'function'
        );
        
        console.log('📋 可用 API 列表:');
        apis.forEach(api => {
            console.log(`  - ${api}()`);
        });
        console.log(`总计: ${apis.length} 个 API`);
    }

    // ============================================================
    // 1. 文件操作 API 方法
    // ============================================================

    async apiReadFile(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.readFile(args.PATH);
            this.logAPI('readFile', { path: args.PATH }, result);
            
            if (result.success) {
                const content = result.content || '';
                const preview = content.length > 500 ? content.substring(0, 500) + '...' : content;
                return `✅ 读取成功\n内容预览:\n${preview}`;
            } else {
                return `❌ ${result.error}`;
            }
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    async apiWriteFile(args) {
        if (!this.isDesktop) return;
        
        try {
            const result = await EditorPreload.writeFile(args.PATH, args.CONTENT);
            this.logAPI('writeFile', { path: args.PATH, content: args.CONTENT }, result);
            
            if (result.success) {
                await this.notify('✅ 写入成功', `文件已保存: ${args.PATH}`);
                console.log(`✅ 文件已写入: ${args.PATH}`);
            } else {
                console.error(`❌ 写入失败: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ 异常: ${error.message}`);
        }
    }

    async apiDeleteFile(args) {
        if (!this.isDesktop) return;
        
        try {
            const result = await EditorPreload.deleteFile(args.PATH);
            this.logAPI('deleteFile', { path: args.PATH }, result);
            
            if (result.success) {
                await this.notify('🗑️ 删除成功', `文件已删除: ${args.PATH}`);
                console.log(`🗑️ 文件已删除: ${args.PATH}`);
            } else {
                console.error(`❌ 删除失败: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ 异常: ${error.message}`);
        }
    }

    async apiFileExists(args) {
        if (!this.isDesktop) return false;
        
        try {
            const result = await EditorPreload.fileExists(args.PATH);
            this.logAPI('fileExists', { path: args.PATH }, result);
            return result.success && result.exists;
        } catch (error) {
            return false;
        }
    }

    async apiFileStats(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.getFileStats(args.PATH);
            this.logAPI('getFileStats', { path: args.PATH }, result);
            
            if (result.success) {
                const stats = result.stats;
                return `📊 文件信息\n━━━━━━━━━━━━━━━━━━━━━\n📄 路径: ${args.PATH}\n📦 大小: ${this.formatSize(stats.size)}\n📅 创建: ${new Date(stats.created).toLocaleString()}\n✏️ 修改: ${new Date(stats.modified).toLocaleString()}\n📖 访问: ${new Date(stats.accessed).toLocaleString()}`;
            } else {
                return `❌ ${result.error}`;
            }
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }

    // ============================================================
    // 2. 文件夹操作 API 方法
    // ============================================================

    async apiCreateFolder(args) {
        if (!this.isDesktop) return;
        
        try {
            const result = await EditorPreload.createFolder(args.PATH);
            this.logAPI('createFolder', { path: args.PATH }, result);
            
            if (result.success) {
                await this.notify('📂 创建成功', `文件夹已创建: ${args.PATH}`);
                console.log(`📂 文件夹已创建: ${args.PATH}`);
            } else {
                console.error(`❌ 创建失败: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ 异常: ${error.message}`);
        }
    }

    async apiListFolder(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.readLocalFolder(args.PATH);
            this.logAPI('readLocalFolder', { path: args.PATH }, result);
            
            if (result.success) {
                let output = `📂 ${args.PATH}\n`;
                output += '━'.repeat(40) + '\n';
                
                const files = result.files || [];
                if (files.length === 0) {
                    output += '📭 文件夹为空';
                } else {
                    // 按类型排序
                    const sorted = files.sort((a, b) => {
                        if (a.isDirectory && !b.isDirectory) return -1;
                        if (!a.isDirectory && b.isDirectory) return 1;
                        return a.name.localeCompare(b.name);
                    });
                    
                    const maxShow = 20;
                    const showFiles = sorted.slice(0, maxShow);
                    
                    for (const file of showFiles) {
                        const icon = file.isDirectory ? '📁' : '📄';
                        const size = file.isDirectory ? '<DIR>' : this.formatSize(file.size);
                        output += `${icon} ${file.name.padEnd(30)} ${size}\n`;
                    }
                    
                    if (sorted.length > maxShow) {
                        output += `\n... 还有 ${sorted.length - maxShow} 个项目`;
                    }
                }
                
                return output;
            } else {
                return `❌ ${result.error}`;
            }
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    // ============================================================
    // 3. 系统路径 API
    // ============================================================

    async apiGetPath(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.getPath(args.NAME);
            this.logAPI('getPath', { name: args.NAME }, result);
            
            if (result.success) {
                return `📌 ${args.NAME}: ${result.path}`;
            } else {
                return `❌ ${result.error}`;
            }
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    // ============================================================
    // 4. 命令执行 API
    // ============================================================

    async apiExecuteCommand(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.executeCommand(args.COMMAND, {
                timeout: 30000
            });
            this.logAPI('executeCommand', { command: args.COMMAND }, result);
            
            if (result.success) {
                const stdout = result.stdout || '';
                const preview = stdout.length > 500 ? stdout.substring(0, 500) + '...' : stdout;
                return `✅ 命令执行成功\n输出:\n${preview}`;
            } else {
                return `❌ ${result.error}`;
            }
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    // ============================================================
    // 5. 通知 API
    // ============================================================

    async apiShowNotification(args) {
        if (!this.isDesktop) return;
        
        try {
            const result = await EditorPreload.showNotification({
                title: args.TITLE || 'API 演示',
                body: args.BODY || '这是来自 API 的通知！',
                silent: false
            });
            this.logAPI('showNotification', { title: args.TITLE, body: args.BODY }, result);
            console.log('🔔 通知已发送');
        } catch (error) {
            console.error('❌ 通知失败:', error.message);
        }
    }

    // ============================================================
    // 6. 全局快捷键 API
    // ============================================================

    async apiRegisterShortcut(args) {
        if (!this.isDesktop) return;
        
        const key = args.KEY;
        const eventName = args.EVENT || 'demo-event';
        
        try {
            const result = await EditorPreload.registerGlobalShortcut(key, eventName);
            this.logAPI('registerGlobalShortcut', { key, eventName }, result);
            
            if (result.success) {
                this.shortcuts.push(key);
                await this.notify('⌨️ 快捷键已注册', `${key} -> ${eventName}`);
                console.log(`⌨️ 快捷键已注册: ${key}`);
            } else {
                console.error(`❌ 注册失败: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ 异常: ${error.message}`);
        }
    }

    async apiUnregisterShortcut(args) {
        if (!this.isDesktop) return;
        
        const key = args.KEY;
        
        try {
            const result = await EditorPreload.unregisterGlobalShortcut(key);
            this.logAPI('unregisterGlobalShortcut', { key }, result);
            
            if (result.success) {
                this.shortcuts = this.shortcuts.filter(k => k !== key);
                console.log(`⌨️ 快捷键已注销: ${key}`);
            } else {
                console.error(`❌ 注销失败: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ 异常: ${error.message}`);
        }
    }

    // ============================================================
    // 7. 覆盖窗口 API
    // ============================================================

    async apiShowOverlay() {
        if (!this.isDesktop) return;
        
        try {
            await EditorPreload.createOverlayWindow(
                this.overlayId,
                100, 100, 600, 400
            );
            
            await this.updateOverlayContent();
            
            console.log('🖼️ 覆盖窗口已显示');
        } catch (error) {
            console.error('❌ 显示覆盖窗口失败:', error.message);
        }
    }

    async apiHideOverlay() {
        if (!this.isDesktop) return;
        
        try {
            await EditorPreload.closeOverlayWindow(this.overlayId);
            console.log('🖼️ 覆盖窗口已隐藏');
        } catch (error) {
            console.error('❌ 隐藏覆盖窗口失败:', error.message);
        }
    }

    async apiUpdateOverlay() {
        if (!this.isDesktop) return;
        await this.updateOverlayContent();
    }

    async updateOverlayContent() {
        try {
            const now = new Date();
            const cpu = await this.getCPUInfo();
            const mem = await this.getMemoryInfo();
            
            const html = `
                <div style="
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    overflow-y: auto;
                ">
                    <h2 style="color: #00bcd4; margin: 0 0 15px 0;">🔧 API 全能调用器</h2>
                    
                    <div style="
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                        margin-bottom: 15px;
                    ">
                        <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px;">
                            <div style="color: #888; font-size: 12px;">🕐 时间</div>
                            <div style="font-size: 16px;">${now.toLocaleTimeString()}</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px;">
                            <div style="color: #888; font-size: 12px;">💻 CPU</div>
                            <div style="font-size: 16px;">${cpu}%</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px;">
                            <div style="color: #888; font-size: 12px;">💾 内存</div>
                            <div style="font-size: 16px;">${mem}%</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px;">
                            <div style="color: #888; font-size: 12px;">📋 API 调用</div>
                            <div style="font-size: 16px;">${this.history.length}</div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                        <div style="color: #888; font-size: 12px;">📜 最近调用</div>
                        <div style="font-size: 12px; max-height: 100px; overflow-y: auto;">
                            ${this.history.slice(-5).map(h => 
                                `<div style="color: #aaa; padding: 2px 0;">${h.time.slice(11, 19)} ${h.api}()</div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div style="
                        display: flex;
                        gap: 10px;
                        flex-wrap: wrap;
                    ">
                        <button onclick="window.apiDemo?.updateOverlay()" style="
                            padding: 5px 15px;
                            background: #00bcd4;
                            border: none;
                            border-radius: 3px;
                            color: #fff;
                            cursor: pointer;
                        ">🔄 刷新</button>
                        <button onclick="window.apiDemo?.hideOverlay()" style="
                            padding: 5px 15px;
                            background: #f44336;
                            border: none;
                            border-radius: 3px;
                            color: #fff;
                            cursor: pointer;
                        ">❌ 关闭</button>
                    </div>
                </div>
            `;
            
            await EditorPreload.setOverlayContent(this.overlayId, html);
        } catch (error) {
            console.error('更新覆盖窗口失败:', error.message);
        }
    }

    // ============================================================
    // 8. 屏幕捕获 API
    // ============================================================

    async apiCaptureScreen() {
        if (!this.isDesktop) return;
        
        try {
            const result = await EditorPreload.captureScreen('screen');
            this.logAPI('captureScreen', { type: 'screen' }, result);
            
            if (result.success) {
                // 保存截图
                const filename = `screenshot_${Date.now()}.png`;
                const path = `%DESKTOP%\\${filename}`;
                await EditorPreload.writeFile(path, result.dataUrl);
                await this.notify('📷 截图已保存', `已保存到: ${filename}`);
                console.log(`📷 截图已保存: ${path}`);
            } else {
                console.error(`❌ 截图失败: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ 异常: ${error.message}`);
        }
    }

    async apiCaptureRegion(args) {
        if (!this.isDesktop) return;
        
        const x = Number(args.X) || 0;
        const y = Number(args.Y) || 0;
        const w = Number(args.W) || 800;
        const h = Number(args.H) || 600;
        
        try {
            const result = await EditorPreload.captureRegion(x, y, w, h);
            this.logAPI('captureRegion', { x, y, w, h }, result);
            
            if (result.success) {
                const filename = `region_${Date.now()}.png`;
                const path = `%DESKTOP%\\${filename}`;
                await EditorPreload.writeFile(path, result.dataUrl);
                await this.notify('📷 区域截图已保存', `已保存到: ${filename}`);
                console.log(`📷 区域截图已保存: ${path}`);
            } else {
                console.error(`❌ 截图失败: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ 异常: ${error.message}`);
        }
    }

    // ============================================================
    // 9. 高级窗口 API
    // ============================================================

    async apiShowAdvancedWindow() {
        if (!this.isDesktop) return;
        
        try {
            await EditorPreload.createAdvancedWindow(this.advancedWindowId, {
                width: 500,
                height: 400,
                frameless: false,
                transparent: false,
                alwaysOnTop: false,
                title: 'API 高级窗口'
            });
            
            // 通过 URL 加载内容（这里使用数据URL）
            const html = `
                <div style="
                    padding: 20px;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    background: #1a1a2e;
                    color: #fff;
                    height: 100%;
                ">
                    <h2>🪟 高级窗口</h2>
                    <p>这是通过 createAdvancedWindow API 创建的窗口</p>
                    <p>支持: 无边框、透明、置顶等特性</p>
                    <button onclick="window.close()" style="
                        padding: 8px 20px;
                        background: #f44336;
                        border: none;
                        border-radius: 3px;
                        color: #fff;
                        cursor: pointer;
                    ">关闭窗口</button>
                </div>
            `;
            
            // 注意：高级窗口需要通过URL加载，这里使用about:blank然后注入内容
            // 实际使用中可能需要加载外部HTML文件
            
            console.log('🪟 高级窗口已显示');
            await this.notify('🪟 高级窗口', '高级窗口已打开');
        } catch (error) {
            console.error('❌ 显示高级窗口失败:', error.message);
        }
    }

    async apiHideAdvancedWindow() {
        if (!this.isDesktop) return;
        
        try {
            await EditorPreload.closeAdvancedWindow(this.advancedWindowId);
            console.log('🪟 高级窗口已关闭');
        } catch (error) {
            console.error('❌ 关闭高级窗口失败:', error.message);
        }
    }

    // ============================================================
    // 10. 硬件状态 API
    // ============================================================

    async getCPUInfo() {
        if (!this.isDesktop) return 0;
        try {
            const result = await EditorPreload.getHardwareStatus('cpu');
            return result.success ? result.data.usage : 0;
        } catch (e) {
            return 0;
        }
    }

    async getMemoryInfo() {
        if (!this.isDesktop) return 0;
        try {
            const result = await EditorPreload.getHardwareStatus('memory');
            return result.success ? result.data.usage : 0;
        } catch (e) {
            return 0;
        }
    }

    async apiGetCPU() {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.getHardwareStatus('cpu');
            this.logAPI('getHardwareStatus', { device: 'cpu' }, result);
            
            if (result.success) {
                const cpu = result.data;
                return `💻 CPU 信息\n━━━━━━━━━━━━━━━━━━━━━\n📝 型号: ${cpu.model || '未知'}\n🔢 核心数: ${cpu.cores || 0}\n⚡ 主频: ${cpu.speed || 0} MHz\n📊 使用率: ${cpu.usage || 0}%`;
            } else {
                return `❌ ${result.error}`;
            }
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    async apiGetMemory() {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.getHardwareStatus('memory');
            this.logAPI('getHardwareStatus', { device: 'memory' }, result);
            
            if (result.success) {
                const mem = result.data;
                const totalGB = (mem.total / 1073741824).toFixed(1);
                const usedGB = (mem.used / 1073741824).toFixed(1);
                const freeGB = (mem.free / 1073741824).toFixed(1);
                return `💾 内存信息\n━━━━━━━━━━━━━━━━━━━━━\n📦 总容量: ${totalGB} GB\n📊 已使用: ${usedGB} GB (${mem.usage}%)\n📊 可用: ${freeGB} GB`;
            } else {
                return `❌ ${result.error}`;
            }
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    async apiGetBattery() {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.getHardwareStatus('battery');
            this.logAPI('getHardwareStatus', { device: 'battery' }, result);
            
            if (result.success) {
                const bat = result.data;
                if (bat.hasBattery) {
                    return `🔋 电池信息\n━━━━━━━━━━━━━━━━━━━━━\n📊 电量: ${bat.level}%\n⚡ 状态: ${bat.charging ? '充电中' : '放电中'}`;
                } else {
                    return '🔋 未检测到电池';
                }
            } else {
                return `❌ ${result.error}`;
            }
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    async apiGetDisk() {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.getHardwareStatus('disk');
            this.logAPI('getHardwareStatus', { device: 'disk' }, result);
            
            if (result.success) {
                const disks = result.data.disks || [];
                let output = '💿 磁盘信息\n';
                output += '━'.repeat(40) + '\n';
                
                for (const disk of disks) {
                    const totalGB = (disk.total / 1073741824).toFixed(1);
                    const freeGB = (disk.free / 1073741824).toFixed(1);
                    output += `${disk.drive}\n`;
                    output += `  📦 容量: ${totalGB} GB\n`;
                    output += `  📊 使用: ${disk.usage}%\n`;
                    output += `  📊 剩余: ${freeGB} GB\n`;
                }
                
                return output;
            } else {
                return `❌ ${result.error}`;
            }
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    // ============================================================
    // 11. 网络 API
    // ============================================================

    async apiNetworkFetch(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.networkFetch(args.URL, {
                method: 'GET',
                timeout: 10000
            });
            this.logAPI('networkFetch', { url: args.URL }, result);
            
            if (result.success) {
                const data = result.data || '';
                const preview = typeof data === 'string' ? 
                    (data.length > 500 ? data.substring(0, 500) + '...' : data) :
                    JSON.stringify(data, null, 2).substring(0, 500);
                return `✅ 请求成功\n响应:\n${preview}`;
            } else {
                return `❌ ${result.error}`;
            }
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    async apiOpenUrl(args) {
        if (!this.isDesktop) return;
        
        try {
            const result = await EditorPreload.openUrl(args.URL);
            this.logAPI('openUrl', { url: args.URL }, result);
            
            if (result.success) {
                console.log(`🌐 已打开链接: ${args.URL}`);
            } else {
                console.error(`❌ 打开链接失败: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ 异常: ${error.message}`);
        }
    }

    // ============================================================
    // 12. 权限管理 API
    // ============================================================

    async apiGetPermissions() {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const permissions = await EditorPreload.getPermissions();
            this.logAPI('getPermissions', {}, permissions);
            
            let output = '🔑 权限列表\n';
            output += '━'.repeat(40) + '\n';
            
            for (const [key, value] of Object.entries(permissions)) {
                const icon = value === 'always' ? '✅' : value === 'ask' ? '❓' : '❌';
                output += `${icon} ${key}: ${value}\n`;
            }
            
            return output;
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    async apiCheckPermission(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.checkPermission('apiDemo', args.PERMISSION);
            this.logAPI('checkPermission', { permission: args.PERMISSION }, result);
            
            if (result.action === 'allow') {
                return `✅ ${args.PERMISSION}: 允许`;
            } else {
                return `❌ ${args.PERMISSION}: 拒绝`;
            }
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    // ============================================================
    // 13. 综合测试
    // ============================================================

    async apiRunAllTests() {
        if (!this.isDesktop) {
            console.warn('⚠️ 需要桌面版');
            return;
        }
        
        console.log('🧪 开始运行所有 API 测试...');
        console.log('━'.repeat(50));
        
        const results = [];
        const startTime = Date.now();
        
        // 1. 测试文件操作
        console.log('📁 测试文件操作...');
        try {
            await EditorPreload.writeFile(this.testFile, 'API Test Content');
            results.push('✅ 文件写入成功');
            
            const readResult = await EditorPreload.readFile(this.testFile);
            if (readResult.success && readResult.content === 'API Test Content') {
                results.push('✅ 文件读取成功');
            }
            
            const exists = await EditorPreload.fileExists(this.testFile);
            if (exists.success && exists.exists) {
                results.push('✅ 文件存在检查成功');
            }
            
            await EditorPreload.deleteFile(this.testFile);
            results.push('✅ 文件删除成功');
        } catch (error) {
            results.push(`❌ 文件操作失败: ${error.message}`);
        }
        
        // 2. 测试硬件状态
        console.log('💻 测试硬件状态...');
        try {
            const cpu = await EditorPreload.getHardwareStatus('cpu');
            if (cpu.success) results.push('✅ CPU 信息获取成功');
            
            const mem = await EditorPreload.getHardwareStatus('memory');
            if (mem.success) results.push('✅ 内存信息获取成功');
        } catch (error) {
            results.push(`❌ 硬件状态测试失败: ${error.message}`);
        }
        
        // 3. 测试系统路径
        console.log('📌 测试系统路径...');
        try {
            const path = await EditorPreload.getPath('desktop');
            if (path.success) results.push('✅ 系统路径获取成功');
        } catch (error) {
            results.push(`❌ 系统路径测试失败: ${error.message}`);
        }
        
        // 4. 测试通知
        console.log('🔔 测试通知...');
        try {
            await EditorPreload.showNotification({
                title: '🧪 API 测试',
                body: '所有测试完成！',
                silent: true
            });
            results.push('✅ 通知发送成功');
        } catch (error) {
            results.push(`❌ 通知测试失败: ${error.message}`);
        }
        
        const duration = Date.now() - startTime;
        
        console.log('━'.repeat(50));
        console.log(`🧪 测试完成 (${duration}ms)`);
        console.log('结果:');
        results.forEach(r => console.log(`  ${r}`));
        
        // 显示结果
        const successCount = results.filter(r => r.startsWith('✅')).length;
        const totalCount = results.length;
        
        await this.notify(
            '🧪 API 测试完成',
            `通过: ${successCount}/${totalCount}\n耗时: ${duration}ms`
        );
        
        return `🧪 API 测试结果\n━━━━━━━━━━━━━━━━━━━━━\n${results.join('\n')}\n━━━━━━━━━━━━━━━━━━━━━\n📊 通过: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)\n⏱️ 耗时: ${duration}ms`;
    }

    async apiGetHistory() {
        if (this.history.length === 0) {
            return '📜 暂无 API 调用记录';
        }
        
        let output = '📜 API 调用历史\n';
        output += '━'.repeat(40) + '\n';
        
        const show = this.history.slice(-20);
        for (const h of show) {
            const status = h.result?.success ? '✅' : '❌';
            const time = h.time.slice(11, 19);
            output += `${time} ${status} ${h.api}()\n`;
        }
        
        output += `\n📊 总计: ${this.history.length} 次调用`;
        return output;
    }

    async apiClearHistory() {
        this.history = [];
        console.log('🗑️ API 历史已清空');
    }

    async apiGetSystemInfo() {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const results = await Promise.all([
                EditorPreload.getHardwareStatus('cpu'),
                EditorPreload.getHardwareStatus('memory'),
                EditorPreload.getHardwareStatus('battery')
            ]);
            
            const cpu = results[0].data || {};
            const mem = results[1].data || {};
            const bat = results[2].data || {};
            
            let output = '💻 完整系统信息\n';
            output += '━'.repeat(40) + '\n\n';
            
            output += `🕐 当前时间: ${new Date().toLocaleString()}\n`;
            output += `💻 桌面版: ${this.isDesktop ? '✅' : '❌'}\n\n`;
            
            output += 'CPU:\n';
            output += `  📝 型号: ${cpu.model || '未知'}\n`;
            output += `  🔢 核心数: ${cpu.cores || 0}\n`;
            output += `  📊 使用率: ${cpu.usage || 0}%\n\n`;
            
            const totalGB = (mem.total || 0) / 1073741824;
            const usedGB = (mem.used || 0) / 1073741824;
            output += '内存:\n';
            output += `  📦 总容量: ${totalGB.toFixed(1)} GB\n`;
            output += `  📊 已使用: ${usedGB.toFixed(1)} GB (${mem.usage || 0}%)\n\n`;
            
            if (bat.hasBattery) {
                output += '电池:\n';
                output += `  📊 电量: ${bat.level || 0}%\n`;
                output += `  ⚡ 状态: ${bat.charging ? '充电中' : '放电中'}\n\n`;
            }
            
            output += 'API 状态:\n';
            output += `  📋 调用次数: ${this.history.length}\n`;
            output += `  ⌨️ 快捷键: ${this.shortcuts.length} 个`;
            
            return output;
        } catch (error) {
            return `❌ 获取系统信息失败: ${error.message}`;
        }
    }

    // ============================================================
    // 清理资源
    // ============================================================
    dispose() {
        // 清理快捷键
        for (const key of this.shortcuts) {
            try {
                EditorPreload.unregisterGlobalShortcut(key);
            } catch (e) {
                // 忽略
            }
        }
        
        // 清理窗口
        try {
            EditorPreload.closeOverlayWindow(this.overlayId);
            EditorPreload.closeAdvancedWindow(this.advancedWindowId);
        } catch (e) {
            // 忽略
        }
        
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
        }
        
        console.log('🧹 API 全能调用器已清理');
    }
}

// ============================================================
// 注册扩展
// ============================================================
if (typeof Scratch !== 'undefined') {
    const extension = new APIDemoExtension();
    Scratch.extensions.register(extension);
    
    // 保存到 window 方便调试
    window.apiDemo = extension;
    
    console.log('🔧 API 全能调用器扩展已加载！');
    console.log('📋 支持所有 CYSOCore API');
    console.log('💡 打开浏览器控制台查看详细输出');
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIDemoExtension;
}