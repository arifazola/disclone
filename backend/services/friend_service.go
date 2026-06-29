package services

import (
	"context"
	"database/sql"
	"errors"
	"log"

	"github.com/arifazola/disclone/backend/internal"
	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/models"
	"github.com/arifazola/disclone/backend/repositories"
)

type FriendService struct {
	Repo repositories.FriendRepository
	UserRepo repositories.UserRepository
	TransactionManager internal.TransactionManager
}

type FriendStatus int

const (
	RequestSent FriendStatus = iota
	RequestAccepted
	RequestRejected
)

func (service *FriendService) AddFriend(context context.Context, requestFromID, requestToUsername string) error {
	userid, err := service.UserRepo.GetUserIDByUsername(context, requestToUsername)

	if err != nil {
		// if errors.Is(err, sql.ErrNoRows){
		// 	return errors.New("User not found")
		// }

		// log.Println("error getting userid by username", err)
		// return errors.New("Something went wrong")
		return err
	}

	var friendRequestStatus FriendStatus = RequestSent

	friend := db.Friend {
		UserID: requestFromID,
		Friend: userid,
		Status: int16(friendRequestStatus),
	}

	err = service.Repo.AddFriend(context, friend)

	return err
}

func (service *FriendService) GetFriendList(ctx context.Context, userID string) ([]models.FriendModel, error){
	friendList, err := service.Repo.GetFriendList(ctx, userID)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows){
			return nil, errors.New("No friends")
		}
		log.Println("error getting friend list", err)
		return nil, errors.New("Something went wrong")
	}

	var friendListModel []models.FriendModel

	for _, value := range friendList{
		friendModel := models.FriendModel {
			Username: value.Username.String,
			FriendID: value.Friend,
			Status: int(value.Status),
			UserID: value.UserID,
		}

		friendListModel = append(friendListModel, friendModel)
	}

	return friendListModel, nil
}

func (service *FriendService) GetFriendRequest(ctx context.Context, friend string) ([]models.FriendModel, error){
	friendRequest, err := service.Repo.GetFriendRequest(ctx, friend)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows){
			return nil, errors.New("No friends")
		}
		log.Println("error getting friend request", err)
		return nil, errors.New("Something went wrong")
	}

	var friendRequestModel []models.FriendModel

	for _, value := range friendRequest{
		friendModel := models.FriendModel {
			Username: value.Username.String,
			FriendID: value.Friend,
			Status: int(value.Status),
			UserID: value.UserID,
		}

		friendRequestModel = append(friendRequestModel, friendModel)
	}

	return friendRequestModel, nil
}

func (service *FriendService) UpdateFriendRequestStatus(ctx context.Context, arg db.UpdateFriendRequestStatusParams) error{
	return service.TransactionManager.ExecTx(ctx, func(tr repositories.TxRepositories) error {
		// err := tr.ServerRepo.CreateServer(server, context)
		err := tr.FriendRepository.UpdateFriendRequestStatus(ctx, arg)

		if err != nil {
			return err
		}
		
		friendModel := db.Friend {
			UserID: arg.Friend,
			Friend: arg.UserID,
			Status: int16(RequestAccepted),
		}
		return tr.FriendRepository.AddFriend(ctx, friendModel)
	})
}