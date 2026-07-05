package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ChatParticipantRepository interface {
	InitChatParticipants(ctx context.Context, arg db.InitChatParticipantsParams) error
}