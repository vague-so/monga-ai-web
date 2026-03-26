import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const blockDefinitions = pgTable("block_definitions", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	model: text("model").notNull(),
	promptTemplate: text("prompt_template").notNull(),
	parameters: jsonb("parameters"),
	type: text("type").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlockDefinition = typeof blockDefinitions.$inferSelect;
export type NewBlockDefinition = typeof blockDefinitions.$inferInsert;
