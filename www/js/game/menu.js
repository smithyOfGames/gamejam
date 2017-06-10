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
		this.button = pgame.add.text(0, 0, "Играть", { fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4});
        this.button.stroke = "rgba(0,0,0,0";
        this.button.strokeThickness = 4;
		this.button.x = pgame.width / 2.0 - this.button.width / 2.0;
        this.button.y = pgame.height / 2.0 - this.button.height / 2.0;

        var onOver = function (target) {
            target.fill = "#FEFFD5";
            target.stroke = "rgba(200,200,200,0.5)";
            this.button.useHandCursor = true;
        };
        var onOut = function (target) {
            target.fill = "white";
            target.stroke = "rgba(0,0,0,0)";
            this.button.useHandCursor = false;
        };
		var callback = function (targer) {
			splashMusic.pause();
			gameMusic.play();
			pgame.state.start("Game");
		}
        this.button.inputEnabled = true;
        this.button.events.onInputUp.add(callback, this);
        this.button.events.onInputOver.add(onOver, this);
        this.button.events.onInputOut.add(onOut, this);
    }
}
