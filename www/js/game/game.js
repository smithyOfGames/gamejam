'use strict'

class Game {
	constructor(contanerName, playerName) {
		log('constructor')

		this.initNetwork()

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
		this.player = null;
		this.playerRoad = null;

		this.points = new Set();

	}

	initNetwork() {
		this.socket = io.connect(window.location.host, {path: "/ws/", transports: ['websocket']});
		this.socket.on('connect', () => this.onConnect());
		this.socket.on('tick', (msg)=>this.onTick(msg));
		this.socket.on('playerConnected', (msg)=>this.onPlayerConnected(msg));
		this.socket.on('playerDisconnected', (msg)=>this.onPlayerDisconnected(msg));
	}

	onConnect() {
		setTimeout(10); // время для загрузки фазера
	}

	preload() {
		this.pg.time.advancedTiming = true;
		this.pg.time.desiredFps = 60;

	   //this.pg.load.image('sky', 'assets/sky.png');
	   //this.pg.load.image('ground', 'assets/platform.png');
		this.pg.load.image('star', 'assets/star.png');
		this.pg.load.image('road', 'assets/road.png');
		this.pg.load.image('car', 'assets/car60.png');
	   //this.pg.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	}

	create() {
		this.playerRoad = new Road(this.pg);
		this.pg.input.onDown.add(this.onInputDown, this);
		this.player = new Player(this.pg, this.socket.id, this.playerName);
		this.socket.emit("setPlayerName", this.player.name)

		log("setPlayerName " + this.playerName)
		log("game created")
	}

	update() {
		let y = Math.max(15, Math.min(365, this.pg.input.y));
		this.player.setTargetDirection(y);
		this.player.update();
		let playerVel = this.player.vel;

		this.playerRoad.vel = playerVel;
		this.playerRoad.update();

		for (let p of this.points) {
			p.vel = playerVel // все предметы на дороге (движутся со скоростью игрока ему навстресу)
			p.update(); // TODO передать скорость дороги
		}
	}

	render() {
	   this.pg.debug.cameraInfo(this.pg.camera, 8, 500);
		this.pg.debug.text('fps: ' + (this.pg.time.fps || '--'), 700, 570, "#00ff00");
	}

	onInputDown(pointer) {
		// pointer will contain the pointer that activated this event
		let msg = {
			x: pointer.x,
			y: pointer.y
		}
		log('click to ' + JSON.stringify(msg))
		this.socket.emit("move", JSON.stringify(msg))

		this.addPoint(pointer.x, pointer.y);
	}

	onTick(msg) {
		log("tick " + msg);

		if (!this.player) {
			return;
		}

		let tickInfo = JSON.parse(msg);
		for (let p of tickInfo.players) {
			if (p.id == this.player.id) {
				this.player.posX = p.pos.x;
			}
		}
	}

	onPlayerConnected(msg) {
		log("connected player, id: " + msg);
	}

	onPlayerDisconnected(msg) {
		log("disconnected player, id: " + msg);
	}

	addPoint(x, y) {
		let p = new ClickPoint(this, x, y)
		this.points.add(p);
	}

	delPoint(p) {
		this.points.delete(p);
	}
}
