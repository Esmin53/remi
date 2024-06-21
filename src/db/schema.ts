import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
    id: serial("id").notNull().primaryKey(),
    username: text("name").unique().notNull(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),  
    roomKey: text("room_key")
})

export const userRelations = relations(users, ({ one }) => ({
    rooms: one(rooms, { fields: [users.roomKey], references: [rooms.key] }) 
}))

export const rooms = pgTable("room", {
    key: text("key").notNull().primaryKey(),
    allowRandom: boolean("allow_random").default(false),
    ownerName: text("owner_name")
})

export const roomRelations = relations(rooms, ({ one, many }) => ({
    owner: one(users, {
        fields: [rooms.ownerName],
        references: [users.username],
    }),
    players: many(users)
}))