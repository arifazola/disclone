package models

type WebsocketMessageModel struct {
	UserID           string             `json:"userid"`
	Type             string             `json:"type"`
	Sender           string             `json:"sender"`
	Data             *SDPData           `json:"data"`
	ICECandidateData *IceCandidateModel `json:"ice_candidate_data"`
}

type SDPData struct {
	SDP  string `json:"sdp"`
	Type string `json:"type"`
}