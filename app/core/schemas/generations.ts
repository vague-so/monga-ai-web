import {
	pgTable,
	uuid,
	text,
	integer,
	jsonb,
	timestamp,
	pgEnum,
	index,
} from "drizzle-orm/pg-core";

export const generationStatusEnum = pgEnum("generation_status", [
	"queued",
	"processing",
	"completed",
	"failed",
]);

export const generations = pgTable(
	"generations",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		templateId: uuid("template_id").notNull(),
		status: generationStatusEnum("status").default("queued").notNull(),
		inputParams: jsonb("input_params").notNull(),
		blockResults: jsonb("block_results"),
		outputUrl: text("output_url"),
		providerCost: integer("provider_cost"),
		errorMessage: text("error_message"),
		startedAt: timestamp("started_at"),
		completedAt: timestamp("completed_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("generations_status_idx").on(table.status),
		index("generations_template_idx").on(table.templateId),
	],
);

export type Generation = typeof generations.$inferSelect;
export type NewGeneration = typeof generations.$inferInsert;
export type GenerationStatus = (typeof generationStatusEnum.enumValues)[number];
