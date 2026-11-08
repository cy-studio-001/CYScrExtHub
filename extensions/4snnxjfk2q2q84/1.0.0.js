(function (Scratch) {
  "use strict";

  // 完整的SunCalc库实现
  const SunCalc = (function () {
    const rad = Math.PI / 180;
    const dayMs = 1000 * 60 * 60 * 24;
    const J1970 = 2440588;
    const J2000 = 2451545;
    
    // 转换为儒略日
    const toJulian = function (date) {
      return date.valueOf() / dayMs - 0.5 + J1970;
    };
    
    // 从儒略日转换
    const fromJulian = function (j) {
      return new Date((j + 0.5 - J1970) * dayMs);
    };
    
    // 计算太阳位置
    const getPosition = function (date, lat, lng) {
      const lw = rad * -lng;
      const phi = rad * lat;
      const d = toJulian(date) - J2000;
      
      // 太阳平黄经
      const g = rad * (357.529 + 0.98560028 * d);
      // 太阳中心差
      const q = rad * (280.459 + 0.98564736 * d);
      // 太阳黄经
      const L = q + rad * 1.915 * Math.sin(g) + rad * 0.02 * Math.sin(2 * g);
      
      // 黄赤交角
      const e = rad * 23.439 - rad * 0.00000036 * d;
      
      // 太阳赤经和赤纬
      const RA = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
      const D = Math.asin(Math.sin(e) * Math.sin(L));
      
      // 时角
      const siderealTime = rad * (280.16 + 360.9856235 * d);
      const H = siderealTime + lw - RA;
      
      return {
        azimuth: Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(D) * Math.cos(phi)),
        altitude: Math.asin(Math.sin(phi) * Math.sin(D) + Math.cos(phi) * Math.cos(D) * Math.cos(H)),
        dec: D,
        ra: RA,
        H: H
      };
    };
    
    // 计算太阳时间
    const getTimes = function (date, lat, lng) {
      const solarNoon = getSolarNoon(date, lng);
      const nadir = getNadir(solarNoon);
      
      const times = {
        solarNoon: solarNoon,
        nadir: nadir
      };
      
      // 定义各种太阳事件的高度角（单位：度）
      const angleMap = {
        // 早晨事件
        nightEnd: -18,      // 天文晨光始
        nauticalDawn: -12,  // 航海晨光始
        dawn: -6,          // 民用晨光始
        sunrise: -0.833,   // 日出开始
        sunriseEnd: -0.3,  // 日出结束
        // 白天事件
        goldenHourEnd: 6,   // 黄金时刻结束
        // 傍晚事件
        goldenHour: -6,     // 黄金时刻开始
        sunsetStart: -0.3,  // 日落开始
        sunset: -0.833,    // 日落结束
        dusk: -6,          // 民用昏影终
        nauticalDusk: -12,  // 航海昏影终
        night: -18         // 天文昏影终
      };
      
      // 计算所有事件的时间
      for (const [name, angle] of Object.entries(angleMap)) {
        const time = getTime(angle, solarNoon, lat, lng, name.includes('End') || name.includes('sunrise') || name === 'dawn' || name === 'nightEnd' || name === 'nauticalDawn');
        times[name] = time;
      }
      
      return times;
    };
    
    // 获取正午时间
    const getSolarNoon = function (date, lng) {
      const d = toJulian(date) - J2000;
      const lw = rad * -lng;
      const n = Math.round(d - 0.0009 - lw / (2 * Math.PI));
      const jStar = n + 0.0009 + lw / (2 * Math.PI);
      const M = rad * (357.5291 + 0.98560028 * jStar);
      const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
      const lam = rad * (280.46646 + 0.98564736 * jStar) + C;
      const jTransit = J2000 + jStar + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * lam);
      
      return fromJulian(jTransit);
    };
    
    // 获取午夜时间
    const getNadir = function (solarNoon) {
      return fromJulian(toJulian(solarNoon) - 0.5);
    };
    
    // 计算特定太阳高度角的时间
    const getTime = function (angle, solarNoon, lat, lng, isRise) {
      const lw = rad * -lng;
      const phi = rad * lat;
      const dh = angle * rad;
      
      const d = toJulian(solarNoon) - J2000;
      const n = Math.round(d - 0.0009 - lw / (2 * Math.PI));
      const jStar = n + 0.0009 + lw / (2 * Math.PI);
      
      const M = rad * (357.5291 + 0.98560028 * jStar);
      const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
      const lam = rad * (280.46646 + 0.98564736 * jStar) + C;
      const sinDec = Math.sin(rad * 23.439) * Math.sin(lam);
      const cosDec = Math.sqrt(1 - sinDec * sinDec);
      
      const cosH = (Math.sin(dh) - Math.sin(phi) * sinDec) / (Math.cos(phi) * cosDec);
      
      if (cosH > 1) return null; // 极夜，太阳永不升起
      if (cosH < -1) return null; // 极昼，太阳永不落下
      
      const H = Math.acos(cosH);
      
      let jTime;
      if (isRise) {
        jTime = J2000 + jStar - H / (2 * Math.PI);
      } else {
        jTime = J2000 + jStar + H / (2 * Math.PI);
      }
      
      // 调整到最近的一天
      jTime += Math.round(d - jTime + J2000) - 0.0009;
      
      return fromJulian(jTime);
    };
    
    return {
      getTimes: getTimes,
      getPosition: getPosition
    };
  })();

  class SunriseCalculator {
    constructor(runtime) {
      this.runtime = runtime;
    }

    getInfo() {
      return {
        id: "sunrisecalculator",
        name: "日出日落计算器",
        color1: "#FF9800",
        color2: "#F57C00",
        color3: "#E65100",
        blocks: [
          {
            opcode: "calculateTime",
            blockType: Scratch.BlockType.REPORTER,
            text: "经度[lon]纬度[lat]日期[date]的[type](UTC)",
            arguments: {
              lon: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 116.4074
              },
              lat: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 39.9042
              },
              date: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              type: {
                type: Scratch.ArgumentType.STRING,
                menu: "timeType"
              }
            }
          },
          {
            opcode: "addTime",
            blockType: Scratch.BlockType.REPORTER,
            text: "UTC[time]加[hours]时[minutes]分",
            arguments: {
              time: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "06:30:00"
              },
              hours: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 8
              },
              minutes: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: "getPart",
            blockType: Scratch.BlockType.REPORTER,
            text: "UTC[datetime]的[part]",
            arguments: {
              datetime: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "2025-12-13T06:30:00"
              },
              part: {
                type: Scratch.ArgumentType.STRING,
                menu: "datetimeParts"
              }
            }
          },
          {
            opcode: "getWeekday",
            blockType: Scratch.BlockType.REPORTER,
            text: "[date]的星期",
            arguments: {
              date: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "2025-12-13"
              }
            }
          },
          {
            opcode: "isUTCValid",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "UTC[datetime][type]是否有效",
            arguments: {
              datetime: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "2025-12-13T06:30:00"
              },
              type: {
                type: Scratch.ArgumentType.STRING,
                menu: "validationType"
              }
            }
          },
          {
            opcode: "isTimeValid",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "时间[time][mode]是否有效",
            arguments: {
              time: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "6:30"
              },
              mode: {
                type: Scratch.ArgumentType.STRING,
                menu: "validationMode"
              }
            }
          },
          {
            opcode: "isTimeInRange",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "时间[time]在[start]到[end]之间",
            arguments: {
              time: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "0:0:0"
              },
              start: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "22:0:0"
              },
              end: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "5:0:0"
              }
            }
          }
        ],
        menus: {
          timeType: {
            acceptReporters: true,
            items: [
              {
                text: "黎明（民用晨光始）",
                value: "dawn"
              },
              {
                text: "日出（太阳上边缘出现）",
                value: "sunrise"
              },
              {
                text: "太阳正午（太阳最高点）",
                value: "solarNoon"
              },
              {
                text: "黄金时刻（最佳光线）",
                value: "goldenHour"
              },
              {
                text: "日落开始（太阳下边缘触地平）",
                value: "sunsetStart"
              },
              {
                text: "日落（太阳完全消失）",
                value: "sunset"
              },
              {
                text: "黄昏（民用昏影终）",
                value: "dusk"
              },
              {
                text: "夜晚开始（天文昏影终）",
                value: "night"
              }
            ]
          },
          datetimeParts: {
            acceptReporters: true,
            items: [
              {
                text: "日期部分",
                value: "date"
              },
              {
                text: "时间部分",
                value: "time"
              },
              {
                text: "年",
                value: "year"
              },
              {
                text: "月",
                value: "month"
              },
              {
                text: "日",
                value: "day"
              },
              {
                text: "星期",
                value: "weekday"
              },
              {
                text: "时",
                value: "hour"
              },
              {
                text: "分",
                value: "minute"
              },
              {
                text: "秒",
                value: "second"
              }
            ]
          },
          validationType: {
            acceptReporters: true,
            items: [
              {
                text: "完整",
                value: "full"
              },
              {
                text: "日期",
                value: "date"
              },
              {
                text: "时间",
                value: "time"
              },
              {
                text: "任意",
                value: "any"
              }
            ]
          },
          validationMode: {
            acceptReporters: true,
            items: [
              {
                text: "严格",
                value: "strict"
              },
              {
                text: "不严格",
                value: "loose"
              }
            ]
          }
        }
      };
    }

    // 积木1: 计算各种太阳时间（增强版）
    calculateTime(args) {
      try {
        const lon = Scratch.Cast.toNumber(args.lon);
        const lat = Scratch.Cast.toNumber(args.lat);
        const dateStr = Scratch.Cast.toString(args.date).trim();
        const type = Scratch.Cast.toString(args.type);
        
        // 验证经纬度范围
        if (lon < -180 || lon > 180) return "经度超出范围(-180~180)";
        if (lat < -90 || lat > 90) return "纬度超出范围(-90~90)";
        
        // 解析日期
        let date;
        if (dateStr === "") {
          // 使用当前日期，但调整到中午计算
          const now = new Date();
          date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0));
        } else {
          // 解析 yyyy-mm-dd 格式
          const parts = dateStr.split("-");
          if (parts.length === 3) {
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const day = parseInt(parts[2]);
            
            if (isNaN(year) || isNaN(month) || isNaN(day)) {
              return "日期格式错误";
            }
            
            date = new Date(Date.UTC(year, month, day, 12, 0, 0));
          } else {
            return "日期格式错误，请使用 yyyy-mm-dd";
          }
        }
        
        if (isNaN(date.getTime())) {
          return "无效日期";
        }
        
        // 计算所有太阳时间
        const times = SunCalc.getTimes(date, lat, lon);
        
        // 检查是否存在该类型的时间
        if (!times.hasOwnProperty(type)) {
          return "不支持的时间类型";
        }
        
        const resultTime = times[type];
        
        if (resultTime === null) {
          // 处理极昼或极夜情况
          if (type === "sunrise" || type === "dawn") {
            return "极夜(太阳不升起)";
          } else if (type === "sunset" || type === "dusk" || type === "night") {
            return "极昼(太阳不落下)";
          }
          return "无法计算";
        }
        
        // 格式化为 UTC 时间字符串 (HH:MM:SS，24小时制)
        const hours = resultTime.getUTCHours().toString().padStart(2, '0');
        const minutes = resultTime.getUTCMinutes().toString().padStart(2, '0');
        const seconds = resultTime.getUTCSeconds().toString().padStart(2, '0');
        
        return `${hours}:${minutes}:${seconds}`;
      } catch (error) {
        console.error("计算错误:", error);
        return "计算错误";
      }
    }

    // 积木2: UTC时间加减
    addTime(args) {
      try {
        const timeStr = Scratch.Cast.toString(args.time).trim();
        const hours = Scratch.Cast.toNumber(args.hours);
        const minutes = Scratch.Cast.toNumber(args.minutes);
        
        // 解析时间字符串，支持灵活格式
        const timeParts = this.parseTimeString(timeStr, true);
        if (!timeParts.valid) {
          return "时间格式错误";
        }
        
        let hour = timeParts.hour;
        let minute = timeParts.minute;
        let second = timeParts.second;
        
        // 验证时间范围
        if (hour < 0 || hour > 23) return "小时超出范围(0-23)";
        if (minute < 0 || minute > 59) return "分钟超出范围(0-59)";
        if (second < 0 || second > 59) return "秒超出范围(0-59)";
        
        // 计算新的时间
        const date = new Date(Date.UTC(2000, 0, 1, hour, minute, second));
        const totalMinutes = hours * 60 + minutes;
        date.setUTCMinutes(date.getUTCMinutes() + totalMinutes);
        
        // 处理跨日
        while (date.getUTCHours() < 0) {
          date.setUTCHours(date.getUTCHours() + 24);
        }
        while (date.getUTCHours() >= 24) {
          date.setUTCHours(date.getUTCHours() - 24);
        }
        
        // 格式化为新的时间字符串 (24小时制)
        const newHour = date.getUTCHours().toString().padStart(2, '0');
        const newMinute = date.getUTCMinutes().toString().padStart(2, '0');
        const newSecond = date.getUTCSeconds().toString().padStart(2, '0');
        
        return `${newHour}:${newMinute}:${newSecond}`;
      } catch (error) {
        console.error("时间计算错误:", error);
        return "时间计算错误";
      }
    }

    // 积木3: 提取日期时间部分
    getPart(args) {
      try {
        const datetimeStr = Scratch.Cast.toString(args.datetime).trim();
        const part = Scratch.Cast.toString(args.part);
        
        // 解析日期时间字符串
        let date;
        if (datetimeStr.includes("T")) {
          // ISO格式 (yyyy-mm-ddTHH:MM:SS)
          date = new Date(datetimeStr);
        } else if (datetimeStr.includes(":")) {
          // 只有时间 (HH:MM:SS)
          const timeParts = this.parseTimeString(datetimeStr, true);
          if (!timeParts.valid) {
            return "时间格式错误";
          }
          date = new Date(Date.UTC(2000, 0, 1, timeParts.hour, timeParts.minute, timeParts.second));
        } else {
          // 只有日期 (yyyy-mm-dd)
          const parts = datetimeStr.split("-");
          if (parts.length === 3) {
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const day = parseInt(parts[2]);
            date = new Date(Date.UTC(year, month, day));
          } else {
            return "日期格式错误";
          }
        }
        
        if (isNaN(date.getTime())) {
          return "无效的日期时间";
        }
        
        // 根据要求提取部分
        switch (part) {
          case "date":
            // 返回日期部分 yyyy-mm-dd
            const year = date.getUTCFullYear();
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = date.getUTCDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
            
          case "time":
            // 返回时间部分 HH:MM:SS (24小时制)
            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            const seconds = date.getUTCSeconds().toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
            
          case "year":
            return date.getUTCFullYear().toString();
            
          case "month":
            return (date.getUTCMonth() + 1).toString();
            
          case "day":
            return date.getUTCDate().toString();
            
          case "weekday":
            const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
            return weekdays[date.getUTCDay()];
            
          case "hour":
            return date.getUTCHours().toString();
            
          case "minute":
            return date.getUTCMinutes().toString();
            
          case "second":
            return date.getUTCSeconds().toString();
            
          default:
            return "未知部分";
        }
      } catch (error) {
        console.error("提取错误:", error);
        return "提取错误";
      }
    }

    // 积木4: 计算星期几
    getWeekday(args) {
      try {
        const dateStr = Scratch.Cast.toString(args.date).trim();
        
        // 解析 yyyy-mm-dd 格式
        const parts = dateStr.split("-");
        if (parts.length !== 3) {
          return "日期格式错误";
        }
        
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        
        // 验证日期
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          return "日期格式错误";
        }
        
        const date = new Date(Date.UTC(year, month, day));
        
        if (isNaN(date.getTime())) {
          return "无效的日期";
        }
        
        // 星期映射
        const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        const weekdayIndex = date.getUTCDay();
        
        return weekdays[weekdayIndex];
      } catch (error) {
        console.error("星期计算错误:", error);
        return "计算错误";
      }
    }

    // 积木5: UTC时间字符串有效性检查
    isUTCValid(args) {
      try {
        const datetimeStr = Scratch.Cast.toString(args.datetime).trim();
        const type = Scratch.Cast.toString(args.type);
        
        if (datetimeStr === "") {
          return false;
        }
        
        // 根据类型进行验证
        switch (type) {
          case "full":
            // 完整格式: yyyy-mm-ddTHH:MM:SS
            return this.isFullUTCValid(datetimeStr);
            
          case "date":
            // 仅日期格式: yyyy-mm-dd
            return this.isDateValid(datetimeStr);
            
          case "time":
            // 仅时间格式: 使用不严格模式验证时间
            return this.isTimeStringValidLoose(datetimeStr);
            
          case "any":
            // 任意格式: 尝试解析任意格式
            return this.isAnyDateTimeValid(datetimeStr);
            
          default:
            return false;
        }
      } catch (error) {
        console.error("有效性检查错误:", error);
        return false;
      }
    }

    // 积木6: 时间字符串有效性检查（新增模式选择）
    isTimeValid(args) {
      try {
        const timeStr = Scratch.Cast.toString(args.time).trim();
        const mode = Scratch.Cast.toString(args.mode);
        
        if (timeStr === "") {
          return false;
        }
        
        if (mode === "strict") {
          return this.isTimeStringValidStrict(timeStr);
        } else {
          // 不严格模式
          return this.isTimeStringValidLoose(timeStr);
        }
      } catch (error) {
        console.error("时间有效性检查错误:", error);
        return false;
      }
    }

    // 积木7: 检查时间是否在范围内（支持跨天和灵活格式）
    isTimeInRange(args) {
      try {
        const timeStr = Scratch.Cast.toString(args.time).trim();
        const startStr = Scratch.Cast.toString(args.start).trim();
        const endStr = Scratch.Cast.toString(args.end).trim();
        
        // 使用不严格模式验证时间格式
        if (!this.isTimeStringValidLoose(timeStr) || 
            !this.isTimeStringValidLoose(startStr) || 
            !this.isTimeStringValidLoose(endStr)) {
          return false;
        }
        
        // 解析时间字符串为秒数（使用灵活格式）
        const timeSec = this.timeToSecondsLoose(timeStr);
        const startSec = this.timeToSecondsLoose(startStr);
        const endSec = this.timeToSecondsLoose(endStr);
        
        // 检查是否跨天（结束时间小于开始时间）
        if (endSec < startSec) {
          // 跨天情况：时间在 [start, 24:00:00) 或 [00:00:00, end]
          return timeSec >= startSec || timeSec <= endSec;
        } else {
          // 不跨天情况：时间在 [start, end]
          return timeSec >= startSec && timeSec <= endSec;
        }
      } catch (error) {
        console.error("时间范围检查错误:", error);
        return false;
      }
    }

    // =================== 辅助方法 ===================

    // 辅助方法: 验证完整UTC格式 (yyyy-mm-ddTHH:MM:SS)
    isFullUTCValid(datetimeStr) {
      // 检查是否包含T分隔符
      if (!datetimeStr.includes("T")) {
        return false;
      }
      
      const parts = datetimeStr.split("T");
      if (parts.length !== 2) {
        return false;
      }
      
      const datePart = parts[0];
      const timePart = parts[1];
      
      // 验证日期部分
      if (!this.isDateValid(datePart)) {
        return false;
      }
      
      // 验证时间部分（使用不严格模式，因为可能输入不标准格式）
      if (!this.isTimeStringValidLoose(timePart)) {
        return false;
      }
      
      // 尝试创建Date对象验证
      const date = new Date(datetimeStr);
      return !isNaN(date.getTime());
    }

    // 辅助方法: 验证日期格式 (yyyy-mm-dd)
    isDateValid(dateStr) {
      const parts = dateStr.split("-");
      if (parts.length !== 3) {
        return false;
      }
      
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);
      
      // 验证数字
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return false;
      }
      
      // 验证月份范围
      if (month < 1 || month > 12) {
        return false;
      }
      
      // 验证日期范围
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      
      // 处理闰年
      if (month === 2 && ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0))) {
        if (day < 1 || day > 29) return false;
      } else {
        if (day < 1 || day > daysInMonth[month - 1]) return false;
      }
      
      // 验证年份范围（合理范围）
      if (year < 1000 || year > 3000) {
        return false;
      }
      
      return true;
    }

    // 辅助方法: 严格验证时间格式 (HH:MM:SS，必须补零)
    isTimeStringValidStrict(timeStr) {
      const parts = timeStr.split(":");
      if (parts.length !== 3) {
        return false;
      }
      
      const hour = parseInt(parts[0]);
      const minute = parseInt(parts[1]);
      const second = parseInt(parts[2]);
      
      // 验证数字
      if (isNaN(hour) || isNaN(minute) || isNaN(second)) {
        return false;
      }
      
      // 验证范围
      if (hour < 0 || hour > 23) {
        return false;
      }
      
      if (minute < 0 || minute > 59) {
        return false;
      }
      
      if (second < 0 || second > 59) {
        return false;
      }
      
      // 验证格式（必须补零）
      if (parts[0].length !== 2 || parts[1].length !== 2 || parts[2].length !== 2) {
        return false;
      }
      
      return true;
    }

    // 辅助方法: 灵活验证时间格式 (支持多种格式)
    isTimeStringValidLoose(timeStr) {
      if (timeStr === "") {
        return false;
      }
      
      const parts = timeStr.split(":");
      
      // 支持格式: H, H:m, H:m:s, HH, HH:mm, HH:mm:ss
      if (parts.length < 1 || parts.length > 3) {
        return false;
      }
      
      // 解析各部分
      let hour, minute, second;
      
      // 小时
      hour = parseInt(parts[0]);
      if (isNaN(hour) || hour < 0 || hour > 23) {
        return false;
      }
      
      // 分钟（如果有）
      if (parts.length >= 2) {
        minute = parseInt(parts[1]);
        if (isNaN(minute) || minute < 0 || minute > 59) {
          return false;
        }
      } else {
        minute = 0; // 默认值
      }
      
      // 秒（如果有）
      if (parts.length >= 3) {
        second = parseInt(parts[2]);
        if (isNaN(second) || second < 0 || second > 59) {
          return false;
        }
      } else {
        second = 0; // 默认值
      }
      
      return true;
    }

    // 辅助方法: 验证任意格式的日期时间
    isAnyDateTimeValid(datetimeStr) {
      // 尝试完整格式
      if (this.isFullUTCValid(datetimeStr)) {
        return true;
      }
      
      // 尝试仅日期格式
      if (this.isDateValid(datetimeStr)) {
        return true;
      }
      
      // 尝试仅时间格式（灵活模式）
      if (this.isTimeStringValidLoose(datetimeStr)) {
        return true;
      }
      
      return false;
    }

    // 辅助方法: 将灵活格式的时间字符串转换为秒数
    timeToSecondsLoose(timeStr) {
      const parts = timeStr.split(":");
      
      let hour = 0, minute = 0, second = 0;
      
      // 小时
      if (parts.length >= 1) {
        hour = parseInt(parts[0]) || 0;
      }
      
      // 分钟
      if (parts.length >= 2) {
        minute = parseInt(parts[1]) || 0;
      }
      
      // 秒
      if (parts.length >= 3) {
        second = parseInt(parts[2]) || 0;
      }
      
      return hour * 3600 + minute * 60 + second;
    }

    // 辅助方法: 解析时间字符串（支持灵活格式）
    parseTimeString(timeStr, requireValid = true) {
      if (timeStr === "") {
        return { valid: false, hour: 0, minute: 0, second: 0 };
      }
      
      const parts = timeStr.split(":");
      
      // 支持格式: H, H:m, H:m:s, HH, HH:mm, HH:mm:ss
      if (parts.length < 1 || parts.length > 3) {
        return { valid: false, hour: 0, minute: 0, second: 0 };
      }
      
      // 解析各部分
      let hour, minute, second;
      
      // 小时
      hour = parseInt(parts[0]);
      if (isNaN(hour)) {
        return { valid: false, hour: 0, minute: 0, second: 0 };
      }
      
      // 分钟（如果有）
      if (parts.length >= 2) {
        minute = parseInt(parts[1]);
        if (isNaN(minute)) {
          return { valid: false, hour: 0, minute: 0, second: 0 };
        }
      } else {
        minute = 0; // 默认值
      }
      
      // 秒（如果有）
      if (parts.length >= 3) {
        second = parseInt(parts[2]);
        if (isNaN(second)) {
          return { valid: false, hour: 0, minute: 0, second: 0 };
        }
      } else {
        second = 0; // 默认值
      }
      
      // 如果需要验证有效性，检查范围
      if (requireValid) {
        if (hour < 0 || hour > 23) {
          return { valid: false, hour: hour, minute: minute, second: second };
        }
        
        if (minute < 0 || minute > 59) {
          return { valid: false, hour: hour, minute: minute, second: second };
        }
        
        if (second < 0 || second > 59) {
          return { valid: false, hour: hour, minute: minute, second: second };
        }
      }
      
      return { valid: true, hour: hour, minute: minute, second: second };
    }
  }

  // 注册扩展
  Scratch.extensions.register(new SunriseCalculator());
})(Scratch);