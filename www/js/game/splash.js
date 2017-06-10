'use strict';

class Splash {

  constructor() {
    this.background = game.make.sprite(0, 0, 'splash_bg');
    this.title = game.make.text(0, 0, 'Загружаемся..', {fill: 'white'});
    this.title.x = game.width / 2.0 - this.title.width / 2.0;
    this.title.y = game.height / 2.0 - this.title.height / 2.0;
  }

  preload() {
    game.add.existing(this.background);
    game.add.existing(this.title);

    game.load.script('menu', 'js/game/menu.js');
    game.load.audio('menu', ['assets/audio/menu.mp3', 'assets/audio/menu.ogg']);
    game.load.image('menu_bg', 'assets/images/menu_bg.jpg');

    game.load.audio('game', ['assets/audio/game.mp3', 'assets/audio/game.ogg']);
    game.load.script('game', 'js/game/game.js');

		game.load.image('star', 'assets/images/star.png');
		game.load.image('road', 'assets/images/road.png');
		game.load.image('car', 'assets/images/car60.png');
    game.load.atlas('gamepad', 'assets/virtualjoystick/atlas.png', 'assets/virtualjoystick/atlas.json');
  }

  create() {
    let music = game.add.audio('splash');
    music.loop = true;
    music.play();

    this.background.width = game.width;
    this.background.height = game.height;

    this.title.setText('Готово');
    this.title.x = game.width / 2.0 - this.title.width / 2.0;
    this.title.y = game.height / 2.0 - this.title.height / 2.0;

    game.state.add("Menu", Menu);
    game.state.add("Game", Game);

    setTimeout(function () {
      game.state.start("Menu");
    }, 1000);
  }
}
