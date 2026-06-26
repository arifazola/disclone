// Package repositories contains the interfaces for the repositories that will be used in the application. These interfaces will be implemented by the concrete repositories that will interact with the database. The repositories will be used by the services to perform the necessary operations on the data.
package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type UserRepository interface {
	CreateUser(user db.User, context context.Context) error
	GetUserByEmailAndPassword(email string, password string, context context.Context) (db.User, error)
	GetUserIDByUsername(ctx context.Context, username string) (string, error)
}
