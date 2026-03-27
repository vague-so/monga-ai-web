import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core';
import { blocks } from './blocks';

export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const templateBlocks = pgTable('template_blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  templateId: uuid('template_id')
    .notNull()
    .references(() => templates.id, { onDelete: 'cascade' }),
  blockId: uuid('block_id')
    .notNull()
    .references(() => blocks.id, { onDelete: 'restrict' }),
  order: integer('order').notNull(),
  inputMapping: jsonb('input_mapping').notNull().default({}),
});

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
export type TemplateBlock = typeof templateBlocks.$inferSelect;
export type NewTemplateBlock = typeof templateBlocks.$inferInsert;
