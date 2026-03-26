import { eq, sql } from "drizzle-orm";
import type { DbClient } from "../../db/index";
import { models } from "../../schemas";
import type { ListModelsInput } from "../../validators/model";

const listModels = async (db: DbClient, filters: ListModelsInput) => {
	const { limit, offset, isActive, type } = filters;

	const conditions = [];
	if (isActive !== undefined) conditions.push(eq(models.isActive, isActive));
	if (type !== undefined) conditions.push(eq(models.type, type));

	const whereClause =
		conditions.length > 0
			? conditions.reduce((acc, cond) => sql`${acc} AND ${cond}`)
			: undefined;

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

	return {
		data,
		pagination: {
			total: countResult[0]?.count ?? 0,
			limit,
			offset,
		},
	};
};

export default listModels;
