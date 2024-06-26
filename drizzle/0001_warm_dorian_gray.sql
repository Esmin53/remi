DO $$ BEGIN
 CREATE TYPE "public"."game_status" AS ENUM('IN_PROGRESS', 'FINISHED', 'INTERRUPTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "room_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "game_status" "game_status";