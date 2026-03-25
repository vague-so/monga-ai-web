import { eq } from "drizzle-orm";
import type { DbClient } from "../../db/index";
import { generations } from "../../schemas";

export const findGenerationById = async (db: DbClient, id: string) => {
	const [generation] = await db
		.select()
		.from(generations)
		.where(eq(generations.id, id))
		.limit(1);
	return generation ?? null;
};
