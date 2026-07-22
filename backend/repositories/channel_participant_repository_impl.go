package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ChannelParticipantRepositoryImpl struct {
	Queries *db.Queries
}

func (repo *ChannelParticipantRepositoryImpl) AddChannelParticipant(ctx context.Context, arg db.AddChannelParticipantParams) error{
	return repo.Queries.AddChannelParticipant(ctx, arg) 
}

func (repo *ChannelParticipantRepositoryImpl) RemoveUserFromChannelParticipant(ctx context.Context, arg db.RemoveUserFromChannelParticipantParams) error{
	return repo.Queries.RemoveUserFromChannelParticipant(ctx, arg)
}