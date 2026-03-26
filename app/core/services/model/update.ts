import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { DbClient } from '../../db/index';
import { models } from '../../schemas';
import type { NewModel } from '../../schemas';
import { AppError } from '../../lib/AppError';

export type ModelPatch = Partial<
  Omit<NewModel, 'id' | 'createdAt' | 'updatedAt'>
>;

export const updateModel = async (
  db: DbClient,
  id: string,
  input: ModelPatch,
) => {
  const [updated] = await db
    .update(models)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(models.id, id))
    .returning();

  if (!updated) {
    throw new AppError(`Model not found with id: ${id}`, StatusCodes.NOT_FOUND);
  }

  return updated;
};
