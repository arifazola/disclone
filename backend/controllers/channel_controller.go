package controllers

import (
	"log"
	"net/http"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ChannelController struct {
	ChannelService *services.ChannelService
}

func (controller *ChannelController) CreateChannel(context *gin.Context) {
	channelModel := db.Channel{
		ID:          uuid.New().String(),
		ServerId:    context.PostForm("serverId"),
		ChannelName: context.PostForm("channelName"),
		Type:        "all",
	}

	err := controller.ChannelService.CreateChannel(context, channelModel)

	if err != nil {
		log.Println("error creating channel", err)
		context.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Channel Created"})
}
