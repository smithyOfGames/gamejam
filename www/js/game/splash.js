'use strict';

class Splash {

  constructor() {
    this.background = pgame.make.sprite(0, 0, 'splash_bg');
    this.title = pgame.make.text(0, 0, 'Загружаемся..', {fill: 'white'});
    this.title.x = pgame.width / 2.0 - this.title.width / 2.0;
    this.title.y = pgame.height / 2.0 - this.title.height / 2.0;
  }

  preload() {
    pgame.add.existing(this.background);
    pgame.add.existing(this.title);

    pgame.load.script('menu', 'js/game/menu.js');
    pgame.load.audio('menu', ['assets/audio/menu.mp3', 'assets/audio/menu.ogg']);
    pgame.load.image('menu_bg', 'assets/images/menu_bg.jpg');

    pgame.load.audio('game', ['assets/audio/game.mp3', 'assets/audio/game.ogg']);
    pgame.load.script('game', 'js/game/game.js');

		pgame.load.image('star', 'assets/images/star.png');
		pgame.load.image('road', 'assets/images/road.png');
		pgame.load.image('car', 'assets/images/car60.png');
    pgame.load.atlas('gamepad', 'assets/virtualjoystick/atlas.png', 'assets/virtualjoystick/atlas.json');

    pgame.load.script('player', 'js/game/units/player.js');
		pgame.load.script('point', 'js/game/units/point.js');
		pgame.load.script('road', 'js/game/units/road.js');
  }

  create() {
    let music = pgame.add.audio('splash');
    music.loop = true;
    music.play();

    this.background.width = pgame.width;
    this.background.height = pgame.height;

    this.title.setText('Готово');
    this.title.x = pgame.width / 2.0 - this.title.width / 2.0;
    this.title.y = pgame.height / 2.0 - this.title.height / 2.0;

    pgame.state.add("Menu", Menu);
    pgame.state.add("Game", Game);

    setTimeout(function () {
      pgame.state.start("Menu");
    }, 1000);
  }
}
