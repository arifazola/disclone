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

func (repo *ChannelParticipantRepositoryImpl) GetAllChannelParticipants(ctx context.Context, channelIDs []string) ([]db.GetAllChannelParticipantsRow, error){
	return repo.Queries.GetAllChannelParticipants(ctx, channelIDs)
}

func (repo *ChannelParticipantRepositoryImpl) GetUserIdFromChannelParticipants(ctx context.Context, channelid string) ([]string, error){
	return repo.Queries.GetUserIdFromChannelParticipants(ctx, channelid)
}