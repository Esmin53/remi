import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
    id: serial("id").notNull().primaryKey(),
    username: text("name").unique().notNull(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()   
})