'use strict';

class Game {
    constructor() {
        this.socket = io.connect(window.location.host, {path: "/ws/", transports: ['websocket']});
        this.socket.on('connect', () => this.onConnect());
        this.socket.on('tick', (msg)=>this.onTick(msg));
        this.socket.on('playerConnected', (msg)=>this.onPlayerConnected(msg));
        this.socket.on('playerDisconnected', (msg)=>this.onPlayerDisconnected(msg));

        this.playerName = "player123";
        this.player = null;
        this.playerRoad = null;
        this.joystick = null;
        this.buttonA = null;
        this.keyboard = null;
        this.fireButton = null;
        this.points = new Set();
        this.players = new Map();

        log("Game - constructor()");
    }

    create() {
        let gamepad = pgame.plugins.add(Phaser.Plugin.VirtualGamepad);
        this.joystick = gamepad.addJoystick(90, pgame.height - 90, 0.75, 'gamepad');
        this.buttonA = gamepad.addButton(pgame.width - 90, pgame.height - 90, 0.75, 'gamepad');

        this.playerRoad = new Road();
        this.player = new Player(this.socket.id);

        this.socket.emit("setPlayerName", this.player.name);

        this.keyboard = pgame.input.keyboard.createCursorKeys();
        this.fireButton = pgame.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.fireButton.onDown.add(this.fire, this);

        let btnDown = pgame.input.keyboard.addKey(Phaser.Keyboard.F);
        btnDown.onDown.add(()=>this.socket.emit("move", "down"), this);
        btnDown.onUp.add(()=>this.socket.emit("move", "stop"), this);

        let btnUp = pgame.input.keyboard.addKey(Phaser.Keyboard.R);
        btnUp.onDown.add(()=>this.socket.emit("move", "up"), this);
        btnUp.onUp.add(()=>this.socket.emit("move", "stop"), this);

        log("Game - create()");
    }

    update() {
        let velocity = 0;

        if (this.joystick.properties.up) {
                velocity = -1;
            }
        if (this.joystick.properties.down) {
            velocity = 1;
        }

        if (this.buttonA.isDown) {
            this.fire();
        }

        this.player.update();
        let playerVel = this.player.vel;

        this.playerRoad.vel = playerVel;
        this.playerRoad.update();

        for (let p of this.points) {
            p.vel = playerVel; // все предметы на дороге (движутся со скоростью игрока ему навстресу)
            p.update(); // TODO передать скорость дороги
        }

        for (let p of this.players.values()) {
            p.update();
        }

        log("Game - update()");
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

    onPlayerConnected(msg) {
        log("connected player, id: " + msg);
        let info = JSON.parse(msg);
        let p = new Player(pgame, info.id, "user");
        this.players.set(info.id, p);
    }

    onPlayerDisconnected(msg) {
        log("disconnected player, id: " + msg);
        this.players.delete(msg);
    }

    fire() {
        let msg = {
        x: 700,
        y: this.player.getTargetY()
        };
        log('click to ' + JSON.stringify(msg));
        this.socket.emit("move", JSON.stringify(msg));

        this.addPoint(700, this.player.getTargetY());
    }

    addPoint(x, y) {
        let p = new ClickPoint(this, x, y)
        this.points.add(p);
    }

    delPoint(p) {
        this.points.delete(p);
    }
}
