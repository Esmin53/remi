CREATE TABLE IF NOT EXISTS "game" (
	"id" serial PRIMARY KEY NOT NULL,
	"deck" integer[],
	"turn_order" text[],
	"current_turn" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hand" (
	"id" serial PRIMARY KEY NOT NULL,
	"cards" integer[],
	"game_id" integer,
	"player" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room" (
	"key" text PRIMARY KEY NOT NULL,
	"allow_random" boolean DEFAULT false,
	"owner_name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"room_key" text,
	"game_id" integer,
	CONSTRAINT "user_name_unique" UNIQUE("name")
);
