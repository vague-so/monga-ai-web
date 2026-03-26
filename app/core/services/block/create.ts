import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { DbClient } from '../../db/index';
import { blocks, models } from '../../schemas';
import { AppError } from '../../lib/AppError';
import type { CreateBlockInput } from '../../validators/block';

export const createBlock = async (db: DbClient, input: CreateBlockInput) => {
  const { name, type, modelId } = input;
  const defaults = input.defaults ?? {};

  const [model] = await db
    .select()
    .from(models)
    .where(eq(models.id, modelId))
    .limit(1);

  if (!model) {
    throw new AppError(
      `Model not found for id: ${modelId}`,
      StatusCodes.NOT_FOUND,
    );
  }

  const [existing] = await db
    .select()
    .from(blocks)
    .where(eq(blocks.modelId, modelId))
    .limit(1);

  if (existing) {
    throw new AppError(
      `Block already exists with model id: ${modelId}`,
      StatusCodes.CONFLICT,
    );
  }

  const allowedParams = Object.keys(model.config?.parameters ?? {});
  const providedParams = Object.keys(defaults);

  const invalidParams = providedParams.filter(
    (p) => !allowedParams.includes(p),
  );

  if (invalidParams.length > 0) {
    throw new AppError(
      `Invalid parameters in defaults: ${invalidParams.join(', ')}`,
      StatusCodes.BAD_REQUEST,
    );
  }

  let created;
  try {
    [created] = await db
      .insert(blocks)
      .values({
        name,
        type,
        modelId,
        defaults,
      })
      .returning();
  } catch (err: any) {
    console.error('DB INSERT ERROR 👉', err);

    throw new AppError(
      'Failed to create block',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  const [result] = await db
    .select({
      id: blocks.id,
      name: blocks.name,
      type: blocks.type,
      defaults: blocks.defaults,
      createdAt: blocks.createdAt,
      updatedAt: blocks.updatedAt,
      modelId: {
        id: models.id,
        displayName: models.displayName,
        providerId: models.providerId,
        type: models.type,
        costPerRun: models.costPerRun,
        config: models.config,
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

  return result;
};
