//原作者:yl_yolo
//魔改by超级无敌老王八
//拓展开源 只是压缩了 浏览器搜js解压即可解压源码
//此iframe版本已停更 skin版本开发中 敬请期待

class ThreeDContainerExtension{constructor(){this.containers=new Map;this.textureCache=new Map;this.propertyCallbacks=new Map;this.physicsWorlds=new Map;this.setupMessageListener()}getInfo(){return{id:"threedcontainer",name:"3D容器",color1:"#3040CE",color2:"#3040CE",blockIconURI:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAAJcEhZcwAAXFkAAFxZAStO/ZEAAADHSURBVFiF7djBCQIxEEDRH7EkGxC0AcEGLMFCLMEGBBtQsAF7Gi962iQ72XF3cph/DQnvkoEEoiiqllo3iIjMAQFIKQ0865YDREQ229v/RN/er2NxbaU9ZE7c6VxeVwG9cKAAeuJgBOiNgwqwBxwUgL3gIDNmfnOudvWn1oqDwhzcH55Wy6DHfTdpn3oOehVAawG0FkBrAbQWQGsB1HS95F900AGwhgNn4BgOHIEaHDgBtThwALbgYGFgKw4yn0dLfw5FUWTsAwQaUB1enbxwAAAAAElFTkSuQmCC",menuIconURI:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAAJcEhZcwAAXFkAAFxZAStO/ZEAAAGZSURBVFiF7ZkxTsMwFEBfEHAeUnEAisjEVgmxcwRWGGHlCOwIiY2pEe0BEOmNYHIVHH/7J7HjIPGmxnas129/y3YKBE7Ovr6luhTstovCVd4pnFrMxhbdP+QWszGiB7lFQhQwv+gZdttFcdj3pWZTpnABoFw2nbKiT/SaTcnp8jWqFMDn5gpwC6rnYEq5m1u5XiWYSw4UgjnlICCYWw48gnOQA0FwLnIAnXXQrHMm9WPSVw4cggDVqh7r0mH9djHoPXEO+jq068zzUAkfqnXQFqhW9a+yFBE3eAVdQgZTllIOAoJtsdQiEsEIGrEpouVC3G7ZMlq59lSI8YeCSeLKUGluVqt6LxUr2kFBOxnMb2lJCdVHF7Sxhc2zHdVYEVRt+UPzceh81SAKaoZIM5RjZdVZ3Ma1aEvtHu9L7h66Zw0touD7yznHR9Mcm5+f3Acm8AheXn+IHcbcFPjkIPPNQkgORibJkLYGjRwMTJIh7dpo5SDDEPeRg4kF+8qB43Zr6sshH87brb6dpOb/hnUsf+cS3WYunyF+AMvA2MuwXVPuAAAAAElFTkSuQmCC",docsURI:"https://b23.tv/AFmKa88",blocks:[{blockType:Scratch.BlockType.LABEL,text:"基础容器"},{opcode:"createContainer",blockType:Scratch.BlockType.COMMAND,text:"创建3D容器 [ID]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"}}},{opcode:"setContainerSize",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 大小 宽 [WIDTH] 高 [HEIGHT]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},WIDTH:{type:Scratch.ArgumentType.NUMBER,defaultValue:"480"},HEIGHT:{type:Scratch.ArgumentType.NUMBER,defaultValue:"360"}}},{opcode:"setContainerPosition",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 位置 X [X] Y [Y]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"}}},{opcode:"setContainerBackground",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 背景 [STYLE]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},STYLE:{type:Scratch.ArgumentType.STRING,menu:"backgroundStyle"}}},{opcode:"setCoordinateSystem",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 坐标轴显示 [VISIBLE]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},VISIBLE:{type:Scratch.ArgumentType.STRING,menu:"booleanMenu"}}},{opcode:"setRenderQuality",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 渲染质量 [QUALITY]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},QUALITY:{type:Scratch.ArgumentType.STRING,menu:"qualityPreset"}}},{opcode:"setReflectionEnabled",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 水面反射 [ENABLED]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},ENABLED:{type:Scratch.ArgumentType.STRING,menu:"booleanMenu"}}},{opcode:"setContainerPhysics",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 物理模拟 [ENABLED]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},ENABLED:{type:Scratch.ArgumentType.STRING,menu:"booleanMenu"}}},{opcode:"showContainer",blockType:Scratch.BlockType.COMMAND,text:"显示容器 [ID]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"}}},{opcode:"hideContainer",blockType:Scratch.BlockType.COMMAND,text:"隐藏容器 [ID]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"}}},{opcode:"deleteContainer",blockType:Scratch.BlockType.COMMAND,text:"删除容器 [ID]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"}}},{opcode:"removeModel",blockType:Scratch.BlockType.COMMAND,text:"删除容器 [CONTAINER_ID] 的建模 [MODEL_ID]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"}}},{opcode:"clearAll",blockType:Scratch.BlockType.COMMAND,text:"清空容器 [ID] 的所有内容",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"}}},{blockType:Scratch.BlockType.LABEL,text:"光源设置"},{opcode:"setAmbientLight",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 环境光 [ENABLED] 亮度 [INTENSITY] 颜色 [COLOR]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},ENABLED:{type:Scratch.ArgumentType.STRING,menu:"booleanMenu"},INTENSITY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.6"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#FFFFFF"}}},{opcode:"setShadows",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 光源阴影 [ENABLED] 计算范围 [RANGE]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},ENABLED:{type:Scratch.ArgumentType.STRING,menu:"booleanMenu"},RANGE:{type:Scratch.ArgumentType.NUMBER,defaultValue:"500"}}},{opcode:"setTransparencyThreshold",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 光源对建模透明度影响 [THRESHOLD]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},THRESHOLD:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.3"}}},{opcode:"addDirectionalLight",blockType:Scratch.BlockType.COMMAND,text:"向容器 [CONTAINER_ID] 添加建模 [LIGHT_ID] 日光 位置X [X] Y [Y] Z [Z] 亮度 [INTENSITY] 颜色 [COLOR]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},LIGHT_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"sun1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"100"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"200"},Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"100"},INTENSITY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"1"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#FFFFFF"}}},{opcode:"addPointLight",blockType:Scratch.BlockType.COMMAND,text:"向容器 [CONTAINER_ID] 添加建模 [LIGHT_ID] 点光源 位置X [X] Y [Y] Z [Z] 亮度 [INTENSITY] 颜色 [COLOR] 范围 [RANGE]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},LIGHT_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"light1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"100"},Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"100"},INTENSITY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"1"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#FFFFFF"},RANGE:{type:Scratch.ArgumentType.NUMBER,defaultValue:"100"}}},{opcode:"addSpotLight",blockType:Scratch.BlockType.COMMAND,text:"向容器 [CONTAINER_ID] 添加建模 [LIGHT_ID] 聚光 位置X [X] Y [Y] Z [Z] 目标X [TARGET_X] 目标Y [TARGET_Y] 目标Z [TARGET_Z] 亮度 [INTENSITY] 颜色 [COLOR] 角度 [ANGLE] 衰减 [PENUMBRA]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},LIGHT_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"spot1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"200"},Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},TARGET_X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},TARGET_Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},TARGET_Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},INTENSITY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"1"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#FFFFFF"},ANGLE:{type:Scratch.ArgumentType.NUMBER,defaultValue:"30"},PENUMBRA:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.1"}}},{opcode:"addAreaLight",blockType:Scratch.BlockType.COMMAND,text:"向容器 [CONTAINER_ID] 添加建模 [LIGHT_ID] 面光 位置X [X] Y [Y] Z [Z] 宽度 [WIDTH] 高度 [HEIGHT] 亮度 [INTENSITY] 颜色 [COLOR]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},LIGHT_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"area1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"100"},Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},WIDTH:{type:Scratch.ArgumentType.NUMBER,defaultValue:"50"},HEIGHT:{type:Scratch.ArgumentType.NUMBER,defaultValue:"50"},INTENSITY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"1"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#FFFFFF"}}},{opcode:"setLightPosition",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的光源 [LIGHT_ID] 位置 X [X] Y [Y] Z [Z]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},LIGHT_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"light1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"}}},{opcode:"setLightIntensity",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的光源 [LIGHT_ID] 亮度为 [INTENSITY]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},LIGHT_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"light1"},INTENSITY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"1"}}},{opcode:"setLightColor",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的光源 [LIGHT_ID] 颜色为 [COLOR]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},LIGHT_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"light1"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#FFFFFF"}}},{opcode:"setSpotLightTarget",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的聚光灯 [LIGHT_ID] 目标位置 X [TARGET_X] Y [TARGET_Y] Z [TARGET_Z]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},LIGHT_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"spot1"},TARGET_X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},TARGET_Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},TARGET_Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"}}},{opcode:"setAreaLightSize",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的面光 [LIGHT_ID] 宽度 [WIDTH] 高度 [HEIGHT]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},LIGHT_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"area1"},WIDTH:{type:Scratch.ArgumentType.NUMBER,defaultValue:"50"},HEIGHT:{type:Scratch.ArgumentType.NUMBER,defaultValue:"50"}}},{blockType:Scratch.BlockType.LABEL,text:"建模管理"},{opcode:"addCube",blockType:Scratch.BlockType.COMMAND,text:"向容器 [CONTAINER_ID] 添加建模 [MODEL_ID] 立方体 位置X [X] Y [Y] Z [Z] 宽 [WIDTH] 高 [HEIGHT] 长 [DEPTH] 颜色 [COLOR]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},WIDTH:{type:Scratch.ArgumentType.NUMBER,defaultValue:"100"},HEIGHT:{type:Scratch.ArgumentType.NUMBER,defaultValue:"100"},DEPTH:{type:Scratch.ArgumentType.NUMBER,defaultValue:"100"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#FF0000"}}},{opcode:"addWater",blockType:Scratch.BlockType.COMMAND,text:"向容器 [CONTAINER_ID] 添加建模 [MODEL_ID] 水面 位置X [X] Y [Y] Z [Z] 宽 [WIDTH] 深 [DEPTH] 颜色 [COLOR]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"water1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},WIDTH:{type:Scratch.ArgumentType.NUMBER,defaultValue:"200"},DEPTH:{type:Scratch.ArgumentType.NUMBER,defaultValue:"200"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#006994"}}},{opcode:"addSphere",blockType:Scratch.BlockType.COMMAND,text:"向容器 [CONTAINER_ID] 添加建模 [MODEL_ID] 球体 位置X [X] Y [Y] Z [Z] 大小 [SIZE] 颜色 [COLOR]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"sphere1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},SIZE:{type:Scratch.ArgumentType.NUMBER,defaultValue:"50"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#0000FF"}}},{opcode:"importModel",blockType:Scratch.BlockType.COMMAND,text:"(gltf)导入模型到容器 [CONTAINER_ID] 建模ID [MODEL_ID] 文件 [FILE_URL] 缩放 [SCALE]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"model1"},FILE_URL:{type:Scratch.ArgumentType.STRING,defaultValue:""},SCALE:{type:Scratch.ArgumentType.NUMBER,defaultValue:"1.0"}}},{blockType:Scratch.BlockType.LABEL,text:"粒子效果"},{opcode:"addParticle",blockType:Scratch.BlockType.COMMAND,text:"向容器 [CONTAINER_ID] 添加建模 [PARTICLE_ID] 粒子 位置X [X] Y [Y] Z [Z] 颜色 [COLOR] 亮度 [INTENSITY] 扩散度 [SPREAD]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},PARTICLE_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"particle1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#FFFF00"},INTENSITY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"1"},SPREAD:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.5"}}},{blockType:Scratch.BlockType.LABEL,text:"材质管理"},{opcode:"loadTexture",blockType:Scratch.BlockType.COMMAND,text:"加载贴图 [TEXTURE_ID] 图片 [IMAGE_URL]",arguments:{TEXTURE_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"texture1"},IMAGE_URL:{type:Scratch.ArgumentType.STRING,defaultValue:""}}},{opcode:"setModelTexture",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的建模 [MODEL_ID] 贴图 [TEXTURE_ID]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},TEXTURE_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"texture1"}}},{opcode:"removeModelTexture",blockType:Scratch.BlockType.COMMAND,text:"移除容器 [CONTAINER_ID] 的建模 [MODEL_ID] 的贴图",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"}}},{opcode:"deleteTexture",blockType:Scratch.BlockType.COMMAND,text:"删除缓存贴图 [TEXTURE_ID]",arguments:{TEXTURE_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"texture1"}}},{opcode:"setModelColor",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的建模 [MODEL_ID] 颜色为 [COLOR]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#FF0000"}}},{opcode:"setMaterial",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的建模 [MODEL_ID] 材质为 [MATERIAL] 粗糙度 [ROUGHNESS] 金属度 [METALNESS]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},MATERIAL:{type:Scratch.ArgumentType.STRING,menu:"materialType"},ROUGHNESS:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.5"},METALNESS:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.5"}}},{opcode:"setModelSide",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的建模 [MODEL_ID] 渲染面为 [SIDE]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},SIDE:{type:Scratch.ArgumentType.STRING,menu:"sideType"}}},{opcode:"setModelTransparency",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的建模 [MODEL_ID] 透明度 [ALPHA]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},ALPHA:{type:Scratch.ArgumentType.NUMBER,defaultValue:"1.0"}}},{opcode:"setModelBrightness",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的建模 [MODEL_ID] 亮度 [BRIGHTNESS]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},BRIGHTNESS:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"}}},{blockType:Scratch.BlockType.LABEL,text:"模型变换"},{opcode:"setModelPosition",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的建模 [MODEL_ID] 位置 X [X] Y [Y] Z [Z]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"}}},{opcode:"setModelRotation",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的建模 [MODEL_ID] 旋转 X [X] Y [Y] Z [Z]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"}}},{opcode:"setModelSize",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 的建模 [MODEL_ID] 大小 宽 [WIDTH] 高 [HEIGHT] 长 [DEPTH]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},WIDTH:{type:Scratch.ArgumentType.NUMBER,defaultValue:"100"},HEIGHT:{type:Scratch.ArgumentType.NUMBER,defaultValue:"100"},DEPTH:{type:Scratch.ArgumentType.NUMBER,defaultValue:"100"}}},{blockType:Scratch.BlockType.LABEL,text:"Cannon物理引擎"},{opcode:"setModelPhysics",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 中的模型 [MODEL_ID] 物理效果 [ENABLED] 重力 [GRAVITY] 弹力 [BOUNCE] 阻力 [DRAG] 摩擦力 [FRICTION]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},ENABLED:{type:Scratch.ArgumentType.STRING,menu:"booleanMenu"},GRAVITY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"1"},BOUNCE:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.3"},DRAG:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.1"},FRICTION:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.05"}}},{opcode:"setGlobalGravity",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 全局重力 x [GX] y [GY] z [GZ]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},GX:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},GY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"-10"},GZ:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"}}},{opcode:"applyForce",blockType:Scratch.BlockType.COMMAND,text:"对容器 [CONTAINER_ID] 中的模型 [MODEL_ID] 施加力 x [FX] y [FY] z [FZ]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},FX:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},FY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},FZ:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"}}},{opcode:"setModelVelocity",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 中的模型 [MODEL_ID] 速度 x [VX] y [VY] z [VZ]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},VX:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},VY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},VZ:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"}}},{opcode:"setModelStatic",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 中的模型 [MODEL_ID] 为静态物体 [STATIC]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},STATIC:{type:Scratch.ArgumentType.STRING,menu:"booleanMenu"}}},{opcode:"createPhysicsGround",blockType:Scratch.BlockType.COMMAND,text:"在容器 [CONTAINER_ID] 创建物理地面 高度 [HEIGHT] 弹力 [BOUNCE] 摩擦力 [FRICTION]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},HEIGHT:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},BOUNCE:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.3"},FRICTION:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.1"}}},{opcode:"getModelPhysicsInfo",blockType:Scratch.BlockType.REPORTER,text:"获取容器 [CONTAINER_ID] 中的模型 [MODEL_ID] 的 [PROPERTY]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},PROPERTY:{type:Scratch.ArgumentType.STRING,menu:"physicsProperty"}}},{opcode:"attachModelToModel",blockType:Scratch.BlockType.COMMAND,text:"将容器 [CONTAINER_ID] 中的模型 [CHILD_MODEL_ID] 固定到模型 [PARENT_MODEL_ID] 上 旋转中心 [ROTATION_CENTER]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},CHILD_MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"wheel1"},PARENT_MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"car1"},ROTATION_CENTER:{type:Scratch.ArgumentType.STRING,menu:"rotationCenterMenu"}}},{opcode:"detachModelFromModel",blockType:Scratch.BlockType.COMMAND,text:"将容器 [CONTAINER_ID] 中的模型 [CHILD_MODEL_ID] 从模型 [PARENT_MODEL_ID] 上分离",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},CHILD_MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"wheel1"},PARENT_MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"car1"}}},{opcode:"applyTorque",blockType:Scratch.BlockType.COMMAND,text:"对容器 [CONTAINER_ID] 中的模型 [MODEL_ID] 施加旋转力 x [TX] y [TY] z [TZ]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},TX:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},TY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},TZ:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"}}},{opcode:"setCollisionType",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 中的模型 [MODEL_ID] 碰撞类型为 [COLLISION_TYPE]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},COLLISION_TYPE:{type:Scratch.ArgumentType.STRING,menu:"collisionTypeMenu"}}},{opcode:"setCollisionBoxVisible",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 中的模型 [MODEL_ID] 碰撞箱显示 [VISIBLE]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},VISIBLE:{type:Scratch.ArgumentType.STRING,menu:"booleanMenu"}}},{blockType:Scratch.BlockType.LABEL,text:"摄像机变换"},{opcode:"setCameraPosition",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 的摄像头位置 X [X] Y [Y] Z [Z]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:"500"}}},{opcode:"setCameraRotation",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 的摄像头旋转 X [X] Y [Y]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},X:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"}}},{opcode:"setCameraFOV",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 的摄像头FOV[FOV]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},FOV:{type:Scratch.ArgumentType.NUMBER,defaultValue:"90"}}},{blockType:Scratch.BlockType.LABEL,text:"容器信息获取"},{opcode:"calculateDirection",blockType:Scratch.BlockType.REPORTER,text:"从坐标 [X1] [Y1] [Z1] 面向坐标 [X2] [Y2] [Z2] 的 [DIRECTION] 方向",arguments:{X1:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Y1:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Z1:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},X2:{type:Scratch.ArgumentType.NUMBER,defaultValue:"100"},Y2:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},Z2:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0"},DIRECTION:{type:Scratch.ArgumentType.STRING,menu:"directionMenu"}}},{opcode:"getModelProperty",blockType:Scratch.BlockType.REPORTER,text:"获取容器 [CONTAINER_ID] 建模 [MODEL_ID] 的 [PROPERTY]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},PROPERTY:{type:Scratch.ArgumentType.STRING,menu:"modelProperties"}}},{opcode:"getCameraProperty",blockType:Scratch.BlockType.REPORTER,text:"获取容器 [ID] 摄像头的 [PROPERTY]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},PROPERTY:{type:Scratch.ArgumentType.STRING,menu:"cameraProperties"}}},{opcode:"checkCollisions",blockType:Scratch.BlockType.REPORTER,text:"检测容器 [CONTAINER_ID] 建模 [MODEL_ID] 的碰撞",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"}}},{opcode:"advancedCollision",blockType:Scratch.BlockType.REPORTER,text:"高级碰撞 容器 [CONTAINER_ID] 建模 [MODEL_ID] 与 [TARGET_ID] 透明度阈值 [ALPHA_THRESHOLD]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube1"},TARGET_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"cube2"},ALPHA_THRESHOLD:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.1"}}},{blockType:Scratch.BlockType.LABEL,text:"骨骼动画"},{opcode:"getModelAnimations",blockType:Scratch.BlockType.REPORTER,text:"获取容器 [CONTAINER_ID] 建模 [MODEL_ID] 的动画列表",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"model1"}}},{opcode:"setAnimationTransition",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [CONTAINER_ID] 模型 [MODEL_ID] 动画过渡帧为 [TRANSITION_TIME]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"model1"},TRANSITION_TIME:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.5"}}},{opcode:"playAnimation",blockType:Scratch.BlockType.COMMAND,text:"播放容器 [CONTAINER_ID] 建模 [MODEL_ID] 的动画 [ANIMATION_NAME] 动画重复 [REPEAT_MODE]",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"model1"},ANIMATION_NAME:{type:Scratch.ArgumentType.STRING,defaultValue:"animation"},REPEAT_MODE:{type:Scratch.ArgumentType.STRING,menu:"animationRepeatMode"}}},{opcode:"stopAnimation",blockType:Scratch.BlockType.COMMAND,text:"停止容器 [CONTAINER_ID] 建模 [MODEL_ID] 的动画",arguments:{CONTAINER_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},MODEL_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"model1"}}},{blockType:Scratch.BlockType.LABEL,text:"环境管理"},{opcode:"setFog",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 雾气 [ENABLED] 密度 [DENSITY] 颜色 [COLOR]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},ENABLED:{type:Scratch.ArgumentType.STRING,menu:"booleanMenu"},DENSITY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.01"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#CCCCCC"}}},{opcode:"setFogDensity",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 雾气密度 [DENSITY]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},DENSITY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.01"}}},{opcode:"setFogColor",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 雾气颜色 [COLOR]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#CCCCCC"}}},{opcode:"setFogLightAbsorption",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 雾气吸光度 [ABSORPTION]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},ABSORPTION:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.5"}}},{opcode:"setSkyboxEnabled",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 天空盒 [ENABLED]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},ENABLED:{type:Scratch.ArgumentType.STRING,menu:"booleanMenu"}}},{opcode:"setSkyboxType",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 天空盒类型为 [TYPE]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},TYPE:{type:Scratch.ArgumentType.STRING,menu:"skyboxType"}}},{opcode:"setSkyboxColor",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 天空盒颜色 [COLOR]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:"#87CEEB"}}},{opcode:"setSkyboxTexture",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 天空盒贴图 [TEXTURE_ID]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},TEXTURE_ID:{type:Scratch.ArgumentType.STRING,defaultValue:"skybox1"}}},{opcode:"setSkyboxTextureType",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 天空盒使用贴图类型 [TEXTURE_TYPE]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},TEXTURE_TYPE:{type:Scratch.ArgumentType.STRING,menu:"skyboxTextureType"}}},{opcode:"setBloomEffect",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 光晕效果 [ENABLED] 强度 [STRENGTH] 阈值 [THRESHOLD] 半径 [RADIUS]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},ENABLED:{type:Scratch.ArgumentType.STRING,menu:"booleanMenu"},STRENGTH:{type:Scratch.ArgumentType.NUMBER,defaultValue:"1.0"},THRESHOLD:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.6"},RADIUS:{type:Scratch.ArgumentType.NUMBER,defaultValue:"0.4"}}},{opcode:"setPostProcessingFilter",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 滤镜类型 [FILTER_TYPE] 强度 [INTENSITY]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},FILTER_TYPE:{type:Scratch.ArgumentType.STRING,menu:"filterType"},INTENSITY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"1.0"}}},{opcode:"setFilterIntensity",blockType:Scratch.BlockType.COMMAND,text:"设置容器 [ID] 滤镜强度 [INTENSITY]",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"},INTENSITY:{type:Scratch.ArgumentType.NUMBER,defaultValue:"1.0"}}},{opcode:"disableFilter",blockType:Scratch.BlockType.COMMAND,text:"关闭容器 [ID] 滤镜",arguments:{ID:{type:Scratch.ArgumentType.STRING,defaultValue:"3D1"}}}],menus:{booleanMenu:{acceptReporters:!0,items:["开启","关闭"]},qualityPreset:{acceptReporters:!0,items:["极致优化","性能优先","平衡模式","质量优先","极致质量"]},backgroundStyle:{acceptReporters:!0,items:["透明","纯白","纯黑","天空蓝"]},materialType:{acceptReporters:!0,items:["标准材质","金属材质","塑料材质","水面材质","玻璃材质"]},sideType:{acceptReporters:!0,items:["正面","背面","双面"]},directionMenu:{acceptReporters:!0,items:["X方向","Y方向","Z方向","水平角度","垂直角度"]},modelProperties:{acceptReporters:!0,items:["X坐标","Y坐标","Z坐标","X旋转","Y旋转","Z旋转","宽度","高度","长度"]},cameraProperties:{acceptReporters:!0,items:["X坐标","Y坐标","Z坐标","X旋转","Y旋转"]},booleanMenu:{acceptReporters:!0,items:["开启","关闭"]},skyboxType:{acceptReporters:!0,items:["球形天空盒","方形天空盒"]},rotationCenterMenu:{acceptReporters:!0,items:["围绕父模型中心","围绕自身中心"]},skyboxTextureType:{acceptReporters:!0,items:["四边形贴图","方块展开贴图","长条形球形建模贴图"]},filterType:{acceptReporters:!0,items:["原画","灰度","复古","棕褐色","黑金","鲜艳","褪色","电影","老电视机","漫画","素描"]},animationRepeatMode:{acceptReporters:!0,items:["重复播放","播放一次","停止于最后一帧"]},collisionTypeMenu:{acceptReporters:!0,items:["简单碰撞","完整碰撞"]},physicsProperty:{acceptReporters:!0,items:["X坐标","Y坐标","Z坐标","X速度","Y速度","Z速度","质量","弹力","摩擦力"]}}}}setModelColor(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toString(n.COLOR);this.sendMessageToContainer(t,{type:"SET_MODEL_COLOR",modelId:i,color:r})}addWater(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toNumber(n.X),u=Scratch.Cast.toNumber(n.Y),f=Scratch.Cast.toNumber(n.Z),e=Scratch.Cast.toNumber(n.WIDTH),o=Scratch.Cast.toNumber(n.DEPTH),s=Scratch.Cast.toString(n.COLOR);this.sendMessageToContainer(t,{type:"ADD_WATER",modelId:i,x:r,y:u,z:f,width:e,depth:o,color:s})}setFog(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.ENABLED)==="开启",r=Scratch.Cast.toNumber(n.DENSITY),u=Scratch.Cast.toString(n.COLOR);this.sendMessageToContainer(t,{type:"SET_FOG",enabled:i,density:r,color:u})}setFogDensity(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toNumber(n.DENSITY);this.sendMessageToContainer(t,{type:"SET_FOG_DENSITY",density:i})}setFogColor(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.COLOR);this.sendMessageToContainer(t,{type:"SET_FOG_COLOR",color:i})}setFogLightAbsorption(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toNumber(n.ABSORPTION);this.sendMessageToContainer(t,{type:"SET_FOG_LIGHT_ABSORPTION",absorption:i})}setSkyboxEnabled(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.ENABLED)==="开启";this.sendMessageToContainer(t,{type:"SET_SKYBOX_ENABLED",enabled:i})}setSkyboxType(n){const r=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.TYPE);let t="spherical";i==="球形天空盒"?t="spherical":i==="方形天空盒"&&(t="box");this.sendMessageToContainer(r,{type:"SET_SKYBOX_TYPE",skyboxType:t})}setSkyboxColor(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.COLOR);this.sendMessageToContainer(t,{type:"SET_SKYBOX_COLOR",color:i})}setSkyboxTexture(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.TEXTURE_ID);this.sendMessageToContainer(t,{type:"SET_SKYBOX_TEXTURE",textureId:i})}setSkyboxTextureType(n){const r=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.TEXTURE_TYPE);let t="equirectangular";i==="四边形贴图"?t="equirectangular":i==="方块展开贴图"?t="cube":i==="长条形球形建模贴图"&&(t="cylindrical");this.sendMessageToContainer(r,{type:"SET_SKYBOX_TEXTURE_TYPE",textureType:t})}setupMessageListener(){window.addEventListener("message",n=>{const t=n.data;if(t.type==="MODEL_PROPERTY_RESPONSE"){const{containerId:i,modelId:r,property:u,value:f}=t,n=`${i}_${r}_${u}`;if(this.propertyCallbacks.has(n)){const t=this.propertyCallbacks.get(n);t(f);this.propertyCallbacks.delete(n)}}else if(t.type==="CAMERA_PROPERTY_RESPONSE"){const{containerId:i,property:r,value:u}=t,n=`${i}_camera_${r}`;if(this.propertyCallbacks.has(n)){const t=this.propertyCallbacks.get(n);t(u);this.propertyCallbacks.delete(n)}}else if(t.type==="COLLISION_RESPONSE"){const{containerId:i,modelId:r,collidedModels:u}=t,n=`${i}_${r}_collisions`;if(this.propertyCallbacks.has(n)){const t=this.propertyCallbacks.get(n);t(JSON.stringify(u));this.propertyCallbacks.delete(n)}}else if(t.type==="ADVANCED_COLLISION_RESPONSE"){const{containerId:i,modelId:r,targetId:u,result:f}=t,n=`${i}_advanced_collision_${r}_${u}`;if(this.propertyCallbacks.has(n)){const t=this.propertyCallbacks.get(n);t(JSON.stringify(f));this.propertyCallbacks.delete(n)}}else if(t.type==="SET_MODEL_COLOR_RESPONSE"){const{containerId:i,modelId:r,success:u}=t,n=`${i}_${r}_color`;if(this.propertyCallbacks.has(n)){const t=this.propertyCallbacks.get(n);t(u);this.propertyCallbacks.delete(n)}}else if(t.type==="MODEL_ANIMATIONS_RESPONSE"){const{containerId:i,modelId:r,animations:u}=t,n=`${i}_${r}_animations`;if(this.propertyCallbacks.has(n)){const t=this.propertyCallbacks.get(n);t(JSON.stringify(u));this.propertyCallbacks.delete(n)}}else if(t.type==="SKYBOX_SETTINGS_RESPONSE"){const{containerId:i,success:r}=t,n=`${i}_skybox_settings`;if(this.propertyCallbacks.has(n)){const t=this.propertyCallbacks.get(n);t(r);this.propertyCallbacks.delete(n)}}else if(t.type==="FILTER_SETTINGS_RESPONSE"){const{containerId:i,success:r}=t,n=`${i}_filter_settings`;if(this.propertyCallbacks.has(n)){const t=this.propertyCallbacks.get(n);t(r);this.propertyCallbacks.delete(n)}}else if(t.type==="PHYSICS_SETTINGS_RESPONSE"){const{containerId:n,modelId:i,operation:r,success:u}=t;if(r==="APPLY_FORCE"){const t=`${n}_${i}_force_apply`;if(this.propertyCallbacks.has(t)){const n=this.propertyCallbacks.get(t);n(u);this.propertyCallbacks.delete(t)}}else if(r==="SET_MODEL_VELOCITY"){const t=`${n}_${i}_velocity_set`;if(this.propertyCallbacks.has(t)){const n=this.propertyCallbacks.get(t);n(u);this.propertyCallbacks.delete(t)}}else if(r==="SET_MODEL_STATIC"){const t=`${n}_${i}_static_set`;if(this.propertyCallbacks.has(t)){const n=this.propertyCallbacks.get(t);n(u);this.propertyCallbacks.delete(t)}}}else if(t.type==="MODEL_PHYSICS_INFO_RESPONSE"){const{containerId:i,modelId:r,property:u,value:f}=t,n=`${i}_${r}_physics_${u}`;if(this.propertyCallbacks.has(n)){const t=this.propertyCallbacks.get(n);t(f);this.propertyCallbacks.delete(n)}}else if(t.type==="MODEL_ATTACHMENT_RESPONSE"){const{containerId:n,childModelId:i,parentModelId:r,operation:u,success:f}=t;if(u==="ATTACH"){const t=`${n}_${i}_attach_${r}`;if(this.propertyCallbacks.has(t)){const n=this.propertyCallbacks.get(t);n(f);this.propertyCallbacks.delete(t)}}else if(u==="DETACH"){const t=`${n}_${i}_detach_${r}`;if(this.propertyCallbacks.has(t)){const n=this.propertyCallbacks.get(t);n(f);this.propertyCallbacks.delete(t)}}}else if(t.type==="TORQUE_RESPONSE"){const{containerId:i,modelId:r,success:u}=t,n=`${i}_${r}_torque_apply`;if(this.propertyCallbacks.has(n)){const t=this.propertyCallbacks.get(n);t(u);this.propertyCallbacks.delete(n)}}else if(t.type==="MODEL_STATE_UPDATE"){const{containerId:n,modelStates:i}=t;this.modelStateCache||(this.modelStateCache=new Map);this.modelStateCache.has(n)||this.modelStateCache.set(n,new Map);const r=this.modelStateCache.get(n);for(const[t,n]of Object.entries(i))r.set(t,{position:n.position,rotation:n.rotation,velocity:n.velocity,angularVelocity:n.angularVelocity,timestamp:Date.now()})}})}setPostProcessingFilter(n){const r=Scratch.Cast.toString(n.ID),t=Scratch.Cast.toString(n.FILTER_TYPE),u=Scratch.Cast.toNumber(n.INTENSITY);let i="none";i=t==="原画"?"none":t==="灰度"?"grayscale":t==="复古"?"vintage":t==="棕褐色"?"sepia":t==="黑金"?"blackgold":t==="鲜艳"?"vivid":t==="褪色"?"faded":t==="电影"?"cinematic":t==="老电视机"?"oldtv":t==="漫画"?"comic":t==="素描"?"sketch":"none";this.sendMessageToContainer(r,{type:"SET_POST_PROCESSING_FILTER",filterType:i,intensity:u})}setFilterIntensity(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toNumber(n.INTENSITY);this.sendMessageToContainer(t,{type:"SET_FILTER_INTENSITY",intensity:i})}disableFilter(n){const t=Scratch.Cast.toString(n.ID);this.sendMessageToContainer(t,{type:"DISABLE_FILTER"})}createContainer(n){const r=Scratch.Cast.toString(n.ID);this.deleteContainer({ID:r});const t=document.createElement("div");t.id=`threed-container-${r}`;t.style.position="absolute";t.style.width="480px";t.style.height="360px";t.style.overflow="hidden";t.style.borderRadius="0";t.style.background="transparent";this.updateContainerPosition(r,0,0);const i=document.createElement("iframe");i.style.width="100%";i.style.height="100%";i.style.border="none";i.style.background="transparent";i.setAttribute("sandbox","allow-same-origin allow-scripts");i.setAttribute("allowtransparency","true");i.setAttribute("srcdoc",this.get3DHTML(r));t.appendChild(i);const u=Scratch.renderer.addOverlay(t,"scale-centered");return this.containers.set(r,{container:t,iframe:i,overlay:u,x:0,y:0,width:480,height:360}),i.onload=()=>{setTimeout(()=>{this.textureCache.forEach((n,t)=>{this.sendMessageToContainer(r,{type:"LOAD_TEXTURE",textureId:t,imageData:n})}),this.sendMessageToContainer(r,{type:"SET_BACKGROUND",style:"天空蓝"}),this.sendMessageToContainer(r,{type:"SET_COORDINATE_SYSTEM",visible:!0}),this.sendMessageToContainer(r,{type:"SET_AMBIENT_LIGHT",enabled:!0,intensity:.6,color:"#FFFFFF"})},100)},t}get3DHTML(n="default"){return`<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
        canvas { display: block; width: 100%; height: 100%; }
        #scene3d { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
    </style>
    <script src="https://unpkg.com/three@0.128.0/build/three.min.js"></script>
    <script src="https://pan.axxpan.top/api/v3/file/get/70938/GLTFLoader.js?sign=ZBRJ3AgxC7tI6D4B6tnO0u9aqQOLIzuutH9gqPM0MMc%3D%3A0"></script>
    <script src="https://pan.axxpan.top/api/v3/file/get/70937/OBJLoader.js?sign=7LA0mRUcEnzFw65TAw7pK74rW9VI-f_Vm1PLKhANkcE%3D%3A0"></script>
    <script src="https://pan.axxpan.top/api/v3/file/get/70954/EffectComposer.js?sign=NGIKCh-tRxhINmXyD0QPbzbttEm-w_bqMt-Mfj4gZu0%3D%3A0"></script>
    <script src="https://pan.axxpan.top/api/v3/file/get/70955/RenderPass.js?sign=BOWb_zXrzNgkuDfTbPwjdYwTcxrf9yCAJ22L-UO6WQY%3D%3A0"></script>
    <script src="https://pan.axxpan.top/api/v3/file/get/70953/ShaderPass.js?sign=ilvXvENALhlKWH1lUKG3qybOH6DT5UkfdmTHp5dB2wQ%3D%3A0"></script>
    <script src="https://pan.axxpan.top/api/v3/file/get/70957/CopyShader.js?sign=emZ1t2zy1gp02V3ex8gg5ZKk0jF6ztqXX3rRnY36e5Q%3D%3A0"></script>
    <script src="https://pan.axxpan.top/api/v3/file/get/70952/LuminosityHighPassShader.js?sign=BsBzj3-DeUZuHQOrI1hgOpRK80j_bPBreD85cXL8KMc%3D%3A0"></script>
    <script src="https://pan.axxpan.top/api/v3/file/get/70956/UnrealBloomPass.js?sign=Uz8IAXxnRlOKRjAnNUluZ3yaPg3PKtCk6owZO9t4ezk%3D%3A0"></script>
    <script src="https://pan.axxpan.top/api/v3/file/get/70961/cannon.min.js?sign=T3km7U3ECO0UnmPtwxR-Fv5KBQExMxnvAiRuh_BuKAY%3D%3A0"></script>
