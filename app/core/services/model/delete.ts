import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import type { DbClient } from "../../db/index";
import { models } from "../../schemas";
import { AppError } from "../../lib/AppError";

export const deleteModelRecord = async (db: DbClient, id: string) => {
	const existing = await db
		.select({ id: models.id })
		.from(models)
		.where(eq(models.id, id))
		.limit(1);

	if (existing.length === 0) {
		throw new AppError("Model not found", StatusCodes.NOT_FOUND);
	}

	const [deleted] = await db
		.delete(models)
		.where(eq(models.id, id))
		.returning();

	return deleted;
};
