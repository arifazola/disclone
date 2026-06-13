package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ChannelRepository interface {
	CreateChannel(context context.Context, channel db.Channel) error
}
