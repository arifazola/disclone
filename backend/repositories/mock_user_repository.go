package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type MockUserRepository struct {
	Err error
}

func (m *MockUserRepository) CreateUser(user db.User, context context.Context) error {
	if m.Err != nil {
		return m.Err
	}

	return nil
}
