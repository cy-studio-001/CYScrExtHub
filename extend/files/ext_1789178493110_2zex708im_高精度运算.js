(function(Scratch) {
  'use strict';
  
  // 全局配置
  const config = {
    color: '#c54bf6',
    maxPrecision: 1000,
    minPrecision: 1,
    defaultPrecision: 15,
    useFractions: true,
    trackInputSource: true,
    historySize: 100,
    maxDisplayDigits: 50
  };
  
  // 状态管理
  let currentPrecision = config.defaultPrecision;
  let maxAllowedPrecision = 1000;
  const inputSourceCache = new Map();
  const fractionCache = new Map();
  let nextOperationId = 0;
  
  // 记忆功能存储
  let memoryValue = 0;
  let memoryHistory = [];
  
  // 历史记录
  let calculationHistory = [];
  
  // 常数定义
  const constants = {
    'π': Math.PI,
    'pi': Math.PI,
    'e': Math.E,
    'φ': 1.618033988749895,
    'c': 299792458,
    'G': 6.67430e-11,
    'g': 9.80665,
    'h': 6.62607015e-34,
    'k': 1.380649e-23,
    'NA': 6.02214076e23,
    'R': 8.314462618,
    'ε0': 8.854187817e-12,
    'μ0': 1.2566370614e-6,
    '∞': Infinity,
    'inf': Infinity,
    '-∞': -Infinity,
    '-inf': -Infinity
  };
  
  // 角度模式状态
  let useDegreesForTrig = true;
  
  // === 科学计数法转换系统 ===
  class ScientificNotationConverter {
    constructor() {
      this.maxDecimalDigits = 1000;
      this.maxIntegerDigits = 10000;
    }
    
    parseScientificNotation(str) {
      const trimmed = String(str).trim();
      
      // 格式1: 1.23e5 或 1.23E5
      const sciMatch1 = trimmed.match(/^(-?\d+(?:\.\d+)?)[eE]([+-]?\d+)$/);
      if (sciMatch1) {
        const mantissa = parseFloat(sciMatch1[1]);
        const exponent = parseInt(sciMatch1[2], 10);
        return mantissa * Math.pow(10, exponent);
      }
      
      // 格式2: 1.23×10^5 或 1.23*10^5
      const sciMatch2 = trimmed.match(/^(-?\d+(?:\.\d+)?)[×\*]\s*10\^([+-]?\d+)$/);
      if (sciMatch2) {
        const mantissa = parseFloat(sciMatch2[1]);
        const exponent = parseInt(sciMatch2[2], 10);
        return mantissa * Math.pow(10, exponent);
      }
      
      // 格式3: 1.23 * 10^5 (带空格)
      const sciMatch3 = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*\*\s*10\^([+-]?\d+)$/);
      if (sciMatch3) {
        const mantissa = parseFloat(sciMatch3[1]);
        const exponent = parseInt(sciMatch3[2], 10);
        return mantissa * Math.pow(10, exponent);
      }
      
      // 格式4: 10^5 (只有指数)
      const expOnlyMatch = trimmed.match(/^10\^([+-]?\d+)$/);
      if (expOnlyMatch) {
        const exponent = parseInt(expOnlyMatch[1], 10);
        return Math.pow(10, exponent);
      }
      
      const num = parseFloat(trimmed);
      return isNaN(num) ? 0 : num;
    }
    
    scientificToDecimal(sciStr, maxDigits = 50) {
      try {
        const number = this.parseScientificNotation(sciStr);
        if (!isFinite(number)) return String(number);
        if (number === 0) return '0';
        
        const absNum = Math.abs(number);
        if (absNum >= 1e15 || absNum < 1e-6) {
          return `该数字不适合显示为十进制`;
        }
        
        let decimalStr;
        if (Number.isInteger(number)) {
          decimalStr = number.toString();
        } else {
          const decimalPlaces = Math.min(this.countDecimalPlaces(number), maxDigits);
          decimalStr = number.toFixed(decimalPlaces);
          decimalStr = decimalStr.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');
        }
        
        if (decimalStr.length > maxDigits) {
          return decimalStr.substring(0, maxDigits) + '...';
        }
        
        return decimalStr;
      } catch (error) {
        return `转换错误: ${error.message}`;
      }
    }
    
    scientificToFraction(sciStr, maxDenominator = 10000) {
      try {
        const number = this.parseScientificNotation(sciStr);
        if (!isFinite(number)) return String(number);
        
        const fraction = decimalToFraction(number, maxDenominator);
        if (fraction) {
          if (fraction.d === 1n) return fraction.n.toString();
          return `${fraction.n}/${fraction.d}`;
        }
        
        return this.scientificToDecimal(sciStr, 10);
      } catch (error) {
        return `分数转换错误: ${error.message}`;
      }
    }
    
    getAllRepresentations(sciStr) {
      try {
        const number = this.parseScientificNotation(sciStr);
        if (!isFinite(number)) return `无穷大: ${String(number)}`;
        
        const representations = [];
        const absNum = Math.abs(number);
        
        representations.push(`输入: ${sciStr}`);
        representations.push(`数值: ${number}`);
        representations.push(`科学计数法: ${this.formatScientific(number)}`);
        
        if (absNum < 1e15 && absNum >= 1e-6) {
          const decimalStr = this.scientificToDecimal(sciStr, 20);
          if (!decimalStr.includes('不适合') && !decimalStr.includes('错误')) {
            representations.push(`十进制: ${decimalStr}`);
          }
        }
        
        if (absNum < 1000000 && absNum > 0.000001) {
          try {
            const fraction = decimalToFraction(number, 10000);
            if (fraction && fraction.d <= 10000) {
              if (fraction.d === 1n) {
                representations.push(`分数: ${fraction.n} (整数)`);
              } else {
                representations.push(`分数: ${fraction.n}/${fraction.d}`);
                const absN = fraction.n < 0n ? -fraction.n : fraction.n;
                if (absN > fraction.d) {
                  representations.push(`带分数: ${fraction.toMixedString()}`);
                }
              }
            }
          } catch (e) {}
        }
        
        try {
          const components = this.getMantissaAndExponent(sciStr);
          representations.push(`尾数: ${components.mantissa.toFixed(6)}`);
          representations.push(`指数: ${components.exponent}`);
          representations.push(`标准化形式: ${components.formatted}`);
        } catch (e) {
          representations.push(`尾数/指数: 无法计算`);
        }
        
        representations.push(`绝对值: ${absNum}`);
        representations.push(`是否为整数: ${Number.isInteger(number) ? '是' : '否'}`);
        
        if (absNum > 0 && absNum < 1) {
          const decimalPlaces = this.countDecimalPlaces(number);
          representations.push(`小数位数: ${decimalPlaces}`);
        }
        
        return representations.join('\n');
      } catch (error) {
        return `错误: 无法处理输入 "${sciStr}"`;
      }
    }
    
    formatScientific(number, precision = currentPrecision) {
      if (!isFinite(number)) return String(number);
      if (number === 0) return '0';
      
      const expStr = number.toExponential(Math.min(precision, 15));
      const match = expStr.match(/^(-?\d+\.?\d*)[eE]([+-]?\d+)$/);
      if (!match) return expStr;
      
      const mantissa = match[1];
      const exponent = parseInt(match[2], 10);
      let cleanMantissa = mantissa.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');
      
      if (exponent === 0) return cleanMantissa;
      return `${cleanMantissa}×10^${exponent}`;
    }
    
    countDecimalPlaces(number) {
      if (!isFinite(number)) return 0;
      const str = number.toString();
      if (str.includes('e') || str.includes('E')) {
        const fixed = number.toFixed(20);
        return this.countDecimalPlaces(parseFloat(fixed));
      }
      const decimalIndex = str.indexOf('.');
      if (decimalIndex === -1) return 0;
      return str.length - decimalIndex - 1;
    }
    
    isScientificNotation(str) {
      const patterns = [
        /^-?\d+(?:\.\d+)?[eE][+-]?\d+$/,
        /^-?\d+(?:\.\d+)?[×\*]\s*10\^[+-]?\d+$/,
        /^-?\d+(?:\.\d+)?\s*\*\s*10\^[+-]?\d+$/,
        /^10\^[+-]?\d+$/
      ];
      return patterns.some(pattern => pattern.test(String(str).trim()));
    }
    
    getMantissaAndExponent(sciStr) {
      const number = this.parseScientificNotation(sciStr);
      if (!isFinite(number) || number === 0) {
        return { mantissa: 0, exponent: 0, formatted: '0' };
      }
      
      const absNum = Math.abs(number);
      const exponent = Math.floor(Math.log10(absNum));
      const mantissa = number / Math.pow(10, exponent);
      
      let normalizedMantissa = mantissa;
      let normalizedExponent = exponent;
      
      if (Math.abs(mantissa) >= 10) {
        normalizedMantissa = mantissa / 10;
        normalizedExponent = exponent + 1;
      } else if (Math.abs(mantissa) < 1 && mantissa !== 0) {
        normalizedMantissa = mantissa * 10;
        normalizedExponent = exponent - 1;
      }
      
      return {
        mantissa: normalizedMantissa,
        exponent: normalizedExponent,
        formatted: `${normalizedMantissa.toFixed(10).replace(/\.?0$/, '')}×10^${normalizedExponent}`
      };
    }
    
    scientificToFractionOrDecimal(sciStr, maxDenominator = 10000, preferFraction = true) {
      try {
        const number = this.parseScientificNotation(sciStr);
        if (!isFinite(number)) return String(number);
        if (number === 0) return '0';
        
        const absNum = Math.abs(number);
        if (preferFraction && absNum < 1000000 && absNum > 0.000001) {
          const fraction = decimalToFraction(number, maxDenominator);
          if (fraction) {
            const decimalValue = fraction.toDecimal(20);
            if (Math.abs(number - decimalValue) < 1e-12) {
              if (fraction.d === 1n) return fraction.n.toString();
              return `${fraction.n}/${fraction.d}`;
            }
          }
        }
        
        if (absNum >= 1e15 || absNum < 1e-6) {
          return this.formatScientific(number);
        } else {
          return this.scientificToDecimal(sciStr);
        }
      } catch (error) {
        return `转换错误: ${error.message}`;
      }
    }
    
    scientificToMixedFraction(sciStr, maxDenominator = 10000) {
      try {
        const number = this.parseScientificNotation(sciStr);
        if (!isFinite(number)) return String(number);
        
        const fraction = decimalToFraction(number, maxDenominator);
        if (fraction && fraction.d !== 1n && fraction.d <= maxDenominator) {
          return fraction.toMixedString();
        }
        
        const absNum = Math.abs(number);
        if (absNum >= 1e15 || absNum < 1e-6) {
          return this.formatScientific(number);
        } else {
          return this.scientificToDecimal(sciStr);
        }
      } catch (error) {
        return `转换错误: ${error.message}`;
      }
    }
    
    compareScientific(sciStr1, sciStr2) {
      const num1 = this.parseScientificNotation(sciStr1);
      const num2 = this.parseScientificNotation(sciStr2);
      if (num1 < num2) return -1;
      if (num1 > num2) return 1;
      return 0;
    }
  }
  
  // 创建转换器实例
  const sciConverter = new ScientificNotationConverter();
  
  // 精度管理函数
  const setPrecision = (value) => {
    const precision = Math.max(config.minPrecision, Math.min(maxAllowedPrecision, Math.round(value)));
    currentPrecision = precision;
    return precision;
  };
  
  const setMaxPrecision = (value) => {
    maxAllowedPrecision = Math.max(30, Math.min(10000, Math.round(value)));
    if (currentPrecision > maxAllowedPrecision) {
      currentPrecision = maxAllowedPrecision;
    }
    return maxAllowedPrecision;
  };
  
  const getPrecision = () => currentPrecision;
  const getMaxPrecision = () => maxAllowedPrecision;
  
  // === 智能数字格式化系统 ===
  class SmartNumberFormatter {
    constructor() {
      this.scientificThreshold = 1e12;
      this.smallThreshold = 1e-6;
      this.maxDigits = config.maxDisplayDigits;
    }
    
    formatNumber(num, precision = currentPrecision) {
      if (!isFinite(num)) return String(num);
      if (num === 0) return '0';
      const absNum = Math.abs(num);
      
      if (absNum >= this.scientificThreshold || absNum < this.smallThreshold) {
        return sciConverter.formatScientific(num, precision);
      } else {
        return this.formatDecimal(num, precision);
      }
    }
    
    formatDecimal(num, precision) {
      const str = String(num);
      if (Number.isInteger(num) && str.length <= this.maxDigits) return str;
      
      const fixedStr = num.toFixed(Math.min(precision, 50));
      let result = this.trimTrailingZeros(fixedStr);
      
      if (result.length > this.maxDigits) {
        return sciConverter.formatScientific(num, precision);
      }
      
      return result;
    }
    
    trimTrailingZeros(str) {
      if (str.includes('e') || str.includes('E')) return str;
      const parts = str.split('.');
      if (parts.length === 1) return str;
      
      const integerPart = parts[0];
      let decimalPart = parts[1];
      let lastNonZero = -1;
      for (let i = 0; i < decimalPart.length; i++) {
        if (decimalPart[i] !== '0') lastNonZero = i;
      }
      
      if (lastNonZero >= 0) {
        decimalPart = decimalPart.substring(0, lastNonZero + 1);
        return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
      } else {
        return integerPart;
      }
    }
  }
  
  // 创建格式化器实例
  const formatter = new SmartNumberFormatter();
  
  // 记忆功能函数
  const memoryClear = () => {
    memoryValue = 0;
    return '记忆已清除';
  };
  
  const memoryRecall = () => memoryValue;
  
  const memoryAdd = (value) => {
    memoryValue += value;
    memoryHistory.push({
      operation: 'M+',
      value: value,
      newMemory: memoryValue,
      timestamp: Date.now()
    });
    return `记忆值增加 ${formatter.formatNumber(value)}，当前：${formatter.formatNumber(memoryValue)}`;
  };
  
  const memorySubtract = (value) => {
    memoryValue -= value;
    memoryHistory.push({
      operation: 'M-',
      value: value,
      newMemory: memoryValue,
      timestamp: Date.now()
    });
    return `记忆值减少 ${formatter.formatNumber(value)}，当前：${formatter.formatNumber(memoryValue)}`;
  };
  
  const memoryStore = (value) => {
    memoryValue = value;
    memoryHistory.push({
      operation: 'MS',
      value: value,
      newMemory: memoryValue,
      timestamp: Date.now()
    });
    return `记忆已存储：${formatter.formatNumber(value)}`;
  };
  
  const getMemoryHistory = () => {
    if (memoryHistory.length === 0) return '记忆历史为空';
    return memoryHistory.map((entry, index) => {
      const time = new Date(entry.timestamp).toLocaleTimeString();
      return `${index + 1}. [${time}] ${entry.operation} ${formatter.formatNumber(entry.value)} → ${formatter.formatNumber(entry.newMemory)}`;
    }).join('\n');
  };
  
  // 历史记录管理
  const addToHistory = (expression, result, operation) => {
    const entry = {
      id: calculationHistory.length + 1,
      expression,
      result,
      displayResult: formatter.formatNumber(result),
      operation,
      timestamp: Date.now(),
      precision: currentPrecision
    };
    
    calculationHistory.push(entry);
    if (calculationHistory.length > config.historySize) {
      calculationHistory = calculationHistory.slice(-config.historySize);
    }
    
    return entry;
  };
  
  const getHistory = (limit = 10) => {
    if (calculationHistory.length === 0) return '计算历史为空';
    const recentHistory = calculationHistory.slice(-limit);
    return recentHistory.map(entry => {
      const time = new Date(entry.timestamp).toLocaleTimeString();
      return `${entry.id}. [${time}] ${entry.expression} = ${entry.displayResult} (${entry.operation})`;
    }).join('\n');
  };
  
  const clearHistory = () => {
    calculationHistory = [];
    return '历史记录已清除';
  };
  
  // 角度弧度转换
  const degreesToRadians = (degrees) => degrees * Math.PI / 180;
  const radiansToDegrees = (radians) => radians * 180 / Math.PI;
  
  // 角度模式切换
  const setAngleMode = (useDegrees) => {
    useDegreesForTrig = useDegrees;
    return useDegrees ? '角度模式' : '弧度模式';
  };
  
  const getAngleMode = () => useDegreesForTrig ? '角度' : '弧度';
  
  // 科学计数法
  const scientificNotation = (x, y) => x * Math.pow(10, y);
  
  // 随机数生成
  const randomNumber = (min, max, integer = false) => {
    if (min > max) [min, max] = [max, min];
    if (integer) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      return Math.random() * (max - min) + min;
    }
  };
  
  // 分数解析函数
  const parseFraction = (input) => {
    if (typeof input === 'number') return input;
    const str = String(input).trim();
    
    if (constants.hasOwnProperty(str.toLowerCase())) {
      return constants[str.toLowerCase()];
    }
    
    const simpleFractionMatch = str.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
    if (simpleFractionMatch) {
      const numerator = parseFloat(simpleFractionMatch[1]);
      const denominator = parseFloat(simpleFractionMatch[2]);
      if (denominator !== 0) return numerator / denominator;
    }
    
    const mixedFractionMatch = str.match(/^(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
    if (mixedFractionMatch) {
      const whole = parseFloat(mixedFractionMatch[1]);
      const numerator = parseFloat(mixedFractionMatch[2]);
      const denominator = parseFloat(mixedFractionMatch[3]);
      if (denominator !== 0) return whole + (numerator / denominator);
    }
    
    const num = sciConverter.parseScientificNotation(str);
    if (num !== 0 || str === '0' || str === '0.0') return num;
    
    const decimalMatch = str.match(/^-?\d+(?:\.\d+)?$/);
    if (decimalMatch) return parseFloat(str);
    
    const num2 = parseFloat(str);
    return isNaN(num2) ? 0 : num2;
  };
  
  // === 修复后的表达式计算函数 ===
  const evaluateExpression = (expression) => {
    try {
      // 首先替换常数
      let processed = String(expression)
        .replace(/π/g, 'Math.PI')
        .replace(/pi/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/φ/g, constants.φ)
        .replace(/phi/g, constants.φ)
        .replace(/∞/g, 'Infinity')
        .replace(/inf/g, 'Infinity');
      
      // 处理科学计数法格式 (如 1.23e5) - 但不要替换函数名中的e
      processed = processed.replace(/(\d+(?:\.\d+)?)e([+-]?\d+)/g, '($1 * Math.pow(10, $2))');
      
      // 处理乘方符号 ^
      processed = processed.replace(/\^/g, '**');
      
      // 处理阶乘
      const factorialRegex = /(\d+(?:\.\d+)?|\([^)]+\))!/g;
      processed = processed.replace(factorialRegex, (match) => {
        const num = match.slice(0, -1);
        return `factorial(${num})`;
      });
      
      // 处理百分比
      processed = processed.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
      
      // 处理带分数 (如 1 1/2)
      const mixedFractionRegex = /(\d+)\s+(\d+)\/(\d+)/g;
      processed = processed.replace(mixedFractionRegex, '($1 + $2/$3)');
      
      // 定义三角函数包装器 - 正确处理角度模式
      const sinDeg = (x) => Math.sin(x * Math.PI / 180);
      const cosDeg = (x) => Math.cos(x * Math.PI / 180);
      const tanDeg = (x) => {
        const rad = x * Math.PI / 180;
        // 处理接近90度的情况
        if (Math.abs(Math.cos(rad)) < 1e-10) return Infinity;
        return Math.tan(rad);
      };
      const asinDeg = (x) => {
        if (x < -1 || x > 1) return NaN;
        return Math.asin(x) * 180 / Math.PI;
      };
      const acosDeg = (x) => {
        if (x < -1 || x > 1) return NaN;
        return Math.acos(x) * 180 / Math.PI;
      };
      const atanDeg = (x) => Math.atan(x) * 180 / Math.PI;
      const atan2Deg = (y, x) => Math.atan2(y, x) * 180 / Math.PI;
      
      // 安全地执行表达式
      const safeEval = new Function(
        'Math', 
        'factorial',
        'pow',
        'sqrt',
        'cbrt',
        'log',
        'ln',
        'log10',
        'log2',
        'sin',
        'cos',
        'tan',
        'asin',
        'acos',
        'atan',
        'atan2',
        'sinh',
        'cosh',
        'tanh',
        'asinh',
        'acosh',
        'atanh',
        'exp',
        'abs',
        'round',
        'floor',
        'ceil',
        'max',
        'min',
        'random',
        'useDegreesForTrig',
        'sinDeg',
        'cosDeg',
        'tanDeg',
        'asinDeg',
        'acosDeg',
        'atanDeg',
        'atan2Deg',
        'return ' + processed
      );
      
      // 定义辅助函数
      const factorial = (n) => {
        n = Number(n);
        if (!Number.isInteger(n) || n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
      };
      
      const pow = Math.pow;
      const sqrt = Math.sqrt;
      const cbrt = Math.cbrt;
      const log = (x, base) => base === undefined ? Math.log10(x) : Math.log(x) / Math.log(base);
      const ln = Math.log;
      const log10 = Math.log10;
      const log2 = Math.log2;
      
      // 根据角度模式选择正确的三角函数
      const sin = (x) => useDegreesForTrig ? sinDeg(x) : Math.sin(x);
      const cos = (x) => useDegreesForTrig ? cosDeg(x) : Math.cos(x);
      const tan = (x) => useDegreesForTrig ? tanDeg(x) : Math.tan(x);
      const asin = (x) => useDegreesForTrig ? asinDeg(x) : Math.asin(x);
      const acos = (x) => useDegreesForTrig ? acosDeg(x) : Math.acos(x);
      const atan = (x) => useDegreesForTrig ? atanDeg(x) : Math.atan(x);
      const atan2 = (y, x) => useDegreesForTrig ? atan2Deg(y, x) : Math.atan2(y, x);
      
      const sinh = Math.sinh;
      const cosh = Math.cosh;
      const tanh = Math.tanh;
      const asinh = Math.asinh;
      const acosh = Math.acosh;
      const atanh = Math.atanh;
      const exp = Math.exp;
      const abs = Math.abs;
      const round = Math.round;
      const floor = Math.floor;
      const ceil = Math.ceil;
      const max = Math.max;
      const min = Math.min;
      const random = Math.random;
      
      const result = safeEval(
        Math,
        factorial,
        pow,
        sqrt,
        cbrt,
        log,
        ln,
        log10,
        log2,
        sin,
        cos,
        tan,
        asin,
        acos,
        atan,
        atan2,
        sinh,
        cosh,
        tanh,
        asinh,
        acosh,
        atanh,
        exp,
        abs,
        round,
        floor,
        ceil,
        max,
        min,
        random,
        useDegreesForTrig,
        sinDeg,
        cosDeg,
        tanDeg,
        asinDeg,
        acosDeg,
        atanDeg,
        atan2Deg
      );
      
      if (typeof result !== 'number' || !isFinite(result)) {
        return NaN;
      }
      
      return Number(result);
    } catch (error) {
      console.error('表达式计算错误:', error);
      return NaN;
    }
  };
  
  // 分数系统
  class Fraction {
    constructor(numerator, denominator = 1) {
      this.n = BigInt(numerator);
      this.d = BigInt(denominator);
      this.normalize();
    }
    
    normalize() {
      if (this.d < 0n) {
        this.n = -this.n;
        this.d = -this.d;
      }
      const gcd = this.gcd(this.n < 0n ? -this.n : this.n, this.d);
      this.n /= gcd;
      this.d /= gcd;
    }
    
    gcd(a, b) {
      while (b !== 0n) {
        const temp = b;
        b = a % b;
        a = temp;
      }
      return a;
    }
    
    add(other) {
      const numerator = this.n * other.d + other.n * this.d;
      const denominator = this.d * other.d;
      return new Fraction(numerator, denominator);
    }
    
    subtract(other) {
      const numerator = this.n * other.d - other.n * this.d;
      const denominator = this.d * other.d;
      return new Fraction(numerator, denominator);
    }
    
    multiply(other) {
      const numerator = this.n * other.n;
      const denominator = this.d * other.d;
      return new Fraction(numerator, denominator);
    }
    
    divide(other) {
      if (other.n === 0n) throw new Error('Division by zero');
      const numerator = this.n * other.d;
      const denominator = this.d * other.n;
      return new Fraction(numerator, denominator);
    }
    
    toDecimal(precision = currentPrecision) {
      if (this.d === 1n) return Number(this.n);
      const integerPart = Number(this.n / this.d);
      const remainder = this.n % this.d;
      if (remainder === 0n) return integerPart;
      const result = this.toDecimalString(precision);
      return Number(result);
    }
    
    toDecimalString(precision = currentPrecision) {
      if (this.d === 1n) return this.n.toString();
      const integerPart = this.n / this.d;
      const remainder = this.n % this.d;
      if (remainder === 0n) return integerPart.toString();
      
      let decimalStr = '';
      let r = remainder * 10n;
      let count = 0;
      const maxDigits = Math.min(precision, 100);
      
      while (r !== 0n && count < maxDigits) {
        const digit = r / this.d;
        decimalStr += digit.toString();
        r = (r % this.d) * 10n;
        count++;
      }
      
      return integerPart.toString() + (decimalStr ? '.' + decimalStr : '');
    }
    
    toString() {
      if (this.d === 1n) return this.n.toString();
      return `${this.n}/${this.d}`;
    }
    
    toMixedString() {
      if (this.d === 1n) return this.n.toString();
      const whole = this.n / this.d;
      const remainder = this.n % this.d;
      if (remainder === 0n) return whole.toString();
      const fraction = new Fraction(remainder, this.d);
      return `${whole} ${fraction.n}/${fraction.d}`;
    }
    
    static fromDecimal(decimal, maxDenominator = 10000) {
      const cacheKey = `${decimal}_${maxDenominator}`;
      if (fractionCache.has(cacheKey)) return fractionCache.get(cacheKey);
      
      if (!isFinite(decimal)) return null;
      if (Number.isInteger(decimal)) {
        const fraction = new Fraction(decimal);
        fractionCache.set(cacheKey, fraction);
        return fraction;
      }
      
      const commonFractions = [
        [1, 3, 0.3333333333333333],
        [2, 3, 0.6666666666666666],
        [1, 4, 0.25],
        [3, 4, 0.75],
        [1, 5, 0.2],
        [2, 5, 0.4],
        [3, 5, 0.6],
        [4, 5, 0.8],
        [1, 6, 0.16666666666666666],
        [5, 6, 0.8333333333333334],
        [1, 7, 0.14285714285714285],
        [1, 8, 0.125],
        [3, 8, 0.375],
        [5, 8, 0.625],
        [7, 8, 0.875]
      ];
      
      for (const [n, d, value] of commonFractions) {
        if (Math.abs(decimal - value) < 1e-12) {
          const fraction = new Fraction(n, d);
          fractionCache.set(cacheKey, fraction);
          return fraction;
        }
      }
      
      const tolerance = 1e-12;
      let x = decimal;
      let a = Math.floor(x);
      let h1 = 1, k1 = 0;
      let h2 = a, k2 = 1;
      
      for (let i = 0; i < 20; i++) {
        const difference = x - a;
        if (difference < tolerance || k2 > maxDenominator) break;
        
        x = 1 / difference;
        a = Math.floor(x);
        const h = a * h2 + h1;
        const k = a * k2 + k1;
        
        h1 = h2; k1 = k2;
        h2 = h; k2 = k;
        
        if (Math.abs(decimal - h/k) < tolerance) {
          const fraction = new Fraction(h, k);
          fractionCache.set(cacheKey, fraction);
          return fraction;
        }
      }
      
      const denominator = Math.pow(10, Math.min(10, Math.floor(Math.log10(1/tolerance))));
      const numerator = Math.round(decimal * denominator);
      const fraction = new Fraction(numerator, denominator);
      fractionCache.set(cacheKey, fraction);
      return fraction;
    }
  }
  
  // 工具函数
  const decimalToFraction = (decimal) => Fraction.fromDecimal(decimal);
  
  // 精确运算函数
  const smartAdd = (a, b) => {
    const numA = parseFraction(a);
    const numB = parseFraction(b);
    
    const absA = Math.abs(numA);
    const absB = Math.abs(numB);
    
    if (absA > 1e15 || absB > 1e15 || absA < 1e-15 || absB < 1e-15) {
      try {
        const aStr = numA.toString();
        const bStr = numB.toString();
        if (!aStr.includes('.') && !bStr.includes('.')) {
          const bigA = BigInt(aStr);
          const bigB = BigInt(bStr);
          return Number(bigA + bigB);
        }
      } catch (e) {}
    }
    
    const aDecimal = (numA.toString().split('.')[1] || '').length;
    const bDecimal = (numB.toString().split('.')[1] || '').length;
    const maxDecimal = Math.max(aDecimal, bDecimal);
    const multiplier = Math.pow(10, maxDecimal);
    return (Math.round(numA * multiplier) + Math.round(numB * multiplier)) / multiplier;
  };
  
  const smartSubtract = (a, b) => smartAdd(a, -parseFraction(b));
  
  const smartMultiply = (a, b) => {
    const numA = parseFraction(a);
    const numB = parseFraction(b);
    const absA = Math.abs(numA);
    const absB = Math.abs(numB);
    const product = absA * absB;
    
    if (product > 1e15 || product < 1e-15) {
      try {
        const sign = Math.sign(numA) * Math.sign(numB);
        const logResult = Math.log10(absA) + Math.log10(absB);
        return sign * Math.pow(10, logResult);
      } catch (e) {}
    }
    
    return numA * numB;
  };
  
  const smartDivide = (a, b) => {
    const numA = parseFraction(a);
    const numB = parseFraction(b);
    if (numB === 0) {
      return numA === 0 ? NaN : (numA > 0 ? Infinity : -Infinity);
    }
    return numA / numB;
  };
  
  // 比较函数
  const preciseEquals = (a, b) => {
    const numA = parseFraction(a);
    const numB = parseFraction(b);
    const diff = Math.abs(numA - numB);
    return diff < Math.pow(10, -Math.min(currentPrecision, 15));
  };
  
  const preciseGreaterThan = (a, b) => {
    const numA = parseFraction(a);
    const numB = parseFraction(b);
    return numA - numB > Math.pow(10, -Math.min(currentPrecision, 15));
  };
  
  const preciseLessThan = (a, b) => {
    const numA = parseFraction(a);
    const numB = parseFraction(b);
    return numB - numA > Math.pow(10, -Math.min(currentPrecision, 15));
  };
  
  // 扩展主类
  class CompleteScientificMathExtensionCSME {
    constructor() {
      this.color = config.color;
    }
    
    getInfo() {
      return {
        id: 'trengicpyizad',
        name: '完整科学数学3.0',
        color1: this.color,
        color2: this.color,
        color3: this.color,
        blocks: [
          // === 基本运算（移到最前面）===
          {
            opcode: 'preciseAdd',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] + [B]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.1'
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.2'
              }
            }
          },
          {
            opcode: 'preciseSubtract',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] - [B]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.3'
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.1'
              }
            }
          },
          {
            opcode: 'preciseMultiply',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] × [B]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.1'
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.2'
              }
            }
          },
          {
            opcode: 'preciseDivide',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] ÷ [B]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '3'
              }
            }
          },
          
          // === 比较运算 ===
          {
            opcode: 'preciseEquals',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[A] = [B]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.1'
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.1'
              }
            }
          },
          {
            opcode: 'preciseGreaterThan',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[A] > [B]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.3'
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.2'
              }
            }
          },
          {
            opcode: 'preciseLessThan',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[A] < [B]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.1'
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.2'
              }
            }
          },
          
          '---',
          
          // === 科学计数法转换功能 ===
          {
            opcode: 'scientificToFractionOrDecimal',
            blockType: Scratch.BlockType.REPORTER,
            text: '科学计数法转分数/小数 [SCI]',
            arguments: {
              SCI: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1.5e-1'
              }
            }
          },
          {
            opcode: 'scientificToMixedFraction',
            blockType: Scratch.BlockType.REPORTER,
            text: '科学计数法转带分数 [SCI]',
            arguments: {
              SCI: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1.5'
              }
            }
          },
          {
            opcode: 'getAllRepresentations',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取所有表示形式 [SCI]',
            arguments: {
              SCI: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1.23e3'
              }
            }
          },
          {
            opcode: 'getSimpleRepresentations',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取简单表示形式 [SCI]',
            arguments: {
              SCI: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1.23e3'
              }
            }
          },
          {
            opcode: 'isScientificNotation',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[STR] 是科学计数法吗？',
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1.23e5'
              }
            }
          },
          {
            opcode: 'parseScientific',
            blockType: Scratch.BlockType.REPORTER,
            text: '解析科学计数法 [SCI]',
            arguments: {
              SCI: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1.23e5'
              }
            }
          },
          {
            opcode: 'getScientificComponents',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取科学计数法分量 [SCI]',
            arguments: {
              SCI: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1.23e5'
              }
            }
          },
          {
            opcode: 'compareScientific',
            blockType: Scratch.BlockType.REPORTER,
            text: '比较 [A] 和 [B]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1.23e5'
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '4.56e4'
              }
            }
          },
          
          '---',
          
          // === 表达式计算 ===
          {
            opcode: 'evaluateExpression',
            blockType: Scratch.BlockType.REPORTER,
            text: '计算表达式 [EXPR]',
            arguments: {
              EXPR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'sin(30) + cos(60)'
              }
            }
          },
          {
            opcode: 'testExpressionFeatures',
            blockType: Scratch.BlockType.REPORTER,
            text: '测试表达式功能'
          },
          
          '---',
          
          // === 系统设置 ===
          {
            opcode: 'setPrecision',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置精度为 [PRECISION] 位小数',
            arguments: {
              PRECISION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 15
              }
            }
          },
          {
            opcode: 'setMaxPrecision',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置最大精度为 [MAX] 位',
            arguments: {
              MAX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1000
              }
            }
          },
          {
            opcode: 'getPrecision',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前精度'
          },
          {
            opcode: 'getMaxPrecision',
            blockType: Scratch.BlockType.REPORTER,
            text: '最大精度'
          },
          {
            opcode: 'toggleFractionMode',
            blockType: Scratch.BlockType.COMMAND,
            text: '切换分数模式'
          },
          {
            opcode: 'setAngleMode',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置角度模式 [MODE]',
            arguments: {
              MODE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'angleMode',
                defaultValue: '角度'
              }
            }
          },
          {
            opcode: 'getAngleMode',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取角度模式'
          },
          {
            opcode: 'setMaxDisplayDigits',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置最大显示位数为 [DIGITS]',
            arguments: {
              DIGITS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              }
            }
          },
          {
            opcode: 'getDisplaySettings',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取显示设置'
          },
          
          // === 记忆功能 ===
          {
            opcode: 'memoryClear',
            blockType: Scratch.BlockType.COMMAND,
            text: 'MC - 记忆清除'
          },
          {
            opcode: 'memoryRecall',
            blockType: Scratch.BlockType.REPORTER,
            text: 'MR - 记忆读取'
          },
          {
            opcode: 'memoryAdd',
            blockType: Scratch.BlockType.COMMAND,
            text: 'M+ - 记忆加 [VALUE]',
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0'
              }
            }
          },
          {
            opcode: 'memorySubtract',
            blockType: Scratch.BlockType.COMMAND,
            text: 'M- - 记忆减 [VALUE]',
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0'
              }
            }
          },
          {
            opcode: 'memoryStore',
            blockType: Scratch.BlockType.COMMAND,
            text: 'MS - 记忆存储 [VALUE]',
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0'
              }
            }
          },
          {
            opcode: 'getMemoryValue',
            blockType: Scratch.BlockType.REPORTER,
            text: '查看记忆值'
          },
          {
            opcode: 'getMemoryHistory',
            blockType: Scratch.BlockType.REPORTER,
            text: '查看记忆历史'
          },
          
          // === 历史记录 ===
          {
            opcode: 'getCalculationHistory',
            blockType: Scratch.BlockType.REPORTER,
            text: '查看计算历史 [LIMIT] 条',
            arguments: {
              LIMIT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            opcode: 'clearCalculationHistory',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除计算历史'
          },
          {
            opcode: 'clearCache',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除缓存'
          },
          
          '---',
          
          // === 常数 ===
          {
            opcode: 'getConstant',
            blockType: Scratch.BlockType.REPORTER,
            text: '常数 [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                menu: 'constants',
                defaultValue: 'π'
              }
            }
          },
          {
            opcode: 'listConstants',
            blockType: Scratch.BlockType.REPORTER,
            text: '列出所有常数'
          },
          
          // === 角度弧度转换 ===
          {
            opcode: 'degreesToRadians',
            blockType: Scratch.BlockType.REPORTER,
            text: '角度转弧度 [DEG]°',
            arguments: {
              DEG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '90'
              }
            }
          },
          {
            opcode: 'radiansToDegrees',
            blockType: Scratch.BlockType.REPORTER,
            text: '弧度转角度 [RAD]',
            arguments: {
              RAD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'π/2'
              }
            }
          },
          
          // === 随机数 ===
          {
            opcode: 'randomFloat',
            blockType: Scratch.BlockType.REPORTER,
            text: '随机小数 [MIN] 到 [MAX]',
            arguments: {
              MIN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0'
              },
              MAX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              }
            }
          },
          {
            opcode: 'randomInteger',
            blockType: Scratch.BlockType.REPORTER,
            text: '随机整数 [MIN] 到 [MAX]',
            arguments: {
              MIN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              },
              MAX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '100'
              }
            }
          },
          
          // === 科学计数法 ===
          {
            opcode: 'scientificNotation',
            blockType: Scratch.BlockType.REPORTER,
            text: '[X] × 10^[Y]',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1.23'
              },
              Y: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '5'
              }
            }
          },
          
          // === 分数输入辅助 ===
          {
            opcode: 'parseFractionInput',
            blockType: Scratch.BlockType.REPORTER,
            text: '解析分数输入 [INPUT]',
            arguments: {
              INPUT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1/2'
              }
            }
          },
          
          '---',
          
          // === 三角函数 ===
          {
            opcode: 'preciseSin',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sin([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '30'
              }
            }
          },
          {
            opcode: 'preciseCos',
            blockType: Scratch.BlockType.REPORTER,
            text: 'cos([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '60'
              }
            }
          },
          {
            opcode: 'preciseTan',
            blockType: Scratch.BlockType.REPORTER,
            text: 'tan([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '45'
              }
            }
          },
          {
            opcode: 'preciseAsin',
            blockType: Scratch.BlockType.REPORTER,
            text: 'asin([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.5'
              }
            }
          },
          {
            opcode: 'preciseAcos',
            blockType: Scratch.BlockType.REPORTER,
            text: 'acos([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.5'
              }
            }
          },
          {
            opcode: 'preciseAtan',
            blockType: Scratch.BlockType.REPORTER,
            text: 'atan([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              }
            }
          },
          {
            opcode: 'preciseAtan2',
            blockType: Scratch.BlockType.REPORTER,
            text: 'atan2([Y], [X])',
            arguments: {
              Y: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              },
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              }
            }
          },
          
          // === 双曲函数 ===
          {
            opcode: 'preciseSinh',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sinh([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              }
            }
          },
          {
            opcode: 'preciseCosh',
            blockType: Scratch.BlockType.REPORTER,
            text: 'cosh([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              }
            }
          },
          {
            opcode: 'preciseTanh',
            blockType: Scratch.BlockType.REPORTER,
            text: 'tanh([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              }
            }
          },
          {
            opcode: 'preciseAsinh',
            blockType: Scratch.BlockType.REPORTER,
            text: 'asinh([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              }
            }
          },
          {
            opcode: 'preciseAcosh',
            blockType: Scratch.BlockType.REPORTER,
            text: 'acosh([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '2'
              }
            }
          },
          {
            opcode: 'preciseAtanh',
            blockType: Scratch.BlockType.REPORTER,
            text: 'atanh([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0.5'
              }
            }
          },
          
          '---',
          
          // === 对数和指数函数 ===
          {
            opcode: 'preciseLog',
            blockType: Scratch.BlockType.REPORTER,
            text: 'log([X]) 底数 [BASE]',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '100'
              },
              BASE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '10'
              }
            }
          },
          {
            opcode: 'preciseLn',
            blockType: Scratch.BlockType.REPORTER,
            text: 'ln([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'e'
              }
            }
          },
          {
            opcode: 'preciseLog10',
            blockType: Scratch.BlockType.REPORTER,
            text: 'log10([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '100'
              }
            }
          },
          {
            opcode: 'preciseLog2',
            blockType: Scratch.BlockType.REPORTER,
            text: 'log2([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '8'
              }
            }
          },
          {
            opcode: 'preciseExp',
            blockType: Scratch.BlockType.REPORTER,
            text: 'exp([X])',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              }
            }
          },
          
          // === 其他函数 ===
          {
            opcode: 'preciseFactorial',
            blockType: Scratch.BlockType.REPORTER,
            text: '[N]! 阶乘',
            arguments: {
              N: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '5'
              }
            }
          },
          {
            opcode: 'preciseNthRoot',
            blockType: Scratch.BlockType.REPORTER,
            text: '[X] 的 [N] 次方根',
            arguments: {
              X: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '8'
              },
              N: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '3'
              }
            }
          },
          {
            opcode: 'precisePower',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] 的 [B] 次方',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '2'
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '3'
              }
            }
          },
          {
            opcode: 'preciseSquareRoot',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] 的平方根',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '16'
              }
            }
          },
          {
            opcode: 'preciseAbs',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] 的绝对值',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '-5'
              }
            }
          },
          {
            opcode: 'preciseRound',
            blockType: Scratch.BlockType.REPORTER,
            text: '四舍五入 [A]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '3.14159'
              }
            }
          },
          {
            opcode: 'preciseFloor',
            blockType: Scratch.BlockType.REPORTER,
            text: '向下取整 [A]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '3.9'
              }
            }
          },
          {
            opcode: 'preciseCeil',
            blockType: Scratch.BlockType.REPORTER,
            text: '向上取整 [A]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '3.1'
              }
            }
          },
          {
            opcode: 'preciseMod',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] 除以 [B] 的余数',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '10'
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '3'
              }
            }
          },
          
          '---',
          
          // === 测试函数 ===
          {
            opcode: 'testAllFunctions',
            blockType: Scratch.BlockType.REPORTER,
            text: '测试所有功能'
          },
          {
            opcode: 'testScientificConversion',
            blockType: Scratch.BlockType.REPORTER,
            text: '测试科学计数法转换'
          },
          {
            opcode: 'testRepresentations',
            blockType: Scratch.BlockType.REPORTER,
            text: '测试表示形式'
          }
        ],
        menus: {
          constants: {
            acceptReporters: true,
            items: Object.keys(constants).map(key => ({text: key, value: key}))
          },
          angleMode: {
            acceptReporters: true,
            items: [
              {text: '角度', value: '角度'},
              {text: '弧度', value: '弧度'}
            ]
          }
        }
      };
    }
    
    // === 基本运算方法 ===
    preciseAdd(args) {
      const result = smartAdd(args.A, args.B);
      addToHistory(`${args.A} + ${args.B}`, result, '加法');
      return formatter.formatNumber(result);
    }
    
    preciseSubtract(args) {
      const result = smartSubtract(args.A, args.B);
      addToHistory(`${args.A} - ${args.B}`, result, '减法');
      return formatter.formatNumber(result);
    }
    
    preciseMultiply(args) {
      const result = smartMultiply(args.A, args.B);
      addToHistory(`${args.A} × ${args.B}`, result, '乘法');
      return formatter.formatNumber(result);
    }
    
    preciseDivide(args) {
      const result = smartDivide(args.A, args.B);
      addToHistory(`${args.A} ÷ ${args.B}`, result, '除法');
      return formatter.formatNumber(result);
    }
    
    // === 比较运算方法 ===
    preciseEquals(args) {
      return preciseEquals(args.A, args.B);
    }
    
    preciseGreaterThan(args) {
      return preciseGreaterThan(args.A, args.B);
    }
    
    preciseLessThan(args) {
      return preciseLessThan(args.A, args.B);
    }
    
    // === 科学计数法方法 ===
    getAllRepresentations(args) {
      try {
        const sciStr = String(args.SCI || '');
        if (!sciStr || sciStr.trim() === '') {
          return '错误: 请输入有效的科学计数法字符串';
        }
        const result = sciConverter.getAllRepresentations(sciStr);
        if (result.length > 1000) {
          return result.substring(0, 1000) + '\n...(结果太长，已截断)';
        }
        return result;
      } catch (error) {
        return `获取表示形式时出错: ${error.message}`;
      }
    }
    
    getSimpleRepresentations(args) {
      const sciStr = String(args.SCI);
      try {
        const num = sciConverter.parseScientificNotation(sciStr);
        if (!isFinite(num)) return `无穷大: ${String(num)}`;
        
        const results = [];
        results.push(`输入: ${sciStr}`);
        results.push(`解析为: ${num}`);
        results.push(`类型: ${sciConverter.isScientificNotation(sciStr) ? '科学计数法' : '普通数字'}`);
        results.push(`科学计数法: ${sciConverter.formatScientific(num)}`);
        
        const absNum = Math.abs(num);
        if (absNum < 1e15 && absNum >= 1e-6) {
          results.push(`十进制: ${num}`);
        }
        
        if (absNum < 1000000 && absNum > 0.000001) {
          const fractionStr = sciConverter.scientificToFraction(sciStr);
          if (!fractionStr.includes('错误') && !fractionStr.includes('不适合')) {
            results.push(`分数: ${fractionStr}`);
          }
        }
        
        return results.join('\n');
      } catch (error) {
        return `无法处理 "${sciStr}": ${error.message}`;
      }
    }
    
    scientificToFractionOrDecimal(args) {
      const sciStr = String(args.SCI);
      return sciConverter.scientificToFractionOrDecimal(sciStr);
    }
    
    scientificToMixedFraction(args) {
      const sciStr = String(args.SCI);
      return sciConverter.scientificToMixedFraction(sciStr);
    }
    
    isScientificNotation(args) {
      const str = String(args.STR);
      return sciConverter.isScientificNotation(str);
    }
    
    parseScientific(args) {
      const sciStr = String(args.SCI);
      const result = sciConverter.parseScientificNotation(sciStr);
      return formatter.formatNumber(result);
    }
    
    getScientificComponents(args) {
      const sciStr = String(args.SCI);
      try {
        const components = sciConverter.getMantissaAndExponent(sciStr);
        return `尾数: ${components.mantissa.toFixed(6)}\n指数: ${components.exponent}\n标准形式: ${components.formatted}`;
      } catch (error) {
        return `错误: ${error.message}`;
      }
    }
    
    compareScientific(args) {
      const a = String(args.A);
      const b = String(args.B);
      const comparison = sciConverter.compareScientific(a, b);
      if (comparison < 0) return `${a} < ${b}`;
      if (comparison > 0) return `${a} > ${b}`;
      return `${a} = ${b}`;
    }
    
    // === 表达式计算方法 ===
    evaluateExpression(args) {
      const expr = String(args.EXPR);
      const result = evaluateExpression(expr);
      
      if (isNaN(result)) {
        return `表达式 "${expr}" 计算失败\n支持的函数：sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, ln, log10, log2, exp, sqrt, cbrt, abs, round, floor, ceil, max, min, random\n常数：π, e, φ\n格式：科学计数法(1.23e5), 分数(1/2), 带分数(1 1/2), 百分比(50%)`;
      }
      
      addToHistory(expr, result, '表达式');
      return formatter.formatNumber(result);
    }
    
    testExpressionFeatures(args) {
      const tests = [
        '1/2 + 1/3',
        '1 1/2 + 2/3',
        'sin(30) + cos(60)',
        '2^3 + sqrt(16)',
        '50% + 25%',
        'ln(e)',
        'log10(100)',
        'max(5, 10, 3)',
        '1.23e5 * 2',
        '5! + 3!',
        'π * 2',
        'sin(45) * cos(45)',
        'cos(90)'  // 测试角度模式是否正确
      ];
      
      let results = '表达式测试（当前模式：' + (useDegreesForTrig ? '角度' : '弧度') + '）：\n\n';
      
      for (const test of tests) {
        const result = evaluateExpression(test);
        results += `${test} = ${formatter.formatNumber(result)}\n`;
      }
      
      return results;
    }
    
    // === 系统设置方法 ===
    setPrecision(args) {
      return setPrecision(args.PRECISION);
    }
    
    setMaxPrecision(args) {
      return setMaxPrecision(args.MAX);
    }
    
    getPrecision() {
      return getPrecision();
    }
    
    getMaxPrecision() {
      return getMaxPrecision();
    }
    
    toggleFractionMode() {
      config.useFractions = !config.useFractions;
      return `分数模式已${config.useFractions ? '启用' : '禁用'}`;
    }
    
    setAngleMode(args) {
      return setAngleMode(args.MODE === '角度');
    }
    
    getAngleMode() {
      return getAngleMode();
    }
    
    setMaxDisplayDigits(args) {
      const digits = Math.max(10, Math.min(1000, Math.round(args.DIGITS)));
      config.maxDisplayDigits = digits;
      formatter.maxDigits = digits;
      return `最大显示位数已设置为 ${digits}`;
    }
    
    getDisplaySettings() {
      return `当前设置：
精度：${currentPrecision} 位小数
最大显示位数：${config.maxDisplayDigits}
分数模式：${config.useFractions ? '启用' : '禁用'}
角度模式：${useDegreesForTrig ? '角度' : '弧度'}`;
    }
    
    // === 记忆功能方法 ===
    memoryClear() {
      return memoryClear();
    }
    
    memoryRecall() {
      return formatter.formatNumber(memoryRecall());
    }
    
    memoryAdd(args) {
      const value = parseFraction(args.VALUE);
      return memoryAdd(value);
    }
    
    memorySubtract(args) {
      const value = parseFraction(args.VALUE);
      return memorySubtract(value);
    }
    
    memoryStore(args) {
      const value = parseFraction(args.VALUE);
      return memoryStore(value);
    }
    
    getMemoryValue() {
      return formatter.formatNumber(memoryValue);
    }
    
    getMemoryHistory() {
      return getMemoryHistory();
    }
    
    // === 历史记录方法 ===
    getCalculationHistory(args) {
      return getHistory(args.LIMIT);
    }
    
    clearCalculationHistory() {
      return clearHistory();
    }
    
    clearCache() {
      inputSourceCache.clear();
      fractionCache.clear();
      return '缓存已清除';
    }
    
    // === 常数方法 ===
    getConstant(args) {
      const name = args.NAME.toLowerCase();
      if (constants.hasOwnProperty(name)) {
        return formatter.formatNumber(constants[name]);
      }
      return `常数 ${args.NAME} 不存在`;
    }
    
    listConstants() {
      let result = '可用常数：\n';
      for (const [key, value] of Object.entries(constants)) {
        result += `${key} = ${formatter.formatNumber(value)}\n`;
      }
      return result;
    }
    
    // === 角度弧度转换 ===
    degreesToRadians(args) {
      const deg = parseFraction(args.DEG);
      const result = degreesToRadians(deg);
      addToHistory(`${deg}° → 弧度`, result, '角度转弧度');
      return formatter.formatNumber(result);
    }
    
    radiansToDegrees(args) {
      const rad = parseFraction(args.RAD);
      const result = radiansToDegrees(rad);
      addToHistory(`${rad} 弧度 → 角度`, result, '弧度转角度');
      return formatter.formatNumber(result);
    }
    
    // === 随机数 ===
    randomFloat(args) {
      const min = parseFraction(args.MIN);
      const max = parseFraction(args.MAX);
      const result = randomNumber(min, max, false);
      addToHistory(`随机小数(${min}, ${max})`, result, '随机数');
      return formatter.formatNumber(result);
    }
    
    randomInteger(args) {
      const min = parseFraction(args.MIN);
      const max = parseFraction(args.MAX);
      const result = randomNumber(min, max, true);
      addToHistory(`随机整数(${min}, ${max})`, result, '随机整数');
      return formatter.formatNumber(result);
    }
    
    // === 科学计数法 ===
    scientificNotation(args) {
      const x = parseFraction(args.X);
      const y = parseFraction(args.Y);
      const result = scientificNotation(x, y);
      addToHistory(`${x} × 10^${y}`, result, '科学计数法');
      return formatter.formatNumber(result);
    }
    
    // === 分数输入辅助 ===
    parseFractionInput(args) {
      const result = parseFraction(args.INPUT);
      return formatter.formatNumber(result);
    }
    
    // === 三角函数方法 ===
    preciseSin(args) {
      const x = parseFraction(args.X);
      const result = useDegreesForTrig ? Math.sin(degreesToRadians(x)) : Math.sin(x);
      const unit = useDegreesForTrig ? '°' : '弧度';
      addToHistory(`sin(${x}${unit})`, result, '正弦');
      return formatter.formatNumber(result);
    }
    
    preciseCos(args) {
      const x = parseFraction(args.X);
      const result = useDegreesForTrig ? Math.cos(degreesToRadians(x)) : Math.cos(x);
      const unit = useDegreesForTrig ? '°' : '弧度';
      addToHistory(`cos(${x}${unit})`, result, '余弦');
      return formatter.formatNumber(result);
    }
    
    preciseTan(args) {
      const x = parseFraction(args.X);
      const rad = useDegreesForTrig ? degreesToRadians(x) : x;
      const cosValue = Math.cos(rad);
      if (Math.abs(cosValue) < 1e-10) {
        return useDegreesForTrig && Math.abs(x % 90) < 1e-10 ? 
          (Math.abs((x - 90) % 180) < 1e-10 ? '∞' : '-∞') : '无穷大';
      }
      const result = Math.tan(rad);
      const unit = useDegreesForTrig ? '°' : '弧度';
      addToHistory(`tan(${x}${unit})`, result, '正切');
      return formatter.formatNumber(result);
    }
    
    preciseAsin(args) {
      const x = parseFraction(args.X);
      if (x < -1 || x > 1) return '错误: 输入必须在-1到1之间';
      const result = useDegreesForTrig ? radiansToDegrees(Math.asin(x)) : Math.asin(x);
      addToHistory(`asin(${x})`, result, '反正弦');
      return formatter.formatNumber(result);
    }
    
    preciseAcos(args) {
      const x = parseFraction(args.X);
      if (x < -1 || x > 1) return '错误: 输入必须在-1到1之间';
      const result = useDegreesForTrig ? radiansToDegrees(Math.acos(x)) : Math.acos(x);
      addToHistory(`acos(${x})`, result, '反余弦');
      return formatter.formatNumber(result);
    }
    
    preciseAtan(args) {
      const x = parseFraction(args.X);
      const result = useDegreesForTrig ? radiansToDegrees(Math.atan(x)) : Math.atan(x);
      addToHistory(`atan(${x})`, result, '反正切');
      return formatter.formatNumber(result);
    }
    
    preciseAtan2(args) {
      const y = parseFraction(args.Y);
      const x = parseFraction(args.X);
      const result = useDegreesForTrig ? radiansToDegrees(Math.atan2(y, x)) : Math.atan2(y, x);
      addToHistory(`atan2(${y}, ${x})`, result, '反正切2');
      return formatter.formatNumber(result);
    }
    
    // === 双曲函数方法 ===
    preciseSinh(args) {
      const x = parseFraction(args.X);
      const result = Math.sinh(x);
      addToHistory(`sinh(${x})`, result, '双曲正弦');
      return formatter.formatNumber(result);
    }
    
    preciseCosh(args) {
      const x = parseFraction(args.X);
      const result = Math.cosh(x);
      addToHistory(`cosh(${x})`, result, '双曲余弦');
      return formatter.formatNumber(result);
    }
    
    preciseTanh(args) {
      const x = parseFraction(args.X);
      const result = Math.tanh(x);
      addToHistory(`tanh(${x})`, result, '双曲正切');
      return formatter.formatNumber(result);
    }
    
    preciseAsinh(args) {
      const x = parseFraction(args.X);
      const result = Math.asinh(x);
      addToHistory(`asinh(${x})`, result, '反双曲正弦');
      return formatter.formatNumber(result);
    }
    
    preciseAcosh(args) {
      const x = parseFraction(args.X);
      if (x < 1) return '错误: 输入必须≥1';
      const result = Math.acosh(x);
      addToHistory(`acosh(${x})`, result, '反双曲余弦');
      return formatter.formatNumber(result);
    }
    
    preciseAtanh(args) {
      const x = parseFraction(args.X);
      if (x <= -1 || x >= 1) return '错误: 输入必须在-1到1之间';
      const result = Math.atanh(x);
      addToHistory(`atanh(${x})`, result, '反双曲正切');
      return formatter.formatNumber(result);
    }
    
    // === 对数和指数函数 ===
    preciseLog(args) {
      const x = parseFraction(args.X);
      const base = parseFraction(args.BASE);
      if (x <= 0 || base <= 0 || base === 1) return '错误: 无效输入';
      const result = Math.log(x) / Math.log(base);
      addToHistory(`log_${base}(${x})`, result, '对数');
      return formatter.formatNumber(result);
    }
    
    preciseLn(args) {
      const x = parseFraction(args.X);
      if (x <= 0) return '错误: 输入必须>0';
      const result = Math.log(x);
      addToHistory(`ln(${x})`, result, '自然对数');
      return formatter.formatNumber(result);
    }
    
    preciseLog10(args) {
      const x = parseFraction(args.X);
      if (x <= 0) return '错误: 输入必须>0';
      const result = Math.log10(x);
      addToHistory(`log10(${x})`, result, '常用对数');
      return formatter.formatNumber(result);
    }
    
    preciseLog2(args) {
      const x = parseFraction(args.X);
      if (x <= 0) return '错误: 输入必须>0';
      const result = Math.log2(x);
      addToHistory(`log2(${x})`, result, '二进制对数');
      return formatter.formatNumber(result);
    }
    
    preciseExp(args) {
      const x = parseFraction(args.X);
      const result = Math.exp(x);
      addToHistory(`exp(${x})`, result, '指数');
      return formatter.formatNumber(result);
    }
    
    // === 其他函数方法 ===
    preciseFactorial(args) {
      const n = parseFraction(args.N);
      if (!Number.isInteger(n) || n < 0) return '错误: 阶乘要求非负整数';
      if (n === 0 || n === 1) return '1';
      
      let result = 1n;
      for (let i = 2; i <= n; i++) result *= BigInt(i);
      
      addToHistory(`${args.N}!`, Number(result), '阶乘');
      if (result < Number.MAX_SAFE_INTEGER) {
        return formatter.formatNumber(Number(result));
      } else {
        return result.toString().substring(0, 50) + '... (共' + result.toString().length + '位)';
      }
    }
    
    preciseNthRoot(args) {
      const x = parseFraction(args.X);
      const n = parseFraction(args.N);
      if (n === 0) return '错误: 次数不能为0';
      if (x < 0 && n % 2 === 0) return '错误: 负数没有偶数次方根';
      
      const result = Math.pow(x, 1/n);
      addToHistory(`${n}√${x}`, result, `${n}次方根`);
      return formatter.formatNumber(result);
    }
    
    precisePower(args) {
      const a = parseFraction(args.A);
      const b = parseFraction(args.B);
      const result = Math.pow(a, b);
      addToHistory(`${args.A}^${args.B}`, result, '幂运算');
      return formatter.formatNumber(result);
    }
    
    preciseSquareRoot(args) {
      const a = parseFraction(args.A);
      if (a < 0) return '错误: 负数没有平方根';
      const result = Math.sqrt(a);
      addToHistory(`√${args.A}`, result, '平方根');
      return formatter.formatNumber(result);
    }
    
    preciseAbs(args) {
      const a = parseFraction(args.A);
      const result = Math.abs(a);
      addToHistory(`|${args.A}|`, result, '绝对值');
      return formatter.formatNumber(result);
    }
    
    preciseRound(args) {
      const a = parseFraction(args.A);
      const result = Math.round(a);
      addToHistory(`round(${args.A})`, result, '四舍五入');
      return formatter.formatNumber(result);
    }
    
    preciseFloor(args) {
      const a = parseFraction(args.A);
      const result = Math.floor(a);
      addToHistory(`floor(${args.A})`, result, '向下取整');
      return formatter.formatNumber(result);
    }
    
    preciseCeil(args) {
      const a = parseFraction(args.A);
      const result = Math.ceil(a);
      addToHistory(`ceil(${args.A})`, result, '向上取整');
      return formatter.formatNumber(result);
    }
    
    preciseMod(args) {
      const a = parseFraction(args.A);
      const b = parseFraction(args.B);
      if (b === 0) return '错误: 除数不能为0';
      const result = a % b;
      addToHistory(`${args.A} mod ${args.B}`, result, '取模');
      return formatter.formatNumber(result);
    }
    
    // === 测试方法 ===
    testAllFunctions() {
      let results = '=== 完整科学数学扩展测试 ===\n\n';
      
      results += '1. 基本运算测试：\n';
      results += `0.1 + 0.2 = ${this.preciseAdd({A: '0.1', B: '0.2'})}\n`;
      results += `0.3 - 0.1 = ${this.preciseSubtract({A: '0.3', B: '0.1'})}\n`;
      results += `0.1 × 0.2 = ${this.preciseMultiply({A: '0.1', B: '0.2'})}\n`;
      results += `1 ÷ 3 = ${this.preciseDivide({A: '1', B: '3'})}\n\n`;
      
      results += '2. 科学计数法测试：\n';
      results += `1.5e-1 转分数/小数: ${this.scientificToFractionOrDecimal({SCI: '1.5e-1'})}\n`;
      results += `1.23e3 所有表示形式: ${this.getSimpleRepresentations({SCI: '1.23e3'})}\n\n`;
      
      results += '3. 三角函数测试（角度模式）：\n';
      results += `sin(30) = ${this.preciseSin({X: '30'})}\n`;
      results += `cos(60) = ${this.preciseCos({X: '60'})}\n`;
      results += `tan(45) = ${this.preciseTan({X: '45'})}\n`;
      results += `cos(90) = ${this.preciseCos({X: '90'})}\n\n`;
      
      results += '4. 表达式测试：\n';
      results += this.testExpressionFeatures();
      
      return results;
    }
    
    testScientificConversion() {
      const tests = [
        ['1.23e5', '科学计数法转十进制/分数'],
        ['1.5e-1', '科学计数法转分数（0.15）'],
        ['1.23×10^3', '中文乘号格式'],
        ['1.23*10^3', '星号格式'],
        ['10^3', '纯指数格式'],
        ['3.333e-1', '转分数（1/3）'],
        ['1.5', '转带分数（1 1/2）']
      ];
      
      let results = '科学计数法转换测试：\n\n';
      
      for (const [input, description] of tests) {
        results += `${description}:\n`;
        results += `  输入: ${input}\n`;
        
        const num = sciConverter.parseScientificNotation(input);
        results += `  数值: ${num}\n`;
        
        if (sciConverter.isScientificNotation(input)) {
          results += `  类型: 科学计数法\n`;
          const fraction = sciConverter.scientificToFractionOrDecimal(input);
          results += `  转换: ${fraction}\n`;
        } else {
          results += `  类型: 普通数字\n`;
        }
        
        results += '\n';
      }
      
      return results;
    }
    
    testRepresentations() {
      const testCases = ['1.23e3', '1.5e-1', '3.333e-1', '1.5', '100', '0.3333333333333333'];
      let results = '表示形式测试：\n\n';
      
      for (const testCase of testCases) {
        results += `=== 测试: ${testCase} ===\n`;
        try {
          const simpleReps = this.getSimpleRepresentations({SCI: testCase});
          results += `${simpleReps}\n\n`;
        } catch (error) {
          results += `错误: ${error.message}\n\n`;
        }
      }
      
      return results;
    }
  }
  
  // 注册扩展
  if (Scratch && Scratch.extensions) {
    try {
      Scratch.extensions.register(new CompleteScientificMathExtensionCSME());
    } catch (e) {
      console.error('扩展注册失败:', e);
    }
  } else {
    console.error('Scratch环境未正确加载');
  }
  
})(Scratch);