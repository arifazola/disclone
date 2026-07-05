package custom_errors

import "errors"

var ErrInvalidUsername = errors.New("Invalid username")

type InvalidUsernameError struct {
	Message string
	Err     error
}

func (err *InvalidUsernameError) Error() string {
	return err.Message
}

func (err *InvalidUsernameError) Unwrap() error {
	return err.Err
}