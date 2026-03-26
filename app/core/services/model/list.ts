import { eq, and, sql } from 'drizzle-orm';
import type { DbClient } from '../../db/index';
import { models } from '../../schemas';
import type { ListModelsInput } from '../../validators/model';

export const listModels = async (db: DbClient, filters: ListModelsInput) => {
  const { page = 1, limit = 10, isActive, type } = filters;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (isActive !== undefined) conditions.push(eq(models.isActive, isActive));
  if (type !== undefined) conditions.push(eq(models.type, type));

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(models)
      .where(whereClause)
      .orderBy(models.createdAt)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(models)
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
