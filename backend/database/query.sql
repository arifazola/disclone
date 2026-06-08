--db/query.sql

-- name: Test :exec
SELECT 1;

-- name: CreateUser :exec
INSERT INTO public.users(
	id, email, username, password)
	VALUES ($1, $2, $3, $4);