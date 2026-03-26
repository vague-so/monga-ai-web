import { StatusCodes } from "http-status-codes";
import { createDb } from "../../db/index";
import { findGenerationById } from "../../services/generation/getById";
import { ok, fail } from "../../lib/response";
import { handleError } from "../../lib/handleError";

export const getGeneration = async (
	_request: Request,
	env: Env,
	id: string,
): Promise<Response> => {
	try {
		const generation = await findGenerationById(createDb(env.DATABASE_URL), id);
		if (!generation) return fail("Generation not found", StatusCodes.NOT_FOUND);
		return ok(generation);
	} catch (err) {
		return handleError(err);
	}
};
