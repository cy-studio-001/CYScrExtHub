// Name: shader track
// ID: shadertrack
// Description: Shader Track允许在你的作品上使用着色器，新增了遮罩！+渲染顺序
// By: ObviousAlexC <https://scratch.mit.edu/users/pinksheep2917/>
// Extra version by: DustDot <https://space.bilibili.com/302475547>
// Revision by：YL_YOLO <https://space.bilibili.com/1444083784>
// License: MIT
// 日志:8.74 修复了遮罩打印延迟问题(小孩SJ改)
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
(function (Scratch) {
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
let penPlus;
if (Scratch.vm.runtime.ext_obviousalexc_penPlus) {
  penPlus = Scratch.vm.runtime.ext_obviousalexc_penPlus;
} else {
  penPlus = {
    extensionVersion: "9.9.9.Shaded",
    currentFilter: gl.NEAREST,
    shaders: {},
    programs: {},
    
    events: {
      shaderSaved: [],
      editorClosed: [],
    },
    
    prefixes: {
      penPlusTextures: "",
      renderTextures: "",
    },
    
    // 序列化/反序列化（项目保存/加载）
    _setupExtensionStorage() {
      if (Scratch.extensions.isPenguinMod) {
        penPlus.serialize = () => {
          return JSON.stringify({
            shaders: penPlus.shaders,
            version: penPlus.extensionVersion,
            prefixes: penPlus.prefixes,
            subShaders: parentExtension?.subShaders || {},
            subShaderUniforms: parentExtension?.subShaderUniforms || {}
          });
        };

        penPlus.deserialize = (serialized) => {
          let deserializedData = JSON.parse(serialized);
          this.programs = {};
          
          if (deserializedData.subShaders) {
            if (parentExtension) parentExtension.subShaders = deserializedData.subShaders;
          }
          if (deserializedData.subShaderUniforms) {
            if (parentExtension) parentExtension.subShaderUniforms = deserializedData.subShaderUniforms;
          }
          
          if (deserializedData.version) {
            penPlus.shaders = deserializedData.shaders;
            penPlus.prefixes = deserializedData.prefixes;
            
            Object.keys(penPlus.shaders).forEach(name => {
              if (parentExtension?.subShaders?.[name]) {
                penPlus.shaders[name].isSubShader = true;
              }
            });
          } else {
            penPlus.shaders = deserializedData || {};
          }
          penPlus._parseProjectShaders();
        };

        penPlus.getShaders = () => {
          return penPlus.shaders;
        };
      } else {
        // Turbowarp 存储
        this.programs = {};
        if (!runtime.extensionStorage["shadertrack"]) {
          runtime.extensionStorage["shadertrack"] = Object.create(null);
          runtime.extensionStorage["shadertrack"].shaders = Object.create(null);
          runtime.extensionStorage["shadertrack"].version = penPlus.extensionVersion;
          runtime.extensionStorage["shadertrack"].prefixes = penPlus.prefixes;
          runtime.extensionStorage["shadertrack"].subShaders = Object.create(null);
          runtime.extensionStorage["shadertrack"].subShaderUniforms = Object.create(null);
        }
        
        if (runtime.extensionStorage["shadertrack"].subShaders) {
          if (parentExtension) parentExtension.subShaders = runtime.extensionStorage["shadertrack"].subShaders;
        }
        if (runtime.extensionStorage["shadertrack"].subShaderUniforms) {
          if (parentExtension) parentExtension.subShaderUniforms = runtime.extensionStorage["shadertrack"].subShaderUniforms;
        }
        
        Object.keys(penPlus.shaders).forEach(name => {
          if (parentExtension?.subShaders?.[name]) {
            penPlus.shaders[name].isSubShader = true;
          }
        });

        penPlus.shaders = runtime.extensionStorage["shadertrack"].shaders;
        penPlus.prefixes = runtime.extensionStorage["shadertrack"].prefixes;

        penPlus.getShaders = () => {
          penPlus.shaders = runtime.extensionStorage["shadertrack"].shaders;
          return runtime.extensionStorage["shadertrack"].shaders;
        };
        
        penPlus._parseProjectShaders();
      }

      penPlus.savingData = {
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
      return Object.keys(this.shaders).length === 0
        ? []
        : Object.keys(this.shaders);
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
        const declaration = { type: "unknown", data: [], unitSize: 1 };
        const name = attribDat.name.replaceAll(/\[\d*\]/g, "");

        switch (attribDat.type) {
          case gl.FLOAT: declaration.type = "float"; break;
          case gl.FLOAT_VEC2: declaration.type = "vec2"; declaration.unitSize = 2; break;
          case gl.FLOAT_VEC3: declaration.type = "vec3"; declaration.unitSize = 3; break;
          case gl.FLOAT_VEC4: declaration.type = "vec4"; declaration.unitSize = 4; break;
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
        const declaration = { type: "unknown", isArray: false, arrayLength: 0, arrayData: [], unitSize: 1 };
        const name = uniformDef.name.replaceAll(/\[\d*\]/g, "");

        switch (uniformDef.type) {
          case gl.FLOAT: declaration.type = "float"; break;
          case gl.INT: declaration.type = "int"; break;
          case gl.FLOAT_VEC2: declaration.type = "vec2"; declaration.unitSize = 2; break;
          case gl.FLOAT_VEC3: declaration.type = "vec3"; declaration.unitSize = 3; break;
          case gl.FLOAT_VEC4: declaration.type = "vec4"; declaration.unitSize = 4; break;
          case gl.FLOAT_MAT2: declaration.type = "mat2"; declaration.unitSize = 4; break;
          case gl.FLOAT_MAT3: declaration.type = "mat3"; declaration.unitSize = 9; break;
          case gl.FLOAT_MAT4: declaration.type = "mat4"; declaration.unitSize = 16; break;
          case gl.SAMPLER_2D: declaration.type = "sampler2D"; break;
          case gl.SAMPLER_3D: declaration.type = "sampler3D"; break;
          case gl.SAMPLER_CUBE: declaration.type = "samplerCube"; break;
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
}
  let reRenderInfo = twgl.createBufferInfoFromArrays(gl, {
    a_position:    { numComponents: 4, data: [
      -1, -1, 0, 1,
      1, -1, 0, 1,
      1, 1, 0, 1,
      -1, -1, 0, 1,
      1, 1, 0, 1,
      -1, 1, 0, 1
    ]},
    a_texCoord: { numComponents: 2, data: [
      0,1,
      1,1,
      1,0,
      0,1,
      1,0,
      0,0
    ]},
    a_color: { numComponents: 4, data: [
      1,1,1,1,
      1,1,1,1,
      1,1,1,1,
      1,1,1,1,
      1,1,1,1,
      1,1,1,1
    ]}
  });
  const stageBufferAttachments = [
    {
      format: gl.RGBA,
      type: gl.UNSIGNED_BYTE,
      min: gl.LINEAR,
      wrap: gl.CLAMP_TO_EDGE,
      premultiplyAlpha: true,
    },
    { format: gl.DEPTH_STENCIL },
  ];
  const stageBuffer = [
    twgl.createFramebufferInfo(gl, stageBufferAttachments),
    twgl.createFramebufferInfo(gl, stageBufferAttachments)
  ];
let oldDraw = renderer.draw;
let oldDrawThese = renderer._drawThese;
let currentFrameBuffer = null, currentShader = null, parentExtension = null;
let shouldBeDirty = false, multiRender = false, performanceMode = false, applyScratchEffects = true;
let spriteDirection = null, spriteShaders = {}, recompiledShaders = {}, skins = {}, textures = {};
let renderShadersList = [], renderSpriteShadersList = {};

let bufferInfo = {}, uniformOverrides = {}, modificationTarget = null;
let customDrawOrder = null;
let syncIndex = 0;
let customDrawOrderEnabled = false;
let layerZMap = {};
let shaderTextureBindings = {};
const BlendModes = {
    "default": [gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD],
    "default behind": [gl.ONE_MINUS_DST_ALPHA, gl.ONE, gl.ONE_MINUS_DST_ALPHA, gl.ONE, gl.FUNC_ADD],
    "additive": [gl.ONE, gl.ONE, gl.ZERO, gl.ONE, gl.FUNC_ADD],
    "additive with alpha": [gl.ONE, gl.ONE, gl.ONE, gl.ONE, gl.FUNC_ADD],
    "subtract": [gl.ONE, gl.ONE, gl.ZERO, gl.ONE, gl.FUNC_REVERSE_SUBTRACT],
    "subtract with alpha": [gl.ONE, gl.ONE, gl.ONE, gl.ONE, gl.FUNC_REVERSE_SUBTRACT],
    "multiply": [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD],
    "invert": [gl.ONE_MINUS_DST_COLOR, gl.ONE_MINUS_SRC_COLOR, gl.ZERO, gl.ONE, gl.FUNC_ADD],
    "mask": [gl.ZERO, gl.SRC_ALPHA, gl.ZERO, gl.SRC_ALPHA, gl.FUNC_ADD],
    "erase": [gl.ZERO, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE_MINUS_SRC_ALPHA, gl.FUNC_ADD],
    "subtractive": [gl.ONE, gl.ONE, gl.ZERO, gl.ONE, gl.FUNC_REVERSE_SUBTRACT],
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
    if (penPlus && shader != "____PEN_PLUS__NO__SHADER____") {
      console.log(`Shaded : converting shader ${shader} to sprite format!`);
      const event = penPlus.shaders[shader].projectData;
      let convertedVertex = event.vertShader;
      let convertedFragment = event.fragShader;
      
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
      convertedVertex = convertedVertex.replaceAll(GL_POS_FINDER,"gl_Position = u_projectionMatrix * u_modelMatrix * vec4(a_position,0,1);");
      convertedVertex = convertedVertex.replaceAll(GL_POS_VAR,"vec2 a_position;");
      if (convertedVertex.includes("#version 300 es")) {
        convertedVertex = "#version 300 es\nuniform highp mat4 u_projectionMatrix; uniform highp mat4 u_modelMatrix;\n" + convertedVertex.replace("#version 300 es", "");
      } else {
        convertedVertex = "uniform highp mat4 u_projectionMatrix; uniform highp mat4 u_modelMatrix;\n" + convertedVertex;
      }
      
      // ========== 原有片元着色器修改 ==========
      convertedFragment = convertedFragment.replaceAll("v_texCoord","scratch3_uv_replacement");
      convertedFragment = convertedFragment.replace(/varying[^;]*?vec2 scratch3_uv_replacement;/g,"varying highp vec2 v_texCoord;");
      convertedFragment = convertedFragment.replace(/in[^;]*?vec2 scratch3_uv_replacement;/g,"in highp vec2 v_texCoord;");
      convertedFragment = convertedFragment.replace(/uniform[^;]*?vec2 u_skinSize;/g,"");
      convertedFragment = convertedFragment.replace(/^(\s*)(\bgl_FragColor\b.*?;)/gm, `$&\n$1${"gl_FragColor = scratch3_apply_color_Effects(gl_FragColor);"}`);
      convertedFragment = convertedFragment.replace(/^(\s*)(\bfragColor\b.*?;)/gm, `$&\n$1${"fragColor = scratch3_apply_color_Effects(fragColor);"}`);
      if (convertedFragment.includes("v_texCoord")) convertedFragment = convertedFragment.replace(/void main\(\)\s*\{/,'$&\n  scratch3_uv_replacement = scratch3_apply_UV_Effects(v_texCoord);\n');
      if (convertedFragment.includes("#version 300 es")) {
        convertedFragment = "#version 300 es\n" + scratchEffectsShaderPrefix + convertedFragment.replace("#version 300 es", "");
      } else {
        convertedFragment = scratchEffectsShaderPrefix + convertedFragment;
      }
      
      if (recompiledShaders[shader] && recompiledShaders[shader].program) gl.deleteProgram(recompiledShaders[shader].program);
      recompiledShaders[shader] = twgl.createProgramInfo(gl,[
        convertedVertex,
        applyScratchEffects ? convertedFragment : event.fragShader
      ]);
      console.log(recompiledShaders[shader]);
    }
  }

  class extension {
  
advDrawThese(drawables, drawMode, projection, opts = {}) {
    const gl = renderer._gl;
    let currentShader = null;
    const nativeSize = renderer.getNativeSize();
    const scratchUnitWidth = nativeSize[0], scratchUnitHeight = nativeSize[1];
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
        const newShader = (drawableShaderName && penPlus.shaders[drawableShaderName] && recompiledShaders[drawableShaderName]) ? 
            recompiledShaders[drawableShaderName] : renderer._shaderManager.getShader(drawMode, effectBits);
        
        if (renderer._regionId !== newShader) {
            renderer._doExitDrawRegion();
            renderer._regionId = newShader;
            currentShader = newShader;
            gl.useProgram(currentShader.program);
            twgl.setBuffersAndAttributes(gl, currentShader, renderer._bufferInfo);
            Object.assign(uniforms, { u_projectionMatrix: projection });
        }
        Object.assign(uniforms, drawable.skin.getUniforms(drawableScale), drawable.getUniforms());
        if (opts.extraUniforms) Object.assign(uniforms, opts.extraUniforms);
        
if (drawableShaderName && penPlus.shaders[drawableShaderName]) {
    const shaderInfo = penPlus.shaders[drawableShaderName];
    let uniformsToUse;
    if (shaderInfo.isSubShader) {
        uniformsToUse = parentExtension.subShaderUniforms?.[drawableShaderName] || {};
    } else {
        const instanceKey = opts.instanceKey || (renderSpriteShadersList[drawableID] ? `sprite-${drawableID}-${renderSpriteShadersList[drawableID].length - 1}` : `sprite-${drawableID}`);
        uniformsToUse = { ...(uniformOverrides[instanceKey] || penPlus.programs[drawableShaderName].uniformDat) };
    }
    uniformsToUse.u_res = [gl.canvas.width, gl.canvas.height];
    uniformsToUse.u_timer = runtime.ioDevices.clock.projectTimer();
    uniformsToUse.u_transform = [1,1,0,0, 0,1,0,0, 0,0,0,0, 0,0,0,0];
    uniformsToUse.u_skin = textures[drawableID] || drawable.skin.getTexture(drawableScale);
    uniformsToUse.u_skinSize = [drawable._skinScale[0], drawable._skinScale[1]];
    uniformsToUse.u_position = [drawable._position[0], drawable._position[1]];
    uniformsToUse.u_direction = 90 - (spriteDirection || drawable._direction);
    uniformsToUse.u_rotationAdjusted = [drawable._rotationAdjusted[0], drawable._rotationAdjusted[1]];
    
    // ========== 纹理绑定自动上传 ==========
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
            twgl.setTextureParameters(gl, uniforms.u_skin, { minMag: drawable.skin.useNearest(drawableScale, drawable) ? gl.NEAREST : gl.LINEAR });
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
            let x = ((clipbox.x_min / scratchUnitWidth + 0.5) * fbWidth) | 0, y, w, h;
            if (isPenBufferActive) {
                y = ((-clipbox.y_max / scratchUnitHeight + 0.5) * fbHeight) | 0;
                const x2 = ((clipbox.x_max / scratchUnitWidth + 0.5) * fbWidth) | 0;
                const y2 = ((-clipbox.y_min / scratchUnitHeight + 0.5) * fbHeight) | 0;
                w = x2 - x; h = y2 - y;
            } else {
                y = ((clipbox.y_min / scratchUnitHeight + 0.5) * fbHeight) | 0;
                const x2 = ((clipbox.x_max / scratchUnitWidth + 0.5) * fbWidth) | 0;
                const y2 = ((clipbox.y_max / scratchUnitHeight + 0.5) * fbHeight) | 0;
                w = x2 - x; h = y2 - y;
            }
            gl.scissor(x, y, w, h);
        } else { gl.disable(gl.SCISSOR_TEST); }
        
        // ========== 模板测试已禁用 ==========
        gl.disable(gl.STENCIL_TEST);
        
        twgl.setUniforms(currentShader, uniforms);
        twgl.drawBufferInfo(gl, renderer._bufferInfo, gl.TRIANGLES);
        gl.enable(gl.BLEND);
    }
    gl.disable(gl.SCISSOR_TEST);
    gl.disable(gl.STENCIL_TEST);
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
                    
                    renderer._drawThese([drawableID], 'default', renderer._projection,
                        {
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
                gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
                spriteShaders[drawableID] = renderSpriteShadersList[drawableID][ii];
                if (ii !== 0) textures[drawableID] = bufferInfo[drawableID][(ii + 1) % 2].attachments[0];
                renderer._drawThese([drawableID], 'default', projection, { framebufferWidth: gl.canvas.width, framebufferHeight: gl.canvas.width, instanceKey: `sprite-${drawableID}-${ii}` });
                textures[drawableID] = bufferInfo[drawableID][ii % 2].attachments[0];
                drawable.updateDirection(spriteDirection); spriteDirection = null;
            }
            twgl.bindFramebufferInfo(gl, null);
            spriteShaders[drawableID] = renderSpriteShadersList[drawableID][renderSpriteShadersList[drawableID].length - 1];
        }
    }
    
    if (currentFrameBuffer) {
        twgl.resizeFramebufferInfo(gl, currentFrameBuffer[0], stageBufferAttachments, Scratch.Cast.toNumber(gl.canvas.width), Scratch.Cast.toNumber(gl.canvas.height));
        twgl.bindFramebufferInfo(gl, currentFrameBuffer[0]);
    } else { twgl.bindFramebufferInfo(gl, null); }
    
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
            gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
            gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
            currentShader = renderShadersList[ii];
            gl.useProgram(penPlus.programs[currentShader].info.program);
            twgl.setBuffersAndAttributes(gl, penPlus.programs[currentShader].info, reRenderInfo);
            const uniformsToUse = { ...(uniformOverrides[`stage-${ii}`] || penPlus.programs[currentShader].uniformDat) };
            uniformsToUse.u_skin = currentFrameBuffer[ii % 2].attachments[0];
            uniformsToUse.u_skinSize = [runtime.stageWidth, runtime.stageHeight];
            uniformsToUse.u_position = [0,0]; uniformsToUse.u_direction = 0; uniformsToUse.u_rotationAdjusted = [0,0];
            uniformsToUse.u_res = [gl.canvas.width, gl.canvas.height];
            uniformsToUse.u_timer = runtime.ioDevices.clock.projectTimer();
            uniformsToUse.u_transform = [1,1,0,0, 0,1,0,0, 0,0,0,0, 0,0,0,0];
            twgl.setUniforms(penPlus.programs[currentShader].info, uniformsToUse);
            twgl.drawBufferInfo(gl, reRenderInfo);
        }
        currentShader = renderShadersList[renderShadersList.length - 1];
    }
    
    if (currentFrameBuffer) {
        if (!penPlus.programs[currentShader]) { parentExtension.resetBuffer(); renderer.dirty = true; return; }
        gl.disable(gl.BLEND);
        twgl.bindFramebufferInfo(gl, null);
        gl.useProgram(penPlus.programs[currentShader].info.program);
        twgl.setBuffersAndAttributes(gl, penPlus.programs[currentShader].info, reRenderInfo);
        const instanceKey = multiRender ? `stage-${renderShadersList.length - 1}` : 'stage-0';
        const uniformsToUse = { ...(uniformOverrides[instanceKey] || penPlus.programs[currentShader].uniformDat) };
        uniformsToUse.u_skin = multiRender ? currentFrameBuffer[(renderShadersList.length + 1) % 2].attachments[0] : currentFrameBuffer[0].attachments[0];
        uniformsToUse.u_skinSize = [runtime.stageWidth, runtime.stageHeight];
        uniformsToUse.u_position = [0,0]; uniformsToUse.u_direction = 0; uniformsToUse.u_rotationAdjusted = [0,0];
        uniformsToUse.u_res = [gl.canvas.width, gl.canvas.height];
        uniformsToUse.u_timer = runtime.ioDevices.clock.projectTimer();
        uniformsToUse.u_transform = [1,1,0,0, 0,1,0,0, 0,0,0,0, 0,0,0,0];
        twgl.setUniforms(penPlus.programs[currentShader].info, uniformsToUse);
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
    
    if (shouldBeDirty) { renderer.dirty = parentExtension.autoReRender; shouldBeDirty = false; }
parentExtension._checkOneBufferPerFrame();
}
    saveThingExists = false;
    addSaveListeners() {
      if (this.saveThingExists) return;
      if (penPlus) {
        console.log("Shaded : Adding Save Listener")
        this.saveThingExists = true;
        penPlus.addEventListener("shaderSaved", (event) => {
          compileShaderForSprite(event.name);
        });
      }
    }
    autoReRender = true;
constructor() {
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
    renderer.draw = this.customDrawFunction;
    renderer._drawThese = this.advDrawThese;
    this.stageBuffer = stageBuffer;
    runtime.ext_obviousalexc_shaded = this;
    this.autoReRender = true;
    this.saveThingExists = false;
    
    vm.runtime.on("EXTENSION_ADDED", () => {
        let penPlusExtension = Scratch.vm.runtime.ext_obviousalexc_penPlus;
        if (penPlusExtension && penPlus !== penPlusExtension) {
            console.log("Shaded : Pen+ detected! Starting to transform some addon to pen+ api.");
            penPlusExtension.shaders = penPlus.shaders;
            penPlusExtension.programs = penPlus.programs;
            penPlusExtension.events = penPlus.events;
            penPlus = penPlusExtension;
        }
        if (renderer.draw !== parentExtension.customDrawFunction) {
            setTimeout(() => {
                console.log("Shaded : Updating draw function.");
                oldDraw = renderer.draw;
                renderer.draw = parentExtension.customDrawFunction;
            }, 500);
        }
        if (renderer._drawThese !== parentExtension.advDrawThese) {
            setTimeout(() => {
                console.log("Shaded : Updating drawThese function.");
                oldDrawThese = renderer._drawThese;
                renderer._drawThese = parentExtension.advDrawThese;
            }, 500);
        }
    });
    
vm.runtime.on("targetWasRemoved", (clone) => {
    const cloneID = clone.drawableID;
    delete protectedDrawables[cloneID];
    delete clipBoxes[cloneID];
    delete textures[cloneID];
    delete spriteShaders[cloneID];
    delete renderSpriteShadersList[cloneID];
    delete layerZMap[cloneID];
    if (parentExtension.spriteShaderTracks) {
        delete parentExtension.spriteShaderTracks[cloneID];
    }
    //  图层被删除时，用原生 API 清理乒乓缓冲
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
    vm.runtime.on("PROJECT_LOADED", penPlus._setupExtensionStorage);
    penPlus._setupExtensionStorage();
    
    vm.runtime.on("PROJECT_LOADED", () => {
        setTimeout(() => {
            if (parentExtension.subShaders) {
                Object.keys(parentExtension.subShaders).forEach(subName => {
                    const mainShader = parentExtension.subShaders[subName].mainShader;
                    if (penPlus.programs[mainShader] && penPlus.shaders[subName]) {
                        penPlus.programs[subName] = {
                            info: penPlus.programs[mainShader].info,
                            uniformDat: penPlus.shaders[subName].uniformDat || {},
                            uniformDec: penPlus.programs[mainShader].uniformDec,
                            attribDat: penPlus.programs[mainShader].attribDat
                        };
                        if (parentExtension.subShaderUniforms[subName]) {
                            penPlus.programs[subName].uniformDat = parentExtension.subShaderUniforms[subName];
                        }
                    }
                });
            }
            Object.keys(penPlus.shaders).forEach(name => {
                compileShaderForSprite(name);
            });
        }, 500);
    });
    
    setTimeout(() => {
        if (penPlus) {
            Object.keys(penPlus.shaders).forEach(name => {
                compileShaderForSprite(name);
            });
        }
    }, 500);
    
    Scratch.vm.runtime.on("EXTENSION_ADDED", this.addSaveListeners);
    
    window.addEventListener("message", (event) => {
        let eventType = event.data.type;
        if (!eventType) return;
        switch (eventType) {
            case "EXTENSION_REQUEST":
                if (penPlus.IFrame) {
                    penPlus.IFrame.contentWindow.postMessage({
                        type: "ADD_EXTENSION",
                        URL: "https://pen-group.github.io/extensions/extensions/ShadedStamps/shaderEditorExtension.js"
                    }, penPlus.IFrame.src);
                }
                break;
            case "EDITOR_CLOSE":
                if (penPlus.IFrame && penPlus.IFrame.closeIframe) {
                    penPlus.IFrame.closeIframe();
                }
                penPlus.dispatchEvent("editorClosed");
                break;
            case "DATA_SEND":
                penPlus.openShaderManager("save");
                penPlus.savingData = {
                    projectData: event.data.projectData,
                    fragShader: event.data.fragShader,
                    vertShader: event.data.vertShader,
                };
                break;
            case "DATA_REQUEST":
                penPlus.openShaderManager("load");
                break;
            default:
                break;
        }
    });
    
    document.addEventListener('keyup', (event) => {
        if (event.key == "F4" && penPlus.IFrame && Array.from(document.body.children).includes(penPlus.IFrame)) {
            if (penPlus.IFrame.closeIframe) {
                penPlus.IFrame.closeIframe();
            }
            penPlus.dispatchEvent("editorClosed");
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
    
    setInterval(function() {
        if (autoEnabled) {
            const pixelRatio = window.devicePixelRatio || 1;
            renderer.resize(autoWidth / pixelRatio, autoHeight / pixelRatio);
        }
    }, 100);
}
getInfo() {
    return {
        id: "shadertrack",
        name: "Shaded Track",
        color1: "#531478",
        color2: "#7500BA",
        color3: "#BF54FF",
        blockIconURI: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAAJcEhZcwAAHtUAAB7VAXWAw4sAAAYmSURBVFiFxZh/bFNVFMc/9+29/qAthW0gP5whiiC/BAIIKCpBA2QBNCKJCWKixl8xRhMSAUFiFBCNRhPjD/QPRInxFxCZRlFwLgQUgoIbCiGCEMLoxuZga9et7evxj/ZtfW1fV5DhSZrm3fbd97nnnu895zyFg40d9Lw4/XapptIfDVAiqe/09f6GNcrpnl4H6wku9S0oYG/DWpV9X6+CWQ9JgQiaZIOlxwEl3eM1jSlQvbegLLN5KAcu5bVc6G5fKcj1Xl+EsZKw0SeBQ0onnBsVRcPpwCgxGUgSlYZLCBxQBkK3Ny3YnY3rVF4PtqEwVJLHjX9wl6TYBcUX+NkS9xM3C0PmizcNGC8JKlWEyZ4wGtAsOj+oPrg6dOLZXky7TDnFnh/htUAjt1SGIGgC0CoeVp6uoKY6gHQ6w1kPseB04GqSPKJamVZ2nuC8FnAJiIsn6q/l+B4XZouWtd0pTzrGYBTFN61BbmppxljmAr+bvgJLO+PUveejeUMHmKYDnF0MXoQnuMCEYBvBe1vgfgMG9iWsPJz7fADJYzFUS2cOnLW4vGYC3ykPU/cP5K66Bpi9CKhgEAY3P9OfbdUN6Ee+BWJAbrxZ1yWAD2FsaRtlM1vgQQ9UTOGMNp9N9KOpJQZnanHJPrui03NqToAAceClC2X8uckP7bXAeDyM41H/1QQfm4RZMqMgnAYMxmSJRPD5E/CsBkPHckJ7gI8Zzdd1QwgfHIbeFssLZ81V0GKi2LzrKmJvHAU5BMA1CpbPBUbMRMOVWqmkttVatQb0I8loSTBvQBP+EWEYPAb0RdTLYLYfhvZ3wfUL6OogGmK7NzWX9AwowI/Kzb4PA/DtJpA4GjArCBNfAXHf7pgZKsTkbncrvlFRWCWgl3OcMdQC7W+Cdwf4W7fY4LqFIj1vsWURFKsj5Zz6shki6wCTvsDSCeB56FaU5rWvHmEISUaTYPJ1/0BlJ1w/mfqSSr4S2BYC9zEItG5FV7/aY06kC9gaK8qaRGPNjgoSnxwDDgIw0YB7HobEoKfQ0NLqS231rGQnD/ibYXgnLBgCJVP5IDmSH87BuVVgnAVDHcja1m4w66QtGhDg76TO/vUB2PEpkEABdw6Ffi8GSJaM6IodL+BVScrmNMGSOJSOoYPbaAxDaBX4asB/vsouBhFbiFhWFKB1YzMaG6L9SHx2ElrXAyaTgPtugdi4xWhi4AGWSISb9TAEgVtnEFWzeEO81HeC7ycIXKjCUD/niCEfTI+AmeeREuG06Hy/axDsrgMOoYCF/eHGp8Gr3c590s4UPcLIu0Iw3aRNDWcj49hzFk69DUa8wwaXebTks4KA9syQmiiCYnvMT2yDglAVYFIOLLoDShfPZEafKKPmh2COCfOnE+UGtp2A+s0Q2AieSE1Gji4MVxAwU5GZ55sC6kTn5dqhsPswyI9owGwXLLofksMWw20aLJhGRM3nMDeSOA+Bt8AX3YFLavKKoWjAnHotKzOodK1WHfXy/bKBsG8n0IEbWDgerl8zDoJjSKiJ7GYCr5yG8B9gmA0YUmPLs8UUbjbAzDIpX2boCuZ0/XMk7IXVxyH0KmCCAmNGECqX8g0jeScELbvAtxLc8cMFxdAjYLcYxLYFTtUvQJXyUH2yHI7/BuzumlS0UtoYQeg78L0AvuguXOws2ms5gE5lUk4cin0M4PfzfnjOBaG9QBIT2A7siYLEwd1+FPclwgFoTmKwxvI3OpIRCkC7Bmf3AtUA1AkceB/6vA6GnLlkOADdknwxnVZ2gGtd5VCeorwd/M21uNl5iWhpwEI9qt1zGXCSuYj83epFJfpCgJnnWyE4eylUOD0Vc75dFGDhxtruuXxbnbLe6fv17HgrBOdUlvcSWwqwWDHkG1eCYwxeNsDuqqInMeQ21kX1DP8ZsAgx5BxBGXCXSwzOgBSOt1y44iuRywJ4MWLI/N+VMq2mca3qblqyqhbb+JWH29K0PvV2qycxOJXlAvyuDD46exVlT5ZC/620qipORANU/KWRejfx36zrmXMHrBAnMVypeMu0LU3rFWS8PLKnuysvBifLefaC8hXyf8SbZZbnLHN0zsLy5b2bIrIsG8yyfwFqWGB6l5ATtAAAAABJRU5ErkJggg==",
        blocks: [
            {
                blockType: Scratch.BlockType.BUTTON,
                text: "着色器教程",
                func: "openSite"
            },
            {
                blockType: Scratch.BlockType.LABEL,
                text: "基础"
            },
            {
                opcode: "setStageShader",
                blockType: Scratch.BlockType.COMMAND,
                text: "将 [shader] 运用于屏幕",
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
                blockType: Scratch.BlockType.COMMAND,
                text: "清除屏幕的着色器"
            },
            {
                opcode: "clearSpriteShader",
                blockType: Scratch.BlockType.COMMAND,
                text: "清除自己的着色器"
            },
            
            // === 轨道系统（新增）===
            {
                blockType: Scratch.BlockType.LABEL,
                text: "轨道系统"
            },
          {
            opcode: "getID",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("获取[TARGET]的ID图层"),
            arguments: {
              TARGET: { type: Scratch.ArgumentType.STRING, menu: "TARGETS" }
            }
          },
          {
            opcode: "getOwner",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("获取图层ID [ID]的所有者"),
            arguments: {
              ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
{
  opcode: "getIDByOwner",
  blockType: Scratch.BlockType.REPORTER,
  text: Scratch.translate("获取所有者 [OWNER] 的图层ID"),
  arguments: {
    OWNER: { type: Scratch.ArgumentType.STRING, defaultValue: "舞台" }
  }
},
            {
                opcode: "setStageShaderAtTrack",
                blockType: Scratch.BlockType.COMMAND,
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
                text: "清除屏幕所有轨道"
            },
            {
                opcode: "clearAllSpriteTracksByID",
                blockType: Scratch.BlockType.COMMAND,
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
                text: "清除所有图层的所有轨道"
            },
{
    opcode: "getStageTrackCount",
    blockType: Scratch.BlockType.REPORTER,
    text: "屏幕着色器轨道数量"
},
{
    opcode: "getSpriteTrackCount",
    blockType: Scratch.BlockType.REPORTER,
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
    text: "屏幕着色器数组"
},
{
    opcode: "getSpriteShaderArray",
    blockType: Scratch.BlockType.REPORTER,
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
            // === 管理 ===
            {
                blockType: Scratch.BlockType.LABEL,
                text: "管理"
            },
            {
                opcode: "getAllShaders",
                blockType: Scratch.BlockType.REPORTER,
                text: "作品中的着色器"
            },
            {
                opcode: "getUsingStageShaders",
                blockType: Scratch.BlockType.REPORTER,
                text: "使用中的屏幕的着色器"
            },
            {
                opcode: "getUsingSpriteShaders",
                blockType: Scratch.BlockType.REPORTER,
                text: "使用中的自己的着色器"
            },
            "---",
            {
                opcode: "importNewShader",
                blockType: Scratch.BlockType.COMMAND,
                text: "导入名字为 [name] ,顶点为 [vert] ,片元为 [frag] 的着色器",
                arguments: {
                    name: { type: Scratch.ArgumentType.STRING, defaultValue: "着色器名称" },
                    vert: { type: Scratch.ArgumentType.STRING, defaultValue: "顶点着色器" },
                    frag: { type: Scratch.ArgumentType.STRING, defaultValue: "片元着色器" }
                }
            },
            {
                opcode: "importShaderFromPPS",
                blockType: Scratch.BlockType.COMMAND,
                text: "从.pps文件中导入名字为 [name] ,文件为 [file] 的着色器",
                arguments: {
                    name: { type: Scratch.ArgumentType.STRING, defaultValue: "着色器名称" },
                    file: { type: Scratch.ArgumentType.STRING, defaultValue: ".pps文件" }
                }
            },
{
    opcode: "openShaderImporter",
    blockType: Scratch.BlockType.COMMAND,
    text: "打开预览编辑导入器"
},
            {
                opcode: "deleteShader",
                blockType: Scratch.BlockType.COMMAND,
                text: "删除 [shader]",
                arguments: {
                    shader: { type: Scratch.ArgumentType.STRING, 
                    menu: "shadersAndStageALT"
                    }
                }
            },
{
    opcode: "previewExistingShader",
    blockType: Scratch.BlockType.COMMAND,
    text: "预览已添加的着色器 [shader]",
    arguments: {
        shader: {
            type: Scratch.ArgumentType.STRING,
            menu: "shadersAndStageALT"
        }
    }
},
// 在 getInfo 的 blocks 数组中添加
{
    blockType: Scratch.BlockType.LABEL,
    text: "副着色器"
},
{
    opcode: "createSubShader",
    blockType: Scratch.BlockType.COMMAND,
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
    text: "清空所有副着色器"
},
"---",
{
    opcode: "getSubShaderCount",
    blockType: Scratch.BlockType.REPORTER,
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
            // === 配置 ===
            {
                blockType: Scratch.BlockType.LABEL,
                text: "配置"
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
                    ver: { type: Scratch.ArgumentType.STRING, menu: "ver" },
                    type: { type: Scratch.ArgumentType.STRING, menu: "type" }
                }
            },
            {
                opcode: "getShaderSourceCode",
                blockType: Scratch.BlockType.REPORTER,
                text: "[shader] 的 [type] 着色器的源代码",
                arguments: {
                    type: { type: Scratch.ArgumentType.STRING, menu: "type" },
                    shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" }
                }
            },
            {
                opcode: "getDescrepency",
                blockType: Scratch.BlockType.REPORTER,
                text: "舞台的 [dimension] 缩放倍增",
                arguments: {
                    dimension: { type: Scratch.ArgumentType.STRING, menu: "dimensions" }
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
                    name: { type: Scratch.ArgumentType.STRING, menu: "costumeMenu" }
                }
            },
 {
    opcode: "maskShaderExample",
    blockType: Scratch.BlockType.REPORTER,
    text: "遮罩着色器示例代码",
    arguments: {}
},
            
            // === 全局变量 ===
            {
                blockType: Scratch.BlockType.LABEL,
                text: "全局变量"
            },
{
    opcode: "getUniformValue",
    blockType: Scratch.BlockType.REPORTER,
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
                text: "将 [shader] 中的纹理 [uniformName] 设为 [texture]",
                arguments: {
                    uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "Uniform" },
                    shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
                    texture: { type: Scratch.ArgumentType.STRING, defaultValue: "[object WebGLTexture]" }
                }
            },
            {
                opcode: "setNumberInShader",
                blockType: Scratch.BlockType.COMMAND,
                text: "将 [shader] 中的数字 [uniformName] 设为 [number]",
                arguments: {
                    uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "Uniform" },
                    shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
                    number: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                }
            },
            {
                opcode: "setVec2InShader",
                blockType: Scratch.BlockType.COMMAND,
                text: "将 [shader] 中的二维向量 [uniformName] 设为 [numberX] [numberY]",
                arguments: {
                    uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "Uniform" },
                    shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
                    numberX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                    numberY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                }
            },
            {
                opcode: "setVec3InShader",
                blockType: Scratch.BlockType.COMMAND,
                text: "将 [shader] 中的三维向量 [uniformName] 设为 [numberX] [numberY] [numberZ]",
                arguments: {
                    uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "Uniform" },
                    shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
                    numberX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                    numberY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                    numberZ: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                }
            },
            {
                opcode: "setVec4InShader",
                blockType: Scratch.BlockType.COMMAND,
                text: "将 [shader] 中的四维向量 [uniformName] 设为 [numberX] [numberY] [numberZ] [numberW]",
                arguments: {
                    uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "Uniform" },
                    shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
                    numberX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                    numberY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                    numberZ: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                    numberW: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                }
            },
{
    opcode: "setBoolInShader",
    blockType: Scratch.BlockType.COMMAND,
    text: "将 [shader] 中的布尔 [uniformName] 设为 [value]",
    arguments: {
        uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "Uniform" },
        shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
        value: { type: Scratch.ArgumentType.STRING, menu: "boolValues" }
    }
},

// === 矩阵（用列表输入）===
{
    opcode: "setMat2InShader",
    blockType: Scratch.BlockType.COMMAND,
    text: "将 [shader] 中的 矩阵 [uniformName] 设为 [values]",
    arguments: {
        uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "Uniform" },
        shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
        values: { type: Scratch.ArgumentType.STRING, defaultValue: "[1,0,0,1]" }
    }
},

// === 数组类型 ===
{
    opcode: "setFloatArrayInShader",
    blockType: Scratch.BlockType.COMMAND,
    text: "将 [shader] 中的浮点数组 [uniformName] 设为 [values]",
    arguments: {
        uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "Uniform" },
        shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
        values: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,1,2,3]" }
    }
},
{
    opcode: "setVec2ArrayInShader",
    blockType: Scratch.BlockType.COMMAND,
    text: "将 [shader] 中的 vec 数组 [uniformName] 设为 [values]",
    arguments: {
        uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "Uniform" },
        shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
        values: { type: Scratch.ArgumentType.STRING, defaultValue: "[[0,0],[1,1],[2,2]]" }
    }
},
{
    opcode: "setVec3ArrayInShader",
    blockType: Scratch.BlockType.COMMAND,
    text: "将 [shader] 中的 vec3 数组 [uniformName] 设为 [values]",
    arguments: {
        uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "Uniform" },
        shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
        values: { type: Scratch.ArgumentType.STRING, defaultValue: "[[0,0,0],[1,1,1],[2,2,2]]" }
    }
},
{
    opcode: "setVec4ArrayInShader",
    blockType: Scratch.BlockType.COMMAND,
    text: "将 [shader] 中的 vec4 数组 [uniformName] 设为 [values]",
    arguments: {
        uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "Uniform" },
        shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
        values: { type: Scratch.ArgumentType.STRING, defaultValue: "[[0,0,0,0],[1,1,1,1],[2,2,2,2]]" }
    }
},
            
            // === 编译 ===
            {
                blockType: Scratch.BlockType.LABEL,
                text: "编译"
            },
            {
                opcode: "compileShaderForSprite",
                blockType: Scratch.BlockType.COMMAND,
                text: "编译运用于角色的 [shader] 并且 [control] scratch特效(没什么用)",
                arguments: {
                    shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
                    control: { type: Scratch.ArgumentType.STRING, menu: "control" }
                }
            },
            {
                opcode: "shaderCompiledForSprites",
                blockType: Scratch.BlockType.BOOLEAN,
                text: "已编译运用于角色的 [shader] ?",
                arguments: {
                    shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" }
                }
            },
            
            // === 混色 ===
            {
                blockType: Scratch.BlockType.LABEL,
                text: "裁剪与混色"
            },
{
    opcode: "setClipBox",
    blockType: Scratch.BlockType.COMMAND,
    text: "将裁剪框设为 x1: [X1] y1: [Y1] x2: [X2] y2: [Y2]",
    arguments: {
        X1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        Y1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
        Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
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
            menu: "blendModeFull"  // 改用完整菜单
        }
    }
},
{
    opcode: "getBlend",
    blockType: Scratch.BlockType.REPORTER,
    text: "自己的混合模式"
},
            // === 设置 ===
            {
                blockType: Scratch.BlockType.LABEL,
                text: "设置"
            },
            {
                opcode: "setSetting",
                blockType: Scratch.BlockType.COMMAND,
                text: "将 [setting] 设置为 [value]",
                arguments: {
                    setting: { type: Scratch.ArgumentType.STRING, menu: "settings" },
                    value: { type: Scratch.ArgumentType.STRING, menu: "autorender" }
                }
            },
{
    opcode: "showCacheMonitor",
    blockType: Scratch.BlockType.COMMAND,
    text: "(测试)显示缓存监视器"
},
{
    blockType: Scratch.BlockType.LABEL,
    text: "纹理绑定(图层纹理 → 着色器)"
},
{
    opcode: "bindTextureToShader",
    blockType: Scratch.BlockType.COMMAND,
    text: "将图层 [id] 的纹理绑定到着色器 [shader] 的 [uniformName]",
    arguments: {
        id: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
        shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
        uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "u_texture" }
    }
},
{
    opcode: "unbindTextureFromShader",
    blockType: Scratch.BlockType.COMMAND,
    text: "解除着色器 [shader] 的 [uniformName] 绑定",
    arguments: {
        shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
        uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "u_texture" }
    }
},
{
    opcode: "clearShaderTextureBindings",
    blockType: Scratch.BlockType.COMMAND,
    text: "清除着色器 [shader] 的所有纹理绑定",
    arguments: {
        shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" }
    }
},
{
    opcode: "clearAllShaderTextureBindings",
    blockType: Scratch.BlockType.COMMAND,
    text: "清除所有着色器的纹理绑定"
},
{
    opcode: "getShaderTextureBinding",
    blockType: Scratch.BlockType.REPORTER,
    text: "着色器 [shader] 的 [uniformName] 绑定的图层ID",
    arguments: {
        shader: { type: Scratch.ArgumentType.STRING, menu: "shadersAndStageALT" },
        uniformName: { type: Scratch.ArgumentType.STRING, defaultValue: "u_texture" }
    }
},
{
    opcode: "getBoundShaders",
    blockType: Scratch.BlockType.REPORTER,
    text: "所有绑定了纹理的着色器"
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
        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 480 },
        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 360 }
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
        ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
        Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
    }
},
{
    opcode: "changeLayerZ",
    blockType: Scratch.BlockType.COMMAND,
    text: "将图层 [ID] 的 Z 增加 [STEP]",
    arguments: {
        ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
        STEP: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
    }
},
{
    opcode: "getLayerZ",
    blockType: Scratch.BlockType.REPORTER,
    text: "图层 [ID] 的 Z 值",
    arguments: {
        ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
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
        ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
        PROP: {
            type: Scratch.ArgumentType.STRING,
            menu: "boundsProps"
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
stageDimensions: {
    acceptReporters: true,
    items: [
        { text: "宽度", value: "width" },
        { text: "高度", value: "height" }
    ]
},
renderModes: {
    acceptReporters: true,
    items: [
        { text: "平滑模式", value: "smooth" },
        { text: "像素化模式", value: "pixelated" }
    ]
},
enabledOptions: {
    acceptReporters: true,
    items: [
        { text: "启用", value: "on" },
        { text: "关闭", value: "off" }
    ]
},
sortOrder: {
    acceptReporters: true,
    items: [
        { text: "从小到大", value: "asc" },
        { text: "从大到小", value: "desc" }
    ]
},
boundsProps: {
    acceptReporters: true,
    items: [
        { text: "X坐标", value: "x" },
        { text: "Y坐标", value: "y" },
        { text: "左边界", value: "left" },
        { text: "右边界", value: "right" },
        { text: "上边界", value: "top" },
        { text: "下边界", value: "bottom" }
    ]
},
// 在 menus 中添加
mainShaders: {
    items: "mainShadersMenu",
    acceptReporters: true
},
subShaders: {
    items: "subShadersMenu",
    acceptReporters: true
},
// === 菜单 ===
boolValues: {
    items: [
        { text: "真", value: "true" },
        { text: "假", value: "false" }
    ]
},
maskTypes: {
    acceptReporters: true,
    items: [
        { text: "仅内部", value: "inside" },
        { text: "仅外部", value: "outside" }
    ]
},
TARGETS: { acceptReporters: true, items: "_getTargets" },
    blendModeFull: {
        acceptReporters: true,
        items: [
            { text: "默认", value: "default" },
            { text: "默认后方", value: "default behind" },
            { text: "加法", value: "additive" },
            { text: "加法(带透明度)", value: "additive with alpha" },
            { text: "减法", value: "subtract" },
            { text: "减法(带透明度)", value: "subtract with alpha" },
            { text: "正片叠底", value: "multiply" },
            { text: "反色", value: "invert" },
            { text: "遮罩", value: "mask" },
            { text: "擦除", value: "erase" }
        ]
    },
    clipProps: {
        acceptReporters: true,
        items: [
            { text: "宽度", value: "width" },
            { text: "高度", value: "height" },
            { text: "左x", value: "min x" },
            { text: "下y", value: "min y" },
            { text: "右x", value: "max x" },
            { text: "上y", value: "max y" }
        ]
    },
            shadersAndStageALT: {
                items: "shaderMenuAndStage",
                acceptReporters: true
            },
            extraTargets: {
                items: [
                    { text: "画笔", value: "pen" },
                    { text: "简单3D", value: "simple3D" },
                    { text: "视频侦测", value: "videoSensing" }
                ]
            },
            dimensions: {
                items: [
                    { text: "宽度", value: "width" },
                    { text: "高度", value: "height" }
                ]
            },
            settings: {
                items: [
                    { text: "着色器自动动画", value: "auto re-render" },
                    { text: "兼容模式", value: "compatibility mode" },
                    { text: "多重渲染", value: "multi render" }
                ]
            },
            autorender: {
                items: [
                    { text: "开启", value: "on" },
                    { text: "关闭", value: "off" }
                ]
            },
            control: {
                items: [
                    { text: "启用", value: "enable" },
                    { text: "禁用", value: "disable" }
                ]
            },
            ver: {
                items: ["1.0", "3.0"]
            },
            type: {
                items: [
                    { text: "顶点", value: "vertex" },
                    { text: "片元", value: "fragment" }
                ]
            },
            costumeMenu: {
                items: "costumeMenuFunction",
                acceptReporters: true
            }
        }
    };
}
    getDescrepency({ dimension }) {
      if (dimension == "width") {
        return gl.canvas.width / renderer._nativeSize[0];
      }
      return gl.canvas.height / renderer._nativeSize[1];
    }
    openSite() {
      window.open("https://b23.tv/7HmXoqv");
    }
    
    async openShaderEditor() {
      if (penPlus) {
        penPlus._setupTheme();
        alert('即将打开pen+着色器编辑器.\n友情提示:如遇"连接已重置",请点击鼠标右键,选择"重新加载框架"即可;或者按下F4键关闭编辑器');
        penPlus.openShaderEditor();
      }
    }
    openAboutMenu() {
      alert("当前版本:改版v8.793 Release\n\n原扩展作者:ObviousAlexC\n额外版作者:DestDot\n改版作者:YL_YOLO");
    }
    compileShaderForSprite({ shader, control}) {
      applyScratchEffects = control == "enable" ? true : false;
      compileShaderForSprite(shader);
      applyScratchEffects = true;
    }
    shaderCompiledForSprites({ shader }) {
      if (penPlus) {
        if (recompiledShaders[shader]) return true;
      }
      return false;
    }
    shaderMenu() {
      if (penPlus) {
        return penPlus.shaderMenu();
      }
      return [];
    }
