package handlers

import (
	"context"

	"github.com/arifazola/disclone/backend/internal"
	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type AcceptFriendRequest struct {
	FriendRepository repositories.FriendRepository
	TransactionManager internal.TransactionManager
}

func (handler *AcceptFriendRequest) Handle(ctx context.Context, arg db.UpdateFriendRequestStatusParams) error{
	return handler.TransactionManager.ExecTx(ctx, func(tr repositories.TxRepositories) error {
		// err := tr.ServerRepo.CreateServer(server, context)
		// err := tr.FriendRepository.UpdateFriendRequestStatus(ctx, arg)

		err := handler.FriendRepository.UpdateFriendRequestStatus(ctx, arg)

		if err != nil {
			return err
		}
		
		friendModel := db.Friend {
			UserID: arg.Friend,
			Friend: arg.UserID,
			Status: int16(1),
		}
		return tr.FriendRepository.AddFriend(ctx, friendModel)
	})
	
}