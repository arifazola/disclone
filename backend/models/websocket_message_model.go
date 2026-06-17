package models

type WebsocketMessageModel struct {
	UserID string  `json:"userid"`
	Type   string  `json:"type"`
	Data   SDPData `json:"data"`
}

type SDPData struct {
	SDP  string `json:"sdp"`
	Type string `json:"type"`
}