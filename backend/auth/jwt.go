package auth

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

type Claims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

func GenerateAccessToken(userId string) (string, error) {
	claims := Claims{
		UserID: userId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: &jwt.NumericDate{
				Time: time.Now().Add(15 * time.Minute),
			},
			IssuedAt: &jwt.NumericDate{
				Time: time.Now(),
			},
			Issuer: "disclone",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	err := godotenv.Load()
	if err != nil {
		return "", err
	}

	jwtSecret := []byte(os.Getenv("JWT_TOKEN"))

	return token.SignedString(jwtSecret)
}

func ValidateAccessToken(tokenString string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(
		tokenString,
		claims,
		func(t *jwt.Token) (any, error) {
			return t, nil
		},
	)

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("token is invalid")
	}

	return claims, nil
}
