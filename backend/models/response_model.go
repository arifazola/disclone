package models

type ResponseModel[T any] struct {
	Message string
	Data    T
}