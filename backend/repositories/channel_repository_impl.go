package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ChannelRepositoryImpl struct {
	Queries *db.Queries
}

func (repo *ChannelRepositoryImpl) CreateChannel(context context.Context, channel db.Channel) error {
	return repo.Queries.CreateChannel(context, db.CreateChannelParams(channel))
}
