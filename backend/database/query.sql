--db/query.sql

-- name: Test :exec
SELECT 1;

-- name: CreateUser :exec
INSERT INTO public.users(
	id, email, username, password)
	VALUES ($1, $2, $3, $4);

-- name: GetUserByEmail :one
SELECT id, email, username, password, "profilePricture", "joinedDate"
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
SELECT "servers".id, "servers".name, "servers".picture from "userServers" LEFT JOIN
public."servers" ON "userServers"."serverId" = "servers"."id"
WHERE "userServers"."userId" = $1;

-- name: CreateChannel :exec
INSERT INTO public.channels(
	id, "serverId", "channelName", type)
	VALUES ($1, $2, $3, $4);

-- name: GetServerChannels :many
SELECT id, "serverId", "channelName", type
	FROM public.channels WHERE "serverId" = $1;

-- name: CountUserServerByUserId :one
SELECT COUNT("userId") as "userServer"
	FROM public."userServers" WHERE "userId" = $1 AND "serverId" = $2;

-- name: AddFriend :exec
INSERT INTO public.friends(
	user_id, friend, status)
	VALUES ($1, $2, $3);

-- name: GetUserIDByUsername :one
SELECT id FROM public.users WHERE username = $1;

-- name: GetFriendList :many
SELECT "users".username, "friends".* FROM public.friends
LEFT JOIN "users"
ON "friends".friend = "users"."id" WHERE "friends"."user_id" = $1;

-- name: GetFriendRequest :many
SELECT "users".username, "friends".* FROM public.friends
LEFT JOIN "users"
ON "friends"."user_id" = "users"."id" WHERE "friends"."friend" = $1 AND status = 0;

-- name: UpdateFriendRequestStatus :exec
UPDATE public.friends
	SET status=$1
	WHERE user_id = $2 AND friend = $3;

-- name: DeleteFriendRequest :exec
DELETE FROM public.friends
	WHERE user_id = $1 AND friend = $2;

-- name: GetUserByUsername :one
SELECT * FROM public.users WHERE username = $1;

-- name: GetMutualFriends :many
SELECT DISTINCT("friends".user_id), "users".username, "users"."profilePricture"
	FROM public.friends 
	INNER JOIN public.users
	ON "friends".user_id = "users".id
	WHERE "friends"."status" = 1 AND ("friends".friend = $1 
	OR "friends".friend = $2) AND ("friends".user_id != $1 AND "friends".user_id != $2);

-- name: GetMutualServers :many
SELECT DISTINCT("servers".id), "servers"."name", "servers".picture
FROM "userServers"
INNER JOIN "servers"
ON "servers"."id" = "userServers"."serverId"
WHERE "userServers"."userId" = $1
OR "userServers"."userId" = $2;

-- name: InitChat :exec 
INSERT INTO public.chats(
	id)
	VALUES ($1);

-- name: InitChatParticipants :exec
INSERT INTO public."chatParticipants"(
	chat_id, participants)
	VALUES ($1, $2), ($1, $3);

-- name: GetChatIDFromParticipants :one
SELECT chat_id
FROM "chatParticipants"
WHERE participants IN ($1, $2)
GROUP BY chat_id
HAVING COUNT(DISTINCT participants) = 2;

-- name: AddMessage :exec
INSERT INTO public.messages(
	id, chat_id, sender, message, "timestamp")
	VALUES ($1, $2, $3, $4, $5);

-- name: GetChatIDFromOneParticipant :one
SELECT DISTINCT(chat_id) FROM public."chatParticipants" 
WHERE participants = $1;

-- name: GetMessages :many
SELECT * FROM public.messages WHERE chat_id = $1
ORDER BY timestamp ASC;

-- name: ValidateChatAccess :one
SELECT * FROM public."chatParticipants"
WHERE chat_id = $1 AND participants = $2;