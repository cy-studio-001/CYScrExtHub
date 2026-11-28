

(function (_Scratch) {
    const { ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime } = _Scratch;

    class MyExtension {
        constructor(_runtime) {
            this._runtime = _runtime;
        }
        getInfo() {
            return {
                id: 'digSig',
                name: '数字签名',
                blocks: [
                    {
                        opcode: 'generateKeyPair',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '生成密钥对',
                        arguments: {}
                    },
                    {
                        opcode: 'getPrivateKey',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '私钥',
                        arguments: {}
                    },
                    {
                        opcode: 'getPublicKey',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '公钥',
                        arguments: {}
                    },
                    {
                        opcode: 'signMessage',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '签名 [MESSAGE] 使用私钥 [KEY]',
                        arguments: {
                            MESSAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Hello!'
                            },
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'verifySignature',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '验证签名 [SIGNATURE] 消息 [MESSAGE] 使用公钥 [KEY]',
                        arguments: {
                            SIGNATURE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            },
                            MESSAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            },
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    }
                ],
                menus: {}
            };
        }
        // ---------- 内部工具函数 ----------
        async _importPrivateKey(base64Key) {
            const binary = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
            return await crypto.subtle.importKey(
                'pkcs8',
                binary,
                { name: 'ECDSA', namedCurve: 'P-256' },
                false,
                ['sign']
            );
        }
        async _importPublicKey(base64Key) {
            const binary = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
            return await crypto.subtle.importKey(
                'spki',
                binary,
                { name: 'ECDSA', namedCurve: 'P-256' },
                false,
                ['verify']
            );
        }
        async _exportKey(key, format) {
            const exported = await crypto.subtle.exportKey(format, key);
            return btoa(String.fromCharCode(...new Uint8Array(exported)));
        }
        // ---------- 积木实现 ----------
        async generateKeyPair() {
            const pair = await crypto.subtle.generateKey(
                { name: 'ECDSA', namedCurve: 'P-256' },
                true, // 需要导出，必须设置为可提取
                ['sign', 'verify']
            );
            this.keyPair = pair;
        }
        async getPrivateKey() {
            if (!this.keyPair) return '';
            return await this._exportKey(this.keyPair.privateKey, 'pkcs8');
        }
        async getPublicKey() {
            if (!this.keyPair) return '';
            return await this._exportKey(this.keyPair.publicKey, 'spki');
        }
        async signMessage(args) {
            const message = args.MESSAGE;
            const base64Key = args.KEY;
            if (!base64Key) return '';
            try {
                const privateKey = await this._importPrivateKey(base64Key);
                const encoder = new TextEncoder();
                const signature = await crypto.subtle.sign(
                    { name: 'ECDSA', hash: 'SHA-256' },
                    privateKey,
                    encoder.encode(message)
                );
                return btoa(String.fromCharCode(...new Uint8Array(signature)));
            } catch (e) {
                console.error('签名失败：', e);
                return '';
            }
        }
        async verifySignature(args) {
            const signatureBase64 = args.SIGNATURE;
            const message = args.MESSAGE;
            const base64Key = args.KEY;
            if (!signatureBase64 || !base64Key) return false;
            try {
                const publicKey = await this._importPublicKey(base64Key);
                const signatureBytes = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
                const encoder = new TextEncoder();
                return await crypto.subtle.verify(
                    { name: 'ECDSA', hash: 'SHA-256' },
                    publicKey,
                    signatureBytes,
                    encoder.encode(message)
                );
            } catch (e) {
                console.error('验证失败：', e);
                return false;
            }
        }
    }

    extensions.register(new MyExtension(runtime));

}(Scratch));

