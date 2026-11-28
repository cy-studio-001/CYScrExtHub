// TextDB.online TurboWarp扩展
class TextDBExtension {
    getInfo() {
        return {
            id: 'textdb',
            name: 'TextDB 数据库',
            color1: '#4CAF50',
            color2: '#388E3C',
            color3: '#2E7D32',
            blocks: [
                {
                    opcode: 'storeData',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '存储数据 密钥:[KEY] 内容:[VALUE]',
                    arguments: {
                        KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'test123456'
                        },
                        VALUE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '你好，世界！'
                        }
                    }
                },
                {
                    opcode: 'getData',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '读取数据 密钥:[KEY]',
                    arguments: {
                        KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'test123456'
                        }
                    }
                },
                {
                    opcode: 'deleteData',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '删除数据 密钥:[KEY]',
                    arguments: {
                        KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'test123456'
                        }
                    }
                },
                {
                    opcode: 'generateKey',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '生成随机密钥 [LENGTH] 位',
                    arguments: {
                        LENGTH: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    }
                },
                {
                    opcode: 'getDataURL',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取数据URL 密钥:[KEY]',
                    arguments: {
                        KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'test123456'
                        }
                    }
                },
                {
                    opcode: 'checkKeyValid',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '密钥 [KEY] 是否有效？',
                    arguments: {
                        KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'my-test-key_123'
                        }
                    }
                },
                {
                    opcode: 'storeDataWithResult',
                    blockType: Scratch.BlockType.REPORTER,
                    isAsync: true,
                    text: '存储数据 密钥:[KEY] 内容:[VALUE] 并等待结果',
                    arguments: {
                        KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'test123456'
                        },
                        VALUE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '你好，世界！'
                        }
                    }
                },
                {
                    opcode: 'getDataAsync',
                    blockType: Scratch.BlockType.REPORTER,
                    isAsync: true,
                    text: '异步读取数据 密钥:[KEY]',
                    arguments: {
                        KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'test123456'
                        }
                    }
                },
                '---',
                {
                    opcode: 'encodeForURL',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'URL编码 [TEXT]',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'hello world!'
                        }
                    }
                },
                {
                    opcode: 'decodeFromURL',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'URL解码 [TEXT]',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'hello%20world%21'
                        }
                    }
                },
                {
                    opcode: 'getLastResult',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取最后操作结果'
                },
                {
                    opcode: 'getLastError',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取最后错误信息'
                }
            ],
            menus: {}
        };
    }

    constructor() {
        this.lastResult = '';
        this.lastError = '';
        this.lastResponse = null;
    }

    checkKeyValid(args) {
        const key = args.KEY.toString().trim();
        if (key.length < 6 || key.length > 60) {
            this.lastError = '密钥长度必须在6-60位之间';
            return false;
        }
        const validPattern = /^[0-9a-zA-Z\-_]+$/;
        const isValid = validPattern.test(key);
        if (!isValid) {
            this.lastError = '密钥只能包含字母、数字、- 和 _';
        }
        return isValid;
    }

    generateKey(args) {
        const length = Math.max(6, Math.min(60, Number(args.LENGTH) || 20));
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }

    storeData(args) {
        const key = args.KEY.toString().trim();
        const value = args.VALUE.toString();
        
        if (!this.checkKeyValid({ KEY: key })) {
            console.error('TextDB: ' + this.lastError);
            return;
        }
        
        if (!key) {
            this.lastError = '密钥不能为空';
            console.error('TextDB: ' + this.lastError);
            return;
        }
        
        if (value.length > 200000) {
            this.lastError = '文本数据超过20万字符限制';
            console.error('TextDB: ' + this.lastError);
            return;
        }
        
        const encodedValue = encodeURIComponent(value);
        const url = `https://textdb.online/update/?key=${key}&value=${encodedValue}`;
        
        fetch(url, {
            method: 'GET',
            mode: 'cors'
        })
        .then(response => response.json())
        .then(result => {
            this.lastResponse = result;
            if (result.status === 1) {
                this.lastResult = `数据存储成功！URL: ${result.data.url}`;
                this.lastError = '';
                console.log('TextDB: ' + this.lastResult);
            } else {
                this.lastError = result.error || '数据存储失败';
                this.lastResult = '失败: ' + this.lastError;
                console.error('TextDB: ' + this.lastError);
            }
        })
        .catch(error => {
            this.lastError = '网络请求失败: ' + error.message;
            this.lastResult = '失败: ' + this.lastError;
            console.error('TextDB: ' + this.lastError);
        });
    }

    async storeDataWithResult(args) {
        const key = args.KEY.toString().trim();
        const value = args.VALUE.toString();
        
        if (!this.checkKeyValid({ KEY: key })) {
            this.lastError = '密钥格式错误: ' + this.lastError;
            return '错误: ' + this.lastError;
        }
        
        if (!key) {
            this.lastError = '密钥不能为空';
            return '错误: ' + this.lastError;
        }
        

        if (value.length > 200000) {
            this.lastError = '文本数据超过20万字符限制';
            return '错误: ' + this.lastError;
        }
        
        try {

            const encodedValue = encodeURIComponent(value);
            const url = `https://textdb.online/update/?key=${key}&value=${encodedValue}`;
            
            console.log('TextDB: 请求URL:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            this.lastResponse = result;
            
            if (result.status === 1) {
                this.lastResult = `成功！数据URL: ${result.data.url}`;
                this.lastError = '';
                return this.lastResult;
            } else {
                this.lastError = result.error || `存储失败，状态: ${result.status}`;
                this.lastResult = '失败: ' + this.lastError;
                return '错误: ' + this.lastError;
            }
        } catch (error) {
            this.lastError = '网络错误: ' + error.message;
            this.lastResult = '失败: ' + this.lastError;
            return '错误: ' + this.lastError;
        }
    }

    getData(args) {
        const key = args.KEY.toString().trim();
        
        if (!key) {
            this.lastError = '密钥不能为空';
            return '';
        }
        
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `https://textdb.online/${key}`, false);
            xhr.send();
            
            if (xhr.status === 200) {
                this.lastError = '';
                this.lastResult = '读取成功';
                return xhr.responseText || '';
            } else if (xhr.status === 404) {
                this.lastError = '数据不存在';
                this.lastResult = '数据不存在';
                return '';
            } else {
                this.lastError = `读取失败，状态码: ${xhr.status}`;
                this.lastResult = '读取失败';
                return '';
            }
        } catch (error) {
            this.lastError = '读取错误: ' + error.message;
            this.lastResult = '读取失败';
            return '';
        }
    }

    async getDataAsync(args) {
        const key = args.KEY.toString().trim();
        
        if (!key) {
            this.lastError = '密钥不能为空';
            return '错误: 密钥不能为空';
        }
        
        try {
            const response = await fetch(`https://textdb.online/${key}`);
            if (response.ok) {
                const text = await response.text();
                this.lastError = '';
                this.lastResult = '读取成功';
                return text || '';
            } else if (response.status === 404) {
                this.lastError = '数据不存在';
                this.lastResult = '数据不存在';
                return '';
            } else {
                this.lastError = `读取失败，状态码: ${response.status}`;
                this.lastResult = '读取失败';
                return '';
            }
        } catch (error) {
            this.lastError = '网络错误: ' + error.message;
            this.lastResult = '读取失败';
            return '';
        }
    }

    deleteData(args) {
        const key = args.KEY.toString().trim();
        
        if (!this.checkKeyValid({ KEY: key })) {
            console.error('TextDB: ' + this.lastError);
            return;
        }
        
        if (!key) {
            this.lastError = '密钥不能为空';
            console.error('TextDB: ' + this.lastError);
            return;
        }
        
        const url = `https://textdb.online/update/?key=${key}&value=`;
        
        fetch(url, {
            method: 'GET',
            mode: 'cors'
        })
        .then(response => response.json())
        .then(result => {
            this.lastResponse = result;
            if (result.status === 1) {
                this.lastResult = '数据删除成功';
                this.lastError = '';
                console.log('TextDB: ' + this.lastResult);
            } else {
                this.lastError = result.error || '数据删除失败';
                this.lastResult = '失败: ' + this.lastError;
                console.error('TextDB: ' + this.lastError);
            }
        })
        .catch(error => {
            this.lastError = '删除错误: ' + error.message;
            this.lastResult = '失败: ' + this.lastError;
            console.error('TextDB: ' + this.lastError);
        });
    }

    getDataURL(args) {
        const key = args.KEY.toString().trim();
        if (!key) {
            return '错误: 密钥不能为空';
        }
        return `https://textdb.online/${key}`;
    }

    encodeForURL(args) {
        const text = args.TEXT.toString();
        return encodeURIComponent(text);
    }

    decodeFromURL(args) {
        const text = args.TEXT.toString();
        try {
            return decodeURIComponent(text);
        } catch (e) {
            return text;
        }
    }

    getLastResult() {
        return this.lastResult || '无操作记录';
    }

    getLastError() {
        return this.lastError || '无错误';
    }
}

if (typeof Scratch !== 'undefined' && Scratch.extensions) {
    Scratch.extensions.register(new TextDBExtension());
}