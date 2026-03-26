import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { DbClient } from '../../db/index';
import { blocks } from '../../schemas';
import { AppError } from '../../lib/AppError';

export const deleteBlock = async (db: DbClient, id: string) => {
  const [deleted] = await db
    .delete(blocks)
    .where(eq(blocks.id, id))
    .returning();

  if (!deleted) {
    throw new AppError(`Block not found with id: ${id}`, StatusCodes.NOT_FOUND);
  }

  return deleted;
};
