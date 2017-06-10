'use strict';

const minPlayerY = 20;
const maxPlayerY = 365;
const maxSpeed = 200;

class Player {
	constructor(phaserGame, id, name) {
		this.id = id;
		this.name = name;
		this.posX = 0;
		this.prevPosX = 0;
		this.vel = 0; // скорость
		this.targetY = 100;
		this.sprite = phaserGame.add.sprite(100, 100, 'car');
		this.sprite.anchor.set(0.5);
	}

	getTargetY() {
		return this.sprite.position.y;
	}

	setVelocity(velocity) {
		this.sprite.body.velocity.y = velocity * maxSpeed;
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
