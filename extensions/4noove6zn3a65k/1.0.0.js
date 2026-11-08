class ScreenCaptureExtension {
    constructor() {
        this.isDesktop = typeof EditorPreload !== 'undefined';
        this.capturedImages = new Map();
        this.imageIdCounter = 0;
        this.stageWidth = 480;
        this.stageHeight = 360;
    }

    getInfo() {
        return {
            id: 'screencapturestage',
            name: '屏幕截图到舞台',
            color1: '#9C27B0',
            color2: '#7B1FA2',
            color3: '#4A148C',
            permissions: ['screen-capture', 'draw-window'],
            blocks: [
                {
                    opcode: 'captureFullScreen',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '截取全屏并显示',
                },
                {
                    opcode: 'captureRegion',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '截取区域 x:[X] y:[Y] 宽:[W] 高:[H] 并显示',
                    arguments: {
                        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                        W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 200 },
                        H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 150 }
                    }
                },
                {
                    opcode: 'captureWindow',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '截取当前窗口并显示',
                },
                '---',
                {
                    opcode: 'setImagePosition',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置截图 [ID] 位置 x:[X] y:[Y]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
                        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                    }
                },
                {
                    opcode: 'setImageSize',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置截图 [ID] 大小 宽:[W] 高:[H]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
                        W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 200 },
                        H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 150 }
                    }
                },
                {
                    opcode: 'removeImage',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '移除截图 [ID]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
                    }
                },
                {
                    opcode: 'removeAllImages',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '移除所有截图',
                },
                '---',
                {
                    opcode: 'getImageCount',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '截图数量',
                },
                {
                    opcode: 'getImagePosition',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '截图 [ID] 的 [PROP]',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
                        PROP: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'positionProps',
                            defaultValue: 'x'
                        }
                    }
                },
                {
                    opcode: 'isImageExists',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '截图 [ID] 存在?',
                    arguments: {
                        ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
                    }
                }
            ],
            menus: {
                positionProps: {
                    acceptReporters: true,
                    items: [
                        { text: 'x 坐标', value: 'x' },
                        { text: 'y 坐标', value: 'y' },
                        { text: '宽度', value: 'width' },
                        { text: '高度', value: 'height' }
                    ]
                }
            }
        };
    }

    checkDesktop() {
        if (!this.isDesktop) {
            console.warn('屏幕截图功能仅在 CYSOEditor 桌面版可用');
            return false;
        }
        return true;
    }

    clampToStage(x, y, width, height) {
        const halfWidth = this.stageWidth / 2;
        const halfHeight = this.stageHeight / 2;
        
        let clampedX = Math.max(-halfWidth - width/2, Math.min(halfWidth - width/2, x));
        let clampedY = Math.max(-halfHeight - height/2, Math.min(halfHeight - height/2, y));
        
        let clampedWidth = Math.min(width, this.stageWidth);
        let clampedHeight = Math.min(height, this.stageHeight);
        
        return { x: clampedX, y: clampedY, width: clampedWidth, height: clampedHeight };
    }

    async createStageImage(imageId, dataUrl, x, y, width, height) {
        try {
            const clamped = this.clampToStage(x, y, width, height);
            const windowId = 'capture' + imageId;
            
            await EditorPreload.closeOverlayWindow(windowId).catch(() => {});
            
            const stageX = clamped.x + 960;
            const stageY = clamped.y + 540;
            
            const createResult = await EditorPreload.createOverlayWindow(
                windowId,
                stageX - clamped.width / 2,
                stageY - clamped.height / 2,
                clamped.width,
                clamped.height
            );
            
            if (!createResult.success) {
                console.error('创建窗口失败:', createResult.error);
                return false;
            }
            
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { 
                            width: 100%; 
                            height: 100%; 
                            overflow: hidden;
                            background: transparent;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .image-container {
                            width: 100%;
                            height: 100%;
                            position: relative;
                            overflow: hidden;
                        }
                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                            display: block;
                        }
                        .stage-border {
                            position: absolute;
                            top: 0; left: 0; right: 0; bottom: 0;
                            border: 2px solid #9C27B0;
                            pointer-events: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="image-container">
                        <img src="${dataUrl}" alt="屏幕截图" />
                        <div class="stage-border"></div>
                    </div>
                </body>
                </html>
            `;
            
            const contentResult = await EditorPreload.setOverlayContent(windowId, htmlContent);
            
            if (contentResult.success) {
                this.capturedImages.set(imageId.toString(), {
                    id: imageId,
                    windowId: windowId,
                    x: clamped.x,
                    y: clamped.y,
                    width: clamped.width,
                    height: clamped.height,
                    dataUrl: dataUrl,
                    createdAt: Date.now()
                });
                return true;
            } else {
                console.error('设置内容失败:', contentResult.error);
                return false;
            }
        } catch (error) {
            console.error('创建舞台图片失败:', error);
            return false;
        }
    }

    async captureFullScreen() {
        if (!this.checkDesktop()) return;
        
        try {
            const result = await EditorPreload.captureScreen('screen');
            if (result.success) {
                this.imageIdCounter++;
                const id = this.imageIdCounter.toString();
                
                const success = await this.createStageImage(
                    id, 
                    result.dataUrl, 
                    0, 0, 
                    this.stageWidth / 2, 
                    this.stageHeight / 2
                );
                
                if (success) {
                    console.log('截图 ' + id + ' 已显示在舞台');
                }
            } else {
                console.error('截图失败:', result.error);
            }
        } catch (error) {
            console.error('截图错误:', error);
        }
    }

    async captureRegion(args) {
        if (!this.checkDesktop()) return;
        
        try {
            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);
            const w = Scratch.Cast.toNumber(args.W);
            const h = Scratch.Cast.toNumber(args.H);
            
            const result = await EditorPreload.captureRegion(x, y, w, h);
            if (result.success) {
                this.imageIdCounter++;
                const id = this.imageIdCounter.toString();
                
                const aspectRatio = w / h;
                let displayW = this.stageWidth / 2;
                let displayH = displayW / aspectRatio;
                
                if (displayH > this.stageHeight / 2) {
                    displayH = this.stageHeight / 2;
                    displayW = displayH * aspectRatio;
                }
                
                const success = await this.createStageImage(
                    id, 
                    result.dataUrl, 
                    0, 0, 
                    displayW, 
                    displayH
                );
                
                if (success) {
                    console.log('区域截图 ' + id + ' 已显示在舞台');
                }
            } else {
                console.error('区域截图失败:', result.error);
            }
        } catch (error) {
            console.error('区域截图错误:', error);
        }
    }

    async captureWindow() {
        if (!this.checkDesktop()) return;
        
        try {
            const result = await EditorPreload.captureScreen('window');
            if (result.success) {
                this.imageIdCounter++;
                const id = this.imageIdCounter.toString();
                
                const success = await this.createStageImage(
                    id, 
                    result.dataUrl, 
                    0, 0, 
                    this.stageWidth / 2, 
                    this.stageHeight / 2
                );
                
                if (success) {
                    console.log('窗口截图 ' + id + ' 已显示在舞台');
                }
            } else {
                console.error('窗口截图失败:', result.error);
            }
        } catch (error) {
            console.error('窗口截图错误:', error);
        }
    }

    async setImagePosition(args) {
        if (!this.checkDesktop()) return;
        
        const id = Scratch.Cast.toString(args.ID);
        const image = this.capturedImages.get(id);
        
        if (!image) {
            console.warn('截图 ' + id + ' 不存在');
            return;
        }
        
        const newX = Scratch.Cast.toNumber(args.X);
        const newY = Scratch.Cast.toNumber(args.Y);
        
        await this.createStageImage(id, image.dataUrl, newX, newY, image.width, image.height);
    }

    async setImageSize(args) {
        if (!this.checkDesktop()) return;
        
        const id = Scratch.Cast.toString(args.ID);
        const image = this.capturedImages.get(id);
        
        if (!image) {
            console.warn('截图 ' + id + ' 不存在');
            return;
        }
        
        const newW = Scratch.Cast.toNumber(args.W);
        const newH = Scratch.Cast.toNumber(args.H);
        
        await this.createStageImage(id, image.dataUrl, image.x, image.y, newW, newH);
    }

    async removeImage(args) {
        if (!this.checkDesktop()) return;
        
        const id = Scratch.Cast.toString(args.ID);
        const image = this.capturedImages.get(id);
        
        if (image) {
            try {
                await EditorPreload.closeOverlayWindow(image.windowId);
                this.capturedImages.delete(id);
                console.log('截图 ' + id + ' 已移除');
            } catch (error) {
                console.error('移除截图失败:', error);
            }
        }
    }

    async removeAllImages() {
        if (!this.checkDesktop()) return;
        
        for (const [id, image] of this.capturedImages) {
            try {
                await EditorPreload.closeOverlayWindow(image.windowId);
            } catch (error) {
                console.error('移除截图 ' + id + ' 失败:', error);
            }
        }
        this.capturedImages.clear();
        console.log('所有截图已移除');
    }

    getImageCount() {
        return this.capturedImages.size;
    }

    getImagePosition(args) {
        const id = Scratch.Cast.toString(args.ID);
        const prop = Scratch.Cast.toString(args.PROP);
        const image = this.capturedImages.get(id);
        
        if (!image) return 0;
        
        switch (prop) {
            case 'x': return image.x;
            case 'y': return image.y;
            case 'width': return image.width;
            case 'height': return image.height;
            default: return 0;
        }
    }

    isImageExists(args) {
        const id = Scratch.Cast.toString(args.ID);
        return this.capturedImages.has(id);
    }
}

if (typeof Scratch !== 'undefined') {
    Scratch.extensions.register(new ScreenCaptureExtension());
}