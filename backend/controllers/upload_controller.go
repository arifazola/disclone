package controllers

import (
	"log"
	"net/http"

	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-gonic/gin"
)

type UploadController struct {
	S3Service *services.S3Service
}

func (controller *UploadController) GenerateUploadUrl(ctx *gin.Context) {
	key := "users/test/abc"
	url, err := controller.S3Service.GenerateUploadURL(ctx, "disclone-622232422815-ap-southeast-2-an", key)

	if err != nil {
		log.Println("error generating upload url", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot create upload url"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"uploadUrl": url})

}
