(function (Scratch) {
    'use strict';
    if (!(Scratch && Scratch.extensions && Scratch.extensions.register)) {
        throw new Error('此环境不支持 Scratch 扩展注册。请在 TurboWarp / PenguinMod+ / 02Engine 扩展环境中加载。');
    }

    var A = Scratch.ArgumentType;
    var B = Scratch.BlockType;

    function makeIconURI() {
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
            '<rect x="4" y="2" width="24" height="28" rx="4" fill="#4facfe"/>' +
            '<rect x="7" y="5" width="18" height="7" rx="2" fill="#ffffff"/>' +
            '<rect x="7" y="15" width="5" height="4" rx="1" fill="#e0e0e0"/>' +
            '<rect x="13.5" y="15" width="5" height="4" rx="1" fill="#e0e0e0"/>' +
            '<rect x="20" y="15" width="5" height="4" rx="1" fill="#ffe066"/>' +
            '<rect x="7" y="21" width="5" height="4" rx="1" fill="#e0e0e0"/>' +
            '<rect x="13.5" y="21" width="5" height="4" rx="1" fill="#e0e0e0"/>' +
            '<rect x="20" y="21" width="5" height="4" rx="1" fill="#e0e0e0"/>' +
            '</svg>';
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    function gcd(a, b) {
        if (b === 0) return Math.abs(a);
        return gcd(b, a % b);
    }

    function isFractionString(str) {
        if (typeof str !== 'string') return false;
        var parts = str.split('/');
        if (parts.length !== 2) return false;
        return !isNaN(Number(parts[0])) && !isNaN(Number(parts[1])) && parts[1] !== '0';
    }

    function isPercentageString(str) {
        if (typeof str !== 'string') return false;
        return str.endsWith('%') && !isNaN(Number(str.slice(0, -1)));
    }

    function isDecimalString(str) {
        if (typeof str !== 'string') return false;
        if (isPercentageString(str)) return true;
        return !isNaN(Number(str)) && !str.includes('/');
    }

    function parseNumberOrFraction(value) {
        if (value === 'x') return NaN;
        if (typeof value === 'string' && value.includes('x') && value !== 'x') return NaN;
        
        if (isFractionString(value)) {
            var parts = value.split('/');
            var numerator = Number(parts[0]);
            var denominator = Number(parts[1]);
            return numerator / denominator;
        } else if (isPercentageString(value)) {
            return Number(value.slice(0, -1)) / 100;
        }
        return Number(value);
    }

    function safeGetNumber(value) {
        if (value === 'x') return NaN;
        if (typeof value === 'string' && value.includes('x') && value !== 'x') return NaN;
        var result = parseNumberOrFraction(value);
        if (isNaN(result)) return NaN;
        return result;
    }

    function containsSymbolX(value) {
        if (typeof value !== 'string') return false;
        return value.includes('x');
    }

    function isPureSymbolX(value) {
        return value === 'x';
    }

    function formatDecimal(value) {
        var num = Number(value);
        if (isNaN(num)) return "NaN";
        
        if (Math.abs(num - Math.round(num)) < 0.0000000001) {
            return Math.round(num).toString();
        }
        
        var decimalStr = num.toString();
        if (decimalStr.includes('e')) {
            return num.toFixed(10).replace(/\.?0+$/, '');
        }
        
        var result = decimalStr;
        if (result.includes('.')) {
            result = result.replace(/0+$/, '').replace(/\.$/, '');
        }
        
        if (result.length > 15) {
            return num.toFixed(10).replace(/\.?0+$/, '');
        }
        
        return result;
    }

    function formatFraction(value) {
        var num = Number(value);
        if (isNaN(num)) return "NaN";
        
        var bestFraction = null;
        var bestError = Infinity;
        
        for (var denominator = 1; denominator <= 1000; denominator++) {
            var numerator = Math.round(num * denominator);
            var approx = numerator / denominator;
            var error = Math.abs(approx - num);
            
            if (error < bestError && error < 0.000001) {
                bestFraction = { numerator: numerator, denominator: denominator };
                bestError = error;
            }
        }
        
        if (bestFraction) {
            var divisor = gcd(bestFraction.numerator, bestFraction.denominator);
            var simpleNum = bestFraction.numerator / divisor;
            var simpleDen = bestFraction.denominator / divisor;
            
            if (simpleDen === 1) {
                return simpleNum.toString();
            }
            
            if (simpleDen < 0) {
                return (-simpleNum) + '/' + (-simpleDen);
            }
            
            return simpleNum + '/' + simpleDen;
        }
        
        return formatDecimal(num);
    }

    function formatPercentage(value) {
        var num = Number(value);
        if (isNaN(num)) return "NaN";
        
        var percentageValue = (num * 100).toFixed(2);
        
        var result = percentageValue;
        if (result.includes('.')) {
            result = result.replace(/0+$/, '').replace(/\.$/, '');
        }
        
        return result + '%';
    }

    function containsX(value) {
        if (typeof value === 'string' && value === 'x') return true;
        if (typeof value === 'string' && value.includes('x')) return true;
        return false;
    }

    function smartFormatResult(value, input1, input2) {
        var hasX1 = containsX(input1);
        var hasX2 = containsX(input2);
        
        if (hasX1 || hasX2) {
            if (typeof value === 'string') return value;
            return value.toString();
        }
        
        var num = Number(value);
        if (isNaN(num)) return "NaN";
        
        var isFractionInput1 = isFractionString(input1);
        var isFractionInput2 = isFractionString(input2);
        var isPercentageInput1 = isPercentageString(input1);
        var isPercentageInput2 = isPercentageString(input2);
        
        if (isFractionInput1 && isFractionInput2) {
            return formatFraction(value);
        }
        
        if (isPercentageInput1 && isPercentageInput2) {
            return formatPercentage(value);
        }
        
        if (isPercentageInput1 || isPercentageInput2) {
            return formatPercentage(value);
        }
        
        if (isDecimalString(input1) || isDecimalString(input2)) {
            return formatDecimal(value);
        }
        
        return formatDecimal(value);
    }

    function addWithSymbol(a, b) {
        var aIsX = isPureSymbolX(a);
        var bIsX = isPureSymbolX(b);
        var aHasX = containsSymbolX(a);
        var bHasX = containsSymbolX(b);
        
        if ((aHasX && !aIsX) || (bHasX && !bIsX)) {
            return a + '+' + b;
        }
        
        if (aIsX && bIsX) return '2x';
        if (aIsX && !bIsX) {
            if (b === '0') return 'x';
            return 'x+' + b;
        }
        if (!aIsX && bIsX) {
            if (a === '0') return 'x';
            return a + '+x';
        }
        
        var num1 = parseNumberOrFraction(a);
        var num2 = parseNumberOrFraction(b);
        if (isNaN(num1) || isNaN(num2)) {
            return a + '+' + b;
        }
        var result = num1 + num2;
        return smartFormatResult(result, a, b);
    }

    function subtractWithSymbol(a, b) {
        var aIsX = isPureSymbolX(a);
        var bIsX = isPureSymbolX(b);
        var aHasX = containsSymbolX(a);
        var bHasX = containsSymbolX(b);
        
        if ((aHasX && !aIsX) || (bHasX && !bIsX)) {
            return a + '-' + b;
        }
        
        if (aIsX && bIsX) return '0';
        if (aIsX && !bIsX) {
            if (b === '0') return 'x';
            return 'x-' + b;
        }
        if (!aIsX && bIsX) {
            if (a === '0') return '-x';
            return a + '-x';
        }
        
        var num1 = parseNumberOrFraction(a);
        var num2 = parseNumberOrFraction(b);
        if (isNaN(num1) || isNaN(num2)) {
            return a + '-' + b;
        }
        var result = num1 - num2;
        return smartFormatResult(result, a, b);
    }

    function multiplyWithSymbol(a, b) {
        var aIsX = isPureSymbolX(a);
        var bIsX = isPureSymbolX(b);
        var aHasX = containsSymbolX(a);
        var bHasX = containsSymbolX(b);
        
        if ((aHasX && !aIsX) || (bHasX && !bIsX)) {
            return a + '×' + b;
        }
        
        if (aIsX && bIsX) return 'x²';
        if (aIsX && !bIsX) {
            if (b === '0') return '0';
            if (b === '1') return 'x';
            return b + 'x';
        }
        if (!aIsX && bIsX) {
            if (a === '0') return '0';
            if (a === '1') return 'x';
            return a + 'x';
        }
        
        var num1 = parseNumberOrFraction(a);
        var num2 = parseNumberOrFraction(b);
        if (isNaN(num1) || isNaN(num2)) {
            return a + '×' + b;
        }
        var result = num1 * num2;
        return smartFormatResult(result, a, b);
    }

    function divideWithSymbol(a, b) {
        var aIsX = isPureSymbolX(a);
        var bIsX = isPureSymbolX(b);
        var aHasX = containsSymbolX(a);
        var bHasX = containsSymbolX(b);
        
        if ((aHasX && !aIsX) || (bHasX && !bIsX)) {
            return a + '÷' + b;
        }
        
        if (aIsX && bIsX) return '1';
        if (aIsX && !bIsX) {
            if (b === '0') return "Error:除数不能为零";
            if (b === '1') return 'x';
            return 'x/' + b;
        }
        if (!aIsX && bIsX) {
            if (a === '0') return '0';
            return a + '/x';
        }
        
        var num1 = parseNumberOrFraction(a);
        var num2 = parseNumberOrFraction(b);
        if (isNaN(num1) || isNaN(num2)) {
            return a + '÷' + b;
        }
        if (num2 === 0) return "Error:除数不能为零";
        var result = num1 / num2;
        return smartFormatResult(result, a, b);
    }

    function parseMatrix(matrixStr) {
        try {
            matrixStr = matrixStr.trim();
            if (matrixStr.startsWith('[') && matrixStr.endsWith(']')) {
                matrixStr = matrixStr.slice(1, -1);
            }
            
            var rows = matrixStr.split(';').filter(function(row) { return row.trim() !== ''; });
            var matrix = [];
            
            if (rows.length === 0) return null;
            
            for (var i = 0; i < rows.length; i++) {
                var cols = rows[i].split(',').map(Number);
                if (cols.some(isNaN)) return null;
                matrix.push(cols);
            }
            
            var cols = matrix[0].length;
            if (cols === 0) return null;
            
            for (var j = 1; j < matrix.length; j++) {
                if (matrix[j].length !== cols) return null;
            }
            
            return matrix;
        } catch (e) {
            return null;
        }
    }

    function matrixToString(matrix) {
        if (!matrix || matrix.length === 0) return "[]";
        
        var rows = matrix.map(function(row) {
            return row.map(function(num) {
                if (Math.abs(num - Math.round(num)) < 0.000001) {
                    return Math.round(num).toString();
                }
                return parseFloat(num.toFixed(6)).toString();
            }).join(',');
        });
        
        return '[' + rows.join(';') + ']';
    }

    function parseComplex(str) {
        str = str.trim();
        
        var complexRegex = /^([+-]?\d*\.?\d*)([+-]\d*\.?\d*)i$/;
        var match = str.match(complexRegex);
        
        if (match) {
            var real = match[1];
            var imag = match[2];
            
            if (real === '' || real === '+') real = '1';
            else if (real === '-') real = '-1';
            
            if (imag === '+' || imag === '') imag = '1';
            else if (imag === '-') imag = '-1';
            
            return { real: Number(real), imag: Number(imag) };
        }
        
        if (!isNaN(Number(str))) {
            return { real: Number(str), imag: 0 };
        }
        
        var pureImagMatch = str.match(/^([+-]?\d*\.?\d*)i$/);
        if (pureImagMatch) {
            var imag2 = pureImagMatch[1];
            if (imag2 === '' || imag2 === '+') imag2 = '1';
            else if (imag2 === '-') imag2 = '-1';
            return { real: 0, imag: Number(imag2) };
        }
        
        return null;
    }

    function complexToString(c) {
        if (c.imag === 0) return c.real.toString();
        if (c.real === 0) {
            if (c.imag === 1) return "i";
            if (c.imag === -1) return "-i";
            return c.imag + 'i';
        }
        
        var imagSign = c.imag >= 0 ? '+' : '-';
        var imagAbs = Math.abs(c.imag);
        var imagStr = imagAbs === 1 ? "i" : imagAbs + 'i';
        
        return c.real + imagSign + imagStr;
    }

    function solveLinearEquation(a, b) {
        if (a === 0) {
            if (b === 0) return "无穷多解";
            return "无解";
        }
        return (-b / a).toString();
    }

    function solveQuadraticEquation(a, b, c) {
        if (a === 0) {
            return solveLinearEquation(b, c);
        }
        
        var discriminant = b * b - 4 * a * c;
        
        if (discriminant > 0) {
            var x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            var x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            return 'x1=' + formatDecimal(x1) + ',x2=' + formatDecimal(x2);
        } else if (discriminant === 0) {
            var x = -b / (2 * a);
            return 'x=' + formatDecimal(x) + '(重根)';
        } else {
            var real = -b / (2 * a);
            var imag = Math.sqrt(-discriminant) / (2 * a);
            return 'x1=' + formatDecimal(real) + '+' + formatDecimal(imag) + 'i,x2=' + formatDecimal(real) + '-' + formatDecimal(imag) + 'i';
        }
    }

    function isNaturalNumber(n) {
        if (typeof n !== 'number' || isNaN(n)) return false;
        return Number.isInteger(n) && n >= 0;
    }
    
    function isIntegerNumber(n) {
        if (typeof n !== 'number' || isNaN(n)) return false;
        return Number.isInteger(n);
    }
    
    function isRationalNumber(n) {
        if (typeof n !== 'number' || isNaN(n)) return false;
        if (Number.isInteger(n)) return true;
        var str = n.toString();
        if (str.includes('e')) return false;
        var tolerance = 1e-10;
        for (var denominator = 1; denominator <= 10000; denominator++) {
            var numerator = Math.round(n * denominator);
            if (Math.abs(numerator / denominator - n) < tolerance) {
                return true;
            }
        }
        return false;
    }
    
    function isRealNumber(n) {
        return typeof n === 'number' && !isNaN(n) && isFinite(n);
    }
    
    function parseSet(setStr) {
        if (typeof setStr !== 'string') return [];
        var cleaned = setStr.trim();
        if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
            cleaned = cleaned.slice(1, -1);
        }
        if (cleaned.trim() === '') return [];
        var items;
        if (cleaned.includes(',')) {
            items = cleaned.split(',').filter(function(item) { return item.trim() !== ''; });
        } else {
            items = cleaned.split(/\s+/).filter(function(item) { return item.trim() !== ''; });
        }
        return items.map(function(item) {
            var trimmed = item.trim();
            var num = parseNumberOrFraction(trimmed);
            return isNaN(num) ? trimmed : num;
        });
    }
    
    function setToString(set) {
        if (!set || set.length === 0) return '{}';
        var result = set.map(function(item) {
            if (typeof item === 'number') {
                return formatDecimal(item);
            }
            return item;
        }).join(', ');
        return '{' + result + '}';
    }
    
    function setIntersection(setA, setB) {
        var a = parseSet(setA);
        var b = parseSet(setB);
        var result = a.filter(function(item) {
            return b.some(function(bItem) {
                if (typeof item === 'number' && typeof bItem === 'number') {
                    return Math.abs(item - bItem) < 1e-10;
                }
                return item == bItem;
            });
        });
        return setToString(result);
    }
    
    function setUnion(setA, setB) {
        var a = parseSet(setA);
        var b = parseSet(setB);
        var result = a.slice();
        for (var i = 0; i < b.length; i++) {
            var item = b[i];
            var exists = result.some(function(rItem) {
                if (typeof item === 'number' && typeof rItem === 'number') {
                    return Math.abs(item - rItem) < 1e-10;
                }
                return item == rItem;
            });
            if (!exists) result.push(item);
        }
        return setToString(result);
    }
    
    function setDifference(setA, setB) {
        var a = parseSet(setA);
        var b = parseSet(setB);
        var result = a.filter(function(item) {
            return !b.some(function(bItem) {
                if (typeof item === 'number' && typeof bItem === 'number') {
                    return Math.abs(item - bItem) < 1e-10;
                }
                return item == bItem;
            });
        });
        return setToString(result);
    }
    
    function setSymmetricDifference(setA, setB) {
        var union = parseSet(setUnion(setA, setB));
        var intersection = parseSet(setIntersection(setA, setB));
        var result = union.filter(function(item) {
            return !intersection.some(function(intItem) {
                if (typeof item === 'number' && typeof intItem === 'number') {
                    return Math.abs(item - intItem) < 1e-10;
                }
                return item == intItem;
            });
        });
        return setToString(result);
    }
    
    function isSubset(setA, setB) {
        var a = parseSet(setA);
        var b = parseSet(setB);
        return a.every(function(item) {
            return b.some(function(bItem) {
                if (typeof item === 'number' && typeof bItem === 'number') {
                    return Math.abs(item - bItem) < 1e-10;
                }
                return item == bItem;
            });
        });
    }
    
    function isProperSubset(setA, setB) {
        return isSubset(setA, setB) && !isSubset(setB, setA);
    }
    
    function setSize(set) {
        var s = parseSet(set);
        return s.length;
    }
    
    function isEmptySet(set) {
        var s = parseSet(set);
        return s.length === 0;
    }
    
    function setsEqual(setA, setB) {
        return isSubset(setA, setB) && isSubset(setB, setA);
    }
    
    function powerSet(set) {
        var s = parseSet(set);
        var result = [];
        var total = Math.pow(2, s.length);
        for (var i = 0; i < total; i++) {
            var subset = [];
            for (var j = 0; j < s.length; j++) {
                if (i & (1 << j)) {
                    subset.push(s[j]);
                }
            }
            result.push(subset);
        }
        return result.map(function(sub) { return setToString(sub); }).join(', ');
    }
    
    function cartesianProduct(setA, setB) {
        var a = parseSet(setA);
        var b = parseSet(setB);
        var result = [];
        for (var i = 0; i < a.length; i++) {
            for (var j = 0; j < b.length; j++) {
                result.push('(' + a[i] + ',' + b[j] + ')');
            }
        }
        if (result.length === 0) return '{}';
        return '{' + result.join(', ') + '}';
    }
    
    function getSetElements(set) {
        return parseSet(set);
    }

    function detectEditor() {
        if (window.location && window.location.href) {
            var url = window.location.href.toLowerCase();
            
            if (url.includes('turbowarp.org') || url.includes('turbowarp.io')) {
                return "TurboWarp";
            } else if (url.includes('penguinmod.com') || url.includes('penguinmod.io')) {
                return "PenguinMod";
            } else if (url.includes('bilup') || url.includes('bilibili.com')) {
                return "Bilup";
            } else if (url.includes('02engine') || url.includes('o2engine')) {
                return "02Engine";
            } else if (url.includes('gcxsj')) {
                return "共创世界";
            } else if (url.includes('code.xueersi.com')) {
                return "学而思编程";
            } else if (url.includes('kitten4.codemao.cn') || url.includes('shequ.codemao.cn')) {
                return "编程猫";
            } else if (url.includes('scratch.mit.edu')) {
                return "Scratch官方";
            }
        }
        
        try {
            if (typeof window.TurboWarp !== 'undefined' || 
                (typeof Scratch !== 'undefined' && Scratch.vm && Scratch.vm.runtime && Scratch.vm.runtime.isTurboWarp)) {
                return "TurboWarp";
            }
            
            if (typeof window.PenguinMod !== 'undefined') {
                return "PenguinMod";
            }
            
            if (typeof window.Bilup !== 'undefined' || 
                (typeof Scratch !== 'undefined' && Scratch.vm && Scratch.vm.runtime && Scratch.vm.runtime.isBilup)) {
                return "Bilup";
            }
            
            if (typeof window.o2engine !== 'undefined' || 
                typeof window.o2Engine !== 'undefined' ||
                typeof window.O2Engine !== 'undefined' ||
                typeof window.O2ENGINE !== 'undefined' ||
                (typeof window !== 'undefined' && window.O2 && window.O2.engine)) {
                return "02Engine";
            }
            
            if (typeof window !== 'undefined') {
                if (window.O2 || window.o2) {
                    return "02Engine";
                }
                
                if (typeof O2 !== 'undefined' && O2.engine) {
                    return "02Engine";
                }
                
                if (window.navigator && window.navigator.userAgent) {
                    var ua = window.navigator.userAgent;
                    if (ua.includes('02Engine') || ua.includes('O2Engine')) {
                        return "02Engine";
                    }
                }
            }
            
            if (typeof Scratch !== 'undefined' && Scratch.vm && !Scratch.vm.runtime.isTurboWarp) {
                if (typeof window.PenguinMod === 'undefined' && 
                    typeof window.TurboWarp === 'undefined') {
                    return "TurboWarp";
                }
            }
            
        } catch (e) {
            console.log('检测编辑器时出错:', e);
        }
        
        return "未检测到你用的是什么编辑器";
    }

    var graphObjects = [];
    var graphCounter = 0;

    function evaluateFunction(expression, x) {
        try {
            var expr = expression
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(')
                .replace(/asin\(/g, 'Math.asin(')
                .replace(/acos\(/g, 'Math.acos(')
                .replace(/atan\(/g, 'Math.atan(')
                .replace(/sinh\(/g, 'Math.sinh(')
                .replace(/cosh\(/g, 'Math.cosh(')
                .replace(/tanh\(/g, 'Math.tanh(')
                .replace(/sqrt\(/g, 'Math.sqrt(')
                .replace(/cbrt\(/g, 'Math.cbrt(')
                .replace(/abs\(/g, 'Math.abs(')
                .replace(/floor\(/g, 'Math.floor(')
                .replace(/ceil\(/g, 'Math.ceil(')
                .replace(/round\(/g, 'Math.round(')
                .replace(/log\(/g, 'Math.log(')
                .replace(/log10\(/g, 'Math.log10(')
                .replace(/exp\(/g, 'Math.exp(')
                .replace(/pow\(/g, 'Math.pow(')
                .replace(/PI/g, 'Math.PI')
                .replace(/E/g, 'Math.E');
            
            var fn = new Function('x', 'return ' + expr);
            return fn(x);
        } catch (e) {
            return NaN;
        }
    }

    function generatePoints(expression, xMin, xMax, step) {
        if (step === undefined) step = 0.05;
        var points = [];
        for (var x = xMin; x <= xMax; x += step) {
            var y = evaluateFunction(expression, x);
            if (!isNaN(y) && isFinite(y)) {
                points.push({ x: x, y: y });
            }
        }
        return points;
    }

    function createGraphElement(title, points, xMin, xMax, yMin, yMax, width, height) {
        var container = document.createElement('div');
        container.className = 'calc-graph-container';
        container.style.position = 'fixed';
        container.style.zIndex = '10001';
        container.style.backgroundColor = '#fff';
        container.style.borderRadius = '12px';
        container.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        container.style.overflow = 'hidden';
        container.style.minWidth = width + 'px';
        container.style.minHeight = (height + 60) + 'px';
        
        var header = document.createElement('div');
        header.style.backgroundColor = '#4C97FF';
        header.style.color = 'white';
        header.style.padding = '10px 15px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.cursor = 'move';
        header.innerHTML = '<span>📈' + title + '</span>' +
            '<div style="display:flex;gap:8px;">' +
                '<button class="calc-graph-minimize" style="background:none;border:none;color:white;cursor:pointer;font-size:16px;width:24px;height:24px;border-radius:4px;">−</button>' +
                '<button class="calc-graph-close" style="background:none;border:none;color:white;cursor:pointer;font-size:16px;width:24px;height:24px;border-radius:4px;">✕</button>' +
            '</div>';
        
        var contentDiv = document.createElement('div');
        contentDiv.className = 'calc-graph-content';
        
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.display = 'block';
        canvas.style.backgroundColor = '#f8f9fa';
        canvas.style.margin = '10px';
        
        var ctx = canvas.getContext('2d');
        drawGraph(ctx, points, xMin, xMax, yMin, yMax, width, height);
        
        var info = document.createElement('div');
        info.style.padding = '8px 15px';
        info.style.fontSize = '12px';
        info.style.color = '#666';
        info.style.borderTop = '1px solid #eee';
        info.style.backgroundColor = '#f5f5f5';
        info.innerHTML = '点数量:' + points.length + '|x:[' + xMin.toFixed(2) + ',' + xMax.toFixed(2) + ']|y:[' + yMin.toFixed(2) + ',' + yMax.toFixed(2) + ']';
        
        contentDiv.appendChild(canvas);
        contentDiv.appendChild(info);
        
        container.appendChild(header);
        container.appendChild(contentDiv);
        
        var isMinimized = false;
        var minimizeBtn = header.querySelector('.calc-graph-minimize');
        minimizeBtn.addEventListener('click', function() {
            if (isMinimized) {
                contentDiv.style.display = 'block';
                minimizeBtn.textContent = '−';
                container.style.minHeight = (height + 60) + 'px';
                isMinimized = false;
            } else {
                contentDiv.style.display = 'none';
                minimizeBtn.textContent = '+';
                container.style.minHeight = 'auto';
                isMinimized = true;
            }
        });
        
        var closeBtn = header.querySelector('.calc-graph-close');
        closeBtn.addEventListener('click', function() {
            container.remove();
            var index = graphObjects.findIndex(function(obj) { return obj.element === container; });
            if (index !== -1) graphObjects.splice(index, 1);
        });
        
        var isDragging = false;
        var dragOffset = { x: 0, y: 0 };
        header.addEventListener('mousedown', function(e) {
            if (e.target === minimizeBtn || e.target === closeBtn) return;
            isDragging = true;
            dragOffset.x = e.clientX - container.offsetLeft;
            dragOffset.y = e.clientY - container.offsetTop;
        });
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                container.style.left = (e.clientX - dragOffset.x) + 'px';
                container.style.top = (e.clientY - dragOffset.y) + 'px';
                container.style.right = 'auto';
            }
        });
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        return container;
    }

    function drawGraph(ctx, points, xMin, xMax, yMin, yMax, width, height) {
        var padding = 40;
        var graphWidth = width - 2 * padding;
        var graphHeight = height - 2 * padding;
        
        ctx.clearRect(0, 0, width, height);
        
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        
        var xStep = graphWidth / 10;
        for (var i = 0; i <= 10; i++) {
            var x = padding + i * xStep;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }
        
        var yStep = graphHeight / 10;
        for (var j = 0; j <= 10; j++) {
            var y = padding + j * yStep;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        
        var axisY = padding + graphHeight * (yMax / (yMax - yMin));
        if (axisY >= padding && axisY <= height - padding) {
            ctx.beginPath();
            ctx.moveTo(padding, axisY);
            ctx.lineTo(width - padding, axisY);
            ctx.stroke();
        }
        
        var axisX = padding + graphWidth * (-xMin / (xMax - xMin));
        if (axisX >= padding && axisX <= width - padding) {
            ctx.beginPath();
            ctx.moveTo(axisX, padding);
            ctx.lineTo(axisX, height - padding);
            ctx.stroke();
        }
        
        if (points.length >= 2) {
            ctx.beginPath();
            ctx.strokeStyle = '#4C97FF';
            ctx.lineWidth = 2;
            
            var firstPoint = true;
            for (var k = 0; k < points.length; k++) {
                var point = points[k];
                var canvasX = padding + graphWidth * (point.x - xMin) / (xMax - xMin);
                var canvasY = padding + graphHeight * (yMax - point.y) / (yMax - yMin);
                
                if (canvasX >= padding && canvasX <= width - padding && 
                    canvasY >= padding && canvasY <= height - padding) {
                    if (firstPoint) {
                        ctx.moveTo(canvasX, canvasY);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(canvasX, canvasY);
                    }
                } else {
                    firstPoint = true;
                }
            }
            ctx.stroke();
        }
        
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.fillText('0', axisX - 8, axisY + 4);
        ctx.fillText('x', width - padding + 5, axisY + 4);
        ctx.fillText('y', axisX - 10, padding - 5);
    }

    function EnhancedCalculatorExtension() {
        this.editorInfo = detectEditor();
        this.angleMode = 'degrees';
        this.lastMatrixResult = null;
        this.lastComplexResult = null;
        this.searchResults = [];
        
        this.frameCount = 0;
        this.lastFPSUpdate = Date.now();
        this.currentFPS = 0;
        this.minFPS = Infinity;
        this.maxFPS = 0;
        this.fpsHistory = [];
        this.fpsHistoryMaxLength = 60;
        this.frameTimeHistory = [];
        this.lastFrameTime = Date.now();
        
        var self = this;
        this.startFPSMeasurement();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                self.createDocumentButton();
                self.createSearchPanel();
                self.initGraphStyles();
            });
        } else {
            this.createDocumentButton();
            this.createSearchPanel();
            this.initGraphStyles();
        }
    }

    EnhancedCalculatorExtension.prototype.initGraphStyles = function() {
        if (document.getElementById('calc-graph-styles')) return;
        var style = document.createElement('style');
        style.id = 'calc-graph-styles';
        style.textContent = 
            '.calc-graph-container{' +
                'position:fixed;' +
                'background:white;' +
                'border-radius:12px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.2);' +
                'overflow:hidden;' +
                'z-index:10001;' +
            '}' +
            '.calc-graph-container canvas{' +
                'display:block;' +
                'margin:10px;' +
            '}' +
            '.calc-graph-minimize,.calc-graph-close{' +
                'transition:background-color 0.2s;' +
            '}' +
            '.calc-graph-minimize:hover,.calc-graph-close:hover{' +
                'background-color:rgba(255,255,255,0.2);' +
            '}';
        document.head.appendChild(style);
    };

    EnhancedCalculatorExtension.prototype.createDocumentButton = function() {
        if (document.getElementById('open-document-button')) return;
        
        var button = document.createElement('button');
        button.id = 'open-document-button';
        button.innerText = '📄使用说明';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '10px 20px';
        button.style.fontSize = '14px';
        button.style.cursor = 'pointer';
        button.style.border = 'none';
        button.style.borderRadius = '20px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.zIndex = '9999';
        button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        var self = this;
        button.onclick = function() { self.openDocument(); };
        
        document.body.appendChild(button);
    };

    EnhancedCalculatorExtension.prototype.openDocument = function() {
        var editorInfo = this.editorInfo || "未知";
        
        var documentContent = '# 计算器扩展 v1.0.3 - 使用说明\n\n' +
            '## 功能列表\n\n' +
            '### x 值\n' +
            '- **x** - 返回符号 x，可与其他运算组合\n\n' +
            '### 集合运算 Set Theory\n' +
            '- 数集判断：∈N / ∈Z / ∈Q / ∈R / ∈C / ∈K / ∈U / ∈A\n' +
            '- 数集判断：∉N / ∉Z / ∉Q / ∉R / ∉C / ∉K / ∉U / ∉A\n' +
            '- 集合运算：∩ 交集、∪ 并集、- 差集、Δ 对称差\n' +
            '- 子集判断：⊆ 子集、⊂ 真子集\n' +
            '- 集合大小、空集判断、集合相等\n' +
            '- 幂集 P()、笛卡尔积 ×\n' +
            '- 获取集合元素列表\n\n' +
            '### 函数图像 Function Graph\n' +
            '- 创建图像（支持最小化/恢复）\n' +
            '- 关闭所有图像\n' +
            '- 图像数量\n\n' +
            '### 基础运算 Basic Operations\n' +
            '- 加减乘除、幂、根号、绝对值、取整等\n\n' +
            '### 比较运算 Comparison\n' +
            '- 大于、小于、等于、不等于等\n\n' +
            '### 百分比 Percentage\n' +
            '- 百分比计算、增加、减少、差异\n\n' +
            '### 数值处理 Number Processing\n' +
            '- clamp、lerp、map、roundTo、sign、区间判断等\n\n' +
            '### 字符串处理 String\n' +
            '- 长度、拼接、大小写转换、反转、截取等\n\n' +
            '### 概率运算 Random\n' +
            '- 随机整数、小数、布尔值、随机选择\n\n' +
            '### 统计运算 Statistics\n' +
            '- 平均值、总和、最值、标准差、方差、中位数等\n\n' +
            '### 单位转换 Units\n' +
            '- 温度、长度、重量转换\n\n' +
            '### 数论运算 Number Theory\n' +
            '- 阶乘、斐波那契、质数判断、GCD、LCM等\n\n' +
            '### 三角函数 Trigonometry\n' +
            '- sin、cos、tan及反三角函数\n\n' +
            '### 对数和指数 Log & Exp\n' +
            '- ln、log10、log2、e^x\n\n' +
            '### 数学常数 Constants\n' +
            '- π、e、φ、√2\n\n' +
            '### 几何运算 Geometry\n' +
            '- 勾股定理、圆面积、三角形面积、体积等\n\n' +
            '### 复数运算 Complex\n' +
            '- 复数加减乘除、共轭、模\n\n' +
            '### 矩阵运算 Matrix\n' +
            '- 矩阵加减乘除、转置、行列式\n\n' +
            '### FPS性能检测\n' +
            '- FPS监测\n\n' +
            '---\n' +
            '作者B站：https://space.bilibili.com/3546949919705808';

        var blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = '计算器扩展使用说明_' + this.editorInfo + '_v1.0.3.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    EnhancedCalculatorExtension.prototype.createSearchPanel = function() {
        if (document.getElementById('calc-search-panel')) return;
        
        var style = document.createElement('style');
        style.textContent = 
            '#calc-search-panel{' +
                'position:fixed;' +
                'top:100px;' +
                'right:20px;' +
                'width:280px;' +
                'background:#fff;' +
                'border-radius:12px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.15);' +
                'z-index:10000;' +
                'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
                'overflow:hidden;' +
            '}' +
            '#calc-search-panel .calc-search-header{' +
                'background:linear-gradient(135deg,#4C97FF,#3373CC);' +
                'color:white;' +
                'padding:12px 15px;' +
                'font-weight:bold;' +
                'display:flex;' +
                'justify-content:space-between;' +
                'align-items:center;' +
                'cursor:move;' +
            '}' +
            '#calc-search-panel .calc-search-toggle-btn{' +
                'background:rgba(255,255,255,0.2);' +
                'border:none;' +
                'color:white;' +
                'width:28px;' +
                'height:28px;' +
                'border-radius:6px;' +
                'cursor:pointer;' +
                'font-size:14px;' +
                'line-height:28px;' +
                'text-align:center;' +
                'transition:all 0.2s;' +
            '}' +
            '#calc-search-panel .calc-search-toggle-btn:hover{' +
                'background:rgba(255,255,255,0.3);' +
            '}' +
            '#calc-search-panel .calc-search-input-wrap{' +
                'padding:12px 15px;' +
                'border-bottom:1px solid #eee;' +
            '}' +
            '#calc-search-panel .calc-search-input{' +
                'width:100%;' +
                'padding:10px 12px;' +
                'border:2px solid #e0e0e0;' +
                'border-radius:8px;' +
                'font-size:14px;' +
                'box-sizing:border-box;' +
                'outline:none;' +
                'transition:border-color 0.2s;' +
            '}' +
            '#calc-search-panel .calc-search-input:focus{' +
                'border-color:#4C97FF;' +
            '}' +
            '#calc-search-panel .calc-search-results{' +
                'max-height:400px;' +
                'overflow-y:auto;' +
                'padding:8px 0;' +
            '}' +
            '#calc-search-panel .calc-search-results.collapsed{' +
                'display:none;' +
            '}' +
            '#calc-search-panel .calc-result-count{' +
                'padding:8px 15px;' +
                'background:#f5f5f5;' +
                'font-size:12px;' +
                'color:#666;' +
            '}' +
            '#calc-search-panel .calc-result-count.collapsed{' +
                'display:none;' +
            '}' +
            '#calc-search-panel .calc-result-item{' +
                'padding:10px 15px;' +
                'cursor:pointer;' +
                'transition:background 0.2s;' +
                'border-left:3px solid transparent;' +
            '}' +
            '#calc-search-panel .calc-result-item:hover{' +
                'background:#f0f7ff;' +
                'border-left-color:#4C97FF;' +
            '}' +
            '#calc-search-panel .calc-result-name{' +
                'font-weight:500;' +
                'color:#333;' +
                'margin-bottom:4px;' +
            '}' +
            '#calc-search-panel .calc-result-category{' +
                'font-size:12px;' +
                'color:#888;' +
            '}' +
            '#calc-search-panel .calc-no-results{' +
                'padding:20px;' +
                'text-align:center;' +
                'color:#888;' +
            '}';
        document.head.appendChild(style);
        
        var panel = document.createElement('div');
        panel.id = 'calc-search-panel';
        panel.innerHTML = 
            '<div class="calc-search-header">' +
                '<span>🔍搜索积木</span>' +
                '<button class="calc-search-toggle-btn" id="calc-search-toggle">−</button>' +
            '</div>' +
            '<div class="calc-search-input-wrap" id="calc-search-body">' +
                '<input type="text" class="calc-search-input" placeholder="输入关键词搜索..." id="calc-search-input">' +
            '</div>' +
            '<div class="calc-result-count" id="calc-result-count"></div>' +
            '<div class="calc-search-results" id="calc-search-results"></div>';
        document.body.appendChild(panel);
        
        var searchInput = document.getElementById('calc-search-input');
        var resultsContainer = document.getElementById('calc-search-results');
        var resultCount = document.getElementById('calc-result-count');
        var toggleBtn = document.getElementById('calc-search-toggle');
        var searchBody = document.getElementById('calc-search-body');
        var resultsDiv = document.getElementById('calc-search-results');
        var countDiv = document.getElementById('calc-result-count');
        
        var isMinimized = false;
        toggleBtn.addEventListener('click', function() {
            if (isMinimized) {
                searchBody.style.display = 'block';
                resultsDiv.classList.remove('collapsed');
                countDiv.classList.remove('collapsed');
                toggleBtn.textContent = '−';
                isMinimized = false;
            } else {
                searchBody.style.display = 'none';
                resultsDiv.classList.add('collapsed');
                countDiv.classList.add('collapsed');
                toggleBtn.textContent = '+';
                isMinimized = true;
            }
        });
        
        var header = panel.querySelector('.calc-search-header');
        var isDragging = false;
        var dragOffset = { x: 0, y: 0 };
        
        header.addEventListener('mousedown', function(e) {
            if (e.target === toggleBtn) return;
            isDragging = true;
            dragOffset.x = e.clientX - panel.offsetLeft;
            dragOffset.y = e.clientY - panel.offsetTop;
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                panel.style.left = (e.clientX - dragOffset.x) + 'px';
                panel.style.top = (e.clientY - dragOffset.y) + 'px';
                panel.style.right = 'auto';
            }
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        var searchTimeout;
        var self = this;
        var doSearch = function(query) {
            if (searchTimeout) clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function() {
                var q = query.toLowerCase().trim();
                if (q.length < 1) {
                    resultsContainer.innerHTML = '';
                    resultCount.textContent = '';
                    return;
                }
                
                var blocks = self.getAllBlocksForSearch();
                var results = [];
                
                for (var i = 0; i < blocks.length; i++) {
                    var block = blocks[i];
                    if (block.text.toLowerCase().includes(q) || 
                        block.opcode.toLowerCase().includes(q) ||
                        block.category.toLowerCase().includes(q)) {
                        results.push(block);
                    }
                }
                
                self.searchResults = results;
                
                if (results.length === 0) {
                    resultsContainer.innerHTML = '<div class="calc-no-results">未找到匹配的积木</div>';
                    resultCount.textContent = '找到0个积木';
                    return;
                }
                
                resultCount.textContent = '找到' + results.length + '个积木';
                var html = '';
                for (var j = 0; j < results.length; j++) {
                    var block2 = results[j];
                    html += '<div class="calc-result-item" data-opcode="' + block2.opcode + '" data-index="' + j + '">' +
                        '<div class="calc-result-name">' + block2.text + '</div>' +
                        '<div class="calc-result-category">' + block2.category + '</div>' +
                    '</div>';
                }
                resultsContainer.innerHTML = html;
            }, 150);
        };
        
        searchInput.addEventListener('input', function(e) {
            doSearch(e.target.value);
        });
        
        resultsContainer.innerHTML = '<div class="calc-no-results">输入关键词开始搜索...</div>';
    };

    // ===== 核心方法 =====
    EnhancedCalculatorExtension.prototype.xValue = function(args) {
        var num = Number(args.num);
        if (isNaN(num)) return -1;
        return 0;
    };

    EnhancedCalculatorExtension.prototype.unknownZeroDivZero = function() { return NaN; };
    EnhancedCalculatorExtension.prototype.unknownInfMinusInf = function() { return NaN; };
    EnhancedCalculatorExtension.prototype.unknownZeroTimesInf = function() { return NaN; };
    EnhancedCalculatorExtension.prototype.unknownZeroPowZero = function() { return NaN; };
    EnhancedCalculatorExtension.prototype.unknownInfDivInf = function() { return NaN; };
    EnhancedCalculatorExtension.prototype.unknownOnePowInf = function() { return NaN; };
    EnhancedCalculatorExtension.prototype.unknownInfPowZero = function() { return NaN; };

    // 通用集合判断积木（属于）
    EnhancedCalculatorExtension.prototype.isInSet = function(args) {
        if (!args) return false;
        var value = args.value;
        var setType = args.setType;
        var num = safeGetNumber(value);
        
        switch(setType) {
            case 'N': return isNaturalNumber(num);
            case 'Z': return isIntegerNumber(num);
            case 'Q': return isRationalNumber(num);
            case 'R': return isRealNumber(num);
            case 'C': 
                if (!isNaN(num) && isRealNumber(num)) return true;
                return parseComplex(value) !== null;
            case 'K': 
                var v = safeGetNumber(value);
                return !isNaN(v) && isFinite(v);
            case 'U': 
                var v2 = safeGetNumber(value);
                return isNaN(v2);
            case 'A': return true;
            default: return false;
        }
    };

    // 通用集合判断积木（不属于）
    EnhancedCalculatorExtension.prototype.isNotInSet = function(args) {
        if (!args) return false;
        return !this.isInSet(args);
    };

    // 数集返回积木
    EnhancedCalculatorExtension.prototype.setN = function() { return "N"; };
    EnhancedCalculatorExtension.prototype.setZ = function() { return "Z"; };
    EnhancedCalculatorExtension.prototype.setQ = function() { return "Q"; };
    EnhancedCalculatorExtension.prototype.setR = function() { return "R"; };
    EnhancedCalculatorExtension.prototype.setC = function() { return "C"; };
    EnhancedCalculatorExtension.prototype.setK = function() { return "K"; };
    EnhancedCalculatorExtension.prototype.setU = function() { return "U"; };
    EnhancedCalculatorExtension.prototype.setA = function() { return "A"; };

    EnhancedCalculatorExtension.prototype.getAllBlocksForSearch = function() {
        var blocks = [];
        var info = this.getInfo();
        for (var i = 0; i < info.blocks.length; i++) {
            var block = info.blocks[i];
            if (block.blockType === 'label') continue;
            var category = '其他';
            if (block.opcode === 'xVariable') category = 'x值';
            else if (block.opcode === 'xValue') category = '归零映射';
            else if (block.opcode.includes('isInSet') || block.opcode.includes('isNotInSet')) category = '集合论';
            else if (block.opcode.includes('unknown')) category = '无知数';
            else if (block.opcode.includes('graph')) category = 'FunctionGraph';
            else if (block.opcode.includes('setN') || block.opcode.includes('setZ') || block.opcode.includes('setQ') || 
                     block.opcode.includes('setR') || block.opcode.includes('setC') || block.opcode.includes('setK') || 
                     block.opcode.includes('setU') || block.opcode.includes('setA') ||
                     block.opcode.includes('Intersection') || block.opcode.includes('Union') || 
                     block.opcode.includes('Difference') || block.opcode.includes('Subset') ||
                     block.opcode.includes('isEmptySet') || block.opcode.includes('setsEqual') ||
                     block.opcode.includes('powerSet') || block.opcode.includes('cartesianProduct') ||
                     block.opcode.includes('getSetElements')) {
                category = '集合论';
            }
            else if (block.opcode.includes('add') || block.opcode.includes('subtract') || block.opcode.includes('multiply') || block.opcode.includes('divide')) category = 'BasicOps';
            else if (block.opcode.includes('greater') || block.opcode.includes('less') || block.opcode.includes('equal')) category = 'Comparison';
            else if (block.opcode.includes('percentage')) category = 'Percentage';
            else if (block.opcode.includes('clamp') || block.opcode.includes('lerp') || block.opcode.includes('map')) category = 'NumberProcessing';
            else if (block.opcode.includes('string')) category = 'String';
            else if (block.opcode.includes('toBin') || block.opcode.includes('toHex') || block.opcode.includes('toOct') || block.opcode.includes('fromBin') || block.opcode.includes('fromHex') || block.opcode.includes('fromOct')) category = '进制转换';
            else if (block.opcode.includes('random')) category = 'Random';
            else if (block.opcode.includes('average') || block.opcode.includes('sum') || block.opcode.includes('stdDev')) category = 'Statistics';
            else if (block.opcode.includes('celsius') || block.opcode.includes('km') || block.opcode.includes('kg') || block.opcode.includes('m2ft') || block.opcode.includes('ft2m') || block.opcode.includes('L2gal') || block.opcode.includes('gal2L') || block.opcode.includes('cm2inch') || block.opcode.includes('inch2cm') || block.opcode.includes('ms2kmh') || block.opcode.includes('kmh2ms')) category = 'Units';
            else if (block.opcode.includes('factorial') || block.opcode.includes('prime') || block.opcode.includes('gcd') || block.opcode.includes('digitSum') || block.opcode.includes('Perfect') || block.opcode.includes('Armstrong') || block.opcode.includes('Roman')) category = 'NumberTheory';
            else if (block.opcode.includes('sin') || block.opcode.includes('cos') || block.opcode.includes('tan') || block.opcode.includes('deg2rad') || block.opcode.includes('rad2deg')) category = 'Trigonometry';
            else if (block.opcode.includes('log') || block.opcode.includes('ln') || block.opcode.includes('exp') || block.opcode.includes('nRoot')) category = 'Log&Exp';
            else if (block.opcode.includes('pi') || block.opcode.includes('e') || block.opcode.includes('phi')) category = 'Constants';
            else if (block.opcode.includes('hypotenuse') || block.opcode.includes('area') || block.opcode.includes('volume') || block.opcode.includes('vector') || block.opcode.includes('dotProduct') || block.opcode.includes('crossProduct') || block.opcode.includes('magnitude') || block.opcode.includes('cartesian') || block.opcode.includes('polar') || block.opcode.includes('coneVol') || block.opcode.includes('pyramidVol')) category = 'Geometry';
            else if (block.opcode.includes('complex')) category = 'Complex';
            else if (block.opcode.includes('matrix')) category = 'Matrix';
            else if (block.opcode.includes('bit') || block.opcode.includes('unsignedRShift')) category = '位运算';
            else if (block.opcode.includes('FPS')) category = 'FPS';
            blocks.push({ text: block.text, opcode: block.opcode, category: category });
        }
        return blocks;
    };

    EnhancedCalculatorExtension.prototype.startFPSMeasurement = function() {
        var self = this;
        var updateFPS = function() {
            var now = Date.now();
            var delta = now - self.lastFrameTime;
            if (delta > 0) {
                self.frameCount++;
                self.frameTimeHistory.push(delta);
                if (self.frameTimeHistory.length > self.fpsHistoryMaxLength) {
                    self.frameTimeHistory.shift();
                }
            }
            self.lastFrameTime = now;
            if (now - self.lastFPSUpdate >= 1000) {
                var recentFrameTimes = self.frameTimeHistory.slice(-Math.min(60, self.frameTimeHistory.length));
                if (recentFrameTimes.length > 0) {
                    var avgFrameTime = recentFrameTimes.reduce(function(a, b) { return a + b; }, 0) / recentFrameTimes.length;
                    self.currentFPS = Math.round(1000 / avgFrameTime * 10) / 10;
                    if (self.currentFPS > self.maxFPS) self.maxFPS = self.currentFPS;
                    if (self.currentFPS < self.minFPS) self.minFPS = self.currentFPS;
                    self.fpsHistory.push(self.currentFPS);
                    if (self.fpsHistory.length > self.fpsHistoryMaxLength) self.fpsHistory.shift();
                }
                self.frameCount = 0;
                self.lastFPSUpdate = now;
            }
            requestAnimationFrame(updateFPS);
        };
        requestAnimationFrame(updateFPS);
    };

    EnhancedCalculatorExtension.prototype.xVariable = function() {
        return 'x';
    };

    EnhancedCalculatorExtension.prototype.createFunctionGraph = function(args) {
        var expression = args.expression || 'sin(x)';
        var xMin = Number(args.xMin) || -10;
        var xMax = Number(args.xMax) || 10;
        var width = Number(args.width) || 600;
        var height = Number(args.height) || 400;
        
        if (xMin >= xMax) return "错误：x最小值必须小于x最大值";
        
        var points = generatePoints(expression, xMin, xMax, 0.05);
        if (points.length === 0) return "错误：无法生成图像点集，请检查函数表达式";
        
        var yMin = Infinity, yMax = -Infinity;
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            if (p.y < yMin) yMin = p.y;
            if (p.y > yMax) yMax = p.y;
        }
        
        var yRange = yMax - yMin;
        if (yRange > 0) {
            yMin -= yRange * 0.1;
            yMax += yRange * 0.1;
        } else {
            yMin = -10;
            yMax = 10;
        }
        
        var title = expression;
        if (title.length > 30) title = title.substring(0, 27) + '...';
        
        var element = createGraphElement(title, points, xMin, xMax, yMin, yMax, width, height);
        var offset = graphObjects.length * 30;
        element.style.left = (50 + offset) + 'px';
        element.style.top = (50 + offset) + 'px';
        element.style.right = 'auto';
        
        document.body.appendChild(element);
        graphObjects.push({ id: graphCounter++, element: element });
        
        return '图像已创建：' + title;
    };

    EnhancedCalculatorExtension.prototype.closeAllGraphs = function() {
        var count = graphObjects.length;
        for (var i = 0; i < graphObjects.length; i++) {
            var obj = graphObjects[i];
            if (obj.element && obj.element.remove) obj.element.remove();
        }
        graphObjects = [];
        return '已关闭' + count + '个函数图像';
    };

    EnhancedCalculatorExtension.prototype.getGraphCount = function() {
        return graphObjects.length;
    };

    // ===== 集合运算方法 =====
    EnhancedCalculatorExtension.prototype.setIntersection = function(args) { return setIntersection(args.setA, args.setB); };
    EnhancedCalculatorExtension.prototype.setUnion = function(args) { return setUnion(args.setA, args.setB); };
    EnhancedCalculatorExtension.prototype.setDifference = function(args) { return setDifference(args.setA, args.setB); };
    EnhancedCalculatorExtension.prototype.setSymmetricDifference = function(args) { return setSymmetricDifference(args.setA, args.setB); };
    EnhancedCalculatorExtension.prototype.isSubset = function(args) { return isSubset(args.setA, args.setB); };
    EnhancedCalculatorExtension.prototype.isProperSubset = function(args) { return isProperSubset(args.setA, args.setB); };
    EnhancedCalculatorExtension.prototype.setSize = function(args) { return setSize(args.set); };
    EnhancedCalculatorExtension.prototype.isEmptySet = function(args) { return isEmptySet(args.set); };
    EnhancedCalculatorExtension.prototype.setsEqual = function(args) { return setsEqual(args.setA, args.setB); };
    EnhancedCalculatorExtension.prototype.powerSet = function(args) { return powerSet(args.set); };
    EnhancedCalculatorExtension.prototype.cartesianProduct = function(args) { return cartesianProduct(args.setA, args.setB); };
    EnhancedCalculatorExtension.prototype.getSetElements = function(args) { return getSetElements(args.set); };

    // ===== 基础运算 =====
    EnhancedCalculatorExtension.prototype.add = function(args) { return addWithSymbol(args.a, args.b); };
    EnhancedCalculatorExtension.prototype.subtract = function(args) { return subtractWithSymbol(args.a, args.b); };
    EnhancedCalculatorExtension.prototype.multiply = function(args) { return multiplyWithSymbol(args.a, args.b); };
    EnhancedCalculatorExtension.prototype.divide = function(args) { return divideWithSymbol(args.a, args.b); };
    EnhancedCalculatorExtension.prototype.power = function(args) { 
        var base = args.base, exp = args.exponent;
        if (base === 'x' && !isNaN(Number(exp))) {
            var e = Number(exp);
            if (e === 0) return '1';
            if (e === 1) return 'x';
            if (e === 2) return 'x²';
            if (e === 3) return 'x³';
            return 'x^' + exp;
        }
        if (typeof base === 'string' && base.includes('x') && base !== 'x') {
            return base + '^' + exp;
        }
        var numBase = parseNumberOrFraction(base);
        if (isNaN(numBase)) return base + '^' + exp;
        return Math.pow(numBase, Number(exp));
    };
    EnhancedCalculatorExtension.prototype.sqrt = function(args) { 
        var x = args.x;
        if (x === 'x') return '√x';
        if (typeof x === 'string' && x.includes('x') && x !== 'x') return '√(' + x + ')';
        var num = parseNumberOrFraction(x);
        if (isNaN(num)) return '√(' + x + ')';
        if (num < 0) return NaN;
        return Math.sqrt(num);
    };
    EnhancedCalculatorExtension.prototype.cubeRoot = function(args) { 
        var x = args.x;
        if (x === 'x') return '∛x';
        if (typeof x === 'string' && x.includes('x') && x !== 'x') return '∛(' + x + ')';
        var num = parseNumberOrFraction(x);
        if (isNaN(num)) return '∛(' + x + ')';
        return Math.cbrt(num);
    };
    EnhancedCalculatorExtension.prototype.abs = function(args) { 
        var x = args.x;
        if (x === 'x') return '|x|';
        if (typeof x === 'string' && x.includes('x') && x !== 'x') return '|' + x + '|';
        var num = parseNumberOrFraction(x);
        if (isNaN(num)) return '|' + x + '|';
        return Math.abs(num);
    };
    EnhancedCalculatorExtension.prototype.round = function(args) { 
        var x = args.x;
        var num = parseNumberOrFraction(x);
        if (isNaN(num)) return x;
        return Math.round(num);
    };
    EnhancedCalculatorExtension.prototype.floor = function(args) { 
        var x = args.x;
        var num = parseNumberOrFraction(x);
        if (isNaN(num)) return x;
        return Math.floor(num);
    };
    EnhancedCalculatorExtension.prototype.ceil = function(args) { 
        var x = args.x;
        var num = parseNumberOrFraction(x);
        if (isNaN(num)) return x;
        return Math.ceil(num);
    };
    EnhancedCalculatorExtension.prototype.floorDownResult = function(args) { 
        var num = Number(args.num);
        if (isNaN(num)) return NaN;
        return Math.floor(num);
    };
    EnhancedCalculatorExtension.prototype.mod = function(args) { var a = Number(args.a), b = Number(args.b); if (b === 0) return NaN; return a % b; };
    EnhancedCalculatorExtension.prototype.oppositeNumber = function(args) { 
        var a = args.a;
        if (a === 'x') return '-x';
        if (typeof a === 'string' && a.includes('x') && a !== 'x') return '-(' + a + ')';
        var num = parseNumberOrFraction(a);
        if (isNaN(num)) return '-(' + a + ')';
        return -num;
    };
    EnhancedCalculatorExtension.prototype.solveEquation = function(args) { return Number(args.c) - Number(args.b); };
    EnhancedCalculatorExtension.prototype.factorExpression = function(args) { var a = Number(args.a), b = Number(args.b); return (a + b) + 'x'; };
    EnhancedCalculatorExtension.prototype.quadraticRoot = function(args) { return solveQuadraticEquation(Number(args.a), Number(args.b), Number(args.c)); };
    EnhancedCalculatorExtension.prototype.combination = function(args) {
        var n = Math.floor(Number(args.n)), r = Math.floor(Number(args.r));
        if (r > n) return 0; if (r === 0 || r === n) return 1;
        var result = 1; for (var i = 0; i < r; i++) result *= (n - i) / (i + 1);
        return Math.round(result);
    };
    EnhancedCalculatorExtension.prototype.permutation = function(args) {
        var n = Math.floor(Number(args.n)), r = Math.floor(Number(args.r));
        if (r > n) return 0;
        var result = 1; for (var i = 0; i < r; i++) result *= (n - i);
        return result;
    };

    // ===== 比较运算 =====
    EnhancedCalculatorExtension.prototype.greaterThan = function(args) { var a=parseNumberOrFraction(args.a), b=parseNumberOrFraction(args.b); if(isNaN(a)||isNaN(b)) return false; return a > b; };
    EnhancedCalculatorExtension.prototype.lessThan = function(args) { var a=parseNumberOrFraction(args.a), b=parseNumberOrFraction(args.b); if(isNaN(a)||isNaN(b)) return false; return a < b; };
    EnhancedCalculatorExtension.prototype.equals = function(args) { var a=parseNumberOrFraction(args.a), b=parseNumberOrFraction(args.b); if(isNaN(a)||isNaN(b)) return false; return Math.abs(a - b) < 0.0000000001; };
    EnhancedCalculatorExtension.prototype.notEquals = function(args) { var a=parseNumberOrFraction(args.a), b=parseNumberOrFraction(args.b); if(isNaN(a)||isNaN(b)) return true; return Math.abs(a - b) >= 0.0000000001; };
    EnhancedCalculatorExtension.prototype.greaterThanOrEquals = function(args) { var a=parseNumberOrFraction(args.a), b=parseNumberOrFraction(args.b); if(isNaN(a)||isNaN(b)) return false; return a >= b - 0.0000000001; };
    EnhancedCalculatorExtension.prototype.lessThanOrEquals = function(args) { var a=parseNumberOrFraction(args.a), b=parseNumberOrFraction(args.b); if(isNaN(a)||isNaN(b)) return false; return a <= b + 0.0000000001; };

    // ===== 百分比 =====
    EnhancedCalculatorExtension.prototype.percentageOf = function(args) { return Number(args.num) * Number(args.percent) / 100; };
    EnhancedCalculatorExtension.prototype.percentageIncrease = function(args) { return Number(args.original) * (1 + Number(args.percent) / 100); };
    EnhancedCalculatorExtension.prototype.percentageDecrease = function(args) { return Number(args.original) * (1 - Number(args.percent) / 100); };
    EnhancedCalculatorExtension.prototype.percentageDifference = function(args) {
        var a = Number(args.a), b = Number(args.b);
        if (a === 0 && b === 0) return 0;
        var avg = (a + b) / 2;
        if (avg === 0) return 100;
        return Math.abs(a - b) / avg * 100;
    };

    // ===== 数值处理 =====
    EnhancedCalculatorExtension.prototype.clamp = function(args) { return Math.min(Math.max(Number(args.num), Number(args.min)), Number(args.max)); };
    EnhancedCalculatorExtension.prototype.lerp = function(args) { return Number(args.a) + (Number(args.b) - Number(args.a)) * (Number(args.t) / 100); };
    EnhancedCalculatorExtension.prototype.map = function(args) {
        var num = Number(args.num), fl = Number(args.fromLow), fh = Number(args.fromHigh);
        var tl = Number(args.toLow), th = Number(args.toHigh);
        if (Math.abs(fh - fl) < 1e-10) return tl;
        return tl + (num - fl) / (fh - fl) * (th - tl);
    };
    EnhancedCalculatorExtension.prototype.roundTo = function(args) { var f = Math.pow(10, Math.floor(Number(args.decimal))); return Math.round(Number(args.num) * f) / f; };
    EnhancedCalculatorExtension.prototype.sign = function(args) { var n = Number(args.num); return n > 0 ? 1 : (n < 0 ? -1 : 0); };
    EnhancedCalculatorExtension.prototype.isBetween = function(args) { return Number(args.num) >= Number(args.min) && Number(args.num) <= Number(args.max); };
    EnhancedCalculatorExtension.prototype.isApproximately = function(args) { return Math.abs(Number(args.a) - Number(args.b)) <= Number(args.tolerance); };
    EnhancedCalculatorExtension.prototype.distance = function(args) { return Math.hypot(Number(args.x2) - Number(args.x1), Number(args.y2) - Number(args.y1)); };
    EnhancedCalculatorExtension.prototype.angle = function(args) { return Math.atan2(Number(args.y2) - Number(args.y1), Number(args.x2) - Number(args.x1)) * 180 / Math.PI; };

    // ===== 字符串 =====
    EnhancedCalculatorExtension.prototype.stringLength = function(args) { return (args.str || "").toString().length; };
    EnhancedCalculatorExtension.prototype.stringConcat = function(args) { return (args.str1 || "").toString() + (args.str2 || "").toString(); };
    EnhancedCalculatorExtension.prototype.stringToUpperCase = function(args) { return (args.str || "").toString().toUpperCase(); };
    EnhancedCalculatorExtension.prototype.stringToLowerCase = function(args) { return (args.str || "").toString().toLowerCase(); };
    EnhancedCalculatorExtension.prototype.stringReverse = function(args) { return (args.str || "").toString().split('').reverse().join(''); };
    EnhancedCalculatorExtension.prototype.stringTrim = function(args) { return (args.str || "").toString().trim(); };
    EnhancedCalculatorExtension.prototype.stringCharAt = function(args) { var s = (args.str || "").toString(), i = Math.floor(Number(args.index)) - 1; return i >= 0 && i < s.length ? s.charAt(i) : ""; };
    EnhancedCalculatorExtension.prototype.stringContains = function(args) { return (args.str || "").toString().includes((args.sub || "").toString()); };
    EnhancedCalculatorExtension.prototype.stringStartsWith = function(args) { return (args.str || "").toString().startsWith((args.sub || "").toString()); };
    EnhancedCalculatorExtension.prototype.stringEndsWith = function(args) { return (args.str || "").toString().endsWith((args.sub || "").toString()); };
    EnhancedCalculatorExtension.prototype.stringIndexOf = function(args) { var i = (args.str || "").toString().indexOf((args.sub || "").toString()); return i === -1 ? 0 : i + 1; };
    EnhancedCalculatorExtension.prototype.stringCount = function(args) {
        var s = (args.str || "").toString(), sub = (args.sub || "").toString();
        if (sub === "") return 0;
        var escaped = sub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return (s.match(new RegExp(escaped, 'g')) || []).length;
    };
    EnhancedCalculatorExtension.prototype.stringSlice = function(args) {
        var s = (args.str || "").toString();
        var start = Math.max(1, Math.min(Number(args.start), s.length));
        var end = Math.max(start, Math.min(Number(args.end), s.length));
        return s.substring(start - 1, end);
    };
    EnhancedCalculatorExtension.prototype.stringReplace = function(args) { return (args.str || "").toString().split((args.old || "").toString()).join((args.new || "").toString()); };
    EnhancedCalculatorExtension.prototype.stringIsEmpty = function(args) { return (args.str || "").toString().length === 0; };
    EnhancedCalculatorExtension.prototype.stringToNumber = function(args) { var n = Number((args.str || "").toString()); return isNaN(n) ? 0 : n; };
    EnhancedCalculatorExtension.prototype.numberToString = function(args) { return String(args.num !== undefined ? args.num : ""); };

    // ===== 随机 =====
    EnhancedCalculatorExtension.prototype.randomInt = function(args) { return Math.floor(Math.random() * (Math.floor(Number(args.max)) - Math.ceil(Number(args.min)) + 1)) + Math.ceil(Number(args.min)); };
    EnhancedCalculatorExtension.prototype.randomFloat = function(args) { return Math.random() * (Number(args.max) - Number(args.min)) + Number(args.min); };
    EnhancedCalculatorExtension.prototype.randomBoolean = function() { return Math.random() < 0.5; };
    EnhancedCalculatorExtension.prototype.randomChoice = function(args) { var list = (args.list || "").toString().split(',').map(function(s) { return s.trim(); }); return list.length ? list[Math.floor(Math.random() * list.length)] : ""; };

    // ===== 统计 =====
    EnhancedCalculatorExtension.prototype.averageOfList = function(args) { var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n); }); return l.length ? l.reduce(function(a,b){return a+b;},0)/l.length : 0; };
    EnhancedCalculatorExtension.prototype.sumOfList = function(args) { var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n); }); return l.reduce(function(a,b){return a+b;},0); };
    EnhancedCalculatorExtension.prototype.minOfList = function(args) { var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n); }); return l.length ? Math.min.apply(Math, l) : 0; };
    EnhancedCalculatorExtension.prototype.maxOfList = function(args) { var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n); }); return l.length ? Math.max.apply(Math, l) : 0; };
    EnhancedCalculatorExtension.prototype.standardDeviation = function(args) {
        var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n); });
        if (l.length < 2) return 0;
        var m = l.reduce(function(a,b){return a+b;},0)/l.length;
        return Math.sqrt(l.map(function(x){return Math.pow(x-m,2);}).reduce(function(a,b){return a+b;},0)/l.length);
    };
    EnhancedCalculatorExtension.prototype.variance = function(args) {
        var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n); });
        if (l.length < 2) return 0;
        var m = l.reduce(function(a,b){return a+b;},0)/l.length;
        return l.map(function(x){return Math.pow(x-m,2);}).reduce(function(a,b){return a+b;},0)/l.length;
    };
    EnhancedCalculatorExtension.prototype.median = function(args) {
        var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n); });
        if (!l.length) return 0;
        l.sort(function(a,b){return a-b;});
        var mid = Math.floor(l.length/2);
        return l.length % 2 === 0 ? (l[mid-1]+l[mid])/2 : l[mid];
    };
    EnhancedCalculatorExtension.prototype.mode = function(args) {
        var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n); });
        if (!l.length) return 0;
        var freq = {};
        var maxFreq = 0, mode = l[0];
        for (var i = 0; i < l.length; i++) {
            var n = l[i];
            freq[n] = (freq[n]||0)+1;
            if (freq[n] > maxFreq) { maxFreq = freq[n]; mode = n; }
        }
        return mode;
    };
    EnhancedCalculatorExtension.prototype.range = function(args) { var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n); }); return l.length ? Math.max.apply(Math, l) - Math.min.apply(Math, l) : 0; };
    EnhancedCalculatorExtension.prototype.sumOfSquares = function(args) { var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n); }); return l.reduce(function(s,n){return s+n*n;},0); };
    EnhancedCalculatorExtension.prototype.rootMeanSquare = function(args) { var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n); }); return l.length ? Math.sqrt(l.reduce(function(s,n){return s+n*n;},0)/l.length) : 0; };
    EnhancedCalculatorExtension.prototype.geometricMean = function(args) { var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n) && n>0; }); return l.length ? Math.pow(l.reduce(function(p,n){return p*n;},1), 1/l.length) : 0; };
    EnhancedCalculatorExtension.prototype.harmonicMean = function(args) { var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n) && n!==0; }); return l.length ? l.length / l.reduce(function(s,n){return s+1/n;},0) : 0; };
    EnhancedCalculatorExtension.prototype.quadraticMean = function(args) { var l = (args.list || "").toString().split(',').map(Number).filter(function(n) { return !isNaN(n); }); return l.length ? Math.sqrt(l.reduce(function(s,n){return s+n*n;},0)/l.length) : 0; };
    EnhancedCalculatorExtension.prototype.arithmeticSequence = function(args) { return Number(args.a1) + (Math.floor(Number(args.n)) - 1) * Number(args.d); };
    EnhancedCalculatorExtension.prototype.derivative = function(args) { var x = Number(args.a); return 3 * x * x; };
    EnhancedCalculatorExtension.prototype.partialDerivative = function(args) { return 2 * Number(args.x) * Math.pow(Number(args.y), 3); };
    EnhancedCalculatorExtension.prototype.differential = function(args) { var x = Number(args.x); return 2 * x; };

    // ===== 单位转换 =====
    EnhancedCalculatorExtension.prototype.celsiusToFahrenheit = function(args) { return Number(args.c) * 9/5 + 32; };
    EnhancedCalculatorExtension.prototype.fahrenheitToCelsius = function(args) { return (Number(args.f) - 32) * 5/9; };
    EnhancedCalculatorExtension.prototype.kmToMiles = function(args) { return Number(args.km) * 0.621371; };
    EnhancedCalculatorExtension.prototype.milesToKm = function(args) { return Number(args.miles) * 1.60934; };
    EnhancedCalculatorExtension.prototype.kgToPounds = function(args) { return Number(args.kg) * 2.20462; };
    EnhancedCalculatorExtension.prototype.poundsToKg = function(args) { return Number(args.lbs) * 0.453592; };
    EnhancedCalculatorExtension.prototype.m2ft = function(args) { return Number(args.m) * 3.28084; };
    EnhancedCalculatorExtension.prototype.ft2m = function(args) { return Number(args.ft) / 3.28084; };
    EnhancedCalculatorExtension.prototype.L2gal = function(args) { return Number(args.L) * 0.264172; };
    EnhancedCalculatorExtension.prototype.gal2L = function(args) { return Number(args.gal) / 0.264172; };
    EnhancedCalculatorExtension.prototype.cm2inch = function(args) { return Number(args.cm) / 2.54; };
    EnhancedCalculatorExtension.prototype.inch2cm = function(args) { return Number(args.inch) * 2.54; };
    EnhancedCalculatorExtension.prototype.ms2kmh = function(args) { return Number(args.ms) * 3.6; };
    EnhancedCalculatorExtension.prototype.kmh2ms = function(args) { return Number(args.kmh) / 3.6; };

    // ===== 数论 =====
    EnhancedCalculatorExtension.prototype.factorial = function(args) { var n = Math.floor(Number(args.n)); if (n < 0) return NaN; var r = 1; for (var i=2;i<=n;i++) r*=i; return r; };
    EnhancedCalculatorExtension.prototype.fibonacci = function(args) { var n = Math.floor(Number(args.n)); if (n<0) return NaN; if (n<=1) return n; var a=0,b=1; for(var i=2;i<=n;i++){ var c=a+b; a=b; b=c; } return b; };
    EnhancedCalculatorExtension.prototype.isPrime = function(args) { var n = Math.abs(Math.floor(Number(args.n))); if (n<=1) return false; if (n<=3) return true; if (n%2===0||n%3===0) return false; for(var i=5;i*i<=n;i+=6) if(n%i===0||n%(i+2)===0) return false; return true; };
    EnhancedCalculatorExtension.prototype.primeFactors = function(args) { var n = Math.abs(Math.floor(Number(args.n))); if (n<=1) return "1"; var f=[]; for(var d=2;d*d<=n;d++){while(n%d===0){f.push(d);n/=d;}} if(n>1)f.push(n); return f.join("×"); };
    EnhancedCalculatorExtension.prototype.gcd = function(args) { return gcd(Number(args.a), Number(args.b)); };
    EnhancedCalculatorExtension.prototype.lcm = function(args) { var a=Math.abs(Number(args.a)), b=Math.abs(Number(args.b)); if(a===0||b===0) return 0; return (a*b)/gcd(a,b); };
    EnhancedCalculatorExtension.prototype.isEven = function(args) { return Math.floor(Number(args.n)) % 2 === 0; };
    EnhancedCalculatorExtension.prototype.isOdd = function(args) { return Math.floor(Number(args.n)) % 2 !== 0; };
    EnhancedCalculatorExtension.prototype.isDivisible = function(args) { var a=Math.floor(Number(args.a)), b=Math.floor(Number(args.b)); return b!==0 && a%b===0; };
    EnhancedCalculatorExtension.prototype.digitSum = function(args) {
        var n = Math.abs(Math.floor(Number(args.n)));
        if (isNaN(n)) return NaN;
        return String(n).split('').reduce(function(s, d) { return s + Number(d); }, 0);
    };
    EnhancedCalculatorExtension.prototype.isPerfect = function(args) {
        var n = Math.floor(Number(args.n));
        if (n < 2) return false;
        var sum = 1;
        for (var i = 2; i * i <= n; i++) {
            if (n % i === 0) { sum += i; if (i !== n / i) sum += n / i; }
        }
        return sum === n;
    };
    EnhancedCalculatorExtension.prototype.isArmstrong = function(args) {
        var n = Math.abs(Math.floor(Number(args.n)));
        if (isNaN(n)) return false;
        var digits = String(n).split(''), len = digits.length;
        return digits.reduce(function(s, d) { return s + Math.pow(Number(d), len); }, 0) === n;
    };
    EnhancedCalculatorExtension.prototype.toRoman = function(args) {
        var n = Math.floor(Number(args.n));
        if (isNaN(n) || n < 1 || n > 3999) return 'Error';
        var map = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
        var r = '';
        for (var key in map) {
            var v = map[key];
            while (n >= v) { r += key; n -= v; }
        }
        return r;
    };

    // ===== 三角函数 =====
    EnhancedCalculatorExtension.prototype.trigonometry = function(args) {
        var func = args.FUNC, x = parseNumberOrFraction(args.x);
        if (isNaN(x)) return NaN;
        if (this.angleMode === 'degrees') {
            var rad = x * Math.PI / 180;
            switch(func) {
                case 'sin': return Math.sin(rad);
                case 'cos': return Math.cos(rad);
                case 'tan': return Math.tan(rad);
                case 'asin': return x<-1||x>1 ? NaN : Math.asin(x)*180/Math.PI;
                case 'acos': return x<-1||x>1 ? NaN : Math.acos(x)*180/Math.PI;
                case 'atan': return Math.atan(x)*180/Math.PI;
            }
        } else {
            switch(func) {
                case 'sin': return Math.sin(x);
                case 'cos': return Math.cos(x);
                case 'tan': return Math.tan(x);
                case 'asin': return x<-1||x>1 ? NaN : Math.asin(x);
                case 'acos': return x<-1||x>1 ? NaN : Math.acos(x);
                case 'atan': return Math.atan(x);
            }
        }
        return 0;
    };
    EnhancedCalculatorExtension.prototype.sin = function(args) { var x=Number(args.x); if(this.angleMode==='degrees') x*=Math.PI/180; return Math.sin(x); };
    EnhancedCalculatorExtension.prototype.cos = function(args) { var x=Number(args.x); if(this.angleMode==='degrees') x*=Math.PI/180; return Math.cos(x); };
    EnhancedCalculatorExtension.prototype.tan = function(args) { var x=Number(args.x); if(this.angleMode==='degrees') x*=Math.PI/180; return Math.tan(x); };
    EnhancedCalculatorExtension.prototype.asin = function(args) { var x=Number(args.x); if(x<-1||x>1) return NaN; var r=Math.asin(x); return this.angleMode==='degrees' ? r*180/Math.PI : r; };
    EnhancedCalculatorExtension.prototype.acos = function(args) { var x=Number(args.x); if(x<-1||x>1) return NaN; var r=Math.acos(x); return this.angleMode==='degrees' ? r*180/Math.PI : r; };
    EnhancedCalculatorExtension.prototype.atan = function(args) { var r=Math.atan(Number(args.x)); return this.angleMode==='degrees' ? r*180/Math.PI : r; };
    EnhancedCalculatorExtension.prototype.atan2 = function(args) { var r=Math.atan2(Number(args.y), Number(args.x)); return this.angleMode==='degrees' ? r*180/Math.PI : r; };

    // ===== 对数和指数 =====
    EnhancedCalculatorExtension.prototype.ln = function(args) { var x=Number(args.x); return x<=0 ? NaN : Math.log(x); };
    EnhancedCalculatorExtension.prototype.log10 = function(args) { var x=Number(args.x); return x<=0 ? NaN : Math.log10(x); };
    EnhancedCalculatorExtension.prototype.log2 = function(args) { var x=Number(args.x); return x<=0 ? NaN : Math.log2(x); };
    EnhancedCalculatorExtension.prototype.exp = function(args) { return Math.exp(Number(args.x)); };
    EnhancedCalculatorExtension.prototype.logbase = function(args) {
        var x = Number(args.x), base = Number(args.base);
        if (x <= 0 || base <= 0 || base === 1) return NaN;
        return Math.log(x) / Math.log(base);
    };
    EnhancedCalculatorExtension.prototype.nRoot = function(args) {
        var x = Number(args.x), n = Number(args.n);
        if (n === 0) return NaN;
        if (x < 0 && n % 2 === 0) return NaN;
        return x < 0 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n);
    };

    // ===== 角度弧度互转 =====
    EnhancedCalculatorExtension.prototype.deg2rad = function(args) { return Number(args.deg) * Math.PI / 180; };
    EnhancedCalculatorExtension.prototype.rad2deg = function(args) { return Number(args.rad) * 180 / Math.PI; };

    // ===== 双曲函数 =====
    EnhancedCalculatorExtension.prototype.sinh = function(args) { return Math.sinh(Number(args.x)); };
    EnhancedCalculatorExtension.prototype.cosh = function(args) { return Math.cosh(Number(args.x)); };
    EnhancedCalculatorExtension.prototype.tanh = function(args) { return Math.tanh(Number(args.x)); };

    // ===== 常数 =====
    EnhancedCalculatorExtension.prototype.pi = function() { return Math.PI; };
    EnhancedCalculatorExtension.prototype.e = function() { return Math.E; };
    EnhancedCalculatorExtension.prototype.phi = function() { return (1+Math.sqrt(5))/2; };
    EnhancedCalculatorExtension.prototype.sqrt2 = function() { return Math.SQRT2; };

    // ===== 几何 =====
    EnhancedCalculatorExtension.prototype.hypotenuse = function(args) { return Math.hypot(Number(args.a), Number(args.b)); };
    EnhancedCalculatorExtension.prototype.areaCircle = function(args) { return Math.PI * Number(args.r) * Number(args.r); };
    EnhancedCalculatorExtension.prototype.circumference = function(args) { return 2 * Math.PI * Number(args.r); };
    EnhancedCalculatorExtension.prototype.areaTriangle = function(args) { return 0.5 * Number(args.b) * Number(args.h); };
    EnhancedCalculatorExtension.prototype.areaRectangle = function(args) { return Number(args.l) * Number(args.w); };
    EnhancedCalculatorExtension.prototype.volumeCube = function(args) { return Math.pow(Number(args.s), 3); };
    EnhancedCalculatorExtension.prototype.volumeSphere = function(args) { return (4/3) * Math.PI * Math.pow(Number(args.r), 3); };
    EnhancedCalculatorExtension.prototype.volumeCylinder = function(args) { return Math.PI * Math.pow(Number(args.r), 2) * Number(args.h); };
    EnhancedCalculatorExtension.prototype.vectorAdd = function(args) { return '(' + (Number(args.a1)+Number(args.b1)) + ',' + (Number(args.a2)+Number(args.b2)) + ')'; };
    EnhancedCalculatorExtension.prototype.dotProduct = function(args) { return Number(args.x1) * Number(args.x2) + Number(args.y1) * Number(args.y2); };
    EnhancedCalculatorExtension.prototype.crossProduct2D = function(args) { return Number(args.x1) * Number(args.y2) - Number(args.y1) * Number(args.x2); };
    EnhancedCalculatorExtension.prototype.magnitude = function(args) { var x = Number(args.x), y = Number(args.y); return Math.sqrt(x * x + y * y); };
    EnhancedCalculatorExtension.prototype.cartesian2Polar = function(args) {
        var x = Number(args.x), y = Number(args.y);
        var r = Math.sqrt(x * x + y * y);
        var theta = Math.atan2(y, x);
        return 'r=' + r.toFixed(4) + ',θ=' + theta.toFixed(4) + 'rad';
    };
    EnhancedCalculatorExtension.prototype.polar2Cartesian = function(args) {
        var r = Number(args.r), theta = Number(args.theta);
        var x = r * Math.cos(theta), y = r * Math.sin(theta);
        return 'x=' + x.toFixed(4) + ',y=' + y.toFixed(4);
    };
    EnhancedCalculatorExtension.prototype.coneVol = function(args) { return (1/3) * Math.PI * Number(args.r) * Number(args.r) * Number(args.h); };
    EnhancedCalculatorExtension.prototype.pyramidVol = function(args) { return (1/3) * Number(args.b) * Number(args.h); };

    // ===== 复数 =====
    EnhancedCalculatorExtension.prototype.complexAdd = function(args) { var c1=parseComplex(args.c1), c2=parseComplex(args.c2); if(!c1||!c2) return "Error"; return complexToString({real:c1.real+c2.real, imag:c1.imag+c2.imag}); };
    EnhancedCalculatorExtension.prototype.complexSubtract = function(args) { var c1=parseComplex(args.c1), c2=parseComplex(args.c2); if(!c1||!c2) return "Error"; return complexToString({real:c1.real-c2.real, imag:c1.imag-c2.imag}); };
    EnhancedCalculatorExtension.prototype.complexMultiply = function(args) { var c1=parseComplex(args.c1), c2=parseComplex(args.c2); if(!c1||!c2) return "Error"; return complexToString({real:c1.real*c2.real-c1.imag*c2.imag, imag:c1.real*c2.imag+c1.imag*c2.real}); };
    EnhancedCalculatorExtension.prototype.complexDivide = function(args) {
        var c1=parseComplex(args.c1), c2=parseComplex(args.c2);
        if(!c1||!c2) return "Error";
        var denom=c2.real*c2.real+c2.imag*c2.imag;
        if(Math.abs(denom)<1e-10) return "Error:除数不能为零";
        return complexToString({real:(c1.real*c2.real+c1.imag*c2.imag)/denom, imag:(c1.imag*c2.real-c1.real*c2.imag)/denom});
    };
    EnhancedCalculatorExtension.prototype.complexConjugate = function(args) { var c=parseComplex(args.c); return c ? complexToString({real:c.real, imag:-c.imag}) : "Error"; };
    EnhancedCalculatorExtension.prototype.complexModulus = function(args) { var c=parseComplex(args.c); return c ? Math.hypot(c.real, c.imag) : "Error"; };

    // ===== 矩阵 =====
    EnhancedCalculatorExtension.prototype.matrixAdd = function(args) { var m1=parseMatrix(args.m1), m2=parseMatrix(args.m2); if(!m1||!m2) return "Error"; if(m1.length!==m2.length||m1[0].length!==m2[0].length) return "Error:维度不匹配"; return matrixToString(m1.map(function(r,i){return r.map(function(v,j){return v+m2[i][j];});})); };
    EnhancedCalculatorExtension.prototype.matrixMultiply = function(args) {
        var m1=parseMatrix(args.m1), m2=parseMatrix(args.m2);
        if(!m1||!m2) return "Error";
        if(m1[0].length!==m2.length) return "Error:维度不匹配";
        var result=Array(m1.length).fill().map(function(){return Array(m2[0].length).fill(0);});
        for(var i=0;i<m1.length;i++) for(var j=0;j<m2[0].length;j++) for(var k=0;k<m1[0].length;k++) result[i][j]+=m1[i][k]*m2[k][j];
        return matrixToString(result);
    };
    EnhancedCalculatorExtension.prototype.matrixScalarMultiply = function(args) { var m=parseMatrix(args.m); if(!m) return "Error"; var k=Number(args.k); return matrixToString(m.map(function(r){return r.map(function(v){return v*k;});})); };
    EnhancedCalculatorExtension.prototype.matrixTranspose = function(args) { var m=parseMatrix(args.m); if(!m) return "Error"; return matrixToString(Array(m[0].length).fill().map(function(_,j){return Array(m.length).fill().map(function(_,i){return m[i][j];});})); };
    EnhancedCalculatorExtension.prototype.matrixDeterminant = function(args) {
        var m=parseMatrix(args.m);
        if(!m) return "Error";
        if(m.length!==m[0].length) return "Error:不是方阵";
        if(m.length===2) return m[0][0]*m[1][1]-m[0][1]*m[1][0];
        if(m.length===3) {
            var a=m[0][0], b=m[0][1], c=m[0][2];
            var d=m[1][0], e=m[1][1], f=m[1][2];
            var g=m[2][0], h=m[2][1], i=m[2][2];
            return a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);
        }
        return "Error:仅支持2x2和3x3矩阵";
    };

    // ===== FPS =====
    EnhancedCalculatorExtension.prototype.getFPS = function() { return this.currentFPS; };
    EnhancedCalculatorExtension.prototype.getMinFPS = function() { return this.minFPS===Infinity ? 0 : this.minFPS; };
    EnhancedCalculatorExtension.prototype.getMaxFPS = function() { return this.maxFPS; };
    EnhancedCalculatorExtension.prototype.getAverageFPS = function() { return this.fpsHistory.length ? Math.round(this.fpsHistory.reduce(function(a,b){return a+b;},0)/this.fpsHistory.length*10)/10 : 0; };
    EnhancedCalculatorExtension.prototype.getFrameTime = function() { return this.frameTimeHistory.length ? Math.round(this.frameTimeHistory[this.frameTimeHistory.length-1]*10)/10 : 0; };
    EnhancedCalculatorExtension.prototype.resetFPSStats = function() { this.minFPS=Infinity; this.maxFPS=0; this.fpsHistory=[]; this.frameTimeHistory=[]; this.currentFPS=0; };
    EnhancedCalculatorExtension.prototype.isHighFPS = function(args) { return this.currentFPS > Number(args.threshold); };
    EnhancedCalculatorExtension.prototype.isLowFPS = function(args) { return this.currentFPS < Number(args.threshold); };
    EnhancedCalculatorExtension.prototype.getFPSStatus = function() { if(this.currentFPS>=60) return "流畅"; if(this.currentFPS>=30) return "一般"; if(this.currentFPS>=15) return "卡顿"; return this.currentFPS>0 ? "严重卡顿" : "测量中..."; };

    // ===== 信息 =====
    EnhancedCalculatorExtension.prototype.detectEditor = function() { return this.editorInfo; };
    EnhancedCalculatorExtension.prototype.authorInfo = function() { return "https://space.bilibili.com/3546949919705808"; };

    // ===== 搜索相关（隐藏） =====
    EnhancedCalculatorExtension.prototype.searchBlocks = function(args) { var q = args.query.toString().toLowerCase().trim(); if (q.length < 1) return '请输入关键词'; return '找到0个积木'; };
    EnhancedCalculatorExtension.prototype.getSearchResultCount = function() { return 0; };
    EnhancedCalculatorExtension.prototype.getSearchResultAt = function() { return ''; };
    EnhancedCalculatorExtension.prototype.toggleSearchPanel = function() {};
    EnhancedCalculatorExtension.prototype.openSearchPanel = function() {};
    EnhancedCalculatorExtension.prototype.clearSearch = function() {};

    // ===== 位运算 =====
    EnhancedCalculatorExtension.prototype.bitAND = function(args) { return Math.floor(Number(args.a)) & Math.floor(Number(args.b)); };
    EnhancedCalculatorExtension.prototype.bitOR = function(args) { return Math.floor(Number(args.a)) | Math.floor(Number(args.b)); };
    EnhancedCalculatorExtension.prototype.bitXOR = function(args) { return Math.floor(Number(args.a)) ^ Math.floor(Number(args.b)); };
    EnhancedCalculatorExtension.prototype.bitNOT = function(args) { return ~Math.floor(Number(args.n)); };
    EnhancedCalculatorExtension.prototype.bitLShift = function(args) { return Math.floor(Number(args.n)) << Math.floor(Number(args.k)); };
    EnhancedCalculatorExtension.prototype.bitRShift = function(args) { return Math.floor(Number(args.n)) >> Math.floor(Number(args.k)); };
    EnhancedCalculatorExtension.prototype.unsignedRShift = function(args) { return Math.floor(Number(args.n)) >>> Math.floor(Number(args.k)); };

    // ===== 进制转换 =====
    EnhancedCalculatorExtension.prototype.toBin = function(args) { var n = Math.floor(Number(args.n)); if (isNaN(n) || n < 0) return NaN; return '0b' + n.toString(2); };
    EnhancedCalculatorExtension.prototype.toHex = function(args) { var n = Math.floor(Number(args.n)); if (isNaN(n) || n < 0) return NaN; return '0x' + n.toString(16).toUpperCase(); };
    EnhancedCalculatorExtension.prototype.toOct = function(args) { var n = Math.floor(Number(args.n)); if (isNaN(n) || n < 0) return NaN; return '0o' + n.toString(8); };
    EnhancedCalculatorExtension.prototype.fromBin = function(args) { var s = String(args.bin).replace(/^0b/i, ''); var n = parseInt(s, 2); return isNaN(n) ? NaN : n; };
    EnhancedCalculatorExtension.prototype.fromHex = function(args) { var s = String(args.hex).replace(/^0x/i, ''); var n = parseInt(s, 16); return isNaN(n) ? NaN : n; };
    EnhancedCalculatorExtension.prototype.fromOct = function(args) { var s = String(args.oct).replace(/^0o/i, ''); var n = parseInt(s, 8); return isNaN(n) ? NaN : n; };

    EnhancedCalculatorExtension.prototype.getInfo = function() {
        var icon = makeIconURI();
        return {
            id: 'enhancedcalculator',
            name: '计算器 v1.0.3',
            color1: '#007bff',
            color2: '#0056b3',
            menuIconURI: icon,
            blockIconURI: icon,
            blocks: [
                { blockType: 'label', text: '═══════x值═══════' },
                { opcode: 'xVariable', blockType: B.REPORTER, text: 'x' },
                
                { blockType: 'label', text: '═══════归零映射═══════' },
                { opcode: 'xValue', blockType: B.REPORTER, text: '([num])↓', arguments: { num: { type: A.NUMBER, defaultValue: 0 } } },
                
                { blockType: 'label', text: '═══════无知数═══════' },
                { opcode: 'unknownZeroDivZero', blockType: B.REPORTER, text: 'Zero/Zero' },
                { opcode: 'unknownInfMinusInf', blockType: B.REPORTER, text: 'Inf-Inf' },
                { opcode: 'unknownZeroTimesInf', blockType: B.REPORTER, text: 'Zero*Inf' },
                { opcode: 'unknownZeroPowZero', blockType: B.REPORTER, text: 'Zero^Zero' },
                { opcode: 'unknownInfDivInf', blockType: B.REPORTER, text: 'Inf/Inf' },
                { opcode: 'unknownOnePowInf', blockType: B.REPORTER, text: 'One^Inf' },
                { opcode: 'unknownInfPowZero', blockType: B.REPORTER, text: 'Inf^Zero' },
                
                { blockType: 'label', text: '═══════SetTheory集合论═══════' },
                { opcode: 'isInSet', blockType: B.BOOLEAN, text: '[value]∈[setType]?', arguments: { value: { type: A.STRING, defaultValue: '5' }, setType: { type: A.STRING, menu: 'SET_TYPES' } } },
                { opcode: 'isNotInSet', blockType: B.BOOLEAN, text: '[value]∉[setType]?', arguments: { value: { type: A.STRING, defaultValue: '5' }, setType: { type: A.STRING, menu: 'SET_TYPES' } } },
                { opcode: 'setN', blockType: B.REPORTER, text: '自然数集N' },
                { opcode: 'setZ', blockType: B.REPORTER, text: '整数集Z' },
                { opcode: 'setQ', blockType: B.REPORTER, text: '有理数集Q' },
                { opcode: 'setR', blockType: B.REPORTER, text: '实数集R' },
                { opcode: 'setC', blockType: B.REPORTER, text: '复数集C' },
                { opcode: 'setK', blockType: B.REPORTER, text: '有知数K' },
                { opcode: 'setU', blockType: B.REPORTER, text: '无知数U' },
                { opcode: 'setA', blockType: B.REPORTER, text: '全知数A' },
                { opcode: 'setIntersection', blockType: B.REPORTER, text: '{[setA]}∩{[setB]}', arguments: { setA: { type: A.STRING, defaultValue: '1,2,3' }, setB: { type: A.STRING, defaultValue: '2,3,4' } } },
                { opcode: 'setUnion', blockType: B.REPORTER, text: '{[setA]}∪{[setB]}', arguments: { setA: { type: A.STRING, defaultValue: '1,2,3' }, setB: { type: A.STRING, defaultValue: '3,4,5' } } },
                { opcode: 'setDifference', blockType: B.REPORTER, text: '{[setA]}-{[setB]}', arguments: { setA: { type: A.STRING, defaultValue: '1,2,3,4' }, setB: { type: A.STRING, defaultValue: '2,4' } } },
                { opcode: 'setSymmetricDifference', blockType: B.REPORTER, text: '{[setA]}Δ{[setB]}', arguments: { setA: { type: A.STRING, defaultValue: '1,2,3' }, setB: { type: A.STRING, defaultValue: '3,4,5' } } },
                { opcode: 'isSubset', blockType: B.BOOLEAN, text: '{[setA]}⊆{[setB]}?', arguments: { setA: { type: A.STRING, defaultValue: '1,2' }, setB: { type: A.STRING, defaultValue: '1,2,3' } } },
                { opcode: 'isProperSubset', blockType: B.BOOLEAN, text: '{[setA]}⊂{[setB]}?', arguments: { setA: { type: A.STRING, defaultValue: '1,2' }, setB: { type: A.STRING, defaultValue: '1,2,3' } } },
                { opcode: 'setSize', blockType: B.REPORTER, text: '|{[set]}|', arguments: { set: { type: A.STRING, defaultValue: '1,2,3,4,5' } } },
                { opcode: 'isEmptySet', blockType: B.BOOLEAN, text: '{[set]}=∅?', arguments: { set: { type: A.STRING, defaultValue: '' } } },
                { opcode: 'setsEqual', blockType: B.BOOLEAN, text: '{[setA]}={[setB]}?', arguments: { setA: { type: A.STRING, defaultValue: '1,2,3' }, setB: { type: A.STRING, defaultValue: '3,2,1' } } },
                { opcode: 'powerSet', blockType: B.REPORTER, text: 'P({[set]})', arguments: { set: { type: A.STRING, defaultValue: '1,2,3' } } },
                { opcode: 'cartesianProduct', blockType: B.REPORTER, text: '{[setA]}×{[setB]}', arguments: { setA: { type: A.STRING, defaultValue: '1,2' }, setB: { type: A.STRING, defaultValue: 'a,b' } } },
                { opcode: 'getSetElements', blockType: B.REPORTER, text: 'elements of {[set]}', arguments: { set: { type: A.STRING, defaultValue: '1,2,3,4,5' } } },
                
                { blockType: 'label', text: '═══════FunctionGraph═══════' },
                { opcode: 'createFunctionGraph', blockType: B.REPORTER, text: '创建图像y=[expression] x从[xMin]到[xMax] 宽[width]高[height]', arguments: { expression: { type: A.STRING, defaultValue: 'sin(x)' }, xMin: { type: A.NUMBER, defaultValue: -10 }, xMax: { type: A.NUMBER, defaultValue: 10 }, width: { type: A.NUMBER, defaultValue: 600 }, height: { type: A.NUMBER, defaultValue: 400 } } },
                { opcode: 'closeAllGraphs', blockType: B.REPORTER, text: '关闭所有图像' },
                { opcode: 'getGraphCount', blockType: B.REPORTER, text: '图像数量' },
                
                { blockType: 'label', text: '═══════BasicOperations═══════' },
                { opcode: 'add', blockType: B.REPORTER, text: '[a]+[b]', arguments: { a: { type: A.STRING, defaultValue: '1/2' }, b: { type: A.STRING, defaultValue: '1/3' } } },
                { opcode: 'subtract', blockType: B.REPORTER, text: '[a]-[b]', arguments: { a: { type: A.STRING, defaultValue: '1/2' }, b: { type: A.STRING, defaultValue: '1/3' } } },
                { opcode: 'multiply', blockType: B.REPORTER, text: '[a]×[b]', arguments: { a: { type: A.STRING, defaultValue: '7/12' }, b: { type: A.STRING, defaultValue: '6/21' } } },
                { opcode: 'divide', blockType: B.REPORTER, text: '[a]÷[b]', arguments: { a: { type: A.STRING, defaultValue: '7/12' }, b: { type: A.STRING, defaultValue: '21/6' } } },
                { opcode: 'power', blockType: B.REPORTER, text: '[base]^[exponent]', arguments: { base: { type: A.STRING, defaultValue: '2' }, exponent: { type: A.NUMBER, defaultValue: 3 } } },
                { opcode: 'sqrt', blockType: B.REPORTER, text: '√[x]', arguments: { x: { type: A.STRING, defaultValue: '9' } } },
                { opcode: 'cubeRoot', blockType: B.REPORTER, text: '³√[x]', arguments: { x: { type: A.STRING, defaultValue: '27' } } },
                { opcode: 'abs', blockType: B.REPORTER, text: '|[x]|', arguments: { x: { type: A.STRING, defaultValue: '-5' } } },
                { opcode: 'round', blockType: B.REPORTER, text: 'round([x])', arguments: { x: { type: A.STRING, defaultValue: '4.5' } } },
                { opcode: 'floor', blockType: B.REPORTER, text: 'floor([x])', arguments: { x: { type: A.STRING, defaultValue: '4.9' } } },
                { opcode: 'ceil', blockType: B.REPORTER, text: 'ceil([x])', arguments: { x: { type: A.STRING, defaultValue: '4.2' } } },
                { opcode: 'floorDownResult', blockType: B.REPORTER, text: '([num])↓', arguments: { num: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'mod', blockType: B.REPORTER, text: '[a]mod[b]', arguments: { a: { type: A.NUMBER, defaultValue: 10 }, b: { type: A.NUMBER, defaultValue: 3 } } },
                { opcode: 'oppositeNumber', blockType: B.REPORTER, text: 'neg([a])', arguments: { a: { type: A.STRING, defaultValue: '5' } } },
                { opcode: 'solveEquation', blockType: B.REPORTER, text: 'solve(x=[c]-[b])', arguments: { b: { type: A.NUMBER, defaultValue: 3 }, c: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'factorExpression', blockType: B.REPORTER, text: 'factor([a]x+[b]x)', arguments: { a: { type: A.NUMBER, defaultValue: 3 }, b: { type: A.NUMBER, defaultValue: 5 } } },
                { opcode: 'quadraticRoot', blockType: B.REPORTER, text: 'quadratic([a],[b],[c])', arguments: { a: { type: A.NUMBER, defaultValue: 1 }, b: { type: A.NUMBER, defaultValue: -5 }, c: { type: A.NUMBER, defaultValue: 6 } } },
                { opcode: 'combination', blockType: B.REPORTER, text: 'C[n],[r]', arguments: { n: { type: A.NUMBER, defaultValue: 10 }, r: { type: A.NUMBER, defaultValue: 3 } } },
                { opcode: 'permutation', blockType: B.REPORTER, text: 'P[n],[r]', arguments: { n: { type: A.NUMBER, defaultValue: 10 }, r: { type: A.NUMBER, defaultValue: 3 } } },
                
                { blockType: 'label', text: '═══════Comparison═══════' },
                { opcode: 'greaterThan', blockType: B.BOOLEAN, text: '[a]>[b]', arguments: { a: { type: A.STRING, defaultValue: '1/2' }, b: { type: A.STRING, defaultValue: '1/3' } } },
                { opcode: 'lessThan', blockType: B.BOOLEAN, text: '[a]<[b]', arguments: { a: { type: A.STRING, defaultValue: '1/3' }, b: { type: A.STRING, defaultValue: '1/2' } } },
                { opcode: 'equals', blockType: B.BOOLEAN, text: '[a]=[b]', arguments: { a: { type: A.STRING, defaultValue: '1/2' }, b: { type: A.STRING, defaultValue: '0.5' } } },
                { opcode: 'notEquals', blockType: B.BOOLEAN, text: '[a]≠[b]', arguments: { a: { type: A.STRING, defaultValue: '1/2' }, b: { type: A.STRING, defaultValue: '1/3' } } },
                { opcode: 'greaterThanOrEquals', blockType: B.BOOLEAN, text: '[a]≥[b]', arguments: { a: { type: A.STRING, defaultValue: '1/2' }, b: { type: A.STRING, defaultValue: '1/2' } } },
                { opcode: 'lessThanOrEquals', blockType: B.BOOLEAN, text: '[a]≤[b]', arguments: { a: { type: A.STRING, defaultValue: '1/3' }, b: { type: A.STRING, defaultValue: '1/2' } } },
                
                { blockType: 'label', text: '═══════Percentage═══════' },
                { opcode: 'percentageOf', blockType: B.REPORTER, text: '[num]×[percent]%', arguments: { num: { type: A.NUMBER, defaultValue: 100 }, percent: { type: A.NUMBER, defaultValue: 50 } } },
                { opcode: 'percentageIncrease', blockType: B.REPORTER, text: '[original]×(1+[percent]%)', arguments: { original: { type: A.NUMBER, defaultValue: 100 }, percent: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'percentageDecrease', blockType: B.REPORTER, text: '[original]×(1-[percent]%)', arguments: { original: { type: A.NUMBER, defaultValue: 100 }, percent: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'percentageDifference', blockType: B.REPORTER, text: '[a]vs[b]%diff', arguments: { a: { type: A.NUMBER, defaultValue: 50 }, b: { type: A.NUMBER, defaultValue: 75 } } },
                
                { blockType: 'label', text: '═══════数值处理═══════' },
                { opcode: 'clamp', blockType: B.REPORTER, text: 'clamp([num],[min],[max])', arguments: { num: { type: A.NUMBER, defaultValue: 5 }, min: { type: A.NUMBER, defaultValue: 1 }, max: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'lerp', blockType: B.REPORTER, text: 'lerp([a],[b],[t]%)', arguments: { a: { type: A.NUMBER, defaultValue: 0 }, b: { type: A.NUMBER, defaultValue: 100 }, t: { type: A.NUMBER, defaultValue: 50 } } },
                { opcode: 'map', blockType: B.REPORTER, text: 'map([num],[fromLow],[fromHigh],[toLow],[toHigh])', arguments: { num: { type: A.NUMBER, defaultValue: 5 }, fromLow: { type: A.NUMBER, defaultValue: 0 }, fromHigh: { type: A.NUMBER, defaultValue: 10 }, toLow: { type: A.NUMBER, defaultValue: 0 }, toHigh: { type: A.NUMBER, defaultValue: 100 } } },
                { opcode: 'roundTo', blockType: B.REPORTER, text: 'roundTo([num],[decimal])', arguments: { num: { type: A.NUMBER, defaultValue: 3.14159 }, decimal: { type: A.NUMBER, defaultValue: 2 } } },
                { opcode: 'sign', blockType: B.REPORTER, text: 'sign([num])', arguments: { num: { type: A.NUMBER, defaultValue: -5 } } },
                { opcode: 'isBetween', blockType: B.BOOLEAN, text: 'inRange([num],[min],[max])', arguments: { num: { type: A.NUMBER, defaultValue: 5 }, min: { type: A.NUMBER, defaultValue: 1 }, max: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'isApproximately', blockType: B.BOOLEAN, text: 'approx([a],[b],[tolerance])', arguments: { a: { type: A.NUMBER, defaultValue: 3.14159 }, b: { type: A.NUMBER, defaultValue: 3.14 }, tolerance: { type: A.NUMBER, defaultValue: 0.01 } } },
                { opcode: 'distance', blockType: B.REPORTER, text: 'distance(([x1],[y1]),([x2],[y2]))', arguments: { x1: { type: A.NUMBER, defaultValue: 0 }, y1: { type: A.NUMBER, defaultValue: 0 }, x2: { type: A.NUMBER, defaultValue: 3 }, y2: { type: A.NUMBER, defaultValue: 4 } } },
                { opcode: 'angle', blockType: B.REPORTER, text: 'angle(([x1],[y1]),([x2],[y2]))', arguments: { x1: { type: A.NUMBER, defaultValue: 0 }, y1: { type: A.NUMBER, defaultValue: 0 }, x2: { type: A.NUMBER, defaultValue: 1 }, y2: { type: A.NUMBER, defaultValue: 1 } } },
                
                { blockType: 'label', text: '═══════String═══════' },
                { opcode: 'stringLength', blockType: B.REPORTER, text: 'len([str])', arguments: { str: { type: A.STRING, defaultValue: 'Hello World' } } },
                { opcode: 'stringConcat', blockType: B.REPORTER, text: 'concat([str1],[str2])', arguments: { str1: { type: A.STRING, defaultValue: 'Hello' }, str2: { type: A.STRING, defaultValue: 'World' } } },
                { opcode: 'stringToUpperCase', blockType: B.REPORTER, text: 'upper([str])', arguments: { str: { type: A.STRING, defaultValue: 'hello' } } },
                { opcode: 'stringToLowerCase', blockType: B.REPORTER, text: 'lower([str])', arguments: { str: { type: A.STRING, defaultValue: 'WORLD' } } },
                { opcode: 'stringReverse', blockType: B.REPORTER, text: 'reverse([str])', arguments: { str: { type: A.STRING, defaultValue: 'Scratch' } } },
                { opcode: 'stringTrim', blockType: B.REPORTER, text: 'trim([str])', arguments: { str: { type: A.STRING, defaultValue: '  Hello  ' } } },
                { opcode: 'stringCharAt', blockType: B.REPORTER, text: 'char([str],[index])', arguments: { str: { type: A.STRING, defaultValue: 'Scratch' }, index: { type: A.NUMBER, defaultValue: 3 } } },
                { opcode: 'stringContains', blockType: B.BOOLEAN, text: 'contains([str],[sub])', arguments: { str: { type: A.STRING, defaultValue: 'Hello World' }, sub: { type: A.STRING, defaultValue: 'World' } } },
                { opcode: 'stringStartsWith', blockType: B.BOOLEAN, text: 'startsWith([str],[sub])', arguments: { str: { type: A.STRING, defaultValue: 'Scratch' }, sub: { type: A.STRING, defaultValue: 'Scr' } } },
                { opcode: 'stringEndsWith', blockType: B.BOOLEAN, text: 'endsWith([str],[sub])', arguments: { str: { type: A.STRING, defaultValue: 'Scratch' }, sub: { type: A.STRING, defaultValue: 'tch' } } },
                { opcode: 'stringIndexOf', blockType: B.REPORTER, text: 'pos([sub],[str])', arguments: { str: { type: A.STRING, defaultValue: 'Hello World' }, sub: { type: A.STRING, defaultValue: 'World' } } },
                { opcode: 'stringCount', blockType: B.REPORTER, text: 'count([sub],[str])', arguments: { str: { type: A.STRING, defaultValue: 'ababab' }, sub: { type: A.STRING, defaultValue: 'ab' } } },
                { opcode: 'stringSlice', blockType: B.REPORTER, text: 'slice([str],[start],[end])', arguments: { str: { type: A.STRING, defaultValue: 'Scratch' }, start: { type: A.NUMBER, defaultValue: 2 }, end: { type: A.NUMBER, defaultValue: 5 } } },
                { opcode: 'stringReplace', blockType: B.REPORTER, text: 'replace([str],[old],[new])', arguments: { str: { type: A.STRING, defaultValue: 'Hello World' }, old: { type: A.STRING, defaultValue: 'World' }, new: { type: A.STRING, defaultValue: 'Scratch' } } },
                { opcode: 'stringIsEmpty', blockType: B.BOOLEAN, text: 'isEmpty([str])', arguments: { str: { type: A.STRING, defaultValue: '' } } },
                { opcode: 'stringToNumber', blockType: B.REPORTER, text: 'toNum([str])', arguments: { str: { type: A.STRING, defaultValue: '123' } } },
                { opcode: 'numberToString', blockType: B.REPORTER, text: 'toStr([num])', arguments: { num: { type: A.NUMBER, defaultValue: 123 } } },
                
                { blockType: 'label', text: '═══════进制转换═══════' },
                { opcode: 'toBin', blockType: B.REPORTER, text: 'toBin([n])', arguments: { n: { type: A.NUMBER, defaultValue: 42 } } },
                { opcode: 'toHex', blockType: B.REPORTER, text: 'toHex([n])', arguments: { n: { type: A.NUMBER, defaultValue: 255 } } },
                { opcode: 'toOct', blockType: B.REPORTER, text: 'toOct([n])', arguments: { n: { type: A.NUMBER, defaultValue: 64 } } },
                { opcode: 'fromBin', blockType: B.REPORTER, text: 'fromBin([bin])', arguments: { bin: { type: A.STRING, defaultValue: '101010' } } },
                { opcode: 'fromHex', blockType: B.REPORTER, text: 'fromHex([hex])', arguments: { hex: { type: A.STRING, defaultValue: 'FF' } } },
                { opcode: 'fromOct', blockType: B.REPORTER, text: 'fromOct([oct])', arguments: { oct: { type: A.STRING, defaultValue: '77' } } },
                
                { blockType: 'label', text: '═══════Random═══════' },
                { opcode: 'randomInt', blockType: B.REPORTER, text: 'randInt([min],[max])', arguments: { min: { type: A.NUMBER, defaultValue: 1 }, max: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'randomFloat', blockType: B.REPORTER, text: 'randFloat([min],[max])', arguments: { min: { type: A.NUMBER, defaultValue: 0 }, max: { type: A.NUMBER, defaultValue: 1 } } },
                { opcode: 'randomBoolean', blockType: B.BOOLEAN, text: 'randBool()' },
                { opcode: 'randomChoice', blockType: B.REPORTER, text: 'randChoice([list])', arguments: { list: { type: A.STRING, defaultValue: 'A,B,C' } } },
                
                { blockType: 'label', text: '═══════Statistics═══════' },
                { opcode: 'averageOfList', blockType: B.REPORTER, text: 'avg([list])', arguments: { list: { type: A.STRING, defaultValue: '1,2,3,4,5' } } },
                { opcode: 'sumOfList', blockType: B.REPORTER, text: 'sum([list])', arguments: { list: { type: A.STRING, defaultValue: '1,2,3,4,5' } } },
                { opcode: 'minOfList', blockType: B.REPORTER, text: 'min([list])', arguments: { list: { type: A.STRING, defaultValue: '3,1,4,1,5' } } },
                { opcode: 'maxOfList', blockType: B.REPORTER, text: 'max([list])', arguments: { list: { type: A.STRING, defaultValue: '3,1,4,1,5' } } },
                { opcode: 'standardDeviation', blockType: B.REPORTER, text: 'stdDev([list])', arguments: { list: { type: A.STRING, defaultValue: '1,2,3,4,5' } } },
                { opcode: 'variance', blockType: B.REPORTER, text: 'var([list])', arguments: { list: { type: A.STRING, defaultValue: '1,2,3,4,5' } } },
                { opcode: 'median', blockType: B.REPORTER, text: 'median([list])', arguments: { list: { type: A.STRING, defaultValue: '1,2,3,4,5' } } },
                { opcode: 'mode', blockType: B.REPORTER, text: 'mode([list])', arguments: { list: { type: A.STRING, defaultValue: '1,2,2,3,4' } } },
                { opcode: 'range', blockType: B.REPORTER, text: 'range([list])', arguments: { list: { type: A.STRING, defaultValue: '1,2,3,4,5' } } },
                { opcode: 'sumOfSquares', blockType: B.REPORTER, text: 'sumSq([list])', arguments: { list: { type: A.STRING, defaultValue: '1,2,3' } } },
                { opcode: 'rootMeanSquare', blockType: B.REPORTER, text: 'rms([list])', arguments: { list: { type: A.STRING, defaultValue: '1,2,3' } } },
                { opcode: 'geometricMean', blockType: B.REPORTER, text: 'geoMean([list])', arguments: { list: { type: A.STRING, defaultValue: '1,2,3,4,5' } } },
                { opcode: 'harmonicMean', blockType: B.REPORTER, text: 'harMean([list])', arguments: { list: { type: A.STRING, defaultValue: '1,2,3,4,5' } } },
                { opcode: 'quadraticMean', blockType: B.REPORTER, text: 'quadMean([list])', arguments: { list: { type: A.STRING, defaultValue: '1,2,3,4,5' } } },
                { opcode: 'arithmeticSequence', blockType: B.REPORTER, text: 'arithSeq([a1],[d],[n])', arguments: { a1: { type: A.NUMBER, defaultValue: 1 }, d: { type: A.NUMBER, defaultValue: 2 }, n: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'derivative', blockType: B.REPORTER, text: 'd/dx(x³,x=[a])', arguments: { a: { type: A.NUMBER, defaultValue: 2 } } },
                { opcode: 'partialDerivative', blockType: B.REPORTER, text: '∂/∂x(x²y³)', arguments: { x: { type: A.NUMBER, defaultValue: 2 }, y: { type: A.NUMBER, defaultValue: 3 } } },
                { opcode: 'differential', blockType: B.REPORTER, text: 'd/dx(y=x²)', arguments: { x: { type: A.NUMBER, defaultValue: 3 } } },
                
                { blockType: 'label', text: '═══════Units═══════' },
                { opcode: 'celsiusToFahrenheit', blockType: B.REPORTER, text: 'C2F([c])', arguments: { c: { type: A.NUMBER, defaultValue: 100 } } },
                { opcode: 'fahrenheitToCelsius', blockType: B.REPORTER, text: 'F2C([f])', arguments: { f: { type: A.NUMBER, defaultValue: 212 } } },
                { opcode: 'kmToMiles', blockType: B.REPORTER, text: 'km2mi([km])', arguments: { km: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'milesToKm', blockType: B.REPORTER, text: 'mi2km([miles])', arguments: { miles: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'kgToPounds', blockType: B.REPORTER, text: 'kg2lb([kg])', arguments: { kg: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'poundsToKg', blockType: B.REPORTER, text: 'lb2kg([lbs])', arguments: { lbs: { type: A.NUMBER, defaultValue: 22 } } },
                { opcode: 'm2ft', blockType: B.REPORTER, text: 'm2ft([m])', arguments: { m: { type: A.NUMBER, defaultValue: 1 } } },
                { opcode: 'ft2m', blockType: B.REPORTER, text: 'ft2m([ft])', arguments: { ft: { type: A.NUMBER, defaultValue: 3.28084 } } },
                { opcode: 'L2gal', blockType: B.REPORTER, text: 'L2gal([L])', arguments: { L: { type: A.NUMBER, defaultValue: 1 } } },
                { opcode: 'gal2L', blockType: B.REPORTER, text: 'gal2L([gal])', arguments: { gal: { type: A.NUMBER, defaultValue: 1 } } },
                { opcode: 'cm2inch', blockType: B.REPORTER, text: 'cm2inch([cm])', arguments: { cm: { type: A.NUMBER, defaultValue: 2.54 } } },
                { opcode: 'inch2cm', blockType: B.REPORTER, text: 'inch2cm([inch])', arguments: { inch: { type: A.NUMBER, defaultValue: 1 } } },
                { opcode: 'ms2kmh', blockType: B.REPORTER, text: 'm/s→km/h([ms])', arguments: { ms: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'kmh2ms', blockType: B.REPORTER, text: 'km/h→m/s([kmh])', arguments: { kmh: { type: A.NUMBER, defaultValue: 36 } } },
                
                { blockType: 'label', text: '═══════NumberTheory═══════' },
                { opcode: 'factorial', blockType: B.REPORTER, text: '[n]!', arguments: { n: { type: A.NUMBER, defaultValue: 5 } } },
                { opcode: 'fibonacci', blockType: B.REPORTER, text: 'fib([n])', arguments: { n: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'isPrime', blockType: B.BOOLEAN, text: 'isPrime([n])', arguments: { n: { type: A.NUMBER, defaultValue: 7 } } },
                { opcode: 'primeFactors', blockType: B.REPORTER, text: 'primeFactors([n])', arguments: { n: { type: A.NUMBER, defaultValue: 24 } } },
                { opcode: 'gcd', blockType: B.REPORTER, text: 'GCD([a],[b])', arguments: { a: { type: A.NUMBER, defaultValue: 12 }, b: { type: A.NUMBER, defaultValue: 18 } } },
                { opcode: 'lcm', blockType: B.REPORTER, text: 'LCM([a],[b])', arguments: { a: { type: A.NUMBER, defaultValue: 12 }, b: { type: A.NUMBER, defaultValue: 18 } } },
                { opcode: 'isEven', blockType: B.BOOLEAN, text: 'isEven([n])', arguments: { n: { type: A.NUMBER, defaultValue: 4 } } },
                { opcode: 'isOdd', blockType: B.BOOLEAN, text: 'isOdd([n])', arguments: { n: { type: A.NUMBER, defaultValue: 3 } } },
                { opcode: 'isDivisible', blockType: B.BOOLEAN, text: 'divisible([a],[b])', arguments: { a: { type: A.NUMBER, defaultValue: 10 }, b: { type: A.NUMBER, defaultValue: 2 } } },
                { opcode: 'digitSum', blockType: B.REPORTER, text: 'digitSum([n])', arguments: { n: { type: A.NUMBER, defaultValue: 12345 } } },
                { opcode: 'isPerfect', blockType: B.BOOLEAN, text: 'isPerfect([n])', arguments: { n: { type: A.NUMBER, defaultValue: 28 } } },
                { opcode: 'isArmstrong', blockType: B.BOOLEAN, text: 'isArmstrong([n])', arguments: { n: { type: A.NUMBER, defaultValue: 153 } } },
                { opcode: 'toRoman', blockType: B.REPORTER, text: 'toRoman([n])', arguments: { n: { type: A.NUMBER, defaultValue: 2024 } } },
                
                { blockType: 'label', text: '═══════Trigonometry═══════' },
                { opcode: 'trigonometry', blockType: B.REPORTER, text: '[FUNC]▼([x])', arguments: { FUNC: { type: A.STRING, menu: 'TRIG_FUNC' }, x: { type: A.NUMBER, defaultValue: 30 } } },
                { opcode: 'atan2', blockType: B.REPORTER, text: 'atan2([y],[x])', arguments: { y: { type: A.NUMBER, defaultValue: 1 }, x: { type: A.NUMBER, defaultValue: 1 } } },
                { opcode: 'deg2rad', blockType: B.REPORTER, text: 'deg2rad([deg])', arguments: { deg: { type: A.NUMBER, defaultValue: 180 } } },
                { opcode: 'rad2deg', blockType: B.REPORTER, text: 'rad2deg([rad])', arguments: { rad: { type: A.NUMBER, defaultValue: 3.14159 } } },
                { opcode: 'sinh', blockType: B.REPORTER, text: 'sinh([x])', arguments: { x: { type: A.NUMBER, defaultValue: 0 } } },
                { opcode: 'cosh', blockType: B.REPORTER, text: 'cosh([x])', arguments: { x: { type: A.NUMBER, defaultValue: 0 } } },
                { opcode: 'tanh', blockType: B.REPORTER, text: 'tanh([x])', arguments: { x: { type: A.NUMBER, defaultValue: 0 } } },
                
                { blockType: 'label', text: '═══════Log&Exp═══════' },
                { opcode: 'ln', blockType: B.REPORTER, text: 'ln([x])', arguments: { x: { type: A.NUMBER, defaultValue: 10 } } },
                { opcode: 'log10', blockType: B.REPORTER, text: 'log10([x])', arguments: { x: { type: A.NUMBER, defaultValue: 100 } } },
                { opcode: 'log2', blockType: B.REPORTER, text: 'log2([x])', arguments: { x: { type: A.NUMBER, defaultValue: 8 } } },
                { opcode: 'exp', blockType: B.REPORTER, text: 'e^[x]', arguments: { x: { type: A.NUMBER, defaultValue: 1 } } },
                { opcode: 'logbase', blockType: B.REPORTER, text: 'log([x])base[base]', arguments: { x: { type: A.NUMBER, defaultValue: 8 }, base: { type: A.NUMBER, defaultValue: 2 } } },
                { opcode: 'nRoot', blockType: B.REPORTER, text: 'ⁿ√[x]n=[n]', arguments: { x: { type: A.NUMBER, defaultValue: 27 }, n: { type: A.NUMBER, defaultValue: 3 } } },
                
                { blockType: 'label', text: '═══════Constants═══════' },
                { opcode: 'pi', blockType: B.REPORTER, text: 'π' },
                { opcode: 'e', blockType: B.REPORTER, text: 'e' },
                { opcode: 'phi', blockType: B.REPORTER, text: 'φ' },
                { opcode: 'sqrt2', blockType: B.REPORTER, text: '√2' },
                
                { blockType: 'label', text: '═══════Geometry═══════' },
                { opcode: 'hypotenuse', blockType: B.REPORTER, text: '√([a]²+[b]²)', arguments: { a: { type: A.NUMBER, defaultValue: 3 }, b: { type: A.NUMBER, defaultValue: 4 } } },
                { opcode: 'areaCircle', blockType: B.REPORTER, text: 'circleArea([r])', arguments: { r: { type: A.NUMBER, defaultValue: 5 } } },
                { opcode: 'circumference', blockType: B.REPORTER, text: 'circlePerimeter([r])', arguments: { r: { type: A.NUMBER, defaultValue: 5 } } },
                { opcode: 'areaTriangle', blockType: B.REPORTER, text: 'triArea([b],[h])', arguments: { b: { type: A.NUMBER, defaultValue: 6 }, h: { type: A.NUMBER, defaultValue: 4 } } },
                { opcode: 'areaRectangle', blockType: B.REPORTER, text: 'rectArea([l],[w])', arguments: { l: { type: A.NUMBER, defaultValue: 5 }, w: { type: A.NUMBER, defaultValue: 3 } } },
                { opcode: 'volumeCube', blockType: B.REPORTER, text: 'cubeVol([s])', arguments: { s: { type: A.NUMBER, defaultValue: 3 } } },
                { opcode: 'volumeSphere', blockType: B.REPORTER, text: 'sphereVol([r])', arguments: { r: { type: A.NUMBER, defaultValue: 3 } } },
                { opcode: 'volumeCylinder', blockType: B.REPORTER, text: 'cylinderVol([r],[h])', arguments: { r: { type: A.NUMBER, defaultValue: 3 }, h: { type: A.NUMBER, defaultValue: 5 } } },
                { opcode: 'vectorAdd', blockType: B.REPORTER, text: 'vecAdd([a1],[a2],[b1],[b2])', arguments: { a1: { type: A.NUMBER, defaultValue: 3 }, a2: { type: A.NUMBER, defaultValue: 4 }, b1: { type: A.NUMBER, defaultValue: 1 }, b2: { type: A.NUMBER, defaultValue: 2 } } },
                { opcode: 'dotProduct', blockType: B.REPORTER, text: 'vecDot([x1],[y1],[x2],[y2])', arguments: { x1: { type: A.NUMBER, defaultValue: 1 }, y1: { type: A.NUMBER, defaultValue: 2 }, x2: { type: A.NUMBER, defaultValue: 3 }, y2: { type: A.NUMBER, defaultValue: 4 } } },
                { opcode: 'crossProduct2D', blockType: B.REPORTER, text: 'vecCross([x1],[y1],[x2],[y2])', arguments: { x1: { type: A.NUMBER, defaultValue: 1 }, y1: { type: A.NUMBER, defaultValue: 2 }, x2: { type: A.NUMBER, defaultValue: 3 }, y2: { type: A.NUMBER, defaultValue: 4 } } },
                { opcode: 'magnitude', blockType: B.REPORTER, text: '|vec([x],[y])|', arguments: { x: { type: A.NUMBER, defaultValue: 3 }, y: { type: A.NUMBER, defaultValue: 4 } } },
                { opcode: 'cartesian2Polar', blockType: B.REPORTER, text: 'cart→polar([x],[y])', arguments: { x: { type: A.NUMBER, defaultValue: 1 }, y: { type: A.NUMBER, defaultValue: 1 } } },
                { opcode: 'polar2Cartesian', blockType: B.REPORTER, text: 'polar→cart([r],[theta])', arguments: { r: { type: A.NUMBER, defaultValue: 1.414 }, theta: { type: A.NUMBER, defaultValue: 0.785 } } },
                { opcode: 'coneVol', blockType: B.REPORTER, text: 'coneVol([r],[h])', arguments: { r: { type: A.NUMBER, defaultValue: 3 }, h: { type: A.NUMBER, defaultValue: 5 } } },
                { opcode: 'pyramidVol', blockType: B.REPORTER, text: 'pyramidVol([b],[h])', arguments: { b: { type: A.NUMBER, defaultValue: 9 }, h: { type: A.NUMBER, defaultValue: 6 } } },
                
                { blockType: 'label', text: '═══════FPS═══════' },
                { opcode: 'getFPS', blockType: B.REPORTER, text: 'FPS' },
                { opcode: 'getMinFPS', blockType: B.REPORTER, text: 'FPS_min' },
                { opcode: 'getMaxFPS', blockType: B.REPORTER, text: 'FPS_max' },
                { opcode: 'getAverageFPS', blockType: B.REPORTER, text: 'FPS_avg' },
                { opcode: 'getFrameTime', blockType: B.REPORTER, text: 'frameTime' },
                { opcode: 'resetFPSStats', blockType: B.COMMAND, text: 'resetFPS' },
                { opcode: 'isHighFPS', blockType: B.BOOLEAN, text: 'FPS>[threshold]', arguments: { threshold: { type: A.NUMBER, defaultValue: 60 } } },
                { opcode: 'isLowFPS', blockType: B.BOOLEAN, text: 'FPS<[threshold]', arguments: { threshold: { type: A.NUMBER, defaultValue: 30 } } },
                { opcode: 'getFPSStatus', blockType: B.REPORTER, text: 'FPS_status' },
                
                { blockType: 'label', text: '═══════Complex═══════' },
                { opcode: 'complexAdd', blockType: B.REPORTER, text: '[c1]+[c2]', arguments: { c1: { type: A.STRING, defaultValue: '2+3i' }, c2: { type: A.STRING, defaultValue: '1+2i' } } },
                { opcode: 'complexSubtract', blockType: B.REPORTER, text: '[c1]-[c2]', arguments: { c1: { type: A.STRING, defaultValue: '2+3i' }, c2: { type: A.STRING, defaultValue: '1+2i' } } },
                { opcode: 'complexMultiply', blockType: B.REPORTER, text: '[c1]×[c2]', arguments: { c1: { type: A.STRING, defaultValue: '2+3i' }, c2: { type: A.STRING, defaultValue: '1+2i' } } },
                { opcode: 'complexDivide', blockType: B.REPORTER, text: '[c1]÷[c2]', arguments: { c1: { type: A.STRING, defaultValue: '2+3i' }, c2: { type: A.STRING, defaultValue: '1+2i' } } },
                { opcode: 'complexConjugate', blockType: B.REPORTER, text: 'conj([c])', arguments: { c: { type: A.STRING, defaultValue: '2+3i' } } },
                { opcode: 'complexModulus', blockType: B.REPORTER, text: '|[c]|', arguments: { c: { type: A.STRING, defaultValue: '3+4i' } } },
                
                { blockType: 'label', text: '═══════Matrix═══════' },
                { opcode: 'matrixAdd', blockType: B.REPORTER, text: '[m1]+[m2]', arguments: { m1: { type: A.STRING, defaultValue: '[1,2;3,4]' }, m2: { type: A.STRING, defaultValue: '[2,3;4,5]' } } },
                { opcode: 'matrixMultiply', blockType: B.REPORTER, text: '[m1]×[m2]', arguments: { m1: { type: A.STRING, defaultValue: '[1,2;3,4]' }, m2: { type: A.STRING, defaultValue: '[2,3;4,5]' } } },
                { opcode: 'matrixScalarMultiply', blockType: B.REPORTER, text: '[m]×[k]', arguments: { m: { type: A.STRING, defaultValue: '[1,2;3,4]' }, k: { type: A.NUMBER, defaultValue: 2 } } },
                { opcode: 'matrixTranspose', blockType: B.REPORTER, text: 'transpose([m])', arguments: { m: { type: A.STRING, defaultValue: '[1,2;3,4]' } } },
                { opcode: 'matrixDeterminant', blockType: B.REPORTER, text: 'det([m])', arguments: { m: { type: A.STRING, defaultValue: '[1,2;3,4]' } } },
                
                { blockType: 'label', text: '═══════位运算═══════' },
                { opcode: 'bitAND', blockType: B.REPORTER, text: '[a]&[b]', arguments: { a: { type: A.NUMBER, defaultValue: 6 }, b: { type: A.NUMBER, defaultValue: 3 } } },
                { opcode: 'bitOR', blockType: B.REPORTER, text: '[a]|[b]', arguments: { a: { type: A.NUMBER, defaultValue: 6 }, b: { type: A.NUMBER, defaultValue: 3 } } },
                { opcode: 'bitXOR', blockType: B.REPORTER, text: '[a]^[b]', arguments: { a: { type: A.NUMBER, defaultValue: 6 }, b: { type: A.NUMBER, defaultValue: 3 } } },
                { opcode: 'bitNOT', blockType: B.REPORTER, text: '~[n]', arguments: { n: { type: A.NUMBER, defaultValue: 0 } } },
                { opcode: 'bitLShift', blockType: B.REPORTER, text: '[n]<<[k]', arguments: { n: { type: A.NUMBER, defaultValue: 1 }, k: { type: A.NUMBER, defaultValue: 3 } } },
                { opcode: 'bitRShift', blockType: B.REPORTER, text: '[n]>>[k]', arguments: { n: { type: A.NUMBER, defaultValue: 8 }, k: { type: A.NUMBER, defaultValue: 2 } } },
                { opcode: 'unsignedRShift', blockType: B.REPORTER, text: '[n]>>>[k]', arguments: { n: { type: A.NUMBER, defaultValue: -8 }, k: { type: A.NUMBER, defaultValue: 2 } } },
                
                { blockType: 'label', text: '═══════Info═══════' },
                { opcode: 'detectEditor', blockType: B.REPORTER, text: 'editor' },
                { opcode: 'authorInfo', blockType: B.REPORTER, text: '作者信息' }
            ],
            menus: {
                TRIG_FUNC: {
                    acceptReporters: true,
                    items: ['sin', 'cos', 'tan', 'asin', 'acos', 'atan']
                },
                SET_TYPES: {
                    acceptReporters: true,
                    items: ['N', 'Z', 'Q', 'R', 'C', 'K', 'U', 'A']
                }
            }
        };
    };

    Scratch.extensions.register(new EnhancedCalculatorExtension());
})(typeof Scratch === 'undefined' ? {} : Scratch);