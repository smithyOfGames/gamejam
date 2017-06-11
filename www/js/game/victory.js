'use strict';

class Victory {
    constructor() {
        this.background = pgame.make.sprite(0, 0, 'splash_win');
        this.background.width = pgame.width;
        this.background.height = pgame.height;
    }

    preload() {
        pgame.add.existing(this.background);
    }
}