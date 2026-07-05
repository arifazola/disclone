package controllers

import (
	"database/sql"
	"errors"
	"log"
	"net/http"
	"time"

	custom_errors "github.com/arifazola/disclone/backend/errors"
	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/models"
	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ChatController struct {
	ChatService *services.ChatService
}

func (controller *ChatController) GetChatIDFromParticipants(context *gin.Context){
	userid, exist := context.Get("userID")
	username := context.Param("username")
	if !exist {
		responseModel := models.ResponseModel[any]{
			Message: "Unauthorized",
		}

		context.JSON(http.StatusUnauthorized, responseModel)

		return
	}

	chatID, err := controller.ChatService.GetChatIDFromParticipants(context, userid.(string), username)

	if err != nil {
		if err.Error() == custom_errors.ErrInvalidUsername.Error(){
			responseModel := models.ResponseModel[any]{
				Message: "User doesn't exist",
			}

			context.JSON(http.StatusBadRequest, responseModel)

			return
		}

		if errors.Is(err, sql.ErrNoRows){
			responseModel := models.ResponseModel[any]{
				Message: "Invalid chat ID",
			}

			context.JSON(http.StatusNoContent, responseModel)

			return
		}

		log.Println("error getting chat ID", err)

		responseModel := models.ResponseModel[any]{
			Message: "Internal server error",
		}

		context.JSON(http.StatusInternalServerError, responseModel)

		return
	}

	responseModel := models.ResponseModel[string]{
		Message: "Success",
		Data: chatID,
	}

	context.JSON(http.StatusOK, responseModel)

}

func (controller *ChatController) AddMessage(context *gin.Context) {
	userid, exist := context.Get("userID")
	username := context.PostForm("username")
	chatID := context.PostForm("chatID")
	message := context.PostForm("message")
	if !exist {
		responseModel := models.ResponseModel[any]{
			Message: "Unauthorized",
		}

		context.JSON(http.StatusUnauthorized, responseModel)

		return
	}

	id := uuid.New().String()
	addMessageParam := db.AddMessageParams{
		ChatID: chatID,
		ID: id,
		Sender: userid.(string),
		Message: message,
		Timestamp: time.Now().Unix(),

	}
	err := controller.ChatService.AddMessage(context, addMessageParam, username)

	if err != nil {
		if err.Error() == custom_errors.ErrInvalidChat.Error(){
			responseModel := models.ResponseModel[any]{
				Message: "Invalid chat ID",
			}

			context.JSON(http.StatusBadRequest, responseModel)

			return
		}

		responseModel := models.ResponseModel[any]{
			Message: "Internal server error",
		}

		context.JSON(http.StatusInternalServerError, responseModel)

		return
	}

	responseModel := models.ResponseModel[any]{
		Message: "Message sent",
	}

	context.JSON(http.StatusOK, responseModel)
}