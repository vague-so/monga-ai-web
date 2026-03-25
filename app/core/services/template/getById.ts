import { eq } from "drizzle-orm";
import type { DbClient } from "../../db/index";
import { templates } from "../../schemas";

export const getTemplateById = async (db: DbClient, id: string) => {
	const [template] = await db
		.select()
		.from(templates)
		.where(eq(templates.id, id))
		.limit(1);
	return template ?? null;
};
