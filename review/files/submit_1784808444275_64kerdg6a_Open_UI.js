/******************************************************************************
 * SCRATCH EXTENSION: Open UI - 文本编辑器                                    
 *                                                                            
 * 开发者: 丁丁d=====(￣▽￣*)b                                               
 * CCW ID: 275012633                                                          
 * 联系方式: dingding12350@outlook.com                                        
 *                                                                            
 * 版本信息:                                                                  
 * 当前版本: ✦ Release V 1.1.0 ✦                                             
 * 创建日期: 2025-09-13                                                       
 * 最后更新: 2025-11-01                                                       
 *                                                                            
 * 扩展ID: OpenUITextEditor                                                   
 * Scratch兼容: 3.0及以上版本                                                 
 * 兼容平台: Gandi, TurboWarp (必须开启在非沙盒环境下运行)                    
 *                                                                            
 * 功能描述                                                                   
 * Open UI 系列扩展 - 文本编辑器组件                                         
 ******************************************************************************/
(function(Scratch){
'use strict';

if(!Scratch.extensions.unsandboxed){
 throw new Error('Open UI 文本编辑器必须在非沙盒环境下运行');
}

const {ArgumentType, BlockType, Cast, translate} = Scratch;

// 常量配置
const EDITOR_CONFIG={
 MIN_WIDTH:300,MIN_HEIGHT:200,DEFAULT_WIDTH:600,DEFAULT_HEIGHT:400,DEFAULT_FONT_SIZE:14,
 STAGE_WIDTH:480,STAGE_HEIGHT:360 // 舞台基准尺寸
};

// 多语言配置
translate.setup({
 zh:{
  'extensionName':'Open UI - 文本编辑器','feedbackButton':'反馈问题',
  // 分类标签
  'label_basic_control':'基础控制','label_text_operations':'文本操作','label_line_operations':'行操作',
  'label_position_size':'位置大小','label_appearance':'外观样式','label_window_control':'窗口控制',
  'label_permissions':'权限控制','label_other_features':'其他功能','label_embed_stage':'嵌入舞台',
  'label_drag_control':'拖动控制',
  // 基础控制
  'showEditor':'显示编辑器 [ID] 标题 [TITLE]','hideEditor':'隐藏编辑器 [ID]','isEditorVisible':'编辑器 [ID] 显示?',
  // 文本操作
  'setEditorText':'设置 [ID] 文本为 [TEXT]','getEditorText':'获取 [ID] 文本','clearEditorText':'清空 [ID] 文本','appendEditorText':'在 [ID] 末尾添加 [TEXT]',
  // 行操作
  'getAllLines':'获取 [ID] 所有行 [FORMAT]','getLineCount':'获取 [ID] 行数','getLineText':'获取 [ID] 第 [LINE] 行','setLineText':'设置 [ID] 第 [LINE] 行为 [TEXT]','insertLine':'在 [ID] 第 [LINE] 行插入 [TEXT]','deleteLine':'删除 [ID] 第 [LINE] 行',
  // 位置大小
  'setEditorPosition':'设置 [ID] 位置 X [X] Y [Y]','setEditorX':'设置 [ID] X位置 [X]','setEditorY':'设置 [ID] Y位置 [Y]','getEditorPositionX':'获取 [ID] X位置','getEditorPositionY':'获取 [ID] Y位置','changeEditorPosition':'[ID] 位置增加 X [DX] Y [DY]','changeEditorX':'[ID] X位置增加 [DX]','changeEditorY':'[ID] Y位置增加 [DY]','setEditorSize':'设置 [ID] 大小 宽 [W] 高 [H]','setEditorWidth':'设置 [ID] 宽度 [W]','setEditorHeight':'设置 [ID] 高度 [H]','getEditorWidth':'获取 [ID] 宽度','getEditorHeight':'获取 [ID] 高度','changeEditorSize':'[ID] 大小增加 宽 [DW] 高 [DH]','changeEditorWidth':'[ID] 宽度增加 [DW]','changeEditorHeight':'[ID] 高度增加 [DH]','resetEditorPosition':'重置 [ID] 位置到中心',
  // 外观样式
  'setTheme':'设置 [ID] 主题为 [THEME]','getTheme':'获取 [ID] 主题','setFontSize':'设置 [ID] 字体大小 [SIZE]','getFontSize':'获取 [ID] 字体大小','setFontFamily':'设置 [ID] 字体 [FONT]','setOpacity':'设置 [ID] 透明度 [OPACITY]','setBackgroundImage':'设置 [ID] 背景图片 [URL] 填充 [SIZE]','removeBackgroundImage':'移除 [ID] 背景图片',
  // 窗口控制
  'minimizeEditor':'最小化 [ID]','maximizeEditor':'最大化 [ID]','restoreEditor':'恢复 [ID] 大小','isMaximized':'[ID] 最大化?','isMinimized':'[ID] 最小化?',
  // 权限控制
  'lockEditor':'锁定 [ID]','unlockEditor':'解锁 [ID]','getLockState':'获取 [ID] 锁定状态',
  // 其他功能
  'focusEditor':'[ID] 获得焦点','scrollToLine':'滚动 [ID] 到第 [LINE] 行','getSelectedText':'获取 [ID] 选中文本','getCursorPosition':'获取 [ID] 光标位置',
  // 嵌入舞台功能
  'embedInStage':'嵌入 [ID] 到舞台 X [X] Y [Y] 宽 [W] 高 [H]','removeFromStage':'从舞台移除 [ID]','isEmbedded':'[ID] 嵌入舞台?','setAutoResize':'设置 [ID] 自适应大小 [MODE]',
  // 拖动控制 (整合)
  'setDragState':'设置 [ID] 拖动 [STATE]','isDragEnabled':'[ID] 拖动启用?',
  // 默认值
  'editorText_default':'在这里输入文本...','editorTitle_default':'文本编辑器','editorId_default':'editor1',
  // 菜单选项
  'theme_light':'亮色','theme_dark':'暗色','theme_auto':'自动','format_text':'文本','format_json':'JSON','format_array':'数组','format_lines':'带行号','font_monospace':'等宽','font_sans':'无衬线','font_serif':'衬线','background_cover':'填充','background_repeat':'平铺','background_stretch':'拉伸','background_contain':'居中','resize_none':'关闭','resize_width':'宽度','resize_height':'高度','resize_both':'两者','drag_enable':'启用','drag_disable':'禁用',
  // 右键菜单
  '_textcut':'剪切','_textcopy':'复制','_textpaste':'粘贴','_textselectall':'全选','_textundo':'撤销','_textredo':'重做',
  // 窗口控制按钮提示
  'minimizeEditor_tooltip':'最小化','maximizeEditor_tooltip':'最大化','restoreEditor_tooltip':'恢复','closeEditor_tooltip':'关闭'
 }
});

class OpenUITextEditor{
 constructor(runtime){
  this.runtime=runtime;
  this.editors=new Map();
  this._currentZIndex=10000;
  this._globalEventHandlers=new Map();
  this._openUILayer=null;
  this._stageContainer=null;
  this._resizeObserver=null;
  this._openUIContainer=null;
  
  this._createOpenUILayer();
  this._createOpenUIContainer();
  this._addGlobalStyles();
  this._setupGlobalEventHandlers();
  this._findStageContainer();
 }

 _t(key){return translate({id:key})||key;}

 _createOpenUILayer(){
  if(document.getElementById('open-ui-layer')){
   this._openUILayer=document.getElementById('open-ui-layer');
  }else{
   this._openUILayer=document.createElement('div');
   this._openUILayer.id='open-ui-layer';
   this._openUILayer.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10000;';
   document.body.appendChild(this._openUILayer);
  }
 }

 _createOpenUIContainer(){
  if(document.querySelector('.openUI')){
   this._openUIContainer=document.querySelector('.openUI');
  }else{
   this._openUIContainer=document.createElement('div');
   this._openUIContainer.className='openUI';
   this._openUIContainer.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;overflow:hidden;';
  }
 }

 _findStageContainer(){
  const stageSelectors=['.gandi_stage_stage_1fD7k','.gandi_stage_stage-wrapper_eRRuk','.stage-wrapper','.gui_stage','[class*="stage"]','#stage'];
  for(const selector of stageSelectors){
   const element=document.querySelector(selector);
   if(element){this._stageContainer=element;break;}
  }
  if(this._stageContainer&&this._openUIContainer&&!this._openUIContainer.parentNode){
   this._stageContainer.appendChild(this._openUIContainer);
   this._setupStageResizeObserver();
  }
 }

 _setupStageResizeObserver(){
  if(!this._stageContainer||!window.ResizeObserver)return;
  this._resizeObserver=new ResizeObserver(()=>{this._updateAllEmbeddedEditors();});
  this._resizeObserver.observe(this._stageContainer);
 }

 _updateAllEmbeddedEditors(){
  this.editors.forEach((editor)=>{
   if(editor.isEmbedded&&editor.autoResize!=='none'){this._updateEmbeddedEditorSize(editor);}
  });
 }

 _updateEmbeddedEditorSize(editor){
  if(!editor.isEmbedded||!this._stageContainer||editor.isMaximized)return;
  try{
   const stageRect=this._stageContainer.getBoundingClientRect();
   const scaleX=stageRect.width/EDITOR_CONFIG.STAGE_WIDTH;
   const scaleY=stageRect.height/EDITOR_CONFIG.STAGE_HEIGHT;
   let width,height;
   if(editor.autoResize==='width'||editor.autoResize==='both'){width=Math.max(EDITOR_CONFIG.MIN_WIDTH,editor.embeddedSize.width*scaleX);}else{width=editor.size.width;}
   if(editor.autoResize==='height'||editor.autoResize==='both'){height=Math.max(EDITOR_CONFIG.MIN_HEIGHT,editor.embeddedSize.height*scaleY);}else{height=editor.size.height;}
   const x=editor.embeddedPosition.x*scaleX;
   const y=editor.embeddedPosition.y*scaleY;
   editor.container.style.left=x+'px';
   editor.container.style.top=y+'px';
   editor.container.style.width=width+'px';
   editor.container.style.height=height+'px';
   editor.position.x=x;editor.position.y=y;
   editor.size.width=width;editor.size.height=height;
  }catch(error){console.error('更新嵌入编辑器大小时出错:',error);}
 }

 _setupGlobalEventHandlers(){
  const clickHandler=(e)=>{
   let target=e.target;
   while(target&&target!==this._openUILayer){
    if(target.classList&&target.classList.contains('open-ui-component')){
     const editorId=target.dataset.editorId;
     if(editorId)this._bringToFront(editorId);
     break;
    }
    target=target.parentElement;
   }
  };
  this._openUILayer.addEventListener('mousedown',clickHandler);
  this._globalEventHandlers.set('mousedown',clickHandler);
 }

 _addGlobalStyles(){
  if(document.getElementById('open-ui-styles'))return;
  const style=document.createElement('style');
  style.id='open-ui-styles';
  style.textContent=`
  #open-ui-layer{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10000;}
  .openUI{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;overflow:hidden;}
  .open-ui-component{pointer-events:auto;position:fixed;border-radius:12px;z-index:10000;display:none;flex-direction:column;font-family:system-ui,-apple-system,sans-serif;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px)saturate(180%);border:1px solid rgba(0,0,0,0.1);box-shadow:0 10px 30px rgba(0,0,0,0.15),0 0 0 1px rgba(0,0,0,0.05);overflow:hidden;min-width:${EDITOR_CONFIG.MIN_WIDTH}px;min-height:${EDITOR_CONFIG.MIN_HEIGHT}px;resize:both;transition:all 0.2s cubic-bezier(0.4,0,0.2,1);}
  .open-ui-component.embedded{position:absolute !important;z-index:10;resize:none;}
  .open-ui-component.drag-disabled .open-ui-title-bar{cursor:default !important;}
  .open-ui-component.drag-disabled .open-ui-title-bar:active{cursor:default !important;}
  .open-ui-title-bar{height:40px;display:flex;align-items:center;padding:0 16px;font-weight:500;cursor:grab;user-select:none;justify-content:space-between;background:rgba(255,255,255,0.8);border-bottom:1px solid rgba(0,0,0,0.1);font-size:13px;color:#333;position:relative;z-index:10001;}
  .open-ui-title-bar:active{cursor:grabbing;}
  .open-ui-component.embedded .open-ui-title-bar{background:rgba(255,255,255,0.9);}
  .open-ui-window-controls{display:flex;align-items:center;gap:8px;position:relative;z-index:10002;}
  .open-ui-window-control{width:12px;height:12px;border-radius:50%;cursor:pointer;transition:all 0.2s ease;position:relative;border:none;}
  .open-ui-window-control:hover{transform:scale(1.1);}
  .open-ui-window-control:active{transform:scale(0.9);}
  .open-ui-close-btn{background:#ff5f56;}
  .open-ui-close-btn:hover{background:#ff3b30;}
  .open-ui-minimize-btn{background:#ffbd2e;}
  .open-ui-minimize-btn:hover{background:#ffa500;}
  .open-ui-maximize-btn{background:#27c93f;}
  .open-ui-maximize-btn:hover{background:#00c300;}
  .open-ui-component.embedded .open-ui-window-control{opacity:0.8;}
  .open-ui-component.embedded .open-ui-window-control:hover{opacity:1;}
  .open-ui-window-control.disabled{opacity:0.5;cursor:not-allowed;pointer-events:none;}
  .open-ui-window-control.disabled:hover{transform:none;}
  .open-ui-title-text{flex:1;text-align:center;padding:0 80px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .open-ui-editor-content{display:flex;width:100%;height:calc(100% - 40px);position:relative;}
  .open-ui-editor-content.hidden{display:none;}
  .open-ui-line-numbers{width:50px;padding:8px 4px;overflow-y:auto;text-align:right;font-family:'Monaco','Menlo',monospace;font-size:12px;line-height:1.5;user-select:none;flex-shrink:0;background:rgba(0,0,0,0.03);color:#666;border-right:1px solid rgba(0,0,0,0.1);scrollbar-width:none;-ms-overflow-style:none;}
  .open-ui-line-numbers::-webkit-scrollbar{display:none;}
  .open-ui-editor-textarea{flex:1;border:none;padding:8px;resize:none;background:transparent;font-family:'Monaco','Menlo',monospace;font-size:14px;line-height:1.5;outline:none;color:#333;white-space:pre-wrap;word-wrap:break-word;}
  .open-ui-editor-textarea::placeholder{color:#999;}
  .open-ui-dark-theme{background:rgba(30,30,30,0.95);border:1px solid rgba(255,255,255,0.1);}
  .open-ui-dark-theme .open-ui-title-bar{background:rgba(50,50,50,0.8);border-bottom:1px solid rgba(255,255,255,0.1);color:#fff;}
  .open-ui-dark-theme .open-ui-line-numbers{background:rgba(255,255,255,0.05);color:#888;border-right:1px solid rgba(255,255,255,0.1);}
  .open-ui-dark-theme .open-ui-editor-textarea{color:#fff;background:transparent;}
  .open-ui-dark-theme .open-ui-editor-textarea::placeholder{color:#666;}
  .open-ui-resize-handle{position:absolute;bottom:0;right:0;width:16px;height:16px;cursor:nw-resize;z-index:1000;background:linear-gradient(135deg,transparent 50%,rgba(0,0,0,0.2)50%);border-top-left-radius:6px;transition:opacity 0.2s ease;opacity:0.6;}
  .open-ui-resize-handle:hover{opacity:1;}
  .open-ui-dark-theme .open-ui-resize-handle{background:linear-gradient(135deg,transparent 50%,rgba(255,255,255,0.3)50%);}
  .open-ui-component.embedded .open-ui-resize-handle{display:none;}
  .open-ui-component.minimized{resize:none;height:40px !important;min-height:40px !important;}
  .open-ui-component.minimized .open-ui-editor-content{display:none;}
  .open-ui-component.maximized{resize:none;border-radius:0;border:none;}
  .open-ui-component.maximized:not(.embedded){top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;}
  .open-ui-component.maximized.embedded{top:0 !important;left:0 !important;width:100% !important;height:100% !important;}
  .open-ui-component.locked .open-ui-resize-handle,.open-ui-component.maximized .open-ui-resize-handle,.open-ui-component.minimized .open-ui-resize-handle{display:none;}
  .open-ui-component.locked-all .open-ui-window-control{opacity:0.3;cursor:not-allowed;}
  .open-ui-component.locked-all .open-ui-window-control:not(.open-ui-close-btn){pointer-events:none;}
  .open-ui-component.dragging{transition:none;z-index:10001;box-shadow:0 20px 50px rgba(0,0,0,0.3);cursor:grabbing;user-select:none;opacity:0.95;transform:scale(1.02);}
  .open-ui-title-bar.dragging{cursor:grabbing;}
  .open-ui-contextmenu{position:fixed;z-index:10001;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px)saturate(180%);border-radius:8px;box-shadow:0 8px 25px rgba(0,0,0,0.15),0 0 0 1px rgba(0,0,0,0.05);padding:6px 0;min-width:160px;font-family:system-ui,sans-serif;font-size:13px;opacity:0;transform:scale(0.95)translateY(-10px);transition:all 0.2s cubic-bezier(0.4,0,0.2,1);pointer-events:none;}
  .open-ui-contextmenu.visible{opacity:1;transform:scale(1)translateY(0);pointer-events:all;}
  .open-ui-contextmenu.open-ui-dark-theme{background:rgba(40,40,40,0.95);color:#fff;}
  .open-ui-contextmenu-item{padding:8px 16px;cursor:pointer;transition:all 0.15s ease;user-select:none;display:flex;align-items:center;gap:8px;}
  .open-ui-contextmenu-item:hover{background:rgba(100,100,255,0.1);}
  .open-ui-contextmenu-separator{height:1px;background:rgba(0,0,0,0.1);margin:4px 0;}
  .open-ui-dark-theme .open-ui-contextmenu-separator{background:rgba(255,255,255,0.1);}
  .open-ui-contextmenu-shortcut{margin-left:auto;opacity:0.6;font-size:11px;}
  .open-ui-cursor-tooltip{position:fixed;z-index:10004;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:500;white-space:nowrap;opacity:0;visibility:hidden;transition:all 0.2s ease;pointer-events:none;min-width:auto;text-align:center;transform:translateY(-5px);backdrop-filter:none;border:none;max-width:120px;line-height:1.2;}
  .open-ui-cursor-tooltip.light{background:rgba(0,0,0,0.85);color:white;}
  .open-ui-cursor-tooltip.dark{background:rgba(255,255,255,0.9);color:#333;}
  .open-ui-cursor-tooltip.visible{opacity:1;visibility:visible;transform:translateY(0);}
  .open-ui-cursor-tooltip::after{display:none;}
  `;
  document.head.appendChild(style);
 }

 _bringToFront(editorId){
  const editor=this.editors.get(editorId);
  if(!editor)return;
  this._currentZIndex++;
  editor.container.style.zIndex=this._currentZIndex;
 }

 _createEditor(id){
  const editor={
   id,container:null,textarea:null,lineNumbers:null,contextMenu:null,
   isVisible:false,isMaximized:false,isMinimized:false,isLocked:false,isEmbedded:false,
   dragEnabled:true,autoResize:'none',
   position:{x:100,y:100},size:{width:EDITOR_CONFIG.DEFAULT_WIDTH,height:EDITOR_CONFIG.DEFAULT_HEIGHT},
   embeddedPosition:{x:0,y:0},embeddedSize:{width:400,height:300},
   theme:'light',originalSize:null,originalPosition:null,preMaximizeState:null,zIndex:10000,
   backgroundImage:'',backgroundSize:'cover',opacity:1,fontFamily:'monospace',fontSize:EDITOR_CONFIG.DEFAULT_FONT_SIZE,
   lockSettings:{preventResize:false,preventMinimize:false,preventMaximize:false,preventClose:false}
  };
  this._createEditorUI(editor);
  this._createContextMenu(editor);
  return editor;
 }

 _createEditorUI(editor){
  editor.container=document.createElement('div');
  editor.container.className=`open-ui-component open-ui-${editor.theme}-theme`;
  editor.container.dataset.editorId=editor.id;
  editor.container.style.cssText=`position:fixed;top:${editor.position.y}px;left:${editor.position.x}px;width:${editor.size.width}px;height:${editor.size.height}px;display:none;z-index:${editor.zIndex};`;

  editor.titleBar=document.createElement('div');
  editor.titleBar.className='open-ui-title-bar';

  const windowControls=document.createElement('div');
  windowControls.className='open-ui-window-controls';

  let cursorTooltip=document.querySelector('.open-ui-cursor-tooltip');
  if(!cursorTooltip){
   cursorTooltip=document.createElement('div');
   cursorTooltip.className='open-ui-cursor-tooltip light';
   document.body.appendChild(cursorTooltip);
  }

  const controls=[
   {class:'open-ui-close-btn',tooltip:this._t('closeEditor_tooltip'),action:()=>this._hideEditorWithCheck(editor)},
   {class:'open-ui-minimize-btn',tooltip:this._t('minimizeEditor_tooltip'),action:()=>this._toggleMinimize(editor)},
   {class:'open-ui-maximize-btn',tooltip:this._t('maximizeEditor_tooltip'),action:()=>this._toggleMaximize(editor)}
  ];

  controls.forEach(control=>{
   const btn=document.createElement('div');
   btn.className=`open-ui-window-control ${control.class}`;
   let tooltipTimeout;
   btn.addEventListener('mouseenter',(e)=>{
    clearTimeout(tooltipTimeout);
    const isDarkTheme=editor.container.classList.contains('open-ui-dark-theme');
    cursorTooltip.className=`open-ui-cursor-tooltip ${isDarkTheme?'dark':'light'}`;
    cursorTooltip.textContent=control.tooltip;
    cursorTooltip.classList.add('visible');
    this._updateTooltipPosition(e,cursorTooltip);
   });
   btn.addEventListener('mousemove',(e)=>{this._updateTooltipPosition(e,cursorTooltip);});
   btn.addEventListener('mouseleave',()=>{
    tooltipTimeout=setTimeout(()=>{cursorTooltip.classList.remove('visible');},100);
   });
   btn.onclick=(e)=>{
    e.stopPropagation();
    this._bringToFront(editor.id);
    control.action();
    cursorTooltip.classList.remove('visible');
   };
   windowControls.appendChild(btn);
  });

  const titleElement=document.createElement('div');
  titleElement.className='open-ui-title-text';
  titleElement.textContent=`${this._t('editorTitle_default')} - ${editor.id}`;

  editor.titleBar.appendChild(windowControls);
  editor.titleBar.appendChild(titleElement);

  editor.editorContent=document.createElement('div');
  editor.editorContent.className='open-ui-editor-content';

  editor.lineNumbers=document.createElement('div');
  editor.lineNumbers.className='open-ui-line-numbers';

  editor.textarea=document.createElement('textarea');
  editor.textarea.className='open-ui-editor-textarea';
  editor.textarea.placeholder=this._t('editorText_default');

  editor.editorContent.appendChild(editor.lineNumbers);
  editor.editorContent.appendChild(editor.textarea);
  editor.container.appendChild(editor.titleBar);
  editor.container.appendChild(editor.editorContent);

  const resizeHandle=document.createElement('div');
  resizeHandle.className='open-ui-resize-handle';
  editor.container.appendChild(resizeHandle);

  this._makeDraggable(editor);
  this._makeResizable(editor,resizeHandle);
  this._setupTextareaEvents(editor);

  this._openUILayer.appendChild(editor.container);
 }

 _updateTooltipPosition(event,tooltip){
  if(!tooltip||!tooltip.classList.contains('visible'))return;
  const offsetX=10,offsetY=10;
  let x=event.clientX+offsetX,y=event.clientY+offsetY;
  const tooltipRect=tooltip.getBoundingClientRect();
  const viewportWidth=window.innerWidth,viewportHeight=window.innerHeight;
  if(x+tooltipRect.width>viewportWidth){x=event.clientX-tooltipRect.width-offsetX;}
  if(y+tooltipRect.height>viewportHeight){y=event.clientY-tooltipRect.height-offsetY;}
  x=Math.max(5,x);y=Math.max(5,y);
  tooltip.style.left=x+'px';tooltip.style.top=y+'px';
 }

 destroy(){
  if(this._resizeObserver){this._resizeObserver.disconnect();this._resizeObserver=null;}
  this.editors.forEach((editor,id)=>{
   if(editor.container){editor.container.remove();}
   if(editor.contextMenu){editor.contextMenu.remove();}
  });
  this.editors.clear();
  this._globalEventHandlers.forEach((handler,event)=>{this._openUILayer.removeEventListener(event,handler);});
  this._globalEventHandlers.clear();
  const tooltips=document.querySelectorAll('.open-ui-cursor-tooltip');
  tooltips.forEach(tooltip=>tooltip.remove());
  const styles=document.getElementById('open-ui-styles');
  if(styles)styles.remove();
  if(this._openUIContainer){this._openUIContainer.remove();}
 }

 _toggleMinimize(editor){
  if(editor.isMinimized){this.restoreEditor({ID:editor.id});}else{this.minimizeEditor({ID:editor.id});}
 }

 _toggleMaximize(editor){
  if(editor.isMaximized){this.restoreEditor({ID:editor.id});}else{this.maximizeEditor({ID:editor.id});}
 }

 _hideEditorWithCheck(editor){
  if(!editor.lockSettings.preventClose){this.hideEditor({ID:editor.id});}
 }

 _updateWindowControls(editor){
  const minimizeBtn=editor.container.querySelector('.open-ui-minimize-btn');
  const maximizeBtn=editor.container.querySelector('.open-ui-maximize-btn');
  const closeBtn=editor.container.querySelector('.open-ui-close-btn');
  if(minimizeBtn){editor.lockSettings.preventMinimize?minimizeBtn.classList.add('disabled'):minimizeBtn.classList.remove('disabled');}
  if(maximizeBtn){editor.lockSettings.preventMaximize?maximizeBtn.classList.add('disabled'):maximizeBtn.classList.remove('disabled');}
  if(closeBtn){editor.lockSettings.preventClose?closeBtn.classList.add('disabled'):closeBtn.classList.remove('disabled');}
 }

 _makeDraggable(editor){
  let isDragging=false,startX,startY,initialX,initialY;
  const startDrag=(e)=>{
   if(!editor.dragEnabled||editor.isEmbedded||e.target.classList.contains('open-ui-window-control'))return;
   this._bringToFront(editor.id);
   if(e.detail===2&&!editor.lockSettings.preventMaximize){this._toggleMaximize(editor);return;}
   if(editor.isMaximized){
    this.restoreEditor({ID:editor.id});
    const mouseX=e.clientX,mouseY=e.clientY;
    const newX=mouseX-(editor.size.width/2),newY=mouseY-20;
    const screenWidth=window.innerWidth,screenHeight=window.innerHeight;
    const boundedX=Math.max(10,Math.min(newX,screenWidth-editor.size.width-10));
    const boundedY=Math.max(10,Math.min(newY,screenHeight-100));
    editor.container.style.left=boundedX+'px';editor.container.style.top=boundedY+'px';
    editor.position.x=boundedX;editor.position.y=boundedY;
    startX=e.clientX;startY=e.clientY;initialX=boundedX;initialY=boundedY;
   }else{
    startX=e.clientX;startY=e.clientY;
    const rect=editor.container.getBoundingClientRect();
    initialX=rect.left;initialY=rect.top;
   }
   isDragging=true;
   editor.container.classList.add('dragging');editor.titleBar.classList.add('dragging');editor.container.style.transition='none';
   const onDrag=(e)=>{
    if(!isDragging)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    let newX=initialX+dx,newY=initialY+dy;
    // 边界限制
    if(editor.isEmbedded){
     const stageRect=this._stageContainer.getBoundingClientRect();
     newX=Math.max(0,Math.min(newX,stageRect.width-editor.size.width));
     newY=Math.max(0,Math.min(newY,stageRect.height-editor.size.height));
    }else{
     const screenWidth=window.innerWidth,screenHeight=window.innerHeight;
     newX=Math.max(10,Math.min(newX,screenWidth-editor.size.width-10));
     newY=Math.max(10,Math.min(newY,screenHeight-100));
    }
    editor.container.style.left=newX+'px';editor.container.style.top=newY+'px';
    editor.position.x=newX;editor.position.y=newY;
    if(editor.isEmbedded){
     const stageRect=this._stageContainer.getBoundingClientRect();
     const scaleX=stageRect.width/EDITOR_CONFIG.STAGE_WIDTH;
     const scaleY=stageRect.height/EDITOR_CONFIG.STAGE_HEIGHT;
     editor.embeddedPosition.x=newX/scaleX;editor.embeddedPosition.y=newY/scaleY;
    }
   };
   const stopDrag=()=>{
    isDragging=false;
    editor.container.classList.remove('dragging');editor.titleBar.classList.remove('dragging');editor.container.style.transition='';
    document.removeEventListener('mousemove',onDrag);document.removeEventListener('mouseup',stopDrag);
   };
   document.addEventListener('mousemove',onDrag);document.addEventListener('mouseup',stopDrag);
  };
  editor.titleBar.addEventListener('mousedown',startDrag);
 }

 _makeResizable(editor,resizeHandle){
  let isResizing=false,startX,startY,startWidth,startHeight;
  const startResize=(e)=>{
   if(editor.isMaximized||editor.isMinimized||(editor.isEmbedded&&editor.autoResize==='none')||editor.lockSettings.preventResize)return;
   this._bringToFront(editor.id);
   isResizing=true;
   startX=e.clientX;startY=e.clientY;
   startWidth=editor.container.offsetWidth;startHeight=editor.container.offsetHeight;
   editor.container.style.transition='none';
   const onResize=(e)=>{
    if(!isResizing)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    let newWidth=Math.max(EDITOR_CONFIG.MIN_WIDTH,startWidth+dx);
    let newHeight=Math.max(EDITOR_CONFIG.MIN_HEIGHT,startHeight+dy);
    // 嵌入模式下的边界限制
    if(editor.isEmbedded){
     const stageRect=this._stageContainer.getBoundingClientRect();
     const maxWidth=stageRect.width-editor.position.x;
     const maxHeight=stageRect.height-editor.position.y;
     newWidth=Math.min(newWidth,maxWidth);
     newHeight=Math.min(newHeight,maxHeight);
    }
    editor.container.style.width=newWidth+'px';editor.container.style.height=newHeight+'px';
    editor.size.width=newWidth;editor.size.height=newHeight;
    if(editor.isEmbedded){
     const stageRect=this._stageContainer.getBoundingClientRect();
     const scaleX=stageRect.width/EDITOR_CONFIG.STAGE_WIDTH;
     const scaleY=stageRect.height/EDITOR_CONFIG.STAGE_HEIGHT;
     editor.embeddedSize.width=newWidth/scaleX;editor.embeddedSize.height=newHeight/scaleY;
    }
    this._updateLineNumbers(editor);
   };
   const stopResize=()=>{
    isResizing=false;
    editor.container.style.transition='';
    document.removeEventListener('mousemove',onResize);document.removeEventListener('mouseup',stopResize);
   };
   document.addEventListener('mousemove',onResize);document.addEventListener('mouseup',stopResize);
   e.stopPropagation();
  };
  resizeHandle.addEventListener('mousedown',startResize);
 }

 _setupTextareaEvents(editor){
  editor.textarea.addEventListener('input',()=>this._updateLineNumbers(editor));
  editor.textarea.addEventListener('scroll',()=>{editor.lineNumbers.scrollTop=editor.textarea.scrollTop;});
  editor.lineNumbers.addEventListener('wheel',(e)=>{e.preventDefault();editor.textarea.scrollBy(0,e.deltaY);});
  editor.lineNumbers.addEventListener('mousedown',(e)=>{e.preventDefault();editor.textarea.focus();});
  this._updateLineNumbers(editor);
 }

 _updateLineNumbers(editor){
  const lines=editor.textarea.value.split('\n');
  editor.lineNumbers.innerHTML='';
  for(let i=1;i<=lines.length;i++){
   const lineNum=document.createElement('div');
   lineNum.textContent=i;
   editor.lineNumbers.appendChild(lineNum);
  }
  editor.lineNumbers.scrollTop=editor.textarea.scrollTop;
 }

 _createContextMenu(editor){
  const contextMenu=document.createElement('div');
  contextMenu.className=`open-ui-contextmenu open-ui-${editor.theme}-theme`;
  const menuItems=[
   {id:'cut',text:this._t('_textcut'),shortcut:'Ctrl+X',action:()=>this._cutText(editor)},
   {id:'copy',text:this._t('_textcopy'),shortcut:'Ctrl+C',action:()=>this._copyText(editor)},
   {id:'paste',text:this._t('_textpaste'),shortcut:'Ctrl+V',action:()=>this._pasteText(editor)},
   {separator:true},
   {id:'selectall',text:this._t('_textselectall'),shortcut:'Ctrl+A',action:()=>this._selectAllText(editor)},
   {separator:true},
   {id:'undo',text:this._t('_textundo'),shortcut:'Ctrl+Z',action:()=>this._undoText(editor)},
   {id:'redo',text:this._t('_textredo'),shortcut:'Ctrl+Y',action:()=>this._redoText(editor)}
  ];
  menuItems.forEach(item=>{
   if(item.separator){
    const separator=document.createElement('div');
    separator.className='open-ui-contextmenu-separator';
    contextMenu.appendChild(separator);
   }else{
    const menuItem=document.createElement('div');
    menuItem.className='open-ui-contextmenu-item';
    menuItem.dataset.action=item.id;
    const textSpan=document.createElement('span');
    textSpan.textContent=item.text;
    const shortcutSpan=document.createElement('span');
    shortcutSpan.className='open-ui-contextmenu-shortcut';
    shortcutSpan.textContent=item.shortcut;
    menuItem.appendChild(textSpan);menuItem.appendChild(shortcutSpan);
    menuItem.addEventListener('click',(e)=>{e.stopPropagation();item.action();this._hideContextMenu(editor);});
    contextMenu.appendChild(menuItem);
   }
  });
  document.body.appendChild(contextMenu);
  editor.contextMenu=contextMenu;
  this._addContextMenuListeners(editor);
 }

 _addContextMenuListeners(editor){
  const showContextMenu=(e)=>{e.preventDefault();e.stopPropagation();this._showContextMenu(editor,e.clientX,e.clientY);};
  const hideMenuHandler=(e)=>{if(editor.contextMenu&&editor.contextMenu.classList.contains('visible')&&!editor.contextMenu.contains(e.target)){this._hideContextMenu(editor);}};
  const escHandler=(e)=>{if(e.key==='Escape'&&editor.contextMenu&&editor.contextMenu.classList.contains('visible')){this._hideContextMenu(editor);}};
  editor.textarea.addEventListener('contextmenu',showContextMenu);
  document.addEventListener('click',hideMenuHandler);document.addEventListener('keydown',escHandler);
 }

 _showContextMenu(editor,x,y){
  if(!editor.contextMenu)return;
  editor.contextMenu.className=`open-ui-contextmenu open-ui-${editor.theme}-theme visible`;
  editor.contextMenu.style.left=x+'px';editor.contextMenu.style.top=y+'px';
  const rect=editor.contextMenu.getBoundingClientRect();
  const viewportWidth=window.innerWidth,viewportHeight=window.innerHeight;
  if(rect.right>viewportWidth){editor.contextMenu.style.left=(x-rect.width)+'px';}
  if(rect.bottom>viewportHeight){editor.contextMenu.style.top=(y-rect.height)+'px';}
 }

 _hideContextMenu(editor){if(editor.contextMenu){editor.contextMenu.classList.remove('visible');}}
 _cutText(editor){editor.textarea.focus();document.execCommand('cut');}
 _copyText(editor){editor.textarea.focus();document.execCommand('copy');}
 _pasteText(editor){editor.textarea.focus();document.execCommand('paste');}
 _selectAllText(editor){editor.textarea.focus();editor.textarea.select();}
 _undoText(editor){editor.textarea.focus();document.execCommand('undo');}
 _redoText(editor){editor.textarea.focus();document.execCommand('redo');}

 _getEditor(id){
  const editor=this.editors.get(id);
  if(!editor){console.warn(`编辑器"${id}"不存在`);}
  return editor;
 }

 _getOrCreateEditor(id){
  let editor=this._getEditor(id);
  if(!editor){editor=this._createEditor(id);this.editors.set(id,editor);}
  return editor;
 }

 // ==================== 公开方法 ====================

 // 基础控制方法
 showEditor(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const title=Cast.toString(args.TITLE||this._t('editorTitle_default'));
  const editor=this._getOrCreateEditor(id);
  const titleElement=editor.titleBar.querySelector('.open-ui-title-text');
  if(titleElement){titleElement.textContent=title;}
  editor.container.style.display='flex';editor.isVisible=true;
  this._bringToFront(id);
  setTimeout(()=>this.focusEditor({ID:id}),100);
 }

 hideEditor(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  if(editor&&!editor.lockSettings.preventClose){editor.container.style.display='none';editor.isVisible=false;}
 }

 isEditorVisible(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.isVisible:false;
 }

 // 文本操作方法
 setEditorText(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const text=Cast.toString(args.TEXT||'');
  const editor=this._getEditor(id);
  if(editor){editor.textarea.value=text;this._updateLineNumbers(editor);}
 }

 getEditorText(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.textarea.value:'';
 }

 clearEditorText(args){this.setEditorText({ID:args.ID,TEXT:''});}

 appendEditorText(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const text=Cast.toString(args.TEXT||'');
  const editor=this._getEditor(id);
  if(editor){editor.textarea.value+=text;this._updateLineNumbers(editor);}
 }

 // 行操作方法
 getAllLines(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const format=Cast.toString(args.FORMAT||'text');
  const editor=this._getEditor(id);
  if(!editor)return'';
  const lines=editor.textarea.value.split('\n');
  switch(format){
   case'json':return JSON.stringify(lines,null,2);
   case'array':return JSON.stringify(lines);
   case'lines':return lines.map((line,i)=>`${i+1}: ${line}`).join('\n');
   default:return lines.join('\n');
  }
 }

 getLineCount(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.textarea.value.split('\n').length:0;
 }

 getLineText(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const lineNum=Cast.toNumber(args.LINE||1);
  const editor=this._getEditor(id);
  if(editor){
   const lines=editor.textarea.value.split('\n');
   return(lineNum>=1&&lineNum<=lines.length)?lines[lineNum-1]:'';
  }
  return'';
 }

 setLineText(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const lineNum=Cast.toNumber(args.LINE||1);
  const text=Cast.toString(args.TEXT||'');
  const editor=this._getEditor(id);
  if(editor){
   const lines=editor.textarea.value.split('\n');
   if(lineNum>=1&&lineNum<=lines.length){lines[lineNum-1]=text;editor.textarea.value=lines.join('\n');this._updateLineNumbers(editor);}
  }
 }

 insertLine(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const lineNum=Cast.toNumber(args.LINE||1);
  const text=Cast.toString(args.TEXT||'');
  const editor=this._getEditor(id);
  if(editor){
   const lines=editor.textarea.value.split('\n');
   if(lineNum>=1&&lineNum<=lines.length+1){lines.splice(lineNum-1,0,text);editor.textarea.value=lines.join('\n');this._updateLineNumbers(editor);}
  }
 }

 deleteLine(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const lineNum=Cast.toNumber(args.LINE||1);
  const editor=this._getEditor(id);
  if(editor){
   const lines=editor.textarea.value.split('\n');
   if(lineNum>=1&&lineNum<=lines.length){lines.splice(lineNum-1,1);editor.textarea.value=lines.join('\n');this._updateLineNumbers(editor);}
  }
 }

 // 位置和大小方法
 setEditorPosition(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const x=Cast.toNumber(args.X||100);
  const y=Cast.toNumber(args.Y||100);
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized){
   if(editor.isEmbedded){editor.embeddedPosition.x=x;editor.embeddedPosition.y=y;}
   editor.container.style.left=x+'px';editor.container.style.top=y+'px';
   editor.position.x=x;editor.position.y=y;
  }
 }

 setEditorX(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const x=Cast.toNumber(args.X||100);
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized){
   if(editor.isEmbedded){editor.embeddedPosition.x=x;}
   editor.container.style.left=x+'px';editor.position.x=x;
  }
 }

 setEditorY(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const y=Cast.toNumber(args.Y||100);
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized){
   if(editor.isEmbedded){editor.embeddedPosition.y=y;}
   editor.container.style.top=y+'px';editor.position.y=y;
  }
 }

 getEditorPositionX(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.position.x:0;
 }

 getEditorPositionY(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.position.y:0;
 }

 changeEditorPosition(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const dx=Cast.toNumber(args.DX||0);
  const dy=Cast.toNumber(args.DY||0);
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized){
   editor.position.x+=dx;editor.position.y+=dy;
   if(editor.isEmbedded){editor.embeddedPosition.x+=dx;editor.embeddedPosition.y+=dy;}
   editor.container.style.left=editor.position.x+'px';editor.container.style.top=editor.position.y+'px';
  }
 }

 changeEditorX(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const dx=Cast.toNumber(args.DX||0);
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized){
   editor.position.x+=dx;
   if(editor.isEmbedded){editor.embeddedPosition.x+=dx;}
   editor.container.style.left=editor.position.x+'px';
  }
 }

 changeEditorY(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const dy=Cast.toNumber(args.DY||0);
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized){
   editor.position.y+=dy;
   if(editor.isEmbedded){editor.embeddedPosition.y+=dy;}
   editor.container.style.top=editor.position.y+'px';
  }
 }

 setEditorSize(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const width=Math.max(EDITOR_CONFIG.MIN_WIDTH,Cast.toNumber(args.W||EDITOR_CONFIG.DEFAULT_WIDTH));
  const height=Math.max(EDITOR_CONFIG.MIN_HEIGHT,Cast.toNumber(args.H||EDITOR_CONFIG.DEFAULT_HEIGHT));
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized&&!editor.isMinimized){
   editor.container.style.width=width+'px';editor.container.style.height=height+'px';
   editor.size.width=width;editor.size.height=height;
   if(editor.isEmbedded){editor.embeddedSize.width=width;editor.embeddedSize.height=height;}
  }
 }

 setEditorWidth(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const width=Math.max(EDITOR_CONFIG.MIN_WIDTH,Cast.toNumber(args.W||EDITOR_CONFIG.DEFAULT_WIDTH));
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized&&!editor.isMinimized){
   editor.container.style.width=width+'px';editor.size.width=width;
   if(editor.isEmbedded){editor.embeddedSize.width=width;}
  }
 }

 setEditorHeight(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const height=Math.max(EDITOR_CONFIG.MIN_HEIGHT,Cast.toNumber(args.H||EDITOR_CONFIG.DEFAULT_HEIGHT));
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized&&!editor.isMinimized){
   editor.container.style.height=height+'px';editor.size.height=height;
   if(editor.isEmbedded){editor.embeddedSize.height=height;}
  }
 }

 getEditorWidth(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.size.width:0;
 }

 getEditorHeight(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.size.height:0;
 }

 changeEditorSize(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const dw=Cast.toNumber(args.DW||0);
  const dh=Cast.toNumber(args.DH||0);
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized&&!editor.isMinimized){
   const newWidth=Math.max(EDITOR_CONFIG.MIN_WIDTH,editor.size.width+dw);
   const newHeight=Math.max(EDITOR_CONFIG.MIN_HEIGHT,editor.size.height+dh);
   editor.container.style.width=newWidth+'px';editor.container.style.height=newHeight+'px';
   editor.size.width=newWidth;editor.size.height=newHeight;
   if(editor.isEmbedded){editor.embeddedSize.width=newWidth;editor.embeddedSize.height=newHeight;}
  }
 }

 changeEditorWidth(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const dw=Cast.toNumber(args.DW||0);
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized&&!editor.isMinimized){
   const newWidth=Math.max(EDITOR_CONFIG.MIN_WIDTH,editor.size.width+dw);
   editor.container.style.width=newWidth+'px';editor.size.width=newWidth;
   if(editor.isEmbedded){editor.embeddedSize.width=newWidth;}
  }
 }

 changeEditorHeight(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const dh=Cast.toNumber(args.DH||0);
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized&&!editor.isMinimized){
   const newHeight=Math.max(EDITOR_CONFIG.MIN_HEIGHT,editor.size.height+dh);
   editor.container.style.height=newHeight+'px';editor.size.height=newHeight;
   if(editor.isEmbedded){editor.embeddedSize.height=newHeight;}
  }
 }

 resetEditorPosition(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized){
   let x,y;
   if(editor.isEmbedded){
    const stageRect=this._stageContainer.getBoundingClientRect();
    x=(stageRect.width-editor.size.width)/2;
    y=(stageRect.height-editor.size.height)/2;
    editor.embeddedPosition.x=x;editor.embeddedPosition.y=y;
   }else{
    const screenWidth=window.innerWidth,screenHeight=window.innerHeight;
    x=(screenWidth-editor.size.width)/2;
    y=(screenHeight-editor.size.height)/2;
   }
   editor.container.style.left=x+'px';editor.container.style.top=y+'px';
   editor.position.x=x;editor.position.y=y;
  }
 }

 // 外观设置方法
 setTheme(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const theme=Cast.toString(args.THEME||'light');
  const editor=this._getEditor(id);
  if(editor){
   editor.container.classList.remove('open-ui-light-theme','open-ui-dark-theme');
   editor.container.classList.add(`open-ui-${theme}-theme`);
   editor.theme=theme;
   if(editor.contextMenu){editor.contextMenu.className=`open-ui-contextmenu open-ui-${theme}-theme`;}
  }
 }

 getTheme(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.theme:'light';
 }

 setFontSize(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const size=Cast.toNumber(args.SIZE||EDITOR_CONFIG.DEFAULT_FONT_SIZE);
  const editor=this._getEditor(id);
  if(editor){editor.textarea.style.fontSize=size+'px';editor.fontSize=size;}
 }

 getFontSize(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.fontSize:EDITOR_CONFIG.DEFAULT_FONT_SIZE;
 }

 setFontFamily(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const font=Cast.toString(args.FONT||'monospace');
  const editor=this._getEditor(id);
  if(editor){editor.textarea.style.fontFamily=font;editor.fontFamily=font;}
 }

 setOpacity(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const opacity=Math.max(0.1,Math.min(1,Cast.toNumber(args.OPACITY||1)));
  const editor=this._getEditor(id);
  if(editor){editor.opacity=opacity;editor.container.style.opacity=opacity;}
 }

 setBackgroundImage(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const url=Cast.toString(args.URL||'');
  const size=Cast.toString(args.SIZE||'cover');
  const editor=this._getEditor(id);
  if(editor){
   editor.backgroundImage=url;editor.backgroundSize=size;
   if(url){
    editor.container.style.backgroundImage=`url("${url}")`;
    editor.container.style.backgroundSize=size;
    editor.container.style.backgroundPosition='center';
    editor.container.style.backgroundRepeat=size==='repeat'?'repeat':'no-repeat';
   }else{editor.container.style.backgroundImage='';}
  }
 }

 removeBackgroundImage(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  if(editor){editor.backgroundImage='';editor.container.style.backgroundImage='';}
 }

 // 窗口控制方法
 minimizeEditor(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  if(editor&&!editor.isMinimized&&!editor.lockSettings.preventMinimize){
   editor.originalSize={...editor.size};editor.originalPosition={...editor.position};
   editor.container.classList.add('minimized');editor.container.style.height='40px';editor.container.style.resize='none';editor.editorContent.classList.add('hidden');
   editor.isMinimized=true;editor.isMaximized=false;
   this._updateWindowControls(editor);
  }
 }

 maximizeEditor(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  if(editor&&!editor.isMaximized&&!editor.lockSettings.preventMaximize){
   editor.preMaximizeState={position:{...editor.position},size:{...editor.size}};
   editor.container.classList.add('maximized');
   if(editor.isEmbedded){
    editor.container.style.top='0';editor.container.style.left='0';editor.container.style.width='100%';editor.container.style.height='100%';
   }else{
    editor.container.style.top='0';editor.container.style.left='0';editor.container.style.width='100vw';editor.container.style.height='100vh';
   }
   editor.container.style.resize='none';editor.editorContent.classList.remove('hidden');
   editor.isMaximized=true;editor.isMinimized=false;
   this._updateWindowControls(editor);
  }
 }

 restoreEditor(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  if(editor&&editor.container){
   editor.container.classList.remove('maximized','minimized');editor.editorContent.classList.remove('hidden');
   if(editor.isMaximized&&editor.preMaximizeState){
    const state=editor.preMaximizeState;
    if(editor.isEmbedded){
     editor.container.style.top=state.position.y+'px';editor.container.style.left=state.position.x+'px';editor.container.style.width=state.size.width+'px';editor.container.style.height=state.size.height+'px';
    }else{
     editor.container.style.top=state.position.y+'px';editor.container.style.left=state.position.x+'px';editor.container.style.width=state.size.width+'px';editor.container.style.height=state.size.height+'px';
    }
    editor.size.width=state.size.width;editor.size.height=state.size.height;editor.position.x=state.position.x;editor.position.y=state.position.y;
   }else if(editor.isMinimized&&editor.originalSize){
    if(editor.isEmbedded){
     editor.container.style.width=editor.originalSize.width+'px';editor.container.style.height=editor.originalSize.height+'px';
    }else{
     editor.container.style.width=editor.originalSize.width+'px';editor.container.style.height=editor.originalSize.height+'px';editor.container.style.top=editor.originalPosition.y+'px';editor.container.style.left=editor.originalPosition.x+'px';
    }
    editor.size.width=editor.originalSize.width;editor.size.height=editor.originalSize.height;editor.position.x=editor.originalPosition.x;editor.position.y=editor.originalPosition.y;
   }
   editor.isMaximized=false;editor.isMinimized=false;
   if(!editor.lockSettings.preventResize){editor.container.style.resize='both';}
   this._updateWindowControls(editor);
  }
 }

 isMaximized(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.isMaximized:false;
 }

 isMinimized(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.isMinimized:false;
 }

 // 权限控制方法
 lockEditor(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  if(editor&&editor.container){
   editor.isLocked=true;
   editor.lockSettings={preventResize:true,preventMinimize:true,preventMaximize:true,preventClose:true};
   editor.container.classList.add('locked-all');editor.container.style.resize='none';
   this._updateWindowControls(editor);
  }
 }

 unlockEditor(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  if(editor&&editor.container){
   editor.isLocked=false;
   editor.lockSettings={preventResize:false,preventMinimize:false,preventMaximize:false,preventClose:false};
   editor.container.classList.remove('locked-all');
   if(!editor.isMaximized&&!editor.isMinimized){editor.container.style.resize='both';}
   this._updateWindowControls(editor);
  }
 }

 getLockState(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.isLocked:false;
 }

 // 拖动控制方法 (整合为一个积木)
 setDragState(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const state=Cast.toString(args.STATE||'enable');
  const editor=this._getEditor(id);
  if(editor){
   editor.dragEnabled=(state==='enable');
   if(editor.dragEnabled){editor.container.classList.remove('drag-disabled');}else{editor.container.classList.add('drag-disabled');}
  }
 }

 isDragEnabled(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.dragEnabled:false;
 }

 // 其他功能方法
 focusEditor(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  if(editor){editor.textarea.focus();}
 }

 scrollToLine(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const lineNum=Cast.toNumber(args.LINE||1);
  const editor=this._getEditor(id);
  if(editor){
   const lineHeight=parseInt(getComputedStyle(editor.textarea).lineHeight)||20;
   const scrollTop=(lineNum-1)*lineHeight;
   editor.textarea.scrollTop=scrollTop;
  }
 }

 getSelectedText(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  if(editor){return editor.textarea.value.substring(editor.textarea.selectionStart,editor.textarea.selectionEnd);}
  return'';
 }

 getCursorPosition(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.textarea.selectionStart:0;
 }

 // 嵌入舞台功能
 embedInStage(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const x=Cast.toNumber(args.X||0);
  const y=Cast.toNumber(args.Y||0);
  const width=Cast.toNumber(args.W||400);
  const height=Cast.toNumber(args.H||300);
  const editor=this._getOrCreateEditor(id);
  if(!this._openUIContainer){this._createOpenUIContainer();}
  if(!this._stageContainer&&this._openUIContainer.parentNode){this._stageContainer=this._openUIContainer.parentNode;}
  if(!this._stageContainer){this._findStageContainer();}
  if(!this._stageContainer){console.warn('无法嵌入：未找到舞台容器');return;}
  try{
   editor.embeddedPosition={x,y};
   editor.embeddedSize={width:Math.max(EDITOR_CONFIG.MIN_WIDTH,width),height:Math.max(EDITOR_CONFIG.MIN_HEIGHT,height)};
   editor.isEmbedded=true;editor.container.classList.add('embedded');
   if(editor.container.parentNode){editor.container.parentNode.removeChild(editor.container);}
   this._openUIContainer.appendChild(editor.container);
   editor.container.style.position='absolute';
   editor.container.style.left=x+'px';editor.container.style.top=y+'px';editor.container.style.width=width+'px';editor.container.style.height=height+'px';editor.container.style.zIndex='10';
   editor.position.x=x;editor.position.y=y;editor.size.width=width;editor.size.height=height;
   editor.container.style.display='flex';editor.isVisible=true;
   this._updateWindowControls(editor);
  }catch(error){console.error('嵌入舞台时出错:',error);}
 }

 removeFromStage(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  if(editor&&editor.isEmbedded){
   try{
    editor.isEmbedded=false;editor.container.classList.remove('embedded');
    if(editor.isMaximized||editor.isMinimized){this.restoreEditor({ID:editor.id});}
    if(editor.container.parentNode===this._openUIContainer){this._openUIContainer.removeChild(editor.container);}
    this._openUILayer.appendChild(editor.container);
    editor.container.style.position='fixed';editor.container.style.left=editor.position.x+'px';editor.container.style.top=editor.position.y+'px';editor.container.style.zIndex='10000';
    this._bringToFront(id);this._updateWindowControls(editor);
   }catch(error){console.error('从舞台移除时出错:',error);}
  }
 }

 openFeedback(){
  const feedbackUrl='https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAAaFv5ndUMlpHNTRRVzRNMkpHSUpROFhMTDBWR0s5WS4u';
  window.open(feedbackUrl,'_blank');
 }

 isEmbedded(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const editor=this._getEditor(id);
  return editor?editor.isEmbedded:false;
 }

 setAutoResize(args){
  const id=Cast.toString(args.ID||this._t('editorId_default'));
  const mode=Cast.toString(args.MODE||'none');
  const editor=this._getEditor(id);
  if(editor&&editor.isEmbedded){editor.autoResize=mode;this._updateEmbeddedEditorSize(editor);}
 }

 getInfo(){
  return{
   id:'OpenUITextEditor',
   name:this._t('extensionName'),
   blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGZvcmVpZ25PYmplY3QgeD0iMCIgeT0iLTQiIHdpZHRoPSI0OCIgaGVpZ2h0PSI1MiI+PGRpdiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCIgc3R5bGU9ImJhY2tkcm9wLWZpbHRlcjpibHVyKDJweCk7Y2xpcC1wYXRoOnVybCgjYmdibHVyXzBfMzZfOV9jbGlwX3BhdGgpO2hlaWdodDoxMDAlO3dpZHRoOjEwMCUiPjwvZGl2PjwvZm9yZWlnbk9iamVjdD48ZyBmaWx0ZXI9InVybCgjZmlsdGVyMF9kXzM2XzkpIiBkYXRhLWZpZ21hLWJnLWJsdXItcmFkaXVzPSI0Ij4KPHJlY3QgeD0iNCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0Q5RDlEOSIgZmlsbC1vcGFjaXR5PSIwLjEiIHNoYXBlLXJlbmRlcmluZz0iY3Jpc3BFZGdlcyIvPgo8cmVjdCB4PSI0LjUiIHk9IjAuNSIgd2lkdGg9IjM5IiBoZWlnaHQ9IjM5IiByeD0iNy41IiBzdHJva2U9IndoaXRlIiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiLz4KPC9nPgo8cmVjdCB4PSIxNS41IiB5PSI5LjUiIHdpZHRoPSIxNyIgaGVpZ2h0PSIyMiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8bGluZSB4MT0iMTgiIHkxPSIxMi41IiB4Mj0iMjYiIHkyPSIxMi41IiBzdHJva2U9ImJsYWNrIi8+CjxsaW5lIHgxPSIxOCIgeTE9IjI4LjUiIHgyPSIyNiIgeTI9IjI4LjUiIHN0cm9rZT0iYmxhY2siLz4KPGxpbmUgeDE9IjE4IiB5MT0iMTYuNSIgeDI9IjI4IiB5Mj0iMTYuNSIgc3Ryb2tlPSJibGFjayIvPgo8bGluZSB4MT0iMTgiIHkxPSIyMi41IiB4Mj0iMjQiIHkyPSIyMi41IiBzdHJva2U9ImJsYWNrIi8+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2RfMzZfOSIgeD0iMCIgeT0iLTQiIHdpZHRoPSI0OCIgaGVpZ2h0PSI1MiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgo8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIgcmVzdWx0PSJoYXJkQWxwaGEiLz4KPGZlT2Zmc2V0IGR5PSI0Ii8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjIiLz4KPGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0ib3V0Ii8+CjxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI1IDAiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI2PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzM2XzkiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMzZfOSIgcmVzdWx0PSJzaGFwZSIvPgo8L2ZpbHRlcj4KPGNsaXBQYXRoIGlkPSJiZ2JsdXJfMF8zNl85X2NsaXBfcGF0aCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCA0KSI+PHJlY3QgeD0iNCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIvPgo8L2NsaXBQYXRoPjwvZGVmcz4KPC9zdmc+Cg==',
  menuIconURI: 'data:image/jpeg;base64,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',
   color1:'#904cff',
   color2:'#8336ff',
   blocks:[
    {blockType:BlockType.LABEL,text:'✦ Release V 1.1.0 ✦'},
    {opcode:'openFeedback',blockType:BlockType.BUTTON,text:this._t('feedbackButton'),func:'openFeedback'},
    // 基础控制
    {blockType:BlockType.LABEL,text:this._t('label_basic_control')},
    {opcode:'showEditor',blockType:BlockType.COMMAND,text:this._t('showEditor'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},TITLE:{type:ArgumentType.STRING,defaultValue:this._t('editorTitle_default')}}},
    {opcode:'hideEditor',blockType:BlockType.COMMAND,text:this._t('hideEditor'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'isEditorVisible',blockType:BlockType.BOOLEAN,text:this._t('isEditorVisible'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    '---',
    // 文本操作
    {blockType:BlockType.LABEL,text:this._t('label_text_operations')},
    {opcode:'setEditorText',blockType:BlockType.COMMAND,text:this._t('setEditorText'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},TEXT:{type:ArgumentType.STRING,defaultValue:this._t('editorText_default')}}},
    {opcode:'getEditorText',blockType:BlockType.REPORTER,text:this._t('getEditorText'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'clearEditorText',blockType:BlockType.COMMAND,text:this._t('clearEditorText'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'appendEditorText',blockType:BlockType.COMMAND,text:this._t('appendEditorText'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},TEXT:{type:ArgumentType.STRING,defaultValue:''}}},
    '---',
    // 行操作
    {blockType:BlockType.LABEL,text:this._t('label_line_operations')},
    {opcode:'getAllLines',blockType:BlockType.REPORTER,text:this._t('getAllLines'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},FORMAT:{type:ArgumentType.STRING,menu:'formatMenu',defaultValue:'text'}}},
    {opcode:'getLineCount',blockType:BlockType.REPORTER,text:this._t('getLineCount'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'getLineText',blockType:BlockType.REPORTER,text:this._t('getLineText'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},LINE:{type:ArgumentType.NUMBER,defaultValue:1}}},
    {opcode:'setLineText',blockType:BlockType.COMMAND,text:this._t('setLineText'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},LINE:{type:ArgumentType.NUMBER,defaultValue:1},TEXT:{type:ArgumentType.STRING,defaultValue:''}}},
    {opcode:'insertLine',blockType:BlockType.COMMAND,text:this._t('insertLine'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},LINE:{type:ArgumentType.NUMBER,defaultValue:1},TEXT:{type:ArgumentType.STRING,defaultValue:''}}},
    {opcode:'deleteLine',blockType:BlockType.COMMAND,text:this._t('deleteLine'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},LINE:{type:ArgumentType.NUMBER,defaultValue:1}}},
    '---',
    // 位置大小
    {blockType:BlockType.LABEL,text:this._t('label_position_size')},
    {opcode:'setEditorPosition',blockType:BlockType.COMMAND,text:this._t('setEditorPosition'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},X:{type:ArgumentType.NUMBER,defaultValue:100},Y:{type:ArgumentType.NUMBER,defaultValue:100}}},
    {opcode:'setEditorX',blockType:BlockType.COMMAND,text:this._t('setEditorX'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},X:{type:ArgumentType.NUMBER,defaultValue:100}}},
    {opcode:'setEditorY',blockType:BlockType.COMMAND,text:this._t('setEditorY'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},Y:{type:ArgumentType.NUMBER,defaultValue:100}}},
    {opcode:'getEditorPositionX',blockType:BlockType.REPORTER,text:this._t('getEditorPositionX'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'getEditorPositionY',blockType:BlockType.REPORTER,text:this._t('getEditorPositionY'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'changeEditorPosition',blockType:BlockType.COMMAND,text:this._t('changeEditorPosition'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},DX:{type:ArgumentType.NUMBER,defaultValue:10},DY:{type:ArgumentType.NUMBER,defaultValue:10}}},
    {opcode:'changeEditorX',blockType:BlockType.COMMAND,text:this._t('changeEditorX'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},DX:{type:ArgumentType.NUMBER,defaultValue:10}}},
    {opcode:'changeEditorY',blockType:BlockType.COMMAND,text:this._t('changeEditorY'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},DY:{type:ArgumentType.NUMBER,defaultValue:10}}},
    {opcode:'setEditorSize',blockType:BlockType.COMMAND,text:this._t('setEditorSize'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},W:{type:ArgumentType.NUMBER,defaultValue:600},H:{type:ArgumentType.NUMBER,defaultValue:450}}},
    {opcode:'setEditorWidth',blockType:BlockType.COMMAND,text:this._t('setEditorWidth'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},W:{type:ArgumentType.NUMBER,defaultValue:600}}},
    {opcode:'setEditorHeight',blockType:BlockType.COMMAND,text:this._t('setEditorHeight'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},H:{type:ArgumentType.NUMBER,defaultValue:450}}},
    {opcode:'getEditorWidth',blockType:BlockType.REPORTER,text:this._t('getEditorWidth'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'getEditorHeight',blockType:BlockType.REPORTER,text:this._t('getEditorHeight'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'changeEditorSize',blockType:BlockType.COMMAND,text:this._t('changeEditorSize'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},DW:{type:ArgumentType.NUMBER,defaultValue:50},DH:{type:ArgumentType.NUMBER,defaultValue:50}}},
    {opcode:'changeEditorWidth',blockType:BlockType.COMMAND,text:this._t('changeEditorWidth'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},DW:{type:ArgumentType.NUMBER,defaultValue:50}}},
    {opcode:'changeEditorHeight',blockType:BlockType.COMMAND,text:this._t('changeEditorHeight'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},DH:{type:ArgumentType.NUMBER,defaultValue:50}}},
    {opcode:'resetEditorPosition',blockType:BlockType.COMMAND,text:this._t('resetEditorPosition'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    '---',
    // 外观样式
    {blockType:BlockType.LABEL,text:this._t('label_appearance')},
    {opcode:'setTheme',blockType:BlockType.COMMAND,text:this._t('setTheme'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},THEME:{type:ArgumentType.STRING,menu:'themeMenu',defaultValue:'light'}}},
    {opcode:'getTheme',blockType:BlockType.REPORTER,text:this._t('getTheme'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'setFontSize',blockType:BlockType.COMMAND,text:this._t('setFontSize'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},SIZE:{type:ArgumentType.NUMBER,defaultValue:14}}},
    {opcode:'getFontSize',blockType:BlockType.REPORTER,text:this._t('getFontSize'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'setFontFamily',blockType:BlockType.COMMAND,text:this._t('setFontFamily'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},FONT:{type:ArgumentType.STRING,menu:'fontMenu',defaultValue:'monospace'}}},
    {opcode:'setOpacity',blockType:BlockType.COMMAND,text:this._t('setOpacity'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},OPACITY:{type:ArgumentType.NUMBER,defaultValue:1}}},
    {opcode:'setBackgroundImage',blockType:BlockType.COMMAND,text:this._t('setBackgroundImage'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},URL:{type:ArgumentType.STRING,defaultValue:''},SIZE:{type:ArgumentType.STRING,menu:'backgroundSizeMenu',defaultValue:'cover'}}},
    {opcode:'removeBackgroundImage',blockType:BlockType.COMMAND,text:this._t('removeBackgroundImage'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    '---',
    // 窗口控制
    {blockType:BlockType.LABEL,text:this._t('label_window_control')},
    {opcode:'minimizeEditor',blockType:BlockType.COMMAND,text:this._t('minimizeEditor'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'maximizeEditor',blockType:BlockType.COMMAND,text:this._t('maximizeEditor'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'restoreEditor',blockType:BlockType.COMMAND,text:this._t('restoreEditor'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'isMaximized',blockType:BlockType.BOOLEAN,text:this._t('isMaximized'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'isMinimized',blockType:BlockType.BOOLEAN,text:this._t('isMinimized'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    '---',
    // 权限控制
    {blockType:BlockType.LABEL,text:this._t('label_permissions')},
    {opcode:'lockEditor',blockType:BlockType.COMMAND,text:this._t('lockEditor'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'unlockEditor',blockType:BlockType.COMMAND,text:this._t('unlockEditor'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'getLockState',blockType:BlockType.BOOLEAN,text:this._t('getLockState'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    '---',
    // 拖动控制
    {blockType:BlockType.LABEL,text:this._t('label_drag_control')},
    {opcode:'setDragState',blockType:BlockType.COMMAND,text:this._t('setDragState'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},STATE:{type:ArgumentType.STRING,menu:'dragMenu',defaultValue:'enable'}}},
    {opcode:'isDragEnabled',blockType:BlockType.BOOLEAN,text:this._t('isDragEnabled'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    '---',
    // 其他功能
    {blockType:BlockType.LABEL,text:this._t('label_other_features')},
    {opcode:'focusEditor',blockType:BlockType.COMMAND,text:this._t('focusEditor'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'scrollToLine',blockType:BlockType.COMMAND,text:this._t('scrollToLine'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},LINE:{type:ArgumentType.NUMBER,defaultValue:1}}},
    {opcode:'getSelectedText',blockType:BlockType.REPORTER,text:this._t('getSelectedText'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'getCursorPosition',blockType:BlockType.REPORTER,text:this._t('getCursorPosition'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    '---',
    // 嵌入舞台
    {blockType:BlockType.LABEL,text:this._t('label_embed_stage')},
    {opcode:'embedInStage',blockType:BlockType.COMMAND,text:this._t('embedInStage'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},X:{type:ArgumentType.NUMBER,defaultValue:0},Y:{type:ArgumentType.NUMBER,defaultValue:0},W:{type:ArgumentType.NUMBER,defaultValue:400},H:{type:ArgumentType.NUMBER,defaultValue:300}}},
    {opcode:'removeFromStage',blockType:BlockType.COMMAND,text:this._t('removeFromStage'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'isEmbedded',blockType:BlockType.BOOLEAN,text:this._t('isEmbedded'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')}}},
    {opcode:'setAutoResize',blockType:BlockType.COMMAND,text:this._t('setAutoResize'),arguments:{ID:{type:ArgumentType.STRING,defaultValue:this._t('editorId_default')},MODE:{type:ArgumentType.STRING,menu:'resizeMenu',defaultValue:'none'}}}
   ],
   menus:{
    themeMenu:{
     items:[
      {text:this._t('theme_light'),value:'light'},
      {text:this._t('theme_dark'),value:'dark'},
      {text:this._t('theme_auto'),value:'auto'}
     ]
    },
    formatMenu:{
     items:[
      {text:this._t('format_text'),value:'text'},
      {text:this._t('format_json'),value:'json'},
      {text:this._t('format_array'),value:'array'},
      {text:this._t('format_lines'),value:'lines'}
     ]
    },
    fontMenu:{
     items:[
      {text:this._t('font_monospace'),value:'monospace'},
      {text:this._t('font_sans'),value:'sans-serif'},
      {text:this._t('font_serif'),value:'serif'}
     ]
    },
    backgroundSizeMenu:{
     items:[
      {text:this._t('background_cover'),value:'cover'},
      {text:this._t('background_repeat'),value:'repeat'},
      {text:this._t('background_stretch'),value:'100% 100%'},
      {text:this._t('background_contain'),value:'contain'}
     ]
    },
    resizeMenu:{
     items:[
      {text:this._t('resize_none'),value:'none'},
      {text:this._t('resize_width'),value:'width'},
      {text:this._t('resize_height'),value:'height'},
      {text:this._t('resize_both'),value:'both'}
     ]
    },
    dragMenu:{
     items:[
      {text:this._t('drag_enable'),value:'enable'},
      {text:this._t('drag_disable'),value:'disable'}
     ]
    }
   }
  };
 }
}

// 注册扩展
Scratch.extensions.register(new OpenUITextEditor(Scratch));
})(Scratch);