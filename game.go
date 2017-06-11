package main

import (
	"encoding/json"
	"sync"
	"time"

	log "smithyOfGames/gamejam/consolelog"

	"github.com/googollee/go-socket.io"
)

const (
	_GAME_ROOM      = "game"
	maxCountPlayers = 4
	gameDuration    = 60
)

var playersLock = sync.Mutex{}
var bulletsLock = sync.Mutex{}

var timer = time.NewTimer(time.Second * gameDuration)

type Game struct {
	server  *socketio.Server
	players map[socketio.Socket]*Player
	bullets []Bullet
}

type Pos struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type PlayerInfo struct {
	Id    string `json:"id"`
	Pos   Pos    `json:"pos"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

type Bullet struct {
	Player string `json:"player"`
	Type   string `json:"type"`
	Target Pos    `json:"target"`
}

type TickInfo struct {
	TickId  int64        `json:"tickId"` // time?
	Players []PlayerInfo `json:"players"`
	Bullets []Bullet     `json:"bullets"`
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
		playerCount := len(self.players)
		if playerCount == maxCountPlayers {
			log.Debug("sorry, max player count")
			return
		}

		//TODO: Перезапустить таймер

		posY := float32(playerCount+1) * 80.0
		player := NewPlayer(so.Id(), playerName, posY, playerCount+1)
		log.Debug("set player id: ", so.Id())

		if playerCount > 0 {
			// определяем отстающего
			var minX float32 = float32(100500 * 100500)
			for _, p := range self.players {
				if minX > p.Pos.X {
					minX = p.Pos.X
				}
			}
			player.Pos.X = minX // новый пользователь на уровне отстающего
		}

		func() {
			playersLock.Lock()
			defer playersLock.Unlock()
			self.players[so] = player
		}()

		so.Join(_GAME_ROOM)

		go func() {
			<-timer.C
			so.BroadcastTo(_GAME_ROOM, "win", player.Id)
			so.Emit("win", player.Id)
		}()
	})

	so.On("move", func(msg string) {
		//log.Info("emit:", so.Emit("chat message", msg))
		//so.BroadcastTo("chat", "chat message", msg)
		log.Infof("move cmd: %v", msg)
		p := self.players[so]
		p.Move(msg)
	})

	so.On("collision", func(msg string) {
		log.Infof("collision type: %v", msg)
		p := self.players[so]
		switch msg {
		case "barrel":
			go func() {
				<-time.After(1000 * time.Millisecond)
				p.Vel.X = 250
			}()
			p.Vel.X = 100
		case "island":
			p.Vel.X = 0
		}
	})

	so.On("fire", func(msg string) {
		log.Info("fire from ", so.Id())

		info := struct {
			X    int    `json:"x"`
			Y    int    `json:"y"`
			Type string `json:"type"`
		}{}

		err := json.Unmarshal([]byte(msg), &info)
		if err != nil {
			log.Error(err)
			return
		}

		func() {
			bulletsLock.Lock()
			defer bulletsLock.Unlock()
			self.bullets = append(self.bullets, Bullet{
				Player: so.Id(),
				Type:   info.Type,
				Target: Pos{info.X, info.Y},
			})
		}()
	})

	so.On("disconnection", func() {
		log.Info("on disconnect")

		// TODO сделать безопасно (параллельный доступ!!!)
		player, ok := self.players[so]
		if ok {
			func() {
				playersLock.Lock()
				defer playersLock.Unlock()
				delete(self.players, so)
			}()

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

		for _, p := range self.players {
			p.Update(deltaTime)
		}

		players = players[:0]
		func() {
			playersLock.Lock()
			defer playersLock.Unlock()

			for _, p := range self.players {
				players = append(players, PlayerInfo{
					Id:    p.Id,
					Pos:   Pos{int(p.Pos.X), int(p.Pos.Y)},
					Name:  p.Name,
					Color: p.Color,
				})
			}
		}()

		var msg []byte
		func() {
			bulletsLock.Lock()
			defer bulletsLock.Unlock()

			msg, _ = json.Marshal(TickInfo{
				TickId:  0,
				Players: players,
				Bullets: self.bullets,
			})

			if len(self.bullets) > 0 {
				log.Debug(self.bullets)
			}

			self.bullets = self.bullets[:0]

		}()

		self.server.BroadcastTo(_GAME_ROOM, "tick", string(msg))
	}
}
