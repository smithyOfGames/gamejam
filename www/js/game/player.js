'use strict'

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

	setTargetDirection(y) {
		this.targetY = y;
	}

	update() {
		if (this.sprite.y != this.targetY) {
			let d = this.targetY - this.sprite.y;
			this.sprite.y += Math.sign(d) * Math.min(Math.abs(d), this.vel);
		}
		this.vel = this.posX - this.prevPosX;
		this.prevPosX = this.posX;
	}
}
