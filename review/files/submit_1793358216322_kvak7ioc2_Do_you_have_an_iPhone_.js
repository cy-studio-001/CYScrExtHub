// Name: Apple Phone Check
// ID: applephonecheck
// Description: iPhone themed demo blocks including conditionals, popups and model selector.
// By: [你的名字]
// License: MIT
(function(Scratch) {
  'use strict';

  const APPLE_SVG_URL = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg";

  class ApplePhoneCheck {
    getInfo() {
      return {
        id: 'applephonecheck',
        name: 'Do you have iPhone?',
        menuIconURI: APPLE_SVG_URL,
        blockIconURI: APPLE_SVG_URL,
        color1: '#999999',
        color2: '#777777',
        color3: '#555555',
        blocks: [
          {
            opcode: 'askIphone',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Ask if you have iPhone'
          },
          {
            opcode: 'whoAmI',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Do you know who I am?'
          },
          {
            opcode: 'isAppleFounder',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Am I Apple founder?'
          },
          {
            opcode: 'appleIf',
            blockType: Scratch.BlockType.CONDITIONAL,
            text: 'iPhone version [VER] > 10 then',
            arguments: {
              VER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 15
              },
              SUBSTACK: {
                type: Scratch.ArgumentType.SUBSTACK
              }
            }
          },
          {
            opcode: 'whenAppleTrue',
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: false,
            text: 'When I am Apple founder',
          },
          {
            opcode: 'getIphoneModel',
            blockType: Scratch.BlockType.REPORTER,
            text: 'iPhone model [MODEL]',
            arguments: {
              MODEL: {
                type: Scratch.ArgumentType.MENU,
                menu: 'iphoneMenu'
              }
            }
          },
          {
            opcode: 'appleColorPick',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Pick Apple color [COLORVAL]',
            arguments: {
              COLORVAL: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ff0000'
              }
            }
          },
          {
            blockType: Scratch.BlockType.BUTTON,
            text: "Show Apple Info",
            func: "showAppleInfoBtn"
          }
        ],
        menus: {
          iphoneMenu: {
            items: [
              {text: "iPhone 15", value: "iPhone 15"},
              {text: "iPhone 14", value: "iPhone 14"},
              {text: "iPhone 13", value: "iPhone 13"},
              {text: "iPhone 12", value: "iPhone 12"},
              {text: "iPhone 11", value: "iPhone 11"}
            ]
          }
        }
      };
    }

    askIphone() {
      const answer = confirm("Do you have an iPhone?");
      if (answer) {
        alert("Nice! iPhones are great!");
      } else {
        alert("Oh, still using old boring phones?");
      }
    }

    whoAmI() {
      return "I am the founder of iPhone!";
    }

    isAppleFounder() {
      return true;
    }

    appleIf(args, util) {
      const ver = Number(args.VER);
      if (ver > 10) {
        util.startBranch(0, false);
      }
    }

    whenAppleTrue() {
      return true;
    }

    getIphoneModel(args) {
      return args.MODEL;
    }

    appleColorPick(args) {
      return args.COLORVAL;
    }

    showAppleInfoBtn() {
      alert("Apple Inc. created iPhone!");
    }
  }

  Scratch.extensions.register(new ApplePhoneCheck());
})(Scratch);