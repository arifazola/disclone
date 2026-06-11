package services

import (
	"context"
	"database/sql"

	"github.com/arifazola/disclone/backend/internal"
	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type ServerService struct {
	ServerRepository repositories.ServerRepository
	// UserServerRepository repositories.UserServerRepository
	// SQLDB                *sql.DB
	TransactionManager internal.TransactionManager
}

func (s *ServerService) CreateServer(server db.Server, context context.Context) error {
	//Need validation here before creating the server, but for now just pass it through to the repository
	// return s.ServerRepository.CreateServer(server, context)

	return s.TransactionManager.ExecTx(context, func(tr repositories.TxRepositories) error {
		err := tr.ServerRepo.CreateServer(server, context)

		if err != nil {
			return err
		}

		return tr.UserServerRepo.CreateUserServer(server.CreatedBy.String, server.ID, context)
	})
}

func (s *ServerService) GetUserJoinedServer(context context.Context, userid string) ([]sql.NullString, error) {
	return s.ServerRepository.GetUserJoinedServer(context, userid)
}
