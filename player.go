package main

type Vec2 struct {
	X float32
	Y float32
}

const (
	minPlayerPosY float32 = 40
	maxPlayerPosY float32 = 340
)

var availableColors []string = []string{"red", "blue", "green", "yellow"}

type Player struct {
	Id      string
	Name    string
	Pos     Vec2
	Vel     Vec2
	TargetY float32
	Color   string
}

func NewPlayer(socketId string, playerName string, posY float32, colorIndex int) (player *Player) {
	player = &Player{
		Id:      socketId,
		Name:    playerName,
		Vel:     Vec2{X: 250, Y: 0},
		Pos:     Vec2{X: 80, Y: posY},
		TargetY: 100,
		Color:   availableColors[colorIndex],
	}

	return
}

func (self *Player) Move(msg string) {
	switch msg {
	case "down":
		self.Vel.Y = 30
	case "up":
		self.Vel.Y = -30
	case "stop":
		self.Vel.Y = 0
	}
}

func (self *Player) Update(dt float32) {
	self.Pos.X += self.Vel.X * dt
	self.Pos.Y += self.Vel.Y

	self.Vel.Y = 0

	if self.Pos.Y < minPlayerPosY {
		self.Pos.Y = minPlayerPosY
	}

	if self.Pos.Y > maxPlayerPosY {
		self.Pos.Y = maxPlayerPosY
	}

}
