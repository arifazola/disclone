package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type MessageRepositoryImpl struct {
	Queries *db.Queries
}

func (repo *MessageRepositoryImpl) GetMessages(ctx context.Context, chatID string) ([]db.Message, error){
	return repo.Queries.GetMessages(ctx, chatID)
}