package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type RefreshTokenRepository interface {
	AddRefreshToken(refreshTokenModel db.RefreshToken, context context.Context) error
}
