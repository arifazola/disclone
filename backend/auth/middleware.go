package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		//Could use Auth Header Bearer in case the API is used in mobile or any other device than browser
		cookie, err := ctx.Cookie("access_token")

		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
			return
		}

		claims, err := ValidateAccessToken(cookie)

		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "unauthorized"})
			return
		}

		ctx.Set("userID", claims.UserID)
		ctx.Next()
	}

}
