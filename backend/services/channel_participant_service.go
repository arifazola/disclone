package services

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type ChannelParticipantService struct {
	ChannelParticipantRepo repositories.ChannelParticipantRepository
}

func (service *ChannelParticipantService) AddChannelParticipant(ctx context.Context, arg db.AddChannelParticipantParams) error {
	return service.ChannelParticipantRepo.AddChannelParticipant(ctx, arg)
}