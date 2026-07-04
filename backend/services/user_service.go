package services

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type UserService struct {
	Repo repositories.UserRepository
}

func (service *UserService) GetUserByUsername(ctx context.Context, username string) (db.User, error){
	user, err := service.Repo.GetUserByUsername(ctx, username)

	if err != nil {
		return db.User{}, err
	}

	return user, nil
}