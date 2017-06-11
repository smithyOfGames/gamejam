'use strict';

class Menu {

    constructor() {
        this.background = pgame.make.sprite(0, 0, 'splash_bg');
        this.background.width = pgame.width;
        this.background.height = pgame.height;
    }

    preload() {
        pgame.add.existing(this.background);
    }

    create() {
        this.locateButton("Ввести имя", pgame.height / 2.0 - 40, function () {
            userName = prompt("Карамба! Как ты собирался выйти в плаванье!?", "Назовись");
        });

        this.locateButton("Играть", pgame.height / 2.0, function () {
            splashMusic.pause();
            gameMusic.play();
            pgame.state.start("Game");
        });
    }

    locateButton(title, y, callback) {
        let button = pgame.add.text(0, 0, title, { fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4});
        button.stroke = "rgba(0,0,0,0";
        button.strokeThickness = 4;
        button.x = pgame.width / 2.0 - button.width / 2.0;
        button.y = y;

        var onOver = function (target) {
            target.fill = "#FEFFD5";
            target.stroke = "rgba(200,200,200,0.5)";
            button.useHandCursor = true;
        };

        var onOut = function (target) {
            target.fill = "white";
            target.stroke = "rgba(0,0,0,0)";
            button.useHandCursor = false;
        };

        button.inputEnabled = true;
        button.events.onInputUp.add(callback, this);
        button.events.onInputOver.add(onOver, this);
        button.events.onInputOut.add(onOut, this);
    }
}
