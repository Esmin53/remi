import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
    id: serial("id").notNull().primaryKey(),
    username: text("name").unique().notNull(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()   
})

export const userRelations = relations(users, ({ many }) => ({
    rooms: many(rooms) 
}))

export const rooms = pgTable("room", {
    key: text("key").notNull().primaryKey(),
    allowRandom: boolean("allow_random").default(false),
    ownerName: text("author_name")
})

export const roomRelations = relations(rooms, ({ one}) => ({
    author: one(users, {
        fields: [rooms.ownerName],
        references: [users.username]
    })
}))