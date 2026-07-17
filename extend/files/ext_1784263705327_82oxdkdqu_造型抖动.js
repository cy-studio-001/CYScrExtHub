(function (Scratch) {
    "use strict";

    const vm = Scratch.vm.runtime.extensionManager.vm;
    const runtime = vm.runtime;
    const Cast = Scratch.Cast;

    class SvgJitterFinal {
        constructor() {
            this.players = new Map();
            this.undoStack = new Map();

            const clearAll = () => {
                for (const [targetId, player] of this.players) {
                    if (player.intervalId) clearInterval(player.intervalId);
                    const target = runtime.getTargetById(targetId);
                    if (target) {
                        try { target.setCostume(player.origIdx); } catch (e) {}
                    }
                }
                this.players.clear();
            };
            runtime.on("PROJECT_STOP_ALL", clearAll);
            runtime.on("PROJECT_PAUSE", clearAll);
        }

        getInfo() {
            return {
                id: "svgJitterFolder",
                color1: "#4CAF50",
                name: "SVG抖动 + 文件夹管理",
                blocks: [
                    // === 生成抖动组 ===
                    {
                        opcode: "createGroupFromCostume",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "从造型 [NAME] 创建或替换文件夹 [FOLDER]为抖动组，幅度：[AMP] 帧数：[COUNT]",
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.COSTUME },
                            AMP: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5 },
                            COUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            FOLDER: { type: Scratch.ArgumentType.STRING, defaultValue: "抖动" }
                        }
                    },
                    {
                        opcode: "appendFrames",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "从造型 [NAME] 向文件夹 [FOLDER] 追加抖动帧，幅度：[AMP] 帧数：[COUNT]",
                        arguments: {
                            AMP: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5 },
                            COUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 },
                            FOLDER: { type: Scratch.ArgumentType.STRING, menu: "folders", defaultValue: "" },
                            NAME: { type: Scratch.ArgumentType.COSTUME }
                        }
                    },
                    "---",
                    // === 拐角样式设置 ===
                    {
                        opcode: "setJoinStyleCurrent",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "修改 当前造型 描边拐点为 [JOIN]",
                        arguments: {
                            JOIN: { type: Scratch.ArgumentType.STRING, menu: "joinStyles", defaultValue: "round" }
                        }
                    },
                    {
                        opcode: "setJoinStyleFolder",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "统一修改文件夹 [FOLDER]内造型描边拐点为 [JOIN]",
                        arguments: {
                            JOIN: { type: Scratch.ArgumentType.STRING, menu: "joinStyles", defaultValue: "round" },
                            FOLDER: { type: Scratch.ArgumentType.STRING, menu: "folders", defaultValue: "" }
                        }
                    },
                    "---",
                    // === 📁 文件夹快捷管理 ===
                    {
                        blockType: "label",
                        text: "📁 文件夹快捷管理"
                    },
                    {
                        opcode: "playLoop",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "播放文件夹 [FOLDER]，速度 [SPD]张/秒",
                        arguments: {
                            FOLDER: { type: Scratch.ArgumentType.STRING, menu: "folders", defaultValue: "" },
                            SPD: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
                        }
                    },
                    {
                        opcode: "playForDuration",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "播放 [DUR] 秒文件夹[FOLDER]，速度 [SPD]张/秒",
                        arguments: {
                            FOLDER: { type: Scratch.ArgumentType.STRING, menu: "folders", defaultValue: "" },
                            SPD: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
                            DUR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
                        }
                    },
                    {
                        opcode: "stopPlayer",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "停止遍历播放"
                    },
                    {
                        opcode: "getCurrentFolder",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "当前文件夹 名称",
                        disableMonitor: true
                    },
                    {
                        opcode: "getFrameNumber",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "在当前文件夹内的 编号",
                        disableMonitor: true
                    },
                    {
                        opcode: "nextFrame",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "下一帧 文件夹：[FOLDER]",
                        arguments: { FOLDER: { type: Scratch.ArgumentType.STRING, menu: "folders", defaultValue: "" } }
                    },
                    {
                        opcode: "prevFrame",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "上一帧 文件夹：[FOLDER]",
                        arguments: { FOLDER: { type: Scratch.ArgumentType.STRING, menu: "folders", defaultValue: "" } }
                    },
                    {
                        opcode: "gotoFrame",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "跳转到第 [N]帧，文件夹：[FOLDER]",
                        arguments: {
                            N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            FOLDER: { type: Scratch.ArgumentType.STRING, menu: "folders", defaultValue: "" }
                        }
                    },
                    // === 文件夹加工 ===
                    {
                        opcode: "mergeFolders",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "合并文件夹 [FOLDER1] [FOLDER2] 为文件夹[FOLDER3]， 模式： [MODE]",
                        arguments: {
                            FOLDER1: { type: Scratch.ArgumentType.STRING, menu: "folders", defaultValue: "" },
                            FOLDER2: { type: Scratch.ArgumentType.STRING, menu: "folders", defaultValue: "" },
                            FOLDER3: { type: Scratch.ArgumentType.STRING, defaultValue: "合并文件夹" },
                            MODE: { type: Scratch.ArgumentType.STRING, menu: "mergeModes", defaultValue: "相接" }
                        }
                    },
                    {
                        opcode: "reverseFolder",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "倒序文件夹 [FOLDER]",
                        arguments: { FOLDER: { type: Scratch.ArgumentType.STRING, menu: "folders", defaultValue: "" } }
                    },
                    {
                        opcode: "deleteGroup",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "删除文件夹 [FOLDER]",
                        arguments: { FOLDER: { type: Scratch.ArgumentType.STRING, menu: "folders", defaultValue: "" } }
                    },
                    {
                        opcode: "undoDelete",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "撤销删除文件夹"
                    }
                ],
                menus: {
                    folders: { acceptReporters: true, items: "_getFolders" },
                    mergeModes: { acceptReporters: true, items: ["相接", "交错"] },
                    joinStyles: { acceptReporters: true, items: [
                        { text: "圆角", value: "round" },
                        { text: "斜角", value: "miter" },
                        { text: "平角", value: "bevel" }
                    ]}
                }
            };
        }

        _getFolders() {
            const target = vm.editingTarget;
            if (!target || !target.sprite) return [{ text: "无", value: "" }];
            const folders = new Set();
            for (const costume of target.sprite.costumes) {
                const idx = costume.name.lastIndexOf("//");
                if (idx > 0) folders.add(costume.name.substring(0, idx));
            }
            if (folders.size === 0) return [{ text: "无", value: "" }];
            return Array.from(folders).map(f => ({ text: f, value: f }));
        }

        // ========== 工具函数 ==========
        getSvg(target, index) {
            const costume = target.sprite.costumes[index];
            if (!costume || costume.asset.dataFormat !== runtime.storage.DataFormat.SVG) return null;
            try {
                const uri = costume.asset.encodeDataURI();
                return atob(uri.split(",")[1]);
            } catch (e) { return null; }
        }

        isSvg(target) {
            const idx = target.currentCostume;
            const costume = target.sprite.costumes[idx];
            return costume && costume.asset.dataFormat === runtime.storage.DataFormat.SVG;
        }

        // 扩大 viewBox 并同步更新 width/height，保持中心点不变，彻底消除裁剪
        expandViewBox(svgRoot, amp) {
            let viewBox = svgRoot.getAttribute("viewBox");
            let x, y, w, h;
            if (viewBox) {
                const parts = viewBox.split(/[\s,]+/).map(Number);
                x = parts[0] || 0;
                y = parts[1] || 0;
                w = parts[2] || 0;
                h = parts[3] || 0;
            } else {
                w = parseFloat(svgRoot.getAttribute("width") || "0");
                h = parseFloat(svgRoot.getAttribute("height") || "0");
                if (isNaN(w) || isNaN(h)) return;
                x = 0; y = 0;
            }
            // 扩大边界
            const newW = w + 2 * amp;
            const newH = h + 2 * amp;
            const newX = x - amp;
            const newY = y - amp;

            svgRoot.setAttribute("viewBox", `${newX} ${newY} ${newW} ${newH}`);
            svgRoot.setAttribute("width", newW);
            svgRoot.setAttribute("height", newH);
            svgRoot.setAttribute("overflow", "visible");
        }

        generateFrame(originalSvg, amp) {
            if (typeof DOMParser === "undefined") return originalSvg;
            const parser = new DOMParser();
            const doc = parser.parseFromString(originalSvg, "image/svg+xml");
            const svgRoot = doc.documentElement;
            if (!svgRoot || svgRoot.tagName !== "svg") return originalSvg;

            this.expandViewBox(svgRoot, amp);

            const elements = svgRoot.querySelectorAll("path, polygon, line, polyline, rect, circle, ellipse");
            elements.forEach(el => {
                const tag = el.tagName;
                const dx = (Math.random() * 2 - 1) * amp;
                const dy = (Math.random() * 2 - 1) * amp;

                if (tag === "path" && el.hasAttribute("d")) {
                    let d = el.getAttribute("d");
                    d = d.replace(/-?\d+\.?\d*/g, m => {
                        const num = parseFloat(m);
                        return (num + (Math.random() * 2 - 1) * amp).toFixed(3);
                    });
                    el.setAttribute("d", d);
                } else if (tag === "line") {
                    if (el.hasAttribute("x1")) el.setAttribute("x1", parseFloat(el.getAttribute("x1")) + dx);
                    if (el.hasAttribute("y1")) el.setAttribute("y1", parseFloat(el.getAttribute("y1")) + dy);
                    if (el.hasAttribute("x2")) el.setAttribute("x2", parseFloat(el.getAttribute("x2")) + dx);
                    if (el.hasAttribute("y2")) el.setAttribute("y2", parseFloat(el.getAttribute("y2")) + dy);
                } else if (tag === "polygon" || tag === "polyline") {
                    if (el.hasAttribute("points")) {
                        let pts = el.getAttribute("points"), i = 0;
                        pts = pts.replace(/-?\d+\.?\d*/g, m => {
                            const off = (i % 2 === 0) ? dx : dy;
                            i++;
                            return (parseFloat(m) + off).toFixed(3);
                        });
                        el.setAttribute("points", pts);
                    }
                } else if (tag === "rect") {
                    if (el.hasAttribute("x")) el.setAttribute("x", parseFloat(el.getAttribute("x")) + dx);
                    if (el.hasAttribute("y")) el.setAttribute("y", parseFloat(el.getAttribute("y")) + dy);
                } else if (tag === "circle" || tag === "ellipse") {
                    if (el.hasAttribute("cx")) el.setAttribute("cx", parseFloat(el.getAttribute("cx")) + dx);
                    if (el.hasAttribute("cy")) el.setAttribute("cy", parseFloat(el.getAttribute("cy")) + dy);
                }
            });

            return new XMLSerializer().serializeToString(doc);
        }

        applyStrokeLinejoin(svgString, joinStyle) {
            if (typeof DOMParser === "undefined") return svgString;
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgString, "image/svg+xml");
            const shapes = doc.querySelectorAll("path, polygon, polyline, line, rect, circle, ellipse");
            shapes.forEach(shape => shape.setAttribute("stroke-linejoin", joinStyle));
            return new XMLSerializer().serializeToString(doc);
        }

        async replaceCostumeWithSvg(target, svgString, costumeName) {
            const oldIdx = target.getCostumeIndexByName(costumeName);
            if (oldIdx >= 0) target.deleteCostume(oldIdx);
            const encoder = new TextEncoder();
            const asset = runtime.storage.createAsset(
                runtime.storage.AssetType.ImageVector,
                runtime.storage.DataFormat.SVG,
                new Uint8Array(encoder.encode(svgString).buffer),
                null,
                true
            );
            const md5ext = `${asset.assetId}.${asset.dataFormat}`;
            await vm.addCostume(md5ext, { asset, md5ext, name: costumeName }, target.id);
            const newIdx = target.getCostumeIndexByName(costumeName);
            if (newIdx >= 0) target.setCostume(newIdx);
        }

        async addCostumeToFolder(target, folder, index, svg) {
            const name = `${folder}//${index}`;
            const encoder = new TextEncoder();
            const asset = runtime.storage.createAsset(
                runtime.storage.AssetType.ImageVector,
                runtime.storage.DataFormat.SVG,
                new Uint8Array(encoder.encode(svg).buffer),
                null,
                true
            );
            const md5ext = `${asset.assetId}.${asset.dataFormat}`;
            await vm.addCostume(md5ext, { asset, md5ext, name }, target.id);
        }

        getFolderIndices(target, folder) {
            const prefix = `${folder}//`;
            const indices = [];
            target.sprite.costumes.forEach((c, i) => {
                if (c.name.startsWith(prefix)) indices.push(i);
            });
            return indices.sort((a, b) => {
                const aNum = parseInt(target.sprite.costumes[a].name.split("//")[1]) || 0;
                const bNum = parseInt(target.sprite.costumes[b].name.split("//")[1]) || 0;
                return aNum - bNum;
            });
        }

        deleteFolder(target, folder) {
            const prefix = `${folder}//`;
            const costumes = target.sprite.costumes;
            for (let i = costumes.length - 1; i >= 0; i--) {
                if (costumes[i].name.startsWith(prefix)) target.deleteCostume(i);
            }
        }

        stopPlayerForTarget(target) {
            const player = this.players.get(target.id);
            if (!player) return false;
            if (player.intervalId) clearInterval(player.intervalId);
            target.setCostume(player.origIdx);
            this.players.delete(target.id);
            return true;
        }

        async snapshotFolder(target, folder) {
            const prefix = `${folder}//`;
            const snapshot = [];
            for (const costume of target.sprite.costumes) {
                if (costume.name.startsWith(prefix)) {
                    const idx = target.sprite.costumes.indexOf(costume);
                    const svg = this.getSvg(target, idx);
                    if (svg) snapshot.push({ name: costume.name, svg, isCurrent: idx === target.currentCostume });
                }
            }
            return snapshot;
        }

        // ========== 积木实现 ==========
        async createGroupFromCostume(args, util) {
            const target = util.target;
            const costumeName = Cast.toString(args.NAME);
            const srcIdx = target.getCostumeIndexByName(costumeName);
            if (srcIdx < 0) return `造型“${costumeName}”不存在`;
            const originalSvg = this.getSvg(target, srcIdx);
            if (!originalSvg) return "源造型不是矢量图或无法读取";

            const amp = Math.max(0, Number(args.AMP));
            const count = Math.max(1, Math.min(Number(args.COUNT) || 5, 200));
            const folder = Cast.toString(args.FOLDER) || "抖动";

            this.deleteFolder(target, folder);

            for (let i = 1; i <= count; i++) {
                const svg = this.generateFrame(originalSvg, amp);
                await this.addCostumeToFolder(target, folder, i, svg);
            }

            const firstIdx = target.getCostumeIndexByName(`${folder}//1`);
            if (firstIdx >= 0) target.setCostume(firstIdx);
        }

        async appendFrames(args, util) {
            const target = util.target;
            const folder = Cast.toString(args.FOLDER);
            const costumeName = Cast.toString(args.NAME);
            if (!folder) return "请选择一个文件夹";
            if (!costumeName) return "请指定源造型";

            const srcIdx = target.getCostumeIndexByName(costumeName);
            if (srcIdx < 0) return `造型“${costumeName}”不存在`;
            const originalSvg = this.getSvg(target, srcIdx);
            if (!originalSvg) return "源造型不是矢量图或无法读取";

            const amp = Math.max(0, Number(args.AMP));
            const count = Math.max(1, Math.min(Number(args.COUNT) || 2, 200));
            const indices = this.getFolderIndices(target, folder);
            const startNum = indices.length > 0 ? indices.length + 1 : 1;

            for (let i = 0; i < count; i++) {
                const svg = this.generateFrame(originalSvg, amp);
                await this.addCostumeToFolder(target, folder, startNum + i, svg);
            }

            const newFirstIdx = target.getCostumeIndexByName(`${folder}//${startNum}`);
            if (newFirstIdx >= 0) target.setCostume(newFirstIdx);
        }

        async setJoinStyleCurrent(args, util) {
            const target = util.target;
            if (!this.isSvg(target)) return "当前造型不是矢量图";
            const currentIdx = target.currentCostume;
            const costumeName = target.sprite.costumes[currentIdx].name;
            const originalSvg = this.getSvg(target, currentIdx);
            if (!originalSvg) return "无法读取当前造型";
            const joinStyle = Cast.toString(args.JOIN) || "round";
            const styledSvg = this.applyStrokeLinejoin(originalSvg, joinStyle);
            await this.replaceCostumeWithSvg(target, styledSvg, costumeName);
        }

        async setJoinStyleFolder(args, util) {
            const target = util.target;
            const folder = Cast.toString(args.FOLDER);
            const joinStyle = Cast.toString(args.JOIN) || "round";
            if (!folder) return "请选择一个文件夹";
            const indices = this.getFolderIndices(target, folder);
            if (indices.length === 0) return `文件夹“${folder}”不存在或为空`;

            for (const idx of indices) {
                const costumeName = target.sprite.costumes[idx].name;
                const svg = this.getSvg(target, idx);
                if (!svg) continue;
                const styledSvg = this.applyStrokeLinejoin(svg, joinStyle);
                await this.replaceCostumeWithSvg(target, styledSvg, costumeName);
            }
        }

        async mergeFolders(args, util) {
            const target = util.target;
            const folder1 = Cast.toString(args.FOLDER1);
            const folder2 = Cast.toString(args.FOLDER2);
            const folder3 = Cast.toString(args.FOLDER3) || "合并文件夹";
            const mode = Cast.toString(args.MODE) || "相接";
            if (!folder1 || !folder2) return "请选择两个文件夹";

            const indices1 = this.getFolderIndices(target, folder1);
            const indices2 = this.getFolderIndices(target, folder2);
            if (indices1.length === 0) return `文件夹“${folder1}”不存在或为空`;
            if (indices2.length === 0) return `文件夹“${folder2}”不存在或为空`;

            const frames1 = indices1.map(idx => this.getSvg(target, idx)).filter(Boolean);
            const frames2 = indices2.map(idx => this.getSvg(target, idx)).filter(Boolean);

            let combined = [];
            if (mode === "相接") {
                combined = frames1.concat(frames2);
            } else {
                const maxLen = Math.max(frames1.length, frames2.length);
                for (let i = 0; i < maxLen; i++) {
                    if (i < frames1.length) combined.push(frames1[i]);
                    if (i < frames2.length) combined.push(frames2[i]);
                }
            }

            if (combined.length === 0) return "没有可合并的帧";
            this.deleteFolder(target, folder3);

            for (let i = 0; i < combined.length; i++) {
                await this.addCostumeToFolder(target, folder3, i + 1, combined[i]);
            }

            const firstIdx = target.getCostumeIndexByName(`${folder3}//1`);
            if (firstIdx >= 0) target.setCostume(firstIdx);
        }

        async reverseFolder(args, util) {
            const target = util.target;
            const folder = Cast.toString(args.FOLDER);
            if (!folder) return "请选择一个文件夹";

            const indices = this.getFolderIndices(target, folder);
            if (indices.length === 0) return `文件夹“${folder}”不存在或为空`;

            const frames = indices.map(idx => this.getSvg(target, idx)).filter(Boolean);
            if (frames.length === 0) return "无法读取文件夹内帧";

            this.deleteFolder(target, folder);

            const reversed = frames.reverse();
            for (let i = 0; i < reversed.length; i++) {
                await this.addCostumeToFolder(target, folder, i + 1, reversed[i]);
            }

            const firstIdx = target.getCostumeIndexByName(`${folder}//1`);
            if (firstIdx >= 0) target.setCostume(firstIdx);
        }

        getCurrentFolder(args, util) {
            const target = util.target;
            const name = target.sprite.costumes[target.currentCostume].name;
            const idx = name.lastIndexOf("//");
            return idx > 0 ? name.substring(0, idx) : "";
        }

        getFrameNumber(args, util) {
            const target = util.target;
            const name = target.sprite.costumes[target.currentCostume].name;
            const idx = name.lastIndexOf("//");
            if (idx <= 0) return 0;
            const numStr = name.substring(idx + 2);
            const num = parseInt(numStr);
            return isNaN(num) ? 0 : num;
        }

        nextFrame(args, util) {
            const target = util.target;
            const folder = Cast.toString(args.FOLDER);
            if (!folder) return "请选择一个文件夹";
            const indices = this.getFolderIndices(target, folder);
            if (indices.length === 0) return `文件夹“${folder}”不存在或为空`;

            const curName = target.sprite.costumes[target.currentCostume].name;
            const curNum = curName.startsWith(`${folder}//`) ? parseInt(curName.split("//")[1]) || 0 : 0;
            const nextNum = (curNum % indices.length) + 1;
            const idx = target.getCostumeIndexByName(`${folder}//${nextNum}`);
            if (idx >= 0) target.setCostume(idx);
        }

        prevFrame(args, util) {
            const target = util.target;
            const folder = Cast.toString(args.FOLDER);
            if (!folder) return "请选择一个文件夹";
            const indices = this.getFolderIndices(target, folder);
            if (indices.length === 0) return `文件夹“${folder}”不存在或为空`;

            const curName = target.sprite.costumes[target.currentCostume].name;
            const curNum = curName.startsWith(`${folder}//`) ? parseInt(curName.split("//")[1]) || 0 : 0;
            const prevNum = curNum <= 1 ? indices.length : curNum - 1;
            const idx = target.getCostumeIndexByName(`${folder}//${prevNum}`);
            if (idx >= 0) target.setCostume(idx);
        }

        gotoFrame(args, util) {
            const target = util.target;
            const folder = Cast.toString(args.FOLDER);
            if (!folder) return "请选择一个文件夹";
            const num = Math.round(Number(args.N));
            const idx = target.getCostumeIndexByName(`${folder}//${num}`);
            if (idx >= 0) target.setCostume(idx);
            else return `帧${num}不存在`;
        }

        playLoop(args, util) {
            const target = util.target;
            const folder = Cast.toString(args.FOLDER);
            if (!folder) return "请选择一个文件夹";
            const spd = Math.max(1, Number(args.SPD));
            this.stopPlayerForTarget(target);

            const indices = this.getFolderIndices(target, folder);
            if (indices.length === 0) return `文件夹“${folder}”不存在或为空`;

            const origIdx = target.currentCostume;
            target.setCostume(indices[0]);
            let frame = 0;

            const interval = 1000 / spd;
            const intervalId = setInterval(() => {
                frame = (frame + 1) % indices.length;
                target.setCostume(indices[frame]);
            }, interval);

            this.players.set(target.id, { intervalId, origIdx, folder });
        }

        async playForDuration(args, util) {
            const target = util.target;
            const folder = Cast.toString(args.FOLDER);
            if (!folder) return "请选择一个文件夹";
            const spd = Math.max(1, Number(args.SPD));
            const dur = Math.max(0, Number(args.DUR));

            this.playLoop({ FOLDER: folder, SPD: spd }, util);
            await new Promise(resolve => setTimeout(resolve, dur * 1000));
            this.stopPlayerForTarget(target);
        }

        stopPlayer(args, util) {
            const stopped = this.stopPlayerForTarget(util.target);
            if (!stopped) return "当前没有遍历播放";
        }

        async deleteGroup(args, util) {
            const target = util.target;
            const folder = Cast.toString(args.FOLDER);
            if (!folder) return "请选择一个文件夹";
            const indices = this.getFolderIndices(target, folder);
            if (indices.length === 0) return `文件夹“${folder}”不存在或为空`;

            const player = this.players.get(target.id);
            if (player && player.folder === folder) this.stopPlayerForTarget(target);

            const snapshot = await this.snapshotFolder(target, folder);
            this.deleteFolder(target, folder);

            const currentName = target.sprite.costumes[target.currentCostume]?.name || "";
            if (currentName.startsWith(`${folder}//`)) {
                target.setCostume(player?.origIdx || 0);
            }

            if (snapshot.length > 0) this.undoStack.set(target.id, snapshot);
        }

        async undoDelete(args, util) {
            const target = util.target;
            const snapshot = this.undoStack.get(target.id);
            if (!snapshot || snapshot.length === 0) return "没有可撤销的删除操作";

            for (const item of snapshot) {
                const encoder = new TextEncoder();
                const asset = runtime.storage.createAsset(
                    runtime.storage.AssetType.ImageVector,
                    runtime.storage.DataFormat.SVG,
                    new Uint8Array(encoder.encode(item.svg).buffer),
                    null,
                    true
                );
                const md5ext = `${asset.assetId}.${asset.dataFormat}`;
                await vm.addCostume(md5ext, { asset, md5ext, name: item.name }, target.id);
            }

            const currentItem = snapshot.find(item => item.isCurrent);
            if (currentItem) {
                const idx = target.getCostumeIndexByName(currentItem.name);
                if (idx >= 0) target.setCostume(idx);
            }

            this.undoStack.delete(target.id);
        }
    }

    Scratch.extensions.register(new SvgJitterFinal());
})(Scratch);