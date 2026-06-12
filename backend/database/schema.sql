-- db/schema.sql

CREATE TABLE IF NOT EXISTS public.users
(
    id text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    username text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    "profilePricture" text COLLATE pg_catalog."default",
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
