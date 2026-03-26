import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { DbClient } from '../../db/index';
import { blocks, models } from '../../schemas';
import { AppError } from '../../lib/AppError';

export const singleBlock = async (db: DbClient, id: string) => {
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
        isActive: models.isActive,
        config: models.config,
      },
    })
    .from(blocks)
    .innerJoin(models, eq(blocks.modelId, models.id))
    .where(eq(blocks.id, id))
    .limit(1);

  if (!row) {
    throw new AppError(`Block not found with id: ${id}`, StatusCodes.NOT_FOUND);
  }

  const { model, ...rest } = row;
  return {
    ...rest,
    modelId: model,
  };
};
