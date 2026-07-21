// 名称：智谱 GLM 对话
// 作者：基于开放接口适配（GLM-4.7-Flash）
// 描述：在 TurboWarp 中调用智谱 AI 免费模型 GLM-4.7-Flash 进行 AI 对话

// 许可证：MPL-2.0（Mozilla 公共许可证 2.0）
// 本源代码受 Mozilla 公共许可证 2.0 条款约束，
// 如果本文件未随附 MPL 副本，可从 https://mozilla.org/MPL/2.0/ 获取。

(function (Scratch) {

    // 该扩展需要发起网络请求，必须在非沙盒模式下运行
    if (!Scratch.extensions.unsandboxed) {
        throw new Error("智谱 GLM 对话扩展必须在非沙盒模式下运行。");
    }

    const cast = Scratch.Cast;

    // 智谱 AI 开放平台接口（OpenAI 兼容格式）
    const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    const MODEL = 'glm-4.7-flash';

    // 内置默认 API Key（用户提供的智谱免费 Key，开箱即用；请勿外传源码）
    const DEFAULT_API_KEY = 'f6565a25f3fe4db981ed6234cbcb42d4.44KKjsTD3JOlgtdn';

    // 默认系统提示词
    const DEFAULT_SYSTEM_PROMPT = '你一个由B站用户：dhdbvcg，用turbo warp（scratch）制作跑酷游戏的内置AI。';

    // 快速提问模式使用的回复长度（更小，生成更快）
    const FAST_MAX_TOKENS = 512;

    class GLMChat {
        constructor() {
            this.apiKey = DEFAULT_API_KEY;       // 使用内置默认 Key
            this.systemPrompt = DEFAULT_SYSTEM_PROMPT; // 默认系统提示词
            this.temperature = 0.7;              // 采样温度
            this.maxTokens = 2048;               // 最大回复长度（下调以加快生成）
            this.timeoutMs = 30000;              // 请求超时（毫秒）
            this.history = [];                   // 连续对话历史
            this.lastError = '';                 // 最后一次错误信息
            this.model = MODEL;                  // 当前使用的模型（可切换）
            this.lastReply = '';                 // 最后一次成功回复内容
            this._lastPrompt = '';               // 最近一次提问内容（用于重试）
            this._lastUseHistory = false;        // 最近一次是否使用历史（用于重试）
            this._chain = Promise.resolve();     // 请求串行锁，贴合免费档 1 并发限制
        }

        getInfo() {
            return {
                id: 'ZhipuGLM',
                name: '智谱 GLM 对话',
                color1: '#0d9488',
                color2: '#0f766e',
                docsURI: 'http://114.55.64.11/GLM-%E5%B8%AE%E5%8A%A9.html',
                blocks: [
                    // 基础设置
                    {
                        opcode: 'setApiKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置 API Key 为 [KEY]',
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: DEFAULT_API_KEY }
                        }
                    },
                    {
                        opcode: 'setSystemPrompt',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置系统提示词为 [PROMPT]',
                        arguments: {
                            PROMPT: { type: Scratch.ArgumentType.STRING, defaultValue: DEFAULT_SYSTEM_PROMPT }
                        }
                    },
                    {
                        opcode: 'setTemperature',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置温度为 [T]',
                        arguments: {
                            T: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.7 }
                        }
                    },
                    {
                        opcode: 'setMaxTokens',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置最大回复长度为 [N]',
                        arguments: {
                            N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2048 }
                        }
                    },
                    {
                        opcode: 'setTimeoutSec',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置请求超时时间为 [S] 秒',
                        arguments: {
                            S: { type: Scratch.ArgumentType.NUMBER, defaultValue: 30 }
                        }
                    },
                    "---",
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '对话'
                    },
                    {
                        opcode: 'ask',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '向 GLM 提问 [QUESTION]',
                        arguments: {
                            QUESTION: { type: Scratch.ArgumentType.STRING, defaultValue: '你好，介绍一下你自己。' }
                        },
                        func: 'ask'
                    },
                    {
                        opcode: 'fastAsk',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '快速提问 [QUESTION]',
                        arguments: {
                            QUESTION: { type: Scratch.ArgumentType.STRING, defaultValue: '用一句话回答我。' }
                        },
                        func: 'fastAsk'
                    },
                    {
                        opcode: 'askWithHistory',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '连续对话提问 [QUESTION]',
                        arguments: {
                            QUESTION: { type: Scratch.ArgumentType.STRING, defaultValue: '继续刚才的话题。' }
                        },
                        func: 'askWithHistory'
                    },
                    {
                        opcode: 'clearHistory',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '清空对话历史'
                    },
                    {
                        opcode: 'clearLastError',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '清空最后错误'
                    },
                    {
                        opcode: 'getLastError',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取最后错误'
                    },
                    {
                        opcode: 'getHistoryCount',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取对话轮数'
                    },
                    "---",
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '扩展功能'
                    },
                    {
                        opcode: 'setModel',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置模型为 [MODEL]',
                        arguments: {
                            MODEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'glm-4.7-flash' }
                        }
                    },
                    {
                        opcode: 'getModel',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取当前模型'
                    },
                    {
                        opcode: 'getLastReply',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取最后回复'
                    },
                    {
                        opcode: 'getLastReplyLength',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取最后回复字数'
                    },
                    {
                        opcode: 'exportHistory',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '导出对话记录'
                    },
                    {
                        opcode: 'resetSystemPrompt',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '恢复默认系统提示词'
                    },
                    {
                        opcode: 'retryLast',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '重试上次提问'
                    }
                ]
            };
        }

        // 对外入口：通过串行锁依次执行，避免免费档 1 并发限制导致大量 429 报错
        _callGLM(prompt, useHistory, tokenOverride) {
            const self = this;
            const run = function () { return self._doCall(prompt, useHistory, tokenOverride); };
            const result = this._chain.then(run, run); // 无论上一次成功失败都继续执行
            this._chain = result.then(function () {}, function () {}); // 吞掉链上错误，避免连锁拒绝
            return result;
        }

        // 真正的请求逻辑
        async _doCall(prompt, useHistory, tokenOverride) {
            // 记录本次提问，供「重试上次提问」使用
            this._lastPrompt = cast.toString(prompt);
            this._lastUseHistory = !!useHistory;

            if (!this.apiKey) {
                this.lastError = '未设置 API Key';
                return '请先使用「设置 API Key 为 [KEY]」积木填入你的智谱 API Key。';
            }

            const messages = [];
            if (this.systemPrompt) {
                messages.push({ role: 'system', content: String(this.systemPrompt) });
            }
            if (useHistory) {
                for (const m of this.history) {
                    messages.push(m);
                }
            }
            messages.push({ role: 'user', content: cast.toString(prompt) });

            const maxTok = (tokenOverride != null)
                ? tokenOverride
                : Math.max(1, Math.floor(Number(this.maxTokens) || 2048));

            const payload = {
                model: this.model,
                messages: messages,
                temperature: Number(this.temperature) || 0.7,
                max_tokens: maxTok
            };

            const controller = new AbortController();
            const self = this;
            const timer = setTimeout(function () { controller.abort(); }, this.timeoutMs);

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.apiKey
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });

                if (!res.ok) {
                    const errText = await res.text();
                    this.lastError = 'HTTP ' + res.status + ': ' + errText;
                    return '请求失败（' + res.status + '），请用「获取最后错误」积木查看详情。';
                }

                const data = await res.json();
                const reply = data.choices && data.choices[0] && data.choices[0].message
                    ? (data.choices[0].message.content || '')
                    : '';

                if (useHistory) {
                    this.history.push({ role: 'user', content: cast.toString(prompt) });
                    this.history.push({ role: 'assistant', content: reply });
                }
                this.lastError = '';
                this.lastReply = reply;
                return reply;
            } catch (error) {
                if (error && error.name === 'AbortError') {
                    this.lastError = '请求超时（' + (self.timeoutMs / 1000) + ' 秒）';
                    return '请求超时，请稍后重试或调小「最大回复长度」。';
                }
                this.lastError = String(error && error.message ? error.message : error);
                return '请求出错，请用「获取最后错误」积木查看详情。';
            } finally {
                clearTimeout(timer);
            }
        }

        setApiKey(args) {
            this.apiKey = cast.toString(args.KEY);
        }

        setSystemPrompt(args) {
            this.systemPrompt = cast.toString(args.PROMPT);
        }

        setTemperature(args) {
            this.temperature = cast.toNumber(args.T);
        }

        setMaxTokens(args) {
            this.maxTokens = cast.toNumber(args.N);
        }

        setTimeoutSec(args) {
            // 最短 1 秒，避免误设为 0 导致立刻超时
            this.timeoutMs = Math.max(1000, cast.toNumber(args.S) * 1000);
        }

        ask(args) {
            return this._callGLM(args.QUESTION, false, null);
        }

        fastAsk(args) {
            // 快速模式：使用更小的回复长度，生成更快
            return this._callGLM(args.QUESTION, false, FAST_MAX_TOKENS);
        }

        askWithHistory(args) {
            return this._callGLM(args.QUESTION, true, null);
        }

        clearHistory() {
            this.history = [];
        }

        clearLastError() {
            this.lastError = '';
        }

        getLastError() {
            return this.lastError || '';
        }

        getHistoryCount() {
            return String(Math.floor(this.history.length / 2));
        }

        // ===== 以下为新增的扩展功能积木 =====

        setModel(args) {
            // 切换使用的模型（如 glm-4.7-flash / glm-4.7 / glm-4-plus 等）
            this.model = cast.toString(args.MODEL);
        }

        getModel() {
            return this.model || MODEL;
        }

        getLastReply() {
            // 获取最后一次成功回复的内容，便于后续再次引用
            return this.lastReply || '';
        }

        getLastReplyLength() {
            // 获取最后回复的字数，便于做文本长度判断
            return String((this.lastReply || '').length);
        }

        exportHistory() {
            // 导出当前对话记录为纯文本，可用于保存或展示
            const lines = [];
            if (this.systemPrompt) {
                lines.push('【系统】' + this.systemPrompt);
            }
            for (const m of this.history) {
                const who = m.role === 'user' ? '用户' : 'GLM';
                lines.push('【' + who + '】' + m.content);
            }
            return lines.join('\n');
        }

        resetSystemPrompt() {
            // 将系统提示词恢复为默认的跑酷游戏 AI 设定
            this.systemPrompt = DEFAULT_SYSTEM_PROMPT;
        }

        retryLast() {
            // 用相同的参数重新发起上一次提问（限流/报错后很有用）
            if (!this._lastPrompt) {
                this.lastError = '暂无可重试的提问';
                return '没有可重试的提问，请先发起一次提问。';
            }
            return this._callGLM(this._lastPrompt, this._lastUseHistory, null);
        }

    }

    Scratch.extensions.register(Scratch.vm.runtime.ext_ZhipuGLM = new GLMChat());
})(Scratch);
