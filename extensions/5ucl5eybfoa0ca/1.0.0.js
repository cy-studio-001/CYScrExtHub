(function (Scratch) {
  'use strict';

  class StageOverlay {
    constructor() {
      this.overlay = null;
      this._red = 255;
      this._green = 255;
      this._blue = 255;
      this._opacity = 0;          // 0 ~ 100, 0 完全透明
      this.parentOriginalPosition = null;

      this.initOverlay();

      // 扩展卸载时清理 DOM
      Scratch.vm.runtime.on('RUNTIME_DISPOSED', () => {
        this.clearOverlay();
      });
    }

    initOverlay() {
      const canvas = Scratch.renderer && Scratch.renderer.canvas;
      if (!canvas) return;
      const parent = canvas.parentNode;
      if (!parent) return;

      // 让父容器成为定位参考
      this.parentOriginalPosition = window.getComputedStyle(parent).position;
      if (this.parentOriginalPosition === 'static') {
        parent.style.position = 'relative';
      }

      this.overlay = document.createElement('div');
      this.overlay.style.position = 'absolute';
      this.overlay.style.top = '0';
      this.overlay.style.left = '0';
      this.overlay.style.width = '100%';
      this.overlay.style.height = '100%';
      this.overlay.style.pointerEvents = 'none';   // 点击穿透
      this.overlay.style.zIndex = '1000';
      this.overlay.style.backgroundColor = 'transparent';
      parent.appendChild(this.overlay);
      this.updateOverlay();
    }

    clearOverlay() {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
        if (this.parentOriginalPosition === 'static') {
          this.overlay.parentNode.style.position = 'static';
        }
      }
      this.overlay = null;
    }

    updateOverlay() {
      if (!this.overlay) return;
      const alpha = this._opacity / 100;
      // 当浓度为零时直接设为 transparent，避免 rgba 浮点误差
      this.overlay.style.backgroundColor =
        alpha === 0 ? 'transparent' : `rgba(${this._red}, ${this._green}, ${this._blue}, ${alpha})`;
    }

    // ---------- 积木实现 ----------
    setColorWithOpacity(args) {
      const r = Scratch.Cast.toNumber(args.R);
      const g = Scratch.Cast.toNumber(args.G);
      const b = Scratch.Cast.toNumber(args.B);
      const o = Scratch.Cast.toNumber(args.OPACITY);

      if (!isNaN(r) && r >= 0 && r <= 255) this._red = r;
      if (!isNaN(g) && g >= 0 && g <= 255) this._green = g;
      if (!isNaN(b) && b >= 0 && b <= 255) this._blue = b;
      if (!isNaN(o) && o >= 0 && o <= 100) this._opacity = o;

      this.updateOverlay();
    }

    setColor(args) {
      const r = Scratch.Cast.toNumber(args.R);
      const g = Scratch.Cast.toNumber(args.G);
      const b = Scratch.Cast.toNumber(args.B);

      if (!isNaN(r) && r >= 0 && r <= 255) this._red = r;
      if (!isNaN(g) && g >= 0 && g <= 255) this._green = g;
      if (!isNaN(b) && b >= 0 && b <= 255) this._blue = b;

      this.updateOverlay();
    }

    setChannel(args) {
      const channel = args.CHANNEL;
      let val = Scratch.Cast.toNumber(args.VALUE);
      if (isNaN(val)) return;

      if (channel === 'red' || channel === 'green' || channel === 'blue') {
        if (val >= 0 && val <= 255) {
          if (channel === 'red') this._red = val;
          else if (channel === 'green') this._green = val;
          else if (channel === 'blue') this._blue = val;
        }
      } else if (channel === 'opacity') {
        if (val >= 0 && val <= 100) this._opacity = val;
      }
      this.updateOverlay();
    }

    clearEffects() {
      this._opacity = 0;
      this._red = 255;
      this._green = 255;
      this._blue = 255;
      this.updateOverlay();
    }

    // ---- 新增：线性映射 ----
    mapRange(args) {
      const input = Scratch.Cast.toNumber(args.INPUT);
      const fromLow = Scratch.Cast.toNumber(args.FROM_LOW);
      const fromHigh = Scratch.Cast.toNumber(args.FROM_HIGH);
      const toLow = Scratch.Cast.toNumber(args.TO_LOW);
      const toHigh = Scratch.Cast.toNumber(args.TO_HIGH);

      // 避免除以零
      const fromDiff = fromHigh - fromLow;
      if (fromDiff === 0) {
        return (toLow + toHigh) / 2;
      }
      return ((input - fromLow) / fromDiff) * (toHigh - toLow) + toLow;
    }

    // ---------- 扩展信息 ----------
    getInfo() {
      return {
        id: 'stageoverlay',
        name: '舞台覆盖层',
        blocks: [
          {
            opcode: 'setColorWithOpacity',
            blockType: Scratch.BlockType.COMMAND,
            text: '将舞台覆盖层设为红[R]绿[G]蓝[B]浓度[OPACITY]',
            arguments: {
              R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 255 },
              G: { type: Scratch.ArgumentType.NUMBER, defaultValue: 255 },
              B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 255 },
              OPACITY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }
            }
          },
          {
            opcode: 'setColor',
            blockType: Scratch.BlockType.COMMAND,
            text: '将舞台覆盖层设为红[R]绿[G]蓝[B]',
            arguments: {
              R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 255 },
              G: { type: Scratch.ArgumentType.NUMBER, defaultValue: 255 },
              B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 255 }
            }
          },
          {
            opcode: 'setChannel',
            blockType: Scratch.BlockType.COMMAND,
            text: '将[CHANNEL]设为[VALUE]',
            arguments: {
              CHANNEL: {
                type: Scratch.ArgumentType.STRING,
                menu: 'channelMenu'
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'clearEffects',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除所有效果'
          },
          {
            opcode: 'mapRange',
            blockType: Scratch.BlockType.REPORTER,
            text: '将 [INPUT] 从 [FROM_LOW] 到 [FROM_HIGH] 映射到 [TO_LOW] 到 [TO_HIGH]',
            arguments: {
              INPUT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              FROM_LOW: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              FROM_HIGH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 255 },
              TO_LOW: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              TO_HIGH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          }
        ],
        menus: {
          channelMenu: {
            acceptReporters: true,
            items: [
              { text: '红色', value: 'red' },
              { text: '绿色', value: 'green' },
              { text: '蓝色', value: 'blue' },
              { text: '浓度', value: 'opacity' }
            ]
          }
        }
      };
    }
  }

  Scratch.extensions.register(new StageOverlay());
})(Scratch);