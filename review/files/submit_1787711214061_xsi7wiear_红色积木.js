(function (Scratch) {
  "use strict";

  class RedBlockExtension {
    getInfo() {
      return {
        id: "redBlockExtension",
        name: "红色积木",
        color: "#FF0000", // 纯红色
        blocks: [
          {
            blockType: Scratch.BlockType.XML,
            xml: '<block type="undefined"></block>',
          },
        ],
      };
    }
  }

  Scratch.extensions.register(new RedBlockExtension());
})(Scratch);