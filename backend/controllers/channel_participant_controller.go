package controllers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/models"
	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-gonic/gin"
)

type ChannelParticipantController struct {
	ChannelParticipantService *services.ChannelParticipantService
}

func (controller *ChannelParticipantController) GetAllChannelParticipants(ctx *gin.Context){
	channelIDs := ctx.PostForm("channelIDs")

	var IDs []string

	err := json.Unmarshal([]byte(channelIDs), &IDs)

	if err != nil {
		log.Println("error parsing channel IDs", err)
		responseModel := models.ResponseModel[any]{
			Message: "Error parsing channel IDs",
			Data: nil,
		}
		
		ctx.JSON(http.StatusInternalServerError, responseModel)
		return
	}

	participants, err := controller.ChannelParticipantService.GetAllChannelParticipants(ctx, IDs)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows){
			responseModel := models.ResponseModel[[]any]{
				Message: "No participants",
				Data: []any{},
			} 

			ctx.JSON(http.StatusNoContent, responseModel)
			return
		}

		log.Println("Error fetching channel participants", err)
		responseModel := models.ResponseModel[any]{
			Message: "Internal server error",
			Data: nil,
		}
		
		ctx.JSON(http.StatusInternalServerError, responseModel)
	}

	responseModel := models.ResponseModel[[]db.GetAllChannelParticipantsRow]{
		Message: "Success",
		Data: participants,
	} 

	ctx.JSON(http.StatusOK, responseModel)
}