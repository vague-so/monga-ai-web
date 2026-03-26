import type { DbClient } from "../../db/index";
import { templates } from "../../schemas";

export const getAllTemplates = async (db: DbClient) => {
	return db.select().from(templates).orderBy(templates.createdAt);
};
