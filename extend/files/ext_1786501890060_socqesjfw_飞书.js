(function (_Scratch) {
    const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = _Scratch;

    translate.setup({
        zh: {
            'extensionName': '飞书',
            'docsUrl': 'https://learn.ccw.site/article/e895cb95-cc0c-47a0-9bbb-a5aabf82750d',
            
            // 消息标签
            'tag.message': '📰 消息',
            
            // 消息相关块
            'block.triggerWebhook.message': '触发群机器人webhook [ID] 并发送文本 [TEXT]',
            'block.triggerWebhook.atUser': '触发webhook [ID] 并@[USER_NAME]([USER_ID]) 发送文本 [TEXT]',
            'block.triggerWebhook.image': '触发webhook [ID] 并发送图像 [IMAGE_KEY]',
            'block.triggerWebhook.card': '触发webhook [ID] 并发送卡片 [CARD_ID]',
            
            // 卡片标签
            'tag.card': '🔖 卡片',
            
            // 卡片相关块
            'block.card.set': '设置卡片 [ID] 的 [TYPE] 为 [DATA]',
            'block.card.create': '创建卡片 [ID]',
            'block.card.join': '将组件 [TYPE] 参数 [DATA] 添加到卡片 [ID]',
            'block.card.remove': '移除卡片 [ID] 的 [TYPE] 组件',
            
            // 卡片菜单
            'menu.card.set.template': '头部模板',
            'menu.card.set.title': '头部标题',
            'menu.card.set.config': '卡片配置',
            'menu.card.remove.last': '最后一个',
            'menu.card.remove.all': '所有',
            'menu.card.component.div': '容器',
            'menu.card.component.markdown': 'MarkDown',
            'menu.card.component.plain_text': '文本',
            'menu.card.component.img': '图片',
            'menu.card.component.hr': '分割线',
            'menu.card.component.action': '按钮',
            'menu.card.component.lark_md': '富文本',
            'menu.card.component.note': '备注',
            
            // 捷径标签
            'tag.shortcut': '✈ 捷径',
            'block.triggerWebhook.json': '触发捷径webhook [ID] 并传参 [DATA]',
            
            'defaultValue.text': '你好！',
            'resultMessage.emptyMenu': '没有内容',
            'block.switch': '[STATE] 请求'
        },
        en: {
            'extensionName': 'Feishu',
            'docsUrl': 'https://learn.ccw.site/article/e895cb95-cc0c-47a0-9bbb-a5aabf82750d',
            
            'tag.message': '📰 Message',
            'block.triggerWebhook.message': 'Trigger Group Custom Bot WebHook [ID] With Send Text [TEXT]',
            'block.triggerWebhook.atUser': 'Trigger Group Custom Bot WebHook [ID] With @[USER_NAME]([USER_ID]) And Send Text [TEXT]',
            'block.triggerWebhook.image': 'Trigger Group Custom Bot WebHook [ID] With Send Image [IMAGE_KEY]',
            'block.triggerWebhook.card': 'Trigger Group Custom Bot WebHook [ID] With Send Card [CARD_ID]',
            
            'tag.card': '🔖 Card',
            'block.card.set': 'Set Card [ID] `s [TYPE] To [DATA]',
            'block.card.create': 'Create Card [ID]',
            'block.card.join': 'Add Commponent [TYPE] Params [DATA] To Card [ID]',
            'block.card.remove': 'Remove Card [ID] `S [TYPE] Commponent(s)',
            
            'menu.card.set.template': 'HeaderTemplate',
            'menu.card.set.title': 'HeaderTitle',
            'menu.card.set.config': 'CardConfig',
            'menu.card.remove.last': 'Last',
            'menu.card.remove.all': 'All',
            'menu.card.component.div': 'Container',
            'menu.card.component.markdown': 'MarkDown',
            'menu.card.component.plain_text': 'Text',
            'menu.card.component.img': 'Image',
            'menu.card.component.hr': 'Divider',
            'menu.card.component.action': 'Button',
            'menu.card.component.lark_md': 'Rich Text',
            'menu.card.component.note': 'Note',
            
            'tag.shortcut': '✈ Shortcut',
            'block.triggerWebhook.json': 'Trigger Shortcut Bot webhook [ID] With Params [DATA]',
            
            'defaultValue.text': 'Hello!',
            'resultMessage.emptyMenu': 'Has no content',
            'block.switch': '[STATE] Request'
        }
    });

    class FeishuExtension {
        constructor (_runtime) {
            this._runtime = _runtime;
            this.requestSwitch = false;
            
            // 存储卡片数据
            this.customCards = {
                myCard: {
                    config: {},
                    elements: [
                        {
                            tag: "div",
                            text: {
                                content: "**内容**",
                                tag: "lark_md"
                            }
                        }
                    ],
                    header: {
                        template: "blue",
                        title: {
                            content: "我的卡片",
                            tag: "plain_text"
                        }
                    }
                }
            };
        }

        /**
         * 获取翻译文本
         */
        fm (key) {
            return translate({id: key});
        }

        /**
         * 克隆报告器块
         */
        cloneReporterBlocks (blocks, blockTypes, hiddenTypes, targetType) {
            const result = [];
            if (typeof blocks !== 'object' || typeof blockTypes !== 'object') {
                return result;
            }

            blocks.forEach(block => {
                for (const typeKey in blockTypes) {
                    const blockType = blockTypes[typeKey];
                    if (block.opcode && block.blockType) {
                        const isTarget = targetType === blockType;
                        const newBlock = {
                            ...block,
                            opcode: isTarget ? block.opcode : block.opcode + blockType,
                            blockType: blockType,
                            hideFromPalette: hiddenTypes.includes(blockType)
                        };
                        
                        // 动态绑定方法
                        const methodName = isTarget ? block.opcode : block.opcode + blockType;
                        this[methodName] = this[block.opcode];
                        
                        result.push(newBlock);
                    }
                }
            });
            
            return result;
        }

        /**
         * @return {object} 扩展元数据
         */
        getInfo () {
            // 定义消息块模板
            const messageBlock = {
                opcode: 'triggerWebhookMessage',
                blockType: BlockType.REPORTER,
                hideFromPalette: true,
                text: translate({id: 'block.triggerWebhook.message'}),
                arguments: {
                    ID: {
                        type: ArgumentType.STRING,
                        defaultValue: ''
                    },
                    TEXT: {
                        type: ArgumentType.STRING,
                        defaultValue: translate({id: 'defaultValue.text'})
                    }
                }
            };

            const atUserBlock = {
                opcode: 'triggerWebhookAtUser',
                blockType: BlockType.REPORTER,
                hideFromPalette: true,
                text: translate({id: 'block.triggerWebhook.atUser'}),
                arguments: {
                    ID: {
                        type: ArgumentType.STRING,
                        defaultValue: ''
                    },
                    USER_ID: {
                        type: ArgumentType.STRING,
                        defaultValue: 'all'
                    },
                    USER_NAME: {
                        type: ArgumentType.STRING,
                        defaultValue: '所有人'
                    },
                    TEXT: {
                        type: ArgumentType.STRING,
                        defaultValue: translate({id: 'defaultValue.text'})
                    }
                }
            };

            const imageBlock = {
                opcode: 'triggerWebhookImage',
                blockType: BlockType.REPORTER,
                hideFromPalette: true,
                text: translate({id: 'block.triggerWebhook.image'}),
                arguments: {
                    ID: {
                        type: ArgumentType.STRING,
                        defaultValue: ''
                    },
                    IMAGE_KEY: {
                        type: ArgumentType.STRING,
                        defaultValue: 'img_v3_025j_16d1594a-f4d1-455f-a339-a1c5cfb24deg'
                    }
                }
            };

            const cardBlock = {
                opcode: 'triggerWebhookCard',
                blockType: BlockType.REPORTER,
                hideFromPalette: true,
                text: translate({id: 'block.triggerWebhook.card'}),
                arguments: {
                    ID: {
                        type: ArgumentType.STRING,
                        defaultValue: ''
                    },
                    CARD_ID: {
                        type: ArgumentType.STRING,
                        menu: 'CARD_ID'
                    }
                }
            };

            // 卡片操作块
            const cardCreate = {
                opcode: 'cardCreate',
                blockType: BlockType.COMMAND,
                text: translate({id: 'block.card.create'}),
                arguments: {
                    ID: {
                        type: ArgumentType.STRING,
                        defaultValue: 'myCard1'
                    }
                }
            };

            const cardSet = {
                opcode: 'cardSet',
                blockType: BlockType.COMMAND,
                text: translate({id: 'block.card.set'}),
                arguments: {
                    ID: {
                        type: ArgumentType.STRING,
                        menu: 'CARD_ID'
                    },
                    TYPE: {
                        type: ArgumentType.STRING,
                        menu: 'CARD_CONFIG_TYPE'
                    },
                    DATA: {
                        type: ArgumentType.STRING,
                        defaultValue: '{"wide_screen_mode":true}'
                    }
                }
            };

            const cardJoin = {
                opcode: 'cardJoin',
                blockType: BlockType.COMMAND,
                text: translate({id: 'block.card.join'}),
                arguments: {
                    TYPE: {
                        type: ArgumentType.STRING,
                        menu: 'CARD_COMPONENT_TYPE'
                    },
                    DATA: {
                        type: ArgumentType.STRING,
                        defaultValue: '{"content":"我的卡片"}'
                    },
                    ID: {
                        type: ArgumentType.STRING,
                        menu: 'CARD_ID'
                    }
                }
            };

            const cardRemove = {
                opcode: 'cardRemove',
                blockType: BlockType.COMMAND,
                text: translate({id: 'block.card.remove'}),
                arguments: {
                    ID: {
                        type: ArgumentType.STRING,
                        menu: 'CARD_ID'
                    },
                    TYPE: {
                        type: ArgumentType.STRING,
                        menu: 'CARD_REMOVE_TYPE'
                    }
                }
            };

            // 捷径块
            const jsonBlock = {
                opcode: 'triggerWebhookJson',
                blockType: BlockType.REPORTER,
                hideFromPalette: true,
                text: translate({id: 'block.triggerWebhook.json'}),
                arguments: {
                    ID: {
                        type: ArgumentType.STRING,
                        defaultValue: ''
                    },
                    DATA: {
                        type: ArgumentType.STRING,
                        defaultValue: '{}'
                    }
                }
            };

            // 开关块
            const switchBlock = {
                opcode: 'switchRequest',
                blockType: BlockType.COMMAND,
                text: translate({id: 'block.switch'}),
                arguments: {
                    STATE: {
                        type: ArgumentType.STRING,
                        menu: 'SWITCH_LIST'
                    }
                }
            };

            // 克隆报告器块
            const reporterBlocks = this.cloneReporterBlocks(
                [messageBlock, atUserBlock, imageBlock, cardBlock],
                [BlockType.REPORTER, BlockType.COMMAND],
                [BlockType.REPORTER],
                BlockType.REPORTER
            );

            const shortcutBlocks = this.cloneReporterBlocks(
                [jsonBlock],
                [BlockType.REPORTER, BlockType.COMMAND],
                [BlockType.REPORTER],
                BlockType.REPORTER
            );

            return {
                id: 'feishu',
                name: translate({id: 'extensionName'}),
                docsURI: translate({id: 'docsUrl'}),
                color1: '#8eace1',
                color2: '#86a2d4',
                blocks: [
                    switchBlock,
                    `---${translate({id: 'tag.message'})}`,
                    ...reporterBlocks,
                    `---${translate({id: 'tag.card'})}`,
                    cardCreate,
                    cardSet,
                    cardJoin,
                    cardRemove,
                    `---${translate({id: 'tag.shortcut'})}`,
                    ...shortcutBlocks
                ],
                menus: {
                    CARD_ID: {
                        acceptReporters: false,
                        items: '__cardIdMenu'
                    },
                    CARD_CONFIG_TYPE: [
                        {text: translate({id: 'menu.card.set.template'}), value: 'template'},
                        {text: translate({id: 'menu.card.set.title'}), value: 'title'},
                        {text: translate({id: 'menu.card.set.config'}), value: 'config'}
                    ],
                    CARD_COMPONENT_TYPE: [
                        {text: translate({id: 'menu.card.component.div'}), value: 'div'},
                        {text: translate({id: 'menu.card.component.markdown'}), value: 'markdown'},
                        {text: translate({id: 'menu.card.component.plain_text'}), value: 'plain_text'},
                        {text: translate({id: 'menu.card.component.img'}), value: 'img'},
                        {text: translate({id: 'menu.card.component.hr'}), value: 'hr'},
                        {text: translate({id: 'menu.card.component.action'}), value: 'action'},
                        {text: translate({id: 'menu.card.component.lark_md'}), value: 'lark_md'},
                        {text: translate({id: 'menu.card.component.note'}), value: 'note'}
                    ],
                    CARD_REMOVE_TYPE: [
                        {text: translate({id: 'menu.card.remove.last'}), value: 'last'},
                        {text: translate({id: 'menu.card.remove.all'}), value: 'all'}
                    ],
                    SWITCH_LIST: ['on', 'off']
                }
            };
        }

        /**
         * 动态菜单 - 卡片ID列表
         */
        __cardIdMenu () {
            const keys = Object.keys(this.customCards);
            if (keys.length > 0) {
                return keys.map(key => ({
                    text: key,
                    value: key
                }));
            }
            return [{
                text: translate({id: 'resultMessage.emptyMenu'}),
                value: ''
            }];
        }

        /**
         * 切换请求开关
         */
        switchRequest (args) {
            const state = Cast.toString(args.STATE);
            this.requestSwitch = state === 'on';
        }

        /**
         * 发送文本消息
         */
        triggerWebhookMessage (args) {
            const id = Cast.toString(args.ID);
            const text = Cast.toString(args.TEXT);
            
            if (id && text && this.requestSwitch) {
                fetch(`https://open.feishu.cn/open-apis/bot/v2/hook/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        msg_type: 'text',
                        content: {
                            text: text
                        }
                    })
                });
            }
        }

        /**
         * 发送@用户消息
         */
        triggerWebhookAtUser (args) {
            const id = Cast.toString(args.ID);
            const userId = Cast.toString(args.USER_ID);
            const userName = Cast.toString(args.USER_NAME);
            const text = Cast.toString(args.TEXT);
            
            if (id && userId && userName && text && this.requestSwitch) {
                const atText = userId === 'all' 
                    ? `<at user_id="all">所有人</at> ${text}`
                    : `<at user_id="${userId}">${userName}</at> ${text}`;
                
                fetch(`https://open.feishu.cn/open-apis/bot/v2/hook/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        msg_type: 'text',
                        content: {
                            text: atText
                        }
                    })
                });
            }
        }

        /**
         * 发送图片消息
         */
        triggerWebhookImage (args) {
            const id = Cast.toString(args.ID);
            const imageKey = Cast.toString(args.IMAGE_KEY);
            
            if (id && imageKey && this.requestSwitch) {
                fetch(`https://open.feishu.cn/open-apis/bot/v2/hook/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        msg_type: 'image',
                        content: {
                            image_key: imageKey
                        }
                    })
                });
            }
        }

        /**
         * 发送卡片消息
         */
        triggerWebhookCard (args) {
            const id = Cast.toString(args.ID);
            const cardId = Cast.toString(args.CARD_ID);
            
            if (id && cardId && cardId in this.customCards && this.requestSwitch) {
                fetch(`https://open.feishu.cn/open-apis/bot/v2/hook/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        msg_type: 'interactive',
                        card: this.customCards[cardId]
                    })
                });
            }
        }

        /**
         * 创建卡片
         */
        cardCreate (args) {
            const id = Cast.toString(args.ID);
            if (id) {
                this.customCards[id] = {
                    config: {},
                    elements: [],
                    header: {
                        template: 'blue',
                        title: {
                            content: '未命名卡片',
                            tag: 'plain_text'
                        }
                    }
                };
            }
        }

        /**
         * 设置卡片属性
         */
        cardSet (args) {
            const id = Cast.toString(args.ID);
            const type = Cast.toString(args.TYPE);
            const data = Cast.toString(args.DATA);
            
            if (id && type && data && id in this.customCards) {
                try {
                    switch (type) {
                        case 'template':
                            this.customCards[id].header.template = data;
                            break;
                        case 'title':
                            this.customCards[id].header.title.content = data;
                            break;
                        case 'config':
                            this.customCards[id].config = JSON.parse(data) || {};
                            break;
                    }
                } catch (e) {
                    console.error('Feishu parse card failed', e);
                }
            }
        }

        /**
         * 添加卡片组件
         */
        cardJoin (args) {
            const type = Cast.toString(args.TYPE);
            const data = Cast.toString(args.DATA);
            const id = Cast.toString(args.ID);
            
            if (type && data && id && id in this.customCards) {
                try {
                    const parsedData = JSON.parse(data) || {};
                    this.customCards[id].elements.push({
                        tag: type,
                        ...parsedData
                    });
                } catch (e) {
                    console.error('Feishu parse card failed', e);
                }
            }
        }

        /**
         * 移除卡片组件
         */
        cardRemove (args) {
            const id = Cast.toString(args.ID);
            const type = Cast.toString(args.TYPE);
            
            if (id && id in this.customCards && type) {
                if (type === 'last') {
                    this.customCards[id].elements = this.customCards[id].elements.slice(0, -1);
                }
                if (type === 'all') {
                    this.customCards[id].elements = [];
                }
            }
        }

        /**
         * 触发捷径webhook
         */
        triggerWebhookJson (args) {
            const id = Cast.toString(args.ID);
            let data = Cast.toString(args.DATA);
            
            if (data && id && this.requestSwitch) {
                try {
                    data = JSON.parse(data) || {};
                } catch (e) {
                    console.error('Feishu parse JSON failed', e);
                }
                
                fetch(`https://www.feishu.cn/flow/api/trigger-webhook/${id}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    cors: true,
                    body: JSON.stringify(data)
                });
            }
        }
    }

    extensions.register(new FeishuExtension(runtime));

}(Scratch));