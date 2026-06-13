package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ServerRepository interface {
	CreateServer(server db.Server, context context.Context) error
	GetUserJoinedServer(context context.Context, userid string) ([]db.GetUserJoinedServersRow, error)
	GetServerChannels(ctx context.Context, serverid string) ([]db.Channel, error)
	CountUserServerByUserId(ctx context.Context, userid string) (int64, error)
}
