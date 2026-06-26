package services

import (
	"context"
	"database/sql"
	"errors"
	"log"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type FriendService struct {
	Repo repositories.FriendRepository
	UserRepo repositories.UserRepository
}

type FriendStatus int

const (
	RequestSent FriendStatus = iota
	RequestAccepted
)

func (service *FriendService) AddFriend(context context.Context, requestFromID, requestToUsername string) error {
	userid, err := service.UserRepo.GetUserIDByUsername(context, requestToUsername)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows){
			return errors.New("User not found")
		}

		log.Println("error getting userid by username", err)
		return errors.New("Something went wrong")
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