import { createDb } from "../../db/index";
import { findGenerationById } from "../../services/generation/getById";
import { ok, fail } from "../../lib/response";

export const getGeneration = async (
	_request: Request,
	env: Env,
	id: string,
): Promise<Response> => {
	const generation = await findGenerationById(createDb(env.DATABASE_URL), id);
	if (!generation) return fail("Generation not found", 404);
	return ok(generation);
};
