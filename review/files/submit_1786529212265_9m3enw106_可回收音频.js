// 标题: 可回收音频
// ID: recyclableaudio
// 介绍: 更好的管理你的音频!
// 作者: 大尾巴奇@CCW.SITE

(function (Scratch) {
  'use strict';
  
  const extensionIcon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyNDgiIGhlaWdodD0iMjQ4IiB2aWV3Qm94PSIwLDAsMjQ4LDI0OCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE5NiwtNTYpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PGcgc3Ryb2tlLXdpZHRoPSIxIj48cGF0aCBkPSJNMzc3LjA4NDQ1LDE3NS41MTgzNGwzNC4yMDk1OSwtMTUuNTkwOTJsMzAuNDMwOTYsNjYuNjEwNjFsLTIyLjkxODA5LDM5Ljc4MDY2eiIgZmlsbD0iIzBkZDE1ZSIvPjxnIGZpbGw9IiMwZGQxNWUiPjxnPjxwYXRoIGQ9Ik0zMzMuNjM4MTksMjU3LjMwODA5YzEuNjEwNzcsMTQuNTUzNDEgMTAuMTM2OTIsMTEuOTY5NzIgNS4xMjI5NiwxNy4zMzg5NGMtNS45MTgyNSw2LjMzNDA2IC0xMy40Njc0NSwtOC4xMTAzNSAtMTQuMjk5MDgsLTE3LjM5MTQyYy0wLjg5MjE4LC05Ljg3NDUyIDUuNDEzNjMsLTI1LjI2NzYyIDExLjQ5MzM2LC0xOC41OTg0OWM1LjAwNTg5LDUuNDk0MzcgLTMuNDQ3Niw0LjI1NSAtMi4zMTcyNCwxOC42NTA5N3oiLz48cGF0aCBkPSJNMzI0LjUyMjYzLDIxNS42NTgyOWM2LjM1ODI5LDguNTQyMzEgLTE1Ljc3NjYyLDE4LjkwNTMgLTEzLjUzMjA1LDQ0LjgyNjkyYzIuNDc4NzIsMjMuMDQ3MjcgMjYuNDUwNDcsMjcuMTk3MzEgMjIuMzYwOTgsMzcuMzk0NzljLTMuOTg4NTYsOS45MzUwNyAtMzAuNjg5MzIsLTcuMjAyMDIgLTMzLjExOTYsLTM3Ljc3NDI3Yy0yLjgyNTksLTM1LjUxMzU1IDIxLjUyOTM2LC00OC4xNTc0NSAyNC4yOTA2NywtNDQuNDQ3NDR6Ii8+PC9nPjxwYXRoIGQ9Ik00NDEuNjkyNywyMjYuNTkwNTFsLTIyLjk5MDc1LDM5Ljc0MDI5bC0zOS4wOTQzNywzLjc0NjM0bC0yNi4wODcxNCwzMy41NjM2N2wtOC45MjU4MiwtOTguMDAyMzdsMzEuNDQ4MjgsMjYuMzU3NjJ6Ii8+PC9nPjxwYXRoIGQ9Ik00MDIuMTYyMzQsMjI5LjU5NDA0bC05LjU1NTU5LC0yMS4xMTM1NGw0OC43ODMxOSwxNy44NDM1N3oiIGZpbGw9IiMwNzZlMzIiLz48L2c+PGcgc3Ryb2tlLXdpZHRoPSIxIj48cGF0aCBkPSJNMjg1LjgzNDQ4LDEzNy44ODY1M2wtMzAuNjA0NTUsLTIxLjgyODA5bDQyLjQ2OTMxLC01OS42NTg4OGw0NS45MDg4NCwtMC4wNDAzN3oiIGZpbGw9IiMwZGQxNWUiLz48ZyBmaWxsPSIjMGRkMTVlIj48Zz48cGF0aCBkPSJNMzc4LjM4Njg5LDEzNC42MTI1MmMxMS44MDAxNywtOC42Njc0NSA1LjI5NjU1LC0xNC43NjczNyAxMi40NTgyLC0xMy4xMDQxMmM4LjQ0NTQyLDEuOTU3OTUgLTAuMjkwNjYsMTUuNzE2MDcgLTcuOTEyNTMsMjEuMDgxMjVjLTguMTA2MzEsNS43MDgzMyAtMjQuNTg5NDEsNy45NDg4NyAtMjEuODUyMzIsLTAuNjU4MDNjMi4yNTI2NSwtNy4wODA5MSA1LjQwNTU1LDAuODU5ODggMTcuMzA2NjUsLTcuMzE5MDl6Ii8+PHBhdGggZD0iTTM0Ni44NzQwMiwxNjMuMzM1ODJjNC4yMTg2NywtOS43Nzc2MyAyNC4yNjI0MSw0LjIxMDYgNDUuNTg5OTEsLTEwLjY5NDAzYzE4LjcxOTYsLTEzLjY3MzM0IDEwLjMzMDcsLTM2LjUwNjY1IDIxLjIwNjQsLTM4LjA2MDljMTAuNTk3MTQsLTEuNTEzODggOS4xMDc0OSwzMC4xNzY2MiAtMTYuMTUyMDYsNDcuNTY4MDVjLTI5LjM0NSwyMC4yMDExOCAtNTIuNDczMDEsNS40Mjk3NyAtNTAuNjQ0MjUsMS4xODY4OHoiLz48L2c+PHBhdGggZD0iTTI5Ny43NTk3OSw1Ni4zOTk1Nmw0NS45MDg4NCwwLjA0MDM3bDIyLjc5Mjk0LDMxLjk4MTE3bDQyLjExMDAxLDUuODEzMjlsLTgwLjQwOTEsNTYuNzIzOThsNy4xMDEwOSwtNDAuNDE0NDd6Ii8+PC9nPjxwYXRoIGQ9Ik0zMjAuMTI0ODEsODkuMTI3NTdsLTEzLjUwMzc5LDE4LjgzMjY0bC04Ljk0MTk3LC01MS4xNjkwNnoiIGZpbGw9IiMwNzZlMzIiLz48L2c+PGcgc3Ryb2tlLXdpZHRoPSIxIj48cGF0aCBkPSJNMjk4LjI2NzAzLDIzNS43OTAyNWwtMy42MDEwMSwzNy40MTkwMWwtNzIuOTAwMjYsLTYuOTUxNzNsLTIyLjk5MDc1LC0zOS43NDAyOXoiIGZpbGw9IiMwZGQxNWUiLz48ZyBmaWxsPSIjMGRkMTVlIj48Zz48cGF0aCBkPSJNMjQ5LjE1Njg0LDE1Ny4yNzA0OGMtMTMuNDA2OSwtNS44ODE5MiAtMTUuNDM3NTEsMi43OTM2MSAtMTcuNTc3MTMsLTQuMjM0ODJjLTIuNTI3MTcsLTguMjkyMDEgMTMuNzU4MTIsLTcuNjA1NzIgMjIuMjExNjEsLTMuNjg5ODJjOC45OTQ0NSw0LjE2NjE5IDE5LjE3OTgyLDE3LjMyMjc5IDEwLjM1ODk2LDE5LjI1MjQ4Yy03LjI2MjU3LDEuNTk0NjIgLTEuOTYxOTksLTUuMTA2ODEgLTE0Ljk5MzQ0LC0xMS4zMjc4NHoiLz48cGF0aCBkPSJNMjg5Ljc4NTI3LDE3MC4yMDEwMWMtMTAuNTc2OTYsMS4yMzUzMiAtOC40ODU3OSwtMjMuMTE1OSAtMzIuMDU3ODcsLTM0LjEzMjg5Yy0yMS4xOTgzMiwtOS4zNzM5MyAtMzYuNzgxMTcsOS4zMDkzNCAtNDMuNTY3MzcsMC42NjYxMWMtNi42MTI2MiwtOC40MjEyIDIxLjU4MTg0LC0yMi45NzQ2IDQ5LjI3MTY2LC05Ljc5NzgxYzMyLjE3NDk0LDE1LjMxMjM3IDMwLjk0MzY1LDQyLjczMTcxIDI2LjM1MzU4LDQzLjI2NDZ6Ii8+PC9nPjxwYXRoIGQ9Ik0yMjEuNzMzNDYsMjY2LjIwOTFsLTIyLjkxODA5LC0zOS43ODA2NmwxNi4zMDE0MywtMzUuNzMxNTRsLTE2LjAyMjg4LC0zOS4zNzI5Mmw4OS4zMzA4OCw0MS4yNzAzMmwtMzguNTUzNDEsMTQuMDU2ODZ6Ii8+PC9nPjxwYXRoIGQ9Ik0yMzguODk4ODEsMjMwLjQ3MzUybDIzLjA1OTM4LDIuMjgwOTFsLTM5Ljg0MTIyLDMzLjMyNTQ5eiIgZmlsbD0iIzA3NmUzMiIvPjwvZz48cGF0aCBkPSJNMTk2LDMwNHYtMjQ4aDI0OHYyNDh6IiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjAiLz48L2c+PC9nPjwvc3ZnPg==";
  class RecyclableAudio {
    constructor(){
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.cache = new Map();                 // name -> AudioBuffer
      this.active = new Map();                // id -> {source, gainNode, panNode, tag, startTime}
      this.tagMap = new Map();                // tag -> [id]
      this.nextId = 1;                        // 递增
      this.maxCacheSize = 100;                  // 0 = 无限制
      this.overflowPolicy = 'delete-oldest';  // 'ignore-new' | 'delete-oldest'
      this._waitTarget = new EventTarget();  // 等待结束
    }

    getInfo() {
      return{
        id: 'recyclableaudio',
        name: '可回收音频',
        color1: '#0dd15e',
        color2: '#21b55e',
        color3: '#33a663',
        docsURI: '',
        menuIconURI: extensionIcon, 
        blocks: [
          /* 缓存 */
          {
            opcode: 'cacheLabel',
            blockType: Scratch.BlockType.LABEL,
            text: '💾缓存',
          },
          {
            opcode: 'cacheSoundFromSpirit',
            blockType: Scratch.BlockType.COMMAND,
            text: '从角色缓存音频 [SOUND] 命名为 [NAME]',
            arguments: {
              SOUND: { type: Scratch.ArgumentType.SOUND },
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
            }
          },
          {
            opcode: 'batchCacheByPrefix',
            blockType: Scratch.BlockType.COMMAND,
            text: '从角色批量缓存以 [PREFIX] 开头的音频',
            arguments: {
              PREFIX: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
            }
          },
          {
            opcode: 'cacheSoundFromURL',
            blockType: Scratch.BlockType.COMMAND,
            text: '从URL缓存音频 [URL] 命名为 [NAME]',
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://m.ccw.site/user_projects_assets/4602e080f3926f730436d276e1206dac.wav' },
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'name' }
            }
          },
          {
            opcode: 'cacheDataURL',
            blockType: Scratch.BlockType.COMMAND,
            text: '缓存DataURL音频 [DATAURL] 命名为 [NAME]',
            arguments: {
              DATAURL: { type: Scratch.ArgumentType.STRING, defaultValue: 'DataURL' },
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'name' }
            }
          },
          {
            opcode: 'cachedList',
            blockType: Scratch.BlockType.REPORTER,
            text: '缓存音频列表'
          },
          {
            opcode: 'isCached',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '音频 [NAME] 已缓存?',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'name' }
            }
          },
          {
            opcode: 'attributeOfSound',
            blockType: Scratch.BlockType.REPORTER,
            text: '音频 [SOUND] 的 [ATTR]',
            arguments: {
              SOUND: {type: Scratch.ArgumentType.STRING, menu: 'getCache',},
              ATTR :{type: Scratch.ArgumentType.STRING, menu: 'audioAttr',}
            }
          },
          '---',
          {
            opcode: 'setCacheLimit',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置缓存上限为 [SIZE] (0为无上限)',
            arguments: {
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          {
            opcode: 'setOverflowPolicy',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置溢出策略为 [POLICY]',
            arguments: {
              POLICY: {
                type: Scratch.ArgumentType.STRING,
                menu: 'overflowMenu',
              }
            }
          },
          '---',
          {
            opcode: 'clearOne',
            blockType: Scratch.BlockType.COMMAND,
            text: '清理缓存音频 [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'name' }
            }
          },
          {
            opcode: 'clearAll',
            blockType: Scratch.BlockType.COMMAND,
            text: '清理所有缓存音频',
          },
          

          /* 播放 */
          {
            opcode: 'playLabel',
            blockType: Scratch.BlockType.LABEL,
            text: '🔉播放',
          },
          {
            opcode: 'playCached',
            blockType: Scratch.BlockType.COMMAND,
            text: '播放 [NAME] 标签 [TAG]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, menu: 'getCache',},
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'tag' }
            }
          },
          {
            opcode: 'playCachedReturnId',
            blockType: Scratch.BlockType.REPORTER,
            text: '播放 [NAME] 标签 [TAG] 并返回音频 ID',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, menu: 'getCache',},
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'tag' }
            }
          },
          '---',
          {
            opcode: 'awaitIdDone',
            blockType: Scratch.BlockType.COMMAND,
            text: '等待音频ID [ID] 播放结束',
            arguments: {
              ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: '' }
            }
          },
          {
            opcode: 'isPlaying',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '音频 ID [ID] 仍在播放?',
            arguments: {
              ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: '' }
            }
          },
          {
            opcode: 'getProgById',
            blockType: Scratch.BlockType.REPORTER,
            text: '音频 ID [ID] 的播放进度',
            arguments: {
              ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: '' }
            }
          },
          '---',
          {
            opcode: 'stopByTag',
            blockType: Scratch.BlockType.COMMAND,
            text: '停止标签为 [TAG] 的音频',
            arguments: {
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'tag' }
            }
          },
          {
            opcode: 'stopById',
            blockType: Scratch.BlockType.COMMAND,
            text: '停止ID为 [ID] 的音频',
            arguments: {
              ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: '' }
            }
          },
          {
            opcode: 'stopAll',
            blockType: Scratch.BlockType.COMMAND,
            text: '停止所有音频'
          },
    

          /* 效果 */
          {
            opcode: 'effectLabel',
            blockType: Scratch.BlockType.LABEL,
            text: '🎶效果',
          },
          {
            opcode: 'setByTag',
            blockType: Scratch.BlockType.COMMAND,
            text: '将标签为 [TAG] 的音频的 [ATTR] 设为 [VALUE]',
            arguments: {
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'tag' },
              ATTR: { type: Scratch.ArgumentType.STRING, menu: 'attrMenu', defaultValue: '音量' },
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          {
            opcode: 'changeByTag',
            blockType: Scratch.BlockType.COMMAND,
            text: '将标签为 [TAG] 的音频的 [ATTR] 增加 [VALUE]',
            arguments: {
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'tag' },
              ATTR: { type: Scratch.ArgumentType.STRING, menu: 'attrMenu', defaultValue: '音量' },
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'setById',
            blockType: Scratch.BlockType.COMMAND,
            text: '将 ID 为 [ID] 的音频的 [ATTR] 设为 [VALUE]',
            arguments: {
              ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: '' },
              ATTR: { type: Scratch.ArgumentType.STRING, menu: 'attrMenu', defaultValue: '音量' },
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          '---',
          {
            opcode: 'getById',
            blockType: Scratch.BlockType.REPORTER,
            text: '音频 ID [ID] 的 [ATTR]',
            arguments: {
              ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: '' },
              ATTR: { type: Scratch.ArgumentType.STRING, menu: 'attrMenu', defaultValue: '音量' }
            }
          },


          /* 其他 */
          {
            opcode: 'otherLabel',
            blockType: Scratch.BlockType.LABEL,
            text: '🔧其他',
          },
          {
            opcode: 'dbToVol',
            blockType: Scratch.BlockType.REPORTER,
            text: '将 [DB] 分贝转换为音量',
            arguments: {
              DB: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          }
        ],
        menus: {
          audioAttr: { 
            acceptReporters: false, 
            items: ['时长', '声道数', '采样率', 'DataURL'] 
          },
          overflowMenu: { 
            acceptReporters: false, 
            items: [
              {
                text: '清理最旧音频',
                value: 'delete-oldest'
              },
              {
                text: '忽略新音频',
                value: 'ignore-new'
              }
          ]},
          attrMenu: { 
            acceptReporters: false, 
            items: ['音量', '音调', '左右平衡'] 
          },
          getCache: { 
            acceptReporters: true, 
            items: '_getCacheList' 
          }
        }
      };
    }



    /* 缓存 */
    _setCache(name, buffer){
      if (this.maxCacheSize && this.cache.size >= this.maxCacheSize && this.overflowPolicy === 'delete-oldest') {
        if(!this.cache.has(name)) this.cache.delete(this.cache.keys().next().value);
        this.cache.set(String(name), buffer);
      } else if(!this.maxCacheSize || this.cache.size < this.maxCacheSize) {
        this.cache.set(String(name), buffer);
      }
    }

    // Uint8Array -> ArrayBuffer -> AudioBuffer
    async _uint8arrayToAudiobuffer(uint8Array) {
      try { 
        const audioBuffer = await this.audioContext.decodeAudioData(uint8Array.buffer);
        return audioBuffer;
      } catch (error) {
        throw error; // 重新抛出错误供调用者处理
      }
    }

    cacheSoundFromSpirit(args,util) {
      const soundName = args.SOUND;
      const sounds = util.target.sprite.sounds.find(v => v.name === soundName)
      if (!sounds) return
      const name = args.NAME || soundName
      this._uint8arrayToAudiobuffer(sounds.asset.data)
        .then(audioBuffer => {
          this._setCache(name, audioBuffer);
        })
        .catch(console.error);
    }

    _filterByPrefix(sounds, prefix) {
      return sounds.filter(sound => sound.startsWith(prefix));
    }

    batchCacheByPrefix(args, util) {
      const allSounds = util.target.sprite.sounds
      const cacheList = this._filterByPrefix(allSounds.map(sound => sound.name), String(args.PREFIX))
      if(cacheList.length === 0) return;
      const soundMap = new Map(allSounds.map(s => [s.name, s]))

      cacheList.forEach((sound) =>{
        this._uint8arrayToAudiobuffer(soundMap.get(sound).asset.data)
          .then(audioBuffer => {
            this._setCache(sound, audioBuffer);
          })
          .catch(console.error);
      })
    }

    _loadBufferFromURL = url =>
    fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => this.audioContext.decodeAudioData(buf));

    cacheSoundFromURL(args) {
      const { URL, NAME } = args;
      this._loadBufferFromURL(URL)
        .then(buf => {
          this._setCache(NAME, buf);
        })
        .catch(console.error);
    }

    // dataurl -> 二进制base64 -> uint8Array, 之后调用现成的函数
    async _dataurlToAudiobuffer(dataurl){
      const binary = atob(dataurl.split(',')[1]);
      const bytes  = Uint8Array.from(binary, c => c.charCodeAt(0));
      return this._uint8arrayToAudiobuffer(bytes);
    }

    cacheDataURL(args){
      const { DATAURL, NAME } = args;
      this._dataurlToAudiobuffer(DATAURL)
        .then(audioBuffer => {
          this._setCache(NAME, audioBuffer);
        })
        .catch(console.error);
    }

    cachedList() {
      return JSON.stringify([...this.cache.keys()]);
    }

    isCached(args) {
      return this.cache.has(String(args.NAME));
    }

    _audioBufferToDataURL(buffer) {
      return new Promise((resolve) => {
        const { numberOfChannels, length, sampleRate } = buffer;
        const headerLength = 44;
        const dataLength = length * numberOfChannels * 2;
        const totalLength = headerLength + dataLength;
    
        const bufferArray = new ArrayBuffer(totalLength);
        const view = new DataView(bufferArray);
    
        const writeString = (offset, str) => {
          for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
          }
        };
    
        /* RIFF chunk descriptor */
        writeString(0, 'RIFF');
        view.setUint32(4, totalLength - 8, true);
        writeString(8, 'WAVE');
    
        /* fmt sub-chunk */
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numberOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numberOfChannels * 2, true);
        view.setUint16(32, numberOfChannels * 2, true);
        view.setUint16(34, 16, true);
    
        /* data sub-chunk */
        writeString(36, 'data');
        view.setUint32(40, dataLength, true);
    
        /* PCM 数据 */
        let offset = 44;
        const floatTo16BitPCM = (output, offset, input) => {
          for (let i = 0; i < input.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
          }
        };
        const interleaved = new Float32Array(length * numberOfChannels);
        for (let i = 0; i < length; i++) {
          for (let ch = 0; ch < numberOfChannels; ch++) {
            interleaved[i * numberOfChannels + ch] = buffer.getChannelData(ch)[i];
          }
        }
        floatTo16BitPCM(view, offset, interleaved);
    
        /* 修复 Base64 转换 */
        const uint8Array = new Uint8Array(bufferArray);
        const base64 = btoa(
          Array.from(uint8Array, byte => String.fromCharCode(byte)).join('')
        );
        resolve(`data:audio/wav;base64,${base64}`);
      });
    }

    async attributeOfSound(args) {
      if(!this.cache.has(args.SOUND)) return
      const audioBuffer =this.cache.get(String(args.SOUND))
      switch (args.ATTR){
        case '时长': return audioBuffer.duration;
        case '声道数': return audioBuffer.numberOfChannels;
        case '采样率': return audioBuffer.sampleRate;
        case 'DataURL': return await this._audioBufferToDataURL(audioBuffer);
      }
    }

    setCacheLimit(args) {
      this.maxCacheSize = Math.max(0, args.SIZE || 0);
    }

    setOverflowPolicy(args) {
      this.overflowPolicy = args.POLICY;
    }


    clearOne(args) {
      this.cache.delete(String(args.NAME));
    }

    clearAll() {
      this.cache.clear();
    }



    /* 播放 */
    _stopAndRemove(id) {
      const obj = this.active.get(id);
      if (!obj) return;                // 防御式
      try { obj.source.stop(); } catch (_) {} // 已经 stop 过的再 stop 会抛错
      this.active.delete(id);
      // this._waitEvents?.emit(`gone:${id}`);
      this._waitTarget.dispatchEvent(new CustomEvent(`gone:${id}`));
    }

    playCached(args, util) {
      this.playCachedReturnId(args, util); // 忽略返回值
    }

    playCachedReturnId(args) {
      const { NAME, TAG } = args;
      const buffer = this.cache.get(String(NAME));
      if (!buffer) return '';

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      const panNode = this.audioContext.createStereoPanner();

      source.buffer = buffer;

      source.connect(gainNode);
      gainNode.connect(panNode);
      panNode.connect(this.audioContext.destination);

      const id = this.nextId++;
      this.active.set(id, { 
        source, 
        gainNode, 
        panNode, 
        tag: TAG, 
        startTime: this.audioContext.currentTime
      });

      source.start();
      source.onended = () => this._stopAndRemove(id);

      return id;
    }

    async awaitIdDone(args) {
      const id = args.ID
      if (!this.active.has(id)) return;
    
      await new Promise(resolve => {
        const listener = () => {
          this._waitTarget.removeEventListener(`gone:${id}`, listener);
          resolve();
        };
        this._waitTarget.addEventListener(`gone:${id}`, listener, { once: true });

      });
    }

    isPlaying(args) {
      return this.active.has(args.ID);
    }

    getProgById(args) {
      const obj = this.active.get(args.ID);
      if (!obj) return;
      return this.audioContext.currentTime - obj.startTime;
    }

    stopByTag(args) {
      for (const [id, obj] of this.active) {
        if (obj.tag === args.TAG) this._stopAndRemove(id);
      }
    }

    stopById(args) {
      this._stopAndRemove(args.ID);
    }

    stopAll() {
      for (const id of this.active.keys()) this._stopAndRemove(id);
    }


    /* 效果 */
    setByTag(args) {
      const { TAG, ATTR, VALUE } = args;
      this.active.forEach(obj => {
        if (obj.tag !== TAG) return;
        const val = VALUE
        switch (ATTR) {
          case '音量': obj.gainNode.gain.value = Math.max(0, val / 100 ?? 100); break;
          case '音调': obj.source.playbackRate.value = Math.pow(2, val / 120 ?? 0); break;
          case '左右平衡': obj.panNode.pan.value = Math.max(-1, Math.min(1, val / 100 ?? 0)); break;
        }
      });
    }

    changeByTag(args) {
      const { TAG, ATTR, VALUE } = args;
      this.active.forEach(obj => {
        if (obj.tag !== TAG) return;
        const delta = VALUE;
        switch (ATTR) {
          case '音量': obj.gainNode.gain.value = Math.max(0, obj.gainNode.gain.value + delta / 100); break;
          case '音调': obj.source.playbackRate.value *= Math.pow(2, delta / 120); break;
          case '左右平衡': obj.panNode.pan.value = Math.max(-1, Math.min(1, obj.panNode.pan.value + delta / 100)); break;
        }
      });
    }

    setById(args) {
      const { ID, ATTR, VALUE } = args;
      const obj = this.active.get(ID);
      if (!obj) return;
      const val = VALUE;
      switch (ATTR) {
        case '音量': obj.gainNode.gain.value = Math.max(0, val / 100 ?? 100); break;
        case '音调': obj.source.playbackRate.value = Math.pow(2, val / 120 ?? 0); break;
        case '左右平衡': obj.panNode.pan.value = Math.max(-1, Math.min(1, val / 100 ?? 0)); break;
      }
    }

    getById(args) {
      const { ID, ATTR } = args;
      const obj = this.active.get(ID);
      if (!obj) return 0;
      switch (ATTR) {
        case '音量': return obj.gainNode.gain.value * 100;
        case '音调': return Math.log2(obj.source.playbackRate.value) * 120;
        case '左右平衡': return obj.panNode.pan.value * 100;
        default: return 0;
      }
    }


    /* 其他 */
    dbToVol(args) {
      return Math.pow(10, (args.DB || 0) / 20) * 100
    }


    /* 动态菜单 */
    _getCacheList(){
      const theCache = [...this.cache.keys()]
      if (!theCache.length){
        return ['无缓存, 请先缓存音频']
      };
      return theCache;
    }
  };      
  Scratch.extensions.register(new RecyclableAudio);
})(Scratch);