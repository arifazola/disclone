package controllers

import (
	"database/sql"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/arifazola/disclone/backend/handlers"
	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/models"
	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-gonic/gin"
)

type FriendController struct {
	FriendService *services.FriendService
	Hub *handlers.Hub
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

	c.Hub.Clients["test"].Events <- "Hello!"

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

func (c *FriendController) GetFriendRequest(context *gin.Context){
	time.Sleep(2 * time.Second)
	userid, exist := context.Get("userID")

	if !exist {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		log.Println("Context userid not exist")
		return
	}

	friendRequest, err := c.FriendService.GetFriendRequest(context, userid.(string))

	if friendRequest == nil {
		responseModel := models.ResponseModel[[]any]{
			Message: "No friend request",
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
		Data: friendRequest,
	} 

	context.JSON(http.StatusOK, responseModel)
}

func (c *FriendController) UpdateFriendRequest(context *gin.Context){
	userid, exist := context.Get("userID")
	friend := context.PostForm("friend")
	action := context.PostForm("action");
	if !exist {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		log.Println("Context userid not exist")
		return
	}

	status := -1

	switch action{
	case "accept":
		status = int(services.RequestAccepted)
	case "reject":
		status = int(services.RequestRejected)
	default:
		responseModel := models.ResponseModel[any]{
			Message: "Unknown action",
			Data: nil,
		} 

		context.JSON(http.StatusBadRequest, responseModel)

		return
	}

	/**
	why friend is userid and user id is friend?
	its because from sender perspective, when sending friend request, the data is store as:
	user_id: the user_id who inisiates the friend request
	friend: the user_id who receives the friend request

	so, when accepting friend request, from the user who receives the request perspective, the "friend" property is the user who accepts the request,
	and the user id comes from the request body
	*/
	arg := db.UpdateFriendRequestStatusParams{
		Status: int16(status),
		Friend: userid.(string),
		UserID: friend,
	}

	err := c.FriendService.UpdateFriendRequestStatus(context, arg)

	if err != nil {
		responseModel := models.ResponseModel[any]{
			Message: "Something went wrong",
			Data: nil,
		} 

		context.JSON(http.StatusInternalServerError, responseModel)

		return
	}

	responseModel := models.ResponseModel[any]{
		Message: "Accepted",
		Data: nil,
	} 

	context.JSON(http.StatusOK, responseModel)
}