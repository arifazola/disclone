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

var userMap = make(map[string]*models.Clients)

func HandleWebSocket(c *gin.Context) {
	channelID := c.Param("channel_id")
	userID := c.Param("user_id")

	fmt.Println("websocket channel ID", channelID)
	conn, err := wsupgrader.Upgrade(c.Writer, c.Request, nil)
	existingClient := clients[channelID]

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

	cl := clients[channelID]

	fmt.Println("user leng", len(cl.User))
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Failed to read message:", err)
			break
		}

		var websocketMessageModel models.WebsocketMessageModel

		err = json.Unmarshal(p, &websocketMessageModel)

		if err != nil {
			fmt.Println("Failed to read message:", err)
			break
		}

		cl := clients[channelID]

		cl.User[userID].SDPOffeer = websocketMessageModel.Data.SDP

		for userids, clients := range cl.User {
			if(userids == userID){
				break
			}

			websocketResponseModel := &models.WebsocketResponseModel{
				Type: websocketMessageModel.Type,
				SDP: clients.SDPOffeer,
			}

			stringifyResponse, err := json.Marshal(websocketResponseModel)
			if err != nil {
				fmt.Println("Failed to stringify json response")
				break
			}

			err = clients.Conn.WriteMessage(messageType, []byte(stringifyResponse)) 

			if err != nil {
				fmt.Println("Failed to write message to:", userids , err)
				break
			}
		}
	}
}
