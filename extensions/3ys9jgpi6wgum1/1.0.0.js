// Name: 通知
// ID: mdwaltersnotifications
// Description: 显示通知。
// License: MIT

(function (Scratch) {
  "use strict";

  let denied = false;
  /** @type {Notification|null} */
  let notification = null;

  const askForNotificationPermission = async () => {
    try {
      const allowedByVM = await Scratch.canNotify();
      if (!allowedByVM) {
        throw new Error("被VM拒绝");
      }

      const allowedByBrowser = await Notification.requestPermission();
      if (allowedByBrowser === "denied") {
        throw new Error("被浏览器拒绝");
      }

      denied = false;
      return true;
    } catch (e) {
      denied = true;
      console.warn("无法请求通知权限", e);
      return false;
    }
  };

  const isAndroid = () => navigator.userAgent.includes("Android");

  const getServiceWorkerRegistration = () => {
    if (!("serviceWorker" in navigator)) return null;
    if (!isAndroid()) return null;
    return navigator.serviceWorker.getRegistration();
  };

  class Notifications {
    constructor() {
      Scratch.vm.runtime.on("RUNTIME_DISPOSED", () => {
        this._closeNotification();
      });
    }
    getInfo() {
      return {
        id: "mdwaltersnotifications",
        name: "通知",
        blocks: [
          {
            opcode: "requestPermission",
            blockType: Scratch.BlockType.COMMAND,
            text: "请求通知权限",
          },
          {
            opcode: "hasPermission",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "有通知权限？",
            disableMonitor: true,
          },
          {
            opcode: "showNotification",
            blockType: Scratch.BlockType.COMMAND,
            text: "发送通知 标题[title]内容[content]是否静音[silent]图标URL[icon]显示模式[mode]",
            arguments: {
              title: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "通知"
              },
              content: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "你好！"
              },
              silent: {
                type: Scratch.ArgumentType.STRING,
                menu: "silentMenu"
              },
              icon: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              mode: {
                type: Scratch.ArgumentType.STRING,
                menu: "modeMenu"
              }
            }
          },
          {
            opcode: "closeNotification",
            blockType: Scratch.BlockType.COMMAND,
            text: "关闭通知",
          },
        ],
        menus: {
          silentMenu: {
            items: ["静音", "不静音"]
          },
          modeMenu: {
            items: ["自动关闭", "手动关闭"]
          }
        }
      };
    }

    requestPermission() {
      return askForNotificationPermission();
    }

    hasPermission() {
      if (denied) {
        return false;
      }
      return askForNotificationPermission();
    }

    async _showNotification(title, content, silent, icon, mode) {
      if (await this.hasPermission()) {
        const options = {
          body: content,
          silent: silent === "静音",
          requireInteraction: mode === "手动关闭" // 只有这个可以控制
        };

        // 添加图标支持
        if (icon && icon.trim() !== '') {
          try {
            // 验证是否是有效的URL或Data URL
            new URL(icon);
            options.icon = icon;
          } catch (e) {
            console.warn("图标URL无效，将不使用图标:", icon);
          }
        }

        try {
          notification = new Notification(title, options);
        } catch (e) {
          // 在Android上需要通过service worker
          const registration = await getServiceWorkerRegistration();
          if (registration) {
            try {
              await registration.showNotification(title, options);
            } catch (e2) {
              console.error("无法显示通知", e, e2);
            }
          } else {
            console.error("无法显示通知", e);
          }
        }
      }
    }

    showNotification(args) {
      this._showNotification(
        Scratch.Cast.toString(args.title),
        Scratch.Cast.toString(args.content),
        Scratch.Cast.toString(args.silent),
        Scratch.Cast.toString(args.icon),
        Scratch.Cast.toString(args.mode)
      );
    }

    async _closeNotification() {
      if (notification) {
        notification.close();
        notification = null;
      }

      const registration = await getServiceWorkerRegistration();
      if (registration) {
        const notifications = await registration.getNotifications();
        for (const notification of notifications) {
          notification.close();
        }
      }
    }

    closeNotification() {
      this._closeNotification();
    }
  }

  Scratch.extensions.register(new Notifications());
})(Scratch);