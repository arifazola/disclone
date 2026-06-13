package services

import (
	"context"
	"errors"

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

		return tr.UserServerRepo.CreateUserServer(server.CreatedBy, server.ID, context)
	})
}

func (s *ServerService) GetUserJoinedServer(context context.Context, userid string) ([]db.GetUserJoinedServersRow, error) {
	return s.ServerRepository.GetUserJoinedServer(context, userid)
}

func (s *ServerService) GetServerChannels(context context.Context, serverid, userid string) ([]db.Channel, error) {
	countUserServerByUserId, err := s.ServerRepository.CountUserServerByUserId(context, userid)
	if err != nil {
		return nil, err
	}

	userHasAccessToThisServer := countUserServerByUserId > 0

	if !userHasAccessToThisServer {
		return nil, errors.New("unauthorized server access")
	}

	return s.ServerRepository.GetServerChannels(context, serverid)
}
