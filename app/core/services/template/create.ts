import type { DbClient } from "../../db/index";
import { templates } from "../../schemas";
import type { NewTemplate } from "../../schemas";

export const insertTemplate = async (db: DbClient, input: NewTemplate) => {
	const [created] = await db.insert(templates).values(input).returning();
	return created;
};
