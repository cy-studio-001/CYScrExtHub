(function (_Scratch) {
    const { BlockType, extensions, runtime } = _Scratch;

    class WebpageScreenSealingExtension {
        constructor(_runtime) {
            this._runtime = _runtime;
            this.alertDiv = null;
            this.isSealed = false;
            this.isBlocking = false;

            this._debuggerTimer = null;
            this._detectTimer = null;

            this.b = this.b.bind(this);

            this._onKeyDown = (event) => {
                if (!this.isBlocking) return;

                if (event.keyCode === 123) {
                    event.preventDefault();
                    console.warn('开发者模式已被禁用');
                }

                if (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J')) {
                    event.preventDefault();
                    console.warn('开发者模式已被禁用');
                }
            };

            this._onContextMenu = (event) => {
                if (!this.isBlocking) return;
                event.preventDefault();
            };

            window.addEventListener('keydown', this._onKeyDown);
            document.addEventListener('contextmenu', this._onContextMenu);
        }

        getInfo() {
            return {
                id: 'Webpagescreensealing',
                name: '高级封屏',
                color1: '#FFFFFF',
                color2: '#000000',
                blocks: [
                    {
                        blockType: BlockType.LABEL,
                        text: '❗注意❗: 网页封屏针对外挂，'
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: '作品封号等需要强行停止的工作可以运行。'
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: '封屏后对你的设备不会产生影响。'
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: '封屏后按F12没用。。。'
                    },
                    {
                        opcode: 'Startwebpagescreenclosure',
                        blockType: BlockType.COMMAND,
                        text: '启动封屏'
                    }
                ]
            };
        }

        b() {
            if (this.isSealed) {
                location.replace('about:blank');
            }
        }

        Startwebpagescreenclosure() {
            if (this.isSealed) return;
            
            this.isSealed = true;
            this.isBlocking = true;

            if (this.alertDiv) this.alertDiv.remove();
            this.alertDiv = document.createElement('div');
            Object.assign(this.alertDiv.style, {
                position: 'fixed',
                top: '0', left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '5vw',
                fontWeight: 'bold',
                zIndex: '99999',
                textAlign: 'center',
                userSelect: 'none',
                pointerEvents: 'none' 
            });
            this.alertDiv.textContent = '你已被封屏';
            document.body.appendChild(this.alertDiv);

            this._suppressNativeDialogs();

            window.addEventListener('keydown', this.b, true);
            document.addEventListener('mousedown', this.b, true);
            
            this._enableProtections();
        }

        _suppressNativeDialogs() {
            window.alert = function() {};
            window.confirm = function() { return false; };
            window.prompt = function() { return null; };
        }

        _enableProtections() {
            console.clear = () => { };
            console.log = () => { };
            console.warn = () => { };
            document.write = () => { };

            this._debuggerTimer = setInterval(() => {
                if (this.isSealed) {
                    debugger; 
                }
            }, 50);

            this._detectTimer = setInterval(() => {
                if (!this.isSealed) return;
                const widthDiff = window.outerWidth - window.innerWidth > 160;
                const heightDiff = window.outerHeight - window.innerHeight > 160;
                if (widthDiff || heightDiff) {
                    location.replace('about:blank');
                }
            }, 1000);
        }
    }

    extensions.register(new WebpageScreenSealingExtension(runtime));

}(Scratch));