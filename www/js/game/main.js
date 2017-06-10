'use strict';

var game;

class Main {

  constructor(contanerName) {
    game = new Phaser.Game(800, 600, Phaser.AUTO, contanerName, {
      preload: ()=> this.preload(), create: ()=> this.create(), render: ()=> this.render()
    });
  }

  preload() {
    game.time.desiredFps = 60;
		game.time.advancedTiming = true;

    game.load.script('splash', 'js/game/splash.js');
    game.load.image('splash_bg', 'assets/images/splash_bg.jpg');
    game.load.audio('splash', ['assets/audio/splash.mp3', 'assets/audio/splash.ogg']);
  }

	create() {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

  render() {
		game.debug.cameraInfo(game.camera, 8, 500);
		game.debug.text('fps: ' + (game.time.fps || '--'), 700, 570, "#00ff00");
	}
}
