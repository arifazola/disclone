package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ChatRepositoryImpl struct {
	Queries *db.Queries
}

func NewChatRepository(queries *db.Queries) *ChatRepositoryImpl {
	return &ChatRepositoryImpl{
		Queries: queries,
	}
}

func (repo *ChatRepositoryImpl) InitChat(ctx context.Context, id string) error {
	return repo.Queries.InitChat(ctx, id)
}