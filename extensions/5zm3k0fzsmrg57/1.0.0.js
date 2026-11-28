//by YL_YOLO
class EnhancedMultiIframeHtmlExtension {
  constructor() {
    this.iframes = new Map();
    this.overlays = new Map();
    this.frameSettings = new Map();
    this.contentCache = new Map();
    this.textElements = new Map();
    this.frameCreationOrder = [];
    this.controlElements = new Map();
    
    this.setupMessageListener();
  }

  getInfo() {
    return {
      id: 'enhancedmultiiframehtml',
      name: 'YOLO的内嵌框架pro',
      color1: '#4C97FF',
      color2: '#3373CC',
      color3: '#2C5AA0',
      docsURI: 'https://b23.tv/XzP96oz',
      blocks: [
        {
          opcode: 'displayHTML',
          blockType: Scratch.BlockType.COMMAND,
          text: '显示HTML [HTML] 编号为 [ID]',
          arguments: {
            HTML: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '<div style="padding:20px;background:lightblue;text-align:center;"><h1>Hello Scratch!</h1></div>'
            },
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            }
          }
        },
        {
          opcode: 'createContent',
          blockType: Scratch.BlockType.COMMAND,
          text: '创建容器 [CONTENT] 类型为 [TYPE] 唯一id [ID]',
          arguments: {
            CONTENT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://example.com'
            },
            TYPE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'contentType'
            },
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'content1'
            }
          }
        },
        {
          opcode: 'showContent',
          blockType: Scratch.BlockType.COMMAND,
          text: '显示唯一id [CONTENT_ID] 编号为 [FRAME_ID]',
          arguments: {
            CONTENT_ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'content1'
            },
            FRAME_ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            }
          }
        },
        {
          opcode: 'displayText',
          blockType: Scratch.BlockType.COMMAND,
          text: '显示文本 [TEXT] 编号为 [ID]',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Hello World!'
            },
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            }
          }
        },
        {
          opcode: 'setTextContent',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的文本容器为 [TEXT]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '新文本容器'
            }
          }
        },
        {
          opcode: 'setBackgroundEffect',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的背景效果为 [EFFECT]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            EFFECT: {
              type: Scratch.ArgumentType.STRING,
              menu: 'backgroundEffect'
            }
          }
        },
        {
          opcode: 'setEditable',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的文本可编辑性为 [EDITABLE]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            EDITABLE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'editableMenu'
            }
          }
        },
        {
          opcode: 'setTextColor',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的文本颜色为 [COLOR]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            COLOR: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '#000000'
            }
          }
        },
        {
          opcode: 'show',
          blockType: Scratch.BlockType.COMMAND,
          text: '显示编号为 [ID] 的容器',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            }
          }
        },
        {
          opcode: 'hide',
          blockType: Scratch.BlockType.COMMAND,
          text: '隐藏编号为 [ID] 的容器',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            }
          }
        },
        {
          opcode: 'close',
          blockType: Scratch.BlockType.COMMAND,
          text: '关闭编号为 [ID] 的容器',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            }
          }
        },
        {
          opcode: 'closeAll',
          blockType: Scratch.BlockType.COMMAND,
          text: '关闭所有容器'
        },
        {
          opcode: 'setX',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的容器X坐标为 [X]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            X: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '0'
            }
          }
        },
        {
          opcode: 'setY',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的容器Y坐标为 [Y]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            Y: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '0'
            }
          }
        },
        {
          opcode: 'setWidth',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的容器宽度为 [WIDTH]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            WIDTH: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '480'
            }
          }
        },
        {
          opcode: 'setHeight',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的容器高度为 [HEIGHT]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            HEIGHT: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '360'
            }
          }
        },
        {
          opcode: 'setContentWidth',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的容器内部宽度为 [WIDTH]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            WIDTH: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '480'
            }
          }
        },
        {
          opcode: 'setContentHeight',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的容器内部高度为 [HEIGHT]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            HEIGHT: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '360'
            }
          }
        },
        {
          opcode: 'setScale',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的容器内容缩放为 [SCALE]%',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            SCALE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '100'
            }
          }
        },
        {
          opcode: 'setContentOffsetX',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的容器内部X偏移为 [OFFSET]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            OFFSET: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '0' // 默认无偏移
            }
          }
        },
        // 新增：设置容器内部Y偏移
        {
          opcode: 'setContentOffsetY',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的容器内部Y偏移为 [OFFSET]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            OFFSET: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '0' // 默认无偏移
            }
          }
        },
        {
          opcode: 'setRotation',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的容器旋转角度为 [ANGLE]度',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            ANGLE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '0'
            }
          }
        },
        {
          opcode: 'setOpacity',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的透明度为 [OPACITY]%',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            OPACITY: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '100'
            }
          }
        },
        {
          opcode: 'setInteractivity',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置编号 [ID] 的交互性为 [INTERACTIVE]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            INTERACTIVE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'interactiveMenu'
            }
          }
        },
        {
          opcode: 'getTextContent',
          blockType: Scratch.BlockType.REPORTER,
          text: '获取编号 [ID] 的文本容器',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            }
          }
        },
        {
          opcode: 'getAllFrameIds',
          blockType: Scratch.BlockType.REPORTER,
          text: '获取所有容器编号'
        },
        {
          opcode: 'createControl',
          blockType: Scratch.BlockType.COMMAND,
          text: '创建控件 编号 [ID] 类型 [TYPE] 初始值 [VALUE]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            TYPE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'controlType'
            },
            VALUE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '0'
            }
          }
        },
        {
          opcode: 'getControlValue',
          blockType: Scratch.BlockType.REPORTER,
          text: '获取控件 [ID] 的值',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            }
          }
        },
        {
          opcode: 'setControlValue',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置控件 [ID] 的值为 [VALUE]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            VALUE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '0.5'
            }
          }
        },
        {
          opcode: 'setControlColor',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置控件 [ID] 的颜色为 [COLOR]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            COLOR: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '#4C97FF'
            }
          }
        },
        {
          opcode: 'setSliderHeight',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置滑动控件 [ID] 的高度为 [HEIGHT]',
          arguments: {
            ID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'A'
            },
            HEIGHT: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '30'
            }
          }
        }
      ],
      menus: {
        contentType: {
          acceptReporters: true,
          items: ['网页PC端', '网页手机端', 'HTML', '视频', '图片']
        },
        interactiveMenu: {
          acceptReporters: true,
          items: ['是', '否']
        },
        backgroundEffect: {
          acceptReporters: true,
          items: [
            '无', 
            '毛玻璃', 
            '毛玻璃（亮）', 
            '实验性效果', 
            '放大测试', 
            '透明背景',
            '反色效果',
            '泛光效果',
            '非背景倾斜效果',
            '方块模糊',
            '渐变效果',
            '噪点效果',
            '暗角效果',
            '色差效果',
            '浮雕效果'
          ]
        },
        editableMenu: {
          acceptReporters: true,
          items: ['可编辑', '不可编辑']
        },
        controlType: {
          acceptReporters: true,
          items: ['滑动式', '点击式', '滑动点击式', '方形点击式']
        }
      }
    };
  }

  forcePcUrl(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      if (hostname.includes('m.baidu.com')) {
        urlObj.hostname = 'www.baidu.com';
      } else if (hostname.includes('m.taobao.com')) {
        urlObj.hostname = 'www.taobao.com';
      } else if (hostname.includes('m.qq.com')) {
        urlObj.hostname = 'www.qq.com';
      } else if (hostname.includes('sina.cn')) {
        urlObj.hostname = 'www.sina.com.cn';
      } else if (hostname.includes('m.weibo.cn')) {
        urlObj.hostname = 'weibo.com';
      } else if (hostname.includes('m.jd.com')) {
        urlObj.hostname = 'www.jd.com';
      } else if (hostname.includes('3g.163.com')) {
        urlObj.hostname = 'www.163.com';
      } else if (hostname.includes('m.sohu.com')) {
        urlObj.hostname = 'www.sohu.com';
      } else if (hostname.includes('m.youku.com')) {
        urlObj.hostname = 'www.youku.com';
      } else if (hostname.includes('m.iqiyi.com')) {
        urlObj.hostname = 'www.iqiyi.com';
      }
      
      urlObj.searchParams.delete('from');
      urlObj.searchParams.delete('mobile');
      
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }

  convertToMobileUrl(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      if (hostname.includes('baidu.com') && !hostname.startsWith('m.')) {
        urlObj.hostname = 'm.baidu.com';
      } else if (hostname.includes('taobao.com') && !hostname.startsWith('m.')) {
        urlObj.hostname = 'm.taobao.com';
      } else if (hostname.includes('qq.com') && !hostname.startsWith('m.')) {
        urlObj.hostname = 'm.qq.com';
      } else if (hostname.includes('sina.com')) {
        urlObj.hostname = 'sina.cn';
      } else if (hostname.includes('weibo.com') && !hostname.startsWith('m.')) {
        urlObj.hostname = 'm.weibo.cn';
      } else if (hostname.includes('jd.com') && !hostname.startsWith('m.')) {
        urlObj.hostname = 'm.jd.com';
      } else if (hostname.includes('163.com') && !hostname.startsWith('3g.')) {
        urlObj.hostname = '3g.163.com';
      } else if (hostname.includes('sohu.com') && !hostname.startsWith('m.')) {
        urlObj.hostname = 'm.sohu.com';
      } else if (hostname.includes('youku.com') && !hostname.startsWith('m.')) {
        urlObj.hostname = 'm.youku.com';
      } else if (hostname.includes('iqiyi.com') && !hostname.startsWith('m.')) {
        urlObj.hostname = 'm.iqiyi.com';
      } else {
        urlObj.searchParams.set('from', 'mobile');
      }
      
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }

    convertContentToHtml(content, type) {
      switch(type) {
        case '网页PC端':
          const pcUrl = this.forcePcUrl(content);
          // 额外添加style="overflow:hidden"，确保网页iframe无滚动条
          return `<iframe src="${pcUrl}" style="width:100%;height:100%;border:none;overflow:hidden;"></iframe>`;
        
        case '网页手机端':
          const mobileUrl = this.convertToMobileUrl(content);
          return `
            <!DOCTYPE html>
            <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
              <style>
                body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden !important; }
                iframe { width: 100%; height: 100%; border: none; overflow: hidden !important; }
              </style>
            </head>
            <body>
              <iframe src="${mobileUrl}"></iframe>
            </body>
            </html>
          `;
        
        case '视频':
          // 视频添加overflow:hidden，避免视频控件导致的滚动条
          return `
            <video controls autoplay style="width:100%;height:100%;overflow:hidden;">
              <source src="${content}" type="video/mp4">
              您的浏览器不支持视频标签
            </video>
          `;
        
        // 图片、HTML等其他类型保持原有逻辑，已通过wrapHTML隐藏滚动条
        case '图片':
          return `<img src="${content}" style="width:100%;height:100%;object-fit:contain;overflow:hidden;">`;
        case 'HTML':
          return content;
        default:
          return content;
      }
    }

  createContent(args) {
    const content = Scratch.Cast.toString(args.CONTENT);
    const type = Scratch.Cast.toString(args.TYPE);
    const id = Scratch.Cast.toString(args.ID);
    
    if (content && id) {
      const html = this.convertContentToHtml(content, type);
      this.contentCache.set(id, html);
    }
  }

  showContent(args) {
    const contentId = Scratch.Cast.toString(args.CONTENT_ID);
    const frameId = Scratch.Cast.toString(args.FRAME_ID);
    
    if (this.contentCache.has(contentId)) {
      const html = this.contentCache.get(contentId);
      this.createFrame(html, frameId);
    }
  }

    displayText(args) {
      const text = Scratch.Cast.toString(args.TEXT);
      const id = Scratch.Cast.toString(args.ID);
      
      if (text && id) {
        const html = `
          <div class="text-container" style="width:100%;height:100%;padding:0;margin:0;overflow:auto;">
            ${this.escapeHtml(text)}
          </div>
        `;
        this.createFrame(html, id);
        this.textElements.set(id, text);
      }
    }

  setTextContent(args) {
    const id = Scratch.Cast.toString(args.ID);
    const text = Scratch.Cast.toString(args.TEXT);
    
    if (text && id) {
      this.textElements.set(id, text);
      
      if (this.iframes.has(id)) {
        const iframe = this.iframes.get(id);
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          
          const textContainer = iframeDoc.querySelector('.text-container');
          
          if (textContainer) {
            textContainer.innerHTML = this.escapeHtml(text);
          } else {
            iframeDoc.body.innerHTML = `
              <div class="text-container" style="width:100%;height:100%;padding:0;margin:0;overflow:auto;">
                ${this.escapeHtml(text)}
              </div>
            `;
          }
        } catch (e) {
          console.warn('无法直接更新iframe容器，重新创建:', e);
          const html = `
            <div class="text-container" style="width:100%;height:100%;padding:0;margin:0;overflow:auto;">
              ${this.escapeHtml(text)}
            </div>
          `;
          this.createFrame(html, id);
        }
      }
    }
  }

  escapeHtml(text) {
    const trimmedText = text.trim();
    const div = document.createElement('div');
    div.textContent = trimmedText;
    return div.innerHTML;
  }

  setBackgroundEffect(args) {
    const id = Scratch.Cast.toString(args.ID);
    const effect = Scratch.Cast.toString(args.EFFECT);
    
    if (this.frameSettings.has(id)) {
      const settings = this.frameSettings.get(id);
      settings.backgroundEffect = effect;
      this.applyBackgroundEffect(id, effect);
    }
  }

  applyBackgroundEffect(id, effect) {
    if (!this.iframes.has(id)) return;
    
    const container = this.frameSettings.get(id).container;
    
    container.classList.remove(
      'glass-effect', 
      'glass-effect-light',
      'chromatic-aberration-effect', 
      'zoom-effect', 
      'transparent-background',
      'invert-effect',
      'glow-effect',
      'offset-effect',
      'pixelate-effect',
      'gradient-effect',
      'noise-effect',
      'vignette-effect',
      'chromatic-effect',
      'emboss-effect'
    );
    
    switch(effect) {
      case '毛玻璃':
        container.classList.add('glass-effect');
        break;
      case '毛玻璃（亮）':
        container.classList.add('glass-effect-light');
        break;
      case '实验性效果':
        container.classList.add('chromatic-aberration-effect');
        break;
      case '放大测试':
        container.classList.add('zoom-effect');
        break;
      case '透明背景':
        container.classList.add('transparent-background');
        break;
      case '反色效果':
        container.classList.add('invert-effect');
        break;
      case '泛光效果':
        container.classList.add('glow-effect');
        break;
      case '非背景倾斜效果':
        container.classList.add('offset-effect');
        break;
      case '方块模糊':
        container.classList.add('pixelate-effect');
        break;
      case '渐变效果':
        container.classList.add('gradient-effect');
        break;
      case '噪点效果':
        container.classList.add('noise-effect');
        break;
      case '暗角效果':
        container.classList.add('vignette-effect');
        break;
      case '色差效果':
        container.classList.add('chromatic-effect');
        break;
      case '浮雕效果':
        container.classList.add('emboss-effect');
        break;
      default:
        break;
    }
  }

  setEditable(args) {
    const id = Scratch.Cast.toString(args.ID);
    const editable = Scratch.Cast.toString(args.EDITABLE) === '可编辑';
    
    if (this.iframes.has(id)) {
      const iframe = this.iframes.get(id);
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        const textContainer = iframeDoc.querySelector('.text-container');
        
        if (textContainer) {
          textContainer.contentEditable = editable;
          
          if (editable) {
            textContainer.style.minHeight = '100%';
            textContainer.style.outline = 'none';
            textContainer.style.overflow = 'auto';
          }
        } else {
          iframeDoc.body.contentEditable = editable;
          
          if (editable) {
            iframeDoc.body.style.minHeight = '100%';
            iframeDoc.body.style.outline = 'none';
            iframeDoc.body.style.overflow = 'auto';
          }
        }
      } catch (e) {
        console.warn('无法设置iframe编辑性:', e);
      }
    }
  }

  setTextColor(args) {
    const id = Scratch.Cast.toString(args.ID);
    const color = Scratch.Cast.toString(args.COLOR);
    
    if (this.iframes.has(id)) {
      const iframe = this.iframes.get(id);
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        const textContainer = iframeDoc.querySelector('.text-container');
        
        if (textContainer) {
          textContainer.style.color = color;
        } else {
          iframeDoc.body.style.color = color;
        }
      } catch (e) {
        console.warn('无法设置文本颜色:', e);
      }
    }
  }

  getTextContent(args) {
    const id = Scratch.Cast.toString(args.ID);
    
    if (this.iframes.has(id)) {
      const iframe = this.iframes.get(id);
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        let textContent = '';
        
        const textContainer = iframeDoc.querySelector('.text-container');
        if (textContainer) {
          textContent = textContainer.innerText;
        } else {
          textContent = iframeDoc.body.innerText;
        }
        
        this.textElements.set(id, textContent);
        return textContent;
      } catch (e) {
        console.warn('无法获取iframe容器:', e);
      }
    }
    
    if (this.textElements.has(id)) {
      return this.textElements.get(id);
    }
    
    return '';
  }

  getAllFrameIds() {
    return this.frameCreationOrder.join(',');
  }

    createFrame(content, id) {
      this.closeFrame(id);
      
      const container = document.createElement("div");
      container.id = `frame-container-${id}`;
      container.style.position = "absolute";
      container.style.overflow = "hidden";
      container.style.transformOrigin = "center center";
      container.style.borderRadius = "8px";
      
      const iframe = document.createElement("iframe");
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.transformOrigin = "center center";
      
      iframe.setAttribute("sandbox", "allow-same-origin allow-scripts allow-forms allow-modals");
      iframe.setAttribute("allowtransparency", "true");
      
      // 同步生成并设置iframe内容（无异步等待）
      const frameHtml = this.wrapHTML(content);
      iframe.setAttribute("srcdoc", frameHtml);
      
      iframe.dataset.frameId = id;
      container.appendChild(iframe);
      const overlay = Scratch.renderer.addOverlay(container, "scale-centered");
      
      this.iframes.set(id, iframe);
      this.overlays.set(id, overlay);
      
      if (!this.frameCreationOrder.includes(id)) {
        this.frameCreationOrder.push(id);
      }
      
      // 同步保存初始设置
      const initialSettings = {
        x: 0,
        y: 0,
        width: 480,
        height: 360,
        contentWidth: null,
        contentHeight: null,
        scale: 100,
        rotation: 0,
        opacity: 100,
        interactive: true,
        backgroundEffect: '无',
        container: container,
        iframe: iframe,
        contentOffsetX: 0,
        contentOffsetY: 0
      };
      this.frameSettings.set(id, initialSettings);
      
      // 同步执行属性更新，确保样式即时生效
      this.updateFrameAttributes(id);
      return iframe;
    }

    wrapHTML(html) {
      return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* 原有样式保持不变... */
        body, html { 
          margin: 0; 
          padding: 0; 
          width: 100%; 
          height: 100%; 
          font-family: Arial, sans-serif;
          background: transparent;
          overflow: hidden !important; 
          display: block; 
        }
        .text-container {
          width: 100% !important;
          height: 100% !important;
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          overflow: auto !important;
          white-space: pre-wrap;
          line-height: 1.4;
          transform-origin: top left;
          ::-webkit-scrollbar {
            width: 3px !important;
            height: 3px !important;
            display: block !important;
          }
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
          }
        }
        /* 关键修改1：control-container默认添加居中样式，且优先适配控件 */
        .control-container {
          display: flex !important; /* 强制flex居中，覆盖block */
          justify-content: center !important; /* 水平居中 */
          align-items: center !important; /* 垂直居中 */
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important; 
          margin: 0;
          padding: 0;
        }
        /* 关键修改2：非控件内容（文本/网页）还原为非flex，避免居中 */
        .control-container:has(.text-container),
        .control-container:has(iframe),
        .control-container:has(img),
        .control-container:has(video) {
          display: block !important; /* 文本/网页等仍用block，不居中 */
          justify-content: flex-start !important;
          align-items: flex-start !important;
        }
        /* 原有控件容器样式保持不变... */
        .slider-container, .toggle-container, .slide-toggle-container, .square-toggle-container {
          overflow: hidden !important; 
        }
        iframe, img, video {
          overflow: hidden !important;
        }
      </style>
    </head>
    <body>
      <div class="control-container">
        ${html}
      </div>
    </body>
    </html>`;
    }

  closeFrame(id) {
    if (this.iframes.has(id)) {
      const iframe = this.iframes.get(id);
      const container = iframe.parentElement;
      Scratch.renderer.removeOverlay(container);
      this.iframes.delete(id);
      this.overlays.delete(id);
      this.frameSettings.delete(id);
      this.textElements.delete(id);
      
      const index = this.frameCreationOrder.indexOf(id);
      if (index > -1) {
        this.frameCreationOrder.splice(index, 1);
      }
    }
  }

  closeAllFrames() {
    for (const id of this.iframes.keys()) {
      this.closeFrame(id);
    }
    this.frameCreationOrder = [];
  }

    updateFrameAttributes(id) {
      if (!this.iframes.has(id)) return;
    
      const settings = this.frameSettings.get(id);
      const container = settings.container;
      const iframe = settings.iframe;
    
      // 1. 容器基础样式（保持不变）
      container.style.width = `${settings.width}px`;
      container.style.height = `${settings.height}px`;
      container.style.overflow = "hidden";
      container.style.transform = `rotate(${settings.rotation}deg)`;
      container.style.opacity = settings.opacity / 100;
    
      // 2. 内容缩放逻辑（原有逻辑保持不变）
      const scaleFactor = settings.scale / 100;
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const controlContainer = iframeDoc.querySelector('.control-container');
        const textContainer = iframeDoc.querySelector('.text-container');
        const isControl = !!iframeDoc.querySelector(
          '.slider-container, .toggle-container, .slide-toggle-container, .square-toggle-container'
        );
    
        if (controlContainer) {
          if (isControl) {
            controlContainer.style.transform = `scale(${scaleFactor})`;
            controlContainer.style.transformOrigin = "center center";
            controlContainer.style.display = "flex";
            controlContainer.style.justifyContent = "center";
            controlContainer.style.alignItems = "center";
          } else if (textContainer) {
            controlContainer.style.transform = `scale(${scaleFactor})`;
            controlContainer.style.transformOrigin = "top left";
            controlContainer.style.display = "block";
          } else {
            controlContainer.style.transform = `scale(${scaleFactor})`;
            controlContainer.style.transformOrigin = "top left";
            controlContainer.style.display = "block";
          }
    
          // 3. 新增：应用内部X/Y偏移（在缩放后叠加偏移）
          const offsetX = settings.contentOffsetX || 0;
          const offsetY = settings.contentOffsetY || 0;
          // 组合缩放和偏移：先缩放再偏移，避免偏移量被缩放影响
          controlContainer.style.transform = `${controlContainer.style.transform.replace('none', '')} translate(${offsetX}px, ${offsetY}px)`;
        }
      } catch (e) {
        console.warn('内容缩放或偏移失败:', e);
      }
    
      // ... 原有交互性、背景效果、位置计算逻辑（保持不变）...
      if (settings.interactive) {
        iframe.style.pointerEvents = 'auto';
        container.style.pointerEvents = 'auto';
      } else {
        iframe.style.pointerEvents = 'none';
        container.style.pointerEvents = 'none';
      }
      this.applyBackgroundEffect(id, settings.backgroundEffect);
    
      const stageWidth = Scratch.renderer.getNativeSize()[0];
      const stageHeight = Scratch.renderer.getNativeSize()[1];
      const absoluteX = settings.x - (settings.width / 2);
      const absoluteY = 0 - settings.y - (settings.height / 2);
      container.style.left = `${absoluteX}px`;
      container.style.top = `${absoluteY}px`;
    }


  displayHTML(args) {
    const html = Scratch.Cast.toString(args.HTML);
    const id = Scratch.Cast.toString(args.ID);
    
    if (html && id) {
      this.createFrame(html, id);
    }
  }

  show(args) {
    const id = Scratch.Cast.toString(args.ID);
    const settings = this.frameSettings.get(id);
    
    if (settings && settings.container) {
      settings.container.style.display = "";
    }
  }

  hide(args) {
    const id = Scratch.Cast.toString(args.ID);
    const settings = this.frameSettings.get(id);
    
    if (settings && settings.container) {
      settings.container.style.display = "none";
    }
  }

  close(args) {
    const id = Scratch.Cast.toString(args.ID);
    this.closeFrame(id);
  }

  closeAll() {
    this.closeAllFrames();
  }

  setX(args) {
    const id = Scratch.Cast.toString(args.ID);
    if (this.frameSettings.has(id)) {
      const settings = this.frameSettings.get(id);
      settings.x = Scratch.Cast.toNumber(args.X);
      this.updateFrameAttributes(id);
    }
  }

  setY(args) {
    const id = Scratch.Cast.toString(args.ID);
    if (this.frameSettings.has(id)) {
      const settings = this.frameSettings.get(id);
      settings.y = Scratch.Cast.toNumber(args.Y);
      this.updateFrameAttributes(id);
    }
  }

  setWidth(args) {
    const id = Scratch.Cast.toString(args.ID);
    if (this.frameSettings.has(id)) {
      const settings = this.frameSettings.get(id);
      settings.width = Math.max(10, Scratch.Cast.toNumber(args.WIDTH));
      this.updateFrameAttributes(id);
    }
  }

  setHeight(args) {
    const id = Scratch.Cast.toString(args.ID);
    if (this.frameSettings.has(id)) {
      const settings = this.frameSettings.get(id);
      settings.height = Math.max(10, Scratch.Cast.toNumber(args.HEIGHT));
      this.updateFrameAttributes(id);
    }
  }
    // 修复“设置容器内部宽度”
    setContentWidth(args) {
      const id = Scratch.Cast.toString(args.ID);
      if (this.frameSettings.has(id) && this.iframes.has(id)) {
        const settings = this.frameSettings.get(id);
        const width = Math.max(10, Scratch.Cast.toNumber(args.WIDTH));
        settings.contentWidth = width;
          
        const iframe = this.iframes.get(id);
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          const controlContainer = iframeDoc.querySelector('.control-container');
          const textContainer = iframeDoc.querySelector('.text-container');
          
          // 1. 更新control-container宽度（强制生效）
          if (controlContainer) {
            controlContainer.style.width = `${width}px`;
            controlContainer.style.minWidth = `${width}px`;
            controlContainer.style.maxWidth = "none";
          }
          // 2. 更新text-container宽度（同步文本容器）
          if (textContainer) {
            textContainer.style.width = `${width}px`;
            textContainer.style.minWidth = `${width}px`;
          }
          // 3. 更新iframe内部文档宽度（确保整体生效）
          iframeDoc.body.style.width = `${width}px`;
          iframeDoc.documentElement.style.width = `${width}px`;
        } catch (e) {
          console.warn('无法设置容器内部宽度:', e);
        }
      }
    }
    
    setContentHeight(args) {
      const id = Scratch.Cast.toString(args.ID);
      if (this.frameSettings.has(id) && this.iframes.has(id)) {
        const settings = this.frameSettings.get(id);
        const height = Math.max(10, Scratch.Cast.toNumber(args.HEIGHT));
        settings.contentHeight = height;
          
        const iframe = this.iframes.get(id);
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          const controlContainer = iframeDoc.querySelector('.control-container');
          const textContainer = iframeDoc.querySelector('.text-container');
          
          if (controlContainer) {
            controlContainer.style.height = `${height}px`;
            controlContainer.style.minHeight = `${height}px`;
            controlContainer.style.maxHeight = "none";
          }
          // 关键：强制文本容器滚动条生效
          if (textContainer) {
            textContainer.style.height = `${height}px`;
            textContainer.style.minHeight = `${height}px`;
            textContainer.style.overflow = "auto !important"; // 确保滚动条不被隐藏
          }
          iframeDoc.body.style.height = `${height}px`;
          iframeDoc.documentElement.style.height = `${height}px`;
        } catch (e) {
          console.warn('无法设置容器内部高度:', e);
        }
      }
    }


  setScale(args) {
    const id = Scratch.Cast.toString(args.ID);
    if (this.frameSettings.has(id)) {
      const settings = this.frameSettings.get(id);
      settings.scale = Math.max(10, Math.min(500, Scratch.Cast.toNumber(args.SCALE)));
      this.updateFrameAttributes(id);
    }
  }

  setRotation(args) {
    const id = Scratch.Cast.toString(args.ID);
    if (this.frameSettings.has(id)) {
      const settings = this.frameSettings.get(id);
      settings.rotation = Scratch.Cast.toNumber(args.ANGLE);
      this.updateFrameAttributes(id);
    }
  }

  setOpacity(args) {
    const id = Scratch.Cast.toString(args.ID);
    if (this.frameSettings.has(id)) {
      const settings = this.frameSettings.get(id);
      const opacity = Math.max(0, Math.min(100, Scratch.Cast.toNumber(args.OPACITY)));
      settings.opacity = opacity;
      this.updateFrameAttributes(id);
    }
  }

    // 新增：设置容器内部X偏移（X正向右）
    setContentOffsetX(args) {
      const id = Scratch.Cast.toString(args.ID);
      const offset = Scratch.Cast.toNumber(args.OFFSET);
      
      if (this.frameSettings.has(id) && this.iframes.has(id)) {
        const settings = this.frameSettings.get(id);
        settings.contentOffsetX = offset; // 保存X偏移量
        this.updateFrameAttributes(id); // 应用偏移
      }
    }
    
    // 新增：设置容器内部Y偏移（Y正向上，需转换为CSS负方向）
    setContentOffsetY(args) {
      const id = Scratch.Cast.toString(args.ID);
      const offset = Scratch.Cast.toNumber(args.OFFSET);
      
      if (this.frameSettings.has(id) && this.iframes.has(id)) {
        const settings = this.frameSettings.get(id);
        settings.contentOffsetY = -offset; // CSS中Y正向下，故取负实现“Y正向上”
        this.updateFrameAttributes(id); // 应用偏移
      }
    }

  setInteractivity(args) {
    const id = Scratch.Cast.toString(args.ID);
    if (this.frameSettings.has(id)) {
      const settings = this.frameSettings.get(id);
      const interactive = Scratch.Cast.toString(args.INTERACTIVE) === '是';
      settings.interactive = interactive;
      this.updateFrameAttributes(id);
    }
  }

  setupMessageListener() {
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'controlUpdate') {
        const { id, value } = event.data;
        
        if (this.controlElements.has(id)) {
          const control = this.controlElements.get(id);
          control.value = value;
        }
      }
    });
  }

  createControl(args) {
    const id = Scratch.Cast.toString(args.ID);
    const type = Scratch.Cast.toString(args.TYPE);
    let value = Scratch.Cast.toNumber(args.VALUE);
    
    value = Math.max(0, Math.min(1, value));
    
    if (id) {
      let html = '';
      
      if (type === '滑动式') {
        html = this.createSliderControl(id, value, '#4C97FF', 30);
      } else if (type === '点击式') {
        html = this.createToggleControl(id, value, '#4C97FF');
      } else if (type === '滑动点击式') {
        html = this.createSlideToggleControl(id, value, '#4C97FF', 30);
      } else if (type === '方形点击式') {
        html = this.createSquareToggleControl(id, value, '#4C97FF', 40);
      }
      
      this.createFrame(html, id);
      this.controlElements.set(id, { 
        type, 
        value, 
        color: '#4C97FF',
        height: type.includes('滑动') ? 30 : (type === '方形点击式' ? 40 : null),
        size: type === '方形点击式' ? 40 : null
      });
    }
  }

  createSliderControl(id, value, color, height = 30) {
    const sliderPosition = value * 100;
    const handleSize = height;
    const darkerColor = this.darkenColor(color, 0.3);
    
    return `
      <div class="slider-container" style="width:80%;height:${height}px;background:rgba(0,0,0,0.1);border-radius:${height/2}px;position:relative;cursor:pointer;margin:0 auto;">
        <div class="slider-track" style="width:100%;height:100%;position:relative;overflow:hidden;border-radius:${height/2}px;">
          <div class="slider-fill" style="width:${sliderPosition}%;height:100%;background:${darkerColor};border-radius:${height/2}px;transition:width 0.3s ease;"></div>
        </div>
        <div class="slider-handle" style="width:${handleSize}px;height:${handleSize}px;background:${color};border-radius:50%;position:absolute;top:0;left:${sliderPosition}%;transform:translateX(-50%);box-shadow:0 2px 5px rgba(0,0,0,0.2);cursor:pointer;transition:left 0.3s ease;"></div>
      </div>
      <script>
        (function() {
          const container = document.querySelector('.slider-container');
          const track = container.querySelector('.slider-track');
          const fill = container.querySelector('.slider-fill');
          const handle = container.querySelector('.slider-handle');
          
          let isDragging = false;
          
          function updateSlider(position) {
            const rect = track.getBoundingClientRect();
            let newPosition = Math.max(0, Math.min(100, position));
            
            fill.style.width = newPosition + '%';
            handle.style.left = newPosition + '%';
            
            window.parent.postMessage({
              type: 'controlUpdate',
              id: '${id}',
              value: newPosition / 100
            }, '*');
          }
          
          function getPositionFromEvent(event) {
            const rect = track.getBoundingClientRect();
            const clientX = event.clientX || (event.touches && event.touches[0].clientX);
            return ((clientX - rect.left) / rect.width) * 100;
          }
          
          container.addEventListener('mousedown', function(e) {
            isDragging = true;
            updateSlider(getPositionFromEvent(e));
            e.preventDefault();
          });
          
          container.addEventListener('touchstart', function(e) {
            isDragging = true;
            updateSlider(getPositionFromEvent(e));
            e.preventDefault();
          });
          
          document.addEventListener('mousemove', function(e) {
            if (isDragging) {
              updateSlider(getPositionFromEvent(e));
            }
          });
          
          document.addEventListener('touchmove', function(e) {
            if (isDragging) {
              updateSlider(getPositionFromEvent(e));
              e.preventDefault();
            }
          });
          
          document.addEventListener('mouseup', function() {
            isDragging = false;
          });
          
          document.addEventListener('touchend', function() {
            isDragging = false;
            });
          
          container.addEventListener('click', function(e) {
            if (!isDragging) {
              updateSlider(getPositionFromEvent(e));
            }
          });
        })();
      </script>
    `;
  }

  createToggleControl(id, value, color) {
    const isActive = value > 0.5;
    const darkerColor = this.darkenColor(color, 0.3);
    
    return `
      <div class="toggle-container" style="width:60px;height:30px;background:rgba(0,0,0,0.1);border-radius:15px;position:relative;cursor:pointer;margin:0 auto;">
        <div class="toggle-track" style="width:100%;height:100%;position:relative;overflow:hidden;border-radius:15px;">
          <div class="toggle-fill" style="width:${isActive ? '100%' : '0%'};height:100%;background:${darkerColor};border-radius:15px;transition:width 0.3s ease;"></div>
        </div>
        <div class="toggle-handle" style="width:26px;height:26px;background:${color};border-radius:50%;position:absolute;top:2px;left:${isActive ? 'calc(100% - 28px)' : '2px'};box-shadow:0 2px 5px rgba(0,0,0,0.2);transition:left 0.3s ease;"></div>
      </div>
      <script>
        (function() {
          const container = document.querySelector('.toggle-container');
          const fill = container.querySelector('.toggle-fill');
          const handle = container.querySelector('.toggle-handle');
          
          let currentValue = ${isActive ? 1 : 0};
          
          function toggle() {
            currentValue = currentValue > 0.5 ? 0 : 1;
            
            if (currentValue > 0.5) {
              fill.style.width = '100%';
              handle.style.left = 'calc(100% - 28px)';
            } else {
              fill.style.width = '0%';
              handle.style.left = '2px';
            }
            
            window.parent.postMessage({
              type: 'controlUpdate',
              id: '${id}',
              value: currentValue
            }, '*');
          }
          
          container.addEventListener('click', toggle);
          container.addEventListener('touchstart', function(e) {
            toggle();
            e.preventDefault();
          });
        })();
      </script>
    `;
  }

  createSlideToggleControl(id, value, color, height = 30) {
    const isActive = value > 0.5;
    const handleSize = height;
    const darkerColor = this.darkenColor(color, 0.3);
    
    return `
      <div class="slide-toggle-container" style="width:100%;height:${height}px;background:rgba(0,0,0,0.1);border-radius:${height/2}px;position:relative;cursor:pointer;">
        <div class="slide-toggle-track" style="width:100%;height:100%;position:relative;overflow:hidden;border-radius:${height/2}px;">
          <div class="slide-toggle-fill" style="width:${isActive ? '100%' : '0%'};height:100%;background:${darkerColor};border-radius:${height/2}px;transition:width 0.3s ease;"></div>
        </div>
        <div class="slide-toggle-handle" style="width:${handleSize}px;height:${handleSize}px;background:${color};border-radius:50%;position:absolute;top:0;left:${isActive ? 'calc(100% - ' + handleSize + 'px)' : '0'};box-shadow:0 2px 5px rgba(0,0,0,0.2);transition:left 0.3s ease;"></div>
      </div>
      <script>
        (function() {
          const container = document.querySelector('.slide-toggle-container');
          const fill = container.querySelector('.slide-toggle-fill');
          const handle = container.querySelector('.slide-toggle-handle');
          
          let currentValue = ${isActive ? 1 : 0};
          let isDragging = false;
          let startX = 0;
          let startLeft = 0;
          
          function toggle() {
            currentValue = currentValue > 0.5 ? 0 : 1;
            updatePosition(currentValue);
          }
          
          function updatePosition(value) {
            const containerWidth = container.offsetWidth;
            const handleWidth = handle.offsetWidth;
            
            if (value > 0.5) {
              fill.style.width = '100%';
              handle.style.left = 'calc(100% - ' + handleWidth + 'px)';
              currentValue = 1;
            } else {
              fill.style.width = '0%';
              handle.style.left = '0';
              currentValue = 0;
            }
            
            window.parent.postMessage({
              type: 'controlUpdate',
              id: '${id}',
              value: currentValue
            }, '*');
          }
          
          function startDrag(e) {
            isDragging = true;
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            startX = clientX;
            startLeft = parseFloat(handle.style.left) || 0;
            e.preventDefault();
          }
          
          function doDrag(e) {
            if (!isDragging) return;
            
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const containerWidth = container.offsetWidth;
            const handleWidth = handle.offsetWidth;
            const deltaX = clientX - startX;
            let newLeft = Math.max(0, Math.min(containerWidth - handleWidth, startLeft + deltaX));
            
            handle.style.left = newLeft + 'px';
            fill.style.width = (newLeft / (containerWidth - handleWidth)) * 100 + '%';
            
            e.preventDefault();
          }
          
          function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            
            const containerWidth = container.offsetWidth;
            const handleWidth = handle.offsetWidth;
            const currentLeft = parseFloat(handle.style.left);
            
            const threshold = containerWidth / 2;
            if (currentLeft + handleWidth / 2 > threshold) {
              updatePosition(1);
            } else {
              updatePosition(0);
            }
          }
          
          container.addEventListener('click', toggle);
          container.addEventListener('touchstart', startDrag);
          container.addEventListener('mousedown', startDrag);
          document.addEventListener('touchmove', doDrag);
          document.addEventListener('mousemove', doDrag);
          document.addEventListener('touchend', endDrag);
          document.addEventListener('mouseup', endDrag);
        })();
      </script>
    `;
  }

    createSquareToggleControl(id, value, color, size = 40) {
      const isActive = value > 0.5;
      const darkerColor = this.darkenColor(color, 0.3);
      
      return `
        <div class="square-toggle-container" style="width:${size}px;height:${size}px;border:2px solid ${darkerColor};border-radius:8px;position:relative;cursor:pointer;margin:0 auto;transition:all 0.3s ease;">
          <div class="square-toggle-fill" style="width:100%;height:100%;background:${isActive ? darkerColor : 'transparent'};border-radius:6px;transition:all 0.3s ease;"></div>
          ${!isActive ? `<div class="square-toggle-check" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${size * 0.6}px;height:${size * 0.6}px;opacity:0.3;"></div>` : ''}
        </div>
        <script>
          (function() {
            const container = document.querySelector('.square-toggle-container');
            const fill = container.querySelector('.square-toggle-fill');
            let check = container.querySelector('.square-toggle-check');
            let currentValue = ${isActive ? 1 : 0};
            
            // 关键：用变量保存颜色（初始为创建时的颜色，后续可被更新）
            let controlColor = '${color}'; // 保存用户设置的主色（如红色）
            let darkerControlColor = '${darkerColor}'; // 保存加深后的颜色（如深红色）
            
            // 监听颜色更新消息（来自setControlColor方法）
            window.addEventListener('message', (event) => {
              if (event.data && event.data.type === 'updateSquareControlColor' && event.data.id === '${id}') {
                // 接收新颜色并更新变量
                controlColor = event.data.color;
                darkerControlColor = event.data.darkerColor;
                // 即时更新当前显示的颜色（避免等待点击才生效）
                container.style.borderColor = darkerControlColor;
                if (currentValue > 0.5) {
                  fill.style.background = darkerControlColor;
                  container.style.boxShadow = '0 0 10px ' + controlColor + '40';
                }
              }
            });
            
            function toggle() {
              currentValue = currentValue > 0.5 ? 0 : 1;
              if (currentValue > 0.5) {
                // 复用保存的颜色变量，不再用默认蓝色
                fill.style.background = darkerControlColor;
                if (check) check.style.display = 'none';
                container.style.borderColor = darkerControlColor;
                container.style.boxShadow = '0 0 10px ' + controlColor + '40';
              } else {
                fill.style.background = 'transparent';
                if (!check) {
                  check = document.createElement('div');
                  check.className = 'square-toggle-check';
                  check.style = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${size * 0.6}px;height:${size * 0.6}px;opacity:0.3;';
                  check.textContent = '';
                  container.appendChild(check);
                } else {
                  check.style.display = 'block';
                }
                // 复用保存的颜色变量（边框颜色保持用户设置的颜色）
                container.style.borderColor = darkerControlColor;
                container.style.boxShadow = 'none';
              }
              // 发送控件值更新消息（原有逻辑不变）
              window.parent.postMessage({
                type: 'controlUpdate',
                id: '${id}',
                value: currentValue
              }, '*');
            }
            
            container.addEventListener('click', toggle);
            container.addEventListener('touchstart', function(e) {
              toggle();
              e.preventDefault();
            });
          })();
        </script>
      `;
    }

  darkenColor(color, amount) {
    if (color.startsWith('#')) {
      let r = parseInt(color.slice(1, 3), 16);
      let g = parseInt(color.slice(3, 5), 16);
      let b = parseInt(color.slice(5, 7), 16);
      
      r = Math.max(0, Math.min(255, r * (1 - amount)));
      g = Math.max(0, Math.min(255, g * (1 - amount)));
      b = Math.max(0, Math.min(255, b * (1 - amount)));
      
      return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    }
    return color;
  }

  getControlValue(args) {
    const id = Scratch.Cast.toString(args.ID);
    
    if (this.controlElements.has(id)) {
      return this.controlElements.get(id).value;
    }
    
    return 0;
  }

  setControlValue(args) {
    const id = Scratch.Cast.toString(args.ID);
    let value = Scratch.Cast.toNumber(args.VALUE);
    
    value = Math.max(0, Math.min(1, value));
    
    if (this.controlElements.has(id) && this.iframes.has(id)) {
      const control = this.controlElements.get(id);
      control.value = value;
      
      const iframe = this.iframes.get(id);
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        if (control.type === '滑动式') {
          const fill = iframeDoc.querySelector('.slider-fill');
          const handle = iframeDoc.querySelector('.slider-handle');
          
          if (fill && handle) {
            fill.style.width = value * 100 + '%';
            handle.style.left = value * 100 + '%';
          }
        } else if (control.type === '点击式') {
          const fill = iframeDoc.querySelector('.toggle-fill');
          const handle = iframeDoc.querySelector('.toggle-handle');
          const isActive = value > 0.5;
          
          if (fill && handle) {
            fill.style.width = isActive ? '100%' : '0%';
            handle.style.left = isActive ? 'calc(100% - 28px)' : '2px';
          }
        } else if (control.type === '滑动点击式') {
          const fill = iframeDoc.querySelector('.slide-toggle-fill');
          const handle = iframeDoc.querySelector('.slide-toggle-handle');
          const isActive = value > 0.5;
          
          if (fill && handle) {
            const container = iframeDoc.querySelector('.slide-toggle-container');
            const containerWidth = container.offsetWidth;
            const handleWidth = handle.offsetWidth;
            
            if (isActive) {
              fill.style.width = '100%';
              handle.style.left = 'calc(100% - ' + handleWidth + 'px)';
            } else {
              fill.style.width = '0%';
              handle.style.left = '0';
            }
          }
        } else if (control.type === '方形点击式') {
          const container = iframeDoc.querySelector('.square-toggle-container');
          const fill = iframeDoc.querySelector('.square-toggle-fill');
          let check = iframeDoc.querySelector('.square-toggle-check');
          const isActive = value > 0.5;
          const darkerColor = this.darkenColor(control.color, 0.3);
          
          if (container && fill) {
            if (isActive) {
              fill.style.background = darkerColor;
              if (check) check.style.display = 'none';
              container.style.borderColor = darkerColor;
              container.style.boxShadow = `0 0 10px ${control.color}40`;
            } else {
              fill.style.background = 'transparent';
              if (!check) {
                check = document.createElement('div');
                check.className = 'square-toggle-check';
                check.style = `position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${control.size * 0.6}px;height:${control.size * 0.6}px;opacity:0.3;`;
                check.textContent = '';
                container.appendChild(check);
              } else {
                check.style.display = 'block';
              }
              container.style.borderColor = darkerColor;
              container.style.boxShadow = 'none';
            }
          }
        }
      } catch (e) {
        console.warn('无法设置控件值:', e);
      }
    }
  }

    setControlColor(args) {
      const id = Scratch.Cast.toString(args.ID);
      const color = Scratch.Cast.toString(args.COLOR);
      
      if (this.controlElements.has(id) && this.iframes.has(id)) {
        const control = this.controlElements.get(id);
        control.color = color; // 更新扩展内保存的颜色
        const darkerColor = this.darkenColor(color, 0.3); // 计算加深后的颜色
        
        const iframe = this.iframes.get(id);
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          
          // 1. 原有逻辑：更新控件当前显示的颜色（如边框、填充色）
          if (control.type === '方形点击式') {
            const container = iframeDoc.querySelector('.square-toggle-container');
            const fill = iframeDoc.querySelector('.square-toggle-fill');
            
            if (container && fill) {
              container.style.borderColor = darkerColor;
              if (control.value > 0.5) {
                fill.style.background = darkerColor;
                container.style.boxShadow = `0 0 10px ${color}40`;
              }
            }
            
            // 2. 新增关键逻辑：发送消息给控件内部脚本，更新颜色变量
            iframe.contentWindow.postMessage({
              type: 'updateSquareControlColor', // 消息类型（与控件内监听的一致）
              id: id, // 控件编号（确保更新对应控件）
              color: color, // 用户设置的新颜色（如红色）
              darkerColor: darkerColor // 加深后的新颜色（如深红色）
            }, '*');
          } 
          // 其他控件类型（滑动式、点击式）的原有逻辑保持不变...
          else if (control.type === '滑动式') {
            const fill = iframeDoc.querySelector('.slider-fill');
            const handle = iframeDoc.querySelector('.slider-handle');
            if (fill && handle) {
              fill.style.background = darkerColor;
              handle.style.background = color;
            }
          } else if (control.type === '点击式') {
            const fill = iframeDoc.querySelector('.toggle-fill');
            const handle = iframeDoc.querySelector('.toggle-handle');
            if (fill && handle) {
              fill.style.background = darkerColor;
              handle.style.background = color;
            }
          } else if (control.type === '滑动点击式') {
            const fill = iframeDoc.querySelector('.slide-toggle-fill');
            const handle = iframeDoc.querySelector('.slide-toggle-handle');
            if (fill && handle) {
              fill.style.background = darkerColor;
              handle.style.background = color;
            }
          }
        } catch (e) {
          console.warn('无法设置控件颜色:', e);
        }
      }
    }

  setSliderHeight(args) {
    const id = Scratch.Cast.toString(args.ID);
    const height = Math.max(10, Scratch.Cast.toNumber(args.HEIGHT));
    
    if (this.controlElements.has(id) && this.iframes.has(id)) {
      const control = this.controlElements.get(id);
      
      if (control.type.includes('滑动')) {
        control.height = height;
        
        const iframe = this.iframes.get(id);
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          const container = iframeDoc.querySelector('.slider-container, .slide-toggle-container');
          const track = iframeDoc.querySelector('.slider-track, .slide-toggle-track');
          const fill = iframeDoc.querySelector('.slider-fill, .slide-toggle-fill');
          const handle = iframeDoc.querySelector('.slider-handle, .slide-toggle-handle');
          
          if (container && track && fill && handle) {
            const borderRadius = height / 2;
            const handleSize = height;
            
            container.style.height = height + 'px';
            container.style.borderRadius = borderRadius + 'px';
            track.style.borderRadius = borderRadius + 'px';
            fill.style.borderRadius = borderRadius + 'px';
            handle.style.width = handleSize + 'px';
            handle.style.height = handleSize + 'px';
            
            if (control.type === '滑动式') {
              handle.style.left = (control.value * 100) + '%';
            } else if (control.type === '滑动点击式') {
              const containerWidth = container.offsetWidth;
              if (control.value > 0.5) {
                handle.style.left = 'calc(100% - ' + handleSize + 'px)';
              } else {
                handle.style.left = '0';
              }
            }
          }
        } catch (e) {
          console.warn('无法设置控件高度:', e);
        }
      }
    }
  }
}

// 添加CSS样式用于背景效果
const style = document.createElement('style');
style.textContent = `
  .glass-effect {
    background: rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
  }
  .glass-effect-light {
    background: rgba(255, 255, 255, 0) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
  }

  .transparent-background {
    background-color: rgba(255, 255, 255, 0.5) !important;
  }
  
  .invert-effect {
    background: rgba(0, 0, 0, 0.7) !important;
    backdrop-filter: invert(1) blur(2px) !important;
    -webkit-backdrop-filter: invert(1) blur(2px) !important;
  }
  
  .glow-effect {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(5px) brightness(1.5) !important;
    -webkit-backdrop-filter: blur(5px) brightness(1.5) !important;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3) !important;
  }
  
  .offset-effect {
    background: rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: blur(4px) hue-rotate(45deg) !important;
    -webkit-backdrop-filter: blur(4px) hue-rotate(45deg) !important;
    transform: translate(8px, 8px) skew(-5deg, -5deg) !important;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px)) !important;
  }
  
  .pixelate-effect {
    background: rgba(0, 0, 0, 0.6) !important;
    backdrop-filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='pixelate' x='0' y='0'%3E%3CfeFlood x='4' y='4' height='2' width='2'/%3E%3CfeComposite width='8' height='8'/%3E%3CfeTile result='a'/%3E%3CfeComposite in='SourceGraphic' in2='a' operator='in'/%3E%3CfeMorphology operator='dilate' radius='2'/%3E%3C/filter%3E%3C/svg%3E#pixelate") !important;
  }
  
  .gradient-effect {
    background: linear-gradient(45deg, 
      rgba(255, 0, 0, 0.2), 
      rgba(0, 255, 0, 0.2), 
      rgba(0, 0, 255, 0.2)
    ) !important;
    backdrop-filter: blur(8px) !important;
    -webkit-backdrop-filter: blur(8px) !important;
  }
  
  .noise-effect {
    background: 
      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
      rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(4px) !important;
    -webkit-backdrop-filter: blur(4px) !important;
  }
  
  .vignette-effect {
    background: radial-gradient(
      circle at center,
      transparent 30%,
      rgba(0, 0, 0, 0.5) 100%
    ) !important;
    backdrop-filter: blur(3px) !important;
    -webkit-backdrop-filter: blur(3px) !important;
  }
  
  .chromatic-effect {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(5px) hue-rotate(90deg) !important;
    -webkit-backdrop-filter: blur(5px) hue-rotate(90deg) !important;
  }
  
  .emboss-effect {
    background: rgba(128, 128, 128, 0.2) !important;
    backdrop-filter: blur(2px) contrast(1.2) !important;
    -webkit-backdrop-filter: blur(2px) contrast(1.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 
      inset 0 0 10px rgba(0, 0, 0, 0.2),
      0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }
  
  chromatic-aberration-effect {
    background: rgba(0, 0, 0, 0.7) !important;
    position: relative !important;
    overflow: hidden !important;
  }

  .chromatic-aberration-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(8px) !important;
    -webkit-backdrop-filter: blur(8px) !important;
    z-index: 1;
  }

  .chromatic-aberration-effect iframe {
    filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='chromatic'%3E%3CfeOffset in='SourceGraphic' dx='2' dy='0' result='red'%3E%3C/feOffset%3E%3CfeOffset in='SourceGraphic' dx='-2' dy='0' result='blue'%3E%3C/feOffset%3E%3CfeBlend in='red' in2='SourceGraphic' mode='screen' result='blend1'%3E%3C/feBlend%3E%3CfeBlend in='blue' in2='blend1' mode='screen' result='blend2'%3E%3C/feBlend%3E%3C/filter%3E%3C/svg%3E#chromatic") !important;
  }

  .zoom-effect {
    background: rgba(255, 255, 255, 0.3) !important;
    backdrop-filter: blur(12px) brightness(1.2) contrast(1.1) !important;
    -webkit-backdrop-filter: blur(12px) brightness(1.2) contrast(1.1) !important;
    transform: scale(1.08) !important;
    overflow: hidden !important;
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.4) !important;
  }
`;
document.head.appendChild(style);

if (typeof Scratch !== 'undefined' && typeof Scratch.extensions !== 'undefined') {
  Scratch.extensions.register(new EnhancedMultiIframeHtmlExtension());
}