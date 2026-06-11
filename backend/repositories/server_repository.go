package repositories

import (
	"context"
	"database/sql"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ServerRepository interface {
	CreateServer(server db.Server, context context.Context) error
	GetUserJoinedServer(context context.Context, userid string) ([]sql.NullString, error)
}
