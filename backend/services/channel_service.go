package services

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type ChannelService struct {
	ChannelRepo repositories.ChannelRepository
}

func (service *ChannelService) CreateChannel(context context.Context, channel db.Channel) error {
	return service.ChannelRepo.CreateChannel(context, channel)
}
