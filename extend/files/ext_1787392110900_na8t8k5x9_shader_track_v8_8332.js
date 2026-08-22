// Name: shader track
// ID: shadertrack
// Description: Shader Track允许在你的作品上使用着色器
// By: ObviousAlexC <https://scratch.mit.edu/users/pinksheep2917/>
// Extra version by: DustDot <https://space.bilibili.com/302475547>
// Revision by：YL_YOLO <https://space.bilibili.com/1444083784>
// 日志:8.74 修复了遮罩打印延迟问题(小孩EJ改)
//v8.741 修复重复执行下设置uniform变量崩溃问题
//v8.781 新增混合遮罩模版
//v8.782 优化了一些东西
//v8.785 优化了对角色使用着色器(颜色不符问题)
//v8.788.3 添加了保护层，解决多重渲染图章bug,添加了渲染顺序      (至于这次为什么加个小数点？是因为如果达到v9版本得需要解决的问题1. 着色器对于应用在屏幕或者图层之间画面不正常，即颠倒的问题— 但试了好几种方案都奇偶颠倒2. 多重渲染时画笔双重图章（原始造型盖在着色器画面上）— 还没彻底修复因为没有兼容混合问题3. 遮罩对图章无效★4.着色器没有以遮罩层处理后的纹理作为着色器的纹理[上述问题均尝试过，但均以失败告终]5.改版的版本Turbowarp还原点创建速度过慢且创建还原点有几率生效问题
//v8.788.6 优化了遮罩性能(300克隆体，60+fps)
//v8.788.65 优化混合遮罩更新(更快了但仍然较卡)
//★v8.789 去掉了所有原先遮罩逻辑但现在新增纹理绑定，可通过纹理绑定来实现遮罩(性能更棒但仍然有问题单次只能处理一个，还有屏幕uv的片元着色器多重渲染会有bug，不支持图章)
//★v8.79 终于修复了还原点，无法保存问题(其实之前的额外版也有这个问题，但现在完全解决了速度也得到了保证)目前v9还需要解决的问题，画笔图层和屏幕图层，同样应用一个着色器，但是画笔图层用的着色器倒着的，但纹理显示正常，正着的。其次多重渲染的双重涂装好像已经解决
//v8.7905 新增。uniform变量瞬间立即更新功能
//v8.791 优化了一些东西
//v8.792 修复了打开着色器面板，多次点击后舞台黑屏问题
//v8.793 修复预览功能
//v8.79301 添加了几种混合效果
//★v8.8 迁移外观+扩展(别问为什么，问就是单独加外观+扩展不知道为什么容易造成性能问题)注意不是官方扩展的外观+这里是指pm的
//v8.83 加入了一些可直接使用着色器
//v8.832 修复积木分区切换问题(支持打包)修复加载作品时屏幕着色器默认值无值问题
//v8.833 修复外观着色器无法应用scratch特效问题
//v8.8331 修复四点扭曲以及九宫格拉伸问题
//v8.8331001 修复水波纹方法
//v8.8331002 添加置换图
//v8.8331003 优化了置换图
//v8.8332 去除了penplus兼容层
(function(Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) {
        //for those who use the version from pen-group's site
        alert("Shaded Stamps must be ran unsandboxed!");
        throw new Error("Shaded Stamps must run unsandboxed");
    }
    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const renderer = runtime.renderer;
    const gl = renderer._gl;
    const twgl = renderer.exports.twgl;
    const GL_POS_FINDER = /gl_Position\s*=[\w\s\d[\]|&^%$#@!+=\-*\/,._()]*;/gm;
    const GL_POS_VAR = /vec4\s*a_position;/gm;
    const isWebGL2 = twgl.isWebGL2(gl);
    const TRIANGLES_PER_BUFFER = 10000;
    const defaultVertexShader100 = "//Base Variables\nattribute highp vec4 a_position;\nattribute highp vec4 a_color;\nattribute highp vec2 a_texCoord;\n \nvarying highp vec4 v_color;\nvarying highp vec2 v_texCoord;\n\nvarying highp float v_depth;\nuniform highp float u_timer;\nuniform highp mat4 u_transform;\n\n//Pen+ Textures\nuniform mediump vec2 u_res;\n\n//Base functions\nhighp float log10(highp float a) {\n  return log(a)/log(10.0);\n}\n\nhighp float eulernum(highp float a) {\n    return 2.718 * a;\n}\n\nhighp vec4 HSVToRGB(highp float hue, highp float saturation, highp float value, highp float a) {\n  highp float huePrime = mod(hue,360.0);\n  highp float c = (value/100.0) * (saturation/100.0);\n  highp float x = c * (1.0 - abs(mod(huePrime/60.0, 2.0) - 1.0));\n  highp float m = (value/100.0) - c;\n  highp float r = 0.0;\n  highp float g = 0.0;\n  highp float b = 0.0;\n  \n  if (huePrime >= 0.0 && huePrime < 60.0) {\n      r = c;\n      g = x;\n      b = 0.0;\n  } else if (huePrime >= 60.0 && huePrime < 120.0) {\n      r = x;\n      g = c;\n      b = 0.0;\n  } else if (huePrime >= 120.0 && huePrime < 180.0) {\n      r = 0.0;\n      g = c;\n      b = x;\n  } else if (huePrime >= 180.0 && huePrime < 240.0) {\n      r = 0.0;\n      g = x;\n      b = c;\n  } else if (huePrime >= 240.0 && huePrime < 300.0) {\n      r = x;\n      g = 0.0;\n      b = c;\n  } else if (huePrime >= 300.0 && huePrime < 360.0) {\n      r = c;\n      g = 0.0;\n      b = x;\n  }\n  r += m;\n  g += m;\n  b += m;\n  return vec4(r, g, b, a);\n}\n\nhighp vec4 rotation(highp vec4 invec4) {\n    return vec4(\n      (invec4.y) * u_transform[1][0] + (invec4.x) * u_transform[1][1],\n      (invec4.y) * u_transform[1][1] - (invec4.x) * u_transform[1][0],\n      invec4.zw\n    );\n  }\n    \nuniform sampler2D u_skin;\n\n//Vertex Shader\nvoid main() {\ngl_Position = (rotation(a_position) + vec4(u_transform[0][2],u_transform[0][3],0,0)) * vec4(a_position.w * u_transform[0][0],a_position.w * -u_transform[0][1],1,1) - vec4(0,0,1,0);\nv_color = a_color;\nv_texCoord = a_texCoord;\n}";
    const defaultFragmentShader100 = "//Base Variables\nvarying highp vec4 v_color;\nvarying highp vec2 v_texCoord;\n\nvarying highp float v_depth;\nuniform highp float u_timer;\nuniform highp mat4 u_transform;\n\n//Pen+ Textures\nuniform mediump vec2 u_res;\n\n//Base functions\nhighp float log10(highp float a) {\n  return log(a)/log(10.0);\n}\n\nhighp float eulernum(highp float a) {\n    return 2.718 * a;\n}\n\nhighp vec4 HSVToRGB(highp float hue, highp float saturation, highp float value, highp float a) {\n  highp float huePrime = mod(hue,360.0);\n  highp float c = (value/100.0) * (saturation/100.0);\n  highp float x = c * (1.0 - abs(mod(huePrime/60.0, 2.0) - 1.0));\n  highp float m = (value/100.0) - c;\n  highp float r = 0.0;\n  highp float g = 0.0;\n  highp float b = 0.0;\n  \n  if (huePrime >= 0.0 && huePrime < 60.0) {\n      r = c;\n      g = x;\n      b = 0.0;\n  } else if (huePrime >= 60.0 && huePrime < 120.0) {\n      r = x;\n      g = c;\n      b = 0.0;\n  } else if (huePrime >= 120.0 && huePrime < 180.0) {\n      r = 0.0;\n      g = c;\n      b = x;\n  } else if (huePrime >= 180.0 && huePrime < 240.0) {\n      r = 0.0;\n      g = x;\n      b = c;\n  } else if (huePrime >= 240.0 && huePrime < 300.0) {\n      r = x;\n      g = 0.0;\n      b = c;\n  } else if (huePrime >= 300.0 && huePrime < 360.0) {\n      r = c;\n      g = 0.0;\n      b = x;\n  }\n  r += m;\n  g += m;\n  b += m;\n  return vec4(r, g, b, a);\n}\n\nhighp vec4 rotation(highp vec4 invec4) {\n    return vec4(\n      (invec4.y) * u_transform[1][0] + (invec4.x) * u_transform[1][1],\n      (invec4.y) * u_transform[1][1] - (invec4.x) * u_transform[1][0],\n      invec4.zw\n    );\n  }\n    \nuniform sampler2D u_skin;\n\n//Fragment Shader\nvoid main() {\ngl_FragColor = texture2D(u_skin,v_texCoord);\n}";
    const defaultVertexShader300 = "#version 300 es\n//Base Variables\nin highp vec4 a_position;\nin highp vec4 a_color;\nin highp vec2 a_texCoord;\n \nout highp vec4 v_color;\nout highp vec2 v_texCoord;\n\nout highp float v_depth;\nuniform highp float u_timer;\nuniform highp mat4 u_transform;\n\n//Pen+ Textures\nuniform mediump vec2 u_res;\n\n//Base functions\nhighp float log10(highp float a) {\n  return log(a)/log(10.0);\n}\n\nhighp float eulernum(highp float a) {\n    return 2.718 * a;\n}\n\nhighp vec4 HSVToRGB(highp float hue, highp float saturation, highp float value, highp float a) {\n  highp float huePrime = mod(hue,360.0);\n  highp float c = (value/100.0) * (saturation/100.0);\n  highp float x = c * (1.0 - abs(mod(huePrime/60.0, 2.0) - 1.0));\n  highp float m = (value/100.0) - c;\n  highp float r = 0.0;\n  highp float g = 0.0;\n  highp float b = 0.0;\n  \n  if (huePrime >= 0.0 && huePrime < 60.0) {\n      r = c;\n      g = x;\n      b = 0.0;\n  } else if (huePrime >= 60.0 && huePrime < 120.0) {\n      r = x;\n      g = c;\n      b = 0.0;\n  } else if (huePrime >= 120.0 && huePrime < 180.0) {\n      r = 0.0;\n      g = c;\n      b = x;\n  } else if (huePrime >= 180.0 && huePrime < 240.0) {\n      r = 0.0;\n      g = x;\n      b = c;\n  } else if (huePrime >= 240.0 && huePrime < 300.0) {\n      r = x;\n      g = 0.0;\n      b = c;\n  } else if (huePrime >= 300.0 && huePrime < 360.0) {\n      r = c;\n      g = 0.0;\n      b = x;\n  }\n  r += m;\n  g += m;\n  b += m;\n  return vec4(r, g, b, a);\n}\n\nhighp vec4 rotation(highp vec4 invec4) {\n    return vec4(\n      (invec4.y) * u_transform[1][0] + (invec4.x) * u_transform[1][1],\n      (invec4.y) * u_transform[1][1] - (invec4.x) * u_transform[1][0],\n      invec4.zw\n    );\n  }\n    \nuniform sampler2D u_skin;\n\n//Vertex Shader\nvoid main() {\ngl_Position = (rotation(a_position) + vec4(u_transform[0][2],u_transform[0][3],0,0)) * vec4(a_position.w * u_transform[0][0],a_position.w * -u_transform[0][1],1,1) - vec4(0,0,1,0);\nv_color = a_color;\nv_texCoord = a_texCoord;\n}";
    const defaultFragmentShader300 = "#version 300 es\n//Base Variables\nin highp vec4 v_color;\nin highp vec2 v_texCoord;\n\nin highp float v_depth;\nout highp vec4 fragColor;\nuniform highp float u_timer;\nuniform highp mat4 u_transform;\n\n//Pen+ Textures\nuniform mediump vec2 u_res;\n\n//Base functions\nhighp float log10(highp float a) {\n  return log(a)/log(10.0);\n}\n\nhighp float eulernum(highp float a) {\n    return 2.718 * a;\n}\n\nhighp vec4 HSVToRGB(highp float hue, highp float saturation, highp float value, highp float a) {\n  highp float huePrime = mod(hue,360.0);\n  highp float c = (value/100.0) * (saturation/100.0);\n  highp float x = c * (1.0 - abs(mod(huePrime/60.0, 2.0) - 1.0));\n  highp float m = (value/100.0) - c;\n  highp float r = 0.0;\n  highp float g = 0.0;\n  highp float b = 0.0;\n  \n  if (huePrime >= 0.0 && huePrime < 60.0) {\n      r = c;\n      g = x;\n      b = 0.0;\n  } else if (huePrime >= 60.0 && huePrime < 120.0) {\n      r = x;\n      g = c;\n      b = 0.0;\n  } else if (huePrime >= 120.0 && huePrime < 180.0) {\n      r = 0.0;\n      g = c;\n      b = x;\n  } else if (huePrime >= 180.0 && huePrime < 240.0) {\n      r = 0.0;\n      g = x;\n      b = c;\n  } else if (huePrime >= 240.0 && huePrime < 300.0) {\n      r = x;\n      g = 0.0;\n      b = c;\n  } else if (huePrime >= 300.0 && huePrime < 360.0) {\n      r = c;\n      g = 0.0;\n      b = x;\n  }\n  r += m;\n  g += m;\n  b += m;\n  return vec4(r, g, b, a);\n}\n\nhighp vec4 rotation(highp vec4 invec4) {\n    return vec4(\n      (invec4.y) * u_transform[1][0] + (invec4.x) * u_transform[1][1],\n      (invec4.y) * u_transform[1][1] - (invec4.x) * u_transform[1][0],\n      invec4.zw\n    );\n  }\n    \nuniform sampler2D u_skin;\n\n//Fragment Shader\nvoid main() {\nfragColor = texture(u_skin,v_texCoord);\n}";
    const scratchEffectsShaderPrefix = "uniform highp float u_fisheye;\nuniform highp float u_whirl;\nuniform highp float u_pixelate;\nuniform highp vec2 u_skinSize;\nuniform highp float u_mosaic;\nuniform highp float u_ghost;\nuniform highp float u_brightness;\nuniform highp float u_color;\nconst highp vec2 scratch3_kCenter = vec2(0.5, 0.5);\nconst highp float scratch3_epsilon = 1e-3;\nhighp vec2 scratch3_uv_replacement = vec2(0,0);\nhighp vec3 scratch3_convertRGB2HSV(highp vec3 rgb)\n{\n  const highp vec4 hueOffsets = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n  highp vec4 temp1 = rgb.b > rgb.g ? vec4(rgb.bg, hueOffsets.wz) : vec4(rgb.gb, hueOffsets.xy);\n  highp vec4 temp2 = rgb.r > temp1.x ? vec4(rgb.r, temp1.yzx) : vec4(temp1.xyw, rgb.r);\n  highp float m = min(temp2.y, temp2.w);\n  highp float C = temp2.x - m;\n  highp float V = temp2.x;\n  return vec3(\n    abs(temp2.z + (temp2.w - temp2.y) / (6.0 * C + scratch3_epsilon)),\n    C / (temp2.x + scratch3_epsilon),\n    V);\n}\nhighp vec3 scratch3_convertHue2RGB(highp float hue)\n{\n  highp float r = abs(hue * 6.0 - 3.0) - 1.0;\n  highp float g = 2.0 - abs(hue * 6.0 - 2.0);\n  highp float b = 2.0 - abs(hue * 6.0 - 4.0);\n  return clamp(vec3(r, g, b), 0.0, 1.0);\n}\nhighp vec3 scratch3_convertHSV2RGB(highp vec3 hsv)\n{\n  highp vec3 rgb = scratch3_convertHue2RGB(hsv.x);\n  highp float c = hsv.z * hsv.y;\n  return rgb * c + hsv.z - c;\n}\nhighp vec2 scratch3_apply_UV_Effects(highp vec2 scratch3_input_uv) {\n  if (u_mosaic > 0.0) {\n    scratch3_input_uv = fract(u_mosaic * scratch3_input_uv);\n  }\n  if (u_pixelate > 0.0) {\n    highp vec2 pixelTexelSize = u_skinSize / u_pixelate;\n    scratch3_input_uv = (floor(scratch3_input_uv * pixelTexelSize) + scratch3_kCenter) / pixelTexelSize;\n  }\n  if (u_whirl != 0.0) {\n    const highp float kRadius = 0.5;\n    highp vec2 offset = scratch3_input_uv - scratch3_kCenter;\n    highp float offsetMagnitude = length(offset);\n    highp float whirlFactor = max(1.0 - (offsetMagnitude / kRadius), 0.0);\n    highp float whirlActual = u_whirl * whirlFactor * whirlFactor;\n    highp float sinWhirl = sin(whirlActual);\n    highp float cosWhirl = cos(whirlActual);\n    highp mat2 rotationMatrix = mat2(\n      cosWhirl, -sinWhirl,\n      sinWhirl, cosWhirl\n    );\n    scratch3_input_uv = rotationMatrix * offset + scratch3_kCenter;\n  }\n  if (u_fisheye != 0.0) {\n    highp vec2 vec = (scratch3_input_uv - scratch3_kCenter) / scratch3_kCenter;\n    highp float vecLength = length(vec);\n    highp float r = pow(min(vecLength, 1.0), u_fisheye) * max(1.0, vecLength);\n    highp vec2 unit = vec / vecLength;\n    scratch3_input_uv = scratch3_kCenter + r * unit * scratch3_kCenter;\n  }\n  return scratch3_input_uv;\n}\nhighp vec4 scratch3_apply_color_Effects(highp vec4 color) {\n  if (u_color != 0.0) {\n    highp vec3 hsv = scratch3_convertRGB2HSV(color.rgb);\n    hsv.x = fract(hsv.x + u_color);\n    color.rgb = scratch3_convertHSV2RGB(hsv);\n  }\n  if (u_brightness > 0.0) {\n    color.rgb = mix(color.rgb, vec3(1.0, 1.0, 1.0) * color.a, u_brightness);\n  } else if (u_brightness < 0.0) {\n    color.rgb = mix(color.rgb, vec3(0.0), -u_brightness);\n  }\n  color.rgb = clamp(color.rgb, 0.0, 1.0);\n  color *= u_ghost;\n  return color;\n}"
    // ========== Pen+ 兼容层 ==========
    let shaderfile = {
            extensionVersion: "9.9.9.Shaded",
            currentFilter: gl.NEAREST,
            shaders: {},
            programs: {},

            events: {
                shaderSaved: [],
                editorClosed: [],
            },

            prefixes: {
                shaderfileTextures: "",
                renderTextures: "",
            },

            // 序列化/反序列化（项目保存/加载）
            _setupExtensionStorage() {
                if (Scratch.extensions.isPenguinMod) {
                    shaderfile.serialize = () => {
                        return JSON.stringify({
                            shaders: shaderfile.shaders,
                            version: shaderfile.extensionVersion,
                            prefixes: shaderfile.prefixes,
                            subShaders: parentExtension?.subShaders || {},
                            subShaderUniforms: parentExtension?.subShaderUniforms || {}
                        });
                    };

                    shaderfile.deserialize = (serialized) => {
                        let deserializedData = JSON.parse(serialized);
                        this.programs = {};

                        if (deserializedData.subShaders) {
                            if (parentExtension) parentExtension.subShaders = deserializedData.subShaders;
                        }
                        if (deserializedData.subShaderUniforms) {
                            if (parentExtension) parentExtension.subShaderUniforms = deserializedData.subShaderUniforms;
                        }

                        if (deserializedData.version) {
                            shaderfile.shaders = deserializedData.shaders;
                            shaderfile.prefixes = deserializedData.prefixes;

                            Object.keys(shaderfile.shaders).forEach(name => {
                                if (parentExtension?.subShaders?.[name]) {
                                    shaderfile.shaders[name].isSubShader = true;
                                }
                            });
                        } else {
                            shaderfile.shaders = deserializedData || {};
                        }
                        shaderfile._parseProjectShaders();
                    };

                    shaderfile.getShaders = () => {
                        return shaderfile.shaders;
                    };
                } else {
                    // Turbowarp 存储
                    this.programs = {};
                    if (!runtime.extensionStorage["shadertrack"]) {
                        runtime.extensionStorage["shadertrack"] = Object.create(null);
                        runtime.extensionStorage["shadertrack"].shaders = Object.create(null);
                        runtime.extensionStorage["shadertrack"].version = shaderfile.extensionVersion;
                        runtime.extensionStorage["shadertrack"].prefixes = shaderfile.prefixes;
                        runtime.extensionStorage["shadertrack"].subShaders = Object.create(null);
                        runtime.extensionStorage["shadertrack"].subShaderUniforms = Object.create(null);
                    }

                    if (runtime.extensionStorage["shadertrack"].subShaders) {
                        if (parentExtension) parentExtension.subShaders = runtime.extensionStorage["shadertrack"].subShaders;
                    }
                    if (runtime.extensionStorage["shadertrack"].subShaderUniforms) {
                        if (parentExtension) parentExtension.subShaderUniforms = runtime.extensionStorage["shadertrack"].subShaderUniforms;
                    }

                    Object.keys(shaderfile.shaders).forEach(name => {
                        if (parentExtension?.subShaders?.[name]) {
                            shaderfile.shaders[name].isSubShader = true;
                        }
                    });

                    shaderfile.shaders = runtime.extensionStorage["shadertrack"].shaders;
                    shaderfile.prefixes = runtime.extensionStorage["shadertrack"].prefixes;

                    shaderfile.getShaders = () => {
                        shaderfile.shaders = runtime.extensionStorage["shadertrack"].shaders;
                        return runtime.extensionStorage["shadertrack"].shaders;
                    };

                    shaderfile._parseProjectShaders();
                }

                shaderfile.savingData = {
                    projectData: undefined,
                    fragShader: undefined,
                    vertShader: undefined,
                };
            },

            // 保存着色器
            saveShader(name, data) {
                this.shaders[name] = {
                    projectData: data,
                    modifyDate: Date.now(),
                };

                if (data.vertShader.includes("#version 300 es") && (!isWebGL2)) return;

                this.programs[name] = {
                    info: twgl.createProgramInfo(gl, [data.vertShader, data.fragShader]),
                    uniformDat: {},
                    uniformDec: {},
                    attribDat: {},
                };

                this.dispatchEvent("shaderSaved", {
                    projectData: data,
                    vertexShader: data.vertShader,
                    fragmentShader: data.fragShader,
                    name: name,
                });

                this._createAttributedatForShader(name);
            },

            // 删除着色器
            deleteShader(name) {
                delete this.shaders[name];
                delete this.programs[name];
            },

            // 事件系统
            dispatchEvent(eventName, data) {
                if (!this.events[eventName]) return;
                this.events[eventName].forEach((eventFunction) => {
                    eventFunction(data || {});
                });
            },

            addEventListener(eventName, eventFunction) {
                if (!this.events[eventName]) return;
                this.events[eventName].push(eventFunction);
            },

            // 获取着色器菜单列表
            shaderMenu() {
                return Object.keys(this.shaders).length === 0 ? [] :
                    Object.keys(this.shaders);
            },

            // 创建着色器属性数据
            _createAttributedatForShader(shaderName) {
                const shaderDat = this.programs[shaderName];
                if (!shaderDat || !shaderDat.info) return;

                const createArray = (length) => {
                    return Array.apply(null, Array(length)).map(() => 0);
                };

                const activeAttributes = gl.getProgramParameter(shaderDat.info.program, gl.ACTIVE_ATTRIBUTES);
                const bufferInitilizer = {};
                const dataInitilizer = {};

                for (let attribID = 0; attribID < activeAttributes; attribID++) {
                    const attribDat = gl.getActiveAttrib(shaderDat.info.program, attribID);
                    const declaration = {
                        type: "unknown",
                        data: [],
                        unitSize: 1
                    };
                    const name = attribDat.name.replaceAll(/\[\d*\]/g, "");

                    switch (attribDat.type) {
                        case gl.FLOAT:
                            declaration.type = "float";
                            break;
                        case gl.FLOAT_VEC2:
                            declaration.type = "vec2";
                            declaration.unitSize = 2;
                            break;
                        case gl.FLOAT_VEC3:
                            declaration.type = "vec3";
                            declaration.unitSize = 3;
                            break;
                        case gl.FLOAT_VEC4:
                            declaration.type = "vec4";
                            declaration.unitSize = 4;
                            break;
                    }

                    declaration.data = createArray(declaration.unitSize * 3);
                    dataInitilizer[name] = new Float32Array(TRIANGLES_PER_BUFFER * declaration.unitSize * 3);
                    bufferInitilizer[name] = {
                        numComponents: declaration.unitSize,
                        data: new Float32Array(TRIANGLES_PER_BUFFER * declaration.unitSize * 3)
                    };
                    this.programs[shaderName].attribDat[name] = declaration;
                }

                this.programs[shaderName].data = dataInitilizer;
                this.programs[shaderName].buffer = twgl.createBufferInfoFromArrays(gl, bufferInitilizer);

                // Uniform 解析
                const activeUniforms = gl.getProgramParameter(shaderDat.info.program, gl.ACTIVE_UNIFORMS);
                for (let uniformID = 0; uniformID < activeUniforms; uniformID++) {
                    const uniformDef = gl.getActiveUniform(shaderDat.info.program, uniformID);
                    const declaration = {
                        type: "unknown",
                        isArray: false,
                        arrayLength: 0,
                        arrayData: [],
                        unitSize: 1
                    };
                    const name = uniformDef.name.replaceAll(/\[\d*\]/g, "");

                    switch (uniformDef.type) {
                        case gl.FLOAT:
                            declaration.type = "float";
                            break;
                        case gl.INT:
                            declaration.type = "int";
                            break;
                        case gl.FLOAT_VEC2:
                            declaration.type = "vec2";
                            declaration.unitSize = 2;
                            break;
                        case gl.FLOAT_VEC3:
                            declaration.type = "vec3";
                            declaration.unitSize = 3;
                            break;
                        case gl.FLOAT_VEC4:
                            declaration.type = "vec4";
                            declaration.unitSize = 4;
                            break;
                        case gl.FLOAT_MAT2:
                            declaration.type = "mat2";
                            declaration.unitSize = 4;
                            break;
                        case gl.FLOAT_MAT3:
                            declaration.type = "mat3";
                            declaration.unitSize = 9;
                            break;
                        case gl.FLOAT_MAT4:
                            declaration.type = "mat4";
                            declaration.unitSize = 16;
                            break;
                        case gl.SAMPLER_2D:
                            declaration.type = "sampler2D";
                            break;
                        case gl.SAMPLER_3D:
                            declaration.type = "sampler3D";
                            break;
                        case gl.SAMPLER_CUBE:
                            declaration.type = "samplerCube";
                            break;
                    }

                    if (uniformDef.name.includes("[")) {
                        declaration.isArray = true;
                        declaration.arrayLength = uniformDef.size;
                        declaration.arrayData = createArray(declaration.arrayLength * declaration.unitSize);
                    }

                    this.programs[shaderName].uniformDec[name] = declaration;
                    if (declaration.isArray) {
                        this.programs[shaderName].uniformDat[name] = this.programs[shaderName].uniformDec[name].arrayData;
                    }
                }
            },

            // 解析项目中已保存的着色器
            _parseProjectShaders() {
                Object.keys(this.shaders).forEach((shaderKey) => {
                    let shader = this.shaders[shaderKey];
                    if (shader.projectData.vertShader.includes("#version 300 es") && (!isWebGL2)) return;

                    this.programs[shaderKey] = {
                        info: twgl.createProgramInfo(gl, [
                            shader.projectData.vertShader,
                            shader.projectData.fragShader,
                        ]),
                        uniformDat: {},
                        uniformDec: {},
                        attribDat: {},
                    };

                    this._createAttributedatForShader(shaderKey);
                });
            },

            // 定位纹理对象
            _locateTextureObject(name, util) {
                const curTarget = util.target;
                let currentTexture = null;

                const costIndex = curTarget.getCostumeIndexByName(Scratch.Cast.toString(name));
                if (costIndex >= 0) {
                    const curCostume = curTarget.sprite.costumes[costIndex];
                    currentTexture = renderer._allSkins[curCostume.skinId]?._texture;
                    if (!currentTexture) currentTexture = renderer._allSkins[curCostume.skinId]?.getTexture();
                }

                if (currentTexture) {
                    gl.bindTexture(gl.TEXTURE_2D, currentTexture);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.currentFilter);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.currentFilter);
                }

                return currentTexture;
            },

            savingData: {
                projectData: undefined,
                fragShader: undefined,
                vertShader: undefined,
            },
        };
    let reRenderInfo = twgl.createBufferInfoFromArrays(gl, {
        a_position: {
            numComponents: 4,
            data: [
                -1, -1, 0, 1,
                1, -1, 0, 1,
                1, 1, 0, 1,
                -1, -1, 0, 1,
                1, 1, 0, 1,
                -1, 1, 0, 1
            ]
        },
        a_texCoord: {
            numComponents: 2,
            data: [
                0, 1,
                1, 1,
                1, 0,
                0, 1,
                1, 0,
                0, 0
            ]
        },
        a_color: {
            numComponents: 4,
            data: [
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1
            ]
        }
    });
    const stageBufferAttachments = [{
            format: gl.RGBA,
            type: gl.UNSIGNED_BYTE,
            min: gl.LINEAR,
            wrap: gl.CLAMP_TO_EDGE,
            premultiplyAlpha: true,
        },
        {
            format: gl.DEPTH_STENCIL
        },
    ];
    const stageBuffer = [
        twgl.createFramebufferInfo(gl, stageBufferAttachments),
        twgl.createFramebufferInfo(gl, stageBufferAttachments)
    ];
    let oldDraw = renderer.draw;
    let oldDrawThese = renderer._drawThese;
    let currentFrameBuffer = null,
        currentShader = null,
        parentExtension = null;
    let shouldBeDirty = false,
        multiRender = false,
        performanceMode = false,
        applyScratchEffects = true;
    let spriteDirection = null,
        spriteShaders = {},
        recompiledShaders = {},
        skins = {},
        textures = {};
    let renderShadersList = [],
        renderSpriteShadersList = {};

    let bufferInfo = {},
        uniformOverrides = {},
        modificationTarget = null;
    let customDrawOrder = null;
    let syncIndex = 0;
    let customDrawOrderEnabled = false;
    let layerZMap = {};
    let shaderTextureBindings = {};
    const BUILTIN_SPLOOKS_SHADER = "____SHADED_BUILTIN_SPLOOKS____";

    // ========== 外观着色器的片元着色器 ==========
    const splooksFragmentShader = `
precision mediump float;

uniform sampler2D u_skin;
uniform sampler2D u_maskTextureSP;
uniform float u_shouldMaskSP;

#define MAX_REPLACERS 15
#define MAX_LIGHTS 8

uniform vec3 u_replaceColorFromSP[MAX_REPLACERS];
uniform vec4 u_replaceColorToSP[MAX_REPLACERS];
uniform float u_replaceThresholdSP[MAX_REPLACERS];
uniform int u_numReplacersSP;

uniform vec4 u_tintColorSP;
uniform float u_saturateSP;
uniform float u_opaqueSP;
uniform float u_contrastSP;
uniform float u_posterizeSP;
uniform float u_sepiaSP;
uniform float u_bloomSP;
uniform float u_brightnessSP;
uniform float u_greenScreenEnabledSP;
uniform vec3 u_greenScreenColorSP;
uniform float u_greenScreenStrengthSP;

uniform int u_numLightsSP;
uniform vec2 u_lightPositionsSP[MAX_LIGHTS];
uniform vec4 u_lightColorsSP[MAX_LIGHTS];
uniform float u_lightRangesXSP[MAX_LIGHTS];
uniform float u_lightRangesYSP[MAX_LIGHTS];
uniform float u_lightIntensitiesSP[MAX_LIGHTS];
uniform vec3 u_lightAttenuationsSP[MAX_LIGHTS];
uniform int u_lightModesSP[MAX_LIGHTS];
uniform float u_brightnessToAlphaSP;
uniform float u_brightnessToAlphaStrengthSP;

uniform float u_circleMaskEnabledSP;
uniform vec2 u_circleMaskCenterSP;
uniform vec2 u_circleMaskSizeSP;
uniform float u_circleMaskFeatherSP;

uniform float u_lightBeamEnabledSP;
uniform vec2 u_lightBeamOriginSP;
uniform vec4 u_lightBeamParamsSP;
uniform vec4 u_lightBeamColorSP;
uniform int u_lightBeamModeSP;

// 九宫格拉伸
uniform float u_nineSliceEnabledSP;
uniform float u_nineSliceLeftSP;
uniform float u_nineSliceRightSP;
uniform float u_nineSliceTopSP;
uniform float u_nineSliceBottomSP;
uniform float u_nineSliceTargetWidthSP;
uniform float u_nineSliceTargetHeightSP;
uniform float u_nineSliceBaseSP;
// 波浪扭曲
uniform float u_waveEnabledSP;
uniform float u_waveXAmplitudeSP;
uniform float u_waveXFrequencySP;
uniform float u_waveXTimeSP;
uniform float u_waveYAmplitudeSP;
uniform float u_waveYFrequencySP;
uniform float u_waveYTimeSP;

varying vec2 v_texCoord;
varying vec4 v_color;

uniform float u_waveScaleXSP;
uniform float u_waveScaleYSP;
// 置换贴图
uniform sampler2D u_displacementTextureSP;
uniform float u_displacementEnabledSP;
uniform float u_displacementXSP;
uniform float u_displacementYSP;
uniform float u_displacementModeSP;
uniform float u_displacementIntensitySP;
const float epsilon = 1e-3;

vec3 spRGB2HSV(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 spHSV2RGB(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 uv = v_texCoord;

    // ========== 九宫格拉伸 ==========
    if (u_nineSliceEnabledSP > 0.5) {
    float left = u_nineSliceLeftSP;
    float right = u_nineSliceRightSP;
    float top = u_nineSliceTopSP;
    float bottom = u_nineSliceBottomSP;
    float targetW = u_nineSliceTargetWidthSP;
    float targetH = u_nineSliceTargetHeightSP;
    float baseSize = u_nineSliceBaseSP;

    float l = left / baseSize;
    float r = 1.0 - right / baseSize;
    float t = 1.0 - top / baseSize;
    float b = bottom / baseSize;

    float tl = left / targetW;
    float tr = 1.0 - right / targetW;
    float tt = 1.0 - top / targetH;
    float tb = bottom / targetH;

        if (uv.x < tl) {
            uv.x = uv.x * (l / tl);
        } else if (uv.x > tr) {
            uv.x = 1.0 - (1.0 - uv.x) * ((1.0 - r) / (1.0 - tr));
        } else {
            uv.x = l + (uv.x - tl) / (tr - tl) * (r - l);
        }

        if (uv.y < tb) {
            uv.y = uv.y * (b / tb);
        } else if (uv.y > tt) {
            uv.y = 1.0 - (1.0 - uv.y) * ((1.0 - t) / (1.0 - tt));
        } else {
            uv.y = b + (uv.y - tb) / (tt - tb) * (t - b);
        }
    }

// ========== 波浪扭曲 ==========
if (u_waveEnabledSP > 0.5) {
    float scaleX = max(u_waveScaleXSP, 0.01);
    float scaleY = max(u_waveScaleYSP, 0.01);
    
    // 先把 uv 映射到缩小的空间（缩小纹理显示范围）
    float su = (uv.x - 0.5) / scaleX + 0.5;
    float sv = (uv.y - 0.5) / scaleY + 0.5;
    
    // 在缩小后的空间做波浪
    float waveX = u_waveXAmplitudeSP / 200.0 * sin(sv * u_waveXFrequencySP * 6.28318 + u_waveXTimeSP);
    float waveY = u_waveYAmplitudeSP / 200.0 * sin(su * u_waveYFrequencySP * 6.28318 + u_waveYTimeSP);
    
    uv.x += waveX;
    uv.y += waveY;
    
    // 映射回原始空间
    uv.x = (uv.x - 0.5) * scaleX + 0.5;
    uv.y = (uv.y - 0.5) * scaleY + 0.5;
}

// ========== 置换贴图 ==========
vec4 texColor;
if (u_displacementEnabledSP > 0.5) {
    float depth = texture2D(u_displacementTextureSP, uv).r;
    if (u_displacementModeSP > 0.5) depth = 1.0 - depth;
    
    float strength = u_displacementIntensitySP / 100.0 * 0.03;
    float offsetX = (depth - 0.5) * 2.0 * (u_displacementXSP / 100.0) * strength;
    float offsetY = (depth - 0.5) * 2.0 * (u_displacementYSP / 100.0) * strength;
    
    vec2 displacedUV = uv + vec2(offsetX, offsetY);
    displacedUV = clamp(displacedUV, 0.0, 1.0);
    
    texColor = texture2D(u_skin, displacedUV);
} else {
    texColor = texture2D(u_skin, uv);
}
    vec3 finalColor = texColor.rgb;
    float finalAlpha = texColor.a;

    // 遮罩处理
    if (u_shouldMaskSP > 0.5 && finalAlpha > 0.0) {
        vec4 maskColor = texture2D(u_maskTextureSP, uv);
        finalAlpha *= maskColor.a;
    }

    // 绿幕抠图
    if (u_greenScreenEnabledSP > 0.5) {
        vec3 keyColor = u_greenScreenColorSP;
        float strength = u_greenScreenStrengthSP;
        vec3 hsv1 = spRGB2HSV(finalColor);
        vec3 hsv2 = spRGB2HSV(keyColor);
        float hueDiff = abs(hsv1.x - hsv2.x);
        if (hueDiff > 0.5) hueDiff = 1.0 - hueDiff;
        float satDiff = abs(hsv1.y - hsv2.y);
        float valDiff = abs(hsv1.z - hsv2.z);
        float totalDiff = hueDiff * 0.7 + satDiff * 0.2 + valDiff * 0.1;
        float threshold = strength * 0.7;
        float feather = strength * 0.2;
        float mask = 0.0;
        if (totalDiff < threshold - feather) {
            mask = 1.0;
        } else if (totalDiff < threshold + feather) {
            float t = (totalDiff - (threshold - feather)) / (feather * 2.0);
            mask = 1.0 - t;
        }
        if (mask > 0.0) {
            float spill = max(0.0, finalColor.g - max(finalColor.r, finalColor.b));
            if (spill > 0.1 && mask > 0.5) {
                finalColor.g *= (1.0 - spill * mask);
            }
            finalAlpha *= (1.0 - mask);
        }
    }

    // 颜色替换
    if (u_numReplacersSP > 0) {
        for (int i = 0; i < MAX_REPLACERS; i++) {
            if (i >= u_numReplacersSP) break;
            float dist = distance(finalColor, u_replaceColorFromSP[i]);
            if (dist <= u_replaceThresholdSP[i]) {
                float strength = 1.0 - (dist / (u_replaceThresholdSP[i] + 1.0));
                finalColor = mix(finalColor, u_replaceColorToSP[i].rgb, strength);
                if (u_replaceColorToSP[i].a < 1.0 && strength > 0.01) {
                    finalAlpha = clamp(mix(finalAlpha, u_replaceColorToSP[i].a, strength), 0.0, 1.0);
                }
            }
        }
    }

    // 亮度
    if (u_brightnessSP != 1.0) {
        if (u_brightnessSP > 1.0) {
            finalColor = finalColor + (vec3(1.0) - finalColor) * (u_brightnessSP - 1.0);
        } else {
            finalColor = finalColor * u_brightnessSP;
        }
        finalColor = clamp(finalColor, 0.0, 1.0);
    }

    // 饱和度
    if (u_saturateSP > 1.0 || u_saturateSP < 1.0) {
        vec3 hsv = spRGB2HSV(finalColor);
        if (u_saturateSP < 0.0) {
            hsv.x = mod(hsv.x + 0.5, 1.0);
            hsv.y *= -u_saturateSP;
        } else {
            hsv.y *= u_saturateSP;
        }
        finalColor = spHSV2RGB(hsv);
    }

    // 对比度
    finalColor = (finalColor - 0.5) * u_contrastSP + 0.5;

    // 色调分离
    if (u_posterizeSP > 0.0) finalColor = floor(finalColor * u_posterizeSP) / u_posterizeSP;

    // 老照片
    if (u_sepiaSP > 0.0) {
        vec3 sepiaColor = vec3(
            dot(finalColor, vec3(0.393, 0.769, 0.189)),
            dot(finalColor, vec3(0.349, 0.686, 0.168)),
            dot(finalColor, vec3(0.272, 0.534, 0.131))
        );
        finalColor = mix(finalColor, sepiaColor, u_sepiaSP);
    }

    // 泛光
    if (u_bloomSP > 0.0) {
        vec3 bloom = max(finalColor - 0.4, 0.0);
        bloom += texture2D(u_skin, uv + vec2( 0.001,  0.001)).rgb;
        bloom += texture2D(u_skin, uv + vec2(-0.001,  0.001)).rgb;
        bloom += texture2D(u_skin, uv + vec2( 0.001, -0.001)).rgb;
        bloom += texture2D(u_skin, uv + vec2(-0.001, -0.001)).rgb;
        bloom *= 0.25;
        finalColor += bloom * u_bloomSP;
        finalColor = clamp(finalColor, 0.0, 1.0);
    }

    // 光源
    vec3 lightedColor = finalColor;
    if (u_numLightsSP > 0) {
        vec2 fragPos = uv;
        for (int i = 0; i < MAX_LIGHTS; i++) {
            if (i >= u_numLightsSP) break;
            vec2 lightPos = u_lightPositionsSP[i];
            vec2 diff = fragPos - lightPos;
            float adjustedX = diff.x / max(u_lightRangesXSP[i], 0.001);
            float adjustedY = diff.y / max(u_lightRangesYSP[i], 0.001);
            float distance = length(vec2(adjustedX, adjustedY));
            if (distance <= 1.0) {
                float falloff = u_lightIntensitiesSP[i] / 100.0;
                float startGradient = 0.5 * (1.0 - falloff);
                float attenuation;
                if (distance < startGradient) {
                    attenuation = 1.0;
                } else {
                    float gradientRange = 1.0 - startGradient;
                    float t = (distance - startGradient) / gradientRange;
                    attenuation = 1.0 - t;
                }
                attenuation = max(0.0, attenuation);
                vec4 lightColor = u_lightColorsSP[i];
                float lightIntensity = attenuation * lightColor.a;
                vec3 lightEffect = lightColor.rgb * lightIntensity;
                int mode = u_lightModesSP[i];
                if (mode == 0) {
                    lightedColor = mix(lightedColor, lightEffect, 0.5);
                } else if (mode == 1) {
                    lightedColor = lightedColor + lightEffect;
                } else if (mode == 2) {
                    lightedColor = lightedColor - lightEffect;
                } else if (mode == 3) {
                    lightedColor = mix(lightedColor, lightEffect, lightIntensity);
                } else if (mode == 4) {
                    lightedColor = mix(lightedColor, lightEffect, 0.2);
                }
            }
        }
        lightedColor = clamp(lightedColor, 0.0, 1.0);
    }

    // 亮度转透明度
    if (u_brightnessToAlphaSP > 0.5) {
        float brightness = dot(lightedColor, vec3(0.299, 0.587, 0.114));
        float alphaFactor = brightness * u_brightnessToAlphaStrengthSP;
        finalAlpha *= (1.0 - alphaFactor);
    }

    // 圆形蒙版
    if (u_circleMaskEnabledSP > 0.5) {
        vec2 center = u_circleMaskCenterSP;
        vec2 size = u_circleMaskSizeSP;
        vec2 distVec = (uv - center) / max(size, 0.001);
        float dist = length(distVec);
        float feather = max(0.001, u_circleMaskFeatherSP);
        float alphaMask;
        if (dist <= 1.0 - feather) {
            alphaMask = 1.0;
        } else if (dist >= 1.0) {
            alphaMask = 0.0;
        } else {
            float t = (dist - (1.0 - feather)) / feather;
            alphaMask = 1.0 - t;
        }
        finalAlpha *= alphaMask;
    }

    // 光线扫描
    if (u_lightBeamEnabledSP > 0.5) {
        vec2 fragPos = uv;
        vec2 beamOrigin = u_lightBeamOriginSP;
        float beamWidth = u_lightBeamParamsSP.x;
        float beamAngle = u_lightBeamParamsSP.y;
        float beamLength = u_lightBeamParamsSP.z;
        float beamFalloff = u_lightBeamParamsSP.w;
        vec4 beamColor = u_lightBeamColorSP;
        float beamIntensity = beamColor.a;
        vec2 direction = vec2(cos(beamAngle), sin(beamAngle));
        vec2 perp = vec2(-direction.y, direction.x);
        vec2 toFrag = fragPos - beamOrigin;
        float projDist = dot(toFrag, direction);
        float perpDist = abs(dot(toFrag, perp));
        float halfLength = beamLength / 2.0;
        if (abs(projDist) <= halfLength && perpDist <= beamWidth) {
            float attenuation = 1.0;
            if (beamFalloff > 0.0) {
                float distFromCenter = abs(projDist) / halfLength;
                float lengthFactor = 1.0 - pow(distFromCenter, beamFalloff);
                attenuation *= lengthFactor;
            }
            float widthFactor = 1.0 - pow(perpDist / max(beamWidth, 0.001), 1.5);
            attenuation *= widthFactor;
            float mixStrength = clamp(attenuation * beamIntensity, 0.0, 1.0);
            vec3 lightEffect = beamColor.rgb;
            int mode = u_lightBeamModeSP;
            if (mode == 0) {
                lightedColor = mix(lightedColor, lightEffect, mixStrength);
            } else if (mode == 1) {
                lightedColor = lightedColor + lightEffect * mixStrength;
            } else if (mode == 2) {
                lightedColor = lightedColor - lightEffect * mixStrength;
            } else if (mode == 3) {
                lightedColor = mix(lightedColor, lightEffect, mixStrength);
            } else if (mode == 4) {
                lightedColor = mix(lightedColor, lightEffect, mixStrength * 0.5);
            }
            lightedColor = clamp(lightedColor, 0.0, 1.0);
        }
    }

    // 色调
    gl_FragColor.rgb = lightedColor * u_tintColorSP.rgb;
    float baseAlpha = finalAlpha;
    if (baseAlpha > 0.0 && baseAlpha < 1.0) baseAlpha = mix(baseAlpha, 1.0, u_opaqueSP);
    gl_FragColor.a = baseAlpha;

    // 预乘 alpha
    gl_FragColor.rgb *= gl_FragColor.a;
}
`;

    // ========== 外观着色器的顶点着色器（支持四点扭曲） ==========
    const splooksVertexShader = `
attribute vec4 a_position;
attribute vec4 a_color;
attribute vec2 a_texCoord;
varying vec4 v_color;
varying vec2 v_texCoord;

uniform highp mat4 u_projectionMatrix;
uniform highp mat4 u_modelMatrix;
uniform vec2 u_warpSP[4];

void main() {
    vec2 positionSP = a_position.xy;
    v_texCoord = a_texCoord;
    v_color = a_color;

    // 四点扭曲
    float u = v_texCoord.x;
    float v = v_texCoord.y;

    vec2 warpedPos = 
        (1.0 - u) * (1.0 - v) * u_warpSP[0] + u * (1.0 - v) * u_warpSP[1] +
        u * v * u_warpSP[2] + (1.0 - u) * v * u_warpSP[3];

    float w = (1.0 - u) * (1.0 - v) + u * (1.0 - v) + u * v + (1.0 - u) * v;

    positionSP = warpedPos / max(w, 1e-5);
    gl_Position = u_projectionMatrix * u_modelMatrix * vec4(positionSP, 0, 1);
}
`;
    const BlendModes = {
        // === 基础混合 ===
        "default": [gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD],
        "default behind": [gl.ONE_MINUS_DST_ALPHA, gl.ONE, gl.ONE_MINUS_DST_ALPHA, gl.ONE, gl.FUNC_ADD],

        // === 加减法 ===
        "additive": [gl.ONE, gl.ONE, gl.ZERO, gl.ONE, gl.FUNC_ADD],
        "additive with alpha": [gl.ONE, gl.ONE, gl.ONE, gl.ONE, gl.FUNC_ADD],
        "subtract": [gl.ONE, gl.ONE, gl.ZERO, gl.ONE, gl.FUNC_REVERSE_SUBTRACT],
        "subtract with alpha": [gl.ONE, gl.ONE, gl.ONE, gl.ONE, gl.FUNC_REVERSE_SUBTRACT],
        "subtractive": [gl.ONE, gl.ONE, gl.ZERO, gl.ONE, gl.FUNC_REVERSE_SUBTRACT],

        // === 乘法类 ===
        "multiply": [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD],

        // === 反色 ===
        "invert": [gl.ONE_MINUS_DST_COLOR, gl.ONE_MINUS_SRC_COLOR, gl.ZERO, gl.ONE, gl.FUNC_ADD],

        // === 遮罩/擦除 ===
        "mask": [gl.ZERO, gl.SRC_ALPHA, gl.ZERO, gl.SRC_ALPHA, gl.FUNC_ADD],
        "erase": [gl.ZERO, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD],

        // === Photoshop 风格混合（利用预乘）===
        // 亮度叠加：图层B的亮度影响图层A
        "luma_overlay": [gl.SRC_ALPHA, gl.ONE, gl.SRC_ALPHA, gl.ONE, gl.FUNC_ADD],

        // 软光：类似 Photoshop Soft Light
        "soft_light": [gl.DST_COLOR, gl.ONE, gl.DST_ALPHA, gl.ONE, gl.FUNC_ADD],

        // 强光：类似 Photoshop Hard Light
        "hard_light": [gl.SRC_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD],

        // 颜色加深：用亮度压暗颜色
        "color_burn": [gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.FUNC_ADD],

        // 线性减淡：提亮
        "linear_dodge": [gl.ONE, gl.ONE, gl.ZERO, gl.ONE, gl.FUNC_ADD],

        // 颜色叠加：用图层B的颜色覆盖图层A
        "color_overlay": [gl.SRC_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD],

        // 饱和度增强：图层B的亮度增强图层A的饱和度（近似）
        "saturation_enhance": [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD],

        // 预乘 Alpha 标准混合
        "premultiplied": [gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD],
    };

    let clipBoxes = {};
    let protectedDrawables = {};
    let isPenBufferActive = false;

    const originalBindFramebuffer = gl.bindFramebuffer;
    gl.bindFramebuffer = function(target, framebuffer) {
        if (target === gl.FRAMEBUFFER) {
            if (renderer._penSkinId !== null) {
                const penSkin = renderer._allSkins[renderer._penSkinId];
                if (penSkin && penSkin._framebuffer && framebuffer === penSkin._framebuffer.framebuffer) {
                    isPenBufferActive = true;
                } else {
                    isPenBufferActive = false;
                }
            } else {
                isPenBufferActive = false;
            }
        }
        originalBindFramebuffer.call(this, target, framebuffer);
    };

    function compileShaderForSprite(shader) {
        if (shaderfile && shader != "____PEN_PLUS__NO__SHADER____") {
            console.log(`Shaded : converting shader ${shader} to sprite format!`);
            const event = shaderfile.shaders[shader].projectData;
            let convertedVertex = event.vertShader;
            let convertedFragment = event.fragShader;
            const screenShaders = [
                "____SCREEN_CHROMATIC____",
                "____SCREEN_GLITCH____",
                "____SCREEN_SPLIT____",
                "____SCREEN_WATER____",
                "____SCREEN_LENS____",
                "____SCREEN_ANGEL____",
                "____SCREEN_TRANSFORM____",
                "____SCREEN_3DPLANE____",
                "____SCREEN_CROP____",
                "____SCREEN_XYWAVE____",
                "____SCREEN_DROPLET____",
                "____SCREEN_CUBE____",
                "____SCREEN_TV____",
                "____SCREEN_WATER_RIPPLE____",
                "____SCREEN_WATER_REAL____"
            ];
            if (screenShaders.includes(shader)) {
                const event = shaderfile.shaders[shader].projectData;

                if (recompiledShaders[shader] && recompiledShaders[shader].program) {
                    gl.deleteProgram(recompiledShaders[shader].program);
                }

                const vertShader = event.vertShader || defaultVertexShader300;
                const fragShader = event.fragShader;

                recompiledShaders[shader] = twgl.createProgramInfo(gl, [vertShader, fragShader]);

                if (shaderfile.programs[shader]) {
                    shaderfile.programs[shader].info = recompiledShaders[shader];

                    if (!shaderfile.programs[shader].uniformDat || Object.keys(shaderfile.programs[shader].uniformDat).length === 0) {
                        const shaderData = shaderfile.shaders[shader];
                        if (shaderData && shaderData.uniforms) {
                            shaderfile.programs[shader].uniformDat = {
                                ...shaderData.uniforms
                            };
                        }
                    }
                }

                console.log(`✅ 屏幕着色器编译完成: ${shader}`, recompiledShaders[shader]);
                return;
            }
            // ===== SPlooks 着色器特殊处理 =====
            if (shader === BUILTIN_SPLOOKS_SHADER) {
                // 顶点着色器保持原样（它已经包含 u_projectionMatrix 和 u_modelMatrix）
                let vert = event.vertShader;
                let frag = event.fragShader;

                // 不需要对 vert 做任何替换！

                // 修改片元着色器：
                // 1. 在 "vec2 uv = v_texCoord;" 之后注入 UV 效果
                frag = frag.replace(
                    /vec2\s+uv\s*=\s*v_texCoord\s*;/,
                    'vec2 uv = v_texCoord;\n  uv = scratch3_apply_UV_Effects(uv);'
                );

                // 2. 在 gl_FragColor 预乘 alpha 之后注入颜色效果
                frag = frag.replace(
                    /gl_FragColor\.rgb\s*\*=\s*gl_FragColor\.a\s*;/,
                    'gl_FragColor.rgb *= gl_FragColor.a;\n  gl_FragColor = scratch3_apply_color_Effects(gl_FragColor);'
                );

                // 3. 注入 scratchEffectsShaderPrefix
                if (frag.includes("#version 300 es")) {
                    frag = "#version 300 es\n" + scratchEffectsShaderPrefix + frag.replace("#version 300 es", "");
                } else {
                    frag = scratchEffectsShaderPrefix + frag;
                }

                if (recompiledShaders[shader] && recompiledShaders[shader].program) {
                    gl.deleteProgram(recompiledShaders[shader].program);
                }
                recompiledShaders[shader] = twgl.createProgramInfo(gl, [vert, frag]);
                console.log('SPlooks shader compiled with Scratch effects:', recompiledShaders[shader]);
                return;
            }

            // ========== 自动注入屏幕UV ==========
            if (convertedFragment.includes('v_screenUV')) {
                if (convertedVertex.includes("#version 300 es")) {
                    convertedVertex = convertedVertex.replace(
                        'out highp vec2 v_texCoord;',
                        'out highp vec2 v_texCoord;\nout highp vec2 v_screenUV;'
                    );
                    convertedVertex = convertedVertex.replace(
                        'v_texCoord = a_texCoord;',
                        'v_texCoord = a_texCoord;\n  vec4 worldPos = u_projectionMatrix * u_modelMatrix * vec4(a_position, 0, 1);\n  v_screenUV = worldPos.xy * 0.5 + 0.5;'
                    );
                } else {
                    convertedVertex = convertedVertex.replace(
                        'varying highp vec2 v_texCoord;',
                        'varying highp vec2 v_texCoord;\nvarying highp vec2 v_screenUV;'
                    );
                    convertedVertex = convertedVertex.replace(
                        'v_texCoord = a_texCoord;',
                        'v_texCoord = a_texCoord;\n  vec4 worldPos = u_projectionMatrix * u_modelMatrix * vec4(a_position, 0, 1);\n  v_screenUV = worldPos.xy * 0.5 + 0.5;'
                    );
                }
            }

            // ========== 原有顶点着色器修改 ==========
            convertedVertex = convertedVertex.replaceAll(GL_POS_FINDER, "gl_Position = u_projectionMatrix * u_modelMatrix * vec4(a_position,0,1);");
            convertedVertex = convertedVertex.replaceAll(GL_POS_VAR, "vec2 a_position;");
            if (convertedVertex.includes("#version 300 es")) {
                convertedVertex = "#version 300 es\nuniform highp mat4 u_projectionMatrix; uniform highp mat4 u_modelMatrix;\n" + convertedVertex.replace("#version 300 es", "");
            } else {
                convertedVertex = "uniform highp mat4 u_projectionMatrix; uniform highp mat4 u_modelMatrix;\n" + convertedVertex;
            }

            // ========== 原有片元着色器修改 ==========
            convertedFragment = convertedFragment.replaceAll("v_texCoord", "scratch3_uv_replacement");
            convertedFragment = convertedFragment.replace(/varying[^;]*?vec2 scratch3_uv_replacement;/g, "varying highp vec2 v_texCoord;");
            convertedFragment = convertedFragment.replace(/in[^;]*?vec2 scratch3_uv_replacement;/g, "in highp vec2 v_texCoord;");
            convertedFragment = convertedFragment.replace(/uniform[^;]*?vec2 u_skinSize;/g, "");
            convertedFragment = convertedFragment.replace(/^(\s*)(\bgl_FragColor\b.*?;)/gm, `$&\n$1${"gl_FragColor = scratch3_apply_color_Effects(gl_FragColor);"}`);
            convertedFragment = convertedFragment.replace(/^(\s*)(\bfragColor\b.*?;)/gm, `$&\n$1${"fragColor = scratch3_apply_color_Effects(fragColor);"}`);
            if (convertedFragment.includes("v_texCoord")) convertedFragment = convertedFragment.replace(/void main\(\)\s*\{/, '$&\n  scratch3_uv_replacement = scratch3_apply_UV_Effects(v_texCoord);\n');
            if (convertedFragment.includes("#version 300 es")) {
                convertedFragment = "#version 300 es\n" + scratchEffectsShaderPrefix + convertedFragment.replace("#version 300 es", "");
            } else {
                convertedFragment = scratchEffectsShaderPrefix + convertedFragment;
            }
            if (recompiledShaders[shader] && recompiledShaders[shader].program) gl.deleteProgram(recompiledShaders[shader].program);
            recompiledShaders[shader] = twgl.createProgramInfo(gl, [
                convertedVertex,
                applyScratchEffects ? convertedFragment : event.fragShader
            ]);
            console.log(recompiledShaders[shader]);
        }
    }

    function initBuiltinSplooksShader() {
        // 先删除旧的
        if (shaderfile.shaders[BUILTIN_SPLOOKS_SHADER]) {
            delete shaderfile.shaders[BUILTIN_SPLOOKS_SHADER];
            delete shaderfile.programs[BUILTIN_SPLOOKS_SHADER];
            delete recompiledShaders[BUILTIN_SPLOOKS_SHADER];
        }

        shaderfile.saveShader(BUILTIN_SPLOOKS_SHADER, {
            projectData: {
                blockDat: {},
                dynamicDat: {
                    dynamic_variables: [],
                    dynamic_myblocks: []
                },
                glsl: "// Built-in SPlooks shader",
                isText: true
            },
            vertShader: splooksVertexShader,
            fragShader: splooksFragmentShader
        });

        const prog = shaderfile.programs[BUILTIN_SPLOOKS_SHADER];
        if (prog && prog.uniformDat) {
            prog.uniformDat.u_tintColorSP = [1, 1, 1, 1];
            prog.uniformDat.u_warpSP = [0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5];
            prog.uniformDat.u_saturateSP = 1;
            prog.uniformDat.u_opaqueSP = 0;
            prog.uniformDat.u_contrastSP = 1;
            prog.uniformDat.u_posterizeSP = 0;
            prog.uniformDat.u_sepiaSP = 0;
            prog.uniformDat.u_bloomSP = 0;
            prog.uniformDat.u_brightnessSP = 1;
            prog.uniformDat.u_numReplacersSP = 0;
            prog.uniformDat.u_shouldMaskSP = 0;
            prog.uniformDat.u_greenScreenEnabledSP = 0;
            prog.uniformDat.u_greenScreenColorSP = [0, 1, 0];
            prog.uniformDat.u_greenScreenStrengthSP = 0.2;
            prog.uniformDat.u_numLightsSP = 0;
            prog.uniformDat.u_brightnessToAlphaSP = 0;
            prog.uniformDat.u_brightnessToAlphaStrengthSP = 1.0;
            prog.uniformDat.u_circleMaskEnabledSP = 0;
            prog.uniformDat.u_circleMaskCenterSP = [0.5, 0.5];
            prog.uniformDat.u_circleMaskSizeSP = [0.5, 0.5];
            prog.uniformDat.u_circleMaskFeatherSP = 0.05;
            prog.uniformDat.u_lightBeamEnabledSP = 0;
            prog.uniformDat.u_lightBeamOriginSP = [0.5, 0.5];
            prog.uniformDat.u_lightBeamParamsSP = [0.1, 0, 0.5, 1.0];
            prog.uniformDat.u_lightBeamColorSP = [1, 1, 1, 0.5];
            prog.uniformDat.u_lightBeamModeSP = 0;
        }

        compileShaderForSprite(BUILTIN_SPLOOKS_SHADER);
        console.log('BUILTIN_SPLOOKS_SHADER recompiled:', recompiledShaders[BUILTIN_SPLOOKS_SHADER]);
        console.log('BUILTIN_SPLOOKS_SHADER program:', shaderfile.programs[BUILTIN_SPLOOKS_SHADER]);
    }
    class extension {
        // ============================================================
        // ===== 1. 只存储片元着色器（不设置默认值） =====
        // ============================================================
        initBuiltinScreenShadersOnly() {
            const shaders = {
                "____SCREEN_CHROMATIC____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;
uniform sampler2D u_skin;
uniform float u_redOffsetX;
uniform float u_redOffsetY;
uniform float u_greenOffsetX;
uniform float u_greenOffsetY;
uniform float u_blueOffsetX;
uniform float u_blueOffsetY;

void main() {
    vec2 uv = v_texCoord;
    vec4 original = texture(u_skin, uv);
    float maxA = 0.0;
    for (int i = 0; i < 8; i++) {
        float angle = float(i) * 3.14159 * 2.0 / 8.0;
        vec2 dir = vec2(cos(angle), sin(angle)) * 0.01;
        float a = texture(u_skin, uv + dir).a;
        if (a > maxA) maxA = a;
    }
    if (original.a < 0.01 && maxA < 0.01) {
        fragColor = original;
        return;
    }
    float r = texture(u_skin, uv + vec2(u_redOffsetX, u_redOffsetY)).r;
    float g = texture(u_skin, uv + vec2(u_greenOffsetX, u_greenOffsetY)).g;
    float b = texture(u_skin, uv + vec2(u_blueOffsetX, u_blueOffsetY)).b;
    float a = max(original.a, maxA);
    fragColor = vec4(r, g, b, a);
}`,
                    uniforms: {
                        u_redOffsetX: 0.005,
                        u_redOffsetY: 0,
                        u_greenOffsetX: 0,
                        u_greenOffsetY: 0,
                        u_blueOffsetX: -0.005,
                        u_blueOffsetY: 0
                    }
                },
                "____SCREEN_GLITCH____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;
uniform sampler2D u_skin;
uniform float u_timer;
uniform float u_intensityX;
uniform float u_intensityY;
uniform float u_blockSize;
uniform float u_speed;

float random(float seed) {
    return fract(sin(seed * 127.1 + u_timer * u_speed) * 43758.5453);
}

void main() {
    vec2 uv = v_texCoord;
    float blockX = floor(uv.x / u_blockSize) * u_blockSize;
    float blockY = floor(uv.y / u_blockSize) * u_blockSize;
    float blockSeed = blockX + blockY * 10.0;
    float rand = random(blockSeed);
    float glitchMask = step(0.6, rand);
    float dirX = random(blockSeed + 1.0);
    float dirY = random(blockSeed + 2.0);
    float signX = (dirX > 0.5) ? 1.0 : -1.0;
    float signY = (dirY > 0.5) ? 1.0 : -1.0;
    float offsetX = signX * dirX * u_intensityX * 0.3;
    float offsetY = signY * dirY * u_intensityY * 0.3;
    vec2 glitchUV = uv;
    glitchUV.x += offsetX * glitchMask;
    glitchUV.y += offsetY * glitchMask;
    glitchUV = clamp(glitchUV, 0.0, 1.0);
    fragColor = texture(u_skin, glitchUV);
}`,
                    uniforms: {
                        u_intensityX: 0.05,
                        u_intensityY: 0.05,
                        u_blockSize: 0.05,
                        u_speed: 1.0
                    }
                },
                "____SCREEN_SPLIT____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;
uniform sampler2D u_skin;
uniform float u_stageAspect;
uniform vec3 u_center;
uniform vec2 u_cut;

void main() {
    vec2 uv = v_texCoord;
    float aspect = u_stageAspect;
    float sqrtAspect = sqrt(aspect);
    
    vec2 center = u_center.xy;
    float angle = radians(u_center.z);
    vec2 pos = vec2((uv.x - center.x) * sqrtAspect, (uv.y - center.y));
    vec2 dir = vec2(cos(angle), sin(angle));
    dir = normalize(dir);
    vec2 normal = vec2(-dir.y, dir.x);
    float side = dot(pos, normal);
    float shift = (side < 0.0) ? u_cut.x : u_cut.y;
    vec2 shiftVec = dir * shift;
    shiftVec.x /= sqrtAspect;
    uv = fract(uv + shiftVec);
    fragColor = texture(u_skin, uv);
}`,
                    uniforms: {
                        u_center: [0.5, 0.5, 0],
                        u_cut: [0.1, -0.1],
                        u_stageAspect: 1.778
                    }
                },
                "____SCREEN_WATER____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;
uniform sampler2D u_skin;
uniform float u_waterY;
uniform float u_alpha;
uniform float u_rippleAmp;
uniform float u_rippleDensity;
uniform float u_rippleSpeed;
uniform float u_blur;
uniform float u_timer;
uniform float u_mode;
uniform float u_densityDecay;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}

vec4 blurTexture(sampler2D tex, vec2 uv, float amount) {
    if (amount < 0.001) return texture(tex, uv);
    vec2 offset = vec2(amount * 0.003);
    vec4 sum = texture(tex, uv) * 2.0;
    sum += texture(tex, uv + offset);
    sum += texture(tex, uv - offset);
    sum += texture(tex, uv + vec2(offset.x, -offset.y));
    sum += texture(tex, uv + vec2(-offset.x, offset.y));
    return sum / 6.0;
}

void main() {
    vec2 uv = v_texCoord;
    bool isAboveWater;
    if (u_mode < 0.5) {
        isAboveWater = (uv.y >= u_waterY);
    } else {
        isAboveWater = (uv.y < u_waterY);
    }
    if (isAboveWater) {
        fragColor = texture(u_skin, uv);
        return;
    }
    float t, reflectY;
    if (u_mode < 0.5) {
        t = (u_waterY - uv.y) / u_waterY;
        reflectY = u_waterY + t * (1.0 - u_waterY);
    } else {
        t = (uv.y - u_waterY) / (1.0 - u_waterY);
        reflectY = u_waterY - t * u_waterY;
    }
    vec2 reflectUV = vec2(uv.x, reflectY);
    float waveFactor = 1.0 - t;
    float currentAmp = u_rippleAmp * waveFactor * waveFactor;
    float densityFactor = pow(u_densityDecay, t * 10.0);
    float densityScale = u_rippleDensity * densityFactor;
    float time = u_timer * u_rippleSpeed;
    float n = noise(vec2(uv.x * 5.0 * densityFactor, time * 0.5)) * 2.0 - 1.0;
    reflectUV.x += sin(reflectUV.y * densityScale + time) * currentAmp;
    reflectUV.y += cos(reflectUV.x * densityScale * 0.7 + time * 1.2) * currentAmp * 0.4;
    reflectUV.x += n * currentAmp * 0.3;
    reflectUV.y += noise(vec2(uv.y * 5.0 * densityFactor, time)) * currentAmp * 0.2;
    reflectUV = clamp(reflectUV, 0.0, 1.0);
    vec4 reflectionColor = blurTexture(u_skin, reflectUV, u_blur * waveFactor);
    float alpha = u_alpha * (1.0 - t * 0.3);
    fragColor = vec4(reflectionColor.rgb, alpha);
}`,
                    uniforms: {
                        u_waterY: 0.5,
                        u_alpha: 0.8,
                        u_rippleAmp: 0.02,
                        u_rippleDensity: 30,
                        u_rippleSpeed: 0.5,
                        u_blur: 2,
                        u_mode: 0,
                        u_densityDecay: 0.95
                    }
                },
                "____SCREEN_LENS____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;
uniform sampler2D u_skin;
uniform float u_stageAspect;
uniform float u_strength;

void main() {
    vec2 uv = v_texCoord;
    float aspect = u_stageAspect;
    float sqrtAspect = sqrt(aspect);
    
    vec2 center = vec2(0.5, 0.5);
    vec2 pos = vec2((uv.x - center.x) * sqrtAspect, uv.y - center.y);
    float r = length(pos);
    float newR = r / (1.0 + u_strength * r * 0.8);
    vec2 newPos = pos / (r + 0.001) * newR;
    uv = center + vec2(newPos.x / sqrtAspect, newPos.y);
    uv = clamp(uv, 0.0, 1.0);
    fragColor = texture(u_skin, uv);
}`,
                    uniforms: {
                        u_strength: 0.3,
                        u_stageAspect: 1.778
                    }
                },
                "____SCREEN_ANGEL____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;
uniform sampler2D u_skin;
uniform vec2 u_center;
uniform float u_intensity;
uniform float u_falloff;
uniform float u_alpha;

void main() {
    vec2 uv = v_texCoord;
    vec2 dir = uv - u_center;
    vec4 original = texture(u_skin, uv);
    vec4 glow = vec4(0.0);
    float totalWeight = 0.0;
    for (float i = 0.0; i <= 24.0; i++) {
        float t = i / 24.0;
        float weight = pow(1.0 - t, u_falloff);
        vec2 sampleUV = uv - dir * t * u_intensity;
        sampleUV = clamp(sampleUV, 0.0, 1.0);
        glow += texture(u_skin, sampleUV) * weight;
        totalWeight += weight;
    }
    glow = glow / totalWeight;
    glow.rgb = glow.rgb * u_intensity * 1.5 * u_alpha;
    fragColor = original + vec4(glow.rgb, 0.0);
}`,
                    uniforms: {
                        u_center: [0.5, 0.5],
                        u_intensity: 0.1,
                        u_falloff: 2,
                        u_alpha: 1
                    }
                },
                "____SCREEN_TRANSFORM____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;
uniform sampler2D u_skin;
uniform float u_stageAspect;
uniform float u_offsetX;
uniform float u_offsetY;
uniform float u_angle;
uniform float u_scale;
uniform float u_saturation;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_hue;

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 uv = v_texCoord - 0.5;
    float aspect = u_stageAspect;
    float sqrtAspect = sqrt(aspect);
    
    vec2 pos = vec2(uv.x * sqrtAspect, uv.y);
    pos /= u_scale;
    float rad = radians(u_angle);
    float c = cos(rad);
    float s = sin(rad);
    pos = vec2(pos.x * c - pos.y * s, pos.x * s + pos.y * c);
    pos.x += u_offsetX * sqrtAspect;
    pos.y += u_offsetY;
    pos.x /= sqrtAspect;
    uv = fract(pos + 0.5);
    
    vec4 color = texture(u_skin, uv);
    color.rgb *= u_brightness;
    color.rgb = (color.rgb - 0.5) * u_contrast + 0.5;
    if (u_saturation != 1.0) {
        vec3 hsv = rgb2hsv(color.rgb);
        hsv.y *= u_saturation;
        color.rgb = hsv2rgb(hsv);
    }
    if (u_hue != 0.0) {
        vec3 hsv = rgb2hsv(color.rgb);
        hsv.x = fract(hsv.x + u_hue);
        color.rgb = hsv2rgb(hsv);
    }
    color.rgb = clamp(color.rgb, 0.0, 1.0);
    fragColor = color;
}`,
                    uniforms: {
                        u_offsetX: 0,
                        u_offsetY: 0,
                        u_angle: 0,
                        u_scale: 1,
                        u_stageAspect: 1.778,
                        u_saturation: 1,
                        u_brightness: 1,
                        u_contrast: 1,
                        u_hue: 0
                    }
                },
                "____SCREEN_3DPLANE____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;
uniform sampler2D u_skin;
uniform float u_stageAspect;
uniform vec3 u_rot;
uniform vec2 u_pos;
uniform float u_scale;
uniform float u_bgBrightness;

void main() {
    vec2 uv = v_texCoord;
    float aspect = u_stageAspect;
    float sqrtAspect = sqrt(aspect);
    
    vec4 bg = texture(u_skin, uv);
    bg.rgb *= u_bgBrightness;
    vec2 screenPos = vec2((uv.x - 0.5) * 2.0 * sqrtAspect, (uv.y - 0.5) * 2.0);
    screenPos -= u_pos * 2.0;
    vec3 rayDir = normalize(vec3(screenPos.x, screenPos.y, -1.0));
    vec3 cameraPos = vec3(0.0, 0.0, 2.0);
    float ax = u_rot.x, ay = u_rot.y, az = u_rot.z;
    float sx = sin(ax), cx = cos(ax);
    float sy = sin(ay), cy = cos(ay);
    float sz = sin(az), cz = cos(az);
    mat3 rot = mat3(
        cy*cz, -cy*sz, sy,
        sx*sy*cz + cx*sz, -sx*sy*sz + cx*cz, -sx*cy,
        -cx*sy*cz + sx*sz, cx*sy*sz + sx*cz, cx*cy
    );
    vec3 localDir = rot * rayDir;
    vec3 localOrigin = rot * cameraPos;
    float t = -localOrigin.z / localDir.z;
    if (t > 0.0) {
        vec3 hit = localOrigin + localDir * t;
        float hs = u_scale * 0.5;
        if (abs(hit.x) <= hs && abs(hit.y) <= hs) {
            vec2 planeUV = vec2(hit.x / u_scale + 0.5, hit.y / u_scale + 0.5);
            if (planeUV.x >= 0.0 && planeUV.x <= 1.0 && planeUV.y >= 0.0 && planeUV.y <= 1.0) {
                vec4 planeColor = texture(u_skin, planeUV);
                fragColor = mix(bg, planeColor, 0.95);
                return;
            }
        }
    }
    fragColor = bg;
}`,
                    uniforms: {
                        u_rot: [0, 0, 0],
                        u_pos: [0, 0],
                        u_scale: 1,
                        u_bgBrightness: 0.3,
                        u_stageAspect: 1.778
                    }
                },
                "____SCREEN_CROP____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;
uniform sampler2D u_skin;
uniform float u_stageAspect;
uniform vec2 u_cropPos;
uniform float u_cropW;
uniform float u_cropH;
uniform float u_borderSize;
uniform float u_bgBrightness;
uniform float u_bgSaturation;
uniform float u_bgBlur;
uniform float u_bgContrast;

void main() {
    vec2 uv = v_texCoord;
    float aspect = u_stageAspect;
    float sqrtAspect = sqrt(aspect);
    
    vec2 center = u_cropPos;
    float halfW = u_cropW * 0.5;
    float halfH = u_cropH * 0.5;
    float left = center.x - halfW;
    float right = center.x + halfW;
    float bottom = center.y - halfH;
    float top = center.y + halfH;
    
    bool inside = uv.x >= left && uv.x <= right && uv.y >= bottom && uv.y <= top;
    vec4 color;
    if (inside) {
        color = texture(u_skin, uv);
    } else {
        vec4 bgColor = vec4(0.0);
        float blurStep = u_bgBlur * 0.008;
        int samples = int(u_bgBlur * 3.0);
        if (samples > 3) samples = 3;
        for (int x = -3; x <= 3; x++) {
            for (int y = -3; y <= 3; y++) {
                int ax = x;
                int ay = y;
                if (ax < 0) ax = -ax;
                if (ay < 0) ay = -ay;
                if (ax > samples || ay > samples) continue;
                vec2 offset = vec2(float(x) / sqrtAspect, float(y)) * blurStep;
                vec2 sampleUV = vec2(
                    left + (uv.x + offset.x) * u_cropW,
                    bottom + (uv.y + offset.y) * u_cropH
                );
                bgColor += texture(u_skin, sampleUV);
            }
        }
        float count = float((samples * 2 + 1) * (samples * 2 + 1));
        bgColor = bgColor / count;
        bgColor.rgb = (bgColor.rgb - 0.5) * u_bgContrast + 0.5;
        bgColor.rgb *= u_bgBrightness;
        float lum = dot(bgColor.rgb, vec3(0.299, 0.587, 0.114));
        bgColor.rgb = mix(vec3(lum), bgColor.rgb, u_bgSaturation);
        color = bgColor;
    }
    
    float borderPixels = u_borderSize;
    float borderX = borderPixels / sqrtAspect;
    float borderY = borderPixels;
    
    float borderLeft = abs(uv.x - left);
    float borderRight = abs(uv.x - right);
    float borderBottom = abs(uv.y - bottom);
    float borderTop = abs(uv.y - top);
    
    float border = 0.0;
    if (uv.y >= bottom - borderY && uv.y <= top + borderY) {
        if (borderLeft < borderX || borderRight < borderX) {
            border = 1.0;
        }
    }
    if (uv.x >= left - borderX && uv.x <= right + borderX) {
        if (borderBottom < borderY || borderTop < borderY) {
            border = 1.0;
        }
    }
    if (border > 0.5) {
        color = vec4(1.0, 1.0, 1.0, 1.0);
    }
    
    fragColor = color;
}`,
                    uniforms: {
                        u_cropPos: [0.5, 0.5],
                        u_cropW: 0.5,
                        u_cropH: 0.5,
                        u_borderSize: 0.01,
                        u_bgBrightness: 0.3,
                        u_bgSaturation: 0.5,
                        u_bgBlur: 2,
                        u_bgContrast: 0.8,
                        u_stageAspect: 1.778
                    }
                },
                "____SCREEN_XYWAVE____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;
uniform sampler2D u_skin;
uniform float u_timer;
uniform float u_stageAspect;
uniform vec2 u_speed;
uniform vec2 u_amp;
uniform vec2 u_freq;

void main() {
    vec2 uv = v_texCoord;
    float aspect = u_stageAspect;
    float sqrtAspect = sqrt(aspect);
    float t = u_timer;
    
    vec2 uvAdj = vec2(uv.x * sqrtAspect, uv.y);
    
    float waveX = sin(uvAdj.y * u_freq.x * 30.0 + t * u_speed.x) * u_amp.x;
    float waveY = sin(uvAdj.x * u_freq.y * 30.0 + t * u_speed.y) * u_amp.y;
    
    uvAdj.x += waveX;
    uvAdj.y += waveY;
    
    uv = vec2(uvAdj.x / sqrtAspect, uvAdj.y);
    uv = clamp(uv, 0.0, 1.0);
    
    fragColor = texture(u_skin, uv);
}`,
                    uniforms: {
                        u_speed: [0.5, 0.3],
                        u_amp: [0.02, 0.015],
                        u_freq: [1.5, 2],
                        u_stageAspect: 1.778
                    }
                },
                "____SCREEN_DROPLET____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;
uniform sampler2D u_skin;
uniform float u_timer;
uniform float u_stageAspect;
uniform float u_count;
uniform float u_speed;
uniform float u_strength;
uniform float u_scale;
uniform float u_fade;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = v_texCoord;
    float aspect = u_stageAspect;
    float sqrtAspect = sqrt(aspect);
    float t = u_timer;
    
    vec2 offset = vec2(0.0);
    
    for (int i = 0; i < 200; i++) {
        if (float(i) >= u_count) break;
        
        float seed = float(i) * 1.73;
        
        vec2 pos = vec2(hash(vec2(seed, 0.0)), hash(vec2(seed, 1.0)));
        float startTime = hash(vec2(seed, 2.0)) * 3.0;
        float life = fract((t + startTime) * u_speed * 0.3);
        float radius = life * u_scale;
        
        vec2 uvAdj = vec2(uv.x * sqrtAspect, uv.y);
        vec2 posAdj = vec2(pos.x * sqrtAspect, pos.y);
        float dist = length(uvAdj - posAdj);
        
        float ringDist = abs(dist - radius);
        float ring = 1.0 - ringDist / (0.02 * u_scale + 0.005);
        ring = clamp(ring, 0.0, 1.0);
        
        float fade = pow(1.0 - life, u_fade);
        float wave = sin(dist * 60.0 - radius * 40.0) * 0.5 + 0.5;
        
        float ripple = ring * fade * wave * u_strength;
        
        vec2 dir = (uvAdj - posAdj) / (dist + 0.001);
        dir.x /= sqrtAspect;
        offset += dir * ripple;
    }
    
    vec2 sampleUV = uv + offset;
    sampleUV = clamp(sampleUV, 0.0, 1.0);
    
    fragColor = texture(u_skin, sampleUV);
}`,
                    uniforms: {
                        u_count: 30,
                        u_speed: 0.5,
                        u_strength: 0.3,
                        u_scale: 0.8,
                        u_fade: 1.0,
                        u_stageAspect: 1.778
                    }
                },
                "____SCREEN_CUBE____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;

uniform sampler2D u_skin;
uniform float u_timer;
uniform float u_stageAspect;
uniform float u_size;
uniform vec3 u_rot;
uniform vec2 u_pos;
uniform vec2 u_cropPos;
uniform float u_cropW;
uniform float u_bgAlpha;

mat3 rotX(float a) {
    float s = sin(a), c = cos(a);
    return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}

mat3 rotY(float a) {
    float s = sin(a), c = cos(a);
    return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
}

mat3 rotZ(float a) {
    float s = sin(a), c = cos(a);
    return mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
}

bool intersectBox(vec3 origin, vec3 dir, vec3 boxMin, vec3 boxMax, out float tNear, out int face) {
    vec3 tMin = (boxMin - origin) / dir;
    vec3 tMax = (boxMax - origin) / dir;
    vec3 t1 = min(tMin, tMax);
    vec3 t2 = max(tMin, tMax);
    tNear = max(max(t1.x, t1.y), t1.z);
    float tFar = min(min(t2.x, t2.y), t2.z);
    if (tNear > tFar || tFar < 0.0) return false;
    if (tNear == t1.x) face = (dir.x > 0.0) ? 3 : 4;
    else if (tNear == t1.y) face = (dir.y > 0.0) ? 6 : 5;
    else face = (dir.z > 0.0) ? 2 : 1;
    return true;
}

vec2 getUV(vec3 p, float size, int face) {
    float u = (p.x / size) + 0.5;
    float v = (p.y / size) + 0.5;
    float w = (p.z / size) + 0.5;
    if (face == 1) return vec2(u, 1.0 - v);
    if (face == 2) return vec2(1.0 - u, 1.0 - v);
    if (face == 3) return vec2(w, 1.0 - v);
    if (face == 4) return vec2(1.0 - w, 1.0 - v);
    if (face == 5) return vec2(u, w);
    return vec2(u, 1.0 - w);
}

void main() {
    vec4 bg = texture(u_skin, v_texCoord);
    
    float aspect = u_stageAspect;
    float sqrtAspect = sqrt(aspect);
    
    vec2 screenPos = v_texCoord * 2.0 - 1.0;
    screenPos -= u_pos;
    
    vec3 rayDir = normalize(vec3(screenPos.x * sqrtAspect, screenPos.y, -1.0));
    vec3 cameraPos = vec3(0.0, 0.0, 2.0);
    
    mat3 rot = rotX(u_rot.x) * rotY(u_rot.y) * rotZ(u_rot.z);
    vec3 localDir = rot * rayDir;
    vec3 localOrigin = rot * cameraPos;
    
    float hs = u_size * 0.5;
    float tNear;
    int face;
    
    if (intersectBox(localOrigin, localDir, vec3(-hs), vec3(hs), tNear, face)) {
        vec3 hit = localOrigin + localDir * tNear;
        vec2 uv = getUV(hit, u_size, face);
        
        float cropW = u_cropW;
        float cropH = u_cropW / sqrtAspect;
        
        float halfW = cropW * 0.5;
        float halfH = cropH * 0.5;
        vec2 cropped = vec2(
            u_cropPos.x + (uv.x - 0.5) * cropW,
            u_cropPos.y + (uv.y - 0.5) * cropH
        );
        cropped = clamp(cropped, 0.0, 1.0);
        
        vec4 cubeColor = texture(u_skin, cropped);
        
        vec4 fadedBg = vec4(bg.rgb * u_bgAlpha, bg.a * u_bgAlpha);
        fragColor = mix(fadedBg, cubeColor, 0.95);
        return;
    }
    
    fragColor = vec4(bg.rgb * u_bgAlpha, bg.a * u_bgAlpha);
}`,
                    uniforms: {
                        u_size: 0.8,
                        u_rot: [0.5, 0.3, 0],
                        u_pos: [0, 0],
                        u_cropPos: [0.5, 0.5],
                        u_cropW: 0.8,
                        u_bgAlpha: 1,
                        u_stageAspect: 1.778
                    }
                },
                "____SCREEN_TV____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;
uniform sampler2D u_skin;
uniform float u_timer;
uniform float u_scanlineIntensity;
uniform float u_noiseIntensity;
uniform float u_chromaticStrength;
uniform float u_vignetteStrength;

float random(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = v_texCoord;
    vec4 color = texture(u_skin, uv);
    
    float scanline = sin(uv.y * 600.0 + u_timer * 2.0) * 0.5 + 0.5;
    scanline = mix(1.0, scanline, u_scanlineIntensity * 0.3);
    color.rgb *= scanline;
    
    float noise = random(uv + u_timer * 0.1);
    float noiseMask = step(0.95, noise);
    color.rgb += noiseMask * u_noiseIntensity * 0.2;
    color.rgb += (noise - 0.5) * u_noiseIntensity * 0.05;
    
    float strength = u_chromaticStrength * 0.005;
    float r = texture(u_skin, uv + vec2(strength, 0.0)).r;
    float g = texture(u_skin, uv).g;
    float b = texture(u_skin, uv - vec2(strength, 0.0)).b;
    color = mix(color, vec4(r, g, b, color.a), u_chromaticStrength);
    
    vec2 vig = (uv - 0.5) * 1.2;
    float vignette = 1.0 - length(vig) * u_vignetteStrength * 0.8;
    color.rgb *= vignette;
    
    float bar = sin(uv.x * 3.14159 * 2.0 + u_timer * 0.5) * 0.5 + 0.5;
    color.rgb *= 1.0 - bar * 0.02 * u_scanlineIntensity;
    
    color.rgb = clamp(color.rgb, 0.0, 1.0);
    fragColor = color;
}`,
                    uniforms: {
                        u_scanlineIntensity: 0.5,
                        u_noiseIntensity: 0.3,
                        u_chromaticStrength: 0.3,
                        u_vignetteStrength: 0.5
                    }
                },
                "____SCREEN_WATER_RIPPLE____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;
uniform sampler2D u_skin;
uniform float u_timer;
uniform float u_stageAspect;
uniform float u_centerX;
uniform float u_centerY;
uniform float u_waveSpeed;
uniform float u_waveStrength;
uniform float u_waveDensity;
uniform float u_decay;

void main() {
    vec2 uv = v_texCoord;
    float aspect = u_stageAspect;
    float sqrtAspect = sqrt(aspect);
    
    vec2 center = vec2(u_centerX, u_centerY);
    
    vec2 delta = vec2((uv.x - center.x) * sqrtAspect, uv.y - center.y);
    float dist = length(delta);
    
    float wave = sin(dist * u_waveDensity * 30.0 - u_timer * u_waveSpeed) * 0.5 + 0.5;
    float falloff = exp(-dist * u_decay * 5.0);
    float strength = wave * u_waveStrength * 0.05 * falloff;
    
    vec2 dir = delta / (dist + 0.001);
    dir.x /= sqrtAspect;
    
    vec2 sampleUV = uv + dir * strength;
    sampleUV = clamp(sampleUV, 0.0, 1.0);
    
    fragColor = texture(u_skin, sampleUV);
}`,
                    uniforms: {
                        u_centerX: 0.5,
                        u_centerY: 0.5,
                        u_waveSpeed: 2,
                        u_waveStrength: 0.5,
                        u_waveDensity: 1.5,
                        u_decay: 1,
                        u_stageAspect: 1.778
                    }
                },
                "____SCREEN_WATER_REAL____": {
                    frag: `#version 300 es
precision highp float;
in vec2 v_texCoord;
out vec4 fragColor;

uniform sampler2D u_skin;
uniform float u_timer;
uniform float u_stageAspect;
uniform float u_waterLevel;
uniform float u_waveHeight;
uniform float u_waveDensity;
uniform float u_waveSpeed;
uniform float u_rippleCount;
uniform float u_rippleSpeed;
uniform float u_rippleStrength;
uniform float u_rippleSize;
uniform float u_rippleLife;
uniform float u_rippleFrequency;
uniform float u_flakeDensity;
uniform float u_flakeBrightness;
uniform float u_flakeSpeed;
uniform float u_waterColorR;
uniform float u_waterColorG;
uniform float u_waterColorB;
uniform float u_waterColorStrength;
uniform float u_waterBrightness;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
    );
}

float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
        value += amp * smoothNoise(p * freq);
        freq *= 2.0;
        amp *= 0.5;
    }
    return value;
}

vec2 getRippleOffset(vec2 pos, float time) {
    vec2 totalOffset = vec2(0.0);
    for (int i = 0; i < 30; i++) {
        if (float(i) >= u_rippleCount) break;
        float seed = float(i) * 1.73 + 0.5;
        vec2 ripplePos = vec2(
            hash(vec2(seed, 0.0)),
            hash(vec2(seed, 1.0))
        );
        
        float startTime = hash(vec2(seed, 2.0)) * 3.0;
        float life = fract((time + startTime) * u_rippleFrequency * 0.1);
        float radius = life * u_rippleSize;
        float dist = length(pos - ripplePos);
        float ring = 1.0 - abs(dist - radius) / (0.02 * u_rippleSize + 0.005);
        ring = clamp(ring, 0.0, 1.0);
        float fade = pow(1.0 - life, u_rippleLife);
        float waveRipple = sin(dist * 60.0 - radius * 40.0) * 0.5 + 0.5;
        float ripple = ring * fade * waveRipple * u_rippleStrength;
        vec2 dir = (pos - ripplePos) / (dist + 0.001);
        totalOffset += dir * ripple * 0.03;
    }
    return totalOffset;
}

void main() {
    vec2 uv = v_texCoord;
    float aspect = u_stageAspect;
    float sqrtAspect = sqrt(aspect);
    float time = u_timer;
    
    bool isUnderwater = uv.y < u_waterLevel;
    if (!isUnderwater) {
        fragColor = texture(u_skin, uv);
        return;
    }
    
    float reflectY = u_waterLevel + (u_waterLevel - uv.y);
    vec2 reflectUV = vec2(uv.x, reflectY);
    float distFromBorder = abs(uv.y - u_waterLevel);
    float borderFade = 1.0 - smoothstep(0.0, 0.15, distFromBorder);
    float waveStrength = u_waveHeight * (1.0 - borderFade * 0.9);
    
    vec2 uvAdj = vec2(reflectUV.x * sqrtAspect, reflectUV.y);
    float waveTime = time * u_waveSpeed;
    float waveOffsetX = sin(uvAdj.y * u_waveDensity * 5.0 + waveTime) * 0.025 * waveStrength;
    waveOffsetX /= sqrtAspect;
    vec2 waveOff = vec2(waveOffsetX, 0.0);
    
    vec2 rippleOff = getRippleOffset(reflectUV, time);
    vec2 totalOffset = waveOff + rippleOff;
    
    vec2 finalUV = reflectUV + totalOffset;
    finalUV = clamp(finalUV, 0.0, 1.0);
    
    vec4 original = texture(u_skin, finalUV);
    
    float depthFactor = distFromBorder / max(u_waterLevel, 0.01);
    depthFactor = clamp(depthFactor, 0.0, 1.0);
    float colorStrength = u_waterColorStrength * (0.3 + 0.7 * depthFactor);
    vec3 waterColor = vec3(u_waterColorR, u_waterColorG, u_waterColorB);
    vec3 mixedColor = mix(original.rgb, waterColor, colorStrength);
    mixedColor *= u_waterBrightness;
    
    vec2 flakeUV = reflectUV + totalOffset;
    float fn = fbm(vec2(flakeUV.x * u_flakeDensity * 2.0 + time * u_flakeSpeed * 0.02, flakeUV.y * u_flakeDensity * 2.0));
    fn = fn * 0.5 + 0.5;
    fn = step(0.8, fn);
    mixedColor += vec3(fn) * u_flakeBrightness;
    
    float alpha = mix(0.85, 0.5, depthFactor);
    fragColor = vec4(mixedColor, alpha);
}`,
                    uniforms: {
                        u_waterLevel: 0.5,
                        u_waveHeight: 1.0,
                        u_waveDensity: 3.0,
                        u_waveSpeed: 1.0,
                        u_rippleCount: 15.0,
                        u_rippleSpeed: 0.5,
                        u_rippleStrength: 0.5,
                        u_rippleSize: 0.5,
                        u_rippleLife: 2.0,
                        u_rippleFrequency: 2.0,
                        u_flakeDensity: 3.0,
                        u_flakeBrightness: 0.5,
                        u_flakeSpeed: 1.0,
                        u_waterColorR: 0.2,
                        u_waterColorG: 0.4,
                        u_waterColorB: 0.8,
                        u_waterColorStrength: 0.5,
                        u_waterBrightness: 0.8,
                        u_stageAspect: 1.778
                    }
                }
            };

            const vertShader = defaultVertexShader300;

            for (const [name, data] of Object.entries(shaders)) {
                if (shaderfile.shaders[name]) {
                    delete shaderfile.shaders[name];
                    delete shaderfile.programs[name];
                    delete recompiledShaders[name];
                }

                shaderfile.saveShader(name, {
                    projectData: {
                        blockDat: {},
                        dynamicDat: {
                            dynamic_variables: [],
                            dynamic_myblocks: []
                        },
                        glsl: "// Built-in Screen Shader: " + name,
                        isText: true,
                        vertShader: vertShader,
                        fragShader: data.frag
                    },
                    vertShader: vertShader,
                    fragShader: data.frag
                });

                // 存储默认值到 shaders 数据里
                shaderfile.shaders[name].uniforms = data.uniforms;

                compileShaderForSprite(name);
            }
        }
        _initDefaultTexture() {
            if (this._defaultTexture) return;

            try {
                this._defaultTexture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, this._defaultTexture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
            } catch (e) {
                console.warn('创建默认纹理失败:', e);
                this._defaultTexture = null;
            }
        }
        advDrawThese(drawables, drawMode, projection, opts = {}) {
            const gl = renderer._gl;
            let currentShader = null;
            const nativeSize = renderer.getNativeSize();
            const scratchUnitWidth = nativeSize[0],
                scratchUnitHeight = nativeSize[1];
            const framebufferSpaceScaleDiffers = ('framebufferWidth' in opts && 'framebufferHeight' in opts &&
                opts.framebufferWidth !== renderer._nativeSize[0] && opts.framebufferHeight !== renderer._nativeSize[1]);
            const numDrawables = drawables.length;

            for (let i = 0; i < numDrawables; i++) {
                const drawableID = drawables[i];
                if (opts.filter && !opts.filter(drawableID)) continue;
                const drawable = renderer._allDrawables[drawableID];
                if (!drawable.getVisible() && !opts.ignoreVisibility) continue;
                const drawableScale = framebufferSpaceScaleDiffers ? [
                    drawable.scale[0] * opts.framebufferWidth / renderer._nativeSize[0],
                    drawable.scale[1] * opts.framebufferHeight / renderer._nativeSize[1]
                ] : drawable.scale;
                if (!drawable.skin || !drawable.skin.getTexture(drawableScale)) continue;
                if (opts.skipPrivateSkins && drawable.skin.private) continue;

                const drawableShaderName = spriteShaders[drawableID];
                let uniforms = {};
                let effectBits = drawable.enabledEffects;
                effectBits &= opts.effectMask !== undefined ? opts.effectMask : effectBits;
                const newShader = (drawableShaderName && shaderfile.shaders[drawableShaderName] && recompiledShaders[drawableShaderName]) ?
                    recompiledShaders[drawableShaderName] : renderer._shaderManager.getShader(drawMode, effectBits);

                if (renderer._regionId !== newShader) {
                    renderer._doExitDrawRegion();
                    renderer._regionId = newShader;
                    currentShader = newShader;
                    gl.useProgram(currentShader.program);
                    twgl.setBuffersAndAttributes(gl, currentShader, renderer._bufferInfo);
                    Object.assign(uniforms, {
                        u_projectionMatrix: projection
                    });
                }
                Object.assign(uniforms, drawable.skin.getUniforms(drawableScale), drawable.getUniforms());
                if (opts.extraUniforms) Object.assign(uniforms, opts.extraUniforms);
                if (drawableShaderName && shaderfile.shaders[drawableShaderName]) {
                    const shaderInfo = shaderfile.shaders[drawableShaderName];
                    let uniformsToUse;
                    if (shaderInfo.isSubShader) {
                        uniformsToUse = parentExtension.subShaderUniforms?.[drawableShaderName] || {};
                    } else {
                        const instanceKey = opts.instanceKey || (renderSpriteShadersList[drawableID] ? `sprite-${drawableID}-${renderSpriteShadersList[drawableID].length - 1}` : `sprite-${drawableID}`);
                        uniformsToUse = {
                            ...(uniformOverrides[instanceKey] || shaderfile.programs[drawableShaderName].uniformDat)
                        };
                    }

                    // 外观着色器：用独立数据覆盖共享数据
                    if (drawableShaderName === BUILTIN_SPLOOKS_SHADER && parentExtension.splooksData?.[drawableID]) {
                        const splookDat = parentExtension.splooksData[drawableID];
                        for (const key of Object.keys(splookDat)) {
                            if (!key.startsWith('_') && key !== 'u_maskTextureSP') {
                                uniformsToUse[key] = splookDat[key];
                            }
                        }
                        if (splookDat._maskTexture) {
                            uniformsToUse.u_maskTextureSP = splookDat._maskTexture;
                        }
                    }

                    uniformsToUse.u_res = [gl.canvas.width, gl.canvas.height];
                    uniformsToUse.u_timer = runtime.ioDevices.clock.projectTimer();
                    uniformsToUse.u_transform = [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    uniformsToUse.u_skin = textures[drawableID] || drawable.skin.getTexture(drawableScale);
                    uniformsToUse.u_skinSize = [drawable._skinScale[0], drawable._skinScale[1]];
                    uniformsToUse.u_position = [drawable._position[0], drawable._position[1]];
                    uniformsToUse.u_direction = 90 - (spriteDirection || drawable._direction);
                    uniformsToUse.u_rotationAdjusted = [drawable._rotationAdjusted[0], drawable._rotationAdjusted[1]];
                    if (parentExtension.shaderTextureBindings && drawableShaderName) {
                        const shaderBindings = parentExtension.shaderTextureBindings[drawableShaderName];
                        if (shaderBindings) {
                            for (const [uniformName, binding] of Object.entries(shaderBindings)) {
                                const targetDrawable = renderer._allDrawables[binding.drawableID];
                                if (targetDrawable && targetDrawable.skin) {
                                    const tex = targetDrawable.skin.getTexture(targetDrawable.scale);
                                    if (tex) {
                                        uniformsToUse[uniformName] = tex;
                                    }
                                }
                            }
                        }
                    }

                    shouldBeDirty = true;
                    uniforms = Object.assign({}, uniforms, uniformsToUse);
                }
                if (uniforms.u_skin) {
                    twgl.setTextureParameters(gl, uniforms.u_skin, {
                        minMag: drawable.skin.useNearest(drawableScale, drawable) ? gl.NEAREST : gl.LINEAR
                    });
                }
                const blendMode = drawable.blendMode || "default";
                gl.enable(gl.BLEND);
                const blend = BlendModes[blendMode] || BlendModes.default;
                gl.blendEquation(blend[4]);
                gl.blendFuncSeparate(blend[0], blend[1], blend[2], blend[3]);

                const clipbox = clipBoxes[drawableID] || drawable.clipbox;
                if (clipbox) {
                    gl.enable(gl.SCISSOR_TEST);
                    const fbWidth = opts.framebufferWidth || gl.canvas.width;
                    const fbHeight = opts.framebufferHeight || gl.canvas.height;
                    let x = ((clipbox.x_min / scratchUnitWidth + 0.5) * fbWidth) | 0,
                        y, w, h;
                    if (isPenBufferActive) {
                        y = ((-clipbox.y_max / scratchUnitHeight + 0.5) * fbHeight) | 0;
                        const x2 = ((clipbox.x_max / scratchUnitWidth + 0.5) * fbWidth) | 0;
                        const y2 = ((-clipbox.y_min / scratchUnitHeight + 0.5) * fbHeight) | 0;
                        w = x2 - x;
                        h = y2 - y;
                    } else {
                        y = ((clipbox.y_min / scratchUnitHeight + 0.5) * fbHeight) | 0;
                        const x2 = ((clipbox.x_max / scratchUnitWidth + 0.5) * fbWidth) | 0;
                        const y2 = ((clipbox.y_max / scratchUnitHeight + 0.5) * fbHeight) | 0;
                        w = x2 - x;
                        h = y2 - y;
                    }
                    gl.scissor(x, y, w, h);
                } else {
                    gl.disable(gl.SCISSOR_TEST);
                }

                twgl.setUniforms(currentShader, uniforms);
                twgl.drawBufferInfo(gl, renderer._bufferInfo, gl.TRIANGLES);
                gl.enable(gl.BLEND);
            }
            gl.disable(gl.SCISSOR_TEST);
            renderer._regionId = null;
        }
        customDrawFunction() {
            if (Scratch.vm.runtime.ext_xeltallivSimple3Dapi) Scratch.vm.runtime.ext_xeltallivSimple3Dapi.redraw();
            if (Scratch.vm.runtime.ext_DJYReCanvasApi) Scratch.vm.runtime.ext_DJYReCanvasApi.redraw();
            if (!renderer.dirty) return;
            renderer.dirty = false;
            shouldBeDirty = false;
            renderer._doExitDrawRegion();
            const gl = renderer._gl;

            if (multiRender && renderSpriteShadersList) {
                for (let drawableID in renderSpriteShadersList) {
                    const drawable = renderer._allDrawables[drawableID];
                    if (!drawable) continue;
                    for (let ii = 0; ii < renderSpriteShadersList[drawableID].length - 1; ++ii) {
                        renderer._doExitDrawRegion();
                        gl.disable(gl.BLEND);
                        spriteDirection = null;
                        if (ii == 0) {
                            delete spriteShaders[drawableID];
                            delete textures[drawableID];

                            twgl.bindFramebufferInfo(gl, bufferInfo[drawableID][0]);
                            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                            gl.clearColor(0, 0, 0, 0);
                            gl.clear(gl.COLOR_BUFFER_BIT);

                            renderer._drawThese([drawableID], 'default', renderer._projection, {
                                framebufferWidth: gl.canvas.width,
                                framebufferHeight: gl.canvas.height
                            });
                        }
                        spriteDirection = drawable._direction;
                        drawable.updateDirection(90);
                        twgl.resizeFramebufferInfo(gl, bufferInfo[drawableID][ii % 2], stageBufferAttachments, Scratch.Cast.toNumber(gl.canvas.width), Scratch.Cast.toNumber(gl.canvas.height));
                        twgl.bindFramebufferInfo(gl, bufferInfo[drawableID][ii % 2]);
                        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                        const projection = twgl.m4.ortho(drawable._position[0] - drawable._rotationAdjusted[0] - drawable._skinScale[0] / 2, drawable._position[0] - drawable._rotationAdjusted[0] + drawable._skinScale[0] / 2, drawable._position[1] - drawable._rotationAdjusted[1] + drawable._skinScale[1] / 2, drawable._position[1] - drawable._rotationAdjusted[1] - drawable._skinScale[1] / 2, -1, 1);
                        gl.clearColor(0, 0, 0, 0);
                        gl.clear(gl.COLOR_BUFFER_BIT);
                        spriteShaders[drawableID] = renderSpriteShadersList[drawableID][ii];
                        if (ii !== 0) textures[drawableID] = bufferInfo[drawableID][(ii + 1) % 2].attachments[0];
                        renderer._drawThese([drawableID], 'default', projection, {
                            framebufferWidth: gl.canvas.width,
                            framebufferHeight: gl.canvas.width,
                            instanceKey: `sprite-${drawableID}-${ii}`
                        });
                        textures[drawableID] = bufferInfo[drawableID][ii % 2].attachments[0];
                        drawable.updateDirection(spriteDirection);
                        spriteDirection = null;
                    }
                    twgl.bindFramebufferInfo(gl, null);
                    spriteShaders[drawableID] = renderSpriteShadersList[drawableID][renderSpriteShadersList[drawableID].length - 1];
                }
            }

            if (currentFrameBuffer) {
                twgl.resizeFramebufferInfo(gl, currentFrameBuffer[0], stageBufferAttachments, Scratch.Cast.toNumber(gl.canvas.width), Scratch.Cast.toNumber(gl.canvas.height));
                twgl.bindFramebufferInfo(gl, currentFrameBuffer[0]);
            } else {
                twgl.bindFramebufferInfo(gl, null);
            }

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clearColor(...renderer._backgroundColor4f);
            gl.clear(gl.COLOR_BUFFER_BIT);
            const snapshotRequested = renderer._snapshotCallbacks.length > 0;

            // ========== 渲染顺序处理 ==========
            if (customDrawOrderEnabled && customDrawOrder) {
                const allDrawables = renderer._allDrawables;
                let processed = 0;
                const batchSize = 50;
                while (processed < batchSize && syncIndex < customDrawOrder.length) {
                    if (!allDrawables[customDrawOrder[syncIndex]]) {
                        const removedId = customDrawOrder[syncIndex];
                        customDrawOrder.splice(syncIndex, 1);
                        delete layerZMap[removedId];
                    } else {
                        syncIndex++;
                    }
                    processed++;
                }
                if (syncIndex >= customDrawOrder.length) {
                    syncIndex = 0;
                }
                const drawOrderSet = new Set(customDrawOrder);
                renderer._drawList.forEach(id => {
                    if (!drawOrderSet.has(id) && allDrawables[id]) {
                        customDrawOrder.push(id);
                        if (layerZMap[id] === undefined) {
                            layerZMap[id] = 0;
                        }
                    }
                });
            }

            const drawList = (customDrawOrderEnabled && customDrawOrder) ? customDrawOrder : renderer._drawList;

            // ========== 分离保护图层 ==========
            const unprotectedList = [];
            const protectedList = [];

            for (const id of drawList) {
                if (!renderer._allDrawables[id]) continue;
                if (protectedDrawables[id]) {
                    protectedList.push(id);
                } else {
                    unprotectedList.push(id);
                }
            }

            // ========== 绘制无保护的图层 ==========
            if (unprotectedList.length > 0) {
                renderer._drawThese(unprotectedList, 'default', renderer._projection, {
                    framebufferWidth: gl.canvas.width,
                    framebufferHeight: gl.canvas.height,
                    skipPrivateSkins: snapshotRequested
                });
            }

            // ========== 应用屏幕着色器 ==========
            if (currentFrameBuffer && multiRender) {
                for (var ii = 0; ii < renderShadersList.length - 1; ++ii) {
                    gl.disable(gl.BLEND);
                    twgl.resizeFramebufferInfo(gl, currentFrameBuffer[(ii + 1) % 2], stageBufferAttachments, gl.canvas.width, gl.canvas.height);
                    twgl.bindFramebufferInfo(gl, currentFrameBuffer[(ii + 1) % 2]);
                    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                    gl.clearColor(0, 0, 0, 0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    currentShader = renderShadersList[ii];
                    gl.useProgram(shaderfile.programs[currentShader].info.program);
                    twgl.setBuffersAndAttributes(gl, shaderfile.programs[currentShader].info, reRenderInfo);
                    const uniformsToUse = {
                        ...(uniformOverrides[`stage-${ii}`] || shaderfile.programs[currentShader].uniformDat)
                    };
                    uniformsToUse.u_skin = currentFrameBuffer[ii % 2].attachments[0];
                    uniformsToUse.u_skinSize = [runtime.stageWidth, runtime.stageHeight];
                    uniformsToUse.u_position = [0, 0];
                    uniformsToUse.u_direction = 0;
                    uniformsToUse.u_rotationAdjusted = [0, 0];
                    uniformsToUse.u_res = [gl.canvas.width, gl.canvas.height];
                    uniformsToUse.u_timer = runtime.ioDevices.clock.projectTimer();
                    uniformsToUse.u_transform = [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    twgl.setUniforms(shaderfile.programs[currentShader].info, uniformsToUse);
                    twgl.drawBufferInfo(gl, reRenderInfo);
                }
                currentShader = renderShadersList[renderShadersList.length - 1];
            }

            if (currentFrameBuffer) {
                if (!shaderfile.programs[currentShader]) {
                    parentExtension.resetBuffer();
                    renderer.dirty = true;
                    return;
                }
                gl.disable(gl.BLEND);
                twgl.bindFramebufferInfo(gl, null);
                gl.useProgram(shaderfile.programs[currentShader].info.program);
                twgl.setBuffersAndAttributes(gl, shaderfile.programs[currentShader].info, reRenderInfo);
                const instanceKey = multiRender ? `stage-${renderShadersList.length - 1}` : 'stage-0';
                const uniformsToUse = {
                    ...(uniformOverrides[instanceKey] || shaderfile.programs[currentShader].uniformDat)
                };
                uniformsToUse.u_skin = multiRender ? currentFrameBuffer[(renderShadersList.length + 1) % 2].attachments[0] : currentFrameBuffer[0].attachments[0];
                uniformsToUse.u_skinSize = [runtime.stageWidth, runtime.stageHeight];
                uniformsToUse.u_position = [0, 0];
                uniformsToUse.u_direction = 0;
                uniformsToUse.u_rotationAdjusted = [0, 0];
                uniformsToUse.u_res = [gl.canvas.width, gl.canvas.height];
                uniformsToUse.u_timer = runtime.ioDevices.clock.projectTimer();
                uniformsToUse.u_transform = [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                twgl.setUniforms(shaderfile.programs[currentShader].info, uniformsToUse);
                twgl.drawBufferInfo(gl, reRenderInfo);
                renderer.dirty = parentExtension.autoReRender;
            }

            // ========== 绘制受保护的图层（在屏幕着色器之上） ==========
            if (protectedList.length > 0) {
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                renderer._drawThese(protectedList, 'default', renderer._projection, {
                    framebufferWidth: gl.canvas.width,
                    framebufferHeight: gl.canvas.height,
                    skipPrivateSkins: snapshotRequested
                });
            }

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            // ========== 统一处理截图请求 ==========
            if (snapshotRequested) {
                const s = gl.canvas.toDataURL();
                renderer._snapshotCallbacks.forEach(cb => cb(s));
                renderer._snapshotCallbacks = [];
            }

            if (shouldBeDirty) {
                renderer.dirty = parentExtension.autoReRender;
                shouldBeDirty = false;
            }
            parentExtension._checkOneBufferPerFrame();
        }
        saveThingExists = false;
        addSaveListeners() {
            if (this.saveThingExists) return;
            if (shaderfile) {
                console.log("Shaded : Adding Save Listener")
                this.saveThingExists = true;
                shaderfile.addEventListener("shaderSaved", (event) => {
                    compileShaderForSprite(event.name);
                });
            }
        }
        autoReRender = true;
        constructor() {
            this.shaderMode = "shader";
            this.screenMode = "screenFX";
            this.BUILTIN_SCREEN_SHADER = "____SHADED_BUILTIN_SCREEN____";
            this.splooksData = {};
            this.hsbCache = new Map();
            this.hsbCacheSize = 100;
            this.immediateUniformMode = false;
            this._uniformBatchMap = new Map();
            this._batchFrameCount = 0;
            this._batchUpdatePending = false;
            this._updateInterval = 1;
            this.subShaders = {};
            this.subShaderUniforms = {};
            this.stageShaderTracks = {};
            this.spriteShaderTracks = {};
            parentExtension = this;
            this._defaultTexture = null;
            this._initDefaultTexture();
            renderer.draw = this.customDrawFunction;
            renderer._drawThese = this.advDrawThese;
            this.stageBuffer = stageBuffer;
            runtime.ext_obviousalexc_shaded = this;
            this.autoReRender = true;
            this.saveThingExists = false;
            this.hsbCache = new Map();
            this.hsbCacheSize = 100;
            this._splooksReplacers = [];
            this._splooksLights = new Map();
            this._splooksMaskTexture = null;

            vm.runtime.on("targetWasRemoved", (clone) => {
                const cloneID = clone.drawableID;
                delete protectedDrawables[cloneID];
                delete clipBoxes[cloneID];
                delete textures[cloneID];
                delete spriteShaders[cloneID];
                delete renderSpriteShadersList[cloneID];
                delete layerZMap[cloneID];

                // ===== 清理置换贴图纹理 =====
                if (parentExtension.splooksData && parentExtension.splooksData[cloneID]) {
                    const data = parentExtension.splooksData[cloneID];
                    if (data.u_displacementTextureSP && data.u_displacementTextureSP !== parentExtension._defaultTexture) {
                        try {
                            gl.deleteTexture(data.u_displacementTextureSP);
                        } catch (e) {}
                    }
                    delete parentExtension.splooksData[cloneID];
                }

                if (parentExtension.spriteShaderTracks) {
                    delete parentExtension.spriteShaderTracks[cloneID];
                }

                // 图层被删除时，用原生 API 清理乒乓缓冲
                if (bufferInfo[cloneID]) {
                    bufferInfo[cloneID].forEach(buf => {
                        if (buf) {
                            try {
                                if (buf.framebuffer) {
                                    gl.deleteFramebuffer(buf.framebuffer);
                                }
                                if (buf.attachments) {
                                    buf.attachments.forEach(attachment => {
                                        if (attachment instanceof WebGLTexture) {
                                            gl.deleteTexture(attachment);
                                        } else if (attachment && attachment.texture) {
                                            gl.deleteTexture(attachment.texture);
                                        }
                                        if (attachment && attachment.renderbuffer) {
                                            gl.deleteRenderbuffer(attachment.renderbuffer);
                                        }
                                    });
                                }
                            } catch (e) {}
                        }
                    });
                    delete bufferInfo[cloneID];
                }

                delete skins[cloneID];
                renderer.dirty = true;
            });
            vm.runtime.on("PROJECT_LOADED", shaderfile._setupExtensionStorage);
            shaderfile._setupExtensionStorage();

            vm.runtime.on("PROJECT_LOADED", () => {
                setTimeout(() => {
                    this.initBuiltinScreenShadersOnly();
                    initBuiltinSplooksShader();
                    if (parentExtension.subShaders) {
                        Object.keys(parentExtension.subShaders).forEach(subName => {
                            const mainShader = parentExtension.subShaders[subName].mainShader;
                            if (shaderfile.programs[mainShader] && shaderfile.shaders[subName]) {
                                shaderfile.programs[subName] = {
                                    info: shaderfile.programs[mainShader].info,
                                    uniformDat: shaderfile.shaders[subName].uniformDat || {},
                                    uniformDec: shaderfile.programs[mainShader].uniformDec,
                                    attribDat: shaderfile.programs[mainShader].attribDat
                                };
                                if (parentExtension.subShaderUniforms[subName]) {
                                    shaderfile.programs[subName].uniformDat = parentExtension.subShaderUniforms[subName];
                                }
                            }
                        });
                    }
                    Object.keys(shaderfile.shaders).forEach(name => {
                        compileShaderForSprite(name);
                    });
                }, 500);
            });
            Scratch.vm.runtime.on("EXTENSION_ADDED", this.addSaveListeners);

            window.addEventListener("message", (event) => {
                let eventType = event.data.type;
                if (!eventType) return;
                switch (eventType) {
                    case "EXTENSION_REQUEST":
                        if (shaderfile.IFrame) {
                            shaderfile.IFrame.contentWindow.postMessage({
                                type: "ADD_EXTENSION",
                                URL: "https://pen-group.github.io/extensions/extensions/ShadedStamps/shaderEditorExtension.js"
                            }, shaderfile.IFrame.src);
                        }
                        break;
                    case "EDITOR_CLOSE":
                        if (shaderfile.IFrame && shaderfile.IFrame.closeIframe) {
                            shaderfile.IFrame.closeIframe();
                        }
                        shaderfile.dispatchEvent("editorClosed");
                        break;
                    case "DATA_SEND":
                        shaderfile.openShaderManager("save");
                        shaderfile.savingData = {
                            projectData: event.data.projectData,
                            fragShader: event.data.fragShader,
                            vertShader: event.data.vertShader,
                        };
                        break;
                    case "DATA_REQUEST":
                        shaderfile.openShaderManager("load");
                        break;
                    default:
                        break;
                }
            });

            document.addEventListener('keyup', (event) => {
                if (event.key == "F4" && shaderfile.IFrame && Array.from(document.body.children).includes(shaderfile.IFrame)) {
                    if (shaderfile.IFrame.closeIframe) {
                        shaderfile.IFrame.closeIframe();
                    }
                    shaderfile.dispatchEvent("editorClosed");
                }
            });

            let autoEnabled = false;
            let autoWidth = 480;
            let autoHeight = 360;

            this._setRenderSizeFunc = function(w, h) {
                if (w > 0 && h > 0) {
                    autoEnabled = true;
                    autoWidth = w;
                    autoHeight = h;
                    const pixelRatio = window.devicePixelRatio || 1;
                    renderer.resize(w / pixelRatio, h / pixelRatio);
                }
            };
            initBuiltinSplooksShader();
            this.initBuiltinScreenShadersOnly();
            setInterval(function() {
                if (autoEnabled) {
                    const pixelRatio = window.devicePixelRatio || 1;
                    renderer.resize(autoWidth / pixelRatio, autoHeight / pixelRatio);
                }
            }, 100);
        }
        getInfo() {
            const isShaderMode = this.shaderMode === "shader";
            const isSplooksMode = this.shaderMode === "splooks";
            const isCustomMode = this.screenMode === "custom";
            const isScreenFXMode = this.screenMode === "screenFX";

            const showCustom = isShaderMode && isCustomMode;
            const showScreenFX = isShaderMode && isScreenFXMode;
            const showSplooks = isSplooksMode;
            return {
                id: "shadertrack",
                name: "Shaded Track",
                color1: "#531478",
                color2: "#7500BA",
                color3: "#BF54FF",
                blockIconURI: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAAJcEhZcwAAHtUAAB7VAXWAw4sAAAYmSURBVFiFxZh/bFNVFMc/9+29/qAthW0gP5whiiC/BAIIKCpBA2QBNCKJCWKixl8xRhMSAUFiFBCNRhPjD/QPRInxFxCZRlFwLgQUgoIbCiGCEMLoxuZga9et7evxj/ZtfW1fV5DhSZrm3fbd97nnnu895zyFg40d9Lw4/XapptIfDVAiqe/09f6GNcrpnl4H6wku9S0oYG/DWpV9X6+CWQ9JgQiaZIOlxwEl3eM1jSlQvbegLLN5KAcu5bVc6G5fKcj1Xl+EsZKw0SeBQ0onnBsVRcPpwCgxGUgSlYZLCBxQBkK3Ny3YnY3rVF4PtqEwVJLHjX9wl6TYBcUX+NkS9xM3C0PmizcNGC8JKlWEyZ4wGtAsOj+oPrg6dOLZXky7TDnFnh/htUAjt1SGIGgC0CoeVp6uoKY6gHQ6w1kPseB04GqSPKJamVZ2nuC8FnAJiIsn6q/l+B4XZouWtd0pTzrGYBTFN61BbmppxljmAr+bvgJLO+PUveejeUMHmKYDnF0MXoQnuMCEYBvBe1vgfgMG9iWsPJz7fADJYzFUS2cOnLW4vGYC3ykPU/cP5K66Bpi9CKhgEAY3P9OfbdUN6Ee+BWJAbrxZ1yWAD2FsaRtlM1vgQQ9UTOGMNp9N9KOpJQZnanHJPrui03NqToAAceClC2X8uckP7bXAeDyM41H/1QQfm4RZMqMgnAYMxmSJRPD5E/CsBkPHckJ7gI8Zzdd1QwgfHIbeFssLZ81V0GKi2LzrKmJvHAU5BMA1CpbPBUbMRMOVWqmkttVatQb0I8loSTBvQBP+EWEYPAb0RdTLYLYfhvZ3wfUL6OogGmK7NzWX9AwowI/Kzb4PA/DtJpA4GjArCBNfAXHf7pgZKsTkbncrvlFRWCWgl3OcMdQC7W+Cdwf4W7fY4LqFIj1vsWURFKsj5Zz6shki6wCTvsDSCeB56FaU5rWvHmEISUaTYPJ1/0BlJ1w/mfqSSr4S2BYC9zEItG5FV7/aY06kC9gaK8qaRGPNjgoSnxwDDgIw0YB7HobEoKfQ0NLqS231rGQnD/ibYXgnLBgCJVP5IDmSH87BuVVgnAVDHcja1m4w66QtGhDg76TO/vUB2PEpkEABdw6Ffi8GSJaM6IodL+BVScrmNMGSOJSOoYPbaAxDaBX4asB/vsouBhFbiFhWFKB1YzMaG6L9SHx2ElrXAyaTgPtugdi4xWhi4AGWSISb9TAEgVtnEFWzeEO81HeC7ycIXKjCUD/niCEfTI+AmeeREuG06Hy/axDsrgMOoYCF/eHGp8Gr3c590s4UPcLIu0Iw3aRNDWcj49hzFk69DUa8wwaXebTks4KA9syQmiiCYnvMT2yDglAVYFIOLLoDShfPZEafKKPmh2COCfOnE+UGtp2A+s0Q2AieSE1Gji4MVxAwU5GZ55sC6kTn5dqhsPswyI9owGwXLLofksMWw20aLJhGRM3nMDeSOA+Bt8AX3YFLavKKoWjAnHotKzOodK1WHfXy/bKBsG8n0IEbWDgerl8zDoJjSKiJ7GYCr5yG8B9gmA0YUmPLs8UUbjbAzDIpX2boCuZ0/XMk7IXVxyH0KmCCAmNGECqX8g0jeScELbvAtxLc8cMFxdAjYLcYxLYFTtUvQJXyUH2yHI7/BuzumlS0UtoYQeg78L0AvuguXOws2ms5gE5lUk4cin0M4PfzfnjOBaG9QBIT2A7siYLEwd1+FPclwgFoTmKwxvI3OpIRCkC7Bmf3AtUA1AkceB/6vA6GnLlkOADdknwxnVZ2gGtd5VCeorwd/M21uNl5iWhpwEI9qt1zGXCSuYj83epFJfpCgJnnWyE4eylUOD0Vc75dFGDhxtruuXxbnbLe6fv17HgrBOdUlvcSWwqwWDHkG1eCYwxeNsDuqqInMeQ21kX1DP8ZsAgx5BxBGXCXSwzOgBSOt1y44iuRywJ4MWLI/N+VMq2mca3qblqyqhbb+JWH29K0PvV2qycxOJXlAvyuDD46exVlT5ZC/620qipORANU/KWRejfx36zrmXMHrBAnMVypeMu0LU3rFWS8PLKnuysvBifLefaC8hXyf8SbZZbnLHN0zsLy5b2bIrIsG8yyfwFqWGB6l5ATtAAAAABJRU5ErkJggg==",
                blocks: [{
                        func: "toggleShaderMode",
                        blockType: Scratch.BlockType.BUTTON,
                        text: "切换模式"
                    },
                    // ============================================================
                    // ==================== 着色器模式积木 ==========================
                    // ============================================================
                    {
                        blockType: Scratch.BlockType.BUTTON,
                        text: "着色器教程",
                        func: "openSite"
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        hideFromPalette: !showCustom,
                        text: "基础"
                    },
                    {
                        opcode: "setStageShader",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "将 [shader] 运用于屏幕",
                        hideFromPalette: !showCustom,
                        blockIconURI: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cdefs%3E%3ClinearGradient id='codeGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2300BFA5'/%3E%3Cstop offset='100%25' stop-color='%234A6DE5'/%3E%3C/linearGradient%3E%3ClinearGradient id='yGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23FF3366'%3E%3Canimate attributeName='stop-color' values='%23FF3366;%23FFCC00;%2333FF66;%233366FF;%23CC33FF;%23FF3366' dur='3s' repeatCount='indefinite'/%3E%3C/stop%3E%3Cstop offset='100%25' stop-color='%233366FF'%3E%3Canimate attributeName='stop-color' values='%233366FF;%23FF3366;%23FFCC00;%2333FF66;%233366FF;%23CC33FF' dur='3s' repeatCount='indefinite'/%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='7' y='26' font-size='22' font-family='monospace' fill='url(%23codeGrad)' font-weight='bold'%3E{%3C/text%3E%3Ctext x='29' y='26' font-size='22' font-family='monospace' fill='url(%23codeGrad)' font-weight='bold'%3E}%3C/text%3E%3Ctext x='25' y='27' font-size='20' font-family='Arial, sans-serif' fill='url(%23yGrad)' font-weight='bold' text-anchor='middle'%3EY%3C/text%3E%3Crect x='10' y='12' width='20' height='1.5' rx='0.8' fill='%234A6DE5' opacity='0.4'%3E%3Canimate attributeName='opacity' values='0.2;1;0.2' dur='1.5s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect x='10' y='17' width='13' height='1.5' rx='0.8' fill='%2300BFA5' opacity='0.4'%3E%3Canimate attributeName='opacity' values='0.2;1;0.2' dur='1.5s' begin='0.3s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect x='10' y='22' width='16' height='1.5' rx='0.8' fill='%239966FF' opacity='0.4'%3E%3Canimate attributeName='opacity' values='0.2;1;0.2' dur='1.5s' begin='0.6s' repeatCount='indefinite'/%3E%3C/rect%3E%3Cline x1='7' y1='33' x2='33' y2='33' stroke='%2300BFA5' stroke-width='1.2' stroke-linecap='round'%3E%3Canimate attributeName='x2' values='7;33;7' dur='2s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='1;0.3;1' dur='2s' repeatCount='indefinite'/%3E%3C/line%3E%3C/svg%3E",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            }
                        }
                    },
                    {
                        opcode: "setSpriteShader",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "将 [shader] 运用于自己",
                        hideFromPalette: !showCustom,
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            }
                        }
                    },
                    {
                        opcode: "setExtraShader",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "将 [shader] 运用于 [target] 扩展",
                        hideFromPalette: !showCustom,
                        arguments: {
                            target: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "extraTargets"
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            }
                        }
                    },
                    "---",
                    {
                        opcode: "clearShader",
                        hideFromPalette: !showCustom,
                        blockType: Scratch.BlockType.COMMAND,
                        text: "清除屏幕的着色器"
                    },
                    {
                        opcode: "clearSpriteShader",
                        hideFromPalette: !showCustom,
                        blockType: Scratch.BlockType.COMMAND,
                        text: "清除自己的着色器"
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        hideFromPalette: !showCustom,
                        text: "轨道系统"
                    },
                    {
                        opcode: "setStageShaderAtTrack",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将着色器 [shader] 用于屏幕轨道 [track]",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            track: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "removeStageShaderTrack",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "清除屏幕轨道 [track]",
                        arguments: {
                            track: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "setSpriteShaderAtTrack",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将着色器 [shader] 用于图层ID [id] 的轨道 [track]",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            id: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            track: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "removeSpriteShaderTrack",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "清除图层ID [id] 的轨道 [track]",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            track: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "clearAllStageTracks",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "清除屏幕所有轨道"
                    },
                    {
                        opcode: "clearAllSpriteTracksByID",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "清除图层ID [id] 的所有轨道",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "clearAllSpriteTracks",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "清除所有图层的所有轨道"
                    },
                    {
                        opcode: "getStageTrackCount",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showCustom,
                        text: "屏幕着色器轨道数量"
                    },
                    {
                        opcode: "getSpriteTrackCount",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showCustom,
                        text: "图层ID [id] 的着色器轨道数量",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "getStageShaderArray",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showCustom,
                        text: "屏幕着色器数组"
                    },
                    {
                        opcode: "getSpriteShaderArray",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showCustom,
                        text: "图层ID [id] 的着色器数组",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        hideFromPalette: !showCustom,
                        text: "管理"
                    },
                    {
                        opcode: "getAllShaders",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showCustom,
                        text: "作品中的着色器"
                    },
                    {
                        opcode: "getUsingStageShaders",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showCustom,
                        text: "使用中的屏幕的着色器"
                    },
                    {
                        opcode: "getUsingSpriteShaders",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showCustom,
                        text: "使用中的自己的着色器"
                    },
                    "---",
                    {
                        opcode: "importNewShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "导入名字为 [name] ,顶点为 [vert] ,片元为 [frag] 的着色器",
                        arguments: {
                            name: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "着色器名称"
                            },
                            vert: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "顶点着色器"
                            },
                            frag: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "片元着色器"
                            }
                        }
                    },
                    {
                        opcode: "importShaderFromPPS",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "从.pps文件中导入名字为 [name] ,文件为 [file] 的着色器",
                        arguments: {
                            name: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "着色器名称"
                            },
                            file: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ".pps文件"
                            }
                        }
                    },
                    {
                        opcode: "openShaderImporter",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "打开预览编辑导入器"
                    },
                    {
                        opcode: "deleteShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "删除 [shader]",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            }
                        }
                    },
                    {
                        opcode: "previewExistingShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "预览已添加的着色器 [shader]",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        hideFromPalette: !showCustom,
                        text: "副着色器"
                    },
                    {
                        opcode: "createSubShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "创建主着色器 [shader] 的副着色器 ID 为 [id]",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "mainShaders"
                            },
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "1"
                            }
                        }
                    },
                    {
                        opcode: "deleteSubShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "删除副着色器 [subShader]",
                        arguments: {
                            subShader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "subShaders"
                            }
                        }
                    },
                    {
                        opcode: "clearSubShadersOfMain",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "清空主着色器 [shader] 的所有副着色器",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "mainShaders"
                            }
                        }
                    },
                    {
                        opcode: "clearAllSubShaders",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "清空所有副着色器"
                    },
                    "---",
                    {
                        opcode: "getSubShaderCount",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showCustom,
                        text: "主着色器 [shader] 的副着色器数量",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "mainShaders"
                            }
                        }
                    },
                    {
                        opcode: "getSubShaderIdAt",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showCustom,
                        text: "主着色器 [shader] 第 [index] 项副着色器的 ID",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "mainShaders"
                            },
                            index: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        hideFromPalette: !showCustom,
                        text: "全局变量"
                    },
                    {
                        opcode: "getUniformValue",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showCustom,
                        text: "着色器 [shader] 的 [uniformName] 的值",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "u_speed"
                            }
                        }
                    },
                    {
                        opcode: "setImmediateUniformUpdate",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "Uniform 立即更新 [enabled]",
                        arguments: {
                            enabled: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "enabledOptions"
                            }
                        }
                    },
                    {
                        opcode: "getUniformCount",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showCustom,
                        text: "着色器 [shader] 的 Uniform 变量数组",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            }
                        }
                    },
                    {
                        opcode: "getUniformNameAt",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showCustom,
                        text: "着色器 [shader] 的第 [index] 项 Uniform 变量名",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            index: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "setTextureInShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将 [shader] 中的纹理 [uniformName] 设为 [texture]",
                        arguments: {
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Uniform"
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            texture: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[object WebGLTexture]"
                            }
                        }
                    },
                    {
                        opcode: "setNumberInShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将 [shader] 中的数字 [uniformName] 设为 [number]",
                        arguments: {
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Uniform"
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            number: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "setVec2InShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将 [shader] 中的二维向量 [uniformName] 设为 [numberX] [numberY]",
                        arguments: {
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Uniform"
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            numberX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            numberY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "setVec3InShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将 [shader] 中的三维向量 [uniformName] 设为 [numberX] [numberY] [numberZ]",
                        arguments: {
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Uniform"
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            numberX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            numberY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            numberZ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "setVec4InShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将 [shader] 中的四维向量 [uniformName] 设为 [numberX] [numberY] [numberZ] [numberW]",
                        arguments: {
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Uniform"
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            numberX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            numberY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            numberZ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            numberW: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "setBoolInShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将 [shader] 中的布尔 [uniformName] 设为 [value]",
                        arguments: {
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Uniform"
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            value: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "boolValues"
                            }
                        }
                    },
                    {
                        opcode: "setMat2InShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将 [shader] 中的 矩阵 [uniformName] 设为 [values]",
                        arguments: {
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Uniform"
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            values: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[1,0,0,1]"
                            }
                        }
                    },
                    {
                        opcode: "setFloatArrayInShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将 [shader] 中的浮点数组 [uniformName] 设为 [values]",
                        arguments: {
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Uniform"
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            values: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0,1,2,3]"
                            }
                        }
                    },
                    {
                        opcode: "setVec2ArrayInShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将 [shader] 中的 vec 数组 [uniformName] 设为 [values]",
                        arguments: {
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Uniform"
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            values: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[[0,0],[1,1],[2,2]]"
                            }
                        }
                    },
                    {
                        opcode: "setVec3ArrayInShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将 [shader] 中的 vec3 数组 [uniformName] 设为 [values]",
                        arguments: {
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Uniform"
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            values: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[[0,0,0],[1,1,1],[2,2,2]]"
                            }
                        }
                    },
                    {
                        opcode: "setVec4ArrayInShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将 [shader] 中的 vec4 数组 [uniformName] 设为 [values]",
                        arguments: {
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Uniform"
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            values: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[[0,0,0,0],[1,1,1,1],[2,2,2,2]]"
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        hideFromPalette: !showCustom,
                        text: "编译"
                    },
                    {
                        opcode: "compileShaderForSprite",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "编译运用于角色的 [shader] 并且 [control] scratch特效",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            control: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "control"
                            }
                        }
                    },
                    {
                        opcode: "shaderCompiledForSprites",
                        blockType: Scratch.BlockType.BOOLEAN,
                        hideFromPalette: !showCustom,
                        text: "已编译运用于角色的 [shader] ?",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        hideFromPalette: !showCustom,
                        text: "纹理绑定(图层纹理 → 着色器)"
                    },
                    {
                        opcode: "bindTextureToShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "将图层 [id] 的纹理绑定到着色器 [shader] 的 [uniformName]",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "u_texture"
                            }
                        }
                    },
                    {
                        opcode: "unbindTextureFromShader",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "解除着色器 [shader] 的 [uniformName] 绑定",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            },
                            uniformName: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "u_texture"
                            }
                        }
                    },
                    {
                        opcode: "clearShaderTextureBindings",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "清除着色器 [shader] 的所有纹理绑定",
                        arguments: {
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            }
                        }
                    },
                    {
                        opcode: "clearAllShaderTextureBindings",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showCustom,
                        text: "清除所有着色器的纹理绑定"
                    },
                    {
                        opcode: "applyScreenEffectToTrack2",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "将 [EFFECT] 应用于屏幕轨道 [TRACK]（副）",
                        arguments: {
                            EFFECT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "screenEffectList"
                            },
                            TRACK: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        },
                        hideFromPalette: !showScreenFX
                    },
                    {
                        opcode: "removeScreenTrack",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "移除屏幕轨道 [TRACK]",
                        arguments: {
                            TRACK: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "clearAllScreenTracks",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "清除所有屏幕轨道"
                    },
                    {
                        opcode: "getScreenTracks",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showScreenFX,
                        text: "屏幕轨道列表"
                    },
                    {
                        opcode: "getScreenTrackCount",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showScreenFX,
                        text: "屏幕轨道数量"
                    },
                    "---",

                    // ============================================================
                    // ===== 色散参数 =====
                    // ============================================================
                    {
                        opcode: "setChromaticOffset",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置色散偏移 红[X1][Y1] 绿[X2][Y2] 蓝[X3][Y3]",
                        arguments: {
                            X1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.005
                            },
                            Y1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            X2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            X3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: -0.005
                            },
                            Y3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },

                    // ============================================================
                    // ===== 故障参数 =====
                    // ============================================================
                    {
                        opcode: "setGlitchParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置故障 X强度[XI] Y强度[YI] 块大小[SZ] 速度[SPD]",
                        arguments: {
                            XI: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.05
                            },
                            YI: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.05
                            },
                            SZ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.05
                            },
                            SPD: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    // ============================================================
                    // ===== 分割线参数 =====
                    // ============================================================
                    {
                        opcode: "setSplitLineParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置分割线 宽高比[ASPECT] 中心X[CX] Y[CY] 角度[ANG] 左偏移[L] 右偏移[R]",
                        arguments: {
                            ASPECT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.778
                            },
                            CX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            CY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            ANG: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            L: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.1
                            },
                            R: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: -0.1
                            }
                        }
                    },

                    // ============================================================
                    // ===== 水参数 =====
                    // ============================================================
                    {
                        opcode: "setWaterParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置水 水位[Y] 透明度[A] 幅度[AMP] 密度[DEN] 速度[SPD] 模糊[BLUR] 衰减[DECAY] 模式[MODE]",
                        arguments: {
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.8
                            },
                            AMP: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.02
                            },
                            DEN: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 30
                            },
                            SPD: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            BLUR: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            },
                            DECAY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.95
                            },
                            MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "waterMode"
                            }
                        }
                    },

                    // ============================================================
                    // ===== 镜头冲击参数 =====
                    // ============================================================
                    {
                        opcode: "setLensBoomParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置镜头冲击 宽高比[ASPECT] 强度[STR]",
                        arguments: {
                            ASPECT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.778
                            },
                            STR: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.3
                            }
                        }
                    },

                    // ============================================================
                    // ===== 天使光参数 =====
                    // ============================================================
                    {
                        opcode: "setAngelLightParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置天使光 中心X[CX] Y[CY] 强度[INT] 衰减[FAL] 透明度[A]",
                        arguments: {
                            CX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            CY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            INT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.1
                            },
                            FAL: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            },
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    // ============================================================
                    // ===== 画面变换参数 =====
                    // ============================================================
                    {
                        opcode: "setTransformParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置画面变换 宽高比[ASPECT] 偏移X[OX] Y[OY] 角度[ANG] 缩放[SCALE] 饱和度[SAT] 亮度[BRI] 对比度[CON] 色调[HUE]",
                        arguments: {
                            ASPECT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.778
                            },
                            OX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            OY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            ANG: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            SCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            SAT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            BRI: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            CON: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            HUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },

                    // ============================================================
                    // ===== 3D平面参数 =====
                    // ============================================================
                    {
                        opcode: "set3DPlaneParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置3D平面 宽高比[ASPECT] 旋转X[RX] Y[RY] Z[RZ] 位置X[PX] Y[PY] 缩放[SCALE] 背景亮度[BRI]",
                        arguments: {
                            ASPECT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.778
                            },
                            RX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            RY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            RZ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            PX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            PY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            SCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            BRI: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.3
                            }
                        }
                    },

                    // ============================================================
                    // ===== 方框2参数 =====
                    // ============================================================
                    {
                        opcode: "setCropBoxParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置方框2 宽高比[ASPECT] 中心X[CX] Y[CY] 宽[W] 高[H] 边框[SZ] 背景亮度[BRI] 饱和度[SAT] 模糊[BLUR] 对比度[CON]",
                        arguments: {
                            ASPECT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.778
                            },
                            CX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            CY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            W: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            H: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            SZ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.005
                            },
                            BRI: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.3
                            },
                            SAT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            BLUR: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            },
                            CON: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.8
                            }
                        }
                    },
                    // ============================================================
                    // ===== xy简单扭曲 =====
                    // ============================================================
                    {
                        opcode: "setXYWaveParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置xy扭曲 宽高比[ASPECT] 速度X[SX] Y[SY] 幅度X[AX] Y[AY] 频率X[FX] Y[FY]",
                        arguments: {
                            ASPECT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.778
                            },
                            SX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            SY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.3
                            },
                            AX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.02
                            },
                            AY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.015
                            },
                            FX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.5
                            },
                            FY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            }
                        }
                    },

                    // ============================================================
                    // ===== 水滴纹 =====
                    // ============================================================
                    {
                        opcode: "setDropletParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置水滴纹 宽高比[ASPECT] 数量[COUNT] 速度[SPEED] 强度[STRENGTH] 缩放[SCALE] 衰减[FADE]",
                        arguments: {
                            ASPECT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.778
                            },
                            COUNT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 30
                            },
                            SPEED: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            STRENGTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.3
                            },
                            SCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.8
                            },
                            FADE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.0
                            }
                        }
                    },

                    // ============================================================
                    // ===== 3D正方体 =====
                    // ============================================================
                    {
                        opcode: "setCubeParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置3D正方体 宽高比[ASPECT] 大小[SIZE] 旋转X[RX] Y[RY] Z[RZ] 位置X[PX] Y[PY] 裁剪X[CX] Y[CY] 裁剪宽[CW] 背景透明度[BG]",
                        arguments: {
                            ASPECT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.778
                            },
                            SIZE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.8
                            },
                            RX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            RY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.3
                            },
                            RZ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            PX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            PY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            CX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            CY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            CW: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.8
                            },
                            BG: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    // ============================================================
                    // ===== 电视机效果 =====
                    // ============================================================
                    {
                        opcode: "setTVParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置电视机效果 扫描线[SCAN] 噪点[NOISE] 色差[CHROMA] 暗角[VIGNETTE]",
                        arguments: {
                            SCAN: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            NOISE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.3
                            },
                            CHROMA: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.3
                            },
                            VIGNETTE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            }
                        }
                    },
                    {
                        opcode: "setWaterRippleParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置水面波纹 宽高比[ASPECT] 中心X[CX] Y[CY] 速度[SPEED] 强度[STRENGTH] 密度[DENSITY] 衰减[DECAY]",
                        arguments: {
                            ASPECT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.778
                            },
                            CX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            CY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            SPEED: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            },
                            STRENGTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            DENSITY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.5
                            },
                            DECAY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "setWaterRealParams",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showScreenFX,
                        text: "设置真实水 宽高比[ASP] 水位[LV] 波浪高[WH]密度[WD]速度[WS] 波纹数[RC]速度[RS]强度[RST]大小[RSZ]寿命[RL]频率[RF] 絮状密度[FD]亮度[FB]速度[FS] 水色R[CR]G[CG]B[CB]强度[CS]亮度[BRI]",
                        arguments: {
                            ASP: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.778
                            },
                            LV: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            WH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.0
                            },
                            WD: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 3.0
                            },
                            WS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.0
                            },
                            RC: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 15.0
                            },
                            RS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            RST: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            RSZ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            RL: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2.0
                            },
                            RF: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2.0
                            },
                            FD: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 3.0
                            },
                            FB: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            FS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.0
                            },
                            CR: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.2
                            },
                            CG: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.4
                            },
                            CB: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.8
                            },
                            CS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            BRI: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.8
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.XML,
                        hideFromPalette: !showSplooks,
                        xml: `<sep gap="24"/><label text="外观整合着色器" color="#9966FF"/><sep gap="0"/>`,
                    },
                    {
                        opcode: "splooksGetDrawableID",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showSplooks,
                        text: "自己的图层ID",
                    },
                    {
                        opcode: "splooksEnable",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "启用图层 [DRAWABLE] 的外观效果",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksDisable",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "关闭图层 [DRAWABLE] 的外观效果",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksResetAll",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "重置图层 [DRAWABLE] 的所有外观效果",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksClearCache",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "清除所有外观缓存",
                    },
                    "---",
                    {
                        opcode: "splooksTint",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "设置图层 [DRAWABLE] 的色调为 [COLOR]",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            }
                        }
                    },
                    {
                        opcode: "splooksApplyHSB",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "图层 [DRAWABLE] 应用色相 [HUE] 饱和度 [SAT]% 亮度 [BRI]%",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            HUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            SAT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            BRI: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksHSBToHex",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showSplooks,
                        text: "色相 [HUE] 饱和度 [SAT]% 亮度 [BRI]% 转颜色值",
                        arguments: {
                            HUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            SAT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            BRI: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksReplaceColor",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "在图层 [DRAWABLE] 中将 [COLOR1] 替换为 [COLOR2] 柔和度 [VALUE]",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            COLOR1: {
                                type: Scratch.ArgumentType.COLOR
                            },
                            COLOR2: {
                                type: Scratch.ArgumentType.COLOR
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    },
                    {
                        opcode: "splooksResetColor",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "重置图层 [DRAWABLE] 中 [COLOR] 的颜色替换器",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            }
                        }
                    },
                    {
                        opcode: "splooksResetAllReplacers",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "重置图层 [DRAWABLE] 中所有颜色替换器",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksSetColorAlpha",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "设置图层 [DRAWABLE] 中 [COLOR] 透明度为 [ALPHA]% 柔和度 [SOFT]",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            },
                            ALPHA: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
                            },
                            SOFT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    },
                    {
                        opcode: "splooksResetColorAlpha",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "重置图层 [DRAWABLE] 中 [COLOR] 的透明度",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            }
                        }
                    },
                    {
                        opcode: "splooksResetAllAlphas",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "重置图层 [DRAWABLE] 中所有颜色透明度",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksSetGreenScreen",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "设置图层 [DRAWABLE] 绿幕颜色为 [COLOR] 强度 [STR]",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR
                            },
                            STR: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 20
                            }
                        }
                    },
                    {
                        opcode: "splooksResetGreenScreen",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "重置图层 [DRAWABLE] 的绿幕效果",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksSetEffect",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "设置图层 [DRAWABLE] 的 [EFFECT] 为 [VALUE]",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            EFFECT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "SPLOOKS_EFFECTS"
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksGetEffect",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showSplooks,
                        text: "图层 [DRAWABLE] 的 [EFFECT] 效果值",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            EFFECT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "SPLOOKS_EFFECTS"
                            }
                        }
                    },
                    {
                        opcode: "splooksWarp",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "⚠扭曲图层 [DRAWABLE] 到 x1:[X1] y1:[Y1] x2:[X2] y2:[Y2] x3:[X3] y3:[Y3] x4:[X4] y4:[Y4]（会改变宽高）",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            X1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: -100
                            },
                            Y1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            X2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            Y2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            X3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: -100
                            },
                            Y3: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: -100
                            },
                            X4: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            Y4: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: -100
                            }
                        }
                    },
                    {
                        opcode: "splooksWarpDisable",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "关闭图层 [DRAWABLE] 的四点扭曲",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksMask",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "用图像 [IMAGE] 遮罩图层 [DRAWABLE]",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            IMAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "https://extensions.turbowarp.org/dango.png"
                            }
                        }
                    },
                    {
                        opcode: "splooksSetPointLight",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "设置图层 [DRAWABLE] 点光源编号 [ID]: X[X] Y[Y] 颜色 [COLOR] 范围 [R] 强度 [INT] 透明 [A] 模式 [MODE]",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "1"
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: "#FFFFFF"
                            },
                            R: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
                            },
                            INT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "LIGHT_MODES"
                            }
                        }
                    },
                    {
                        opcode: "splooksRemovePointLight",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "删除图层 [DRAWABLE] 中编号 [ID] 的点光源",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "1"
                            }
                        }
                    },
                    {
                        opcode: "splooksClearAllLights",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "清除图层 [DRAWABLE] 中所有点光源",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksSetBrightnessToAlpha",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "将图层 [DRAWABLE] 的亮度转透明度 强度 [STR]%",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            STR: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },
                    {
                        opcode: "splooksResetBrightnessToAlpha",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "重置图层 [DRAWABLE] 的亮度转透明度",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksSetCircleMask",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "设置图层 [DRAWABLE] 圆形蒙版: 中心X[CX] Y[CY] 宽[W] 高[H] 羽化[F]",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            CX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            CY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            W: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            H: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            F: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.05
                            }
                        }
                    },
                    {
                        opcode: "splooksResetCircleMask",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "重置图层 [DRAWABLE] 的圆形蒙版",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksSetLightBeam",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "设置图层 [DRAWABLE] 光线扫描: 起点X[X] Y[Y] 宽[W] 角度[A] 长[L] 渐变[F] 颜色[C] 强度[I] 模式[M]",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            W: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.1
                            },
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            L: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            F: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.0
                            },
                            C: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: "#FFFFFF"
                            },
                            I: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            },
                            M: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "LIGHT_MODES"
                            }
                        }
                    },
                    {
                        opcode: "splooksResetLightBeam",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "重置图层 [DRAWABLE] 的光线扫描",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksSetBrightness",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "设置图层 [DRAWABLE] 的亮度为 [VALUE]",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksGetBrightness",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !showSplooks,
                        text: "图层 [DRAWABLE] 的亮度值",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksWaveEnable",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "启用图层 [DRAWABLE] 波浪扭曲 X振幅[XAMP] X频率[XFREQ] X时间[XTIME] Y振幅[YAMP] Y频率[YFREQ] Y时间[YTIME] 宽缩放[WSCALE] 高缩放[HSCALE]",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            XAMP: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            XFREQ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            },
                            XTIME: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            YAMP: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            YFREQ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            },
                            YTIME: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            WSCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            HSCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "splooksWaveDisable",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "关闭图层 [DRAWABLE] 波浪扭曲",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksNineSliceEnable",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "⚠启用图层 [DRAWABLE] 九宫格 左[L] 右[R] 上[T] 下[B] 目标宽[TW] 目标高[TH]（会改变宽高）",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            L: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 20
                            },
                            R: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 20
                            },
                            T: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 20
                            },
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 20
                            },
                            TW: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200
                            },
                            TH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200
                            }
                        }
                    },
                    {
                        opcode: "splooksNineSliceDisable",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "关闭图层 [DRAWABLE] 九宫格拉伸",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksDisplacement",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "图层 [DRAWABLE] 置换贴图 [TEXTURE] 水平 [X] 垂直 [Y] 强度 [INTENSITY] 模式 [MODE]",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            TEXTURE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            INTENSITY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "DISPLACEMENT_MODES"
                            }
                        }
                    },
                    {
                        opcode: "splooksDisplacementDisable",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "关闭图层 [DRAWABLE] 置换贴图",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "splooksDisplacementReset",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !showSplooks,
                        text: "重置图层 [DRAWABLE] 置换贴图",
                        arguments: {
                            DRAWABLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "🔧 公共功能"
                    },
                    "---",
                    {
                        opcode: "getID",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "获取[TARGET]的ID图层",
                        arguments: {
                            TARGET: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "TARGETS"
                            }
                        }
                    },
                    {
                        opcode: "getOwner",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "获取图层ID [ID]的所有者",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "getIDByOwner",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "获取所有者 [OWNER] 的图层ID",
                        arguments: {
                            OWNER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "舞台"
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "图层保护(不受屏幕着色器影响)"
                    },
                    {
                        opcode: "protectDrawable",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "保护图层 ID [id] 不受屏幕着色器影响",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "unprotectDrawable",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "取消图层 ID [id] 的保护",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "clearAllProtected",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "取消所有图层的保护"
                    },
                    {
                        opcode: "getProtectedDrawables",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "被保护的图层ID列表"
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "裁剪与混色"
                    },
                    {
                        opcode: "setClipBox",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "将裁剪框设为 x1: [X1] y1: [Y1] x2: [X2] y2: [Y2]",
                        arguments: {
                            X1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            X2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            Y2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },
                    {
                        opcode: "clearClipBox",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "清除裁剪框"
                    },
                    {
                        opcode: "getClipBox",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "裁剪框的 [PROP]",
                        arguments: {
                            PROP: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "宽度",
                                menu: "clipProps"
                            }
                        }
                    },
                    {
                        opcode: "setBlend",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "将 [blendMode] 混合运用于自己",
                        arguments: {
                            blendMode: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "blendModeFull"
                            }
                        }
                    },
                    {
                        opcode: "getBlend",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "自己的混合模式"
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "设置"
                    },
                    {
                        opcode: "setSetting",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "将 [setting] 设置为 [value]",
                        arguments: {
                            setting: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "settings"
                            },
                            value: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "autorender"
                            }
                        }
                    },
                    {
                        opcode: "showCacheMonitor",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "(测试)显示缓存监视器"
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "渲染尺寸"
                    },
                    {
                        opcode: "setRenderSize",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "强制设置画布渲染尺寸 宽:[X] 高:[Y]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 480
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 360
                            }
                        }
                    },
                    {
                        opcode: "setRenderMode",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "设置渲染模式为 [MODE]",
                        arguments: {
                            MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "renderModes"
                            }
                        }
                    },
                    {
                        opcode: "getStageSize",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "舞台的 [DIMENSION]",
                        arguments: {
                            DIMENSION: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "stageDimensions"
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "渲染顺序(但不影响广播)"
                    },
                    {
                        opcode: "setCustomDrawOrderEnabled",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "自定义渲染顺序 [enabled]",
                        arguments: {
                            enabled: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "enabledOptions"
                            }
                        }
                    },
                    {
                        opcode: "isCustomDrawOrderEnabled",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "自定义渲染顺序已启用?"
                    },
                    {
                        opcode: "getDrawOrder",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "渲染顺序列表"
                    },
                    {
                        opcode: "getDrawOrderLength",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "渲染顺序长度"
                    },
                    {
                        opcode: "setLayerZ",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "将图层 [ID] 的 Z 设为 [Z]",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "changeLayerZ",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "将图层 [ID] 的 Z 增加 [STEP]",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            STEP: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "getLayerZ",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "图层 [ID] 的 Z 值",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: "sortLayers",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "(逐步模拟)按 Z 值 [ORDER] 排序",
                        arguments: {
                            ORDER: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "sortOrder"
                            }
                        }
                    },
                    {
                        opcode: "getLayerBounds",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "图层 [ID] 的 [PROP]",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            PROP: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "boundsProps"
                            }
                        }
                    },
                    {
                        opcode: "getDescrepency",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "舞台的 [dimension] 缩放倍增",
                        arguments: {
                            dimension: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "dimensions"
                            }
                        }
                    },
                    {
                        opcode: "getStageTexture",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "屏幕的纹理"
                    },
                    {
                        opcode: "getCostumeTexture",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "[name] 的纹理",
                        arguments: {
                            name: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "costumeMenu"
                            }
                        }
                    },
                    {
                        opcode: "maskShaderExample",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "遮罩着色器示例代码",
                        arguments: {}
                    },
                    {
                        opcode: "supportsWEBGL_TWO",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "支持GLSL3.0?"
                    },
                    {
                        opcode: "defaultShader",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "默认的GLSL版本为 [ver] 的 [type] 着色器",
                        arguments: {
                            ver: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "ver"
                            },
                            type: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "type"
                            }
                        }
                    },
                    {
                        opcode: "getShaderSourceCode",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "[shader] 的 [type] 着色器的源代码",
                        arguments: {
                            type: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "type"
                            },
                            shader: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "shadersAndStageALT"
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.BUTTON,
                        text: "关于改版版本",
                        func: "openAboutMenu"
                    }
                ],
                menus: {
                    screenEffectList: {
                        acceptReporters: true,
                        items: [{
                                text: "色散(屏幕)",
                                value: "____SCREEN_CHROMATIC____"
                            },
                            {
                                text: "故障(屏幕)",
                                value: "____SCREEN_GLITCH____"
                            },
                            {
                                text: "分割线(屏幕)",
                                value: "____SCREEN_SPLIT____"
                            },
                            {
                                text: "水(屏幕)",
                                value: "____SCREEN_WATER____"
                            },
                            {
                                text: "镜头冲击(屏幕)",
                                value: "____SCREEN_LENS____"
                            },
                            {
                                text: "天使光(屏幕)",
                                value: "____SCREEN_ANGEL____"
                            },
                            {
                                text: "画面变换(屏幕)",
                                value: "____SCREEN_TRANSFORM____"
                            },
                            {
                                text: "3D平面(屏幕)",
                                value: "____SCREEN_3DPLANE____"
                            },
                            {
                                text: "方框2(屏幕)",
                                value: "____SCREEN_CROP____"
                            },
                            {
                                text: "xy扭曲(屏幕)",
                                value: "____SCREEN_XYWAVE____"
                            },
                            {
                                text: "水滴纹(屏幕)",
                                value: "____SCREEN_DROPLET____"
                            },
                            {
                                text: "3D正方体(屏幕)",
                                value: "____SCREEN_CUBE____"
                            },
                            {
                                text: "电视机(屏幕)",
                                value: "____SCREEN_TV____"
                            },
                            {
                                text: "水面波纹(屏幕)",
                                value: "____SCREEN_WATER_RIPPLE____"
                            },
                            {
                                text: "真实水(屏幕)",
                                value: "____SCREEN_WATER_REAL____"
                            }
                        ]
                    },
                    DISPLACEMENT_MODES: {
                        acceptReporters: true,
                        items: [{
                                text: "正常",
                                value: "0"
                            },
                            {
                                text: "反转",
                                value: "1"
                            }
                        ]
                    },
                    waterMode: {
                        acceptReporters: true,
                        items: [{
                                text: "下方倒影",
                                value: "0"
                            },
                            {
                                text: "上方倒影",
                                value: "1"
                            }
                        ]
                    },
                    stageDimensions: {
                        acceptReporters: true,
                        items: [{
                                text: "宽度",
                                value: "width"
                            },
                            {
                                text: "高度",
                                value: "height"
                            }
                        ]
                    },
                    renderModes: {
                        acceptReporters: true,
                        items: [{
                                text: "平滑模式",
                                value: "smooth"
                            },
                            {
                                text: "像素化模式",
                                value: "pixelated"
                            }
                        ]
                    },
                    enabledOptions: {
                        acceptReporters: true,
                        items: [{
                                text: "启用",
                                value: "on"
                            },
                            {
                                text: "关闭",
                                value: "off"
                            }
                        ]
                    },
                    sortOrder: {
                        acceptReporters: true,
                        items: [{
                                text: "从小到大",
                                value: "asc"
                            },
                            {
                                text: "从大到小",
                                value: "desc"
                            }
                        ]
                    },
                    boundsProps: {
                        acceptReporters: true,
                        items: [{
                                text: "X坐标",
                                value: "x"
                            },
                            {
                                text: "Y坐标",
                                value: "y"
                            },
                            {
                                text: "左边界",
                                value: "left"
                            },
                            {
                                text: "右边界",
                                value: "right"
                            },
                            {
                                text: "上边界",
                                value: "top"
                            },
                            {
                                text: "下边界",
                                value: "bottom"
                            }
                        ]
                    },
                    mainShaders: {
                        items: "mainShadersMenu",
                        acceptReporters: true
                    },
                    subShaders: {
                        items: "subShadersMenu",
                        acceptReporters: true
                    },
                    boolValues: {
                        items: [{
                                text: "真",
                                value: "true"
                            },
                            {
                                text: "假",
                                value: "false"
                            }
                        ]
                    },
                    TARGETS: {
                        acceptReporters: true,
                        items: "_getTargets"
                    },
                    blendModeFull: {
                        acceptReporters: true,
                        items: [{
                                text: "默认",
                                value: "default"
                            },
                            {
                                text: "默认后方",
                                value: "default behind"
                            },
                            {
                                text: "加法",
                                value: "additive"
                            },
                            {
                                text: "加法(带透明度)",
                                value: "additive with alpha"
                            },
                            {
                                text: "减法",
                                value: "subtract"
                            },
                            {
                                text: "减法(带透明度)",
                                value: "subtract with alpha"
                            },
                            {
                                text: "正片叠底",
                                value: "multiply"
                            },
                            {
                                text: "反色",
                                value: "invert"
                            },
                            {
                                text: "遮罩",
                                value: "mask"
                            },
                            {
                                text: "擦除",
                                value: "erase"
                            },
                            {
                                text: "亮度叠加",
                                value: "luma_overlay"
                            },
                            {
                                text: "软光",
                                value: "soft_light"
                            },
                            {
                                text: "强光",
                                value: "hard_light"
                            },
                            {
                                text: "颜色加深",
                                value: "color_burn"
                            },
                            {
                                text: "线性减淡",
                                value: "linear_dodge"
                            },
                            {
                                text: "颜色叠加",
                                value: "color_overlay"
                            },
                            {
                                text: "饱和度增强",
                                value: "saturation_enhance"
                            },
                            {
                                text: "预乘混合",
                                value: "premultiplied"
                            },
                        ]
                    },
                    clipProps: {
                        acceptReporters: true,
                        items: [{
                                text: "宽度",
                                value: "width"
                            },
                            {
                                text: "高度",
                                value: "height"
                            },
                            {
                                text: "左x",
                                value: "min x"
                            },
                            {
                                text: "下y",
                                value: "min y"
                            },
                            {
                                text: "右x",
                                value: "max x"
                            },
                            {
                                text: "上y",
                                value: "max y"
                            }
                        ]
                    },
                    shadersAndStageALT: {
                        items: "shaderMenuAndStage",
                        acceptReporters: true
                    },
                    extraTargets: {
                        items: [{
                                text: "画笔",
                                value: "pen"
                            },
                            {
                                text: "简单3D",
                                value: "simple3D"
                            },
                            {
                                text: "视频侦测",
                                value: "videoSensing"
                            }
                        ]
                    },
                    dimensions: {
                        items: [{
                                text: "宽度",
                                value: "width"
                            },
                            {
                                text: "高度",
                                value: "height"
                            }
                        ]
                    },
                    settings: {
                        items: [{
                                text: "着色器自动动画",
                                value: "auto re-render"
                            },
                            {
                                text: "兼容模式",
                                value: "compatibility mode"
                            },
                            {
                                text: "多重渲染",
                                value: "multi render"
                            }
                        ]
                    },
                    autorender: {
                        items: [{
                                text: "开启",
                                value: "on"
                            },
                            {
                                text: "关闭",
                                value: "off"
                            }
                        ]
                    },
                    control: {
                        items: [{
                                text: "启用",
                                value: "enable"
                            },
                            {
                                text: "禁用",
                                value: "disable"
                            }
                        ]
                    },
                    ver: {
                        items: ["1.0", "3.0"]
                    },
                    type: {
                        items: [{
                                text: "顶点",
                                value: "vertex"
                            },
                            {
                                text: "片元",
                                value: "fragment"
                            }
                        ]
                    },
                    SPLOOKS_EFFECTS: {
                        acceptReporters: true,
                        items: [{
                                text: "饱和度",
                                value: "saturation"
                            },
                            {
                                text: "不透明度",
                                value: "opaque"
                            },
                            {
                                text: "对比度",
                                value: "contrast"
                            },
                            {
                                text: "色调分离",
                                value: "posterize"
                            },
                            {
                                text: "老照片",
                                value: "sepia"
                            },
                            {
                                text: "泛光",
                                value: "bloom"
                            },
                            {
                                text: "亮度",
                                value: "brightness"
                            }
                        ]
                    },
                    LIGHT_MODES: {
                        acceptReporters: true,
                        items: [{
                                text: "正常",
                                value: "normal"
                            },
                            {
                                text: "叠加",
                                value: "add"
                            },
                            {
                                text: "减少",
                                value: "subtract"
                            },
                            {
                                text: "图章",
                                value: "stamp"
                            },
                            {
                                text: "柔光",
                                value: "soft"
                            }
                        ]
                    },
                    costumeMenu: {
                        items: "costumeMenuFunction",
                        acceptReporters: true
                    }
                }
            };
        }
        // ===== 切换模式 =====
        toggleShaderMode() {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); z-index: 999999;
        display: flex; justify-content: center; align-items: center;
    `;

            const modal = document.createElement('div');
            modal.style.cssText = `
        background: #1a1a2e; padding: 30px; border-radius: 16px;
        min-width: 320px; box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        color: white; font-family: Arial, sans-serif;
    `;

            modal.innerHTML = `
        <h3 style="margin:0 0 12px 0;color:#eee;">选择模式</h3>
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
            <button class="modeOption" data-value="custom" style="padding:12px 16px; border-radius:8px; border:2px solid #0f3460; background:#0f3460; color:white; cursor:pointer; font-size:16px; text-align:left;">自定义着色器模式</button>
            <button class="modeOption" data-value="screenFX" style="padding:12px 16px; border-radius:8px; border:2px solid #0f3460; background:#0f3460; color:white; cursor:pointer; font-size:16px; text-align:left;">屏幕特效模式</button>
            <button class="modeOption" data-value="splooks" style="padding:12px 16px; border-radius:8px; border:2px solid #0f3460; background:#0f3460; color:white; cursor:pointer; font-size:16px; text-align:left;">外观模式</button>
        </div>
    `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            modal.querySelectorAll('.modeOption').forEach(btn => {
                btn.onmouseenter = () => {
                    btn.style.borderColor = '#e94560';
                    btn.style.background = '#1a1a3e';
                };
                btn.onmouseleave = () => {
                    btn.style.borderColor = '#0f3460';
                    btn.style.background = '#0f3460';
                };
                btn.onclick = () => {
                    const value = btn.dataset.value;
                    overlay.remove();

                    switch (value) {
                        case 'custom':
                            this.shaderMode = 'shader';
                            this.screenMode = 'custom';
                            break;
                        case 'screenFX':
                            this.shaderMode = 'shader';
                            this.screenMode = 'screenFX';
                            if (shaderfile.programs[this.BUILTIN_SCREEN_SHADER]) {
                                this.setStageShader({
                                    shader: this.BUILTIN_SCREEN_SHADER
                                });
                            }
                            break;
                        case 'splooks':
                            this.shaderMode = 'splooks';
                            break;
                    }

                    Scratch.vm.extensionManager.refreshBlocks();
                    renderer.dirty = true;
                };
            });

            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.remove();
            };
        }
        getDescrepency({
            dimension
        }) {
            if (dimension == "width") {
                return gl.canvas.width / renderer._nativeSize[0];
            }
            return gl.canvas.height / renderer._nativeSize[1];
        }
        openSite() {
            window.open("https://b23.tv/7HmXoqv");
        }

        async openShaderEditor() {
            if (shaderfile) {
                shaderfile._setupTheme();
                alert('即将打开pen+着色器编辑器.\n友情提示:如遇"连接已重置",请点击鼠标右键,选择"重新加载框架"即可;或者按下F4键关闭编辑器');
                shaderfile.openShaderEditor();
            }
        }
        openAboutMenu() {
            alert("当前版本:改版v8.8332 Release\n\n原扩展作者:ObviousAlexC\n额外版作者:DustDot\n改版作者:YL_YOLO");
        }
        compileShaderForSprite({
            shader,
            control
        }) {
            applyScratchEffects = control == "enable" ? true : false;
            compileShaderForSprite(shader);
            applyScratchEffects = true;
        }
        shaderCompiledForSprites({
            shader
        }) {
            if (shaderfile) {
                if (recompiledShaders[shader]) return true;
            }
            return false;
        }
        shaderMenu() {
            if (shaderfile) {
                return shaderfile.shaderMenu();
            }
            return [];
        }
        shaderMenuAndStage() {
            if (shaderfile) {
                const hiddenShaders = [
                    "____SHADED_BUILTIN_SPLOOKS____",
                    "____SCREEN_CHROMATIC____",
                    "____SCREEN_GLITCH____",
                    "____SCREEN_SPLIT____",
                    "____SCREEN_WATER____",
                    "____SCREEN_LENS____",
                    "____SCREEN_ANGEL____",
                    "____SCREEN_TRANSFORM____",
                    "____SCREEN_3DPLANE____",
                    "____SCREEN_CROP____",
                    "____SCREEN_XYWAVE____",
                    "____SCREEN_DROPLET____",
                    "____SCREEN_CUBE____",
                    "____SCREEN_TV____",
                    "____SCREEN_WATER_RIPPLE____",
                    "____SCREEN_WATER_REAL____"
                ];
                let returnedShaders = [{
                    value: "____PEN_PLUS__NO__SHADER____",
                    text: "无着色器"
                }];
                const allShaders = Object.keys(shaderfile.shaders)
                    .filter(n => !hiddenShaders.includes(n));
                allShaders.forEach(shader => {
                    returnedShaders.push({
                        value: shader,
                        text: shader
                    });
                });
                return returnedShaders;
            }
            return [{
                value: "____PEN_PLUS__NO__SHADER____",
                text: "无着色器"
            }];
        }
        costumeMenuFunction() {
            if (!runtime) return ["no costumes?"];
            if (!runtime._editingTarget) return ["no costumes?"];
            if (!runtime._editingTarget.sprite) return ["no costumes?"];

            const myCostumes = runtime._editingTarget.sprite.costumes;

            let readCostumes = [];
            for (
                let curCostumeID = 0; curCostumeID < myCostumes.length; curCostumeID++
            ) {
                const currentCostume = myCostumes[curCostumeID].name;
                readCostumes.push(currentCostume);
            }

            return readCostumes;
        }
        resetBuffer() {
            currentFrameBuffer = null;
            renderer.dirty = true;
        }
        setStageShaderAlt(args, util) {
            this.setStageShader(args, util);
        }
        setStageShader({
            shader
        }, util) {
            if (shader == "____PEN_PLUS__NO__SHADER____") {
                this.resetBuffer();
                return;
            }
            if (currentFrameBuffer != stageBuffer) {
                currentFrameBuffer = stageBuffer;
            }
            if (multiRender) {
                renderShadersList.push(shader);
                //console.log(renderShadersList);
            }
            currentShader = shader;
            if (!shaderfile.shaders[shader]) {
                this.resetBuffer();
                return;
            }
            renderer.dirty = true;
        }
        setSpriteSkinShader({
            shader
        }, util) {
            const drawableID = util.target.drawableID;
            if (shader == "____PEN_PLUS__NO__SHADER____") {
                delete spriteShaders[drawableID];
                renderer.dirty = true;
                return;
            }
            if (!shaderfile.shaders[shader]) {
                delete spriteShaders[drawableID];
                renderer.dirty = true;
                return;
            }
            spriteShaders[drawableID] = shader;
            renderer.dirty = true;

            //Get the current sprite from stage.
            const drawable = renderer._allDrawables[drawableID];
            const drawableScale = drawable.scale;
            drawable.updateScale([
                200 / gl.canvas.width * renderer._nativeSize[0],
                200 / gl.canvas.height * renderer._nativeSize[1]
            ]);
            const imageData = renderer.extractDrawableScreenSpace(drawableID).imageData;
            skins[drawableID] = renderer.createBitmapSkin(imageData);
            renderer._allDrawables[drawableID].skin = renderer._allSkins[skins[drawableID]];
            drawable.updateScale(drawableScale);

            delete spriteShaders[drawableID];
            renderer.dirty = true;
        }
        setExtraShader({
            target,
            shader
        }, util) {
            let DesiredID = -1;
            switch (target) {
                case "pen":
                    if (!runtime.ext_pen) break;
                    DesiredID = runtime.ext_pen._penDrawableId;
                    break;
                case "videoSensing":
                    if (!runtime.ioDevices?.video) break;
                    DesiredID = runtime.ioDevices.video._drawable;
                    break;
                case "simple3D":
                    if (!runtime.ext_xeltallivSimple3Dapi) break;
                    for (let drawableID in renderer._allDrawables) {
                        if (renderer._allDrawables[drawableID].customDrawableName == "Simple3D Layer") {
                            DesiredID = drawableID;
                            break;
                        }
                    }
                    break;
                default:
                    break;
            }

            if (DesiredID == -1) return;

            if (shader == "____PEN_PLUS__NO__SHADER____") {
                delete spriteShaders[DesiredID];
                if (multiRender) {
                    delete renderSpriteShadersList[DesiredID];
                }
                renderer.dirty = true;
                return;
            }

            if (!shaderfile.shaders[shader]) return;

            if (multiRender) {
                if (!renderSpriteShadersList[DesiredID]) {
                    renderSpriteShadersList[DesiredID] = [];
                }
                renderSpriteShadersList[DesiredID].push(shader);
                if (!bufferInfo[DesiredID]) {
                    bufferInfo[DesiredID] = [
                        twgl.createFramebufferInfo(gl, stageBufferAttachments),
                        twgl.createFramebufferInfo(gl, stageBufferAttachments)
                    ];
                }
            }

            spriteShaders[DesiredID] = shader;
            renderer.dirty = true;
        }
        clearShader({}, util) {
            renderShadersList = [];
            this.resetBuffer();
        }
        setSetting({
            setting,
            value
        }) {
            switch (setting) {
                case "multi render":
                    multiRender = value == "on" ? true : false;

                    if (!multiRender) {
                        // 清空所有多重渲染相关的缓存
                        textures = {};
                        // 强制重绘
                        renderer.dirty = true;
                        requestAnimationFrame(() => {
                            renderer.dirty = true;
                        });
                    }
                    break;

                case "compatibility mode":
                    if (value == "on") {
                        renderer.draw = oldDraw;
                        renderer._drawThese = oldDrawThese;
                    } else {
                        renderer.draw = this.customDrawFunction;
                        renderer._drawThese = this.advDrawThese;
                    }
                    break;

                case "auto re-render":
                    this.autoReRender = value == "on" ? true : false;
                    break;

                default:
                    break;
            }
        }
        importNewShader({
            name,
            vert,
            frag,
            glsl
        }) {
            const importshader = new Object();
            importshader[name] = {
                "projectData": {
                    "blockDat": {},
                    "dynamicDat": {
                        "dynamic_variables": [],
                        "dynamic_myblocks": []
                    },
                    "glsl": "//It seems like you don't import shader form .pps file.So here is nothing to edit.If you want to edit shader here,you can import shader from .pps file.",
                    "isText": true
                },
                "vertShader": vert.replace(/\\n/g, '\r\n').replace(/\\t/g, "  "),
                "fragShader": frag.replace(/\\n/g, '\r\n').replace(/\\t/g, "  ")
            };
            if (shaderfile) {
                Object.keys(importshader).forEach(shaderName => {
                    if (!shaderfile.shaders[shaderName]) {
                        shaderfile.saveShader(shaderName, {
                            projectData: importshader[shaderName].projectData,
                            vertShader: importshader[shaderName].vertShader,
                            fragShader: importshader[shaderName].fragShader,
                            name: shaderName
                        });
                    }
                });
                //Detect if the shader can be used.
                let testShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(testShader, importshader[name].vertShader);
                gl.compileShader(testShader);
                if (!gl.getShaderParameter(testShader, gl.COMPILE_STATUS)) {
                    shaderfile.deleteShader(name);
                    alert(gl.getShaderInfoLog(testShader));
                    return null;
                }
                testShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(testShader, importshader[name].fragShader);
                gl.compileShader(testShader);
                if (!gl.getShaderParameter(testShader, gl.COMPILE_STATUS)) {
                    shaderfile.deleteShader(name);
                    alert(gl.getShaderInfoLog(testShader));
                    return null;
                }
            }
        }
        importShaderFromPPS({
            name,
            file
        }) {
            const glsl = JSON.parse(file).glsl.replace(/\\n/g, '\r\n').replace(/\\t/g, "  ");
            let vertexShader = glsl.includes("void vertex") ? glsl.replace(/\s*void\s+fragment\s*\(\)\s*\{[\s\S]*?\}/gm, "").replace(/void vertex/g, "void main").replace(/(gl_FragColor\.*[xyzw]*\s*[+*/-]*=.*;)/g, "").replace(/(gl_FragColor)/g, "vec4(1)").replace(/(gl_FragCoord)/g, "vec2(1)") : defaultVertexShader100;
            let fragmentShader = glsl.includes("void fragment") ? glsl.replace(/\s*void\s+vertex\s*\(\)\s*\{[\s\S]*?\}/gm, "").replace(/attribute.*;/g, "").replace(/void fragment/g, "void main").replace(/(gl_Position\.*[xyzw]*\s*[+*/-]*=.*;)/g, "").replace(/(gl_Position)/g, "vec4(1)").replace(/(v_color\.*[xyzw]*\s*[+*/-]*=.*;)/g, "") : defaultFragmentShader100;
            if (glsl.includes("#version 300 es")) {
                vertexShader = glsl.includes("void vertex") ? vertexShader.replace(/attribute/g, "in").replace(/varying/g, "out").replace(/layout.*\(.*location.*=.*\d\).*out.*;/g, "") : defaultVertexShader300;
                fragmentShader = glsl.includes("void fragment") ? fragmentShader.replace(/varying/g, "in").replace(/gl_FragColor/g, "fragColor") : defaultFragmentShader300;
            }
            const importshader = new Object();
            importshader[name] = {
                "projectData": {
                    "blockDat": {},
                    "dynamicDat": {
                        "dynamic_variables": [],
                        "dynamic_myblocks": []
                    },
                    "glsl": glsl,
                    "isText": true
                },
                "vertShader": vertexShader,
                "fragShader": fragmentShader
            };
            if (shaderfile) {
                Object.keys(importshader).forEach(shaderName => {
                    if (!shaderfile.shaders[shaderName]) {
                        shaderfile.saveShader(shaderName, {
                            projectData: importshader[shaderName].projectData,
                            vertShader: importshader[shaderName].vertShader,
                            fragShader: importshader[shaderName].fragShader,
                            name: shaderName
                        });
                    }
                });
                //Detect if the shader can be used.
                let testShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(testShader, importshader[name].vertShader);
                gl.compileShader(testShader);
                if (!gl.getShaderParameter(testShader, gl.COMPILE_STATUS)) {
                    shaderfile.deleteShader(name);
                    alert(gl.getShaderInfoLog(testShader));
                    return null;
                }
                testShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(testShader, importshader[name].fragShader);
                gl.compileShader(testShader);
                if (!gl.getShaderParameter(testShader, gl.COMPILE_STATUS)) {
                    shaderfile.deleteShader(name);
                    alert(gl.getShaderInfoLog(testShader));
                    return null;
                }
            }
        }
        deleteShader({
            shader
        }) {
            if (shaderfile) {
                shaderfile.deleteShader(shader);
            }
        }
        defaultShader({
            ver,
            type
        }) {
            if (ver == "1.0") {
                if (type == "vertex") {
                    return defaultVertexShader100
                } else {
                    return defaultFragmentShader100
                }
            } else {
                if (type == "vertex") {
                    return defaultVertexShader300
                } else {
                    return defaultFragmentShader300
                }
            }
        }
        getShaderSourceCode({
            shader,
            type
        }) {
            if (shaderfile.shaders[shader]) {
                return type == "vertex" ? shaderfile.shaders[shader].projectData.vertShader : shaderfile.shaders[shader].projectData.fragShader;
            }
        }
        getAllShaders() {
            return JSON.stringify(this.shaderMenu());
        }
        getUsingStageShaders() {
            if (multiRender) {
                return JSON.stringify(renderShadersList);
            } else {
                return currentShader;
            }
        }
        getUsingSpriteShaders({}, util) {
            const drawableID = util.target.drawableID;
            if (multiRender) {
                return JSON.stringify(renderSpriteShadersList[drawableID]);
            } else {
                return spriteShaders[drawableID];
            }
        }
        supportsWEBGL_TWO() {
            return isWebGL2;
        }
        getStageTexture(args, util) {
            return new Promise(resolve => {
                renderer.dirty = true;
                requestAnimationFrame(() => {
                    try {
                        const texture = gl.createTexture();
                        gl.bindTexture(gl.TEXTURE_2D, texture);
                        gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, gl.canvas.width, gl.canvas.height, 0);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                        gl.bindTexture(gl.TEXTURE_2D, null);
                        resolve(texture);
                    } catch (e) {
                        console.error(e);
                        resolve(null);
                    }
                });
            });
        }
        getCostumeTexture(args, util) {
            if (!shaderfile) return;
            let curCostume = shaderfile._locateTextureObject(args.name, util);
            if (curCostume) return curCostume;
        }
        getTextTexture(args, util) {
            const color = Scratch.Cast.toRgbColorObject(args.color)
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            ctx.font = args.font;
            const m = ctx.measureText(args.text);
            canvas.width = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
            canvas.height = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = args.font;
            ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${(color.a ?? 255) / 255})`;
            ctx.fillText(args.text, m.actualBoundingBoxLeft, m.fontBoundingBoxAscent);
            return twgl.createTexture(gl, {
                src: ctx.canvas,
                flipY: false
            });
        }
        _isUniformArray(shader, uniformName) {
            if (!shaderfile.programs[shader]) return false;
            if (!shaderfile.programs[shader].uniformDec[uniformName]) return false;
            if (!shaderfile.programs[shader].uniformDec[uniformName].isArray) return false;
            return true;
        }
        _getShaderInstances(shader) {
            if (!shaderfile.programs[shader]) return [];
            const instances = [];

            // Stage shaders
            if (multiRender) {
                renderShadersList.forEach((s, index) => {
                    if (s === shader) instances.push(`stage-${index}`);
                });
            } else if (currentShader === shader) {
                instances.push('stage-0');
            }

            // Sprite shaders
            const allDrawableIDs = Object.keys(renderer._allDrawables);
            const processedDrawableIDs = new Set();

            allDrawableIDs.forEach(drawableID => {
                if (multiRender && renderSpriteShadersList[drawableID]) {
                    renderSpriteShadersList[drawableID].forEach((s, index) => {
                        if (s === shader) {
                            instances.push(`sprite-${drawableID}-${index}`);
                        }
                    });
                    processedDrawableIDs.add(drawableID);
                }
            });
            allDrawableIDs.forEach(drawableID => {
                if (!processedDrawableIDs.has(drawableID) && spriteShaders[drawableID] === shader) {
                    instances.push(`sprite-${drawableID}`);
                }
            });
            return [...new Set(instances)];
        }

        // 修改 _setUniform 方法（完整版）
        _setUniform(shader, uniformName, value) {
            const isSubShader = this.subShaders && this.subShaders[shader];

            // 如果开启了立即模式，直接应用，不等待
            if (this.immediateUniformMode) {
                this._applyUniformDirect(shader, uniformName, value, isSubShader);
                renderer.dirty = true;
                return;
            }

            // 原有的批量逻辑
            if (!this._uniformBatchMap) {
                this._uniformBatchMap = new Map();
                this._batchFrameCount = 0;
                this._batchUpdatePending = false;
                this._updateInterval = 1;
            }

            const batchKey = `${shader}|${uniformName}`;

            let storedValue;
            if (Array.isArray(value)) {
                storedValue = [...value];
            } else {
                storedValue = value;
            }

            this._uniformBatchMap.set(batchKey, {
                shader: shader,
                uniformName: uniformName,
                value: storedValue,
                isSubShader: isSubShader
            });

            if (!this._batchUpdatePending) {
                this._batchUpdatePending = true;

                const scheduleUpdate = () => {
                    this._batchFrameCount++;

                    if (this._batchFrameCount >= this._updateInterval) {
                        this._flushUniformBatch();
                        this._batchFrameCount = 0;
                        this._batchUpdatePending = false;
                    } else {
                        requestAnimationFrame(scheduleUpdate);
                    }
                };

                requestAnimationFrame(scheduleUpdate);
            }
        }

        // 提取的直接应用方法
        _applyUniformDirect(shader, uniformName, value, isSubShader) {
            if (isSubShader) {
                if (!this.subShaderUniforms[shader]) {
                    this.subShaderUniforms[shader] = {};
                }
                this.subShaderUniforms[shader][uniformName] = value;
                if (shaderfile.programs[shader]) {
                    shaderfile.programs[shader].uniformDat[uniformName] = value;
                }
            } else {
                if (!shaderfile.programs[shader]) return;
                shaderfile.programs[shader].uniformDat[uniformName] = value;
            }
        }

        // 批量提交方法
        _flushUniformBatch() {
            if (!this._uniformBatchMap || this._uniformBatchMap.size === 0) return;

            for (const [key, data] of this._uniformBatchMap) {
                const {
                    shader,
                    uniformName,
                    value,
                    isSubShader
                } = data;
                this._applyUniformDirect(shader, uniformName, value, isSubShader);
            }

            this._uniformBatchMap.clear();
            renderer.dirty = true;
        }

        // 新增积木方法
        setImmediateUniformUpdate({
            enabled
        }) {
            this.immediateUniformMode = (enabled === "on");

            // 如果从立即模式切换到普通模式，且有待处理的批量，立即提交
            if (!this.immediateUniformMode && this._uniformBatchMap && this._uniformBatchMap.size > 0) {
                this._flushUniformBatch();
                this._batchUpdatePending = false;
                this._batchFrameCount = 0;
            }
        }

        // 同样修改 _setUniformArray
        _setUniformArray(shader, uniformName, item, value, components) {
            const isSubShader = this.subShaders && this.subShaders[shader];

            if (isSubShader) {
                if (!this.subShaderUniforms[shader]) {
                    this.subShaderUniforms[shader] = {};
                }
                if (!this.subShaderUniforms[shader][uniformName]) {
                    this.subShaderUniforms[shader][uniformName] = [];
                }

                const baseIndex = (item - 1) * components;
                if (components === 1) {
                    this.subShaderUniforms[shader][uniformName][baseIndex] = value;
                } else {
                    for (let i = 0; i < components; i++) {
                        this.subShaderUniforms[shader][uniformName][baseIndex + i] = value[i];
                    }
                }

                if (shaderfile.programs[shader]) {
                    shaderfile.programs[shader].uniformDat[uniformName] = this.subShaderUniforms[shader][uniformName];
                }
                return;
            }

            if (!shaderfile.programs[shader] || !this._isUniformArray(shader, uniformName)) return;

            const arrayLength = shaderfile.programs[shader].uniformDec[uniformName].arrayLength;
            if (item < 1 || item > arrayLength) return;

            const uniformDat = shaderfile.programs[shader].uniformDat;
            if (!uniformDat || !uniformDat.hasOwnProperty(uniformName) || !Array.isArray(uniformDat[uniformName])) return;

            const baseIndex = (item - 1) * components;
            if (components === 1) {
                uniformDat[uniformName][baseIndex] = value;
            } else {
                for (let i = 0; i < components; i++) {
                    uniformDat[uniformName][baseIndex + i] = value[i];
                }
            }

            renderer.dirty = true;
        }
        setTextureInShader({
            uniformName,
            shader,
            texture
        }, util) {
            if (!shaderfile.programs[shader] || this._isUniformArray(shader, uniformName)) return;
            this._setUniform(shader, uniformName, texture);
        }
        setNumberInShader({
            uniformName,
            shader,
            number
        }) {
            if (!shaderfile.programs[shader]) return;
            if (this._isUniformArray(shader, uniformName)) return;

            // 直接调用 _setUniform（已被批量处理接管）
            this._setUniform(shader, uniformName, number);
        }

        setVec2InShader({
            uniformName,
            shader,
            numberX,
            numberY
        }) {
            if (!shaderfile.programs[shader] || this._isUniformArray(shader, uniformName)) return;
            this._setUniform(shader, uniformName, [numberX, numberY]);
        }

        setVec3InShader({
            uniformName,
            shader,
            numberX,
            numberY,
            numberZ
        }) {
            if (!shaderfile.programs[shader] || this._isUniformArray(shader, uniformName)) return;
            this._setUniform(shader, uniformName, [numberX, numberY, numberZ]);
        }

        setVec4InShader({
            uniformName,
            shader,
            numberX,
            numberY,
            numberZ,
            numberW
        }) {
            if (!shaderfile.programs[shader] || this._isUniformArray(shader, uniformName)) return;
            this._setUniform(shader, uniformName, [numberX, numberY, numberZ, numberW]);
        }

        setBoolInShader({
            uniformName,
            shader,
            value
        }) {
            if (!shaderfile.programs[shader]) return;
            this._setUniform(shader, uniformName, value === "true");
        }

        setMat2InShader({
            uniformName,
            shader,
            values
        }) {
            if (!shaderfile.programs[shader]) return;
            try {
                const arr = JSON.parse(values);
                if (arr.length === 4) {
                    this._setUniform(shader, uniformName, arr.map(v => Scratch.Cast.toNumber(v)));
                }
            } catch (e) {}
        }
        setFloatArrayInShader({
            uniformName,
            shader,
            values
        }) {
            if (!shaderfile.programs[shader]) return;

            try {
                let arr = JSON.parse(values);
                if (!Array.isArray(arr)) return;

                const floatArray = arr.map(v => Scratch.Cast.toNumber(v));

                if (this._isUniformArray(shader, uniformName)) {
                    this._setUniform(shader, uniformName, floatArray);
                } else if (floatArray.length >= 1) {
                    this._setUniform(shader, uniformName, floatArray[0]);
                }
            } catch (e) {}
        }
        setVec2ArrayInShader({
            uniformName,
            shader,
            values
        }) {
            if (!shaderfile.programs[shader]) return;

            try {
                let arr = JSON.parse(values);
                if (!Array.isArray(arr)) return;

                const flatArray = [];
                for (let i = 0; i < arr.length; i++) {
                    const vec = arr[i];
                    if (Array.isArray(vec) && vec.length >= 2) {
                        flatArray.push(Scratch.Cast.toNumber(vec[0]));
                        flatArray.push(Scratch.Cast.toNumber(vec[1]));
                    }
                }

                if (flatArray.length > 0) {
                    this._setUniform(shader, uniformName, flatArray);
                }
            } catch (e) {}
        }
        setVec3ArrayInShader({
            uniformName,
            shader,
            values
        }) {
            if (!shaderfile.programs[shader]) return;

            try {
                let arr = JSON.parse(values);
                if (!Array.isArray(arr)) return;

                const flatArray = [];
                for (let i = 0; i < arr.length; i++) {
                    const vec = arr[i];
                    if (Array.isArray(vec) && vec.length >= 3) {
                        flatArray.push(Scratch.Cast.toNumber(vec[0]));
                        flatArray.push(Scratch.Cast.toNumber(vec[1]));
                        flatArray.push(Scratch.Cast.toNumber(vec[2]));
                    }
                }

                if (flatArray.length > 0) {
                    this._setUniform(shader, uniformName, flatArray);
                }
            } catch (e) {}
        }

        setVec4ArrayInShader({
            uniformName,
            shader,
            values
        }) {
            if (!shaderfile.programs[shader]) return;

            try {
                let arr = JSON.parse(values);
                if (!Array.isArray(arr)) return;

                const flatArray = [];
                for (let i = 0; i < arr.length; i++) {
                    const vec = arr[i];
                    if (Array.isArray(vec) && vec.length >= 4) {
                        flatArray.push(Scratch.Cast.toNumber(vec[0]));
                        flatArray.push(Scratch.Cast.toNumber(vec[1]));
                        flatArray.push(Scratch.Cast.toNumber(vec[2]));
                        flatArray.push(Scratch.Cast.toNumber(vec[3]));
                    }
                }

                if (flatArray.length > 0) {
                    this._setUniform(shader, uniformName, flatArray);
                }
            } catch (e) {}
        }
        setMatrixInShaderArray({
            uniformName,
            shader,
            array
        }) {
            if (!shaderfile.programs[shader] || this._isUniformArray(shader, uniformName)) return;
            try {
                let converted = JSON.parse(array);
                if (!Array.isArray(converted)) return;
                converted = converted.map(num => Scratch.Cast.toNumber(num));
                this._setUniform(shader, uniformName, converted);
            } catch (e) {
                return;
            }
        }
        setArrayNumberInShader({
            item,
            uniformName,
            shader,
            number
        }) {
            if (!shaderfile.programs[shader] || !this._isUniformArray(shader, uniformName)) return;
            this._setUniformArray(shader, uniformName, item, number, 1);
        }
        setArrayVec2InShader({
            item,
            uniformName,
            shader,
            numberX,
            numberY
        }) {
            if (!shaderfile.programs[shader] || !this._isUniformArray(shader, uniformName)) return;
            this._setUniformArray(shader, uniformName, item, [numberX, numberY], 2);
        }
        setArrayVec3InShader({
            item,
            uniformName,
            shader,
            numberX,
            numberY,
            numberZ,
        }) {
            if (!shaderfile.programs[shader] || !this._isUniformArray(shader, uniformName)) return;
            this._setUniformArray(shader, uniformName, item, [numberX, numberY, numberZ], 3);
        }
        setArrayVec4InShader({
            item,
            uniformName,
            shader,
            numberX,
            numberY,
            numberZ,
            numberW,
        }) {
            if (!shaderfile.programs[shader] || !this._isUniformArray(shader, uniformName)) return;
            this._setUniformArray(shader, uniformName, item, [numberX, numberY, numberZ, numberW], 4);
        }
        setArrayMatrixInShaderArray({
            item,
            uniformName,
            shader,
            array
        }) {
            if (!shaderfile.programs[shader] || !this._isUniformArray(shader, uniformName)) return;
            const unitSize = shaderfile.programs[shader].uniformDec[uniformName].unitSize;
            try {
                let converted = JSON.parse(array);
                if (!Array.isArray(converted) || converted.length !== unitSize) return;
                converted = converted.map(num => Scratch.Cast.toNumber(num));
                this._setUniformArray(shader, uniformName, item, converted, unitSize);
            } catch (e) {
                return;
            }
        }


        // 辅助方法：从屏幕轨道重建列表
        _rebuildStageListFromTracks() {
            const tracks = this.stageShaderTracks;

            renderShadersList = [];
            Object.keys(tracks)
                .map(Number)
                .filter(k => tracks[k] != null && tracks[k] !== "____PEN_PLUS__NO__SHADER____")
                .sort((a, b) => a - b)
                .forEach(k => {
                    const shaderName = tracks[k];
                    //  只添加存在的着色器
                    if (shaderfile.shaders[shaderName]) {
                        renderShadersList.push(shaderName);
                    } else {
                        delete tracks[k];
                    }
                });

            currentShader = renderShadersList[0] || null;

            if (renderShadersList.length === 0) {
                this.resetBuffer();
            } else if (currentFrameBuffer !== stageBuffer) {
                currentFrameBuffer = stageBuffer;
            }

            renderer.dirty = true;
        }

        setStageShaderAtTrack({
            shader,
            track
        }) {
            const trackNum = Scratch.Cast.toNumber(track);

            //  检查着色器是否存在
            if (shader !== "____PEN_PLUS__NO__SHADER____" && shader && !shaderfile.shaders[shader]) {
                console.warn(`着色器 "${shader}" 不存在，无法添加到轨道`);
                return;
            }

            if (!this.stageShaderTracks) {
                this.stageShaderTracks = {};
            }

            if (shader === "____PEN_PLUS__NO__SHADER____" || !shader) {
                delete this.stageShaderTracks[trackNum];
            } else {
                this.stageShaderTracks[trackNum] = shader;
            }

            this._rebuildStageListFromTracks();
            renderer.dirty = true;
        }

        removeStageShaderTrack({
            track
        }) {
            const trackNum = Scratch.Cast.toNumber(track);

            if (this.stageShaderTracks) {
                delete this.stageShaderTracks[trackNum];
            }

            this._rebuildStageListFromTracks();
            renderer.dirty = true;
        }
        clearAllStageTracks() {
            this.stageShaderTracks = {};
            this._rebuildStageListFromTracks();
            renderer.dirty = true;
        }
        _isSpecialDrawable(drawableID) {
            return true;
        }
        // 在 extension 类中定义
        mainShadersMenu() {
            if (!shaderfile) return [];
            const shaders = Object.keys(shaderfile.shaders)
                .filter(name => !name.includes('_') && name !== BUILTIN_SPLOOKS_SHADER)
                .map(name => ({
                    text: name,
                    value: name
                }));
            return shaders.length > 0 ? shaders : [{
                text: "无",
                value: ""
            }];
        }


        subShadersMenu() {
            if (!this.subShaders) return [];

            const subShaders = Object.keys(this.subShaders)
                .map(name => ({
                    text: name,
                    value: name
                }));

            return subShaders.length > 0 ? subShaders : [{
                text: "无",
                value: ""
            }];
        }

        // 检查是否是有效的副着色器名称
        _isSubShaderName(name) {
            return name.includes('_') && name.split('_').length === 2;
        }

        // 获取主着色器名称
        _getMainShaderName(subShaderName) {
            return subShaderName.split('_')[0];
        }

        // 获取主着色器下的所有副着色器
        _getSubShadersOfMain(mainShader) {
            if (!this.subShaders) return [];

            return Object.keys(this.subShaders)
                .filter(name => this.subShaders[name].mainShader === mainShader)
                .sort((a, b) => {
                    const idA = this.subShaders[a].id;
                    const idB = this.subShaders[b].id;
                    return String(idA).localeCompare(String(idB));
                });
        }

        // 获取主着色器下的副着色器数量
        getSubShaderCount({
            shader
        }) {
            if (!shaderfile || !shaderfile.shaders[shader]) return 0;
            if (shader.includes('_')) return 0; // 不是主着色器

            const subShaders = this._getSubShadersOfMain(shader);
            return subShaders.length;
        }

        // 获取主着色器下第 N 项的 ID
        getSubShaderIdAt({
            shader,
            index
        }) {
            if (!shaderfile || !shaderfile.shaders[shader]) return "";
            if (shader.includes('_')) return "";

            const idx = Scratch.Cast.toNumber(index) - 1;
            const subShaders = this._getSubShadersOfMain(shader);

            if (idx >= 0 && idx < subShaders.length) {
                return this.subShaders[subShaders[idx]].id;
            }
            return "";
        }

        createSubShader({
            shader,
            id
        }) {
            // 验证主着色器存在
            if (!shaderfile || !shaderfile.shaders[shader]) {
                console.warn(`主着色器 "${shader}" 不存在`);
                return;
            }

            if (shader.includes('_')) {
                console.warn(`主着色器名称不能包含下划线 "_"`);
                return;
            }

            const subShaderName = `${shader}_${id}`;

            if (this.subShaders && this.subShaders[subShaderName]) {
                console.warn(`副着色器 "${subShaderName}" 已存在`);
                return;
            }

            const mainShaderData = shaderfile.shaders[shader];
            const mainProgram = shaderfile.programs[shader];

            if (!mainShaderData || !mainProgram) return;

            // 初始化存储
            if (!this.subShaders) this.subShaders = {};
            if (!this.subShaderUniforms) this.subShaderUniforms = {};

            this.subShaders[subShaderName] = {
                mainShader: shader,
                id: String(id),
                createdAt: Date.now()
            };

            // 复制主着色器的 uniform 值
            this.subShaderUniforms[subShaderName] = {};
            if (mainProgram.uniformDat) {
                Object.keys(mainProgram.uniformDat).forEach(key => {
                    const val = mainProgram.uniformDat[key];
                    if (val !== undefined && val !== null) {
                        this.subShaderUniforms[subShaderName][key] = Array.isArray(val) ? [...val] : val;
                    }
                });
            }

            shaderfile.shaders[subShaderName] = {
                projectData: mainShaderData.projectData,
                modifyDate: Date.now(),
                isSubShader: true,
                mainShader: shader
            };

            shaderfile.programs[subShaderName] = {
                info: mainProgram.info,
                uniformDat: this.subShaderUniforms[subShaderName],
                uniformDec: mainProgram.uniformDec,
                attribDat: mainProgram.attribDat
            };

            // 复制 recompiledShaders
            if (recompiledShaders[shader]) {
                recompiledShaders[subShaderName] = recompiledShaders[shader];
            }

            console.log(`副着色器 "${subShaderName}" 创建成功`);
        }

        // 删除单个副着色器
        _deleteSubShader(subShaderName) {
            if (!this.subShaders || !this.subShaders[subShaderName]) return;

            // 找出所有使用了这个副着色器的图层，清理它们的纹理缓存
            Object.keys(spriteShaders).forEach(id => {
                if (spriteShaders[id] === subShaderName) {
                    delete textures[id];
                    delete spriteShaders[id]; //  确保删除 spriteShaders 中的引用
                }
            });

            Object.keys(renderSpriteShadersList).forEach(id => {
                const list = renderSpriteShadersList[id];
                if (list && list.includes(subShaderName)) {
                    delete textures[id];
                    // 过滤掉这个副着色器
                    renderSpriteShadersList[id] = list.filter(s => s !== subShaderName);
                    if (renderSpriteShadersList[id].length === 0) {
                        delete renderSpriteShadersList[id];
                        delete spriteShaders[id]; //  如果列表为空，也清理 spriteShaders
                    }
                }
            });

            //  如果有轨道数据，也要清理
            if (this.spriteShaderTracks) {
                Object.keys(this.spriteShaderTracks).forEach(id => {
                    const tracks = this.spriteShaderTracks[id];
                    if (tracks) {
                        Object.keys(tracks).forEach(trackNum => {
                            if (tracks[trackNum] === subShaderName) {
                                delete tracks[trackNum];
                            }
                        });
                        if (Object.keys(tracks).length === 0) {
                            delete this.spriteShaderTracks[id];
                        }
                    }
                });
            }

            // 从渲染系统删除
            delete shaderfile.shaders[subShaderName];
            delete shaderfile.programs[subShaderName];
            delete recompiledShaders[subShaderName];

            // 从存储删除
            delete this.subShaders[subShaderName];
            delete this.subShaderUniforms[subShaderName];

            // 清理舞台引用
            if (currentShader === subShaderName) {
                currentShader = null;
            }
            renderShadersList = renderShadersList.filter(s => s !== subShaderName);

            // 如果有舞台轨道，也要清理
            if (this.stageShaderTracks) {
                Object.keys(this.stageShaderTracks).forEach(trackNum => {
                    if (this.stageShaderTracks[trackNum] === subShaderName) {
                        delete this.stageShaderTracks[trackNum];
                    }
                });
            }

            renderer.dirty = true;
        }

        // 删除指定副着色器（公开方法）
        deleteSubShader({
            subShader
        }) {
            if (!this._isSubShaderName(subShader)) {
                console.warn(`"${subShader}" 不是副着色器`);
                return;
            }

            this._deleteSubShader(subShader);
            renderer.dirty = true;
        }

        // 清空主着色器的所有副着色器
        clearSubShadersOfMain({
            shader
        }) {
            if (!shaderfile || !shaderfile.shaders[shader]) return;
            if (shader.includes('_')) return;

            const subShaders = this._getSubShadersOfMain(shader);

            subShaders.forEach(subName => {
                this._deleteSubShader(subName);
            });

            renderer.dirty = true;
        }

        // 清空所有副着色器
        clearAllSubShaders() {
            if (!this.subShaders) return;

            const allSubShaders = Object.keys(this.subShaders);
            allSubShaders.forEach(subName => {
                this._deleteSubShader(subName);
            });

            renderer.dirty = true;
        }

        // 删除主着色器时，同时删除其所有副着色器
        deleteShader({
            shader
        }) {
            if (shaderfile) {
                // 如果是主着色器，先删除所有副着色器
                if (!shader.includes('_')) {
                    this.clearSubShadersOfMain({
                        shader
                    });
                }

                // 如果是副着色器，单独删除
                if (this._isSubShaderName(shader)) {
                    this._deleteSubShader(shader);
                } else {
                    shaderfile.deleteShader(shader);
                }
            }
        }
        getUniformCount({
            shader
        }) {
            if (!shaderfile || !shaderfile.shaders[shader]) {
                return "[]";
            }

            const projectData = shaderfile.shaders[shader].projectData;
            if (!projectData) return "[]";

            const fragSource = projectData.fragShader || '';
            const vertSource = projectData.vertShader || '';
            const allSource = fragSource + '\n' + vertSource;

            const uniformRegex = /uniform\s+\w+\s+(\w+)\s*;/g;
            const uniformNames = [];
            let match;
            while ((match = uniformRegex.exec(allSource)) !== null) {
                const name = match[1];
                const builtIns = [
                    'u_res', 'u_timer', 'u_transform', 'u_skin',
                    'u_skinSize', 'u_position', 'u_direction', 'u_rotationAdjusted'
                ];
                if (!builtIns.includes(name) && !uniformNames.includes(name)) {
                    uniformNames.push(name);
                }
            }

            return JSON.stringify(uniformNames);
        }
        getUniformNameAt({
            shader,
            index
        }) {
            if (!shaderfile || !shaderfile.shaders[shader]) {
                return "";
            }

            // 从源码直接解析 uniform，不依赖 programs
            const projectData = shaderfile.shaders[shader].projectData;
            if (!projectData) return "";

            const fragSource = projectData.fragShader || '';
            const vertSource = projectData.vertShader || '';
            const allSource = fragSource + '\n' + vertSource;

            // 匹配所有 uniform 声明
            const uniformRegex = /uniform\s+\w+\s+(\w+)\s*;/g;
            const uniformNames = [];
            let match;
            while ((match = uniformRegex.exec(allSource)) !== null) {
                const name = match[1];
                // 排除内置变量
                const builtIns = [
                    'u_res', 'u_timer', 'u_transform', 'u_skin',
                    'u_skinSize', 'u_position', 'u_direction', 'u_rotationAdjusted'
                ];
                if (!builtIns.includes(name) && !uniformNames.includes(name)) {
                    uniformNames.push(name);
                }
            }

            uniformNames.sort();

            const idx = Scratch.Cast.toNumber(index) - 1;

            if (idx >= 0 && idx < uniformNames.length) {
                return uniformNames[idx];
            }

            return "";
        }

        openShaderImporter() {
            // 如果已经存在，先移除
            const existingOverlay = document.getElementById('shaderImporterOverlay');
            if (existingOverlay) {
                existingOverlay.remove();
                return;
            }

            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.id = 'shaderImporterOverlay';
            Object.assign(overlay.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.7)',
                zIndex: '2147483646',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Microsoft YaHei, sans-serif'
            });

            // 创建弹窗
            const modal = document.createElement('div');
            Object.assign(modal.style, {
                width: '95%',
                maxWidth: '1000px',
                height: '90%',
                maxHeight: '700px',
                backgroundColor: '#1a1a2e',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            });

            // 标题栏
            const titleBar = document.createElement('div');
            Object.assign(titleBar.style, {
                padding: '16px 20px',
                backgroundColor: '#16213e',
                borderBottom: '1px solid #0f3460',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: '0'
            });

            const title = document.createElement('h2');
            title.textContent = '着色器导入器(可能会有bug，但是如果显示导入就编译失败，你仍然可以正常导入进去可以试试在扩展应用到屏幕那里,如果导入成功之后，屏幕却没有该效果说明顶点有问题)';
            Object.assign(title.style, {
                margin: '0',
                fontSize: '18px',
                color: '#eee'
            });

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            Object.assign(closeBtn.style, {
                width: '32px',
                height: '32px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            });
            closeBtn.onclick = () => {
                this._cleanupImporterPreview();
                overlay.remove();
            };

            titleBar.appendChild(title);
            titleBar.appendChild(closeBtn);

            // 主内容区域（左右布局）
            const mainContent = document.createElement('div');
            Object.assign(mainContent.style, {
                flex: '1',
                display: 'flex',
                gap: '16px',
                padding: '16px',
                overflow: 'hidden',
                minHeight: '0'
            });

            // ========== 左边：预览区域 ==========
            const leftPanel = document.createElement('div');
            Object.assign(leftPanel.style, {
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                minWidth: '0',
                overflow: 'hidden'
            });

            const canvasToolbar = document.createElement('div');
            Object.assign(canvasToolbar.style, {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                flexShrink: '0'
            });

            const canvasLabel = document.createElement('span');
            canvasLabel.textContent = '🔍 预览';
            Object.assign(canvasLabel.style, {
                color: '#aaa',
                fontSize: '14px'
            });

            const canvasControls = document.createElement('div');
            Object.assign(canvasControls.style, {
                display: 'flex',
                gap: '8px'
            });

            const bgSelect = document.createElement('select');
            Object.assign(bgSelect.style, {
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: '#0f3460',
                color: 'white',
                border: 'none',
                fontSize: '11px'
            });
            ['网格', '黑色', '白色', '灰色', '彩色渐变'].forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                bgSelect.appendChild(option);
            });

            const refreshBtn = document.createElement('button');
            refreshBtn.textContent = '🔄';
            Object.assign(refreshBtn.style, {
                padding: '4px 8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#0f3460',
                color: 'white',
                fontSize: '12px',
                cursor: 'pointer'
            });

            canvasControls.appendChild(bgSelect);
            canvasControls.appendChild(refreshBtn);
            canvasToolbar.appendChild(canvasLabel);
            canvasToolbar.appendChild(canvasControls);

            const canvas = document.createElement('canvas');
            Object.assign(canvas.style, {
                width: '100%',
                flex: '1',
                backgroundColor: '#000',
                borderRadius: '8px',
                border: '1px solid #e94560',
                display: 'block',
                objectFit: 'contain'
            });

            leftPanel.appendChild(canvasToolbar);
            leftPanel.appendChild(canvas);

            // ========== 右边：代码区域 ==========
            const rightPanel = document.createElement('div');
            Object.assign(rightPanel.style, {
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                minWidth: '0',
                overflow: 'hidden'
            });

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.placeholder = '着色器名称';
            nameInput.value = '新着色器';
            Object.assign(nameInput.style, {
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0f3460',
                color: 'white',
                fontSize: '14px',
                flexShrink: '0'
            });

            const fragHeader = document.createElement('div');
            Object.assign(fragHeader.style, {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: '0'
            });

            const fragLabel = document.createElement('span');
            fragLabel.textContent = '片元着色器';
            Object.assign(fragLabel.style, {
                color: '#aaa',
                fontSize: '13px'
            });

            const uploadBtn = document.createElement('button');
            uploadBtn.textContent = '📁 上传';
            Object.assign(uploadBtn.style, {
                padding: '4px 10px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#0f3460',
                color: 'white',
                fontSize: '11px',
                cursor: 'pointer'
            });

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.glsl,.txt,.frag';
            fileInput.style.display = 'none';

            uploadBtn.onclick = () => fileInput.click();

            fragHeader.appendChild(fragLabel);
            fragHeader.appendChild(uploadBtn);

            const fragArea = document.createElement('textarea');
            fragArea.placeholder = '片元着色器代码...';
            Object.assign(fragArea.style, {
                flex: '1',
                width: '100%',
                backgroundColor: '#0f3460',
                color: '#fff',
                border: '1px solid #e94560',
                borderRadius: '8px',
                padding: '12px',
                fontFamily: 'Courier New, monospace',
                fontSize: '12px',
                resize: 'none',
                minHeight: '0'
            });

            const errorMsg = document.createElement('div');
            Object.assign(errorMsg.style, {
                color: '#ff6b6b',
                fontSize: '11px',
                minHeight: '16px',
                flexShrink: '0'
            });

            //  Uniform 面板
            const uniformPanel = document.createElement('div');
            uniformPanel.id = 'uniformPanel';
            Object.assign(uniformPanel.style, {
                padding: '8px',
                backgroundColor: '#0f3460',
                borderRadius: '8px',
                maxHeight: '100px',
                overflowY: 'auto',
                flexShrink: '0'
            });

            rightPanel.appendChild(nameInput);
            rightPanel.appendChild(fragHeader);
            rightPanel.appendChild(fragArea);
            rightPanel.appendChild(errorMsg);
            rightPanel.appendChild(uniformPanel);

            mainContent.appendChild(leftPanel);
            mainContent.appendChild(rightPanel);

            // 底部按钮
            const buttonRow = document.createElement('div');
            Object.assign(buttonRow.style, {
                padding: '12px 20px 16px 20px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                flexShrink: '0'
            });

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = '❌ 取消';
            Object.assign(cancelBtn.style, {
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0f3460',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer'
            });
            cancelBtn.onclick = () => {
                this._cleanupImporterPreview();
                overlay.remove();
            };

            const importBtn = document.createElement('button');
            importBtn.textContent = ' 导入';
            Object.assign(importBtn.style, {
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#e94560',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
            });

            buttonRow.appendChild(cancelBtn);
            buttonRow.appendChild(importBtn);

            modal.appendChild(titleBar);
            modal.appendChild(mainContent);
            modal.appendChild(buttonRow);
            overlay.appendChild(modal);

            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    this._cleanupImporterPreview();
                    overlay.remove();
                }
            };

            document.body.appendChild(overlay);

            // 存储引用
            this.importerElements = {
                overlay,
                nameInput,
                fragArea,
                canvas,
                errorMsg,
                importBtn,
                refreshBtn,
                bgSelect,
                fileInput,
                uniformPanel
            };

            // 初始化
            this._initImporter();
        }

        // 清理导入器预览的 WebGL 资源
        _cleanupImporterPreview() {
            if (this.previewAnimFrame) {
                cancelAnimationFrame(this.previewAnimFrame);
                this.previewAnimFrame = null;
            }

            if (this.previewGL) {
                if (this.previewGridTexture) {
                    this.previewGL.deleteTexture(this.previewGridTexture);
                    this.previewGridTexture = null;
                }
                if (this.previewProgram) {
                    this.previewGL.deleteProgram(this.previewProgram);
                    this.previewProgram = null;
                }
                const loseContextExt = this.previewGL.getExtension('WEBGL_lose_context');
                if (loseContextExt) {
                    loseContextExt.loseContext();
                }
                this.previewGL = null;
            }

            this.importerElements = null;
        }

        _initImporter() {
            const els = this.importerElements;
            if (!els) return;

            this.previewVert100 = `attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec4 a_color;
varying vec2 v_texCoord;
varying vec4 v_color;
varying vec2 scratch3_uv_replacement;

uniform mat4 u_transform;

void main() {
gl_Position = a_position;
v_texCoord = a_texCoord;
scratch3_uv_replacement = a_texCoord;
v_color = a_color;
}`;

            this.previewVert300 = `#version 300 es
in vec4 a_position;
in vec2 a_texCoord;
in vec4 a_color;
out vec2 v_texCoord;
out vec4 v_color;
out vec2 scratch3_uv_replacement;

uniform mat4 u_transform;

void main() {
gl_Position = a_position;
v_texCoord = a_texCoord;
scratch3_uv_replacement = a_texCoord;
v_color = a_color;
}`;

            const exampleFrag = `precision highp float;
varying vec2 v_texCoord;
uniform sampler2D u_skin;
uniform highp float u_timer;
uniform float u_speed;
uniform float u_intensity;
uniform float u_scale;
uniform float u_flameHeight;
uniform float u_flameOffset;
uniform float u_aspect;

float hash(vec2 p) {
return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
float angle = 0.785;
vec2 rp = vec2(p.x * cos(angle) - p.y * sin(angle), p.x * sin(angle) + p.y * cos(angle));
vec2 i = floor(rp);
vec2 f = fract(rp);
f = f * f * (3.0 - 2.0 * f);
return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
);
}

void main() {
vec2 uv = v_texCoord;

float aspect = sqrt(u_aspect);
vec2 uvAdjusted = vec2(uv.x * aspect, uv.y);

float yOffset = uv.y - u_flameOffset;

if (yOffset > u_flameHeight) {
    gl_FragColor = vec4(0.0);
    return;
}

float scroll = fract(u_timer * u_speed * 0.008);

float y = yOffset / u_flameHeight;
float height = 1.0 - y;
height = clamp(height * 1.8, 0.0, 1.0);

float n1 = noise(vec2(uvAdjusted.x * u_scale * 5.0, (y + scroll) * u_scale * 4.0));
float n2 = noise(vec2(uvAdjusted.x * u_scale * 8.0, (y + scroll * 1.3) * u_scale * 6.0));
float n3 = noise(vec2(uvAdjusted.x * u_scale * 12.0, (y + scroll * 1.7) * u_scale * 9.0));

float flame = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2) * height * u_intensity;
flame = clamp(flame, 0.0, 1.0);

vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(0.8, 0.0, 0.0), smoothstep(0.0, 0.2, flame));
color = mix(color, vec3(1.0, 0.3, 0.0), smoothstep(0.2, 0.4, flame));
color = mix(color, vec3(1.0, 0.7, 0.0), smoothstep(0.4, 0.6, flame));
color = mix(color, vec3(1.0, 0.95, 0.3), smoothstep(0.6, 0.8, flame));
color = mix(color, vec3(1.0, 1.0, 0.9), smoothstep(0.8, 1.0, flame));

gl_FragColor = vec4(color, flame);
}`;

            els.fragArea.value = exampleFrag;

            els.fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        els.fragArea.value = ev.target.result;
                        this._compilePreview();
                    };
                    reader.readAsText(file);
                }
                els.fileInput.value = '';
            };

            els.refreshBtn.onclick = () => this._compilePreview();

            els.bgSelect.onchange = () => this._updateBackground();

            let debounceTimer;
            els.fragArea.oninput = () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => this._compilePreview(), 300);
            };

            els.importBtn.onclick = () => {
                const name = els.nameInput.value.trim() || '新着色器';
                const frag = els.fragArea.value;

                const isGLSL300 = frag.includes('#version 300 es');
                const vert = isGLSL300 ? defaultVertexShader300 : defaultVertexShader100;

                this.importNewShader({
                    name,
                    vert,
                    frag
                });
                this._cleanupImporterPreview();
                els.overlay.remove();
            };

            this._initPreview();
            this._compilePreview();
        }

        _initPreview() {
            const els = this.importerElements;
            if (!els) return;

            const canvas = els.canvas;

            this.previewGL = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (!this.previewGL) {
                els.errorMsg.textContent = '❌ 浏览器不支持 WebGL';
                return;
            }

            this.previewStartTime = Date.now();
            this.previewMouse = [0.5, 0.5];
            this.previewGridTexture = null;
            this.previewUniformControls = {};

            const updateMouse = (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = 1.0 - (e.clientY - rect.top) / rect.height;
                this.previewMouse = [Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y))];
            };

            canvas.addEventListener('mousemove', updateMouse);
            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const rect = canvas.getBoundingClientRect();
                const x = (e.touches[0].clientX - rect.left) / rect.width;
                const y = 1.0 - (e.touches[0].clientY - rect.top) / rect.height;
                this.previewMouse = [Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y))];
            });
            canvas.addEventListener('touchstart', (e) => e.preventDefault());

            this._resizePreviewCanvas();
            window.addEventListener('resize', () => this._resizePreviewCanvas());
        }

        _resizePreviewCanvas() {
            const els = this.importerElements;
            if (!els) return;

            const canvas = els.canvas;
            const container = canvas.parentElement;
            const w = container.clientWidth;
            const h = container.clientHeight;

            if (w > 0 && h > 0) {
                const dpr = window.devicePixelRatio || 1;
                canvas.width = w * dpr;
                canvas.height = h * dpr;
                canvas.style.width = w + 'px';
                canvas.style.height = h + 'px';

                const gl = this.previewGL;
                if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
            }
        }

        _createPreviewTexture(type) {
            const gl = this.previewGL;
            if (!gl) return null;

            const texCanvas = document.createElement('canvas');
            texCanvas.width = 64;
            texCanvas.height = 64;
            const ctx = texCanvas.getContext('2d');

            if (type === '网格') {
                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(0, 0, 64, 64);
                ctx.fillStyle = '#3a3a3a';
                ctx.fillRect(0, 0, 32, 32);
                ctx.fillRect(32, 32, 32, 32);
                ctx.fillStyle = '#4a4a4a';
                ctx.fillRect(16, 16, 2, 2);
                ctx.fillRect(48, 48, 2, 2);
            } else if (type === '黑色') {
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, 64, 64);
            } else if (type === '白色') {
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, 64, 64);
            } else if (type === '灰色') {
                ctx.fillStyle = '#888';
                ctx.fillRect(0, 0, 64, 64);
            } else if (type === '彩色渐变') {
                const grad = ctx.createLinearGradient(0, 0, 64, 64);
                grad.addColorStop(0, '#ff0000');
                grad.addColorStop(0.25, '#00ff00');
                grad.addColorStop(0.5, '#0000ff');
                grad.addColorStop(0.75, '#ffff00');
                grad.addColorStop(1, '#ff00ff');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 64, 64);
            }

            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCanvas);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

            return texture;
        }

        _updateBackground() {
            const els = this.importerElements;
            if (!els) return;

            const bgType = els.bgSelect.value;
            if (this.previewGL) {
                if (this.previewGridTexture) {
                    this.previewGL.deleteTexture(this.previewGridTexture);
                }
                this.previewGridTexture = this._createPreviewTexture(bgType);
            }
        }

        _parseUniforms(fragSource) {
            const uniforms = [];
            const builtIns = ['u_res', 'u_time', 'u_timer', 'u_mouse', 'u_skin', 'u_skinSize',
                'u_position', 'u_direction', 'u_rotationAdjusted', 'u_transform',
                'u_resolution'
            ];

            const scalarRegex = /uniform\s+(float|int|bool)\s+(\w+)\s*;/g;
            let match;
            while ((match = scalarRegex.exec(fragSource)) !== null) {
                const name = match[2];
                if (!builtIns.includes(name) && !name.startsWith('gl_')) {
                    uniforms.push({
                        type: match[1],
                        name
                    });
                }
            }

            const vecRegex = /uniform\s+(vec[234])\s+(\w+)\s*;/g;
            while ((match = vecRegex.exec(fragSource)) !== null) {
                const name = match[2];
                if (!builtIns.includes(name) && !name.startsWith('gl_')) {
                    uniforms.push({
                        type: match[1],
                        name
                    });
                }
            }

            return uniforms;
        }

        _createUniformInputs(uniforms) {
            const panel = document.getElementById('uniformPanel');
            if (!panel) return;

            panel.innerHTML = '';
            this.previewUniformControls = {};

            if (uniforms.length === 0) {
                panel.innerHTML = '<div style="color:#666;text-align:center;padding:8px;">无 Uniform 变量</div>';
                return;
            }

            const title = document.createElement('div');
            title.textContent = '🎮 Uniform 变量';
            Object.assign(title.style, {
                color: '#aaa',
                fontSize: '12px',
                marginBottom: '8px'
            });
            panel.appendChild(title);

            uniforms.forEach(u => {
                const row = document.createElement('div');
                Object.assign(row.style, {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px',
                    flexWrap: 'wrap'
                });

                const label = document.createElement('span');
                label.textContent = u.name;
                Object.assign(label.style, {
                    color: '#ccc',
                    fontSize: '11px',
                    minWidth: '80px'
                });
                row.appendChild(label);

                if (u.type === 'float' || u.type === 'int') {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.step = '0.01';
                    input.value = '0.5';
                    Object.assign(input.style, {
                        width: '80px',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#1a1a2e',
                        color: 'white',
                        fontSize: '11px'
                    });
                    input.oninput = () => this.previewUniformControls[u.name] = parseFloat(input.value) || 0;
                    row.appendChild(input);
                    this.previewUniformControls[u.name] = 0.5;
                } else if (u.type === 'vec2') {
                    const inputX = document.createElement('input');
                    inputX.type = 'number';
                    inputX.step = '0.01';
                    inputX.value = '0.5';
                    inputX.placeholder = 'x';
                    const inputY = document.createElement('input');
                    inputY.type = 'number';
                    inputY.step = '0.01';
                    inputY.value = '0.5';
                    inputY.placeholder = 'y';
                    [inputX, inputY].forEach(inp => {
                        Object.assign(inp.style, {
                            width: '50px',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            border: 'none',
                            backgroundColor: '#1a1a2e',
                            color: 'white',
                            fontSize: '11px'
                        });
                    });
                    this.previewUniformControls[u.name] = [0.5, 0.5];
                    inputX.oninput = () => this.previewUniformControls[u.name][0] = parseFloat(inputX.value) || 0;
                    inputY.oninput = () => this.previewUniformControls[u.name][1] = parseFloat(inputY.value) || 0;
                    row.appendChild(inputX);
                    row.appendChild(inputY);
                } else if (u.type === 'vec3') {
                    ['x', 'y', 'z'].forEach((p, i) => {
                        const inp = document.createElement('input');
                        inp.type = 'number';
                        inp.step = '0.01';
                        inp.value = '0.5';
                        inp.placeholder = p;
                        Object.assign(inp.style, {
                            width: '45px',
                            padding: '4px 2px',
                            borderRadius: '4px',
                            border: 'none',
                            backgroundColor: '#1a1a2e',
                            color: 'white',
                            fontSize: '10px'
                        });
                        if (!this.previewUniformControls[u.name]) this.previewUniformControls[u.name] = [0.5, 0.5, 0.5];
                        inp.oninput = () => this.previewUniformControls[u.name][i] = parseFloat(inp.value) || 0;
                        row.appendChild(inp);
                    });
                }

                panel.appendChild(row);
            });
        }

        _compilePreview() {
            const els = this.importerElements;
            const gl = this.previewGL;
            if (!els || !gl) return;

            const fragSource = els.fragArea.value;
            const isGLSL300 = fragSource.includes('#version 300 es');
            const vertSource = isGLSL300 ? this.previewVert300 : this.previewVert100;

            const vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, vertSource);
            gl.compileShader(vs);
            if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
                els.errorMsg.textContent = '❌ 顶点错误: ' + gl.getShaderInfoLog(vs);
                return;
            }

            const fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fs, fragSource);
            gl.compileShader(fs);
            if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
                els.errorMsg.textContent = '❌ 片元错误: ' + gl.getShaderInfoLog(fs);
                return;
            }

            const prog = gl.createProgram();
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                els.errorMsg.textContent = '❌ 链接错误: ' + gl.getProgramInfoLog(prog);
                return;
            }

            this.previewProgram = prog;
            gl.useProgram(prog);

            const vertices = new Float32Array([
                -1, -1, 0, 1, 0, 0, 1, 1, 1, 1,
                1, -1, 0, 1, 1, 0, 1, 1, 1, 1,
                -1, 1, 0, 1, 0, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 1, 1, 1
            ]);

            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            const stride = (4 + 2 + 4) * 4;

            const aPos = gl.getAttribLocation(prog, 'a_position');
            if (aPos >= 0) {
                gl.enableVertexAttribArray(aPos);
                gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, stride, 0);
            }

            const aTex = gl.getAttribLocation(prog, 'a_texCoord');
            if (aTex >= 0) {
                gl.enableVertexAttribArray(aTex);
                gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, stride, 16);
            }

            const aColor = gl.getAttribLocation(prog, 'a_color');
            if (aColor >= 0) {
                gl.enableVertexAttribArray(aColor);
                gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, stride, 24);
            }

            const uTransform = gl.getUniformLocation(prog, 'u_transform');
            if (uTransform) {
                const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
                gl.uniformMatrix4fv(uTransform, false, identity);
            }

            const bgType = els.bgSelect.value;
            if (this.previewGridTexture) gl.deleteTexture(this.previewGridTexture);
            this.previewGridTexture = this._createPreviewTexture(bgType);

            const uniforms = this._parseUniforms(fragSource);
            this._createUniformInputs(uniforms);

            els.errorMsg.textContent = ' 编译成功';

            if (this.previewAnimFrame) cancelAnimationFrame(this.previewAnimFrame);
            this._renderPreview();
        }

        _renderPreview() {
            const els = this.importerElements;
            const gl = this.previewGL;
            const prog = this.previewProgram;

            if (!els || !gl || !prog) {
                this.previewAnimFrame = requestAnimationFrame(() => this._renderPreview());
                return;
            }

            gl.useProgram(prog);

            const time = (Date.now() - this.previewStartTime) / 1000;
            const uTime = gl.getUniformLocation(prog, 'u_time') || gl.getUniformLocation(prog, 'u_timer');
            const uMouse = gl.getUniformLocation(prog, 'u_mouse');
            const uRes = gl.getUniformLocation(prog, 'u_res') || gl.getUniformLocation(prog, 'u_resolution');

            if (uTime) gl.uniform1f(uTime, time);
            if (uMouse) gl.uniform2f(uMouse, this.previewMouse[0], this.previewMouse[1]);
            if (uRes) gl.uniform2f(uRes, els.canvas.width, els.canvas.height);

            const uSkin = gl.getUniformLocation(prog, 'u_skin');
            if (uSkin && this.previewGridTexture) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.previewGridTexture);
                gl.uniform1i(uSkin, 0);
            }

            Object.keys(this.previewUniformControls).forEach(name => {
                const loc = gl.getUniformLocation(prog, name);
                if (!loc) return;
                const val = this.previewUniformControls[name];
                if (typeof val === 'number') {
                    gl.uniform1f(loc, val);
                } else if (Array.isArray(val)) {
                    if (val.length === 2) gl.uniform2fv(loc, val);
                    else if (val.length === 3) gl.uniform3fv(loc, val);
                }
            });

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            this.previewAnimFrame = requestAnimationFrame(() => this._renderPreview());
        }

        // ========== 原有着色器预览（左右布局）==========

        previewExistingShader({
            shader
        }) {
            if (!shaderfile || !shaderfile.shaders[shader]) {
                alert(`着色器 "${shader}" 不存在`);
                return;
            }

            const shaderData = shaderfile.shaders[shader];
            const program = shaderfile.programs[shader];

            let fragSource = '';
            if (shaderData.projectData) {
                fragSource = shaderData.projectData.fragShader || shaderData.fragShader || '';
            } else if (shaderData.fragShader) {
                fragSource = shaderData.fragShader;
            }

            const currentUniforms = {};
            if (program && program.uniformDat) {
                Object.keys(program.uniformDat).forEach(key => {
                    const val = program.uniformDat[key];
                    if (Array.isArray(val)) {
                        currentUniforms[key] = [...val];
                    } else {
                        currentUniforms[key] = val;
                    }
                });
            }

            this._createUnifiedPreview(shader, fragSource, currentUniforms, (newUniforms) => {
                Object.keys(newUniforms).forEach(name => {
                    this._setUniform(shader, name, newUniforms[name]);
                });
                renderer.dirty = true;
            }, true);
        }

        _createUnifiedPreview(shaderName, fragSource, currentUniforms, onApply, showApplyBtn = true) {
            // 清理已存在的预览
            if (this.previewCleanup) this.previewCleanup();
            const existing = document.getElementById('unifiedPreviewOverlay');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'unifiedPreviewOverlay';
            Object.assign(overlay.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.7)',
                zIndex: '2147483646',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Microsoft YaHei, sans-serif'
            });

            const modal = document.createElement('div');
            Object.assign(modal.style, {
                width: '800px',
                maxWidth: '95%',
                backgroundColor: '#1a1a2e',
                borderRadius: '16px',
                padding: '20px',
                maxHeight: '85%',
                overflow: 'auto'
            });

            // 标题
            const title = document.createElement('h3');
            title.textContent = `🎨 ${shaderName}`;
            Object.assign(title.style, {
                color: '#eee',
                margin: '0 0 12px 0',
                fontSize: '16px'
            });
            modal.appendChild(title);

            // 左右布局容器
            const mainContainer = document.createElement('div');
            Object.assign(mainContainer.style, {
                display: 'flex',
                gap: '16px',
                minHeight: '400px'
            });

            // 左侧：预览
            const leftPanel = document.createElement('div');
            Object.assign(leftPanel.style, {
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                minWidth: '0'
            });

            const canvasContainer = document.createElement('div');
            Object.assign(canvasContainer.style, {
                flex: '1',
                display: 'flex',
                alignItems: 'stretch'
            });

            const canvas = document.createElement('canvas');
            Object.assign(canvas.style, {
                width: '100%',
                backgroundColor: '#000',
                borderRadius: '8px',
                border: '1px solid #e94560',
                display: 'block'
            });
            canvasContainer.appendChild(canvas);
            leftPanel.appendChild(canvasContainer);

            // 右侧：变量面板
            const rightPanel = document.createElement('div');
            Object.assign(rightPanel.style, {
                flex: '0 0 280px',
                display: 'flex',
                flexDirection: 'column'
            });

            const uniformPanel = document.createElement('div');
            Object.assign(uniformPanel.style, {
                padding: '12px',
                backgroundColor: '#0f3460',
                borderRadius: '8px',
                overflowY: 'auto',
                flex: '1'
            });
            rightPanel.appendChild(uniformPanel);

            mainContainer.appendChild(leftPanel);
            mainContainer.appendChild(rightPanel);
            modal.appendChild(mainContainer);

            // 按钮
            const btnRow = document.createElement('div');
            Object.assign(btnRow.style, {
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                marginTop: '16px'
            });

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '关闭';
            Object.assign(closeBtn.style, {
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0f3460',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
            });
            closeBtn.onclick = () => {
                if (this.previewCleanup) this.previewCleanup();
                overlay.remove();
            };

            btnRow.appendChild(closeBtn);

            if (showApplyBtn) {
                const applyBtn = document.createElement('button');
                applyBtn.textContent = ' 应用修改';
                Object.assign(applyBtn.style, {
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#e94560',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px'
                });
                btnRow.appendChild(applyBtn);
            }

            modal.appendChild(btnRow);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    if (this.previewCleanup) this.previewCleanup();
                    overlay.remove();
                }
            };

            this._initUnifiedPreview(canvas, uniformPanel, fragSource, currentUniforms,
                showApplyBtn ? btnRow.querySelector('button:last-child') : null,
                overlay, onApply);
        }

        _initUnifiedPreview(canvas, uniformPanel, fragSource, currentUniforms, applyBtn, overlay, onApply) {
            if (this.previewCleanup) {
                this.previewCleanup();
                this.previewCleanup = null;
            }
            if (this.previewAnimFrame) {
                cancelAnimationFrame(this.previewAnimFrame);
                this.previewAnimFrame = null;
            }

            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (!gl) {
                uniformPanel.innerHTML = '<div style="color:#f66;text-align:center;">浏览器不支持 WebGL</div>';
                return;
            }

            const uniforms = this._parseUniforms(fragSource);
            const uniformControls = {};

            // 先初始化 uniformControls
            uniforms.forEach(u => {
                let currentVal = currentUniforms[u.name];
                if (currentVal === undefined) {
                    currentVal = (u.type === 'float' || u.type === 'int') ? 0.5 : [0.5, 0.5];
                }
                if (u.type === 'float' || u.type === 'int') {
                    uniformControls[u.name] = typeof currentVal === 'number' ? currentVal : parseFloat(currentVal) || 0.5;
                } else {
                    uniformControls[u.name] = Array.isArray(currentVal) ? [...currentVal] : [0.5, 0.5];
                }
            });

            uniformPanel.innerHTML = '';
            if (uniforms.length === 0) {
                uniformPanel.innerHTML = '<div style="color:#666;text-align:center;padding:20px;">无 Uniform 变量</div>';
            } else {
                const titleEl = document.createElement('div');
                titleEl.textContent = '🎮 Uniform 变量';
                Object.assign(titleEl.style, {
                    color: '#aaa',
                    fontSize: '13px',
                    marginBottom: '8px',
                    fontWeight: 'bold'
                });
                uniformPanel.appendChild(titleEl);

                uniforms.forEach(u => {
                    const row = document.createElement('div');
                    Object.assign(row.style, {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px'
                    });

                    const label = document.createElement('span');
                    label.textContent = u.name;
                    Object.assign(label.style, {
                        color: '#ccc',
                        fontSize: '11px',
                        minWidth: '70px',
                        flexShrink: '0'
                    });
                    row.appendChild(label);

                    const inputRow = document.createElement('div');
                    Object.assign(inputRow.style, {
                        display: 'flex',
                        gap: '4px',
                        flex: '1'
                    });

                    if (u.type === 'float' || u.type === 'int') {
                        const input = document.createElement('input');
                        input.type = 'number';
                        input.step = '0.01';
                        input.value = uniformControls[u.name];
                        Object.assign(input.style, {
                            width: '100%',
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: '1px solid #e94560',
                            backgroundColor: '#0f3460',
                            color: 'white',
                            fontSize: '11px'
                        });
                        input.oninput = () => {
                            uniformControls[u.name] = parseFloat(input.value) || 0;
                        };
                        inputRow.appendChild(input);
                    } else if (u.type === 'vec2') {
                        ['x', 'y'].forEach((p, i) => {
                            const inp = document.createElement('input');
                            inp.type = 'number';
                            inp.step = '0.01';
                            inp.placeholder = p;
                            inp.value = uniformControls[u.name][i];
                            Object.assign(inp.style, {
                                flex: '1',
                                padding: '6px 4px',
                                borderRadius: '4px',
                                border: '1px solid #e94560',
                                backgroundColor: '#0f3460',
                                color: 'white',
                                fontSize: '11px'
                            });
                            inp.oninput = () => {
                                uniformControls[u.name][i] = parseFloat(inp.value) || 0;
                            };
                            inputRow.appendChild(inp);
                        });
                    } else if (u.type === 'vec3') {
                        ['x', 'y', 'z'].forEach((p, i) => {
                            const inp = document.createElement('input');
                            inp.type = 'number';
                            inp.step = '0.01';
                            inp.placeholder = p;
                            inp.value = uniformControls[u.name][i];
                            Object.assign(inp.style, {
                                flex: '1',
                                padding: '6px 2px',
                                borderRadius: '4px',
                                border: '1px solid #e94560',
                                backgroundColor: '#0f3460',
                                color: 'white',
                                fontSize: '10px'
                            });
                            inp.oninput = () => {
                                uniformControls[u.name][i] = parseFloat(inp.value) || 0;
                            };
                            inputRow.appendChild(inp);
                        });
                    }

                    row.appendChild(inputRow);
                    uniformPanel.appendChild(row);
                });
            }

            // 编译着色器
            const previewVert100 = `attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec4 a_color;
varying vec2 v_texCoord;
varying vec4 v_color;
varying vec2 scratch3_uv_replacement;
uniform mat4 u_transform;
void main() {
gl_Position = a_position;
v_texCoord = a_texCoord;
scratch3_uv_replacement = a_texCoord;
v_color = a_color;
}`;

            const previewVert300 = `#version 300 es
in vec4 a_position;
in vec2 a_texCoord;
in vec4 a_color;
out vec2 v_texCoord;
out vec4 v_color;
out vec2 scratch3_uv_replacement;
uniform mat4 u_transform;
void main() {
gl_Position = a_position;
v_texCoord = a_texCoord;
scratch3_uv_replacement = a_texCoord;
v_color = a_color;
}`;

            const isGLSL300 = fragSource.includes('#version 300 es');
            const vertSource = isGLSL300 ? previewVert300 : previewVert100;

            const vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, vertSource);
            gl.compileShader(vs);
            if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
                uniformPanel.innerHTML = '<div style="color:#f66;">❌ 顶点错误: ' + gl.getShaderInfoLog(vs) + '</div>';
                return;
            }

            const fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fs, fragSource);
            gl.compileShader(fs);
            if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
                uniformPanel.innerHTML = '<div style="color:#f66;">❌ 片元错误: ' + gl.getShaderInfoLog(fs) + '</div>';
                return;
            }

            const prog = gl.createProgram();
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                uniformPanel.innerHTML = '<div style="color:#f66;">❌ 链接错误: ' + gl.getProgramInfoLog(prog) + '</div>';
                return;
            }

            gl.useProgram(prog);

            const vertices = new Float32Array([
                -1, -1, 0, 1, 0, 0, 1, 1, 1, 1,
                1, -1, 0, 1, 1, 0, 1, 1, 1, 1,
                -1, 1, 0, 1, 0, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 1, 1, 1
            ]);

            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            const stride = (4 + 2 + 4) * 4;

            const aPos = gl.getAttribLocation(prog, 'a_position');
            if (aPos >= 0) {
                gl.enableVertexAttribArray(aPos);
                gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, stride, 0);
            }

            const aTex = gl.getAttribLocation(prog, 'a_texCoord');
            if (aTex >= 0) {
                gl.enableVertexAttribArray(aTex);
                gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, stride, 16);
            }

            const aColor = gl.getAttribLocation(prog, 'a_color');
            if (aColor >= 0) {
                gl.enableVertexAttribArray(aColor);
                gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, stride, 24);
            }

            const uTransform = gl.getUniformLocation(prog, 'u_transform');
            if (uTransform) {
                const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
                gl.uniformMatrix4fv(uTransform, false, identity);
            }

            const texCanvas = document.createElement('canvas');
            texCanvas.width = texCanvas.height = 64;
            const ctx = texCanvas.getContext('2d');
            ctx.fillStyle = '#2a2a2a';
            ctx.fillRect(0, 0, 64, 64);
            ctx.fillStyle = '#3a3a3a';
            ctx.fillRect(0, 0, 32, 32);
            ctx.fillRect(32, 32, 32, 32);
            ctx.fillStyle = '#4a4a4a';
            ctx.fillRect(16, 16, 2, 2);
            ctx.fillRect(48, 48, 2, 2);

            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCanvas);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

            const resize = () => {
                const container = canvas.parentElement;
                const w = container.clientWidth;
                if (w > 0) {
                    const h = Math.floor(w * 0.75);
                    canvas.width = w;
                    canvas.height = h;
                    canvas.style.height = h + 'px';
                    gl.viewport(0, 0, w, h);
                }
            };
            resize();
            window.addEventListener('resize', resize);

            const startTime = Date.now();
            let animFrame;
            let isRendering = true;

            const render = () => {
                if (!isRendering) return;

                gl.useProgram(prog);

                const time = (Date.now() - startTime) / 1000;
                const uTime = gl.getUniformLocation(prog, 'u_time') || gl.getUniformLocation(prog, 'u_timer');
                if (uTime) gl.uniform1f(uTime, time);

                const uRes = gl.getUniformLocation(prog, 'u_res') || gl.getUniformLocation(prog, 'u_resolution');
                if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);

                const uSkin = gl.getUniformLocation(prog, 'u_skin');
                if (uSkin) {
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.uniform1i(uSkin, 0);
                }

                const uTransform = gl.getUniformLocation(prog, 'u_transform');
                if (uTransform) {
                    const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
                    gl.uniformMatrix4fv(uTransform, false, identity);
                }

                uniforms.forEach(u => {
                    const loc = gl.getUniformLocation(prog, u.name);
                    if (!loc) return;
                    const val = uniformControls[u.name];
                    if (val === undefined) return;
                    if (typeof val === 'number') gl.uniform1f(loc, val);
                    else if (val.length === 2) gl.uniform2fv(loc, val);
                    else if (val.length === 3) gl.uniform3fv(loc, val);
                });

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                animFrame = requestAnimationFrame(render);
            };

            render();

            this.previewCleanup = () => {
                isRendering = false;
                if (animFrame) {
                    cancelAnimationFrame(animFrame);
                    animFrame = null;
                }
                window.removeEventListener('resize', resize);

                if (gl) {
                    if (texture) gl.deleteTexture(texture);
                    if (buffer) gl.deleteBuffer(buffer);
                    if (prog) gl.deleteProgram(prog);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                    gl.useProgram(null);
                    const loseContextExt = gl.getExtension('WEBGL_lose_context');
                    if (loseContextExt) loseContextExt.loseContext();
                }
            };

            if (applyBtn) {
                applyBtn.onclick = () => {
                    if (onApply) onApply(uniformControls);
                    if (this.previewCleanup) this.previewCleanup();
                    overlay.remove();
                };
            }

            const observer = new MutationObserver(() => {
                if (!document.body.contains(canvas)) {
                    if (this.previewCleanup) this.previewCleanup();
                    observer.disconnect();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        // 裁剪功能
        setClipBox({
            X1,
            Y1,
            X2,
            Y2
        }, {
            target
        }) {
            if (target.isStage) return;
            const drawableID = target.drawableID;

            const newClipbox = {
                x_min: Math.min(X1, X2),
                y_min: Math.min(Y1, Y2),
                x_max: Math.max(X1, X2),
                y_max: Math.max(Y1, Y2)
            };

            clipBoxes[drawableID] = newClipbox;
            if (target.drawable) {
                target.drawable.clipbox = newClipbox;
            }

            renderer.dirty = true;
        }

        clearClipBox(args, {
            target
        }) {
            if (target.isStage) return;
            const drawableID = target.drawableID;

            delete clipBoxes[drawableID];
            if (target.drawable) {
                delete target.drawable.clipbox;
            }

            renderer.dirty = true;
        }

        getClipBox({
            PROP
        }, {
            target
        }) {
            const drawableID = target.drawableID;
            const clipbox = clipBoxes[drawableID] || target.drawable?.clipbox;

            if (!clipbox) return "";

            switch (PROP) {
                case "width":
                    return clipbox.x_max - clipbox.x_min;
                case "height":
                    return clipbox.y_max - clipbox.y_min;
                case "min x":
                    return clipbox.x_min;
                case "min y":
                    return clipbox.y_min;
                case "max x":
                    return clipbox.x_max;
                case "max y":
                    return clipbox.y_max;
                default:
                    return "";
            }
        }

        // 混合功能
        setBlend({
            blendMode
        }, {
            target
        }) {
            if (target.isStage) return;
            const drawableID = target.drawableID;

            // 直接写入 renderer._allDrawables 中的 drawable 对象
            const drawable = renderer._allDrawables[drawableID];
            if (drawable) {
                drawable.blendMode = blendMode;
            }

            renderer.dirty = true;
        }

        getBlend(args, {
            target
        }) {
            return target.drawable?.blendMode || "default";
        }
        getID(args, util) {
            if (args.TARGET === "_myself_") return util.target.drawableID;
            if (args.TARGET === "_stage_") return runtime.getTargetForStage().drawableID;
            if (args.TARGET === "_pen_") return runtime.ext_pen?._penDrawableId || "";
            const videoL = runtime.ioDevices.video._drawable;
            if (args.TARGET === "_video_") return videoL !== -1 ? videoL : "";
            if (args.TARGET.includes("=SP-custLayer")) {
                const layerID = parseInt(args.TARGET);
                if (renderer._allDrawables[layerID]?.customDrawableName !== undefined) return layerID;
            }
            const target = runtime.getSpriteTargetByName(args.TARGET);
            return target ? target.drawableID : "";
        }
        getIDByOwner(args) {
            const ownerName = args.OWNER;
            const penID = runtime.ext_pen?._penDrawableId || "";
            if (ownerName === "Pen Layer" && penID) return penID;
            const videoL = runtime.ioDevices.video._drawable;
            const vidID = videoL !== -1 ? videoL : "";
            if (ownerName === "Video Layer" && vidID) return vidID;
            for (const target of runtime.targets) {
                if (target.getName() === ownerName) return target.drawableID;
            }
            for (const i of renderer._drawList) {
                const drawable = renderer._allDrawables[i];
                if (drawable?.customDrawableName !== undefined && drawable.customDrawableName === ownerName) return i;
            }
            return "";
        }
        getOwner(args) {
            const ID = Scratch.Cast.toNumber(args.ID);
            if (ID < 0) return "";
            const penID = runtime.ext_pen?._penDrawableId || "";
            const videoL = runtime.ioDevices.video._drawable;
            const vidID = videoL !== -1 ? videoL : "";
            if (ID === penID) return "Pen Layer";
            if (ID === vidID) return "Video Layer";
            for (const target of runtime.targets) {
                if (target.drawableID === ID) return target.getName();
            }
            for (const i of renderer._drawList) {
                const drawable = renderer._allDrawables[i];
                if (drawable.customDrawableName !== undefined && i === ID) return drawable.customDrawableName;
            }
            return "";
        }
        _getTargets() {
            const list = [{
                    text: "自己",
                    value: "_myself_"
                },
                {
                    text: "舞台",
                    value: "_stage_"
                },
                {
                    text: "视频图层",
                    value: "_video_"
                },
                {
                    text: "画笔图层",
                    value: "_pen_"
                }
            ];
            for (const i of renderer._drawList) {
                const drawable = renderer._allDrawables[i];
                if (drawable !== undefined && drawable.customDrawableName !== undefined) {
                    list.push({
                        text: drawable.customDrawableName,
                        value: `${i}=SP-custLayer`
                    });
                }
            }
            for (const target of runtime.targets) {
                if (target.isOriginal && !target.isStage) list.push({
                    text: target.getName(),
                    value: target.getName()
                });
            }
            return list;
        }
        showCacheMonitor() {
            const existing = document.getElementById('shadedCacheMonitor');
            if (existing) {
                existing.style.display = 'flex';
                return;
            }

            const monitor = document.createElement('div');
            monitor.id = 'shadedCacheMonitor';
            Object.assign(monitor.style, {
                position: 'fixed',
                top: '10px',
                right: '10px',
                width: '320px',
                maxHeight: '500px',
                backgroundColor: 'rgba(20, 20, 40, 0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                zIndex: '2147483647',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '12px',
                color: '#e0e0e0',
                border: '1px solid #e94560',
                overflow: 'hidden',
                userSelect: 'none'
            });

            const titleBar = document.createElement('div');
            titleBar.id = 'shadedCacheMonitorTitle';
            Object.assign(titleBar.style, {
                padding: '10px 12px',
                backgroundColor: '#e94560',
                cursor: 'move',
                touchAction: 'none', // ← 阻止浏览器默认手势
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#fff',
                flexShrink: '0'
            });

            const title = document.createElement('span');
            title.textContent = '📊 着色器缓存监视器';

            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.gap = '8px';

            const refreshBtn = document.createElement('button');
            refreshBtn.textContent = '🔄';
            refreshBtn.title = '刷新';
            Object.assign(refreshBtn.style, {
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '0 4px'
            });

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            closeBtn.title = '关闭';
            Object.assign(closeBtn.style, {
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '0 4px'
            });
            closeBtn.onclick = () => monitor.style.display = 'none';

            controls.appendChild(refreshBtn);
            controls.appendChild(closeBtn);
            titleBar.appendChild(title);
            titleBar.appendChild(controls);

            const content = document.createElement('div');
            content.id = 'shadedCacheContent';
            Object.assign(content.style, {
                padding: '12px',
                overflowY: 'auto',
                flex: '1',
                minHeight: '0'
            });

            monitor.appendChild(titleBar);
            monitor.appendChild(content);
            document.body.appendChild(monitor);

            // ===== 拖动功能（鼠标 + 触摸） =====
            let isDragging = false;
            let offsetX, offsetY;

            const startDrag = (e) => {
                if (e.target.tagName === 'BUTTON') return;
                isDragging = true;
                const rect = monitor.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                offsetX = clientX - rect.left;
                offsetY = clientY - rect.top;
                monitor.style.cursor = 'grabbing';
            };

            const moveDrag = (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                const x = clientX - offsetX;
                const y = clientY - offsetY;
                monitor.style.left = x + 'px';
                monitor.style.top = y + 'px';
                monitor.style.right = 'auto';
            };

            const endDrag = () => {
                isDragging = false;
                monitor.style.cursor = '';
            };

            // 鼠标
            titleBar.addEventListener('mousedown', startDrag);
            document.addEventListener('mousemove', moveDrag);
            document.addEventListener('mouseup', endDrag);

            // 触摸
            titleBar.addEventListener('touchstart', startDrag, {
                passive: false
            });
            document.addEventListener('touchmove', moveDrag, {
                passive: false
            });
            document.addEventListener('touchend', endDrag);

            // ===== 刷新功能 =====
            const updateContent = () => {
                content.innerHTML = this._getCacheStatsHTML();
            };

            refreshBtn.onclick = updateContent;

            // 自动刷新（6秒）
            const autoRefresh = setInterval(updateContent, 6000);

            closeBtn.onclick = () => {
                clearInterval(autoRefresh);
                monitor.style.display = 'none';
            };

            const observer = new MutationObserver(() => {
                if (!document.body.contains(monitor)) {
                    clearInterval(autoRefresh);
                    observer.disconnect();
                }
            });
            observer.observe(document.body, {
                childList: true
            });

            updateContent();
        }

        // 隐藏缓存监视器
        hideCacheMonitor() {
            const monitor = document.getElementById('shadedCacheMonitor');
            if (monitor) {
                monitor.style.display = 'none';
            }
        }

        // ========== 简化 _collectCacheStats，去掉重操作 ==========
        _collectCacheStats() {
            const stats = {
                totalShaders: 0,
                activeStageShaders: 0,
                activeSpriteShaders: 0,
                subShaders: 0,
                textures: 0,
                skins: 0,
                bufferInfoCount: 0,
                totalFramebuffers: 0,
                stageTracks: 0,
                spriteTracks: 0,
                totalSpriteTrackEntries: 0,
                clipBoxes: 0,
                protectedDrawables: 0,
                drawListLength: 0,
                drawableCount: 0,
                canvasWidth: 0,
                canvasHeight: 0,

                // 轻量 WebGL 信息（只取静态参数，不频繁查询）
                webglVersion: '',
                renderer: '',

                // 系统内存
                jsHeapSizeLimit: 0,
                totalJSHeapSize: 0,
                usedJSHeapSize: 0,

                shaderList: [],
                framebufferDetails: [],
                trackDetails: []
            };

            // ===== 着色器统计（轻量） =====
            if (shaderfile && shaderfile.shaders) {
                const shaderKeys = Object.keys(shaderfile.shaders);
                stats.totalShaders = shaderKeys.length;

                shaderKeys.forEach(name => {
                    const isSub = name.includes('_');
                    if (isSub) stats.subShaders++;

                    stats.shaderList.push({
                        name: name,
                        isSub: isSub
                    });
                });
            }

            // 使用中的着色器
            if (renderShadersList && renderShadersList.length > 0) {
                stats.activeStageShaders = renderShadersList.length;
            } else if (currentShader) {
                stats.activeStageShaders = 1;
            }

            stats.activeSpriteShaders = Object.keys(spriteShaders).length;

            // ===== 纹理统计 =====
            stats.textures = Object.keys(textures).length;
            stats.skins = Object.keys(skins).length;

            // ===== 帧缓冲统计 =====
            // 屏幕多重渲染：stageBuffer 本身是 2 个帧缓冲
            let stageBufferCount = 0;
            if (currentFrameBuffer) {
                // 屏幕着色器激活时，使用了 stageBuffer
                // stageBuffer 是 [framebuffer0, framebuffer1]
                if (multiRender && renderShadersList && renderShadersList.length > 1) {
                    stageBufferCount = 2; // 多重渲染时两个都用
                } else if (currentFrameBuffer === stageBuffer) {
                    stageBufferCount = 2; // 即使单着色器，stageBuffer 也占 2 个
                }
            }

            // 角色多重渲染缓冲
            let spriteBufferCount = 0;
            const spriteBufferDrawables = [];
            Object.keys(bufferInfo).forEach(id => {
                const buffers = bufferInfo[id];
                if (Array.isArray(buffers)) {
                    const validBuffers = buffers.filter(b => b !== null && b !== undefined);
                    if (validBuffers.length > 0) {
                        spriteBufferCount += validBuffers.length;
                        spriteBufferDrawables.push({
                            drawableID: id,
                            bufferCount: validBuffers.length
                        });
                    }
                }
            });

            stats.bufferInfoCount = Object.keys(bufferInfo).length;
            stats.totalFramebuffers = stageBufferCount + spriteBufferCount;
            stats.stageFramebuffers = stageBufferCount;
            stats.spriteFramebuffers = spriteBufferCount;
            stats.framebufferDetails = spriteBufferDrawables;

            // ===== 轨道统计 =====
            if (this.stageShaderTracks) {
                const stageKeys = Object.keys(this.stageShaderTracks);
                stats.stageTracks = stageKeys.filter(k => {
                    const v = this.stageShaderTracks[k];
                    return v && v !== "____PEN_PLUS__NO__SHADER____";
                }).length;
            }

            if (this.spriteShaderTracks) {
                stats.spriteTracks = Object.keys(this.spriteShaderTracks).length;

                Object.keys(this.spriteShaderTracks).forEach(id => {
                    const tracks = this.spriteShaderTracks[id];
                    if (tracks) {
                        const validTracks = Object.keys(tracks).filter(k => {
                            const v = tracks[k];
                            return v && v !== "____PEN_PLUS__NO__SHADER____";
                        });
                        stats.totalSpriteTrackEntries += validTracks.length;
                        stats.trackDetails.push({
                            drawableID: id,
                            trackCount: validTracks.length
                        });
                    }
                });
            }

            stats.clipBoxes = Object.keys(clipBoxes).length;
            stats.protectedDrawables = Object.keys(protectedDrawables).length;

            // ===== WebGL 静态信息（只在第一次获取，后续复用） =====
            if (!this._cachedWebGLInfo) {
                try {
                    this._cachedWebGLInfo = {
                        version: gl instanceof WebGL2RenderingContext ? 'WebGL 2.0' : 'WebGL 1.0',
                        renderer: gl.getParameter(gl.RENDERER),
                        vendor: gl.getParameter(gl.VENDOR),
                        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                        maxTextureUnits: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
                        extensions: gl.getSupportedExtensions() ? gl.getSupportedExtensions().length : 0
                    };
                } catch (e) {
                    this._cachedWebGLInfo = {
                        version: '未知'
                    };
                }
            }

            stats.webglVersion = this._cachedWebGLInfo.version;
            stats.renderer = this._cachedWebGLInfo.renderer || '';
            stats.vendor = this._cachedWebGLInfo.vendor || '';
            stats.webglMaxTextureSize = this._cachedWebGLInfo.maxTextureSize || 0;
            stats.webglMaxTextureUnits = this._cachedWebGLInfo.maxTextureUnits || 0;
            stats.webglExtensions = this._cachedWebGLInfo.extensions || 0;

            // ===== 画布信息 =====
            stats.canvasWidth = gl.canvas ? gl.canvas.width : 0;
            stats.canvasHeight = gl.canvas ? gl.canvas.height : 0;
            stats.drawListLength = renderer._drawList ? renderer._drawList.length : 0;
            stats.drawableCount = renderer._allDrawables ? Object.keys(renderer._allDrawables).length : 0;

            // ===== 系统内存 =====
            if (performance && performance.memory) {
                stats.jsHeapSizeLimit = performance.memory.jsHeapSizeLimit;
                stats.totalJSHeapSize = performance.memory.totalJSHeapSize;
                stats.usedJSHeapSize = performance.memory.usedJSHeapSize;
            }
            // ===== 外观着色器（SPlooks）统计 =====
            stats.splooksDataCount = 0;
            stats.splooksReplacersCount = 0;
            stats.splooksLightsCount = 0;
            stats.splooksMaskTexture = null;

            if (parentExtension.splooksData) {
                const splooksKeys = Object.keys(parentExtension.splooksData);
                stats.splooksDataCount = splooksKeys.length;

                // 统计每个 splooksData 里的替换颜色和光源数量
                splooksKeys.forEach(drawableID => {
                    const data = parentExtension.splooksData[drawableID];
                    if (data) {
                        // 统计颜色替换
                        if (data.u_numReplacersSP && data.u_numReplacersSP > 0) {
                            stats.splooksReplacersCount += data.u_numReplacersSP;
                        }
                        // 统计光源
                        if (data.u_numLightsSP && data.u_numLightsSP > 0) {
                            stats.splooksLightsCount += data.u_numLightsSP;
                        }
                    }
                });
            }

            // 遮罩纹理
            stats.splooksHasMaskTexture = !!parentExtension._splooksMaskTexture;

            // 全局替换器
            stats.splooksGlobalReplacers = parentExtension._splooksReplacers ? parentExtension._splooksReplacers.length : 0;

            // 全局光源
            stats.splooksGlobalLights = parentExtension._splooksLights ? parentExtension._splooksLights.size : 0;
            return stats;
        }

        // ========== 简化 _getCacheStatsHTML ==========
        _getCacheStatsHTML() {
            const stats = this._collectCacheStats();

            const formatBytes = (bytes) => {
                if (!bytes || bytes < 0) return '0 B';
                if (bytes < 1024) return bytes + ' B';
                if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
                return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
            };

            const formatPercent = (used, total) => {
                if (!total) return '0%';
                return ((used / total) * 100).toFixed(1) + '%';
            };

            const sectionStyle = 'margin-bottom: 14px;';
            const titleStyle = 'color: #e94560; margin-bottom: 6px; font-weight: bold; font-size: 13px; border-bottom: 1px solid #333; padding-bottom: 4px;';
            const gridStyle = 'display: grid; grid-template-columns: 1fr 1fr; gap: 3px 10px; font-size: 11px;';
            const labelStyle = 'color: #999;';
            const valueStyle = 'color: #4ecdc4; text-align: right;';

            return `
    <div style="${sectionStyle}">
        <div style="${titleStyle}"> WebGL 上下文</div>
        <div style="${gridStyle}">
            <span style="${labelStyle}">版本:</span><span style="${valueStyle}">${stats.webglVersion || '未知'}</span>
            <span style="${labelStyle}">厂商:</span><span style="${valueStyle}">${(stats.vendor || '').substring(0, 20)}</span>
            <span style="${labelStyle}">渲染器:</span><span style="${valueStyle}">${(stats.renderer || '').substring(0, 20)}</span>
            <span style="${labelStyle}">最大纹理:</span><span style="${valueStyle}">${stats.webglMaxTextureSize || '?'}</span>
            <span style="${labelStyle}">纹理单元:</span><span style="${valueStyle}">${stats.webglMaxTextureUnits || '?'}</span>
        </div>
    </div>
    
    <div style="${sectionStyle}">
        <div style="${titleStyle}">📋 着色器</div>
        <div style="${gridStyle}">
            <span style="${labelStyle}">总数:</span><span style="${valueStyle}">${stats.totalShaders}</span>
            <span style="${labelStyle}">副着色器:</span><span style="${valueStyle}">${stats.subShaders}</span>
            <span style="${labelStyle}">屏幕使用中:</span><span style="${valueStyle}">${stats.activeStageShaders}</span>
            <span style="${labelStyle}">角色使用中:</span><span style="${valueStyle}">${stats.activeSpriteShaders}</span>
        </div>
    </div>
    
    <div style="${sectionStyle}">
        <div style="${titleStyle}">🎨 纹理</div>
        <div style="${gridStyle}">
            <span style="${labelStyle}">纹理引用:</span><span style="${valueStyle}">${stats.textures}</span>
            <span style="${labelStyle}">皮肤引用:</span><span style="${valueStyle}">${stats.skins}</span>
        </div>
    </div>
    
<div style="${sectionStyle}">
    <div style="${titleStyle}">🖼️ 帧缓冲</div>
    <div style="${gridStyle}">
        <span style="${labelStyle}">容器数:</span><span style="${valueStyle}">${stats.bufferInfoCount}</span>
        <span style="${labelStyle}">缓冲总数:</span><span style="${valueStyle}">${stats.totalFramebuffers}</span>
        <span style="${labelStyle}">屏幕缓冲:</span><span style="${valueStyle}">${stats.stageFramebuffers}</span>
        <span style="${labelStyle}">角色缓冲:</span><span style="${valueStyle}">${stats.spriteFramebuffers}</span>
    </div>
    ${stats.framebufferDetails.length > 0 ? `
    <div style="margin-top: 4px; max-height: 60px; overflow-y: auto; font-size: 10px; color: #666;">
        ${stats.framebufferDetails.map(fb => 
            `<div>图层 ${fb.drawableID}: ${fb.bufferCount} 个缓冲</div>`
        ).join('')}
    </div>` : ''}
</div>

${stats.splooksDataCount > 0 ? `
<div style="${sectionStyle}">
    <div style="${titleStyle}">🎨 外观着色器 (SPlooks)</div>
    <div style="${gridStyle}">
        <span style="${labelStyle}">SPlooks 数据:</span><span style="${valueStyle}">${stats.splooksDataCount} 条目</span>
        <span style="${labelStyle}">颜色替换:</span><span style="${valueStyle}">${stats.splooksReplacersCount} 个</span>
        <span style="${labelStyle}">光源:</span><span style="${valueStyle}">${stats.splooksLightsCount} 个</span>
        <span style="${labelStyle}">全局替换器:</span><span style="${valueStyle}">${stats.splooksGlobalReplacers}</span>
        <span style="${labelStyle}">全局光源:</span><span style="${valueStyle}">${stats.splooksGlobalLights}</span>
        <span style="${labelStyle}">遮罩纹理:</span><span style="${valueStyle}">${stats.splooksHasMaskTexture ? '✓ 已设置' : '✗ 未设置'}</span>
    </div>
</div>
` : `
<div style="${sectionStyle}">
    <div style="${titleStyle}">🎨 外观着色器 (SPlooks)</div>
    <div style="text-align: center; color: #6272a4; padding: 8px; font-size: 11px;">暂无外观着色器数据</div>
</div>
`}

<div style="${sectionStyle}">
    <div style="${titleStyle}">🔧 轨道 & 其他</div>
    <div style="${gridStyle}">
        <span style="${labelStyle}">屏幕轨道:</span><span style="${valueStyle}">${stats.stageTracks}</span>
        <span style="${labelStyle}">角色轨道:</span><span style="${valueStyle}">${stats.spriteTracks}</span>
        <span style="${labelStyle}">轨道条目:</span><span style="${valueStyle}">${stats.totalSpriteTrackEntries}</span>
        <span style="${labelStyle}">裁剪框:</span><span style="${valueStyle}">${stats.clipBoxes}</span>
        <span style="${labelStyle}">保护图层:</span><span style="${valueStyle}">${stats.protectedDrawables}</span>
    </div>
</div>
    
    <div style="${sectionStyle}">
        <div style="${titleStyle}">📐 画布 & 内存</div>
        <div style="${gridStyle}">
            <span style="${labelStyle}">画布:</span><span style="${valueStyle}">${stats.canvasWidth} x ${stats.canvasHeight}</span>
            <span style="${labelStyle}">绘制列表:</span><span style="${valueStyle}">${stats.drawListLength} 项</span>
            <span style="${labelStyle}">JS 内存:</span><span style="${valueStyle}">${formatBytes(stats.usedJSHeapSize)}</span>
            <span style="${labelStyle}">使用率:</span><span style="${valueStyle}">${formatPercent(stats.usedJSHeapSize, stats.jsHeapSizeLimit)}</span>
        </div>
    </div>
    
    ${stats.shaderList.length > 0 ? `
    <div style="${sectionStyle}">
        <div style="${titleStyle}">📜 着色器清单 (${stats.shaderList.length})</div>
        <div style="max-height: 100px; overflow-y: auto; font-size: 10px;">
            ${stats.shaderList.map(s => `
                <div style="padding: 2px 0; border-bottom: 1px solid #2a2a2a; display: flex; justify-content: space-between;">
                    <span style="color: #ccc;">${s.name}</span>
                    <span style="color: ${s.isSub ? '#a06cd5' : '#4ecdc4'};">${s.isSub ? '副' : '主'}</span>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}
    
    <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #444; text-align: center; color: #555; font-size: 10px;">
        🔄 ${new Date().toLocaleTimeString()} · 每3秒刷新 · ${stats.webglVersion || '?'}
    </div>
`;
        }
        // 获取屏幕着色器轨道数量
        getStageTrackCount() {
            if (!this.stageShaderTracks) return 0;
            // 只统计有效轨道（有值且不是"无着色器"）
            return Object.keys(this.stageShaderTracks).filter(track => {
                const shader = this.stageShaderTracks[track];
                return shader && shader !== "____PEN_PLUS__NO__SHADER____";
            }).length;
        }

        // 获取指定图层的着色器轨道数量
        getSpriteTrackCount({
            id
        }) {
            const drawableID = Scratch.Cast.toNumber(id);

            if (!this.spriteShaderTracks || !this.spriteShaderTracks[drawableID]) {
                return 0;
            }

            const tracks = this.spriteShaderTracks[drawableID];
            // 只统计有效轨道
            return Object.keys(tracks).filter(track => {
                const shader = tracks[track];
                return shader && shader !== "____PEN_PLUS__NO__SHADER____";
            }).length;
        }

        // 获取屏幕着色器数组
        getStageShaderArray() {
            if (!renderShadersList || renderShadersList.length === 0) {
                return "[]";
            }
            return JSON.stringify(renderShadersList);
        }

        // 获取指定图层的着色器数组
        getSpriteShaderArray({
            id
        }) {
            const drawableID = Scratch.Cast.toNumber(id);

            // 优先检查多重渲染列表
            if (renderSpriteShadersList && renderSpriteShadersList[drawableID]) {
                return JSON.stringify(renderSpriteShadersList[drawableID]);
            }

            // 单着色器模式
            if (spriteShaders[drawableID] && spriteShaders[drawableID] !== "____PEN_PLUS__NO__SHADER____") {
                return JSON.stringify([spriteShaders[drawableID]]);
            }

            return "[]";
        }
        setRenderSize({
            X,
            Y
        }) {
            const w = Scratch.Cast.toNumber(X);
            const h = Scratch.Cast.toNumber(Y);
            if (w > 0 && h > 0) {
                this._setRenderSizeFunc(w, h);
            }
        }
        setRenderMode({
            MODE
        }) {
            const canvas = renderer.canvas;
            canvas.style.imageRendering = MODE === "pixelated" ? "pixelated" : "";
        }

        getStageSize({
            DIMENSION
        }) {
            const width = renderer._nativeSize ? renderer._nativeSize[0] : 480;
            const height = renderer._nativeSize ? renderer._nativeSize[1] : 360;
            return DIMENSION === "width" ? width : height;
        }
        protectDrawable(args) {
            protectedDrawables[Scratch.Cast.toNumber(args.id)] = true;
            renderer.dirty = true;
        }

        unprotectDrawable(args) {
            delete protectedDrawables[Scratch.Cast.toNumber(args.id)];
            renderer.dirty = true;
        }

        clearAllProtected() {
            protectedDrawables = {};
            renderer.dirty = true;
        }
        getProtectedDrawables() {
            return JSON.stringify(Object.keys(protectedDrawables).map(Number));
        }
        getDrawOrder() {
            const list = (customDrawOrderEnabled && customDrawOrder) ? customDrawOrder : renderer._drawList;
            return JSON.stringify(list);
        }
        getDrawOrderLength() {
            const list = (customDrawOrderEnabled && customDrawOrder) ? customDrawOrder : renderer._drawList;
            return list.length;
        }
        setCustomDrawOrderEnabled(args) {
            if (args.enabled === "on") {
                customDrawOrderEnabled = true;
                if (!customDrawOrder) {
                    customDrawOrder = renderer._drawList.slice();
                }
            } else {
                customDrawOrderEnabled = false;
                customDrawOrder = null;
            }
            renderer.dirty = true;
        }

        isCustomDrawOrderEnabled() {
            return customDrawOrderEnabled;
        }
        // ========== Z-Order 积木方法 ==========

        // 设置 Z 值
        setLayerZ({
            ID,
            Z
        }) {
            const drawableID = Scratch.Cast.toNumber(ID);
            if (!renderer._allDrawables[drawableID]) return;
            layerZMap[drawableID] = Scratch.Cast.toNumber(Z);
            renderer.dirty = true;
        }

        // Z 值增减
        changeLayerZ({
            ID,
            STEP
        }) {
            const drawableID = Scratch.Cast.toNumber(ID);
            if (!renderer._allDrawables[drawableID]) return;
            if (layerZMap[drawableID] === undefined) {
                layerZMap[drawableID] = 0;
            }
            layerZMap[drawableID] += Scratch.Cast.toNumber(STEP);
            renderer.dirty = true;
        }

        // 获取 Z 值
        getLayerZ({
            ID
        }) {
            const drawableID = Scratch.Cast.toNumber(ID);
            return layerZMap[drawableID] ?? 0;
        }

        // 手动排序
        sortLayers({
            ORDER
        }) {
            if (!customDrawOrderEnabled || !customDrawOrder) return;
            const order = ORDER === "desc" ? -1 : 1;
            customDrawOrder.sort((a, b) => {
                const za = layerZMap[a] ?? 0;
                const zb = layerZMap[b] ?? 0;
                return (za - zb) * order;
            });
            renderer.dirty = true;
        }

        // 获取图层坐标
        getLayerBounds({
            ID,
            PROP
        }) {
            const drawableID = Scratch.Cast.toNumber(ID);
            const drawable = renderer._allDrawables[drawableID];
            if (!drawable) return 0;

            const pos = drawable._position || [0, 0];
            const skinScale = drawable._skinScale || [0, 0];

            switch (PROP) {
                case "x":
                    return pos[0];
                case "y":
                    return pos[1];
                case "left":
                    return pos[0] - skinScale[0] / 2;
                case "right":
                    return pos[0] + skinScale[0] / 2;
                case "top":
                    return pos[1] + skinScale[1] / 2;
                case "bottom":
                    return pos[1] - skinScale[1] / 2;
                default:
                    return 0;
            }
        }
        // ========== 纹理绑定系统 ==========

        // 绑定纹理到着色器
        bindTextureToShader({
            id,
            shader,
            uniformName
        }) {
            const drawableID = Scratch.Cast.toNumber(id);
            const shaderName = String(shader);
            const uniform = String(uniformName || 'u_texture');

            // 检查图层是否存在
            const drawable = renderer._allDrawables[drawableID];
            if (!drawable) {
                console.warn('图层 ' + drawableID + ' 不存在');
                return;
            }

            // 检查图层是否有皮肤
            if (!drawable.skin) {
                console.warn('图层 ' + drawableID + ' 没有皮肤');
                return;
            }

            // 检查着色器是否存在
            if (!shaderfile || !shaderfile.shaders[shaderName]) {
                console.warn('着色器 "' + shaderName + '" 不存在');
                return;
            }

            // 初始化存储
            if (!this.shaderTextureBindings) {
                this.shaderTextureBindings = {};
            }
            if (!this.shaderTextureBindings[shaderName]) {
                this.shaderTextureBindings[shaderName] = {};
            }

            // 存储绑定
            this.shaderTextureBindings[shaderName][uniform] = {
                drawableID: drawableID
            };

            renderer.dirty = true;
        }

        // 解除绑定
        unbindTextureFromShader({
            shader,
            uniformName
        }) {
            const shaderName = String(shader);
            const uniform = String(uniformName || 'u_texture');

            if (!this.shaderTextureBindings || !this.shaderTextureBindings[shaderName]) {
                return;
            }

            delete this.shaderTextureBindings[shaderName][uniform];

            // 如果该着色器没有绑定了，删除整个条目
            if (Object.keys(this.shaderTextureBindings[shaderName]).length === 0) {
                delete this.shaderTextureBindings[shaderName];
            }

            renderer.dirty = true;
        }

        // 清除着色器的所有绑定
        clearShaderTextureBindings({
            shader
        }) {
            const shaderName = String(shader);

            if (!this.shaderTextureBindings) return;
            delete this.shaderTextureBindings[shaderName];
            renderer.dirty = true;
        }

        // 清除所有绑定
        clearAllShaderTextureBindings() {
            this.shaderTextureBindings = {};
            renderer.dirty = true;
        }

        // 获取着色器某个 uniform 绑定的图层ID
        getShaderTextureBinding({
            shader,
            uniformName
        }) {
            const shaderName = String(shader);
            const uniform = String(uniformName || 'u_texture');

            if (!this.shaderTextureBindings ||
                !this.shaderTextureBindings[shaderName] ||
                !this.shaderTextureBindings[shaderName][uniform]) {
                return -1;
            }

            return this.shaderTextureBindings[shaderName][uniform].drawableID;
        }

        // ========== 纹理绑定 ==========
        getBoundShaders() {
            if (!this.shaderTextureBindings) return "[]";
            return JSON.stringify(Object.keys(this.shaderTextureBindings));
        }

        maskShaderExample() {
            return `precision highp float;
varying vec2 v_texCoord;
varying vec2 v_screenUV;
uniform sampler2D u_skin;
uniform sampler2D u_mask;
uniform float u_maskMode;

void main() {
vec2 maskUV = v_screenUV;
maskUV.y = 1.0 - maskUV.y;

vec4 original = texture2D(u_skin, v_texCoord);
vec4 mask = texture2D(u_mask, maskUV);

float maskAlpha = mask.a;

if (u_maskMode > 0.5) {
    maskAlpha = 1.0 - maskAlpha;
}

float finalAlpha = original.a * maskAlpha;

gl_FragColor = vec4(original.rgb * finalAlpha, finalAlpha);
}`;
        }

        // ========== 乒乓缓冲管理（最终版） ==========

        // 立即删除
        _deleteBufferInfoNow(drawableID) {
            if (!bufferInfo[drawableID]) return;

            bufferInfo[drawableID].forEach(buf => {
                if (buf) {
                    try {
                        if (buf.framebuffer) {
                            gl.deleteFramebuffer(buf.framebuffer);
                        }
                        if (buf.attachments) {
                            buf.attachments.forEach(attachment => {
                                if (attachment instanceof WebGLTexture) {
                                    gl.deleteTexture(attachment);
                                } else if (attachment && attachment.texture) {
                                    gl.deleteTexture(attachment.texture);
                                }
                                if (attachment && attachment.renderbuffer) {
                                    gl.deleteRenderbuffer(attachment.renderbuffer);
                                }
                            });
                        }
                    } catch (e) {
                        console.warn('清理帧缓冲失败:', e);
                    }
                }
            });
            delete bufferInfo[drawableID];
        }


        // 创建缓冲
        _ensureBufferInfo(drawableID) {
            if (!multiRender) return false;

            const shaderList = renderSpriteShadersList[drawableID];
            const hasMultipleShaders = shaderList && shaderList.length > 1;

            if (hasMultipleShaders) {
                if (!bufferInfo[drawableID]) {
                    bufferInfo[drawableID] = [
                        twgl.createFramebufferInfo(gl, stageBufferAttachments),
                        twgl.createFramebufferInfo(gl, stageBufferAttachments)
                    ];
                }
                return true;
            }

            return false;
        }

        // 每帧只检查一个
        _checkOneBufferPerFrame() {
            const ids = Object.keys(bufferInfo);
            if (ids.length === 0) return;

            // 多重渲染关了 → 全删
            if (!multiRender) {
                ids.forEach(id => this._deleteBufferInfoNow(id));
                return;
            }

            if (!this._bufferCheckIndex) this._bufferCheckIndex = 0;
            if (this._bufferCheckIndex >= ids.length) this._bufferCheckIndex = 0;

            const drawableID = ids[this._bufferCheckIndex];
            this._bufferCheckIndex++;

            // 检查1：图层是否还存在
            if (!renderer._allDrawables[drawableID]) {
                this._deleteBufferInfoNow(drawableID);
                return;
            }

            // 检查2：是否还有多个着色器
            const shaderList = renderSpriteShadersList[drawableID];
            const hasMultipleShaders = shaderList && shaderList.length > 1;

            if (!hasMultipleShaders) {
                this._deleteBufferInfoNow(drawableID);
            }
        }

        // ========== setSpriteShader ==========
        setSpriteShader({
            shader
        }, util) {
            const drawableID = util.target.drawableID;

            if (shader == "____PEN_PLUS__NO__SHADER____") {
                delete spriteShaders[drawableID];
                delete renderSpriteShadersList[drawableID];
                delete textures[drawableID];

                renderer.dirty = true;
                return;
            }

            if (!shaderfile.shaders[shader]) {
                delete spriteShaders[drawableID];
                delete renderSpriteShadersList[drawableID];
                delete textures[drawableID];

                renderer.dirty = true;
                return;
            }

            if (multiRender) {
                if (!renderSpriteShadersList[drawableID]) renderSpriteShadersList[drawableID] = [];
                renderSpriteShadersList[drawableID].push(shader);
            }

            spriteShaders[drawableID] = shader;
            this._ensureBufferInfo(drawableID);
            renderer.dirty = true;
        }

        // ========== setSpriteShaderAtTrack ==========
        setSpriteShaderAtTrack({
            shader,
            id,
            track
        }) {
            const drawableID = Scratch.Cast.toNumber(id);
            const trackNum = Scratch.Cast.toNumber(track);

            if (!renderer._allDrawables[drawableID]) return;

            if (shader !== "____PEN_PLUS__NO__SHADER____" && shader && !shaderfile.shaders[shader]) {
                console.warn(`着色器 "${shader}" 不存在`);
                return;
            }

            if (!this.spriteShaderTracks) {
                this.spriteShaderTracks = {};
            }
            if (!this.spriteShaderTracks[drawableID]) {
                this.spriteShaderTracks[drawableID] = {};
            }

            if (shader === "____PEN_PLUS__NO__SHADER____" || !shader) {
                delete this.spriteShaderTracks[drawableID][trackNum];
            } else {
                this.spriteShaderTracks[drawableID][trackNum] = shader;
            }

            this._rebuildSpriteListFromTracks(drawableID);
            renderer.dirty = true;
        }

        // ========== removeSpriteShaderTrack ==========
        removeSpriteShaderTrack({
            id,
            track
        }) {
            const drawableID = Scratch.Cast.toNumber(id);
            const trackNum = Scratch.Cast.toNumber(track);

            if (this.spriteShaderTracks?.[drawableID]) {
                delete this.spriteShaderTracks[drawableID][trackNum];

                if (Object.keys(this.spriteShaderTracks[drawableID]).length === 0) {
                    delete this.spriteShaderTracks[drawableID];
                    delete textures[drawableID];
                } else {
                    delete textures[drawableID];
                }
            }

            this._rebuildSpriteListFromTracks(drawableID);
            renderer.dirty = true;
        }

        // ========== clearAllSpriteTracksByID ==========
        clearAllSpriteTracksByID({
            id
        }) {
            const drawableID = Scratch.Cast.toNumber(id);

            if (this.spriteShaderTracks) {
                delete this.spriteShaderTracks[drawableID];
            }
            delete textures[drawableID];

            this._rebuildSpriteListFromTracks(drawableID);
            renderer.dirty = true;
        }

        // ========== clearAllSpriteTracks ==========
        clearAllSpriteTracks() {
            if (this.spriteShaderTracks) {
                Object.keys(this.spriteShaderTracks).forEach(id => {
                    const numID = Number(id);
                    delete this.spriteShaderTracks[id];
                    delete textures[numID];
                    this._rebuildSpriteListFromTracks(numID);
                });
            }

            this.spriteShaderTracks = {};
            renderer.dirty = true;
        }

        // ========== clearSpriteShader ==========
        clearSpriteShader({}, util) {
            const drawableID = util.target.drawableID;

            if (skins[drawableID]) {
                for (const target of runtime.targets) {
                    if (renderer._allDrawables[drawableID]?.skin?.id == skins[drawableID]) {
                        target.updateAllDrawableProperties();
                    }
                }
                renderer.destroySkin(skins[drawableID]);
                skins[drawableID] = null;
            }

            delete spriteShaders[drawableID];
            delete renderSpriteShadersList[drawableID];
            delete textures[drawableID];
            delete clipBoxes[drawableID];


            if (this.spriteShaderTracks?.[drawableID]) {
                delete this.spriteShaderTracks[drawableID];
            }

            renderer.dirty = true;
        }

        _rebuildSpriteListFromTracks(drawableID) {
            const tracks = this.spriteShaderTracks?.[drawableID];

            if (!tracks || Object.keys(tracks).length === 0) {
                delete renderSpriteShadersList[drawableID];
                delete spriteShaders[drawableID];
                delete textures[drawableID];
                return;
            }

            const orderedList = [];
            Object.keys(tracks)
                .map(Number)
                .filter(k => tracks[k] != null && tracks[k] !== "____PEN_PLUS__NO__SHADER____")
                .sort((a, b) => a - b)
                .forEach(k => orderedList.push(tracks[k]));

            if (orderedList.length === 0) {
                delete renderSpriteShadersList[drawableID];
                delete spriteShaders[drawableID];
                delete textures[drawableID];
            } else {
                renderSpriteShadersList[drawableID] = orderedList;
                spriteShaders[drawableID] = orderedList[0];

                if (orderedList.length > 1 && multiRender) {
                    this._ensureBufferInfo(drawableID);
                }
            }
        }
        getUniformValue({
            shader,
            uniformName
        }) {
            // 副着色器优先读 subShaderUniforms
            if (this.subShaders?.[shader]) {
                const val = this.subShaderUniforms?.[shader]?.[uniformName];
                if (val !== undefined && val !== null) {
                    return Array.isArray(val) ? JSON.stringify(val) : val;
                }
            }

            // 主着色器
            if (shaderfile.programs[shader]) {
                const val = shaderfile.programs[shader].uniformDat[uniformName];
                if (val !== undefined && val !== null) {
                    return Array.isArray(val) ? JSON.stringify(val) : val;
                }
            }

            return 0;
        }
        _getSplooksData(drawableID) {
            if (!this.splooksData) this.splooksData = {};
            if (!this.splooksData[drawableID]) {
                this.splooksData[drawableID] = {
                    u_tintColorSP: [1, 1, 1, 1],
                    u_warpSP: [0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5],
                    u_saturateSP: 1,
                    u_opaqueSP: 0,
                    u_contrastSP: 1,
                    u_posterizeSP: 0,
                    u_sepiaSP: 0,
                    u_bloomSP: 0,
                    u_brightnessSP: 1,
                    u_numReplacersSP: 0,
                    u_replaceColorFromSP: new Float32Array(15 * 3).fill(0),
                    u_replaceColorToSP: new Float32Array(15 * 4).fill(0),
                    u_replaceThresholdSP: new Float32Array(15).fill(1),
                    u_shouldMaskSP: 0,
                    u_maskTextureSP: null,
                    u_greenScreenEnabledSP: 0,
                    u_greenScreenColorSP: [0, 1, 0],
                    u_greenScreenStrengthSP: 0.2,
                    u_numLightsSP: 0,
                    u_lightPositionsSP: new Float32Array(8 * 2).fill(0),
                    u_lightColorsSP: new Float32Array(8 * 4).fill(0),
                    u_lightRangesXSP: new Float32Array(8).fill(0),
                    u_lightRangesYSP: new Float32Array(8).fill(0),
                    u_lightIntensitiesSP: new Float32Array(8).fill(0),
                    u_lightAttenuationsSP: new Float32Array(8 * 3).fill(0),
                    u_lightModesSP: new Int32Array(8).fill(0),
                    u_brightnessToAlphaSP: 0,
                    u_brightnessToAlphaStrengthSP: 1.0,
                    u_circleMaskEnabledSP: 0,
                    u_circleMaskCenterSP: [0.5, 0.5],
                    u_circleMaskSizeSP: [0.5, 0.5],
                    u_circleMaskFeatherSP: 0.05,
                    u_lightBeamEnabledSP: 0,
                    u_lightBeamOriginSP: [0.5, 0.5],
                    u_lightBeamParamsSP: [0.1, 0, 0.5, 1.0],
                    u_lightBeamColorSP: [1, 1, 1, 0.5],
                    u_lightBeamModeSP: 0,
                    u_waveEnabledSP: 0,
                    u_waveXAmplitudeSP: 0,
                    u_waveXFrequencySP: 1,
                    u_waveXTimeSP: 0,
                    u_waveYAmplitudeSP: 0,
                    u_waveYFrequencySP: 1,
                    u_waveYTimeSP: 0,
                    u_waveScaleXSP: 1,
                    u_waveScaleYSP: 1,
                    u_nineSliceEnabledSP: 0,
                    u_nineSliceLeftSP: 20,
                    u_nineSliceRightSP: 20,
                    u_nineSliceTopSP: 20,
                    u_nineSliceBottomSP: 20,
                    u_nineSliceTargetWidthSP: 200,
                    u_nineSliceTargetHeightSP: 200,
                    u_nineSliceBaseSP: 100,

                    // ===== 置换贴图 =====
                    u_displacementEnabledSP: 0,
                    u_displacementTextureSP: this._defaultTexture, // 指向默认纹理
                    u_displacementXSP: 0,
                    u_displacementYSP: 0,
                    u_displacementIntensitySP: 100,
                    u_displacementModeSP: 0,
                    _displacementURL: null,

                    _replacers: [],
                    _lights: new Map(),
                    _maskTexture: null,
                    _origScale: null
                };
            }
            return this.splooksData[drawableID];
        }
        // ========== 获取自己的图层ID ==========
        splooksGetDrawableID(args, util) {
            return util.target.drawableID;
        }

        // ========== 启用/关闭外观效果 ==========
        splooksEnable(args, util) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID || !renderer._allDrawables[drawableID]) return;

            this._getSplooksData(drawableID);

            if (!shaderfile.programs[BUILTIN_SPLOOKS_SHADER]) {
                initBuiltinSplooksShader();
            }

            delete renderSpriteShadersList[drawableID];
            delete textures[drawableID];
            if (bufferInfo[drawableID]) {
                bufferInfo[drawableID].forEach(buf => {
                    try {
                        if (buf.framebuffer) gl.deleteFramebuffer(buf.framebuffer);
                    } catch (e) {}
                });
                delete bufferInfo[drawableID];
            }
            spriteShaders[drawableID] = BUILTIN_SPLOOKS_SHADER;
            renderer.dirty = true;
        }

        splooksDisable(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;

            const drawable = renderer._allDrawables[drawableID];
            if (drawable) {
                const data = this.splooksData?.[drawableID];
                if (data?._origScale) {
                    drawable.updateScale(data._origScale);
                }
            }

            delete spriteShaders[drawableID];
            delete renderSpriteShadersList[drawableID];
            delete textures[drawableID];
            if (bufferInfo[drawableID]) {
                bufferInfo[drawableID].forEach(buf => {
                    try {
                        if (buf.framebuffer) gl.deleteFramebuffer(buf.framebuffer);
                    } catch (e) {}
                });
                delete bufferInfo[drawableID];
            }
            delete this.splooksData?.[drawableID];
            renderer.dirty = true;
        }

        // ========== 清除所有缓存 ==========
        splooksClearCache() {
            // 清理所有 splooksData
            if (this.splooksData) {
                Object.keys(this.splooksData).forEach(id => {
                    const drawable = renderer._allDrawables[id];
                    if (drawable && this.splooksData[id]._origScale) {
                        drawable.updateScale(this.splooksData[id]._origScale);
                    }
                    if (this.splooksData[id]._maskTexture) {
                        try {
                            gl.deleteTexture(this.splooksData[id]._maskTexture);
                        } catch (e) {}
                    }
                });
                this.splooksData = {};
            }

            // 清理所有应用了外观着色器的图层
            Object.keys(spriteShaders).forEach(id => {
                if (spriteShaders[id] === BUILTIN_SPLOOKS_SHADER) {
                    delete spriteShaders[id];
                    delete renderSpriteShadersList[id];
                    delete textures[id];
                    if (bufferInfo[id]) {
                        bufferInfo[id].forEach(buf => {
                            try {
                                if (buf.framebuffer) gl.deleteFramebuffer(buf.framebuffer);
                            } catch (e) {}
                        });
                        delete bufferInfo[id];
                    }
                }
            });

            this._splooksMaskTexture = null;
            renderer.dirty = true;
        }

        // ========== 重置所有效果 ==========
        splooksResetAll(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;

            const data = this._getSplooksData(drawableID);
            data.u_tintColorSP = [1, 1, 1, 1];
            data.u_warpSP = [0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5];
            data.u_saturateSP = 1;
            data.u_opaqueSP = 0;
            data.u_contrastSP = 1;
            data.u_posterizeSP = 0;
            data.u_sepiaSP = 0;
            data.u_bloomSP = 0;
            data.u_brightnessSP = 1;
            data.u_numReplacersSP = 0;
            data.u_replaceColorFromSP = new Float32Array(15 * 3).fill(0);
            data.u_replaceColorToSP = new Float32Array(15 * 4).fill(0);
            data.u_replaceThresholdSP = new Float32Array(15).fill(1);
            data.u_shouldMaskSP = 0;
            data.u_greenScreenEnabledSP = 0;
            data.u_greenScreenColorSP = [0, 1, 0];
            data.u_greenScreenStrengthSP = 0.2;
            data.u_numLightsSP = 0;
            data.u_lightPositionsSP = new Float32Array(8 * 2).fill(0);
            data.u_lightColorsSP = new Float32Array(8 * 4).fill(0);
            data.u_lightRangesXSP = new Float32Array(8).fill(0);
            data.u_lightRangesYSP = new Float32Array(8).fill(0);
            data.u_lightIntensitiesSP = new Float32Array(8).fill(0);
            data.u_lightModesSP = new Int32Array(8).fill(0);
            data.u_brightnessToAlphaSP = 0;
            data.u_brightnessToAlphaStrengthSP = 1.0;
            data.u_circleMaskEnabledSP = 0;
            data.u_circleMaskCenterSP = [0.5, 0.5];
            data.u_circleMaskSizeSP = [0.5, 0.5];
            data.u_circleMaskFeatherSP = 0.05;
            data.u_lightBeamEnabledSP = 0;
            data.u_lightBeamOriginSP = [0.5, 0.5];
            data.u_lightBeamParamsSP = [0.1, 0, 0.5, 1.0];
            data.u_lightBeamColorSP = [1, 1, 1, 0.5];
            data.u_lightBeamModeSP = 0;
            data._replacers = [];
            data._lights = new Map();
            data.u_waveEnabledSP = 0;
            data.u_waveXAmplitudeSP = 0;
            data.u_waveXFrequencySP = 1;
            data.u_waveXTimeSP = 0;
            data.u_waveYAmplitudeSP = 0;
            data.u_waveYFrequencySP = 1;
            data.u_waveYTimeSP = 0;
            data.u_nineSliceEnabledSP = 0;
            data.u_nineSliceLeftSP = 20;
            data.u_nineSliceRightSP = 20;
            data.u_nineSliceTopSP = 20;
            data.u_nineSliceBottomSP = 20;
            data.u_nineSliceTargetWidthSP = 200;
            data.u_nineSliceTargetHeightSP = 200;
            data.u_waveScaleXSP = 1;
            data.u_waveScaleYSP = 1;
            // ===== 重置置换贴图 =====
            data.u_displacementEnabledSP = 0;
            data.u_displacementXSP = 0;
            data.u_displacementYSP = 0;
            data.u_displacementIntensitySP = 100;
            data.u_displacementModeSP = 0;
            if (data.u_displacementTextureSP && data.u_displacementTextureSP !== this._defaultTexture) {
                try {
                    gl.deleteTexture(data.u_displacementTextureSP);
                } catch (e) {}
            }
            data.u_displacementTextureSP = this._defaultTexture;
            data._displacementURL = null;

            const drawable = renderer._allDrawables[drawableID];
            if (drawable && data._origScale) {
                drawable.updateScale(data._origScale);
                data._origScale = null;
            }

            renderer.dirty = true;
        }
        // ========== 色调 ==========
        splooksTint(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            this._getSplooksData(drawableID).u_tintColorSP = this._hex2Vec4(args.COLOR);
            renderer.dirty = true;
        }

        // ========== HSB ==========
        splooksApplyHSB(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const hex = this._hsbToHex(Scratch.Cast.toNumber(args.HUE), Scratch.Cast.toNumber(args.SAT), Scratch.Cast.toNumber(args.BRI));
            this._getSplooksData(drawableID).u_tintColorSP = this._hex2Vec4(hex);
            renderer.dirty = true;
        }

        splooksHSBToHex(args) {
            return this._hsbToHex(Scratch.Cast.toNumber(args.HUE), Scratch.Cast.toNumber(args.SAT), Scratch.Cast.toNumber(args.BRI));
        }

        // ========== 颜色替换 ==========
        splooksReplaceColor(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            data._replacers.push({
                from: this._hex2Vec4(args.COLOR1).slice(0, 3),
                to: this._hex2Vec4(args.COLOR2),
                threshold: Math.max(Scratch.Cast.toNumber(args.VALUE), 1) / 100,
                targetHex: args.COLOR1
            });
            this._syncReplacersData(data);
            renderer.dirty = true;
        }

        splooksResetColor(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            data._replacers = data._replacers.filter(r => r.targetHex !== args.COLOR);
            this._syncReplacersData(data);
            renderer.dirty = true;
        }

        splooksResetAllReplacers(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            data._replacers = [];
            data.u_numReplacersSP = 0;
            renderer.dirty = true;
        }

        _syncReplacersData(data) {
            const replacers = data._replacers || [];
            const count = Math.min(replacers.length, 15);
            const fromArr = new Float32Array(15 * 3).fill(0);
            const toArr = new Float32Array(15 * 4).fill(0);
            const threshArr = new Float32Array(15).fill(1);

            for (let i = 0; i < count; i++) {
                fromArr.set(replacers[i].from, i * 3);
                toArr.set(replacers[i].to, i * 4);
                threshArr[i] = replacers[i].threshold;
            }

            data.u_replaceColorFromSP = fromArr;
            data.u_replaceColorToSP = toArr;
            data.u_replaceThresholdSP = threshArr;
            data.u_numReplacersSP = count;
        }

        // ========== 颜色透明度 ==========
        splooksSetColorAlpha(args, util) {
            const color = args.COLOR;
            const alpha = Math.min(Math.max(Scratch.Cast.toNumber(args.ALPHA), 0), 100);
            let hex = color.startsWith("#") ? color.slice(1) : color;
            if (hex.length === 6) {
                const alphaHex = Math.round(alpha * 2.55).toString(16).padStart(2, '0');
                const transparentColor = "#" + hex + alphaHex;
                this.splooksReplaceColor({
                    DRAWABLE: args.DRAWABLE,
                    COLOR1: color,
                    COLOR2: transparentColor,
                    VALUE: args.SOFT
                }, util);
            }
        }

        splooksResetColorAlpha(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            data._replacers = data._replacers.filter(r => {
                const src = r.targetHex?.slice(0, 7);
                const tgt = this._vec4ToHex(r.to).slice(0, 7);
                return !(src === args.COLOR && src === tgt && r.to[3] < 1);
            });
            this._syncReplacersData(data);
            renderer.dirty = true;
        }

        splooksResetAllAlphas(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            data._replacers = data._replacers.filter(r => {
                const src = r.targetHex?.slice(0, 7);
                const tgt = this._vec4ToHex(r.to).slice(0, 7);
                return !(src === tgt && r.to[3] < 1);
            });
            this._syncReplacersData(data);
            renderer.dirty = true;
        }

        _vec4ToHex(v) {
            return `#${Math.round(v[0]*255).toString(16).padStart(2,'0')}${Math.round(v[1]*255).toString(16).padStart(2,'0')}${Math.round(v[2]*255).toString(16).padStart(2,'0')}${Math.round(v[3]*255).toString(16).padStart(2,'0')}`;
        }

        // ========== 绿幕 ==========
        splooksSetGreenScreen(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            data.u_greenScreenEnabledSP = 1;
            data.u_greenScreenColorSP = this._hex2Vec4(args.COLOR).slice(0, 3);
            data.u_greenScreenStrengthSP = Math.min(Math.max(Scratch.Cast.toNumber(args.STR), 1), 100) / 100;
            renderer.dirty = true;
        }

        splooksResetGreenScreen(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            this._getSplooksData(drawableID).u_greenScreenEnabledSP = 0;
            renderer.dirty = true;
        }

        // ========== 特效 ==========
        splooksSetEffect(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const name = Scratch.Cast.toString(args.EFFECT);
            const value = this._normalizeEffect(name, Scratch.Cast.toNumber(args.VALUE));
            const uniformMap = {
                saturation: "u_saturateSP",
                opaque: "u_opaqueSP",
                contrast: "u_contrastSP",
                posterize: "u_posterizeSP",
                sepia: "u_sepiaSP",
                bloom: "u_bloomSP",
                brightness: "u_brightnessSP"
            };
            if (uniformMap[name]) {
                this._getSplooksData(drawableID)[uniformMap[name]] = value;
            }
            renderer.dirty = true;
        }

        splooksGetEffect(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return 0;
            const name = Scratch.Cast.toString(args.EFFECT);
            const uniformMap = {
                saturation: "u_saturateSP",
                opaque: "u_opaqueSP",
                contrast: "u_contrastSP",
                posterize: "u_posterizeSP",
                sepia: "u_sepiaSP",
                bloom: "u_bloomSP",
                brightness: "u_brightnessSP"
            };
            if (uniformMap[name]) {
                const val = this._getSplooksData(drawableID)[uniformMap[name]];
                return this._denormalizeEffect(name, val ?? (name === "brightness" ? 1 : (name === "contrast" ? 1 : (name === "saturation" ? 1 : 0))));
            }
            return 0;
        }

        // ========== 四点扭曲 ==========
        splooksWarp(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;

            const x1 = Scratch.Cast.toNumber(args.X1);
            const y1 = Scratch.Cast.toNumber(args.Y1);
            const x2 = Scratch.Cast.toNumber(args.X2);
            const y2 = Scratch.Cast.toNumber(args.Y2);
            const x3 = Scratch.Cast.toNumber(args.X3);
            const y3 = Scratch.Cast.toNumber(args.Y3);
            const x4 = Scratch.Cast.toNumber(args.X4);
            const y4 = Scratch.Cast.toNumber(args.Y4);

            const drawable = renderer._allDrawables[drawableID];
            const data = this._getSplooksData(drawableID);
            if (!drawable) return;

            // 先恢复到角色当前设置的大小
            let target = null;
            const targets = runtime.targets;
            for (let i = 0; i < targets.length; i++) {
                if (targets[i].drawableID === drawableID) {
                    target = targets[i];
                    break;
                }
            }
            const originalSize = target ? target.size : 100;
            drawable.updateScale([originalSize, originalSize]);

            // 基于恢复后的大小计算包围盒
            const maxAbsX = Math.max(Math.abs(x1), Math.abs(x2), Math.abs(x3), Math.abs(x4), 100);
            const maxAbsY = Math.max(Math.abs(y1), Math.abs(y2), Math.abs(y3), Math.abs(y4), 100);
            const baseScale = 100;
            const actualMaxX = originalSize * (maxAbsX / baseScale);
            const actualMaxY = originalSize * (maxAbsY / baseScale);

            drawable.updateScale([actualMaxX, actualMaxY]);

            const scaleX = maxAbsX / 100;
            const scaleY = maxAbsY / 100;

            data.u_warpSP = [
                (x1 / scaleX) / -200, (y1 / scaleY) / -200,
                (x2 / scaleX) / -200, (y2 / scaleY) / -200,
                (x4 / scaleX) / -200, (y4 / scaleY) / -200,
                (x3 / scaleX) / -200, (y3 / scaleY) / -200
            ];
            renderer.dirty = true;
        }
        // ========== 遮罩 ==========
        splooksMask(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const url = Scratch.Cast.toString(args.IMAGE);
            const data = this._getSplooksData(drawableID);

            if (!url || !(url.startsWith("data:image/") || url.startsWith("https://"))) {
                data.u_shouldMaskSP = 0;
                renderer.dirty = true;
                return;
            }
            return new Promise((resolve) => {
                if (!data._maskTexture) {
                    data._maskTexture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, data._maskTexture);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                }
                const image = new Image();
                image.crossOrigin = "Anonymous";
                image.onload = () => {
                    gl.bindTexture(gl.TEXTURE_2D, data._maskTexture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                    data.u_maskTextureSP = data._maskTexture;
                    data.u_shouldMaskSP = 1;
                    renderer.dirty = true;
                    resolve();
                };
                image.onerror = (e) => {
                    console.warn(e);
                    resolve();
                };
                image.src = url;
            });
        }

        // ========== 点光源 ==========
        splooksSetPointLight(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            const lightId = Scratch.Cast.toString(args.ID);
            const colorVec = this._hex2Vec4(args.COLOR);
            const alpha = Math.max(0, Math.min(Scratch.Cast.toNumber(args.A), 100)) / 100;
            const modeMap = {
                "normal": 0,
                "add": 1,
                "subtract": 2,
                "stamp": 3,
                "soft": 4
            };
            const mode = modeMap[Scratch.Cast.toString(args.MODE)] || 0;

            data._lights.set(lightId, {
                x: Scratch.Cast.toNumber(args.X),
                y: Scratch.Cast.toNumber(args.Y),
                color: [colorVec[0], colorVec[1], colorVec[2], alpha],
                range: Math.max(Scratch.Cast.toNumber(args.R), 1),
                intensity: Scratch.Cast.toNumber(args.INT),
                mode: mode
            });
            this._syncLightsData(data);
            renderer.dirty = true;
        }

        splooksRemovePointLight(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            data._lights.delete(Scratch.Cast.toString(args.ID));
            this._syncLightsData(data);
            renderer.dirty = true;
        }

        splooksClearAllLights(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            data._lights = new Map();
            this._syncLightsData(data);
            renderer.dirty = true;
        }

        _syncLightsData(data) {
            const lights = data._lights || new Map();
            const maxLights = 8;
            const count = Math.min(lights.size, maxLights);

            const positions = new Float32Array(maxLights * 2);
            const colors = new Float32Array(maxLights * 4);
            const rangesX = new Float32Array(maxLights);
            const rangesY = new Float32Array(maxLights);
            const intensities = new Float32Array(maxLights);
            const modes = new Int32Array(maxLights);

            let i = 0;
            for (const [id, light] of lights) {
                if (i >= maxLights) break;
                positions[i * 2] = 0.5 + light.x / 360;
                positions[i * 2 + 1] = 0.5 - light.y / 360;
                colors.set(light.color, i * 4);
                rangesX[i] = light.range / 360;
                rangesY[i] = light.range / 360;
                intensities[i] = light.intensity;
                modes[i] = light.mode;
                i++;
            }

            data.u_numLightsSP = count;
            data.u_lightPositionsSP = positions;
            data.u_lightColorsSP = colors;
            data.u_lightRangesXSP = rangesX;
            data.u_lightRangesYSP = rangesY;
            data.u_lightIntensitiesSP = intensities;
            data.u_lightModesSP = modes;
        }

        // ========== 亮度转透明度 ==========
        splooksSetBrightnessToAlpha(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            data.u_brightnessToAlphaSP = 1;
            data.u_brightnessToAlphaStrengthSP = Math.max(0, Math.min(100, Scratch.Cast.toNumber(args.STR))) / 100;
            renderer.dirty = true;
        }

        splooksResetBrightnessToAlpha(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            this._getSplooksData(drawableID).u_brightnessToAlphaSP = 0;
            renderer.dirty = true;
        }

        // ========== 圆形蒙版 ==========
        splooksSetCircleMask(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            data.u_circleMaskEnabledSP = 1;
            data.u_circleMaskCenterSP = [Scratch.Cast.toNumber(args.CX), Scratch.Cast.toNumber(args.CY)];
            data.u_circleMaskSizeSP = [Math.max(0.01, Scratch.Cast.toNumber(args.W)), Math.max(0.01, Scratch.Cast.toNumber(args.H))];
            data.u_circleMaskFeatherSP = Math.max(0, Math.min(0.5, Scratch.Cast.toNumber(args.F)));
            renderer.dirty = true;
        }

        splooksResetCircleMask(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            this._getSplooksData(drawableID).u_circleMaskEnabledSP = 0;
            renderer.dirty = true;
        }

        // ========== 光线扫描 ==========
        splooksSetLightBeam(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            this._getSplooksData(drawableID);
            const data = this._getSplooksData(drawableID);
            const colorVec = this._hex2Vec4(args.C || "#FFFFFF");
            const intensity = Math.max(0, Math.min(1, Scratch.Cast.toNumber(args.I || 0.5)));
            const modeMap = {
                "normal": 0,
                "add": 1,
                "subtract": 2,
                "stamp": 3,
                "soft": 4
            };
            const mode = modeMap[Scratch.Cast.toString(args.M || "normal")] || 0;

            data.u_lightBeamEnabledSP = 1;
            data.u_lightBeamOriginSP = [Scratch.Cast.toNumber(args.X || 0.5), Scratch.Cast.toNumber(args.Y || 0.5)];
            data.u_lightBeamParamsSP = [
                Math.max(0.01, Scratch.Cast.toNumber(args.W || 0.1)),
                Scratch.Cast.toNumber(args.A || 0) * Math.PI / 180,
                Math.max(0.01, Scratch.Cast.toNumber(args.L || 0.5)),
                Math.max(0.1, Math.min(2, Scratch.Cast.toNumber(args.F || 1.0)))
            ];
            data.u_lightBeamColorSP = [colorVec[0], colorVec[1], colorVec[2], intensity];
            data.u_lightBeamModeSP = mode;
            renderer.dirty = true;
        }

        splooksResetLightBeam(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            this._getSplooksData(drawableID).u_lightBeamEnabledSP = 0;
            renderer.dirty = true;
        }
        // ========== 亮度 ==========
        splooksSetBrightness(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            this._getSplooksData(drawableID).u_brightnessSP = Math.max(0, Math.min(2, 1 + Scratch.Cast.toNumber(args.VALUE) / 100));
            renderer.dirty = true;
        }

        splooksGetBrightness(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return 0;
            const val = this._getSplooksData(drawableID).u_brightnessSP;
            return (val ?? 1) * 100 - 100;
        }

        // ========== 辅助方法 ==========
        _hex2Vec4(hex) {
            hex = hex.startsWith("#") ? hex.slice(1) : hex;
            let a = 255;
            if (hex.length === 8) a = parseInt(hex.slice(6, 8), 16);
            return [
                parseInt(hex.slice(0, 2), 16) / 255,
                parseInt(hex.slice(2, 4), 16) / 255,
                parseInt(hex.slice(4, 6), 16) / 255,
                a / 255
            ];
        }

        _normalizeEffect(name, value) {
            if (name === "brightness") return Math.max(0, Math.min(2, 1 + value / 100));
            if (name === "posterize") return value;
            return value / 100;
        }

        _denormalizeEffect(name, value) {
            if (name === "brightness") return (value - 1) * 100;
            if (name === "posterize") return value;
            return value * 100;
        }

        _hsbToRgb(h, s, b) {
            h = ((h % 360) + 360) % 360;
            s = Math.max(0, Math.min(100, s)) / 100;
            b = Math.max(0, Math.min(100, b)) / 100;
            if (s === 0) return [b, b, b];
            const hi = Math.floor(h / 60);
            const f = h / 60 - hi;
            const p = b * (1 - s);
            const q = b * (1 - s * f);
            const t = b * (1 - s * (1 - f));
            switch (hi) {
                case 0:
                    return [b, t, p];
                case 1:
                    return [q, b, p];
                case 2:
                    return [p, b, t];
                case 3:
                    return [p, q, b];
                case 4:
                    return [t, p, b];
                default:
                    return [b, p, q];
            }
        }

        _hsbToHex(h, s, b) {
            const key = `${Math.round(h*100)}|${Math.round(s*100)}|${Math.round(b*100)}`;
            if (this.hsbCache.has(key)) return this.hsbCache.get(key);
            const [r, g, bl] = this._hsbToRgb(h, s, b);
            const hex = `#${Math.round(r*255).toString(16).padStart(2,'0')}${Math.round(g*255).toString(16).padStart(2,'0')}${Math.round(bl*255).toString(16).padStart(2,'0')}`;
            if (this.hsbCache.size >= this.hsbCacheSize) {
                this.hsbCache.delete(this.hsbCache.keys().next().value);
            }
            this.hsbCache.set(key, hex);
            return hex;
        }
        // ========== 波浪扭曲 ==========
        splooksWaveEnable(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            data.u_waveEnabledSP = 1;
            data.u_waveXAmplitudeSP = Scratch.Cast.toNumber(args.XAMP || 10);
            data.u_waveXFrequencySP = Scratch.Cast.toNumber(args.XFREQ || 2);
            data.u_waveXTimeSP = Scratch.Cast.toNumber(args.XTIME || 0);
            data.u_waveYAmplitudeSP = Scratch.Cast.toNumber(args.YAMP || 10);
            data.u_waveYFrequencySP = Scratch.Cast.toNumber(args.YFREQ || 2);
            data.u_waveYTimeSP = Scratch.Cast.toNumber(args.YTIME || 0);
            data.u_waveScaleXSP = Math.max(1, Scratch.Cast.toNumber(args.WSCALE || 1));
            data.u_waveScaleYSP = Math.max(1, Scratch.Cast.toNumber(args.HSCALE || 1));
            renderer.dirty = true;
        }

        splooksWaveDisable(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            this._getSplooksData(drawableID).u_waveEnabledSP = 0;
            renderer.dirty = true;
        }

        // 九宫格 - 保留 scale（因为目标宽高需要扩大包围盒）
        splooksNineSliceEnable(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            const drawable = renderer._allDrawables[drawableID];
            if (!drawable) return;
            let target = null;
            const targets = runtime.targets;
            for (let i = 0; i < targets.length; i++) {
                if (targets[i].drawableID === drawableID) {
                    target = targets[i];
                    break;
                }
            }
            const originalSize = target ? target.size : 100;
            drawable.updateScale([originalSize, originalSize]);
            const targetW = Scratch.Cast.toNumber(args.TW || 100);
            const targetH = Scratch.Cast.toNumber(args.TH || 100);
            const baseScale = 100;
            const actualW = originalSize * (targetW / baseScale);
            const actualH = originalSize * (targetH / baseScale);

            drawable.updateScale([actualW, actualH]);

            data.u_nineSliceEnabledSP = 1;
            data.u_nineSliceLeftSP = Scratch.Cast.toNumber(args.L || 20);
            data.u_nineSliceRightSP = Scratch.Cast.toNumber(args.R || 20);
            data.u_nineSliceTopSP = Scratch.Cast.toNumber(args.T || 20);
            data.u_nineSliceBottomSP = Scratch.Cast.toNumber(args.B || 20);
            data.u_nineSliceTargetWidthSP = actualW;
            data.u_nineSliceTargetHeightSP = actualH;
            data.u_nineSliceBaseSP = originalSize;
            renderer.dirty = true;
        }
        splooksNineSliceDisable(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);
            data.u_nineSliceEnabledSP = 0;

            const drawable = renderer._allDrawables[drawableID];
            let target = null;
            const targets = runtime.targets;
            for (let i = 0; i < targets.length; i++) {
                if (targets[i].drawableID === drawableID) {
                    target = targets[i];
                    break;
                }
            }
            if (drawable && target) {
                drawable.updateScale([target.size, target.size]);
            }
            renderer.dirty = true;
        }
        splooksWarpDisable(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);

            // 重置扭曲
            data.u_warpSP = [0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5];

            // 恢复宽高为角色大小
            let target = null;
            const targets = runtime.targets;
            for (let i = 0; i < targets.length; i++) {
                if (targets[i].drawableID === drawableID) {
                    target = targets[i];
                    break;
                }
            }
            const drawable = renderer._allDrawables[drawableID];
            if (drawable && target) {
                drawable.updateScale([target.size, target.size]);
            }

            renderer.dirty = true;
        }
        // ============================================================
        // ===== 屏幕轨道方法 =====
        // ============================================================

        applyScreenEffectToTrack(args) {
            const shaderName = args.EFFECT;
            const trackNum = Scratch.Cast.toNumber(args.TRACK);

            if (!shaderfile.shaders[shaderName]) {
                console.warn("着色器不存在:", shaderName);
                return;
            }

            if (!this.stageShaderTracks) this.stageShaderTracks = {};
            this.stageShaderTracks[trackNum] = shaderName;

            this._rebuildStageListFromTracks();
            renderer.dirty = true;
        }

        removeScreenTrack(args) {
            const trackNum = Scratch.Cast.toNumber(args.TRACK);
            if (this.stageShaderTracks) {
                delete this.stageShaderTracks[trackNum];
            }
            if (Object.keys(this.stageShaderTracks).length === 0) {
                renderShadersList = [];
                currentShader = null;
                currentFrameBuffer = null;
            } else {
                this._rebuildStageListFromTracks();
            }
            renderer.dirty = true;
        }

        clearAllScreenTracks() {
            this.stageShaderTracks = {};
            renderShadersList = [];
            currentShader = null;
            currentFrameBuffer = null;
            renderer.dirty = true;
        }

        _rebuildStageListFromTracks() {
            if (!this.stageShaderTracks || Object.keys(this.stageShaderTracks).length === 0) {
                renderShadersList = [];
                currentShader = null;
                currentFrameBuffer = null;
                renderer.dirty = true;
                return;
            }

            const sortedTracks = Object.keys(this.stageShaderTracks)
                .map(Number)
                .sort((a, b) => a - b);

            const shaderList = sortedTracks.map(t => this.stageShaderTracks[t]);

            renderShadersList = shaderList;
            currentShader = shaderList[0];
            currentFrameBuffer = stageBuffer;
            renderer.dirty = true;
        }

        getScreenTracks() {
            if (!this.stageShaderTracks || Object.keys(this.stageShaderTracks).length === 0) {
                return "{}";
            }
            return JSON.stringify(this.stageShaderTracks);
        }

        getScreenTrackCount() {
            if (!this.stageShaderTracks) return 0;
            return Object.keys(this.stageShaderTracks).length;
        }

        // ============================================================
        // ===== 色散 =====
        // ============================================================
        setChromaticOffset(args) {
            const shaderName = "____SCREEN_CHROMATIC____";
            this._setUniform(shaderName, 'u_redOffsetX', Scratch.Cast.toNumber(args.X1));
            this._setUniform(shaderName, 'u_redOffsetY', Scratch.Cast.toNumber(args.Y1));
            this._setUniform(shaderName, 'u_greenOffsetX', Scratch.Cast.toNumber(args.X2));
            this._setUniform(shaderName, 'u_greenOffsetY', Scratch.Cast.toNumber(args.Y2));
            this._setUniform(shaderName, 'u_blueOffsetX', Scratch.Cast.toNumber(args.X3));
            this._setUniform(shaderName, 'u_blueOffsetY', Scratch.Cast.toNumber(args.Y3));
            renderer.dirty = true;
        }

        // ============================================================
        // ===== 故障 =====
        // ============================================================
        setGlitchParams(args) {
            const shaderName = "____SCREEN_GLITCH____";
            this._setUniform(shaderName, 'u_intensityX', Scratch.Cast.toNumber(args.XI));
            this._setUniform(shaderName, 'u_intensityY', Scratch.Cast.toNumber(args.YI));
            this._setUniform(shaderName, 'u_blockSize', Scratch.Cast.toNumber(args.SZ));
            this._setUniform(shaderName, 'u_speed', Scratch.Cast.toNumber(args.SPD) || 1);
            renderer.dirty = true;
        }

        // ============================================================
        // ===== 分割线 =====
        // ============================================================
        setSplitLineParams(args) {
            const shaderName = "____SCREEN_SPLIT____";
            const aspect = Scratch.Cast.toNumber(args.ASPECT) || 1.778;
            this._setUniform(shaderName, 'u_stageAspect', aspect);
            this._setUniform(shaderName, 'u_center', [
                Scratch.Cast.toNumber(args.CX),
                Scratch.Cast.toNumber(args.CY),
                Scratch.Cast.toNumber(args.ANG)
            ]);
            this._setUniform(shaderName, 'u_cut', [
                Scratch.Cast.toNumber(args.L),
                Scratch.Cast.toNumber(args.R)
            ]);
            renderer.dirty = true;
        }

        // ============================================================
        // ===== 水 =====
        // ============================================================
        setWaterParams(args) {
            const shaderName = "____SCREEN_WATER____";
            this._setUniform(shaderName, 'u_waterY', Scratch.Cast.toNumber(args.Y));
            this._setUniform(shaderName, 'u_alpha', Scratch.Cast.toNumber(args.A));
            this._setUniform(shaderName, 'u_rippleAmp', Scratch.Cast.toNumber(args.AMP));
            this._setUniform(shaderName, 'u_rippleDensity', Scratch.Cast.toNumber(args.DEN));
            this._setUniform(shaderName, 'u_rippleSpeed', Scratch.Cast.toNumber(args.SPD));
            this._setUniform(shaderName, 'u_blur', Scratch.Cast.toNumber(args.BLUR));
            this._setUniform(shaderName, 'u_densityDecay', Scratch.Cast.toNumber(args.DECAY));
            this._setUniform(shaderName, 'u_mode', Scratch.Cast.toNumber(args.MODE));
            renderer.dirty = true;
        }

        // ============================================================
        // ===== 镜头冲击 =====
        // ============================================================
        setLensBoomParams(args) {
            const shaderName = "____SCREEN_LENS____";
            const aspect = Scratch.Cast.toNumber(args.ASPECT) || 1.778;
            this._setUniform(shaderName, 'u_stageAspect', aspect);
            this._setUniform(shaderName, 'u_strength', Scratch.Cast.toNumber(args.STR));
            renderer.dirty = true;
        }

        // ============================================================
        // ===== 天使光 =====
        // ============================================================
        setAngelLightParams(args) {
            const shaderName = "____SCREEN_ANGEL____";
            this._setUniform(shaderName, 'u_center', [
                Scratch.Cast.toNumber(args.CX),
                Scratch.Cast.toNumber(args.CY)
            ]);
            this._setUniform(shaderName, 'u_intensity', Scratch.Cast.toNumber(args.INT));
            this._setUniform(shaderName, 'u_falloff', Scratch.Cast.toNumber(args.FAL));
            this._setUniform(shaderName, 'u_alpha', Scratch.Cast.toNumber(args.A));
            renderer.dirty = true;
        }

        // ============================================================
        // ===== 画面变换 =====
        // ============================================================
        setTransformParams(args) {
            const shaderName = "____SCREEN_TRANSFORM____";
            const aspect = Scratch.Cast.toNumber(args.ASPECT) || 1.778;
            this._setUniform(shaderName, 'u_stageAspect', aspect);
            this._setUniform(shaderName, 'u_offsetX', Scratch.Cast.toNumber(args.OX));
            this._setUniform(shaderName, 'u_offsetY', Scratch.Cast.toNumber(args.OY));
            this._setUniform(shaderName, 'u_angle', Scratch.Cast.toNumber(args.ANG));
            this._setUniform(shaderName, 'u_scale', Scratch.Cast.toNumber(args.SCALE));
            this._setUniform(shaderName, 'u_saturation', Scratch.Cast.toNumber(args.SAT) || 1);
            this._setUniform(shaderName, 'u_brightness', Scratch.Cast.toNumber(args.BRI) || 1);
            this._setUniform(shaderName, 'u_contrast', Scratch.Cast.toNumber(args.CON) || 1);
            this._setUniform(shaderName, 'u_hue', Scratch.Cast.toNumber(args.HUE) || 0);
            renderer.dirty = true;
        }

        // ============================================================
        // ===== 3D平面 =====
        // ============================================================
        set3DPlaneParams(args) {
            const shaderName = "____SCREEN_3DPLANE____";
            const aspect = Scratch.Cast.toNumber(args.ASPECT) || 1.778;
            this._setUniform(shaderName, 'u_stageAspect', aspect);
            this._setUniform(shaderName, 'u_rot', [
                Scratch.Cast.toNumber(args.RX),
                Scratch.Cast.toNumber(args.RY),
                Scratch.Cast.toNumber(args.RZ)
            ]);
            this._setUniform(shaderName, 'u_pos', [
                Scratch.Cast.toNumber(args.PX),
                Scratch.Cast.toNumber(args.PY)
            ]);
            this._setUniform(shaderName, 'u_scale', Scratch.Cast.toNumber(args.SCALE));
            this._setUniform(shaderName, 'u_bgBrightness', Scratch.Cast.toNumber(args.BRI));
            renderer.dirty = true;
        }

        // ============================================================
        // ===== 方框2 =====
        // ============================================================
        setCropBoxParams(args) {
            const shaderName = "____SCREEN_CROP____";
            const aspect = Scratch.Cast.toNumber(args.ASPECT) || 1.778;
            this._setUniform(shaderName, 'u_stageAspect', aspect);
            this._setUniform(shaderName, 'u_cropPos', [
                Scratch.Cast.toNumber(args.CX),
                Scratch.Cast.toNumber(args.CY)
            ]);
            this._setUniform(shaderName, 'u_cropW', Scratch.Cast.toNumber(args.W));
            this._setUniform(shaderName, 'u_cropH', Scratch.Cast.toNumber(args.H));
            this._setUniform(shaderName, 'u_borderSize', Scratch.Cast.toNumber(args.SZ));
            this._setUniform(shaderName, 'u_bgBrightness', Scratch.Cast.toNumber(args.BRI));
            this._setUniform(shaderName, 'u_bgSaturation', Scratch.Cast.toNumber(args.SAT));
            this._setUniform(shaderName, 'u_bgBlur', Scratch.Cast.toNumber(args.BLUR));
            this._setUniform(shaderName, 'u_bgContrast', Scratch.Cast.toNumber(args.CON));
            renderer.dirty = true;
        }
        // ============================================================
        // ===== xy简单扭曲 =====
        // ============================================================
        setXYWaveParams(args) {
            const shaderName = "____SCREEN_XYWAVE____";
            const aspect = Scratch.Cast.toNumber(args.ASPECT) || 1.778;
            this._setUniform(shaderName, 'u_stageAspect', aspect);
            this._setUniform(shaderName, 'u_speed', [
                Scratch.Cast.toNumber(args.SX),
                Scratch.Cast.toNumber(args.SY)
            ]);
            this._setUniform(shaderName, 'u_amp', [
                Scratch.Cast.toNumber(args.AX),
                Scratch.Cast.toNumber(args.AY)
            ]);
            this._setUniform(shaderName, 'u_freq', [
                Scratch.Cast.toNumber(args.FX),
                Scratch.Cast.toNumber(args.FY)
            ]);
            renderer.dirty = true;
        }

        // ============================================================
        // ===== 水滴纹 =====
        // ============================================================
        setDropletParams(args) {
            const shaderName = "____SCREEN_DROPLET____";
            const aspect = Scratch.Cast.toNumber(args.ASPECT) || 1.778;
            this._setUniform(shaderName, 'u_stageAspect', aspect);
            this._setUniform(shaderName, 'u_count', Scratch.Cast.toNumber(args.COUNT));
            this._setUniform(shaderName, 'u_speed', Scratch.Cast.toNumber(args.SPEED));
            this._setUniform(shaderName, 'u_strength', Scratch.Cast.toNumber(args.STRENGTH));
            this._setUniform(shaderName, 'u_scale', Scratch.Cast.toNumber(args.SCALE));
            this._setUniform(shaderName, 'u_fade', Scratch.Cast.toNumber(args.FADE));
            renderer.dirty = true;
        }

        // ============================================================
        // ===== 3D正方体 =====
        // ============================================================
        setCubeParams(args) {
            const shaderName = "____SCREEN_CUBE____";
            const aspect = Scratch.Cast.toNumber(args.ASPECT) || 1.778;
            this._setUniform(shaderName, 'u_stageAspect', aspect);
            this._setUniform(shaderName, 'u_size', Scratch.Cast.toNumber(args.SIZE) || 0.8);
            this._setUniform(shaderName, 'u_rot', [
                Scratch.Cast.toNumber(args.RX),
                Scratch.Cast.toNumber(args.RY),
                Scratch.Cast.toNumber(args.RZ)
            ]);
            this._setUniform(shaderName, 'u_pos', [
                Scratch.Cast.toNumber(args.PX),
                Scratch.Cast.toNumber(args.PY)
            ]);
            this._setUniform(shaderName, 'u_cropPos', [
                Scratch.Cast.toNumber(args.CX),
                Scratch.Cast.toNumber(args.CY)
            ]);
            this._setUniform(shaderName, 'u_cropW', Scratch.Cast.toNumber(args.CW) || 0.8);
            this._setUniform(shaderName, 'u_bgAlpha', Scratch.Cast.toNumber(args.BG) || 1);
            renderer.dirty = true;
        }

        // ============================================================
        // ===== 电视机效果 =====
        // ============================================================
        setTVParams(args) {
            const shaderName = "____SCREEN_TV____";
            this._setUniform(shaderName, 'u_scanlineIntensity', Scratch.Cast.toNumber(args.SCAN) || 0.5);
            this._setUniform(shaderName, 'u_noiseIntensity', Scratch.Cast.toNumber(args.NOISE) || 0.3);
            this._setUniform(shaderName, 'u_chromaticStrength', Scratch.Cast.toNumber(args.CHROMA) || 0.3);
            this._setUniform(shaderName, 'u_vignetteStrength', Scratch.Cast.toNumber(args.VIGNETTE) || 0.5);
            renderer.dirty = true;
        }
        setWaterRippleParams(args) {
            const shaderName = "____SCREEN_WATER_RIPPLE____";
            const aspect = Scratch.Cast.toNumber(args.ASPECT) || 1.778;

            this._setUniform(shaderName, 'u_stageAspect', aspect);
            this._setUniform(shaderName, 'u_centerX', Scratch.Cast.toNumber(args.CX) || 0.5);
            this._setUniform(shaderName, 'u_centerY', Scratch.Cast.toNumber(args.CY) || 0.5);
            this._setUniform(shaderName, 'u_waveSpeed', Scratch.Cast.toNumber(args.SPEED) || 0.5);
            this._setUniform(shaderName, 'u_waveStrength', Scratch.Cast.toNumber(args.STRENGTH) || 0.5);
            this._setUniform(shaderName, 'u_waveDensity', Scratch.Cast.toNumber(args.DENSITY) || 0.5);
            this._setUniform(shaderName, 'u_decay', Scratch.Cast.toNumber(args.DECAY) || 0.5);
            renderer.dirty = true;
        }
        setWaterRealParams(args) {
            const shaderName = "____SCREEN_WATER_REAL____";
            const aspect = Scratch.Cast.toNumber(args.ASP) || 1.778;

            this._setUniform(shaderName, 'u_stageAspect', aspect);
            this._setUniform(shaderName, 'u_waterLevel', Scratch.Cast.toNumber(args.LV) || 0.5);

            this._setUniform(shaderName, 'u_waveHeight', Scratch.Cast.toNumber(args.WH) || 1.0);
            this._setUniform(shaderName, 'u_waveDensity', Scratch.Cast.toNumber(args.WD) || 3.0);
            this._setUniform(shaderName, 'u_waveSpeed', Scratch.Cast.toNumber(args.WS) || 1.0);

            this._setUniform(shaderName, 'u_rippleCount', Scratch.Cast.toNumber(args.RC) || 15.0);
            this._setUniform(shaderName, 'u_rippleSpeed', Scratch.Cast.toNumber(args.RS) || 0.5);
            this._setUniform(shaderName, 'u_rippleStrength', Scratch.Cast.toNumber(args.RST) || 0.5);
            this._setUniform(shaderName, 'u_rippleSize', Scratch.Cast.toNumber(args.RSZ) || 0.5);
            this._setUniform(shaderName, 'u_rippleLife', Scratch.Cast.toNumber(args.RL) || 2.0);
            this._setUniform(shaderName, 'u_rippleFrequency', Scratch.Cast.toNumber(args.RF) || 2.0);

            this._setUniform(shaderName, 'u_flakeDensity', Scratch.Cast.toNumber(args.FD) || 3.0);
            this._setUniform(shaderName, 'u_flakeBrightness', Scratch.Cast.toNumber(args.FB) || 0.5);
            this._setUniform(shaderName, 'u_flakeSpeed', Scratch.Cast.toNumber(args.FS) || 1.0);

            this._setUniform(shaderName, 'u_waterColorR', Scratch.Cast.toNumber(args.CR) || 0.2);
            this._setUniform(shaderName, 'u_waterColorG', Scratch.Cast.toNumber(args.CG) || 0.4);
            this._setUniform(shaderName, 'u_waterColorB', Scratch.Cast.toNumber(args.CB) || 0.8);
            this._setUniform(shaderName, 'u_waterColorStrength', Scratch.Cast.toNumber(args.CS) || 0.5);
            this._setUniform(shaderName, 'u_waterBrightness', Scratch.Cast.toNumber(args.BRI) || 0.8);

            renderer.dirty = true;
        }
        applyScreenEffectToTrack2(args) {
            const shaderName = args.EFFECT;
            const trackNum = Scratch.Cast.toNumber(args.TRACK);

            if (!shaderfile.shaders[shaderName]) {
                console.warn("着色器不存在:", shaderName);
                return;
            }

            if (!this.stageShaderTracks) this.stageShaderTracks = {};
            this.stageShaderTracks[trackNum] = shaderName;

            this._rebuildStageListFromTracks();
            renderer.dirty = true;
        }
        // ========== 置换贴图 ==========

        splooksDisplacement(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID || !renderer._allDrawables[drawableID]) return;

            const data = this._getSplooksData(drawableID);
            const url = Scratch.Cast.toString(args.TEXTURE);
            const xStrength = Scratch.Cast.toNumber(args.X) || 0;
            const yStrength = Scratch.Cast.toNumber(args.Y) || 0;
            const mode = Scratch.Cast.toNumber(args.MODE) || 0;
            const intensity = Scratch.Cast.toNumber(args.INTENSITY) || 100;

            // 保存参数
            data.u_displacementXSP = xStrength;
            data.u_displacementYSP = yStrength;
            data.u_displacementModeSP = mode > 0.5 ? 1 : 0;
            data.u_displacementIntensitySP = Math.max(0, intensity);

            // 如果 URL 为空，关闭效果
            if (!url || url === "") {
                data.u_displacementEnabledSP = 0;
                // 如果当前纹理不是默认纹理，删除它
                if (data.u_displacementTextureSP && data.u_displacementTextureSP !== this._defaultTexture) {
                    try {
                        gl.deleteTexture(data.u_displacementTextureSP);
                    } catch (e) {}
                }
                data.u_displacementTextureSP = this._defaultTexture;
                data._displacementURL = null;
                renderer.dirty = true;
                return;
            }

            // 检查缓存的 URL 是否变化
            if (data._displacementURL === url && data.u_displacementTextureSP && data.u_displacementTextureSP !== this._defaultTexture) {
                data.u_displacementEnabledSP = 1;
                renderer.dirty = true;
                return;
            }

            // URL 变了或纹理被重置了，重新加载
            data.u_displacementEnabledSP = 0;

            // 删除旧纹理（如果不是默认纹理）
            if (data.u_displacementTextureSP && data.u_displacementTextureSP !== this._defaultTexture) {
                try {
                    gl.deleteTexture(data.u_displacementTextureSP);
                } catch (e) {}
            }
            data.u_displacementTextureSP = this._defaultTexture;

            return new Promise((resolve) => {
                const texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                const image = new Image();
                image.crossOrigin = "Anonymous";
                image.onload = () => {
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

                    data.u_displacementTextureSP = texture;
                    data._displacementURL = url;
                    data.u_displacementEnabledSP = 1;
                    renderer.dirty = true;
                    resolve();
                };
                image.onerror = () => {
                    // 加载失败，恢复默认纹理
                    data.u_displacementTextureSP = this._defaultTexture;
                    data._displacementURL = null;
                    data.u_displacementEnabledSP = 0;
                    renderer.dirty = true;
                    resolve();
                };
                image.src = url;
            });
        }

        splooksDisplacementDisable(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);

            data.u_displacementEnabledSP = 0;
            if (data.u_displacementTextureSP && data.u_displacementTextureSP !== this._defaultTexture) {
                try {
                    gl.deleteTexture(data.u_displacementTextureSP);
                } catch (e) {}
            }
            data.u_displacementTextureSP = this._defaultTexture;
            data._displacementURL = null;
            renderer.dirty = true;
        }

        splooksDisplacementReset(args) {
            const drawableID = Scratch.Cast.toNumber(args.DRAWABLE);
            if (!drawableID) return;
            const data = this._getSplooksData(drawableID);

            data.u_displacementEnabledSP = 0;
            data.u_displacementXSP = 0;
            data.u_displacementYSP = 0;
            data.u_displacementIntensitySP = 100;
            data.u_displacementModeSP = 0;

            if (data.u_displacementTextureSP && data.u_displacementTextureSP !== this._defaultTexture) {
                try {
                    gl.deleteTexture(data.u_displacementTextureSP);
                } catch (e) {}
            }
            data.u_displacementTextureSP = this._defaultTexture;
            data._displacementURL = null;

            renderer.dirty = true;
        }
    }
    Scratch.extensions.register(new extension());
})(Scratch);