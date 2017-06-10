'use strict'

class Road {
   constructor(phaserGame) {
      let g = phaserGame.add.group();

      const height = 380.0;
      const width = 800.0;
      let u = phaserGame.add.sprite(0, 0, 'road');
      u.scale.x = width / u.width;
      u.scale.y = height / u.height;
      u.x = 0;
      let v = phaserGame.add.sprite(0, 0, 'road');
      v.scale.x = width / v.width;
      v.scale.y = height / v.height;
      u.x = v.width;

      this.sprites = [u, v];
   }

   update() {
      let u = this.sprites[0];
      let v = this.sprites[1];

      if (v.x <= 0) {
         u.x = v.x + u.width;
         this.sprites[0] = v;
         this.sprites[1] = u;
      }

      u.x -= 5;
      v.x -= 5;
   }
}
