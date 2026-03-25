import { eq } from "drizzle-orm";
import type { DbClient } from "../../db/index";
import { models } from "../../schemas";

export const deleteModelRecord = async (db: DbClient, id: string) => {
	const [deleted] = await db
		.delete(models)
		.where(eq(models.id, id))
		.returning();
	return deleted ?? null;
};
