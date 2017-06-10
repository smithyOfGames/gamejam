package main

import (
	"encoding/json"
	"time"

	log "smithyOfGames/gamejam/consolelog"

	"github.com/googollee/go-socket.io"
)

const (
	_GAME_ROOM = "game"
	maxCountPlayers int = 4
)

type Game struct {
	server  *socketio.Server
	players map[socketio.Socket]*Player
}

type Pos struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type PlayerInfo struct {
	Id  string `json:"id"`
	Pos Pos    `json:"pos"`
	Name string `json:"name"`
	Color string `json:"color"`
}

type TickInfo struct {
	TickId  int64        `json:"tickId"` // time?
	Players []PlayerInfo `json:"players"`
}

func NewGame(server *socketio.Server) *Game {
	game := &Game{server: server, players: map[socketio.Socket]*Player{}}

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
	so.On("joinNewPlayer", func(playerName string) {
		if currentPlayerNumber == maxCountPlayers {
			return
		}

		player := NewPlayer(so.Id(), playerName)
		log.Debug("set player id: ", so.Id())
		self.players[so] = player

		so.Join(_GAME_ROOM)
	})

	so.On("move", func(msg string) {
		//log.Info("emit:", so.Emit("chat message", msg))
		//so.BroadcastTo("chat", "chat message", msg)
		log.Infof("move cmd: %v", msg)
		p := self.players[so]
		p.Move(msg)
	})

	so.On("disconnection", func() {
		log.Info("on disconnect")

		// TODO сделать безопасно (параллельный доступ!!!)
		player, ok := self.players[so]
		if ok {
			delete(self.players, so)
			so.BroadcastTo(_GAME_ROOM, "playerDisconnected", player.Id)
		}
	})
}

func (self *Game) Loop() {
	ticker := time.NewTicker(time.Millisecond * 100)

	prevTick := time.Now()

	players := []PlayerInfo{}

	for t := range ticker.C {

		deltaTime := float32(t.Sub(prevTick).Seconds())
		prevTick = t

		players = players[:0]

		for _, p := range self.players {
			p.Update(deltaTime)
		}

		//msg := fmt.Sprintf("%v", deltaTime)
		//log.Debugf("tick %v", msg)
		for _, p := range self.players {
			players = append(players, PlayerInfo{
				Id:  p.Id,
				Pos: Pos{int(p.Pos.X), int(p.Pos.Y)},
				Name: p.Name,
				Color: p.Color,
			})
		}

		msg, _ := json.Marshal(TickInfo{
			TickId:  0,
			Players: players,
		})
		self.server.BroadcastTo(_GAME_ROOM, "tick", string(msg))

		//time.Sleep(300 * time.Millisecond)
	}
}
