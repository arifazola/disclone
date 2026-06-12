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

-- name: CreateServer :exec
INSERT INTO public.servers(
	id, name, "createdBy", picture)
	VALUES ($1, $2, $3, $4);

-- name: AddUserToServer :exec
INSERT INTO public."userServers"(
	"userId", "serverId")
	VALUES ($1, $2);

-- name: InsertRefreshToken :exec
INSERT INTO public."refreshTokens"(
	id, "userId", "createdAt", "expiresAt", token)
	VALUES ($1, $2, $3, $4, $5);

-- name: GetUserJoinedServers :many
SELECT "servers".name from "userServers" LEFT JOIN
public."servers" ON "userServers"."serverId" = "servers"."id"
WHERE "userServers"."userId" = $1;