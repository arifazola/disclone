package services

import (
	"context"
	"errors"

	custom_errors "github.com/arifazola/disclone/backend/errors"
	"github.com/arifazola/disclone/backend/internal"
	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type ServerService struct {
	ServerRepository     repositories.ServerRepository
	UserServerRepository repositories.UserServerRepository
	UserRepository repositories.UserRepository
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
	userServerModel := db.UserServer{
		UserId:   userid,
		ServerId: serverid,
	}
	countUserServerByUserID, err := s.UserServerRepository.CountUserServerByUserID(context, db.CountUserServerByUserIdParams(userServerModel))
	if err != nil {
		return nil, err
	}

	userHasAccessToThisServer := countUserServerByUserID > 0

	if !userHasAccessToThisServer {
		return nil, errors.New("unauthorized server access")
	}

	return s.ServerRepository.GetServerChannels(context, serverid)
}

func (service *ServerService) JoinServer(userid, serverid string, context context.Context) error {
	return service.UserServerRepository.CreateUserServer(userid, serverid, context)
}

func (service *ServerService) GetMutualServers(ctx context.Context, userid, friendUsername string) ([]db.GetMutualServersRow, error){
	friendUserId, err := service.UserRepository.GetUserIDByUsername(ctx, friendUsername)
	if err != nil {
		return []db.GetMutualServersRow{}, &custom_errors.InvalidUsernameError{
			Message: "Invalid username",
			Err: err,
		}
	}

	arg := db.GetMutualServersParams{
		UserId: userid,
		UserId_2: friendUserId,
	}

	mutualServers, err := service.UserServerRepository.GetMutualServers(ctx, arg)

	if err != nil {
		return []db.GetMutualServersRow{}, err
	}

	return mutualServers, err
}
