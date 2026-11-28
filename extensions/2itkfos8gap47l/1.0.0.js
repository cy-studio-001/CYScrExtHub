(function (Scratch) {
  "use strict";

  class NetworkRequest {
    getInfo() {
      return {
        id: "networkRequest",
        name: "网络请求",
        color1: "#f076ab",
        color2: "#d05a8a",
        color3: "#b04070",
        blocks: [
          {
            opcode: "request",
            blockType: Scratch.BlockType.REPORTER,
            text: "使用 [METHOD] 请求 [URL] 返回格式为 [FORMAT]",
            arguments: {
              METHOD: {
                type: Scratch.ArgumentType.STRING,
                menu: "methods",
                defaultValue: "GET",
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "https://example.com/data.txt",
              },
              FORMAT: {
                type: Scratch.ArgumentType.STRING,
                menu: "formats",
                defaultValue: "UTF-8文本",
              },
            },
          },
        ],
        menus: {
          methods: {
            acceptReporters: false,
            items: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
          },
          formats: {
            acceptReporters: false,
            items: ["UTF-8文本", "Base64", "data:URL"],
          },
        },
      };
    }

    // 将 ArrayBuffer 转为 Base64 字符串
    arrayBufferToBase64(buffer) {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }

    // 主请求函数
    request({ METHOD, URL, FORMAT }) {
      const method = METHOD.toUpperCase();
      const url = URL.trim();
      if (!url) return "错误：URL不能为空";

      const fetchOptions = { method: method };

      // 对于 GET 和 HEAD 不发送 body，其他方法也不强制发送 body
      // 若需要 body，用户可自行在其他环节处理，本积木仅作获取用途

      return Scratch.fetch(url, fetchOptions)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const contentType = response.headers.get('Content-Type') || 'application/octet-stream';

          if (FORMAT === 'UTF-8文本') {
            return response.text();
          } else if (FORMAT === 'Base64') {
            const buffer = await response.arrayBuffer();
            return this.arrayBufferToBase64(buffer);
          } else if (FORMAT === 'data:URL') {
            const buffer = await response.arrayBuffer();
            const base64 = this.arrayBufferToBase64(buffer);
            return `data:${contentType};base64,${base64}`;
          } else {
            throw new Error('未知的格式选项');
          }
        })
        .catch((error) => {
          console.error('网络请求错误:', error);
          return `错误: ${error.message}`;
        });
    }
  }

  Scratch.extensions.register(new NetworkRequest());
})(Scratch);