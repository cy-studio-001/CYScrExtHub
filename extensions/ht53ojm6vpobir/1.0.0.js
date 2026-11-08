//慕然科技官网https://ccwmoran.github.io
class MorganToolboxV8{
constructor(){this.lastResponse=''}
getInfo(){
return{
id:'M8',name:'Morgan的工具箱V8',color1:0x5ca05c,color2:0x5ca05c,
blocks:[
{opcode:'getDeviceModel',blockType:Scratch.BlockType.REPORTER,text:'设备型号'},
{opcode:'getBrowserName',blockType:Scratch.BlockType.REPORTER,text:'浏览器名称'},
{opcode:'toggleFullscreen',blockType:Scratch.BlockType.COMMAND,text:'进入/退出全屏'},
{opcode:'isTouchSupported',blockType:Scratch.BlockType.BOOLEAN,text:'是否支持触屏'},
{opcode:'generateRandomColor',blockType:Scratch.BlockType.REPORTER,text:'生成6位随机颜色值'},
{opcode:'generateRandomInt',blockType:Scratch.BlockType.REPORTER,text:'生成随机一个 [DIGITS] 位整数',arguments:{DIGITS:{type:Scratch.ArgumentType.NUMBER,defaultValue:3}}},
{opcode:'isOnline',blockType:Scratch.BlockType.BOOLEAN,text:'设备是否联网'},
{opcode:'isInEditor',blockType:Scratch.BlockType.BOOLEAN,text:'是否在编辑器内'},
{opcode:'hasCamera',blockType:Scratch.BlockType.BOOLEAN,text:'是否有摄像头'},
{opcode:'getCurrentDate',blockType:Scratch.BlockType.REPORTER,text:'获取当前年月日'},
{opcode:'getCurrentTime',blockType:Scratch.BlockType.REPORTER,text:'获取当前时分秒'},
{opcode:'getWeekday',blockType:Scratch.BlockType.REPORTER,text:'获取今日星期几'},
{opcode:'showAlert',blockType:Scratch.BlockType.COMMAND,text:'使用浏览器弹窗（纯文本）[TEXT]',arguments:{TEXT:{type:Scratch.ArgumentType.STRING,defaultValue:'Hello World!'}}},
{opcode:'showPrompt',blockType:Scratch.BlockType.REPORTER,text:'使用浏览器弹窗（输入框）[QUESTION]',arguments:{QUESTION:{type:Scratch.ArgumentType.STRING,defaultValue:'请输入内容'}}},
{opcode:'showOptions',blockType:Scratch.BlockType.REPORTER,text:'使用浏览器弹窗（选项选择）[OPTIONS]',arguments:{OPTIONS:{type:Scratch.ArgumentType.STRING,defaultValue:'选项1,选项2,选项3'}}},
{opcode:'showDatePicker',blockType:Scratch.BlockType.REPORTER,text:'使用浏览器弹窗（日期选择）'},
{opcode:'showColorPicker',blockType:Scratch.BlockType.REPORTER,text:'使用浏览器弹窗（颜色选择）'},
{opcode:'getCurrentURL',blockType:Scratch.BlockType.REPORTER,text:'当前页面网址'},
{opcode:'getCurrentTitle',blockType:Scratch.BlockType.REPORTER,text:'当前页面标题'},
{opcode:'openInNewTab',blockType:Scratch.BlockType.COMMAND,text:'在新标签页打开 [URL]',arguments:{URL:{type:Scratch.ArgumentType.STRING,defaultValue:'https://scratch.mit.edu'}}},
{opcode:'setPageTitle',blockType:Scratch.BlockType.COMMAND,text:'修改页面标题为 [TITLE]',arguments:{TITLE:{type:Scratch.ArgumentType.STRING,defaultValue:'新标题'}}},
{opcode:'refreshPage',blockType:Scratch.BlockType.COMMAND,text:'刷新该页面'},
{opcode:'copyToClipboard',blockType:Scratch.BlockType.COMMAND,text:'复制 [TEXT] 到剪贴板',arguments:{TEXT:{type:Scratch.ArgumentType.STRING,defaultValue:'要复制的文本'}}},
{opcode:'base64Operation',blockType:Scratch.BlockType.REPORTER,text:'base64 [OPERATION] [CONTENT]',arguments:{OPERATION:{type:Scratch.ArgumentType.STRING,menu:'base64Menu',defaultValue:'编码'},CONTENT:{type:Scratch.ArgumentType.STRING,defaultValue:'Hello World!'}}},
{opcode:'getLocationInfo',blockType:Scratch.BlockType.REPORTER,text:'所在国家省份城市'},
{opcode:'downloadFile',blockType:Scratch.BlockType.COMMAND,text:'下载文件 内容:[CONTENT] 文件名:[FILENAME]',arguments:{CONTENT:{type:Scratch.ArgumentType.STRING,defaultValue:'文件内容'},FILENAME:{type:Scratch.ArgumentType.STRING,defaultValue:'example.txt'}}},
{opcode:'calculateDaysBetween',blockType:Scratch.BlockType.REPORTER,text:'从 [START] 到 [END] 有几天',arguments:{START:{type:Scratch.ArgumentType.STRING,defaultValue:'2025.1.1'},END:{type:Scratch.ArgumentType.STRING,defaultValue:'2025.12.31'}}},
{opcode:'closeCurrentPage',blockType:Scratch.BlockType.COMMAND,text:'关闭当前页面'},
{opcode:'generateRandomEmojis',blockType:Scratch.BlockType.REPORTER,text:'给出 [COUNT] 个随机emoji表情符号',arguments:{COUNT:{type:Scratch.ArgumentType.NUMBER,defaultValue:5}}},
{opcode:'runHTMLCode',blockType:Scratch.BlockType.COMMAND,text:'运行html代码：[HTML_CODE]',arguments:{HTML_CODE:{type:Scratch.ArgumentType.STRING,defaultValue:'<div>Hello World!</div>'}}},
{opcode:'getBatteryLevel',blockType:Scratch.BlockType.REPORTER,text:'获取电池电量百分比'},
{opcode:'vibrateDevice',blockType:Scratch.BlockType.COMMAND,text:'振动设备 [DURATION] 毫秒',arguments:{DURATION:{type:Scratch.ArgumentType.NUMBER,defaultValue:200}}},
{opcode:'shareContent',blockType:Scratch.BlockType.COMMAND,text:'分享内容 [TEXT] [URL]',arguments:{TEXT:{type:Scratch.ArgumentType.STRING,defaultValue:'看看这个!'},URL:{type:Scratch.ArgumentType.STRING,defaultValue:window.location.href}}},
{opcode:'getScreenResolution',blockType:Scratch.BlockType.REPORTER,text:'获取屏幕分辨率'},
{opcode:'checkNetworkSpeed',blockType:Scratch.BlockType.REPORTER,text:'检测网络连接速度'},
{opcode:'getClipboardText',blockType:Scratch.BlockType.REPORTER,text:'获取剪贴板文本'},
{opcode:'takeScreenshot',blockType:Scratch.BlockType.COMMAND,text:'截取屏幕截图'},
{opcode:'getSystemTheme',blockType:Scratch.BlockType.REPORTER,text:'获取系统主题模式'},
{opcode:'getUserLanguage',blockType:Scratch.BlockType.REPORTER,text:'获取系统语言'},
{opcode:'getCPUInfo',blockType:Scratch.BlockType.REPORTER,text:'获取CPU核心数'},
{opcode:'isCookieEnabled',blockType:Scratch.BlockType.BOOLEAN,text:'Cookie是否启用'},
{opcode:'getPageFavicon',blockType:Scratch.BlockType.REPORTER,text:'获取网站图标URL'},
{opcode:'getMemoryInfo',blockType:Scratch.BlockType.REPORTER,text:'获取内存信息'},
{opcode:'getUserAgent',blockType:Scratch.BlockType.REPORTER,text:'获取浏览器UserAgent'},
{opcode:'getViewportSize',blockType:Scratch.BlockType.REPORTER,text:'获取视口大小'},
{opcode:'isJavaScriptEnabled',blockType:Scratch.BlockType.BOOLEAN,text:'JavaScript是否启用'},
{opcode:'getPlatformInfo',blockType:Scratch.BlockType.REPORTER,text:'获取平台信息'},
{opcode:'getConnectionType',blockType:Scratch.BlockType.REPORTER,text:'获取网络连接类型'},
{opcode:'getPageLoadTime',blockType:Scratch.BlockType.REPORTER,text:'获取页面加载时间'},
{opcode:'getScrollPosition',blockType:Scratch.BlockType.REPORTER,text:'获取滚动位置'},
{opcode:'isDoNotTrackEnabled',blockType:Scratch.BlockType.BOOLEAN,text:'是否启用禁止跟踪'},
{opcode:'getReferrer',blockType:Scratch.BlockType.REPORTER,text:'获取来源页面'},
{opcode:'getTimezone',blockType:Scratch.BlockType.REPORTER,text:'获取时区信息'},
{opcode:'getDeviceOrientation',blockType:Scratch.BlockType.REPORTER,text:'获取设备方向'},
{opcode:'getNetworkLatency',blockType:Scratch.BlockType.REPORTER,text:'检测网络延迟'},
{opcode:'getStorageUsage',blockType:Scratch.BlockType.REPORTER,text:'获取存储使用情况'},
{opcode:'isPWAInstalled',blockType:Scratch.BlockType.BOOLEAN,text:'是否为PWA应用'},
{opcode:'getMediaDevices',blockType:Scratch.BlockType.REPORTER,text:'获取媒体设备列表'},
{opcode:'createQRCode',blockType:Scratch.BlockType.REPORTER,text:'生成二维码 [TEXT]',arguments:{TEXT:{type:Scratch.ArgumentType.STRING,defaultValue:'https://scratch.mit.edu'}}},
{opcode:'speakText',blockType:Scratch.BlockType.COMMAND,text:'朗读文本 [TEXT]',arguments:{TEXT:{type:Scratch.ArgumentType.STRING,defaultValue:'Hello World'}}},
{opcode:'stopSpeaking',blockType:Scratch.BlockType.COMMAND,text:'停止朗读'},
{opcode:'getGeolocation',blockType:Scratch.BlockType.REPORTER,text:'获取地理位置坐标'},
{opcode:'getSunriseSunset',blockType:Scratch.BlockType.REPORTER,text:'获取日出日落时间'},
{opcode:'calculateAge',blockType:Scratch.BlockType.REPORTER,text:'计算年龄 生日:[BIRTHDAY]',arguments:{BIRTHDAY:{type:Scratch.ArgumentType.STRING,defaultValue:'2000.1.1'}}},
{opcode:'countdownTimer',blockType:Scratch.BlockType.REPORTER,text:'倒计时 [TARGET_TIME]',arguments:{TARGET_TIME:{type:Scratch.ArgumentType.STRING,defaultValue:'2025-12-31 23:59:59'}}},
{opcode:'getMoonPhase',blockType:Scratch.BlockType.REPORTER,text:'获取今日月相'},
{opcode:'generatePassword',blockType:Scratch.BlockType.REPORTER,text:'生成密码 长度:[LENGTH]',arguments:{LENGTH:{type:Scratch.ArgumentType.NUMBER,defaultValue:12}}},
{opcode:'analyzeText',blockType:Scratch.BlockType.REPORTER,text:'分析文本 [TEXT]',arguments:{TEXT:{type:Scratch.ArgumentType.STRING,defaultValue:'Hello World'}}},
{opcode:'getCurrentSeason',blockType:Scratch.BlockType.REPORTER,text:'获取当前季节'},
{opcode:'isLeapYear',blockType:Scratch.BlockType.BOOLEAN,text:'[YEAR] 是否为闰年',arguments:{YEAR:{type:Scratch.ArgumentType.NUMBER,defaultValue:2024}}},
{opcode:'getURLParameters',blockType:Scratch.BlockType.REPORTER,text:'获取URL参数'},
{opcode:'setLocalStorage',blockType:Scratch.BlockType.COMMAND,text:'本地存储 [KEY] [VALUE]',arguments:{KEY:{type:Scratch.ArgumentType.STRING,defaultValue:'key'},VALUE:{type:Scratch.ArgumentType.STRING,defaultValue:'value'}}},
{opcode:'getLocalStorage',blockType:Scratch.BlockType.REPORTER,text:'读取本地存储 [KEY]',arguments:{KEY:{type:Scratch.ArgumentType.STRING,defaultValue:'key'}}},
{opcode:'removeLocalStorage',blockType:Scratch.BlockType.COMMAND,text:'删除本地存储 [KEY]',arguments:{KEY:{type:Scratch.ArgumentType.STRING,defaultValue:'key'}}},
{opcode:'clearLocalStorage',blockType:Scratch.BlockType.COMMAND,text:'清空本地存储'},
{opcode:'getPerformanceMetrics',blockType:Scratch.BlockType.REPORTER,text:'获取性能指标'},
{opcode:'detectAdBlocker',blockType:Scratch.BlockType.BOOLEAN,text:'是否启用广告拦截器'},
{opcode:'getPageVisibility',blockType:Scratch.BlockType.REPORTER,text:'获取页面可见状态'},
{opcode:'createBlobURL',blockType:Scratch.BlockType.REPORTER,text:'创建Blob URL 内容:[CONTENT] 类型:[TYPE]',arguments:{CONTENT:{type:Scratch.ArgumentType.STRING,defaultValue:'Hello World'},TYPE:{type:Scratch.ArgumentType.STRING,defaultValue:'text/plain'}}},
{opcode:'revokeBlobURL',blockType:Scratch.BlockType.COMMAND,text:'撤销Blob URL [URL]',arguments:{URL:{type:Scratch.ArgumentType.STRING,defaultValue:'blob:https://example.com'}}},
{opcode:'getElementCount',blockType:Scratch.BlockType.REPORTER,text:'获取页面元素数量 [SELECTOR]',arguments:{SELECTOR:{type:Scratch.ArgumentType.STRING,defaultValue:'div'}}},
{opcode:'checkFontSupport',blockType:Scratch.BlockType.REPORTER,text:'检查字体支持 [FONT]',arguments:{FONT:{type:Scratch.ArgumentType.STRING,defaultValue:'Arial'}}},
{opcode:'getCSSVariable',blockType:Scratch.BlockType.REPORTER,text:'获取CSS变量值 [VAR_NAME]',arguments:{VAR_NAME:{type:Scratch.ArgumentType.STRING,defaultValue:'--main-color'}}},
{opcode:'setCSSVariable',blockType:Scratch.BlockType.COMMAND,text:'设置CSS变量 [VAR_NAME] [VALUE]',arguments:{VAR_NAME:{type:Scratch.ArgumentType.STRING,defaultValue:'--main-color'},VALUE:{type:Scratch.ArgumentType.STRING,defaultValue:'#5ca05c'}}},
{opcode:'createObjectURL',blockType:Scratch.BlockType.REPORTER,text:'创建对象URL 文件:[FILE]',arguments:{FILE:{type:Scratch.ArgumentType.STRING,defaultValue:'data:text/plain,Hello'}}},
{opcode:'measureTextWidth',blockType:Scratch.BlockType.REPORTER,text:'测量文本宽度 [TEXT] 字体:[FONT]',arguments:{TEXT:{type:Scratch.ArgumentType.STRING,defaultValue:'Hello World'},FONT:{type:Scratch.ArgumentType.STRING,defaultValue:'16px Arial'}}},
{opcode:'getScrollbarWidth',blockType:Scratch.BlockType.REPORTER,text:'获取滚动条宽度'},
{opcode:'isReduceMotionEnabled',blockType:Scratch.BlockType.BOOLEAN,text:'是否启用减少动画'},
{opcode:'detectIncognitoMode',blockType:Scratch.BlockType.BOOLEAN,text:'是否处于无痕模式'},
{opcode:'getDeviceMotion',blockType:Scratch.BlockType.REPORTER,text:'获取设备加速度'},
{opcode:'createHash',blockType:Scratch.BlockType.REPORTER,text:'生成哈希值 [ALGORITHM] [TEXT]',arguments:{ALGORITHM:{type:Scratch.ArgumentType.STRING,menu:'hashMenu',defaultValue:'MD5'},TEXT:{type:Scratch.ArgumentType.STRING,defaultValue:'Hello World'}}},
{opcode:'compressText',blockType:Scratch.BlockType.REPORTER,text:'压缩文本 [TEXT]',arguments:{TEXT:{type:Scratch.ArgumentType.STRING,defaultValue:'Hello World'}}},
{opcode:'decompressText',blockType:Scratch.BlockType.REPORTER,text:'解压文本 [TEXT]',arguments:{TEXT:{type:Scratch.ArgumentType.STRING,defaultValue:'eJzzSM3JyVcIzy/KSVEEABK5A5A='}}},
{opcode:'detectDarkPattern',blockType:Scratch.BlockType.BOOLEAN,text:'检测深色模式偏好'},
{opcode:'getAudioContext',blockType:Scratch.BlockType.REPORTER,text:'获取音频上下文状态'},
{opcode:'calculateTextReadTime',blockType:Scratch.BlockType.REPORTER,text:'计算文本阅读时间 [TEXT]',arguments:{TEXT:{type:Scratch.ArgumentType.STRING,defaultValue:'Hello World'}}},
{opcode:'generateUUID',blockType:Scratch.BlockType.REPORTER,text:'生成UUID'},
{opcode:'checkImageExists',blockType:Scratch.BlockType.BOOLEAN,text:'检查图片是否存在 [URL]',arguments:{URL:{type:Scratch.ArgumentType.STRING,defaultValue:'https://example.com/image.jpg'}}},
{opcode:'getCookieValue',blockType:Scratch.BlockType.REPORTER,text:'获取Cookie值 [NAME]',arguments:{NAME:{type:Scratch.ArgumentType.STRING,defaultValue:'session'}}},
{opcode:'setCookieValue',blockType:Scratch.BlockType.COMMAND,text:'设置Cookie [NAME] [VALUE] [DAYS]',arguments:{NAME:{type:Scratch.ArgumentType.STRING,defaultValue:'session'},VALUE:{type:Scratch.ArgumentType.STRING,defaultValue:'value'},DAYS:{type:Scratch.ArgumentType.NUMBER,defaultValue:7}}},
{opcode:'getBatteryStatus',blockType:Scratch.BlockType.REPORTER,text:'获取电池状态详情'},
{opcode:'detectIdleState',blockType:Scratch.BlockType.REPORTER,text:'检测用户空闲状态'},
{opcode:'calculateDistance',blockType:Scratch.BlockType.REPORTER,text:'计算两点距离 点1:[POINT1] 点2:[POINT2]',arguments:{POINT1:{type:Scratch.ArgumentType.STRING,defaultValue:'0,0'},POINT2:{type:Scratch.ArgumentType.STRING,defaultValue:'3,4'}}},
{opcode:'generateLoremIpsum',blockType:Scratch.BlockType.REPORTER,text:'生成Lorem Ipsum文本 [WORDS]词',arguments:{WORDS:{type:Scratch.ArgumentType.NUMBER,defaultValue:50}}},
{opcode:'checkSSLStatus',blockType:Scratch.BlockType.BOOLEAN,text:'当前页面是否使用HTTPS'},
{opcode:'getPageLoadSize',blockType:Scratch.BlockType.REPORTER,text:'获取页面加载资源大小'},
{opcode:'detectPrintSupport',blockType:Scratch.BlockType.BOOLEAN,text:'是否支持打印功能'},
{opcode:'createDataURL',blockType:Scratch.BlockType.REPORTER,text:'创建Data URL 内容:[CONTENT] 类型:[TYPE]',arguments:{CONTENT:{type:Scratch.ArgumentType.STRING,defaultValue:'Hello'},TYPE:{type:Scratch.ArgumentType.STRING,defaultValue:'text/plain'}}},
{opcode:'getActiveElement',blockType:Scratch.BlockType.REPORTER,text:'获取当前焦点元素'},
{opcode:'checkWebGLSupport',blockType:Scratch.BlockType.BOOLEAN,text:'是否支持WebGL'},
{opcode:'getSelectionText',blockType:Scratch.BlockType.REPORTER,text:'获取选中文本'},
{opcode:'detectPointerType',blockType:Scratch.BlockType.REPORTER,text:'检测指针设备类型'},
{opcode:'calculateAspectRatio',blockType:Scratch.BlockType.REPORTER,text:'计算宽高比 宽:[WIDTH] 高:[HEIGHT]',arguments:{WIDTH:{type:Scratch.ArgumentType.NUMBER,defaultValue:16},HEIGHT:{type:Scratch.ArgumentType.NUMBER,defaultValue:9}}},
{opcode:'generateGradient',blockType:Scratch.BlockType.REPORTER,text:'生成CSS渐变 [COLOR1] [COLOR2]',arguments:{COLOR1:{type:Scratch.ArgumentType.STRING,defaultValue:'#FF0000'},COLOR2:{type:Scratch.ArgumentType.STRING,defaultValue:'#0000FF'}}},
{opcode:'checkServiceWorker',blockType:Scratch.BlockType.BOOLEAN,text:'是否注册Service Worker'}],
menus:{
base64Menu:{items:['编码','解码']},
hashMenu:{items:['MD5','SHA-1','SHA-256','SHA-512']}
},
docsURI:'https://ccwmoran.github.io'}}

getDeviceModel(){let e=navigator.userAgent;return/iPhone/.test(e)?"iPhone":/iPad/.test(e)?"iPad":/Android/.test(e)?"Android设备":/Windows/.test(e)?"Windows电脑":/Mac/.test(e)?"Mac电脑":/Linux/.test(e)?"Linux电脑":"未知设备"}
getBrowserName(){let e=navigator.userAgent;return e.indexOf("Chrome")>-1&&e.indexOf("Edge")===-1?"Chrome":e.indexOf("Firefox")>-1?"Firefox":e.indexOf("Safari")>-1&&e.indexOf("Chrome")===-1?"Safari":e.indexOf("Edge")>-1?"Edge":e.indexOf("Opera")>-1?"Opera":e.indexOf("MSIE")>-1||e.indexOf("Trident")>-1?"Internet Explorer":"未知浏览器"}
toggleFullscreen(){if(!document.fullscreenElement){document.documentElement.requestFullscreen?.()||document.documentElement.mozRequestFullScreen?.()||document.documentElement.webkitRequestFullscreen?.()||document.documentElement.msRequestFullscreen?.()}else{document.exitFullscreen?.()||document.mozCancelFullScreen?.()||document.webkitExitFullscreen?.()||document.msExitFullscreen?.()}}
isTouchSupported(){return'ontouchstart'in window||navigator.maxTouchPoints>0}
generateRandomColor(){let e='0123456789ABCDEF',t='#';for(let o=0;o<6;o++)t+=e[Math.floor(Math.random()*16)];return t}
generateRandomInt(e){let t=e.DIGITS,o=Math.pow(10,t-1),n=Math.pow(10,t)-1;return Math.floor(Math.random()*(n-o+1))+o}
isOnline(){return navigator.onLine}
isInEditor(){return window.location.href.indexOf('scratch.mit.edu')>-1&&window.location.href.indexOf('/projects/')>-1}
hasCamera(){return new Promise(e=>{navigator.mediaDevices?.enumerateDevices?.().then(t=>{e(t.some(e=>e.kind==='videoinput'))}).catch(()=>e(false))})}
getCurrentDate(){let e=new Date();return e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,'0')+"-"+String(e.getDate()).padStart(2,'0')}
getCurrentTime(){let e=new Date();return String(e.getHours()).padStart(2,'0')+":"+String(e.getMinutes()).padStart(2,'0')+":"+String(e.getSeconds()).padStart(2,'0')}
getWeekday(){return["星期日","星期一","星期二","星期三","星期四","星期五","星期六"][new Date().getDay()]}
showAlert(e){alert(e.TEXT)}
showPrompt(e){return prompt(e.QUESTION)}
showOptions(e){let t=e.OPTIONS.split(','),o='<div style="font-family:Arial,sans-serif;padding:10px;"><p style="margin-top:0;">请选择一个选项:</p>';t.forEach((e,n)=>{o+=`<label style="display:block;margin:5px 0;"><input type="radio" name="option" value="${e}" ${0===n?'checked':''}>${e}</label>`});o+='</div>';let n=this.showCustomDialog('选择选项',o);return n||t[0]||''}
showDatePicker(){let e=document.createElement('input');e.type='date',e.showPicker();return e.value||new Date().toISOString().slice(0,10)}
showColorPicker(){let e=document.createElement('input');e.type='color',e.showPicker();return e.value||'#000000'}
showCustomDialog(e,t,o=!1){return new Promise(n=>{let c=document.createElement('div');c.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:10000';let r=document.createElement('div');r.style.cssText='background:white;border-radius:8px;padding:0;min-width:300px;max-width:90%;box-shadow:0 4px 20px rgba(0,0,0,0.3)';let i=document.createElement('div');i.style.cssText='background:#5ca05c;color:white;padding:10px 15px;border-radius:8px 8px 0 0;font-weight:bold';i.textContent=e;let a=document.createElement('div');a.innerHTML=t;let l=document.createElement('div');l.style.cssText='display:flex;justify-content:flex-end;padding:10px 15px;border-top:1px solid #eee';let s=document.createElement('button');s.textContent='取消',s.style.cssText='margin-right:10px;padding:5px 15px;background:#f0f0f0;border:1px solid #ccc;border-radius:4px;cursor:pointer';let d=document.createElement('button');d.textContent='确定',d.style.cssText='padding:5px 15px;background:#5ca05c;color:white;border:none;border-radius:4px;cursor:pointer';l.appendChild(s),l.appendChild(d),r.appendChild(i),r.appendChild(a),r.appendChild(l),c.appendChild(r),document.body.appendChild(c);let u=t=>{document.body.removeChild(c),n(t)};s.onclick=()=>u(null),d.onclick=()=>{let e=o?a.querySelector('input')?.value:a.querySelector('input[name="option"]:checked')?.value;u(e)},c.onclick=e=>{e.target===c&&u(null)}})}
getCurrentURL(){return window.location.href}
getCurrentTitle(){return document.title}
openInNewTab(e){window.open(e.URL,'_blank')}
setPageTitle(e){document.title=e.TITLE}
refreshPage(){window.location.reload()}
copyToClipboard(e){let t=document.createElement('textarea');t.value=e.TEXT,document.body.appendChild(t),t.select();try{document.execCommand('copy')}catch(e){}document.body.removeChild(t)}
base64Operation(e){let t=e.OPERATION,o=e.CONTENT;try{return'编码'===t?btoa(unescape(encodeURIComponent(o))):decodeURIComponent(escape(atob(o)))}catch(e){return'编码'===t?'编码失败':'解码失败'}}
getLocationInfo(){return new Promise(e=>{fetch('https://ipapi.co/json/').then(t=>t.json()).then(t=>{e(t.country_name&&t.region&&t.city?`${t.country_name}-${t.region}-${t.city}`:'位置信息不可用')}).catch(()=>e('位置服务暂时不可用'))})}
downloadFile(e){let t=e.CONTENT,o=e.FILENAME,n=new Blob([t],{type:'text/plain;charset=utf-8'}),c=URL.createObjectURL(n),r=document.createElement('a');r.href=c,r.download=o,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(c)}
calculateDaysBetween(e){let t=e.START,o=e.END,n=new Date(t.replace(/\./g,'/')),c=new Date(o.replace(/\./g,'/'));if(isNaN(n)||isNaN(c))return'日期格式错误';let r=Math.abs(c-n),i=Math.ceil(r/(1e3*60*60*24));return i}
closeCurrentPage(){window.close()}
generateRandomEmojis(e){let t=e.COUNT,o=['😀','😂','🥰','😎','🤩','😍','🤗','🙂','😊','😇','🥳','😜','🤪','😋','😛','👏','👍','❤️','🔥','⭐','🌈','🎉','🎁','🎂','🎈','💯','✨','🌟','💫','💥','💖','💕','💞','💓','💗','🔥','🌟','💫','⭐','🌈','🌞','🌻','🌸','🌺','🍀','🎵','🎶','🎨','🏆','🎮','🎯','⚽','🏀','🎾','🏐','🎱'],n='';for(let e=0;e<t;e++)n+=o[Math.floor(Math.random()*o.length)];return n}
runHTMLCode(e){try{let t=document.createElement('div');t.innerHTML=e.HTML_CODE,document.body.appendChild(t)}catch(e){}}
getBatteryLevel(){return new Promise(e=>{if(navigator.getBattery){navigator.getBattery().then(t=>{e(Math.round(t.level*100)+'%')}).catch(()=>e('未知'))}else{e('不支持电池API')}})}
vibrateDevice(e){if(navigator.vibrate){navigator.vibrate(e.DURATION)}}
shareContent(e){if(navigator.share){navigator.share({title:document.title,text:e.TEXT,url:e.URL}).catch(()=>{})}}
getScreenResolution(){return screen.width+'×'+screen.height}
checkNetworkSpeed(){return new Promise(e=>{let t=performance.getEntriesByType('navigation');if(t.length>0){let o=t[0];if(o.domainLookupEnd&&o.connectEnd&&o.responseEnd&&o.requestStart){let n=o.domainLookupEnd-o.domainLookupStart,c=o.connectEnd-o.connectStart,r=o.responseEnd-o.requestStart;e(`DNS:${n.toFixed(2)}ms 连接:${c.toFixed(2)}ms 响应:${r.toFixed(2)}ms`)}else{e('无法获取网络速度详情')}}else{e('网络信息不可用')}})}
getClipboardText(){return new Promise(e=>{navigator.clipboard?.readText?.().then(t=>e(t)).catch(()=>e('无法读取剪贴板'))})}
takeScreenshot(){html2canvas(document.body).then(e=>{let t=e.toDataURL('image/png'),o=document.createElement('a');o.href=t,o.download='screenshot.png',o.click()})}
getSystemTheme(){return window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'深色模式':'浅色模式'}
getUserLanguage(){return navigator.language||navigator.userLanguage||'未知'}
getCPUInfo(){return navigator.hardwareConcurrency?navigator.hardwareConcurrency+'核心':'未知'}
isCookieEnabled(){return navigator.cookieEnabled}
getPageFavicon(){let e=document.querySelector('link[rel*="icon"]');return e?e.href:'无图标'}
getMemoryInfo(){return navigator.deviceMemory?navigator.deviceMemory+'GB':'未知'}
getUserAgent(){return navigator.userAgent}
getViewportSize(){return window.innerWidth+'×'+window.innerHeight}
isJavaScriptEnabled(){return true}
getPlatformInfo(){return navigator.platform||'未知平台'}
getConnectionType(){let e=navigator.connection;return e?e.effectiveType||'未知':'未知'}
getPageLoadTime(){let e=performance.timing;return e.loadEventEnd-e.navigationStart+'ms'}
getScrollPosition(){return window.pageYOffset+'px'}
isDoNotTrackEnabled(){return navigator.doNotTrack===1||navigator.doNotTrack==='1'||navigator.msDoNotTrack==='1'||window.doNotTrack==='1'}
getReferrer(){return document.referrer||'无来源页面'}
getTimezone(){return Intl.DateTimeFormat().resolvedOptions().timeZone}
getDeviceOrientation(){return new Promise(e=>{if(window.DeviceOrientationEvent){window.addEventListener('deviceorientation',t=>{e(`Alpha:${t.alpha?.toFixed(2)} Beta:${t.beta?.toFixed(2)} Gamma:${t.gamma?.toFixed(2)}`)},{once:!0})}else{e('不支持设备方向检测')}})}
getNetworkLatency(){return new Promise(e=>{let t=performance.now();fetch('https://www.google.com/favicon.ico?t='+Date.now(),{mode:'no-cors',cache:'no-cache'}).then(()=>{e((performance.now()-t).toFixed(2)+'ms')}).catch(()=>e('检测失败'))})}
getStorageUsage(){return new Promise(e=>{if(navigator.storage&&navigator.storage.estimate){navigator.storage.estimate().then(t=>{let o=(t.usage/1024/1024).toFixed(2),n=(t.quota/1024/1024).toFixed(2);e(`已用:${o}MB 总额:${n}MB`)}).catch(()=>e('存储信息不可用'))}else{e('不支持存储API')}})}
isPWAInstalled(){return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone||document.referrer.includes('android-app://')}
getMediaDevices(){return new Promise(e=>{navigator.mediaDevices?.enumerateDevices?.().then(t=>{let o=t.map(t=>`${t.kind}:${t.label||'未知'}`).join('; ');e(o||'无媒体设备')}).catch(()=>e('无法获取设备列表'))})}
createQRCode(e){return`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(e.TEXT)}`}
speakText(e){if('speechSynthesis'in window){let t=new SpeechSynthesisUtterance(e.TEXT);speechSynthesis.speak(t)}}
stopSpeaking(){speechSynthesis.cancel()}
getGeolocation(){return new Promise(e=>{if('geolocation'in navigator){navigator.geolocation.getCurrentPosition(t=>{e(`纬度:${t.coords.latitude.toFixed(6)} 经度:${t.coords.longitude.toFixed(6)}`)},()=>e('位置获取失败'))}else{e('不支持地理位置')}})}
getSunriseSunset(){return new Promise(e=>{fetch('https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400&formatted=0').then(t=>t.json()).then(t=>{t.results?e(`日出:${t.results.sunrise} 日落:${t.results.sunset}`):e('数据获取失败')}).catch(()=>e('服务不可用'))})}
calculateAge(e){let t=new Date(e.BIRTHDAY.replace(/\./g,'/')),o=new Date(),n=o.getFullYear()-t.getFullYear(),c=o.getMonth()-t.getMonth();return c<0||0===c&&o.getDate()<t.getDate()?n-1:n}
countdownTimer(e){let t=new Date(e.TARGET_TIME),o=new Date(),n=t-o;return n<=0?'时间已到':`${Math.floor(n/(1e3*60*60*24))}天${Math.floor(n%(1e3*60*60*24)/(1e3*60*60))}小时${Math.floor(n%(1e3*60*60)/(1e3*60))}分钟`}
getMoonPhase(){let e=new Date(),t=e.getDate(),o=e.getMonth()+1,n=e.getFullYear(),c=(n%100+Math.floor((n%100)/4))%7;return['新月','娥眉月','上弦月','盈凸月','满月','亏凸月','下弦月','残月'][Math.floor(t%8)]}
generatePassword(e){let t=e.LENGTH,o='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',n='';for(let e=0;e<t;e++)n+=o[Math.floor(Math.random()*o.length)];return n}
analyzeText(e){let t=e.TEXT,o=t.length,n=t.split(/\s+/).length,c=t.split(/[.!?]+/).length-1;return`字符数:${o} 单词数:${n} 句子数:${c}`}
getCurrentSeason(){let e=new Date(),t=e.getMonth();return t>=2&&t<=4?'春季':t>=5&&t<=7?'夏季':t>=8&&t<=10?'秋季':'冬季'}
isLeapYear(e){let t=e.YEAR;return t%4==0&&t%100!=0||t%400==0}
getURLParameters(){let e=new URLSearchParams(window.location.search),t=[];for(let o of e.entries())t.push(`${o[0]}=${o[1]}`);return t.join(', ')}
setLocalStorage(e){localStorage.setItem(e.KEY,e.VALUE)}
getLocalStorage(e){return localStorage.getItem(e.KEY)||''}
removeLocalStorage(e){localStorage.removeItem(e.KEY)}
clearLocalStorage(){localStorage.clear()}
getPerformanceMetrics(){let e=performance.getEntriesByType('navigation')[0];if(e){let t=e.domContentLoadedEventEnd-e.navigationStart,o=e.loadEventEnd-e.navigationStart;return`DOM加载:${t}ms 完全加载:${o}ms`}return'性能数据不可用'}
detectAdBlocker(){return new Promise(e=>{fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',{method:'HEAD',mode:'no-cors'}).then(()=>e(false)).catch(()=>e(true))})}
getPageVisibility(){return document.hidden?'页面隐藏':'页面可见'}
createBlobURL(e){let t=new Blob([e.CONTENT],{type:e.TYPE});return URL.createObjectURL(t)}
revokeBlobURL(e){URL.revokeObjectURL(e.URL)}
getElementCount(e){return document.querySelectorAll(e.SELECTOR).length}
checkFontSupport(e){let t=document.createElement('span');t.style.fontFamily=e.FONT,t.style.position='absolute',t.style.left='-9999px',t.innerHTML='mmmmmmmmmmmmmmmm';document.body.appendChild(t);let o=t.offsetWidth;document.body.removeChild(t);let n=document.createElement('span');n.style.fontFamily='monospace',n.style.position='absolute',n.style.left='-9999px',n.innerHTML='mmmmmmmmmmmmmmmm';document.body.appendChild(n);let c=n.offsetWidth;return document.body.removeChild(n),o!==c}
getCSSVariable(e){return getComputedStyle(document.documentElement).getPropertyValue(e.VAR_NAME).trim()}
setCSSVariable(e){document.documentElement.style.setProperty(e.VAR_NAME,e.VALUE)}
createObjectURL(e){let t=new Blob([e.FILE],{type:'text/plain'});return URL.createObjectURL(t)}
measureTextWidth(e){let t=document.createElement('canvas'),o=t.getContext('2d');return o.font=e.FONT,Math.ceil(o.measureText(e.TEXT).width)}
getScrollbarWidth(){let e=document.createElement('div');e.style.overflow='scroll',e.style.width='50px',e.style.height='50px',e.style.visibility='hidden',e.style.position='absolute',e.style.top='-9999px';document.body.appendChild(e);let t=e.offsetWidth-e.clientWidth;return document.body.removeChild(e),t}
isReduceMotionEnabled(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches}
detectIncognitoMode(){return new Promise(e=>{let t=!1;'storage'in navigator&&navigator.storage.estimate?navigator.storage.estimate().then(o=>{t=o.quota<12e9}).catch(()=>t=!1):t=!1,e(t)})}
getDeviceMotion(){return new Promise(e=>{if(window.DeviceMotionEvent){window.addEventListener('devicemotion',t=>{e(`X:${t.acceleration?.x?.toFixed(2)} Y:${t.acceleration?.y?.toFixed(2)} Z:${t.acceleration?.z?.toFixed(2)}`)},{once:!0})}else{e('不支持设备运动检测')}})}
createHash(e){let t=e.ALGORITHM,o=e.TEXT,n=0;for(let e=0;e<o.length;e++)n=((n<<5)-n)+o.charCodeAt(e),n&=n;return'MD5'===t?(n>>>0).toString(16):'SHA-1'===t?(n+2147483648).toString(16):'SHA-256'===t?(n*2654435761>>>0).toString(16):(n^123456789).toString(16)}
compressText(e){try{return btoa(encodeURIComponent(e.TEXT).replace(/%([0-9A-F]{2})/g,(e,t)=>String.fromCharCode('0x'+t)))}catch(e){return'压缩失败'}}
decompressText(e){try{return decodeURIComponent(atob(e.TEXT).split('').map(e=>'%'+('00'+e.charCodeAt(0).toString(16)).slice(-2)).join(''))}catch(e){return'解压失败'}}
detectDarkPattern(){return window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'深色模式':'浅色模式'}
getAudioContext(){return'undefined'!=typeof AudioContext?'音频上下文可用':'音频上下文不可用'}
calculateTextReadTime(e){let t=e.TEXT.length;return Math.ceil(t/200)+'分钟'}
generateUUID(){return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,e=>{let t=16*Math.random()|0;return('x'===e?t:3&t|8).toString(16)})}
checkImageExists(e){return new Promise(t=>{let o=new Image;o.onload=()=>t(!0),o.onerror=()=>t(!1),o.src=e.URL})}
getCookieValue(e){let t=`; ${document.cookie}`,o=t.split(`; ${e.NAME}=`);return 2===o.length?o.pop().split(';').shift():''}
setCookieValue(e){let t=e.NAME,o=e.VALUE,n=e.DAYS,c=new Date;c.setTime(c.getTime()+24*n*60*60*1e3);let r='expires='+c.toUTCString();document.cookie=t+'='+o+';'+r+';path=/'}
getBatteryStatus(){return new Promise(e=>{if(navigator.getBattery){navigator.getBattery().then(t=>{e(`电量:${Math.round(t.level*100)}% 充电中:${t.charging?'是':'否'} 充电时间:${t.chargingTime?Math.round(t.chargingTime/60)+'分钟':'未知'} 放电时间:${t.dischargingTime?Math.round(t.dischargingTime/60)+'分钟':'未知'}`)}).catch(()=>e('电池状态未知'))}else{e('不支持电池API')}})}
detectIdleState(){return new Promise(e=>{if('requestIdleCallback'in window){let t=performance.now();window.requestIdleCallback(()=>{e(`空闲时间:${Math.round(performance.now()-t)}ms`)})}else{e('不支持空闲检测')}})}
calculateDistance(e){let t=e.POINT1.split(',').map(Number),o=e.POINT2.split(',').map(Number);if(t.length!==2||o.length!==2||t.some(isNaN)||o.some(isNaN))return'坐标格式错误';let n=t[0]-o[0],c=t[1]-o[1];return Math.sqrt(n*n+c*c).toFixed(2)}
generateLoremIpsum(e){let t=e.WORDS,o=['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate','velit','esse','cillum','eu','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum'],n='';for(let e=0;e<t;e++)n+=(e>0?' ':'')+o[Math.floor(Math.random()*o.length)];return n+'.'}
checkSSLStatus(){return window.location.protocol==='https:'}
getPageLoadSize(){let e=performance.getEntriesByType('resource').reduce((e,t)=>e+t.transferSize||0,0);return(e/1024).toFixed(2)+'KB'}
detectPrintSupport(){return!!window.matchMedia&&!!window.matchMedia('print')}
createDataURL(e){return`data:${e.TYPE},${encodeURIComponent(e.CONTENT)}`}
getActiveElement(){let e=document.activeElement;return e?e.tagName+ (e.id?'#'+e.id:'')+ (e.className?'.'+e.className.split(' ')[0]:''):'无焦点元素'}
checkWebGLSupport(){let e=document.createElement('canvas');return!!(e.getContext('webgl')||e.getContext('experimental-webgl'))}
getSelectionText(){let e=window.getSelection();return e?e.toString():'无选中文本'}
detectPointerType(){return window.matchMedia&&window.matchMedia('(pointer:coarse)').matches?'触摸设备':window.matchMedia&&window.matchMedia('(pointer:fine)').matches?'鼠标设备':'未知指针设备'}
calculateAspectRatio(e){let t=e.WIDTH,o=e.HEIGHT;if(t<=0||o<=0)return'无效尺寸';let n=this.gcd(t,o);return`${t/n}:${o/n}`}
gcd(e,t){return t===0?e:this.gcd(t,e%t)}
generateGradient(e){return`linear-gradient(45deg, ${e.COLOR1}, ${e.COLOR2})`}
checkServiceWorker(){return'navigator' in window&&'serviceWorker' in navigator?!!navigator.serviceWorker.controller:'不支持Service Worker'}}

Scratch.extensions.register(new MorganToolboxV8());