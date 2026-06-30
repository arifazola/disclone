package repositories

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type FriendRepositoryImpl struct {
	Queries *db.Queries
}

func NewFriendRepository(queries *db.Queries) *FriendRepositoryImpl {
	return &FriendRepositoryImpl{
		Queries: queries,
	}
}

func (repo *FriendRepositoryImpl) AddFriend(context context.Context, friend db.Friend) error {
	return repo.Queries.AddFriend(context, db.AddFriendParams(friend))
}

func (repo *FriendRepositoryImpl) GetFriendList(ctx context.Context, userID string) ([]db.GetFriendListRow, error){
	return repo.Queries.GetFriendList(ctx, userID)
}

func (repo *FriendRepositoryImpl) GetFriendRequest(ctx context.Context, friend string) ([]db.GetFriendRequestRow, error){
	return repo.Queries.GetFriendRequest(ctx, friend)
}

func (repo *FriendRepositoryImpl) UpdateFriendRequestStatus(ctx context.Context, arg db.UpdateFriendRequestStatusParams) error {
	return repo.Queries.UpdateFriendRequestStatus(ctx, arg)
}

func (repo *FriendRepositoryImpl) DeleteFriendRequest(ctx context.Context, arg db.DeleteFriendRequestParams) error{
	return repo.Queries.DeleteFriendRequest(ctx, arg)
}