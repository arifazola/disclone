package handlers

import (
	"fmt"
	"sync"
)

var NOTIFEVENTS string = "notif_event"
var USERJOINEVENTS string = "user_join_event"

type Client struct {
	ID     string
	NotifEvents chan any
	UserJoinEvents chan any
}

type Hub struct {
	mu      sync.RWMutex
	Clients map[string]*Client
}

func NewHub() *Hub {
	return &Hub{
		Clients: make(map[string]*Client),
	}
}

func (h *Hub) Add(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	h.Clients[client.ID] = client
}

func (h *Hub) Remove(id, clientType string) {
	fmt.Println("removing hub")
	h.mu.Lock()
	defer h.mu.Unlock()

	client := h.Clients[id]
	if client == nil {
		return
	}

	fmt.Println("client", client.ID)

	if clientType == NOTIFEVENTS{
		client.NotifEvents = nil
	} else {
		client.UserJoinEvents = nil
	}

	if client.NotifEvents == nil && client.UserJoinEvents == nil {
		delete(h.Clients, id)
	}
}