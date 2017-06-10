'use strict';

class Splash {

    constructor() {
        this.background = pgame.make.sprite(0, 0, 'splash_bg');
        this.background.width = pgame.width;
        this.background.height = pgame.height;

        this.title = pgame.make.text(0, 0, 'Загружаемся..', {fill: 'white'});
        this.title.x = pgame.width / 2.0 - this.title.width / 2.0;
        this.title.y = pgame.height / 2.0 - this.title.height / 2.0;
    }

    preload() {
        pgame.add.existing(this.background);
        pgame.add.existing(this.title);

        pgame.load.audio('menu', ['assets/audio/menu.mp3', 'assets/audio/menu.ogg']);
        pgame.load.audio('game', ['assets/audio/game.mp3', 'assets/audio/game.ogg']);
        pgame.load.audio('splash', ['assets/audio/splash.mp3', 'assets/audio/splash.ogg']);

        pgame.load.script('menu', 'js/game/menu.js');
        pgame.load.script('game', 'js/game/game.js');
        pgame.load.script('player', 'js/game/units/player.js');
        pgame.load.script('point', 'js/game/units/point.js');
        pgame.load.script('road', 'js/game/units/road.js');

        pgame.load.atlas('gamepad', 'assets/virtualjoystick/atlas.png', 'assets/virtualjoystick/atlas.json');

        pgame.load.image('menu_bg', 'assets/images/menu_bg.jpg');
        pgame.load.image('barrel', 'assets/images/barrel.png');
        pgame.load.image('water', 'assets/images/water.png');
        pgame.load.image('ship', 'assets/images/ship2_red.png');
    }

    create() {
        splashMusic = pgame.add.audio('splash');
        splashMusic.loop = true;
        gameMusic = pgame.add.audio('game');
        gameMusic.loop = true;

        pgame.state.add("Menu", Menu);
        pgame.state.add("Game", Game);

        splashMusic.play();

        setTimeout(function () {
          pgame.state.start("Menu");
        }, 1000);
    }
}
