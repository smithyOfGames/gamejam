'use strict';

class Game {

    constructor() {
        this.playerRoad = null;
        this.keyboard = null;
        this.fireButton = null;
        this.points = new Set();
        this.players = new Map();
    }

    create() {
        this.initNetwork();

        this.playerRoad = new Road(pgame);

        this.initControls();

        this.socket.emit("joinNewPlayer", userName);
        log("Игрок " + userName + " вышел в плаванье");

        this.keyboard = pgame.input.keyboard.createCursorKeys();
        this.fireButton = pgame.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.fireButton.onDown.add(this.fire, this);

        let btnDown = pgame.input.keyboard.addKey(Phaser.Keyboard.S);
        btnDown.onDown.add(()=>this.socket.emit("move", "down"), this);
        btnDown.onUp.add(()=>this.socket.emit("move", "stop"), this);

        let btnUp = pgame.input.keyboard.addKey(Phaser.Keyboard.W);
        btnUp.onDown.add(()=>this.socket.emit("move", "up"), this);
        btnUp.onUp.add(()=>this.socket.emit("move", "stop"), this);
    }

    update() {
        let currentPlayer = this.players.get(this.socket.id);
        if (currentPlayer === undefined) {
            return;
        }

        for (let p of this.players.values()) {
            p.update(currentPlayer);
        }

        let playerVel = currentPlayer.vel;
        this.playerRoad.vel = playerVel;
        this.playerRoad.update();

        for (let p of this.points) {
            p.vel = playerVel; // все предметы на дороге (движутся со скоростью игрока ему навстресу)
            p.update(); // TODO передать скорость дороги
        }

    }

    initNetwork() {
        this.socket = io.connect(window.location.host, {path: "/ws/", transports: ['websocket']});
        this.socket.on('tick', (msg)=>this.onTick(msg));
        this.socket.on('playerDisconnected', (msg)=>this.onPlayerDisconnected(msg));
        this.socket.on('win', (playerId)=>this.onWin(playerId));
    }

    initControls() {
        let buttonUp = pgame.add.sprite(40, pgame.height - 160, 'button_w');
        buttonUp.inputEnabled = true;
        buttonUp.events.onInputDown.add(()=>this.socket.emit("move", "up"), this);

        let buttonDown = pgame.add.sprite(40, pgame.height - 80, 'button_s');
        buttonDown.inputEnabled = true;
        buttonDown.events.onInputDown.add(()=>this.socket.emit("move", "down"), this);

        let buttonFire = pgame.add.sprite(pgame.width - 280, pgame.height - 120, 'button_space');
        buttonFire.inputEnabled = true;
        buttonFire.events.onInputDown.add(this.fire, this);

        let onStopPressing = function (target) {
            this.socket.emit("move", "stop");
        };
        buttonUp.events.onInputUp.add(onStopPressing, this);
        buttonDown.events.onInputUp.add(onStopPressing, this);
    }

    fire() {
        //var distance = 700;

        let maxPos = 0
        var player = this.players.get(this.socket.id);
        for (let p of this.players.values()) {
            if (maxPos < p.posX) {
                maxPos = p.posX;
            }
        }

        log('fire player ' + this.socket.id);
        //var postition = [player.posX, player.getTargetY()];
        //this.throwBarrel(player.sprite.x, player.sprite.y, player.sprite.x + distance, player.sprite.y);
        this.socket.emit("fire", JSON.stringify({
            //x: postition[0] + distance,
            //y: postition[1],
            x: maxPos + 600,
            y: player.getTargetY(),
            type: 'barrel',
        }));
        log("fire from " + player.posX);
    }

    onTick(msg) {
        //log(msg);
        let tickInfo = JSON.parse(msg);
        for (let p of tickInfo.players) {
            if (this.players.has(p.id)) {
                this.players.get(p.id).posX = p.pos.x;
                this.players.get(p.id).sprite.y = p.pos.y;
            } else {
                console.log(p);
                this.onPlayerConnected(p.id, p.name, p.color);
            }
        }

        if (tickInfo.bullets) {
            let currentPlayer = this.players.get(this.socket.id);
            for (let bullet of tickInfo.bullets) {
                let player = this.players.get(bullet.player);
                if (player) {
                    //if (player != currentPlayer) {
                        var targetX = bullet.target.x - player.posX;
                        var targetY = bullet.target.y;

                        this.throwBarrel(player.sprite.x, player.sprite.y, targetX, targetY);
                    //}
                    log(player.id + " -> fire to " + bullet.target.x);
                }
            }
        }
    }

    onPlayerConnected(playerId, playerName, color) {
        log("connected player, id: " + playerId);
        let p = new Player(pgame, playerId, playerName, color);
        this.players.set(playerId, p);
    }

    onPlayerDisconnected(playerId) {
        log("disconnected player, id: " + playerId);

        if (this.players.has(playerId)) {
            this.players.get(playerId).sprite.kill();
            this.players.delete(playerId);
        }
    }

    onWin(playerId) {
        if (playerId === this.socket.id) {
            console.log("vic");
            pgame.state.start("Victory");
        } else {
            console.log("Lose");
            pgame.state.start("Lose");
        }
    }

    throwBarrel(fromX, fromY, toX, toY) {
        log("make barell at " + toX);
        let currentPlayer = this.players.get(this.socket.id);
        let p = new ClickPoint(this, this.players, currentPlayer, fromX, fromY, toX, toY)
        this.points.add(p);
    }

    delPoint(p) {
        this.points.delete(p);
    }
}
