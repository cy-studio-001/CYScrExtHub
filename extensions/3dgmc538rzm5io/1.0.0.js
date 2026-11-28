(function (_Scratch) {
    const { ArgumentType, BlockType, Cast, translate, extensions, runtime } = _Scratch;

    translate.setup({
        zh: {
            extName: "通用弹窗",
            openDialog: "打开弹窗 标题 [TITLE] 内容 [CONTENT] 按钮 [BTN_TEXT]",
            showSelection: "弹出选择弹窗 标题 [TITLE] 选项列表 [JSON]",
            showButtonSelection: "弹出按钮选择弹窗 标题 [TITLE] 选项列表 [JSON]",
            showTabs: "打开选项卡弹窗 标题 [TITLE] 选项卡 [TABS_JSON]",
            showTextInput: "弹出文本输入框 标题 [TITLE] 提示 [PROMPT] 默认值 [DEFAULT]",
            showConfirm: "弹出确认对话框 标题 [TITLE] 内容 [CONTENT]",
            showRating: "弹出评级弹窗 标题 [TITLE]",
            showSlider: "弹出滑块 标题 [TITLE] 最小值 [MIN] 最大值 [MAX] 默认 [VAL]",
            showPasswordInput: "弹出密码输入 标题 [TITLE] 提示 [PROMPT]",
            showDateInput: "弹出日期选择 标题 [TITLE]",
            showLottery: "弹出抽奖弹窗 标题 [TITLE] 选项列表 [JSON]",
            showToast: "弹出提示消息 内容 [TEXT] 持续 [SEC] 秒 位置 [POSITION]",
            showImage: "打开图片弹窗 图片链接 [URL] 标题 [TITLE]",
            openProgress: "打开加载弹窗 标题 [TITLE] 进度 [PROGRESS] 自动关闭 [AUTO_CLOSE] 延迟秒数 [DELAY]",
            updateProgress: "更新加载进度 [PROGRESS]",
            getProgress: "获取加载进度",
            updateProgressTitle: "更新进度条标题 [TEXT]",
            showDrawing: "弹出画板 标题 [TITLE] 图片 [IMAGE]",
            updateTitle: "更新弹窗标题 [TEXT]",
            updateContent: "更新弹窗内容 [TEXT]",
            updateImage: "更新图片链接 [URL]",
            setButtonColors: "设置按钮颜色 确认 [CONFIRM_COLOR] 取消 [CANCEL_COLOR]",
            setDialogBg: "设置弹窗背景颜色 [COLOR]",
            applySettings: "弹窗设置 弹窗圆角 [RADIUS] px 弹窗阴影强度 [SHADOW] 遮罩透明度 [ALPHA] 字体缩放比例 [SCALE] 主题 [THEME]",
            applyLayoutSettings: "弹窗设置 弹窗宽度 [WIDTH] px 弹窗高度 [HEIGHT] px 弹窗动画类型 [TYPE]",
            closeDialog: "关闭当前弹窗",
            getSetting: "获取 [OPTION]",
            applySettingsFromJSON: "把 [JSON] 覆盖到弹窗设置",
            getLastInput: "上一个弹窗的输入",
            showCppCompiler: "弹出在线C++编译器",
            getLastProgramResult: "上一个程序弹窗的最后一次运行结果",
            getLastProgramCode: "最后一段程序",
            getLastProgramLanguage: "上一个程序弹窗的编程语言",
            isValidImage: "字符串 [TEXT] 能否作为图片显示？",
            showMultiLineInput: "弹出多行文本输入框 标题 [TITLE] 提示 [PROMPT] 默认值 [DEFAULT]",
            showFilePicker: "弹出文件选择器 标题 [TITLE]"
        }
    });

    class SimpleDialog {
        constructor(runtime) {
            this.runtime = runtime;
            this.maskDom = null;
            this.dialogBox = null;
            this.isOpen = false;
            this.closing = false;
            this.maskAlpha = 0.35;
            this.fontScale = 1;
            this.isDarkTheme = false;
            this.dialogWidth = 0;
            this.dialogHeight = 0;
            this.lastResult = "";
            this.lastProgramResult = "";
            this.lastProgramCode = "";
            this.lastProgramLanguage = "";
            this.progressDom = null;
            this.progressBar = null;
            this.progressText = null;
            this.currentProgress = -1;
            this.toastTimer = null;
            this.activeToast = null;
            this.currentTitleEl = null;
            this.currentContentEl = null;
            this.confirmBtnColor = "#4a90e2";
            this.cancelBtnColor = "#888888";
            this.customBg = "";
            this.customRadius = 20;
            this.shadowLevel = 5;
            this.animationType = "弹入";
            // 队列相关
            this.queue = [];
            this.running = false;
            this.currentItem = null;
            // 进度条自动关闭相关
            this.progressAutoClose = false;
            this.progressCloseDelay = 0;
            this.progressCloseTimer = null;
            this.progressClosedTriggered = false;
        }

        getInfo() {
            const animationMenu = {
                items: [
                    { text: "弹入", value: "弹入" },
                    { text: "翻转", value: "翻转" },
                    { text: "缩放", value: "缩放" },
                    { text: "无", value: "无" }
                ]
            };
            const themeMenu = {
                items: [
                    { text: "浅色", value: "浅色" },
                    { text: "深色", value: "深色" }
                ]
            };
            const settingOptionMenu = {
                items: [
                    { text: "确认按钮颜色", value: "confirmColor" },
                    { text: "取消按钮颜色", value: "cancelColor" },
                    { text: "弹窗背景颜色", value: "bgColor" },
                    { text: "弹窗圆角", value: "radius" },
                    { text: "弹窗阴影强度", value: "shadow" },
                    { text: "遮罩透明度", value: "alpha" },
                    { text: "字体缩放比例", value: "scale" },
                    { text: "主题", value: "theme" },
                    { text: "弹窗宽度", value: "width" },
                    { text: "弹窗高度", value: "height" },
                    { text: "弹窗动画类型", value: "animation" },
                    { text: "JSON", value: "json" }
                ]
            };
            const toastPositionMenu = {
                items: [
                    { text: "左上", value: "左上" },
                    { text: "左下", value: "左下" },
                    { text: "中上", value: "中上" },
                    { text: "中下", value: "中下" },
                    { text: "右上", value: "右上" },
                    { text: "右下", value: "右下" }
                ]
            };
            // 自动关闭下拉菜单
            const autoCloseMenu = {
                items: [
                    { text: "否", value: "false" },
                    { text: "是", value: "true" }
                ]
            };
            return {
                id: "UPU",
                name: translate({ id: "extName" }),
                color1: "#5B8DEF",
                color2: "#4267B2",
                blocks: [
                    // ========== 基础弹窗 ==========
                    { blockType: BlockType.LABEL, text: "基础弹窗" },
                    { opcode: "openDialog", blockType: BlockType.COMMAND, text: translate({ id: "openDialog" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "通知" }, CONTENT: { type: ArgumentType.STRING, defaultValue: "这里填写弹窗正文，支持**粗体**和换行。" }, BTN_TEXT: { type: ArgumentType.STRING, defaultValue: "我知道了" } } },
                    { opcode: "showToast", blockType: BlockType.COMMAND, text: translate({ id: "showToast" }), arguments: { TEXT: { type: ArgumentType.STRING, defaultValue: "操作成功" }, SEC: { type: ArgumentType.NUMBER, defaultValue: "2" }, POSITION: { type: ArgumentType.STRING, menu: "toastPositionMenu", defaultValue: "右上" } } },
                    { opcode: "showImage", blockType: BlockType.COMMAND, text: translate({ id: "showImage" }), arguments: { URL: { type: ArgumentType.STRING, defaultValue: "https://example.com/image.png" }, TITLE: { type: ArgumentType.STRING, defaultValue: "图片展示" } } },
                    { opcode: "showTabs", blockType: BlockType.COMMAND, text: translate({ id: "showTabs" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "选项卡" }, TABS_JSON: { type: ArgumentType.STRING, defaultValue: '[{"新闻":"今日头条：\\n**重要更新**已发布"},{"公告":"系统将于 22:00 进行维护"}]' } } },
                    { opcode: "isValidImage", blockType: BlockType.REPORTER, text: translate({ id: "isValidImage" }), arguments: { TEXT: { type: ArgumentType.STRING, defaultValue: "https://example.com/image.png" } } },

                    // ========== 交互弹窗 ==========
                    { blockType: BlockType.LABEL, text: "交互弹窗" },
                    { opcode: "showTextInput", blockType: BlockType.COMMAND, text: translate({ id: "showTextInput" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "请输入" }, PROMPT: { type: ArgumentType.STRING, defaultValue: "请输入内容" }, DEFAULT: { type: ArgumentType.STRING, defaultValue: "" } } },
                    { opcode: "showPasswordInput", blockType: BlockType.COMMAND, text: translate({ id: "showPasswordInput" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "输入密码" }, PROMPT: { type: ArgumentType.STRING, defaultValue: "请输入密码" } } },
                    { opcode: "showDateInput", blockType: BlockType.COMMAND, text: translate({ id: "showDateInput" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "选择日期" } } },
                    { opcode: "showDrawing", blockType: BlockType.COMMAND, text: translate({ id: "showDrawing" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "画板" }, IMAGE: { type: ArgumentType.STRING, defaultValue: "" } } },
                    { opcode: "showSelection", blockType: BlockType.COMMAND, text: translate({ id: "showSelection" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "请选择一个选项" }, JSON: { type: ArgumentType.STRING, defaultValue: '{"选项A":"显示文字A","选项B":"显示文字B"}' } } },
                    { opcode: "showButtonSelection", blockType: BlockType.COMMAND, text: translate({ id: "showButtonSelection" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "请选择一个选项" }, JSON: { type: ArgumentType.STRING, defaultValue: '{"选项A":"显示文字A","选项B":"显示文字B"}' } } },
                    { opcode: "showRating", blockType: BlockType.COMMAND, text: translate({ id: "showRating" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "请评分" } } },
                    { opcode: "showSlider", blockType: BlockType.COMMAND, text: translate({ id: "showSlider" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "请选择" }, MIN: { type: ArgumentType.NUMBER, defaultValue: "0" }, MAX: { type: ArgumentType.NUMBER, defaultValue: "100" }, VAL: { type: ArgumentType.NUMBER, defaultValue: "50" } } },
                    { opcode: "showConfirm", blockType: BlockType.COMMAND, text: translate({ id: "showConfirm" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "确认操作" }, CONTENT: { type: ArgumentType.STRING, defaultValue: "确定要执行该操作吗？" } } },
                    { opcode: "showLottery", blockType: BlockType.COMMAND, text: translate({ id: "showLottery" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "抽奖转盘" }, JSON: { type: ArgumentType.STRING, defaultValue: '{"prize1":[30,"一等奖"],"prize2":[50,"二等奖"],"prize3":[20,"三等奖"]}' } } },
                    { opcode: "showMultiLineInput", blockType: BlockType.COMMAND, text: translate({ id: "showMultiLineInput" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "请输入" }, PROMPT: { type: ArgumentType.STRING, defaultValue: "请输入多行内容" }, DEFAULT: { type: ArgumentType.STRING, defaultValue: "" } } },
                    { opcode: "showFilePicker", blockType: BlockType.COMMAND, text: translate({ id: "showFilePicker" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "选择文件" } } },

                    // ========== 程序弹窗 ==========
                    { blockType: BlockType.LABEL, text: "程序弹窗" },
                    { opcode: "showCppCompiler", blockType: BlockType.COMMAND, text: translate({ id: "showCppCompiler" }), arguments: {} },
                    { opcode: "getLastProgramResult", blockType: BlockType.REPORTER, text: translate({ id: "getLastProgramResult" }), arguments: {} },
                    { opcode: "getLastProgramCode", blockType: BlockType.REPORTER, text: translate({ id: "getLastProgramCode" }), arguments: {} },
                    { opcode: "getLastProgramLanguage", blockType: BlockType.REPORTER, text: translate({ id: "getLastProgramLanguage" }), arguments: {} },

                    // ========== 进度条 ==========
                    { blockType: BlockType.LABEL, text: "进度条" },
                    // AUTO_CLOSE 改为下拉菜单
                    { opcode: "openProgress", blockType: BlockType.COMMAND, text: translate({ id: "openProgress" }), arguments: { TITLE: { type: ArgumentType.STRING, defaultValue: "加载中" }, PROGRESS: { type: ArgumentType.NUMBER, defaultValue: "-1" }, AUTO_CLOSE: { type: ArgumentType.STRING, menu: "autoCloseMenu", defaultValue: "false" }, DELAY: { type: ArgumentType.NUMBER, defaultValue: "0" } } },
                    { opcode: "updateProgress", blockType: BlockType.COMMAND, text: translate({ id: "updateProgress" }), arguments: { PROGRESS: { type: ArgumentType.NUMBER, defaultValue: "50" } } },
                    { opcode: "getProgress", blockType: BlockType.REPORTER, text: translate({ id: "getProgress" }), arguments: {} },
                    { opcode: "updateProgressTitle", blockType: BlockType.COMMAND, text: translate({ id: "updateProgressTitle" }), arguments: { TEXT: { type: ArgumentType.STRING, defaultValue: "新进度标题" } } },

                    // ========== 高级设置 ==========
                    { blockType: BlockType.LABEL, text: "高级设置" },
                    { opcode: "setButtonColors", blockType: BlockType.COMMAND, text: translate({ id: "setButtonColors" }), arguments: { CONFIRM_COLOR: { type: ArgumentType.STRING, defaultValue: "#4a90e2" }, CANCEL_COLOR: { type: ArgumentType.STRING, defaultValue: "#888888" } } },
                    { opcode: "setDialogBg", blockType: BlockType.COMMAND, text: translate({ id: "setDialogBg" }), arguments: { COLOR: { type: ArgumentType.STRING, defaultValue: "linear-gradient(135deg, #667eea, #764ba2)" } } },
                    { opcode: "applySettings", blockType: BlockType.COMMAND, text: translate({ id: "applySettings" }), arguments: { RADIUS: { type: ArgumentType.NUMBER, defaultValue: "20" }, SHADOW: { type: ArgumentType.NUMBER, defaultValue: "5" }, ALPHA: { type: ArgumentType.NUMBER, defaultValue: "0.35" }, SCALE: { type: ArgumentType.NUMBER, defaultValue: "1" }, THEME: { type: ArgumentType.STRING, menu: "themeMenu", defaultValue: "浅色" } } },
                    { opcode: "applyLayoutSettings", blockType: BlockType.COMMAND, text: translate({ id: "applyLayoutSettings" }), arguments: { WIDTH: { type: ArgumentType.NUMBER, defaultValue: "0" }, HEIGHT: { type: ArgumentType.NUMBER, defaultValue: "0" }, TYPE: { type: ArgumentType.STRING, menu: "animationMenu", defaultValue: "弹入" } } },
                    { opcode: "updateTitle", blockType: BlockType.COMMAND, text: translate({ id: "updateTitle" }), arguments: { TEXT: { type: ArgumentType.STRING, defaultValue: "新标题" } } },
                    { opcode: "updateContent", blockType: BlockType.COMMAND, text: translate({ id: "updateContent" }), arguments: { TEXT: { type: ArgumentType.STRING, defaultValue: "新内容" } } },
                    { opcode: "updateImage", blockType: BlockType.COMMAND, text: translate({ id: "updateImage" }), arguments: { URL: { type: ArgumentType.STRING, defaultValue: "https://example.com/image.png" } } },
                    { opcode: "closeDialog", blockType: BlockType.COMMAND, text: translate({ id: "closeDialog" }), arguments: {} },
                    { opcode: "getSetting", blockType: BlockType.REPORTER, text: translate({ id: "getSetting" }), arguments: { OPTION: { type: ArgumentType.STRING, menu: "settingOptionMenu", defaultValue: "confirmColor" } } },
                    { opcode: "applySettingsFromJSON", blockType: BlockType.COMMAND, text: translate({ id: "applySettingsFromJSON" }), arguments: { JSON: { type: ArgumentType.STRING, defaultValue: '{"按钮颜色":{"确认":"#4a90e2","取消":"#888888"},"弹窗背景颜色":"linear-gradient(135deg, #667eea, #764ba2)","弹窗圆角":20,"弹窗阴影强度":5,"遮罩透明度":0.35,"字体缩放比例":1,"主题":"浅色","弹窗宽度":0,"弹窗高度":0,"弹窗动画类型":"弹入"}' } } },
                    { opcode: "getLastInput", blockType: BlockType.REPORTER, text: translate({ id: "getLastInput" }), arguments: {} }
                ],
                menus: { animationMenu, themeMenu, settingOptionMenu, toastPositionMenu, autoCloseMenu }
            };
        }

        // ---------- 工具函数 ----------
        escapeHtml(str) {
            if (!str) return "";
            return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        }

        parseRichText(text) {
            if (!text) return "暂无内容";
            let res = this.escapeHtml(text);
            res = res.replace(/\\n/g, "<br>");
            res = res.replace(/\*\*(.+?)\*\*/g, `<strong style="color:inherit;">$1</strong>`);
            res = res.replace(/\n/g, "<br>");
            return res;
        }

        isValidColor(value) {
            if (!value || typeof value !== "string") return false;
            const v = value.trim().toLowerCase();
            if (/url\s*\(|javascript\s*:|expression\s*\(|<|>/.test(v)) return false;
            return true;
        }

        isValidImageUrl(url) {
            if (!url || typeof url !== "string") return false;
            if (/^(javascript|data|vbscript):/i.test(url) && !/^data:image\//i.test(url)) return false;
            if (/^https:\/\/.+/.test(url) && !/["']/.test(url)) return true;
            if (/^data:image\/[^;]+;base64,/.test(url)) return true;
            return false;
        }

        isValidImage(args) {
            return this.isValidImageUrl(Cast.toString(args.TEXT)) ? "true" : "false";
        }

        // ---------- 队列管理（阻塞执行） ----------
        _enqueue(opcode, args) {
            return new Promise((resolve) => {
                this.queue.push({ opcode, args, resolve });
                this._runNextFromQueue();
            });
        }

        _runNextFromQueue() {
            if (this.running) return;
            if (this.queue.length === 0) return;
            if (this.isOpen) return;

            this.running = true;
            const item = this.queue.shift();
            this.currentItem = item;

            const method = this[`_${item.opcode}`];
            if (typeof method !== 'function') {
                console.warn(`未知的弹窗类型: ${item.opcode}`);
                item.resolve();
                this.currentItem = null;
                this.running = false;
                this._runNextFromQueue();
                return;
            }

            Promise.resolve(method.call(this, item.args))
                .then(() => {
                    item.resolve();
                })
                .catch((err) => {
                    console.error('弹窗执行出错:', err);
                    item.resolve();
                })
                .finally(() => {
                    this.currentItem = null;
                    this.running = false;
                    this._runNextFromQueue();
                });
        }

        // ---------- 核心关闭方法（会触发队列继续） ----------
        closeAll() {
            if (this.closing) return;
            this.closing = true;

            // 清除进度条自动关闭定时器
            if (this.progressCloseTimer) {
                clearTimeout(this.progressCloseTimer);
                this.progressCloseTimer = null;
            }
            this.progressClosedTriggered = false;

            // 清除 Toast 计时器
            if (this.toastTimer) {
                clearTimeout(this.toastTimer);
                this.toastTimer = null;
            }
            if (this.activeToast && this.activeToast.parentNode) {
                this.activeToast.style.opacity = '0';
                this.activeToast.style.transform = 'translateY(-20px)';
                const toast = this.activeToast;
                setTimeout(() => {
                    if (toast.parentNode) toast.remove();
                    if (this.activeToast === toast) this.activeToast = null;
                }, 300);
            }

            // 关闭弹窗遮罩
            if (this.maskDom && this.maskDom.parentNode) {
                this.maskDom.style.opacity = '0';
                if (this.dialogBox) {
                    this.dialogBox.style.opacity = '0';
                    this.dialogBox.style.transform = 'scale(0.9)';
                }
                const mask = this.maskDom;
                const dialog = this.dialogBox;
                setTimeout(() => {
                    if (mask.parentNode) mask.remove();
                    this.maskDom = null;
                    this.dialogBox = null;
                    this.isOpen = false;
                    this.currentTitleEl = null;
                    this.currentContentEl = null;
                    this.closing = false;
                    this.progressDom = null;
                    this.progressBar = null;
                    this.progressText = null;
                    this.currentProgress = -1;
                    this._runNextFromQueue();
                }, 350);
            } else {
                this.maskDom = null;
                this.dialogBox = null;
                this.isOpen = false;
                this.currentTitleEl = null;
                this.currentContentEl = null;
                this.closing = false;
                this.progressDom = null;
                this.progressBar = null;
                this.progressText = null;
                this.currentProgress = -1;
                this._runNextFromQueue();
            }
        }

        closeProgress() {
            this.progressDom = null;
            this.progressBar = null;
            this.progressText = null;
            this.currentProgress = -1;
        }

        // ---------- 创建遮罩与弹窗 ----------
        createMask() {
            const mask = document.createElement("div");
            mask.style.cssText = `position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,${this.maskAlpha});z-index:99999;display:flex;align-items:center;justify-content:center;padding:15px 0;box-sizing:border-box;backdrop-filter:blur(${this.isDarkTheme?'6px':'4px'});-webkit-backdrop-filter:blur(${this.isDarkTheme?'6px':'4px'});opacity:0;transition:opacity 0.3s ease;`;
            requestAnimationFrame(() => {
                mask.style.opacity = '1';
            });
            document.body.appendChild(mask);
            this.maskDom = mask;
            return mask;
        }

        getAnimationCSS() {
            switch (this.animationType) {
                case "弹入": return "animation: fadeInDialog 0.3s cubic-bezier(0.16,1,0.3,1);";
                case "翻转": return "animation: flipInDialog 0.4s ease-out;";
                case "缩放": return "animation: scaleInDialog 0.3s ease-out;";
                case "无": default: return "";
            }
        }

        createDialogBox(contentHtml) {
            const box = document.createElement("div");
            const isDark = this.isDarkTheme;
            const bg = this.customBg || (isDark ? "linear-gradient(135deg, rgba(30,34,48,0.9), rgba(20,24,38,0.95))" : "linear-gradient(135deg, rgba(255,255,255,0.88), rgba(245,247,255,0.92))");
            const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const radius = this.customRadius + "px";
            const shadow1 = `0 ${20 + this.shadowLevel}px ${50 + this.shadowLevel * 5}px rgba(0,0,0,${0.3 + this.shadowLevel * 0.03})`;
            const shadow2 = isDark ? "inset 0 1px 0 rgba(255,255,255,0.08)" : "inset 0 1px 0 rgba(255,255,255,0.9)";
            let widthStyle = this.dialogWidth > 0 ? `width:${this.dialogWidth}px;max-width:none;min-width:auto;` : "width:70vw;max-width:900px;min-width:400px;";
            let heightStyle = this.dialogHeight > 0 ? `height:${this.dialogHeight}px;max-height:none;overflow-y:auto;` : "max-height:85vh;overflow-y:auto;";
            const animationCSS = this.getAnimationCSS();
            box.style.cssText = `${widthStyle}${heightStyle}background:${bg};color:${textColor};border-radius:${radius};padding:28px 28px;box-sizing:border-box;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;position:relative;transform:scale(${this.fontScale});transform-origin:center top;border:1px solid rgba(255,255,255,0.1);box-shadow:${shadow1},${shadow2};backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);${animationCSS}opacity:0;transition:opacity 0.3s ease, transform 0.3s ease;cursor:default;`;
            requestAnimationFrame(() => {
                box.style.opacity = '1';
                if (this.animationType === "无") {
                    box.style.transform = `scale(${this.fontScale})`;
                }
            });
            box.innerHTML = contentHtml;
            this.currentTitleEl = box.querySelector('.dialog-title');
            this.currentContentEl = box.querySelector('.dialog-content');
            this.dialogBox = box;
            return box;
        }

        _openDialogInternal(title, content, btnText, icon = "") {
            if (this.isOpen) return;
            this.isOpen = true;
            const dark = this.isDarkTheme;
            const titleColor = dark ? "#f0f0f0" : "#1a1a1a";
            const contentColor = dark ? "#c0c0c0" : "#444444";
            const iconHtml = icon ? `<span style="margin-right:8px;">${icon}</span>` : "";
            const html = `<div style="text-align:center;margin-bottom:20px;"><h2 class="dialog-title" style="margin:0;font-size:24px;font-weight:600;color:${titleColor};text-shadow:0 2px 4px rgba(0,0,0,0.1);">${iconHtml}${this.escapeHtml(title)}</h2></div><div class="dialog-content" style="font-size:16px;line-height:1.8;color:${contentColor};margin-bottom:28px;word-break:break-word;overflow-wrap:break-word;">${this.parseRichText(content)}</div><div style="text-align:center;"><button id="dialog-close-btn" style="padding:12px 48px;font-size:16px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.2);">${this.escapeHtml(btnText)}</button></div>`;
            const mask = this.createMask();
            const dialog = this.createDialogBox(html);
            mask.appendChild(dialog);
            dialog.querySelector("#dialog-close-btn").onclick = () => this.closeAll();
        }

        // ---------- 交互弹窗（阻塞） ----------
        openDialog(args) { return this._enqueue('openDialog', args); }
        async _openDialog(args) {
            this.isOpen = true;
            const title = Cast.toString(args.TITLE);
            const content = Cast.toString(args.CONTENT);
            const btnText = Cast.toString(args.BTN_TEXT);
            const dark = this.isDarkTheme;
            const titleColor = dark ? "#f0f0f0" : "#1a1a1a";
            const contentColor = dark ? "#c0c0c0" : "#444444";
            const html = `<div style="text-align:center;margin-bottom:20px;"><h2 class="dialog-title" style="margin:0;font-size:24px;font-weight:600;color:${titleColor};text-shadow:0 2px 4px rgba(0,0,0,0.1);">${this.escapeHtml(title)}</h2></div><div class="dialog-content" style="font-size:16px;line-height:1.8;color:${contentColor};margin-bottom:28px;word-break:break-word;overflow-wrap:break-word;">${this.parseRichText(content)}</div><div style="text-align:center;"><button id="dialog-close-btn" style="padding:12px 48px;font-size:16px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.2);">${this.escapeHtml(btnText)}</button></div>`;
            const mask = this.createMask();
            const dialog = this.createDialogBox(html);
            mask.appendChild(dialog);
            await new Promise((resolve) => {
                dialog.querySelector("#dialog-close-btn").onclick = () => { this.closeAll(); resolve(); };
                mask.addEventListener("click", (e) => { if (e.target === mask) { this.closeAll(); resolve(); } });
            });
        }

        // 更新标题、内容、图片（不阻塞）
        updateTitle(args) { if (this.currentTitleEl) this.currentTitleEl.innerHTML = this.escapeHtml(Cast.toString(args.TEXT)); }
        updateContent(args) { if (this.currentContentEl) this.currentContentEl.innerHTML = this.parseRichText(Cast.toString(args.TEXT)); }
        updateImage(args) {
            const url = Cast.toString(args.URL) || "";
            if (!this.isValidImageUrl(url)) return;
            if (this.dialogBox) {
                const img = this.dialogBox.querySelector('#image-display');
                if (img) img.src = url;
            }
        }

        setButtonColors(args) {
            const c1 = Cast.toString(args.CONFIRM_COLOR) || "#4a90e2";
            const c2 = Cast.toString(args.CANCEL_COLOR) || "#888888";
            if (this.isValidColor(c1)) this.confirmBtnColor = c1;
            if (this.isValidColor(c2)) this.cancelBtnColor = c2;
        }

        setDialogBg(args) {
            const bg = Cast.toString(args.COLOR) || "";
            if (this.isValidColor(bg)) this.customBg = bg;
        }

        applySettings(args) {
            this.customRadius = Math.max(0, Cast.toNumber(args.RADIUS));
            this.shadowLevel = Math.max(1, Math.min(10, Cast.toNumber(args.SHADOW)));
            this.maskAlpha = Math.max(0, Math.min(0.9, Cast.toNumber(args.ALPHA)));
            this.fontScale = Math.max(0.6, Math.min(1.8, Cast.toNumber(args.SCALE)));
            this.isDarkTheme = (Cast.toString(args.THEME) === "深色");
        }

        applyLayoutSettings(args) {
            this.dialogWidth = Math.max(0, Cast.toNumber(args.WIDTH));
            this.dialogHeight = Math.max(0, Cast.toNumber(args.HEIGHT));
            this.animationType = Cast.toString(args.TYPE);
        }

        parseOptions(jsonStr) {
            let data;
            try { data = JSON.parse(jsonStr); } catch (e) { return [{ label: "JSON格式错误", key: "" }]; }
            const options = [];
            if (Array.isArray(data)) { 
                data.forEach(item => { 
                    if (item && typeof item.label === "string" && item.hasOwnProperty("key")) 
                        options.push({ label: this.escapeHtml(String(item.label)), key: String(item.key) }); 
                }); 
            }
            else if (typeof data === "object" && data !== null) { 
                Object.entries(data).forEach(([key, value]) => { 
                    options.push({ label: this.escapeHtml(String(value)), key: String(key) }); 
                }); 
            }
            else return [{ label: "不支持的格式", key: "" }];
            return options.length ? options : [{ label: "无选项", key: "" }];
        }

        getSetting(args) {
            const option = Cast.toString(args.OPTION);
            switch (option) {
                case "confirmColor": return this.confirmBtnColor;
                case "cancelColor": return this.cancelBtnColor;
                case "bgColor": return this.customBg || (this.isDarkTheme ? "linear-gradient(135deg, rgba(30,34,48,0.9), rgba(20,24,38,0.95))" : "linear-gradient(135deg, rgba(255,255,255,0.88), rgba(245,247,255,0.92))");
                case "radius": return this.customRadius;
                case "shadow": return this.shadowLevel;
                case "alpha": return this.maskAlpha;
                case "scale": return this.fontScale;
                case "theme": return this.isDarkTheme ? "深色" : "浅色";
                case "width": return this.dialogWidth;
                case "height": return this.dialogHeight;
                case "animation": return this.animationType;
                case "json": {
                    const settings = {
                        "按钮颜色": { "确认": this.confirmBtnColor, "取消": this.cancelBtnColor },
                        "弹窗背景颜色": this.customBg || (this.isDarkTheme ? "linear-gradient(135deg, rgba(30,34,48,0.9), rgba(20,24,38,0.95))" : "linear-gradient(135deg, rgba(255,255,255,0.88), rgba(245,247,255,0.92))"),
                        "弹窗圆角": this.customRadius,
                        "弹窗阴影强度": this.shadowLevel,
                        "遮罩透明度": this.maskAlpha,
                        "字体缩放比例": this.fontScale,
                        "主题": this.isDarkTheme ? "深色" : "浅色",
                        "弹窗宽度": this.dialogWidth,
                        "弹窗高度": this.dialogHeight,
                        "弹窗动画类型": this.animationType
                    };
                    return JSON.stringify(settings);
                }
                default: return "";
            }
        }

        applySettingsFromJSON(args) {
            const jsonStr = Cast.toString(args.JSON);
            let obj;
            try { obj = JSON.parse(jsonStr); } catch (e) { return; }
            if (!obj || typeof obj !== "object") return;

            if (obj["按钮颜色"] && typeof obj["按钮颜色"] === "object") {
                const confirmColor = obj["按钮颜色"]["确认"];
                const cancelColor = obj["按钮颜色"]["取消"];
                if (typeof confirmColor === "string" && this.isValidColor(confirmColor)) this.confirmBtnColor = confirmColor;
                if (typeof cancelColor === "string" && this.isValidColor(cancelColor)) this.cancelBtnColor = cancelColor;
            }

            if (typeof obj["弹窗背景颜色"] === "string" && this.isValidColor(obj["弹窗背景颜色"])) {
                this.customBg = obj["弹窗背景颜色"];
            }

            if (typeof obj["弹窗圆角"] !== "undefined") {
                const radius = Number(obj["弹窗圆角"]);
                if (!isNaN(radius) && radius >= 0) this.customRadius = radius;
            }

            if (typeof obj["弹窗阴影强度"] !== "undefined") {
                const shadow = Number(obj["弹窗阴影强度"]);
                if (!isNaN(shadow) && shadow >= 1 && shadow <= 10) this.shadowLevel = shadow;
            }

            if (typeof obj["遮罩透明度"] !== "undefined") {
                const alpha = Number(obj["遮罩透明度"]);
                if (!isNaN(alpha) && alpha >= 0 && alpha <= 0.9) this.maskAlpha = alpha;
            }

            if (typeof obj["字体缩放比例"] !== "undefined") {
                const scale = Number(obj["字体缩放比例"]);
                if (!isNaN(scale) && scale >= 0.6 && scale <= 1.8) this.fontScale = scale;
            }

            if (typeof obj["主题"] === "string") {
                if (obj["主题"] === "深色") this.isDarkTheme = true;
                else if (obj["主题"] === "浅色") this.isDarkTheme = false;
            }

            if (typeof obj["弹窗宽度"] !== "undefined") {
                const w = Number(obj["弹窗宽度"]);
                if (!isNaN(w)) this.dialogWidth = w > 0 ? w : 0;
            }

            if (typeof obj["弹窗高度"] !== "undefined") {
                const h = Number(obj["弹窗高度"]);
                if (!isNaN(h)) this.dialogHeight = h > 0 ? h : 0;
            }

            if (typeof obj["弹窗动画类型"] === "string") {
                const validAnimations = ["弹入", "翻转", "缩放", "无"];
                if (validAnimations.includes(obj["弹窗动画类型"])) {
                    this.animationType = obj["弹窗动画类型"];
                }
            }
        }

        loadImage(dataURL) {
            return new Promise((resolve, reject) => {
                if (!dataURL || typeof dataURL !== 'string') {
                    reject(new Error('无效的图片数据'));
                    return;
                }
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('图片加载失败，请检查数据格式'));
                img.src = dataURL;
            });
        }

        // ---------- 所有交互弹窗实现（阻塞） ----------
        showSelection(args) { return this._enqueue('showSelection', args); }
        async _showSelection(args) {
            this.isOpen = true;
            const title = Cast.toString(args.TITLE) || "请选择一个选项";
            const jsonStr = Cast.toString(args.JSON) || "{}"; 
            const options = this.parseOptions(jsonStr);
            const isDark = this.isDarkTheme; 
            const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const bgInput = isDark ? "rgba(42,45,58,0.8)" : "rgba(245,246,250,0.8)";
            const borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
            let selectHtml = options.map(opt => `<option value="${opt.key}">${opt.label}</option>`).join("");
            const html = `<h3 class="dialog-title" style="text-align:center;margin-bottom:20px;color:${textColor};font-weight:600;">${this.escapeHtml(title)}</h3><div style="margin-bottom:24px;text-align:center;"><select id="selection-dropdown" style="width:80%;padding:10px 12px;font-size:16px;border-radius:8px;border:1px solid ${borderColor};background:${bgInput};color:${textColor};outline:none;cursor:pointer;">${selectHtml}</select></div><div style="display:flex;gap:12px;justify-content:center;"><button id="select-confirm-btn" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;">确认</button><button id="select-cancel-btn" style="padding:10px 32px;font-size:15px;border:1px solid ${borderColor};border-radius:8px;background:${this.cancelBtnColor};color:${textColor};cursor:pointer;">取消</button></div>`;
            const mask = this.createMask(); const dialog = this.createDialogBox(html); mask.appendChild(dialog);
            await new Promise((resolve) => {
                const handle = (key) => { this.closeAll(); this.lastResult = String(key); resolve(); };
                dialog.querySelector("#select-confirm-btn").onclick = () => handle(dialog.querySelector("#selection-dropdown").value);
                dialog.querySelector("#select-cancel-btn").onclick = () => handle("Error");
                mask.addEventListener("click", (e) => { if (e.target === mask) handle("Error"); });
            });
        }

        showTextInput(args) { return this._enqueue('showTextInput', args); }
        async _showTextInput(args) {
            this.isOpen = true;
            const title = Cast.toString(args.TITLE) || "请输入"; const prompt = Cast.toString(args.PROMPT) || ""; const defValue = Cast.toString(args.DEFAULT) || "";
            const isDark = this.isDarkTheme; const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const bgInput = isDark ? "rgba(42,45,58,0.8)" : "rgba(245,246,250,0.8)";
            const borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
            const html = `<h3 class="dialog-title" style="text-align:center;margin-bottom:15px;color:${textColor};font-weight:600;">${this.escapeHtml(title)}</h3><p style="text-align:center;color:${textColor};margin-bottom:10px;opacity:0.8;">${this.escapeHtml(prompt)}</p><div style="margin-bottom:24px;text-align:center;"><input id="text-input-field" type="text" value="${this.escapeHtml(defValue)}" style="width:80%;padding:10px 12px;font-size:16px;border-radius:8px;border:1px solid ${borderColor};background:${bgInput};color:${textColor};outline:none;"></div><div style="display:flex;gap:12px;justify-content:center;"><button id="text-confirm-btn" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;">确认</button><button id="text-cancel-btn" style="padding:10px 32px;font-size:15px;border:1px solid ${borderColor};border-radius:8px;background:${this.cancelBtnColor};color:${textColor};cursor:pointer;">取消</button></div>`;
            const mask = this.createMask(); const dialog = this.createDialogBox(html); mask.appendChild(dialog);
            await new Promise((resolve) => {
                const input = dialog.querySelector("#text-input-field"); input.focus();
                const handle = (text) => { this.closeAll(); this.lastResult = String(text); resolve(); };
                dialog.querySelector("#text-confirm-btn").onclick = () => handle(input.value.trim() === "" ? "Error" : input.value);
                dialog.querySelector("#text-cancel-btn").onclick = () => handle("Error");
                mask.addEventListener("click", (e) => { if (e.target === mask) handle("Error"); });
                input.addEventListener("keydown", (e) => { if (e.key === "Enter") handle(input.value.trim() === "" ? "Error" : input.value); });
            });
        }

        async showConfirm(args) {
            if (this.isOpen) return;
            const title = Cast.toString(args.TITLE) || "确认操作";
            const content = Cast.toString(args.CONTENT) || "确定要执行该操作吗？";
            const isDark = this.isDarkTheme;
            const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
            // ★ 修改点：内容容器的 text-align 改为 left
            const html = `<h3 class="dialog-title" style="text-align:center;margin-bottom:15px;color:${textColor};font-weight:600;">${this.escapeHtml(title)}</h3>
                        <p class="dialog-content" style="text-align:left;font-size:16px;margin-bottom:28px;color:${textColor};opacity:0.9;line-height:1.6;">${this.parseRichText(content)}</p>
                        <div style="display:flex;gap:12px;justify-content:center;">
                            <button id="confirm-yes-btn" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;font-weight:500;">是</button>
                            <button id="confirm-no-btn" style="padding:10px 32px;font-size:15px;border:1px solid ${borderColor};border-radius:8px;background:${this.cancelBtnColor};color:${textColor};cursor:pointer;">否</button>
                        </div>`;
            const mask = this.createMask();
            const dialog = this.createDialogBox(html);
            mask.appendChild(dialog);
            this.isOpen = true;
            await new Promise((resolve) => {
                const handle = async (val) => {
                    await this.closeAll();
                    this.lastResult = val;
                    resolve();
                };
                dialog.querySelector("#confirm-yes-btn").onclick = () => handle("1");
                dialog.querySelector("#confirm-no-btn").onclick = () => handle("0");
                mask.addEventListener("click", (e) => { if (e.target === mask) handle("Error"); });
            });
        }

        showButtonSelection(args) { return this._enqueue('showButtonSelection', args); }
        async _showButtonSelection(args) {
            this.isOpen = true;
            const title = Cast.toString(args.TITLE) || "请选择一个选项";
            const jsonStr = Cast.toString(args.JSON) || "{}"; 
            const options = this.parseOptions(jsonStr);
            const isDark = this.isDarkTheme;
            const btnBg = isDark ? "rgba(42,45,58,0.8)" : "rgba(245,246,250,0.8)";
            const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
            let buttonsHtml = options.map(opt => `<button class="btn-option" data-key="${opt.key}" style="display:block;width:100%;padding:12px;margin:8px 0;font-size:16px;border:1px solid ${borderColor};border-radius:8px;background:${btnBg};color:${textColor};cursor:pointer;text-align:center;font-weight:500;">${opt.label}</button>`).join("");
            const html = `<h3 class="dialog-title" style="text-align:center;margin-bottom:20px;color:${textColor};font-weight:600;">${this.escapeHtml(title)}</h3><div>${buttonsHtml}</div><button id="btn-select-cancel" style="display:block;width:100%;padding:10px;margin-top:12px;font-size:15px;border:1px solid ${borderColor};border-radius:8px;background:${this.cancelBtnColor};color:${textColor};cursor:pointer;">取消</button>`;
            const mask = this.createMask(); const dialog = this.createDialogBox(html); mask.appendChild(dialog);
            await new Promise((resolve) => {
                const handle = (key) => { this.closeAll(); this.lastResult = String(key); resolve(); };
                dialog.querySelectorAll(".btn-option").forEach(btn => btn.addEventListener("click", () => handle(btn.dataset.key)));
                dialog.querySelector("#btn-select-cancel").addEventListener("click", () => handle("Error"));
                mask.addEventListener("click", (e) => { if (e.target === mask) handle("Error"); });
            });
        }

        showRating(args) { return this._enqueue('showRating', args); }
        async _showRating(args) {
            this.isOpen = true;
            const title = Cast.toString(args.TITLE) || "请评分";
            const isDark = this.isDarkTheme;
            const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";

            const starsContainerId = "rating-stars-container";
            const ratingDisplayId = "rating-display";
            let selectedScore = 0;

            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                starsHtml += `<div class="rating-star" data-value="${i}" style="display:inline-block; width:40px; height:40px; margin:0 2px; cursor:pointer; background:#ddd; border-radius:4px; transition:background 0.1s;"></div>`;
            }

            const html = `
                <h3 class="dialog-title" style="text-align:center;margin-bottom:20px;color:${textColor};font-weight:600;">${this.escapeHtml(title)}</h3>
                <div id="${starsContainerId}" style="text-align:center;margin-bottom:20px;">
                    ${starsHtml}
                </div>
                <div style="text-align:center;font-size:20px;color:${textColor};margin-bottom:20px;">
                    当前评分：<span id="${ratingDisplayId}">0</span>
                </div>
                <div style="display:flex;gap:12px;justify-content:center;">
                    <button id="rating-confirm-btn" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;">确认评分</button>
                    <button id="rating-cancel-btn" style="padding:10px 32px;font-size:15px;border:1px solid ${borderColor};border-radius:8px;background:${this.cancelBtnColor};color:${textColor};cursor:pointer;">取消</button>
                </div>
            `;

            const mask = this.createMask();
            const dialog = this.createDialogBox(html);
            mask.appendChild(dialog);

            const container = dialog.querySelector(`#${starsContainerId}`);
            const stars = container.querySelectorAll('.rating-star');
            const displaySpan = dialog.querySelector(`#${ratingDisplayId}`);

            const updateStars = (score) => {
                stars.forEach((star, idx) => {
                    const value = idx + 1;
                    if (score >= value) {
                        star.style.background = '#FFB800';
                    } else if (score >= value - 0.5 && score < value) {
                        star.style.background = 'linear-gradient(to right, #FFB800 50%, #ddd 50%)';
                    } else {
                        star.style.background = '#ddd';
                    }
                });
                displaySpan.textContent = score.toFixed(1);
            };

            const getScoreFromEvent = (e, starElement) => {
                const rect = starElement.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const width = rect.width;
                const value = parseInt(starElement.dataset.value);
                if (x < width / 2) {
                    return value - 0.5;
                } else {
                    return value;
                }
            };

            stars.forEach(star => {
                star.addEventListener('mousemove', (e) => {
                    const score = getScoreFromEvent(e, star);
                    const clamped = Math.min(5, Math.max(0, score));
                    updateStars(clamped);
                });
                star.addEventListener('mouseleave', () => {
                    updateStars(selectedScore);
                });
                star.addEventListener('click', (e) => {
                    const score = getScoreFromEvent(e, star);
                    selectedScore = Math.min(5, Math.max(0, score));
                    updateStars(selectedScore);
                });
            });

            dialog.querySelector("#rating-confirm-btn").addEventListener("click", () => {
                this.closeAll();
                this.lastResult = String(selectedScore);
            });

            const cancelHandler = () => {
                this.closeAll();
                this.lastResult = "Error";
            };
            dialog.querySelector("#rating-cancel-btn").addEventListener("click", cancelHandler);
            mask.addEventListener("click", (e) => {
                if (e.target === mask) {
                    cancelHandler();
                }
            });

            await new Promise((resolve) => {
                const check = setInterval(() => {
                    if (!this.isOpen) {
                        clearInterval(check);
                        resolve();
                    }
                }, 100);
            });
        }

        showSlider(args) { return this._enqueue('showSlider', args); }
        async _showSlider(args) {
            this.isOpen = true;
            const title = Cast.toString(args.TITLE) || "请选择"; const min = Number(Cast.toNumber(args.MIN)) || 0; const max = Number(Cast.toNumber(args.MAX)) || 100;
            const val = Math.min(max, Math.max(min, Number(Cast.toNumber(args.VAL)) || 50));
            const isDark = this.isDarkTheme; const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const html = `<h3 class="dialog-title" style="text-align:center;margin-bottom:20px;color:${textColor};font-weight:600;">${this.escapeHtml(title)}</h3><div style="margin-bottom:20px;display:flex;align-items:center;gap:12px;"><span>${min}</span><input id="slider-input" type="range" min="${min}" max="${max}" value="${val}" style="flex:1;"><span>${max}</span></div><div style="text-align:center;font-size:18px;margin-bottom:20px;color:${textColor};">当前值: <span id="slider-value">${val}</span></div><div style="display:flex;gap:12px;justify-content:center;"><button id="slider-confirm" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;">确认</button><button id="slider-cancel" style="padding:10px 32px;font-size:15px;border:1px solid ${isDark?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.1)'};border-radius:8px;background:${this.cancelBtnColor};color:${textColor};cursor:pointer;">取消</button></div>`;
            const mask = this.createMask(); const dialog = this.createDialogBox(html); mask.appendChild(dialog);
            await new Promise((resolve) => {
                const slider = dialog.querySelector("#slider-input"); const valueSpan = dialog.querySelector("#slider-value");
                slider.addEventListener("input", () => { valueSpan.textContent = slider.value; });
                const handle = (val) => { this.closeAll(); this.lastResult = String(val); resolve(); };
                dialog.querySelector("#slider-confirm").onclick = () => handle(Number(slider.value));
                dialog.querySelector("#slider-cancel").onclick = () => handle("Error");
                mask.addEventListener("click", (e) => { if (e.target === mask) handle("Error"); });
            });
        }

        showPasswordInput(args) { return this._enqueue('showPasswordInput', args); }
        async _showPasswordInput(args) {
            this.isOpen = true;
            const title = Cast.toString(args.TITLE) || "输入密码"; const prompt = Cast.toString(args.PROMPT) || "";
            const isDark = this.isDarkTheme; const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const bgInput = isDark ? "rgba(42,45,58,0.8)" : "rgba(245,246,250,0.8)";
            const borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
            const html = `<h3 class="dialog-title" style="text-align:center;margin-bottom:15px;color:${textColor};font-weight:600;">${this.escapeHtml(title)}</h3><p style="text-align:center;color:${textColor};margin-bottom:10px;">${this.escapeHtml(prompt)}</p><div style="margin-bottom:24px;text-align:center;"><input id="pass-input" type="password" style="width:80%;padding:10px 12px;font-size:16px;border-radius:8px;border:1px solid ${borderColor};background:${bgInput};color:${textColor};outline:none;"></div><div style="display:flex;gap:12px;justify-content:center;"><button id="pass-confirm" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;">确认</button><button id="pass-cancel" style="padding:10px 32px;font-size:15px;border:1px solid ${borderColor};border-radius:8px;background:${this.cancelBtnColor};color:${textColor};cursor:pointer;">取消</button></div>`;
            const mask = this.createMask(); const dialog = this.createDialogBox(html); mask.appendChild(dialog);
            await new Promise((resolve) => {
                const input = dialog.querySelector("#pass-input"); input.focus();
                const handle = (val) => { this.closeAll(); this.lastResult = val; resolve(); };
                dialog.querySelector("#pass-confirm").onclick = () => handle(input.value.trim() === "" ? "Error" : input.value);
                dialog.querySelector("#pass-cancel").onclick = () => handle("Error");
                mask.addEventListener("click", (e) => { if (e.target === mask) handle("Error"); });
                input.addEventListener("keydown", (e) => { if (e.key === "Enter") handle(input.value.trim() === "" ? "Error" : input.value); });
            });
        }

        showDateInput(args) { return this._enqueue('showDateInput', args); }
        async _showDateInput(args) {
            this.isOpen = true;
            const title = Cast.toString(args.TITLE) || "选择日期";
            const isDark = this.isDarkTheme;
            const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const bgInput = isDark ? "rgba(42,45,58,0.8)" : "rgba(245,246,250,0.8)";
            const borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
            const html = `
                <h3 class="dialog-title" style="text-align:center;margin-bottom:15px;color:${textColor};font-weight:600;">${this.escapeHtml(title)}</h3>
                <div style="margin-bottom:24px;text-align:center;">
                    <input id="date-input-field" type="date" style="width:80%;padding:10px 12px;font-size:16px;border-radius:8px;border:1px solid ${borderColor};background:${bgInput};color:${textColor};outline:none;">
                </div>
                <div style="display:flex;gap:12px;justify-content:center;">
                    <button id="date-confirm-btn" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;">确认</button>
                    <button id="date-cancel-btn" style="padding:10px 32px;font-size:15px;border:1px solid ${borderColor};border-radius:8px;background:${this.cancelBtnColor};color:${textColor};cursor:pointer;">取消</button>
                </div>
            `;
            const mask = this.createMask();
            const dialog = this.createDialogBox(html);
            mask.appendChild(dialog);
            await new Promise((resolve) => {
                const input = dialog.querySelector("#date-input-field");
                const handle = (val) => { this.closeAll(); this.lastResult = val; resolve(); };
                dialog.querySelector("#date-confirm-btn").onclick = () => handle(input.value || "Error");
                dialog.querySelector("#date-cancel-btn").onclick = () => handle("Error");
                mask.addEventListener("click", (e) => { if (e.target === mask) handle("Error"); });
                input.addEventListener("keydown", (e) => { if (e.key === "Enter") handle(input.value || "Error"); });
            });
        }

        showMultiLineInput(args) { return this._enqueue('showMultiLineInput', args); }
        async _showMultiLineInput(args) {
            this.isOpen = true;
            const title = Cast.toString(args.TITLE) || "请输入";
            const prompt = Cast.toString(args.PROMPT) || "";
            const defValue = Cast.toString(args.DEFAULT) || "";
            const isDark = this.isDarkTheme;
            const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const bgInput = isDark ? "rgba(42,45,58,0.8)" : "rgba(245,246,250,0.8)";
            const borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
            const html = `<h3 class="dialog-title" style="text-align:center;margin-bottom:15px;color:${textColor};font-weight:600;">${this.escapeHtml(title)}</h3>
                <p style="text-align:center;color:${textColor};margin-bottom:10px;opacity:0.8;">${this.escapeHtml(prompt)}</p>
                <div style="margin-bottom:24px;text-align:center;">
                    <textarea id="multiline-input" style="width:80%;min-height:100px;padding:10px;font-size:16px;border-radius:8px;border:1px solid ${borderColor};background:${bgInput};color:${textColor};outline:none;resize:vertical;">${this.escapeHtml(defValue)}</textarea>
                </div>
                <div style="display:flex;gap:12px;justify-content:center;">
                    <button id="multi-confirm-btn" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;">确认</button>
                    <button id="multi-cancel-btn" style="padding:10px 32px;font-size:15px;border:1px solid ${borderColor};border-radius:8px;background:${this.cancelBtnColor};color:${textColor};cursor:pointer;">取消</button>
                </div>`;
            const mask = this.createMask();
            const dialog = this.createDialogBox(html);
            mask.appendChild(dialog);
            await new Promise((resolve) => {
                const input = dialog.querySelector("#multiline-input");
                input.focus();
                const handle = (text) => { 
                    const escaped = text.replace(/\n/g, '\\n');
                    this.closeAll(); 
                    this.lastResult = String(escaped); 
                    resolve(); 
                };
                dialog.querySelector("#multi-confirm-btn").onclick = () => handle(input.value.trim() === "" ? "Error" : input.value);
                dialog.querySelector("#multi-cancel-btn").onclick = () => handle("Error");
                mask.addEventListener("click", (e) => { if (e.target === mask) handle("Error"); });
                input.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.ctrlKey) handle(input.value.trim() === "" ? "Error" : input.value); });
            });
        }

        showFilePicker(args) { return this._enqueue('showFilePicker', args); }
        async _showFilePicker(args) {
            this.isOpen = true;
            const title = Cast.toString(args.TITLE) || "选择文件";
            const accept = "image/*";
            const isDark = this.isDarkTheme;
            const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
            const html = `<h3 class="dialog-title" style="text-align:center;margin-bottom:15px;color:${textColor};font-weight:600;">${this.escapeHtml(title)}</h3>
                <div style="margin-bottom:24px;text-align:center;">
                    <input id="file-picker" type="file" accept="${this.escapeHtml(accept)}" style="padding:8px;border:1px solid ${borderColor};border-radius:8px;background:${isDark?'#222':'#fff'};color:${textColor};">
                </div>
                <div style="display:flex;gap:12px;justify-content:center;">
                    <button id="file-confirm-btn" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;">确认</button>
                    <button id="file-cancel-btn" style="padding:10px 32px;font-size:15px;border:1px solid ${borderColor};border-radius:8px;background:${this.cancelBtnColor};color:${textColor};cursor:pointer;">取消</button>
                </div>`;
            const mask = this.createMask();
            const dialog = this.createDialogBox(html);
            mask.appendChild(dialog);
            await new Promise((resolve) => {
                const fileInput = dialog.querySelector("#file-picker");
                const handle = (result) => { this.closeAll(); this.lastResult = result; resolve(); };
                dialog.querySelector("#file-confirm-btn").onclick = () => {
                    const file = fileInput.files[0];
                    if (!file) { handle("Error"); return; }
                    const reader = new FileReader();
                    reader.onload = (e) => handle(e.target.result);
                    reader.onerror = () => handle("Error");
                    reader.readAsDataURL(file);
                };
                dialog.querySelector("#file-cancel-btn").onclick = () => handle("Error");
                mask.addEventListener("click", (e) => { if (e.target === mask) handle("Error"); });
            });
        }

        showDrawing(args) { return this._enqueue('showDrawing', args); }
        async _showDrawing(args) {
            this.isOpen = true;
            const title = Cast.toString(args.TITLE) || "画板";
            const imageUrl = Cast.toString(args.IMAGE) || "";
            const isDark = this.isDarkTheme;
            const textColor = isDark ? "#e0e0e0" : "#2c2c2c";

            const html = `<h3 class="dialog-title" style="text-align:center;color:${textColor};">${this.escapeHtml(title)}</h3>
                <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
                    <button id="draw-pen" style="background:${this.confirmBtnColor};color:#fff;border:none;padding:6px 12px;border-radius:4px;">画笔</button>
                    <button id="draw-eraser" style="background:#888;color:#fff;border:none;padding:6px 12px;border-radius:4px;">橡皮</button>
                    <input id="draw-color" type="color" value="#000000">
                    <input id="draw-size" type="range" min="1" max="20" value="3" style="width:80px;">
                </div>
                <canvas id="draw-canvas" width="500" height="300" style="border:1px solid ${isDark?'#555':'#ccc'};background:#fff;width:100%;"></canvas>
                <div style="text-align:center;margin-top:12px;display:flex;gap:12px;justify-content:center;">
                    <button id="draw-confirm" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;">确认</button>
                    <button id="draw-cancel" style="padding:10px 32px;font-size:15px;border:1px solid ${isDark?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.1)'};border-radius:8px;background:${this.cancelBtnColor};color:${textColor};cursor:pointer;">取消</button>
                </div>`;

            const mask = this.createMask();
            const dialog = this.createDialogBox(html);
            mask.appendChild(dialog);

            const canvas = dialog.querySelector("#draw-canvas");
            const ctx = canvas.getContext("2d");

            if (imageUrl && this.isValidImageUrl(imageUrl)) {
                try {
                    const img = await this.loadImage(imageUrl);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                } catch (e) {
                    ctx.fillStyle = "#ffcccc";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "#cc0000";
                    ctx.font = "16px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText("图片加载失败", canvas.width/2, canvas.height/2);
                }
            } else {
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            let painting = false;
            let erasing = false;
            const colorPicker = dialog.querySelector("#draw-color");
            const sizeSlider = dialog.querySelector("#draw-size");
            dialog.querySelector("#draw-pen").onclick = () => { erasing = false; };
            dialog.querySelector("#draw-eraser").onclick = () => { erasing = true; };

            const getPos = (e) => {
                const rect = canvas.getBoundingClientRect();
                return {
                    x: (e.clientX - rect.left) * (canvas.width / rect.width),
                    y: (e.clientY - rect.top) * (canvas.height / rect.height)
                };
            };

            canvas.addEventListener("mousedown", (e) => {
                painting = true;
                const pos = getPos(e);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
            });

            canvas.addEventListener("mousemove", (e) => {
                if (!painting) return;
                const pos = getPos(e);
                ctx.lineWidth = sizeSlider.value;
                ctx.strokeStyle = erasing ? "#fff" : colorPicker.value;
                ctx.lineCap = "round";
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            });

            canvas.addEventListener("mouseup", () => {
                painting = false;
                ctx.closePath();
            });

            canvas.addEventListener("mouseleave", () => {
                painting = false;
            });

            await new Promise((resolve) => {
                dialog.querySelector("#draw-confirm").onclick = () => {
                    this.closeAll();
                    this.lastResult = canvas.toDataURL("image/png");
                    resolve();
                };
                dialog.querySelector("#draw-cancel").onclick = () => {
                    this.closeAll();
                    this.lastResult = "Error";
                    resolve();
                };
                mask.addEventListener("click", (e) => {
                    if (e.target === mask) {
                        this.closeAll();
                        this.lastResult = "Error";
                        resolve();
                    }
                });
            });
        }

        // ---------- Toast（不阻塞） ----------
        showToast(args) {
            const text = Cast.toString(args.TEXT) || "";
            const sec = Math.max(1, Cast.toNumber(args.SEC) || 2);
            const position = Cast.toString(args.POSITION) || "右上";
            if (this.activeToast && this.activeToast.parentNode) {
                this.activeToast.remove();
                this.activeToast = null;
            }
            if (this.toastTimer) {
                clearTimeout(this.toastTimer);
                this.toastTimer = null;
            }

            const toast = document.createElement("div");
            let posStyle = "";
            switch (position) {
                case "左上": posStyle = "top:20px; left:20px;"; break;
                case "左下": posStyle = "bottom:20px; left:20px;"; break;
                case "中上": posStyle = "top:20px; left:50%; transform:translateX(-50%);"; break;
                case "中下": posStyle = "bottom:20px; left:50%; transform:translateX(-50%);"; break;
                case "右下": posStyle = "bottom:20px; right:20px;"; break;
                case "右上": default: posStyle = "top:20px; right:20px;"; break;
            }
            toast.style.cssText = `position:fixed;z-index:100000;background:${this.isDarkTheme?'rgba(30,34,48,0.95)':'rgba(255,255,255,0.95)'};color:${this.isDarkTheme?'#fff':'#222'};padding:12px 24px;border-radius:30px;font-size:15px;box-shadow:0 8px 24px rgba(0,0,0,0.2);backdrop-filter:blur(10px);opacity:0;transform:translateY(-10px);transition:opacity 0.3s ease, transform 0.3s ease;${posStyle}`;
            // ★ 关键修改：使用 innerHTML + parseRichText 支持换行和粗体
            toast.innerHTML = this.parseRichText(text);
            document.body.appendChild(toast);
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            });
            this.activeToast = toast;

            this.toastTimer = setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        if (toast.parentNode) toast.remove();
                        if (this.activeToast === toast) this.activeToast = null;
                    }, 300);
                }
                this.toastTimer = null;
            }, sec * 1000);
        }

        // ---------- 抽奖弹窗 ----------
        showLottery(args) { return this._enqueue('showLottery', args); }
        async _showLottery(args) {
            this.isOpen = true;
            const title = Cast.toString(args.TITLE) || "抽奖转盘";
            let raw;
            try { raw = JSON.parse(Cast.toString(args.JSON) || "{}"); } catch (e) { raw = {}; }
            const prizes = [];
            let totalRatio = 0;
            for (const [key, val] of Object.entries(raw)) {
                if (Array.isArray(val) && val.length >= 2) {
                    const ratio = Number(val[0]) || 0;
                    const label = String(val[1]);
                    prizes.push({ key, ratio, label });
                    totalRatio += ratio;
                }
            }
            if (prizes.length === 0) { this.lastResult = ""; this.closeAll(); return; }
            const normalized = prizes.map(p => ({ ...p, ratio: p.ratio / (totalRatio || 1) }));
            const colors = ["#FF6B6B","#FFA07A","#FFD700","#98FB98","#87CEEB","#DDA0DD","#FF69B4","#00CED1","#F0E68C","#BDB76B","#9ACD32","#20B2AA"];
            const isDark = this.isDarkTheme;
            const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const containerId = "lottery-container";
            const canvasId = "lottery-canvas";
            const pointerId = "lottery-pointer";
            const spinBtnId = "lottery-spin-btn";
            const closeBtnId = "lottery-close-btn";
            const html = `
                <div style="text-align:center; margin-bottom:20px;">
                    <h3 class="dialog-title" style="margin:0; font-size:22px; color:${textColor};">🎰 ${this.escapeHtml(title)}</h3>
                </div>
                <div id="${containerId}" style="position:relative; width:350px; height:350px; margin:0 auto 20px;">
                    <canvas id="${canvasId}" width="350" height="350" style="width:100%; height:100%; border-radius:50%; box-shadow:0 0 20px rgba(0,0,0,0.3);"></canvas>
                    <div id="${pointerId}" style="position:absolute; top:-15px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:15px solid transparent; border-right:15px solid transparent; border-top:25px solid #e74c3c; filter:drop-shadow(0 2px 2px rgba(0,0,0,0.3));"></div>
                </div>
                <div style="display:flex; gap:12px; justify-content:center;">
                    <button id="${spinBtnId}" style="padding:10px 32px; font-size:16px; border:none; border-radius:8px; background:${this.confirmBtnColor}; color:#fff; cursor:pointer;">抽奖</button>
                    <button id="${closeBtnId}" style="padding:10px 32px; font-size:16px; border:1px solid ${isDark?'rgba(255,255,255,0.2)':'rgba(0,0,0,0.1)'}; border-radius:8px; background:${this.cancelBtnColor}; color:${textColor}; cursor:pointer;">关闭</button>
                </div>
            `;
            const mask = this.createMask();
            const dialog = this.createDialogBox(html);
            mask.appendChild(dialog);
            const container = dialog.querySelector(`#${containerId}`);
            const canvas = dialog.querySelector(`#${canvasId}`);
            const spinBtn = dialog.querySelector(`#${spinBtnId}`);
            const closeBtn = dialog.querySelector(`#${closeBtnId}`);
            let spinning = false;
            let chosenKey = null;
            let currentAngle = 0;
            const ctx = canvas.getContext("2d");
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = canvas.width / 2 - 5;
            const drawWheel = (highlightIndex = -1) => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let startAngle = -Math.PI / 2;
                normalized.forEach((prize, i) => {
                    const sliceAngle = prize.ratio * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                    ctx.closePath();
                    ctx.fillStyle = colors[i % colors.length];
                    if (i === highlightIndex) {
                        ctx.fillStyle = colors[i % colors.length];
                        ctx.shadowColor = "#fff";
                        ctx.shadowBlur = 15;
                        ctx.fill();
                        ctx.shadowColor = "transparent";
                        ctx.shadowBlur = 0;
                        ctx.strokeStyle = "#fff";
                        ctx.lineWidth = 3;
                        ctx.stroke();
                    } else {
                        ctx.fill();
                    }
                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate(startAngle + sliceAngle / 2);
                    ctx.textAlign = "center";
                    ctx.fillStyle = "#fff";
                    ctx.font = "bold 14px system-ui";
                    ctx.fillText(prize.label, radius * 0.65, 5);
                    ctx.restore();
                    startAngle += sliceAngle;
                });
                ctx.beginPath();
                ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
                ctx.fillStyle = "#fff";
                ctx.fill();
                ctx.strokeStyle = "#ddd";
                ctx.lineWidth = 1;
                ctx.stroke();
            };
            drawWheel();
            closeBtn.addEventListener("click", () => {
                if (!chosenKey) this.lastResult = "Error";
                this.closeAll();
            });
            mask.addEventListener("click", (e) => {
                if (e.target === mask) {
                    if (!chosenKey) this.lastResult = "Error";
                    this.closeAll();
                }
            });
            spinBtn.addEventListener("click", () => {
                if (spinning) return;
                spinning = true;
                spinBtn.disabled = true;
                spinBtn.style.opacity = "0.6";
                const rand = Math.random();
                let cumulative = 0;
                let targetIndex = 0;
                for (let i = 0; i < normalized.length; i++) {
                    cumulative += normalized[i].ratio;
                    if (rand <= cumulative) { targetIndex = i; break; }
                }
                chosenKey = normalized[targetIndex].key;
                let targetCenterAngle = -Math.PI / 2;
                for (let i = 0; i < targetIndex; i++) targetCenterAngle += normalized[i].ratio * Math.PI * 2;
                targetCenterAngle += (normalized[targetIndex].ratio * Math.PI * 2) / 2;
                const sliceAngle = normalized[targetIndex].ratio * Math.PI * 2;
                const maxOffset = sliceAngle / 2 * 0.8;
                const randomOffset = (Math.random() * 2 - 1) * maxOffset;
                const finalTargetAngle = targetCenterAngle + randomOffset;
                const fullSpins = (Math.floor(Math.random() * 5) + 4) * Math.PI * 2;
                const targetAbsoluteAngle = -Math.PI / 2;
                let deltaAngle = targetAbsoluteAngle - finalTargetAngle;
                if (deltaAngle < 0) deltaAngle += Math.PI * 2;
                const totalRotation = fullSpins + deltaAngle;
                const duration = 4000;
                const startTime = performance.now();
                const startAngle = currentAngle;
                const finalAngle = startAngle + totalRotation;
                const animate = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    currentAngle = startAngle + totalRotation * easeOut;
                    canvas.style.transform = `rotate(${currentAngle}rad)`;
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        currentAngle = finalAngle;
                        canvas.style.transform = `rotate(${currentAngle}rad)`;
                        drawWheel(targetIndex);
                        this.lastResult = chosenKey;
                        spinning = false;
                        spinBtn.disabled = false;
                        spinBtn.style.opacity = "1";
                    }
                };
                requestAnimationFrame(animate);
            });
            await new Promise((resolve) => {
                const check = setInterval(() => {
                    if (!this.isOpen) { clearInterval(check); resolve(); }
                }, 100);
            });
        }

        // ---------- C++ 编译器 ----------
        showCppCompiler(args) { return this._enqueue('showCppCompiler', args); }
        async _showCppCompiler(args) {
            this.isOpen = true;
            this.lastProgramLanguage = "C++";
            const isDark = this.isDarkTheme;
            const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const bgInput = isDark ? "#1e1e2f" : "#f5f5f5";
            const borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
            let hasRun = false;
            const html = `
                <h3 class="dialog-title" style="text-align:center;margin-bottom:15px;color:${textColor};font-weight:600;">在线 C++ 编译器</h3>
                <textarea id="cpp-code" style="width:100%;height:200px;padding:10px;font-family:monospace;font-size:14px;border-radius:8px;border:1px solid ${borderColor};background:${bgInput};color:${textColor};resize:vertical;" placeholder="// 在此输入 C++ 代码">#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}</textarea>
                <details style="margin-top:12px;">
                    <summary style="color:${textColor};cursor:pointer;">标准输入 (stdin) - 点击展开</summary>
                    <textarea id="cpp-stdin" style="width:100%;height:60px;padding:10px;font-family:monospace;font-size:14px;border-radius:8px;border:1px solid ${borderColor};background:${bgInput};color:${textColor};resize:vertical;margin-top:8px;" placeholder="如果需要 cin，请在此输入数据，每行一个输入。例如：&#10;3 5&#10;"></textarea>
                </details>
                <div style="display:flex;gap:12px;justify-content:center;margin-top:16px;">
                    <button id="cpp-run-btn" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;">运行</button>
                    <button id="cpp-close-btn" style="padding:10px 32px;font-size:15px;border:1px solid ${borderColor};border-radius:8px;background:${this.cancelBtnColor};color:${textColor};cursor:pointer;">关闭</button>
                </div>
                <div id="cpp-output" style="margin-top:16px;padding:10px;background:${bgInput};border:1px solid ${borderColor};border-radius:8px;min-height:50px;max-height:150px;overflow-y:auto;font-family:monospace;font-size:13px;color:${textColor};white-space:pre-wrap;">运行结果将显示在这里...</div>
            `;
            const mask = this.createMask();
            const dialog = this.createDialogBox(html);
            mask.appendChild(dialog);
            const outputDiv = dialog.querySelector("#cpp-output");
            const runBtn = dialog.querySelector("#cpp-run-btn");
            const codeArea = dialog.querySelector("#cpp-code");
            const stdinArea = dialog.querySelector("#cpp-stdin");
            const closeBtn = dialog.querySelector("#cpp-close-btn");
            const saveCodeAndClose = () => {
                this.lastProgramCode = codeArea.value || "";
                if (!hasRun) this.lastProgramResult = "Error";
                this.closeAll();
            };
            closeBtn.onclick = saveCodeAndClose;
            mask.addEventListener("click", (e) => { if (e.target === mask) saveCodeAndClose(); });
            runBtn.addEventListener("click", async () => {
                const code = codeArea.value;
                if (!code.trim()) {
                    outputDiv.textContent = "请先输入 C++ 代码。";
                    this.lastProgramResult = "Error";
                    return;
                }
                outputDiv.textContent = "编译运行中...";
                runBtn.disabled = true;
                try {
                    const response = await fetch("https://wandbox.org/api/compile.json", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            compiler: "gcc-head",
                            code: code,
                            stdin: stdinArea ? stdinArea.value : "",
                            "compiler-option-raw": ""
                        })
                    });
                    const data = await response.json();
                    let result;
                    if (data.status === "0") {
                        result = data.program_message || data.compiler_message || "运行成功，无输出。";
                    } else {
                        result = data.compiler_message || data.program_message || "编译或运行错误，未返回信息。";
                    }
                    outputDiv.textContent = result;
                    this.lastProgramResult = result;
                    hasRun = true;
                } catch (err) {
                    const errMsg = "网络错误或请求失败: " + err.message;
                    outputDiv.textContent = errMsg;
                    this.lastProgramResult = errMsg;
                    hasRun = true;
                } finally {
                    runBtn.disabled = false;
                }
            });
            await new Promise((resolve) => {
                const check = setInterval(() => {
                    if (!this.isOpen) { clearInterval(check); resolve(); }
                }, 100);
            });
        }

        // ---------- 图片弹窗 ----------
        showImage(args) { return this._enqueue('showImage', args); }
        async _showImage(args) {
            this.isOpen = true;
            const rawUrl = Cast.toString(args.URL) || "";
            const title = Cast.toString(args.TITLE) || "图片";
            if (!this.isValidImageUrl(rawUrl)) {
                const isDark = this.isDarkTheme;
                const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
                const html = `<h3 class="dialog-title" style="text-align:center;margin-bottom:15px;color:${textColor};font-weight:600;">${this.escapeHtml(title)}</h3><p style="text-align:center;color:red;">图片链接无效或不被允许</p><div style="text-align:center;margin-top:16px;"><button id="img-close" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;">关闭</button></div>`;
                const mask = this.createMask();
                const dialog = this.createDialogBox(html);
                mask.appendChild(dialog);
                await new Promise((resolve) => {
                    dialog.querySelector("#img-close").onclick = () => { this.closeAll(); resolve(); };
                    mask.addEventListener("click", (e) => { if (e.target === mask) { this.closeAll(); resolve(); } });
                });
                return;
            }
            const isDark = this.isDarkTheme;
            const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const html = `
                <div style="display:flex; flex-direction:column; height:100%;">
                    <h3 class="dialog-title" style="text-align:center; margin-bottom:15px; color:${textColor}; font-weight:600; flex-shrink:0;">${this.escapeHtml(title)}</h3>
                    <div style="flex:1; min-height:0; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                        <img id="image-display" src="${rawUrl}" style="width:100%; height:100%; object-fit:contain; border-radius:8px;">
                    </div>
                    <div style="text-align:center; margin-top:16px; flex-shrink:0;">
                        <button id="img-close" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;">关闭</button>
                    </div>
                </div>
            `;
            const mask = this.createMask();
            const dialog = this.createDialogBox(html);
            dialog.style.height = "85vh";
            dialog.style.display = "flex";
            dialog.style.flexDirection = "column";
            dialog.style.overflow = "hidden";
            mask.appendChild(dialog);
            await new Promise((resolve) => {
                dialog.querySelector("#img-close").onclick = () => { this.closeAll(); resolve(); };
                mask.addEventListener("click", (e) => { if (e.target === mask) { this.closeAll(); resolve(); } });
            });
        }

        // ---------- 选项卡弹窗 ----------
        showTabs(args) { return this._enqueue('showTabs', args); }
        async _showTabs(args) {
            this.isOpen = true;
            const title = Cast.toString(args.TITLE) || "选项卡";
            let tabs;
            try { tabs = JSON.parse(Cast.toString(args.TABS_JSON)); } catch (e) { tabs = []; }
            if (!Array.isArray(tabs) || tabs.length === 0) { this.closeAll(); return; }
            const isDark = this.isDarkTheme; const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            let tabBtns = '';
            let tabContents = '';
            tabs.forEach((item, i) => {
                if (typeof item !== 'object' || item === null) return;
                const keys = Object.keys(item);
                if (keys.length === 0) return;
                const tabTitle = keys[0];
                const content = item[tabTitle] || '';
                tabBtns += `<button class="tab-btn" data-index="${i}" style="padding:8px 16px;border:none;background:${i===0?'rgba(74,144,226,0.2)':'transparent'};color:${textColor};border-radius:6px;cursor:pointer;flex-shrink:0;">${this.escapeHtml(tabTitle)}</button>`;
                tabContents += `<div class="tab-content" data-index="${i}" style="display:${i===0?'block':'none'};margin-top:16px;">${this.parseRichText(String(content))}</div>`;
            });
            if (!tabBtns) { this.closeAll(); return; }
            const html = `<h3 class="dialog-title" style="text-align:center;color:${textColor};font-weight:600;">${this.escapeHtml(title)}</h3>
                <div style="display:flex; flex-wrap:nowrap; overflow-x:auto; gap:8px; border-bottom:1px solid ${isDark?'rgba(255,255,255,0.2)':'rgba(0,0,0,0.1)'}; padding-bottom:8px; scrollbar-width:thin; -webkit-overflow-scrolling:touch;">
                    ${tabBtns}
                </div>
                ${tabContents}
                <div style="text-align:center;margin-top:20px;"><button id="tabs-close" style="padding:10px 32px;font-size:15px;border:none;border-radius:8px;background:${this.confirmBtnColor};color:#fff;cursor:pointer;">关闭</button></div>`;
            const mask = this.createMask(); const dialog = this.createDialogBox(html); mask.appendChild(dialog);
            const btns = dialog.querySelectorAll(".tab-btn"); const contents = dialog.querySelectorAll(".tab-content");
            btns.forEach(btn => { btn.addEventListener("click", () => { btns.forEach(b => b.style.background = "transparent"); btn.style.background = "rgba(74,144,226,0.2)"; contents.forEach(c => c.style.display = "none"); dialog.querySelector(`.tab-content[data-index="${btn.dataset.index}"]`).style.display = "block"; }); });
            await new Promise((resolve) => {
                dialog.querySelector("#tabs-close").onclick = () => { this.closeAll(); resolve(); };
                mask.addEventListener("click", (e) => { if (e.target === mask) { this.closeAll(); resolve(); } });
            });
        }

        // ---------- 进度条（不阻塞，支持自动关闭和标题更新，自动关闭为下拉菜单） ----------
        openProgress(args) {
            if (this.isOpen) return;
            this._openProgress(args);
        }

        _openProgress(args) {
            if (this.isOpen) return;
            this.isOpen = true;
            const title = Cast.toString(args.TITLE) || "加载中";
            const progress = Number(Cast.toNumber(args.PROGRESS));
            // 从下拉菜单读取自动关闭选项，值为 "true" 或 "false"
            const autoCloseStr = Cast.toString(args.AUTO_CLOSE) || "false";
            this.progressAutoClose = (autoCloseStr === "true");
            this.progressCloseDelay = Math.max(0, Cast.toNumber(args.DELAY)) || 0;
            this.progressClosedTriggered = false;

            const isDark = this.isDarkTheme;
            const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
            const isIndeterminate = progress < 0;
            this.currentProgress = isIndeterminate ? -1 : progress;

            const barHtml = isIndeterminate
                ? `<div style="width:100%;margin-top:8px;"><div style="height:6px;background:rgba(74,144,226,0.3);border-radius:3px;overflow:hidden;"><div style="width:30%;height:100%;background:${this.confirmBtnColor};border-radius:3px;animation:loadingIndeterminate 1.2s infinite;"></div></div></div>`
                : `<div style="width:100%;margin-top:8px;"><div style="height:6px;background:rgba(74,144,226,0.3);border-radius:3px;"><div id="progress-fill" style="width:${progress}%;height:100%;background:${this.confirmBtnColor};border-radius:3px;transition:width 0.2s;"></div></div><div style="text-align:right;margin-top:4px;"><span id="progress-text" style="font-size:13px;color:${textColor};">${progress}%</span></div></div>`;

            const html = `<h3 class="dialog-title" style="text-align:center;margin-bottom:15px;color:${textColor};font-weight:600;">${this.escapeHtml(title)}</h3>${barHtml}`;
            const mask = this.createMask();
            const dialog = this.createDialogBox(html);
            mask.appendChild(dialog);
            this.progressDom = dialog;
            if (!isIndeterminate) {
                this.progressBar = dialog.querySelector("#progress-fill");
                this.progressText = dialog.querySelector("#progress-text");
            }
            mask.addEventListener("click", (e) => {
                if (e.target === mask) {
                    this.closeAll();
                }
            });
        }

        // 更新进度（同时检查自动关闭条件）
        updateProgress(args) {
            const progress = Math.min(100, Math.max(0, Number(Cast.toNumber(args.PROGRESS))));
            this.currentProgress = progress;
            if (this.progressBar) {
                this.progressBar.style.width = progress + "%";
                if (this.progressText) this.progressText.textContent = progress + "%";
            }

            // 检查是否达到100%且自动关闭启用且尚未触发
            if (progress === 100 && this.progressAutoClose && !this.progressClosedTriggered && this.isOpen) {
                this.progressClosedTriggered = true;
                if (this.progressCloseTimer) {
                    clearTimeout(this.progressCloseTimer);
                    this.progressCloseTimer = null;
                }
                this.progressCloseTimer = setTimeout(() => {
                    this.progressCloseTimer = null;
                    if (this.isOpen) {
                        this.closeAll();
                    }
                }, this.progressCloseDelay * 1000);
            }
        }

        getProgress() { return this.currentProgress; }

        updateProgressTitle(args) {
            const newTitle = Cast.toString(args.TEXT) || "进度条";
            if (this.progressDom && this.currentTitleEl) {
                this.currentTitleEl.innerHTML = this.escapeHtml(newTitle);
            }
        }

        getLastInput() { return this.lastResult; }
        getLastProgramResult() { return this.lastProgramResult; }
        getLastProgramCode() { return this.lastProgramCode; }
        getLastProgramLanguage() { return this.lastProgramLanguage; }
        closeDialog() { this.closeAll(); }
    }

    // 注入全局动画样式
    if (!document.getElementById('dialog-animations')) {
        const style = document.createElement('style');
        style.id = 'dialog-animations';
        style.textContent = `
            @keyframes fadeInDialog { from { opacity:0; transform:translateY(30px) scale(0.92); } to { opacity:1; transform:translateY(0) scale(1); } }
            @keyframes flipInDialog { from { opacity:0; transform:perspective(400px) rotateX(90deg); } to { opacity:1; transform:perspective(400px) rotateX(0deg); } }
            @keyframes scaleInDialog { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
            @keyframes loadingIndeterminate { 0% { transform:translateX(-100%); } 100% { transform:translateX(400%); } }
        `;
        document.head.appendChild(style);
    }

    extensions.register(new SimpleDialog(runtime));
})(Scratch);