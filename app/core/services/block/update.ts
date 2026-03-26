import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { DbClient } from '../../db/index';
import { blocks, models } from '../../schemas';
import { AppError } from '../../lib/AppError';

export type BlockPatch = Partial<
  Omit<typeof blocks.$inferSelect, 'id' | 'createdAt' | 'updatedAt'>
>;

async function performUpdate(db: DbClient, id: string, input: BlockPatch) {
  return db
    .update(blocks)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(blocks.id, id))
    .returning()
    .then(([updated]) => {
      if (!updated) {
        throw new AppError(
          `Block not found with id: ${id}`,
          StatusCodes.NOT_FOUND,
        );
      }
      return updated;
    });
}

async function fetchUpdatedBlock(db: DbClient, blockId: string) {
  return db
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
        isActive: models.isActive,
        config: models.config,
      },
    })
    .from(blocks)
    .innerJoin(models, eq(blocks.modelId, models.id))
    .where(eq(blocks.id, blockId))
    .limit(1)
    .then(([row]) => {
      if (!row) {
        throw new AppError(
          `Failed to fetch updated block with id: ${blockId}`,
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }
      return row;
    });
}

export const updateBlock = async (
  db: DbClient,
  id: string,
  input: BlockPatch,
) => {
  const updated = await performUpdate(db, id, input);
  const row = await fetchUpdatedBlock(db, updated.id);

  const { model, ...rest } = row;
  return {
    ...rest,
    modelId: model,
  };
};
