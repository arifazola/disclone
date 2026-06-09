--db/query.sql

-- name: Test :exec
SELECT 1;

-- name: CreateUser :exec
INSERT INTO public.users(
	id, email, username, password)
	VALUES ($1, $2, $3, $4);

-- name: GetUserByEmail :one
SELECT id, email, username, password, "profilePricture"
	FROM public.users WHERE email = $1;