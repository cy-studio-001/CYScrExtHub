// Name: 并行音频Plus v0.0.0
// ID: parallelSoundPlus
// Description: 允许你高效地播放同一个音频多次
// By: 大尾巴奇@CCW.SITE

((Scratch) => { 
    'use strict'; 
    const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = Scratch;
    const extensionIcon = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNTkuNzI1NjgiIGhlaWdodD0iMTU5IiB2aWV3Qm94PSIwLDAsMTU5LjcyNTY4LDE1OSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI0MC4xMzcxNiwtMTAwLjUpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMzU3LjM1NzI0LDE4Mi4yNDAyMWMtMy41Mzc5Niw3LjExOTQxIC0xLjkyMTc3LDguNDg0NTMgLTUuOTc4MDcsMjIuNDY3OTFjLTEuNjc1NywyLjU5Mjg1IC0zLjQxODA0LDIuNTYxMTMgLTUuOTA3NTEsLTEuMzA1MTNjLTYuMjE1MTksLTkuNjUyNDcgLTguNTYxMSwtMjYuNjQxNzkgLTEyLjAwNTQ1LC0yNy44NDg5Yy0zLjUwNDA2LC0xLjIyODAzIC0yLjk1MTk0LDE3LjY4MjU4IC01Ljg2ODg1LDIxLjY1Njg5Yy00LjgwNDQyLDYuNTQ2MDcgLTYuMzc3OTUsOC43NzA4IC0xMC4wNzkyNSw3LjQ3NDk4Yy0zLjcwMTMsLTEuMjk1ODMgLTQuMTMyNTksLTE0LjEyMjMzIC0xMC44OTI1NSwtMTQuOTA0MzFjLTIuMjk0NTMsLTAuMjY1NDMgLTMuNTI3NjEsMTYuNzk0MTkgLTguNzU3NiwxNS44MDU5M2MtMy4zMjEzMiwtMC42Mjc2IC01LjA0OTA0LC01LjIxMDIxIC0xMS40MDQyLC03LjM1NDMxYy02LjczMzcyLC0yLjI3MTgzIC01LjI0ODU4LC0xNC4yMTMzNiAtNy45NTExLC0xMi4zMDY3NGMtMy42MDQ4MywtMjQuMzUyNTUgLTM4LjM3NTUsLTI3Ljg1MjIzIC0zOC4zNzU1LC0yNy44NTIyM2MwLDAgMzcuODA0ODQsLTQuMTYwMTEgMzguMzYzNTQsLTE4Ljg5OTc0YzMuNzIwMzksLTAuOTg5NTMgMS45OTA1NiwtNi42NzM3NyA1LjMwNjM4LC05Ljc0NzY2YzMuMzE1ODMsLTMuMDczOSAxMC4zNTU5NCwtOC4yMTYzNyAxNC44MTE0MSwtOS4zMTMxM2MzLjMxNTgzLC0wLjgxNjIzIDMuMDUwMywxNi4xOTM3NyA3Ljg3OTE0LDE2LjM0Mjg1YzQuODI4ODUsMC4xNDkwOCA3Ljk2MDAyLC0xMi44MTg4NyAxMi43MjgzMSwtMTQuODY2NjZjMi4yMzExNiwtMC45NTgxOCA1LjEyODYxLDEuNDA5OTYgOC43NzQ1Miw3LjIxNjA2YzMuMjA2ODQsNS4xMDY4OSAyLjQzNjY0LDIwLjIzNjg4IDUuMDczNTUsMjEuNzU4MTJjMy4wMTQ2NCwxLjczOTE3IDkuMTg2NjcsLTMwLjMxMTI4IDE1Ljg5MTE2LC0zMC4yNDM0MmM3LjE1NTA5LDAuMDcyNDEgMS44NjIxOSwxNC41OTg3MSA4Ljk3MDAxLDIzLjEyNTg5YzcuMDgyMzMsOC40OTY1OSA0MS42Nzc2NiwxNi45ODY3MSA0MS42Nzc2NiwxNi45ODY3MWMwLDAgLTMyLjAxNzc2LDEuMjA1NDMgLTQyLjI1NTU2LDIxLjgwNjkxeiIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aW5kZXgmcXVvdDs6bnVsbH0iIGZpbGwtb3BhY2l0eT0iMC41MjU0OSIgZmlsbD0iI2ZhNjQwMCIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjgyLjY0Mjc1LDE3Ny43NTk3OWMzLjUzNzk2LC03LjExOTQxIDEuOTIxNzcsLTguNDg0NTMgNS45NzgwNywtMjIuNDY3OTFjMS42NzU3LC0yLjU5Mjg1IDMuNDE4MDQsLTIuNTYxMTMgNS45MDc1MSwxLjMwNTEzYzYuMjE1Miw5LjY1MjQ3IDguNTYxMTEsMjYuNjQxNzkgMTIuMDA1NDYsMjcuODQ4OWMzLjUwNDA2LDEuMjI4MDMgMi45NTE5NCwtMTcuNjgyNTggNS44Njg4NSwtMjEuNjU2ODljNC44MDQ0MSwtNi41NDYwNyA2LjM3Nzk1LC04Ljc3MDggMTAuMDc5MjUsLTcuNDc0OThjMy43MDEzLDEuMjk1ODMgNC4xMzI2LDE0LjEyMjMzIDEwLjg5MjU1LDE0LjkwNDMxYzIuMjk0NTIsMC4yNjU0MyAzLjUyNzYxLC0xNi43OTQxOSA4Ljc1NzYsLTE1LjgwNTkzYzMuMzIxMzIsMC42Mjc2IDUuMDQ5MDUsNS4yMTAyMSAxMS40MDQyLDcuMzU0MzFjNi43MzM3MiwyLjI3MTgzIDUuMjQ4NTgsMTQuMjEzMzYgNy45NTExLDEyLjMwNjc0YzMuNjA0ODMsMjQuMzUyNTUgMzguMzc1NSwyNy44NTIyMyAzOC4zNzU1LDI3Ljg1MjIzYzAsMCAtMzcuODA0ODQsNC4xNjAxMSAtMzguMzYzNTQsMTguODk5NzRjLTMuNzIwMzgsMC45ODk1MyAtMS45OTA1Niw2LjY3Mzc3IC01LjMwNjM4LDkuNzQ3NjZjLTMuMzE1ODMsMy4wNzM5IC0xMC4zNTU5NCw4LjIxNjM3IC0xNC44MTE0MSw5LjMxMzEzYy0zLjMxNTgzLDAuODE2MjMgLTMuMDUwMjksLTE2LjE5Mzc3IC03Ljg3OTE0LC0xNi4zNDI4NWMtNC44Mjg4NSwtMC4xNDkwOCAtNy45NjAwMywxMi44MTg4NyAtMTIuNzI4MzEsMTQuODY2NjZjLTIuMjMxMTUsMC45NTgxOCAtNS4xMjg2MSwtMS40MDk5NiAtOC43NzQ1MiwtNy4yMTYwNmMtMy4yMDY4NCwtNS4xMDY4OSAtMi40MzY2NCwtMjAuMjM2ODggLTUuMDczNTUsLTIxLjc1ODEyYy0zLjAxNDY0LC0xLjczOTE3IC05LjE4NjY4LDMwLjMxMTI4IC0xNS44OTExNiwzMC4yNDM0MmMtNy4xNTUwOSwtMC4wNzI0MSAtMS44NjIxOSwtMTQuNTk4NzEgLTguOTcwMDEsLTIzLjEyNTg5Yy03LjA4MjMzLC04LjQ5NjU5IC00MS42Nzc2NiwtMTYuOTg2NzEgLTQxLjY3NzY2LC0xNi45ODY3MWMwLDAgMzIuMDE3NzYsLTEuMjA1NDMgNDIuMjU1NTcsLTIxLjgwNjkxeiIgZmlsbD0iI2ZhNjQwMCIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjQwLjUwMDAxLDI1OS41di0xNTloMTU5djE1OXoiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48L2c+PC9nPjwvc3ZnPg=='

    translate.setup({
        zh: {
            extensionName: '并行音频Plus',
            playAudio: '并行播放音频[AUDIO]',
            playAudioAndReturn: '并行播放音频[AUDIO]并返回ID',
            returnLastId: '最后播放的音频ID',
            isPlayingById: '音频ID[ID]正在播放?',
            getActiveAudioCount: '正在播放的音频数量',
            getActiveAudioId: '正在播放的音频ID列表',
            setEffect: '设置ID[ID]的[EFFECT]为[VALUE]',
            getEffect: '音频ID[ID]的[EFFECT]',
            stopAudioById: '停止ID[ID]的音频',
            stopAllAudio: '停止所有音频',
            setCacheSize: '设置最大缓存数[SIZE]',
            vol: '音量',
            pitch: '音调',
            pan: '左右平衡'
        },
        en: {
            extensionName: 'Parallel Sound Plus',
            playAudio: 'Play sound [AUDIO] in parallel',
            playAudioAndReturn: 'Play sound [AUDIO] in parallel and return ID',
            returnLastId: 'Last played sound ID',
            isPlayingById: 'Is sound ID [ID] playing?',
            getActiveAudioCount: 'Number of currently playing sounds',
            getActiveAudioId: 'List of currently playing sound IDs',
            setEffect: 'Set [EFFECT] of ID [ID] to [VALUE]',
            getEffect: '[EFFECT] of sound ID [ID]',
            stopAudioById: 'Stop sound with ID [ID]',
            stopAllAudio: 'Stop all sounds',
            setCacheSize: 'Set maximum cache size to [SIZE]',
            vol: 'volume',
            pitch: 'pitch',
            pan: 'pan'
        }
    });

    class LRUCache {
        constructor(size = 50) {
            this.size = size;
            this.cache = new Map();
        }
        setSize(size) {
            if(size >= 0) this.size = size;
            while (this.cache.size > this.size) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
        }
        set(key, value) {
            if (this.cache.has(key)) this.cache.delete(key);
            else if (this.cache.size >= this.size) this.cache.delete(this.cache.keys().next().value);
            this.cache.set(key, value);
        }
        get(key) {
            if (!this.cache.has(key)) return undefined;
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        has(key) {
            return this.cache.has(key);
        }
        delete(key) {
            this.cache.delete(key)
        }
        clear() {
            this.cache.clear();
        }
    }


    class ParallelSoundPlus { 
        constructor(runtime) {
            this.runtime = runtime
            this.audioCtx = runtime?.audioEngine?.audioContext || new (window.AudioContext || window.webkitAudioContext)()
            this.cache = new LRUCache()
            this.nextID = 1
            this.active = new Map() // id -> {sourceNode, gainNode, panNode, }

            Scratch.vm.runtime.on('PROJECT_START', () => {
                this.stopAllAudio()
            });
            Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => {
                this.stopAllAudio()
            });
        }
        getInfo() { 
            return { 
                id: 'parallelSoundPlus', 
                name: translate({id: 'extensionName'}), 
                color1: '#fd9644',
                color2: '#fa8231',
                color3: '#e86e1c',
                menuIconURI: extensionIcon,
                blocks: [ 
                    {
                        opcode: 'playAudio',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'playAudio'}),
                        arguments: {
                            AUDIO: { type: ArgumentType.SOUND },
                        }
                    },
                    {
                        opcode: 'playAudioAndReturn',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'playAudioAndReturn'}),
                        arguments: {
                            AUDIO: { type: ArgumentType.SOUND },
                        }
                    },
                    {
                        opcode: 'returnLastId',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'returnLastId'}),
                    },
                    {
                        opcode: 'isPlayingById',
                        blockType: BlockType.BOOLEAN,
                        text: translate({id: 'isPlayingById'}),
                        arguments: {
                            ID: { type: ArgumentType.NUMBER, defaultValue: ''}
                        }
                    },
                    {
                        opcode: 'getActiveAudioCount',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'getActiveAudioCount'}),
                    },
                    {
                        opcode: 'getActiveAudioId',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'getActiveAudioId'}),
                    },
                    '---',
                    {
                        opcode: 'setEffect',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'setEffect'}),
                        arguments: {
                            ID: { type: ArgumentType.NUMBER, defaultValue: ''},
                            EFFECT: { type: ArgumentType.STRING, menu: 'effects'},
                            VALUE: { type: ArgumentType.NUMBER, defaultValue: 100}
                        }
                    },
                    {
                        opcode: 'getEffect',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'getEffect'}),
                        arguments: {
                            ID: { type: ArgumentType.NUMBER, defaultValue: ''},
                            EFFECT: { type: ArgumentType.STRING, menu: 'effects'},
                        }
                    },
                    '---',
                    {
                        opcode: 'stopAudioById',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'stopAudioById'}),
                        arguments: {
                            ID: { type: ArgumentType.NUMBER, defaultValue: ''},
                        }
                    },
                    {
                        opcode: 'stopAllAudio',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'stopAllAudio'}),
                    },
                    '---',
                    {
                        opcode: 'setCacheSize',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'setCacheSize'}),
                        arguments: {
                            SIZE: { type: ArgumentType.NUMBER, defaultValue: 50},
                        }
                    },

                ],
                menus: {
                    effects: {
                        acceptReporters: false,
                        items: [
                            {text: translate({id: 'vol'}), value: 'vol'},
                            {text: translate({id: 'pitch'}), value: 'pitch'},
                            {text: translate({id: 'pan'}), value: 'pan'},
                        ]
                    },
                    
                } 
            }; 
        } 
        
        playAudio(args, util) {
            this._returnIdThenPlay(String(args.AUDIO), util.target.sprite.sounds)
        }
        playAudioAndReturn(args, util) {
            return this._returnIdThenPlay(String(args.AUDIO), util.target.sprite.sounds)
        }
        returnLastId() {
            return this.nextID-1
        }
        isPlayingById(args) {
            const id = Number(args.ID)
            return this.active.has(id)
        }
        getActiveAudioCount() {
            return this.active.size
        }
        getActiveAudioId() {
            return JSON.stringify([...this.active.keys()])
        }

        setEffect(args) {
            const id = Number(args.ID)
            const audio = this.active.get(id)
            if(!audio) return;

            const value = Number(args.VALUE)
            if(!Number.isFinite(value)) return;
            if(args.EFFECT === 'vol') audio.gainNode.gain.value = value / 100;
            else if(args.EFFECT === 'pitch') audio.sourceNode.playbackRate.value = Math.pow(2, value / 120);
            else if(args.EFFECT === 'pan') audio.panNode.pan.value = value / 100;
        }
        getEffect(args) {
            const id = Number(args.ID)
            const audio = this.active.get(id)
            if(!audio) return;

            if(args.EFFECT === 'vol') return audio.gainNode.gain.value * 100;
            else if(args.EFFECT === 'pitch') return Math.log2(audio.sourceNode.playbackRate.value) * 120;
            else if(args.EFFECT === 'pan') return audio.panNode.pan.value * 100;
        }

        stopAudioById(args) {
            const id = Number(args.ID)
            this._removeAudio(id)
        }
        stopAllAudio() {
            for (const [key, value] of this.active) {
                this._removeAudio(key);
            }
        }

        setCacheSize(args) {
            const size = Number(args.SIZE)
            if(Number.isFinite(size)) this.cache.setSize(size)
        }


        _returnIdThenPlay(audio, audioList) {
            const id = this.nextID++;   // 递增
            // 必须先构建, 允许后续异步操作
            const sourceNode = this.audioCtx.createBufferSource();
            const gainNode = this.audioCtx.createGain();
            const panNode = this.audioCtx.createStereoPanner();
            sourceNode.connect(gainNode);
            gainNode.connect(panNode);
            panNode.connect(this.audioCtx.destination); // 连接到系统输出
            this.active.set(id, {
                sourceNode: sourceNode,
                gainNode: gainNode,
                panNode: panNode
            });
            // 查找assetId作为cache键来防止不同角色同名音频冲突
            const info = audioList.find(v => v.name === audio)
            if(!info) {
                console.warn(`Audio ${audio} not found`);
                this._removeAudio(id)   // 直接作废
            } else {
                const assetId = info.assetId
                const asset = info.asset
                // 再异步缓存播放
                this._playAndCacheAudio(assetId, asset, id)
            }
            return id   // 无论作废都要返回id
        }
        async _playAndCacheAudio(audio, asset, id) {
            // 不存在时获取缓存
            if(!this.cache.has(audio)) {
                // 尝试解码
                console.log(`Decoding audio ${audio} ...`);
                this.cache.set(audio, this.audioCtx.decodeAudioData(asset.data.buffer.slice()).then(buffer =>{
                    this.cache.set(audio, buffer);   // 将promise替换成真正的buffer
                    console.log(`Succeeded to decode audio ${audio} ...`);
                    return buffer;
                }).catch(e => {
                    console.error(`Failed to decode audio ${audio}: ${e.message}`)
                    this.cache.delete(audio)    // 解码失败应删除
                    throw e;
                }))
            };
            // promise锁, 防止多次解码, 同时防止未解码传入buffer
            try {
                if(this.cache.get(audio) instanceof Promise) {  // 从buffer是否为promise判断解码完成
                    await this.cache.get(audio) // 等待解码
                }
            } catch (e) {
                this._removeAudio(id)   // 报错作废id
                return; // 前面已报错, 这里静默
            }

            // 传入buffer
            if(!this.active.has(id)) return;    // 防止解码时已_removeAudio, 同时防止传入空node报错
            const sourceNode = this.active.get(id).sourceNode
            sourceNode.buffer = this.cache.get(audio);
            // 实现
            sourceNode.onended = () => {if(this.active.has(id)) this._removeAudio(id)};
            sourceNode.start();
        }
        _removeAudio(id) {
            if(!this.active.has(id)) return;
            
            const audio = this.active.get(id);
            try {audio.sourceNode.stop()} catch(e) {}

            audio.sourceNode.disconnect();
            audio.gainNode.disconnect();
            audio.panNode.disconnect();
            
            this.active.delete(id)
        }

    } 

    extensions.register(new ParallelSoundPlus(runtime)); 
})(Scratch);