'use strict';

class Game {

    constructor() {
        this.playerName = "player123";
        this.playerRoad = null;
        this.joystick = null;
        this.buttonA = null;
        this.keyboard = null;
        this.fireButton = null;
        this.points = new Set();
        this.players = new Map();
    }

    create() {
        this.initNetwork();

        this.initVirtualGamepad();
        this.playerRoad = new Road(pgame);

        this.socket.emit("joinNewPlayer", this.playerName);

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

        if (this.buttonA.isDown) {
            this.fire();
        }

        currentPlayer.update();
        let playerVel = currentPlayer.vel;

        this.playerRoad.vel = playerVel;
        this.playerRoad.update();

        for (let p of this.points) {
            p.vel = playerVel; // все предметы на дороге (движутся со скоростью игрока ему навстресу)
            p.update(); // TODO передать скорость дороги
        }

        for (let p of this.players.values()) {
            p.update();
        }
    }

    initNetwork() {
        this.socket = io.connect(window.location.host, {path: "/ws/", transports: ['websocket']});
        this.socket.on('tick', (msg)=>this.onTick(msg));
        this.socket.on('playerDisconnected', (msg)=>this.onPlayerDisconnected(msg));
    }

    onConnect() {
        if (this.player) {
            this.player.id = this.socket.id;
        }
    }

    onTick(msg) {
        if (!this.player) {
            return;
        }

        let tickInfo = JSON.parse(msg);
        for (let p of tickInfo.players) {
            if (p.id === this.player.id) {
                this.player.posX = p.pos.x;
                this.player.sprite.y = p.pos.y;
            }
        }
    }

    fire() {
        let msg = {
            x: 700,
            y: this.players.get(this.socket.id).getTargetY()
        };
        log('click to ' + JSON.stringify(msg));
        this.socket.emit("move", JSON.stringify(msg));

        this.addPoint(700, this.players.get(this.socket.id).getTargetY());
    }

    onTick(msg) {
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
    }

    initVirtualGamepad() {
        let gamepad = pgame.plugins.add(Phaser.Plugin.VirtualGamepad);
        this.joystick = gamepad.addJoystick(90, pgame.height - 90, 0.75, 'gamepad');
        this.buttonA = gamepad.addButton(pgame.width - 90, pgame.height - 90, 0.75, 'gamepad');
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

    addPoint(x, y) {
        let p = new ClickPoint(this, x, y)
        this.points.add(p);
    }

    delPoint(p) {
        this.points.delete(p);
    }
}
