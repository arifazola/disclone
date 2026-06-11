package repositories

import "context"

type UserServerRepository interface {
	// CreateUserServer creates a new user-server association in the database.
	CreateUserServer(userID string, serverID string, context context.Context) error
}
