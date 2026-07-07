package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"slices"
	"time"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/models"
	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

var chatClients = make(map[string][]*websocket.Conn)


type WebsocketController struct {
	ChatService *services.ChatService
}

func(controller *WebsocketController) HandleWebSocketCall(c *gin.Context) {
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

	fmt.Println("channelID", channelID)
	fmt.Println("data", clients[channelID].User)

	fmt.Println("total client upper", len(clients[channelID].User))

	if err != nil {
		fmt.Println("Failed to upgrade connection to websocket:", err)
		return
	}
	defer conn.Close()

	var participants []string

	if(len(clients[channelID].User) <= 1){

		websocketResponseModel := &models.WebsocketIceCandidateResponseModel{
			Type: "waiting",
		}

		stringifyResponse, err := json.Marshal(websocketResponseModel)
		if err != nil {
			fmt.Println("Failed to stringify json response")
			return
		}
		err = conn.WriteMessage(websocket.TextMessage, []byte(stringifyResponse)) 

		if err != nil {
			fmt.Println("Failed to write message to:", userID , err)
			return
		}
	} else {
		for user, _ := range clients[channelID].User{
			if user == userID {
				continue
			}
			participants = append(participants, user)
		}
		websocketResponseModel := &models.WebsocketIceCandidateResponseModel{
			Type: "should_call",
			Participants: &participants,
		}

		stringifyResponse, err := json.Marshal(websocketResponseModel)
		if err != nil {
			fmt.Println("Failed to stringify json response")
			return
		}
		err = conn.WriteMessage(websocket.TextMessage, []byte(stringifyResponse)) 

		if err != nil {
			fmt.Println("Failed to write message to:", userID , err)
			return
		}
	}


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

		fmt.Println("websocket message received from", websocketMessageModel.UserID)

		fmt.Println("message type", websocketMessageModel.Type)

		cl := clients[channelID]

		if websocketMessageModel.Data != nil {
			sdp := websocketMessageModel.Data.SDP
			cl.User[userID].SDPOffeer = sdp
		}

		if(websocketMessageModel.Type == "offer"){
			websocketResponseModel := &models.WebsocketResponseModel{
				Type: websocketMessageModel.Type,
				SDP: websocketMessageModel.Data.SDP,
				Sender: userID,
			}

			stringifyResponse, err := json.Marshal(websocketResponseModel)
			if err != nil {
				fmt.Println("Failed to stringify json response")
				break
			}

			offerRecipient := cl.User[websocketMessageModel.OfferFor]

			fmt.Println("sending ", websocketResponseModel.Type, " to", )

			err = offerRecipient.Conn.WriteMessage(messageType, []byte(stringifyResponse)) 

			if err != nil {
				fmt.Println("Failed to write message to:", websocketMessageModel.OfferFor , err)
				break
			}
		}

		if(websocketMessageModel.Type == "answer"){
			websocketResponseModel := &models.WebsocketResponseModel{
				Type: websocketMessageModel.Type,
				SDP: websocketMessageModel.Data.SDP,
				Sender: userID,
			}

			stringifyResponse, err := json.Marshal(websocketResponseModel)
			if err != nil {
				fmt.Println("Failed to stringify json response")
				break
			}

			fmt.Println("sending ", websocketResponseModel.Type, " to", websocketResponseModel.Sender)

			activeChannel := clients[channelID]
			offerSender := activeChannel.User[websocketMessageModel.Sender]
			err = offerSender.Conn.WriteMessage(messageType, []byte(stringifyResponse)) 

			if err != nil {
				fmt.Println("Failed to write message to:", websocketMessageModel.Sender , err)
				break
			}
		}

		if(websocketMessageModel.Type == "ice_candidate"){
			for userids, clients := range cl.User {
				fmt.Println("message is ice candidate")
				var iceCandidateData models.IceCandidateModel
				stringifyData, err := json.Marshal(websocketMessageModel.ICECandidateData)
				if err != nil {
					fmt.Println("error stringify ice candidate data", err)
					break
				}

				fmt.Println("message data", websocketMessageModel.ICECandidateData)
				fmt.Println("stringify data", string(stringifyData))


				err = json.Unmarshal(stringifyData, &iceCandidateData)
				if err != nil {
					fmt.Println("error parsing ice candidate model", err)
					break
				}



				websocketResponseModel := &models.WebsocketIceCandidateResponseModel{
					Type: websocketMessageModel.Type,
					Data: iceCandidateData,
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
}

func(controller *WebsocketController) HandleWebSocketChat(c *gin.Context) {
	chatID := c.Param("chat_id")
	friendUsername := c.Param("username")

	fmt.Println("websocket channel ID", chatID)
	conn, err := wsupgrader.Upgrade(c.Writer, c.Request, nil)
	existingClient := chatClients[chatID]

	if existingClient == nil {
		fmt.Println("No existing client")
		newClient := []*websocket.Conn{conn}
		
		chatClients[chatID] = newClient
	} else {
		fmt.Println("has existing client")
		existingClient = append(existingClient, conn)

		chatClients[chatID] = existingClient
	}

	if err != nil {
		fmt.Println("Failed to upgrade connection to websocket:", err)
		return
	}

	fmt.Println("Upper chat clients", len(chatClients[chatID]))
	defer closeConnection(conn, chatID)

	err = conn.WriteMessage(websocket.TextMessage, []byte("connected")) 

	if err != nil {
		fmt.Println("Failed to write message to:", chatID , err)
		return
	}

	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Failed to read message:", err)
			break
		}


		var websocketChatModel models.WebsocketChatModel

		err = json.Unmarshal(p, &websocketChatModel)

		if err != nil {
			fmt.Println("Failed to read message:", err)
			break
		}

		fmt.Println("websocket message received from", websocketChatModel.UserID, ": ", websocketChatModel.Message)

		fmt.Println("chat client", len(chatClients[chatID]))

		id := uuid.New().String()
		addMessageParam := db.AddMessageParams{
			ChatID: chatID,
			ID: id,
			Sender: websocketChatModel.UserID,
			Message: websocketChatModel.Message,
			Timestamp: time.Now().Unix(),

		}

		err = controller.ChatService.AddMessage(c, addMessageParam, friendUsername)

		if err != nil {
			fmt.Println("failed to save message", err)
			conn.WriteMessage(messageType, []byte("FAILED"))
			break
		}

		for _, client := range chatClients[chatID] {
			if(conn != client){
				stringifyMessage, err := json.Marshal(websocketChatModel)
				
				if err == nil {
					log.Println("Failed to stringify websocket chat data", err)
				}
				err = client.WriteMessage(messageType, stringifyMessage)

				if err != nil {
					fmt.Println("Failed to write message to:", chatID, err)
					break
				}
			}
		}
	}
}

func closeConnection(conn *websocket.Conn, chatID string){
	existing := chatClients[chatID]
	fmt.Println("connection closed")
	existing = slices.DeleteFunc(existing, func(client *websocket.Conn) bool {
		return client == conn
	})

	fmt.Println("len after close", len(clients))

	chatClients[chatID] = existing

	conn.Close()
}