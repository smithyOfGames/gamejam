package main

import (
	"fmt"
	"time"

	log "smithyOfGames/gamejam/consolelog"

	"github.com/googollee/go-socket.io"
)

const _GAME_ROOM = "game"

type Game struct {
	server  *socketio.Server
	players map[socketio.Socket]Player
}

type PlayerInfo struct {
	Id  string
	Pos struct {
		X int
		Y int
	}
	//TargetY int
	//Vel int
}

type TickInfo struct {
	TickId  int64 // time?
	Players []PlayerInfo
}

func NewGame(server *socketio.Server) *Game {
	game := &Game{server: server, players: map[socketio.Socket]Player{}}

	server.On("connection", func(so socketio.Socket) {
		log.Info("on connection")
		game.AddPlayer(so)
	})

	server.On("error", func(so socketio.Socket, err error) {
		log.Error("error:", err)
	})

	return game
}

func (self *Game) AddPlayer(so socketio.Socket) {
	player := Player{
		Id:      fmt.Sprintf("%p", so),
		Vel:     Vec2{X: 5, Y: 0},
		Pos:     Vec2{X: 100, Y: 100},
		TargetY: 100,
	}
	self.players[so] = player

	so.Join(_GAME_ROOM)

	so.On("move", func(msg string) {
		//log.Info("emit:", so.Emit("chat message", msg))
		//so.BroadcastTo("chat", "chat message", msg)
		log.Infof("move cmd: %v", msg)
	})

	so.On("disconnection", func() {
		log.Info("on disconnect")

		// TODO сделать безопасно (параллельный доступ!!!)
		player := self.players[so]
		delete(self.players, so)
		so.BroadcastTo(_GAME_ROOM, "playerDisconnected", player.Id)
	})

	so.BroadcastTo(_GAME_ROOM, "playerConnected", player.Id)
}

func (self *Game) Loop() {
	ticker := time.NewTicker(time.Millisecond * 100)

	for t := range ticker.C {
		msg := fmt.Sprintf("%v", t)

		//log.Debugf("tick %v", msg)
		self.server.BroadcastTo(_GAME_ROOM, "tick", msg)

		//time.Sleep(300 * time.Millisecond)
	}
}
