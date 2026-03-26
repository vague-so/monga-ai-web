import type { DbClient } from "../../db/index";
import { blockDefinitions } from "../../schemas";

export const getAllBlockDefinitions = async (db: DbClient) => {
	return db
		.select()
		.from(blockDefinitions)
		.orderBy(blockDefinitions.createdAt);
};
