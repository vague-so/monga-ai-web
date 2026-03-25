import type { DbClient } from "../../db/index";
import { models } from "../../schemas";
import type { NewModel } from "../../schemas";

export const insertModel = async (db: DbClient, input: NewModel) => {
	const [created] = await db.insert(models).values(input).returning();
	return created;
};
