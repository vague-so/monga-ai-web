import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { DbClient } from '../../db/index';
import { templates, templateBlocks, blocks } from '../../schemas';
import { AppError } from '../../lib/AppError';
import type { UpdateTemplateInput } from '../../validators/template';

export const updateTemplate = async (
  db: DbClient,
  id: string,
  input: UpdateTemplateInput,
) => {
  const { blockStack, ...templateData } = input;

  const [updated] = await db
    .update(templates)
    .set({ ...templateData, updatedAt: new Date() })
    .where(eq(templates.id, id))
    .returning();

  if (!updated) {
    throw new AppError(
      `Template not found with id: ${id}`,
      StatusCodes.NOT_FOUND,
    );
  }

  if (blockStack !== undefined) {
    await db.delete(templateBlocks).where(eq(templateBlocks.templateId, id));

    const blocksToInsert = blockStack.map((item) => ({
      templateId: id,
      blockId: item.blockId,
      order: item.order,
      inputMapping: item.inputMapping || {},
    }));

    if (blocksToInsert.length > 0) {
      await db.insert(templateBlocks).values(blocksToInsert);
    }
  }

  const finalStack = await db
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
    .where(eq(templateBlocks.templateId, id))
    .orderBy(templateBlocks.order);

  return {
    ...updated,
    blockStack: finalStack,
  };
};
