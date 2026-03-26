import { eq, and, sql } from 'drizzle-orm';
import type { DbClient } from '../../db/index';
import { blocks } from '../../schemas';
import type { ListBlocksInput } from '../../validators/block';

export const listBlocks = async (db: DbClient, filters: ListBlocksInput) => {
  const { page = 1, limit = 20, type, modelId } = filters;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (type !== undefined) conditions.push(eq(blocks.type, type));
  if (modelId !== undefined) conditions.push(eq(blocks.modelId, modelId));

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(blocks)
      .where(whereClause)
      .orderBy(blocks.createdAt)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(blocks)
      .where(whereClause),
  ]);

  const totalResults = countResult[0]?.count ?? 0;

  return {
    data,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(totalResults / limit),
      totalResults,
    },
  };
};
