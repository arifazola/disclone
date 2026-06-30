package handlers

import (
	"context"
	"fmt"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type DeleteFriendRequest struct {
	FriendRepository repositories.FriendRepository
}

func (handler *DeleteFriendRequest) Handle(ctx context.Context, arg db.UpdateFriendRequestStatusParams) error{
	fmt.Println("Handle delete", arg.Status)
	deleteArg := db.DeleteFriendRequestParams {
		UserID: arg.UserID,
		Friend: arg.Friend,
	}
	return handler.FriendRepository.DeleteFriendRequest(ctx, deleteArg)
}