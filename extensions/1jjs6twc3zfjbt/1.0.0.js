// ============================================
// WebHook
// 作者: Maxkore
// ID: WebHook
// ============================================

const extId = 'WebHook';
const author = 'Maxkore';
const version = '2.0.0';

// ============================================
// 积木 1: 附带 ab 的 POST 请求
// ============================================

/**
 * 发送一个附带 ab 参数的 POST 请求
 * @param {string} url - 目标 URL
 * @param {object} data - 请求体数据 (JSON)
 */
function postWithAb(url, data) {
    if (!url) return;
    
    try {
        // 自动获取 ab 参数
        let abParam = '';
        
        // 从 cookie 获取
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'ab' || name === '_ab') {
                abParam = value;
                break;
            }
        }
        
        // 从 localStorage 获取
        if (!abParam) {
            abParam = localStorage.getItem('ab') || localStorage.getItem('_ab') || '';
        }
        
        // 生成临时 ab
        if (!abParam) {
            abParam = 'guest_' + Date.now().toString(36);
        }
        
        // 解析数据
        let parsedData;
        try {
            parsedData = JSON.parse(data);
        } catch {
            parsedData = data;
        }
        
        // 合并 ab
        const finalData = typeof parsedData === 'object' ? {
            ...parsedData,
            _ab: abParam
        } : parsedData;
        
        // 发送请求
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-AB-Param': abParam,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(finalData),
            credentials: 'include'
        })
        .then(res => {
            if (!res.ok) {
                console.warn(`POST 请求失败: ${res.status}`);
            }
            return res.json().catch(() => ({}));
        })
        .then(data => {
            console.log('POST 响应:', data);
        })
        .catch(err => {
            console.error('POST 请求错误:', err);
        });
        
    } catch (e) {
        console.error('构建 POST 请求时出错:', e);
    }
}

// ============================================
// 积木 2: new Function 动态执行代码
// ============================================

/**
 * 动态执行 JavaScript 代码 (使用 new Function)
 * @param {string} code - 要执行的代码字符串
 * @returns {any} 执行结果
 */
function executeCode(code) {
    if (!code) return null;
    
    try {
        const fn = new Function(code);
        return fn();
    } catch (e) {
        console.error('代码执行错误:', e);
        return null;
    }
}

/**
 * 安全执行代码（带确认对话框）
 * @param {string} code - 要执行的代码
 * @param {string} message - 确认信息
 */
function safeExecuteCode(code, message = '确认执行此代码？') {
    if (!code) return;
    if (confirm(message || '确认执行此代码？')) {
        return executeCode(code);
    }
    return null;
}

// ============================================
// 扩展积木定义
// ============================================

(function(Scratch) {
    'use strict';

    if (!Scratch) return;

    class WebHookExtension {
        getInfo() {
            return {
                id: extId,
                name: 'WebHook',
                color1: '#FF6B6B',
                color2: '#FF8E8E',
                blocks: [
                    // ===== 积木 1: 附带 ab 的 POST 请求 =====
                    {
                        opcode: 'postWithAb',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '发送 POST 请求到 [URL] 数据 [DATA]',
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://community.example.com/api'
                            },
                            DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"hashTagId":"33901"}'
                            }
                        }
                    },
                    
                    // ===== 积木 2: new Function 动态执行 =====
                    {
                        opcode: 'executeCode',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '执行代码 [CODE]',
                        arguments: {
                            CODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'console.log("Hello!")'
                            }
                        }
                    },
                    {
                        opcode: 'executeCodeSafe',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '安全执行代码 [CODE] 确认信息 [MSG]',
                        arguments: {
                            CODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'alert("执行成功！")'
                            },
                            MSG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '确认执行此代码？'
                            }
                        }
                    },
                    {
                        opcode: 'executeCodeReporter',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '执行代码并返回结果 [CODE]',
                        arguments: {
                            CODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'return 1 + 1;'
                            }
                        }
                    }
                ]
            };
        }

        // ----- 积木 1 实现: POST 请求 -----
        postWithAb(args) {
            const { URL, DATA } = args;
            
            // 获取 ab
            let abParam = '';
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'ab' || name === '_ab') {
                    abParam = value;
                    break;
                }
            }
            if (!abParam) {
                abParam = localStorage.getItem('ab') || localStorage.getItem('_ab') || '';
            }
            if (!abParam) {
                abParam = 'guest_' + Date.now().toString(36);
            }
            
            // 解析数据
            let parsedData;
            try {
                parsedData = JSON.parse(DATA);
            } catch {
                parsedData = DATA;
            }
            
            const finalData = typeof parsedData === 'object' ? {
                ...parsedData,
                _ab: abParam
            } : parsedData;
            
            // 发送请求
            fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-AB-Param': abParam,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(finalData),
                credentials: 'include'
            })
            .then(res => {
                if (!res.ok) console.warn(`POST 失败: ${res.status}`);
                return res.json().catch(() => ({}));
            })
            .then(data => console.log('POST 响应:', data))
            .catch(err => console.error('POST 错误:', err));
        }

        // ----- 积木 2 实现: new Function -----
        executeCode(args) {
            const code = args.CODE || '';
            if (!code) return;
            try {
                new Function(code)();
            } catch (e) {
                console.error('代码执行错误:', e);
            }
        }

        executeCodeSafe(args) {
            const { CODE, MSG } = args;
            if (!CODE) return;
            if (confirm(MSG || '确认执行此代码？')) {
                try {
                    new Function(CODE)();
                } catch (e) {
                    console.error('代码执行错误:', e);
                }
            }
        }

        executeCodeReporter(args) {
            const code = args.CODE || '';
            if (!code) return null;
            try {
                const result = new Function(code)();
                return result !== undefined ? result : null;
            } catch (e) {
                console.error('代码执行错误:', e);
                return null;
            }
        }
    }

    Scratch.extensions.register(new WebHookExtension());

})(window.Scratch);

// ============================================
// 导出
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        postWithAb,
        executeCode,
        safeExecuteCode
    };
}