'use strict'

class Road {
    constructor() {
        let g = pgame.add.group();

        const height = 380.0;
        const width = 800.0;
        let u = pgame.add.sprite(0, 0, 'water');
        u.scale.x = width / u.width;
        u.scale.y = height / u.height;
        u.x = 0;
        let v = pgame.add.sprite(0, 0, 'water');
        v.scale.x = width / v.width;
        v.scale.y = height / v.height;
        u.x = v.width;

        this.sprites = [u, v];
        this.vel = 0;
    }

    update() {
        let u = this.sprites[0];
        let v = this.sprites[1];

        if (v.x <= 0) {
            u.x = v.x + u.width;
            this.sprites[0] = v;
            this.sprites[1] = u;
        }

        u.x -= this.vel;
        v.x -= this.vel;
    }
}
