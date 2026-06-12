package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type ServerRepositoryImpl struct {
	Queries *db.Queries
}

func NewServerRepository(queries *db.Queries) *ServerRepositoryImpl {
	return &ServerRepositoryImpl{
		Queries: queries,
	}
}

func (repo *ServerRepositoryImpl) CreateServer(server db.Server, context context.Context) error {
	return repo.Queries.CreateServer(context, db.CreateServerParams(server))
}

func (repo *ServerRepositoryImpl) GetUserJoinedServer(context context.Context, userid string) ([]db.GetUserJoinedServersRow, error) {
	return repo.Queries.GetUserJoinedServers(context, userid)
}
