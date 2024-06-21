ALTER TABLE "room" RENAME COLUMN "author_name" TO "owner_name";--> statement-breakpoint
ALTER TABLE "room" ADD COLUMN "players" text;