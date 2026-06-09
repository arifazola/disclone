package services

import (
	"context"
	"errors"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/internal/validators"
	"github.com/arifazola/disclone/backend/repositories"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	UserRepository repositories.UserRepository
}

func (s *AuthService) RegisterUser(user db.User, context context.Context) error {
	emailErr := validators.Email(user.Email)
	if emailErr != nil {
		return emailErr
	}

	isPasswordValid := validators.Password(user.Password)
	if !isPasswordValid {
		return errors.New("password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")
	}

	id := uuid.New().String()
	user.ID = id
	bytes, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(bytes)
	return s.UserRepository.CreateUser(user, context)
}
