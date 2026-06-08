package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type UserRepository interface {
	CreateUser(user db.User, context context.Context) error
}
