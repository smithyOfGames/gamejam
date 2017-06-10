'use strict'

class ClickPoint {
   constructor(game, x, y) {
      this.game = game;
      this.sprite = game.pg.add.sprite(x, y, 'star');
      this.sprite.anchor.set(0.5)
   }

   update() {
      this.sprite.x -= 5;
      if (this.sprite.x < -10) {
         this.game.delPoint(this);
         this.sprite.destroy();
      }
   }
}
