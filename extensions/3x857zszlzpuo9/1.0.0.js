// ============================================================
// 电脑高级控制扩展 - System Control Extension
// 版本: 2.0.0
// 描述: 关机、重启、休眠、注销、锁定、音量、亮度、时间等
// 权限: system-command, file-write, hardware-status, draw-window
// ============================================================

class SystemControlExtension {
    constructor() {
        this.isDesktop = typeof EditorPreload !== 'undefined';
        this.isAdmin = false;
        this.volumeLevel = 50;
        this.brightnessLevel = 80;
        this.overlayWindowId = 'system-control-hud';
        this.monitorInterval = null;
        this.lastKnownState = {};
        
        // 检测管理员权限
        this.checkAdminRights();
    }

    // ============================================================
    // getInfo() - 扩展元信息
    // ============================================================
    getInfo() {
        return {
            id: 'systemControl',
            name: '🖥️ 电脑高级控制',
            color1: '#7C4DFF',
            color2: '#651FFF',
            color3: '#4A148C',

            permissions: [
                'system-command',
                'file-write',
                'hardware-status',
                'draw-window'
            ],

            blocks: [
                // ==========================================
                // 1. 电源控制
                // ==========================================
                {
                    opcode: 'shutdownSystem',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🖥️ 关机 [DELAY] 秒后',
                    arguments: {
                        DELAY: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'restartSystem',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🔄 重启 [DELAY] 秒后',
                    arguments: {
                        DELAY: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'hibernateSystem',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '💤 休眠 [DELAY] 秒后',
                    arguments: {
                        DELAY: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 5
                        }
                    }
                },
                {
                    opcode: 'sleepSystem',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '😴 睡眠 [DELAY] 秒后',
                    arguments: {
                        DELAY: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 5
                        }
                    }
                },
                {
                    opcode: 'logoutSystem',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🚪 注销用户 [DELAY] 秒后',
                    arguments: {
                        DELAY: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'lockSystem',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🔒 锁定电脑'
                },

                // ==========================================
                // 2. 音量控制
                // ==========================================
                {
                    opcode: 'setVolume',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🔊 设置音量 [LEVEL] %',
                    arguments: {
                        LEVEL: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'getVolume',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '📢 获取当前音量'
                },
                {
                    opcode: 'volumeUp',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🔊 音量增加 [STEP] %',
                    arguments: {
                        STEP: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'volumeDown',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🔈 音量减少 [STEP] %',
                    arguments: {
                        STEP: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'muteVolume',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🔇 静音/取消静音'
                },
                {
                    opcode: 'isMuted',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '🔇 是否静音?'
                },

                // ==========================================
                // 3. 亮度控制
                // ==========================================
                {
                    opcode: 'setBrightness',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '☀️ 设置亮度 [LEVEL] %',
                    arguments: {
                        LEVEL: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 80
                        }
                    }
                },
                {
                    opcode: 'getBrightness',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '☀️ 获取当前亮度'
                },
                {
                    opcode: 'brightnessUp',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '☀️ 亮度增加 [STEP] %',
                    arguments: {
                        STEP: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'brightnessDown',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🌙 亮度减少 [STEP] %',
                    arguments: {
                        STEP: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },

                // ==========================================
                // 4. 时间与日期
                // ==========================================
                {
                    opcode: 'setSystemTime',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '⏰ 设置系统时间为 [HOURS] 时 [MINUTES] 分',
                    arguments: {
                        HOURS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 12
                        },
                        MINUTES: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setSystemDate',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📅 设置系统日期为 [YEAR] 年 [MONTH] 月 [DAY] 日',
                    arguments: {
                        YEAR: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 2026
                        },
                        MONTH: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 6
                        },
                        DAY: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 21
                        }
                    }
                },
                {
                    opcode: 'syncTimeWithNTP',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🌐 同步网络时间'
                },
                {
                    opcode: 'getSystemTime',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '⏰ 获取当前系统时间'
                },
                {
                    opcode: 'getSystemDate',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '📅 获取当前系统日期'
                },

                // ==========================================
                // 5. 显示器控制
                // ==========================================
                {
                    opcode: 'turnOffMonitor',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🖥️ 关闭显示器'
                },
                {
                    opcode: 'turnOnMonitor',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🖥️ 打开显示器'
                },
                {
                    opcode: 'setScreenSaver',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🖼️ 设置屏保时间为 [MINUTES] 分钟',
                    arguments: {
                        MINUTES: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 5
                        }
                    }
                },

                // ==========================================
                // 6. 系统状态查询
                // ==========================================
                {
                    opcode: 'getSystemUptime',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '⏱️ 系统运行时间'
                },
                {
                    opcode: 'getSystemInfo',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '💻 获取系统信息'
                },
                {
                    opcode: 'isAdmin',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '👑 是否管理员权限?'
                },
                {
                    opcode: 'checkSystemHealth',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '🏥 系统健康检查'
                },

                // ==========================================
                // 7. 桌面控制
                // ==========================================
                {
                    opcode: 'showDesktop',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🖥️ 显示桌面'
                },
                {
                    opcode: 'minimizeAllWindows',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📉 最小化所有窗口'
                },
                {
                    opcode: 'openTaskManager',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '⚙️ 打开任务管理器'
                },

                // ==========================================
                // 8. 高级控制（需要管理员权限）
                // ==========================================
                {
                    opcode: 'formatDrive',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '⚠️ 格式化 [DRIVE] 盘 ⚠️',
                    arguments: {
                        DRIVE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'drives',
                            defaultValue: 'D:'
                        }
                    }
                },
                {
                    opcode: 'cleanTempFiles',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🧹 清理临时文件'
                },
                {
                    opcode: 'emptyRecycleBin',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🗑️ 清空回收站'
                },

                // ==========================================
                // 9. 系统监控悬浮窗
                // ==========================================
                {
                    opcode: 'showSystemHUD',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📊 显示系统监控面板'
                },
                {
                    opcode: 'hideSystemHUD',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📊 隐藏系统监控面板'
                },
                {
                    opcode: 'updateSystemHUD',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📊 刷新监控面板'
                },

                // ==========================================
                // 10. 警告与确认
                // ==========================================
                {
                    opcode: 'confirmAction',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '用户确认了 [MESSAGE] ?',
                    arguments: {
                        MESSAGE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '确认执行此操作？'
                        }
                    }
                },
                {
                    opcode: 'countdownWarning',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '⏰ 倒计时警告 [SECONDS] 秒 [MESSAGE]',
                    arguments: {
                        SECONDS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        MESSAGE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '即将执行操作！'
                        }
                    }
                }
            ],

