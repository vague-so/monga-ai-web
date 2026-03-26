import { eq } from "drizzle-orm";
import type { DbClient } from "../../db/index";
import { models } from "../../schemas";

export const getModelById = async (db: DbClient, id: string) => {
	const [model] = await db
		.select()
		.from(models)
		.where(eq(models.id, id))
		.limit(1);
	return model ?? null;
};
