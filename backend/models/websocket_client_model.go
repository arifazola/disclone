package models

import "github.com/gorilla/websocket"

type Clients struct {
	Conn *websocket.Conn
	SDPOffeer string
}


type WebsocketClientModel struct {
	User map[string]*Clients
	Queue []*websocket.Conn
}
