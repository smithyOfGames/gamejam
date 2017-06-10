'use strict';

class Menu {

  constructor() {
    this.background = pgame.make.sprite(0, 0, 'menu_bg');
  }

  preload() {
    pgame.add.existing(this.background);
  }

  create() {
    let music = pgame.add.audio('menu');
    music.loop = true;
    music.play();

    this.background.width = pgame.width;
    this.background.height = pgame.height;
  }
}
