ALTER TABLE "game" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "winner" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "player_drew" boolean DEFAULT false NOT NULL;