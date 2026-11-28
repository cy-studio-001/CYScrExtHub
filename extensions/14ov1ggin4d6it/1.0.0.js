(function (_Scratch) {
    const {ArgumentType, BlockType, Cast, translate, extensions, runtime} = _Scratch;

    // 设置多语言翻译
    translate.setup({
        zh: {
            'extensionName': '📁 文件存储',
            'categoryFile': '文件操作',
            'categoryStorage': '数据存储',
            
            // 文件操作
            'fileRead': '读取文件 [FILENAME]',
            'fileWrite': '写入文件 [FILENAME] 内容 [CONTENT]',
            'fileAppend': '追加文件内容 [FILENAME] 内容 [CONTENT]',
            'fileExists': '文件 [FILENAME] 是否存在？',
            'fileDelete': '删除文件 [FILENAME]',
            'fileList': '列出所有文件',
            
            // 数据存储
            'storageLoad': '加载存储数据 [KEY]',
            'storageSave': '保存存储数据 [KEY] 值 [VALUE]',
            'storageRemove': '删除存储数据 [KEY]',
            'storageClear': '清空所有存储数据',
            'storageKeys': '获取所有存储键名',
            'storageSize': '获取存储大小',
            
            // 默认值
            'default_filename': 'data.txt',
            'default_content': 'Hello World!',
            'default_key': 'my_data'
        },
        en: {
            'extensionName': '📁 File Storage',
            'categoryFile': 'File Operations',
            'categoryStorage': 'Data Storage',
            
            'fileRead': 'Read file [FILENAME]',
            'fileWrite': 'Write file [FILENAME] content [CONTENT]',
            'fileAppend': 'Append to file [FILENAME] content [CONTENT]',
            'fileExists': 'Does file [FILENAME] exist?',
            'fileDelete': 'Delete file [FILENAME]',
            'fileList': 'List all files',
            
            'storageLoad': 'Load storage data [KEY]',
            'storageSave': 'Save storage data [KEY] value [VALUE]',
            'storageRemove': 'Remove storage data [KEY]',
            'storageClear': 'Clear all storage data',
            'storageKeys': 'Get all storage keys',
            'storageSize': 'Get storage size'
        }
    });

    class FileStorage {
        constructor (_runtime) {
            this._runtime = _runtime;
            this._files = {};
            this._storage = {};
            this._initStorage();
        }

        // 初始化存储
        _initStorage() {
            try {
                // 从 localStorage 加载文件
                const savedFiles = localStorage.getItem('file_storage_files');
                if (savedFiles) {
                    this._files = JSON.parse(savedFiles);
                }
                
                // 从 localStorage 加载数据存储
                const savedStorage = localStorage.getItem('file_storage_data');
                if (savedStorage) {
                    this._storage = JSON.parse(savedStorage);
                }
            } catch (e) {
                console.warn('[文件存储] 存储加载失败:', e);
            }
        }

        // 保存文件到 localStorage
        _saveFiles() {
            try {
                localStorage.setItem('file_storage_files', JSON.stringify(this._files));
            } catch (e) {
                console.warn('[文件存储] 文件保存失败:', e);
            }
        }

        // 保存数据存储到 localStorage
        _saveStorage() {
            try {
                localStorage.setItem('file_storage_data', JSON.stringify(this._storage));
            } catch (e) {
                console.warn('[文件存储] 数据存储保存失败:', e);
            }
        }

        // 获取扩展信息
        getInfo() {
            return {
                id: 'fileStorage',
                name: translate({id: 'extensionName'}),
                color1: '#2196F3',
                color2: '#1976D2',
                blocks: [
                    // 分隔符：文件操作
                    {
                        opcode: 'separator_files',
                        blockType: BlockType.LABEL,
                        text: translate({id: 'categoryFile'})
                    },
                    
                    // 文件操作块
                    {
                        opcode: 'fileRead',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'fileRead'}),
                        arguments: {
                            FILENAME: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'default_filename'})
                            }
                        }
                    },
                    {
                        opcode: 'fileWrite',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'fileWrite'}),
                        arguments: {
                            FILENAME: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'default_filename'})
                            },
                            CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'default_content'})
                            }
                        }
                    },
                    {
                        opcode: 'fileAppend',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'fileAppend'}),
                        arguments: {
                            FILENAME: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'default_filename'})
                            },
                            CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: '追加内容'
                            }
                        }
                    },
                    {
                        opcode: 'fileExists',
                        blockType: BlockType.BOOLEAN,
                        text: translate({id: 'fileExists'}),
                        arguments: {
                            FILENAME: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'default_filename'})
                            }
                        }
                    },
                    {
                        opcode: 'fileDelete',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'fileDelete'}),
                        arguments: {
                            FILENAME: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'default_filename'})
                            }
                        }
                    },
                    {
                        opcode: 'fileList',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'fileList'})
                    },

                    // 分隔符：数据存储
                    {
                        opcode: 'separator_storage',
                        blockType: BlockType.LABEL,
                        text: translate({id: 'categoryStorage'})
                    },
                    
                    // 数据存储块
                    {
                        opcode: 'storageLoad',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'storageLoad'}),
                        arguments: {
                            KEY: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'default_key'})
                            }
                        }
                    },
                    {
                        opcode: 'storageSave',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'storageSave'}),
                        arguments: {
                            KEY: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'default_key'})
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: 'value'
                            }
                        }
                    },
                    {
                        opcode: 'storageRemove',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'storageRemove'}),
                        arguments: {
                            KEY: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'default_key'})
                            }
                        }
                    },
                    {
                        opcode: 'storageClear',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'storageClear'})
                    },
                    {
                        opcode: 'storageKeys',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'storageKeys'})
                    },
                    {
                        opcode: 'storageSize',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'storageSize'})
                    }
                ]
            };
        }

        // ==================== 文件操作函数 ====================

        fileRead(args) {
            const filename = Cast.toString(args.FILENAME);
            return this._files[filename] || '';
        }

        fileWrite(args) {
            const filename = Cast.toString(args.FILENAME);
            const content = Cast.toString(args.CONTENT);
            this._files[filename] = content;
            this._saveFiles();
            return '';
        }

        fileAppend(args) {
            const filename = Cast.toString(args.FILENAME);
            const content = Cast.toString(args.CONTENT);
            
            if (!this._files[filename]) {
                this._files[filename] = '';
            }
            this._files[filename] += content + '\n';
            this._saveFiles();
            return '';
        }

        fileExists(args) {
            const filename = Cast.toString(args.FILENAME);
            return this._files.hasOwnProperty(filename);
        }

        fileDelete(args) {
            const filename = Cast.toString(args.FILENAME);
            if (this._files[filename]) {
                delete this._files[filename];
                this._saveFiles();
            }
            return '';
        }

        fileList() {
            const files = Object.keys(this._files);
            return files.length > 0 ? files.join(', ') : '暂无文件';
        }

        // ==================== 数据存储函数 ====================

        storageLoad(args) {
            const key = Cast.toString(args.KEY);
            return this._storage[key] || '';
        }

        storageSave(args) {
            const key = Cast.toString(args.KEY);
            const value = Cast.toString(args.VALUE);
            this._storage[key] = value;
            this._saveStorage();
            return '';
        }

        storageRemove(args) {
            const key = Cast.toString(args.KEY);
            if (this._storage.hasOwnProperty(key)) {
                delete this._storage[key];
                this._saveStorage();
            }
            return '';
        }

        storageClear() {
            this._storage = {};
            this._saveStorage();
            return '';
        }

        storageKeys() {
            const keys = Object.keys(this._storage);
            return keys.length > 0 ? keys.join(', ') : '无存储数据';
        }

        storageSize() {
            const json = JSON.stringify(this._storage);
            const size = new Blob([json]).size;
            return `${size} 字节`;
        }
    }

    extensions.register(new FileStorage(runtime));

}(Scratch));