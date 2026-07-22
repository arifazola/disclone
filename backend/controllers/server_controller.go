package controllers

import (
	"database/sql"
	"errors"
	"fmt"
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
	time.Sleep(1 * time.Second)
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
		responseModel := models.ResponseModel[any]{
			Message: "Unauthorized",
			Data: nil,
		} 
		ctx.JSON(http.StatusUnauthorized, responseModel)
		log.Println("Context userid not exist")
		return
	}

	serverChannels, err := c.ServerService.GetServerChannels(ctx, serverID, userid.(string))

	if err != nil {
		ctx.JSON(http.StatusNoContent, gin.H{"error": "no content"})
		log.Println("error get server channels", err)
		return
	}

	responseModel := models.ResponseModel[[]db.Channel]{
		Message: "Success",
		Data: serverChannels,
	} 

	ctx.JSON(http.StatusOK, responseModel)
}

func (c *ServerController) JoinServer(ctx *gin.Context) {
	serverID := ctx.Param("server_id")
	userid, exist := ctx.Get("userID")

	if !exist {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		log.Println("Context userid not exist")
		return
	}

	fmt.Print("Server ID", serverID)

	err := c.ServerService.JoinServer(userid.(string), serverID, ctx)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to join server"})
		log.Println("Error joining server", err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "joined server"})
}

func (controller *ServerController) GetMutualServers(context *gin.Context){
	userid, exist := context.Get("userID")
	username := context.Param("username")
	if !exist {
		responseModel := models.ResponseModel[any]{
			Message: "Unauthorized",
		}

		context.JSON(http.StatusUnauthorized, responseModel)
	}

	mutualServers, err := controller.ServerService.GetMutualServers(context, userid.(string), username)

	if err != nil {
		if err.Error() == custom_errors.ErrInvalidUsername.Error(){
			responseModel := models.ResponseModel[any] {
				Message: "User doesn't exist",
			}

			context.JSON(http.StatusBadRequest, responseModel)

			return
		}

		if errors.Is(err, sql.ErrNoRows){
			responseModel := models.ResponseModel[[]any] {
				Message: "No mutual servers",
				Data: []any{},
			}

			context.JSON(http.StatusNoContent, responseModel)

			return
		}

		log.Println("Error getting mutual servers", err)

		responseModel := models.ResponseModel[any] {
			Message: "Internal server error",
		}

		context.JSON(http.StatusInternalServerError, responseModel)

		return
	}

	responseModel := models.ResponseModel[[]db.GetMutualServersRow] {
		Message: "Success",
		Data: mutualServers,
	}

	context.JSON(http.StatusOK, responseModel)
}