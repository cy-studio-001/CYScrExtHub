(function(Scratch) {
  'use strict';
  class DirectionMove {
    getInfo() {
      return {
        id: 'directionmove',
        name: '方向移动',
        color1: '#4C97FF',
        color2: '#3373CC',
        color3: '#2E6DA4',
        blocks: [
          {
            opcode: 'moveUp',
            blockType: Scratch.BlockType.COMMAND,
            text: '向上移动 [steps] 步',
            arguments: {
              steps: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            opcode: 'moveDown',
            blockType: Scratch.BlockType.COMMAND,
            text: '向下移动 [steps] 步',
            arguments: {
              steps: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            opcode: 'moveLeft',
            blockType: Scratch.BlockType.COMMAND,
            text: '向左移动 [steps] 步',
            arguments: {
              steps: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            opcode: 'moveRight',
            blockType: Scratch.BlockType.COMMAND,
            text: '向右移动 [steps] 步',
            arguments: {
              steps: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          }
        ]
      };
    }

    moveUp(args, util) {
      const s = Scratch.Cast.toNumber(args.steps);
      const sprite = util.target;
      sprite.setXY(sprite.x, sprite.y + s);
    }

    moveDown(args, util) {
      const s = Scratch.Cast.toNumber(args.steps);
      const sprite = util.target;
      sprite.setXY(sprite.x, sprite.y - s);
    }

    moveLeft(args, util) {
      const s = Scratch.Cast.toNumber(args.steps);
      const sprite = util.target;
      sprite.setXY(sprite.x - s, sprite.y);
    }

    moveRight(args, util) {
      const s = Scratch.Cast.toNumber(args.steps);
      const sprite = util.target;
      sprite.setXY(sprite.x + s, sprite.y);
    }
  }
  Scratch.extensions.register(new DirectionMove());
})(Scratch);