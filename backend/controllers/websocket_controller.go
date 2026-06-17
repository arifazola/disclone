package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/arifazola/disclone/backend/models"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// Cek origin (izinkan semua origin untuk development)
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[string]*models.WebsocketClientModel)

func HandleWebSocket(c *gin.Context) {
	channelID := c.Param("channel_id")
	userID := c.Param("user_id")

	fmt.Println("websocket channel ID", channelID)
	conn, err := wsupgrader.Upgrade(c.Writer, c.Request, nil)
	existingClient := clients[channelID]

	var userMap = make(map[string]*models.Clients)
	client := &models.Clients{
		Conn: conn,
		SDPOffeer: "",
	}
	userMap[userID] = client 

	if existingClient == nil {
		newClient := []*websocket.Conn{conn}
		
		clients[channelID] = &models.WebsocketClientModel{User: userMap, Queue: newClient}
	} else {
		existingClient.User = userMap
		// existingClient.Clients = append(existingClient.Clients, conn)
		existingClient.Queue = append(existingClient.Queue, conn)
	}

	if err != nil {
		fmt.Println("Failed to upgrade connection to websocket:", err)
		return
	}
	defer conn.Close()



	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Failed to read message:", err)
			break
		}

		fmt.Printf("Message accepted: %s\n", p)

		var websocketMessageModel models.WebsocketMessageModel

		jsonErr := json.Unmarshal(p, &websocketMessageModel)

		if jsonErr != nil {
			fmt.Println("Failed to read message:", err)
			break
		}

		cl := clients[channelID]

		cl.User[userID].SDPOffeer = websocketMessageModel.Data.SDP

		fmt.Println("existing user", cl.User[userID].SDPOffeer)
		
		err = conn.WriteMessage(messageType, p)
		if err != nil {
			fmt.Println("Failed to write message:", err)
			break
		}
	}
}
