import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { DbClient } from '../../db/index';
import { blocks, models } from '../../schemas';
import { AppError } from '../../lib/AppError';
import type { CreateBlockInput } from '../../validators/block';

export const createBlock = async (db: DbClient, input: CreateBlockInput) => {
  const { modelId } = input;

  const [existing] = await db
    .select({ id: blocks.id })
    .from(blocks)
    .where(eq(blocks.modelId, modelId))
    .limit(1);

  if (existing) {
    throw new AppError(
      `Block already exists for model with id: ${modelId}`,
      StatusCodes.CONFLICT,
    );
  }

  const [created] = await db.insert(blocks).values(input).returning();

  const [result] = await db
    .select({
      id: blocks.id,
      name: blocks.name,
      type: blocks.type,
      modelId: blocks.modelId,
      inputSchema: blocks.inputSchema,
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
    .where(eq(blocks.id, created.id))
    .limit(1);

  if (!result) {
    throw new AppError(
      'Failed to fetch created block',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return {
    ...result,
    modelId: result.model,
  };
};
