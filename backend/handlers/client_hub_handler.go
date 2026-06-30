package handlers

import "sync"

type Client struct {
	ID     string
	Events chan any
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

func (h *Hub) Remove(id string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	delete(h.Clients, id)
}