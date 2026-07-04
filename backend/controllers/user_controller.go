package controllers

import (
	"database/sql"
	"errors"
	"log"
	"net/http"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/models"
	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-gonic/gin"
)

type UserController struct {
	UserService *services.UserService
}

func (controller *UserController) GetUserByUsername(context *gin.Context){
	username := context.Param("username")

	user, err := controller.UserService.GetUserByUsername(context, username)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows){
			responseModel := models.ResponseModel[any]{
				Message: "User not found",
			}
			context.JSON(http.StatusNotFound, responseModel)
			return
		}
		log.Println("error getting user by username", err)
		
		responseModel := models.ResponseModel[any]{
			Message: "Internal server error",
		}
		context.JSON(http.StatusNotFound, responseModel)
	}

	
	responseModel := models.ResponseModel[db.User]{
		Message: "User found",
		Data: user,
	}
	context.JSON(http.StatusOK, responseModel)
}