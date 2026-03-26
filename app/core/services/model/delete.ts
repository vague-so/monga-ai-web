import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { DbClient } from '../../db/index';
import { models } from '../../schemas';
import { AppError } from '../../lib/AppError';

export const deleteModel = async (db: DbClient, id: string) => {
  const [deleted] = await db
    .delete(models)
    .where(eq(models.id, id))
    .returning();

  if (!deleted) {
    throw new AppError(`Model not found with id: ${id}`, StatusCodes.NOT_FOUND);
  }

  return deleted;
};
