/* ================================================================================
 *  Nine-Zone Joystick – TurboWarp Extension
 *  功能：九宫虚拟摇杆 → 实时触发 WASD 键盘事件
 *  修复：1. 左上同时触发 A+W 2. 全局捕获防丢失 3. 无过渡延迟
 * ================================================================================ */
(function (Scratch) {
  'use strict';

  /* ---------- 扩展注册对象 ---------- */
  const ext = {
    id: 'nineZoneJoystick',
    name: '九宫摇杆',
    color1: '#00baad',
    color2: '#009d93',

    getInfo() {
      return {
        id: this.id,
        name: this.name,
        color1: this.color1,
        color2: this.color2,
        blocks: [
          {
            opcode: 'zone',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前区域'
          },
          {
            opcode: 'keys',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前按键'
          },
          {
            opcode: 'active',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '摇杆使用中？'
          }
        ]
      };
    },

    zone()  { return joystick ? joystick.zone : '中心'; },
    keys()  { return joystick ? joystick.keys : '';   },
    active(){ return joystick ? joystick.active : false; }
  };

  /* ---------- 摇杆实现 ---------- */
  const KEY_MAP = { w: 'KeyW', a: 'KeyA', s: 'KeyS', d: 'KeyD' };
  const R = 40;          // 外圈半径
  const STEP = R / 3;    // 单格阈值 ≈ 13.3 px

  class Joystick {
    constructor() {
      this.active = false;
      this.pointerId = null;
      this.zone = '中心';
      this.keys = '';
      this.pressed = new Set();   // 当前按下的键
      this.buildDOM();
      this.bindEvents();
    }

    buildDOM() {
      this.wrapper = document.createElement('div');
      Object.assign(this.wrapper.style, {
        position: 'fixed', zIndex: 999999,
        left: 0, top: 0, width: '100vw', height: '100vh',
        pointerEvents: 'none'
      });

      this.outer = document.createElement('div');
      Object.assign(this.outer.style, {
        position: 'absolute',
        width: R * 2 + 'px', height: R * 2 + 'px',
        borderRadius: '50%', background: 'rgba(0,0,0,.4)',
        touchAction: 'none', pointerEvents: 'auto',
        userSelect: 'none',
        right: '20px', bottom: '20px'
      });

      this.inner = document.createElement('div');
      Object.assign(this.inner.style, {
        position: 'absolute',
        width: '32px', height: '32px',
        borderRadius: '50%', background: 'rgba(255,255,255,.9)',
        left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)',
        transition: 'none'
      });

      this.outer.appendChild(this.inner);
      this.wrapper.appendChild(this.outer);
      document.body.appendChild(this.wrapper);
    }

    bindEvents() {
      const onDown = (e) => {
        e.preventDefault();
        if (this.active) return;
        this.active = true;
        this.pointerId = e.pointerId;
        this.outer.setPointerCapture(this.pointerId);
        this.move(e);
      };
      const onMove = (e) => {
        if (!this.active || e.pointerId !== this.pointerId) return;
        e.preventDefault();
        this.move(e);
      };
      const onUp = (e) => {
        if (!this.active || e.pointerId !== this.pointerId) return;
        e.preventDefault();
        this.active = false;
        this.outer.releasePointerCapture(e.pointerId);
        this.reset();
      };

      this.outer.addEventListener('pointerdown', onDown);
      this.outer.addEventListener('pointermove', onMove);
      this.outer.addEventListener('pointerup', onUp);
      this.outer.addEventListener('pointercancel', onUp);
    }

    move(e) {
      const rect = this.outer.getBoundingClientRect();
      const cx = rect.left + R;
      const cy = rect.top  + R;
      let dx = e.clientX - cx;
      let dy = e.clientY - cy;
      const len = Math.hypot(dx, dy);
      if (len > R) {
        dx = (dx / len) * R;
        dy = (dy / len) * R;
      }
      this.inner.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

      /* 独立方向判定 */
      const left  = dx < -STEP;
      const right = dx >  STEP;
      const up    = dy < -STEP;
      const down  = dy >  STEP;

      /* 组合 zone 字符串 */
      const zoneParts = [];
      if (up)    zoneParts.push('上');
      if (down)  zoneParts.push('下');
      if (left)  zoneParts.push('左');
      if (right) zoneParts.push('右');
      this.zone = zoneParts.length ? zoneParts.join('') : '中心';

      /* 组合按键数组 */
      const want = [];
      if (up)    want.push('w');
      if (down)  want.push('s');
      if (left)  want.push('a');
      if (right) want.push('d');
      this.keys = want.join(',');
      this.syncKeys(want);
    }

    syncKeys(want) {
      const add = want.filter(k => !this.pressed.has(k));
      const rem = Array.from(this.pressed).filter(k => !want.includes(k));
      add.forEach(k => {
        this.pressed.add(k);
        this.emit('keydown', k);
      });
      rem.forEach(k => {
        this.pressed.delete(k);
        this.emit('keyup', k);
      });
    }

    emit(type, key) {
      const code = KEY_MAP[key];
      document.dispatchEvent(
        new KeyboardEvent(type, { key, code, bubbles: true, cancelable: true })
      );
    }

    reset() {
      this.zone = '中心';
      this.keys = '';
      this.inner.style.transform = 'translate(-50%,-50%)';
      this.syncKeys([]);
    }
  }

  /* ---------- 单例 ---------- */
  const joystick = new Joystick();

  /* ---------- 注册扩展 ---------- */
  if (Scratch && Scratch.extensions) {
    Scratch.extensions.register(ext);
  } else {
    console.warn('请在 TurboWarp 里加载此扩展');
  }
})(Scratch);