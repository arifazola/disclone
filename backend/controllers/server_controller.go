package controllers

import (
	"database/sql"

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
