'use strict';

class Lose {
    constructor() {
        this.background = pgame.make.sprite(0, 0, 'splash_lose');
        this.background.width = pgame.width;
        this.background.height = pgame.height;
    }

    preload() {
        pgame.add.existing(this.background);
    }

    create() {
        splashMusic.play();
        gameMusic.pause();
    }
}
