import { eq } from "drizzle-orm";
import type { DbClient } from "../../db/index";
import { blockDefinitions } from "../../schemas";

export const deleteBlockDefinition = async (db: DbClient, id: string) => {
	const [deleted] = await db
		.delete(blockDefinitions)
		.where(eq(blockDefinitions.id, id))
		.returning();
	return deleted ?? null;
};
