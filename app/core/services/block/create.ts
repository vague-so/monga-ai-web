import type { DbClient } from "../../db/index";
import { blockDefinitions } from "../../schemas";
import type { NewBlockDefinition } from "../../schemas";

export const createBlockDefinition = async (
	db: DbClient,
	input: NewBlockDefinition,
) => {
	const [created] = await db
		.insert(blockDefinitions)
		.values(input)
		.returning();
	return created;
};
