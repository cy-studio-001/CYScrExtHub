(function(Scratch) {
    'use strict';

    class EffectManager {
        constructor() {
            this.bodyFilters = new Map();
            this.bodyTransforms = new Map();
            this.canvasFilters = new Map();
            this.canvasTransforms = new Map();
            this.overlays = new Map();
            this.animationId = null;
            this.originalBodyStyle = null;
            this.originalCanvasStyle = null;
        }

        saveBodyStyle() {
            if (!this.originalBodyStyle) {
                this.originalBodyStyle = {
                    filter: document.body.style.filter || '',
                    transform: document.body.style.transform || '',
                    transformOrigin: document.body.style.transformOrigin || '',
                    perspective: document.body.style.perspective || ''
                };
            }
        }
        saveCanvasStyle(canvas) {
            if (!this.originalCanvasStyle && canvas) {
                this.originalCanvasStyle = {
                    filter: canvas.style.filter || '',
                    transform: canvas.style.transform || '',
                    transformOrigin: canvas.style.transformOrigin || ''
                };
            }
        }
        restoreBody() {
            if (this.originalBodyStyle) {
                document.body.style.filter = this.originalBodyStyle.filter;
                document.body.style.transform = this.originalBodyStyle.transform;
                document.body.style.transformOrigin = this.originalBodyStyle.transformOrigin;
                document.body.style.perspective = this.originalBodyStyle.perspective;
            }
        }
        restoreCanvas(canvas) {
            if (this.originalCanvasStyle && canvas) {
                canvas.style.filter = this.originalCanvasStyle.filter;
                canvas.style.transform = this.originalCanvasStyle.transform;
                canvas.style.transformOrigin = this.originalCanvasStyle.transformOrigin;
            }
        }

        registerBodyFilter(id, func) { this.saveBodyStyle(); this.bodyFilters.set(id, func); this.startLoop(); }
        unregisterBodyFilter(id) { this.bodyFilters.delete(id); this.checkIdle(); }
        registerBodyTransform(id, func) { this.saveBodyStyle(); this.bodyTransforms.set(id, func); this.startLoop(); }
        unregisterBodyTransform(id) { this.bodyTransforms.delete(id); this.checkIdle(); }
        registerCanvasFilter(id, func) {
            const c = this.getStageCanvas();
            if (c) { this.saveCanvasStyle(c); this.canvasFilters.set(id, func); this.startLoop(); }
        }
        unregisterCanvasFilter(id) { this.canvasFilters.delete(id); this.checkIdle(); }
        registerCanvasTransform(id, func) {
            const c = this.getStageCanvas();
            if (c) { this.saveCanvasStyle(c); this.canvasTransforms.set(id, func); this.startLoop(); }
        }
        unregisterCanvasTransform(id) { this.canvasTransforms.delete(id); this.checkIdle(); }

        addOverlay(id, el, stopFn) { this.overlays.set(id, { el, stopFn }); }
        removeOverlay(id) {
            const o = this.overlays.get(id);
            if (o) {
                if (o.stopFn) o.stopFn();
                if (o.el && o.el.parentNode) o.el.remove();
                this.overlays.delete(id);
            }
            this.checkIdle();
        }

        apply() {
            let bf = '', bt = '';
            for (let f of this.bodyFilters.values()) bf += f() + ' ';
            for (let t of this.bodyTransforms.values()) bt += t() + ' ';
            document.body.style.filter = bf.trim();
            document.body.style.transform = bt.trim();

            const c = this.getStageCanvas();
            if (c) {
                let cf = '', ct = '';
                for (let f of this.canvasFilters.values()) cf += f() + ' ';
                for (let t of this.canvasTransforms.values()) ct += t() + ' ';
                c.style.filter = cf.trim();
                c.style.transform = ct.trim();
            }
        }

        startLoop() {
            if (this.animationId) return;
            const loop = () => { this.apply(); this.animationId = requestAnimationFrame(loop); };
            this.animationId = requestAnimationFrame(loop);
        }
        stopLoop() {
            if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
            this.restoreBody();
            const c = this.getStageCanvas();
            if (c) this.restoreCanvas(c);
        }
        checkIdle() {
            if (!this.bodyFilters.size && !this.bodyTransforms.size &&
                !this.canvasFilters.size && !this.canvasTransforms.size && !this.overlays.size) {
                this.stopLoop();
            }
        }
        resetAll() {
            for (let id of this.overlays.keys()) this.removeOverlay(id);
            this.bodyFilters.clear(); this.bodyTransforms.clear();
            this.canvasFilters.clear(); this.canvasTransforms.clear();
            this.stopLoop();
        }

        getStageCanvas() { return document.querySelector('canvas'); }
        setCanvasOrigin(x, y) {
            const c = this.getStageCanvas();
            if (c) { this.saveCanvasStyle(c); c.style.transformOrigin = `${x}% ${y}%`; }
        }
        setBodyOrigin(x, y) {
            this.saveBodyStyle();
            document.body.style.transformOrigin = `${x}% ${y}%`;
        }
        setBodyPerspective(val) {
            this.saveBodyStyle();
            document.body.style.perspective = `${val}px`;
        }
    }

    const manager = new EffectManager();

    class AtomicVisuals {
        constructor() {
            this.state = {
                sHue:0, sInvert:0, sBrightness:1, sContrast:1, sSaturate:1, sBlur:0,
                sGrayscale:0, sSepia:0, sOpacity:1,
                sScale:1, sTranslateX:0, sTranslateY:0, sRotate:0, sSkewX:0, sSkewY:0,
                sOriginX:50, sOriginY:50, s3DX:0, s3DY:0, sPersp:800,
                bHue:0, bInvert:0, bBrightness:1, bContrast:1, bSaturate:1, bBlur:0,
                bGrayscale:0, bSepia:0, bOpacity:1,
                bScale:1, bTranslateX:0, bTranslateY:0, bRotate:0, bSkewX:0, bSkewY:0,
                bOriginX:50, bOriginY:50, b3DX:0, b3DY:0, bPersp:800, bBgAlpha:0
            };
        }

        getInfo() {
            return {
                color1: '#DE6DD6',
                id: 'XGUltraVisual',
                name: '西瓜の硬核特效',
                blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2Mi44MzMzMyIgaGVpZ2h0PSI2Mi44MzMzMyIgdmlld0JveD0iMCwwLDYyLjgzMzMzLDYyLjgzMzMzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjg4LjU4MzMzLC0xNDguNTgzMzMpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0yOTAuODMzMzMsMTgwYzAsLTE2LjEwODMxIDEzLjA1ODM2LC0yOS4xNjY2NiAyOS4xNjY2NywtMjkuMTY2NjZjMTYuMTA4MywwIDI5LjE2NjY3LDEzLjA1ODM2IDI5LjE2NjY3LDI5LjE2NjY2YzAsMTYuMTA4MzEgLTEzLjA1ODM2LDI5LjE2NjY2IC0yOS4xNjY2NywyOS4xNjY2NmMtMTYuMTA4MywwIC0yOS4xNjY2NywtMTMuMDU4MzYgLTI5LjE2NjY3LC0yOS4xNjY2NnoiIGZpbGw9IiNiZTllZmYiIHN0cm9rZT0iIzkwNjdlMCIgc3Ryb2tlLXdpZHRoPSI0LjUiLz48cGF0aCBkPSJNMzAxLjQzMzM0LDE4OS43MDgxNHYtMTkuOTg0NzNsMzEuNzMzMzMsLTQuNTQxOTlsLTAuOTA4NCwzMC43MDM4MnoiIGZpbGwtb3BhY2l0eT0iMC41NzI1NSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZWJlYmViIiBzdHJva2Utd2lkdGg9IjQiLz48cGF0aCBkPSJNMzE2LjUyLDE2Mi45MmMwLC0xLjY1Njg2IDEuMzQzMTQsLTMgMywtM2MxLjY1Njg2LDAgMywxLjM0MzE0IDMsM2MwLDEuNjU2ODYgLTEuMzQzMTQsMyAtMywzYy0xLjY1Njg2LDAgLTMsLTEuMzQzMTQgLTMsLTN6IiBmaWxsLW9wYWNpdHk9IjAuNTcyNTUiIGZpbGw9IiNmZjAwMDAiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cGF0aCBkPSJNMzIyLjkyLDE3Ni4xMmMwLC0xLjY1Njg2IDEuMzQzMTQsLTMgMywtM2MxLjY1Njg2LDAgMywxLjM0MzE0IDMsM2MwLDEuNjU2ODYgLTEuMzQzMTQsMyAtMywzYy0xLjY1Njg2LDAgLTMsLTEuMzQzMTQgLTMsLTN6IiBmaWxsLW9wYWNpdHk9IjAuNTcyNTUiIGZpbGw9IiNlZmZmMDAiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cGF0aCBkPSJNMzM2LjMyLDE4MS4zMmMwLC0xLjY1Njg2IDEuMzQzMTQsLTMgMywtM2MxLjY1Njg2LDAgMywxLjM0MzE0IDMsM2MwLDEuNjU2ODYgLTEuMzQzMTQsMyAtMywzYy0xLjY1Njg2LDAgLTMsLTEuMzQzMTQgLTMsLTN6IiBmaWxsLW9wYWNpdHk9IjAuNTcyNTUiIGZpbGw9IiMwMGZmMDkiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cGF0aCBkPSJNMzMyLjEyLDE2Ni43MmMwLC0xLjY1Njg2IDEuMzQzMTQsLTMgMywtM2MxLjY1Njg2LDAgMywxLjM0MzE0IDMsM2MwLDEuNjU2ODYgLTEuMzQzMTQsMyAtMywzYy0xLjY1Njg2LDAgLTMsLTEuMzQzMTQgLTMsLTN6IiBmaWxsLW9wYWNpdHk9IjAuNTcyNTUiIGZpbGw9IiMwMDQ2ZmYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L2c+PC9nPjwvc3ZnPg==',
                docsURI: 'https://learn.ccw.site/article/0940267f-9253-4e13-aab8-ccaeaf6e6aa6',
                blocks: [
                    { opcode: 'stopAll', blockType: Scratch.BlockType.COMMAND, text: '清除所有效果' },
                    {
                        opcode: 'resetEffect',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '重置 [EFFECT]',
                        arguments: { EFFECT: { type: Scratch.ArgumentType.STRING, menu: 'resetMenu' } }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: '── 舞台特效 ──' },
                    {
                        opcode: 'getStageValue',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '当前舞台 [STAGE_PROPERTY] 的值',
                        arguments: { STAGE_PROPERTY: { type: Scratch.ArgumentType.STRING, menu: 'stageMonitorMenu' } }
                    },
                    {
                        opcode: 'setStageFilter',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '将舞台 [FILTER] 设为 [VALUE]',
                        arguments: {
                            FILTER: { type: Scratch.ArgumentType.STRING, menu: 'filterMenu' },
                            VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                        }
                    },
                    {
                        opcode: 'setStageTransform1',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '舞台 [TRANSFORM1] [V]',
                        arguments: {
                            TRANSFORM1: { type: Scratch.ArgumentType.STRING, menu: 'transform1Menu' },
                            V: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
                        }
                    },
                    {
                        opcode: 'setStageTransform2',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '舞台 [TRANSFORM2] X:[X] Y:[Y]',
                        arguments: {
                            TRANSFORM2: { type: Scratch.ArgumentType.STRING, menu: 'transform2Menu' },
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                        }
                    },
                    {
                        opcode: 'setStage3D',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '舞台3D旋转 X:[X]° Y:[Y]° 透视:[P]px',
                        arguments: {
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            P: { type: Scratch.ArgumentType.NUMBER, defaultValue: 800 }
                        }
                    },
                    {
                        opcode: 'setStageOrigin',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '舞台变换原点 X:[X]% Y:[Y]%',
                        arguments: {
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: '── 网页特效 ──' },
                    {
                        opcode: 'getBodyValue',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '当前网页 [BODY_PROPERTY] 的值',
                        arguments: { BODY_PROPERTY: { type: Scratch.ArgumentType.STRING, menu: 'bodyMonitorMenu' } }
                    },
                    {
                        opcode: 'setBodyFilter',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '将网页 [FILTER] 设为 [VALUE]',
                        arguments: {
                            FILTER: { type: Scratch.ArgumentType.STRING, menu: 'filterMenu' },
                            VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                        }
                    },
                    {
                        opcode: 'setBodyTransform1',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '网页 [TRANSFORM1] [V]',
                        arguments: {
                            TRANSFORM1: { type: Scratch.ArgumentType.STRING, menu: 'transform1Menu' },
                            V: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
                        }
                    },
                    {
                        opcode: 'setBodyTransform2',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '网页 [TRANSFORM2] X:[X] Y:[Y]',
                        arguments: {
                            TRANSFORM2: { type: Scratch.ArgumentType.STRING, menu: 'transform2Menu' },
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                        }
                    },
                    {
                        opcode: 'setBody3D',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '网页3D旋转 X:[X]° Y:[Y]° 透视:[P]px',
                        arguments: {
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            P: { type: Scratch.ArgumentType.NUMBER, defaultValue: 800 }
                        }
                    },
                    {
                        opcode: 'setBgColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '网页遮罩 颜色:[COLOR] 透明度:[ALPHA]',
                        arguments: {
                            COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ff0000' },
                            ALPHA: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.3 }
                        }
                    },
                    {
                        opcode: 'setBodyOrigin',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '网页变换原点 X:[X]% Y:[Y]%',
                        arguments: {
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }
                        }
                    }
                ],
                menus: {
                    stageMonitorMenu: {
                        acceptReporters: true,
                        items: ['色相','反转','亮度','对比度','饱和度','模糊','灰度','棕褐色','不透明度','缩放','平移X','平移Y','旋转','倾斜X','倾斜Y','原点X','原点Y','3DX','3DY','透视']
                    },
                    bodyMonitorMenu: {
                        acceptReporters: true,
                        items: ['色相','反转','亮度','对比度','饱和度','模糊','灰度','棕褐色','不透明度','缩放','平移X','平移Y','旋转','倾斜X','倾斜Y','原点X','原点Y','3DX','3DY','透视','遮罩透明度']
                    },
                    resetMenu: {
                        acceptReporters: true,
                        items: ['舞台·全部滤镜','舞台·全部变换','舞台·3D旋转','舞台·原点','网页·全部滤镜','网页·全部变换','网页·3D旋转','网页·遮罩','网页·原点']
                    },
                    filterMenu: {
                        acceptReporters: true,
                        items: ['色相','反转','亮度','对比度','饱和度','模糊','灰度','棕褐色','不透明度']
                    },
                    transform1Menu: {
                        acceptReporters: true,
                        items: ['缩放','旋转']
                    },
                    transform2Menu: {
                        acceptReporters: true,
                        items: ['平移','倾斜']
                    }
                }
            };
        }

        getStageValue(args) {
            const p = args.STAGE_PROPERTY;
            switch (p) {
                case '色相': return this.state.sHue;
                case '反转': return this.state.sInvert;
                case '亮度': return this.state.sBrightness;
                case '对比度': return this.state.sContrast;
                case '饱和度': return this.state.sSaturate;
                case '模糊': return this.state.sBlur;
                case '灰度': return this.state.sGrayscale;
                case '棕褐色': return this.state.sSepia;
                case '不透明度': return this.state.sOpacity;
                case '缩放': return this.state.sScale;
                case '平移X': return this.state.sTranslateX;
                case '平移Y': return this.state.sTranslateY;
                case '旋转': return this.state.sRotate;
                case '倾斜X': return this.state.sSkewX;
                case '倾斜Y': return this.state.sSkewY;
                case '原点X': return this.state.sOriginX;
                case '原点Y': return this.state.sOriginY;
                case '3DX': return this.state.s3DX;
                case '3DY': return this.state.s3DY;
                case '透视': return this.state.sPersp;
                default: return 0;
            }
        }

        getBodyValue(args) {
            const p = args.BODY_PROPERTY;
            switch (p) {
                case '色相': return this.state.bHue;
                case '反转': return this.state.bInvert;
                case '亮度': return this.state.bBrightness;
                case '对比度': return this.state.bContrast;
                case '饱和度': return this.state.bSaturate;
                case '模糊': return this.state.bBlur;
                case '灰度': return this.state.bGrayscale;
                case '棕褐色': return this.state.bSepia;
                case '不透明度': return this.state.bOpacity;
                case '缩放': return this.state.bScale;
                case '平移X': return this.state.bTranslateX;
                case '平移Y': return this.state.bTranslateY;
                case '旋转': return this.state.bRotate;
                case '倾斜X': return this.state.bSkewX;
                case '倾斜Y': return this.state.bSkewY;
                case '原点X': return this.state.bOriginX;
                case '原点Y': return this.state.bOriginY;
                case '3DX': return this.state.b3DX;
                case '3DY': return this.state.b3DY;
                case '透视': return this.state.bPersp;
                case '遮罩透明度': return this.state.bBgAlpha;
                default: return 0;
            }
        }

        stopAll() {
            // 彻底卸载所有特效，恢复原始样式
            manager.resetAll();
            // 重置所有状态变量
            this.state.sHue=0; this.state.sInvert=0; this.state.sBrightness=1; this.state.sContrast=1;
            this.state.sSaturate=1; this.state.sBlur=0; this.state.sGrayscale=0; this.state.sSepia=0;
            this.state.sOpacity=1;
            this.state.sScale=1; this.state.sTranslateX=0; this.state.sTranslateY=0; this.state.sRotate=0;
            this.state.sSkewX=0; this.state.sSkewY=0; this.state.sOriginX=50; this.state.sOriginY=50;
            this.state.s3DX=0; this.state.s3DY=0; this.state.sPersp=800;
            this.state.bHue=0; this.state.bInvert=0; this.state.bBrightness=1; this.state.bContrast=1;
            this.state.bSaturate=1; this.state.bBlur=0; this.state.bGrayscale=0; this.state.bSepia=0;
            this.state.bOpacity=1;
            this.state.bScale=1; this.state.bTranslateX=0; this.state.bTranslateY=0; this.state.bRotate=0;
            this.state.bSkewX=0; this.state.bSkewY=0; this.state.bOriginX=50; this.state.bOriginY=50;
            this.state.b3DX=0; this.state.b3DY=0; this.state.bPersp=800; this.state.bBgAlpha=0;
        }

        resetEffect(args) {
            const e = args.EFFECT;
            switch (e) {
                case '舞台·全部滤镜':
                    this.state.sHue=0; this.state.sInvert=0; this.state.sBrightness=1; this.state.sContrast=1;
                    this.state.sSaturate=1; this.state.sBlur=0; this.state.sGrayscale=0; this.state.sSepia=0;
                    this.state.sOpacity=1;
                    manager.canvasFilters.clear();
                    break;
                case '舞台·全部变换':
                    this.state.sScale=1; this.state.sTranslateX=0; this.state.sTranslateY=0;
                    this.state.sRotate=0; this.state.sSkewX=0; this.state.sSkewY=0;
                    manager.canvasTransforms.clear();
                    break;
                case '舞台·3D旋转':
                    this.state.s3DX=0; this.state.s3DY=0;
                    manager.unregisterCanvasTransform('s3D');
                    break;
                case '舞台·原点':
                    this.state.sOriginX=50; this.state.sOriginY=50;
                    manager.setCanvasOrigin(50,50);
                    break;
                case '网页·全部滤镜':
                    this.state.bHue=0; this.state.bInvert=0; this.state.bBrightness=1; this.state.bContrast=1;
                    this.state.bSaturate=1; this.state.bBlur=0; this.state.bGrayscale=0; this.state.bSepia=0;
                    this.state.bOpacity=1;
                    manager.bodyFilters.clear();
                    break;
                case '网页·全部变换':
                    this.state.bScale=1; this.state.bTranslateX=0; this.state.bTranslateY=0;
                    this.state.bRotate=0; this.state.bSkewX=0; this.state.bSkewY=0;
                    manager.bodyTransforms.clear();
                    break;
                case '网页·3D旋转':
                    this.state.b3DX=0; this.state.b3DY=0;
                    manager.unregisterBodyTransform('b3D');
                    document.body.style.perspective = '';
                    break;
                case '网页·遮罩':
                    this.state.bBgAlpha=0;
                    manager.removeOverlay('bgColor');
                    break;
                case '网页·原点':
                    this.state.bOriginX=50; this.state.bOriginY=50;
                    manager.setBodyOrigin(50,50);
                    break;
            }
        }

        setStageFilter(args) { this._applyFilter('canvas', args.FILTER, Number(args.VALUE)); }
        setBodyFilter(args)  { this._applyFilter('body', args.FILTER, Number(args.VALUE)); }
        _applyFilter(target, filter, val) {
            const pre = target === 'canvas' ? 's' : 'b';
            const reg = target === 'canvas' ? manager.registerCanvasFilter.bind(manager) : manager.registerBodyFilter.bind(manager);
            const unreg = target === 'canvas' ? manager.unregisterCanvasFilter.bind(manager) : manager.unregisterBodyFilter.bind(manager);
            switch (filter) {
                case '色相':
                    this.state[pre+'Hue']=val;
                    if (val !== 0) reg(pre+'Hue', ()=>`hue-rotate(${val}deg)`);
                    else unreg(pre+'Hue');
                    break;
                case '反转':
                    const iv=val?1:0;
                    this.state[pre+'Invert']=iv;
                    if (iv !== 0) reg(pre+'Invert', ()=>`invert(${iv})`);
                    else unreg(pre+'Invert');
                    break;
                case '亮度':
                    this.state[pre+'Brightness']=val;
                    if (val !== 1) reg(pre+'Brightness', ()=>`brightness(${val})`);
                    else unreg(pre+'Brightness');
                    break;
                case '对比度':
                    this.state[pre+'Contrast']=val;
                    if (val !== 1) reg(pre+'Contrast', ()=>`contrast(${val})`);
                    else unreg(pre+'Contrast');
                    break;
                case '饱和度':
                    this.state[pre+'Saturate']=val;
                    if (val !== 1) reg(pre+'Saturate', ()=>`saturate(${val})`);
                    else unreg(pre+'Saturate');
                    break;
                case '模糊':
                    this.state[pre+'Blur']=val;
                    if (val > 0) reg(pre+'Blur', ()=>`blur(${val}px)`);
                    else unreg(pre+'Blur');
                    break;
                case '灰度':
                    const gv=Math.min(1,Math.max(0,val));
                    this.state[pre+'Grayscale']=gv;
                    if (gv > 0) reg(pre+'Grayscale', ()=>`grayscale(${gv})`);
                    else unreg(pre+'Grayscale');
                    break;
                case '棕褐色':
                    const sv=Math.min(1,Math.max(0,val));
                    this.state[pre+'Sepia']=sv;
                    if (sv > 0) reg(pre+'Sepia', ()=>`sepia(${sv})`);
                    else unreg(pre+'Sepia');
                    break;
                case '不透明度':
                    const ov=Math.min(1,Math.max(0,val));
                    this.state[pre+'Opacity']=ov;
                    if (ov < 1) reg(pre+'Opacity', ()=>`opacity(${ov})`);
                    else unreg(pre+'Opacity');
                    break;
            }
        }

        setStageTransform1(args) { this._applyTransform1('canvas', args.TRANSFORM1, Number(args.V)); }
        setBodyTransform1(args)  { this._applyTransform1('body', args.TRANSFORM1, Number(args.V)); }
        _applyTransform1(target, type, v) {
            const pre = target === 'canvas' ? 's' : 'b';
            const reg = target === 'canvas' ? manager.registerCanvasTransform.bind(manager) : manager.registerBodyTransform.bind(manager);
            const unreg = target === 'canvas' ? manager.unregisterCanvasTransform.bind(manager) : manager.unregisterBodyTransform.bind(manager);
            if (type === '缩放') {
                this.state[pre+'Scale']=v;
                if (v !== 1) reg(pre+'Scale', ()=>`scale(${v})`);
                else unreg(pre+'Scale');
            } else if (type === '旋转') {
                this.state[pre+'Rotate']=v;
                if (v !== 0) reg(pre+'Rotate', ()=>`rotate(${v}deg)`);
                else unreg(pre+'Rotate');
            }
        }

        setStageTransform2(args) { this._applyTransform2('canvas', args.TRANSFORM2, Number(args.X), Number(args.Y)); }
        setBodyTransform2(args)  { this._applyTransform2('body', args.TRANSFORM2, Number(args.X), Number(args.Y)); }
        _applyTransform2(target, type, x, y) {
            const pre = target === 'canvas' ? 's' : 'b';
            const reg = target === 'canvas' ? manager.registerCanvasTransform.bind(manager) : manager.registerBodyTransform.bind(manager);
            const unreg = target === 'canvas' ? manager.unregisterCanvasTransform.bind(manager) : manager.unregisterBodyTransform.bind(manager);
            if (type === '平移') {
                this.state[pre+'TranslateX']=x; this.state[pre+'TranslateY']=y;
                if (x !== 0 || y !== 0) reg(pre+'Translate', ()=>`translate(${x}px, ${y}px)`);
                else unreg(pre+'Translate');
            } else if (type === '倾斜') {
                this.state[pre+'SkewX']=x; this.state[pre+'SkewY']=y;
                if (x !== 0 || y !== 0) reg(pre+'Skew', ()=>`skew(${x}deg, ${y}deg)`);
                else unreg(pre+'Skew');
            }
        }

        setStage3D(args) {
            const x=Number(args.X)||0, y=Number(args.Y)||0, p=Math.max(1,Number(args.P)||800);
            this.state.s3DX=x; this.state.s3DY=y; this.state.sPersp=p;
            if (x !== 0 || y !== 0) {
                manager.registerCanvasTransform('s3D', ()=>`perspective(${p}px) rotateX(${x}deg) rotateY(${y}deg)`);
            } else {
                manager.unregisterCanvasTransform('s3D');
            }
        }
        setBody3D(args) {
            const x=Number(args.X)||0, y=Number(args.Y)||0, p=Math.max(1,Number(args.P)||800);
            this.state.b3DX=x; this.state.b3DY=y; this.state.bPersp=p;
            if (x !== 0 || y !== 0) {
                manager.setBodyPerspective(p);
                manager.registerBodyTransform('b3D', ()=>`rotateX(${x}deg) rotateY(${y}deg)`);
            } else {
                manager.unregisterBodyTransform('b3D');
                document.body.style.perspective = '';
            }
        }

        setStageOrigin(args) {
            const x=Math.min(100,Math.max(0,Number(args.X)||50)), y=Math.min(100,Math.max(0,Number(args.Y)||50));
            this.state.sOriginX=x; this.state.sOriginY=y;
            manager.setCanvasOrigin(x,y);
        }
        setBodyOrigin(args) {
            const x=Math.min(100,Math.max(0,Number(args.X)||50)), y=Math.min(100,Math.max(0,Number(args.Y)||50));
            this.state.bOriginX=x; this.state.bOriginY=y;
            manager.setBodyOrigin(x,y);
        }

        setBgColor(args) {
            const color=args.COLOR||'#ff0000', alpha=Math.min(1,Math.max(0,Number(args.ALPHA)||0.3));
            this.state.bBgAlpha=alpha;
            manager.removeOverlay('bgColor');
            if (alpha > 0) {
                const d=document.createElement('div');
                d.style.position='fixed'; d.style.top='0'; d.style.left='0'; d.style.width='100%'; d.style.height='100%';
                d.style.pointerEvents='none'; d.style.zIndex=5000; d.style.backgroundColor=color; d.style.opacity=alpha;
                document.body.appendChild(d);
                manager.addOverlay('bgColor', d, null);
            }
        }
    }

    Scratch.extensions.register(new AtomicVisuals());
})(Scratch);