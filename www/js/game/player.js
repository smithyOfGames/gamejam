'use strict';

const minPlayerY = 20;
const maxPlayerY = 365;
const maxSpeed = 200;

class Player {
	constructor(phaserGame) {
		this.vel = 10; // скорость
		this.targetY = 100;
		this.sprite = phaserGame.add.sprite(100, 100, 'car');
        phaserGame.physics.arcade.enable(this.sprite);
		this.sprite.anchor.set(0.5);
	}

	getTargetY() {
		return this.sprite.position.y;
	}

	setVelocity(velocity) {
		this.sprite.body.velocity.y = velocity * maxSpeed;
	}

	update() {
        if (this.sprite.y < minPlayerY) {
            this.sprite.y = minPlayerY;
        }

        if (this.sprite.y > maxPlayerY) {
            this.sprite.y = maxPlayerY;
        }
	}
}
