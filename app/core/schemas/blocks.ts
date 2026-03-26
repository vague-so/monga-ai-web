import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { models } from './models';

export const blocks = pgTable(
  'blocks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    modelId: uuid('model_id')
      .notNull()
      .unique()
      .references(() => models.id, { onDelete: 'restrict' }),
    defaults: jsonb('defaults')
      .$type<Record<string, any>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('blocks_type_idx').on(table.type),
    index('blocks_model_idx').on(table.modelId),
  ],
);
