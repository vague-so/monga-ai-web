import { eq } from "drizzle-orm";
import type { DbClient } from "../../db/index";
import { blockDefinitions } from "../../schemas";
import type { NewBlockDefinition } from "../../schemas";

export type BlockDefinitionPatch = Partial<
	Omit<NewBlockDefinition, "id" | "createdAt">
>;

export const updateBlockDefinition = async (
	db: DbClient,
	id: string,
	input: BlockDefinitionPatch,
) => {
	const [updated] = await db
		.update(blockDefinitions)
		.set(input)
		.where(eq(blockDefinitions.id, id))
		.returning();
	return updated ?? null;
};
