'use strict'

class Player {
	constructor(phaserGame) {
		this.vel = 10; // скорость
		this.targetY = 100;
		this.sprite = phaserGame.add.sprite(100, 100, 'car');
		this.sprite.anchor.set(0.5);
	}

	setTargetDirection(y) {
		this.targetY = y;
	}

	update() {
		if (this.sprite.y != this.targetY) {
			let d = this.targetY - this.sprite.y;
			this.sprite.y += Math.sign(d) * Math.min(Math.abs(d), this.vel);
		}
	}
}
