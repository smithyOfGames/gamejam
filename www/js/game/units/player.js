'use strict';

const minPlayerY = 20;
const maxPlayerY = 365;
const maxSpeed = 200;

class Player {
    constructor(phaserGame, id, name, color) {
        this.id = id;
        this.name = name;
        this.posX = 0;
        this.prevPosX = 0;
        this.vel = 0;
        this.sprite = phaserGame.add.sprite(100, 100, color);
        this.sprite.anchor.set(0.5);
        phaserGame.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    }

    getTargetY() {
        return this.sprite.position.y;
    }

    update(currPlayer) {
        this.vel = this.posX - this.prevPosX;
        this.prevPosX = this.posX;

        if (this != currPlayer) {
            this.sprite.x = currPlayer.sprite.x + (this.posX - currPlayer.posX);
        }

        if (this.sprite.y < minPlayerY) {
            this.sprite.y = minPlayerY;
        }
        if (this.sprite.y > maxPlayerY) {
            this.sprite.y = maxPlayerY;
        }
    }
}