            menus: {
                drives: {
                    acceptReporters: true,
                    items: [
                        { text: 'C: 盘 (系统盘)', value: 'C:' },
                        { text: 'D: 盘', value: 'D:' },
                        { text: 'E: 盘', value: 'E:' },
                        { text: 'F: 盘', value: 'F:' },
                        { text: 'G: 盘', value: 'G:' }
                    ]
                }
            }
        };
    }

    // ============================================================
    // 工具方法
    // ============================================================

    // 检查管理员权限
    async checkAdminRights() {
        if (!this.isDesktop) return;
        try {
            const result = await EditorPreload.executeCommand(
                'net session',
                { timeout: 3000 }
            );
            this.isAdmin = result.success;
        } catch (error) {
            this.isAdmin = false;
        }
    }

    // 显示通知
    async showNotification(title, body, isWarning = false) {
        if (!this.isDesktop) return;
        try {
            await EditorPreload.showNotification({
                title: isWarning ? `⚠️ ${title}` : title,
                body: body,
                silent: false
            });
        } catch (error) {
            console.error('通知失败:', error.message);
        }
    }

    // 执行系统命令
    async execCommand(command, timeout = 10000) {
        if (!this.isDesktop) return { success: false, error: '需要桌面版' };
        try {
            return await EditorPreload.executeCommand(command, { timeout });
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 延迟函数
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 格式化时间
    formatTime(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (days > 0) return `${days}天 ${hours}时 ${minutes}分`;
        if (hours > 0) return `${hours}时 ${minutes}分 ${secs}秒`;
        if (minutes > 0) return `${minutes}分 ${secs}秒`;
        return `${secs}秒`;
    }

    // ============================================================
    // 1. 电源控制方法
    // ============================================================

    // 关机
    async shutdownSystem(args) {
        if (!this.isDesktop) return;
        
        const delay = Math.max(0, Number(args.DELAY) || 10);
        
        if (delay > 0) {
            await this.showNotification(
                '🖥️ 系统关机提醒',
                `系统将在 ${delay} 秒后关机\n请保存所有工作！`,
                true
            );
            await this.countdownWarning({ SECONDS: delay, MESSAGE: '系统即将关机！' });
        }
        
        const result = await this.execCommand(`shutdown /s /t ${delay}`);
        if (result.success) {
            console.log(`✅ 系统将在 ${delay} 秒后关机`);
        } else {
            console.error('❌ 关机失败:', result.error);
            await this.showNotification('❌ 关机失败', result.error, true);
        }
    }

    // 重启
    async restartSystem(args) {
        if (!this.isDesktop) return;
        
        const delay = Math.max(0, Number(args.DELAY) || 10);
        
        if (delay > 0) {
            await this.showNotification(
                '🔄 系统重启提醒',
                `系统将在 ${delay} 秒后重启\n请保存所有工作！`,
                true
            );
            await this.countdownWarning({ SECONDS: delay, MESSAGE: '系统即将重启！' });
        }
        
        const result = await this.execCommand(`shutdown /r /t ${delay}`);
        if (result.success) {
            console.log(`✅ 系统将在 ${delay} 秒后重启`);
        } else {
            console.error('❌ 重启失败:', result.error);
        }
    }

    // 休眠
    async hibernateSystem(args) {
        if (!this.isDesktop) return;
        
        const delay = Math.max(0, Number(args.DELAY) || 5);
        
        if (delay > 0) {
            await this.showNotification(
                '💤 系统休眠提醒',
                `系统将在 ${delay} 秒后进入休眠状态`,
                true
            );
            await this.sleep(delay * 1000);
        }
        
        const result = await this.execCommand('shutdown /h');
        if (result.success) {
            console.log('✅ 系统进入休眠');
        } else {
            console.error('❌ 休眠失败:', result.error);
        }
    }

    // 睡眠
    async sleepSystem(args) {
        if (!this.isDesktop) return;
        
        const delay = Math.max(0, Number(args.DELAY) || 5);
        
        if (delay > 0) {
            await this.showNotification(
                '😴 系统睡眠提醒',
                `系统将在 ${delay} 秒后进入睡眠状态`,
                true
            );
            await this.sleep(delay * 1000);
        }
        
        const result = await this.execCommand('rundll32.exe powrprof.dll,SetSuspendState 0,1,0');
        if (result.success) {
            console.log('✅ 系统进入睡眠');
        } else {
            console.error('❌ 睡眠失败:', result.error);
        }
    }

    // 注销
    async logoutSystem(args) {
        if (!this.isDesktop) return;
        
        const delay = Math.max(0, Number(args.DELAY) || 10);
        
        if (delay > 0) {
            await this.showNotification(
                '🚪 用户注销提醒',
                `将在 ${delay} 秒后注销当前用户\n请保存所有工作！`,
                true
            );
            await this.countdownWarning({ SECONDS: delay, MESSAGE: '即将注销用户！' });
        }
        
        const result = await this.execCommand(`shutdown /l /t ${delay}`);
        if (result.success) {
            console.log(`✅ 将在 ${delay} 秒后注销`);
        } else {
            console.error('❌ 注销失败:', result.error);
        }
    }

    // 锁定
    async lockSystem() {
        if (!this.isDesktop) return;
        
        const result = await this.execCommand('rundll32.exe user32.dll,LockWorkStation');
        if (result.success) {
            console.log('✅ 电脑已锁定');
            await this.showNotification('🔒 电脑已锁定', '系统已锁定，需要密码解锁');
        } else {
            console.error('❌ 锁定失败:', result.error);
        }
    }

    // ============================================================
    // 2. 音量控制方法
    // ============================================================

    // 设置音量
    async setVolume(args) {
        if (!this.isDesktop) return;
        
        const level = Math.max(0, Math.min(100, Number(args.LEVEL) || 0));
        this.volumeLevel = level;
        
        // 使用 nircmd 或 PowerShell 设置音量
        const command = `powershell -command "(New-Object -ComObject Wscript.Shell).SendKeys([char]175)"`;
        // 更精确的方法：使用 Windows 音频 API
        // 简化版本：使用 nircmd（需要安装）或系统音量键模拟
        
        // 使用 PowerShell 调用 Windows 音频 API
        const psCommand = `
            Add-Type -TypeDefinition '
                using System.Runtime.InteropServices;
                public class Audio {
                    [DllImport("user32.dll")]
                    public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, uint dwExtraInfo);
                }
            ';
            $vol = ${level};
            $vol = [math]::Round($vol / 1.25);
            $vol = [math]::Min($vol, 100);
            # 模拟音量键（简化）
        `;
        
        const result = await this.execCommand(
            `powershell -command "Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Internet Explorer\\LowRegistry\\Audio\\PolicyConfig\\PropertyStore\\*' -Name 'Volume' -Value ${level}"`,
            5000
        );
        
        // 备用方案：使用 nircmd
        // await this.execCommand(`nircmd.exe setvolume 0 ${level}`);
        
        console.log(`🔊 音量已设置为: ${level}%`);
    }

    // 获取音量
    async getVolume() {
        if (!this.isDesktop) return this.volumeLevel;
        
        try {
            const result = await this.execCommand(
                'powershell -command "Get-ItemProperty -Path \'HKCU:\\Software\\Microsoft\\Internet Explorer\\LowRegistry\\Audio\\PolicyConfig\\PropertyStore\\*\' -Name \'Volume\' | Select-Object -ExpandProperty Volume"',
                5000
            );
            
            if (result.success && result.stdout) {
                const vol = parseInt(result.stdout.trim());
                if (!isNaN(vol)) {
                    this.volumeLevel = Math.min(100, Math.max(0, vol));
                    return this.volumeLevel;
                }
            }
        } catch (error) {
            // 忽略错误
        }
        
        return this.volumeLevel;
    }

    // 音量增加
    async volumeUp(args) {
        const step = Math.max(1, Number(args.STEP) || 10);
        const current = await this.getVolume();
        const newLevel = Math.min(100, current + step);
        await this.setVolume({ LEVEL: newLevel });
        console.log(`🔊 音量 +${step}% -> ${newLevel}%`);
    }

    // 音量减少
    async volumeDown(args) {
        const step = Math.max(1, Number(args.STEP) || 10);
        const current = await this.getVolume();
        const newLevel = Math.max(0, current - step);
        await this.setVolume({ LEVEL: newLevel });
        console.log(`🔈 音量 -${step}% -> ${newLevel}%`);
    }

    // 静音切换
    async muteVolume() {
        if (!this.isDesktop) return;
        
        const result = await this.execCommand(
            'powershell -command "(New-Object -ComObject Wscript.Shell).SendKeys([char]173)"'
        );
        
        if (result.success) {
            console.log('🔇 静音已切换');
        }
    }

    // 是否静音
    async isMuted() {
        if (!this.isDesktop) return false;
        
        try {
            const result = await this.execCommand(
                'powershell -command "Get-ItemProperty -Path \'HKCU:\\Software\\Microsoft\\Internet Explorer\\LowRegistry\\Audio\\PolicyConfig\\PropertyStore\\*\' -Name \'Muted\' | Select-Object -ExpandProperty Muted"',
                5000
            );
            
            if (result.success && result.stdout) {
                return result.stdout.trim() === '1';
            }
        } catch (error) {
            // 忽略错误
        }
        
        return false;
    }

    // ============================================================
    // 3. 亮度控制方法
    // ============================================================

    // 设置亮度
    async setBrightness(args) {
        if (!this.isDesktop) return;
        
        const level = Math.max(0, Math.min(100, Number(args.LEVEL) || 0));
        this.brightnessLevel = level;
        
        // Windows 亮度控制（需要 WMI）
        try {
            // 方法1: 使用 PowerShell 和 WMI
            const result = await this.execCommand(
                `powershell -command "Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods | ForEach-Object { $_.WmiSetBrightness(0, ${level}) }"`,
                5000
            );
            
            if (result.success) {
                console.log(`☀️ 亮度已设置为: ${level}%`);
                return;
            }
        } catch (error) {
            // 忽略错误，尝试备用方法
        }
        
        // 方法2: 使用 nircmd
        try {
            await this.execCommand(`nircmd.exe setbrightness ${level}`);
            console.log(`☀️ 亮度已设置为: ${level}%`);
        } catch (error) {
            console.warn('⚠️ 亮度控制需要管理员权限或nircmd');
        }
    }

    // 获取亮度
    async getBrightness() {
        if (!this.isDesktop) return this.brightnessLevel;
        
        try {
            const result = await this.execCommand(
                'powershell -command "Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightness | Select-Object -ExpandProperty CurrentBrightness"',
                5000
            );
            
            if (result.success && result.stdout) {
                const brightness = parseInt(result.stdout.trim());
                if (!isNaN(brightness)) {
                    this.brightnessLevel = Math.min(100, Math.max(0, brightness));
                    return this.brightnessLevel;
                }
            }
        } catch (error) {
            // 忽略错误
        }
        
        return this.brightnessLevel;
    }

    // 亮度增加
    async brightnessUp(args) {
        const step = Math.max(1, Number(args.STEP) || 10);
        const current = await this.getBrightness();
        const newLevel = Math.min(100, current + step);
        await this.setBrightness({ LEVEL: newLevel });
        console.log(`☀️ 亮度 +${step}% -> ${newLevel}%`);
    }

    // 亮度减少
    async brightnessDown(args) {
        const step = Math.max(1, Number(args.STEP) || 10);
        const current = await this.getBrightness();
        const newLevel = Math.max(0, current - step);
        await this.setBrightness({ LEVEL: newLevel });
        console.log(`🌙 亮度 -${step}% -> ${newLevel}%`);
    }

    // ============================================================
    // 4. 时间与日期控制
    // ============================================================

    // 设置系统时间
    async setSystemTime(args) {
        if (!this.isDesktop) return;
        
        const hours = Math.max(0, Math.min(23, Number(args.HOURS) || 0));
        const minutes = Math.max(0, Math.min(59, Number(args.MINUTES) || 0));
        
        const result = await this.execCommand(`time ${hours}:${String(minutes).padStart(2, '0')}`);
        
        if (result.success) {
            console.log(`⏰ 系统时间已设置为: ${hours}:${String(minutes).padStart(2, '0')}`);
            await this.showNotification('⏰ 时间已更新', `${hours}:${String(minutes).padStart(2, '0')}`);
        } else {
            console.error('❌ 设置时间失败:', result.error);
        }
    }

    // 设置系统日期
    async setSystemDate(args) {
        if (!this.isDesktop) return;
        
        const year = Number(args.YEAR) || 2026;
        const month = Math.max(1, Math.min(12, Number(args.MONTH) || 1));
        const day = Math.max(1, Math.min(31, Number(args.DAY) || 1));
        
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const result = await this.execCommand(`date ${dateStr}`);
        
        if (result.success) {
            console.log(`📅 系统日期已设置为: ${dateStr}`);
            await this.showNotification('📅 日期已更新', dateStr);
        } else {
            console.error('❌ 设置日期失败:', result.error);
        }
    }

    // 同步网络时间
    async syncTimeWithNTP() {
        if (!this.isDesktop) return;
        
        await this.showNotification('🌐 正在同步网络时间...', '请稍候...');
        
        const result = await this.execCommand(
            'powershell -command "Set-Date -Adjust (Get-Date -Date (Invoke-RestMethod -Uri \'https://timeapi.org/api/utc/now\'))"',
            10000
        );
        
        if (result.success) {
            console.log('✅ 网络时间同步成功');
            await this.showNotification('✅ 时间同步成功', '系统时间已与网络时间同步');
        } else {
            // 备用方法：使用 w32tm
            const backupResult = await this.execCommand(
                'w32tm /resync /force',
                10000
            );
            
            if (backupResult.success) {
                console.log('✅ 网络时间同步成功 (w32tm)');
                await this.showNotification('✅ 时间同步成功', '系统时间已与网络时间同步');
            } else {
                console.error('❌ 时间同步失败');
                await this.showNotification('❌ 时间同步失败', '请检查网络连接', true);
            }
        }
    }

    // 获取系统时间
    async getSystemTime() {
        const now = new Date();
        return now.toLocaleTimeString('zh-CN', { hour12: false });
    }

    // 获取系统日期
    async getSystemDate() {
        const now = new Date();
        return now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    // ============================================================
    // 5. 显示器控制
    // ============================================================

    // 关闭显示器
    async turnOffMonitor() {
        if (!this.isDesktop) return;
        
        await this.showNotification('🖥️ 显示器关闭', '显示器将在3秒后关闭...');
        await this.sleep(3000);
        
        // 使用 Windows API 关闭显示器
        const result = await this.execCommand(
            'powershell -command "Add-Type -TypeDefinition \'using System;using System.Runtime.InteropServices;public class Monitor{[DllImport(\"user32.dll\")]public static extern int SendMessage(int hWnd,int Msg,int wParam,int lParam);public static void Off(){SendMessage(0xFFFF,0x0112,0xF170,2);}}\';[Monitor]::Off()"',
            5000
        );
        
        if (result.success) {
            console.log('✅ 显示器已关闭');
        } else {
            console.error('❌ 关闭显示器失败:', result.error);
        }
    }

    // 打开显示器
    async turnOnMonitor() {
        if (!this.isDesktop) return;
        
        // 移动鼠标或模拟按键唤醒显示器
        const result = await this.execCommand(
            'powershell -command "[System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(100,100)"',
            5000
        );
        
        if (result.success) {
            console.log('✅ 显示器已唤醒');
            await this.showNotification('🖥️ 显示器已打开', '显示器已唤醒');
        }
    }

    // 设置屏保时间
    async setScreenSaver(args) {
        if (!this.isDesktop) return;
        
        const minutes = Math.max(0, Number(args.MINUTES) || 5);
        
        // 设置屏保等待时间（注册表）
        const result = await this.execCommand(
            `reg add "HKEY_CURRENT_USER\\Control Panel\\Desktop" /v ScreenSaveTimeOut /t REG_SZ /d ${minutes * 60} /f`,
            5000
        );
        
        if (result.success) {
            console.log(`✅ 屏保时间已设置为 ${minutes} 分钟`);
            await this.showNotification('🖼️ 屏保设置', `屏保将在 ${minutes} 分钟后启动`);
        } else {
            console.error('❌ 设置屏保失败:', result.error);
        }
    }

    // ============================================================
    // 6. 系统状态查询
    // ============================================================

    // 获取系统运行时间
    async getSystemUptime() {
        if (!this.isDesktop) return '需要桌面版';
        
        try {
            const result = await this.execCommand(
                'powershell -command "(Get-CimInstance -ClassName Win32_OperatingSystem).LastBootUpTime"',
                5000
            );
            
            if (result.success && result.stdout) {
                const bootTime = new Date(result.stdout.trim());
                const uptime = (Date.now() - bootTime.getTime()) / 1000;
                return `⏱️ 运行时间: ${this.formatTime(uptime)}\n🔄 上次启动: ${bootTime.toLocaleString()}`;
            }
        } catch (error) {
            // 备用方法
            try {
                const result2 = await this.execCommand('systeminfo | find "系统启动时间"');
                if (result2.success) {
                    return result2.stdout.trim();
                }
            } catch (e) {
                // 忽略
            }
        }
        
        return '无法获取运行时间';
    }

    // 获取系统信息
    async getSystemInfo() {
        if (!this.isDesktop) return '需要桌面版';
        
        try {
            const results = await Promise.all([
                this.execCommand('wmic os get Caption,Version,BuildNumber /value', 5000),
                this.execCommand('wmic cpu get Name,NumberOfCores,MaxClockSpeed /value', 5000),
                this.execCommand('wmic memorychip get Capacity /value', 5000)
            ]);
            
            let info = '💻 系统信息\n';
            info += '━'.repeat(40) + '\n\n';
            
            // OS信息
            const os = results[0];
            if (os.success) {
                const lines = os.stdout.split('\n');
                const caption = lines.find(l => l.includes('Caption='))?.split('=')[1]?.trim() || 'Windows';
                const version = lines.find(l => l.includes('Version='))?.split('=')[1]?.trim() || '';
                const build = lines.find(l => l.includes('BuildNumber='))?.split('=')[1]?.trim() || '';
                info += `🖥️ 系统: ${caption} ${version} (Build ${build})\n`;
            }
            
            // CPU信息
            const cpu = results[1];
            if (cpu.success) {
                const lines = cpu.stdout.split('\n');
                const name = lines.find(l => l.includes('Name='))?.split('=')[1]?.trim() || '未知';
                const cores = lines.find(l => l.includes('NumberOfCores='))?.split('=')[1]?.trim() || '?';
                const speed = lines.find(l => l.includes('MaxClockSpeed='))?.split('=')[1]?.trim() || '?';
                info += `💻 CPU: ${name}\n`;
                info += `   🔢 核心数: ${cores} | ⚡ 主频: ${speed} MHz\n`;
            }
            
            // 内存信息
            const mem = results[2];
            if (mem.success) {
                const lines = mem.stdout.split('\n');
                let totalMemory = 0;
                for (const line of lines) {
                    if (line.includes('Capacity=')) {
                        const cap = parseInt(line.split('=')[1]?.trim() || '0');
                        if (!isNaN(cap)) totalMemory += cap;
                    }
                }
                const totalGB = (totalMemory / 1073741824).toFixed(1);
                info += `🧠 内存: ${totalGB} GB\n`;
            }
            
            // 管理员权限
            info += `👑 管理员权限: ${this.isAdmin ? '✅ 是' : '❌ 否'}\n`;
            
            info += `\n📅 ${new Date().toLocaleString()}`;
            
            return info;
        } catch (error) {
            return `❌ 获取系统信息失败: ${error.message}`;
        }
    }

    // 是否管理员
    async isAdmin() {
        return this.isAdmin;
    }

    // 系统健康检查
    async checkSystemHealth() {
        if (!this.isDesktop) return '需要桌面版';
        
        const health = [];
        
        try {
            // 检查磁盘空间
            const diskResult = await this.execCommand(
                'wmic logicaldisk where DriveType=3 get DeviceID,FreeSpace,Size /format:csv',
                5000
            );
            
            if (diskResult.success) {
                const lines = diskResult.stdout.split('\n').filter(l => l.includes(':'));
                for (const line of lines) {
                    const parts = line.split(',');
                    if (parts.length >= 3) {
                        const drive = parts[0]?.trim();
                        const free = parseInt(parts[1]?.trim() || '0');
                        const total = parseInt(parts[2]?.trim() || '1');
                        const usage = total > 0 ? Math.round((1 - free / total) * 100) : 0;
                        const status = usage > 90 ? '⚠️ 空间不足' : usage > 70 ? '🟡 注意' : '✅ 正常';
                        health.push(`📁 ${drive}: ${usage}% 使用 ${status}`);
                    }
                }
            }
            
            // 检查内存使用
            const memResult = await this.execCommand(
                'powershell -command "$os = Get-CimInstance -ClassName Win32_OperatingSystem; [math]::Round((($os.TotalVisibleMemorySize - $os.FreePhysicalMemory) / $os.TotalVisibleMemorySize) * 100)"',
                5000
            );
            
            if (memResult.success && memResult.stdout) {
                const memUsage = parseInt(memResult.stdout.trim());
                const status = memUsage > 90 ? '⚠️ 内存不足' : memUsage > 70 ? '🟡 注意' : '✅ 正常';
                health.push(`🧠 内存: ${memUsage}% 使用 ${status}`);
            }
            
            // 检查CPU使用
            const cpuResult = await this.execCommand(
                'powershell -command "Get-CimInstance -ClassName Win32_Processor | Select-Object -ExpandProperty LoadPercentage"',
                5000
            );
            
            if (cpuResult.success && cpuResult.stdout) {
                const cpuUsage = parseInt(cpuResult.stdout.trim());
                const status = cpuUsage > 90 ? '⚠️ CPU高负载' : cpuUsage > 70 ? '🟡 注意' : '✅ 正常';
                health.push(`💻 CPU: ${cpuUsage}% 使用 ${status}`);
            }
            
        } catch (error) {
            health.push(`❌ 检查失败: ${error.message}`);
        }
        
        if (health.length === 0) {
            return '🏥 系统健康: ✅ 检查完成，未发现问题';
        }
        
        return '🏥 系统健康检查\n' + '━'.repeat(40) + '\n\n' + health.join('\n');
    }

    // ============================================================
    // 7. 桌面控制
    // ============================================================

    // 显示桌面
    async showDesktop() {
        if (!this.isDesktop) return;
        
        const result = await this.execCommand(
            'powershell -command "(New-Object -ComObject Wscript.Shell).SendKeys([char]92+[char]77)"'
        );
        
        if (result.success) {
            console.log('✅ 已显示桌面');
        }
    }

    // 最小化所有窗口
    async minimizeAllWindows() {
        if (!this.isDesktop) return;
        
        const result = await this.execCommand(
            'powershell -command "$shell = New-Object -ComObject Shell.Application; $shell.MinimizeAll()"'
        );
        
        if (result.success) {
            console.log('✅ 所有窗口已最小化');
        }
    }

    // 打开任务管理器
    async openTaskManager() {
        if (!this.isDesktop) return;
        
        const result = await this.execCommand('start taskmgr');
        if (result.success) {
            console.log('✅ 任务管理器已打开');
        }
    }

    // ============================================================
    // 8. 高级控制（需要管理员权限）
    // ============================================================

    // 格式化磁盘（危险操作！）
    async formatDrive(args) {
        if (!this.isDesktop) return;
        
        if (!this.isAdmin) {
            await this.showNotification('❌ 需要管理员权限', '格式化操作需要管理员权限', true);
            return;
        }
        
        const drive = args.DRIVE || 'D:';
        
        // 确认对话框
        const confirmed = confirm(`⚠️ 警告：您确定要格式化 ${drive} 盘吗？\n此操作将删除所有数据！\n\n确定要继续吗？`);
        if (!confirmed) {
            console.log('❌ 用户取消格式化');
            return;
        }
        
        await this.showNotification(
            '⚠️ 严重警告',
            `即将格式化 ${drive} 盘，所有数据将被删除！\n10秒内取消...`,
            true
        );
        
        await this.countdownWarning({ SECONDS: 10, MESSAGE: `格式化 ${drive} 盘` });
        
        const result = await this.execCommand(`format ${drive} /Q /X /Y`);
        
        if (result.success) {
            console.log(`✅ ${drive} 盘格式化完成`);
            await this.showNotification('✅ 格式化完成', `${drive} 盘已格式化`);
        } else {
            console.error('❌ 格式化失败:', result.error);
            await this.showNotification('❌ 格式化失败', result.error, true);
        }
    }

    // 清理临时文件
    async cleanTempFiles() {
        if (!this.isDesktop) return;
        
        await this.showNotification('🧹 正在清理临时文件...', '请稍候...');
        
        const result = await this.execCommand(
            'powershell -command "Get-ChildItem -Path $env:TEMP -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue; Get-ChildItem -Path C:\\Windows\\Temp -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue"',
            30000
        );
        
        if (result.success) {
            console.log('✅ 临时文件清理完成');
            await this.showNotification('✅ 清理完成', '临时文件已清理');
        } else {
            console.error('❌ 清理失败:', result.error);
        }
    }

    // 清空回收站
    async emptyRecycleBin() {
        if (!this.isDesktop) return;
        
        const result = await this.execCommand(
            'powershell -command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"',
            10000
        );
        
        if (result.success) {
            console.log('🗑️ 回收站已清空');
            await this.showNotification('🗑️ 回收站已清空', '所有回收站文件已删除');
        } else {
            console.error('❌ 清空回收站失败:', result.error);
        }
    }

    // ============================================================
    // 9. 系统监控悬浮窗
    // ============================================================

    // 显示系统监控面板
    async showSystemHUD() {
        if (!this.isDesktop) return;
        
        try {
            await EditorPreload.createOverlayWindow(
                this.overlayWindowId,
                1150, 10, 420, 280
            );
            
            await this.updateSystemHUD();
            
            // 启动自动更新
            if (this.monitorInterval) {
                clearInterval(this.monitorInterval);
            }
            this.monitorInterval = setInterval(() => {
                this.updateSystemHUD();
            }, 3000);
            
            console.log('📊 系统监控面板已显示');
        } catch (error) {
            console.error('❌ 显示监控面板失败:', error.message);
        }
    }

    // 隐藏系统监控面板
    async hideSystemHUD() {
        if (!this.isDesktop) return;
        
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
        
        try {
            await EditorPreload.closeOverlayWindow(this.overlayWindowId);
            console.log('📊 系统监控面板已隐藏');
        } catch (error) {
            console.error('❌ 隐藏监控面板失败:', error.message);
        }
    }

    // 更新监控面板
    async updateSystemHUD() {
        if (!this.isDesktop) return;
        
        try {
            // 并行获取数据
            const [cpuResult, memResult, diskResult, batResult] = await Promise.all([
                EditorPreload.getHardwareStatus('cpu'),
                EditorPreload.getHardwareStatus('memory'),
                EditorPreload.getHardwareStatus('disk'),
                EditorPreload.getHardwareStatus('battery')
            ]);
            
            const cpu = cpuResult.data || { usage: 0 };
            const mem = memResult.data || { total: 1, used: 0, usage: 0 };
            const bat = batResult.data || { hasBattery: false, level: 0, charging: false };
            
            // 获取磁盘使用率
            let diskUsage = 0;
            if (diskResult.success && diskResult.data.disks && diskResult.data.disks.length > 0) {
                const systemDisk = diskResult.data.disks.find(d => d.drive === 'C:') || diskResult.data.disks[0];
                diskUsage = systemDisk.usage || 0;
            }
            
            const cpuColor = cpu.usage > 80 ? '#f44336' : cpu.usage > 60 ? '#ff9800' : '#4caf50';
            const memColor = mem.usage > 80 ? '#f44336' : mem.usage > 60 ? '#ff9800' : '#2196f3';
            const diskColor = diskUsage > 80 ? '#f44336' : diskUsage > 60 ? '#ff9800' : '#9c27b0';
            
            const memTotalGB = (mem.total / 1073741824).toFixed(1);
            const memUsedGB = (mem.used / 1073741824).toFixed(1);
            
            const html = `
                <div style="
                    padding: 15px 20px;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    color: #fff;
                    border-radius: 15px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
                    font-size: 13px;
                    border: 1px solid rgba(255,255,255,0.1);
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 12px;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                        padding-bottom: 8px;
                    ">
                        <span style="font-size: 16px; font-weight: bold;">🖥️ 系统监控</span>
                        <span style="font-size: 11px; color: #888;">${new Date().toLocaleTimeString()}</span>
                    </div>
                    
                    <!-- CPU -->
                    <div style="margin: 5px 0;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>🔲 CPU</span>
                            <span style="color: ${cpuColor}; font-weight: bold;">${cpu.usage}%</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; overflow: hidden; margin-top: 2px;">
                            <div style="width: ${cpu.usage}%; background: ${cpuColor}; height: 100%; transition: width 0.5s;"></div>
                        </div>
                    </div>
                    
                    <!-- 内存 -->
                    <div style="margin: 5px 0;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>💾 内存</span>
                            <span style="color: ${memColor}; font-weight: bold;">${memUsedGB} / ${memTotalGB} GB</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; overflow: hidden; margin-top: 2px;">
                            <div style="width: ${mem.usage}%; background: ${memColor}; height: 100%; transition: width 0.5s;"></div>
                        </div>
                    </div>
                    
                    <!-- 磁盘 -->
                    <div style="margin: 5px 0;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>💿 磁盘 (C:)</span>
                            <span style="color: ${diskColor}; font-weight: bold;">${diskUsage}%</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; overflow: hidden; margin-top: 2px;">
                            <div style="width: ${diskUsage}%; background: ${diskColor}; height: 100%; transition: width 0.5s;"></div>
                        </div>
                    </div>
                    
                    ${bat.hasBattery ? `
                        <div style="margin: 5px 0; display: flex; justify-content: space-between; padding: 4px 8px; background: rgba(255,255,255,0.05); border-radius: 5px;">
                            <span>🔋 电池</span>
                            <span>${bat.level}% ${bat.charging ? '⚡充电中' : ''}</span>
                        </div>
                    ` : ''}
                    
                    <div style="
                        margin-top: 10px;
                        display: flex;
                        justify-content: space-between;
                        font-size: 10px;
                        color: #666;
                        border-top: 1px solid rgba(255,255,255,0.05);
                        padding-top: 8px;
                    ">
                        <span>💻 ${this.isAdmin ? '管理员' : '普通用户'}</span>
                        <span>📦 ${this.scheduledTasks ? this.scheduledTasks.length : 0} 任务</span>
                    </div>
                </div>
            `;
            
            await EditorPreload.setOverlayContent(this.overlayWindowId, html);
            
        } catch (error) {
            console.error('更新监控面板失败:', error.message);
        }
    }

    // ============================================================
    // 10. 警告与确认
    // ============================================================

    // 用户确认
    async confirmAction(args) {
        const message = args.MESSAGE || '确认执行此操作？';
        return confirm(message);
    }

    // 倒计时警告
    async countdownWarning(args) {
        const seconds = Math.max(1, Number(args.SECONDS) || 5);
        const message = args.MESSAGE || '即将执行操作！';
        
        for (let i = seconds; i > 0; i--) {
            console.log(`⏰ 倒计时: ${i} 秒 - ${message}`);
            if (i <= 5) {
                await this.showNotification(
                    `⏰ ${i}秒倒计时`,
                    `${message}\n剩余 ${i} 秒`,
                    i <= 3
                );
            }
            await this.sleep(1000);
        }
        
        console.log(`⏰ 倒计时结束: ${message}`);
    }

    // ============================================================
    // 清理资源
    // ============================================================
    dispose() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
        
        if (this.isDesktop) {
            EditorPreload.closeOverlayWindow(this.overlayWindowId);
        }
        
        console.log('🧹 电脑高级控制已清理');
    }
}

// ============================================================
// 注册扩展
// ============================================================
if (typeof Scratch !== 'undefined') {
    const extension = new SystemControlExtension();
    Scratch.extensions.register(extension);

    console.log('🖥️ 电脑高级控制扩展已加载');
    console.log('📋 支持: 关机/重启/休眠/音量/亮度/时间/监控等');
    console.log('👑 管理员权限:', extension.isAdmin ? '✅ 是' : '❌ 否');
    console.log('⚠️ 危险操作需要管理员权限');
}

// 导出（用于模块化开发）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SystemControlExtension;
}