// ============================================================
// 定时操作扩展 - Timer & Scheduler Extension
// 版本: 1.0.0
// 描述: 定时执行应用启动、文件分析、系统操作等任务
// 权限: system-command, file-read, file-write, hardware-status
// ============================================================

class TimerSchedulerExtension {
    constructor() {
        this.isDesktop = typeof EditorPreload !== 'undefined';
        this.timers = new Map(); // 存储定时器 { id, name, interval, callback, running }
        this.scheduledTasks = []; // 存储计划任务
        this.taskHistory = []; // 任务执行历史
        this.isRunning = false;
        this.timerId = null;
        this.notificationQueue = [];
        
        // 加载保存的任务
        this.loadTasks();
    }

    // ============================================================
    // getInfo() - 扩展元信息
    // ============================================================
    getInfo() {
        return {
            id: 'timerScheduler',
            name: '⏰ 定时操作器',
            color1: '#4CAF50',
            color2: '#388E3C',
            color3: '#2E7D32',

            permissions: [
                'system-command',
                'file-read',
                'file-write',
                'hardware-status'
            ],

            blocks: [
                // ==========================================
                // 1. 定时启动应用
                // ==========================================
                {
                    opcode: 'scheduleLaunchApp',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '定时启动应用 [APP] 在 [HOURS] 时 [MINUTES] 分',
                    arguments: {
                        APP: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'appList',
                            defaultValue: 'notepad'
                        },
                        HOURS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 9
                        },
                        MINUTES: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'scheduleLaunchAppDelay',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '延时启动应用 [APP] 在 [DELAY] 秒后',
                    arguments: {
                        APP: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'appList',
                            defaultValue: 'notepad'
                        },
                        DELAY: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },

                // ==========================================
                // 2. 定时文件分析
                // ==========================================
                {
                    opcode: 'scheduleFileAnalysis',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '定时分析文件 [PATH] 每天 [HOURS] 时 [MINUTES] 分',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\document.txt'
                        },
                        HOURS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 18
                        },
                        MINUTES: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'scheduleFolderAnalysis',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '定时分析文件夹 [PATH] 每天 [HOURS] 时 [MINUTES] 分',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%'
                        },
                        HOURS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 20
                        },
                        MINUTES: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },

                // ==========================================
                // 3. 间隔重复任务
                // ==========================================
                {
                    opcode: 'repeatLaunchApp',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '每隔 [INTERVAL] 秒启动 [APP]',
                    arguments: {
                        INTERVAL: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 60
                        },
                        APP: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'appList',
                            defaultValue: 'notepad'
                        }
                    }
                },
                {
                    opcode: 'repeatCheckFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '每隔 [INTERVAL] 秒检查文件 [PATH] 变化',
                    arguments: {
                        INTERVAL: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 30
                        },
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\data.txt'
                        }
                    }
                },

                // ==========================================
                // 4. 定时提醒
                // ==========================================
                {
                    opcode: 'scheduleReminder',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置提醒 [MESSAGE] 在 [HOURS] 时 [MINUTES] 分',
                    arguments: {
                        MESSAGE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '该休息了！'
                        },
                        HOURS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 14
                        },
                        MINUTES: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 30
                        }
                    }
                },
                {
                    opcode: 'repeatReminder',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '每隔 [INTERVAL] 分钟提醒 [MESSAGE]',
                    arguments: {
                        INTERVAL: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 30
                        },
                        MESSAGE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '喝杯水，休息一下！'
                        }
                    }
                },

                // ==========================================
                // 5. 定时系统操作
                // ==========================================
                {
                    opcode: 'scheduleShutdown',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '定时关机在 [HOURS] 时 [MINUTES] 分',
                    arguments: {
                        HOURS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 23
                        },
                        MINUTES: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'scheduleRestart',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '定时重启在 [HOURS] 时 [MINUTES] 分',
                    arguments: {
                        HOURS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 2
                        },
                        MINUTES: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },

                // ==========================================
                // 6. 任务管理
                // ==========================================
                {
                    opcode: 'listScheduledTasks',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '查看所有计划任务'
                },
                {
                    opcode: 'cancelTask',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '取消任务 [TASK_ID]',
                    arguments: {
                        TASK_ID: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'clearAllTasks',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '清除所有任务'
                },
                {
                    opcode: 'pauseAllTasks',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '暂停所有任务'
                },
                {
                    opcode: 'resumeAllTasks',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '恢复所有任务'
                },

                // ==========================================
                // 7. 状态查询
                // ==========================================
                {
                    opcode: 'getTaskCount',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '任务数量'
                },
                {
                    opcode: 'getNextTaskTime',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '下一个任务执行时间'
                },
                {
                    opcode: 'getTaskHistory',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '任务执行历史（最近 [NUM] 条）',
                    arguments: {
                        NUM: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },

                // ==========================================
                // 8. 工作日/时间条件
                // ==========================================
                {
                    opcode: 'scheduleOnWeekday',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '在工作日 [DAYS] 定时启动 [APP] 在 [HOURS] 时',
                    arguments: {
                        DAYS: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'weekdays',
                            defaultValue: '1,2,3,4,5'
                        },
                        APP: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'appList',
                            defaultValue: 'notepad'
                        },
                        HOURS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 9
                        }
                    }
                },
                {
                    opcode: 'isTimeBetween',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '当前时间在 [START_H] 点 [START_M] 分 和 [END_H] 点 [END_M] 分之间?',
                    arguments: {
                        START_H: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 9
                        },
                        START_M: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        END_H: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 18
                        },
                        END_M: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                }
            ],

            menus: {
                appList: {
                    acceptReporters: true,
                    items: this.getAppMenuItems()
                },
                weekdays: {
                    acceptReporters: true,
                    items: [
                        { text: '周一至周五 (1,2,3,4,5)', value: '1,2,3,4,5' },
                        { text: '周一 (1)', value: '1' },
                        { text: '周二 (2)', value: '2' },
                        { text: '周三 (3)', value: '3' },
                        { text: '周四 (4)', value: '4' },
                        { text: '周五 (5)', value: '5' },
                        { text: '周六 (6)', value: '6' },
                        { text: '周日 (0)', value: '0' },
                        { text: '周末 (0,6)', value: '0,6' },
                        { text: '每天 (0,1,2,3,4,5,6)', value: '0,1,2,3,4,5,6' }
                    ]
                }
            }
        };
    }

    // ============================================================
    // 菜单数据
    // ============================================================
    getAppMenuItems() {
        const defaultApps = [
            { text: '📝 记事本', value: 'notepad' },
            { text: '🧮 计算器', value: 'calc' },
            { text: '🖥️ 命令提示符', value: 'cmd' },
            { text: '📁 资源管理器', value: 'explorer' },
            { text: '🌐 控制面板', value: 'control' },
            { text: '⚙️ 任务管理器', value: 'taskmgr' }
        ];
        return defaultApps;
    }

    // ============================================================
    // 获取应用路径
    // ============================================================
    getAppPath(appName) {
        const systemApps = {
            'notepad': 'notepad.exe',
            'calc': 'calc.exe',
            'cmd': 'cmd.exe',
            'explorer': 'explorer.exe',
            'control': 'control.exe',
            'taskmgr': 'taskmgr.exe',
            'mspaint': 'mspaint.exe',
            'write': 'write.exe'
        };
        return systemApps[appName] || appName;
    }

    // ============================================================
    // 启动应用
    // ============================================================
    async launchApp(appName) {
        if (!this.isDesktop) return false;
        
        try {
            const appPath = this.getAppPath(appName);
            const result = await EditorPreload.executeCommand(`start "" "${appPath}"`, {
                timeout: 5000
            });
            return result.success;
        } catch (error) {
            console.error(`启动失败: ${error.message}`);
            return false;
        }
    }

    // ============================================================
    // 显示通知
    // ============================================================
    async showNotification(title, body) {
        if (!this.isDesktop) return;
        
        try {
            await EditorPreload.showNotification({
                title: title,
                body: body
            });
        } catch (error) {
            console.error(`通知失败: ${error.message}`);
        }
    }

    // ============================================================
    // 核心：创建定时任务
    // ============================================================
    createTask(name, scheduleFn, actionFn, description = '') {
        const task = {
            id: Date.now() + Math.random() * 1000,
            name: name,
            description: description,
            schedule: scheduleFn,
            action: actionFn,
            running: true,
            nextRun: null,
            lastRun: null,
            runCount: 0,
            createdAt: new Date().toISOString()
        };
        
        this.scheduledTasks.push(task);
        this.saveTasks();
        this.startScheduler();
        
        return task.id;
    }

    // ============================================================
    // 启动调度器
    // ============================================================
    startScheduler() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        this.timerId = setInterval(() => {
            this.checkAndRunTasks();
        }, 1000); // 每秒检查一次
        
        console.log('⏰ 调度器已启动');
    }

    // ============================================================
    // 检查并运行任务
    // ============================================================
    checkAndRunTasks() {
        const now = new Date();
        
        for (const task of this.scheduledTasks) {
            if (!task.running) continue;
            
            try {
                const shouldRun = task.schedule(now);
                if (shouldRun) {
                    this.executeTask(task);
                }
            } catch (error) {
                console.error(`任务 "${task.name}" 检查失败:`, error.message);
            }
        }
    }

    // ============================================================
    // 执行任务
    // ============================================================
    async executeTask(task) {
        if (task.running === false) return;
        
        try {
            task.lastRun = new Date().toISOString();
            task.runCount++;
            
            console.log(`▶️ 执行任务: ${task.name} (第${task.runCount}次)`);
            
            // 异步执行任务
            Promise.resolve(task.action()).then(() => {
                console.log(`✅ 任务完成: ${task.name}`);
            }).catch(error => {
                console.error(`❌ 任务失败: ${task.name}`, error.message);
            });
            
            // 记录历史
            this.taskHistory.unshift({
                taskId: task.id,
                taskName: task.name,
                time: new Date().toISOString(),
                status: 'executing'
            });
            
            // 限制历史记录数量
            if (this.taskHistory.length > 100) {
                this.taskHistory = this.taskHistory.slice(0, 100);
            }
            
        } catch (error) {
            console.error(`任务 "${task.name}" 执行失败:`, error.message);
            
            this.taskHistory.unshift({
                taskId: task.id,
                taskName: task.name,
                time: new Date().toISOString(),
                status: 'failed',
                error: error.message
            });
        }
    }

    // ============================================================
    // 停止调度器
    // ============================================================
    stopScheduler() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this.isRunning = false;
        console.log('⏹️ 调度器已停止');
    }

    // ============================================================
    // 保存/加载任务
    // ============================================================
    saveTasks() {
        if (!this.isDesktop) return;
        
        try {
            const data = {
                tasks: this.scheduledTasks.map(t => ({
                    id: t.id,
                    name: t.name,
                    description: t.description,
                    running: t.running,
                    runCount: t.runCount,
                    createdAt: t.createdAt,
                    // 注意：函数无法序列化，所以只保存元数据
                    // 实际任务需要重新创建
                })),
                history: this.taskHistory.slice(0, 50)
            };
            
            EditorPreload.writeFile('%DOCUMENTS%\\timer_tasks.json', JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('保存任务失败:', error.message);
        }
    }

    async loadTasks() {
        if (!this.isDesktop) return;
        
        try {
            const result = await EditorPreload.readFile('%DOCUMENTS%\\timer_tasks.json');
            if (result.success) {
                const data = JSON.parse(result.content);
                console.log(`📂 加载了 ${data.tasks?.length || 0} 个历史任务`);
                // 任务需要重新创建，只恢复元数据
            }
        } catch (error) {
            // 文件不存在时忽略
        }
    }

    // ============================================================
    // 积木方法
    // ============================================================

    // ----- 定时启动应用 -----
    async scheduleLaunchApp(args) {
        if (!this.isDesktop) {
            console.warn('⚠️ 需要桌面版');
            return;
        }

        const app = args.APP;
        const hours = Math.max(0, Math.min(23, Number(args.HOURS) || 0));
        const minutes = Math.max(0, Math.min(59, Number(args.MINUTES) || 0));

        this.createTask(
            `启动 ${app}`,
            (now) => {
                return now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() === 0;
            },
            async () => {
                const success = await this.launchApp(app);
                if (success) {
                    await this.showNotification('🚀 定时启动', `已启动应用: ${app}`);
                }
                return success;
            },
            `每天 ${hours}:${String(minutes).padStart(2,'0')} 启动 ${app}`
        );

        console.log(`✅ 已设置定时启动: ${app} 在 ${hours}:${String(minutes).padStart(2,'0')}`);
    }

    // ----- 延时启动应用 -----
    async scheduleLaunchAppDelay(args) {
        if (!this.isDesktop) return;

        const app = args.APP;
        const delay = Math.max(1, Number(args.DELAY) || 10);

        console.log(`⏱️ 将在 ${delay} 秒后启动: ${app}`);

        setTimeout(async () => {
            await this.launchApp(app);
            await this.showNotification('⏰ 延时启动', `已启动应用: ${app}`);
        }, delay * 1000);
    }

    // ----- 定时文件分析 -----
    async scheduleFileAnalysis(args) {
        if (!this.isDesktop) {
            console.warn('⚠️ 需要桌面版');
            return;
        }

        const path = args.PATH;
        const hours = Math.max(0, Math.min(23, Number(args.HOURS) || 0));
        const minutes = Math.max(0, Math.min(59, Number(args.MINUTES) || 0));

        this.createTask(
            `分析文件 ${path}`,
            (now) => {
                return now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() === 0;
            },
            async () => {
                try {
                    const result = await EditorPreload.getFileStats(path);
                    if (result.success) {
                        const stats = result.stats;
                        const size = (stats.size / 1024).toFixed(1);
                        await this.showNotification('📊 文件分析', 
                            `文件: ${path}\n大小: ${size} KB\n修改时间: ${new Date(stats.modified).toLocaleString()}`
                        );
                    }
                } catch (error) {
                    console.error('文件分析失败:', error.message);
                }
            },
            `每天 ${hours}:${String(minutes).padStart(2,'0')} 分析 ${path}`
        );

        console.log(`✅ 已设置定时分析: ${path} 在 ${hours}:${String(minutes).padStart(2,'0')}`);
    }

    // ----- 定时文件夹分析 -----
    async scheduleFolderAnalysis(args) {
        if (!this.isDesktop) return;

        const path = args.PATH;
        const hours = Math.max(0, Math.min(23, Number(args.HOURS) || 0));
        const minutes = Math.max(0, Math.min(59, Number(args.MINUTES) || 0));

        this.createTask(
            `分析文件夹 ${path}`,
            (now) => {
                return now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() === 0;
            },
            async () => {
                try {
                    const result = await EditorPreload.readLocalFolder(path);
                    if (result.success) {
                        const fileCount = result.files.filter(f => !f.isDirectory).length;
                        const folderCount = result.files.filter(f => f.isDirectory).length;
                        await this.showNotification('📁 文件夹分析',
                            `文件夹: ${path}\n📄 文件: ${fileCount}\n📁 子文件夹: ${folderCount}`
                        );
                    }
                } catch (error) {
                    console.error('文件夹分析失败:', error.message);
                }
            },
            `每天 ${hours}:${String(minutes).padStart(2,'0')} 分析文件夹`
        );

        console.log(`✅ 已设置定时文件夹分析: ${path}`);
    }

    // ----- 间隔重复启动 -----
    async repeatLaunchApp(args) {
        if (!this.isDesktop) return;

        const interval = Math.max(5, Number(args.INTERVAL) || 60);
        const app = args.APP;

        const taskId = this.createTask(
            `重复启动 ${app}`,
            (now) => {
                // 使用计数来控制间隔
                if (!this._lastRunMap) this._lastRunMap = {};
                const key = `repeat_${app}`;
                const lastRun = this._lastRunMap[key] || 0;
                const elapsed = (now.getTime() - lastRun) / 1000;
                
                if (elapsed >= interval) {
                    this._lastRunMap[key] = now.getTime();
                    return true;
                }
                return false;
            },
            async () => {
                const success = await this.launchApp(app);
                if (success) {
                    console.log(`🔄 重复启动: ${app} (间隔${interval}秒)`);
                }
                return success;
            },
            `每隔 ${interval} 秒启动 ${app}`
        );

        console.log(`✅ 已设置重复启动: ${app} 每隔 ${interval} 秒`);
    }

    // ----- 间隔检查文件 -----
    async repeatCheckFile(args) {
        if (!this.isDesktop) return;

        const interval = Math.max(5, Number(args.INTERVAL) || 30);
        const path = args.PATH;
        let lastModified = null;

        this.createTask(
            `检查文件 ${path}`,
            (now) => {
                if (!this._checkLastRun) this._checkLastRun = {};
                const key = `check_${path}`;
                const lastRun = this._checkLastRun[key] || 0;
                const elapsed = (now.getTime() - lastRun) / 1000;
                
                if (elapsed >= interval) {
                    this._checkLastRun[key] = now.getTime();
                    return true;
                }
                return false;
            },
            async () => {
                try {
                    const result = await EditorPreload.getFileStats(path);
                    if (result.success) {
                        const currentModified = result.stats.modified;
                        if (lastModified && currentModified !== lastModified) {
                            await this.showNotification('📝 文件变化', 
                                `文件 ${path} 已被修改!\n时间: ${new Date(currentModified).toLocaleString()}`
                            );
                        }
                        lastModified = currentModified;
                    }
                } catch (error) {
                    // 文件可能不存在，忽略
                }
            },
            `每隔 ${interval} 秒检查 ${path}`
        );

        console.log(`✅ 已设置文件监控: ${path}`);
    }

    // ----- 设置提醒 -----
    async scheduleReminder(args) {
        if (!this.isDesktop) return;

        const message = args.MESSAGE || '提醒';
        const hours = Math.max(0, Math.min(23, Number(args.HOURS) || 0));
        const minutes = Math.max(0, Math.min(59, Number(args.MINUTES) || 0));

        this.createTask(
            `提醒: ${message}`,
            (now) => {
                return now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() === 0;
            },
            async () => {
                await this.showNotification('⏰ 定时提醒', message);
                console.log(`🔔 提醒: ${message}`);
            },
            `每天 ${hours}:${String(minutes).padStart(2,'0')} 提醒: ${message}`
        );

        console.log(`✅ 已设置提醒: "${message}" 在 ${hours}:${String(minutes).padStart(2,'0')}`);
    }

    // ----- 重复提醒 -----
    async repeatReminder(args) {
        if (!this.isDesktop) return;

        const interval = Math.max(1, Number(args.INTERVAL) || 30);
        const message = args.MESSAGE || '提醒';

        this.createTask(
            `重复提醒: ${message}`,
            (now) => {
                if (!this._reminderLastRun) this._reminderLastRun = {};
                const key = `reminder_${message}`;
                const lastRun = this._reminderLastRun[key] || 0;
                const elapsed = (now.getTime() - lastRun) / 60000; // 分钟
                
                if (elapsed >= interval) {
                    this._reminderLastRun[key] = now.getTime();
                    return true;
                }
                return false;
            },
            async () => {
                await this.showNotification('🔔 重复提醒', message);
                console.log(`🔔 提醒: ${message}`);
            },
            `每隔 ${interval} 分钟提醒: ${message}`
        );

        console.log(`✅ 已设置重复提醒: "${message}" 每隔 ${interval} 分钟`);
    }

    // ----- 定时关机 -----
    async scheduleShutdown(args) {
        if (!this.isDesktop) {
            console.warn('⚠️ 需要桌面版');
            return;
        }

        const hours = Math.max(0, Math.min(23, Number(args.HOURS) || 0));
        const minutes = Math.max(0, Math.min(59, Number(args.MINUTES) || 0));

        // 计算距离关机还有多久
        const now = new Date();
        const target = new Date();
        target.setHours(hours, minutes, 0, 0);
        
        if (target <= now) {
            target.setDate(target.getDate() + 1);
        }

        const msUntilShutdown = target.getTime() - now.getTime();
        const secondsUntilShutdown = Math.floor(msUntilShutdown / 1000);

        console.log(`⏱️ 将在 ${secondsUntilShutdown} 秒后关机 (${hours}:${String(minutes).padStart(2,'0')})`);

        // 先发通知提醒
        setTimeout(async () => {
            await this.showNotification('⚠️ 系统关机提醒', 
                `系统将在 60 秒后关机\n当前时间: ${new Date().toLocaleString()}`
            );
        }, msUntilShutdown - 60000);

        // 执行关机
        setTimeout(async () => {
            try {
                await EditorPreload.executeCommand('shutdown /s /t 0', { timeout: 5000 });
                console.log('🖥️ 系统正在关机...');
            } catch (error) {
                console.error('关机失败:', error.message);
            }
        }, msUntilShutdown);

        console.log(`✅ 已设置定时关机: ${hours}:${String(minutes).padStart(2,'0')}`);
    }

    // ----- 定时重启 -----
    async scheduleRestart(args) {
        if (!this.isDesktop) return;

        const hours = Math.max(0, Math.min(23, Number(args.HOURS) || 0));
        const minutes = Math.max(0, Math.min(59, Number(args.MINUTES) || 0));

        const now = new Date();
        const target = new Date();
        target.setHours(hours, minutes, 0, 0);
        
        if (target <= now) {
            target.setDate(target.getDate() + 1);
        }

        const msUntilRestart = target.getTime() - now.getTime();

        console.log(`⏱️ 将在 ${Math.floor(msUntilRestart / 60000)} 分钟后重启`);

        setTimeout(async () => {
            await this.showNotification('⚠️ 系统重启提醒', 
                `系统将在 30 秒后重启\n当前时间: ${new Date().toLocaleString()}`
            );
        }, msUntilRestart - 30000);

        setTimeout(async () => {
            try {
                await EditorPreload.executeCommand('shutdown /r /t 0', { timeout: 5000 });
                console.log('🔄 系统正在重启...');
            } catch (error) {
                console.error('重启失败:', error.message);
            }
        }, msUntilRestart);

        console.log(`✅ 已设置定时重启: ${hours}:${String(minutes).padStart(2,'0')}`);
    }

    // ----- 查看所有任务 -----
    async listScheduledTasks() {
        if (this.scheduledTasks.length === 0) {
            return '📭 暂无计划任务\n\n使用 "定时启动应用" 或 "设置提醒" 添加任务';
        }

        let output = '📋 计划任务列表\n';
        output += '━'.repeat(50) + '\n\n';

        for (let i = 0; i < this.scheduledTasks.length; i++) {
            const task = this.scheduledTasks[i];
            const status = task.running ? '▶️ 运行中' : '⏹️ 已暂停';
            output += `#${i + 1} ${task.name}\n`;
            output += `   ${task.description}\n`;
            output += `   ${status} | 执行 ${task.runCount} 次\n`;
            if (task.lastRun) {
                output += `   上次执行: ${new Date(task.lastRun).toLocaleString()}\n`;
            }
            output += '\n';
        }

        output += `━`.repeat(50) + '\n';
        output += `📊 总计: ${this.scheduledTasks.length} 个任务`;
        output += ` | 历史: ${this.taskHistory.length} 条记录`;

        return output;
    }

    // ----- 取消任务 -----
    async cancelTask(args) {
        const index = Number(args.TASK_ID) - 1;
        
        if (index < 0 || index >= this.scheduledTasks.length) {
            console.error('❌ 无效的任务ID');
            return;
        }

        const task = this.scheduledTasks[index];
        task.running = false;
        this.scheduledTasks.splice(index, 1);
        
        console.log(`✅ 已取消任务: ${task.name}`);
        this.saveTasks();
    }

    // ----- 清除所有任务 -----
    async clearAllTasks() {
        this.scheduledTasks = [];
        this.taskHistory = [];
        console.log('🗑️ 已清除所有任务');
        this.saveTasks();
    }

    // ----- 暂停所有任务 -----
    async pauseAllTasks() {
        for (const task of this.scheduledTasks) {
            task.running = false;
        }
        console.log('⏸️ 已暂停所有任务');
    }

    // ----- 恢复所有任务 -----
    async resumeAllTasks() {
        for (const task of this.scheduledTasks) {
            task.running = true;
        }
        console.log('▶️ 已恢复所有任务');
        this.startScheduler();
    }

    // ----- 获取任务数量 -----
    async getTaskCount() {
        return this.scheduledTasks.length;
    }

    // ----- 获取下一个任务时间 -----
    async getNextTaskTime() {
        const now = new Date();
        let nextTime = null;
        let nextTask = null;

        for (const task of this.scheduledTasks) {
            if (!task.running) continue;
            // 简单模拟：检查未来30秒内是否会触发
            for (let i = 0; i < 30; i++) {
                const checkTime = new Date(now.getTime() + i * 1000);
                if (task.schedule(checkTime)) {
                    if (!nextTime || checkTime < nextTime) {
                        nextTime = checkTime;
                        nextTask = task;
                    }
                    break;
                }
            }
        }

        if (nextTime) {
            const seconds = Math.floor((nextTime.getTime() - now.getTime()) / 1000);
            return `⏱️ 下一个任务: ${nextTask?.name || '未知'}\n⏰ ${nextTime.toLocaleTimeString()} (${seconds}秒后)`;
        }

        return '📭 暂无即将执行的任务';
    }

    // ----- 获取任务历史 -----
    async getTaskHistory(args) {
        const num = Math.min(50, Math.max(1, Number(args.NUM) || 10));
        
        if (this.taskHistory.length === 0) {
            return '📭 暂无执行历史';
        }

        const history = this.taskHistory.slice(0, num);
        let output = '📜 任务执行历史\n';
        output += '━'.repeat(40) + '\n\n';

        for (const entry of history) {
            const statusIcon = entry.status === 'executing' ? '▶️' : '❌';
            output += `${statusIcon} ${entry.taskName}\n`;
            output += `   ${new Date(entry.time).toLocaleString()}\n`;
            if (entry.error) {
                output += `   ⚠️ ${entry.error}\n`;
            }
            output += '\n';
        }

        return output;
    }

    // ----- 工作日定时启动 -----
    async scheduleOnWeekday(args) {
        if (!this.isDesktop) return;

        const daysStr = args.DAYS || '1,2,3,4,5';
        const days = daysStr.split(',').map(Number).filter(d => d >= 0 && d <= 6);
        const app = args.APP;
        const hours = Math.max(0, Math.min(23, Number(args.HOURS) || 9));

        if (days.length === 0) {
            console.error('❌ 请选择至少一个工作日');
            return;
        }

        this.createTask(
            `工作日启动 ${app}`,
            (now) => {
                const day = now.getDay();
                return days.includes(day) && now.getHours() === hours && now.getMinutes() === 0 && now.getSeconds() === 0;
            },
            async () => {
                const success = await this.launchApp(app);
                if (success) {
                    await this.showNotification('🚀 工作日启动', 
                        `已启动应用: ${app}\n星期${['日','一','二','三','四','五','六'][new Date().getDay()]}`
                    );
                }
                return success;
            },
            `工作日 (${days.join(',')}) ${hours}:00 启动 ${app}`
        );

        console.log(`✅ 已设置工作日启动: ${app} 在 ${hours}:00 (${days.join(',')})`);
    }

    // ----- 判断当前时间是否在范围内 -----
    async isTimeBetween(args) {
        const startH = Number(args.START_H) || 0;
        const startM = Number(args.START_M) || 0;
        const endH = Number(args.END_H) || 0;
        const endM = Number(args.END_M) || 0;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        if (startMinutes <= endMinutes) {
            return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
        } else {
            // 跨午夜的情况
            return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
        }
    }

    // ============================================================
    // 清理资源
    // ============================================================
    dispose() {
        this.stopScheduler();
        this.scheduledTasks = [];
        this.taskHistory = [];
        this.saveTasks();
        console.log('🧹 定时操作器已清理');
    }
}

// ============================================================
// 注册扩展
// ============================================================
if (typeof Scratch !== 'undefined') {
    const extension = new TimerSchedulerExtension();
    Scratch.extensions.register(extension);

    console.log('⏰ 定时操作器扩展已加载');
    console.log('📋 使用 "定时启动应用"、"设置提醒" 等积木创建任务');
    console.log('📂 任务配置保存在: %DOCUMENTS%\\timer_tasks.json');
}