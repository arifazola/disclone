package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type MockServerRepository struct {
	Error error
}

func (m *MockServerRepository) CreateServer(server db.Server, context context.Context) error {
	return m.Error
}
