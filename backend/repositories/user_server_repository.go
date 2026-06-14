package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type UserServerRepository interface {
	// CreateUserServer creates a new user-server association in the database.
	CreateUserServer(userID string, serverID string, context context.Context) error
	CountUserServerByUserID(ctx context.Context, userServerParam db.CountUserServerByUserIdParams) (int64, error)
}
