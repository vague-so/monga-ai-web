import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { DbClient } from '../../db/index';
import { blocks } from '../../schemas';
import { AppError } from '../../lib/AppError';

export const singleBlock = async (db: DbClient, id: string) => {
  const [block] = await db
    .select()
    .from(blocks)
    .where(eq(blocks.id, id))
    .limit(1);

  if (!block) {
    throw new AppError(`Block not found with id: ${id}`, StatusCodes.NOT_FOUND);
  }

  return block;
};
