package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/arifazola/disclone/backend/auth"
	"github.com/arifazola/disclone/backend/controllers"
	"github.com/arifazola/disclone/backend/database"
	"github.com/arifazola/disclone/backend/helpers"
	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()

	fmt.Printf("region = %q\n", os.Getenv("AWS_REGION"))

	if err != nil {
		log.Fatal("Failed to load environtment variable")
	}

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowCredentials: true,
	}))

	dbUrl := os.Getenv("DB_URL")

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

	refreshTokenRepository := repositories.RefreshTokenRepositoryImpl{
		Queries: queries,
	}

	refreshTokenService := services.RefreshTokenService{
		RefreshTokenRepository: &refreshTokenRepository,
	}

	authController := controllers.AuthController{
		AuthService:         &authService,
		RefreshTokenService: &refreshTokenService,
	}

	serverRepository := repositories.ServerRepositoryImpl{
		Queries: queries,
	}

	store := helpers.Store{
		Queries: queries,
		DB:      dbConn,
	}

	serverService := services.ServerService{
		TransactionManager: &store,
		ServerRepository:   &serverRepository,
	}

	serverController := controllers.ServerController{
		ServerService: &serverService,
	}

	ctx := context.Background()

	s3Service, err := services.NewS3Service(ctx)

	if err != nil {
		log.Panic("Failed initializing s3 service")
	}

	uploadController := controllers.UploadController{
		S3Service: s3Service,
	}

	router.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello, World!",
		})
	})

	router.POST("/account", authController.Register)
	router.POST("/login", authController.Login)

	router.POST("/servers", auth.AuthMiddleware(), serverController.CreateServer)
	router.GET(("/servers"), auth.AuthMiddleware(), serverController.GetUserJoinedServer)

	router.POST("/upload", uploadController.GenerateUploadUrl)

	router.Run(":8080")

}
