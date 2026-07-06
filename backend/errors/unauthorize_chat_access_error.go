package custom_errors

import "errors"

var ErrUnauthorizedChatAccess= errors.New("Unauthorized")

type UnauthorizedChatAccessError struct {
	Message string
	Err     error
}

func (err *UnauthorizedChatAccessError) Error() string {
	return err.Message
}

func (err *UnauthorizedChatAccessError) Unwrap() error {
	return err.Err
}