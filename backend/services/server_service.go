package services

import (
	"context"

	"github.com/arifazola/disclone/backend/helpers"
	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type ServerService struct {
	// ServerRepository     repositories.ServerRepository
	// UserServerRepository repositories.UserServerRepository
	// SQLDB                *sql.DB
	Store *helpers.Store
}

func (s *ServerService) CreateServer(server db.Server, context context.Context) error {
	//Need validation here before creating the server, but for now just pass it through to the repository
	// return s.ServerRepository.CreateServer(server, context)

	return s.Store.ExecTx(context, func(tr repositories.TxRepositories) error {
		err := tr.ServerRepo.CreateServer(server, context)

		if err != nil {
			return err
		}

		return tr.UserServerRepo.CreateUserServer(server.CreatedBy.String, server.ID)
	})
}
