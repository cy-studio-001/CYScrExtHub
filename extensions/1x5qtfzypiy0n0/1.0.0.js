(function(Scratch) {
  'use strict';
  
  // 扩展信息
  const EXTENSION_NAME = '坐标转换';
  const EXTENSION_COLOR = '#00FF7F'; // 清新绿色
  
  // 角度单位常量
  const DEG = 'Deg';
  const RAD = 'Rad';
  const GRA = 'Gra';
  
  // 转换格式常量
  const FORMAT_DMS = 'dms';
  const FORMAT_DEG = 'deg';
  const FORMAT_RAD = 'rad';
  const FORMAT_GRA = 'gra';
  
  // 数学常量
  const PI = Math.PI;
  const E = Math.E;
  
  // 三角函数常量
  const SIN = 'sin';
  const COS = 'cos';
  const TAN = 'tan';
  const CSC = 'csc';
  const SEC = 'sec';
  const COT = 'cot';
  const ARCSIN = 'arcsin';
  const ARCCOS = 'arccos';
  const ARCTAN = 'arctan';
  const ARCCSC = 'arccsc';
  const ARCSEC = 'arcsec';
  const ARCCOT = 'arccot';
  const SINH = 'sinh';
  const COSH = 'cosh';
  const TANH = 'tanh';
  const CSCH = 'csch';
  const SECH = 'sech';
  const COTH = 'coth';
  const ARCSINH = 'arcsinh';
  const ARCCOSH = 'arccosh';
  const ARCTANH = 'arctanh';
  const ARCCSCH = 'arccsch';
  const ARCSECH = 'arcsech';
  const ARCCOTH = 'arccoth';
  
  // 坐标分量常量
  const X = 'x';
  const Y = 'y';
  const R = 'r';
  const THETA = 'θ';
  
  // 判断是否为普通三角函数（需要角度输入）
  function isOrdinaryTrigFunction(func) {
    const ordinaryFunctions = [SIN, COS, TAN, CSC, SEC, COT];
    return ordinaryFunctions.includes(func);
  }
  
  // 判断是否为反三角函数或双曲函数（需要数值输入）
  function isInverseOrHyperbolicFunction(func) {
    const inverseHyperbolicFunctions = [
      ARCSIN, ARCCOS, ARCTAN, ARCCSC, ARCSEC, ARCCOT,
      SINH, COSH, TANH, CSCH, SECH, COTH,
      ARCSINH, ARCCOSH, ARCTANH, ARCCSCH, ARCSECH, ARCCOTH
    ];
    return inverseHyperbolicFunctions.includes(func);
  }
  
  // 角度转换函数
  function toRadians(angle, unit) {
    switch(unit) {
      case DEG: return angle * Math.PI / 180;
      case RAD: return angle;
      case GRA: return angle * Math.PI / 200;
      default: return angle;
    }
  }
  
  function fromRadians(angle, unit) {
    switch(unit) {
      case DEG: return angle * 180 / Math.PI;
      case RAD: return angle;
      case GRA: return angle * 200 / Math.PI;
      default: return angle;
    }
  }
  
  // 解析角度字符串，支持多种格式
  function parseAngleString(str) {
    // 如果已经是数字，直接返回
    if (!isNaN(str) && str !== '') {
      return {
        value: parseFloat(str),
        unit: RAD,
        isDegrees: false
      };
    }
    
    // 转换为字符串
    const inputStr = String(str).trim();
    
    // 如果是空字符串，返回默认值
    if (inputStr === '') {
      return {
        value: 0,
        unit: RAD,
        isDegrees: false
      };
    }
    
    // 移除所有空格
    const cleanString = inputStr.replace(/\s/g, '');
    
    // 尝试匹配度分秒格式：xºy'z"
    const dmsRegex = /^(-?\d+(?:\.\d+)?)º(-?\d+(?:\.\d+)?)?'?(-?\d+(?:\.\d+)?)?"?$/;
    const dmsMatch = cleanString.match(dmsRegex);
    
    if (dmsMatch) {
      const degrees = parseFloat(dmsMatch[1]) || 0;
      const minutes = dmsMatch[2] ? parseFloat(dmsMatch[2]) : 0;
      const seconds = dmsMatch[3] ? parseFloat(dmsMatch[3]) : 0;
      
      return {
        value: degrees + minutes/60 + seconds/3600,
        unit: DEG,
        isDegrees: true
      };
    }
    
    // 尝试匹配带单位的格式：x deg, x rad, x gra (不区分大小写)
    const unitRegex = /^(-?\d+(?:\.\d+)?)\s*(deg|rad|gra|°)$/i;
    const unitMatch = inputStr.match(unitRegex);
    
    if (unitMatch) {
      const value = parseFloat(unitMatch[1]) || 0;
      const unit = unitMatch[2].toLowerCase();
      
      if (unit === '°') {
        return {
          value: value,
          unit: DEG,
          isDegrees: true
        };
      }
      
      return {
        value: value,
        unit: unit === 'deg' ? DEG : (unit === 'rad' ? RAD : GRA),
        isDegrees: unit === 'deg'
      };
    }
    
    // 尝试匹配度符号格式：xº
    const degSymbolRegex = /^(-?\d+(?:\.\d+)?)º$/;
    const degSymbolMatch = cleanString.match(degSymbolRegex);
    
    if (degSymbolMatch) {
      return {
        value: parseFloat(degSymbolMatch[1]) || 0,
        unit: DEG,
        isDegrees: true
      };
    }
    
    // 尝试匹配分秒组合格式：x'y", xºy', xºy"
    const partialRegex1 = /^(-?\d+(?:\.\d+)?)'(-?\d+(?:\.\d+)?)"$/; // x'y"
    const partialMatch1 = cleanString.match(partialRegex1);
    
    if (partialMatch1) {
      const minutes = parseFloat(partialMatch1[1]) || 0;
      const seconds = parseFloat(partialMatch1[2]) || 0;
      
      return {
        value: minutes/60 + seconds/3600,
        unit: DEG,
        isDegrees: true
      };
    }
    
    const partialRegex2 = /^(-?\d+(?:\.\d+)?)º(-?\d+(?:\.\d+)?)'$/; // xºy'
    const partialMatch2 = cleanString.match(partialRegex2);
    
    if (partialMatch2) {
      const degrees = parseFloat(partialMatch2[1]) || 0;
      const minutes = parseFloat(partialMatch2[2]) || 0;
      
      return {
        value: degrees + minutes/60,
        unit: DEG,
        isDegrees: true
      };
    }
    
    const partialRegex3 = /^(-?\d+(?:\.\d+)?)º(-?\d+(?:\.\d+)?)"$/; // xºy"
    const partialMatch3 = cleanString.match(partialRegex3);
    
    if (partialMatch3) {
      const degrees = parseFloat(partialMatch3[1]) || 0;
      const seconds = parseFloat(partialMatch3[2]) || 0;
      
      return {
        value: degrees + seconds/3600,
        unit: DEG,
        isDegrees: true
      };
    }
    
    // 尝试纯数字匹配（最后尝试）
    const numValue = parseFloat(cleanString);
    if (!isNaN(numValue)) {
      return {
        value: numValue,
        unit: RAD,
        isDegrees: false
      };
    }
    
    // 如果无法解析，返回NaN
    return {
      value: NaN,
      unit: RAD,
      isDegrees: false
    };
  }
  
  // 将任意输入转换为弧度
  function convertInputToRadians(input) {
    if (typeof input === 'number') {
      return input; // 假设是弧度
    }
    
    const parsed = parseAngleString(input);
    if (isNaN(parsed.value)) {
      return NaN;
    }
    
    return toRadians(parsed.value, parsed.unit);
  }
  
  // 将任意输入转换为指定的单位
  function convertInputToUnit(input, targetUnit) {
    const parsed = parseAngleString(input);
    if (isNaN(parsed.value)) {
      return NaN;
    }
    
    // 将解析出的值转换为弧度
    const radValue = toRadians(parsed.value, parsed.unit);
    // 从弧度转换为目标单位
    return fromRadians(radValue, targetUnit);
  }
  
  // 三角函数计算
  function trigFunction(func, value, inputUnit, outputUnit) {
    let radValue;
    
    // 检查是否为双曲函数
    const isHyperbolic = [SINH, COSH, TANH, CSCH, SECH, COTH, ARCSINH, ARCCOSH, ARCTANH, ARCCSCH, ARCSECH, ARCCOTH].includes(func);
    
    // 反三角函数和双曲函数输入是比值，不需要转换
    if (func.startsWith('arc') || isHyperbolic) {
      // 尝试解析输入字符串
      if (typeof value === 'string') {
        const parsed = parseAngleString(value);
        radValue = parsed.value;
      } else {
        radValue = value;
      }
    } else {
      // 普通三角函数：需要角度转换
      if (typeof value === 'string') {
        const parsed = parseAngleString(value);
        radValue = toRadians(parsed.value, parsed.unit);
      } else {
        radValue = toRadians(value, inputUnit);
      }
    }
    
    let result;
    switch(func) {
      case SIN: result = Math.sin(radValue); break;
      case COS: result = Math.cos(radValue); break;
      case TAN: result = Math.tan(radValue); break;
      case CSC: result = 1 / Math.sin(radValue); break;
      case SEC: result = 1 / Math.cos(radValue); break;
      case COT: result = 1 / Math.tan(radValue); break;
      case ARCSIN: 
        if (radValue < -1 || radValue > 1) return NaN;
        result = Math.asin(radValue); 
        break;
      case ARCCOS: 
        if (radValue < -1 || radValue > 1) return NaN;
        result = Math.acos(radValue); 
        break;
      case ARCTAN: result = Math.atan(radValue); break;
      case ARCCSC:
        if (Math.abs(radValue) < 1) return NaN;
        result = Math.asin(1/radValue);
        break;
      case ARCSEC:
        if (Math.abs(radValue) < 1) return NaN;
        result = Math.acos(1/radValue);
        break;
      case ARCCOT:
        if (radValue === 0) return fromRadians(Math.PI/2, outputUnit);
        result = Math.atan(1/radValue);
        break;
      case SINH: result = (Math.exp(radValue) - Math.exp(-radValue)) / 2; break;
      case COSH: result = (Math.exp(radValue) + Math.exp(-radValue)) / 2; break;
      case TANH: 
        const e2x = Math.exp(2 * radValue);
        result = (e2x - 1) / (e2x + 1);
        break;
      case CSCH: 
        result = 2 / (Math.exp(radValue) - Math.exp(-radValue));
        break;
      case SECH: 
        result = 2 / (Math.exp(radValue) + Math.exp(-radValue));
        break;
      case COTH: 
        const e2x_coth = Math.exp(2 * radValue);
        result = (e2x_coth + 1) / (e2x_coth - 1);
        break;
      case ARCSINH: result = Math.log(radValue + Math.sqrt(radValue*radValue + 1)); break;
      case ARCCOSH: 
        if (radValue < 1) return NaN;
        result = Math.log(radValue + Math.sqrt(radValue*radValue - 1)); 
        break;
      case ARCTANH: 
        if (radValue <= -1 || radValue >= 1) return NaN;
        result = 0.5 * Math.log((1+radValue)/(1-radValue)); 
        break;
      case ARCCSCH: 
        if (radValue === 0) return NaN;
        result = Math.log(1/radValue + Math.sqrt(1/(radValue*radValue) + 1));
        break;
      case ARCSECH: 
        if (radValue <= 0 || radValue > 1) return NaN;
        result = Math.log((1 + Math.sqrt(1-radValue*radValue)) / radValue); 
        break;
      case ARCCOTH: 
        if (Math.abs(radValue) <= 1) return NaN;
        result = 0.5 * Math.log((radValue+1)/(radValue-1)); 
        break;
      default: result = 0;
    }
    
    // 反三角函数输出是角度，需要转换
    if (func.startsWith('arc') && !isHyperbolic) {
      return fromRadians(result, outputUnit);
    }
    
    return result;
  }
  
  // 使用弧度的三角函数计算（双曲函数专用）
  function trigFunctionRadians(func, value) {
    // 将输入转换为弧度
    const radValue = convertInputToRadians(value);
    if (isNaN(radValue)) {
      return NaN;
    }
    
    let result;
    switch(func) {
      case SIN: result = Math.sin(radValue); break;
      case COS: result = Math.cos(radValue); break;
      case TAN: result = Math.tan(radValue); break;
      case CSC: result = 1 / Math.sin(radValue); break;
      case SEC: result = 1 / Math.cos(radValue); break;
      case COT: result = 1 / Math.tan(radValue); break;
      case ARCSIN: 
        if (radValue < -1 || radValue > 1) return NaN;
        result = Math.asin(radValue); 
        break;
      case ARCCOS: 
        if (radValue < -1 || radValue > 1) return NaN;
        result = Math.acos(radValue); 
        break;
      case ARCTAN: result = Math.atan(radValue); break;
      case ARCCSC:
        if (Math.abs(radValue) < 1) return NaN;
        result = Math.asin(1/radValue);
        break;
      case ARCSEC:
        if (Math.abs(radValue) < 1) return NaN;
        result = Math.acos(1/radValue);
        break;
      case ARCCOT:
        if (radValue === 0) return Math.PI/2;
        result = Math.atan(1/radValue);
        break;
      case SINH: result = (Math.exp(radValue) - Math.exp(-radValue)) / 2; break;
      case COSH: result = (Math.exp(radValue) + Math.exp(-radValue)) / 2; break;
      case TANH: 
        const e2x = Math.exp(2 * radValue);
        result = (e2x - 1) / (e2x + 1);
        break;
      case CSCH: 
        result = 2 / (Math.exp(radValue) - Math.exp(-radValue));
        break;
      case SECH: 
        result = 2 / (Math.exp(radValue) + Math.exp(-radValue));
        break;
      case COTH: 
        const e2x_coth = Math.exp(2 * radValue);
        result = (e2x_coth + 1) / (e2x_coth - 1);
        break;
      case ARCSINH: result = Math.log(radValue + Math.sqrt(radValue*radValue + 1)); break;
      case ARCCOSH: 
        if (radValue < 1) return NaN;
        result = Math.log(radValue + Math.sqrt(radValue*radValue - 1)); 
        break;
      case ARCTANH: 
        if (radValue <= -1 || radValue >= 1) return NaN;
        result = 0.5 * Math.log((1+radValue)/(1-radValue)); 
        break;
      case ARCCSCH: 
        if (radValue === 0) return NaN;
        result = Math.log(1/radValue + Math.sqrt(1/(radValue*radValue) + 1));
        break;
      case ARCSECH: 
        if (radValue <= 0 || radValue > 1) return NaN;
        result = Math.log((1 + Math.sqrt(1-radValue*radValue)) / radValue); 
        break;
      case ARCCOTH: 
        if (Math.abs(radValue) <= 1) return NaN;
        result = 0.5 * Math.log((radValue+1)/(radValue-1)); 
        break;
      default: result = 0;
    }
    
    return result;
  }
  
  // 计算三角函数的幂
  function trigFunctionPower(func, power, value, inputUnit, outputUnit) {
    const trigValue = trigFunction(func, value, inputUnit, outputUnit);
    if (isNaN(trigValue)) {
      return NaN;
    }
    return Math.pow(trigValue, power);
  }
  
  // 使用弧度的三角函数幂计算
  function trigFunctionPowerRadians(func, power, value) {
    // 将输入转换为弧度
    const radValue = convertInputToRadians(value);
    if (isNaN(radValue)) {
      return NaN;
    }
    
    const trigValue = trigFunctionRadians(func, radValue);
    if (isNaN(trigValue)) {
      return NaN;
    }
    return Math.pow(trigValue, power);
  }
  
  // 直角坐标转极坐标
  function cartesianToPolar(x, y, angleUnit) {
    const r = Math.sqrt(x*x + y*y);
    let theta = Math.atan2(y, x);
    theta = fromRadians(theta, angleUnit);
    return { r, theta };
  }
  
  // 极坐标转直角坐标
  function polarToCartesian(r, theta, angleUnit) {
    const radTheta = toRadians(theta, angleUnit);
    const x = r * Math.cos(radTheta);
    const y = r * Math.sin(radTheta);
    return { x, y };
  }
  
  // 十进制角度转60进制（度分秒）
  function decimalToDMS(decimal, unit) {
    // 先转换为度
    let degrees;
    if (unit === DEG) {
      degrees = decimal;
    } else if (unit === RAD) {
      degrees = fromRadians(decimal, DEG);
    } else if (unit === GRA) {
      // 百分度转度
      degrees = decimal * 0.9;
    } else {
      degrees = decimal;
    }
    
    // 处理负数
    const isNegative = degrees < 0;
    degrees = Math.abs(degrees);
    
    // 提取度、分、秒
    const d = Math.floor(degrees);
    const m = Math.floor((degrees - d) * 60);
    const s = ((degrees - d) * 60 - m) * 60;
    
    return {
      degrees: isNegative ? -d : d,
      minutes: m,
      seconds: s,
      isNegative: isNegative
    };
  }
  
  // 60进制（度分秒）转十进制角度
  function dmsToDecimal(degrees, minutes, seconds, outputUnit) {
    // 处理负数
    const isNegative = degrees < 0;
    const absDegrees = Math.abs(degrees);
    
    // 转换为十进制度
    let decimalDegrees = absDegrees + minutes/60 + seconds/3600;
    if (isNegative) {
      decimalDegrees = -decimalDegrees;
    }
    
    // 转换为目标单位
    if (outputUnit === DEG) {
      return decimalDegrees;
    } else if (outputUnit === RAD) {
      return toRadians(decimalDegrees, DEG);
    } else if (outputUnit === GRA) {
      // 度转百分度
      return decimalDegrees / 0.9;
    }
    
    return decimalDegrees;
  }
  
  // 解析60进制角度字符串
  function parseDMSString(dmsString) {
    // 移除所有空格
    const cleanString = dmsString.toString().replace(/\s/g, '');
    
    // 匹配格式：数字+º+数字+'+数字+"
    const regex = /^(-?\d+(?:\.\d+)?)º(-?\d+(?:\.\d+)?)'(-?\d+(?:\.\d+)?)"$/;
    const match = cleanString.match(regex);
    
    if (match) {
      return {
        degrees: parseFloat(match[1]) || 0,
        minutes: parseFloat(match[2]) || 0,
        seconds: parseFloat(match[3]) || 0,
        valid: true
      };
    }
    
    return { degrees: 0, minutes: 0, seconds: 0, valid: false };
  }
  
  // 获取所有三角函数公式
  function getAllTrigFormulas() {
    return "sin(x) = sin(x)\n" +
           "cos(x) = cos(x)\n" +
           "tan(x) = tan(x)\n" +
           "csc(x) = 1 / sin(x)\n" +
           "sec(x) = 1 / cos(x)\n" +
           "cot(x) = 1 / tan(x)\n" +
           "arcsin(x) = asin(x)\n" +
           "arccos(x) = acos(x)\n" +
           "arctan(x) = atan(x)\n" +
           "arccsc(x) = asin(1/x)  (|x|≥1)\n" +
           "arcsec(x) = acos(1/x)  (|x|≥1)\n" +
           "arccot(x) = atan(1/x)  (x≠0)\n" +
           "sinh(x) = (e^x - e^(-x)) / 2\n" +
           "cosh(x) = (e^x + e^(-x)) / 2\n" +
           "tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))\n" +
           "csch(x) = 1 / sinh(x)\n" +
           "sech(x) = 1 / cosh(x)\n" +
           "coth(x) = 1 / tanh(x)\n" +
           "arcsinh(x) = ln(x + √(x²+1))\n" +
           "arccosh(x) = ln(x + √(x²-1))\n" +
           "arctanh(x) = 0.5 * ln((1+x)/(1-x))\n" +
           "arccsch(x) = ln(1/x + √(1/x² + 1))\n" +
           "arcsech(x) = ln((1+√(1-x²))/x)\n" +
           "arccoth(x) = 0.5 * ln((x+1)/(x-1))";
  }
  
  // 获取三角函数全称和中文名
  function getTrigFunctionFullNames() {
    return "sin(sine,正弦)\n" +
           "cos(cosine,余弦)\n" +
           "tan(tangent,正切)\n" +
           "csc(cosecant,余割)\n" +
           "sec(secant,正割)\n" +
           "cot(cotangent,余切)\n" +
           "arcsin(arcsine,反正弦)\n" +
           "arccos(arccosine,反余弦)\n" +
           "arctan(arctangent,反正切)\n" +
           "arccsc(arccosecant,反余割)\n" +
           "arcsec(arcsecant,反正割)\n" +
           "arccot(arccotangent,反余切)\n" +
           "sinh(hyperbolic sine,双曲正弦)\n" +
           "cosh(hyperbolic cosine,双曲余弦)\n" +
           "tanh(hyperbolic tangent,双曲正切)\n" +
           "csch(hyperbolic cosecant,双曲余割)\n" +
           "sech(hyperbolic secant,双曲正割)\n" +
           "coth(hyperbolic cotangent,双曲余切)\n" +
           "arcsinh(inverse hyperbolic sine,反双曲正弦)\n" +
           "arccosh(inverse hyperbolic cosine,反双曲余弦)\n" +
           "arctanh(inverse hyperbolic tangent,反双曲正切)\n" +
           "arccsch(inverse hyperbolic cosecant,反双曲余割)\n" +
           "arcsech(inverse hyperbolic secant,反双曲正割)\n" +
           "arccoth(inverse hyperbolic cotangent,反双曲余切)";
  }
  
  // 获取扩展说明
  function getExtensionDescription() {
    return "坐标转换扩展说明：\n\n" +
           "此扩展提供以下功能：\n" +
           "1. 直角坐标与极坐标之间的转换\n" +
           "2. 各种三角函数计算\n" +
           "3. 角度单位转换（度、弧度、百分度）\n" +
           "4. 十进制角度与60进制角度（度分秒）转换\n" +
           "5. 三角函数幂运算\n\n" +
           "使用提示：\n" +
           "- 使用 [函数][值]单位[单位] 积木时，双曲函数的单位参数会被忽略\n" +
           "- 使用 [函数][值] 积木时，始终使用弧度单位\n" +
           "- 双曲函数与角度无关，适合使用弧度专用积木\n" +
           "- 三角函数幂运算可以计算如 sin²(x) 这样的表达式";
  }
  
  class CoordinateExtension {
    constructor() {
      this.runtime = null;
    }
    
    getInfo() {
      return {
        id: 'coordinateConversion',
        name: EXTENSION_NAME,
        color1: EXTENSION_COLOR,
        color2: EXTENSION_COLOR,
        color3: EXTENSION_COLOR,
        blocks: [
          {
            opcode: 'getExtensionDescription',
            blockType: Scratch.BlockType.REPORTER,
            text: '扩展说明',
          },
          {
            opcode: 'getCurrentCoordinate',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前角色的[COMPONENT]坐标',
            arguments: {
              COMPONENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'currentCoordinateComponents'
              }
            }
          },
          {
            opcode: 'moveToPolar',
            blockType: Scratch.BlockType.COMMAND,
            text: '移到r:[R]θ:[THETA][UNIT]',
            arguments: {
              R: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              THETA: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 45
              },
              UNIT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'angleUnits'
              }
            }
          },
          {
            opcode: 'setCoordinate',
            blockType: Scratch.BlockType.COMMAND,
            text: '将[COMPONENT]坐标设为[VALUE]',
            arguments: {
              COMPONENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'currentCoordinateComponents'
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              }
            }
          },
          {
            opcode: 'changeCoordinate',
            blockType: Scratch.BlockType.COMMAND,
            text: '将[COMPONENT]坐标增加[VALUE]',
            arguments: {
              COMPONENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'currentCoordinateComponents'
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            opcode: 'recToPolComponent',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Rec([X],[Y])→Pol(x,y)取[COMPONENT]',
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              COMPONENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'xyComponents'
              }
            }
          },
          {
            opcode: 'polToRecComponent',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Pol([R],[THETA])→Rec(r,θ)取[COMPONENT]',
            arguments: {
              R: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              THETA: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 45
              },
              COMPONENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'rthetaComponents'
              }
            }
          },
          {
            opcode: 'trigFunctionSimple',
            blockType: Scratch.BlockType.REPORTER,
            text: '[FUNC][VALUE]单位[UNIT]',
            arguments: {
              FUNC: {
                type: Scratch.ArgumentType.STRING,
                menu: 'trigFunctions'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '45'
              },
              UNIT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'angleUnits'
              }
            }
          },
          {
            opcode: 'trigFunctionRadians',
            blockType: Scratch.BlockType.REPORTER,
            text: '[FUNC][VALUE]',
            arguments: {
              FUNC: {
                type: Scratch.ArgumentType.STRING,
                menu: 'trigFunctions'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.785'
              }
            }
          },
          {
            opcode: 'trigFunctionPower',
            blockType: Scratch.BlockType.REPORTER,
            text: '[FUNC]^[POWER] [VALUE]单位[UNIT]',
            arguments: {
              FUNC: {
                type: Scratch.ArgumentType.STRING,
                menu: 'trigFunctions'
              },
              POWER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '45'
              },
              UNIT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'angleUnits'
              }
            }
          },
          {
            opcode: 'trigFunctionPowerRadians',
            blockType: Scratch.BlockType.REPORTER,
            text: '[FUNC]^[POWER] [VALUE]',
            arguments: {
              FUNC: {
                type: Scratch.ArgumentType.STRING,
                menu: 'trigFunctions'
              },
              POWER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.785'
              }
            }
          },
          {
            opcode: 'convertAngleFormat',
            blockType: Scratch.BlockType.REPORTER,
            text: '将[ANGLE]转换为[TARGET_FORMAT]',
            arguments: {
              ANGLE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '45.5 deg'
              },
              TARGET_FORMAT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'angleFormats'
              }
            }
          },
          {
            opcode: 'getAllTrigFormulas',
            blockType: Scratch.BlockType.REPORTER,
            text: '所有三角函数公式',
          },
          {
            opcode: 'getTrigFullNames',
            blockType: Scratch.BlockType.REPORTER,
            text: '三角函数对应的全称和中文名',
          },
          {
            opcode: 'convertAngle',
            blockType: Scratch.BlockType.REPORTER,
            text: '将以[ANGLE][FROM_UNIT]角度，转化为以单位[TO_UNIT]的角度',
            arguments: {
              ANGLE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 180
              },
              FROM_UNIT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'angleUnits'
              },
              TO_UNIT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'angleUnits'
              }
            }
          },
          {
            opcode: 'decimalToDMS',
            blockType: Scratch.BlockType.REPORTER,
            text: '将十进制的角度[ANGLE][UNIT]转换为60进制角度(xºy\'z")',
            arguments: {
              ANGLE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 45.5
              },
              UNIT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'angleUnits'
              }
            }
          },
          {
            opcode: 'dmsToDecimal',
            blockType: Scratch.BlockType.REPORTER,
            text: '将60进制的角度[DEGREES]º[MINUTES]\'[SECONDS]"转换为十进制角度[UNIT]',
            arguments: {
              DEGREES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 45
              },
              MINUTES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 30
              },
              SECONDS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              UNIT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'angleUnits'
              }
            }
          },
          {
            opcode: 'dmsStringToDecimal',
            blockType: Scratch.BlockType.REPORTER,
            text: '将60进制的角度[DMS_STRING]转换为十进制角度[UNIT]',
            arguments: {
              DMS_STRING: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '45º30\'0"'
              },
              UNIT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'angleUnits'
              }
            }
          },
          {
            opcode: 'getDMSComponent',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取60进制的角度[DMS_STRING]的[COMPONENT]',
            arguments: {
              DMS_STRING: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '45º30\'0"'
              },
              COMPONENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dmsComponents'
              }
            }
          },
          {
            opcode: 'formatDMS',
            blockType: Scratch.BlockType.REPORTER,
            text: '[DEGREES]º[MINUTES]\'[SECONDS]"',
            arguments: {
              DEGREES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 45
              },
              MINUTES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 30
              },
              SECONDS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'cartesianToPolarComponent',
            blockType: Scratch.BlockType.REPORTER,
            text: '直角坐标转极坐标 x:[X]y:[Y]取[COMPONENT]',
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              COMPONENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'polarComponents'
              }
            }
          },
          {
            opcode: 'polarToCartesianComponent',
            blockType: Scratch.BlockType.REPORTER,
            text: '极坐标转直角坐标 r:[R]θ:[THETA][UNIT]取[COMPONENT]',
            arguments: {
              R: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              THETA: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 45
              },
              UNIT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'angleUnits'
              },
              COMPONENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'xyComponents'
              }
            }
          },
          {
            opcode: 'getPi',
            blockType: Scratch.BlockType.REPORTER,
            text: 'π',
          },
          {
            opcode: 'getE',
            blockType: Scratch.BlockType.REPORTER,
            text: 'e',
          }
        ],
        menus: {
          angleUnits: {
            acceptReporters: true,
            items: [
              {text: 'Deg(度)', value: DEG},
              {text: 'Rad(弧度)', value: RAD},
              {text: 'Gra(百分度)', value: GRA}
            ]
          },
          angleFormats: {
            acceptReporters: true,
            items: [
              {text: '60进制', value: FORMAT_DMS},
              {text: '度', value: FORMAT_DEG},
              {text: '弧度', value: FORMAT_RAD},
              {text: '百分度', value: FORMAT_GRA}
            ]
          },
          trigFunctions: {
            acceptReporters: true,
            items: [
              {text: 'sin', value: SIN},
              {text: 'cos', value: COS},
              {text: 'tan', value: TAN},
              {text: 'csc', value: CSC},
              {text: 'sec', value: SEC},
              {text: 'cot', value: COT},
              {text: 'arcsin', value: ARCSIN},
              {text: 'arccos', value: ARCCOS},
              {text: 'arctan', value: ARCTAN},
              {text: 'arccsc', value: ARCCSC},
              {text: 'arcsec', value: ARCSEC},
              {text: 'arccot', value: ARCCOT},
              {text: 'sinh', value: SINH},
              {text: 'cosh', value: COSH},
              {text: 'tanh', value: TANH},
              {text: 'csch', value: CSCH},
              {text: 'sech', value: SECH},
              {text: 'coth', value: COTH},
              {text: 'arcsinh', value: ARCSINH},
              {text: 'arccosh', value: ARCCOSH},
              {text: 'arctanh', value: ARCTANH},
              {text: 'arccsch', value: ARCCSCH},
              {text: 'arcsech', value: ARCSECH},
              {text: 'arccoth', value: ARCCOTH}
            ]
          },
          xyComponents: {
            acceptReporters: true,
            items: [
              {text: 'x', value: X},
              {text: 'y', value: Y}
            ]
          },
          rthetaComponents: {
            acceptReporters: true,
            items: [
              {text: 'r', value: R},
              {text: 'θ', value: THETA}
            ]
          },
          polarComponents: {
            acceptReporters: true,
            items: [
              {text: 'r', value: R},
              {text: 'θ(Deg)', value: 'theta_deg'},
              {text: 'θ(Rad)', value: 'theta_rad'},
              {text: 'θ(Gra)', value: 'theta_gra'}
            ]
          },
          currentCoordinateComponents: {
            acceptReporters: true,
            items: [
              {text: 'x', value: X},
              {text: 'y', value: Y},
              {text: 'r', value: R},
              {text: 'θ(Deg)', value: 'theta_deg'},
              {text: 'θ(Rad)', value: 'theta_rad'},
              {text: 'θ(Gra)', value: 'theta_gra'}
            ]
          },
          dmsComponents: {
            acceptReporters: true,
            items: [
              {text: 'º(度)', value: 'degrees'},
              {text: '\'(分)', value: 'minutes'},
              {text: '"(秒)', value: 'seconds'}
            ]
          }
        }
      };
    }
    
    // 获取扩展说明
    getExtensionDescription() {
      return getExtensionDescription();
    }
    
    // 获取当前角色的坐标
    getCurrentCoordinate(args, util) {
      const component = args.COMPONENT;
      const target = util.target;
      
      if (!target) return 0;
      
      const x = target.x;
      const y = target.y;
      
      switch(component) {
        case X:
          return x;
        case Y:
          return y;
        case R:
          return Math.sqrt(x*x + y*y);
        case 'theta_deg':
          return fromRadians(Math.atan2(y, x), DEG);
        case 'theta_rad':
          return Math.atan2(y, x); // 已经是弧度
        case 'theta_gra':
          return fromRadians(Math.atan2(y, x), GRA);
        default:
          return 0;
      }
    }
    
    // 移到极坐标位置
    moveToPolar(args, util) {
      const r = Number(args.R);
      const theta = Number(args.THETA);
      const unit = args.UNIT;
      
      const radTheta = toRadians(theta, unit);
      const x = r * Math.cos(radTheta);
      const y = r * Math.sin(radTheta);
      
      if (util.target) {
        util.target.setXY(x, y);
      }
    }
    
    // 设置坐标
    setCoordinate(args, util) {
      const component = args.COMPONENT;
      const value = Number(args.VALUE);
      const target = util.target;
      
      if (!target) return;
      
      const currentX = target.x;
      const currentY = target.y;
      
      switch(component) {
        case X:
          target.setXY(value, currentY);
          break;
        case Y:
          target.setXY(currentX, value);
          break;
        case R:
          // 计算当前角度（弧度）
          const currentTheta = Math.atan2(currentY, currentX);
          // 使用新的半径和当前角度计算新坐标
          const newX = value * Math.cos(currentTheta);
          const newY = value * Math.sin(currentTheta);
          target.setXY(newX, newY);
          break;
        case 'theta_deg':
          // 计算当前半径
          const currentR1 = Math.sqrt(currentX*currentX + currentY*currentY);
          // 使用当前半径和新角度（转换为弧度）计算新坐标
          const radTheta1 = toRadians(value, DEG);
          const newX1 = currentR1 * Math.cos(radTheta1);
          const newY1 = currentR1 * Math.sin(radTheta1);
          target.setXY(newX1, newY1);
          break;
        case 'theta_rad':
          // 计算当前半径
          const currentR2 = Math.sqrt(currentX*currentX + currentY*currentY);
          // 使用当前半径和新角度计算新坐标
          const newX2 = currentR2 * Math.cos(value);
          const newY2 = currentR2 * Math.sin(value);
          target.setXY(newX2, newY2);
          break;
        case 'theta_gra':
          // 计算当前半径
          const currentR3 = Math.sqrt(currentX*currentX + currentY*currentY);
          // 使用当前半径和新角度（转换为弧度）计算新坐标
          const radTheta3 = toRadians(value, GRA);
          const newX3 = currentR3 * Math.cos(radTheta3);
          const newY3 = currentR3 * Math.sin(radTheta3);
          target.setXY(newX3, newY3);
          break;
      }
    }
    
    // 改变坐标（增加）
    changeCoordinate(args, util) {
      const component = args.COMPONENT;
      const value = Number(args.VALUE);
      const target = util.target;
      
      if (!target) return;
      
      const currentX = target.x;
      const currentY = target.y;
      
      switch(component) {
        case X:
          target.setXY(currentX + value, currentY);
          break;
        case Y:
          target.setXY(currentX, currentY + value);
          break;
        case R:
          // 计算当前极坐标
          const currentR = Math.sqrt(currentX*currentX + currentY*currentY);
          const currentTheta = Math.atan2(currentY, currentX);
          // 增加半径
          const newR = currentR + value;
          // 使用新的半径和当前角度计算新坐标
          const newX = newR * Math.cos(currentTheta);
          const newY = newR * Math.sin(currentTheta);
          target.setXY(newX, newY);
          break;
        case 'theta_deg':
          // 计算当前极坐标
          const currentR1 = Math.sqrt(currentX*currentX + currentY*currentY);
          const currentThetaDeg = fromRadians(Math.atan2(currentY, currentX), DEG);
          // 增加角度（度）
          const newThetaDeg = currentThetaDeg + value;
          // 使用当前半径和新角度（转换为弧度）计算新坐标
          const radTheta1 = toRadians(newThetaDeg, DEG);
          const newX1 = currentR1 * Math.cos(radTheta1);
          const newY1 = currentR1 * Math.sin(radTheta1);
          target.setXY(newX1, newY1);
          break;
        case 'theta_rad':
          // 计算当前极坐标
          const currentR2 = Math.sqrt(currentX*currentX + currentY*currentY);
          const currentThetaRad = Math.atan2(currentY, currentX);
          // 增加角度（弧度）
          const newThetaRad = currentThetaRad + value;
          // 使用当前半径和新角度计算新坐标
          const newX2 = currentR2 * Math.cos(newThetaRad);
          const newY2 = currentR2 * Math.sin(newThetaRad);
          target.setXY(newX2, newY2);
          break;
        case 'theta_gra':
          // 计算当前极坐标
          const currentR3 = Math.sqrt(currentX*currentX + currentY*currentY);
          const currentThetaGra = fromRadians(Math.atan2(currentY, currentX), GRA);
          // 增加角度（百分度）
          const newThetaGra = currentThetaGra + value;
          // 使用当前半径和新角度（转换为弧度）计算新坐标
          const radTheta3 = toRadians(newThetaGra, GRA);
          const newX3 = currentR3 * Math.cos(radTheta3);
          const newY3 = currentR3 * Math.sin(radTheta3);
          target.setXY(newX3, newY3);
          break;
      }
    }
    
    // 直角坐标转极坐标并取分量
    recToPolComponent(args) {
      const x = Number(args.X);
      const y = Number(args.Y);
      const component = args.COMPONENT;
      
      const polar = cartesianToPolar(x, y, RAD); // 使用弧度计算，后面转换
      
      if (component === R) {
        return polar.r;
      } else if (component === THETA) {
        return polar.theta;
      }
      
      return 0;
    }
    
    // 极坐标转直角坐标并取分量
    polToRecComponent(args) {
      const r = Number(args.R);
      const theta = Number(args.THETA);
      const component = args.COMPONENT;
      
      const cartesian = polarToCartesian(r, theta, RAD); // 使用弧度计算
      
      if (component === X) {
        return cartesian.x;
      } else if (component === Y) {
        return cartesian.y;
      }
      
      return 0;
    }
    
    // 简单的三角函数计算
    trigFunctionSimple(args) {
      const func = args.FUNC;
      const value = args.VALUE; // 可能是字符串
      const unit = args.UNIT;
      
      // 对于简单的三角函数计算，输入和输出使用相同的单位
      return trigFunction(func, value, unit, unit);
    }
    
    // 使用弧度的三角函数计算
    trigFunctionRadians(args) {
      const func = args.FUNC;
      const value = args.VALUE; // 可能是字符串
      
      return trigFunctionRadians(func, value);
    }
    
    // 角度格式转换
    convertAngleFormat(args) {
      const angle = args.ANGLE.toString();
      const targetFormat = args.TARGET_FORMAT;
      
      // 解析输入角度
      const parsed = parseAngleString(angle);
      if (isNaN(parsed.value)) {
        return NaN;
      }
      
      // 将解析出的值转换为弧度
      const radValue = toRadians(parsed.value, parsed.unit);
      
      // 根据目标格式返回结果
      switch(targetFormat) {
        case FORMAT_DMS:
          // 转换为60进制（度分秒）
          const dms = decimalToDMS(fromRadians(radValue, DEG), DEG);
          return `${dms.degrees}º${dms.minutes}'${dms.seconds.toFixed(4)}"`;
        case FORMAT_DEG:
          // 转换为度
          return fromRadians(radValue, DEG);
        case FORMAT_RAD:
          // 转换为弧度
          return radValue;
        case FORMAT_GRA:
          // 转换为百分度
          return fromRadians(radValue, GRA);
        default:
          return NaN;
      }
    }
    
    // 三角函数幂计算
    trigFunctionPower(args) {
      const func = args.FUNC;
      const power = Number(args.POWER);
      const value = args.VALUE; // 可能是字符串
      const unit = args.UNIT;
      
      return trigFunctionPower(func, power, value, unit, unit);
    }
    
    // 使用弧度的三角函数幂计算
    trigFunctionPowerRadians(args) {
      const func = args.FUNC;
      const power = Number(args.POWER);
      const value = args.VALUE; // 可能是字符串
      
      return trigFunctionPowerRadians(func, power, value);
    }
    
    // 获取所有三角函数公式
    getAllTrigFormulas() {
      return getAllTrigFormulas();
    }
    
    // 获取三角函数全称和中文名
    getTrigFullNames() {
      return getTrigFunctionFullNames();
    }
    
    // 角度单位转换
    convertAngle(args) {
      const angle = Number(args.ANGLE);
      const fromUnit = args.FROM_UNIT;
      const toUnit = args.TO_UNIT;
      
      const radAngle = toRadians(angle, fromUnit);
      return fromRadians(radAngle, toUnit);
    }
    
    // 十进制角度转60进制（度分秒）
    decimalToDMS(args) {
      const angle = Number(args.ANGLE);
      const unit = args.UNIT;
      
      const dms = decimalToDMS(angle, unit);
      return `${dms.degrees}º${dms.minutes}'${dms.seconds.toFixed(2)}"`;
    }
    
    // 60进制（度分秒）转十进制角度
    dmsToDecimal(args) {
      const degrees = Number(args.DEGREES);
      const minutes = Number(args.MINUTES);
      const seconds = Number(args.SECONDS);
      const unit = args.UNIT;
      
      return dmsToDecimal(degrees, minutes, seconds, unit);
    }
    
    // 60进制字符串转十进制角度
    dmsStringToDecimal(args) {
      const dmsString = String(args.DMS_STRING);
      const unit = args.UNIT;
      
      const parsed = parseDMSString(dmsString);
      if (!parsed.valid) {
        return 0; // 如果格式无效，返回0
      }
      
      return dmsToDecimal(parsed.degrees, parsed.minutes, parsed.seconds, unit);
    }
    
    // 获取60进制字符串的指定部分
    getDMSComponent(args) {
      const dmsString = String(args.DMS_STRING);
      const component = args.COMPONENT;
      
      const parsed = parseDMSString(dmsString);
      if (!parsed.valid) {
        return 0; // 如果格式无效，返回0
      }
      
      switch(component) {
        case 'degrees':
          return parsed.degrees;
        case 'minutes':
          return parsed.minutes;
        case 'seconds':
          return parsed.seconds;
        default:
          return 0;
      }
    }
    
    // 格式化60进制角度
    formatDMS(args) {
      const degrees = Number(args.DEGREES);
      const minutes = Number(args.MINUTES);
      const seconds = Number(args.SECONDS);
      
      return `${degrees}º${minutes}'${seconds}"`;
    }
    
    // 将直角坐标转极坐标
    cartesianToPolarComponent(args) {
      const x = Number(args.X);
      const y = Number(args.Y);
      const component = args.COMPONENT;
      
      const polar = cartesianToPolar(x, y, RAD); // 使用弧度计算
      
      switch(component) {
        case R:
          return polar.r;
        case 'theta_deg':
          return fromRadians(polar.theta, DEG);
        case 'theta_rad':
          return polar.theta; // 已经是弧度
        case 'theta_gra':
          return fromRadians(polar.theta, GRA);
        default:
          return 0;
      }
    }
    
    // 将极坐标转直角坐标
    polarToCartesianComponent(args) {
      const r = Number(args.R);
      const theta = Number(args.THETA);
      const unit = args.UNIT;
      const component = args.COMPONENT;
      
      const cartesian = polarToCartesian(r, theta, unit);
      
      if (component === X) {
        return cartesian.x;
      } else if (component === Y) {
        return cartesian.y;
      }
      
      return 0;
    }
    
    // 获取π值
    getPi() {
      return PI;
    }
    
    // 获取e值
    getE() {
      return E;
    }
  }
  
  Scratch.extensions.register(new CoordinateExtension());
})(Scratch);