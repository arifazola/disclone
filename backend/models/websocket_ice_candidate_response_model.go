package models

import "github.com/arifazola/disclone/backend/internal/db"

type WebsocketIceCandidateResponseModel struct {
	Type         string
	Data         IceCandidateModel
	Participants *[]db.GetUsersByIDsRow
}