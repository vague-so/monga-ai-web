import { and, eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

import type { DbClient } from "../../db/index";

import { models } from "../../schemas";
import type { NewModel } from "../../schemas";

import { AppError } from "../../lib/AppError";

export const insertModel = async (db: DbClient, input: NewModel) => {
	const existing = await db
		.select()
		.from(models)
		.where(
			and(
				eq(models.providerId, input.providerId),
				eq(models.modelId, input.modelId),
			),
		)
		.limit(1);

	if (existing.length > 0) {
		throw new AppError(`Model already exists with providerId: ${input.providerId} and modelId: ${input.modelId}`, StatusCodes.CONFLICT);
	}

	const [created] = await db.insert(models).values(input).returning();
	return created;
};
