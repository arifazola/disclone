package repositories

type UserServerRepository interface {
	// CreateUserServer creates a new user-server association in the database.
	CreateUserServer(userID string, serverID string) error
}
