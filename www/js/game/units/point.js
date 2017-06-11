'use strict'

class ClickPoint {
    /*
    constructor(game, players, currPlayer, fromX, fromY, toX, toY) {
        this.sprite = pgame.add.sprite(toX, toY, 'barrel2');
        this.sprite.anchor.set(0.5);
        this.spriteCanSwim = true;
        this.vel = 0; // скорость движения
        this.players = players;
        this.currPlayer = currPlayer;
        this.checkPlayer = null;
        this.game = game;
        pgame.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    }
    */

    constructor(game, players, currPlayer, fromX, fromY, toX, toY) {
        this.sprite = pgame.add.sprite(fromX, fromY, 'barrel');
        //this.sprite = pgame.add.sprite(toX, toY, 'barrel2');
        this.sprite.anchor.set(0.5);
        this.spriteCanSwim = false;
        this.vel = 0; // скорость движения
        this.players = players;
        this.currPlayer = currPlayer;
        this.checkPlayer = null;
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
        if (this.spriteCanSwim) {
            this.sprite.x -= this.vel;
            for (let p of this.players.values()) {
                this.checkPlayer = p;
                pgame.physics.arcade.collide(this.sprite, p.sprite, this.affectorHitPlayer, null, this);
            }
        }
        if (this.sprite.x < -30) { // возможно, правильнее сравнивать с позицией последнего игрока
            this.game.delPoint(this);
            this.sprite.destroy();
        }
    }

    affectorHitPlayer (bulletSprite, playerSprite) {
        var collsisionSprite = pgame.add.sprite(bulletSprite.x - Number(playerSprite.width / 2), bulletSprite.y - Number(playerSprite.height / 4), 'collision');
        bulletSprite.destroy();
        if (this.currPlayer == this.checkPlayer) {
            this.game.socket.emit('collision', 'barrel');
        }

        pgame.time.events.add(Phaser.Timer.SECOND * 0.3, ()=> {
            collsisionSprite.destroy();
        });
    }
}
