'use strict'

class Game {
	constructor(contanerName) {
		log('constructor')

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

		this.player = null;
		this.playerRoad = null;

		this.points = new Set();
	}

	initNetwork() {
		this.socket = io.connect(window.location.host, {path: "/ws/", transports: ['websocket']});

		this.socket.on('tick', this.onTick);
		this.socket.on('playerConnected', this.onPlayerConnected);
		this.socket.on('playerDisconnected', this.onPlayerDisconnected);
	}

	preload() {
		this.pg.time.advancedTiming = true;
		this.pg.time.desiredFps = 60;

		this.pg.load.image('star', 'assets/images/star.png');
		this.pg.load.image('road', 'assets/images/road.png');
		this.pg.load.image('car', 'assets/images/car60.png');

		 this.pg.load.audio('taverna', ['assets/audio/taverna.mp3', 'assets/audio/taverna.ogg']);
		 this.pg.load.audio('game', ['assets/audio/game.mp3', 'assets/audio/game.ogg']);
	}

	create() {
		this.playerRoad = new Road(this.pg);

		this.pg.input.onDown.add(this.onInputDown, this);
		this.player = new Player(this.pg);

		var music = this.pg.add.audio('game');
		music.play();

		this.initNetwork()

		log("game created")
	}

	update() {
		let y = Math.max(15, Math.min(365, this.pg.input.y));
		this.player.setTargetDirection(y);

		this.player.update();
		this.playerRoad.update();
		for (let p of this.points) {
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
		//log("tick " + msg);
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
