package controllers

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-gonic/gin"
)

type ServerController struct {
	ServerService *services.ServerService
}

func (c *ServerController) CreateServer(ctx *gin.Context) {
	server := db.Server{
		ID:   "abc",
		Name: ctx.PostForm("name"),
		CreatedBy: sql.NullString{
			String: ctx.PostForm("createdBy"),
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
