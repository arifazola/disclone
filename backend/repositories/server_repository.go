package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ServerRepository interface {
	CreateServer(server db.Server, context context.Context) error
}
