package models

import "github.com/gorilla/websocket"

type WebsocketClientModel struct {
	Clients []*websocket.Conn
}
