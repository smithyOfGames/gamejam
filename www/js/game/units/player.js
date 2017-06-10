'use strict';

const minPlayerY = 20;
const maxPlayerY = 365;
const maxSpeed = 200;

class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.posX = 0;
        this.prevPosX = 0;
        this.vel = 0; // скорость
        this.targetY = 100;
        this.sprite = pgame.add.sprite(100, 100, 'ship');
        this.sprite.anchor.set(0.5);
    }

    getTargetY() {
        return this.sprite.position.y;
    }

    update() {
        this.vel = this.posX - this.prevPosX;
        this.prevPosX = this.posX;

        if (this.sprite.y < minPlayerY) {
            this.sprite.y = minPlayerY;
        }
        if (this.sprite.y > maxPlayerY) {
            this.sprite.y = maxPlayerY;
        }
    }
}
