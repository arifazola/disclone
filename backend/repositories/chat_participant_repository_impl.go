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

func (repo *ChatParticipantRepositoryImpl) GetChatIDFromParticipants(ctx context.Context, arg db.GetChatIDFromParticipantsParams) (string, error) {
	return repo.Queries.GetChatIDFromParticipants(ctx, arg)
}

func (repo *ChatParticipantRepositoryImpl) GetChatIDFromOneParticipant(ctx context.Context, participants string) (string, error) {
	return repo.Queries.GetChatIDFromOneParticipant(ctx, participants)
}