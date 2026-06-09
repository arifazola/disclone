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
	return s.ServerRepository.CreateServer(server, context)
}
