'use strict';

class Game {
	constructor(contanerName, playerName) {
		log('constructor');
		this.pg = new Phaser.Game(
			800, 600,
			Phaser.AUTO,
			contanerName,
			{
				preload: ()=> this.preload(),
				create: ()=> this.create(),
				update: ()=> this.update(),
				render: ()=> this.render()
			}
		);

		this.playerName = playerName;
		this.playerRoad = null;
		this.joystick = null;
		this.buttonA = null;
		this.keyboard = null;
		this.fireButton = null;
		this.points = new Set();
		this.players = new Map();
	}

	initNetwork() {
		this.socket = io.connect(window.location.host, {path: "/ws/", transports: ['websocket']});
		this.socket.on('tick', (msg)=>this.onTick(msg));
		this.socket.on('playerDisconnected', (msg)=>this.onPlayerDisconnected(msg));
	}

	preload() {
		this.pg.time.advancedTiming = true;
		this.pg.time.desiredFps = 60;

        this.pg.load.atlas('gamepad', 'assets/virtualjoystick/atlas.png', 'assets/virtualjoystick/atlas.json');
		this.pg.load.image('barrel', 'assets/barrel.png');
		this.pg.load.image('water', 'assets/water.png');
		this.pg.load.image('red', 'assets/ship2_red.png');
		this.pg.load.image('blue', 'assets/ship2_blue.png');
		this.pg.load.image('green', 'assets/ship2_green.png');
		this.pg.load.image('yellow', 'assets/ship2_yellow.png');

		this.pg.load.audio('taverna', ['assets/audio/taverna.mp3', 'assets/audio/taverna.ogg']);
		this.pg.load.audio('game', ['assets/audio/game.mp3', 'assets/audio/game.ogg']);
	}

	create() {
        this.initNetwork();

		let music = this.pg.add.audio('game');
		music.play();

        this.initVirtualGamepad();
		this.playerRoad = new Road(this.pg);

		this.socket.emit("joinNewPlayer", this.playerName);

		this.keyboard = this.pg.input.keyboard.createCursorKeys();
		this.fireButton = this.pg.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.fireButton.onDown.add(this.fire, this);

		let btnDown = this.pg.input.keyboard.addKey(Phaser.Keyboard.S);
		btnDown.onDown.add(()=>this.socket.emit("move", "down"), this);
		btnDown.onUp.add(()=>this.socket.emit("move", "stop"), this);

		let btnUp = this.pg.input.keyboard.addKey(Phaser.Keyboard.W);
		btnUp.onDown.add(()=>this.socket.emit("move", "up"), this);
		btnUp.onUp.add(()=>this.socket.emit("move", "stop"), this);

		log("game created");
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

	render() {
		this.pg.debug.cameraInfo(this.pg.camera, 8, 500);
		this.pg.debug.text('fps: ' + (this.pg.time.fps || '--'), 700, 570, "#00ff00");
	}

    fire() {
        let msg = {
            x: 700,
            y: this.players.get(this.socket.id).getTargetY()
        };
        log('click to ' + JSON.stringify(msg));

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
		let gamepad = this.pg.plugins.add(Phaser.Plugin.VirtualGamepad);
		this.joystick = gamepad.addJoystick(90, this.pg.height - 90, 0.75, 'gamepad');
		this.buttonA = gamepad.addButton(this.pg.width - 90, this.pg.height - 90, 0.75, 'gamepad');
    }

	onPlayerConnected(playerId, playerName, color) {
		log("connected player, id: " + playerId);
		let p = new Player(this.pg, playerId, playerName, color);
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
