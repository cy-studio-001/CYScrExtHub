class Extension {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 480;
        this.canvas.height = 360;
        this.seeds = [];
        this.enabled = false;
        this.MAX_SEEDS = 1000; // 最大种子数限制
    }

    getInfo() {
        return {
            id: "blackMold",
            name: "黑霉菌",
            color1: "#111111",
            color2: "#000000",
            blocks: [
                {
                    opcode: "start",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "启动霉菌"
                },
                {
                    opcode: "stop",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "停止霉菌"
                },
                {
                    opcode: "clear",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "清除霉菌"
                },
                {
                    opcode: "tick",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "生长霉菌"
                }
            ]
        };
    }

    start() {
        this.enabled = true;
        if (this.seeds.length === 0) {
            this.seeds.push({
                x: Math.random() * 480,
                y: Math.random() * 360,
                r: 5
            });
        }
        if (!this.overlay) {
            this.overlay = document.createElement("canvas");
            this.overlay.width = 480;
            this.overlay.height = 360;
            this.overlay.style.position = "absolute";
            this.overlay.style.pointerEvents = "none";
            this.overlay.style.left = "0";
            this.overlay.style.top = "0";
            this.overlay.style.width = "100%";
            this.overlay.style.height = "100%";
            this.overlay.style.zIndex = "9999";
            this.octx = this.overlay.getContext("2d");
            const stage = document.querySelector("canvas");
            stage.parentElement.appendChild(this.overlay);
        }
    }

    stop() {
        this.enabled = false;
    }

    clear() {
        this.seeds = [];
        if (this.octx) {
            this.octx.clearRect(0, 0, 480, 360);
        }
    }

    tick() {
        if (!this.enabled) return;
        const ctx = this.octx;

        // 防止种子过多导致卡顿
        if (this.seeds.length > this.MAX_SEEDS) {
            this.seeds = this.seeds.slice(0, this.MAX_SEEDS);
        }

        const newSeeds = [];
        // 更新已有种子，并产生分支
        for (const blob of this.seeds) {
            blob.r += Math.random() * 0.5;
            // 分支概率 4%，且不超过上限
            if (Math.random() < 0.04 && this.seeds.length + newSeeds.length < this.MAX_SEEDS) {
                newSeeds.push({
                    x: blob.x + (Math.random() - 0.5) * blob.r * 4,
                    y: blob.y + (Math.random() - 0.5) * blob.r * 4,
                    r: 2
                });
            }
        }
        this.seeds.push(...newSeeds);

        // ★ 批量绘制：所有圆弧合并为一条路径，只调用一次 fill()
        ctx.beginPath();
        for (const blob of this.seeds) {
            const offX = (Math.random() - 0.5) * blob.r * 0.3;
            const offY = (Math.random() - 0.5) * blob.r * 0.3;
            ctx.arc(blob.x + offX, blob.y + offY, blob.r, 0, Math.PI * 2);
        }
        ctx.fillStyle = "#000";
        ctx.fill();
    }
}

Scratch.extensions.register(new Extension());