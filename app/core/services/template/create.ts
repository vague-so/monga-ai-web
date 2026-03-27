import { eq, inArray } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { DbClient } from '../../db/index';
import { blocks, templates, templateBlocks } from '../../schemas';
import { AppError } from '../../lib/AppError';
import type { CreateTemplateInput } from '../../validators/template';

async function validateBlockIds(
  db: DbClient,
  blockStack: CreateTemplateInput['blockStack'],
) {
  const uniqueInputIds = [
    ...new Set(
      blockStack.map(function (b) {
        return b.blockId;
      }),
    ),
  ];

  const existingBlocks = await db
    .select({ id: blocks.id })
    .from(blocks)
    .where(inArray(blocks.id, uniqueInputIds));

  const existingIds = existingBlocks.map(function (b) {
    return b.id;
  });

  const invalidIds = uniqueInputIds.filter(function (id) {
    return !existingIds.includes(id);
  });

  if (invalidIds.length > 0) {
    throw new AppError(
      `The following Block IDs do not exist: ${invalidIds.join(', ')}`,
      StatusCodes.BAD_REQUEST,
    );
  }

  return true;
}

export async function createTemplate(db: DbClient, input: CreateTemplateInput) {
  await validateBlockIds(db, input.blockStack);

  const [createdTemplate] = await db
    .insert(templates)
    .values({
      title: input.title,
      description: input.description || null,
    })
    .returning();

  const blocksToInsert = input.blockStack.map(function (item) {
    return {
      templateId: createdTemplate.id,
      blockId: item.blockId,
      order: item.order,
      inputMapping: item.inputMapping || {},
    };
  });

  await db.insert(templateBlocks).values(blocksToInsert);

  const populatedStack = await db
    .select({
      id: templateBlocks.id,
      order: templateBlocks.order,
      inputMapping: templateBlocks.inputMapping,
      blockId: {
        id: blocks.id,
        name: blocks.name,
      },
    })
    .from(templateBlocks)
    .leftJoin(blocks, eq(templateBlocks.blockId, blocks.id))
    .where(eq(templateBlocks.templateId, createdTemplate.id));

  return {
    ...createdTemplate,
    blockStack: populatedStack,
  };
}
