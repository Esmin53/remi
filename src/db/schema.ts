import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
    id: serial("id").notNull().primaryKey(),
    username: text("name").unique().notNull(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),  
    roomKey: text("room_key"),
    gameId: integer("game_id")
})

export const userRelations = relations(users, ({ one, many }) => ({
    rooms: one(rooms, { fields: [users.roomKey], references: [rooms.key] }),
    games: one(games, { fields: [users.gameId], references: [games.id]}),
    hands: many(hand)
}))

export const rooms = pgTable("room", {
    key: text("key").notNull().primaryKey(),
    allowRandom: boolean("allow_random").default(false),
    ownerName: text("owner_name"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),  
})

export const roomRelations = relations(rooms, ({ one, many }) => ({
    owner: one(users, {
        fields: [rooms.ownerName],
        references: [users.username],
    }),
    players: many(users),
    games: many(games)
}))

export const gameStatusEnum = pgEnum('game_status', ['IN_PROGRESS', 'FINISHED', 'INTERRUPTED']);

export const games = pgTable("game", {
    id: serial("id").notNull().primaryKey(),
    deck: integer("deck").array(),
    turnOrder: text("turn_order").array(),
    currentTurn: text("current_turn"),
    roomKey: text("room_key").notNull(),
    gameStatus: gameStatusEnum("game_status")
})

export const gameRelations = relations(games, ({ one, many }) => ({
    currentTurn: one(users, {
        fields: [games.currentTurn],
        references: [users.username]
    }),
    room: one(rooms, {
        fields: [games.roomKey],
        references: [rooms.key]
    }),
    players: many(users),
    hands: many(hand)
}))


export const hand = pgTable("hand", {
    id: serial("id").notNull().primaryKey(),
    cards: integer("cards").array(),
    gameId: integer("game_id"),
    player: text("player")
})  

export const handRelations = relations(hand, ({ one }) => ({
    game: one(games, {
        fields: [hand.gameId],
        references: [games.id]
    }),
    player: one(users, {
        fields: [hand.player],
        references: [users.username]
    }),
}))

export const meld = pgTable("meld", {
    id: serial("id").notNull().primaryKey(),
    cards: integer("cards").array(),
    gameId: integer("game_id"),
    player: text("player")
})  

export const meldRelations = relations(meld, ({ one }) => ({
    game: one(games, {
        fields: [meld.gameId],
        references: [games.id]
    }),
    player: one(users, {
        fields: [meld.player],
        references: [users.username]
    }),
}))