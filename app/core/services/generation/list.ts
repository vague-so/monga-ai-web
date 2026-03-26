import { eq, desc } from "drizzle-orm";
import type { DbClient } from "../../db/index";
import { generations } from "../../schemas";
import type { GenerationStatus } from "../../schemas";

export const getGenerations = async (
	db: DbClient,
	opts: { status?: GenerationStatus; limit: number; offset: number },
) => {
	const query = db
		.select()
		.from(generations)
		.orderBy(desc(generations.createdAt))
		.limit(opts.limit)
		.offset(opts.offset);

	if (opts.status) {
		return query.where(eq(generations.status, opts.status));
	}

	return query;
};
