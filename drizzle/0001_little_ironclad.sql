CREATE TABLE IF NOT EXISTS "room" (
	"key" text PRIMARY KEY NOT NULL,
	"allow_random" boolean DEFAULT false,
	"author_name" text
);
