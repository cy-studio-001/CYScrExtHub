(function (_Scratch) {
    const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = _Scratch;

    // 翻译设置 - 支持中英文
    translate.setup({
        zh: {
            'extensionName': '角色动画',
            // 基础动画
            'flyInAnimation': '角色飞入动画: 从X[START_X] Y[START_Y] 到X[END_X] Y[END_Y] 持续[DURATION]秒',
            'flyOutAnimation': '角色飞出动画: 从当前位置到X[END_X] Y[END_Y] 持续[DURATION]秒',
            'fadeInAnimation': '角色淡入动画: 持续[DURATION]秒',
            'fadeOutAnimation': '角色淡出动画: 持续[DURATION]秒',
            'scaleAnimation': '角色缩放动画: 从[START_SCALE]倍到[END_SCALE]倍 持续[DURATION]秒',
            'rotateAnimation': '角色旋转动画: 从[START_ANGLE]度到[END_ANGLE]度 持续[DURATION]秒',
            'slideAnimation': '角色滑动动画: 从X[START_X] Y[START_Y] 到X[END_X] Y[END_Y] 持续[DURATION]秒',
            
            // 高级动画
            'bounceAnimation': '角色弹跳动画: 从X[START_X] Y[START_Y] 到X[END_X] Y[END_Y] 弹跳[BOUNCE_COUNT]次 持续[DURATION]秒',
            'blindsAnimation': '角色百叶窗动画: 数量[BLIND_COUNT] 持续[DURATION]秒',
            'pulseAnimation': '角色脉动动画: 缩放[SCALE_FACTOR]倍 持续[PERIOD]秒 重复[REPEAT_COUNT]次',
            'wiggleAnimation': '角色摇摆动画: 幅度[ANGLE]度 持续[PERIOD]秒 重复[REPEAT_COUNT]次',
            'colorFadeAnimation': '角色颜色渐变: 从[START_COLOR]到[END_COLOR] 持续[DURATION]秒',
            'shakeAnimation': '角色抖动动画: 幅度[INTENSITY] 持续[DURATION]秒',
            'flashAnimation': '角色闪烁动画: 次数[FLASH_COUNT] 间隔[INTERVAL]秒',
            'dissolveAnimation': '角色溶解动画: 持续[DURATION]秒',
            'flip3DAnimation': '角色3D翻转: 持续[DURATION]秒',
            'heartbeatAnimation': '角色心跳动画: 持续[PERIOD]秒 重复[REPEAT_COUNT]次',
            'waveAnimation': '角色波浪动画: 幅度[AMPLITUDE] 周期[PERIOD]秒 持续[DURATION]秒',
            'boxAnimation': '角色盒状动画: 大小[BOX_SIZE] 持续[DURATION]秒',
            'checkerboardAnimation': '角色棋盘动画: 格子[GRID_SIZE] 持续[DURATION]秒',
            'numberAnimation': '角色数字动画: 从[NUMBER_START]到[NUMBER_END] 持续[DURATION]秒',
            'wipeAnimation': '角色擦除动画: 方向[WIPE_DIRECTION] 持续[DURATION]秒',
            'fanAnimation': '角色扇形展开动画: 角度[FAN_ANGLE] 持续[DURATION]秒',
            'randomLinesAnimation': '角色随机线条动画: 线条数[LINE_COUNT] 持续[DURATION]秒',
            
            // 辅助功能
            'stopAllAnimations': '停止角色所有动画',
            'restoreOriginalState': '恢复角色原状',
            
            // 方向翻译
            'directionRight': '右',
            'directionLeft': '左',
            'directionUp': '上',
            'directionDown': '下',
            
            // 默认值
            'startX_default': '-240',
            'startY_default': '0',
            'endX_default': '0',
            'endY_default': '0',
            'duration_default': '1',
            'bounceCount_default': '3',
            'startScale_default': '0.5',
            'endScale_default': '1',
            'blindCount_default': '10',
            'scaleFactor_default': '1.2',
            'period_default': '1',
            'repeatCount_default': '3',
            'startAngle_default': '0',
            'endAngle_default': '360',
            'angle_default': '15',
            'startColor_default': '0',
            'endColor_default': '100',
            'intensity_default': '5',
            'flashCount_default': '3',
            'interval_default': '0.2',
            'amplitude_default': '20',
            
            // 新增默认值
            'boxSize_default': '50',
            'gridSize_default': '8',
            'numberStart_default': '0',
            'numberEnd_default': '100',
            'wipeDirection_default': 'right',
            'fanAngle_default': '180',
            'lineCount_default': '20'
        },
        en: {
            'extensionName': 'Sprite Animation',
            // 基础动画
            'flyInAnimation': 'sprite fly in: from X[START_X] Y[START_Y] to X[END_X] Y[END_Y] over [DURATION]s',
            'flyOutAnimation': 'sprite fly out: from current position to X[END_X] Y[END_Y] over [DURATION]s',
            'fadeInAnimation': 'sprite fade in: over [DURATION]s',
            'fadeOutAnimation': 'sprite fade out: over [DURATION]s',
            'scaleAnimation': 'sprite scale: from [START_SCALE]x to [END_SCALE]x over [DURATION]s',
            'rotateAnimation': 'sprite rotate: from [START_ANGLE]° to [END_ANGLE]° over [DURATION]s',
            'slideAnimation': 'sprite slide: from X[START_X] Y[START_Y] to X[END_X] Y[END_Y] over [DURATION]s',
            
            // 高级动画
            'bounceAnimation': 'sprite bounce: from X[START_X] Y[START_Y] to X[END_X] Y[END_Y] [BOUNCE_COUNT] times over [DURATION]s',
            'blindsAnimation': 'sprite blinds effect: [BLIND_COUNT] strips over [DURATION]s',
            'pulseAnimation': 'sprite pulse: scale [SCALE_FACTOR]x every [PERIOD]s, repeat [REPEAT_COUNT] times',
            'wiggleAnimation': 'sprite wiggle: [ANGLE]° amplitude every [PERIOD]s, repeat [REPEAT_COUNT] times',
            'colorFadeAnimation': 'sprite color fade: from [START_COLOR] to [END_COLOR] over [DURATION]s',
            'shakeAnimation': 'sprite shake: intensity [INTENSITY] over [DURATION]s',
            'flashAnimation': 'sprite flash: [FLASH_COUNT] times with [INTERVAL]s interval',
            'dissolveAnimation': 'sprite dissolve effect: over [DURATION]s',
            'flip3DAnimation': 'sprite 3D flip: over [DURATION]s',
            'heartbeatAnimation': 'sprite heartbeat: every [PERIOD]s, repeat [REPEAT_COUNT] times',
            'waveAnimation': 'sprite wave: amplitude [AMPLITUDE] with [PERIOD]s cycle over [DURATION]s',
            'boxAnimation': 'sprite box effect: size [BOX_SIZE] over [DURATION]s',
            'checkerboardAnimation': 'sprite checkerboard: grid [GRID_SIZE] over [DURATION]s',
            'numberAnimation': 'sprite number animation: from [NUMBER_START] to [NUMBER_END] over [DURATION]s',
            'wipeAnimation': 'sprite wipe effect: direction [WIPE_DIRECTION] over [DURATION]s',
            'fanAnimation': 'sprite fan effect: angle [FAN_ANGLE]° over [DURATION]s',
            'randomLinesAnimation': 'sprite random lines: [LINE_COUNT] lines over [DURATION]s',
            
            // 辅助功能
            'stopAllAnimations': 'stop all sprite animations',
            'restoreOriginalState': 'restore sprite to original state',
            
            // 方向翻译
            'directionRight': 'Right',
            'directionLeft': 'Left',
            'directionUp': 'Up',
            'directionDown': 'Down',
            
            // 默认值
            'startX_default': '-240',
            'startY_default': '0',
            'endX_default': '0',
            'endY_default': '0',
            'duration_default': '1',
            'bounceCount_default': '3',
            'startScale_default': '0.5',
            'endScale_default': '1',
            'blindCount_default': '10',
            'scaleFactor_default': '1.2',
            'period_default': '1',
            'repeatCount_default': '3',
            'startAngle_default': '0',
            'endAngle_default': '360',
            'angle_default': '15',
            'startColor_default': '0',
            'endColor_default': '100',
            'intensity_default': '5',
            'flashCount_default': '3',
            'interval_default': '0.2',
            'amplitude_default': '20',
            'boxSize_default': '50',
            'gridSize_default': '8',
            'numberStart_default': '0',
            'numberEnd_default': '100',
            'wipeDirection_default': 'right',
            'fanAngle_default': '180',
            'lineCount_default': '20'
        }
    });

    class AnimationExtension {
        constructor (_runtime) {
            this._runtime = _runtime;
            // 存储正在运行的动画，防止冲突
            this.activeAnimations = new Map();
            // 存储角色初始状态，用于恢复原状
            this.originalStates = new Map();
            // 存储临时造型ID，用于数字动画
            this.tempCostumeIds = new Map();
        }

        getInfo () {
            // 基础动画积木 - 简单直观的动画效果
            const basicAnimations = [
                {
                    opcode: 'flyInAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'flyInAnimation'}),
                    arguments: {
                        START_X: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'startX_default'}) },
                        START_Y: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'startY_default'}) },
                        END_X: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'endX_default'}) },
                        END_Y: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'endY_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'flyOutAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'flyOutAnimation'}),
                    arguments: {
                        END_X: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'endX_default'}) },
                        END_Y: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'endY_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'fadeInAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'fadeInAnimation'}),
                    arguments: {
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'fadeOutAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'fadeOutAnimation'}),
                    arguments: {
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'scaleAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'scaleAnimation'}),
                    arguments: {
                        START_SCALE: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'startScale_default'}) },
                        END_SCALE: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'endScale_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'rotateAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'rotateAnimation'}),
                    arguments: {
                        START_ANGLE: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'startAngle_default'}) },
                        END_ANGLE: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'endAngle_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'slideAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'slideAnimation'}),
                    arguments: {
                        START_X: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'startX_default'}) },
                        START_Y: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'startY_default'}) },
                        END_X: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'endX_default'}) },
                        END_Y: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'endY_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                }
            ];

            // 高级动画积木 - 更复杂的特效动画
            const advancedAnimations = [
                {
                    opcode: 'bounceAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'bounceAnimation'}),
                    arguments: {
                        START_X: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'startX_default'}) },
                        START_Y: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'startY_default'}) },
                        END_X: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'endX_default'}) },
                        END_Y: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'endY_default'}) },
                        BOUNCE_COUNT: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'bounceCount_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'blindsAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'blindsAnimation'}),
                    arguments: {
                        BLIND_COUNT: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'blindCount_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'pulseAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'pulseAnimation'}),
                    arguments: {
                        SCALE_FACTOR: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'scaleFactor_default'}) },
                        PERIOD: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'period_default'}) },
                        REPEAT_COUNT: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'repeatCount_default'}) }
                    }
                },
                {
                    opcode: 'wiggleAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'wiggleAnimation'}),
                    arguments: {
                        ANGLE: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'angle_default'}) },
                        PERIOD: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'period_default'}) },
                        REPEAT_COUNT: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'repeatCount_default'}) }
                    }
                },
                {
                    opcode: 'colorFadeAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'colorFadeAnimation'}),
                    arguments: {
                        START_COLOR: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'startColor_default'}) },
                        END_COLOR: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'endColor_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'shakeAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'shakeAnimation'}),
                    arguments: {
                        INTENSITY: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'intensity_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'flashAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'flashAnimation'}),
                    arguments: {
                        FLASH_COUNT: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'flashCount_default'}) },
                        INTERVAL: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'interval_default'}) }
                    }
                },
                {
                    opcode: 'dissolveAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'dissolveAnimation'}),
                    arguments: {
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'flip3DAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'flip3DAnimation'}),
                    arguments: {
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'heartbeatAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'heartbeatAnimation'}),
                    arguments: {
                        PERIOD: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'period_default'}) },
                        REPEAT_COUNT: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'repeatCount_default'}) }
                    }
                },
                {
                    opcode: 'waveAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'waveAnimation'}),
                    arguments: {
                        AMPLITUDE: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'amplitude_default'}) },
                        PERIOD: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'period_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'boxAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'boxAnimation'}),
                    arguments: {
                        BOX_SIZE: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'boxSize_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'checkerboardAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'checkerboardAnimation'}),
                    arguments: {
                        GRID_SIZE: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'gridSize_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'numberAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'numberAnimation'}),
                    arguments: {
                        NUMBER_START: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'numberStart_default'}) },
                        NUMBER_END: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'numberEnd_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'wipeAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'wipeAnimation'}),
                    arguments: {
                        WIPE_DIRECTION: { 
                            type: ArgumentType.STRING, 
                            defaultValue: translate({id: 'wipeDirection_default'}),
                            menu: {
                                items: [
                                    {value: 'right', text: translate({id: 'directionRight'})},
                                    {value: 'left', text: translate({id: 'directionLeft'})},
                                    {value: 'up', text: translate({id: 'directionUp'})},
                                    {value: 'down', text: translate({id: 'directionDown'})}
                                ]
                            }
                        },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'fanAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'fanAnimation'}),
                    arguments: {
                        FAN_ANGLE: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'fanAngle_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                },
                {
                    opcode: 'randomLinesAnimation',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'randomLinesAnimation'}),
                    arguments: {
                        LINE_COUNT: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'lineCount_default'}) },
                        DURATION: { type: ArgumentType.NUMBER, defaultValue: translate({id: 'duration_default'}) }
                    }
                }
            ];

            // 辅助功能积木 - 动画控制和状态管理
            const utilityFunctions = [
                {
                    opcode: 'stopAllAnimations',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'stopAllAnimations'})
                },
                {
                    opcode: 'restoreOriginalState',
                    blockType: BlockType.COMMAND,
                    text: translate({id: 'restoreOriginalState'})
                }
            ];

            return {
                id: 'spriteAnimations',
                color1: '#4A90E2',
                color2: '#3066BE',
                name: translate({id: 'extensionName'}),
                blocks: [
                    ...basicAnimations,
                    ...advancedAnimations,
                    ...utilityFunctions
                ]
            };
        }

        /**
         * 保存角色初始状态
         */
        saveOriginalState(target) {
            if (!this.originalStates.has(target.id)) {
                this.originalStates.set(target.id, {
                    x: target.x,
                    y: target.y,
                    size: target.size,
                    direction: target.direction,
                    color: target.effects.color || 0,
                    ghost: target.effects.ghost || 0,
                    pixelate: target.effects.pixelate || 0,
                    mosaic: target.effects.mosaic || 0,
                    currentCostume: target.currentCostume,
                    name: target.name
                });
            }
        }

        /**
         * 恢复角色原状
         */
        restoreOriginalState(args, util) {
            const target = util.target;
            this.stopAnimations(target.id);
            
            this.saveOriginalState(target);
            
            const originalState = this.originalStates.get(target.id);
            if (originalState) {
                target.setXY(originalState.x, originalState.y);
                target.size = originalState.size;
                target.setDirection(originalState.direction);
                target.setEffect('color', originalState.color);
                target.setEffect('ghost', originalState.ghost);
                target.setEffect('pixelate', originalState.pixelate);
                target.setEffect('mosaic', originalState.mosaic);
                target.currentCostume = originalState.currentCostume;
                target.name = originalState.name;
                
                if (this.tempCostumeIds.has(target.id)) {
                    const tempCostumeId = this.tempCostumeIds.get(target.id);
                    const index = target.sprite.costumes.findIndex(c => c.assetId === tempCostumeId);
                    if (index !== -1) {
                        target.sprite.costumes.splice(index, 1);
                    }
                    this.tempCostumeIds.delete(target.id);
                }
            }
        }

        /**
         * 盒状动画
         */
        boxAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const boxSize = Math.max(10, Math.min(200, Cast.toNumber(args.BOX_SIZE)));
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalSize = target.size;
            const originalX = target.x;
            const originalY = target.y;
            
            const centerX = originalX;
            const centerY = originalY;
            
            target.size = boxSize;
            target.setXY(centerX, centerY);
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeProgress = progress < 0.5 
                    ? 4 * progress * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                const currentSize = boxSize + (originalSize - boxSize) * easeProgress;
                
                target.size = currentSize;
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'box'});
                } else {
                    target.size = originalSize;
                    target.setXY(originalX, originalY);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'box'});
        }

        /**
         * 棋盘动画
         */
        checkerboardAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const gridSize = Math.max(2, Math.min(30, Cast.toNumber(args.GRID_SIZE)));
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalGhost = target.effects.ghost || 0;
            const originalMosaic = target.effects.mosaic || 0;
            
            target.setEffect('ghost', 100);
            target.setEffect('mosaic', gridSize);
            
            const startTime = Date.now();
            
            const totalCells = gridSize * gridSize;
            const cellOrder = [];
            
            for (let i = 0; i < totalCells; i++) {
                const row = Math.floor(i / gridSize);
                const col = i % gridSize;
                if ((row % 2 === 0 && col % 2 === 0) || (row % 2 === 1 && col % 2 === 1)) {
                    cellOrder.push(i);
                }
            }
            for (let i = 0; i < totalCells; i++) {
                const row = Math.floor(i / gridSize);
                const col = i % gridSize;
                if ((row % 2 === 0 && col % 2 === 1) || (row % 2 === 1 && col % 2 === 0)) {
                    cellOrder.push(i);
                }
            }
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const cellsToShow = Math.floor(progress * totalCells);
                const visibility = cellsToShow / totalCells;
                
                target.setEffect('mosaic', Math.max(0, gridSize - Math.floor(gridSize * visibility)));
                target.setEffect('ghost', 100 - (visibility * 100));
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'checkerboard'});
                } else {
                    target.setEffect('ghost', originalGhost);
                    target.setEffect('mosaic', originalMosaic);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'checkerboard'});
        }

        /**
         * 数字动画
         */
        numberAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const startNum = Cast.toNumber(args.NUMBER_START);
            const endNum = Cast.toNumber(args.NUMBER_END);
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalCostumeIndex = target.currentCostumeIndex;
            
            const createNumberCostume = async (number) => {
                try {
                    if (this.tempCostumeIds.has(targetId)) {
                        const tempCostumeId = this.tempCostumeIds.get(targetId);
                        const index = target.sprite.costumes.findIndex(c => c.assetId === tempCostumeId);
                        if (index !== -1) {
                            target.sprite.costumes.splice(index, 1);
                        }
                    }
                    
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 100;
                    canvas.height = 50;
                    
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'black';
                    ctx.font = '30px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(Math.round(number).toString(), canvas.width / 2, canvas.height / 2);
                    
                    const dataUrl = canvas.toDataURL('image/png');
                    
                    const costumeId = `number-costume-${Date.now()}`;
                    const costume = {
                        name: `number-${number}`,
                        assetId: costumeId,
                        dataFormat: 'image/png',
                        url: dataUrl
                    };
                    
                    target.sprite.costumes.push(costume);
                    this.tempCostumeIds.set(targetId, costumeId);
                    
                    target.currentCostumeIndex = target.sprite.costumes.length - 1;
                } catch (e) {
                    console.error('创建数字造型失败:', e);
                    target.name = Math.round(number).toString();
                }
            };
            
            createNumberCostume(startNum);
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) {
                    if (this.tempCostumeIds.has(targetId)) {
                        const tempCostumeId = this.tempCostumeIds.get(targetId);
                        const index = target.sprite.costumes.findIndex(c => c.assetId === tempCostumeId);
                        if (index !== -1) {
                            target.sprite.costumes.splice(index, 1);
                        }
                        this.tempCostumeIds.delete(targetId);
                        target.currentCostumeIndex = originalCostumeIndex;
                    }
                    return;
                }
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const currentNum = startNum + (endNum - startNum) * progress;
                createNumberCostume(currentNum);
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'number'});
                } else {
                    createNumberCostume(endNum);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'number'});
        }

        /**
         * 百叶窗动画
         */
        blindsAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const blindCount = Math.max(2, Math.min(50, Cast.toNumber(args.BLIND_COUNT)));
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalGhost = target.effects.ghost || 0;
            const originalMosaic = target.effects.mosaic || 0;
            
            target.setEffect('ghost', 100);
            target.setEffect('mosaic', blindCount);
            
            const startTime = Date.now();
            
            const blindOrder = Array.from({length: blindCount}, (_, i) => i)
                .sort(() => Math.random() - 0.5);
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const blindsToShow = Math.floor(progress * blindCount);
                const visibility = blindsToShow / blindCount;
                
                target.setEffect('mosaic', Math.max(0, blindCount - blindsToShow));
                target.setEffect('ghost', 100 - (visibility * 100));
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'blinds'});
                } else {
                    target.setEffect('ghost', originalGhost);
                    target.setEffect('mosaic', originalMosaic);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'blinds'});
        }

        /**
         * 扇形展开动画
         */
        fanAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const fanAngle = Cast.toNumber(args.FAN_ANGLE);
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalDirection = target.direction;
            const originalSize = target.size;
            const originalX = target.x;
            const originalY = target.y;
            
            const startAngle = originalDirection - fanAngle / 2;
            const endAngle = originalDirection + fanAngle / 2;
            
            target.setDirection(startAngle);
            target.size = originalSize * 0.1;
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
                
                const currentAngle = startAngle + (endAngle - startAngle) * easeProgress;
                const currentSize = originalSize * easeProgress;
                
                const radians = (currentAngle - originalDirection) * Math.PI / 180;
                const radius = (originalSize * 0.5) * easeProgress;
                const offsetX = Math.sin(radians) * radius;
                const offsetY = -Math.cos(radians) * radius;
                
                target.setDirection(currentAngle);
                target.size = currentSize;
                target.setXY(originalX + offsetX, originalY + offsetY);
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'fan'});
                } else {
                    target.setDirection(endAngle);
                    target.size = originalSize;
                    target.setXY(originalX, originalY);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'fan'});
        }

        /**
         * 随机线条动画
         */
        randomLinesAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const lineCount = Math.max(5, Math.min(100, Cast.toNumber(args.LINE_COUNT)));
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalOpacity = target.effects.ghost || 0;
            const originalPixelate = target.effects.pixelate || 0;
            
            target.setEffect('pixelate', 100);
            target.setEffect('ghost', 100);
            
            const lineTimes = Array.from({length: lineCount}, () => Math.random());
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const visibleLines = lineTimes.filter(time => time <= progress).length;
                const visibility = visibleLines / lineCount;
                
                target.setEffect('pixelate', 100 - visibility * 100);
                target.setEffect('ghost', 100 - visibility * 100);
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'randomLines'});
                } else {
                    target.setEffect('ghost', originalOpacity);
                    target.setEffect('pixelate', originalPixelate);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'randomLines'});
        }

        /**
         * 擦除动画
         */
        wipeAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const direction = Cast.toString(args.WIPE_DIRECTION);
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalOpacity = target.effects.ghost || 0;
            const originalSize = target.size;
            const originalX = target.x;
            const originalY = target.y;
            
            target.setEffect('ghost', 0);
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                switch(direction) {
                    case 'right':
                        target.size = originalSize * (1 - progress);
                        target.x = originalX + (originalSize * progress) / 40;
                        break;
                    case 'left':
                        target.size = originalSize * (1 - progress);
                        target.x = originalX - (originalSize * progress) / 40;
                        break;
                    case 'up':
                        target.setEffect('pixelate', progress * 100);
                        target.setEffect('ghost', progress * 100);
                        break;
                    case 'down':
                        target.setEffect('pixelate', progress * 100);
                        target.setEffect('ghost', progress * 100);
                        break;
                }
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'wipe'});
                } else {
                    target.setEffect('ghost', 100);
                    target.size = originalSize;
                    target.setXY(originalX, originalY);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'wipe'});
        }

        /**
         * 停止指定角色的所有动画
         */
        stopAnimations(targetId) {
            if (this.activeAnimations.has(targetId)) {
                const animation = this.activeAnimations.get(targetId);
                cancelAnimationFrame(animation.frameId);
                this.activeAnimations.delete(targetId);
            }
        }

        /**
         * 停止所有动画
         */
        stopAllAnimations(args, util) {
            const target = util.target;
            this.stopAnimations(target.id);
        }

        /**
         * 角色飞入动画
         */
        flyInAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const startX = Cast.toNumber(args.START_X);
            const startY = Cast.toNumber(args.START_Y);
            const endX = Cast.toNumber(args.END_X);
            const endY = Cast.toNumber(args.END_Y);
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalSize = target.size;
            target.size = originalSize * 0.5;
            target.setXY(startX, startY);
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                const currentX = startX + (endX - startX) * easeProgress;
                const currentY = startY + (endY - startY) * easeProgress;
                const currentSize = originalSize * (0.5 + 0.5 * easeProgress);
                
                target.setXY(currentX, currentY);
                target.size = currentSize;
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'flyIn'});
                } else {
                    target.setXY(endX, endY);
                    target.size = originalSize;
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'flyIn'});
        }

        /**
         * 角色飞出动画
         */
        flyOutAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const endX = Cast.toNumber(args.END_X);
            const endY = Cast.toNumber(args.END_Y);
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const startX = target.x;
            const startY = target.y;
            const originalSize = target.size;
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeProgress = Math.pow(progress, 2);
                
                const currentX = startX + (endX - startX) * easeProgress;
                const currentY = startY + (endY - startY) * easeProgress;
                const currentSize = originalSize * (1 - 0.8 * easeProgress);
                
                target.setXY(currentX, currentY);
                target.size = currentSize;
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'flyOut'});
                } else {
                    target.setXY(endX, endY);
                    target.size = originalSize * 0.2;
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'flyOut'});
        }

        /**
         * 角色淡入动画
         */
        fadeInAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalGhost = target.effects.ghost || 0;
            target.setEffect('ghost', 100);
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeProgress = 1 - Math.cos(progress * Math.PI / 2);
                
                const currentGhost = 100 - (100 - originalGhost) * easeProgress;
                target.setEffect('ghost', currentGhost);
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'fadeIn'});
                } else {
                    target.setEffect('ghost', originalGhost);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'fadeIn'});
        }

        /**
         * 角色淡出动画
         */
        fadeOutAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalGhost = target.effects.ghost || 0;
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeProgress = Math.sin(progress * Math.PI / 2);
                
                const currentGhost = originalGhost + (100 - originalGhost) * easeProgress;
                target.setEffect('ghost', currentGhost);
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'fadeOut'});
                } else {
                    target.setEffect('ghost', 100);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'fadeOut'});
        }

        /**
         * 角色弹跳动画
         */
        bounceAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const startX = Cast.toNumber(args.START_X);
            const startY = Cast.toNumber(args.START_Y);
            const endX = Cast.toNumber(args.END_X);
            const endY = Cast.toNumber(args.END_Y);
            const bounceCount = Math.max(1, Math.min(10, Cast.toNumber(args.BOUNCE_COUNT)));
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            target.setXY(startX, startY);
            
            const startTime = Date.now();
            const totalBounces = bounceCount;
            const distanceX = endX - startX;
            const distanceY = endY - startY;
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const bounceProgress = progress * totalBounces;
                const bounceNumber = Math.floor(bounceProgress);
                const withinBounce = bounceProgress - bounceNumber;
                
                const heightFactor = Math.max(0, 1 - bounceNumber / totalBounces);
                const bounceY = Math.sin(withinBounce * Math.PI) * heightFactor * 50;
                
                const currentX = startX + distanceX * progress;
                const currentY = startY + distanceY * progress - bounceY;
                
                target.setXY(currentX, currentY);
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'bounce'});
                } else {
                    target.setXY(endX, endY);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'bounce'});
        }

        /**
         * 角色缩放动画
         */
        scaleAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const startScale = Math.max(0.1, Math.min(5, Cast.toNumber(args.START_SCALE)));
            const endScale = Math.max(0.1, Math.min(5, Cast.toNumber(args.END_SCALE)));
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalSize = target.size;
            target.size = originalSize * startScale;
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeProgress = progress < 0.5 
                    ? 4 * progress * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                const currentScale = startScale + (endScale - startScale) * easeProgress;
                target.size = originalSize * currentScale;
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'scale'});
                } else {
                    target.size = originalSize * endScale;
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'scale'});
        }

        /**
         * 角色脉动动画
         */
        pulseAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const scaleFactor = Math.max(1.1, Math.min(3, Cast.toNumber(args.SCALE_FACTOR)));
            const period = Math.max(0.1, Cast.toNumber(args.PERIOD) * 1000);
            const repeatCount = Math.max(1, Math.min(20, Cast.toNumber(args.REPEAT_COUNT)));
            
            const originalSize = target.size;
            const totalDuration = period * repeatCount;
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                
                if (elapsed >= totalDuration) {
                    target.size = originalSize;
                    this.activeAnimations.delete(targetId);
                    return;
                }
                
                const cycleProgress = (elapsed % period) / period;
                const scale = 1 + (scaleFactor - 1) * Math.sin(cycleProgress * Math.PI);
                target.size = originalSize * scale;
                
                const frameId = requestAnimationFrame(animate);
                this.activeAnimations.set(targetId, {frameId, type: 'pulse'});
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'pulse'});
        }

        /**
         * 角色旋转动画
         */
        rotateAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const startAngle = Cast.toNumber(args.START_ANGLE);
            const endAngle = Cast.toNumber(args.END_ANGLE);
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            target.setDirection(startAngle);
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
                
                const currentAngle = startAngle + (endAngle - startAngle) * easeProgress;
                target.setDirection(currentAngle);
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'rotate'});
                } else {
                    target.setDirection(endAngle);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'rotate'});
        }

        /**
         * 角色摇摆动画
         */
        wiggleAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const angle = Math.max(1, Math.min(90, Cast.toNumber(args.ANGLE)));
            const period = Math.max(0.1, Cast.toNumber(args.PERIOD) * 1000);
            const repeatCount = Math.max(1, Math.min(20, Cast.toNumber(args.REPEAT_COUNT)));
            
            const originalDirection = target.direction;
            const totalDuration = period * repeatCount;
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                
                if (elapsed >= totalDuration) {
                    target.setDirection(originalDirection);
                    this.activeAnimations.delete(targetId);
                    return;
                }
                
                const cycleProgress = (elapsed % period) / period;
                const currentAngle = originalDirection + angle * Math.sin(cycleProgress * 2 * Math.PI);
                target.setDirection(currentAngle);
                
                const frameId = requestAnimationFrame(animate);
                this.activeAnimations.set(targetId, {frameId, type: 'wiggle'});
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'wiggle'});
        }

        /**
         * 角色颜色渐变动画
         */
        colorFadeAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const startColor = Cast.toNumber(args.START_COLOR);
            const endColor = Cast.toNumber(args.END_COLOR);
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            target.setEffect('color', startColor);
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const currentColor = startColor + (endColor - startColor) * progress;
                target.setEffect('color', currentColor);
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'colorFade'});
                } else {
                    target.setEffect('color', endColor);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'colorFade'});
        }

        /**
         * 角色抖动动画
         */
        shakeAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const intensity = Math.max(1, Math.min(20, Cast.toNumber(args.INTENSITY)));
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalX = target.x;
            const originalY = target.y;
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const shakeIntensity = intensity * (1 - progress);
                const shakeX = (Math.random() - 0.5) * 2 * shakeIntensity;
                const shakeY = (Math.random() - 0.5) * 2 * shakeIntensity;
                
                target.setXY(originalX + shakeX, originalY + shakeY);
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'shake'});
                } else {
                    target.setXY(originalX, originalY);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'shake'});
        }

        /**
         * 角色闪烁动画
         */
        flashAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const flashCount = Math.max(1, Math.min(20, Cast.toNumber(args.FLASH_COUNT)));
            const interval = Math.max(0.05, Cast.toNumber(args.INTERVAL) * 1000);
            
            const originalGhost = target.effects.ghost || 0;
            let flashState = 0;
            let flashNumber = 0;
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                
                if (flashNumber >= flashCount * 2) {
                    target.setEffect('ghost', originalGhost);
                    this.activeAnimations.delete(targetId);
                    return;
                }
                
                const intervalCount = Math.floor(elapsed / interval);
                if (intervalCount > flashNumber) {
                    flashNumber = intervalCount;
                    flashState = 1 - flashState;
                    target.setEffect('ghost', flashState ? 0 : 100);
                }
                
                const frameId = requestAnimationFrame(animate);
                this.activeAnimations.set(targetId, {frameId, type: 'flash'});
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'flash'});
        }

        /**
         * 角色溶解动画
         */
        dissolveAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalGhost = target.effects.ghost || 0;
            const originalPixelate = target.effects.pixelate || 0;
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                target.setEffect('ghost', originalGhost + (100 - originalGhost) * progress);
                target.setEffect('pixelate', originalPixelate + (100 - originalPixelate) * progress);
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'dissolve'});
                } else {
                    target.setEffect('ghost', 100);
                    target.setEffect('pixelate', 100);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'dissolve'});
        }

        /**
         * 角色滑动动画
         */
        slideAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const startX = Cast.toNumber(args.START_X);
            const startY = Cast.toNumber(args.START_Y);
            const endX = Cast.toNumber(args.END_X);
            const endY = Cast.toNumber(args.END_Y);
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            target.setXY(startX, startY);
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
                
                const currentX = startX + (endX - startX) * easeProgress;
                const currentY = startY + (endY - startY) * easeProgress;
                
                target.setXY(currentX, currentY);
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'slide'});
                } else {
                    target.setXY(endX, endY);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'slide'});
        }

        /**
         * 角色3D翻转动画
         */
        flip3DAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalSize = target.size;
            const originalX = target.x;
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const scale = Math.cos((progress - 0.5) * Math.PI);
                const xOffset = originalSize * 0.5 * (1 - scale);
                
                target.size = originalSize * scale;
                target.x = originalX + xOffset;
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'flip3D'});
                } else {
                    target.size = originalSize;
                    target.x = originalX;
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'flip3D'});
        }

        /**
         * 角色心跳动画
         */
        heartbeatAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const period = Math.max(0.3, Cast.toNumber(args.PERIOD) * 1000);
            const repeatCount = Math.max(1, Math.min(20, Cast.toNumber(args.REPEAT_COUNT)));
            
            const originalSize = target.size;
            const totalDuration = period * repeatCount;
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                
                if (elapsed >= totalDuration) {
                    target.size = originalSize;
                    this.activeAnimations.delete(targetId);
                    return;
                }
                
                const cycleProgress = (elapsed % period) / period;
                let scale;
                
                if (cycleProgress < 0.3) {
                    scale = 1 + 0.5 * (cycleProgress / 0.3);
                } else if (cycleProgress < 0.5) {
                    scale = 1.5 - 1 * ((cycleProgress - 0.3) / 0.2);
                } else {
                    scale = 0.5 + 0.5 * ((cycleProgress - 0.5) / 0.5);
                }
                
                target.size = originalSize * scale;
                
                const frameId = requestAnimationFrame(animate);
                this.activeAnimations.set(targetId, {frameId, type: 'heartbeat'});
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'heartbeat'});
        }

        /**
         * 角色波浪动画
         */
        waveAnimation(args, util) {
            const target = util.target;
            const targetId = target.id;
            
            this.saveOriginalState(target);
            this.stopAnimations(targetId);
            
            const amplitude = Math.max(5, Math.min(100, Cast.toNumber(args.AMPLITUDE)));
            const period = Math.max(0.5, Cast.toNumber(args.PERIOD) * 1000);
            const duration = Math.max(0.1, Cast.toNumber(args.DURATION) * 1000);
            
            const originalX = target.x;
            const originalY = target.y;
            
            const startTime = Date.now();
            
            const animate = () => {
                if (!this.activeAnimations.has(targetId)) return;
                
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const waveProgress = (elapsed % period) / period;
                const yOffset = amplitude * Math.sin(waveProgress * 2 * Math.PI);
                const xOffset = (originalX - (originalX - amplitude)) * progress;
                
                target.setXY(originalX + xOffset, originalY + yOffset);
                
                if (progress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.activeAnimations.set(targetId, {frameId, type: 'wave'});
                } else {
                    target.setXY(originalX, originalY);
                    this.activeAnimations.delete(targetId);
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.activeAnimations.set(targetId, {frameId, type: 'wave'});
        }
    }

    extensions.register(new AnimationExtension(runtime));

}(Scratch));
