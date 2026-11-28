(function (_Scratch) {
    const { ArgumentType, BlockType, translate, extensions } = _Scratch;

    translate.setup({
        zh: {
            extensionName: '弹窗系统',
            normalDialog: '弹出普通对话框 文字[TEXT] 颜色[COLOR] 打字速度[SPEED]ms',
            optionDialog: '弹出选项对话框 文字[TEXT] 颜色[COLOR] 选项(/e分割)[OPTIONS] 打字速度[SPEED]ms',
            inputDialog: '弹出输入对话框 文字[TEXT] 颜色[COLOR] 打字速度[SPEED]ms'
        }
    });

    class DialogExtension {
        constructor() {
            this._lock = false;
            this._injectStyle();
        }

        getInfo() {
            return {
                id: '0001s',
                name: translate({ id: 'extensionName' }),
                color1: '#4C97FF',
                color2: '#3373CC',
                blocks: [
                    {
                        opcode: 'showNormalDialog',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'normalDialog' }),
                        arguments: {
                            TEXT: { type: ArgumentType.STRING, defaultValue: '你好' },
                            COLOR: { type: ArgumentType.STRING, defaultValue: '#fff' },
                            SPEED: { type: ArgumentType.NUMBER, defaultValue: 40 }
                        }
                    },
                    {
                        opcode: 'showOptionDialog',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'optionDialog' }),
                        arguments: {
                            TEXT: { type: ArgumentType.STRING, defaultValue: '请选择' },
                            COLOR: { type: ArgumentType.STRING, defaultValue: '#fff' },
                            OPTIONS: { type: ArgumentType.STRING, defaultValue: 'A/eB/eC' },
                            SPEED: { type: ArgumentType.NUMBER, defaultValue: 40 }
                        }
                    },
                    {
                        opcode: 'showInputDialog',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'inputDialog' }),
                        arguments: {
                            TEXT: { type: ArgumentType.STRING, defaultValue: '请输入' },
                            COLOR: { type: ArgumentType.STRING, defaultValue: '#fff' },
                            SPEED: { type: ArgumentType.NUMBER, defaultValue: 40 }
                        }
                    }
                ]
            };
        }

        async showNormalDialog(args) {
            const ui = this._createUI(args.COLOR);
            document.body.appendChild(ui.overlay);

            await this._open(ui);
            await this._type(ui.text, args.TEXT, args.SPEED);

            return await new Promise(r => {
                ui.overlay.onclick = () => {
                    this._close(ui);
                    r('');
                };
            });
        }

        showOptionDialog(args) {
            return new Promise(async resolve => {
                this._lock = true;

                const ui = this._createUI(args.COLOR);
                document.body.appendChild(ui.overlay);

                await this._open(ui);
                await this._type(ui.text, args.TEXT, args.SPEED);

                const options = args.OPTIONS.split('/e');

                const box = document.createElement('div');
                box.style.cssText = `
                    margin-top:12px;
                    display:flex;
                    flex-direction:column;
                    gap:8px;
                `;

                options.forEach((o, i) => {
                    const b = document.createElement('button');
                    b.textContent = o;

                    b.style.cssText = `
                        padding:6px 10px;
                        background:#444;
                        color:#fff;
                        border:none;
                        border-radius:6px;
                        cursor:pointer;
                        opacity:0;
                        transform:translateX(-20px);
                        transition:.25s;
                    `;

                    b.onclick = e => {
                        e.stopPropagation();
                        this._lock = false;
                        this._close(ui);
                        resolve(o);
                    };

                    box.appendChild(b);

                    setTimeout(() => {
                        b.style.opacity = 1;
                        b.style.transform = 'translateX(0)';
                    }, i * 80);
                });

                ui.box.appendChild(box);

                ui.overlay.onclick = () => {
                    if (this._lock) return;
                };
            });
        }

        showInputDialog(args) {
            return new Promise(async resolve => {
                this._lock = true;

                const ui = this._createUI(args.COLOR);
                document.body.appendChild(ui.overlay);

                await this._open(ui);
                await this._type(ui.text, args.TEXT, args.SPEED);

                const box = document.createElement('div');
                box.style.marginTop = '12px';

                const input = document.createElement('input');
                input.style.cssText = `
                    width:100%;
                    padding:6px;
                    border:none;
                    border-radius:6px;
                    outline:none;
                `;

                const btn = document.createElement('button');
                btn.textContent = '确定';
                btn.style.cssText = `
                    margin-top:8px;
                    width:100%;
                    padding:6px;
                    background:#444;
                    color:#fff;
                    border:none;
                    border-radius:6px;
                `;

                box.appendChild(input);
                box.appendChild(btn);
                ui.box.appendChild(box);

                const finish = v => {
                    this._lock = false;
                    this._close(ui);
                    resolve(v);
                };

                btn.onclick = () => finish(input.value || '');
                input.onkeydown = e => {
                    if (e.key === 'Enter') finish(input.value || '');
                };

                ui.overlay.onclick = () => {
                    if (this._lock) return;
                };
            });
        }

        _createUI(color) {
            const overlay = document.createElement('div');
            overlay.className = 'dlg_overlay';

            const box = document.createElement('div');
            box.className = 'dlg_box';
            box.style.color = color;

            const text = document.createElement('div');

            box.appendChild(text);
            overlay.appendChild(box);

            return { overlay, box, text };
        }

        _open(ui) {
            return new Promise(r => {
                requestAnimationFrame(() => {
                    ui.overlay.classList.add('show');
                    ui.box.classList.add('show');
                    setTimeout(r, 200);
                });
            });
        }

        _type(el, text, speed) {
            return new Promise(r => {
                el.innerHTML = '';
                let i = 0;
                const t = setInterval(() => {
                    el.innerHTML = text.slice(0, ++i);
                    if (i >= text.length) {
                        clearInterval(t);
                        r();
                    }
                }, speed);
            });
        }

        _close(ui) {
            ui.overlay.classList.remove('show');
            ui.box.classList.remove('show');
            setTimeout(() => ui.overlay.remove(), 150);
        }

        _injectStyle() {
            if (document.getElementById('dlg_style')) return;

            const s = document.createElement('style');
            s.id = 'dlg_style';

            s.textContent = `
                .dlg_overlay{
                    position:fixed;
                    top:0;left:0;
                    width:100%;height:100%;
                    background:rgba(0,0,0,0.4);
                    display:flex;
                    align-items:center;
                    justify-content:flex-start;
                    padding-left:80px;
                    opacity:0;
                    transition:.2s;
                    z-index:999999;
                }

                .dlg_overlay.show{opacity:1;}

                .dlg_box{
                    background:#222;
                    padding:16px;
                    border-radius:12px;
                    min-width:260px;
                    max-width:420px;
                    transform:translateX(-30px);
                    opacity:0;
                    transition:.2s;
                    font-family:sans-serif;
                }

                .dlg_box.show{
                    transform:translateX(0);
                    opacity:1;
                }
            `;

            document.head.appendChild(s);
        }
    }

    extensions.register(new DialogExtension());
})(Scratch);