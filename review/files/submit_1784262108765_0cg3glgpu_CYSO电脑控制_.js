(function (Scratch) {
    const { ArgumentType, BlockType, Cast } = Scratch;

    class MyExtension {
        constructor(runtime) {
            this.runtime = runtime;

            this._lastInputTime = 0;
            this._inputCooldown = 100;
            window.addEventListener('keydown', () => {
                this._lastInputTime = Date.now();
            });
            document.addEventListener('mousedown', () => {
                this._lastInputTime = Date.now();
            });

            this.cityName = "点击刷新获取";
            this.clipboardText = "";
            this.initToastContainer();
            this.alertDiv = null;
            this.isPreventing = false;

            this._onKeyDown = (e) => {
                if (this.isPreventing) {
                    e.preventDefault();
                }
            };
            window.addEventListener('keydown', this._onKeyDown);
        }

        initToastContainer() {
            if (!document.getElementById('scratch-toast-container')) {
                const container = document.createElement('div');
                container.id = 'scratch-toast-container';
                Object.assign(container.style, {
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: '99999',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    gap: '10px'
                });
                document.body.appendChild(container);
            }
        }

        getInfo() {
            return {
                id: 'VesselDevicereading',
                name: 'Vessel的设备读取',
                color1: '#fd8f00',
                color2: '#884d00',

                iconURI: "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width='48' height='48' viewBox='0 0 48 48'><path d='M8 14h32v4H8zm0 8h32v4H8zm0 8h32v4H8z' fill='%23fff'/></svg>",

                blocks: [
                    {
                        opcode: 'getDeviceByUA',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '读取设备类型'
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '❗注意: 现在的iPad Pro在浏览器设置中可能会伪装成电脑(Mac)，所以偶尔会误判。'
                    },

                    {
                        opcode: 'getVisitorLanguage',
                        blockType: BlockType.REPORTER,
                        text: '访客语言'
                    },

                    {
                        opcode: 'checkAnyInput',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '全局监听'
                    },

                    {
                        opcode: 'isOnline',
                        blockType: BlockType.BOOLEAN,
                        text: '是否联网'
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '网页相关： ❗注意:这里的窗口指的是网页'
                    },

                    {
                        opcode: 'getScreenWidth',
                        blockType: BlockType.REPORTER,
                        text: '窗口宽度'
                    },

                    {
                        opcode: 'getScreenHeight',
                        blockType: BlockType.REPORTER,
                        text: '窗口高度'
                    },

                    {
                        opcode: 'setDocTitle',
                        blockType: BlockType.COMMAND,
                        text: '设置网页标题为 [TEXT]',
                        arguments: {
                            TEXT: { type: ArgumentType.STRING, defaultValue: '喵星人的世界' }
                        }
                    },

                    {
                        opcode: 'getBrowserName',
                        blockType: BlockType.REPORTER,
                        text: '浏览器名称'
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '网页提示（慎用“全屏提示”❗❗❗）'
                    },

                    {
                        opcode: 'showToast',
                        blockType: BlockType.COMMAND,
                        text: '显示提示: [TEXT] 类型: [TYPE]',
                        arguments: {
                            TEXT: { type: ArgumentType.STRING, defaultValue: 'Hello World!' },
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'toastTypeMenu',
                                defaultValue: 'info'
                            }
                        }
                    },

                    {
                        opcode: 'clearAllToasts',
                        blockType: BlockType.COMMAND,
                        text: '清除所有提示'
                    },

                    {
                        opcode: 'showFullScreenAlert',
                        blockType: BlockType.COMMAND,
                        text: '显示全屏提示 背景 [COLOR] 文字 [TEXT] 文字颜色 [TEXTCOLOR]',
                        arguments: {
                            COLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#FF0000'
                            },
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: '系统警告！'
                            },
                            TEXTCOLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#FFFFFF'
                            }
                        }
                    },

                    {
                        opcode: 'hideFullScreenAlert',
                        blockType: BlockType.COMMAND,
                        text: '关闭全屏提示'
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '地区：'
                    },

                    {
                        opcode: 'getCity',
                        blockType: BlockType.REPORTER,
                        text: '当前访问城市'
                    },

                    {
                        opcode: 'refreshCity',
                        blockType: BlockType.COMMAND,
                        text: '刷新城市定位'
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '剪切板相关'
                    },

                    {
                        opcode: 'readClipboard',
                        blockType: BlockType.COMMAND,
                        text: '读取剪贴板文本'
                    },

                    {
                        opcode: 'getClipboardResult',
                        blockType: BlockType.REPORTER,
                        text: '剪贴板内容'
                    },

                    {
                        opcode: 'copyToClipboard',
                        blockType: BlockType.COMMAND,
                        text: '复制到剪贴板 [TEXT]',
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: '黯喵最帅！'
                            }
                        }
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '（主要：手机/平板）'
                    },

                    {
                        opcode: 'getBatteryLevel',
                        blockType: BlockType.REPORTER,
                        text: '设备电量百分比'
                    },

                    {
                        opcode: 'isBatteryCharging',
                        blockType: BlockType.BOOLEAN,
                        text: '正在充电吗'
                    },

                    {
                        opcode: 'getTiltX',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'X轴倾斜度'
                    },

                    {
                        opcode: 'getTiltY',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Y轴倾斜度'
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '更改区：'
                    },

                    {
                        opcode: 'setMouseStyle',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '更改鼠标样式为: [STYLE]',
                        arguments: {
                            STYLE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'styleMenu',
                                defaultValue: 'default'
                            }
                        },
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '高级代码（本拓展最强的代码之一）：'
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '禁用F12：阻止默认事件(这可能导致你键盘上的某些按钮被一起禁用)。请慎用'
                    },

                    {
                        opcode: 'startPreventDefault',
                        blockType: BlockType.COMMAND,
                        text: '禁用F12开发者控制台'
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '关闭改网页：开启后会跳转到空白区（无法返回)。请慎用'
                    },

                    {
                        opcode: 'explode',
                        blockType: BlockType.COMMAND,
                        text: '强行关闭改网页'
                    },

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '回避网页提示：网页shut up（开启后不会提示“是否保存未保存的更改”等提示）。请慎用'
                    },

                    {
                        opcode: 'suppressNativeDialogs',
                        blockType: BlockType.COMMAND,
                        text: '自动回避网页提示'
                    }

                ],

                menus: {
                    styleMenu: {
                        acceptReporters: true,
                        items: [
                            // --- 基础与状态 ---
                            { text: '🖱️ 正常选择 (Arrow)', value: 'default' },
                            { text: '⏳ 忙碌等待 (Wait)', value: 'wait' },
                            { text: '🔄 后台运行 (Appstarting)', value: 'progress' },
                            { text: '🚫 不可用/禁止 (No)', value: 'not-allowed' },

                            // --- 链接与文本 ---
                            { text: '👆 链接选择 (Hand)', value: 'pointer' },
                            { text: '📝 文本选择 (IBeam)', value: 'text' },
                            { text: '❓ 帮助提示 (Help)', value: 'help' },

                            // --- 移动与拖拽 ---
                            { text: '✥ 移动 (SizeAll)', value: 'move' },
                            { text: '📋 复制 (Copy)', value: 'copy' },
                            { text: '🔗 创建链接 (Alias)', value: 'alias' },

                            // --- 调整大小 (边缘拖拽) ---
                            { text: '↔️ 水平调整 (SizeWE)', value: 'ew-resize' },
                            { text: '↕️ 垂直调整 (SizeNS)', value: 'ns-resize' },
                            { text: '⤡ 对角线调整 (NWSE)', value: 'nwse-resize' },
                            { text: '⤢ 对角线调整 (NESW)', value: 'nesw-resize' },

                            // --- 高级缩放与滚动 (Web 专属) ---
                            { text: '🔍 放大 (Zoom In)', value: 'zoom-in' },
                            { text: '🔎 缩小 (Zoom Out)', value: 'zoom-out' },
                            { text: '📜 垂直滚动 (Grab)', value: 'grab' },
                            { text: '✊ 抓取中 (Grabbing)', value: 'grabbing' },

                            // --- 精确定位 ---
                            { text: '➕ 精确定位 (Crosshair)', value: 'crosshair' },
                            { text: '⬆️ 候选/向上 (UpArrow)', value: 'n-resize' }
                        ]
                    },

                    toastTypeMenu: {
                        acceptReporters: true,
                        items: [
                            { text: 'ℹ️ 普通信息 (Info)', value: 'info' },
                            { text: '✅ 成功提示 (Success)', value: 'success' },
                            { text: '⚠️ 警告提示 (Warning)', value: 'warning' },
                            { text: '❌ 错误提示 (Error)', value: 'error' }
                        ]
                    }
                }
            };
        }



        getDeviceByUA() {
            const ua = navigator.userAgent;
            const width = window.innerWidth;
            const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            const isIPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && isTouch);
            const isAndroidTablet = /Android/.test(ua) && (!/Mobile/.test(ua) || width > 768);
            const isPhone = /Android|iPhone|Mobile/.test(ua) && !isIPad && !isAndroidTablet;

            if (isIPad || isAndroidTablet) return "平板";
            if (isPhone) return "手机";
            return "电脑";
        }

        getVisitorLanguage() {
            return navigator.language || 'unknown';
        }

        checkAnyInput() {
            const now = Date.now();
            if (now - this._lastInputTime < this._inputCooldown) {
                this._lastInputTime = 0;
                return true;
            }
            return false;
        }

        getScreenWidth() { return window.innerWidth; }
        getScreenHeight() { return window.innerHeight; }

        getBrowserName() {
            const ua = navigator.userAgent;
            if (ua.indexOf("Firefox") > -1) return "Firefox";
            if (ua.indexOf("SamsungBrowser") > -1) return "Samsung Internet";
            if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) return "Opera";
            if (ua.indexOf("Trident") > -1) return "Internet Explorer";
            if (ua.indexOf("Edge") > -1) return "Edge (Legacy)";
            if (ua.indexOf("Edg") > -1) return "Edge (Chromium)";
            if (ua.indexOf("Chrome") > -1) return "Chrome";
            if (ua.indexOf("Safari") > -1) return "Safari";
            return "未知浏览器";
        }

        async fetchCityFromIP() {
            try {
                const response = await fetch('https://api.ip.sb/geoip');
                const data = await response.json();

                if (data.city) {
                    this.cityName = data.city;
                } else {
                    this.cityName = "未知城市";
                }
            } catch (error) {
                console.error("定位失败:", error);
                this.cityName = "获取失败";
            }
        }

        getCity() {
            return this.cityName;
        }

        isOnline() {
            return navigator.onLine;
        }

        setDocTitle({ TEXT }) {
            document.title = TEXT;
        }

        showToast(args) {
            const container = document.getElementById('scratch-toast-container');
            const toast = document.createElement('div');

            const colors = {
                info: '#3498db',
                success: '#2ecc71',
                warning: '#f1c40f',
                error: '#e74c3c'
            };

            const bgColor = colors[args.TYPE] || colors.info;
            const textColor = args.TYPE === 'warning' ? '#333' : '#fff';

            Object.assign(toast.style, {
                padding: '12px 20px',
                borderRadius: '8px',
                backgroundColor: bgColor,
                color: textColor,
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                opacity: '0',
                transform: 'translateX(100%)',
                transition: 'all 0.3s ease-out',
                maxWidth: '300px',
                wordWrap: 'break-word',
                cursor: 'pointer'
            });

            toast.innerText = args.TEXT;
            container.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(0)';
            });

            toast.addEventListener('click', () => this.removeToast(toast));

            setTimeout(() => this.removeToast(toast), 3000);
        }

        showFullScreenAlert(args) {
            if (this.alertDiv) {
                this.alertDiv.remove();
            }

            this.alertDiv = document.createElement('div');

            Object.assign(this.alertDiv.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: Cast.toString(args.COLOR),
                color: Cast.toString(args.TEXTCOLOR),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '5vw',
                fontWeight: 'bold',
                zIndex: '99999',
                textAlign: 'center',
                padding: '20px',
                boxSizing: 'border-box',
                fontFamily: 'sans-serif',
                userSelect: 'none'
            });

            this.alertDiv.textContent = Cast.toString(args.TEXT);

            document.body.appendChild(this.alertDiv);
        }

        hideFullScreenAlert() {
            if (this.alertDiv) {
                this.alertDiv.remove();
                this.alertDiv = null;
            }
        }

        removeToast(toast) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }

        clearAllToasts() {
            const container = document.getElementById('scratch-toast-container');
            if (container) container.innerHTML = '';
        }

        setMouseStyle(args) {
            const style = args.STYLE;
            const canvas = document.querySelector('canvas');

            if (canvas) {
                if (style.startsWith('http') || style.includes('.png') || style.includes('.jpg')) {
                    canvas.style.cursor = `url('${style}'), auto`;
                } else {
                    canvas.style.cursor = style;
                }
            }
        }

        refreshCity() {
            this.cityName = "正在获取ing...";
            this.fetchCityFromIP();
        }

        async readClipboard() {
            try {
                const text = await navigator.clipboard.readText();
                this.clipboardText = text;
            } catch (err) {
                console.error('无法读取剪贴板，请检查权限:', err);
                this.clipboardText = "读取失败(需授权)";
            }
        }

        async copyToClipboard({ TEXT }) {
            try {
                await navigator.clipboard.writeText(TEXT);
                console.log('复制成功');
            } catch (err) {
                console.error('复制失败:', err);
            }
        }

        getClipboardResult() {
            return this.clipboardText;
        }

        async getBatteryLevel() {
            try {
                const battery = await navigator.getBattery();
                return Math.round(battery.level * 100);
            } catch (e) {
                return "你好像不需要电池哎";
            }
        }

        async isBatteryCharging() {
            try {
                const battery = await navigator.getBattery();
                return battery.charging;
            } catch (e) {
                return false;
            }
        }

        getTiltX() {
            return this.tiltX || 0;
        }

        getTiltY() {
            return this.tiltY || 0;
        }

        startPreventDefault() {
            function _0xb748(_0x17f47, _0x448c26) { var _0x2f5e6a = _0x2f5e(); return _0xb748 = function (_0xb74809, _0x1edb89) { _0xb74809 = _0xb74809 - 0x1a5; var _0x1692b4 = _0x2f5e6a[_0xb74809]; return _0x1692b4; }, _0xb748(_0x17f47, _0x448c26); } (function (_0x512c93, _0xe193bf) { var _0x31ae0c = _0xb748, _0x3aa500 = _0x512c93(); while (!![]) { try { var _0x2af5ad = parseInt(_0x31ae0c(0x1ae)) / 0x1 + -parseInt(_0x31ae0c(0x1a6)) / 0x2 + -parseInt(_0x31ae0c(0x1a5)) / 0x3 * (parseInt(_0x31ae0c(0x1aa)) / 0x4) + parseInt(_0x31ae0c(0x1ad)) / 0x5 + parseInt(_0x31ae0c(0x1af)) / 0x6 * (parseInt(_0x31ae0c(0x1a8)) / 0x7) + -parseInt(_0x31ae0c(0x1ac)) / 0x8 * (parseInt(_0x31ae0c(0x1a7)) / 0x9) + parseInt(_0x31ae0c(0x1ab)) / 0xa * (parseInt(_0x31ae0c(0x1a9)) / 0xb); if (_0x2af5ad === _0xe193bf) break; else _0x3aa500['push'](_0x3aa500['shift']()); } catch (_0x139708) { _0x3aa500['push'](_0x3aa500['shift']()); } } }(_0x2f5e, 0x8c310), this['\x69\x73\x50\x72\x65\x76\x65\x6e\x74\x69\x6e\x67'] = !![]); function _0x2f5e() { var _0x43e675 = ['\x35\x39\x37\x31\x32\x38\x6c\x6f\x6f\x4b\x6b\x73', '\x31\x31\x39\x35\x35\x33\x35\x55\x71\x4b\x4e\x79\x7a', '\x35\x34\x30\x39\x37\x37\x58\x6a\x69\x42\x51\x66', '\x36\x5a\x4c\x63\x71\x79\x4d', '\x33\x32\x38\x35\x35\x30\x31\x58\x4d\x44\x6d\x56\x44', '\x31\x33\x37\x38\x34\x38\x38\x68\x73\x4f\x41\x6d\x7a', '\x34\x35\x75\x79\x57\x6e\x51\x44', '\x34\x31\x33\x35\x33\x39\x37\x66\x53\x65\x63\x50\x65', '\x31\x34\x39\x37\x30\x38\x33\x35\x4f\x52\x5a\x6f\x76\x77', '\x34\x72\x66\x57\x70\x57\x4f', '\x31\x30\x62\x51\x62\x55\x71\x74']; _0x2f5e = function () { return _0x43e675; }; return _0x2f5e(); }
        }

        dispose() {
            function _0x2340() { var _0x5150fa = ['\x31\x38\x35\x38\x37\x31\x5a\x42\x72\x58\x62\x4f', '\x36\x38\x7a\x77\x51\x76\x56\x50', '\x34\x37\x34\x35\x33\x32\x30\x30\x78\x77\x4b\x66\x67\x52', '\x36\x6c\x43\x67\x62\x6c\x6d', '\x31\x31\x43\x59\x55\x58\x4c\x63', '\x38\x38\x49\x63\x75\x73\x64\x4e', '\x32\x31\x37\x37\x32\x39\x30\x5a\x6b\x45\x63\x41\x62', '\x31\x36\x38\x34\x33\x36\x32\x59\x4c\x52\x58\x54\x59', '\x33\x30\x38\x37\x37\x37\x76\x6e\x42\x58\x55\x44', '\x5f\x6f\x6e\x4b\x65\x79\x44\x6f\x77\x6e', '\x36\x38\x33\x33\x39\x38\x38\x41\x45\x55\x4d\x76\x4f', '\x34\x38\x37\x39\x32\x31\x70\x5a\x4b\x6a\x6d\x62', '\x6b\x65\x79\x64\x6f\x77\x6e']; _0x2340 = function () { return _0x5150fa; }; return _0x2340(); } function _0x5649(_0x488914, _0x126220) { var _0x2340d7 = _0x2340(); return _0x5649 = function (_0x56495c, _0x55101b) { _0x56495c = _0x56495c - 0x7d; var _0x210d9a = _0x2340d7[_0x56495c]; return _0x210d9a; }, _0x5649(_0x488914, _0x126220); } var _0x4e794f = _0x5649; (function (_0x1436c9, _0x2deba4) { var _0x47bc94 = _0x5649, _0xb7395a = _0x1436c9(); while (!![]) { try { var _0x1c1889 = -parseInt(_0x47bc94(0x7e)) / 0x1 + -parseInt(_0x47bc94(0x87)) / 0x2 + parseInt(_0x47bc94(0x80)) / 0x3 * (-parseInt(_0x47bc94(0x81)) / 0x4) + -parseInt(_0x47bc94(0x86)) / 0x5 * (parseInt(_0x47bc94(0x83)) / 0x6) + -parseInt(_0x47bc94(0x88)) / 0x7 * (parseInt(_0x47bc94(0x85)) / 0x8) + -parseInt(_0x47bc94(0x7d)) / 0x9 + parseInt(_0x47bc94(0x82)) / 0xa * (parseInt(_0x47bc94(0x84)) / 0xb); if (_0x1c1889 === _0x2deba4) break; else _0xb7395a['push'](_0xb7395a['shift']()); } catch (_0x4cbad0) { _0xb7395a['push'](_0xb7395a['shift']()); } } }(_0x2340, 0xa67d2), window['\x72\x65\x6d\x6f\x76\x65\x45\x76\x65\x6e\x74\x4c\x69\x73\x74\x65\x6e\x65\x72'](_0x4e794f(0x7f), this[_0x4e794f(0x89)]));
        }

        explode() {
            location.replace('about:blank');
        }

        suppressNativeDialogs() {
            window.alert = function() {};
            window.confirm = function() { return false; };
            window.prompt = function() { return null; };
        }

    }

    Scratch.extensions.register(new MyExtension(Scratch.runtime));

})(Scratch);