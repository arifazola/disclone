package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ChatParticipantRepositoryImpl struct {
	Queries *db.Queries
}

func NewChatParticipantRepository(queries *db.Queries) *ChatParticipantRepositoryImpl {
	return &ChatParticipantRepositoryImpl{
		Queries: queries,
	}
}

func (repo *ChatParticipantRepositoryImpl) InitChatParticipants(ctx context.Context, arg db.InitChatParticipantsParams) error {
	return repo.Queries.InitChatParticipants(ctx, arg)
}