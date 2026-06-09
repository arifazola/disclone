package controllers

import (
	"database/sql"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	AuthService *services.AuthService
}

func (service *AuthController) Register(c *gin.Context) {
	user := db.User{
		ID:       "",
		Email:    c.PostForm("email"),
		Username: c.PostForm("username"),
		Password: c.PostForm("password"),
		ProfilePricture: sql.NullString{
			String: "",
			Valid:  false,
		},
	}

	err := service.AuthService.RegisterUser(user, c.Request.Context())
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(201, gin.H{"message": "User registered successfully"})
}

func (service *AuthController) Login(c *gin.Context) {
	email := c.PostForm("email")
	password := c.PostForm("password")

	user, err := service.AuthService.LoginUser(email, password, c.Request.Context())
	if err != nil {
		c.JSON(401, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Login successful", "user": user})
}
