class Ext {
    getInfo() {
        return {
            id: "hidreaminternet",
            name: "Hidream Internet",
            color1: "#4169E1",
            color2: "#5F9EA0",
            blocks: [
                {
                    opcode: "whenMinBtnClick",
                    blockType: "hat",
                    text: "当点击绿色缩小按钮"
                },
                {
                    opcode: "createWin",
                    blockType: "command",
                    text: "创建窗口 名称[name] 网址[url]",
                    arguments: {
                        name: { type: "string", defaultValue: "窗口1" },
                        url: { type: "string", defaultValue: "https://www.baidu.com" }
                    }
                },
                {
                    opcode: "moveWinTo",
                    blockType: "command",
                    text: "窗口[name]移动至 [pos]",
                    arguments: {
                        name: { type: "string", defaultValue: "窗口1" },
                        pos: { type: "menu", menu: "winPos" }
                    }
                },
                {
                    opcode: "closeWin",
                    blockType: "command",
                    text: "关闭窗口[name]",
                    arguments: { name: { type: "string", defaultValue: "窗口1" } }
                },
                {
                    opcode: "refreshPage",
                    blockType: "command",
                    text: "刷新窗口[name]",
                    arguments: { name: { type: "string", defaultValue: "窗口1" } }
                },
                {
                    opcode: "goUrl",
                    blockType: "command",
                    text: "窗口[name]跳转网址[url]",
                    arguments: {
                        name: { type: "string", defaultValue: "窗口1" },
                        url: { type: "string", defaultValue: "" }
                    }
                },
                {
                    opcode: "getCurrentUrl",
                    blockType: "reporter",
                    text: "窗口[name]当前网址",
                    arguments: { name: { type: "string", defaultValue: "窗口1" } }
                },
                {
                    opcode: "setWinBg",
                    blockType: "command",
                    text: "设置窗口[name]背景色[color] 模糊[blur]",
                    arguments: {
                        name: { type: "string", defaultValue: "窗口1" },
                        color: { type: "color", defaultValue: "#121212" },
                        blur: { type: "number", defaultValue: 18 }
                    }
                }
            ],
            customUI: { footer: "Hidream原创扩展" },
            menus: { winPos: ["中央", "左上", "右上", "顶部", "底部"] }
        };
    }

    constructor() {
        this.winList = {};
        this.drag = null;
        this.resize = null;
        this.bindMouseEvent();
    }

    whenMinBtnClick() {}

    bindMouseEvent() {
        document.addEventListener("mousemove", e => {
            if (this.drag) {
                const { el, ox, oy } = this.drag;
                el.style.left = (e.clientX - ox) + "px";
                el.style.top = (e.clientY - oy) + "px";
            }
            if (this.resize) {
                const { el, w, h, sx, sy } = this.resize;
                let nw = w + (e.clientX - sx);
                let nh = h + (e.clientY - sy);
                if (nw < 280) nw = 280;
                if (nh < 220) nh = 220;
                el.style.width = nw + "px";
                el.style.height = nh + "px";
            }
        });
        document.addEventListener("mouseup", () => {
            this.drag = null;
            this.resize = null;
        });
    }

    moveWinTo({ name, pos }) {
        const win = this.winList[name];
        if (!win) return;
        const b = win.box;
        const ww = b.offsetWidth;
        const wh = b.offsetHeight;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        b.style.transition = "none";
        switch (pos) {
            case "中央":
                b.style.left = (vw - ww) / 2 + "px";
                b.style.top = (vh - wh) / 2 + "px";
                break;
            case "左上":
                b.style.left = "20px";
                b.style.top = "20px";
                break;
            case "右上":
                b.style.left = vw - ww - 20 + "px";
                b.style.top = "20px";
                break;
            case "顶部":
                b.style.left = (vw - ww) / 2 + "px";
                b.style.top = "20px";
                break;
            case "底部":
                b.style.left = (vw - ww) / 2 + "px";
                b.style.top = vh - wh - 20 + "px";
                break;
        }
    }

