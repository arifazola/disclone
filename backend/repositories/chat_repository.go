package repositories

import (
	"context"
)

type ChatRepository interface {
	InitChat(ctx context.Context, id string) error
}