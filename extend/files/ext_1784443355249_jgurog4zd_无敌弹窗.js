class DarkGlassModalExtension {
  constructor() {
    this.original = {
      borderColor: '#4080ff',
      shadowColor: 'rgba(64,128,255,0.35)',
      glowColor: 'rgba(64,128,255,0.45)',
      textColor: '#ffffff',
      btnTextColor: '#ffffff',
      bgColor: 'rgba(28, 30, 30, 0.85)',
      gradStart: '#203050',
      gradEnd: '#101828',
      shadowEnable: true,
      glowEnable: true,
      gradEnable: false,
      gradDir: 'horizontal',
      glowSpread: 22,
      btnText: '确定',
      bgBlurEnable: true,
      bgBlurIntensity: 8,
      inputBorderColor: 'rgba(28, 30, 30, 0.95)',
      inputTextColor: '#ffffff'
    };
    this.modalWrapper = null;
    this.loadingWrapper = null;
    this.loadingTimer = null;
    this.loadingProgressTimer = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.isDragging = false;
    this.dragEnabled = true;
    this.customBorderColor = this.original.borderColor;
    this.shadowColor = this.original.shadowColor;
    this.glowColor = this.original.glowColor;
    this.textColor = this.original.textColor;
    this.btnTextColor = this.original.btnTextColor;
    this.bgColor = this.original.bgColor;
    this.gradStart = this.original.gradStart;
    this.gradEnd = this.original.gradEnd;
    this.shadowEnable = this.original.shadowEnable;
    this.glowEnable = this.original.glowEnable;
    this.gradEnable = this.original.gradEnable;
    this.gradDir = this.original.gradDir;
    this.glowSpread = this.original.glowSpread;
    this.defaultBtnText = this.original.btnText;
    this.clickResult = null;
    this.selectedDate = "";
    this.inputValue = "";
    this.clockTimer = null;
    this.titleUpdateTimer = null;
    this.bgBlurEnable = this.original.bgBlurEnable;
    this.bgBlurIntensity = this.original.bgBlurIntensity;
    this.inputBorderColor = this.original.inputBorderColor;
    this.inputTextColor = this.original.textColor;
    this.timezoneList = [
      { text: "北京时间(UTC+8)", offset: 8 },
      { text: "东京(UTC+9)", offset: 9 },
      { text: "伦敦(UTC+0)", offset: 0 },
      { text: "纽约(UTC-5)", offset: -5 },
      { text: "洛杉矶(UTC-8)", offset: -8 },
      { text: "巴黎(UTC+1)", offset: 1 },
      { text: "悉尼(UTC+10)", offset: 10 },
      { text: "莫斯科(UTC+3)", offset: 3 }
    ];
    this.curTimezoneOffset = 8;
    this.curTimezoneText = "";
    this.titleFont = "KaiTi, STKaiti, 楷体";
    this.bodyFont = "KaiTi, STKaiti, 楷体";
    this.inputFont = "KaiTi, STKaiti, 楷体";

    this.scoreValue = 0;
    this.scoreMax = 5;
    this.sliderValue = 50;
    this.rangeSliderValue = [25,75];
    this.colorValue = "#4080ff";
    this.singleSelectValue = 1;
    this.multiSelectValue = [];
    this._lastSingleOptions = [];
    this._lastMultiOptions = [];

    this.borderGradEnable = false;
    this.borderGradDir = 'horizontal';
    this.borderGradStart = '#203050';
    this.borderGradEnd = '#101828';
  }

  getInfo() {
    const tzMenu = this.timezoneList.map(item => ({ text: item.text, value: String(item.offset) }));
    return {
      id: 'darkGlassModal',
      name: 'W的精美弹窗',
      color1: '#222830',
      color2: '#393e46',
      color3: '#00adb5',
      menus: {
        targetMenu: [
          { text: "边框", value: "border" },
          { text: "阴影", value: "shadow" },
          { text: "发光", value: "glow" },
          { text: "文字", value: "text" },
          { text: "背景", value: "bg" }
        ],
        switchMenu: [
          { text: "开启", value: "true" },
          { text: "关闭", value: "false" }
        ],
        dirMenu: [
          { text: "左右", value: "horizontal" },
          { text: "上下", value: "vertical" }
        ],
        colorTargetMenu: [
          { text: "边框", value: "border" },
          { text: "阴影", value: "shadow" },
          { text: "发光", value: "glow" },
          { text: "文字", value: "text" },
          { text: "背景", value: "bg" }
        ],
        timezoneMenu: tzMenu,
        fontMenu: [
          { text: "楷体", value: "楷体" },
          { text: "宋体", value: "宋体" },
          { text: "黑体", value: "黑体" },
          { text: "微软雅黑", value: "Microsoft YaHei" },
          { text: "隶书", value: "隶书" }
        ]
      },
      blocks: [
        { opcode: 'showLoading', blockType: 'command', text: '加载动画（[SECONDS]秒）', arguments: { SECONDS: { type: 'number', defaultValue: 3 } } },
        { opcode: 'hideLoading', blockType: 'command', text: '强制关闭加载动画' },

        { opcode: 'createContentModal', blockType: 'command', text: '弹出内容弹窗 标题[TITLE] 内容[CONTENT] 宽[W]高[H]', arguments: { TITLE: { type: 'string', defaultValue: '提示' }, CONTENT: { type: 'string', defaultValue: '提示内容' }, W: { type: 'number', defaultValue: 720 }, H: { type: 'number', defaultValue: 360 } } },
        { opcode: 'createConfirmModal', blockType: 'command', text: '弹出确认弹窗 标题[TITLE] 内容[CONTENT] 宽[W]高[H]', arguments: { TITLE: { type: 'string', defaultValue: '请确认' }, CONTENT: { type: 'string', defaultValue: '确认执行？' }, W: { type: 'number', defaultValue: 720 }, H: { type: 'number', defaultValue: 360 } } },
        { opcode: 'createInputModal', blockType: 'command', text: '弹出输入弹窗 标题[TITLE] 提示[HINT] 默认值[DEFAULT] 宽[W]高[H]', arguments: { TITLE: { type: 'string', defaultValue: '请输入' }, HINT: { type: 'string', defaultValue: '请输入' }, DEFAULT: { type: 'string', defaultValue: '' }, W: { type: 'number', defaultValue: 720 }, H: { type: 'number', defaultValue: 360 } } },
        { opcode: 'createScoreModal', blockType: 'command', text: '弹出评分弹窗 标题[TITLE] 满分[MAX_STAR]星 宽[W]高[H]', arguments: { TITLE: { type: 'string', defaultValue: '请评分' }, MAX_STAR: { type: 'number', defaultValue: 5 }, W: { type: 'number', defaultValue: 500 }, H: { type: 'number', defaultValue: 300 } } },
        { opcode: 'createSliderModal', blockType: 'command', text: '弹出滑块 范围[MIN]到[MAX] 默认[DEFAULT] 步长[STEP]', arguments: { MIN: { type: 'number', defaultValue: 0 }, MAX: { type: 'number', defaultValue: 100 }, DEFAULT: { type: 'number', defaultValue: 50 }, STEP: { type: 'number', defaultValue: 1 } } },
        { opcode: 'createRangeSliderModal', blockType: 'command', text: '弹出范围滑块 范围[MIN]到[MAX] 默认[D1]~[D2]', arguments: { MIN: { type: 'number', defaultValue: 0 }, MAX: { type: 'number', defaultValue: 100 }, D1: { type: 'number', defaultValue: 25 }, D2: { type: 'number', defaultValue: 75 } } },
        { opcode: 'createColorPickerModal', blockType: 'command', text: '弹出颜色选择器 默认颜色[DEFAULT]', arguments: { DEFAULT: { type: 'string', defaultValue: '#4080ff' } } },
        { opcode: 'createSingleSelectModal', blockType: 'command', text: '弹出单选列表 标题[TITLE] 选项[OPTIONS] 默认[DEFAULT]', arguments: { TITLE: { type: 'string', defaultValue: '请选择' }, OPTIONS: { type: 'string', defaultValue: '选项1,选项2,选项3' }, DEFAULT: { type: 'number', defaultValue: 1 } } },
        { opcode: 'createMultiSelectModal', blockType: 'command', text: '弹出多选列表 标题[TITLE] 选项[OPTIONS] 默认[DEFAULT]', arguments: { TITLE: { type: 'string', defaultValue: '请选择' }, OPTIONS: { type: 'string', defaultValue: '选项1,选项2,选项3' }, DEFAULT: { type: 'string', defaultValue: '' } } },
        { opcode: 'openCalendarModal', blockType: 'command', text: '弹出日历选择弹窗 宽[W]高[H]', arguments: { W: { type: 'number', defaultValue: 480 }, H: { type: 'number', defaultValue: 520 } } },
        { opcode: 'openClockModal', blockType: 'command', text: '弹出模拟表盘时钟 时区[TIME_ZONE] 表盘尺寸[SIZE]', arguments: { TIME_ZONE: { type: 'menu', menu: 'timezoneMenu' }, SIZE: { type: 'number', defaultValue: 320 } } },
        { opcode: 'getScoreValue', blockType: 'reporter', text: '评分星级' },
        { opcode: 'getSliderValue', blockType: 'reporter', text: '滑块值' },
        { opcode: 'getRangeSliderValue', blockType: 'reporter', text: '范围滑块值' },
        { opcode: 'getColorValue', blockType: 'reporter', text: '选择的颜色' },
        { opcode: 'getSingleSelectText', blockType: 'reporter', text: '单选选中文字' },
        { opcode: 'getMultiSelectText', blockType: 'reporter', text: '多选选中文字' },
        { opcode: 'getSelectedDate', blockType: 'reporter', text: '日历选中日期' },
        { opcode: 'getModalClickBtn', blockType: 'reporter', text: '弹窗点击的按钮' },
        { opcode: 'getInputValue', blockType: 'reporter', text: '输入框内容' },
        { opcode: 'setTargetColor', blockType: 'command', text: '修改[COLOR_TARGET]颜色为[SET_COL]', arguments: { COLOR_TARGET: { type: 'menu', menu: 'colorTargetMenu' }, SET_COL: { type: 'color', defaultValue: '#4080ff' } } },
        { opcode: 'setModalBtnText', blockType: 'command', text: '弹窗确定按钮文字改为[BTNTEXT]', arguments: { BTNTEXT: { type: 'string', defaultValue: '确定' } } },
        { opcode: 'setModalTitleFont', blockType: 'command', text: '设置弹窗标题字体为[FONT]', arguments: { FONT: { type: 'menu', menu: 'fontMenu', defaultValue: '楷体' } } },
        { opcode: 'setModalBodyFont', blockType: 'command', text: '设置弹窗正文字体为[FONT]', arguments: { FONT: { type: 'menu', menu: 'fontMenu', defaultValue: '楷体' } } },
        { opcode: 'setModalDraggable', blockType: 'command', text: '设置弹窗是否可拖动[SWITCH]', arguments: { SWITCH: { type: 'menu', menu: 'switchMenu', defaultValue: 'true' } } },
        { opcode: 'setModalBgBlur', blockType: 'command', text: '设置弹窗背景虚化[SWITCH] 强度[INTENSITY]', arguments: { SWITCH: { type: 'menu', menu: 'switchMenu' }, INTENSITY: { type: 'number', defaultValue: 8 } } },
        { opcode: 'modalIsOpen', blockType: 'Boolean', text: '弹窗已打开？' },
        { opcode: 'toggleModalShadow', blockType: 'command', text: '是否开启弹窗阴影[SWITCH]', arguments: { SWITCH: { type: 'menu', menu: 'switchMenu' } } },
        { opcode: 'toggleModalGlow', blockType: 'command', text: '是否开启弹窗外发光[SWITCH]', arguments: { SWITCH: { type: 'menu', menu: 'switchMenu' } } },
        { opcode: 'setGradientAll', blockType: 'command', text: '对[TARGET] 开启渐变[EN] 方向[DIR] 起始[C1] 终止[C2]', arguments: { TARGET: { type: 'menu', menu: 'targetMenu' }, EN: { type: 'menu', menu: 'switchMenu' }, DIR: { type: 'menu', menu: 'dirMenu' }, C1: { type: 'color', defaultValue: '#203050' }, C2: { type: 'color', defaultValue: '#101828' } } },
        { opcode: 'setGlowIntensity', blockType: 'command', text: '设置发光扩散强度[VAL]', arguments: { VAL: { type: 'number', defaultValue: 22 } } },
        { opcode: 'resetModalDefault', blockType: 'command', text: '弹窗恢复全部默认设置' }
      ]
    };
  }

  // 加载动画（已升级：带百分比进度 已加载 n%）
  showLoading(args) {
    this.hideLoading();
    this._initStyle();

    const mask = document.createElement('div');
    mask.className = 'loading-mask';

    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';

    const text = document.createElement('div');
    text.className = 'loading-text';
    text.innerText = '加载中...';

    const percentText = document.createElement('div');
    percentText.className = 'loading-percent';
    percentText.innerText = '已加载 0%';

    mask.append(spinner, text, percentText);
    document.body.append(mask);
    this.loadingWrapper = mask;

    const sec = Math.max(0.5, Number(args.SECONDS) || 3);
    const totalMs = sec * 1000;
    let currentMs = 0;
    let percent = 0;

    const interval = 50;
    this.loadingProgressTimer = setInterval(() => {
      currentMs += interval;
      percent = Math.min(100, Math.floor((currentMs / totalMs) * 100));
      if (percentText) percentText.innerText = `已加载 ${percent}%`;
    }, interval);

    this.loadingTimer = setTimeout(() => {
      if (percentText) percentText.innerText = `已加载 100%`;
      setTimeout(() => this.hideLoading(), 200);
    }, totalMs);
  }

  hideLoading() {
    if (this.loadingTimer) clearTimeout(this.loadingTimer);
    if (this.loadingProgressTimer) clearInterval(this.loadingProgressTimer);
    if (this.loadingWrapper) {
      this.loadingWrapper.remove();
      this.loadingWrapper = null;
    }
  }

  getScoreValue() { return this.scoreValue; }
  getSliderValue() { return this.sliderValue; }
  getRangeSliderValue() { return this.rangeSliderValue.join('~'); }
  getColorValue() { return this.colorValue; }
  getSingleSelectText() { return this._lastSingleOptions?.[this.singleSelectValue-1] || ''; }
  getMultiSelectText() { return this._lastMultiOptions?.filter((_,i)=>this.multiSelectValue.includes(i+1)).join(',') || ''; }
  getInputValue() { return this.inputValue || ""; }
  getSelectedDate() { return this.selectedDate || ""; }
  getModalClickBtn() { return this.clickResult ?? ''; }

  setModalBgBlur(args) {
    this.bgBlurEnable = args.SWITCH === 'true';
    let v = Number(args.INTENSITY);
    this.bgBlurIntensity = Math.max(0, Math.min(50, v));
    if (this.modalWrapper?.mask) {
      this.modalWrapper.mask.style.backdropFilter = this.bgBlurEnable ? `blur(${this.bgBlurIntensity}px)` : 'none';
      this.modalWrapper.mask.style.webkitBackdropFilter = this.modalWrapper.mask.style.backdropFilter;
    }
  }

  setModalDraggable(args) { this.dragEnabled = args.SWITCH === 'true'; }

  setModalTitleFont(args) {
    const fontMap = {'楷体':'KaiTi,STKaiti,楷体','宋体':'SimSun,STSong,宋体','黑体':'SimHei,STHeiti,黑体','微软雅黑':'Microsoft YaHei,YaHei UI,微软雅黑','隶书':'LiSu,STLiSu,隶书'};
    this.titleFont = fontMap[args.FONT] || args.FONT;
    this.inputFont = this.titleFont;
    if(this.modalWrapper?.box) this.modalWrapper.box.querySelectorAll('.dark-modal-title').forEach(e=>e.style.fontFamily=this.titleFont);
  }

  setModalBodyFont(args) {
    const fontMap = {'楷体':'KaiTi,STKaiti,楷体','宋体':'SimSun,STSong,宋体','黑体':'SimHei,STHeiti,黑体','微软雅黑':'Microsoft YaHei,YaHei UI,微软雅黑','隶书':'LiSu,STLiSu,隶书'};
    this.bodyFont = fontMap[args.FONT] || args.FONT;
    if(this.modalWrapper?.box) this.modalWrapper.box.querySelectorAll('.dark-modal-body,.dark-calendar-wrap,.dark-clock-wrap').forEach(e=>e.style.fontFamily=this.bodyFont);
  }

  _refreshBg(box) {
    if(!box) return;
    if(!this.gradEnable){box.style.background=this.bgColor;return;}
    const g=this.gradDir==='horizontal'?'90deg':'180deg';
    box.style.background=`linear-gradient(${g},${this.gradStart},${this.gradEnd})`;
  }

  closeModal(result){
    if(this.clockTimer)clearInterval(this.clockTimer);
    if(this.titleUpdateTimer)clearInterval(this.titleUpdateTimer);
    this.clickResult=result;
    if(this.modalWrapper){
      const b=this.modalWrapper.box,m=this.modalWrapper.mask;
      b.style.transform='scale(0.9)';b.style.opacity='0';
      m.style.opacity='0';setTimeout(()=>m.remove(),200);
      this.modalWrapper=null;
    }
    this.isDragging=false;
  }

  _initStyle(){
    const old=document.getElementById('dark-glass-css');
    if(old)old.remove();
    const s=document.createElement('style');
    s.id='dark-glass-css';
    s.textContent=`
.dark-modal-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .25s;backdrop-filter:blur(${this.bgBlurIntensity}px);-webkit-backdrop-filter:blur(${this.bgBlurIntensity}px);}
.dark-modal-box{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--modal-border,#4080ff);border-radius:28px;padding:32px;--shadow:rgba(64,128,255,.35);--glow:rgba(64,128,255,.45);box-shadow:8px 30px rgba(0,0,0,.4);position:absolute;transform:scale(.9);opacity:0;transition:.25s;user-select:none;box-sizing:border-box;overflow:hidden;}
.dark-modal-title{font-size:38px;font-weight:bold;color:#fff;margin:0 0 20px 0;cursor:move;text-align:center;width:100%;box-sizing:border-box;pointer-events:auto;}
.dark-modal-body{font-size:22px;color:#fff;line-height:1.6;margin:0 0 25px 0;box-sizing:border-box;pointer-events:auto;}
.dark-modal-input{width:100%;padding:12px 16px;border:2px solid var(--input-border,#2a2d35);border-radius:16px;background:#1c1e23;color:#fff;font-size:22px;outline:none;margin-bottom:20px;box-sizing:border-box;}
.dark-score-stars{display:flex;gap:12px;font-size:48px;color:#ccc;margin:20px 0;cursor:pointer;justify-content:center;}
.dark-score-star.active{color:#ffd700;}
.dark-slider{width:100%;height:8px;background:#2a2d35;border-radius:16px;appearance:none;margin:20px 0;box-sizing:border-box;}
.dark-slider::-webkit-slider-thumb{appearance:none;width:24px;height:24px;border-radius:50%;background:#4080ff;}
.dark-range-slider{width:100%;height:8px;background:#2a2d35;border-radius:16px;appearance:none;margin:10px 0;box-sizing:border-box;}
.dark-range-slider::-webkit-slider-thumb{appearance:none;width:24px;height:24px;border-radius:50%;background:#4080ff;}
.dark-color-picker{width:100%;height:60px;border:2px solid #2a2d35;border-radius:16px;background:transparent;padding:4px;margin:20px 0;box-sizing:border-box;}
.dark-select{width:100%;padding:12px 16px;border:2px solid #2a2d35;border-radius:16px;background:#1c1e23;color:#fff;font-size:22px;margin:20px 0;box-sizing:border-box;}
.dark-multi-option{display:flex;align-items:center;gap:10px;padding:8px 12px;color:#fff;font-size:20px;background:#1c1e23;border-radius:12px;margin-bottom:8px;box-sizing:border-box;}
.dark-modal-bottom-bar{display:flex;gap:16px;justify-content:center;margin-top:20px;align-items:center;width:100%;box-sizing:border-box;padding:0 10px;}
.dark-modal-btn{background:#4080ff;color:#fff;border:none;border-radius:999px;padding:10px 24px;font-size:18px;cursor:pointer;min-width:80px;max-width:120px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;}
.dark-modal-btn.cancel{background:#666;}
.dark-modal-close-x{position:absolute;top:20px;right:24px;background:none;border:none;color:#aaa;font-size:28px;cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;z-index:10;}
.dark-calendar-wrap{width:100%;color:#fff;font-size:20px;box-sizing:border-box;}
.dark-calendar-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;padding:0 10px;box-sizing:border-box;}
.dark-calendar-btn{background:#4080ff;color:#fff;border:none;border-radius:8px;padding:5px 10px;cursor:pointer;font-size:18px;}
.dark-calendar-week{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;margin-bottom:10px;font-weight:bold;color:#ccc;}
.dark-calendar-days{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;text-align:center;}
.dark-calendar-day{padding:10px 0;border-radius:8px;cursor:pointer;transition:background .2s;}
.dark-calendar-day:hover{background:rgba(64,128,255,0.2);}
.dark-calendar-day.selected{background:rgba(64,128,255,0.5);color:#fff;font-weight:bold;}
.dark-clock-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;box-sizing:border-box;}

.loading-mask{
  position:fixed;inset:0;z-index:999999;
  background:rgba(0,0,0,0.6);display:flex;
  flex-direction:column;align-items:center;justify-content:center;
  color:#fff;font-size:20px;gap:12px;
}
.loading-spinner{
  width:50px;height:50px;
  border:4px solid rgba(255,255,255,0.2);
  border-top:4px solid #00adb5;
  border-radius:50%;animation:spin 1s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg);}}
.loading-text{font-family:微软雅黑;}
.loading-percent{font-size:18px;color:#ffffff;font-family:微软雅黑;}
`;document.head.appendChild(s);
  }

  updateBoxShadow(box){
    let sp=['8px 30px rgba(0,0,0,0.4)'];
    if(this.shadowEnable)sp.push('0 20px var(--shadow)');
    if(this.glowEnable)sp.push(`0 0 var(--glow-spread,${this.glowSpread}px) var(--glow)`);
    box.style.boxShadow=sp.join(',');
  }

  _drag(t,b){
    let ix,iy,cx,cy,xo=0,yo=0,id=false;
    const ds=(e)=>{if(!this.dragEnabled)return;e.preventDefault();e.stopPropagation();ix=e.clientX-xo;iy=e.clientY-yo;id=true;if(e.target===t){document.addEventListener('mousemove',dh);document.addEventListener('mouseup',de);b.style.cursor='grabbing';}};
    const dh=(e)=>{if(!id)return;e.preventDefault();e.stopPropagation();cx=e.clientX-ix;cy=e.clientY-iy;xo=cx;yo=cy;b.style.transform=`translate(${cx}px,${cy}px)`;};
    const de=(e)=>{e.stopPropagation();ix=cx;iy=cy;id=false;document.removeEventListener('mousemove',dh);document.removeEventListener('mouseup',de);b.style.cursor='default';};
    t.addEventListener('mousedown',ds);
    b.addEventListener('mousedown',e=>e.stopPropagation());
  }

  _show(b,m){setTimeout(()=>{m.style.opacity='1';b.style.transform='scale(1)';b.style.opacity='1';},20);}

  applyLiveStyles(box){
    box.style.setProperty('--modal-border',this.customBorderColor);
    box.style.setProperty('--shadow',this.shadowColor);
    box.style.setProperty('--glow',this.glowColor);
    box.style.setProperty('--glow-spread',this.glowSpread+'px');
    this._refreshBg(box);
    this.updateBoxShadow(box);
    box.querySelectorAll('.dark-modal-title,.dark-modal-body').forEach(e=>e.style.color=this.textColor);
    if(this.borderGradEnable){
      const gd=this.borderGradDir==='horizontal'?'90deg':'180deg';
      box.style.borderImage=`linear-gradient(${gd},${this.borderGradStart},${this.borderGradEnd}) 1`;
      box.style.border='2px solid transparent';
    }else{
      box.style.borderImage='none';
      box.style.border=`1px solid ${this.customBorderColor}`;
    }
  }

  createContentModal(args){
    this.closeModal();this._initStyle();
    const m=document.createElement('div');m.className='dark-modal-mask';
    const b=document.createElement('div');b.className='dark-modal-box';
    b.style.width=args.W+'px';b.style.height=args.H+'px';
    const t=document.createElement('div');t.className='dark-modal-title';t.textContent=args.TITLE;t.style.fontFamily=this.titleFont;
    const c=document.createElement('button');c.className='dark-modal-close-x';c.textContent='×';
    const bd=document.createElement('div');bd.className='dark-modal-body';bd.textContent=args.CONTENT;bd.style.fontFamily=this.bodyFont;
    b.append(t,c,bd);m.append(b);document.body.append(m);
    this.modalWrapper={mask:m,box:b};
    this.applyLiveStyles(b);
    this._drag(t,b);
    this._show(b,m);
    m.onclick=(e)=>{if(e.target===m)this.closeModal('mask');};
    c.onclick=()=>this.closeModal('x');
  }

  createConfirmModal(args){
    this.closeModal();this._initStyle();
    const m=document.createElement('div');m.className='dark-modal-mask';
    const b=document.createElement('div');b.className='dark-modal-box';
    b.style.width=args.W+'px';b.style.height=args.H+'px';
    const t=document.createElement('div');t.className='dark-modal-title';t.textContent=args.TITLE;t.style.fontFamily=this.titleFont;
    const c=document.createElement('button');c.className='dark-modal-close-x';c.textContent='×';
    const bd=document.createElement('div');bd.className='dark-modal-body';bd.textContent=args.CONTENT;bd.style.fontFamily=this.bodyFont;
    const bar=document.createElement('div');bar.className='dark-modal-bottom-bar';
    const ok=document.createElement('button');ok.className='dark-modal-btn';ok.textContent=this.defaultBtnText;
    const cn=document.createElement('button');cn.className='dark-modal-btn cancel';cn.textContent='取消';
    bar.append(ok,cn);b.append(t,c,bd,bar);m.append(b);document.body.append(m);
    this.modalWrapper={mask:m,box:b};
    this.applyLiveStyles(b);
    this._drag(t,b);
    this._show(b,m);
    m.onclick=(e)=>{if(e.target===m)this.closeModal('mask');};
    ok.onclick=()=>this.closeModal('ok');
    cn.onclick=()=>this.closeModal('cancel');
    c.onclick=()=>this.closeModal('x');
  }

  createInputModal(args){
    this.closeModal();this._initStyle();
    this.inputValue=args.DEFAULT;
    const m=document.createElement('div');m.className='dark-modal-mask';
    const b=document.createElement('div');b.className='dark-modal-box';
    b.style.width=args.W+'px';b.style.height=args.H+'px';
    const t=document.createElement('div');t.className='dark-modal-title';t.textContent=args.TITLE;t.style.fontFamily=this.titleFont;
    const c=document.createElement('button');c.className='dark-modal-close-x';c.textContent='×';
    const ipt=document.createElement('input');ipt.className='dark-modal-input';ipt.placeholder=args.HINT;ipt.value=args.DEFAULT;ipt.style.fontFamily=this.inputFont;
    ipt.oninput=e=>this.inputValue=e.target.value;
    const bar=document.createElement('div');bar.className='dark-modal-bottom-bar';
    const ok=document.createElement('button');ok.className='dark-modal-btn';ok.textContent=this.defaultBtnText;
    const cn=document.createElement('button');cn.className='dark-modal-btn cancel';cn.textContent='取消';
    bar.append(ok,cn);b.append(t,c,ipt,bar);m.append(b);document.body.append(m);
    this.modalWrapper={mask:m,box:b};
    this.applyLiveStyles(b);
    this._drag(t,b);
    this._show(b,m);
    m.onclick=(e)=>{if(e.target===m)this.closeModal('mask');};
    ok.onclick=()=>this.closeModal('ok');
    cn.onclick=()=>{this.inputValue='';this.closeModal('cancel');};
    c.onclick=()=>{this.inputValue='';this.closeModal('x');};
  }

  createScoreModal(args){
    this.closeModal();this._initStyle();
    const m=document.createElement('div');m.className='dark-modal-mask';
    const b=document.createElement('div');b.className='dark-modal-box';
    b.style.width=args.W+'px';b.style.height=args.H+'px';
    const t=document.createElement('div');t.className='dark-modal-title';t.textContent=args.TITLE;t.style.fontFamily=this.titleFont;
    const c=document.createElement('button');c.className='dark-modal-close-x';c.textContent='×';
    const stars=document.createElement('div');stars.className='dark-score-stars';
    this.scoreMax=Math.max(1,Math.min(10,args.MAX_STAR));this.scoreValue=0;
    for(let i=1;i<=this.scoreMax;i++){const s=document.createElement('div');s.className='dark-score-star';s.textContent='★';s.dataset.v=i;s.onclick=()=>{this.scoreValue=i;stars.querySelectorAll('.dark-score-star').forEach((x,j)=>x.classList.toggle('active',j+1<=i));};stars.appendChild(s);}
    const bar=document.createElement('div');bar.className='dark-modal-bottom-bar';
    const ok=document.createElement('button');ok.className='dark-modal-btn';ok.textContent=this.defaultBtnText;
    const cn=document.createElement('button');cn.className='dark-modal-btn cancel';cn.textContent='取消';
    bar.append(ok,cn);b.append(t,c,stars,bar);m.append(b);document.body.append(m);
    this.modalWrapper={mask:m,box:b};
    this.applyLiveStyles(b);
    this._drag(t,b);
    this._show(b,m);
    m.onclick=(e)=>{if(e.target===m)this.closeModal('mask');};
    ok.onclick=()=>this.closeModal('ok');
    cn.onclick=()=>{this.scoreValue=0;this.closeModal('cancel');};
    c.onclick=()=>{this.scoreValue=0;this.closeModal('x');};
  }

  createSliderModal(args){
    this.closeModal();this._initStyle();
    const m=document.createElement('div');m.className='dark-modal-mask';
    const b=document.createElement('div');b.className='dark-modal-box';
    b.style.width='600px';b.style.height='240px';
    const t=document.createElement('div');t.className='dark-modal-title';t.textContent='滑块选择';t.style.fontFamily=this.titleFont;
    const c=document.createElement('button');c.className='dark-modal-close-x';c.textContent='×';
    const s=document.createElement('input');s.type='range';s.className='dark-slider';s.min=args.MIN;s.max=args.MAX;s.step=args.STEP;s.value=args.DEFAULT;this.sliderValue=args.DEFAULT;
    const val=document.createElement('div');val.style.color='#fff';val.style.fontSize='22px';val.textContent='值：'+s.value;val.style.textAlign='center';val.style.marginTop='10px';val.style.fontFamily=this.bodyFont;
    s.oninput=()=>{this.sliderValue=+s.value;val.textContent='值：'+s.value;};
    const bar=document.createElement('div');bar.className='dark-modal-bottom-bar';
    const ok=document.createElement('button');ok.className='dark-modal-btn';ok.textContent=this.defaultBtnText;
    const cn=document.createElement('button');cn.className='dark-modal-btn cancel';cn.textContent='取消';
    bar.append(ok,cn);b.append(t,c,s,val,bar);m.append(b);document.body.append(m);
    this.modalWrapper={mask:m,box:b};
    this.applyLiveStyles(b);
    this._drag(t,b);
    this._show(b,m);
    m.onclick=(e)=>{if(e.target===m)this.closeModal('mask');};
    ok.onclick=()=>this.closeModal('ok');
    cn.onclick=()=>{this.sliderValue=args.DEFAULT;this.closeModal('cancel');};
    c.onclick=()=>{this.sliderValue=args.DEFAULT;this.closeModal('x');};
  }

  createRangeSliderModal(args){
    this.closeModal();this._initStyle();
    const m=document.createElement('div');m.className='dark-modal-mask';
    const b=document.createElement('div');b.className='dark-modal-box';
    b.style.width='600px';b.style.height='280px';
    const t=document.createElement('div');t.className='dark-modal-title';t.textContent='范围选择';t.style.fontFamily=this.titleFont;
    const c=document.createElement('button');c.className='dark-modal-close-x';c.textContent='×';
    const s1=document.createElement('input');s1.type='range';s1.className='dark-range-slider';s1.min=args.MIN;s1.max=args.MAX;s1.value=args.D1;
    const s2=document.createElement('input');s2.type='range';s2.className='dark-range-slider';s2.min=args.MIN;s2.max=args.MAX;s2.value=args.D2;
    this.rangeSliderValue=[+args.D1,+args.D2];
    const val=document.createElement('div');val.style.color='#fff';val.style.fontSize='22px';val.style.textAlign='center';val.style.marginTop='10px';val.style.fontFamily=this.bodyFont;
    const u=()=>{const a=Math.min(+s1.value,+s2.value);const z=Math.max(+s1.value,+s2.value);this.rangeSliderValue=[a,z];val.textContent=`范围：${a} ~ ${z}`;};
    s1.oninput=u.bind(this);s2.oninput=u.bind(this);u.call(this);
    const bar=document.createElement('div');bar.className='dark-modal-bottom-bar';
    const ok=document.createElement('button');ok.className='dark-modal-btn';ok.textContent=this.defaultBtnText;
    const cn=document.createElement('button');cn.className='dark-modal-btn cancel';cn.textContent='取消';
    bar.append(ok,cn);b.append(t,c,s1,s2,val,bar);m.append(b);document.body.append(m);
    this.modalWrapper={mask:m,box:b};
    this.applyLiveStyles(b);
    this._drag(t,b);
    this._show(b,m);
    m.onclick=(e)=>{if(e.target===m)this.closeModal('mask');};
    ok.onclick=()=>this.closeModal('ok');
    cn.onclick=()=>{this.rangeSliderValue=[args.D1,args.D2];this.closeModal('cancel');};
    c.onclick=()=>{this.rangeSliderValue=[args.D1,args.D2];this.closeModal('x');};
  }

  createColorPickerModal(args){
    this.closeModal();this._initStyle();
    const m=document.createElement('div');m.className='dark-modal-mask';
    const b=document.createElement('div');b.className='dark-modal-box';
    b.style.width='500px';b.style.height='320px';
    const t=document.createElement('div');t.className='dark-modal-title';t.textContent='颜色选择';t.style.fontFamily=this.titleFont;
    const c=document.createElement('button');c.className='dark-modal-close-x';c.textContent='×';
    const cp=document.createElement('input');cp.type='color';cp.className='dark-color-picker';cp.value=args.DEFAULT||'#4080ff';this.colorValue=args.DEFAULT||'#4080ff';
    const val=document.createElement('div');val.style.color='#fff';val.style.fontSize='22px';val.textContent=cp.value;val.style.textAlign='center';val.style.marginTop='10px';val.style.fontFamily=this.bodyFont;
    cp.oninput=()=>{this.colorValue=cp.value;val.textContent=cp.value;};
    const bar=document.createElement('div');bar.className='dark-modal-bottom-bar';
    const ok=document.createElement('button');ok.className='dark-modal-btn';ok.textContent=this.defaultBtnText;
    const cn=document.createElement('button');cn.className='dark-modal-btn cancel';cn.textContent='取消';
    bar.append(ok,cn);b.append(t,c,cp,val,bar);m.append(b);document.body.append(m);
    this.modalWrapper={mask:m,box:b};
    this.applyLiveStyles(b);
    this._drag(t,b);
    this._show(b,m);
    m.onclick=(e)=>{if(e.target===m)this.closeModal('mask');};
    ok.onclick=()=>this.closeModal('ok');
    cn.onclick=()=>{this.colorValue=args.DEFAULT||'#4080ff';this.closeModal('cancel');};
    c.onclick=()=>{this.colorValue=args.DEFAULT||'#4080ff';this.closeModal('x');};
  }

  createSingleSelectModal(args){
    this.closeModal();this._initStyle();
    const opts=args.OPTIONS.split(',');this._lastSingleOptions=opts;
    const m=document.createElement('div');m.className='dark-modal-mask';
    const b=document.createElement('div');b.className='dark-modal-box';
    b.style.width='500px';b.style.height='280px';
    const t=document.createElement('div');t.className='dark-modal-title';t.textContent=args.TITLE;t.style.fontFamily=this.titleFont;
    const c=document.createElement('button');c.className='dark-modal-close-x';c.textContent='×';
    const sel=document.createElement('select');sel.className='dark-select';sel.style.fontFamily=this.bodyFont;
    opts.forEach((o,i)=>{const op=document.createElement('option');op.value=i+1;op.textContent=o;if(i+1==args.DEFAULT)op.selected=true;sel.append(op);});
    this.singleSelectValue=args.DEFAULT;sel.onchange=()=>this.singleSelectValue=+sel.value;
    const bar=document.createElement('div');bar.className='dark-modal-bottom-bar';
    const ok=document.createElement('button');ok.className='dark-modal-btn';ok.textContent=this.defaultBtnText;
    const cn=document.createElement('button');cn.className='dark-modal-btn cancel';cn.textContent='取消';
    bar.append(ok,cn);b.append(t,c,sel,bar);m.append(b);document.body.append(m);
    this.modalWrapper={mask:m,box:b};
    this.applyLiveStyles(b);
    this._drag(t,b);
    this._show(b,m);
    m.onclick=(e)=>{if(e.target===m)this.closeModal('mask');};
    ok.onclick=()=>this.closeModal('ok');
    cn.onclick=()=>{this.singleSelectValue=args.DEFAULT;this.closeModal('cancel');};
    c.onclick=()=>{this.singleSelectValue=args.DEFAULT;this.closeModal('x');};
  }

  createMultiSelectModal(args){
    this.closeModal();this._initStyle();
    const opts=args.OPTIONS.split(',');this._lastMultiOptions=opts;
    const def=args.DEFAULT?args.DEFAULT.split(',').map(Number):[];this.multiSelectValue=[...def];
    const m=document.createElement('div');m.className='dark-modal-mask';
    const b=document.createElement('div');b.className='dark-modal-box';
    b.style.width='500px';b.style.height='350px';
    const t=document.createElement('div');t.className='dark-modal-title';t.textContent=args.TITLE;t.style.fontFamily=this.titleFont;
    const c=document.createElement('button');c.className='dark-modal-close-x';c.textContent='×';
    const wrap=document.createElement('div');wrap.style.maxHeight='200px';wrap.style.overflowY='auto';wrap.style.fontFamily=this.bodyFont;
    opts.forEach((o,i)=>{const d=document.createElement('div');d.className='dark-multi-option';const cb=document.createElement('input');cb.type='checkbox';cb.dataset.i=i+1;if(def.includes(i+1))cb.checked=true;const l=document.createElement('label');l.textContent=o;d.append(cb,l);wrap.append(d);cb.onchange=()=>{const v=+cb.dataset.i;if(cb.checked){if(!this.multiSelectValue.includes(v))this.multiSelectValue.push(v);}else{this.multiSelectValue=this.multiSelectValue.filter(x=>x!==v);}};});
    const bar=document.createElement('div');bar.className='dark-modal-bottom-bar';
    const ok=document.createElement('button');ok.className='dark-modal-btn';ok.textContent=this.defaultBtnText;
    const cn=document.createElement('button');cn.className='dark-modal-btn cancel';cn.textContent='取消';
    bar.append(ok,cn);b.append(t,c,wrap,bar);m.append(b);document.body.append(m);
    this.modalWrapper={mask:m,box:b};
    this.applyLiveStyles(b);
    this._drag(t,b);
    this._show(b,m);
    m.onclick=(e)=>{if(e.target===m)this.closeModal('mask');};
    ok.onclick=()=>this.closeModal('ok');
    cn.onclick=()=>{this.multiSelectValue=[...def];this.closeModal('cancel');};
    c.onclick=()=>{this.multiSelectValue=[...def];this.closeModal('x');};
  }

  openCalendarModal(args){
    this.closeModal();this._initStyle();
    const td=new Date();this.selectedDate=`${td.getFullYear()}-${String(td.getMonth()+1).padStart(2,'0')}-${String(td.getDate()).padStart(2,'0')}`;
    const m=document.createElement('div');m.className='dark-modal-mask';
    const b=document.createElement('div');b.className='dark-modal-box';
    b.style.width=args.W+'px';b.style.height=args.H+'px';
    const t=document.createElement('div');t.className='dark-modal-title';t.textContent='日历选择';t.style.fontFamily=this.titleFont;
    const c=document.createElement('button');c.className='dark-modal-close-x';c.textContent='×';
    const wrap=document.createElement('div');wrap.className='dark-calendar-wrap';wrap.style.fontFamily=this.bodyFont;
    let y=td.getFullYear(),mo=td.getMonth();let sel=null;
    const r=()=>{wrap.innerHTML='';const h=document.createElement('div');h.className='dark-calendar-header';const p=document.createElement('button');p.className='dark-calendar-btn';p.textContent='<';const tx=document.createElement('div');tx.textContent=`${y}年${mo+1}月`;const n=document.createElement('button');n.className='dark-calendar-btn';n.textContent='>';h.append(p,tx,n);wrap.append(h);const wb=document.createElement('div');wb.className='dark-calendar-week';['日','一','二','三','四','五','六'].forEach(w=>{const i=document.createElement('div');i.textContent=w;wb.append(i);});wrap.append(wb);const dw=document.createElement('div');dw.className='dark-calendar-days';const fd=new Date(y,mo,1).getDay();const tot=new Date(y,mo+1,0).getDate();for(let i=0;i<fd;i++)dw.append(document.createElement('div'));for(let d=1;d<=tot;d++){const de=document.createElement('div');de.className='dark-calendar-day';de.textContent=d;if(d===td.getDate()&&y===td.getFullYear()&&mo===td.getMonth()){de.classList.add('selected');sel=de;}de.onclick=()=>{sel?.classList.remove('selected');sel=de;de.classList.add('selected');this.selectedDate=`${y}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;};dw.append(de);}wrap.append(dw);p.onclick=()=>{mo--;if(mo<0){mo=11;y--;}r();};n.onclick=()=>{mo++;if(mo>11){mo=0;y++;}r();};};r();
    const bar=document.createElement('div');bar.className='dark-modal-bottom-bar';
    const ok=document.createElement('button');ok.className='dark-modal-btn';ok.textContent=this.defaultBtnText;
    const cn=document.createElement('button');cn.className='dark-modal-btn cancel';cn.textContent='取消';
    bar.append(ok,cn);b.append(t,c,wrap,bar);m.append(b);document.body.append(m);
    this.modalWrapper={mask:m,box:b};
    this.applyLiveStyles(b);
    this._drag(t,b);
    this._show(b,m);
    m.onclick=(e)=>{if(e.target===m)this.closeModal('mask');};
    ok.onclick=()=>this.closeModal('ok');
    cn.onclick=()=>this.closeModal('cancel');
    c.onclick=()=>this.closeModal('x');
  }

  openClockModal(args){
    this.closeModal();this._initStyle();
    const m=document.createElement('div');m.className='dark-modal-mask';
    const b=document.createElement('div');b.className='dark-modal-box';
    const sz=+args.SIZE;b.style.width=(sz+80)+'px';b.style.height=(sz+220)+'px';
    this.curTimezoneOffset=Number(args.TIME_ZONE);const tzi=this.timezoneList.find(t=>t.offset===this.curTimezoneOffset);const rn=tzi?tzi.text.split('(')[0]:"未知";
    const t=document.createElement('div');t.className='dark-modal-title';t.style.fontFamily=this.titleFont;
    const c=document.createElement('button');c.className='dark-modal-close-x';c.textContent='×';
    const wrap=document.createElement('div');wrap.className='dark-clock-wrap';
    const cv=document.createElement('canvas');cv.width=sz;cv.height=sz;const ctx=cv.getContext('2d');
    const dr=()=>{ctx.clearRect(0,0,sz,sz);ctx.beginPath();ctx.arc(sz/2,sz/2,sz/2-10,0,Math.PI*2);ctx.fillStyle='#1c1e23';ctx.fill();ctx.strokeStyle='#4080ff';ctx.lineWidth=4;ctx.stroke();ctx.strokeStyle='#4080ff';ctx.lineCap='round';for(let i=0;i<60;i++){ctx.save();ctx.translate(sz/2,sz/2);ctx.rotate(i*6*Math.PI/180);ctx.beginPath();if(i%5===0){ctx.lineWidth=3;ctx.moveTo(0,-sz/2+12);ctx.lineTo(0,-sz/2+28);}else{ctx.lineWidth=1;ctx.moveTo(0,-sz/2+18);ctx.lineTo(0,-sz/2+24);}ctx.stroke();ctx.restore();}ctx.fillStyle='#fff';ctx.font=`bold ${sz*0.12}px ${this.bodyFont}`;ctx.textAlign='center';ctx.textBaseline='middle';for(let n=1;n<=12;n++){const r=n*30*Math.PI/180-Math.PI/2;const x=sz/2+Math.cos(r)*(sz/2-42);const y=sz/2+Math.sin(r)*(sz/2-42);ctx.fillText(String(n),x,y);}const now=new Date();const utc=now.getTime()+now.getTimezoneOffset()*60000;const tar=new Date(utc+3600000*this.curTimezoneOffset);const hh=tar.getHours()%12||12;const mm=tar.getMinutes();const ss=tar.getSeconds();t.textContent=`${rn}，${tar.getHours().toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}:${ss.toString().padStart(2,'0')}`;ctx.strokeStyle='#fff';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(sz/2,sz/2);ctx.lineTo(sz/2+Math.cos((hh*30+mm*0.5)*Math.PI/180-Math.PI/2)*(sz*0.3),sz/2+Math.sin((hh*30+mm*0.5)*Math.PI/180-Math.PI/2)*(sz*0.3));ctx.stroke();ctx.strokeStyle='#eee';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(sz/2,sz/2);ctx.lineTo(sz/2+Math.cos(mm*6*Math.PI/180-Math.PI/2)*(sz*0.42),sz/2+Math.sin(mm*6*Math.PI/180-Math.PI/2)*(sz*0.42));ctx.stroke();ctx.strokeStyle='#4080ff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sz/2,sz/2);ctx.lineTo(sz/2+Math.cos(ss*6*Math.PI/180-Math.PI/2)*(sz*0.45),sz/2+Math.sin(ss*6*Math.PI/180-Math.PI/2)*(sz*0.45));ctx.stroke();ctx.fillStyle='#4080ff';ctx.beginPath();ctx.arc(sz/2,sz/2,7,0,Math.PI*2);ctx.fill();};
    dr();this.clockTimer=setInterval(dr,1000);
    const bar=document.createElement('div');bar.className='dark-modal-bottom-bar';
    const ok=document.createElement('button');ok.className='dark-modal-btn';ok.textContent=this.defaultBtnText;
    const cn=document.createElement('button');cn.className='dark-modal-btn cancel';cn.textContent='取消';
    bar.append(ok,cn);wrap.append(cv);b.append(t,c,wrap,bar);m.append(b);document.body.append(m);
    this.modalWrapper={mask:m,box:b};
    this.applyLiveStyles(b);
    this._drag(t,b);
    this._show(b,m);
    m.onclick=(e)=>{if(e.target===m)this.closeModal('mask');};
    ok.onclick=()=>this.closeModal('ok');
    cn.onclick=()=>this.closeModal('cancel');
    c.onclick=()=>this.closeModal('x');
  }

  setTargetColor(args){
    const t=args.COLOR_TARGET,c=args.SET_COL;
    const box=this.modalWrapper?.box;
    if(t==='border'){this.customBorderColor=c;if(box)box.style.setProperty('--modal-border',c);}
    if(t==='shadow'){this.shadowColor=c+'55';if(box)box.style.setProperty('--shadow',this.shadowColor);}
    if(t==='glow'){this.glowColor=c+'55';if(box)box.style.setProperty('--glow',this.glowColor);}
    if(t==='text'){this.textColor=c;if(box)box.querySelectorAll('.dark-modal-title,.dark-modal-body').forEach(e=>e.style.color=c);}
    if(t==='bg'){this.bgColor=c+'cc';if(box)this._refreshBg(box);}
  }

  setModalBtnText(args){
    this.defaultBtnText=args.BTNTEXT;
    const box=this.modalWrapper?.box;
    if(box)box.querySelectorAll('.dark-modal-btn').forEach(btn=>{if(!btn.classList.contains('cancel'))btn.textContent=this.defaultBtnText;});
  }

  modalIsOpen(){return !!this.modalWrapper;}

  toggleModalShadow(args){
    this.shadowEnable=args.SWITCH==='true';
    const box=this.modalWrapper?.box;
    if(box)this.updateBoxShadow(box);
  }

  toggleModalGlow(args){
    this.glowEnable=args.SWITCH==='true';
    const box=this.modalWrapper?.box;
    if(box)this.updateBoxShadow(box);
  }

  setGlowIntensity(args){
    this.glowSpread=+args.VAL;
    const box=this.modalWrapper?.box;
    if(box){box.style.setProperty('--glow-spread',this.glowSpread+'px');this.updateBoxShadow(box);}
  }

  setGradientAll(args){
    const t=args.TARGET,en=args.EN==='true',d=args.DIR,c1=args.C1,c2=args.C2;
    const box=this.modalWrapper?.box;
    if(t==='bg'){this.gradEnable=en;this.gradDir=d;this.gradStart=c1;this.gradEnd=c2;if(box)this._refreshBg(box);}
    if(t==='border'){this.borderGradEnable=en;this.borderGradDir=d;this.borderGradStart=c1;this.borderGradEnd=c2;if(box){if(en){const gd=d==='horizontal'?'90deg':'180deg';box.style.borderImage=`linear-gradient(${gd},${c1},${c2}) 1`;box.style.border='2px solid transparent';}else{box.style.borderImage='none';box.style.border=`1px solid ${this.customBorderColor}`;}}}
  }

  resetModalDefault(){
    Object.assign(this,JSON.parse(JSON.stringify(this.original)));
    const box=this.modalWrapper?.box;
    if(!box)return;
    box.style.setProperty('--modal-border',this.original.borderColor);
    box.style.setProperty('--shadow',this.original.shadowColor);
    box.style.setProperty('--glow',this.original.glowColor);
    box.style.setProperty('--glow-spread',this.original.glowSpread+'px');
    this._refreshBg(box);
    this.updateBoxShadow(box);
    box.querySelectorAll('.dark-modal-title,.dark-modal-body').forEach(e=>e.style.color=this.original.textColor);
    box.querySelectorAll('.dark-modal-btn').forEach(btn=>{if(!btn.classList.contains('cancel'))btn.textContent=this.defaultBtnText;});
  }
}
Scratch.extensions.register(new DarkGlassModalExtension());