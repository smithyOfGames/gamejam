package main

type Vec2 struct {
	X float32
	Y float32
}

type Player struct {
	Id      string
	Name    string
	Pos     Vec2
	Vel     Vec2
	TargetY float32
}

func (self *Player) Update(dt float32) {
	self.Pos.X += self.Vel.X * dt
}
