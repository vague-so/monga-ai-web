import {
    pgTable,
    uuid,
    text,
    boolean,
    integer,
    jsonb,
    timestamp,
    uniqueIndex,
    index
} from "drizzle-orm/pg-core";

export const models = pgTable("models", {
    id: uuid("id").primaryKey().defaultRandom(),
    providerId: text("provider_id").notNull(),
    modelId: text("model_id").notNull(),
    displayName: text("display_name").notNull(),
    type: text("type").notNull(),
    costPerRun: integer("cost_per_run").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    config: jsonb("config").$type<{
        api_path?: string;
        input_type?: string;
        aspect_ratios?: string[];
    }>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
    index("provider_idx").on(table.providerId),
    uniqueIndex("provider_model_unique_idx").on(table.providerId, table.modelId),
]);

export type Model = typeof models.$inferSelect;
export type NewModel = typeof models.$inferInsert;
