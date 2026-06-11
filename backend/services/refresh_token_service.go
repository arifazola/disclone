package services

import (
	"context"
	"time"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
	"github.com/google/uuid"
)

type RefreshTokenService struct {
	repositories.RefreshTokenRepository
}

func (service *RefreshTokenService) AddRefreshToken(token, userID string, context context.Context) error {
	refreshTokenModel := db.RefreshToken{
		ID:        uuid.New(),
		UserId:    userID,
		CreatedAt: time.Now().Unix(),
		ExpiresAt: time.Now().Add(30 * 24 * time.Hour).Unix(),
		Token:     token,
	}

	err := service.RefreshTokenRepository.AddRefreshToken(refreshTokenModel, context)

	if err != nil {
		return err
	}

	return nil
}
