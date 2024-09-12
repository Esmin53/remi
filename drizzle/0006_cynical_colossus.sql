ALTER TABLE "game" DROP CONSTRAINT "game_room_key_room_key_fk";
--> statement-breakpoint
ALTER TABLE "hand" DROP CONSTRAINT "hand_game_id_game_id_fk";
--> statement-breakpoint
ALTER TABLE "meld" DROP CONSTRAINT "meld_game_id_game_id_fk";
