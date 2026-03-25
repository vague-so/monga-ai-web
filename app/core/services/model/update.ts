import { eq } from "drizzle-orm";
import type { DbClient } from "../../db/index";
import { models } from "../../schemas";
import type { NewModel } from "../../schemas";

export type ModelPatch = Partial<
	Omit<NewModel, "id" | "createdAt" | "updatedAt">
>;

export const updateModelRecord = async (
	db: DbClient,
	id: string,
	input: ModelPatch,
) => {
	const [updated] = await db
		.update(models)
		.set({ ...input, updatedAt: new Date() })
		.where(eq(models.id, id))
		.returning();
	return updated ?? null;
};