</head>
<body>
    <div id="scene3d"></div>
    
    <script>
        // 动态加载Cannon.js物理引擎库（确保可用）
        function loadCannonJS() {
            return new Promise((resolve, reject) => {
                if (typeof CANNON !== 'undefined') {
                    resolve(CANNON);
                    return;
                }
                
                const script = document.createElement('script');
                script.src = 'https://pan.axxpan.top/api/v3/file/get/70961/cannon.min.js?sign=T3km7U3ECO0UnmPtwxR-Fv5KBQExMxnvAiRuh_BuKAY%3D%3A0';
                script.onload = () => {
                    console.log('Cannon.js物理引擎加载成功');
                    resolve(CANNON);
                };
                script.onerror = () => {
                    console.error('Cannon.js物理引擎加载失败');
                    reject(new Error('无法加载Cannon.js物理引擎'));
                };
                document.head.appendChild(script);
            });
        }

        // 3D场景全局变量
        let scene, camera, renderer;
        let objects = new Map();
        let lights = new Map();
        let particles = new Map();
        let textures = new Map();
        let container = document.getElementById('scene3d');
        let shadowsEnabled = false;
        let shadowRange = 500;
        let renderQuality = 0.6;
        let ambientLight = null;
        let coordinateSystem = null;
        let transparencyThreshold = 0.3;
        
        // 容器ID和状态同步系统
        const CONTAINER_ID = '${n}';
        let modelStateSync = {
            enabled: true,
            updateInterval: 60, // 每60帧发送一次状态更新
            frameCounter: 0,
            lastStates: new Map(), // 缓存上次状态，避免重复发送
            
            // 检查模型状态是否发生变化
            hasStateChanged: function(modelId, currentState) {
                const lastState = this.lastStates.get(modelId);
                if (!lastState) return true;
                
                // 检查位置变化（阈值0.01）
                if (Math.abs(currentState.position.x - lastState.position.x) > 0.01 ||
                    Math.abs(currentState.position.y - lastState.position.y) > 0.01 ||
                    Math.abs(currentState.position.z - lastState.position.z) > 0.01) {
                    return true;
                }
                
                // 检查旋转变化（阈值0.01弧度）
                if (Math.abs(currentState.rotation.x - lastState.rotation.x) > 0.01 ||
                    Math.abs(currentState.rotation.y - lastState.rotation.y) > 0.01 ||
                    Math.abs(currentState.rotation.z - lastState.rotation.z) > 0.01) {
                    return true;
                }
                
                return false;
            },
            
            // 发送模型状态更新
            sendStateUpdate: function() {
                if (!this.enabled || objects.size === 0) return;
                
                const updates = [];
                objects.forEach((obj, modelId) => {
                    if (obj && obj.position && obj.rotation) {
                        const currentState = {
                            position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
                            rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z }
                        };
                        
                        if (this.hasStateChanged(modelId, currentState)) {
                            updates.push({
                                modelId: modelId,
                                position: currentState.position,
                                rotation: currentState.rotation
                            });
                            this.lastStates.set(modelId, currentState);
                        }
                    }
                });
                
                if (updates.length > 0) {
                    window.parent.postMessage({
                        type: 'MODEL_STATE_UPDATE',
                        containerId: CONTAINER_ID,
                        updates: updates
                    }, '*');
                }
            },
            
            // 在渲染循环中调用
            tick: function() {
                this.frameCounter++;
                if (this.frameCounter >= this.updateInterval) {
                    this.frameCounter = 0;
                    this.sendStateUpdate();
                }
            }
        };
        
        // 环境反射系统
        let cubeCamera = null;
        let cubeRenderTarget = null;
        let environmentMap = null;
        let reflectionUpdateInterval = 120; // 每30帧更新一次环境贴图（提高更新频率）
        let frameCountSinceLastReflectionUpdate = 0;
        let waterObjectsNeedingReflectionUpdate = new Set(); // 需要更新反射的水面对象
        let lastReflectionUpdateTime = 0;
        let reflectionUpdatePerformance = { lastUpdateTime: 0, averageUpdateTime: 0, updateCount: 0 };
        let reflectionEnabled = true; // 反射开关，默认开启
        // 反射优化：使用PMREM与相机移动阈值进行按需更新
        let pmremGenerator = null;
        let pmremEnvironment = null;
        let lastReflectionCameraPosition = new THREE.Vector3();
        let lastReflectionCameraRotation = new THREE.Euler(0, 0, 0, 'YXZ');
        let reflectionCameraMoveThreshold = 5; // 相机移动超过该距离触发更新
        let reflectionCameraRotateThreshold = -0.01; // 相机旋转超过该弧度触发更新
        // 反射层数限制与后台恢复节流
        let maxReflectionLayers = 2; // 最多反射两层，避免递归导致颜色损坏
        let backgroundRecoveryFrames = 0; // 后台恢复时跳过若干帧的重负载更新
        const backgroundDeltaThreshold = 0.4; // 超过该帧间隔认为进入后台/卡顿恢复
        const recoverySkipHeavyFrames = 45; // 恢复期间跳过的重负载帧数
        let pageHidden = false;
        // 可选：监听可见性变化（在非HTML环境下安全降级）
        if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
            document.addEventListener('visibilitychange', () => {
                pageHidden = !!document.hidden;
                if (pageHidden) {
                    backgroundRecoveryFrames = recoverySkipHeavyFrames;
                }
            });
        }
        
        // 雾气系统
        let fogEnabled = false;
        let fogDensity = 0.01;
        let fogColor = 0x87CEEB;
        let fogLightAbsorption = 0.1;
        
        // 动画系统
        let animationMixer = new Map();  // 存储每个模型的动画混合器
        let animations = new Map();       // 存储每个模型的动画剪辑
        let activeAnimations = new Map(); // 存储当前活动的动画
        let animationTransitions = new Map(); // 存储每个模型的过渡时间设置
        let clock = new THREE.Clock();    // 用于动画时间计算
        let frameCount = 0;               // 帧计数器，用于定期更新边界框
        
        // 天空盒系统
        let skyboxEnabled = false;
        let skyboxType = 'spherical'; // 'spherical' 或 'cubical'
        let skyboxColor = new THREE.Color(0x87CEEB);
        let skyboxTexture = null;
        let skyboxMesh = null;
        let skyboxTextureType = 'equirectangular'; // 'equirectangular'、'cube'、'cylindrical'
        
        // 光晕效果系统
        let bloomEnabled = false;
        let bloomStrength = 1.0;
        let bloomThreshold = 0.6;
        let bloomRadius = 0.4;
        let bloomComposer = null;
        let renderTarget = null;
        let bloomPass = null;
        
        // 初始化光晕效果
        function initBloomEffect() {
            if (!renderer) return;
            
            try {
                // 检查必要的Three.js后处理类是否可用
                if (typeof THREE.EffectComposer === 'undefined' || 
                    typeof THREE.RenderPass === 'undefined' ||
                    typeof THREE.UnrealBloomPass === 'undefined' ||
                    typeof THREE.ShaderPass === 'undefined' ||
                    typeof THREE.CopyShader === 'undefined' ||
                    typeof THREE.LuminosityHighPassShader === 'undefined') {
                    console.warn('光晕效果依赖库未完全加载，跳过光晕效果初始化');
                    bloomEnabled = false;
                    return;
                }
                
                // 创建渲染目标
                renderTarget = new THREE.WebGLRenderTarget(
                    container.clientWidth,
                    container.clientHeight,
                    {
                        minFilter: THREE.LinearFilter,
                        magFilter: THREE.LinearFilter,
                        format: THREE.RGBAFormat,
                        stencilBuffer: false
                    }
                );
                
                // 创建后处理合成器
                bloomComposer = new THREE.EffectComposer(renderer, renderTarget);
                
                // 添加渲染通道
                const renderPass = new THREE.RenderPass(scene, camera);
                bloomComposer.addPass(renderPass);
                
                // 创建光晕通道
                bloomPass = new THREE.UnrealBloomPass(
                    new THREE.Vector2(container.clientWidth, container.clientHeight),
                    bloomStrength,
                    bloomRadius,
                    bloomThreshold
                );
                bloomComposer.addPass(bloomPass);
                
                // 设置光晕参数
                updateBloomParameters();
                
                console.log('光晕效果系统初始化成功');
            } catch (error) {
                console.error('光晕效果初始化失败:', error);
                bloomEnabled = false;
                bloomComposer = null;
                bloomPass = null;
                renderTarget = null;
            }
        }
        
        // 更新光晕参数
        function updateBloomParameters() {
            if (!bloomPass) return;
            
            bloomPass.strength = bloomStrength;
            bloomPass.radius = bloomRadius;
            bloomPass.threshold = bloomThreshold;
        }
        
        // 设置光晕效果
        function setBloomEffect(enabled, strength, threshold, radius) {
            bloomEnabled = enabled;
            bloomStrength = strength;
            bloomThreshold = threshold;
            bloomRadius = radius;
            
            updateBloomParameters();
        }
        
        // 滤镜系统
        let filterComposer = null;
        let filterPass = null;
        let currentFilter = null;
        let filterIntensity = 1.0;
        
        // 初始化滤镜系统
        function initFilterSystem() {
            if (!renderer) return;
            
            try {
                // 检查必要的Three.js后处理类是否可用
                if (typeof THREE.EffectComposer === 'undefined' || 
                    typeof THREE.RenderPass === 'undefined' ||
                    typeof THREE.ShaderPass === 'undefined') {
                    console.warn('滤镜系统依赖库未完全加载，跳过滤镜系统初始化');
                    return;
                }
                
                // 创建滤镜合成器
                filterComposer = new THREE.EffectComposer(renderer);
                
                // 添加渲染通道
                const renderPass = new THREE.RenderPass(scene, camera);
                filterComposer.addPass(renderPass);
                
                console.log('滤镜系统初始化成功');
            } catch (error) {
                console.error('滤镜系统初始化失败:', error);
                filterComposer = null;
            }
        }
        
        // 设置滤镜
        function setFilter(filterType, intensity = 1.0) {
            if (!filterComposer) {
                console.warn('滤镜系统未初始化，无法设置滤镜');
                return;
            }
            
            // 移除现有的滤镜通道
            if (filterPass) {
                filterComposer.removePass(filterPass);
                filterPass = null;
            }
            
            currentFilter = filterType;
            filterIntensity = intensity;
            
            // 将中文滤镜名称映射到英文名称
            let englishFilterType = filterType;
            switch(filterType) {
                case '原画':
                    englishFilterType = 'none';
                    break;
                case '灰度':
                    englishFilterType = 'grayscale';
                    break;
                case '复古':
                    englishFilterType = 'vintage';
                    break;
                case '棕褐色':
                    englishFilterType = 'sepia';
                    break;
                case '黑金':
                    englishFilterType = 'blackgold';
                    break;
                case '鲜艳':
                    englishFilterType = 'vivid';
                    break;
                case '褪色':
                    englishFilterType = 'faded';
                    break;
                case '电影':
                    englishFilterType = 'cinematic';
                    break;
                case '老电视机':
                    englishFilterType = 'oldtv';
                    break;
                case '漫画':
                    englishFilterType = 'comic';
                    break;
                case '素描':
                    englishFilterType = 'sketch';
                    break;
            }
            
            // 根据滤镜类型创建对应的着色器通道
            switch(englishFilterType) {
                case 'sepia':
                    filterPass = createSepiaFilter(intensity);
                    break;
                case 'grayscale':
                    filterPass = createGrayscaleFilter(intensity);
                    break;
                case 'vintage':
                    filterPass = createVintageFilter(intensity);
                    break;
                case 'blackgold':
                    filterPass = createBlackGoldFilter(intensity);
                    break;
                case 'vivid':
                    filterPass = createVividFilter(intensity);
                    break;
                case 'faded':
                    filterPass = createFadedFilter(intensity);
                    break;
                case 'cinematic':
                    filterPass = createCinematicFilter(intensity);
                    break;
                case 'oldtv':
                    filterPass = createOldTVFilter(intensity);
                    break;
                case 'comic':
                    filterPass = createComicFilter(intensity);
                    break;
                case 'sketch':
                    filterPass = createSketchFilter(intensity);
                    break;
                case 'none':
                default:
                    // 无滤镜，直接返回
                    currentFilter = null;
                    return;
            }
            
            if (filterPass) {
                filterComposer.addPass(filterPass);
                console.log("滤镜已设置为: " + filterType + ", 强度: " + intensity);
            }
        }
        
        // 禁用滤镜
        function disableFilter() {
            if (filterPass) {
                filterComposer.removePass(filterPass);
                filterPass = null;
            }
            currentFilter = null;
            console.log('滤镜已禁用');
        }
        
        // 创建棕褐色滤镜
        function createSepiaFilter(intensity) {
            const sepiaShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    amount: { value: intensity }
                },
                vertexShader: \`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                \`,
                fragmentShader: \`
                    uniform sampler2D tDiffuse;
                    uniform float amount;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 color = texture2D(tDiffuse, vUv);
                        float r = color.r;
                        float g = color.g;
                        float b = color.b;
                        
                        color.r = min(1.0, (r * (1.0 - (0.607 * amount))) + (g * (0.769 * amount)) + (b * (0.189 * amount)));
                        color.g = min(1.0, (r * (0.349 * amount)) + (g * (1.0 - (0.314 * amount))) + (b * (0.168 * amount)));
                        color.b = min(1.0, (r * (0.272 * amount)) + (g * (0.534 * amount)) + (b * (1.0 - (0.869 * amount))));
                        
                        gl_FragColor = vec4(color.rgb, color.a);
                    }
                \`
            };
            
            return new THREE.ShaderPass(sepiaShader);
        }
        
        // 创建灰度滤镜
        function createGrayscaleFilter(intensity) {
            const grayscaleShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    amount: { value: intensity }
                },
                vertexShader: \`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                \`,
                fragmentShader: \`
                    uniform sampler2D tDiffuse;
                    uniform float amount;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 color = texture2D(tDiffuse, vUv);
                        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                        vec3 grayscale = vec3(gray);
                        vec3 result = mix(color.rgb, grayscale, amount);
                        gl_FragColor = vec4(result, color.a);
                    }
                \`
            };
            
            return new THREE.ShaderPass(grayscaleShader);
        }
        
        // 创建复古滤镜
        function createVintageFilter(intensity) {
            const vintageShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    amount: { value: intensity }
                },
                vertexShader: \`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                \`,
                fragmentShader: \`
                    uniform sampler2D tDiffuse;
                    uniform float amount;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 color = texture2D(tDiffuse, vUv);
                        
                        // 增加暖色调
                        color.r *= 1.1;
                        color.g *= 0.95;
                        color.b *= 0.9;
                        
                        // 添加轻微对比度
                        color.rgb = (color.rgb - 0.5) * (1.0 + amount * 0.3) + 0.5;
                        
                        // 添加轻微饱和度
                        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                        color.rgb = mix(vec3(gray), color.rgb, 1.0 + amount * 0.2);
                        
                        gl_FragColor = vec4(color.rgb, color.a);
                    }
                \`
            };
            
            return new THREE.ShaderPass(vintageShader);
        }
        
        // 创建黑金滤镜
        function createBlackGoldFilter(intensity) {
            const blackGoldShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    amount: { value: intensity }
                },
                vertexShader: \`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                \`,
                fragmentShader: \`
                    uniform sampler2D tDiffuse;
                    uniform float amount;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 color = texture2D(tDiffuse, vUv);
                        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                        
                        // 黑金效果：黑色背景 + 金色高光
                        vec3 blackGold = vec3(gray * 0.1, gray * 0.8, gray * 0.1);
                        vec3 result = mix(color.rgb, blackGold, amount);
                        
                        // 增强对比度
                        result = (result - 0.5) * (1.0 + amount * 0.5) + 0.5;
                        
                        gl_FragColor = vec4(result, color.a);
                    }
                \`
            };
            
            return new THREE.ShaderPass(blackGoldShader);
        }
        
        // 创建鲜艳滤镜
        function createVividFilter(intensity) {
            const vividShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    amount: { value: intensity }
                },
                vertexShader: \`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                \`,
                fragmentShader: \`
                    uniform sampler2D tDiffuse;
                    uniform float amount;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 color = texture2D(tDiffuse, vUv);
                        
                        // 增强饱和度
                        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                        vec3 saturated = mix(vec3(gray), color.rgb, 1.0 + amount * 0.8);
                        
                        // 增强对比度
                        saturated = (saturated - 0.5) * (1.0 + amount * 0.4) + 0.5;
                        
                        // 轻微提高亮度
                        saturated *= 1.0 + amount * 0.2;
                        
                        gl_FragColor = vec4(saturated, color.a);
                    }
                \`
            };
            
            return new THREE.ShaderPass(vividShader);
        }
        
        // 创建褪色滤镜
        function createFadedFilter(intensity) {
            const fadedShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    amount: { value: intensity }
                },
                vertexShader: \`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                \`,
                fragmentShader: \`
                    uniform sampler2D tDiffuse;
                    uniform float amount;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 color = texture2D(tDiffuse, vUv);
                        
                        // 降低饱和度
                        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                        vec3 desaturated = mix(color.rgb, vec3(gray), amount * 0.7);
                        
                        // 降低对比度
                        desaturated = mix(desaturated, vec3(0.5), amount * 0.3);
                        
                        // 添加轻微泛白效果
                        desaturated = mix(desaturated, vec3(1.0), amount * 0.1);
                        
                        gl_FragColor = vec4(desaturated, color.a);
                    }
                \`
            };
            
            return new THREE.ShaderPass(fadedShader);
        }
        
        // 创建电影滤镜
        function createCinematicFilter(intensity) {
            const cinematicShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    amount: { value: intensity },
                    time: { value: 0.0 }
                },
                vertexShader: \`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                \`,
                fragmentShader: \`
                    uniform sampler2D tDiffuse;
                    uniform float amount;
                    uniform float time;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 color = texture2D(tDiffuse, vUv);
                        
                        // 电影色调：降低蓝色，增强暖色
                        color.r *= 1.1;
                        color.g *= 1.05;
                        color.b *= 0.9;
                        
                        // 增强对比度
                        color.rgb = (color.rgb - 0.5) * (1.0 + amount * 0.6) + 0.5;
                        
                        // 添加轻微颗粒感（电影胶片效果）
                        float grain = fract(sin(dot(vUv + time, vec2(12.9898, 78.233))) * 43758.5453);
                        color.rgb += (grain - 0.5) * amount * 0.02;
                        
                        gl_FragColor = vec4(color.rgb, color.a);
                    }
                \`
            };
            
            const pass = new THREE.ShaderPass(cinematicShader);
            // 添加时间动画
            pass.material.uniforms.time.value = 0;
            const animate = () => {
                pass.material.uniforms.time.value += 0.01;
                requestAnimationFrame(animate);
            };
            animate();
            
            return pass;
        }
        
        // 创建老电视机滤镜
        function createOldTVFilter(intensity) {
            const oldTVShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    amount: { value: intensity },
                    time: { value: 0.0 },
                    resolution: { value: new THREE.Vector2(1, 1) }
                },
                vertexShader: \`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                \`,
                fragmentShader: \`
                    uniform sampler2D tDiffuse;
                    uniform float amount;
                    uniform float time;
                    uniform vec2 resolution;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 color = texture2D(tDiffuse, vUv);
                        
                        // 降低饱和度（老电视色彩）
                        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                        vec3 oldTV = mix(color.rgb, vec3(gray), amount * 0.5);
                        
                        // 添加扫描线效果
                        float scanLine = sin(vUv.y * resolution.y * 3.14159 * 2.0) * 0.1 + 0.9;
                        oldTV *= scanLine;
                        
                        // 添加轻微噪点
                        float noise = fract(sin(dot(vUv + time, vec2(12.9898, 78.233))) * 43758.5453);
                        oldTV += (noise - 0.5) * amount * 0.05;
                        
                        // 添加轻微模糊（老电视分辨率低）
                        vec2 pixelSize = 1.0 / resolution;
                        vec4 blurColor = texture2D(tDiffuse, vUv + pixelSize * 0.5) * 0.25;
                        blurColor += texture2D(tDiffuse, vUv - pixelSize * 0.5) * 0.25;
                        blurColor += texture2D(tDiffuse, vUv + vec2(pixelSize.x, -pixelSize.y) * 0.5) * 0.25;
                        blurColor += texture2D(tDiffuse, vUv - vec2(pixelSize.x, -pixelSize.y) * 0.5) * 0.25;
                        
                        oldTV = mix(oldTV, blurColor.rgb, amount * 0.3);
                        
                        gl_FragColor = vec4(oldTV, color.a);
                    }
                \`
            };
            
            const pass = new THREE.ShaderPass(oldTVShader);
            pass.material.uniforms.time.value = 0;
            pass.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
            
            // 添加时间动画和分辨率更新
            const animate = () => {
                pass.material.uniforms.time.value += 0.02;
                requestAnimationFrame(animate);
            };
            animate();
            
            // 窗口大小改变时更新分辨率
            window.addEventListener('resize', () => {
                pass.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
            });
            
            return pass;
        }
        
        // 创建漫画滤镜（三渲二风格）
        function createComicFilter(intensity) {
            const comicShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    amount: { value: intensity },
                    resolution: { value: new THREE.Vector2(1, 1) }
                },
                vertexShader: \`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                \`,
                fragmentShader: \`
                    uniform sampler2D tDiffuse;
                    uniform float amount;
                    uniform vec2 resolution;
                    varying vec2 vUv;
                    
                    // 柔和颜色量化函数
                    vec3 softQuantize(vec3 color, float levels) {
                        return floor(color * levels + 0.5) / levels;
                    }
                    
                    // 自然饱和度调整
                    vec3 adjustSaturation(vec3 color, float saturation) {
                        float gray = dot(color, vec3(0.299, 0.587, 0.114));
                        return mix(vec3(gray), color, saturation);
                    }
                    
                    void main() {
                        vec4 originalColor = texture2D(tDiffuse, vUv);
                        
                        // 边缘检测（使用更柔和的灰度转换）
                        vec2 pixelSize = 1.0 / resolution;
                        float edge = 0.0;
                        
                        // Sobel边缘检测 - 使用更精确的亮度计算
                        float topLeft = dot(texture2D(tDiffuse, vUv + vec2(-pixelSize.x, pixelSize.y)).rgb, vec3(0.299, 0.587, 0.114));
                        float top = dot(texture2D(tDiffuse, vUv + vec2(0.0, pixelSize.y)).rgb, vec3(0.299, 0.587, 0.114));
                        float topRight = dot(texture2D(tDiffuse, vUv + vec2(pixelSize.x, pixelSize.y)).rgb, vec3(0.299, 0.587, 0.114));
                        float left = dot(texture2D(tDiffuse, vUv + vec2(-pixelSize.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
                        float right = dot(texture2D(tDiffuse, vUv + vec2(pixelSize.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
                        float bottomLeft = dot(texture2D(tDiffuse, vUv + vec2(-pixelSize.x, -pixelSize.y)).rgb, vec3(0.299, 0.587, 0.114));
                        float bottom = dot(texture2D(tDiffuse, vUv + vec2(0.0, -pixelSize.y)).rgb, vec3(0.299, 0.587, 0.114));
                        float bottomRight = dot(texture2D(tDiffuse, vUv + vec2(pixelSize.x, -pixelSize.y)).rgb, vec3(0.299, 0.587, 0.114));
                        
                        float gx = -topLeft - 2.0 * left - bottomLeft + topRight + 2.0 * right + bottomRight;
                        float gy = -topLeft - 2.0 * top - topRight + bottomLeft + 2.0 * bottom + bottomRight;
                        
                        edge = sqrt(gx * gx + gy * gy);
                        
                        // 改进的颜色处理流程
                        vec3 processedColor = originalColor.rgb;
                        
                        // 1. 轻微的颜色量化（使用更多级别保持平滑）
                        processedColor = softQuantize(processedColor, 12.0); // 从8级增加到12级
                        
                        // 2. 轻微降低饱和度，让颜色更自然
                        processedColor = adjustSaturation(processedColor, 0.85); // 轻微降低饱和度
                        
                        // 3. 柔和对比度增强
                        processedColor = pow(processedColor, vec3(0.95)); // 轻微对比度调整
                        
                        // 4. 限制颜色范围，保持自然感
                        processedColor = clamp(processedColor, 0.05, 0.95); // 避免纯黑纯白
                        
                        // 更柔和的边缘描边
                        float edgeStrength = smoothstep(0.08, 0.25, edge); // 调整阈值让描边更自然
                        vec3 finalColor = mix(processedColor, vec3(0.0), edgeStrength * amount * 0.7); // 降低描边强度
                        
                        // 最终颜色微调，添加轻微的色彩平衡
                        finalColor = pow(finalColor, vec3(1.0 / 1.1)); // 轻微伽马校正
                        
                        gl_FragColor = vec4(finalColor, originalColor.a);
                    }
                \`
            };
            
            const pass = new THREE.ShaderPass(comicShader);
            pass.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
            
            window.addEventListener('resize', () => {
                pass.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
            });
            
            return pass;
        }
        
        // 创建素描滤镜
        function createSketchFilter(intensity) {
            const sketchShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    amount: { value: intensity },
                    resolution: { value: new THREE.Vector2(1, 1) }
                },
                vertexShader: \`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                \`,
                fragmentShader: \`
                    uniform sampler2D tDiffuse;
                    uniform float amount;
                    uniform vec2 resolution;
                    varying vec2 vUv;
                    
                    // 改进的素描效果函数
                    float getSketchIntensity(vec2 uv, float baseGray) {
                        vec2 pixelSize = 1.0 / resolution;
                        float total = 0.0;
                        int samples = 0;
                        
                        // 使用更小的采样步长获取更细的线条
                        vec2 smallStep = pixelSize * 0.5;
                        
                        // 多方向梯度检测 - 更细致的线条
                        for (int i = -2; i <= 2; i++) {
                            for (int j = -2; j <= 2; j++) {
                                if (i == 0 && j == 0) continue;
                                
                                vec2 offset = vec2(float(i), float(j)) * smallStep;
                                float sampleGray = dot(texture2D(tDiffuse, uv + offset).rgb, 
                                                    vec3(0.299, 0.587, 0.114));
                                
                                // 计算与中心像素的差异
                                float diff = abs(baseGray - sampleGray);
                                total += diff;
                                samples++;
                            }
                        }
                        
                        // 计算平均差异并应用非线性响应
                        float avgDiff = total / float(samples);
                        
                        // 使用S形曲线让线条更自然
                        float response = 1.0 - smoothstep(0.05, 0.3, avgDiff * 8.0);
                        
                        return response;
                    }
                    
                    void main() {
                        vec4 color = texture2D(tDiffuse, vUv);
                        
                        // 转换为灰度
                        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                        
                        // 获取素描强度 - 使用改进的算法
                        float sketch = getSketchIntensity(vUv, gray);
                        
                        // 添加纸张纹理感
                        float paperNoise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) * 0.1 + 0.9;
                        
                        // 最终素描效果：白色背景 + 自然黑色线条 + 纸张纹理
                        vec3 sketchColor = vec3(sketch * paperNoise);
                        
                        // 轻微的颜色保留（可选，让素描更有艺术感）
                        vec3 finalColor = mix(sketchColor, color.rgb * sketch, 0.1);
                        
                        // 应用强度控制
                        finalColor = mix(color.rgb, finalColor, amount);
                        
                        gl_FragColor = vec4(finalColor, color.a);
                    }
                \`
            };
            
            const pass = new THREE.ShaderPass(sketchShader);
            pass.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
            
            window.addEventListener('resize', () => {
                pass.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
            });
            
            return pass;
        }
        
        // 消息监听器
        window.addEventListener('message', function(event) {
            const data = event.data;
            
            // 处理滤镜设置消息
            if (data.type === 'SET_POST_PROCESSING_FILTER') {
                console.log('接收到滤镜设置消息:', data);
                setFilter(data.filterType, data.intensity || 1.0);
                // 发送滤镜设置响应消息
                window.parent.postMessage({
                    type: 'FILTER_SETTINGS_RESPONSE',
                    success: true
                }, '*');
            } else if (data.type === 'SET_FILTER_INTENSITY') {
                console.log('接收到滤镜强度设置消息:', data);
                if (currentFilter && currentFilter !== 'none') {
                    setFilter(currentFilter, data.intensity || 1.0);
                }
                // 发送滤镜强度设置响应消息
                window.parent.postMessage({
                    type: 'FILTER_SETTINGS_RESPONSE',
                    success: true
                }, '*');
            } else if (data.type === 'DISABLE_FILTER') {
                console.log('接收到禁用滤镜消息');
                disableFilter();
                // 发送滤镜禁用响应消息
                window.parent.postMessage({
                    type: 'FILTER_SETTINGS_RESPONSE',
                    success: true
                }, '*');
            }
            
            // 处理物理引擎消息
            else if (data.type === 'SET_MODEL_PHYSICS') {
                console.log('接收到设置模型物理属性消息:', data);
                // 参数映射: enabled, mass, restitution, friction, isStatic, linearDamping, angularDamping
                setModelPhysics(data.modelId, data.enabled, data.mass || 1, data.restitution || 0.3, 
                               data.friction || 0.5, data.isStatic || false, 
                               data.linearDamping !== undefined ? data.linearDamping : 0.01, 
                               data.angularDamping !== undefined ? data.angularDamping : 0.01)
                    .then(() => {
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: true
                        }, '*');
                    })
                    .catch(error => {
                        console.error('设置模型物理属性失败:', error);
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: false,
                            error: error.message
                        }, '*');
                    });
            } else if (data.type === 'SET_GLOBAL_GRAVITY') {
                console.log('接收到设置全局重力消息:', data);
                setGlobalGravity(data.gravityX, data.gravityY, data.gravityZ)
                    .then(() => {
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: true
                        }, '*');
                    })
                    .catch(error => {
                        console.error('设置全局重力失败:', error);
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: false,
                            error: error.message
                        }, '*');
                    });
            } else if (data.type === 'APPLY_FORCE') {
                console.log('接收到施加力消息:', data);
                // 支持偏移量参数，以便在偏离中心的位置施加力，产生旋转效果
                applyForce(data.modelId, data.forceX, data.forceY, data.forceZ, 
                         data.offsetX || 0, data.offsetY || 0, data.offsetZ || 0)
                    .then(() => {
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: true
                        }, '*');
                    })
                    .catch(error => {
                        console.error('施加力失败:', error);
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: false,
                            error: error.message
                        }, '*');
                    });
            } else if (data.type === 'SET_MODEL_VELOCITY') {
                console.log('接收到设置模型速度消息:', data);
                setModelVelocity(data.modelId, data.velocityX, data.velocityY, data.velocityZ)
                    .then(() => {
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: true
                        }, '*');
                    })
                    .catch(error => {
                        console.error('设置模型速度失败:', error);
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: false,
                            error: error.message
                        }, '*');
                    });
            } else if (data.type === 'SET_MODEL_STATIC') {
                console.log('接收到设置模型静态消息:', data);
                setModelStatic(data.modelId, data.isStatic)
                    .then(() => {
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: true
                        }, '*');
                    })
                    .catch(error => {
                        console.error('设置模型静态失败:', error);
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: false,
                            error: error.message
                        }, '*');
                    });
            } else if (data.type === 'CREATE_PHYSICS_GROUND') {
                console.log('接收到创建物理地面消息:', data);
                createPhysicsGround(data.height, data.bounce, data.friction)
                    .then(() => {
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: true
                        }, '*');
                    })
                    .catch(error => {
                        console.error('创建物理地面失败:', error);
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: false,
                            error: error.message
                        }, '*');
                    });
            } else if (data.type === 'GET_MODEL_PHYSICS_INFO') {
                console.log('接收到获取模型物理信息消息:', data);
                const physicsInfo = getModelPhysicsInfo(data.modelId, data.property);
                window.parent.postMessage({
                    type: 'PHYSICS_INFO_RESPONSE',
                    containerId: data.containerId,
                    modelId: data.modelId,
                    property: data.property,
                    value: physicsInfo
                }, '*');
            } else if (data.type === 'SET_MODEL_DAMPING') {
                console.log('接收到设置模型阻尼消息:', data);
                setModelDamping(data.modelId, data.linearDamping, data.angularDamping)
                    .then(() => {
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: true
                        }, '*');
                    })
                    .catch(error => {
                        console.error('设置模型阻尼失败:', error);
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: false,
                            error: error.message
                        }, '*');
                    });
            } else if (data.type === 'SET_COLLISION_TYPE') {
                console.log('接收到设置碰撞类型消息:', data);
                setModelCollisionType(data.modelId, data.collisionType)
                    .then(() => {
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: true
                        }, '*');
                    })
                    .catch(error => {
                        console.error('设置碰撞类型失败:', error);
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: false,
                            error: error.message
                        }, '*');
                    });
            } else if (data.type === 'SET_COLLISION_BOX_VISIBLE') {
                console.log('接收到设置碰撞箱可见性消息:', data);
                setCollisionBoxVisible(data.modelId, data.visible)
                    .then(() => {
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: true
                        }, '*');
                    })
                    .catch(error => {
                        console.error('设置碰撞箱可见性失败:', error);
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: false,
                            error: error.message
                        }, '*');
                    });
            }
            
            // 处理设置容器物理模拟开关消息
            else if (data.type === 'SET_CONTAINER_PHYSICS') {
                console.log('接收到设置容器物理模拟消息:', data);
                
                // 设置物理引擎的启用状态
                physicsEngine.physicsEnabled = data.enabled;
                
                // 如果启用物理引擎，确保世界已初始化
                if (data.enabled && !physicsEngine.initialized) {
                    physicsEngine.initWorld().then(() => {
                        console.log('物理引擎已启用并初始化完成');
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: true
                        }, '*');
                    }).catch(error => {
                        console.error('物理引擎初始化失败:', error);
                        window.parent.postMessage({
                            type: 'PHYSICS_SETTINGS_RESPONSE',
                            success: false,
                            error: error.message
                        }, '*');
                    });
                } else {
                    console.log('物理引擎状态已设置为:', data.enabled ? '启用' : '禁用');
                    window.parent.postMessage({
                        type: 'PHYSICS_SETTINGS_RESPONSE',
                        success: true
                    }, '*');
                }
            }
            
            // 处理模型固定消息
            else if (data.type === 'ATTACH_MODEL_TO_MODEL') {
                console.log('接收到模型固定消息:', data);
                attachModelToModel(data.childModelId, data.parentModelId, data.rotationCenter)
                    .then(() => {
                        window.parent.postMessage({
                            type: 'MODEL_ATTACHMENT_RESPONSE',
                            operation: 'ATTACH',
                            childModelId: data.childModelId,
                            parentModelId: data.parentModelId,
                            success: true
                        }, '*');
                    })
                    .catch(error => {
                        console.error('模型固定失败:', error);
                        window.parent.postMessage({
                            type: 'MODEL_ATTACHMENT_RESPONSE',
                            operation: 'ATTACH',
                            childModelId: data.childModelId,
                            parentModelId: data.parentModelId,
                            success: false,
                            error: error.message
                        }, '*');
                    });
            }
            
            // 处理模型分离消息
            else if (data.type === 'DETACH_MODEL_FROM_MODEL') {
                console.log('接收到模型分离消息:', data);
                detachModelFromModel(data.childModelId, data.parentModelId)
                    .then(() => {
                        window.parent.postMessage({
                            type: 'MODEL_ATTACHMENT_RESPONSE',
                            operation: 'DETACH',
                            childModelId: data.childModelId,
                            parentModelId: data.parentModelId,
                            success: true
                        }, '*');
                    })
                    .catch(error => {
                        console.error('模型分离失败:', error);
                        window.parent.postMessage({
                            type: 'MODEL_ATTACHMENT_RESPONSE',
                            operation: 'DETACH',
                            childModelId: data.childModelId,
                            parentModelId: data.parentModelId,
                            success: false,
                            error: error.message
                        }, '*');
                    });
            }
            
            // 处理施加旋转力消息
            else if (data.type === 'APPLY_TORQUE') {
                console.log('接收到施加旋转力消息:', data);
                applyTorque(data.modelId, data.torqueX, data.torqueY, data.torqueZ)
                    .then(() => {
                        window.parent.postMessage({
                            type: 'TORQUE_RESPONSE',
                            modelId: data.modelId,
                            success: true
                        }, '*');
                    })
                    .catch(error => {
                        console.error('施加旋转力失败:', error);
                        window.parent.postMessage({
                            type: 'TORQUE_RESPONSE',
                            modelId: data.modelId,
                            success: false,
                            error: error.message
                        }, '*');
                    });
            }
        });
        
        // 像素碰撞系统
        class PixelCollisionSystem {
            constructor() {
                this.textureDataCache = new Map();
            }
            
            async loadTextureData(textureId, imageUrl) {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        const imageData = ctx.getImageData(0, 0, img.width, img.height);
                        this.textureDataCache.set(textureId, imageData);
                        resolve(imageData);
                    };
                    img.src = imageUrl;
                });
            }
            
            checkPixelCollision(obj1, obj2, alphaThreshold = 0.1) {
                if (!obj1.userData.bounds.intersectsBox(obj2.userData.bounds)) {
                    return { collided: false, collisionPoints: [] };
                }
                
                const collisionPoints = [];
                const samples = this.generateCollisionSamples(obj1, obj2);
                
                for (const sample of samples) {
                    const alpha1 = this.getSampleAlpha(obj1, sample.worldPos);
                    const alpha2 = this.getSampleAlpha(obj2, sample.worldPos);
                    
                    if (alpha1 > alphaThreshold && alpha2 > alphaThreshold) {
                        collisionPoints.push({
                            x: sample.worldPos.x,
                            y: sample.worldPos.y, 
                            z: sample.worldPos.z,
                            alpha: Math.min(alpha1, alpha2)
                        });
                    }
                }
                
                return {
                    collided: collisionPoints.length > 0,
                    collisionPoints: collisionPoints
                };
            }
            
            getSampleAlpha(obj, worldPos) {
                if (!obj.userData.hasTexture || !obj.userData.textureId) {
                    return 1.0;
                }
                
                const textureData = this.textureDataCache.get(obj.userData.textureId);
                if (!textureData) return 1.0;
                
                const localPos = worldPos.clone().sub(obj.position);
                const uv = this.calculateUV(obj, localPos);
                return this.getAlphaFromUV(textureData, uv);
            }
            
            getAlphaFromUV(textureData, uv) {
                const x = Math.floor(uv.x * textureData.width) % textureData.width;
                const y = Math.floor(uv.y * textureData.height) % textureData.height;
                const index = (y * textureData.width + x) * 4;
                return textureData.data[index + 3] / 255;
            }
            
            calculateUV(obj, localPos) {
                return new THREE.Vector2(
                    (localPos.x / obj.userData.originalSize.width + 0.5) % 1,
                    (localPos.y / obj.userData.originalSize.height + 0.5) % 1
                );
            }
            
            generateCollisionSamples(obj1, obj2) {
                const samples = [];
                const bounds1 = obj1.userData.bounds;
                const bounds2 = obj2.userData.bounds;
                
                for (let i = 0; i < 10; i++) {
                    const point = new THREE.Vector3(
                        THREE.MathUtils.lerp(bounds1.min.x, bounds1.max.x, Math.random()),
                        THREE.MathUtils.lerp(bounds1.min.y, bounds1.max.y, Math.random()),
                        THREE.MathUtils.lerp(bounds1.min.z, bounds1.max.z, Math.random())
                    );
                    
                    if (bounds2.containsPoint(point)) {
                        samples.push({ worldPos: point });
                    }
                }
                
                return samples;
            }
        }

        const pixelCollisionSystem = new PixelCollisionSystem();

        // Cannon.js物理引擎系统
        class CannonPhysicsEngine {
            constructor() {
                this.world = null;
                this.bodies = new Map();
                this.groundBody = null;
                this.physicsEnabled = false; // 初始化为false，等待异步初始化
                this.timeStep = 1/60;
                this.maxSubSteps = 3;
                this.initialized = false;
                
                // 异步初始化Cannon.js世界
                this.initWorld().then(() => {
                    this.initialized = true;
                    this.physicsEnabled = true;
                    console.log('CannonPhysicsEngine异步初始化完成');
                }).catch(error => {
                    console.error('CannonPhysicsEngine异步初始化失败:', error);
                    this.physicsEnabled = false;
                });
            }
            
            async initWorld() {
                try {
                    const CANNON = await loadCannonJS();
                    
                    // 创建物理世界
                    this.world = new CANNON.World();
                    this.world.gravity.set(0, -9.8, 0);
                    this.world.broadphase = new CANNON.NaiveBroadphase();
                    this.world.solver.iterations = 10;
                    
                    // 设置接触材料
                    this.setupContactMaterials(CANNON);
                    
                    console.log('Cannon.js物理引擎初始化成功');
                } catch (error) {
                    console.error('Cannon.js物理引擎初始化失败:', error);
                    this.physicsEnabled = false;
                }
            }
            
            setupContactMaterials(CANNON) {
                // 创建默认接触材料
                const defaultContactMaterial = new CANNON.ContactMaterial(
                    new CANNON.Material('default'),
                    new CANNON.Material('default'),
                    {
                        friction: 0.8,  // 增加摩擦力，使物体更不容易滑动
                        restitution: 0.1  // 降低恢复系数，减少弹跳
                    }
                );
                this.world.addContactMaterial(defaultContactMaterial);
                this.world.defaultContactMaterial = defaultContactMaterial;
                
                // 设置全局碰撞检测参数
                this.world.broadphase = new CANNON.NaiveBroadphase();
                this.world.solver.iterations = 10;  // 增加求解器迭代次数，提高碰撞精度
            }
            
            // 为复杂模型创建凸包碰撞体积
            createConvexHullShape(mesh, CANNON) {
                try {
                    const geometry = mesh.geometry;
                    if (!geometry || !geometry.attributes.position) {
                        console.warn('网格缺少位置属性，使用边界框代替');
                        return null;
                    }
                    
                    const vertices = [];
                    const positionAttribute = geometry.attributes.position;
                    
                    // 简化顶点数量以提高性能（最多使用100个顶点）
                    const maxVertices = 100;
                    const step = Math.max(1, Math.floor(positionAttribute.count / maxVertices));
                    
                    for (let i = 0; i < positionAttribute.count; i += step) {
                        const vertex = new THREE.Vector3();
                        vertex.fromBufferAttribute(positionAttribute, i);
                        
                        // 应用网格的变换矩阵
                        vertex.applyMatrix4(mesh.matrixWorld);
                        
                        vertices.push(new CANNON.Vec3(vertex.x, vertex.y, vertex.z));
                    }
                    
                    if (vertices.length < 4) {
                        console.warn('顶点数量不足，无法创建凸包');
                        return null;
                    }
                    
                    // 创建凸包形状
                    return new CANNON.ConvexPolyhedron({ vertices: vertices });
                } catch (error) {
                    console.warn('创建凸包失败:', error);
                    return null;
                }
            }
            
            // 为GLTF模型创建复合碰撞体积
            createCompoundShapeForGLTF(obj, CANNON) {
                const meshes = [];
                const shapes = [];
                const positions = [];
                
                // 遍历模型的所有网格
                obj.traverse((child) => {
                    if (child.isMesh && child.geometry) {
                        meshes.push(child);
                    }
                });
                
                console.log("[物理引擎] 为GLTF模型发现 " + meshes.length + " 个网格");
                
                if (meshes.length === 0) {
                    // 如果没有网格，使用整体边界框
                    const bounds = obj.userData.bounds;
                    const size = new THREE.Vector3();
                    bounds.getSize(size);
                    // 应用模型的缩放
                    size.multiply(obj.scale);
                    return new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
                }
                
                let shapeCount = 0;
                const maxShapes = 20; // 限制最大形状数量以保持性能
                
                for (let i = 0; i < meshes.length && shapeCount < maxShapes; i++) {
                    const mesh = meshes[i];
                    let shape = null;
                    
                    // 首先尝试创建凸包
                    shape = this.createConvexHullShape(mesh, CANNON);
                    
                    // 如果凸包创建失败，使用边界框
                    if (!shape) {
                        // 获取网格的几何体边界框（本地坐标系）
                        const geometry = mesh.geometry;
                        if (geometry.boundingBox === null) {
                            geometry.computeBoundingBox();
                        }
                        
                        const box = geometry.boundingBox.clone();
                        const size = new THREE.Vector3();
                        box.getSize(size);
                        
                        // 应用网格的本地变换（包括缩放）
                        size.multiply(mesh.scale);
                        
                        if (size.x > 0.01 && size.y > 0.01 && size.z > 0.01) {
                            shape = new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
                            
                            // 计算网格中心在模型本地坐标系中的位置
                            const center = new THREE.Vector3();
                            box.getCenter(center);
                            
                            // 应用网格的位置和旋转变换
                            center.applyMatrix4(mesh.matrix);
                            
                            shapes.push(shape);
                            positions.push(new CANNON.Vec3(center.x, center.y, center.z));
                            shapeCount++;
                        }
                    } else {
                        // 使用凸包形状
                        shapes.push(shape);
                        positions.push(new CANNON.Vec3(0, 0, 0));
                        shapeCount++;
                    }
                }
                
                console.log("[物理引擎] 为GLTF模型创建了 " + shapeCount + " 个碰撞形状");
                
                // 如果没有成功创建任何形状，回退到简单边界框
                if (shapeCount === 0) {
                    const bounds = obj.userData.bounds;
                    const size = new THREE.Vector3();
                    bounds.getSize(size);
                    // 应用模型的缩放
                    size.multiply(obj.scale);
                    return new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
                }
                
                // 如果只有一个形状，直接返回该形状
                if (shapes.length === 1) {
                    return shapes[0];
                }
                
                // 返回形状数组和位置数组
                return { shapes, positions };
            }
            
            // 为OBJ模型创建复合碰撞体积
            createCompoundShapeForOBJ(obj, CANNON) {
                const meshes = [];
                const shapes = [];
                const positions = [];
                
                // 遍历模型的所有网格
                obj.traverse((child) => {
                    if (child.isMesh && child.geometry) {
                        meshes.push(child);
                    }
                });
                
                console.log("[物理引擎] 为OBJ模型发现 " + meshes.length + " 个网格");
                
                if (meshes.length === 0) {
                    // 如果没有网格，使用整体边界框
                    const bounds = obj.userData.bounds;
                    const size = new THREE.Vector3();
                    bounds.getSize(size);
                    return new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
                }
                
                let shapeCount = 0;
                const maxShapes = 20; // 限制最大形状数量以保持性能
                
                for (let i = 0; i < meshes.length && shapeCount < maxShapes; i++) {
                    const mesh = meshes[i];
                    let shape = null;
                    
                    // 首先尝试创建凸包
                    shape = this.createConvexHullShape(mesh, CANNON);
                    
                    // 如果凸包创建失败，使用边界框
                    if (!shape) {
                        // 获取网格的几何体边界框（本地坐标系）
                        const geometry = mesh.geometry;
                        if (geometry.boundingBox === null) {
                            geometry.computeBoundingBox();
                        }
                        
                        const box = geometry.boundingBox.clone();
                        const size = new THREE.Vector3();
                        box.getSize(size);
                        
                        // 应用网格的本地变换（包括缩放）
                        size.multiply(mesh.scale);
                        
                        if (size.x > 0.01 && size.y > 0.01 && size.z > 0.01) {
                            shape = new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
                            
                            // 计算网格中心在模型本地坐标系中的位置
                            const center = new THREE.Vector3();
                            box.getCenter(center);
                            
                            // 应用网格的位置和旋转变换
                            center.applyMatrix4(mesh.matrix);
                            
                            // 转换到模型本地坐标系
                            const localCenter = center.clone();
                            obj.worldToLocal(localCenter);
                            
                            shapes.push(shape);
                            positions.push(new CANNON.Vec3(localCenter.x, localCenter.y, localCenter.z));
                            shapeCount++;
                        }
                    } else {
                        // 使用凸包形状
                        shapes.push(shape);
                        positions.push(new CANNON.Vec3(0, 0, 0));
                        shapeCount++;
                    }
                }
                
                console.log("[物理引擎] 为OBJ模型创建了 " + shapeCount + " 个碰撞形状");
                
                // 如果没有成功创建任何形状，回退到简单边界框
                if (shapeCount === 0) {
                    const bounds = obj.userData.bounds;
                    const size = new THREE.Vector3();
                    bounds.getSize(size);
                    // 应用模型的缩放
                    size.multiply(obj.scale);
                    return new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
                }
                
                // 如果只有一个形状，直接返回该形状
                if (shapes.length === 1) {
                    return shapes[0];
                }
                
                // 返回形状数组和位置数组
                return { shapes, positions };
            }
            
            // 设置模型物理属性
            async setModelPhysics(modelId, enabled, mass, restitution, friction, isStatic = false, linearDamping = 0.01, angularDamping = 0.01) {
                if (!this.initialized) {
                    console.warn('物理引擎未初始化，等待初始化完成...');
                    return;
                }
                
                if (!objects.has(modelId)) {
                    console.warn('模型不存在:', modelId);
                    return;
                }
                
                if (!this.world) {
                    console.warn('物理世界未初始化');
                    return;
                }
                
                const obj = objects.get(modelId);
                
                // 如果已经存在物理体，先移除
                if (this.bodies.has(modelId)) {
                    this.world.removeBody(this.bodies.get(modelId));
                    this.bodies.delete(modelId);
                }
                
                if (!enabled) {
                    console.log('禁用模型物理属性:', modelId);
                    return;
                }
                
                try {
                    const CANNON = await loadCannonJS();
                    
                    // 获取模型的边界框并应用缩放
                    const bounds = obj.userData.bounds;
                    const size = new THREE.Vector3();
                    bounds.getSize(size);
                    
                    // 应用模型的缩放到碰撞体积
                    size.multiply(obj.scale);
                    
                    // 根据模型类型创建不同的物理体
                    let shape;
                    let body;
                    
                    if (obj.userData.type === 'sphere') {
                        // 球体根据碰撞类型创建不同的碰撞体积
                        const collisionType = obj.userData.collisionType || 'simple';
                        
                        if (collisionType === 'simple') {
                            // 简单碰撞：使用球形
                            const radius = Math.max(size.x, size.y, size.z) / 2;
                            shape = new CANNON.Sphere(radius);
                            console.log("[物理引擎] 为球体模型创建球形碰撞体积: 半径=" + radius);
                        } else {
                            // 完整碰撞：使用边界框（对于球体，简单和完整碰撞都使用球形）
                            const radius = Math.max(size.x, size.y, size.z) / 2;
                            shape = new CANNON.Sphere(radius);
                            console.log("[物理引擎] 为球体模型创建完整球形碰撞体积: 半径=" + radius);
                        }
                        
                        // 创建单一形状的物理体
                        body = new CANNON.Body({
                            mass: isStatic ? 0 : mass,
                            position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
                            quaternion: new CANNON.Quaternion(obj.quaternion.x, obj.quaternion.y, obj.quaternion.z, obj.quaternion.w),
                            shape: shape,
                            material: new CANNON.Material({
                                friction: friction,
                                restitution: restitution
                            }),
                            linearDamping: linearDamping,
                            angularDamping: angularDamping
                        });
                    } else if (obj.userData.type === 'gltf_model') {
                        // GLTF模型根据碰撞类型创建不同的碰撞体积
                        const collisionType = obj.userData.collisionType || 'simple';
                        
                        if (collisionType === 'simple') {
                            // 简单碰撞：使用边界框
                            shape = new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
                            console.log("[物理引擎] 为GLTF模型创建简单边界框碰撞体积: " + size.x + "x" + size.y + "x" + size.z);
                            
                            body = new CANNON.Body({
                                mass: isStatic ? 0 : mass,
                                position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
                                quaternion: new CANNON.Quaternion(obj.quaternion.x, obj.quaternion.y, obj.quaternion.z, obj.quaternion.w),
                                shape: shape,
                                material: new CANNON.Material({
                                    friction: friction,
                                    restitution: restitution
                                }),
                                linearDamping: linearDamping,
                                angularDamping: angularDamping
                            });
                        } else {
                            // 完整碰撞：使用复合碰撞体积
                            console.log("[物理引擎] 为GLTF模型创建完整复合碰撞体积: " + modelId);
                            const compoundResult = this.createCompoundShapeForGLTF(obj, CANNON);
                            
                            if (compoundResult.shapes && compoundResult.positions) {
                                // 多个形状的复合体
                                body = new CANNON.Body({
                                    mass: isStatic ? 0 : mass,
                                    position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
                                    quaternion: new CANNON.Quaternion(obj.quaternion.x, obj.quaternion.y, obj.quaternion.z, obj.quaternion.w),
                                    material: new CANNON.Material({
                                        friction: friction,
                                        restitution: restitution
                                    }),
                                    linearDamping: linearDamping,
                                    angularDamping: angularDamping
                                });
                                
                                // 添加所有形状到body
                                for (let i = 0; i < compoundResult.shapes.length; i++) {
                                    body.addShape(compoundResult.shapes[i], compoundResult.positions[i]);
                                }
                            } else {
                                // 单一形状
                                body = new CANNON.Body({
                                    mass: isStatic ? 0 : mass,
                                    position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
                                    quaternion: new CANNON.Quaternion(obj.quaternion.x, obj.quaternion.y, obj.quaternion.z, obj.quaternion.w),
                                    shape: compoundResult,
                                    material: new CANNON.Material({
                                        friction: friction,
                                        restitution: restitution
                                    }),
                                    linearDamping: linearDamping,
                                    angularDamping: angularDamping
                                });
                            }
                        }
                    } else if (obj.userData.type === 'obj_model') {
                        // OBJ模型根据碰撞类型创建不同的碰撞体积
                        const collisionType = obj.userData.collisionType || 'simple';
                        
                        if (collisionType === 'simple') {
                            // 简单碰撞：使用边界框
                            shape = new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
                            console.log("[物理引擎] 为OBJ模型创建简单边界框碰撞体积: " + size.x + "x" + size.y + "x" + size.z);
                            
                            body = new CANNON.Body({
                                mass: isStatic ? 0 : mass,
                                position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
                                quaternion: new CANNON.Quaternion(obj.quaternion.x, obj.quaternion.y, obj.quaternion.z, obj.quaternion.w),
                                shape: shape,
                                material: new CANNON.Material({
                                    friction: friction,
                                    restitution: restitution
                                }),
                                linearDamping: linearDamping,
                                angularDamping: angularDamping
                            });
                        } else {
                            // 完整碰撞：使用复合碰撞体积
                            console.log("[物理引擎] 为OBJ模型创建完整复合碰撞体积: " + modelId);
                            const compoundResult = this.createCompoundShapeForOBJ(obj, CANNON);
                            
                            if (compoundResult.shapes && compoundResult.positions) {
                                // 多个形状的复合体
                                body = new CANNON.Body({
                                    mass: isStatic ? 0 : mass,
                                    position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
                                    quaternion: new CANNON.Quaternion(obj.quaternion.x, obj.quaternion.y, obj.quaternion.z, obj.quaternion.w),
                                    material: new CANNON.Material({
                                        friction: friction,
                                        restitution: restitution
                                    }),
                                    linearDamping: linearDamping,
                                    angularDamping: angularDamping
                                });
                                
                                // 添加所有形状到body
                                for (let i = 0; i < compoundResult.shapes.length; i++) {
                                    body.addShape(compoundResult.shapes[i], compoundResult.positions[i]);
                                }
                            } else {
                                // 单一形状
                                body = new CANNON.Body({
                                    mass: isStatic ? 0 : mass,
                                    position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
                                    quaternion: new CANNON.Quaternion(obj.quaternion.x, obj.quaternion.y, obj.quaternion.z, obj.quaternion.w),
                                    shape: compoundResult,
                                    material: new CANNON.Material({
                                        friction: friction,
                                        restitution: restitution
                                    }),
                                    linearDamping: linearDamping,
                                    angularDamping: angularDamping
                                });
                            }
                        }
                    } else {
                        // 立方体或其他形状根据碰撞类型创建不同的碰撞体积
                        const collisionType = obj.userData.collisionType || 'simple';
                        
                        // 对于立方体等基本形状，简单和完整碰撞都使用边界框
                        shape = new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
                        console.log("[物理引擎] 为模型创建边界框碰撞体积: " + size.x + "x" + size.y + "x" + size.z + " (类型: " + collisionType + ")");
                        
                        // 创建单一形状的物理体
                        body = new CANNON.Body({
                            mass: isStatic ? 0 : mass,
                            position: new CANNON.Vec3(obj.position.x, obj.position.y, obj.position.z),
                            quaternion: new CANNON.Quaternion(obj.quaternion.x, obj.quaternion.y, obj.quaternion.z, obj.quaternion.w),
                            shape: shape,
                            material: new CANNON.Material({
                                friction: friction,
                                restitution: restitution
                            }),
                            linearDamping: linearDamping,
                            angularDamping: angularDamping
                        });
                    }
                    
                    // 存储Three.js对象引用和阻尼值
                    body.userData = { 
                        threeObject: obj,
                        linearDamping: linearDamping,
                        angularDamping: angularDamping,
                        originalMass: mass,
                        originalFriction: friction,
                        modelType: obj.userData.type
                    };
                    
                    this.world.addBody(body);
                    this.bodies.set(modelId, body);
                    
                    console.log('设置模型物理属性:', modelId, { 
                        type: obj.userData.type,
                        mass, 
                        restitution, 
                        friction, 
                        isStatic, 
                        linearDamping, 
                        angularDamping,
                        shapeType: shape.type || 'compound'
                    });
                } catch (error) {
                    console.error('设置模型物理属性失败:', modelId, error);
                }
            }
            
            // 设置全局重力
            async setGlobalGravity(gx, gy, gz) {
                if (!this.initialized) {
                    console.warn('物理引擎未初始化，等待初始化完成...');
                    return;
                }
                if (this.world) {
                    this.world.gravity.set(gx, gy, gz);
                    console.log('设置全局重力:', {x: gx, y: gy, z: gz});
                }
            }
            
            // 施加力
            async applyForce(modelId, fx, fy, fz, offsetX = 0, offsetY = 0, offsetZ = 0) {
                if (!this.bodies.has(modelId)) {
                    console.warn('模型不存在或未启用物理:', modelId);
                    return;
                }
                
                try {
                    // 检查是否已经加载了Cannon.js
                    if (!window.CANNON) {
                        await loadCannonJS();
                    }
                    const body = this.bodies.get(modelId);
                    const force = new CANNON.Vec3(fx, fy, fz);
                    
                    // 计算力的施加点（相对于物体中心的位置）
                    const forcePoint = new CANNON.Vec3(
                        body.position.x + offsetX,
                        body.position.y + offsetY,
                        body.position.z + offsetZ
                    );
                    
                    // 在指定点施加力
                    body.applyForce(force, forcePoint);
                    console.log('施加力:', modelId, force, '偏移量:', {offsetX, offsetY, offsetZ});
                } catch (error) {
                    console.error('施加力失败:', modelId, error);
                }
            }
            
            // 设置模型速度
            async setModelVelocity(modelId, vx, vy, vz) {
                if (!this.bodies.has(modelId)) {
                    console.warn('模型不存在或未启用物理:', modelId);
                    return;
                }
                
                try {
                    // 检查是否已经加载了Cannon.js
                    if (!window.CANNON) {
                        await loadCannonJS();
                    }
                    const body = this.bodies.get(modelId);
                    body.velocity.set(vx, vy, vz);
                    console.log('设置模型速度:', modelId, body.velocity);
                } catch (error) {
                    console.error('设置模型速度失败:', modelId, error);
                }
            }
            
            // 设置模型静态
            async setModelStatic(modelId, isStatic) {
                if (!this.bodies.has(modelId)) {
                    console.warn('模型不存在或未启用物理:', modelId);
                    return;
                }
                
                try {
                    // 检查是否已经加载了Cannon.js
                    if (!window.CANNON) {
                        await loadCannonJS();
                    }
                    const body = this.bodies.get(modelId);
                    
                    // 保存原始质量和摩擦力
                    if (!body.userData) {
                        body.userData = {};
                    }
                    if (body.userData.originalMass === undefined) {
                        body.userData.originalMass = body.mass;
                    }
                    if (body.userData.originalFriction === undefined && body.material) {
                        body.userData.originalFriction = body.material.friction;
                    }
                    
                    if (isStatic) {
                        // 设置为静态物体
                        body.type = CANNON.Body.STATIC;
                        body.mass = 0;
                        body.updateMassProperties();
                        // 确保静态物体不会移动
                        body.velocity.set(0, 0, 0);
                        body.angularVelocity.set(0, 0, 0);
                        // 设置较高的摩擦力以确保阻挡
                        if (body.material) {
                            body.material.friction = 1.0;
                        }
                    } else {
                        // 恢复为动态物体
                        body.type = CANNON.Body.DYNAMIC;
                        // 恢复之前的质量
                        if (body.userData.originalMass !== undefined) {
                            body.mass = body.userData.originalMass;
                            body.updateMassProperties();
                        }
                        // 恢复摩擦力
                        if (body.userData.originalFriction !== undefined && body.material) {
                            body.material.friction = body.userData.originalFriction;
                        }
                    }
                    
                    body.userData.isStatic = isStatic;
                    console.log('设置模型静态:', modelId, isStatic);
                } catch (error) {
                    console.error('设置模型静态失败:', modelId, error);
                }
            }
            
            // 设置模型阻尼
            async setModelDamping(modelId, linearDamping, angularDamping) {
                if (!this.bodies.has(modelId)) {
                    console.warn('模型不存在或未启用物理:', modelId);
                    return;
                }
                
                try {
                    // 检查是否已经加载了Cannon.js
                    if (!window.CANNON) {
                        await loadCannonJS();
                    }
                    const body = this.bodies.get(modelId);
                    body.linearDamping = linearDamping;
                    body.angularDamping = angularDamping;
                    
                    // 更新userData中的阻尼值
                    if (!body.userData) {
                        body.userData = {};
                    }
                    body.userData.linearDamping = linearDamping;
                    body.userData.angularDamping = angularDamping;
                    
                    console.log('设置模型阻尼:', modelId, { linearDamping, angularDamping });
                } catch (error) {
                    console.error('设置模型阻尼失败:', modelId, error);
                }
            }
            
            // 设置模型碰撞类型
            async setModelCollisionType(modelId, collisionType) {
                const obj = objects.get(modelId);
                if (!obj) {
                    console.warn('模型不存在:', modelId);
                    return;
                }
                
                try {
                    // 检查是否已经加载了Cannon.js
                    if (!window.CANNON) {
                        await loadCannonJS();
                    }
                    
                    // 如果模型已有物理体，需要重新创建
                    if (this.bodies.has(modelId)) {
                        const oldBody = this.bodies.get(modelId);
                        const oldMass = oldBody.mass;
                        const oldRestitution = oldBody.material ? oldBody.material.restitution : 0.3;
                        const oldFriction = oldBody.material ? oldBody.material.friction : 0.5;
                        const oldIsStatic = oldBody.type === window.CANNON.Body.STATIC;
                        const oldLinearDamping = oldBody.linearDamping;
                        const oldAngularDamping = oldBody.angularDamping;
                        
                        // 移除旧的物理体
                        this.world.removeBody(oldBody);
                        this.bodies.delete(modelId);
                        
                        // 存储碰撞类型到模型userData
                        if (!obj.userData) {
                            obj.userData = {};
                        }
                        obj.userData.collisionType = collisionType;
                        
                        // 重新创建物理体
                        await this.setModelPhysics(modelId, true, oldMass, oldRestitution, oldFriction, oldIsStatic, oldLinearDamping, oldAngularDamping);
                    } else {
                        // 如果没有物理体，只存储碰撞类型
                        if (!obj.userData) {
                            obj.userData = {};
                        }
                        obj.userData.collisionType = collisionType;
                    }
                    
                    console.log('设置模型碰撞类型:', modelId, collisionType);
                } catch (error) {
                    console.error('设置模型碰撞类型失败:', modelId, error);
                }
            }
            
            // 设置碰撞箱可见性
            async setCollisionBoxVisible(modelId, visible) {
                const obj = objects.get(modelId);
                if (!obj) {
                    console.warn('模型不存在:', modelId);
                    return;
                }
                
                try {
                    // 移除现有的碰撞箱可视化
                    if (obj.userData && obj.userData.collisionBoxHelper) {
                        scene.remove(obj.userData.collisionBoxHelper);
                        obj.userData.collisionBoxHelper = null;
                    }
                    
                    if (visible && this.bodies.has(modelId)) {
                        const body = this.bodies.get(modelId);
                        
                        // 创建碰撞箱可视化
                        const helper = this.createCollisionBoxHelper(body);
                        if (helper) {
                            scene.add(helper);
                            if (!obj.userData) {
                                obj.userData = {};
                            }
                            obj.userData.collisionBoxHelper = helper;
                        }
                    }
                    
                    console.log('设置碰撞箱可见性:', modelId, visible);
                } catch (error) {
                    console.error('设置碰撞箱可见性失败:', modelId, error);
                }
            }
            
            // 创建碰撞箱可视化辅助器
            createCollisionBoxHelper(body) {
                try {
                    const group = new THREE.Group();
                    
                    // 创建线条材质，设置为最顶层渲染
                    const material = new THREE.LineBasicMaterial({
                        color: 0x00ff00,
                        transparent: true,
                        opacity: 0.8,
                        depthTest: false,  // 禁用深度测试，使线条始终显示在最前面
                        depthWrite: false  // 禁用深度写入
                    });
                    
                    // 处理复合碰撞体（多个形状）
                    if (body.shapes.length > 1) {
                        for (let i = 0; i < body.shapes.length; i++) {
                            const shape = body.shapes[i];
                            const shapeOffset = body.shapeOffsets[i] || new window.CANNON.Vec3(0, 0, 0);
                            
                            let geometry = null;
                            
                            if (shape.type === window.CANNON.Shape.types.BOX) {
                                // 物理体的halfExtents已经包含了缩放，直接使用
                                geometry = new THREE.BoxGeometry(
                                    shape.halfExtents.x * 2,
                                    shape.halfExtents.y * 2,
                                    shape.halfExtents.z * 2
                                );
                                console.log("[碰撞箱显示] 复合形状BOX尺寸:", shape.halfExtents.x * 2, shape.halfExtents.y * 2, shape.halfExtents.z * 2);
                            } else if (shape.type === window.CANNON.Shape.types.SPHERE) {
                                // 球体半径已经包含了缩放
                                geometry = new THREE.SphereGeometry(shape.radius, 16, 12);
                                console.log("[碰撞箱显示] 复合形状SPHERE半径:", shape.radius);
                            } else if (shape.type === window.CANNON.Shape.types.CONVEXPOLYHEDRON) {
                                const vertices = shape.vertices;
                                const box = new THREE.Box3();
                                vertices.forEach(vertex => {
                                    box.expandByPoint(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
                                });
                                const size = box.getSize(new THREE.Vector3());
                                geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
                                console.log("[碰撞箱显示] 复合形状CONVEX尺寸:", size.x, size.y, size.z);
                            }
                            
                            if (geometry) {
                                const edges = new THREE.EdgesGeometry(geometry);
                                const helper = new THREE.LineSegments(edges, material);
                                
                                // 设置形状的相对位置
                                helper.position.set(shapeOffset.x, shapeOffset.y, shapeOffset.z);
                                
                                group.add(helper);
                            }
                        }
                    } else {
                        // 单个形状
                        const shape = body.shapes[0];
                        let geometry = null;
                        
                        if (shape.type === window.CANNON.Shape.types.BOX) {
                            // 物理体的halfExtents已经包含了缩放，直接使用
                            geometry = new THREE.BoxGeometry(
                                shape.halfExtents.x * 2,
                                shape.halfExtents.y * 2,
                                shape.halfExtents.z * 2
                            );
                            console.log("[碰撞箱显示] 单个BOX尺寸:", shape.halfExtents.x * 2, shape.halfExtents.y * 2, shape.halfExtents.z * 2);
                        } else if (shape.type === window.CANNON.Shape.types.SPHERE) {
                            // 球体半径已经包含了缩放
                            geometry = new THREE.SphereGeometry(shape.radius, 16, 12);
                            console.log("[碰撞箱显示] 单个SPHERE半径:", shape.radius);
                        } else if (shape.type === window.CANNON.Shape.types.CONVEXPOLYHEDRON) {
                            const vertices = shape.vertices;
                            const box = new THREE.Box3();
                            vertices.forEach(vertex => {
                                box.expandByPoint(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
                            });
                            const size = box.getSize(new THREE.Vector3());
                            geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
                            console.log("[碰撞箱显示] 单个CONVEX尺寸:", size.x, size.y, size.z);
                        }
                        
                        if (geometry) {
                            const edges = new THREE.EdgesGeometry(geometry);
                            const helper = new THREE.LineSegments(edges, material);
                            group.add(helper);
                        }
                    }
                    
                    if (group.children.length > 0) {
                        // 设置整个组的位置和旋转
                        group.position.copy(body.position);
                        group.quaternion.copy(body.quaternion);
                        
                        // 设置渲染顺序，确保在最顶层显示
                        group.renderOrder = 999;
                        group.traverse((child) => {
                            if (child.material) {
                                child.renderOrder = 999;
                            }
                        });
                        
                        return group;
                    }
                } catch (error) {
                    console.error('创建碰撞箱可视化失败:', error);
                }
                
                return null;
            }
            
            // 创建物理地面
            async createPhysicsGround(height, bounce, friction) {
                if (this.groundBody) {
                    this.world.removeBody(this.groundBody);
                }
                
                try {
                    const CANNON = await loadCannonJS();
                    
                    // 创建地面物理体
                    const groundShape = new CANNON.Plane();
                    this.groundBody = new CANNON.Body({
                        mass: 0, // 静态物体
                        position: new CANNON.Vec3(0, height, 0),
                        shape: groundShape,
                        material: new CANNON.Material({
                            friction: friction,
                            restitution: bounce
                        })
                    });
                    
                    // 修复坐标系转换：Cannon.js的Plane默认是垂直的，需要旋转使其水平
                    // 在Y轴向上的坐标系中，绕X轴旋转-90度使平面水平
                    this.groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
                    
                    this.world.addBody(this.groundBody);
                    console.log('创建物理地面:', height, bounce, friction);
                } catch (error) {
                    console.error('创建物理地面失败:', error);
                }
            }
            
            // 获取模型物理信息
            getModelPhysicsInfo(modelId, property) {
                if (!this.bodies.has(modelId)) {
                    console.warn('模型不存在或未启用物理:', modelId);
                    return 0;
                }
                
                const body = this.bodies.get(modelId);
                
                switch(property) {
                    case '位置X': return body.position.x;
                    case '位置Y': return body.position.y;
                    case '位置Z': return body.position.z;
                    case '速度X': return body.velocity.x;
                    case '速度Y': return body.velocity.y;
                    case '速度Z': return body.velocity.z;
                    case '重力': return this.world.gravity.y; // 返回全局重力
                    case '弹力': return body.material ? body.material.restitution : 0.3;
                    case '阻力': return body.linearDamping || 0.01;
                    case '摩擦力': return body.material ? body.material.friction : 0.5;
                    case '是否静态': return body.mass === 0 ? 1 : 0;
                    default: return 0;
                }
            }
            
            // 模型固定功能
            async attachModelToModel(childModelId, parentModelId, rotationCenter = 'self') {
                if (!this.initialized) {
                    console.warn('物理引擎未初始化，等待初始化完成...');
                    return;
                }
                
                if (!this.bodies.has(childModelId) || !this.bodies.has(parentModelId)) {
                    console.warn('子模型或父模型不存在或未启用物理:', childModelId, parentModelId);
                    return;
                }
                
                try {
                    const CANNON = await loadCannonJS();
                    const childBody = this.bodies.get(childModelId);
                    const parentBody = this.bodies.get(parentModelId);
                    
                    // 使用PointToPointConstraint实现模型固定
                    let pivotA, pivotB;
                    
                    if (rotationCenter === 'parent') {
                        // 围绕父模型中心旋转
                        pivotA = new CANNON.Vec3(0, 0, 0); // 子模型中心
                        pivotB = new CANNON.Vec3(0, 0, 0); // 父模型中心
                    } else {
                        // 围绕自身中心旋转（默认）
                        pivotA = new CANNON.Vec3(0, 0, 0); // 子模型中心
                        // 计算相对位置
                        const relativePos = new CANNON.Vec3();
                        childBody.position.vsub(parentBody.position, relativePos);
                        pivotB = relativePos; // 相对于父模型的位置
                    }
                    
                    // 创建点对点约束
                    const constraint = new CANNON.PointToPointConstraint(
                        childBody, pivotA,
                        parentBody, pivotB
                    );
                    
                    // 存储约束关系
                    if (!childBody.userData.constraints) {
                        childBody.userData.constraints = new Map();
                    }
                    childBody.userData.constraints.set(parentModelId, constraint);
                    
                    this.world.addConstraint(constraint);
                    
                    console.log('模型固定成功:', childModelId, '->', parentModelId, '旋转中心:', rotationCenter);
                } catch (error) {
                    console.error('模型固定失败:', error);
                    throw error;
                }
            }
            
            // 模型分离功能
            async detachModelFromModel(childModelId, parentModelId) {
                if (!this.initialized) {
                    console.warn('物理引擎未初始化，等待初始化完成...');
                    return;
                }
                
                if (!this.bodies.has(childModelId)) {
                    console.warn('子模型不存在或未启用物理:', childModelId);
                    return;
                }
                
                const childBody = this.bodies.get(childModelId);
                
                if (!childBody.userData.constraints || !childBody.userData.constraints.has(parentModelId)) {
                    console.warn('模型之间没有固定关系:', childModelId, '->', parentModelId);
                    return;
                }
                
                try {
                    const constraint = childBody.userData.constraints.get(parentModelId);
                    this.world.removeConstraint(constraint);
                    childBody.userData.constraints.delete(parentModelId);
                    
                    console.log('模型分离成功:', childModelId, '->', parentModelId);
                } catch (error) {
                    console.error('模型分离失败:', error);
                    throw error;
                }
            }
            
            // 施加旋转力
            async applyTorque(modelId, tx, ty, tz) {
                if (!this.bodies.has(modelId)) {
                    console.warn('模型不存在或未启用物理:', modelId);
                    return;
                }
                
                try {
                    // 检查是否已经加载了Cannon.js
                    if (!window.CANNON) {
                        await loadCannonJS();
                    }
                    const body = this.bodies.get(modelId);
                    const torque = new CANNON.Vec3(tx, ty, tz);
                    body.applyTorque(torque);
                    console.log('施加旋转力:', modelId, torque);
                } catch (error) {
                    console.error('施加旋转力失败:', modelId, error);
                    throw error;
                }
            }
            
            // 更新物理模拟
            update(deltaTime) {
                if (!this.physicsEnabled || !this.world) return;
                
                // 限制时间步长，避免大的跳跃导致不稳定
                const maxDelta = 1/30; // 最大时间步长为30FPS
                const steps = Math.ceil(deltaTime / maxDelta);
                const stepDelta = deltaTime / steps;
                
                // 分步更新物理世界，提高稳定性
                for (let i = 0; i < steps; i++) {
                    this.world.step(stepDelta);
                }
                
                // 同步Three.js对象位置和旋转
                this.bodies.forEach((body, modelId) => {
                    if (objects.has(modelId)) {
                        const obj = objects.get(modelId);
                        
                        // 检查是否有手动设置的位置标记
                        // 如果没有手动设置位置标记，则同步物理引擎的位置
                        if (!obj.userData.manualPositionSet) {
                            // 修复坐标系转换：Cannon.js和Three.js都使用Y轴向上的右手坐标系
                            // 但需要确保旋转同步时坐标系一致
                            obj.position.set(body.position.x, body.position.y, body.position.z);
                        }
                        
                        // 检查是否有手动设置的旋转标记
                        // 如果没有手动设置旋转标记，则同步物理引擎的旋转
                        if (!obj.userData.manualRotationSet) {
                            // 修复坐标系转换：确保四元数旋转坐标系一致
                            obj.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
                        }
                        
                        // 更新边界框
                        updateModelBounds(modelId);
                    }
                });
            }
            
            // 手动设置模型位置（当用户手动设置位置时调用）
            setModelPosition(modelId, x, y, z) {
                if (!this.bodies.has(modelId)) return;
                
                const body = this.bodies.get(modelId);
                const obj = objects.get(modelId);
                
                // 修复坐标系转换：确保Three.js和Cannon.js位置一致
                // 更新物理体位置
                body.position.set(x, y, z);
                
                // 更新Three.js对象位置
                obj.position.set(x, y, z);
                
                // 清除速度，避免物理引擎继续移动
                body.velocity.set(0, 0, 0);
                body.angularVelocity.set(0, 0, 0);
                
                // 设置手动位置标记，防止物理引擎覆盖
                obj.userData.manualPositionSet = true;
                
                // 清除之前的定时器
                if (obj.userData.positionTimer) {
                    clearTimeout(obj.userData.positionTimer);
                }
                
                // 设置定时器，100ms后清除手动标记，让物理引擎重新接管
                obj.userData.positionTimer = setTimeout(() => {
                    obj.userData.manualPositionSet = false;
                    obj.userData.positionTimer = null;
                }, 100);
                
                console.log('手动设置模型位置:', modelId, {x, y, z});
            }
            
            // 手动设置模型旋转（当用户手动设置旋转时调用）
            setModelRotation(modelId, x, y, z) {
                if (!this.bodies.has(modelId)) return;
                
                const body = this.bodies.get(modelId);
                const obj = objects.get(modelId);
                
                // 转换为弧度
                const radX = x * (Math.PI / 180);
                const radY = y * (Math.PI / 180);
                const radZ = z * (Math.PI / 180);
                
                // 将欧拉角转换为四元数
                const euler = new THREE.Euler(radX, radY, radZ);
                const quaternion = new THREE.Quaternion().setFromEuler(euler);
                
                // 更新物理体旋转
                body.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
                
                // 更新Three.js对象旋转
                obj.quaternion.copy(quaternion);
                
                // 清除角速度，避免物理引擎继续旋转
                body.angularVelocity.set(0, 0, 0);
                
                // 标记为手动设置旋转，防止被物理引擎覆盖
                obj.userData.manualRotationSet = true;
                
                // 设置一个定时器，在几帧后清除手动标记，让物理引擎重新接管
                setTimeout(() => {
                    if (obj.userData) {
                        obj.userData.manualRotationSet = false;
                    }
                }, 100); // 100ms后清除标记
                
                console.log('物理引擎设置模型旋转:', modelId, {x, y, z});
            }
            
            // 清除手动设置标记（当物理模拟需要重新接管时调用）
            clearManualFlags(modelId) {
                if (!objects.has(modelId)) return;
                
                const obj = objects.get(modelId);
                obj.userData.manualPositionSet = false;
                obj.userData.manualRotationSet = false;
            }
            
            // 碰撞检测和碰撞处理现在由Cannon.js自动处理
        }

        const physicsEngine = new CannonPhysicsEngine();

        // 物理引擎相关函数
        async function setModelPhysics(modelId, enabled, mass, restitution, friction, isStatic = false, linearDamping = 0.01, angularDamping = 0.01) {
            return await physicsEngine.setModelPhysics(modelId, enabled, mass, restitution, friction, isStatic, linearDamping, angularDamping);
        }
        
        async function setGlobalGravity(gx, gy, gz) {
            return await physicsEngine.setGlobalGravity(gx, gy, gz);
        }
        
        async function applyForce(modelId, fx, fy, fz) {
            return await physicsEngine.applyForce(modelId, fx, fy, fz);
        }
        
        async function setModelVelocity(modelId, vx, vy, vz) {
            return await physicsEngine.setModelVelocity(modelId, vx, vy, vz);
        }
        
        async function setModelStatic(modelId, isStatic) {
            return await physicsEngine.setModelStatic(modelId, isStatic);
        }
        
        async function createPhysicsGround(height, bounce, friction) {
            return await physicsEngine.createPhysicsGround(height, bounce, friction);
        }
        
        function getModelPhysicsInfo(modelId, property) {
            return physicsEngine.getModelPhysicsInfo(modelId, property);
        }
        
        async function attachModelToModel(childModelId, parentModelId, rotationCenter) {
            return await physicsEngine.attachModelToModel(childModelId, parentModelId, rotationCenter);
        }
        
        async function detachModelFromModel(childModelId, parentModelId) {
            return await physicsEngine.detachModelFromModel(childModelId, parentModelId);
        }
        
        async function applyTorque(modelId, tx, ty, tz) {
            return await physicsEngine.applyTorque(modelId, tx, ty, tz);
        }
        
        async function setModelDamping(modelId, linearDamping, angularDamping) {
            return await physicsEngine.setModelDamping(modelId, linearDamping, angularDamping);
        }
        
        async function setModelCollisionType(modelId, collisionType) {
            return await physicsEngine.setModelCollisionType(modelId, collisionType);
        }
        
        async function setCollisionBoxVisible(modelId, visible) {
            return await physicsEngine.setCollisionBoxVisible(modelId, visible);
        }

        // 透明材质创建函数
        function createTransparentMaterial(color, texture = null) {
            const material = new THREE.MeshStandardMaterial({
                color: hexToThreeColor(color),
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                alphaTest: 0.1,
                opacity: 1.0
            });
            
            if (texture) {
                material.map = texture;
                material.needsUpdate = true;
            }
            
            return material;
        }

        // 颜色转换函数
        function hexToThreeColor(hexColor) {
            return hexColor.startsWith('#') ? new THREE.Color(hexColor) : new THREE.Color(0xff0000);
        }

        // 初始化3D场景
        function init3DScene() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87CEEB);
            
            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 20000);
            camera.position.set(0, 0, 500);
            camera.rotation.order = 'YXZ';
            
            renderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true,
                preserveDrawingBuffer: true
            });
            
            // 设置初始渲染器参数
            updateRendererSettings();
            renderer.shadowMap.enabled = shadowsEnabled;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            // 调整渲染设置以平衡摩尔纹和清晰度
            if (renderer.outputEncoding !== undefined) {
                renderer.outputEncoding = THREE.LinearEncoding;
            }
            if (renderer.toneMapping !== undefined) {
                renderer.toneMapping = THREE.NoToneMapping;
            }
            
            // 创建立方体相机用于环境反射（主要用于水面）
            cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
                format: THREE.RGBFormat,
                generateMipmaps: true,
                minFilter: THREE.LinearMipmapLinearFilter,
                magFilter: THREE.LinearFilter,
                encoding: THREE.LinearEncoding,
                type: THREE.UnsignedByteType
            });
            
            cubeCamera = new THREE.CubeCamera(0.1, 20000, cubeRenderTarget);
            
            // 初始化PMREM生成器用于高质量反射预过滤
            try {
                pmremGenerator = new THREE.PMREMGenerator(renderer);
                pmremGenerator.compileCubemapShader();
            } catch (e) {
                console.warn('PMREMGenerator 初始化失败，使用传统环境贴图:', e);
                pmremGenerator = null;
            }
            
            updateRendererSettings();
            container.appendChild(renderer.domElement);
            
            createInfiniteCoordinateSystem();
            initBloomEffect(); // 初始化光晕效果
            initFilterSystem(); // 初始化滤镜系统
            
            // 初始化物理引擎设置
            // 等待物理引擎初始化完成后再设置重力
            setTimeout(() => {
                physicsEngine.setGlobalGravity(0, -9.8, 0); // 设置默认重力
                console.log('物理引擎初始化完成');
            }, 100);
            
            // 确保物理引擎正确初始化
            setTimeout(() => {
                physicsEngine.initWorld();
            }, 200);
            
            // 添加窗口大小改变事件监听
            window.addEventListener('resize', () => {
                updateRendererSettings();
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
            });
            
            animate();
        }

        // 创建无限坐标轴
        function createInfiniteCoordinateSystem() {
            coordinateSystem = new THREE.Group();
            const axisLength = 10000;
            
            createAxisLine('x', new THREE.Color(0xff0000), new THREE.Color(0x800000), axisLength);
            createAxisLine('y', new THREE.Color(0x00ff00), new THREE.Color(0x008000), axisLength);
            createAxisLine('z', new THREE.Color(0x0000ff), new THREE.Color(0x000080), axisLength);
            
            scene.add(coordinateSystem);
        }

        function createAxisLine(axis, positiveColor, negativeColor, length) {
            const positiveGeometry = new THREE.BufferGeometry();
            const negativeGeometry = new THREE.BufferGeometry();
            
            let positiveVertices, negativeVertices;
            
            switch(axis) {
                case 'x':
                    positiveVertices = new Float32Array([0, 0, 0, length, 0, 0]);
                    negativeVertices = new Float32Array([0, 0, 0, -length, 0, 0]);
                    break;
                case 'y':
                    positiveVertices = new Float32Array([0, 0, 0, 0, length, 0]);
                    negativeVertices = new Float32Array([0, 0, 0, 0, -length, 0]);
                    break;
                case 'z':
                    positiveVertices = new Float32Array([0, 0, 0, 0, 0, length]);
                    negativeVertices = new Float32Array([0, 0, 0, 0, 0, -length]);
                    break;
            }
            
            positiveGeometry.setAttribute('position', new THREE.BufferAttribute(positiveVertices, 3));
            negativeGeometry.setAttribute('position', new THREE.BufferAttribute(negativeVertices, 3));
            
            const positiveLine = new THREE.Line(positiveGeometry, new THREE.LineBasicMaterial({ 
                color: positiveColor, linewidth: 1 
            }));
            const negativeLine = new THREE.Line(negativeGeometry, new THREE.LineBasicMaterial({ 
                color: negativeColor, linewidth: 1 
            }));
            
            coordinateSystem.add(positiveLine);
            coordinateSystem.add(negativeLine);
        }

        function updateRendererSettings() {
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            let pixelRatio = 1;
            let antialias = true;
            
            switch(renderQuality) {
                case 0.1: pixelRatio = 0.5; antialias = false; break;  // 极致优化：降低分辨率，关闭抗锯齿
                case 0.3: pixelRatio = 0.8; antialias = false; break;  // 性能优先：稍低分辨率，关闭抗锯齿
                case 0.6: pixelRatio = 1; antialias = true; break;    // 平衡模式：标准分辨率，开启抗锯齿
                case 0.8: pixelRatio = 1.5; antialias = true; break;   // 质量优先：高分辨率，开启抗锯齿
                case 1.0: pixelRatio = 2; antialias = true; break;     // 极致质量：最高分辨率，开启抗锯齿
            }
            
            renderer.setSize(width, height);
            renderer.setPixelRatio(pixelRatio);
            renderer.antialias = antialias;
            renderer.shadowMap.enabled = shadowsEnabled;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            // 调整渲染设置以平衡摩尔纹和清晰度
            if (renderer.outputEncoding !== undefined) {
                renderer.outputEncoding = THREE.LinearEncoding; // 改回线性编码以提高清晰度
            }
            if (renderer.toneMapping !== undefined) {
                renderer.toneMapping = THREE.NoToneMapping; // 禁用色调映射以保持原始颜色
            }
            
            // 更新光晕效果系统大小
            updateBloomEffectSize();
            
            // 更新滤镜系统大小
            updateFilterEffectSize();
        }
        
        // 更新光晕效果系统大小
        function updateBloomEffectSize() {
            if (bloomComposer && renderTarget) {
                const width = container.clientWidth;
                const height = container.clientHeight;
                
                // 根据渲染质量设置像素比例，确保光晕效果分辨率与主渲染器一致
                let pixelRatio = 1;
                switch(renderQuality) {
                    case 0.1: pixelRatio = 0.5; break;  // 极致优化：降低分辨率
                    case 0.3: pixelRatio = 0.8; break;  // 性能优先：稍低分辨率
                    case 0.6: pixelRatio = 1; break;    // 平衡模式：标准分辨率
                    case 0.8: pixelRatio = 1.5; break;   // 质量优先：高分辨率
                    case 1.0: pixelRatio = 2; break;     // 极致质量：最高分辨率
                }
                
                // 更新渲染目标大小，应用像素比例
                renderTarget.setSize(width * pixelRatio, height * pixelRatio);
                
                // 更新光晕通道大小
                if (bloomPass) {
                    bloomPass.setSize(width * pixelRatio, height * pixelRatio);
                }
                
                // 更新合成器大小
                bloomComposer.setSize(width * pixelRatio, height * pixelRatio);
            }
        }

        // 更新滤镜效果系统大小
        function updateFilterEffectSize() {
            if (filterComposer) {
                const width = container.clientWidth;
                const height = container.clientHeight;
                
                // 根据渲染质量设置像素比例，确保滤镜效果分辨率与主渲染器一致
                let pixelRatio = 1;
                switch(renderQuality) {
                    case 0.1: pixelRatio = 0.5; break;  // 极致优化：降低分辨率
                    case 0.3: pixelRatio = 0.8; break;  // 性能优先：稍低分辨率
                    case 0.6: pixelRatio = 1; break;    // 平衡模式：标准分辨率
                    case 0.8: pixelRatio = 1.5; break;   // 质量优先：高分辨率
                    case 1.0: pixelRatio = 2; break;     // 极致质量：最高分辨率
                }
                
                // 更新滤镜合成器大小，应用像素比例
                filterComposer.setSize(width * pixelRatio, height * pixelRatio);
            }
        }

        // 创建天空盒
        function createSkybox() {
            if (skyboxMesh) {
                scene.remove(skyboxMesh);
                skyboxMesh = null;
            }
            
            if (!skyboxEnabled) return;
            
            let geometry, material;
            
            if (skyboxType === 'spherical') {
                // 球形天空盒 - 增大到最大范围，确保不会遮挡远处的建模
                geometry = new THREE.SphereGeometry(5000, 64, 64);
                material = new THREE.MeshBasicMaterial({
                    side: THREE.BackSide,
                    depthWrite: false,
                    depthTest: false
                });
                
                if (skyboxTexture) {
                    material.map = skyboxTexture;
                } else {
                    material.color = skyboxColor;
                }
            } else {
                // 方形天空盒 - 增大到最大范围，确保不会遮挡远处的建模
                geometry = new THREE.BoxGeometry(10000, 10000, 10000);
                material = new THREE.MeshBasicMaterial({
                    side: THREE.BackSide,
                    depthWrite: false,
                    depthTest: false
                });
                
                if (skyboxTexture) {
                    material.map = skyboxTexture;
                } else {
                    material.color = skyboxColor;
                }
            }
            
            skyboxMesh = new THREE.Mesh(geometry, material);
            skyboxMesh.renderOrder = -1000; // 确保天空盒最先渲染
            scene.add(skyboxMesh);
            
            // 更新环境贴图以包含天空盒
            updateEnvironmentMap();
        }
        
        // 更新环境贴图
        function updateEnvironmentMap() {
            if (!cubeCamera || !cubeRenderTarget) {
                // 初始化立方体相机用于环境贴图
                cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
                    format: THREE.RGBFormat,
                    generateMipmaps: true,
                    minFilter: THREE.LinearMipmapLinearFilter
                });
                cubeCamera = new THREE.CubeCamera(0.1, 2000, cubeRenderTarget);
            }
            
            // 临时禁用天空盒以避免在环境贴图中出现
            const originalSkyboxEnabled = skyboxEnabled;
            if (skyboxMesh) {
                skyboxMesh.visible = false;
            }
            
            // 更新立方体相机位置到主相机位置
            cubeCamera.position.copy(camera.position);
            
            // 渲染环境贴图
            cubeCamera.update(renderer, scene);
            
            // 恢复天空盒可见性
            if (skyboxMesh) {
                skyboxMesh.visible = originalSkyboxEnabled;
            }
            
            environmentMap = cubeRenderTarget.texture;
            
            // 应用环境贴图到需要反射的对象
            objects.forEach((obj, id) => {
                if (obj.material && obj.material.envMap !== undefined) {
                    obj.material.envMap = environmentMap;
                    obj.material.needsUpdate = true;
                }
            });
        }
        
        // 设置天空盒纹理
        function setSkyboxTexture(base64Data) {
            if (base64Data && base64Data.startsWith('data:image')) {
                const loader = new THREE.TextureLoader();
                skyboxTexture = loader.load(base64Data, function(texture) {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    
                    // 根据贴图类型设置映射方式
                    if (skyboxTextureType === 'cube') {
                        texture.mapping = THREE.CubeReflectionMapping;
                    } else if (skyboxTextureType === 'cylindrical') {
                        texture.mapping = THREE.CylindricalReflectionMapping;
                    } else {
                        // 默认使用等距柱状投影映射
                        texture.mapping = THREE.EquirectangularReflectionMapping;
                    }
                    
                    createSkybox();
                    updateEnvironmentMap();
                });
            } else {
                skyboxTexture = null;
                createSkybox();
                updateEnvironmentMap();
            }
        }
        
        // 设置天空盒类型
        function setSkyboxType(type) {
            skyboxType = type;
            createSkybox();
            updateEnvironmentMap();
        }
        
        // 设置天空盒开关
        function setSkyboxEnabled(enabled) {
            skyboxEnabled = enabled;
            createSkybox();
            updateEnvironmentMap();
        }
        
        // 设置天空盒颜色
        function setSkyboxColor(color) {
            skyboxColor = hexToThreeColor(color);
            createSkybox();
            updateEnvironmentMap();
        }
        
        // 设置天空盒贴图类型
        function setSkyboxTextureType(textureType) {
            skyboxTextureType = textureType;
            // 重新创建天空盒以应用新的贴图类型
            createSkybox();
            updateEnvironmentMap();
        }

        function animate() {
            requestAnimationFrame(animate);
            
            // 更新天空盒位置，使其跟随摄像头移动
            if (skyboxMesh && skyboxEnabled) {
                skyboxMesh.position.copy(camera.position);
            }
            
            // 更新环境贴图（按需更新策略，后台恢复期间暂停）
            if (cubeCamera && reflectionEnabled) {
                frameCountSinceLastReflectionUpdate++;
                const camMoved = lastReflectionCameraPosition.distanceToSquared(camera.position) > (reflectionCameraMoveThreshold * reflectionCameraMoveThreshold);
                const camRotated = (Math.abs(camera.rotation.x - lastReflectionCameraRotation.x) > reflectionCameraRotateThreshold) ||
                                   (Math.abs(camera.rotation.y - lastReflectionCameraRotation.y) > reflectionCameraRotateThreshold) ||
                                   (Math.abs(camera.rotation.z - lastReflectionCameraRotation.z) > reflectionCameraRotateThreshold);

                const shouldUpdate = (backgroundRecoveryFrames === 0) && (
                    camMoved || camRotated ||
                    waterObjectsNeedingReflectionUpdate.size > 0 ||
                    frameCountSinceLastReflectionUpdate >= reflectionUpdateInterval
                );

                if (shouldUpdate) {
                    updateEnvironmentMap();
                    waterObjectsNeedingReflectionUpdate.clear();
                    lastReflectionCameraPosition.copy(camera.position);
                    lastReflectionCameraRotation.copy(camera.rotation);
                }
            }
            
            // 更新动画混合器
            const rawDelta = clock.getDelta();
            if (rawDelta > backgroundDeltaThreshold || pageHidden) {
                backgroundRecoveryFrames = recoverySkipHeavyFrames;
            }
            const delta = Math.min(rawDelta, 0.05); // 限制单帧计算步长，避免恢复时卡顿
            animationMixer.forEach(mixer => {
                if (mixer) {
                    mixer.update(delta);
                }
            });
            
            // 更新物理引擎
            if (physicsEngine) {
                physicsEngine.update(delta);
            }
            
            // 定期更新动画模型的边界框（每60帧约1秒）
            if (frameCount % 60 === 0) {
                objects.forEach((obj, id) => {
                    if (obj.userData.bounds && activeAnimations.has(id) && activeAnimations.get(id).isPlaying) {
                        updateModelBounds(id);
                    }
                });
            }
            
            // 更新水面材质的动态效果（后台恢复期间跳过重负载更新）
                    objects.forEach((obj, id) => {
                        if (obj.userData.isWater && obj.material) {
                            if (backgroundRecoveryFrames > 0) {
                                return; // 恢复期间跳过波浪重计算以避免卡顿
                            }
                            // 调试：输出波浪参数确认水面对象被检测到
                            if (frameCount % 120 === 0) {
                                //console.log("水面波浪更新 - 对象ID:", id, "波浪参数:", obj.userData.waveParams);
                            }
                    // 创建更自然的波动效果
                    const time = clock.getElapsedTime();
                    const waveParams = obj.userData.waveParams;
                    
                    // 更新顶点位置（多层波浪叠加）
                    if (obj.geometry && obj.geometry.attributes.position) {
                        const positions = obj.geometry.attributes.position.array;
                        const originalPositions = obj.userData.originalPositions;
                        
                        if (originalPositions) {
                            // 根据对象缩放对波纹密度进行校正：使用缩放后的局部坐标参与计算
                            const sx = (obj.scale && obj.scale.x) ? obj.scale.x : 1;
                            const sz = (obj.scale && obj.scale.z) ? obj.scale.z : 1;
                            for (let i = 0; i < positions.length; i += 3) {
                                const x = originalPositions[i];
                                const y = originalPositions[i + 1]; // 在旋转后的几何体中，这是Y坐标
                                const z = originalPositions[i + 2];
                                const xScaled = x * sx;
                                const zScaled = z * sz;
                                
                                // 更自然的波浪系统 - 消除45度斜向问题，加快大起伏移动
                                // 使用完全不同的角度和速度组合创造真实水面效果
                                
                                // 主要长波 - X轴方向（左右移动），大幅增加移动速度
                                const longWaveX = Math.sin(time * waveParams.speed1 * 2.5 + xScaled * waveParams.frequency1 * 0.6) * waveParams.amplitude1 * 0.4;
                                
                                // 主要长波 - Z轴方向（前后移动），使用不同频率避免同步
                                const longWaveZ = Math.sin(time * waveParams.speed1 * 1.8 + zScaled * waveParams.frequency1 * 0.4) * waveParams.amplitude1 * 0.3;
                                
                                // 改进的圆形波纹 - 从多个中心点扩散，避免固定模式
                                const centerX = Math.sin(time * 0.3) * 15;  // 移动的中心点
                                const centerZ = Math.cos(time * 0.2) * 12;
                                const distance1 = Math.sqrt((xScaled - centerX) * (xScaled - centerX) + (zScaled - centerZ) * (zScaled - centerZ)) * 0.03;
                                const distance2 = Math.sqrt((xScaled + centerX*0.5) * (xScaled + centerX*0.5) + (zScaled + centerZ*0.7) * (zScaled + centerZ*0.7)) * 0.04;
                                const circularWave1 = Math.sin(time * waveParams.speed2 * 1.5 - distance1 * waveParams.frequency2 * 2.0) * waveParams.amplitude2 * 0.3;
                                const circularWave2 = Math.cos(time * waveParams.speed3 * 2.0 - distance2 * waveParams.frequency3 * 1.8) * waveParams.amplitude3 * 0.2;
                                
                                // 多角度交叉波浪 - 使用非45度角组合（30度、60度、22度等）
                                const angle30 = Math.sin(time * waveParams.speed2 * 1.2 + (xScaled * 0.866 + zScaled * 0.5) * waveParams.frequency2) * waveParams.amplitude2 * 0.15;  // 30度
                                const angle60 = Math.sin(time * waveParams.speed3 * 1.8 + (xScaled * 0.5 + zScaled * 0.866) * waveParams.frequency3) * waveParams.amplitude3 * 0.12;  // 60度
                                const angle22 = Math.cos(time * waveParams.speed2 * 2.2 + (xScaled * 0.927 + zScaled * 0.375) * waveParams.frequency2 * 1.3) * waveParams.amplitude2 * 0.1;  // 22度
                                const angle67 = Math.cos(time * waveParams.speed3 * 1.6 + (xScaled * 0.375 - zScaled * 0.927) * waveParams.frequency3 * 1.1) * waveParams.amplitude3 * 0.08;  // 67度
                                
                                // 高频表面涟漪 - X和Z方向完全独立的快速波纹
                                const surfaceRippleX = Math.sin(time * waveParams.speed4 * 5.0 + xScaled * waveParams.frequency4 * 4.0) * waveParams.amplitude4 * 0.25;
                                const surfaceRippleZ = Math.cos(time * waveParams.speed4 * 4.5 + zScaled * waveParams.frequency4 * 3.5) * waveParams.amplitude4 * 0.2;
                                const microRipple1 = Math.sin(time * waveParams.speed4 * 8.0 + xScaled * waveParams.frequency4 * 6.0) * waveParams.amplitude4 * 0.15;
                                const microRipple2 = Math.cos(time * waveParams.speed4 * 7.5 + zScaled * waveParams.frequency4 * 5.5) * waveParams.amplitude4 * 0.1;
                                
                                // 改进的风向波浪 - 使用变化的风向和风速
                                const windAngle = time * 0.08;  // 缓慢变化的风向
                                const windX = Math.cos(windAngle);
                                const windZ = Math.sin(windAngle);
                                const windWave1 = Math.sin(time * waveParams.windSpeed * 2.0 + (xScaled * windX + zScaled * windZ) * waveParams.windFrequency) * waveParams.windAmplitude * 0.25;
                                const windWave2 = Math.cos(time * waveParams.windSpeed * 1.3 + (xScaled * windX * 0.7 - zScaled * windZ * 0.8) * waveParams.windFrequency * 1.5) * waveParams.windAmplitude * 0.15;
                                
                                // 随机湍流和噪声 - 使用多个不同频率的噪声函数
                                const turbulence1 = Math.sin(xScaled * 0.08 + zScaled * 0.06 + time * 1.2) * Math.cos(xScaled * 0.12 - zScaled * 0.09 + time * 0.8) * 0.4;
                                const turbulence2 = Math.cos(xScaled * 0.15 + zScaled * 0.11 + time * 1.5) * Math.sin(xScaled * 0.07 + zScaled * 0.13 + time * 1.0) * 0.25;
                                const turbulence3 = Math.sin(xScaled * 0.2 - zScaled * 0.16 + time * 2.0) * 0.15;
                                
                                // 组合所有波浪效果，优化系数获得更自然的起伏
                                const totalWaveHeight = (longWaveX + longWaveZ + circularWave1 + circularWave2 + 
                                                       angle30 + angle60 + angle22 + angle67 + 
                                                       surfaceRippleX + surfaceRippleZ + microRipple1 + microRipple2 +
                                                       windWave1 + windWave2 + turbulence1 + turbulence2 + turbulence3) * 0.35;
                                positions[i + 1] = y + totalWaveHeight; // 在Y轴方向起伏
                                
                                // 调试输出 - 每600帧输出一次波浪信息，帮助确认效果
                                if (i === 0 && frameCount % 600 === 0) {
                                    console.log("水面波浪调试 - 总高度:", totalWaveHeight.toFixed(3), "位置:", {x: x.toFixed(2), y: y.toFixed(2), z: z.toFixed(2)});
                                }
                            }
                            obj.geometry.attributes.position.needsUpdate = true;
                            obj.geometry.computeVertexNormals(); // 重新计算法线以获得更好的光照
                        }
                    }
                    
                    // 动态调整材质属性，模拟水面反射和折射
                    const waveIntensity = Math.sin(time * 0.4) * 0.25 + 0.75; // 更平缓的变化
                    const rippleIntensity = Math.sin(time * 1.8) * 0.15 + 0.85; // 涟漪效果
                    
                    // 更自然的材质属性变化 - 优化反射效果
                    obj.material.roughness = 0.015 + waveIntensity * 0.015; // 保持低粗糙度获得清晰反射
                    obj.material.metalness = 0.88 + rippleIntensity * 0.05; // 保持高金属度增强反射
                    obj.material.opacity = 0.75 + Math.sin(time * 0.6) * 0.03; // 更稳定的透明度
                    obj.material.envMapIntensity = 1.2 + Math.sin(time * 0.3) * 0.08; // 增强环境反射
                    
                    // 次表面散射效果 - 优化透射参数
                    obj.material.transmission = 0.82 + Math.sin(time * 0.5) * 0.05; // 保持透射效果
                    obj.material.thickness = 0.4 + Math.sin(time * 0.7) * 0.08; // 优化厚度感
                    
                    // 更自然的颜色变化（模拟水深和天空反射）
                    const depthHue = 0.58 + Math.sin(time * 0.15) * 0.03; // 蓝色调，微调变化
                    const depthSaturation = 0.52 + Math.sin(time * 0.25) * 0.05; // 优化饱和度
                    const depthLightness = 0.45 + Math.sin(time * 0.35) * 0.06; // 优化亮度
                    obj.material.color.setHSL(depthHue, depthSaturation, depthLightness);
                    
                    // 优化高光反射效果
                    obj.material.reflectivity = 0.9 + Math.sin(time * 0.5) * 0.03;
                }
                
                // 更新玻璃材质的动态光线折射效果
                if (obj.userData.isGlass && obj.material) {
                    if (backgroundRecoveryFrames > 0) {
                        return; // 恢复期间跳过重负载更新以避免卡顿
                    }
                    
                    const time = clock.getElapsedTime();
                    
                    // 动态调整折射率，模拟不同角度的光线折射
                    const refractionVariation = Math.sin(time * 0.3) * 0.01; // 更小的折射率变化
                    obj.material.ior = 1.5 + refractionVariation; // 玻璃的折射率在1.49-1.51之间变化
                    
                    // 动态调整透射强度，模拟光线穿透效果
                    const transmissionIntensity = Math.sin(time * 0.4) * 0.05 + 0.9; // 0.85-0.95之间变化
                    obj.material.transmission = transmissionIntensity;
                    
                    // 动态调整厚度，影响光线折射的强度
                    const thicknessVariation = Math.sin(time * 0.6) * 0.02 + 0.1; // 0.08-0.12之间变化
                    obj.material.thickness = thicknessVariation;
                    
                    // 微调粗糙度，模拟玻璃表面的细微变化
                    const roughnessVariation = Math.sin(time * 0.8) * 0.005 + 0.005; // 0.000-0.010之间变化
                    obj.material.roughness = roughnessVariation;
                    
                    // 动态调整环境反射强度 - 大幅降低以避免过亮
                    const envMapVariation = Math.sin(time * 0.2) * 0.05 + 0.3; // 0.25-0.35之间变化
                    obj.material.envMapIntensity = envMapVariation;
                    
                    // 微调透明度，模拟光线角度变化对透明度的影响
                    const opacityVariation = Math.sin(time * 0.5) * 0.05 + 0.3; // 0.25-0.35之间变化
                    obj.material.opacity = opacityVariation;
                    
                    // 动态调整清漆效果，降低强度避免过亮
                    const clearcoatVariation = Math.sin(time * 0.7) * 0.02 + 0.1; // 0.08-0.12之间变化
                    obj.material.clearcoat = clearcoatVariation;
                    obj.material.clearcoatRoughness = 0.05 + Math.sin(time * 1.2) * 0.01; // 0.04-0.06之间变化
                    
                    // 调试输出 - 每600帧输出一次玻璃材质信息
                    if (frameCount % 600 === 0) {
                        console.log("玻璃材质调试 - 折射率:", obj.material.ior.toFixed(3), 
                                  "透射:", obj.material.transmission.toFixed(3), 
                                  "厚度:", obj.material.thickness.toFixed(3));
                    }
                }
            });
            
            frameCount++;
            if (backgroundRecoveryFrames > 0) {
                backgroundRecoveryFrames--;
            }
            
            updateShadowCalculation();
            
            // 渲染场景，支持光晕效果和滤镜效果
            try {
                if (bloomEnabled && bloomComposer) {
                    bloomComposer.render();
                    
                    // 如果启用了滤镜，在光晕效果后应用滤镜
                    if (currentFilter && filterComposer) {
                        filterComposer.render();
                    }
                } else if (currentFilter && filterComposer) {
                    // 只应用滤镜效果
                    filterComposer.render();
                } else {
                    // 普通渲染
                    renderer.render(scene, camera);
                }
            } catch (error) {
                console.error('渲染错误，回退到普通渲染:', error);
                // 强制禁用所有效果并回退到普通渲染
                bloomEnabled = false;
                currentFilter = null;
                renderer.render(scene, camera);
            }
            
            // 状态同步 tick - 定期发送模型状态更新
            if (modelStateSync) {
                modelStateSync.tick();
            }
        }

        // 更新阴影计算范围
        function updateShadowCalculation() {
            if (!shadowsEnabled) return;
            
            const cameraBox = new THREE.Box3();
            const cameraSize = new THREE.Vector3(shadowRange, shadowRange, shadowRange);
            cameraBox.setFromCenterAndSize(camera.position, cameraSize);
            
            lights.forEach(light => {
                const lightPos = light.position;
                const inRange = cameraBox.containsPoint(lightPos);
                light.castShadow = inRange;
                
                if (light.userData.type === 'pointLight') {
                    light.shadow.mapSize.width = 1024;
                    light.shadow.mapSize.height = 1024;
                    light.shadow.bias = -0.0001;
                }
            });
            
            objects.forEach(obj => {
                if (obj.isMesh) {
                    const objInRange = cameraBox.intersectsBox(obj.userData.bounds);
                    obj.castShadow = objInRange && obj.material.opacity > transparencyThreshold;
                    obj.receiveShadow = objInRange;
                } else if (obj.isGroup && obj.userData.bounds) {
                    // 处理GLTF/OBJ模型组 - 修复视锥体裁剪问题
                    const objInRange = cameraBox.intersectsBox(obj.userData.bounds);
                    obj.traverse(child => {
                        if (child.isMesh) {
                            child.castShadow = objInRange && child.material.opacity > transparencyThreshold;
                            child.receiveShadow = objInRange;
                        }
                    });
                }
            });
        }

        // 获取模型动画列表
        function getModelAnimations(id) {
            if (!animations.has(id)) {
                return [];
            }
            
            const modelAnimations = animations.get(id);
            return modelAnimations.map(animation => animation.name);
        }

        // 设置动画过渡时间
        function setAnimationTransition(id, transitionTime) {
            animationTransitions.set(id, Math.max(0, transitionTime)); // 确保过渡时间不为负数
            return true;
        }

        // 播放模型动画
        function playModelAnimation(id, animationName, repeatMode = '重复播放') {
            if (!animationMixer.has(id) || !animations.has(id)) {
                return false;
            }
            
            const mixer = animationMixer.get(id);
            const modelAnimations = animations.get(id);
            const animationClip = modelAnimations.find(clip => clip.name === animationName);
            
            if (!animationClip) {
                return false;
            }
            
            const animationState = activeAnimations.get(id);
            const transitionTime = animationTransitions.get(id) || 0.5; // 默认过渡时间0.5秒
            
            // 创建新动画动作
            const newAction = mixer.clipAction(animationClip);
            
            // 设置重复模式
            switch (repeatMode) {
                case '重复播放':
                    newAction.setLoop(THREE.LoopRepeat);
                    break;
                case '播放一次':
                    newAction.setLoop(THREE.LoopOnce);
                    newAction.clampWhenFinished = true;
                    break;
                case '停止于最后一帧':
                    newAction.setLoop(THREE.LoopOnce);
                    newAction.clampWhenFinished = true;
                    break;
            }
            
            // 如果有正在播放的动画，进行平滑过渡
            if (animationState.currentAction && animationState.isPlaying) {
                const currentAction = animationState.currentAction;
                
                // 设置过渡
                if (transitionTime > 0) {
                    // 淡出当前动画
                    currentAction.fadeOut(transitionTime);
                    // 淡入新动画
                    newAction.reset().fadeIn(transitionTime).play();
                } else {
                    // 立即切换
                    currentAction.stop();
                    newAction.play();
                }
            } else {
                // 没有当前动画，直接播放
                newAction.play();
            }
            
            // 更新动画状态
            animationState.currentAction = newAction;
            animationState.isPlaying = true;
            animationState.repeatMode = repeatMode;
            
            return true;
        }

        // 停止模型动画
        function stopModelAnimation(id) {
            if (!animationMixer.has(id) || !activeAnimations.has(id)) {
                return false;
            }
            
            const animationState = activeAnimations.get(id);
            
            if (animationState.currentAction && animationState.isPlaying) {
                animationState.currentAction.stop();
                animationState.isPlaying = false;
                return true;
            }
            
            return false;
        }

        // 更新模型边界框 - 用于动画模型
        function updateModelBounds(id) {
            if (objects.has(id)) {
                const obj = objects.get(id);
                if (obj.userData.bounds) {
                    // 重新计算边界框
                    obj.userData.bounds.setFromObject(obj);
                    //console.log("Updated bounds for model :", obj.userData.bounds);
                }
            }
        }

        // 自适应调整环境贴图更新间隔
        function adaptReflectionUpdateInterval() {
            if (reflectionUpdatePerformance.updateCount < 5) return; // 需要足够的数据样本
            
            const avgTime = reflectionUpdatePerformance.averageUpdateTime;
            let newInterval = reflectionUpdateInterval;
            
            if (avgTime > 50) { // 如果更新时间超过50ms，认为是性能瓶颈
                newInterval = Math.min(120, reflectionUpdateInterval + 10); // 增加更新间隔
                console.log("环境贴图更新性能较低，增加更新间隔到:", newInterval, "帧");
            } else if (avgTime < 20 && reflectionUpdateInterval > 20) { // 如果更新时间小于20ms且当前间隔较大
                newInterval = Math.max(20, reflectionUpdateInterval - 5); // 减少更新间隔
                console.log("环境贴图更新性能良好，减少更新间隔到:", newInterval, "帧");
            }
            
            reflectionUpdateInterval = newInterval;
        }

        // 手动触发环境贴图更新
        function refreshEnvironmentMap(objectIds = []) {
            if (objectIds.length > 0) {
                // 如果指定了对象ID，只更新这些对象的反射
                objectIds.forEach(id => {
                    if (objects.has(id)) {
                        waterObjectsNeedingReflectionUpdate.add(id);
                    }
                });
            } else {
                // 如果没有指定对象ID，更新所有需要反射的对象
                objects.forEach((obj, id) => {
                    if (obj.userData.isWater) {
                        waterObjectsNeedingReflectionUpdate.add(id);
                    }
                });
            }
            console.log("已标记需要环境贴图更新的对象数量:", waterObjectsNeedingReflectionUpdate.size);
        }

        // 更新环境贴图（统一为PMREM + 按需水面反射，限制递归到两层）
        function updateEnvironmentMap() {
            if (!cubeCamera || !cubeRenderTarget) return;

            const updateStartTime = performance.now();

            // 场景检测：是否存在水面对象
            let hasWater = false;
            let waterHeight = 0;

            objects.forEach((obj) => {
                if (obj.userData.isWater) {
                    hasWater = true;
                    waterHeight = obj.position.y;
                }
            });

            // 1) 生成全局环境贴图（基于当前摄像机位置），在捕获期间避免递归反射
            const prevSceneEnv = scene.environment;
            const tempDisabledWaterMaterials = [];
            try {
                // 使用上一帧的环境避免捕获阶段递归（允许最多两层：上一帧一层 + 当前帧一层）
                if (maxReflectionLayers >= 2) {
                    scene.environment = prevSceneEnv || null;
                } else {
                    scene.environment = null;
                }

                // 捕获期间禁用水面的专用envMap，避免其在环境贴图中再反射
                objects.forEach((obj) => {
                    if (obj.userData.isWater && obj.material && obj.material.envMap) {
                        tempDisabledWaterMaterials.push({ obj, envMap: obj.material.envMap, envMapIntensity: obj.material.envMapIntensity });
                        obj.material.envMap = null;
                        obj.material.envMapIntensity = 0;
                        obj.material.needsUpdate = true;
                    }
                });

                cubeCamera.position.copy(camera.position);
                cubeCamera.update(renderer, scene);
            } finally {
                // 捕获后恢复环境为新PMREM（见下方生成），水面env恢复在无水场景下执行
            }

            if (pmremGenerator) {
                try {
                    if (pmremEnvironment) pmremEnvironment.dispose();
                    pmremEnvironment = pmremGenerator.fromCubemap(cubeRenderTarget.texture);
                    scene.environment = pmremEnvironment.texture;
                } catch (e) {
                    console.warn('PMREM 环境生成失败，回退到直接环境贴图:', e);
                    scene.environment = cubeRenderTarget.texture;
                }
            } else {
                scene.environment = cubeRenderTarget.texture;
            }

            // 2) 水面专用反射（镜面原理）：隐藏水面自身，使用当前场景环境（第一层）生成第二层
            if (hasWater) {
                const hiddenWater = [];
                objects.forEach((obj, id) => {
                    if (obj.userData.isWater) {
                        hiddenWater.push(obj);
                        obj.visible = false;
                    }
                });

                // 使用当前PMREM环境作为第一层，让水面反射成为第二层
                if (maxReflectionLayers >= 2) {
                    scene.environment = pmremEnvironment ? pmremEnvironment.texture : scene.environment;
                } else {
                    scene.environment = null;
                }

                const mirrorHeight = 2 * waterHeight - camera.position.y;
                const waterCameraPosition = new THREE.Vector3(camera.position.x, mirrorHeight, camera.position.z);
                cubeCamera.position.copy(waterCameraPosition);
                cubeCamera.update(renderer, scene);

                objects.forEach((obj) => {
                    if (obj.userData.isWater && obj.material) {
                        // 直接使用未预过滤的贴图以保留更锐利的反射
                        obj.material.envMap = cubeRenderTarget.texture;
                        obj.material.envMapIntensity = 1.2;
                        obj.material.needsUpdate = true;
                    }
                });

                // 恢复水面显示
                hiddenWater.forEach(obj => obj.visible = true);
            } else {
                // 无水面时恢复之前禁用的水面材质envMap（容错）
                tempDisabledWaterMaterials.forEach(({ obj, envMap, envMapIntensity }) => {
                    obj.material.envMap = envMap;
                    obj.material.envMapIntensity = envMapIntensity;
                    obj.material.needsUpdate = true;
                });
            }

            // 恢复环境为最新PMREM，确保后续渲染一致
            scene.environment = pmremEnvironment ? pmremEnvironment.texture : scene.environment;

            // 性能监控
            const updateEndTime = performance.now();
            const updateTime = updateEndTime - updateStartTime;
            reflectionUpdatePerformance.lastUpdateTime = updateTime;
            reflectionUpdatePerformance.updateCount++;
            reflectionUpdatePerformance.averageUpdateTime =
                (reflectionUpdatePerformance.averageUpdateTime * (reflectionUpdatePerformance.updateCount - 1) + updateTime) / reflectionUpdatePerformance.updateCount;

            frameCountSinceLastReflectionUpdate = 0;
        }

        // 检查对象是否已存在
        function objectExists(id) {
            return objects.has(id) || lights.has(id) || particles.has(id);
        }

        // 删除现有对象
        function removeExistingObject(id) {
            // 清理动画数据
            if (animationMixer.has(id)) {
                animationMixer.delete(id);
            }
            if (animations.has(id)) {
                animations.delete(id);
            }
            if (activeAnimations.has(id)) {
                activeAnimations.delete(id);
            }
            if (animationTransitions.has(id)) {
                animationTransitions.delete(id);
            }
            

            
            if (objects.has(id)) {
                const obj = objects.get(id);
                
                // 清理物理引擎相关的定时器
                if (obj.userData && obj.userData.rotationTimer) {
                    clearTimeout(obj.userData.rotationTimer);
                    obj.userData.rotationTimer = null;
                }
                if (obj.userData && obj.userData.positionTimer) {
                    clearTimeout(obj.userData.positionTimer);
                    obj.userData.positionTimer = null;
                }
                
                scene.remove(obj);
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(material => material.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
                objects.delete(id);
            }
            if (lights.has(id)) {
                const light = lights.get(id);s
                scene.remove(light);
                
                // 处理不同类型的光源
                if (light.target) {
                    scene.remove(light.target);
                }
                
                // 处理面光（Group类型）
                if (light.userData.type === 'areaLight' && light.children) {
                    light.children.forEach(child => {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) child.material.dispose();
                    });
                }
                
                lights.delete(id);
            }
            if (particles.has(id)) {
                const particle = particles.get(id);
                scene.remove(particle);
                if (particle.geometry) particle.geometry.dispose();
                if (particle.material) particle.material.dispose();
                particles.delete(id);
            }
        }

        // 加载贴图
        function loadTexture(textureId, imageData) {
            return new Promise((resolve) => {
                const loader = new THREE.TextureLoader();
                loader.load(imageData, (texture) => {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    textures.set(textureId, texture);
                    pixelCollisionSystem.loadTextureData(textureId, imageData);
                    resolve(texture);
                });
            });
        }

        // 修改：设置贴图函数 - 保持色调应用
        function setModelTexture(modelId, textureId) {
            if (objects.has(modelId) && textures.has(textureId)) {
                const obj = objects.get(modelId);
                const texture = textures.get(textureId);
                
                if (obj.material) {
                    // 方案A：贴图也保持深度写入！
                    obj.material.transparent = true;
                    obj.material.depthWrite = true;  // 关键修改！
                    obj.material.depthTest = true;
                    obj.material.alphaTest = 0.1;
                    obj.material.map = texture;
                    obj.material.color.copy(obj.userData.originalColor);
                    obj.material.needsUpdate = true;
                    obj.renderOrder = 0;  // 使用默认顺序
                }
                
                obj.userData.hasTexture = true;
                obj.userData.textureId = textureId;
            }
        }

        // 移除模型贴图
        function removeModelTexture(modelId) {
            if (objects.has(modelId)) {
                const obj = objects.get(modelId);
                if (obj.material) {
                    obj.material.map = null;
                    obj.material.needsUpdate = true;
                }
                obj.userData.hasTexture = false;
                obj.userData.textureId = null;
            }
        }

        // 删除贴图
        function deleteTexture(textureId) {
            if (textures.has(textureId)) {
                const texture = textures.get(textureId);
                texture.dispose();
                textures.delete(textureId);
            }
        }

        // 创建立方体
        function createCube(id, x, y, z, width, height, depth, color) {
            if (objectExists(id)) removeExistingObject(id);
            
            const material = new THREE.MeshStandardMaterial({ 
                color: hexToThreeColor(color),
                metalness: 0.8,  // 增加金属度以增强反射效果
                roughness: 0.2   // 降低粗糙度以获得更清晰的反射
            });
            
            const geometry = new THREE.BoxGeometry(width, height, depth, 20, 20, 20); // 增加分段数以支持平滑变形
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(x, y, z);
            cube.castShadow = shadowsEnabled;
            cube.receiveShadow = shadowsEnabled;
            cube.name = id;
            
            cube.userData = {
                originalSize: { width, height, depth },
                type: 'cube',
                bounds: new THREE.Box3().setFromObject(cube),
                brightness: 0,
                originalColor: hexToThreeColor(color).clone(),
                hasTexture: false,
                textureId: null,
                isMetalBlock: true,  // 标记为金属块，用于特殊反射处理
                collisionType: 'simple'  // 默认碰撞类型
            };
            
            scene.add(cube);
            objects.set(id, cube);
            
            // 初始化物理引擎边界框
            if (physicsEngine) {
                physicsEngine.setModelPhysics(id, true, 9.8, 0.3, 0.01, 0.5);
                console.log("立方体物理属性已初始化: " + id);
            }
            
            // 添加对象后更新环境贴图
            if (cubeCamera) {
                setTimeout(() => {
                    updateEnvironmentMap();
                    console.log("立方体创建完成 - 环境贴图已更新");
                }, 200);
            }
        }
     
        // 新增：设置建模颜色函数
        function setModelColor(modelId, color) {
            const newColor = hexToThreeColor(color);
            let success = false;
            
            if (objects.has(modelId)) {
                const obj = objects.get(modelId);
                if (obj.material) {
                    // 设置新颜色，贴图会应用这个色调
                    obj.material.color.copy(newColor);
                    obj.userData.originalColor = newColor.clone();
                    obj.material.needsUpdate = true;
                    success = true;
                    
                    // 如果是水面，标记需要更新反射
                    if (obj.userData.isWater && cubeCamera) {
                        waterObjectsNeedingReflectionUpdate.add(modelId);
                    }
                }
            }
            if (lights.has(modelId)) {
                const light = lights.get(modelId);
                
                // 处理不同类型的光源
                if (light.userData.type === 'areaLight') {
                    // 面光需要更新所有子元素的颜色
                    light.children.forEach(child => {
                        if (child.isMesh) {
                            child.material.color.copy(newColor);
                            child.material.emissive.copy(newColor);
                        }
                        if (child.isLight) {
                            child.color.copy(newColor);
                        }
                    });
                    light.userData.color = newColor.clone();
                } else {
                    // 其他类型的光源
                    light.color.copy(newColor);
                }
                success = true;
            }
            if (particles.has(modelId)) {
                const particle = particles.get(modelId);
                particle.material.color.copy(newColor);
                particle.userData.originalColor = newColor.clone();
                particle.material.needsUpdate = true;
                success = true;
            }
            
            return success;
        }        
        
        // 创建球体（避免黑圈问题）
        function createSphere(id, x, y, z, size, color) {
            if (objectExists(id)) removeExistingObject(id);
            
            const material = new THREE.MeshStandardMaterial({ 
                color: hexToThreeColor(color)
            });
            
            const geometry = new THREE.SphereGeometry(Math.max(size, 1), 32, 32);
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(x, y, z);
            sphere.castShadow = shadowsEnabled;
            sphere.receiveShadow = shadowsEnabled;
            sphere.name = id;
            
            sphere.userData = {
                originalSize: { width: size * 2, height: size * 2, depth: size * 2 },
                type: 'sphere',
                bounds: new THREE.Box3().setFromObject(sphere),
                brightness: 0,
                originalColor: hexToThreeColor(color).clone(),
                hasTexture: false,
                textureId: null,
                collisionType: 'simple'  // 默认碰撞类型
            };
            
            scene.add(sphere);
            objects.set(id, sphere);
            console.log("球体创建完成: " + id);
            
            // 初始化物理引擎边界框
            if (physicsEngine) {
                physicsEngine.setModelPhysics(id, true, 9.8, 0.8, 0.01, 0.5);
                console.log("球体物理属性已初始化: " + id);
            }
            
            // 添加球体后更新环境贴图
            if (cubeCamera) {
                setTimeout(() => {
                    updateEnvironmentMap();
                    console.log("球体创建完成 - 环境贴图已更新");
                }, 200);
            }
            
            return sphere;
        }

        // 创建平面
        function createPlane(id, x, y, z, width, height, depth, color) {
            console.log("[平面创建] 开始创建平面: ID=" + id + ", 位置=(" + x + "," + y + "," + z + "), 尺寸=(" + width + "," + height + "," + depth + "), 颜色=" + color);
            
            if (objectExists(id)) {
                console.log("[平面创建] 移除已存在的平面: " + id);
                removeExistingObject(id);
            }

            // 处理不同的参数格式
            let planeWidth, planeHeight, planeDepth;
            if (arguments.length === 7) {
                // 格式: createPlane(id, x, y, z, width, length, color)
                planeWidth = width;
                planeHeight = 0.1; // 默认厚度
                planeDepth = height; // 这里的height实际是length
                color = depth; // 这里的depth实际是color
            } else {
                // 格式: createPlane(id, x, y, z, width, height, depth, color)
                planeWidth = width;
                planeHeight = height;
                planeDepth = depth;
            }

            const geometry = new THREE.BoxGeometry(planeWidth, planeHeight, planeDepth);
            const material = new THREE.MeshStandardMaterial({ 
                color: color,
                roughness: 0.7,
                metalness: 0.1
            });
            
            const plane = new THREE.Mesh(geometry, material);
            plane.position.set(x, y, z);
            plane.castShadow = true;
            plane.receiveShadow = true;
            
            // 设置用户数据
            plane.userData = {
                type: 'plane',
                originalSize: { width: planeWidth, height: planeHeight, depth: planeDepth },
                bounds: {
                    width: planeWidth,
                    height: planeHeight,
                    depth: planeDepth
                },
                collisionType: 'simple' // 默认碰撞类型
            };
            
            scene.add(plane);
            objects.set(id, plane);
            
            console.log("[平面创建] 平面创建完成: " + id);
            
            // 初始化物理属性（如果物理引擎存在）
            if (typeof physicsEngine !== 'undefined' && physicsEngine) {
                physicsEngine.setModelPhysics(id, true, 9.8, 0.8, 0.01, 0.5);
                console.log("平面物理属性已初始化: " + id);
            }
            
            // 添加平面后更新环境贴图
            if (cubeCamera) {
                setTimeout(() => {
                    updateEnvironmentMap();
                    console.log("平面创建完成 - 环境贴图已更新");
                }, 200);
            }
            
            return plane;
        }

        // 导入外部模型
        async function importModel(id, fileUrl, scale) {
            console.log("[模型加载] 开始加载模型: ID=" + id + ", URL=" + fileUrl + ", 缩放=" + scale);
            
            if (objectExists(id)) {
                console.log("[模型加载] 移除已存在的模型: " + id);
                removeExistingObject(id);
            }
            
            try {
                if (fileUrl.endsWith('.gltf') || fileUrl.endsWith('.glb') || fileUrl.startsWith('data:application/octet-stream;base64,')) {
                    console.log("[模型加载] 检测到GLTF/GLB模型，开始加载...");
                    const loader = new THREE.GLTFLoader();
                    
                    // 添加加载进度监听
                    const onProgress = (xhr) => {
                        if (xhr.lengthComputable) {
                            const percentComplete = xhr.loaded / xhr.total * 100;
                            console.log("[模型加载] GLTF加载进度: " + Math.round(percentComplete) + "%");
                        }
                    };
                    
                    // 特殊处理base64编码的GLB模型
                    if (fileUrl.startsWith('data:application/octet-stream;base64,')) {
                        console.log("[模型加载] 检测到base64编码的GLB模型，正在解码...");
                        try {
                            // 从base64数据URL中提取base64部分
                            const base64Data = fileUrl.split(',')[1];
                            // 将base64转换为ArrayBuffer
                            const binaryString = atob(base64Data);
                            const bytes = new Uint8Array(binaryString.length);
                            for (let i = 0; i < binaryString.length; i++) {
                                bytes[i] = binaryString.charCodeAt(i);
                            }
                            
                            // 创建Blob对象并生成URL
                            const blob = new Blob([bytes], { type: 'application/octet-stream' });
                            const glbUrl = URL.createObjectURL(blob);
                            
                            // 使用生成的URL加载GLB模型
                            const gltf = await new Promise((resolve, reject) => {
                                loader.load(glbUrl, resolve, onProgress, reject);
                            });
                            
                            // 释放创建的URL
                            URL.revokeObjectURL(glbUrl);
                            
                            console.log("[模型加载] base64 GLB模型加载完成，开始处理...");
                            
                            const model = gltf.scene;
                            model.scale.set(scale, scale, scale);
                            console.log("[模型加载] 模型缩放设置为: " + scale);
                            
                            // 处理动画
                            if (gltf.animations && gltf.animations.length > 0) {
                                console.log("[模型加载] 发现 " + gltf.animations.length + " 个动画");
                                // 创建动画混合器
                                const mixer = new THREE.AnimationMixer(model);
                                animationMixer.set(id, mixer);
                                
                                // 存储动画剪辑
                                animations.set(id, gltf.animations);
                                
                                // 初始化活动动画状态
                                activeAnimations.set(id, {
                                    currentAction: null,
                                    isPlaying: false,
                                    repeatMode: '重复播放'
                                });
                                
                                // 初始化动画过渡时间
                                animationTransitions.set(id, 0.5);
                            } else {
                                console.log("[模型加载] 未发现动画数据");
                            }
                            
                            let meshCount = 0;
                            model.traverse(child => {
                                if (child.isMesh) {
                                    meshCount++;
                                    child.castShadow = shadowsEnabled;
                                    child.receiveShadow = shadowsEnabled;
                                    // 关闭视锥体裁剪，防止模型被错误裁剪
                                    child.frustumCulled = false;
                                    if (child.material && !child.material.isMeshStandardMaterial) {
                                        console.log("[模型加载] 将材质转换为标准材质: " + child.material.type);
                                        child.material = new THREE.MeshStandardMaterial({
                                            color: child.material.color || 0xFFFFFF,
                                            map: child.material.map,
                                            metalness: 0.2,  // 降低金属度以减少摩尔纹
                                            roughness: 0.8,  // 增加粗糙度以减少高光导致的摩尔纹
                                            side: THREE.FrontSide  // 改回单面渲染以提高清晰度
                                        });
                                    } else if (child.material && child.material.isMeshStandardMaterial) {
                                        // 优化现有标准材质设置
                                        child.material.metalness = child.material.metalness !== undefined ? child.material.metalness : 0.2;
                                        child.material.roughness = child.material.roughness !== undefined ? child.material.roughness : 0.8;
                                        child.material.side = THREE.FrontSide;
                                        
                                        // 处理纹理以减少摩尔纹，特别是法线贴图
                                        if (child.material.map) {
                                            child.material.map.anisotropy = 2;  // 降低各向异性以减少摩尔纹
                                            child.material.map.wrapS = THREE.RepeatWrapping;
                                            child.material.map.wrapT = THREE.RepeatWrapping;
                                            child.material.map.needsUpdate = true;
                                        }
                                        
                                        // 特殊处理法线贴图
                                        if (child.material.normalMap) {
                                            child.material.normalMap.anisotropy = 1;  // 法线贴图使用更低的各向异性
                                            child.material.normalScale.set(0.8, 0.8);  // 降低法线贴图强度
                                            child.material.normalMap.needsUpdate = true;
                                        }
                                    }
                                    child.material.needsUpdate = true;
                                }
                            });
                            
                            console.log("[模型加载] 模型包含 " + meshCount + " 个网格");
                            
                            // 计算模型的边界框 - 修复视锥体裁剪问题
                            const box = new THREE.Box3().setFromObject(model);
                            model.userData = {
                                bounds: box,
                                type: 'gltf_model',
                                hasTexture: false,
                                textureId: null,
                                collisionType: 'simple'  // 默认碰撞类型
                            };
                            
                            scene.add(model);
                    objects.set(id, model);
                    console.log("[模型加载] base64 GLB模型加载成功并添加到场景: " + id);
                    console.log("[模型加载] 模型边界框:", box);
                    
                    // 添加模型后更新环境贴图
                    if (cubeCamera) {
                        setTimeout(() => {
                            updateEnvironmentMap();
                            console.log("GLTF模型创建完成 - 环境贴图已更新");
                        }, 300);
                    }
                        } catch (error) {
                            console.error("[模型加载] base64 GLB模型解码失败: " + error.message, error);
                            throw error;
                        }
                    } else {
                        // 正常处理URL格式的GLTF/GLB模型
                        const gltf = await loader.loadAsync(fileUrl, onProgress);
                        console.log("[模型加载] GLTF模型加载完成，开始处理...");
                        
                        const model = gltf.scene;
                        model.scale.set(scale, scale, scale);
                        console.log("[模型加载] 模型缩放设置为: " + scale);
                        
                        // 处理动画
                        if (gltf.animations && gltf.animations.length > 0) {
                            console.log("[模型加载] 发现 " + gltf.animations.length + " 个动画");
                            // 创建动画混合器
                            const mixer = new THREE.AnimationMixer(model);
                            animationMixer.set(id, mixer);
                            
                            // 存储动画剪辑
                            animations.set(id, gltf.animations);
                            
                            // 初始化活动动画状态
                            activeAnimations.set(id, {
                                currentAction: null,
                                isPlaying: false,
                                repeatMode: '重复播放'
                            });
                            
                            // 初始化动画过渡时间
                            animationTransitions.set(id, 0.5);
                        } else {
                            console.log("[模型加载] 未发现动画数据");
                        }
                        
                        let meshCount = 0;
                        model.traverse(child => {
                            if (child.isMesh) {
                                meshCount++;
                                child.castShadow = shadowsEnabled;
                                child.receiveShadow = shadowsEnabled;
                                // 关闭视锥体裁剪，防止模型被错误裁剪
                                child.frustumCulled = false;
                                if (child.material && !child.material.isMeshStandardMaterial) {
                                    console.log("[模型加载] 将材质转换为标准材质: " + child.material.type);
                                    child.material = new THREE.MeshStandardMaterial({
                                        color: child.material.color || 0xFFFFFF,
                                        map: child.material.map,
                                        metalness: 0.2,  // 降低金属度以减少摩尔纹
                                        roughness: 0.8,  // 增加粗糙度以减少高光导致的摩尔纹
                                        side: THREE.FrontSide  // 改回单面渲染以提高清晰度
                                    });
                                } else if (child.material && child.material.isMeshStandardMaterial) {
                                    // 优化现有标准材质设置
                                    child.material.metalness = child.material.metalness !== undefined ? child.material.metalness : 0.2;
                                    child.material.roughness = child.material.roughness !== undefined ? child.material.roughness : 0.8;
                                    child.material.side = THREE.FrontSide;
                                    
                                    // 处理纹理以减少摩尔纹，特别是法线贴图
                                    if (child.material.map) {
                                        child.material.map.anisotropy = 2;  // 降低各向异性以减少摩尔纹
                                        child.material.map.wrapS = THREE.RepeatWrapping;
                                        child.material.map.wrapT = THREE.RepeatWrapping;
                                        child.material.map.needsUpdate = true;
                                    }
                                    
                                    // 特殊处理法线贴图
                                    if (child.material.normalMap) {
                                        child.material.normalMap.anisotropy = 1;  // 法线贴图使用更低的各向异性
                                        child.material.normalScale.set(0.8, 0.8);  // 降低法线贴图强度
                                        child.material.normalMap.needsUpdate = true;
                                    }
                                }
                                child.material.needsUpdate = true;
                            }
                        });
                        
                        console.log("[模型加载] 模型包含 " + meshCount + " 个网格");
                        
                        // 计算模型的边界框 - 修复视锥体裁剪问题
                        const box = new THREE.Box3().setFromObject(model);
                        model.userData = {
                            bounds: box,
                            type: 'gltf_model',
                            hasTexture: false,
                            textureId: null,
                            collisionType: 'simple'  // 默认碰撞类型
                        };
                        
                        scene.add(model);
                    objects.set(id, model);
                    console.log("[模型加载] GLTF模型加载成功并添加到场景: " + id);
                    console.log("[模型加载] 模型边界框:", box);
                    
                    // 初始化物理引擎边界框
                    if (physicsEngine) {
                        physicsEngine.setModelPhysics(id, true, 9.8, 0.3, 0.01, 0.5);
                        console.log("[模型加载] GLTF模型物理属性已初始化: " + id);
                    }
                    
                    // 添加模型后更新环境贴图
                    if (cubeCamera) {
                        setTimeout(() => {
                            updateEnvironmentMap();
                            console.log("GLTF模型创建完成 - 环境贴图已更新");
                        }, 300);
                    }
                    }
                    
                } else if (fileUrl.endsWith('.obj')) {
                    console.log("[模型加载] 检测到OBJ模型，开始加载...");
                    const loader = new THREE.OBJLoader();
                    
                    // 添加加载进度监听
                    const onProgress = (xhr) => {
                        if (xhr.lengthComputable) {
                            const percentComplete = xhr.loaded / xhr.total * 100;
                            console.log("[模型加载] OBJ加载进度: " + Math.round(percentComplete) + "%");
                        }
                    };
                    
                    const model = await loader.loadAsync(fileUrl, onProgress);
                    console.log("[模型加载] OBJ模型加载完成，开始处理...");
                    
                    model.scale.set(scale, scale, scale);
                    console.log("[模型加载] 模型缩放设置为: " + scale);
                    
                    let meshCount = 0;
                    model.traverse(child => {
                        if (child.isMesh) {
                            meshCount++;
                            child.castShadow = shadowsEnabled;
                            child.receiveShadow = shadowsEnabled;
                            // 关闭视锥体裁剪，防止模型被错误裁剪
                            child.frustumCulled = false;
                            child.material = new THREE.MeshStandardMaterial({
                                color: 0xFFFFFF,
                                metalness: 0.2,  // 降低金属度以减少摩尔纹
                                roughness: 0.8,  // 增加粗糙度以减少高光导致的摩尔纹
                                side: THREE.FrontSide  // 改回单面渲染以提高清晰度
                            });
                            child.material.needsUpdate = true;
                        }
                    });
                    
                    console.log("[模型加载] 模型包含 " + meshCount + " 个网格");
                    
                    // 计算模型的边界框 - 修复视锥体裁剪问题
                    const box = new THREE.Box3().setFromObject(model);
                    model.userData = {
                        bounds: box,
                        type: 'obj_model',
                        hasTexture: false,
                        textureId: null,
                        collisionType: 'simple'  // 默认碰撞类型
                    };
                    
                    scene.add(model);
                    objects.set(id, model);
                    console.log("[模型加载] OBJ模型加载成功并添加到场景: " + id);
                    console.log("[模型加载] 模型边界框:", box);
                    
                    // 初始化物理引擎边界框
                    if (physicsEngine) {
                        physicsEngine.setModelPhysics(id, true, 9.8, 0.3, 0.01, 0.5);
                        console.log("[模型加载] OBJ模型物理属性已初始化: " + id);
                    }
                    
                    // 添加模型后更新环境贴图
                    if (cubeCamera) {
                        setTimeout(() => {
                            updateEnvironmentMap();
                            console.log("OBJ模型创建完成 - 环境贴图已更新");
                        }, 300);
                    }
                    
                } else {
                    console.error("[模型加载] 不支持的模型格式: " + fileUrl);
                    throw new Error("不支持的模型格式: " + fileUrl);
                }
            } catch (error) {
                console.error("[模型加载] 模型加载失败: " + error.message, error);
                console.error("[模型加载] 错误堆栈: " + error.stack);
            }
        }

        // 创建点光源
        function createPointLight(id, x, y, z, intensity, color, range) {
            if (objectExists(id)) removeExistingObject(id);
            
            const light = new THREE.PointLight(hexToThreeColor(color), intensity, range);
            light.position.set(x, y, z);
            light.castShadow = shadowsEnabled;
            
            light.shadow.mapSize.width = 1024;
            light.shadow.mapSize.height = 1024;
            light.shadow.camera.near = 0.5;
            light.shadow.camera.far = range;
            light.shadow.bias = -0.0001;
            
            light.userData = { 
                type: 'pointLight',
                originalSize: { width: range, height: range, depth: range }
            };
            
            scene.add(light);
            lights.set(id, light);
            
            // 添加方向光后更新环境贴图
            if (cubeCamera) {
                setTimeout(() => {
                    updateEnvironmentMap();
                    console.log("方向光创建完成 - 环境贴图已更新");
                }, 100);
            }
            
            // 添加点光源后更新环境贴图（仅在反射开启时）
                    if (cubeCamera && reflectionEnabled) {
                        setTimeout(() => {
                            updateEnvironmentMap();
                            console.log("点光源创建完成 - 环境贴图已更新");
                        }, 100);
                    }
        }

        // 创建日光（方向光）
        function createDirectionalLight(id, x, y, z, intensity, color) {
            if (objectExists(id)) removeExistingObject(id);
            
            const light = new THREE.DirectionalLight(hexToThreeColor(color), intensity);
            light.position.set(x, y, z);
            light.castShadow = shadowsEnabled;
            
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;
            light.shadow.camera.near = 0.5;
            light.shadow.camera.far = 500;
            light.shadow.camera.left = -100;
            light.shadow.camera.right = 100;
            light.shadow.camera.top = 100;
            light.shadow.camera.bottom = -100;
            light.shadow.bias = -0.0001;
            
            light.userData = { 
                type: 'directionalLight',
                originalSize: { width: 200, height: 200, depth: 500 }
            };
            
            scene.add(light);
            lights.set(id, light);
        }

        // 创建聚光
        function createSpotLight(id, x, y, z, targetX, targetY, targetZ, intensity, color, angle, penumbra) {
            if (objectExists(id)) removeExistingObject(id);
            
            const light = new THREE.SpotLight(hexToThreeColor(color), intensity);
            light.position.set(x, y, z);
            light.target.position.set(targetX, targetY, targetZ);
            light.angle = THREE.MathUtils.degToRad(angle);
            light.penumbra = penumbra;
            light.decay = 2;
            light.distance = 200;
            light.castShadow = shadowsEnabled;
            
            light.shadow.mapSize.width = 1024;
            light.shadow.mapSize.height = 1024;
            light.shadow.camera.near = 0.5;
            light.shadow.camera.far = 200;
            light.shadow.bias = -0.0001;
            
            light.userData = { 
                type: 'spotLight',
                originalSize: { width: 100, height: 100, depth: 200 }
            };
            
            scene.add(light);
            scene.add(light.target);
            lights.set(id, light);
            
            // 添加聚光后更新环境贴图（仅在反射开启时）
            if (cubeCamera && reflectionEnabled) {
                setTimeout(() => {
                    updateEnvironmentMap();
                    console.log("聚光创建完成 - 环境贴图已更新");
                }, 100);
            }
        }

        // 创建面光
        function createAreaLight(id, x, y, z, width, height, intensity, color) {
            if (objectExists(id)) removeExistingObject(id);
            
            // 创建矩形平面作为面光源
            const geometry = new THREE.PlaneGeometry(width, height);
            const material = new THREE.MeshBasicMaterial({ 
                color: hexToThreeColor(color),
                side: THREE.DoubleSide,
                emissive: hexToThreeColor(color),
                emissiveIntensity: intensity
            });
            const lightMesh = new THREE.Mesh(geometry, material);
            lightMesh.position.set(x, y, z);
            
            // 添加点光源模拟面光效果
            const pointLight = new THREE.PointLight(hexToThreeColor(color), intensity * 10, 200);
            pointLight.position.set(x, y, z);
            pointLight.castShadow = shadowsEnabled;
            
            pointLight.shadow.mapSize.width = 1024;
            pointLight.shadow.mapSize.height = 1024;
            pointLight.shadow.camera.near = 0.5;
            pointLight.shadow.camera.far = 200;
            pointLight.shadow.bias = -0.0001;
            
            // 创建光源组
            const lightGroup = new THREE.Group();
            lightGroup.add(lightMesh);
            lightGroup.add(pointLight);
            lightGroup.userData = { 
                type: 'areaLight',
                originalSize: { width: width, height: height, depth: 10 },
                intensity: intensity,
                color: hexToThreeColor(color)
            };
            
            scene.add(lightGroup);
            lights.set(id, lightGroup);
            
            // 添加面光后更新环境贴图（仅在反射开启时）
            if (cubeCamera && reflectionEnabled) {
                setTimeout(() => {
                    updateEnvironmentMap();
                    console.log("面光创建完成 - 环境贴图已更新");
                }, 100);
            }
        }

        // 创建粒子
        function createParticle(id, x, y, z, color, intensity, spread) {
            if (objectExists(id)) removeExistingObject(id);
            
            const particleColor = hexToThreeColor(color);
            const material = new THREE.MeshBasicMaterial({
                color: particleColor,
                transparent: true,
                opacity: intensity
            });
            
            const geometry = new THREE.SphereGeometry(5 * spread, 8, 8);
            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(x, y, z);
            particle.name = id;
            
            particle.userData = {
                type: 'particle',
                originalSize: { width: 10, height: 10, depth: 10 },
                intensity: intensity,
                brightness: intensity * 100,
                originalColor: particleColor.clone(),
                hasTexture: false,
                textureId: null
            };
            
            scene.add(particle);
            particles.set(id, particle);
            
            // 添加粒子后更新环境贴图（仅在反射开启时）
            if (cubeCamera && reflectionEnabled) {
                setTimeout(() => {
                    updateEnvironmentMap();
                    console.log("粒子创建完成 - 环境贴图已更新");
                }, 100);
            }
            
            return particle;
        }

        // 创建水面
        function createWater(id, x, y, z, width, depth, color) {
            if (objectExists(id)) removeExistingObject(id);
            
            // 创建更高级的水面材质 - 使用MeshPhysicalMaterial获得更好的透光效果
        const material = new THREE.MeshPhysicalMaterial({ 
            color: hexToThreeColor(color),
            transparent: true,
            opacity: 0.4, // 进一步降低不透明度以允许更多光线穿透
            roughness: 0.01,
            metalness: 0.9,
            depthWrite: false, // 保持false以避免深度冲突
            envMapIntensity: 1.2, // 增强环境贴图强度以获得更清晰的反射
            transmission: 0.98, // 进一步增加透射率以允许光线折射穿透
            thickness: 0.1, // 进一步減少厚度以增加透光性
            ior: 1.33, // 水的折射率
            reflectivity: 0.95,
            side: THREE.DoubleSide,
            clearcoat: 0.1, // 添加清漆层以增强透光效果
            clearcoatRoughness: 0.01,
            envMap: (cubeRenderTarget && reflectionEnabled) ? cubeRenderTarget.texture : null // 根据反射开关决定是否使用环境贴图
        });
            
            // 创建更密集的网格以获得更平滑的波浪效果
            const geometry = new THREE.PlaneGeometry(width, depth, 64, 64);
            // 确保几何体在XY平面上创建，Y轴为高度
            geometry.rotateX(-Math.PI / 2); // 先旋转几何体为水平面
            const water = new THREE.Mesh(geometry, material);
            water.position.set(x, y, z);
            water.castShadow = false; // 水面不投射阴影，避免遮挡光线
            water.receiveShadow = shadowsEnabled;
            water.name = id;
            water.renderOrder = 1; // 设置渲染顺序，确保透明物体正确渲染
            
            // 为水面材质添加特殊标记和效果
            water.userData = {
                originalSize: { width, height: 0.1, depth },
                type: 'water',
                bounds: new THREE.Box3().setFromObject(water),
                brightness: 0,
                originalColor: hexToThreeColor(color).clone(),
                hasTexture: false,
                textureId: null,
                isWater: true,
                waveParams: {
                    amplitude1: 3.2,     // 大波浪振幅 - 降低强度获得更平滑效果
                    frequency1: 0.28,    // 大波浪频率 - 微调频率
                    speed1: 1.5,         // 大波浪速度 - 降低速度更自然
                    amplitude2: 1.8,     // 中波浪振幅 - 降低强度
                    frequency2: 0.65,    // 中波浪频率 - 微调频率
                    speed2: 2.1,         // 中波浪速度 - 降低速度
                    amplitude3: 0.9,     // 小波浪振幅 - 降低强度
                    frequency3: 1.2,    // 小波浪频率 - 微调频率
                    speed3: 2.8,         // 小波浪速度 - 降低速度
                    amplitude4: 0.5,     // 涟漪振幅 - 降低强度
                    frequency4: 1.8,    // 涟漪频率 - 微调频率
                    speed4: 3.5,         // 涟漪速度 - 降低速度
                    windAmplitude: 1.4,  // 风向波浪振幅 - 降低强度
                    windFrequency: 0.15, // 风向波浪频率 - 微调频率
                    windSpeed: 0.9       // 风向波浪速度 - 降低速度
                }
            };
            
            // 保存原始顶点位置用于波动效果
            if (water.geometry && water.geometry.attributes.position) {
                const positions = water.geometry.attributes.position.array;
                water.userData.originalPositions = new Float32Array(positions);
            }
            
            scene.add(water);
            objects.set(id, water);
            
            // 添加水面后更新环境贴图（仅在反射开启时）
            if (cubeCamera && reflectionEnabled) {
                // 立即标记需要更新反射
                waterObjectsNeedingReflectionUpdate.add(id);
                console.log("水面创建完成 - 已标记需要反射更新");
            }
            
            return water;
        }

        // 设置材质
        function setMaterial(id, materialType, roughness, metalness) {
            if (objects.has(id)) {
                const obj = objects.get(id);
                if (obj.material && obj.material.isMeshStandardMaterial) {
                    obj.material.roughness = roughness;
                    obj.material.metalness = metalness;
                    
                    switch(materialType) {
                        case '金属材质':
                            obj.material.roughness = Math.max(0.1, roughness);
                            obj.material.metalness = Math.min(1.0, metalness + 0.3);
                            // 使用场景环境进行反射（PMREM IBL），避免旧算法的逐材质 envMap
                            obj.material.envMap = null; // 确保使用 scene.environment
                            obj.material.envMapIntensity = 1.5; // 增强金属反射强度
                            break;
                        case '塑料材质':
                            obj.material.roughness = Math.max(0.3, roughness);
                            obj.material.metalness = 0.0;
                            break;
                        case '水面材质':
                            obj.material.roughness = Math.max(0.01, roughness);
                            obj.material.metalness = Math.min(0.9, metalness + 0.8);
                            obj.material.transparent = true;
                            obj.material.opacity = 0.4; // 进一步降低不透明度以允许更多光线穿透
                            obj.material.depthWrite = false; // 保持false以避免深度冲突
                            obj.material.envMapIntensity = 1.0;
                            
                            // 为水面材质添加特殊标记和效果
                            obj.userData.isWater = true;
                            
                            // 保存原始顶点位置用于波动效果
                            if (obj.geometry && obj.geometry.attributes.position) {
                                const positions = obj.geometry.attributes.position.array;
                                obj.userData.originalPositions = new Float32Array(positions);
                            }
                            
                            // 添加光线折射效果
                            obj.material.transmission = 0.98; // 进一步增加透射率以允许光线折射穿透
                            obj.material.thickness = 0.1; // 进一步減少厚度以增加透光性
                            obj.material.ior = 1.33; // 水的折射率
                            
                            // 添加反射效果
                            obj.material.reflectivity = 0.95;
                            
                            // 设置双面渲染以支持折射
                            obj.material.side = THREE.DoubleSide;
                            
                            // 添加清漆层以增强透光效果
                            if (obj.material.clearcoat !== undefined) {
                                obj.material.clearcoat = 0.1;
                                obj.material.clearcoatRoughness = 0.01;
                            }
                            
                            // 为水面材质添加环境贴图（根据反射开关）
                            if (cubeRenderTarget && reflectionEnabled) {
                                obj.material.envMap = cubeRenderTarget.texture;
                                // 标记需要更新水面反射
                                if (cubeCamera) {
                                    waterObjectsNeedingReflectionUpdate.add(id);
                                }
                            }
                            break;
                        case '玻璃材质':
                            obj.material.roughness = Math.max(0.0, Math.min(0.05, roughness)); // 玻璃表面非常光滑
                            obj.material.metalness = 0.0; // 玻璃不是金属
                            obj.material.transparent = true;
                            obj.material.opacity = Math.max(0.15, Math.min(0.85, 0.3)); // 降低透明度，增强玻璃质感
                            obj.material.depthWrite = false; // 避免深度冲突
                            
                            // 玻璃的光学属性
                            obj.material.transmission = 0.9; // 高透射率，允许光线穿透
                            obj.material.thickness = 0.1; // 适中的玻璃厚度
                            obj.material.ior = 1.5; // 玻璃的折射率
                            
                            // 反射属性 - 修复天空盒遮挡问题
                            obj.material.reflectivity = 0.05; // 降低反射强度
                            obj.material.envMapIntensity = 0.3; // 大幅降低环境反射强度，避免过亮
                            
                            // 设置双面渲染以支持折射
                            obj.material.side = THREE.DoubleSide;
                            
                            // 添加清漆层增强玻璃效果
                            if (obj.material.clearcoat !== undefined) {
                                obj.material.clearcoat = 0.1; // 降低清漆层强度
                                obj.material.clearcoatRoughness = 0.05; // 轻微的清漆层粗糙度
                            }
                            
                            // 为玻璃材质添加特殊标记
                            obj.userData.isGlass = true;
                            
                            // 修复天空盒遮挡问题：不直接设置envMap，让材质使用scene.environment
                            obj.material.envMap = null; // 确保使用scene.environment而不是cubeRenderTarget
                            
                            // 启用物理正确的光照模型
                            obj.material.physicallyCorrectLights = true;
                            break;
                    }
                    
                    obj.material.needsUpdate = true;
                }
            }
        }

        // 设置对象位置
        function setObjectPosition(id, x, y, z) {
            if (objects.has(id)) {
                const obj = objects.get(id);
                obj.position.set(x, y, z);
                
                // 同步更新物理引擎中的位置，并标记为手动设置
                if (physicsEngine && obj.userData.physicsBody) {
                    const body = obj.userData.physicsBody;
                    
                    // 更新物理体位置
                    body.position.set(x, y, z);
                    
                    // 清除速度，避免物理引擎继续移动
                    body.velocity.set(0, 0, 0);
                    body.angularVelocity.set(0, 0, 0);
                    
                    // 设置手动位置标记，防止物理引擎覆盖
                    obj.userData.manualPositionSet = true;
                    
                    // 清除之前的定时器
                    if (obj.userData.positionTimer) {
                        clearTimeout(obj.userData.positionTimer);
                    }
                    
                    // 设置定时器，100ms后清除手动标记，让物理引擎重新接管
                    obj.userData.positionTimer = setTimeout(() => {
                        obj.userData.manualPositionSet = false;
                        obj.userData.positionTimer = null;
                    }, 100);
                }
                
                if (obj.userData.bounds) {
                    obj.userData.bounds.setFromObject(obj);
                }
                // 如果是水面，标记需要更新反射
                if (obj.userData.isWater && cubeCamera) {
                    waterObjectsNeedingReflectionUpdate.add(id);
                }
            }
            if (lights.has(id)) {
                const light = lights.get(id);
                light.position.set(x, y, z);
            }
            if (particles.has(id)) {
                const particle = particles.get(id);
                particle.position.set(x, y, z);
            }
        }

        // 设置对象旋转
        function setObjectRotation(id, x, y, z) {
            if (objects.has(id)) {
                const obj = objects.get(id);
                
                // 转换为弧度
                const radX = x * (Math.PI / 180);
                const radY = y * (Math.PI / 180);
                const radZ = z * (Math.PI / 180);
                
                // 设置Three.js对象旋转
                obj.rotation.x = radX;
                obj.rotation.y = radY;
                obj.rotation.z = radZ;
                
                // 同步更新物理引擎中的旋转
                if (physicsEngine && physicsEngine.bodies.has(id)) {
                    const body = physicsEngine.bodies.get(id);
                    
                    // 将欧拉角转换为四元数
                    const euler = new THREE.Euler(radX, radY, radZ);
                    const quaternion = new THREE.Quaternion().setFromEuler(euler);
                    
                    // 更新物理体旋转
                    body.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
                    
                    // 清除角速度，避免物理引擎继续旋转
                    body.angularVelocity.set(0, 0, 0);
                    
                    // 标记为手动设置旋转，防止被物理引擎覆盖
                    obj.userData.manualRotationSet = true;
                    
                    // 设置一个定时器，在几帧后清除手动标记，让物理引擎重新接管
                    setTimeout(() => {
                        if (obj.userData) {
                            obj.userData.manualRotationSet = false;
                        }
                    }, 100); // 100ms后清除标记
                    
                    console.log('手动设置模型旋转:', id, {x, y, z});
                }
                
                if (obj.userData.bounds) {
                    obj.userData.bounds.setFromObject(obj);
                }
                
                // 如果是水面，标记需要更新反射
                if (obj.userData.isWater && cubeCamera) {
                    waterObjectsNeedingReflectionUpdate.add(id);
                }
            }
            
            // 灯光和粒子的处理保持不变
            if (lights.has(id)) {
                const light = lights.get(id);
                light.rotation.x = x * (Math.PI / 180);
                light.rotation.y = y * (Math.PI / 180);
                light.rotation.z = z * (Math.PI / 180);
            }
        }

        // 设置对象大小
        function setObjectSize(id, width, height, depth) {
            if (objects.has(id)) {
                const obj = objects.get(id);
                const originalSize = obj.userData.originalSize;
                
                if (obj.userData.type === 'plane' && height > 1) {
                    createPlaneStack(id, obj.position.x, obj.position.y, obj.position.z, width, height, depth, obj.material.color);
                } else {
                    obj.scale.set(
                        width / originalSize.width,
                        height / originalSize.height,
                        depth / originalSize.depth
                    );
                }
                
                if (obj.userData.bounds) {
                    obj.userData.bounds.setFromObject(obj);
                }
                
                // 如果是水面，标记需要更新反射
                if (obj.userData.isWater && cubeCamera) {
                    waterObjectsNeedingReflectionUpdate.add(id);
                }
            }
            if (lights.has(id)) {
                const light = lights.get(id);
                const originalSize = light.userData.originalSize;
                if (light.userData.type === 'pointLight') {
                    light.distance = width;
                }
            }
            if (particles.has(id)) {
                const particle = particles.get(id);
                particle.scale.set(width / 10, height / 10, depth / 10);
            }
        }

        function setObjectTransparency(id, alpha) {
            alpha = Math.max(0, Math.min(1, alpha));
            
            if (objects.has(id)) {
                const obj = objects.get(id);
                if (obj.material) {
                    // 方案A：永远开启深度写入！
                    obj.material.transparent = alpha < 1.0;
                    obj.material.opacity = alpha;
                    obj.material.depthWrite = true;  // 关键修改！
                    obj.castShadow = shadowsEnabled && alpha > transparencyThreshold;
                    obj.material.needsUpdate = true;
                    
                    // 移除所有renderOrder设置，让GPU处理
                    obj.renderOrder = 0;
                }
            }
            if (particles.has(id)) {
                const particle = particles.get(id);
                if (particle.material) {
                    particle.material.opacity = alpha * particle.userData.intensity;
                    particle.material.needsUpdate = true;
                }
            }
        }

        // 修改：亮度设置函数 - 支持完整范围和贴图色调
        function setObjectBrightness(id, brightness) {
            brightness = Math.max(-100, Math.min(100, brightness)); // 统一范围-100到100
            
            if (objects.has(id)) {
                const obj = objects.get(id);
                if (obj.material && obj.material.isMeshStandardMaterial) {
                    if (brightness === 0) {
                        // 亮度为0：恢复原始颜色（保持贴图色调）
                        obj.material.color.copy(obj.userData.originalColor);
                        obj.material.emissive.set(0x000000);
                        obj.material.emissiveIntensity = 0;
                    } else if (brightness > 0) {
                        // 增加亮度：发光效果（保持贴图色调）
                        obj.material.emissive.set(0xFFFFFF);
                        obj.material.emissiveIntensity = brightness / 100;
                    } else if (brightness < 0) {
                        // 减少亮度：变暗（保持贴图色调）
                        const darken = 1 + (brightness / 100);
                        const currentColor = obj.userData.originalColor.clone();
                        const darkenedColor = currentColor.multiplyScalar(Math.max(0, darken));
                        obj.material.color.copy(darkenedColor);
                        obj.material.emissive.set(0x000000);
                        obj.material.emissiveIntensity = 0;
                    }
                    obj.material.needsUpdate = true;
                }
                obj.userData.brightness = brightness;
            }
            if (particles.has(id)) {
                const particle = particles.get(id);
                particle.userData.intensity = Math.max(0, 1 + (brightness / 100));
                particle.userData.brightness = brightness;
                if (particle.material) {
                    if (brightness === 0) {
                        particle.material.color.copy(particle.userData.originalColor);
                    } else if (brightness > 0) {
                        particle.material.color.set(0xFFFFFF);
                    } else {
                        const darken = 1 + (brightness / 100);
                        const newColor = particle.userData.originalColor.clone().multiplyScalar(Math.max(0, darken));
                        particle.material.color.copy(newColor);
                    }
                    particle.material.opacity = particle.userData.intensity;
                    particle.material.needsUpdate = true;
                }
            }
        }

        // 设置相机位置
        function setCameraPosition(x, y, z) {
            camera.position.set(x, y, z);
        }

        // 设置相机旋转
        function setCameraRotation(x, y) {
            camera.rotation.order = 'YXZ';
            camera.rotation.y = y * (Math.PI / 180);
            camera.rotation.x = x * (Math.PI / 180);
        }

        // 设置相机FOV
        function setCameraFOV(fov) {
            camera.fov = fov;
            camera.updateProjectionMatrix();
        }

        // 计算方向
        function calculateDirection(x1, y1, z1, x2, y2, z2, direction) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const dz = z2 - z1;
            
            switch(direction) {
                case 'X方向':
                    return Math.atan2(dz, Math.sqrt(dx*dx + dy*dy)) * (180 / Math.PI);
                case 'Y方向':
                    return Math.atan2(dx, dz) * (180 / Math.PI);
                case 'Z方向':
                    return Math.atan2(dy, dx) * (180 / Math.PI);
                case '水平角度':
                    let horizontal = Math.atan2(dx, dz) * (180 / Math.PI);
                    return horizontal < 0 ? horizontal + 360 : horizontal;
                case '垂直角度':
                    return Math.atan2(dy, Math.sqrt(dx*dx + dz*dz)) * (180 / Math.PI);
                default:
                    return 0;
            }
        }

        // 获取对象属性
        function getObjectProperty(id, property) {
            if (objects.has(id)) {
                const obj = objects.get(id);
                switch(property) {
                    case 'X坐标': return obj.position.x;
                    case 'Y坐标': return obj.position.y;
                    case 'Z坐标': return obj.position.z;
                    case 'X旋转': return obj.rotation.x * (180 / Math.PI);
                    case 'Y旋转': return obj.rotation.y * (180 / Math.PI);
                    case 'Z旋转': return obj.rotation.z * (180 / Math.PI);
                    case '宽度': return obj.userData.originalSize.width * obj.scale.x;
                    case '高度': return obj.userData.originalSize.height * obj.scale.y;
                    case '长度': return obj.userData.originalSize.depth * obj.scale.z;
                }
            }
            if (lights.has(id)) {
                const light = lights.get(id);
                switch(property) {
                    case 'X坐标': return light.position.x;
                    case 'Y坐标': return light.position.y;
                    case 'Z坐标': return light.position.z;
                    case 'X旋转': return light.rotation.x * (180 / Math.PI);
                    case 'Y旋转': return light.rotation.y * (180 / Math.PI);
                    case 'Z旋转': return light.rotation.z * (180 / Math.PI);
                    case '宽度': 
                        if (light.userData.type === 'pointLight') return light.distance;
                        return 0;
                    case '高度': return light.intensity * 100;
                    case '长度': return 0;
                }
            }
            if (particles.has(id)) {
                const particle = particles.get(id);
                switch(property) {
                    case 'X坐标': return particle.position.x;
                    case 'Y坐标': return particle.position.y;
                    case 'Z坐标': return particle.position.z;
                    case 'X旋转': return particle.rotation.x * (180 / Math.PI);
                    case 'Y旋转': return particle.rotation.y * (180 / Math.PI);
                    case 'Z旋转': return particle.rotation.z * (180 / Math.PI);
                    case '宽度': return particle.scale.x * 10;
                    case '高度': return particle.userData.brightness;
                    case '长度': return particle.scale.z * 10;
                }
            }
            return 0;
        }

        // 获取相机属性
        function getCameraProperty(property) {
            switch(property) {
                case 'X坐标': return camera.position.x;
                case 'Y坐标': return camera.position.y;
                case 'Z坐标': return camera.position.z;
                case 'X旋转': return camera.rotation.x * (180 / Math.PI);
                case 'Y旋转': return camera.rotation.y * (180 / Math.PI);
                case 'FOV': return camera.fov;
            }
            return 0;
        }

        // 碰撞检测
        function checkCollisions(modelId) {
            const collidedModels = [];
            const targetObj = objects.get(modelId);
            
            if (!targetObj || !targetObj.userData.bounds) return collidedModels;
            
            objects.forEach((obj, id) => {
                if (id !== modelId && obj.userData.bounds) {
                    if (targetObj.userData.bounds.intersectsBox(obj.userData.bounds)) {
                        collidedModels.push(id);
                    }
                }
            });
            
            return collidedModels;
        }

        // 高级碰撞检测
        function handleAdvancedCollision(modelId, targetId, alphaThreshold) {
            const obj1 = objects.get(modelId);
            const obj2 = objects.get(targetId);
            
            if (!obj1 || !obj2) {
                window.parent.postMessage({
                    type: 'ADVANCED_COLLISION_RESPONSE',
                    containerId: data.containerId,
                    modelId: modelId,
                    targetId: targetId,
                    result: { collided: false, collisionPoints: [] }
                }, '*');
                return;
            }
            
            const result = pixelCollisionSystem.checkPixelCollision(obj1, obj2, alphaThreshold);
            
            window.parent.postMessage({
                type: 'ADVANCED_COLLISION_RESPONSE',
                containerId: data.containerId,
                modelId: modelId,
                targetId: targetId,
                result: result
            }, '*');
        }

        // 设置环境光
        function setAmbientLight(enabled, intensity, color) {
            if (ambientLight) {
                scene.remove(ambientLight);
            }
            
            if (enabled) {
                ambientLight = new THREE.AmbientLight(hexToThreeColor(color), intensity);
                scene.add(ambientLight);
                
                // 增强水面反射效果
                objects.forEach((obj) => {
                    if (obj.userData.isWater && obj.material) {
                        obj.material.envMapIntensity = Math.max(1.2, intensity * 2.0);
                    }
                });
            }
        }

        // 设置雾气
        function setFog(enabled, density, color) {
            fogEnabled = enabled;
            fogDensity = density;
            fogColor = color;
            
            if (enabled) {
                scene.fog = new THREE.FogExp2(hexToThreeColor(color), density);
            } else {
                scene.fog = null;
            }
        }

        // 设置雾气密度
        function setFogDensity(density) {
            fogDensity = density;
            
            if (fogEnabled && scene.fog) {
                scene.fog.density = density;
            }
        }

        // 设置雾气颜色
        function setFogColor(color) {
            fogColor = color;
            
            if (fogEnabled && scene.fog) {
                scene.fog.color = hexToThreeColor(color);
            }
        }

        // 设置雾气吸光度
        function setFogLightAbsorption(absorption) {
            fogLightAbsorption = absorption;
            
            // 吸光度会影响环境光的强度
            if (ambientLight && fogEnabled) {
                ambientLight.intensity = ambientLight.intensity * (1 - absorption * 0.5);
            }
        }

        // 设置坐标轴显示
        function setCoordinateSystem(visible) {
            if (coordinateSystem) {
                coordinateSystem.visible = visible;
            }
        }

        // 设置阴影
        function setShadows(enabled, range) {
            shadowsEnabled = enabled;
            shadowRange = range;
            renderer.shadowMap.enabled = enabled;
            
            objects.forEach(obj => {
                if (obj.isMesh) {
                    obj.castShadow = enabled && obj.material.opacity > transparencyThreshold;
                    obj.receiveShadow = enabled;
                }
            });
            
            lights.forEach(light => {
                light.castShadow = enabled;
            });
        }

        // 设置透明度阈值
        function setTransparencyThreshold(threshold) {
            transparencyThreshold = Math.max(0.3, Math.min(1.0, threshold));
            
            objects.forEach(obj => {
                if (obj.isMesh && obj.material) {
                    obj.castShadow = shadowsEnabled && obj.material.opacity > transparencyThreshold;
                }
            });
        }

        // 设置模型渲染面
        function setModelSide(id, side) {
            if (objects.has(id)) {
                const obj = objects.get(id);
                let threeSide;
                
                switch(side) {
                    case '正面':
                        threeSide = THREE.FrontSide;
                        break;
                    case '背面':
                        threeSide = THREE.BackSide;
                        break;
                    case '双面':
                        threeSide = THREE.DoubleSide;
                        break;
                    default:
                        threeSide = THREE.FrontSide;
                }
                
                // 遍历模型的所有网格，设置渲染面
                obj.traverse(child => {
                    if (child.isMesh && child.material) {
                        child.material.side = threeSide;
                        child.material.needsUpdate = true;
                    }
                });
            }
        }

        // 设置光源位置
        function setLightPosition(id, x, y, z) {
            if (lights.has(id)) {
                const light = lights.get(id);
                light.position.set(x, y, z);
            }
        }

        // 设置光源旋转（主要用于方向光和聚光）
        function setLightRotation(id, x, y, z) {
            if (lights.has(id)) {
                const light = lights.get(id);
                light.rotation.x = x * (Math.PI / 180);
                light.rotation.y = y * (Math.PI / 180);
                light.rotation.z = z * (Math.PI / 180);
            }
        }

        // 设置光源目标点（主要用于聚光和方向光）
        function setLightTarget(id, targetX, targetY, targetZ) {
            if (lights.has(id)) {
                const light = lights.get(id);
                if (light.target) {
                    light.target.position.set(targetX, targetY, targetZ);
                }
            }
        }

        // 设置光源强度
        function setLightIntensity(id, intensity) {
            if (lights.has(id)) {
                const light = lights.get(id);
                
                // 处理面光的特殊逻辑
                if (light.userData.type === 'areaLight') {
                    light.children.forEach(child => {
                        if (child.isLight) {
                            child.intensity = intensity * 10; // 点光源部分
                        }
                        if (child.isMesh && child.material) {
                            child.material.emissiveIntensity = intensity; // 网格部分
                        }
                    });
                } else {
                    light.intensity = intensity;
                }
            }
        }

        // 设置光源颜色
        function setLightColor(id, color) {
            if (lights.has(id)) {
                const light = lights.get(id);
                const newColor = hexToThreeColor(color);
                
                // 处理面光的特殊逻辑
                if (light.userData.type === 'areaLight') {
                    light.children.forEach(child => {
                        if (child.isLight) {
                            child.color.copy(newColor);
                        }
                        if (child.isMesh && child.material) {
                            child.material.color.copy(newColor);
                            child.material.emissive.copy(newColor);
                        }
                    });
                    light.userData.color = newColor.clone();
                } else {
                    light.color.copy(newColor);
                }
            }
        }

        // 设置聚光角度
        function setLightAngle(id, angle) {
            if (lights.has(id)) {
                const light = lights.get(id);
                if (light.userData.type === 'spotLight') {
                    light.angle = THREE.MathUtils.degToRad(angle);
                }
            }
        }

        // 设置聚光边缘衰减
        function setLightPenumbra(id, penumbra) {
            if (lights.has(id)) {
                const light = lights.get(id);
                if (light.userData.type === 'spotLight') {
                    light.penumbra = penumbra;
                }
            }
        }

        // 设置光源衰减
        function setLightDecay(id, decay) {
            if (lights.has(id)) {
                const light = lights.get(id);
                if (light.userData.type === 'spotLight' || light.userData.type === 'pointLight') {
                    light.decay = decay;
                }
            }
        }

        // 设置光源距离（范围）
        function setLightDistance(id, distance) {
            if (lights.has(id)) {
                const light = lights.get(id);
                if (light.userData.type === 'spotLight' || light.userData.type === 'pointLight') {
                    light.distance = distance;
                }
            }
        }

        // 设置面光源尺寸
        function setAreaLightSize(id, width, height) {
            if (lights.has(id)) {
                const light = lights.get(id);
                if (light.userData.type === 'areaLight') {
                    // 更新面光源的几何尺寸
                    light.children.forEach(child => {
                        if (child.isMesh) {
                            // 更新网格的尺寸
                            child.scale.set(width / 100, height / 100, 1); // 假设默认尺寸为100x100
                        }
                    });
                    
                    // 更新用户数据中的尺寸信息
                    light.userData.width = width;
                    light.userData.height = height;
                }
            }
        }

        // 响应窗口大小变化
        function onResize() {
            if (camera && renderer) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                updateRendererSettings();
            }
        }

        // 在消息监听器中添加新功能支持
        window.addEventListener('message', function(event) {
            const data = event.data;
            
            try {
                switch(data.type) {
                    case 'CREATE_PLANE':
                        createPlane(data.modelId, data.x, data.y, data.z, data.width, data.height, data.length, data.color);
                        break;
                        
                    case 'SET_MODEL_COLOR':
                        const success = setModelColor(data.modelId, data.color);
                        window.parent.postMessage({
                            type: 'SET_MODEL_COLOR_RESPONSE',
                            containerId: data.containerId,
                            modelId: data.modelId,
                            success: success
                        }, '*');
                        break;
                    case 'CREATE_CUBE':
                        createCube(data.modelId, data.x, data.y, data.z, data.width, data.height, data.depth, data.color);
                        break;
                    case 'CREATE_PLANE':
                        createPlane(data.modelId, data.x, data.y, data.z, data.width, data.length, data.color);
                        break;
                    case 'ADD_WATER':
                        createWater(data.modelId, data.x, data.y, data.z, data.width, data.depth, data.color);
                        break;
                    case 'CREATE_SPHERE':
                        createSphere(data.modelId, data.x, data.y, data.z, data.size, data.color);
                        break;
                    case 'IMPORT_MODEL':
                        console.log("[消息处理] 收到导入模型请求: 模型ID=" + data.modelId + ", URL=" + data.fileUrl + ", 缩放=" + data.scale);
                        importModel(data.modelId, data.fileUrl, data.scale);
                        break;
                    case 'CREATE_POINT_LIGHT':
                        createPointLight(data.lightId, data.x, data.y, data.z, data.intensity, data.color, data.range);
                        break;
                    case 'CREATE_DIRECTIONAL_LIGHT':
                        createDirectionalLight(data.lightId, data.x, data.y, data.z, data.intensity, data.color);
                        break;
                    case 'CREATE_SPOT_LIGHT':
                        createSpotLight(data.lightId, data.x, data.y, data.z, data.targetX, data.targetY, data.targetZ, data.intensity, data.color, data.angle, data.penumbra);
                        break;
                    case 'CREATE_AREA_LIGHT':
                        createAreaLight(data.lightId, data.x, data.y, data.z, data.width, data.height, data.intensity, data.color);
                        break;
                    case 'CREATE_PARTICLE':
                        createParticle(data.particleId, data.x, data.y, data.z, data.color, data.intensity, data.spread);
                        break;
                    case 'LOAD_TEXTURE':
                        loadTexture(data.textureId, data.imageData);
                        break;
                    case 'SET_MODEL_TEXTURE':
                        setModelTexture(data.modelId, data.textureId);
                        break;
                    case 'REMOVE_MODEL_TEXTURE':
                        removeModelTexture(data.modelId);
                        break;
                    case 'DELETE_TEXTURE':
                        deleteTexture(data.textureId);
                        break;
                    case 'SET_MATERIAL':
                        setMaterial(data.modelId, data.materialType, data.roughness, data.metalness);
                        break;
                    case 'SET_BACKGROUND':
                        switch(data.style) {
                            case '透明': scene.background = null; break;
                            case '纯白': scene.background = new THREE.Color(0xFFFFFF); break;
                            case '纯黑': scene.background = new THREE.Color(0x000000); break;
                            case '天空蓝': scene.background = new THREE.Color(0x87CEEB); break;
                        }
                        break;
                    case 'SET_COORDINATE_SYSTEM':
                        setCoordinateSystem(data.visible);
                        break;
                    case 'SET_RENDER_QUALITY':
                        switch(data.quality) {
                            case '极致优化': renderQuality = 0.1; break;
                            case '性能优先': renderQuality = 0.3; break;
                            case '平衡模式': renderQuality = 0.6; break;
                            case '质量优先': renderQuality = 0.8; break;
                            case '极致质量': renderQuality = 1.0; break;
                        }
                        updateRendererSettings();
                        break;
                    case 'SET_AMBIENT_LIGHT':
                        setAmbientLight(data.enabled, data.intensity, data.color);
                        break;
                    case 'SET_SHADOWS':
                        setShadows(data.enabled, data.range);
                        break;
                    case 'SET_TRANSPARENCY_THRESHOLD':
                        setTransparencyThreshold(data.threshold);
                        break;
                    case 'SET_MODEL_POSITION':
                        console.log('接收到设置模型位置消息:', data);
                        
                        if (physicsEngine && physicsEngine.bodies.has(data.modelId)) {
                            // 使用物理引擎的方法设置位置
                            physicsEngine.setModelPosition(data.modelId, data.x, data.y, data.z);
                        } else {
                            // 回退到普通方法
                            setObjectPosition(data.modelId, data.x, data.y, data.z);
                        }
                        break;
                    case 'SET_MODEL_ROTATION':
                        console.log('接收到设置模型旋转消息:', data);
                        
                        if (physicsEngine && physicsEngine.bodies.has(data.modelId)) {
                            // 使用物理引擎的方法设置旋转
                            physicsEngine.setModelRotation(data.modelId, data.x, data.y, data.z);
                        } else {
                            // 回退到普通方法
                            setObjectRotation(data.modelId, data.x, data.y, data.z);
                        }
                        break;
                    case 'SET_MODEL_SIZE':
                        setObjectSize(data.modelId, data.width, data.height, data.depth);
                        break;
                    case 'SET_MODEL_TRANSPARENCY':
                        setObjectTransparency(data.modelId, data.alpha);
                        break;
                    case 'SET_MODEL_BRIGHTNESS':
                        setObjectBrightness(data.modelId, data.brightness);
                        break;
                    case 'SET_CAMERA_POSITION':
                        setCameraPosition(data.x, data.y, data.z);
                        break;
                    case 'SET_CAMERA_ROTATION':
                        setCameraRotation(data.x, data.y);
                        break;
                    case 'SET_CAMERA_FOV':
                        setCameraFOV(data.fov);
                        break;
                    case 'GET_MODEL_PROPERTY':
                        const modelValue = getObjectProperty(data.modelId, data.property);
                        window.parent.postMessage({
                            type: 'MODEL_PROPERTY_RESPONSE',
                            containerId: data.containerId,
                            modelId: data.modelId,
                            property: data.property,
                            value: modelValue
                        }, '*');
                        break;
                    case 'GET_CAMERA_PROPERTY':
                        const cameraValue = getCameraProperty(data.property);
                        window.parent.postMessage({
                            type: 'CAMERA_PROPERTY_RESPONSE',
                            containerId: data.containerId,
                            property: data.property,
                            value: cameraValue
                        }, '*');
                        break;
                    case 'CHECK_COLLISIONS':
                        const collided = checkCollisions(data.modelId);
                        window.parent.postMessage({
                            type: 'COLLISION_RESPONSE',
                            containerId: data.containerId,
                            modelId: data.modelId,
                            collidedModels: collided
                        }, '*');
                        break;
                    case 'ADVANCED_COLLISION':
                        handleAdvancedCollision(data.modelId, data.targetId, data.alphaThreshold);
                        break;
                    case 'REMOVE_MODEL':
                        removeExistingObject(data.modelId);
                        break;
                    case 'CLEAR_ALL':
                        objects.forEach((obj, id) => scene.remove(obj));
                        objects.clear();
                        lights.forEach((light, id) => {
                            scene.remove(light);
                            if (light.target) scene.remove(light.target);
                        });
                        lights.clear();
                        particles.forEach((particle, id) => scene.remove(particle));
                        particles.clear();
                        break;
                    case 'GET_MODEL_ANIMATIONS':
                        const animationList = getModelAnimations(data.modelId);
                        window.parent.postMessage({
                            type: 'MODEL_ANIMATIONS_RESPONSE',
                            containerId: data.containerId,
                            modelId: data.modelId,
                            animations: animationList
                        }, '*');
                        break;
                    case 'SET_REFLECTION_ENABLED':
                        // 设置反射开关 - 为低配设备设计的控制功能
                        reflectionEnabled = data.enabled;
                        
                        // 立即响应，更新所有水面材质
                        objects.forEach((obj, id) => {
                            if (obj.userData.isWater && obj.material) {
                                if (reflectionEnabled && cubeRenderTarget) {
                                    // 开启反射：添加环境贴图
                                    obj.material.envMap = cubeRenderTarget.texture;
                                    obj.material.envMapIntensity = 1.15;
                                    obj.material.needsUpdate = true;
                                } else {
                                    // 关闭反射：移除环境贴图
                                    obj.material.envMap = null;
                                    obj.material.envMapIntensity = 0;
                                    obj.material.needsUpdate = true;
                                }
                            }
                        });
                        
                        // 如果开启反射且存在水面，立即更新一次环境贴图
                        if (reflectionEnabled && cubeCamera) {
                            // 延迟100ms执行，确保材质更新完成
                            setTimeout(() => {
                                updateEnvironmentMap();
                            }, 100);
                        }
                        
                        console.log("反射开关已设置:", reflectionEnabled ? "开启" : "关闭");
                        break;
                    case 'SET_ANIMATION_TRANSITION':
                        setAnimationTransition(data.modelId, data.transitionTime);
                        break;
                    case 'PLAY_ANIMATION':
                        playModelAnimation(data.modelId, data.animationName, data.repeatMode);
                        break;
                    case 'STOP_ANIMATION':
                        stopModelAnimation(data.modelId);
                        break;
                    case 'SET_MODEL_SIDE':
                        setModelSide(data.modelId, data.side);
                        break;
                    case 'SET_LIGHT_POSITION':
                        setLightPosition(data.lightId, data.x, data.y, data.z);
                        break;
                    case 'SET_LIGHT_ROTATION':
                        setLightRotation(data.lightId, data.x, data.y, data.z);
                        break;
                    case 'SET_LIGHT_TARGET':
                        setLightTarget(data.lightId, data.targetX, data.targetY, data.targetZ);
                        break;
                    case 'SET_LIGHT_INTENSITY':
                        setLightIntensity(data.lightId, data.intensity);
                        break;
                    case 'SET_LIGHT_COLOR':
                        setLightColor(data.lightId, data.color);
                        break;
                    case 'SET_LIGHT_ANGLE':
                        setLightAngle(data.lightId, data.angle);
                        break;
                    case 'SET_LIGHT_PENUMBRA':
                        setLightPenumbra(data.lightId, data.penumbra);
                        break;
                    case 'SET_LIGHT_DECAY':
                        setLightDecay(data.lightId, data.decay);
                        break;
                    case 'SET_LIGHT_DISTANCE':
                        setLightDistance(data.lightId, data.distance);
                        break;
                    case 'SET_AREA_LIGHT_SIZE':
                        setAreaLightSize(data.lightId, data.width, data.height);
                        break;
                    case 'SET_FOG':
                        setFog(data.enabled, data.density, data.color);
                        break;
                    case 'SET_FOG_DENSITY':
                        setFogDensity(data.density);
                        break;
                    case 'SET_FOG_COLOR':
                        setFogColor(data.color);
                        break;
                    case 'SET_FOG_LIGHT_ABSORPTION':
                        setFogLightAbsorption(data.absorption);
                        break;
                    case 'REFRESH_ENVIRONMENT_MAP':
                        refreshEnvironmentMap(data.objectIds || []);
                        break;
                    case 'SET_REFLECTION_UPDATE_INTERVAL':
                        reflectionUpdateInterval = Math.max(10, Math.min(300, data.interval));
                        console.log("环境贴图更新间隔已设置为:", reflectionUpdateInterval, "帧");
                        break;
                    case 'SET_SKYBOX_ENABLED':
                        setSkyboxEnabled(data.enabled);
                        break;
                    case 'SET_SKYBOX_TYPE':
                        setSkyboxType(data.skyboxType);
                        break;
                    case 'SET_SKYBOX_COLOR':
                        setSkyboxColor(data.color);
                        break;
                    case 'SET_SKYBOX_TEXTURE':
                        setSkyboxTexture(data.textureId);
                        break;
                    case 'SET_SKYBOX_TEXTURE_TYPE':
                        setSkyboxTextureType(data.textureType);
                        break;
                    case 'SET_BLOOM_EFFECT':
                        // 设置光晕效果参数
                        setBloomEffect(data.enabled, data.strength, data.threshold, data.radius);
                        console.log("光晕效果已设置: 启用=" + data.enabled + ", 强度=" + data.strength + ", 阈值=" + data.threshold + ", 半径=" + data.radius);
                        break;
                    case 'SET_COLLISION_BOX_VISIBLE':
                        // 设置碰撞箱可见性
                        setCollisionBoxVisible(data.modelId, data.visible);
                        break;
                    case 'SET_COLLISION_TYPE':
                        // 设置碰撞类型
                        setModelCollisionType(data.modelId, data.collisionType);
                        break;
                }
            } catch (error) {
                console.error('处理消息时出错:', error);
            }
        });
        
        // 初始化场景
        init3DScene();
        
        // 监听容器大小变化
        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(container);
    </script>
</body>
</html>`}sendMessageToContainer(n,t){if(this.containers.has(n)){const i=this.containers.get(n);try{i.iframe.contentWindow.postMessage(t,"*")}catch(r){console.warn("无法向3D容器发送消息:",r)}}}updateContainerPosition(n,t,i){if(this.containers.has(n)){const r=this.containers.get(n);r.x=t;r.y=i;const u=Scratch.renderer.getNativeSize()[0],f=Scratch.renderer.getNativeSize()[1],e=u/2+t-r.width/2,o=f/2-i-r.height/2;r.container.style.left=`${e}px`;r.container.style.top=`${o}px`}}calculateDirection(n){const u=Scratch.Cast.toNumber(n.X1),f=Scratch.Cast.toNumber(n.Y1),e=Scratch.Cast.toNumber(n.Z1),o=Scratch.Cast.toNumber(n.X2),s=Scratch.Cast.toNumber(n.Y2),h=Scratch.Cast.toNumber(n.Z2),c=Scratch.Cast.toString(n.DIRECTION),t=o-u,r=s-f,i=h-e;switch(c){case"X方向":return Math.atan2(i,Math.sqrt(t*t+r*r))*(180/Math.PI);case"Y方向":return Math.atan2(t,i)*(180/Math.PI);case"Z方向":return Math.atan2(r,t)*(180/Math.PI);case"水平角度":let n=Math.atan2(t,i)*(180/Math.PI);return n<0?n+360:n;case"垂直角度":return Math.atan2(r,Math.sqrt(t*t+i*i))*(180/Math.PI);default:return 0}}advancedCollision(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toString(n.TARGET_ID),u=Scratch.Cast.toNumber(n.ALPHA_THRESHOLD);return new Promise(n=>{const f=`${t}_advanced_collision_${i}_${r}`;this.propertyCallbacks.set(f,n);this.sendMessageToContainer(t,{type:"ADVANCED_COLLISION",modelId:i,targetId:r,alphaThreshold:u});setTimeout(()=>{this.propertyCallbacks.has(f)&&(this.propertyCallbacks.delete(f),n(JSON.stringify({collided:!1,collisionPoints:[]})))},1e3)})}setContainerSize(n){const t=Scratch.Cast.toString(n.ID),i=Math.max(10,Scratch.Cast.toNumber(n.WIDTH)),r=Math.max(10,Scratch.Cast.toNumber(n.HEIGHT));if(this.containers.has(t)){const n=this.containers.get(t);n.width=i;n.height=r;n.container.style.width=`${i}px`;n.container.style.height=`${r}px`;this.updateContainerPosition(t,n.x,n.y)}}setContainerPosition(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toNumber(n.X),r=Scratch.Cast.toNumber(n.Y);this.containers.has(t)&&this.updateContainerPosition(t,i,r)}setContainerBackground(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.STYLE);this.containers.has(t)&&this.sendMessageToContainer(t,{type:"SET_BACKGROUND",style:i})}setCoordinateSystem(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.VISIBLE)==="开启";this.containers.has(t)&&this.sendMessageToContainer(t,{type:"SET_COORDINATE_SYSTEM",visible:i})}setRenderQuality(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toNumber(n.QUALITY);this.containers.has(t)&&this.sendMessageToContainer(t,{type:"SET_RENDER_QUALITY",quality:i})}setAmbientLight(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.ENABLED)==="开启",r=Scratch.Cast.toNumber(n.INTENSITY),u=Scratch.Cast.toString(n.COLOR);this.containers.has(t)&&this.sendMessageToContainer(t,{type:"SET_AMBIENT_LIGHT",enabled:i,intensity:r,color:u})}setShadows(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.ENABLED)==="开启",r=Scratch.Cast.toNumber(n.RANGE);this.containers.has(t)&&this.sendMessageToContainer(t,{type:"SET_SHADOWS",enabled:i,range:r})}setTransparencyThreshold(n){const t=Scratch.Cast.toString(n.ID),i=Math.max(.3,Math.min(1,Scratch.Cast.toNumber(n.THRESHOLD)));this.containers.has(t)&&this.sendMessageToContainer(t,{type:"SET_TRANSPARENCY_THRESHOLD",threshold:i})}setFog(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.ENABLED)==="开启",r=Scratch.Cast.toNumber(n.DENSITY),u=Scratch.Cast.toString(n.COLOR);this.containers.has(t)&&this.sendMessageToContainer(t,{type:"SET_FOG",enabled:i,density:r,color:u})}setFogDensity(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toNumber(n.DENSITY);this.containers.has(t)&&this.sendMessageToContainer(t,{type:"SET_FOG_DENSITY",density:i})}setFogColor(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.COLOR);this.containers.has(t)&&this.sendMessageToContainer(t,{type:"SET_FOG_COLOR",color:i})}setFogLightAbsorption(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toNumber(n.ABSORPTION);this.containers.has(t)&&this.sendMessageToContainer(t,{type:"SET_FOG_LIGHT_ABSORPTION",absorption:i})}addCube(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"CREATE_CUBE",modelId:i,x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z),width:Scratch.Cast.toNumber(n.WIDTH),height:Scratch.Cast.toNumber(n.HEIGHT),depth:Scratch.Cast.toNumber(n.DEPTH),color:Scratch.Cast.toString(n.COLOR)})}addWater(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"ADD_WATER",modelId:i,x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z),width:Scratch.Cast.toNumber(n.WIDTH),depth:Scratch.Cast.toNumber(n.DEPTH),color:Scratch.Cast.toString(n.COLOR)})}addSphere(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"CREATE_SPHERE",modelId:i,x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z),size:Scratch.Cast.toNumber(n.SIZE),color:Scratch.Cast.toString(n.COLOR)})}importModel(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toString(n.FILE_URL),u=Scratch.Cast.toNumber(n.SCALE);console.log("[积木调用] 开始导入模型: 容器ID="+t+", 模型ID="+i+", URL="+r+", 缩放="+u);this.sendMessageToContainer(t,{type:"IMPORT_MODEL",modelId:i,fileUrl:r,scale:u})}addPointLight(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.LIGHT_ID);this.sendMessageToContainer(t,{type:"CREATE_POINT_LIGHT",lightId:i,x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z),intensity:Scratch.Cast.toNumber(n.INTENSITY),color:Scratch.Cast.toString(n.COLOR),range:Scratch.Cast.toNumber(n.RANGE)})}addDirectionalLight(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.LIGHT_ID);this.sendMessageToContainer(t,{type:"CREATE_DIRECTIONAL_LIGHT",lightId:i,x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z),intensity:Scratch.Cast.toNumber(n.INTENSITY),color:Scratch.Cast.toString(n.COLOR)})}addSpotLight(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.LIGHT_ID);this.sendMessageToContainer(t,{type:"CREATE_SPOT_LIGHT",lightId:i,x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z),targetX:Scratch.Cast.toNumber(n.TARGET_X),targetY:Scratch.Cast.toNumber(n.TARGET_Y),targetZ:Scratch.Cast.toNumber(n.TARGET_Z),intensity:Scratch.Cast.toNumber(n.INTENSITY),color:Scratch.Cast.toString(n.COLOR),angle:Scratch.Cast.toNumber(n.ANGLE),penumbra:Scratch.Cast.toNumber(n.PENUMBRA)})}addAreaLight(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.LIGHT_ID);this.sendMessageToContainer(t,{type:"CREATE_AREA_LIGHT",lightId:i,x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z),width:Scratch.Cast.toNumber(n.WIDTH),height:Scratch.Cast.toNumber(n.HEIGHT),intensity:Scratch.Cast.toNumber(n.INTENSITY),color:Scratch.Cast.toString(n.COLOR)})}addParticle(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.PARTICLE_ID);this.sendMessageToContainer(t,{type:"CREATE_PARTICLE",particleId:i,x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z),color:Scratch.Cast.toString(n.COLOR),intensity:Scratch.Cast.toNumber(n.INTENSITY),spread:Scratch.Cast.toNumber(n.SPREAD)})}loadTexture(n){const t=Scratch.Cast.toString(n.TEXTURE_ID),i=Scratch.Cast.toString(n.IMAGE_URL);this.loadImageAsDataURL(i).then(n=>{n&&(this.textureCache.set(t,n),this.containers.forEach((i,r)=>{this.sendMessageToContainer(r,{type:"LOAD_TEXTURE",textureId:t,imageData:n})}))})}setModelTexture(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toString(n.TEXTURE_ID);this.sendMessageToContainer(t,{type:"SET_MODEL_TEXTURE",modelId:i,textureId:r})}removeModelTexture(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"REMOVE_MODEL_TEXTURE",modelId:i})}deleteTexture(n){const t=Scratch.Cast.toString(n.TEXTURE_ID);this.textureCache.delete(t);this.containers.forEach((n,i)=>{this.sendMessageToContainer(i,{type:"DELETE_TEXTURE",textureId:t})})}loadImageAsDataURL(n){return new Promise(t=>{if(!n){t(null);return}const i=new Image;i.crossOrigin="anonymous";i.onload=()=>{const n=document.createElement("canvas");n.width=i.width;n.height=i.height;const r=n.getContext("2d");r.drawImage(i,0,0);t(n.toDataURL())};i.onerror=()=>t(null);i.src=n})}setMaterial(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toString(n.MATERIAL),u=Scratch.Cast.toNumber(n.ROUGHNESS),f=Scratch.Cast.toNumber(n.METALNESS);this.sendMessageToContainer(t,{type:"SET_MATERIAL",modelId:i,materialType:r,roughness:u,metalness:f})}setModelSide(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toString(n.SIDE);this.sendMessageToContainer(t,{type:"SET_MODEL_SIDE",modelId:i,side:r})}setLightPosition(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"SET_LIGHT_POSITION",modelId:i,x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z)})}setLightRotation(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"SET_LIGHT_ROTATION",modelId:i,x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z)})}setLightTarget(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"SET_LIGHT_TARGET",modelId:i,x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z)})}setLightIntensity(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"SET_LIGHT_INTENSITY",modelId:i,intensity:Scratch.Cast.toNumber(n.INTENSITY)})}setLightColor(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"SET_LIGHT_COLOR",modelId:i,color:Scratch.Cast.toString(n.COLOR)})}setLightAngle(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"SET_LIGHT_ANGLE",modelId:i,angle:Scratch.Cast.toNumber(n.ANGLE)})}setLightPenumbra(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"SET_LIGHT_PENUMBRA",modelId:i,penumbra:Scratch.Cast.toNumber(n.PENUMBRA)})}setLightDecay(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"SET_LIGHT_DECAY",modelId:i,decay:Scratch.Cast.toNumber(n.DECAY)})}setLightDistance(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"SET_LIGHT_DISTANCE",modelId:i,distance:Scratch.Cast.toNumber(n.DISTANCE)})}setAreaLightSize(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.LIGHT_ID);this.sendMessageToContainer(t,{type:"SET_AREA_LIGHT_SIZE",lightId:i,width:Scratch.Cast.toNumber(n.WIDTH),height:Scratch.Cast.toNumber(n.HEIGHT)})}setSpotLightTarget(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.LIGHT_ID);this.sendMessageToContainer(t,{type:"SET_LIGHT_TARGET",lightId:i,targetX:Scratch.Cast.toNumber(n.TARGET_X),targetY:Scratch.Cast.toNumber(n.TARGET_Y),targetZ:Scratch.Cast.toNumber(n.TARGET_Z)})}setModelPosition(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"SET_MODEL_POSITION",modelId:i,x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z)})}setModelRotation(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"SET_MODEL_ROTATION",modelId:i,x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z)})}setModelSize(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"SET_MODEL_SIZE",modelId:i,width:Scratch.Cast.toNumber(n.WIDTH),height:Scratch.Cast.toNumber(n.HEIGHT),depth:Scratch.Cast.toNumber(n.DEPTH)})}setModelTransparency(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Math.max(0,Math.min(1,Scratch.Cast.toNumber(n.ALPHA)));this.sendMessageToContainer(t,{type:"SET_MODEL_TRANSPARENCY",modelId:i,alpha:r})}setModelBrightness(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toNumber(n.BRIGHTNESS);this.sendMessageToContainer(t,{type:"SET_MODEL_BRIGHTNESS",modelId:i,brightness:r})}setCameraPosition(n){const t=Scratch.Cast.toString(n.ID);this.sendMessageToContainer(t,{type:"SET_CAMERA_POSITION",x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y),z:Scratch.Cast.toNumber(n.Z)})}setCameraRotation(n){const t=Scratch.Cast.toString(n.ID);this.sendMessageToContainer(t,{type:"SET_CAMERA_ROTATION",x:Scratch.Cast.toNumber(n.X),y:Scratch.Cast.toNumber(n.Y)})}setCameraFOV(n){const t=Scratch.Cast.toString(n.ID);this.sendMessageToContainer(t,{type:"SET_CAMERA_FOV",fov:Scratch.Cast.toNumber(n.FOV)})}getModelProperty(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toString(n.PROPERTY);return new Promise(n=>{const u=`${t}_${i}_${r}`;this.propertyCallbacks.set(u,n);this.sendMessageToContainer(t,{type:"GET_MODEL_PROPERTY",containerId:t,modelId:i,property:r});setTimeout(()=>{this.propertyCallbacks.has(u)&&(this.propertyCallbacks.delete(u),n(0))},1e3)})}getCameraProperty(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.PROPERTY);return new Promise(n=>{const r=`${t}_camera_${i}`;this.propertyCallbacks.set(r,n);this.sendMessageToContainer(t,{type:"GET_CAMERA_PROPERTY",containerId:t,property:i});setTimeout(()=>{this.propertyCallbacks.has(r)&&(this.propertyCallbacks.delete(r),n(0))},1e3)})}checkCollisions(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);return new Promise(n=>{const r=`${t}_${i}_collisions`;this.propertyCallbacks.set(r,n);this.sendMessageToContainer(t,{type:"CHECK_COLLISIONS",containerId:t,modelId:i});setTimeout(()=>{this.propertyCallbacks.has(r)&&(this.propertyCallbacks.delete(r),n(JSON.stringify([])))},1e3)})}showContainer(n){const t=Scratch.Cast.toString(n.ID);this.containers.has(t)&&(this.containers.get(t).container.style.display="block")}hideContainer(n){const t=Scratch.Cast.toString(n.ID);this.containers.has(t)&&(this.containers.get(t).container.style.display="none")}deleteContainer(n){const t=Scratch.Cast.toString(n.ID);if(this.containers.has(t)){const n=this.containers.get(t);Scratch.renderer.removeOverlay(n.container);this.containers.delete(t)}}removeModel(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"REMOVE_MODEL",modelId:i})}clearAll(n){const t=Scratch.Cast.toString(n.ID);this.sendMessageToContainer(t,{type:"CLEAR_ALL"})}getModelAnimations(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);return new Promise(n=>{const r=`${t}_${i}_animations`;this.propertyCallbacks.set(r,n);this.sendMessageToContainer(t,{type:"GET_MODEL_ANIMATIONS",containerId:t,modelId:i});setTimeout(()=>{this.propertyCallbacks.has(r)&&(this.propertyCallbacks.delete(r),n(JSON.stringify([])))},1e3)})}setAnimationTransition(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toNumber(n.TRANSITION_TIME);this.sendMessageToContainer(t,{type:"SET_ANIMATION_TRANSITION",containerId:t,modelId:i,transitionTime:r})}playAnimation(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toString(n.ANIMATION_NAME),u=Scratch.Cast.toString(n.REPEAT_MODE);this.sendMessageToContainer(t,{type:"PLAY_ANIMATION",containerId:t,modelId:i,animationName:r,repeatMode:u})}stopAnimation(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID);this.sendMessageToContainer(t,{type:"STOP_ANIMATION",containerId:t,modelId:i})}refreshEnvironmentMap(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=n.MODEL_IDS?n.MODEL_IDS.split(",").map(n=>n.trim()):[];this.sendMessageToContainer(t,{type:"REFRESH_ENVIRONMENT_MAP",objectIds:i})}setReflectionUpdateInterval(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Math.max(10,Math.min(300,Scratch.Cast.toNumber(n.INTERVAL)));this.sendMessageToContainer(t,{type:"SET_REFLECTION_UPDATE_INTERVAL",interval:i})}setReflectionEnabled(n){const t=Scratch.Cast.toString(n.ID),i=n.ENABLED==="开启";this.sendMessageToContainer(t,{type:"SET_REFLECTION_ENABLED",enabled:i})}setContainerPhysics(n){const t=Scratch.Cast.toString(n.ID),i=n.ENABLED==="开启";this.sendMessageToContainer(t,{type:"SET_CONTAINER_PHYSICS",enabled:i})}setBloomEffect(n){const t=Scratch.Cast.toString(n.ID),i=Scratch.Cast.toString(n.ENABLED)==="开启",r=Math.max(.1,Math.min(5,Scratch.Cast.toNumber(n.STRENGTH))),u=Math.max(0,Math.min(1,Scratch.Cast.toNumber(n.THRESHOLD))),f=Math.max(.1,Math.min(2,Scratch.Cast.toNumber(n.RADIUS)));this.sendMessageToContainer(t,{type:"SET_BLOOM_EFFECT",enabled:i,strength:r,threshold:u,radius:f})}setModelPhysics(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=n.ENABLED==="开启",u=Scratch.Cast.toNumber(n.GRAVITY),f=Math.max(0,Math.min(100,Scratch.Cast.toNumber(n.BOUNCE))),e=Math.max(0,Math.min(100,Scratch.Cast.toNumber(n.DRAG))),o=Math.max(0,Math.min(100,Scratch.Cast.toNumber(n.FRICTION)));this.sendMessageToContainer(t,{type:"SET_MODEL_PHYSICS",modelId:i,enabled:r,gravity:u,bounce:f,drag:e,friction:o})}setGlobalGravity(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toNumber(n.GX),r=Scratch.Cast.toNumber(n.GY),u=Scratch.Cast.toNumber(n.GZ);this.sendMessageToContainer(t,{type:"SET_GLOBAL_GRAVITY",gravityX:i,gravityY:r,gravityZ:u})}applyForce(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toNumber(n.FX),u=Scratch.Cast.toNumber(n.FY),f=Scratch.Cast.toNumber(n.FZ);return this.sendMessageToContainer(t,{type:"APPLY_FORCE",modelId:i,forceX:r,forceY:u,forceZ:f}),Promise.resolve()}setModelVelocity(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toNumber(n.VX),u=Scratch.Cast.toNumber(n.VY),f=Scratch.Cast.toNumber(n.VZ);return this.sendMessageToContainer(t,{type:"SET_MODEL_VELOCITY",modelId:i,velocityX:r,velocityY:u,velocityZ:f}),Promise.resolve()}setModelStatic(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=n.STATIC==="开启";return this.sendMessageToContainer(t,{type:"SET_MODEL_STATIC",modelId:i,isStatic:r}),Promise.resolve()}createPhysicsGround(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toNumber(n.HEIGHT),r=Math.max(0,Math.min(1,Scratch.Cast.toNumber(n.BOUNCE))),u=Math.max(0,Math.min(1,Scratch.Cast.toNumber(n.FRICTION)));this.sendMessageToContainer(t,{type:"CREATE_PHYSICS_GROUND",height:i,bounce:r,friction:u})}getModelPhysicsInfo(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toString(n.PROPERTY);return new Promise(n=>{const u=`${t}_${i}_physics_${r}`;this.propertyCallbacks.set(u,n);this.sendMessageToContainer(t,{type:"GET_MODEL_PHYSICS_INFO",containerId:t,modelId:i,property:r});setTimeout(()=>{this.propertyCallbacks.has(u)&&(this.propertyCallbacks.delete(u),n(0))},1e3)})}attachModelToModel(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.CHILD_MODEL_ID),r=Scratch.Cast.toString(n.PARENT_MODEL_ID),u=n.ROTATION_CENTER==="围绕父模型中心"?"parent":"self";return new Promise(n=>{const f=`${t}_${i}_attach_${r}`;this.propertyCallbacks.set(f,n);this.sendMessageToContainer(t,{type:"ATTACH_MODEL_TO_MODEL",childModelId:i,parentModelId:r,rotationCenter:u});setTimeout(()=>{this.propertyCallbacks.has(f)&&(this.propertyCallbacks.delete(f),n())},100)})}detachModelFromModel(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.CHILD_MODEL_ID),r=Scratch.Cast.toString(n.PARENT_MODEL_ID);return new Promise(n=>{const u=`${t}_${i}_detach_${r}`;this.propertyCallbacks.set(u,n);this.sendMessageToContainer(t,{type:"DETACH_MODEL_FROM_MODEL",childModelId:i,parentModelId:r});setTimeout(()=>{this.propertyCallbacks.has(u)&&(this.propertyCallbacks.delete(u),n())},100)})}applyTorque(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toNumber(n.TX),u=Scratch.Cast.toNumber(n.TY),f=Scratch.Cast.toNumber(n.TZ);return new Promise(n=>{const e=`${t}_${i}_torque_apply`;this.propertyCallbacks.set(e,n);this.sendMessageToContainer(t,{type:"APPLY_TORQUE",modelId:i,torqueX:r,torqueY:u,torqueZ:f});setTimeout(()=>{this.propertyCallbacks.has(e)&&(this.propertyCallbacks.delete(e),n())},100)})}setCollisionType(n){const r=Scratch.Cast.toString(n.CONTAINER_ID),u=Scratch.Cast.toString(n.MODEL_ID),i=Scratch.Cast.toString(n.COLLISION_TYPE);let t="simple";i==="简单碰撞"?t="simple":i==="完整碰撞"&&(t="complex");this.sendMessageToContainer(r,{type:"SET_COLLISION_TYPE",modelId:u,collisionType:t})}setCollisionBoxVisible(n){const t=Scratch.Cast.toString(n.CONTAINER_ID),i=Scratch.Cast.toString(n.MODEL_ID),r=Scratch.Cast.toString(n.VISIBLE)==="开启";this.sendMessageToContainer(t,{type:"SET_COLLISION_BOX_VISIBLE",modelId:i,visible:r})}getMenus(){return{booleanMenu:{acceptReporters:!1,items:["开启","关闭"]},backgroundStyle:{acceptReporters:!1,items:["纯色","渐变","天空盒","透明"]},qualityPreset:{acceptReporters:!1,items:["低","中","高","超高"]},directionMenu:{acceptReporters:!1,items:["X","Y","Z"]},modelProperties:{acceptReporters:!1,items:["位置X","位置Y","位置Z","旋转X","旋转Y","旋转Z","宽度","高度","长度"]},cameraProperties:{acceptReporters:!1,items:["位置X","位置Y","位置Z","旋转X","旋转Y"]},physicsProperty:{acceptReporters:!1,items:["位置X","位置Y","位置Z","速度X","速度Y","速度Z","重力","弹力","阻力","摩擦力","是否静态"]}}}}typeof Scratch!="undefined"&&typeof Scratch.extensions!="undefined"&&Scratch.extensions.register(new ThreeDContainerExtension)