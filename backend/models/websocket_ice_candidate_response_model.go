package models

type WebsocketIceCandidateResponseModel struct {
	Type         string
	Data         IceCandidateModel
	Participants *[]string
}