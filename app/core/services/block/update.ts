import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { DbClient } from '../../db/index';
import { blocks, models } from '../../schemas';
import { AppError } from '../../lib/AppError';

export type BlockPatch = Partial<
  Omit<typeof blocks.$inferSelect, 'id' | 'createdAt' | 'updatedAt'>
>;

export const updateBlock = async (
  db: DbClient,
  id: string,
  input: BlockPatch,
) => {
  const [updated] = await db
    .update(blocks)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(blocks.id, id))
    .returning();

  if (!updated) {
    throw new AppError(`Block not found with id: ${id}`, StatusCodes.NOT_FOUND);
  }

  const [row] = await db
    .select({
      id: blocks.id,
      name: blocks.name,
      type: blocks.type,
      defaults: blocks.defaults,
      createdAt: blocks.createdAt,
      updatedAt: blocks.updatedAt,
      model: {
        id: models.id,
        displayName: models.displayName,
        providerId: models.providerId,
        type: models.type,
        costPerRun: models.costPerRun,
      },
    })
    .from(blocks)
    .innerJoin(models, eq(blocks.modelId, models.id))
    .where(eq(blocks.id, updated.id))
    .limit(1);

  if (!row) {
    throw new AppError(
      `Failed to fetch updated block with id: ${id}`,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  const { model, ...rest } = row;
  return {
    ...rest,
    modelId: model,
  };
};
