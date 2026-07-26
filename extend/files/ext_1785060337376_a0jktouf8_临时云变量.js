//10000why制作
//不支持2创
//请勿修改任何代码，这将对整个云变量扩展系统
(function (Scratch) {
  'use strict';
  if (!(Scratch && Scratch.extensions && Scratch.extensions.register)) {
    throw new Error('此环境不支持 Scratch 扩展注册。请在 TurboWarp / PenguinMod / Scratch 3 扩展环境中加载。');
  }

  const A = Scratch.ArgumentType;
  const B = Scratch.BlockType;
  const Cast = Scratch.Cast || { toString: x => String(x), toNumber: x => Number(x), toBoolean: x => !!x };

  const clampLen = (s, n) => (String(s).length > n ? String(s).slice(0, n) : String(s));
  const isNumStr = (v) => {
    const s = String(v).trim();
    if (!s) return false;
    return /^-?\d+(\.\d+)?$/.test(s) && isFinite(Number(s));
  };
  const nowMs = () => Date.now();

  /* =========================
     协议常量（V2）
     ========================= */
  const PROTOCOL_ID = 'CV2';
  const NS_PREFIX = `☁ ${PROTOCOL_ID}.`;
  const MANIFEST_NAME = `${NS_PREFIX}_manifest`;
  const VERSION = '2.0.1'; // ← bump

  /* =========================
     文本<->数字 编码
     ========================= */
  function encodeTextV2(text, salt) {
    const s = String(text);
    const k = (Number(salt) || 0) % 997;
    let out = '';
    for (let i = 0; i < s.length; i++) {
      const cp = s.codePointAt(i);
      if (cp > 0xffff) i++;
      const v = (cp + k + i) % 1000;
      out += String(v).padStart(3, '0');
    }
    return out || '000';
  }
  function decodeTextV2(numStr, salt) {
    const n = String(numStr).replace(/\D/g, '');
    const k = (Number(salt) || 0) % 997;
    let out = '';
    for (let i = 0, j = 0; i < n.length; i += 3, j++) {
      const chunk = n.slice(i, i + 3);
      if (chunk.length < 3) break;
      const v = Number(chunk);
      if (!Number.isFinite(v)) continue;
      let cp = v - k - j;
      while (cp < 0) cp += 1000;
      const ascii = 32 + (cp % 95);
      out += String.fromCodePoint(ascii);
    }
    return out;
  }

  /* =========================
     运行时
     ========================= */
  class CloudV2 {
    constructor() {
      this.server = 'wss://clouddata.turbowarp.org';
      this.projectId = 'cv2-demo';
      this.username = 'Guest';
      this.ws = null;
      this.status = 'disconnected';

      this.values = new Map();       // cloudName -> string value
      this.updateFlags = new Map();  // localName -> boolean (edge-trigger)
      this.lastSendAt = new Map();   // cloudName -> ts

      this.seed = 0;
      this._initialTimer = 0;
      this._sawAnyMessage = false;
      this._didInitialEdge = false;  // 防止重复初次触发
    }

    toCloudName(name) {
      let n = String(name || '').trim();
      if (!n) n = 'var';
      let raw = `${NS_PREFIX}${n}`;
      raw = clampLen(raw, 128);
      return raw;
    }
    fromCloudName(cloudName) {
      const s = String(cloudName || '');
      if (s.startsWith(NS_PREFIX)) return s.slice(NS_PREFIX.length);
      return null;
    }

    /* ===== 连接与握手 ===== */
    connect(optionalServer) {
      try {
        if (optionalServer) {
          const s = String(optionalServer).trim();
          if (/^wss?:\/\//i.test(s)) this.server = s;
        }

        if (this.ws) { try { this.ws.close(); } catch (e) {} this.ws = null; }

        const url = this.server.includes('?')
          ? this.server
          : this.server.replace(/\/?$/, '/') + `?project_id=${encodeURIComponent(this.projectId)}`;

        this.status = 'connecting';
        this.seed = 0;
        this._didInitialEdge = false;
        this.values.clear();
        this.updateFlags.clear();
        this._sawAnyMessage = false;

        this.ws = new WebSocket(url);
        this.ws.onopen = () => {
          this._send({ method: 'handshake', user: this.username, project_id: this.projectId });
          this._scheduleInitialScan(600);
        };
        this.ws.onclose = () => { this._clearInitialScan(); if (this.status !== 'legacy-conflict') this.status = 'disconnected'; };
        this.ws.onerror = () => { this._clearInitialScan(); if (this.status !== 'legacy-conflict') this.status = 'error'; };
        this.ws.onmessage = (ev) => {
          const lines = String(ev.data || '').split('\n').filter(Boolean);
          if (lines.length) this._onAnyMessage();
          for (const line of lines) {
            let msg; try { msg = JSON.parse(line); } catch (e) { continue; }
            this._handleMessage(msg);
          }
        };
      } catch (e) {
        this.status = 'error';
      }
    }
    disconnect() {
      if (this.ws) { try { this.ws.close(); } catch (e) {} this.ws = null; }
      this._clearInitialScan();
      this.status = 'disconnected';
    }

    _send(obj) {
      if (!this.ws || this.ws.readyState !== 1) return false;
      try { this.ws.send(JSON.stringify(obj)); return true; } catch (e) { return false; }
    }

    _onAnyMessage() {
      this._scheduleInitialScan(300);
    }
    _scheduleInitialScan(ms) {
      if (this._initialTimer) { clearTimeout(this._initialTimer); this._initialTimer = 0; }
      this._initialTimer = setTimeout(() => {
        this._initialTimer = 0;
        this._evaluateNamespaceAndManifest();
      }, ms);
    }
    _clearInitialScan() {
      if (this._initialTimer) { clearTimeout(this._initialTimer); this._initialTimer = 0; }
    }

    /* ===== 收到服务端消息 ===== */
    _handleMessage(msg) {
      const method = msg && msg.method;
      if (method === 'set' || method === 'update') {
        const cloudName = String(msg.name || '');
        const value = String(msg.value ?? '');
        if (!cloudName.startsWith('☁')) return;

        this.values.set(cloudName, value);

        const local = this.fromCloudName(cloudName);
        if (local) {
          if (cloudName === MANIFEST_NAME) {
            const m = String(value).match(/^2(\d{6})/);
            if (m) this.seed = Number(m[1]);
            return; // 清单不触发
          }
          // ★ 远端变更 → 触发一次边沿
          this._edge(local);
        }
      }
    }

    /* ===== 首次扫描与清单 ===== */
    _evaluateNamespaceAndManifest() {
      if (!this.ws) return;

      let hasManifest = false;
      let cv2Count = 0;
      let legacyCount = 0;

      for (const k of this.values.keys()) {
        if (k === MANIFEST_NAME) hasManifest = true;
        if (k.startsWith(NS_PREFIX)) cv2Count++;
        else if (k.startsWith('☁')) legacyCount++;
      }

      if (legacyCount > 0 && !hasManifest) {
        this.status = 'legacy-conflict';
        try { this.ws.close(); } catch (e) {}
        this.ws = null;
        return;
      }

      if (!hasManifest && cv2Count === 0 && legacyCount === 0) {
        const seed = Math.floor(100000 + Math.random() * 900000);
        this.seed = seed;
        const manifestVal = `2${String(seed).padStart(6,'0')}`;
        this._send({ method: 'set', name: MANIFEST_NAME, value: manifestVal });
        this.values.set(MANIFEST_NAME, manifestVal);
      }

      if (hasManifest && !this.seed) {
        const v = this.values.get(MANIFEST_NAME) || '';
        const m = String(v).match(/^2(\d{6})/);
        if (m) this.seed = Number(m[1]);
      }

      if (this.status === 'connecting' || this.status === 'disconnected' || this.status === 'error') {
        this.status = 'connected';
      }

      // ★ 首次连接完成后，把已存在的 CV2 变量触发一次“初始更新”
      if (!this._didInitialEdge) {
        this._didInitialEdge = true;
        for (const k of this.values.keys()) {
          if (k.startsWith(NS_PREFIX) && k !== MANIFEST_NAME) {
            const local = this.fromCloudName(k);
            if (local) this._edge(local);
          }
        }
      }
    }

    _guard() { return this.status !== 'legacy-conflict' && this.ws && this.ws.readyState === 1; }

    /* ===== 对外 API ===== */
    createVar(name) {
      if (this.status === 'legacy-conflict') return;
      const cloudName = this.toCloudName(name);
      if (!this.values.has(cloudName)) this.values.set(cloudName, '0');
      // clouddata 服务通常不需要 create，只要 set 即可“创建”
      this._send({ method: 'set', name: cloudName, value: String(this.values.get(cloudName)) });
      // 初次创建也触发一次
      const local = this.fromCloudName(cloudName);
      if (local) this._edge(local);
    }
    deleteVar(name) {
      if (this.status === 'legacy-conflict') return;
      const cloudName = this.toCloudName(name);
      this.values.delete(cloudName);
      // 无标准 delete；保留本地删除，不发送
    }

    setVar(name, value) {
      const cloudName = this.toCloudName(name);
      let v = String(value);
      if (!isNumStr(v)) v = encodeTextV2(v, this.seed);
      if (v.length > 900) v = v.slice(0, 900);

      const now = nowMs();
      const last = this.lastSendAt.get(cloudName) || 0;
      if (now - last < 100) {
        // 仍更新本地，且触发一次；避免在节流窗口里丢掉起始积木
        this.values.set(cloudName, v);
        const local = this.fromCloudName(cloudName);
        if (local) this._edge(local);
        return;
      }

      if (this._guard()) {
        this.lastSendAt.set(cloudName, now);
        this.values.set(cloudName, v);
        this._send({ method: 'set', name: cloudName, value: String(v) });
      } else {
        // 离线本地写入，同样触发一次，等重连后会被覆盖
        this.values.set(cloudName, v);
      }
      const local = this.fromCloudName(cloudName);
      if (local) this._edge(local); // ★ 本地 set 也触发
    }

    changeVar(name, delta) {
      const cloudName = this.toCloudName(name);
      const cur = Number(this.values.get(cloudName) || '0');
      const d = Cast.toNumber(delta) || 0;
      const next = cur + d;
      this.setVar(name, String(next)); // setVar 内部会触发 edge
    }

    getVar(name) {
      const cloudName = this.toCloudName(name);
      return this.values.get(cloudName) ?? '0';
    }

    listNames() {
      const out = [];
      for (const k of this.values.keys()) {
        if (!k.startsWith(NS_PREFIX)) continue;
        if (k === MANIFEST_NAME) continue;
        const short = this.fromCloudName(k);
        if (short) out.push(short);
      }
      out.sort((a, b) => a.localeCompare(b));
      return out.length ? out : ['(无)'];
    }

    /* ===== 事件边沿触发 ===== */
    _edge(localName) {
      const n = String(localName || '').trim();
      if (!n || n === '(无)') return;
      this.updateFlags.set(n, true);
    }
    pollUpdatedFlag(name) {
      const n = String(name || '').trim();
      if (!n || n === '(无)') return false;
      if (this.updateFlags.get(n)) {
        this.updateFlags.set(n, false);
        return true; // 仅一次 true
      }
      return false;
    }
  }

  const runtime = new CloudV2();

  /* =========================
     UI 图标
     ========================= */
  function makeIconURI(color = '#FF8C1A') {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <rect x="0" y="0" width="40" height="40" rx="8" fill="${color}"/>
        <g fill="#fff">
          <circle cx="18" cy="20" r="6"/>
          <circle cx="24" cy="18" r="5"/>
          <circle cx="28" cy="21" r="4"/>
          <rect x="12" y="20" width="20" height="7" rx="3.5"/>
        </g>
      </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  /* =========================
     扩展定义
     ========================= */
  class CloudVarsV2Extension {
    getInfo() {
      const icon = makeIconURI('#FF8C1A');
      return {
        id: 'CloudVarsJackV2',
        name: '云变量 V2',
        color1: '#FF8C1A',
        color2: '#DB6E00',
        color3: '#B35400',
        menuIconURI: icon,
        blocks: [
          { opcode: 'connect',    blockType: B.COMMAND, text: '连接云服务器 [SERVER]',
            arguments: { SERVER: { type: A.STRING, defaultValue: 'wss://clouddata.turbowarp.org' } } },
          { opcode: 'disconnect', blockType: B.COMMAND, text: '断开云服务器' },
          { opcode: 'status',     blockType: B.REPORTER, text: '连接状态' },
          { opcode: 'version',    blockType: B.REPORTER, text: '协议版本' },

          { opcode: 'createVar',  blockType: B.COMMAND,  text: '创建云变量 [NAME]',
            arguments: { NAME: { type: A.STRING, defaultValue: '聊天室' } } },
          { opcode: 'deleteVar',  blockType: B.COMMAND,  text: '删除云变量 [NAME]',
            arguments: { NAME: { type: A.STRING, menu: 'varNames' } } },

          { opcode: 'setVar',     blockType: B.COMMAND,  text: '将 [NAME] 设为 [VAL]',
            arguments: { NAME: { type: A.STRING, menu: 'varNames' }, VAL: { type: A.STRING, defaultValue: '123' } } },
          { opcode: 'changeVar',  blockType: B.COMMAND,  text: '将 [NAME] 增加 [DELTA]',
            arguments: { NAME: { type: A.STRING, menu: 'varNames' }, DELTA: { type: A.NUMBER, defaultValue: 1 } } },
          { opcode: 'getVar',     blockType: B.REPORTER, text: '读取 [NAME]',
            arguments: { NAME: { type: A.STRING, menu: 'varNames' } } },

          // ★ 起始积木（边沿触发）
          { opcode: 'onUpdated', blockType: B.HAT, isEdgeActivated: true, text: '当 [NAME] 更新',
            arguments: { NAME: { type: A.STRING, menu: 'varNames' } } },

          { opcode: 'encodeText', blockType: B.REPORTER, text: '文本转云数字 [TEXT]',
            arguments: { TEXT: { type: A.STRING, defaultValue: 'Hello CV2' } } },
          { opcode: 'decodeText', blockType: B.REPORTER, text: '云数字转文本 [NUMSTR]',
            arguments: { NUMSTR: { type: A.STRING, defaultValue: '000' } } }
        ],
        menus: {
          varNames: { acceptReporters: true, items: 'listVarNamesDyn' }
        }
      };
    }

    /* ===== 实现 ===== */
    connect(args) {
      const server = Cast.toString(args.SERVER);
      runtime.connect(server);
    }
    disconnect() { runtime.disconnect(); }
    status() { return runtime.status; }
    version() { return `${PROTOCOL_ID}/${VERSION}`; }

    createVar(args)  { runtime.createVar(Cast.toString(args.NAME)); }
    deleteVar(args)  { const n = Cast.toString(args.NAME); if (n && n !== '(无)') runtime.deleteVar(n); }
    setVar(args)     { runtime.setVar(Cast.toString(args.NAME), Cast.toString(args.VAL)); }
    changeVar(args)  { runtime.changeVar(Cast.toString(args.NAME), Cast.toNumber(args.DELTA)); }
    getVar(args)     { return runtime.getVar(Cast.toString(args.NAME)); }

    // ★ 帽子块轮询“边沿”标记（一次 true 后即复位）
    onUpdated(args)  { return runtime.pollUpdatedFlag(Cast.toString(args.NAME)); }

    encodeText(args) { return encodeTextV2(Cast.toString(args.TEXT), runtime.seed); }
    decodeText(args) { return decodeTextV2(Cast.toString(args.NUMSTR), runtime.seed); }
    listVarNamesDyn(){ return runtime.listNames(); }
  }

  Scratch.extensions.register(new CloudVarsV2Extension());
})(typeof Scratch === 'undefined' ? {} : Scratch);
