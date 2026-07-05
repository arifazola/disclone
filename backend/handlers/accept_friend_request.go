package handlers

import (
	"context"
	"fmt"
	"log"

	"github.com/arifazola/disclone/backend/internal"
	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
	"github.com/google/uuid"
)

type AcceptFriendRequest struct {
	FriendRepository repositories.FriendRepository
	TransactionManager internal.TransactionManager
}

func (handler *AcceptFriendRequest) Handle(ctx context.Context, arg db.UpdateFriendRequestStatusParams) error{
	fmt.Println("Handle accept", arg.Status)
	return handler.TransactionManager.ExecTx(ctx, func(tr repositories.TxRepositories) error {
		// err := tr.ServerRepo.CreateServer(server, context)
		// err := tr.FriendRepository.UpdateFriendRequestStatus(ctx, arg)

		err := tr.FriendRepository.UpdateFriendRequestStatus(ctx, arg)

		if err != nil {
			log.Println("Error updating friend status", err)
			return err
		}

		id := uuid.New().String()

		err = tr.ChatRepository.InitChat(ctx, id)

		if err != nil {
			log.Println("Error creating init chat", err)
			return err
		}

		chatParticipantArg := db.InitChatParticipantsParams{
			ChatID: id,
			Participants: arg.UserID,
			Participants_2: arg.Friend,
		}

		err = tr.ChatParticipantRepository.InitChatParticipants(ctx, chatParticipantArg)

		if err != nil {
			log.Println("Error initiating chat participants", err)
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