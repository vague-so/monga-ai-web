import { eq, and, sql } from 'drizzle-orm';
import type { DbClient } from '../../db/index';
import { blocks, models } from '../../schemas';
import type { ListBlocksInput } from '../../validators/block';

function buildWhereClause(filters: ListBlocksInput) {
  const conditions = [];
  if (filters.type !== undefined)
    conditions.push(eq(blocks.type, filters.type));
  if (filters.modelId !== undefined)
    conditions.push(eq(blocks.modelId, filters.modelId));

  return conditions.length ? and(...conditions) : undefined;
}

function fetchBlocks(
  db: DbClient,
  whereClause: any,
  offset: number,
  limit: number,
) {
  return db
    .select({
      id: blocks.id,
      name: blocks.name,
      type: blocks.type,
      defaults: blocks.defaults,
      createdAt: blocks.createdAt,
      updatedAt: blocks.updatedAt,
      model: {
        id: models.id,
        displayName: models.displayName,
        providerId: models.providerId,
        type: models.type,
        costPerRun: models.costPerRun,
        isActive: models.isActive,
        config: models.config,
      },
    })
    .from(blocks)
    .innerJoin(models, eq(blocks.modelId, models.id))
    .where(whereClause)
    .orderBy(blocks.createdAt)
    .limit(limit)
    .offset(offset);
}

function fetchTotalCount(db: DbClient, whereClause: any) {
  return db
    .select({ count: sql<number>`count(*)::int` })
    .from(blocks)
    .where(whereClause);
}

export const listBlocks = async (db: DbClient, filters: ListBlocksInput) => {
  const { page = 1, limit = 20 } = filters;
  const offset = (page - 1) * limit;

  const whereClause = buildWhereClause(filters);

  const [rows, countResult] = await Promise.all([
    fetchBlocks(db, whereClause, offset, limit),
    fetchTotalCount(db, whereClause),
  ]);

  const totalResults = countResult[0]?.count ?? 0;

  const blocksData = rows.map(({ model, ...rest }) => ({
    ...rest,
    modelId: model,
  }));

  return {
    blocks: blocksData,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(totalResults / limit),
      totalResults,
    },
  };
};
