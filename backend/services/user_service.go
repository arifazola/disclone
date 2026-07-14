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

func (service *UserService) GetUsersByIDs(ctx context.Context, dollar_1 []string) ([]db.GetUsersByIDsRow, error){
	return service.Repo.GetUsersByIDs(ctx, dollar_1)
}