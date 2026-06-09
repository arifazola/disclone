package services

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type ServerService struct {
	ServerRepository repositories.ServerRepository
}

func (s *ServerService) CreateServer(server db.Server, context context.Context) error {
	//Need validation here before creating the server, but for now just pass it through to the repository
	return s.ServerRepository.CreateServer(server, context)
}
