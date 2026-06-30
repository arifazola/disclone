package handlers

import (
	"context"

	"github.com/arifazola/disclone/backend/internal/db"
)

type FriendRequestHandler interface {
	Handle(ctx context.Context, arg db.UpdateFriendRequestStatusParams) error
}

