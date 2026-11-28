// ============================================================
// 应用执行器扩展 - Application Launcher Extension
// 版本: 1.0.0
// 描述: 启动系统应用、管理快捷方式、运行命令
// 权限: system-command, file-read, file-write, file-metadata
// ============================================================

class ApplicationLauncherExtension {
    constructor() {
        this.isDesktop = typeof EditorPreload !== 'undefined';
        this.apps = []; // 存储自定义应用列表
        this.runningApps = {}; // 跟踪运行中的应用
    }

    // ============================================================
    // getInfo() - 扩展元信息
    // ============================================================
    getInfo() {
        return {
            id: 'appLauncher',
            name: '🚀 应用执行器',
            color1: '#FF6B35',
            color2: '#E55A2B',
            color3: '#CC4A1F',

            // 权限声明
            permissions: [
                'system-command',   // 执行命令
                'file-read',        // 读取应用配置
                'file-write',       // 保存应用配置
                'file-metadata'     // 检查文件
            ],

            blocks: [
                // ==========================================
                // 1. 应用启动类积木
                // ==========================================
                {
                    opcode: 'launchApp',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '启动应用 [APP]',
                    arguments: {
                        APP: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'appList',
                            defaultValue: 'notepad'
                        }
                    }
                },
                {
                    opcode: 'launchAppWithArgs',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '启动应用 [APP] 参数 [ARGS]',
                    arguments: {
                        APP: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'appList',
                            defaultValue: 'notepad'
                        },
                        ARGS: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'C:\\test.txt'
                        }
                    }
                },
                {
                    opcode: 'launchCustomApp',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '启动自定义应用 [PATH] [ARGS]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'C:\\Program Files\\MyApp\\app.exe'
                        },
                        ARGS: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },

                // ==========================================
                // 2. 应用管理类积木
                // ==========================================
                {
                    opcode: 'addApp',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '添加应用到列表 [NAME] 路径 [PATH]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的应用'
                        },
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'C:\\myapp.exe'
                        }
                    }
                },
                {
                    opcode: 'removeApp',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '从列表移除应用 [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'appList',
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'getAppList',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取应用列表'
                },
                {
                    opcode: 'appExists',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '应用 [NAME] 存在?',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'appList',
                            defaultValue: ''
                        }
                    }
                },

                // ==========================================
                // 3. 系统应用快速启动
                // ==========================================
                {
                    opcode: 'openControlPanel',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '打开控制面板'
                },
                {
                    opcode: 'openTaskManager',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '打开任务管理器'
                },
                {
                    opcode: 'openFileExplorer',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '打开文件资源管理器 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%'
                        }
                    }
                },
                {
                    opcode: 'openSystemSettings',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '打开系统设置'
                },

                // ==========================================
                // 4. 应用状态查询
                // ==========================================
                {
                    opcode: 'isAppRunning',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '应用 [APP] 正在运行?',
                    arguments: {
                        APP: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'appList',
                            defaultValue: 'notepad'
                        }
                    }
                },
                {
                    opcode: 'closeApp',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '关闭应用 [APP]',
                    arguments: {
                        APP: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'appList',
                            defaultValue: 'notepad'
                        }
                    }
                },
                {
                    opcode: 'killProcess',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '强制结束进程 [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'notepad.exe'
                        }
                    }
                },

                // ==========================================
                // 5. 批处理执行
                // ==========================================
                {
                    opcode: 'launchMultipleApps',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '批量启动应用 [APPS]',
                    arguments: {
                        APPS: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'notepad,calc,cmd'
                        }
                    }
                },
                {
                    opcode: 'launchWithDelay',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '延时启动应用 [APP] 延迟 [DELAY] 秒',
                    arguments: {
                        APP: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'appList',
                            defaultValue: 'notepad'
                        },
                        DELAY: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                }
            ],

            // ==========================================
            // 菜单定义
            // ==========================================
            menus: {
                appList: {
                    acceptReporters: true,
                    items: this.getAppMenuItems()
                }
            }
        };
    }

    // ============================================================
    // 菜单数据 - 预定义常用应用
    // ============================================================
    getAppMenuItems() {
        // 基础应用列表（Windows系统）
        const defaultApps = [
            { text: '📝 记事本', value: 'notepad' },
            { text: '🧮 计算器', value: 'calc' },
            { text: '🖥️ 命令提示符', value: 'cmd' },
            { text: '📁 资源管理器', value: 'explorer' },
            { text: '🌐 控制面板', value: 'control' },
            { text: '⚙️ 任务管理器', value: 'taskmgr' },
            { text: '🖼️ 画图', value: 'mspaint' },
            { text: '✏️ 写字板', value: 'write' },
            { text: '🎵 媒体播放器', value: 'wmplayer' },
            { text: '🔍 系统信息', value: 'msinfo32' }
        ];

        // 添加用户自定义应用
        const customApps = this.apps.map(app => ({
            text: `📌 ${app.name}`,
            value: app.name
        }));

        return [...defaultApps, ...customApps];
    }

    // ============================================================
    // 刷新菜单（当应用列表变化时调用）
    // ============================================================
    refreshMenu() {
        // 注意：Scratch扩展不支持动态刷新菜单
        // 需要重新加载扩展才能更新菜单
        // 这里只是更新内部数据
    }

    // ============================================================
    // 核心方法：启动应用
    // ============================================================
    async launchApp(args) {
        if (!this.isDesktop) {
            console.warn('⚠️ 此功能需要桌面版');
            return;
        }

        const appName = args.APP;
        const appPath = this.getAppPath(appName);

        if (!appPath) {
            console.error(`❌ 未找到应用: ${appName}`);
            return;
        }

        try {
            const result = await EditorPreload.executeCommand(`start "" "${appPath}"`, {
                timeout: 5000
            });

            if (result.success) {
                console.log(`✅ 已启动: ${appName}`);
                this.runningApps[appName] = {
                    path: appPath,
                    started: Date.now()
                };
            } else {
                console.error(`❌ 启动失败: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ 异常: ${error.message}`);
        }
    }

    // ============================================================
    // 带参数启动应用
    // ============================================================
    async launchAppWithArgs(args) {
        if (!this.isDesktop) return;

        const appName = args.APP;
        const appPath = this.getAppPath(appName);
        const cmdArgs = args.ARGS || '';

        if (!appPath) {
            console.error(`❌ 未找到应用: ${appName}`);
            return;
        }

        try {
            const command = `start "" "${appPath}" ${cmdArgs}`;
            const result = await EditorPreload.executeCommand(command, {
                timeout: 5000
            });

            if (result.success) {
                console.log(`✅ 已启动: ${appName} (参数: ${cmdArgs})`);
            } else {
                console.error(`❌ 启动失败: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ 异常: ${error.message}`);
        }
    }

    // ============================================================
    // 启动自定义应用（直接指定路径）
    // ============================================================
    async launchCustomApp(args) {
        if (!this.isDesktop) return;

        const path = args.PATH;
        const cmdArgs = args.ARGS || '';

        if (!path || path.trim() === '') {
            console.error('❌ 请指定应用路径');
            return;
        }

        try {
            const command = `start "" "${path}" ${cmdArgs}`;
            const result = await EditorPreload.executeCommand(command, {
                timeout: 5000
            });

            if (result.success) {
                console.log(`✅ 已启动: ${path}`);
            } else {
                console.error(`❌ 启动失败: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ 异常: ${error.message}`);
        }
    }

    // ============================================================
    // 获取应用路径
    // ============================================================
    getAppPath(appName) {
        // 预定义系统应用路径
        const systemApps = {
            'notepad': 'notepad.exe',
            'calc': 'calc.exe',
            'cmd': 'cmd.exe',
            'explorer': 'explorer.exe',
            'control': 'control.exe',
            'taskmgr': 'taskmgr.exe',
            'mspaint': 'mspaint.exe',
            'write': 'write.exe',
            'wmplayer': 'wmplayer.exe',
            'msinfo32': 'msinfo32.exe'
        };

        // 检查系统应用
        if (systemApps[appName]) {
            return systemApps[appName];
        }

        // 检查自定义应用
        const customApp = this.apps.find(app => app.name === appName);
        if (customApp) {
            return customApp.path;
        }

        return null;
    }

    // ============================================================
    // 应用管理：添加应用
    // ============================================================
    async addApp(args) {
        if (!this.isDesktop) return;

        const name = args.NAME;
        const path = args.PATH;

        if (!name || name.trim() === '') {
            console.error('❌ 请输入应用名称');
            return;
        }

        if (!path || path.trim() === '') {
            console.error('❌ 请输入应用路径');
            return;
        }

        // 检查是否已存在
        if (this.apps.some(app => app.name === name)) {
            console.warn(`⚠️ 应用 "${name}" 已存在，将被覆盖`);
            this.apps = this.apps.filter(app => app.name !== name);
        }

        // 验证路径是否存在
        try {
            const checkResult = await EditorPreload.fileExists(path);
            if (checkResult.success && !checkResult.exists) {
                console.warn(`⚠️ 路径不存在: ${path}，但仍会添加`);
            }
        } catch (error) {
            // 忽略错误，继续添加
        }

        // 添加应用
        this.apps.push({
            name: name.trim(),
            path: path.trim()
        });

        console.log(`✅ 已添加应用: ${name} -> ${path}`);
        console.log('📌 提示: 重新加载扩展以更新菜单');
    }

    // ============================================================
    // 应用管理：移除应用
    // ============================================================
    async removeApp(args) {
        const name = args.NAME;

        if (!name) {
            console.error('❌ 请选择要移除的应用');
            return;
        }

        const index = this.apps.findIndex(app => app.name === name);
        if (index === -1) {
            console.error(`❌ 未找到应用: ${name}`);
            return;
        }

        this.apps.splice(index, 1);
        console.log(`✅ 已移除应用: ${name}`);
        console.log('📌 提示: 重新加载扩展以更新菜单');
    }

    // ============================================================
    // 获取应用列表（返回格式化字符串）
    // ============================================================
    async getAppList() {
        if (!this.isDesktop) return '❌ 需要桌面版';

        const allApps = [
            ...this.getSystemApps(),
            ...this.apps.map(app => `📌 ${app.name}`)
        ];

        if (allApps.length === 0) {
            return '📭 没有可用应用';
        }

        return allApps.join('\n');
    }

    getSystemApps() {
        return [
            '📝 记事本',
            '🧮 计算器',
            '🖥️ 命令提示符',
            '📁 资源管理器',
            '🌐 控制面板',
            '⚙️ 任务管理器'
        ];
    }

    // ============================================================
    // 检查应用是否存在
    // ============================================================
    async appExists(args) {
        const name = args.NAME;
        if (!name) return false;

        const path = this.getAppPath(name);
        if (!path) return false;

        try {
            const result = await EditorPreload.fileExists(path);
            return result.success && result.exists;
        } catch (error) {
            return false;
        }
    }

    // ============================================================
    // 系统应用快速启动
    // ============================================================
    async openControlPanel() {
        if (!this.isDesktop) return;
        await this.launchApp({ APP: 'control' });
    }

    async openTaskManager() {
        if (!this.isDesktop) return;
        try {
            await EditorPreload.executeCommand('start taskmgr', { timeout: 3000 });
            console.log('✅ 已打开任务管理器');
        } catch (error) {
            console.error(`❌ ${error.message}`);
        }
    }

    async openFileExplorer(args) {
        if (!this.isDesktop) return;

        const path = args.PATH || '%DESKTOP%';
        try {
            await EditorPreload.executeCommand(`start explorer "${path}"`, {
                timeout: 3000
            });
            console.log(`✅ 已打开文件资源管理器: ${path}`);
        } catch (error) {
            console.error(`❌ ${error.message}`);
        }
    }

    async openSystemSettings() {
        if (!this.isDesktop) return;
        try {
            await EditorPreload.executeCommand('start ms-settings:', {
                timeout: 3000
            });
            console.log('✅ 已打开系统设置');
        } catch (error) {
            console.error(`❌ ${error.message}`);
        }
    }

    // ============================================================
    // 应用状态查询
    // ============================================================
    async isAppRunning(args) {
        if (!this.isDesktop) return false;

        const appName = args.APP;
        const appPath = this.getAppPath(appName);

        if (!appPath) return false;

        // 使用 tasklist 检查进程
        try {
            const fileName = appPath.split('\\').pop();
            const result = await EditorPreload.executeCommand(
                `tasklist /FI "IMAGENAME eq ${fileName}" /NH`,
                { timeout: 3000 }
            );

            if (result.success) {
                // 如果输出包含进程名，说明正在运行
                return result.stdout.includes(fileName);
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    // ============================================================
    // 关闭应用
    // ============================================================
    async closeApp(args) {
        if (!this.isDesktop) return;

        const appName = args.APP;
        const appPath = this.getAppPath(appName);

        if (!appPath) {
            console.error(`❌ 未找到应用: ${appName}`);
            return;
        }

        const fileName = appPath.split('\\').pop();
        await this.killProcess({ NAME: fileName });
    }

    // ============================================================
    // 强制结束进程
    // ============================================================
    async killProcess(args) {
        if (!this.isDesktop) return;

        const processName = args.NAME;
        if (!processName) {
            console.error('❌ 请输入进程名');
            return;
        }

        try {
            const result = await EditorPreload.executeCommand(
                `taskkill /F /IM "${processName}"`,
                { timeout: 5000 }
            );

            if (result.success) {
                console.log(`✅ 已结束进程: ${processName}`);
            } else {
                console.error(`❌ 结束失败: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ 异常: ${error.message}`);
        }
    }

    // ============================================================
    // 批量启动应用
    // ============================================================
    async launchMultipleApps(args) {
        if (!this.isDesktop) return;

        const appsStr = args.APPS || '';
        const appNames = appsStr.split(',').map(s => s.trim()).filter(s => s);

        if (appNames.length === 0) {
            console.warn('⚠️ 请指定要启动的应用');
            return;
        }

        console.log(`🚀 正在批量启动 ${appNames.length} 个应用...`);

        for (const name of appNames) {
            await this.launchApp({ APP: name });
            // 短暂延迟，避免系统过载
            await this.sleep(200);
        }

        console.log('✅ 批量启动完成');
    }

    // ============================================================
    // 延时启动应用
    // ============================================================
    async launchWithDelay(args) {
        if (!this.isDesktop) return;

        const appName = args.APP;
        const delay = Math.max(0, Number(args.DELAY) || 1);

        console.log(`⏱️ 将在 ${delay} 秒后启动: ${appName}`);

        setTimeout(async () => {
            await this.launchApp({ APP: appName });
        }, delay * 1000);
    }

    // ============================================================
    // 工具方法
    // ============================================================
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ============================================================
    // 保存/加载应用列表（使用本地存储）
    // ============================================================
    async saveAppList() {
        if (!this.isDesktop) return;

        try {
            const data = JSON.stringify(this.apps, null, 2);
            await EditorPreload.writeFile('%DOCUMENTS%\\app_launcher_config.json', data);
            console.log('✅ 应用列表已保存');
        } catch (error) {
            console.error(`❌ 保存失败: ${error.message}`);
        }
    }

    async loadAppList() {
        if (!this.isDesktop) return;

        try {
            const result = await EditorPreload.readFile('%DOCUMENTS%\\app_launcher_config.json');
            if (result.success) {
                const data = JSON.parse(result.content);
                if (Array.isArray(data)) {
                    this.apps = data;
                    console.log(`✅ 已加载 ${this.apps.length} 个应用`);
                }
            }
        } catch (error) {
            // 文件不存在时忽略
            console.log('📭 未找到保存的应用列表');
        }
    }
}

// ============================================================
// 注册扩展
// ============================================================
if (typeof Scratch !== 'undefined') {
    const extension = new ApplicationLauncherExtension();

    // 加载保存的应用列表
    extension.loadAppList();

    // 注册到Scratch
    Scratch.extensions.register(extension);

    console.log('🚀 应用执行器扩展已加载');
    console.log(`📋 已加载 ${extension.apps.length} 个自定义应用`);
    console.log('💡 提示: 使用"添加应用到列表"积木来添加常用应用');
}