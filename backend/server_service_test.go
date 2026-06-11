package main

// import (
// 	"context"
// 	"database/sql"
// 	"errors"
// 	"testing"

// 	"github.com/arifazola/disclone/backend/internal/db"
// 	"github.com/arifazola/disclone/backend/repositories"
// 	"github.com/arifazola/disclone/backend/services"
// 	"github.com/stretchr/testify/assert"
// )

// type MockTxManager struct{}

// func (m *MockTxManager) ExecTx(
// 	ctx context.Context,
// 	fn func(repositories.TxRepositories) error,
// ) error {
// 	return fn(mockProvider)
// }

// func TestCreateServerSuccess(t *testing.T) {
// 	mockRepo := &repositories.MockServerRepository{
// 		Error: nil,
// 	}

// 	service := services.ServerService{
// 		TransactionManager: mockRepo,
// 	}

// 	server := db.Server{
// 		ID:   "123",
// 		Name: "Test Server",
// 		CreatedBy: sql.NullString{
// 			Valid:  true,
// 			String: "testuser",
// 		},
// 	}

// 	err := service.CreateServer(server, t.Context())

// 	assert.Nil(t, err, "Expected no error when creating server")
// }

// func TestCreateServerFailure(t *testing.T) {
// 	mockRepo := &repositories.MockServerRepository{
// 		Error: errors.New("Create server failed"),
// 	}
// 	service := services.ServerService{
// 		ServerRepository: mockRepo,
// 	}
// 	server := db.Server{
// 		ID:   "123",
// 		Name: "Test Server",
// 	}
// 	err := service.CreateServer(server, t.Context())

// 	assert.NotNil(t, err, "Expected an error when creating server")
// }
