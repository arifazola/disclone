package internal

import (
	"context"

	"github.com/arifazola/disclone/backend/repositories"
)

type TransactionManager interface {
	ExecTx(
		ctx context.Context,
		fn func(repositories.TxRepositories) error,
	) error
}