    createWin({ name, url }) {
        if (this.winList[name]) return;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const winW = 580;
        const winH = 400;

        const winBox = document.createElement("div");
        winBox.style.cssText = `
            position:fixed;
            left:${(vw - winW) / 2}px;
            top:${(vh - winH) / 2}px;
            width:${winW}px;height:${winH}px;
            border-radius:16px;overflow:hidden;z-index:9998;
            background:rgba(18,18,18,0.55);
            backdrop-filter:blur(18px) saturate(110%);
            -webkit-backdrop-filter:blur(18px) saturate(110%);
            border:1px solid rgba(255,255,255,0.12);
            transition: width 0.2s, height 0.2s, left 0.2s, top 0.2s;
        `;

        const titleBar = document.createElement("div");
        titleBar.style.cssText = `
            height:36px;background:rgba(0,0,0,0.25);display:flex;
            align-items:center;padding:0 14px;gap:10px;
            cursor:grab;user-select:none;
        `;

        const btnGroup = document.createElement("div");
        btnGroup.style.display = "flex";
        btnGroup.style.gap = "9px";

        const closeBtn = document.createElement("div");
        closeBtn.style.cssText = "width:13px;height:13px;border-radius:50%;background:#ff5757;cursor:pointer;";
        closeBtn.onclick = () => this.closeWin({ name });

        const zoomMaxBtn = document.createElement("div");
        zoomMaxBtn.style.cssText = "width:13px;height:13px;border-radius:50%;background:#ffc145;cursor:pointer;";
        zoomMaxBtn.onclick = () => {
            const w = this.winList[name];
            if (!w) return;
            w.box.style.transition = "width 0.2s, height 0.2s, left 0.2s, top 0.2s";
            w.box.style.left = "0px";
            w.box.style.top = "0px";
            w.box.style.width = "100vw";
            w.box.style.height = "100vh";
        };

        const zoomMinBtn = document.createElement("div");
        zoomMinBtn.style.cssText = "width:13px;height:13px;border-radius:50%;background:#39d353;cursor:pointer;";
        zoomMinBtn.onclick = () => {
            const w = this.winList[name];
            if (!w) return;
            w.box.style.transition = "width 0.2s, height 0.2s, left 0.2s, top 0.2s";
            this.moveWinTo({ name, pos: "中央" });
            w.box.style.width = "580px";
            w.box.style.height = "400px";
            this.whenMinBtnClick();
        };

        btnGroup.append(closeBtn, zoomMaxBtn, zoomMinBtn);
        const winTitle = document.createElement("span");
        winTitle.style.cssText = "flex:1;text-align:center;color:#e8e8e8;font-size:13px;";
        winTitle.innerText = name;
        titleBar.append(btnGroup, winTitle);

        const toolBar = document.createElement("div");
        toolBar.style.cssText = `
            height:32px;background:rgba(0,0,0,0.2);display:flex;
            align-items:center;padding:0 10px;gap:8px;display:none;
        `;
        const refreshBtn = document.createElement("button");
        refreshBtn.innerText = "刷新";
        refreshBtn.style.cssText = "border:none;border-radius:4px;background:#333;color:#fff;padding:2px 10px;font-size:12px;";
        refreshBtn.onclick = () => this.refreshPage({ name });

        const urlInput = document.createElement("input");
        urlInput.style.cssText = "flex:1;height:22px;border:none;border-radius:4px;background:rgba(255,255,255,0.1);color:#fff;padding:0 6px;outline:none;font-size:12px;";
        urlInput.value = url;

        const goBtn = document.createElement("button");
        goBtn.innerText = "前往";
        goBtn.style.cssText = "border:none;border-radius:4px;background:#333;color:#fff;padding:2px 10px;font-size:12px;";
        goBtn.onclick = () => this.goUrl({ name, url: urlInput.value });
        toolBar.append(refreshBtn, urlInput, goBtn);

        const iframeDom = document.createElement("iframe");
        iframeDom.style.border = "none";
        iframeDom.style.width = "100%";
        const setIframeH = () => {
            iframeDom.style.height = toolBar.style.display === "flex" ? "calc(100% - 68px)" : "calc(100% - 36px)";
        };
        setIframeH();
        iframeDom.src = url;

        const resizeHandle = document.createElement("div");
        resizeHandle.style.cssText = "position:absolute;right:0;bottom:0;width:22px;height:22px;cursor:nwse-resize;";

        winBox.append(titleBar, toolBar, iframeDom, resizeHandle);
        document.body.appendChild(winBox);
        this.winList[name] = { box: winBox, iframe: iframeDom, bar: toolBar, input: urlInput };

        titleBar.onmousedown = e => {
            e.preventDefault();
            const r = winBox.getBoundingClientRect();
            this.drag = { el: winBox, ox: e.clientX - r.left, oy: e.clientY - r.top };
            titleBar.style.cursor = "grabbing";
            winBox.style.transition = "none";
        };
        titleBar.onmouseup = () => {
            titleBar.style.cursor = "grab";
        };

        resizeHandle.onmousedown = e => {
            e.preventDefault();
            this.resize = {
                el: winBox,
                w: winBox.offsetWidth,
                h: winBox.offsetHeight,
                sx: e.clientX,
                sy: e.clientY
            };
            winBox.style.transition = "none";
        };
    }

    closeWin({ name }) {
        if (this.winList[name]) {
            this.winList[name].box.remove();
            delete this.winList[name];
        }
    }
    refreshPage({ name }) {
        const i = this.winList[name];
        if (i) i.iframe.src = i.iframe.src;
    }
    goUrl({ name, url }) {
        const i = this.winList[name];
        if (i) { i.iframe.src = url; i.input.value = url; }
    }
    getCurrentUrl({ name }) {
        const i = this.winList[name];
        return i?.iframe?.src || "无窗口";
    }
    setWinBg({ name, color, blur }) {
        const i = this.winList[name];
        if (!i) return;
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        i.box.style.background = `rgba(${r},${g},${b},0.55)`;
        i.box.style.backdropFilter = `blur(${blur}px) saturate(110%)`;
        i.box.style.webkitBackdropFilter = `blur(${blur}px) saturate(110%)`;
    }
}
Scratch.extensions.register(new Ext());