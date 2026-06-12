package controllers

import (
	"log"
	"net/http"

	"github.com/arifazola/disclone/backend/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UploadController struct {
	S3Service *services.S3Service
}

func (controller *UploadController) GenerateUploadURL(ctx *gin.Context) {
	filename := ctx.PostForm("filename")
	salt := uuid.New().String()
	finalFilename := salt + "_" + filename
	key := "server/icon/" + finalFilename
	url, err := controller.S3Service.GenerateUploadURL(ctx, "disclone-622232422815-ap-southeast-2-an", key)

	if err != nil {
		log.Println("error generating upload url", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot create upload url"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"uploadUrl": url, "resultUrl": key})

}
