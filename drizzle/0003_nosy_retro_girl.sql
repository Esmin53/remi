CREATE TABLE IF NOT EXISTS "meld" (
	"id" serial PRIMARY KEY NOT NULL,
	"cards" integer[],
	"game_id" integer,
	"player" text
);
