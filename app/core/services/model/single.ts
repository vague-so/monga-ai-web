import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import type { DbClient } from "../../db/index";
import { models } from "../../schemas";
import { AppError } from "../../lib/AppError";

const singleModel = async (db: DbClient, id: string) => {
	const [model] = await db
		.select()
		.from(models)
		.where(eq(models.id, id))
		.limit(1);

	if (!model) {
		throw new AppError("Model not found", StatusCodes.NOT_FOUND);
	}

	return model;
};

export default singleModel;
