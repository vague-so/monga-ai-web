import {
	pgTable,
	uuid,
	text,
	jsonb,
	timestamp,
	index,
} from "drizzle-orm/pg-core";

export const blocks = pgTable(
	"blocks",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: text("name").notNull(),
		type: text("type").notNull(),
		modelId: uuid("model_id").notNull(),
		inputSchema: jsonb("input_schema").notNull(),
		defaults: jsonb("defaults"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		index("blocks_type_idx").on(table.type),
		index("blocks_model_idx").on(table.modelId),
	],
);

export type Block = typeof blocks.$inferSelect;
export type NewBlock = typeof blocks.$inferInsert;