shaderMenuAndStage() {
    if (penPlus) {
        let returnedShaders = [{ value: "____PEN_PLUS__NO__SHADER____", text: "无着色器" }];
        
        const allShaders = Object.keys(penPlus.shaders);
        allShaders.forEach(shader => {
            returnedShaders.push({ value: shader, text: shader });
        });
        
        return returnedShaders;
    }
    return [{ value: "____PEN_PLUS__NO__SHADER____", text: "无着色器" }];
}
    costumeMenuFunction() {
      if (!runtime) return ["no costumes?"];
      if (!runtime._editingTarget) return ["no costumes?"];
      if (!runtime._editingTarget.sprite) return ["no costumes?"];

      const myCostumes = runtime._editingTarget.sprite.costumes;

      let readCostumes = [];
      for (
        let curCostumeID = 0;
        curCostumeID < myCostumes.length;
        curCostumeID++
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
    setStageShader({ shader }, util) {
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
      if (!penPlus.shaders[shader]) {
        this.resetBuffer();
        return;
      }
      renderer.dirty = true;
    }
    setSpriteSkinShader({ shader }, util) {
      const drawableID = util.target.drawableID;
      if (shader == "____PEN_PLUS__NO__SHADER____") {
        delete spriteShaders[drawableID];
        renderer.dirty = true;
        return;
      }
      if (!penPlus.shaders[shader]) {
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
setExtraShader({ target, shader }, util) {
    let DesiredID = -1;
    switch(target) {
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
    
    if (!penPlus.shaders[shader]) return;
    
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
    setSetting({ setting, value }) {
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
          }
          else {
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
    importNewShader({ name, vert, frag, glsl }) {
      const importshader = new Object();
      importshader[name] = {"projectData":{"blockDat":{},"dynamicDat":{"dynamic_variables":[],"dynamic_myblocks":[]},"glsl":"//It seems like you don't import shader form .pps file.So here is nothing to edit.If you want to edit shader here,you can import shader from .pps file.","isText":true},"vertShader":vert.replace(/\\n/g, '\r\n').replace(/\\t/g, "  "),"fragShader":frag.replace(/\\n/g, '\r\n').replace(/\\t/g, "  ")};
      if (penPlus) {
        Object.keys(importshader).forEach(shaderName => {
          if (!penPlus.shaders[shaderName]) {
            penPlus.saveShader(shaderName,{
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
          penPlus.deleteShader(name);
          alert(gl.getShaderInfoLog(testShader));
          return null;
        }
        testShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(testShader, importshader[name].fragShader);
        gl.compileShader(testShader);
        if (!gl.getShaderParameter(testShader, gl.COMPILE_STATUS)) {
          penPlus.deleteShader(name);
          alert(gl.getShaderInfoLog(testShader));
          return null;
        }
      }
    }
    importShaderFromPPS({ name, file }) {
      const glsl = JSON.parse(file).glsl.replace(/\\n/g, '\r\n').replace(/\\t/g, "  ");
      let vertexShader = glsl.includes("void vertex") ? glsl.replace(/\s*void\s+fragment\s*\(\)\s*\{[\s\S]*?\}/gm, "").replace(/void vertex/g,"void main").replace(/(gl_FragColor\.*[xyzw]*\s*[+*/-]*=.*;)/g, "").replace(/(gl_FragColor)/g, "vec4(1)").replace(/(gl_FragCoord)/g, "vec2(1)") : defaultVertexShader100;
      let fragmentShader = glsl.includes("void fragment") ? glsl.replace(/\s*void\s+vertex\s*\(\)\s*\{[\s\S]*?\}/gm, "").replace(/attribute.*;/g,"").replace(/void fragment/g,"void main").replace(/(gl_Position\.*[xyzw]*\s*[+*/-]*=.*;)/g, "").replace(/(gl_Position)/g, "vec4(1)").replace(/(v_color\.*[xyzw]*\s*[+*/-]*=.*;)/g, "") : defaultFragmentShader100;
      if (glsl.includes("#version 300 es")) {
        vertexShader = glsl.includes("void vertex") ? vertexShader.replace(/attribute/g,"in").replace(/varying/g,"out").replace(/layout.*\(.*location.*=.*\d\).*out.*;/g, "") : defaultVertexShader300;
        fragmentShader = glsl.includes("void fragment") ? fragmentShader.replace(/varying/g,"in").replace(/gl_FragColor/g,"fragColor") : defaultFragmentShader300;
      }
      const importshader = new Object();
      importshader[name] = {"projectData":{"blockDat":{},"dynamicDat":{"dynamic_variables":[],"dynamic_myblocks":[]},"glsl":glsl,"isText":true},"vertShader":vertexShader,"fragShader":fragmentShader};
      if (penPlus) {
        Object.keys(importshader).forEach(shaderName => {
          if (!penPlus.shaders[shaderName]) {
            penPlus.saveShader(shaderName,{
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
          penPlus.deleteShader(name);
          alert(gl.getShaderInfoLog(testShader));
          return null;
        }
        testShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(testShader, importshader[name].fragShader);
        gl.compileShader(testShader);
        if (!gl.getShaderParameter(testShader, gl.COMPILE_STATUS)) {
          penPlus.deleteShader(name);
          alert(gl.getShaderInfoLog(testShader));
          return null;
        }
      }
    }
    deleteShader({ shader }) {
      if (penPlus) {
        penPlus.deleteShader(shader);
      }
    }
    defaultShader({ ver, type }) {
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
    getShaderSourceCode({ shader, type }) {
      if (penPlus.shaders[shader]) {
        return type == "vertex" ? penPlus.shaders[shader].projectData.vertShader : penPlus.shaders[shader].projectData.fragShader;
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
      if (!penPlus) return;
      let curCostume = penPlus._locateTextureObject(args.name, util);
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
      return twgl.createTexture(gl,{src:ctx.canvas,flipY:false});
    }
    _isUniformArray(shader, uniformName) {
      if (!penPlus.programs[shader]) return false;
      if (!penPlus.programs[shader].uniformDec[uniformName]) return false;
      if (!penPlus.programs[shader].uniformDec[uniformName].isArray) return false;
      return true;
    }
    _getShaderInstances(shader) {
      if (!penPlus.programs[shader]) return [];
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
        if (penPlus.programs[shader]) {
            penPlus.programs[shader].uniformDat[uniformName] = value;
        }
    } else {
        if (!penPlus.programs[shader]) return;
        penPlus.programs[shader].uniformDat[uniformName] = value;
    }
}

// 批量提交方法
_flushUniformBatch() {
    if (!this._uniformBatchMap || this._uniformBatchMap.size === 0) return;
    
    for (const [key, data] of this._uniformBatchMap) {
        const { shader, uniformName, value, isSubShader } = data;
        this._applyUniformDirect(shader, uniformName, value, isSubShader);
    }
    
    this._uniformBatchMap.clear();
    renderer.dirty = true;
}

// 新增积木方法
setImmediateUniformUpdate({ enabled }) {
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
        
        if (penPlus.programs[shader]) {
            penPlus.programs[shader].uniformDat[uniformName] = this.subShaderUniforms[shader][uniformName];
        }
        return;
    }
    
    if (!penPlus.programs[shader] || !this._isUniformArray(shader, uniformName)) return;
    
    const arrayLength = penPlus.programs[shader].uniformDec[uniformName].arrayLength;
    if (item < 1 || item > arrayLength) return;
    
    const uniformDat = penPlus.programs[shader].uniformDat;
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
    setTextureInShader({ uniformName, shader, texture }, util) {
      if (!penPlus.programs[shader] || this._isUniformArray(shader, uniformName)) return;
      this._setUniform(shader, uniformName, texture);
    }
setNumberInShader({ uniformName, shader, number }) {
    if (!penPlus.programs[shader]) return;
    if (this._isUniformArray(shader, uniformName)) return;
    
    // 直接调用 _setUniform（已被批量处理接管）
    this._setUniform(shader, uniformName, number);
}

setVec2InShader({ uniformName, shader, numberX, numberY }) {
    if (!penPlus.programs[shader] || this._isUniformArray(shader, uniformName)) return;
    this._setUniform(shader, uniformName, [numberX, numberY]);
}

setVec3InShader({ uniformName, shader, numberX, numberY, numberZ }) {
    if (!penPlus.programs[shader] || this._isUniformArray(shader, uniformName)) return;
    this._setUniform(shader, uniformName, [numberX, numberY, numberZ]);
}

setVec4InShader({ uniformName, shader, numberX, numberY, numberZ, numberW }) {
    if (!penPlus.programs[shader] || this._isUniformArray(shader, uniformName)) return;
    this._setUniform(shader, uniformName, [numberX, numberY, numberZ, numberW]);
}

setBoolInShader({ uniformName, shader, value }) {
    if (!penPlus.programs[shader]) return;
    this._setUniform(shader, uniformName, value === "true");
}

setMat2InShader({ uniformName, shader, values }) {
    if (!penPlus.programs[shader]) return;
    try {
        const arr = JSON.parse(values);
        if (arr.length === 4) {
            this._setUniform(shader, uniformName, arr.map(v => Scratch.Cast.toNumber(v)));
        }
    } catch (e) {}
}
setFloatArrayInShader({ uniformName, shader, values }) {
    if (!penPlus.programs[shader]) return;
    
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
setVec2ArrayInShader({ uniformName, shader, values }) {
    if (!penPlus.programs[shader]) return;
    
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
setVec3ArrayInShader({ uniformName, shader, values }) {
    if (!penPlus.programs[shader]) return;
    
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

setVec4ArrayInShader({ uniformName, shader, values }) {
    if (!penPlus.programs[shader]) return;
    
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
    setMatrixInShaderArray({ uniformName, shader, array }) {
      if (!penPlus.programs[shader] || this._isUniformArray(shader, uniformName)) return;
      try {
        let converted = JSON.parse(array);
        if (!Array.isArray(converted)) return;
        converted = converted.map(num => Scratch.Cast.toNumber(num));
        this._setUniform(shader, uniformName, converted);
      } catch (e) {
        return;
      }
    }
    setArrayNumberInShader({ item, uniformName, shader, number }) {
      if (!penPlus.programs[shader] || !this._isUniformArray(shader, uniformName)) return;
      this._setUniformArray(shader, uniformName, item, number, 1);
    }
    setArrayVec2InShader({ item, uniformName, shader, numberX, numberY }) {
      if (!penPlus.programs[shader] || !this._isUniformArray(shader, uniformName)) return;
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
      if (!penPlus.programs[shader] || !this._isUniformArray(shader, uniformName)) return;
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
      if (!penPlus.programs[shader] || !this._isUniformArray(shader, uniformName)) return;
      this._setUniformArray(shader, uniformName, item, [numberX, numberY, numberZ, numberW], 4);
    }
    setArrayMatrixInShaderArray({ item, uniformName, shader, array }) {
      if (!penPlus.programs[shader] || !this._isUniformArray(shader, uniformName)) return;
      const unitSize = penPlus.programs[shader].uniformDec[uniformName].unitSize;
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
            if (penPlus.shaders[shaderName]) {
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

setStageShaderAtTrack({ shader, track }) {
    const trackNum = Scratch.Cast.toNumber(track);
    
    //  检查着色器是否存在
    if (shader !== "____PEN_PLUS__NO__SHADER____" && shader && !penPlus.shaders[shader]) {
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

removeStageShaderTrack({ track }) {
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
    if (!penPlus) return [];
    
    // 确保返回的是数组
    const shaders = Object.keys(penPlus.shaders)
        .filter(name => !name.includes('_'))
        .map(name => ({ text: name, value: name }));
    
    return shaders.length > 0 ? shaders : [{ text: "无", value: "" }];
}

subShadersMenu() {
    if (!this.subShaders) return [];
    
    const subShaders = Object.keys(this.subShaders)
        .map(name => ({ text: name, value: name }));
    
    return subShaders.length > 0 ? subShaders : [{ text: "无", value: "" }];
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
getSubShaderCount({ shader }) {
    if (!penPlus || !penPlus.shaders[shader]) return 0;
    if (shader.includes('_')) return 0;  // 不是主着色器
    
    const subShaders = this._getSubShadersOfMain(shader);
    return subShaders.length;
}

// 获取主着色器下第 N 项的 ID
getSubShaderIdAt({ shader, index }) {
    if (!penPlus || !penPlus.shaders[shader]) return "";
    if (shader.includes('_')) return "";
    
    const idx = Scratch.Cast.toNumber(index) - 1;
    const subShaders = this._getSubShadersOfMain(shader);
    
    if (idx >= 0 && idx < subShaders.length) {
        return this.subShaders[subShaders[idx]].id;
    }
    return "";
}

createSubShader({ shader, id }) {
    // 验证主着色器存在
    if (!penPlus || !penPlus.shaders[shader]) {
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
    
    const mainShaderData = penPlus.shaders[shader];
    const mainProgram = penPlus.programs[shader];
    
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
    
    penPlus.shaders[subShaderName] = {
        projectData: mainShaderData.projectData,
        modifyDate: Date.now(),
        isSubShader: true,
        mainShader: shader
    };
    
    penPlus.programs[subShaderName] = {
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
            delete spriteShaders[id];  //  确保删除 spriteShaders 中的引用
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
                delete spriteShaders[id];  //  如果列表为空，也清理 spriteShaders
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
    delete penPlus.shaders[subShaderName];
    delete penPlus.programs[subShaderName];
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
deleteSubShader({ subShader }) {
    if (!this._isSubShaderName(subShader)) {
        console.warn(`"${subShader}" 不是副着色器`);
        return;
    }
    
    this._deleteSubShader(subShader);
    renderer.dirty = true;
}

// 清空主着色器的所有副着色器
clearSubShadersOfMain({ shader }) {
    if (!penPlus || !penPlus.shaders[shader]) return;
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
deleteShader({ shader }) {
    if (penPlus) {
        // 如果是主着色器，先删除所有副着色器
        if (!shader.includes('_')) {
            this.clearSubShadersOfMain({ shader });
        }
        
        // 如果是副着色器，单独删除
        if (this._isSubShaderName(shader)) {
            this._deleteSubShader(shader);
        } else {
            penPlus.deleteShader(shader);
        }
    }
}
getUniformCount({ shader }) {
    if (!penPlus || !penPlus.shaders[shader]) {
        return "[]";
    }
    
    const projectData = penPlus.shaders[shader].projectData;
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
getUniformNameAt({ shader, index }) {
    if (!penPlus || !penPlus.shaders[shader]) {
        return "";
    }
    
    // 从源码直接解析 uniform，不依赖 programs
    const projectData = penPlus.shaders[shader].projectData;
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
    fragLabel.textContent = '🎨 片元着色器';
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
        
        this.importNewShader({ name, vert, frag });
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
                      'u_resolution'];
    
    const scalarRegex = /uniform\s+(float|int|bool)\s+(\w+)\s*;/g;
    let match;
    while ((match = scalarRegex.exec(fragSource)) !== null) {
        const name = match[2];
        if (!builtIns.includes(name) && !name.startsWith('gl_')) {
            uniforms.push({ type: match[1], name });
        }
    }
    
    const vecRegex = /uniform\s+(vec[234])\s+(\w+)\s*;/g;
    while ((match = vecRegex.exec(fragSource)) !== null) {
        const name = match[2];
        if (!builtIns.includes(name) && !name.startsWith('gl_')) {
            uniforms.push({ type: match[1], name });
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
            inputX.type = 'number'; inputX.step = '0.01'; inputX.value = '0.5'; inputX.placeholder = 'x';
            const inputY = document.createElement('input');
            inputY.type = 'number'; inputY.step = '0.01'; inputY.value = '0.5'; inputY.placeholder = 'y';
            [inputX, inputY].forEach(inp => {
                Object.assign(inp.style, {
                    width: '50px', padding: '4px 6px', borderRadius: '4px',
                    border: 'none', backgroundColor: '#1a1a2e', color: 'white', fontSize: '11px'
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
                inp.type = 'number'; inp.step = '0.01'; inp.value = '0.5'; inp.placeholder = p;
                Object.assign(inp.style, {
                    width: '45px', padding: '4px 2px', borderRadius: '4px',
                    border: 'none', backgroundColor: '#1a1a2e', color: 'white', fontSize: '10px'
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
        -1, -1, 0, 1,     0, 0,      1,1,1,1,
         1, -1, 0, 1,     1, 0,      1,1,1,1,
        -1,  1, 0, 1,     0, 1,      1,1,1,1,
         1,  1, 0, 1,     1, 1,      1,1,1,1
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
        const identity = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
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

previewExistingShader({ shader }) {
    if (!penPlus || !penPlus.shaders[shader]) {
        alert(`着色器 "${shader}" 不存在`);
        return;
    }
    
    const shaderData = penPlus.shaders[shader];
    const program = penPlus.programs[shader];
    
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
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)', zIndex: '2147483646',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        fontFamily: 'Microsoft YaHei, sans-serif'
    });
    
    const modal = document.createElement('div');
    Object.assign(modal.style, {
        width: '800px', maxWidth: '95%', backgroundColor: '#1a1a2e',
        borderRadius: '16px', padding: '20px', maxHeight: '85%', overflow: 'auto'
    });
    
    // 标题
    const title = document.createElement('h3');
    title.textContent = `🎨 ${shaderName}`;
    Object.assign(title.style, { color: '#eee', margin: '0 0 12px 0', fontSize: '16px' });
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
        display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px'
    });
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    Object.assign(closeBtn.style, {
        padding: '10px 20px', borderRadius: '8px', border: 'none',
        backgroundColor: '#0f3460', color: 'white', cursor: 'pointer', fontSize: '14px'
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
            padding: '10px 20px', borderRadius: '8px', border: 'none',
            backgroundColor: '#e94560', color: 'white', cursor: 'pointer', fontSize: '14px'
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
        Object.assign(titleEl.style, { color: '#aaa', fontSize: '13px', marginBottom: '8px', fontWeight: 'bold' });
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
            Object.assign(inputRow.style, { display: 'flex', gap: '4px', flex: '1' });
            
            if (u.type === 'float' || u.type === 'int') {
                const input = document.createElement('input');
                input.type = 'number'; input.step = '0.01'; input.value = uniformControls[u.name];
                Object.assign(input.style, {
                    width: '100%', padding: '6px 8px', borderRadius: '4px',
                    border: '1px solid #e94560', backgroundColor: '#0f3460', color: 'white', fontSize: '11px'
                });
                input.oninput = () => { uniformControls[u.name] = parseFloat(input.value) || 0; };
                inputRow.appendChild(input);
            } else if (u.type === 'vec2') {
                ['x', 'y'].forEach((p, i) => {
                    const inp = document.createElement('input');
                    inp.type = 'number'; inp.step = '0.01'; inp.placeholder = p;
                    inp.value = uniformControls[u.name][i];
                    Object.assign(inp.style, {
                        flex: '1', padding: '6px 4px', borderRadius: '4px',
                        border: '1px solid #e94560', backgroundColor: '#0f3460', color: 'white', fontSize: '11px'
                    });
                    inp.oninput = () => { uniformControls[u.name][i] = parseFloat(inp.value) || 0; };
                    inputRow.appendChild(inp);
                });
            } else if (u.type === 'vec3') {
                ['x', 'y', 'z'].forEach((p, i) => {
                    const inp = document.createElement('input');
                    inp.type = 'number'; inp.step = '0.01'; inp.placeholder = p;
                    inp.value = uniformControls[u.name][i];
                    Object.assign(inp.style, {
                        flex: '1', padding: '6px 2px', borderRadius: '4px',
                        border: '1px solid #e94560', backgroundColor: '#0f3460', color: 'white', fontSize: '10px'
                    });
                    inp.oninput = () => { uniformControls[u.name][i] = parseFloat(inp.value) || 0; };
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
        -1, -1, 0, 1,     0, 0,      1,1,1,1,
         1, -1, 0, 1,     1, 0,      1,1,1,1,
        -1,  1, 0, 1,     0, 1,      1,1,1,1,
         1,  1, 0, 1,     1, 1,      1,1,1,1
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
        const identity = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
        gl.uniformMatrix4fv(uTransform, false, identity);
    }
    
    const texCanvas = document.createElement('canvas');
    texCanvas.width = texCanvas.height = 64;
    const ctx = texCanvas.getContext('2d');
    ctx.fillStyle = '#2a2a2a'; ctx.fillRect(0,0,64,64);
    ctx.fillStyle = '#3a3a3a'; ctx.fillRect(0,0,32,32); ctx.fillRect(32,32,32,32);
    ctx.fillStyle = '#4a4a4a'; ctx.fillRect(16,16,2,2); ctx.fillRect(48,48,2,2);
    
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
            const identity = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
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
    observer.observe(document.body, { childList: true, subtree: true });
}
// 裁剪功能
setClipBox({ X1, Y1, X2, Y2 }, { target }) {
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

clearClipBox(args, { target }) {
    if (target.isStage) return;
    const drawableID = target.drawableID;
    
    delete clipBoxes[drawableID];
    if (target.drawable) {
        delete target.drawable.clipbox;
    }
    
    renderer.dirty = true;
}

getClipBox({ PROP }, { target }) {
    const drawableID = target.drawableID;
    const clipbox = clipBoxes[drawableID] || target.drawable?.clipbox;
    
    if (!clipbox) return "";
    
    switch (PROP) {
        case "width": return clipbox.x_max - clipbox.x_min;
        case "height": return clipbox.y_max - clipbox.y_min;
        case "min x": return clipbox.x_min;
        case "min y": return clipbox.y_min;
        case "max x": return clipbox.x_max;
        case "max y": return clipbox.y_max;
        default: return "";
    }
}

// 混合功能
setBlend({ blendMode }, { target }) {
    if (target.isStage) return;
    const drawableID = target.drawableID;
    
    // 直接写入 renderer._allDrawables 中的 drawable 对象
    const drawable = renderer._allDrawables[drawableID];
    if (drawable) {
        drawable.blendMode = blendMode;
    }
    
    renderer.dirty = true;
}

getBlend(args, { target }) {
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
    const list = [
        { text: "自己", value: "_myself_" },
        { text: "舞台", value: "_stage_" },
        { text: "视频图层", value: "_video_" },
        { text: "画笔图层", value: "_pen_" }
    ];
    for (const i of renderer._drawList) {
        const drawable = renderer._allDrawables[i];
        if (drawable !== undefined && drawable.customDrawableName !== undefined) {
            list.push({ text: drawable.customDrawableName, value: `${i}=SP-custLayer` });
        }
    }
    for (const target of runtime.targets) {
        if (target.isOriginal && !target.isStage) list.push({ text: target.getName(), value: target.getName() });
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
        touchAction: 'none',  // ← 阻止浏览器默认手势
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
    titleBar.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', moveDrag, { passive: false });
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
    observer.observe(document.body, { childList: true });
    
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
    if (penPlus && penPlus.shaders) {
        const shaderKeys = Object.keys(penPlus.shaders);
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
            this._cachedWebGLInfo = { version: '未知' };
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
getSpriteTrackCount({ id }) {
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
getSpriteShaderArray({ id }) {
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
setRenderSize({ X, Y }) {
    const w = Scratch.Cast.toNumber(X);
    const h = Scratch.Cast.toNumber(Y);
    if (w > 0 && h > 0) {
        this._setRenderSizeFunc(w, h);
    }
}
setRenderMode({ MODE }) {
    const canvas = renderer.canvas;
    canvas.style.imageRendering = MODE === "pixelated" ? "pixelated" : "";
}

getStageSize({ DIMENSION }) {
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
setLayerZ({ ID, Z }) {
    const drawableID = Scratch.Cast.toNumber(ID);
    if (!renderer._allDrawables[drawableID]) return;
    layerZMap[drawableID] = Scratch.Cast.toNumber(Z);
    renderer.dirty = true;
}

// Z 值增减
changeLayerZ({ ID, STEP }) {
    const drawableID = Scratch.Cast.toNumber(ID);
    if (!renderer._allDrawables[drawableID]) return;
    if (layerZMap[drawableID] === undefined) {
        layerZMap[drawableID] = 0;
    }
    layerZMap[drawableID] += Scratch.Cast.toNumber(STEP);
    renderer.dirty = true;
}

// 获取 Z 值
getLayerZ({ ID }) {
    const drawableID = Scratch.Cast.toNumber(ID);
    return layerZMap[drawableID] ?? 0;
}

// 手动排序
sortLayers({ ORDER }) {
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
getLayerBounds({ ID, PROP }) {
    const drawableID = Scratch.Cast.toNumber(ID);
    const drawable = renderer._allDrawables[drawableID];
    if (!drawable) return 0;
    
    const pos = drawable._position || [0, 0];
    const skinScale = drawable._skinScale || [0, 0];
    
    switch (PROP) {
        case "x": return pos[0];
        case "y": return pos[1];
        case "left": return pos[0] - skinScale[0] / 2;
        case "right": return pos[0] + skinScale[0] / 2;
        case "top": return pos[1] + skinScale[1] / 2;
        case "bottom": return pos[1] - skinScale[1] / 2;
        default: return 0;
    }
}
// ========== 纹理绑定系统 ==========

// 绑定纹理到着色器
bindTextureToShader({ id, shader, uniformName }) {
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
    if (!penPlus || !penPlus.shaders[shaderName]) {
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
unbindTextureFromShader({ shader, uniformName }) {
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
clearShaderTextureBindings({ shader }) {
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
getShaderTextureBinding({ shader, uniformName }) {
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
setSpriteShader({ shader }, util) {
    const drawableID = util.target.drawableID;
    
    if (shader == "____PEN_PLUS__NO__SHADER____") {
        delete spriteShaders[drawableID];
        delete renderSpriteShadersList[drawableID];
        delete textures[drawableID];
        
        renderer.dirty = true;
        return;
    }
    
    if (!penPlus.shaders[shader]) {
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
setSpriteShaderAtTrack({ shader, id, track }) {
    const drawableID = Scratch.Cast.toNumber(id);
    const trackNum = Scratch.Cast.toNumber(track);
    
    if (!renderer._allDrawables[drawableID]) return;
    
    if (shader !== "____PEN_PLUS__NO__SHADER____" && shader && !penPlus.shaders[shader]) {
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
removeSpriteShaderTrack({ id, track }) {
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
clearAllSpriteTracksByID({ id }) {
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

// ========== _rebuildSpriteListFromTracks ==========
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
getUniformValue({ shader, uniformName }) {
    // 副着色器优先读 subShaderUniforms
    if (this.subShaders?.[shader]) {
        const val = this.subShaderUniforms?.[shader]?.[uniformName];
        if (val !== undefined && val !== null) {
            return Array.isArray(val) ? JSON.stringify(val) : val;
        }
    }
    
    // 主着色器
    if (penPlus.programs[shader]) {
        const val = penPlus.programs[shader].uniformDat[uniformName];
        if (val !== undefined && val !== null) {
            return Array.isArray(val) ? JSON.stringify(val) : val;
        }
    }
    
    return 0;
}
}Scratch.extensions.register(new extension());
})(Scratch);