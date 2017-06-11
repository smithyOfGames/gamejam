'use strict'

class Road {
    constructor() {
        this.sprite = pgame.add.tileSprite(0, 0, 800, 600, 'water');
        this.vel = 0;
    }

    update() {
        this.sprite.tilePosition.x -= this.vel;
    }
}
