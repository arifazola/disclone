package models

type WebsocketChatModel struct {
	UserID  string `json:"userid"`
	Message string `json:"message"`
	ChatID  string `json:"chatid"`
}