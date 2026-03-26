import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const templates = pgTable("templates", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: text("title").notNull(),
	blockStack: jsonb("block_stack").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
