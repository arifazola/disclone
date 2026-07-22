package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ChannelParticipantRepository interface {
	AddChannelParticipant(ctx context.Context, arg db.AddChannelParticipantParams) error
	RemoveUserFromChannelParticipant(ctx context.Context, arg db.RemoveUserFromChannelParticipantParams) error
	GetAllChannelParticipants(ctx context.Context, channelIDs []string) ([]db.GetAllChannelParticipantsRow, error)
}