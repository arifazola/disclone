package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type FriendRepository interface {
	AddFriend(context context.Context, friend db.Friend) error
}