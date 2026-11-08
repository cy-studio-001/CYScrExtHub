(function (Scratch) {
  'use strict';
  class PlaceholderExtension {
    constructor(idNum) {
      this.idNum = idNum;
    }
    getInfo() {
      return {
        id: 'placeholder' + this.idNum,
        name: ' ',
        menuIconURI: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="transparent"/></svg>',
        color1: 'transparent',
        color2: 'transparent',
        color3: 'transparent',
        blocks: []
      };
    }
  }
  for (let i = 1; i <= 100; i++) {
    Scratch.extensions.register(new PlaceholderExtension(i));
  }
})(Scratch);