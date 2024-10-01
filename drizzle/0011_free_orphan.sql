ALTER TABLE "room" ADD COLUMN "table" text NOT NULL;--> statement-breakpoint
ALTER TABLE "room" ADD COLUMN "deck" text NOT NULL;--> statement-breakpoint
ALTER TABLE "room" ADD COLUMN "last_pinged" timestamp;