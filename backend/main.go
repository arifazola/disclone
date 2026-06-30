package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/arifazola/disclone/backend/auth"
	"github.com/arifazola/disclone/backend/controllers"
	"github.com/arifazola/disclone/backend/database"
	"github.com/arifazola/disclone/backend/handlers"
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
		AllowOrigins:     []string{
			"http://localhost:5173", 
			"https://localhost:5173", 
			"http://192.168.1.4:5173", 
			"https://192.168.1.4:5173", 
			"https://192.168.1.182:5173",
			"https://192.168.1.11:5173"},
		AllowHeaders:     []string{"content-type"},
		AllowCredentials: true,
	}))

	dbUrl := os.Getenv("DB_URL")

	dbConn, err := database.NewDb(dbUrl)

	if err != nil {
		log.Fatal(err)
	}

	defer dbConn.Close()

	queries := db.New(dbConn)

	hub := handlers.NewHub()

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

	userServerRepository := repositories.UserServerRepositoryImpl{
		Queries: queries,
	}

	serverService := services.ServerService{
		TransactionManager:   &store,
		ServerRepository:     &serverRepository,
		UserServerRepository: &userServerRepository,
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

	channelRepoImpl := repositories.ChannelRepositoryImpl{
		Queries: queries,
	}

	channelService := services.ChannelService{
		ChannelRepo:    &channelRepoImpl,
		UserServerRepo: &userServerRepository,
	}

	channelController := controllers.ChannelController{
		ChannelService: &channelService,
	}

	friendRepository := repositories.FriendRepositoryImpl{
		Queries: queries,
	}

	friendService := services.FriendService{
		Repo: &friendRepository,
		UserRepo: &userRepository,
		TransactionManager: &store,
	}

	friendController := controllers.FriendController{
		FriendService: &friendService,
		Hub: hub,
	}

	router.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello, World!",
		})
	})

	router.POST("/account", authController.Register)
	router.POST("/login", authController.Login)

	router.POST("/servers", auth.AuthMiddleware(), serverController.CreateServer)
	router.POST("/servers/:server_id/join", auth.AuthMiddleware(), serverController.JoinServer)
	router.GET("/servers", auth.AuthMiddleware(), serverController.GetUserJoinedServer)
	router.GET("/servers/:server_id/channels", auth.AuthMiddleware(), serverController.GetServerChannels)

	router.POST("/channels", auth.AuthMiddleware(), channelController.CreateChannel)

	router.POST("/upload", auth.AuthMiddleware(), uploadController.GenerateUploadURL)

	router.GET("/ws/:channel_id/:user_id", auth.AuthMiddleware(), controllers.HandleWebSocket)

	router.POST("/friends", auth.AuthMiddleware(), friendController.AddFriend)
	router.GET("/friends", auth.AuthMiddleware(), friendController.GetFriendList)
	router.GET("/friends/received", auth.AuthMiddleware(), friendController.GetFriendRequest)
	router.POST("/friends/update", auth.AuthMiddleware(), friendController.UpdateFriendRequest)

	router.GET("/stream", func(c *gin.Context) {
		// 1. Set SSE headers explicitly
		c.Writer.Header().Set("Content-Type", "text/event-stream")
		c.Writer.Header().Set("Cache-Control", "no-cache")
		c.Writer.Header().Set("Connection", "keep-alive")
		c.Writer.Header().Set("Transfer-Encoding", "chunked")

		client := &handlers.Client{
			ID: "test",
			Events: make(chan any, 10),
		}
		hub.Add(client)
		defer hub.Remove(client.ID)

		// 2. Start the infinite loop event stream
		c.Stream(func(w io.Writer) bool {
			select{
			case <- c.Request.Context().Done():
				return false
			case event := <-client.Events:
				fmt.Println("sending message stream")
				c.SSEvent("message", event)
				return true
			}
		})
	})

	err = router.RunTLS(
		":8080",
		`C:\Users\ThinkPad\.vite-plugin-mkcert\cert.pem`,
		`C:\Users\ThinkPad\.vite-plugin-mkcert\dev.pem`,
	)

	if err != nil {
		log.Fatal("SSL error", err)
	}

	router.Run(":8080")

}
