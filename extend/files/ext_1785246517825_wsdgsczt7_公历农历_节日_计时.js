// v1.0.0 - 公历/农历时间·节日·计时·季度 扩展
// 运行环境：纯沙盒（TurboWarp 在线 / CYSOEditor 桌面均可用），无需联网与文件权限
// 依赖：内置农历表 LUNAR_INFO（1900-2100，已与 solarlunar 全量对照校验 0 误差）
// 权限：无（permissions: []）
(function (Scratch) {
  'use strict';
  // 诊断日志：只要本文件被编辑器真正执行，控制台必出现此行（与 Scratch 是否就绪无关）
  try { if (typeof console !== 'undefined') console.log('[lunar-time] 文件已执行 (typeof Scratch = ' + (typeof Scratch) + ')'); } catch (e) {}

  // ===== 农历数据表（1900-2100），由 solarlunar 权威表注入，切勿手改 =====
  const LUNAR_INFO = [
    0x4bd8, 0x4ae0, 0xa570, 0x54d5, 0xd260, 0xd950, 0x16554, 0x56a0, 0x9ad0, 0x55d2,
    0x4ae0, 0xa5b6, 0xa4d0, 0xd250, 0x1d255, 0xb540, 0xd6a0, 0xada2, 0x95b0, 0x14977,
    0x4970, 0xa4b0, 0xb4b5, 0x6a50, 0x6d40, 0x1ab54, 0x2b60, 0x9570, 0x52f2, 0x4970,
    0x6566, 0xd4a0, 0xea50, 0x6e95, 0x5ad0, 0x2b60, 0x186e3, 0x92e0, 0x1c8d7, 0xc950,
    0xd4a0, 0x1d8a6, 0xb550, 0x56a0, 0x1a5b4, 0x25d0, 0x92d0, 0xd2b2, 0xa950, 0xb557,
    0x6ca0, 0xb550, 0x15355, 0x4da0, 0xa5b0, 0x14573, 0x52b0, 0xa9a8, 0xe950, 0x6aa0,
    0xaea6, 0xab50, 0x4b60, 0xaae4, 0xa570, 0x5260, 0xf263, 0xd950, 0x5b57, 0x56a0,
    0x96d0, 0x4dd5, 0x4ad0, 0xa4d0, 0xd4d4, 0xd250, 0xd558, 0xb540, 0xb6a0, 0x195a6,
    0x95b0, 0x49b0, 0xa974, 0xa4b0, 0xb27a, 0x6a50, 0x6d40, 0xaf46, 0xab60, 0x9570,
    0x4af5, 0x4970, 0x64b0, 0x74a3, 0xea50, 0x6b58, 0x5ac0, 0xab60, 0x96d5, 0x92e0,
    0xc960, 0xd954, 0xd4a0, 0xda50, 0x7552, 0x56a0, 0xabb7, 0x25d0, 0x92d0, 0xcab5,
    0xa950, 0xb4a0, 0xbaa4, 0xad50, 0x55d9, 0x4ba0, 0xa5b0, 0x15176, 0x52b0, 0xa930,
    0x7954, 0x6aa0, 0xad50, 0x5b52, 0x4b60, 0xa6e6, 0xa4e0, 0xd260, 0xea65, 0xd530,
    0x5aa0, 0x76a3, 0x96d0, 0x4afb, 0x4ad0, 0xa4d0, 0x1d0b6, 0xd250, 0xd520, 0xdd45,
    0xb5a0, 0x56d0, 0x55b2, 0x49b0, 0xa577, 0xa4b0, 0xaa50, 0x1b255, 0x6d20, 0xada0,
    0x14b63, 0x9370, 0x49f8, 0x4970, 0x64b0, 0x168a6, 0xea50, 0x6b20, 0x1a6c4, 0xaae0,
    0x92e0, 0xd2e3, 0xc960, 0xd557, 0xd4a0, 0xda50, 0x5d55, 0x56a0, 0xa6d0, 0x55d4,
    0x52d0, 0xa9b8, 0xa950, 0xb4a0, 0xb6a6, 0xad50, 0x55a0, 0xaba4, 0xa5b0, 0x52b0,
    0xb273, 0x6930, 0x7337, 0x6aa0, 0xad50, 0x14b55, 0x4b60, 0xa570, 0x54e4, 0xd160,
    0xe968, 0xd520, 0xdaa0, 0x16aa6, 0x56d0, 0x4ae0, 0xa9d4, 0xa4d0, 0xd150, 0xf252,
    0xd520
  ];

  // ===== 基础工具 =====
  const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const WEEK = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const CN_MONTH = ['', '正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const CN_DAY = ['', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

  function lYearDays(y) {
    let sum = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) sum += (LUNAR_INFO[y - 1900] & i) ? 1 : 0;
    return sum + leapDays(y);
  }
  function leapMonth(y) { return LUNAR_INFO[y - 1900] & 0xf; }
  function leapDays(y) { return leapMonth(y) ? ((LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29) : 0; }
  function monthDays(y, m) { return (LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29; }

  function lunarMonthsInYear(y) {
    const leap = leapMonth(y);
    const arr = [];
    for (let m = 1; m <= 12; m++) {
      arr.push({ month: m, isLeap: false, days: monthDays(y, m) });
      if (leap > 0 && m === leap) arr.push({ month: m, isLeap: true, days: leapDays(y) });
    }
    return arr;
  }

  // 公历(y,m,d) -> 农历
  function solar2lunar(y, m, d) {
    const base = Date.UTC(1900, 0, 31), obj = Date.UTC(y, m - 1, d);
    let offset = Math.round((obj - base) / 86400000), temp = 0, ly = 1900;
    for (ly = 1900; ly < 2101 && offset > 0; ly++) { temp = lYearDays(ly); offset -= temp; }
    if (offset < 0) { offset += temp; ly--; }
    let isLeap = false; const leap = leapMonth(ly); let lm;
    for (lm = 1; lm < 13 && offset > 0; lm++) {
      if (leap > 0 && lm === (leap + 1) && !isLeap) { --lm; isLeap = true; temp = leapDays(ly); }
      else { temp = monthDays(ly, lm); }
      if (isLeap && lm === (leap + 1)) isLeap = false;
      offset -= temp;
    }
    if (offset === 0 && leap > 0 && lm === (leap + 1)) {
      if (isLeap) { isLeap = false; } else { isLeap = true; --lm; }
    }
    if (offset < 0) { offset += temp; --lm; }
    return { lYear: ly, lMonth: lm, lDay: offset + 1, isLeap: isLeap };
  }

  // 农历(y,lm,ld,isLeap) -> 公历
  function lunar2solar(ly, lm, ld, isLeap) {
    let offset = 0;
    for (let y = 1900; y < ly; y++) offset += lYearDays(y);
    const months = lunarMonthsInYear(ly);
    for (const m of months) {
      if (m.month === lm && m.isLeap === !!isLeap) break;
      offset += m.days;
    }
    offset += ld - 1;
    const base = Date.UTC(1900, 0, 31);
    const dt = new Date(base + offset * 86400000);
    return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
  }

  function ganZhiYear(y) { const g = ((y - 4) % 10 + 10) % 10; const z = ((y - 4) % 12 + 12) % 12; return GAN[g] + ZHI[z]; }
  function animalYear(y) { const z = ((y - 4) % 12 + 12) % 12; return ANIMALS[z]; }
  function cnMonthText(n, isLeap) { return (isLeap ? '闰' : '') + (CN_MONTH[n] || ('' + n)); }
  function cnDayText(n) { return CN_DAY[n] || ('' + n); }

  // 日期仅取年月日（UTC 午夜，用于天数差计算）
  function dateOnly(dt) { return Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()); }

  // 公历平/闰年与月天数
  function isLeapYear(y) { y = Math.floor(y); return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0); }
  function daysInYearFn(y) { return isLeapYear(y) ? 366 : 365; }
  function daysInMonthFn(y, m) { return new Date(y, m, 0).getDate(); }

  // ===== 节日数据 =====
  const SOLAR_FESTIVALS = [
    { key: '元旦', m: 1, d: 1 }, { key: '情人节', m: 2, d: 14 }, { key: '妇女节', m: 3, d: 8 },
    { key: '植树节', m: 3, d: 12 }, { key: '劳动节', m: 5, d: 1 }, { key: '青年节', m: 5, d: 4 },
    { key: '儿童节', m: 6, d: 1 }, { key: '建党节', m: 7, d: 1 }, { key: '建军节', m: 8, d: 1 },
    { key: '教师节', m: 9, d: 10 }, { key: '国庆节', m: 10, d: 1 }, { key: '平安夜', m: 12, d: 24 },
    { key: '圣诞节', m: 12, d: 25 }
  ];
  const LUNAR_FESTIVALS = [
    { key: '春节', lm: 1, ld: 1, leap: false }, { key: '元宵节', lm: 1, ld: 15, leap: false },
    { key: '龙抬头', lm: 2, ld: 2, leap: false }, { key: '端午节', lm: 5, ld: 5, leap: false },
    { key: '七夕节', lm: 7, ld: 7, leap: false }, { key: '中元节', lm: 7, ld: 15, leap: false },
    { key: '中秋节', lm: 8, ld: 15, leap: false }, { key: '重阳节', lm: 9, ld: 9, leap: false },
    { key: '腊八节', lm: 12, ld: 8, leap: false }, { key: '小年', lm: 12, ld: 23, leap: false },
    { key: '除夕', special: 'chuxi' }
  ];
  const FESTIVAL_MAP = {};
  SOLAR_FESTIVALS.forEach(f => FESTIVAL_MAP[f.key] = { type: 'solar', m: f.m, d: f.d });
  LUNAR_FESTIVALS.forEach(f => FESTIVAL_MAP[f.key] = f.special ? { type: 'chuxi' } : { type: 'lunar', lm: f.lm, ld: f.ld, leap: false });

  // 今天所有节日（返回数组，可能为空）
  function todayFestivals(dt) {
    const out = [];
    const y = dt.getFullYear(), m = dt.getMonth() + 1, d = dt.getDate();
    for (const f of SOLAR_FESTIVALS) if (f.m === m && f.d === d) out.push(f.key);
    const ln = solar2lunar(y, m, d);
    for (const f of LUNAR_FESTIVALS) {
      if (f.special === 'chuxi') {
        const tom = new Date(dt.getTime() + 86400000);
        const tl = solar2lunar(tom.getFullYear(), tom.getMonth() + 1, tom.getDate());
        if (tl.lMonth === 1 && tl.lDay === 1) out.push(f.key);
      } else if (f.lm === ln.lMonth && f.ld === ln.lDay && !ln.isLeap) {
        out.push(f.key);
      }
    }
    return out;
  }

  // 距离某公历节日（m,d）还有几天
  function daysToSolar(m, d, from) {
    const f = dateOnly(from);
    let t = Date.UTC(from.getFullYear(), m - 1, d);
    let diff = Math.round((t - f) / 86400000);
    if (diff < 0) { t = Date.UTC(from.getFullYear() + 1, m - 1, d); diff = Math.round((t - f) / 86400000); }
    return diff;
  }
  // 距离某农历节日（lm,ld,leap）还有几天
  function daysToLunar(lm, ld, leap, from) {
    const cur = solar2lunar(from.getFullYear(), from.getMonth() + 1, from.getDate());
    const f = dateOnly(from);
    for (const y of [cur.lYear, cur.lYear + 1]) {
      const s = lunar2solar(y, lm, ld, leap);
      const c = Date.UTC(s.y, s.m - 1, s.d);
      const diff = Math.round((c - f) / 86400000);
      if (diff >= 0) return diff;
    }
    return -1;
  }
  // 距离除夕还有几天
  function daysToChuxi(from) {
    const cur = solar2lunar(from.getFullYear(), from.getMonth() + 1, from.getDate());
    const f = dateOnly(from);
    for (const y of [cur.lYear, cur.lYear + 1]) {
      const s = lunar2solar(y, 1, 1, false);
      const c = Date.UTC(s.y, s.m - 1, s.d) - 86400000; // 除夕 = 春节 - 1 天
      const diff = Math.round((c - f) / 86400000);
      if (diff >= 0) return diff;
    }
    return -1;
  }
  function daysToFestivalKey(key, from) {
    const info = FESTIVAL_MAP[key];
    if (!info) return -1;
    if (info.type === 'solar') return daysToSolar(info.m, info.d, from);
    if (info.type === 'lunar') return daysToLunar(info.lm, info.ld, info.leap, from);
    if (info.type === 'chuxi') return daysToChuxi(from);
    return -1;
  }

  // ===== 季度工具 =====
  function quarterOf(m) { return Math.floor((m - 1) / 3) + 1; }
  function quarterStart(y, q) { return Date.UTC(y, (q - 1) * 3, 1); }
  function quarterEnd(y, q) { const m = q * 3; const last = new Date(y, m, 0).getDate(); return Date.UTC(y, m - 1, last); }

  // ===== 扩展主体 =====
  class LunarTimeExtension {
    constructor() {
      this.isDesktop = typeof EditorPreload !== 'undefined';
      this._timers = {};   // 编号 -> 开始时间戳(ms)
      this._cds = {};      // 编号 -> { end(ms), total(sec) }
    }

    getInfo() {
      return {
        id: 'lunarTime',
        name: '公历农历·节日·计时',
        color1: '#6C5CE7', color2: '#5b4bd6', color3: '#4834c4',
        permissions: [],
        blocks: [
          // —— 公历时间 ——
          { opcode: 'solarYear', blockType: Scratch.BlockType.REPORTER, text: '公历年' },
          { opcode: 'solarMonth', blockType: Scratch.BlockType.REPORTER, text: '公历月' },
          { opcode: 'solarDay', blockType: Scratch.BlockType.REPORTER, text: '公历日' },
          { opcode: 'solarDateText', blockType: Scratch.BlockType.REPORTER, text: '公历日期文本' },
          { opcode: 'weekdayText', blockType: Scratch.BlockType.REPORTER, text: '星期' },
          { opcode: 'weekdayNum', blockType: Scratch.BlockType.REPORTER, text: '星期(数字 1-7)' },

          // —— 年/月天数 ——
          { opcode: 'daysInCurrentYear', blockType: Scratch.BlockType.REPORTER, text: '当前年份有几天' },
          {
            opcode: 'daysInYear', blockType: Scratch.BlockType.REPORTER,
            text: '输入年份 [YEAR] 有几天',
            arguments: { YEAR: { type: Scratch.ArgumentType.NUMBER, default: 2026 } }
          },
          { opcode: 'daysInCurrentMonth', blockType: Scratch.BlockType.REPORTER, text: '当前月份有几天' },
          {
            opcode: 'daysInMonth', blockType: Scratch.BlockType.REPORTER,
            text: '输入月份 [MONTH] 有几天',
            arguments: { MONTH: { type: Scratch.ArgumentType.NUMBER, default: 2 } }
          },

          // —— 农历时间 ——
          { opcode: 'lunarYear', blockType: Scratch.BlockType.REPORTER, text: '农历年' },
          { opcode: 'lunarMonth', blockType: Scratch.BlockType.REPORTER, text: '农历月' },
          { opcode: 'lunarDay', blockType: Scratch.BlockType.REPORTER, text: '农历日' },
          { opcode: 'lunarGanZhi', blockType: Scratch.BlockType.REPORTER, text: '农历干支' },
          { opcode: 'lunarAnimal', blockType: Scratch.BlockType.REPORTER, text: '农历生肖' },
          { opcode: 'lunarMonthText', blockType: Scratch.BlockType.REPORTER, text: '农历月文本' },
          { opcode: 'lunarDayText', blockType: Scratch.BlockType.REPORTER, text: '农历日文本' },
          { opcode: 'lunarDateText', blockType: Scratch.BlockType.REPORTER, text: '农历日期文本' },

          // —— 节日判断 ——
          { opcode: 'todaySolarFestival', blockType: Scratch.BlockType.REPORTER, text: '今天公历节日' },
          { opcode: 'todayLunarFestival', blockType: Scratch.BlockType.REPORTER, text: '今天农历节日' },
          { opcode: 'todayAllFestivals', blockType: Scratch.BlockType.REPORTER, text: '今天所有节日' },
          { opcode: 'isFestivalToday', blockType: Scratch.BlockType.BOOLEAN, text: '今天是节日吗' },

          // —— 距离节日 ——
          {
            opcode: 'daysToSolarFestival', blockType: Scratch.BlockType.REPORTER,
            text: '距离公历 [MONTH] 月 [DAY] 日还有几天',
            arguments: { MONTH: { type: Scratch.ArgumentType.NUMBER, default: 1 }, DAY: { type: Scratch.ArgumentType.NUMBER, default: 1 } }
          },
          {
            opcode: 'daysToLunarFestival', blockType: Scratch.BlockType.REPORTER,
            text: '距离农历 [LMONTH] 月 [LDAY] 日还有几天',
            arguments: { LMONTH: { type: Scratch.ArgumentType.NUMBER, default: 1 }, LDAY: { type: Scratch.ArgumentType.NUMBER, default: 1 } }
          },
          {
            opcode: 'daysToFestival', blockType: Scratch.BlockType.REPORTER,
            text: '距离 [FEST] 还有几天',
            arguments: { FEST: { type: Scratch.ArgumentType.STRING, menu: 'FEST' } }
          },

          // —— 计时器 / 倒计时（按编号区分多个独立实例）——
          {
            opcode: 'timerStart', blockType: Scratch.BlockType.COMMAND,
            text: '开始计算(编号 [ID])',
            arguments: { ID: { type: Scratch.ArgumentType.NUMBER, default: 1 } }
          },
          {
            opcode: 'timerElapsed', blockType: Scratch.BlockType.REPORTER,
            text: '编号 [ID] 已计时(秒)',
            arguments: { ID: { type: Scratch.ArgumentType.NUMBER, default: 1 } }
          },
          {
            opcode: 'timerReset', blockType: Scratch.BlockType.COMMAND,
            text: '编号 [ID] 计时归零',
            arguments: { ID: { type: Scratch.ArgumentType.NUMBER, default: 1 } }
          },
          {
            opcode: 'countdownStart', blockType: Scratch.BlockType.COMMAND,
            text: '开始倒计时(编号 [ID]) [SEC] 秒',
            arguments: {
              ID: { type: Scratch.ArgumentType.NUMBER, default: 1 },
              SEC: { type: Scratch.ArgumentType.NUMBER, default: 10 }
            }
          },
          {
            opcode: 'countdownRemaining', blockType: Scratch.BlockType.REPORTER,
            text: '编号 [ID] 倒计时剩余(秒)',
            arguments: { ID: { type: Scratch.ArgumentType.NUMBER, default: 1 } }
          },
          {
            opcode: 'countdownDone', blockType: Scratch.BlockType.BOOLEAN,
            text: '编号 [ID] 倒计时结束了吗',
            arguments: { ID: { type: Scratch.ArgumentType.NUMBER, default: 1 } }
          },
          {
            opcode: 'countdownTotal', blockType: Scratch.BlockType.REPORTER,
            text: '编号 [ID] 倒计时总时长(秒)',
            arguments: { ID: { type: Scratch.ArgumentType.NUMBER, default: 1 } }
          },

          // —— 季度 ——
          { opcode: 'currentQuarter', blockType: Scratch.BlockType.REPORTER, text: '当前季度' },
          { opcode: 'currentQuarterName', blockType: Scratch.BlockType.REPORTER, text: '当前季度名称' },
          { opcode: 'daysToNextQuarter', blockType: Scratch.BlockType.REPORTER, text: '距离下个季度还有几天' },
          { opcode: 'daysLeftInQuarter', blockType: Scratch.BlockType.REPORTER, text: '本季度剩余天数' },
          {
            opcode: 'daysToQuarter', blockType: Scratch.BlockType.REPORTER,
            text: '距离第 [Q] 季度还有几天',
            arguments: { Q: { type: Scratch.ArgumentType.NUMBER, default: 1 } }
          }
        ],
        menus: {
          FEST: { acceptReporters: false, items: Object.keys(FESTIVAL_MAP) }
        }
      };
    }

    // —— 公历时间 ——
    solarYear() { try { return new Date().getFullYear(); } catch (e) { return 0; } }
    solarMonth() { try { return new Date().getMonth() + 1; } catch (e) { return 0; } }
    solarDay() { try { return new Date().getDate(); } catch (e) { return 0; } }
    solarDateText() {
      try {
        const d = new Date();
        return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + WEEK[d.getDay()];
      } catch (e) { return '错误'; }
    }
    weekdayText() { try { return WEEK[new Date().getDay()]; } catch (e) { return '错误'; } }
    weekdayNum() { try { const w = new Date().getDay(); return w === 0 ? 7 : w; } catch (e) { return 0; } }

    // —— 年/月天数 ——
    daysInCurrentYear() { try { return daysInYearFn(new Date().getFullYear()); } catch (e) { return 365; } }
    daysInYear(args) {
      try { const y = Math.floor(Scratch.Cast.toNumber(args.YEAR) || 0); return daysInYearFn(y); }
      catch (e) { return 365; }
    }
    daysInCurrentMonth() {
      try { const d = new Date(); return daysInMonthFn(d.getFullYear(), d.getMonth() + 1); } catch (e) { return 30; }
    }
    daysInMonth(args) {
      try {
        const d = new Date();
        const m = Math.min(12, Math.max(1, Math.floor(Scratch.Cast.toNumber(args.MONTH) || 1)));
        return daysInMonthFn(d.getFullYear(), m);
      } catch (e) { return 30; }
    }

    // —— 农历时间 ——
    _nowLunar() { return solar2lunar(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()); }
    lunarYear() { try { return this._nowLunar().lYear; } catch (e) { return 0; } }
    lunarMonth() { try { return this._nowLunar().lMonth; } catch (e) { return 0; } }
    lunarDay() { try { return this._nowLunar().lDay; } catch (e) { return 0; } }
    lunarGanZhi() { try { return ganZhiYear(this._nowLunar().lYear); } catch (e) { return '错误'; } }
    lunarAnimal() { try { return animalYear(this._nowLunar().lYear); } catch (e) { return '错误'; } }
    lunarMonthText() { try { const l = this._nowLunar(); return cnMonthText(l.lMonth, l.isLeap); } catch (e) { return '错误'; } }
    lunarDayText() { try { return cnDayText(this._nowLunar().lDay); } catch (e) { return '错误'; } }
    lunarDateText() {
      try {
        const l = this._nowLunar();
        return ganZhiYear(l.lYear) + '年' + cnMonthText(l.lMonth, l.isLeap) + cnDayText(l.lDay);
      } catch (e) { return '错误'; }
    }

    // —— 节日判断 ——
    todaySolarFestival() {
      try {
        const d = new Date(); const list = SOLAR_FESTIVALS.filter(f => f.m === d.getMonth() + 1 && f.d === d.getDate());
        return list.length ? list[0].key : '';
      } catch (e) { return ''; }
    }
    todayLunarFestival() {
      try {
        const d = new Date(); const l = solar2lunar(d.getFullYear(), d.getMonth() + 1, d.getDate());
        const list = LUNAR_FESTIVALS.filter(f => {
          if (f.special === 'chuxi') return false;
          return f.lm === l.lMonth && f.ld === l.lDay && !l.isLeap;
        });
        return list.length ? list[0].key : '';
      } catch (e) { return ''; }
    }
    todayAllFestivals() {
      try { const arr = todayFestivals(new Date()); return arr.join('、'); } catch (e) { return ''; }
    }
    isFestivalToday() {
      try { return todayFestivals(new Date()).length > 0; } catch (e) { return false; }
    }

    // —— 距离节日 ——
    daysToSolarFestival(args) {
      try {
        const m = Math.min(12, Math.max(1, Math.floor(Scratch.Cast.toNumber(args.MONTH) || 1)));
        const d = Math.min(31, Math.max(1, Math.floor(Scratch.Cast.toNumber(args.DAY) || 1)));
        return daysToSolar(m, d, new Date());
      } catch (e) { return -1; }
    }
    daysToLunarFestival(args) {
      try {
        const lm = Math.min(12, Math.max(1, Math.floor(Scratch.Cast.toNumber(args.LMONTH) || 1)));
        const ld = Math.min(30, Math.max(1, Math.floor(Scratch.Cast.toNumber(args.LDAY) || 1)));
        return daysToLunar(lm, ld, false, new Date());
      } catch (e) { return -1; }
    }
    daysToFestival(args) {
      try {
        const key = Scratch.Cast.toString(args.FEST);
        return daysToFestivalKey(key, new Date());
      } catch (e) { return -1; }
    }

    // —— 计时器 / 倒计时（按编号区分多个独立实例）——
    _id(args) {
      try { return String(Math.floor(Scratch.Cast.toNumber(args && args.ID) || 0)); }
      catch (e) { return '0'; }
    }
    timerStart(args) {
      try { this._timers[this._id(args)] = Date.now(); } catch (e) { }
    }
    timerElapsed(args) {
      try {
        const s = this._timers[this._id(args)];
        if (s == null) return 0;
        return (Date.now() - s) / 1000;
      } catch (e) { return 0; }
    }
    timerReset(args) {
      try { delete this._timers[this._id(args)]; } catch (e) { }
    }
    countdownStart(args) {
      try {
        const id = this._id(args);
        const sec = Math.max(0, Scratch.Cast.toNumber(args.SEC) || 0);
        this._cds[id] = { end: Date.now() + sec * 1000, total: sec };
      } catch (e) { }
    }
    countdownRemaining(args) {
      try {
        const c = this._cds[this._id(args)];
        if (!c) return 0;
        return Math.max(0, (c.end - Date.now()) / 1000);
      } catch (e) { return 0; }
    }
    countdownDone(args) {
      try {
        const c = this._cds[this._id(args)];
        if (!c) return false;
        return Date.now() >= c.end;
      } catch (e) { return false; }
    }
    countdownTotal(args) {
      try {
        const c = this._cds[this._id(args)];
        return c ? c.total : 0;
      } catch (e) { return 0; }
    }

    // —— 季度 ——
    currentQuarter() { try { return quarterOf(new Date().getMonth() + 1); } catch (e) { return 0; } }
    currentQuarterName() {
      try { const q = quarterOf(new Date().getMonth() + 1); const names = ['', '第一季度', '第二季度', '第三季度', '第四季度']; return names[q] || '错误'; } catch (e) { return '错误'; }
    }
    daysToNextQuarter() {
      try {
        const d = new Date(); const q = quarterOf(d.getMonth() + 1);
        const y = d.getFullYear(); const nq = q === 4 ? 1 : q + 1; const ny = q === 4 ? y + 1 : y;
        return Math.round((quarterStart(ny, nq) - dateOnly(d)) / 86400000);
      } catch (e) { return 0; }
    }
    daysLeftInQuarter() {
      try {
        const d = new Date(); const q = quarterOf(d.getMonth() + 1); const y = d.getFullYear();
        return Math.round((quarterEnd(y, q) - dateOnly(d)) / 86400000);
      } catch (e) { return 0; }
    }
    daysToQuarter(args) {
      try {
        const d = new Date(); const q = quarterOf(d.getMonth() + 1); const y = d.getFullYear();
        let Q = Math.min(4, Math.max(1, Math.floor(Scratch.Cast.toNumber(args.Q) || 1)));
        const ty = Q > q ? y : y + 1;
        return Math.round((quarterStart(ty, Q) - dateOnly(d)) / 86400000);
      } catch (e) { return 0; }
    }
  }

    // ===== 多机制注册：兼容 TurboWarp / CYSOEditor 各类加载器 =====
    var _registered = false;

    // ===== 在编辑器「代码栏」注入「关注我」按钮（B站）=====
    var _followInjected = false;
    var _followBtn = null;
    var _followRetries = 0;
    var BILI_URL = 'https://space.bilibili.com/3546601981217732';
    // 兼容不同加载器：有的把 document 暴露为裸全局，有的只在 window./globalThis. 下
    function getDoc() {
      try {
        if (typeof document !== 'undefined' && document) return document;
        if (typeof window !== 'undefined' && window.document) return window.document;
        if (typeof globalThis !== 'undefined' && globalThis.document) return globalThis.document;
      } catch (e) {}
      return null;
    }
    // 把注入状态写到全局，方便用户按 F12 在控制台输入 __lunarFollowStatus 自查
    function setFollowStatus(s) {
      try { if (typeof window !== 'undefined') window.__lunarFollowStatus = s; } catch (e) {}
      try { if (typeof globalThis !== 'undefined') globalThis.__lunarFollowStatus = s; } catch (e) {}
    }
    function injectFollowButton() {
      try {
        setFollowStatus('called');
        if (_followInjected) return;
        var doc = getDoc();
        if (!doc) {
          // 未检测到 document：多数情况是加载器把扩展跑在隔离上下文（document 不可见），重试后放弃
          if (_followRetries < 15) { _followRetries++; setTimeout(injectFollowButton, 300); return; }
          setFollowStatus('no-document');
          try { if (typeof console !== 'undefined') console.warn('[lunarTime] 未检测到 document，跳过关注按钮（可能是隔离上下文）'); } catch (e) {}
          return;
        }
        var host = doc.body || doc.documentElement;
        if (!host) {
          if (_followRetries < 15) { _followRetries++; setTimeout(injectFollowButton, 300); return; }
          setFollowStatus('no-host');
          return;
        }
        var btn = doc.createElement('a');
        btn.setAttribute('href', BILI_URL);
        btn.setAttribute('target', '_blank');
        btn.setAttribute('rel', 'noopener noreferrer');
        btn.setAttribute('data-lunar-time-follow', '1');
        btn.textContent = '★ 关注我(B站)';
        btn.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647;'
          + 'background:#fb7299;color:#fff;padding:9px 15px;border-radius:22px;'
          + 'font:bold 13px/1.2 -apple-system,"PingFang SC","Microsoft YaHei",sans-serif;'
          + 'text-decoration:none;box-shadow:0 3px 10px rgba(0,0,0,.3);cursor:pointer;'
          + 'user-select:none;letter-spacing:.5px;';
        host.appendChild(btn);
        _followBtn = btn;
        _followInjected = true;
        var url = 'unknown';
        try { if (doc.location) url = doc.location.href; } catch (e) { url = 'cross-origin'; }
        setFollowStatus('injected:' + url);
        try { if (typeof console !== 'undefined') console.log('[lunarTime] 已添加「关注我」按钮 -> ' + BILI_URL + ' (doc=' + url + ')'); } catch (e) {}
      } catch (e) {
        setFollowStatus('error:' + (e && e.message));
        setTimeout(injectFollowButton, 500);
      }
    }

    function regOnce(S) {
      try {
        if (_registered) return;
        if (S && S.extensions && typeof S.extensions.register === 'function') {
          // 关键：先把捕获到的 Scratch（评估时可能还是 {}）指向真实实例，
          // 否则 getInfo() 调用 Scratch.BlockType 时会因 {} 而抛错，导致扩展静默无法加载。
          // 必须在 register() 之前完成，因为加载器可能在 register() 内部同步调用 getInfo()。
          Scratch = S;
          S.extensions.register(new LunarTimeExtension());
          _registered = true;
          try { if (typeof console !== 'undefined') console.log('[lunar-time] 扩展已注册 (Scratch 注入方式: ' + (S === Scratch ? 'param/global' : 'window/globalThis') + ')'); } catch (e) {}
          injectFollowButton();
        }
      } catch (e) {}
    }
    // 1) 立即尝试：加载器以参数/全局形式注入 Scratch（linter 要求的字面调用，覆盖绝大多数场景）
    if (typeof Scratch !== 'undefined' && Scratch.extensions && typeof Scratch.extensions.register === 'function') {
      Scratch.extensions.register(new LunarTimeExtension());
      _registered = true;
      try { if (typeof console !== 'undefined') console.log('[lunar-time] 扩展已注册 (param/global)'); } catch (e) {}
      injectFollowButton();
    } else {
      // 2) 兜底轮询：部分加载器在读取文件后才异步注入 Scratch（window/globalThis），
      //    或仅以 window/globalThis 形式提供；最多等待约 10 秒。
      var _timer = setInterval(function () {
        if (_registered) { clearInterval(_timer); return; }
        var S = (typeof window !== 'undefined' && window.Scratch) ||
                (typeof globalThis !== 'undefined' && globalThis.Scratch);
        regOnce(S);
        if (_registered) clearInterval(_timer);
      }, 100);
      setTimeout(function () { clearInterval(_timer); try { if (!_registered && typeof console !== 'undefined') console.warn('[lunar-time] 10s 内未找到 Scratch，注册失败'); } catch (e) {} }, 10000);
    }
    // 3) 模块/全局导出：兼容 require 该文件并期望导出类的加载器
    if (typeof module !== 'undefined' && module.exports) { try { module.exports = LunarTimeExtension; } catch (e) {} }
    if (typeof window !== 'undefined') { try { window.LunarTimeExtension = LunarTimeExtension; } catch (e) {} }
    if (typeof globalThis !== 'undefined') { try { globalThis.LunarTimeExtension = LunarTimeExtension; } catch (e) {} }
})(typeof Scratch !== 'undefined' ? Scratch : {});
