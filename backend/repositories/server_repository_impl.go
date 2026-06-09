package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ServerRepositoryImpl struct {
	Queries *db.Queries
}

func (repo *ServerRepositoryImpl) CreateServer(server db.Server, context context.Context) error {
	return repo.Queries.CreateServer(context, db.CreateServerParams(server))
}
