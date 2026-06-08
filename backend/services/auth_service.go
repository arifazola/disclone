package services

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type AuthService struct {
	UserRepository repositories.UserRepository
}

func (s *AuthService) RegisterUser(user db.User, context context.Context) error {
	return s.UserRepository.CreateUser(user, context)
}
