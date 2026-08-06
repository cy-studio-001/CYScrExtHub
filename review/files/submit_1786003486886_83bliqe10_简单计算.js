(function(Scratch) {
    'use strict';

    // 数学工具函数 (供 eval 使用)
    const mathHelpers = {
        sqrt: Math.sqrt,
        cbrt: Math.cbrt,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        asin: Math.asin,
        acos: Math.acos,
        atan: Math.atan,
        log: Math.log10,
        ln: Math.log,
        log2: Math.log2,
        exp: Math.exp,
        abs: Math.abs,
        floor: Math.floor,
        ceil: Math.ceil,
        round: Math.round,
        pow: Math.pow,
        max: Math.max,
        min: Math.min,
        PI: Math.PI,
        E: Math.E,
        pi: Math.PI,
        e: Math.E,
        fact: function(n) {
            if (n < 0) return NaN;
            if (n === 0 || n === 1) return 1;
            var r = 1;
            for (var i = 2; i <= n; i++) r *= i;
            return r;
        },
        comb: function(n, k) {
            if (k < 0 || k > n) return 0;
            return mathHelpers.fact(n) / (mathHelpers.fact(k) * mathHelpers.fact(n - k));
        },
        perm: function(n, k) {
            if (k < 0 || k > n) return 0;
            return mathHelpers.fact(n) / mathHelpers.fact(n - k);
        },
        random: Math.random,
        sign: Math.sign,
        trunc: Math.trunc
    };

    var evalContext = Object.assign({}, mathHelpers);

    function safeEval(expr) {
        try {
            var sanitized = expr.replace(/\^/g, '**');
            var dangerous = /[;'"`\\]|__proto__|constructor|prototype|global|process|require|import|export|eval|Function|setTimeout|setInterval|Promise|fetch|XMLHttpRequest|localStorage|sessionStorage|window|document|self|top|parent|location|history|navigator|alert|confirm|prompt|console|debugger/;
            if (dangerous.test(sanitized)) {
                return '非法表达式';
            }
            var fn = new Function(
                Object.keys(evalContext).join(','),
                'return (' + sanitized + ')'
            );
            var result = fn.apply(null, Object.values(evalContext));
            if (typeof result === 'number' && !Number.isFinite(result)) return 'Infinity';
            if (typeof result === 'number' && Number.isNaN(result)) return 'NaN';
            return result;
        } catch (e) {
            return '错误: ' + e.message;
        }
    }

    // 化简代数式 - 合并同类项
    function parseTerm(termStr) {
        termStr = termStr.trim();
        if (termStr === '') return null;
        if (/^[0-9]+(\.[0-9]+)?$/.test(termStr)) {
            return { coeff: parseFloat(termStr), vars: {} };
        }
        var match = termStr.match(/^([+-]?)([0-9]*\.?[0-9]+)?([a-zA-Z])(?:\^([0-9]+))?$/);
        if (match) {
            var sign = match[1] || '';
            var coeffStr = match[2] || '';
            var varName = match[3];
            var expStr = match[4] || '1';
            var coeff = coeffStr === '' ? 1 : parseFloat(coeffStr);
            if (sign === '-') coeff = -coeff;
            var vars = {};
            vars[varName] = parseInt(expStr, 10);
            return { coeff: coeff, vars: vars };
        }
        var simple = termStr.match(/^([+-]?)([a-zA-Z])$/);
        if (simple) {
            var sign2 = simple[1] || '';
            var varName2 = simple[2];
            var coeff2 = 1;
            if (sign2 === '-') coeff2 = -1;
            var vars2 = {};
            vars2[varName2] = 1;
            return { coeff: coeff2, vars: vars2 };
        }
        var expOnly = termStr.match(/^([+-]?)([a-zA-Z])\^([0-9]+)$/);
        if (expOnly) {
            var sign3 = expOnly[1] || '';
            var varName3 = expOnly[2];
            var exp3 = parseInt(expOnly[3], 10);
            var coeff3 = 1;
            if (sign3 === '-') coeff3 = -1;
            var vars3 = {};
            vars3[varName3] = exp3;
            return { coeff: coeff3, vars: vars3 };
        }
        var star = termStr.match(/^([+-]?)([0-9]+(\.[0-9]+)?)\*([a-zA-Z])(?:\^([0-9]+))?$/);
        if (star) {
            var sign4 = star[1] || '';
            var coeff4 = parseFloat(star[2]);
            var varName4 = star[4];
            var exp4 = star[5] ? parseInt(star[5], 10) : 1;
            var finalCoeff = sign4 === '-' ? -coeff4 : coeff4;
            var vars4 = {};
            vars4[varName4] = exp4;
            return { coeff: finalCoeff, vars: vars4 };
        }
        return null;
    }

    function splitTerms(expr) {
        var s = expr.replace(/\s/g, '');
        if (s === '') return [];
        var terms = [];
        var current = '';
        var i = 0;
        while (i < s.length) {
            var ch = s[i];
            if ((ch === '+' || ch === '-') && i > 0) {
                var prev = s[i - 1];
                if (prev !== '+' && prev !== '-' && prev !== '*' && prev !== '/' && prev !== '^') {
                    if (current) terms.push(current);
                    current = ch;
                    i++;
                    continue;
                }
            }
            current += ch;
            i++;
        }
        if (current) terms.push(current);
        if (terms.length > 0 && terms[0].startsWith('+')) {
            terms[0] = terms[0].substring(1);
        }
        return terms.filter(function(t) { return t !== ''; });
    }

    function simplifyAlgebraic(expr) {
        if (typeof expr !== 'string') expr = String(expr);
        expr = expr.trim();
        if (expr === '') return '';

        var numMatch = expr.match(/^[0-9]+(\.[0-9]+)?([+\-*/][0-9]+(\.[0-9]+)?)*$/);
        if (numMatch) {
            try {
                var result = safeEval(expr);
                if (typeof result === 'number') return String(result);
            } catch (_) {}
        }

        var rawTerms = splitTerms(expr);
        if (rawTerms.length === 0) return expr;

        var parsed = [];
        for (var idx = 0; idx < rawTerms.length; idx++) {
            var p = parseTerm(rawTerms[idx]);
            if (p) parsed.push(p);
            else return expr;
        }

        var groups = new Map();
        for (var j = 0; j < parsed.length; j++) {
            var item = parsed[j];
            var key = JSON.stringify(item.vars);
            if (groups.has(key)) {
                var existing = groups.get(key);
                existing.coeff += item.coeff;
            } else {
                groups.set(key, { coeff: item.coeff, vars: item.vars });
            }
        }

        var filtered = [];
        for (var entry of groups) {
            var item = entry[1];
            if (Math.abs(item.coeff) < 1e-12) continue;
            filtered.push(item);
        }
        if (filtered.length === 0) return '0';

        var resultParts = [];
        for (var k = 0; k < filtered.length; k++) {
            var item2 = filtered[k];
            var coeff = item2.coeff;
            var vars = item2.vars;
            var varKeys = Object.keys(vars);
            var part = '';
            if (varKeys.length === 0) {
                part = String(coeff);
            } else {
                var coeffStr = '';
                if (coeff === 1) coeffStr = '';
                else if (coeff === -1) coeffStr = '-';
                else coeffStr = String(coeff);
                var varParts = [];
                for (var vIdx = 0; vIdx < varKeys.length; vIdx++) {
                    var v = varKeys[vIdx];
                    var e = vars[v];
                    varParts.push(e === 1 ? v : v + '^' + e);
                }
                var varStr = varParts.join('');
                if (coeff === 1) part = varStr;
                else if (coeff === -1) part = '-' + varStr;
                else part = coeffStr + varStr;
            }
            resultParts.push(part);
        }

        var resultStr = resultParts.join('+');
        resultStr = resultStr.replace(/\+-/g, '-');
        if (resultStr.startsWith('+-')) resultStr = '-' + resultStr.substring(2);
        return resultStr;
    }

    // 扩展类
    class SimpleCalcExtension {
        getInfo() {
            return {
                id: 'simplecalc',
                name: '简单计算',
                color1: '#4a6cf7',
                color2: '#3a5cd7',
                color3: '#2a4cb7',
                blocks: [
                    {
                        opcode: 'calculate',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '计算 [EXPR]',
                        arguments: {
                            EXPR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'sqrt(4) + cbrt(8)'
                            }
                        }
                    },
                    {
                        opcode: 'simplify',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '化简代数式 [EXPR]',
                        arguments: {
                            EXPR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '2x + 3x'
                            }
                        }
                    }
                ]
            };
        }

        calculate(args) {
            var expr = args.EXPR || '';
            return safeEval(expr);
        }

        simplify(args) {
            var expr = args.EXPR || '';
            try {
                return simplifyAlgebraic(expr);
            } catch (e) {
                return '错误: ' + e.message;
            }
        }
    }

    Scratch.extensions.register(new SimpleCalcExtension());

})(Scratch);