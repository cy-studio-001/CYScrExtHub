// ============================================================
// UI工具箱 - 完整整合版
// ============================================================

(function(Scratch) {
    'use strict';

    // ============================================================
    // 1. 文件工具模块
    // ============================================================
    class FileTools {
        constructor() {
            this.selectedFiles = [];
            this.singleFileInput = document.createElement('input');
            this.singleFileInput.type = 'file';
            this.singleFileInput.style.display = 'none';
            document.body.appendChild(this.singleFileInput);
            
            this.multipleFileInput = document.createElement('input');
            this.multipleFileInput.type = 'file';
            this.multipleFileInput.multiple = true;
            this.multipleFileInput.style.display = 'none';
            document.body.appendChild(this.multipleFileInput);
            
            this.singleFileInput.addEventListener('change', function(e) {
                this.selectedFiles = e.target.files ? Array.from(e.target.files) : [];
                this.singleFileInput.value = '';
            }.bind(this));
            
            this.multipleFileInput.addEventListener('change', function(e) {
                this.selectedFiles = e.target.files ? Array.from(e.target.files) : [];
                this.multipleFileInput.value = '';
            }.bind(this));
        }

        openSingleFile(fileType) {
            var accept = fileType === "*" ? "" : fileType.split(',').map(function(ext) { return '.' + ext.trim(); }).join(',');
            return new Promise(function(resolve) {
                var checkSelection = function() {
                    if (this.selectedFiles.length > 0) { resolve(); return; }
                    setTimeout(checkSelection.bind(this), 100);
                }.bind(this);
                this.singleFileInput.accept = accept;
                this.selectedFiles = [];
                this.singleFileInput.click();
                checkSelection();
            }.bind(this));
        }

        openMultipleFiles(fileType) {
            var accept = fileType === "*" ? "" : fileType.split(',').map(function(ext) { return '.' + ext.trim(); }).join(',');
            return new Promise(function(resolve) {
                var checkSelection = function() {
                    if (this.selectedFiles.length > 0) { resolve(); return; }
                    setTimeout(checkSelection.bind(this), 100);
                }.bind(this);
                this.multipleFileInput.accept = accept;
                this.selectedFiles = [];
                this.multipleFileInput.click();
                checkSelection();
            }.bind(this));
        }

        getFileProperty(index, property) {
            var idx = Scratch.Cast.toNumber(index) - 1;
            if (idx < 0 || idx >= this.selectedFiles.length) return "";
            var file = this.selectedFiles[idx];
            var result = this._getPropertySync(file, property);
            if (result && typeof result.then === 'function') {
                return result.then(function(value) { return value; })['catch'](function() { return ""; });
            }
            return result;
        }

        _getPropertySync(file, property) {
            switch (property) {
                case 'name': return file.name;
                case 'size': return (file.size / 1024 / 1024).toFixed(2) + " MB";
                case 'dataurl': return this._fileToDataURL(file);
                case 'type': return file.type || "未知";
                case 'lastModified': return new Date(file.lastModified).toLocaleString();
                case 'created': return new Date().toLocaleString();
                case 'duration': return this._getMediaDuration(file);
                case 'dimensions': return this._getMediaDimensions(file);
                case 'author': return this._getPPTAuthor(file);
                case 'slideCount': return this._getPPTSlideCount(file);
                default: return "";
            }
        }

        getFileContent(index, type) {
            var idx = Scratch.Cast.toNumber(index) - 1;
            if (idx < 0 || idx >= this.selectedFiles.length) return Promise.resolve("");
            var file = this.selectedFiles[idx];
            if (type === 'text') return file.text();
            if (type === 'dataurl') return this._fileToDataURL(file);
            return Promise.resolve("");
        }

        getFileCount() { return this.selectedFiles.length; }

        downloadText(content, name) {
            var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            this._downloadBlob(blob, name);
        }

        downloadDataURL(dataURL, name) {
            try {
                var blob = this._dataURLToBlob(dataURL);
                this._downloadBlob(blob, name);
            } catch (error) { console.error('下载DataURL失败:', error); }
        }

        _fileToDataURL(file) {
            return new Promise(function(resolve) {
                var reader = new FileReader();
                reader.onload = function(e) { resolve(e.target.result); };
                reader.readAsDataURL(file);
            });
        }

        _getMediaDuration(file) {
            return new Promise(function(resolve) {
                if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
                    resolve("不是媒体文件");
                    return;
                }
                var url = URL.createObjectURL(file);
                var media = file.type.startsWith('audio/') ? new Audio() : document.createElement('video');
                media.onloadedmetadata = function() {
                    var duration = media.duration;
                    URL.revokeObjectURL(url);
                    resolve(duration.toFixed(2) + " 秒");
                };
                media.onerror = function() {
                    URL.revokeObjectURL(url);
                    resolve("无法获取时长");
                };
                media.src = url;
            });
        }

        _getMediaDimensions(file) {
            return new Promise(function(resolve) {
                if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                    resolve("不是图片或视频");
                    return;
                }
                var url = URL.createObjectURL(file);
                if (file.type.startsWith('image/')) {
                    var img = new Image();
                    img.onload = function() {
                        URL.revokeObjectURL(url);
                        resolve(img.width + " × " + img.height);
                    };
                    img.onerror = function() {
                        URL.revokeObjectURL(url);
                        resolve("无法获取尺寸");
                    };
                    img.src = url;
                } else {
                    var video = document.createElement('video');
                    video.onloadedmetadata = function() {
                        URL.revokeObjectURL(url);
                        resolve(video.videoWidth + " × " + video.videoHeight);
                    };
                    video.onerror = function() {
                        URL.revokeObjectURL(url);
                        resolve("无法获取尺寸");
                    };
                    video.src = url;
                }
            });
        }

        _getPPTAuthor(file) {
            if (file.name.toLowerCase().endsWith('.ppt') || file.name.toLowerCase().endsWith('.pptx')) {
                return "需要专业解析库";
            }
            return "不是PPT文件";
        }

        _getPPTSlideCount(file) {
            if (file.name.toLowerCase().endsWith('.ppt') || file.name.toLowerCase().endsWith('.pptx')) {
                return "需要专业解析库";
            }
            return "不是PPT文件";
        }

        _downloadBlob(blob, filename) {
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        _dataURLToBlob(dataurl) {
            var arr = dataurl.split(',');
            var mime = arr[0].match(/:(.*?);/)[1];
            var bstr = atob(arr[1]);
            var u8arr = new Uint8Array(bstr.length);
            for (var i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
            return new Blob([u8arr], { type: mime });
        }
    }

    // ============================================================
    // 2. 位图高斯模糊模块
    // ============================================================
    class GaussianBlurTools {
        applyBlur(imageDataUrl, radius, antiEdge) {
            if (!imageDataUrl || imageDataUrl.indexOf('data:image/') === -1) return '';
            return new Promise(function(resolve) {
                var r = Math.min(Math.abs(radius * 2), 100);
                if (!imageDataUrl || r === 0) { resolve(imageDataUrl); return; }
                var img = new Image();
                img.onload = function() {
                    try {
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        ctx.imageSmoothingEnabled = true;
                        if (antiEdge == '0') {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        } else {
                            canvas.width = img.width * 2;
                            canvas.height = img.height * 2;
                            ctx.drawImage(img, canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);
                        }
                        this._applyHighQualityBlur(canvas, ctx, r);
                        resolve(canvas.toDataURL());
                    } catch (e) {
                        console.error('模糊处理错误:', e);
                        resolve(imageDataUrl);
                    }
                }.bind(this);
                img.onerror = function() { resolve(imageDataUrl); };
                img.src = imageDataUrl;
            }.bind(this));
        }

        _applyHighQualityBlur(canvas, ctx, radius) {
            if (radius <= 0) return;
            var offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = canvas.width;
            offscreenCanvas.height = canvas.height;
            var offscreenCtx = offscreenCanvas.getContext('2d');
            offscreenCtx.filter = 'blur(' + radius + 'px)';
            offscreenCtx.drawImage(canvas, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(offscreenCanvas, 0, 0);
        }

        resizeImage(imageDataUrl, width, height) {
            if (!imageDataUrl || imageDataUrl.indexOf('data:image/') === -1) return '';
            return new Promise(function(resolve) {
                var img = new Image();
                var tw = Math.max(1, Math.abs(Math.floor(width)));
                var th = Math.max(1, Math.abs(Math.floor(height)));
                img.onload = function() {
                    try {
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = tw;
                        canvas.height = th;
                        ctx.imageSmoothingEnabled = true;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0, tw, th);
                        resolve(canvas.toDataURL('image/png'));
                    } catch (e) { resolve(imageDataUrl); }
                };
                img.onerror = function() { resolve(imageDataUrl); };
                img.src = imageDataUrl;
            });
        }

        getCostumeURL() {
            try {
                var vm = Scratch.vm;
                if (!vm) return '';
                var target = vm.editingTarget;
                if (!target) return '';
                var costumes = target.getCostumes();
                var costume = costumes[target.currentCostume];
                if (!costume) return '';
                return costume.asset.encodeDataURI();
            } catch (e) { return ''; }
        }
    }

    // ============================================================
    // 3. 造型模糊模块
    // ============================================================
    class CostumeBlurTools {
        constructor() {
            this.blurMap = new Map();
            this.blurValueMap = new Map();
            this.originalSkins = new Map();
            var runtime = Scratch.vm ? Scratch.vm.runtime : null;
            if (runtime && runtime.on) {
                runtime.on("PROJECT_STOP", this.clearCache.bind(this));
            }
        }

        get renderer() { 
            var vm = Scratch.vm;
            return vm && vm.runtime ? vm.runtime.renderer : null; 
        }
        get runtime() { 
            var vm = Scratch.vm;
            return vm ? vm.runtime : null; 
        }

        _colorData2Canvas(data, width, height) {
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').putImageData(new ImageData(data, width, height), 0, 0);
            return canvas;
        }

        _getKeyOfMap(map, value) {
            var entries = map.entries();
            var entry = entries.next();
            while (!entry.done) {
                var key = entry.value[0];
                var v = entry.value[1];
                if (v === value) return key;
                entry = entries.next();
            }
            return undefined;
        }

        setBlur(args, util) {
            var renderer = this.renderer;
            if (!renderer) return;
            var target = util.target;
            var targetDrawable = renderer._allDrawables[target.drawableID];
            var targetSkin = targetDrawable ? targetDrawable.skin : null;
            var originalDrawableID = this._getKeyOfMap(this.blurMap, targetSkin ? targetSkin.id : null) || target.drawableID;
            var originalSkin = this.originalSkins.get(target.drawableID) || renderer._allDrawables[originalDrawableID].skin;
            if (!originalSkin) return;
            var skin = this.blurMap.get(originalDrawableID);

            var currentSkin = renderer._allDrawables[target.drawableID] ? renderer._allDrawables[target.drawableID].skin : null;
            if (this.blurMap.get(target.drawableID) !== (currentSkin ? currentSkin.id : null)) {
                originalDrawableID = target.drawableID;
                originalSkin = renderer._allDrawables[originalDrawableID].skin;
                skin = this.blurMap.get(originalDrawableID);
                if (originalSkin) this.originalSkins.set(target.drawableID, originalSkin);
            }

            if (!originalSkin || !originalSkin._silhouette) return;

            var silhouette = originalSkin._silhouette;
            var _colorData = silhouette._colorData;
            var _width = silhouette._width;
            var _height = silhouette._height;
            var _lazyData = silhouette._lazyData;
            var imageData = _lazyData || this._colorData2Canvas(_colorData, _width, _height);
            var rotationCenter = originalSkin._rotationCenter.slice();

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = originalSkin.size[0] * 3;
            canvas.height = originalSkin.size[1] * 3;
            ctx.filter = 'blur(' + args.blur + 'px)';
            ctx.drawImage(
                imageData,
                originalSkin.size[0] * 0.5,
                originalSkin.size[1] * 0.5,
                originalSkin.size[0] * 2,
                originalSkin.size[1] * 2
            );

            rotationCenter = rotationCenter.map(function(v, i) {
                return v - originalSkin.size[i] * 0.5 + [canvas.width, canvas.height][i] / 4;
            });

            if (!skin) {
                skin = renderer.createBitmapSkin(canvas, 2, rotationCenter);
                this.blurMap.set(originalDrawableID, skin);
                this.originalSkins.set(target.drawableID, originalSkin);
                renderer._allSkins[skin].kmsBlur = true;
            } else {
                renderer.updateBitmapSkin(skin, canvas, 2, rotationCenter);
            }

            this.blurValueMap.set(target.drawableID, {
                blur: args.blur,
                skin: originalSkin.id
            });

            renderer.updateDrawableSkinId(target.drawableID, skin);
            var runtime = this.runtime;
            if (runtime && runtime.requestRedraw) runtime.requestRedraw();
        }

        getBlur(args, util) {
            var val = this.blurValueMap.get(util.target.drawableID);
            return val ? val.blur : 0;
        }

        changeBlur(args, util) {
            // 修复：正确获取当前模糊值并增加
            var currentBlur = this.getBlur({}, util);
            var newBlur = parseFloat((currentBlur + parseFloat(args.blur)).toFixed(10));
            this.setBlur({
                blur: newBlur
            }, util);
        }

        returnOriginal(args, util) {
            var renderer = this.renderer;
            if (!renderer) return;
            var target = util.target;
            var drawableID = target.drawableID;
            var originalID = this.originalSkins.get(drawableID) ? this.originalSkins.get(drawableID).id : null;
            if (!originalID) return;
            var r = this.blurValueMap.get(drawableID);
            if (r) r.blur = 0;
            renderer.updateDrawableSkinId(drawableID, originalID);
            var runtime = this.runtime;
            if (runtime && runtime.requestRedraw) runtime.requestRedraw();
        }

        clearCache() {
            var renderer = this.renderer;
            if (!renderer) return;
            var runtime = this.runtime;
            var targets = runtime ? runtime.targets : [];
            for (var i = 0; i < targets.length; i++) {
                this.returnOriginal({}, { target: targets[i] });
            }
            if (runtime && runtime.requestRedraw) runtime.requestRedraw();
            var entries = this.blurMap.entries();
            var entry = entries.next();
            while (!entry.done) {
                var skin = entry.value[1];
                renderer.destroySkin(skin);
                entry = entries.next();
            }
            this.blurMap.clear();
            this.blurValueMap.clear();
            this.originalSkins.clear();
        }
    }

    // ============================================================
    // 4. 液态玻璃弹窗模块
    // ============================================================
    class PopupTools {
        constructor() {
            this.popupElement = null;
            this.popupResult = '';
            this.popupResolve = null;
            this.animationDuration = 300;
            this.style = { opacity: 0.8, borderRadius: 20, blur: 20 };
            this.isCreating = false;
            this.compilerPatched = false;
            this._ensureCompilerCompatibility();
            this._updateCSS();
        }

        _ensureCompilerCompatibility() {
            if (this.compilerPatched) return;
            this.compilerPatched = true;
            var vm = Scratch.vm;
            if (!vm) return;
            var runtime = vm.runtime;
            if (!runtime || typeof runtime.setCompilerOptions !== 'function') return;
            try {
                var compilerOptions = runtime.compilerOptions || {};
                if ('enabled' in compilerOptions && compilerOptions.enabled) {
                    runtime.setCompilerOptions({ enabled: false });
                    if (runtime.resetAllCaches) runtime.resetAllCaches();
                    if (runtime.requestBlocksUpdate) runtime.requestBlocksUpdate();
                }
            } catch (error) {}
        }

        _getPopupCSS() {
            var glassOpacity = Math.max(0.32, Math.min(this.style.opacity, 0.88));
            var panelRadius = Math.max(28, this.style.borderRadius + 10);
            var blurAmount = Math.max(12, this.style.blur);
            return '.liquid-glass-popup{position:fixed;top:50%;left:50%;--pointer-x:50%;--pointer-y:14%;--glow-x:50%;--glow-y:50%;--glass-shadow:rgba(15,23,42,0.18);transform:translate(-50%,calc(-50% + 18px)) scale(0.94);background:linear-gradient(180deg,rgba(255,255,255,' + Math.min(glassOpacity + 0.22, 0.94) + ') 0%,rgba(255,255,255,' + (glassOpacity + 0.06) + ') 22%,rgba(232,241,255,' + Math.max(glassOpacity - 0.08, 0.22) + ') 100%),radial-gradient(circle at 12% 10%,rgba(255,255,255,0.92) 0%,rgba(255,255,255,0) 38%),radial-gradient(circle at 84% 82%,rgba(132,186,255,0.18) 0%,rgba(132,186,255,0) 26%);backdrop-filter:blur(' + (blurAmount * 1.75) + 'px) saturate(185%) brightness(1.08) contrast(1.06);-webkit-backdrop-filter:blur(' + (blurAmount * 1.75) + 'px) saturate(185%) brightness(1.08) contrast(1.06);border:1px solid rgba(255,255,255,0.36);border-radius:' + panelRadius + 'px;padding:24px 24px 0;box-shadow:0 24px 60px var(--glass-shadow),0 8px 24px rgba(15,23,42,0.08),inset 0 1px 0 rgba(255,255,255,0.92),inset 0 -1px 0 rgba(255,255,255,0.14);z-index:9999;opacity:0;transition:transform ' + this.animationDuration + 'ms cubic-bezier(0.22,1,0.36,1),opacity ' + this.animationDuration + 'ms ease,box-shadow ' + this.animationDuration + 'ms ease,border-color ' + this.animationDuration + 'ms ease;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;min-width:320px;width:min(360px,calc(100vw - 28px));max-width:calc(100vw - 28px);text-align:center;overflow:hidden;isolation:isolate}.popup-liquid{position:absolute;inset:-16% -10%;pointer-events:none;z-index:0;opacity:0.95;background:radial-gradient(circle at var(--pointer-x) var(--pointer-y),rgba(255,255,255,0.78) 0%,rgba(255,255,255,0.34) 10%,rgba(255,255,255,0.08) 18%,rgba(255,255,255,0) 34%),radial-gradient(circle at 16% 22%,rgba(169,219,255,0.26) 0%,rgba(169,219,255,0) 26%),radial-gradient(circle at 82% 78%,rgba(125,180,255,0.18) 0%,rgba(125,180,255,0) 24%);filter:blur(16px) saturate(130%);animation:popup-liquid-drift 11s ease-in-out infinite alternate,popup-liquid-breathe 6.8s ease-in-out infinite}.liquid-glass-popup::before{content:"";position:absolute;inset:1px;border-radius:' + Math.max(panelRadius - 1, 15) + 'px;background:linear-gradient(180deg,rgba(255,255,255,0.68) 0%,rgba(255,255,255,0.14) 20%,rgba(255,255,255,0.04) 44%,rgba(255,255,255,0.1) 100%),radial-gradient(circle at var(--pointer-x) calc(var(--pointer-y) - 2%),rgba(255,255,255,0.9) 0%,rgba(255,255,255,0.14) 16%,rgba(255,255,255,0) 42%);opacity:0.96;pointer-events:none;z-index:0}.liquid-glass-popup::after{content:"";position:absolute;inset:-24% -18% auto;height:64%;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,0.58) 0%,rgba(255,255,255,0.12) 34%,rgba(255,255,255,0) 64%),linear-gradient(180deg,rgba(255,255,255,0.65) 0%,rgba(255,255,255,0.08) 58%,rgba(255,255,255,0) 100%);transform:rotate(-7deg);filter:blur(12px);opacity:0.62;pointer-events:none;z-index:0;animation:popup-sheen-glide 7s ease-in-out infinite}.liquid-glass-popup > *{position:relative;z-index:1}.liquid-glass-popup.show{opacity:1;transform:translate(-50%,-50%) scale(1)}.liquid-glass-popup.hide{opacity:0;transform:translate(-50%,calc(-50% + 14px)) scale(0.985)}.popup-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(circle at top,rgba(186,224,255,0.16) 0%,rgba(186,224,255,0) 45%),rgba(9,14,24,0.16);backdrop-filter:blur(' + Math.max(4, blurAmount * 0.35) + 'px) saturate(130%);-webkit-backdrop-filter:blur(' + Math.max(4, blurAmount * 0.35) + 'px) saturate(130%);z-index:9998;opacity:0;transition:opacity ' + this.animationDuration + 'ms ease;pointer-events:none}.popup-overlay.show{opacity:1;pointer-events:all}.popup-title{font-size:19px;font-weight:700;letter-spacing:-0.02em;color:#0f172a;margin:0 0 8px 0;text-shadow:0 1px 0 rgba(255,255,255,0.5)}.popup-content{font-size:14px;color:rgba(15,23,42,0.72);margin:0 4px 22px;line-height:1.5}.popup-buttons{display:flex;gap:0;justify-content:stretch;flex-wrap:nowrap;position:relative;width:calc(100% + 48px);margin:0 -24px;min-height:54px;border-top:1px solid rgba(255,255,255,0.34);background:linear-gradient(180deg,rgba(255,255,255,0.08) 0%,rgba(255,255,255,0.18) 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,0.24)}.popup-button{position:relative;flex:1 1 0;min-height:54px;padding:0 16px;border:none;background:transparent;color:rgba(15,23,42,0.9);font-size:17px;font-weight:600;cursor:pointer;transition:color 0.2s ease,background 0.2s ease;-webkit-tap-highlight-color:transparent;overflow:hidden}.popup-button::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at var(--glow-x) var(--glow-y),rgba(255,255,255,0.74) 0%,rgba(255,255,255,0.24) 20%,rgba(255,255,255,0) 46%),linear-gradient(180deg,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0.04) 100%);opacity:0;transition:opacity 0.22s ease;pointer-events:none}.popup-button + .popup-button{border-left:1px solid rgba(255,255,255,0.28)}.popup-button.primary{color:#007aff}.popup-button.secondary{color:rgba(15,23,42,0.9)}.popup-button:hover{background:rgba(255,255,255,0.08)}.popup-button:active{background:rgba(255,255,255,0.14)}.popup-button:hover::before,.popup-button:focus-visible::before,.popup-button.energized::before{opacity:1}.popup-button.energized::before{animation:popup-energize 520ms ease}.popup-button:focus-visible{outline:none;background:rgba(255,255,255,0.12)}.popup-input{width:100%;box-sizing:border-box;padding:13px 16px;border-radius:16px;border:1px solid rgba(255,255,255,0.36);background:linear-gradient(180deg,rgba(255,255,255,0.52) 0%,rgba(240,246,255,0.24) 100%);backdrop-filter:blur(' + Math.max(12, blurAmount * 0.9) + 'px) saturate(160%);-webkit-backdrop-filter:blur(' + Math.max(12, blurAmount * 0.9) + 'px) saturate(160%);margin:2px 0 22px 0;font-size:16px;outline:none;transition:border-color 0.2s ease,box-shadow 0.2s ease,background 0.2s ease;color:#0f172a;box-shadow:inset 0 1px 0 rgba(255,255,255,0.74),inset 0 -1px 0 rgba(255,255,255,0.08),0 4px 14px rgba(15,23,42,0.06)}.popup-input:focus{border-color:rgba(0,122,255,0.52);box-shadow:inset 0 1px 0 rgba(255,255,255,0.86),0 0 0 4px rgba(0,122,255,0.12),0 12px 26px rgba(0,122,255,0.12)}.popup-input::placeholder{color:rgba(15,23,42,0.4)}@keyframes popup-sheen-glide{0%{transform:translate3d(-3%,0,0) rotate(-7deg);opacity:0.46}50%{transform:translate3d(5%,-1%,0) rotate(-4deg);opacity:0.72}100%{transform:translate3d(0,1%,0) rotate(-8deg);opacity:0.5}}@keyframes popup-liquid-drift{0%{transform:translate3d(-1.5%,-1%,0) scale(1)}50%{transform:translate3d(1.8%,1.4%,0) scale(1.04)}100%{transform:translate3d(0.6%,-0.8%,0) scale(0.98)}}@keyframes popup-liquid-breathe{0%,100%{opacity:0.86}50%{opacity:1}}@keyframes popup-energize{0%{opacity:0.28}50%{opacity:1}100%{opacity:0}}@media (max-width:520px){.liquid-glass-popup{width:min(100vw - 24px,360px);min-width:0;padding:22px 22px 0}.popup-buttons{width:calc(100% + 44px);margin:0 -22px}.popup-button{min-height:52px;font-size:17px}}';
        }

        _updateCSS() {
            var oldStyle = document.getElementById('liquid-glass-popup-css');
            if (oldStyle) oldStyle.remove();
            var style = document.createElement('style');
            style.id = 'liquid-glass-popup-css';
            style.textContent = this._getPopupCSS();
            document.head.appendChild(style);
        }

        _setGlassPointerPosition(element, event) {
            var rect = element.getBoundingClientRect();
            var x = ((event.clientX - rect.left) / rect.width) * 100;
            var y = ((event.clientY - rect.top) / rect.height) * 100;
            element.style.setProperty('--pointer-x', Math.max(0, Math.min(100, x)) + '%');
            element.style.setProperty('--pointer-y', Math.max(0, Math.min(100, y)) + '%');
        }

        _setButtonGlowPosition(button, event) {
            var rect = button.getBoundingClientRect();
            var x = ((event.clientX - rect.left) / rect.width) * 100;
            var y = ((event.clientY - rect.top) / rect.height) * 100;
            button.style.setProperty('--glow-x', Math.max(0, Math.min(100, x)) + '%');
            button.style.setProperty('--glow-y', Math.max(0, Math.min(100, y)) + '%');
        }

        _energizeButton(button, event) {
            if (event) this._setButtonGlowPosition(button, event);
            button.classList.remove('energized');
            void button.offsetWidth;
            button.classList.add('energized');
            setTimeout(function() { button.classList.remove('energized'); }, 520);
        }

        _closePopup() {
            if (!this.popupElement) return;
            var popup = this.popupElement.popup;
            var overlay = this.popupElement.overlay;
            popup.classList.remove('show');
            popup.classList.add('hide');
            overlay.classList.remove('show');
            this.popupResolve = null;
            setTimeout(function() {
                if (popup) popup.remove();
                if (overlay) overlay.remove();
                this.popupElement = null;
                this.isCreating = false;
            }.bind(this), this.animationDuration);
        }

        createPopup(title, content, type, options) {
            type = type || 'alert';
            options = options || {};
            if (this.isCreating) return Promise.resolve('');
            this.isCreating = true;

            if (this.popupElement) {
                this._closePopup();
                return new Promise(function(resolve) {
                    var checkInterval = setInterval(function() {
                        if (!this.popupElement) {
                            clearInterval(checkInterval);
                            this.createPopup(title, content, type, options).then(resolve);
                        }
                    }.bind(this), 50);
                }.bind(this));
            }

            this._updateCSS();

            var overlay = document.createElement('div');
            overlay.className = 'popup-overlay';
            document.body.appendChild(overlay);

            var popup = document.createElement('div');
            popup.className = 'liquid-glass-popup';
            popup.dataset.type = type;
            popup.tabIndex = -1;

            var liquidEl = document.createElement('div');
            liquidEl.className = 'popup-liquid';
            popup.appendChild(liquidEl);

            var titleEl = document.createElement('div');
            titleEl.className = 'popup-title';
            titleEl.textContent = title || '提示';
            popup.appendChild(titleEl);

            var contentEl = document.createElement('div');
            contentEl.className = 'popup-content';
            contentEl.textContent = content || '';
            popup.appendChild(contentEl);

            var inputEl = null;
            if (type === 'input') {
                inputEl = document.createElement('input');
                inputEl.className = 'popup-input';
                inputEl.type = 'text';
                inputEl.placeholder = options.placeholder || content;
                inputEl.value = options.defaultValue || '';
                popup.appendChild(inputEl);
            }

            var buttonsEl = document.createElement('div');
            buttonsEl.className = 'popup-buttons';
            popup.appendChild(buttonsEl);

            var primaryButton = null;
            var secondaryButton = null;

            if (type === 'alert') {
                var confirmBtn = document.createElement('button');
                confirmBtn.className = 'popup-button primary';
                confirmBtn.textContent = options.confirmText || '确定';
                confirmBtn.onclick = function() {
                    this.popupResult = confirmBtn.textContent;
                    if (this.popupResolve) this.popupResolve(this.popupResult);
                    this._closePopup();
                }.bind(this);
                buttonsEl.appendChild(confirmBtn);
                primaryButton = confirmBtn;
            } else if (type === 'confirm') {
                var yesBtn = document.createElement('button');
                yesBtn.className = 'popup-button primary';
                yesBtn.textContent = options.yesText || '是';
                yesBtn.onclick = function() {
                    this.popupResult = true;
                    if (this.popupResolve) this.popupResolve(true);
                    this._closePopup();
                }.bind(this);
                var noBtn = document.createElement('button');
                noBtn.className = 'popup-button secondary';
                noBtn.textContent = options.noText || '否';
                noBtn.onclick = function() {
                    this.popupResult = false;
                    if (this.popupResolve) this.popupResolve(false);
                    this._closePopup();
                }.bind(this);
                buttonsEl.appendChild(yesBtn);
                buttonsEl.appendChild(noBtn);
                primaryButton = yesBtn;
                secondaryButton = noBtn;
            } else if (type === 'input') {
                var confirmBtn2 = document.createElement('button');
                confirmBtn2.className = 'popup-button primary';
                confirmBtn2.textContent = options.confirmText || '确定';
                confirmBtn2.onclick = function() {
                    var inputValue = inputEl.value.trim();
                    this.popupResult = inputValue;
                    if (this.popupResolve) this.popupResolve(inputValue);
                    this._closePopup();
                }.bind(this);
                var cancelBtn = document.createElement('button');
                cancelBtn.className = 'popup-button secondary';
                cancelBtn.textContent = options.cancelText || '取消';
                cancelBtn.onclick = function() {
                    this.popupResult = '';
                    if (this.popupResolve) this.popupResolve('');
                    this._closePopup();
                }.bind(this);
                buttonsEl.appendChild(confirmBtn2);
                buttonsEl.appendChild(cancelBtn);
                primaryButton = confirmBtn2;
                secondaryButton = cancelBtn;
            }

            popup.addEventListener('pointermove', function(event) {
                this._setGlassPointerPosition(popup, event);
            }.bind(this));

            popup.addEventListener('pointerleave', function() {
                popup.style.setProperty('--pointer-x', '50%');
                popup.style.setProperty('--pointer-y', '14%');
            });

            var buttons = [primaryButton, secondaryButton];
            for (var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                if (!button) continue;
                button.addEventListener('pointermove', function(event) {
                    this._setButtonGlowPosition(button, event);
                }.bind(this));
                button.addEventListener('pointerdown', function(event) {
                    this._energizeButton(button, event);
                    this._setGlassPointerPosition(popup, event);
                }.bind(this));
            }

            popup.addEventListener('keydown', function(event) {
                if (event.key === 'Escape' && secondaryButton) {
                    event.preventDefault();
                    secondaryButton.click();
                } else if (event.key === 'Enter' && type === 'input' && primaryButton) {
                    event.preventDefault();
                    primaryButton.click();
                }
            });

            document.body.appendChild(popup);
            this.popupElement = { popup: popup, overlay: overlay };

            setTimeout(function() {
                overlay.classList.add('show');
                popup.classList.add('show');
                var focusTarget = inputEl || primaryButton || popup;
                if (focusTarget && focusTarget.focus) focusTarget.focus();
            }, 10);

            return new Promise(function(resolve) {
                this.popupResolve = resolve;
            }.bind(this));
        }

        showNativeConfirm(title, content) {
            var safeTitle = String(title || '').trim();
            var safeContent = String(content || '').trim();
            var text = (safeTitle && safeContent) ? safeTitle + '\n\n' + safeContent : (safeTitle || safeContent || '提示');
            var result = window.confirm(text);
            this.popupResult = result;
            return result;
        }

        showNativePrompt(title, content, defaultValue) {
            defaultValue = defaultValue || '';
            var safeTitle = String(title || '').trim();
            var safeContent = String(content || '').trim();
            var text = (safeTitle && safeContent) ? safeTitle + '\n\n' + safeContent : (safeTitle || safeContent || '提示');
            var result = window.prompt(text, String(defaultValue));
            var finalValue = result === null ? '' : String(result);
            this.popupResult = finalValue;
            return finalValue;
        }

        _runPopupCommand(util, factory) {
            var frame = util && util.stackFrame ? util.stackFrame : null;
            if (!frame) { return factory(); }
            if (!frame.popupCommandRequest) {
                var request = { done: false };
                frame.popupCommandRequest = request;
                Promise.resolve(factory())['finally'](function() { request.done = true; });
            }
            if (!frame.popupCommandRequest.done) {
                util.yield();
                return;
            }
            delete frame.popupCommandRequest;
        }

        showAlertPopup(args, util) {
            return this._runPopupCommand(util, function() {
                return this.createPopup(args.TITLE, args.CONTENT, 'alert', {
                    confirmText: args.BTN_TEXT
                });
            }.bind(this));
        }

        showStyledConfirmPopup(args, util) {
            return this._runPopupCommand(util, function() {
                return this.createPopup(args.TITLE, args.QUESTION, 'confirm', {
                    yesText: args.YES,
                    noText: args.NO
                });
            }.bind(this));
        }

        showStyledInputPopup(args, util) {
            return this._runPopupCommand(util, function() {
                return this.createPopup(args.TITLE, args.PROMPT, 'input', {
                    defaultValue: args.DEFAULT,
                    confirmText: args.CONFIRM,
                    cancelText: args.CANCEL
                });
            }.bind(this));
        }

        setPopupStyle(opacity, radius, blur, duration) {
            this.animationDuration = duration || 300;
            this.style.opacity = opacity || 0.8;
            this.style.borderRadius = radius || 20;
            this.style.blur = blur || 20;
            this._updateCSS();
        }

        closePopup() { this._closePopup(); }
        getPopupResult() { return this.popupResult !== undefined ? this.popupResult : ''; }
    }

    // ============================================================
    // 5. 窗口管理模块
    // ============================================================
    class WindowTools {
        constructor() {
            this.winList = {};
            this.drag = null;
            this.resize = null;
            this.bindMouseEvents();
        }

        bindMouseEvents() {
            document.addEventListener("mousemove", function(e) {
                if (this.drag) {
                    var el = this.drag.el;
                    var ox = this.drag.ox;
                    var oy = this.drag.oy;
                    el.style.left = (e.clientX - ox) + "px";
                    el.style.top = (e.clientY - oy) + "px";
                }
                if (this.resize) {
                    var el = this.resize.el;
                    var w = this.resize.w;
                    var h = this.resize.h;
                    var sx = this.resize.sx;
                    var sy = this.resize.sy;
                    var nw = w + (e.clientX - sx);
                    var nh = h + (e.clientY - sy);
                    if (nw < 280) nw = 280;
                    if (nh < 220) nh = 220;
                    el.style.width = nw + "px";
                    el.style.height = nh + "px";
                }
            }.bind(this));
            document.addEventListener("mouseup", function() {
                this.drag = null;
                this.resize = null;
            }.bind(this));
        }

        createWindow(name, url) {
            if (this.winList[name]) return;
            var vw = window.innerWidth;
            var vh = window.innerHeight;
            var winW = 580;
            var winH = 400;

            var winBox = document.createElement("div");
            winBox.style.cssText = 'position:fixed;left:' + ((vw - winW) / 2) + 'px;top:' + ((vh - winH) / 2) + 'px;width:' + winW + 'px;height:' + winH + 'px;border-radius:16px;overflow:hidden;z-index:9998;background:rgba(18,18,18,0.55);backdrop-filter:blur(18px) saturate(110%);-webkit-backdrop-filter:blur(18px) saturate(110%);border:1px solid rgba(255,255,255,0.12);transition:width 0.2s,height 0.2s,left 0.2s,top 0.2s;';

            var titleBar = document.createElement("div");
            titleBar.style.cssText = 'height:36px;background:rgba(0,0,0,0.25);display:flex;align-items:center;padding:0 14px;gap:10px;cursor:grab;user-select:none;';

            var btnGroup = document.createElement("div");
            btnGroup.style.display = "flex";
            btnGroup.style.gap = "9px";

            var closeBtn = document.createElement("div");
            closeBtn.style.cssText = "width:13px;height:13px;border-radius:50%;background:#ff5757;cursor:pointer;";
            closeBtn.onclick = function() { this.closeWindow(name); }.bind(this);

            var zoomMaxBtn = document.createElement("div");
            zoomMaxBtn.style.cssText = "width:13px;height:13px;border-radius:50%;background:#ffc145;cursor:pointer;";
            zoomMaxBtn.onclick = function() {
                var w = this.winList[name];
                if (!w) return;
                w.box.style.transition = "width 0.2s, height 0.2s, left 0.2s, top 0.2s";
                w.box.style.left = "0px";
                w.box.style.top = "0px";
                w.box.style.width = "100vw";
                w.box.style.height = "100vh";
            }.bind(this);

            var zoomMinBtn = document.createElement("div");
            zoomMinBtn.style.cssText = "width:13px;height:13px;border-radius:50%;background:#39d353;cursor:pointer;";
            zoomMinBtn.onclick = function() {
                var w = this.winList[name];
                if (!w) return;
                w.box.style.transition = "width 0.2s, height 0.2s, left 0.2s, top 0.2s";
                this.moveWindow(name, "中央");
                w.box.style.width = "580px";
                w.box.style.height = "400px";
                var vm = Scratch.vm;
                if (vm && vm.runtime && vm.runtime.startHats) vm.runtime.startHats("window_minimize");
            }.bind(this);

            btnGroup.appendChild(closeBtn);
            btnGroup.appendChild(zoomMaxBtn);
            btnGroup.appendChild(zoomMinBtn);

            var winTitle = document.createElement("span");
            winTitle.style.cssText = "flex:1;text-align:center;color:#e8e8e8;font-size:13px;";
            winTitle.innerText = name;
            titleBar.appendChild(btnGroup);
            titleBar.appendChild(winTitle);

            var toolBar = document.createElement("div");
            toolBar.style.cssText = 'height:32px;background:rgba(0,0,0,0.2);display:flex;align-items:center;padding:0 10px;gap:8px;display:none;';

            var refreshBtn = document.createElement("button");
            refreshBtn.innerText = "刷新";
            refreshBtn.style.cssText = "border:none;border-radius:4px;background:#333;color:#fff;padding:2px 10px;font-size:12px;cursor:pointer;";
            refreshBtn.onclick = function() { this.refreshWindow(name); }.bind(this);

            var urlInput = document.createElement("input");
            urlInput.style.cssText = "flex:1;height:22px;border:none;border-radius:4px;background:rgba(255,255,255,0.1);color:#fff;padding:0 6px;outline:none;font-size:12px;";
            urlInput.value = url;

            var goBtn = document.createElement("button");
            goBtn.innerText = "前往";
            goBtn.style.cssText = "border:none;border-radius:4px;background:#333;color:#fff;padding:2px 10px;font-size:12px;cursor:pointer;";
            goBtn.onclick = function() { this.goToUrl(name, urlInput.value); }.bind(this);

            toolBar.appendChild(refreshBtn);
            toolBar.appendChild(urlInput);
            toolBar.appendChild(goBtn);

            var iframeDom = document.createElement("iframe");
            iframeDom.style.border = "none";
            iframeDom.style.width = "100%";
            var setIframeH = function() {
                iframeDom.style.height = toolBar.style.display === "flex" ? "calc(100% - 68px)" : "calc(100% - 36px)";
            };
            setIframeH();
            iframeDom.src = url;

            var resizeHandle = document.createElement("div");
            resizeHandle.style.cssText = "position:absolute;right:0;bottom:0;width:22px;height:22px;cursor:nwse-resize;";

            winBox.appendChild(titleBar);
            winBox.appendChild(toolBar);
            winBox.appendChild(iframeDom);
            winBox.appendChild(resizeHandle);
            document.body.appendChild(winBox);
            this.winList[name] = { box: winBox, iframe: iframeDom, bar: toolBar, input: urlInput };

            titleBar.onmousedown = function(e) {
                e.preventDefault();
                var r = winBox.getBoundingClientRect();
                this.drag = { el: winBox, ox: e.clientX - r.left, oy: e.clientY - r.top };
                titleBar.style.cursor = "grabbing";
                winBox.style.transition = "none";
            }.bind(this);
            titleBar.onmouseup = function() { titleBar.style.cursor = "grab"; };

            resizeHandle.onmousedown = function(e) {
                e.preventDefault();
                this.resize = {
                    el: winBox,
                    w: winBox.offsetWidth,
                    h: winBox.offsetHeight,
                    sx: e.clientX,
                    sy: e.clientY
                };
                winBox.style.transition = "none";
            }.bind(this);
        }

        moveWindow(name, pos) {
            var win = this.winList[name];
            if (!win) return;
            var b = win.box;
            var ww = b.offsetWidth;
            var wh = b.offsetHeight;
            var vw = window.innerWidth;
            var vh = window.innerHeight;

            b.style.transition = "none";
            switch (pos) {
                case "中央": b.style.left = (vw - ww) / 2 + "px"; b.style.top = (vh - wh) / 2 + "px"; break;
                case "左上": b.style.left = "20px"; b.style.top = "20px"; break;
                case "右上": b.style.left = (vw - ww - 20) + "px"; b.style.top = "20px"; break;
                case "顶部": b.style.left = (vw - ww) / 2 + "px"; b.style.top = "20px"; break;
                case "底部": b.style.left = (vw - ww) / 2 + "px"; b.style.top = (vh - wh - 20) + "px"; break;
            }
        }

        closeWindow(name) {
            if (this.winList[name]) {
                this.winList[name].box.remove();
                delete this.winList[name];
            }
        }

        refreshWindow(name) {
            var w = this.winList[name];
            if (w) w.iframe.src = w.iframe.src;
        }

        goToUrl(name, url) {
            var w = this.winList[name];
            if (w) { w.iframe.src = url; w.input.value = url; }
        }

        getCurrentUrl(name) {
            var w = this.winList[name];
            return w && w.iframe ? w.iframe.src : "无窗口";
        }

        setWindowBg(name, color, blur) {
            var w = this.winList[name];
            if (!w) return;
            var r = parseInt(color.slice(1, 3), 16);
            var g = parseInt(color.slice(3, 5), 16);
            var b = parseInt(color.slice(5, 7), 16);
            w.box.style.background = 'rgba(' + r + ',' + g + ',' + b + ',0.55)';
            w.box.style.backdropFilter = 'blur(' + blur + 'px) saturate(110%)';
            w.box.style.webkitBackdropFilter = 'blur(' + blur + 'px) saturate(110%)';
        }

        closeAllWindows() {
            var names = Object.keys(this.winList);
            for (var i = 0; i < names.length; i++) {
                this.closeWindow(names[i]);
            }
        }
    }

    // ============================================================
    // 6. Iframe 嵌入模块
    // ============================================================
    class IframeTools {
        constructor() {
            this.iframe = null;
            this.overlay = null;
            this.x = 0;
            this.y = 0;
            this.width = -1;
            this.height = -1;
            this.interactive = true;
            this.resizeBehavior = "scale";
            this.latestMessage = "";
            this.featurePolicy = {
                accelerometer: "'none'", "ambient-light-sensor": "'none'", battery: "'none'",
                camera: "'none'", "display-capture": "'none'", "document-domain": "'none'",
                "encrypted-media": "'none'", fullscreen: "'none'", geolocation: "'none'",
                gyroscope: "'none'", magnetometer: "'none'", microphone: "'none'",
                midi: "'none'", payment: "'none'", "picture-in-picture": "'none'",
                "publickey-credentials-get": "'none'", "speaker-selection": "'none'",
                usb: "'none'", vibrate: "'none'", vr: "'none'", "screen-wake-lock": "'none'",
                "web-share": "'none'", "interest-cohort": "'none'", "navigation-override": "'none'",
                "popups": "'none'"
            };
            this.SANDBOX = [
                "allow-same-origin", "allow-scripts", "allow-forms", "allow-modals",
                "allow-popups-to-escape-sandbox", "allow-downloads", "allow-pointer-lock"
            ];

            window.addEventListener("message", function(e) {
                if (this.iframe && this.iframe.contentWindow && e.source === this.iframe.contentWindow) {
                    this.latestMessage = (typeof e.data === 'string' || typeof e.data === 'number' || typeof e.data === 'boolean')
                        ? e.data : JSON.stringify(e.data);
                    var vm = Scratch.vm;
                    if (vm && vm.runtime && vm.runtime.startHats) vm.runtime.startHats("iframe_whenMessage");
                }
            }.bind(this));

            var vm = Scratch.vm;
            if (vm) {
                if (vm.on) vm.on("STAGE_SIZE_CHANGED", this._updateFrameAttributes.bind(this));
                if (vm.runtime && vm.runtime.on) vm.runtime.on("RUNTIME_DISPOSED", this._closeFrame.bind(this));
            }
        }

        get renderer() { return Scratch.renderer; }
        get runtime() { 
            var vm = Scratch.vm;
            return vm ? vm.runtime : null; 
        }

        _updateFrameAttributes() {
            if (!this.iframe) return;
            this.iframe.style.pointerEvents = this.interactive ? "auto" : "none";
            var runtime = this.runtime;
            var stageWidth = runtime ? runtime.stageWidth : 480;
            var stageHeight = runtime ? runtime.stageHeight : 360;
            var effectiveWidth = this.width >= 0 ? this.width : stageWidth;
            var effectiveHeight = this.height >= 0 ? this.height : stageHeight;

            if (this.resizeBehavior === "scale") {
                this.iframe.style.width = effectiveWidth + 'px';
                this.iframe.style.height = effectiveHeight + 'px';
                this.iframe.style.transform = 'translate(' + (-effectiveWidth / 2 + this.x) + 'px, ' + (-effectiveHeight / 2 - this.y) + 'px)';
                this.iframe.style.top = "0";
                this.iframe.style.left = "0";
            } else {
                this.iframe.style.width = ((effectiveWidth / stageWidth) * 100) + '%';
                this.iframe.style.height = ((effectiveHeight / stageHeight) * 100) + '%';
                this.iframe.style.transform = "";
                this.iframe.style.top = ((0.5 - effectiveHeight / 2 / stageHeight - this.y / stageHeight) * 100) + '%';
                this.iframe.style.left = ((0.5 - effectiveWidth / 2 / stageWidth + this.x / stageWidth) * 100) + '%';
            }
        }

        _getOverlayMode() { return this.resizeBehavior === "scale" ? "scale-centered" : "manual"; }

        _createFrame(src) {
            this._closeFrame();
            this.iframe = document.createElement("iframe");
            this.iframe.style.width = "100%";
            this.iframe.style.height = "100%";
            this.iframe.style.border = "none";
            this.iframe.style.position = "absolute";
            this.iframe.style.zIndex = "9999";
            this.iframe.setAttribute("sandbox", this.SANDBOX.join(" "));
            var policyStr = '';
            var policyKeys = Object.keys(this.featurePolicy);
            for (var i = 0; i < policyKeys.length; i++) {
                var key = policyKeys[i];
                policyStr += key + ' ' + this.featurePolicy[key] + '; ';
            }
            this.iframe.setAttribute("allow", policyStr);
            this.iframe.setAttribute("allowtransparency", "true");
            this.iframe.setAttribute("src", src);

            this.iframe.addEventListener("load", function() {
                try {
                    var interceptScript = document.createElement("script");
                    interceptScript.textContent = 'document.addEventListener("click",function(e){var target=e.target.closest("a");if(target&&target.href){e.preventDefault();window.location.href=target.href;}});var originalOpen=window.open;window.open=function(url){window.location.href=url;return{close:function(){},focus:function(){}};};';
                    this.iframe.contentDocument.head.appendChild(interceptScript);
                } catch (e) {}
            }.bind(this));

            this.iframe.addEventListener("beforeunload", function(e) {
                e.preventDefault();
                e.returnValue = "";
            });

            var renderer = this.renderer;
            if (renderer && renderer.addOverlay) {
                this.overlay = renderer.addOverlay(this.iframe, this._getOverlayMode());
            }
            this._updateFrameAttributes();
        }

        _closeFrame() {
            if (this.iframe) {
                var renderer = this.renderer;
                if (renderer && renderer.removeOverlay) renderer.removeOverlay(this.iframe);
                this.iframe.remove();
                this.iframe = null;
                this.overlay = null;
            }
        }

        display(url) {
            this._closeFrame();
            var normalizedURL = Scratch.Cast.toString(url).trim();
            if (!/^https?:\/\//i.test(normalizedURL)) return;
            if (Scratch.canEmbed) {
                Scratch.canEmbed(normalizedURL).then(function(ok) { if (ok) this._createFrame(normalizedURL); }.bind(this));
            } else {
                this._createFrame(normalizedURL);
            }
        }

        displayHTML(html) {
            this._closeFrame();
            var url = 'data:text/html;,' + encodeURIComponent(Scratch.Cast.toString(html));
            if (Scratch.canEmbed) {
                Scratch.canEmbed(url).then(function(ok) { if (ok) this._createFrame(url); }.bind(this));
            } else {
                this._createFrame(url);
            }
        }

        showIframe() { if (this.iframe) this.iframe.style.display = "block"; }
        hideIframe() { if (this.iframe) this.iframe.style.display = "none"; }
        closeIframe() { this._closeFrame(); }

        getIframe(menu) {
            menu = Scratch.Cast.toString(menu);
            if (menu === "url") return this.iframe ? this.iframe.getAttribute("src") : "";
            if (menu === "visible") return !!(this.iframe && this.iframe.style.display !== "none");
            if (menu === "x") return this.x;
            if (menu === "y") return this.y;
            if (menu === "width") return this.width >= 0 ? this.width : (this.runtime ? this.runtime.stageWidth : 480);
            if (menu === "height") return this.height >= 0 ? this.height : (this.runtime ? this.runtime.stageHeight : 360);
            if (menu === "interactive") return this.interactive;
            if (menu === "resize behavior") return this.resizeBehavior;
            return "";
        }

        setIframeX(x) { this.x = Scratch.Cast.toNumber(x); this._updateFrameAttributes(); }
        setIframeY(y) { this.y = Scratch.Cast.toNumber(y); this._updateFrameAttributes(); }
        setIframeWidth(w) { this.width = Scratch.Cast.toNumber(w); this._updateFrameAttributes(); }
        setIframeHeight(h) { this.height = Scratch.Cast.toNumber(h); this._updateFrameAttributes(); }
        setIframeInteractive(interactive) {
            this.interactive = Scratch.Cast.toBoolean(interactive);
            this._updateFrameAttributes();
        }
        setIframeResize(resize) {
            if (resize === "scale" || resize === "viewport") {
                this.resizeBehavior = resize;
                if (this.overlay) {
                    this.overlay.mode = this._getOverlayMode();
                    var renderer = this.renderer;
                    if (renderer && renderer._updateOverlays) renderer._updateOverlays();
                    this._updateFrameAttributes();
                }
            }
        }

        sendIframeMessage(message) {
            if (this.iframe && this.iframe.contentWindow) {
                this.iframe.contentWindow.postMessage(message, "*");
            }
        }

        getIframeMessage() { return this.latestMessage; }
    }

    // ============================================================
    // 7. 文档编辑模块
    // ============================================================
    class DocumentTools {
        constructor() {
            this.docTitle = '无标题文档';
            this.winDom = null;
            this.txtWinDom = null;
            this.isDragWin = false;
            this.winStartX = 0;
            this.winStartY = 0;
            this.winMinStatus = false;
            this.winMaxStatus = false;
            this.winOldW = 450;
            this.winOldH = 350;
            this.winOldL = 100;
            this.winOldT = 80;
            this.isResizing = false;
            this.resizeStartX = 0;
            this.resizeStartY = 0;
            this.resizeStartW = 0;
            this.resizeStartH = 0;
            this.sharedText = '';
            this.glassOpacity = 0.85;
            this.glassBlur = 12;
        }

        getStageRect() {
            var selectors = ['.stage_stage_1fD7V canvas', '.stage canvas', 'canvas[class*="stage"]', 'canvas'];
            for (var i = 0; i < selectors.length; i++) {
                var el = document.querySelector(selectors[i]);
                if (el) {
                    var rect = el.getBoundingClientRect();
                    if (rect.width > 100 && rect.height > 100) return rect;
                }
            }
            return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
        }

        syncAllText() {
            if (this.winDom) {
                var ed = this.winDom.querySelector('.editor');
                if (ed) this.sharedText = ed.innerText;
            }
            if (this.txtWinDom) {
                var txtarea = this.txtWinDom.querySelector('textarea');
                if (txtarea) txtarea.value = this.sharedText;
            }
        }

        refreshAllGlass() {
            var windows = [this.winDom, this.txtWinDom];
            for (var i = 0; i < windows.length; i++) {
                var w = windows[i];
                if (!w) continue;
                w.style.background = 'rgba(30,30,30,' + this.glassOpacity + ')';
                w.style.backdropFilter = 'blur(' + this.glassBlur + 'px)';
                w.style.webkitBackdropFilter = 'blur(' + this.glassBlur + 'px)';
            }
        }

        openMainWindow() {
            if (this.winDom) return;
            var wrap = document.createElement('div');
            var winW = 450;
            var winH = 350;
            var rect = this.getStageRect();
            var left = rect.left + rect.width / 2 - winW / 2;
            var top = rect.top + rect.height / 2 - winH / 2;

            wrap.style.cssText = 'position:fixed;top:' + top + 'px;left:' + left + 'px;width:' + winW + 'px;height:' + winH + 'px;border-radius:12px;z-index:9999;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.15);border:1px solid rgba(255,255,255,0.2);min-width:300px;min-height:200px;';
            
            var titleBar = document.createElement('div');
            titleBar.style.cssText = 'width:100%;height:36px;background:rgba(40,40,40,0.7);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;padding:0 12px;cursor:move;user-select:none;border-bottom:1px solid rgba(0,0,0,0.08);';
            
            var btnBox = document.createElement('div');
            btnBox.style.cssText = 'display:flex;gap:8px;margin-right:12px;pointer-events:auto;';

            var btnClose = document.createElement('div');
            btnClose.style.cssText = 'width:14px;height:14px;border-radius:50%;background:#FF5F57;cursor:pointer;pointer-events:auto;';
            btnClose.onclick = function() { wrap.remove(); this.winDom = null; }.bind(this);

            var btnMax = document.createElement('div');
            btnMax.style.cssText = 'width:14px;height:14px;border-radius:50%;background:#FFBD2E;cursor:pointer;pointer-events:auto;';
            btnMax.onclick = function() {
                if (!this.winMaxStatus) {
                    this.winOldW = wrap.offsetWidth;
                    this.winOldH = wrap.offsetHeight;
                    this.winOldL = wrap.offsetLeft;
                    this.winOldT = wrap.offsetTop;
                    wrap.style.left = '0';
                    wrap.style.top = '0';
                    wrap.style.width = '100vw';
                    wrap.style.height = '100vh';
                    this.winMaxStatus = true;
                } else {
                    wrap.style.left = this.winOldL + 'px';
                    wrap.style.top = this.winOldT + 'px';
                    wrap.style.width = this.winOldW + 'px';
                    wrap.style.height = this.winOldH + 'px';
                    this.winMaxStatus = false;
                }
            }.bind(this);

            var btnMin = document.createElement('div');
            btnMin.style.cssText = 'width:14px;height:14px;border-radius:50%;background:#28C840;cursor:pointer;pointer-events:auto;';
            btnMin.onclick = function() {
                if (!this.winMinStatus) {
                    this.winOldH = wrap.offsetHeight;
                    wrap.style.height = '36px';
                    this.winMinStatus = true;
                } else {
                    wrap.style.height = this.winOldH + 'px';
                    this.winMinStatus = false;
                }
            }.bind(this);

            btnBox.appendChild(btnClose);
            btnBox.appendChild(btnMax);
            btnBox.appendChild(btnMin);
            
            var titleText = document.createElement('div');
            titleText.className = 'title-text';
            titleText.innerText = this.docTitle;
            titleText.style.cssText = 'flex:1;text-align:center;font-size:13px;color:#fff;';
            titleBar.appendChild(btnBox);
            titleBar.appendChild(titleText);

            var editor = document.createElement('div');
            editor.className = 'editor';
            editor.contentEditable = true;
            editor.style.cssText = 'width:100%;height:calc(100% - 36px);border:none;outline:none;padding:15px;font-family:微软雅黑;font-size:16px;box-sizing:border-box;background:rgba(25,25,25,0.5);color:#fff;overflow:auto;white-space:pre-wrap;';
            editor.innerText = this.sharedText;
            editor.oninput = function() { this.syncAllText(); }.bind(this);

            var corner = document.createElement('div');
            corner.style.cssText = 'position:absolute;width:16px;height:16px;z-index:10;cursor:nwse-resize;bottom:0;right:0;';
            corner.onmousedown = function(e) {
                e.preventDefault();
                this.isResizing = true;
                this.resizeStartX = e.clientX;
                this.resizeStartY = e.clientY;
                this.resizeStartW = wrap.offsetWidth;
                this.resizeStartH = wrap.offsetHeight;
            }.bind(this);
            wrap.appendChild(corner);

            wrap.appendChild(titleBar);
            wrap.appendChild(editor);
            document.body.appendChild(wrap);
            this.winDom = wrap;

            titleBar.onmousedown = function(e) {
                e.preventDefault();
                this.isDragWin = true;
                this.winStartX = e.clientX - wrap.getBoundingClientRect().left;
                this.winStartY = e.clientY - wrap.getBoundingClientRect().top;
            }.bind(this);

            document.onmousemove = function(e) {
                if (this.isDragWin && !this.winMaxStatus) {
                    wrap.style.left = (e.clientX - this.winStartX) + 'px';
                    wrap.style.top = (e.clientY - this.winStartY) + 'px';
                }
                if (this.isResizing && !this.winMaxStatus) {
                    var nw = Math.max(300, this.resizeStartW + (e.clientX - this.resizeStartX));
                    var nh = Math.max(200, this.resizeStartH + (e.clientY - this.resizeStartY));
                    wrap.style.width = nw + 'px';
                    wrap.style.height = nh + 'px';
                }
            }.bind(this);

            document.onmouseup = function() {
                this.isDragWin = false;
                this.isResizing = false;
            }.bind(this);
            this.refreshAllGlass();
        }

        openTxtViewer() {
            if (this.txtWinDom) return;
            var winW = 450;
            var winH = 350;
            var rect = this.getStageRect();
            var left = rect.left + rect.width / 2 + 30;
            var top = rect.top + rect.height / 2 - winH / 2;

            var wrap = document.createElement('div');
            wrap.style.cssText = 'position:fixed;top:' + top + 'px;left:' + left + 'px;width:' + winW + 'px;height:' + winH + 'px;border-radius:12px;z-index:9999;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.15);border:1px solid rgba(255,255,255,0.2);min-width:300px;min-height:200px;';
            
            var titleBar = document.createElement('div');
            titleBar.style.cssText = 'width:100%;height:36px;background:rgba(40,40,40,0.7);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;padding:0 12px;cursor:move;user-select:none;border-bottom:1px solid rgba(0,0,0,0.08);';
            
            var btnBox = document.createElement('div');
            btnBox.style.cssText = 'display:flex;gap:8px;margin-right:12px;pointer-events:auto;';

            var btnClose = document.createElement('div');
            btnClose.style.cssText = 'width:14px;height:14px;border-radius:50%;background:#FF5F57;cursor:pointer;pointer-events:auto;';
            btnClose.onclick = function() { wrap.remove(); this.txtWinDom = null; }.bind(this);

            var btnMax = document.createElement('div');
            btnMax.style.cssText = 'width:14px;height:14px;border-radius:50%;background:#FFBD2E;cursor:pointer;pointer-events:auto;';
            btnMax.onclick = function() {
                if (!this.winMaxStatus) {
                    this.winOldW = wrap.offsetWidth;
                    this.winOldH = wrap.offsetHeight;
                    this.winOldL = wrap.offsetLeft;
                    this.winOldT = wrap.offsetTop;
                    wrap.style.left = '0';
                    wrap.style.top = '0';
                    wrap.style.width = '100vw';
                    wrap.style.height = '100vh';
                    this.winMaxStatus = true;
                } else {
                    wrap.style.left = this.winOldL + 'px';
                    wrap.style.top = this.winOldT + 'px';
                    wrap.style.width = this.winOldW + 'px';
                    wrap.style.height = this.winOldH + 'px';
                    this.winMaxStatus = false;
                }
            }.bind(this);

            var btnMin = document.createElement('div');
            btnMin.style.cssText = 'width:14px;height:14px;border-radius:50%;background:#28C840;cursor:pointer;pointer-events:auto;';
            btnMin.onclick = function() {
                if (!this.winMinStatus) {
                    this.winOldH = wrap.offsetHeight;
                    wrap.style.height = '36px';
                    this.winMinStatus = true;
                } else {
                    wrap.style.height = this.winOldH + 'px';
                    this.winMinStatus = false;
                }
            }.bind(this);

            btnBox.appendChild(btnClose);
            btnBox.appendChild(btnMax);
            btnBox.appendChild(btnMin);
            
            var titleText = document.createElement('div');
            titleText.className = 'title-text';
            titleText.innerText = 'TXT 同步文本窗口';
            titleText.style.cssText = 'flex:1;text-align:center;font-size:13px;color:#fff;';
            titleBar.appendChild(btnBox);
            titleBar.appendChild(titleText);

            var textarea = document.createElement('textarea');
            textarea.style.cssText = 'width:100%;height:calc(100% - 36px);border:none;outline:none;padding:15px;font-family:Consolas,微软雅黑;font-size:14px;box-sizing:border-box;resize:none;background:rgba(25,25,25,0.5);color:#fff;';
            textarea.value = this.sharedText;
            textarea.oninput = function() {
                this.sharedText = textarea.value;
                if (this.winDom) {
                    var ed = this.winDom.querySelector('.editor');
                    if (ed) ed.innerText = this.sharedText;
                }
            }.bind(this);

            var corner = document.createElement('div');
            corner.style.cssText = 'position:absolute;width:16px;height:16px;z-index:10;cursor:nwse-resize;bottom:0;right:0;';
            corner.onmousedown = function(e) {
                e.preventDefault();
                this.isResizing = true;
                this.resizeStartX = e.clientX;
                this.resizeStartY = e.clientY;
                this.resizeStartW = wrap.offsetWidth;
                this.resizeStartH = wrap.offsetHeight;
            }.bind(this);
            wrap.appendChild(corner);

            wrap.appendChild(titleBar);
            wrap.appendChild(textarea);
            document.body.appendChild(wrap);
            this.txtWinDom = wrap;

            titleBar.onmousedown = function(e) {
                e.preventDefault();
                this.isDragWin = true;
                this.winStartX = e.clientX - wrap.getBoundingClientRect().left;
                this.winStartY = e.clientY - wrap.getBoundingClientRect().top;
            }.bind(this);

            document.onmousemove = function(e) {
                if (this.isDragWin && !this.winMaxStatus) {
                    wrap.style.left = (e.clientX - this.winStartX) + 'px';
                    wrap.style.top = (e.clientY - this.winStartY) + 'px';
                }
                if (this.isResizing && !this.winMaxStatus) {
                    var nw = Math.max(300, this.resizeStartW + (e.clientX - this.resizeStartX));
                    var nh = Math.max(200, this.resizeStartH + (e.clientY - this.resizeStartY));
                    wrap.style.width = nw + 'px';
                    wrap.style.height = nh + 'px';
                }
            }.bind(this);

            document.onmouseup = function() {
                this.isDragWin = false;
                this.isResizing = false;
            }.bind(this);
            this.refreshAllGlass();
        }

        openFilePicker() {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = '.docx,.doc,.txt,.js,.css,.html,.md';
            input.onchange = function(e) {
                var file = e.target.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function(ev) {
                    this.sharedText = ev.target.result;
                    if (!this.winDom) this.openMainWindow();
                    setTimeout(function() {
                        var ed = this.winDom ? this.winDom.querySelector('.editor') : null;
                        if (ed) ed.innerText = this.sharedText;
                        if (this.txtWinDom) {
                            var ta = this.txtWinDom.querySelector('textarea');
                            if (ta) ta.value = this.sharedText;
                        }
                    }.bind(this), 100);
                }.bind(this);
                reader.readAsText(file);
            }.bind(this);
            input.click();
        }

        closeAllWindows() {
            if (this.winDom) { this.winDom.remove(); this.winDom = null; }
            if (this.txtWinDom) { this.txtWinDom.remove(); this.txtWinDom = null; }
        }

        setDocTitle(title) {
            this.docTitle = title;
            if (this.winDom) {
                var t = this.winDom.querySelector('.title-text');
                if (t) t.innerText = this.docTitle;
            }
        }

        getAllText() { return this.sharedText; }

        setAllText(txt) {
            this.sharedText = txt;
            if (this.winDom) {
                var ed = this.winDom.querySelector('.editor');
                if (ed) ed.innerText = this.sharedText;
            }
            if (this.txtWinDom) {
                var ta = this.txtWinDom.querySelector('textarea');
                if (ta) ta.value = this.sharedText;
            }
        }

        setGlassEffect(o, b) {
            if (!isNaN(o)) this.glassOpacity = Math.max(0.1, Math.min(1, o));
            if (!isNaN(b)) this.glassBlur = Math.max(0, Math.min(50, b));
            this.refreshAllGlass();
        }

        exportDocNow() {
            this.syncAllText();
            var blob = new Blob([this.sharedText], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = this.docTitle + '.docx';
            a.click();
            URL.revokeObjectURL(url);
        }

        setLineCount(num) {
            // 保留接口
        }
    }

    // ============================================================
    // 8. 主扩展类
    // ============================================================
    class UIToolbox {
        constructor() {
            this.fileTools = new FileTools();
            this.gaussianTools = new GaussianBlurTools();
            this.costumeTools = new CostumeBlurTools();
            this.popupTools = new PopupTools();
            this.windowTools = new WindowTools();
            this.iframeTools = new IframeTools();
            this.documentTools = new DocumentTools();
        }

        getInfo() {
            return {
                id: 'UIToolsBox',
                name: 'UI工具箱',
                color1: '#6C5CE7',
                color2: '#5A4BD1',
                color3: '#4834B5',
                blocks: [
                    // ===== 文件操作 =====
                    {
                        opcode: 'openSingleFile',
                        blockType: 'command',
                        text: '打开单个文件[FILETYPE]',
                        arguments: {
                            FILETYPE: { type: 'string', defaultValue: "*" }
                        }
                    },
                    {
                        opcode: 'openMultipleFiles',
                        blockType: 'command',
                        text: '打开多个文件[FILETYPE]',
                        arguments: {
                            FILETYPE: { type: 'string', defaultValue: "*" }
                        }
                    },
                    '---',
                    {
                        opcode: 'getFileProperty',
                        blockType: 'reporter',
                        text: '打开的第[INDEX]个文件的[PROPERTY]',
                        arguments: {
                            INDEX: { type: 'number', defaultValue: 1 },
                            PROPERTY: { type: 'string', menu: 'filePropertyMenu' }
                        }
                    },
                    {
                        opcode: 'getFileContent',
                        blockType: 'reporter',
                        text: '打开的第[INDEX]个文件作为[TYPE]',
                        arguments: {
                            INDEX: { type: 'number', defaultValue: 1 },
                            TYPE: { type: 'string', menu: 'fileContentMenu' }
                        }
                    },
                    {
                        opcode: 'getFileCount',
                        blockType: 'reporter',
                        text: '打开了多少个文件'
                    },
                    '---',
                    {
                        opcode: 'downloadText',
                        blockType: 'command',
                        text: '下载文本[CONTENT]名为[NAME]',
                        arguments: {
                            CONTENT: { type: 'string', defaultValue: "Hello, World!" },
                            NAME: { type: 'string', defaultValue: "example.txt" }
                        }
                    },
                    {
                        opcode: 'downloadDataURL',
                        blockType: 'command',
                        text: '下载DataURL[URL]名为[NAME]',
                        arguments: {
                            URL: { type: 'string', defaultValue: "data:text/plain;base64,SGVsbG8gV29ybGQh" },
                            NAME: { type: 'string', defaultValue: "file.bin" }
                        }
                    },

                    // ===== 位图高斯模糊 =====
                    '---',
                    {
                        opcode: 'applyBlur',
                        blockType: 'reporter',
                        text: '高斯模糊DataURL [IMAGE] 模糊程度 [RADIUS] 去除边缘 [ANTIEDGE]',
                        arguments: {
                            IMAGE: { type: 'string', defaultValue: '' },
                            RADIUS: { type: 'number', defaultValue: 5 },
                            ANTIEDGE: { type: 'string', menu: 'onOffMenu' }
                        }
                    },
                    {
                        opcode: 'resizeImage',
                        blockType: 'reporter',
                        text: '调整图片分辨率 [IMAGE] 宽度 [WIDTH] 高度 [HEIGHT]',
                        arguments: {
                            IMAGE: { type: 'string', defaultValue: '' },
                            WIDTH: { type: 'number', defaultValue: 400 },
                            HEIGHT: { type: 'number', defaultValue: 300 }
                        }
                    },
                    {
                        opcode: 'getCostumeURL',
                        blockType: 'reporter',
                        text: '获取造型URL'
                    },

                    // ===== 造型模糊 =====
                    '---',
                    {
                        opcode: 'setBlur',
                        blockType: 'command',
                        text: '设定模糊为[blur]px',
                        arguments: {
                            blur: { type: 'number', defaultValue: 5 }
                        }
                    },
                    {
                        opcode: 'getBlur',
                        blockType: 'reporter',
                        text: '当前模糊值(px)'
                    },
                    {
                        opcode: 'changeBlur',
                        blockType: 'command',
                        text: '增加模糊值[blur]px',
                        arguments: {
                            blur: { type: 'number', defaultValue: 5 }
                        }
                    },
                    {
                        opcode: 'returnOriginal',
                        blockType: 'command',
                        text: '还原图像'
                    },
                    {
                        blockType: 'label',
                        text: '⚠️ 如果你不知道你在做什么，千万不要使用以下积木！'
                    },
                    {
                        opcode: 'clearCache',
                        blockType: 'command',
                        text: '清除缓存'
                    },

                    // ===== 液态玻璃弹窗 =====
                    '---',
                    {
                        opcode: 'showAlertPopup',
                        blockType: 'command',
                        text: '显示液态玻璃提示弹窗并等待 标题：[TITLE] 内容：[CONTENT] 按钮文字：[BTN_TEXT]',
                        arguments: {
                            TITLE: { type: 'string', defaultValue: '提示' },
                            CONTENT: { type: 'string', defaultValue: '这是液态玻璃弹窗' },
                            BTN_TEXT: { type: 'string', defaultValue: '确定' }
                        }
                    },
                    '---稳定输出型积木（可嵌套到任意参数）',
                    {
                        opcode: 'showConfirmPopup',
                        blockType: 'boolean',
                        text: '稳定问答输出 标题：[TITLE] 问题：[QUESTION] 是：[YES] 否：[NO]',
                        arguments: {
                            TITLE: { type: 'string', defaultValue: '提问' },
                            QUESTION: { type: 'string', defaultValue: '你确定吗？' },
                            YES: { type: 'string', defaultValue: '是' },
                            NO: { type: 'string', defaultValue: '否' }
                        }
                    },
                    {
                        opcode: 'showInputPopup',
                        blockType: 'reporter',
                        text: '稳定输入输出 标题：[TITLE] 提示：[PROMPT] 默认值：[DEFAULT] 确定：[CONFIRM] 取消：[CANCEL]',
                        arguments: {
                            TITLE: { type: 'string', defaultValue: '输入' },
                            PROMPT: { type: 'string', defaultValue: '请输入内容：' },
                            DEFAULT: { type: 'string', defaultValue: '' },
                            CONFIRM: { type: 'string', defaultValue: '确定' },
                            CANCEL: { type: 'string', defaultValue: '取消' }
                        }
                    },
                    '---液态玻璃外观型积木（不能嵌套到参数）',
                    {
                        opcode: 'showStyledConfirmPopup',
                        blockType: 'command',
                        text: '显示液态玻璃问答弹窗并等待 标题：[TITLE] 问题：[QUESTION] 是：[YES] 否：[NO]',
                        arguments: {
                            TITLE: { type: 'string', defaultValue: '提问' },
                            QUESTION: { type: 'string', defaultValue: '你确定吗？' },
                            YES: { type: 'string', defaultValue: '是' },
                            NO: { type: 'string', defaultValue: '否' }
                        }
                    },
                    {
                        opcode: 'showStyledInputPopup',
                        blockType: 'command',
                        text: '显示液态玻璃输入弹窗并等待 标题：[TITLE] 提示：[PROMPT] 默认值：[DEFAULT] 确定：[CONFIRM] 取消：[CANCEL]',
                        arguments: {
                            TITLE: { type: 'string', defaultValue: '输入' },
                            PROMPT: { type: 'string', defaultValue: '请输入内容：' },
                            DEFAULT: { type: 'string', defaultValue: '' },
                            CONFIRM: { type: 'string', defaultValue: '确定' },
                            CANCEL: { type: 'string', defaultValue: '取消' }
                        }
                    },
                    {
                        opcode: 'setPopupStyle',
                        blockType: 'command',
                        text: '设置弹窗样式 透明度：[OPACITY] 圆角：[RADIUS]px 模糊度：[BLUR]px 动画时长：[DURATION]ms',
                        arguments: {
                            OPACITY: { type: 'number', defaultValue: 0.8 },
                            RADIUS: { type: 'number', defaultValue: 20 },
                            BLUR: { type: 'number', defaultValue: 20 },
                            DURATION: { type: 'number', defaultValue: 300 }
                        }
                    },
                    {
                        opcode: 'closePopup',
                        blockType: 'command',
                        text: '关闭当前弹窗'
                    },
                    {
                        opcode: 'getPopupResult',
                        blockType: 'reporter',
                        text: '获取最后一次弹窗结果'
                    },

                    // ===== 窗口管理 =====
                    '---',
                    {
                        opcode: 'createWin',
                        blockType: 'command',
                        text: '创建窗口 名称[name] 网址[url]',
                        arguments: {
                            name: { type: 'string', defaultValue: "窗口1" },
                            url: { type: 'string', defaultValue: "https://hidream.netlify.app" }
                        }
                    },
                    {
                        opcode: 'moveWinTo',
                        blockType: 'command',
                        text: '窗口[name]移动至 [pos]',
                        arguments: {
                            name: { type: 'string', defaultValue: "窗口1" },
                            pos: { type: 'string', menu: 'windowPosMenu' }
                        }
                    },
                    {
                        opcode: 'closeWin',
                        blockType: 'command',
                        text: '关闭窗口[name]',
                        arguments: { name: { type: 'string', defaultValue: "窗口1" } }
                    },
                    {
                        opcode: 'refreshPage',
                        blockType: 'command',
                        text: '刷新窗口[name]',
                        arguments: { name: { type: 'string', defaultValue: "窗口1" } }
                    },
                    {
                        opcode: 'goUrl',
                        blockType: 'command',
                        text: '窗口[name]跳转网址[url]',
                        arguments: {
                            name: { type: 'string', defaultValue: "窗口1" },
                            url: { type: 'string', defaultValue: "" }
                        }
                    },
                    {
                        opcode: 'getCurrentUrl',
                        blockType: 'reporter',
                        text: '窗口[name]当前网址',
                        arguments: { name: { type: 'string', defaultValue: "窗口1" } }
                    },
                    {
                        opcode: 'setWinBg',
                        blockType: 'command',
                        text: '设置窗口[name]背景色[color] 模糊[blur]',
                        arguments: {
                            name: { type: 'string', defaultValue: "窗口1" },
                            color: { type: 'string', defaultValue: "#121212" },
                            blur: { type: 'number', defaultValue: 18 }
                        }
                    },

                    // ===== 网页嵌入 =====
                    '---',
                    {
                        opcode: 'iframeDisplay',
                        blockType: 'command',
                        text: '显示网页 [URL]',
                        arguments: {
                            URL: { type: 'string', defaultValue: "https://extensions.turbowarp.org/hello.html" }
                        }
                    },
                    {
                        opcode: 'iframeDisplayHTML',
                        blockType: 'command',
                        text: '显示HTML [HTML]',
                        arguments: {
                            HTML: { type: 'string', defaultValue: "<h1>能用！</h1>" }
                        }
                    },
                    '---',
                    {
                        opcode: 'iframeShow',
                        blockType: 'command',
                        text: '显示iframe'
                    },
                    {
                        opcode: 'iframeHide',
                        blockType: 'command',
                        text: '隐藏iframe'
                    },
                    {
                        opcode: 'iframeClose',
                        blockType: 'command',
                        text: '关闭iframe'
                    },
                    '---',
                    {
                        opcode: 'iframeGet',
                        blockType: 'reporter',
                        text: 'iframe的[MENU]',
                        arguments: {
                            MENU: { type: 'string', menu: 'iframeMenu' }
                        }
                    },
                    {
                        opcode: 'iframeSetX',
                        blockType: 'command',
                        text: '设置iframe x位置为[X]',
                        arguments: {
                            X: { type: 'number', defaultValue: 0 }
                        }
                    },
                    {
                        opcode: 'iframeSetY',
                        blockType: 'command',
                        text: '设置iframe y位置为[Y]',
                        arguments: {
                            Y: { type: 'number', defaultValue: 0 }
                        }
                    },
                    {
                        opcode: 'iframeSetWidth',
                        blockType: 'command',
                        text: '设置iframe宽度为[WIDTH]',
                        arguments: {
                            WIDTH: { type: 'number', defaultValue: 480 }
                        }
                    },
                    {
                        opcode: 'iframeSetHeight',
                        blockType: 'command',
                        text: '设置iframe高度为[HEIGHT]',
                        arguments: {
                            HEIGHT: { type: 'number', defaultValue: 360 }
                        }
                    },
                    {
                        opcode: 'iframeSetInteractive',
                        blockType: 'command',
                        text: '设置iframe交互性为[INTERACTIVE]',
                        arguments: {
                            INTERACTIVE: { type: 'string', menu: 'boolMenu' }
                        }
                    },
                    {
                        opcode: 'iframeSetResize',
                        blockType: 'command',
                        text: '设置iframe缩放行为为[RESIZE]',
                        arguments: {
                            RESIZE: { type: 'string', menu: 'resizeMenu' }
                        }
                    },
                    '---',
                    {
                        opcode: 'iframeSendMessage',
                        blockType: 'command',
                        text: '向iframe发送消息[MESSAGE]',
                        arguments: {
                            MESSAGE: { type: 'string', defaultValue: "hello" }
                        }
                    },
                    {
                        opcode: 'iframeWhenMessage',
                        blockType: 'hat',
                        text: '当从iframe收到消息时'
                    },
                    {
                        opcode: 'iframeGetMessage',
                        blockType: 'reporter',
                        text: 'iframe消息'
                    },

                    // ===== 文档编辑 =====
                    '---',
                    {
                        opcode: 'docOpenMainWindow',
                        blockType: 'command',
                        text: '打开文档编辑窗口'
                    },
                    {
                        opcode: 'docOpenTxtViewer',
                        blockType: 'command',
                        text: '打开TXT同步查看窗口'
                    },
                    {
                        opcode: 'docOpenFilePicker',
                        blockType: 'command',
                        text: '打开文件管理器并导入编辑'
                    },
                    '---',
                    {
                        opcode: 'docSetGlassEffect',
                        blockType: 'command',
                        text: '设置毛玻璃 透明度[o] 模糊强度[b]',
                        arguments: {
                            o: { type: 'number', defaultValue: 0.85 },
                            b: { type: 'number', defaultValue: 12 }
                        }
                    },
                    '---',
                    {
                        opcode: 'docCloseAllWindow',
                        blockType: 'command',
                        text: '关闭所有文档窗口'
                    },
                    {
                        opcode: 'docSetTitle',
                        blockType: 'command',
                        text: '设置文档标题为 [title]',
                        arguments: { title: { type: 'string', defaultValue: '我的文档' } }
                    },
                    {
                        opcode: 'docGetAllText',
                        blockType: 'reporter',
                        text: '获取全部文档内容'
                    },
                    {
                        opcode: 'docSetAllText',
                        blockType: 'command',
                        text: '设置文档内容为 [txt]',
                        arguments: { txt: { type: 'string', defaultValue: '' } }
                    },
                    {
                        opcode: 'docExportNow',
                        blockType: 'command',
                        text: '立刻导出为DOCX文件'
                    },

                    // ===== 事件 =====
                    '---',
                    {
                        opcode: 'whenMinBtnClick',
                        blockType: 'hat',
                        text: '当点击绿色缩小按钮'
                    }
                ],
                menus: {
                    filePropertyMenu: {
                        acceptReporters: true,
                        items: [
                            { text: '文件名称', value: 'name' },
                            { text: '文件大小', value: 'size' },
                            { text: 'DataURL', value: 'dataurl' },
                            { text: '文件类型', value: 'type' },
                            { text: '最后修改日期', value: 'lastModified' },
                            { text: '创建日期', value: 'created' },
                            { text: '时长(媒体文件)', value: 'duration' },
                            { text: '分辨率(图片/视频)', value: 'dimensions' },
                            { text: '作者(PPT/PPTX)', value: 'author' },
                            { text: '幻灯片页数(PPT/PPTX)', value: 'slideCount' }
                        ]
                    },
                    fileContentMenu: {
                        acceptReporters: true,
                        items: [
                            { text: '文本', value: 'text' },
                            { text: 'DataURL', value: 'dataurl' }
                        ]
                    },
                    onOffMenu: {
                        acceptReporters: true,
                        items: [
                            { text: '开启', value: '1' },
                            { text: '关闭', value: '0' }
                        ]
                    },
                    windowPosMenu: {
                        acceptReporters: true,
                        items: ["中央", "左上", "右上", "顶部", "底部"]
                    },
                    iframeMenu: {
                        acceptReporters: true,
                        items: ["url", "visible", "x", "y", "width", "height", "interactive", "resize behavior"]
                    },
                    boolMenu: {
                        acceptReporters: true,
                        items: ["true", "false"]
                    },
                    resizeMenu: {
                        acceptReporters: true,
                        items: [
                            { text: 'scale', value: 'scale' },
                            { text: 'viewport', value: 'viewport' }
                        ]
                    }
                }
            };
        }

        // ===== 文件方法 =====
        openSingleFile(args) { return this.fileTools.openSingleFile(args.FILETYPE); }
        openMultipleFiles(args) { return this.fileTools.openMultipleFiles(args.FILETYPE); }
        getFileProperty(args) { return this.fileTools.getFileProperty(args.INDEX, args.PROPERTY); }
        getFileContent(args) { return this.fileTools.getFileContent(args.INDEX, args.TYPE); }
        getFileCount() { return this.fileTools.getFileCount(); }
        downloadText(args) { this.fileTools.downloadText(args.CONTENT, args.NAME); }
        downloadDataURL(args) { this.fileTools.downloadDataURL(args.URL, args.NAME); }

        // ===== 位图高斯模糊方法 =====
        applyBlur(args) { return this.gaussianTools.applyBlur(args.IMAGE, args.RADIUS, args.ANTIEDGE); }
        resizeImage(args) { return this.gaussianTools.resizeImage(args.IMAGE, args.WIDTH, args.HEIGHT); }
        getCostumeURL() { return this.gaussianTools.getCostumeURL(); }

        // ===== 造型模糊方法 =====
        setBlur(args, util) { this.costumeTools.setBlur(args, util); }
        getBlur(args, util) { return this.costumeTools.getBlur(args, util); }
        changeBlur(args, util) { this.costumeTools.changeBlur(args, util); }
        returnOriginal(args, util) { this.costumeTools.returnOriginal(args, util); }
        clearCache() { this.costumeTools.clearCache(); }

        // ===== 弹窗方法 =====
        showAlertPopup(args, util) { return this.popupTools.showAlertPopup(args, util); }
        showConfirmPopup(args) { return this.popupTools.showNativeConfirm(args.TITLE, args.QUESTION); }
        showInputPopup(args) { return this.popupTools.showNativePrompt(args.TITLE, args.PROMPT, args.DEFAULT); }
        showStyledConfirmPopup(args, util) { return this.popupTools.showStyledConfirmPopup(args, util); }
        showStyledInputPopup(args, util) { return this.popupTools.showStyledInputPopup(args, util); }
        setPopupStyle(args) { this.popupTools.setPopupStyle(args.OPACITY, args.RADIUS, args.BLUR, args.DURATION); }
        closePopup() { this.popupTools.closePopup(); }
        getPopupResult() { return this.popupTools.getPopupResult(); }

        // ===== 窗口方法 =====
        createWin(args) { this.windowTools.createWindow(args.name, args.url); }
        moveWinTo(args) { this.windowTools.moveWindow(args.name, args.pos); }
        closeWin(args) { this.windowTools.closeWindow(args.name); }
        refreshPage(args) { this.windowTools.refreshWindow(args.name); }
        goUrl(args) { this.windowTools.goToUrl(args.name, args.url); }
        getCurrentUrl(args) { return this.windowTools.getCurrentUrl(args.name); }
        setWinBg(args) { this.windowTools.setWindowBg(args.name, args.color, args.blur); }

        // ===== Iframe方法 =====
        iframeDisplay(args) { this.iframeTools.display(args.URL); }
        iframeDisplayHTML(args) { this.iframeTools.displayHTML(args.HTML); }
        iframeShow() { this.iframeTools.showIframe(); }
        iframeHide() { this.iframeTools.hideIframe(); }
        iframeClose() { this.iframeTools.closeIframe(); }
        iframeGet(args) { return this.iframeTools.getIframe(args.MENU); }
        iframeSetX(args) { this.iframeTools.setIframeX(args.X); }
        iframeSetY(args) { this.iframeTools.setIframeY(args.Y); }
        iframeSetWidth(args) { this.iframeTools.setIframeWidth(args.WIDTH); }
        iframeSetHeight(args) { this.iframeTools.setIframeHeight(args.HEIGHT); }
        iframeSetInteractive(args) { this.iframeTools.setIframeInteractive(args.INTERACTIVE); }
        iframeSetResize(args) { this.iframeTools.setIframeResize(args.RESIZE); }
        iframeSendMessage(args) { this.iframeTools.sendIframeMessage(args.MESSAGE); }
        iframeWhenMessage() {}
        iframeGetMessage() { return this.iframeTools.getIframeMessage(); }

        // ===== 文档方法 =====
        docOpenMainWindow() { this.documentTools.openMainWindow(); }
        docOpenTxtViewer() { this.documentTools.openTxtViewer(); }
        docOpenFilePicker() { this.documentTools.openFilePicker(); }
        docSetGlassEffect(args) { this.documentTools.setGlassEffect(args.o, args.b); }
        docCloseAllWindow() { this.documentTools.closeAllWindows(); }
        docSetTitle(args) { this.documentTools.setDocTitle(args.title); }
        docGetAllText() { return this.documentTools.getAllText(); }
        docSetAllText(args) { this.documentTools.setAllText(args.txt); }
        docExportNow() { this.documentTools.exportDocNow(); }

        // ===== 事件 =====
        whenMinBtnClick() {}
    }

    Scratch.extensions.register(new UIToolbox());
})(Scratch);