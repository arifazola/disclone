package services

import (
	"context"
	"errors"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type ChannelService struct {
	ChannelRepo    repositories.ChannelRepository
	UserServerRepo repositories.UserServerRepository
}

func (service *ChannelService) CreateChannel(context context.Context, channel db.Channel, userServerModel db.UserServer) error {

	countUserServer, err := service.UserServerRepo.CountUserServerByUserID(context, db.CountUserServerByUserIdParams(userServerModel))

	if err != nil {
		return err
	}

	userHasAccessToThisServer := countUserServer > 0

	if !userHasAccessToThisServer {
		return errors.New("no access to this server")
	}

	return service.ChannelRepo.CreateChannel(context, channel)
}
