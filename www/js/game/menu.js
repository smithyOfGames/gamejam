'use strict'

class Menu {
	constructor(phaserGame) {
		this.music = phaserGame.add.audio('game');
		this.music.play();
		// this.music.volume = 100.0;
	}

}
