(function (_Scratch) {
    const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = _Scratch;

    translate.setup({
        zh: {
            'extensionName': 'PanelGUI',
            'createPanel': '创建面板 ID [PANEL_ID] 标题 [TITLE] 宽度 [WIDTH] 高度 [HEIGHT]',
            'showPanel': '显示面板 [PANEL_ID]',
            'hidePanel': '隐藏面板 [PANEL_ID]',
            'setPanelTitle': '设置面板 [PANEL_ID] 标题为 [TITLE]',
            'setPanelHTML': '设置面板 [PANEL_ID] 内容HTML [HTML]',
            'setPanelCSS': '设置面板 [PANEL_ID] 样式CSS [CSS]',
            'setHeaderHTML': '设置面板 [PANEL_ID] 表头HTML [HTML]',
            'setHeaderCSS': '设置面板 [PANEL_ID] 表头样式CSS [CSS]',
            'runPanelJS': '在面板 [PANEL_ID] 中执行JS [JS_CODE]',
            'setPanelCollapsible': '设置面板 [PANEL_ID] 可收缩 [ENABLED]',
            'collapsePanel': '收缩面板 [PANEL_ID]',
            'expandPanel': '展开面板 [PANEL_ID]',
            'togglePanelCollapse': '切换面板 [PANEL_ID] 收缩/展开',
            'addButton': '在面板 [PANEL_ID] 添加按钮 ID [COMP_ID] 标签 [LABEL]',
            'addLabel': '在面板 [PANEL_ID] 添加标签 ID [COMP_ID] 文本 [TEXT]',
            'addInput': '在面板 [PANEL_ID] 添加输入框 ID [COMP_ID] 占位符 [PLACEHOLDER] 默认值 [DEFAULT_VALUE]',
            'addDropdown': '在面板 [PANEL_ID] 添加下拉菜单 ID [COMP_ID] 选项 [OPTIONS] 默认选中 [DEFAULT_INDEX]',
            'addColorPicker': '在面板 [PANEL_ID] 添加颜色选择器 ID [COMP_ID] 标签 [LABEL] 默认颜色 [DEFAULT_COLOR]',
            'addCheckbox': '在面板 [PANEL_ID] 添加复选框 ID [COMP_ID] 标签 [LABEL] 默认状态 [DEFAULT_STATE]',
            'addSlider': '在面板 [PANEL_ID] 添加滑块 ID [COMP_ID] 最小值 [MIN] 最大值 [MAX] 默认值 [DEFAULT_VALUE]',
            'addSeparator': '在面板 [PANEL_ID] 添加分隔线 ID [COMP_ID]',
            'addCustomHTML': '在面板 [PANEL_ID] 添加自定义HTML ID [COMP_ID] 内容 [HTML]',
            'destroyComponent': '销毁面板 [PANEL_ID] 中的组件 [COMPONENT_ID]',
            'destroyPanel': '销毁面板 [PANEL_ID]',
            'destroyAllPanels': '销毁所有面板',
            'closePanel': '关闭面板 [PANEL_ID]',
            'clearPanel': '清空面板 [PANEL_ID] 所有组件',
            'onButtonClick': '当按钮 [BUTTON_ID] 被点击',
            'onInputChange': '当输入框 [INPUT_ID] 内容改变',
            'onColorChange': '当颜色选择器 [COLOR_ID] 颜色改变',
            'onCheckboxChange': '当复选框 [CHECKBOX_ID] 状态改变',
            'onSliderChange': '当滑块 [SLIDER_ID] 值改变',
            'onDropdownChange': '当下拉菜单 [DROPDOWN_ID] 选项改变',
            'onPanelCollapse': '当面板 [PANEL_ID] 被收缩',
            'onPanelExpand': '当面板 [PANEL_ID] 被展开',
            'getInputValue': '获取输入框 [INPUT_ID] 的值',
            'getColorValue': '获取颜色选择器 [COLOR_ID] 的颜色值',
            'getCheckboxState': '获取复选框 [CHECKBOX_ID] 的状态',
            'getSliderValue': '获取滑块 [SLIDER_ID] 的值',
            'getDropdownValue': '获取下拉菜单 [DROPDOWN_ID] 的选中项',
            'setInputValue': '设置输入框 [INPUT_ID] 的值为 [VALUE]',
            'setSliderValue': '设置滑块 [SLIDER_ID] 的值为 [VALUE]',
            'setCheckboxState': '设置复选框 [CHECKBOX_ID] 状态为 [STATE]',
            'setPanelPosition': '设置面板 [PANEL_ID] 位置 X:[X] Y:[Y]',
            'setPanelSize': '设置面板 [PANEL_ID] 大小 宽:[WIDTH] 高:[HEIGHT]',
            'togglePanel': '切换面板 [PANEL_ID] 显示/隐藏',
            'panelExists': '面板 [PANEL_ID] 存在吗？',
            'componentExists': '面板 [PANEL_ID] 中的组件 [COMPONENT_ID] 存在吗？',
            'getAllPanels': '获取所有面板ID列表',
            'getPanelComponents': '获取面板 [PANEL_ID] 的所有组件ID',
            // 默认值
            'panel_id_default': 'my_panel',
            'component_id_default': 'my_component',
            'width_default': '400',
            'height_default': '300',
            'title_default': '控制面板',
            'label_default': '按钮',
            'text_default': '标签文本',
            'placeholder_default': '请输入内容...',
            'options_default': '选项1,选项2,选项3',
            'color_default': '#4A90E2',
            'slider_range_default': '0,100',
            'checkbox_label_default': '启用选项',
            'default_css': 'background:#ffffff;border:1px solid #ddd;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);overflow:hidden;',
            'default_header_css': 'background:#4A90E2;color:white;font-weight:bold;padding:12px;cursor:move;user-select:none;margin:0;'
        },
        en: {
            'extensionName': 'PanelGUI Advanced Control Panel',
            'createPanel': 'create panel id [PANEL_ID] title [TITLE] width [WIDTH] height [HEIGHT]',
            'showPanel': 'show panel [PANEL_ID]',
            'hidePanel': 'hide panel [PANEL_ID]',
            'setPanelTitle': 'set panel [PANEL_ID] title to [TITLE]',
            'setPanelHTML': 'set panel [PANEL_ID] content HTML [HTML]',
            'setPanelCSS': 'set panel [PANEL_ID] CSS [CSS]',
            'setHeaderHTML': 'set panel [PANEL_ID] header HTML [HTML]',
            'setHeaderCSS': 'set panel [PANEL_ID] header CSS [CSS]',
            'runPanelJS': 'run JS [JS_CODE] in panel [PANEL_ID]',
            'setPanelCollapsible': 'set panel [PANEL_ID] collapsible [ENABLED]',
            'collapsePanel': 'collapse panel [PANEL_ID]',
            'expandPanel': 'expand panel [PANEL_ID]',
            'togglePanelCollapse': 'toggle panel [PANEL_ID] collapse/expand',
            'addButton': 'add button id [COMP_ID] label [LABEL] to panel [PANEL_ID]',
            'addLabel': 'add label id [COMP_ID] text [TEXT] to panel [PANEL_ID]',
            'addInput': 'add input id [COMP_ID] placeholder [PLACEHOLDER] default [DEFAULT_VALUE] to panel [PANEL_ID]',
            'addDropdown': 'add dropdown id [COMP_ID] options [OPTIONS] default [DEFAULT_INDEX] to panel [PANEL_ID]',
            'addColorPicker': 'add color picker id [COMP_ID] label [LABEL] default [DEFAULT_COLOR] to panel [PANEL_ID]',
            'addCheckbox': 'add checkbox id [COMP_ID] label [LABEL] default [DEFAULT_STATE] to panel [PANEL_ID]',
            'addSlider': 'add slider id [COMP_ID] min [MIN] max [MAX] default [DEFAULT_VALUE] to panel [PANEL_ID]',
            'addSeparator': 'add separator id [COMP_ID] to panel [PANEL_ID]',
            'addCustomHTML': 'add custom HTML id [COMP_ID] content [HTML] to panel [PANEL_ID]',
            'destroyComponent': 'destroy component [COMPONENT_ID] in panel [PANEL_ID]',
            'destroyPanel': 'destroy panel [PANEL_ID]',
            'destroyAllPanels': 'destroy all panels',
            'closePanel': 'close panel [PANEL_ID]',
            'clearPanel': 'clear all components in panel [PANEL_ID]',
            'onButtonClick': 'when button [BUTTON_ID] clicked',
            'onInputChange': 'when input [INPUT_ID] changed',
            'onColorChange': 'when color picker [COLOR_ID] changed',
            'onCheckboxChange': 'when checkbox [CHECKBOX_ID] changed',
            'onSliderChange': 'when slider [SLIDER_ID] changed',
            'onDropdownChange': 'when dropdown [DROPDOWN_ID] changed',
            'onPanelCollapse': 'when panel [PANEL_ID] collapsed',
            'onPanelExpand': 'when panel [PANEL_ID] expanded',
            'getInputValue': 'get input [INPUT_ID] value',
            'getColorValue': 'get color picker [COLOR_ID] value',
            'getCheckboxState': 'get checkbox [CHECKBOX_ID] state',
            'getSliderValue': 'get slider [SLIDER_ID] value',
            'getDropdownValue': 'get dropdown [DROPDOWN_ID] selected value',
            'setInputValue': 'set input [INPUT_ID] value to [VALUE]',
            'setSliderValue': 'set slider [SLIDER_ID] value to [VALUE]',
            'setCheckboxState': 'set checkbox [CHECKBOX_ID] state to [STATE]',
            'setPanelPosition': 'set panel [PANEL_ID] position X:[X] Y:[Y]',
            'setPanelSize': 'set panel [PANEL_ID] size width:[WIDTH] height:[HEIGHT]',
            'togglePanel': 'toggle panel [PANEL_ID] visibility',
            'panelExists': 'does panel [PANEL_ID] exist?',
            'componentExists': 'does component [COMPONENT_ID] exist in panel [PANEL_ID]?',
            'getAllPanels': 'get all panel IDs',
            'getPanelComponents': 'get all component IDs in panel [PANEL_ID]',
            // Defaults
            'panel_id_default': 'my_panel',
            'component_id_default': 'my_component',
            'width_default': '400',
            'height_default': '300',
            'title_default': 'Control Panel',
            'label_default': 'Button',
            'text_default': 'Label Text',
            'placeholder_default': 'Enter content...',
            'options_default': 'option1,option2,option3',
            'color_default': '#4A90E2',
            'slider_range_default': '0,100',
            'checkbox_label_default': 'Enable Option',
            'default_css': 'background:#ffffff;border:1px solid #ddd;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);overflow:hidden;',
            'default_header_css': 'background:#4A90E2;color:white;font-weight:bold;padding:12px;cursor:move;user-select:none;margin:0;'
        }
    });

    class PanelGUIExtension {
        constructor(_runtime) {
            this._runtime = _runtime;
            this._panels = new Map();
            this._components = new Map();
            this._nextComponentId = 1;
            this._eventListeners = new Map();
            this._dragState = null; // 全局拖拽状态
            this._initRenderContainer();
        }

        _initRenderContainer() {
            if (!document.getElementById('panelgui-container')) {
                const container = document.createElement('div');
                container.id = 'panelgui-container';
                container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10000;';
                document.body.appendChild(container);
            }
            
            // 全局拖拽事件监听（只绑定一次）
            this._setupGlobalDragEvents();
        }
        
        _setupGlobalDragEvents() {
            // 使用箭头函数保持 this 绑定
            const onMouseMove = (e) => {
                if (this._dragState && this._dragState.isDragging) {
                    const deltaX = e.clientX - this._dragState.startX;
                    const deltaY = e.clientY - this._dragState.startY;
                    const newLeft = this._dragState.startLeft + deltaX;
                    const newTop = this._dragState.startTop + deltaY;
                    
                    this._dragState.panelEl.style.left = newLeft + 'px';
                    this._dragState.panelEl.style.top = newTop + 'px';
                    
                    // 更新面板数据
                    const panel = this._panels.get(this._dragState.panelId);
                    if (panel) {
                        panel.x = newLeft;
                        panel.y = newTop;
                    }
                }
            };
            
            const onMouseUp = () => {
                if (this._dragState) {
                    this._dragState.isDragging = false;
                    this._dragState = null;
                }
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }

        _generateComponentId(customId, panelId) {
            const fullId = customId && customId.trim() ? `${panelId}_${customId}` : `${panelId}_comp_${this._nextComponentId}`;
            if (!this._components.has(fullId)) {
                this._nextComponentId++;
                return fullId;
            }
            return `${fullId}_${Date.now()}`;
        }

        _renderPanel(panelId) {
            const panel = this._panels.get(panelId);
            if (!panel) return;
            
            let panelEl = document.getElementById(`panelgui-${panelId}`);
            
            if (!panelEl) {
                panelEl = document.createElement('div');
                panelEl.id = `panelgui-${panelId}`;
                panelEl.className = 'panelgui-panel';
                panelEl.style.cssText = panel.panelCSS;
                panelEl.style.position = 'absolute';
                panelEl.style.left = panel.x + 'px';
                panelEl.style.top = panel.y + 'px';
                panelEl.style.width = panel.width + 'px';
                panelEl.style.minWidth = '150px';
                panelEl.style.pointerEvents = 'auto';
                panelEl.style.display = panel.visible ? 'flex' : 'none';
                panelEl.style.flexDirection = 'column';
                
                // 标题栏
                const titleEl = document.createElement('div');
                titleEl.className = 'panelgui-title';
                titleEl.innerHTML = panel.headerHTML || panel.title;
                titleEl.style.cssText = panel.headerCSS;
                titleEl.style.flexShrink = '0';
                
                // 拖拽功能绑定到标题栏
                this._makeDraggable(panelEl, titleEl, panelId);
                
                if (panel.collapsible) {
                    titleEl.style.cursor = 'pointer';
                    // 收缩/展开功能（不与拖拽冲突）
                    titleEl.addEventListener('click', (e) => {
                        // 只有不是拖拽操作时才触发收缩
                        if (!this._dragState || this._dragState.panelId !== panelId) {
                            e.stopPropagation();
                            this._toggleCollapse(panelId);
                        }
                    });
                }
                
                // 内容区域
                const contentEl = document.createElement('div');
                contentEl.id = `panelgui-content-${panelId}`;
                contentEl.className = 'panelgui-content';
                contentEl.style.cssText = panel.collapsed ? 'display:none;' : 'flex:1;overflow-y:auto;padding:10px;box-sizing:border-box;';
                if (panel.contentHTML) {
                    contentEl.innerHTML = panel.contentHTML;
                }
                
                panelEl.appendChild(titleEl);
                panelEl.appendChild(contentEl);
                document.getElementById('panelgui-container').appendChild(panelEl);
                
                panel.element = panelEl;
                panel.titleElement = titleEl;
                panel.contentElement = contentEl;
            }
            
            // 收缩时高度只显示标题栏
            if (panel.collapsed) {
                const titleHeight = panel.titleElement?.offsetHeight || 45;
                panel.element.style.height = titleHeight + 'px';
            } else {
                panel.element.style.height = panel.height + 'px';
            }
            
            panelEl.style.display = panel.visible ? 'flex' : 'none';
            
            // 重新渲染组件
            for (const compId of panel.components) {
                this._renderComponent(compId);
            }
        }
        
        _toggleCollapse(panelId) {
            const panel = this._panels.get(panelId);
            if (!panel || !panel.collapsible) return;
            
            panel.collapsed = !panel.collapsed;
            
            if (panel.contentElement) {
                panel.contentElement.style.display = panel.collapsed ? 'none' : 'flex';
            }
            
            if (panel.element) {
                if (panel.collapsed) {
                    const titleHeight = panel.titleElement?.offsetHeight || 45;
                    panel.element.style.height = titleHeight + 'px';
                } else {
                    panel.element.style.height = panel.height + 'px';
                }
            }
            
            this._triggerEvent(panel.collapsed ? 'collapse' : 'expand', `panel_${panelId}`, { panelId });
        }

        _makeDraggable(panelEl, handleEl, panelId) {
            // 移除旧的事件监听，避免重复绑定
            const oldHandler = handleEl._dragStartHandler;
            if (oldHandler) {
                handleEl.removeEventListener('mousedown', oldHandler);
            }
            
            const onMouseDown = (e) => {
                // 只允许鼠标左键拖拽
                if (e.button !== 0) return;
                
                // 如果点击的是可交互元素（按钮、输入框等），不拖拽
                const target = e.target;
                if (target.tagName === 'BUTTON' || 
                    target.tagName === 'INPUT' || 
                    target.tagName === 'SELECT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.tagName === 'A' ||
                    target.closest('button') ||
                    target.closest('input') ||
                    target.closest('select') ||
                    target.closest('textarea')) {
                    return;
                }
                
                e.preventDefault();
                e.stopPropagation();
                
                // 保存拖拽状态到全局
                this._dragState = {
                    isDragging: true,
                    panelId: panelId,
                    panelEl: panelEl,
                    startX: e.clientX,
                    startY: e.clientY,
                    startLeft: parseInt(panelEl.style.left) || 0,
                    startTop: parseInt(panelEl.style.top) || 0
                };
            };
            
            // 绑定事件并保存引用以便后续移除
            handleEl._dragStartHandler = onMouseDown.bind(this);
            handleEl.addEventListener('mousedown', handleEl._dragStartHandler);
        }

        _renderComponent(componentId) {
            const component = this._components.get(componentId);
            if (!component) return;
            
            const panel = this._panels.get(component.panelId);
            if (!panel || !panel.contentElement) return;
            
            let compEl = document.getElementById(`panelgui-comp-${componentId}`);
            
            if (!compEl) {
                compEl = document.createElement('div');
                compEl.id = `panelgui-comp-${componentId}`;
                compEl.className = `panelgui-component panelgui-${component.type}`;
                compEl.style.cssText = 'margin:5px 0;padding:5px;box-sizing:border-box;';
                
                switch(component.type) {
                    case 'button':
                        const buttonEl = document.createElement('button');
                        buttonEl.textContent = component.label;
                        buttonEl.style.cssText = 'width:100%;padding:8px;background:#4A90E2;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;';
                        buttonEl.onclick = () => this._triggerEvent('click', componentId, { componentId });
                        compEl.appendChild(buttonEl);
                        break;
                        
                    case 'label':
                        const labelEl = document.createElement('div');
                        labelEl.textContent = component.text;
                        labelEl.style.cssText = 'padding:5px;font-size:14px;color:#333;';
                        compEl.appendChild(labelEl);
                        break;
                        
                    case 'input':
                        const inputEl = document.createElement('input');
                        inputEl.type = 'text';
                        inputEl.placeholder = component.placeholder;
                        inputEl.value = component.value || '';
                        inputEl.style.cssText = 'width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;font-size:14px;';
                        inputEl.oninput = (e) => {
                            component.value = e.target.value;
                            this._triggerEvent('change', componentId, { componentId, value: e.target.value });
                        };
                        compEl.appendChild(inputEl);
                        break;
                        
                    case 'colorpicker':
                        const colorContainer = document.createElement('div');
                        colorContainer.style.cssText = 'display:flex;align-items:center;gap:10px;';
                        const colorLabel = document.createElement('span');
                        colorLabel.textContent = component.label;
                        colorLabel.style.cssText = 'font-size:14px;color:#333;';
                        const colorEl = document.createElement('input');
                        colorEl.type = 'color';
                        colorEl.value = component.color;
                        colorEl.style.cssText = 'width:50px;height:35px;border:none;cursor:pointer;';
                        colorEl.oninput = (e) => {
                            component.color = e.target.value;
                            this._triggerEvent('colorchange', componentId, { componentId, color: e.target.value });
                        };
                        colorContainer.appendChild(colorLabel);
                        colorContainer.appendChild(colorEl);
                        compEl.appendChild(colorContainer);
                        break;
                        
                    case 'checkbox':
                        const checkboxContainer = document.createElement('label');
                        checkboxContainer.style.cssText = 'display:flex;align-items:center;gap:8px;cursor:pointer;';
                        const checkboxEl = document.createElement('input');
                        checkboxEl.type = 'checkbox';
                        checkboxEl.checked = component.checked;
                        checkboxEl.style.cssText = 'width:16px;height:16px;';
                        const checkboxLabel = document.createElement('span');
                        checkboxLabel.textContent = component.label;
                        checkboxLabel.style.cssText = 'font-size:14px;color:#333;';
                        checkboxEl.onchange = (e) => {
                            component.checked = e.target.checked;
                            this._triggerEvent('checkboxchange', componentId, { componentId, checked: e.target.checked });
                        };
                        checkboxContainer.appendChild(checkboxEl);
                        checkboxContainer.appendChild(checkboxLabel);
                        compEl.appendChild(checkboxContainer);
                        break;
                        
                    case 'slider':
                        const sliderContainer = document.createElement('div');
                        const sliderEl = document.createElement('input');
                        sliderEl.type = 'range';
                        sliderEl.min = component.min;
                        sliderEl.max = component.max;
                        sliderEl.value = component.value;
                        sliderEl.style.cssText = 'width:100%;margin:5px 0;';
                        const sliderValue = document.createElement('span');
                        sliderValue.textContent = sliderEl.value;
                        sliderValue.style.cssText = 'display:block;text-align:center;font-size:12px;color:#666;';
                        sliderEl.oninput = (e) => {
                            component.value = parseInt(e.target.value);
                            sliderValue.textContent = e.target.value;
                            this._triggerEvent('sliderchange', componentId, { componentId, value: component.value });
                        };
                        sliderContainer.appendChild(sliderEl);
                        sliderContainer.appendChild(sliderValue);
                        compEl.appendChild(sliderContainer);
                        break;
                        
                    case 'separator':
                        compEl.style.cssText = 'border-top:1px solid #ddd;margin:10px 0;height:1px;';
                        break;
                        
                    case 'dropdown':
                        const selectEl = document.createElement('select');
                        selectEl.style.cssText = 'width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;font-size:14px;';
                        component.options.forEach((option, index) => {
                            const optionEl = document.createElement('option');
                            optionEl.value = option;
                            optionEl.textContent = option;
                            if (index === component.selected) optionEl.selected = true;
                            selectEl.appendChild(optionEl);
                        });
                        selectEl.onchange = (e) => {
                            component.selected = selectEl.selectedIndex;
                            component.value = e.target.value;
                            this._triggerEvent('dropdownchange', componentId, { componentId, value: e.target.value, index: component.selected });
                        };
                        compEl.appendChild(selectEl);
                        break;
                        
                    case 'custom':
                        compEl.innerHTML = component.html;
                        break;
                }
                
                if (component.customCSS) compEl.style.cssText += component.customCSS;
                panel.contentElement.appendChild(compEl);
                component.element = compEl;
            }
        }

        _triggerEvent(eventType, componentId, data) {
            const listeners = this._eventListeners.get(`${eventType}_${componentId}`) || [];
            for (const listener of listeners) {
                try { listener(data); } catch (error) { console.error('PanelGUI event error:', error); }
            }
        }
        
        _createPromiseEvent(eventType, componentId) {
            return new Promise((resolve) => {
                const key = `${eventType}_${componentId}`;
                if (!this._eventListeners.has(key)) this._eventListeners.set(key, []);
                const listener = (data) => resolve(eventType === 'click' ? undefined : (data?.value || data?.color || data?.checked || data));
                this._eventListeners.get(key).push(listener);
            });
        }

        getInfo() {
            return {
                id: 'panelgui',
                name: translate({id: 'extensionName'}),
                color1: '#4A90E2',
                color2: '#357ABD',
                blocks: [
                    { opcode: 'createPanel', blockType: BlockType.COMMAND, text: translate({id: 'createPanel'}), arguments: {
                        PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) },
                        TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'title_default'}) },
                        WIDTH: { type: ArgumentType.NUMBER, defaultValue: Cast.toNumber(translate({id: 'width_default'})) },
                        HEIGHT: { type: ArgumentType.NUMBER, defaultValue: Cast.toNumber(translate({id: 'height_default'})) }
                    }},
                    { opcode: 'showPanel', blockType: BlockType.COMMAND, text: translate({id: 'showPanel'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) } } },
                    { opcode: 'hidePanel', blockType: BlockType.COMMAND, text: translate({id: 'hidePanel'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) } } },
                    { opcode: 'togglePanel', blockType: BlockType.COMMAND, text: translate({id: 'togglePanel'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) } } },
                    { opcode: 'setPanelTitle', blockType: BlockType.COMMAND, text: translate({id: 'setPanelTitle'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, TITLE: { type: ArgumentType.STRING, defaultValue: translate({id: 'title_default'}) } } },
                    { opcode: 'setPanelHTML', blockType: BlockType.COMMAND, text: translate({id: 'setPanelHTML'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, HTML: { type: ArgumentType.STRING, defaultValue: '' } } },
                    { opcode: 'setPanelCSS', blockType: BlockType.COMMAND, text: translate({id: 'setPanelCSS'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, CSS: { type: ArgumentType.STRING, defaultValue: translate({id: 'default_css'}) } } },
                    { opcode: 'setHeaderHTML', blockType: BlockType.COMMAND, text: translate({id: 'setHeaderHTML'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, HTML: { type: ArgumentType.STRING, defaultValue: '' } } },
                    { opcode: 'setHeaderCSS', blockType: BlockType.COMMAND, text: translate({id: 'setHeaderCSS'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, CSS: { type: ArgumentType.STRING, defaultValue: translate({id: 'default_header_css'}) } } },
                    { opcode: 'runPanelJS', blockType: BlockType.COMMAND, text: translate({id: 'runPanelJS'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, JS_CODE: { type: ArgumentType.STRING, defaultValue: '' } } },
                    { opcode: 'setPanelCollapsible', blockType: BlockType.COMMAND, text: translate({id: 'setPanelCollapsible'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, ENABLED: { type: ArgumentType.BOOLEAN, defaultValue: true } } },
                    { opcode: 'collapsePanel', blockType: BlockType.COMMAND, text: translate({id: 'collapsePanel'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) } } },
                    { opcode: 'expandPanel', blockType: BlockType.COMMAND, text: translate({id: 'expandPanel'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) } } },
                    { opcode: 'togglePanelCollapse', blockType: BlockType.COMMAND, text: translate({id: 'togglePanelCollapse'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) } } },
                    { opcode: 'setPanelPosition', blockType: BlockType.COMMAND, text: translate({id: 'setPanelPosition'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, X: { type: ArgumentType.NUMBER, defaultValue: 100 }, Y: { type: ArgumentType.NUMBER, defaultValue: 100 } } },
                    { opcode: 'setPanelSize', blockType: BlockType.COMMAND, text: translate({id: 'setPanelSize'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, WIDTH: { type: ArgumentType.NUMBER, defaultValue: Cast.toNumber(translate({id: 'width_default'})) }, HEIGHT: { type: ArgumentType.NUMBER, defaultValue: Cast.toNumber(translate({id: 'height_default'})) } } },
                    { opcode: 'addButton', blockType: BlockType.COMMAND, text: translate({id: 'addButton'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, COMP_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) }, LABEL: { type: ArgumentType.STRING, defaultValue: translate({id: 'label_default'}) } } },
                    { opcode: 'addLabel', blockType: BlockType.COMMAND, text: translate({id: 'addLabel'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, COMP_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) }, TEXT: { type: ArgumentType.STRING, defaultValue: translate({id: 'text_default'}) } } },
                    { opcode: 'addInput', blockType: BlockType.COMMAND, text: translate({id: 'addInput'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, COMP_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) }, PLACEHOLDER: { type: ArgumentType.STRING, defaultValue: translate({id: 'placeholder_default'}) }, DEFAULT_VALUE: { type: ArgumentType.STRING, defaultValue: '' } } },
                    { opcode: 'addDropdown', blockType: BlockType.COMMAND, text: translate({id: 'addDropdown'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, COMP_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) }, OPTIONS: { type: ArgumentType.STRING, defaultValue: translate({id: 'options_default'}) }, DEFAULT_INDEX: { type: ArgumentType.NUMBER, defaultValue: 0 } } },
                    { opcode: 'addColorPicker', blockType: BlockType.COMMAND, text: translate({id: 'addColorPicker'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, COMP_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) }, LABEL: { type: ArgumentType.STRING, defaultValue: '颜色' }, DEFAULT_COLOR: { type: ArgumentType.STRING, defaultValue: translate({id: 'color_default'}) } } },
                    { opcode: 'addCheckbox', blockType: BlockType.COMMAND, text: translate({id: 'addCheckbox'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, COMP_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) }, LABEL: { type: ArgumentType.STRING, defaultValue: translate({id: 'checkbox_label_default'}) }, DEFAULT_STATE: { type: ArgumentType.BOOLEAN, defaultValue: false } } },
                    { opcode: 'addSlider', blockType: BlockType.COMMAND, text: translate({id: 'addSlider'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, COMP_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) }, MIN: { type: ArgumentType.NUMBER, defaultValue: 0 }, MAX: { type: ArgumentType.NUMBER, defaultValue: 100 }, DEFAULT_VALUE: { type: ArgumentType.NUMBER, defaultValue: 50 } } },
                    { opcode: 'addSeparator', blockType: BlockType.COMMAND, text: translate({id: 'addSeparator'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, COMP_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'addCustomHTML', blockType: BlockType.COMMAND, text: translate({id: 'addCustomHTML'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, COMP_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) }, HTML: { type: ArgumentType.STRING, defaultValue: '' } } },
                    { opcode: 'destroyComponent', blockType: BlockType.COMMAND, text: translate({id: 'destroyComponent'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, COMPONENT_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'destroyPanel', blockType: BlockType.COMMAND, text: translate({id: 'destroyPanel'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) } } },
                    { opcode: 'destroyAllPanels', blockType: BlockType.COMMAND, text: translate({id: 'destroyAllPanels'}) },
                    { opcode: 'closePanel', blockType: BlockType.COMMAND, text: translate({id: 'closePanel'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) } } },
                    { opcode: 'clearPanel', blockType: BlockType.COMMAND, text: translate({id: 'clearPanel'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) } } },
                    { opcode: 'setInputValue', blockType: BlockType.COMMAND, text: translate({id: 'setInputValue'}), arguments: { INPUT_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) }, VALUE: { type: ArgumentType.STRING, defaultValue: '' } } },
                    { opcode: 'setSliderValue', blockType: BlockType.COMMAND, text: translate({id: 'setSliderValue'}), arguments: { SLIDER_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) }, VALUE: { type: ArgumentType.NUMBER, defaultValue: 50 } } },
                    { opcode: 'setCheckboxState', blockType: BlockType.COMMAND, text: translate({id: 'setCheckboxState'}), arguments: { CHECKBOX_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) }, STATE: { type: ArgumentType.BOOLEAN, defaultValue: false } } },
                    { opcode: 'onButtonClick', blockType: BlockType.HAT, text: translate({id: 'onButtonClick'}), arguments: { BUTTON_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'onInputChange', blockType: BlockType.HAT, text: translate({id: 'onInputChange'}), arguments: { INPUT_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'onColorChange', blockType: BlockType.HAT, text: translate({id: 'onColorChange'}), arguments: { COLOR_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'onCheckboxChange', blockType: BlockType.HAT, text: translate({id: 'onCheckboxChange'}), arguments: { CHECKBOX_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'onSliderChange', blockType: BlockType.HAT, text: translate({id: 'onSliderChange'}), arguments: { SLIDER_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'onDropdownChange', blockType: BlockType.HAT, text: translate({id: 'onDropdownChange'}), arguments: { DROPDOWN_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'onPanelCollapse', blockType: BlockType.HAT, text: translate({id: 'onPanelCollapse'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) } } },
                    { opcode: 'onPanelExpand', blockType: BlockType.HAT, text: translate({id: 'onPanelExpand'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) } } },
                    { opcode: 'getInputValue', blockType: BlockType.REPORTER, text: translate({id: 'getInputValue'}), arguments: { INPUT_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'getColorValue', blockType: BlockType.REPORTER, text: translate({id: 'getColorValue'}), arguments: { COLOR_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'getCheckboxState', blockType: BlockType.BOOLEAN, text: translate({id: 'getCheckboxState'}), arguments: { CHECKBOX_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'getSliderValue', blockType: BlockType.REPORTER, text: translate({id: 'getSliderValue'}), arguments: { SLIDER_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'getDropdownValue', blockType: BlockType.REPORTER, text: translate({id: 'getDropdownValue'}), arguments: { DROPDOWN_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'panelExists', blockType: BlockType.BOOLEAN, text: translate({id: 'panelExists'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) } } },
                    { opcode: 'componentExists', blockType: BlockType.BOOLEAN, text: translate({id: 'componentExists'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) }, COMPONENT_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'component_id_default'}) } } },
                    { opcode: 'getAllPanels', blockType: BlockType.REPORTER, text: translate({id: 'getAllPanels'}) },
                    { opcode: 'getPanelComponents', blockType: BlockType.REPORTER, text: translate({id: 'getPanelComponents'}), arguments: { PANEL_ID: { type: ArgumentType.STRING, defaultValue: translate({id: 'panel_id_default'}) } } }
                ]
            };
        }

        // 面板管理方法
        createPanel(args) {
            const panelId = Cast.toString(args.PANEL_ID);
            if (this._panels.has(panelId)) return panelId;
            
            const panel = {
                id: panelId,
                title: Cast.toString(args.TITLE),
                visible: true,
                width: Cast.toNumber(args.WIDTH),
                height: Cast.toNumber(args.HEIGHT),
                x: 100, y: 100,
                collapsible: true,
                collapsed: false,
                panelCSS: translate({id: 'default_css'}),
                headerCSS: translate({id: 'default_header_css'}),
                headerHTML: Cast.toString(args.TITLE),
                contentHTML: '',
                components: [],
                element: null,
                titleElement: null,
                contentElement: null
            };
            this._panels.set(panelId, panel);
            this._renderPanel(panelId);
            return panelId;
        }

        showPanel(args) { const panel = this._panels.get(Cast.toString(args.PANEL_ID)); if (panel) { panel.visible = true; this._renderPanel(panel.id); } }
        hidePanel(args) { const panel = this._panels.get(Cast.toString(args.PANEL_ID)); if (panel) { panel.visible = false; this._renderPanel(panel.id); } }
        togglePanel(args) { const panel = this._panels.get(Cast.toString(args.PANEL_ID)); if (panel) { panel.visible = !panel.visible; this._renderPanel(panel.id); } }
        setPanelTitle(args) { 
            const panel = this._panels.get(Cast.toString(args.PANEL_ID)); 
            if (panel) {
                panel.title = Cast.toString(args.TITLE);
                panel.headerHTML = panel.title;
                if (panel.titleElement) panel.titleElement.innerHTML = panel.headerHTML;
            }
        }
        setPanelHTML(args) {
            const panel = this._panels.get(Cast.toString(args.PANEL_ID));
            if (panel && panel.contentElement) {
                panel.contentHTML = Cast.toString(args.HTML);
                panel.contentElement.innerHTML = panel.contentHTML;
            }
        }
        setPanelCSS(args) {
            const panel = this._panels.get(Cast.toString(args.PANEL_ID));
            if (panel && panel.element) {
                panel.panelCSS = Cast.toString(args.CSS);
                panel.element.style.cssText = panel.panelCSS;
                panel.element.style.position = 'absolute';
                panel.element.style.left = panel.x + 'px';
                panel.element.style.top = panel.y + 'px';
                panel.element.style.width = panel.width + 'px';
                panel.element.style.pointerEvents = 'auto';
                panel.element.style.display = 'flex';
                panel.element.style.flexDirection = 'column';
            }
        }
        setHeaderHTML(args) {
            const panel = this._panels.get(Cast.toString(args.PANEL_ID));
            if (panel && panel.titleElement) {
                panel.headerHTML = Cast.toString(args.HTML);
                panel.titleElement.innerHTML = panel.headerHTML;
            }
        }
        setHeaderCSS(args) {
            const panel = this._panels.get(Cast.toString(args.PANEL_ID));
            if (panel && panel.titleElement) {
                panel.headerCSS = Cast.toString(args.CSS);
                panel.titleElement.style.cssText = panel.headerCSS;
                panel.titleElement.style.flexShrink = '0';
                if (panel.collapsible) panel.titleElement.style.cursor = 'pointer';
            }
        }
        runPanelJS(args) {
            const panel = this._panels.get(Cast.toString(args.PANEL_ID));
            if (panel && panel.element) {
                try {
                    const jsCode = Cast.toString(args.JS_CODE);
                    const script = document.createElement('script');
                    script.textContent = jsCode;
                    panel.element.appendChild(script);
                } catch(e) { console.error('JS执行错误:', e); }
            }
        }
        setPanelCollapsible(args) {
            const panel = this._panels.get(Cast.toString(args.PANEL_ID));
            if (panel) {
                panel.collapsible = Cast.toBoolean(args.ENABLED);
                if (panel.titleElement) {
                    if (panel.collapsible) {
                        panel.titleElement.style.cursor = 'pointer';
                    } else {
                        panel.titleElement.style.cursor = 'move';
                    }
                }
            }
        }
        collapsePanel(args) { const panel = this._panels.get(Cast.toString(args.PANEL_ID)); if (panel && !panel.collapsed) this._toggleCollapse(panel.id); }
        expandPanel(args) { const panel = this._panels.get(Cast.toString(args.PANEL_ID)); if (panel && panel.collapsed) this._toggleCollapse(panel.id); }
        togglePanelCollapse(args) { const panel = this._panels.get(Cast.toString(args.PANEL_ID)); if (panel) this._toggleCollapse(panel.id); }
        setPanelPosition(args) { 
            const panel = this._panels.get(Cast.toString(args.PANEL_ID)); 
            if (panel && panel.element) { 
                panel.x = Cast.toNumber(args.X); 
                panel.y = Cast.toNumber(args.Y); 
                panel.element.style.left = panel.x + 'px'; 
                panel.element.style.top = panel.y + 'px'; 
            } 
        }
        setPanelSize(args) { 
            const panel = this._panels.get(Cast.toString(args.PANEL_ID)); 
            if (panel && panel.element) { 
                panel.width = Cast.toNumber(args.WIDTH); 
                panel.height = Cast.toNumber(args.HEIGHT); 
                panel.element.style.width = panel.width + 'px'; 
                if (!panel.collapsed) panel.element.style.height = panel.height + 'px';
            } 
        }

        // 组件添加方法
        addButton(args) { return this._addComponent(args, 'button', { label: Cast.toString(args.LABEL) }); }
        addLabel(args) { return this._addComponent(args, 'label', { text: Cast.toString(args.TEXT) }); }
        addInput(args) { return this._addComponent(args, 'input', { placeholder: Cast.toString(args.PLACEHOLDER), value: Cast.toString(args.DEFAULT_VALUE) }); }
        addDropdown(args) { 
            const options = Cast.toString(args.OPTIONS).split(',').map(o => o.trim()); 
            return this._addComponent(args, 'dropdown', { options: options, selected: Cast.toNumber(args.DEFAULT_INDEX), value: options[Cast.toNumber(args.DEFAULT_INDEX)] || '' }); 
        }
        addColorPicker(args) { return this._addComponent(args, 'colorpicker', { label: Cast.toString(args.LABEL), color: Cast.toString(args.DEFAULT_COLOR) }); }
        addCheckbox(args) { return this._addComponent(args, 'checkbox', { label: Cast.toString(args.LABEL), checked: Cast.toBoolean(args.DEFAULT_STATE) }); }
        addSlider(args) { return this._addComponent(args, 'slider', { min: Cast.toNumber(args.MIN), max: Cast.toNumber(args.MAX), value: Cast.toNumber(args.DEFAULT_VALUE) }); }
        addSeparator(args) { return this._addComponent(args, 'separator', {}); }
        addCustomHTML(args) { return this._addComponent(args, 'custom', { html: Cast.toString(args.HTML) }); }

        _addComponent(args, type, props) {
            const panelId = Cast.toString(args.PANEL_ID);
            const panel = this._panels.get(panelId);
            if (!panel) return '';
            const componentId = this._generateComponentId(Cast.toString(args.COMP_ID), panelId);
            const component = { id: componentId, type: type, panelId: panelId, ...props };
            this._components.set(componentId, component);
            panel.components.push(componentId);
            this._renderComponent(componentId);
            return componentId;
        }

        destroyComponent(args) {
            const panelId = Cast.toString(args.PANEL_ID);
            const componentId = Cast.toString(args.COMPONENT_ID);
            const fullId = componentId.includes('_') ? componentId : `${panelId}_${componentId}`;
            const component = this._components.get(fullId);
            if (component && component.panelId === panelId) {
                const panel = this._panels.get(panelId);
                if (panel) {
                    const index = panel.components.indexOf(fullId);
                    if (index > -1) panel.components.splice(index, 1);
                }
                if (component.element) component.element.remove();
                this._components.delete(fullId);
            }
        }

        destroyPanel(args) {
            const panelId = Cast.toString(args.PANEL_ID);
            const panel = this._panels.get(panelId);
            if (panel) {
                for (const compId of panel.components) {
                    const comp = this._components.get(compId);
                    if (comp && comp.element) comp.element.remove();
                    this._components.delete(compId);
                }
                if (panel.element) panel.element.remove();
                this._panels.delete(panelId);
            }
        }

        destroyAllPanels() {
            for (const [panelId, panel] of this._panels) {
                if (panel.element) panel.element.remove();
                for (const compId of panel.components) this._components.delete(compId);
            }
            this._panels.clear();
            this._components.clear();
        }

        closePanel(args) { this.destroyPanel(args); }
        
        clearPanel(args) {
            const panelId = Cast.toString(args.PANEL_ID);
            const panel = this._panels.get(panelId);
            if (panel) {
                for (const compId of panel.components) {
                    const component = this._components.get(compId);
                    if (component && component.element) component.element.remove();
                    this._components.delete(compId);
                }
                panel.components = [];
                if (panel.contentElement) panel.contentElement.innerHTML = '';
            }
        }

        setInputValue(args) {
            const inputId = Cast.toString(args.INPUT_ID);
            const component = this._components.get(inputId);
            if (component && component.type === 'input') {
                component.value = Cast.toString(args.VALUE);
                if (component.element) {
                    const inputEl = component.element.querySelector('input');
                    if (inputEl) inputEl.value = component.value;
                }
            }
        }

        setSliderValue(args) {
            const sliderId = Cast.toString(args.SLIDER_ID);
            const component = this._components.get(sliderId);
            if (component && component.type === 'slider') {
                component.value = Cast.toNumber(args.VALUE);
                if (component.element) {
                    const sliderEl = component.element.querySelector('input[type="range"]');
                    if (sliderEl) sliderEl.value = component.value;
                    const valueSpan = component.element.querySelector('span:last-child');
                    if (valueSpan) valueSpan.textContent = component.value;
                }
            }
        }

        setCheckboxState(args) {
            const checkboxId = Cast.toString(args.CHECKBOX_ID);
            const component = this._components.get(checkboxId);
            if (component && component.type === 'checkbox') {
                component.checked = Cast.toBoolean(args.STATE);
                if (component.element) {
                    const checkboxEl = component.element.querySelector('input[type="checkbox"]');
                    if (checkboxEl) checkboxEl.checked = component.checked;
                }
            }
        }

        // 事件方法
        onButtonClick(args) { return this._createPromiseEvent('click', Cast.toString(args.BUTTON_ID)); }
        onInputChange(args) { return this._createPromiseEvent('change', Cast.toString(args.INPUT_ID)); }
        onColorChange(args) { return this._createPromiseEvent('colorchange', Cast.toString(args.COLOR_ID)); }
        onCheckboxChange(args) { return this._createPromiseEvent('checkboxchange', Cast.toString(args.CHECKBOX_ID)); }
        onSliderChange(args) { return this._createPromiseEvent('sliderchange', Cast.toString(args.SLIDER_ID)); }
        onDropdownChange(args) { return this._createPromiseEvent('dropdownchange', Cast.toString(args.DROPDOWN_ID)); }
        onPanelCollapse(args) { return this._createPromiseEvent('collapse', `panel_${Cast.toString(args.PANEL_ID)}`); }
        onPanelExpand(args) { return this._createPromiseEvent('expand', `panel_${Cast.toString(args.PANEL_ID)}`); }

        // 获取值方法
        getInputValue(args) { const comp = this._components.get(Cast.toString(args.INPUT_ID)); return comp?.value || ''; }
        getColorValue(args) { const comp = this._components.get(Cast.toString(args.COLOR_ID)); return comp?.color || '#4A90E2'; }
        getCheckboxState(args) { const comp = this._components.get(Cast.toString(args.CHECKBOX_ID)); return comp?.checked || false; }
        getSliderValue(args) { const comp = this._components.get(Cast.toString(args.SLIDER_ID)); return comp?.value || 50; }
        getDropdownValue(args) { const comp = this._components.get(Cast.toString(args.DROPDOWN_ID)); return comp?.value || ''; }
        panelExists(args) { return this._panels.has(Cast.toString(args.PANEL_ID)); }
        componentExists(args) { 
            const panelId = Cast.toString(args.PANEL_ID);
            const componentId = Cast.toString(args.COMPONENT_ID);
            const fullId = componentId.includes('_') ? componentId : `${panelId}_${componentId}`;
            const comp = this._components.get(fullId);
            return comp && comp.panelId === panelId;
        }
        getAllPanels() { return Array.from(this._panels.keys()).join(','); }
        getPanelComponents(args) { 
            const panel = this._panels.get(Cast.toString(args.PANEL_ID)); 
            return panel ? panel.components.join(',') : ''; 
        }
    }

    extensions.register(new PanelGUIExtension(runtime));
})(Scratch);