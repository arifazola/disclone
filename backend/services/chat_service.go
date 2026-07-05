package services

import (
	"context"
	"database/sql"
	"errors"
	"log"

	custom_errors "github.com/arifazola/disclone/backend/errors"
	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type ChatService struct {
	ChatParticipantRepo repositories.ChatParticipantRepository
	UserRepo repositories.UserRepository
	ChatRepo repositories.ChatRepository
}

func (service *ChatService) GetChatIDFromParticipants(ctx context.Context, userid, friendUsername string) (string, error) {
	friendUserID, err := service.UserRepo.GetUserIDByUsername(ctx, friendUsername)

	log.Println("friend username", friendUsername, " with it", friendUserID)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows){
			return "", &custom_errors.InvalidUsernameError{
				Message: "Invalid username",
			}
		}

		log.Println("error getting username for chat id", err)

		return "", err
	}

	getChatIDParam := db.GetChatIDFromParticipantsParams {
		Participants: userid,
		Participants_2: friendUserID,
	}
	
	chatID, err := service.ChatParticipantRepo.GetChatIDFromParticipants(ctx, getChatIDParam)

	if err != nil {
		return "", err
	}

	return chatID, nil
}

func (service *ChatService) AddMessage(ctx context.Context, arg db.AddMessageParams, friendUsername string) error {
	friendUserID, err := service.UserRepo.GetUserIDByUsername(ctx, friendUsername)
	
	if err != nil {
		if errors.Is(err, sql.ErrNoRows){
			return &custom_errors.InvalidUsernameError{
				Message: "Invalid username",
			}
		}

		log.Println("error getting user id for adding chat", err)

		return err
	}

	chatID, err := service.ChatParticipantRepo.GetChatIDFromOneParticipant(ctx, friendUserID)

	log.Println("chat ID result", chatID)

	if err != nil {
		log.Println("error getting chat ID when adding message", err)
		return err
	}

	if chatID != arg.ChatID {
		log.Println("invalid chat ID", chatID)
		return &custom_errors.InvalidChatError{
			Message: "Invalid chat ID",
		}
	}

	return service.ChatRepo.AddMessage(ctx, arg)
}