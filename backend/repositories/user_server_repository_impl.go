package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type UserServerRepositoryImpl struct {
	Queries *db.Queries
}

func NewUserServerRepository(queries *db.Queries) *UserServerRepositoryImpl {
	return &UserServerRepositoryImpl{
		Queries: queries,
	}
}

func (repo *UserServerRepositoryImpl) CreateUserServer(userID string, serverID string, context context.Context) error {
	return repo.Queries.AddUserToServer(context, db.AddUserToServerParams{
		UserId:   userID,
		ServerId: serverID,
	})
}
