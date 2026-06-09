package main

import (
	"database/sql"
	"errors"
	"testing"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
	"github.com/arifazola/disclone/backend/services"
	"github.com/stretchr/testify/assert"
)

func TestRegisterSuccess(t *testing.T) {
	authService := services.AuthService{
		UserRepository: &repositories.MockUserRepository{
			Err: nil,
		},
	}

	user := db.User{
		ID:       "abc",
		Email:    "test@gmail.com",
		Username: "testuser",
		Password: "Password123!",
		ProfilePricture: sql.NullString{
			String: "",
			Valid:  false,
		},
	}
	err := authService.RegisterUser(user, t.Context())

	assert.Nil(t, err, "Expected error to be nil")
}

func TestRegisterEmailInvalid(t *testing.T) {
	authService := services.AuthService{
		UserRepository: &repositories.MockUserRepository{
			Err: nil,
		},
	}
	user := db.User{
		ID:       "",
		Email:    "invalid-email",
		Username: "testuser",
		Password: "password",
		ProfilePricture: sql.NullString{
			String: "",
			Valid:  false,
		},
	}
	err := authService.RegisterUser(user, t.Context())

	assert.NotNil(t, err, "Expected error for invalid email")
}

func TestRegisterPasswordInvalid(t *testing.T) {
	authService := services.AuthService{
		UserRepository: &repositories.MockUserRepository{
			Err: nil,
		},
	}
	user := db.User{
		ID:       "",
		Email:    "test@example.com",
		Username: "testuser",
		Password: "weak",
		ProfilePricture: sql.NullString{
			String: "",
			Valid:  false,
		},
	}
	err := authService.RegisterUser(user, t.Context())

	assert.NotNil(t, err, "Expected error for invalid password")
}

func TestRegisterDuplicateEmail(t *testing.T) {
	authService := services.AuthService{
		UserRepository: &repositories.MockUserRepository{
			Err: errors.New("duplicate email"),
		},
	}
	user := db.User{
		ID:       "",
		Email:    "test@example.com",
		Username: "testuser",
		Password: "password",
		ProfilePricture: sql.NullString{
			String: "",
			Valid:  false,
		},
	}
	err := authService.RegisterUser(user, t.Context())

	assert.NotNil(t, err, "Expected error for duplicate email")
}

func TestRegisterRepositoryError(t *testing.T) {
	authService := services.AuthService{
		UserRepository: &repositories.MockUserRepository{
			Err: errors.New("repository error"),
		},
	}
	user := db.User{
		ID:       "",
		Email:    "test@example.com",
		Username: "testuser",
		Password: "password",
		ProfilePricture: sql.NullString{
			String: "",
			Valid:  false,
		},
	}
	err := authService.RegisterUser(user, t.Context())

	assert.NotNil(t, err, "Expected error for repository error")
}
