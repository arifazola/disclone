package repositories

import (
	"context"
	"database/sql"

	"github.com/arifazola/disclone/backend/internal/db"
	"golang.org/x/crypto/bcrypt"
)

type MockUserRepository struct {
	Err error
}

func (m *MockUserRepository) CreateUser(user db.User, context context.Context) error {
	if m.Err != nil {
		return m.Err
	}

	return nil
}

func (m *MockUserRepository) GetUserByEmailAndPassword(email string, password string, context context.Context) (db.User, error) {
	if m.Err != nil {
		return db.User{}, m.Err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("test1234"), bcrypt.DefaultCost)
	if err != nil {
		return db.User{}, err
	}

	return db.User{
		ID:       "abc",
		Email:    "test@gmail.com",
		Username: "testuser",
		Password: string(hashedPassword),
		ProfilePricture: sql.NullString{
			String: "",
			Valid:  false,
		},
	}, nil
}

func (m *MockUserRepository) GetUserIDByUsername(ctx context.Context, username string) (string, error){
	if m.Err != nil {
		return "", m.Err
	}

	return "test", nil
}

func (m *MockUserRepository) GetUserByUsername(ctx context.Context, username string) (db.User, error) {
	if m.Err != nil {
		return db.User{}, m.Err
	}

	return db.User{}, nil
}

func (m *MockUserRepository) GetUsersByIDs(ctx context.Context, dollar_1 []string) ([]db.GetUsersByIDsRow, error){
	if m.Err != nil {
		return []db.GetUsersByIDsRow{}, m.Err
	}

	return []db.GetUsersByIDsRow{}, nil
}
