import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import type { DbClient } from "../../db/index";
import { models } from "../../schemas";
import type { NewModel } from "../../schemas";
import { AppError } from "../../lib/AppError";

export type ModelPatch = Partial<
	Omit<NewModel, "id" | "createdAt" | "updatedAt">
>;

export const updateModelRecord = async (
	db: DbClient,
	id: string,
	input: ModelPatch,
) => {
	const existing = await db
		.select({ id: models.id })
		.from(models)
		.where(eq(models.id, id))
		.limit(1);

	if (existing.length === 0) {
		throw new AppError("Model not found", StatusCodes.NOT_FOUND);
	}

	const [updated] = await db
		.update(models)
		.set({ ...input, updatedAt: new Date() })
		.where(eq(models.id, id))
		.returning();

	return updated;
};
