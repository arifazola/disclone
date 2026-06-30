package handlers

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type DeleteFriendRequest struct {
	FriendRepository repositories.FriendRepository
}

func (handler *DeleteFriendRequest) Handle(ctx context.Context, arg db.UpdateFriendRequestStatusParams) error{
	deleteArg := db.DeleteFriendRequestParams {
		UserID: arg.UserID,
		Friend: arg.Friend,
	}
	return handler.FriendRepository.DeleteFriendRequest(ctx, deleteArg)
}