package auth

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

type Claims struct {
	UserID string `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func GenerateAccessToken(userId string, username string) (string, error) {
	claims := Claims{
		UserID: userId,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: &jwt.NumericDate{
				Time: time.Now().Add(60 * time.Minute),
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

	err := godotenv.Load()
	if err != nil {
		return claims, err
	}

	jwtSecret := []byte(os.Getenv("JWT_TOKEN"))

	token, err := jwt.ParseWithClaims(
		tokenString,
		claims,
		func(t *jwt.Token) (any, error) {
			return jwtSecret, nil
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

func GenerateRefreshToken() string {
	refreshToken := uuid.New().String()
	hash := sha256.Sum256([]byte(refreshToken))
	tokenHash := hex.EncodeToString(hash[:])

	return tokenHash
}
