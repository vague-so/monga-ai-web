import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import type { DbClient } from '../../db/index';
import { blocks } from '../../schemas';
import type { NewBlock } from '../../schemas';
import { AppError } from '../../lib/AppError';

export type BlockPatch = Partial<
  Omit<NewBlock, 'id' | 'createdAt' | 'updatedAt'>
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

  return updated;
};
