package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ChatParticipantRepository interface {
	InitChatParticipants(ctx context.Context, arg db.InitChatParticipantsParams) error
	GetChatIDFromParticipants(ctx context.Context, arg db.GetChatIDFromParticipantsParams) (string, error)
	GetChatIDFromOneParticipant(ctx context.Context, participants string) (string, error)
}