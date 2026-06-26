package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type FriendRepositoryImpl struct {
	Queries *db.Queries
}

func (repo *FriendRepositoryImpl) AddFriend(context context.Context, friend db.Friend) error {
	return repo.Queries.AddFriend(context, db.AddFriendParams(friend))
}

func (repo *FriendRepositoryImpl) GetFriendList(ctx context.Context, userID string) ([]db.GetFriendListRow, error){
	return repo.Queries.GetFriendList(ctx, userID)
}