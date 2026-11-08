// TemporaryListExtension.js
// CYSOEditor 临时列表插件 - 全局共享列表管理
// 版本: Alpha 1.0

class TemporaryListExtension {
    constructor() {
        // 存储所有临时列表
        // 格式: { "列表名1": [项目1, 项目2, ...], "列表名2": [项目1, 项目2, ...] }
        this.lists = {};
        
        this.isDesktop = typeof EditorPreload !== 'undefined';
        this.version = 'a1.0';
    }

    getInfo() {
        return {
            id: 'temporaryList',
            name: `📋 临时列表 v${this.version}`,
            color1: '#3B82F6',
            color2: '#2563EB',
            color3: '#1D4ED8',

            blocks: [
                // ====== 创建列表 ======
                {
                    opcode: 'createList',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '创建临时列表 [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的列表'
                        }
                    }
                },

                // ====== 增加元素 ======
                {
                    opcode: 'addToList',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '增加 [ITEM] 到临时列表 [NAME]',
                    arguments: {
                        ITEM: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '新项目'
                        },
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的列表'
                        }
                    }
                },

                // ====== 删除元素 ======
                {
                    opcode: 'removeFromList',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '从临时列表 [NAME] 删除第 [INDEX] 项',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的列表'
                        },
                        INDEX: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },

                // ====== 删除整个列表 ======
                {
                    opcode: 'deleteList',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '删除临时列表 [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的列表'
                        }
                    }
                },

                // ====== 获取项目数（数值积木） ======
                {
                    opcode: 'getListLength',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '临时列表 [NAME] 的项目数',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的列表'
                        }
                    }
                },

                // ====== 获取指定项（数值积木） ======
                {
                    opcode: 'getListItem',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '临时列表 [NAME] 的第 [INDEX] 项',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的列表'
                        },
                        INDEX: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },

                // ====== 清空列表（清空项目，保留列表） ======
                {
                    opcode: 'clearList',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '清空临时列表 [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的列表'
                        }
                    }
                },

                // ====== 查看所有列表（报告器） ======
                {
                    opcode: 'getAllLists',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '所有临时列表名称'
                }
            ]
        };
    }

    // ============================================================
    // 内部辅助方法
    // ============================================================

    // 检查列表是否存在
    listExists(name) {
        return this.lists.hasOwnProperty(name);
    }

    // 获取列表，不存在则返回null
    getList(name) {
        return this.lists[name] || null;
    }

    // 创建列表（如果不存在）
    createListIfNotExist(name) {
        if (!this.listExists(name)) {
            this.lists[name] = [];
            console.log(`✅ 已创建临时列表: "${name}"`);
            return true;
        }
        return false;
    }

    // ============================================================
    // 积木实现方法
    // ============================================================

    // ----- 创建临时列表 -----
    createList(args) {
        const name = args.NAME || '我的列表';
        
        if (this.listExists(name)) {
            // 如果已存在，清空内容
            this.lists[name] = [];
            console.log(`🔄 已重置临时列表: "${name}"`);
        } else {
            this.lists[name] = [];
            console.log(`✅ 已创建临时列表: "${name}"`);
        }
    }

    // ----- 增加项目到临时列表 -----
    addToList(args) {
        const item = args.ITEM || '';
        const name = args.NAME || '我的列表';
        
        // 如果列表不存在，自动创建
        this.createListIfNotExist(name);
        
        this.lists[name].push(item);
        console.log(`✅ 已增加 "${item}" 到临时列表 "${name}" (当前 ${this.lists[name].length} 项)`);
    }

    // ----- 从临时列表删除指定项 -----
    removeFromList(args) {
        const name = args.NAME || '我的列表';
        const index = Number(args.INDEX) || 1;
        
        if (!this.listExists(name)) {
            console.warn(`⚠️ 临时列表 "${name}" 不存在`);
            return;
        }
        
        const list = this.lists[name];
        const idx = index - 1;
        
        if (idx < 0 || idx >= list.length) {
            console.warn(`⚠️ 索引 ${index} 超出范围 (列表长度 ${list.length})`);
            return;
        }
        
        const removed = list.splice(idx, 1);
        console.log(`🗑️ 已从临时列表 "${name}" 删除第 ${index} 项: "${removed[0]}" (剩余 ${list.length} 项)`);
    }

    // ----- 删除整个临时列表 -----
    deleteList(args) {
        const name = args.NAME || '我的列表';
        
        if (!this.listExists(name)) {
            console.warn(`⚠️ 临时列表 "${name}" 不存在，无法删除`);
            return;
        }
        
        delete this.lists[name];
        console.log(`🗑️ 已删除临时列表: "${name}"`);
    }

    // ----- 获取临时列表项目数 -----
    getListLength(args) {
        const name = args.NAME || '我的列表';
        
        if (!this.listExists(name)) {
            console.warn(`⚠️ 临时列表 "${name}" 不存在`);
            return 0;
        }
        
        return this.lists[name].length;
    }

    // ----- 获取临时列表的第 N 项 -----
    getListItem(args) {
        const name = args.NAME || '我的列表';
        const index = Number(args.INDEX) || 1;
        
        if (!this.listExists(name)) {
            console.warn(`⚠️ 临时列表 "${name}" 不存在`);
            return '';
        }
        
        const list = this.lists[name];
        const idx = index - 1;
        
        if (idx < 0 || idx >= list.length) {
            console.warn(`⚠️ 索引 ${index} 超出范围 (列表长度 ${list.length})`);
            return '';
        }
        
        return String(list[idx]);
    }

    // ----- 清空临时列表（保留列表） -----
    clearList(args) {
        const name = args.NAME || '我的列表';
        
        if (!this.listExists(name)) {
            console.warn(`⚠️ 临时列表 "${name}" 不存在`);
            return;
        }
        
        this.lists[name] = [];
        console.log(`🗑️ 已清空临时列表: "${name}" (列表已保留)`);
    }

    // ----- 获取所有临时列表名称 -----
    getAllLists(args) {
        const listNames = Object.keys(this.lists);
        
        if (listNames.length === 0) {
            return '（暂无临时列表）';
        }
        
        // 返回格式: "列表1, 列表2, 列表3"
        return listNames.join(', ');
    }
}

// 注册扩展
if (typeof Scratch !== 'undefined') {
    Scratch.extensions.register(new TemporaryListExtension());
    console.log('✅ 临时列表扩展 v1.0-alpha 已加载！');
    console.log('📌 所有列表全局共享');
    console.log('🗑️ 支持: 删除项目、删除列表、清空列表');
    console.log('📋 使用 "所有临时列表名称" 查看已创建的列表');
}