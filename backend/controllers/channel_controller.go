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

	userid, exist := context.Get("userID")

	if !exist {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		log.Println("Context userid not exist")
		return
	}

	userServerModel := db.UserServer{
		UserId:   userid.(string),
		ServerId: channelModel.ServerId,
	}

	err := controller.ChannelService.CreateChannel(context, channelModel, userServerModel)

	if err != nil {
		log.Println("error creating channel", err)
		context.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Channel Created"})
}
