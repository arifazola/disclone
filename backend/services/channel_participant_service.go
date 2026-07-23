package services

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/models"
	"github.com/arifazola/disclone/backend/repositories"
)

type ChannelParticipantService struct {
	ChannelParticipantRepo repositories.ChannelParticipantRepository
}

func (service *ChannelParticipantService) AddChannelParticipant(ctx context.Context, arg db.AddChannelParticipantParams) error {
	return service.ChannelParticipantRepo.AddChannelParticipant(ctx, arg)
}

func (service *ChannelParticipantService) RemoveUserFromChannelParticipant(ctx context.Context, arg db.RemoveUserFromChannelParticipantParams) error{
	return service.ChannelParticipantRepo.RemoveUserFromChannelParticipant(ctx, arg)
}

func (service *ChannelParticipantService) GetAllChannelParticipants(ctx context.Context, channelIDs []string) (*models.ParticipantModel, error){
	participants, err := service.ChannelParticipantRepo.GetAllChannelParticipants(ctx, channelIDs)

	if err != nil {
		return nil, err
	}

	participantMap := make(map[string][]models.UserModel)
	// users := []models.UserModel{}

	for _, item := range participants {
		userModel := models.UserModel {
			ID: item.ID,
			Username: item.Username,
		}

		existing := participantMap[item.ChannelId]
		
		existing = append(existing, userModel)

		
		participantMap[item.ChannelId] = existing
	}

	participantModel := models.ParticipantModel {
		Participants: participantMap,
	}

	return &participantModel, nil
}

func (service *ChannelParticipantService) GetUserIdFromChannelParticipants(ctx context.Context, channelid string) ([]string, error){
	return service.ChannelParticipantRepo.GetUserIdFromChannelParticipants(ctx, channelid)
}