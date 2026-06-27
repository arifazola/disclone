package controllers

import (
	"database/sql"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/arifazola/disclone/backend/models"
	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-gonic/gin"
)

type FriendController struct {
	FriendService *services.FriendService
}

func (c *FriendController) AddFriend(context *gin.Context){
	username := context.PostForm("username")
	userid, exist := context.Get("userID")

	if !exist {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		log.Println("Context userid not exist")
		return
	}

	err := c.FriendService.AddFriend(context, userid.(string), username)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows){
			responseModel := models.ResponseModel[any]{
				Message: "User not found",
				Data: nil,
			}
			context.JSON(http.StatusNotFound, responseModel)
			return	
		}
		responseModel := models.ResponseModel[any]{
			Message: "Something went wrong",
			Data: nil,
		}
		context.JSON(http.StatusInternalServerError, responseModel)
		return
	}

	context.JSON(http.StatusOK, gin.H {"message": "Added"})
}

func (c *FriendController) GetFriendList(context *gin.Context){
	time.Sleep(2 * time.Second)
	userid, exist := context.Get("userID")

	if !exist {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		log.Println("Context userid not exist")
		return
	}

	friendlist, err := c.FriendService.GetFriendList(context, userid.(string))

	if friendlist == nil {
		responseModel := models.ResponseModel[[]any]{
			Message: "No friends",
			Data: []any{},
		} 

		context.JSON(http.StatusOK, responseModel)

		return
	}

	if err != nil {
		responseModel := models.ResponseModel[any]{
			Message: "Something went wrong",
			Data: nil,
		} 

		context.JSON(http.StatusInternalServerError, responseModel)

		return
	}

	responseModel := models.ResponseModel[any]{
		Message: "Success",
		Data: friendlist,
	} 

	context.JSON(http.StatusOK, responseModel)
}