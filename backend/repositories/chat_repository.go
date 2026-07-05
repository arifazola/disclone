package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ChatRepository interface {
	InitChat(ctx context.Context, id string) error
	AddMessage(ctx context.Context, arg db.AddMessageParams) error
}