package controllers

import (
	"log"
	"net/http"

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
		context.JSON(http.StatusInternalServerError, gin.H{"error": "unauthorized"})
		return
	}

	context.JSON(http.StatusOK, gin.H {"message": "Added"})
}

func (c *FriendController) GetFriendList(context *gin.Context){
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