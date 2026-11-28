// FileAnalyzerExtension.js
// 本地文件读取与分析扩展 - 支持 TXT, MD, DOCX, DOC, PDF

class FileAnalyzerExtension {
    constructor() {
        this.isDesktop = typeof EditorPreload !== 'undefined';
        this.supportedFormats = ['txt', 'md', 'docx', 'doc', 'pdf'];
        this.fileCache = new Map(); // 缓存文件内容
        this.cacheTimeout = 60000; // 缓存过期时间（毫秒）
        this.lastAnalysis = null;
        
        // 加载 PDF.js 用于 PDF 解析（如果可用）
        if (typeof window.pdfjsLib !== 'undefined') {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
    }

    getInfo() {
        return {
            id: 'fileAnalyzer',
            name: '📄 智能文件分析器',
            color1: '#FF6B35',
            color2: '#E55A2B',
            color3: '#CC4A1F',
            
            permissions: [
                'file-read',
                'file-metadata',
                'file-write'
            ],
            
            blocks: [
                // ====== 文件读取 ======
                {
                    opcode: 'readFileContent',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '读取文件 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\document.txt'
                        }
                    }
                },
                {
                    opcode: 'readFileWithFormat',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '按格式读取 [PATH] 为 [FORMAT]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\document.docx'
                        },
                        FORMAT: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'fileFormats',
                            defaultValue: 'txt'
                        }
                    }
                },
                
                // ====== 文本分析 ======
                {
                    opcode: 'countWords',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[PATH] 字数统计',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\document.txt'
                        }
                    }
                },
                {
                    opcode: 'countChars',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[PATH] 字符数（不含空格）',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\document.txt'
                        }
                    }
                },
                {
                    opcode: 'countParagraphs',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[PATH] 段落数',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\document.txt'
                        }
                    }
                },
                {
                    opcode: 'getReadingTime',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[PATH] 阅读时间（分钟）',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\document.txt'
                        }
                    }
                },
                
                // ====== 智能分析 ======
                {
                    opcode: 'analyzeText',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '深度分析 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\document.txt'
                        }
                    }
                },
                {
                    opcode: 'extractKeywords',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '提取关键词（最多 [NUM] 个）从 [PATH]',
                    arguments: {
                        NUM: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\document.txt'
                        }
                    }
                },
                {
                    opcode: 'getSentimentScore',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '情感分析 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\document.txt'
                        }
                    }
                },
                {
                    opcode: 'findCommonWords',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '词频统计 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\document.txt'
                        }
                    }
                },
                
                // ====== 文件操作 ======
                {
                    opcode: 'saveAnalysisResult',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '保存分析结果到 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\分析报告.txt'
                        }
                    }
                },
                {
                    opcode: 'getFileInfo',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '文件信息 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\document.pdf'
                        }
                    }
                },
                {
                    opcode: 'checkFileFormat',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '检测文件格式 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\file.txt'
                        }
                    }
                },
                
                // ====== 批量处理 ======
                {
                    opcode: 'listSupportedFiles',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '列出 [PATH] 中支持的文档',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%'
                        }
                    }
                },
                {
                    opcode: 'batchAnalyze',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '批量分析 [PATH] 中的文档',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%'
                        }
                    }
                }
            ],
            
            menus: {
                fileFormats: {
                    acceptReporters: true,
                    items: [
                        { text: '📄 文本文件 (.txt)', value: 'txt' },
                        { text: '📝 Markdown (.md)', value: 'md' },
                        { text: '📃 Word文档 (.docx)', value: 'docx' },
                        { text: '📃 Word文档 (.doc)', value: 'doc' },
                        { text: '📕 PDF文档 (.pdf)', value: 'pdf' },
                        { text: '🔄 自动检测', value: 'auto' }
                    ]
                }
            }
        };
    }

    // ========== 工具方法 ==========

    // 获取文件扩展名
    getFileExtension(path) {
        const parts = path.split('.');
        return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    }

    // 格式化文件大小
    formatSize(bytes) {
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
        return (bytes / 1073741824).toFixed(2) + ' GB';
    }

    // 清理文本
    cleanText(text) {
        if (!text) return '';
        // 移除多余空格和换行
        return text.replace(/\s+/g, ' ').trim();
    }

    // 获取缓存或读取文件
    async getFileContent(path, forceRefresh = false) {
        if (!this.isDesktop) return { success: false, error: '需要桌面版' };

        // 检查缓存
        const cacheKey = path;
        if (!forceRefresh && this.fileCache.has(cacheKey)) {
            const cached = this.fileCache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached;
            }
        }

        try {
            const result = await EditorPreload.readFile(path);
            if (result.success) {
                const cacheData = {
                    success: true,
                    content: result.content,
                    filePath: result.filePath || path,
                    timestamp: Date.now()
                };
                this.fileCache.set(cacheKey, cacheData);
                
                // 清理过期缓存
                this.cleanCache();
                
                return cacheData;
            }
            return { success: false, error: result.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 清理过期缓存
    cleanCache() {
        const now = Date.now();
        for (const [key, value] of this.fileCache.entries()) {
            if (now - value.timestamp > this.cacheTimeout) {
                this.fileCache.delete(key);
            }
        }
    }

    // 清除缓存
    clearCache() {
        this.fileCache.clear();
    }

    // 获取文件的文本内容（支持多种格式）
    async extractTextFromFile(path, format = 'auto') {
        if (!this.isDesktop) return { success: false, error: '需要桌面版' };

        // 检测格式
        let detectedFormat = format;
        if (format === 'auto') {
            const ext = this.getFileExtension(path);
            detectedFormat = this.supportedFormats.includes(ext) ? ext : 'txt';
        }

        try {
            const fileResult = await this.getFileContent(path);
            if (!fileResult.success) {
                return { success: false, error: fileResult.error };
            }

            let content = fileResult.content;

            // 根据不同格式处理
            switch (detectedFormat) {
                case 'md':
                    // Markdown 转为纯文本
                    content = this.markdownToText(content);
                    break;
                case 'docx':
                    // 尝试解析 DOCX（需要额外的库）
                    content = await this.parseDocx(content);
                    break;
                case 'doc':
                    // 尝试解析 DOC
                    content = await this.parseDoc(content);
                    break;
                case 'pdf':
                    // 尝试解析 PDF
                    content = await this.parsePdf(content);
                    break;
                case 'txt':
                default:
                    // TXT 直接返回
                    content = content;
                    break;
            }

            return {
                success: true,
                content: content,
                format: detectedFormat,
                raw: fileResult.content
            };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Markdown 转文本
    markdownToText(md) {
        if (!md) return '';
        
        return md
            // 移除 HTML 标签
            .replace(/<[^>]*>/g, '')
            // 移除 Markdown 标题标记
            .replace(/^#+\s+/gm, '')
            // 移除粗体/斜体
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/__(.*?)__/g, '$1')
            .replace(/_(.*?)_/g, '$1')
            // 移除行内代码
            .replace(/`([^`]*)`/g, '$1')
            // 移除代码块
            .replace(/```[\s\S]*?```/g, '')
            // 移除链接
            .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
            // 移除图片
            .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
            // 移除列表标记
            .replace(/^[\s]*[-*+]\s+/gm, '')
            .replace(/^[\s]*\d+\.\s+/gm, '')
            // 移除引用标记
            .replace(/^>\s+/gm, '')
            // 清理多余空白
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    // 解析 DOCX（简化版 - 实际上应该使用专门的库）
    async parseDocx(content) {
        // 注意：真实的 DOCX 解析需要 xml2js 或类似库
        // 这里提供一个简化版本，用于演示
        try {
            // 如果是 Base64 编码的 DOCX，需要解码
            if (content.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                // 移除 data URL 前缀
                const base64 = content.split(',')[1] || content;
                // 尝试解码
                try {
                    const decoded = atob(base64);
                    return `[DOCX 文档]\n${decoded.substring(0, 1000)}...\n\n⚠️ 完整解析需要额外的库支持。\n请使用 .txt 或 .md 格式以获得最佳体验。`;
                } catch (e) {
                    return '[无法解析 DOCX 内容]\n请确保安装了必要的解析库。';
                }
            }
            return content;
        } catch (error) {
            return `[DOCX 解析错误]: ${error.message}`;
        }
    }

    // 解析 DOC（简化版）
    async parseDoc(content) {
        try {
            if (content.startsWith('data:application/msword')) {
                return `[DOC 文档]\n内容以二进制格式存储，无法直接显示。\n请将文档另存为 .docx 或 .txt 格式。`;
            }
            return content;
        } catch (error) {
            return `[DOC 解析错误]: ${error.message}`;
        }
    }

    // 解析 PDF（使用 PDF.js）
    async parsePdf(content) {
        try {
            // 检查 PDF.js 是否可用
            if (typeof window.pdfjsLib === 'undefined') {
                return `[PDF 解析提示]\nPDF.js 库未加载。\n建议：\n1. 使用在线工具将 PDF 转为 TXT\n2. 或安装 PDF 解析插件\n\n当前返回原始内容：\n${content.substring(0, 500)}...`;
            }

            // 如果内容是 Base64 格式
            if (content.startsWith('data:application/pdf')) {
                // 移除 data URL 前缀，获取 Base64 数据
                const base64 = content.split(',')[1] || content;
                const binaryString = atob(base64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                
                // 使用 PDF.js 加载
                const pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise;
                let text = '';
                
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const contentText = await page.getTextContent();
                    const pageText = contentText.items.map(item => item.str).join(' ');
                    text += pageText + '\n\n';
                }
                
                return text.trim() || '[PDF 文档]\n未提取到文本内容，可能文档是扫描件。';
            }
            
            return `[PDF 解析]\n内容格式无法识别。\n当前内容预览：\n${content.substring(0, 200)}...`;
        } catch (error) {
            return `[PDF 解析错误]: ${error.message}\n\n原内容预览：\n${content.substring(0, 300)}...`;
        }
    }

    // ========== 文本分析方法 ==========

    // 字数统计
    countWordsInText(text) {
        if (!text) return 0;
        const clean = this.cleanText(text);
        if (!clean) return 0;
        return clean.split(/\s+/).length;
    }

    // 字符数统计（不含空格）
    countCharsInText(text) {
        if (!text) return 0;
        return text.replace(/\s/g, '').length;
    }

    // 段落数统计
    countParagraphsInText(text) {
        if (!text) return 0;
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        return paragraphs.length;
    }

    // 计算阅读时间（中文：约 300 字/分钟）
    getReadingTimeForText(text) {
        const wordCount = this.countWordsInText(text);
        // 中文阅读速度约 300-400 字/分钟，取平均值 350
        const minutes = Math.ceil(wordCount / 350);
        return Math.max(1, minutes);
    }

    // 词频统计
    getWordFrequency(text) {
        if (!text) return {};
        
        const words = text.toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 1);
        
        const freq = {};
        for (const word of words) {
            freq[word] = (freq[word] || 0) + 1;
        }
        
        // 排序
        return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});
    }

    // 提取关键词（使用 TF-IDF 简化版）
    extractKeywordsFromText(text, num = 10) {
        const freq = this.getWordFrequency(text);
        const totalWords = Object.values(freq).reduce((sum, count) => sum + count, 0);
        
        // 过滤常见词
        const stopWords = new Set([
            '的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个',
            '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好',
            'the', 'a', 'an', 'of', 'to', 'and', 'in', 'that', 'with', 'for', 'on', 'at',
            'by', 'from', 'this', 'these', 'those', 'then', 'than', 'so', 'such', 'some'
        ]);
        
        const filtered = Object.entries(freq)
            .filter(([word]) => !stopWords.has(word) && word.length > 1)
            .sort((a, b) => b[1] - a[1])
            .slice(0, num);
        
        return filtered.map(([word, count]) => 
            `${word} (${count}次)`
        ).join('、') || '未检测到关键词';
    }

    // 情感分析（简化版）
    getSentimentScoreForText(text) {
        if (!text) return '无法分析';
        
        // 简单的情感词典
        const positiveWords = new Set([
            '好', '美', '棒', '赞', '爱', '喜欢', '优秀', '开心', '幸福', '美好',
            'good', 'great', 'excellent', 'amazing', 'wonderful', 'love', 'happy',
            '完美', '精彩', '出色', '成功', '希望', '温暖', '感动'
        ]);
        
        const negativeWords = new Set([
            '差', '坏', '糟', '烂', '恨', '讨厌', '失败', '痛苦', '悲伤', '丑陋',
            'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'sad',
            '糟糕', '失望', '遗憾', '愤怒', '焦虑', '恐惧'
        ]);
        
        const words = text.toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 0);
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        for (const word of words) {
            if (positiveWords.has(word)) positiveCount++;
            if (negativeWords.has(word)) negativeCount++;
        }
        
        const total = positiveCount + negativeCount;
        if (total === 0) return '中性（无明显情感倾向）';
        
        const score = (positiveCount - negativeCount) / total;
        
        if (score > 0.3) return `积极 (${Math.round(score * 100)}% 正面)`;
        if (score < -0.3) return `消极 (${Math.round(-score * 100)}% 负面)`;
        return `中性 (平衡: ${Math.round(score * 100)}%)`;
    }

    // ========== 积木方法 ==========

    // 读取文件内容
    async readFileContent(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        const result = await this.getFileContent(args.PATH);
        if (result.success) {
            // 限制返回长度，避免卡顿
            const content = result.content;
            if (content.length > 50000) {
                return content.substring(0, 50000) + '\n\n...(内容过长，已截断)';
            }
            return content;
        }
        return `❌ ${result.error}`;
    }

    // 按格式读取
    async readFileWithFormat(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        const format = args.FORMAT || 'auto';
        const result = await this.extractTextFromFile(args.PATH, format);
        
        if (result.success) {
            const content = result.content;
            if (content.length > 50000) {
                return content.substring(0, 50000) + '\n\n...(内容过长，已截断)';
            }
            return content;
        }
        return `❌ ${result.error}`;
    }

    // 字数统计
    async countWords(args) {
        if (!this.isDesktop) return 0;
        
        const result = await this.extractTextFromFile(args.PATH);
        if (result.success) {
            return this.countWordsInText(result.content);
        }
        return 0;
    }

    // 字符数统计
    async countChars(args) {
        if (!this.isDesktop) return 0;
        
        const result = await this.extractTextFromFile(args.PATH);
        if (result.success) {
            return this.countCharsInText(result.content);
        }
        return 0;
    }

    // 段落数统计
    async countParagraphs(args) {
        if (!this.isDesktop) return 0;
        
        const result = await this.extractTextFromFile(args.PATH);
        if (result.success) {
            return this.countParagraphsInText(result.content);
        }
        return 0;
    }

    // 阅读时间
    async getReadingTime(args) {
        if (!this.isDesktop) return 0;
        
        const result = await this.extractTextFromFile(args.PATH);
        if (result.success) {
            return this.getReadingTimeForText(result.content);
        }
        return 0;
    }

    // 深度分析
    async analyzeText(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        const result = await this.extractTextFromFile(args.PATH);
        if (!result.success) {
            return `❌ ${result.error}`;
        }
        
        const text = result.content;
        const wordCount = this.countWordsInText(text);
        const charCount = this.countCharsInText(text);
        const paragraphCount = this.countParagraphsInText(text);
        const readingTime = this.getReadingTimeForText(text);
        const sentiment = this.getSentimentScoreForText(text);
        const keywords = this.extractKeywordsFromText(text, 10);
        
        const report = `
📊 深度分析报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 文件: ${args.PATH}
📋 格式: ${result.format || '未知'}

📊 基本统计
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 字数: ${wordCount}
🔤 字符数（不含空格）: ${charCount}
📑 段落数: ${paragraphCount}
⏱️ 阅读时间: ${readingTime} 分钟

💡 智能分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 情感倾向: ${sentiment}
🔑 关键词: ${keywords}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
分析完成时间: ${new Date().toLocaleString('zh-CN')}
        `.trim();
        
        // 保存分析结果供后续使用
        this.lastAnalysis = {
            path: args.PATH,
            wordCount,
            charCount,
            paragraphCount,
            readingTime,
            sentiment,
            keywords,
            timestamp: new Date().toISOString()
        };
        
        return report;
    }

    // 提取关键词
    async extractKeywords(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        const result = await this.extractTextFromFile(args.PATH);
        if (!result.success) {
            return `❌ ${result.error}`;
        }
        
        const num = Math.max(1, Math.min(50, Number(args.NUM) || 10));
        return this.extractKeywordsFromText(result.content, num);
    }

    // 情感分析
    async getSentimentScore(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        const result = await this.extractTextFromFile(args.PATH);
        if (!result.success) {
            return `❌ ${result.error}`;
        }
        
        return this.getSentimentScoreForText(result.content);
    }

    // 词频统计
    async findCommonWords(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        const result = await this.extractTextFromFile(args.PATH);
        if (!result.success) {
            return `❌ ${result.error}`;
        }
        
        const freq = this.getWordFrequency(result.content);
        const entries = Object.entries(freq);
        
        if (entries.length === 0) return '未检测到词汇';
        
        const top20 = entries.slice(0, 20);
        return top20.map(([word, count]) => 
            `${word}: ${count}次`
        ).join('\n');
    }

    // 文件信息
    async getFileInfo(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const statsResult = await EditorPreload.getFileStats(args.PATH);
            if (!statsResult.success) {
                return `❌ ${statsResult.error}`;
            }
            
            const ext = this.getFileExtension(args.PATH);
            const isSupported = this.supportedFormats.includes(ext);
            
            const info = `
📁 文件信息
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 文件名: ${args.PATH.split(/[\\/]/).pop()}
📂 路径: ${args.PATH}
📋 格式: ${ext || '未知'} ${isSupported ? '✅ 支持' : '❌ 不支持'}
📦 大小: ${this.formatSize(statsResult.stats.size)}
📅 创建时间: ${new Date(statsResult.stats.created).toLocaleString('zh-CN')}
✏️ 修改时间: ${new Date(statsResult.stats.modified).toLocaleString('zh-CN')}
📖 访问时间: ${new Date(statsResult.stats.accessed).toLocaleString('zh-CN')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            `.trim();
            
            return info;
        } catch (error) {
            return `❌ ${error.message}`;
        }
    }

    // 检测文件格式
    async checkFileFormat(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const statsResult = await EditorPreload.getFileStats(args.PATH);
            if (!statsResult.success) {
                return `❌ ${statsResult.error}`;
            }
            
            // 先检查扩展名
            const ext = this.getFileExtension(args.PATH);
            const isSupported = this.supportedFormats.includes(ext);
            
            if (!isSupported) {
                return `📄 ${ext || '无'}格式 - 不支持\n支持的格式: ${this.supportedFormats.join(', ')}`;
            }
            
            // 尝试读取文件内容进行验证
            const result = await this.getFileContent(args.PATH);
            if (result.success) {
                const content = result.content;
                let verified = false;
                
                // 简单验证
                if (ext === 'pdf' && content.startsWith('%PDF')) {
                    verified = true;
                } else if (ext === 'docx' && content.includes('PK')) {
                    verified = true;
                } else if (ext === 'md' && (content.includes('#') || content.includes('```'))) {
                    verified = true;
                }
                
                return `📄 ${ext.toUpperCase()} 格式 - ${verified ? '✅ 验证通过' : '⚠️ 格式可能不符'}\n大小: ${this.formatSize(statsResult.stats.size)}`;
            }
            
            return `📄 ${ext.toUpperCase()} 格式 - 无法验证内容`;
        } catch (error) {
            return `❌ ${error.message}`;
        }
    }

    // 列出支持的文档
    async listSupportedFiles(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.readLocalFolder(args.PATH);
            if (!result.success) {
                return `❌ ${result.error}`;
            }
            
            const supportedFiles = result.files
                .filter(file => {
                    const ext = this.getFileExtension(file.name);
                    return this.supportedFormats.includes(ext);
                })
                .map(file => {
                    const ext = this.getFileExtension(file.name);
                    return `${file.isDirectory ? '📁' : '📄'} ${file.name} (${this.formatSize(file.size)})`;
                });
            
            if (supportedFiles.length === 0) {
                return `📂 ${args.PATH}\n未找到支持的文档格式\n支持的格式: ${this.supportedFormats.join(', ')}`;
            }
            
            const output = [
                `📂 ${args.PATH}`,
                `━`.repeat(40),
                `找到 ${supportedFiles.length} 个支持的文件:`,
                '',
                ...supportedFiles,
                '',
                `支持的格式: ${this.supportedFormats.join(', ')}`
            ].join('\n');
            
            return output;
        } catch (error) {
            return `❌ ${error.message}`;
        }
    }

    // 保存分析结果
    async saveAnalysisResult(args) {
        if (!this.isDesktop) return;
        
        if (!this.lastAnalysis) {
            console.warn('⚠️ 没有可保存的分析结果，请先运行"深度分析"');
            return;
        }
        
        const report = `
════════════════════════════════════════════════════════════
📊 文件分析报告
════════════════════════════════════════════════════════════

📄 文件路径: ${this.lastAnalysis.path}
📋 分析时间: ${this.lastAnalysis.timestamp}

📊 基本统计
────────────────────────────────────────────────────────────
📝 总字数: ${this.lastAnalysis.wordCount}
🔤 总字符数（不含空格）: ${this.lastAnalysis.charCount}
📑 段落数: ${this.lastAnalysis.paragraphCount}
⏱️ 预计阅读时间: ${this.lastAnalysis.readingTime} 分钟

💡 智能分析
────────────────────────────────────────────────────────────
🎯 情感倾向: ${this.lastAnalysis.sentiment}
🔑 关键词: ${this.lastAnalysis.keywords}

════════════════════════════════════════════════════════════
📌 报告生成时间: ${new Date().toLocaleString('zh-CN')}
════════════════════════════════════════════════════════════
        `.trim();
        
        try {
            const result = await EditorPreload.writeFile(args.PATH, report);
            if (result.success) {
                console.log(`✅ 分析报告已保存: ${args.PATH}`);
            } else {
                console.error(`❌ 保存失败: ${result.error}`);
            }
        } catch (error) {
            console.error(`❌ 异常: ${error.message}`);
        }
    }

    // 批量分析
    async batchAnalyze(args) {
        if (!this.isDesktop) return;
        
        try {
            const result = await EditorPreload.readLocalFolder(args.PATH);
            if (!result.success) {
                console.error(`❌ ${result.error}`);
                return;
            }
            
            const supportedFiles = result.files
                .filter(file => {
                    const ext = this.getFileExtension(file.name);
                    return this.supportedFormats.includes(ext) && !file.isDirectory;
                })
                .slice(0, 10); // 限制数量避免性能问题
            
            if (supportedFiles.length === 0) {
                console.log('📂 未找到支持的文档');
                return;
            }
            
            console.log(`📊 开始批量分析 ${supportedFiles.length} 个文件...`);
            
            const results = [];
            for (const file of supportedFiles) {
                const fullPath = `${args.PATH}\\${file.name}`;
                const ext = this.getFileExtension(file.name);
                
                try {
                    const textResult = await this.extractTextFromFile(fullPath, ext);
                    if (textResult.success) {
                        const wordCount = this.countWordsInText(textResult.content);
                        const sentiment = this.getSentimentScoreForText(textResult.content);
                        results.push({
                            name: file.name,
                            words: wordCount,
                            sentiment: sentiment
                        });
                        console.log(`✅ ${file.name}: ${wordCount} 词, ${sentiment}`);
                    } else {
                        results.push({
                            name: file.name,
                            error: textResult.error
                        });
                    }
                } catch (error) {
                    results.push({
                        name: file.name,
                        error: error.message
                    });
                }
            }
            
            // 生成汇总报告
            const summary = [
                '📊 批量分析报告',
                `━`.repeat(50),
                `📂 目录: ${args.PATH}`,
                `📁 文件数: ${supportedFiles.length}`,
                `━`.repeat(50),
                ''
            ];
            
            let totalWords = 0;
            for (const r of results) {
                if (r.error) {
                    summary.push(`❌ ${r.name}: ${r.error}`);
                } else {
                    summary.push(`📄 ${r.name}: ${r.words} 词 | ${r.sentiment}`);
                    totalWords += r.words;
                }
            }
            
            summary.push('');
            summary.push(`━`.repeat(50));
            summary.push(`📊 总计: ${totalWords} 词`);
            summary.push(`📅 分析时间: ${new Date().toLocaleString('zh-CN')}`);
            
            // 保存批量分析报告
            const reportPath = `${args.PATH}\\批量分析报告_${Date.now()}.txt`;
            const reportContent = summary.join('\n');
            
            const saveResult = await EditorPreload.writeFile(reportPath, reportContent);
            if (saveResult.success) {
                console.log(`✅ 批量分析报告已保存: ${reportPath}`);
            }
            
        } catch (error) {
            console.error(`❌ 批量分析失败: ${error.message}`);
        }
    }
}

// 注册扩展
if (typeof Scratch !== 'undefined') {
    Scratch.extensions.register(new FileAnalyzerExtension());
}

// 导出（用于模块化开发）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileAnalyzerExtension;
}