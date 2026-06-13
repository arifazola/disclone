package services

import (
	"context"
	"errors"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type ChannelService struct {
	ChannelRepo repositories.ChannelRepository
	ServerRepo  repositories.ServerRepository
}

func (service *ChannelService) CreateChannel(context context.Context, channel db.Channel, userid string) error {
	countUserServer, err := service.ServerRepo.CountUserServerByUserId(context, userid)

	if err != nil {
		return err
	}

	userHasAccessToThisServer := countUserServer > 0

	if !userHasAccessToThisServer {
		return errors.New("no access to this server")
	}

	return service.ChannelRepo.CreateChannel(context, channel)
}
