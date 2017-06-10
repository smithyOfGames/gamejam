package main

type Vec2 struct {
	X float32
	Y float32
}

const (
	minPlayerPosY float32 = 20
	maxPlayerPosY float32 = 365
)

type Player struct {
	Id      string
	Name    string
	Pos     Vec2
	Vel     Vec2
	TargetY float32
}

func (self *Player) Update(dt float32) {
	self.Pos.X += self.Vel.X * dt
	self.Pos.Y += self.Vel.Y * dt

	if self.Pos.Y < minPlayerPosY {
		self.Pos.Y = minPlayerPosY
	}

	if self.Pos.Y > maxPlayerPosY {
		self.Pos.Y = maxPlayerPosY
	}

}
