package factories

import (
	"github.com/arifazola/disclone/backend/handlers"
	"github.com/arifazola/disclone/backend/internal"
	"github.com/arifazola/disclone/backend/repositories"
)


func NewFriendRequestFactory(friendRepository repositories.FriendRepository, transactionManager internal.TransactionManager, status int) handlers.FriendRequestHandler{
	switch status{
	case 1:
		return &handlers.AcceptFriendRequest{
			FriendRepository: friendRepository,
			TransactionManager: transactionManager,
		}
	case 2:
		return &handlers.DeleteFriendRequest{
			FriendRepository: friendRepository,
		}
	default:
		return nil
	}
}