package main

import (
	log "github.com/smithyOfGames/gamejam/consolelog"

	"net/http"

	"github.com/googollee/go-socket.io"
)

func main() {
	log.Info("start")
	defer log.Info("stop")

	log.SetLogLevel(log.DEBUG)

	server, err := socketio.NewServer(nil)
	if err != nil {
		panic(err)
	}

	game := NewGame(server)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Debug(r.URL.Path)
		http.ServeFile(w, r, "www"+r.URL.Path)
	})

	http.Handle("/ws/", server)

	go game.Loop()

	if err := http.ListenAndServe(":8081", nil); err != nil {
		log.Error("ListenAndServe: ", err)
		panic(err)
	}
}
