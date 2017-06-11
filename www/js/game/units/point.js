'use strict'

class ClickPoint {
    constructor(game, player, fromX, fromY, toX, toY) {
        this.sprite = pgame.add.sprite(player.sprite.position.x, player.sprite.position.y, 'barrel');
        this.sprite.anchor.set(0.5);
        this.spriteCanSwim = false;
        this.vel = 0; // скорость движения
        this.player = player;
        this.game = game;
        pgame.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        //this.sprite.body.bounce.set(1);
        //this.sprite.body.velocity.set(1000, 200);


        this.demoTween = game.add.tween(this.sprite).to({x:toX,y:toY, angle: 360},1000);

        //this.sprite.x = toX;
        //this.sprite.y = toY;

        //this.sprite.loadTexture('barrel2', 0, false);

        this.demoTween.onComplete.add(()=> {
            this.spriteCanSwim = true;
            this.sprite.loadTexture('barrel2', 0, false);
        });


        this.demoTween.start();
    }

    update() {
        //this.demoTween.start();
        if (this.spriteCanSwim) {
            this.sprite.x -= this.vel;
            pgame.physics.arcade.collide(this.sprite, this.player.sprite, this.affectorHitPlayer, null, this);
        }
        if (this.sprite.x < -30) { // возможно, правильнее сравнивать с позицией последнего игрока
            this.game.delPoint(this);
            this.sprite.destroy();
        }
    }

    affectorHitPlayer () {
        var collsisionSprite = pgame.add.sprite(this.sprite.x - Number(this.player.sprite.width / 2), this.sprite.y - Number(this.player.sprite.height / 4), 'collision');
        this.sprite.destroy();
        pgame.time.events.add(Phaser.Timer.SECOND * 0.3, ()=> {
            var send =  this.game.socket.emit('collision', 'barrel');
        //console.log(send);
        collsisionSprite.destroy();
    });
    }
}