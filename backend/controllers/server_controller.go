package controllers

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ServerController struct {
	ServerService *services.ServerService
}

func (c *ServerController) CreateServer(ctx *gin.Context) {
	userID, userIDExist := ctx.Get("userID")

	if !userIDExist {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		log.Println("Context userid not exist")
		return
	}
	server := db.Server{
		ID:        uuid.New().String(),
		Name:      ctx.PostForm("name"),
		CreatedBy: userID.(string),
		Picture: sql.NullString{
			String: ctx.PostForm("picture"),
			Valid:  true,
		},
	}
	err := c.ServerService.CreateServer(server, ctx)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(201, server)
}

func (c *ServerController) GetUserJoinedServer(ctx *gin.Context) {
	userID, userIDExist := ctx.Get("userID")

	if !userIDExist {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		log.Println("Context userid not exist")
		return
	}

	userJoinedServer, err := c.ServerService.GetUserJoinedServer(ctx, userID.(string))

	if err != nil {
		ctx.JSON(http.StatusNoContent, gin.H{"error": "No Joined Server"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"servers": userJoinedServer})
}

func (c *ServerController) GetServerChannels(ctx *gin.Context) {
	serverID := ctx.Param("server_id")
	userid, userIDExist := ctx.Get("userID")

	if !userIDExist {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		log.Println("Context userid not exist")
		return
	}

	serverChannels, err := c.ServerService.GetServerChannels(ctx, serverID, userid.(string))

	if err != nil {
		ctx.JSON(http.StatusNoContent, gin.H{"error": "no content"})
		log.Println("error get server channels", err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"channels": serverChannels})
}
