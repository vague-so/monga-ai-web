import type { DbClient } from "../../db/index";
import { generations } from "../../schemas";
import type { NewGeneration } from "../../schemas";

export const insertGeneration = async (db: DbClient, input: NewGeneration) => {
	const [created] = await db.insert(generations).values(input).returning();
	return created;
};
