import { eq } from 'drizzle-orm';
import type { DbClient } from '../../db/index';
import { templates } from '../../schemas';
import { AppError } from '@/core/lib/AppError';
import { StatusCodes } from 'http-status-codes';

export const deleteTemplate = async (db: DbClient, id: string) => {
  const [deleted] = await db
    .delete(templates)
    .where(eq(templates.id, id))
    .returning();

  if (!deleted) {
    throw new AppError(
      `Template not found with id: ${id}`,
      StatusCodes.NOT_FOUND,
    );
  }

  return deleted;
};
