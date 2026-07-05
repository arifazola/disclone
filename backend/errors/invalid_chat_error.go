package custom_errors

import "errors"

var ErrInvalidChat = errors.New("Invalid chat ID")

type InvalidChatError struct {
	Message string
	Err     error
}

func (err *InvalidChatError) Error() string {
	return err.Message
}

func (err *InvalidChatError) Unwrap() error {
	return err.Err
}