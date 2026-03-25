import { eq } from "drizzle-orm";
import type { DbClient } from "../../db/index";
import { templates } from "../../schemas";

export const deleteTemplateRecord = async (db: DbClient, id: string) => {
	const [deleted] = await db
		.delete(templates)
		.where(eq(templates.id, id))
		.returning();
	return deleted ?? null;
};
