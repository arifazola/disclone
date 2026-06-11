package helpers

import (
	"context"
	"database/sql"

	"github.com/arifazola/disclone/backend/internal/db"
	"github.com/arifazola/disclone/backend/repositories"
)

type Store struct {
	Queries *db.Queries
	DB      *sql.DB
}

func (s *Store) ExecTx(
	ctx context.Context,
	fn func(repositories.TxRepositories) error,
) error {
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer tx.Rollback()

	qtx := s.Queries.WithTx(tx)

	repos := repositories.TxRepositories{
		ServerRepo:     repositories.NewServerRepository(qtx),
		UserServerRepo: repositories.NewUserServerRepository(qtx),
	}

	if err := fn(repos); err != nil {
		return err
	}

	return tx.Commit()
}
