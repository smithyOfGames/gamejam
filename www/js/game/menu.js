'use strict';

class Menu {

  constructor() {
    this.background = game.make.sprite(0, 0, 'menu_bg');
  }

  preload() {
    game.add.existing(this.background);
  }

  create() {
    let music = game.add.audio('menu');
    music.loop = true;
    music.play();

    this.background.width = game.width;
    this.background.height = game.height;
  }
}
