(function (_Scratch) {
    const {ArgumentType, BlockType, Cast, extensions, runtime} = _Scratch;

    // ===== 保存原生 bind，用于抵御外挂篡改 =====
    const nativeBind = Function.prototype.bind;

    // 动画类型
    const ANIM_TYPES = [
        {text: '弹出', value: 'pop'},
        {text: '渐变', value: 'fade'},
        {text: '缩放', value: 'scale'},
        {text: '下落弹跳', value: 'drop'},
        {text: '左侧滑入', value: 'slideLeft'},
        {text: '右侧滑入', value: 'slideRight'},
        {text: '旋转进入', value: 'rotate'},
        {text: '弹性缩放', value: 'bounce'}
    ];

    // 弹窗位置
    const POSITION_TYPES = [
        {text: '居中', value: 'center'},
        {text: '顶部', value: 'top'},
        {text: '底部', value: 'bottom'},
        {text: '左上角', value: 'topLeft'},
        {text: '右上角', value: 'topRight'},
        {text: '左下角', value: 'bottomLeft'},
        {text: '右下角', value: 'bottomRight'},
        {text: '中上部', value: 'topCenter'},
        {text: '中下部', value: 'bottomCenter'}
    ];

    // 角落提示位置
    const CORNER_POSITION_TYPES = [
        {text: '左上', value: 'topLeft'},
        {text: '右上', value: 'topRight'},
        {text: '左下', value: 'bottomLeft'},
        {text: '右下', value: 'bottomRight'}
    ];

    // 角落提示类型
    const CORNER_TYPE_TYPES = [
        {text: '默认', value: 'default'},
        {text: '成功', value: 'success'},
        {text: '警告', value: 'warning'},
        {text: '错误', value: 'error'},
        {text: '信息', value: 'info'}
    ];

    // 开关选项
    const SWITCH_OPTIONS = [
        {text: '是', value: 'true'},
        {text: '否', value: 'false'}
    ];

    class AdvancedDialog {
        constructor (_runtime) {
            this._runtime = _runtime;
            this._styles = {
                dialogBg: '#ffffff',
                titleColor: '#333333',
                contentColor: '#666666',
                btnOkBg: '#4CAF50',
                btnCancelBg: '#9E9E9E',
                btnTextColor: '#ffffff',
                animType: 'pop',
                animDuration: 500,
                width: 300,
                height: 'auto',
                borderRadius: 12,
                position: 'center',
                shadow: true,
                border: true,
                countdown: 0,
                darkMode: false
            };
            // 面板配置
            this._panelConfig = {
                panelTitle: '弹窗控制面板',
                panelBg: '#ffffff',
                panelHeaderBg: '#9C27B0',
                panelTextColor: '#333333',
                panelAccentColor: '#9C27B0',
                showAdvancedOptions: true,
                rememberSettings: true
            };
            this._activeToasts = new Map();
            this._toastOffset = 70;
            this._panelOpen = false;
            this._csenseDetected = false;

            this._createBaseStyle();
            this._loadSettings();

            // 自动执行完整性检测（静默）
            setTimeout(() => {
                if (!this._performIntegrityCheck()) {
                    console.warn(
                        '%c[灵动弹窗工坊] ⚠️ 自动完整性检测失败！扩展可能被篡改。',
                        'color: #F44336; font-size: 14px; font-weight: bold;'
                    );
                }
            }, 500);

            // ----- 检测所有已知外挂 -----
            setTimeout(() => {
                const detection = this._detectExternalHacks();
                if (detection.detected) {
                    this._csenseDetected = true;
                    console.warn(
                        `%c[灵动弹窗工坊] ⚠️ 检测到外挂: ${detection.reason}，弹窗功能已被禁用。`,
                        'color: #F44336; font-size: 14px; font-weight: bold;'
                    );

                    this._removeSpdUI();
                    this._removeVariableModifierUI();

                    if (Function.prototype.bind !== nativeBind) {
                        try {
                            Function.prototype.bind = nativeBind;
                            console.log('[灵动弹窗工坊] 已恢复原生 Function.prototype.bind');
                        } catch (e) {
                            console.warn('[灵动弹窗工坊] 恢复 bind 失败:', e);
                        }
                    }

                    this.showCornerToast({
                        TITLE: '⚠️ 外挂检测',
                        MESSAGE: `检测到 ${detection.reason}，弹窗已自动禁用。请清除恶意脚本后刷新。`,
                        POSITION: 'topRight',
                        TYPE: 'error',
                        AUTO_CLOSE: 'false',
                        SECONDS: 0
                    });
                }
            }, 800);
        }

        // ----- 安全转义函数 -----
        _escapeHtml(text) {
            if (typeof text !== 'string') return text;
            return text.replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;')
                       .replace(/"/g, '&quot;')
                       .replace(/'/g, '&#x27;')
                       .replace(/\//g, '&#x2F;');
        }

        // ----- 完整性检测 -----
        _performIntegrityCheck() {
            try {
                if (this._escapeHtml('<script>') !== '&lt;script&gt;') return false;
                if (this._escapeHtml('"') !== '&quot;') return false;
                if (this._escapeHtml('&') !== '&amp;') return false;

                if (typeof this.showHtmlDialog !== 'undefined') return false;
                if (typeof this.setCustomHtmlContent !== 'undefined') return false;

                const createDialogSrc = this._createDialog.toString();
                if (!createDialogSrc.includes('_escapeHtml')) return false;
                if (!createDialogSrc.includes('safeTitle')) return false;
                if (!createDialogSrc.includes('safeContent')) return false;

                const info = this.getInfo();
                const blockOpCodes = info.blocks
                    .filter(b => b.opcode)
                    .map(b => b.opcode);
                if (blockOpCodes.includes('showHtmlDialog')) return false;
                if (blockOpCodes.includes('setCustomHtmlContent')) return false;

                return true;
            } catch (e) {
                console.warn('[灵动弹窗工坊] 完整性检测异常:', e);
                return false;
            }
        }

        integrityCheck() {
            const result = this._performIntegrityCheck();
            if (!result) {
                console.warn(
                    '%c[灵动弹窗工坊] ⚠️ 完整性检测失败！扩展可能被篡改，请检查代码。',
                    'color: #F44336; font-size: 14px; font-weight: bold;'
                );
                this.showCornerToast({
                    TITLE: '⚠️ 完整性异常',
                    MESSAGE: '扩展代码可能被篡改，请重新加载扩展。',
                    POSITION: 'topRight',
                    TYPE: 'error',
                    AUTO_CLOSE: 'true',
                    SECONDS: 5
                });
            }
            return result;
        }

        // ----- 检测外部篡改（涵盖所有已知外挂）-----
        _detectExternalHacks() {
            try {
                if (window.__CSense_vm_trap !== undefined) {
                    return { detected: true, reason: 'CSense (__CSense_vm_trap)' };
                }

                if (document.querySelector('#spd-open, #spd-toolbar, .spd-modal')) {
                    return { detected: true, reason: '盗作神器 Pro (SPD UI)' };
                }
                if (window.eureka && window.eureka.vm) {
                    return { detected: true, reason: '盗作神器 Pro (eureka.vm)' };
                }

                if (document.querySelector('button[title="打开变量修改器"]')) {
                    return { detected: true, reason: '变量修改器' };
                }
                const allDivs = document.querySelectorAll('div');
                for (const div of allDivs) {
                    if (div.style.position === 'fixed' && div.textContent.includes('变量修改器')) {
                        return { detected: true, reason: '变量修改器' };
                    }
                }

                if (localStorage.getItem('作品替换_meta')) {
                    return { detected: true, reason: '作品替换器' };
                }

                const bindStr = Function.prototype.bind.toString();
                if (!bindStr.includes('[native code]') && !bindStr.includes('function bind()')) {
                    return { detected: true, reason: 'bind() 被篡改 (可能是外挂)' };
                }

                return { detected: false };
            } catch (e) {
                return { detected: false };
            }
        }

        _removeSpdUI() {
            const selectors = [
                '#spd-open',
                '#spd-toolbar',
                '.spd-modal',
                '.spd-modal-content'
            ];
            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    try {
                        el.remove();
                        console.log(`[灵动弹窗工坊] 已移除外挂元素: ${sel}`);
                    } catch (e) {}
                });
            });
            const styleTags = document.querySelectorAll('style');
            styleTags.forEach(el => {
                if (el.textContent.includes('spd-')) {
                    try {
                        el.remove();
                    } catch (e) {}
                }
            });
        }

        _removeVariableModifierUI() {
            const opener = document.querySelector('button[title="打开变量修改器"]');
            if (opener) {
                try {
                    opener.remove();
                    console.log('[灵动弹窗工坊] 已移除变量修改器按钮');
                } catch (e) {}
            }
            const allDivs = document.querySelectorAll('div');
            for (const div of allDivs) {
                if (div.style.position === 'fixed' && 
                    div.style.zIndex === '999999' &&
                    div.style.background === '#fff' &&
                    div.textContent.includes('变量修改器')) {
                    try {
                        div.remove();
                        console.log('[灵动弹窗工坊] 已移除变量修改器面板');
                    } catch (e) {}
                    break;
                }
            }
        }

        // ===== 修改点：存储键名已改为 'dialogWorkshopSecureSettings' =====
        _loadSettings() {
            try {
                const saved = localStorage.getItem('dialogWorkshopSecureSettings');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    Object.assign(this._styles, parsed.styles || {});
                    Object.assign(this._panelConfig, parsed.panelConfig || {});
                }
            } catch (e) {
                console.warn('Failed to load settings:', e);
            }
        }

        _saveSettings() {
            try {
                const settings = {
                    styles: {...this._styles},
                    panelConfig: {...this._panelConfig}
                };
                localStorage.setItem('dialogWorkshopSecureSettings', JSON.stringify(settings));
            } catch (e) {
                console.warn('Failed to save settings:', e);
            }
        }

        // ----- 基础样式（已移除自定义HTML相关样式） -----
        _createBaseStyle() {
            if (typeof window === 'undefined') return;
            const style = document.createElement('style');
            style.textContent = `
                /* 弹窗基础样式 */
                .advanced-dialog-overlay {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    background: rgba(0,0,0,0.5) !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    z-index: 99999 !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    transition: opacity 0.3s ease !important;
                }
                .advanced-dialog-overlay.no-overlay {
                    background: transparent !important;
                }
                .advanced-dialog-overlay.active {
                    opacity: 1 !important;
                    pointer-events: auto !important;
                }
                
                .advanced-dialog-overlay.position-center {
                    align-items: center !important;
                    justify-content: center !important;
                }
                .advanced-dialog-overlay.position-top {
                    align-items: flex-start !important;
                    justify-content: center !important;
                    padding-top: 50px !important;
                }
                .advanced-dialog-overlay.position-bottom {
                    align-items: flex-end !important;
                    justify-content: center !important;
                    padding-bottom: 50px !important;
                }
                .advanced-dialog-overlay.position-topLeft {
                    align-items: flex-start !important;
                    justify-content: flex-start !important;
                    padding: 20px !important;
                }
                .advanced-dialog-overlay.position-topRight {
                    align-items: flex-start !important;
                    justify-content: flex-end !important;
                    padding: 20px !important;
                }
                .advanced-dialog-overlay.position-bottomLeft {
                    align-items: flex-end !important;
                    justify-content: flex-start !important;
                    padding: 20px !important;
                }
                .advanced-dialog-overlay.position-bottomRight {
                    align-items: flex-end !important;
                    justify-content: flex-end !important;
                    padding: 20px !important;
                }
                .advanced-dialog-overlay.position-topCenter {
                    align-items: flex-start !important;
                    justify-content: center !important;
                    padding-top: 100px !important;
                }
                .advanced-dialog-overlay.position-bottomCenter {
                    align-items: flex-end !important;
                    justify-content: center !important;
                    padding-bottom: 100px !important;
                }
                
                .advanced-dialog {
                    background: var(--dialog-bg) !important;
                    border-radius: var(--border-radius) !important;
                    width: var(--dialog-width) !important;
                    height: var(--dialog-height) !important;
                    max-width: 90% !important;
                    padding: 20px !important;
                    box-sizing: border-box !important;
                    will-change: transform, opacity, filter !important;
                    transition: all var(--anim-duration) cubic-bezier(0.34, 1.56, 0.64, 1) !important;
                    display: flex !important;
                    flex-direction: column !important;
                    opacity: 0 !important;
                }
                .advanced-dialog.dark-mode {
                    --dialog-bg: #2d2d2d !important;
                    --title-color: #ffffff !important;
                    --content-color: #e0e0e0 !important;
                    --border-color: #444 !important;
                }
                .advanced-dialog.with-border {
                    border: 2px solid var(--border-color) !important;
                }
                .advanced-dialog.with-shadow {
                    box-shadow: 0 8px 30px rgba(0,0,0,0.2) !important;
                }
                .advanced-dialog.type-normal {
                    --border-color: #ddd !important;
                    --icon-color: #4CAF50 !important;
                }
                .advanced-dialog.type-success {
                    --border-color: #4CAF50 !important;
                    --icon-color: #4CAF50 !important;
                }
                .advanced-dialog.type-warning {
                    --border-color: #FFC107 !important;
                    --icon-color: #FFC107 !important;
                }
                .advanced-dialog.type-error {
                    --border-color: #F44336 !important;
                    --icon-color: #F44336 !important;
                }
                .advanced-dialog.type-info {
                    --border-color: #2196F3 !important;
                    --icon-color: #2196F3 !important;
                }
                .advanced-dialog.type-option {
                    --border-color: #9C27B0 !important;
                    --icon-color: #9C27B0 !important;
                }
                
                .dialog-icon-container {
                    display: flex !important;
                    align-items: center !important;
                    margin-bottom: 15px !important;
                    position: relative !important;
                }
                .dialog-icon {
                    width: 40px !important;
                    height: 40px !important;
                    border-radius: 50% !important;
                    background: rgba(var(--icon-rgb), 0.1) !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    margin-right: 15px !important;
                    flex-shrink: 0 !important;
                    position: relative !important;
                }
                .dialog-icon i {
                    color: var(--icon-color) !important;
                    font-size: 24px !important;
                    font-style: normal !important;
                    font-weight: bold !important;
                }
                .check-svg-container {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                .check-svg {
                    width: 28px !important;
                    height: 28px !important;
                }
                .check-svg path {
                    fill: none !important;
                    stroke: var(--icon-color) !important;
                    stroke-width: 3 !important;
                    stroke-linecap: round !important;
                    stroke-linejoin: round !important;
                    stroke-dasharray: 30 !important;
                    stroke-dashoffset: 30 !important;
                    animation: drawCheck 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
                }
                @keyframes drawCheck {
                    0% { stroke-dashoffset: 30; }
                    100% { stroke-dashoffset: 0; }
                }
                
                /* 动画样式 */
                .advanced-dialog.anim-pop {
                    transform: scale(0.5) rotate(-10deg) !important;
                    opacity: 0 !important;
                }
                .advanced-dialog-overlay.active .advanced-dialog.anim-pop {
                    transform: scale(1) rotate(0deg) !important;
                    opacity: 1 !important;
                }
                .advanced-dialog.anim-fade {
                    opacity: 0 !important;
                    filter: blur(10px) !important;
                    transform: translateY(20px) !important;
                }
                .advanced-dialog-overlay.active .advanced-dialog.anim-fade {
                    opacity: 1 !important;
                    filter: blur(0) !important;
                    transform: translateY(0) !important;
                }
                .advanced-dialog.anim-scale {
                    transform: scale(0) !important;
                    opacity: 0 !important;
                }
                .advanced-dialog-overlay.active .advanced-dialog.anim-scale {
                    transform: scale(1) !important;
                    opacity: 1 !important;
                }
                .advanced-dialog.anim-drop {
                    transform: translateY(-200px) scale(0.8) !important;
                    opacity: 0 !important;
                }
                .advanced-dialog-overlay.active .advanced-dialog.anim-drop {
                    transform: translateY(0) scale(1) !important;
                    opacity: 1 !important;
                    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                }
                .advanced-dialog.anim-slideLeft {
                    transform: translateX(-500px) rotate(5deg) !important;
                    opacity: 0 !important;
                }
                .advanced-dialog-overlay.active .advanced-dialog.anim-slideLeft {
                    transform: translateX(0) rotate(0deg) !important;
                    opacity: 1 !important;
                }
                .advanced-dialog.anim-slideRight {
                    transform: translateX(500px) rotate(-5deg) !important;
                    opacity: 0 !important;
                }
                .advanced-dialog-overlay.active .advanced-dialog.anim-slideRight {
                    transform: translateX(0) rotate(0deg) !important;
                    opacity: 1 !important;
                }
                .advanced-dialog.anim-rotate {
                    transform: rotate(180deg) scale(0.5) !important;
                    opacity: 0 !important;
                }
                .advanced-dialog-overlay.active .advanced-dialog.anim-rotate {
                    transform: rotate(0deg) scale(1) !important;
                    opacity: 1 !important;
                }
                .advanced-dialog.anim-bounce {
                    transform: scale(0) !important;
                    opacity: 0 !important;
                }
                .advanced-dialog-overlay.active .advanced-dialog.anim-bounce {
                    transform: scale(1) !important;
                    opacity: 1 !important;
                    animation: bounceEffect 0.6s ease !important;
                }
                @keyframes bounceEffect {
                    0% { transform: scale(0); }
                    70% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                
                .dialog-header {
                    margin-bottom: 10px !important;
                }
                .dialog-title {
                    margin: 0 !important;
                    font-size: 20px !important;
                    color: var(--title-color) !important;
                    font-weight: bold !important;
                }
                .dialog-content {
                    margin: 10px 0 !important;
                    font-size: 14px !important;
                    color: var(--content-color) !important;
                    line-height: 1.6 !important;
                    flex-grow: 1 !important;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                .dialog-countdown {
                    text-align: right !important;
                    color: #999 !important;
                    font-size: 12px !important;
                    margin-bottom: 10px !important;
                }
                .dialog-input {
                    width: 100% !important;
                    padding: 10px !important;
                    margin: 10px 0 !important;
                    border: 1px solid #ddd !important;
                    border-radius: 6px !important;
                    box-sizing: border-box !important;
                    font-size: 14px !important;
                }
                .dialog-input:focus {
                    outline: none !important;
                    border-color: var(--icon-color) !important;
                    box-shadow: 0 0 0 2px rgba(var(--icon-rgb), 0.2) !important;
                }
                .dialog-options {
                    margin: 15px 0 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 10px !important;
                }
                .dialog-option {
                    display: flex !important;
                    align-items: center !important;
                    padding: 10px !important;
                    border: 1px solid #eee !important;
                    border-radius: 6px !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                }
                .dialog-option:hover {
                    background-color: #f5f5f5 !important;
                    border-color: var(--icon-color) !important;
                }
                .dialog-option.selected {
                    background-color: rgba(var(--icon-rgb), 0.1) !important;
                    border-color: var(--icon-color) !important;
                }
                .dialog-option input {
                    margin-right: 10px !important;
                }
                .dialog-option label {
                    cursor: pointer !important;
                    color: var(--content-color) !important;
                    flex-grow: 1 !important;
                }
                .custom-select {
                    width: 100% !important;
                    margin: 15px 0 !important;
                    position: relative !important;
                    font-size: 14px !important;
                }
                .custom-select-trigger {
                    padding: 12px !important;
                    background: var(--dialog-bg) !important;
                    border: 1px solid #ddd !important;
                    border-radius: 6px !important;
                    cursor: pointer !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    color: var(--content-color) !important;
                    transition: all 0.2s ease !important;
                }
                .dark-mode .custom-select-trigger {
                    border-color: #555 !important;
                }
                .custom-select-trigger:hover {
                    border-color: var(--icon-color) !important;
                }
                .custom-select-arrow {
                    width: 0 !important;
                    height: 0 !important;
                    border-left: 5px solid transparent !important;
                    border-right: 5px solid transparent !important;
                    border-top: 5px solid #999 !important;
                    transition: transform 0.3s ease !important;
                }
                .custom-select.open .custom-select-arrow {
                    transform: rotate(180deg) !important;
                }
                .custom-select-options {
                    position: absolute !important;
                    top: 100% !important;
                    left: 0 !important;
                    right: 0 !important;
                    background: var(--dialog-bg) !important;
                    border: 1px solid #ddd !important;
                    border-top: none !important;
                    border-radius: 0 0 6px 6px !important;
                    max-height: 0 !important;
                    overflow: hidden !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    transition: all 0.3s ease !important;
                    z-index: 100 !important;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
                }
                .custom-select.open .custom-select-options {
                    max-height: 300px !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    overflow-y: auto !important;
                }
                .custom-select-option {
                    padding: 10px 12px !important;
                    cursor: pointer !important;
                    transition: background-color 0.2s ease !important;
                    color: var(--content-color) !important;
                }
                .custom-select-option:hover {
                    background-color: rgba(var(--icon-rgb), 0.05) !important;
                }
                .custom-select-option.selected {
                    background-color: rgba(var(--icon-rgb), 0.1) !important;
                    color: var(--icon-color) !important;
                    font-weight: 500 !important;
                }
                .dialog-buttons {
                    display: flex !important;
                    gap: 10px !important;
                    justify-content: flex-end !important;
                    margin-top: auto !important;
                }
                .dialog-btn {
                    padding: 8px 16px !important;
                    border: none !important;
                    border-radius: 6px !important;
                    color: var(--btn-text-color) !important;
                    cursor: pointer !important;
                    font-size: 14px !important;
                    transition: all 0.2s ease !important;
                }
                .dialog-btn:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
                }
                .dialog-btn-ok {
                    background: var(--btn-ok-bg) !important;
                }
                .dialog-btn-cancel {
                    background: var(--btn-cancel-bg) !important;
                }
                .dialog-btn-link {
                    background: transparent !important;
                    color: var(--btn-ok-bg) !important;
                }

                /* 角落提示 */
                .corner-toast {
                    position: fixed !important;
                    padding: 12px 20px !important;
                    border-radius: 6px !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                    z-index: 99999 !important;
                    opacity: 0 !important;
                    transform: translateX(20px) !important;
                    transition: all 0.3s ease !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                    background-color: #ffffff !important;
                    border: 1px solid #eee !important;
                    min-width: 250px !important;
                    max-width: 350px !important;
                    box-sizing: border-box !important;
                }
                .corner-toast.active {
                    opacity: 1 !important;
                    transform: translateX(0) !important;
                }
                .corner-toast.topLeft {
                    left: 20px !important;
                    top: 20px !important;
                    transform-origin: left center !important;
                }
                .corner-toast.topRight {
                    right: 20px !important;
                    top: 20px !important;
                    transform-origin: right center !important;
                }
                .corner-toast.bottomLeft {
                    left: 20px !important;
                    bottom: 20px !important;
                    transform-origin: left center !important;
                }
                .corner-toast.bottomRight {
                    right: 20px !important;
                    bottom: 20px !important;
                    transform-origin: right center !important;
                }
                .corner-toast.default {
                    background-color: #ffffff !important;
                }
                .corner-toast.success {
                    background-color: #f0f8f0 !important;
                    border-color: #4CAF50 !important;
                }
                .corner-toast.warning {
                    background-color: #fffbf0 !important;
                    border-color: #FFC107 !important;
                }
                .corner-toast.error {
                    background-color: #fef0f0 !important;
                    border-color: #F44336 !important;
                }
                .corner-toast.info {
                    background-color: #f0f7ff !important;
                    border-color: #2196F3 !important;
                }
                .corner-toast .toast-icon {
                    width: 24px !important;
                    height: 24px !important;
                    border-radius: 50% !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    flex-shrink: 0 !important;
                    font-weight: bold !important;
                    font-size: 14px !important;
                }
                .corner-toast.default .toast-icon {
                    background: rgba(51,51,51,0.1) !important;
                    color: #333 !important;
                }
                .corner-toast.success .toast-icon {
                    background: rgba(76,175,80,0.1) !important;
                    color: #4CAF50 !important;
                }
                .corner-toast.warning .toast-icon {
                    background: rgba(255,193,7,0.1) !important;
                    color: #FFC107 !important;
                }
                .corner-toast.error .toast-icon {
                    background: rgba(244,67,54,0.1) !important;
                    color: #F44336 !important;
                }
                .corner-toast.info .toast-icon {
                    background: rgba(33,150,243,0.1) !important;
                    color: #2196F3 !important;
                }
                .corner-toast .toast-content {
                    display: flex !important;
                    flex-direction: column !important;
                }
                .corner-toast .toast-title {
                    font-size: 14px !important;
                    font-weight: 600 !important;
                    margin: 0 !important;
                    color: #333 !important;
                }
                .corner-toast.success .toast-title {
                    color: #2E7D32 !important;
                }
                .corner-toast.warning .toast-title {
                    color: #FF8F00 !important;
                }
                .corner-toast.error .toast-title {
                    color: #C62828 !important;
                }
                .corner-toast.info .toast-title {
                    color: #1565C0 !important;
                }
                .corner-toast .toast-message {
                    font-size: 12px !important;
                    margin: 2px 0 0 !important;
                    color: #666 !important;
                }

                /* 控制面板（已移除自定义HTML区域） */
                .dialog-control-panel {
                    position: fixed !important;
                    top: 20px !important;
                    right: 20px !important;
                    width: 380px !important;
                    background: var(--panel-bg, #ffffff) !important;
                    border-radius: 12px !important;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
                    z-index: 99998 !important;
                    overflow: hidden !important;
                    transform: translateX(400px) !important;
                    transition: transform 0.3s ease !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    color: var(--panel-text-color, #333333) !important;
                }
                .dialog-control-panel.open {
                    transform: translateX(0) !important;
                }
                .panel-header {
                    background: var(--panel-header-bg, #9C27B0) !important;
                    color: white !important;
                    padding: 12px 20px !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    position: relative;
                }
                .panel-title {
                    font-size: 16px !important;
                    font-weight: 600 !important;
                    margin: 0 !important;
                }
                .panel-close {
                    background: none !important;
                    border: none !important;
                    color: white !important;
                    font-size: 20px !important;
                    cursor: pointer !important;
                    padding: 0 5px !important;
                }
                .panel-content {
                    padding: 20px !important;
                    max-height: 70vh !important;
                    overflow-y: auto !important;
                }
                .panel-section {
                    margin-bottom: 20px !important;
                    padding-bottom: 15px !important;
                    border-bottom: 1px solid rgba(0,0,0,0.05) !important;
                }
                .panel-section:last-child {
                    border-bottom: none !important;
                    margin-bottom: 0 !important;
                    padding-bottom: 0 !important;
                }
                .panel-section-title {
                    font-size: 14px !important;
                    font-weight: 600 !important;
                    color: var(--panel-accent-color, #9C27B0) !important;
                    margin-bottom: 10px !important;
                    padding-bottom: 5px !important;
                    border-bottom: 1px solid rgba(0,0,0,0.05) !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                }
                .panel-section-toggle {
                    font-size: 12px !important;
                    color: #999 !important;
                    cursor: pointer !important;
                }
                .panel-form-group {
                    margin-bottom: 12px !important;
                }
                .panel-label {
                    display: block !important;
                    font-size: 12px !important;
                    color: #666 !important;
                    margin-bottom: 4px !important;
                }
                .panel-input {
                    width: 100% !important;
                    padding: 8px 10px !important;
                    border: 1px solid #ddd !important;
                    border-radius: 6px !important;
                    font-size: 13px !important;
                    box-sizing: border-box !important;
                    background: white !important;
                    color: #333 !important;
                }
                .panel-input:focus {
                    outline: none !important;
                    border-color: var(--panel-accent-color, #9C27B0) !important;
                    box-shadow: 0 0 0 2px rgba(156, 39, 176, 0.1) !important;
                }
                .panel-select {
                    width: 100% !important;
                    padding: 8px 10px !important;
                    border: 1px solid #ddd !important;
                    border-radius: 6px !important;
                    font-size: 13px !important;
                    background-color: white !important;
                    box-sizing: border-box !important;
                    color: #333 !important;
                }
                .panel-color-input {
                    width: 100% !important;
                    height: 36px !important;
                    border: 1px solid #ddd !important;
                    border-radius: 6px !important;
                    padding: 2px !important;
                    box-sizing: border-box !important;
                    cursor: pointer !important;
                }
                .panel-switch {
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                }
                .switch-toggle {
                    position: relative !important;
                    width: 40px !important;
                    height: 20px !important;
                    background: #ddd !important;
                    border-radius: 10px !important;
                    cursor: pointer !important;
                    transition: background 0.2s !important;
                }
                .switch-toggle.active {
                    background: var(--panel-accent-color, #9C27B0) !important;
                }
                .switch-toggle::after {
                    content: '' !important;
                    position: absolute !important;
                    top: 2px !important;
                    left: 2px !important;
                    width: 16px !important;
                    height: 16px !important;
                    background: white !important;
                    border-radius: 50% !important;
                    transition: left 0.2s !important;
                }
                .switch-toggle.active::after {
                    left: 22px !important;
                }
                .panel-buttons {
                    display: flex !important;
                    gap: 10px !important;
                    margin-top: 15px !important;
                }
                .panel-btn {
                    flex: 1 !important;
                    padding: 8px !important;
                    border: none !important;
                    border-radius: 6px !important;
                    font-size: 13px !important;
                    cursor: pointer !important;
                    transition: all 0.2s !important;
                }
                .panel-btn-primary {
                    background: var(--panel-accent-color, #9C27B0) !important;
                    color: white !important;
                }
                .panel-btn-secondary {
                    background: #f5f5f5 !important;
                    color: #333 !important;
                }
                .panel-btn:hover {
                    opacity: 0.9 !important;
                    transform: translateY(-1px) !important;
                }
                .panel-toggle-btn {
                    position: fixed !important;
                    top: 20px !important;
                    right: 20px !important;
                    width: 48px !important;
                    height: 48px !important;
                    background: var(--panel-accent-color, #9C27B0) !important;
                    color: white !important;
                    border: none !important;
                    border-radius: 50% !important;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
                    font-size: 20px !important;
                    cursor: pointer !important;
                    z-index: 99997 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    transition: all 0.2s !important;
                }
                .panel-toggle-btn:hover {
                    transform: scale(1.05) !important;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.25) !important;
                }
                .panel-toggle-btn.hidden {
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
                .panel-collapsible-content {
                    max-height: 1000px !important;
                    overflow: hidden !important;
                    transition: max-height 0.3s ease !important;
                }
                .panel-collapsible-content.collapsed {
                    max-height: 0 !important;
                }
                .panel-preview {
                    background: #f9f9f9 !important;
                    border-radius: 8px !important;
                    padding: 15px !important;
                    margin: 10px 0 !important;
                    border: 1px solid #eee !important;
                }
                .preview-title {
                    font-size: 13px !important;
                    font-weight: 600 !important;
                    margin-bottom: 10px !important;
                    color: var(--panel-accent-color, #9C27B0) !important;
                }
                .preview-content {
                    font-size: 12px !important;
                    color: #666 !important;
                    line-height: 1.4 !important;
                    white-space: pre-wrap;
                }
                .save-indicator {
                    position: absolute !important;
                    top: 10px !important;
                    left: 20px !important;
                    font-size: 11px !important;
                    color: rgba(255,255,255,0.8) !important;
                    background: rgba(0,0,0,0.2) !important;
                    padding: 2px 8px !important;
                    border-radius: 10px !important;
                    opacity: 0 !important;
                    transition: opacity 0.3s !important;
                }
                .save-indicator.active {
                    opacity: 1 !important;
                }
            `;
            document.head.appendChild(style);
        }

        // ----- 控制面板（移除自定义HTML部分） -----
        _createControlPanel() {
            if (document.querySelector('.dialog-control-panel')) return;
            
            const panel = document.createElement('div');
            panel.className = 'dialog-control-panel';
            panel.style.setProperty('--panel-bg', this._panelConfig.panelBg);
            panel.style.setProperty('--panel-header-bg', this._panelConfig.panelHeaderBg);
            panel.style.setProperty('--panel-text-color', this._panelConfig.panelTextColor);
            panel.style.setProperty('--panel-accent-color', this._panelConfig.panelAccentColor);
            
            panel.innerHTML = `
                <div class="panel-header">
                    <h3 class="panel-title" id="panel-main-title">${this._escapeHtml(this._panelConfig.panelTitle)}</h3>
                    <span class="save-indicator" id="save-indicator">已保存</span>
                    <button class="panel-close">&times;</button>
                </div>
                <div class="panel-content">
                    <!-- 面板自定义 -->
                    <div class="panel-section">
                        <div class="panel-section-title">
                            <span>面板自定义</span>
                            <span class="panel-section-toggle" data-target="panel-customization">▼</span>
                        </div>
                        <div class="panel-collapsible-content" id="panel-customization">
                            <div class="panel-form-group">
                                <label class="panel-label">面板标题</label>
                                <input type="text" class="panel-input" id="panel-title-input" value="${this._escapeHtml(this._panelConfig.panelTitle)}">
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">面板背景色</label>
                                <input type="color" class="panel-color-input" id="panel-bg-input" value="${this._panelConfig.panelBg}">
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">标题栏背景色</label>
                                <input type="color" class="panel-color-input" id="panel-header-bg-input" value="${this._panelConfig.panelHeaderBg}">
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">文本颜色</label>
                                <input type="color" class="panel-color-input" id="panel-text-color-input" value="${this._panelConfig.panelTextColor}">
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">强调色</label>
                                <input type="color" class="panel-color-input" id="panel-accent-color-input" value="${this._panelConfig.panelAccentColor}">
                            </div>
                            <div class="panel-form-group panel-switch">
                                <label class="panel-label">显示高级选项</label>
                                <div class="switch-toggle ${this._panelConfig.showAdvancedOptions ? 'active' : ''}" id="panel-advanced-toggle"></div>
                            </div>
                            <div class="panel-form-group panel-switch">
                                <label class="panel-label">记住设置</label>
                                <div class="switch-toggle ${this._panelConfig.rememberSettings ? 'active' : ''}" id="panel-remember-toggle"></div>
                            </div>
                            <div class="panel-buttons">
                                <button class="panel-btn panel-btn-primary" id="panel-apply-settings">应用设置</button>
                                <button class="panel-btn panel-btn-secondary" id="panel-reset-settings">重置默认</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 基础设置 -->
                    <div class="panel-section">
                        <div class="panel-section-title">
                            <span>基础设置</span>
                            <span class="panel-section-toggle" data-target="basic-settings">▼</span>
                        </div>
                        <div class="panel-collapsible-content" id="basic-settings">
                            <div class="panel-form-group">
                                <label class="panel-label">弹窗标题</label>
                                <input type="text" class="panel-input" id="panel-dialog-title" placeholder="弹窗标题" value="测试弹窗">
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">弹窗内容</label>
                                <textarea class="panel-input" id="panel-dialog-content" rows="3" placeholder="弹窗内容">这是一个测试弹窗内容，可以在这里输入任何文本。</textarea>
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">弹窗位置</label>
                                <select class="panel-select" id="panel-dialog-position">
                                    <option value="center">居中</option>
                                    <option value="top">顶部</option>
                                    <option value="bottom">底部</option>
                                    <option value="topLeft">左上角</option>
                                    <option value="topRight">右上角</option>
                                    <option value="bottomLeft">左下角</option>
                                    <option value="bottomRight">右下角</option>
                                </select>
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">动画效果</label>
                                <select class="panel-select" id="panel-dialog-animation">
                                    <option value="pop">弹出</option>
                                    <option value="fade">渐变</option>
                                    <option value="scale">缩放</option>
                                    <option value="drop">下落弹跳</option>
                                    <option value="slideLeft">左侧滑入</option>
                                    <option value="slideRight">右侧滑入</option>
                                    <option value="rotate">旋转进入</option>
                                    <option value="bounce">弹性缩放</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 样式设置 -->
                    <div class="panel-section">
                        <div class="panel-section-title">
                            <span>样式设置</span>
                            <span class="panel-section-toggle" data-target="style-settings">▼</span>
                        </div>
                        <div class="panel-collapsible-content" id="style-settings">
                            <div class="panel-form-group">
                                <label class="panel-label">背景颜色</label>
                                <input type="color" class="panel-color-input" id="panel-bg-color" value="${this._styles.dialogBg}">
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">标题颜色</label>
                                <input type="color" class="panel-color-input" id="panel-title-color" value="${this._styles.titleColor}">
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">内容颜色</label>
                                <input type="color" class="panel-color-input" id="panel-content-color" value="${this._styles.contentColor}">
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">确认按钮颜色</label>
                                <input type="color" class="panel-color-input" id="panel-ok-color" value="${this._styles.btnOkBg}">
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">取消按钮颜色</label>
                                <input type="color" class="panel-color-input" id="panel-cancel-color" value="${this._styles.btnCancelBg}">
                            </div>
                            
                            <!-- 高级样式 -->
                            <div id="advanced-style-options" ${this._panelConfig.showAdvancedOptions ? '' : 'style="display:none;"'}>
                                <div class="panel-form-group">
                                    <label class="panel-label">弹窗宽度 (px)</label>
                                    <input type="number" class="panel-input" id="panel-width" min="100" max="800" value="${this._styles.width}">
                                </div>
                                <div class="panel-form-group">
                                    <label class="panel-label">弹窗高度</label>
                                    <input type="text" class="panel-input" id="panel-height" placeholder="auto 或 px值" value="${this._styles.height}">
                                </div>
                                <div class="panel-form-group">
                                    <label class="panel-label">圆角半径 (px)</label>
                                    <input type="number" class="panel-input" id="panel-border-radius" min="0" max="50" value="${this._styles.borderRadius}">
                                </div>
                                <div class="panel-form-group">
                                    <label class="panel-label">动画时长 (ms)</label>
                                    <input type="number" class="panel-input" id="panel-animation-duration" min="100" max="3000" value="${this._styles.animDuration}">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 功能设置（移除自定义HTML） -->
                    <div class="panel-section">
                        <div class="panel-section-title">
                            <span>功能设置</span>
                            <span class="panel-section-toggle" data-target="function-settings">▼</span>
                        </div>
                        <div class="panel-collapsible-content" id="function-settings">
                            <div class="panel-form-group panel-switch">
                                <label class="panel-label">显示阴影</label>
                                <div class="switch-toggle ${this._styles.shadow ? 'active' : ''}" id="panel-shadow-toggle"></div>
                            </div>
                            <div class="panel-form-group panel-switch">
                                <label class="panel-label">显示边框</label>
                                <div class="switch-toggle ${this._styles.border ? 'active' : ''}" id="panel-border-toggle"></div>
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">倒计时关闭（秒）</label>
                                <input type="number" class="panel-input" id="panel-countdown" min="0" max="60" value="${this._styles.countdown}" placeholder="0表示不自动关闭">
                            </div>
                        </div>
                    </div>
                    
                    <!-- 弹窗类型 -->
                    <div class="panel-section">
                        <div class="panel-section-title">
                            <span>弹窗类型</span>
                            <span class="panel-section-toggle" data-target="dialog-types">▼</span>
                        </div>
                        <div class="panel-collapsible-content" id="dialog-types">
                            <div class="panel-buttons">
                                <button class="panel-btn panel-btn-primary" id="panel-show-alert">普通弹窗</button>
                                <button class="panel-btn panel-btn-secondary" id="panel-show-confirm">确认弹窗</button>
                            </div>
                            <div class="panel-buttons" style="margin-top: 8px !important;">
                                <button class="panel-btn panel-btn-secondary" id="panel-show-success">成功弹窗</button>
                                <button class="panel-btn panel-btn-secondary" id="panel-show-warning">警告弹窗</button>
                            </div>
                            <div class="panel-buttons" style="margin-top: 8px !important;">
                                <button class="panel-btn panel-btn-secondary" id="panel-show-error">错误弹窗</button>
                                <button class="panel-btn panel-btn-secondary" id="panel-show-info">信息弹窗</button>
                            </div>
                            <div class="panel-buttons" style="margin-top: 8px !important;">
                                <button class="panel-btn panel-btn-secondary" id="panel-show-custom">自定义弹窗</button>
                                <button class="panel-btn panel-btn-secondary" id="panel-show-option">选项弹窗</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 角落提示 -->
                    <div class="panel-section">
                        <div class="panel-section-title">
                            <span>角落提示</span>
                            <span class="panel-section-toggle" data-target="toast-settings">▼</span>
                        </div>
                        <div class="panel-collapsible-content" id="toast-settings">
                            <div class="panel-form-group">
                                <label class="panel-label">提示标题</label>
                                <input type="text" class="panel-input" id="panel-toast-title" placeholder="提示标题" value="提示信息">
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">提示内容</label>
                                <input type="text" class="panel-input" id="panel-toast-message" placeholder="提示内容" value="这是一条角落提示信息">
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">提示位置</label>
                                <select class="panel-select" id="panel-toast-position">
                                    <option value="topRight">右上角</option>
                                    <option value="topLeft">左上角</option>
                                    <option value="bottomRight">右下角</option>
                                    <option value="bottomLeft">左下角</option>
                                </select>
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">提示类型</label>
                                <select class="panel-select" id="panel-toast-type">
                                    <option value="default">默认</option>
                                    <option value="success">成功</option>
                                    <option value="warning">警告</option>
                                    <option value="error">错误</option>
                                    <option value="info">信息</option>
                                </select>
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">显示时长（秒）</label>
                                <input type="number" class="panel-input" id="panel-toast-duration" min="1" max="10" value="3">
                            </div>
                            <div class="panel-buttons">
                                <button class="panel-btn panel-btn-primary" id="panel-show-toast">显示提示</button>
                                <button class="panel-btn panel-btn-secondary" id="panel-clear-toasts">清除所有提示</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 数据管理 -->
                    <div class="panel-section">
                        <div class="panel-section-title">
                            <span>数据管理</span>
                            <span class="panel-section-toggle" data-target="data-management">▼</span>
                        </div>
                        <div class="panel-collapsible-content" id="data-management">
                            <div class="panel-form-group">
                                <label class="panel-label">导出当前配置</label>
                                <button class="panel-btn panel-btn-secondary" id="panel-export-config" style="width:100% !important;">导出JSON</button>
                            </div>
                            <div class="panel-form-group">
                                <label class="panel-label">导入配置</label>
                                <textarea class="code-editor" id="panel-import-config" placeholder="粘贴JSON配置内容"></textarea>
                            </div>
                            <div class="panel-buttons">
                                <button class="panel-btn panel-btn-primary" id="panel-import-btn">导入配置</button>
                                <button class="panel-btn panel-btn-secondary" id="panel-clear-all">清除所有数据</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
            
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'panel-toggle-btn';
            toggleBtn.innerHTML = '⚙';
            toggleBtn.title = '打开控制面板';
            toggleBtn.style.background = this._panelConfig.panelAccentColor;
            document.body.appendChild(toggleBtn);
            
            this._bindPanelEvents(panel, toggleBtn);
        }

        // 绑定面板事件（移除HTML预览相关）
        _bindPanelEvents(panel, toggleBtn) {
            const closeBtn = panel.querySelector('.panel-close');
            const shadowToggle = panel.querySelector('#panel-shadow-toggle');
            const borderToggle = panel.querySelector('#panel-border-toggle');
            const advancedToggle = panel.querySelector('#panel-advanced-toggle');
            const rememberToggle = panel.querySelector('#panel-remember-toggle');
            
            // 折叠
            const sectionToggles = panel.querySelectorAll('.panel-section-toggle');
            sectionToggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const targetId = toggle.getAttribute('data-target');
                    const targetContent = panel.querySelector(`#${targetId}`);
                    if (targetContent) {
                        targetContent.classList.toggle('collapsed');
                        toggle.textContent = targetContent.classList.contains('collapsed') ? '▶' : '▼';
                    }
                });
            });
            
            // 面板开关
            toggleBtn.addEventListener('click', () => {
                panel.classList.add('open');
                toggleBtn.classList.add('hidden');
                this._panelOpen = true;
            });
            
            closeBtn.addEventListener('click', () => {
                panel.classList.remove('open');
                toggleBtn.classList.remove('hidden');
                this._panelOpen = false;
                if (this._panelConfig.rememberSettings) this._saveSettings();
            });
            
            // 开关切换
            shadowToggle.addEventListener('click', () => {
                shadowToggle.classList.toggle('active');
            });
            borderToggle.addEventListener('click', () => {
                borderToggle.classList.toggle('active');
            });
            
            advancedToggle.addEventListener('click', () => {
                advancedToggle.classList.toggle('active');
                const showAdvanced = advancedToggle.classList.contains('active');
                this._panelConfig.showAdvancedOptions = showAdvanced;
                const advOptions = panel.querySelector('#advanced-style-options');
                if (advOptions) advOptions.style.display = showAdvanced ? 'block' : 'none';
                if (this._panelConfig.rememberSettings) {
                    this._saveSettings();
                    this._showSaveIndicator(panel);
                }
            });
            
            rememberToggle.addEventListener('click', () => {
                rememberToggle.classList.toggle('active');
                this._panelConfig.rememberSettings = rememberToggle.classList.contains('active');
                this._showSaveIndicator(panel);
            });
            
            // 应用面板自定义
            const applySettingsBtn = panel.querySelector('#panel-apply-settings');
            applySettingsBtn.addEventListener('click', () => {
                const panelTitleInput = panel.querySelector('#panel-title-input');
                const panelBgInput = panel.querySelector('#panel-bg-input');
                const panelHeaderBgInput = panel.querySelector('#panel-header-bg-input');
                const panelTextColorInput = panel.querySelector('#panel-text-color-input');
                const panelAccentColorInput = panel.querySelector('#panel-accent-color-input');
                
                if (panelTitleInput) this._panelConfig.panelTitle = panelTitleInput.value;
                if (panelBgInput) this._panelConfig.panelBg = panelBgInput.value;
                if (panelHeaderBgInput) this._panelConfig.panelHeaderBg = panelHeaderBgInput.value;
                if (panelTextColorInput) this._panelConfig.panelTextColor = panelTextColorInput.value;
                if (panelAccentColorInput) this._panelConfig.panelAccentColor = panelAccentColorInput.value;
                
                panel.style.setProperty('--panel-bg', this._panelConfig.panelBg);
                panel.style.setProperty('--panel-header-bg', this._panelConfig.panelHeaderBg);
                panel.style.setProperty('--panel-text-color', this._panelConfig.panelTextColor);
                panel.style.setProperty('--panel-accent-color', this._panelConfig.panelAccentColor);
                
                const panelTitle = panel.querySelector('#panel-main-title');
                if (panelTitle) panelTitle.textContent = this._panelConfig.panelTitle;
                toggleBtn.style.background = this._panelConfig.panelAccentColor;
                
                if (this._panelConfig.rememberSettings) {
                    this._saveSettings();
                    this._showSaveIndicator(panel);
                }
                
                this.showCornerToast({
                    TITLE: '设置已应用',
                    MESSAGE: '面板自定义设置已生效',
                    POSITION: 'topRight',
                    TYPE: 'success',
                    AUTO_CLOSE: 'true',
                    SECONDS: 2
                });
            });
            
            // 重置
            const resetSettingsBtn = panel.querySelector('#panel-reset-settings');
            resetSettingsBtn.addEventListener('click', () => {
                const defaultConfig = {
                    panelTitle: '弹窗控制面板',
                    panelBg: '#ffffff',
                    panelHeaderBg: '#9C27B0',
                    panelTextColor: '#333333',
                    panelAccentColor: '#9C27B0',
                    showAdvancedOptions: true,
                    rememberSettings: true
                };
                Object.assign(this._panelConfig, defaultConfig);
                panel.querySelector('#panel-title-input').value = defaultConfig.panelTitle;
                panel.querySelector('#panel-bg-input').value = defaultConfig.panelBg;
                panel.querySelector('#panel-header-bg-input').value = defaultConfig.panelHeaderBg;
                panel.querySelector('#panel-text-color-input').value = defaultConfig.panelTextColor;
                panel.querySelector('#panel-accent-color-input').value = defaultConfig.panelAccentColor;
                applySettingsBtn.click();
                this.showCornerToast({
                    TITLE: '已重置默认',
                    MESSAGE: '面板设置已恢复默认值',
                    POSITION: 'topRight',
                    TYPE: 'info',
                    AUTO_CLOSE: 'true',
                    SECONDS: 2
                });
            });
            
            // 导出配置
            const exportConfigBtn = panel.querySelector('#panel-export-config');
            exportConfigBtn.addEventListener('click', () => {
                const settings = {
                    styles: {...this._styles},
                    panelConfig: {...this._panelConfig}
                };
                const jsonStr = JSON.stringify(settings, null, 2);
                const blob = new Blob([jsonStr], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dialog-settings-${new Date().getTime()}.json`;
                a.click();
                URL.revokeObjectURL(url);
                this._showSaveIndicator(panel);
            });
            
            // 导入配置
            const importBtn = panel.querySelector('#panel-import-btn');
            importBtn.addEventListener('click', () => {
                const importTextarea = panel.querySelector('#panel-import-config');
                try {
                    const settings = JSON.parse(importTextarea.value);
                    if (settings.styles) Object.assign(this._styles, settings.styles);
                    if (settings.panelConfig) Object.assign(this._panelConfig, settings.panelConfig);
                    
                    panel.querySelector('#panel-bg-color').value = this._styles.dialogBg;
                    panel.querySelector('#panel-title-color').value = this._styles.titleColor;
                    panel.querySelector('#panel-content-color').value = this._styles.contentColor;
                    panel.querySelector('#panel-ok-color').value = this._styles.btnOkBg;
                    panel.querySelector('#panel-cancel-color').value = this._styles.btnCancelBg;
                    panel.querySelector('#panel-width').value = this._styles.width;
                    panel.querySelector('#panel-height').value = this._styles.height;
                    panel.querySelector('#panel-border-radius').value = this._styles.borderRadius;
                    panel.querySelector('#panel-animation-duration').value = this._styles.animDuration;
                    panel.querySelector('#panel-countdown').value = this._styles.countdown;
                    
                    shadowToggle.className = 'switch-toggle' + (this._styles.shadow ? ' active' : '');
                    borderToggle.className = 'switch-toggle' + (this._styles.border ? ' active' : '');
                    advancedToggle.className = 'switch-toggle' + (this._panelConfig.showAdvancedOptions ? ' active' : '');
                    rememberToggle.className = 'switch-toggle' + (this._panelConfig.rememberSettings ? ' active' : '');
                    
                    applySettingsBtn.click();
                    
                    this.showCornerToast({
                        TITLE: '配置导入成功',
                        MESSAGE: '已成功导入设置配置',
                        POSITION: 'topRight',
                        TYPE: 'success',
                        AUTO_CLOSE: 'true',
                        SECONDS: 2
                    });
                } catch (e) {
                    this.showCornerToast({
                        TITLE: '导入失败',
                        MESSAGE: `JSON格式错误: ${e.message}`,
                        POSITION: 'topRight',
                        TYPE: 'error',
                        AUTO_CLOSE: 'true',
                        SECONDS: 3
                    });
                }
            });
            
            // 清除所有数据
            const clearAllBtn = panel.querySelector('#panel-clear-all');
            clearAllBtn.addEventListener('click', () => {
                if (confirm('确定要清除所有保存的数据吗？此操作不可恢复！')) {
                    localStorage.removeItem('dialogWorkshopSecureSettings');
                    this._showSaveIndicator(panel);
                    this.showCornerToast({
                        TITLE: '数据已清除',
                        MESSAGE: '所有保存的设置已删除',
                        POSITION: 'topRight',
                        TYPE: 'warning',
                        AUTO_CLOSE: 'true',
                        SECONDS: 2
                    });
                }
            });
            
            // 获取表单数据
            const getFormData = () => {
                return {
                    title: panel.querySelector('#panel-dialog-title').value,
                    content: panel.querySelector('#panel-dialog-content').value,
                    position: panel.querySelector('#panel-dialog-position').value,
                    animation: panel.querySelector('#panel-dialog-animation').value,
                    bgColor: panel.querySelector('#panel-bg-color').value,
                    titleColor: panel.querySelector('#panel-title-color').value,
                    contentColor: panel.querySelector('#panel-content-color').value,
                    okColor: panel.querySelector('#panel-ok-color').value,
                    cancelColor: panel.querySelector('#panel-cancel-color').value,
                    shadow: shadowToggle.classList.contains('active'),
                    border: borderToggle.classList.contains('active'),
                    countdown: parseInt(panel.querySelector('#panel-countdown').value) || 0,
                    animationDuration: parseInt(panel.querySelector('#panel-animation-duration').value) || 500,
                    width: parseInt(panel.querySelector('#panel-width').value) || 300,
                    height: panel.querySelector('#panel-height').value || 'auto',
                    borderRadius: parseInt(panel.querySelector('#panel-border-radius').value) || 12,
                    toastTitle: panel.querySelector('#panel-toast-title').value,
                    toastMessage: panel.querySelector('#panel-toast-message').value,
                    toastPosition: panel.querySelector('#panel-toast-position').value,
                    toastType: panel.querySelector('#panel-toast-type').value,
                    toastDuration: parseInt(panel.querySelector('#panel-toast-duration').value) || 3
                };
            };
            
            const applyStyles = (data) => {
                this._styles.dialogBg = data.bgColor;
                this._styles.titleColor = data.titleColor;
                this._styles.contentColor = data.contentColor;
                this._styles.btnOkBg = data.okColor;
                this._styles.btnCancelBg = data.cancelColor;
                this._styles.position = data.position;
                this._styles.animType = data.animation;
                this._styles.shadow = data.shadow;
                this._styles.border = data.border;
                this._styles.countdown = data.countdown;
                this._styles.animDuration = data.animationDuration;
                this._styles.width = data.width;
                this._styles.height = data.height;
                this._styles.borderRadius = data.borderRadius;
                if (this._panelConfig.rememberSettings) this._saveSettings();
            };
            
            // 各弹窗按钮
            panel.querySelector('#panel-show-alert').addEventListener('click', () => {
                const data = getFormData();
                applyStyles(data);
                this.showAlert({
                    TITLE: data.title,
                    CONTENT: data.content,
                    BTN: '确定'
                });
            });
            
            panel.querySelector('#panel-show-confirm').addEventListener('click', () => {
                const data = getFormData();
                applyStyles(data);
                this.showConfirm({
                    TITLE: data.title,
                    CONTENT: data.content
                }).then(result => {
                    if (result !== null) {
                        this.showCornerToast({
                            TITLE: '选择结果',
                            MESSAGE: result ? '用户点击了确定' : '用户点击了取消',
                            POSITION: 'topRight',
                            TYPE: 'info',
                            AUTO_CLOSE: 'true',
                            SECONDS: 3
                        });
                    }
                });
            });
            
            panel.querySelector('#panel-show-success').addEventListener('click', () => {
                const data = getFormData();
                applyStyles(data);
                this.showSuccessDialog({
                    TITLE: data.title,
                    CONTENT: data.content
                });
            });
            
            panel.querySelector('#panel-show-warning').addEventListener('click', () => {
                const data = getFormData();
                applyStyles(data);
                this.showWarningDialog({
                    TITLE: data.title,
                    CONTENT: data.content
                });
            });
            
            panel.querySelector('#panel-show-error').addEventListener('click', () => {
                const data = getFormData();
                applyStyles(data);
                this.showErrorDialog({
                    TITLE: data.title,
                    CONTENT: data.content
                });
            });
            
            panel.querySelector('#panel-show-info').addEventListener('click', () => {
                const data = getFormData();
                applyStyles(data);
                this.showInfoDialog({
                    TITLE: data.title,
                    CONTENT: data.content
                });
            });
            
            panel.querySelector('#panel-show-custom').addEventListener('click', () => {
                const data = getFormData();
                applyStyles(data);
                this.showCustomDialog({
                    TITLE: data.title,
                    CONTENT: data.content,
                    BTN1: '按钮A',
                    BTN2: '按钮B'
                }).then(result => {
                    this.showCornerToast({
                        TITLE: '按钮点击',
                        MESSAGE: `点击了${result.buttonText}`,
                        POSITION: 'topRight',
                        TYPE: 'info',
                        AUTO_CLOSE: 'true',
                        SECONDS: 2
                    });
                });
            });
            
            panel.querySelector('#panel-show-option').addEventListener('click', () => {
                const data = getFormData();
                applyStyles(data);
                this.showOptionDialog({
                    TITLE: data.title,
                    PROMPT: data.content,
                    OPTIONS: '选项1|选项2|选项3|选项4|自定义选项'
                }).then(result => {
                    if (result) {
                        this.showCornerToast({
                            TITLE: '选择结果',
                            MESSAGE: `选择了: ${result}`,
                            POSITION: 'topRight',
                            TYPE: 'success',
                            AUTO_CLOSE: 'true',
                            SECONDS: 2
                        });
                    }
                });
            });
            
            panel.querySelector('#panel-show-toast').addEventListener('click', () => {
                const data = getFormData();
                this.showCornerToast({
                    TITLE: data.toastTitle,
                    MESSAGE: data.toastMessage,
                    POSITION: data.toastPosition,
                    TYPE: data.toastType,
                    AUTO_CLOSE: 'true',
                    SECONDS: data.toastDuration
                });
            });
            
            panel.querySelector('#panel-clear-toasts').addEventListener('click', () => {
                this.clearAllToasts();
                this.showCornerToast({
                    TITLE: '已清除',
                    MESSAGE: '所有角落提示已清除',
                    POSITION: 'topRight',
                    TYPE: 'info',
                    AUTO_CLOSE: 'true',
                    SECONDS: 2
                });
            });
        }

        _showSaveIndicator(panel) {
            const indicator = panel.querySelector('#save-indicator');
            if (indicator) {
                indicator.classList.add('active');
                setTimeout(() => indicator.classList.remove('active'), 1500);
            }
        }

        // ===== 修改点：扩展 ID 已改为 'dialogWorkshopSecure' =====
        getInfo() {
            return {
                id: 'dialogWorkshopSecure',
                color1: '#9C27B0',
                color2: '#7B1FA2',
                name: '灵动弹窗工坊',
                blocks: [
                    // 面板控制
                    { blockType: BlockType.LABEL, text: '面板控制' },
                    { opcode: 'openControlPanel', blockType: BlockType.COMMAND, text: '打开控制面板' },
                    { opcode: 'closeControlPanel', blockType: BlockType.COMMAND, text: '关闭控制面板' },
                    { opcode: 'savePanelSettings', blockType: BlockType.COMMAND, text: '保存面板设置' },
                    { opcode: 'resetPanelSettings', blockType: BlockType.COMMAND, text: '重置面板设置' },
                    
                    // 样式配置
                    { blockType: BlockType.LABEL, text: '样式配置' },
                    { opcode: 'setDialogBg', blockType: BlockType.COMMAND, text: '设置弹窗背景色为[COLOR]', arguments: { COLOR: {type: ArgumentType.COLOR, defaultValue: '#ffffff'} } },
                    { opcode: 'setTitleColor', blockType: BlockType.COMMAND, text: '设置标题颜色为[COLOR]', arguments: { COLOR: {type: ArgumentType.COLOR, defaultValue: '#333333'} } },
                    { opcode: 'setContentColor', blockType: BlockType.COMMAND, text: '设置内容颜色为[COLOR]', arguments: { COLOR: {type: ArgumentType.COLOR, defaultValue: '#666666'} } },
                    { opcode: 'setBtnColors', blockType: BlockType.COMMAND, text: '设置按钮颜色 确认[OK_COLOR] 取消[CANCEL_COLOR]', arguments: { OK_COLOR: {type: ArgumentType.COLOR, defaultValue: '#4CAF50'}, CANCEL_COLOR: {type: ArgumentType.COLOR, defaultValue: '#9E9E9E'} } },
                    
                    // 外观设置
                    { blockType: BlockType.LABEL, text: '外观设置' },
                    { opcode: 'setDialogSize', blockType: BlockType.COMMAND, text: '设置弹窗大小 宽度[WIDTH] 高度[HEIGHT]', arguments: { WIDTH: {type: ArgumentType.NUMBER, defaultValue: 300, min: 100, max: 800}, HEIGHT: {type: ArgumentType.STRING, defaultValue: 'auto'} } },
                    { opcode: 'setDialogPosition', blockType: BlockType.COMMAND, text: '设置弹窗位置为[POSITION]', arguments: { POSITION: {type: ArgumentType.STRING, menu: 'positionTypes', defaultValue: 'center'} } },
                    { opcode: 'toggleDialogEffects', blockType: BlockType.COMMAND, text: '弹窗效果 阴影[SHADOW] 边框[BORDER]', arguments: { SHADOW: {type: ArgumentType.STRING, menu: 'switchOptions', defaultValue: 'true'}, BORDER: {type: ArgumentType.STRING, menu: 'switchOptions', defaultValue: 'true'} } },
                    { opcode: 'setBorderRadius', blockType: BlockType.COMMAND, text: '设置弹窗圆角为[RADIUS]px', arguments: { RADIUS: {type: ArgumentType.NUMBER, defaultValue: 12, min: 0, max: 50} } },
                    
                    // 动画设置
                    { blockType: BlockType.LABEL, text: '动画设置' },
                    { opcode: 'setAnimType', blockType: BlockType.COMMAND, text: '设置弹窗动画为[ANIM]', arguments: { ANIM: {type: ArgumentType.STRING, menu: 'animTypes', defaultValue: 'pop'} } },
                    { opcode: 'setAnimDuration', blockType: BlockType.COMMAND, text: '设置动画时长为[DURATION]毫秒', arguments: { DURATION: {type: ArgumentType.NUMBER, defaultValue: 500, min: 100, max: 2000} } },
                    
                    // 特殊功能
                    { blockType: BlockType.LABEL, text: '特殊功能' },
                    { opcode: 'setCountdownClose', blockType: BlockType.COMMAND, text: '设置弹窗倒计时关闭为[SECONDS]秒', arguments: { SECONDS: {type: ArgumentType.NUMBER, defaultValue: 0, min: 0, max: 60} } },
                    
                    // 快捷弹窗
                    { blockType: BlockType.LABEL, text: '快捷弹窗' },
                    { opcode: 'showSuccessDialog', blockType: BlockType.COMMAND, text: '显示成功弹窗 标题[TITLE] 内容[CONTENT]', arguments: { TITLE: {type: ArgumentType.STRING, defaultValue: '成功'}, CONTENT: {type: ArgumentType.STRING, defaultValue: '操作成功完成！'} } },
                    { opcode: 'showWarningDialog', blockType: BlockType.COMMAND, text: '显示警告弹窗 标题[TITLE] 内容[CONTENT]', arguments: { TITLE: {type: ArgumentType.STRING, defaultValue: '警告'}, CONTENT: {type: ArgumentType.STRING, defaultValue: '请注意此操作的风险！'} } },
                    { opcode: 'showErrorDialog', blockType: BlockType.COMMAND, text: '显示错误弹窗 标题[TITLE] 内容[CONTENT]', arguments: { TITLE: {type: ArgumentType.STRING, defaultValue: '错误'}, CONTENT: {type: ArgumentType.STRING, defaultValue: '操作失败，请重试！'} } },
                    { opcode: 'showInfoDialog', blockType: BlockType.COMMAND, text: '显示信息弹窗 标题[TITLE] 内容[CONTENT]', arguments: { TITLE: {type: ArgumentType.STRING, defaultValue: '信息'}, CONTENT: {type: ArgumentType.STRING, defaultValue: '这是一条重要信息！'} } },
                    
                    // 通用弹窗
                    { blockType: BlockType.LABEL, text: '通用弹窗' },
                    { opcode: 'showAlert', blockType: BlockType.COMMAND, text: '显示提示弹窗 标题[TITLE] 内容[CONTENT] 按钮[BTN]', arguments: { TITLE: {type: ArgumentType.STRING, defaultValue: '提示'}, CONTENT: {type: ArgumentType.STRING, defaultValue: '操作成功！'}, BTN: {type: ArgumentType.STRING, defaultValue: '确定'} } },
                    { opcode: 'showConfirm', blockType: BlockType.BOOLEAN, text: '显示确认弹窗 标题[TITLE] 内容[CONTENT]', arguments: { TITLE: {type: ArgumentType.STRING, defaultValue: '确认'}, CONTENT: {type: ArgumentType.STRING, defaultValue: '确定要执行此操作吗？'} } },
                    { opcode: 'showPrompt', blockType: BlockType.REPORTER, text: '显示输入弹窗 标题[TITLE] 提示[PROMPT] 默认值[DEFAULT]', arguments: { TITLE: {type: ArgumentType.STRING, defaultValue: '输入'}, PROMPT: {type: ArgumentType.STRING, defaultValue: '请输入内容:'}, DEFAULT: {type: ArgumentType.STRING, defaultValue: ''} } },
                    
                    // 选项弹窗
                    { blockType: BlockType.LABEL, text: '选项弹窗' },
                    { opcode: 'showOptionDialog', blockType: BlockType.REPORTER, text: '显示选项弹窗 标题[TITLE] 提示[PROMPT] 选项[OPTIONS]', arguments: { TITLE: {type: ArgumentType.STRING, defaultValue: '选择'}, PROMPT: {type: ArgumentType.STRING, defaultValue: '请选择一项:'}, OPTIONS: {type: ArgumentType.STRING, defaultValue: '简单|中等|困难|专家'} } },
                    { opcode: 'showSelectDialog', blockType: BlockType.REPORTER, text: '显示下拉选择弹窗 标题[TITLE] 提示[PROMPT] 选项[OPTIONS]', arguments: { TITLE: {type: ArgumentType.STRING, defaultValue: '选择'}, PROMPT: {type: ArgumentType.STRING, defaultValue: '请选择一项:'}, OPTIONS: {type: ArgumentType.STRING, defaultValue: '简单|中等|困难|专家'} } },
                    
                    // 自定义弹窗
                    { blockType: BlockType.LABEL, text: '自定义弹窗' },
                    { opcode: 'showCustomDialog', blockType: BlockType.COMMAND, text: '显示自定义弹窗 标题[TITLE] 内容[CONTENT] 按钮1[BTN1] 按钮2[BTN2]', arguments: { TITLE: {type: ArgumentType.STRING, defaultValue: '自定义弹窗'}, CONTENT: {type: ArgumentType.STRING, defaultValue: '这是自定义内容'}, BTN1: {type: ArgumentType.STRING, defaultValue: '按钮1'}, BTN2: {type: ArgumentType.STRING, defaultValue: '按钮2'} } },
                    
                    // 控制功能
                    { blockType: BlockType.LABEL, text: '控制功能' },
                    { opcode: 'closeDialog', blockType: BlockType.COMMAND, text: '关闭当前弹窗' },
                    { opcode: 'closeAllDialogs', blockType: BlockType.COMMAND, text: '关闭所有弹窗' },
                    
                    // 角落提示
                    { blockType: BlockType.LABEL, text: '角落提示配置' },
                    { opcode: 'showCornerToast', blockType: BlockType.COMMAND, text: '显示角落提示 标题[TITLE] 消息[MESSAGE] 位置[POSITION] 类型[TYPE] 自动关闭[AUTO_CLOSE] 时间[SECONDS] 秒', arguments: { TITLE: {type: ArgumentType.STRING, defaultValue: '提示'}, MESSAGE: {type: ArgumentType.STRING, defaultValue: '这是一条角落提示'}, POSITION: {type: ArgumentType.STRING, menu: 'cornerPositionTypes', defaultValue: 'topRight'}, TYPE: {type: ArgumentType.STRING, menu: 'cornerTypeTypes', defaultValue: 'default'}, AUTO_CLOSE: {type: ArgumentType.STRING, menu: 'switchOptions', defaultValue: 'true'}, SECONDS: {type: ArgumentType.NUMBER, defaultValue: 3, min: 1, max: 10} } },
                    { opcode: 'clearAllToasts', blockType: BlockType.COMMAND, text: '清除所有角落提示' },
                    
                    // 数据管理
                    { blockType: BlockType.LABEL, text: '数据管理' },
                    { opcode: 'exportSettings', blockType: BlockType.REPORTER, text: '导出当前设置为JSON' },
                    { opcode: 'importSettings', blockType: BlockType.COMMAND, text: '从JSON导入设置[JSON]', arguments: { JSON: {type: ArgumentType.STRING, defaultValue: '{"styles":{},"panelConfig":{}}'} } },
                    
                    // 安全检测
                    { blockType: BlockType.LABEL, text: '安全检测' },
                    {
                        opcode: 'integrityCheck',
                        blockType: BlockType.BOOLEAN,
                        text: '检测自身完整性'
                    }
                ],
                menus: {
                    animTypes: ANIM_TYPES,
                    positionTypes: POSITION_TYPES,
                    switchOptions: SWITCH_OPTIONS,
                    cornerPositionTypes: CORNER_POSITION_TYPES,
                    cornerTypeTypes: CORNER_TYPE_TYPES
                }
            };
        }

        // ----- 面板控制方法 -----
        openControlPanel() {
            this._createControlPanel();
            const panel = document.querySelector('.dialog-control-panel');
            const toggleBtn = document.querySelector('.panel-toggle-btn');
            if (panel && toggleBtn) {
                panel.classList.add('open');
                toggleBtn.classList.add('hidden');
                this._panelOpen = true;
            }
        }

        closeControlPanel() {
            const panel = document.querySelector('.dialog-control-panel');
            const toggleBtn = document.querySelector('.panel-toggle-btn');
            if (panel && toggleBtn) {
                panel.classList.remove('open');
                toggleBtn.classList.remove('hidden');
                this._panelOpen = false;
                if (this._panelConfig.rememberSettings) this._saveSettings();
            }
        }

        savePanelSettings() {
            this._saveSettings();
            this.showCornerToast({
                TITLE: '设置已保存',
                MESSAGE: '当前配置已保存到本地',
                POSITION: 'topRight',
                TYPE: 'success',
                AUTO_CLOSE: 'true',
                SECONDS: 2
            });
        }

        resetPanelSettings() {
            const defaultStyles = {
                dialogBg: '#ffffff',
                titleColor: '#333333',
                contentColor: '#666666',
                btnOkBg: '#4CAF50',
                btnCancelBg: '#9E9E9E',
                btnTextColor: '#ffffff',
                animType: 'pop',
                animDuration: 500,
                width: 300,
                height: 'auto',
                borderRadius: 12,
                position: 'center',
                shadow: true,
                border: true,
                countdown: 0,
                darkMode: false
            };
            const defaultPanelConfig = {
                panelTitle: '弹窗控制面板',
                panelBg: '#ffffff',
                panelHeaderBg: '#9C27B0',
                panelTextColor: '#333333',
                panelAccentColor: '#9C27B0',
                showAdvancedOptions: true,
                rememberSettings: true
            };
            Object.assign(this._styles, defaultStyles);
            Object.assign(this._panelConfig, defaultPanelConfig);
            this._saveSettings();
            
            const panel = document.querySelector('.dialog-control-panel');
            if (panel) {
                panel.style.setProperty('--panel-bg', this._panelConfig.panelBg);
                panel.style.setProperty('--panel-header-bg', this._panelConfig.panelHeaderBg);
                panel.style.setProperty('--panel-text-color', this._panelConfig.panelTextColor);
                panel.style.setProperty('--panel-accent-color', this._panelConfig.panelAccentColor);
                const toggleBtn = document.querySelector('.panel-toggle-btn');
                if (toggleBtn) toggleBtn.style.background = this._panelConfig.panelAccentColor;
            }
            this.showCornerToast({
                TITLE: '设置已重置',
                MESSAGE: '所有设置已恢复为默认值',
                POSITION: 'topRight',
                TYPE: 'info',
                AUTO_CLOSE: 'true',
                SECONDS: 2
            });
        }

        // ----- 样式设置方法 -----
        setDialogBg(args) { this._styles.dialogBg = Cast.toString(args.COLOR); }
        setTitleColor(args) { this._styles.titleColor = Cast.toString(args.COLOR); }
        setContentColor(args) { this._styles.contentColor = Cast.toString(args.COLOR); }
        setBtnColors(args) {
            this._styles.btnOkBg = Cast.toString(args.OK_COLOR);
            this._styles.btnCancelBg = Cast.toString(args.CANCEL_COLOR);
        }
        setDialogSize(args) {
            this._styles.width = Math.min(800, Math.max(100, Cast.toNumber(args.WIDTH)));
            this._styles.height = Cast.toString(args.HEIGHT);
        }
        setDialogPosition(args) { this._styles.position = Cast.toString(args.POSITION); }
        toggleDialogEffects(args) {
            this._styles.shadow = Cast.toString(args.SHADOW) === 'true';
            this._styles.border = Cast.toString(args.BORDER) === 'true';
        }
        setBorderRadius(args) { this._styles.borderRadius = Math.min(50, Math.max(0, Cast.toNumber(args.RADIUS))); }
        setAnimType(args) { this._styles.animType = Cast.toString(args.ANIM); }
        setAnimDuration(args) { this._styles.animDuration = Math.min(2000, Math.max(100, Cast.toNumber(args.DURATION))); }
        setCountdownClose(args) { this._styles.countdown = Math.min(60, Math.max(0, Cast.toNumber(args.SECONDS))); }

        // ----- 控制方法 -----
        closeDialog() {
            const overlay = document.querySelector('.advanced-dialog-overlay:last-child');
            if (overlay) {
                overlay.classList.remove('active');
                setTimeout(() => overlay.remove(), this._styles.animDuration);
            }
        }

        closeAllDialogs() {
            document.querySelectorAll('.advanced-dialog-overlay').forEach(overlay => {
                overlay.classList.remove('active');
                setTimeout(() => overlay.remove(), this._styles.animDuration);
            });
        }

        // ----- 工具方法 -----
        _getDialogIcon(type) {
            switch(type) {
                case 'success': return '✓';
                case 'warning': return '!';
                case 'error': return '×';
                case 'info': return 'i';
                case 'option': return '⚙';
                default: return '';
            }
        }

        _hexToRgb(hex) {
            hex = hex.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `${r}, ${g}, ${b}`;
        }

        _playCheckAnimation(dialog) {
            const iconDiv = dialog.querySelector('.dialog-icon');
            if (!iconDiv) return;
            const originalIcon = iconDiv.querySelector('i');
            if (!originalIcon || originalIcon.textContent !== '✓') return;
            originalIcon.style.opacity = '0';
            const svgContainer = document.createElement('div');
            svgContainer.className = 'check-svg-container';
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("class", "check-svg");
            svg.setAttribute("viewBox", "0 0 24 24");
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", "M5 12l4 4L19 7");
            path.setAttribute("stroke", getComputedStyle(originalIcon).color);
            path.setAttribute("stroke-width", "3");
            path.setAttribute("fill", "none");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            svg.appendChild(path);
            svgContainer.appendChild(svg);
            iconDiv.appendChild(svgContainer);
            const onAnimEnd = () => {
                originalIcon.style.opacity = '1';
                if (svgContainer && svgContainer.parentNode) svgContainer.remove();
                path.removeEventListener('animationend', onAnimEnd);
            };
            path.addEventListener('animationend', onAnimEnd, { once: true });
        }

        // ----- 核心弹窗创建（所有用户输入均转义）-----
        _createDialog(params = {}) {
            if (this._csenseDetected) {
                console.warn('[灵动弹窗工坊] 因检测到外挂，弹窗已被阻止。');
                return Promise.resolve(null);
            }

            this.closeDialog();

            const {
                title = '弹窗',
                content = '',
                buttons = ['确定'],
                type = 'normal',
                hasInput = false,
                inputDefault = '',
                hasOptions = false,
                optionList = [],
                selectMode = false,
                noOverlay = false
            } = params;

            const safeTitle = this._escapeHtml(title);
            const safeContent = this._escapeHtml(content);
            const safeButtons = buttons.map(b => this._escapeHtml(b));
            const safeInputDefault = this._escapeHtml(inputDefault);
            const safeOptionList = optionList.map(opt => this._escapeHtml(opt));

            const {
                dialogBg, titleColor, contentColor, btnOkBg, btnCancelBg, btnTextColor,
                animType, animDuration, width, height, borderRadius, position,
                shadow, border, countdown, darkMode
            } = this._styles;

            const icon = this._getDialogIcon(type);
            const iconColor = getComputedStyle(document.documentElement).getPropertyValue('--icon-color').trim() || btnOkBg;
            const iconRgb = this._hexToRgb(iconColor);

            const overlay = document.createElement('div');
            overlay.className = `advanced-dialog-overlay position-${position} ${noOverlay ? 'no-overlay' : ''}`;
            
            const dialog = document.createElement('div');
            dialog.className = `advanced-dialog anim-${animType} type-${type} 
                ${shadow ? 'with-shadow' : ''} ${border ? 'with-border' : ''} 
                ${darkMode ? 'dark-mode' : ''}`;
            
            dialog.style.setProperty('--dialog-bg', dialogBg);
            dialog.style.setProperty('--title-color', titleColor);
            dialog.style.setProperty('--content-color', contentColor);
            dialog.style.setProperty('--btn-ok-bg', btnOkBg);
            dialog.style.setProperty('--btn-cancel-bg', btnCancelBg);
            dialog.style.setProperty('--btn-text-color', btnTextColor);
            dialog.style.setProperty('--icon-color', iconColor);
            dialog.style.setProperty('--icon-rgb', iconRgb);
            dialog.style.setProperty('--anim-duration', `${animDuration/1000}s`);
            dialog.style.setProperty('--dialog-width', `${width}px`);
            dialog.style.setProperty('--dialog-height', height);
            dialog.style.setProperty('--border-radius', `${borderRadius}px`);
            
            let dialogHtml = '<div class="dialog-header">';
            if (icon) {
                dialogHtml += `
                    <div class="dialog-icon-container">
                        <div class="dialog-icon"><i>${icon}</i></div>
                        <h3 class="dialog-title">${safeTitle}</h3>
                    </div>
                `;
            } else {
                dialogHtml += `<h3 class="dialog-title">${safeTitle}</h3>`;
            }
            dialogHtml += '</div>';
            
            dialogHtml += `<div class="dialog-content">${safeContent}</div>`;
            
            if (hasOptions && safeOptionList.length > 0) {
                if (selectMode) {
                    const defaultOption = safeOptionList[0] || '';
                    dialogHtml += `
                        <div class="custom-select" id="custom-select">
                            <div class="custom-select-trigger">
                                <span class="selected-value">${defaultOption}</span>
                                <div class="custom-select-arrow"></div>
                            </div>
                            <div class="custom-select-options">
                    `;
                    safeOptionList.forEach((option, index) => {
                        const isSelected = index === 0;
                        dialogHtml += `
                            <div class="custom-select-option ${isSelected ? 'selected' : ''}" data-value="${option}">
                                ${option}
                            </div>
                        `;
                    });
                    dialogHtml += `
                            </div>
                        </div>
                        <input type="hidden" id="select-value" value="${defaultOption}">
                    `;
                } else {
                    dialogHtml += `<div class="dialog-options">`;
                    safeOptionList.forEach((option, index) => {
                        const isSelected = index === 0;
                        dialogHtml += `
                            <div class="dialog-option ${isSelected ? 'selected' : ''}" data-value="${option}">
                                <input type="radio" name="dialog-option" id="option-${index}" value="${option}" ${isSelected ? 'checked' : ''}>
                                <label for="option-${index}">${option}</label>
                            </div>
                        `;
                    });
                    dialogHtml += `</div>`;
                }
            }
            
            if (hasInput) {
                dialogHtml += `<input type="text" class="dialog-input" value="${safeInputDefault}">`;
            }
            
            if (countdown > 0) {
                dialogHtml += `<div class="dialog-countdown">将在 <span id="countdown">${countdown}</span> 秒后自动关闭</div>`;
            }
            
            dialogHtml += '<div class="dialog-buttons">';
            safeButtons.forEach((btnText, index) => {
                const btnClass = index === 0 ? 'dialog-btn-ok' : index === 1 ? 'dialog-btn-cancel' : 'dialog-btn-link';
                dialogHtml += `<button class="dialog-btn ${btnClass}" data-index="${index}">${btnText}</button>`;
            });
            dialogHtml += '</div>';
            
            dialog.innerHTML = dialogHtml;
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            
            setTimeout(() => overlay.classList.add('active'), 10);
            
            if (type === 'success') this._playCheckAnimation(dialog);
            
            if (hasOptions && safeOptionList.length > 0 && selectMode) {
                const customSelect = dialog.querySelector('#custom-select');
                if (customSelect) {
                    const trigger = customSelect.querySelector('.custom-select-trigger');
                    const options = customSelect.querySelectorAll('.custom-select-option');
                    const valueInput = dialog.querySelector('#select-value');
                    const selectedValue = customSelect.querySelector('.selected-value');
                    
                    trigger.addEventListener('click', () => customSelect.classList.toggle('open'));
                    options.forEach(option => {
                        option.addEventListener('click', () => {
                            const value = option.getAttribute('data-value');
                            options.forEach(opt => opt.classList.remove('selected'));
                            option.classList.add('selected');
                            selectedValue.textContent = value;
                            valueInput.value = value;
                            customSelect.classList.remove('open');
                        });
                    });
                    dialog.addEventListener('click', (e) => {
                        if (!customSelect.contains(e.target)) customSelect.classList.remove('open');
                    });
                }
            }
            
            if (hasOptions && safeOptionList.length > 0 && !selectMode) {
                const optionElements = dialog.querySelectorAll('.dialog-option');
                optionElements.forEach(option => {
                    option.addEventListener('click', () => {
                        optionElements.forEach(opt => opt.classList.remove('selected'));
                        option.classList.add('selected');
                        const radio = option.querySelector('input[type="radio"]');
                        if (radio) radio.checked = true;
                    });
                });
            }
            
            if (countdown > 0) {
                let remaining = countdown;
                const countdownEl = dialog.querySelector('#countdown');
                const countdownInterval = setInterval(() => {
                    remaining--;
                    countdownEl.textContent = remaining;
                    if (remaining <= 0) {
                        clearInterval(countdownInterval);
                        overlay.classList.remove('active');
                        setTimeout(() => overlay.remove(), animDuration);
                    }
                }, 1000);
            }
            
            return new Promise((resolve) => {
                const buttons = dialog.querySelectorAll('.dialog-btn');
                buttons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const index = parseInt(btn.getAttribute('data-index'));
                        let inputValue = '';
                        if (hasInput) {
                            const input = dialog.querySelector('.dialog-input');
                            inputValue = input ? input.value : '';
                        }
                        let optionValue = '';
                        if (hasOptions && safeOptionList.length > 0) {
                            if (selectMode) {
                                const valueInput = dialog.querySelector('#select-value');
                                optionValue = valueInput ? valueInput.value : (safeOptionList[0] || '');
                            } else {
                                const selectedOption = dialog.querySelector('input[name="dialog-option"]:checked');
                                optionValue = selectedOption ? selectedOption.value : (safeOptionList[0] || '');
                            }
                        }
                        const result = {
                            buttonIndex: index,
                            buttonText: btn.textContent,
                            inputValue: inputValue,
                            optionValue: optionValue
                        };
                        overlay.classList.remove('active');
                        setTimeout(() => {
                            overlay.remove();
                            if (index === 1) resolve(null);
                            else resolve(result);
                        }, animDuration);
                    });
                });
                
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay && !noOverlay) {
                        resolve(null);
                        overlay.classList.remove('active');
                        setTimeout(() => overlay.remove(), animDuration);
                    }
                });
            });
        }

        // ----- 公开弹窗方法（所有输入转义在 _createDialog 中完成，并受外挂检测保护）-----
        showAlert(args) {
            const title = Cast.toString(args.TITLE);
            const content = Cast.toString(args.CONTENT);
            const btnText = Cast.toString(args.BTN) || '确定';
            return this._createDialog({ title, content, buttons: [btnText], type: 'normal' });
        }

        showConfirm(args) {
            const title = Cast.toString(args.TITLE);
            const content = Cast.toString(args.CONTENT);
            return this._createDialog({ title, content, buttons: ['确定', '取消'], type: 'normal' })
                .then(result => result ? result.buttonIndex === 0 : false);
        }

        showPrompt(args) {
            const title = Cast.toString(args.TITLE);
            const promptText = Cast.toString(args.PROMPT);
            const defaultValue = Cast.toString(args.DEFAULT);
            return this._createDialog({
                title, content: promptText, buttons: ['确定', '取消'],
                type: 'normal', hasInput: true, inputDefault: defaultValue
            }).then(result => {
                if (!result || result.buttonIndex !== 0) return '';
                return result.inputValue;
            });
        }

        showOptionDialog(args) {
            const title = Cast.toString(args.TITLE);
            const promptText = Cast.toString(args.PROMPT);
            const optionsStr = Cast.toString(args.OPTIONS);
            const optionList = optionsStr.split('|').map(opt => opt.trim()).filter(opt => opt);
            return this._createDialog({
                title, content: promptText, buttons: ['确定', '取消'],
                type: 'option', hasOptions: true, optionList, selectMode: false
            }).then(result => {
                if (!result || result.buttonIndex !== 0) return '';
                return result.optionValue;
            });
        }

        showSelectDialog(args) {
            const title = Cast.toString(args.TITLE);
            const promptText = Cast.toString(args.PROMPT);
            const optionsStr = Cast.toString(args.OPTIONS);
            const optionList = optionsStr.split('|').map(opt => opt.trim()).filter(opt => opt);
            return this._createDialog({
                title, content: promptText, buttons: ['确定', '取消'],
                type: 'option', hasOptions: true, optionList, selectMode: true
            }).then(result => {
                if (!result || result.buttonIndex !== 0) return '';
                return result.optionValue;
            });
        }

        showCustomDialog(args) {
            const title = Cast.toString(args.TITLE);
            const content = Cast.toString(args.CONTENT);
            const btn1 = Cast.toString(args.BTN1) || '按钮1';
            const btn2 = Cast.toString(args.BTN2) || '按钮2';
            return this._createDialog({ title, content, buttons: [btn1, btn2], type: 'normal' });
        }

        showSuccessDialog(args) {
            const title = Cast.toString(args.TITLE) || '成功';
            const content = Cast.toString(args.CONTENT) || '操作成功完成！';
            return this._createDialog({ title, content, buttons: ['确定'], type: 'success' });
        }

        showWarningDialog(args) {
            const title = Cast.toString(args.TITLE) || '警告';
            const content = Cast.toString(args.CONTENT) || '请注意此操作的风险！';
            return this._createDialog({ title, content, buttons: ['确定'], type: 'warning' });
        }

        showErrorDialog(args) {
            const title = Cast.toString(args.TITLE) || '错误';
            const content = Cast.toString(args.CONTENT) || '操作失败，请重试！';
            return this._createDialog({ title, content, buttons: ['确定'], type: 'error' });
        }

        showInfoDialog(args) {
            const title = Cast.toString(args.TITLE) || '信息';
            const content = Cast.toString(args.CONTENT) || '这是一条重要信息！';
            return this._createDialog({ title, content, buttons: ['确定'], type: 'info' });
        }

        // ----- 角落提示（已转义）-----
        showCornerToast(args) {
            const title = this._escapeHtml(Cast.toString(args.TITLE));
            const message = this._escapeHtml(Cast.toString(args.MESSAGE));
            const position = Cast.toString(args.POSITION) || 'topRight';
            const type = Cast.toString(args.TYPE) || 'default';
            const autoClose = Cast.toString(args.AUTO_CLOSE) === 'true';
            const seconds = Math.min(10, Math.max(1, Cast.toNumber(args.SECONDS) || 3));
            
            const toastId = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const toast = document.createElement('div');
            toast.id = toastId;
            toast.className = `corner-toast ${position} ${type}`;
            
            let icon = '';
            switch(type) {
                case 'success': icon = '✓'; break;
                case 'warning': icon = '!'; break;
                case 'error': icon = '×'; break;
                case 'info': icon = 'i'; break;
                default: icon = 'ℹ';
            }
            
            toast.innerHTML = `
                <div class="toast-icon">${icon}</div>
                <div class="toast-content">
                    <div class="toast-title">${title}</div>
                    <div class="toast-message">${message}</div>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            const positionToasts = Array.from(document.querySelectorAll(`.corner-toast.${position}`));
            const offsetIndex = positionToasts.length - 1;
            const offset = offsetIndex * this._toastOffset;
            
            if (position.includes('top')) toast.style.top = `${20 + offset}px`;
            else if (position.includes('bottom')) toast.style.bottom = `${20 + offset}px`;
            
            if (position.includes('Left')) toast.style.left = `${20}px`;
            else if (position.includes('Right')) toast.style.right = `${20}px`;
            
            this._activeToasts.set(toastId, { element: toast, position, timeout: null });
            setTimeout(() => toast.classList.add('active'), 10);
            
            if (autoClose) {
                const timeout = setTimeout(() => this.removeToast(toastId), seconds * 1000);
                this._activeToasts.get(toastId).timeout = timeout;
            }
            
            toast.addEventListener('click', () => this.removeToast(toastId));
            return toastId;
        }

        removeToast(toastId) {
            const toastData = this._activeToasts.get(toastId);
            if (!toastData) return;
            const toast = toastData.element;
            const position = toastData.position;
            if (toastData.timeout) clearTimeout(toastData.timeout);
            toast.classList.remove('active');
            setTimeout(() => {
                toast.remove();
                this._activeToasts.delete(toastId);
                this.updateToastPositions(position);
            }, 300);
        }

        updateToastPositions(position) {
            const toasts = Array.from(document.querySelectorAll(`.corner-toast.${position}`));
            toasts.forEach((toast, index) => {
                const offset = index * this._toastOffset;
                if (position.includes('top')) toast.style.top = `${20 + offset}px`;
                else if (position.includes('bottom')) toast.style.bottom = `${20 + offset}px`;
            });
        }

        clearAllToasts() {
            this._activeToasts.forEach((toastData, toastId) => {
                if (toastData.timeout) clearTimeout(toastData.timeout);
                const toast = toastData.element;
                toast.classList.remove('active');
                setTimeout(() => toast.remove(), 300);
            });
            this._activeToasts.clear();
        }

        // ----- 数据管理（已转义）-----
        exportSettings() {
            const settings = {
                styles: {...this._styles},
                panelConfig: {...this._panelConfig}
            };
            return JSON.stringify(settings, null, 2);
        }

        importSettings(args) {
            try {
                const jsonStr = Cast.toString(args.JSON);
                const settings = JSON.parse(jsonStr);
                if (settings.styles) Object.assign(this._styles, settings.styles);
                if (settings.panelConfig) Object.assign(this._panelConfig, settings.panelConfig);
                this._saveSettings();
                const panel = document.querySelector('.dialog-control-panel');
                if (panel) {
                    panel.style.setProperty('--panel-bg', this._panelConfig.panelBg);
                    panel.style.setProperty('--panel-header-bg', this._panelConfig.panelHeaderBg);
                    panel.style.setProperty('--panel-text-color', this._panelConfig.panelTextColor);
                    panel.style.setProperty('--panel-accent-color', this._panelConfig.panelAccentColor);
                }
                const toggleBtn = document.querySelector('.panel-toggle-btn');
                if (toggleBtn) toggleBtn.style.background = this._panelConfig.panelAccentColor;
                this.showCornerToast({
                    TITLE: '导入成功',
                    MESSAGE: '设置已成功导入',
                    POSITION: 'topRight',
                    TYPE: 'success',
                    AUTO_CLOSE: 'true',
                    SECONDS: 2
                });
            } catch (e) {
                this.showCornerToast({
                    TITLE: '导入失败',
                    MESSAGE: `错误: ${e.message}`,
                    POSITION: 'topRight',
                    TYPE: 'error',
                    AUTO_CLOSE: 'true',
                    SECONDS: 3
                });
            }
        }
    }

    extensions.register(new AdvancedDialog(runtime));
})(Scratch);