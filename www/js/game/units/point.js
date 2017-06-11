'use strict'

class ClickPoint {
    constructor(game, x, y, player) {
        this.sprite = pgame.add.sprite(x, y, 'barrel');
        this.sprite.anchor.set(0.5);
        this.vel = 0; // скорость движения
        this.player = player;
        this.game = game;
        pgame.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    }

    update() {
        this.sprite.x -= this.vel;
        pgame.physics.arcade.collide(this.sprite, this.player.sprite, this.affectorHitPlayer, null, this);
        if (this.sprite.x < -30) { // возможно, правильнее сравнивать с позицией последнего игрока
            this.game.delPoint(this);
            this.sprite.destroy();
        }
    }

    affectorHitPlayer () {
        this.game.socket.emit('collision', 'barrel');
        var collsisionSprite = pgame.add.sprite(this.sprite.x - Number(this.player.sprite.width / 2), this.sprite.y - Number(this.player.sprite.height / 4), 'collision');
        this.sprite.destroy();
        pgame.time.events.add(Phaser.Timer.SECOND * 0.3, ()=> {
            collsisionSprite.destroy();
        });
    }
}
