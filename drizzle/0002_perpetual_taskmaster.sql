ALTER TABLE "room" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "room" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;