class ShxsBlurExtension {
    constructor(runtime) {
        this.runtime = runtime;
    }
    getInfo() {
        return {
            id: 'ShxsBlur',
            name: '位图高斯模糊',
            color1: '#666eff',
            color2: '#575eda',
            color3: '#585db7',
            blocks: [
                {
                    opcode: 'applyBlur',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '高斯模糊DataURL [IMAGE] 模糊程度 [RADIUS] 去除边缘 [ANTIEDGE]',
                    arguments: {
                        IMAGE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        },
                        RADIUS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 5
                        },
                        ANTIEDGE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'OF'
                        }
                    }
                },
                {
                    opcode: 'resizeImage',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '调整图片分辨率 [IMAGE] 宽度 [WIDTH] 高度 [HEIGHT]',
                    arguments: {
                        IMAGE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        },
                        WIDTH: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 400
                        },
                        HEIGHT: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 300
                        }
                    }
                },
                {
                    opcode: 'getCostumeURL',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取造型URL'
                }
            ],
            menus: {
                OF: {
                    acceptReporters: true,
                    items: [
                        {
                            text: '开启',
                            value: '1'
                        },
                        {
                            text: '关闭',
                            value: '0'
                        }
                    ]
                }
            }
        };
    }

    applyBlur(args) {
        const daturl = args.IMAGE;
        if (daturl.indexOf('data:image/') === -1) {
            return '';
        } else {
            return new Promise((resolve) => {
                const imageDataUrl = args.IMAGE;
                const radius = Math.min(Math.abs(args.RADIUS * 2), 100); //限制100px
                if (!imageDataUrl || radius === 0) {
                    resolve(imageDataUrl);
                    return;
                }
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        ctx.imageSmoothingEnabled = true;
                        // 先绘制放大后的图像
                        ;
                        if(args.ANTIEDGE == '0') {
                            canvas.width = img.width;
                            canvas.height = img.height; 
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        }else {
                            canvas.width = img.width * 2;
                            canvas.height = img.height * 2; 
                            ctx.drawImage(img, canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);
                        }
                            
                        // 应用高质量模糊
                        this._applyHighQualityBlur(canvas, ctx, radius);
                        
                        resolve(canvas.toDataURL());
                    } catch (e) {
                        console.error('模糊处理错误:', e);
                        resolve(imageDataUrl);
                    }
                };
                img.onerror = () => {
                    console.error('图片加载失败');
                    resolve(imageDataUrl);
                };
                img.src = imageDataUrl;
            });
        }
    }
    _applyHighQualityBlur(canvas, ctx, radius) {
        if (radius <= 0) return;
        
        // 创建离屏canvas用于模糊处理
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        const offscreenCtx = offscreenCanvas.getContext('2d');
        
        // 应用模糊滤镜 - 使用实际半径
        offscreenCtx.filter = `blur(${radius}px)`;
        offscreenCtx.drawImage(canvas, 0, 0);
        
        // 清除原canvas并绘制模糊后的图像
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreenCanvas, 0, 0);
    }
    resizeImage(args) {
        const imageDataUrl = args.IMAGE;
        const targetWidth = Math.max(1, Math.abs(Math.floor(args.WIDTH)));
        const targetHeight = Math.max(1, Math.abs(Math.floor(args.HEIGHT)));
        
        if (!imageDataUrl || imageDataUrl.indexOf('data:image/') === -1) {
            return '';
        }
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    
                    // 设置高质量缩放
                    ctx.imageSmoothingEnabled = true;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                    
                    resolve(canvas.toDataURL('image/png'));
                } catch (e) {
                    console.error('图片调整错误:', e);
                    resolve(imageDataUrl);
                }
            };
            img.onerror = () => {
                console.error('图片加载失败');
                resolve(imageDataUrl);
            };
            img.src = imageDataUrl;
        });
    }
    getCostumeURL(){
        const target = vm.editingTarget;
        const costume = target.getCostumes()[target.currentCostume];

        // 直接获取 dataURL
        if (costume.dataFormat === 'svg') {
            const dataURL = costume.asset.encodeDataURI();
            return dataURL;
        } 
        else {
            // 对于位图，可能需要先转换为 canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                return dataURL;
            };
            img.src = costume.asset.encodeDataURI();
        }
    }
}
Scratch.extensions.register(new ShxsBlurExtension());
