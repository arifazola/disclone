package validators

import (
	"errors"
	"net/mail"
)

func Email(email string) error {
	addr, err := mail.ParseAddress(email)

	if err != nil {
		return err
	}

	if addr.Address != email {
		return errors.New("invalid email")
	}
	return nil
}
