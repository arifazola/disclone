package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type FriendRepository interface {
	AddFriend(context context.Context, friend db.Friend) error
	GetFriendList(ctx context.Context, userID string) ([]db.GetFriendListRow, error)
	GetFriendRequest(ctx context.Context, friend string) ([]db.GetFriendRequestRow, error)
}