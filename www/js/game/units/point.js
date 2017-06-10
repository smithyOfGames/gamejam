'use strict'

class ClickPoint {
   constructor(game, x, y) {
      this.game = game;
      this.sprite = game.pg.add.sprite(x, y, 'star');
      this.sprite.anchor.set(0.5)
      this.vel = 0; // скорость движения
   }

   update() {
      this.sprite.x -= this.vel;
      if (this.sprite.x < -30) { // возможно, правильнее сравнивать с позицией последнего игрока
         this.game.delPoint(this);
         this.sprite.destroy();
      }
   }
}
