package repositories

type MockUserServerRepository struct {
	Err error
}

func (m *MockUserServerRepository) CreateUserServer(userID string, serverID string) error {
	return m.Err
}
