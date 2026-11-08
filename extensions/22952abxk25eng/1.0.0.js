(function (_Scratch) {
    const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = _Scratch;

    translate.setup({
        zh: {
            'extensionName': '弹窗插件',
            'alertBlock': '弹出消息框 [MESSAGE]',
            'confirmBlock': '弹出确认框 [MESSAGE]',
            'promptBlock': '弹出输入框 [MESSAGE] 默认值 [DEFAULT]',
            'dialogResult': '弹窗结果',
            'alert.message_default': '你好，世界！',
            'confirm.message_default': '你确定要继续吗？',
            'prompt.message_default': '请输入内容：',
            'prompt.default_default': '默认值'
        },
        en: {
            'extensionName': 'Dialog Extension',
            'alertBlock': 'alert [MESSAGE]',
            'confirmBlock': 'confirm [MESSAGE]',
            'promptBlock': 'prompt [MESSAGE] default [DEFAULT]',
            'dialogResult': 'dialog result',
            'alert.message_default': 'Hello, World!',
            'confirm.message_default': 'Are you sure?',
            'prompt.message_default': 'Please enter:',
            'prompt.default_default': 'default'
        }
    });

    class DialogExtension {
        constructor (_runtime) {
            this._runtime = _runtime;
            this._lastResult = '';
            this._lastConfirm = false;
        }

        getInfo () {
            return {
                id: 'dialogExtension',
                name: translate({id: 'extensionName'}),
                color1: '#4A90E2',
                color2: '#357ABD',
                blocks: [
                    {
                        opcode: 'showAlert',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'alertBlock'}),
                        arguments: {
                            MESSAGE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'alert.message_default'})
                            }
                        }
                    },
                    {
                        opcode: 'showConfirm',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'confirmBlock'}),
                        arguments: {
                            MESSAGE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'confirm.message_default'})
                            }
                        }
                    },
                    {
                        opcode: 'showPrompt',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'promptBlock'}),
                        arguments: {
                            MESSAGE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'prompt.message_default'})
                            },
                            DEFAULT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'prompt.default_default'})
                            }
                        }
                    },
                    {
                        opcode: 'getDialogResult',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'dialogResult'}),
                        disableMonitor: true
                    },
                    {
                        opcode: 'getConfirmResult',
                        blockType: BlockType.BOOLEAN,
                        text: '确认框结果',
                        disableMonitor: true
                    }
                ],
                menus: {}
            };
        }

        showAlert (args) {
            const message = Cast.toString(args.MESSAGE);
            this._lastResult = '';
            
            // 使用TurboWarp的弹窗系统
            if (typeof window !== 'undefined' && window.alert) {
                window.alert(message);
            } else {
                // 备用方案：使用runtime的弹窗
                this._runtime.emit('ALERT', {message: message});
            }
        }

        showConfirm (args) {
            const message = Cast.toString(args.MESSAGE);
            
            if (typeof window !== 'undefined' && window.confirm) {
                this._lastConfirm = window.confirm(message);
            } else {
                // 备用方案
                this._runtime.emit('CONFIRM', {
                    message: message,
                    callback: (result) => {
                        this._lastConfirm = result;
                    }
                });
            }
        }

        showPrompt (args) {
            const message = Cast.toString(args.MESSAGE);
            const defaultValue = Cast.toString(args.DEFAULT);
            
            if (typeof window !== 'undefined' && window.prompt) {
                const result = window.prompt(message, defaultValue);
                this._lastResult = result !== null ? result : '';
            } else {
                // 备用方案
                this._runtime.emit('PROMPT', {
                    message: message,
                    defaultValue: defaultValue,
                    callback: (result) => {
                        this._lastResult = result || '';
                    }
                });
            }
        }

        getDialogResult () {
            return this._lastResult;
        }

        getConfirmResult () {
            return this._lastConfirm;
        }
    }

    // TurboWarp兼容性检查
    if (typeof Scratch !== 'undefined' && Scratch.extensions) {
        extensions.register(new DialogExtension(runtime));
    } else {
        // 对于TurboWarp环境
        (function() {
            const extension = new DialogExtension({
                emit: function(event, data) {
                    // 简化的事件发射器
                    console.log('Dialog Extension Event:', event, data);
                }
            });
            
            // 注册到全局
            if (typeof window !== 'undefined') {
                window.DialogExtension = extension;
            }
        })();
    }

}(typeof Scratch !== 'undefined' ? Scratch : window));
