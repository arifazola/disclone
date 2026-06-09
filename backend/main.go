package main

import (
	"log"
	"net/http"

	"github.com/arifazola/disclone/backend/controllers"
	"github.com/arifazola/disclone/backend/database"
	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	dbUrl := "postgres://postgres:test1234@localhost:5432/disclone?sslmode=disable"

	dbConn, err := database.NewDb(dbUrl)

	if err != nil {
		log.Fatal(err)
	}

	defer dbConn.Close()

	queries := db.New(dbConn)

	userRepository := repositories.UserRepositoryImpl{
		Queries: queries,
	}

	authService := services.AuthService{
		UserRepository: &userRepository,
	}

	authController := controllers.AuthController{
		AuthService: &authService,
	}

	serverRepository := repositories.ServerRepositoryImpl{
		Queries: queries,
	}

	serverService := services.ServerService{
		ServerRepository: &serverRepository,
	}

	serverController := controllers.ServerController{
		ServerService: &serverService,
	}

	router.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello, World!",
		})
	})

	router.POST("/account", authController.Register)
	router.POST("/login", authController.Login)

	router.POST("/servers", serverController.CreateServer)

	router.Run(":8080")

}
