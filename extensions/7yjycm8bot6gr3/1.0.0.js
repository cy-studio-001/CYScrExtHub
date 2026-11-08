(function(Scratch, vm, runtime, Blockly) {
	const {ArgumentType, BlockType, TargetType, Cast, translate, extensions}=Scratch;
	// 这个函数来自白猫的HTML
	// 接受数组并生成HTML结构
	const generateHTML = (array) => {
		const container = document.createElement('div');
		container.className = 'array-viewer';

		// 样式
		const style = document.createElement('style');
		style.textContent = `
			.array-viewer {
				font-family: Arial, sans-serif;
				border: 1px solid #ddd;
				padding: 10px;
				margin: 10px;
				overflow: auto;
				max-height: 300px;
			}
			.array-item {
				padding: 5px;
				cursor: pointer;
			}
			.array-item:hover {
				background-color: #f0f0f0;
			}
			.highlight-overlay {
				display: none;
				position: absolute;
				background-color: rgba(0, 123, 255, 0.3);
				border: 2px solid rgba(0, 123, 255, 0.8);
				z-index: 9999;
				pointer-events: none;
			}
			.tooltip {
				position: absolute;
				background-color: #fff;
				color: #333;
				padding: 8px;
				border: 1px solid #ccc;
				border-radius: 4px;
				font-size: 12px;
				z-index: 10000;
				pointer-events: none;
				box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
				max-width: 300px;
			}
			.tooltip h4 {
				margin: 0 0 5px;
				font-size: 14px;
				color: #007bff;
			}
			.tooltip p {
				margin: 0;
				font-size: 12px;
				line-height: 1.4;
			}
			.copy-success {
				position: fixed;
				background-color: rgba(0, 123, 255, 0.9);
				color: #fff;
				padding: 5px 10px;
				border-radius: 4px;
				font-size: 12px;
				z-index: 10001;
				pointer-events: none;
				opacity: 0;
				transition: transform 0.3s ease, opacity 0.3s ease;
				transform-origin: top left;
			}
		`;
		container.appendChild(style);

		const overlay = document.createElement('div');
		overlay.className = 'highlight-overlay';

		const tooltip = document.createElement('div');
		tooltip.className = 'tooltip';
		tooltip.style.display = 'none';

		let copySuccess = null;

		// 创建数组展示
		array.forEach((item, index) => {
			const itemDiv = document.createElement('div');
			itemDiv.className = 'array-item';

			if (item instanceof Element) {
				const content = item.outerHTML;
				itemDiv.textContent = `Item ${index + 1}: ${content.length > 50 ? content.slice(0, 50) + '...' : content}`;
			} else {
				const content = String(item);
				itemDiv.textContent = `Item ${index + 1}: ${content.length > 50 ? content.slice(0, 50) + '...' : content}`;
			}

			itemDiv.addEventListener('mouseover', () => {
				if (item instanceof Element) {
					document.body.appendChild(overlay);
					document.body.appendChild(tooltip);
					const rect = item.getBoundingClientRect();
					overlay.style.display = 'block';
					overlay.style.top = `${rect.top + window.scrollY}px`;
					overlay.style.left = `${rect.left + window.scrollX}px`;
					overlay.style.width = `${rect.width}px`;
					overlay.style.height = `${rect.height}px`;

					let classNames = '';
					if (item.className) {
						if (typeof item.className === 'string') {
							classNames = `.${item.className.replace(/\s+/g, '.')}`;
						} else if (item.className.baseVal) { // For SVG elements
							classNames = `.${item.className.baseVal.replace(/\s+/g, '.')}`;
						}
					}

					tooltip.style.display = 'block';
					tooltip.innerHTML = `
						<h4>${item.tagName.toLowerCase()}${item.id ? `#${item.id}` : ''}${classNames}</h4>
						<p><strong>Dimensions:</strong> ${Math.round(rect.width)} x ${Math.round(rect.height)}</p>
						<p><strong>Position:</strong> (${Math.round(rect.left)}, ${Math.round(rect.top)})</p>
					`;
					tooltip.style.top = `${Math.min(rect.bottom + window.scrollY + 5, window.innerHeight - tooltip.offsetHeight - 5)}px`;
					tooltip.style.left = `${Math.max(
						Math.min(rect.left + window.scrollX, window.innerWidth - tooltip.offsetWidth - 10),
						5
					)}px`;
				}
			});

			itemDiv.addEventListener('mouseout', () => {
				if (item instanceof Element) {
					overlay.remove();
					tooltip.remove();
				}
			});

			itemDiv.addEventListener('click', (event) => {
				let content;
				if (item instanceof Element) {
					content = item.outerHTML;
				} else {
					content = String(item);
				}

				navigator.clipboard.writeText(content).then(() => {
					if (!copySuccess) {
						copySuccess = document.createElement('div');
						copySuccess.className = 'copy-success';
						document.body.appendChild(copySuccess);
					}

					copySuccess.textContent = '复制成功';
					copySuccess.style.opacity = '0';
					copySuccess.style.transform = 'scale(0)';
					copySuccess.style.top = `${event.clientY + 10}px`;
					copySuccess.style.left = `${event.clientX + 10}px`;
					setTimeout(() => {
						copySuccess.style.transform = 'scale(1)';
						copySuccess.style.opacity = '1';
					}, 10);

					setTimeout(() => {
						copySuccess.style.opacity = '0';
						copySuccess.style.transform = 'scale(0)';
						setTimeout(() => {
							if (copySuccess) {
								document.body.removeChild(copySuccess);
								copySuccess = null;
							}
						}, 300);
					}, 1310);
				});
			});

			container.appendChild(itemDiv);
		});

		return container;
	}
	class DomList extends Array {
		constructor(list) {
			const lists = Array.from(list);
			super(...lists)
		}

		getHTML(boolean) {
			if (boolean) {
				return this;
			}
			return generateHTML(this);
		}
	}
	class HTML {
		constructor(html, inDom) {
			this.inDom = inDom;
			if (typeof html == 'string') {
				this.html = html.trim();
				let doms = document.createElement("div");
				doms.innerHTML = this.html;
				this.dom = doms;
			} else if (html instanceof Element) {
				this.html = html.outerHTML;
				this.dom = html;
			}
		}

		toString() {
			return this.html;
		}

		getHTML(real) {
			if (this.inDom && !real) {
				return generateHTML([this.dom]);
			}
			return this.dom;
		}
	}
	let Wrapper = class _Wrapper extends String {
		/**
		 * Construct a wrapped value.
		 * @param value Value to wrap.
		 */
		constructor(value) {
			super(value);
			this.value = value;
		}
		/**
		 * Unwraps a wrapped object.
		 * @param value Wrapped object.
		 * @returns Unwrapped object.
		 */
		static unwrap(value) {
			return value instanceof _Wrapper ? value.value : value;
		}
		/**
		 * toString method for Scratch monitors.
		 * @returns String display.
		 */
		toString() {
			return String(this.value);
		}
	};

	function show(Blockly, id, value, textAlign) {
		const workspace = Blockly.getMainWorkspace();
		const block = workspace.getBlockById(id);
		if (!block)
			return;
		Blockly.DropDownDiv.hideWithoutAnimation();
		Blockly.DropDownDiv.clearContent();
		const contentDiv = Blockly.DropDownDiv.getContentDiv(), elem = document.createElement("div");
		elem.setAttribute("class", "valueReportBox");
		elem.append(...value);
		elem.style.maxWidth = "none";
		elem.style.maxHeight = "none";
		elem.style.textAlign = textAlign;
		elem.style.userSelect = "none";
		contentDiv.appendChild(elem);
		Blockly.DropDownDiv.setColour(
			Blockly.Colours.valueReportBackground,
			Blockly.Colours.valueReportBorder
		);
		Blockly.DropDownDiv.showPositionedByBlock(
			workspace,
			block
		);
		return elem;
	}
	let listeners={};

	const rngCom=()=>Math.floor(Math.random() * 256);
	const RGB2hex=(rgb)=>`#${(1 << 24 | rgb.r << 16 | rgb.g << 8 | rgb.b).toString(16).slice(1)}`;
	const randomColor=()=>RGB2hex({ r: rngCom(), g: rngCom(), b: rngCom()});

	const getInfo=()=>({
		id: "Element",
		name: "HTML元素",
		color1: "#52baba",
		color1: "#459c9c",
		init(){
			this.toElement=element=>{
				if(element instanceof Element) return element;
				if(Wrapper.unwrap(element) instanceof HTML) return Wrapper.unwrap(element).dom;
				return null;
			};
			this.canvas = () => {
				try {
					const { canvas } = runtime.renderer;
					if (canvas instanceof HTMLCanvasElement) {
						return canvas;
					}
				} catch (err) {
					return null;
				}
				return null;
			};
			this.parent = () => {
				try {
					const { canvas } = runtime.renderer;
					if (canvas instanceof HTMLCanvasElement) {
						return canvas.parentElement;
					}
				} catch (err) {
					console.error(err);
					return null;
				}
				return null;
			};
			if (this.canvas() === null || this.parent() === null) {
				console.warn("当前页面不支持把HTML元素添加到舞台，请前往作品详情页体验完整作品！");
			}
			const _visualReport = runtime.visualReport;
			runtime.visualReport = (blockId, value) => {
				const unwrappedValue = Wrapper.unwrap(value);
				if (unwrappedValue instanceof HTML || unwrappedValue instanceof DomList) {
					show(
						Blockly,
						blockId,
						[unwrappedValue.getHTML()],
						"center"
					);
				} else {
					return _visualReport.call(runtime, blockId, value);
				}
			};
			const _requestUpdateMonitor = runtime.requestUpdateMonitor;
			const monitorMap = /* @__PURE__ */ new Map();
			if (_requestUpdateMonitor) {
				const patchMonitorValue = (element, value) => {
					const unwrappedValue = Wrapper.unwrap(value);
					const valueElement = element.querySelector('[class*="value"]');
					if (valueElement instanceof Element) {
						const internalInstance = Object.values(valueElement).find(
							(v) => typeof v === "object" && v !== null && Reflect.has(v, "stateNode")
						);
						if (unwrappedValue instanceof HTML || unwrappedValue instanceof DomList) {
							const inspector = unwrappedValue.getHTML();
							valueElement.style.textAlign = "left";
							valueElement.style.backgroundColor = "rgb(30, 30, 30)";
							valueElement.style.color = "#eeeeee";
							while (valueElement.firstChild)
								valueElement.removeChild(valueElement.firstChild);
							valueElement.append(inspector);
						} else {
							if (internalInstance) {
								valueElement.style.textAlign = "";
								valueElement.style.backgroundColor = internalInstance.memoizedProps?.style?.background ?? "";
								valueElement.style.color = internalInstance.memoizedProps?.style?.color ?? "";
								while (valueElement.firstChild)
									valueElement.removeChild(valueElement.firstChild);
								valueElement.append(String(value));
							}
						}
					}
				};
				const getMonitorById = (id2) => {
					const elements = document.querySelectorAll(
						`[class*="monitor_monitor-container"]`
					);
					for (const element of Object.values(elements)) {
						const internalInstance = Object.values(element).find(
							(v) => typeof v === "object" && v !== null && Reflect.has(v, "children")
						);
						if (internalInstance) {
							const props = internalInstance?.children?.props;
							if (id2 === props?.id) return element;
						}
					}
					return null;
				};
				runtime.requestUpdateMonitor = (state) => {
					const id2 = state.get("id");
					if (typeof id2 === "string") {
						const monitorValue = state.get("value");
						const unwrappedValue = Wrapper.unwrap(monitorValue);
						const monitorMode = state.get("mode");
						const monitorVisible = state.get("visible");
						const cache = monitorMap.get(id2);
						if (typeof monitorMode === "string" && cache) {
							cache.mode = monitorMode;
							cache.value = void 0;
						} else if (monitorValue !== void 0) {
							if (unwrappedValue instanceof HTML || unwrappedValue instanceof DomList) {
								if (!cache || cache.value !== monitorValue) {
									requestAnimationFrame(() => {
										const monitor = getMonitorById(id2);
										if (monitor) {
											patchMonitorValue(monitor, monitorValue);
										}
									});
									if (!cache) {
										monitorMap.set(id2, {
											value: monitorValue,
											mode: (() => {
												if (runtime.getMonitorState) {
													const monitorCached = runtime.getMonitorState().get(id2);
													if (monitorCached) {
														const mode = monitorCached.get("mode");
														return typeof mode === "string" ? mode : "normal";
													}
												}
												return "normal";
											})()
										});
									} else cache.value = monitorValue;
								}
								return true;
							} else {
								if (monitorMap.has(id2)) {
									const monitor = getMonitorById(id2);
									if (monitor) {
										patchMonitorValue(monitor, monitorValue);
									}
									monitorMap.delete(id2);
								}
							}
						} else if (monitorVisible !== void 0) {
							if (!monitorVisible) monitorMap.delete(id2);
						}
					}
					return _requestUpdateMonitor.call(runtime, state);
				};
			}
		},
		blocks: [
			"parse",
			"r",
			"解析[element]",
			{
				element: [
					"s",
					`<div>自定义<strong>html</strong>，比如<color style="color:#ff2e00">彩</color><color style="color:#007bff">色</color>的字</div>`,
				],
			},
			function({element}){
				if(Wrapper.unwrap(element) instanceof HTML) return Wrapper.unwrap(element).dom;
				if(element instanceof Element) return element;
				if(element instanceof NodeList) return element;
				if(typeof element=="string"){
					const doc =  new DOMParser().parseFromString(element, "application/xml");
					return doc.documentElement;
				}
			},
			{
				allowDropAnywhere: true,
				outputShape: 3,
			},

			"element",
			"r",
			"获取[element]的Element",
			{
				element: [],
			},
			function({element}){
				if(Wrapper.unwrap(element) instanceof HTML) return Wrapper.unwrap(element).dom;
				if(element instanceof Element) return element;
				if(element instanceof NodeList) return element;
				if(typeof element=="string"){
					const doc =  new DOMParser().parseFromString(element, "application/xml");
					return doc.documentElement;
				}
			},
			{
				allowDropAnywhere: true,
				outputShape: 3,
			},

			"createElement",
			"r",
			"创建一个[type]元素",
			{
				type: [
					"s",
					"div",
				],
			},
			function({type}){
				return document.createElement(type);
			},
			{
				outputShape: 3,
			},

			"show",
			"r",
			"显示[element]",
			{
				element: [
					"s",
					`可以显示自定义<strong>html</strong>，比如<color style="color:#ff2e00">彩</color><color style="color:#007bff">色</color>的字，<a href="https://assets.ccw.site/extension/Element" target="_blank"><color style="color:#007bff">超链接</color></a>，甚至是<button style="background-color:#007bff" onclick="alert('点击了按钮')">按钮</button>`,
				],
			},
			function({element}){
				return new Wrapper(new HTML(this.toElement(element) ?? element, false));
			},
			{
				outputShape: 3,
			},

			"querySelector",
			"r",
			"CSS选择器[element][type][selector]",
			{
				element: [],
				type: [
					"s",
					"单个",
					[
						false,
						[
							"单个",
							"所有",
						],
					],
				],
				selector: [
					"s",
					"div",
				],
			},
			function({element, type, selector}){
				try{
					return (this.toElement(element) ?? element ?? document)["querySelector"+(type=="所有" ? "All" : "")](selector);
				}
				catch(e){
					return e;
				}
			},
			{
				allowDropAnywhere: true,
				outputShape: 3,
			},

			"getProp",
			"r",
			"获取[element]的[type]属性[prop]",
			{
				element: [],
				type: [
					"s",
					"JavaScript",
					"propType",
				],
				prop: [
					"s",
					"innerHTML",
				],
			},
			function({element, type, prop}){
				switch(type){
					case "html": return this.toElement(element)?.getAttribute?.(prop);
					case "JavaScript": return this.toElement(element)?.[prop] ?? element?.[prop];
					default: return "";
				}
			},
			{
				allowDropAnywhere: true,
				outputShape: 3,
			},

			"setProp",
			"r",
			"设置[element]的[type]属性[prop]为[value]",
			{
				element: [],
				type: [
					"s",
					"JavaScript",
					"propType",
				],
				prop: [
					"s",
					"innerText",
				],
				value: [
					"s",
					"文本",
				],
			},
			function({element, type, prop, value}){
				try{
					let _element=this.toElement(element);
					switch(type){
						case "html": {
							_element?.setAttribute?.(prop, value);
							break;
						}
						case "JavaScript": {
							_element[prop]=value;
							break;
						}
						default: return;
					}
					return _element;
				}
				catch{
					try{
						element[prop]=value;
					}
					catch{}
				}
			},
			{
				outputShape: 3,
			},

			"setStyle",
			"r",
			"设置[element]的样式[style]为[value]",
			{
				element: [],
				style: [
					"s",
					"cssText",
				],
				value: [
					"s",
					"background-color: #00ff00; width: 100px; height: 100px;",
				],
			},
			function({element, style, value}){
				element=this.toElement(element);
				if(!element) return "";
				element.style[style]=value;
				return element;
			},
			{
				outputShape: 3,
			},

			"getStyle",
			"r",
			"获取[element]的样式[style]",
			{
				element: [],
				style: [
					"s",
					"cssText",
				],
			},
			function({element, style, value}){
				element=this.toElement(element);
				if(!element) return "";
				return element.style[style];
			},
			{
				outputShape: 3,
			},

			"operation2",
			"a",
			"[operation][element]",
			{
				operation: [
					"s",
					"remove",
					"operation2",
				],
				element: [],
			},
			function({operation, element}){
				return (this.toElement(element) ?? element)?.[operation]?.() ?? "";
			},
			{},

			"clone",
			"r",
			"[deep]克隆[element]",
			{
				deep: [
					"s",
					"true",
					[
						true,
						[
							[
								"单层",
								"false",
							],
							[
								"深度",
								"true",
							],
						],
					],
					"b",
				],
				element: [],
			},
			function({deep, element}){
				element=this.toElement(element);
				if(!element) return "";
				return element.cloneNode(deep);
			},
			{
				outputShape: 3,
			},

			"replace",
			"a",
			"以[element2]替换[element1]",
			{
				element1: [],
				element2: [],
			},
			function({element1, element2}){
				element1=this.toElement(element1);
				if(!element1) return "";
				element2=this.toElement(element2);
				if(!element2) return "";
				return element1.replaceWith(element2);
			},
			{},

			"getCSSpart",
			"r",
			"获取[element]的CSSpart[part]",
			{
				element: [],
				part: [
					"s",
				],
			},
			function({element, part}){
				element=this.toElement(element);
				if(!element) return "";
				if(!part) return "";
				return element.shadowRoot?.querySelector?.(`[part=${JSON.stringify(part)}]`) ?? "";
			},
			{
				outputShape: 3,
			},

			"Stage",
			"r",
			"舞台",
			{
				type: [
					"s",
					"div",
				],
			},
			function({type}){
				return this.parent();
			},
			{
				outputShape: 3,
			},

			"body",
			"r",
			"body",
			{},
			function({}){
				return document.body;
			},
			{
				outputShape: 3,
			},

			,
			"l",
			"子元素",
			,
			,
			,

			"operation",
			"a",
			"为[element1][operation]子元素[element2]",
			{
				element1: [],
				operation: [
					"s",
					"append",
					"operation",
				],
				elemen2: [],
			},
			function({element1, operation, element2}){
				element1=this.toElement(element1);
				if(!element1) return "";
				element2=this.toElement(element2);
				if(!element2) return "";
				try{
					return element1[operation+"Child"]?.(element2);
				}
				catch{}
			},
			{},

			"hasChild",
			"b",
			"[element1]中有子元素[element2]?",
			{
				element1: [],
				element2: [],
			},
			function({element1, operation, element2}){
				element1=this.toElement(element1);
				if(!element1) return false;
				element2=this.toElement(element2);
				if(!element2) return false;
				return Array.from(element1.children).includes(element2);
			},
			{},

			"getChild",
			"r",
			"[element]的第[number]个子元素",
			{
				element: [],
				number: [
					"n",
					1,
					,
					1,
				],
			},
			function({element, number}){
				element=this.toElement(element);
				if(!element) return "";
				return element.children[number-1] ?? "";
			},
			{
				outputShape: 3,
			},

			"getChildrenLength",
			"r",
			"[element]的子元素数量",
			{
				element: [],
			},
			function({element}){
				element=this.toElement(element);
				if(!element) return 0;
				return element.children.length;
			},
			{
				allowDropAnywhere: true,
				outputShape: 3,
			},

			"children",
			"r",
			"[element]的所有子元素",
			{
				element: [],
			},
			function({element}){
				element=this.toElement(element);
				if(!element) return new Wrapper(new DomList([]));
				return new Wrapper(new DomList(element.children));
			},
			{
				outputShape: 3,
			},

			"parentElement",
			"r",
			"[element]的父元素",
			{
				element: [],
			},
			function({element}){
				element=this.toElement(element);
				if(!element) return "";
				return element.parentElement;
			},
			{
				outputShape: 3,
			},

			,
			"l",
			"事件",
			,
			,
			,

			"whenListener",
			"e",
			"当触发事件id[id]",
			{
				id: [
					"s",
					"event1",
					"event",
				],
			},
			({id})=>true,
			{
				isEdgeActivated: false,
			},

			"event",
			"r",
			"event",
			{},
			function({}, util){
				return util.thread.ElementEvent || "";
			},
			{
				outputShape: 3,
			},

			"addEventListener",
			"a",
			"为[element]添加[event]事件id[id]",
			{
				element: [],
				event: [
					"s",
					"click",
				],
				id: [
					"s",
					"event1",
				],
			},
			function({element, event, id}, util){
				element=this.toElement(element);
				if(!element) return "";
				if(listeners[id]) return "id不能重复";
				const func=e=>{
					if (!util.stackFrame.startedThreads) {
						util.stackFrame.startedThreads = runtime.startHats("Element_whenListener", {id});
						if (util.stackFrame.startedThreads.length === 0) {
							return;
						} else {
							util.stackFrame.startedThreads.forEach(
								(thread) => (thread.ElementEvent = e)
							);
						}
					}
				};
				listeners[id]={
					element,
					event,
					func,
				};
				return element.addEventListener(event, func);
			},
			{},

			"removeEventListener",
			"a",
			"移除事件id[id]",
			{
				id: [
					"s",
					"event1",
					"event",
				],
			},
			function({id}){
				if(listeners[id]){
					const {element, event, func}=listeners[id];
					delete listeners[id];
					return element.removeEventListener(event, func);
				}
			},
			{},

			,
			"l",
			"其他",
			,
			,
			,

			"stageInfo",
			"r",
			"舞台[type]",
			{
				type: [
					"s",
					"Width",
					[
						true,
						[
							[
								"宽度",
								"Width",
							],
							[
								"高度",
								"Height",
							],
						],
					],
				],
			},
			function({type}){
				return runtime[`stage${type}`];
			},
			{},

			"parseFloat",
			"r",
			"parseFloat[number]",
			{
				number: [
					"s",
					"10px",
					,
					parseFloat,
				],
			},
			({number})=>number,
			{},

			"toImage",
			"r",
			"把[element]保存为[type]",
			{
				element: [],
				type: [
					"s",
					"png",
					[
						true,
						[
							[
								"svg URL",
								"svgUrl",
							],
							[
								"svg文本",
								"svgStr",
							],
							"png",
						],
					],
				],
			},
			function({element, type}){
				element=this.toElement(element);
				if(!element) return "";
				if(element instanceof HTMLCanvasElement) if(type=="png") return element.toDataURL('image/png');
				const svgStr = `
					<svg xmlns="http://www.w3.org/2000/svg" width="${element.offsetWidth}" height="${element.offsetHeight}">
						<foreignObject x="0" y="0" width="100%" height="100%">
							${new XMLSerializer().serializeToString(element)}
						</foreignObject>
					</svg>
				`;
				const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;

				if(type=="svgUrl") return svgUrl;
				if(type=="svgStr") return svgStr;
				if(type=="png") return new Promise((resolve, reject)=>{
					// 转换为PNG
					const img = new Image();
					img.onload = () => {
						const canvas = document.createElement('canvas');
						canvas.width = element.offsetWidth;
						canvas.height = element.offsetHeight;
						const ctx = canvas.getContext('2d');
						ctx.drawImage(img, 0, 0);
						resolve(canvas.toDataURL('image/png'));
					};
					img.onerror=e=>reject("");
					img.src = svgUrl;
				});
			},
			{},

			"converttocanvascoords",
			"r",
			"将[scrcoord]转换为[coordMenu]轴上的[coordTypes]单位",
			{
				scrcoord: [
					"n",
					10,
				],
				coordMenu: [
					"s",
					"x",
					"coordMenu",
				],
				coordTypes: [
					"s",
					"Canvas",
					"coordTypes",
				],
			},
			function({ coordMenu, scrcoord, coordTypes }) {
				if (coordTypes == "Canvas") {
					if (coordMenu == "x") {
						return runtime.stageWidth / 2 + scrcoord;
					} else {
						return scrcoord * -1 + runtime.stageHeight / 2;
					}
				} else {
					if (coordMenu == "x") {
						return scrcoord - runtime.stageWidth / 2;
					} else {
						return scrcoord * -1 - runtime.stageHeight / 2;
					}
				}
			},
			{},

			"return",
			"a",
			"[value]",
			{
				value: [],
			},
			({value})=>value,
			{},
		],
		menus: {
			propType: [
				false,
				[
					"html",
					"JavaScript",
				],
			],
			operation: [
				false,
				[
					[
						"添加",
						"append",
					],
					[
						"移除",
						"remove",
					],
				],
			],
			operation2: [
				true,
				[
					[
						"移除",
						"remove",
					],
					[
						"点击",
						"click",
					],
				],
			],
			event: [
				false,
				function(){
					let keys=Object.keys(listeners);
					return keys.length==0 ? [{
						text: "没有事件",
						value: "no",
					}] : keys
				},
			],
			coordMenu: [
				true,
				["x", "y"],
			],
			coordTypes: [
				true,
				["Canvas", "Scratch"],
			],
		},
	});
	function entries(obj){
		try{
			if(Array.isArray(obj)){
				new Map(obj);
				return obj;
			}
			else return Object.entries(obj);
		}
		catch{
			return [];
		}
	}
	function hijack(fn) {
		const _orig = Function.prototype.apply;
		Function.prototype.apply = function (thisArg) {
			return thisArg;
		};
		const result = fn();
		Function.prototype.apply = _orig;
		return result;
	}
	function getBlockly(vm) {
		if (vm._events["EXTENSION_ADDED"] instanceof Array) {
			for (const value of vm._events["EXTENSION_ADDED"]) {
				const v = hijack(value);
				if (v?.ScratchBlocks) {
					Blockly = v?.ScratchBlocks;
					break;
				}
			}
		} else if (vm._events["EXTENSION_ADDED"]) {
			Blockly = hijack(vm._events["EXTENSION_ADDED"])?.ScratchBlocks;
		}
		return Blockly;
	}
	function parseblocks(_blocks, docs, blocks_parse_mode, menus, obj){
		let blocks=[];
		if(!Array.isArray(_blocks)) return [];
		let i=0;
		while(i<_blocks.length){
			let _block, block_index;
			if(blocks_parse_mode==1){
				block_index=i/6;
				_block=_blocks.slice(i, i+6);
				i+=6;
			}
			else if(blocks_parse_mode==2){
				block_index=i;
				_block=_blocks[i];
				i++;
			}
			else throw new Error("unknow mode");
			const [opcode, blockType, text, args, func, otherSetting]=_block;
			blocks[block_index]=otherSetting ?? {};
			if(typeof otherSetting=="object"){
				if(Array.isArray(otherSetting)){
					otherSetting.forEach((value, index)=>{
						blocks[block_index][[
							"allowDropAnywhere",
							"hideFromPalette",
							"disableMonitor",
							"isEdgeActivated",
							"branchCount",
							"output",
							"outputShape",
							"tooltip",
						][index]]=value;
					});
				}
			}
			let block=blocks[block_index];
			block.blockType={
				r: BlockType.REPORTER,
				b: BlockType.BOOLEAN,
				a: BlockType.COMMAND,
				l: BlockType.LABEL,
				h: BlockType.HAT,
				c: BlockType.CONDITIONAL,
				t: BlockType.BUTTON,
				e: BlockType.EVENT,
				x: BlockType.XML,
			}[blockType] ?? blockType;
			block[block.blockType==BlockType.BUTTON ? "func":"opcode"]=opcode;
			block[block.blockType==BlockType.XML ? "xml" : "text"]=text;
			block.arguments={};
			if(args) for(let [argument, [type, defaultValue, menu]] of entries(args)){
				block.arguments[argument]={
					type: {
						s: ArgumentType.STRING,
						n: ArgumentType.NUMBER,
						b: ArgumentType.BOOLEAN,
						c: ArgumentType.COLOR,
						a: ArgumentType.ANGLE,
					}[type],
					defaultValue,
					menu: (function(menu){
						if(Array.isArray(menu)){
							menus[`${block.func ?? block.opcode}_${argument}`]=menu;
							return `${block.func ?? block.opcode}_${argument}`;
						}
						else return menu;
					})(menu),
				}
			}
			if(typeof func=="function") obj[block.func ?? block.opcode]=function(_args, ...otherArgs){
				if(typeof _args!="object") return func.call(this, _args, ...otherArgs);
				let result=func.call(this, new Proxy(_args, {
					get: (target, property)=>{
						let fn={
							s: Cast.toString,
							n: Cast.toNumber,
							b: Cast.toBoolean,
							d: value=>{
								if(
									typeof value=="number" ||
									typeof value=="boolean"
								) return value;
								if(value=="true") return true;
								if(value=="false") return false;
								if(
									Number.isNaN(value) ||
									Number.isFinite(value) ||
									Number(value)!=NaN
								) return Number(value);
								if(typeof value=="string") return value;
								return value;
							},
							_s: String,
							_n: Number,
							_b: Boolean,
							1: {
								[ArgumentType.STRING]: Cast.toString,
								[ArgumentType.NUMBER]: Cast.toNumber,
								[ArgumentType.BOOLEAN]: Cast.toBoolean,
								[ArgumentType.ANGLE]: Cast.toNumber,
							}[block.arguments[property]?.type],
							0: {
								[ArgumentType.STRING]: String,
								[ArgumentType.NUMBER]: Number,
								[ArgumentType.BOOLEAN]: Boolean,
								[ArgumentType.ANGLE]: Number,
							}[block.arguments[property]?.type],
						}[args[property]?.[3]] ?? args[property]?.[3]?.bind?.(this);
						if(typeof fn=="function") return fn(Reflect.get(target, property));
						return Reflect.get(target, property);
					}
				}), ...otherArgs);
				if(opcode!=="element"){
					if(result instanceof NodeList) return new Wrapper(new DomList(result));
					if(result instanceof Element) return new Wrapper(new HTML(result, true));
				}
				return result;
			};
		}
		if(docs){
			const {docsURI, docsTEXT}=docs;
			blocks.splice(0, 0, {
				func: "_openDocs",
				blockType: BlockType.BUTTON,
				text: docsTEXT,
			});
			obj._openDocs=function(){
				let a = document.createElement("a");
				a.href = docsURI;
				a.target = "_blank";
				a.click();
			};
		}
		return blocks;
	}
	function parseitems(_items, name, obj){
		try{
			let items=[];
			if(Array.isArray(_items)) for(let item of _items){
				if(Array.isArray(item)){
					let [text, value]=item;
					items.push({text, value});
				}
				else items.push(item);
			}
			else if(typeof _items=="function"){
				obj[`_menu_${name}_items`]=_items;
				items=`_menu_${name}_items`;
			}
			else items=_items;
			return items;
		}
		catch{
			return [];
		}
	}	
	function parsemenus(_menus, obj){
		let menus={};
		for(let [name, menu] of entries(_menus)){
			let [acceptReporters, items]=menu;
			menus[name]={acceptReporters, items: parseitems(items, name, obj)};
		}
		return menus;
	}
	let _info;
	class Extension {
		constructor(_runtime){
			runtime=_runtime;
			vm=runtime.extensionManager.vm;
			Blockly=window.ScratchBlocks ?? runtime.scratchBlocks ?? getBlockly(vm);

			// 改变默认设置，改编自 xiaochen004hao 的 ShowHidden
			const cbfsb = runtime._convertBlockForScratchBlocks.bind(runtime);
			runtime._convertBlockForScratchBlocks = (blockInfo, categoryInfo) => {
				const res = cbfsb(blockInfo, categoryInfo);
				if (blockInfo.outputShape) res.json.outputShape = blockInfo.outputShape;
				if (blockInfo.branchCount) res.json.branchCount = blockInfo.branchCount;
				if (blockInfo.tooltip) res.json.tooltip = blockInfo.tooltip;
				if (blockInfo.color) [res.json.colour, res.json.colourSecondary, res.json.colourTertiary] = blockInfo.color instanceof Array ? blockInfo.color : [blockInfo.color];
                if (blockInfo.disableMonitor) {
					delete res.json.checkboxInFlyout;
				}
				else if(typeof blockInfo.disableMonitor!="undefined") {
					res.json.checkboxInFlyout = true;
				}
				if (blockInfo.output) {
					res.json.output = blockInfo.output;
				}
				else {
					if (res.json.output !== undefined) res.json.output = null;
				}
				if (blockInfo.info) Object.assign(res.info, blockInfo.info);
				if (blockInfo.json) Object.assign(res.json, blockInfo.json);
				if (blockInfo.xml) res.xml = blockInfo.xml;
				return res;
			}
			_info=getInfo.call(this);
			_info.init?.call?.(this);
		}
		getInfo() {
			const {
				id,
				name,
				color1,
				color2,
				color3,
				icon: blockIconURI,
				docs=false,
				docsURI="https://assets.ccw.site/extension/"+id,
				docsTEXT="打开文档",
				blocks_parse_mode=1,
				blocks=[],
				menus={},
				init,
				...otherSettings
			}=_info=getInfo.call(this);
			return {
				id,
				name,
				...(function(allColor){
					Object.entries(allColor).forEach(([color, key])=>{
						if(color=="random") allColor[key]=randomColor();
						else if(typeof color=="object") allColor[key]=RGB2hex(color);
						else allColor[key]=color;
					});
					return allColor;
				})({color1, color2, color3}),
				blockIconURI,
				// docsURI,
				blocks: parseblocks(blocks, docs && {docsURI, docsTEXT}, blocks_parse_mode, menus, Extension.prototype),
				menus: parsemenus(menus, Extension.prototype),
				...otherSettings,
			};
		}
	}
	Scratch.extensions.register(new Extension(Scratch.vm?.runtime ?? Scratch.runtime));
})(Scratch);
