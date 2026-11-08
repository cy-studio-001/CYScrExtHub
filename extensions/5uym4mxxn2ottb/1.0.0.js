/*  =================  HTML 实验室  =================  */
class RunHtmlExtension {
  get iconURI() {
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="#00796B" stroke-width="2"/>
        <path d="M7 9h10M7 13h6" stroke="#00796B" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    `.trim());
  }

  get webIconURI() {
    return 'https://yunpa.vip/图片合集/萝卜图标.png';
  }

  getInfo() {
    return {
      id: 'runHtml',
      name: 'HTML 实验室',
      menuIconURI: this.iconURI,
      blockIconURI: this.iconURI,
      blocks: [
        {
          opcode: 'runHtml',
          blockType: Scratch.BlockType.COMMAND,
          text: '运行 HTML [HTML]',
          color1: '#00695C', color2: '#004D40', color3: '#B2DFDB',
          arguments: { HTML: { type: Scratch.ArgumentType.STRING, defaultValue: '<h1>你好创作者</h1>' } }
        },
        { blockType: Scratch.BlockType.LABEL, text: '嵌入 HTML' },
        {
          opcode: 'embedHtml',
          blockType: Scratch.BlockType.COMMAND,
          text: '嵌入 HTML [HTML] 于坐标 x:[X] y:[Y] 宽度:[W] 高度:[H]',
          color1: '#4CAF50', color2: '#388E3C', color3: '#E8F5E9',
          arguments: {
            HTML: { type: Scratch.ArgumentType.STRING, defaultValue: '<h2>去关注B站10000why！</h2>' },
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 480 },
            H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 360 }
          }
        },
        { opcode: 'hideEmbed', blockType: Scratch.BlockType.COMMAND, text: '隐藏 HTML 嵌入', color1: '#4CAF50', color2: '#388E3C' },
        { opcode: 'showEmbed', blockType: Scratch.BlockType.COMMAND, text: '显示 HTML 嵌入', color1: '#4CAF50', color2: '#388E3C' },
        { opcode: 'exitEmbed', blockType: Scratch.BlockType.COMMAND, text: '退出并清除 HTML 嵌入', color1: '#4CAF50', color2: '#388E3C' },

        { blockType: Scratch.BlockType.LABEL, text: '上传HTML代码' },
        {
          opcode: 'uploadHtml',
          blockType: Scratch.BlockType.COMMAND,
          text: '上传 HTML 文件',
          color1: '#26A69A', color2: '#009688', color3: '#E0F2F1'
        },
        {
          opcode: 'getUploadedHtml',
          blockType: Scratch.BlockType.REPORTER,
          text: '已上传的 HTML',
          color1: '#26A69A', color2: '#009688', color3: '#E0F2F1'
        },
        {
          opcode: 'hasUploadedHtml',
          blockType: Scratch.BlockType.BOOLEAN,
          text: '是否已上传？',
          color1: '#26A69A', color2: '#009688', color3: '#E0F2F1'
        },
        {
          opcode: 'setLocalFile',
          blockType: Scratch.BlockType.COMMAND,
          text: '将 [WHAT] 设为 [VALUE]',
          color1: '#26A69A', color2: '#009688', color3: '#E0F2F1',
          arguments: {
            WHAT: { type: Scratch.ArgumentType.STRING, menu: 'localFileOptions' },
            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
          }
        },

        { blockType: Scratch.BlockType.LABEL, text: 'HTML 工具' },
        {
          opcode: 'htmlEncode',
          blockType: Scratch.BlockType.REPORTER,
          text: 'HTML 编码 [TEXT]',
          color1: '#3F51B5',
          color2: '#303F9F',
          color3: '#C5CAE9',
          blockIconURI: 'data:image/svg+xml;base64,' + btoa(`
            <?xml version="1.0" standalone="no"?>
            <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
              "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
            <svg t="1755229703884" class="icon" viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg"
                 p-id="4912" width="24" height="24">
              <path d="M799.999553 384.000994h-23.999963c-4.399993 0-7.999988-3.599994-7.999987-7.999988V258.001189C767.999603 116.701409 652.399782-0.498409 511.000002 0.00159 370.10022 0.501589 256.000397 114.901412 256.000397 256.001192v119.999814c0 4.399993-3.599994 7.999988-7.999987 7.999988h-23.999963c-52.999918 0-95.999851 42.999933-95.999851 95.999851v447.999304c0 52.999918 42.999933 95.999851 95.999851 95.999851h575.999106c52.999918 0 95.999851-42.999933 95.999851-95.999851V480.000845c0-52.999918-42.999933-95.999851-95.999851-95.999851zM569.69991 748.700427c-15.999975 12.099981-25.69996 30.699952-25.69996 50.799922V864.000248c0 17.499973-14.199978 31.799951-31.599951 31.999951-17.799972 0.2-32.39995-14.799977-32.399949-32.699949V800.000348c0-20.199969-9.599985-39.099939-25.79996-51.299921C431.000126 731.200455 416.000149 703.300498 416.000149 672.000547c0-52.199919 42.399934-95.299852 94.599853-95.999851 53.699917-0.799999 97.399849 42.499934 97.399849 95.999851 0 31.299951-14.999977 59.199908-38.299941 76.69988zM703.999702 376.001006c0 4.399993-3.599994 7.999988-7.999988 7.999988H328.000286c-4.399993 0-7.999988-3.599994-7.999988-7.999988V256.001192c0-51.29992 19.999969-99.499846 56.199913-135.799789C412.500154 84.00146 460.70008 64.001491 512 64.001491s99.499846 19.999969 135.799789 56.199912C683.999733 156.501347 703.999702 204.701272 703.999702 256.001192v119.999814z" p-id="4913"/>
              <path d="M512 672.000547m-31.99995 0a31.99995 31.99995 0 1 0 63.9999 0 31.99995 31.99995 0 1 0-63.9999 0Z" p-id="4914"/>
            </svg>
          `.trim()),
          arguments: {
            TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '<h1>Hello!</h1>' }
          }
        },

        { blockType: Scratch.BlockType.LABEL, text: '访问网络' },
        {
          opcode: 'openWeb',
          blockType: Scratch.BlockType.COMMAND,
          text: '打开网页 [URL]',
          color1: '#42A5F5', color2: '#1E88E5', color3: '#E3F2FD',
          menuIconURI: this.webIconURI,
          blockIconURI: this.webIconURI,
          arguments: { URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://yunpa.vip' } }
        },
        {
          opcode: 'embedWeb',
          blockType: Scratch.BlockType.COMMAND,
          text: '嵌入网站 [URL] 于坐标 x:[X] y:[Y] 宽度:[W] 高度:[H]',
          color1: '#42A5F5', color2: '#1E88E5', color3: '#E3F2FD',
          menuIconURI: this.webIconURI,
          blockIconURI: this.webIconURI,
          arguments: {
            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://yunpa.vip' },
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 480 },
            H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 360 }
          }
        },
        { opcode: 'hideWeb', blockType: Scratch.BlockType.COMMAND, text: '隐藏网站嵌入', color1: '#42A5F5', color2: '#1E88E5', menuIconURI: this.webIconURI, blockIconURI: this.webIconURI },
        { opcode: 'showWeb', blockType: Scratch.BlockType.COMMAND, text: '显示网站嵌入', color1: '#42A5F5', color2: '#1E88E5', menuIconURI: this.webIconURI, blockIconURI: this.webIconURI },
        { opcode: 'exitWeb', blockType: Scratch.BlockType.COMMAND, text: '退出并清除嵌入网站', color1: '#42A5F5', color2: '#1E88E5', menuIconURI: this.webIconURI, blockIconURI: this.webIconURI }
      ],
      menus: {
        localFileOptions: {
          acceptReporters: false,
          items: [
            { text: '是否已上传？', value: 'hasUploaded' },
            { text: '已上传的 HTML', value: 'uploadedHtml' }
          ]
        }
      }
    };
  }

  constructor() {
    this.uploadedHtml = '';
    this.htmlFrame = null;
    this.webFrame = null;
  }

  _createFrame(type, content, x, y, w, h) {
    this._removeFrame(type);
    const stage = document.querySelector('canvas');
    if (!stage) return;
    const frame = document.createElement('iframe');
    Object.assign(frame.style, {
      position: 'absolute', left: `${x}px`, top: `${y}px`,
      width: `${w}px`, height: `${h}px`,
      border: 'none', zIndex: '9999', display: 'block'
    });
    if (type === 'html') { frame.srcdoc = content; this.htmlFrame = frame; }
    else { frame.src = content; this.webFrame = frame; }
    stage.parentElement.style.position = 'relative';
    stage.parentElement.appendChild(frame);
  }

  _removeFrame(type) {
    const f = type === 'html' ? this.htmlFrame : this.webFrame;
    if (f) { f.remove(); type === 'html' ? this.htmlFrame = null : this.webFrame = null; }
  }

  _toggleFrame(type, visible) {
    const f = type === 'html' ? this.htmlFrame : this.webFrame;
    if (f) f.style.display = visible ? 'block' : 'none';
  }

  runHtml({ HTML }) {
    if (!HTML) return;
    const blob = new Blob([HTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  embedHtml(args) { this._createFrame('html', args.HTML, args.X, args.Y, args.W, args.H); }
  hideEmbed() { this._toggleFrame('html', false); }
  showEmbed() { this._toggleFrame('html', true); }
  exitEmbed() { this._removeFrame('html'); }

  uploadHtml() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.html,.htm';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = evt => { this.uploadedHtml = evt.target.result; };
      reader.readAsText(file);
    };
    input.click();
  }

  getUploadedHtml() { return this.uploadedHtml || ''; }
  hasUploadedHtml() { return !!this.uploadedHtml; }

  setLocalFile({ WHAT, VALUE }) {
    switch (WHAT) {
      case 'hasUploaded':
        this.uploadedHtml = String(VALUE).toLowerCase() === 'true' ? ' ' : '';
        break;
      case 'uploadedHtml':
      default:
        this.uploadedHtml = String(VALUE);
        break;
    }
  }

  openWeb({ URL }) {
    if (!URL) return;
    const a = document.createElement('a'); a.href = URL; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  }

  embedWeb(args) { this._createFrame('web', args.URL, args.X, args.Y, args.W, args.H); }
  hideWeb() { this._toggleFrame('web', false); }
  showWeb() { this._toggleFrame('web', true); }
  exitWeb() { this._removeFrame('web'); }

  /* ========== 新增：HTML 编码 ========== */
  htmlEncode({ TEXT }) {
    return Scratch.Cast.toString(TEXT)
      .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
}

/* ---------- 注册扩展 ---------- */
Scratch.extensions.register(new RunHtmlExtension());