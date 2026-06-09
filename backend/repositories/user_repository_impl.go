package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type UserRepositoryImpl struct {
	Queries *db.Queries
}

func (repo *UserRepositoryImpl) CreateUser(user db.User, context context.Context) error {
	return repo.Queries.CreateUser(context, db.CreateUserParams{
		ID:       user.ID,
		Email:    user.Email,
		Username: user.Username,
		Password: user.Password,
	})
}

func (repo *UserRepositoryImpl) GetUserByEmailAndPassword(email string, password string, context context.Context) (db.User, error) {
	user, err := repo.Queries.GetUserByEmail(context, email)
	if err != nil {
		return db.User{}, err
	}

	return user, nil
}
