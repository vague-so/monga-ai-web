import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { DbClient } from '../../db/index';
import { blocks, models } from '../../schemas';
import { AppError } from '../../lib/AppError';
import type { CreateBlockInput } from '../../validators/block';

async function getModelById(db: DbClient, modelId: string) {
  return db
    .select()
    .from(models)
    .where(eq(models.id, modelId))
    .limit(1)
    .then(([model]) => {
      if (!model) {
        throw new AppError(
          `Model not found for id: ${modelId}`,
          StatusCodes.NOT_FOUND,
        );
      }
      return model;
    });
}

async function ensureNoExistingBlock(db: DbClient, modelId: string) {
  return db
    .select()
    .from(blocks)
    .where(eq(blocks.modelId, modelId))
    .limit(1)
    .then(([existing]) => {
      if (existing) {
        throw new AppError(
          `Block already exists with model id: ${modelId}`,
          StatusCodes.CONFLICT,
        );
      }
    });
}

function validateDefaults(defaults: Record<string, any>, modelConfig: any) {
  const allowedParams = Object.keys(modelConfig?.parameters ?? {});
  const providedParams = Object.keys(defaults ?? {});

  const invalidParams = providedParams.filter(
    (p) => !allowedParams.includes(p),
  );

  if (invalidParams.length > 0) {
    throw new AppError(
      `Invalid parameters in defaults: ${invalidParams.join(', ')}`,
      StatusCodes.BAD_REQUEST,
    );
  }
}

async function insertBlock(db: DbClient, input: CreateBlockInput) {
  return db
    .insert(blocks)
    .values({
      name: input.name,
      type: input.type,
      modelId: input.modelId,
      defaults: input.defaults ?? {},
    })
    .returning()
    .then(([created]) => {
      if (!created) {
        throw new AppError(
          'Failed to create block',
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }
      return created;
    })
    .catch((err: any) => {
      console.error('DB INSERT ERROR 👉', err);
      throw new AppError(
        'Failed to create block',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    });
}

async function fetchBlockWithModel(db: DbClient, blockId: string) {
  return db
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
    .where(eq(blocks.id, blockId))
    .limit(1)
    .then(([result]) => {
      if (!result) {
        throw new AppError(
          'Failed to fetch created block',
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }
      const { modelId, ...rest } = result;
      return {
        ...rest,
        modelId,
      };
    });
}

export const createBlock = async (db: DbClient, input: CreateBlockInput) => {
  const model = await getModelById(db, input.modelId);
  await ensureNoExistingBlock(db, input.modelId);
  validateDefaults(input.defaults ?? {}, model.config);

  const created = await insertBlock(db, input);
  return await fetchBlockWithModel(db, created.id);
};
