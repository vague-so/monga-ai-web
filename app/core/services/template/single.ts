import { eq } from 'drizzle-orm';
import type { DbClient } from '../../db/index';
import { blocks, templates, templateBlocks } from '../../schemas';
import { AppError } from '../../lib/AppError';
import { StatusCodes } from 'http-status-codes';

export const singleTemplate = async (db: DbClient, id: string) => {
  const [template] = await db
    .select()
    .from(templates)
    .where(eq(templates.id, id))
    .limit(1);

  if (!template) {
    throw new AppError(
      `Template not found with id: ${id}`,
      StatusCodes.NOT_FOUND,
    );
  }

  const stackItems = await db
    .select({
      id: templateBlocks.id,
      order: templateBlocks.order,
      inputMapping: templateBlocks.inputMapping,
      blockId: {
        id: blocks.id,
        name: blocks.name,
        type: blocks.type,
      },
    })
    .from(templateBlocks)
    .leftJoin(blocks, eq(templateBlocks.blockId, blocks.id))
    .where(eq(templateBlocks.templateId, id))
    .orderBy(templateBlocks.order);

  return {
    ...template,
    blockStack: stackItems,
  };
};
