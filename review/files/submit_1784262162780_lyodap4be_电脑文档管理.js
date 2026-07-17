// ============================================================
// 文档创建扩展 - Document Creator Extension
// 版本: 2.0.0
// 描述: 创建多种格式文档：TXT, MD, XML, JSON, HTML, CSV, YAML
// 权限: file-write, file-read, file-metadata, system-command
// ============================================================

class DocumentCreatorExtension {
    constructor() {
        this.isDesktop = typeof EditorPreload !== 'undefined';
        this.documents = [];
        this.templates = {};
        this.outputPath = '%DESKTOP%';
        this.autoSave = true;
        this.lastCreated = null;
        
        // 加载模板
        this.initTemplates();
    }

    // ============================================================
    // getInfo() - 扩展元信息
    // ============================================================
    getInfo() {
        return {
            id: 'documentCreator',
            name: '📄 文档创建器',
            color1: '#FF5722',
            color2: '#E64A19',
            color3: '#BF360C',

            permissions: [
                'file-write',
                'file-read',
                'file-metadata',
                'system-command'
            ],

            blocks: [
                // ==========================================
                // 1. 创建文档
                // ==========================================
                {
                    opcode: 'createTxtDocument',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📝 创建TXT文档 [NAME] 内容 [CONTENT]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的文档'
                        },
                        CONTENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '这是文档内容'
                        }
                    }
                },
                {
                    opcode: 'createMarkdownDocument',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📝 创建Markdown文档 [NAME] 标题 [TITLE] 内容 [CONTENT]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的笔记'
                        },
                        TITLE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的笔记'
                        },
                        CONTENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '这是笔记内容'
                        }
                    }
                },
                {
                    opcode: 'createXmlDocument',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📄 创建XML文档 [NAME] 根元素 [ROOT] 内容 [CONTENT]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '数据'
                        },
                        ROOT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'root'
                        },
                        CONTENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '<item>值</item>'
                        }
                    }
                },
                {
                    opcode: 'createJsonDocument',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📊 创建JSON文档 [NAME] 数据 [DATA]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '数据'
                        },
                        DATA: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '{"key":"value"}'
                        }
                    }
                },
                {
                    opcode: 'createHtmlDocument',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🌐 创建HTML文档 [NAME] 标题 [TITLE] 内容 [CONTENT]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '网页'
                        },
                        TITLE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的网页'
                        },
                        CONTENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '<h1>欢迎</h1><p>这是网页内容</p>'
                        }
                    }
                },
                {
                    opcode: 'createCsvDocument',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📊 创建CSV文档 [NAME] 表头 [HEADERS] 数据 [DATA]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '表格'
                        },
                        HEADERS: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '姓名,年龄,城市'
                        },
                        DATA: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '张三,25,北京\n李四,30,上海'
                        }
                    }
                },
                {
                    opcode: 'createYamlDocument',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📋 创建YAML文档 [NAME] 数据 [DATA]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '配置'
                        },
                        DATA: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'name: 项目\nversion: 1.0'
                        }
                    }
                },

                // ==========================================
                // 2. 使用模板创建
                // ==========================================
                {
                    opcode: 'createFromTemplate',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📋 从模板创建 [TEMPLATE] 为 [NAME]',
                    arguments: {
                        TEMPLATE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'templates',
                            defaultValue: 'report'
                        },
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的文档'
                        }
                    }
                },
                {
                    opcode: 'createProjectStructure',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📁 创建项目结构 [NAME] 类型 [TYPE]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的项目'
                        },
                        TYPE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'projectTypes',
                            defaultValue: 'web'
                        }
                    }
                },

                // ==========================================
                // 3. 文档管理
                // ==========================================
                {
                    opcode: 'getDocumentInfo',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '📄 文档信息 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\文档.txt'
                        }
                    }
                },
                {
                    opcode: 'listDocuments',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '📂 列出文档 [PATH] 类型 [TYPE]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%'
                        },
                        TYPE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'docTypes',
                            defaultValue: 'all'
                        }
                    }
                },
                {
                    opcode: 'openDocument',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📂 打开文档 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\文档.txt'
                        }
                    }
                },
                {
                    opcode: 'convertDocument',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '🔄 转换文档 [SOURCE] 为 [TARGET] 格式',
                    arguments: {
                        SOURCE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\文档.txt'
                        },
                        TARGET: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'docTypes',
                            defaultValue: 'md'
                        }
                    }
                },

                // ==========================================
                // 4. 批量操作
                // ==========================================
                {
                    opcode: 'batchCreateDocuments',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📚 批量创建文档 [NAMES] 类型 [TYPE]',
                    arguments: {
                        NAMES: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '文档1,文档2,文档3'
                        },
                        TYPE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'docTypes',
                            defaultValue: 'txt'
                        }
                    }
                },
                {
                    opcode: 'createDocumentPack',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📦 创建文档包 [NAME] 包含 [FILES]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '文档包'
                        },
                        FILES: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'README.md,LICENSE.txt,config.json'
                        }
                    }
                },

                // ==========================================
                // 5. 文档内容操作
                // ==========================================
                {
                    opcode: 'appendToDocument',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📝 追加内容到文档 [PATH] [CONTENT]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\文档.txt'
                        },
                        CONTENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '追加的内容'
                        }
                    }
                },
                {
                    opcode: 'insertToDocument',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📝 插入内容到文档 [PATH] 位置 [LINE] [CONTENT]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%\\文档.txt'
                        },
                        LINE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        CONTENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '插入的内容'
                        }
                    }
                },

                // ==========================================
                // 6. 自动生成
                // ==========================================
                {
                    opcode: 'generateDocumentation',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📚 生成文档 [PROJECT_NAME] [AUTHOR]',
                    arguments: {
                        PROJECT_NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的项目'
                        },
                        AUTHOR: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '作者'
                        }
                    }
                },
                {
                    opcode: 'createReadme',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📖 创建README [PROJECT] [DESCRIPTION]',
                    arguments: {
                        PROJECT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '我的项目'
                        },
                        DESCRIPTION: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '项目描述'
                        }
                    }
                },

                // ==========================================
                // 7. 设置
                // ==========================================
                {
                    opcode: 'setOutputPath',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '📂 设置输出路径 [PATH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '%DESKTOP%'
                        }
                    }
                },
                {
                    opcode: 'getOutputPath',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '📂 获取输出路径'
                },
                {
                    opcode: 'getLastCreated',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '📄 获取最后创建的文档'
                }
            ],

            menus: {
                templates: {
                    acceptReporters: true,
                    items: [
                        { text: '📄 报告模板', value: 'report' },
                        { text: '📝 笔记模板', value: 'note' },
                        { text: '📊 数据模板', value: 'data' },
                        { text: '🌐 网页模板', value: 'webpage' },
                        { text: '📖 README模板', value: 'readme' },
                        { text: '📋 配置模板', value: 'config' }
                    ]
                },
                projectTypes: {
                    acceptReporters: true,
                    items: [
                        { text: '🌐 Web项目', value: 'web' },
                        { text: '🐍 Python项目', value: 'python' },
                        { text: '📱 应用项目', value: 'app' },
                        { text: '📚 文档项目', value: 'docs' },
                        { text: '🔧 工具项目', value: 'tool' }
                    ]
                },
                docTypes: {
                    acceptReporters: true,
                    items: [
                        { text: '📝 所有类型', value: 'all' },
                        { text: '📝 TXT', value: 'txt' },
                        { text: '📝 Markdown', value: 'md' },
                        { text: '📄 XML', value: 'xml' },
                        { text: '📊 JSON', value: 'json' },
                        { text: '🌐 HTML', value: 'html' },
                        { text: '📊 CSV', value: 'csv' },
                        { text: '📋 YAML', value: 'yaml' },
                        { text: '📖 README', value: 'readme' },
                        { text: '⚙️ 配置', value: 'config' }
                    ]
                }
            }
        };
    }

    // ============================================================
    // 初始化模板
    // ============================================================
    initTemplates() {
        this.templates = {
            report: {
                name: '报告模板',
                extension: 'md',
                content: `# 报告标题

## 摘要
在这里写摘要...

## 正文
在这里写正文...

## 结论
在这里写结论...

---
*生成时间: ${new Date().toLocaleString()}*
`
            },
            note: {
                name: '笔记模板',
                extension: 'md',
                content: `# 笔记标题

## 日期
${new Date().toLocaleDateString()}

## 内容
在这里写笔记...

## 标签
#笔记 #待整理
`
            },
            data: {
                name: '数据模板',
                extension: 'json',
                content: `{
    "name": "项目名称",
    "version": "1.0.0",
    "description": "项目描述",
    "author": "作者",
    "created": "${new Date().toISOString()}",
    "data": {}
}`
            },
            webpage: {
                name: '网页模板',
                extension: 'html',
                content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>网页标题</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>欢迎</h1>
    <p>这是一个网页模板</p>
    
    <script>
        console.log('页面加载完成');
    </script>
</body>
</html>`
            },
            readme: {
                name: 'README模板',
                extension: 'md',
                content: `# 项目名称

## 简介
项目简介...

## 功能特点
- 功能1
- 功能2
- 功能3

## 安装
\`\`\`bash
npm install
\`\`\`

## 使用
\`\`\`bash
npm start
\`\`\`

## 许可证
MIT

---
*生成时间: ${new Date().toLocaleString()}*
`
            },
            config: {
                name: '配置模板',
                extension: 'yaml',
                content: `# 配置文件
app:
  name: "应用名称"
  version: "1.0.0"
  debug: true

database:
  host: "localhost"
  port: 3306
  name: "myapp"
  username: "admin"
  password: "password"

logging:
  level: "info"
  file: "app.log"

# 生成时间: ${new Date().toLocaleString()}
`
            }
        };
    }

    // ============================================================
    // 工具方法
    // ============================================================

    // 获取完整文件路径
    getFullPath(name, extension) {
        const cleanName = name.replace(/[<>:"/\\|?*]/g, '_');
        const ext = extension.startsWith('.') ? extension : `.${extension}`;
        return `${this.outputPath}\\${cleanName}${ext}`;
    }

    // 获取文件类型
    getFileType(path) {
        const ext = path.split('.').pop().toLowerCase();
        const types = {
            'txt': 'txt',
            'md': 'md',
            'xml': 'xml',
            'json': 'json',
            'html': 'html',
            'htm': 'html',
            'csv': 'csv',
            'yaml': 'yaml',
            'yml': 'yaml',
            'readme': 'readme',
            'config': 'config'
        };
        return types[ext] || 'unknown';
    }

    // 格式化文件大小
    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }

    // 显示通知
    async notify(title, body, isSuccess = true) {
        if (!this.isDesktop) return;
        try {
            await EditorPreload.showNotification({
                title: isSuccess ? `✅ ${title}` : `❌ ${title}`,
                body: body,
                silent: false
            });
        } catch (e) {
            console.error('通知失败:', e);
        }
    }

    // 保存文档
    async saveDocument(path, content) {
        if (!this.isDesktop) return false;
        
        try {
            const result = await EditorPreload.writeFile(path, content);
            if (result.success) {
                this.lastCreated = {
                    path: path,
                    content: content,
                    time: new Date().toISOString()
                };
                this.documents.push({ path, content, time: Date.now() });
                return true;
            }
            return false;
        } catch (error) {
            console.error('保存失败:', error.message);
            return false;
        }
    }

    // ============================================================
    // 1. 创建文档方法
    // ============================================================

    // 创建 TXT 文档
    async createTxtDocument(args) {
        if (!this.isDesktop) return;
        
        const name = args.NAME || '文档';
        const content = args.CONTENT || '这是文档内容';
        const path = this.getFullPath(name, 'txt');
        
        const success = await this.saveDocument(path, content);
        if (success) {
            await this.notify('TXT文档创建成功', `已保存到: ${path}`);
            console.log(`📝 TXT文档已创建: ${path}`);
        } else {
            await this.notify('TXT文档创建失败', '请检查权限和路径', false);
        }
    }

    // 创建 Markdown 文档
    async createMarkdownDocument(args) {
        if (!this.isDesktop) return;
        
        const name = args.NAME || '笔记';
        const title = args.TITLE || '我的笔记';
        const content = args.CONTENT || '这是笔记内容';
        
        const mdContent = `# ${title}\n\n${content}\n\n---\n*创建时间: ${new Date().toLocaleString()}*`;
        const path = this.getFullPath(name, 'md');
        
        const success = await this.saveDocument(path, mdContent);
        if (success) {
            await this.notify('Markdown文档创建成功', `已保存到: ${path}`);
            console.log(`📝 Markdown文档已创建: ${path}`);
        } else {
            await this.notify('Markdown文档创建失败', '请检查权限和路径', false);
        }
    }

    // 创建 XML 文档
    async createXmlDocument(args) {
        if (!this.isDesktop) return;
        
        const name = args.NAME || '数据';
        const root = args.ROOT || 'root';
        const content = args.CONTENT || '<item>值</item>';
        
        const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<${root}>
    ${content}
</${root}>`;
        const path = this.getFullPath(name, 'xml');
        
        const success = await this.saveDocument(path, xmlContent);
        if (success) {
            await this.notify('XML文档创建成功', `已保存到: ${path}`);
            console.log(`📄 XML文档已创建: ${path}`);
        } else {
            await this.notify('XML文档创建失败', '请检查权限和路径', false);
        }
    }

    // 创建 JSON 文档
    async createJsonDocument(args) {
        if (!this.isDesktop) return;
        
        const name = args.NAME || '数据';
        let data = args.DATA || '{"key":"value"}';
        
        // 尝试格式化 JSON
        try {
            const parsed = JSON.parse(data);
            data = JSON.stringify(parsed, null, 2);
        } catch (e) {
            // 如果解析失败，保持原样
        }
        
        const path = this.getFullPath(name, 'json');
        const success = await this.saveDocument(path, data);
        
        if (success) {
            await this.notify('JSON文档创建成功', `已保存到: ${path}`);
            console.log(`📊 JSON文档已创建: ${path}`);
        } else {
            await this.notify('JSON文档创建失败', '请检查权限和路径', false);
        }
    }

    // 创建 HTML 文档
    async createHtmlDocument(args) {
        if (!this.isDesktop) return;
        
        const name = args.NAME || '网页';
        const title = args.TITLE || '我的网页';
        const content = args.CONTENT || '<h1>欢迎</h1><p>这是网页内容</p>';
        
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    ${content}
    <hr>
    <p style="color: #999; font-size: 12px;">创建时间: ${new Date().toLocaleString()}</p>
</body>
</html>`;
        
        const path = this.getFullPath(name, 'html');
        const success = await this.saveDocument(path, htmlContent);
        
        if (success) {
            await this.notify('HTML文档创建成功', `已保存到: ${path}`);
            console.log(`🌐 HTML文档已创建: ${path}`);
        } else {
            await this.notify('HTML文档创建失败', '请检查权限和路径', false);
        }
    }

    // 创建 CSV 文档
    async createCsvDocument(args) {
        if (!this.isDesktop) return;
        
        const name = args.NAME || '表格';
        const headers = args.HEADERS || '姓名,年龄,城市';
        const data = args.DATA || '张三,25,北京\n李四,30,上海';
        
        const csvContent = `${headers}\n${data}`;
        const path = this.getFullPath(name, 'csv');
        
        const success = await this.saveDocument(path, csvContent);
        if (success) {
            await this.notify('CSV文档创建成功', `已保存到: ${path}`);
            console.log(`📊 CSV文档已创建: ${path}`);
        } else {
            await this.notify('CSV文档创建失败', '请检查权限和路径', false);
        }
    }

    // 创建 YAML 文档
    async createYamlDocument(args) {
        if (!this.isDesktop) return;
        
        const name = args.NAME || '配置';
        const data = args.DATA || 'name: 项目\nversion: 1.0';
        
        const yamlContent = `# YAML 配置文件\n# 生成时间: ${new Date().toLocaleString()}\n\n${data}`;
        const path = this.getFullPath(name, 'yaml');
        
        const success = await this.saveDocument(path, yamlContent);
        if (success) {
            await this.notify('YAML文档创建成功', `已保存到: ${path}`);
            console.log(`📋 YAML文档已创建: ${path}`);
        } else {
            await this.notify('YAML文档创建失败', '请检查权限和路径', false);
        }
    }

    // ============================================================
    // 2. 模板和项目结构
    // ============================================================

    // 从模板创建
    async createFromTemplate(args) {
        if (!this.isDesktop) return;
        
        const templateName = args.TEMPLATE || 'report';
        const name = args.NAME || '文档';
        
        const template = this.templates[templateName];
        if (!template) {
            await this.notify('模板不存在', `找不到模板: ${templateName}`, false);
            return;
        }
        
        const path = this.getFullPath(name, template.extension);
        const success = await this.saveDocument(path, template.content);
        
        if (success) {
            await this.notify('模板文档创建成功', `已保存到: ${path}`);
            console.log(`📋 模板文档已创建: ${path} (${template.name})`);
        } else {
            await this.notify('模板文档创建失败', '请检查权限和路径', false);
        }
    }

    // 创建项目结构
    async createProjectStructure(args) {
        if (!this.isDesktop) return;
        
        const name = args.NAME || '我的项目';
        const type = args.TYPE || 'web';
        
        // 清理名称
        const cleanName = name.replace(/[<>:"/\\|?*]/g, '_');
        const basePath = `${this.outputPath}\\${cleanName}`;
        
        // 创建项目文件夹
        try {
            await EditorPreload.createFolder(basePath);
            
            // 根据不同项目类型创建结构
            const structures = {
                web: {
                    files: [
                        { name: 'index.html', content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cleanName}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>欢迎来到 ${cleanName}</h1>
    <script src="script.js"></script>
</body>
</html>` },
                        { name: 'style.css', content: `/* ${cleanName} 样式文件 */
body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}` },
                        { name: 'script.js', content: `// ${cleanName} JavaScript 文件
console.log('欢迎！');` },
                        { name: 'README.md', content: `# ${cleanName}\n\n项目描述...` }
                    ],
                    folders: ['css', 'js', 'images']
                },
                python: {
                    files: [
                        { name: 'main.py', content: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
${cleanName} - 主程序
"""

def main():
    print("欢迎来到 ${cleanName}")

if __name__ == "__main__":
    main()` },
                        { name: 'requirements.txt', content: `# 依赖列表\n# 生成时间: ${new Date().toLocaleString()}` },
                        { name: 'README.md', content: `# ${cleanName}\n\nPython 项目描述...` },
                        { name: 'setup.py', content: `from setuptools import setup, find_packages

setup(
    name='${cleanName}',
    version='1.0.0',
    packages=find_packages(),
    install_requires=[],
)` }
                    ],
                    folders: ['src', 'tests', 'docs']
                },
                docs: {
                    files: [
                        { name: 'README.md', content: `# ${cleanName}\n\n文档项目...` },
                        { name: 'index.md', content: `# 首页\n\n欢迎来到文档项目` },
                        { name: 'config.yaml', content: `# 文档配置
title: "${cleanName}"
version: "1.0.0"
author: "作者"
` }
                    ],
                    folders: ['docs', 'images', 'examples']
                },
                app: {
                    files: [
                        { name: 'README.md', content: `# ${cleanName}\n\n应用项目...` },
                        { name: 'config.json', content: `{
    "name": "${cleanName}",
    "version": "1.0.0",
    "author": "作者"
}` },
                        { name: 'main.js', content: `// ${cleanName} 主程序
console.log('欢迎来到 ${cleanName}');` }
                    ],
                    folders: ['src', 'dist', 'tests', 'docs']
                },
                tool: {
                    files: [
                        { name: 'README.md', content: `# ${cleanName}\n\n工具项目...` },
                        { name: 'index.js', content: `#!/usr/bin/env node\n// ${cleanName} 工具\nconsole.log('欢迎使用 ${cleanName}');` },
                        { name: 'package.json', content: `{
    "name": "${cleanName}",
    "version": "1.0.0",
    "description": "工具描述",
    "main": "index.js",
    "bin": {
        "${cleanName}": "./index.js"
    }
}` }
                    ],
                    folders: ['lib', 'bin', 'docs']
                }
            };
            
            const structure = structures[type] || structures.web;
            
            // 创建文件夹
            for (const folder of structure.folders) {
                await EditorPreload.createFolder(`${basePath}\\${folder}`);
            }
            
            // 创建文件
            for (const file of structure.files) {
                await EditorPreload.writeFile(`${basePath}\\${file.name}`, file.content);
            }
            
            await this.notify('✅ 项目结构创建成功', `已创建: ${basePath}`);
            console.log(`📁 项目结构已创建: ${basePath} (${type})`);
            
        } catch (error) {
            console.error('创建项目结构失败:', error.message);
            await this.notify('❌ 项目结构创建失败', error.message, false);
        }
    }

    // ============================================================
    // 3. 文档管理
    // ============================================================

    // 获取文档信息
    async getDocumentInfo(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.getFileStats(args.PATH);
            
            if (result.success) {
                const stats = result.stats;
                const ext = this.getFileType(args.PATH);
                const size = this.formatSize(stats.size);
                
                // 尝试读取内容预览
                let preview = '';
                try {
                    const readResult = await EditorPreload.readFile(args.PATH);
                    if (readResult.success) {
                        preview = readResult.content.substring(0, 200);
                        if (readResult.content.length > 200) preview += '...';
                    }
                } catch (e) {
                    preview = '[无法预览]';
                }
                
                return `📄 文档信息\n━━━━━━━━━━━━━━━━━━━━━\n📂 路径: ${args.PATH}\n📋 类型: ${ext}\n📦 大小: ${size}\n📅 创建: ${new Date(stats.created).toLocaleString()}\n✏️ 修改: ${new Date(stats.modified).toLocaleString()}\n\n📝 内容预览:\n${preview}`;
            } else {
                return `❌ ${result.error}`;
            }
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    // 列出文档
    async listDocuments(args) {
        if (!this.isDesktop) return '❌ 需要桌面版';
        
        try {
            const result = await EditorPreload.readLocalFolder(args.PATH);
            
            if (result.success) {
                const type = args.TYPE || 'all';
                const files = result.files || [];
                
                // 过滤文件类型
                let filtered = files.filter(f => !f.isDirectory);
                
                if (type !== 'all') {
                    filtered = filtered.filter(f => {
                        const ext = f.name.split('.').pop().toLowerCase();
                        return ext === type || 
                               (type === 'md' && ext === 'markdown') ||
                               (type === 'yaml' && (ext === 'yaml' || ext === 'yml'));
                    });
                }
                
                if (filtered.length === 0) {
                    return `📂 ${args.PATH}\n未找到 ${type === 'all' ? '任何' : type} 文档`;
                }
                
                let output = `📂 ${args.PATH}\n`;
                output += '━'.repeat(40) + '\n';
                output += `找到 ${filtered.length} 个文档:\n\n`;
                
                for (const file of filtered) {
                    const ext = file.name.split('.').pop().toLowerCase();
                    const icon = this.getFileIcon(ext);
                    const size = this.formatSize(file.size);
                    output += `${icon} ${file.name.padEnd(30)} ${size}\n`;
                }
                
                return output;
            } else {
                return `❌ ${result.error}`;
            }
        } catch (error) {
            return `❌ 异常: ${error.message}`;
        }
    }

    getFileIcon(ext) {
        const icons = {
            'txt': '📝',
            'md': '📝',
            'xml': '📄',
            'json': '📊',
            'html': '🌐',
            'htm': '🌐',
            'csv': '📊',
            'yaml': '📋',
            'yml': '📋',
            'js': '🔧',
            'py': '🐍',
            'css': '🎨',
            'jpg': '🖼️',
            'png': '🖼️',
            'gif': '🖼️',
            'pdf': '📕'
        };
        return icons[ext] || '📄';
    }

    // 打开文档
    async openDocument(args) {
        if (!this.isDesktop) return;
        
        try {
            const result = await EditorPreload.executeCommand(`start "" "${args.PATH}"`, {
                timeout: 5000
            });
            
            if (result.success) {
                console.log(`📂 已打开文档: ${args.PATH}`);
            } else {
                await this.notify('打开失败', result.error, false);
            }
        } catch (error) {
            console.error('打开文档失败:', error.message);
        }
    }

    // 转换文档格式
    async convertDocument(args) {
        if (!this.isDesktop) return;
        
        const sourcePath = args.SOURCE;
        const targetType = args.TARGET || 'md';
        
        try {
            // 读取源文件
            const readResult = await EditorPreload.readFile(sourcePath);
            if (!readResult.success) {
                await this.notify('读取源文件失败', readResult.error, false);
                return;
            }
            
            const content = readResult.content;
            const sourceExt = sourcePath.split('.').pop().toLowerCase();
            const targetExt = targetType === 'md' ? 'md' : targetType;
            
            // 转换内容
            let converted = content;
            let targetName = sourcePath.replace(`.${sourceExt}`, `.${targetExt}`);
            
            // 根据目标类型转换
            if (targetType === 'md') {
                // 转换其他格式到 Markdown
                if (sourceExt === 'txt') {
                    converted = `# 转换自 TXT\n\n${content}`;
                } else if (sourceExt === 'json') {
                    try {
                        const data = JSON.parse(content);
                        converted = `# JSON 数据\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
                    } catch (e) {
                        // 保持原样
                    }
                } else if (sourceExt === 'xml') {
                    converted = `# XML 数据\n\n\`\`\`xml\n${content}\n\`\`\``;
                }
            } else if (targetType === 'json') {
                // 尝试转换为 JSON
                if (sourceExt === 'md' || sourceExt === 'txt') {
                    const lines = content.split('\n').filter(l => l.trim());
                    if (lines.length > 0) {
                        const data = {
                            title: lines[0] || '文档',
                            content: lines.slice(1).join('\n'),
                            converted: new Date().toISOString()
                        };
                        converted = JSON.stringify(data, null, 2);
                    }
                }
            } else if (targetType === 'html') {
                converted = `<!DOCTYPE html>
<html>
<head><title>文档</title></head>
<body>
<pre>${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;
            }
            
            // 保存转换后的文件
            const result = await EditorPreload.writeFile(targetName, converted);
            
            if (result.success) {
                await this.notify('✅ 文档转换成功', `已保存到: ${targetName}`);
                console.log(`🔄 文档已转换: ${sourcePath} -> ${targetName}`);
            } else {
                await this.notify('❌ 转换失败', result.error, false);
            }
            
        } catch (error) {
            console.error('转换失败:', error.message);
            await this.notify('❌ 转换失败', error.message, false);
        }
    }

    // ============================================================
    // 4. 批量操作
    // ============================================================

    // 批量创建文档
    async batchCreateDocuments(args) {
        if (!this.isDesktop) return;
        
        const names = args.NAMES || '文档1,文档2,文档3';
        const type = args.TYPE || 'txt';
        
        const nameList = names.split(',').map(n => n.trim()).filter(n => n);
        
        if (nameList.length === 0) {
            await this.notify('请输入文档名称', '用逗号分隔多个名称', false);
            return;
        }
        
        let successCount = 0;
        
        for (const name of nameList) {
            const path = this.getFullPath(name, type);
            const content = `# ${name}\n\n创建时间: ${new Date().toLocaleString()}\n\n这是 ${type} 文档内容`;
            
            const success = await this.saveDocument(path, content);
            if (success) successCount++;
        }
        
        await this.notify(
            '✅ 批量创建完成',
            `成功创建 ${successCount}/${nameList.length} 个文档`
        );
        console.log(`📚 批量创建完成: ${successCount}/${nameList.length}`);
    }

    // 创建文档包
    async createDocumentPack(args) {
        if (!this.isDesktop) return;
        
        const name = args.NAME || '文档包';
        const files = args.FILES || 'README.md,LICENSE.txt,config.json';
        
        const fileList = files.split(',').map(f => f.trim()).filter(f => f);
        
        if (fileList.length === 0) {
            await this.notify('请指定文件列表', '用逗号分隔多个文件', false);
            return;
        }
        
        const packPath = `${this.outputPath}\\${name.replace(/[<>:"/\\|?*]/g, '_')}`;
        
        try {
            await EditorPreload.createFolder(packPath);
            
            for (const file of fileList) {
                const ext = file.split('.').pop().toLowerCase();
                const content = this.generateDefaultContent(file, ext);
                await EditorPreload.writeFile(`${packPath}\\${file}`, content);
            }
            
            // 创建包信息文件
            const info = `# 文档包: ${name}\n\n创建时间: ${new Date().toLocaleString()}\n\n包含文件:\n${fileList.map(f => `- ${f}`).join('\n')}`;
            await EditorPreload.writeFile(`${packPath}\\PACK_INFO.md`, info);
            
            await this.notify('✅ 文档包创建成功', `已创建: ${packPath}`);
            console.log(`📦 文档包已创建: ${packPath}`);
            
        } catch (error) {
            console.error('创建文档包失败:', error.message);
            await this.notify('❌ 文档包创建失败', error.message, false);
        }
    }

    generateDefaultContent(filename, ext) {
        const date = new Date().toLocaleString();
        const contentMap = {
            'md': `# ${filename.replace('.md', '')}\n\n文档内容...\n\n---\n*创建时间: ${date}*`,
            'txt': `文档: ${filename}\n创建时间: ${date}\n\n内容...`,
            'json': `{\n    "name": "${filename}",
    "created": "${new Date().toISOString()}",
    "data": {}\n}`,
            'xml': `<?xml version="1.0"?>\n<root>\n    <!-- ${filename} -->\n</root>`,
            'html': `<!DOCTYPE html>\n<html>\n<head><title>${filename}</title></head>\n<body>\n<h1>${filename}</h1>\n</body>\n</html>`,
            'yaml': `# ${filename}\nname: "项目"\nversion: "1.0"\ncreated: "${new Date().toISOString()}"`,
            'csv': `标题1,标题2,标题3\n数据1,数据2,数据3`
        };
        return contentMap[ext] || `# ${filename}\n\n内容...`;
    }

    // ============================================================
    // 5. 文档内容操作
    // ============================================================

    // 追加内容到文档
    async appendToDocument(args) {
        if (!this.isDesktop) return;
        
        const path = args.PATH;
        const content = args.CONTENT || '';
        
        try {
            const readResult = await EditorPreload.readFile(path);
            const existing = readResult.success ? readResult.content : '';
            const newContent = existing ? `${existing}\n${content}` : content;
            
            const result = await EditorPreload.writeFile(path, newContent);
            if (result.success) {
                console.log(`📝 已追加内容到: ${path}`);
            } else {
                await this.notify('追加失败', result.error, false);
            }
        } catch (error) {
            console.error('追加失败:', error.message);
        }
    }

    // 插入内容到指定行
    async insertToDocument(args) {
        if (!this.isDesktop) return;
        
        const path = args.PATH;
        const lineNum = Math.max(0, Number(args.LINE) || 1);
        const content = args.CONTENT || '';
        
        try {
            const readResult = await EditorPreload.readFile(path);
            if (!readResult.success) {
                await this.notify('读取失败', readResult.error, false);
                return;
            }
            
            const lines = readResult.content.split('\n');
            const insertIndex = Math.min(lineNum - 1, lines.length);
            lines.splice(insertIndex, 0, content);
            
            const result = await EditorPreload.writeFile(path, lines.join('\n'));
            if (result.success) {
                console.log(`📝 已插入内容到: ${path} (行 ${lineNum})`);
            } else {
                await this.notify('插入失败', result.error, false);
            }
        } catch (error) {
            console.error('插入失败:', error.message);
        }
    }

    // ============================================================
    // 6. 自动生成文档
    // ============================================================

    // 生成项目文档
    async generateDocumentation(args) {
        if (!this.isDesktop) return;
        
        const projectName = args.PROJECT_NAME || '我的项目';
        const author = args.AUTHOR || '作者';
        
        const date = new Date().toLocaleString();
        const docs = [
            {
                name: 'README.md',
                content: `# ${projectName}

## 项目简介
这是 ${projectName} 的文档。

## 作者
${author}

## 版本
1.0.0

## 创建时间
${date}

## 功能
- 功能1
- 功能2
- 功能3

## 安装
\`\`\`bash
npm install
\`\`\`

## 使用
\`\`\`bash
npm start
\`\`\`
`
            },
            {
                name: 'package.json',
                content: `{
    "name": "${projectName.toLowerCase().replace(/ /g, '-')}",
    "version": "1.0.0",
    "description": "${projectName} 项目",
    "author": "${author}",
    "license": "MIT",
    "scripts": {
        "start": "node index.js",
        "test": "echo \\"Error: no test specified\\" && exit 1"
    },
    "dependencies": {}
}`
            },
            {
                name: 'CHANGELOG.md',
                content: `# 更新日志

## [1.0.0] - ${new Date().toISOString().split('T')[0]}
### 新增
- 初始化项目
- 创建文档结构

### 修复
- 无

### 变更
- 无
`
            },
            {
                name: 'CONTRIBUTING.md',
                content: `# 贡献指南

感谢您对 ${projectName} 项目的关注！

## 如何贡献
1. Fork 本仓库
2. 创建您的功能分支
3. 提交您的修改
4. 推送到分支
5. 创建 Pull Request

## 代码规范
- 使用 ESLint
- 遵循 Git 提交规范

## 联系方式
${author} - 邮箱
`
            },
            {
                name: 'LICENSE',
                content: `MIT License

Copyright (c) ${new Date().getFullYear()} ${author}

Permission is hereby granted, free of charge, to any person obtaining a copy...
`
            }
        ];
        
        const projectPath = `${this.outputPath}\\${projectName.replace(/[<>:"/\\|?*]/g, '_')}`;
        
        try {
            await EditorPreload.createFolder(projectPath);
            
            for (const doc of docs) {
                await EditorPreload.writeFile(`${projectPath}\\${doc.name}`, doc.content);
            }
            
            await this.notify('✅ 文档生成成功', `已创建: ${projectPath}`);
            console.log(`📚 文档已生成: ${projectPath}`);
            
        } catch (error) {
            console.error('生成文档失败:', error.message);
            await this.notify('❌ 文档生成失败', error.message, false);
        }
    }

    // 创建 README
    async createReadme(args) {
        if (!this.isDesktop) return;
        
        const project = args.PROJECT || '我的项目';
        const description = args.DESCRIPTION || '项目描述';
        
        const readmeContent = `# ${project}

## 📖 简介
${description}

## ✨ 功能特点
- 功能1
- 功能2
- 功能3

## 🚀 快速开始

### 安装
\`\`\`bash
npm install
\`\`\`

### 使用
\`\`\`bash
npm start
\`\`\`

## 📁 项目结构
\`\`\`
.
├── src/          # 源代码
├── tests/        # 测试文件
├── docs/         # 文档
└── README.md     # 项目说明
\`\`\`

## 📝 许可证
MIT

## 👤 作者
作者名

---
*生成时间: ${new Date().toLocaleString()}*
`;
        
        const path = `${this.outputPath}\\README_${project.replace(/[<>:"/\\|?*]/g, '_')}.md`;
        const success = await this.saveDocument(path, readmeContent);
        
        if (success) {
            await this.notify('✅ README创建成功', `已保存到: ${path}`);
            console.log(`📖 README已创建: ${path}`);
        } else {
            await this.notify('❌ README创建失败', '请检查权限和路径', false);
        }
    }

    // ============================================================
    // 7. 设置
    // ============================================================

    async setOutputPath(args) {
        if (!this.isDesktop) return;
        
        this.outputPath = args.PATH || '%DESKTOP%';
        await this.notify('✅ 路径已设置', this.outputPath);
        console.log(`📂 输出路径已设置为: ${this.outputPath}`);
    }

    async getOutputPath() {
        return this.outputPath || '%DESKTOP%';
    }

    async getLastCreated() {
        if (!this.lastCreated) {
            return '📄 尚未创建任何文档';
        }
        return `📄 最后创建: ${this.lastCreated.path}\n⏱️ 时间: ${new Date(this.lastCreated.time).toLocaleString()}`;
    }

    // ============================================================
    // 清理资源
    // ============================================================
    dispose() {
        console.log('🧹 文档创建器已清理');
    }
}

// ============================================================
// 注册扩展
// ============================================================
if (typeof Scratch !== 'undefined') {
    const extension = new DocumentCreatorExtension();
    Scratch.extensions.register(extension);
    
    console.log('📄 文档创建器扩展已加载！');
    console.log('📋 支持格式: TXT, MD, XML, JSON, HTML, CSV, YAML');
    console.log('📂 输出路径: %DESKTOP%');
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentCreatorExtension;
}