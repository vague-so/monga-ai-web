import type { DbClient } from "../../db/index";
import { models } from "../../schemas";

export const getAllModels = async (db: DbClient) => {
	return db.select().from(models).orderBy(models.createdAt);
};
