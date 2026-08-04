//注释是我加的，并非ai生成
// Name: Files++
// ID: filesplusplus
// Description: 增强版文件操作扩展 - 支持从网上下载exe/zip等所有文件类型，弹出浏览器保存对话框
// By: CYSOEditor Community
// License: MIT

(function (Scratch) {
    "use strict";

    // ========== 常量定义 ==========
    const AS_TEXT = "text";
    const AS_DATA_URL = "url";

    // 危险文件扩展名（浏览器会弹原生保存对话框，让用户选择保存位置）
    const DANGEROUS_EXTENSIONS = [
        '.exe', '.msi', '.bat', '.cmd', '.com', '.scr', '.pif', '.vbs', '.js',
        '.wsh', '.wsf', '.ps1', '.psm1', '.psd1', '.sh', '.cgi', '.dll',
        '.sys', '.drv', '.app', '.deb', '.rpm', '.dmg', '.apk', '.xpi',
        '.crx', '.cab', '.msc', '.reg', '.inf', '.job',
        '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz',
        '.tar.gz', '.tar.bz2'
    ];

    // 下载进度状态存储
    const downloadProgress = new Map();

    // ========== 工具函数 ==========

    /**
     * 判断文件扩展名是否危险（需要浏览器弹保存对话框）
     */
    function isDangerousExtension(filename) {
        const lower = filename.toLowerCase();
        return DANGEROUS_EXTENSIONS.some(ext => lower.endsWith(ext));
    }

    /**
     * 获取文件扩展名
     */
    function getExtension(filename) {
        const lastDot = filename.lastIndexOf('.');
        if (lastDot === -1) return '';
        return filename.substring(lastDot).toLowerCase();
    }

    /**
     * 生成唯一下载ID
     */
    function generateDownloadId() {
        return 'dl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 格式化文件大小
     */
    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
        return (bytes / 1073741824).toFixed(2) + ' GB';
    }

    /**
     * 检查是否在 CYSOEditor 桌面版
     */
    function isDesktop() {
        return typeof EditorPreload !== 'undefined';
    }

    // ========== 下载函数（完全不用 EditorPreload 写文件） ==========

    /**
     * 通过 Blob + 隐藏 <a> 标签触发浏览器下载
     * 危险文件（.exe等）浏览器会自动弹出"另存为"对话框让用户选择位置
     * 安全文件也会走浏览器标准下载流程
     *
     * 核心原理：
     *   Blob → URL.createObjectURL → <a download="文件名">.click()
     *   → 浏览器弹出"另存为"对话框 → 用户选择保存位置
     *
     * 全程不走 EditorPreload，不用文件写入 API。
     */
    function triggerBrowserDownload(blob, filename) {
        return new Promise((resolve, reject) => {
            try {
                const url = URL.createObjectURL(blob);

                // 创建隐藏的 <a> 标签触发下载
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;  // 设置 download 属性 → 浏览器弹保存对话框
                a.style.display = 'none';
                document.body.appendChild(a);

                // 点击触发下载
                // 浏览器会对 .exe/.zip 等弹"另存为"对话框
                // 用户选择位置后才会真正保存
                a.click();

                // 清理
                setTimeout(() => {
                    try { document.body.removeChild(a); } catch(e) {}
                    URL.revokeObjectURL(url);
                    resolve({ success: true });
                }, 100);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 下载文本/二进制内容
     * 完全走浏览器机制，危险文件浏览器自动弹保存位置选择框
     */
    async function downloadContent(content, filename) {
        let blob;
        const ext = getExtension(filename);

        if (isDangerousExtension(filename)) {
            // 危险文件：用 octet-stream 类型，浏览器一定会弹保存对话框
            blob = new Blob([content], { type: 'application/octet-stream' });
            console.log(`🔒 危险文件类型 ${ext}，浏览器将弹出"另存为"对话框`);
        } else if (ext === '.png') {
            blob = new Blob([content], { type: 'image/png' });
        } else if (ext === '.jpg' || ext === '.jpeg') {
            blob = new Blob([content], { type: 'image/jpeg' });
        } else if (ext === '.gif') {
            blob = new Blob([content], { type: 'image/gif' });
        } else if (ext === '.pdf') {
            blob = new Blob([content], { type: 'application/pdf' });
        } else if (ext === '.json') {
            blob = new Blob([content], { type: 'application/json' });
        } else if (ext === '.html' || ext === '.htm') {
            blob = new Blob([content], { type: 'text/html' });
        } else if (ext === '.csv') {
            blob = new Blob([content], { type: 'text/csv' });
        } else {
            // 默认：通用二进制流，浏览器弹保存对话框
            blob = new Blob([content], { type: 'application/octet-stream' });
        }

        await triggerBrowserDownload(blob, filename);
        return { success: true, method: 'browser-dialog' };
    }

    /**
     * 从 URL 下载文件 —— 核心函数
     *
     * 流程：
     *   1. Scratch.fetch(url) 从网获取二进制（桌面版绕过CORS）
     *   2. response.blob() 转成 Blob
     *   3. triggerBrowserDownload() 弹出浏览器"另存为"对话框
     *
     * 这就是"能从网上下 exe"的关键：
     *   不是用 EditorPreload 静默写入，
     *   而是用 Blob + <a download> 让浏览器自己处理，
     *   浏览器对 .exe 会强制弹"另存为"对话框。
     */
    async function downloadFromURL(url, filename) {
        // data: URL 直接用浏览器下载（本身就是本地数据，无 CORS 问题）
        if (url.startsWith('data:')) {
            await Scratch.download(url, filename);
            return { success: true, method: 'data-url' };
        }

        // 用 Scratch.fetch 获取文件（桌面版可绕过 CORS）
        console.log(`🌐 正在获取: ${url}`);
        const response = await Scratch.fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        // 拿到二进制数据
        const blob = await response.blob();
        console.log(`📦 已获取 ${formatSize(blob.size)} 数据，准备弹出保存对话框`);

        // 通过 Blob + <a download> 触发浏览器"另存为"对话框
        // .exe/.zip 等危险文件 → 浏览器一定弹对话框
        // .txt/.png 等安全文件 → 浏览器也弹对话框（因为有 download 属性）
        await triggerBrowserDownload(blob, filename);

        console.log(`✅ 下载完成: ${filename} — 浏览器已弹出"另存为"对话框`);
        return { success: true, method: 'fetch+blob' };
    }


    // ========== 文件读取（保留原始 Files 扩展功能） ==========

    const MODE_MODAL = "modal";
    const MODE_IMMEDIATELY_SHOW_SELECTOR = "selector";
    const MODE_ONLY_SELECTOR = "only-selector";
    const ALL_MODES = [MODE_MODAL, MODE_IMMEDIATELY_SHOW_SELECTOR, MODE_ONLY_SELECTOR];
    let openFileSelectorMode = MODE_MODAL;

    function isCancelEventSupported(input) {
        if ("oncancel" in input) {
            return true;
        }
        return navigator.userAgent.includes("Firefox");
    }

    /**
     * 显示文件选择对话框（从原始 Files 扩展移植）
     */
    function showFilePrompt(accept, as) {
        return new Promise((_resolve) => {
            const callback = (text) => {
                _resolve(text);
                if (Scratch.vm && Scratch.vm.renderer) {
                    Scratch.vm.renderer.removeOverlay(outer);
                }
                if (Scratch.vm && Scratch.vm.runtime) {
                    Scratch.vm.runtime.off("PROJECT_STOP_ALL", handleProjectStopped);
                }
                document.body.removeEventListener("keydown", handleKeyDown, { capture: true });
            };

            let isReadingFile = false;

            const readFile = (file) => {
                if (isReadingFile) return;
                isReadingFile = true;

                const reader = new FileReader();
                reader.onload = () => {
                    callback(reader.result);
                };
                reader.onerror = () => {
                    console.error("Failed to read file", reader.error);
                    callback("");
                };
                if (as === AS_TEXT) {
                    reader.readAsText(file);
                } else {
                    reader.readAsDataURL(file);
                }
            };

            const handleKeyDown = (e) => {
                if (e.key === "Escape") {
                    e.stopPropagation();
                    e.preventDefault();
                    callback("");
                }
            };
            document.body.addEventListener("keydown", handleKeyDown, { capture: true });

            const handleProjectStopped = () => {
                callback("");
            };
            Scratch.vm.runtime.on("PROJECT_STOP_ALL", handleProjectStopped);

            const outer = document.createElement("div");
            outer.style.pointerEvents = "auto";
            outer.style.width = "100%";
            outer.style.height = "100%";
            outer.style.display = "flex";
            outer.style.alignItems = "center";
            outer.style.justifyContent = "center";
            outer.style.background = "rgba(0, 0, 0, 0.5)";
            outer.style.color = "black";
            outer.style.colorScheme = "light";
            outer.addEventListener("dragover", (e) => {
                if (e.dataTransfer.types.includes("Files")) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "copy";
                    modal.style.borderColor = "#03a9fc";
                }
            });
            outer.addEventListener("dragleave", () => {
                modal.style.borderColor = "#888";
            });
            outer.addEventListener("drop", (e) => {
                const file = e.dataTransfer.files[0];
                if (file) {
                    e.preventDefault();
                    readFile(file);
                }
            });
            outer.addEventListener("click", (e) => {
                if (e.target === outer) {
                    callback("");
                }
            });

            const modal = document.createElement("button");
            modal.style.boxShadow = "0 0 10px -5px currentColor";
            modal.style.cursor = "pointer";
            modal.style.font = "inherit";
            modal.style.background = "white";
            modal.style.padding = "16px";
            modal.style.borderRadius = "16px";
            modal.style.border = "8px dashed #888";
            modal.style.position = "relative";
            modal.style.textAlign = "center";
            modal.addEventListener("click", () => {
                input.click();
            });
            modal.focus();
            outer.appendChild(modal);

            const input = document.createElement("input");
            input.type = "file";
            input.accept = accept;
            input.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    readFile(file);
                }
            });

            const title = document.createElement("div");
            title.textContent = "选择或拖入文件";
            title.style.fontSize = "1.5em";
            title.style.marginBottom = "8px";
            modal.appendChild(title);

            const subtitle = document.createElement("div");
            subtitle.textContent = "允许的文件类型：" + (accept || "任意");
            modal.appendChild(subtitle);

            if (openFileSelectorMode === MODE_ONLY_SELECTOR && !isCancelEventSupported(input)) {
                openFileSelectorMode = MODE_IMMEDIATELY_SHOW_SELECTOR;
            }

            if (openFileSelectorMode !== MODE_ONLY_SELECTOR) {
                const overlay = Scratch.vm.renderer.addOverlay(outer, "scale");
                overlay.container.style.zIndex = "100";
            }

            if (openFileSelectorMode === MODE_IMMEDIATELY_SHOW_SELECTOR ||
                openFileSelectorMode === MODE_ONLY_SELECTOR) {
                input.click();
            }

            if (openFileSelectorMode === MODE_ONLY_SELECTOR) {
                input.addEventListener("cancel", () => {
                    callback("");
                });
            }
        });
    }


    // ========== 主类 ==========

    class FilesPlusPlus {
        constructor() {
            this.downloads = downloadProgress;
            this._lastDownloadId = "";
            this.isDesktop = isDesktop();
        }

        getInfo() {
            return {
                id: "filesplusplus",
                name: "📁 文件++",
                color1: "#FF8F00",
                color2: "#E65100",
                color3: "#BF360C",

                // 下载功能完全不用 EditorPreload，只在文件修改时用
                permissions: [
                    'file-read',
                    'file-write',
                    'file-metadata',
                    'file-delete'
                ],

                blocks: [
                    // ====== 第一部分：打开文件（保留原始 Files 功能） ======
                    {
                        opcode: "showPicker",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "打开一个文件",
                        disableMonitor: true,
                        hideFromPalette: true,
                    },
                    {
                        opcode: "showPickerExtensions",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "打开一个 [extension] 文件",
                        arguments: {
                            extension: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ".txt",
                            },
                        },
                        hideFromPalette: true,
                    },
                    {
                        opcode: "showPickerAs",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "打开一个文件作为 [as]",
                        arguments: {
                            as: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "encoding",
                            },
                        },
                    },
                    {
                        opcode: "showPickerExtensionsAs",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "打开一个 [extension] 文件作为 [as]",
                        arguments: {
                            extension: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ".txt",
                            },
                            as: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "encoding",
                            },
                        },
                    },

                    "---",

                    // ====== 第二部分：下载（核心！能下 exe！） ======
                    {
                        opcode: "downloadText",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "下载文本 [text] 为 [file]",
                        arguments: {
                            text: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello, world!",
                            },
                            file: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "save.txt",
                            },
                        },
                    },
                    {
                        opcode: "downloadURL",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "下载 [url] 保存为 [file]",
                        arguments: {
                            url: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "https://example.com/setup.exe",
                            },
                            file: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "setup.exe",
                            },
                        },
                    },

                    "---",

                    // ====== 第三部分：下载进度监控（数值块） ======
                    {
                        opcode: "getDownloadProgress",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "下载 [id] 进度 %",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "last",
                            },
                        },
                    },
                    {
                        opcode: "getDownloadStatus",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "下载 [id] 状态",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "last",
                            },
                        },
                    },
                    {
                        opcode: "getDownloadLoaded",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "下载 [id] 已下载字节数",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "last",
                            },
                        },
                    },
                    {
                        opcode: "getDownloadTotal",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "下载 [id] 总字节数",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "last",
                            },
                        },
                    },
                    {
                        opcode: "getLastDownloadId",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "最后一个下载 ID",
                    },
                    {
                        opcode: "isDownloadComplete",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "下载 [id] 是否完成?",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "last",
                            },
                        },
                    },

                    "---",

                    // ====== 第四部分：文件修改（用 EditorPreload，仅桌面版） ======
                    {
                        opcode: "modifyFileReplace",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "修改文件 [path] 替换 [old] 为 [new]",
                        arguments: {
                            path: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "%DESKTOP%\\config.txt",
                            },
                            old: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "old text",
                            },
                            new: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new text",
                            },
                        },
                    },
                    {
                        opcode: "modifyFileInsert",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "修改文件 [path] 在 [position] 位置插入 [content]",
                        arguments: {
                            path: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "%DESKTOP%\\data.txt",
                            },
                            position: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            content: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "inserted text",
                            },
                        },
                    },
                    {
                        opcode: "modifyFileAppendLine",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "修改文件 [path] 追加一行 [line]",
                        arguments: {
                            path: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "%DESKTOP%\\log.txt",
                            },
                            line: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new log entry",
                            },
                        },
                    },
                    {
                        opcode: "modifyFileDeleteLine",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "修改文件 [path] 删除第 [lineNum] 行",
                        arguments: {
                            path: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "%DESKTOP%\\data.txt",
                            },
                            lineNum: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                        },
                    },
                    {
                        opcode: "modifyFilePrepend",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "修改文件 [path] 在开头插入 [content]",
                        arguments: {
                            path: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "%DESKTOP%\\data.txt",
                            },
                            content: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "front text",
                            },
                        },
                    },
                    {
                        opcode: "modifyFileClear",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "清空文件 [path]",
                        arguments: {
                            path: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "%DESKTOP%\\log.txt",
                            },
                        },
                    },

                    "---",

                    // ====== 第五部分：文件信息查看 ======
                    {
                        opcode: "getFileSize",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "文件 [path] 大小",
                        arguments: {
                            path: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "%DESKTOP%\\file.txt",
                            },
                        },
                    },
                    {
                        opcode: "getFileLineCount",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "文件 [path] 行数",
                        arguments: {
                            path: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "%DESKTOP%\\file.txt",
                            },
                        },
                    },
                    {
                        opcode: "getFileLine",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "文件 [path] 第 [lineNum] 行",
                        arguments: {
                            path: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "%DESKTOP%\\file.txt",
                            },
                            lineNum: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                        },
                    },
                    {
                        opcode: "fileExists",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "文件 [path] 存在?",
                        arguments: {
                            path: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "%DESKTOP%\\file.txt",
                            },
                        },
                    },

                    "---",

                    // ====== 第六部分：设置 ======
                    {
                        opcode: "setOpenMode",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "设置文件选择器模式为 [mode]",
                        arguments: {
                            mode: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: MODE_MODAL,
                                menu: "automaticallyOpen",
                            },
                        },
                    },
                ],

                menus: {
                    encoding: {
                        acceptReporters: true,
                        items: [
                            { text: "文本", value: AS_TEXT },
                            { text: "data: URL", value: AS_DATA_URL },
                        ],
                    },
                    automaticallyOpen: {
                        acceptReporters: true,
                        items: [
                            { text: "显示打开页面", value: MODE_MODAL },
                            { text: "显示打开页面并跳出文件选择页面", value: MODE_IMMEDIATELY_SHOW_SELECTOR },
                            { text: "跳出文件选择页面（实验性）", value: MODE_ONLY_SELECTOR },
                        ],
                    },
                },
            };
        }

        // ========== 打开文件方法 ==========

        showPicker() {
            return showFilePrompt("", AS_TEXT);
        }

        showPickerExtensions(args) {
            return showFilePrompt(args.extension, AS_TEXT);
        }

        showPickerAs(args) {
            return showFilePrompt("", args.as);
        }

        showPickerExtensionsAs(args) {
            return showFilePrompt(args.extension, args.as);
        }

        // ========== 下载方法（核心：能下 exe！） ==========

        /**
         * 下载文本 — 走浏览器保存对话框
         */
        async downloadText(args) {
            const text = Scratch.Cast.toString(args.text);
            const file = Scratch.Cast.toString(args.file);
            const dlId = generateDownloadId();

            try {
                this.downloads.set(dlId, { loaded: 0, total: text.length, percent: 0, status: 'starting' });
                this._lastDownloadId = dlId;

                this.downloads.set(dlId, { loaded: Math.floor(text.length * 0.3), total: text.length, percent: 30, status: 'downloading' });

                await downloadContent(text, file);

                this.downloads.set(dlId, { loaded: text.length, total: text.length, percent: 100, status: 'completed' });
                console.log(`✅ 下载完成: ${file}`);
            } catch (e) {
                this.downloads.set(dlId, { loaded: 0, total: text.length, percent: 0, status: 'error: ' + e.message });
                console.error("下载失败:", e);
            }
        }

        /**
         * 从网上下载文件 — 核心积木！
         *
         * 用法：下载 [https://example.com/setup.exe] 保存为 [setup.exe]
         *
         * 流程：
         *   Scratch.fetch(url) → response.blob() → Blob → <a download>.click()
         *   → 浏览器弹出"另存为"对话框 → 用户选位置 → 保存完成
         *
         * .exe/.zip/.rar 等危险文件：浏览器一定会弹"另存为"
         * .txt/.png/.mp3 等安全文件：也会弹（因为有 download 属性）
         *
         * 全程不用 EditorPreload 写文件！
         */
        async downloadURL(args) {
            const url = Scratch.Cast.toString(args.url);
            const file = Scratch.Cast.toString(args.file);
            const dlId = generateDownloadId();

            try {
                // 初始状态
                this.downloads.set(dlId, { loaded: 0, total: 0, percent: 0, status: '连接中...' });
                this._lastDownloadId = dlId;

                console.log(`🔗 开始下载: ${url}`);
                console.log(`📁 保存为: ${file}`);

                // 用 fetch 获取（能拿到 total 大小）
                const response = await Scratch.fetch(url);
                if (!response.ok) {
                    throw new Error(`服务器返回 ${response.status}`);
                }

                // 获取总大小
                const totalSize = parseInt(response.headers.get('content-length') || '0', 10);
                this.downloads.set(dlId, { loaded: 0, total: totalSize, percent: 5, status: '下载中...' });

                // 流式读取，实时更新进度
                const reader = response.body.getReader();
                const chunks = [];
                let received = 0;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                    received += value.length;
                    const percent = totalSize > 0
                        ? Math.round((received / totalSize) * 90)
                        : Math.min(90, Math.round(received / 10000));
                    this.downloads.set(dlId, { loaded: received, total: totalSize || received, percent, status: '下载中...' });
                }

                // 组装 Blob
                const blob = new Blob(chunks);
                this.downloads.set(dlId, { loaded: received, total: received, percent: 95, status: '弹出保存对话框...' });

                // 触发浏览器保存对话框
                // 这就是"能下 exe"的关键一行：
                await triggerBrowserDownload(blob, file);

                this.downloads.set(dlId, { loaded: received, total: received, percent: 100, status: 'completed' });

                const sizeStr = formatSize(received);
                console.log(`✅ 下载完成: ${file} (${sizeStr}) — 浏览器已弹出"另存为"对话框`);
            } catch (e) {
                this.downloads.set(dlId, { loaded: 0, total: 0, percent: 0, status: 'error: ' + e.message });
                console.error("❌ URL下载失败:", e.message);
            }
        }

        // ========== 下载进度监控方法 ==========

        _resolveDownloadId(id) {
            if (!id || id === 'last') {
                return this._lastDownloadId || null;
            }
            return this.downloads.has(id) ? id : null;
        }

        getDownloadProgress(args) {
            const id = this._resolveDownloadId(args.id);
            if (!id) return 0;
            const info = this.downloads.get(id);
            return info ? info.percent : 0;
        }

        getDownloadStatus(args) {
            const id = this._resolveDownloadId(args.id);
            if (!id) return '';
            const info = this.downloads.get(id);
            return info ? info.status : '';
        }

        getDownloadLoaded(args) {
            const id = this._resolveDownloadId(args.id);
            if (!id) return 0;
            const info = this.downloads.get(id);
            return info ? info.loaded : 0;
        }

        getDownloadTotal(args) {
            const id = this._resolveDownloadId(args.id);
            if (!id) return 0;
            const info = this.downloads.get(id);
            return info ? info.total : 0;
        }

        getLastDownloadId() {
            return this._lastDownloadId || "";
        }

        isDownloadComplete(args) {
            const id = this._resolveDownloadId(args.id);
            if (!id) return false;
            const info = this.downloads.get(id);
            return info ? info.status === 'completed' : false;
        }

        // ========== 文件修改方法（用 EditorPreload，仅桌面版） ==========

        async modifyFileReplace(args) {
            if (!this.isDesktop) {
                console.error("❌ 文件修改功能仅支持桌面版（需要 EditorPreload）");
                return;
            }

            const path = Scratch.Cast.toString(args.path);
            const oldText = Scratch.Cast.toString(args.old);
            const newText = Scratch.Cast.toString(args.new);

            try {
                const result = await EditorPreload.readFile(path);
                if (!result.success) {
                    console.error(`❌ 读取失败: ${result.error}`);
                    return;
                }

                const content = result.content;
                const escaped = oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escaped, 'g');
                const newContent = content.replace(regex, newText);
                const replaceCount = (content.match(regex) || []).length;

                const writeResult = await EditorPreload.writeFile(path, newContent);
                if (writeResult.success) {
                    console.log(`✅ 已替换 ${replaceCount} 处文本 in ${path}`);
                } else {
                    console.error(`❌ 写入失败: ${writeResult.error}`);
                }
            } catch (e) {
                console.error("❌ 替换操作失败:", e.message);
            }
        }

        async modifyFileInsert(args) {
            if (!this.isDesktop) {
                console.error("❌ 文件修改功能仅支持桌面版");
                return;
            }

            const path = Scratch.Cast.toString(args.path);
            const position = Math.max(0, Math.floor(Number(args.position) || 0));
            const contentToInsert = Scratch.Cast.toString(args.content);

            try {
                const result = await EditorPreload.readFile(path);
                let content = "";

                if (result.success) {
                    content = result.content;
                } else if (result.error && result.error.includes("不存在")) {
                    console.log(`📄 文件不存在，将创建新文件: ${path}`);
                } else {
                    console.error(`❌ 读取失败: ${result.error}`);
                    return;
                }

                const finalContent = content.slice(0, position) + contentToInsert + content.slice(position);

                const writeResult = await EditorPreload.writeFile(path, finalContent);
                if (writeResult.success) {
                    console.log(`✅ 已在位置 ${position} 插入文本到 ${path}`);
                } else {
                    console.error(`❌ 写入失败: ${writeResult.error}`);
                }
            } catch (e) {
                console.error("❌ 插入操作失败:", e.message);
            }
        }

        async modifyFileAppendLine(args) {
            if (!this.isDesktop) {
                console.error("❌ 文件修改功能仅支持桌面版");
                return;
            }

            const path = Scratch.Cast.toString(args.path);
            const line = Scratch.Cast.toString(args.line);

            try {
                const result = await EditorPreload.readFile(path);
                let content = "";

                if (result.success) {
                    content = result.content;
                } else if (result.error && result.error.includes("不存在")) {
                    console.log(`📄 文件不存在，将创建新文件: ${path}`);
                } else {
                    console.error(`❌ 读取失败: ${result.error}`);
                    return;
                }

                const separator = content.endsWith('\n') ? '' : '\n';
                const newContent = content + separator + line + '\n';

                const writeResult = await EditorPreload.writeFile(path, newContent);
                if (writeResult.success) {
                    console.log(`✅ 已追加一行到 ${path}`);
                } else {
                    console.error(`❌ 写入失败: ${writeResult.error}`);
                }
            } catch (e) {
                console.error("❌ 追加操作失败:", e.message);
            }
        }

        async modifyFileDeleteLine(args) {
            if (!this.isDesktop) {
                console.error("❌ 文件修改功能仅支持桌面版");
                return;
            }

            const path = Scratch.Cast.toString(args.path);
            const lineNum = Math.max(1, Math.floor(Number(args.lineNum) || 1));

            try {
                const result = await EditorPreload.readFile(path);
                if (!result.success) {
                    console.error(`❌ 读取失败: ${result.error}`);
                    return;
                }

                const lines = result.content.split(/\r?\n/);

                if (lineNum > lines.length) {
                    console.error(`❌ 行号 ${lineNum} 超出范围 (共 ${lines.length} 行)`);
                    return;
                }

                const removedLine = lines.splice(lineNum - 1, 1)[0];
                const newContent = lines.join('\n');

                const writeResult = await EditorPreload.writeFile(path, newContent);
                if (writeResult.success) {
                    console.log(`✅ 已删除第 ${lineNum} 行: "${removedLine.substring(0, 50)}" from ${path}`);
                } else {
                    console.error(`❌ 写入失败: ${writeResult.error}`);
                }
            } catch (e) {
                console.error("❌ 删除行操作失败:", e.message);
            }
        }

        async modifyFilePrepend(args) {
            if (!this.isDesktop) {
                console.error("❌ 文件修改功能仅支持桌面版");
                return;
            }

            const path = Scratch.Cast.toString(args.path);
            const contentToInsert = Scratch.Cast.toString(args.content);

            try {
                const result = await EditorPreload.readFile(path);
                let content = "";

                if (result.success) {
                    content = result.content;
                } else if (result.error && result.error.includes("不存在")) {
                    console.log(`📄 文件不存在，将创建新文件: ${path}`);
                } else {
                    console.error(`❌ 读取失败: ${result.error}`);
                    return;
                }

                const newContent = contentToInsert + content;

                const writeResult = await EditorPreload.writeFile(path, newContent);
                if (writeResult.success) {
                    console.log(`✅ 已在开头插入文本到 ${path}`);
                } else {
                    console.error(`❌ 写入失败: ${writeResult.error}`);
                }
            } catch (e) {
                console.error("❌ 开头插入操作失败:", e.message);
            }
        }

        async modifyFileClear(args) {
            if (!this.isDesktop) {
                console.error("❌ 文件修改功能仅支持桌面版");
                return;
            }

            const path = Scratch.Cast.toString(args.path);

            try {
                const result = await EditorPreload.writeFile(path, "");
                if (result.success) {
                    console.log(`✅ 已清空文件: ${path}`);
                } else {
                    console.error(`❌ 清空失败: ${result.error}`);
                }
            } catch (e) {
                console.error("❌ 清空操作失败:", e.message);
            }
        }

        // ========== 文件信息方法（用 EditorPreload，仅桌面版） ==========

        async getFileSize(args) {
            if (!this.isDesktop) return "❌ 需要桌面版";

            const path = Scratch.Cast.toString(args.path);
            try {
                const result = await EditorPreload.getFileStats(path);
                if (result.success) {
                    return formatSize(result.stats.size);
                } else {
                    return `❌ ${result.error}`;
                }
            } catch (e) {
                return `❌ ${e.message}`;
            }
        }

        async getFileLineCount(args) {
            if (!this.isDesktop) return 0;

            const path = Scratch.Cast.toString(args.path);
            try {
                const result = await EditorPreload.readFile(path);
                if (result.success) {
                    const lines = result.content.split(/\r?\n/);
                    return lines.length;
                }
                return 0;
            } catch (e) {
                return 0;
            }
        }

        async getFileLine(args) {
            if (!this.isDesktop) return "";

            const path = Scratch.Cast.toString(args.path);
            const lineNum = Math.max(1, Math.floor(Number(args.lineNum) || 1));

            try {
                const result = await EditorPreload.readFile(path);
                if (result.success) {
                    const lines = result.content.split(/\r?\n/);
                    if (lineNum <= lines.length) {
                        return lines[lineNum - 1];
                    }
                    return "";
                }
                return "";
            } catch (e) {
                return "";
            }
        }

        async fileExists(args) {
            if (!this.isDesktop) return false;

            const path = Scratch.Cast.toString(args.path);
            try {
                const result = await EditorPreload.getFileStats(path);
                return result.success;
            } catch (e) {
                return false;
            }
        }

        // ========== 设置方法 ==========

        setOpenMode(args) {
            if (ALL_MODES.includes(args.mode)) {
                openFileSelectorMode = args.mode;
            } else {
                console.warn(`unknown mode: ${args.mode}`);
            }
        }
    }

    Scratch.extensions.register(new FilesPlusPlus());
})(Scratch);
