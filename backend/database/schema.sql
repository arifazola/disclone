-- db/schema.sql

CREATE TABLE IF NOT EXISTS public.users
(
    id text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    username text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    "profilePricture" text COLLATE pg_catalog."default",
    "joinedDate" bigint NOT NULL DEFAULT 0,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT "userEmailUnique" UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.servers
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    "createdBy" text COLLATE pg_catalog."default" NOT NULL,
    picture text COLLATE pg_catalog."default",
    CONSTRAINT servers_pkey PRIMARY KEY (id),
    CONSTRAINT "serversCreatedBy_pk" FOREIGN KEY ("createdBy")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.channels
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "serverId" text COLLATE pg_catalog."default" NOT NULL,
    "channelName" text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT channels_pkey PRIMARY KEY (id),
    CONSTRAINT "channelServerId_pk" FOREIGN KEY ("serverId")
        REFERENCES public.servers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public."userServers"
(
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    "serverId" text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "serverId_userServers_pk" FOREIGN KEY ("serverId")
        REFERENCES public.servers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT userid_userserver_pk FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public."refreshTokens"
(
    id uuid NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    "createdAt" bigint NOT NULL,
    "expiresAt" bigint NOT NULL,
    token text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "refreshTokens_pkey" PRIMARY KEY (id),
    CONSTRAINT "refreshToken_userId_pk" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.friends
(
    user_id text COLLATE pg_catalog."default" NOT NULL,
    friend text COLLATE pg_catalog."default" NOT NULL,
    status smallint NOT NULL DEFAULT 0,
    CONSTRAINT friend_friends_userid_fk FOREIGN KEY (friend)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT user_id_friends_fk FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.chats
(
    id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT chats_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."chatParticipants"
(
    chat_id text COLLATE pg_catalog."default" NOT NULL,
    participants text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "chatParticipants_chat_id_fk" FOREIGN KEY (chat_id)
        REFERENCES public.chats (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "chatParticipants_participant_fk" FOREIGN KEY (participants)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.messages
(
    id text COLLATE pg_catalog."default" NOT NULL,
    chat_id text COLLATE pg_catalog."default" NOT NULL,
    sender text COLLATE pg_catalog."default" NOT NULL,
    message text COLLATE pg_catalog."default" NOT NULL,
    "timestamp" bigint NOT NULL,
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_chat_id_fk FOREIGN KEY (chat_id)
        REFERENCES public.chats (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT messages_sender_fk FOREIGN KEY (sender)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public."channelParticipants"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "serverId" text COLLATE pg_catalog."default" NOT NULL,
    "channelId" text COLLATE pg_catalog."default" NOT NULL,
    username text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "channelParticipants_pkey" PRIMARY KEY (id),
    CONSTRAINT channel_id_fk FOREIGN KEY ("channelId")
        REFERENCES public.channels (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT server_id_fk FOREIGN KEY ("serverId")
        REFERENCES public.servers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);