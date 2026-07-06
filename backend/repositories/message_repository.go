package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type MessageRepository interface {
	GetMessages(ctx context.Context, chatID string) ([]db.Message, error)
}