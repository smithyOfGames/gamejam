'use strict';

var pgame;

class Main {

  constructor(contanerName) {
    pgame = new Phaser.Game(800, 600, Phaser.AUTO, contanerName, {
      preload: ()=> this.preload(), create: ()=> this.create(), render: ()=> this.render()
    });
  }

  preload() {
    pgame.time.desiredFps = 60;
		pgame.time.advancedTiming = true;

    pgame.load.script('splash', 'js/game/splash.js');
    pgame.load.image('splash_bg', 'assets/images/splash_bg.jpg');
    pgame.load.audio('splash', ['assets/audio/splash.mp3', 'assets/audio/splash.ogg']);
  }

	create() {
    pgame.state.add('Splash', Splash);
    pgame.state.start('Splash');
  }

  render() {
		pgame.debug.cameraInfo(pgame.camera, 8, 500);
		pgame.debug.text('fps: ' + (pgame.time.fps || '--'), 700, 570, "#00ff00");
	}
}
