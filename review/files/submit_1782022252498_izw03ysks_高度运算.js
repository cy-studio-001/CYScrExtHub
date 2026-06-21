(function(Scratch) {
    'use strict';

    class CalculationExtension {
        getInfo() {
            return {
                id: 'calculationExtension',
                name: '计算',
                version: '1.1.0',
                description: '支持加减乘除、幂运算、整除、求余、三角函数及无限大（∞）的高级计算扩展',
                author: 'Scratch开发者',
                icon: '📊',
                color1: '#4CAF50',
                color2: '#388E3C',
                blocks: [
                    {
                        opcode: 'calculateExpression',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '运算 [EXPRESSION]',
                        arguments: {
                            EXPRESSION: {
                                type: Scratch.ArgumentType.MATH_EXPRESSION,
                                defaultValue: '1+∞、sin(π/2)+∞、∞*3' // 新增∞示例
                            }
                        }
                    }
                ]
            };
        }

        calculateExpression(args) {
            let expression = args.EXPRESSION.trim();
            if (!expression) return 'Error';

            try {
                // 1. 验证合法字符和函数（新增∞为合法字符）
                const validChars = /[^0-9.+\-*/^%()πe∞asinctor\s]/;
                if (validChars.test(expression)) {
                    return 'Error';
                }

                // 2. 替换特殊符号（新增∞→Infinity）
                expression = expression
                    .replace(/π/g, 'Math.PI')
                    .replace(/e/g, 'Math.E')
                    .replace(/∞/g, 'Infinity'); // 无限大映射为JS原生Infinity

                // 3. 替换运算符号和函数（保持原有逻辑）
                expression = expression
                    .replace(/\^/g, '**')
                    .replace(/(\S+)\/\/(\S+)/g, 'Math.floor($1/$2)')
                    .replace(/sin\(/g, 'Math.sin(')
                    .replace(/cos\(/g, 'Math.cos(')
                    .replace(/tan\(/g, 'Math.tan(')
                    .replace(/asin\(/g, 'Math.asin(')
                    .replace(/acos\(/g, 'Math.acos(')
                    .replace(/atan\(/g, 'Math.atan(');

                // 4. 安全执行表达式
                const calcFunc = new Function(`return ${expression};`);
                let result = calcFunc();

                // 5. 结果处理（新增∞的特殊判断）
                if (result === Infinity) {
                    return '∞'; // 合法无限大返回∞
                } else if (result === -Infinity) {
                    return '-∞'; // 负无限大返回-∞
                } else if (isNaN(result) || !isFinite(result)) {
                    return 'Error'; // 其他非法结果（如0/0、∞-∞）返回Error
                }

                // 6. 普通结果格式化
                return parseFloat(result.toFixed(6)).toString();

            } catch (error) {
                // 捕获语法错误、未定式运算等
                return 'Error';
            }
        }
    }

    Scratch.extensions.register(new CalculationExtension());
})(Scratch);