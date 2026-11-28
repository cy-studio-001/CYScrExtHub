// Name: Local Storage
// ID: localstorage
// Description: 本地存储数据，类似 cookies 但更好用。
// License: MIT AND MPL-2.0

/* generated l10n code */Scratch.translate.setup({"zh-cn":{"_Local Storage":"本地存储","_Local Storage extension: project must run the \"set storage namespace ID\" block before it can use other blocks":"本地存储拓展：请先运行“将存储命名空间ID设为”积木才能使用下面的积木","_Namespace: {namespace}":"命名空间：{namespace}","_No namespace set":"未设置命名空间","_delete [KEY] from storage":"从存储中删除[KEY]","_delete storage":"删除存储","_get [KEY] from storage":"从存储中获取[KEY]","_project title":"作品标题","_score":"分数","_set [KEY] to [VALUE] in storage":"将存储中的[KEY]设为[VALUE]","_set namespace to [ID]":"将命名空间设为[ID]","_when another window changes storage":"当其他页面修改本地存储数据"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Local Storage must be run unsandboxed");
  }

  const getNamespace = () =>
    Scratch.vm.runtime.extensionStorage["localstorage"]?.namespace;

  /**
   * @param {string} newNamespace
   */
  const setNamespace = (newNamespace) => {
    Scratch.vm.runtime.extensionStorage["localstorage"] = {
      namespace: newNamespace,
    };
    Scratch.vm.extensionManager.refreshBlocks("localstorage");
    readFromStorage();
  };

  const STORAGE_PREFIX = "extensions.turbowarp.org/local-storage:";
  const getStorageKey = (namespace) => `${STORAGE_PREFIX}${namespace}`;

  /**
   * Cached in memory for performance.
   * @type {Record<string, string|number|boolean>}
   */
  let namespaceValues = Object.create(null);

  const readFromStorage = () => {
    namespaceValues = Object.create(null);

    try {
      // localStorage could throw if unsupported
      const data = localStorage.getItem(getStorageKey(getNamespace()));
      if (data) {
        // JSON.parse could throw if data is invalid
        const parsed = JSON.parse(data);
        if (parsed && parsed.data) {
          // Remove invalid values from the JSON
          for (const [key, value] of Object.entries(parsed.data)) {
            if (
              typeof value === "string" ||
              typeof value === "number" ||
              typeof value === "boolean"
            ) {
              namespaceValues[key] = value;
            }
          }
        }
      }
    } catch (error) {
      console.error("Error reading from local storage", error);
    }
  };

  const saveToLocalStorage = (targetNamespace = getNamespace()) => {
    try {
      const data = targetNamespace === getNamespace() ? namespaceValues : getNamespaceData(targetNamespace);
      if (Object.keys(data).length > 0) {
        localStorage.setItem(
          getStorageKey(targetNamespace),
          JSON.stringify({
            // If we find that turbowarp.org is commonly running out of shared space in local storage,
            // having a timestamp here makes it at least theoretically possible to delete storage based
            // on last used time.
            time: Math.round(Date.now() / 1000),
            data: data,
          })
        );
      } else {
        localStorage.removeItem(getStorageKey(targetNamespace));
      }
    } catch (error) {
      console.error("Error saving to local storage", error);
    }
  };

  const getNamespaceData = (namespace) => {
    try {
      const data = localStorage.getItem(getStorageKey(namespace));
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.data) {
          const result = {};
          for (const [key, value] of Object.entries(parsed.data)) {
            if (
              typeof value === "string" ||
              typeof value === "number" ||
              typeof value === "boolean"
            ) {
              result[key] = value;
            }
          }
          return result;
        }
      }
    } catch (error) {
      console.error("Error reading namespace data", error);
    }
    return Object.create(null);
  };

  window.addEventListener("storage", (event) => {
    if (
      getNamespace() &&
      event.key === getStorageKey(getNamespace()) &&
      event.storageArea === localStorage
    ) {
      readFromStorage();
      Scratch.vm.runtime.startHats("localstorage_whenChanged");
    }
  });

  const generateRandomNamespace = () => {
    // doesn't need to be cryptographically secure and doesn't need to have excessive length
    // this has 16^16 = 18446744073709551616 possible namespaces which is plenty
    const soup = "0123456789abcdef";
    let id = "";
    for (let i = 0; i < 16; i++) {
      id += soup[Math.floor(Math.random() * soup.length)];
    }
    return id;
  };

  const generateRandomNamespaceIfMissing = () => {
    if (!getNamespace()) {
      setNamespace(generateRandomNamespace());
    }
  };

  Scratch.vm.runtime.on("PROJECT_LOADED", () => {
    generateRandomNamespaceIfMissing();
  });

  Scratch.vm.runtime.on("RUNTIME_DISPOSED", () => {
    generateRandomNamespace();
  });

  generateRandomNamespaceIfMissing();

  let lastNamespaceWarning = 0;
  const validNamespace = () => {
    const valid = !!getNamespace();
    if (!valid && Date.now() - lastNamespaceWarning > 3000) {
      alert(
        Scratch.translate(
          'Local Storage extension: project must run the "set storage namespace ID" block before it can use other blocks'
        )
      );
      lastNamespaceWarning = Date.now();
    }
    return valid;
  };

  class LocalStorage {
    getInfo() {
      return {
        id: "localstorage",
        name: Scratch.translate("Local Storage"),
        docsURI: "https://extensions.turbowarp.org/local-storage",
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: getNamespace()
              ? Scratch.translate(
                  {
                    default: "Namespace: {namespace}",
                  },
                  {
                    namespace: getNamespace(),
                  }
                )
              : Scratch.translate("No namespace set"),
          },
          {
            opcode: "get",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("get [KEY] from storage"),
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: Scratch.translate("score"),
              },
            },
          },
          {
            opcode: "set",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set [KEY] to [VALUE] in storage"),
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: Scratch.translate("score"),
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1000",
              },
            },
          },
          {
            opcode: "remove",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("delete [KEY] from storage"),
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: Scratch.translate("score"),
              },
            },
          },
          {
            opcode: "removeAll",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("delete storage"),
          },
          {
            opcode: "whenChanged",
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate("when another window changes storage"),
            isEdgeActivated: false,
          },
          "---",
          {
            opcode: "setProjectId",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set namespace to [ID]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue:
                  getNamespace() || Scratch.translate("project title"),
              },
            },
          },
          // 新添加的积木开始
          {
            opcode: "getCurrentNamespace",
            blockType: Scratch.BlockType.REPORTER,
            text: "当前命名空间",
          },
          {
            opcode: "hasKey",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "键[KEY]存在？",
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: Scratch.translate("score"),
              },
            },
          },
          "---",
          {
            opcode: "getFromNamespace",
            blockType: Scratch.BlockType.REPORTER,
            text: "从命名空间[NAMESPACE]获取[KEY]",
            arguments: {
              NAMESPACE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: Scratch.translate("score"),
              },
            },
          },
          {
            opcode: "setInNamespace",
            blockType: Scratch.BlockType.COMMAND,
            text: "将命名空间[NAMESPACE]的[KEY]设为[VALUE]",
            arguments: {
              NAMESPACE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: Scratch.translate("score"),
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1000",
              },
            },
          },
          {
            opcode: "removeFromNamespace",
            blockType: Scratch.BlockType.COMMAND,
            text: "从命名空间[NAMESPACE]中删除[KEY]",
            arguments: {
              NAMESPACE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: Scratch.translate("score"),
              },
            },
          },
          {
            opcode: "hasKeyInNamespace",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "命名空间[NAMESPACE]中的键[KEY]是否存在？",
            arguments: {
              NAMESPACE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: Scratch.translate("score"),
              },
            },
          },
          {
            opcode: "clearNamespace",
            blockType: Scratch.BlockType.COMMAND,
            text: "删除命名空间[NAMESPACE]中的所有键",
            arguments: {
              NAMESPACE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          // 新添加的积木结束
        ],
      };
    }

    setProjectId({ ID }) {
      setNamespace(Scratch.Cast.toString(ID));
    }

    get({ KEY }) {
      if (!validNamespace()) {
        return "";
      }
      KEY = Scratch.Cast.toString(KEY);
      if (!Object.prototype.hasOwnProperty.call(namespaceValues, KEY)) {
        return "";
      }
      return namespaceValues[KEY];
    }

    set({ KEY, VALUE }) {
      if (!validNamespace()) {
        return "";
      }
      namespaceValues[Scratch.Cast.toString(KEY)] = VALUE;
      saveToLocalStorage();
    }

    remove({ KEY }) {
      if (!validNamespace()) {
        return "";
      }
      delete namespaceValues[Scratch.Cast.toString(KEY)];
      saveToLocalStorage();
    }

    removeAll() {
      if (!validNamespace()) {
        return "";
      }
      namespaceValues = Object.create(null);
      saveToLocalStorage();
    }

    // 新添加的方法开始
    getCurrentNamespace() {
      return getNamespace() || "";
    }

    hasKey({ KEY }) {
      if (!validNamespace()) {
        return false;
      }
      KEY = Scratch.Cast.toString(KEY);
      return Object.prototype.hasOwnProperty.call(namespaceValues, KEY);
    }

    getFromNamespace({ NAMESPACE, KEY }) {
      const targetNamespace = Scratch.Cast.toString(NAMESPACE) || getNamespace();
      if (!targetNamespace) {
        return "";
      }
      KEY = Scratch.Cast.toString(KEY);
      
      if (targetNamespace === getNamespace()) {
        // 如果是当前命名空间，使用缓存
        if (!Object.prototype.hasOwnProperty.call(namespaceValues, KEY)) {
          return "";
        }
        return namespaceValues[KEY];
      } else {
        // 如果是其他命名空间，从localStorage读取
        const data = getNamespaceData(targetNamespace);
        if (!Object.prototype.hasOwnProperty.call(data, KEY)) {
          return "";
        }
        return data[KEY];
      }
    }

    setInNamespace({ NAMESPACE, KEY, VALUE }) {
      const targetNamespace = Scratch.Cast.toString(NAMESPACE) || getNamespace();
      if (!targetNamespace) {
        return;
      }
      KEY = Scratch.Cast.toString(KEY);
      
      if (targetNamespace === getNamespace()) {
        // 如果是当前命名空间，使用缓存
        if (!validNamespace()) {
          return;
        }
        namespaceValues[KEY] = VALUE;
        saveToLocalStorage();
      } else {
        // 如果是其他命名空间，更新localStorage
        const data = getNamespaceData(targetNamespace);
        data[KEY] = VALUE;
        // 暂时保存到临时对象，然后保存到localStorage
        const temp = namespaceValues;
        namespaceValues = data;
        saveToLocalStorage(targetNamespace);
        namespaceValues = temp;
      }
    }

    removeFromNamespace({ NAMESPACE, KEY }) {
      const targetNamespace = Scratch.Cast.toString(NAMESPACE) || getNamespace();
      if (!targetNamespace) {
        return;
      }
      KEY = Scratch.Cast.toString(KEY);
      
      if (targetNamespace === getNamespace()) {
        // 如果是当前命名空间，使用缓存
        if (!validNamespace()) {
          return;
        }
        delete namespaceValues[KEY];
        saveToLocalStorage();
      } else {
        // 如果是其他命名空间，更新localStorage
        const data = getNamespaceData(targetNamespace);
        delete data[KEY];
        const temp = namespaceValues;
        namespaceValues = data;
        saveToLocalStorage(targetNamespace);
        namespaceValues = temp;
      }
    }

    hasKeyInNamespace({ NAMESPACE, KEY }) {
      const targetNamespace = Scratch.Cast.toString(NAMESPACE) || getNamespace();
      if (!targetNamespace) {
        return false;
      }
      KEY = Scratch.Cast.toString(KEY);
      
      if (targetNamespace === getNamespace()) {
        // 如果是当前命名空间，使用缓存
        if (!validNamespace()) {
          return false;
        }
        return Object.prototype.hasOwnProperty.call(namespaceValues, KEY);
      } else {
        // 如果是其他命名空间，从localStorage读取
        const data = getNamespaceData(targetNamespace);
        return Object.prototype.hasOwnProperty.call(data, KEY);
      }
    }

    clearNamespace({ NAMESPACE }) {
      const targetNamespace = Scratch.Cast.toString(NAMESPACE) || getNamespace();
      if (!targetNamespace) {
        return;
      }
      
      if (targetNamespace === getNamespace()) {
        // 如果是当前命名空间，使用缓存
        if (!validNamespace()) {
          return;
        }
        namespaceValues = Object.create(null);
        saveToLocalStorage();
      } else {
        // 如果是其他命名空间，清空localStorage
        localStorage.removeItem(getStorageKey(targetNamespace));
      }
    }
    // 新添加的方法结束
  }

  Scratch.extensions.register(new LocalStorage());
})(Scratch);