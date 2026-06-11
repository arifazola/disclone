package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type RefreshTokenRepositoryImpl struct {
	*db.Queries
}

func (repo *RefreshTokenRepositoryImpl) AddRefreshToken(refreshTokenModel db.RefreshToken, context context.Context) error {
	return repo.Queries.InsertRefreshToken(context, db.InsertRefreshTokenParams(refreshTokenModel))
}
