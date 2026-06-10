package repositories

import "github.com/arifazola/disclone/backend/internal/db"

type UserServerRepositoryImpl struct {
	Queries *db.Queries
}

func NewUserServerRepository(queries *db.Queries) *UserServerRepositoryImpl {
	return &UserServerRepositoryImpl{
		Queries: queries,
	}
}

func (repo *UserServerRepositoryImpl) CreateUserServer(userID string, serverID string) error {
	return nil
}
