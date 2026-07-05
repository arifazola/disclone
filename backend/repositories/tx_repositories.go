package repositories

type TxRepositories struct {
	ServerRepo                ServerRepository
	UserServerRepo            UserServerRepository
	FriendRepository          FriendRepository
	ChatRepository            ChatRepository
	ChatParticipantRepository ChatParticipantRepository
}
