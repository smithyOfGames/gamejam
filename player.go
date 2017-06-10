package main

type Vec2 struct {
	X float32
	Y float32
}

type Player struct {
	Id      string
	Pos     Vec2
	Vel     Vec2
	TargetY float32
}
